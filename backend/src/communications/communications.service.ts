import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import * as bcrypt from "bcrypt";
import { randomInt } from "node:crypto";

import { PrismaService } from "../prisma/prisma.service.js";
import { ConfigService } from "@nestjs/config";
import { CreateCommunicationContactDto } from "./dto/create-communication-contact.dto.js";
import { SchoolEmailService } from "./school-email.service.js";
import { SendSchoolCommunicationDto } from "./dto/send-school-communication.dto.js";
import {
  SaveSchoolCommunicationDraftDto,
  SendSchoolCommunicationTestDto,
} from "./dto/save-school-communication-draft.dto.js";
import {
  CommunicationContentDocument,
  CommunicationFormat,
  plainTextFromDocument,
  renderSchoolCommunication,
  normalizeCommunicationFormat,
  validateCommunicationDocument,
} from "./email-templates/communication-content.js";

type ContactOwnerType = "PARENT" | "TEACHER" | "STUDENT" | "ALUMNI";

type Actor = {
  id: string;
  roles?: string[];
};

type RecipientCandidate = {
  recipientType: "PARENT" | "STUDENT" | "TEACHER" | "ALUMNI";
  recipientId: string;
  portalUserId?: string;
  contactId?: string;
  emailAddress?: string;
};

@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);
  private readonly verificationLifetimeMs = 15 * 60 * 1000;
  private readonly verificationResendCooldownMs = 60 * 1000;
  private readonly maximumVerificationAttempts = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: SchoolEmailService,
    private readonly config: ConfigService,
  ) {}

  async syncProfileEmail(
    ownerType: Extract<ContactOwnerType, "PARENT" | "TEACHER">,
    ownerId: string,
    email?: string | null,
    createdByUserId?: string,
  ) {
    const value = email?.trim();

    // Existing registration must never fail merely because a communication
    // address is absent or malformed. The profile remains registered and the
    // Director can correct/add a contact later.
    if (!value || !this.isEmail(value.toLowerCase())) {
      return null;
    }

    return this.upsertEmailContact(
      {
        ownerType,
        ownerId,
        value,
        isPrimary: true,
      },
      createdByUserId,
    );
  }

  /**
   * Starts the proof-of-email step used before a new guardian or teacher
   * profile exists. The resulting verification id is supplied with the final
   * registration payload; it is never a portal-login credential.
   */
  async requestRegistrationEmailVerification(
    ownerType: Extract<ContactOwnerType, "PARENT" | "TEACHER">,
    email: string,
  ) {
    const value = email.trim();
    const normalizedEmail = value.toLowerCase();
    if (!this.isEmail(normalizedEmail)) {
      throw new BadRequestException(
        "Provide a valid communication email address.",
      );
    }

    const code = String(randomInt(100000, 1_000_000));
    const verification = await this.prisma.registrationEmailVerification.create(
      {
        data: {
          ownerType,
          email: value,
          normalizedEmail,
          verificationCodeHash: await bcrypt.hash(code, 12),
          verificationExpiresAt: new Date(
            Date.now() + this.verificationLifetimeMs,
          ),
          verificationDeliveryStatus: "PENDING",
        },
      },
    );

    const delivery = await this.email.sendTextEmail({
      to: value,
      subject: "Verify your Mpumudde High School communication email",
      text: `Your Mpumudde High School verification code is ${code}. It expires in 15 minutes. This email will be used for official school communication, not for portal login.`,
    });

    const updated = await this.prisma.registrationEmailVerification.update({
      where: { id: verification.id },
      data: {
        verificationDeliveryStatus: delivery.status,
        verificationDeliveryError: delivery.error ?? null,
      },
    });

    return {
      id: updated.id,
      ownerType: updated.ownerType,
      email: updated.email,
      isVerified: false,
      deliveryStatus: updated.verificationDeliveryStatus,
    };
  }

  async confirmRegistrationEmailVerification(id: string, code: string) {
    const verification =
      await this.prisma.registrationEmailVerification.findUnique({
        where: { id },
      });
    if (!verification || verification.usedAt) {
      throw new NotFoundException(
        "Registration email verification was not found.",
      );
    }
    if (
      !verification.verificationCodeHash ||
      !verification.verificationExpiresAt ||
      verification.verificationExpiresAt <= new Date()
    ) {
      throw new BadRequestException(
        "This verification code has expired. Send another code.",
      );
    }
    if (verification.verificationAttempts >= this.maximumVerificationAttempts) {
      throw new HttpException(
        "Too many incorrect codes. Send another verification code.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (
      !(await bcrypt.compare(code.trim(), verification.verificationCodeHash))
    ) {
      await this.prisma.registrationEmailVerification.update({
        where: { id },
        data: { verificationAttempts: { increment: 1 } },
      });
      throw new BadRequestException("The verification code is incorrect.");
    }

    const verified = await this.prisma.registrationEmailVerification.update({
      where: { id },
      data: {
        verifiedAt: new Date(),
        verificationCodeHash: null,
        verificationExpiresAt: null,
        verificationAttempts: 0,
        verificationDeliveryStatus: "VERIFIED",
        verificationDeliveryError: null,
      },
    });

    return {
      id: verified.id,
      ownerType: verified.ownerType,
      email: verified.email,
      isVerified: true,
      verifiedAt: verified.verifiedAt,
    };
  }

  async assertVerifiedRegistrationEmail(
    verificationId: string | undefined,
    ownerType: Extract<ContactOwnerType, "PARENT" | "TEACHER">,
    email: string | null | undefined,
  ) {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !this.isEmail(normalizedEmail)) {
      throw new BadRequestException(
        "A verified communication email is required.",
      );
    }
    if (!verificationId) {
      throw new BadRequestException(
        "Verify the communication email before continuing.",
      );
    }
    const verification =
      await this.prisma.registrationEmailVerification.findFirst({
        where: {
          id: verificationId,
          ownerType,
          normalizedEmail,
          verifiedAt: { not: null },
          usedAt: null,
        },
      });
    if (!verification) {
      throw new BadRequestException(
        "This communication email has not been verified for this registration. Verify it again before continuing.",
      );
    }
    return verification;
  }

  async finalizeVerifiedRegistrationEmail(
    verificationId: string,
    ownerType: Extract<ContactOwnerType, "PARENT" | "TEACHER">,
    ownerId: string,
    email: string,
    createdByUserId?: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.registrationEmailVerification.updateMany({
        where: {
          id: verificationId,
          ownerType,
          normalizedEmail,
          verifiedAt: { not: null },
          usedAt: null,
        },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) {
        throw new BadRequestException(
          "The communication email verification is no longer available. Verify the email again.",
        );
      }

      return this.upsertEmailContactWithClient(
        tx,
        {
          ownerType,
          ownerId,
          value: email,
          isPrimary: true,
          isVerified: true,
        },
        createdByUserId,
      );
    });
  }

  async createContact(dto: CreateCommunicationContactDto, actor: Actor) {
    this.assertDirector(actor);

    const kind = dto.kind ?? "EMAIL";

    if (kind !== "EMAIL") {
      throw new BadRequestException(
        "Only email contacts can be verified in this first phase.",
      );
    }

    await this.assertOwnerExists(dto.ownerType, dto.ownerId);

    return this.upsertEmailContact(
      {
        ownerType: dto.ownerType,
        ownerId: dto.ownerId,
        value: dto.value,
        label: dto.label,
        isPrimary: dto.isPrimary ?? true,
      },
      actor.id,
    );
  }

  async listForOwner(
    ownerType: ContactOwnerType,
    ownerId: string,
    actor: Actor,
  ) {
    this.assertKnownOwnerType(ownerType);

    await this.assertCanAccessOwner(ownerType, ownerId, actor);

    return this.prisma.communicationContact.findMany({
      where: {
        ownerType,
        ownerId,
        isActive: true,
      },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    });
  }

  async listMyContacts(actor: Actor) {
    const contacts: Array<{
      ownerType: ContactOwnerType;
      ownerId: string;
    }> = [];

    const [parent, teacher] = await Promise.all([
      this.prisma.parent.findUnique({
        where: { userId: actor.id },
        select: { id: true },
      }),
      this.prisma.teacher.findUnique({
        where: { userId: actor.id },
        select: { id: true },
      }),
    ]);

    if (parent) {
      contacts.push({
        ownerType: "PARENT",
        ownerId: parent.id,
      });
    }

    if (teacher) {
      contacts.push({
        ownerType: "TEACHER",
        ownerId: teacher.id,
      });
    }

    if (!contacts.length) {
      return [];
    }

    return this.prisma.communicationContact.findMany({
      where: {
        isActive: true,
        OR: contacts,
      },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    });
  }

  async requestVerification(contactId: string, actor: Actor) {
    const contact = await this.getAccessibleContact(contactId, actor);

    if (contact.kind !== "EMAIL") {
      throw new BadRequestException(
        "Only email contacts can be verified in this first phase.",
      );
    }

    if (contact.isVerified) {
      return {
        contact,
        deliveryStatus: "ALREADY_VERIFIED" as const,
      };
    }

    if (
      contact.verificationRequestedAt &&
      Date.now() - contact.verificationRequestedAt.getTime() <
        this.verificationResendCooldownMs
    ) {
      throw new HttpException(
        "Wait one minute before requesting another verification code.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = String(randomInt(100000, 1_000_000));
    const codeHash = await bcrypt.hash(code, 12);
    const expiresAt = new Date(Date.now() + this.verificationLifetimeMs);

    const pending = await this.prisma.communicationContact.update({
      where: { id: contact.id },
      data: {
        verificationCodeHash: codeHash,
        verificationExpiresAt: expiresAt,
        verificationAttempts: 0,
        verificationRequestedAt: new Date(),
        verificationDeliveryStatus: "PENDING",
        verificationDeliveryError: null,
      },
    });

    const delivery = await this.email.sendTextEmail({
      to: pending.value,
      subject: "Verify your Mpumudde High School communication email",
      text: `Your Mpumudde High School verification code is ${code}. It expires in 15 minutes. If you did not request this code, you can ignore this email.`,
    });

    const updated = await this.prisma.communicationContact.update({
      where: { id: pending.id },
      data: {
        verificationDeliveryStatus: delivery.status,
        verificationDeliveryError: delivery.error ?? null,
      },
    });

    return {
      contact: updated,
      deliveryStatus: delivery.status,
    };
  }

  async confirmVerification(contactId: string, code: string, actor: Actor) {
    const contact = await this.getAccessibleContact(contactId, actor);

    if (contact.kind !== "EMAIL") {
      throw new BadRequestException(
        "Only email contacts can be verified in this first phase.",
      );
    }

    if (contact.isVerified) {
      return contact;
    }

    if (
      !contact.verificationCodeHash ||
      !contact.verificationExpiresAt ||
      contact.verificationExpiresAt <= new Date()
    ) {
      throw new BadRequestException(
        "This verification code has expired. Request a new code.",
      );
    }

    if (contact.verificationAttempts >= this.maximumVerificationAttempts) {
      throw new HttpException(
        "Too many incorrect codes. Request a new verification code.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const valid = await bcrypt.compare(
      code.trim(),
      contact.verificationCodeHash,
    );

    if (!valid) {
      await this.prisma.communicationContact.update({
        where: { id: contact.id },
        data: {
          verificationAttempts: {
            increment: 1,
          },
        },
      });

      throw new BadRequestException("The verification code is incorrect.");
    }

    return this.prisma.communicationContact.update({
      where: { id: contact.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verificationCodeHash: null,
        verificationExpiresAt: null,
        verificationAttempts: 0,
        verificationDeliveryStatus: "VERIFIED",
        verificationDeliveryError: null,
      },
    });
  }

  async listSchoolCommunications() {
    return this.prisma.schoolCommunication.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { sentAt: "desc" },
      take: 100,
      include: {
        sender: { select: { id: true, email: true } },
        _count: { select: { recipients: true } },
      },
    });
  }

  async listPortalCommunicationInbox(actor: Actor) {
    const deliveries = await this.prisma.communicationRecipient.findMany({
      where: {
        portalUserId: actor.id,
        communication: { status: "SENT" },
      },
      orderBy: [{ communication: { sentAt: "desc" } }, { createdAt: "desc" }],
      select: {
        portalStatus: true,
        communication: {
          select: {
            id: true,
            subject: true,
            message: true,
            format: true,
            contentDocument: true,
            sentAt: true,
          },
        },
        portalNotification: {
          select: { id: true, isRead: true, readAt: true },
        },
      },
    });

    return deliveries.map((delivery) => ({
      ...delivery.communication,
      portalStatus: delivery.portalStatus,
      notification: delivery.portalNotification,
    }));
  }

  async getPortalCommunication(id: string, actor: Actor) {
    const delivery = await this.prisma.communicationRecipient.findFirst({
      where: {
        communicationId: id,
        portalUserId: actor.id,
        communication: { status: "SENT" },
      },
      select: {
        portalStatus: true,
        communication: {
          select: {
            id: true,
            subject: true,
            message: true,
            format: true,
            contentDocument: true,
            sentAt: true,
          },
        },
        portalNotification: {
          select: { id: true, isRead: true, readAt: true },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException(
        "This communication is not available in your portal.",
      );
    }

    const readAt = delivery.portalNotification?.isRead
      ? delivery.portalNotification.readAt
      : new Date();
    if (delivery.portalNotification && !delivery.portalNotification.isRead) {
      await this.prisma.$transaction([
        this.prisma.notification.updateMany({
          where: { id: delivery.portalNotification.id, userId: actor.id },
          data: { isRead: true, readAt },
        }),
        this.prisma.communicationRecipient.updateMany({
          where: { communicationId: id, portalUserId: actor.id },
          data: { portalStatus: "READ" },
        }),
      ]);
    }

    return {
      ...delivery.communication,
      portalStatus: delivery.portalNotification?.isRead
        ? delivery.portalStatus
        : "READ",
      notification: delivery.portalNotification
        ? { ...delivery.portalNotification, isRead: true, readAt }
        : null,
    };
  }

  async listSchoolCommunicationDrafts(actor: Actor) {
    this.assertDirector(actor);
    return this.prisma.schoolCommunication.findMany({
      where: { senderUserId: actor.id, status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: { _count: { select: { recipients: true } } },
    });
  }

  async getSchoolCommunication(id: string) {
    const communication = await this.prisma.schoolCommunication.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, email: true } },
        recipients: {
          orderBy: { createdAt: "asc" },
          include: {
            communicationContact: {
              select: { id: true, value: true, isVerified: true },
            },
            portalNotification: {
              select: { id: true, isRead: true, readAt: true },
            },
          },
        },
        _count: { select: { recipients: true } },
      },
    });
    if (!communication)
      throw new NotFoundException("School communication not found.");
    return communication;
  }

  async saveSchoolCommunicationDraft(
    dto: SaveSchoolCommunicationDraftDto,
    actor: Actor,
    id?: string,
  ) {
    this.assertDirector(actor);
    const prepared = this.prepareCommunication(dto);
    const data = {
      subject: prepared.subject,
      message: prepared.message,
      format: prepared.format,
      contentDocument: prepared.document as any,
      templateVersion: "mhs-email-v1",
      audience: dto.audience,
      targeting: {
        classId: dto.classId ?? null,
        studentIds: dto.studentIds ?? [],
        teacherIds: dto.teacherIds ?? [],
      },
      status: "DRAFT",
      sentAt: null,
    };
    if (!id) {
      return this.prisma.schoolCommunication.create({
        data: { senderUserId: actor.id, ...data },
      });
    }
    const changed = await this.prisma.schoolCommunication.updateMany({
      where: { id, senderUserId: actor.id, status: "DRAFT" },
      data,
    });
    if (changed.count !== 1)
      throw new BadRequestException("Only your unsent drafts can be edited.");
    return this.getSchoolCommunication(id);
  }

  async sendDraftSchoolCommunication(id: string, actor: Actor) {
    this.assertDirector(actor);
    const draft = await this.prisma.schoolCommunication.findFirst({
      where: { id, senderUserId: actor.id, status: "DRAFT" },
    });
    if (!draft)
      throw new NotFoundException(
        "An unsent communication draft was not found.",
      );
    const claimed = await this.prisma.schoolCommunication.updateMany({
      where: { id, senderUserId: actor.id, status: "DRAFT" },
      data: { status: "SENDING" },
    });
    if (claimed.count !== 1)
      throw new BadRequestException(
        "This draft is already being sent or was changed.",
      );
    try {
      return await this.sendSchoolCommunication(
        {
          audience: draft.audience as SendSchoolCommunicationDto["audience"],
          subject: draft.subject,
          message: draft.message,
          format: draft.format as CommunicationFormat,
          contentDocument:
            (draft.contentDocument as Record<string, unknown> | null) ??
            undefined,
          ...(this.targetingToDto(draft.targeting) ?? {}),
        },
        actor,
        id,
      );
    } catch (error) {
      await this.prisma.schoolCommunication.updateMany({
        where: { id, status: "SENDING" },
        data: { status: "DRAFT" },
      });
      throw error;
    }
  }

  async sendSchoolCommunication(
    dto: SendSchoolCommunicationDto,
    actor: Actor,
    existingDraftId?: string,
  ) {
    this.assertDirector(actor);
    const prepared = this.prepareCommunication(dto);
    const candidates = await this.resolveRecipients(dto);
    if (!candidates.length)
      throw new BadRequestException(
        "No active recipients match the selected audience and filters.",
      );
    const now = new Date();
    const rendered = renderSchoolCommunication({
      subject: prepared.subject,
      format: prepared.format,
      document: prepared.document,
      fallbackMessage: prepared.message,
      ...this.emailBrandOptions(),
    });

    const communication = await this.prisma.$transaction(async (tx) => {
      const data = {
        subject: prepared.subject,
        message: prepared.message,
        format: prepared.format,
        contentDocument: prepared.document as any,
        templateVersion: "mhs-email-v1",
        audience: dto.audience,
        targeting: {
          classId: dto.classId ?? null,
          studentIds: dto.studentIds ?? [],
          teacherIds: dto.teacherIds ?? [],
        },
        status: "SENT",
        sentAt: now,
      };
      const created = existingDraftId
        ? await tx.schoolCommunication.update({
            where: { id: existingDraftId },
            data,
          })
        : await tx.schoolCommunication.create({
            data: { senderUserId: actor.id, ...data },
          });
      for (const candidate of candidates) {
        const portalLink =
          candidate.recipientType === "TEACHER"
            ? `/teacher/messages/${created.id}`
            : candidate.recipientType === "PARENT"
              ? `/parent/messages/${created.id}`
              : undefined;
        const notification = candidate.portalUserId
          ? await tx.notification.create({
              data: {
                userId: candidate.portalUserId,
                type: "SCHOOL_COMMUNICATION",
                title: prepared.subject,
                message: prepared.message,
                entityType: "SchoolCommunication",
                entityId: created.id,
                link: portalLink,
              },
            })
          : null;
        await tx.communicationRecipient.create({
          data: {
            communicationId: created.id,
            recipientType: candidate.recipientType,
            recipientId: candidate.recipientId,
            portalUserId: candidate.portalUserId,
            communicationContactId: candidate.contactId,
            emailAddress: candidate.emailAddress,
            portalNotificationId: notification?.id,
            portalStatus: notification ? "DELIVERED" : "NOT_APPLICABLE",
            emailStatus: candidate.emailAddress
              ? "PENDING"
              : "NO_VERIFIED_CONTACT",
            deliveredAt: notification ? now : null,
          },
        });
      }
      return created;
    });

    const saved = await this.getSchoolCommunication(communication.id);
    void this.deliverCommunicationEmails(
      communication.id,
      prepared.subject,
      rendered,
      candidates,
    ).catch((error: unknown) => {
      const detail =
        error instanceof Error
          ? error.message
          : "Unknown email delivery error.";
      this.logger.error(
        `Email delivery follow-up failed for communication ${communication.id}: ${detail}`,
      );
    });
    return saved;
  }

  async previewSchoolCommunication(dto: SendSchoolCommunicationDto) {
    const candidates = await this.resolveRecipients(dto);
    const deliveryByRecipientType = (
      ["PARENT", "STUDENT", "TEACHER", "ALUMNI"] as const
    )
      .map((recipientType) => {
        const group = candidates.filter(
          (candidate) => candidate.recipientType === recipientType,
        );
        return {
          recipientType,
          totalRecipients: group.length,
          portalRecipients: group.filter((candidate) =>
            Boolean(candidate.portalUserId),
          ).length,
          verifiedEmailRecipients: group.filter((candidate) =>
            Boolean(candidate.emailAddress),
          ).length,
          withoutAnyDelivery: group.filter(
            (candidate) => !candidate.portalUserId && !candidate.emailAddress,
          ).length,
        };
      })
      .filter((group) => group.totalRecipients > 0);
    return {
      totalRecipients: candidates.length,
      portalRecipients: candidates.filter((candidate) =>
        Boolean(candidate.portalUserId),
      ).length,
      verifiedEmailRecipients: new Set(
        candidates
          .map((candidate) => candidate.emailAddress?.trim().toLowerCase())
          .filter(Boolean),
      ).size,
      withoutVerifiedEmail: candidates.filter(
        (candidate) => !candidate.emailAddress,
      ).length,
      withoutAnyDelivery: candidates.filter(
        (candidate) => !candidate.portalUserId && !candidate.emailAddress,
      ).length,
      deliveryByRecipientType,
    };
  }

  async renderSchoolCommunicationPreview(
    dto: SendSchoolCommunicationDto,
    actor: Actor,
  ) {
    this.assertDirector(actor);
    const prepared = this.prepareCommunication(dto);
    return renderSchoolCommunication({
      subject: prepared.subject,
      format: prepared.format,
      document: prepared.document,
      fallbackMessage: prepared.message,
      ...this.emailBrandOptions(),
    });
  }

  async sendSchoolCommunicationTest(
    dto: SendSchoolCommunicationTestDto,
    actor: Actor,
  ) {
    this.assertDirector(actor);
    const recipient = dto.to.trim().toLowerCase();
    if (!this.isEmail(recipient))
      throw new BadRequestException("Provide a valid test email address.");
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const count = await this.prisma.communicationTestEmail.count({
      where: { senderUserId: actor.id, createdAt: { gte: since } },
    });
    if (count >= 5)
      throw new HttpException(
        "You can send up to five test emails per hour.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    const prepared = this.prepareCommunication(dto);
    const rendered = renderSchoolCommunication({
      subject: prepared.subject,
      format: prepared.format,
      document: prepared.document,
      fallbackMessage: prepared.message,
      isTest: true,
      ...this.emailBrandOptions(),
    });
    const delivery = await this.email.sendEmail({
      to: recipient,
      subject: `[TEST] ${prepared.subject}`,
      text: `TEST EMAIL — not sent to the selected audience.\n\n${rendered.text}`,
      html: rendered.html,
    });
    await this.prisma.communicationTestEmail.create({
      data: {
        senderUserId: actor.id,
        recipientEmail: recipient,
        status: delivery.status,
        error: delivery.error ?? null,
      },
    });
    return {
      status: delivery.status,
      error: delivery.error,
      message:
        "The test email was not sent to the selected audience and is not included in official delivery history.",
    };
  }

  private emailBrandOptions() {
    const logoUrl = this.config.get<string>("SCHOOL_EMAIL_LOGO_URL")?.trim();
    if (!logoUrl || !logoUrl.startsWith("https://")) return {};
    return { logoUrl };
  }
  private prepareCommunication(dto: {
    subject: string;
    message?: string;
    format?: string;
    contentDocument?: unknown;
  }) {
    const subject = dto.subject?.trim();
    if (!subject) throw new BadRequestException("A subject is required.");
    let format: CommunicationFormat;
    let document: CommunicationContentDocument | undefined;
    try {
      format = normalizeCommunicationFormat(dto.format);
      document = dto.contentDocument
        ? validateCommunicationDocument(dto.contentDocument)
        : undefined;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : "The communication content is invalid.",
      );
    }
    const message = document
      ? plainTextFromDocument(document)
      : dto.message?.trim();
    if (!message)
      throw new BadRequestException(
        "Write a message or add structured communication content.",
      );
    return { subject, format, document, message };
  }

  private targetingToDto(targeting: unknown) {
    if (!targeting || typeof targeting !== "object" || Array.isArray(targeting))
      return undefined;
    const value = targeting as {
      classId?: unknown;
      studentIds?: unknown;
      teacherIds?: unknown;
    };
    return {
      ...(typeof value.classId === "string" ? { classId: value.classId } : {}),
      ...(Array.isArray(value.studentIds)
        ? {
            studentIds: value.studentIds.filter(
              (id): id is string => typeof id === "string",
            ),
          }
        : {}),
      ...(Array.isArray(value.teacherIds)
        ? {
            teacherIds: value.teacherIds.filter(
              (id): id is string => typeof id === "string",
            ),
          }
        : {}),
    };
  }
  private async upsertEmailContact(
    input: {
      ownerType: ContactOwnerType;
      ownerId: string;
      value: string;
      label?: string;
      isPrimary?: boolean;
    },
    createdByUserId?: string,
  ) {
    const value = input.value.trim();
    const normalizedValue = value.toLowerCase();

    if (!this.isEmail(normalizedValue)) {
      throw new BadRequestException(
        "Provide a valid communication email address.",
      );
    }

    return this.prisma.$transaction((tx) =>
      this.upsertEmailContactWithClient(tx, input, createdByUserId),
    );
  }

  private async upsertEmailContactWithClient(
    tx: any,
    input: {
      ownerType: ContactOwnerType;
      ownerId: string;
      value: string;
      label?: string;
      isPrimary?: boolean;
      isVerified?: boolean;
    },
    createdByUserId?: string,
  ) {
    const value = input.value.trim();
    const normalizedValue = value.toLowerCase();

    if (!this.isEmail(normalizedValue)) {
      throw new BadRequestException(
        "Provide a valid communication email address.",
      );
    }

    if (input.isPrimary) {
      await tx.communicationContact.updateMany({
        where: {
          ownerType: input.ownerType,
          ownerId: input.ownerId,
          kind: "EMAIL",
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return tx.communicationContact.upsert({
      where: {
        ownerType_ownerId_kind_normalizedValue: {
          ownerType: input.ownerType,
          ownerId: input.ownerId,
          kind: "EMAIL",
          normalizedValue,
        },
      },
      create: {
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        kind: "EMAIL",
        value,
        normalizedValue,
        label: input.label,
        isPrimary: input.isPrimary ?? true,
        createdByUserId,
        ...(input.isVerified
          ? {
              isVerified: true,
              verifiedAt: new Date(),
              verificationDeliveryStatus: "VERIFIED",
            }
          : {}),
      },
      update: {
        value,
        label: input.label,
        isPrimary: input.isPrimary ?? true,
        isActive: true,
        ...(input.isVerified
          ? {
              isVerified: true,
              verifiedAt: new Date(),
              verificationCodeHash: null,
              verificationExpiresAt: null,
              verificationAttempts: 0,
              verificationDeliveryStatus: "VERIFIED",
              verificationDeliveryError: null,
            }
          : {}),
      },
    });
  }

  private async getAccessibleContact(contactId: string, actor: Actor) {
    const contact = await this.prisma.communicationContact.findUnique({
      where: { id: contactId },
    });

    if (!contact || !contact.isActive) {
      throw new NotFoundException("Communication contact not found.");
    }

    await this.assertCanAccessOwner(
      contact.ownerType as ContactOwnerType,
      contact.ownerId,
      actor,
    );

    return contact;
  }

  private async assertCanAccessOwner(
    ownerType: ContactOwnerType,
    ownerId: string,
    actor: Actor,
  ) {
    if (actor.roles?.includes("SUPER_ADMIN")) {
      return;
    }

    const ownerUserId = await this.ownerUserId(ownerType, ownerId);

    if (!ownerUserId || ownerUserId !== actor.id) {
      throw new ForbiddenException(
        "You cannot access this communication contact.",
      );
    }
  }

  private assertDirector(actor: Actor) {
    if (!actor.roles?.includes("SUPER_ADMIN")) {
      throw new ForbiddenException(
        "Only the Director can manage another person's communication contact.",
      );
    }
  }

  private async assertOwnerExists(
    ownerType: ContactOwnerType,
    ownerId: string,
  ) {
    this.assertKnownOwnerType(ownerType);

    const exists =
      ownerType === "PARENT"
        ? await this.prisma.parent.count({
            where: {
              id: ownerId,
              isActive: true,
            },
          })
        : ownerType === "TEACHER"
          ? await this.prisma.teacher.count({
              where: {
                id: ownerId,
              },
            })
          : ownerType === "STUDENT"
            ? await this.prisma.student.count({
                where: {
                  id: ownerId,
                  isActive: true,
                },
              })
            : await this.prisma.alumni.count({
                where: {
                  id: ownerId,
                  isActive: true,
                },
              });

    if (!exists) {
      throw new NotFoundException(
        "The communication contact owner was not found.",
      );
    }
  }

  private async ownerUserId(ownerType: ContactOwnerType, ownerId: string) {
    if (ownerType === "PARENT") {
      return (
        await this.prisma.parent.findUnique({
          where: { id: ownerId },
          select: { userId: true },
        })
      )?.userId;
    }

    if (ownerType === "TEACHER") {
      return (
        await this.prisma.teacher.findUnique({
          where: { id: ownerId },
          select: { userId: true },
        })
      )?.userId;
    }

    // Students and Alumni have no User relationship in the existing
    // architecture. Their communication contacts therefore remain
    // Director-managed and email-based.
    return null;
  }

  private isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private assertKnownOwnerType(
    ownerType: string,
  ): asserts ownerType is ContactOwnerType {
    if (!["PARENT", "TEACHER", "STUDENT", "ALUMNI"].includes(ownerType)) {
      throw new BadRequestException(
        "Unsupported communication contact owner type.",
      );
    }
  }

  private async resolveRecipients(
    dto: SendSchoolCommunicationDto,
  ): Promise<RecipientCandidate[]> {
    const includeParents =
      dto.audience === "EVERYONE" || dto.audience === "PARENTS";

    const includeStudents =
      dto.audience === "EVERYONE" || dto.audience === "STUDENTS";

    const includeTeachers =
      dto.audience === "EVERYONE" || dto.audience === "TEACHERS";

    const includeAlumni =
      dto.audience === "EVERYONE" || dto.audience === "ALUMNI";

    const candidates: Array<
      Omit<RecipientCandidate, "contactId" | "emailAddress">
    > = [];

    const uniqueStudentIds = dto.studentIds?.length
      ? [...new Set(dto.studentIds)]
      : [];

    const uniqueTeacherIds = dto.teacherIds?.length
      ? [...new Set(dto.teacherIds)]
      : [];

    if (includeParents) {
      const parentStudentFilter = {
        isActive: true,
        ...(uniqueStudentIds.length
          ? {
              studentId: {
                in: uniqueStudentIds,
              },
            }
          : {}),
        student: {
          isActive: true,
          ...(dto.classId
            ? {
                OR: [
                  {
                    classId: dto.classId,
                  },
                  {
                    enrollments: {
                      some: {
                        classId: dto.classId,
                        isCurrent: true,
                        status: "ACTIVE",
                      },
                    },
                  },
                ],
              }
            : {}),
        },
      };

      const parents = await this.prisma.parent.findMany({
        where: {
          isActive: true,
          students: {
            some: parentStudentFilter,
          },
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              isActive: true,
            },
          },
        },
      });

      candidates.push(
        ...parents.map((parent) => ({
          recipientType: "PARENT" as const,
          recipientId: parent.id,
          portalUserId: parent.user?.isActive ? parent.user.id : undefined,
        })),
      );
    }

    if (includeStudents) {
      const students = await this.prisma.student.findMany({
        where: {
          isActive: true,

          ...(uniqueStudentIds.length
            ? {
                id: {
                  in: uniqueStudentIds,
                },
              }
            : {}),

          ...(dto.classId
            ? {
                OR: [
                  {
                    classId: dto.classId,
                  },
                  {
                    enrollments: {
                      some: {
                        classId: dto.classId,
                        isCurrent: true,
                        status: "ACTIVE",
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        select: {
          id: true,
        },
      });

      candidates.push(
        ...students.map((student) => ({
          recipientType: "STUDENT" as const,
          recipientId: student.id,
        })),
      );
    }

    if (includeTeachers) {
      const teachers = await this.prisma.teacher.findMany({
        where: {
          ...(uniqueTeacherIds.length
            ? {
                id: {
                  in: uniqueTeacherIds,
                },
              }
            : {}),
          user: {
            isActive: true,
          },
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      candidates.push(
        ...teachers.map((teacher) => ({
          recipientType: "TEACHER" as const,
          recipientId: teacher.id,
          portalUserId: teacher.user.id,
        })),
      );
    }

    if (includeAlumni) {
      const alumni = await this.prisma.alumni.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      candidates.push(
        ...alumni.map((record) => ({
          recipientType: "ALUMNI" as const,
          recipientId: record.id,
        })),
      );
    }

    const unique = Array.from(
      new Map(
        candidates.map((candidate) => [
          `${candidate.recipientType}:${candidate.recipientId}`,
          candidate,
        ]),
      ).values(),
    );

    const contacts = unique.length
      ? await this.prisma.communicationContact.findMany({
          where: {
            kind: "EMAIL",
            isActive: true,
            isPrimary: true,
            isVerified: true,
            OR: unique.map((candidate) => ({
              ownerType: candidate.recipientType,
              ownerId: candidate.recipientId,
            })),
          },
          select: {
            id: true,
            ownerType: true,
            ownerId: true,
            value: true,
            normalizedValue: true,
          },
        })
      : [];

    const contactByOwner = new Map(
      contacts.map((contact) => [
        `${contact.ownerType}:${contact.ownerId}`,
        contact,
      ]),
    );

    return unique.map((candidate) => {
      const contact = contactByOwner.get(
        `${candidate.recipientType}:${candidate.recipientId}`,
      );

      return {
        ...candidate,
        contactId: contact?.id,
        emailAddress: contact?.value,
      };
    });
  }

  private async deliverCommunicationEmails(
    communicationId: string,
    subject: string,
    rendered: { html: string; text: string },
    candidates: RecipientCandidate[],
  ) {
    const byEmail = new Map<string, RecipientCandidate[]>();
    for (const candidate of candidates) {
      if (!candidate.emailAddress) continue;
      const key = candidate.emailAddress.trim().toLowerCase();
      byEmail.set(key, [...(byEmail.get(key) ?? []), candidate]);
    }
    await Promise.all(
      [...byEmail.entries()].map(async ([email, grouped]) => {
        const delivery = await this.email.sendEmail({
          to: email,
          subject,
          text: rendered.text,
          html: rendered.html,
        });
        await this.prisma.communicationRecipient.updateMany({
          where: {
            communicationId,
            recipientType: {
              in: grouped.map((candidate) => candidate.recipientType),
            },
            recipientId: {
              in: grouped.map((candidate) => candidate.recipientId),
            },
            emailAddress: email,
          },
          data: {
            emailStatus: delivery.status,
            emailError: delivery.error ?? null,
            deliveredAt: delivery.status === "SENT" ? new Date() : undefined,
          },
        });
      }),
    );
  }
}

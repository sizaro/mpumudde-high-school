import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import * as bcrypt from "bcrypt";
import { randomInt } from "node:crypto";

import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCommunicationContactDto } from "./dto/create-communication-contact.dto.js";
import { SchoolEmailService } from "./school-email.service.js";
import { SendSchoolCommunicationDto } from "./dto/send-school-communication.dto.js";

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
  private readonly verificationLifetimeMs = 15 * 60 * 1000;
  private readonly verificationResendCooldownMs = 60 * 1000;
  private readonly maximumVerificationAttempts = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: SchoolEmailService,
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
      orderBy: { sentAt: "desc" },
      take: 100,
      include: {
        sender: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            recipients: true,
          },
        },
      },
    });
  }

  async getSchoolCommunication(id: string) {
    const communication = await this.prisma.schoolCommunication.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
          },
        },
        recipients: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            communicationContact: {
              select: {
                id: true,
                value: true,
                isVerified: true,
              },
            },
            portalNotification: {
              select: {
                id: true,
                isRead: true,
                readAt: true,
              },
            },
          },
        },
      },
    });

    if (!communication) {
      throw new NotFoundException("School communication not found.");
    }

    return communication;
  }

  async sendSchoolCommunication(dto: SendSchoolCommunicationDto, actor: Actor) {
    this.assertDirector(actor);

    const subject = dto.subject.trim();
    const message = dto.message.trim();

    if (!subject || !message) {
      throw new BadRequestException("A subject and message are required.");
    }

    const candidates = await this.resolveRecipients(dto);

    if (!candidates.length) {
      throw new BadRequestException(
        "No active recipients match the selected audience and filters.",
      );
    }

    const now = new Date();

    const communication = await this.prisma.$transaction(async (tx) => {
      const created = await tx.schoolCommunication.create({
        data: {
          senderUserId: actor.id,
          subject,
          message,
          audience: dto.audience,
          targeting: {
            classId: dto.classId ?? null,
            studentIds: dto.studentIds ?? [],
            teacherIds: dto.teacherIds ?? [],
          },
          status: "SENT",
          sentAt: now,
        },
      });

      for (const candidate of candidates) {
        const notification = candidate.portalUserId
          ? await tx.notification.create({
              data: {
                userId: candidate.portalUserId,
                type: "SCHOOL_COMMUNICATION",
                title: subject,
                message,
                entityType: "SchoolCommunication",
                entityId: created.id,
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

    // Network delivery happens only after the official record and portal copies
    // are safely committed. A provider failure is visible on each recipient and
    // never erases the school's communication history.
    await this.deliverCommunicationEmails(
      communication.id,
      subject,
      message,
      candidates,
    );

    return this.getSchoolCommunication(communication.id);
  }

  async previewSchoolCommunication(dto: SendSchoolCommunicationDto) {
    const candidates = await this.resolveRecipients(dto);

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

    return this.prisma.$transaction(async (tx) => {
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
        },
        update: {
          value,
          label: input.label,
          isPrimary: input.isPrimary ?? true,
          isActive: true,
        },
      });
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
    message: string,
    candidates: RecipientCandidate[],
  ) {
    const byEmail = new Map<string, RecipientCandidate[]>();

    for (const candidate of candidates) {
      if (!candidate.emailAddress) {
        continue;
      }

      const key = candidate.emailAddress.trim().toLowerCase();

      byEmail.set(key, [...(byEmail.get(key) ?? []), candidate]);
    }

    await Promise.all(
      [...byEmail.entries()].map(async ([email, grouped]) => {
        const delivery = await this.email.sendTextEmail({
          to: email,
          subject,
          text: message,
        });

        const recipientIds = grouped.map((candidate) => candidate.recipientId);

        await this.prisma.communicationRecipient.updateMany({
          where: {
            communicationId,
            recipientType: {
              in: grouped.map((candidate) => candidate.recipientType),
            },
            recipientId: {
              in: recipientIds,
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

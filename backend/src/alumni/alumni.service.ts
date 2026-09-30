import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { SchoolEmailService } from "../communications/school-email.service.js";
import { UploadService } from "../upload/upload.service.js";
import { CompleteAlumniRegistrationDto } from "./dto/complete-alumni-registration.dto.js";

@Injectable()
export class AlumniService {
  private readonly verificationLifetimeMs = 60 * 60 * 1000;
  private readonly resendCooldownMs = 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly schoolEmail: SchoolEmailService,
    private readonly uploadService: UploadService,
    private readonly config: ConfigService,
  ) {}

  async startRegistration(email: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (!normalizedEmail) {
      throw new BadRequestException("A valid email address is required.");
    }

    const existingAlumni = await this.prisma.alumni.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        fullName: true,
        isActive: true,
      },
    });

    if (existingAlumni?.isActive) {
      throw new ConflictException(
        "An alumni registration already exists for this email address.",
      );
    }

    if (existingAlumni && !existingAlumni.isActive) {
      throw new ConflictException(
        "This alumni record is currently inactive. Please contact the school.",
      );
    }

    const recentSession = await this.prisma.alumniRegistrationSession.findFirst(
      {
        where: {
          email: normalizedEmail,
          createdAt: {
            gte: new Date(Date.now() - this.resendCooldownMs),
          },
          usedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    );

    if (recentSession) {
      throw new BadRequestException(
        "A verification email was recently sent. Please check your email.",
      );
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this.verificationLifetimeMs);

    const registrationSession =
      await this.prisma.alumniRegistrationSession.create({
        data: {
          email: normalizedEmail,
          tokenHash,
          expiresAt,
        },
      });

    const frontendUrl = this.getFrontendUrl();
    const verificationUrl = `${frontendUrl}/alumni/register?token=${encodeURIComponent(rawToken)}`;

    const delivery = await this.schoolEmail.sendTextEmail({
      to: normalizedEmail,
      subject: "Mpumudde High School Alumni Registration",
      text: [
        "Hello,",
        "",
        "You requested to join the Mpumudde High School Alumni Community.",
        "",
        "Please use the link below to verify your email and complete your registration:",
        "",
        verificationUrl,
        "",
        "This verification link expires in 60 minutes and can only be used once.",
        "",
        "If you did not request this registration, you can safely ignore this email.",
        "",
        "Mpumudde High School",
      ].join("\n"),
    });

    if (delivery.status === "FAILED") {
      await this.prisma.alumniRegistrationSession.delete({
        where: {
          id: registrationSession.id,
        },
      });

      throw new BadRequestException(
        delivery.error ?? "Unable to send the verification email.",
      );
    }

    if (delivery.status === "NOT_CONFIGURED") {
      await this.prisma.alumniRegistrationSession.delete({
        where: {
          id: registrationSession.id,
        },
      });

      throw new BadRequestException(
        "Alumni email verification is not configured yet.",
      );
    }

    return {
      success: true,
      message: "Verification email sent. Please check your email to continue.",
    };
  }

  async verifyRegistrationToken(token: string) {
    const tokenHash = this.hashToken(token);

    const session = await this.prisma.alumniRegistrationSession.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!session) {
      throw new BadRequestException(
        "This verification link is invalid or has expired.",
      );
    }

    if (session.usedAt) {
      throw new BadRequestException(
        "This verification link has already been used.",
      );
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException(
        "This verification link has expired. Please request a new one.",
      );
    }

    const existingAlumni = await this.prisma.alumni.findUnique({
      where: {
        email: session.email,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (existingAlumni?.isActive) {
      throw new ConflictException(
        "An alumni registration already exists for this email address.",
      );
    }

    return {
      valid: true,
      email: session.email,
    };
  }

  async completeRegistration(
    dto: CompleteAlumniRegistrationDto,
    profileImage?: Express.Multer.File,
  ) {
    const tokenHash = this.hashToken(dto.token.trim());

    const session = await this.prisma.alumniRegistrationSession.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!session) {
      throw new BadRequestException(
        "This verification link is invalid or has expired.",
      );
    }

    if (session.usedAt) {
      throw new BadRequestException(
        "This verification link has already been used.",
      );
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException(
        "This verification link has expired. Please request a new one.",
      );
    }

    const normalizedEmail = session.email;

    const existingAlumni = await this.prisma.alumni.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (existingAlumni?.isActive) {
      throw new ConflictException(
        "An alumni registration already exists for this email address.",
      );
    }

    if (existingAlumni && !existingAlumni.isActive) {
      throw new ConflictException(
        "This email belongs to an inactive alumni record. Please contact the school.",
      );
    }

    const fullName = dto.fullName.trim();

    if (!fullName) {
      throw new BadRequestException("Full name is required.");
    }

    let profileImageUrl: string | undefined;
    let profileImagePublicId: string | undefined;

    if (profileImage) {
      this.validateProfileImage(profileImage);

      const uploaded = await this.uploadService.uploadFile(
        profileImage.buffer,
        profileImage.originalname,
        "mpumudde/alumni/profile-images",
      );

      profileImageUrl = uploaded.secure_url ?? uploaded.url;
      profileImagePublicId = uploaded.public_id;
    }

    const possibleMatch = await this.findPossibleStudentMatch(fullName);

    const alumni = await this.prisma.$transaction(async (tx) => {
      const created = await tx.alumni.create({
        data: {
          email: normalizedEmail,
          fullName,
          graduationYear: dto.graduationYear,
          studentPeriod: dto.studentPeriod?.trim() || undefined,
          whatsappNumber: dto.whatsappNumber?.trim() || undefined,
          profileImageUrl,
          profileImagePublicId,
          rememberedPerson: dto.rememberedPerson?.trim() || undefined,
          possibleStudentMatch: possibleMatch.matched,
          possibleStudentMatchDetails: possibleMatch.details,
          isActive: true,
        },
      });

      await tx.alumniRegistrationSession.update({
        where: {
          id: session.id,
        },
        data: {
          usedAt: new Date(),
        },
      });

      return created;
    });

    if (possibleMatch.matched) {
      await this.notifications.notifyDirectors({
        type: "ALUMNI_POSSIBLE_STUDENT_MATCH",
        title: "Possible Alumni / Student Match",
        message: `${alumni.fullName} registered as an alumnus using ${alumni.email}. The name appears to match an existing student record. Please review the alumni record.`,
        entityType: "ALUMNI",
        entityId: alumni.id,
        link: `/director/alumni/${alumni.id}`,
      });
    }

    const welcomeEmail = await this.schoolEmail.sendTextEmail({
      to: alumni.email,
      subject: "Welcome to the Mpumudde High School Alumni Community",
      text: [
        `Hello ${alumni.fullName},`,
        "",
        "Welcome to the Mpumudde High School Alumni Community.",
        "",
        "Your alumni registration has been completed successfully.",
        "",
        "We are glad to have you remain connected to Mpumudde High School and with fellow alumni.",
        "",
        "Thank you,",
        "Mpumudde High School",
      ].join("\n"),
    });

    return {
      success: true,
      message: "Your alumni registration has been completed successfully.",
      alumni: {
        id: alumni.id,
        email: alumni.email,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        studentPeriod: alumni.studentPeriod,
        whatsappNumber: alumni.whatsappNumber,
        profileImageUrl: alumni.profileImageUrl,
        rememberedPerson: alumni.rememberedPerson,
        possibleStudentMatch: alumni.possibleStudentMatch,
      },
      welcomeEmailStatus: welcomeEmail.status,
    };
  }

  private async findPossibleStudentMatch(fullName: string) {
    const normalizedName = this.normalizeName(fullName);

    if (!normalizedName) {
      return {
        matched: false,
        details: undefined,
      };
    }

    const students = await this.prisma.student.findMany({
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    const match = students.find((student) => {
      const studentName = this.normalizeName(
        `${student.firstName} ${student.lastName}`,
      );

      return (
        studentName === normalizedName ||
        studentName.includes(normalizedName) ||
        normalizedName.includes(studentName)
      );
    });

    if (!match) {
      return {
        matched: false,
        details: undefined,
      };
    }

    return {
      matched: true,
      details: JSON.stringify({
        studentId: match.id,
        admissionNumber: match.admissionNumber,
        studentName: `${match.firstName} ${match.lastName}`,
        studentIsActive: match.isActive,
      }),
    };
  }

  private validateProfileImage(file: Express.Multer.File) {
    const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException(
        "Profile image must be a JPEG, PNG, or WEBP image.",
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException("Profile image must not exceed 5 MB.");
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizeName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private getFrontendUrl() {
    const frontendUrl = this.config.get<string>("FRONTEND_URL")?.trim();

    if (!frontendUrl) {
      throw new Error(
        "FRONTEND_URL must be configured for the current environment.",
      );
    }

    return frontendUrl.replace(/\/+$/, "");
  }
}

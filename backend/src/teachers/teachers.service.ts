import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import * as bcrypt from "bcrypt";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { UpdateTeacherDto } from "./dto/update-teacher.dto.js";
import { CreateEmploymentDto } from "./dto/create-employment.dto.js";
import { CreateEmergencyContactDto } from "./dto/create-emergency-contact.dto.js";
import { UpdateEmergencyContactDto } from "./dto/update-emergency-contact.dto.js";
import { CreateMedicalInfoDto } from "./dto/create-medical-info.dto.js";
import { CreateQualificationDto } from "./dto/create-qualification.dto.js";
import { UpdateQualificationDto } from "./dto/update-qualification.dto.js";
import { CreateDocumentDto } from "./dto/create-document.dto.js";

type CompleteTeacherRegistration = {
  personal: CreateTeacherDto;
  subjectIds?: string[];
  contacts?: CreateEmergencyContactDto[];
  employment?: CreateEmploymentDto;
  medical?: CreateMedicalInfoDto;
  documents?: CreateDocumentDto[];
};

function generateTempPassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function loginEmailBase(firstName: string, lastName: string): string {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  return `${normalize(firstName)}.${normalize(lastName)}`;
}

const TEACHER_INCLUDE = {
  user: { select: { id: true, email: true, isActive: true } },
  employment: true,
  medicalInformation: true,
  emergencyContacts: { orderBy: { createdAt: "asc" as const } },
  qualifications: { orderBy: { createdAt: "asc" as const } },
  teachingAssignments: {
    include: {
      subject: { select: { id: true, name: true, code: true } },
    },
  },
} as const;

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFinance(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: { employment: true },
    });
    if (!teacher) return null;
    const payments = await this.prisma.expense.findMany({
      where: { teacherId: teacher.id },
      orderBy: { expenseDate: "desc" },
      select: {
        id: true,
        category: true,
        amount: true,
        status: true,
        expenseDate: true,
        proofUrl: true,
        referenceNumber: true,
        payrollPeriod: true,
        basicSalary: true,
        allowances: true,
        deductions: true,
        advances: true,
        grossPay: true,
        netPay: true,
      },
    });
    return {
      teacher: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employment: teacher.employment,
      },
      payments,
    };
  }

  async createWithAccount(personalDto: CreateTeacherDto) {
    const loginEmail = await this.generateLoginEmail(
      personalDto.firstName,
      personalDto.lastName,
    );

    const role = await this.prisma.role.findFirst({
      where: { name: "TEACHER" },
    });
    if (!role) {
      throw new BadRequestException(
        "TEACHER role not found. Ensure roles are seeded.",
      );
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const teacher = await this.prisma.teacher.create({
      data: {
        firstName: personalDto.firstName,
        middleName: personalDto.middleName,
        lastName: personalDto.lastName,
        gender: personalDto.gender,
        dateOfBirth: personalDto.dateOfBirth
          ? new Date(personalDto.dateOfBirth)
          : undefined,
        phone: personalDto.phone,
        email: personalDto.email,
        nationality: personalDto.nationality,
        address: personalDto.address,
        profilePhoto: personalDto.profilePhoto,
        user: {
          create: {
            email: loginEmail,
            password: hashedPassword,
            roles: { create: { roleId: role.id } },
          },
        },
      },
      include: TEACHER_INCLUDE,
    });

    return { teacher, temporaryPassword: tempPassword };
  }

  async createComplete(
    registration: CompleteTeacherRegistration,
    uploadedByUserId: string,
  ) {
    const {
      personal,
      subjectIds = [],
      contacts = [],
      employment,
      medical,
      documents = [],
    } = registration;
    const loginEmail = await this.generateLoginEmail(
      personal.firstName,
      personal.lastName,
    );
    const role = await this.prisma.role.findFirst({
      where: { name: "TEACHER" },
    });
    if (!role)
      throw new BadRequestException(
        "TEACHER role not found. Ensure roles are seeded.",
      );

    const tempPassword = generateTempPassword();
    const password = await bcrypt.hash(tempPassword, 12);
    const hasMedicalInfo = medical && Object.values(medical).some(Boolean);
    const hasEmploymentInfo =
      employment && Object.values(employment).some(Boolean);

    const teacher = await this.prisma.$transaction(
      async (tx) => {
        const created = await tx.teacher.create({
          data: {
            ...personal,
            dateOfBirth: personal.dateOfBirth
              ? new Date(personal.dateOfBirth)
              : undefined,
            user: {
              create: {
                email: loginEmail,
                password,
                roles: { create: { roleId: role.id } },
              },
            },
            teachingAssignments: {
              create: [...new Set(subjectIds)].map((subjectId) => ({
                subjectId,
              })),
            },
            emergencyContacts: {
              create: contacts.map((contact) => ({
                ...contact,
                isNextOfKin: contact.isNextOfKin ?? false,
              })),
            },
            employment: hasEmploymentInfo
              ? {
                  create: {
                    employeeNumber:
                      employment?.employeeNumber ||
                      `MHS-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    position: employment?.position,
                    department: employment?.department,
                    employmentType: employment?.employmentType,
                    employmentDate: employment?.employmentDate
                      ? new Date(employment.employmentDate)
                      : undefined,
                    probationEndDate: employment?.probationEndDate
                      ? new Date(employment.probationEndDate)
                      : undefined,
                    salary: employment?.salary,
                    payFrequency: employment?.payFrequency,
                    status: employment?.status ?? "active",
                  },
                }
              : undefined,
            medicalInformation: hasMedicalInfo
              ? { create: medical }
              : undefined,
          },
          include: TEACHER_INCLUDE,
        });

        if (documents.length) {
          await tx.document.createMany({
            data: documents.map((document) => ({
              entityType: "TEACHER",
              entityId: created.id,
              uploadedByUserId,
              ...document,
            })),
          });
        }
        return created;
      },
      { maxWait: 10_000, timeout: 20_000 },
    );

    return { teacher, temporaryPassword: tempPassword };
  }

  async createPortalAccount(teacherId: string, requestedEmail?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");
    if (teacher.userId || teacher.user) {
      throw new BadRequestException(
        "This teacher already has a portal account.",
      );
    }

    const role = await this.prisma.role.findFirst({
      where: { name: "TEACHER" },
    });
    if (!role)
      throw new BadRequestException(
        "TEACHER role not found. Ensure roles are seeded.",
      );

    const loginEmail =
      requestedEmail?.trim().toLowerCase() ??
      (await this.generateLoginEmail(teacher.firstName, teacher.lastName));
    const existingUser = await this.prisma.user.findUnique({
      where: { email: loginEmail },
    });
    if (existingUser) {
      throw new BadRequestException("That login email is already in use.");
    }

    const temporaryPassword = generateTempPassword();
    const password = await bcrypt.hash(temporaryPassword, 12);
    const user = await this.prisma.user.create({
      data: {
        email: loginEmail,
        password,
        teacher: { connect: { id: teacher.id } },
        roles: { create: { roleId: role.id } },
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        isLoggedIn: true,
        lastLogin: true,
      },
    });

    return { user, temporaryPassword };
  }

  async resetPortalPassword(teacherId: string, requestedEmail?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");
    if (!teacher.userId || !teacher.user) {
      throw new BadRequestException(
        "This teacher does not have a portal account.",
      );
    }

    const nextEmail = requestedEmail?.trim().toLowerCase();
    if (nextEmail && nextEmail !== teacher.user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: nextEmail },
        select: { id: true },
      });
      if (existing)
        throw new BadRequestException("That login email is already in use.");
    }

    const temporaryPassword = generateTempPassword();
    const user = await this.prisma.user.update({
      where: { id: teacher.userId },
      data: {
        password: await bcrypt.hash(temporaryPassword, 12),
        isLoggedIn: false,
        ...(nextEmail ? { email: nextEmail } : {}),
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        isLoggedIn: true,
        lastLogin: true,
      },
    });

    return { user, temporaryPassword };
  }

  async updatePortalStatus(teacherId: string, isActive: boolean) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { userId: true },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");
    if (!teacher.userId)
      throw new BadRequestException(
        "This teacher does not have a portal account.",
      );

    return this.prisma.user.update({
      where: { id: teacher.userId },
      data: { isActive, ...(isActive ? {} : { isLoggedIn: false }) },
      select: {
        id: true,
        email: true,
        isActive: true,
        isLoggedIn: true,
        lastLogin: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, isActive: true } },
        employment: true,
      },
    });
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        ...TEACHER_INCLUDE,
        attendanceSessions: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            schoolClass: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");
    return teacher;
  }

  async findByUserId(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: TEACHER_INCLUDE,
    });
    if (!teacher) throw new NotFoundException("Teacher profile not found");
    return teacher;
  }

  async updatePersonal(id: string, dto: UpdateTeacherDto) {
    await this.assertExists(id);
    const data: Record<string, unknown> = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.middleName !== undefined) data.middleName = dto.middleName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.dateOfBirth !== undefined)
      data.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.nationality !== undefined) data.nationality = dto.nationality;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.profilePhoto !== undefined) data.profilePhoto = dto.profilePhoto;
    return this.prisma.teacher.update({
      where: { id },
      data,
      include: TEACHER_INCLUDE,
    });
  }

  async upsertEmployment(teacherId: string, dto: CreateEmploymentDto) {
    await this.assertExists(teacherId);
    return this.prisma.teacherEmployment.upsert({
      where: { teacherId },
      create: {
        teacherId,
        employeeNumber: dto.employeeNumber,
        position: dto.position,
        department: dto.department,
        employmentType: dto.employmentType,
        employmentDate: dto.employmentDate
          ? new Date(dto.employmentDate)
          : undefined,
        probationEndDate: dto.probationEndDate
          ? new Date(dto.probationEndDate)
          : undefined,
        salary: dto.salary,
        payFrequency: dto.payFrequency,
        status: dto.status ?? "active",
      },
      update: {
        employeeNumber: dto.employeeNumber,
        position: dto.position,
        department: dto.department,
        employmentType: dto.employmentType,
        employmentDate: dto.employmentDate
          ? new Date(dto.employmentDate)
          : undefined,
        probationEndDate: dto.probationEndDate
          ? new Date(dto.probationEndDate)
          : undefined,
        salary: dto.salary,
        payFrequency: dto.payFrequency,
        status: dto.status,
      },
    });
  }

  async upsertMedicalInfo(teacherId: string, dto: CreateMedicalInfoDto) {
    await this.assertExists(teacherId);
    return this.prisma.medicalInformation.upsert({
      where: { teacherId },
      create: {
        teacherId,
        bloodGroup: dto.bloodGroup,
        allergies: dto.allergies,
        medicalConditions: dto.medicalConditions,
        medication: dto.medication,
        disability: dto.disability,
        notes: dto.notes,
      },
      update: {
        bloodGroup: dto.bloodGroup,
        allergies: dto.allergies,
        medicalConditions: dto.medicalConditions,
        medication: dto.medication,
        disability: dto.disability,
        notes: dto.notes,
      },
    });
  }

  async addEmergencyContact(teacherId: string, dto: CreateEmergencyContactDto) {
    await this.assertExists(teacherId);
    return this.prisma.emergencyContact.create({
      data: {
        teacherId,
        fullName: dto.fullName,
        relationship: dto.relationship,
        phone: dto.phone,
        alternativePhone: dto.alternativePhone,
        address: dto.address,
        isNextOfKin: dto.isNextOfKin ?? false,
      },
    });
  }

  async updateEmergencyContact(
    contactId: string,
    dto: UpdateEmergencyContactDto,
  ) {
    return this.prisma.emergencyContact.update({
      where: { id: contactId },
      data: {
        fullName: dto.fullName,
        relationship: dto.relationship,
        phone: dto.phone,
        alternativePhone: dto.alternativePhone,
        address: dto.address,
        isNextOfKin: dto.isNextOfKin,
      },
    });
  }

  async removeEmergencyContact(contactId: string) {
    return this.prisma.emergencyContact.delete({ where: { id: contactId } });
  }

  async addQualification(teacherId: string, dto: CreateQualificationDto) {
    await this.assertExists(teacherId);
    return this.prisma.qualification.create({
      data: {
        teacherId,
        qualificationType: dto.qualificationType,
        qualificationName: dto.qualificationName,
        institution: dto.institution,
        specialization: dto.specialization,
        grade: dto.grade,
        yearStarted: dto.yearStarted,
        yearCompleted: dto.yearCompleted,
        certificateNumber: dto.certificateNumber,
        documentUrl: dto.documentUrl,
      },
    });
  }

  async updateQualification(qualId: string, dto: UpdateQualificationDto) {
    return this.prisma.qualification.update({
      where: { id: qualId },
      data: {
        qualificationType: dto.qualificationType,
        qualificationName: dto.qualificationName,
        institution: dto.institution,
        specialization: dto.specialization,
        grade: dto.grade,
        yearStarted: dto.yearStarted,
        yearCompleted: dto.yearCompleted,
        certificateNumber: dto.certificateNumber,
        documentUrl: dto.documentUrl,
      },
    });
  }

  async removeQualification(qualId: string) {
    return this.prisma.qualification.delete({ where: { id: qualId } });
  }

  async addDocument(
    teacherId: string,
    dto: CreateDocumentDto,
    uploadedByUserId: string,
  ) {
    await this.assertExists(teacherId);
    return this.prisma.document.create({
      data: {
        entityType: "TEACHER",
        entityId: teacherId,
        documentCategoryId: dto.documentCategoryId,
        originalFileName: dto.originalFileName,
        fileUrl: dto.fileUrl,
        title: dto.title,
        description: dto.description,
        storedFileName: dto.storedFileName,
        fileExtension: dto.fileExtension,
        mimeType: dto.mimeType,
        fileSize: dto.fileSize,
        uploadedByUserId,
      },
      include: { documentCategory: true },
    });
  }

  async getDocuments(teacherId: string) {
    await this.assertExists(teacherId);
    return this.prisma.document.findMany({
      where: { entityType: "TEACHER", entityId: teacherId },
      include: {
        documentCategory: true,
        uploadedBy: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async removeDocument(docId: string) {
    return this.prisma.document.delete({ where: { id: docId } });
  }

  async deactivate(id: string) {
    await this.assertExists(id);
    return this.prisma.teacherEmployment.updateMany({
      where: { teacherId: id },
      data: { status: "inactive" },
    });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.teacher.delete({ where: { id } });
  }

  async getMyProfile(userId: string) {
    return this.findByUserId(userId);
  }

  async getMyClasses(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException("Teacher profile not found");
    return this.prisma.schoolClass.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async getMySubjects(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException("Teacher profile not found");
    const assignments = await this.prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      include: { subject: true },
    });
    const subjectMap = new Map<string, (typeof assignments)[0]["subject"]>();
    for (const a of assignments) subjectMap.set(a.subjectId, a.subject);
    return Array.from(subjectMap.values());
  }

  async getMyAssignments(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException("Teacher profile not found");
    return this.prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      include: {
        subject: { select: { id: true, name: true, code: true } },
      },
    });
  }

  private async assertExists(id: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException("Teacher not found");
    return teacher;
  }

  private async generateLoginEmail(firstName: string, lastName: string) {
    const base = loginEmailBase(firstName, lastName) || "teacher";
    let suffix = 0;

    while (true) {
      const email = `${base}${suffix || ""}@mhs.com`;
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (!existing) return email;
      suffix += 1;
    }
  }
}

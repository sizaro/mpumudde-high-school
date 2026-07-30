import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { CreateEmploymentDto } from './dto/create-employment.dto.js';
import { CreateTeacherAccountDto } from './dto/create-account.dto.js';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto.js';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto.js';
import { CreateMedicalInfoDto } from './dto/create-medical-info.dto.js';
import { CreateQualificationDto } from './dto/create-qualification.dto.js';
import { UpdateQualificationDto } from './dto/update-qualification.dto.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';

function generateTempPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const TEACHER_INCLUDE = {
  user: { select: { id: true, email: true, isActive: true } },
  employment: true,
  medicalInformation: true,
  emergencyContacts: { orderBy: { createdAt: 'asc' as const } },
  qualifications: { orderBy: { createdAt: 'asc' as const } },
  teachingAssignments: {
    include: {
      schoolClass: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true, code: true } },
    },
  },
} as const;

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async createWithAccount(
    personalDto: CreateTeacherDto,
    accountDto: CreateTeacherAccountDto,
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { email: accountDto.email },
    });
    if (existing) throw new BadRequestException('Email is already in use');

    const role = await this.prisma.role.findFirst({
      where: { name: 'TEACHER' },
    });
    if (!role) {
      throw new BadRequestException(
        'TEACHER role not found. Ensure roles are seeded.',
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
            email: accountDto.email,
            password: hashedPassword,
            roles: { create: { roleId: role.id } },
          },
        },
      },
      include: TEACHER_INCLUDE,
    });

    return { teacher, temporaryPassword: tempPassword };
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' },
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
          orderBy: { createdAt: 'desc' },
          include: {
            schoolClass: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async findByUserId(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: TEACHER_INCLUDE,
    });
    if (!teacher) throw new NotFoundException('Teacher profile not found');
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
        status: dto.status ?? 'active',
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

  async addEmergencyContact(
    teacherId: string,
    dto: CreateEmergencyContactDto,
  ) {
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
        entityType: 'TEACHER',
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
      where: { entityType: 'TEACHER', entityId: teacherId },
      include: {
        documentCategory: true,
        uploadedBy: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeDocument(docId: string) {
    return this.prisma.document.delete({ where: { id: docId } });
  }

  async deactivate(id: string) {
    await this.assertExists(id);
    return this.prisma.teacherEmployment.updateMany({
      where: { teacherId: id },
      data: { status: 'inactive' },
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
    if (!teacher) throw new NotFoundException('Teacher profile not found');
    const assignments = await this.prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      include: { schoolClass: true },
    });
    const classMap = new Map<string, (typeof assignments)[0]['schoolClass']>();
    for (const a of assignments) classMap.set(a.classId, a.schoolClass);
    return Array.from(classMap.values());
  }

  async getMySubjects(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found');
    const assignments = await this.prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      include: { subject: true },
    });
    const subjectMap = new Map<string, (typeof assignments)[0]['subject']>();
    for (const a of assignments) subjectMap.set(a.subjectId, a.subject);
    return Array.from(subjectMap.values());
  }

  async getMyAssignments(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found');
    return this.prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      include: {
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
    });
  }

  private async assertExists(id: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }
}

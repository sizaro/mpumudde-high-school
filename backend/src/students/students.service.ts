import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { CompleteStudentRegistrationDto } from './dto/complete-student-registration.dto.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.$transaction(async (tx) => tx.student.create({
      data: {
        admissionNumber: await this.generateStudentNumber(tx),
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : undefined,
        gender: createStudentDto.gender,
        passportPhoto: createStudentDto.passportPhoto,
        isActive: createStudentDto.isActive ?? true,
        academicYearId: createStudentDto.academicYearId,
        termId: createStudentDto.termId,
        classId: createStudentDto.classId,
        studentCategoryId: createStudentDto.studentCategoryId,
      },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    }));
  }

  async createCompleteRegistration(dto: CompleteStudentRegistrationDto) {
    const { student, primaryGuardian, additionalGuardians = [], payments = [] } = dto;
    const feeTypes = await this.prisma.feeType.findMany({ where: { isActive: true } });
    const normalizedPayments = payments.map((payment) => ({
      ...payment,
      feeTypeId: feeTypes.find((feeType) => feeType.name.toLowerCase() === payment.feeTypeName?.toLowerCase())?.id ?? payment.feeTypeId,
    }));
    const registrationFee = feeTypes.find((feeType) => feeType.name.toLowerCase() === 'registration');
    if (!registrationFee) throw new BadRequestException('Create the Registration fee type in Academic Setup before registering a student.');
    if (!normalizedPayments.some((payment) => payment.feeTypeId === registrationFee.id && payment.amount > 0)) throw new BadRequestException('Select Registration and enter its payment amount before continuing.');
    return this.prisma.$transaction(async (tx) => {
      const admissionNumber = await this.generateStudentNumber(tx);
      const created = await tx.student.create({
        data: {
          admissionNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : undefined,
          gender: student.gender,
          passportPhoto: student.passportPhoto,
          nationality: student.nationality,
          address: student.address,
          previousSchool: student.previousSchool,
          bloodGroup: student.bloodGroup,
          allergies: student.allergies,
          medicalConditions: student.medicalConditions,
          specialNeeds: student.specialNeeds,
          medicalNotes: student.medicalNotes,
          isActive: student.isActive ?? true,
          academicYearId: student.academicYearId,
          termId: student.termId,
          classId: student.classId,
          studentCategoryId: student.studentCategoryId,
        },
      });

      const guardians = [
        ...(primaryGuardian?.fullName ? [{ ...primaryGuardian, primary: true }] : []),
        ...additionalGuardians.filter((guardian) => guardian.name.trim()).map((guardian) => ({ fullName: guardian.name, phone: guardian.phone, relationship: 'Additional Guardian', primary: false })),
      ];
      for (const guardian of guardians) {
        const names = guardian.fullName.trim().split(/\s+/);
        const parent = await tx.parent.create({
          data: {
            firstName: names[0] || 'Guardian', lastName: names.slice(1).join(' ') || 'Guardian',
            phone: guardian.phone, relationship: guardian.relationship,
            email: 'email' in guardian ? guardian.email : undefined,
            occupation: 'occupation' in guardian ? guardian.occupation : undefined,
            address: 'address' in guardian ? guardian.address : undefined,
            profilePhoto: 'profilePhoto' in guardian ? guardian.profilePhoto : undefined,
            identityDocumentType: 'identityDocumentType' in guardian ? guardian.identityDocumentType : undefined,
            identityDocumentUrl: 'identityDocumentUrl' in guardian ? guardian.identityDocumentUrl : undefined,
          },
        });
        await tx.studentParent.create({ data: { studentId: created.id, parentId: parent.id, relationship: guardian.relationship } });
      }
      for (const payment of normalizedPayments) {
        const structure = await tx.financeStructure.findFirst({ where: { academicYearId: payment.academicYearId, termId: payment.termId, classId: student.classId, studentCategoryId: student.studentCategoryId, feeTypeId: payment.feeTypeId } });
        await tx.payment.create({ data: { studentId: created.id, feeTypeId: payment.feeTypeId, financeStructureId: structure?.id, amount: payment.amount, method: payment.method, receiptUrl: payment.receiptUrl, status: 'completed' } });
      }
      return tx.student.findUniqueOrThrow({ where: { id: created.id }, include: { parents: { include: { parent: true } }, academicYear: true, term: true, schoolClass: true, studentCategory: true } });
    }, { maxWait: 10_000, timeout: 20_000 });
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        parents: { include: { parent: true } },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        parents: { include: { parent: true } },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const data: Record<string, unknown> = {};

    if (updateStudentDto.admissionNumber !== undefined) {
      data.admissionNumber = updateStudentDto.admissionNumber;
    }
    if (updateStudentDto.firstName !== undefined) {
      data.firstName = updateStudentDto.firstName;
    }
    if (updateStudentDto.lastName !== undefined) {
      data.lastName = updateStudentDto.lastName;
    }
    if (updateStudentDto.dateOfBirth !== undefined) {
      data.dateOfBirth = updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : null;
    }
    if (updateStudentDto.gender !== undefined) {
      data.gender = updateStudentDto.gender;
    }
    if (updateStudentDto.passportPhoto !== undefined) {
      data.passportPhoto = updateStudentDto.passportPhoto;
    }
    for (const field of ['nationality', 'address', 'previousSchool', 'bloodGroup', 'allergies', 'medicalConditions', 'specialNeeds', 'medicalNotes'] as const) {
      if (updateStudentDto[field] !== undefined) data[field] = updateStudentDto[field];
    }
    if (updateStudentDto.isActive !== undefined) {
      data.isActive = updateStudentDto.isActive;
    }
    if (updateStudentDto.academicYearId !== undefined) {
      data.academicYearId = updateStudentDto.academicYearId;
    }
    if (updateStudentDto.termId !== undefined) {
      data.termId = updateStudentDto.termId;
    }
    if (updateStudentDto.classId !== undefined) {
      data.classId = updateStudentDto.classId;
    }
    if (updateStudentDto.studentCategoryId !== undefined) {
      data.studentCategoryId = updateStudentDto.studentCategoryId;
    }

    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async getFinanceSummary(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        payments: {
          include: {
            financeStructure: {
              include: {
                feeType: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const financeStructures = await this.prisma.financeStructure.findMany({
      where: {
        academicYearId: student.academicYearId ?? undefined,
        termId: student.termId ?? undefined,
        classId: student.classId ?? undefined,
        studentCategoryId: student.studentCategoryId ?? undefined,
      },
      include: {
        feeType: true,
      },
    });

    const summary = financeStructures.map((structure) => {
      const paid = student.payments
        .filter((payment) => payment.financeStructureId === structure.id)
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        feeType: structure.feeType?.name ?? 'Fee',
        expectedAmount: structure.expectedAmount,
        paidAmount: paid,
        balance: structure.expectedAmount - paid,
        financeStructureId: structure.id,
      };
    });

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        passportPhoto: student.passportPhoto,
        academicYear: student.academicYear?.name,
        term: student.term?.name,
        className: student.schoolClass?.name,
        studentCategory: student.studentCategory?.name,
      },
      summary,
      totalExpected: summary.reduce((sum, item) => sum + item.expectedAmount, 0),
      totalPaid: summary.reduce((sum, item) => sum + item.paidAmount, 0),
      totalBalance: summary.reduce((sum, item) => sum + item.balance, 0),
    };
  }

  private async generateStudentNumber(tx: any) {
    const year = new Date().getFullYear();
    const counter = await tx.studentNumberSequence.upsert({
      where: { year },
      create: { year, nextNumber: 2 },
      update: { nextNumber: { increment: 1 } },
    });
    return `MHS-${year}-${String(counter.nextNumber - 1).padStart(4, '0')}`;
  }
}

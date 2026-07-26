import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        admissionNumber: createStudentDto.admissionNumber,
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
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        parents: true,
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
        parents: true,
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
}

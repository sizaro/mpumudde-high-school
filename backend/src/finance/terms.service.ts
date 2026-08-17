import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateStudentTermFeeDto } from './dto/create-student-term-fee.dto.js';

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  // TERM MANAGEMENT
  async createTerm(createTermDto: CreateTermDto) {
    if (!createTermDto.academicYearId) throw new BadRequestException('Academic year is required.');
    const status = createTermDto.status ?? 'UPCOMING';
    return this.prisma.term.create({
      data: {
        name: createTermDto.name,
        startDate: new Date(createTermDto.startDate),
        endDate: new Date(createTermDto.endDate),
        status,
        isActive: status === 'ACTIVE',
        academicYear: {
          connect: {
            id: createTermDto.academicYearId ?? '',
          },
        },
      },
    });
  }

  async getAllTerms() {
    return this.prisma.term.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        studentTermFees: {
          include: { student: true },
        },
      },
    });
  }

  async getActiveTerm() {
    return this.prisma.term.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        studentTermFees: {
          include: { student: true },
        },
      },
    });
  }

  async getTerm(termId: string) {
    return this.prisma.term.findUnique({
      where: { id: termId },
      include: {
        studentTermFees: {
          include: { student: true },
        },
      },
    });
  }

  // STUDENT TERM FEE MANAGEMENT
  async assignTermFeeToStudent(createStudentTermFeeDto: CreateStudentTermFeeDto) {
    return this.prisma.studentTermFee.upsert({
      where: {
        studentId_termId: {
          studentId: createStudentTermFeeDto.studentId,
          termId: createStudentTermFeeDto.termId,
        },
      },
      update: {
        amountOwed: createStudentTermFeeDto.amountOwed,
        amountPaid: createStudentTermFeeDto.amountPaid ?? undefined,
      },
      create: {
        studentId: createStudentTermFeeDto.studentId,
        termId: createStudentTermFeeDto.termId,
        amountOwed: createStudentTermFeeDto.amountOwed,
        amountPaid: createStudentTermFeeDto.amountPaid ?? 0,
      },
      include: {
        student: true,
        term: true,
      },
    });
  }

  async getStudentTermFees(studentId: string) {
    return this.prisma.studentTermFee.findMany({
      where: { studentId },
      include: { term: true },
      orderBy: { term: { startDate: 'desc' } },
    });
  }

  async getTermStudentFees(termId: string) {
    return this.prisma.studentTermFee.findMany({
      where: { termId },
      include: { student: true },
      orderBy: { student: { firstName: 'asc' } },
    });
  }

  // Materialize the configured finance structures as immutable student charges.
  async assignTermFeeToAllStudents(termId: string) {
    const term = await this.prisma.term.findUnique({
      where: { id: termId },
    });

    if (!term) {
      throw new Error('Term not found');
    }

    const structures = await this.prisma.financeStructure.findMany({ where: { termId, isActive: true } });
    let eligible = 0;
    let applied = 0;
    for (const structure of structures) {
      const students = await this.prisma.student.findMany({
        where: {
          isActive: true,
          studentCategoryId: structure.studentCategoryId,
          enrollments: { some: { academicYearId: structure.academicYearId, classId: structure.classId, status: 'ACTIVE' } },
        },
        select: { id: true },
      });
      eligible += students.length;
      const result = await this.prisma.studentCharge.createMany({
        data: students.map(({ id: studentId }) => ({
          studentId,
          financeStructureId: structure.id,
          expectedAmount: structure.expectedAmount,
          academicYearId: structure.academicYearId,
          termId: structure.termId,
          classId: structure.classId,
          studentCategoryId: structure.studentCategoryId,
          feeTypeId: structure.feeTypeId,
        })),
        skipDuplicates: true,
      });
      applied += result.count;
    }
    return { structures: structures.length, eligible, applied, skipped: eligible - applied };
  }
}

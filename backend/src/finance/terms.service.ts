import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateStudentTermFeeDto } from './dto/create-student-term-fee.dto.js';

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  // TERM MANAGEMENT
  async createTerm(createTermDto: CreateTermDto) {
    return this.prisma.term.create({
      data: {
        name: createTermDto.name,
        feeAmount: createTermDto.feeAmount,
        startDate: new Date(createTermDto.startDate),
        endDate: new Date(createTermDto.endDate),
        isActive: createTermDto.isActive ?? true,
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
      where: { isActive: true },
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

  // Assign fees to all active students for a specific term
  async assignTermFeeToAllStudents(termId: string) {
    const term = await this.prisma.term.findUnique({
      where: { id: termId },
    });

    if (!term) {
      throw new Error('Term not found');
    }

    const students = await this.prisma.student.findMany({
      where: { isActive: true },
    });

    const results: any[] = [];
    for (const student of students) {
      const result = await this.prisma.studentTermFee.upsert({
        where: {
          studentId_termId: {
            studentId: student.id,
            termId: termId,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          termId: termId,
          amountOwed: term.feeAmount,
          amountPaid: 0,
        },
        include: {
          student: true,
          term: true,
        },
      });
      results.push(result);
    }

    return results;
  }
}

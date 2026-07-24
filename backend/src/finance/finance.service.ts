import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFinanceDto: CreateFinanceDto) {
    let studentTermFeeId = createFinanceDto.studentTermFeeId;

    // If not specified, auto-find the active term fee for this student
    if (!studentTermFeeId) {
      const activeTerm = await this.prisma.term.findFirst({
        where: { isActive: true },
      });

      if (activeTerm) {
        const studentTermFee = await this.prisma.studentTermFee.findUnique({
          where: {
            studentId_termId: {
              studentId: createFinanceDto.studentId,
              termId: activeTerm.id,
            },
          },
        });

        if (studentTermFee) {
          studentTermFeeId = studentTermFee.id;
        }
      }
    }

    const payment = await this.prisma.payment.create({
      data: {
        studentId: createFinanceDto.studentId,
        studentTermFeeId: studentTermFeeId || undefined,
        financeStructureId: createFinanceDto.financeStructureId || undefined,
        amount: createFinanceDto.amount,
        method: createFinanceDto.method,
        status: createFinanceDto.status ?? 'completed',
        description: createFinanceDto.description,
        date: createFinanceDto.date ? new Date(createFinanceDto.date) : undefined,
      },
      include: {
        student: true,
        studentTermFee: true,
        financeStructure: {
          include: {
            academicYear: true,
            term: true,
            schoolClass: true,
            studentCategory: true,
            feeType: true,
          },
        },
      },
    });

    // Update StudentTermFee amountPaid if linked to a term fee
    if (studentTermFeeId) {
      await this.prisma.studentTermFee.update({
        where: { id: studentTermFeeId },
        data: {
          amountPaid: {
            increment: createFinanceDto.amount,
          },
        },
      });
    }

    return payment;
  }

  async findAll() {
    return this.prisma.payment.findMany({
      orderBy: { date: 'desc' },
      include: {
        student: true,
        studentTermFee: { include: { term: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        student: true,
        studentTermFee: { include: { term: true } },
      },
    });
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        amount: updateFinanceDto.amount,
        method: updateFinanceDto.method,
        status: updateFinanceDto.status,
        description: updateFinanceDto.description,
        date: updateFinanceDto.date ? new Date(updateFinanceDto.date) : undefined,
      },
      include: { student: true, studentTermFee: true },
    });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }

  // Get all students with their current term fee balances
  async getStudentsWithBalances() {
    const students = await this.prisma.student.findMany({
      include: {
        termFees: {
          include: { term: true },
          where: { term: { isActive: true } },
        },
        payments: true,
      },
    });

    return students.map((student) => {
      if (student.termFees.length === 0) {
        // Student has no assigned fees
        return {
          id: student.id,
          admissionNumber: student.admissionNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          isActive: student.isActive,
          balances: [],
          totalOwed: 0,
          totalPaid: 0,
          totalBalance: 0,
        };
      }

      const balances = student.termFees.map((tf) => ({
        termId: tf.termId,
        termName: tf.term.name,
        amountOwed: tf.amountOwed,
        amountPaid: tf.amountPaid,
        balance: tf.amountOwed - tf.amountPaid,
      }));

      const totalOwed = balances.reduce((sum, b) => sum + b.amountOwed, 0);
      const totalPaid = balances.reduce((sum, b) => sum + b.amountPaid, 0);
      const totalBalance = totalOwed - totalPaid;

      return {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        isActive: student.isActive,
        balances,
        totalOwed,
        totalPaid,
        totalBalance,
      };
    });
  }

  // Get specific student balance
  async getStudentBalance(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        termFees: {
          include: { term: true },
          where: { term: { isActive: true } },
        },
        payments: {
          include: { studentTermFee: { include: { term: true } } },
        },
      },
    });

    if (!student) return null;

    const balances = student.termFees.map((tf) => ({
      termId: tf.termId,
      termName: tf.term.name,
      amountOwed: tf.amountOwed,
      amountPaid: tf.amountPaid,
      balance: tf.amountOwed - tf.amountPaid,
    }));

    const totalOwed = balances.reduce((sum, b) => sum + b.amountOwed, 0);
    const totalPaid = balances.reduce((sum, b) => sum + b.amountPaid, 0);
    const totalBalance = totalOwed - totalPaid;

    return {
      id: student.id,
      admissionNumber: student.admissionNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      isActive: student.isActive,
      balances,
      totalOwed,
      totalPaid,
      totalBalance,
      recentPayments: student.payments.slice(0, 5),
    };
  }
}

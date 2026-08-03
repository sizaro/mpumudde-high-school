import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto.js';
import { ListFeeStructuresDto } from './dto/list-fee-structures.dto.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { CreatePayrollPaymentDto } from './dto/create-payroll-payment.dto.js';
import { CreateOtherIncomeDto } from './dto/create-other-income.dto.js';
import { paymentDateBoundary, toKampalaLocalDateTime } from '../common/utils/kampala-date-time.js';
import { ListPaymentsDto, SearchPaymentStudentsDto } from './dto/list-payments.dto.js';
import { ListExpensesDto } from './dto/list-expenses.dto.js';

type RequestUser = {
  id?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
};

const feeStructureInclude = {
  academicYear: true,
  term: true,
  schoolClass: true,
  studentCategory: true,
  feeType: true,
  createdBy: { select: { id: true, email: true } },
  updatedBy: { select: { id: true, email: true } },
} as const;

const paymentInclude = {
  student: true,
  studentTermFee: { include: { term: true } },
  studentCharge: {
    include: {
      financeStructure: { include: feeStructureInclude },
    },
  },
  feeType: true,
  recordedBy: { select: { id: true, email: true } },
  reversedBy: { select: { id: true, email: true } },
  audits: { include: { actor: { select: { id: true, email: true } } }, orderBy: { createdAt: 'desc' as const } },
} as const;

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async listFeeTypes() {
    return this.prisma.feeType.findMany({
      include: { _count: { select: { financeStructures: true, payments: true } } },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  async createFeeType(data: { name: string; isActive?: boolean }) {
    const name = data.name?.trim();
    if (!name) throw new BadRequestException('Fee type name is required');
    const existing = await this.prisma.feeType.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
    if (existing) throw new BadRequestException('A fee type with this name already exists');
    return this.prisma.feeType.create({
      data: { name, isActive: data.isActive ?? true },
      include: { _count: { select: { financeStructures: true, payments: true } } },
    });
  }

  async updateFeeType(id: string, data: { name?: string; isActive?: boolean }) {
    const existing = await this.prisma.feeType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Fee type not found');
    const name = data.name?.trim();
    if (data.name !== undefined && !name) throw new BadRequestException('Fee type name is required');
    if (name && name.toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await this.prisma.feeType.findFirst({ where: { id: { not: id }, name: { equals: name, mode: 'insensitive' } } });
      if (duplicate) throw new BadRequestException('A fee type with this name already exists');
    }
    return this.prisma.feeType.update({
      where: { id },
      data: { name, isActive: data.isActive },
      include: { _count: { select: { financeStructures: true, payments: true } } },
    });
  }

  async deleteFeeType(id: string) {
    const existing = await this.prisma.feeType.findUnique({
      where: { id },
      include: { _count: { select: { financeStructures: true, payments: true } } },
    });
    if (!existing) throw new NotFoundException('Fee type not found');
    if (existing._count.financeStructures > 0 || existing._count.payments > 0) {
      throw new BadRequestException('This fee type is already used. Deactivate it instead of deleting it.');
    }
    return this.prisma.feeType.delete({ where: { id } });
  }

  private buildFeeStructureWhere(filters: ListFeeStructuresDto) {
    const search = filters.search?.trim();
    const isActive =
      filters.isActive === undefined ? undefined : filters.isActive === 'true';

    return {
      academicYearId: filters.academicYearId || undefined,
      termId: filters.termId || undefined,
      classId: filters.classId || undefined,
      studentCategoryId: filters.studentCategoryId || undefined,
      feeTypeId: filters.feeTypeId || undefined,
      isActive,
      OR: search
        ? [
            {
              academicYear: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              term: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              schoolClass: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              studentCategory: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              feeType: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
          ]
        : undefined,
    };
  }

  async createFeeStructure(
    createFeeStructureDto: CreateFeeStructureDto,
    user?: RequestUser,
  ) {
    return this.prisma.financeStructure.create({
      data: {
        academicYearId: createFeeStructureDto.academicYearId,
        termId: createFeeStructureDto.termId,
        classId: createFeeStructureDto.classId,
        studentCategoryId: createFeeStructureDto.studentCategoryId,
        feeTypeId: createFeeStructureDto.feeTypeId,
        expectedAmount: createFeeStructureDto.expectedAmount,
        isActive: createFeeStructureDto.isActive ?? true,
        createdByUserId: user?.id,
        updatedByUserId: user?.id,
      } as any,
      include: feeStructureInclude,
    });
  }

  async listFeeStructures(filters: ListFeeStructuresDto = {}) {
    return this.prisma.financeStructure.findMany({
      where: this.buildFeeStructureWhere(filters),
      include: feeStructureInclude,
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async getFeeStructure(id: string) {
    return this.prisma.financeStructure.findUnique({
      where: { id },
      include: feeStructureInclude,
    });
  }

  async updateFeeStructure(
    id: string,
    updateFeeStructureDto: UpdateFeeStructureDto,
    user?: RequestUser,
  ) {
    const existing = await this.prisma.financeStructure.findUnique({
      where: { id },
      include: { _count: { select: { studentCharges: true, payments: true } } },
    });
    if (!existing) throw new NotFoundException('Fee structure not found');
    const dimensionsChanged =
      (updateFeeStructureDto.academicYearId !== undefined && updateFeeStructureDto.academicYearId !== existing.academicYearId) ||
      (updateFeeStructureDto.termId !== undefined && updateFeeStructureDto.termId !== existing.termId) ||
      (updateFeeStructureDto.classId !== undefined && updateFeeStructureDto.classId !== existing.classId) ||
      (updateFeeStructureDto.studentCategoryId !== undefined && updateFeeStructureDto.studentCategoryId !== existing.studentCategoryId) ||
      (updateFeeStructureDto.feeTypeId !== undefined && updateFeeStructureDto.feeTypeId !== existing.feeTypeId);
    if (dimensionsChanged && (existing._count.studentCharges > 0 || existing._count.payments > 0)) {
      throw new BadRequestException('This fee structure is already used by student charges or payments. Create a new structure instead of changing its year, term, class, category, or fee type.');
    }
    return this.prisma.financeStructure.update({
      where: { id },
      data: {
        academicYearId: updateFeeStructureDto.academicYearId,
        termId: updateFeeStructureDto.termId,
        classId: updateFeeStructureDto.classId,
        studentCategoryId: updateFeeStructureDto.studentCategoryId,
        feeTypeId: updateFeeStructureDto.feeTypeId,
        expectedAmount: updateFeeStructureDto.expectedAmount,
        isActive: updateFeeStructureDto.isActive,
        updatedByUserId: user?.id,
      } as any,
      include: feeStructureInclude,
    });
  }

  async setFeeStructureStatus(
    id: string,
    isActive: boolean,
    user?: RequestUser,
  ) {
    return this.prisma.financeStructure.update({
      where: { id },
      data: { isActive, updatedByUserId: user?.id } as any,
      include: feeStructureInclude,
    });
  }

  async applyFeeStructure(id: string) {
    const structure = await this.prisma.financeStructure.findUnique({ where: { id } });
    if (!structure) throw new NotFoundException('Fee structure not found');

    const students = await this.prisma.student.findMany({
      where: {
        academicYearId: structure.academicYearId,
        termId: structure.termId,
        classId: structure.classId,
        studentCategoryId: structure.studentCategoryId,
        isActive: true,
      },
      select: { id: true },
    });

    if (students.length === 0) return { applied: 0, skipped: 0 };
    const result = await this.prisma.studentCharge.createMany({
      data: students.map((student) => ({
        studentId: student.id,
        financeStructureId: structure.id,
        expectedAmount: structure.expectedAmount,
      })),
      skipDuplicates: true,
    });
    return { applied: result.count, skipped: students.length - result.count };
  }

  private chargeStatus(expectedAmount: number, paidAmount: number, waivedAmount: number) {
    const balance = expectedAmount - paidAmount - waivedAmount;
    if (waivedAmount >= expectedAmount) return 'WAIVED';
    if (balance < 0) return 'OVERPAID';
    if (balance === 0) return 'FULLY_PAID';
    return paidAmount > 0 || waivedAmount > 0 ? 'PARTIALLY_PAID' : 'NOT_PAID';
  }

  private receiptNumber(paymentDate: string) {
    return `MHS-${paymentDate.slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  async create(createFinanceDto: CreateFinanceDto, user?: RequestUser) {
    return this.prisma.$transaction(async (tx) => {
      let studentTermFeeId = createFinanceDto.studentTermFeeId;
      let studentChargeId = createFinanceDto.studentChargeId;
      let financeStructureId = createFinanceDto.financeStructureId;
      let feeTypeId = createFinanceDto.feeTypeId;

      if (studentChargeId) {
        const charge = await tx.studentCharge.findUnique({
          where: { id: studentChargeId },
          include: { financeStructure: true },
        });
        if (!charge || charge.studentId !== createFinanceDto.studentId) {
          throw new BadRequestException('The selected charge does not belong to this student');
        }
        financeStructureId = charge.financeStructureId;
        feeTypeId = charge.financeStructure.feeTypeId;
      }
      if (financeStructureId && !studentChargeId) {
        const structure = await tx.financeStructure.findUnique({
          where: { id: financeStructureId },
        });
        if (!structure) {
          throw new BadRequestException('The selected fee structure does not exist');
        }
        const charge = await tx.studentCharge.upsert({
          where: {
            studentId_financeStructureId: {
              studentId: createFinanceDto.studentId,
              financeStructureId,
            },
          },
          update: {},
          create: {
            studentId: createFinanceDto.studentId,
            financeStructureId,
            expectedAmount: structure.expectedAmount,
          },
        });
        studentChargeId = charge.id;
        feeTypeId = structure.feeTypeId;
      }
      if (feeTypeId && !studentChargeId) {
        const feeType = await tx.feeType.findUnique({ where: { id: feeTypeId } });
        if (!feeType || !feeType.isActive) {
          throw new BadRequestException('The selected fee type is not available');
        }
        const student = await tx.student.findUnique({ where: { id: createFinanceDto.studentId } });
        if (!student?.academicYearId || !student.termId || !student.classId || !student.studentCategoryId) {
          throw new BadRequestException('Complete the student academic placement before recording a payment');
        }
        const structure = await tx.financeStructure.findFirst({
          where: {
            academicYearId: student.academicYearId,
            termId: student.termId,
            classId: student.classId,
            studentCategoryId: student.studentCategoryId,
            feeTypeId,
            isActive: true,
          },
        });
        if (!structure) {
          throw new BadRequestException(`No active ${feeType.name} structure matches this student's year, term, class, and category`);
        }
        const charge = await tx.studentCharge.upsert({
          where: { studentId_financeStructureId: { studentId: student.id, financeStructureId: structure.id } },
          update: {},
          create: { studentId: student.id, financeStructureId: structure.id, expectedAmount: structure.expectedAmount },
        });
        studentChargeId = charge.id;
        financeStructureId = structure.id;
      }
      if (!studentChargeId) {
        throw new BadRequestException(
          'Select the exact student charge, including its academic year, term, class, category, and fee type',
        );
      }
      if (studentTermFeeId) {
        const termFee = await tx.studentTermFee.findUnique({
          where: { id: studentTermFeeId },
          select: { studentId: true },
        });
        if (!termFee || termFee.studentId !== createFinanceDto.studentId) {
          throw new BadRequestException(
            'The term fee does not belong to this student',
          );
        }
      }

      const paymentDate = toKampalaLocalDateTime(createFinanceDto.date);
      const payment = await tx.payment.create({
        data: {
          studentId: createFinanceDto.studentId,
          studentTermFeeId: studentTermFeeId || undefined,
          studentChargeId: studentChargeId || undefined,
          financeStructureId: financeStructureId || undefined,
          feeTypeId: feeTypeId || undefined,
          amount: createFinanceDto.amount,
          method: createFinanceDto.method,
          status: createFinanceDto.status ?? 'COMPLETED',
          description: createFinanceDto.description,
          transactionReference: createFinanceDto.transactionReference,
          proofUrl: createFinanceDto.proofUrl,
          proofFileName: createFinanceDto.proofFileName,
          receiptNumber: this.receiptNumber(paymentDate),
          recordedByUserId: user?.id,
          date: paymentDate,
        },
        include: paymentInclude,
      });

      if (studentTermFeeId) {
        await tx.studentTermFee.update({
          where: { id: studentTermFeeId },
          data: { amountPaid: { increment: createFinanceDto.amount } },
        });
      }

      if (studentChargeId && payment.status === 'COMPLETED') {
        const charge = await tx.studentCharge.update({
          where: { id: studentChargeId },
          data: { paidAmount: { increment: createFinanceDto.amount } },
        });
        await tx.studentCharge.update({
          where: { id: charge.id },
          data: { status: this.chargeStatus(charge.expectedAmount, charge.paidAmount, charge.waivedAmount) },
        });
      }

      await tx.paymentAudit.create({
        data: { paymentId: payment.id, action: 'CREATED', actorUserId: user?.id, changes: { amount: payment.amount, status: payment.status } },
      });

      return payment;
    }, { maxWait: 20_000, timeout: 30_000 });
  }

  async findAll(filters: ListPaymentsDto) {
    const search = filters.search?.trim();
    const structureWhere = {
      academicYearId: filters.academicYearId || undefined,
      termId: filters.termId || undefined,
      classId: filters.classId || undefined,
      studentCategoryId: filters.studentCategoryId || undefined,
      feeTypeId: filters.feeTypeId || undefined,
    };
    const hasStructureFilter = Object.values(structureWhere).some(Boolean);
    const where = {
      date: filters.startDate || filters.endDate ? {
        gte: filters.startDate ? paymentDateBoundary(filters.startDate) : undefined,
        lte: filters.endDate ? paymentDateBoundary(filters.endDate, true) : undefined,
      } : undefined,
      method: filters.method || undefined,
      status: filters.status ? { equals: filters.status, mode: 'insensitive' as const } : undefined,
      recordedByUserId: filters.recordedByUserId || undefined,
      studentCharge: hasStructureFilter ? { financeStructure: structureWhere } : undefined,
      OR: search ? [
        { receiptNumber: { contains: search, mode: 'insensitive' as const } },
        { transactionReference: { contains: search, mode: 'insensitive' as const } },
        { student: { firstName: { contains: search, mode: 'insensitive' as const } } },
        { student: { lastName: { contains: search, mode: 'insensitive' as const } } },
        { student: { admissionNumber: { contains: search, mode: 'insensitive' as const } } },
      ] : undefined,
    };
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where, orderBy: { date: 'desc' }, include: paymentInclude, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async getPaymentOptions() {
    const [academicYears, terms, classes, studentCategories, feeTypes, recordedByUsers] = await Promise.all([
      this.prisma.academicYear.findMany({ orderBy: { name: 'desc' } }),
      this.prisma.term.findMany({ include: { academicYear: true }, orderBy: [{ academicYear: { name: 'desc' } }, { name: 'asc' }] }),
      this.prisma.schoolClass.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      this.prisma.studentCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      this.prisma.feeType.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      this.prisma.user.findMany({ where: { recordedPayments: { some: {} } }, select: { id: true, email: true }, orderBy: { email: 'asc' } }),
    ]);
    return { academicYears, terms, classes, studentCategories, feeTypes, recordedByUsers };
  }

  async searchPaymentStudents(filters: SearchPaymentStudentsDto) {
    const search = filters.search?.trim();
    return this.prisma.student.findMany({
      where: {
        isActive: true,
        classId: filters.classId || undefined,
        OR: search ? [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { admissionNumber: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      select: { id: true, firstName: true, lastName: true, admissionNumber: true, schoolClass: { select: { id: true, name: true } }, studentCategory: { select: { id: true, name: true } } },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: filters.limit || 15,
    });
  }

  async cancelDraftPayment(id: string, user?: RequestUser) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Payment not found');
      if (!['DRAFT', 'REJECTED'].includes(existing.status.toUpperCase())) {
        throw new BadRequestException('Only draft or rejected payments can be removed. Reverse a completed payment instead.');
      }
      const payment = await tx.payment.update({ where: { id }, data: { status: 'CANCELLED' }, include: paymentInclude });
      await tx.paymentAudit.create({ data: { paymentId: id, action: 'CANCELLED', actorUserId: user?.id, reason: 'Removed from active payment records' } });
      return payment;
    }, { maxWait: 20_000, timeout: 30_000 });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: paymentInclude,
    });
  }

  async listStudentAccounts(filters: { academicYearId?: string; termId?: string; classId?: string; studentCategoryId?: string; search?: string; status?: string }) {
    const search = filters.search?.trim();
    const students = await this.prisma.student.findMany({
      where: {
        academicYearId: filters.academicYearId || undefined, termId: filters.termId || undefined,
        classId: filters.classId || undefined, studentCategoryId: filters.studentCategoryId || undefined,
        OR: search ? [{ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { admissionNumber: { contains: search, mode: 'insensitive' } }] : undefined,
      },
      include: { schoolClass: true, studentCategory: true, academicYear: true, term: true, financeCharges: true },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
    return students.map((student) => {
      const expectedAmount = student.financeCharges.reduce((sum, charge) => sum + charge.expectedAmount, 0);
      const paidAmount = student.financeCharges.reduce((sum, charge) => sum + charge.paidAmount, 0);
      const waivedAmount = student.financeCharges.reduce((sum, charge) => sum + charge.waivedAmount, 0);
      const status = this.chargeStatus(expectedAmount, paidAmount, waivedAmount);
      return { id: student.id, admissionNumber: student.admissionNumber, firstName: student.firstName, lastName: student.lastName, schoolClass: student.schoolClass, studentCategory: student.studentCategory, academicYear: student.academicYear, term: student.term, expectedAmount, paidAmount, waivedAmount, outstandingBalance: expectedAmount - paidAmount - waivedAmount, status };
    }).filter((student) => !filters.status || student.status === filters.status);
  }

  async syncStudentCharges(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, academicYearId: true, termId: true, classId: true, studentCategoryId: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    if (!student.academicYearId || !student.termId || !student.classId || !student.studentCategoryId) {
      throw new BadRequestException('Complete the student academic year, term, class, and category before assigning fees');
    }
    const structures = await this.prisma.financeStructure.findMany({
      where: {
        academicYearId: student.academicYearId,
        termId: student.termId,
        classId: student.classId,
        studentCategoryId: student.studentCategoryId,
        isActive: true,
      },
    });
    if (structures.length) {
      await this.prisma.studentCharge.createMany({
        data: structures.map((structure) => ({ studentId, financeStructureId: structure.id, expectedAmount: structure.expectedAmount })),
        skipDuplicates: true,
      });
    }
    return this.getStudentAccount(studentId);
  }

  async getStudentAccount(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        schoolClass: true, studentCategory: true, academicYear: true, term: true,
        financeCharges: { include: { financeStructure: { include: { feeType: true, term: true, academicYear: true, schoolClass: true, studentCategory: true } }, payments: { include: paymentInclude } } },
        payments: { include: paymentInclude, orderBy: { date: 'desc' } },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    const expectedAmount = student.financeCharges.reduce((sum, charge) => sum + charge.expectedAmount, 0);
    const paidAmount = student.financeCharges.reduce((sum, charge) => sum + charge.paidAmount, 0);
    const waivedAmount = student.financeCharges.reduce((sum, charge) => sum + charge.waivedAmount, 0);
    const previousBalances = student.financeCharges.filter((charge) => charge.financeStructure.termId !== student.termId && charge.expectedAmount - charge.paidAmount - charge.waivedAmount > 0).map((charge) => ({ id: charge.id, academicYear: charge.financeStructure.academicYear.name, term: charge.financeStructure.term.name, feeType: charge.financeStructure.feeType.name, expectedAmount: charge.expectedAmount, paidAmount: charge.paidAmount, waivedAmount: charge.waivedAmount, balance: charge.expectedAmount - charge.paidAmount - charge.waivedAmount }));
    return { student, summary: { expectedAmount, paidAmount, waivedAmount, outstandingBalance: expectedAmount - paidAmount - waivedAmount, status: this.chargeStatus(expectedAmount, paidAmount, waivedAmount), previousBalance: previousBalances.reduce((sum, item) => sum + item.balance, 0) }, charges: student.financeCharges, payments: student.payments, previousBalances };
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto, user?: RequestUser) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Payment not found');

      // Approved finance amounts and statuses are never edited in place.
      // Corrections use the audited reversal flow followed by a new payment.
      const amount = existing.amount;
      const payment = await tx.payment.update({
        where: { id },
        data: {
          method: updateFinanceDto.method,
          description: updateFinanceDto.description,
          transactionReference: updateFinanceDto.transactionReference,
          proofUrl: updateFinanceDto.proofUrl,
          proofFileName: updateFinanceDto.proofFileName,
          date: updateFinanceDto.date
            ? toKampalaLocalDateTime(updateFinanceDto.date)
            : undefined,
        },
        include: paymentInclude,
      });

      await tx.paymentAudit.create({ data: { paymentId: id, action: 'EDITED', actorUserId: user?.id, changes: updateFinanceDto as object } });

      return payment;
    }, { maxWait: 20_000, timeout: 30_000 });
  }

  async reversePayment(id: string, reason: string, user?: RequestUser) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Payment not found');

      if (existing.status === 'REVERSED') throw new BadRequestException('This payment has already been reversed');
      const payment = await tx.payment.update({ where: { id }, data: { status: 'REVERSED', reversalReason: reason, reversedAt: new Date(), reversedByUserId: user?.id }, include: paymentInclude });
      if (existing.studentTermFeeId && existing.status === 'COMPLETED') {
        await tx.studentTermFee.update({
          where: { id: existing.studentTermFeeId },
          data: { amountPaid: { decrement: existing.amount } },
        });
      }

      if (existing.studentChargeId && existing.status === 'COMPLETED') {
        const charge = await tx.studentCharge.update({ where: { id: existing.studentChargeId }, data: { paidAmount: { decrement: existing.amount } } });
        await tx.studentCharge.update({ where: { id: charge.id }, data: { status: this.chargeStatus(charge.expectedAmount, charge.paidAmount, charge.waivedAmount) } });
      }
      await tx.paymentAudit.create({ data: { paymentId: id, action: 'REVERSED', reason, actorUserId: user?.id } });

      return payment;
    }, { maxWait: 20_000, timeout: 30_000 });
  }

  async createExpense(dto: CreateExpenseDto, user?: RequestUser) {
    let payeeName = dto.payeeName;
    if (dto.payeeType === 'TEACHER') {
      if (!dto.teacherId) throw new BadRequestException('Select the teacher receiving this expense');
      const teacher = await this.prisma.teacher.findUnique({ where: { id: dto.teacherId } });
      if (!teacher) throw new BadRequestException('The selected teacher does not exist');
      payeeName = [teacher.firstName, teacher.middleName, teacher.lastName].filter(Boolean).join(' ');
    }
    return this.prisma.expense.create({
      data: { ...dto, payeeName, expenseDate: dto.expenseDate ? new Date(`${dto.expenseDate}T12:00:00`) : undefined, status: 'PENDING_APPROVAL', createdByUserId: user?.id },
      include: { teacher: true, createdBy: { select: { email: true } }, approvedBy: { select: { email: true } } },
    });
  }

  async listOtherIncome() {
    return this.prisma.otherIncome.findMany({ include: { recordedBy: { select: { email: true } } }, orderBy: { incomeDate: 'desc' } });
  }

  async createOtherIncome(dto: CreateOtherIncomeDto, user?: RequestUser) {
    return this.prisma.otherIncome.create({ data: { ...dto, incomeDate: dto.incomeDate ? new Date(dto.incomeDate) : undefined, recordedByUserId: user?.id }, include: { recordedBy: { select: { email: true } } } });
  }

  async listExpenses(filters: ListExpensesDto) {
    const search = filters.search?.trim();
    const where = {
      expenseDate: filters.startDate || filters.endDate ? { gte: filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : undefined, lte: filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : undefined } : undefined,
      category: filters.category || undefined,
      payeeType: filters.payeeType || undefined,
      teacherId: filters.teacherId || undefined,
      method: filters.method || undefined,
      status: filters.status || undefined,
      OR: search ? [
        { payeeName: { contains: search, mode: 'insensitive' as const } },
        { category: { contains: search, mode: 'insensitive' as const } },
        { referenceNumber: { contains: search, mode: 'insensitive' as const } },
      ] : undefined,
    };
    const page = filters.page || 1; const pageSize = filters.pageSize || 20;
    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({ where, include: { teacher: true, createdBy: { select: { email: true } }, approvedBy: { select: { email: true } } }, orderBy: { expenseDate: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.expense.count({ where }),
    ]);
    return { data, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async getExpenseOptions() {
    const teachers = await this.prisma.teacher.findMany({ where: { employment: { status: 'active' } }, select: { id: true, firstName: true, middleName: true, lastName: true, employment: { select: { employeeNumber: true, position: true } } }, orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] });
    return { teachers };
  }

  async decideExpense(id: string, status: string, reason?: string, user?: RequestUser) {
    const existing = await this.prisma.expense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Expense not found');
    return this.prisma.expense.update({
      where: { id },
      data: { status, approvalReason: reason, approvedByUserId: user?.id, approvedAt: new Date() },
      include: { teacher: true, createdBy: { select: { email: true } }, approvedBy: { select: { email: true } } },
    });
  }

  async listPayrollTeachers() {
    return this.prisma.teacher.findMany({
      where: { employment: { status: 'active' } },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        profilePhoto: true,
        employment: true,
        expenses: {
          where: { category: 'STAFF_SALARY' },
          orderBy: { payrollPeriod: 'desc' },
          take: 12,
        },
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
  }

  async createPayrollPayment(dto: CreatePayrollPaymentDto, user?: RequestUser) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: dto.teacherId },
      include: { employment: true },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (!teacher.employment) throw new BadRequestException('Teacher employment details are missing');

    const grossPay = dto.basicSalary + dto.allowances;
    const netPay = grossPay - dto.deductions - dto.advances;
    if (netPay < 0) throw new BadRequestException('Deductions and advances cannot exceed gross pay');

    const existing = await this.prisma.expense.findFirst({
      where: { teacherId: dto.teacherId, payrollPeriod: dto.payrollPeriod, category: 'STAFF_SALARY' },
    });
    if (existing) throw new BadRequestException('A salary payment already exists for this teacher and period');

    return this.prisma.expense.create({
      data: {
        category: 'STAFF_SALARY',
        amount: netPay,
        payeeType: 'TEACHER',
        payeeName: [teacher.firstName, teacher.middleName, teacher.lastName].filter(Boolean).join(' '),
        teacherId: teacher.id,
        method: dto.method,
        description: dto.description,
        referenceNumber: dto.referenceNumber,
        proofUrl: dto.proofUrl,
        proofFileName: dto.proofFileName,
        payrollPeriod: dto.payrollPeriod,
        basicSalary: dto.basicSalary,
        allowances: dto.allowances,
        deductions: dto.deductions,
        advances: dto.advances,
        grossPay,
        netPay,
        status: 'PENDING_APPROVAL',
        createdByUserId: user?.id,
      },
      include: { teacher: { include: { employment: true } }, createdBy: { select: { email: true } }, approvedBy: { select: { email: true } } },
    });
  }

  async getSummary(filters: { start?: string; end?: string; termId?: string; academicYearId?: string } = {}) {
    const dateFilter = filters.start || filters.end ? {
      gte: filters.start ? new Date(filters.start) : undefined,
      lte: filters.end ? new Date(filters.end) : undefined,
    } : undefined;
    const paymentDateFilter = filters.start || filters.end ? {
      gte: filters.start ? paymentDateBoundary(filters.start) : undefined,
      lte: filters.end ? paymentDateBoundary(filters.end, true) : undefined,
    } : undefined;
    const structureWhere = {
      termId: filters.termId || undefined,
      academicYearId: filters.academicYearId || undefined,
    };

    const [charges, payments, expenses, otherIncomeRecords, activeSalaryTotal] = await Promise.all([
      this.prisma.studentCharge.findMany({
        where: { financeStructure: structureWhere },
        include: { student: true, financeStructure: { include: { schoolClass: true, feeType: true, term: true } } },
      }),
      this.prisma.payment.findMany({
        where: {
          status: { in: ['COMPLETED', 'completed'] },
          date: paymentDateFilter,
          studentCharge: filters.termId || filters.academicYearId ? { financeStructure: structureWhere } : undefined,
        },
        include: {
          student: true,
          feeType: true,
          studentCharge: { include: { financeStructure: { include: { schoolClass: true, feeType: true } } } },
          recordedBy: { select: { email: true } },
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.findMany({
        where: { status: 'PAID', expenseDate: dateFilter },
        include: { teacher: true, createdBy: { select: { email: true } } },
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.otherIncome.findMany({ where: { status: 'RECEIVED', incomeDate: dateFilter }, orderBy: { incomeDate: 'desc' } }),
      this.prisma.teacherEmployment.aggregate({ where: { status: 'active' }, _sum: { salary: true } }),
    ]);

    const expectedStudentFees = charges.reduce((sum, charge) => sum + charge.expectedAmount, 0);
    const chargePaid = charges.reduce((sum, charge) => sum + charge.paidAmount, 0);
    const waived = charges.reduce((sum, charge) => sum + charge.waivedAmount, 0);
    const feesCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const otherIncome = otherIncomeRecords.reduce((sum, income) => sum + income.amount, 0);
    const staffPayments = expenses.filter((expense) => expense.category === 'STAFF_SALARY').reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySalaryObligation = activeSalaryTotal._sum.salary ?? 0;

    const studentBalances = new Map<string, { expected: number; paid: number; waived: number; overdue: number }>();
    for (const charge of charges) {
      const current = studentBalances.get(charge.studentId) ?? { expected: 0, paid: 0, waived: 0, overdue: 0 };
      current.expected += charge.expectedAmount;
      current.paid += charge.paidAmount;
      current.waived += charge.waivedAmount;
      const balance = charge.expectedAmount - charge.paidAmount - charge.waivedAmount;
      if (balance > 0 && charge.financeStructure.term.endDate && charge.financeStructure.term.endDate < new Date()) current.overdue += balance;
      studentBalances.set(charge.studentId, current);
    }
    let fullyPaid = 0; let partiallyPaid = 0; let unpaid = 0; let overdueBalances = 0;
    for (const account of studentBalances.values()) {
      const balance = account.expected - account.paid - account.waived;
      if (balance <= 0) fullyPaid += 1;
      else if (account.paid > 0 || account.waived > 0) partiallyPaid += 1;
      else unpaid += 1;
      overdueBalances += account.overdue;
    }

    const byClass = new Map<string, number>();
    const byFeeType = new Map<string, number>();
    const series = new Map<string, { income: number; expenses: number }>();
    for (const payment of payments) {
      const structure = payment.studentCharge?.financeStructure;
      const className = structure?.schoolClass.name ?? 'Unallocated';
      const feeName = structure?.feeType.name ?? payment.feeType?.name ?? 'Unallocated';
      byClass.set(className, (byClass.get(className) ?? 0) + payment.amount);
      byFeeType.set(feeName, (byFeeType.get(feeName) ?? 0) + payment.amount);
      const key = payment.date.slice(0, 10);
      const point = series.get(key) ?? { income: 0, expenses: 0 };
      point.income += payment.amount; series.set(key, point);
    }
    for (const expense of expenses) {
      const key = expense.expenseDate.toISOString().slice(0, 10);
      const point = series.get(key) ?? { income: 0, expenses: 0 };
      point.expenses += expense.amount; series.set(key, point);
    }
    for (const income of otherIncomeRecords) {
      const key = income.incomeDate.toISOString().slice(0, 10);
      const point = series.get(key) ?? { income: 0, expenses: 0 };
      point.income += income.amount; series.set(key, point);
    }

    return {
      expectedStudentFees,
      feesCollected,
      outstandingBalance: expectedStudentFees - chargePaid - waived,
      otherIncome,
      totalExpenses,
      staffPayments,
      availableBalance: feesCollected + otherIncome - totalExpenses,
      paymentCount: payments.length,
      expenseCount: expenses.length,
      collectionPercentage: expectedStudentFees ? Math.round((chargePaid / expectedStudentFees) * 100) : 0,
      outstandingSummary: { fullyPaid, partiallyPaid, unpaid, studentsWithBalances: partiallyPaid + unpaid, overdueBalances },
      upcomingStaffSalaryObligations: Math.max(0, monthlySalaryObligation - staffPayments),
      collectionByClass: Array.from(byClass, ([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount),
      collectionByFeeType: Array.from(byFeeType, ([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount),
      incomeExpenseSeries: Array.from(series, ([date, values]) => ({ date, ...values })).sort((a, b) => a.date.localeCompare(b.date)),
      recentPayments: payments.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
    };
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

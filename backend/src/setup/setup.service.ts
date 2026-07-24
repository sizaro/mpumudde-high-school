import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SetupService {
  constructor(private readonly prisma: PrismaService) {}

  async createAcademicYear(data: { name: string; isActive?: boolean }) {
    return this.prisma.academicYear.create({
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
  }

  async listAcademicYears() {
    return this.prisma.academicYear.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAcademicYear(id: string, data: { name?: string; isActive?: boolean }) {
    return this.prisma.academicYear.update({
      where: { id },
      data,
    });
  }

  async createTerm(data: { academicYearId: string; name: string; feeAmount?: number; startDate?: string; endDate?: string; isActive?: boolean }) {
    return this.prisma.term.create({
      data: {
        academicYearId: data.academicYearId,
        name: data.name,
        feeAmount: data.feeAmount ?? 0,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive ?? true,
      },
      include: { academicYear: true },
    });
  }

  async listTerms() {
    return this.prisma.term.findMany({
      include: { academicYear: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTerm(id: string, data: { academicYearId?: string; name?: string; feeAmount?: number; startDate?: string; endDate?: string; isActive?: boolean }) {
    return this.prisma.term.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: { academicYear: true },
    });
  }

  async createClass(data: { name: string; isActive?: boolean }) {
    return this.prisma.schoolClass.create({
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
  }

  async listClasses() {
    return this.prisma.schoolClass.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateClass(id: string, data: { name?: string; isActive?: boolean }) {
    return this.prisma.schoolClass.update({ where: { id }, data });
  }

  async createStudentCategory(data: { name: string; isActive?: boolean }) {
    return this.prisma.studentCategory.create({
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
  }

  async listStudentCategories() {
    return this.prisma.studentCategory.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStudentCategory(id: string, data: { name?: string; isActive?: boolean }) {
    return this.prisma.studentCategory.update({ where: { id }, data });
  }

  async createFeeType(data: { name: string; isActive?: boolean }) {
    return this.prisma.feeType.create({
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
  }

  async listFeeTypes() {
    return this.prisma.feeType.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateFeeType(id: string, data: { name?: string; isActive?: boolean }) {
    return this.prisma.feeType.update({ where: { id }, data });
  }

  async createFinanceStructure(data: { academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; expectedAmount: number }) {
    return this.prisma.financeStructure.create({
      data: {
        academicYearId: data.academicYearId,
        termId: data.termId,
        classId: data.classId,
        studentCategoryId: data.studentCategoryId,
        feeTypeId: data.feeTypeId,
        expectedAmount: data.expectedAmount,
      },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        feeType: true,
      },
    });
  }

  async listFinanceStructures() {
    return this.prisma.financeStructure.findMany({
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        feeType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateFinanceStructure(id: string, data: { academicYearId?: string; termId?: string; classId?: string; studentCategoryId?: string; feeTypeId?: string; expectedAmount?: number }) {
    return this.prisma.financeStructure.update({
      where: { id },
      data,
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        feeType: true,
      },
    });
  }

  async getRegistrationData() {
    const [academicYears, terms, classes, studentCategories, feeTypes] = await Promise.all([
      this.prisma.academicYear.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.term.findMany({ include: { academicYear: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.schoolClass.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.studentCategory.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.feeType.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      academicYears,
      terms,
      classes,
      studentCategories,
      feeTypes,
    };
  }
}

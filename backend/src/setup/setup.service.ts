import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SetupService {
  constructor(private readonly prisma: PrismaService) {}

  private academicYearStatus(value?: string) {
    const status = String(value ?? 'UPCOMING').toUpperCase();
    if (!['UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'].includes(status)) {
      throw new BadRequestException('Academic year status must be UPCOMING, ACTIVE, COMPLETED, or ARCHIVED.');
    }
    return status;
  }

  private termStatus(value?: string) {
    const status = String(value ?? 'UPCOMING').toUpperCase();
    if (!['UPCOMING', 'ACTIVE', 'COMPLETED'].includes(status)) {
      throw new BadRequestException('Term status must be UPCOMING, ACTIVE, or COMPLETED.');
    }
    return status;
  }

  async createAcademicYear(data: { name: string; startDate?: string; endDate?: string; status?: string; isActive?: boolean }) {
    const status = this.academicYearStatus(data.status ?? (data.isActive ? 'ACTIVE' : 'UPCOMING'));
    return this.prisma.$transaction(async (tx) => {
      if (status === 'ACTIVE') {
        await tx.academicYear.updateMany({
          where: { status: 'ACTIVE' },
          data: { status: 'COMPLETED', isActive: false },
        });
      }
      return tx.academicYear.create({
        data: {
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          status,
          isActive: status === 'ACTIVE',
          terms: {
            create: ['Term 1', 'Term 2', 'Term 3'].map((name) => ({
              name,
              status: 'UPCOMING',
              isActive: false,
            })),
          },
        },
        include: { terms: true },
      });
    });
  }

  async ensureStandardTerms(academicYearId: string) {
    await this.prisma.$transaction(['Term 1', 'Term 2', 'Term 3'].map((name) =>
      this.prisma.term.upsert({
        where: { academicYearId_name: { academicYearId, name } },
        create: { academicYearId, name, isActive: false, status: 'UPCOMING' },
        update: {},
      }),
    ));
    return this.prisma.term.findMany({ where: { academicYearId }, orderBy: { name: 'asc' } });
  }

  async listAcademicYears() {
    return this.prisma.academicYear.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAcademicYear(id: string, data: { name?: string; startDate?: string; endDate?: string; status?: string; isActive?: boolean }) {
    const requestedStatus = data.status ?? (data.isActive === true ? 'ACTIVE' : data.isActive === false ? 'COMPLETED' : undefined);
    const status = requestedStatus ? this.academicYearStatus(requestedStatus) : undefined;
    const current = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Academic year not found.');

    const startDate = data.startDate === '' ? null : data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate === '' ? null : data.endDate ? new Date(data.endDate) : undefined;
    const effectiveStartDate = startDate === undefined ? current.startDate : startDate;
    const effectiveEndDate = endDate === undefined ? current.endDate : endDate;
    if (effectiveStartDate && effectiveEndDate && effectiveEndDate < effectiveStartDate) {
      throw new BadRequestException('Academic year end date cannot be before its start date.');
    }

    const update = this.prisma.academicYear.update({
      where: { id },
      data: {
        name: data.name?.trim() || undefined,
        startDate,
        endDate,
        status,
        isActive: status ? status === 'ACTIVE' : undefined,
      },
    });

    if (status !== 'ACTIVE') return update;

    // A batch transaction avoids a long-lived interactive transaction when the
    // database is hosted remotely. The old active year is closed before the
    // selected year is activated, preserving the single-active-year rule.
    const [, activatedYear] = await this.prisma.$transaction([
      this.prisma.academicYear.updateMany({
        where: { status: 'ACTIVE', id: { not: id } },
        data: { status: 'COMPLETED', isActive: false },
      }),
      update,
    ]);
    return activatedYear;
  }

  async getActiveContext() {
    const academicYear = await this.prisma.academicYear.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        terms: { orderBy: { name: 'asc' } },
        classOfferings: {
          where: { isActive: true },
          include: {
            schoolClass: true,
            classSubjects: {
              where: { isActive: true },
              include: { subject: true },
            },
          },
        },
      },
    });
    return {
      academicYear,
      term: academicYear?.terms.find((item) => item.status === 'ACTIVE') ?? null,
    };
  }

  async listAcademicYearClasses(academicYearId: string) {
    return this.prisma.academicYearClass.findMany({
      where: { academicYearId, isActive: true, schoolClass: { isActive: true } },
      include: { schoolClass: true },
      orderBy: { schoolClass: { name: 'asc' } },
    });
  }

  async setAcademicYearClasses(academicYearId: string, classIds: string[]) {
    const uniqueClassIds = [...new Set(classIds.filter(Boolean))];
    const [academicYear, classCount] = await Promise.all([
      this.prisma.academicYear.findUnique({ where: { id: academicYearId }, select: { id: true } }),
      this.prisma.schoolClass.count({ where: { id: { in: uniqueClassIds }, isActive: true } }),
    ]);
    if (!academicYear) throw new NotFoundException('Academic year not found.');
    if (classCount !== uniqueClassIds.length) throw new BadRequestException('One or more selected classes are unavailable.');

    await this.prisma.$transaction(async (tx) => {
      await tx.academicYearClass.updateMany({
        where: {
          academicYearId,
          ...(uniqueClassIds.length ? { classId: { notIn: uniqueClassIds } } : {}),
        },
        data: { isActive: false },
      });
      for (const classId of uniqueClassIds) {
        await tx.academicYearClass.upsert({
          where: { academicYearId_classId: { academicYearId, classId } },
          create: { academicYearId, classId, isActive: true },
          update: { isActive: true },
        });
      }
    });
    return this.listAcademicYearClasses(academicYearId);
  }

  async listClassSubjects(academicYearClassId: string) {
    return this.prisma.classSubject.findMany({
      where: { academicYearClassId },
      include: {
        subject: true,
        academicYearClass: { include: { academicYear: true, schoolClass: true } },
      },
      orderBy: { subject: { name: 'asc' } },
    });
  }

  async setClassSubjects(academicYearClassId: string, subjectIds: string[]) {
    const uniqueSubjectIds = [...new Set(subjectIds.filter(Boolean))];
    const [offering, subjectCount] = await Promise.all([
      this.prisma.academicYearClass.findUnique({ where: { id: academicYearClassId }, select: { id: true } }),
      this.prisma.subject.count({ where: { id: { in: uniqueSubjectIds }, isActive: true } }),
    ]);
    if (!offering) throw new NotFoundException('Academic-year class not found.');
    if (subjectCount !== uniqueSubjectIds.length) {
      throw new BadRequestException('One or more selected subjects are unavailable.');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.classSubject.updateMany({
        where: {
          academicYearClassId,
          ...(uniqueSubjectIds.length ? { subjectId: { notIn: uniqueSubjectIds } } : {}),
        },
        data: { isActive: false },
      });
      for (const subjectId of uniqueSubjectIds) {
        await tx.classSubject.upsert({
          where: { academicYearClassId_subjectId: { academicYearClassId, subjectId } },
          create: { academicYearClassId, subjectId, isActive: true },
          update: { isActive: true },
        });
      }
    });
    return this.listClassSubjects(academicYearClassId);
  }

  async createTerm(data: { academicYearId: string; name: string; startDate?: string; endDate?: string; status?: string; isActive?: boolean }) {
    const status = this.termStatus(data.status ?? (data.isActive ? 'ACTIVE' : 'UPCOMING'));
    return this.prisma.$transaction(async (tx) => {
      if (status === 'ACTIVE') {
        const year = await tx.academicYear.findUnique({ where: { id: data.academicYearId }, select: { status: true } });
        if (year?.status !== 'ACTIVE') throw new BadRequestException('Only a term in the active academic year can be activated.');
        await tx.term.updateMany({ where: { status: 'ACTIVE' }, data: { status: 'COMPLETED', isActive: false } });
      }
      return tx.term.create({
        data: {
          academicYearId: data.academicYearId,
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          status,
          isActive: status === 'ACTIVE',
        },
        include: { academicYear: true },
      });
    });
  }

  async listTerms() {
    return this.prisma.term.findMany({
      include: { academicYear: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTerm(id: string, data: { academicYearId?: string; name?: string; startDate?: string; endDate?: string; status?: string; isActive?: boolean }) {
    const requestedStatus = data.status ?? (data.isActive === true ? 'ACTIVE' : data.isActive === false ? 'COMPLETED' : undefined);
    const status = requestedStatus ? this.termStatus(requestedStatus) : undefined;
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.term.findUnique({ where: { id }, select: { academicYearId: true } });
      if (!current) throw new NotFoundException('Term not found.');
      const academicYearId = data.academicYearId ?? current.academicYearId;
      if (status === 'ACTIVE') {
        const year = await tx.academicYear.findUnique({ where: { id: academicYearId }, select: { status: true } });
        if (year?.status !== 'ACTIVE') throw new BadRequestException('Only a term in the active academic year can be activated.');
        await tx.term.updateMany({ where: { status: 'ACTIVE', id: { not: id } }, data: { status: 'COMPLETED', isActive: false } });
      }
      return tx.term.update({
        where: { id },
        data: {
          academicYearId: data.academicYearId,
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : data.startDate === '' ? null : undefined,
          endDate: data.endDate ? new Date(data.endDate) : data.endDate === '' ? null : undefined,
          status,
          isActive: status ? status === 'ACTIVE' : undefined,
        },
        include: { academicYear: true },
      });
    });
  }

  async createClass(data: { name: string; academicYearId?: string; isActive?: boolean }) {
    const name = data.name?.trim();
    if (!name) throw new BadRequestException('Class name is required.');
    if (!data.academicYearId) {
      throw new BadRequestException('Select the academic year in which this class is offered.');
    }
    const academicYearId = data.academicYearId;

    return this.prisma.$transaction(async (tx) => {
      const academicYear = await tx.academicYear.findUnique({
        where: { id: academicYearId },
        select: { id: true, status: true },
      });
      if (!academicYear || academicYear.status === 'ARCHIVED') {
        throw new BadRequestException('The selected academic year is unavailable.');
      }

      const schoolClass = await tx.schoolClass.upsert({
        where: { name },
        create: { name, isActive: data.isActive ?? true },
        update: { isActive: data.isActive ?? true },
      });
      await tx.academicYearClass.upsert({
        where: {
          academicYearId_classId: {
            academicYearId,
            classId: schoolClass.id,
          },
        },
        create: {
          academicYearId,
          classId: schoolClass.id,
          isActive: true,
        },
        update: { isActive: true },
      });
      return schoolClass;
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
    const [term, classOffering] = await Promise.all([
      this.prisma.term.findFirst({ where: { id: data.termId, academicYearId: data.academicYearId }, select: { id: true } }),
      this.prisma.academicYearClass.findFirst({ where: { academicYearId: data.academicYearId, classId: data.classId, isActive: true }, select: { id: true } }),
    ]);
    if (!term || !classOffering) throw new BadRequestException('Select a term and class offered in the academic year.');
    return this.prisma.financeStructure.create({
      data: {
        academicYearId: data.academicYearId,
        termId: data.termId,
        classId: data.classId,
        studentCategoryId: data.studentCategoryId,
        feeTypeId: data.feeTypeId,
        academicYearClassId: classOffering.id,
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
    const [academicYears, terms, classes, academicYearClasses, classSubjects, studentCategories, feeTypes, activeContext] = await Promise.all([
      this.prisma.academicYear.findMany({ where: { status: { not: 'ARCHIVED' } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.term.findMany({ where: { academicYear: { status: { not: 'ARCHIVED' } } }, include: { academicYear: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.schoolClass.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.academicYearClass.findMany({ where: { isActive: true, academicYear: { status: { not: 'ARCHIVED' } }, schoolClass: { isActive: true } }, include: { schoolClass: true, academicYear: true } }),
      this.prisma.classSubject.findMany({ where: { isActive: true }, include: { subject: true, academicYearClass: { include: { schoolClass: true, academicYear: true } } } }),
      this.prisma.studentCategory.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.feeType.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      this.getActiveContext(),
    ]);

    return {
      academicYears,
      terms,
      classes,
      academicYearClasses,
      classSubjects,
      studentCategories,
      feeTypes,
      activeContext,
    };
  }
}

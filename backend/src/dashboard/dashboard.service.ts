import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FinanceService } from '../finance/finance.service.js';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
  ) {}

  async getDirectorOverview() {
    const activeAcademicYear = await this.prisma.academicYear.findFirst({
      where: { isActive: true },
      orderBy: { name: 'desc' },
    });
    const activeTerm = await this.prisma.term.findFirst({
      where: {
        isActive: true,
        academicYearId: activeAcademicYear?.id,
      },
      include: { academicYear: true },
      orderBy: { startDate: 'desc' },
    });

    const [
      finance,
      totalStudents,
      activeStudents,
      totalTeachers,
      activeTeachers,
      activeClasses,
      activeSubjects,
      studentsMissingPlacement,
      teachersWithoutSubjects,
      pendingExpenses,
      recentStudents,
      recentTeachers,
    ] = await Promise.all([
      // A school-wide overview must include previous-term debts and payments.
      // Multiple terms may be active for setup/registration purposes, so choosing
      // one "active" term here would silently hide valid financial records.
      this.financeService.getSummary(),
      this.prisma.student.count(),
      this.prisma.student.count({ where: { isActive: true } }),
      this.prisma.teacher.count(),
      this.prisma.teacher.count({
        where: { user: { isActive: true }, employment: { status: 'active' } },
      }),
      this.prisma.schoolClass.count({ where: { isActive: true } }),
      this.prisma.subject.count({ where: { isActive: true } }),
      this.prisma.student.count({
        where: {
          isActive: true,
          OR: [
            { academicYearId: null },
            { termId: null },
            { classId: null },
            { studentCategoryId: null },
          ],
        },
      }),
      this.prisma.teacher.count({
        where: { user: { isActive: true }, teachingAssignments: { none: {} } },
      }),
      this.prisma.expense.count({ where: { status: 'PENDING_APPROVAL' } }),
      this.prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admissionNumber: true,
          isActive: true,
          createdAt: true,
          schoolClass: { select: { name: true } },
        },
      }),
      this.prisma.teacher.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          employment: { select: { employeeNumber: true, position: true, status: true } },
        },
      }),
    ]);

    return {
      period: {
        academicYear: activeTerm?.academicYear.name ?? activeAcademicYear?.name ?? null,
        term: activeTerm?.name ?? null,
      },
      school: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        totalTeachers,
        activeTeachers,
        inactiveTeachers: totalTeachers - activeTeachers,
        activeClasses,
        activeSubjects,
      },
      attention: {
        studentsMissingPlacement,
        teachersWithoutSubjects,
        pendingExpenses,
        studentsWithBalances: finance.outstandingSummary.studentsWithBalances,
      },
      finance,
      recentStudents,
      recentTeachers,
    };
  }
}

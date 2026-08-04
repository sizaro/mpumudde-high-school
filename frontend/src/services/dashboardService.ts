import api from "../api/axios";
import type { FinanceSummary } from "./financeOverviewService";

export type DirectorDashboard = {
  period: { academicYear: string | null; term: string | null };
  school: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    totalTeachers: number;
    activeTeachers: number;
    inactiveTeachers: number;
    activeClasses: number;
    activeSubjects: number;
  };
  attention: {
    studentsMissingPlacement: number;
    teachersWithoutSubjects: number;
    pendingExpenses: number;
    studentsWithBalances: number;
  };
  finance: FinanceSummary;
  recentStudents: Array<{
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    isActive: boolean;
    createdAt: string;
    schoolClass?: { name: string } | null;
  }>;
  recentTeachers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    employment?: {
      employeeNumber: string;
      position?: string | null;
      status: string;
    } | null;
  }>;
};

class DashboardService {
  async getDirectorOverview(): Promise<DirectorDashboard> {
    const { data } = await api.get<Record<string, any>>("/dashboard");
    const school = data?.school ?? data ?? {};
    const attention = data?.attention ?? {};
    const finance = data?.finance ?? {};
    const outstandingSummary = finance?.outstandingSummary ?? {};

    return {
      period: {
        academicYear: data?.period?.academicYear ?? null,
        term: data?.period?.term ?? null,
      },
      school: {
        totalStudents: Number(school.totalStudents ?? 0),
        activeStudents: Number(school.activeStudents ?? school.totalStudents ?? 0),
        inactiveStudents: Number(school.inactiveStudents ?? 0),
        totalTeachers: Number(school.totalTeachers ?? 0),
        activeTeachers: Number(school.activeTeachers ?? school.totalTeachers ?? 0),
        inactiveTeachers: Number(school.inactiveTeachers ?? 0),
        activeClasses: Number(school.activeClasses ?? school.totalClasses ?? 0),
        activeSubjects: Number(school.activeSubjects ?? school.totalSubjects ?? 0),
      },
      attention: {
        studentsMissingPlacement: Number(attention.studentsMissingPlacement ?? 0),
        teachersWithoutSubjects: Number(attention.teachersWithoutSubjects ?? 0),
        pendingExpenses: Number(attention.pendingExpenses ?? 0),
        studentsWithBalances: Number(attention.studentsWithBalances ?? outstandingSummary.studentsWithBalances ?? 0),
      },
      finance: {
        expectedStudentFees: Number(finance.expectedStudentFees ?? 0),
        feesCollected: Number(finance.feesCollected ?? 0),
        outstandingBalance: Number(finance.outstandingBalance ?? 0),
        otherIncome: Number(finance.otherIncome ?? 0),
        totalExpenses: Number(finance.totalExpenses ?? 0),
        staffPayments: Number(finance.staffPayments ?? 0),
        availableBalance: Number(finance.availableBalance ?? 0),
        paymentCount: Number(finance.paymentCount ?? 0),
        expenseCount: Number(finance.expenseCount ?? 0),
        collectionPercentage: Number(finance.collectionPercentage ?? 0),
        outstandingSummary: {
          fullyPaid: Number(outstandingSummary.fullyPaid ?? 0),
          partiallyPaid: Number(outstandingSummary.partiallyPaid ?? 0),
          unpaid: Number(outstandingSummary.unpaid ?? 0),
          studentsWithBalances: Number(outstandingSummary.studentsWithBalances ?? 0),
          overdueBalances: Number(outstandingSummary.overdueBalances ?? 0),
        },
        upcomingStaffSalaryObligations: Number(finance.upcomingStaffSalaryObligations ?? 0),
        collectionByClass: Array.isArray(finance.collectionByClass) ? finance.collectionByClass : [],
        collectionByFeeType: Array.isArray(finance.collectionByFeeType) ? finance.collectionByFeeType : [],
        incomeExpenseSeries: Array.isArray(finance.incomeExpenseSeries) ? finance.incomeExpenseSeries : [],
        recentPayments: Array.isArray(finance.recentPayments) ? finance.recentPayments : [],
        recentExpenses: Array.isArray(finance.recentExpenses) ? finance.recentExpenses : [],
      },
      recentStudents: Array.isArray(data?.recentStudents) ? data.recentStudents : [],
      recentTeachers: Array.isArray(data?.recentTeachers) ? data.recentTeachers : [],
    };
  }
}

export default new DashboardService();

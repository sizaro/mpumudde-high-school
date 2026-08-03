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
    const { data } = await api.get<DirectorDashboard>("/dashboard");
    return data;
  }
}

export default new DashboardService();

import api from "../api/axios";

export type ParentChildOverview = {
  studentId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  isPrimary: boolean;
  relationship: string | null;
  className: string | null;
  academicYear: string | null;
  term: string | null;
};

export type ParentProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  occupation: string | null;
  profilePhoto: string | null;
};

export type ParentStudentProfile = {
  profile: {
    id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    passportPhoto: string | null;
    className: string | null;
    academicYear: string | null;
  };
  attendance: Array<{
    date: string | null;
    subject: string | null;
    teacher: string | null;
    status: string;
  }>;
  finance: {
    payments: Array<{
      id: string;
      amount: number;
      method: string | null;
      status: string | null;
      date: string | null;
      description: string | null;
    }>;
    totalPaid: number;
  };
  academicPerformance: {
    message: string;
    grades: unknown[];
  };
};

export type ParentDashboardResponse = {
  parent: ParentProfile;
  children?: ParentChildOverview[];
  student?: ParentStudentProfile;
};

class ParentService {
  async getMyFinance() {
    const { data } = await api.get("/parents/me/finance");
    return data;
  }

  async updateParent(id: string, payload: Record<string, unknown>) {
    const { data } = await api.patch(`/parents/${id}`, payload);
    return data;
  }

  async getDashboard(studentId?: string): Promise<ParentDashboardResponse> {
    const url = studentId
      ? `/parents/me/dashboard?studentId=${studentId}`
      : "/parents/me/dashboard";
    const { data } = await api.get<ParentDashboardResponse>(url);
    return data;
  }

  async updateProfile(payload: {
    phone?: string | null;
    address?: string | null;
    occupation?: string | null;
    profilePhoto?: string | null;
  }): Promise<ParentProfile> {
    const { data } = await api.patch<ParentProfile>("/parents/me", payload);
    return data;
  }
}

export default new ParentService();

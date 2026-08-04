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
  termStartDate: string | null;
  termEndDate: string | null;
  profilePhoto: string | null;
  finance: { totalExpected: number; totalPaid: number; outstandingBalance: number };
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

export type GuardianChildLink = {
  id: string;
  relationship: string | null;
  isPrimary: boolean;
  isActive: boolean;
  unlinkedAt?: string | null;
  unlinkReason?: string | null;
  student: {
    id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    passportPhoto?: string | null;
    schoolClass?: { id: string; name: string } | null;
    academicYear?: { id: string; name: string } | null;
    term?: { id: string; name: string } | null;
  };
};

export type GuardianDocument = {
  id: string;
  documentCategoryId: string;
  originalFileName: string;
  fileUrl: string;
  mimeType?: string | null;
  fileExtension?: string | null;
  fileSize?: number | null;
  createdAt: string;
  documentCategory: { id: string; name: string };
};

export type Guardian = ParentProfile & {
  gender: string | null;
  relationship: string | null;
  identityDocumentType: string | null;
  identityDocumentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  archivedAt?: string | null;
  user: {
    id: string;
    email: string;
    username: string | null;
    isActive: boolean;
    isLoggedIn: boolean;
    lastLogin: string | null;
  } | null;
  students: GuardianChildLink[];
  documents: GuardianDocument[];
};

export type GuardianDocumentCategory = { id: string; name: string; description?: string | null };
export type GuardianDocumentInput = {
  documentCategoryId: string;
  originalFileName: string;
  fileUrl: string;
  title?: string;
  mimeType?: string;
  fileExtension?: string;
  fileSize?: number;
};

export type GuardianCredentials = {
  email: string;
  temporaryPassword: string;
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
      receiptNumber: string | null;
      proofUrl: string | null;
      proofFileName: string | null;
      feeType: string | null;
    }>;
    charges: Array<{
      id: string;
      feeType: string;
      academicYear: string | null;
      term: string | null;
      expectedAmount: number;
      paidAmount: number;
      waivedAmount: number;
      balance: number;
      status: string;
    }>;
    totalExpected: number;
    totalPaid: number;
    totalWaived: number;
    outstandingBalance: number;
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
  familySummary?: {
    totalExpected: number;
    totalPaid: number;
    outstandingBalance: number;
    childrenWithBalances: number;
    fullyPaidChildren: number;
    recentAttendanceRecords: number;
    recentPresent: number;
    recentAbsent: number;
    recentLate: number;
  };
};

class ParentService {
  async getGuardians(): Promise<Guardian[]> {
    const { data } = await api.get<Guardian[]>('/parents');
    return data;
  }

  async getGuardian(id: string): Promise<Guardian> {
    const { data } = await api.get<Guardian>(`/parents/${id}`);
    return data;
  }

  async createGuardian(payload: Record<string, unknown>): Promise<{ parent: Guardian; temporaryPassword?: string; credentials?: { email: string } }> {
    const { data } = await api.post('/parents', payload);
    return data;
  }

  async getMyFinance() {
    const { data } = await api.get("/parents/me/finance");
    return data;
  }

  async updateParent(id: string, payload: Record<string, unknown>) {
    const { data } = await api.patch(`/parents/${id}`, payload);
    return data;
  }

  async updateGuardianComplete(id: string, payload: Record<string, unknown>): Promise<Guardian> {
    const { data } = await api.put<Guardian>(`/parents/${id}/complete`, payload);
    return data;
  }

  async deleteGuardian(id: string): Promise<void> {
    await api.delete(`/parents/${id}`);
  }

  async linkStudent(id: string, payload: { studentId: string; relationship?: string; isPrimary?: boolean }) {
    const { data } = await api.post(`/parents/${id}/students`, payload);
    return data;
  }

  async unlinkStudent(id: string, studentId: string, reason?: string): Promise<void> {
    await api.delete(`/parents/${id}/students/${studentId}`, { data: { reason } });
  }

  async getGuardianDocumentCategories(): Promise<GuardianDocumentCategory[]> {
    const { data } = await api.get<GuardianDocumentCategory[]>('/document-categories?entityType=PARENT');
    return data;
  }

  async addGuardianDocument(id: string, payload: GuardianDocumentInput): Promise<GuardianDocument> {
    const { data } = await api.post<GuardianDocument>(`/parents/${id}/documents`, payload);
    return data;
  }

  async removeGuardianDocument(id: string, documentId: string): Promise<void> {
    await api.delete(`/parents/${id}/documents/${documentId}`);
  }

  async createPortalAccount(id: string, loginEmail?: string): Promise<{ user: Guardian['user']; temporaryPassword: string }> {
    const { data } = await api.post(`/parents/${id}/portal-account`, { loginEmail: loginEmail || undefined });
    return data;
  }

  async resetPortalPassword(id: string): Promise<{ user: Guardian['user']; temporaryPassword: string }> {
    const { data } = await api.post(`/parents/${id}/reset-password`);
    return data;
  }

  async updatePortalStatus(id: string, isActive: boolean) {
    const { data } = await api.patch(`/parents/${id}/account-status`, { isActive });
    return data;
  }

  async getDashboard(studentId?: string): Promise<ParentDashboardResponse> {
    const url = studentId
      ? `/parents/me/dashboard?studentId=${studentId}`
      : "/parents/me/dashboard";
    const { data } = await api.get<ParentDashboardResponse>(url);
    return data;
  }

  async getChildAttendance(studentId: string, filters?: { startDate?: string; endDate?: string; subjectId?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.subjectId) params.set('subjectId', filters.subjectId);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    const { data } = await api.get<{
      student: { id: string; firstName: string; lastName: string; admissionNumber: string; passportPhoto: string | null; schoolClass: { name: string } | null };
      subjects: Array<{ id: string; name: string }>;
      records: Array<{ id: string; status: string; date: string; subjectId: string; subject: string; teacher: string }>;
    }>(`/parents/me/children/${studentId}/attendance${suffix}`);
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

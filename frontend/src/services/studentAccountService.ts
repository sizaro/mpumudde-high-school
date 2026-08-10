import api from "../api/axios";

export type AccountStatus =
  | "FULLY_PAID"
  | "PARTIALLY_PAID"
  | "NOT_PAID"
  | "OVERPAID"
  | "WAIVED";
export type StudentAccount = {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  schoolClass?: { id: string; name: string } | null;
  studentCategory?: { id: string; name: string } | null;
  academicYear?: { id: string; name: string } | null;
  term?: { id: string; name: string } | null;
  expectedAmount: number;
  paidAmount: number;
  waivedAmount: number;
  outstandingBalance: number;
  status: AccountStatus;
};
export type StudentAccountDetails = {
  student: StudentAccount;
  summary: {
    expectedAmount: number;
    paidAmount: number;
    waivedAmount: number;
    outstandingBalance: number;
    previousBalance: number;
    status: AccountStatus;
  };
  charges: Array<{
    id: string;
    expectedAmount: number;
    paidAmount: number;
    waivedAmount: number;
    status: AccountStatus;
    financeStructure: {
      feeType: { id: string; name: string };
      term: { id: string; name: string };
      academicYear: { id: string; name: string };
      schoolClass: { id: string; name: string };
      studentCategory: { id: string; name: string };
    };
    payments?: Array<{
      id: string;
      amount: number;
      method: string;
      status: string;
      date: string;
      receiptNumber?: string | null;
      proofUrl?: string | null;
      proofFileName?: string | null;
    }>;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    date: string;
    receiptNumber?: string | null;
    transactionReference?: string | null;
    proofUrl?: string | null;
    proofFileName?: string | null;
    description?: string | null;
    feeType?: { name: string } | null;
    recordedBy?: { email: string } | null;
    studentCharge?: {
      id: string;
      expectedAmount: number;
      paidAmount: number;
      waivedAmount: number;
      status: AccountStatus;
    } | null;
  }>;
  previousBalances: Array<{
    id: string;
    academicYear: string;
    term: string;
    feeType: string;
    expectedAmount: number;
    paidAmount: number;
    waivedAmount: number;
    balance: number;
  }>;
};
export type StudentAccountFilters = Partial<{
  academicYearId: string;
  termId: string;
  classId: string;
  studentCategoryId: string;
  search: string;
  status: AccountStatus;
}>;

class StudentAccountService {
  async list(filters: StudentAccountFilters = {}): Promise<StudentAccount[]> {
    const { data } = await api.get<StudentAccount[]>(
      "/finance/student-accounts",
      { params: filters },
    );
    return data;
  }
  async get(studentId: string): Promise<StudentAccountDetails> {
    const { data } = await api.get<StudentAccountDetails>(
      `/finance/student-accounts/${studentId}`,
    );
    return data;
  }
  async syncCharges(studentId: string): Promise<StudentAccountDetails> {
    const { data } = await api.post<StudentAccountDetails>(
      `/finance/student-accounts/${studentId}/sync-charges`,
    );
    return data;
  }
}

export default new StudentAccountService();

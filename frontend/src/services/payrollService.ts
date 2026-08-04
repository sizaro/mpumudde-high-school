import api from "../api/axios";

export type PayrollExpense = {
  id: string;
  teacherId: string;
  payrollPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  advances: number;
  grossPay: number;
  netPay: number;
  amount: number;
  method: string;
  status: string;
  proofUrl?: string | null;
  proofFileName?: string | null;
  referenceNumber?: string | null;
  description?: string | null;
  approvedBy?: { email: string } | null;
  approvedAt?: string | null;
  expenseDate: string;
};

export type PayrollTeacher = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  profilePhoto?: string | null;
  employment?: {
    employeeNumber: string;
    position?: string | null;
    department?: string | null;
    employmentType?: string | null;
    salary?: number | null;
    payFrequency?: string | null;
    status?: string | null;
  } | null;
  expenses: PayrollExpense[];
};

export type PayrollInput = {
  teacherId: string;
  payrollPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  advances: number;
  method: string;
  description?: string;
  referenceNumber?: string;
  proofUrl?: string;
  proofFileName?: string;
};

class PayrollService {
  async listTeachers(): Promise<PayrollTeacher[]> {
    const { data } = await api.get<PayrollTeacher[]>("/finance/payroll/teachers");
    return data;
  }

  async createPayment(input: PayrollInput): Promise<PayrollExpense> {
    const { data } = await api.post<PayrollExpense>("/finance/payroll/payments", input);
    return data;
  }

  async updateSalary(teacher: PayrollTeacher, salary: number, payFrequency: string): Promise<void> {
    if (!teacher.employment) throw new Error("Employment record missing");
    await api.put(`/teachers/${teacher.id}/employment`, { ...teacher.employment, salary, payFrequency });
  }
}

export default new PayrollService();

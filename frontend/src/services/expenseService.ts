import api from "../api/axios";
export type Expense = { id: string; category: string; amount: number; payeeType: string; payeeName: string; teacherId?: string | null; method: string; expenseDate: string; description?: string | null; referenceNumber?: string | null; proofUrl?: string | null; proofFileName?: string | null; status: string; approvalReason?: string | null; payrollPeriod?: string | null; basicSalary?: number | null; allowances?: number; deductions?: number; advances?: number; grossPay?: number | null; netPay?: number | null; teacher?: { firstName: string; lastName: string } | null; createdBy?: { email: string } | null; approvedBy?: { email: string } | null };
export type ExpenseInput = Omit<Partial<Expense>, "id" | "status" | "teacher" | "createdBy" | "approvedBy"> & { category: string; amount: number; payeeType: string; payeeName: string; method: string };
export type ExpenseFilters = Partial<{ page: number; pageSize: number; search: string; startDate: string; endDate: string; category: string; payeeType: string; teacherId: string; method: string; status: string }>;
export type ExpensePage = { data: Expense[]; page: number; pageSize: number; total: number; totalPages: number };
export type ExpenseTeacher = { id: string; firstName: string; middleName?: string | null; lastName: string; employment?: { employeeNumber: string; position?: string | null } | null };
class ExpenseService {
  async list(filters: ExpenseFilters = {}): Promise<ExpensePage> { const { data } = await api.get<ExpensePage>("/finance/expenses", { params: filters }); return data; }
  async listAll(): Promise<Expense[]> { const first = await this.list({ page: 1, pageSize: 100 }); if (first.totalPages <= 1) return first.data; const rest = await Promise.all(Array.from({ length: first.totalPages - 1 }, (_, index) => this.list({ page: index + 2, pageSize: 100 }))); return [first, ...rest].flatMap((page) => page.data); }
  async getOptions(): Promise<{ teachers: ExpenseTeacher[] }> { const { data } = await api.get<{ teachers: ExpenseTeacher[] }>("/finance/expense-options"); return data; }
  async create(input: ExpenseInput): Promise<Expense> { const { data } = await api.post<Expense>("/finance/expenses", input); return data; }
  async decide(id: string, status: "APPROVED" | "REJECTED" | "PAID" | "CANCELLED", reason?: string): Promise<Expense> { const { data } = await api.patch<Expense>(`/finance/expenses/${id}/decision`, { status, reason }); return data; }
  async uploadProof(file: File): Promise<{ url: string }> { const form = new FormData(); form.append("file", file); const { data } = await api.post<{ url: string }>("/upload", form, { headers: { "Content-Type": "multipart/form-data" } }); return data; }
}
export default new ExpenseService();

import api from "../api/axios";

export type PaymentMethod = "CASH" | "MOBILE_MONEY" | "BANK_DEPOSIT" | "BANK_TRANSFER" | "CHEQUE" | "CARD" | "OTHER";
export type PaymentInput = { studentId: string; studentChargeId?: string; feeTypeId?: string; amount: number; method: PaymentMethod; transactionReference?: string; date?: string; description?: string; proofUrl?: string; proofFileName?: string };
export type PaymentStructure = { academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; academicYear?: { id: string; name: string }; term?: { id: string; name: string }; schoolClass?: { id: string; name: string }; studentCategory?: { id: string; name: string }; feeType?: { id: string; name: string } };
export type FinancePayment = PaymentInput & { id: string; status: string; receiptNumber?: string | null; proofUrl?: string | null; proofFileName?: string | null; date: string; student?: PaymentStudent; feeType?: { id: string; name: string } | null; studentCharge?: { financeStructure?: PaymentStructure | null } | null; recordedBy?: { id?: string; email: string } | null; reversedBy?: { id?: string; email: string } | null; reversalReason?: string | null; reversedAt?: string | null; audits?: Array<{ id: string; action: string; reason?: string | null; changes?: unknown; createdAt: string; actor?: { email: string } | null }>; createdAt: string };
export type PaymentStudent = { id: string; firstName: string; lastName: string; admissionNumber: string; academicYearId?: string | null; termId?: string | null; classId?: string | null; studentCategoryId?: string | null; schoolClass?: { id: string; name: string } | null; studentCategory?: { id: string; name: string } | null };
export type PaymentFilters = Partial<{ page: number; pageSize: number; search: string; startDate: string; endDate: string; academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; method: string; status: string; recordedByUserId: string }>;
export type PaginatedPayments = { data: FinancePayment[]; page: number; pageSize: number; total: number; totalPages: number };
type Named = { id: string; name: string; academicYearId?: string };
export type PaymentOptions = { academicYears: Named[]; terms: Named[]; classes: Named[]; studentCategories: Named[]; feeTypes: Named[]; recordedByUsers: Array<{ id: string; email: string }> };

class PaymentService {
  async list(filters: PaymentFilters = {}): Promise<PaginatedPayments> { const { data } = await api.get<PaginatedPayments>("/finance", { params: filters }); return data; }
  async listAll(filters: Omit<PaymentFilters, "page" | "pageSize"> = {}): Promise<FinancePayment[]> { const first = await this.list({ ...filters, page: 1, pageSize: 100 }); if (first.totalPages <= 1) return first.data; const remaining = await Promise.all(Array.from({ length: first.totalPages - 1 }, (_, index) => this.list({ ...filters, page: index + 2, pageSize: 100 }))); return [first, ...remaining].flatMap((page) => page.data); }
  async getOptions(): Promise<PaymentOptions> { const { data } = await api.get<PaymentOptions>("/finance/payment-options"); return data; }
  async searchStudents(search = "", classId = ""): Promise<PaymentStudent[]> { const { data } = await api.get<PaymentStudent[]>("/finance/payment-options/students", { params: { search: search || undefined, classId: classId || undefined, limit: 15 } }); return data; }
  async get(id: string): Promise<FinancePayment> { const { data } = await api.get<FinancePayment>(`/finance/${id}`); return data; }
  async create(input: PaymentInput): Promise<FinancePayment> { const { data } = await api.post<FinancePayment>("/finance", input); return data; }
  async update(id: string, input: Partial<PaymentInput>): Promise<FinancePayment> { const { data } = await api.patch<FinancePayment>(`/finance/${id}`, input); return data; }
  async reverse(id: string, reason: string): Promise<FinancePayment> { const { data } = await api.post<FinancePayment>(`/finance/${id}/reverse`, { reason }); return data; }
  async removeDraft(id: string): Promise<FinancePayment> { const { data } = await api.delete<FinancePayment>(`/finance/${id}`); return data; }
  async uploadProof(file: File): Promise<{ url: string }> { const form = new FormData(); form.append("file", file); const { data } = await api.post<{ url: string }>("/upload", form, { headers: { "Content-Type": "multipart/form-data" } }); return data; }
}
export default new PaymentService();

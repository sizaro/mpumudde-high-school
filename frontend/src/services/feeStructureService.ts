import api from "../api/axios";

export type FinanceStructure = {
  id: string; academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string;
  expectedAmount: number; isActive: boolean; createdAt: string; updatedAt: string;
  academicYear?: { id: string; name: string }; term?: { id: string; name: string; academicYearId: string };
  schoolClass?: { id: string; name: string }; studentCategory?: { id: string; name: string }; feeType?: { id: string; name: string };
  createdBy?: { id: string; email: string } | null; updatedBy?: { id: string; email: string } | null;
};

export type FeeStructurePayload = { academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; expectedAmount: number; isActive?: boolean };
export type FeeStructureFilters = Partial<{ search: string; academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; isActive: string }>;

class FeeStructureService {
  async list(filters: FeeStructureFilters = {}): Promise<FinanceStructure[]> { const { data } = await api.get<FinanceStructure[]>("/finance/fee-structures", { params: filters }); return data; }
  async get(id: string): Promise<FinanceStructure> { const { data } = await api.get<FinanceStructure>(`/finance/fee-structures/${id}`); return data; }
  async create(payload: FeeStructurePayload): Promise<FinanceStructure> { const { data } = await api.post<FinanceStructure>("/finance/fee-structures", payload); return data; }
  async update(id: string, payload: Partial<FeeStructurePayload>): Promise<FinanceStructure> { const { data } = await api.patch<FinanceStructure>(`/finance/fee-structures/${id}`, payload); return data; }
  async setStatus(id: string, isActive: boolean): Promise<FinanceStructure> { const action = isActive ? "activate" : "deactivate"; const { data } = await api.patch<FinanceStructure>(`/finance/fee-structures/${id}/${action}`); return data; }
  async applyToStudents(id: string): Promise<{ applied: number; skipped: number }> { const { data } = await api.post<{ applied: number; skipped: number }>(`/finance/fee-structures/${id}/apply`); return data; }
}

export default new FeeStructureService();

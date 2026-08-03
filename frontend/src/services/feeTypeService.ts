import api from "../api/axios";

export type FinanceFeeType = { id: string; name: string; isActive: boolean; createdAt: string; updatedAt: string; _count: { financeStructures: number; payments: number } };
class FeeTypeService {
  async list(): Promise<FinanceFeeType[]> { const { data } = await api.get<FinanceFeeType[]>("/finance/fee-types"); return data; }
  async create(payload: { name: string; isActive?: boolean }): Promise<FinanceFeeType> { const { data } = await api.post<FinanceFeeType>("/finance/fee-types", payload); return data; }
  async update(id: string, payload: { name?: string; isActive?: boolean }): Promise<FinanceFeeType> { const { data } = await api.patch<FinanceFeeType>(`/finance/fee-types/${id}`, payload); return data; }
  async delete(id: string): Promise<void> { await api.delete(`/finance/fee-types/${id}`); }
}
export default new FeeTypeService();

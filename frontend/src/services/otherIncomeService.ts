import api from "../api/axios";
export type OtherIncome = { id: string; category: string; amount: number; source: string; method: string; incomeDate: string; description?: string | null; referenceNumber?: string | null; proofUrl?: string | null; proofFileName?: string | null; status: string; recordedBy?: { email: string } | null };
export type OtherIncomeInput = { category: string; amount: number; source: string; method: string; incomeDate?: string; description?: string; referenceNumber?: string; proofUrl?: string; proofFileName?: string };
class OtherIncomeService { async list(): Promise<OtherIncome[]> { const { data } = await api.get<OtherIncome[]>("/finance/other-income"); return data; } async create(input: OtherIncomeInput): Promise<OtherIncome> { const { data } = await api.post<OtherIncome>("/finance/other-income", input); return data; } }
export default new OtherIncomeService();

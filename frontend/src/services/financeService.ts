import api from "../api/axios";
import type { Payment } from "../types/api.types";

class FinanceService {
  async getPayments(): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>("/finance");
    return data;
  }

  async createPayment(payload: {
    studentId: string;
    amount: number;
    method: string;
    status?: string;
    description?: string;
    date?: string;
  }): Promise<Payment> {
    const { data } = await api.post<Payment>("/finance", payload);
    return data;
  }
}

export default new FinanceService();

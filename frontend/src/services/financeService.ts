import api from "../api/axios";
import type { Payment } from "../types/api.types";

class FinanceService {
  async getPayments(): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>("/finance");
    return data;
  }
}

export default new FinanceService();

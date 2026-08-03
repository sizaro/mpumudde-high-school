import api from "../api/axios";
import type { Payment } from "../types/api.types";

export type FinanceStructure = {
  id: string;
  academicYearId: string;
  termId: string;
  classId: string;
  studentCategoryId: string;
  feeTypeId: string;
  expectedAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  academicYear?: { id: string; name: string };
  term?: { id: string; name: string; academicYearId: string };
  schoolClass?: { id: string; name: string };
  studentCategory?: { id: string; name: string };
  feeType?: { id: string; name: string };
  createdBy?: { id: string; email: string } | null;
  updatedBy?: { id: string; email: string } | null;
};

export type FinanceStructureFilters = {
  search?: string;
  academicYearId?: string;
  termId?: string;
  classId?: string;
  studentCategoryId?: string;
  feeTypeId?: string;
  isActive?: string;
};

class FinanceService {
  async getPayments(): Promise<Payment[]> {
    const { data: first } = await api.get<{ data: Payment[]; totalPages: number }>("/finance", { params: { page: 1, pageSize: 100 } });
    if (first.totalPages <= 1) return first.data;
    const remaining = await Promise.all(Array.from({ length: first.totalPages - 1 }, (_, index) => api.get<{ data: Payment[] }>("/finance", { params: { page: index + 2, pageSize: 100 } })));
    return [first.data, ...remaining.map((response) => response.data.data)].flat();
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

  async getFeeStructures(
    filters: FinanceStructureFilters = {},
  ): Promise<FinanceStructure[]> {
    const { data } = await api.get<FinanceStructure[]>(
      "/finance/fee-structures",
      { params: filters },
    );
    return data;
  }

  async getFeeStructure(id: string): Promise<FinanceStructure> {
    const { data } = await api.get<FinanceStructure>(
      `/finance/fee-structures/${id}`,
    );
    return data;
  }

  async createFeeStructure(payload: {
    academicYearId: string;
    termId: string;
    classId: string;
    studentCategoryId: string;
    feeTypeId: string;
    expectedAmount: number;
    isActive?: boolean;
  }): Promise<FinanceStructure> {
    const { data } = await api.post<FinanceStructure>(
      "/finance/fee-structures",
      payload,
    );
    return data;
  }

  async updateFeeStructure(
    id: string,
    payload: Partial<{
      academicYearId: string;
      termId: string;
      classId: string;
      studentCategoryId: string;
      feeTypeId: string;
      expectedAmount: number;
      isActive: boolean;
    }>,
  ): Promise<FinanceStructure> {
    const { data } = await api.patch<FinanceStructure>(
      `/finance/fee-structures/${id}`,
      payload,
    );
    return data;
  }

  async activateFeeStructure(id: string): Promise<FinanceStructure> {
    const { data } = await api.patch<FinanceStructure>(
      `/finance/fee-structures/${id}/activate`,
    );
    return data;
  }

  async deactivateFeeStructure(id: string): Promise<FinanceStructure> {
    const { data } = await api.patch<FinanceStructure>(
      `/finance/fee-structures/${id}/deactivate`,
    );
    return data;
  }
}

export default new FinanceService();

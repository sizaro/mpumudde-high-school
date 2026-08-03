import api from "../api/axios";

export type FinanceSummaryGroup = { label: string; amount: number };
export type FinanceSummary = {
  expectedStudentFees: number;
  feesCollected: number;
  outstandingBalance: number;
  otherIncome: number;
  totalExpenses: number;
  staffPayments: number;
  availableBalance: number;
  paymentCount: number;
  expenseCount: number;
  collectionPercentage: number;
  outstandingSummary: { fullyPaid: number; partiallyPaid: number; unpaid: number; studentsWithBalances: number; overdueBalances: number };
  upcomingStaffSalaryObligations: number;
  collectionByClass: FinanceSummaryGroup[];
  collectionByFeeType: FinanceSummaryGroup[];
  incomeExpenseSeries: Array<{ date: string; income: number; expenses: number }>;
  recentPayments: Array<{ id: string; amount: number; date: string; method: string; receiptNumber?: string | null; student?: { firstName: string; lastName: string; admissionNumber: string } }>;
  recentExpenses: Array<{ id: string; amount: number; expenseDate: string; category: string; payeeName: string; status: string }>;
};

class FinanceOverviewService {
  async getSummary(params: { start?: string; end?: string; termId?: string; academicYearId?: string } = {}): Promise<FinanceSummary> {
    const { data } = await api.get<FinanceSummary>("/finance/summary", { params });
    return data;
  }
}

export default new FinanceOverviewService();

import StudentAccountService, { type StudentAccount } from "./studentAccountService";
import PaymentService, { type FinancePayment } from "./paymentService";
import ExpenseService, { type Expense } from "./expenseService";

export type FinanceReportData = { accounts: StudentAccount[]; payments: FinancePayment[]; expenses: Expense[] };
export type FinanceReportFilters = Partial<{ search: string; startDate: string; endDate: string; academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; paymentMethod: string; expenseCategory: string; status: string; recordedBy: string }>;

const includes = (value: unknown, search: string) => String(value ?? "").toLowerCase().includes(search);
const inRange = (value: string, start?: string, end?: string) => (!start || value >= `${start}T00:00:00`) && (!end || value <= `${end}T23:59:59`);

class FinanceReportService {
  async load(): Promise<FinanceReportData> {
    const [accounts, payments, expenses] = await Promise.all([StudentAccountService.list(), PaymentService.listAll(), ExpenseService.listAll()]);
    return { accounts, payments, expenses };
  }

  filter(data: FinanceReportData, filters: FinanceReportFilters): FinanceReportData {
    const search = filters.search?.trim().toLowerCase() ?? "";
    const accounts = data.accounts.filter((account) =>
      (!search || [account.firstName, account.lastName, account.admissionNumber, account.schoolClass?.name, account.status].some((value) => includes(value, search))) &&
      (!filters.academicYearId || account.academicYear?.id === filters.academicYearId) && (!filters.termId || account.term?.id === filters.termId) &&
      (!filters.classId || account.schoolClass?.id === filters.classId) && (!filters.studentCategoryId || account.studentCategory?.id === filters.studentCategoryId) &&
      (!filters.status || account.status === filters.status));
    const payments = data.payments.filter((payment) => {
      const structure = payment.studentCharge?.financeStructure;
      return (!search || [payment.student?.firstName, payment.student?.lastName, payment.student?.admissionNumber, payment.receiptNumber, payment.transactionReference, payment.status].some((value) => includes(value, search))) &&
        inRange(payment.date, filters.startDate, filters.endDate) &&
        (!filters.academicYearId || structure?.academicYearId === filters.academicYearId || payment.student?.academicYearId === filters.academicYearId) &&
        (!filters.termId || structure?.termId === filters.termId || payment.student?.termId === filters.termId) &&
        (!filters.classId || structure?.classId === filters.classId || payment.student?.classId === filters.classId) &&
        (!filters.studentCategoryId || structure?.studentCategoryId === filters.studentCategoryId || payment.student?.studentCategoryId === filters.studentCategoryId) &&
        (!filters.feeTypeId || structure?.feeTypeId === filters.feeTypeId || payment.feeType?.id === filters.feeTypeId) &&
        (!filters.paymentMethod || payment.method === filters.paymentMethod) && (!filters.status || payment.status === filters.status) &&
        (!filters.recordedBy || payment.recordedBy?.email === filters.recordedBy);
    });
    const expenses = data.expenses.filter((expense) =>
      (!search || [expense.payeeName, expense.category, expense.referenceNumber, expense.status, expense.teacher?.firstName, expense.teacher?.lastName].some((value) => includes(value, search))) &&
      inRange(expense.expenseDate, filters.startDate, filters.endDate) && (!filters.expenseCategory || expense.category === filters.expenseCategory) &&
      (!filters.status || expense.status === filters.status) && (!filters.recordedBy || expense.createdBy?.email === filters.recordedBy));
    return { accounts, payments, expenses };
  }
}

export default new FinanceReportService();

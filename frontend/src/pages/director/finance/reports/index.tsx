import { useEffect, useMemo, useState } from "react";
import FinanceReportService, { type FinanceReportData, type FinanceReportFilters } from "../../../../services/financeReportService";
import SetupService, { type AcademicYear, type FeeType, type SchoolClass, type StudentCategory, type Term } from "../../../../services/setupService";
import ExpensesReport from "./ExpensesReport";
import FeeCollectionReport from "./FeeCollectionReport";
import FullyPaidStudentsReport from "./FullyPaidStudentsReport";
import IncomeExpenseReport from "./IncomeExpenseReport";
import OutstandingBalancesReport from "./OutstandingBalancesReport";
import PaymentAuditReport from "./PaymentAuditReport";
import PaymentsReport from "./PaymentsReport";
import ReportFilters from "./ReportFilters";
import StudentStatementReport from "./StudentStatementReport";

const reports = ["Fee Collection", "Outstanding Balances", "Fully Paid Students", "Payments", "Expenses", "Income vs Expenses", "Student Statements", "Reversed Transactions", "Payment Audit"] as const;
type Setup = { years: AcademicYear[]; terms: Term[]; classes: SchoolClass[]; categories: StudentCategory[]; feeTypes: FeeType[] };
export default function Reports() {
  const [active, setActive] = useState<(typeof reports)[number]>(reports[0]);
  const [data, setData] = useState<FinanceReportData | null>(null);
  const [setup, setSetup] = useState<Setup>({ years: [], terms: [], classes: [], categories: [], feeTypes: [] });
  const [filters, setFilters] = useState<FinanceReportFilters>({});
  const [error, setError] = useState("");
  useEffect(() => { void Promise.all([FinanceReportService.load(), SetupService.getAcademicYears(), SetupService.getTerms(), SetupService.getClasses(), SetupService.getStudentCategories(), SetupService.getFeeTypes()]).then(([reportData, years, terms, classes, categories, feeTypes]) => { setData(reportData); setSetup({ years, terms, classes, categories, feeTypes }); }).catch(() => setError("Finance report data could not be loaded.")); }, []);
  const filtered = useMemo(() => data ? FinanceReportService.filter(data, filters) : null, [data, filters]);
  const expenseCategories = useMemo(() => [...new Set(data?.expenses.map((item) => item.category) ?? [])].sort(), [data]);
  const recordedByUsers = useMemo(() => [...new Set([...(data?.payments.map((item) => item.recordedBy?.email).filter(Boolean) ?? []), ...(data?.expenses.map((item) => item.createdBy?.email).filter(Boolean) ?? [])] as string[])].sort(), [data]);
  const content = !filtered ? <p className="text-sm text-slate-500">Loading report data...</p> : active === "Fee Collection" ? <FeeCollectionReport data={filtered}/> : active === "Outstanding Balances" ? <OutstandingBalancesReport data={filtered}/> : active === "Fully Paid Students" ? <FullyPaidStudentsReport data={filtered}/> : active === "Payments" ? <PaymentsReport data={filtered}/> : active === "Expenses" ? <ExpensesReport data={filtered}/> : active === "Income vs Expenses" ? <IncomeExpenseReport data={filtered}/> : active === "Student Statements" ? <StudentStatementReport data={filtered}/> : active === "Reversed Transactions" ? <PaymentsReport data={{ ...filtered, payments: filtered.payments.filter((item) => item.status === "REVERSED") }}/> : <PaymentAuditReport data={filtered}/>;
  return <div className="mt-8 space-y-6">
    <div className="overflow-x-auto [scrollbar-width:thin]"><div className="flex min-w-max gap-2 pb-1">{reports.map((report) => <button key={report} type="button" onClick={() => setActive(report)} className={`rounded-full px-4 py-2 text-sm font-medium ${active === report ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{report}</button>)}</div></div>
    <ReportFilters value={filters} onChange={setFilters} academicYears={setup.years} terms={setup.terms} classes={setup.classes} categories={setup.categories} feeTypes={setup.feeTypes} expenseCategories={expenseCategories} recordedByUsers={recordedByUsers}/>
    {error && <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{active}</h2>{filtered && <p className="text-xs text-slate-500">{filtered.accounts.length} accounts · {filtered.payments.length} payments · {filtered.expenses.length} expenses</p>}</div>{content}</section>
  </div>;
}

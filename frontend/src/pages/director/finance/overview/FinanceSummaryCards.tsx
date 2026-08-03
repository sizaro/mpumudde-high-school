import type { FinanceSummary } from "../../../../services/financeOverviewService";
const money = (value: number) => `UGX ${Number(value || 0).toLocaleString()}`;
export default function FinanceSummaryCards({ summary }: { summary: FinanceSummary }) {
  const cards = [
    ["Expected Student Fees", summary.expectedStudentFees, "border-blue-200 bg-blue-50"],
    ["Fees Collected", summary.feesCollected, "border-emerald-200 bg-emerald-50"],
    ["Outstanding Balance", summary.outstandingBalance, "border-amber-200 bg-amber-50"],
    ["Other Income", summary.otherIncome, "border-cyan-200 bg-cyan-50"],
    ["Total Expenses", summary.totalExpenses, "border-rose-200 bg-rose-50"],
    ["Staff Payments", summary.staffPayments, "border-violet-200 bg-violet-50"],
    ["Available Balance", summary.availableBalance, "border-slate-200 bg-white"],
  ] as const;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, color]) => <div key={label} className={`rounded-3xl border p-5 shadow-sm ${color}`}><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-3 text-xl font-semibold text-slate-900">{money(value)}</p></div>)}</div>;
}

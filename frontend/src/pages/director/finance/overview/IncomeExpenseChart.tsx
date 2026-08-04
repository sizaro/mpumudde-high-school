import type { FinanceSummary } from "../../../../services/financeOverviewService";

export default function IncomeExpenseChart({ series }: { series: FinanceSummary["incomeExpenseSeries"] }) {
  const visible = series.slice(-12);
  const maximum = Math.max(1, ...visible.flatMap((point) => [point.income, point.expenses]));
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between"><div><h3 className="font-semibold text-slate-900">Income versus expenses</h3><p className="mt-1 text-sm text-slate-500">Cash movement during the selected period</p></div><div className="flex gap-3 text-xs"><span className="text-emerald-600">● Income</span><span className="text-rose-600">● Expenses</span></div></div>
    {visible.length === 0 ? <p className="mt-8 text-sm text-slate-500">No transactions in this period.</p> : <div className="mt-6 flex min-h-52 items-end gap-3 overflow-x-auto pb-2">{visible.map((point) => <div key={point.date} className="flex min-w-12 flex-1 flex-col items-center gap-2"><div className="flex h-36 items-end gap-1"><div title={`Income: UGX ${point.income.toLocaleString()}`} style={{ height: `${Math.max(point.income ? 5 : 0, point.income / maximum * 100)}%` }} className="w-3 rounded-t bg-emerald-500"/><div title={`Expenses: UGX ${point.expenses.toLocaleString()}`} style={{ height: `${Math.max(point.expenses ? 5 : 0, point.expenses / maximum * 100)}%` }} className="w-3 rounded-t bg-rose-400"/></div><span className="whitespace-nowrap text-[10px] text-slate-500">{new Date(`${point.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div>)}</div>}
  </section>;
}

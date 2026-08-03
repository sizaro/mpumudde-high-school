import type { FinanceSummaryGroup } from "../../../../services/financeOverviewService";

export default function CollectionByFeeType({ rows }: { rows: FinanceSummaryGroup[] }) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-semibold text-slate-900">Collection by fee type</h3><p className="mt-1 text-sm text-slate-500">Where received student payments were allocated</p><div className="mt-5 space-y-3">{rows.length ? rows.slice(0, 8).map((row) => <div key={row.label} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"><div><p className="text-sm font-medium text-slate-800">{row.label}</p><p className="text-xs text-slate-500">{total ? Math.round(row.amount / total * 100) : 0}% of collections</p></div><p className="text-sm font-semibold text-slate-900">UGX {row.amount.toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No fee-type collections found.</p>}</div></section>;
}

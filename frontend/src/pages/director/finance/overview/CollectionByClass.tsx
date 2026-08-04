import type { FinanceSummaryGroup } from "../../../../services/financeOverviewService";

export default function CollectionByClass({ rows }: { rows: FinanceSummaryGroup[] }) {
  const maximum = Math.max(1, ...rows.map((row) => row.amount));
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-semibold text-slate-900">Collection by class</h3><p className="mt-1 text-sm text-slate-500">Payments grouped by the students' classes</p><div className="mt-5 space-y-4">{rows.length ? rows.slice(0, 8).map((row) => <div key={row.label}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-medium text-slate-700">{row.label}</span><span className="text-slate-500">UGX {row.amount.toLocaleString()}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${row.amount / maximum * 100}%` }}/></div></div>) : <p className="text-sm text-slate-500">No class collections found.</p>}</div></section>;
}

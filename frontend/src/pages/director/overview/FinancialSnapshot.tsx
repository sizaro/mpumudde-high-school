import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { FinanceSummary } from "../../../services/financeOverviewService";

const money = (value: number) => `UGX ${Number(value || 0).toLocaleString()}`;

export default function FinancialSnapshot({ finance }: { finance: FinanceSummary }) {
  const progress = Math.min(100, Math.max(0, finance.collectionPercentage));
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Financial position</h2>
          <p className="mt-1 text-sm text-slate-500">School-wide expected fees, previous balances, and actual cash movement across all recorded periods.</p>
        </div>
        <Link to="finance" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
          Open Finance <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div><p className="text-xs uppercase tracking-wide text-slate-500">Expected fees</p><p className="mt-2 font-semibold text-slate-900">{money(finance.expectedStudentFees)}</p></div>
        <div><p className="text-xs uppercase tracking-wide text-slate-500">Outstanding</p><p className="mt-2 font-semibold text-amber-700">{money(finance.outstandingBalance)}</p></div>
        <div><p className="text-xs uppercase tracking-wide text-slate-500">Expenses paid</p><p className="mt-2 font-semibold text-rose-700">{money(finance.totalExpenses)}</p></div>
        <div><p className="text-xs uppercase tracking-wide text-slate-500">Available balance</p><p className={`mt-2 font-semibold ${finance.availableBalance < 0 ? "text-rose-700" : "text-emerald-700"}`}>{money(finance.availableBalance)}</p></div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">Collection progress</span><span className="font-semibold text-slate-900">{finance.collectionPercentage}%</span></div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><TrendingUp size={14} className="text-emerald-600" /> {finance.paymentCount} received payments</span>
          <span className="inline-flex items-center gap-1"><TrendingDown size={14} className="text-rose-600" /> {finance.expenseCount} paid expenses</span>
        </div>
      </div>
    </section>
  );
}

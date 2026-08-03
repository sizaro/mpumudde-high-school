import { AlertTriangle, ArrowRight, CircleDollarSign, UserRoundX, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { DirectorDashboard } from "../../../services/dashboardService";

export default function AttentionPanel({ data }: { data: DirectorDashboard }) {
  const rows = [
    { label: "Students with outstanding balances", value: data.attention.studentsWithBalances, to: "finance?tab=student-accounts", icon: CircleDollarSign },
    { label: "Students missing academic placement", value: data.attention.studentsMissingPlacement, to: "students", icon: UserRoundX },
    { label: "Teachers without assigned subjects", value: data.attention.teachersWithoutSubjects, to: "teachers", icon: UsersRound },
    { label: "Expenses awaiting approval", value: data.attention.pendingExpenses, to: "finance?tab=expenses", icon: AlertTriangle },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Needs your attention</h2>
      <p className="mt-1 text-sm text-slate-500">Open an item to review and resolve it.</p>
      <div className="mt-5 divide-y divide-slate-100">
        {rows.map(({ label, value, to, icon: Icon }) => (
          <Link key={label} to={to} className="group flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className={`rounded-2xl p-2.5 ${value ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}><Icon size={18} /></span>
            <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">{label}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${value ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{value}</span>
            <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </Link>
        ))}
      </div>
    </section>
  );
}

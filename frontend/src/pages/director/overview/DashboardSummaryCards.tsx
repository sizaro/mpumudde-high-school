import { BookOpen, GraduationCap, UsersRound, WalletCards } from "lucide-react";
import type { DirectorDashboard } from "../../../services/dashboardService";

const money = (value: number) => `UGX ${Number(value || 0).toLocaleString()}`;

export default function DashboardSummaryCards({ data }: { data: DirectorDashboard }) {
  const cards = [
    {
      label: "Active students",
      value: data.school.activeStudents.toLocaleString(),
      note: `${data.school.totalStudents.toLocaleString()} total registered`,
      icon: GraduationCap,
      style: "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      label: "Active teachers",
      value: data.school.activeTeachers.toLocaleString(),
      note: `${data.school.totalTeachers.toLocaleString()} total registered`,
      icon: UsersRound,
      style: "border-violet-200 bg-violet-50 text-violet-700",
    },
    {
      label: "Fees collected",
      value: money(data.finance.feesCollected),
      note: `${data.finance.collectionPercentage}% of expected fees`,
      icon: WalletCards,
      style: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      label: "Classes & subjects",
      value: `${data.school.activeClasses} / ${data.school.activeSubjects}`,
      note: "Active classes / active subjects",
      icon: BookOpen,
      style: "border-amber-200 bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {cards.map(({ label, value, note, icon: Icon, style }) => (
        <article key={label} className={`rounded-3xl border p-5 shadow-sm ${style}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{label}</p>
              <p className="mt-3 truncate text-2xl font-bold text-slate-950">{value}</p>
              <p className="mt-2 text-xs text-slate-600">{note}</p>
            </div>
            <span className="rounded-2xl bg-white/80 p-3 shadow-sm"><Icon size={21} /></span>
          </div>
        </article>
      ))}
    </div>
  );
}

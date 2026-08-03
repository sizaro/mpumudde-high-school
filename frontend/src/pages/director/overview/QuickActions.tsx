import { Banknote, GraduationCap, Plus, ReceiptText, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActions() {
  const actions = [
    { label: "Register student", to: "students/register", icon: GraduationCap },
    { label: "Register teacher", to: "teachers/create", icon: UserPlus },
    { label: "Record payment", to: "finance?tab=payments&action=record", icon: ReceiptText },
    { label: "Add expense", to: "finance?tab=expenses&action=create", icon: Banknote },
  ];
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
      <div className="flex items-center gap-2"><Plus size={19} /><h2 className="text-lg font-semibold">Quick actions</h2></div>
      <p className="mt-1 text-sm text-slate-300">Go directly to common school tasks.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map(({ label, to, icon: Icon }) => <Link key={label} to={to} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"><Icon size={18} /><span>{label}</span></Link>)}
      </div>
    </section>
  );
}

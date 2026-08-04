import { CalendarCheck, CheckCircle2, GraduationCap, Users, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChildTabs from './ChildTabs';
import { useParentDashboard } from './ParentDashboardContext';

const money = (value = 0) => `UGX ${value.toLocaleString()}`;

export default function ParentDashboard() {
  const { data, loading, error } = useParentDashboard();
  if (loading) return <Loading label="Loading family overview…" />;
  if (error || !data) return <p className="rounded-2xl bg-red-50 p-4 text-red-700">{error || 'No parent dashboard information is available.'}</p>;
  const summary = data.familySummary ?? { totalExpected: 0, totalPaid: 0, outstandingBalance: 0, childrenWithBalances: 0, fullyPaidChildren: 0, recentAttendanceRecords: 0, recentPresent: 0, recentAbsent: 0, recentLate: 0 };
  const attendanceRate = summary.recentAttendanceRecords ? Math.round((summary.recentPresent / summary.recentAttendanceRecords) * 100) : 0;
  const selected = data.student;

  return <div className="space-y-6">
    <section className="rounded-3xl bg-gradient-to-br from-[#0B1437] to-blue-700 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Family overview</p><h1 className="mt-3 text-3xl font-bold">Welcome, {data.parent.firstName}</h1><p className="mt-2 max-w-2xl text-sm text-blue-100">See the most important attendance and financial information for all children connected to your account.</p></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Summary icon={Users} label="Linked children" value={String(data.children?.length ?? 0)} /><Summary icon={CalendarCheck} label="Recent attendance" value={`${attendanceRate}%`} detail={`${summary.recentAbsent} absent · ${summary.recentLate} late`} /><Summary icon={CheckCircle2} label="Fully paid children" value={String(summary.fullyPaidChildren)} detail={`${summary.childrenWithBalances} with balances`} /><Summary icon={Wallet} label="Family balance" value={money(summary.outstandingBalance)} detail={`${money(summary.totalPaid)} paid`} /></div>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="text-xl font-semibold">Choose a child</h2><p className="mt-1 text-sm text-slate-500">The selected child is shared across Children, Attendance and Finance.</p></div><ChildTabs /></section>
    {selected && <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Selected child</p><h2 className="mt-1 text-xl font-semibold">{selected.profile.firstName} {selected.profile.lastName}</h2></div>{selected.profile.passportPhoto ? <img src={selected.profile.passportPhoto} alt="" className="h-16 w-16 rounded-full object-cover" /> : <GraduationCap className="text-blue-600" size={40} />}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Admission number" value={selected.profile.admissionNumber} /><Info label="Class" value={selected.profile.className || 'Not assigned'} /><Info label="Academic year" value={selected.profile.academicYear || 'Not assigned'} /><Info label="Recent records" value={String(selected.attendance.length)} /></div><div className="mt-5 flex gap-3"><Link to="children" className="rounded-xl border px-4 py-2 text-sm font-semibold">Child profile</Link><Link to="attendance" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Attendance</Link></div></section><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Financial position</h2><Link to="finance" className="text-sm font-semibold text-blue-700">View details</Link></div><div className="mt-5 space-y-3"><FinanceRow label="Expected" value={selected.finance.totalExpected} /><FinanceRow label="Paid" value={selected.finance.totalPaid} /><FinanceRow label="Outstanding balance" value={selected.finance.outstandingBalance} strong /></div></section></div>}
  </div>;
}

function Summary({ icon: Icon, label, value, detail }: { icon: any; label: string; value: string; detail?: string }) { return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Icon size={20} className="text-blue-600" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
function FinanceRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) { return <div className={`flex items-center justify-between rounded-2xl p-4 ${strong ? 'bg-amber-50 text-amber-900' : 'bg-slate-50'}`}><span>{label}</span><strong>{money(value)}</strong></div>; }
function Loading({ label }: { label: string }) { return <p className="rounded-2xl bg-white p-6 text-slate-500">{label}</p>; }

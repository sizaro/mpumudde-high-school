import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import parentService from '../../services/parentService';
import ChildTabs from './ChildTabs';
import { useParentDashboard } from './ParentDashboardContext';

type AttendanceData = Awaited<ReturnType<typeof parentService.getChildAttendance>>;
const ZONE = 'Africa/Kampala';

export default function ParentAttendance() {
  const { data, selectedStudentId, loading: dashboardLoading, error: dashboardError } = useParentDashboard();
  const [attendance, setAttendance] = useState<AttendanceData | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const [period, setPeriod] = useState('month'); const [subjectId, setSubjectId] = useState(''); const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  useEffect(() => { if (!selectedStudentId) return; setLoading(true); setError(''); parentService.getChildAttendance(selectedStudentId).then(setAttendance).catch(() => setError('Unable to load attendance records.')).finally(() => setLoading(false)); }, [selectedStudentId]);
  const filtered = useMemo(() => {
    const now = DateTime.now().setZone(ZONE); let start: DateTime | null = null; let end: DateTime | null = null;
    if (period === 'today') { start = now.startOf('day'); end = now.endOf('day'); }
    if (period === 'week') { start = now.startOf('week'); end = now.endOf('week'); }
    if (period === 'month') { start = now.startOf('month'); end = now.endOf('month'); }
    if (period === 'year') { start = now.startOf('year'); end = now.endOf('year'); }
    if (period === 'term') { const child = data?.children?.find((item) => item.studentId === selectedStudentId); start = child?.termStartDate ? DateTime.fromISO(child.termStartDate, { zone: ZONE }).startOf('day') : null; end = child?.termEndDate ? DateTime.fromISO(child.termEndDate, { zone: ZONE }).endOf('day') : null; }
    if (period === 'custom') { start = startDate ? DateTime.fromISO(startDate, { zone: ZONE }).startOf('day') : null; end = endDate ? DateTime.fromISO(endDate, { zone: ZONE }).endOf('day') : null; }
    return (attendance?.records ?? []).filter((record) => { const date = DateTime.fromISO(record.date, { zone: ZONE }); return (!subjectId || record.subjectId === subjectId) && (!start || date >= start) && (!end || date <= end); });
  }, [attendance, period, subjectId, startDate, endDate, data, selectedStudentId]);
  const counts = filtered.reduce((result, record) => { const key = record.status.toUpperCase(); result[key] = (result[key] || 0) + 1; return result; }, {} as Record<string, number>);
  if (dashboardLoading) return <p className="text-slate-500">Loading family account…</p>;
  if (dashboardError || !data) return <p className="rounded-2xl bg-red-50 p-4 text-red-700">{dashboardError || 'No parent data available.'}</p>;

  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Attendance</h1><p className="mt-2 text-sm text-slate-500">Choose a child, period and subject to review school attendance.</p></div><ChildTabs />
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-3"><select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl border px-4 py-3"><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="term">This term</option><option value="year">This year</option><option value="all">All records</option><option value="custom">Custom range</option></select><select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="rounded-xl border px-4 py-3"><option value="">All subjects</option>{attendance?.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>{period === 'custom' && <div className="grid grid-cols-2 gap-2"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-xl border px-3 py-3" /><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-xl border px-3 py-3" /></div>}</div></section>
    {error && <p className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}{loading ? <p className="text-slate-500">Loading attendance…</p> : attendance && <><section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">{attendance.student.passportPhoto ? <img src={attendance.student.passportPhoto} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-bold text-slate-500">{attendance.student.firstName[0]}</div>}</div><div><h2 className="text-xl font-semibold">{attendance.student.firstName} {attendance.student.lastName}</h2><p className="text-sm text-slate-500">{attendance.student.admissionNumber} · {attendance.student.schoolClass?.name || 'No class'}</p></div><div className="grid flex-1 grid-cols-3 gap-2 sm:ml-auto sm:max-w-md"><Count label="Present" value={counts.PRESENT || 0} color="emerald" /><Count label="Absent" value={counts.ABSENT || 0} color="red" /><Count label="Late" value={counts.LATE || 0} color="amber" /></div></section><section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Date</th><th className="p-4">Subject</th><th className="p-4">Teacher</th><th className="p-4">Status</th></tr></thead><tbody>{filtered.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">No attendance records match these filters.</td></tr> : filtered.map((record) => <tr key={record.id} className="border-t"><td className="p-4">{DateTime.fromISO(record.date, { zone: ZONE }).toFormat('dd LLL yyyy')}</td><td className="p-4">{record.subject}</td><td className="p-4">{record.teacher}</td><td className="p-4"><Status value={record.status} /></td></tr>)}</tbody></table></section></>}
  </div>;
}

function Count({ label, value, color }: { label: string; value: number; color: 'emerald' | 'red' | 'amber' }) { const styles = { emerald: 'bg-emerald-50 text-emerald-800', red: 'bg-red-50 text-red-800', amber: 'bg-amber-50 text-amber-800' }; return <div className={`rounded-2xl p-3 text-center ${styles[color]}`}><p className="text-xl font-bold">{value}</p><p className="text-xs">{label}</p></div>; }
function Status({ value }: { value: string }) { const status = value.toUpperCase(); return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{value}</span>; }

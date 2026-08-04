import { useParentDashboard } from './ParentDashboardContext';

export default function ChildTabs() {
  const { data, selectedStudentId, selectStudent } = useParentDashboard();
  const children = data?.children ?? [];
  if (children.length === 0) return <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">No active students are linked to this portal account.</p>;
  return <div className="overflow-x-auto pb-2"><div className="flex min-w-max gap-3">{children.map((child) => {
    const active = child.studentId === selectedStudentId;
    return <button key={child.studentId} type="button" onClick={() => void selectStudent(child.studentId)} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${active ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}>
      <div className={`h-11 w-11 overflow-hidden rounded-full ${active ? 'bg-white/20' : 'bg-slate-200'}`}>{child.profilePhoto ? <img src={child.profilePhoto} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-semibold">{child.firstName[0]}</div>}</div>
      <div><p className="font-semibold">{child.firstName}</p><p className={`text-xs ${active ? 'text-blue-100' : 'text-slate-500'}`}>{child.className || 'No class'} · {child.admissionNumber}</p></div>
    </button>;
  })}</div></div>;
}

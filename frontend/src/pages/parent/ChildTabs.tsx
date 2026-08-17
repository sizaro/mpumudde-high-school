import { useParentDashboard } from './ParentDashboardContext';

export default function ChildTabs() {
  const { data, selectedStudentId, selectStudent } = useParentDashboard();
  const children = data?.children ?? [];
  if (children.length === 0) return <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">No active students are linked to this portal account.</p>;
  return <div className="child-tabs" aria-label="Choose a child"><div className="child-tabs__track">{children.map((child) => {
    const active = child.studentId === selectedStudentId;
    return <button key={child.studentId} type="button" aria-pressed={active} onClick={() => void selectStudent(child.studentId)} className={`child-tab ${active ? 'child-tab--active' : ''}`}>
      <div className="child-tab__avatar">{child.profilePhoto ? <img src={child.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span>{child.firstName[0]}</span>}</div>
      <div className="child-tab__copy"><p className="child-tab__name">{child.firstName}</p><p className="child-tab__meta">{child.className || 'No class'} · {child.admissionNumber}</p></div>
    </button>;
  })}</div></div>;
}

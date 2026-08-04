import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export type GuardianStudentLinkDraft = {
  studentId: string;
  relationship: string;
  isPrimary: boolean;
};

export default function StudentLinksEditor({ students, links, onChange }: {
  students: any[];
  links: GuardianStudentLinkDraft[];
  onChange: (links: GuardianStudentLinkDraft[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [classId, setClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const classes = useMemo(() => Array.from(new Map(students.filter((student) => student.schoolClass).map((student) => [student.schoolClass.id, student.schoolClass])).values()), [students]);
  const available = useMemo(() => students.filter((student) => {
    if (links.some((link) => link.studentId === student.id)) return false;
    if (classId && student.schoolClass?.id !== classId) return false;
    const text = `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase();
    return text.includes(search.trim().toLowerCase());
  }).slice(0, 30), [students, links, classId, search]);

  const add = () => {
    if (!selectedStudentId) return;
    onChange([...links, { studentId: selectedStudentId, relationship: 'Guardian', isPrimary: false }]);
    setSelectedStudentId('');
    setSearch('');
  };
  const update = (studentId: string, patch: Partial<GuardianStudentLinkDraft>) => onChange(links.map((link) => link.studentId === studentId ? { ...link, ...patch } : link));

  return <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div><h2 className="text-lg font-semibold text-slate-900">Linked students</h2><p className="mt-1 text-sm text-slate-500">A guardian must be connected to at least one student. Relationship and primary status are recorded separately for every child.</p></div>
    <div className="grid gap-3 lg:grid-cols-[1fr_220px_1fr_auto]">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or admission number" className="rounded-xl border px-4 py-3" />
      <select value={classId} onChange={(event) => setClassId(event.target.value)} className="rounded-xl border px-4 py-3"><option value="">All classes</option>{classes.map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="rounded-xl border px-4 py-3"><option value="">Select student</option>{available.map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName} — {student.admissionNumber} — {student.schoolClass?.name || 'No class'}</option>)}</select>
      <button type="button" disabled={!selectedStudentId} onClick={add} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><Plus size={17} />Add</button>
    </div>
    <div className="space-y-3">
      {links.length === 0 && <p className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">No student selected yet.</p>}
      {links.map((link) => {
        const student = students.find((item) => item.id === link.studentId);
        if (!student) return null;
        return <div key={link.studentId} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_190px_160px_auto] md:items-center">
          <div className="flex items-center gap-3">{student.passportPhoto ? <img src={student.passportPhoto} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-slate-200" />}<div><p className="font-semibold">{student.firstName} {student.lastName}</p><p className="text-sm text-slate-500">{student.admissionNumber} · {student.schoolClass?.name || 'No class'} · {student.academicYear?.name || 'No academic year'}</p></div></div>
          <select value={link.relationship} onChange={(event) => update(link.studentId, { relationship: event.target.value })} className="rounded-xl border bg-white px-3 py-2">{['Father','Mother','Guardian','Uncle','Aunt','Grandfather','Grandmother','Other'].map((item) => <option key={item}>{item}</option>)}</select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={link.isPrimary} onChange={(event) => update(link.studentId, { isPrimary: event.target.checked })} />Primary for this child</label>
          <button type="button" onClick={() => onChange(links.filter((item) => item.studentId !== link.studentId))} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-700"><Trash2 size={16} />Remove</button>
        </div>;
      })}
    </div>
  </section>;
}

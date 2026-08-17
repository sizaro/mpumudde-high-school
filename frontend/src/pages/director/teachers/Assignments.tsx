import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeachingAssignmentService from "../../../services/teachingAssignmentService";
import SetupService, { type AcademicYear, type AcademicYearClass, type ClassSubject } from "../../../services/setupService";

export default function TeacherAssignments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [offerings, setOfferings] = useState<AcademicYearClass[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [academicYearClassId, setAcademicYearClassId] = useState("");
  const [classSubjectId, setClassSubjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAssignments = async () => id && setAssignments(await TeachingAssignmentService.findByTeacher(id));
  useEffect(() => {
    void loadAssignments();
    SetupService.getAcademicYears().then((items) => {
      setYears(items);
      const active = items.find((item) => item.status === "ACTIVE") ?? items[0];
      if (active) setAcademicYearId(active.id);
    });
  }, [id]);

  useEffect(() => {
    setAcademicYearClassId(""); setClassSubjectId("");
    if (!academicYearId) return setOfferings([]);
    SetupService.getAcademicYearClasses(academicYearId).then(setOfferings);
  }, [academicYearId]);

  useEffect(() => {
    setClassSubjectId("");
    if (!academicYearClassId) return setClassSubjects([]);
    SetupService.getClassSubjects(academicYearClassId).then(setClassSubjects);
  }, [academicYearClassId]);

  const selectedClassSubject = useMemo(() => classSubjects.find((item) => item.id === classSubjectId), [classSubjects, classSubjectId]);
  async function add() {
    if (!id || !academicYearId || !academicYearClassId || !selectedClassSubject) return;
    setSaving(true); setError("");
    try {
      await TeachingAssignmentService.create({ teacherId: id, subjectId: selectedClassSubject.subjectId, academicYearId, academicYearClassId, classSubjectId: selectedClassSubject.id, startDate: startDate || undefined, endDate: endDate || undefined });
      await loadAssignments(); setClassSubjectId(""); setStartDate(""); setEndDate("");
    } catch (reason: any) { setError(reason?.response?.data?.message ?? "Failed to add assignment"); }
    finally { setSaving(false); }
  }
  async function remove(assignId: string) { await TeachingAssignmentService.remove(assignId); await loadAssignments(); }

  return <div className="mx-auto max-w-5xl space-y-6">
    <div className="flex items-center gap-4"><button onClick={() => navigate(`/director/teachers/${id}`)} className="text-slate-500">← Back</button><div><h1 className="text-2xl font-bold">Official teaching assignments</h1><p className="text-sm text-slate-500">Assignments describe the normal teacher, class and subject for an academic year.</p></div></div>
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
    <div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-medium">Academic year<select value={academicYearId} onChange={(e) => setAcademicYearId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select year</option>{years.map((year) => <option key={year.id} value={year.id}>{year.name} · {year.status}</option>)}</select></label>
      <label className="text-sm font-medium">Class<select value={academicYearClassId} onChange={(e) => setAcademicYearClassId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select class</option>{offerings.filter((item) => item.isActive).map((item) => <option key={item.id} value={item.id}>{item.schoolClass.name}</option>)}</select></label>
      <label className="text-sm font-medium">Offered subject<select value={classSubjectId} onChange={(e) => setClassSubjectId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select subject</option>{classSubjects.filter((item) => item.isActive).map((item) => <option key={item.id} value={item.id}>{item.subject.name}</option>)}</select></label>
      <label className="text-sm font-medium">Starts (optional)<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>
      <label className="text-sm font-medium">Ends (optional)<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>
    </div>{academicYearClassId && classSubjects.length === 0 && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">This class has no subjects configured. Add them under Academic Setup → Subjects.</p>}<button onClick={add} disabled={!selectedClassSubject || saving} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Add official assignment"}</button></div>
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Assignment history ({assignments.length})</h2><table className="mt-4 min-w-[720px] w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3">Year</th><th>Class</th><th>Subject</th><th>Period</th><th>Status</th><th /></tr></thead><tbody>{assignments.map((item) => <tr key={item.id} className="border-b"><td className="py-3">{item.academicYear?.name ?? "Legacy"}</td><td>{item.academicYearClass?.schoolClass?.name ?? "Any class"}</td><td>{item.subject?.name}</td><td>{item.startDate?.slice(0, 10) ?? "Year start"} – {item.endDate?.slice(0, 10) ?? "Year end"}</td><td>{item.isActive ? "Active" : "Ended"}</td><td className="text-right">{item.isActive && <button onClick={() => remove(item.id)} className="text-red-600">End</button>}</td></tr>)}</tbody></table></div>
  </div>;
}

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TeacherService from "../../services/teacherService";
import AttendanceService from "../../services/attendanceService";

const STATUSES = ["Present", "Absent", "Late", "Excused"] as const;
type Status = typeof STATUSES[number];

export default function TakeAttendance() {
  const [params] = useSearchParams();
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classId, setClassId] = useState(params.get("classId") ?? "");
  const [classSubjectId, setClassSubjectId] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => { setLoadingOptions(true); Promise.all([TeacherService.getMyClasses(), TeacherService.getMyAssignments()]).then(([c, a]) => { setClasses(c ?? []); setAssignments(a ?? []); }).catch((reason) => setError(reason?.response?.data?.message ?? "Unable to load the active classes, subjects, and assignments." )).finally(() => setLoadingOptions(false)); }, []);
  const selectedClass = classes.find((item) => item.id === classId);
  const availableSubjects = useMemo(() => selectedClass?.subjects ?? [], [selectedClass]);
  const selectedSubject = availableSubjects.find((item: any) => item.classSubjectId === classSubjectId);
  const officialAssignment = assignments.find((item) => item.isActive && ((item.academicYearId === selectedClass?.academicYearId && item.academicYearClassId === selectedClass?.academicYearClassId && item.classSubjectId === classSubjectId) || (!item.classSubjectId && !item.academicYearClassId && item.subjectId === selectedSubject?.id && (!item.academicYearId || item.academicYearId === selectedClass?.academicYearId))));
  const isOverride = Boolean(classSubjectId && !officialAssignment);

  useEffect(() => {
    setClassSubjectId(""); setOverrideReason(""); setStudents([]);
    if (!classId || !selectedClass?.academicYearId) return;
    setLoadingStudents(true);
    AttendanceService.getStudentsForClass(classId, selectedClass.academicYearId).then((list) => {
      setStudents(list);
      setStatuses(Object.fromEntries(list.map((student: any) => [student.id, "Present"])) as Record<string, Status>);
    }).catch((reason) => setError(reason?.response?.data?.message ?? "Unable to load the enrolled students.")).finally(() => setLoadingStudents(false));
  }, [classId, selectedClass?.academicYearId]);

  async function submit() {
    if (!selectedClass || !selectedSubject || students.length === 0 || (isOverride && overrideReason.trim().length < 5)) return;
    setSaving(true); setError("");
    try {
      await AttendanceService.createSession({ classId, subjectId: selectedSubject.id, academicYearId: selectedClass.academicYearId, classSubjectId, overrideReason: isOverride ? overrideReason.trim() : undefined, records: students.map((student) => ({ studentId: student.id, status: statuses[student.id] ?? "Present" })) });
      setSaved(true);
    } catch (reason: any) { setError(reason?.response?.data?.message ?? "Failed to save attendance"); }
    finally { setSaving(false); }
  }

  if (saved) return <div className="mx-auto max-w-lg p-6"><div className="rounded-3xl border border-green-200 bg-green-50 p-7 text-center"><h2 className="text-lg font-bold text-green-800">Attendance saved</h2><p className="mt-1 text-sm text-green-700">{students.length} students recorded{isOverride ? " with an assignment override reported to the Director" : ""}.</p><button onClick={() => { setSaved(false); setClassSubjectId(""); }} className="mt-4 rounded-xl bg-blue-700 px-4 py-2 text-white">Take another</button></div></div>;

  return <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8"><div><h1 className="text-2xl font-bold">Take attendance</h1><p className="text-sm text-slate-500">Choose what was actually taught. Cover lessons remain allowed with a reason.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
    {loadingOptions && <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" /> Loading active classes and subjects…</div>}
    <div className="grid gap-4 rounded-3xl border bg-white p-5 md:grid-cols-2"><label className="text-sm font-medium">Class<select value={classId} onChange={(e) => setClassId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm font-medium">Subject offered to this class<select value={classSubjectId} onChange={(e) => { setClassSubjectId(e.target.value); setOverrideReason(""); }} disabled={!classId} className="mt-2 w-full rounded-xl border p-3"><option value="">Select subject</option>{availableSubjects.map((item: any) => <option key={item.classSubjectId} value={item.classSubjectId}>{item.name}</option>)}</select></label></div>
    {classId && !loadingOptions && availableSubjects.length === 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">No subjects are configured for this class in the active academic year. Ask the Director to open Academic Setup → Subjects and attach subjects to this class.</div>}
    {isOverride && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5"><h2 className="font-semibold text-amber-900">This is outside your normal assignment</h2><p className="mt-1 text-sm text-amber-800">You may continue, but the Director will be notified for accountability.</p><label className="mt-3 block text-sm font-medium text-amber-950">Reason<textarea value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-amber-300 p-3" placeholder="e.g. Covering for an absent teacher" /></label></div>}
    {loadingStudents && <p className="rounded-xl bg-slate-50 p-4 text-slate-500">Loading enrolled students…</p>}
    {students.length > 0 && selectedSubject && <div className="overflow-x-auto rounded-3xl border bg-white"><div className="flex min-w-[680px] items-center justify-between border-b bg-slate-50 px-4 py-3"><span className="font-medium">{students.length} enrolled students</span><div className="flex gap-2">{STATUSES.map((status) => <button key={status} onClick={() => setStatuses(Object.fromEntries(students.map((student) => [student.id, status])))} className="rounded border px-2 py-1 text-xs">All {status}</button>)}</div></div><table className="min-w-[680px] w-full text-sm"><thead><tr className="border-b text-left"><th className="px-4 py-3">Student</th><th>Admission number</th><th>Status</th></tr></thead><tbody>{students.map((student) => <tr key={student.id} className="border-b"><td className="px-4 py-3 font-medium">{student.firstName} {student.lastName}</td><td>{student.admissionNumber}</td><td><div className="flex gap-1">{STATUSES.map((status) => <button key={status} onClick={() => setStatuses((current) => ({ ...current, [student.id]: status }))} className={`rounded px-2 py-1 text-xs ${statuses[student.id] === status ? "bg-slate-900 text-white" : "bg-slate-100"}`}>{status}</button>)}</div></td></tr>)}</tbody></table><div className="flex min-w-[680px] items-center justify-between bg-slate-50 px-4 py-4"><span className="text-sm text-slate-500">P: {Object.values(statuses).filter((s) => s === "Present").length} · A: {Object.values(statuses).filter((s) => s === "Absent").length}</span><button onClick={submit} disabled={saving || (isOverride && overrideReason.trim().length < 5)} className="rounded-xl bg-green-700 px-6 py-3 text-white disabled:opacity-50">{saving ? "Saving…" : isOverride ? "Continue and save" : "Save attendance"}</button></div></div>}
  </div>;
}

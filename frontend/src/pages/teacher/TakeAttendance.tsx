import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TeacherService from "../../services/teacherService";
import AttendanceService from "../../services/attendanceService";

const STATUSES = ["Present", "Absent", "Late", "Excused"] as const;
type Status = typeof STATUSES[number];

export default function TakeAttendance() {
  const [params] = useSearchParams();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState(params.get("classId") ?? "");
  const [subjectId, setSubjectId] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    TeacherService.getMyClasses().then(setClasses);
    TeacherService.getMySubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (!classId) return;
    setLoadingStudents(true);
    AttendanceService.getStudentsForClass(classId)
      .then((list) => {
        setStudents(list);
        const initial: Record<string, Status> = {};
        list.forEach((s: any) => (initial[s.id] = "Present"));
        setStatuses(initial);
      })
      .finally(() => setLoadingStudents(false));
  }, [classId]);

  async function submit() {
    if (!classId || !subjectId || students.length === 0) return;
    setSaving(true); setError("");
    try {
      await AttendanceService.createSession({
        classId,
        subjectId,
        records: students.map((s) => ({ studentId: s.id, status: statuses[s.id] ?? "Present" })),
      });
      setSaved(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to save attendance");
    } finally { setSaving(false); }
  }

  if (saved) return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <h2 className="font-bold text-green-800 text-lg">Attendance Saved</h2>
        <p className="text-green-600 text-sm mt-1">{students.length} students recorded.</p>
        <button onClick={() => { setSaved(false); setSubjectId(""); }} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Take Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Take Attendance</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={classId} onChange={(e) => { setClassId(e.target.value); setSubjectId(""); }} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">Select class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" disabled={!classId}>
            <option value="">Select subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {loadingStudents && <p className="text-gray-500">Loading students...</p>}

      {students.length > 0 && classId && subjectId && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
            <span className="font-medium">{students.length} Students</span>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatuses(Object.fromEntries(students.map((st) => [st.id, s])))} className="text-xs border px-2 py-1 rounded hover:bg-gray-100">All {s}</button>
              ))}
            </div>
          </div>
          <table className="min-w-full text-sm">
            <thead><tr className="border-b"><th className="text-left px-4 py-2">Student</th><th className="text-left px-4 py-2">Admission #</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-2 text-gray-500">{s.admissionNumber}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1 justify-center">
                      {STATUSES.map((st) => (
                        <button key={st} onClick={() => setStatuses((prev) => ({ ...prev, [s.id]: st }))}
                          className={`px-2 py-1 rounded text-xs ${statuses[s.id] === st ? (st === "Present" ? "bg-green-500 text-white" : st === "Absent" ? "bg-red-500 text-white" : st === "Late" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white") : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">
              P:{Object.values(statuses).filter(s=>s==="Present").length} · A:{Object.values(statuses).filter(s=>s==="Absent").length} · L:{Object.values(statuses).filter(s=>s==="Late").length} · E:{Object.values(statuses).filter(s=>s==="Excused").length}
            </span>
            <button onClick={submit} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

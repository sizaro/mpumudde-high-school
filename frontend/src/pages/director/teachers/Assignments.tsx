import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeachingAssignmentService from "../../../services/teachingAssignmentService";
import api from "../../../api/axios";

export default function TeacherAssignments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    TeachingAssignmentService.findByTeacher(id).then(setAssignments);
    api.get("/classes").then((r) => setClasses(r.data));
    api.get("/subjects").then((r) => setSubjects(r.data));
  }, [id]);

  async function add() {
    if (!id || !classId || !subjectId) return;
    setSaving(true); setError("");
    try {
      const newA = await TeachingAssignmentService.create(id, classId, subjectId);
      setAssignments((prev) => [...prev, newA]);
      setClassId(""); setSubjectId("");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to add assignment");
    } finally { setSaving(false); }
  }

  async function remove(assignId: string) {
    await TeachingAssignmentService.remove(assignId);
    setAssignments((prev) => prev.filter((a) => a.id !== assignId));
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/director/teachers/${id}`)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Add Assignment</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={add} disabled={!classId || !subjectId || saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Adding..." : "Add Assignment"}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Current Assignments ({assignments.length})</h2>
        {assignments.length === 0 ? <p className="text-gray-500 text-sm">None yet.</p> : (
          <table className="min-w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Class</th><th className="text-left py-2">Subject</th><th /></tr></thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.schoolClass?.name}</td>
                  <td className="py-2">{a.subject?.name}</td>
                  <td className="py-2 text-right"><button onClick={() => remove(a.id)} className="text-red-500 hover:underline text-xs">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

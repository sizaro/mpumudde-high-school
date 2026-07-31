import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import TeacherService from "../../../services/teacherService";

export default function TeacherList() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    TeacherService.findAll()
      .then(setTeachers)
      .finally(() => setLoading(false));
  }, []);

  async function deleteTeacher(teacher: any) {
    const name = `${teacher.firstName} ${teacher.lastName}`;
    if (!window.confirm(`Delete ${name}'s teacher profile? This cannot be undone.`)) return;
    setActionError(""); setDeletingId(teacher.id);
    try {
      await TeacherService.remove(teacher.id);
      setTeachers((current) => current.filter((item) => item.id !== teacher.id));
    } catch {
      setActionError("The teacher could not be deleted. They may have records that must be kept; you can deactivate them instead.");
    } finally { setDeletingId(null); }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading teachers...</div>;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="mt-2 text-slate-500">Manage teacher profiles, assignments, and employment records.</p>
        </div>
        <button
          onClick={() => navigate("/director/teachers/create")}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add Teacher
        </button>
      </div>

      {actionError && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

      {teachers.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No teachers found. Add one to get started.</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-sm font-semibold">Employee #</th>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{t.firstName} {t.lastName}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.user?.email ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.employment?.employeeNumber ?? "—"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${t.employment?.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {t.employment?.status ?? "unset"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <button title="View teacher profile" aria-label={`View ${t.firstName} ${t.lastName}`} onClick={() => navigate(`/director/teachers/${t.id}`)} className="rounded-xl p-2 text-blue-700 hover:bg-blue-50"><Eye size={18} /></button>
                      <button title="Edit teacher information" aria-label={`Edit ${t.firstName} ${t.lastName}`} onClick={() => navigate(`/director/teachers/${t.id}/edit`)} className="rounded-xl p-2 text-amber-700 hover:bg-amber-50"><Pencil size={18} /></button>
                      <button title="Delete teacher" aria-label={`Delete ${t.firstName} ${t.lastName}`} disabled={deletingId === t.id} onClick={() => void deleteTeacher(t)} className="rounded-xl p-2 text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

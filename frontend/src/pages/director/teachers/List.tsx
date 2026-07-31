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

  if (loading) return <div className="p-8">Loading teachers...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button
          onClick={() => navigate("/director/teachers/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Teacher
        </button>
      </div>

      {actionError && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

      {teachers.length === 0 ? (
        <p className="text-gray-500">No teachers found. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Employee #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.firstName} {t.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{t.user?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{t.employment?.employeeNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${t.employment?.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {t.employment?.status ?? "unset"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View teacher profile" aria-label={`View ${t.firstName} ${t.lastName}`} onClick={() => navigate(`/director/teachers/${t.id}`)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"><Eye size={18} /></button>
                      <button title="Edit teacher information" aria-label={`Edit ${t.firstName} ${t.lastName}`} onClick={() => navigate(`/director/teachers/${t.id}/edit`)} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50"><Pencil size={18} /></button>
                      <button title="Delete teacher" aria-label={`Delete ${t.firstName} ${t.lastName}`} disabled={deletingId === t.id} onClick={() => void deleteTeacher(t)} className="rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={18} /></button>
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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";

export default function EditTeacher() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"personal" | "employment">("personal");

  const [personal, setPersonal] = useState({ firstName: "", middleName: "", lastName: "", gender: "", dateOfBirth: "", phone: "", email: "", nationality: "", address: "" });
  const [employment, setEmployment] = useState({ employeeNumber: "", position: "", department: "", employmentType: "", employmentDate: "", salary: "", status: "active" });

  useEffect(() => {
    if (!id) return;
    TeacherService.findOne(id).then((t) => {
      setPersonal({ firstName: t.firstName ?? "", middleName: t.middleName ?? "", lastName: t.lastName ?? "", gender: t.gender ?? "", dateOfBirth: t.dateOfBirth?.slice(0, 10) ?? "", phone: t.phone ?? "", email: t.email ?? "", nationality: t.nationality ?? "", address: t.address ?? "" });
      if (t.employment) {
        setEmployment({ employeeNumber: t.employment.employeeNumber ?? "", position: t.employment.position ?? "", department: t.employment.department ?? "", employmentType: t.employment.employmentType ?? "", employmentDate: t.employment.employmentDate?.slice(0, 10) ?? "", salary: t.employment.salary ?? "", status: t.employment.status ?? "active" });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  async function savePersonal() {
    if (!id) return;
    setSaving(true); setError("");
    try { await TeacherService.updatePersonal(id, personal); navigate(`/director/teachers/${id}`); }
    catch (e: any) { setError(e?.response?.data?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  async function saveEmployment() {
    if (!id) return;
    setSaving(true); setError("");
    try { await TeacherService.upsertEmployment(id, { ...employment, salary: employment.salary ? Number(employment.salary) : undefined }); navigate(`/director/teachers/${id}`); }
    catch (e: any) { setError(e?.response?.data?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/director/teachers/${id}`)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold">Edit Teacher</h1>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}
      <div className="flex gap-2 border-b">
        {(["personal", "employment"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize ${tab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>
      {tab === "personal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(["firstName", "middleName", "lastName", "gender", "dateOfBirth", "phone", "email", "nationality"] as const).map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
                {f === "gender" ? (
                  <select value={personal[f]} onChange={(e) => setPersonal((p) => ({ ...p, [f]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">—</option><option value="Male">Male</option><option value="Female">Female</option>
                  </select>
                ) : (
                  <input type={f === "dateOfBirth" ? "date" : f === "email" ? "email" : "text"} value={personal[f]} onChange={(e) => setPersonal((p) => ({ ...p, [f]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                )}
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={personal.address} onChange={(e) => setPersonal((p) => ({ ...p, address: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={savePersonal} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save Personal Info"}</button>
          </div>
        </div>
      )}
      {tab === "employment" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(["employeeNumber", "position", "department", "employmentType", "employmentDate", "salary"] as const).map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
                <input type={f === "employmentDate" ? "date" : f === "salary" ? "number" : "text"} value={employment[f]} onChange={(e) => setEmployment((p) => ({ ...p, [f]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={employment.status} onChange={(e) => setEmployment((p) => ({ ...p, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={saveEmployment} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save Employment Info"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

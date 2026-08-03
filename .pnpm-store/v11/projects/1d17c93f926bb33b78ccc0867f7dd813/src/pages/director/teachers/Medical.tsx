import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";

export default function TeacherMedical() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ bloodGroup: "", allergies: "", medicalConditions: "", medication: "", disability: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    TeacherService.findOne(id).then((t) => {
      if (t.medicalInformation) setForm({ bloodGroup: t.medicalInformation.bloodGroup ?? "", allergies: t.medicalInformation.allergies ?? "", medicalConditions: t.medicalInformation.medicalConditions ?? "", medication: t.medicalInformation.medication ?? "", disability: t.medicalInformation.disability ?? "", notes: t.medicalInformation.notes ?? "" });
    });
  }, [id]);

  async function save() {
    if (!id) return;
    setSaving(true); setError(""); setSaved(false);
    try { await TeacherService.upsertMedical(id, form); setSaved(true); }
    catch (e: any) { setError(e?.response?.data?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/director/teachers/${id}`)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold">Medical Information</h1>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded p-3">Medical information saved.</div>}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(["bloodGroup", "allergies", "medicalConditions", "medication", "disability"] as const).map((f) => (
            <div key={f}><label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
              <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          ))}
          <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
        </div>
        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

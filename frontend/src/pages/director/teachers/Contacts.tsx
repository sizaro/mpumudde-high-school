import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";

const BLANK = { fullName: "", relationship: "", phone: "", alternativePhone: "", address: "", isNextOfKin: false };

export default function TeacherContacts() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    TeacherService.findOne(id).then((t) => setContacts(t.emergencyContacts ?? []));
  }, [id]);

  async function add() {
    if (!id) return;
    setSaving(true); setError("");
    try {
      const c = await TeacherService.addContact(id, form);
      setContacts((prev) => [...prev, c]);
      setForm({ ...BLANK });
    } catch (e: any) { setError(e?.response?.data?.message ?? "Failed"); }
    finally { setSaving(false); }
  }

  async function remove(contactId: string) {
    if (!id) return;
    await TeacherService.removeContact(id, contactId);
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/director/teachers/${id}`)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Add Contact</h2>
        <div className="grid grid-cols-2 gap-3">
          {(["fullName", "relationship", "phone", "alternativePhone", "address"] as const).map((f) => (
            <div key={f}><label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
              <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          ))}
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="kin" checked={form.isNextOfKin} onChange={(e) => setForm((p) => ({ ...p, isNextOfKin: e.target.checked }))} />
            <label htmlFor="kin" className="text-sm">Next of Kin</label>
          </div>
        </div>
        <button onClick={add} disabled={!form.fullName || !form.phone || saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{saving ? "Adding..." : "Add Contact"}</button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Contacts ({contacts.length})</h2>
        {contacts.length === 0 ? <p className="text-gray-500 text-sm">No contacts yet. At least 2 are recommended.</p> : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.id} className="border rounded p-3 flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{c.fullName} {c.isNextOfKin && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1 rounded">Next of Kin</span>}</p>
                  <p className="text-xs text-gray-500">{c.relationship} · {c.phone} {c.alternativePhone && `· ${c.alternativePhone}`}</p>
                  {c.address && <p className="text-xs text-gray-400">{c.address}</p>}
                </div>
                <button onClick={() => remove(c.id)} className="text-red-500 hover:underline text-xs">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

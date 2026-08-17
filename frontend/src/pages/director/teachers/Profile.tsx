import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";
import TeachingAssignmentService from "../../../services/teachingAssignmentService";
import { Pencil } from "lucide-react";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [assignments, setAssignments] = useState<any[]>([]);
  const [editing, setEditing] = useState<"personal" | "employment" | "medical" | null>(null);
  const [draft, setDraft] = useState<any>({});

  useEffect(() => {
    if (!id) return;
    Promise.all([
      TeacherService.findOne(id),
      TeachingAssignmentService.findByTeacher(id),
    ])
      .then(([t, a]) => {
        setTeacher(t);
        setDraft(t);
        setAssignments(a);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function removeAssignment(assignId: string) {
    await TeachingAssignmentService.remove(assignId);
    setAssignments((prev) => prev.filter((a) => a.id !== assignId));
  }

  async function saveSection(section: "personal" | "employment" | "medical") {
    if (!id) return;
    try {
      const updated = section === "personal"
        ? await TeacherService.updatePersonal(id, { firstName: draft.firstName, middleName: draft.middleName, lastName: draft.lastName, phone: draft.phone, gender: draft.gender, nationality: draft.nationality, address: draft.address })
        : section === "employment"
          ? await TeacherService.upsertEmployment(id, { ...teacher.employment, position: draft.employment?.position, department: draft.employment?.department, employmentType: draft.employment?.employmentType, salary: draft.employment?.salary ? Number(draft.employment.salary) : undefined, payFrequency: draft.employment?.payFrequency, status: draft.employment?.status })
          : await TeacherService.upsertMedical(id, { ...draft.medicalInformation });
      setTeacher((current: any) => section === "personal" ? updated : section === "employment" ? { ...current, employment: updated } : { ...current, medicalInformation: updated }); setEditing(null);
    } catch { alert("Unable to save this section."); }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!teacher)
    return <div className="p-8 text-red-500">Teacher not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/director/teachers")}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">
          {teacher.firstName} {teacher.middleName} {teacher.lastName}
        </h1>
        <span
          className={`ml-auto px-3 py-1 rounded-full text-sm ${teacher.employment?.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {teacher.employment?.status ?? "No Employment Record"}
        </span>
      </div>

      {/* Management actions for records that contain multiple entries. */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Assignments", path: "assignments" },
          { label: "Contacts", path: "contacts" },
          { label: "Documents", path: "documents" },
        ].map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(`/director/teachers/${id}/${a.path}`)}
            className="border border-gray-300 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      <section className="bg-white border rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-lg">Personal Information</h2><button onClick={() => { setDraft(teacher); setEditing("personal"); }} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title="Edit personal information"><Pencil size={17} /></button></div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Email (login)", teacher.user?.email],
            ["Phone", teacher.phone],
            ["Gender", teacher.gender],
            ["Date of Birth", teacher.dateOfBirth?.slice(0, 10)],
            ["Nationality", teacher.nationality],
            ["Address", teacher.address],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <dt className="text-gray-500">{k}</dt>
              <dd className="font-medium">{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      {editing === "personal" && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-xl rounded-xl bg-white p-6"><h2 className="font-semibold">Edit Personal Information</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["firstName", "middleName", "lastName", "phone", "gender", "nationality", "address"] as const).map((field) => <label key={field}><span className="text-sm capitalize">{field.replace(/([A-Z])/g, " $1")}</span><input value={draft[field] ?? ""} onChange={(event) => setDraft((current: any) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={() => void saveSection("personal")} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save section</button></div></div></div>}

      {/* Employment */}
      {teacher.employment && (
        <section className="bg-white border rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-lg">Employment & Pay</h2><button onClick={() => { setDraft(teacher); setEditing("employment"); }} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title="Edit employment"><Pencil size={17} /></button></div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Employee #", teacher.employment.employeeNumber],
              ["Position", teacher.employment.position],
              ["Department", teacher.employment.department],
              ["Type", teacher.employment.employmentType],
              ["Date", teacher.employment.employmentDate?.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium">{v ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {editing === "employment" && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-xl rounded-xl bg-white p-6"><h2 className="font-semibold">Edit Employment & Pay</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["position", "department", "employmentType", "salary", "payFrequency", "status"] as const).map((field) => <label key={field}><span className="text-sm capitalize">{field.replace(/([A-Z])/g, " $1")}</span><input value={draft.employment?.[field] ?? ""} onChange={(event) => setDraft((current: any) => ({ ...current, employment: { ...current.employment, [field]: event.target.value } }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={() => void saveSection("employment")} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save section</button></div></div></div>}

      <section className="bg-white border rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-lg">Medical Information</h2><button onClick={() => { setDraft(teacher); setEditing("medical"); }} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title="Edit medical information"><Pencil size={17} /></button></div>
        <dl className="grid grid-cols-2 gap-3 text-sm">{[["Blood group", teacher.medicalInformation?.bloodGroup], ["Allergies", teacher.medicalInformation?.allergies], ["Conditions", teacher.medicalInformation?.medicalConditions], ["Medication", teacher.medicalInformation?.medication], ["Disability", teacher.medicalInformation?.disability], ["Notes", teacher.medicalInformation?.notes]].map(([label, value]) => <div key={String(label)}><dt className="text-gray-500">{label}</dt><dd className="font-medium">{value ?? "—"}</dd></div>)}</dl>
      </section>

      {editing === "medical" && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-xl rounded-xl bg-white p-6"><h2 className="font-semibold">Edit Medical Information</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["bloodGroup", "allergies", "medicalConditions", "medication", "disability", "notes"] as const).map((field) => <label key={field}><span className="text-sm capitalize">{field.replace(/([A-Z])/g, " $1")}</span><input value={draft.medicalInformation?.[field] ?? ""} onChange={(event) => setDraft((current: any) => ({ ...current, medicalInformation: { ...current.medicalInformation, [field]: event.target.value } }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={() => void saveSection("medical")} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save section</button></div></div></div>}

      {/* Assignments */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">Teaching Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-sm">No assignments yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Subject</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.subject?.name}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => removeAssignment(a.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate(`/director/teachers/${id}/assignments`)}
          className="mt-3 text-blue-600 hover:underline text-sm"
        >
          Manage Assignments →
        </button>
      </section>

      {/* Emergency Contacts */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">Emergency Contacts</h2>
        {(teacher.emergencyContacts ?? []).length === 0 ? (
          <p className="text-gray-500 text-sm">No emergency contacts.</p>
        ) : (
          <div className="space-y-3">
            {teacher.emergencyContacts.map((c: any) => (
              <div key={c.id} className="border rounded p-3 text-sm">
                <p className="font-medium">
                  {c.fullName}{" "}
                  {c.isNextOfKin && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1 rounded">
                      Next of Kin
                    </span>
                  )}
                </p>
                <p className="text-gray-500">
                  {c.relationship} · {c.phone}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

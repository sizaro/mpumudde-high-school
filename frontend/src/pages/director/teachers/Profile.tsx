import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";
import TeachingAssignmentService from "../../../services/teachingAssignmentService";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      TeacherService.findOne(id),
      TeachingAssignmentService.findByTeacher(id),
    ])
      .then(([t, a]) => {
        setTeacher(t);
        setAssignments(a);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function removeAssignment(assignId: string) {
    await TeachingAssignmentService.remove(assignId);
    setAssignments((prev) => prev.filter((a) => a.id !== assignId));
  }

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;
  if (!teacher)
    return <div className="text-sm text-red-600">Teacher not found.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/director/teachers")}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">
          {teacher.firstName} {teacher.middleName} {teacher.lastName}
        </h1>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-sm font-semibold ${teacher.employment?.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
        >
          {teacher.employment?.status ?? "No Employment Record"}
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Edit Info", path: "edit" },
          { label: "Assignments", path: "assignments" },
          { label: "Contacts", path: "contacts" },
          { label: "Medical", path: "medical" },
          { label: "Documents", path: "documents" },
        ].map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(`/director/teachers/${id}/${a.path}`)}
            className="rounded-2xl border border-slate-200 px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
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
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-medium text-slate-900">{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Employment */}
      {teacher.employment && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Employment</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Employee #", teacher.employment.employeeNumber],
              ["Position", teacher.employment.position],
              ["Department", teacher.employment.department],
              ["Type", teacher.employment.employmentType],
              ["Date", teacher.employment.employmentDate?.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-900">{v ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Assignments */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Teaching Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-sm text-slate-500">No assignments yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left text-slate-500">Subject</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-700">{a.subject?.name}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => removeAssignment(a.id)}
                      className="text-xs text-red-600 hover:underline"
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
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          Manage Assignments →
        </button>
      </section>

      {/* Emergency Contacts */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Emergency Contacts</h2>
        {(teacher.emergencyContacts ?? []).length === 0 ? (
          <p className="text-sm text-slate-500">No emergency contacts.</p>
        ) : (
          <div className="space-y-3">
            {teacher.emergencyContacts.map((c: any) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-900">
                  {c.fullName}{" "}
                  {c.isNextOfKin && (
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      Next of Kin
                    </span>
                  )}
                </p>
                <p className="text-slate-500">
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

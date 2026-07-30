import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";
import TeachingAssignmentService from "../../../services/teachingAssignmentService";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newClassId, setNewClassId] = useState("");
  const [newSubjectId, setNewSubjectId] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      TeacherService.findOne(id),
      TeachingAssignmentService.findByTeacher(id),
      fetch("/classes")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/subjects")
        .then((r) => r.json())
        .catch(() => []),
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
            className="border border-gray-300 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
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

      {/* Employment */}
      {teacher.employment && (
        <section className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Employment</h2>
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

      {/* Assignments */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">Teaching Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-sm">No assignments yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Class</th>
                <th className="text-left py-2">Subject</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.schoolClass?.name}</td>
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

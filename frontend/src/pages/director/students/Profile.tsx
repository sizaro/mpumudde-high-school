import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import PhotoCapture from "../../../components/forms/PhotoCapture";
import ParentService from "../../../services/parentService";
import StudentService from "../../../services/studentService";

const personalFields = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "nationality",
  "address",
  "previousSchool",
] as const;
const medicalFields = [
  "bloodGroup",
  "allergies",
  "medicalConditions",
  "specialNeeds",
  "medicalNotes",
] as const;
const label = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());

function Card({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-amber-700 hover:bg-amber-50"
            title={`Edit ${title}`}
          >
            <Pencil size={17} />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function StudentProfile() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const [student, setStudent] = useState<any>(null);
  const [finance, setFinance] = useState<any>(null);
  const [editing, setEditing] = useState<"personal" | "medical" | null>(null);
  const [draft, setDraft] = useState<any>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [record, summary] = await Promise.all([
      StudentService.getStudent(id),
      StudentService.getStudentFinanceSummary(id),
    ]);
    setStudent(record);
    setFinance(summary);
    setDraft(record);
  };

  useEffect(() => {
    if (!id) return;
    void load().catch(() => setMessage("Unable to load student profile."));
  }, [id]);

  const save = async (section: "personal" | "medical") => {
    try {
      setSaving(true);
      const fields = section === "personal" ? personalFields : medicalFields;
      const payload = Object.fromEntries(
        fields.map((field) => [field, draft[field] || undefined]),
      );
      const updated = await StudentService.updateStudent(id, {
        ...payload,
        passportPhoto: draft.passportPhoto || undefined,
      });
      setStudent((current: any) => ({ ...current, ...updated }));
      setEditing(null);
      setMessage(
        `${section === "personal" ? "Applicant" : "Medical"} information updated.`,
      );
    } catch {
      setMessage("Unable to save this section.");
    } finally {
      setSaving(false);
    }
  };

  if (!student)
    return (
      <div className="p-8 text-sm text-slate-600">
        {message || "Loading student profile..."}
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-8">
      <div>
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <p className="mt-1 text-slate-500">
          Each section is read-only until its Pencil button is selected.
        </p>
      </div>
      {message ? (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Applicant Information"
          onEdit={() => {
            setDraft(student);
            setEditing("personal");
          }}
        >
          <div className="flex gap-4">
            {student.passportPhoto ? (
              <img
                src={student.passportPhoto}
                alt="Student"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-slate-100" />
            )}
            <div className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
              <p>
                <b>Student number:</b> {student.admissionNumber}
              </p>
              <p>
                <b>Name:</b> {student.firstName} {student.lastName}
              </p>
              <p>
                <b>Nationality:</b> {student.nationality || "—"}
              </p>
              <p>
                <b>Previous school:</b> {student.previousSchool || "—"}
              </p>
              <p>
                <b>Date of birth:</b>{" "}
                {student.dateOfBirth?.slice?.(0, 10) || "—"}
              </p>
              <p>
                <b>Gender:</b> {student.gender || "—"}
              </p>
              <p className="sm:col-span-2">
                <b>Address:</b> {student.address || "—"}
              </p>
            </div>
          </div>
        </Card>
        <Card title="Academic Placement">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <b>Academic year:</b> {student.academicYear?.name || "—"}
            </p>
            <p>
              <b>Term:</b> {student.term?.name || "—"}
            </p>
            <p>
              <b>Class:</b> {student.schoolClass?.name || "—"}
            </p>
            <p>
              <b>Category:</b> {student.studentCategory?.name || "—"}
            </p>
          </div>
        </Card>
        <Card
          title="Medical Information"
          onEdit={() => {
            setDraft(student);
            setEditing("medical");
          }}
        >
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {medicalFields.map((field) => (
              <p key={field}>
                <b>{label(field)}:</b> {student[field] || "—"}
              </p>
            ))}
          </div>
        </Card>
        <Card title="Primary Guardian & Contacts">
          <div className="space-y-3 text-sm">
            {student.parents?.length ? (
              student.parents.map((link: any) => (
                <div key={link.id} className="rounded-lg bg-slate-50 p-3">
                  <b>
                    {link.parent?.firstName} {link.parent?.lastName}
                  </b>
                  <p>
                    {link.relationship ||
                      link.parent?.relationship ||
                      "Guardian"}{" "}
                    · {link.parent?.phone || "No phone"}
                  </p>
                  <p>{link.parent?.occupation || ""}</p>
                  <p>{link.parent?.email || ""}</p>
                </div>
              ))
            ) : (
              <p>No guardian information recorded.</p>
            )}
          </div>
        </Card>
        <Card title="Fees & Payments">
          <div className="space-y-2 text-sm">
            {finance?.summary?.length ? (
              finance.summary.map((item: any) => (
                <div
                  key={item.financeStructureId}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <b>{item.feeType}</b>
                  <p>
                    Expected: {item.expectedAmount.toLocaleString()} UGX · Paid:{" "}
                    {item.paidAmount.toLocaleString()} UGX · Balance:{" "}
                    {item.balance.toLocaleString()} UGX
                  </p>
                </div>
              ))
            ) : (
              <p>No fee details are available for this student.</p>
            )}
          </div>
        </Card>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="font-semibold">
              Edit{" "}
              {editing === "personal"
                ? "Applicant Information"
                : "Medical Information"}
            </h2>
            {editing === "personal" ? (
              <div className="mt-4">
                <PhotoCapture
                  label="Student photo"
                  value={draft.passportPhoto || ""}
                  onChange={(value) =>
                    setDraft((current: any) => ({
                      ...current,
                      passportPhoto: value,
                    }))
                  }
                />
              </div>
            ) : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(editing === "personal" ? personalFields : medicalFields).map(
                (field) => (
                  <label
                    key={field}
                    className={
                      field === "address" || field === "medicalNotes"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <span className="text-sm">{label(field)}</span>
                    {field === "gender" && editing === "personal" ? (
                      <select
                        value={draft[field] ?? ""}
                        onChange={(event) =>
                          setDraft((current: any) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : field === "dateOfBirth" ? (
                      <input
                        type="date"
                        value={draft[field]?.slice?.(0, 10) ?? ""}
                        onChange={(event) =>
                          setDraft((current: any) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    ) : field === "address" || field === "medicalNotes" ? (
                      <textarea
                        value={draft[field] ?? ""}
                        onChange={(event) =>
                          setDraft((current: any) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={draft[field] ?? ""}
                        onChange={(event) =>
                          setDraft((current: any) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    )}
                  </label>
                ),
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save(editing)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save section"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

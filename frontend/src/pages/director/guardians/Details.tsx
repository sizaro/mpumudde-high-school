import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  FileText,
  KeyRound,
  Link2,
  Pencil,
  Power,
  Unlink,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ParentService, {
  type Guardian,
  type GuardianCredentials,
} from "../../../services/parentService";
import StudentService from "../../../services/studentService";

export default function GuardianDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState("");
  const [relationship, setRelationship] = useState("Guardian");
  const [isPrimary, setIsPrimary] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [credentials, setCredentials] = useState<GuardianCredentials | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const load = async () => {
    const [guardianResult, studentResult] = await Promise.all([
      ParentService.getGuardian(id),
      StudentService.getStudents(),
    ]);
    setGuardian(guardianResult);
    setStudents(studentResult);
  };
  useEffect(() => {
    load().catch(() => setMessage("Unable to load guardian details."));
  }, [id]);
  useEffect(() => {
    if (guardian?.user?.email) {
      setLoginEmail(guardian.user.email);
    }
  }, [guardian?.user?.email]);
  const activeLinks = guardian?.students.filter((link) => link.isActive) ?? [];
  const previousLinks =
    guardian?.students.filter((link) => !link.isActive) ?? [];
  const availableStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          !activeLinks.some((link) => link.student.id === student.id),
      ),
    [students, activeLinks],
  );

  const createAccount = async () => {
    try {
      const result = await ParentService.createPortalAccount(id, loginEmail);
      setCredentials({
        email: result.user?.email ?? loginEmail,
        temporaryPassword: result.temporaryPassword,
      });
      await load();
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to create portal account.",
      );
    }
  };
  const resetPassword = async () => {
    if (
      !window.confirm(
        "Generate a new temporary password? The previous password will stop working.",
      )
    )
      return;
    try {
      const result = await ParentService.resetPortalPassword(
        id,
        loginEmail || undefined,
      );
      setCredentials({
        email: result.user?.email ?? "",
        temporaryPassword: result.temporaryPassword,
      });
      await load();
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to reset password.",
      );
    }
  };
  const toggleStatus = async () => {
    if (!guardian?.user) return;
    try {
      await ParentService.updatePortalStatus(id, !guardian.user.isActive);
      await load();
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to change portal status.",
      );
    }
  };
  const linkStudent = async () => {
    if (!studentId) return;
    try {
      await ParentService.linkStudent(id, {
        studentId,
        relationship,
        isPrimary,
      });
      setStudentId("");
      setIsPrimary(false);
      await load();
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to link student.",
      );
    }
  };
  const unlinkStudent = async (childId: string) => {
    const reason = window.prompt("Why is this relationship being removed?");
    if (reason === null) return;
    try {
      await ParentService.unlinkStudent(id, childId, reason);
      await load();
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to unlink student.",
      );
    }
  };
  const archive = async () => {
    if (
      !guardian ||
      !window.confirm(
        `Archive ${guardian.firstName} ${guardian.lastName}? Portal access will be disabled and relationship history preserved.`,
      )
    )
      return;
    try {
      await ParentService.deleteGuardian(id);
      navigate("/director/guardians");
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to archive guardian.",
      );
    }
  };

  if (!guardian)
    return <p className="text-slate-500">{message || "Loading guardian…"}</p>;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-200">
            {guardian.profilePhoto ? (
              <img
                src={guardian.profilePhoto}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-500">
                {guardian.firstName[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {guardian.firstName} {guardian.lastName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeLinks.length} active linked child
              {activeLinks.length === 1 ? "" : "ren"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/director/guardians/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm"
          >
            <Pencil size={17} />
            Edit
          </Link>
          <button
            onClick={() => void archive()}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-700"
          >
            <Archive size={17} />
            Archive
          </button>
        </div>
      </div>
      {message && (
        <p className="rounded-2xl bg-amber-50 p-4 text-amber-800">{message}</p>
      )}
      {credentials && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-lg font-bold text-emerald-950">
            Temporary portal credentials
          </h2>
          <p className="mt-1 text-sm text-emerald-800">
            Copy these now. The password cannot be viewed again.
          </p>
          <div className="mt-4 grid gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2">
            <Info label="Login email" value={credentials.email} />
            <Info
              label="Temporary password"
              value={credentials.temporaryPassword}
            />
          </div>
          <button
            onClick={() => setCredentials(null)}
            className="mt-4 text-sm font-semibold text-emerald-900"
          >
            I have saved these credentials
          </button>
        </section>
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Guardian information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Phone" value={guardian.phone || "—"} />
            <Info label="Communication email" value={guardian.email || "—"} />
            <Info label="Gender" value={guardian.gender || "—"} />
            <Info label="Occupation" value={guardian.occupation || "—"} />
            <Info label="Address" value={guardian.address || "—"} />
          </div>
        </Card>
        <Card title="Portal account">
          {guardian.user ? (
            <div className="space-y-4">
              <Info label="Login email" value={guardian.user.email} />
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="Update portal email (optional)"
                className="w-full rounded-2xl border px-4 py-3"
              />
              <Info
                label="Account status"
                value={guardian.user.isActive ? "Active" : "Inactive"}
              />
              <Info
                label="Last login"
                value={
                  guardian.user.lastLogin
                    ? new Date(guardian.user.lastLogin).toLocaleString()
                    : "Never"
                }
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => void resetPassword()}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm"
                >
                  <KeyRound size={16} />
                  Reset password {loginEmail ? "and update email" : ""}
                </button>
                <button
                  onClick={() => void toggleStatus()}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-white ${guardian.user.isActive ? "bg-red-600" : "bg-emerald-600"}`}
                >
                  <Power size={16} />
                  {guardian.user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-600">
                No parent portal account exists.
              </p>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="Optional login email; blank generates @mhs.com"
                className="mt-4 w-full rounded-2xl border px-4 py-3"
              />
              <button
                onClick={() => void createAccount()}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                <UserPlus size={17} />
                Create portal account
              </button>
            </div>
          )}
        </Card>
      </div>
      <Card title="Active linked students">
        <div className="space-y-3">
          {activeLinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  to={`/director/students/profile?id=${link.student.id}`}
                  className="font-semibold text-blue-700"
                >
                  {link.student.firstName} {link.student.lastName}
                </Link>
                <p className="text-sm text-slate-500">
                  {link.student.admissionNumber} ·{" "}
                  {link.student.schoolClass?.name || "No class"} ·{" "}
                  {link.student.academicYear?.name || "No year"} ·{" "}
                  {link.relationship || "Guardian"}
                  {link.isPrimary ? " · Primary guardian" : ""}
                </p>
              </div>
              <button
                onClick={() => void unlinkStudent(link.student.id)}
                className="inline-flex items-center gap-2 text-sm text-red-700"
              >
                <Unlink size={16} />
                Unlink student
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-3 overflow-hidden rounded-2xl border border-dashed border-slate-300 p-3 sm:p-4 md:grid-cols-2 lg:grid-cols-4">
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2"
          >
            <option value="">Select another student</option>

            {availableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} —{" "}
                {student.admissionNumber} —{" "}
                {student.schoolClass?.name || "No class"}
              </option>
            ))}
          </select>

          <select
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {[
              "Father",
              "Mother",
              "Guardian",
              "Uncle",
              "Aunt",
              "Grandfather",
              "Grandmother",
              "Other",
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!studentId}
            onClick={() => void linkStudent()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Link2 size={16} />
            Link student
          </button>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 md:col-span-2 lg:col-span-4">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) => setIsPrimary(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <span>Make this guardian primary for the selected child</span>
          </label>
        </div>
      </Card>
      <Card title="Supporting documents">
        {guardian.documents.length === 0 ? (
          <p className="text-sm text-slate-500">No documents saved.</p>
        ) : (
          <div className="space-y-2">
            {guardian.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      {document.documentCategory.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {document.originalFileName}
                    </p>
                  </div>
                </div>
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-700"
                >
                  View document
                </a>
              </div>
            ))}
          </div>
        )}
      </Card>
      {previousLinks.length > 0 && (
        <Card title="Previous relationships">
          <div className="space-y-2">
            {previousLinks.map((link) => (
              <p
                key={link.id}
                className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"
              >
                {link.student.firstName} {link.student.lastName} ·{" "}
                {link.relationship || "Guardian"} ·{" "}
                {link.unlinkReason || "Unlinked"}{" "}
                {link.unlinkedAt
                  ? `on ${new Date(link.unlinkedAt).toLocaleDateString()}`
                  : ""}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}

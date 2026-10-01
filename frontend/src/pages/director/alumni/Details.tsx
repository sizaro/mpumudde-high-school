import { useEffect, useState, type ReactNode } from "react";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Unlock,
  UserRound,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import alumniService, {
  type DirectorAlumni,
} from "../../../services/alumniService";

export default function AlumniDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState<DirectorAlumni | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    if (!id) {
      setMessage("Alumni record ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await alumniService.getAlumniById(id);
      setAlumni(result);
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to load alumni details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const getStatus = () => {
    if (!alumni) return "UNKNOWN";
    if (!alumni.isActive) return "ARCHIVED";
    if (alumni.lockedAt) return "LOCKED";
    return "ACTIVE";
  };

  const status = getStatus();

  const primaryEmailContact =
    alumni?.contacts.find(
      (contact) =>
        contact.kind === "EMAIL" && contact.isPrimary && contact.isActive,
    ) ??
    alumni?.contacts.find(
      (contact) => contact.kind === "EMAIL" && contact.isActive,
    ) ??
    null;

  const emailVerified =
    primaryEmailContact?.isVerified ?? alumni?.primaryEmailVerified ?? false;

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-UG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const lock = async () => {
    if (!alumni || status !== "ACTIVE") return;

    const reason = window.prompt("Why is this alumni record being locked?");

    if (reason === null) return;

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setMessage("A reason is required when locking an alumni record.");
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      const updated = await alumniService.updateAlumniStatus(id, {
        locked: true,
        reason: trimmedReason,
      });

      setAlumni(updated);
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to lock alumni record.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const unlock = async () => {
    if (!alumni || status !== "LOCKED") return;

    if (
      !window.confirm(
        `Unlock ${alumni.fullName}? The alumni record will become active again.`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      const updated = await alumniService.updateAlumniStatus(id, {
        locked: false,
      });

      setAlumni(updated);
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to unlock alumni record.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const archive = async () => {
    if (!alumni || status === "ARCHIVED") return;

    if (
      !window.confirm(
        `Archive ${alumni.fullName}? The record will remain in the system as archived and communication contacts will be deactivated.`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      await alumniService.archiveAlumni(id);
      navigate("/director/alumni");
    } catch (exception: any) {
      setMessage(
        exception.response?.data?.message ?? "Unable to archive alumni record.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">Loading alumni details…</p>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="space-y-5">
        <Link
          to="/director/alumni"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Alumni
        </Link>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-900">
            {message || "Alumni record could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/director/alumni"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Alumni
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-200">
            {alumni.profileImageUrl ? (
              <img
                src={alumni.profileImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-500">
                {getInitials(alumni.fullName)}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {alumni.fullName}
              </h1>

              <StatusBadge status={status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Alumni record · Registered {formatDate(alumni.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/director/alumni/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <Pencil size={17} />
            Edit
          </Link>

          {status === "ACTIVE" && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => void lock()}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock size={17} />
              Lock
            </button>
          )}

          {status === "LOCKED" && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => void unlock()}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Unlock size={17} />
              Unlock
            </button>
          )}

          {status !== "ARCHIVED" && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => void archive()}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Archive size={17} />
              Archive
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          {message}
        </div>
      )}

      {status === "LOCKED" && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 shrink-0 text-amber-700" size={20} />

            <div>
              <h2 className="font-bold text-amber-950">
                Alumni record is locked
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                Locked on {formatDate(alumni.lockedAt)}.
              </p>

              {alumni.lockedReason && (
                <div className="mt-3 rounded-2xl bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Lock reason
                  </p>
                  <p className="mt-1 text-sm text-amber-950">
                    {alumni.lockedReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {status === "ARCHIVED" && (
        <section className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
          <div className="flex items-start gap-3">
            <UserRoundX className="mt-0.5 shrink-0 text-slate-600" size={20} />

            <div>
              <h2 className="font-bold text-slate-900">
                Alumni record is archived
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                This record is no longer active and its communication contacts
                have been deactivated.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Alumni information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Info label="Full name" value={alumni.fullName || "—"} />

            <Info
              label="Graduation year"
              value={
                alumni.graduationYear
                  ? String(alumni.graduationYear)
                  : "Not provided"
              }
            />

            <Info
              label="Student period"
              value={alumni.studentPeriod || "Not provided"}
            />

            <Info
              label="Remembered person"
              value={alumni.rememberedPerson || "Not provided"}
            />

            <Info label="Registered" value={formatDate(alumni.createdAt)} />

            <Info label="Last updated" value={formatDate(alumni.updatedAt)} />
          </div>
        </Card>

        <Card title="Contact information">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                <Mail size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Registration email
                </p>

                <p className="mt-1 break-all font-medium text-slate-800">
                  {alumni.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <Mail size={14} />
                      Not verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  WhatsApp number
                </p>

                <p className="mt-1 font-medium text-slate-800">
                  {alumni.whatsappNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Email contacts">
        {alumni.contacts.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 text-slate-400" size={20} />
              <div>
                <p className="font-semibold text-slate-800">
                  No communication contact is linked
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  The alumni profile still contains the registration email:
                  {` ${alumni.email}`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {alumni.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-blue-700">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-all font-semibold text-slate-800">
                      {contact.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {contact.isPrimary ? "Primary" : "Additional"} email
                      {contact.label ? ` · ${contact.label}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {contact.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      Not verified
                    </span>
                  )}

                  {!contact.isActive && (
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Possible student match">
        {alumni.possibleStudentMatch ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <UserRoundCheck
                className="mt-0.5 shrink-0 text-amber-700"
                size={21}
              />

              <div>
                <h3 className="font-bold text-amber-950">
                  Possible student match detected
                </h3>

                <p className="mt-1 text-sm text-amber-800">
                  This alumni registration has been flagged as potentially
                  matching a student record.
                </p>

                {alumni.possibleStudentMatchDetails && (
                  <div className="mt-3 rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Match details
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-amber-950">
                      {alumni.possibleStudentMatchDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 shrink-0 text-slate-400" size={20} />

              <div>
                <p className="font-semibold text-slate-800">
                  No possible student match flagged
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  This alumni record currently has no student-match warning.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card title="Record information">
        <div className="grid gap-5 sm:grid-cols-2">
          <Info label="Alumni ID" value={alumni.id} />

          <Info
            label="Profile image"
            value={
              alumni.profileImageUrl
                ? "Profile image available"
                : "No profile image"
            }
          />

          <Info label="Record status" value={formatStatus(status)} />

          <Info
            label="Primary email verified"
            value={emailVerified ? "Yes" : "No"}
          />
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">{title}</h2>

      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={14} />
        Active
      </span>
    );
  }

  if (status === "LOCKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Lock size={14} />
        Locked
      </span>
    );
  }

  if (status === "ARCHIVED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <Archive size={14} />
        Archived
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Unknown
    </span>
  );
}

function formatStatus(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "LOCKED":
      return "Locked";
    case "ARCHIVED":
      return "Archived";
    default:
      return "Unknown";
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

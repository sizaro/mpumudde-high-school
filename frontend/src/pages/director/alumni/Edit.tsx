import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Archive, Mail, Save, UserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import alumniService, {
  type DirectorAlumni,
  type UpdateAlumniInput,
} from "../../../services/alumniService";

export default function AlumniEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState<DirectorAlumni | null>(null);

  const [fullName, setFullName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [studentPeriod, setStudentPeriod] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [rememberedPerson, setRememberedPerson] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    if (!id) {
      setError("Alumni record ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await alumniService.getAlumniById(id);

      setAlumni(result);
      setFullName(result.fullName ?? "");
      setGraduationYear(
        result.graduationYear !== null ? String(result.graduationYear) : "",
      );
      setStudentPeriod(result.studentPeriod ?? "");
      setWhatsappNumber(result.whatsappNumber ?? "");
      setRememberedPerson(result.rememberedPerson ?? "");
    } catch (exception: any) {
      setError(
        exception.response?.data?.message ?? "Unable to load alumni record.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Alumni record ID is missing.");
      return;
    }

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    let parsedGraduationYear: number | null = null;

    if (graduationYear.trim()) {
      const parsed = Number(graduationYear);

      if (
        !Number.isInteger(parsed) ||
        parsed < 1900 ||
        parsed > new Date().getFullYear()
      ) {
        setError(
          `Graduation year must be a whole year between 1900 and ${new Date().getFullYear()}.`,
        );
        return;
      }

      parsedGraduationYear = parsed;
    }

    const input: UpdateAlumniInput = {
      fullName: trimmedName,
      graduationYear: parsedGraduationYear,
      studentPeriod: studentPeriod.trim() || null,
      whatsappNumber: whatsappNumber.trim() || null,
      rememberedPerson: rememberedPerson.trim() || null,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updated = await alumniService.updateAlumni(id, input);

      setAlumni(updated);
      setFullName(updated.fullName ?? "");
      setGraduationYear(
        updated.graduationYear !== null ? String(updated.graduationYear) : "",
      );
      setStudentPeriod(updated.studentPeriod ?? "");
      setWhatsappNumber(updated.whatsappNumber ?? "");
      setRememberedPerson(updated.rememberedPerson ?? "");

      setMessage("Alumni information updated successfully.");
    } catch (exception: any) {
      setError(
        exception.response?.data?.message ??
          "Unable to update alumni information.",
      );
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!alumni || alumni.isActive === false) return;

    if (
      !window.confirm(
        `Archive ${alumni.fullName}? The record will remain in the system as archived and its communication contacts will be deactivated.`,
      )
    ) {
      return;
    }

    try {
      setArchiving(true);
      setError("");
      setMessage("");

      await alumniService.archiveAlumni(id);
      navigate("/director/alumni");
    } catch (exception: any) {
      setError(
        exception.response?.data?.message ?? "Unable to archive alumni record.",
      );
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">Loading alumni record…</p>
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
            {error || "Alumni record could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/director/alumni/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Alumni Profile
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <UserRound size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Alumni</h1>

              <p className="mt-1 text-sm text-slate-500">
                Update information for {alumni.fullName}.
              </p>
            </div>
          </div>
        </div>

        {alumni.isActive && (
          <button
            type="button"
            disabled={archiving || saving}
            onClick={() => void archive()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Archive size={17} />
            Archive
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Alumni information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information associated with this alumni record.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Full name"
              required
              value={fullName}
              onChange={setFullName}
              placeholder="Full name"
            />

            <Field
              label="Graduation year"
              value={graduationYear}
              onChange={setGraduationYear}
              placeholder="e.g. 2011"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
            />

            <Field
              label="Student period"
              value={studentPeriod}
              onChange={setStudentPeriod}
              placeholder="e.g. 2009-2011"
            />

            <Field
              label="WhatsApp number"
              value={whatsappNumber}
              onChange={setWhatsappNumber}
              placeholder="+256..."
            />

            <div className="md:col-span-2">
              <Field
                label="Remembered person"
                value={rememberedPerson}
                onChange={setRememberedPerson}
                placeholder="Name of a person remembered from school"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Registration email
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The registration email cannot be changed from this profile editor.
              Email changes should go through a verification flow.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="rounded-xl bg-white p-2 text-blue-700">
              <Mail size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all font-semibold text-slate-800">
                {alumni.email}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {alumni.primaryEmailVerified
                  ? "Verified email"
                  : "Email is not verified"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Record status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Locking and unlocking are managed from the alumni profile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatusInfo label="Active" value={alumni.isActive ? "Yes" : "No"} />

            <StatusInfo label="Locked" value={alumni.lockedAt ? "Yes" : "No"} />

            <StatusInfo
              label="Possible student match"
              value={alumni.possibleStudentMatch ? "Yes" : "No"}
            />
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to={`/director/alumni/${id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || archiving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function StatusInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

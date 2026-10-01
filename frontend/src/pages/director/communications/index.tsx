import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CheckCircle2, MailCheck, Send, UsersRound } from "lucide-react";
import SetupService, { type SchoolClass } from "../../../services/setupService";
import CommunicationService, {
  type CommunicationAudience,
  type CommunicationPreview,
  type SchoolCommunication,
} from "../../../services/communicationService";

const audienceLabels: Record<CommunicationAudience, string> = {
  EVERYONE: "Everyone",
  PARENTS: "Parents and guardians",
  STUDENTS: "Students",
  TEACHERS: "Teachers",
  ALUMNI: "Alumni",
};

const audienceDescriptions: Record<CommunicationAudience, string> = {
  EVERYONE: "Parents, students, teachers, and alumni",
  PARENTS: "Parents and guardians of active students",
  STUDENTS: "Active students with verified communication emails",
  TEACHERS: "Active teachers with portal accounts",
  ALUMNI: "Active alumni with verified communication emails",
};

function messageFor(error: unknown) {
  const response = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const message = response.response?.data?.message;

  return Array.isArray(message)
    ? message.join(" ")
    : message || "Unable to complete this communication action.";
}

export default function DirectorCommunicationsPage() {
  const [audience, setAudience] = useState<CommunicationAudience>("PARENTS");

  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [preview, setPreview] = useState<CommunicationPreview | null>(null);
  const [history, setHistory] = useState<SchoolCommunication[]>([]);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  const classFilterApplies =
    audience === "EVERYONE" ||
    audience === "PARENTS" ||
    audience === "STUDENTS";

  const payload = useMemo(
    () => ({
      audience,
      subject: subject.trim(),
      message: message.trim(),
      ...(classFilterApplies && classId ? { classId } : {}),
    }),
    [audience, classFilterApplies, classId, message, subject],
  );

  const load = async () => {
    setLoading(true);

    try {
      const [schoolClasses, records] = await Promise.all([
        SetupService.getClasses(),
        CommunicationService.list(),
      ]);

      setClasses(schoolClasses.filter((item) => item.isActive));

      setHistory(records);
    } catch (error) {
      setFeedback(messageFor(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const changeAudience = (nextAudience: CommunicationAudience) => {
    setAudience(nextAudience);
    setPreview(null);

    if (nextAudience === "TEACHERS" || nextAudience === "ALUMNI") {
      setClassId("");
    }
  };

  const review = async (event: FormEvent) => {
    event.preventDefault();

    setFeedback("");
    setPreview(null);

    if (!payload.subject || !payload.message) {
      setFeedback("Enter both a subject and message before reviewing.");
      return;
    }

    setReviewing(true);

    try {
      setPreview(await CommunicationService.preview(payload));
    } catch (error) {
      setFeedback(messageFor(error));
    } finally {
      setReviewing(false);
    }
  };

  const send = async () => {
    setSending(true);
    setFeedback("");

    try {
      const created = await CommunicationService.send(payload);

      setHistory((current) => [created, ...current]);

      setSubject("");
      setMessage("");
      setClassId("");
      setPreview(null);

      setFeedback(
        `Communication sent. ${
          created._count?.recipients ?? 0
        } recipient records were created.`,
      );
    } catch (error) {
      setFeedback(messageFor(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-semibold text-blue-100">
          School communication centre
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Send a clear, official school message.
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
          Messages are saved in school history, delivered read-only through
          eligible portals, and emailed only to verified communication contacts.
        </p>
      </div>

      {feedback && (
        <p
          className={`rounded-2xl p-4 text-sm ${
            feedback.startsWith("Communication sent")
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          onSubmit={review}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              New communication
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose the audience, write the message, then review the delivery
              coverage before sending.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Audience
              <select
                value={audience}
                onChange={(event) =>
                  changeAudience(event.target.value as CommunicationAudience)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"
              >
                <option value="PARENTS">Parents and guardians</option>

                <option value="STUDENTS">Students</option>

                <option value="TEACHERS">Teachers</option>

                <option value="ALUMNI">Alumni</option>

                <option value="EVERYONE">Everyone</option>
              </select>
              <span className="mt-2 block text-xs font-normal leading-5 text-slate-400">
                {audienceDescriptions[audience]}
              </span>
            </label>

            {classFilterApplies && (
              <label className="text-sm font-semibold text-slate-700">
                Class filter{" "}
                <span className="font-normal text-slate-400">(optional)</span>
                <select
                  value={classId}
                  onChange={(event) => {
                    setClassId(event.target.value);
                    setPreview(null);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"
                >
                  <option value="">All active classes</option>

                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="mt-2 block text-xs font-normal leading-5 text-slate-400">
                  Applies to parent and student recipients. Alumni and teachers
                  are not class-filtered.
                </span>
              </label>
            )}
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Subject
            <input
              required
              maxLength={180}
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setPreview(null);
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal"
              placeholder="For example: Parent meeting this Friday"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Message
            <textarea
              required
              maxLength={10000}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setPreview(null);
              }}
              rows={8}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal"
              placeholder="Write the official school message here..."
            />
          </label>

          <button
            type="submit"
            disabled={reviewing}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            <CheckCircle2 size={17} />

            {reviewing ? "Checking recipients..." : "Review delivery"}
          </button>
        </form>

        <aside className="self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Review</h2>

          <p className="mt-1 text-sm text-slate-500">
            {audienceLabels[audience]}
          </p>

          {preview ? (
            <div className="mt-5 space-y-3">
              <Metric
                icon={<UsersRound size={18} />}
                label="Matching recipients"
                value={preview.totalRecipients}
              />

              <Metric
                icon={<CheckCircle2 size={18} />}
                label="Portal copies"
                value={preview.portalRecipients}
              />

              <Metric
                icon={<MailCheck size={18} />}
                label="Verified email addresses"
                value={preview.verifiedEmailRecipients}
              />

              <p className="rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                {preview.withoutVerifiedEmail} recipients do not yet have a
                verified primary email. They can still receive a portal copy
                when they have a portal account.
              </p>

              <button
                type="button"
                disabled={sending || preview.totalRecipients === 0}
                onClick={() => void send()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <Send size={17} />

                {sending ? "Sending..." : "Send official communication"}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">
              A recipient coverage summary will appear here after you review the
              message.
            </p>
          )}
        </aside>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Communication history
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The most recent official messages and their recipient records.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Subject</th>

                <th className="px-6 py-3">Audience</th>

                <th className="px-6 py-3">Recipients</th>

                <th className="px-6 py-3">Sent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading school communication history...
                  </td>
                </tr>
              ) : history.length ? (
                history.map((item) => (
                  <tr key={item.id}>
                    <td className="max-w-md px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.subject}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {item.message}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {audienceLabels[item.audience as CommunicationAudience] ??
                        item.audience}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item._count?.recipients ?? 0}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {item.sentAt
                        ? new Date(item.sentAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No official communications have been sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <span className="text-blue-700">{icon}</span>

      <span className="min-w-0 flex-1 text-sm text-slate-600">{label}</span>

      <b className="text-lg text-slate-900">{value}</b>
    </div>
  );
}

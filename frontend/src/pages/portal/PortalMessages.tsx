import {
  ArrowLeft,
  ChevronRight,
  Inbox,
  LoaderCircle,
  MailOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PortalCommunicationContent from "../../components/portal/PortalCommunicationContent";
import CommunicationService, {
  type PortalSchoolMessage,
} from "../../services/communicationService";

export default function PortalMessages() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = location.pathname.startsWith("/teacher")
    ? "/teacher/messages"
    : "/parent/messages";
  const [messages, setMessages] = useState<PortalSchoolMessage[]>([]);
  const [selected, setSelected] = useState<PortalSchoolMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void CommunicationService.listPortalInbox()
      .then((records) => {
        if (active) setMessages(records);
      })
      .catch(() => {
        if (active)
          setError("School messages could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setSelected(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    void CommunicationService.getPortalMessage(id)
      .then((message) => {
        if (active) setSelected(message);
      })
      .catch(() => {
        if (active)
          setError("This school message is unavailable in your portal.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const heading = useMemo(
    () => (id ? "School message" : "School messages"),
    [id],
  );
  if (loading && !selected && !messages.length)
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
        <LoaderCircle className="mr-2 animate-spin" size={18} /> Loading school
        messages…
      </div>
    );

  if (id && selected)
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <button
          type="button"
          onClick={() => navigate(basePath)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft size={17} /> Back to school messages
        </button>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8a5f]">
              {selected.format || "Announcement"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {selected.subject}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Published{" "}
              {selected.sentAt
                ? new Date(selected.sentAt).toLocaleString()
                : "by Mpumudde High School"}
            </p>
          </div>
          <div className="pt-6">
            <PortalCommunicationContent
              document={selected.contentDocument}
              fallbackMessage={selected.message}
            />
          </div>
        </article>
      </div>
    );

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8a5f]">
            Official communications
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Announcements, newsletters, invitations and reminders sent by
            Mpumudde High School.
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Inbox size={24} />
        </div>
      </div>
      {error ? (
        <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      ) : messages.length ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {messages.map((message) => (
            <button
              key={message.id}
              type="button"
              onClick={() => navigate(`${basePath}/${message.id}`)}
              className="flex w-full items-start gap-4 border-b border-slate-100 p-5 text-left last:border-b-0 hover:bg-slate-50"
            >
              <div
                className={`mt-1 rounded-full p-2 ${message.notification?.isRead === false ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
              >
                <MailOpen size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-bold text-slate-900">{message.subject}</p>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {message.format || "Announcement"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                  {message.message}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {message.sentAt
                    ? new Date(message.sentAt).toLocaleString()
                    : ""}
                </p>
              </div>
              <ChevronRight
                className="mt-1 shrink-0 text-slate-400"
                size={19}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Inbox className="mx-auto text-slate-400" size={30} />
          <h2 className="mt-3 font-bold text-slate-800">
            No school messages yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Official communications delivered to this account will appear here.
          </p>
        </div>
      )}
    </section>
  );
}

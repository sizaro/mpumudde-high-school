import { BadgeCheck, MailCheck, Send } from "lucide-react";
import { useEffect, useState } from "react";
import CommunicationService from "../../services/communicationService";

type OwnerType = "PARENT" | "TEACHER";

function errorMessage(error: unknown) {
  const response = error as { response?: { data?: { message?: string | string[] } } };
  const message = response.response?.data?.message;
  return Array.isArray(message) ? message.join(" ") : message || "Unable to verify this communication email.";
}

export default function VerifiedCommunicationEmailField({
  ownerType,
  email,
  onEmailChange,
  verificationId,
  onVerificationChange,
  label = "Communication email",
  required = true,
  existingOwnerId,
}: {
  ownerType: OwnerType;
  email: string;
  onEmailChange: (value: string) => void;
  verificationId?: string;
  onVerificationChange: (id?: string) => void;
  label?: string;
  required?: boolean;
  existingOwnerId?: string;
}) {
  const [code, setCode] = useState("");
  const [requestId, setRequestId] = useState<string | undefined>(verificationId);
  const [lockedExistingEmail, setLockedExistingEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setRequestId(verificationId), [verificationId]);

  useEffect(() => {
    if (!existingOwnerId || !email) return;
    void CommunicationService.listOwnerContacts(ownerType, existingOwnerId)
      .then((contacts) => {
        const current = contacts.find(
          (item) => item.kind === "EMAIL" && item.isPrimary && item.value.trim().toLowerCase() === email.trim().toLowerCase(),
        );
        setLockedExistingEmail(Boolean(current?.isVerified));
      })
      .catch(() => undefined);
  }, [email, existingOwnerId, ownerType]);

  const locked = Boolean(verificationId) || lockedExistingEmail;

  const changeEmail = (value: string) => {
    onEmailChange(value);
    onVerificationChange(undefined);
    setRequestId(undefined);
    setLockedExistingEmail(false);
    setCode("");
    setMessage("");
  };

  const send = async () => {
    if (!email.trim()) {
      setMessage("Enter the communication email first.");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const verification = await CommunicationService.requestRegistrationEmailVerification(ownerType, email);
      setRequestId(verification.id);
      onVerificationChange(undefined);
      setMessage(
        verification.deliveryStatus === "SENT"
          ? "A six-digit code was sent to this address. Enter it below before continuing."
          : "The code could not be delivered. Check the school email configuration, then try again.",
      );
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  const confirm = async () => {
    if (!requestId || code.length !== 6) {
      setMessage("Enter the six-digit code from the email.");
      return;
    }
    setConfirming(true);
    setMessage("");
    try {
      const verified = await CommunicationService.confirmRegistrationEmailVerification(requestId, code);
      setRequestId(verified.id);
      onVerificationChange(verified.id);
      setLockedExistingEmail(true);
      setCode("");
      setMessage("Email verified. It is now locked for this registration.");
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setConfirming(false);
    }
  };

  const useAnother = () => {
    onVerificationChange(undefined);
    setRequestId(undefined);
    setLockedExistingEmail(false);
    setCode("");
    setMessage("Enter the replacement email, then verify it before saving.");
  };

  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <label className="block text-sm font-medium text-slate-700">{label}{required ? " *" : ""}</label>
        <p className="mt-1 text-xs text-slate-500">Used for official school communication only; it is separate from the portal login email.</p>
      </div>
      {locked && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><BadgeCheck size={14} /> Verified</span>}
    </div>
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input type="email" required={required} readOnly={locked} value={email} onChange={(event) => changeEmail(event.target.value)} placeholder="name@example.com" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 read-only:bg-slate-100" />
      {locked ? <button type="button" onClick={useAnother} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Use another email</button> : <button type="button" onClick={() => void send()} disabled={sending || !email.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send size={16} />{sending ? "Sending…" : "Verify email"}</button>}
    </div>
    {!locked && requestId && <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="Six-digit code" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 tracking-[0.25em] sm:max-w-56" /><button type="button" onClick={() => void confirm()} disabled={confirming || code.length !== 6} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50">{confirming ? "Checking…" : "Confirm code"}</button></div>}
    {message && <p className={`mt-3 rounded-xl p-3 text-sm ${locked ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"}`}><MailCheck className="mr-1 inline-block" size={15} />{message}</p>}
  </div>;
}

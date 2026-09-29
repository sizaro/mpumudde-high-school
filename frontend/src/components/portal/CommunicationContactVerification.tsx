import { BadgeCheck, MailCheck, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import CommunicationService, { type CommunicationContact } from '../../services/communicationService';

function errorMessage(error: unknown) {
  const response = error as { response?: { data?: { message?: string | string[] } } };
  const message = response.response?.data?.message;
  return Array.isArray(message) ? message.join(' ') : message || 'Unable to complete email verification.';
}

export default function CommunicationContactVerification() {
  const [contact, setContact] = useState<CommunicationContact | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    CommunicationService.listMyContacts()
      .then((contacts) => setContact(contacts.find((item) => item.kind === 'EMAIL' && item.isPrimary) ?? contacts.find((item) => item.kind === 'EMAIL') ?? null))
      .catch(() => setMessage('Unable to load your communication email.'))
      .finally(() => setLoading(false));
  }, []);

  const request = async () => {
    if (!contact) return;
    setSending(true); setMessage('');
    try {
      const result = await CommunicationService.requestContactVerification(contact.id);
      setContact(result.contact);
      setMessage(result.deliveryStatus === 'SENT' ? 'A six-digit verification code has been sent to this email address.' : 'The school email service is not ready to send a code yet. Please contact the administration.');
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setSending(false); }
  };

  const verify = async () => {
    if (!contact || code.trim().length !== 6) { setMessage('Enter the six-digit code from your email.'); return; }
    setVerifying(true); setMessage('');
    try {
      const updated = await CommunicationService.confirmContactVerification(contact.id, code);
      setContact(updated); setCode(''); setMessage('Your communication email has been verified.');
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setVerifying(false); }
  };

  if (loading) return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Loading communication contact…</p></section>;
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-900">Communication email</h2><p className="mt-1 text-sm text-slate-500">This is separate from your school portal login email and is used for official school communication.</p></div><MailCheck className="shrink-0 text-blue-600" /></div>
    {!contact ? <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">The school has not recorded a communication email for you. Contact the administration to add one.</p> : <><div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="break-all font-semibold text-slate-800">{contact.value}</p><p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${contact.isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>{contact.isVerified ? <><BadgeCheck size={15} /> Verified for official communication</> : 'Not verified yet'}</p></div>
      {message && <p className={`mt-4 rounded-xl p-3 text-sm ${contact.isVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>{message}</p>}
      {!contact.isVerified && <div className="mt-5 space-y-3"><button type="button" disabled={sending} onClick={() => void request()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Send size={16} />{sending ? 'Sending code…' : 'Send verification code'}</button><div className="flex flex-col gap-2 sm:flex-row"><input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 tracking-[0.35em] sm:max-w-48" placeholder="000000" aria-label="Six-digit verification code" /><button type="button" disabled={verifying || code.length !== 6} onClick={() => void verify()} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">{verifying ? 'Verifying…' : 'Confirm code'}</button></div></div>}</>}
  </section>;
}

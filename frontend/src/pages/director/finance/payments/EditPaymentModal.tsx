import { useState } from "react";
import PaymentService, { type FinancePayment, type PaymentMethod } from "../../../../services/paymentService";
import { kampalaInputToStorage, storageToKampalaInput } from "../../../../utils/kampalaDateTime";
import PaymentProofCapture from "./PaymentProofCapture";

type Props = {
  payment: FinancePayment;
  onClose: () => void;
  onSaved: (payment: FinancePayment) => void;
};

const methods: PaymentMethod[] = ["CASH", "MOBILE_MONEY", "BANK_DEPOSIT", "BANK_TRANSFER", "CHEQUE", "CARD", "OTHER"];

export default function EditPaymentModal({ payment, onClose, onSaved }: Props) {
  const structure = payment.studentCharge?.financeStructure;
  const currentMethod = methods.includes(payment.method as PaymentMethod) ? payment.method as PaymentMethod : "OTHER";
  const [method, setMethod] = useState<PaymentMethod>(currentMethod);
  const [reference, setReference] = useState(payment.transactionReference ?? "");
  const [description, setDescription] = useState(payment.description ?? "");
  const [date, setDate] = useState(storageToKampalaInput(payment.date));
  const [proof, setProof] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(null);
    try {
      const uploaded = proof ? await PaymentService.uploadProof(proof) : undefined;
      const saved = await PaymentService.update(payment.id, {
        method,
        transactionReference: reference || undefined,
        description: description || undefined,
        date: kampalaInputToStorage(date),
        proofUrl: uploaded?.url ?? payment.proofUrl ?? undefined,
        proofFileName: proof?.name ?? payment.proofFileName ?? undefined,
      });
      onSaved(saved);
      onClose();
    } catch {
      setError("Unable to update this payment. Check your permission and try again.");
    } finally { setSaving(false); }
  };

  const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-amber-950">Edit payment details</h3><p className="mt-1 text-sm text-amber-800">{payment.receiptNumber ?? "Legacy payment"}. Amount and status cannot be edited.</p></div><button type="button" onClick={onClose} className="text-sm font-semibold text-amber-800">Close</button></div>
    <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><p><span className="text-slate-500">Student:</span> {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : payment.studentId}</p><p><span className="text-slate-500">Admission number:</span> {payment.student?.admissionNumber ?? "—"}</p><p><span className="text-slate-500">Fee:</span> {structure?.feeType?.name ?? payment.feeType?.name ?? "—"}</p><p><span className="text-slate-500">Amount:</span> UGX {payment.amount.toLocaleString()}</p><p><span className="text-slate-500">Academic period:</span> {structure?.academicYear?.name ?? "—"} · {structure?.term?.name ?? "—"}</p><p><span className="text-slate-500">Class:</span> {structure?.schoolClass?.name ?? "—"} · {structure?.studentCategory?.name ?? "—"}</p></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">Payment method<select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)} className={fieldClass}>{methods.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label>
      <label className="text-sm font-medium text-slate-700">Date and time <span className="text-xs font-normal text-slate-500">(Uganda time, EAT)</span><input required type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium text-slate-700">Transaction reference<input value={reference} onChange={(event) => setReference(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium text-slate-700">Replace payment proof<PaymentProofCapture file={proof} existingUrl={payment.proofUrl} onChange={setProof}/></label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">Description<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClass}/></label>
    </div>
    {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
    <button disabled={saving} className="mt-4 rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-amber-300">{saving ? "Saving..." : "Save safe changes"}</button>
  </form>;
}

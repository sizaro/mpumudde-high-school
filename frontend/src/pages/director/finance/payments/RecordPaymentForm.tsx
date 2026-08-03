import { useMemo, useState } from "react";
import axios from "axios";
import PaymentService, { type PaymentMethod, type PaymentStudent } from "../../../../services/paymentService";
import StudentAccountService, { type StudentAccountDetails } from "../../../../services/studentAccountService";
import { kampalaInputToStorage, kampalaNowForInput } from "../../../../utils/kampalaDateTime";
import ChargeFeeSelect from "./ChargeFeeSelect";
import StudentSearchSelect from "./StudentSearchSelect";
import PaymentProofCapture from "./PaymentProofCapture";

const methods: PaymentMethod[] = ["CASH", "MOBILE_MONEY", "BANK_DEPOSIT", "BANK_TRANSFER", "CHEQUE", "CARD", "OTHER"];
type Props = { onRecorded: () => void; onCancel?: () => void };

export default function RecordPaymentForm({ onRecorded, onCancel }: Props) {
  const [studentId, setStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<PaymentStudent | null>(null);
  const [account, setAccount] = useState<StudentAccountDetails | null>(null);
  const [feeSelection, setFeeSelection] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(kampalaNowForInput);
  const [description, setDescription] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectStudent = async (student: PaymentStudent | null) => {
    const id = student?.id ?? "";
    setSelectedStudent(student);
    setStudentId(id); setFeeSelection(""); setAccount(null); setMessage(null);
    if (!id) return;
    setLoadingAccount(true);
    try { setAccount(await StudentAccountService.syncCharges(id)); }
    catch { setMessage("Unable to load this student's charges."); }
    finally { setLoadingAccount(false); }
  };

  const selectedCharge = useMemo(() => account?.charges.find((charge) => charge.id === feeSelection), [account, feeSelection]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !feeSelection || !amount) { setMessage("Select a student, the fee being paid, and an amount."); return; }
    setSaving(true); setMessage(null);
    try {
      const proofUrl = proof ? (await PaymentService.uploadProof(proof)).url : undefined;
      await PaymentService.create({
        studentId,
        studentChargeId: selectedCharge?.id,
        amount: Number(amount), method,
        transactionReference: reference || undefined,
        date: kampalaInputToStorage(date),
        description: description || undefined,
        proofUrl, proofFileName: proof?.name,
      });
      setFeeSelection(""); setAmount(""); setReference(""); setDescription(""); setProof(null); setDate(kampalaNowForInput());
      setMessage("Payment recorded and receipt generated."); onRecorded();
      setAccount(await StudentAccountService.get(studentId));
    } catch (error) {
      const backendMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setMessage(Array.isArray(backendMessage) ? backendMessage.join(" ") : backendMessage || "Unable to record payment. Check the fee, Kampala date and time, amount, and your permissions.");
    }
    finally { setSaving(false); }
  };

  const fieldClass = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3";
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">Record payment</h2>
    <p className="mt-1 text-sm text-slate-500">Search for a student, choose the exact fee being paid, and generate an audited receipt.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700 md:col-span-2">Student<StudentSearchSelect value={studentId} selectedStudent={selectedStudent} onChange={(student) => void selectStudent(student)}/></label>
      <div className="text-sm font-medium text-slate-700 md:col-span-2"><p>Fee period and charge</p><ChargeFeeSelect account={account} value={feeSelection} onChange={setFeeSelection} loading={loadingAccount}/></div>
      {selectedCharge && <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800 md:col-span-2"><b>{selectedCharge.financeStructure.feeType.name}</b><span className="mx-2">·</span>{selectedCharge.financeStructure.academicYear.name}<span className="mx-2">·</span>{selectedCharge.financeStructure.term.name}<span className="mx-2">·</span>{selectedCharge.financeStructure.schoolClass.name}<span className="mx-2">·</span>{selectedCharge.financeStructure.studentCategory.name}<br/><span className="mt-1 inline-block">Current balance: <b>UGX {(selectedCharge.expectedAmount - selectedCharge.paidAmount - selectedCharge.waivedAmount).toLocaleString()}</b></span></div>}
      <label className="text-sm font-medium text-slate-700">Amount (UGX)<input required min="1" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium text-slate-700">Payment method<select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)} className={fieldClass}>{methods.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label>
      <label className="text-sm font-medium text-slate-700">Transaction reference<input value={reference} onChange={(event) => setReference(event.target.value)} className={fieldClass} placeholder="Optional mobile-money or bank reference"/></label>
      <label className="text-sm font-medium text-slate-700">Payment date and time <span className="text-xs font-normal text-slate-500">(Uganda time, EAT)</span><input required type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium text-slate-700">Proof of payment<PaymentProofCapture file={proof} onChange={setProof}/></label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={fieldClass}/></label>
    </div>
    {message && <p className={`mt-4 text-sm ${message.includes("recorded") ? "text-emerald-700" : "text-rose-700"}`}>{message}</p>}
    <div className="mt-5 flex justify-end gap-3">{onCancel && <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</button>}<button disabled={saving || loadingAccount} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400">{saving ? "Recording..." : "Record payment"}</button></div>
  </form>;
}

import { useMemo, useState } from "react";
import ExpenseService from "../../../../../services/expenseService";
import PayrollService, { type PayrollTeacher } from "../../../../../services/payrollService";
import PaymentProofCapture from "../../payments/PaymentProofCapture";

type Props = { teachers: PayrollTeacher[]; onCreated: () => void; onCancel: () => void };

export default function PayrollForm({ teachers, onCreated, onCancel }: Props) {
  const [teacherId, setTeacherId] = useState("");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [advances, setAdvances] = useState("0");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const totals = useMemo(() => {
    const basic = Number(basicSalary) || 0;
    const extra = Number(allowances) || 0;
    const less = (Number(deductions) || 0) + (Number(advances) || 0);
    return { gross: basic + extra, net: basic + extra - less };
  }, [advances, allowances, basicSalary, deductions]);

  const chooseTeacher = (id: string) => {
    setTeacherId(id);
    const teacher = teachers.find((item) => item.id === id);
    setBasicSalary(String(teacher?.employment?.salary ?? ""));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (totals.net < 0) { setMessage("Deductions and advances cannot exceed gross pay."); return; }
    setSaving(true); setMessage(null);
    try {
      const uploaded = proof ? await ExpenseService.uploadProof(proof) : undefined;
      await PayrollService.createPayment({
        teacherId, payrollPeriod: period, basicSalary: Number(basicSalary), allowances: Number(allowances),
        deductions: Number(deductions), advances: Number(advances), method,
        referenceNumber: reference || undefined, description: description || undefined,
        proofUrl: uploaded?.url, proofFileName: proof?.name,
      });
      setMessage("Salary payment submitted for approval.");
      setAllowances("0"); setDeductions("0"); setAdvances("0"); setReference(""); setDescription(""); setProof(null);
      onCreated();
    } catch { setMessage("Unable to create salary payment. Check whether this period already exists."); }
    finally { setSaving(false); }
  };

  const fieldClass = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3";
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">Generate teacher payment</h2>
    <p className="mt-1 text-sm text-slate-500">The calculated net pay becomes an audited salary expense pending approval.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <label className="text-sm font-medium">Teacher<select required value={teacherId} onChange={(event) => chooseTeacher(event.target.value)} className={fieldClass}><option value="">Select teacher</option>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName} — {teacher.employment?.employeeNumber}</option>)}</select></label>
      <label className="text-sm font-medium">Payment month<input required type="month" value={period} onChange={(event) => setPeriod(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Basic salary<input required min="0" type="number" value={basicSalary} onChange={(event) => setBasicSalary(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Allowances<input min="0" type="number" value={allowances} onChange={(event) => setAllowances(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Approved deductions<input min="0" type="number" value={deductions} onChange={(event) => setDeductions(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Salary advances<input min="0" type="number" value={advances} onChange={(event) => setAdvances(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Payment method<select value={method} onChange={(event) => setMethod(event.target.value)} className={fieldClass}><option value="BANK_TRANSFER">Bank Transfer</option><option value="MOBILE_MONEY">Mobile Money</option><option value="CASH">Cash</option><option value="CHEQUE">Cheque</option><option value="OTHER">Other</option></select></label>
      <label className="text-sm font-medium">Reference<input value={reference} onChange={(event) => setReference(event.target.value)} className={fieldClass}/></label>
      <label className="text-sm font-medium">Payment proof<PaymentProofCapture file={proof} onChange={setProof} documentLabel="payment proof"/></label>
      <label className="text-sm font-medium md:col-span-2 xl:col-span-3">Description<textarea rows={2} value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClass}/></label>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Gross pay</p><p className="mt-1 text-xl font-semibold">UGX {totals.gross.toLocaleString()}</p></div><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs uppercase text-emerald-700">Net pay</p><p className="mt-1 text-xl font-semibold text-emerald-900">UGX {totals.net.toLocaleString()}</p></div></div>
    {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
    <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-2xl border px-5 py-3 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400">{saving ? "Generating..." : "Generate payment"}</button></div>
  </form>;
}

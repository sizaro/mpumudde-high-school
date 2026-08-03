import type { FinancePayment } from "../../../../services/paymentService";
import PaymentProofViewer from "./PaymentProofViewer";
import ReceiptPreview from "./ReceiptPreview";

type Props = { payment: FinancePayment; onReverse: () => void; canReverse: boolean };
export default function PaymentDetails({ payment, onReverse, canReverse }: Props) {
  const structure = payment.studentCharge?.financeStructure;
  const fee = structure?.feeType?.name ?? payment.feeType?.name ?? "—";
  return <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-semibold text-slate-900">Payment details</h3><p className="text-sm text-slate-500">{payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : payment.studentId}</p></div>{canReverse && payment.status !== "REVERSED" && <button type="button" onClick={onReverse} className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">Reverse payment</button>}</div>
    <ReceiptPreview payment={payment}/>
    <div className="grid gap-3 text-sm sm:grid-cols-2"><p><span className="text-slate-500">Fee type:</span> {fee}</p><p><span className="text-slate-500">Academic year:</span> {structure?.academicYear?.name ?? "Legacy record"}</p><p><span className="text-slate-500">Term:</span> {structure?.term?.name ?? "Legacy record"}</p><p><span className="text-slate-500">Class:</span> {structure?.schoolClass?.name ?? "Legacy record"}</p><p><span className="text-slate-500">Student category:</span> {structure?.studentCategory?.name ?? "Legacy record"}</p><p><span className="text-slate-500">Method:</span> {payment.method.replaceAll("_", " ")}</p><p><span className="text-slate-500">Reference:</span> {payment.transactionReference || "—"}</p><p><span className="text-slate-500">Recorded by:</span> {payment.recordedBy?.email || "Legacy record"}</p><p><span className="text-slate-500">Status:</span> {payment.status}</p></div>
    <PaymentProofViewer url={payment.proofUrl} fileName={payment.proofFileName}/>{payment.reversalReason && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Reversal reason: {payment.reversalReason}</p>}
  </section>;
}

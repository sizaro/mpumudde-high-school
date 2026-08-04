import type { Expense } from "../../../../services/expenseService";
import ExpenseApprovalModal from "./ExpenseApprovalModal";
import PaymentProofViewer from "../payments/PaymentProofViewer";

type Props = { expense: Expense; canApprove: boolean; onDecide: (status: "APPROVED" | "REJECTED" | "PAID" | "CANCELLED", reason?: string) => void };

export default function ExpenseDetails({ expense, onDecide, canApprove }: Props) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-xl font-semibold">{expense.category}</h3>
    <p className="mt-1 text-sm text-slate-500">{expense.payeeName} · UGX {expense.amount.toLocaleString()}</p>
    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p>Method: {expense.method}</p><p>Status: {expense.status}</p><p>Created by: {expense.createdBy?.email ?? "—"}</p><p>Approved by: {expense.approvedBy?.email ?? "—"}</p></div>
    <div className="mt-4"><PaymentProofViewer url={expense.proofUrl} fileName={expense.proofFileName}/></div>
    {canApprove && <ExpenseApprovalModal status={expense.status} onDecide={onDecide}/>} 
  </section>;
}

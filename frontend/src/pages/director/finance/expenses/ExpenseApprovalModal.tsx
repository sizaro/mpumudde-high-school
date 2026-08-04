import { useState } from "react";
type Decision = "APPROVED" | "REJECTED" | "PAID" | "CANCELLED";
export default function ExpenseApprovalModal({ status, onDecide }: { status: string; onDecide: (status: Decision, reason?: string) => void }) {
  const [reason, setReason] = useState("");
  const normalized = status.toUpperCase();
  const actions: Decision[] = normalized === "PENDING_APPROVAL" ? ["APPROVED", "REJECTED", "CANCELLED"] : normalized === "APPROVED" ? ["PAID", "CANCELLED"] : [];
  if (!actions.length) return null;
  const choose = (action: Decision) => { if (["REJECTED", "CANCELLED"].includes(action) && !reason.trim()) return; onDecide(action, reason.trim() || undefined); };
  return <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><h4 className="font-semibold text-slate-900">Expense workflow</h4><p className="mt-1 text-xs text-slate-500">Only valid actions for the current status are shown.</p><textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason required when rejecting or cancelling" className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm"/><div className="mt-3 flex flex-wrap gap-2">{actions.map((action) => <button type="button" key={action} disabled={["REJECTED", "CANCELLED"].includes(action) && !reason.trim()} onClick={() => choose(action)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">{action === "PAID" ? "Mark paid" : action.replaceAll("_", " ")}</button>)}</div></div>;
}

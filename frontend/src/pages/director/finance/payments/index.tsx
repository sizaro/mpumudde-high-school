import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import PaymentService, { type FinancePayment, type PaymentFilters as FilterState, type PaymentOptions } from "../../../../services/paymentService";
import EditPaymentModal from "./EditPaymentModal";
import PaymentDetails from "./PaymentDetails";
import PaymentFilters from "./PaymentFilters";
import PaymentModal from "./PaymentModal";
import PaymentsTable from "./PaymentsTable";
import RecordPaymentForm from "./RecordPaymentForm";
import ReversePaymentModal from "./ReversePaymentModal";

type ModalState = { type: "create" } | { type: "view" | "edit" | "reverse"; payment: FinancePayment } | null;

export default function Payments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasPermission, hasRole } = useAuth();
  const canEdit = hasRole("SUPER_ADMIN") || hasPermission("finance.payments.edit");
  const canCreate = hasRole("SUPER_ADMIN") || hasPermission("finance.payments.create");
  const canReverse = hasRole("SUPER_ADMIN") || hasPermission("finance.payments.reverse");
  const [payments, setPayments] = useState<FinancePayment[]>([]);
  const [options, setOptions] = useState<PaymentOptions | null>(null);
  const [filters, setFilters] = useState<FilterState>({ page: 1, pageSize: 20 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [reversing, setReversing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("action") !== "record" || !canCreate) return;
    setModal({ type: "create" });
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("action");
      return next;
    }, { replace: true });
  }, [canCreate, searchParams, setSearchParams]);

  const load = useCallback(async () => { setLoading(true); setError(null); try { const result = await PaymentService.list(filters); setPayments(result.data); setTotal(result.total); setTotalPages(result.totalPages); } catch { setError("Unable to load payments."); } finally { setLoading(false); } }, [filters]);
  useEffect(() => { void PaymentService.getOptions().then(setOptions).catch(() => setError("Unable to load payment filters.")); }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), filters.search ? 300 : 0); return () => window.clearTimeout(timer); }, [load, filters.search]);

  const reverse = async (reason: string) => { if (!modal || modal.type !== "reverse") return; setReversing(true); try { await PaymentService.reverse(modal.payment.id, reason); setModal(null); await load(); } catch { setError("Unable to reverse this payment. Check your permission and try again."); } finally { setReversing(false); } };
  const removeDraft = async (payment: FinancePayment) => { if (!window.confirm(`Remove draft payment ${payment.receiptNumber ?? ""}? The audit record will be preserved.`)) return; try { await PaymentService.removeDraft(payment.id); await load(); } catch { setError("Only draft or rejected payments can be removed. Completed payments must be reversed."); } };
  const page = filters.page ?? 1;

  return <div className="mt-8 min-w-0 max-w-full space-y-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold text-slate-900">Payments</h2><p className="mt-1 text-sm text-slate-500">Search, record, inspect, and audit student payments.</p></div>{canCreate && <button type="button" onClick={() => setModal({ type: "create" })} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><Plus size={18}/>Record payment</button>}</div>
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    <PaymentFilters value={filters} options={options} onChange={setFilters}/>
    <div className="flex items-center justify-between text-sm text-slate-500"><span>{total.toLocaleString()} payment{total === 1 ? "" : "s"}</span><label>Rows <select value={filters.pageSize ?? 20} onChange={(event) => setFilters((current) => ({ ...current, page: 1, pageSize: Number(event.target.value) }))} className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1"><option>10</option><option>20</option><option>50</option><option>100</option></select></label></div>
    <PaymentsTable payments={payments} loading={loading} canEdit={canEdit} canReverse={canReverse} onView={(payment) => setModal({ type: "view", payment })} onEdit={(payment) => setModal({ type: "edit", payment })} onReverse={(payment) => setModal({ type: "reverse", payment })} onDelete={(payment) => void removeDraft(payment)}/>
    <div className="flex items-center justify-end gap-3"><button type="button" disabled={page <= 1 || loading} onClick={() => setFilters((current) => ({ ...current, page: page - 1 }))} className="rounded-xl border p-2 disabled:opacity-40"><ChevronLeft size={18}/></button><span className="text-sm text-slate-600">Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages || loading} onClick={() => setFilters((current) => ({ ...current, page: page + 1 }))} className="rounded-xl border p-2 disabled:opacity-40"><ChevronRight size={18}/></button></div>
    {modal?.type === "create" && <PaymentModal title="Record student payment" onClose={() => setModal(null)}><RecordPaymentForm onCancel={() => setModal(null)} onRecorded={() => { setModal(null); void load(); }}/></PaymentModal>}
    {modal?.type === "view" && <PaymentModal title="Payment details" onClose={() => setModal(null)} width="max-w-4xl"><PaymentDetails payment={modal.payment} canReverse={canReverse} onReverse={() => setModal({ type: "reverse", payment: modal.payment })}/></PaymentModal>}
    {modal?.type === "edit" && <PaymentModal title="Edit payment" onClose={() => setModal(null)} width="max-w-4xl"><EditPaymentModal payment={modal.payment} onClose={() => setModal(null)} onSaved={() => { setModal(null); void load(); }}/></PaymentModal>}
    {modal?.type === "reverse" && <PaymentModal title="Reverse payment" onClose={() => setModal(null)} width="max-w-xl"><ReversePaymentModal onConfirm={reverse} onCancel={() => setModal(null)} loading={reversing}/></PaymentModal>}
  </div>;
}

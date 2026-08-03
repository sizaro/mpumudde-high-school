import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import ExpenseService, { type Expense, type ExpenseFilters as FilterState, type ExpenseTeacher } from "../../../../services/expenseService";
import PaymentModal from "../payments/PaymentModal";
import ExpenseDetails from "./ExpenseDetails";
import ExpenseFilters from "./ExpenseFilters";
import ExpenseForm from "./ExpenseForm";
import ExpensesTable from "./ExpensesTable";
import TeacherPayroll from "./payroll";

type ExpenseTab = "expenses" | "payroll";
export default function Expenses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasRole, hasPermission } = useAuth(); const isDirector = hasRole("SUPER_ADMIN"); const canCreate = isDirector || hasPermission("finance.expenses.create"); const canApprove = isDirector || hasPermission("finance.approve"); const canViewPayroll = isDirector || hasPermission("finance.payroll.view"); const canManagePayroll = isDirector || hasPermission("finance.payroll.manage");
  const [activeTab, setActiveTab] = useState<ExpenseTab>("expenses"); const [expenses, setExpenses] = useState<Expense[]>([]); const [teachers, setTeachers] = useState<ExpenseTeacher[]>([]); const [filters, setFilters] = useState<FilterState>({ page: 1, pageSize: 20 }); const [total, setTotal] = useState(0); const [totalPages, setTotalPages] = useState(1); const [loading, setLoading] = useState(true); const [modal, setModal] = useState<"create" | "view" | null>(null); const [selected, setSelected] = useState<Expense | null>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (searchParams.get("action") !== "create" || !canCreate) return;
    setActiveTab("expenses");
    setModal("create");
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("action");
      return next;
    }, { replace: true });
  }, [canCreate, searchParams, setSearchParams]);
  const load = useCallback(async () => { setLoading(true); try { const result = await ExpenseService.list(filters); setExpenses(result.data); setTotal(result.total); setTotalPages(result.totalPages); } catch { setError("Unable to load expenses."); } finally { setLoading(false); } }, [filters]);
  useEffect(() => { void ExpenseService.getOptions().then((result) => setTeachers(result.teachers)).catch(() => setError("Unable to load expense options.")); }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), filters.search ? 300 : 0); return () => window.clearTimeout(timer); }, [load, filters.search]);
  const decide = async (status: "APPROVED" | "REJECTED" | "PAID" | "CANCELLED", reason?: string) => { if (!selected) return; try { const saved = await ExpenseService.decide(selected.id, status, reason); setSelected(saved); await load(); } catch { setError("Unable to update expense approval status."); } };
  const page = filters.page ?? 1;
  return <div className="mt-8 min-w-0 space-y-6"><div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"><button type="button" onClick={() => setActiveTab("expenses")} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${activeTab === "expenses" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>School Expenses</button>{canViewPayroll && <button type="button" onClick={() => setActiveTab("payroll")} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${activeTab === "payroll" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Teacher Payroll</button>}</div>{error && <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}{activeTab === "payroll" && canViewPayroll ? <TeacherPayroll canManage={canManagePayroll} canApprove={canApprove}/> : <><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold">School Expenses</h2><p className="mt-1 text-sm text-slate-500">Record, review, approve, and track school spending.</p></div>{canCreate && <button type="button" onClick={() => setModal("create")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><Plus size={18}/>Record expense</button>}</div><ExpenseFilters value={filters} teachers={teachers} onChange={setFilters}/><div className="flex justify-between text-sm text-slate-500"><span>{total.toLocaleString()} expenses</span><select value={filters.pageSize ?? 20} onChange={(event) => setFilters((current) => ({ ...current, page: 1, pageSize: Number(event.target.value) }))} className="rounded-lg border px-2 py-1"><option>10</option><option>20</option><option>50</option></select></div><ExpensesTable expenses={expenses} loading={loading} onView={(expense) => { setSelected(expense); setModal("view"); }}/><div className="flex items-center justify-end gap-3"><button disabled={page <= 1} onClick={() => setFilters((current) => ({ ...current, page: page - 1 }))} className="rounded-xl border p-2 disabled:opacity-40"><ChevronLeft size={18}/></button><span className="text-sm">Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setFilters((current) => ({ ...current, page: page + 1 }))} className="rounded-xl border p-2 disabled:opacity-40"><ChevronRight size={18}/></button></div>{modal === "create" && <PaymentModal title="Record school expense" onClose={() => setModal(null)}><ExpenseForm teachers={teachers} onCancel={() => setModal(null)} onCreated={() => { setModal(null); void load(); }}/></PaymentModal>}{modal === "view" && selected && <PaymentModal title="Expense details" onClose={() => setModal(null)} width="max-w-4xl"><ExpenseDetails expense={selected} onDecide={(status, reason) => void decide(status, reason)} canApprove={canApprove}/></PaymentModal>}</>}</div>;
}

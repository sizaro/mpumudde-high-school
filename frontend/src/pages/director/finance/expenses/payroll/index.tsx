import { useEffect, useState } from "react";
import { Banknote, Settings } from "lucide-react";
import ExpenseService from "../../../../../services/expenseService";
import PayrollService, { type PayrollExpense, type PayrollTeacher } from "../../../../../services/payrollService";
import PaymentModal from "../../payments/PaymentModal";
import PayrollForm from "./PayrollForm";
import PayrollTable from "./PayrollTable";
import SalarySettings from "./SalarySettings";

export default function TeacherPayroll({ canManage, canApprove }: { canManage: boolean; canApprove: boolean }) {
  const [teachers, setTeachers] = useState<PayrollTeacher[]>([]); const [modal, setModal] = useState<"settings" | "payment" | null>(null); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { setTeachers(await PayrollService.listTeachers()); setError(null); } catch { setError("Unable to load teacher payroll records."); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const decide = async (expense: PayrollExpense, status: "APPROVED" | "REJECTED" | "PAID" | "CANCELLED") => { const reason = status === "REJECTED" ? window.prompt("Reason for rejecting this salary payment:") ?? undefined : undefined; if (status === "REJECTED" && !reason) return; try { await ExpenseService.decide(expense.id, status, reason); await load(); } catch { setError("Unable to update this salary payment."); } };
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold">Teacher Payroll</h2><p className="mt-1 text-sm text-slate-500">Manage salary settings, generate monthly payments, and review each teacher’s payment history.</p></div>{canManage && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setModal("settings")} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"><Settings size={17}/>Salary settings</button><button type="button" onClick={() => setModal("payment")} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"><Banknote size={17}/>Generate payment</button></div>}</div>{error && <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}<PayrollTable teachers={teachers} loading={loading} canApprove={canApprove} onDecision={(expense, status) => void decide(expense, status)}/>{modal === "settings" && <PaymentModal title="Teacher salary settings" onClose={() => setModal(null)}><SalarySettings teachers={teachers} onSaved={() => { setModal(null); void load(); }}/></PaymentModal>}{modal === "payment" && <PaymentModal title="Generate teacher salary payment" onClose={() => setModal(null)}><PayrollForm teachers={teachers} onCancel={() => setModal(null)} onCreated={() => { setModal(null); void load(); }}/></PaymentModal>}</div>;
}

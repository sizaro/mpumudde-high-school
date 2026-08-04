import { useState } from "react";
import type { FinanceReportData } from "../../../../services/financeReportService";
import StudentAccountService, { type StudentAccountDetails } from "../../../../services/studentAccountService";
import StudentFinancialSummary from "../student-accounts/StudentFinancialSummary";
import StudentStatement from "../student-accounts/StudentStatement";

export default function StudentStatementReport({ data }: { data: FinanceReportData }) {
  const [studentId, setStudentId] = useState("");
  const [account, setAccount] = useState<StudentAccountDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const open = async () => { if (!studentId) return; setLoading(true); try { setAccount(await StudentAccountService.get(studentId)); } finally { setLoading(false); } };
  return <div className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row"><select value={studentId} onChange={(event) => { setStudentId(event.target.value); setAccount(null); }} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">Select a student</option>{data.accounts.map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName} — {item.admissionNumber}</option>)}</select><button type="button" disabled={!studentId || loading} onClick={() => void open()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Loading..." : "Prepare statement"}</button></div>{account && <div className="space-y-4 rounded-2xl border border-slate-200 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{account.student.firstName} {account.student.lastName}</h3><p className="text-sm text-slate-500">{account.student.admissionNumber}</p></div><StudentStatement account={account}/></div><StudentFinancialSummary account={account}/></div>}</div>;
}

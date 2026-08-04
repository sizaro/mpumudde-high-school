import { useEffect, useMemo, useState } from "react";
import TeacherService, { type MyTeacherFinance } from "../../services/teacherService";

const money = (value?: number | null) => `UGX ${(value ?? 0).toLocaleString()}`;

export default function MyFinance() {
  const [finance, setFinance] = useState<MyTeacherFinance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    TeacherService.getMyFinance()
      .then(setFinance)
      .catch(() => setError("Unable to load your salary records."))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const payments = finance?.payments ?? [];
    return {
      paid: payments.filter((payment) => payment.status === "PAID").reduce((sum, payment) => sum + payment.amount, 0),
      pending: payments.filter((payment) => payment.status === "PENDING_APPROVAL" || payment.status === "APPROVED").reduce((sum, payment) => sum + payment.amount, 0),
    };
  }, [finance]);

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading your finance records...</div>;
  if (error || !finance) return <div className="p-8 text-sm text-rose-600">{error ?? "Finance record not found."}</div>;

  return <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-8">
    <div><h1 className="text-2xl font-bold text-slate-900">My Salary & Payments</h1><p className="mt-1 text-sm text-slate-500">Private salary information for {finance.teacher.firstName} {finance.teacher.lastName}.</p></div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Basic salary</p><p className="mt-2 text-xl font-semibold">{money(finance.teacher.employment?.salary)}</p></div>
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Pay frequency</p><p className="mt-2 text-xl font-semibold">{finance.teacher.employment?.payFrequency ?? "—"}</p></div>
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Total paid</p><p className="mt-2 text-xl font-semibold text-emerald-700">{money(totals.paid)}</p></div>
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Pending/approved</p><p className="mt-2 text-xl font-semibold text-amber-700">{money(totals.pending)}</p></div>
    </div>

    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b px-5 py-4"><h2 className="font-semibold text-slate-900">Payment history</h2></div>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["Period", "Basic", "Allowances", "Deductions", "Advances", "Net pay", "Status", "Proof"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
        <tbody className="divide-y">{finance.payments.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No salary payments have been generated yet.</td></tr> : finance.payments.map((payment) => <tr key={payment.id}><td className="px-4 py-3">{payment.payrollPeriod ?? new Date(payment.expenseDate).toLocaleDateString()}</td><td className="px-4 py-3">{money(payment.basicSalary)}</td><td className="px-4 py-3">{money(payment.allowances)}</td><td className="px-4 py-3">{money(payment.deductions)}</td><td className="px-4 py-3">{money(payment.advances)}</td><td className="px-4 py-3 font-semibold">{money(payment.netPay ?? payment.amount)}</td><td className="px-4 py-3">{payment.status.replaceAll("_", " ")}</td><td className="px-4 py-3">{payment.proofUrl ? <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-700 underline">View proof</a> : "—"}</td></tr>)}</tbody>
      </table></div>
    </section>
  </div>;
}

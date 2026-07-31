import { useMemo } from "react";
import { useParentDashboard } from "./ParentDashboardContext";

export default function ParentFinance() {
  const { data, loading, error, selectedStudentId } = useParentDashboard();

  const student = useMemo(() => {
    if (!data) return null;
    return data.student ?? null;
  }, [data]);

  if (loading) {
    return <p className="text-slate-600">Loading finance details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!data || !student) {
    return <p className="text-slate-600">No student selected.</p>;
  }

  const totalPaid = student.finance.totalPaid;
  const totalPayments = student.finance.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="text-2xl font-semibold">Finance</h1>
        <p className="mt-2 text-sm text-slate-500">Track tuition payments and term fees for your selected child.</p>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total paid</p>
          <p className="mt-3 text-3xl font-semibold">UGX {totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Term fees</p>
          <p className="mt-3 text-3xl font-semibold">UGX {totalPayments.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Current balance</p>
          <p className="mt-3 text-3xl font-semibold">UGX {Math.max(0, totalPayments - totalPaid).toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Payment history</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {student.finance.payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-sm text-slate-500">
                    No payment records available.
                  </td>
                </tr>
              ) : (
                student.finance.payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="py-3">{payment.date ?? "—"}</td>
                    <td className="py-3">UGX {payment.amount.toLocaleString()}</td>
                    <td className="py-3">{payment.method ?? "—"}</td>
                    <td className="py-3">{payment.description ?? "—"}</td>
                    <td className="py-3">{payment.status ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

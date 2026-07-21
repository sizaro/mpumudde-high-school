import { useEffect, useMemo, useState } from "react";
import FinanceService from "../../../services/financeService";
import type { Payment } from "../../types/api.types";

export default function FinanceOverview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await FinanceService.getPayments();
        setPayments(data);
      } catch (err) {
        setError("Unable to load finance data.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const totals = useMemo(() => {
    const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const recordCount = payments.length;
    return { totalReceived, recordCount };
  }, [payments]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees Management</h1>
          <p className="mt-2 text-slate-500">Review fee records, expected payments, and balances.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total fee records</p>
          <p className="mt-4 text-3xl font-semibold">{loading ? "..." : totals.recordCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total payments received</p>
          <p className="mt-4 text-3xl font-semibold">UGX {loading ? "..." : totals.totalReceived.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Outstanding balances</p>
          <p className="mt-4 text-3xl font-semibold">UGX 0</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Student</th>
              <th className="px-6 py-4 text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Loading finance records...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  No finance records available.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : payment.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">UGX {payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

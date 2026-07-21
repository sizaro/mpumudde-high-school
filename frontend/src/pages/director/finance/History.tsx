import { useEffect, useState } from "react";
import FinanceService from "../../../services/financeService";
import type { Payment } from "../../types/api.types";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await FinanceService.getPayments();
        setPayments(data);
      } catch (err) {
        setError("Unable to load payments.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Payment History</h1>
      <p className="mt-2 text-slate-500">View recent student payments and transaction details.</p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Student</th>
              <th className="px-6 py-4 text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Loading payment history...
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
                  No payments found.
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
                  <td className="px-6 py-4 text-sm text-slate-700">{payment.method}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

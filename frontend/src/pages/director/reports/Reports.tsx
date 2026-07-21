import { useEffect, useMemo, useState } from "react";
import FinanceService from "../../../services/financeService";
import StudentService from "../../../services/studentService";
import type { Payment, Student } from "../../../types/api.types";

export default function DirectorReports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentData, paymentData] = await Promise.all([
          StudentService.getStudents(),
          FinanceService.getPayments(),
        ]);
        setStudents(studentData);
        setPayments(paymentData);
      } catch (err) {
        setError("Unable to load report data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalCollected = useMemo(
    () => payments.reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const outstandingPayments = useMemo(
    () =>
      payments
        .filter((payment) => payment.status !== "completed")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const paymentTrend = useMemo(() => {
    const now = new Date();
    const thisMonthTotal = payments
      .filter((payment) => {
        const date = new Date(payment.date);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthTotal = payments
      .filter((payment) => {
        const date = new Date(payment.date);
        return (
          date.getFullYear() === previousMonth.getFullYear() &&
          date.getMonth() === previousMonth.getMonth()
        );
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    if (!lastMonthTotal) {
      return thisMonthTotal ? "No previous month data" : "No trend data";
    }

    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return `${change >= 0 ? "Up" : "Down"} ${Math.abs(change).toFixed(0)}% from last month`;
  }, [payments]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Director Reports</h1>
      <p className="mt-2 text-slate-500">View financial and student registration summaries.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total registered students</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {loading ? "..." : students.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total fees collected</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {loading ? "..." : `UGX ${totalCollected.toLocaleString()}`}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Outstanding payments</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {loading ? "..." : `UGX ${outstandingPayments.toLocaleString()}`}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Payment trend</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {loading ? "..." : paymentTrend}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-8 rounded-3xl bg-rose-50 p-6 text-sm text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}

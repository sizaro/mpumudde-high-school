import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Receipt, Wallet } from "lucide-react";
import FinanceService from "../../../services/financeService";
import StudentService from "../../../services/studentService";
import TermsService from "../../../services/termsService";
import TermsManagement from "./TermsManagement";
import type { Payment, Student } from "../../../types/api.types";

type FinanceTab = "payments" | "history" | "terms";

type PaymentFormState = {
  studentId: string;
  amount: string;
  method: string;
  status: string;
  description: string;
  date: string;
};

type StudentBalance = {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  balances: Array<{
    termId: string;
    termName: string;
    amountOwed: number;
    amountPaid: number;
    balance: number;
  }>;
  totalOwed: number;
  totalPaid: number;
  totalBalance: number;
};

const defaultPaymentForm = (): PaymentFormState => ({
  studentId: "",
  amount: "",
  method: "cash",
  status: "completed",
  description: "",
  date: new Date().toISOString().slice(0, 10),
});

export default function FinanceOverview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [balances, setBalances] = useState<Map<string, StudentBalance>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [activeTab, setActiveTab] = useState<FinanceTab>("payments");
  const [form, setForm] = useState<PaymentFormState>(defaultPaymentForm());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsData, studentsData, studentsBalanceData] = await Promise.all([
          FinanceService.getPayments(),
          StudentService.getStudents(),
          TermsService.getStudentsWithBalances(),
        ]);

        setPayments(paymentsData);
        setStudents(studentsData);
        
        // Create a map for quick balance lookup
        const balanceMap = new Map<string, StudentBalance>();
        studentsBalanceData.forEach((studentBalance: StudentBalance) => {
          balanceMap.set(studentBalance.id, studentBalance);
        });
        setBalances(balanceMap);
      } catch (err) {
        setError("Unable to load finance data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totals = useMemo(() => {
    const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const recordCount = payments.length;
    return { totalReceived, recordCount };
  }, [payments]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return students.slice(0, 8);
    }

    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        student.admissionNumber.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, students]);

  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.studentId || !form.amount || !form.method) {
      setFeedback("Select a student and enter the payment details before saving.");
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const createdPayment = await FinanceService.createPayment({
        studentId: form.studentId,
        amount: Number(form.amount),
        method: form.method,
        status: form.status,
        description: form.description || undefined,
        date: form.date || undefined,
      });

      setPayments((current) => [createdPayment, ...current]);
      
      // Refresh balances after payment is recorded
      const updatedBalances = await TermsService.getStudentsWithBalances();
      const balanceMap = new Map<string, StudentBalance>();
      updatedBalances.forEach((studentBalance: StudentBalance) => {
        balanceMap.set(studentBalance.id, studentBalance);
      });
      setBalances(balanceMap);
      
      setForm(defaultPaymentForm());
      setSelectedStudentId("");
      setSearchTerm("");
      setFeedback("Payment recorded successfully.");
    } catch (err) {
      setFeedback("Unable to record the payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finances</h1>
          <p className="mt-2 text-slate-500">Manage school fees, record payments, and review payment history.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            activeTab === "payments"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Payments
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            activeTab === "history"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Payments History
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("terms")}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            activeTab === "terms"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Terms & Fees
        </button>
      </div>

      {activeTab !== "terms" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Total fee records</p>
              <Receipt size={20} className="text-white/80" />
            </div>
            <p className="mt-3 text-2xl font-bold">{loading ? "…" : totals.recordCount}</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Total payments received</p>
              <Wallet size={20} className="text-white/80" />
            </div>
            <p className="mt-3 text-2xl font-bold">UGX {loading ? "…" : totals.totalReceived.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Outstanding balances</p>
              <AlertCircle size={20} className="text-white/80" />
            </div>
            <p className="mt-3 text-2xl font-bold">UGX 0</p>
          </div>
        </div>
      )}

      {activeTab === "terms" ? (
        <div className="mt-8">
          <TermsManagement />
        </div>
      ) : activeTab === "payments" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Search student</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a student and record a new fee payment.</p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium text-slate-700">
              Student search
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or admission number"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <div className="mt-4 max-h-72 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-slate-500">No student matches found.</p>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setForm((current) => ({ ...current, studentId: student.id }));
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition ${
                      selectedStudentId === student.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>
                      <span className="block font-medium">{student.firstName} {student.lastName}</span>
                      <span className="text-xs opacity-80">{student.admissionNumber}</span>
                    </span>
                    <span className="text-xs">{student.isActive ? "Active" : "Inactive"}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Add fees payment</h2>
            <p className="mt-1 text-sm text-slate-500">Record a payment for the selected student.</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium">Selected student</p>
                <p className="mt-1">{selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "No student selected"}</p>
                <p className="text-xs text-slate-500">{selectedStudent?.admissionNumber ?? "Choose a student from the list"}</p>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Amount (UGX)
                <input
                  type="number"
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="500000"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Payment method
                <select
                  value={form.method}
                  onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="card">Card</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Payment date
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Term fees, exam fees, or other note"
                />
              </label>

              {feedback ? (
                <p className={`text-sm ${feedback.includes("successfully") ? "text-emerald-600" : "text-red-600"}`}>
                  {feedback}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
              >
                {submitting ? "Saving payment..." : "Add payment"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Student</th>
                <th className="px-6 py-4 text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-sm font-semibold">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold">Balance</th>
                <th className="px-6 py-4 text-sm font-semibold">Method</th>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    Loading payment history...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const studentBalance = balances.get(payment.studentId);
                  const balanceAmount = studentBalance?.totalBalance ?? 0;
                  const balanceColor = balanceAmount > 0 ? "text-red-600" : balanceAmount < 0 ? "text-orange-600" : "text-emerald-600";
                  
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : payment.studentId}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">UGX {payment.amount.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${balanceColor}`}>
                        {studentBalance ? (balanceAmount === 0 ? "Cleared" : `UGX ${balanceAmount.toLocaleString()}`) : "No fees assigned"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{payment.method}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            payment.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

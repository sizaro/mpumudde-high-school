import { useState, useEffect } from "react";
import TermsService from "../../../services/termsService";
import { Plus } from "lucide-react";

type Term = {
  id: string;
  name: string;
  feeAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type CreateTermFormState = {
  name: string;
  feeAmount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function TermsManagement() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [assigningTermId, setAssigningTermId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTermFormState>({
    name: "",
    feeAmount: "1000000",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isActive: true,
  });

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const termsData = await TermsService.getAllTerms();
      setTerms(termsData);
    } catch (err) {
      setError("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.feeAmount || !form.startDate || !form.endDate) {
      setFeedback("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      await TermsService.createTerm({
        name: form.name,
        feeAmount: Number(form.feeAmount),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      });

      setFeedback("Term created successfully!");
      setForm({
        name: "",
        feeAmount: "1000000",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        isActive: true,
      });
      setShowForm(false);
      await loadTerms();
    } catch (err) {
      setFeedback("Failed to create term");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignFeesToStudents = async (termId: string) => {
    setAssigningTermId(termId);
    setFeedback(null);
    try {
      const result = await TermsService.assignTermFeeToAllStudents(termId);
      console.log("Assign result:", result);
      setFeedback(`Successfully assigned fees to all students for this term!`);
      // Give it a moment to process
      setTimeout(() => {
        loadTerms();
      }, 500);
    } catch (err) {
      console.error("Assign error:", err);
      setFeedback("Failed to assign fees to students. Please check the console for details.");
    } finally {
      setAssigningTermId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Terms & Fees</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage academic terms with associated fees.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          New Term
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateTerm}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <h3 className="mb-4 font-semibold text-slate-900">Create New Term</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Term Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))}
                placeholder="e.g., Term 1 2024"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Fee Amount (UGX)
              <input
                type="number"
                value={form.feeAmount}
                onChange={(e) => setForm((curr) => ({ ...curr, feeAmount: e.target.value }))}
                placeholder="1000000"
                min="1"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Start Date
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((curr) => ({ ...curr, startDate: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              End Date
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((curr) => ({ ...curr, endDate: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                required
              />
            </label>
          </div>

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((curr) => ({ ...curr, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Active term</span>
          </label>

          {feedback && (
            <p className={`mt-4 text-sm ${feedback.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
              {feedback}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
            >
              {submitting ? "Creating..." : "Create Term"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-500">Loading terms...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">{error}</div>
      ) : terms.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-8 text-center">
          <p className="text-slate-500">No terms created yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <div
              key={term.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{term.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(term.startDate).toLocaleDateString()} -{" "}
                    {new Date(term.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    term.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {term.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mb-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Fee per Student</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  UGX {term.feeAmount.toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAssignFeesToStudents(term.id)}
                disabled={assigningTermId === term.id}
                className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
              >
                {assigningTermId === term.id ? "Assigning..." : "Assign to All Students"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

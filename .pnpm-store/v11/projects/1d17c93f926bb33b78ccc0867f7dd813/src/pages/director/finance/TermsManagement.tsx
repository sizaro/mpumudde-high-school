import { useEffect, useState } from "react";
import TermsService from "../../../services/termsService";

type Term = {
  id: string;
  name: string;
  feeAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function TermsManagement() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningTermId, setAssigningTermId] = useState<string | null>(null);

  useEffect(() => {
    void loadTerms();
  }, []);

  async function loadTerms() {
    try {
      setLoading(true);
      const termsData = await TermsService.getAllTerms();
      setTerms(termsData);
    } catch {
      setError("Failed to load terms");
    } finally {
      setLoading(false);
    }
  }

  const handleAssignFeesToStudents = async (termId: string) => {
    setAssigningTermId(termId);
    try {
      await TermsService.assignTermFeeToAllStudents(termId);
      setTimeout(() => {
        void loadTerms();
      }, 500);
    } catch {
      setError("Failed to assign fees to students");
    } finally {
      setAssigningTermId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Terms & Fees</h2>
        <p className="mt-1 text-sm text-slate-500">
          Create and manage academic terms in Academic Setup. Manage fees and assignments here.
        </p>
      </div>

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

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StudentService from "../../../services/studentService";

export default function StudentProfile() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id") || "";
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      if (!studentId) return;
      try {
        const data = await StudentService.getStudentFinanceSummary(studentId);
        setSummary(data);
      } catch {
        setError("Unable to load student finance summary.");
      }
    };
    void loadSummary();
  }, [studentId]);

  if (!summary) {
    return <div className="text-sm text-slate-600">{error || "Loading student profile..."}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Student Profile</h1>
      <p className="mt-2 text-slate-500">View placement and finance details for this student.</p>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Student</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{summary.student.firstName} {summary.student.lastName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Admission number</p>
            <p className="mt-2 text-slate-900">{summary.student.admissionNumber}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Placement</p>
            <p className="mt-2 text-slate-900">{summary.student.academicYear} • {summary.student.term} • {summary.student.className}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Category</p>
            <p className="mt-2 text-slate-900">{summary.student.studentCategory}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {summary.summary.map((item: any) => (
            <div key={item.financeStructureId} className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">{item.feeType}</p>
              <p className="mt-2 text-slate-900">Expected: {item.expectedAmount.toLocaleString()} UGX</p>
              <p className="text-slate-900">Paid: {item.paidAmount.toLocaleString()} UGX</p>
              <p className="text-slate-900">Balance: {item.balance.toLocaleString()} UGX</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

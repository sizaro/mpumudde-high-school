import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import StudentService from "../../../services/studentService";

interface StudentProfileData {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  passportPhoto?: string;
  academicYear?: string;
  term?: string;
  className?: string;
  studentCategory?: string;
}

interface FinanceSummaryItem {
  feeType: string;
  expectedAmount: number;
  paidAmount: number;
  balance: number;
  financeStructureId: string;
}

interface StudentFinanceSummary {
  student: StudentProfileData;
  summary: FinanceSummaryItem[];
  totalExpected: number;
  totalPaid: number;
  totalBalance: number;
}

export default function StudentProfile() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id") || "";
  const [summary, setSummary] = useState<StudentFinanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const updatePassportPhoto = async (photo?: string) => {
    if (!studentId) return;

    setStatus(null);
    setSaving(true);

    try {
      const updatedStudent = await StudentService.updateStudent(studentId, {
        passportPhoto: photo ?? "",
      });

      setSummary((current) => ({
        ...current,
        student: {
          ...current!.student,
          passportPhoto: updatedStudent.passportPhoto,
        },
      }));

      setStatus(photo ? "Photo updated." : "Photo removed.");
    } catch {
      setStatus("Unable to save the passport photo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const photo = e.target?.result as string;
      void updatePassportPhoto(photo);
    };
    reader.readAsDataURL(file);
  };

  if (!summary) {
    return <div className="text-sm text-slate-600">{error || "Loading student profile..."}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Student Profile</h1>
      <p className="mt-2 text-slate-500">View placement and finance details for this student.</p>

      {status ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-800 ring-1 ring-slate-200">
          {status}
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            {summary.student.passportPhoto ? (
              <img src={summary.student.passportPhoto} alt="Student passport" className="h-44 w-44 rounded-3xl object-cover" />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                No photo available
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                {summary.student.passportPhoto ? "Change photo" : "Add photo"}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {summary.student.passportPhoto ? (
                <button
                  type="button"
                  onClick={() => void updatePassportPhoto("")}
                  disabled={saving}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Remove photo
                </button>
              ) : null}
            </div>
          </div>

          <div>
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
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {summary.summary.map((item) => (
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

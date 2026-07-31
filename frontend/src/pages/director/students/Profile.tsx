import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import StudentService from "../../../services/studentService";
import DirectorService, { type ParentListItem } from "../../../services/directorService";

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

interface StudentParentLink {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  relationship?: string;
  isPrimary?: boolean;
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
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [summary, setSummary] = useState<StudentFinanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState<ParentListItem[]>([]);
  const [studentParents, setStudentParents] = useState<StudentParentLink[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [linkStatus, setLinkStatus] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      if (!studentId) return;
      setLoading(true);

      try {
        const [studentData, financeData, parentList] = await Promise.all([
          StudentService.getStudent(studentId),
          StudentService.getStudentFinanceSummary(studentId),
          DirectorService.getParents(),
        ]);

        setStudent({
          id: studentData.id,
          admissionNumber: studentData.admissionNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          passportPhoto: studentData.passportPhoto,
          academicYear: financeData.student.academicYear,
          term: financeData.student.term,
          className: financeData.student.className,
          studentCategory: financeData.student.studentCategory,
        });

        setSummary(financeData);
        setParents(parentList);
        setStudentParents(
          (studentData as any).parents?.map((link: any) => ({
            id: link.parent.id,
            firstName: link.parent.firstName,
            lastName: link.parent.lastName,
            email: link.parent.email,
            relationship: link.relationship,
            isPrimary: link.isPrimary,
          })) ?? [],
        );
      } catch {
        setError("Unable to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    void loadStudent();
  }, [studentId]);

  const updatePassportPhoto = async (photo?: string) => {
    if (!studentId) return;

    setStatus(null);
    setSaving(true);

    try {
      const updatedStudent = await StudentService.updateStudent(studentId, {
        passportPhoto: photo ?? "",
      });

      setStudent((current) =>
        current ? { ...current, passportPhoto: updatedStudent.passportPhoto } : current,
      );

      setSummary((current) =>
        current
          ? {
              ...current,
              student: {
                ...current.student,
                passportPhoto: updatedStudent.passportPhoto,
              },
            }
          : current,
      );

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
    reader.onload = () => {
      const photo = reader.result;
      if (typeof photo === "string") {
        void updatePassportPhoto(photo);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLinkParent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studentId || !selectedParentId) {
      setLinkStatus("Please select a parent to link.");
      return;
    }

    setLinkStatus(null);
    setLinkLoading(true);

    try {
      const result = await DirectorService.linkParent(studentId, {
        parentId: selectedParentId,
        relationship: relationship || undefined,
        isPrimary,
      });

      setStudentParents((current) => [
        ...current,
        {
          id: result.parent.id,
          firstName: result.parent.firstName,
          lastName: result.parent.lastName,
          email: result.parent.email,
          relationship: result.relationship,
          isPrimary: result.isPrimary,
        },
      ]);
      setLinkStatus("Parent linked successfully.");
      setSelectedParentId("");
      setRelationship("");
      setIsPrimary(false);
    } catch {
      setLinkStatus("Unable to link parent. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-600">{error || "Loading student profile..."}</div>;
  }

  if (!student || !summary) {
    return <div className="text-sm text-slate-600">{error || "Student not found."}</div>;
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
            {student.passportPhoto ? (
              <img src={student.passportPhoto} alt="Student passport" className="h-44 w-44 rounded-3xl object-cover" />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                No photo available
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                {student.passportPhoto ? "Change photo" : "Add photo"}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {student.passportPhoto ? (
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
              <p className="mt-2 text-xl font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Admission number</p>
              <p className="mt-2 text-slate-900">{student.admissionNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Placement</p>
              <p className="mt-2 text-slate-900">{student.academicYear} • {student.term} • {student.className}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Category</p>
              <p className="mt-2 text-slate-900">{student.studentCategory}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold">Linked parents</h2>
        {studentParents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No parents are linked to this student yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {studentParents.map((link) => (
              <div key={link.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{link.firstName} {link.lastName}</p>
                <p className="text-sm text-slate-600">{link.email}</p>
                <p className="text-sm text-slate-600">{link.relationship ?? 'Relationship not set'}{link.isPrimary ? ' • Primary contact' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold">Link a parent</h2>
        <p className="mt-2 text-sm text-slate-500">Select an existing parent account and link it to this student.</p>
        <form onSubmit={handleLinkParent} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Parent account</label>
            <select
              value={selectedParentId}
              onChange={(event) => setSelectedParentId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">Select a parent account</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.firstName} {parent.lastName} — {parent.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Relationship</label>
            <input
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Father, Mother, Guardian, etc."
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(event) => setIsPrimary(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900"
              />
              Mark as primary contact
            </label>
          </div>
          <button
            type="submit"
            disabled={linkLoading}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {linkLoading ? 'Linking parent...' : 'Link parent to student'}
          </button>
          {linkStatus ? <p className="text-sm text-slate-700">{linkStatus}</p> : null}
        </form>
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

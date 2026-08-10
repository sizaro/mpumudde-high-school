import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import StudentService from "../../../services/studentService";
import SetupService from "../../../services/setupService";

const personalFields = ["firstName", "lastName", "dateOfBirth", "gender", "nationality", "address", "previousSchool"];
const medicalFields = ["bloodGroup", "allergies", "medicalConditions", "specialNeeds", "medicalNotes"];
const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());

function Card({ title, children, onEdit }: { title: string; children: ReactNode; onEdit?: () => void }) {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {onEdit && <button type="button" onClick={onEdit} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title={`Edit ${title}`}><Pencil size={17} /></button>}
      </div>
      {children}
    </section>
  );
}

type EditingSection = "personal" | "medical" | "academic" | null;

export default function StudentProfile() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const [student, setStudent] = useState<any>(null);
  const [finance, setFinance] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any>({ academicYears: [], terms: [], academicYearClasses: [], studentCategories: [] });
  const [editing, setEditing] = useState<EditingSection>(null);
  const [draft, setDraft] = useState<any>({});
  const [message, setMessage] = useState("");

  const load = async () => {
    const [record, summary, setup] = await Promise.all([
      StudentService.getStudent(id),
      StudentService.getStudentFinanceSummary(id),
      SetupService.getRegistrationData(),
    ]);
    setStudent(record);
    setFinance(summary);
    setRegistrationData(setup);
    setDraft(record);
  };

  useEffect(() => {
    if (id) void load().catch(() => setMessage("Unable to load student profile."));
  }, [id]);

  const availableTerms = useMemo(
    () => (registrationData.terms || []).filter((term: any) => term.academicYearId === draft.academicYearId),
    [draft.academicYearId, registrationData.terms],
  );
  const availableClasses = useMemo(
    () => (registrationData.academicYearClasses || [])
      .filter((offering: any) => offering.academicYearId === draft.academicYearId && offering.isActive)
      .map((offering: any) => offering.schoolClass),
    [draft.academicYearId, registrationData.academicYearClasses],
  );

  const save = async (section: Exclude<EditingSection, null>) => {
    try {
      const payload = section === "academic"
        ? {
            academicYearId: draft.academicYearId,
            termId: draft.termId,
            classId: draft.classId,
            studentCategoryId: draft.studentCategoryId,
          }
        : Object.fromEntries(
            (section === "personal" ? personalFields : medicalFields).map((field) => [field, draft[field] || undefined]),
          );
      if (section === "academic" && (!draft.academicYearId || !draft.termId || !draft.classId || !draft.studentCategoryId)) {
        setMessage("Select the academic year, term, class, and category.");
        return;
      }
      const updated = await StudentService.updateStudent(id, payload);
      setStudent((current: any) => ({ ...current, ...updated }));
      setEditing(null);
      setMessage(section === "academic" ? "Academic placement updated and the previous placement was preserved in history." : `${section === "personal" ? "Applicant" : "Medical"} information updated.`);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Unable to save this section.");
    }
  };

  if (!student) return <div className="p-8 text-sm text-slate-600">{message || "Loading student profile..."}</div>;
  const fields = editing === "personal" ? personalFields : medicalFields;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-8">
      <div>
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <p className="mt-1 text-slate-500">Each section is read-only until its pencil button is selected.</p>
      </div>
      {message && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Applicant Information" onEdit={() => { setDraft(student); setEditing("personal"); }}>
          <div className="flex gap-4">
            {student.passportPhoto ? <img src={student.passportPhoto} alt="Student" className="h-20 w-20 rounded-full object-cover" /> : <div className="h-20 w-20 rounded-full bg-slate-100" />}
            <div className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
              <p><b>Student number:</b> {student.admissionNumber}</p>
              <p><b>Name:</b> {student.firstName} {student.lastName}</p>
              <p><b>Nationality:</b> {student.nationality || "—"}</p>
              <p><b>Previous school:</b> {student.previousSchool || "—"}</p>
              <p className="sm:col-span-2"><b>Address:</b> {student.address || "—"}</p>
            </div>
          </div>
        </Card>

        <Card title="Current Academic Placement" onEdit={() => { setDraft(student); setEditing("academic"); }}>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p><b>Academic year:</b> {student.academicYear?.name || "—"}</p>
            <p><b>Term:</b> {student.term?.name || "—"}</p>
            <p><b>Class:</b> {student.schoolClass?.name || "—"}</p>
            <p><b>Category:</b> {student.studentCategory?.name || "—"}</p>
          </div>
        </Card>

        <Card title="Medical Information" onEdit={() => { setDraft(student); setEditing("medical"); }}>
          <div className="grid gap-2 text-sm sm:grid-cols-2">{medicalFields.map((field) => <p key={field}><b>{label(field)}:</b> {student[field] || "—"}</p>)}</div>
        </Card>

        <Card title="Guardians & Contacts">
          <div className="space-y-3 text-sm">{student.parents?.length ? student.parents.map((link: any) => <div key={link.id} className="rounded-lg bg-slate-50 p-3"><b>{link.parent?.firstName} {link.parent?.lastName}</b><p>{link.relationship || link.parent?.relationship || "Guardian"} · {link.parent?.phone || "No phone"}</p><p>{link.parent?.occupation || ""}</p></div>) : <p>No guardian information recorded.</p>}</div>
        </Card>

        <div className="lg:col-span-2">
          <Card title="Academic Placement History">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="text-slate-500"><tr><th className="pb-3">Year</th><th className="pb-3">Term</th><th className="pb-3">Class</th><th className="pb-3">Category</th><th className="pb-3">Status</th><th className="pb-3">Period</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{student.enrollments?.length ? student.enrollments.map((enrollment: any) => <tr key={enrollment.id}><td className="py-3">{enrollment.academicYear?.name}</td><td className="py-3">{enrollment.term?.name}</td><td className="py-3">{enrollment.schoolClass?.name}</td><td className="py-3">{enrollment.studentCategory?.name || "—"}</td><td className="py-3">{enrollment.isCurrent ? "Current" : enrollment.status}</td><td className="py-3">{new Date(enrollment.startedAt).toLocaleDateString()} – {enrollment.endedAt ? new Date(enrollment.endedAt).toLocaleDateString() : "Present"}</td></tr>) : <tr><td colSpan={6} className="py-5 text-center text-slate-500">No placement history has been recorded yet.</td></tr>}</tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Fees & Payments"><div className="space-y-2 text-sm">{finance?.summary?.length ? finance.summary.map((item: any) => <div key={item.financeStructureId} className="rounded-lg bg-slate-50 p-3"><b>{item.feeType}</b><p>Expected: {item.expectedAmount.toLocaleString()} UGX · Paid: {item.paidAmount.toLocaleString()} UGX · Balance: {item.balance.toLocaleString()} UGX</p></div>) : <p>No finance structure linked yet.</p>}</div></Card>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-semibold">Edit {editing === "personal" ? "Applicant Information" : editing === "medical" ? "Medical Information" : "Academic Placement"}</h2>
            {editing === "academic" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm">Academic year<select value={draft.academicYearId || ""} onChange={(event) => setDraft((current: any) => ({ ...current, academicYearId: event.target.value, termId: "", classId: "" }))} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="">Select year</option>{(registrationData.academicYears || []).map((year: any) => <option key={year.id} value={year.id}>{year.name}</option>)}</select></label>
                <label className="text-sm">Term<select value={draft.termId || ""} disabled={!draft.academicYearId} onChange={(event) => setDraft((current: any) => ({ ...current, termId: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-slate-100"><option value="">Select term</option>{availableTerms.map((term: any) => <option key={term.id} value={term.id}>{term.name}</option>)}</select></label>
                <label className="text-sm">Class<select value={draft.classId || ""} disabled={!draft.academicYearId} onChange={(event) => setDraft((current: any) => ({ ...current, classId: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-slate-100"><option value="">Select class</option>{availableClasses.map((schoolClass: any) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>)}</select></label>
                <label className="text-sm">Student category<select value={draft.studentCategoryId || ""} onChange={(event) => setDraft((current: any) => ({ ...current, studentCategoryId: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="">Select category</option>{(registrationData.studentCategories || []).map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">{fields.map((field) => <label key={field} className={field === "address" || field === "medicalNotes" ? "sm:col-span-2" : ""}><span className="text-sm">{label(field)}</span><input type={field === "dateOfBirth" ? "date" : "text"} value={draft[field]?.slice?.(0, 10) ?? draft[field] ?? ""} onChange={(event) => setDraft((current: any) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}</div>
            )}
            <div className="mt-5 flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={() => void save(editing)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save section</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SetupService from "../../../services/setupService";
import StudentService from "../../../services/studentService";

const steps = ["Student Information", "Medical Information", "Guardian Information", "Academic Placement", "Review"];

export default function RegistrationWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    admissionNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    previousSchool: "",
    nationality: "",
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
    specialNeeds: "",
    medicalNotes: "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianAddress: "",
    guardianIdInfo: "",
    contacts: [{ name: "", relationship: "", phone: "" }],
    academicYearId: "",
    termId: "",
    classId: "",
    studentCategoryId: "",
  });
  const [registrationData, setRegistrationData] = useState<any>({ academicYears: [], terms: [], classes: [], studentCategories: [] });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await SetupService.getRegistrationData();
      setRegistrationData(data);
    };
    void load();
  }, []);

  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);

  const updateField = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleNext = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const handleBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleCreate = async () => {
    try {
      await StudentService.createStudent({
        admissionNumber: form.admissionNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        isActive: true,
        academicYearId: form.academicYearId || undefined,
        termId: form.termId || undefined,
        classId: form.classId || undefined,
        studentCategoryId: form.studentCategoryId || undefined,
      });
      setStatus("Student registered successfully.");
      navigate("/director/students");
    } catch {
      setStatus("Unable to register the student. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
          <p className="mt-2 text-sm text-slate-500">Use the guided wizard to enroll a student and connect them to the configured finance structure.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Step {progress} • {steps[step]}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <div key={label} className={`rounded-full px-3 py-2 text-sm ${index <= step ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
            {label}
          </div>
        ))}
      </div>

      {status ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}

      {step === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Admission Number<input value={form.admissionNumber} onChange={(event) => updateField("admissionNumber", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Full Name<input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="First name" /></label>
            <label className="text-sm font-medium text-slate-700">Last Name<input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Last name" /></label>
            <label className="text-sm font-medium text-slate-700">Date of Birth<input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Gender<select value={form.gender} onChange={(event) => updateField("gender", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
            <label className="text-sm font-medium text-slate-700">Nationality<input value={form.nationality} onChange={(event) => updateField("nationality", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Address<textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Previous School<input value={form.previousSchool} onChange={(event) => updateField("previousSchool", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Blood Group<input value={form.bloodGroup} onChange={(event) => updateField("bloodGroup", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Allergies<input value={form.allergies} onChange={(event) => updateField("allergies", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Medical Conditions<input value={form.medicalConditions} onChange={(event) => updateField("medicalConditions", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Special Medical Needs<input value={form.specialNeeds} onChange={(event) => updateField("specialNeeds", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Emergency Medical Notes<textarea value={form.medicalNotes} onChange={(event) => updateField("medicalNotes", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Guardian Name<input value={form.guardianName} onChange={(event) => updateField("guardianName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Relationship<input value={form.guardianRelationship} onChange={(event) => updateField("guardianRelationship", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Phone<input value={form.guardianPhone} onChange={(event) => updateField("guardianPhone", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Email<input value={form.guardianEmail} onChange={(event) => updateField("guardianEmail", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Occupation<input value={form.guardianOccupation} onChange={(event) => updateField("guardianOccupation", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Address<input value={form.guardianAddress} onChange={(event) => updateField("guardianAddress", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Identification Information<textarea value={form.guardianIdInfo} onChange={(event) => updateField("guardianIdInfo", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Academic Year<select value={form.academicYearId} onChange={(event) => updateField("academicYearId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select academic year</option>{(registrationData.academicYears || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Term<select value={form.termId} onChange={(event) => updateField("termId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select term</option>{(registrationData.terms || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Class<select value={form.classId} onChange={(event) => updateField("classId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select class</option>{(registrationData.classes || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Student Category<select value={form.studentCategoryId} onChange={(event) => updateField("studentCategoryId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select category</option>{(registrationData.studentCategories || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Review</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div><strong>Name:</strong> {form.firstName} {form.lastName}</div>
            <div><strong>Admission Number:</strong> {form.admissionNumber}</div>
            <div><strong>Academic Year:</strong> {(registrationData.academicYears || []).find((item: any) => item.id === form.academicYearId)?.name || "—"}</div>
            <div><strong>Class:</strong> {(registrationData.classes || []).find((item: any) => item.id === form.classId)?.name || "—"}</div>
            <div><strong>Category:</strong> {(registrationData.studentCategories || []).find((item: any) => item.id === form.studentCategoryId)?.name || "—"}</div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={handleBack} disabled={step === 0} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 disabled:opacity-50">Back</button>
        {step < steps.length - 1 ? <button type="button" onClick={handleNext} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Next</button> : <button type="button" onClick={handleCreate} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white">Confirm Registration</button>}
      </div>
    </div>
  );
}

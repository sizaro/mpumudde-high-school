import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import SetupService from "../../../services/setupService";
import StudentService from "../../../services/studentService";

const steps = ["Student Information", "Medical Information", "Parent Information", "Academic Placement", "Review"];

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
    passportPhoto: "",
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
    specialNeeds: "",
    medicalNotes: "",
    parentName: "",
    parentRelationship: "",
    parentPhone: "",
    parentEmail: "",
    parentOccupation: "",
    parentAddress: "",
    parentIdInfo: "",
    parentPhoto: "",
    guardians: [{ name: "", phone: "" }],
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
      
      // Generate unique admission number
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const admissionNumber = `STU-${timestamp}-${random}`;
      setForm((current) => ({ ...current, admissionNumber }));
    };
    void load();
  }, []);

  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);

  const updateField = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const addGuardian = () => {
    setForm((current) => ({
      ...current,
      guardians: [...current.guardians, { name: "", phone: "" }],
    }));
  };

  const removeGuardian = (index: number) => {
    setForm((current) => ({
      ...current,
      guardians: current.guardians.filter((_, i) => i !== index),
    }));
  };

  const updateGuardian = (index: number, field: string, value: string) => {
    setForm((current) => ({
      ...current,
      guardians: current.guardians.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    }));
  };

  const handleNext = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const handleBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleCreate = async () => {
    try {
      const payload = {
        admissionNumber: form.admissionNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        passportPhoto: form.passportPhoto || undefined,
        isActive: true,
        academicYearId: form.academicYearId || undefined,
        termId: form.termId || undefined,
        classId: form.classId || undefined,
        studentCategoryId: form.studentCategoryId || undefined,
      };
      console.log("Sending student registration payload:", payload);
      await StudentService.createStudent(payload);
      setStatus("Student registered successfully.");
      navigate("/director/students");
    } catch (error) {
      console.error("Registration error:", error);
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
            <label className="text-sm font-medium text-slate-700">Admission Number<input type="text" value={form.admissionNumber} readOnly className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700" /></label>
            <label className="text-sm font-medium text-slate-700">First Name<input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="First name" /></label>
            <label className="text-sm font-medium text-slate-700">Last Name<input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Last name" /></label>
            <label className="text-sm font-medium text-slate-700">Date of Birth<input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Gender<select value={form.gender} onChange={(event) => updateField("gender", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
            <label className="text-sm font-medium text-slate-700">Nationality<input value={form.nationality} onChange={(event) => updateField("nationality", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Address<textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Previous School<input value={form.previousSchool} onChange={(event) => updateField("previousSchool", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-700">Passport Photo</p>
              <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {form.passportPhoto ? (
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <img src={form.passportPhoto} alt="Passport preview" className="h-28 w-28 rounded-3xl object-cover" />
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                        Change photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const photo = reader.result;
                                if (typeof photo === "string") {
                                  updateField("passportPhoto", photo);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField("passportPhoto", "")}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="inline-flex cursor-pointer items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Add photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const photo = reader.result;
                            if (typeof photo === "string") {
                              updateField("passportPhoto", photo);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Blood Group<select value={form.bloodGroup} onChange={(event) => updateField("bloodGroup", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select blood group</option><option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option></select></label>
            <label className="text-sm font-medium text-slate-700">Allergies<input value={form.allergies} onChange={(event) => updateField("allergies", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Medical Conditions<input value={form.medicalConditions} onChange={(event) => updateField("medicalConditions", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Special Medical Needs<input value={form.specialNeeds} onChange={(event) => updateField("specialNeeds", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Emergency Medical Notes<textarea value={form.medicalNotes} onChange={(event) => updateField("medicalNotes", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold text-slate-900">Parent/Guardian Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Parent Name<input value={form.parentName} onChange={(event) => updateField("parentName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700">Relationship<select value={form.parentRelationship} onChange={(event) => updateField("parentRelationship", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select relationship</option><option value="Father">Father</option><option value="Mother">Mother</option><option value="Guardian">Guardian</option><option value="Uncle">Uncle</option><option value="Aunt">Aunt</option><option value="Grandfather">Grandfather</option><option value="Grandmother">Grandmother</option><option value="Other">Other</option></select></label>
              <label className="text-sm font-medium text-slate-700">Phone<input value={form.parentPhone} onChange={(event) => updateField("parentPhone", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700">Email<input value={form.parentEmail} onChange={(event) => updateField("parentEmail", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700">Occupation<input value={form.parentOccupation} onChange={(event) => updateField("parentOccupation", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700">Address<input value={form.parentAddress} onChange={(event) => updateField("parentAddress", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Identification Information<textarea value={form.parentIdInfo} onChange={(event) => updateField("parentIdInfo", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Parent Photo<input type="file" accept="image/*" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    updateField("parentPhoto", e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Additional Guardians</h3>
              <button type="button" onClick={addGuardian} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-medium text-white">
                <Plus size={16} /> Add Guardian
              </button>
            </div>

            <div className="space-y-3">
              {form.guardians.map((guardian, index) => (
                <div key={index} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={guardian.name}
                      onChange={(event) => updateGuardian(index, "name", event.target.value)}
                      placeholder="Guardian name"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                    />
                    <input
                      type="tel"
                      value={guardian.phone}
                      onChange={(event) => updateGuardian(index, "phone", event.target.value)}
                      placeholder="Guardian phone"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                    />
                  </div>
                  {form.guardians.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGuardian(index)}
                      className="flex items-center justify-center rounded-2xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Academic Year<select value={form.academicYearId} onChange={(event) => updateField("academicYearId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select academic year</option>{(registrationData.academicYears || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Term<select value={form.termId} onChange={(event) => updateField("termId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select term</option>{(registrationData.terms || []).filter((t: any) => (t.name === "Term 1" || t.name === "Term 2" || t.name === "Term 3") && t.academicYearId === form.academicYearId).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Class<select value={form.classId} onChange={(event) => updateField("classId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select class</option>{(registrationData.classes || []).filter((c: any) => ["Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5", "Senior 6"].includes(c.name)).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
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
            <div><strong>Term:</strong> {(registrationData.terms || []).find((item: any) => item.id === form.termId)?.name || "—"}</div>
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

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import SetupService from "../../../services/setupService";
import StudentService from "../../../services/studentService";

const steps = ["Student Information", "Medical Information", "Parent Information", "Academic Placement", "Fees & Receipt", "Review"];
const DRAFT_KEY = "mhs.student-registration-draft.v1";
const NATIONALITIES = ["Ugandan", "Kenyan", "Tanzanian", "Rwandan", "South Sudanese", "Congolese", "Burundian", "Other"];
const OCCUPATIONS = ["Self-employed", "Teacher", "Civil servant", "Business owner", "Farmer", "Healthcare worker", "Driver", "Engineer", "Lawyer", "Accountant", "Security personnel", "Unemployed", "Other"];

function PhotoCapture({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null); const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null); const [review, setReview] = useState<string | null>(null);
  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  useEffect(() => { if (stream && videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); } }, [stream]);
  const stop = () => { stream?.getTracks().forEach((track) => track.stop()); setStream(null); };
  const camera = async () => { try { setStream(await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "user" } }, audio: false })); } catch { alert("Allow camera permission, then try again."); } };
  const capture = () => { const video = videoRef.current; if (!video?.videoWidth) return; const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); setReview(canvas.toDataURL("image/jpeg", .9)); stop(); };
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><div className="flex gap-4"><div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200">{value ? <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">{label}</div>}</div><div><p className="font-medium text-slate-800">{label}</p><p className="mb-2 text-sm text-slate-500">Choose an image or use the device camera, then review it.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-700">Choose image</button><button type="button" onClick={() => void camera()} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Open camera</button>{value && <button type="button" onClick={() => onChange("")} className="px-3 py-2 text-sm text-red-600">Remove</button>}</div></div></div><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => onChange(String(reader.result)); reader.readAsDataURL(file); } }} />{(stream || review) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"><div className="w-full max-w-xl rounded-xl bg-white p-4"><h2 className="mb-3 font-semibold">{review ? `Review ${label.toLowerCase()}` : `Take ${label.toLowerCase()}`}</h2>{review ? <img src={review} alt="Captured preview" className="max-h-[58vh] w-full rounded-lg object-contain" /> : <video ref={videoRef} muted autoPlay playsInline className="max-h-[58vh] w-full rounded-lg bg-black" />}<div className="mt-4 grid gap-2 sm:grid-cols-2">{review ? <><button onClick={() => { onChange(review); setReview(null); }} className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Use this photo</button><button onClick={() => { setReview(null); void camera(); }} className="rounded-lg border px-4 py-3 text-sm">Retake</button></> : <><button onClick={stop} className="rounded-lg border px-4 py-3 text-sm">Close</button><button onClick={capture} className="rounded-lg bg-blue-600 px-4 py-3 text-sm text-white">Capture photo</button></>}</div></div></div>}</div>;
}

function ReceiptCapture({ name, onChange }: { name: string; onChange: (dataUrl: string, fileName: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null); const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null); const [review, setReview] = useState<string | null>(null);
  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  useEffect(() => { if (stream && videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); } }, [stream]);
  const stop = () => { stream?.getTracks().forEach((track) => track.stop()); setStream(null); };
  const openCamera = async () => { try { setStream(await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })); } catch { alert("Allow camera permission, then try again."); } };
  const capture = () => { const video = videoRef.current; if (!video?.videoWidth) return; const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); setReview(canvas.toDataURL("image/jpeg", .9)); stop(); };
  return <div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-700">Choose receipt file</button><button type="button" onClick={() => void openCamera()} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Take receipt photo</button></div><input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => onChange(String(reader.result), file.name); reader.readAsDataURL(file); } }} />{name && <p className="mt-1 text-xs text-emerald-700">Selected: {name}</p>}{(stream || review) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"><div className="w-full max-w-xl rounded-xl bg-white p-4"><h2 className="mb-3 font-semibold">{review ? "Review receipt photo" : "Take receipt photo"}</h2>{review ? <img src={review} alt="Receipt review" className="max-h-[58vh] w-full rounded-lg object-contain" /> : <video ref={videoRef} muted autoPlay playsInline className="max-h-[58vh] w-full rounded-lg bg-black" />}<div className="mt-4 grid gap-2 sm:grid-cols-2">{review ? <><button onClick={() => { onChange(review, `receipt-${Date.now()}.jpg`); setReview(null); }} className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Use this receipt photo</button><button onClick={() => { setReview(null); void openCamera(); }} className="rounded-lg border px-4 py-3 text-sm">Retake</button></> : <><button onClick={stop} className="rounded-lg border px-4 py-3 text-sm">Close</button><button onClick={capture} className="rounded-lg bg-blue-600 px-4 py-3 text-sm text-white">Capture photo</button></>}</div></div></div>}</div>;
}

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
    parentDocumentType: "",
    parentDocumentDataUrl: "",
    parentDocumentName: "",
    guardians: [{ name: "", phone: "" }],
    academicYearId: "",
    termId: "",
    classId: "",
    studentCategoryId: "",
  });
  const [registrationData, setRegistrationData] = useState<any>({ academicYears: [], terms: [], classes: [], studentCategories: [] });
  const [status, setStatus] = useState<string | null>(null);
  const [payments, setPayments] = useState([{ feeTypeId: "", amount: "", method: "cash", receiptDataUrl: "", receiptName: "" }]);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await SetupService.getRegistrationData();
      setRegistrationData(data);
      
      // Generate unique admission number
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          // Supports both older form-only drafts and the current full registration draft.
          setForm((current) => ({ ...current, ...(draft.form ?? draft) }));
          if (Array.isArray(draft.payments) && draft.payments.length) setPayments(draft.payments);
          if (typeof draft.step === "number") setStep(Math.max(0, Math.min(draft.step, steps.length - 1)));
        } catch { localStorage.removeItem(DRAFT_KEY); }
      }
      setDraftReady(true);
    };
    void load();
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, payments, step }));
  }, [draftReady, form, payments, step]);

  useEffect(() => {
    const registrationFee = (registrationData.feeTypes || []).find((fee: any) => fee.name?.toLowerCase() === "registration");
    if (!registrationFee) return;
    setPayments((current) => current.map((payment, index) => index === 0 && !payment.feeTypeId ? { ...payment, feeTypeId: registrationFee.id } : payment));
  }, [registrationData.feeTypes]);

  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);
  const selectedAcademicYear = (registrationData.academicYears || []).find((year: any) => year.id === form.academicYearId);
  const termsForSelectedYear = (registrationData.terms || []).filter((term: any) => term.academicYearId === form.academicYearId || term.academicYear?.id === form.academicYearId || term.academicYear?.name === selectedAcademicYear?.name);
  // Older setup records can have a legacy academic-year link; still show them instead of an empty dropdown.
  const availableTerms = termsForSelectedYear.length ? termsForSelectedYear : (registrationData.terms || []);

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
      let studentPhoto: string | undefined;
      let parentPhoto: string | undefined;
      let parentDocumentUrl: string | undefined;
      if (form.passportPhoto) {
        const blob = await (await fetch(form.passportPhoto)).blob();
        const upload = new FormData();
        upload.append("file", new File([blob], "student-profile.jpg", { type: "image/jpeg" }));
        studentPhoto = (await StudentService.uploadPhoto(upload)).url;
      }
      if (form.parentPhoto) {
        const blob = await (await fetch(form.parentPhoto)).blob(); const upload = new FormData();
        upload.append("file", new File([blob], "guardian-profile.jpg", { type: "image/jpeg" }));
        parentPhoto = (await StudentService.uploadPhoto(upload)).url;
      }
      if (form.parentDocumentDataUrl) {
        const blob = await (await fetch(form.parentDocumentDataUrl)).blob(); const upload = new FormData();
        upload.append("file", new File([blob], form.parentDocumentName, { type: blob.type || "application/pdf" }));
        parentDocumentUrl = (await StudentService.uploadPhoto(upload)).url;
      }
      const paymentPayload = [];
      for (const payment of payments) {
        if (!payment.feeTypeId || !payment.amount) continue;
        let receiptUrl: string | undefined;
        if (payment.receiptDataUrl) { const blob = await (await fetch(payment.receiptDataUrl)).blob(); const upload = new FormData(); upload.append("file", new File([blob], payment.receiptName || "payment-receipt.jpg", { type: blob.type || "image/jpeg" })); receiptUrl = (await StudentService.uploadPhoto(upload)).url; }
        paymentPayload.push({ feeTypeId: payment.feeTypeId, feeTypeName: (registrationData.feeTypes || []).find((fee: any) => fee.id === payment.feeTypeId)?.name, academicYearId: form.academicYearId, termId: form.termId, amount: Number(payment.amount), method: payment.method, receiptUrl });
      }
      if (!paymentPayload.length) { setStatus("Add the required registration payment before confirming registration."); return; }
      const student = {
        admissionNumber: form.admissionNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        passportPhoto: studentPhoto,
        isActive: true,
        academicYearId: form.academicYearId || undefined,
        termId: form.termId || undefined,
        classId: form.classId || undefined,
        studentCategoryId: form.studentCategoryId || undefined,
        nationality: form.nationality || undefined, address: form.address || undefined, previousSchool: form.previousSchool || undefined,
        bloodGroup: form.bloodGroup || undefined, allergies: form.allergies || undefined, medicalConditions: form.medicalConditions || undefined, specialNeeds: form.specialNeeds || undefined, medicalNotes: form.medicalNotes || undefined,
      };
      await StudentService.createCompleteRegistration({ student, primaryGuardian: form.parentName ? { fullName: form.parentName, relationship: form.parentRelationship, phone: form.parentPhone, email: form.parentEmail, occupation: form.parentOccupation, address: form.parentAddress, profilePhoto: parentPhoto, identityDocumentType: form.parentDocumentType || undefined, identityDocumentUrl: parentDocumentUrl } : undefined, additionalGuardians: form.guardians, payments: paymentPayload });
      localStorage.removeItem(DRAFT_KEY);
      setStatus("Student registered successfully.");
      navigate("/director/students");
    } catch (error) {
      const response = error as { response?: { data?: { message?: string | string[] } } };
      const message = response.response?.data?.message;
      setStatus(Array.isArray(message) ? message.join(", ") : message ?? "Unable to register the student. Please try again.");
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
        <button type="button" onClick={() => { if (window.confirm("Cancel student registration? The saved draft will be deleted.")) { localStorage.removeItem(DRAFT_KEY); navigate("/director"); } }} className="rounded-2xl border border-red-200 px-4 py-3 text-sm text-red-700">Cancel registration</button>
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
            <label className="text-sm font-medium text-slate-700">Student Number<input type="text" value="Generated automatically when registration is confirmed" readOnly className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700" /></label>
            <label className="text-sm font-medium text-slate-700">First Name<input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="First name" /></label>
            <label className="text-sm font-medium text-slate-700">Last Name<input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Last name" /></label>
            <label className="text-sm font-medium text-slate-700">Date of Birth<input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Gender<select value={form.gender} onChange={(event) => updateField("gender", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
            <label className="text-sm font-medium text-slate-700">Nationality<select value={NATIONALITIES.includes(form.nationality) ? form.nationality : form.nationality ? "Other" : ""} onChange={(event) => updateField("nationality", event.target.value === "Other" ? "Other" : event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select nationality</option>{NATIONALITIES.map((item) => <option key={item}>{item}</option>)}</select>{form.nationality === "Other" && <input onChange={(event) => updateField("nationality", event.target.value)} placeholder="Type country" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />}</label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">Address<textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Previous School<input value={form.previousSchool} onChange={(event) => updateField("previousSchool", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <div className="order-first md:col-span-2">
              <div className="mt-2">
              <PhotoCapture label="Student photo" value={form.passportPhoto} onChange={(value) => updateField("passportPhoto", value)} />
              {/*
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
              */}</div>
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
              <label className="text-sm font-medium text-slate-700">Occupation<select value={OCCUPATIONS.includes(form.parentOccupation) ? form.parentOccupation : form.parentOccupation ? "Other" : ""} onChange={(event) => updateField("parentOccupation", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select occupation</option>{OCCUPATIONS.map((item) => <option key={item}>{item}</option>)}</select>{form.parentOccupation === "Other" && <input onChange={(event) => updateField("parentOccupation", event.target.value)} placeholder="Type occupation" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />}</label>
              <label className="text-sm font-medium text-slate-700">Address<input value={form.parentAddress} onChange={(event) => updateField("parentAddress", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Identification Information<textarea value={form.parentIdInfo} onChange={(event) => updateField("parentIdInfo", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
              <div className="order-first md:col-span-2"><PhotoCapture label="Primary guardian photo" value={form.parentPhoto} onChange={(value) => updateField("parentPhoto", value)} /></div>
              <label className="text-sm font-medium text-slate-700">Guardian document<select value={form.parentDocumentType} onChange={(event) => updateField("parentDocumentType", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select document type</option><option>National ID</option><option>LC1 Introduction Letter</option><option>Passport</option><option>Other</option></select></label>
              <label className="text-sm font-medium text-slate-700">Upload document<input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, parentDocumentDataUrl: String(reader.result), parentDocumentName: file.name })); reader.readAsDataURL(file); } }} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />{form.parentDocumentName && <span className="mt-1 block text-xs text-emerald-700">Selected: {form.parentDocumentName}</span>}</label>
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
            <label className="text-sm font-medium text-slate-700">Academic Year<select value={form.academicYearId} onChange={(event) => setForm((current) => ({ ...current, academicYearId: event.target.value, termId: "" }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select academic year</option>{(registrationData.academicYears || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Term<select value={form.termId} disabled={!form.academicYearId} onChange={(event) => updateField("termId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 disabled:bg-slate-100"><option value="">{form.academicYearId ? (availableTerms.length ? "Select term" : "No terms configured") : "Select academic year first"}</option>{availableTerms.map((item: any) => <option key={item.id} value={item.id}>{item.name}{item.academicYear?.name && item.academicYear?.name !== selectedAcademicYear?.name ? ` (${item.academicYear.name})` : ""}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Class<select value={form.classId} onChange={(event) => updateField("classId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select class</option>{(registrationData.classes || []).filter((c: any) => ["Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5", "Senior 6"].includes(c.name)).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Student Category<select value={form.studentCategoryId} onChange={(event) => updateField("studentCategoryId", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">Select category</option>{(registrationData.studentCategories || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          </div>
        </div>
      ) : null}

      {step === 4 ? <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">Registration fees and receipts</h2><p className="mt-2 text-sm text-slate-500">Registration payment is required. Add other fee types such as Tuition, Reams, or Development if they are being paid now.</p><div className="mt-4 space-y-4">{payments.map((payment, index) => <div key={index} className="grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-2"><label className="text-sm font-medium">Fee type<select value={payment.feeTypeId} onChange={(event) => setPayments((current) => current.map((item, i) => i === index ? { ...item, feeTypeId: event.target.value } : item))} className="mt-1 w-full rounded-xl border px-3 py-2"><option value="">Select fee type</option>{(registrationData.feeTypes || []).map((fee: any) => <option key={fee.id} value={fee.id}>{fee.name}</option>)}</select></label><label className="text-sm font-medium">Amount (UGX)<input type="number" min="1" value={payment.amount} onChange={(event) => setPayments((current) => current.map((item, i) => i === index ? { ...item, amount: event.target.value } : item))} className="mt-1 w-full rounded-xl border px-3 py-2" /></label><label className="text-sm font-medium">Payment method<select value={payment.method} onChange={(event) => setPayments((current) => current.map((item, i) => i === index ? { ...item, method: event.target.value } : item))} className="mt-1 w-full rounded-xl border px-3 py-2"><option value="cash">Cash</option><option value="mobile_money">Mobile Money</option><option value="bank">Bank</option></select></label><div className="text-sm font-medium">Receipt evidence<ReceiptCapture name={payment.receiptName} onChange={(receiptDataUrl, receiptName) => setPayments((current) => current.map((item, i) => i === index ? { ...item, receiptDataUrl, receiptName } : item))} /></div>{index > 0 && <button type="button" onClick={() => setPayments((current) => current.filter((_, i) => i !== index))} className="text-sm text-red-600">Remove payment</button>}</div>)}</div><button type="button" onClick={() => setPayments((current) => [...current, { feeTypeId: "", amount: "", method: "cash", receiptDataUrl: "", receiptName: "" }])} className="mt-4 rounded-xl border border-blue-600 px-4 py-2 text-sm text-blue-700">Add another payment</button></div> : null}

      {step === 5 ? (
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

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import TeacherService, { type EmergencyContact, type EmploymentInfo, type MedicalInfo, type TeacherDocument, type TeacherPersonal } from "../../../services/teacherService";

const DRAFT_KEY = "mhs.teacher-registration-draft.v1";
const STEPS = ["Personal", "Subjects", "Contacts", "Medical", "Documents", "Employment", "Review"];
const EMPTY_PERSONAL: TeacherPersonal = { firstName: "", middleName: "", lastName: "", gender: "", dateOfBirth: "", phone: "", email: "", nationality: "", address: "" };
const EMPTY_CONTACT: EmergencyContact = { fullName: "", relationship: "", phone: "", alternativePhone: "", address: "", isNextOfKin: false };
const EMPTY_MEDICAL: MedicalInfo = { bloodGroup: "", allergies: "", medicalConditions: "", medication: "", disability: "", notes: "" };
type Subject = { id: string; name: string; code?: string };
type Category = { id: string; name: string };
type PendingDocument = { categoryId: string; title: string; fileName: string; mimeType: string; dataUrl: string };
type StoredDraft = { personal?: TeacherPersonal; subjectIds?: string[]; contacts?: EmergencyContact[]; medical?: MedicalInfo; employment?: Partial<EmploymentInfo>; documents?: PendingDocument[]; profilePhoto?: string };

function loadDraft(): StoredDraft {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}"); } catch { return {}; }
}
function messageFor(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
  return Array.isArray(data) ? data.join(", ") : data ?? fallback;
}
function fileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
}

export default function CreateTeacherWizard() {
  const navigate = useNavigate();
  const initial = useRef(loadDraft()).current;
  const photoFileRef = useRef<HTMLInputElement>(null);
  const documentFileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<TeacherPersonal>(initial.personal ?? EMPTY_PERSONAL);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectIds, setSubjectIds] = useState<string[]>(initial.subjectIds ?? []);
  const [contacts, setContacts] = useState<EmergencyContact[]>(initial.contacts ?? []);
  const [contact, setContact] = useState<EmergencyContact>(EMPTY_CONTACT);
  const [medical, setMedical] = useState<MedicalInfo>(initial.medical ?? EMPTY_MEDICAL);
  const [employment, setEmployment] = useState<Partial<EmploymentInfo>>(initial.employment ?? { position: "", department: "", employmentType: "", salary: undefined, payFrequency: "MONTHLY", status: "active" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documents, setDocuments] = useState<PendingDocument[]>(initial.documents ?? []);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(initial.profilePhoto ?? null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [login, setLogin] = useState<{ id: string; email: string; password: string } | null>(null);

  useEffect(() => {
    void Promise.all([api.get<Subject[]>("/subjects"), api.get<Category[]>("/document-categories?entityType=TEACHER")])
      .then(([subjectResponse, categoryResponse]) => { setSubjects(subjectResponse.data); setCategories(categoryResponse.data); })
      .catch((reason) => setError(messageFor(reason, "Could not load subjects and document categories.")));
  }, []);

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ personal, subjectIds, contacts, medical, employment, documents, profilePhoto: photoDataUrl })); }
    catch { setError("The selected files are too large to keep as a browser draft. Use smaller files, or finish registration before refreshing."); }
  }, [personal, subjectIds, contacts, medical, employment, documents, photoDataUrl]);

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (!cameraOpen || !cameraStream || !videoRef.current) return;
    videoRef.current.srcObject = cameraStream;
    void videoRef.current.play().catch(() => setError("The camera preview could not start. Please allow camera permission and try again."));
  }, [cameraOpen, cameraStream]);

  function stopCamera() {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  }
  async function openCamera(nextFacingMode = facingMode) {
    setError(""); stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: nextFacingMode } }, audio: false });
      setFacingMode(nextFacingMode); setCapturedPhoto(null); setCameraStream(stream); setCameraOpen(true);
    } catch {
      setError("Camera access was not available. Allow camera permission in the browser, then try again.");
    }
  }
  function closeCamera() { stopCamera(); setCapturedPhoto(null); setCameraOpen(false); }
  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return setError("The camera is still starting. Please try again in a moment.");
    const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.9)); stopCamera();
  }
  async function choosePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    setError(""); setPhotoDataUrl(await fileAsDataUrl(file));
  }
  function addContact() {
    if (!contact.fullName || !contact.relationship || !contact.phone) return setError("Contact name, relationship, and phone are required.");
    setContacts((current) => [...current, { ...contact, isNextOfKin: current.length === 0 }]); setContact(EMPTY_CONTACT); setError("");
  }
  async function addDocument() {
    const file = documentFileRef.current?.files?.[0];
    if (!file || !categoryId) return setError("Choose a document category and file.");
    const dataUrl = await fileAsDataUrl(file);
    setDocuments((current) => [...current, { categoryId, title: documentTitle || file.name, fileName: file.name, mimeType: file.type, dataUrl }]);
    setCategoryId(""); setDocumentTitle(""); if (documentFileRef.current) documentFileRef.current.value = ""; setError("");
  }
  function continueFromPersonal() {
    if (!personal.firstName || !personal.lastName) return setError("First name and last name are required.");
    setError(""); setStep(1);
  }
  async function submitRegistration() {
    setSaving(true); setError("");
    const uploadedPublicIds: string[] = [];
    try {
      let profilePhoto: string | undefined;
      if (photoDataUrl) {
        const blob = await (await fetch(photoDataUrl)).blob();
        const form = new FormData(); form.append("file", new File([blob], "teacher-profile.jpg", { type: "image/jpeg" }));
        const uploaded = (await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
        uploadedPublicIds.push(uploaded.publicId); profilePhoto = uploaded.url;
      }
      const uploadedDocuments: TeacherDocument[] = [];
      for (const document of documents) {
        const blob = await (await fetch(document.dataUrl)).blob();
        const form = new FormData(); form.append("file", new File([blob], document.fileName, { type: document.mimeType }));
        const uploaded = (await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedDocuments.push({ documentCategoryId: document.categoryId, originalFileName: document.fileName, fileUrl: uploaded.url, title: document.title, fileExtension: uploaded.fileExtension, mimeType: uploaded.mimeType, fileSize: uploaded.fileSize });
      }
      const result = await TeacherService.createComplete({ personal: { ...personal, profilePhoto }, subjectIds, contacts, employment, medical, documents: uploadedDocuments });
      localStorage.removeItem(DRAFT_KEY);
      setLogin({ id: result.teacher.id, email: result.teacher.user.email, password: result.temporaryPassword });
    } catch (reason) {
      await Promise.all(uploadedPublicIds.map((publicId) => api.post("/upload/delete", { publicId }).catch(() => undefined)));
      setError(messageFor(reason, "Could not complete registration. Your draft has been kept so you can try again."));
    }
    finally { setSaving(false); }
  }

  if (login) return <div className="mx-auto max-w-3xl p-8"><section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h1 className="text-xl font-bold text-emerald-900">Teacher registration complete</h1><p className="mt-2 text-emerald-800">The teacher record was created successfully. Give the teacher these details once.</p><dl className="my-5 space-y-2 rounded-lg bg-white p-4 text-sm"><div><dt className="text-slate-500">School login</dt><dd className="font-semibold">{login.email}</dd></div><div><dt className="text-slate-500">Temporary password</dt><dd className="font-mono font-semibold">{login.password}</dd></div></dl><button onClick={() => navigate(`/director/teachers/${login.id}`)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">View teacher profile</button></section></div>;

  return <div className="mx-auto max-w-3xl p-8"><div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">Register Teacher</h1><p className="mt-1 text-sm text-slate-500">This is a saved draft. Nothing is created in the school database until the final review is confirmed.</p></div><button type="button" onClick={() => { if (window.confirm("Cancel this registration? The saved draft and selected documents will be deleted.")) { localStorage.removeItem(DRAFT_KEY); navigate("/director"); } }} className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50">Cancel registration</button></div>
    <ol className="my-8 flex flex-wrap gap-2">{STEPS.map((label, index) => <li key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${index === step ? "bg-blue-600 text-white" : index < step ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{index + 1}. {label}</li>)}</ol>
    {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

    {step === 0 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Personal information</h2><div className="rounded-xl border border-dashed bg-slate-50 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="h-24 w-24 overflow-hidden rounded-full bg-slate-200">{photoDataUrl ? <img src={photoDataUrl} alt="Teacher photo review" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-500">Photo</div>}</div><div><p className="font-medium">Teacher photo</p><p className="mb-2 text-sm text-slate-500">Take a photo using the device camera or choose one, then review it here.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => photoFileRef.current?.click()} className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-700">Choose image</button><button type="button" onClick={() => void openCamera()} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Open camera</button>{photoDataUrl && <button type="button" onClick={() => setPhotoDataUrl(null)} className="px-3 py-2 text-sm text-red-600">Remove</button>}</div></div></div><input ref={photoFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void choosePhoto(event.target.files?.[0])} /></div><div className="grid gap-4 sm:grid-cols-2">{(["firstName", "middleName", "lastName", "phone", "email", "nationality", "address"] as const).map((field) => <label key={field} className={field === "address" ? "sm:col-span-2" : ""}><span className="mb-1 block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}{["firstName", "lastName"].includes(field) && " *"}</span><input value={personal[field] ?? ""} onChange={(event) => setPersonal((current) => ({ ...current, [field]: event.target.value }))} type={field === "email" ? "email" : "text"} className="w-full rounded-lg border px-3 py-2" /></label>)}<label><span className="mb-1 block text-sm font-medium">Gender</span><select value={personal.gender} onChange={(event) => setPersonal((current) => ({ ...current, gender: event.target.value }))} className="w-full rounded-lg border px-3 py-2"><option value="">Select gender</option><option>Male</option><option>Female</option></select></label><label><span className="mb-1 block text-sm font-medium">Date of birth</span><input type="date" value={personal.dateOfBirth} onChange={(event) => setPersonal((current) => ({ ...current, dateOfBirth: event.target.value }))} className="w-full rounded-lg border px-3 py-2" /></label></div><div className="flex justify-end"><button onClick={continueFromPersonal} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">Continue</button></div></section>}

    {step === 1 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Assigned subjects</h2><p className="text-sm text-slate-500">Subjects come from Academic Setup. The teacher may use each assigned subject with any active class.</p><select value="" onChange={(event) => { if (event.target.value && !subjectIds.includes(event.target.value)) setSubjectIds((current) => [...current, event.target.value]); }} className="w-full rounded-lg border px-3 py-2"><option value="">Select subject to assign</option>{subjects.filter((subject) => !subjectIds.includes(subject.id)).map((subject) => <option key={subject.id} value={subject.id}>{subject.name}{subject.code ? ` (${subject.code})` : ""}</option>)}</select><div className="space-y-2">{subjectIds.map((id) => { const subject = subjects.find((item) => item.id === id); return <div key={id} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"><span>{subject?.name}</span><button onClick={() => setSubjectIds((current) => current.filter((item) => item !== id))} className="text-sm text-red-600">Remove</button></div>; })}</div><div className="flex justify-between"><button onClick={() => setStep(0)} className="text-sm text-slate-600">Back</button><button onClick={() => setStep(2)} className="rounded-lg bg-slate-800 px-5 py-2 text-white">Continue</button></div></section>}

    {step === 2 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Emergency contacts</h2><p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">The first contact you add is automatically saved as the teacher&apos;s next of kin. Any later contacts are additional emergency contacts.</p><div className="grid gap-3 sm:grid-cols-2">{(["fullName", "relationship", "phone", "alternativePhone", "address"] as const).map((field) => <label key={field}><span className="mb-1 block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</span><input value={contact[field] ?? ""} onChange={(event) => setContact((current) => ({ ...current, [field]: event.target.value }))} className="w-full rounded-lg border px-3 py-2" /></label>)}</div><button onClick={addContact} className="rounded-lg border border-blue-600 px-4 py-2 text-blue-700">{contacts.length === 0 ? "Add next of kin" : "Add contact"}</button>{contacts.map((item, index) => <div key={`${item.phone}-${index}`} className="flex justify-between rounded bg-slate-50 p-2 text-sm"><span>{item.fullName} — {item.relationship} — {item.phone}{item.isNextOfKin && <strong className="ml-2 text-blue-700">Next of kin</strong>}</span><button onClick={() => setContacts((current) => current.filter((_, i) => i !== index).map((item, i) => ({ ...item, isNextOfKin: i === 0 })))} className="text-red-600">Remove</button></div>)}<div className="flex justify-between"><button onClick={() => setStep(1)} className="text-sm text-slate-600">Back</button><button onClick={() => setStep(3)} className="rounded-lg bg-slate-800 px-5 py-2 text-white">Continue</button></div></section>}

    {step === 3 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Medical information</h2><div className="grid gap-3 sm:grid-cols-2">{(["bloodGroup", "allergies", "medicalConditions", "medication", "disability"] as const).map((field) => <label key={field}><span className="mb-1 block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</span><input value={medical[field] ?? ""} onChange={(event) => setMedical((current) => ({ ...current, [field]: event.target.value }))} className="w-full rounded-lg border px-3 py-2" /></label>)}<label className="sm:col-span-2"><span className="mb-1 block text-sm font-medium">Notes</span><textarea value={medical.notes ?? ""} onChange={(event) => setMedical((current) => ({ ...current, notes: event.target.value }))} rows={3} className="w-full rounded-lg border px-3 py-2" /></label></div><div className="flex justify-between"><button onClick={() => setStep(2)} className="text-sm text-slate-600">Back</button><button onClick={() => setStep(4)} className="rounded-lg bg-slate-800 px-5 py-2 text-white">Continue</button></div></section>}

    {step === 4 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Documents</h2><p className="text-sm text-slate-500">Documents are saved in this browser draft until final submission, then upload to Cloudinary together with the teacher record.</p><div className="grid gap-3 sm:grid-cols-2"><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="rounded-lg border px-3 py-2"><option value="">Select document category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} placeholder="Document title (optional)" className="rounded-lg border px-3 py-2" /><input ref={documentFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="sm:col-span-2 rounded-lg border px-3 py-2" /></div><button onClick={() => void addDocument()} className="rounded-lg border border-blue-600 px-4 py-2 text-blue-700">Add document</button>{documents.map((document, index) => <div key={`${document.fileName}-${index}`} className="flex justify-between rounded bg-slate-50 p-2 text-sm"><span>{document.title}</span><button onClick={() => setDocuments((current) => current.filter((_, i) => i !== index))} className="text-red-600">Remove</button></div>)}<div className="flex justify-between"><button onClick={() => setStep(3)} className="text-sm text-slate-600">Back</button><button onClick={() => setStep(5)} className="rounded-lg bg-slate-800 px-5 py-2 text-white">Continue</button></div></section>}

    {step === 5 && <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Employment and pay</h2><p className="text-sm text-slate-500">Set the teacher&apos;s role and agreed pay. The employee number is created automatically.</p><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium">Position</span><input value={employment.position ?? ""} onChange={(event) => setEmployment((current) => ({ ...current, position: event.target.value }))} placeholder="e.g. Mathematics Teacher" className="w-full rounded-lg border px-3 py-2" /></label><label><span className="mb-1 block text-sm font-medium">Employment type</span><select value={employment.employmentType ?? ""} onChange={(event) => setEmployment((current) => ({ ...current, employmentType: event.target.value }))} className="w-full rounded-lg border px-3 py-2"><option value="">Select type</option><option>Full Time</option><option>Part Time</option><option>Contract</option><option>Volunteer</option></select></label><label><span className="mb-1 block text-sm font-medium">Pay frequency</span><select value={employment.payFrequency ?? "MONTHLY"} onChange={(event) => setEmployment((current) => ({ ...current, payFrequency: event.target.value }))} className="w-full rounded-lg border px-3 py-2"><option value="MONTHLY">Monthly</option><option value="BI_WEEKLY">Bi-weekly</option><option value="WEEKLY">Weekly</option><option value="TERM">Per term</option></select></label><label><span className="mb-1 block text-sm font-medium">Amount (UGX)</span><input type="number" min="0" value={employment.salary ?? ""} onChange={(event) => setEmployment((current) => ({ ...current, salary: event.target.value ? Number(event.target.value) : undefined }))} placeholder="e.g. 500000" className="w-full rounded-lg border px-3 py-2" /></label><label><span className="mb-1 block text-sm font-medium">Department</span><input value={employment.department ?? ""} onChange={(event) => setEmployment((current) => ({ ...current, department: event.target.value }))} className="w-full rounded-lg border px-3 py-2" /></label></div><div className="flex justify-between"><button onClick={() => setStep(4)} className="text-sm text-slate-600">Back</button><button onClick={() => setStep(6)} className="rounded-lg bg-slate-800 px-5 py-2 text-white">Review registration</button></div></section>}

    {step === 6 && <section className="space-y-5 rounded-xl border bg-white p-6"><h2 className="text-lg font-semibold">Review and create teacher</h2><div className="flex gap-4 rounded-lg bg-slate-50 p-4">{photoDataUrl && <img src={photoDataUrl} alt="Teacher profile review" className="h-20 w-20 rounded-full object-cover" />}<div><p className="font-semibold">{personal.firstName} {personal.middleName} {personal.lastName}</p><p className="text-sm text-slate-600">Personal email: {personal.email || "Not provided"}</p><p className="text-sm text-slate-600">{employment.payFrequency?.replace("_", " ") || "Monthly"}: {employment.salary?.toLocaleString() || "Amount not set"} UGX</p><p className="text-sm text-slate-600">{subjectIds.length} subject(s), {contacts.length} contact(s), {documents.length} document(s)</p></div></div><p className="text-sm text-slate-600">When you confirm, all teacher records are written in one database transaction. If it fails, no partial teacher profile is created and this draft remains here.</p><div className="flex justify-between"><button onClick={() => setStep(5)} className="text-sm text-slate-600">Back</button><button onClick={() => void submitRegistration()} disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Creating..." : "Confirm and create teacher"}</button></div></section>}

    {cameraOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"><div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{capturedPhoto ? "Review teacher photo" : "Take teacher photo"}</h2><button onClick={closeCamera} className="text-slate-600">Close</button></div>{capturedPhoto ? <img src={capturedPhoto} alt="Captured teacher photo" className="max-h-[58vh] w-full rounded-lg bg-black object-contain" /> : <div className="relative overflow-hidden rounded-lg bg-black"><video ref={videoRef} muted autoPlay playsInline className="max-h-[58vh] w-full" /><p className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs text-white">Position the teacher in the frame, then capture.</p></div>}<div className="mt-4 grid gap-2 sm:grid-cols-2">{capturedPhoto ? <><button onClick={() => { setPhotoDataUrl(capturedPhoto); closeCamera(); }} className="order-1 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Use this photo</button><button onClick={() => void openCamera(facingMode)} className="order-2 rounded-lg border px-4 py-3 text-sm">Retake</button></> : <><button onClick={() => void openCamera(facingMode === "user" ? "environment" : "user")} className="rounded-lg border px-4 py-3 text-sm">Switch camera</button><button onClick={capturePhoto} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Capture photo</button></>}</div></div></div>}
  </div>;
}

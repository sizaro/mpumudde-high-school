import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import PhotoCapture from "../../../components/forms/PhotoCapture";
import ParentService, { type Guardian } from "../../../services/parentService";
import SetupService from "../../../services/setupService";
import StudentService from "../../../services/studentService";

const steps = [
  "Student Information",
  "Medical Information",
  "Parent Information",
  "Academic Placement",
  "Fees & Receipt",
  "Review",
];
const DRAFT_KEY = "mhs.student-registration-draft.v1";
const NATIONALITIES = [
  "Ugandan",
  "Kenyan",
  "Tanzanian",
  "Rwandan",
  "South Sudanese",
  "Congolese",
  "Burundian",
  "Other",
];
const OCCUPATIONS = [
  "Self-employed",
  "Teacher",
  "Civil servant",
  "Business owner",
  "Farmer",
  "Healthcare worker",
  "Driver",
  "Engineer",
  "Lawyer",
  "Accountant",
  "Security personnel",
  "Unemployed",
  "Other",
];

type AdditionalGuardianDraft = {
  parentId: string;
  name: string;
  phone: string;
  email: string;
};

type PaymentDraft = {
  feeTypeId: string;
  amount: string;
  method: string;
  receiptDataUrl: string;
  receiptName: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isImageDataUrl(value: string) {
  return value.startsWith("data:image/");
}

function isPdfDataUrl(value: string) {
  return value.startsWith("data:application/pdf");
}

function GuardianSelect({
  guardians,
  value,
  onChange,
  label,
}: {
  guardians: Guardian[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="text-sm font-medium text-slate-700 md:col-span-2">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
      >
        <option value="">Create or type a new guardian</option>
        {guardians.map((guardian) => (
          <option key={guardian.id} value={guardian.id}>
            {guardian.firstName} {guardian.lastName}
            {guardian.phone ? ` • ${guardian.phone}` : ""}
            {guardian.students.length
              ? ` • ${guardian.students.length} linked student${guardian.students.length > 1 ? "s" : ""}`
              : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function DocumentPicker({
  label,
  name,
  dataUrl,
  onFileSelect,
  onImageCapture,
  onClear,
}: {
  label: string;
  name: string;
  dataUrl: string;
  onFileSelect: (file: File) => Promise<void>;
  onImageCapture: (value: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="space-y-3 md:col-span-2">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="mt-1 text-sm text-slate-500">
          Choose a file, or take a document photo and preview it before
          registration.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700"
          >
            Choose file
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            disabled={!dataUrl}
          >
            Preview
          </button>
          {dataUrl ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600"
            >
              Remove
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void onFileSelect(file);
            event.target.value = "";
          }}
        />
        {name ? (
          <p className="mt-2 text-xs text-emerald-700">Selected: {name}</p>
        ) : null}
      </div>
      <PhotoCapture
        label={`${label} photo`}
        value={isImageDataUrl(dataUrl) ? dataUrl : ""}
        onChange={onImageCapture}
        facingMode="environment"
      />
      {previewOpen && dataUrl ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Preview {label.toLowerCase()}</h2>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>
            {isImageDataUrl(dataUrl) ? (
              <img
                src={dataUrl}
                alt={`${label} preview`}
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
            ) : null}
            {isPdfDataUrl(dataUrl) ? (
              <iframe
                title={`${label} preview`}
                src={dataUrl}
                className="h-[70vh] w-full rounded-xl border"
              />
            ) : null}
            {!isImageDataUrl(dataUrl) && !isPdfDataUrl(dataUrl) ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Preview is not available for this file type, but the file is
                attached and will upload normally.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReceiptCapture({
  name,
  onChange,
}: {
  name: string;
  onChange: (dataUrl: string, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [review, setReview] = useState<string | null>(null);

  useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream],
  );
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play();
    }
  }, [stream]);

  const stop = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const openCamera = async () => {
    try {
      setStream(
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        }),
      );
    } catch {
      window.alert("Allow camera permission, then try again.");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setReview(canvas.toDataURL("image/jpeg", 0.9));
    stop();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-700"
        >
          Choose receipt file
        </button>
        <button
          type="button"
          onClick={() => void openCamera()}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
        >
          Take receipt photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => onChange(String(reader.result), file.name);
            reader.readAsDataURL(file);
          }
        }}
      />
      {name && (
        <p className="mt-1 text-xs text-emerald-700">Selected: {name}</p>
      )}
      {(stream || review) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-4">
            <h2 className="mb-3 font-semibold">
              {review ? "Review receipt photo" : "Take receipt photo"}
            </h2>
            {review ? (
              <img
                src={review}
                alt="Receipt review"
                className="max-h-[58vh] w-full rounded-lg object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                className="max-h-[58vh] w-full rounded-lg bg-black"
              />
            )}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {review ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(review, `receipt-${Date.now()}.jpg`);
                      setReview(null);
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Use this receipt photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReview(null);
                      void openCamera();
                    }}
                    className="rounded-lg border px-4 py-3 text-sm"
                  >
                    Retake
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={stop}
                    className="rounded-lg border px-4 py-3 text-sm"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={capture}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm text-white"
                  >
                    Capture photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [guardiansCatalog, setGuardiansCatalog] = useState<Guardian[]>([]);
  const [saving, setSaving] = useState(false);
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
    parentId: "",
    parentName: "",
    parentRelationship: "",
    parentPhone: "",
    parentEmail: "",
    parentOccupation: "",
    parentAddress: "",
    parentPhoto: "",
    parentDocumentType: "",
    parentDocumentDataUrl: "",
    parentDocumentName: "",
    guardians: [
      { parentId: "", name: "", phone: "", email: "" },
    ] as AdditionalGuardianDraft[],
    academicYearId: "",
    termId: "",
    classId: "",
    studentCategoryId: "",
  });
  const [registrationData, setRegistrationData] = useState<any>({
    academicYears: [],
    terms: [],
    classes: [],
    studentCategories: [],
    feeTypes: [],
  });
  const [status, setStatus] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentDraft[]>([
    {
      feeTypeId: "",
      amount: "",
      method: "cash",
      receiptDataUrl: "",
      receiptName: "",
    },
  ]);
  const [draftReady, setDraftReady] = useState(false);
  const [completed, setCompleted] = useState<{
    studentId: string;
    studentName: string;
    guardianCredentials?: { email: string; temporaryPassword: string };
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const [data, guardians] = await Promise.all([
        SetupService.getRegistrationData(),
        ParentService.getGuardians(),
      ]);
      setRegistrationData(data);
      setGuardiansCatalog(guardians);
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          const source = draft.form ?? draft;
          setForm((current) => ({
            ...current,
            ...source,
            guardians:
              Array.isArray(source.guardians) && source.guardians.length
                ? source.guardians
                : current.guardians,
          }));
          if (Array.isArray(draft.payments) && draft.payments.length)
            setPayments(draft.payments);
          if (typeof draft.step === "number")
            setStep(Math.max(0, Math.min(draft.step, steps.length - 1)));
        } catch {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
      setDraftReady(true);
    };
    void load().catch(() =>
      setStatus("Unable to load registration setup or guardians."),
    );
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, payments, step }));
  }, [draftReady, form, payments, step]);

  useEffect(() => {
    const registrationFee = (registrationData.feeTypes || []).find(
      (fee: any) => fee.name?.toLowerCase() === "registration",
    );
    if (!registrationFee) return;
    setPayments((current) =>
      current.map((payment, index) =>
        index === 0 && !payment.feeTypeId
          ? { ...payment, feeTypeId: registrationFee.id }
          : payment,
      ),
    );
  }, [registrationData.feeTypes]);

  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);
  const selectedAcademicYear = (registrationData.academicYears || []).find(
    (year: any) => year.id === form.academicYearId,
  );
  const availableTerms = useMemo(() => {
    const yearTerms = (registrationData.terms || []).filter(
      (term: any) =>
        term.academicYearId === form.academicYearId ||
        term.academicYear?.id === form.academicYearId ||
        term.academicYear?.name === selectedAcademicYear?.name,
    );
    return yearTerms.length ? yearTerms : registrationData.terms || [];
  }, [form.academicYearId, registrationData.terms, selectedAcademicYear?.name]);
  const selectedPrimaryGuardian =
    guardiansCatalog.find((guardian) => guardian.id === form.parentId) ?? null;

  const updateField = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const applyGuardianToPrimary = (guardianId: string) => {
    const guardian = guardiansCatalog.find((item) => item.id === guardianId);
    if (!guardian) {
      setForm((current) => ({ ...current, parentId: "" }));
      return;
    }
    setForm((current) => ({
      ...current,
      parentId: guardian.id,
      parentName: `${guardian.firstName} ${guardian.lastName}`.trim(),
      parentRelationship: guardian.relationship ?? current.parentRelationship,
      parentPhone: guardian.phone ?? "",
      parentEmail: guardian.email ?? "",
      parentOccupation: guardian.occupation ?? "",
      parentAddress: guardian.address ?? "",
      parentPhoto: guardian.profilePhoto ?? current.parentPhoto,
    }));
  };

  const addGuardian = () => {
    setForm((current) => ({
      ...current,
      guardians: [
        ...current.guardians,
        { parentId: "", name: "", phone: "", email: "" },
      ],
    }));
  };

  const removeGuardian = (index: number) => {
    setForm((current) => ({
      ...current,
      guardians: current.guardians.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const updateGuardian = (
    index: number,
    field: keyof AdditionalGuardianDraft,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      guardians: current.guardians.map((guardian, guardianIndex) =>
        guardianIndex === index ? { ...guardian, [field]: value } : guardian,
      ),
    }));
  };

  const applyExistingAdditionalGuardian = (
    index: number,
    guardianId: string,
  ) => {
    const guardian = guardiansCatalog.find((item) => item.id === guardianId);
    if (!guardian) {
      updateGuardian(index, "parentId", "");
      return;
    }
    setForm((current) => ({
      ...current,
      guardians: current.guardians.map((item, guardianIndex) =>
        guardianIndex === index
          ? {
              ...item,
              parentId: guardian.id,
              name: `${guardian.firstName} ${guardian.lastName}`.trim(),
              phone: guardian.phone ?? "",
              email: guardian.email ?? "",
            }
          : item,
      ),
    }));
  };

  const handleNext = () =>
    setStep((current) => Math.min(current + 1, steps.length - 1));
  const handleBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleCreate = async () => {
    try {
      setSaving(true);
      setStatus("Uploading photos and registering the student. Please wait...");
      let studentPhoto: string | undefined;
      let parentPhoto: string | undefined;
      let parentDocumentUrl: string | undefined;
      if (form.passportPhoto) {
        const blob = await (await fetch(form.passportPhoto)).blob();
        const upload = new FormData();
        upload.append(
          "file",
          new File([blob], "student-profile.jpg", { type: "image/jpeg" }),
        );
        studentPhoto = (await StudentService.uploadPhoto(upload)).url;
      }
      if (form.parentPhoto && form.parentPhoto.startsWith("data:")) {
        const blob = await (await fetch(form.parentPhoto)).blob();
        const upload = new FormData();
        upload.append(
          "file",
          new File([blob], "guardian-profile.jpg", { type: "image/jpeg" }),
        );
        parentPhoto = (await StudentService.uploadPhoto(upload)).url;
      } else if (form.parentPhoto) {
        parentPhoto = form.parentPhoto;
      }
      if (form.parentDocumentDataUrl) {
        const blob = await (await fetch(form.parentDocumentDataUrl)).blob();
        const upload = new FormData();
        upload.append(
          "file",
          new File([blob], form.parentDocumentName || "guardian-document", {
            type: blob.type || "application/pdf",
          }),
        );
        parentDocumentUrl = (await StudentService.uploadPhoto(upload)).url;
      }
      const paymentPayload = [];
      for (const payment of payments) {
        if (!payment.feeTypeId || !payment.amount) continue;
        let receiptUrl: string | undefined;
        if (payment.receiptDataUrl) {
          const blob = await (await fetch(payment.receiptDataUrl)).blob();
          const upload = new FormData();
          upload.append(
            "file",
            new File([blob], payment.receiptName || "payment-receipt.jpg", {
              type: blob.type || "image/jpeg",
            }),
          );
          receiptUrl = (await StudentService.uploadPhoto(upload)).url;
        }
        paymentPayload.push({
          feeTypeId: payment.feeTypeId,
          feeTypeName: (registrationData.feeTypes || []).find(
            (fee: any) => fee.id === payment.feeTypeId,
          )?.name,
          academicYearId: form.academicYearId,
          termId: form.termId,
          amount: Number(payment.amount),
          method: payment.method,
          receiptUrl,
        });
      }
      if (!paymentPayload.length) {
        setStatus(
          "Add the required registration payment before confirming registration.",
        );
        return;
      }
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
        nationality: form.nationality || undefined,
        address: form.address || undefined,
        previousSchool: form.previousSchool || undefined,
        bloodGroup: form.bloodGroup || undefined,
        allergies: form.allergies || undefined,
        medicalConditions: form.medicalConditions || undefined,
        specialNeeds: form.specialNeeds || undefined,
        medicalNotes: form.medicalNotes || undefined,
      };
      const result = await StudentService.createCompleteRegistration({
        student,
        primaryGuardian: form.parentName
          ? {
              parentId: form.parentId || undefined,
              fullName: form.parentName,
              relationship: form.parentRelationship,
              phone: form.parentPhone,
              email: form.parentEmail,
              occupation: form.parentOccupation,
              address: form.parentAddress,
              profilePhoto: parentPhoto,
              identityDocumentType: form.parentDocumentType || undefined,
              identityDocumentUrl: parentDocumentUrl,
            }
          : undefined,
        additionalGuardians: form.guardians
          .filter(
            (guardian) =>
              guardian.parentId ||
              guardian.name.trim() ||
              guardian.phone.trim() ||
              guardian.email.trim(),
          )
          .map((guardian) => ({
            parentId: guardian.parentId || undefined,
            name: guardian.name,
            phone: guardian.phone || undefined,
            email: guardian.email || undefined,
          })),
        payments: paymentPayload,
      });
      localStorage.removeItem(DRAFT_KEY);
      setStatus(null);
      setCompleted({
        studentId: result.student.id,
        studentName: `${result.student.firstName} ${result.student.lastName}`,
        guardianCredentials: result.guardianCredentials,
      });
    } catch (error) {
      const response = error as {
        response?: { data?: { message?: string | string[] } };
      };
      const message = response.response?.data?.message;
      setStatus(
        Array.isArray(message)
          ? message.join(", ")
          : (message ?? "Unable to register the student. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };

  if (completed)
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
        <h1 className="text-2xl font-bold text-emerald-950">
          Student registration complete
        </h1>
        <p className="mt-2 text-emerald-800">
          {completed.studentName} was registered successfully.
        </p>
        {completed.guardianCredentials ? (
          <div className="mt-6">
            <p className="text-sm font-semibold text-emerald-950">
              Primary guardian portal credentials
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Give these details to the guardian once. The password cannot be
              viewed again.
            </p>
            <dl className="mt-4 space-y-3 rounded-2xl bg-white p-5">
              <div>
                <dt className="text-xs text-slate-500">Login email</dt>
                <dd className="font-semibold">
                  {completed.guardianCredentials.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Temporary password</dt>
                <dd className="font-mono text-lg font-semibold">
                  {completed.guardianCredentials.temporaryPassword}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
            The selected guardian already had a portal account, so no new
            password was generated.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/director/students/profile?id=${completed.studentId}`)
            }
            className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            View student
          </button>
          <button
            type="button"
            onClick={() => navigate("/director/guardians")}
            className="rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-900"
          >
            View guardians
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Student Registration
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Use the guided wizard to enroll a student and connect them to the
            configured finance structure.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Step {progress} • {steps[step]}
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            if (
              window.confirm(
                "Cancel student registration? The saved draft will be deleted.",
              )
            ) {
              localStorage.removeItem(DRAFT_KEY);
              navigate("/director");
            }
          }}
          className="rounded-2xl border border-red-200 px-4 py-3 text-sm text-red-700 disabled:opacity-50"
        >
          Cancel registration
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`rounded-full px-3 py-2 text-sm ${index <= step ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            {label}
          </div>
        ))}
      </div>
      {status ? (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${saving ? "border-blue-200 bg-blue-50 text-blue-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {status}
        </div>
      ) : null}

      {step === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Student Number
              <input
                type="text"
                value="Generated automatically when registration is confirmed"
                readOnly
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              First Name
              <input
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="First name"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Last Name
              <input
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Last name"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Date of Birth
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Gender
              <select
                value={form.gender}
                onChange={(event) => updateField("gender", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Nationality
              <select
                value={
                  NATIONALITIES.includes(form.nationality)
                    ? form.nationality
                    : form.nationality
                      ? "Other"
                      : ""
                }
                onChange={(event) =>
                  updateField(
                    "nationality",
                    event.target.value === "Other"
                      ? "Other"
                      : event.target.value,
                  )
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select nationality</option>
                {NATIONALITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Address
              <textarea
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Previous School
              <input
                value={form.previousSchool}
                onChange={(event) =>
                  updateField("previousSchool", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <div className="order-first md:col-span-2">
              <PhotoCapture
                label="Student photo"
                value={form.passportPhoto}
                onChange={(value) => updateField("passportPhoto", value)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Blood Group
              <select
                value={form.bloodGroup}
                onChange={(event) =>
                  updateField("bloodGroup", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select blood group</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Allergies
              <input
                value={form.allergies}
                onChange={(event) =>
                  updateField("allergies", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Medical Conditions
              <input
                value={form.medicalConditions}
                onChange={(event) =>
                  updateField("medicalConditions", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Special Medical Needs
              <input
                value={form.specialNeeds}
                onChange={(event) =>
                  updateField("specialNeeds", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Emergency Medical Notes
              <textarea
                value={form.medicalNotes}
                onChange={(event) =>
                  updateField("medicalNotes", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold text-slate-900">
              Parent/Guardian Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <GuardianSelect
                guardians={guardiansCatalog}
                value={form.parentId}
                onChange={applyGuardianToPrimary}
                label="Use an existing guardian"
              />
              {selectedPrimaryGuardian ? (
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800 md:col-span-2">
                  This guardian is already linked to{" "}
                  {selectedPrimaryGuardian.students.length} student
                  {selectedPrimaryGuardian.students.length === 1 ? "" : "s"}.
                  Selecting them will link this student to the same guardian
                  instead of creating a duplicate.
                </div>
              ) : null}
              <label className="text-sm font-medium text-slate-700">
                Parent Name
                <input
                  value={form.parentName}
                  onChange={(event) =>
                    updateField("parentName", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Relationship
                <select
                  value={form.parentRelationship}
                  onChange={(event) =>
                    updateField("parentRelationship", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option value="">Select relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Grandmother">Grandmother</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Phone
                <input
                  value={form.parentPhone}
                  onChange={(event) =>
                    updateField("parentPhone", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Email
                <input
                  value={form.parentEmail}
                  onChange={(event) =>
                    updateField("parentEmail", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Occupation
                <select
                  value={
                    OCCUPATIONS.includes(form.parentOccupation)
                      ? form.parentOccupation
                      : form.parentOccupation
                        ? "Other"
                        : ""
                  }
                  onChange={(event) =>
                    updateField("parentOccupation", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option value="">Select occupation</option>
                  {OCCUPATIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Address
                <input
                  value={form.parentAddress}
                  onChange={(event) =>
                    updateField("parentAddress", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <div className="order-first md:col-span-2">
                <PhotoCapture
                  label="Primary guardian photo"
                  value={form.parentPhoto}
                  onChange={(value) => updateField("parentPhoto", value)}
                />
              </div>
              <label className="text-sm font-medium text-slate-700">
                Guardian document type
                <select
                  value={form.parentDocumentType}
                  onChange={(event) =>
                    updateField("parentDocumentType", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option value="">Select document type</option>
                  <option>National ID</option>
                  <option>LC1 Introduction Letter</option>
                  <option>Passport</option>
                  <option>Other</option>
                </select>
              </label>
              <DocumentPicker
                label="Guardian document"
                name={form.parentDocumentName}
                dataUrl={form.parentDocumentDataUrl}
                onFileSelect={async (file) => {
                  const dataUrl = await fileToDataUrl(file);
                  setForm((current) => ({
                    ...current,
                    parentDocumentDataUrl: dataUrl,
                    parentDocumentName: file.name,
                  }));
                }}
                onImageCapture={(value) =>
                  setForm((current) => ({
                    ...current,
                    parentDocumentDataUrl: value,
                    parentDocumentName: `guardian-document-${Date.now()}.jpg`,
                  }))
                }
                onClear={() =>
                  setForm((current) => ({
                    ...current,
                    parentDocumentDataUrl: "",
                    parentDocumentName: "",
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Additional Guardians
              </h3>
              <button
                type="button"
                onClick={addGuardian}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
              >
                <Plus size={16} /> Add Guardian
              </button>
            </div>
            <div className="space-y-3">
              {form.guardians.map((guardian, index) => {
                const linkedGuardian = guardiansCatalog.find(
                  (item) => item.id === guardian.parentId,
                );
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <GuardianSelect
                        guardians={guardiansCatalog}
                        value={guardian.parentId}
                        onChange={(value) =>
                          applyExistingAdditionalGuardian(index, value)
                        }
                        label="Link an existing guardian"
                      />
                      <label className="text-sm font-medium text-slate-700">
                        Guardian name
                        <input
                          type="text"
                          value={guardian.name}
                          onChange={(event) =>
                            updateGuardian(index, "name", event.target.value)
                          }
                          placeholder="Guardian name"
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                        />
                      </label>
                      <label className="text-sm font-medium text-slate-700">
                        Guardian phone
                        <input
                          type="tel"
                          value={guardian.phone}
                          onChange={(event) =>
                            updateGuardian(index, "phone", event.target.value)
                          }
                          placeholder="Guardian phone"
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                        />
                      </label>
                      <label className="text-sm font-medium text-slate-700">
                        Guardian email
                        <input
                          type="email"
                          value={guardian.email}
                          onChange={(event) =>
                            updateGuardian(index, "email", event.target.value)
                          }
                          placeholder="Guardian email"
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                        />
                      </label>
                    </div>
                    {linkedGuardian ? (
                      <p className="mt-3 text-xs text-blue-700">
                        This existing guardian is already linked to{" "}
                        {linkedGuardian.students.length} student
                        {linkedGuardian.students.length === 1 ? "" : "s"}.
                      </p>
                    ) : null}
                    {form.guardians.length > 1 ? (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeGuardian(index)}
                          className="flex items-center justify-center rounded-2xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Academic Year
              <select
                value={form.academicYearId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    academicYearId: event.target.value,
                    termId: "",
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select academic year</option>
                {(registrationData.academicYears || []).map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Term
              <select
                value={form.termId}
                disabled={!form.academicYearId}
                onChange={(event) => updateField("termId", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 disabled:bg-slate-100"
              >
                <option value="">
                  {form.academicYearId
                    ? availableTerms.length
                      ? "Select term"
                      : "No terms configured"
                    : "Select academic year first"}
                </option>
                {availableTerms.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.academicYear?.name &&
                    item.academicYear?.name !== selectedAcademicYear?.name
                      ? ` (${item.academicYear.name})`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Class
              <select
                value={form.classId}
                onChange={(event) => updateField("classId", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select class</option>
                {(registrationData.classes || [])
                  .filter((item: any) => item.isActive)
                  .map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Student Category
              <select
                value={form.studentCategoryId}
                onChange={(event) =>
                  updateField("studentCategoryId", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="">Select category</option>
                {(registrationData.studentCategories || [])
                  .filter((item: any) => item.isActive)
                  .map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Registration fees and receipts
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Registration payment is required. Add other fee types such as
            Tuition, Reams, or Development if they are being paid now.
          </p>
          <div className="mt-4 space-y-4">
            {payments.map((payment, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-2"
              >
                <label className="text-sm font-medium">
                  Fee type
                  <select
                    value={payment.feeTypeId}
                    onChange={(event) =>
                      setPayments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, feeTypeId: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                  >
                    <option value="">Select fee type</option>
                    {(registrationData.feeTypes || [])
                      .filter((fee: any) => fee.isActive !== false)
                      .map((fee: any) => (
                        <option key={fee.id} value={fee.id}>
                          {fee.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Amount (UGX)
                  <input
                    type="number"
                    min="1"
                    value={payment.amount}
                    onChange={(event) =>
                      setPayments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, amount: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                  />
                </label>
                <label className="text-sm font-medium">
                  Payment method
                  <select
                    value={payment.method}
                    onChange={(event) =>
                      setPayments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, method: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank">Bank</option>
                  </select>
                </label>
                <div className="text-sm font-medium">
                  Receipt evidence
                  <ReceiptCapture
                    name={payment.receiptName}
                    onChange={(receiptDataUrl, receiptName) =>
                      setPayments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, receiptDataUrl, receiptName }
                            : item,
                        ),
                      )
                    }
                  />
                </div>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPayments((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 md:col-span-2"
                  >
                    Remove payment
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setPayments((current) => [
                  ...current,
                  {
                    feeTypeId: "",
                    amount: "",
                    method: "cash",
                    receiptDataUrl: "",
                    receiptName: "",
                  },
                ])
              }
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Add another payment
            </button>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Review before registration
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Student</h3>
              <div className="mt-3 flex gap-4">
                {form.passportPhoto ? (
                  <img
                    src={form.passportPhoto}
                    alt="Student preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-200" />
                )}
                <div className="space-y-1 text-sm text-slate-700">
                  <p>
                    <strong>Name:</strong> {form.firstName} {form.lastName}
                  </p>
                  <p>
                    <strong>Date of birth:</strong> {form.dateOfBirth || "—"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {form.gender || "—"}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {form.nationality || "—"}
                  </p>
                  <p>
                    <strong>Address:</strong> {form.address || "—"}
                  </p>
                  <p>
                    <strong>Previous school:</strong>{" "}
                    {form.previousSchool || "—"}
                  </p>
                </div>
              </div>
            </section>
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Primary guardian</h3>
              <div className="mt-3 flex gap-4">
                {form.parentPhoto ? (
                  <img
                    src={form.parentPhoto}
                    alt="Guardian preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-200" />
                )}
                <div className="space-y-1 text-sm text-slate-700">
                  <p>
                    <strong>Name:</strong> {form.parentName || "—"}
                  </p>
                  <p>
                    <strong>Relationship:</strong>{" "}
                    {form.parentRelationship || "—"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {form.parentPhone || "—"}
                  </p>
                  <p>
                    <strong>Email:</strong> {form.parentEmail || "—"}
                  </p>
                  <p>
                    <strong>Occupation:</strong> {form.parentOccupation || "—"}
                  </p>
                  <p>
                    <strong>Address:</strong> {form.parentAddress || "—"}
                  </p>
                  {form.parentId ? (
                    <p className="text-blue-700">
                      Existing guardian will be linked.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">
                Academic placement
              </h3>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>
                  <strong>Academic Year:</strong>{" "}
                  {(registrationData.academicYears || []).find(
                    (item: any) => item.id === form.academicYearId,
                  )?.name || "—"}
                </p>
                <p>
                  <strong>Term:</strong>{" "}
                  {(registrationData.terms || []).find(
                    (item: any) => item.id === form.termId,
                  )?.name || "—"}
                </p>
                <p>
                  <strong>Class:</strong>{" "}
                  {(registrationData.classes || []).find(
                    (item: any) => item.id === form.classId,
                  )?.name || "—"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {(registrationData.studentCategories || []).find(
                    (item: any) => item.id === form.studentCategoryId,
                  )?.name || "—"}
                </p>
              </div>
            </section>
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">
                Fees and receipts
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {payments.filter(
                  (payment) => payment.feeTypeId && payment.amount,
                ).length ? (
                  payments
                    .filter((payment) => payment.feeTypeId && payment.amount)
                    .map((payment, index) => (
                      <div
                        key={`${payment.feeTypeId}-${index}`}
                        className="rounded-xl bg-white p-3"
                      >
                        <p>
                          <strong>
                            {(registrationData.feeTypes || []).find(
                              (fee: any) => fee.id === payment.feeTypeId,
                            )?.name || "Fee"}
                          </strong>
                        </p>
                        <p>
                          Amount: {Number(payment.amount).toLocaleString()} UGX
                        </p>
                        <p>Method: {payment.method}</p>
                        <p>Receipt: {payment.receiptName || "None"}</p>
                      </div>
                    ))
                ) : (
                  <p>No payments added.</p>
                )}
              </div>
            </section>
            {form.guardians.some(
              (guardian) => guardian.parentId || guardian.name.trim(),
            ) ? (
              <section className="rounded-2xl bg-slate-50 p-4 lg:col-span-2">
                <h3 className="font-semibold text-slate-900">
                  Additional guardians
                </h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {form.guardians
                    .filter(
                      (guardian) => guardian.parentId || guardian.name.trim(),
                    )
                    .map((guardian, index) => (
                      <div
                        key={`${guardian.parentId}-${index}`}
                        className="rounded-xl bg-white p-3 text-sm text-slate-700"
                      >
                        <p>
                          <strong>
                            {guardian.name || "Existing guardian"}
                          </strong>
                        </p>
                        <p>Phone: {guardian.phone || "—"}</p>
                        <p>Email: {guardian.email || "—"}</p>
                        {guardian.parentId ? (
                          <p className="text-blue-700">
                            Existing guardian link
                          </p>
                        ) : null}
                      </div>
                    ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || saving}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 disabled:opacity-50"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Registering student..." : "Confirm Registration"}
          </button>
        )}
      </div>
    </div>
  );
}

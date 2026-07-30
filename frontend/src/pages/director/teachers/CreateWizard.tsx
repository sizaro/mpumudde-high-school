import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherService from "../../../services/teacherService";

const STEPS = ["Personal Info", "Account Setup", "Review"];

export default function CreateTeacherWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const [personal, setPersonal] = useState({
    firstName: "", middleName: "", lastName: "", gender: "",
    dateOfBirth: "", phone: "", email: "", nationality: "", address: "",
  });
  const [account, setAccount] = useState({ email: "" });

  function handlePersonal(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const res = await TeacherService.createWithAccount(personal, account);
      setResult(res);
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create teacher");
    } finally {
      setSaving(false);
    }
  }

  if (step === 2 && result) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-800 mb-2">Teacher Created!</h2>
          <p className="text-green-700 mb-4">
            {result.teacher.firstName} {result.teacher.lastName} has been registered.
          </p>
          <div className="bg-white border border-green-300 rounded p-3 mb-4">
            <p className="text-sm text-gray-600 mb-1">Login email: <strong>{result.teacher.user?.email}</strong></p>
            <p className="text-sm text-gray-600">Temporary password: <strong className="font-mono text-red-600">{result.temporaryPassword}</strong></p>
            <p className="text-xs text-red-500 mt-1">Share this password with the teacher. It will not be shown again.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/director/teachers/${result.teacher.id}`)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Profile
            </button>
            <button onClick={() => navigate("/director/teachers")} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register New Teacher</h1>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {STEPS.slice(0, 2).map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === i ? "bg-blue-600 text-white" : step > i ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
              {i + 1}
            </div>
            <span className="text-sm text-gray-600">{s}</span>
            {i < 1 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4">{error}</div>}

      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(["firstName", "middleName", "lastName", "gender", "dateOfBirth", "phone", "email", "nationality", "address"] as const).map((field) => (
              <div key={field} className={field === "address" ? "col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                {field === "gender" ? (
                  <select name={field} value={personal[field]} onChange={handlePersonal} className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <input type={field === "dateOfBirth" ? "date" : field === "email" ? "email" : "text"} name={field} value={personal[field as keyof typeof personal]} onChange={handlePersonal} className="w-full border border-gray-300 rounded px-3 py-2" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(1)} disabled={!personal.firstName || !personal.lastName} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login Email <span className="text-red-500">*</span></label>
            <input type="email" value={account.email} onChange={(e) => setAccount({ email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="teacher@school.ac.ug" />
            <p className="text-xs text-gray-500 mt-1">A temporary password will be auto-generated and shown once after creation.</p>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">← Back</button>
            <button onClick={handleSubmit} disabled={!account.email || saving} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              {saving ? "Creating..." : "Create Teacher"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthService from "../../services/authService";

function errorMessage(error: unknown) {
  const response = error as { response?: { data?: { message?: string | string[] } } };
  const message = response.response?.data?.message;
  return Array.isArray(message) ? message.join(", ") : message ?? "Could not change your password.";
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(""); setError("");
    if (newPassword.length < 8) return setError("Your new password must have at least 8 characters.");
    if (newPassword !== confirmPassword) return setError("The new passwords do not match.");
    setSaving(true);
    try {
      const result = await AuthService.changePassword(currentPassword, newPassword);
      setMessage(result.message); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (reason) { setError(errorMessage(reason)); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-xl p-8">
    <h1 className="text-2xl font-bold">Change password</h1>
    <p className="mt-2 text-sm text-slate-600">Set a personal password after your first sign-in. Keep it private.</p>
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      <PasswordInput label="Current password" value={currentPassword} onChange={setCurrentPassword} shown={visible.current} onToggle={() => setVisible((value) => ({ ...value, current: !value.current }))} />
      <PasswordInput label="New password" value={newPassword} onChange={setNewPassword} shown={visible.next} onToggle={() => setVisible((value) => ({ ...value, next: !value.next }))} minimum />
      <PasswordInput label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} shown={visible.confirm} onToggle={() => setVisible((value) => ({ ...value, confirm: !value.confirm }))} minimum />
      <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Update password"}</button>
    </form>
  </div>;
}

function PasswordInput({ label, value, onChange, shown, onToggle, minimum = false }: { label: string; value: string; onChange: (value: string) => void; shown: boolean; onToggle: () => void; minimum?: boolean }) {
  return <label className="block text-sm font-medium">{label}<span className="relative mt-1 block"><input required minLength={minimum ? 8 : undefined} type={shown ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border px-3 py-2 pr-11" /><button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500" aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>{shown ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>;
}

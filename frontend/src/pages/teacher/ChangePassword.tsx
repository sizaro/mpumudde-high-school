import { useState, type FormEvent } from "react";
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
      <label className="block text-sm font-medium">Current password<input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
      <label className="block text-sm font-medium">New password<input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Confirm new password<input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
      <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Update password"}</button>
    </form>
  </div>;
}

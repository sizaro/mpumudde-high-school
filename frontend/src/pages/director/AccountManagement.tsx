import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/authService';
import type { RegisterDto } from '../../types/auth';

const roles = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'SECRETARY', label: 'Secretary' },
  { value: 'BURSAR', label: 'Bursar' },
];

export default function AccountManagement() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'manage' | 'create'>('manage');
  const [form, setForm] = useState<RegisterDto>({
    email: '',
    password: '',
    role: 'STUDENT',
    firstName: '',
    lastName: '',
    phone: '',
    relationship: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await AuthService.register(form);
      setStatus('Account created successfully.');
      setForm({
        email: '',
        password: '',
        role: 'STUDENT',
        firstName: '',
        lastName: '',
        phone: '',
        relationship: '',
      });
    } catch (error: any) {
      setStatus(error.response?.data?.message ?? 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Management</h1>
          <p className="mt-2 text-slate-500">Manage your portal account and create new login accounts for staff and students.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Action</h2>
                <p className="mt-1 text-sm text-slate-500">Choose whether to manage your account or create a new portal account.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setActiveView('manage');
                  setStatus(null);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  activeView === 'manage'
                    ? 'border-slate-900 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Manage my account</span>
                  <span className="text-sm">View your active portal profile</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('create');
                  setStatus(null);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  activeView === 'create'
                    ? 'border-slate-900 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Create new account</span>
                  <span className="text-sm">Add a new student, parent, teacher, secretary, or bursar account</span>
                </div>
              </button>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            <p className="text-sm text-slate-600">
              Directors can create portal login accounts for all supported roles. Use the left actions to toggle between your own account and the new account flow.
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <h3 className="font-semibold">Supported roles</h3>
                <p>Student, Parent, Teacher, Secretary, Bursar</p>
              </div>
              <div>
                <h3 className="font-semibold">Notes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide the correct role before creating the account.</li>
                  <li>Add first and last name for all users.</li>
                  <li>Include a phone number for better follow-up.</li>
                  <li>Use relationship only for parent accounts.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {activeView === 'manage' ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Manage my account</h2>
              {user ? (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Logged in as</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
                    <p className="mt-1 text-sm text-slate-600">Roles: {user.roles.join(', ')}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold">Account management</p>
                    <p className="mt-2">
                      This panel shows your current portal account details. To update your password or email, use the main account settings page or contact an administrator if needed.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Unable to load your account details. Please refresh or sign in again.</p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Create a new user account</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {roles.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">First name</label>
                    <input
                      type="text"
                      value={form.firstName ?? ''}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Last name</label>
                    <input
                      type="text"
                      value={form.lastName ?? ''}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="tel"
                      value={form.phone ?? ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                  {form.role === 'PARENT' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Relationship</label>
                      <input
                        type="text"
                        value={form.relationship ?? ''}
                        onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </>
          )}

          {status && (
            <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {status}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

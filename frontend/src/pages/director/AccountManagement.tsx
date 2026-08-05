import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthService from "../../services/authService";
import type { RegisterDto } from "../../types/auth";

const roles = [
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
  { value: "TEACHER", label: "Teacher" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "BURSAR", label: "Bursar" },
  { value: "FINANCE_CLERK", label: "Finance Clerk" },
];

const inputClassName =
  "mt-2 block w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4";

export default function AccountManagement() {
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<"manage" | "create">("manage");

  const [form, setForm] = useState<RegisterDto>({
    email: "",
    password: "",
    role: "STUDENT",
    firstName: "",
    lastName: "",
    phone: "",
    relationship: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function generatePassword(length = 12) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";

    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  }

  useEffect(() => {
    if (activeView === "create" && !form.password) {
      setForm((current) => ({
        ...current,
        password: generatePassword(),
      }));

      setShowPassword(true);
    }
  }, [activeView, form.password]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setStatus(null);
    setCreatedPassword(null);
    setLoading(true);

    try {
      await AuthService.register(form);

      setCreatedPassword(form.password);
      setStatus("Account created successfully.");

      setForm({
        email: "",
        password: "",
        role: "STUDENT",
        firstName: "",
        lastName: "",
        phone: "",
        relationship: "",
      });

      setShowPassword(false);
    } catch (error: any) {
      setStatus(error.response?.data?.message ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-5 overflow-hidden sm:space-y-6">
      <header className="w-full min-w-0">
        <h1 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">
          Account Management
        </h1>

        <p className="mt-2 max-w-full break-words text-sm leading-6 text-slate-500 sm:text-base">
          View your director account details or create new portal login
          accounts.
        </p>
      </header>

      <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="w-full min-w-0 space-y-4 sm:space-y-6">
          <section className="flex w-full min-w-0 flex-col items-stretch gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-6">
            <div className="w-full min-w-0 text-center">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Action
              </h2>

              <p className="mt-2 max-w-full break-words text-sm leading-6 text-slate-500">
                Select an action to manage your director account or create a new
                user account.
              </p>
            </div>

            <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveView("manage");
                  setStatus(null);
                  setCreatedPassword(null);
                }}
                className={`w-full min-w-0 overflow-hidden rounded-2xl border px-3 py-4 transition sm:px-4 ${
                  activeView === "manage"
                    ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className="flex w-full min-w-0 flex-col items-center gap-1.5 text-center sm:gap-2">
                  <span className="max-w-full break-words text-sm font-semibold sm:text-base">
                    Manage my account
                  </span>

                  <span
                    className={`max-w-full break-words text-xs leading-5 sm:text-sm ${
                      activeView === "manage"
                        ? "text-white/80"
                        : "text-slate-500"
                    }`}
                  >
                    View current director details
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView("create");
                  setStatus(null);
                  setCreatedPassword(null);
                }}
                className={`w-full min-w-0 overflow-hidden rounded-2xl border px-3 py-4 transition sm:px-4 ${
                  activeView === "create"
                    ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className="flex w-full min-w-0 flex-col items-center gap-1.5 text-center sm:gap-2">
                  <span className="max-w-full break-words text-sm font-semibold sm:text-base">
                    Create new account
                  </span>

                  <span
                    className={`max-w-full break-words text-xs leading-5 sm:text-sm ${
                      activeView === "create"
                        ? "text-white/80"
                        : "text-slate-500"
                    }`}
                  >
                    Add a teacher, student, parent, bursar, or secretary
                  </span>
                </span>
              </button>
            </div>
          </section>

          <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-6">
            <h2 className="mb-4 break-words text-lg font-semibold text-slate-900 sm:text-xl">
              How it works
            </h2>

            <p className="max-w-full break-words text-sm leading-6 text-slate-600">
              Directors can create portal login accounts for supported roles and
              review their own active account details.
            </p>

            <div className="mt-6 min-w-0 space-y-4 text-sm text-slate-600">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-800">
                  Supported roles
                </h3>

                <p className="mt-1 break-words">
                  Student, Parent, Teacher, Secretary, Bursar and Finance Clerk
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-slate-800">Notes</h3>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Choose the correct role before creating an account.</li>
                  <li>Fill in first and last name for all users.</li>
                  <li>Add a phone number for follow-up contact.</li>
                  <li>
                    Provide relationship details only for parent accounts.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-6">
          {activeView === "manage" ? (
            <>
              <h2 className="mb-4 break-words text-lg font-semibold text-slate-900 sm:text-xl">
                Manage my account
              </h2>

              {user ? (
                <div className="w-full min-w-0 space-y-4">
                  <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-slate-50 p-3 sm:rounded-3xl sm:p-4">
                    <p className="text-sm text-slate-500">Logged in as</p>

                    <p className="mt-2 max-w-full break-all text-base font-semibold text-slate-900 sm:text-lg">
                      {user.email}
                    </p>

                    <p className="mt-1 max-w-full break-words text-sm text-slate-600">
                      Roles: {user.roles.join(", ")}
                    </p>
                  </div>

                  <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700 sm:rounded-3xl sm:p-4">
                    <p className="font-semibold">Account overview</p>

                    <p className="mt-2 break-words">
                      This panel shows your current director portal details. To
                      change your password or email, use the settings page or
                      contact administration.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="break-words text-sm leading-6 text-slate-600">
                  Unable to load account details. Please refresh or sign in
                  again.
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="mb-4 break-words text-lg font-semibold text-slate-900 sm:text-xl">
                Create a new user account
              </h2>

              <form
                onSubmit={handleSubmit}
                className="w-full min-w-0 space-y-4"
              >
                <div className="w-full min-w-0">
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="mt-2 flex w-full min-w-0 flex-col gap-2 sm:flex-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          password: event.target.value,
                        })
                      }
                      className="block w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="mt-2 flex w-full min-w-0 flex-col gap-2 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span className="min-w-0 break-words">
                      Auto-generated password can be shown here.
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          password: generatePassword(),
                        }));

                        setShowPassword(true);
                      }}
                      className="self-start font-medium text-slate-700 underline sm:self-auto"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role: event.target.value,
                      })
                    }
                    className={inputClassName}
                  >
                    {roles.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                  <div className="w-full min-w-0">
                    <label className="block text-sm font-medium text-slate-700">
                      First name
                    </label>

                    <input
                      type="text"
                      value={form.firstName ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          firstName: event.target.value,
                        })
                      }
                      className={inputClassName}
                    />
                  </div>

                  <div className="w-full min-w-0">
                    <label className="block text-sm font-medium text-slate-700">
                      Last name
                    </label>

                    <input
                      type="text"
                      value={form.lastName ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          lastName: event.target.value,
                        })
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                  <div className="w-full min-w-0">
                    <label className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={form.phone ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          phone: event.target.value,
                        })
                      }
                      className={inputClassName}
                    />
                  </div>

                  {form.role === "PARENT" && (
                    <div className="w-full min-w-0">
                      <label className="block text-sm font-medium text-slate-700">
                        Relationship
                      </label>

                      <input
                        type="text"
                        value={form.relationship ?? ""}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            relationship: event.target.value,
                          })
                        }
                        className={inputClassName}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            </>
          )}

          {status && (
            <div className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 sm:px-4">
              <p className="break-words">{status}</p>

              {createdPassword && (
                <p className="mt-2 max-w-full break-all font-mono text-slate-900">
                  Password: {createdPassword}
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

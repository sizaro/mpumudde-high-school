import { NavLink, Outlet } from "react-router-dom";
import { Bell, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navButton = ({ isActive }: { isActive: boolean }) =>
  `block rounded-3xl px-4 py-3 text-left text-sm transition duration-200 ease-out ${
    isActive
      ? "bg-slate-900 text-white shadow-lg shadow-slate-200/70"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
  }`;

const subNavButton = ({ isActive }: { isActive: boolean }) =>
  `block w-full rounded-2xl px-4 py-2.5 text-left text-sm transition duration-200 ease-out ml-4 ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-700"
  }`;

export default function DirectorLayout() {
  const { logout } = useAuth();
  const [studentsMenuOpen, setStudentsMenuOpen] = useState(false);
  const [teachersMenuOpen, setTeachersMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 lg:shadow-none ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="sticky top-0 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Director Portal
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Manage students and school finance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-6 space-y-2 text-sm">
              <NavLink to="." className={navButton} end>
                Overview
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setStudentsMenuOpen(!studentsMenuOpen)}
                  className={`${navButton({ isActive: studentsMenuOpen })} flex items-center justify-between w-full`}
                >
                  <span>Students</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${studentsMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {studentsMenuOpen && (
                  <div className="mt-1 space-y-1">
                    <NavLink
                      to="students/register"
                      className={subNavButton}
                      end
                    >
                      Register Student
                    </NavLink>
                    <NavLink to="students" className={subNavButton} end>
                      Registered Students
                    </NavLink>
                    <NavLink to="students/status" className={subNavButton} end>
                      Student Status
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="guardians" className={navButton}>
                Guardians
              </NavLink>

              <NavLink to="attendance" className={navButton} end>
                Attendance
              </NavLink>

              <NavLink to="finance" className={navButton} end>
                Finances
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setTeachersMenuOpen(!teachersMenuOpen)}
                  className={`${navButton({ isActive: teachersMenuOpen })} flex items-center justify-between w-full`}
                >
                  <span>Teachers</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${teachersMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {teachersMenuOpen && (
                  <div className="mt-1 space-y-1">
                    <NavLink to="teachers" className={subNavButton} end>
                      All Teachers
                    </NavLink>
                    <NavLink to="teachers/create" className={subNavButton} end>
                      Register Teacher
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="account-management" className={navButton} end>
                Account Management
              </NavLink>
              <NavLink to="academic-setup" className={navButton} end>
                Academic Setup
              </NavLink>
              <NavLink to="reports" className={navButton} end>
                Reports
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-10">
          <div className="mb-6 flex justify-between">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                aria-label="View notifications"
              >
                <Bell size={20} />
                <span className="sr-only">Notifications</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>

          <div className="animate-[fadeIn_0.4s_ease-out] rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

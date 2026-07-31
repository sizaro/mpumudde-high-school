import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  UserCircle,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navButton = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition duration-200 ease-out ${
    isActive
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
  }`;

const subNavButton = ({ isActive }: { isActive: boolean }) =>
  `block w-full rounded-2xl px-4 py-2.5 text-left text-sm transition duration-200 ease-out ml-4 ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-700"
  }`;

export default function DirectorLayout() {
  const { logout, user } = useAuth();
  const [studentsMenuOpen, setStudentsMenuOpen] = useState(false);
  const [teachersMenuOpen, setTeachersMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-6 shadow-sm lg:w-72 lg:border-r lg:border-b-0 lg:shadow-none">
          <div className="sticky top-0 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Director Portal
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage students and school finance.
              </p>
            </div>

            <nav className="mt-6 space-y-2 text-sm">
              <NavLink to="." className={navButton} end>
                <LayoutDashboard size={18} />
                Overview
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setStudentsMenuOpen(!studentsMenuOpen)}
                  className={`${navButton({ isActive: studentsMenuOpen })} w-full justify-between`}
                >
                  <span className="flex items-center gap-3">
                    <Users size={18} />
                    Students
                  </span>
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

              <NavLink to="finance" className={navButton} end>
                <Wallet size={18} />
                Finances
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setTeachersMenuOpen(!teachersMenuOpen)}
                  className={`${navButton({ isActive: teachersMenuOpen })} w-full justify-between`}
                >
                  <span className="flex items-center gap-3">
                    <GraduationCap size={18} />
                    Teachers
                  </span>
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
                <UserCog size={18} />
                Account Management
              </NavLink>
              <NavLink to="academic-setup" className={navButton} end>
                <BookOpen size={18} />
                Academic Setup
              </NavLink>
              <NavLink to="reports" className={navButton} end>
                <BarChart3 size={18} />
                Reports
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-900/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/70 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="View notifications"
              >
                <Bell size={18} />
                <span className="sr-only">Notifications</span>
              </button>

              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <UserCircle size={20} />
                </div>
                <span className="text-sm font-medium">{user?.email ?? "Director"}</span>
                <ChevronDown size={16} className="text-white/70" />
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <LogOut size={16} />
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

import { NavLink, Outlet } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navButton = ({ isActive }: { isActive: boolean }) =>
  `block rounded-3xl px-4 py-3 text-left text-sm transition duration-200 ease-out ${
    isActive
      ? "bg-slate-900 text-white shadow-lg shadow-slate-200/70"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
  }`;

export default function DirectorLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-6 shadow-sm lg:w-72 lg:border-r lg:border-b-0 lg:shadow-none">
          <div className="sticky top-0 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Director Portal</h2>
              <p className="mt-2 text-sm text-slate-500">Manage students and school finance.</p>
            </div>

            <nav className="mt-6 space-y-2 text-sm">
              <NavLink to="." className={navButton} end>
                Overview
              </NavLink>
              <NavLink to="students/register" className={navButton} end>
                Student Registration
              </NavLink>
              <NavLink to="students" className={navButton} end>
                Registered Students
              </NavLink>
              <NavLink to="students/status" className={navButton} end>
                Student Status
              </NavLink>
              <NavLink to="finance" className={navButton} end>
                Finances
              </NavLink>
              <NavLink to="reports" className={navButton} end>
                Reports
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-6 flex justify-end">
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

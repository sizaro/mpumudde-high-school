import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ParentDashboardProvider } from "./ParentDashboardContext";

const navButton = ({ isActive }: { isActive: boolean }) =>
  `block rounded-3xl px-4 py-3 text-left text-sm transition duration-200 ease-out ${
    isActive
      ? "bg-slate-900 text-white shadow-lg shadow-slate-200/70"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
  }`;

const links = [
  { to: "children", label: "Children" },
  { to: "attendance", label: "Attendance" },
  { to: "finance", label: "Finance" },
  { to: "settings", label: "Settings" },
];

export default function ParentLayout() {
  const { logout } = useAuth();

  return (
    <ParentDashboardProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-6 shadow-sm lg:w-72 lg:border-r lg:border-b-0 lg:shadow-none">
          <div className="sticky top-0 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Parent Portal
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Access your children’s attendance, finance, and account settings.
              </p>
            </div>

            <nav className="space-y-2 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={navButton}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </ParentDashboardProvider>
  );
}

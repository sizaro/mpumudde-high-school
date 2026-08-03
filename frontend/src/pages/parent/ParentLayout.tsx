import { NavLink, Outlet } from "react-router-dom";
import { Bell, CalendarCheck, ChevronDown, LogOut, Search, Settings as SettingsIcon, Users, Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ParentDashboardProvider, useParentDashboard } from "./ParentDashboardContext";

const links = [
  { to: "children", label: "Children", icon: Users },
  { to: "attendance", label: "Attendance", icon: CalendarCheck },
  { to: "finance", label: "Finance", icon: Wallet },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

function ParentTopBar() {
  const { data } = useParentDashboard();
  const { logout } = useAuth();
  const parent = data?.parent;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="View notifications"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200">
            {parent?.profilePhoto ? (
              <img src={parent.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                {parent?.firstName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-slate-700">
            {parent ? `${parent.firstName} ${parent.lastName}` : "Parent"}
          </span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

function ParentPortalShell() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-[#0B1437] p-6 text-white lg:w-72 lg:shrink-0">
          <div className="sticky top-6 space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold">
                M
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Mpumudde High</p>
                <p className="text-xs text-slate-400">Parent Portal</p>
              </div>
            </div>

            <nav className="space-y-1.5 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition duration-200 ease-out ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <ParentTopBar />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ParentLayout() {
  return (
    <ParentDashboardProvider>
      <ParentPortalShell />
    </ParentDashboardProvider>
  );
}

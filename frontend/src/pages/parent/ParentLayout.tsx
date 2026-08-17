import { NavLink, Outlet } from "react-router-dom";
import {
  CalendarCheck,
  Home,
  LogOut,
  Settings as SettingsIcon,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  ParentDashboardProvider,
  useParentDashboard,
} from "./ParentDashboardContext";

const links = [
  { to: ".", label: "Overview", icon: Home, end: true },
  { to: "children", label: "Children", icon: Users },
  { to: "attendance", label: "Attendance", icon: CalendarCheck },
  { to: "finance", label: "Finance", icon: Wallet },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

function ParentPortalShell() {
  const { data } = useParentDashboard();
  const { logout } = useAuth();
  const parent = data?.parent;
  return (
    <div className="portal-shell parent-portal text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="portal-sidebar w-full p-5 text-white lg:w-72 lg:shrink-0 lg:p-6">
          <div className="lg:sticky lg:top-6">
            <div className="flex items-center gap-3 px-2">
              <div className="portal-brand-mark text-lg font-bold">
                M
              </div>
              <div>
                <p className="text-sm font-semibold">Mpumudde High</p>
                <p className="text-xs text-slate-400">Parent Portal</p>
              </div>
            </div>
            <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 text-sm lg:block lg:space-y-1.5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `portal-nav-item min-w-max ${isActive ? "portal-nav-item--active" : ""}`
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className="portal-main min-w-0 w-full flex-1 p-2.5 md:p-6 lg:p-8">
          <header className="portal-topbar mb-6 flex items-center justify-between rounded-3xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                {parent?.profilePhoto ? (
                  <img
                    src={parent.profilePhoto}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-semibold text-slate-500">
                    {parent?.firstName?.[0] || "P"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {parent ? `${parent.firstName} ${parent.lastName}` : "Parent"}
                </p>
                <p className="text-xs text-slate-500">
                  Read-only family school account
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="portal-action-button"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </header>
          <div className="portal-content"><Outlet /></div>
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

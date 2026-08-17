import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  HeartPulse,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/teacher/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/teacher/classes", label: "My Classes", icon: UsersRound },
  { to: "/teacher/subjects", label: "My Subjects", icon: BookOpen },
  { to: "/teacher/attendance/take", label: "Take Attendance", icon: ClipboardCheck },
  { to: "/teacher/attendance/history", label: "Attendance History", icon: History },
  { to: "/teacher/profile", label: "My Profile", icon: UserRound },
  { to: "/teacher/documents", label: "My Documents", icon: FileText },
  { to: "/teacher/medical", label: "Medical Info", icon: HeartPulse },
  { to: "/teacher/finance", label: "My Salary & Payments", icon: WalletCards },
  { to: "/teacher/change-password", label: "Change Password", icon: KeyRound },
];

export default function TeacherLayout() {
  const { logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <div className="portal-shell teacher-portal flex min-h-screen">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
      <aside
        className={`portal-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-1 overflow-y-auto px-5 py-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="mb-2 self-end rounded p-2 text-gray-300 hover:bg-gray-700 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <div className="mb-5 flex items-center gap-3 border-b border-white/10 px-1 pb-5">
          <div className="portal-brand-mark"><School size={21} /></div>
          <div><p className="text-sm font-bold text-white">Mpumudde High</p><p className="text-xs text-white/55">Teacher Portal</p></div>
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `portal-nav-item ${isActive ? "portal-nav-item--active" : ""}`}
          >
            <link.icon size={18} /> {link.label}
          </NavLink>
        ))}
      </aside>
      <main className="portal-main min-w-0 flex-1 overflow-auto p-3 sm:p-5 lg:p-8">
        <header className="portal-topbar mb-6 flex items-center justify-between rounded-3xl p-3 sm:px-5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-xl p-2 text-gray-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block"><p className="text-sm font-bold text-slate-800">Teaching workspace</p><p className="text-xs text-slate-500">Classes, subjects and attendance</p></div>
          <button type="button" onClick={logout} className="portal-action-button ml-auto"><LogOut size={17} /><span className="hidden sm:inline">Log out</span></button>
        </header>
        <div className="portal-page portal-content"><Outlet /></div>
      </main>
    </div>
  );
}

import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/teacher/overview", label: "Overview" },
  { to: "/teacher/classes", label: "My Classes" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/attendance/take", label: "Take Attendance" },
  { to: "/teacher/attendance/history", label: "Attendance History" },
  { to: "/teacher/profile", label: "My Profile" },
  { to: "/teacher/documents", label: "My Documents" },
  { to: "/teacher/medical", label: "Medical Info" },
  { to: "/teacher/finance", label: "My Salary & Payments" },
  { to: "/teacher/change-password", label: "Change Password" },
];

export default function TeacherLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return <div className="flex min-h-screen">
    {mobileNavOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-1 overflow-y-auto bg-gray-900 px-3 py-6 text-white transition-transform lg:static lg:w-56 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <button type="button" onClick={() => setMobileNavOpen(false)} className="mb-2 self-end rounded p-2 text-gray-300 hover:bg-gray-700 lg:hidden" aria-label="Close navigation"><X size={20} /></button>
      <p className="mb-3 px-3 text-xs font-semibold uppercase text-gray-400">Teacher Portal</p>
      {links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `rounded px-3 py-2 text-sm ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>{link.label}</NavLink>)}
    </aside>
    <main className="flex-1 overflow-auto bg-gray-50"><div className="border-b bg-white p-3 lg:hidden"><button type="button" onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100" aria-label="Open navigation"><Menu size={22} /></button></div><Outlet /></main>
  </div>;
}

import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/teacher/overview", label: "Overview" },
  { to: "/teacher/classes", label: "My Classes" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/attendance/take", label: "Take Attendance" },
  { to: "/teacher/attendance/history", label: "Attendance History" },
  { to: "/teacher/profile", label: "My Profile" },
  { to: "/teacher/documents", label: "My Documents" },
  { to: "/teacher/medical", label: "Medical Info" },
  { to: "/teacher/change-password", label: "Change Password" },
];

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white flex flex-col py-6 px-3 gap-1 shrink-0">
        <p className="text-xs uppercase text-gray-400 px-3 mb-3 font-semibold">
          Teacher Portal
        </p>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

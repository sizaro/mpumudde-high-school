import { DateTime } from "luxon";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { DirectorDashboard } from "../../../services/dashboardService";

const dateLabel = (value: string) => {
  const date = DateTime.fromISO(value).setZone("Africa/Kampala");
  return date.isValid ? date.toFormat("dd LLL yyyy") : value;
};

export default function RecentRegistrations({ data }: { data: DirectorDashboard }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent registrations</h2>
        <p className="mt-1 text-sm text-slate-500">The newest student and teacher records.</p>
      </div>
      <div className="grid divide-y divide-slate-100 xl:grid-cols-2 xl:divide-x xl:divide-y-0">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Students</h3><Link to="students" className="text-xs font-semibold text-blue-700 hover:underline">View all</Link></div>
          <div className="space-y-1">
            {data.recentStudents.length ? data.recentStudents.map((student) => (
              <Link key={student.id} to={`students/profile?id=${student.id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{student.firstName[0]}{student.lastName[0]}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{student.firstName} {student.lastName}</span><span className="block truncate text-xs text-slate-500">{student.admissionNumber} · {student.schoolClass?.name ?? "Class not assigned"} · {dateLabel(student.createdAt)}</span></span>
                <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-700" />
              </Link>
            )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No students registered yet.</p>}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Teachers</h3><Link to="teachers" className="text-xs font-semibold text-blue-700 hover:underline">View all</Link></div>
          <div className="space-y-1">
            {data.recentTeachers.length ? data.recentTeachers.map((teacher) => (
              <Link key={teacher.id} to={`teachers/${teacher.id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">{teacher.firstName[0]}{teacher.lastName[0]}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{teacher.firstName} {teacher.lastName}</span><span className="block truncate text-xs text-slate-500">{teacher.employment?.employeeNumber ?? "No employee number"} · {teacher.employment?.position ?? "Position not set"} · {dateLabel(teacher.createdAt)}</span></span>
                <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-700" />
              </Link>
            )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No teachers registered yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

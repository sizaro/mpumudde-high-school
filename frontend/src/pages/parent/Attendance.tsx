import { useMemo } from "react";
import { useParentDashboard } from "./ParentDashboardContext";

export default function ParentAttendance() {
  const { data, loading, error, selectedStudentId } = useParentDashboard();

  const student = useMemo(() => {
    if (!data) return null;
    return data.student ?? null;
  }, [data]);

  if (loading) {
    return <p className="text-slate-600">Loading attendance records...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!data || !student) {
    return <p className="text-slate-600">No student selected.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="mt-2 text-sm text-slate-500">Review the latest attendance records for your selected child.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Student</p>
            <p className="mt-2 text-lg font-semibold">{student.firstName} {student.lastName}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Admission</p>
            <p className="mt-2 text-lg font-semibold">{student.admissionNumber}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Teacher</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {student.attendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-sm text-slate-500">
                    No attendance records available.
                  </td>
                </tr>
              ) : (
                student.attendance.map((record, index) => (
                  <tr key={index} className="border-t border-slate-100">
                    <td className="py-3">{record.date ?? "—"}</td>
                    <td className="py-3">{record.subject ?? "—"}</td>
                    <td className="py-3">{record.teacher ?? "—"}</td>
                    <td className="py-3">{record.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

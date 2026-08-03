import { useMemo } from "react";
import { useParentDashboard } from "./ParentDashboardContext";

export default function ParentChildren() {
  const { data, loading, error, selectedStudentId, selectStudent } = useParentDashboard();

  const selectedChild = useMemo(() => {
    if (!data) return null;
    return data.children?.find((child) => child.studentId === selectedStudentId) ?? data.children?.[0] ?? null;
  }, [data, selectedStudentId]);

  if (loading) {
    return <p className="text-slate-600">Loading children...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-slate-600">No parent dashboard data is available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="text-2xl font-semibold">Your children</h1>
        <p className="mt-2 text-sm text-slate-500">Manage which child profile is currently selected for details.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.children?.map((child) => (
          <button
            key={child.studentId}
            onClick={() => selectStudent(child.studentId)}
            className={`rounded-3xl border p-5 text-left transition ${
              selectedChild?.studentId === child.studentId
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <p className="font-semibold text-lg">{child.firstName} {child.lastName}</p>
            <p className="mt-2 text-sm text-slate-500">Admission: {child.admissionNumber}</p>
            <p className="mt-1 text-sm text-slate-500">{child.className ?? "No class assigned"}</p>
            <p className="mt-1 text-sm text-slate-500">{child.academicYear ?? "No academic year"}</p>
          </button>
        ))}
      </div>

      {selectedChild ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Selected child</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-2 text-lg font-semibold">{selectedChild.firstName} {selectedChild.lastName}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Relationship</p>
              <p className="mt-2 text-lg font-semibold">{selectedChild.relationship ?? "Not specified"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Class</p>
              <p className="mt-2 text-lg font-semibold">{selectedChild.className ?? "Not assigned"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current term</p>
              <p className="mt-2 text-lg font-semibold">{selectedChild.term ?? "Not assigned"}</p>
            </div>
          </div>
        </section>
      ) : (
        <p className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">Select a child from the list to view details.</p>
      )}
    </div>
  );
}

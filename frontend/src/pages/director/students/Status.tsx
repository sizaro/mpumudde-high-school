import { useEffect, useState } from "react";
import StudentService from "../../../services/studentService";
import type { Student } from "../../../types/api.types";

export default function StudentStatus() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await StudentService.getStudents();
        setStudents(data);
      } catch (err) {
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const updateStatus = async (student: Student, isActive: boolean) => {
    setError(null);
    setSavingIds((ids) => [...ids, student.id]);

    try {
      const updatedStudent = await StudentService.updateStudent(student.id, { isActive });
      setStudents((current) => current.map((item) => (item.id === student.id ? updatedStudent : item)));
    } catch (err) {
      setError("Unable to update student status.");
    } finally {
      setSavingIds((ids) => ids.filter((id) => id !== student.id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Student Status Management</h1>
      <p className="mt-2 text-slate-500">Update student active/inactive status and view current state.</p>

      {error ? (
        <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No students found.
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-sm text-slate-500">Admission: {student.admissionNumber}</p>
                <p className="text-sm text-slate-500">
                  Current status: {student.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="ml-auto flex flex-wrap gap-3 sm:ml-0">
                <button
                  disabled={savingIds.includes(student.id) || student.isActive}
                  onClick={() => updateStatus(student, true)}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {savingIds.includes(student.id) ? "Saving..." : "Set active"}
                </button>
                <button
                  disabled={savingIds.includes(student.id) || !student.isActive}
                  onClick={() => updateStatus(student, false)}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {savingIds.includes(student.id) ? "Saving..." : "Set inactive"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import StudentService from "../../../services/studentService";
import type { Student } from "../../types/api.types";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registered Students</h1>
          <p className="mt-2 text-slate-500">Search or edit the current student roster.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search students"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            disabled
          />
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800" disabled>
            Search
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Admission</th>
              <th className="px-6 py-4 text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Loading students...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{student.admissionNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{student.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

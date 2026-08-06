import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StudentService from "../../../services/studentService";
import type { Student } from "../../../types/api.types";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await StudentService.getStudents();
        setStudents(data);
      } catch {
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    };

    void loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      `${student.firstName} ${student.lastName} ${student.admissionNumber}`
        .toLowerCase()
        .includes(query),
    );
  }, [search, students]);

  const archiveStudent = async (student: Student) => {
    if (
      !window.confirm(
        `Archive ${student.firstName} ${student.lastName}? Their attendance and finance history will remain, but the student will become inactive.`,
      )
    )
      return;
    setDeletingId(student.id);
    try {
      const updated = await StudentService.deleteStudent(student.id);
      setStudents((current) =>
        current.map((item) =>
          item.id === student.id
            ? { ...item, ...(updated as Partial<Student>) }
            : item,
        ),
      );
      setError(null);
    } catch {
      setError("Unable to archive this student.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registered Students</h1>
          <p className="mt-2 text-slate-500">
            Search, review, or archive the current student roster.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search students"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
          />
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
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  Loading students...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {student.admissionNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {student.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Link
                        title="View student profile"
                        aria-label={`View ${student.firstName} ${student.lastName}`}
                        to={`/director/students/profile?id=${student.id}`}
                        className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        title="Edit student"
                        aria-label={`Edit ${student.firstName} ${student.lastName}`}
                        to={`/director/students/profile?id=${student.id}`}
                        className="rounded-lg p-2 text-amber-700 hover:bg-amber-50"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        title="Archive student"
                        aria-label={`Archive ${student.firstName} ${student.lastName}`}
                        disabled={
                          deletingId === student.id || !student.isActive
                        }
                        onClick={() => void archiveStudent(student)}
                        className="rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

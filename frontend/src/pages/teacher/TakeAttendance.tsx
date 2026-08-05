import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AttendanceService from "../../services/attendanceService";
import TeacherService from "../../services/teacherService";

const STATUSES = ["Present", "Absent", "Late", "Excused"] as const;

type Status = (typeof STATUSES)[number];

const statusStyles: Record<Status, string> = {
  Present: "bg-green-600 text-white border-green-600",
  Absent: "bg-red-600 text-white border-red-600",
  Late: "bg-amber-500 text-white border-amber-500",
  Excused: "bg-blue-600 text-white border-blue-600",
};

export default function TakeAttendance() {
  const [params] = useSearchParams();

  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState(params.get("classId") ?? "");
  const [subjectId, setSubjectId] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    TeacherService.getMyClasses().then(setClasses);
    TeacherService.getMySubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (!classId) {
      setStudents([]);
      setStatuses({});
      return;
    }

    setLoadingStudents(true);

    AttendanceService.getStudentsForClass(classId)
      .then((list) => {
        setStudents(list);

        const initialStatuses: Record<string, Status> = {};

        list.forEach((student: any) => {
          initialStatuses[student.id] = "Present";
        });

        setStatuses(initialStatuses);
      })
      .finally(() => setLoadingStudents(false));
  }, [classId]);

  const setAllStatuses = (status: Status) => {
    setStatuses(
      Object.fromEntries(students.map((student) => [student.id, status])),
    );
  };

  const countStatus = (status: Status) =>
    Object.values(statuses).filter((value) => value === status).length;

  async function submit() {
    if (!classId || !subjectId || students.length === 0) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await AttendanceService.createSession({
        classId,
        subjectId,
        records: students.map((student) => ({
          studentId: student.id,
          status: statuses[student.id] ?? "Present",
        })),
      });

      setSaved(true);
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-lg px-1 py-4 sm:px-4 sm:py-6 md:p-8">
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-green-200 bg-green-50 p-4 text-center sm:rounded-3xl sm:p-6">
          <p className="text-2xl" aria-hidden="true">
            ✅
          </p>

          <h2 className="mt-2 text-lg font-bold text-green-800 sm:text-xl">
            Attendance Saved
          </h2>

          <p className="mt-1 text-sm text-green-700">
            {students.length} students recorded.
          </p>

          <button
            type="button"
            onClick={() => {
              setSaved(false);
              setSubjectId("");
            }}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Take Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-5 overflow-hidden px-1 py-3 sm:px-4 sm:py-6 md:p-8">
      <header className="w-full min-w-0">
        <h1 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
          Take Attendance
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select a class and subject, then record each student’s attendance.
        </p>
      </header>

      {error && (
        <div className="w-full min-w-0 break-words rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4">
          {error}
        </div>
      )}

      <section className="grid w-full min-w-0 grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 md:grid-cols-2">
        <div className="w-full min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Class
          </label>

          <select
            value={classId}
            onChange={(event) => {
              setClassId(event.target.value);
              setSubjectId("");
            }}
            className="w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select class</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Subject
          </label>

          <select
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            disabled={!classId}
            className="w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select subject</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loadingStudents && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading students...
        </div>
      )}

      {!loadingStudents && students.length > 0 && classId && subjectId && (
        <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
          <div className="flex min-w-0 flex-col gap-4 border-b border-slate-200 bg-slate-50 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <span className="text-sm font-semibold text-slate-800 sm:text-base">
              {students.length} Students
            </span>

            <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAllStatuses(status)}
                  className="min-w-0 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:px-3"
                >
                  All {status}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile student cards */}
          <div className="space-y-3 p-3 md:hidden">
            {students.map((student) => (
              <article
                key={student.id}
                className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <h2 className="break-words text-sm font-semibold text-slate-900">
                    {student.firstName} {student.lastName}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {student.admissionNumber}
                  </p>
                </div>

                <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
                  {STATUSES.map((status) => {
                    const selected = statuses[student.id] === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setStatuses((current) => ({
                            ...current,
                            [student.id]: status,
                          }))
                        }
                        className={`min-w-0 rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                          selected
                            ? statusStyles[status]
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden w-full min-w-0 overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Admission #
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {student.firstName} {student.lastName}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {student.admissionNumber}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1.5">
                        {STATUSES.map((status) => {
                          const selected = statuses[student.id] === status;

                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setStatuses((current) => ({
                                  ...current,
                                  [student.id]: status,
                                }))
                              }
                              className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                                selected
                                  ? statusStyles[status]
                                  : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex min-w-0 flex-col gap-4 border-t border-slate-200 bg-slate-50 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid w-full grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4 lg:w-auto">
              <span className="rounded-lg bg-white px-3 py-2 text-center">
                Present: {countStatus("Present")}
              </span>

              <span className="rounded-lg bg-white px-3 py-2 text-center">
                Absent: {countStatus("Absent")}
              </span>

              <span className="rounded-lg bg-white px-3 py-2 text-center">
                Late: {countStatus("Late")}
              </span>

              <span className="rounded-lg bg-white px-3 py-2 text-center">
                Excused: {countStatus("Excused")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void submit()}
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:px-6"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

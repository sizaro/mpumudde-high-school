import { useEffect, useMemo, useState } from "react";
import AttendanceService, {
  type AttendanceBulkRecordUpdateInput,
} from "../../../services/attendanceService";

const STATUSES = ["Present", "Absent", "Late", "Excused"] as const;
type AttendanceStatus = (typeof STATUSES)[number];

const SESSIONS_PER_PAGE = 20;
const STUDENTS_PER_PAGE = 30;

type SessionListItem = {
  id: string;
  date: string;
  classId?: string | null;
  teacherId?: string | null;
  schoolClass?: { id: string; name: string } | null;
  subject?: { id: string; name: string } | null;
  teacher?: { id: string; firstName?: string; lastName?: string } | null;
  _count?: { records?: number };
};

type SessionRecord = {
  id: string;
  status: AttendanceStatus;
  student?: {
    id: string;
    firstName?: string;
    lastName?: string;
    admissionNumber?: string;
  } | null;
};

type SessionDetails = {
  id: string;
  date: string;
  schoolClass?: { id: string; name: string } | null;
  subject?: { id: string; name: string } | null;
  teacher?: { id: string; firstName?: string; lastName?: string } | null;
  records?: SessionRecord[];
};

function teacherName(session: {
  teacher?: { firstName?: string; lastName?: string } | null;
}) {
  return (
    `${session.teacher?.firstName ?? ""} ${session.teacher?.lastName ?? ""}`.trim() ||
    "Unknown teacher"
  );
}

function statusClass(status: string) {
  if (status === "Present") return "bg-emerald-50 text-emerald-700";
  if (status === "Late") return "bg-amber-50 text-amber-700";
  if (status === "Excused") return "bg-blue-50 text-blue-700";
  return "bg-rose-50 text-rose-700";
}

function pageBounds(totalItems: number, page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const normalizedPage = Math.min(Math.max(1, page), totalPages);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;
  return { totalPages, normalizedPage, start, end };
}

export default function DirectorAttendancePage() {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionPage, setSessionPage] = useState(1);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [selectedSession, setSelectedSession] = useState<SessionDetails | null>(
    null,
  );

  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>("Present");
  const [drafts, setDrafts] = useState<Record<string, AttendanceStatus>>({});
  const [savingRecordId, setSavingRecordId] = useState("");
  const [savingBulk, setSavingBulk] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const data = (await AttendanceService.findAll()) as SessionListItem[];
      setSessions(data ?? []);
      setSessionPage(1);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? "Unable to load attendance sessions.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    setSessionPage(1);
  }, [classFilter, teacherFilter, sessionSearch]);

  useEffect(() => {
    setStudentPage(1);
  }, [studentSearch, statusFilter, selectedSessionId]);

  const classes = useMemo(() => {
    const map = new Map<string, string>();
    for (const session of sessions) {
      if (session.schoolClass?.id && session.schoolClass?.name) {
        map.set(session.schoolClass.id, session.schoolClass.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [sessions]);

  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    for (const session of sessions) {
      if (session.teacher?.id) {
        map.set(
          session.teacher.id,
          `${session.teacher.firstName ?? ""} ${session.teacher.lastName ?? ""}`.trim(),
        );
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const query = sessionSearch.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesFilters =
        (!classFilter ||
          session.classId === classFilter ||
          session.schoolClass?.id === classFilter) &&
        (!teacherFilter ||
          session.teacherId === teacherFilter ||
          session.teacher?.id === teacherFilter);

      if (!matchesFilters) return false;
      if (!query) return true;

      const sessionText = [
        session.schoolClass?.name ?? "",
        session.subject?.name ?? "",
        teacherName(session),
        session.date ? new Date(session.date).toLocaleString() : "",
      ]
        .join(" ")
        .toLowerCase();
      return sessionText.includes(query);
    });
  }, [sessions, classFilter, teacherFilter, sessionSearch]);

  const sessionPagination = pageBounds(
    filteredSessions.length,
    sessionPage,
    SESSIONS_PER_PAGE,
  );
  const visibleSessions = filteredSessions.slice(
    sessionPagination.start,
    sessionPagination.end,
  );

  const filteredRecords = useMemo(() => {
    if (!selectedSession) return [];
    const query = studentSearch.trim().toLowerCase();
    return (selectedSession.records ?? []).filter((record) => {
      const effectiveStatus = drafts[record.id] ?? record.status;
      const matchesStatus = !statusFilter || effectiveStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;

      const text = [
        record.student?.firstName ?? "",
        record.student?.lastName ?? "",
        record.student?.admissionNumber ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [selectedSession, drafts, studentSearch, statusFilter]);

  const studentPagination = pageBounds(
    filteredRecords.length,
    studentPage,
    STUDENTS_PER_PAGE,
  );
  const visibleRecords = filteredRecords.slice(
    studentPagination.start,
    studentPagination.end,
  );

  const changedRecordIds = useMemo(() => {
    if (!selectedSession) return [] as string[];
    return (selectedSession.records ?? [])
      .filter(
        (record) => drafts[record.id] && drafts[record.id] !== record.status,
      )
      .map((record) => record.id);
  }, [selectedSession, drafts]);

  async function openSession(sessionId: string) {
    setLoadingSession(true);
    setError("");
    setInfo("");
    try {
      const data = (await AttendanceService.findOne(
        sessionId,
      )) as SessionDetails;
      setSelectedSessionId(sessionId);
      setSelectedSession(data);
      setDrafts({});
      setStudentSearch("");
      setStatusFilter("");
      setStudentPage(1);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          "Unable to load this attendance session details.",
      );
    } finally {
      setLoadingSession(false);
    }
  }

  function closeSession() {
    setSelectedSessionId(null);
    setSelectedSession(null);
    setDrafts({});
    setInfo("");
    setError("");
  }

  async function saveRecord(sessionId: string, record: any) {
    const nextStatus = drafts[record.id];
    if (!nextStatus || nextStatus === record.status) return;

    setSavingRecordId(record.id);
    setError("");
    setInfo("");
    try {
      await AttendanceService.updateRecordStatus(
        sessionId,
        record.id,
        nextStatus,
      );
      setSelectedSession((current) =>
        !current
          ? current
          : {
              ...current,
              records: (current.records ?? []).map((item) =>
                item.id === record.id ? { ...item, status: nextStatus } : item,
              ),
            },
      );
      setDrafts((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setInfo("Attendance status updated.");
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? "Unable to update attendance record.",
      );
    } finally {
      setSavingRecordId("");
    }
  }

  async function saveAllChanges() {
    if (!selectedSession || changedRecordIds.length === 0) return;

    setSavingBulk(true);
    setError("");
    setInfo("");

    const updates = changedRecordIds.map((recordId) => {
      const status = drafts[recordId];
      return AttendanceService.updateRecordStatus(
        selectedSession.id,
        recordId,
        status,
      );
    });

    const settled = await Promise.allSettled(updates);
    const failed = settled.filter(
      (result) => result.status === "rejected",
    ).length;
    const succeeded = settled.length - failed;

    if (succeeded > 0) {
      try {
        const refreshed = (await AttendanceService.findOne(
          selectedSession.id,
        )) as SessionDetails;
        setSelectedSession(refreshed);
        setDrafts({});
      } catch {
        // Keep last known details if refresh fails; error message below handles visibility.
      }
    }

    if (failed > 0) {
      setError(
        `${succeeded} record(s) updated, ${failed} failed. Please retry failed edits.`,
      );
    } else {
      setInfo(`${succeeded} record(s) updated successfully.`);
    }

    setSavingBulk(false);
  }

  function applyBulkToVisible() {
    if (!visibleRecords.length) return;
    setDrafts((current) => {
      const next = { ...current };
      for (const record of visibleRecords) {
        next[record.id] = bulkStatus;
      }
      return next;
    });
  }

  function applyBulkToFiltered() {
    if (!filteredRecords.length) return;
    setDrafts((current) => {
      const next = { ...current };
      for (const record of filteredRecords) {
        next[record.id] = bulkStatus;
      }
      return next;
    });
  }

  function applyBulkToSession() {
    const all = selectedSession?.records ?? [];
    if (!all.length) return;
    setDrafts((current) => {
      const next = { ...current };
      for (const record of all) {
        next[record.id] = bulkStatus;
      }
      return next;
    });
  }

  function clearVisibleDrafts() {
    setDrafts((current) => {
      const next = { ...current };
      for (const record of visibleRecords) {
        delete next[record.id];
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="p-2 text-slate-600">Loading attendance sessions...</div>
    );
  }

  if (selectedSessionId) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              type="button"
              onClick={closeSession}
              className="mb-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              Back to Sessions
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {selectedSession?.schoolClass?.name ?? "Class"} ·{" "}
              {selectedSession?.subject?.name ?? "Subject"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Teacher: {teacherName(selectedSession ?? {})}
            </p>
            <p className="text-sm text-slate-500">
              Session time:{" "}
              {selectedSession?.date
                ? new Date(selectedSession.date).toLocaleString()
                : "—"}
            </p>
            <p className="text-sm text-slate-500">
              Total students in session:{" "}
              {(selectedSession?.records ?? []).length}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                selectedSessionId && void openSession(selectedSessionId)
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              disabled={loadingSession || savingBulk}
            >
              {loadingSession ? "Refreshing..." : "Refresh Session"}
            </button>
            <button
              type="button"
              onClick={() => void saveAllChanges()}
              disabled={savingBulk || changedRecordIds.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {savingBulk
                ? "Saving all..."
                : `Save all changes (${changedRecordIds.length})`}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {info}
          </p>
        ) : null}

        <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-5">
          <input
            type="search"
            value={studentSearch}
            onChange={(event) => setStudentSearch(event.target.value)}
            placeholder="Search student name or admission number"
            className="rounded-lg border px-3 py-2 lg:col-span-2"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 lg:col-span-2">
            <select
              value={bulkStatus}
              onChange={(event) =>
                setBulkStatus(event.target.value as AttendanceStatus)
              }
              className="rounded-lg border px-3 py-2"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyBulkToVisible}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Apply to page
            </button>
            <button
              type="button"
              onClick={applyBulkToFiltered}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Apply to filtered
            </button>
            <button
              type="button"
              onClick={applyBulkToSession}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Apply to entire session
            </button>
            <button
              type="button"
              onClick={clearVisibleDrafts}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Clear page edits
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[880px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Admission #</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">New status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No students match your filters.
                    </td>
                  </tr>
                ) : (
                  visibleRecords.map((record) => {
                    const selected = drafts[record.id] ?? record.status;
                    const changed = selected !== record.status;
                    return (
                      <tr key={record.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {record.student?.firstName} {record.student?.lastName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.student?.admissionNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(record.status)}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={selected}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [record.id]: event.target
                                  .value as AttendanceStatus,
                              }))
                            }
                            className="rounded-lg border px-2 py-1"
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              selectedSession &&
                              void saveRecord(selectedSession.id, record)
                            }
                            disabled={
                              savingRecordId === record.id ||
                              !changed ||
                              savingBulk
                            }
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            {savingRecordId === record.id
                              ? "Saving..."
                              : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              {filteredRecords.length === 0 ? 0 : studentPagination.start + 1}-
              {Math.min(filteredRecords.length, studentPagination.end)} of{" "}
              {filteredRecords.length} students
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setStudentPage((current) => Math.max(1, current - 1))
                }
                disabled={studentPagination.normalizedPage <= 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                Page {studentPagination.normalizedPage} of{" "}
                {studentPagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setStudentPage((current) =>
                    Math.min(studentPagination.totalPages, current + 1),
                  )
                }
                disabled={
                  studentPagination.normalizedPage >=
                  studentPagination.totalPages
                }
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Director view for all classes and teachers. You can correct any
          attendance record when needed.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {info}
        </p>
      )}

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-4">
        <select
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">All classes</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={teacherFilter}
          onChange={(event) => setTeacherFilter(event.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">All teachers</option>
          {teachers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={sessionSearch}
          onChange={(event) => setSessionSearch(event.target.value)}
          placeholder="Search class, subject, teacher"
          className="rounded-lg border px-3 py-2"
        />
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          disabled={loadingSession}
        >
          Refresh
        </button>
      </section>

      <section className="space-y-3">
        {filteredSessions.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No attendance sessions match these filters.
          </p>
        ) : (
          visibleSessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {session.schoolClass?.name ?? "Unknown class"} ·{" "}
                    {session.subject?.name ?? "Unknown subject"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Teacher: {teacherName(session)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Students recorded: {session._count?.records ?? 0}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-slate-500">
                    {session.date
                      ? new Date(session.date).toLocaleString()
                      : "—"}
                  </p>
                  <button
                    type="button"
                    onClick={() => void openSession(session.id)}
                    className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                    disabled={loadingSession}
                  >
                    {loadingSession ? "Opening..." : "Open Session Details"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {filteredSessions.length > 0 ? (
        <section className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {sessionPagination.start + 1}-
            {Math.min(filteredSessions.length, sessionPagination.end)} of{" "}
            {filteredSessions.length} sessions
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setSessionPage((current) => Math.max(1, current - 1))
              }
              disabled={sessionPagination.normalizedPage <= 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5">
              Page {sessionPagination.normalizedPage} of{" "}
              {sessionPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setSessionPage((current) =>
                  Math.min(sessionPagination.totalPages, current + 1),
                )
              }
              disabled={
                sessionPagination.normalizedPage >= sessionPagination.totalPages
              }
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

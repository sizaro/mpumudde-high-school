import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Eye,
  Lock,
  Mail,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Unlock,
  Users,
  XCircle,
} from "lucide-react";
import alumniService, {
  type DirectorAlumni,
} from "../../../services/alumniService";

type StatusFilter = "ALL" | "ACTIVE" | "LOCKED" | "ARCHIVED";

function getAlumniStatus(alumni: DirectorAlumni) {
  if (!alumni.isActive) {
    return "ARCHIVED";
  }

  if (alumni.lockedAt) {
    return "LOCKED";
  }

  return "ACTIVE";
}

function getStatusLabel(status: ReturnType<typeof getAlumniStatus>) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "LOCKED":
      return "Locked";
    case "ARCHIVED":
      return "Archived";
  }
}

function getStatusClasses(status: ReturnType<typeof getAlumniStatus>) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "LOCKED":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ARCHIVED":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getPrimaryContact(alumni: DirectorAlumni) {
  return (
    alumni.contacts.find(
      (contact) =>
        contact.isPrimary && contact.isActive && contact.kind === "EMAIL",
    ) ??
    alumni.contacts.find(
      (contact) => contact.isActive && contact.kind === "EMAIL",
    )
  );
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<DirectorAlumni[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await alumniService.getAlumni();

      setAlumni(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to load Alumni records.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAlumni();
  }, []);

  const filteredAlumni = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return alumni.filter((record) => {
      const status = getAlumniStatus(record);

      if (statusFilter !== "ALL" && status !== statusFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const primaryContact = getPrimaryContact(record);

      const searchableText = [
        record.fullName,
        record.email,
        record.whatsappNumber ?? "",
        record.studentPeriod ?? "",
        record.graduationYear?.toString() ?? "",
        primaryContact?.value ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [alumni, search, statusFilter]);

  const counts = useMemo(() => {
    let active = 0;
    let locked = 0;
    let archived = 0;

    for (const record of alumni) {
      const status = getAlumniStatus(record);

      if (status === "ACTIVE") {
        active++;
      } else if (status === "LOCKED") {
        locked++;
      } else {
        archived++;
      }
    }

    return {
      total: alumni.length,
      active,
      locked,
      archived,
    };
  }, [alumni]);

  const handleToggleLock = async (record: DirectorAlumni) => {
    if (!record.isActive) {
      return;
    }

    if (record.lockedAt) {
      const confirmed = window.confirm(`Unlock ${record.fullName}?`);

      if (!confirmed) {
        return;
      }

      try {
        setActionId(record.id);
        setError(null);

        const updated = await alumniService.updateAlumniStatus(record.id, {
          locked: false,
        });

        setAlumni((current) =>
          current.map((item) => (item.id === record.id ? updated : item)),
        );
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Unable to unlock this Alumni record.";

        setError(message);
      } finally {
        setActionId(null);
      }

      return;
    }

    const reason = window.prompt(`Why are you locking ${record.fullName}?`);

    if (reason === null) {
      return;
    }

    if (!reason.trim()) {
      setError("A reason is required when locking an Alumni record.");
      return;
    }

    try {
      setActionId(record.id);
      setError(null);

      const updated = await alumniService.updateAlumniStatus(record.id, {
        locked: true,
        reason: reason.trim(),
      });

      setAlumni((current) =>
        current.map((item) => (item.id === record.id ? updated : item)),
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to lock this Alumni record.";

      setError(message);
    } finally {
      setActionId(null);
    }
  };

  const handleArchive = async (record: DirectorAlumni) => {
    if (!record.isActive) {
      return;
    }

    const confirmed = window.confirm(
      `Archive ${record.fullName}? This will remove the Alumni from active communications.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(record.id);
      setError(null);

      await alumniService.archiveAlumni(record.id);

      setAlumni((current) =>
        current.map((item) =>
          item.id === record.id
            ? {
                ...item,
                isActive: false,
              }
            : item,
        ),
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to archive this Alumni record.";

      setError(message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Alumni</h1>

              <p className="text-sm text-gray-500">
                Manage the Mpumudde High School Alumni Community.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadAlumni()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            <p className="font-medium">Unable to complete the request</p>

            <p className="mt-1">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alumni</p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {counts.total}
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {counts.active}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Locked</p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {counts.locked}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <Lock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Archived</p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {counts.archived}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
              <Archive className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Alumni..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All"],
                ["ACTIVE", "Active"],
                ["LOCKED", "Locked"],
                ["ARCHIVED", "Archived"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Alumni Records</h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredAlumni.length} of {alumni.length} records
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading Alumni records...
            </div>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-gray-100 p-4 text-gray-500">
              <Users className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-medium text-gray-900">No Alumni found</h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {search || statusFilter !== "ALL"
                ? "Try changing your search or status filter."
                : "There are currently no Alumni records."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Alumni
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Graduation
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registered
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAlumni.map((record) => {
                  const status = getAlumniStatus(record);
                  const primaryContact = getPrimaryContact(record);

                  const isBusy = actionId === record.id;

                  return (
                    <tr key={record.id} className="transition hover:bg-gray-50">
                      {/* Alumni */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {record.profileImageUrl ? (
                            <img
                              src={record.profileImageUrl}
                              alt={record.fullName}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                              {record.fullName
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name.charAt(0))
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium text-gray-900">
                                {record.fullName}
                              </p>

                              {record.possibleStudentMatch && (
                                <span
                                  title="Possible match with an existing student"
                                  className="text-amber-500"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {record.studentPeriod ||
                                "Student period not provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 text-gray-400" />

                            <span className="max-w-52 truncate">
                              {primaryContact?.value ?? record.email}
                            </span>

                            {(primaryContact?.isVerified ??
                              record.primaryEmailVerified) && (
                              <span title="Verified email">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                              </span>
                            )}
                          </div>

                          {record.whatsappNumber && (
                            <p className="text-xs text-gray-500">
                              WhatsApp: {record.whatsappNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Graduation */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {record.graduationYear ?? "Not provided"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            status,
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>

                        {status === "LOCKED" && record.lockedReason && (
                          <p
                            className="mt-1 max-w-40 truncate text-xs text-gray-500"
                            title={record.lockedReason}
                          >
                            {record.lockedReason}
                          </p>
                        )}
                      </td>

                      {/* Registered */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatDate(record.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/director/alumni/${record.id}`}
                            title="View Alumni"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            to={`/director/alumni/${record.id}/edit`}
                            title="Edit Alumni"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {record.isActive && (
                            <button
                              type="button"
                              onClick={() => void handleToggleLock(record)}
                              disabled={isBusy}
                              title={
                                record.lockedAt
                                  ? "Unlock Alumni"
                                  : "Lock Alumni"
                              }
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {record.lockedAt ? (
                                <Unlock className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </button>
                          )}

                          {record.isActive && (
                            <button
                              type="button"
                              onClick={() => void handleArchive(record)}
                              disabled={isBusy}
                              title="Archive Alumni"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import parentService, {
  type ParentDashboardResponse,
} from "../../services/parentService";

export default function ParentDashboard() {
  const [data, setData] = useState<ParentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [profileForm, setProfileForm] = useState({
    phone: "",
    address: "",
    occupation: "",
    profilePhoto: "",
  });
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    void parentService
      .getDashboard()
      .then((result) => {
        setData(result);
        setSelectedStudentId(result.children?.[0]?.studentId ?? null);
        setProfileForm({
          phone: result.parent.phone ?? "",
          address: result.parent.address ?? "",
          occupation: result.parent.occupation ?? "",
          profilePhoto: result.parent.profilePhoto ?? "",
        });
      })
      .catch(() => setError("Unable to load parent dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const handleChildSelect = (studentId: string) => {
    setLoading(true);
    setError(null);
    void parentService
      .getDashboard(studentId)
      .then((result) => {
        setData(result);
        setSelectedStudentId(studentId);
        setProfileForm({
          phone: result.parent.phone ?? "",
          address: result.parent.address ?? "",
          occupation: result.parent.occupation ?? "",
          profilePhoto: result.parent.profilePhoto ?? "",
        });
      })
      .catch(() => setError("Unable to load parent dashboard data."))
      .finally(() => setLoading(false));
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus(null);
    setSavingProfile(true);

    try {
      const updated = await parentService.updateProfile({
        phone: profileForm.phone || null,
        address: profileForm.address || null,
        occupation: profileForm.occupation || null,
        profilePhoto: profileForm.profilePhoto || null,
      });

      setData((current) =>
        current
          ? {
              ...current,
              parent: {
                ...current.parent,
                phone: updated.phone,
                address: updated.address,
                occupation: updated.occupation,
                profilePhoto: updated.profilePhoto,
              },
            }
          : current,
      );
      setProfileStatus("Parent settings saved successfully.");
    } catch {
      setProfileStatus("Unable to save parent settings. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const selectedChild = useMemo(() => {
    if (!data) return null;
    return (
      data.children?.find((child) => child.studentId === selectedStudentId) ??
      data.children?.[0] ??
      null
    );
  }, [data, selectedStudentId]);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="mt-4 text-slate-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="mt-4 text-slate-600">No dashboard data is available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="mt-2 text-slate-600">
            A focused view of your children’s school information.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Parent profile</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-100">
                {data.parent.profilePhoto ? (
                  <img
                    src={data.parent.profilePhoto}
                    alt="Parent profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No photo
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {data.parent.firstName} {data.parent.lastName}
                </p>
                <p className="text-sm text-slate-500">Parent account</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-700">
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {data.parent.email ?? "Not provided"}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {data.parent.phone ?? "Not provided"}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {data.parent.address ?? "Not provided"}
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold">Account settings</p>
                <p className="mt-2">
                  Edit phone, address, occupation, and profile photo. Names and
                  email are read-only.
                </p>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    First name
                  </label>
                  <input
                    value={data.parent.firstName}
                    disabled
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Last name
                  </label>
                  <input
                    value={data.parent.lastName}
                    disabled
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Email
                  </label>
                  <input
                    value={data.parent.email ?? ""}
                    disabled
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Phone
                  </label>
                  <input
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Address
                  </label>
                  <input
                    value={profileForm.address}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Occupation
                  </label>
                  <input
                    value={profileForm.occupation}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        occupation: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Profile photo URL
                  </label>
                  <input
                    value={profileForm.profilePhoto}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        profilePhoto: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save parent settings"}
              </button>
              {profileStatus ? (
                <p className="text-sm text-slate-700">{profileStatus}</p>
              ) : null}
            </form>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Children overview</h2>
          <div className="mt-5 space-y-3">
            {data.children?.length === 0 ? (
              <p className="text-sm text-slate-500">
                No children are currently linked to this account.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.children?.map((child) => (
                    <button
                      key={child.studentId}
                      type="button"
                      onClick={() => handleChildSelect(child.studentId)}
                      className={`rounded-3xl border px-4 py-3 text-left transition ${child.studentId === selectedChild?.studentId ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"}`}
                    >
                      <p className="font-semibold">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {child.admissionNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {child.className ?? "No class"} •{" "}
                        {child.academicYear ?? "No year"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedChild && data.student ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Student profile</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.student.profile.firstName}{" "}
                    {data.student.profile.lastName}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Admission</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.student.profile.admissionNumber}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Class</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.student.profile.className ?? "Not assigned"}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Academic year</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.student.profile.academicYear ?? "Not assigned"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Attendance records</h2>
              <div className="mt-5 overflow-x-auto">
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
                    {data.student.attendance.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-sm text-slate-500">
                          No attendance records available.
                        </td>
                      </tr>
                    ) : (
                      data.student.attendance.map((record, index) => (
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

          <section className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Finance summary</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Paid amount</p>
                  <p className="mt-2 text-lg font-semibold">
                    UGX {data.student.finance.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Term fees</p>
                  <p className="mt-2 text-lg font-semibold">
                    UGX{" "}
                    {data.student.finance.payments
                      .reduce((sum, payment) => sum + payment.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Balance</p>
                  <p className="mt-2 text-lg font-semibold">
                    UGX{" "}
                    {Math.max(
                      0,
                      data.student.finance.payments.reduce(
                        (sum, payment) => sum + payment.amount,
                        0,
                      ) - data.student.finance.totalPaid,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Academic performance</h2>
              <p className="mt-4 text-sm text-slate-500">
                This section is prepared for future expansion and will show
                subject results, exam scores, and teacher comments.
              </p>
            </section>
          </section>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Select a child to see their attendance and finance details.
          </p>
        </div>
      )}
    </div>
  );
}

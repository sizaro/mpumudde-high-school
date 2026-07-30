import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeacherService.getMyProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8 text-red-500">Profile not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {[["Full Name", `${profile.firstName} ${profile.middleName ?? ""} ${profile.lastName}`], ["Gender", profile.gender], ["Date of Birth", profile.dateOfBirth?.slice(0,10)], ["Phone", profile.phone], ["Email", profile.email], ["Nationality", profile.nationality], ["Address", profile.address]].map(([k, v]) => (
            <div key={String(k)}><dt className="text-gray-500">{k}</dt><dd className="font-medium">{v ?? "—"}</dd></div>
          ))}
        </dl>
      </section>

      {profile.employment && (
        <section className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Employment</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[["Employee #", profile.employment.employeeNumber], ["Position", profile.employment.position], ["Department", profile.employment.department], ["Type", profile.employment.employmentType]].map(([k, v]) => (
              <div key={String(k)}><dt className="text-gray-500">{k}</dt><dd className="font-medium">{v ?? "—"}</dd></div>
            ))}
          </dl>
        </section>
      )}

      {(profile.qualifications ?? []).length > 0 && (
        <section className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Qualifications</h2>
          <div className="space-y-2">
            {profile.qualifications.map((q: any) => (
              <div key={q.id} className="border rounded p-3 text-sm">
                <p className="font-medium">{q.qualificationName} {q.qualificationType && `(${q.qualificationType})`}</p>
                <p className="text-gray-500">{q.institution} {q.yearCompleted && `· ${q.yearCompleted}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function MyMedical() {
  const [medical, setMedical] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeacherService.getMyProfile().then((p) => setMedical(p.medicalInformation ?? null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const fields = [
    ["Blood Group", medical?.bloodGroup],
    ["Allergies", medical?.allergies],
    ["Medical Conditions", medical?.medicalConditions],
    ["Medication", medical?.medication],
    ["Disability", medical?.disability],
    ["Notes", medical?.notes],
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Medical Information</h1>
      {!medical ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-500">No medical information on file. Contact your director to update.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-6">
          <dl className="grid grid-cols-2 gap-4">
            {fields.map(([label, value]) => (
              <div key={String(label)} className={label === "Notes" ? "col-span-2" : ""}>
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="font-medium mt-0.5">{value || "—"}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-gray-400 mt-4">This information is confidential and only visible to authorised staff.</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function TeacherOverview() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    TeacherService.getMyProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {profile?.firstName ?? "Teacher"}</h1>
      <p className="text-gray-500 mb-6">Here is your portal overview.</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Assigned Subjects", value: profile?.teachingAssignments ? new Set(profile.teachingAssignments.map((a: any) => a.subjectId)).size : "—" },
          { label: "Available Classes", value: "All active classes" },
        ].map((c) => (
          <div key={c.label} className="bg-white border rounded-lg p-5">
            <p className="text-3xl font-bold text-blue-600">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

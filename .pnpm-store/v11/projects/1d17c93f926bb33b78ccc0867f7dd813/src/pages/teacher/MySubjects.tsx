import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function MySubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeacherService.getMySubjects().then(setSubjects).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Subjects</h1>
      {subjects.length === 0 ? (
        <p className="text-gray-500">No subjects assigned yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {subjects.map((s) => (
            <div key={s.id} className="bg-white border rounded-lg p-5">
              <h2 className="font-semibold text-lg">{s.name}</h2>
              {s.code && <p className="text-sm text-gray-500">{s.code}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

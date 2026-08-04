import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherService from "../../services/teacherService";

export default function MyClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    TeacherService.getMyClasses().then(setClasses).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      {classes.length === 0 ? (
        <p className="text-gray-500">No classes assigned yet. Contact your director.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {classes.map((c) => (
            <div key={c.id} className="bg-white border rounded-lg p-5 hover:shadow cursor-pointer" onClick={() => navigate(`/teacher/attendance/take?classId=${c.id}`)}>
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p className="text-sm text-blue-600 mt-2">Take Attendance →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

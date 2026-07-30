import { useEffect, useState } from "react";
import AttendanceService from "../../services/attendanceService";

export default function AttendanceHistory() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    AttendanceService.findMine().then(setSessions).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No attendance sessions recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white border rounded-lg overflow-hidden">
              <button className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 text-left" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div>
                  <span className="font-medium">{s.schoolClass?.name}</span>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-gray-600">{s.subject?.name}</span>
                </div>
                <div className="text-sm text-gray-500">{new Date(s.date).toLocaleDateString()}</div>
              </button>
              {expanded === s.id && (
                <div className="border-t px-5 py-3">
                  <table className="min-w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left py-2">Student</th><th className="text-left py-2">Admission #</th><th className="text-left py-2">Status</th></tr></thead>
                    <tbody>
                      {s.records.map((r: any) => (
                        <tr key={r.id} className="border-b">
                          <td className="py-2">{r.student?.firstName} {r.student?.lastName}</td>
                          <td className="py-2 text-gray-500">{r.student?.admissionNumber}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${r.status === "Present" ? "bg-green-100 text-green-700" : r.status === "Absent" ? "bg-red-100 text-red-700" : r.status === "Late" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

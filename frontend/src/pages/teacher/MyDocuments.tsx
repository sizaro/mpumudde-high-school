import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function MyDocuments() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeacherService.getMyProfile().then((p) => {
      return TeacherService.getDocuments(p.id);
    }).then(setDocs).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      {docs.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-500">No documents on file. Your director will upload them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{d.title ?? d.originalFileName}</p>
                <p className="text-sm text-gray-500">{d.documentCategory?.name} · {new Date(d.createdAt).toLocaleDateString()}</p>
                {d.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
              </div>
              <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherService from "../../../services/teacherService";
import api from "../../../api/axios";

export default function TeacherDocuments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [catId, setCatId] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    TeacherService.getDocuments(id).then(setDocs);
    api.get("/document-categories?entityType=TEACHER").then((r) => setCategories(r.data));
  }, [id]);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !catId || !id) return;
    setUploading(true); setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const { data: uploaded } = await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      const doc = await TeacherService.addDocument(id, {
        documentCategoryId: catId,
        originalFileName: file.name,
        fileUrl: uploaded.url,
        title: title || file.name,
        fileExtension: uploaded.fileExtension,
        mimeType: uploaded.mimeType,
        fileSize: uploaded.fileSize,
      });
      setDocs((prev) => [doc, ...prev]);
      setCatId(""); setTitle("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) { setError(e?.response?.data?.message ?? "Upload failed"); }
    finally { setUploading(false); }
  }

  async function remove(docId: string) {
    if (!id) return;
    await TeacherService.removeDocument(id, docId);
    setDocs((prev) => prev.filter((d) => d.id !== docId));
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/director/teachers/${id}`)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold">Documents</h1>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Upload Document</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={catId} onChange={(e) => setCatId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. National ID Front" className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, JPG, PNG — max 10MB)</label>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="w-full border border-gray-300 rounded px-3 py-2" /></div>
        </div>
        <button onClick={upload} disabled={!catId || uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{uploading ? "Uploading..." : "Upload"}</button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Uploaded Documents ({docs.length})</h2>
        {docs.length === 0 ? <p className="text-gray-500 text-sm">No documents uploaded yet.</p> : (
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{d.title ?? d.originalFileName}</p>
                  <p className="text-xs text-gray-500">{d.documentCategory?.name} · {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                  <button onClick={() => remove(d.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

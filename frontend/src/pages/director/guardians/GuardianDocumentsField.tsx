import { useRef, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import PhotoCapture from '../../../components/forms/PhotoCapture';
import type { GuardianDocumentCategory } from '../../../services/parentService';

export type PendingGuardianDocument = {
  localId: string;
  documentCategoryId: string;
  categoryName: string;
  dataUrl: string;
  originalFileName: string;
  mimeType: string;
};

export default function GuardianDocumentsField({ categories, documents, onChange }: {
  categories: GuardianDocumentCategory[];
  documents: PendingGuardianDocument[];
  onChange: (documents: PendingGuardianDocument[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [categoryId, setCategoryId] = useState('');
  const [captured, setCaptured] = useState('');
  const category = categories.find((item) => item.id === categoryId);
  const addData = (dataUrl: string, fileName: string, mimeType: string) => {
    if (!category) return;
    onChange([...documents, { localId: crypto.randomUUID(), documentCategoryId: category.id, categoryName: category.name, dataUrl, originalFileName: fileName, mimeType }]);
    setCaptured('');
  };

  return <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div><h2 className="text-lg font-semibold">Supporting documents</h2><p className="mt-1 text-sm text-slate-500">Upload a PDF or image, or photograph the guardian’s document and review it before adding.</p></div>
    <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="w-full rounded-xl border px-4 py-3"><option value="">Select document type</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
    <div className="flex flex-wrap gap-2"><button type="button" disabled={!categoryId} onClick={() => inputRef.current?.click()} className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 disabled:opacity-50">Choose document file</button></div>
    <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file || !category) return; const reader = new FileReader(); reader.onload = () => addData(String(reader.result), file.name, file.type); reader.readAsDataURL(file); event.target.value = ''; }} />
    {categoryId && <div><PhotoCapture label="Guardian document photo" value={captured} onChange={setCaptured} facingMode="environment" />{captured && <button type="button" onClick={() => addData(captured, `guardian-document-${Date.now()}.jpg`, 'image/jpeg')} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Add photographed document</button>}</div>}
    <div className="space-y-2">{documents.map((document) => <div key={document.localId} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="shrink-0 text-blue-600" /><div className="min-w-0"><p className="font-semibold">{document.categoryName}</p><p className="truncate text-sm text-slate-500">{document.originalFileName}</p></div></div><div className="flex gap-3"><a href={document.dataUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700">Preview</a><button type="button" onClick={() => onChange(documents.filter((item) => item.localId !== document.localId))} className="text-red-700"><Trash2 size={17} /></button></div></div>)}</div>
  </section>;
}

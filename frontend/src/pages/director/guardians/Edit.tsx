import { useEffect, useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ParentService, { type Guardian, type GuardianDocumentInput } from '../../../services/parentService';
import StudentService from '../../../services/studentService';
import GuardianProfileForm, { guardianToForm, type GuardianFormValues } from './GuardianProfileForm';
import StudentLinksEditor, { type GuardianStudentLinkDraft } from './StudentLinksEditor';
import GuardianDocumentsField, { type PendingGuardianDocument } from './GuardianDocumentsField';

async function uploadDataUrl(dataUrl: string, fileName: string, mimeType?: string) {
  const blob = await (await fetch(dataUrl)).blob(); const body = new FormData();
  body.append('file', new File([blob], fileName, { type: mimeType || blob.type || 'application/octet-stream' }));
  return StudentService.uploadPhoto(body);
}

export default function EditGuardianPage() {
  const { id = '' } = useParams(); const navigate = useNavigate();
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [students, setStudents] = useState<any[]>([]); const [categories, setCategories] = useState<any[]>([]);
  const [links, setLinks] = useState<GuardianStudentLinkDraft[]>([]); const [newDocuments, setNewDocuments] = useState<PendingGuardianDocument[]>([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([ParentService.getGuardian(id), StudentService.getStudents(), ParentService.getGuardianDocumentCategories()])
      .then(([guardianData, studentData, categoryData]) => {
        setGuardian(guardianData); setStudents(studentData); setCategories(categoryData);
        setLinks(guardianData.students.filter((link) => link.isActive).map((link) => ({ studentId: link.student.id, relationship: link.relationship || 'Guardian', isPrimary: link.isPrimary })));
      }).catch(() => setError('Unable to load guardian information.'));
  }, [id]);

  const save = async (values: GuardianFormValues) => {
    if (links.length === 0) { setError('A guardian must remain linked to at least one student. Link another student or archive the guardian instead.'); return; }
    setBusy(true); setError('');
    try {
      const profilePhoto = values.profilePhoto.startsWith('data:') ? (await uploadDataUrl(values.profilePhoto, `guardian-${Date.now()}.jpg`, 'image/jpeg')).url : values.profilePhoto || undefined;
      await ParentService.updateGuardianComplete(id, { ...values, profilePhoto, students: links });
      for (const documentId of removedDocumentIds) await ParentService.removeGuardianDocument(id, documentId);
      for (const document of newDocuments) {
        const uploaded = await uploadDataUrl(document.dataUrl, document.originalFileName, document.mimeType);
        const payload: GuardianDocumentInput = { documentCategoryId: document.documentCategoryId, originalFileName: uploaded.originalName || document.originalFileName, fileUrl: uploaded.url, title: document.categoryName, mimeType: uploaded.mimeType || document.mimeType, fileExtension: uploaded.fileExtension, fileSize: uploaded.fileSize };
        await ParentService.addGuardianDocument(id, payload);
      }
      navigate(`/director/guardians/${id}`);
    } catch (exception: any) {
      const message = exception.response?.data?.message;
      setError(Array.isArray(message) ? message.join(' ') : message || 'Unable to update guardian.');
    } finally { setBusy(false); }
  };

  if (!guardian) return <p className="text-slate-500">{error || 'Loading guardian…'}</p>;
  const visibleDocuments = guardian.documents.filter((document) => !removedDocumentIds.includes(document.id));
  const inactiveLinks = guardian.students.filter((link) => !link.isActive);

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Edit guardian</h1><p className="mt-2 text-sm text-slate-500">Update the profile, active student relationships and supporting evidence.</p></div><Link to={`/director/guardians/${id}`} className="rounded-2xl border px-4 py-2 text-sm">Cancel</Link></div>
    {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
    <GuardianProfileForm initial={guardianToForm(guardian)} submitLabel="Save guardian and relationships" busy={busy} onSubmit={save}>
      <StudentLinksEditor students={students} links={links} onChange={setLinks} />
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="text-lg font-semibold">Saved supporting documents</h2><p className="mt-1 text-sm text-slate-500">Removed documents are deactivated when you save.</p></div>{visibleDocuments.length === 0 ? <p className="text-sm text-slate-500">No saved documents.</p> : visibleDocuments.map((document) => <div key={document.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="text-blue-600" /><div className="min-w-0"><p className="font-semibold">{document.documentCategory.name}</p><p className="truncate text-sm text-slate-500">{document.originalFileName}</p></div></div><div className="flex gap-3"><a href={document.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700">View</a><button type="button" onClick={() => setRemovedDocumentIds((current) => [...current, document.id])} className="text-red-700"><Trash2 size={17} /></button></div></div>)}</section>
      <GuardianDocumentsField categories={categories} documents={newDocuments} onChange={setNewDocuments} />
      {inactiveLinks.length > 0 && <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5"><h2 className="font-semibold">Previous student relationships</h2><div className="mt-3 space-y-2">{inactiveLinks.map((link) => <p key={link.id} className="text-sm text-slate-600">{link.student.firstName} {link.student.lastName} · {link.relationship || 'Guardian'} · Unlinked {link.unlinkedAt ? new Date(link.unlinkedAt).toLocaleDateString() : 'previously'}</p>)}</div></section>}
    </GuardianProfileForm>
  </div>;
}

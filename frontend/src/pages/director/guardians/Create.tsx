import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParentService, { type GuardianDocumentInput } from '../../../services/parentService';
import StudentService from '../../../services/studentService';
import GuardianProfileForm, { type GuardianFormValues } from './GuardianProfileForm';
import StudentLinksEditor, { type GuardianStudentLinkDraft } from './StudentLinksEditor';
import GuardianDocumentsField, { type PendingGuardianDocument } from './GuardianDocumentsField';

async function uploadDataUrl(dataUrl: string, fileName: string, mimeType?: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const body = new FormData();
  body.append('file', new File([blob], fileName, { type: mimeType || blob.type || 'application/octet-stream' }));
  return StudentService.uploadPhoto(body);
}

export default function CreateGuardianPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [links, setLinks] = useState<GuardianStudentLinkDraft[]>([]);
  const [documents, setDocuments] = useState<PendingGuardianDocument[]>([]);
  const [createLoginAccount, setCreateLoginAccount] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; email?: string; password?: string } | null>(null);

  useEffect(() => {
    Promise.all([StudentService.getStudents(), ParentService.getGuardianDocumentCategories()])
      .then(([studentData, categoryData]) => { setStudents(studentData); setCategories(categoryData); })
      .catch(() => setError('Unable to load students or guardian document categories.'));
  }, []);

  const submit = async (values: GuardianFormValues) => {
    if (links.length === 0) { setError('Link at least one student before registering the guardian.'); return; }
    if (documents.length === 0) { setError('Add at least one supporting identity document.'); return; }
    setBusy(true); setError('');
    try {
      const profilePhoto = values.profilePhoto.startsWith('data:')
        ? (await uploadDataUrl(values.profilePhoto, `guardian-${Date.now()}.jpg`, 'image/jpeg')).url
        : values.profilePhoto || undefined;
      const uploadedDocuments: GuardianDocumentInput[] = [];
      for (const document of documents) {
        const uploaded = await uploadDataUrl(document.dataUrl, document.originalFileName, document.mimeType);
        uploadedDocuments.push({
          documentCategoryId: document.documentCategoryId,
          originalFileName: uploaded.originalName || document.originalFileName,
          fileUrl: uploaded.url,
          title: document.categoryName,
          mimeType: uploaded.mimeType || document.mimeType,
          fileExtension: uploaded.fileExtension,
          fileSize: uploaded.fileSize,
        });
      }
      const response = await ParentService.createGuardian({
        ...values, profilePhoto, students: links, documents: uploadedDocuments,
        createLoginAccount, loginEmail: createLoginAccount ? loginEmail || undefined : undefined,
      });
      setResult({ id: response.parent.id, email: response.credentials?.email, password: response.temporaryPassword });
    } catch (exception: any) {
      const message = exception.response?.data?.message;
      setError(Array.isArray(message) ? message.join(' ') : message || 'Unable to create guardian.');
    } finally { setBusy(false); }
  };

  if (result) return <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
    <h1 className="text-2xl font-bold text-emerald-950">Guardian registered successfully</h1>
    {result.password ? <><p className="mt-2 text-emerald-800">Give these portal credentials to the guardian once. The password cannot be viewed again.</p><dl className="mt-5 space-y-3 rounded-2xl bg-white p-5"><div><dt className="text-sm text-slate-500">Login email</dt><dd className="font-semibold">{result.email}</dd></div><div><dt className="text-sm text-slate-500">Temporary password</dt><dd className="font-mono text-lg font-semibold">{result.password}</dd></div></dl></> : <p className="mt-2 text-emerald-800">The guardian was created without portal access. It can be created from Guardian Details.</p>}
    <div className="mt-6 flex gap-3"><button onClick={() => navigate(`/director/guardians/${result.id}`)} className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">View guardian</button><Link to="/director/guardians" className="rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-900">All guardians</Link></div>
  </div>;

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Register guardian</h1><p className="mt-2 text-sm text-slate-500">Record the guardian, supporting evidence, linked children and portal access together.</p></div><Link to="/director/guardians" className="rounded-2xl border px-4 py-2 text-sm">Cancel</Link></div>
    {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <GuardianProfileForm submitLabel="Register guardian and relationships" busy={busy} onSubmit={submit}>
      <StudentLinksEditor students={students} links={links} onChange={setLinks} />
      <GuardianDocumentsField categories={categories} documents={documents} onChange={setDocuments} />
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Portal account</h2><label className="mt-4 flex items-center gap-3 font-medium"><input type="checkbox" checked={createLoginAccount} onChange={(event) => setCreateLoginAccount(event.target.checked)} />Create parent portal account</label>{createLoginAccount && <label className="mt-4 block text-sm font-medium text-slate-700">Preferred login email <span className="font-normal text-slate-500">(optional)</span><input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="Leave blank to generate an @mhs.com login" className="mt-2 w-full rounded-2xl border px-4 py-3" /></label>}</section>
      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5"><h2 className="font-semibold text-blue-950">Registration review</h2><p className="mt-2 text-sm text-blue-800">{links.length} linked student{links.length === 1 ? '' : 's'} · {documents.length} supporting document{documents.length === 1 ? '' : 's'} · Portal access {createLoginAccount ? 'will be created' : 'will not be created'}.</p></section>
    </GuardianProfileForm>
  </div>;
}

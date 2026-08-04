import { useEffect, useState } from 'react';
import api from '../../../../api/axios';

export default function PaymentProofViewer({ url, fileName }: { url?: string | null; fileName?: string | null }) {
  const [previewUrl, setPreviewUrl] = useState(''); const [contentType, setContentType] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!url) return;
    let objectUrl = ''; let cancelled = false; setLoading(true); setError('');
    api.get('/upload/view', { params: { url, fileName: fileName || 'payment-proof' }, responseType: 'blob' })
      .then((response) => { if (cancelled) return; const blob = response.data as Blob; objectUrl = URL.createObjectURL(blob); setPreviewUrl(objectUrl); setContentType(blob.type || String(response.headers['content-type'] || '')); })
      .catch(() => setError('The attached proof could not be displayed.'))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url, fileName]);
  if (!url) return <p className="text-sm text-slate-500">No proof was attached.</p>;
  const isImage = contentType.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(fileName || '');
  const isPdf = contentType.includes('pdf') || /\.pdf$/i.test(fileName || '');
  return <section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="font-semibold text-slate-900">Payment proof</h4><p className="text-xs text-slate-500">{fileName || 'Attached evidence'}</p></div>{previewUrl && <button type="button" onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')} className="rounded-xl border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-700">Open full size</button>}</div>{loading && <p className="mt-4 text-sm text-slate-500">Loading proof…</p>}{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{previewUrl && isImage && <a href={previewUrl} target="_blank" rel="noreferrer"><img src={previewUrl} alt="Payment proof" className="mt-4 max-h-[70vh] w-full cursor-zoom-in rounded-xl bg-slate-50 object-contain" /></a>}{previewUrl && isPdf && <iframe src={previewUrl} title="Payment proof PDF" className="mt-4 h-[70vh] w-full rounded-xl border border-slate-200" />}{previewUrl && !isImage && !isPdf && <p className="mt-4 text-sm text-slate-600">Use Open full size to view this attachment.</p>}</section>;
}

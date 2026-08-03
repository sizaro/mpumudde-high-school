export default function PaymentProofViewer({
  url,
  fileName,
}: {
  url?: string | null;
  fileName?: string | null;
}) {
  if (!url) {
    return <p className="text-sm text-slate-500">No proof was attached.</p>;
  }
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const viewUrl = `${apiBase}/upload/view?url=${encodeURIComponent(url)}&fileName=${encodeURIComponent(fileName || "payment-proof")}`;
  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(fileName || "");
  const isPdf = /\.pdf$/i.test(fileName || "");

  return <section className="rounded-2xl border border-slate-200 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h4 className="font-semibold text-slate-900">Payment proof</h4><p className="text-xs text-slate-500">{fileName || "Attached evidence"}</p></div>
      <a href={viewUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-xl border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50">Open proof in new tab</a>
    </div>
    {isImage && <img src={viewUrl} alt="Payment proof" className="mt-4 max-h-96 w-full rounded-xl bg-slate-50 object-contain"/>}
    {isPdf && <iframe src={viewUrl} title="Payment proof PDF" className="mt-4 h-96 w-full rounded-xl border border-slate-200"/>}
  </section>;
}

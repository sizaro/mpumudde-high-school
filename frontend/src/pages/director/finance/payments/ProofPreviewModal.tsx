import { X } from "lucide-react";
import PaymentProofViewer from "./PaymentProofViewer";

export type ProofPreview = { url: string; fileName?: string | null };

export default function ProofPreviewModal({ proof, onClose }: { proof: ProofPreview | null; onClose: () => void }) {
  if (!proof) return null;
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Payment proof preview">
    <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-slate-900">Payment proof</h2><p className="text-sm text-slate-500">Preview the receipt or supporting document without downloading an unnamed file.</p></div><button type="button" onClick={onClose} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200" aria-label="Close payment proof"><X size={20} /></button></div>
      <PaymentProofViewer url={proof.url} fileName={proof.fileName} />
    </div>
  </div>;
}

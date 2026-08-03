import type { ReactNode } from "react";
import { X } from "lucide-react";

export default function PaymentModal({ title, onClose, children, width = "max-w-5xl" }: { title: string; onClose: () => void; children: ReactNode; width?: string }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6" role="dialog" aria-modal="true"><div className={`max-h-[calc(100vh-1.5rem)] w-full ${width} overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl`}><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><button type="button" onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div><div className="p-4 sm:p-6">{children}</div></div></div>;
}

import { useSearchParams } from "react-router-dom";
import FeeStructures from "../fee-structures";
import FeeTypes from "../fee-types";

export default function FeeSetup() {
  const [params, setParams] = useSearchParams();
  const section = params.get("feeSection") === "structures" ? "structures" : "types";
  const select = (next: "types" | "structures") => setParams((current) => { const updated = new URLSearchParams(current); updated.set("feeSection", next); return updated; }, { replace: true });
  return <div className="mt-8 min-w-0 space-y-6"><div className="flex gap-2 border-b border-slate-200 pb-3"><button type="button" onClick={() => select("types")} className={`rounded-full px-4 py-2 text-sm font-semibold ${section === "types" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Fee Types</button><button type="button" onClick={() => select("structures")} className={`rounded-full px-4 py-2 text-sm font-semibold ${section === "structures" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Fee Structures</button></div>{section === "types" ? <FeeTypes/> : <FeeStructures/>}</div>;
}

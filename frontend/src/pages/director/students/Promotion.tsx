import { useEffect, useMemo, useState } from "react";
import StudentService from "../../../services/studentService";
import SetupService, { type AcademicYear, type AcademicYearClass, type Term } from "../../../services/setupService";

const movementStatuses = ["PROMOTED", "REPEATED", "TRANSFERRED", "WITHDRAWN", "COMPLETED"];

export default function StudentPromotion() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [sourceYearId, setSourceYearId] = useState("");
  const [sourceOfferings, setSourceOfferings] = useState<AcademicYearClass[]>([]);
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetYearId, setTargetYearId] = useState("");
  const [targetOfferings, setTargetOfferings] = useState<AcademicYearClass[]>([]);
  const [targetClassId, setTargetClassId] = useState("");
  const [targetTermId, setTargetTermId] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { Promise.all([SetupService.getAcademicYears(), SetupService.getTerms()]).then(([yearData, termData]) => { setYears(yearData); setTerms(termData); const active = yearData.find((item) => item.status === "ACTIVE"); const previous = yearData.find((item) => item.status === "COMPLETED") ?? active; if (previous) setSourceYearId(previous.id); const next = yearData.find((item) => item.status === "UPCOMING"); if (next) setTargetYearId(next.id); }); }, []);
  useEffect(() => { setSourceClassId(""); setCandidates([]); if (sourceYearId) SetupService.getAcademicYearClasses(sourceYearId).then(setSourceOfferings); }, [sourceYearId]);
  useEffect(() => { setTargetClassId(""); if (targetYearId) SetupService.getAcademicYearClasses(targetYearId).then(setTargetOfferings); }, [targetYearId]);
  useEffect(() => { setTargetTermId(terms.find((item) => item.academicYearId === targetYearId && item.name === "Term 1")?.id ?? ""); }, [targetYearId, terms]);
  useEffect(() => { if (!sourceYearId || !sourceClassId) return setCandidates([]); StudentService.getPromotionCandidates(sourceYearId, sourceClassId).then((items) => { setCandidates(items); setDecisions(Object.fromEntries(items.map((item: any) => [item.studentId, "PROMOTED"]))); }); }, [sourceYearId, sourceClassId]);
  const needsDestination = useMemo(() => candidates.some((item) => ["PROMOTED", "REPEATED"].includes(decisions[item.studentId])), [candidates, decisions]);

  async function submit() {
    if (!candidates.length || (needsDestination && (!targetYearId || !targetClassId))) return;
    setSaving(true); setMessage("");
    try {
      await StudentService.processPromotion({ sourceAcademicYearId: sourceYearId, sourceClassId, targetAcademicYearId: targetYearId || undefined, targetClassId: targetClassId || undefined, targetTermId: targetTermId || undefined, decisions: candidates.map((item) => ({ studentId: item.studentId, status: decisions[item.studentId], studentCategoryId: item.studentCategoryId })) });
      setMessage(`${candidates.length} student movement records were saved. Previous enrollment and finance history was preserved.`); setCandidates([]); setSourceClassId("");
    } catch (reason: any) { setMessage(reason?.response?.data?.message ?? "Unable to complete the promotion process."); }
    finally { setSaving(false); }
  }

  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Student promotion and movement</h1><p className="mt-2 text-sm text-slate-500">Close the current enrollment and create the next one without registering a student again.</p></div>{message && <div className="rounded-2xl border bg-slate-50 p-4 text-sm">{message}</div>}
    <div className="grid gap-4 rounded-3xl border p-5 md:grid-cols-2"><label className="text-sm font-medium">From academic year<select value={sourceYearId} onChange={(e) => setSourceYearId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select year</option>{years.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.status}</option>)}</select></label><label className="text-sm font-medium">From class<select value={sourceClassId} onChange={(e) => setSourceClassId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select class</option>{sourceOfferings.map((item) => <option key={item.id} value={item.classId}>{item.schoolClass.name}</option>)}</select></label><label className="text-sm font-medium">Destination academic year<select value={targetYearId} onChange={(e) => setTargetYearId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select year</option>{years.filter((item) => item.id !== sourceYearId).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.status}</option>)}</select></label><label className="text-sm font-medium">Destination class<select value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select class</option>{targetOfferings.map((item) => <option key={item.id} value={item.classId}>{item.schoolClass.name}</option>)}</select></label><label className="text-sm font-medium">Starting term<select value={targetTermId} onChange={(e) => setTargetTermId(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">No starting term yet</option>{terms.filter((item) => item.academicYearId === targetYearId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
    <div className="overflow-x-auto rounded-3xl border"><table className="min-w-[720px] w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left"><th className="px-4 py-3">Student</th><th>Admission number</th><th>Category</th><th>Decision</th></tr></thead><tbody>{candidates.map((item) => <tr key={item.id} className="border-b"><td className="px-4 py-3 font-medium">{item.student.firstName} {item.student.lastName}</td><td>{item.student.admissionNumber}</td><td>{item.studentCategory?.name ?? "—"}</td><td><select value={decisions[item.studentId] ?? "PROMOTED"} onChange={(e) => setDecisions((current) => ({ ...current, [item.studentId]: e.target.value }))} className="rounded-lg border p-2">{movementStatuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}{!candidates.length && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Choose a source year and class to review actively enrolled students.</td></tr>}</tbody></table></div>
    <button onClick={submit} disabled={saving || !candidates.length || (needsDestination && (!targetYearId || !targetClassId))} className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving movements…" : "Save student movements"}</button>
  </div>;
}

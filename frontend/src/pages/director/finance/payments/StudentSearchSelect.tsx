import { useEffect, useRef, useState } from "react";
import PaymentService, { type PaymentStudent } from "../../../../services/paymentService";

type Props = { value: string; selectedStudent: PaymentStudent | null; onChange: (student: PaymentStudent | null) => void };
const studentLabel = (student: PaymentStudent) => `${student.firstName} ${student.lastName} — ${student.admissionNumber}`;

export default function StudentSearchSelect({ value, selectedStudent, onChange }: Props) {
  const [query, setQuery] = useState(selectedStudent ? studentLabel(selectedStudent) : "");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [results, setResults] = useState<PaymentStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => { void PaymentService.getOptions().then((options) => setClasses(options.classes)); }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      void PaymentService.searchStudents(value ? "" : query, classId).then(setResults).finally(() => setLoading(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, classId, value]);
  useEffect(() => { const close = (event: MouseEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);

  return <div ref={container} className="relative mt-2">
    <div className="grid gap-2 sm:grid-cols-[1fr_12rem]"><div className="relative"><input required role="combobox" aria-expanded={open} autoComplete="off" value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); if (value) onChange(null); setOpen(true); }} placeholder="Type name or admission number" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 outline-none focus:border-slate-400"/>{query && <button type="button" aria-label="Clear student" onClick={() => { setQuery(""); onChange(null); setOpen(true); }} className="absolute right-3 top-3 text-slate-500">×</button>}</div><select value={classId} onChange={(event) => { setClassId(event.target.value); setOpen(true); }} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"><option value="">All classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
    {open && <div role="listbox" className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">{loading ? <p className="p-4 text-center text-sm text-slate-500">Searching students...</p> : results.length ? results.map((student) => <button key={student.id} type="button" role="option" onClick={() => { onChange(student); setQuery(studentLabel(student)); setOpen(false); }} className="block w-full rounded-xl px-3 py-3 text-left hover:bg-slate-100"><span className="block text-sm font-semibold">{student.firstName} {student.lastName}</span><span className="text-xs text-slate-500">{student.admissionNumber}{student.schoolClass?.name ? ` · ${student.schoolClass.name}` : ""}{student.studentCategory?.name ? ` · ${student.studentCategory.name}` : ""}</span></button>) : <p className="p-4 text-center text-sm text-slate-500">No matching students.</p>}</div>}
  </div>;
}

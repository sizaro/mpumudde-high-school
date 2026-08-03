import type { AcademicYear, Term } from "../../../../services/setupService";

export type Period = "today" | "week" | "month" | "term" | "year" | "custom";

type Props = {
  value: Period;
  onChange: (value: Period) => void;
  academicYears: AcademicYear[];
  terms: Term[];
  academicYearId: string;
  termId: string;
  customStart: string;
  customEnd: string;
  onAcademicYearChange: (value: string) => void;
  onTermChange: (value: string) => void;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
};

const labels: Record<Period, string> = { today: "Today", week: "This Week", month: "This Month", term: "This Term", year: "This Year", custom: "Custom Range" };

export default function PeriodFilter(props: Props) {
  const filteredTerms = props.academicYearId ? props.terms.filter((term) => term.academicYearId === props.academicYearId) : props.terms;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {(Object.keys(labels) as Period[]).map((period) => <button key={period} type="button" onClick={() => props.onChange(period)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${props.value === period ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{labels[period]}</button>)}
      </div>
      {(props.value === "term" || props.value === "year") && <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-600">Academic year<select value={props.academicYearId} onChange={(event) => props.onAcademicYearChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"><option value="">All academic years</option>{props.academicYears.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select></label>
        {props.value === "term" && <label className="text-sm text-slate-600">Term<select value={props.termId} onChange={(event) => props.onTermChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"><option value="">Select term</option>{filteredTerms.map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}</select></label>}
      </div>}
      {props.value === "custom" && <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-600">From<input type="date" value={props.customStart} onChange={(event) => props.onCustomStartChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900" /></label>
        <label className="text-sm text-slate-600">To<input type="date" value={props.customEnd} onChange={(event) => props.onCustomEndChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900" /></label>
      </div>}
    </section>
  );
}

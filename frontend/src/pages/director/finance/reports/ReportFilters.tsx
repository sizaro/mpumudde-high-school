import type { FinanceReportFilters as Filters } from "../../../../services/financeReportService";
import type { AcademicYear, FeeType, SchoolClass, StudentCategory, Term } from "../../../../services/setupService";

type Props = { value: Filters; onChange: (value: Filters) => void; academicYears: AcademicYear[]; terms: Term[]; classes: SchoolClass[]; categories: StudentCategory[]; feeTypes: FeeType[]; expenseCategories: string[]; recordedByUsers: string[] };
const paymentMethods = ["CASH", "MOBILE_MONEY", "BANK_DEPOSIT", "BANK_TRANSFER", "CHEQUE", "CARD", "OTHER"];
const statuses = ["COMPLETED", "REVERSED", "PENDING", "REJECTED", "FULLY_PAID", "PARTIALLY_PAID", "NOT_PAID", "OVERPAID", "WAIVED", "DRAFT", "PENDING_APPROVAL", "APPROVED", "PAID", "CANCELLED"];
const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800";

export default function ReportFilters({ value, onChange, academicYears, terms, classes, categories, feeTypes, expenseCategories, recordedByUsers }: Props) {
  const set = (key: keyof Filters, next: string) => onChange({ ...value, [key]: next || undefined });
  const visibleTerms = value.academicYearId ? terms.filter((term) => term.academicYearId === value.academicYearId) : terms;
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <input value={value.search ?? ""} onChange={(event) => set("search", event.target.value)} className={inputClass} placeholder="Student, receipt, payee, reference..."/>
      <label className="grid gap-1 text-xs text-slate-500">From<input type="date" value={value.startDate ?? ""} onChange={(event) => set("startDate", event.target.value)} className={inputClass}/></label>
      <label className="grid gap-1 text-xs text-slate-500">To<input type="date" value={value.endDate ?? ""} onChange={(event) => set("endDate", event.target.value)} className={inputClass}/></label>
      <select value={value.academicYearId ?? ""} onChange={(event) => onChange({ ...value, academicYearId: event.target.value || undefined, termId: undefined })} className={inputClass}><option value="">All academic years</option>{academicYears.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={value.termId ?? ""} onChange={(event) => set("termId", event.target.value)} className={inputClass}><option value="">All terms</option>{visibleTerms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={value.classId ?? ""} onChange={(event) => set("classId", event.target.value)} className={inputClass}><option value="">All classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={value.studentCategoryId ?? ""} onChange={(event) => set("studentCategoryId", event.target.value)} className={inputClass}><option value="">All student categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={value.feeTypeId ?? ""} onChange={(event) => set("feeTypeId", event.target.value)} className={inputClass}><option value="">All fee types</option>{feeTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={value.paymentMethod ?? ""} onChange={(event) => set("paymentMethod", event.target.value)} className={inputClass}><option value="">All payment methods</option>{paymentMethods.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
      <select value={value.expenseCategory ?? ""} onChange={(event) => set("expenseCategory", event.target.value)} className={inputClass}><option value="">All expense categories</option>{expenseCategories.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
      <select value={value.status ?? ""} onChange={(event) => set("status", event.target.value)} className={inputClass}><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
      <select value={value.recordedBy ?? ""} onChange={(event) => set("recordedBy", event.target.value)} className={inputClass}><option value="">All recorded-by users</option>{recordedByUsers.map((item) => <option key={item} value={item}>{item}</option>)}</select>
    </div>
    {Object.values(value).some(Boolean) && <button type="button" onClick={() => onChange({})} className="mt-3 text-sm font-medium text-rose-600 hover:underline">Clear all report filters</button>}
  </section>;
}

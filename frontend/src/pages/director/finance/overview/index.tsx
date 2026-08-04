import { useEffect, useMemo, useState } from "react";
import FinanceOverviewService, { type FinanceSummary } from "../../../../services/financeOverviewService";
import SetupService, { type AcademicYear, type Term } from "../../../../services/setupService";
import CollectionByClass from "./CollectionByClass";
import CollectionByFeeType from "./CollectionByFeeType";
import CollectionProgress from "./CollectionProgress";
import FinanceSummaryCards from "./FinanceSummaryCards";
import IncomeExpenseChart from "./IncomeExpenseChart";
import OutstandingSummary from "./OutstandingSummary";
import PeriodFilter, { type Period } from "./PeriodFilter";
import RecentExpenses from "./RecentExpenses";
import RecentPayments from "./RecentPayments";
import OtherIncomePanel from "./OtherIncomePanel";
import { useAuth } from "../../../../context/AuthContext";

const iso = (date: Date) => date.toISOString();
const startOfDay = (date: Date) => { const value = new Date(date); value.setHours(0, 0, 0, 0); return value; };
const endOfDay = (date: Date) => { const value = new Date(date); value.setHours(23, 59, 59, 999); return value; };

export default function Overview() {
  const { hasRole, hasPermission } = useAuth();
  const [period, setPeriod] = useState<Period>("month");
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [termId, setTermId] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    void Promise.all([SetupService.getAcademicYears(), SetupService.getTerms()]).then(([years, loadedTerms]) => {
      setAcademicYears(years);
      setTerms(loadedTerms);
      const activeYear = years.find((year) => year.isActive) ?? years[0];
      if (activeYear) setAcademicYearId((current) => current || activeYear.id);
      const activeTerm = loadedTerms.find((term) => term.isActive && (!activeYear || term.academicYearId === activeYear.id)) ?? loadedTerms[0];
      if (activeTerm) setTermId((current) => current || activeTerm.id);
    }).catch(() => setError("Academic period options could not be loaded."));
  }, []);

  const params = useMemo(() => {
    const now = new Date();
    if (period === "today") return { start: iso(startOfDay(now)), end: iso(endOfDay(now)) };
    if (period === "week") { const start = startOfDay(now); const weekday = start.getDay() || 7; start.setDate(start.getDate() - weekday + 1); const end = endOfDay(start); end.setDate(end.getDate() + 6); return { start: iso(start), end: iso(end) }; }
    if (period === "month") { const start = new Date(now.getFullYear(), now.getMonth(), 1); const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)); return { start: iso(start), end: iso(end) }; }
    if (period === "custom") return { start: customStart ? iso(startOfDay(new Date(`${customStart}T00:00:00`))) : undefined, end: customEnd ? iso(endOfDay(new Date(`${customEnd}T00:00:00`))) : undefined };
    if (period === "term") { const term = terms.find((item) => item.id === termId); return { academicYearId: term?.academicYearId || academicYearId || undefined, termId: termId || undefined, start: term?.startDate ? iso(startOfDay(new Date(term.startDate))) : undefined, end: term?.endDate ? iso(endOfDay(new Date(term.endDate))) : undefined }; }
    const yearTerms = terms.filter((term) => term.academicYearId === academicYearId);
    const starts = yearTerms.flatMap((term) => term.startDate ? [new Date(term.startDate)] : []);
    const ends = yearTerms.flatMap((term) => term.endDate ? [new Date(term.endDate)] : []);
    const namedYear = Number(academicYears.find((year) => year.id === academicYearId)?.name);
    return { academicYearId: academicYearId || undefined, start: starts.length ? iso(startOfDay(new Date(Math.min(...starts.map(Number))))) : Number.isFinite(namedYear) ? iso(new Date(namedYear, 0, 1)) : undefined, end: ends.length ? iso(endOfDay(new Date(Math.max(...ends.map(Number))))) : Number.isFinite(namedYear) ? iso(endOfDay(new Date(namedYear, 11, 31))) : undefined };
  }, [period, customStart, customEnd, academicYearId, termId, academicYears, terms]);

  useEffect(() => {
    if (period === "custom" && (!customStart || !customEnd)) return;
    if (period === "term" && !termId) return;
    setLoading(true); setError("");
    void FinanceOverviewService.getSummary(params).then(setSummary).catch(() => setError("Unable to load the finance summary for this period.")).finally(() => setLoading(false));
  }, [params, period, customStart, customEnd, termId, refreshKey]);

  const changeYear = (value: string) => { setAcademicYearId(value); const nextTerm = terms.find((term) => term.academicYearId === value && term.isActive) ?? terms.find((term) => term.academicYearId === value); setTermId(nextTerm?.id ?? ""); };

  return <div className="mt-8 space-y-6">
    <PeriodFilter value={period} onChange={setPeriod} academicYears={academicYears} terms={terms} academicYearId={academicYearId} termId={termId} customStart={customStart} customEnd={customEnd} onAcademicYearChange={changeYear} onTermChange={setTermId} onCustomStartChange={setCustomStart} onCustomEndChange={setCustomEnd}/>
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    {loading && !summary ? <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading live finance summary...</div> : summary && <>
      <FinanceSummaryCards summary={summary}/>
      <div className="grid gap-6 xl:grid-cols-2"><CollectionProgress summary={summary}/><OutstandingSummary summary={summary}/></div>
      <IncomeExpenseChart series={summary.incomeExpenseSeries}/>
      <div className="grid gap-6 xl:grid-cols-2"><CollectionByClass rows={summary.collectionByClass}/><CollectionByFeeType rows={summary.collectionByFeeType}/></div>
      <div className="grid gap-6 2xl:grid-cols-2"><RecentPayments payments={summary.recentPayments}/><RecentExpenses expenses={summary.recentExpenses}/></div>
      {(hasRole("SUPER_ADMIN") || hasPermission("finance.income.view")) && <OtherIncomePanel canCreate={hasRole("SUPER_ADMIN") || hasPermission("finance.income.create")} onCreated={() => setRefreshKey((value) => value + 1)}/>} 
    </>}
  </div>;
}

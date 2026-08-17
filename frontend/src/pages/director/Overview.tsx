import { DateTime } from "luxon";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardService, { type DirectorDashboard } from "../../services/dashboardService";
import AttentionPanel from "./overview/AttentionPanel";
import DashboardSummaryCards from "./overview/DashboardSummaryCards";
import FinancialSnapshot from "./overview/FinancialSnapshot";
import QuickActions from "./overview/QuickActions";
import RecentRegistrations from "./overview/RecentRegistrations";

function DashboardSkeleton() {
  return <div className="space-y-6 animate-pulse"><div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-3xl bg-slate-100" />)}</div><div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><div className="h-72 rounded-3xl bg-slate-100"/><div className="h-72 rounded-3xl bg-slate-100"/></div></div>;
}

export default function DirectorOverview() {
  const [data, setData] = useState<DirectorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await DashboardService.getDirectorOverview());
    } catch {
      setError("The school overview could not be loaded. Check the database connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  const today = DateTime.now().setZone("Africa/Kampala").toFormat("cccc, dd LLLL yyyy");

  return (
    <div className="min-w-0 space-y-7">
      <header className="portal-hero flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-semibold text-amber-300">{today}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">School overview</h1>
          <p className="mt-2 text-sm text-white/65">
            {data?.period.academicYear ? `${data.period.academicYear}${data.period.term ? ` · ${data.period.term}` : ""}` : "No active academic period selected"}
          </p>
        </div>
        <button type="button" onClick={() => void loadOverview()} disabled={loading} className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60">
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh overview
        </button>
      </header>

      {error && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><span>{error}</span><button type="button" onClick={() => void loadOverview()} className="font-semibold underline">Try again</button></div>}
      {loading && !data ? <DashboardSkeleton /> : data && <>
        <DashboardSummaryCards data={data} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <FinancialSnapshot finance={data.finance} />
          <QuickActions />
        </div>
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <RecentRegistrations data={data} />
          <AttentionPanel data={data} />
        </div>
      </>}
    </div>
  );
}

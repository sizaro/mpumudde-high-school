import DirectorFinancePage from "../director/finance";

export default function FinancePortal() {
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-[1500px] rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl sm:p-8">
      <DirectorFinancePage />
    </div>
  </main>;
}

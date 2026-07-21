export default function DirectorOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Director Dashboard</h1>
      <p className="mt-3 text-slate-600">View student registration, finance, and performance summaries.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Student registration</h2>
          <p className="mt-2 text-slate-500">Register new students and manage the student roster.</p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Fees management</h2>
          <p className="mt-2 text-slate-500">Track payments, expected fees, and outstanding balances.</p>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import StudentAccountService, { type StudentAccount, type StudentAccountDetails, type StudentAccountFilters as Filters } from "../../../../services/studentAccountService";
import PreviousBalances from "./PreviousBalances";
import StudentAccountFilters from "./StudentAccountFilters";
import StudentAccountsTable from "./StudentAccountsTable";
import StudentChargesTable from "./StudentChargesTable";
import StudentFinancialSummary from "./StudentFinancialSummary";
import StudentPaymentHistory from "./StudentPaymentHistory";
import StudentStatement from "./StudentStatement";

export default function StudentAccounts() {
  const [filters, setFilters] = useState<Filters>({});
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [selected, setSelected] = useState<StudentAccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setLoading(true); setError(null); void StudentAccountService.list(filters).then(setAccounts).catch(() => setError("Unable to load student accounts.")).finally(() => setLoading(false)); }, [filters]);
  const open = async (account: StudentAccount) => { try { setSelected(await StudentAccountService.get(account.id)); } catch { setError("Unable to open this student account."); } };
  return <div className="mt-8 space-y-6">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">Student Accounts</h2><p className="mt-1 text-sm text-slate-500">Review expected fees, payments, waivers, and outstanding balances for each student.</p></div>
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    <StudentAccountFilters value={filters} onChange={setFilters}/>
    <StudentAccountsTable accounts={accounts} loading={loading} onOpen={(account) => void open(account)}/>
    {selected && <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-xl font-semibold text-slate-900">{selected.student.firstName} {selected.student.lastName}</h3><p className="text-sm text-slate-500">{selected.student.admissionNumber}</p></div><StudentStatement account={selected}/></div>
      <StudentFinancialSummary account={selected}/>
      <div><h4 className="mb-3 font-semibold text-slate-900">Charges</h4><StudentChargesTable charges={selected.charges}/></div>
      <div><h4 className="mb-3 font-semibold text-slate-900">Payment history</h4><StudentPaymentHistory payments={selected.payments}/></div>
      <div><h4 className="mb-3 font-semibold text-slate-900">Previous balances</h4><PreviousBalances balances={selected.previousBalances}/></div>
    </section>}
  </div>;
}

import { useSearchParams } from "react-router-dom";
import FeeSetup from "./fee-setup";
import StudentAccounts from "./student-accounts";
import Payments from "./payments";
import Overview from "./overview";
import Expenses from "./expenses";
import Reports from "./reports";
import { useAuth } from "../../../context/AuthContext";

type FinanceTab = "overview" | "fee-setup" | "student-accounts" | "payments" | "expenses" | "reports";

const tabs: Array<{ key: FinanceTab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "fee-setup", label: "Fee Setup" },
  { key: "student-accounts", label: "Student Accounts" },
  { key: "payments", label: "Payments" },
  { key: "expenses", label: "Expenses" },
  { key: "reports", label: "Reports" },
];

const isFinanceTab = (value: string | null): value is FinanceTab => tabs.some((tab) => tab.key === value);

export default function DirectorFinancePage() {
  const { hasPermission, hasRole } = useAuth();
  const isDirector = hasRole("SUPER_ADMIN");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const canOpen = (tab: FinanceTab) => isDirector || ({
    overview: hasPermission("finance.view"),
    "fee-setup": hasPermission("finance.fee-structures.view"),
    "student-accounts": hasPermission("finance.accounts.view"),
    payments: hasPermission("finance.payments.view") || hasPermission("finance.payments.create"),
    expenses: hasPermission("finance.expenses.view") || hasPermission("finance.expenses.create") || hasPermission("finance.payroll.view"),
    reports: hasPermission("finance.reports.view"),
  } satisfies Record<FinanceTab, boolean>)[tab];
  const visibleTabs = tabs.filter((tab) => canOpen(tab.key));
  const activeTab: FinanceTab = isFinanceTab(requestedTab) && canOpen(requestedTab) ? requestedTab : (visibleTabs[0]?.key ?? "overview");
  const selectTab = (tab: FinanceTab) => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    next.set("tab", tab);
    return next;
  }, { replace: true });

  return (
    <div className="min-w-0 max-w-full">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Finance</h1>
          <p className="mt-2 text-sm text-slate-500">Manage fee structures, student accounts, payments, expenses, and financial reports.</p>
        </div>
      </header>

      <nav aria-label="Finance sections" className="mt-6 border-b border-slate-200">
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {visibleTabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => selectTab(tab.key)} aria-current={activeTab === tab.key ? "page" : undefined} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "overview" ? <Overview /> : activeTab === "fee-setup" ? <FeeSetup /> : activeTab === "student-accounts" ? <StudentAccounts /> : activeTab === "payments" ? <Payments /> : activeTab === "expenses" ? <Expenses /> : <Reports />}
    </div>
  );
}

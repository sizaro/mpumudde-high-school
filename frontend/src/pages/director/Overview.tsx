import { useEffect, useState } from "react";
import { GraduationCap, Receipt, Users, Wallet } from "lucide-react";
import studentService from "../../services/studentService";
import teacherService from "../../services/teacherService";
import financeService from "../../services/financeService";

export default function DirectorOverview() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, totalCollected: 0, paymentsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [students, teachers, payments] = await Promise.all([
          studentService.getStudents(),
          teacherService.findAll(),
          financeService.getPayments(),
        ]);

        setStats({
          students: students.length,
          teachers: teachers.length,
          totalCollected: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
          paymentsCount: payments.length,
        });
      } catch {
        // keep default stats if any endpoint fails
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const cards = [
    { label: "Total students", value: stats.students.toLocaleString(), icon: Users, gradient: "from-blue-500 to-blue-600" },
    { label: "Total teachers", value: stats.teachers.toLocaleString(), icon: GraduationCap, gradient: "from-emerald-500 to-emerald-600" },
    { label: "Fees collected", value: `UGX ${stats.totalCollected.toLocaleString()}`, icon: Wallet, gradient: "from-cyan-500 to-cyan-600" },
    { label: "Payments recorded", value: stats.paymentsCount.toLocaleString(), icon: Receipt, gradient: "from-rose-500 to-rose-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Director Dashboard</h1>
      <p className="mt-3 text-slate-600">View student registration, finance, and performance summaries.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-3xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">{card.label}</p>
              <card.icon size={20} className="text-white/80" />
            </div>
            <p className="mt-3 text-2xl font-bold">{loading ? "…" : card.value}</p>
          </div>
        ))}
      </div>

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


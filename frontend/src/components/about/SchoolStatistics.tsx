import {
  GraduationCap,
  Users,
  UserCheck,
  Trophy,
  Building2,
  BookOpen,
} from "lucide-react";

const statistics = [
  {
    icon: GraduationCap,
    value: "2,500+",
    title: "Graduates",
    description: "Students who have successfully completed their education.",
  },
  {
    icon: Users,
    value: "1,200+",
    title: "Students",
    description: "A vibrant student community learning every academic year.",
  },
  {
    icon: UserCheck,
    value: "65+",
    title: "Qualified Teachers",
    description: "Experienced educators dedicated to student success.",
  },
  {
    icon: Trophy,
    value: "95%",
    title: "Examination Success",
    description: "Consistently achieving outstanding academic performance.",
  },
  {
    icon: Building2,
    value: "20+",
    title: "Modern Facilities",
    description: "Including laboratories, ICT rooms, library and sports areas.",
  },
  {
    icon: BookOpen,
    value: "15+",
    title: "Co-Curricular Clubs",
    description: "Giving students opportunities to grow beyond academics.",
  },
];

export default function SchoolStatistics() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
            School Statistics
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-white">
            Our impact in numbers.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-300">
            Every number represents students whose lives have been transformed
            through quality education, strong values, and dedicated mentorship.
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-slate-900">
                  <Icon size={38} />
                </div>

                <h3 className="mt-8 text-5xl font-extrabold text-white">
                  {stat.value}
                </h3>

                <h4 className="mt-3 text-xl font-semibold text-white">
                  {stat.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-300">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
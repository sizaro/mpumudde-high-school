import {
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Users,
} from "lucide-react";

const leaders = [
  {
    icon: UserRound,
    role: "Headteacher",
    description:
      "Provides strategic leadership and guides the school toward academic excellence and strong values.",
  },
  {
    icon: GraduationCap,
    role: "Deputy Headteacher",
    description:
      "Supports school administration, student welfare, discipline, and daily operations.",
  },
  {
    icon: BriefcaseBusiness,
    role: "Director of Studies",
    description:
      "Oversees curriculum implementation, teaching standards, and academic performance.",
  },
  {
    icon: Users,
    role: "Administrative Team",
    description:
      "Ensures effective school operations, communication, and support services.",
  },
];

export default function LeadershipPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Leadership Team
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Meet the people guiding our school.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Our leadership team provides direction, support, and vision to
            create an environment where students and staff can succeed.
          </p>
        </div>


        {/* Leaders */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {leaders.map((leader) => {
            const Icon = leader.icon;

            return (
              <div
                key={leader.role}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {leader.role}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {leader.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            Meet Our Leadership Team
          </button>
        </div>

      </div>
    </section>
  );
}
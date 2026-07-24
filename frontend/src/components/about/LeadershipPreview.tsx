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
    <section className="bg-slate-900/20 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="section-badge">
            Leadership Team
          </p>

          <h2 className="mt-4 text-4xl font-extrabold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            Meet the people guiding our school.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
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
                className="glass-card p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {leader.role}
                </h3>

                <p className="mt-4 leading-7 section-lead">
                  {leader.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="glass-button">
            Meet Our Leadership Team
          </button>
        </div>

      </div>
    </section>
  );
}
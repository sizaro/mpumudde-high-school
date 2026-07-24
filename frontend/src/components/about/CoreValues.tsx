import {
  Award,
  ShieldCheck,
  Users,
  HeartHandshake,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We pursue the highest standards in academics, leadership, and personal development.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We encourage honesty, responsibility, accountability, and ethical behaviour in every aspect of school life.",
  },
  {
    icon: GraduationCap,
    title: "Discipline",
    description:
      "Self-discipline and respect form the foundation for meaningful learning and lifelong success.",
  },
  {
    icon: Users,
    title: "Respect",
    description:
      "We value every individual and foster a welcoming environment built on mutual respect and inclusion.",
  },
  {
    icon: HeartHandshake,
    title: "Service",
    description:
      "We inspire students to serve their communities with compassion, humility, and leadership.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace creativity, critical thinking, and technology to prepare learners for the future.",
  },
];

export default function CoreValues() {
  return (
    <section className="bg-slate-900/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="section-badge">
            Core Values
          </p>

          <h2 className="mt-3 section-title">
            The principles that guide everything we do.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Our values shape the character of our students, influence our
            decisions, and define the culture of Mpumudde High School.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group glass-card p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl transition group-hover:scale-110" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#4ade80' }}>
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {value.title}
                </h3>

                <p className="mt-4 leading-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
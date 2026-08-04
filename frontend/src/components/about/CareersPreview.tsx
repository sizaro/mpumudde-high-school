import {
  Briefcase,
  Users,
  FileCheck,
  GraduationCap,
} from "lucide-react";

const careers = [
  {
    icon: GraduationCap,
    title: "Teaching Opportunities",
    description:
      "Join a team of educators committed to inspiring students and delivering quality education.",
  },
  {
    icon: Users,
    title: "Support Staff Roles",
    description:
      "Opportunities for professionals who contribute to effective school operations and student wellbeing.",
  },
  {
    icon: FileCheck,
    title: "Professional Growth",
    description:
      "We encourage continuous learning, collaboration, and development among our staff.",
  },
  {
    icon: Briefcase,
    title: "Recruitment Process",
    description:
      "A transparent process designed to identify skilled and passionate individuals.",
  },
];

export default function CareersPreview() {
  return (
    <section className="bg-slate-900/20 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="section-badge">
            Careers
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            Build your career with Mpumudde High School.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            We welcome passionate professionals who share our commitment to
            quality education, student development, and creating a positive
            learning environment.
          </p>
        </div>


        {/* Career Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {careers.map((career) => {
            const Icon = career.icon;

            return (
              <div
                key={career.title}
                className="glass-card p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {career.title}
                </h3>

                <p className="mt-4 leading-7 section-lead">
                  {career.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="glass-button">
            Explore Careers
          </button>
        </div>

      </div>
    </section>
  );
}

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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Careers
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Build your career with Mpumudde High School.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
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
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {career.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {career.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            Explore Careers
          </button>
        </div>

      </div>
    </section>
  );
}
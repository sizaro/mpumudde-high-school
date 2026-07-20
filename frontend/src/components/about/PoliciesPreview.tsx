import {
  FileText,
  ShieldCheck,
  UserCheck,
  Laptop,
  Scale,
} from "lucide-react";

const policies = [
  {
    icon: FileText,
    title: "Admissions Policy",
    description:
      "Guidelines that explain student admission requirements, procedures, and expectations.",
  },
  {
    icon: ShieldCheck,
    title: "Child Protection Policy",
    description:
      "Ensuring every student learns in a safe, respectful, and supportive environment.",
  },
  {
    icon: Scale,
    title: "Discipline Policy",
    description:
      "Promoting responsibility, respect, integrity, and positive student behaviour.",
  },
  {
    icon: Laptop,
    title: "ICT Policy",
    description:
      "Guidelines for responsible technology use and digital learning practices.",
  },
  {
    icon: UserCheck,
    title: "Privacy Policy",
    description:
      "Protecting student, parent, and school information through responsible data management.",
  },
];

export default function PoliciesPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            School Policies
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Clear standards for a successful school community.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Our policies help create a safe, disciplined, and supportive
            environment where students can focus on learning and personal
            development.
          </p>
        </div>


        {/* Policy Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <div
                key={policy.title}
                className="rounded-3xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {policy.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {policy.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            View School Policies
          </button>
        </div>

      </div>
    </section>
  );
}
import {
  Users,
  ShieldCheck,
  ClipboardCheck,
  Landmark,
} from "lucide-react";

const governance = [
  {
    icon: Landmark,
    title: "Board Leadership",
    description:
      "Provides strategic direction and ensures the school remains focused on its mission and values.",
  },
  {
    icon: Users,
    title: "Community Representation",
    description:
      "Brings together education stakeholders, parents, and community representatives.",
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    description:
      "Ensures responsible management, transparency, and continuous improvement.",
  },
  {
    icon: ClipboardCheck,
    title: "School Development",
    description:
      "Supports planning, policies, and initiatives that strengthen the institution.",
  },
];

export default function BoardOfGovernorsPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Governance
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Strong leadership and responsible governance.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Mpumudde High School is guided by a governance structure committed
            to accountability, quality education, and the long-term growth of
            the institution.
          </p>
        </div>


        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {governance.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            Meet Our Board
          </button>
        </div>

      </div>
    </section>
  );
}
import {
  Users,
  GraduationCap,
  Building2,
  ClipboardList,
  FileText,
  Briefcase,
  HelpCircle,
} from "lucide-react";

const links = [
  {
    icon: Users,
    title: "Leadership",
    description:
      "Meet the school leaders guiding our vision and development.",
  },
  {
    icon: GraduationCap,
    title: "Teaching Staff",
    description:
      "Discover our dedicated team of educators.",
  },
  {
    icon: Building2,
    title: "Departments",
    description:
      "Explore our academic departments and programmes.",
  },
  {
    icon: Building2,
    title: "Facilities",
    description:
      "View the resources and spaces supporting learning.",
  },
  {
    icon: ClipboardList,
    title: "School Policies",
    description:
      "Learn about our standards and guidelines.",
  },
  {
    icon: Briefcase,
    title: "Careers",
    description:
      "Explore opportunities to join our team.",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description:
      "Find answers to common questions.",
  },
];

export default function ExploreMore() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Explore More
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Discover more about Mpumudde High School.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Explore our leadership, academic departments, facilities, policies,
            and other areas of the school.
          </p>
        </div>


        {/* Links */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <div
                key={link.title}
                className="group cursor-pointer rounded-3xl border border-slate-200 p-8 transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {link.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {link.description}
                </p>

                <p className="mt-6 font-semibold text-amber-600">
                  Learn More →
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
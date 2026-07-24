import {
  Users,
  GraduationCap,
  Building2,
  ClipboardList,
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
    <section className="bg-slate-900/20 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="section-badge">
            Explore More
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            Discover more about Mpumudde High School.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
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
                className="group glass-card cursor-pointer p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {link.title}
                </h3>

                <p className="mt-4 leading-7 section-lead">
                  {link.description}
                </p>

                <p className="mt-6 font-semibold" style={{ color: '#4ade80' }}>
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
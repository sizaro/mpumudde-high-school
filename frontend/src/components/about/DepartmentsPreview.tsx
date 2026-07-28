import {
  Calculator,
  FlaskConical,
  Laptop,
  Languages,
  Globe2,
  BriefcaseBusiness,
  Palette,
  Trophy,
} from "lucide-react";

const departments = [
  {
    icon: Calculator,
    title: "Mathematics",
    description:
      "Building analytical thinking, problem-solving abilities, and confidence with numbers.",
  },
  {
    icon: FlaskConical,
    title: "Sciences",
    description:
      "Providing practical scientific knowledge through exploration and laboratory learning.",
  },
  {
    icon: Laptop,
    title: "ICT",
    description:
      "Equipping students with digital skills and technological understanding.",
  },
  {
    icon: Languages,
    title: "Languages",
    description:
      "Developing effective communication and language proficiency.",
  },
  {
    icon: Globe2,
    title: "Humanities",
    description:
      "Helping learners understand society, history, geography, and human relationships.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Studies",
    description:
      "Introducing entrepreneurship, financial literacy, and commercial knowledge.",
  },
  {
    icon: Palette,
    title: "Creative Arts",
    description:
      "Encouraging imagination through art, music, drama, and creative expression.",
  },
  {
    icon: Trophy,
    title: "Sports & Physical Education",
    description:
      "Promoting teamwork, fitness, discipline, and healthy competition.",
  },
];

export default function DepartmentsPreview() {
  return (
    <section className="bg-slate-900/20 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="section-badge">
            Academic Departments
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            A wide range of subjects for a complete education.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Our departments provide students with knowledge, practical skills,
            and opportunities to explore their interests and prepare for future
            careers.
          </p>
        </div>


        {/* Department Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {departments.map((department) => {
            const Icon = department.icon;

            return (
              <div
                key={department.title}
                className="group glass-card p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {department.title}
                </h3>

                <p className="mt-4 leading-7 section-lead">
                  {department.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* Button */}
        <div className="mt-12 text-center">
          <button className="glass-button">
            Explore All Departments
          </button>
        </div>

      </div>
    </section>
  );
}
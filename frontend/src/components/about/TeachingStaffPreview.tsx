import {
  Calculator,
  FlaskConical,
  Languages,
  Laptop,
  BookOpen,
  Palette,
} from "lucide-react";

const departments = [
  {
    icon: Calculator,
    title: "Mathematics Department",
    description:
      "Developing logical thinking, problem-solving skills, and confidence in mathematics.",
  },
  {
    icon: FlaskConical,
    title: "Sciences Department",
    description:
      "Encouraging scientific inquiry through practical learning and innovation.",
  },
  {
    icon: Languages,
    title: "Languages Department",
    description:
      "Building communication skills through English and other language programmes.",
  },
  {
    icon: Laptop,
    title: "ICT Department",
    description:
      "Preparing learners with digital skills for the modern world.",
  },
  {
    icon: BookOpen,
    title: "Humanities Department",
    description:
      "Helping students understand society, history, culture, and human development.",
  },
  {
    icon: Palette,
    title: "Creative Arts Department",
    description:
      "Supporting creativity through art, music, drama, and cultural expression.",
  },
];

export default function TeachingStaffPreview() {
  return (
    <section className="bg-slate-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="section-badge">
            Teaching Staff
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            Experienced teachers dedicated to student success.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Our teachers combine knowledge, experience, and passion to provide
            meaningful learning experiences that help students achieve their
            goals.
          </p>
        </div>


        {/* Departments */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => {
            const Icon = department.icon;

            return (
              <div
                key={department.title}
                className="glass-card p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                  <Icon size={32} />
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


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="glass-button">
            View Teaching Staff
          </button>
        </div>

      </div>
    </section>
  );
}
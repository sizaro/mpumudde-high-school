import {
  BookOpen,
  FlaskConical,
  Laptop,
  GraduationCap,
} from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "A balanced curriculum that equips students with strong academic foundations, critical thinking, and lifelong learning skills.",
  },
  {
    icon: FlaskConical,
    title: "Science & Innovation",
    description:
      "Well-equipped science laboratories and practical learning experiences inspire curiosity and scientific discovery.",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    description:
      "Technology is integrated into teaching and learning, preparing students for a rapidly changing digital world.",
  },
  {
    icon: GraduationCap,
    title: "Examination Success",
    description:
      "Continuous assessment, academic support, and dedicated teachers help learners achieve excellent examination results.",
  },
];

export default function AcademicExcellence() {
  return (
    <section className="py-24 bg-slate-900/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <p className="section-badge">
              Academic Excellence
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Inspiring excellence through quality education.
            </h2>

            <p className="mt-8 leading-8 section-lead">
              At Mpumudde High School, academic excellence is more than
              achieving high grades. We nurture curiosity, creativity,
              discipline, and confidence while equipping students with the
              knowledge and skills required for higher education and the modern
              workplace.
            </p>

            <p className="mt-6 leading-8 section-lead">
              Our experienced teachers combine effective classroom instruction,
              practical learning, technology integration, and continuous
              assessment to ensure every learner reaches their full potential.
            </p>

            <button className="mt-10 glass-button">
              Explore Academics
            </button>
          </div>

          {/* Right */}
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((program) => {
              const Icon = program.icon;

              return (
                <div
                  key={program.title}
                  className="glass-card p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                    <Icon size={30} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                    {program.title}
                  </h3>

                  <p className="mt-4 leading-7 section-lead">
                    {program.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
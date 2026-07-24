import { Award, Medal, Trophy, Star } from "lucide-react";

const achievements = [
  {
    year: "2008",
    icon: Award,
    title: "School Established",
    description:
      "Mpumudde High School welcomed its first cohort of students with a vision of academic excellence and character development.",
  },
  {
    year: "2015",
    icon: Trophy,
    title: "Regional Academic Recognition",
    description:
      "Students consistently achieved outstanding performance in national examinations and academic competitions.",
  },
  {
    year: "2020",
    icon: Medal,
    title: "Expanded Learning Facilities",
    description:
      "New science laboratories, ICT facilities, and modern classrooms were introduced to enhance learning.",
  },
  {
    year: "Today",
    icon: Star,
    title: "Continuing Excellence",
    description:
      "The school continues to develop responsible, innovative, and confident learners ready for higher education and life.",
  },
];

export default function Achievements() {
  return (
    <section className="py-24 bg-slate-900/20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="section-badge">
            Achievements
          </p>

          <h2 className="mt-4 text-4xl font-extrabold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            Celebrating milestones of excellence.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Over the years, Mpumudde High School has continued to grow in
            academic performance, infrastructure, leadership, and student
            development.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          <div className="absolute left-6 top-0 hidden h-full w-1 bg-emerald-400/30 md:block" />

          <div className="space-y-12">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;

              return (
                <div
                  key={achievement.title}
                  className="relative flex flex-col gap-6 glass-card p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-start md:gap-10"
                >
                  {/* Timeline Icon */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(16, 185, 129, 0.3)', color: '#4ade80', marginTop: '0px' }}>
                    <Icon size={28} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#4ade80' }}>
                      {achievement.year}
                    </span>

                    <h3 className="mt-4 text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      {achievement.title}
                    </h3>

                    <p className="mt-4 leading-8 section-lead">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
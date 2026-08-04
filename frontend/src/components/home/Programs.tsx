import {
  BookOpen,
  FlaskConical,
  Laptop,
  Palette,
  Music,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "../AnimatedSection";

const programs = [
  {
    title: "O-Level Curriculum",
    description:
      "A strong foundation in sciences, arts, and core academic subjects.",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "A-Level Curriculum",
    description:
      "Advanced studies preparing students for university education.",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Science Programs",
    description:
      "Physics, Chemistry, Biology and practical laboratory learning.",
    icon: FlaskConical,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "ICT & Technology",
    description:
      "Computer literacy, programming, and digital innovation skills.",
    icon: Laptop,
    color: "bg-slate-100 text-slate-700",
  },
  {
    title: "Arts & Humanities",
    description:
      "History, Geography, Literature and creative critical thinking.",
    icon: Palette,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Co-Curricular Activities",
    description:
      "Sports, leadership training, music, and student clubs.",
    icon: Music,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function Programs() {
  return (
    <section className="home-section">
      <AnimatedSection delay={0.15}>
      <div className="site-container">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="section-badge">
            ACADEMIC PROGRAMS
          </span>

          <h2 className="section-title mt-6">
            Structured Learning for Future Success
          </h2>

          <p className="section-lead mx-auto mt-4">
            We offer a balanced curriculum designed to develop academic excellence,
            creativity, and practical skills for real-world success.
          </p>

        </div>

        {/* Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {programs.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="glass-card p-8 hover:scale-105 transition-all duration-300"
              >

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                  style={{
                    background: item.title.includes('O-Level') ? 'rgba(34, 211, 238, 0.2)' :
                                item.title.includes('A-Level') ? 'rgba(139, 92, 246, 0.2)' :
                                item.title.includes('Science') ? 'rgba(16, 185, 129, 0.2)' :
                                item.title.includes('ICT') ? 'rgba(148, 163, 184, 0.2)' :
                                item.title.includes('Arts') ? 'rgba(251, 191, 36, 0.2)' :
                                'rgba(168, 85, 247, 0.2)'
                  }}
                >
                  <Icon size={28} className={
                    item.title.includes('O-Level') ? 'text-cyan-400' :
                    item.title.includes('A-Level') ? 'text-violet-400' :
                    item.title.includes('Science') ? 'text-emerald-400' :
                    item.title.includes('ICT') ? 'text-slate-300' :
                    item.title.includes('Arts') ? 'text-amber-400' :
                    'text-purple-400'
                  } />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600 dark:text-white/70">
                  {item.description}
                </p>

                <Link
                  to="/academics"
                  className="inline-flex items-center mt-6 font-semibold hover:gap-3 gap-2 transition-all text-emerald-400"
                >
                  Learn More →
                </Link>

              </div>

            );

          })}

        </div>

      </div>
      </AnimatedSection>
    </section>
  );
}

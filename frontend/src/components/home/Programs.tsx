import {
  BookOpen,
  FlaskConical,
  Laptop,
  Palette,
  Users,
  Music,
} from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            ACADEMIC PROGRAMS
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Structured Learning for Future Success
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
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
                className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600 leading-7">
                  {item.description}
                </p>

                <Link
                  to="/academics"
                  className="inline-flex items-center mt-6 text-indigo-700 font-semibold hover:gap-3 gap-2 transition-all"
                >
                  Learn More →
                </Link>

              </div>

            );

          })}

        </div>

      </div>
    </section>
  );
}
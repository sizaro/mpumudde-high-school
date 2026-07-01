import {
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
} from "lucide-react";

const stats = [
  {
    label: "Students",
    value: "1,500+",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Teachers",
    value: "80+",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Programs",
    value: "25+",
    icon: BookOpen,
    color: "bg-orange-100 text-orange-700",
  },
  {
    label: "Years of Excellence",
    value: "30+",
    icon: Trophy,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function Statistics() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
            OUR IMPACT
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Numbers That Reflect Excellence
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            A track record built on discipline, academic success, and holistic
            development of learners.
          </p>

        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.label}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >

                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-4xl font-extrabold text-slate-900">
                  {item.value}
                </h3>

                <p className="mt-2 text-slate-600 font-medium">
                  {item.label}
                </p>

              </div>

            );

          })}

        </div>

      </div>
    </section>
  );
}
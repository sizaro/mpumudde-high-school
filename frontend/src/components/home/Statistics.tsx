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
    <section className="py-24">
      <div className="site-container">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="section-badge">
            OUR IMPACT
          </span>

          <h2 className="section-title mt-6">
            Numbers That Reflect Excellence
          </h2>

          <p className="section-lead mx-auto mt-4">
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
                className="glass-card-solid p-10 text-center hover:scale-105 transition-all duration-300"
              >

                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${item.color}`}
                  style={{ 
                    background: item.label === 'Students' ? 'rgba(34, 211, 238, 0.2)' : 
                                item.label === 'Teachers' ? 'rgba(16, 185, 129, 0.2)' : 
                                item.label === 'Programs' ? 'rgba(251, 191, 36, 0.2)' : 
                                'rgba(139, 92, 246, 0.2)' 
                  }}
                >
                  <Icon size={30} className={
                    item.label === 'Students' ? 'text-cyan-400' : 
                    item.label === 'Teachers' ? 'text-emerald-400' : 
                    item.label === 'Programs' ? 'text-amber-400' : 
                    'text-violet-400'
                  } />
                </div>

                <h3 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
                  {item.value}
                </h3>

                <p className="mt-2 font-medium text-slate-600 dark:text-white/70">
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
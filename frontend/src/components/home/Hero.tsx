import { ArrowRight, GraduationCap, BookOpen, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-violet-900/80 to-slate-900/90" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-3xl">

          {/* Badge with glass effect */}
          <div className="section-badge mb-8">
            Excellence • Discipline • Service
          </div>

          {/* Heading with gradient */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="block bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Building Tomorrow's
            </span>
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Leaders Today
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 text-lg md:text-xl text-white/80 leading-8 max-w-2xl">
            Welcome to Mpumudde High School, where academic excellence,
            innovation, discipline, and character development prepare every
            learner for a successful future.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5 mt-10">

            <Link
              to="/admissions"
              className="group glass-button flex items-center gap-2 text-base"
            >
              Apply Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about"
              className="glass-card rounded-full px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore Our School
            </Link>

          </div>

        </div>

        {/* Bottom Cards with enhanced glass effect */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-24">

          <div className="glass-card-solid p-6 transition-transform hover:scale-105">

            <GraduationCap
              className="text-emerald-400 mb-3"
              size={32}
            />

            <h3 className="text-white text-3xl font-bold">
              98%
            </h3>

            <p className="text-white/70">
              Examination Success
            </p>

          </div>

          <div className="glass-card-solid p-6 transition-transform hover:scale-105">

            <Users
              className="text-cyan-400 mb-3"
              size={32}
            />

            <h3 className="text-white text-3xl font-bold">
              1,500+
            </h3>

            <p className="text-white/70">
              Students
            </p>

          </div>

          <div className="glass-card-solid p-6 transition-transform hover:scale-105">

            <BookOpen
              className="text-violet-400 mb-3"
              size={32}
            />

            <h3 className="text-white text-3xl font-bold">
              40+
            </h3>

            <p className="text-white/70">
              Qualified Teachers
            </p>

          </div>

          <div className="glass-card-solid p-6 transition-transform hover:scale-105">

            <Trophy
              className="text-amber-400 mb-3"
              size={32}
            />

            <h3 className="text-white text-3xl font-bold">
              30+
            </h3>

            <p className="text-white/70">
              Years of Excellence
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
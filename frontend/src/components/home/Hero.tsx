import { ArrowRight, GraduationCap, BookOpen, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../../shared/Reveal";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center">

      {/* Video background - place a hero.mp4 in the public folder; poster falls back to hero image */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        poster="/assets/hero.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-3xl">

          <Reveal>
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-white mb-8">
              Excellence • Discipline • Service
            </div>

            {/* Heading */}
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight">
              Building Tomorrow's
              <span className="block text-amber-400">Leaders Today</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg md:text-xl text-gray-200 leading-8 max-w-2xl">
              Welcome to Mpumudde High School, where academic excellence,
              innovation, discipline, and character development prepare every
              learner for a successful future.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                to="/admissions"
                className="bg-amber-500 hover:bg-amber-600 transition px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                className="border border-white text-white hover:bg-white hover:text-black transition px-8 py-4 rounded-xl font-semibold"
              >
                Explore Our School
              </Link>

            </div>
          </Reveal>

        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-24">

          <Reveal>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <GraduationCap className="text-amber-400 mb-3" size={32} />
              <h3 className="text-white text-3xl font-bold">98%</h3>
              <p className="text-gray-300">Examination Success</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Users className="text-amber-400 mb-3" size={32} />
              <h3 className="text-white text-3xl font-bold">1,500+</h3>
              <p className="text-gray-300">Students</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <BookOpen className="text-amber-400 mb-3" size={32} />
              <h3 className="text-white text-3xl font-bold">40+</h3>
              <p className="text-gray-300">Qualified Teachers</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Trophy className="text-amber-400 mb-3" size={32} />
              <h3 className="text-white text-3xl font-bold">30+</h3>
              <p className="text-gray-300">Years of Excellence</p>
            </div>
          </Reveal>

        </div>

      </div>

    </section>
  );
}
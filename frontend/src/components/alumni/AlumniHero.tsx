import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AlumniHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="section-shell">
        <div data-aos="fade-up" className="glass-card-solid overflow-hidden">
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-14">
            <div>
              <span className="section-badge">Mpumudde Alumni Community</span>

              <h1 className="section-title mt-5 max-w-4xl">
                Your Mpumudde story continues long after you leave the
                classroom.
              </h1>

              <p className="section-lead mt-5 max-w-2xl">
                Stay connected with Mpumudde High School, reconnect with former
                schoolmates, celebrate alumni achievements, and remain part of
                the community that helped shape your journey.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#join-alumni" className="glass-button">
                  Join the Alumni Community
                  <ArrowRight size={18} />
                </a>

                <Link
                  to="/contact"
                  className="rounded-full border border-slate-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200/20 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Contact the School
                </Link>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="120" className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl bg-emerald-400/10 p-6">
                    <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                      <GraduationCap size={24} className="text-emerald-400" />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                      Every former student
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/65">
                      Whether you graduated or spent only part of your school
                      journey at Mpumudde, you can be part of the alumni
                      community.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/5 p-6">
                    <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                      <Users size={24} className="text-emerald-400" />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                      Stay connected
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/65">
                      Remain connected to fellow alumni and receive official
                      communication from Mpumudde High School.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

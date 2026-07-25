import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  School,
  Target,
  Eye,
} from "lucide-react";
import { AnimatedSection } from "../AnimatedSection";

const values = [
  "Academic Excellence",
  "Integrity & Discipline",
  "Leadership Development",
  "Innovation & Technology",
];

export default function AboutPreview() {
  return (
    <section className="py-24">
      <AnimatedSection delay={0.1}>
      <div className="site-container">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div className="relative">

            <img
              src="/images/school_class_school_children.jpg"
              alt="Mpumudde High School"
              className="rounded-3xl shadow-2xl w-full h-[620px] object-cover"
            />

            {/* Floating Card */}

            <div className="absolute bottom-8 left-8 glass-card-solid p-6 max-w-xs">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>

                  <School className="text-emerald-400" size={28} />

                </div>

                <div>

                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                    Established
                  </h3>

                  <p className="text-slate-600 dark:text-white/70">
                    Over 30 Years of Excellence
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <span className="section-badge">
              ABOUT MPUMUDDE HIGH SCHOOL
            </span>

            <h2 className="section-title mt-6">
              Nurturing Knowledge,
              Character &
              Future Leaders
            </h2>

            <p className="section-lead mt-8">
              Mpumudde High School is committed to providing a holistic education
              that equips learners with academic excellence, leadership skills,
              discipline, innovation, and strong moral values. We strive to
              prepare students for higher education, meaningful careers, and
              responsible citizenship.
            </p>

            {/* Vision */}

            <div className="mt-10 flex gap-5">

              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>

                <Eye className="text-violet-400" />

              </div>

              <div>

                <h3 className="font-bold text-2xl text-slate-900 dark:text-white">
                  Our Vision
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-white/70">
                  To be a leading centre of academic excellence,
                  innovation, leadership and character development.
                </p>

              </div>

            </div>

            {/* Mission */}

            <div className="mt-8 flex gap-5">

              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>

                <Target className="text-emerald-400" />

              </div>

              <div>

                <h3 className="font-bold text-2xl text-slate-900 dark:text-white">
                  Our Mission
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-white/70">
                  To provide quality education through committed teaching,
                  innovation, discipline and a supportive learning environment
                  that enables every learner to reach their full potential.
                </p>

              </div>

            </div>

            {/* Values */}

            <div className="grid sm:grid-cols-2 gap-4 mt-10">

              {values.map((value) => (

                <div
                  key={value}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="text-emerald-400"
                    size={22}
                  />

                  <span className="font-medium text-slate-700 dark:text-white/80">
                    {value}
                  </span>

                </div>

              ))}

            </div>

            {/* Button */}

            <Link
              to="/about"
              className="glass-button inline-flex items-center gap-3 mt-12"
            >
              Learn More About Us

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </div>
      </AnimatedSection>
    </section>
  );
}
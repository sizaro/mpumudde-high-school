import { Link } from "react-router-dom";
import {
  ArrowRight,
  Quote,
  Mail,
  Phone,
} from "lucide-react";
import { AnimatedSection } from "../AnimatedSection";

export default function PrincipalMessage() {
  return (
    <section className="py-24">
      <AnimatedSection delay={0.2}>
      <div className="site-container">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Principal Image */}

          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
              alt="School Principal"
              className="w-full h-[650px] object-cover rounded-3xl shadow-xl"
            />

            <div className="absolute -bottom-8 left-8 glass-card-solid p-6">

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Mr. John Doe
              </h3>

              <p className="text-slate-600 dark:text-white/70">
                Head Teacher
              </p>

            </div>

          </div>

          {/* Message */}

          <div>

            <span className="section-badge">
              A MESSAGE FROM THE HEAD TEACHER
            </span>

            <div className="mt-6">

              <Quote
                size={52}
                className="text-cyan-400"
              />

            </div>

            <h2 className="section-title mt-4">
              Welcome to
              <br />
              Mpumudde High School
            </h2>

            <p className="section-lead mt-8">
              At Mpumudde High School, we believe that education extends beyond
              the classroom. Our commitment is to nurture disciplined,
              responsible and innovative learners who are prepared to excel in
              higher education and positively contribute to society.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-white/70">
              We combine academic excellence with character formation,
              leadership development, sports, technology and co-curricular
              activities to ensure every learner receives a balanced education.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-white/70">
              We warmly welcome parents, guardians and prospective students to
              become part of our vibrant learning community.
            </p>

            {/* Contact */}

            <div className="mt-10 flex flex-wrap gap-8">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 211, 238, 0.2)' }}>

                  <Mail
                    className="text-cyan-400"
                    size={20}
                  />

                </div>

                <span className="text-slate-700 dark:text-white/80">
                  principal@mpumudde.ac.ug
                </span>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>

                  <Phone
                    className="text-emerald-400"
                    size={20}
                  />

                </div>

                <span className="text-slate-700 dark:text-white/80">
                  +256 XXX XXX XXX
                </span>

              </div>

            </div>

            {/* Button */}

            <Link
              to="/about"
              className="glass-button inline-flex items-center gap-3 mt-12"
            >
              Read Full Message

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </div>
      </AnimatedSection>
    </section>
  );
}
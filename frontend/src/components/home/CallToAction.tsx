import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="home-section relative overflow-hidden">

      {/* Glass container */}
      <div className="relative glass-card-solid site-container py-16">

        {/* Decorative gradient orbs */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />

        <div className="relative text-center">

          {/* Heading */}

          <h2 className="section-title text-4xl md:text-5xl">
            Join Mpumudde High School Today
          </h2>

          <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-600 dark:text-white/75">
            Unlock a future of academic excellence, discipline, and opportunity.
            Applications are open for all classes.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link
              to="/admissions"
              className="glass-button px-8 py-4 flex items-center gap-2"
            >
              Apply Now
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 border border-slate-300/30 dark:border-white/20 bg-slate-200/5 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200/10 dark:hover:bg-white/10"
            >
              <Phone size={18} />
              Contact Admissions
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

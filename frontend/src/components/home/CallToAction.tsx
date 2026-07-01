import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">

      {/* Decorative blur circles */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 blur-3xl" />
      <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-20 -right-20 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        {/* Heading */}

        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Join Mpumudde High School Today
        </h2>

        <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
          Unlock a future of academic excellence, discipline, and opportunity.
          Applications are open for all classes.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/admissions"
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            Apply Now
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/contact"
            className="px-8 py-4 border border-white/40 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Phone size={18} />
            Contact Admissions
          </Link>

        </div>

      </div>
    </section>
  );
}
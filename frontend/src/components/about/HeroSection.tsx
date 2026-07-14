export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80"
          alt="Students learning at Mpumudde High School"
          className="h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-28 text-center text-white">
        <p className="mb-5 text-sm uppercase tracking-[0.3em] text-amber-400">
          About Mpumudde High School
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          A school where curiosity, character and achievement grow together.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-200">
          Mpumudde High School provides students with a well-rounded education
          that blends academic excellence, leadership development, and community
          service. We prepare learners for the future with values, confidence,
          and practical skills.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-slate-900 transition hover:bg-amber-400">
            Learn More
          </button>

          <button className="rounded-full border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-900">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
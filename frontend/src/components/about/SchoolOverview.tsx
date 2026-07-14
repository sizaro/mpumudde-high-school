export default function SchoolOverview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
            alt="Mpumudde High School students"
            className="h-[450px] w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            School Overview
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Building a strong foundation for lifelong success.
          </h2>

          <p className="leading-8 text-slate-600">
            Mpumudde High School is committed to providing quality education
            that develops students academically, socially, and personally.
            Through dedicated teachers, supportive learning environments, and
            strong values, we help learners discover their potential.
          </p>

          <p className="leading-8 text-slate-600">
            Our approach combines classroom excellence with leadership,
            creativity, discipline, and community responsibility. We believe
            every student deserves opportunities to grow, achieve, and prepare
            for the future.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-2xl font-bold text-slate-900">20+</h3>
              <p className="mt-1 text-sm text-slate-600">
                Years of Excellence
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-2xl font-bold text-slate-900">1000+</h3>
              <p className="mt-1 text-sm text-slate-600">
                Students
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-2xl font-bold text-slate-900">50+</h3>
              <p className="mt-1 text-sm text-slate-600">
                Teachers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
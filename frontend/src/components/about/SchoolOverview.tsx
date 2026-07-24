export default function SchoolOverview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 bg-slate-900/20">
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
          <p className="section-badge">
            School Overview
          </p>

          <h2 className="section-title">
            Building a strong foundation for lifelong success.
          </h2>

          <p className="section-lead">
            Mpumudde High School is committed to providing quality education
            that develops students academically, socially, and personally.
            Through dedicated teachers, supportive learning environments, and
            strong values, we help learners discover their potential.
          </p>

          <p className="section-lead">
            Our approach combines classroom excellence with leadership,
            creativity, discipline, and community responsibility. We believe
            every student deserves opportunities to grow, achieve, and prepare
            for the future.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-5">
              <h3 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>20+</h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Years of Excellence
              </p>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>1000+</h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Students
              </p>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>50+</h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Teachers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
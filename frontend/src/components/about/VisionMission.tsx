export default function VisionMission() {
  return (
    <section className="py-20 bg-slate-900/20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="section-badge">
            Our Purpose
          </p>

          <h2 className="mt-3 section-title">
            Guided by a clear vision and a meaningful mission.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Our vision inspires where we are going, while our mission defines
            how we serve our students every day. Together, they shape the
            culture, values, and educational experience at Mpumudde High School.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vision */}
          <div className="glass-card-solid p-10 transition hover:shadow-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
              <span className="text-3xl">👁️</span>
            </div>

            <h3 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Our Vision
            </h3>

            <p className="mt-6 leading-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              To become a centre of excellence in education that nurtures
              knowledgeable, disciplined, innovative, and responsible citizens
              prepared to contribute positively to their communities and the
              world.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card-solid p-10 transition hover:shadow-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
              <span className="text-3xl">🎯</span>
            </div>

            <h3 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Our Mission
            </h3>

            <p className="mt-6 leading-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              To provide quality, learner-centred education through academic
              excellence, strong moral values, innovation, and holistic
              development, empowering every student to realise their full
              potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
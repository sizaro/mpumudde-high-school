export default function VisionMission() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Our Purpose
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
            Guided by a clear vision and a meaningful mission.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Our vision inspires where we are going, while our mission defines
            how we serve our students every day. Together, they shape the
            culture, values, and educational experience at Mpumudde High School.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vision */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 transition hover:shadow-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              👁️
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Our Vision
            </h3>

            <p className="mt-6 leading-8 text-slate-600">
              To become a centre of excellence in education that nurtures
              knowledgeable, disciplined, innovative, and responsible citizens
              prepared to contribute positively to their communities and the
              world.
            </p>
          </div>

          {/* Mission */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 transition hover:shadow-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              🎯
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Our Mission
            </h3>

            <p className="mt-6 leading-8 text-slate-600">
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
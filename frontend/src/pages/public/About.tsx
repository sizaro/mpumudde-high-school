export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 space-y-16 text-slate-900">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
          About Mpumudde High School
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold">
          A school where curiosity, character and achievement grow together.
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600">
          Mpumudde High School provides students with a well-rounded education that
          blends academic rigour, leadership development, and community service.
          We prepare learners for the future with values, confidence, and practical skills.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="mt-4 text-slate-600 leading-7">
            To become a centre of excellence in education, innovation and leadership
            that empowers students to succeed locally and globally.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="mt-4 text-slate-600 leading-7">
            To deliver quality teaching, foster strong values, and support every student
            in realising their full potential.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Our Values</h2>
          <ul className="mt-4 space-y-3 text-slate-600 leading-7">
            <li>• Academic excellence</li>
            <li>• Respect and discipline</li>
            <li>• Leadership and service</li>
            <li>• Creativity and community</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80"
            alt="Students learning at Mpumudde High School"
            className="h-96 w-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Learning for the future</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Students experience an integrated curriculum with strong support in science,
              mathematics, humanities and technology. We emphasise problem solving,
              digital fluency and leadership skills.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">Beyond academics</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Our learners participate in sports teams, clubs, arts programmes and
              community outreach to develop confidence, teamwork and social responsibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function History() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Our Story
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            A legacy of learning, growth, and excellence.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Every great institution has a story. Mpumudde High School has grown
            through dedication, visionary leadership, committed teachers, and a
            supportive community to become a place where students are inspired
            to achieve their full potential.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              1
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              School Founded
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Established with a vision of providing accessible, quality
              secondary education rooted in discipline and excellence.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              2
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Continuous Growth
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Expanded academic programs, facilities, and extracurricular
              opportunities while maintaining high educational standards.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              3
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Academic Achievement
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Built a reputation for producing disciplined learners equipped
              with knowledge, confidence, and leadership skills.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              4
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Looking Ahead
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Continuing to embrace innovation, technology, and holistic
              education while preparing students for a changing world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
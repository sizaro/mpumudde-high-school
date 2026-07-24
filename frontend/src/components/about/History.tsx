export default function History() {
  return (
    <section className="bg-slate-900/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="section-badge">
            Our Story
          </p>

          <h2 className="mt-3 section-title">
            A legacy of learning, growth, and excellence.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
            Every great institution has a story. Mpumudde High School has grown
            through dedication, visionary leadership, committed teachers, and a
            supportive community to become a place where students are inspired
            to achieve their full potential.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
              <span className="text-xl font-bold">1</span>
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              School Founded
            </h3>

            <p className="mt-4 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Established with a vision of providing accessible, quality
              secondary education rooted in discipline and excellence.
            </p>
          </div>

          <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
              <span className="text-xl font-bold">2</span>
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Continuous Growth
            </h3>

            <p className="mt-4 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Expanded academic programs, facilities, and extracurricular
              opportunities while maintaining high educational standards.
            </p>
          </div>

          <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
              <span className="text-xl font-bold">3</span>
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Academic Achievement
            </h3>

            <p className="mt-4 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Built a reputation for producing disciplined learners equipped
              with knowledge, confidence, and leadership skills.
            </p>
          </div>

          <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
              <span className="text-xl font-bold">4</span>
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Looking Ahead
            </h3>

            <p className="mt-4 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Continuing to embrace innovation, technology, and holistic
              education while preparing students for a changing world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
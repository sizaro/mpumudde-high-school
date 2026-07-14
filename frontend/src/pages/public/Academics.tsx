export default function Academics() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 space-y-16 text-slate-900">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
          Academics at Mpumudde High School
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Academic excellence with real-world learning and student support.
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600">
          Our academic programme delivers a strong foundation in core subjects while
          preparing students for future success through leadership, innovation and
          community engagement.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Core subjects</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Daily classes in mathematics, sciences, English, social studies and ICT
            build strong reasoning, communication and digital skills.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Practical learning</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Students learn through experiments, project work, research tasks and
            collaborative problem solving.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Exam preparation</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Regular revision clinics, practice exams and tutor support help students
            perform confidently in national assessments.
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
            alt="Students learning in a classroom"
            className="h-96 w-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Leadership and support</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Teachers guide every student with personalized coaching, enrichment
              sessions and character-building activities.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">Learning beyond the classroom</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Students join clubs, competitions and community service to grow
              confidence, creativity and teamwork.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">STEM & Innovation</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Students explore science, technology, engineering, and mathematics through practical
            experiments, coding challenges, and collaborative projects.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Language & Humanities</h2>
          <p className="mt-4 text-slate-600 leading-7">
            We nurture strong communication, cultural awareness, and critical thinking through
            literature, history, and social sciences.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Exam readiness</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Regular assessments, revision sessions, and teacher-led review clinics help students
            perform confidently in their certificates and national examinations.
          </p>
        </div>
      </div>
    </section>
  );
}

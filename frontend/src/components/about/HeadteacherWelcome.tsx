export default function HeadteacherWelcome() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Headteacher Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
                alt="Headteacher"
                className="h-[650px] w-full object-cover"
              />
            </div>

            {/* Decorative Card */}
            <div className="absolute -bottom-8 left-8 rounded-2xl bg-amber-500 px-8 py-5 text-slate-900 shadow-xl">
              <p className="text-3xl font-extrabold">20+</p>
              <p className="text-sm font-medium">
                Years of Educational Leadership
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
              Headteacher's Welcome
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              A message from our Headteacher
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              Welcome to Mpumudde High School.
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              We believe that education extends beyond the classroom. Our
              mission is to nurture confident, disciplined, compassionate, and
              responsible young people who are prepared to succeed in higher
              education, meaningful careers, and life.
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              Every learner who joins our school becomes part of a community
              that values excellence, innovation, integrity, and service.
              Together with our dedicated staff and supportive parents, we
              strive to create an environment where every student can discover
              their talents and reach their full potential.
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              Thank you for taking the time to learn about our school. We look
              forward to welcoming you to our campus and partnering with you in
              shaping tomorrow's leaders.
            </p>

            <div className="mt-10 border-l-4 border-amber-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900">
                Mr. John Doe
              </h3>

              <p className="mt-2 text-slate-600">
                Headteacher
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Mpumudde High School
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
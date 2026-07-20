import {
  Trophy,
  Users,
  Music,
  HeartHandshake,
  Flag,
  ShieldPlus,
} from "lucide-react";

const studentLife = [
  {
    icon: Trophy,
    title: "Sports & Athletics",
    description:
      "Students participate in football, netball, volleyball, athletics, and other sporting activities that promote teamwork, discipline, and healthy living.",
  },
  {
    icon: Users,
    title: "Clubs & Societies",
    description:
      "Learners explore their interests through debate, science, ICT, wildlife, entrepreneurship, and numerous other clubs.",
  },
  {
    icon: Music,
    title: "Music, Dance & Drama",
    description:
      "Creative arts provide opportunities for students to develop confidence, talent, and self-expression while celebrating culture.",
  },
  {
    icon: Flag,
    title: "Student Leadership",
    description:
      "Leadership programmes empower learners to serve their peers, make responsible decisions, and become future leaders.",
  },
  {
    icon: HeartHandshake,
    title: "Community Service",
    description:
      "Students actively participate in outreach programmes that foster compassion, responsibility, and positive community engagement.",
  },
  {
    icon: ShieldPlus,
    title: "Guidance & Counselling",
    description:
      "Professional guidance and counselling support students academically, emotionally, and socially throughout their school journey.",
  },
];

export default function StudentLife() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Student Life
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Learning extends beyond the classroom.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            At Mpumudde High School, students enjoy a vibrant school experience
            that encourages leadership, creativity, teamwork, service, and
            personal growth alongside academic success.
          </p>
        </div>

        {/* Content */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80"
              alt="Students participating in school activities"
              className="h-full min-h-[600px] w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {studentLife.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                      <Icon size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
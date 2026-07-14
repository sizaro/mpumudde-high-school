import {
  HeartHandshake,
  Users,
  Globe2,
  Leaf,
} from "lucide-react";

const engagements = [
  {
    icon: HeartHandshake,
    title: "Community Service",
    description:
      "Students participate in outreach activities that encourage compassion, responsibility, and a spirit of giving back.",
  },
  {
    icon: Users,
    title: "Parent Partnerships",
    description:
      "We work closely with parents and guardians to support student growth, discipline, and academic success.",
  },
  {
    icon: Globe2,
    title: "Community Partnerships",
    description:
      "The school collaborates with organizations and stakeholders to create opportunities for learners.",
  },
  {
    icon: Leaf,
    title: "Environmental Responsibility",
    description:
      "Students are encouraged to care for their surroundings through environmental awareness and sustainability activities.",
  },
];

export default function CommunityEngagement() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Community Engagement
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Developing students who make a difference.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Mpumudde High School believes education extends beyond the classroom.
            Through service, partnerships, and community involvement, students
            learn the importance of leadership and responsibility.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {engagements.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Image */}
        <div className="mt-16 overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1600&q=80"
            alt="Students participating in community activities"
            className="h-[450px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
import {
  School,
  FlaskConical,
  Laptop,
  Library,
  BedDouble,
  Utensils,
  Trophy,
  HeartPulse,
} from "lucide-react";

const facilities = [
  {
    icon: School,
    title: "Modern Classrooms",
    description:
      "Comfortable learning spaces designed to support effective teaching and student engagement.",
  },
  {
    icon: FlaskConical,
    title: "Science Laboratories",
    description:
      "Practical science facilities that encourage experimentation, discovery, and innovation.",
  },
  {
    icon: Laptop,
    title: "Computer Laboratory",
    description:
      "Technology facilities that develop digital literacy and computer skills.",
  },
  {
    icon: Library,
    title: "School Library",
    description:
      "A resource centre that supports independent learning, research, and reading culture.",
  },
  {
    icon: BedDouble,
    title: "Boarding Facilities",
    description:
      "Safe and supportive accommodation that promotes student wellbeing and discipline.",
  },
  {
    icon: Utensils,
    title: "Dining Facilities",
    description:
      "Nutritious meals provided in a clean and organized environment.",
  },
  {
    icon: Trophy,
    title: "Sports Grounds",
    description:
      "Spaces that encourage athletics, teamwork, fitness, and healthy competition.",
  },
  {
    icon: HeartPulse,
    title: "Medical Support",
    description:
      "Student health services that support wellbeing throughout the school journey.",
  },
];

export default function FacilitiesPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            School Facilities
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            An environment designed for learning and growth.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Our facilities provide students with the resources, comfort, and
            opportunities needed for academic success and personal development.
          </p>
        </div>


        {/* Facility Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {facilities.map((facility) => {
            const Icon = facility.icon;

            return (
              <div
                key={facility.title}
                className="group rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {facility.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {facility.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* Image Preview */}
        <div className="mt-16 overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
            alt="School facilities"
            className="h-[450px] w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            View All Facilities
          </button>
        </div>

      </div>
    </section>
  );
}
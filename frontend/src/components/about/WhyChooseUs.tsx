

import {
  Award,
  BookOpen,
  Users,
  Laptop,
  Trophy,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Academic Excellence",
    description:
      "High-quality teaching and a strong commitment to outstanding academic performance.",
  },
  {
    icon: BookOpen,
    title: "Modern Curriculum",
    description:
      "A balanced curriculum that develops critical thinking, creativity, and lifelong learning.",
  },
  {
    icon: Users,
    title: "Dedicated Teachers",
    description:
      "Experienced and passionate educators committed to every student's success.",
  },
  {
    icon: Laptop,
    title: "ICT Integration",
    description:
      "Technology-enhanced learning that prepares students for a digital future.",
  },
  {
    icon: Trophy,
    title: "Co-curricular Activities",
    description:
      "Sports, clubs, music, debate, and leadership programmes that nurture well-rounded learners.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Learning Environment",
    description:
      "A disciplined, supportive, and inclusive environment where every learner can thrive.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            What makes Mpumudde High School different?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-300">
            We are committed to providing a complete educational experience
            that empowers students academically, socially, spiritually, and
            personally.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-700 bg-slate-800 p-8 transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-900 transition group-hover:scale-110">
                  <Icon size={32} />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
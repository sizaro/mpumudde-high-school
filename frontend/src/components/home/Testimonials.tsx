import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah N.",
    role: "Former Student",
    message:
      "Mpumudde High School shaped my discipline and academic focus. The teachers truly care about student success.",
  },
  {
    name: "Mr. John K.",
    role: "Parent",
    message:
      "I have seen great improvement in my child’s performance and confidence since joining the school.",
  },
  {
    name: "Grace A.",
    role: "Alumni",
    message:
      "The environment here builds both academic excellence and leadership skills. I’m proud to be an alumna.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="site-container">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="section-badge">
            TESTIMONIALS
          </span>

          <h2 className="section-title mt-6">
            What Our Community Says
          </h2>

          <p className="section-lead mx-auto mt-4">
            Voices from students, parents, and alumni who experienced our education.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item) => (
            <div
              key={item.name}
              className="glass-card-solid p-8 hover:scale-105 transition-all duration-300"
            >

              <Quote className="text-violet-400 mb-4" size={36} />

              <p className="leading-7 text-slate-600 dark:text-white/70">
                "{item.message}"
              </p>

              <div className="mt-6">

                <h4 className="font-bold text-slate-900 dark:text-white">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500 dark:text-white/60">
                  {item.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
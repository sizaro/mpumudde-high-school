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
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            TESTIMONIALS
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            What Our Community Says
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            Voices from students, parents, and alumni who experienced our education.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              <Quote className="text-indigo-600 mb-4" size={36} />

              <p className="text-slate-600 leading-7">
                "{item.message}"
              </p>

              <div className="mt-6">

                <h4 className="font-bold text-slate-900">
                  {item.name}
                </h4>

                <p className="text-slate-500 text-sm">
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
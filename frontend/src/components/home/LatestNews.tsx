import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const news = [
  {
    title: "End of Term Examination Timetable Released",
    date: "June 20, 2026",
    category: "Examinations",
    excerpt:
      "The school has officially released the end of term examination timetable for all classes.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "New Computer Lab Opens for Students",
    date: "June 10, 2026",
    category: "Facilities",
    excerpt:
      "A modern ICT laboratory has been opened to enhance digital learning across all classes.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sports Day 2026 Preparations Underway",
    date: "May 28, 2026",
    category: "Events",
    excerpt:
      "Students and staff are preparing for the annual inter-house sports competition.",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function LatestNews() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">

          <div>

            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold">
              LATEST NEWS
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
              Stay Updated With School Life
            </h2>

            <p className="mt-4 text-slate-600 max-w-2xl text-lg">
              Important announcements, academic updates, and school events.
            </p>

          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-orange-700 font-semibold hover:gap-4 transition-all"
          >
            View All News
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* News Grid */}

        <div className="grid md:grid-cols-3 gap-8">

          {news.map((item) => (
            <Link
              key={item.title}
              to="/news"
              className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              {/* Image */}

              <div className="h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}

              <div className="p-6">

                <div className="flex items-center justify-between text-sm text-slate-500">

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.date}
                  </div>

                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600 leading-7">
                  {item.excerpt}
                </p>

                <div className="mt-5 text-orange-700 font-semibold">
                  Read More →
                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}
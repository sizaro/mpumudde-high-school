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
    <section className="py-24">
      <div className="site-container">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">

          <div>

            <span className="section-badge" style={{ background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.3)', color: 'rgba(252, 211, 77, 1)' }}>
              LATEST NEWS
            </span>

            <h2 className="section-title mt-6">
              Stay Updated With School Life
            </h2>

            <p className="section-lead mt-4">
              Important announcements, academic updates, and school events.
            </p>

          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-2 font-semibold hover:gap-4 transition-all text-amber-400"
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
              className="group glass-card overflow-hidden hover:scale-105 transition-all duration-300"
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

                <div className="flex items-center justify-between text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>

                  <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: 'rgba(252, 211, 77, 1)' }} className="px-3 py-1 rounded-full font-medium">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.date}
                  </div>

                </div>

                <h3 className="mt-4 text-xl font-bold group-hover:text-amber-400 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {item.title}
                </h3>

                <p className="mt-3 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {item.excerpt}
                </p>

                <div className="mt-5 font-semibold text-amber-400">
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
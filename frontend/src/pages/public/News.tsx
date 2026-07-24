import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const newsItems = [
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

export default function News() {
  return (
    <section className="site-container py-20 space-y-16">
      <header className="space-y-4 text-center">
        <p className="section-badge">
          Latest school news
        </p>
        <h1 className="section-title">
          Stay informed with the latest announcements and school events.
        </h1>
        <p className="section-lead mx-auto">
          Discover important updates about academics, facilities, community projects,
          and student achievements at Mpumudde High School.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {newsItems.map((item) => (
          <article
            key={item.title}
            className="group glass-card overflow-hidden transition hover:scale-105"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                <span className="rounded-full px-3 py-1" style={{ background: 'rgba(251, 191, 36, 0.2)', color: 'rgba(252, 211, 77, 1)' }}>
                  {item.category}
                </span>
                <div className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
              </div>
              <h2 className="mt-5 text-2xl font-bold group-hover:text-amber-400 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                {item.title}
              </h2>
              <p className="mt-4 leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{item.excerpt}</p>
              <Link
                to="/news"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-400 hover:text-amber-300"
              >
                Read More
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="glass-card-solid p-10">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div>
            <p className="section-badge">
              School announcements
            </p>
            <h2 className="mt-4 text-3xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Never miss a school update
            </h2>
            <p className="mt-4 max-w-2xl leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Check back regularly for new notices, event announcements, and student spotlights.
            </p>
          </div>
          <Link
            to="/contact"
            className="glass-button uppercase tracking-[0.2em] whitespace-nowrap"
          >
            Contact administration
          </Link>
        </div>
      </div>
    </section>
  );
}

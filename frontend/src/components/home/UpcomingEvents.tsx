import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    title: "End of Term Examinations",
    date: "July 15, 2026",
    time: "08:00 AM",
    location: "Main Campus",
    description:
      "All students will begin their end of term examinations across all classes.",
  },
  {
    title: "Parents & Teachers Meeting",
    date: "July 22, 2026",
    time: "10:00 AM",
    location: "School Hall",
    description:
      "Discussion on academic progress, discipline, and student performance.",
  },
  {
    title: "Inter-House Sports Day",
    date: "August 5, 2026",
    time: "09:00 AM",
    location: "School Grounds",
    description:
      "Annual sports competition between school houses with various events.",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-24">
      <div className="site-container">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>

            <span className="section-badge">
              UPCOMING EVENTS
            </span>

            <h2 className="section-title mt-6">
              School Activities & Calendar
            </h2>

            <p className="section-lead mt-4">
              Stay informed about important academic and co-curricular events.
            </p>

          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-semibold hover:gap-4 transition-all text-emerald-400"
          >
            View All Events
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* Events List */}

        <div className="grid md:grid-cols-3 gap-8">

          {events.map((event) => (
            <div
              key={event.title}
              className="glass-card-solid p-8 hover:scale-105 transition-all duration-300"
            >

              {/* Date Badge */}

              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CalendarDays size={18} />
                <span>{event.date}</span>
              </div>

              {/* Title */}

              <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                {event.title}
              </h3>

              {/* Description */}

              <p className="mt-3 leading-7 text-slate-600 dark:text-white/70">
                {event.description}
              </p>

              {/* Meta Info */}

              <div className="mt-6 space-y-2 text-sm text-slate-500 dark:text-white/60">

                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
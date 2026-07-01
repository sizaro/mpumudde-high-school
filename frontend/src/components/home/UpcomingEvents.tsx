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
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>

            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              UPCOMING EVENTS
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
              School Activities & Calendar
            </h2>

            <p className="mt-4 text-slate-600 max-w-2xl text-lg">
              Stay informed about important academic and co-curricular events.
            </p>

          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:gap-4 transition-all"
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
              className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              {/* Date Badge */}

              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CalendarDays size={18} />
                <span>{event.date}</span>
              </div>

              {/* Title */}

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                {event.title}
              </h3>

              {/* Description */}

              <p className="mt-3 text-slate-600 leading-7">
                {event.description}
              </p>

              {/* Meta Info */}

              <div className="mt-6 space-y-2 text-sm text-slate-600">

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
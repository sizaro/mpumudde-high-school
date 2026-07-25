import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const events = [
  {
    title: "Inter-House Sports Day 2026",
    date: "August 15, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "School Sports Field",
    category: "Sports",
    attendees: "All Students",
    description: "Annual inter-house sports competition featuring athletics, football, netball, and more.",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Parents' Day Meeting",
    date: "August 5, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "School Assembly Hall",
    category: "Academic",
    attendees: "Parents & Guardians",
    description: "Quarterly meeting to discuss student progress and academic performance.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Science Fair Exhibition",
    date: "July 30, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Science Laboratory Block",
    category: "Academic",
    attendees: "S1-S4 Students",
    description: "Student science projects showcase and competition with prizes for winners.",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Events() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
        
        <div className="relative site-container">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/newsroom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 mb-6"
            >
              ← Back to Newsroom
            </Link>
            
            <span className="section-badge">SCHOOL EVENTS</span>
            
            <h1 className="section-title mt-6">
              Upcoming Events & Activities
            </h1>
            
            <p className="section-lead mt-4">
              Stay updated with school events, competitions, meetings, and special programs at Mpumudde High School.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16" ref={ref as any}>
        <div className="site-container">
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.article
                key={event.title}
                className="glass-card-solid overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-2/5 h-64 md:h-auto">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:w-3/5">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                        {event.category}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-400">
                        {event.attendees}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      {event.title}
                    </h2>

                    <p className="text-slate-600 dark:text-white/70 leading-7 mb-6">
                      {event.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-white/70">
                        <Calendar size={18} className="text-cyan-400" />
                        <span className="text-sm font-medium">{event.date}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 dark:text-white/70">
                        <Clock size={18} className="text-emerald-400" />
                        <span className="text-sm font-medium">{event.time}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 dark:text-white/70">
                        <MapPin size={18} className="text-violet-400" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 dark:text-white/70">
                        <Users size={18} className="text-amber-400" />
                        <span className="text-sm font-medium">{event.attendees}</span>
                      </div>
                    </div>

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Get More Information
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

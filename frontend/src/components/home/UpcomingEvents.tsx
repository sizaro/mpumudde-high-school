import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { NewsroomItem } from "../../newsroom/types";
import { newsroomService } from "../../services/newsroomService";
import { AnimatedSection } from "../AnimatedSection";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<NewsroomItem[]>([]);
  useEffect(() => { let active = true; void newsroomService.list({ category: "events", pageSize: 3 }).then(result => { if (active) setEvents(result.items); }); return () => { active = false; }; }, []);
  return <section className="home-section"><AnimatedSection delay={0.25}><div className="site-container"><div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><span className="section-badge">Upcoming Events</span><h2 className="section-title">School activities and calendar</h2><p className="section-lead">Important academic, community and co-curricular events.</p></div><Link to="/newsroom/events" className="inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">View all events <ArrowRight size={18} /></Link></div><div className="grid gap-7 md:grid-cols-3">{events.map(event => <Link key={event.id} to={`/newsroom/articles/${event.slug}`} className="public-content-card"><div className="flex items-center gap-2 font-bold text-[var(--brand-green)]"><CalendarDays size={18} /><span>{event.eventDate}</span></div><h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">{event.title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{event.excerpt}</p><div className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400"><div className="flex items-center gap-2"><Clock size={16} />{event.eventTime}</div><div className="flex items-center gap-2"><MapPin size={16} />{event.eventLocation}</div></div></Link>)}</div></div></AnimatedSection></section>;
}

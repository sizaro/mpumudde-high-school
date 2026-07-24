import { CalendarClock, GraduationCap, Megaphone, Trophy } from "lucide-react";

const events = [
  { date: "05 Aug 2026", title: "Admissions applications open", type: "Admissions" },
  { date: "16 Aug 2026", title: "Entrance assessments begin", type: "Admissions" },
  { date: "02 Sep 2026", title: "Career guidance week", type: "Academics" },
  { date: "12 Sep 2026", title: "Inter-house sports day", type: "Sports" },
  { date: "19 Sep 2026", title: "Parents and guardians meeting", type: "Community" },
  { date: "21 Sep 2026", title: "Term reporting date", type: "Academic Term" },
];

const categories = [
  { icon: GraduationCap, title: "Academic events", text: "Exams, revision programs, and term milestones." },
  { icon: Trophy, title: "Sports fixtures", text: "Inter-house and inter-school competitions." },
  { icon: Megaphone, title: "Announcements", text: "School-wide notices and parent engagements." },
];

export default function Calendar() {
  return (
    <section className="section-shell space-y-14">
      <header className="text-center">
        <span className="section-badge">School Calendar</span>
        <h1 className="section-title">Important academic dates and school events.</h1>
        <p className="section-lead mx-auto">
          Stay updated with the key milestones for admissions, academics, student life, and
          community activities throughout the year.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <article key={category.title} className="glass-card p-7">
              <div className="inline-flex rounded-2xl p-3" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <Icon size={22} className="text-emerald-400" />
              </div>
              <h2 className="mt-4 text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{category.title}</h2>
              <p className="mt-2 text-sm leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{category.text}</p>
            </article>
          );
        })}
      </div>

      <div className="glass-card-solid overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)' }}>
          <CalendarClock size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Upcoming events</h2>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {events.map((event, index) => (
            <article key={`${event.date}-${event.title}`} className="p-6 md:flex md:items-center md:justify-between" style={{ borderBottom: index < events.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  {event.date}
                </p>
                <h3 className="mt-2 text-lg font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{event.title}</h3>
              </div>
              <span className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] md:mt-0" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'rgba(110, 231, 183, 1)' }}>
                {event.type}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

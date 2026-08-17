import { ArrowRight, Bell, Compass, Eye, HeartHandshake, Quote, Target } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export function AnnouncementsStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-white/85 dark:border-white/10 dark:bg-white/[.025]" aria-label="School notice">
      <div className="site-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"><Bell size={17} /></span>
          <p><strong>School updates:</strong> Find admissions notices, term dates and community announcements in one place.</p>
        </div>
        <Link to="/newsroom/announcements" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--brand-green)]">View announcements <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}

export function LeadershipMessage() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="home-section relative overflow-hidden bg-[var(--brand-ink)] text-white">
      <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
      <motion.div className="site-container relative grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-16" variants={reveal} initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: .2 }} transition={{ duration: .65 }}>
        <figure className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/25">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=85"
              alt="Director of Mpumudde High School"
              className="aspect-[4/5] w-full rounded-[1.55rem] object-cover object-top sm:aspect-[5/4] lg:aspect-[4/5]"
              loading="lazy"
            />
          </div>
          <figcaption className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/15 bg-[rgba(8,26,43,.88)] px-5 py-4 shadow-xl backdrop-blur-xl sm:left-7 sm:right-auto sm:min-w-64">
            <p className="font-black text-white">School Director</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[.16em] text-emerald-300">Mpumudde High School</p>
          </figcaption>
        </figure>

        <div className="pt-5 lg:pt-0">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-300">A message from the Director</p>
          <Quote className="mt-5 text-amber-300" size={38} aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Every learner should be known, guided and challenged.</h2>
          <blockquote className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            At Mpumudde High School, education goes beyond examination results. We nurture knowledgeable, disciplined and responsible young people who can lead, serve and contribute meaningfully to their communities.
          </blockquote>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            Through committed teaching, character formation, leadership, sport and talent development, we give every learner room to discover their strengths and prepare for a purposeful future. We warmly welcome families to become part of our school community.
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-300/15">Read about our leadership <ArrowRight size={18} /></Link>
        </div>
      </motion.div>
    </section>
  );
}

const values = [
  { icon: Eye, title: "Vision", text: "To nurture capable, disciplined and service-minded young people ready to contribute to society." },
  { icon: Target, title: "Mission", text: "To provide purposeful teaching, strong character formation and opportunities for every learner to grow." },
  { icon: HeartHandshake, title: "Values", text: "Excellence, discipline, integrity, respect, responsibility and service guide school life." },
];

export function MissionVisionValues() {
  return (
    <section className="home-section" data-aos="fade-up">
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="section-badge"><Compass size={14} className="mr-2" />Our direction</p>
          <h2 className="section-title">A school community guided by purpose</h2>
          <p className="section-lead">The values learners practise each day matter as much as the knowledge they acquire.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, index) => (
            <article key={title} data-aos="fade-up" data-aos-delay={index * 80} className="public-content-card">
              <span className="public-feature-icon"><Icon size={22} /></span>
              <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

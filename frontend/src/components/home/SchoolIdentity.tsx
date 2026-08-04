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
    <section className="home-section bg-[var(--brand-ink)] text-white">
      <motion.div className="site-container grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]" variants={reveal} initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: .2 }} transition={{ duration: .65 }}>
        <div className="relative overflow-hidden rounded-[2rem] bg-white/5 p-8 sm:p-10">
          <Quote className="text-emerald-300" size={34} />
          <blockquote className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">“Education is strongest when knowledge, character and responsibility grow together.”</blockquote>
          <p className="mt-6 text-sm leading-7 text-slate-300">A message from the school leadership</p>
          <div className="absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Leadership</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Every learner should be known, guided and challenged.</h2>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">Our leadership works with teachers, parents, prefects and support staff to create a disciplined environment where learners can discover their strengths and prepare for responsible adulthood.</p>
          <Link to="/about" className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-300">Meet our leadership <ArrowRight size={18} /></Link>
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

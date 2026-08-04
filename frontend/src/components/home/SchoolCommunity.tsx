import { ArrowRight, Award, BookOpen, BriefcaseMedical, ChefHat, CircleUserRound, Drama, ShieldCheck, Sparkles, Trophy, UsersRound, Volleyball } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const people = [
  { icon: BookOpen, title: "Committed teachers", text: "Subject specialists guide learners through O-Level and A-Level study with attention to understanding, practice and progress." },
  { icon: BriefcaseMedical, title: "Student welfare", text: "Counselling, health, boarding and pastoral support help learners remain safe, healthy and ready to learn." },
  { icon: ShieldCheck, title: "Security team", text: "Controlled access, visitor procedures and active supervision support a secure learning environment." },
  { icon: ChefHat, title: "Essential staff", text: "Bursary, secretarial, kitchen, cleaning, grounds and maintenance teams keep the school functioning each day." },
];

export function PeopleWhoSupportLearning() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="home-section bg-slate-100/70 dark:bg-white/[.025]">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div data-aos="fade-right">
            <p className="section-badge"><UsersRound size={14} className="mr-2" />Our people</p>
            <h2 className="section-title">The people behind every learner’s progress</h2>
          </div>
          <p data-aos="fade-left" className="section-lead lg:justify-self-end">A strong school depends on teachers and on the staff who protect, support, feed, guide and care for its learners.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {people.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} className="public-content-card" initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .45, delay: index * .07 }}>
              <span className="public-feature-icon"><Icon size={21} /></span>
              <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
            </motion.article>
          ))}
        </div>
        <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">Discover our school community <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

export function StudentLeadership() {
  return (
    <section className="home-section">
      <div className="site-container grid gap-10 lg:grid-cols-2 lg:items-center">
        <div data-aos="zoom-in" className="relative min-h-96 overflow-hidden rounded-[2rem] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=82" alt="Students working together in leadership" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
          <p className="absolute bottom-7 left-7 right-7 text-xl font-bold text-white">Leadership is learned through responsibility, service and example.</p>
        </div>
        <div data-aos="fade-left">
          <p className="section-badge"><CircleUserRound size={14} className="mr-2" />Student leadership</p>
          <h2 className="section-title">Prefects who serve and lead</h2>
          <p className="section-lead">Prefects help strengthen communication, discipline, student welfare and participation while learning to lead fairly and responsibly.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Head prefects", "Academic prefects", "House leaders", "Health and welfare", "Sports leaders", "Club leaders"].map(item => <span key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

const life = [
  { icon: Drama, title: "Clubs & creativity", text: "Debate, music, dance, drama, science, entrepreneurship and faith-based groups help learners explore their interests." },
  { icon: Volleyball, title: "Sports teams", text: "Football, netball, volleyball, athletics and other team activities develop fitness, resilience and cooperation." },
  { icon: Trophy, title: "Houses & competition", text: "Inter-house events make participation wider while building belonging, confidence and healthy competition." },
  { icon: Sparkles, title: "Service & responsibility", text: "Community service and student-led projects connect learning with practical responsibility." },
];

export function LifeBeyondClassroom() {
  return (
    <section className="home-section overflow-hidden bg-[var(--brand-ink)] text-white">
      <div className="site-container">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Life beyond the classroom</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Talent, teamwork and joyful participation</h2>
          <p className="mt-5 leading-8 text-slate-300">Education becomes memorable when learners can perform, compete, create, serve and belong.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {life.map(({ icon: Icon, title, text }, index) => (
            <article key={title} data-aos="fade-up" data-aos-delay={index * 70} className="rounded-[1.5rem] border border-white/10 bg-white/[.055] p-6">
              <Icon className="text-emerald-300" size={24} />
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeacherSpotlight() {
  return (
    <section className="home-section">
      <div className="site-container grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div data-aos="fade-right">
          <p className="section-badge"><Award size={14} className="mr-2" />Teaching team</p>
          <h2 className="section-title">Teachers who make learning personal</h2>
          <p className="section-lead">Our teachers do more than deliver lessons. They explain, listen, assess progress, encourage effort and help learners connect knowledge with future goals.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Sciences", "Mathematics", "Languages", "Humanities", "Business", "Arts"].map(subject => <span key={subject} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">{subject}</span>)}
          </div>
          <Link to="/academics" className="mt-8 inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">Explore teaching and academics <ArrowRight size={18} /></Link>
        </div>
        <div data-aos="fade-left" className="relative min-h-[26rem] overflow-hidden rounded-[2rem]">
          <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=82" alt="Teacher supporting a learner" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

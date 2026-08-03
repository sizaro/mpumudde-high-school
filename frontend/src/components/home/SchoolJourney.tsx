import { ArrowRight, Building2, CalendarCheck2, Handshake, Library, MapPin, Microscope, Phone, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export function FacilitiesPreview() {
  const facilities = [
    { icon: Library, title: "Library & study", text: "Spaces for reading, research and independent study." },
    { icon: Microscope, title: "Science learning", text: "Practical learning that connects theory with observation." },
    { icon: Building2, title: "Learning environment", text: "Classrooms and shared spaces designed for focused school life." },
  ];
  return (
    <section className="home-section bg-slate-100/70 dark:bg-white/[.025]">
      <div className="site-container">
        <div className="max-w-3xl" data-aos="fade-up"><p className="section-badge"><Building2 size={14} className="mr-2" />Our campus</p><h2 className="section-title">Spaces that support learning and wellbeing</h2><p className="section-lead">A dependable school environment gives learners room to study, practise, collaborate and grow.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {facilities.map(({ icon: Icon, title, text }, index) => <article key={title} data-aos="fade-up" data-aos-delay={index * 90} className="public-content-card"><span className="public-feature-icon"><Icon size={22} /></span><h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">{title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p></article>)}
        </div>
        <Link to="/gallery" className="mt-8 inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">See the school environment <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

export function AchievementsPreview() {
  return (
    <section className="home-section">
      <div className="site-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div data-aos="fade-right"><p className="section-badge"><Trophy size={14} className="mr-2" />Progress & achievement</p><h2 className="section-title">Celebrating effort in every form</h2><p className="section-lead">Academic improvement, leadership, sportsmanship, creativity and service all deserve recognition.</p></div>
        <div className="grid gap-4 sm:grid-cols-2" data-aos="fade-left">
          {["Academic progress", "Sportsmanship", "Creative excellence", "Leadership & service"].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"><span className="text-2xl font-black text-[var(--brand-gold)]">0{index + 1}</span><strong className="text-slate-900 dark:text-white">{item}</strong></div>)}
        </div>
      </div>
    </section>
  );
}

export function AdmissionsJourney() {
  const steps = ["Make an enquiry", "Review requirements", "Submit the application", "Confirm admission"];
  return (
    <section className="home-section bg-emerald-950 text-white">
      <div className="site-container">
        <div className="max-w-3xl" data-aos="fade-up"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Admissions</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Your journey to Mpumudde can start today</h2><p className="mt-5 leading-8 text-emerald-50/75">Clear steps help families understand what is required and receive support throughout the admission process.</p></div>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => <li key={step} data-aos="fade-up" data-aos-delay={index * 70} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><span className="text-sm font-black text-emerald-300">STEP {index + 1}</span><h3 className="mt-3 text-lg font-black">{step}</h3></li>)}
        </ol>
        <Link to="/admissions" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-emerald-950">View admissions <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

export function CommunityPartnership() {
  return (
    <section className="home-section">
      <div className="site-container grid gap-10 lg:grid-cols-2 lg:items-center">
        <div data-aos="fade-right" className="relative min-h-80 overflow-hidden rounded-[2rem]"><img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=82" alt="Community supporting young learners" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /></div>
        <div data-aos="fade-left"><p className="section-badge"><Handshake size={14} className="mr-2" />Together</p><h2 className="section-title">Parents and community are partners in education</h2><p className="section-lead">Regular communication and shared responsibility help learners receive consistent guidance at school, at home and in the wider community.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">Connect with the school <ArrowRight size={18} /></Link></div>
      </div>
    </section>
  );
}

export function VisitSchool() {
  return (
    <section className="home-section bg-slate-100/70 dark:bg-white/[.025]">
      <div className="site-container grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2" data-aos="fade-up"><p className="section-badge"><MapPin size={14} className="mr-2" />Visit & enquire</p><h2 className="section-title">See the school and ask the questions that matter</h2><p className="section-lead">Families are welcome to contact the school for admissions guidance, directions and information about school life.</p></div>
        <div data-aos="fade-up" data-aos-delay="100" className="public-content-card flex flex-col justify-center"><CalendarCheck2 className="text-[var(--brand-green)]" /><h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">Plan a school visit</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Speak with the school before visiting so the right team can assist you.</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 font-bold text-[var(--brand-green)]"><Phone size={16} />Contact us</Link></div>
      </div>
    </section>
  );
}

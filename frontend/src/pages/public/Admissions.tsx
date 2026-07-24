import { CheckCircle2, Download, FileText, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const admissionSteps = [
  {
    title: "Submit application",
    text: "Complete the admissions form with learner details and preferred class.",
    icon: FileText,
  },
  {
    title: "Attach documents",
    text: "Provide recent academic reports, passport photo, and guardian information.",
    icon: Download,
  },
  {
    title: "Interview and placement",
    text: "Learners are guided through an interview and class placement process.",
    icon: Users,
  },
];

const requirements = [
  "Certified copy of recent report card",
  "Birth certificate or valid identification",
  "Passport-size photos (2)",
  "Recommendation from previous school (if applicable)",
];

export default function Admissions() {
  return (
    <section className="section-shell space-y-14">
      <header className="glass-card-solid overflow-hidden">
        <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-badge">Admissions</span>
            <h1 className="section-title">Join Mpumudde High School with a smooth admissions process.</h1>
            <p className="section-lead">
              Our admissions team supports every family from first inquiry to final enrollment with
              transparent guidance, clear requirements, and timely communication.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="glass-button"
              >
                Talk to Admissions
              </Link>
              <Link
                to="/academics"
                className="rounded-full px-6 py-3 text-sm font-semibold transition-all" style={{ border: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.95)' }}
              >
                Explore Academics
              </Link>
            </div>
          </div>

          <div className="rounded-3xl p-8" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Why families choose us
            </p>
            <div className="mt-6 space-y-4">
              <p className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 text-emerald-400" size={20} />
                Strong academic foundation with practical learning.
              </p>
              <p className="flex items-start gap-3">
                <Users className="mt-0.5 text-emerald-400" size={20} />
                Supportive community with disciplined student mentorship.
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-400" size={20} />
                Clear admissions timelines and transparent communication.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {admissionSteps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="glass-card p-8">
              <div className="inline-flex rounded-2xl p-3" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <Icon size={22} className="text-emerald-400" />
              </div>
              <h2 className="mt-5 text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{step.title}</h2>
              <p className="mt-3 text-sm leading-7" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{step.text}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <article className="glass-card p-8 md:p-10">
          <h2 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Application checklist</h2>
          <ul className="mt-6 space-y-3">
            {requirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                {requirement}
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-card-solid p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Admissions timeline
          </p>
          <h2 className="mt-4 text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>2026 Intake</h2>
          <div className="mt-6 space-y-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <p>Applications open: 5 August 2026</p>
            <p>Entrance assessments: 16-27 August 2026</p>
            <p>Admission notices: 5 September 2026</p>
            <p>Term reporting date: 21 September 2026</p>
          </div>
          <Link
            to="/contact"
            className="glass-button mt-8"
          >
            Request admissions guide
          </Link>
        </article>
      </div>
    </section>
  );
}
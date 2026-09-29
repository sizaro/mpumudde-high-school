import { HeartHandshake, MessageCircle, School, Users } from "lucide-react";

const communityHighlights = [
  {
    title: "Reconnect",
    text: "Reconnect with former classmates, teachers, and the wider Mpumudde community while keeping the relationships built at school alive.",
    icon: Users,
  },
  {
    title: "Stay connected to the school",
    text: "Receive official communication and remain informed about important school activities, milestones, and opportunities for alumni.",
    icon: School,
  },
  {
    title: "Share your journey",
    text: "Celebrate the work, careers, businesses, service, and achievements of Mpumudde alumni and inspire those coming after you.",
    icon: MessageCircle,
  },
  {
    title: "Give back",
    text: "Use your experience, knowledge, networks, and resources to support the continued growth of the school community.",
    icon: HeartHandshake,
  },
];

export default function AlumniCommunity() {
  return (
    <section className="section-shell">
      <div data-aos="fade-up" className="mb-8 max-w-3xl">
        <span className="section-badge">Our alumni community</span>

        <h2 className="section-title mt-4">
          A community that keeps the Mpumudde connection alive.
        </h2>

        <p className="section-lead mt-4">
          Leaving school marks the beginning of a new chapter, but the
          relationships, experiences, and values built at Mpumudde can continue
          to connect us for years to come.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {communityHighlights.map((highlight, index) => {
          const Icon = highlight.icon;

          return (
            <article
              key={highlight.title}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="glass-card p-7 md:p-8"
            >
              <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                <Icon size={23} className="text-emerald-400" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                {highlight.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/70">
                {highlight.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

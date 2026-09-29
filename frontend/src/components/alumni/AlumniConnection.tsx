import { BellRing, Handshake, Mail, UsersRound } from "lucide-react";

const connectionWays = [
  {
    title: "Official school communication",
    text: "Stay informed through official communication from Mpumudde High School about alumni activities, important announcements, and opportunities to reconnect.",
    icon: Mail,
  },
  {
    title: "Alumni community",
    text: "Build and maintain connections with former students who shared part of the Mpumudde journey with you.",
    icon: UsersRound,
  },
  {
    title: "Community opportunities",
    text: "Discover opportunities to contribute your experience, skills, networks, and resources to the school community.",
    icon: Handshake,
  },
  {
    title: "Important updates",
    text: "Keep your contact information current so the school can reach you when there are alumni events, activities, or relevant updates.",
    icon: BellRing,
  },
];

export default function AlumniConnection() {
  return (
    <section className="section-shell">
      <div data-aos="fade-up" className="mb-8 max-w-3xl">
        <span className="section-badge">Stay connected</span>

        <h2 className="section-title mt-4">
          Your connection with Mpumudde can continue in many ways.
        </h2>

        <p className="section-lead mt-4">
          The Alumni Community is more than a list of former students. It
          creates a lasting connection between alumni, the school, and the
          people who continue to shape its story.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {connectionWays.map((way, index) => {
          const Icon = way.icon;

          return (
            <article
              key={way.title}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="glass-card p-7 md:p-8"
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 rounded-2xl bg-emerald-400/15 p-3">
                  <Icon size={23} className="text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {way.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/70">
                    {way.text}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

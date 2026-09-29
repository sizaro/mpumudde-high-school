import {
  BriefcaseBusiness,
  HeartHandshake,
  Lightbulb,
  Trophy,
} from "lucide-react";

const storyTypes = [
  {
    title: "Professional journeys",
    text: "From education and technology to business, public service, health, and other professions, alumni continue to build meaningful careers after Mpumudde.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Entrepreneurs and innovators",
    text: "Alumni who build businesses, create solutions, and pursue new ideas can share their experiences and inspire the next generation.",
    icon: Lightbulb,
  },
  {
    title: "Community impact",
    text: "Many alumni contribute to their communities through service, leadership, mentorship, and initiatives that make a difference beyond the school.",
    icon: HeartHandshake,
  },
  {
    title: "Achievements worth celebrating",
    text: "Academic achievements, professional milestones, awards, creative work, leadership, and other accomplishments help tell the continuing Mpumudde story.",
    icon: Trophy,
  },
];

export default function AlumniStories() {
  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div data-aos="fade-right" className="glass-card-solid p-8 md:p-10">
          <span className="section-badge">Alumni stories</span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
            Where are our alumni today?
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-white/70">
            Every alumnus carries a different story. Some are building careers,
            some are creating businesses, some are serving their communities,
            and others are pursuing further education or new opportunities.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/70">
            The Alumni Community gives Mpumudde a place to celebrate those
            journeys and keep the stories connected to the school.
          </p>

          <div className="mt-8 rounded-3xl bg-emerald-400/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Your story matters
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/70">
              As the community grows, alumni stories can become a source of
              encouragement for current learners and future generations of
              Mpumudde students.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {storyTypes.map((story, index) => {
            const Icon = story.icon;

            return (
              <article
                key={story.title}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="glass-card p-7"
              >
                <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                  <Icon size={23} className="text-emerald-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/70">
                  {story.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Camera, HeartHandshake, Trophy, Users } from "lucide-react";

const galleryItems = [
  {
    title: "Science and innovation fair",
    tag: "Academics",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Inter-house athletics day",
    tag: "Sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "School choir performance",
    tag: "Arts",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Community outreach program",
    tag: "Service",
    image:
      "https://images.unsplash.com/photo-1469571486292-b53601020bd9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Student leadership forum",
    tag: "Leadership",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "STEM lab practical sessions",
    tag: "Labs",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

const highlights = [
  { icon: Camera, label: "900+", text: "Photo moments curated yearly" },
  { icon: Users, label: "1,500+", text: "Students represented in activities" },
  { icon: Trophy, label: "35+", text: "Competitions and school awards" },
  { icon: HeartHandshake, label: "20+", text: "Community service initiatives" },
];

export default function Gallery() {
  return (
    <section className="section-shell space-y-14">
      <header className="text-center">
        <span className="section-badge">School Gallery</span>
        <h1 className="section-title">
          Explore vibrant moments from academics, sports, arts, and student life.
        </h1>
        <p className="section-lead mx-auto">
          The gallery reflects everyday life at Mpumudde High School: classroom excellence,
          leadership experiences, clubs, celebrations, and service to the wider community.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="glass-card-solid p-6 text-center">
              <div className="mx-auto inline-flex rounded-2xl p-3" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                <Icon size={22} className="text-violet-400" />
              </div>
              <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">{item.label}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-white/70">{item.text}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {galleryItems.map((item) => (
          <article
            key={item.title}
            className="group glass-card overflow-hidden hover:scale-105 transition-all duration-300"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] bg-violet-500/85 text-white backdrop-blur-[12px]">
                {item.tag}
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
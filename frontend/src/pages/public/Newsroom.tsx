import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Calendar,
  Megaphone,
  TrendingUp,
  Video,
  ArrowRight,
} from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const newsroomSections = [
  {
    title: "News",
    description: "Latest school news, academic achievements, and student spotlights.",
    icon: Newspaper,
    link: "/newsroom/news",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-400/10",
    count: "12 new",
  },
  {
    title: "Events",
    description: "Upcoming school events, sports competitions, and special programs.",
    icon: Calendar,
    link: "/newsroom/events",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    count: "8 upcoming",
  },
  {
    title: "Announcements",
    description: "Important notices, deadlines, and urgent school communications.",
    icon: Megaphone,
    link: "/newsroom/announcements",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    count: "5 active",
  },
  {
    title: "School Updates",
    description: "Administration updates, policy changes, and infrastructure news.",
    icon: TrendingUp,
    link: "/newsroom/updates",
    iconColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    count: "3 recent",
  },
  {
    title: "Media Gallery",
    description: "Photos, videos, and multimedia content from school life.",
    icon: Video,
    link: "/newsroom/media",
    iconColor: "text-pink-400",
    bgColor: "bg-pink-400/10",
    count: "240 items",
  },
];

export default function Newsroom() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        
        <div className="relative site-container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge">NEWSROOM</span>
            
            <h1 className="section-title mt-6">
              Stay Connected With School Life
            </h1>
            
            <p className="section-lead mx-auto mt-4">
              Your central hub for news, events, announcements, and everything happening at Mpumudde High School.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsroom Sections */}
      <section className="py-16" ref={ref as any}>
        <div className="site-container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsroomSections.map((section, index) => {
              const Icon = section.icon;
              
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={section.link}
                    className="group glass-card-solid p-8 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center ${section.bgColor} ${section.iconColor}`}>
                        <Icon size={28} />
                      </div>
                      
                      <span className="text-xs font-semibold text-emerald-400 px-3 py-1 glass-card rounded-full">
                        {section.count}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {section.title}
                    </h3>

                    <p className="text-slate-600 dark:text-white/70 leading-7 flex-grow">
                      {section.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 font-semibold text-emerald-400 group-hover:gap-4 transition-all">
                      View {section.title}
                      <ArrowRight size={18} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="site-container">
          <div className="glass-card-solid p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Stay Informed
            </h2>
            <p className="text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter and never miss important school updates, events, and announcements.
            </p>
            <Link
              to="/contact"
              className="glass-button inline-flex items-center gap-2"
            >
              Subscribe to Newsletter
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Building, Users, BookOpen, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const updates = [
  {
    title: "New Computer Lab Officially Opened",
    date: "July 22, 2026",
    category: "Infrastructure",
    icon: Building,
    content: "The school has officially opened a state-of-the-art computer laboratory with 50 modern computers to enhance ICT education. The lab is equipped with high-speed internet and latest software for student learning.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "New Staff Members Join the Team",
    date: "July 18, 2026",
    category: "Administration",
    icon: Users,
    content: "We are pleased to welcome 5 new teaching staff members who bring expertise in Mathematics, Sciences, and Languages. They join us with impressive credentials and a passion for education.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Enhanced Security Measures Implemented",
    date: "July 12, 2026",
    category: "Security",
    icon: Shield,
    content: "The school has installed CCTV cameras at strategic points and introduced electronic gate access cards for enhanced security. All visitors must now register at the main gate.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Updated Academic Calendar Released",
    date: "July 8, 2026",
    category: "Academic",
    icon: BookOpen,
    content: "The revised academic calendar for the second term has been released with updated examination dates, mid-term break schedules, and parent-teacher meeting dates.",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Updates() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10" />
        
        <div className="relative site-container">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/newsroom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 mb-6"
            >
              ← Back to Newsroom
            </Link>
            
            <span className="section-badge">SCHOOL UPDATES</span>
            
            <h1 className="section-title mt-6">
              Administration & Infrastructure Updates
            </h1>
            
            <p className="section-lead mt-4">
              Stay informed about policy changes, infrastructure developments, and administrative updates at Mpumudde High School.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Updates List */}
      <section className="py-16" ref={ref as any}>
        <div className="site-container">
          <div className="space-y-8">
            {updates.map((update, index) => {
              const Icon = update.icon;
              
              return (
                <motion.article
                  key={update.title}
                  className="glass-card-solid overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-2/5 h-64 md:h-auto">
                      <img
                        src={update.image}
                        alt={update.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8 md:w-3/5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-400/20 flex items-center justify-center">
                          <Icon size={20} className="text-violet-400" />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-400/20 text-violet-400">
                          {update.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-white/60">
                          {update.date}
                        </span>
                      </div>

                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {update.title}
                      </h2>

                      <p className="text-slate-600 dark:text-white/70 leading-7 mb-6">
                        {update.content}
                      </p>

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 font-semibold text-violet-400 hover:text-violet-300"
                      >
                        Learn More
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

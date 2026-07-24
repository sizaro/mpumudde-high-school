import {
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useCounter } from "../../hooks/useCounter";

const stats = [
  {
    label: "Students",
    value: 1500,
    suffix: "+",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Teachers",
    value: 80,
    suffix: "+",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Programs",
    value: 25,
    suffix: "+",
    icon: BookOpen,
    color: "bg-orange-100 text-orange-700",
  },
  {
    label: "Years of Excellence",
    value: 30,
    suffix: "+",
    icon: Trophy,
    color: "bg-purple-100 text-purple-700",
  },
];

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const count = useCounter(stat.value, isVisible, { duration: 2000, delay: index * 100 });
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref as any}
      className="glass-card-solid p-10 text-center hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${stat.color}`}
        style={{ 
          background: stat.label === 'Students' ? 'rgba(34, 211, 238, 0.2)' : 
                      stat.label === 'Teachers' ? 'rgba(16, 185, 129, 0.2)' : 
                      stat.label === 'Programs' ? 'rgba(251, 191, 36, 0.2)' : 
                      'rgba(139, 92, 246, 0.2)' 
        }}
      >
        <Icon size={30} className={
          stat.label === 'Students' ? 'text-cyan-400' : 
          stat.label === 'Teachers' ? 'text-emerald-400' : 
          stat.label === 'Programs' ? 'text-amber-400' : 
          'text-violet-400'
        } />
      </div>

      <h3 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
        {count.toLocaleString()}{stat.suffix}
      </h3>

      <p className="mt-2 font-medium text-slate-600 dark:text-white/70">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function Statistics() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24" ref={ref as any}>
      <div className="site-container">

        {/* Header */}

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >

          <span className="section-badge">
            OUR IMPACT
          </span>

          <h2 className="section-title mt-6">
            Numbers That Reflect Excellence
          </h2>

          <p className="section-lead mx-auto mt-4">
            A track record built on discipline, academic success, and holistic
            development of learners.
          </p>

        </motion.div>

        {/* Stats Grid */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <StatCard key={item.label} stat={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
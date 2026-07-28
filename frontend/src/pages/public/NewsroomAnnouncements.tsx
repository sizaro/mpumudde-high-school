import { motion } from "framer-motion";
import { Megaphone, AlertCircle, Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const announcements = [
  {
    title: "End of Term Examination Timetable Released",
    date: "July 20, 2026",
    priority: "high",
    category: "Examinations",
    message: "The end of term examination timetable for all classes has been officially released. Students are advised to check the notice board and prepare accordingly. Exams begin on August 1st, 2026.",
  },
  {
    title: "School Fees Payment Deadline",
    date: "July 18, 2026",
    priority: "urgent",
    category: "Finance",
    message: "All parents and guardians are reminded that the deadline for second term school fees payment is July 31st, 2026. Late payments will attract a penalty fee.",
  },
  {
    title: "New Library Operating Hours",
    date: "July 15, 2026",
    priority: "normal",
    category: "Facilities",
    message: "The school library will now operate from 7:00 AM to 7:00 PM on weekdays to provide extended study time for students preparing for examinations.",
  },
  {
    title: "COVID-19 Safety Protocols Update",
    date: "July 10, 2026",
    priority: "high",
    category: "Health & Safety",
    message: "Following government guidelines, all students and staff must continue observing COVID-19 safety protocols including wearing masks, social distancing, and regular hand washing.",
  },
  {
    title: "Visitor Registration Requirements",
    date: "July 5, 2026",
    priority: "normal",
    category: "Security",
    message: "All visitors to the school must register at the security gate and provide valid identification. Parents picking up students must present their gate pass cards.",
  },
];

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "urgent":
      return {
        icon: AlertCircle,
        bgColor: "bg-red-400/20",
        textColor: "text-red-400",
        borderColor: "border-red-400/30",
      };
    case "high":
      return {
        icon: Megaphone,
        bgColor: "bg-amber-400/20",
        textColor: "text-amber-400",
        borderColor: "border-amber-400/30",
      };
    default:
      return {
        icon: Info,
        bgColor: "bg-cyan-400/20",
        textColor: "text-cyan-400",
        borderColor: "border-cyan-400/30",
      };
  }
};

export default function Announcements() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10" />
        
        <div className="relative site-container">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/newsroom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-6"
            >
              ← Back to Newsroom
            </Link>
            
            <span className="section-badge">OFFICIAL ANNOUNCEMENTS</span>
            
            <h1 className="section-title mt-6">
              Important School Notices
            </h1>
            
            <p className="section-lead mt-4">
              Stay informed with the latest official announcements, deadlines, and important notices from the school administration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16" ref={ref as any}>
        <div className="site-container max-w-4xl">
          <div className="space-y-6">
            {announcements.map((announcement, index) => {
              const styles = getPriorityStyles(announcement.priority);
              const Icon = styles.icon;

              return (
                <motion.article
                  key={announcement.title}
                  className={`glass-card-solid p-8 border-l-4 ${styles.borderColor}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${styles.bgColor}`}>
                      <Icon size={24} className={styles.textColor} />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles.bgColor} ${styles.textColor} uppercase`}>
                          {announcement.priority}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-white/60">
                          {announcement.date}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-violet-400/20 text-violet-400 font-medium">
                          {announcement.category}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {announcement.title}
                      </h2>

                      <p className="text-slate-600 dark:text-white/70 leading-7">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="glass-button inline-flex items-center gap-2">
              Load More Announcements
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

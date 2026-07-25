import {
  GraduationCap,
  BookOpen,
  Newspaper,
  Images,
  CalendarDays,
  PhoneCall,
  ArrowRight,
  Users,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const primaryActions = [
  {
    title: "Admissions",
    description: "Start your journey with us. Apply online and become part of our excellence tradition.",
    icon: GraduationCap,
    link: "/admissions",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    title: "Academics",
    description: "Explore our comprehensive curriculum designed for 21st-century learners.",
    icon: BookOpen,
    link: "/academics",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
  },
  {
    title: "Student Life",
    description: "Discover the vibrant community and extracurricular opportunities.",
    icon: Users,
    link: "/about",
    iconColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
  },
];

const secondaryActions = [
  {
    title: "News & Events",
    description: "Stay updated with announcements and upcoming events.",
    icon: Newspaper,
    link: "/news",
    iconColor: "text-amber-400",
  },
  {
    title: "Gallery",
    description: "Explore campus life through our photo gallery.",
    icon: Images,
    link: "/gallery",
    iconColor: "text-violet-400",
  },
  {
    title: "School Calendar",
    description: "View important dates and academic calendar.",
    icon: CalendarDays,
    link: "/calendar",
    iconColor: "text-pink-400",
  },
  {
    title: "Resources",
    description: "Access student handbooks and school policies.",
    icon: FileText,
    link: "/about",
    iconColor: "text-blue-400",
  },
  {
    title: "Contact Us",
    description: "Get in touch with our administration.",
    icon: PhoneCall,
    link: "/contact",
    iconColor: "text-emerald-400",
  },
];

export default function QuickActions() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24" ref={ref as any}>

      <div className="site-container">

        {/* Heading */}

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >

          <span className="section-badge">
            QUICK ACCESS
          </span>

          <h2 className="section-title mt-6">
            Everything You Need, One Click Away
          </h2>

          <p className="section-lead mx-auto mt-4">
            Whether you're a parent, student, visitor or prospective learner,
            quickly access the most important sections of our website.
          </p>

        </motion.div>

        {/* Primary Actions - Large Cards */}

        <div className="grid gap-6 lg:grid-cols-3 mb-8">

          {primaryActions.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.link}
                  className="group glass-card-solid p-8 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >

                  <div className={`inline-flex w-16 h-16 rounded-2xl items-center justify-center ${item.bgColor} ${item.iconColor} mb-6`}>
                    <Icon size={32} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 dark:text-white/70 leading-7 flex-grow">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 font-semibold text-emerald-400 group-hover:gap-4 transition-all">
                    Learn More
                    <ArrowRight size={18} />
                  </div>

                </Link>
              </motion.div>

            );

          })}

        </div>

        {/* Secondary Actions - Compact Grid */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {secondaryActions.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              >
                <Link
                  to={item.link}
                  className="group glass-card p-5 h-full flex flex-col transition-all duration-300 hover:scale-105"
                >

                  <Icon className={`${item.iconColor} mb-3`} size={24} />

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                    {item.description}
                  </p>

                </Link>
              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
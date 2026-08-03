import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  PhoneCall,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Admissions",
    description: "Requirements and application guidance",
    icon: GraduationCap,
    to: "/admissions",
  },
  {
    title: "Academics",
    description: "Explore O-Level and A-Level learning",
    icon: BookOpen,
    to: "/academics",
  },
  {
    title: "Calendar",
    description: "Term dates and upcoming school events",
    icon: CalendarDays,
    to: "/calendar",
  },
  {
    title: "Contact",
    description: "Speak with the school administration",
    icon: PhoneCall,
    to: "/contact",
  },
];

export default function QuickActions() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      className="relative z-10 md:-mt-7 mt-2 px-4 sm:px-6"
      aria-label="Quick links"
    >
      <div className="mx-auto grid max-w-[72rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/8 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-[var(--brand-ink)]">
        {actions.map(({ title, description, icon: Icon, to }, index) => (
          <motion.div
            key={title}
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="border-b border-slate-200 last:border-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r dark:border-white/10"
          >
            <Link
              to={to}
              className="group flex h-full items-start gap-4 p-5 transition-colors hover:bg-slate-50 sm:p-6 dark:hover:bg-white/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[var(--brand-green)] dark:bg-white/8">
                <Icon size={21} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-bold text-[var(--brand-ink)] dark:text-white">
                  {title}
                  <ArrowRight
                    size={14}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-white/55">
                  {description}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

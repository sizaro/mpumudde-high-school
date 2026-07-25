import { ArrowRight, GraduationCap, BookOpen, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { heroVideo, getVideoProps } from "../../config/videos";

export default function Hero() {
  const videoProps = getVideoProps(heroVideo);
  
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Video Background with Fallback */}
      <div className="absolute inset-0">
        <video
          {...videoProps}
          className="w-full h-full object-cover"
        >
          {heroVideo.sources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          {/* Fallback image if video fails */}
          <img
            src={heroVideo.poster}
            alt={heroVideo.title}
            className="w-full h-full object-cover"
          />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-violet-900/80 to-slate-900/90" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 w-full">

        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >

          {/* Badge with glass effect */}
          <motion.div 
            className="section-badge mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Excellence • Discipline • Service
          </motion.div>

          {/* Heading with gradient */}
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Building Tomorrow's
            </span>
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Leaders Today
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="mt-8 text-lg md:text-xl text-slate-700 dark:text-white/80 leading-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to Mpumudde High School, where academic excellence,
            innovation, discipline, and character development prepare every
            learner for a successful future.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="flex flex-wrap gap-5 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >

            <Link
              to="/admissions"
              className="group glass-button flex items-center gap-2 text-base"
            >
              Apply Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about"
              className="glass-card rounded-full px-8 py-4 font-semibold text-slate-900 dark:text-white transition-all hover:bg-slate-200/30 dark:hover:bg-white/10"
            >
              Explore Our School
            </Link>

          </motion.div>

        </motion.div>

        {/* Bottom Cards with enhanced glass effect */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >

          {[
            { icon: GraduationCap, value: "98%", label: "Examination Success", color: "emerald" },
            { icon: Users, value: "1,500+", label: "Students", color: "cyan" },
            { icon: BookOpen, value: "40+", label: "Qualified Teachers", color: "violet" },
            { icon: Trophy, value: "30+", label: "Years of Excellence", color: "amber" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card-solid p-6 transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <stat.icon
                className={`text-${stat.color}-400 mb-3`}
                size={32}
              />

              <h3 className="text-slate-900 dark:text-white text-3xl font-bold">
                {stat.value}
              </h3>

              <p className="text-slate-600 dark:text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}

        </motion.div>

      </div>

    </section>
  );
}
import { motion } from "framer-motion";
import { Video, Image as ImageIcon, PlayCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const mediaItems = [
  {
    title: "Sports Day 2026 Highlights",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    duration: "5:32",
    date: "July 25, 2026",
  },
  {
    title: "Science Fair Exhibition",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80",
    count: "45 photos",
    date: "July 22, 2026",
  },
  {
    title: "New Computer Lab Opening Ceremony",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    duration: "3:15",
    date: "July 20, 2026",
  },
  {
    title: "Music and Drama Performance",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    count: "32 photos",
    date: "July 18, 2026",
  },
  {
    title: "Parents' Day Meeting",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    duration: "4:20",
    date: "July 15, 2026",
  },
  {
    title: "School Campus Tour 2026",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    count: "28 photos",
    date: "July 12, 2026",
  },
];

export default function Media() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-violet-500/10" />
        
        <div className="relative site-container">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/newsroom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-400 hover:text-pink-300 mb-6"
            >
              ← Back to Newsroom
            </Link>
            
            <span className="section-badge">MEDIA GALLERY</span>
            
            <h1 className="section-title mt-6">
              Photos & Videos
            </h1>
            
            <p className="section-lead mt-4">
              Explore our collection of photos, videos, and multimedia content showcasing life at Mpumudde High School.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16" ref={ref as any}>
        <div className="site-container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item, index) => (
              <motion.article
                key={item.title}
                className="group glass-card overflow-hidden transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    {item.type === 'video' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-400/90 text-white text-xs font-bold">
                        <Video size={14} />
                        {item.duration}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-400/90 text-white text-xs font-bold">
                        <ImageIcon size={14} />
                        {item.count}
                      </div>
                    )}
                  </div>

                  {/* Play Button for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <PlayCircle size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-slate-600 dark:text-white/60 mb-2">
                    {item.date}
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-pink-400 transition-colors">
                    {item.title}
                  </h3>

                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-pink-400"
                  >
                    View {item.type === 'video' ? 'Video' : 'Gallery'}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Link to="/gallery" className="glass-button inline-flex items-center gap-2">
              View Full Gallery
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

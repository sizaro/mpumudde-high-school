import { Link } from "react-router-dom";
import { Images, ArrowRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581091870622-1e7f3c7f2f65?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f8?auto=format&fit=crop&w=1200&q=80",
];

export default function GalleryPreview() {
  return (
    <section className="py-24">
      <div className="site-container">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>

            <span className="section-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)', color: 'rgba(196, 181, 253, 1)' }}>
              <Images size={16} className="inline" /> GALLERY
            </span>

            <h2 className="section-title mt-6">
              Life at Mpumudde High School
            </h2>

            <p className="section-lead mt-4">
              A glimpse into academics, sports, and vibrant student life.
            </p>

          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-semibold hover:gap-4 transition-all text-purple-400"
          >
            View Full Gallery
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* Grid */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {images.map((img, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl group"
            >

              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
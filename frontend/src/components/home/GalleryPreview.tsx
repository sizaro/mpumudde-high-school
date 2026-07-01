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
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
              <Images size={16} />
              GALLERY
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
              Life at Mpumudde High School
            </h2>

            <p className="mt-4 text-slate-600 max-w-2xl text-lg">
              A glimpse into academics, sports, and vibrant student life.
            </p>

          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:gap-4 transition-all"
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

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
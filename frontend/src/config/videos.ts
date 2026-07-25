/**
 * Video Configuration for School Promotional Videos
 * 
 * This file contains video sources and configuration for the hero section
 * and other video content throughout the website.
 */

export interface VideoSource {
  src: string;
  type: string;
}

export interface VideoConfig {
  sources: VideoSource[];
  poster: string;
  title: string;
  description?: string;
}

/**
 * Hero Section Video
 * Replace these URLs with your actual school promotional video
 */
export const heroVideo: VideoConfig = {
  sources: [
    {
      // MP4 format (best browser support)
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
    },
    {
      // WebM format (better compression for modern browsers)
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm",
      type: "video/webm",
    },
  ],
  poster: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80",
  title: "Mpumudde High School Campus",
  description: "A glimpse into excellence at Mpumudde High School",
};

/**
 * Additional promotional videos for other sections
 */
export const promotionalVideos = {
  academics: {
    sources: [
      {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        type: "video/mp4",
      },
    ],
    poster: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    title: "Academic Excellence",
    description: "Our commitment to quality education",
  },
  facilities: {
    sources: [
      {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        type: "video/mp4",
      },
    ],
    poster: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    title: "Modern Facilities",
    description: "State-of-the-art learning environment",
  },
  studentLife: {
    sources: [
      {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        type: "video/mp4",
      },
    ],
    poster: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    title: "Student Life",
    description: "Vibrant campus community",
  },
};

/**
 * Video Loading Configuration
 */
export const videoLoadingConfig = {
  // Lazy load videos below the fold
  lazyLoad: true,
  
  // Preload strategy for hero video
  preload: "metadata" as const, // "none" | "metadata" | "auto"
  
  // Enable Picture-in-Picture
  pip: false,
  
  // Video playback settings
  autoplay: true,
  loop: true,
  muted: true, // Must be true for autoplay to work
  playsInline: true, // Required for mobile devices
  
  // Performance settings
  loading: "lazy" as const,
};

/**
 * Helper function to get video element props
 */
export function getVideoProps(config: VideoConfig, customProps?: Partial<typeof videoLoadingConfig>) {
  return {
    ...videoLoadingConfig,
    ...customProps,
    poster: config.poster,
    title: config.title,
    "aria-label": config.description || config.title,
  };
}

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  MapPin,
  Pause,
  Play,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

const heroPoster =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=88";
const heroVideo =
  import.meta.env.VITE_PUBLIC_HERO_VIDEO_URL ||
  "https://res.cloudinary.com/dp76nuyie/video/upload/v1785771683/mhstrial_geiacr.mp4";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      videoRef.current?.pause();
      setPlaying(false);
      return;
    }
    const context = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.fromTo(
        "[data-hero-orb]",
        { x: -14, y: 4 },
        {
          x: 16,
          y: -8,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      );
    }, rootRef);
    return () => context.revert();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section
      ref={rootRef}
      className="public-hero relative flex min-h-[calc(100svh-var(--public-header-height))] items-center overflow-hidden bg-[var(--brand-ink)]"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Mpumudde High School campus life"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,31,.96)_0%,rgba(4,18,31,.82)_52%,rgba(4,18,31,.42)_100%)]" />
      <div
        data-hero-orb
        className="absolute -left-20 top-1/3 h-44 w-44 rounded-full bg-emerald-400/12 blur-[85px]"
        aria-hidden="true"
      />

      <div className="public-hero__inner site-container relative py-12 sm:py-14 lg:py-10 xl:py-12">
        <div className="max-w-3xl">
          <p
            data-hero-reveal
            className="public-hero__eyebrow inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-200 backdrop-blur-md"
          >
            Excellence · Discipline · Service
          </p>
          <h1
            data-hero-reveal
            className="public-hero__title mt-5 max-w-3xl text-3xl font-black leading-[1.04] tracking-[-.035em] text-white sm:text-3xl lg:text-[3.5rem] xl:text-6xl"
          >
            Learning that shapes character, purpose, and possibility.
          </h1>
          <p
            data-hero-reveal
            className="public-hero__copy mt-4 max-w-2xl text-base leading-7 text-slate-200 lg:text-[1.05rem]"
          >
            Mpumudde High School nurtures knowledgeable, disciplined and
            responsible learners through committed teaching, leadership, talent
            development and a safe school community.
          </p>
          <div
            data-hero-reveal
            className="public-hero__actions mt-6 flex w-full max-w-md items-center gap-2 sm:gap-3"
          >
            <Link
              to="/admissions"
              className="public-primary-button min-w-0 flex-1 justify-center whitespace-nowrap px-3 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm"
            >
              <span className="sm:hidden">Admissions</span>
              <span className="hidden sm:inline">Explore admissions</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-white/25 bg-white/8 px-3 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/15 sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm"
            >
              <span className="sm:hidden">Our school</span>
              <span className="hidden sm:inline">Discover our school</span>
            </Link>
          </div>
        </div>

        <div
          data-hero-reveal
          className="public-hero__proof mt-8 grid max-w-3xl gap-3 border-t border-white/15 pt-4 text-sm text-slate-200 sm:grid-cols-3"
        >
          <span className="flex items-center gap-2">
            <BookOpenCheck size={18} className="text-emerald-300" />
            O-Level and A-Level
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-300" />
            Learning with discipline
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={18} className="text-emerald-300" />
            Jinja, Uganda
          </span>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 flex gap-2">
        <button
          type="button"
          onClick={toggleMute}
          className="public-video-control"
          aria-label={muted ? "Turn hero video sound on" : "Mute hero video"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          className="public-video-control"
          aria-label={playing ? "Pause hero video" : "Play hero video"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </section>
  );
}

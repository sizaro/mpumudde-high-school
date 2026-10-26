import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Heart, MapPin, Newspaper, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AlumniJoin from "../../../components/alumni/AlumniJoin";
import type { SchoolEvent, SchoolPublication } from "../../../services/contentManagementService";
import publicAlumniContentService, { type AlumniCommunitySummary } from "../../../services/publicAlumniContentService";
import { demoEvents, demoStories, ILLUSTRATIVE_ALUMNI_IMAGE } from "./alumniDemoContent";

const emptySummary: AlumniCommunitySummary = { registeredAlumni: 0, publishedStories: 0, upcomingEvents: 0 };
const date = (value?: string | null) => value ? new Intl.DateTimeFormat("en-UG", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Date to be confirmed";

export default function AlumniLanding() {
  useEffect(() => {
    if (window.location.hash !== "#join-alumni") return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("join-alumni")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const [summary, setSummary] = useState(emptySummary);
  const [stories, setStories] = useState<SchoolPublication[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryUnavailable, setSummaryUnavailable] = useState(false);
  const [storiesUnavailable, setStoriesUnavailable] = useState(false);
  const [eventsUnavailable, setEventsUnavailable] = useState(false);

  useEffect(() => {
    void Promise.allSettled([
      publicAlumniContentService.summary(),
      publicAlumniContentService.stories(1, 3),
      publicAlumniContentService.events(1, 3),
    ]).then(([summaryResult, storyResult, eventResult]) => {
      if (summaryResult.status === "fulfilled") {
        setSummary({
          registeredAlumni: Number(summaryResult.value?.registeredAlumni) || 0,
          publishedStories: Number(summaryResult.value?.publishedStories) || 0,
          upcomingEvents: Number(summaryResult.value?.upcomingEvents) || 0,
        });
      } else {
        setSummaryUnavailable(true);
      }

      if (storyResult.status === "fulfilled") {
        setStories(Array.isArray(storyResult.value?.items) ? storyResult.value.items : []);
      } else {
        setStoriesUnavailable(true);
      }

      if (eventResult.status === "fulfilled") {
        setEvents(Array.isArray(eventResult.value?.items) ? eventResult.value.items : []);
      } else {
        setEventsUnavailable(true);
      }

      setLoading(false);
    });
  }, []);

  const usingDemoStories = !loading && stories.length === 0;
  const usingDemoEvents = !loading && events.length === 0;
  const shownStories = usingDemoStories ? demoStories : stories;
  const shownEvents = usingDemoEvents ? demoEvents : events;
  const heroImage = stories[0]?.featuredImageUrl || ILLUSTRATIVE_ALUMNI_IMAGE;

  return <div className="bg-white text-[#081a2b]"><Hero image={heroImage} illustrative={!stories[0]?.featuredImageUrl} /><Statistics summary={summary} summaryUnavailable={summaryUnavailable} storyFallback={usingDemoStories} eventFallback={usingDemoEvents} /><Stories stories={shownStories} loading={loading} demo={usingDemoStories} liveUnavailable={storiesUnavailable} /><Events events={shownEvents} loading={loading} demo={usingDemoEvents} liveUnavailable={eventsUnavailable} /><AlumniJoin /></div>;
}

function Hero({ image, illustrative }: { image: string; illustrative: boolean }) {
  return <section className="relative isolate min-h-[31rem] overflow-hidden bg-[#071d3a] text-white sm:min-h-[34rem]"><img src={image} alt={illustrative ? "Illustrative alumni graduation community" : "Featured alumni story"} className="absolute inset-0 -z-20 h-full w-full object-cover"/><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,18,35,.93)_0%,rgba(4,18,35,.78)_35%,rgba(4,18,35,.25)_68%,rgba(4,18,35,.12)_100%)]"/><div className="site-container flex min-h-[31rem] items-center py-14 sm:min-h-[34rem] lg:py-20"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#f2c64c]">Mpumudde Alumni Community</p><h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.55rem]">Your Mpumudde story continues long after you leave the classroom.</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">Reconnect with former schoolmates, celebrate alumni achievements, and remain part of the community that helped shape your journey.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#join-alumni" className="inline-flex items-center gap-2 rounded-md bg-[#1261d0] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:bg-[#0d51af]">Join the Alumni Community <ArrowRight size={17}/></a><Link to="/alumni/stories" className="inline-flex items-center gap-2 rounded-md border border-white/80 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">View Alumni Stories</Link></div>{illustrative && <p className="mt-6 text-xs text-white/70">Illustrative community image. It will be replaced when the school features an authentic Alumni story.</p>}</div></div></section>;
}

function Statistics({ summary, summaryUnavailable, storyFallback, eventFallback }: { summary: AlumniCommunitySummary; summaryUnavailable: boolean; storyFallback: boolean; eventFallback: boolean }) {
  const stats = [
    { icon: Users, value: summaryUnavailable ? null : summary.registeredAlumni, label: "Registered alumni", note: summaryUnavailable ? "The verified alumni count is temporarily unavailable." : "Former students connected through a verified email." },
    { icon: Newspaper, value: storyFallback ? demoStories.length : summaryUnavailable ? null : summary.publishedStories, label: "Alumni stories", note: storyFallback ? "Illustrative examples until the school publishes stories." : summaryUnavailable ? "The published-story count is temporarily unavailable." : "Approved alumni journeys shared by the school." },
    { icon: CalendarDays, value: eventFallback ? demoEvents.length : summaryUnavailable ? null : summary.upcomingEvents, label: "Alumni events", note: eventFallback ? "Illustrative examples until the school publishes events." : summaryUnavailable ? "The published-event count is temporarily unavailable." : "Published public gatherings and opportunities." },
    { icon: Heart, value: null, label: "A lasting impact", note: "Alumni continue to serve their communities and support the school." },
  ];
  return <section className="border-b border-slate-200 bg-[#f8fafc]"><div className="site-container grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">{stats.map((item) => { const Icon = item.icon; return <article className="flex gap-4 px-5 py-7" key={item.label}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-[#1261d0]"><Icon size={23}/></span><div>{item.value !== null && <p className="text-2xl font-extrabold text-[#081a2b]">{item.value.toLocaleString()}{item.value > 0 ? "+" : ""}</p>}<h2 className="font-bold text-[#081a2b]">{item.label}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{item.note}</p></div></article>; })}</div></section>;
}

function Stories({ stories, loading, demo, liveUnavailable }: { stories: SchoolPublication[]; loading: boolean; demo: boolean; liveUnavailable: boolean }) { return <section className="site-container py-16"><div className="grid gap-8 lg:grid-cols-[.85fr_1.5fr]"><div><h2 className="text-3xl font-extrabold tracking-tight text-[#081a2b]">Featured alumni stories</h2><p className="mt-2 text-xl font-semibold text-[#1261d0]">Where are our alumni today?</p><p className="mt-4 text-sm leading-7 text-slate-600">Every alumnus carries a different story. Published stories celebrate real journeys, achievements, and community impact.</p><Link to="/alumni/stories" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#1261d0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d51af]">View all alumni stories <ArrowRight size={17}/></Link></div><div>{demo && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{liveUnavailable ? "Live school stories are unavailable right now, so illustrative examples are being shown." : "Illustrative examples are shown until the school publishes genuine alumni stories."}</p>}<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{loading ? <LoadingCards count={3}/> : stories.map((story) => <StoryCard story={story} demo={demo} key={story.id}/>)}</div></div></div></section>; }
function Events({ events, loading, demo, liveUnavailable }: { events: SchoolEvent[]; loading: boolean; demo: boolean; liveUnavailable: boolean }) { return <section className="site-container border-t border-slate-200 py-16"><div className="grid gap-8 lg:grid-cols-[.85fr_1.5fr]"><div><h2 className="text-3xl font-extrabold tracking-tight text-[#081a2b]">Upcoming alumni events</h2><p className="mt-2 text-xl font-semibold text-[#1261d0]">Reunite. Learn. Give back.</p><p className="mt-4 text-sm leading-7 text-slate-600">Events published by the school bring the Mpumudde family together for reunions, mentorship, learning, and community initiatives.</p><Link to="/alumni/events" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#1261d0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d51af]">View all alumni events <ArrowRight size={17}/></Link></div><div>{demo && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{liveUnavailable ? "Live school events are unavailable right now, so illustrative examples are being shown." : "Illustrative examples are shown until the school publishes genuine Alumni events."}</p>}<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{loading ? <LoadingCards count={3}/> : events.map((event) => <EventCard event={event} demo={demo} key={event.id}/>)}</div></div></div></section>; }

export function StoryCard({ story, demo = false }: { story: SchoolPublication; demo?: boolean }) { return <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><ContentImage src={story.featuredImageUrl} alt={story.featuredImageAlt || story.title} label={demo ? "Illustrative alumni story" : "Published alumni story"}/><div className="p-5"><p className="text-[11px] font-bold uppercase tracking-wide text-[#1261d0]">{demo ? "Illustrative example" : story.category || "Alumni story"}</p><h3 className="mt-2 text-lg font-bold leading-6 text-[#081a2b]">{story.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{story.summary}</p><Link to={`/alumni/stories/${story.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1261d0]">Read full story <ArrowRight size={16}/></Link></div></article>; }
export function EventCard({ event, demo = false }: { event: SchoolEvent; demo?: boolean }) { return <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><ContentImage src={event.featuredImageUrl} alt={event.featuredImageAlt || event.title} label={demo ? "Illustrative event" : "School event"}/><div className="p-5"><p className="text-[11px] font-bold uppercase tracking-wide text-[#0f8a5f]">{demo ? "Illustrative example" : event.operationalStatus === "POSTPONED" ? "Postponed" : "Upcoming event"}</p><h3 className="mt-2 text-lg font-bold leading-6 text-[#081a2b]">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><CalendarDays size={15}/>{date(event.startsAt)}</p>{event.venue && <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><MapPin size={15}/>{event.venue}</p>}<Link to={`/alumni/events/${event.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1261d0]">View event details <ArrowRight size={16}/></Link></div></article>; }
export function ContentImage({ src, alt, label, full = false }: { src?: string | null; alt: string; label: string; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  const imageClass = full
    ? "max-h-[40rem] w-full bg-slate-100 object-contain"
    : "h-40 w-full object-cover";
  const fallbackClass = full
    ? "flex min-h-64 w-full items-end bg-[radial-gradient(circle_at_70%_25%,#d9a21b_0,transparent_23%),linear-gradient(135deg,#071d3a,#1261d0)] p-4"
    : "flex h-40 items-end bg-[radial-gradient(circle_at_70%_25%,#d9a21b_0,transparent_23%),linear-gradient(135deg,#071d3a,#1261d0)] p-4";

  return src && !failed ? (
    <img src={src} alt={alt} onError={() => setFailed(true)} className={imageClass}/>
  ) : (
    <div className={fallbackClass}><span className="rounded bg-white/15 px-2 py-1 text-xs font-semibold text-white">{label}</span></div>
  );
}
function LoadingCards({ count }: { count: number }) { return <>{Array.from({ length: count }, (_, index) => <div className="h-72 animate-pulse rounded-md bg-slate-100" key={index}/>)}</>; }

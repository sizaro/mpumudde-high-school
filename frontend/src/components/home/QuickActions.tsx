import { GraduationCap, BookOpen, Newspaper, Images, CalendarDays, PhoneCall, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../../shared/Reveal";

const quickLinks = [
  {
    title: "Admissions",
    description: "Apply online and join our growing community.",
    icon: GraduationCap,
    link: "/admissions",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Academics",
    description: "Explore our curriculum and academic excellence.",
    icon: BookOpen,
    link: "/academics",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "School News",
    description: "Stay informed with our latest announcements.",
    icon: Newspaper,
    link: "/news",
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Gallery",
    description: "Discover life at Mpumudde High School.",
    icon: Images,
    link: "/gallery",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "School Calendar",
    description: "View upcoming events and important dates.",
    icon: CalendarDays,
    link: "/calendar",
    color: "bg-red-100 text-red-700",
  },
  {
    title: "Contact Us",
    description: "We're here to answer your questions.",
    icon: PhoneCall,
    link: "/contact",
    color: "bg-cyan-100 text-cyan-700",
  },
];

export default function QuickActions() {
  const primary = quickLinks.slice(0, 3);
  const secondary = quickLinks.slice(3);

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">QUICK ACCESS</span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">Everything You Need, One Click Away</h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600 text-lg">Whether you're a parent, student, visitor or prospective learner, quickly access the most important sections of our website.</p>
        </div>

        {/* Primary Actions */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10">
          {primary.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <Link to={item.link} className="group block rounded-3xl bg-white p-8 shadow-md border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-3 text-slate-600">{item.description}</p>

                  <div className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 group-hover:gap-4 transition-all">
                    Learn More
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Secondary Quick Links */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <Link to={item.link} className="group rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-250 p-6 flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-slate-600 text-sm">{item.description}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
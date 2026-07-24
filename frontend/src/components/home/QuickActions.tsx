import {
  GraduationCap,
  BookOpen,
  Newspaper,
  Images,
  CalendarDays,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Admissions",
    description: "Apply online and join our growing community.",
    icon: GraduationCap,
    link: "/admissions",
    iconColor: "text-emerald-400",
  },
  {
    title: "Academics",
    description: "Explore our curriculum and academic excellence.",
    icon: BookOpen,
    link: "/academics",
    iconColor: "text-cyan-400",
  },
  {
    title: "School News",
    description: "Stay informed with our latest announcements.",
    icon: Newspaper,
    link: "/news",
    iconColor: "text-amber-400",
  },
  {
    title: "Gallery",
    description: "Discover life at Mpumudde High School.",
    icon: Images,
    link: "/gallery",
    iconColor: "text-violet-400",
  },
  {
    title: "School Calendar",
    description: "View upcoming events and important dates.",
    icon: CalendarDays,
    link: "/calendar",
    iconColor: "text-pink-400",
  },
  {
    title: "Contact Us",
    description: "We're here to answer your questions.",
    icon: PhoneCall,
    link: "/contact",
    iconColor: "text-blue-400",
  },
];

export default function QuickActions() {
  return (
    <section className="section-shell">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">

          <span className="section-badge">
            QUICK ACCESS
          </span>

          <h2 className="section-title">
            Everything You Need, One Click Away
          </h2>

          <p className="section-lead mx-auto">
            Whether you're a parent, student, visitor or prospective learner,
            quickly access the most important sections of our website.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {quickLinks.map((item) => {

            const Icon = item.icon;

            return (

              <Link
                key={item.title}
                to={item.link}
                className="group glass-card-solid p-8 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20"
              >

                <div className={`inline-flex rounded-2xl p-3 ${item.iconColor} glass-card`}>
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-white/70 leading-7">
                  {item.description}
                </p>

                <div className="mt-8 flex items-center gap-2 font-semibold text-emerald-400 group-hover:gap-4 transition-all">

                  Learn More

                  <ArrowRight size={18} />

                </div>

              </Link>

            );

          })}

        </div>

      </div>

    </section>
  );
}
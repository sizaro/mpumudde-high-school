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
  return (
    <section className="bg-slate-50 py-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">

          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            QUICK ACCESS
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Everything You Need, One Click Away
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600 text-lg">
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
                className="group rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8"
              >

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600 leading-7">
                  {item.description}
                </p>

                <div className="mt-8 flex items-center gap-2 font-semibold text-blue-700 group-hover:gap-4 transition-all">

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
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    description:
      "Mpumudde High School campus. Come and experience our learning environment.",
  },
  {
    icon: Phone,
    title: "Call Us",
    description:
      "+256 XXX XXX XXX",
  },
  {
    icon: Mail,
    title: "Email Us",
    description:
      "info@mpumuddehighschool.com",
  },
  {
    icon: Clock,
    title: "Office Hours",
    description:
      "Monday - Friday, 8:00 AM - 5:00 PM",
  },
];

export default function ContactVisit() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="section-badge">
            Contact & Visit
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            We would love to welcome you.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600 dark:text-slate-300">
            Whether you are a parent, student, or partner, our team is ready to
            provide information and help you learn more about Mpumudde High
            School.
          </p>
        </div>


        {/* Contact Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="glass-card-solid p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#4ade80' }}>
                  <Icon size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>


        {/* Buttons */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-full bg-emerald-500 px-8 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400">
            Apply for Admission
          </button>

          <button className="rounded-full border border-slate-400 dark:border-slate-500 px-8 py-3 font-semibold text-slate-900 dark:text-white transition hover:bg-slate-200 dark:hover:bg-slate-800">
            Contact School
          </button>
        </div>

      </div>
    </section>
  );
}

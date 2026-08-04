import { MapPin, Mail, Phone } from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "Plot 24, Mpumudde Road, Central District, Uganda",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+256 312 345 678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@mpumuddehs.ac.ug",
  },
];

export default function Contact() {
  return (
    <section className="site-container py-20 space-y-16">
      <header className="space-y-4 text-center">
        <p className="section-badge">
          Contact Mpumudde High School
        </p>
        <h1 className="section-title">
          We’re here to answer your questions and support your school journey.
        </h1>
        <p className="section-lead mx-auto">
          Reach out to our admissions team, administration office, or general support
          staff for information about enrolment, events, or student services.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          {contactDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <div
                key={detail.label}
                className="glass-card p-8 flex items-start gap-5"
              >
                <div className="mt-1 rounded-2xl p-4" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <Icon size={24} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
                    {detail.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Office Hours</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-white/70">
              Monday - Friday: 8:00 AM to 4:00 PM
            </p>
            <p className="mt-3 leading-7 text-slate-600 dark:text-white/70">
              Saturday: 9:00 AM to 12:00 PM
            </p>
          </div>
        </div>

        <div className="glass-card-solid p-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-white/70">
            Use the form below to send a message to our admissions or support team.
            We will respond within 1-2 business days.
          </p>

          <form className="mt-10 space-y-6">
            <label className="block text-sm font-medium text-slate-800 dark:text-white/90">
              Full name
              <input
                type="text"
                placeholder="Your name"
                className="glass-input mt-3"
              />
            </label>

            <label className="block text-sm font-medium text-slate-800 dark:text-white/90">
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                className="glass-input mt-3"
              />
            </label>

            <label className="block text-sm font-medium text-slate-800 dark:text-white/90">
              Message
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="glass-input mt-3"
              />
            </label>

            <button
              type="submit"
              className="glass-button w-full justify-center uppercase tracking-[0.2em]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

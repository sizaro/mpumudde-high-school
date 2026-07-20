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
    <section className="max-w-7xl mx-auto px-6 py-20 space-y-16 text-slate-900">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
          Contact Mpumudde High School
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold">
          We’re here to answer your questions and support your school journey.
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600">
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
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex items-start gap-5"
              >
                <div className="mt-1 rounded-2xl bg-amber-100 p-4 text-amber-700">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    {detail.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Office Hours</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Monday - Friday: 8:00 AM to 4:00 PM
            </p>
            <p className="mt-3 text-slate-600 leading-7">
              Saturday: 9:00 AM to 12:00 PM
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-10 shadow-xl text-white">
          <h2 className="text-3xl font-bold">Send us a message</h2>
          <p className="mt-4 text-slate-300 leading-7">
            Use the form below to send a message to our admissions or support team.
            We will respond within 1-2 business days.
          </p>

          <form className="mt-10 space-y-6">
            <label className="block text-sm font-medium text-slate-200">
              Full name
              <input
                type="text"
                placeholder="Your name"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-5 py-4 text-slate-100 outline-none transition focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-5 py-4 text-slate-100 outline-none transition focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Message
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-5 py-4 text-slate-100 outline-none transition focus:border-amber-400"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-4 text-base font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-amber-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

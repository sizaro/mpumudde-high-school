import {
  HelpCircle,
  GraduationCap,
  Home,
  CreditCard,
  Phone,
} from "lucide-react";

const faqs = [
  {
    icon: GraduationCap,
    question: "How can I apply for admission?",
    answer:
      "Parents and guardians can contact the school admissions office for application requirements and enrollment procedures.",
  },
  {
    icon: Home,
    question: "Does the school offer boarding?",
    answer:
      "The school provides boarding options with facilities designed to support student comfort, safety, and wellbeing.",
  },
  {
    icon: HelpCircle,
    question: "Which subjects are offered?",
    answer:
      "Students have access to a broad range of subjects across sciences, humanities, languages, technology, business, and creative fields.",
  },
  {
    icon: CreditCard,
    question: "How can I get information about fees?",
    answer:
      "Fee structures and payment information are available through the school administration office.",
  },
  {
    icon: Phone,
    question: "How can I contact the school?",
    answer:
      "Parents can reach the school through phone, email, or by visiting the school campus.",
  },
];

export default function FAQsPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Frequently Asked Questions
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Answers to common questions.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Find quick answers about admissions, academics, boarding, fees,
            and school life.
          </p>
        </div>


        {/* FAQ Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {faqs.map((faq) => {
            const Icon = faq.icon;

            return (
              <div
                key={faq.question}
                className="rounded-3xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {faq.question}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-700">
            View All FAQs
          </button>
        </div>

      </div>
    </section>
  );
}
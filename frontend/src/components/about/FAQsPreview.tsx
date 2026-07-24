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
    <section className="bg-slate-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="section-badge">
            Frequently Asked Questions
          </p>

          <h2 className="mt-4 text-4xl font-extrabold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            Answers to common questions.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl section-lead">
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
                className="glass-card p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-lg font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {faq.question}
                </h3>

                <p className="mt-4 text-sm leading-7 section-lead">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>


        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="glass-button">
            View All FAQs
          </button>
        </div>

      </div>
    </section>
  );
}
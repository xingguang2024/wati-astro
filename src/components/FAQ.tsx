/**
 * FAQ Component
 *
 * Interactive FAQ accordion using DaisyUI accordion component
 * Based on WordPress tpl-astra.php FAQ section
 */

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do I need to know how to code to set this up?",
    answer:
      "Nope! It's 100% no-code. Just copy-paste the embed snippet we give you — that's it. Even your grandma could set it up (and she makes great cookies).",
  },
  {
    question: "How does the AI learn about my business?",
    answer:
      "You simply upload your website content, help center, or any docs you have — the AI reads it all and gets to work. It's like onboarding a new team member, minus the awkward small talk.",
  },
  {
    question: "Can I customize how the widget looks?",
    answer:
      "Absolutely! You can match your brand's colors, logo, tone, and even the personality of the AI Agent. From sleek and professional to fun and quirky — it's your call.",
  },
  {
    question: "What happens after a lead is captured?",
    answer:
      "Leads are instantly scored, enriched with conversation data, and pushed to your CRM (or wherever you like). You'll know who's worth chasing — and who's just window shopping.",
  },
  {
    question: "Is it really worth the hype?",
    answer:
      "If higher conversions, better-qualified leads, and 24/7 support sound good… then yeah, we think so 😉. But don't take our word for it — try it and see for yourself.",
  },
];

export default function FAQ() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="space-y-0">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="collapse collapse-plus border-b border-zinc-900/10 rounded-none"
          >
            <input
              type="radio"
              name="faq-accordion"
              defaultChecked={index === 0}
              className="min-h-0"
            />
            <div className="collapse-title text-lg font-medium text-zinc-900 px-0 py-4 min-h-0">
              {item.question}
            </div>
            <div className="collapse-content px-0">
              <p className="pb-4 px-4 text-base text-zinc-700 leading-6">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

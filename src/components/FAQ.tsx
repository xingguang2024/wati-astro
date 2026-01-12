import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do I need to know how to code to set this up?",
    answer: "Nope! It's 100% no-code. Just copy-paste the embed snippet we give you — that's it. Even your grandma could set it up (and she makes great cookies)."
  },
  {
    question: "How does the AI learn about my business?",
    answer: "You simply upload your website content, help center, or any docs you have — the AI reads it all and gets to work. It's like onboarding a new team member, minus the awkward small talk."
  },
  {
    question: "Can I customize how the widget looks?",
    answer: "Absolutely! You can match your brand's colors, logo, tone, and even the personality of the AI Agent. From sleek and professional to fun and quirky — it's your call."
  },
  {
    question: "What happens after a lead is captured?",
    answer: "Leads are instantly scored, enriched with conversation data, and pushed to your CRM (or wherever you like). You'll know who's worth chasing — and who's just window shopping."
  },
  {
    question: "Is it really worth the hype?",
    answer: "If higher conversions, better-qualified leads, and 24/7 support sound good… then yeah, we think so 😉. But don't take our word for it — try it and see for yourself."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="space-y-0">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-zinc-900/10">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between py-4 text-left hover:bg-transparent transition-colors"
            >
              <span className="text-lg font-medium text-zinc-900 pr-4">
                {item.question}
              </span>
              <span
                className="flex-shrink-0 transition-transform duration-300"
                style={{
                  transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-400 ease-in-out"
              style={{
                maxHeight: openIndex === index ? '500px' : '0'
              }}
            >
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

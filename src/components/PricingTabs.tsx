/**
 * PricingTabs Component
 *
 * Monthly/Yearly pricing tabs with toggle functionality
 * Based on tpl-astrapricing.php
 */

import { useState } from "react";

import { cn } from "../utils";

interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  highlights: string[];
  features: string[];
  additionalFeatures?: {
    title: string;
    items: string[];
  };
  integrations?: {
    title: string;
    items: { icon: string; name: string; description: string }[];
  };
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
  badge?: string;
}

const monthlyPlans: PricingPlan[] = [
  {
    name: "Free",
    subtitle: "Perfect for trying Astra",
    price: "$0",
    period: "",
    highlights: [
      "Single AI agent for web",
      "Web widget only",
      "100 monthly credits",
      "1MB training data",
    ],
    features: [
      "1 AI Agent",
      "1 team member - Solo usage",
      "100 monthly credits",
      "1MB training data - Minimal knowledge base",
      "Web widget only",
      "Basic chat features|Standard Q&A capabilities",
      "Form-based lead capture only",
      "Basic Analytics",
      "English only",
      "Astra branding Included",
      "Email support only",
    ],
    buttonText: "Get started for free",
    buttonLink: "https://astra.wati.io/register/",
  },
  {
    name: "Pro",
    subtitle: "For growing teams",
    price: "$99",
    period: "/month",
    highlights: [
      "Lead qualification and FAQ agents",
      "Web and WhatsApp channels",
      "5,000 monthly credits(rollover)",
      "50MB training data per agent",
    ],
    features: [
      "Up to 3 AI Agents",
      "Up to 3 team members",
      "5000 monthly credits",
      "50MB training data per agent|Rich knowledge bases",
      "Web and WhatsApp support",
    ],
    additionalFeatures: {
      title: "Additional features",
      items: [
        "Premium chat features|Advanced reasoning, custom prompts",
        "Voice agent - Single language",
        "Form and conversational lead capture",
        "Advanced lead qualification|BANT collection + scoring",
        "Basic analytics|Conversation count and engagement metrics",
        "Multi-lingual text conversations",
        "Natural language agent builder",
        "Manage conversation via Wati team inbox|Manage conversations from team dashboard",
        "Seamless transfer to human agent",
        "60-days conversation history sync from WATI",
        "Remove Astra branding",
        "Email support only",
      ],
    },
    integrations: {
      title: "Integrations",
      items: [
        {
          icon: "hubspot_logo.png",
          name: "HubSpot",
          description: "Sync leads and AI summary",
        },
        {
          icon: "Slack.png",
          name: "Slack",
          description: "Lead alerts, AI summary",
        },
        {
          icon: "wati.png",
          name: "Wati",
          description: "Team inbox and assign to human",
        },
      ],
    },
    buttonText: "Start 14 day free trial",
    buttonLink: "https://astra.wati.io/register/",
    isPopular: true,
    badge: "Popular",
  },
  {
    name: "Business",
    subtitle: "High traffic websites and Agencies",
    price: "$399",
    period: "/month",
    highlights: [
      "Unlimited AI agents",
      "Web and WhatsApp channels",
      "25,000 monthly credits(rollover)",
      "100MB training data per agent",
      "Dedicated success manager",
    ],
    features: [
      "Unlimited AI agents",
      "Up to 10 team members",
      "25,000 monthly credits",
      "100MB training data per agent|Unlimited knowledge",
      "Web and WhatsApp support",
    ],
    additionalFeatures: {
      title: "Premium features",
      items: [
        "Premium chat features|Advanced reasoning, custom prompts",
        "Dynamic language switching, Advanced voice agent - Regional languages and accents",
        "Form and conversational lead capture",
        "Advanced lead qualification|BANT collection + scoring",
        "Advanced analytics",
        "Multi-lingual text conversations",
        "Natural language agent builder",
        "Manage conversation via Wati team inbox|Manage conversations from team dashboard",
        "Seamless transfer to human agent",
        "365-days conversation history sync from WATI",
        "Dedicated success manager|Onboarding + strategy",
        "Priority support",
      ],
    },
    integrations: {
      title: "Integrations",
      items: [
        {
          icon: "hubspot_logo.png",
          name: "HubSpot",
          description: "Sync leads and AI summary",
        },
        {
          icon: "salesforce.png",
          name: "Salesforce",
          description: "Sync leads and AI summary",
        },
        {
          icon: "Slack.png",
          name: "Slack",
          description: "Lead alerts, AI summary",
        },
        {
          icon: "wati.png",
          name: "Wati",
          description: "Team inbox and assign to human",
        },
        {
          icon: "Webhook.png",
          name: "API actions",
          description: "Webhooks, Rest API",
        },
      ],
    },
    buttonText: "Contact sales",
    buttonLink: "#",
    badge: "Enterprise",
  },
];

const yearlyPlans: PricingPlan[] = monthlyPlans.map((plan) => {
  if (plan.price === "$0") return plan;

  const monthlyPrice = parseInt(plan.price.replace("$", ""));
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount
  const monthlyYearlyPrice = Math.round(yearlyPrice / 12);

  return {
    ...plan,
    price: `$${monthlyYearlyPrice}`,
    period: "/month",
  };
});

export default function PricingTabs() {
  const [isYearly, setIsYearly] = useState(false);
  const plans = isYearly ? yearlyPlans : monthlyPlans;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex bg-zinc-200 p-0.5 rounded-full">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
              !isYearly
                ? "bg-white text-black shadow-sm"
                : "bg-transparent text-zinc-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
              isYearly
                ? "bg-white text-black shadow-sm"
                : "bg-transparent text-zinc-700"
            }`}
          >
            Yearly <span className="text-xs text-zinc-500">(save 20%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl border p-6 pb-20 ${
              plan.isPopular
                ? "border-2 border-blue-600 md:scale-105 md:-mt-4 z-10"
                : "border-zinc-200"
            }`}
          >
            {/* Card Top */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-3xl font-medium text-zinc-900">
                  {plan.name}
                </h3>
                {plan.badge && (
                  <span
                    className={cn(
                      "text-xs! font-medium! px-2 py-1  rounded-full text-white",
                      plan.name === "Pro" ? "bg-[#2563EB]" : "color-btn ",
                    )}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 mb-4">{plan.subtitle}</p>
              <div className="flex items-baseline gap-1 mb-4">
                <h4 className="text-4xl font-bold text-zinc-900">
                  {plan.price}
                </h4>
                {plan.period && (
                  <span className="text-base text-zinc-600">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-2 mb-6 h-[200px] overflow-hidden">
                {plan.highlights.map((highlight, i) => (
                  <li key={i} className="text-sm text-zinc-700">
                    {highlight.split(" ").map((word, j) => {
                      const boldWords = [
                        "Single",
                        "Web",
                        "100",
                        "1MB",
                        "Lead",
                        "FAQ",
                        "5,000",
                        "50MB",
                        "Unlimited",
                        "25,000",
                        "100MB",
                        "Dedicated",
                      ];
                      return boldWords.some((bw) => word.includes(bw)) ? (
                        <span key={j} className="font-bold text-zinc-900">
                          {word}{" "}
                        </span>
                      ) : (
                        <span key={j}>{word} </span>
                      );
                    })}
                  </li>
                ))}
              </ul>
              <a
                href={plan.buttonLink}
                onClick={(e) => {
                  if (plan.buttonLink === "#") {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("openBookDemoModal"));
                  }
                }}
                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.isPopular
                    ? "bg-[#173DA6] text-white hover:bg-[#152a5e]"
                    : "bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {plan.buttonText}
              </a>
            </div>

            {/* Divider */}
            <hr className="border-zinc-200 my-6" />

            {/* Features List */}
            <ul className="space-y-3 text-sm">
              {plan.features.map((feature, i) => {
                const [text, tooltip] = feature.split("|");
                return (
                  <li key={i} className="flex items-start gap-2 relative pl-6">
                    <svg
                      className="absolute left-0 top-2 w-3 h-3 flex-shrink-0"
                      viewBox="0 0 12 9"
                      fill="none"
                    >
                      <path
                        d="M1 4L4.5 7.5L11 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="text-zinc-700"
                      dangerouslySetInnerHTML={{
                        __html: text.replace(
                          /\*\*(.*?)\*\*/g,
                          '<span class="font-bold text-zinc-900">$1</span>',
                        ),
                      }}
                    />
                    {tooltip && (
                      <button
                        className="inline-block w-5 h-5 ml-1"
                        title={tooltip}
                        aria-label="More information"
                      >
                        <img
                          src="/images/info.svg"
                          alt="info"
                          className="w-full h-full"
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Additional Features */}
            {plan.additionalFeatures && (
              <>
                <h5 className="text-base font-medium text-zinc-700 mt-6 mb-3">
                  {plan.additionalFeatures.title}
                </h5>
                <ul className="space-y-3 text-sm">
                  {plan.additionalFeatures.items.map((feature, i) => {
                    const [text, tooltip] = feature.split("|");
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2 relative pl-6"
                      >
                        <svg
                          className="absolute left-0 top-2 w-3 h-3 flex-shrink-0"
                          viewBox="0 0 12 9"
                          fill="none"
                        >
                          <path
                            d="M1 4L4.5 7.5L11 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className="text-zinc-700"
                          dangerouslySetInnerHTML={{
                            __html: text.replace(
                              /\*\*(.*?)\*\*/g,
                              '<span class="font-bold text-zinc-900">$1</span>',
                            ),
                          }}
                        />
                        {tooltip && (
                          <button
                            className="inline-block w-5 h-5 ml-1"
                            title={tooltip}
                            aria-label="More information"
                          >
                            <img
                              src="/images/info.svg"
                              alt="info"
                              className="w-full h-full"
                            />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {/* Integrations */}
            {plan.integrations && (
              <>
                <hr className="border-zinc-200 my-6" />
                <h5 className="text-base font-medium text-zinc-700 mb-3">
                  {plan.integrations.title}
                </h5>
                <ul className="space-y-2 text-sm">
                  {plan.integrations.items.map((integration, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <img
                        src={`/images/${integration.icon}`}
                        alt={integration.name}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-zinc-900">
                        {integration.name}
                      </span>
                      <span className="text-zinc-600">
                        - {integration.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

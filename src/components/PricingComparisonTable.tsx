/**
 * Pricing Comparison Table Component
 *
 * Detailed feature comparison across all pricing plans
 * Based on tpl-astrapricing.php comparison table
 */

import { useState } from "react";

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  { feature: "Agents", free: "1", pro: "3", business: "Unlimited" },
  { feature: "User seats", free: "1", pro: "3", business: "10" },
  { feature: "Monthly credits", free: "100", pro: "5,000", business: "25,000" },
  {
    feature: "Knowledge sources (per agent)",
    free: "1MB",
    pro: "50MB",
    business: "100MB",
  },
  {
    feature: "Channels",
    free: "Web",
    pro: "Web & WhatsApp",
    business: "Web & WhatsApp",
  },
  {
    feature: "Web widget",
    free: "Chat widget",
    pro: "Chat widget, Magic Spotlight, Magic highlighter",
    business: "Chat widget, Magic Spotlight, Magic highlighter",
  },
  {
    feature: "Voice agent",
    free: false,
    pro: "Single language",
    business: "Regional languages and accents",
  },
  {
    feature: "Multi-language text conversations",
    free: false,
    pro: true,
    business: true,
  },
  {
    feature: "Real-time conversations",
    free: false,
    pro: true,
    business: true,
  },
  {
    feature: "Lead capture",
    free: "Form",
    pro: "Form and Conversational",
    business: "Form and Conversational",
  },
  {
    feature: "Lead qualification - using BANT framework and scoring",
    free: false,
    pro: "Basic",
    business: "Advanced",
  },
  {
    feature: "Manage conversation via WATI team inbox",
    free: false,
    pro: true,
    business: true,
  },
  {
    feature: "Conversation history sync from Wati",
    free: false,
    pro: "60 days",
    business: "365 days",
  },
  {
    feature: "Transfer to human agent",
    free: false,
    pro: true,
    business: true,
  },
  {
    feature: "Integrations",
    free: false,
    pro: "HubSpot, Slack, Wati",
    business: "HubSpot, Salesforce, Slack, Wati",
  },
  {
    feature: "API actions - Webhooks, REST, custom endpoints",
    free: false,
    pro: false,
    business: true,
  },
  { feature: "Analytics", free: false, pro: "Basic", business: "Advanced" },
  {
    feature: "Branding and Customisation (Powered by Astra)",
    free: false,
    pro: "Remove Astra branding",
    business: "White-label solution Complete branding control",
  },
  {
    feature: "Dedicated success manager",
    free: false,
    pro: false,
    business: true,
  },
  {
    feature: "Customer support",
    free: "Email only",
    pro: "Email only",
    business: "Priority support",
  },
];

export default function PricingComparisonTable() {
  const renderCell = (value: string | boolean) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center">
          <img
            src="/images/Circle-check-filled.svg"
            alt="Included"
            className="w-6 h-6"
          />
        </span>
      );
    }
    if (value === false || value === "") {
      return <span className="text-zinc-300">—</span>;
    }

    // Check if value contains "Single language" or "Regional languages"
    if (
      typeof value === "string" &&
      (value.includes("Single language") ||
        value.includes("Regional languages"))
    ) {
      return (
        <span className="inline-flex flex-col items-center gap-2">
          <img
            src="/images/Circle-check-filled.svg"
            alt="Included"
            className="w-6 h-6"
          />
          <span>{value}</span>
        </span>
      );
    }

    return value;
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="w-full border-collapse text-center">
          <thead className="sticky top-14 bg-white z-10">
            <tr>
              <th className="text-left align-top bg-white p-4 border border-zinc-200">
                <h3 className="text-3xl font-medium text-zinc-900 my-2">
                  Features
                </h3>
              </th>
              <th className="align-top bg-white p-4 border border-zinc-200 w-[22%]">
                <h3 className="text-3xl font-medium text-zinc-900 my-2">
                  Free
                </h3>
                <p className="text-sm font-medium text-zinc-500 leading-7">
                  Perfect for trying Astra
                </p>
                <a
                  href="https://astra.wati.io/register/"
                  target="_blank"
                  rel="noopener"
                  className="inline-block mt-2 px-4 py-2 text-base font-medium text-[#173DA6] border border-[#173DA6] rounded-full hover:bg-[#1A3478] hover:text-white transition-colors"
                >
                  Get started for free
                </a>
              </th>
              <th className="align-top bg-[#FAFAFA] p-4 border border-zinc-200 w-[22%]">
                <h3 className="text-3xl font-medium text-zinc-900 my-2">Pro</h3>
                <p className="text-sm font-medium text-zinc-500 leading-7">
                  For growing teams
                </p>
                <a
                  href="https://astra.wati.io/register/"
                  target="_blank"
                  rel="noopener"
                  className="inline-block mt-2 px-4 py-2 text-base font-medium text-white bg-[#173DA6] border border-[#173DA6] rounded-full hover:bg-white hover:text-[#173DA6] transition-colors"
                >
                  Start 14 day free trial
                </a>
              </th>
              <th className="align-top bg-white p-4 border border-zinc-200 w-[22%]">
                <h3 className="text-3xl font-medium text-zinc-900 my-2">
                  Business
                </h3>
                <p className="text-sm font-medium text-zinc-500 leading-7">
                  High traffic websites & Agencies
                </p>
                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openBookDemoModal"))
                  }
                  className="inline-block mt-2 px-4 py-2 text-base font-medium text-[#173DA6] border border-[#173DA6] rounded-full hover:bg-[#1A3478] hover:text-white transition-colors cursor-pointer"
                >
                  Contact sales
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <td className="text-left p-4 border border-zinc-200 font-medium text-base text-zinc-900">
                  {row.feature}
                </td>
                <td className="p-4 border border-zinc-200 text-base text-zinc-700">
                  {renderCell(row.free)}
                </td>
                <td className="p-4 border border-zinc-200 bg-[#FAFAFA] text-base text-zinc-700">
                  {renderCell(row.pro)}
                </td>
                <td className="p-4 border border-zinc-200 text-base text-zinc-700">
                  {renderCell(row.business)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Tabs */}
      <div className="md:hidden">
        <MobileComparisonTabs data={comparisonData} />
      </div>
    </>
  );
}

/**
 * Mobile Comparison Tabs Component
 */
function MobileComparisonTabs({ data }: { data: ComparisonRow[] }) {
  const [activeTab, setActiveTab] = useState<"free" | "pro" | "business">(
    "free",
  );

  const renderCell = (value: string | boolean) => {
    if (value === true) {
      return (
        <img
          src="/images/Circle-check-filled.svg"
          alt="Included"
          className="w-5 h-5 inline-block"
        />
      );
    }
    if (value === false || value === "") {
      return <span className="text-zinc-400">—</span>;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex gap-2 text-sm font-bold">
        <button
          onClick={() => setActiveTab("free")}
          className={`flex-1 text-center py-3 px-2 rounded transition-colors ${
            activeTab === "free"
              ? "bg-white text-black shadow-md"
              : "bg-zinc-100 text-zinc-700"
          }`}
        >
          Free
          <span className="block text-xs font-normal mt-1">
            Perfect for trying Astra
          </span>
        </button>
        <button
          onClick={() => setActiveTab("pro")}
          className={`flex-1 text-center py-3 px-2 rounded transition-colors ${
            activeTab === "pro"
              ? "bg-white text-black shadow-md"
              : "bg-zinc-100 text-zinc-700"
          }`}
        >
          Pro
          <span className="block text-xs font-normal mt-1">
            For growing teams
          </span>
        </button>
        <button
          onClick={() => setActiveTab("business")}
          className={`flex-1 text-center py-3 px-2 rounded transition-colors ${
            activeTab === "business"
              ? "bg-white text-black shadow-md"
              : "bg-zinc-100 text-zinc-700"
          }`}
        >
          Business
          <span className="block text-xs font-normal mt-1">High traffic</span>
        </button>
      </div>

      {/* Feature List */}
      <div className="flex gap-0">
        <div className="flex-[45%]">
          <div className="font-bold text-base py-3 px-3 border border-zinc-400 bg-zinc-100 text-zinc-900">
            Features
          </div>
          {data.map((row, index) => (
            <div
              key={index}
              className="py-3 px-3 border border-zinc-400 border-t-0 text-sm font-medium text-zinc-900"
            >
              {row.feature}
            </div>
          ))}
        </div>

        <div className="flex-[55%]">
          <div className="invisible py-3 px-3 border border-zinc-400 border-l-0 font-bold text-base">
            Values
          </div>
          {data.map((row, index) => (
            <div
              key={index}
              className="py-3 px-3 border border-zinc-400 border-t-0 border-l-0 text-sm text-zinc-700 flex items-center"
            >
              {activeTab === "free" && renderCell(row.free)}
              {activeTab === "pro" && renderCell(row.pro)}
              {activeTab === "business" && renderCell(row.business)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

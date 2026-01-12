import { useState } from 'react';

const comparisonData = {
  features: [
    { name: "How They're Built", oldWorld: "Scripts and flows", newWorld: "Prompts + config", astra: "Natural language builder - Just describe the agent" },
    { name: "Training", oldWorld: "Limited FAQs", newWorld: "Needs prompt tuning", astra: "Train with any source Docs, CRM, FAQs, transcripts" },
    { name: "Understanding", oldWorld: "Keyword based", newWorld: "Basic NLP", astra: "Near human intent + context understanding" },
    { name: "Voice Quality", oldWorld: "Robotic", newWorld: "Semi natural", astra: "Near Human Voice + Multiple Languages" },
    { name: "Languages", oldWorld: "1–2 languages", newWorld: "Some coverage", astra: "Switch languages live. 12+ supported" },
    { name: "Channels", oldWorld: "Mostly web only", newWorld: "Few channels", astra: "Web, WhatsApp, and voice calls in one brain" },
    { name: "Action Taking", oldWorld: "No real actions", newWorld: "Limited actions", astra: "Adaptive logic and tool calling that learns continuously" },
    { name: "Integrations", oldWorld: "Hard to set up", newWorld: "Partial support + tech requirement", astra: "Deep integrations across Wati, HubSpot, Salesforce, Shopify" },
    { name: "Memory", oldWorld: "Forgets everything", newWorld: "Short session memory", astra: "Unified long-term memory across chats and calls" },
    { name: "Who Can Build", oldWorld: "Tech teams", newWorld: "Developers", astra: "Anyone" },
    { name: "Outcome", oldWorld: "Answers questions", newWorld: "Better replies", astra: "Drives pipeline, bookings, support, and revenue" }
  ]
};

type TabType = 'oldWorld' | 'newWorld' | 'astra';

export default function ComparisonTable() {
  const [activeTab, setActiveTab] = useState<TabType>('oldWorld');

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg mt-16">
        <table className="w-full border-separate border-spacing-0 bg-transparent text-white rounded-2xl overflow-hidden border-[10px] border-zinc-600">
          <thead>
            <tr className="bg-zinc-950">
              <th className="py-4 px-4 text-left font-medium text-2xl border-b border-zinc-800">
                Features
              </th>
              <th className="py-4 px-4 text-center font-medium text-2xl border-b border-zinc-800">
                <div>Old World</div>
                <p className="text-base font-normal mt-1">Chatbots</p>
              </th>
              <th className="py-4 px-4 text-center font-medium text-2xl border-b border-zinc-800">
                <div>New World</div>
                <p className="text-base font-normal mt-1">Other AI Agents</p>
              </th>
              <th className="py-4 px-4 text-center font-medium text-2xl border-b border-zinc-800 relative">
                <div>The Future</div>
                <p className="text-base font-normal mt-1 bg-gradient-to-r from-blue-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Astra AI Agents
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.features.map((feature, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-transparent' : 'bg-zinc-700'}>
                <td className="py-5 px-4 border-zinc-800 text-zinc-300">{feature.name}</td>
                <td className="py-5 px-4 border-zinc-800 text-zinc-300 text-center">{feature.oldWorld}</td>
                <td className="py-5 px-4 border-zinc-800 text-zinc-300 text-center">{feature.newWorld}</td>
                <td className="py-5 px-4 border-zinc-800 text-zinc-300 text-center relative">
                  <div className="relative z-10">{feature.astra}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden mt-8">
        <div className="flex gap-2 mb-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('oldWorld')}
            className={`flex-1 text-center py-2 px-2 rounded transition-colors ${activeTab === 'oldWorld' ? 'bg-white text-black' : 'text-white'
              }`}
          >
            Old World <span className="block text-xs font-normal">Chatbots</span>
          </button>
          <button
            onClick={() => setActiveTab('newWorld')}
            className={`flex-1 text-center py-2 px-2 rounded transition-colors ${activeTab === 'newWorld' ? 'bg-white text-black' : 'text-white'
              }`}
          >
            New World <span className="block text-xs font-normal">Other AI Agents</span>
          </button>
          <button
            onClick={() => setActiveTab('astra')}
            className={`flex-1 text-center py-2 px-2 rounded transition-colors ${activeTab === 'astra'
              ? 'bg-gradient-to-r from-blue-400 via-orange-400 to-pink-400 text-black'
              : 'text-white'
              }`}
          >
            The Future <span className="block text-xs font-normal">Astra AI Agents</span>
          </button>
        </div>

        <div className="flex gap-0 text-left">
          <div className="flex-[45%]">
            <div className="font-bold text-lg py-2.5 px-2.5 border border-zinc-700 border-t text-white">
              Features
            </div>
            {comparisonData.features.map((feature, index) => (
              <div key={index} className="py-2.5 px-2.5 border border-zinc-700 border-t-0 text-white font-medium text-base leading-5">
                {feature.name}
              </div>
            ))}
          </div>

          <div className="flex-[55%]">
            <div className="invisible py-2.5 px-2.5 border border-zinc-700 border-t border-l-0 font-bold text-lg">
              Features
            </div>
            {comparisonData.features.map((feature, index) => (
              <div key={index} className="py-2.5 px-2.5 border border-zinc-700 border-t-0 border-l-0 text-white font-light text-base leading-5 flex items-center">
                {activeTab === 'oldWorld' && feature.oldWorld}
                {activeTab === 'newWorld' && feature.newWorld}
                {activeTab === 'astra' && feature.astra}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

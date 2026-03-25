import React, { useState, useRef, useEffect } from 'react';

const MOCK_RESPONSES = [
  "Based on current signals, Zepto is increasing ad spend by ~22% in metro delivery windows. I'd recommend monitoring their pricing cadence over the next 48h.",
  "Swiggy's Instamart has onboarded 340+ new SKUs this week — primarily in personal care. This suggests a category push ahead of Q4.",
  "Blinkit's dark store expansion in Bangalore North is confirmed. Expect delivery SLA improvements of ~3 minutes in those zones by end of month.",
  "Hiring signals from Zepto show a surge in ML Engineer and Data Scientist roles — likely tied to their personalization engine revamp.",
  "Google Ads intelligence shows Swiggy bidding aggressively on '10-minute delivery' keywords. Current estimated CPC is ₹42, up 18% from last week.",
  "App Store sentiment for Blinkit dropped 0.2 points this week — primary complaints around 'order cancellations' and 'substituted items'. Opportunity to counter-position.",
  "Cross-platform analysis suggests Zepto is testing a new loyalty program in Pune and Chennai before a national rollout. Watch for ad creative changes.",
  "I can generate a PDF brief summarising all three competitors for your next board review. Want me to include pricing, hiring, and ad intelligence sections?",
];

let responseIndex = 0;

function getNextResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('zepto')) return "Zepto is showing aggressive pricing signals in Mumbai and Pune — delivery fee reductions of 15% on orders above ₹499 between 6–9 PM. This appears to be a demand stimulation experiment.";
  if (msg.includes('swiggy')) return "Swiggy launched 214 new Google Ad campaigns this week targeting quick-commerce keywords. Their Instamart category is growing fastest in Tier-1 cities.";
  if (msg.includes('blinkit')) return "Blinkit confirmed 4 new dark stores in Bangalore North via registry filings. Electronics is their fastest-growing category — AOV up 18% this quarter.";
  if (msg.includes('report') || msg.includes('brief') || msg.includes('pdf')) return "Generating executive brief... I'll include pricing shifts, hiring signals, and ad intelligence for Zepto, Swiggy, and Blinkit. Ready for download in ~30 seconds.";
  if (msg.includes('hiring') || msg.includes('jobs')) return "Zepto has opened 42 new roles this week — heavy on ML and Data Science. Swiggy added 91 roles, mostly in logistics and supply chain ops.";
  if (msg.includes('ads') || msg.includes('google')) return "Swiggy leads in Google Ads volume with 214 active campaigns. Zepto is focusing on hyper-local targeting while Blinkit's spend is moderate at 98 campaigns.";
  const r = MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length];
  responseIndex++;
  return r;
}

export default function ChatWidget({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello. I'm your KEYSER Co-Pilot. Ask me anything about Zepto, Swiggy, or Blinkit — pricing shifts, hiring signals, ad strategies, or market moves.",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setThinking(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: getNextResponse(text) }]);
      setThinking(false);
    }, 900 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-80 z-50 w-[380px] flex flex-col rounded-3xl shadow-[0_32px_80px_rgba(9,21,46,0.18)] border border-primary/10 overflow-hidden"
      style={{ height: '520px' }}>

      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm font-headline">KEYSER Co-Pilot</p>
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Online · Mock mode
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-surface-container-lowest px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-tertiary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-body ${
              m.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white text-on-surface border border-primary/5 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-tertiary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="bg-white border border-primary/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0,1,2].map(j => (
                <span key={j} className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-bounce"
                  style={{ animationDelay: `${j * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="bg-white px-4 pt-3 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-primary/5">
        {['Zepto pricing', 'Swiggy ads', 'Blinkit hiring', 'Generate brief'].map(q => (
          <button key={q} onClick={() => { setInput(q); }}
            className="text-[10px] font-bold text-primary whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors flex-shrink-0">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white px-4 pb-4 pt-2 flex gap-2 flex-shrink-0">
        <input
          className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm font-body text-on-surface placeholder-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:border-primary/30 transition-colors"
          placeholder="Ask about competitors..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={send}
          disabled={!input.trim() || thinking}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </div>
  );
}

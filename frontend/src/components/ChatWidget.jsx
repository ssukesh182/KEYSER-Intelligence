import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api/copilot/chat';

const QUICK_PROMPTS = [
  'Zepto pricing', 'Swiggy ads', 'Blinkit hiring', 'Whitespace gaps', 'This week strategy',
];

// Renders a structured AI copilot response
function CopilotCard({ data }) {
  const conf = (data.confidence || 'low').toLowerCase();
  const confColor = conf === 'high' ? 'text-green-600 bg-green-50 border-green-200'
                  : conf === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-200'
                  : 'text-red-500 bg-red-50 border-red-200';

  const Section = ({ icon, title, items, accent }) =>
    items?.length ? (
      <div className="mt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">{icon}</span>{title}
        </p>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className={`text-xs text-on-surface leading-relaxed pl-2 border-l-2 ${accent} py-0.5`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="text-sm">
      {/* Summary */}
      <p className="font-semibold text-on-surface text-sm leading-snug">{data.summary}</p>

      <Section icon="insights"      title="Key Insights"         items={data.key_insights}         accent="border-primary/40" />
      <Section icon="rocket_launch" title="Opportunities"        items={data.opportunities}        accent="border-green-400" />
      <Section icon="bolt"          title="Recommended Actions"  items={data.recommended_actions}  accent="border-amber-400" />

      {/* Footer */}
      <div className="mt-3 flex items-start gap-2 pt-2 border-t border-outline-variant/20">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confColor} flex-shrink-0 mt-0.5`}>
          {conf.toUpperCase()}
        </span>
        {data.reasoning && (
          <p className="text-[10px] text-on-surface-variant leading-relaxed">{data.reasoning}</p>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      type: 'text',
      text: "Hello. I'm your KEYSER AI Copilot. Ask me anything about competitor pricing, hiring signals, ad strategies, or market gaps.",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput('');
    setError(null);

    setMessages(prev => [...prev, { role: 'user', type: 'text', text }]);
    setThinking(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        // If it looks like a structured response, render as card
        if (d.summary) {
          setMessages(prev => [...prev, { role: 'assistant', type: 'card', data: d }]);
        } else if (typeof d.answer === 'string') {
          // Fallback for old format
          setMessages(prev => [...prev, { role: 'assistant', type: 'text', text: d.answer }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', type: 'text', text: JSON.stringify(d) }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant', type: 'text',
          text: `Error: ${json.error || 'Unknown error from AI engine.'}`,
        }]);
      }
    } catch (err) {
      setError('Could not reach the AI engine. Make sure the backend is running on port 5001.');
      setMessages(prev => [...prev, {
        role: 'assistant', type: 'text',
        text: '⚠️ Connection error. Please check the backend is running.',
      }]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!open) return null;

  return (
    <div
      className="fixed bottom-6 left-80 z-50 w-[420px] flex flex-col rounded-3xl shadow-[0_32px_80px_rgba(9,21,46,0.22)] border border-primary/10 overflow-hidden"
      style={{ height: '560px' }}
    >
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm font-headline">KEYSER AI Copilot</p>
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Online · Gemma 3:4B
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
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-body ${
              m.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white text-on-surface border border-primary/5 rounded-tl-sm'
            }`}>
              {m.type === 'card' ? <CopilotCard data={m.data} /> : m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-tertiary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="bg-white border border-primary/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(j => (
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
        {QUICK_PROMPTS.map(q => (
          <button key={q} onClick={() => setInput(q)}
            className="text-[10px] font-bold text-primary whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors flex-shrink-0">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white px-4 pb-4 pt-2 flex gap-2 flex-shrink-0">
        <input
          className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm font-body text-on-surface placeholder-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:border-primary/30 transition-colors"
          placeholder="Ask about competitors, pricing, strategy…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={thinking}
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

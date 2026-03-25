import React, { useState } from 'react';

const COMPETITORS = [
  { id: 'zepto', name: 'Zepto', tagline: 'Quick commerce leader, 10-min delivery' },
  { id: 'swiggy', name: 'Swiggy', tagline: 'Food + Instamart dual-vertical powerhouse' },
  { id: 'blinkit', name: 'Blinkit', tagline: 'Zomato-backed rapid grocery expansion' },
];

const BASE_DATA = {
  zepto: {
    heroTitle: "Zepto Edge Analysis",
    radarFocusTitle: "Q4 Hyper-Local Expansion Analysis",
    polyFill: "rgba(83, 94, 123, 0.4)",
    polyStroke: "#535e7b",
    polyPoints: "250,50 360,160 380,300 250,440 120,300 140,160",
    insights: [
      { tag: "SPEED OPTIMIZATION", tagColor: "bg-primary/5 text-primary text-[10px]", conf: "81%", title: "Hyper-Local Micro-Warehousing", 
        desc: "Zepto is currently vulnerable in the 8-minute delivery window for suburbs. AI predicts a 22% conversion lift via micro-hubs in Sector 4 & 9.",
        borderColor: "border-primary", impactBars: 3, maxBars: 5, barColor: "bg-primary" },
      { tag: "CATEGORY WHITE SPACE", tagColor: "bg-tertiary-fixed/30 text-tertiary", conf: "89%", title: "Direct-to-Consumer Niche Brands", 
        desc: "Competitors focus on FMCG mainstays. Onboarding D2C beauty and wellness brands creates an immediate moat for high-AOV millennial shoppers.",
        borderColor: "border-tertiary", impactBars: 4, maxBars: 5, barColor: "bg-tertiary" },
      { tag: "CRITICAL RISK", tagColor: "bg-error/5 text-error", conf: "67%", title: "Support Elasticity Gap", 
        desc: "Manual support overhead is increasing while NPS drops. Suggesting immediate implementation of sovereign LLM nodes for Tier-1 resolution.",
        borderColor: "border-error", impactBars: 2, maxBars: 5, barColor: "bg-error" }
    ]
  },
  swiggy: {
    heroTitle: "Swiggy Edge Analysis",
    radarFocusTitle: "Omnichannel Engagement Analysis",
    polyFill: "rgba(31, 42, 68, 0.4)",
    polyStroke: "#1F2A44",
    polyPoints: "250,80 380,200 350,350 250,420 150,320 100,200",
    insights: [
      { tag: "STRATEGIC GAP", tagColor: "bg-tertiary-fixed/30 text-tertiary", conf: "94%", title: "Sustainable Packaging Pivot", 
        desc: "Current competitors score below 4.2 in eco-compliance. Transitioning to 100% biodegradable fiber creates immediate authority in Tier-1 demographics.",
        borderColor: "border-tertiary", impactBars: 4, maxBars: 5, barColor: "bg-tertiary" },
      { tag: "LOYALTY LEVERAGE", tagColor: "bg-primary/5 text-primary", conf: "88%", title: "Cross-Vertical Gamification", 
        desc: "Swiggy One members show a 14% drop in food delivery when Instamart orders peak. Gamifying cross-vertical streaks can bridge this engagement gap.",
        borderColor: "border-primary", impactBars: 3, maxBars: 5, barColor: "bg-primary" },
      { tag: "OPERATIONAL DRAG", tagColor: "bg-error/5 text-error", conf: "72%", title: "Peak-Hour Fleet Utilization", 
        desc: "Rider idle time during the 3PM-5PM dip is burning capital. Suggesting dynamic 'Happy Hour' discounts on slow-moving inventory.",
        borderColor: "border-error", impactBars: 3, maxBars: 5, barColor: "bg-error" }
    ]
  },
  blinkit: {
    heroTitle: "Blinkit Edge Analysis",
    radarFocusTitle: "Category Diversification Analysis",
    polyFill: "rgba(251, 191, 36, 0.3)", // Amber
    polyStroke: "#b45309",
    polyPoints: "250,110 400,250 380,380 250,440 80,300 60,150",
    insights: [
      { tag: "ASSORTMENT EXPANSION", tagColor: "bg-amber-100 text-amber-700", conf: "91%", title: "High-Margin Electronics Add-ons", 
        desc: "While Blinkit sells phones, accessories attachment rate is low. Recommending auto-bundling screen protectors and cases at checkout.",
        borderColor: "border-amber-500", impactBars: 4, maxBars: 5, barColor: "bg-amber-500" },
      { tag: "UX FRICTION", tagColor: "bg-error/5 text-error", conf: "85%", title: "Print-to-Digital Drop-off", 
        desc: "QR code scans from physical billboards have a 40% bounce rate on the landing page due to slow initial load times on low-end devices.",
        borderColor: "border-error", impactBars: 4, maxBars: 5, barColor: "bg-error" },
      { tag: "EMERGENT TREND", tagColor: "bg-tertiary-fixed/30 text-tertiary", conf: "78%", title: "Pet Supply Subscription", 
        desc: "Repeat orders for pet food happen every 21 days. A 'Subscribe & Save' feature specifically for this category could lock in ₹12Cr MRR.",
        borderColor: "border-tertiary", impactBars: 3, maxBars: 5, barColor: "bg-tertiary" }
    ]
  }
};

export default function WhitespaceRadar() {
  const [activeTab, setActiveTab] = useState('swiggy');
  const d = COMPETITORS.find(c => c.id === activeTab);
  const data = BASE_DATA[activeTab];

  return (
    <>
      <div className="p-12 flex gap-12 w-full max-w-[1600px] mx-auto">
        {/*  Center Radar Column  */}
        <section className="flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-tertiary-fixed/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Market Intel</span>
              <span className="text-on-surface-variant text-sm font-medium tracking-tight">{data.radarFocusTitle}</span>
            </div>
            <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight leading-tight">{data.heroTitle}</h1>
          </div>

          {/* Competitor tabs */}
          <div className="flex items-center gap-3 mb-10">
            {COMPETITORS.map((c) => (
              <button key={c.id} onClick={() => setActiveTab(c.id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === c.id ? 'bg-primary text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
                {c.name}
              </button>
            ))}
            <span className="ml-3 text-xs text-on-surface-variant/50 font-body">{d.tagline}</span>
          </div>

          {/*  Radar Visualization Container  */}
          <div className="relative w-full aspect-square max-w-3xl mx-auto flex items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-outline-variant/10">
            {/*  SVG Radar Chart  */}
            <svg className="w-full h-full drop-shadow-2xl overflow-visible transition-all duration-700" viewBox="0 0 500 500">
              {/*  Concentric Circles  */}
              <circle cx="250" cy="250" fill="none" r="50" stroke="#f2f3ff" strokeWidth="1"></circle>
              <circle cx="250" cy="250" fill="none" r="100" stroke="#f2f3ff" strokeWidth="1"></circle>
              <circle cx="250" cy="250" fill="none" r="150" stroke="#f2f3ff" strokeWidth="1"></circle>
              <circle cx="250" cy="250" fill="none" r="200" stroke="#f2f3ff" strokeWidth="1"></circle>
              
              {/*  Axis Lines  */}
              <line stroke="#f2f3ff" strokeWidth="1" x1="250" x2="250" y1="50" y2="450"></line>
              <line stroke="#f2f3ff" strokeWidth="1" x1="76" x2="424" y1="150" y2="350"></line>
              <line stroke="#f2f3ff" strokeWidth="1" x1="76" x2="424" y1="350" y2="150"></line>
              
              {/*  Whitespace Gold Zones (Highlights)  */}
              <path d="M250,50 L350,150 L250,250 Z" fill="#ffe08e" fillOpacity="0.15" stroke="#C9A227" strokeDasharray="4,2" strokeWidth="2"></path>
              <path d="M250,450 L150,350 L250,250 Z" fill="#ffe08e" fillOpacity="0.15" stroke="#C9A227" strokeDasharray="4,2" strokeWidth="2"></path>
              
              {/*  Dynamic Competitor Active Overlay  */}
              <polygon fill={data.polyFill} points={data.polyPoints} stroke={data.polyStroke} strokeWidth="2" className="transition-all duration-700 delay-100"></polygon>
              
              {/*  Data Point Glow nodes  */}
              {data.polyPoints.split(' ').map((pt, i) => (
                <circle key={i} cx={pt.split(',')[0]} cy={pt.split(',')[1]} fill={data.polyStroke} r="4" className="transition-all duration-700"></circle>
              ))}
            </svg>
            
            {/*  Axis Labels  */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Speed</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Range</div>
            <div className="absolute top-1/4 right-0 translate-x-4 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Price</div>
            <div className="absolute bottom-1/4 right-0 translate-x-4 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Packaging</div>
            <div className="absolute top-1/4 left-0 -translate-x-4 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Experience</div>
            <div className="absolute bottom-1/4 left-0 -translate-x-4 text-[10px] font-label font-bold tracking-widest uppercase text-primary">Support</div>
            
            {/*  Legend Floating Panel  */}
            <div className="absolute bottom-8 right-8 glass-panel p-6 rounded-2xl shadow-xl border border-white/50 space-y-3 min-w-[180px]">
              <h4 className="text-[10px] font-label font-black text-primary/40 uppercase tracking-widest mb-2">Market Legend</h4>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-sm bg-[#1F2A44]"></span>
                <span className="text-xs font-semibold text-primary">Swiggy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-sm bg-[#535e7b]"></span>
                <span className="text-xs font-semibold text-primary">Zepto</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
                <span className="text-xs font-semibold text-primary">Blinkit</span>
              </div>
              <div className="pt-2 border-t border-primary/5">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-sm bg-tertiary-fixed border border-[#C9A227] border-dashed"></span>
                  <span className="text-xs font-bold text-tertiary">Whitespace Zone</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Right Insights Column  */}
        <section className="w-[400px] flex flex-col pt-4">
          <div className="flex items-center justify-between mb-8 pb-4">
            <h3 className="font-headline font-bold text-xl text-primary">AI-Generated Opportunities</h3>
            <span className="material-symbols-outlined text-primary/30">auto_awesome</span>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {data.insights.map((insight, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${insight.borderColor} transition-transform duration-300 hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`${insight.tagColor} px-2 py-1 font-bold rounded uppercase`}>
                    {insight.tag}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-label uppercase text-primary/40 font-bold tracking-wider">Confidence</div>
                    <div className={`text-lg font-headline font-extrabold leading-none ${insight.borderColor.includes('error') ? 'text-error' : 'text-primary'}`}>
                      {insight.conf}
                    </div>
                  </div>
                </div>
                <h4 className="font-headline font-bold text-primary text-base mb-2">{insight.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{insight.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                  <span className="text-[10px] font-label font-bold text-primary/60 uppercase tracking-widest">Impact Score</span>
                  <div className="flex gap-1">
                    {[...Array(insight.maxBars)].map((_, j) => (
                      <div key={j} className={`h-1.5 w-6 rounded-full ${j < insight.impactBars ? insight.barColor : 'bg-outline-variant/30'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 group flex items-center justify-center gap-3 w-full py-4 border-2 border-primary/10 rounded-2xl text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">
            Generate Deep-Dive Report
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </section>
      </div>
    </>
  );
}

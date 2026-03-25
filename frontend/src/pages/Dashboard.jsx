import React, { useState } from 'react';

// Base stats per competitor (7d baseline)
const BASE = {
  zepto: {
    name: 'Zepto', color: '#6B21A8',
    tagline: 'Quick commerce leader, 10-min delivery',
    websiteChanges: 24, googleAds: 156, appReview: 4.8, trust: 92, social: 12, hiring: 42,
    adSpend: 85,
    bars: {
      websiteChanges: ['40%','60%','30%','80%','55%','90%'],
      googleAds: ['80%','70%','85%','60%','75%','65%'],
      appReviews: ['95%','92%','98%','90%','94%','97%'],
      trust: ['30%','45%','60%','75%','85%','95%'],
      social: ['20%','35%','100%','80%','50%','40%'],
      hiring: ['40%','45%','50%','55%','70%','85%'],
    },
    insights: [
      { tag: 'Strategic Pivot', tagColor: 'text-tertiary-container', time: '2 HOURS AGO', timeMs: 2, title: 'Pricing Algorithm Adjustment in Mumbai Metro', body: "Zepto lowered delivery fees by 15% for orders above ₹499 between 6–9 PM. Volume shift expected.", urgency: 'URGENT', urgencyColor: 'bg-error-container/20 text-error', urgencyIcon: 'priority_high', source: 'App Scraping', sourceIcon: 'source', spend: 42 },
      { tag: 'Category Push', tagColor: 'text-primary', time: '6 HOURS AGO', timeMs: 6, title: 'Zepto Cafe expands to 18 new PIN codes in Hyderabad', body: 'Rapid rollout of ready-to-eat SKUs signals aggressive move into food delivery adjacency.', urgency: 'ROUTINE', urgencyColor: 'bg-surface-container-low text-on-secondary-container', urgencyIcon: 'info', source: 'Web Crawl', sourceIcon: 'travel_explore', spend: 18 },
    ],
    summary: { text: "Zepto is aggressively expanding Cafe verticals and price competing in metro delivery windows.", highlight: 'Aggressive', metrics: [{ label: 'Market Reach', value: 88 }, { label: 'Price Agility', value: 64 }], copilot: `"Zepto is liquidating Home Essentials inventory. I can draft a counter-markdown strategy or compare SKU-level pricing."` },
  },
  swiggy: {
    name: 'Swiggy', color: '#EA580C',
    tagline: 'Food + Instamart dual-vertical powerhouse',
    websiteChanges: 37, googleAds: 214, appReview: 4.6, trust: 87, social: 28, hiring: 91,
    adSpend: 142,
    bars: {
      websiteChanges: ['55%','70%','45%','90%','60%','80%'],
      googleAds: ['90%','75%','95%','80%','85%','70%'],
      appReviews: ['88%','84%','90%','82%','91%','87%'],
      trust: ['50%','55%','65%','70%','80%','87%'],
      social: ['60%','75%','100%','90%','70%','85%'],
      hiring: ['50%','60%','65%','75%','80%','95%'],
    },
    insights: [
      { tag: 'Ad Blitz', tagColor: 'text-tertiary-container', time: '1 HOUR AGO', timeMs: 1, title: 'Swiggy launched 214 new Google Ads targeting "10-minute delivery" keywords', body: "Keyword bidding directly challenges Zepto's value proposition. CPC estimates suggest ₹18Cr+ monthly budget.", urgency: 'URGENT', urgencyColor: 'bg-error-container/20 text-error', urgencyIcon: 'priority_high', source: 'Ad Intelligence', sourceIcon: 'ads_click', spend: 180 },
      { tag: 'Product Launch', tagColor: 'text-primary', time: '4 HOURS AGO', timeMs: 4, title: "Instamart rolled out 'Swiggy One Lite' at ₹99/month", body: 'New lower-price tier targeting price-sensitive suburban users. Early App Store reviews signal strong adoption.', urgency: 'HIGH', urgencyColor: 'bg-amber-50 text-amber-700', urgencyIcon: 'warning', source: 'App Reviews', sourceIcon: 'rate_review', spend: 95 },
    ],
    summary: { text: "Swiggy is doubling down on paid acquisition and subscription monetisation. Instamart SKU count up 34% this quarter.", highlight: 'High Pressure', metrics: [{ label: 'Market Reach', value: 76 }, { label: 'Price Agility', value: 82 }], copilot: `"Swiggy's ad spend is surging on your core keywords. I can draft a counter-bidding playbook."` },
  },
  blinkit: {
    name: 'Blinkit', color: '#CA8A04',
    tagline: 'Zomato-backed rapid grocery expansion',
    websiteChanges: 19, googleAds: 98, appReview: 4.5, trust: 79, social: 9, hiring: 67,
    adSpend: 61,
    bars: {
      websiteChanges: ['30%','50%','40%','60%','45%','70%'],
      googleAds: ['50%','45%','60%','55%','65%','50%'],
      appReviews: ['80%','78%','85%','83%','87%','82%'],
      trust: ['40%','50%','55%','65%','72%','79%'],
      social: ['30%','40%','55%','60%','45%','50%'],
      hiring: ['55%','60%','70%','75%','85%','90%'],
    },
    insights: [
      { tag: 'New Market Entry', tagColor: 'text-primary', time: '5 HOURS AGO', timeMs: 5, title: 'Dark Store expansion in Bangalore North confirmed', body: '4 new fulfillment centers. Logistics capacity projected to increase by 22% by Q4.', urgency: 'ROUTINE', urgencyColor: 'bg-surface-container-low text-on-secondary-container', urgencyIcon: 'info', source: 'Registry Filings', sourceIcon: 'business_center', spend: 22 },
      { tag: 'Electronics Push', tagColor: 'text-tertiary-container', time: '12 HOURS AGO', timeMs: 12, title: 'Blinkit onboarded 340+ premium electronics SKUs from Boat & OnePlus', body: "Category expansion into electronics signals intent to compete with Amazon Now. AOV up 18%.", urgency: 'HIGH', urgencyColor: 'bg-amber-50 text-amber-700', urgencyIcon: 'warning', source: 'Catalogue Scrape', sourceIcon: 'inventory_2', spend: 55 },
    ],
    summary: { text: "Blinkit is quietly building category depth in electronics and personal care, leveraging Zomato's logistics backbone.", highlight: 'Stable', metrics: [{ label: 'Market Reach', value: 61 }, { label: 'Price Agility', value: 55 }], copilot: `"Blinkit is gaining share in electronics. I can model the impact of their dark-store expansion on your delivery SLAs."` },
  },
};

// Multipliers per time window
const MULTIPLIERS = { '7d': 1, '30d': 3.8, '90d': 10.2, 'all': 28 };

function scale(base, tw) {
  const m = MULTIPLIERS[tw] || 1;
  return Math.round(base * m);
}

const STAT_ICONS = ['update','ads_click','rate_review','verified','campaign','person_search'];
const STAT_LABELS = ['Website Changes','Google Ads','App Store Pulse','Trust Signals','Social Signals','Talent Acquisition'];

export default function Dashboard({ timeWindow = '7d', sortBy = 'latest' }) {
  const [activeTab, setActiveTab] = useState('zepto');
  const d = BASE[activeTab];

  const stats = [
    { icon: STAT_ICONS[0], label: STAT_LABELS[0], value: scale(d.websiteChanges, timeWindow), suffix: 'Critical alerts', badge: '+12.4%', badgeColor: 'bg-green-50 text-green-700', bars: d.bars.websiteChanges },
    { icon: STAT_ICONS[1], label: STAT_LABELS[1], value: scale(d.googleAds, timeWindow), suffix: 'Active campaigns', badge: 'High Vol', badgeColor: 'bg-amber-50 text-amber-700', bars: d.bars.googleAds },
    { icon: STAT_ICONS[2], label: STAT_LABELS[2], value: d.appReview.toFixed(1), suffix: 'Global rating', stars: true, bars: d.bars.appReviews },
    { icon: STAT_ICONS[3], label: STAT_LABELS[3], value: `${d.trust}%`, suffix: 'Satisfaction index', badge: 'Leader', badgeColor: 'bg-blue-50 text-blue-700', bars: d.bars.trust },
    { icon: STAT_ICONS[4], label: STAT_LABELS[4], value: `${scale(d.social, timeWindow)}k`, suffix: 'Mentions / period', badge: 'Trending', badgeColor: 'bg-red-50 text-red-700', bars: d.bars.social },
    { icon: STAT_ICONS[5], label: STAT_LABELS[5], value: scale(d.hiring, timeWindow), suffix: 'Roles opened', badge: 'Expansion', badgeColor: 'bg-purple-50 text-purple-700', bars: d.bars.hiring },
  ];

  const sortedInsights = [...d.insights].sort((a, b) =>
    sortBy === 'spend' ? b.spend - a.spend : a.timeMs - b.timeMs
  );

  return (
    <section className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/* Heading */}
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Institutional Briefing</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Market Dominance Overview</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Window</p>
          <p className="text-sm font-bold text-primary">{timeWindow.toUpperCase()} · 25 Mar 2026</p>
        </div>
      </div>

      {/* Competitor tabs */}
      <div className="flex items-center gap-3">
        {Object.entries(BASE).map(([key, c]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === key ? 'bg-primary text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
            {c.name}
          </button>
        ))}
        <span className="ml-3 text-xs text-on-surface-variant/50 font-body">{d.tagline}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              {s.stars ? (
                <div className="flex gap-0.5">{[...Array(4)].map((_,j) => <span key={j} className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}</div>
              ) : s.badge ? (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
              ) : null}
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-black text-primary">{s.value}</h3>
              <span className="text-xs font-bold text-on-surface-variant/40">{s.suffix}</span>
            </div>
            <div className="mt-6 h-12 w-full flex items-end gap-1">
              {s.bars.map((h, j) => <div key={j} className="flex-1 bg-surface-container-low rounded-t-sm group-hover:bg-tertiary-fixed/60 transition-all" style={{ height: h }} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Insights + Sidebar */}
      <div className="grid grid-cols-12 gap-8 pt-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl font-bold text-primary">Priority Insight Feed</h3>
          </div>

          <div className="space-y-4">
            {sortedInsights.map((ins, i) => (
              <div key={i} className="group bg-white p-6 rounded-2xl border border-primary/5 flex gap-6 hover:translate-x-1 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg" style={{ backgroundColor: d.color }}>
                  {d.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50">{d.name}</span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant" />
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${ins.tagColor}`}>{ins.tag}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-on-surface-variant/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">trending_up</span>₹{ins.spend}Cr est.
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant/40">{ins.time}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-2">{ins.title}</h4>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-4">{ins.body}</p>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${ins.urgencyColor}`}>
                      <span className="material-symbols-outlined text-[14px]">{ins.urgencyIcon}</span>{ins.urgency}
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low text-primary rounded-full text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">{ins.sourceIcon}</span>{ins.source}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-black text-xl mb-1">Intelligence Summary</h4>
              <div className="inline-block mb-4 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: d.color }}>
                {d.name} · {d.summary.highlight}
              </div>
              <p className="text-sm text-on-primary-container leading-relaxed mb-8">{d.summary.text}</p>
              <div className="space-y-4">
                {d.summary.metrics.map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-on-primary-container">{m.label}</span>
                      <span>{m.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div className="bg-tertiary-fixed h-full rounded-full transition-all duration-500" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full bg-white text-primary py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-tertiary-fixed transition-colors">
                Generate PDF Report
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl border border-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Co-Pilot Analysis</h4>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Online
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-xs text-on-surface-variant leading-relaxed italic border border-primary/5">
              {d.summary.copilot}
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Compare SKU pricing</button>
              <button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Draft response memo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

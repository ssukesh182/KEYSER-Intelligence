import React, { useState } from 'react';

const competitors = {
  zepto: {
    name: 'Zepto',
    color: '#6B21A8',
    tagline: 'Quick commerce leader, 10-min delivery',
    stats: {
      websiteChanges: { value: '24', label: 'Critical alerts', badge: '+12.4%', badgeColor: 'bg-green-50 text-green-700', bars: ['40%','60%','30%','80%','55%','90%'] },
      googleAds: { value: '156', label: 'Active campaigns', badge: 'High Vol', badgeColor: 'bg-amber-50 text-amber-700', bars: ['80%','70%','85%','60%','75%','65%'] },
      appReviews: { value: '4.8', label: 'Global rating', bars: ['95%','92%','98%','90%','94%','97%'] },
      trustSignals: { value: '92%', label: 'Satisfaction index', badge: 'Leader', badgeColor: 'bg-blue-50 text-blue-700', bars: ['30%','45%','60%','75%','85%','95%'] },
      socialSignals: { value: '12k', label: 'Mentions / 24h', badge: 'Viral Trend', badgeColor: 'bg-red-50 text-red-700', bars: ['20%','35%','100%','80%','50%','40%'] },
      hiring: { value: '42', label: 'New roles opened', badge: 'Expansion', badgeColor: 'bg-purple-50 text-purple-700', bars: ['40%','45%','50%','55%','70%','85%'] },
    },
    insights: [
      {
        tag: 'Strategic Pivot',
        tagColor: 'text-tertiary-container',
        time: '2 HOURS AGO',
        title: 'Pricing Algorithm Adjustment detected in Mumbai Metro region',
        body: 'Competitor has lowered delivery fees by 15% for orders above ₹499 between 6 PM – 9 PM. Impact scores indicate potential volume shift.',
        urgency: 'URGENT',
        urgencyColor: 'bg-error-container/20 text-error',
        urgencyIcon: 'priority_high',
        source: 'App Scraping',
        sourceIcon: 'source',
      },
      {
        tag: 'Category Push',
        tagColor: 'text-primary',
        time: '6 HOURS AGO',
        title: 'Zepto Cafe expanded to 18 new PIN codes in Hyderabad',
        body: 'Rapid rollout of ready-to-eat SKUs signals aggressive move into the food delivery adjacency space.',
        urgency: 'ROUTINE',
        urgencyColor: 'bg-surface-container-low text-on-secondary-container',
        urgencyIcon: 'info',
        source: 'Web Crawl',
        sourceIcon: 'travel_explore',
      },
    ],
    summary: {
      text: 'Zepto is aggressively expanding Cafe verticals and price competing in metro delivery windows. Watch for Q4 dark-store announcements.',
      highlight: 'Aggressive',
      metrics: [
        { label: 'Market Reach', value: 88 },
        { label: 'Price Agility', value: 64 },
      ],
      copilot: '"Zepto is liquidating Home Essentials inventory. I can draft a counter-markdown strategy or compare SKU-level pricing — your call."',
    },
  },

  swiggy: {
    name: 'Swiggy',
    color: '#EA580C',
    tagline: 'Food + Instamart dual-vertical powerhouse',
    stats: {
      websiteChanges: { value: '37', label: 'Critical alerts', badge: '+21.6%', badgeColor: 'bg-green-50 text-green-700', bars: ['55%','70%','45%','90%','60%','80%'] },
      googleAds: { value: '214', label: 'Active campaigns', badge: 'Peak Spend', badgeColor: 'bg-amber-50 text-amber-700', bars: ['90%','75%','95%','80%','85%','70%'] },
      appReviews: { value: '4.6', label: 'Global rating', bars: ['88%','84%','90%','82%','91%','87%'] },
      trustSignals: { value: '87%', label: 'Satisfaction index', badge: 'Stable', badgeColor: 'bg-blue-50 text-blue-700', bars: ['50%','55%','65%','70%','80%','87%'] },
      socialSignals: { value: '28k', label: 'Mentions / 24h', badge: 'Trending', badgeColor: 'bg-red-50 text-red-700', bars: ['60%','75%','100%','90%','70%','85%'] },
      hiring: { value: '91', label: 'New roles opened', badge: 'Surge', badgeColor: 'bg-purple-50 text-purple-700', bars: ['50%','60%','65%','75%','80%','95%'] },
    },
    insights: [
      {
        tag: 'Ad Blitz',
        tagColor: 'text-tertiary-container',
        time: '1 HOUR AGO',
        title: 'Swiggy launched 214 new Google Ads targeting "10-minute delivery" keywords',
        body: "Keyword bidding strategy directly challenges Zepto's core value proposition. CPC estimates suggest ₹18Cr+ monthly budget in metro cities.",
        urgency: 'URGENT',
        urgencyColor: 'bg-error-container/20 text-error',
        urgencyIcon: 'priority_high',
        source: 'Ad Intelligence',
        sourceIcon: 'ads_click',
      },
      {
        tag: 'Product Launch',
        tagColor: 'text-primary',
        time: '4 HOURS AGO',
        title: 'Instamart rolled out "Swiggy One Lite" subscription tier at ₹99/month',
        body: 'New lower-price tier designed to capture price-sensitive suburban users. Early App Store reviews signal strong initial adoption.',
        urgency: 'HIGH',
        urgencyColor: 'bg-amber-50 text-amber-700',
        urgencyIcon: 'warning',
        source: 'App Reviews',
        sourceIcon: 'rate_review',
      },
    ],
    summary: {
      text: 'Swiggy is doubling down on paid acquisition and subscription monetisation. Instamart SKU count up 34% this quarter.',
      highlight: 'High Pressure',
      metrics: [
        { label: 'Market Reach', value: 76 },
        { label: 'Price Agility', value: 82 },
      ],
      copilot: `"Swiggy's ad spend is surging on your core keywords. I can draft a counter-bidding playbook or analyse their subscription pricing model."`,

    },
  },

  blinkit: {
    name: 'Blinkit',
    color: '#CA8A04',
    tagline: 'Zomato-backed rapid grocery expansion',
    stats: {
      websiteChanges: { value: '19', label: 'Critical alerts', badge: '+8.1%', badgeColor: 'bg-green-50 text-green-700', bars: ['30%','50%','40%','60%','45%','70%'] },
      googleAds: { value: '98', label: 'Active campaigns', badge: 'Moderate', badgeColor: 'bg-amber-50 text-amber-700', bars: ['50%','45%','60%','55%','65%','50%'] },
      appReviews: { value: '4.5', label: 'Global rating', bars: ['80%','78%','85%','83%','87%','82%'] },
      trustSignals: { value: '79%', label: 'Satisfaction index', badge: 'Growing', badgeColor: 'bg-blue-50 text-blue-700', bars: ['40%','50%','55%','65%','72%','79%'] },
      socialSignals: { value: '9k', label: 'Mentions / 24h', badge: 'Steady', badgeColor: 'bg-yellow-50 text-yellow-700', bars: ['30%','40%','55%','60%','45%','50%'] },
      hiring: { value: '67', label: 'New roles opened', badge: 'Scale-up', badgeColor: 'bg-purple-50 text-purple-700', bars: ['55%','60%','70%','75%','85%','90%'] },
    },
    insights: [
      {
        tag: 'New Market Entry',
        tagColor: 'text-primary',
        time: '5 HOURS AGO',
        title: 'Dark Store expansion targeted at Bangalore North sectors',
        body: 'Real estate leases confirmed for 4 new fulfillment centers. Logistics capacity projected to increase by 22% by Q4.',
        urgency: 'ROUTINE',
        urgencyColor: 'bg-surface-container-low text-on-secondary-container',
        urgencyIcon: 'info',
        source: 'Registry Filings',
        sourceIcon: 'business_center',
      },
      {
        tag: 'Electronics Push',
        tagColor: 'text-tertiary-container',
        time: '12 HOURS AGO',
        title: 'Blinkit onboarded 340+ premium electronics SKUs from Boat & OnePlus',
        body: "Category expansion into electronics signals Blinkit's intent to compete with Amazon Now. Average order values already up 18%.",
        urgency: 'HIGH',
        urgencyColor: 'bg-amber-50 text-amber-700',
        urgencyIcon: 'warning',
        source: 'Catalogue Scrape',
        sourceIcon: 'inventory_2',
      },
    ],
    summary: {
      text: "Blinkit is quietly building category depth in electronics and personal care, leveraging Zomato's logistics backbone.",
      highlight: 'Stable',
      metrics: [
        { label: 'Market Reach', value: 61 },
        { label: 'Price Agility', value: 55 },
      ],
      copilot: '"Blinkit is gaining share in electronics. I can identify crossover SKUs or model the impact of their dark-store expansion on your delivery SLAs."',
    },
  },
};

const STAT_ICONS = ['update','ads_click','rate_review','verified','campaign','person_search'];
const STAT_LABELS = ['Website Changes','Google Ads','App Store Pulse','Trust Signals','Social Signals','Talent Acquisition'];
const STAT_KEYS = ['websiteChanges','googleAds','appReviews','trustSignals','socialSignals','hiring'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('zepto');
  const data = competitors[activeTab];

  return (
    <section className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/* Hero Heading */}
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Institutional Briefing</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Market Dominance Overview</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Last Intelligence Update</p>
          <p className="text-sm font-bold text-primary">25 Mar 2026 • 09:42 AM</p>
        </div>
      </div>

      {/* Competitor Tabs */}
      <div className="flex items-center gap-3">
        {Object.entries(competitors).map(([key, c]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === key
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'
            }`}
          >
            {c.name}
          </button>
        ))}
        <span className="ml-3 text-xs text-on-surface-variant/50 font-body">{data.tagline}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_KEYS.map((key, i) => {
          const s = data.stats[key];
          return (
            <div key={key} className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
                  <span className="material-symbols-outlined">{STAT_ICONS[i]}</span>
                </div>
                {s.badge && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
                )}
                {key === 'appReviews' && (
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{STAT_LABELS[i]}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-headline font-black text-primary">{s.value}</h3>
                <span className="text-xs font-bold text-on-surface-variant/40">{s.label}</span>
              </div>
              <div className="mt-6 h-12 w-full flex items-end gap-1">
                {s.bars.map((h, j) => (
                  <div key={j} className="flex-1 bg-surface-container-low rounded-t-sm group-hover:bg-tertiary-fixed/60 transition-all" style={{ height: h }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights + Sidebar */}
      <div className="grid grid-cols-12 gap-8 pt-8">
        {/* Insight Feed */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl font-bold text-primary">Priority Insight Feed</h3>
            <button className="text-xs font-bold text-primary hover:text-tertiary-container transition-colors uppercase tracking-widest flex items-center gap-2">
              View All Intelligence
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-4">
            {data.insights.map((ins, i) => (
              <div key={i} className="group bg-white p-6 rounded-2xl border border-primary/5 flex gap-6 hover:translate-x-1 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg" style={{ backgroundColor: data.color }}>
                  {data.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50">{data.name}</span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant" />
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${ins.tagColor}`}>{ins.tag}</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/40">{ins.time}</span>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-2">{ins.title}</h4>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-4">{ins.body}</p>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${ins.urgencyColor}`}>
                      <span className="material-symbols-outlined text-[14px]">{ins.urgencyIcon}</span>
                      {ins.urgency}
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low text-primary rounded-full text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">{ins.sourceIcon}</span>
                      {ins.source}
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
              <div className="inline-block mb-4 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: data.color }}>
                {data.name} · {data.summary.highlight}
              </div>
              <p className="text-sm text-on-primary-container leading-relaxed mb-8">{data.summary.text}</p>
              <div className="space-y-4">
                {data.summary.metrics.map((m) => (
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

          {/* Co-Pilot */}
          <div className="bg-surface-container-low p-8 rounded-3xl border border-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Co-Pilot Analysis</h4>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-xs text-on-surface-variant leading-relaxed italic border border-primary/5">
              {data.summary.copilot}
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

import React from 'react';

export default function Dashboard({ onEnter, onNavigate }) {
  return (
    <>
      {/*  Sidebar Navigation  */}
<aside className="fixed left-0 top-0 h-screen flex flex-col p-6 w-72 bg-surface-container-low dark:bg-[#09152e] z-40 border-r border-primary/5">
<div className="mb-10 px-2">
<h2 className="font-headline text-primary font-extrabold text-xl tracking-tight">Intelligence</h2>
<p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-bold">Sovereign Framework</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1F2A44] text-primary dark:text-[#ffe08e] rounded-xl shadow-sm transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Overview
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-white/50 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="update">update</span>
                Website Changes
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-white/50 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="ads_click">ads_click</span>
                Google Ads
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-white/50 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="rate_review">rate_review</span>
                App Reviews
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-white/50 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="person_search">person_search</span>
                Hiring Tracker
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-white/50 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined" data-icon="radar">radar</span>
                Whitespace Radar
            </a>
</nav>
<div className="mt-auto space-y-6">
<button className="w-full bg-primary text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
<span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI Co-Pilot
            </button>
<div className="space-y-1">
<a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/70 text-xs font-semibold hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined text-lg" data-icon="settings">settings</span>
                    Settings
                </a>
<a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/70 text-xs font-semibold hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined text-lg" data-icon="help_outline">help_outline</span>
                    Support
                </a>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="ml-72 min-h-screen flex flex-col">
{/*  Top Navigation Bar  */}
<header className="sticky top-0 w-full z-30 flex justify-between items-center px-12 h-20 bg-white/80 backdrop-blur-xl border-b border-primary/5">
<div className="flex items-center gap-8">
<h1 className="font-headline font-black text-primary uppercase tracking-widest text-xl">KEYSER Intelligence</h1>
<div className="h-6 w-[1px] bg-outline-variant/30"></div>
<nav className="flex items-center gap-6">
<a className="text-tertiary-container font-bold border-b-2 border-tertiary-container pb-1 text-sm" href="#">Zepto</a>
<a className="text-on-primary-fixed-variant/70 hover:text-primary transition-colors font-semibold text-sm" href="#">Swiggy</a>
<a className="text-on-primary-fixed-variant/70 hover:text-primary transition-colors font-semibold text-sm" href="#">Blinkit</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg gap-2">
<span className="material-symbols-outlined text-on-surface-variant/60 text-lg">calendar_today</span>
<select className="bg-transparent border-none focus:ring-0 text-xs font-bold text-primary p-0 pr-8">
<option>7d</option>
<option defaultValue="">30d</option>
<option>90d</option>
<option>All</option>
</select>
</div>
<div className="flex items-center gap-2">
<button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-primary/70">
<span className="material-symbols-outlined" data-icon="filter_alt">filter_alt</span>
</button>
<button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-primary/70">
<span className="material-symbols-outlined" data-icon="history">history</span>
</button>
</div>
<button className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95">
<span className="material-symbols-outlined text-sm">refresh</span>
                    Refresh Data
                </button>
</div>
</header>
<section className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
{/*  Hero Heading  */}
<div className="flex justify-between items-end">
<div className="max-w-2xl">
<span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Institutional Briefing</span>
<h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Market Dominance Overview</h2>
</div>
<div className="text-right">
<p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Last Intelligence Update</p>
<p className="text-sm font-bold text-primary">14 Oct 2023 • 09:42 AM</p>
</div>
</div>
{/*  2x3 Intelligence Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  Website Changes  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="update">update</span>
</div>
<span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">+12.4%</span>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Website Changes</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">24</h3>
<span className="text-xs font-bold text-on-surface-variant/40">Critical alerts</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[40%] rounded-t-sm group-hover:bg-tertiary-fixed/30 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[60%] rounded-t-sm group-hover:bg-tertiary-fixed/40 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[30%] rounded-t-sm group-hover:bg-tertiary-fixed/30 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[80%] rounded-t-sm group-hover:bg-tertiary-fixed/60 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[55%] rounded-t-sm group-hover:bg-tertiary-fixed/40 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[90%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
</div>
</div>
{/*  Google Ads  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="ads_click">ads_click</span>
</div>
<span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-full">High Vol</span>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Google Ads</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">156</h3>
<span className="text-xs font-bold text-on-surface-variant/40">Active campaigns</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[80%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[70%] rounded-t-sm group-hover:bg-tertiary-fixed/80 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[85%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[60%] rounded-t-sm group-hover:bg-tertiary-fixed/60 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[75%] rounded-t-sm group-hover:bg-tertiary-fixed/70 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[65%] rounded-t-sm group-hover:bg-tertiary-fixed/65 transition-all"></div>
</div>
</div>
{/*  App Reviews  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="rate_review">rate_review</span>
</div>
<div className="flex gap-0.5">
<span className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[12px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">App Store Pulse</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">4.8</h3>
<span className="text-xs font-bold text-on-surface-variant/40">Global rating</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[95%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[92%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[98%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[90%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[94%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[97%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
</div>
</div>
{/*  G2 / Trustpilot  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="verified">verified</span>
</div>
<span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Leader</span>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Trust signals</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">92%</h3>
<span className="text-xs font-bold text-on-surface-variant/40">Satisfaction index</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[30%] rounded-t-sm group-hover:bg-tertiary-fixed/30 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[45%] rounded-t-sm group-hover:bg-tertiary-fixed/45 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[60%] rounded-t-sm group-hover:bg-tertiary-fixed/60 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[75%] rounded-t-sm group-hover:bg-tertiary-fixed/75 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[85%] rounded-t-sm group-hover:bg-tertiary-fixed/85 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[95%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
</div>
</div>
{/*  Social Signals  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="campaign">campaign</span>
</div>
<span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">Viral Trend</span>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Social Signals</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">12k</h3>
<span className="text-xs font-bold text-on-surface-variant/40">Mentions / 24h</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[20%] rounded-t-sm group-hover:bg-tertiary-fixed/20 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[35%] rounded-t-sm group-hover:bg-tertiary-fixed/35 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[100%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[80%] rounded-t-sm group-hover:bg-tertiary-fixed/80 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[50%] rounded-t-sm group-hover:bg-tertiary-fixed/50 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[40%] rounded-t-sm group-hover:bg-tertiary-fixed/40 transition-all"></div>
</div>
</div>
{/*  Hiring Tracker  */}
<div className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
<span className="material-symbols-outlined" data-icon="person_search">person_search</span>
</div>
<span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">Expansion</span>
</div>
<p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Talent Acquisition</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-black text-primary">42</h3>
<span className="text-xs font-bold text-on-surface-variant/40">New roles opened</span>
</div>
<div className="mt-6 h-12 w-full flex items-end gap-1">
<div className="flex-1 bg-surface-container-low h-[40%] rounded-t-sm group-hover:bg-tertiary-fixed/40 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[45%] rounded-t-sm group-hover:bg-tertiary-fixed/45 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[50%] rounded-t-sm group-hover:bg-tertiary-fixed/50 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[55%] rounded-t-sm group-hover:bg-tertiary-fixed/55 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[70%] rounded-t-sm group-hover:bg-tertiary-fixed/70 transition-all"></div>
<div className="flex-1 bg-surface-container-low h-[85%] rounded-t-sm group-hover:bg-tertiary-fixed transition-all"></div>
</div>
</div>
</div>
{/*  Insights Section  */}
<div className="grid grid-cols-12 gap-8 pt-8">
<div className="col-span-12 lg:col-span-8">
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline text-2xl font-bold text-primary">Priority Insight Feed</h3>
<button className="text-xs font-bold text-primary hover:text-tertiary-container transition-colors uppercase tracking-widest flex items-center gap-2">
                            View All Intelligence
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="space-y-4">
{/*  Insight Card 1  */}
<div className="group bg-white p-6 rounded-2xl border border-primary/5 flex gap-6 hover:translate-x-1 transition-all">
<div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
<img alt="Zepto Brand Asset" className="w-8 h-8 rounded-lg" data-alt="minimalist brand logo icon for a quick commerce company featuring stylized lettering on a deep purple background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIZHwScXvdE1rWSoAk3q0edwxjN5PmE7XT_gwfGNWhWLRlGWcoU38INzNtH1wabo9rK23QASjx-yuyLS_6t6X_C0eIpxTNl-Os1CfUWV1IhFRChgNEOAfyH_XUVuNN-nj5ohN5ayl343Zz0WdHcXjFy9i_kMCgYbPlmARN1QjvaoMrqo9kYTpPTf0NiOw8Myh8ZqLiMrlWS5KJP993SLt2R0ZfEpR4hfkChCGE0G-BvQkdTuuOi4rtTTrDL3hmdXtdnduUqfqdUa-k"/>
</div>
<div className="flex-1">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-3">
<span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50">Zepto</span>
<span className="h-1 w-1 rounded-full bg-outline-variant"></span>
<span className="text-[10px] font-extrabold uppercase tracking-widest text-tertiary-container">Strategic Pivot</span>
</div>
<span className="text-[10px] font-bold text-on-surface-variant/40">2 HOURS AGO</span>
</div>
<h4 className="font-bold text-primary text-lg mb-2">Pricing Algorithm Adjustment detected in Mumbai Metro region</h4>
<p className="text-sm text-on-surface-variant/80 leading-relaxed mb-4">Competitor has lowered delivery fees by 15% for orders above ₹499 between 6 PM - 9 PM. Impact scores indicate potential volume shift.</p>
<div className="flex items-center gap-4">
<div className="flex items-center gap-1 px-3 py-1 bg-error-container/20 text-error rounded-full text-[10px] font-bold">
<span className="material-symbols-outlined text-[14px]">priority_high</span>
                                        URGENT
                                    </div>
<div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low text-primary rounded-full text-[10px] font-bold">
<span className="material-symbols-outlined text-[14px]">source</span>
                                        App Scraping
                                    </div>
</div>
</div>
</div>
{/*  Insight Card 2  */}
<div className="group bg-white p-6 rounded-2xl border border-primary/5 flex gap-6 hover:translate-x-1 transition-all">
<div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
<img alt="Blinkit Brand Asset" className="w-8 h-8 rounded-lg" data-alt="minimalist brand logo icon for a delivery service company featuring stylized lettering on a vibrant yellow background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPR8xBUv3sR14A1pdUdkeVwjyGUrv-ZPKLXXKisOocC387PsjKlfafmLd5qD0BL08GZLmfTdcOr8RnV9wWYwT-yRbhFWdLdue5zoVJ5oEkxc08Q_hgMZN_uv5KpYNDKi5EOxqsu9oqX2UvPNodASSXwG4LIsnD-nmOQiYk2K6RlSvLhH9ymuvx-hHEtTAKF7EUWR6zAuUgTUYio1d47QWN7wC5UJELGvVbjn54fW6AuwTY2xeX8MceHptHmfSmjp5V420IG9MKOCu1"/>
</div>
<div className="flex-1">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-3">
<span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50">Blinkit</span>
<span className="h-1 w-1 rounded-full bg-outline-variant"></span>
<span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">New Market Entry</span>
</div>
<span className="text-[10px] font-bold text-on-surface-variant/40">5 HOURS AGO</span>
</div>
<h4 className="font-bold text-primary text-lg mb-2">Dark Store expansion targeted at Bangalore North sectors</h4>
<p className="text-sm text-on-surface-variant/80 leading-relaxed mb-4">Real estate leases confirmed for 4 new fulfillment centers. Logistics capacity projected to increase by 22% by Q4.</p>
<div className="flex items-center gap-4">
<div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low text-on-secondary-container rounded-full text-[10px] font-bold">
<span className="material-symbols-outlined text-[14px]">info</span>
                                        ROUTINE
                                    </div>
<div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low text-primary rounded-full text-[10px] font-bold">
<span className="material-symbols-outlined text-[14px]">business_center</span>
                                        Registry Filings
                                    </div>
</div>
</div>
</div>
</div>
</div>
{/*  Strategic Sidebar  */}
<div className="col-span-12 lg:col-span-4 space-y-6">
<div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
<div className="relative z-10">
<h4 className="font-headline font-black text-xl mb-4">Intelligence Summary</h4>
<p className="text-sm text-on-primary-container leading-relaxed mb-8">Overall competitive pressure is <span className="text-tertiary-fixed font-bold">Stable</span>. Blinkit is gaining share in electronics, while Zepto leads in fresh produce velocity.</p>
<div className="space-y-4">
<div className="flex items-center justify-between text-xs font-bold">
<span className="text-on-primary-container">Market Reach</span>
<span>88%</span>
</div>
<div className="w-full h-1.5 bg-white/10 rounded-full">
<div className="bg-tertiary-fixed h-full rounded-full" style={{ width: "88%" }}></div>
</div>
<div className="flex items-center justify-between text-xs font-bold">
<span className="text-on-primary-container">Price Agility</span>
<span>64%</span>
</div>
<div className="w-full h-1.5 bg-white/10 rounded-full">
<div className="bg-tertiary-fixed h-full rounded-full" style={{ width: "64%" }}></div>
</div>
</div>
<button className="mt-8 w-full bg-white text-primary py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-tertiary-fixed transition-colors">Generate PDF Report</button>
</div>
</div>
{/*  AI Assistant Preview  */}
<div className="bg-surface-container-low p-8 rounded-3xl border border-primary/5">
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
</div>
<div>
<h4 className="text-sm font-bold text-primary">Co-Pilot Analysis</h4>
<span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Online
                                </span>
</div>
</div>
<div className="bg-white p-4 rounded-2xl text-xs text-on-surface-variant leading-relaxed italic border border-primary/5">
                            "I've analyzed the recent price drops at Zepto. They appear to be liquidating inventory in the 'Home Essentials' category. Would you like a suggested markdown strategy?"
                        </div>
<div className="mt-6 space-y-2">
<button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Compare SKU pricing</button>
<button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Draft response memo</button>
</div>
</div>
</div>
</div>
</section>
{/*  Footer  */}
<footer className="w-full flex justify-between items-center px-12 py-8 mt-auto border-t border-primary/5 bg-white">
<div className="flex items-center gap-8">
<span className="font-headline text-[10px] font-extrabold uppercase tracking-[0.2em] text-tertiary-container">SNUC Hacks '26</span>
<div className="flex items-center gap-6">
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-primary transition-colors font-bold" href="#">Privacy Policy</a>
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-primary transition-colors font-bold" href="#">Terms of Intelligence</a>
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-primary transition-colors font-bold" href="#">Institutional Access</a>
</div>
</div>
<div className="text-[10px] font-bold text-on-surface-variant/40">
                © 2023 KEYSER INTELLIGENCE GROUP. ALL RIGHTS RESERVED.
            </div>
</footer>
</main>
    </>
  );
}

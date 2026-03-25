import React from 'react';

export default function GoogleAds({ onEnter, onNavigate }) {
  return (
    <>
      {/*  TopNavBar  */}
<header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/80 dark:bg-[#09152e]/80 backdrop-blur-xl border-b-0">
<div className="flex items-center gap-8">
<span className="text-xl font-black text-[#09152e] dark:text-[#faf8ff] uppercase tracking-widest font-headline">KEYSER Intelligence</span>
<nav className="hidden md:flex items-center gap-6 font-headline font-bold tracking-tight">
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Zepto</a>
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Swiggy</a>
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Blinkit</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3ff] dark:bg-[#1F2A44] rounded-xl">
<span className="material-symbols-outlined text-sm text-[#09152e] dark:text-[#faf8ff]">history</span>
<span className="text-xs font-bold text-[#09152e] dark:text-[#faf8ff]">30d</span>
</div>
<button className="bg-[#09152e] text-white px-6 py-2 rounded-xl font-headline font-bold scale-95 active:opacity-80 transition-transform">Refresh Data</button>
<span className="material-symbols-outlined text-[#09152e] dark:text-[#faf8ff] cursor-pointer hover:bg-[#f2f3ff] p-2 rounded-full transition-colors">filter_alt</span>
</div>
</header>
{/*  SideNavBar  */}
<aside className="fixed left-0 top-0 h-screen w-72 flex flex-col p-6 border-r border-[#09152e]/5 bg-[#f2f3ff] dark:bg-[#09152e] z-40 pt-24">
<div className="mb-10 px-4">
<p className="text-[10px] uppercase tracking-[0.2em] text-[#09152e]/40 dark:text-[#ffe08e]/40 font-bold leading-none">Intelligence</p>
<h2 className="text-lg font-headline font-extrabold text-[#09152e] dark:text-[#ffe08e]">Sovereign Framework</h2>
</div>
<nav className="flex-1 space-y-2 font-['Inter'] text-sm font-medium tracking-wide">
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined">dashboard</span> Overview
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined">update</span> Website Changes
            </a>
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1F2A44] text-[#09152e] dark:text-[#ffe08e] rounded-xl shadow-sm transition-all duration-300 translate-x-1" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>ads_click</span> Google Ads
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined">rate_review</span> App Reviews
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined">person_search</span> Hiring Tracker
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined">radar</span> Whitespace Radar
            </a>
</nav>
<div className="mt-auto space-y-4">
<button className="w-full py-4 bg-gradient-to-br from-[#09152e] to-[#1F2A44] text-white rounded-2xl font-headline font-bold shadow-lg flex items-center justify-center gap-2 group">
<span className="material-symbols-outlined text-tertiary-fixed">smart_toy</span>
                AI Co-Pilot
            </button>
<div className="pt-6 border-t border-[#09152e]/5 flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-2 text-[#1F2A44]/60 hover:text-[#09152e] transition-colors text-xs font-bold uppercase tracking-widest" href="#">
<span className="material-symbols-outlined text-sm">settings</span> Settings
                </a>
<a className="flex items-center gap-3 px-4 py-2 text-[#1F2A44]/60 hover:text-[#09152e] transition-colors text-xs font-bold uppercase tracking-widest" href="#">
<span className="material-symbols-outlined text-sm">help_outline</span> Support
                </a>
</div>
</div>
</aside>
{/*  Main Content  */}
<main className="ml-72 pt-28 px-12 pb-12">
{/*  Header & Filters  */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
<div className="max-w-2xl">
<h1 className="text-5xl font-headline font-extrabold tracking-tight text-primary mb-4 leading-tight">Ad Intelligence <span className="text-tertiary-container">Sovereign Feed</span></h1>
<p className="text-lg text-primary/60 max-w-lg leading-relaxed">Real-time monitoring of competitor creative strategies and algorithmic positioning across the digital ecosystem.</p>
</div>
<div className="flex gap-4 items-center self-start md:self-end">
<div className="relative">
<select className="appearance-none bg-surface-container-low border-0 rounded-xl px-6 py-3 pr-12 font-headline font-bold text-sm text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
<option>All Competitors</option>
<option>Zepto</option>
<option>Swiggy Instamart</option>
<option>Blinkit</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">expand_more</span>
</div>
<div className="relative">
<select className="appearance-none bg-surface-container-low border-0 rounded-xl px-6 py-3 pr-12 font-headline font-bold text-sm text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
<option>Last 30 Days</option>
<option>Q3 2023</option>
<option>Strategic Archive</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">calendar_today</span>
</div>
</div>
</div>
{/*  Messaging Trends Chart  */}
<section className="mb-16">
<div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-[0_20px_40px_rgba(15,27,52,0.03)] border border-primary/5">
<div className="flex justify-between items-start mb-10">
<div>
<h3 className="text-xl font-headline font-extrabold text-primary mb-1">Messaging Frequency</h3>
<p className="text-sm text-primary/50 font-medium">Aggregated ad impressions vs. creative rotation</p>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-xs font-bold uppercase tracking-widest text-primary/60">Creative Volume</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
<span className="text-xs font-bold uppercase tracking-widest text-primary/60">Shift Markers</span>
</div>
</div>
</div>
<div className="h-[240px] w-full flex items-end gap-1 relative overflow-hidden group">
{/*  SVG Chart Background  */}
<svg className="absolute inset-0 w-full h-full" preserveaspectratio="none">
<path className="opacity-100" d="M0 200 C 50 180, 100 220, 150 150 S 250 50, 300 120 S 400 180, 450 140 S 550 40, 600 80 S 700 160, 800 120 S 900 60, 1000 100 S 1100 180, 1200 140" fill="none" stroke="#09152e" strokeWidth="3"></path>
</svg>
{/*  Marker Points  */}
<div className="absolute left-[25%] top-[15%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10"></div>
<div className="absolute left-[55%] top-[10%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10"></div>
<div className="absolute left-[85%] top-[25%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10"></div>
{/*  X-Axis Labels  */}
<div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pt-4 border-t border-primary/5 translate-y-8">
<span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">01 Oct</span>
<span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">08 Oct</span>
<span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">15 Oct</span>
<span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">22 Oct</span>
<span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">29 Oct</span>
</div>
</div>
</div>
</section>
{/*  Ad Grid Section  */}
<section>
<div className="flex items-center justify-between mb-8">
<h3 className="text-2xl font-headline font-extrabold text-primary">Active Intelligence Feed</h3>
<div className="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest">
<span>Sorting by: Relevance</span>
<span className="material-symbols-outlined text-sm">sort</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
{/*  Ad Card 1  */}
<article className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(15,27,52,0.02)] border border-primary/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,27,52,0.08)]">
<div className="absolute top-4 left-4 z-20">
<div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
<span className="text-[10px] font-black uppercase tracking-wider font-headline">Messaging Shift Detected</span>
</div>
</div>
<div className="relative aspect-[16/10] overflow-hidden">
<img alt="Ad Creative" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Modern dark tech advertisement graphic with glowing neon blue accents and futuristic grocery delivery abstract symbols" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM__1BfKm_92WpCUnGmJTO_x2HZCgsePkbcjoszaKP4biwY2D1SXbFzaCH5CdsSeYewOaeEy146czNBvNHlYEhQamTmdRQEjzlMQ9g2qTzmEuvn1CzYGq4QkhlzFF83F33kjYIFf4-VN7jNumhPpZSFlMslGQf3wRytQixjuhNrRhYT3xdgUBjDB0ht2xfpHyAD8DeqDufNryQmTeg5d5fXRxic7fgZ6Vyh0meq8cqVO4XtjkA-DCvUt2w6gTBZOgI-pjwKtoTa7WS"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div>
<div className="p-8">
<div className="flex items-center gap-2 mb-4">
<span className="w-6 h-6 rounded-lg bg-[#09152e] flex items-center justify-center">
<span className="material-symbols-outlined text-white text-[14px]">local_mall</span>
</span>
<span className="text-xs font-bold uppercase tracking-widest text-primary/40">Zepto • Google Search</span>
</div>
<h4 className="text-xl font-headline font-extrabold text-primary mb-4 leading-snug">"10-Minute Grocery Delivery: Now with Strategic Pricing"</h4>
<p className="text-sm text-primary/60 mb-6 font-medium line-clamp-2">Competitive pivoting detected toward price-sensitive keywords. Shift from speed-first to value-first messaging.</p>
<div className="flex items-center justify-between pt-6 border-t border-primary/5">
<div>
<p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-1">Start Date</p>
<p className="text-xs font-bold text-primary">Oct 12, 2023</p>
</div>
<button className="bg-surface-container-low text-primary px-5 py-2 rounded-xl text-xs font-extrabold font-headline hover:bg-primary hover:text-white transition-colors">
                                Shop Now
                            </button>
</div>
</div>
</article>
{/*  Ad Card 2  */}
<article className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(15,27,52,0.02)] border border-primary/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,27,52,0.08)]">
<div className="relative aspect-[16/10] overflow-hidden">
<img alt="Ad Creative" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Professional vibrant food photography featuring gourmet restaurant dishes with cinematic warm lighting and luxury table setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBmeHRqbh9t1qeFeCyaneN1ztmhUCVEVNTiOgLSLCquGOJ7JfF4tOJw7ncCKW1qUrz56DPgcs91FTPyKbN99IkXBmIQyn_ReEr2M5K8p5YQFDyPa7LOl5fla6mf_xUH6Ea25NOq72FHdmV_-VQ18qNiFmVibJ4dK-pxQB-2z4DWn48pCKy7fvjuM_tY6PFttU2aU7bYu5JpmBQBxBp4xK4RtVhARlq_vdu0P3scIVshc28ve4lh7J7AWJz_W-Jm3joNQvdzBcJuTqK"/>
</div>
<div className="p-8">
<div className="flex items-center gap-2 mb-4">
<span className="w-6 h-6 rounded-lg bg-[#FC8019] flex items-center justify-center">
<span className="material-symbols-outlined text-white text-[14px]">restaurant</span>
</span>
<span className="text-xs font-bold uppercase tracking-widest text-primary/40">Swiggy • YouTube Video</span>
</div>
<h4 className="text-xl font-headline font-extrabold text-primary mb-4 leading-snug">The Ultimate Weekend Feast: Exclusive Member Discounts</h4>
<p className="text-sm text-primary/60 mb-6 font-medium line-clamp-2">High-frequency creative targeting premium demographics. Heavy emphasis on 'Exclusive' lifestyle brand positioning.</p>
<div className="flex items-center justify-between pt-6 border-t border-primary/5">
<div>
<p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-1">Start Date</p>
<p className="text-xs font-bold text-primary">Oct 18, 2023</p>
</div>
<button className="bg-surface-container-low text-primary px-5 py-2 rounded-xl text-xs font-extrabold font-headline hover:bg-primary hover:text-white transition-colors">
                                Order Now
                            </button>
</div>
</div>
</article>
{/*  Ad Card 3  */}
<article className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(15,27,52,0.02)] border border-primary/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,27,52,0.08)]">
<div className="absolute top-4 left-4 z-20">
<div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
<span className="text-[10px] font-black uppercase tracking-wider font-headline">Messaging Shift Detected</span>
</div>
</div>
<div className="relative aspect-[16/10] overflow-hidden">
<img alt="Ad Creative" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Wide angle shot of a bright modern supermarket aisle with perfectly organized colorful fresh produce under bright artificial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGnEIRoWusAXJsYVrdF7bBvok6ydExCzlMul8exZZsHQJQS2TDE6xc-4lmDJO1edhbNSyVw0ZlTp0TD0nCUrKfu-Abud3JXq_I4vamVh3UyToXPFNjFSQrX9eH_jQMD4P1LEg0UmpMVcteQZ4zy4F6lQw6xyrXzBuYN61QbncHdKlQ0Tx-0Fl8QDVnN5JmTr_aRjW6VMltzFfhQqFuMVz9vbh_CZS0dN-KxLMUQNveNijxf7r9jgAAi4RUgO-u0RdmZei98ESU0w8f"/>
</div>
<div className="p-8">
<div className="flex items-center gap-2 mb-4">
<span className="w-6 h-6 rounded-lg bg-[#00FF00]/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[14px]">bolt</span>
</span>
<span className="text-xs font-bold uppercase tracking-widest text-primary/40">Blinkit • Display Network</span>
</div>
<h4 className="text-xl font-headline font-extrabold text-primary mb-4 leading-snug">Freshness Guaranteed: Farm to Home in Minutes</h4>
<p className="text-sm text-primary/60 mb-6 font-medium line-clamp-2">New visual language focused on organic sourcing. Abandoning generic stock imagery for high-resolution farm shots.</p>
<div className="flex items-center justify-between pt-6 border-t border-primary/5">
<div>
<p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-1">Start Date</p>
<p className="text-xs font-bold text-primary">Oct 24, 2023</p>
</div>
<button className="bg-surface-container-low text-primary px-5 py-2 rounded-xl text-xs font-extrabold font-headline hover:bg-primary hover:text-white transition-colors">
                                Explore
                            </button>
</div>
</div>
</article>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full flex justify-between items-center px-12 py-8 bg-white dark:bg-[#09152e] mt-auto border-t border-[#09152e]/5">
<div className="flex items-center gap-8">
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] font-bold text-[#C9A227]">SNUC Hacks '26</span>
<div className="flex gap-4">
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Privacy Policy</a>
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Terms of Intelligence</a>
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Institutional Access</a>
</div>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-primary/30">verified_user</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400">Sovereign Encryption Active</span>
</div>
</footer>
    </>
  );
}

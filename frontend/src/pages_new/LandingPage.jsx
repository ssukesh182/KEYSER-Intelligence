import React from 'react';

export default function LandingPage({ onEnter, onNavigate }) {
  return (
    <>
      {/*  TopNavBar  */}
<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/80 backdrop-blur-xl border-b-0">
<div className="flex items-center gap-12">
<span className="text-xl font-black text-[#09152e] uppercase tracking-widest">KEYSER Intelligence</span>
<div className="hidden md:flex items-center gap-8">
<a className="text-[#C9A227] font-bold border-b-2 border-[#C9A227] pb-1 font-['Manrope'] tracking-tight" href="#">Zepto</a>
<a className="text-[#1F2A44]/70 hover:text-[#09152e] transition-colors duration-300 font-['Manrope'] font-bold tracking-tight" href="#">Swiggy</a>
<a className="text-[#1F2A44]/70 hover:text-[#09152e] transition-colors duration-300 font-['Manrope'] font-bold tracking-tight" href="#">Blinkit</a>
</div>
</div>
<div className="flex items-center gap-4">
<div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10">
<span className="material-symbols-outlined text-outline mr-2" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-body" placeholder="Search signals..." type="text"/>
</div>
<button className="material-symbols-outlined p-2 text-primary hover:bg-[#f2f3ff] transition-colors rounded-lg" data-icon="history">history</button>
<button className="material-symbols-outlined p-2 text-primary hover:bg-[#f2f3ff] transition-colors rounded-lg" data-icon="filter_alt">filter_alt</button>
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:translate-y-[-1px] active:scale-95 transition-all">Refresh Data</button>
</div>
</nav>
<main className="pt-32 pb-20">
{/*  Hero Section  */}
<section className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-12 mb-32 items-center">
<div className="col-span-12 lg:col-span-7">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest mb-6">
<span className="material-symbols-outlined text-[14px]" data-icon="bolt" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    New Release: v4.0 Sovereign
                </div>
<h1 className="text-6xl lg:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight mb-8">
                    Track Your <span className="text-tertiary">Competitors</span> 24/7.
                </h1>
<p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl font-body">
                    Real-time intelligence across websites, ads, reviews, and hiring signals. Automated collection and synthesis into executive-ready briefs.
                </p>
<div className="flex flex-wrap gap-4 mb-12">
<button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_20px_40px_rgba(9,21,46,0.15)] transition-all flex items-center gap-3 active:scale-95">
                        TRY DEMO INSTANTLY
                        <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
<button className="bg-white text-primary border border-outline-variant px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-low transition-all">
                        View Sample Brief
                    </button>
</div>
{/*  Hero Stats  */}
<div className="grid grid-cols-3 gap-8 pt-10 border-t border-surface-container">
<div>
<div className="text-3xl font-extrabold text-primary">5+ Sources</div>
<div className="text-sm uppercase tracking-widest text-on-surface-variant/60 font-semibold mt-1">Cross-Platform</div>
</div>
<div>
<div className="text-3xl font-extrabold text-primary">10× Faster</div>
<div className="text-sm uppercase tracking-widest text-on-surface-variant/60 font-semibold mt-1">Analysis Speed</div>
</div>
<div>
<div className="text-3xl font-extrabold text-primary">95% Accuracy</div>
<div className="text-sm uppercase tracking-widest text-on-surface-variant/60 font-semibold mt-1">AI Validation</div>
</div>
</div>
</div>
<div className="col-span-12 lg:col-span-5 relative">
<div className="absolute -top-12 -right-12 w-64 h-64 bg-tertiary-fixed/30 rounded-full blur-3xl -z-10"></div>
<div className="bg-white rounded-3xl p-2 shadow-[0_40px_80px_rgba(15,27,52,0.08)] border border-surface-container overflow-hidden">
<img className="w-full rounded-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700" data-alt="Modern data dashboard showing competitive intelligence charts with deep navy and muted gold accents on a clean white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNOSAm2x7oErM4hLhRhUt2rpCVEapQlmoBzNiyPuaBF5IzCRIHPXt__Q7hzSoaT3auViQPsRkYAZyiOdqCV_febAGK6EFBFMP86ofZMb29HliCAPmD6YS_BTBA0tZILDtVG0QpSP2QNZ7WCf_encd6eOXYPvjG8ClE0XfB7XOZ7rWnUuXWoFUqcq8xltSK9q9D3RGOPTPoAHouV5wmI3vO0pONeROTHNkru2V8SFb3w_zIwEu6W423YU2mJKpJQ0QCjkR-x8js7VxG"/>
</div>
{/*  Floating Intelligence Card  */}
<div className="absolute -bottom-8 -left-8 bg-surface-bright/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white max-w-[280px]">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-white" data-icon="radar">radar</span>
</div>
<div>
<div className="text-sm font-bold text-primary">New Market Shift</div>
<div className="text-[10px] text-on-surface-variant">2 minutes ago</div>
</div>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                        Competitor "Zepto" updated pricing structure in 14 regional hubs.
                    </p>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-fixed-dim w-3/4"></div>
</div>
</div>
</div>
</section>
{/*  Feature Section  */}
<section className="bg-surface-container-low py-32">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
<div className="max-w-2xl">
<h2 className="text-4xl lg:text-5xl font-extrabold text-primary mb-6">Sovereign Intelligence Architecture</h2>
<p className="text-lg text-on-surface-variant">We don't just scrape data; we curate strategic advantages through high-fidelity monitoring and institutional synthesis.</p>
</div>
<button className="text-primary font-bold flex items-center gap-2 group mb-2">
                        View All Capabilities
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="trending_flat">trending_flat</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Feature Card 1  */}
<div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(15,27,52,0.04)] transition-all duration-500 border border-transparent hover:border-tertiary-fixed-dim group">
<div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-3xl" data-icon="update">update</span>
</div>
<h3 className="text-2xl font-bold text-primary mb-4">Real-time tracking</h3>
<p className="text-on-surface-variant leading-relaxed">
                            Continuous monitoring of digital footprints. Detect changes the second they happen—from hero banners to footer links.
                        </p>
</div>
{/*  Feature Card 2  */}
<div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(15,27,52,0.04)] transition-all duration-500 border border-transparent hover:border-tertiary-fixed-dim group">
<div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-3xl" data-icon="psychology">psychology</span>
</div>
<h3 className="text-2xl font-bold text-primary mb-4">AI insights</h3>
<p className="text-on-surface-variant leading-relaxed">
                            Neural analysis filters noise from signal. Our LLM-powered engine interprets the strategic intent behind every competitor move.
                        </p>
</div>
{/*  Feature Card 3  */}
<div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(15,27,52,0.04)] transition-all duration-500 border border-transparent hover:border-tertiary-fixed-dim group">
<div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-3xl" data-icon="verified_user">verified_user</span>
</div>
<h3 className="text-2xl font-bold text-primary mb-4">CEO-ready briefs</h3>
<p className="text-on-surface-variant leading-relaxed">
                            Zero-fluff reports designed for the boardroom. Elegant, concise, and focused on actionable market positioning.
                        </p>
</div>
</div>
</div>
</section>
{/*  Bento Grid Insights  */}
<section className="max-w-7xl mx-auto px-8 py-32">
<h2 className="text-3xl font-extrabold text-primary mb-12 text-center">Institutional Data Sources</h2>
<div className="grid grid-cols-12 gap-6 h-[600px]">
<div className="col-span-12 md:col-span-8 bg-primary-container rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group">
<img className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[2s]" data-alt="Dynamic abstract visualization of global data streams in deep navy and electric blue tones representing real-time intelligence flow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYXlWYMHka6xWxo8syU9MWWBvg9jwrGHCkMap9Uokjdi-YW3pM-4l-rPvroGOmLcmhLN3Adt7HFaANflzneUUSj5TEpDhGNtYh4uy9eoQvYDSpwqncGc0NWOPdYdMwA07ftuQ504kd82g1jCIQ4b1m8mkpShPfb_WUfzUBO4Py4YHZfivdwsy7RjnGciysmyQlazeKxKvLRqsEXbxpwXsZVGEDSPK7wyt2VhZ8KLgItDiPcFeLaFVW7KxmAkkeqTYr-r4DrXaPtIXW"/>
<div className="relative z-10">
<div className="text-tertiary-fixed font-bold uppercase tracking-tighter text-sm mb-4">Core Advantage</div>
<h3 className="text-4xl font-bold text-white mb-6 leading-tight max-w-lg">Omnichannel Surveillance Across Global Platforms.</h3>
<p className="text-on-primary-container text-lg max-w-md">Our radar scans millions of endpoints including professional networks, public forums, and localized ad libraries.</p>
</div>
</div>
<div className="col-span-12 md:col-span-4 bg-tertiary-fixed rounded-3xl p-10 flex flex-col justify-center text-on-tertiary-fixed">
<span className="material-symbols-outlined text-5xl mb-6" data-icon="hub">hub</span>
<h3 className="text-3xl font-bold mb-4">Hiring Signals</h3>
<p className="text-on-tertiary-fixed-variant leading-relaxed font-medium">Identify team expansion and role shifts to predict new product launches months in advance.</p>
</div>
<div className="col-span-12 md:col-span-4 bg-white border border-surface-container rounded-3xl p-10 flex flex-col justify-center">
<span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="ads_click">ads_click</span>
<h3 className="text-2xl font-bold text-primary mb-2">Google Ads</h3>
<p className="text-on-surface-variant text-sm">Track creative spend and keyword bidding strategies daily.</p>
</div>
<div className="col-span-12 md:col-span-8 bg-surface-container-high rounded-3xl p-10 flex items-center gap-8 overflow-hidden">
<div className="flex-1">
<h3 className="text-2xl font-bold text-primary mb-4">App Reviews Sentiment</h3>
<p className="text-on-surface-variant">Real-time pulse of competitor customer dissatisfaction to identify "Switching Opportunities."</p>
</div>
<div className="flex gap-2">
<div className="w-12 h-24 bg-primary/20 rounded-full flex flex-col justify-end p-1">
<div className="w-full bg-primary h-[60%] rounded-full"></div>
</div>
<div className="w-12 h-24 bg-primary/20 rounded-full flex flex-col justify-end p-1">
<div className="w-full bg-primary h-[90%] rounded-full"></div>
</div>
<div className="w-12 h-24 bg-primary/20 rounded-full flex flex-col justify-end p-1">
<div className="w-full bg-primary h-[40%] rounded-full"></div>
</div>
</div>
</div>
</div>
</section>
{/*  CTA Section  */}
<section className="max-w-5xl mx-auto px-8 py-20 text-center">
<div className="bg-primary p-16 rounded-[3rem] relative overflow-hidden">
<div className="absolute top-0 right-0 w-96 h-96 bg-[#1F2A44] rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/4"></div>
<h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 relative z-10">Ready for Strategic Superiority?</h2>
<p className="text-on-primary-container text-xl mb-12 max-w-2xl mx-auto relative z-10">Join elite intelligence teams using KEYSER to stay three moves ahead.</p>
<div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
<button className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-2xl font-bold text-lg hover:bg-tertiary-fixed-dim transition-all active:scale-95 shadow-lg">
                        START FREE TRIAL
                    </button>
<button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95">
                        REQUEST ENTERPRISE ACCESS
                    </button>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full bg-white flex flex-col items-center px-12 mt-auto border-t border-[#09152e]/5 py-12">
<div className="w-full flex flex-col md:flex-row justify-between items-center mb-12">
<div className="mb-8 md:mb-0">
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] font-bold text-[#C9A227] block mb-2">Designed for Authority</span>
<span className="text-xl font-black text-[#09152e] uppercase tracking-widest">KEYSER Intelligence</span>
</div>
<div className="flex gap-12">
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Privacy Policy</a>
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Terms of Intelligence</a>
<a className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-[#C9A227] transition-colors" href="#">Institutional Access</a>
</div>
</div>
<div className="w-full flex justify-between items-center pt-8 border-t border-surface-container">
<p className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] text-slate-400">© 2024 Sovereign Framework Architecture</p>
<div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.1em] font-bold text-primary">SNUC Hacks '26</span>
<div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
</div>
</div>
</footer>
    </>
  );
}

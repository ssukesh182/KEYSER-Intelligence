import React from 'react';

export default function HiringIntelligence({ onEnter, onNavigate }) {
  return (
    <>
      {/*  TopNavBar  */}
<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/80 dark:bg-[#09152e]/80 backdrop-blur-xl border-b-0">
<div className="flex items-center gap-12">
<span className="text-xl font-black text-[#09152e] dark:text-[#faf8ff] uppercase tracking-widest font-['Manrope']">KEYSER Intelligence</span>
<div className="hidden md:flex items-center gap-6 text-sm font-['Manrope'] font-bold tracking-tight">
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Zepto</a>
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Swiggy</a>
<a className="text-[#1F2A44]/70 dark:text-[#faf8ff]/70 hover:text-[#09152e] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Blinkit</a>
</div>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl">
<span className="material-symbols-outlined text-sm opacity-50">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Search signals..." type="text"/>
</div>
<button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-colors duration-300 scale-95 active:opacity-80 transition-transform">Refresh Data</button>
<div className="flex items-center gap-2 border-l border-outline-variant pl-4 ml-2">
<button className="p-2 hover:bg-[#f2f3ff] dark:hover:bg-[#1F2A44] transition-colors rounded-lg"><span className="material-symbols-outlined">filter_alt</span></button>
<button className="p-2 hover:bg-[#f2f3ff] dark:hover:bg-[#1F2A44] transition-colors rounded-lg"><span className="material-symbols-outlined">history</span></button>
</div>
</div>
</nav>
{/*  SideNavBar  */}
<aside className="fixed left-0 top-0 h-screen w-72 flex flex-col p-6 bg-[#f2f3ff] dark:bg-[#09152e] border-r border-[#09152e]/5 z-40 pt-24">
<div className="mb-10 px-2">
<h2 className="text-[#09152e] dark:text-[#ffe08e] text-sm font-medium tracking-wide font-['Inter'] uppercase opacity-60">Intelligence</h2>
<p className="text-xs text-[#09152e] dark:text-[#ffe08e] font-bold">Sovereign Framework</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">dashboard</span> Overview
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">update</span> Website Changes
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">ads_click</span> Google Ads
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">rate_review</span> App Reviews
            </a>
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1F2A44] text-[#09152e] dark:text-[#ffe08e] rounded-xl shadow-sm transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">person_search</span> Hiring Tracker
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 dark:hover:bg-[#1F2A44]/30 rounded-xl transition-all duration-300 hover:translate-x-1 font-['Inter'] text-sm font-medium" href="#">
<span className="material-symbols-outlined">radar</span> Whitespace Radar
            </a>
</nav>
<div className="mt-auto space-y-1 border-t border-outline-variant/20 pt-6">
<button className="w-full flex items-center justify-center gap-2 bg-primary-container text-tertiary-fixed py-3 rounded-xl mb-4 font-bold text-sm shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-sm">bolt</span> AI Co-Pilot
            </button>
<a className="flex items-center gap-3 px-4 py-2 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 rounded-lg text-sm" href="#"><span className="material-symbols-outlined">settings</span> Settings</a>
<a className="flex items-center gap-3 px-4 py-2 text-[#1F2A44]/60 dark:text-[#faf8ff]/50 hover:bg-white/50 rounded-lg text-sm" href="#"><span className="material-symbols-outlined">help_outline</span> Support</a>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="ml-72 pt-28 px-12 pb-12 min-h-screen">
{/*  Header & Stats Header  */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 className="text-5xl font-extrabold tracking-tight text-primary mb-2">Hiring Intelligence</h1>
<p className="text-on-surface-variant font-body max-w-xl leading-relaxed">Cross-platform recruitment analytics monitoring the expansion velocity and talent acquisition strategies of top-tier competitors.</p>
</div>
<div className="flex gap-4">
<div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
<span className="text-xs uppercase tracking-widest font-bold opacity-40 mb-1">Active Posts</span>
<span className="text-3xl font-black text-primary">1,284</span>
</div>
<div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
<span className="text-xs uppercase tracking-widest font-bold opacity-40 mb-1">Growth %</span>
<span className="text-3xl font-black text-tertiary-container">+14.2%</span>
</div>
</div>
</header>
{/*  Bento Grid Section  */}
<div className="grid grid-cols-12 gap-6 mb-12">
{/*  Hiring Activity Timeline (Main Bar Chart)  */}
<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="text-xl font-bold text-primary">Hiring Activity Timeline</h3>
<p className="text-sm text-on-surface-variant">Weekly job posting volume across identified competitors</p>
</div>
<div className="flex gap-2">
<span className="inline-flex items-center px-3 py-1 bg-surface-container-low text-xs font-bold rounded-full">Weekly</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_horiz</span>
</div>
</div>
<div className="h-64 flex items-end justify-between gap-3 px-2">
{/*  Placeholder Bars  */}
<div className="flex-1 bg-primary/10 rounded-t-lg h-32 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">84</div>
</div>
<div className="flex-1 bg-primary/20 rounded-t-lg h-44 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">112</div>
</div>
<div className="flex-1 bg-primary/15 rounded-t-lg h-36 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">96</div>
</div>
<div className="flex-1 bg-primary/40 rounded-t-lg h-56 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">145</div>
</div>
<div className="flex-1 bg-primary/30 rounded-t-lg h-48 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">128</div>
</div>
<div className="flex-1 bg-primary/50 rounded-t-lg h-60 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">156</div>
</div>
<div className="flex-1 bg-primary rounded-t-lg h-full cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">214</div>
</div>
<div className="flex-1 bg-primary/60 rounded-t-lg h-52 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">136</div>
</div>
<div className="flex-1 bg-primary/40 rounded-t-lg h-40 hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">108</div>
</div>
</div>
<div className="flex justify-between mt-4 px-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-60">
<span>Oct 01</span>
<span>Oct 15</span>
<span>Oct 31</span>
<span>Nov 15</span>
<span>Nov 30</span>
</div>
</div>
{/*  Job Category Distribution (Donut Chart)  */}
<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
<h3 className="text-xl font-bold text-primary mb-1">Talent Allocation</h3>
<p className="text-sm text-on-surface-variant mb-8">Role distribution by department</p>
<div className="relative flex justify-center items-center mb-8">
{/*  SVG Donut Chart Placeholder  */}
<svg className="w-48 h-48 transform -rotate-90">
<circle cx="96" cy="96" fill="none" r="80" stroke="#f2f3ff" strokeWidth="24"></circle>
<circle className="transition-all duration-1000" cx="96" cy="96" fill="none" r="80" stroke="#C9A227" strokeDasharray="240 502" strokeWidth="24"></circle>
<circle cx="96" cy="96" fill="none" r="80" stroke="#09152e" strokeDasharray="140 502" strokeDashoffset="-240" strokeWidth="24"></circle>
<circle cx="96" cy="96" fill="none" r="80" stroke="#1F2A44" strokeDasharray="122 502" strokeDashoffset="-380" strokeWidth="24"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-sm uppercase font-bold opacity-40">Top</span>
<span className="text-2xl font-black text-tertiary-container">ENG</span>
</div>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between group cursor-default">
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
<span className="text-sm font-medium">Engineering</span>
</div>
<span className="text-sm font-bold">48%</span>
</div>
<div className="flex items-center justify-between group cursor-default">
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-sm font-medium">Operations</span>
</div>
<span className="text-sm font-bold">28%</span>
</div>
<div className="flex items-center justify-between group cursor-default">
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-primary-container"></div>
<span className="text-sm font-medium">Product</span>
</div>
<span className="text-sm font-bold">24%</span>
</div>
</div>
</div>
</div>
{/*  Recent Job Posts Table Section  */}
<section className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
<div className="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-white">
<h3 className="text-xl font-bold text-primary">Live Talent Influx</h3>
<div className="flex gap-4">
<button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm">download</span> Export
                    </button>
<button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-primary text-white rounded-xl">
<span className="material-symbols-outlined text-sm">filter_list</span> Advanced Filters
                    </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low/50">
<tr>
<th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">Competitor</th>
<th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">Role Title</th>
<th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">Department</th>
<th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">Location</th>
<th className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">Posted</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-low">
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">Z</div>
<span className="font-bold text-sm">Zepto</span>
</div>
</td>
<td className="px-8 py-5 font-medium text-sm">Staff Software Engineer (L5)</td>
<td className="px-8 py-5">
<span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase rounded-full tracking-wider">Engineering</span>
</td>
<td className="px-8 py-5 text-sm text-on-surface-variant">Bengaluru, KA</td>
<td className="px-8 py-5 text-sm font-medium">2h ago</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">S</div>
<span className="font-bold text-sm">Swiggy</span>
</div>
</td>
<td className="px-8 py-5 font-medium text-sm">Regional Growth Lead</td>
<td className="px-8 py-5">
<span className="px-3 py-1 bg-surface-container-high text-on-primary-fixed text-[10px] font-bold uppercase rounded-full tracking-wider">Operations</span>
</td>
<td className="px-8 py-5 text-sm text-on-surface-variant">Mumbai, MH</td>
<td className="px-8 py-5 text-sm font-medium">5h ago</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">B</div>
<span className="font-bold text-sm">Blinkit</span>
</div>
</td>
<td className="px-8 py-5 font-medium text-sm">Senior Product Designer</td>
<td className="px-8 py-5">
<span className="px-3 py-1 bg-primary-container text-white text-[10px] font-bold uppercase rounded-full tracking-wider">Product</span>
</td>
<td className="px-8 py-5 text-sm text-on-surface-variant">Gurugram, HR</td>
<td className="px-8 py-5 text-sm font-medium">1d ago</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">Z</div>
<span className="font-bold text-sm">Zepto</span>
</div>
</td>
<td className="px-8 py-5 font-medium text-sm">Director of Supply Chain</td>
<td className="px-8 py-5">
<span className="px-3 py-1 bg-surface-container-high text-on-primary-fixed text-[10px] font-bold uppercase rounded-full tracking-wider">Operations</span>
</td>
<td className="px-8 py-5 text-sm text-on-surface-variant">Bengaluru, KA</td>
<td className="px-8 py-5 text-sm font-medium">1d ago</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">S</div>
<span className="font-bold text-sm">Swiggy</span>
</div>
</td>
<td className="px-8 py-5 font-medium text-sm">Machine Learning Scientist</td>
<td className="px-8 py-5">
<span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase rounded-full tracking-wider">Engineering</span>
</td>
<td className="px-8 py-5 text-sm text-on-surface-variant">Hyderabad, TS</td>
<td className="px-8 py-5 text-sm font-medium">2d ago</td>
</tr>
</tbody>
</table>
</div>
<div className="px-8 py-4 bg-surface-container-low/20 flex items-center justify-between">
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing 5 of 1,284 tactical acquisitions</p>
<div className="flex gap-2">
<button className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
</section>
{/*  Footer Shell  */}
<footer className="w-full flex justify-between items-center px-0 mt-20 border-t border-[#09152e]/5 py-8">
<div className="flex items-center gap-6">
<span className="font-bold text-[#C9A227] font-['Inter'] text-[10px] uppercase tracking-[0.1em]">SNUC Hacks '26</span>
<div className="h-4 w-[1px] bg-outline-variant/30"></div>
<p className="text-slate-400 font-['Inter'] text-[10px] uppercase tracking-[0.1em]">Intelligence Sovereign Dashboard v2.4.0</p>
</div>
<div className="flex gap-8">
<a className="text-slate-400 font-['Inter'] text-[10px] uppercase tracking-[0.1em] hover:text-[#C9A227] transition-colors" href="#">Privacy Policy</a>
<a className="text-slate-400 font-['Inter'] text-[10px] uppercase tracking-[0.1em] hover:text-[#C9A227] transition-colors" href="#">Terms of Intelligence</a>
<a className="text-slate-400 font-['Inter'] text-[10px] uppercase tracking-[0.1em] hover:text-[#C9A227] transition-colors" href="#">Institutional Access</a>
</div>
</footer>
</main>
{/*  Floating Strategic Panel (AI Intelligence Overlay)  */}
<div className="fixed bottom-8 right-8 z-50">
<button className="group relative flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer">
<span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
<div className="absolute right-20 bg-white shadow-xl rounded-2xl p-4 w-64 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none">
<p className="text-xs font-bold text-tertiary-container uppercase tracking-widest mb-2">Strategy Pulse</p>
<p className="text-sm font-medium leading-tight text-primary">Zepto is ramping up Engineering hiring by 40% vs last week. Potential focus on automated logistics tech.</p>
</div>
</button>
</div>
    </>
  );
}

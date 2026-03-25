import React from 'react';

export default function WhitespaceRadar() {
  return (
    <>
      <div className="p-12 flex gap-12 w-full max-w-[1600px] mx-auto">
      {/*  Center Radar Column  */}
<section className="flex-1">
<div className="mb-12">
<div className="flex items-center gap-3 mb-2">
<span className="bg-tertiary-fixed/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Market Intel</span>
<span className="text-on-surface-variant text-sm font-medium tracking-tight">Q1 2024 Performance Analysis</span>
</div>
<h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight leading-tight">Whitespace <br/>Competitive Radar</h1>
</div>
{/*  Radar Visualization Container  */}
<div className="relative w-full aspect-square max-w-3xl mx-auto flex items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-outline-variant/10">
{/*  SVG Radar Chart  */}
<svg className="w-full h-full drop-shadow-2xl overflow-visible" viewbox="0 0 500 500">
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
<path d="M250,50 L350,150 L250,250 Z" fill="#ffe08e" fill-opacity="0.15" stroke="#C9A227" strokeDasharray="4,2" strokeWidth="2"></path>
<path d="M250,450 L150,350 L250,250 Z" fill="#ffe08e" fill-opacity="0.15" stroke="#C9A227" strokeDasharray="4,2" strokeWidth="2"></path>
{/*  Competitive Overlays (Simplified Mock Paths)  */}
{/*  Swiggy: Deep Navy  */}
<polygon fill="rgba(31, 42, 68, 0.4)" points="250,80 380,200 350,350 250,420 150,320 100,200" stroke="#1F2A44" strokeWidth="2"></polygon>
{/*  Zepto: Secondary Navy  */}
<polygon fill="rgba(83, 94, 123, 0.3)" points="250,120 320,180 300,380 250,380 180,300 120,150" stroke="#535e7b" strokeWidth="1.5"></polygon>
{/*  Blinkit: Outlined  */}
<polygon fill="none" points="250,60 400,250 380,380 250,440 80,300 60,150" stroke="#09152e" strokeDasharray="2,2" strokeWidth="1"></polygon>
{/*  Data Points (Glow nodes)  */}
<circle cx="250" cy="80" fill="#1F2A44" r="4"></circle>
<circle cx="380" cy="200" fill="#1F2A44" r="4"></circle>
<circle cx="250" cy="420" fill="#1F2A44" r="4"></circle>
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
<span className="text-xs font-semibold text-primary">Swiggy Instamart</span>
</div>
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-sm bg-[#535e7b]"></span>
<span className="text-xs font-semibold text-primary">Zepto Now</span>
</div>
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-sm border border-[#09152e] border-dashed"></span>
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
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline font-bold text-xl text-primary">AI-Generated Opportunities</h3>
<span className="material-symbols-outlined text-primary/30">auto_awesome</span>
</div>
<div className="space-y-6 flex-1 overflow-y-auto pr-2">
{/*  Insight Card 1  */}
<div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-tertiary transition-transform duration-300 hover:-translate-y-1">
<div className="flex justify-between items-start mb-4">
<div className="bg-tertiary-fixed/30 text-tertiary text-[10px] font-bold px-2 py-1 rounded">STRATEGIC GAP</div>
<div className="text-right">
<div className="text-[10px] font-label uppercase text-primary/40 font-bold tracking-wider">Confidence</div>
<div className="text-lg font-headline font-extrabold text-primary leading-none">94%</div>
</div>
</div>
<h4 className="font-headline font-bold text-primary text-base mb-2">Sustainable Packaging Pivot</h4>
<p className="text-sm text-on-surface-variant leading-relaxed mb-6">Current competitors score below 4.2 in eco-compliance. Transitioning to 100% biodegradable fiber creates immediate authority in Tier-1 demographics.</p>
<div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
<span className="text-[10px] font-label font-bold text-primary/60 uppercase tracking-widest">Impact Score</span>
<div className="flex gap-1">
<div className="h-1.5 w-6 rounded-full bg-tertiary"></div>
<div className="h-1.5 w-6 rounded-full bg-tertiary"></div>
<div className="h-1.5 w-6 rounded-full bg-tertiary"></div>
<div className="h-1.5 w-6 rounded-full bg-tertiary"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
</div>
</div>
</div>
{/*  Insight Card 2  */}
<div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-primary transition-transform duration-300 hover:-translate-y-1">
<div className="flex justify-between items-start mb-4">
<div className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-1 rounded">SPEED OPTIMIZATION</div>
<div className="text-right">
<div className="text-[10px] font-label uppercase text-primary/40 font-bold tracking-wider">Confidence</div>
<div className="text-lg font-headline font-extrabold text-primary leading-none">81%</div>
</div>
</div>
<h4 className="font-headline font-bold text-primary text-base mb-2">Hyper-Local Micro-Warehousing</h4>
<p className="text-sm text-on-surface-variant leading-relaxed mb-6">Zepto is currently vulnerable in the 8-minute delivery window for suburbs. AI predicts a 22% conversion lift via micro-hubs in Sector 4 &amp; 9.</p>
<div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
<span className="text-[10px] font-label font-bold text-primary/60 uppercase tracking-widest">Impact Score</span>
<div className="flex gap-1">
<div className="h-1.5 w-6 rounded-full bg-primary"></div>
<div className="h-1.5 w-6 rounded-full bg-primary"></div>
<div className="h-1.5 w-6 rounded-full bg-primary"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
</div>
</div>
</div>
{/*  Insight Card 3  */}
<div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-error transition-transform duration-300 hover:-translate-y-1">
<div className="flex justify-between items-start mb-4">
<div className="bg-error/5 text-error text-[10px] font-bold px-2 py-1 rounded">CRITICAL RISK</div>
<div className="text-right">
<div className="text-[10px] font-label uppercase text-primary/40 font-bold tracking-wider">Confidence</div>
<div className="text-lg font-headline font-extrabold text-error leading-none">67%</div>
</div>
</div>
<h4 className="font-headline font-bold text-primary text-base mb-2">Support Elasticity Gap</h4>
<p className="text-sm text-on-surface-variant leading-relaxed mb-6">Manual support overhead is increasing while NPS drops. Suggesting immediate implementation of sovereign LLM nodes for Tier-1 resolution.</p>
<div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
<span className="text-[10px] font-label font-bold text-primary/60 uppercase tracking-widest">Impact Score</span>
<div className="flex gap-1">
<div className="h-1.5 w-6 rounded-full bg-error"></div>
<div className="h-1.5 w-6 rounded-full bg-error"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
<div className="h-1.5 w-6 rounded-full bg-outline-variant/30"></div>
</div>
</div>
</div>
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

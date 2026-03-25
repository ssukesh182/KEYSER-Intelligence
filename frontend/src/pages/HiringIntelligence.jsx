import React from 'react';

export default function HiringIntelligence() {
  return (
    <div className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/*  Page Header  */}
      <section className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Talent Ecosystem</span>
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">Hiring Intelligence</h1>
          <p className="text-lg text-on-surface-variant font-medium max-w-lg leading-relaxed mt-4">Monitor competitor headcount growth, departmental scaling, and strategic role acquisitions.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="relative">
                <select className="appearance-none bg-surface-container-low border-0 rounded-xl px-6 py-3 pr-12 font-headline font-bold text-sm text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Operations</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">expand_more</span>
            </div>
        </div>
      </section>
{/*  Bento Grid Section  */}
<div className="grid grid-cols-12 gap-10">
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
    </div>
  );
}

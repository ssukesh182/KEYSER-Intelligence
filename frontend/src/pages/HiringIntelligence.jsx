import React, { useState } from 'react';

const COMPETITORS = [
  { id: 'zepto', name: 'Zepto', tagline: 'Quick commerce leader, 10-min delivery' },
  { id: 'swiggy', name: 'Swiggy', tagline: 'Food + Instamart dual-vertical powerhouse' },
  { id: 'blinkit', name: 'Blinkit', tagline: 'Zomato-backed rapid grocery expansion' },
];

const BASE_DATA = {
  zepto: {
    heroTitle: "Zepto Talent Ecosystem",
    heroDesc: "Aggressive scaling observed in Supply Chain and AI Engineering roles, indicating preparation for nationwide expansion in Q3.",
    timelineBars: [84, 112, 96, 145, 128, 156, 214, 136, 108],
    allocationTotal: "ENG",
    allocation: [
      { name: "Engineering", percent: "52%", color: "bg-tertiary-container", stroke: "#C9A227", strokeDasharray: "260 502" },
      { name: "Operations", percent: "30%", color: "bg-primary", stroke: "#09152e", strokeDasharray: "150 502", strokeDashoffset: "-260" },
      { name: "Product", percent: "18%", color: "bg-primary-container", stroke: "#1F2A44", strokeDasharray: "92 502", strokeDashoffset: "-410" }
    ],
    jobs: [
      { role: "Staff Software Engineer (L5)", dept: "Engineering", deptColor: "bg-tertiary-fixed text-on-tertiary-fixed", loc: "Bengaluru, KA", time: "2h ago" },
      { role: "Director of Supply Chain", dept: "Operations", deptColor: "bg-surface-container-high text-on-primary-fixed", loc: "Bengaluru, KA", time: "1d ago" },
      { role: "Senior Product Manager", dept: "Product", deptColor: "bg-primary-container text-white", loc: "Mumbai, MH", time: "3d ago" }
    ]
  },
  swiggy: {
    heroTitle: "Swiggy Talent Ecosystem",
    heroDesc: "Balanced hiring across Instamart and Food delivery segments, with a notable uptick in regional growth and ops leadership.",
    timelineBars: [150, 165, 140, 180, 175, 190, 185, 205, 195],
    allocationTotal: "OPS",
    allocation: [
      { name: "Operations", percent: "45%", color: "bg-primary", stroke: "#09152e", strokeDasharray: "226 502" },
      { name: "Engineering", percent: "35%", color: "bg-tertiary-container", stroke: "#C9A227", strokeDasharray: "175 502", strokeDashoffset: "-226" },
      { name: "Product", percent: "20%", color: "bg-primary-container", stroke: "#1F2A44", strokeDasharray: "101 502", strokeDashoffset: "-401" }
    ],
    jobs: [
      { role: "Regional Growth Lead", dept: "Operations", deptColor: "bg-surface-container-high text-on-primary-fixed", loc: "Mumbai, MH", time: "5h ago" },
      { role: "Machine Learning Scientist", dept: "Engineering", deptColor: "bg-tertiary-fixed text-on-tertiary-fixed", loc: "Hyderabad, TS", time: "2d ago" },
      { role: "City Head - Instamart", dept: "Operations", deptColor: "bg-surface-container-high text-on-primary-fixed", loc: "Pune, MH", time: "4d ago" }
    ]
  },
  blinkit: {
    heroTitle: "Blinkit Talent Ecosystem",
    heroDesc: "Heavily constrained hiring focused primarily on Product Design and user experience roles, suggesting an upcoming app overhaul.",
    timelineBars: [45, 52, 60, 55, 48, 65, 80, 75, 90],
    allocationTotal: "PRD",
    allocation: [
      { name: "Product", percent: "40%", color: "bg-primary-container", stroke: "#1F2A44", strokeDasharray: "200 502" },
      { name: "Operations", percent: "35%", color: "bg-primary", stroke: "#09152e", strokeDasharray: "175 502", strokeDashoffset: "-200" },
      { name: "Engineering", percent: "25%", color: "bg-tertiary-container", stroke: "#C9A227", strokeDasharray: "127 502", strokeDashoffset: "-375" }
    ],
    jobs: [
      { role: "Senior Product Designer", dept: "Product", deptColor: "bg-primary-container text-white", loc: "Gurugram, HR", time: "1d ago" },
      { role: "UX Researcher", dept: "Product", deptColor: "bg-primary-container text-white", loc: "Gurugram, HR", time: "2d ago" },
      { role: "Dark Store Manager", dept: "Operations", deptColor: "bg-surface-container-high text-on-primary-fixed", loc: "Delhi, DL", time: "5d ago" }
    ]
  }
};

export default function HiringIntelligence() {
  const [activeTab, setActiveTab] = useState('swiggy');
  const d = COMPETITORS.find(c => c.id === activeTab);
  const data = BASE_DATA[activeTab];

  return (
    <div className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/*  Page Header  */}
      <section className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Talent Ecosystem</span>
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">{data.heroTitle}</h1>
          <p className="text-lg text-on-surface-variant font-medium max-w-lg leading-relaxed mt-4">{data.heroDesc}</p>
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

      {/*  Bento Grid Section  */}
      <div className="grid grid-cols-12 gap-10">
        {/*  Hiring Activity Timeline (Main Bar Chart)  */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-primary/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-primary">Hiring Activity Timeline</h3>
              <p className="text-sm text-on-surface-variant">Weekly job posting volume</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-surface-container-low text-xs font-bold rounded-full">Weekly</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_horiz</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {data.timelineBars.map((val, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-lg hover:bg-primary transition-all duration-500 cursor-help group relative" style={{ height: `${(val / 250) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
              </div>
            ))}
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
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-primary/5">
          <h3 className="text-xl font-bold text-primary mb-1">Talent Allocation</h3>
          <p className="text-sm text-on-surface-variant mb-8">Role distribution by department</p>
          <div className="relative flex justify-center items-center mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" fill="none" r="80" stroke="#f2f3ff" strokeWidth="24"></circle>
              {data.allocation.map((a, idx) => (
                <circle key={idx} className="transition-all duration-1000" cx="96" cy="96" fill="none" r="80" 
                        stroke={a.stroke} strokeDasharray={a.strokeDasharray} strokeDashoffset={a.strokeDashoffset || 0} strokeWidth="24"></circle>
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm uppercase font-bold text-primary/40">Top</span>
              <span className="text-3xl font-black text-primary tracking-tighter">{data.allocationTotal}</span>
            </div>
          </div>
          <div className="space-y-4">
            {data.allocation.map(a => (
              <div key={a.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${a.color}`}></div>
                  <span className="text-sm font-medium">{a.name}</span>
                </div>
                <span className="text-sm font-bold">{a.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Recent Job Posts Table Section  */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-white">
          <h3 className="text-xl font-headline font-bold text-primary">Live Talent Influx</h3>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors text-primary">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-primary text-white rounded-xl">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filters
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
              {data.jobs.map((job, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs w-8 h-8 flex-shrink-0">
                        {d.name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm text-primary">{job.role}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${job.deptColor}`}>{job.dept}</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{job.loc}</td>
                  <td className="px-8 py-5 text-sm font-bold text-primary/60">{job.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-surface-container-low/20 flex items-center justify-between">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing 3 latest acquisitions</p>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}

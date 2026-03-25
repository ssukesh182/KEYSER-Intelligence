import React, { useState } from 'react';

const COMPETITORS = [
  { id: 'zepto', name: 'Zepto', tagline: 'Quick commerce leader, 10-min delivery' },
  { id: 'swiggy', name: 'Swiggy', tagline: 'Food + Instamart dual-vertical powerhouse' },
  { id: 'blinkit', name: 'Blinkit', tagline: 'Zomato-backed rapid grocery expansion' },
];

const BASE_DATA = {
  zepto: {
    title: "Zepto: Search Experience Overhaul",
    description: "Detected a major update to the search algorithm and UI, introducing predictive autocomplete and prioritizing high-margin private label products.",
    noveltyScore: "8.7",
    noveltyLabel: "High Novelty",
    noveltyBarWidth: "87%",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC36inrs_N0WH9Af8QO0P3qi9-hj27rdK3jAEJqr_oiim6w7nTHAPxjxDxaZjiyGTe1Yn4uBu6cy9FwpeC-yc4WBLUm3jMTaUWAnw0X3d1Jj674oMDNpDxctga36x3u7pLLwMDqjyHXi5R09HFbANcJzW2_8VEgnr3F9xafJ8kkTz95Eh65j2tkMY4n_a4qiCQY4gM_CW_K6GdNSL2_URkPXlTYpfIv1Jspy9TA_PHfJT1JezYbFAibZlBVEmJnx2PBzOTQOKIdxRss",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtPVQU_sEzFrY-ERUufEuZOkOaR52arHVseznaqO4iMwW5rt9qrb9uCr6wBo31ou8YZozGoNZ9mOnZP5z1SLsut-v15MUJGuRm9rG-nG_7oe_Q1h1ual2zg4TVnnUJEWIUMLDWeqi1H_WkoPTKZUvgsG7C9kTyXPkYcMPCcbxw0CAMtLT1-9i-jPAulhPWpJ5SqNQhVG0N0gO0Mv7PyTqZ3NutZpSd63tMH0inTI_uPtjnqI08rdI1eLTQ5W8ERqJFqQln3h6hJCW",
    versionBefore: "Oct 22, 14:30",
    versionAfter: "Oct 24, 09:15",
    beforeTitle: "Standard Search",
    beforeDesc: "Basic exact-match search with standard grid results.",
    afterTitle: "Predictive Search UI",
    afterDesc: "Added visual predictive chips and sponsored product slots in top row.",
    diffRemoved: "REMOVED",
    diffAdded: "NEW MODULE",
    activityLog: [
      { date: "Oct 24, 2023", time: "09:15 AM", icon: "search", title: "Predictive Search Rollout", desc: "Deployed new autocomplete UI across all Tier 1 cities.", tag1: "Core UX", tag2: "Impact: High" },
      { date: "Oct 20, 2023", time: "11:30 AM", icon: "bolt", title: "Performance Tweak", desc: "Decreased image load times by 14% on PDPs.", tag1: "Performance", tag2: "Impact: Med" },
      { date: "Oct 15, 2023", time: "02:45 PM", icon: "credit_card", title: "Wallet Integration", desc: "Added quick-add funds button to the cart slider.", tag1: "Payments", tag2: "Impact: Low" }
    ]
  },
  swiggy: {
    title: "Swiggy Instamart: Checkout Redesign Analysis",
    description: "Detected a significant architectural shift in the cart-to-payment flow. This change prioritizes loyalty subscription upselling over immediate transaction completion.",
    noveltyScore: "9.4",
    noveltyLabel: "Critical / High Novelty",
    noveltyBarWidth: "94%",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC36inrs_N0WH9Af8QO0P3qi9-hj27rdK3jAEJqr_oiim6w7nTHAPxjxDxaZjiyGTe1Yn4uBu6cy9FwpeC-yc4WBLUm3jMTaUWAnw0X3d1Jj674oMDNpDxctga36x3u7pLLwMDqjyHXi5R09HFbANcJzW2_8VEgnr3F9xafJ8kkTz95Eh65j2tkMY4n_a4qiCQY4gM_CW_K6GdNSL2_URkPXlTYpfIv1Jspy9TA_PHfJT1JezYbFAibZlBVEmJnx2PBzOTQOKIdxRss",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtPVQU_sEzFrY-ERUufEuZOkOaR52arHVseznaqO4iMwW5rt9qrb9uCr6wBo31ou8YZozGoNZ9mOnZP5z1SLsut-v15MUJGuRm9rG-nG_7oe_Q1h1ual2zg4TVnnUJEWIUMLDWeqi1H_WkoPTKZUvgsG7C9kTyXPkYcMPCcbxw0CAMtLT1-9i-jPAulhPWpJ5SqNQhVG0N0gO0Mv7PyTqZ3NutZpSd63tMH0inTI_uPtjnqI08rdI1eLTQ5W8ERqJFqQln3h6hJCW",
    versionBefore: "Oct 12, 09:14",
    versionAfter: "Oct 12, 11:22",
    beforeTitle: "Original Checkout Flow",
    beforeDesc: "Direct path to payment. Transaction-focused layout with minimal secondary actions.",
    afterTitle: "Revised Retention-First Flow",
    afterDesc: "Introduced 'One Membership' upsell block. Increased friction for non-subscribers.",
    diffRemoved: "REMOVED",
    diffAdded: "NEW MODULE",
    activityLog: [
      { date: "Oct 14, 2023", time: "04:22 PM", icon: "palette", title: "Homepage Category Icon Refresh", desc: "Updating visual iconography for 'Dineout' and 'Instamart' categories for better visual distinction.", tag1: "Visual Adjustment", tag2: "Impact: Low" },
      { date: "Oct 12, 2023", time: "11:22 AM", icon: "layers", title: "Checkout Architecture Restructuring", desc: "Major overhaul of the payment funnel focusing on subscription conversion and cart summary clarity.", tag1: "Core UX Shift", tag2: "Impact: Critical" },
      { date: "Oct 08, 2023", time: "09:05 AM", icon: "speed", title: "New 'Speed-up' Cart Interaction", desc: "Micro-interaction changes when adding high-velocity items to cart. Reduced tap latency.", tag1: "Performance", tag2: "Impact: Med" }
    ]
  },
  blinkit: {
    title: "Blinkit: Print Ad to Digital Bridging",
    description: "Observed integration of scan-to-cart QR codes in PDP banners, indicating an aggressive print-to-digital omni-channel acquisition strategy.",
    noveltyScore: "7.8",
    noveltyLabel: "Moderate Novelty",
    noveltyBarWidth: "78%",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC36inrs_N0WH9Af8QO0P3qi9-hj27rdK3jAEJqr_oiim6w7nTHAPxjxDxaZjiyGTe1Yn4uBu6cy9FwpeC-yc4WBLUm3jMTaUWAnw0X3d1Jj674oMDNpDxctga36x3u7pLLwMDqjyHXi5R09HFbANcJzW2_8VEgnr3F9xafJ8kkTz95Eh65j2tkMY4n_a4qiCQY4gM_CW_K6GdNSL2_URkPXlTYpfIv1Jspy9TA_PHfJT1JezYbFAibZlBVEmJnx2PBzOTQOKIdxRss",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtPVQU_sEzFrY-ERUufEuZOkOaR52arHVseznaqO4iMwW5rt9qrb9uCr6wBo31ou8YZozGoNZ9mOnZP5z1SLsut-v15MUJGuRm9rG-nG_7oe_Q1h1ual2zg4TVnnUJEWIUMLDWeqi1H_WkoPTKZUvgsG7C9kTyXPkYcMPCcbxw0CAMtLT1-9i-jPAulhPWpJ5SqNQhVG0N0gO0Mv7PyTqZ3NutZpSd63tMH0inTI_uPtjnqI08rdI1eLTQ5W8ERqJFqQln3h6hJCW",
    versionBefore: "Nov 02, 18:00",
    versionAfter: "Nov 03, 06:30",
    beforeTitle: "Standard Hero Banner",
    beforeDesc: "Static promotional hero banners for FMCG products.",
    afterTitle: "Interactive QR Banner",
    afterDesc: "Added dynamic QR codes enabling immediate cart addition from web to app.",
    diffRemoved: "MODIFIED",
    diffAdded: "NEW MODULE",
    activityLog: [
      { date: "Nov 03, 2023", time: "06:30 AM", icon: "qr_code_scanner", title: "QR Scan-to-Cart", desc: "Deployed cross-platform QR codes on desktop web to drive app installations.", tag1: "Growth Strategy", tag2: "Impact: High" },
      { date: "Oct 28, 2023", time: "01:15 PM", icon: "category", title: "Category Reorganization", desc: "Moved electronics and beauty to the primary navigation drawer.", tag1: "Navigation", tag2: "Impact: Med" },
      { date: "Oct 22, 2023", time: "10:00 AM", icon: "local_offer", title: "Dynamic Pricing Module", desc: "Introduced surge pricing indicators during peak hours.", tag1: "Pricing", tag2: "Impact: High" }
    ]
  }
};

export default function WebsiteChanges() {
  const [activeTab, setActiveTab] = useState('swiggy');
  const d = COMPETITORS.find(c => c.id === activeTab);
  const data = BASE_DATA[activeTab];
  
  return (
    <div className="flex-1 p-12 max-w-[1600px] mx-auto w-full">
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

      {/*  Page Header Asymmetric Layout  */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 md:col-start-2 md:col-span-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> High Signal Event
          </span>
          <h2 className="font-headline font-extrabold text-5xl text-primary leading-tight mb-6">{data.title}</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed font-medium">{data.description}</p>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col justify-end pb-2">
          <div className="bg-surface-container-low p-8 rounded-3xl border-l-4 border-tertiary-container">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Novelty Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-black text-primary tracking-tighter">{data.noveltyScore}</span>
              <span className="text-tertiary font-bold uppercase text-xs tracking-wider">{data.noveltyLabel}</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-white rounded-full overflow-hidden">
              <div className="h-full bg-tertiary-container transition-all duration-1000" style={{ width: data.noveltyBarWidth }}></div>
            </div>
          </div>
        </div>
      </section>

      {/*  Visual Diff Viewer  */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="text-xs font-bold uppercase tracking-widest">Deletions</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-widest">Additions</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-surface-container-high px-4 py-2 rounded-lg text-xs font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">zoom_in</span> Inspect Pixels
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/*  Before Card  */}
          <div className="relative group">
            <div className="absolute -top-4 left-6 bg-primary px-4 py-1.5 rounded-lg z-10">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Version: {data.versionBefore}</span>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-primary/5 ring-1 ring-primary/5">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                <img alt="Previous UI state" className="w-full h-full object-cover grayscale opacity-60" src={data.beforeImage} />
                <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-20 border-2 border-red-500/50 bg-red-500/5 rounded-lg flex items-center justify-center">
                  <span className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">{data.diffRemoved}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-headline font-bold text-primary">{data.beforeTitle}</h4>
                <p className="text-sm text-on-surface-variant mt-1">{data.beforeDesc}</p>
              </div>
            </div>
          </div>
          
          {/*  After Card  */}
          <div className="relative group">
            <div className="absolute -top-4 left-6 bg-tertiary-container px-4 py-1.5 rounded-lg z-10">
              <span className="text-on-tertiary-container text-[10px] font-bold uppercase tracking-widest">Version: {data.versionAfter}</span>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-primary/5 ring-1 ring-primary/5">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                <img alt="New UI state" className="w-full h-full object-cover" src={data.afterImage} />
                <div className="absolute inset-0 bg-emerald-500/5"></div>
                <div className="absolute top-[20%] right-[10%] w-1/3 h-48 border-2 border-emerald-500/50 bg-emerald-500/5 rounded-lg flex items-start justify-end p-2">
                  <span className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">{data.diffAdded}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-headline font-bold text-primary">{data.afterTitle}</h4>
                <p className="text-sm text-on-surface-variant mt-1">{data.afterDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  Change History Timeline  */}
      <section className="max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-headline font-extrabold text-2xl text-primary">Activity Log</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-surface-container-low border-none rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
                <option>All Changes</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">expand_more</span>
            </div>
            <div className="h-8 w-[1px] bg-primary/10 mx-2"></div>
            <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">calendar_today</span> Oct 1 - Oct 31
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.activityLog.map((log, idx) => (
            <div key={idx} className="group flex items-center gap-8 p-6 bg-white hover:bg-surface-container-low rounded-2xl transition-all duration-300 border border-primary/5">
              <div className="w-32 flex-shrink-0">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{log.date}</p>
                <p className="text-xs font-medium text-on-surface-variant/60">{log.time}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{log.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{d.name}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                  <h5 className="font-bold text-primary text-base">{log.title}</h5>
                </div>
                <p className="text-sm text-on-surface-variant/80">{log.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">{log.tag1}</span>
                <span className="text-[10px] font-bold text-tertiary-container uppercase tracking-widest">{log.tag2}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <button className="text-xs font-bold text-primary hover:tracking-widest transition-all duration-500 uppercase tracking-[0.2em] py-4 px-8 border border-primary/10 rounded-full hover:bg-surface-container-low">
            Fetch Older Intelligence
          </button>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

export default function WebsiteChanges({ onEnter, onNavigate }) {
  return (
    <>
      {/*  SideNavBar  */}
<aside className="fixed left-0 top-0 h-screen flex flex-col p-6 border-r border-primary/5 bg-surface-container-low w-72 z-40">
<div className="mb-10 px-2">
<h2 className="font-headline font-bold text-primary tracking-tight text-xl">Intelligence</h2>
<p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Sovereign Framework</p>
</div>
<nav className="flex-1 space-y-2">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant/60 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 rounded-xl font-medium text-sm" href="#">
<span className="material-symbols-outlined">dashboard</span> Overview
            </a>
<a className="flex items-center gap-3 px-4 py-3 bg-white text-primary rounded-xl shadow-sm translate-x-1 transition-all duration-300 font-medium text-sm" href="#">
<span className="material-symbols-outlined">update</span> Website Changes
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant/60 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 rounded-xl font-medium text-sm" href="#">
<span className="material-symbols-outlined">ads_click</span> Google Ads
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant/60 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 rounded-xl font-medium text-sm" href="#">
<span className="material-symbols-outlined">rate_review</span> App Reviews
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant/60 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 rounded-xl font-medium text-sm" href="#">
<span className="material-symbols-outlined">person_search</span> Hiring Tracker
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant/60 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 rounded-xl font-medium text-sm" href="#">
<span className="material-symbols-outlined">radar</span> Whitespace Radar
            </a>
</nav>
<div className="mt-auto space-y-6">
<button className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-lg shadow-primary/10">
<span className="material-symbols-outlined text-sm">auto_awesome</span> AI Co-Pilot
            </button>
<div className="pt-6 border-t border-primary/5 space-y-1">
<a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 hover:text-primary transition-colors text-sm" href="#">
<span className="material-symbols-outlined text-xl">settings</span> Settings
                </a>
<a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 hover:text-primary transition-colors text-sm" href="#">
<span className="material-symbols-outlined text-xl">help_outline</span> Support
                </a>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="ml-72 min-h-screen flex flex-col">
{/*  TopAppBar  */}
<header className="sticky top-0 w-full z-30 flex justify-between items-center px-12 h-20 bg-white/80 backdrop-blur-xl">
<div className="flex items-center gap-8">
<h1 className="font-headline font-black text-primary uppercase tracking-widest text-xl">KEYSER Intelligence</h1>
<nav className="hidden md:flex gap-6">
<a className="text-on-surface-variant/70 hover:text-primary transition-colors font-bold text-sm" href="#">Zepto</a>
<a className="text-primary font-bold border-b-2 border-tertiary-container pb-1 text-sm" href="#">Swiggy</a>
<a className="text-on-surface-variant/70 hover:text-primary transition-colors font-bold text-sm" href="#">Blinkit</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="flex bg-surface-container-low rounded-xl p-1 gap-1">
<button className="px-4 py-2 rounded-lg text-xs font-bold text-primary bg-white shadow-sm">30d</button>
<button className="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant/60 hover:bg-white/50 transition-colors">90d</button>
</div>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
<span className="material-symbols-outlined">filter_alt</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
<span className="material-symbols-outlined">history</span>
</button>
<button className="ml-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-container transition-transform active:scale-95">
                    Refresh Data
                </button>
</div>
</header>
{/*  Page Content  */}
<div className="flex-1 p-12 max-w-[1600px] mx-auto w-full">
{/*  Page Header Asymmetric Layout  */}
<section className="grid grid-cols-12 gap-8 mb-16">
<div className="col-span-12 md:col-start-2 md:col-span-6">
<span className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
<span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> High Signal Event
                    </span>
<h2 className="font-headline font-extrabold text-5xl text-primary leading-tight mb-6">Swiggy Instamart: Checkout Redesign Analysis</h2>
<p className="text-on-surface-variant text-lg leading-relaxed font-medium">Detected a significant architectural shift in the cart-to-payment flow. This change prioritizes loyalty subscription upselling over immediate transaction completion.</p>
</div>
<div className="col-span-12 md:col-span-4 flex flex-col justify-end pb-2">
<div className="bg-surface-container-low p-8 rounded-3xl border-l-4 border-tertiary-container">
<p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Novelty Score</p>
<div className="flex items-baseline gap-2">
<span className="text-5xl font-headline font-black text-primary tracking-tighter">9.4</span>
<span className="text-tertiary font-bold uppercase text-xs tracking-wider">Critical / High Novelty</span>
</div>
<div className="mt-4 h-1.5 w-full bg-white rounded-full overflow-hidden">
<div className="h-full bg-tertiary-container w-[94%]"></div>
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
<span className="text-white text-[10px] font-bold uppercase tracking-widest">Version: Oct 12, 09:14</span>
</div>
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-primary/5 ring-1 ring-primary/5">
<div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
<img alt="Previous UI state" className="w-full h-full object-cover grayscale opacity-60" data-alt="Screenshot of a mobile app checkout interface with classic blue and white design showing cart items and a simple checkout button" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC36inrs_N0WH9Af8QO0P3qi9-hj27rdK3jAEJqr_oiim6w7nTHAPxjxDxaZjiyGTe1Yn4uBu6cy9FwpeC-yc4WBLUm3jMTaUWAnw0X3d1Jj674oMDNpDxctga36x3u7pLLwMDqjyHXi5R09HFbANcJzW2_8VEgnr3F9xafJ8kkTz95Eh65j2tkMY4n_a4qiCQY4gM_CW_K6GdNSL2_URkPXlTYpfIv1Jspy9TA_PHfJT1JezYbFAibZlBVEmJnx2PBzOTQOKIdxRss"/>
<div className="absolute inset-0 bg-red-500/10 mix-blend-multiply"></div>
{/*  Mock Diff Highlight  */}
<div className="absolute top-1/4 left-1/4 w-1/2 h-20 border-2 border-red-500/50 bg-red-500/5 rounded-lg flex items-center justify-center">
<span className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">REMOVED</span>
</div>
</div>
<div className="p-6">
<h4 className="font-headline font-bold text-primary">Original Checkout Flow</h4>
<p className="text-sm text-on-surface-variant mt-1">Direct path to payment. Transaction-focused layout with minimal secondary actions.</p>
</div>
</div>
</div>
{/*  After Card  */}
<div className="relative group">
<div className="absolute -top-4 left-6 bg-tertiary-container px-4 py-1.5 rounded-lg z-10">
<span className="text-on-tertiary-container text-[10px] font-bold uppercase tracking-widest">Version: Oct 12, 11:22</span>
</div>
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-primary/5 ring-1 ring-primary/5">
<div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
<img alt="New UI state" className="w-full h-full object-cover" data-alt="Screenshot of a mobile app checkout interface with modern vibrant design featuring a prominent loyalty program banner and floating checkout action" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdtPVQU_sEzFrY-ERUufEuZOkOaR52arHVseznaqO4iMwW5rt9qrb9uCr6wBo31ou8YZozGoNZ9mOnZP5z1SLsut-v15MUJGuRm9rG-nG_7oe_Q1h1ual2zg4TVnnUJEWIUMLDWeqi1H_WkoPTKZUvgsG7C9kTyXPkYcMPCcbxw0CAMtLT1-9i-jPAulhPWpJ5SqNQhVG0N0gO0Mv7PyTqZ3NutZpSd63tMH0inTI_uPtjnqI08rdI1eLTQ5W8ERqJFqQln3h6hJCW"/>
<div className="absolute inset-0 bg-emerald-500/5"></div>
{/*  Mock Diff Highlight  */}
<div className="absolute top-[20%] right-[10%] w-1/3 h-48 border-2 border-emerald-500/50 bg-emerald-500/5 rounded-lg flex items-start justify-end p-2">
<span className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">NEW MODULE</span>
</div>
</div>
<div className="p-6">
<h4 className="font-headline font-bold text-primary">Revised Retention-First Flow</h4>
<p className="text-sm text-on-surface-variant mt-1">Introduced "One Membership" upsell block. Increased friction for non-subscribers.</p>
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
<option>All Competitors</option>
<option>Swiggy</option>
<option>Zomato</option>
<option>Zepto</option>
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
{/*  Timeline Item 1  */}
<div className="group flex items-center gap-8 p-6 bg-white hover:bg-surface-container-low rounded-2xl transition-all duration-300 border border-primary/5">
<div className="w-32 flex-shrink-0">
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Oct 14, 2023</p>
<p className="text-xs font-medium text-on-surface-variant/60">04:22 PM</p>
</div>
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">palette</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-3 mb-1">
<span className="text-[10px] font-black text-primary uppercase tracking-widest">Swiggy</span>
<span className="w-1 h-1 rounded-full bg-primary/20"></span>
<h5 className="font-bold text-primary text-base">Homepage Category Icon Refresh</h5>
</div>
<p className="text-sm text-on-surface-variant/80">Updating visual iconography for "Dineout" and "Instamart" categories for better visual distinction.</p>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Visual Adjustment</span>
<span className="text-[10px] font-bold text-tertiary-container uppercase tracking-widest">Impact: Low</span>
</div>
</div>
{/*  Timeline Item 2  */}
<div className="group flex items-center gap-8 p-6 bg-white hover:bg-surface-container-low rounded-2xl transition-all duration-300 border border-primary/5">
<div className="w-32 flex-shrink-0">
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Oct 12, 2023</p>
<p className="text-xs font-medium text-on-surface-variant/60">11:22 AM</p>
</div>
<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-on-tertiary-fixed">layers</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-3 mb-1">
<span className="text-[10px] font-black text-primary uppercase tracking-widest">Swiggy</span>
<span className="w-1 h-1 rounded-full bg-primary/20"></span>
<h5 className="font-bold text-primary text-base">Checkout Architecture Restructuring</h5>
</div>
<p className="text-sm text-on-surface-variant/80">Major overhaul of the payment funnel focusing on subscription conversion and cart summary clarity.</p>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-3 py-1 bg-tertiary-container text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">Core UX Shift</span>
<span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Impact: Critical</span>
</div>
</div>
{/*  Timeline Item 3  */}
<div className="group flex items-center gap-8 p-6 bg-white hover:bg-surface-container-low rounded-2xl transition-all duration-300 border border-primary/5">
<div className="w-32 flex-shrink-0">
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Oct 08, 2023</p>
<p className="text-xs font-medium text-on-surface-variant/60">09:05 AM</p>
</div>
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">speed</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-3 mb-1">
<span className="text-[10px] font-black text-primary uppercase tracking-widest">Zepto</span>
<span className="w-1 h-1 rounded-full bg-primary/20"></span>
<h5 className="font-bold text-primary text-base">New "Speed-up" Cart Interaction</h5>
</div>
<p className="text-sm text-on-surface-variant/80">Micro-interaction changes when adding high-velocity items to cart. Reduced tap latency.</p>
</div>
<div className="flex flex-col items-end gap-2">
<span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Performance</span>
<span className="text-[10px] font-bold text-tertiary-container uppercase tracking-widest">Impact: Med</span>
</div>
</div>
</div>
<div className="mt-10 flex justify-center">
<button className="text-xs font-bold text-primary hover:tracking-widest transition-all duration-500 uppercase tracking-[0.2em] py-4 px-8 border border-primary/10 rounded-full hover:bg-surface-container-low">
                        Fetch Older Intelligence
                    </button>
</div>
</section>
</div>
{/*  Footer  */}
<footer className="w-full flex justify-between items-center px-12 py-8 mt-auto border-t border-primary/5 bg-white">
<div className="flex items-center gap-6">
<span className="font-headline font-bold text-tertiary-container text-sm">SNUC Hacks '26</span>
<div className="flex gap-4">
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-tertiary-container transition-colors" href="#">Privacy Policy</a>
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-tertiary-container transition-colors" href="#">Terms of Intelligence</a>
<a className="text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-tertiary-container transition-colors" href="#">Institutional Access</a>
</div>
</div>
<p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">© 2023 KEYSER Intelligence Systems. All Rights Reserved.</p>
</footer>
</main>
    </>
  );
}

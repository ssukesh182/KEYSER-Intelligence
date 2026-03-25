import React from 'react';

export default function AppReviews() {
  return (
    <>
      {/*  TopAppBar  */}

{/*  Canvas Area  */}
<div className="pt-28 px-12 pb-12 flex-1">
{/*  Page Header & Store Selector  */}
<section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Sentiment Intelligence</span>
<h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight">App Reviews Analysis</h1>
</div>
<div className="flex bg-surface-container-low p-1.5 rounded-2xl">
<button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-primary shadow-sm">App Store</button>
<button className="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-white/50 transition-all">Play Store</button>
<button className="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-white/50 transition-all">G2</button>
<button className="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-white/50 transition-all">Trustpilot</button>
</div>
</section>
{/*  Sentiment Timeline (Main Chart)  */}
<section className="mb-8">
<div className="bg-surface-container-lowest rounded-3xl p-8 border border-primary/5 relative overflow-hidden group">
<div className="flex justify-between items-start mb-8 relative z-10">
<div>
<h3 className="font-headline font-bold text-xl text-primary">Sentiment Timeline</h3>
<p className="text-sm text-on-surface-variant">Aggregate sentiment trends over the last 30 days</p>
</div>
<div className="flex gap-4">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
<span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Positive</span>
</div>
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
<span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Neutral</span>
</div>
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
<span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Negative</span>
</div>
</div>
</div>
{/*  Placeholder for Chart - Visualizing with Styled Divs  */}
<div className="h-64 flex items-end gap-1 px-4 mb-4 relative">
{/*  Abstract Line Chart Visualization  */}
<div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
<svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 1000 100">
<path d="M0,80 Q100,20 200,50 T400,30 T600,70 T800,20 T1000,40" fill="none" stroke="#10b981" strokeWidth="3"></path>
<path d="M0,60 Q100,50 200,70 T400,60 T600,40 T800,80 T1000,50" fill="none" stroke="#C9A227" strokeWidth="2"></path>
<path d="M0,40 Q100,80 200,60 T400,90 T600,50 T800,70 T1000,60" fill="none" stroke="#ba1a1a" strokeWidth="2"></path>
</svg>
</div>
{/*  Timeline Axis  */}
<div className="w-full flex justify-between pt-4 border-t border-primary/5 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-4">
<span>01 Oct</span>
<span>07 Oct</span>
<span>14 Oct</span>
<span>21 Oct</span>
<span>28 Oct</span>
</div>
</div>
</div>
</section>
{/*  Bento Grid: Themes & Insights  */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
{/*  Top Complaint Themes  */}
<div className="lg:col-span-8 bg-surface-container-low rounded-3xl p-8">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline font-bold text-lg text-primary">Top Complaint Themes</h3>
<span className="text-[10px] font-bold bg-white text-primary px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Real-time Analysis</span>
</div>
<div className="space-y-4">
{/*  Theme Item  */}
<div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between group hover:translate-x-1 transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-error-container/30 flex items-center justify-center rounded-xl text-error">
<span className="material-symbols-outlined">payments</span>
</div>
<div>
<p className="font-bold text-primary">Subscription Renewal Error</p>
<p className="text-xs text-on-surface-variant">42% of negative reviews this week</p>
</div>
</div>
<div className="text-right">
<div className="flex items-center gap-1 text-error mb-1">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="text-xs font-bold">+12%</span>
</div>
<div className="w-24 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-error w-3/4"></div>
</div>
</div>
</div>
{/*  Theme Item  */}
<div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between group hover:translate-x-1 transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-error-container/30 flex items-center justify-center rounded-xl text-error">
<span className="material-symbols-outlined">shutter_speed</span>
</div>
<div>
<p className="font-bold text-primary">App Loading Latency</p>
<p className="text-xs text-on-surface-variant">28% of negative reviews this week</p>
</div>
</div>
<div className="text-right">
<div className="flex items-center gap-1 text-emerald-500 mb-1">
<span className="material-symbols-outlined text-sm">trending_down</span>
<span className="text-xs font-bold">-5%</span>
</div>
<div className="w-24 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-error w-1/2"></div>
</div>
</div>
</div>
{/*  Theme Item  */}
<div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between group hover:translate-x-1 transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-error-container/30 flex items-center justify-center rounded-xl text-error">
<span className="material-symbols-outlined">account_tree</span>
</div>
<div>
<p className="font-bold text-primary">Checkout Flow UI Confusion</p>
<p className="text-xs text-on-surface-variant">15% of negative reviews this week</p>
</div>
</div>
<div className="text-right">
<div className="flex items-center gap-1 text-on-surface-variant mb-1">
<span className="material-symbols-outlined text-sm">horizontal_rule</span>
<span className="text-xs font-bold">Stable</span>
</div>
<div className="w-24 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-error w-1/4"></div>
</div>
</div>
</div>
</div>
</div>
{/*  Strategic Summary  */}
<div className="lg:col-span-4 bg-primary-container rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
<div className="relative z-10">
<span className="text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest block mb-4">Strategic Insight</span>
<h4 className="font-headline font-bold text-2xl mb-4 leading-tight">Billing issues are driving a 15% drop in day-30 retention.</h4>
<p className="text-on-primary-container text-sm leading-relaxed mb-6">
                            Recommend immediate engineering triage for the Stripe webhook latency identified in several Trustpilot reviews.
                        </p>
<button className="w-full py-3 bg-tertiary-fixed text-on-tertiary-fixed font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                            Generate Full Report
                        </button>
</div>
{/*  Decorative background glow  */}
<div className="absolute -bottom-20 -right-20 w-64 h-64 bg-tertiary-container/20 blur-[80px] rounded-full"></div>
</div>
</section>
{/*  Review Feed Section  */}
<section>
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline font-extrabold text-2xl text-primary tracking-tight">Recent Review Intelligence</h3>
<div className="flex gap-2">
<span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mr-4">Showing 3 of 1,240 reviews</span>
<button className="material-symbols-outlined text-primary hover:bg-surface-container-low p-1 rounded-lg transition-colors">keyboard_arrow_left</button>
<button className="material-symbols-outlined text-primary hover:bg-surface-container-low p-1 rounded-lg transition-colors">keyboard_arrow_right</button>
</div>
</div>
<div className="space-y-6">
{/*  Review Card 1  */}
<div className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-4">
<img alt="User profile" className="w-12 h-12 rounded-full object-cover" data-alt="close-up portrait of a professional looking man in his 30s with short hair in a bright office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgW5g0N046nj0pHh7wFwXA0v2Z5KQRlmcNGKqsCEDQzTDVD_n3NbXHkrt7Iuh_pNyfihUJqHX63i8oU79VNeelL_MbVZQkyOwmWkMCQ7GQ7BoKw2hd-PahuOMI0cJn1rMsOaRY47Y0kswTfw3gb5D3spInhJnR2G1qrWKIZJntoKJJ05G-6NN377ofb9yIa_lEtVK6Q4a5ffEz4dfbRZ1-XKISgS8ez6lr5PXwPiOzIIqEwDGJVbTbGu3WhGV5qZhCFH1y9y1hKJMr"/>
<div>
<h5 className="font-bold text-primary">Alex Mercer</h5>
<p className="text-xs text-on-surface-variant/70">Verified User • 2h ago</p>
</div>
</div>
<div className="flex flex-col items-end gap-2">
<div className="flex gap-0.5 text-tertiary-container">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
</div>
<span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Positive Sentiment</span>
</div>
</div>
<p className="text-on-surface-variant leading-relaxed mb-6">
                            "The new dashboard is incredible. Tracking my fleet across the country has never been easier. The UI feels much more professional than the previous version, although I do wish the dark mode was a bit deeper."
                        </p>
<div className="flex items-center gap-3 pt-4 border-t border-primary/5">
<span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Tags:</span>
<span className="bg-surface-container-low text-primary px-3 py-1 rounded-lg text-xs font-semibold">Dashboard UI</span>
<span className="bg-surface-container-low text-primary px-3 py-1 rounded-lg text-xs font-semibold">Performance</span>
</div>
</div>
{/*  Review Card 2  */}
<div className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-4">
<img alt="User profile" className="w-12 h-12 rounded-full object-cover" data-alt="modern close-up portrait of a young woman with curly hair looking directly at the camera with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2lOStIB0wNvQpEq6OB6KJjPESwG440ay8fyWTH6kCOhtkV3FmeXRxY-YGKUSpka5xN2uGQR68GntG-GcnUsxV4pcpd_3Q10JCSFzXTa4k2yps3CyOMK8SGTwyos3-HV0i4wmzU9zusw5GLi3YqDsnagrQMPmHQs-9GDgdJWMQQ_QmhsA0Y3FurkuIp3iOGrDOw80-aX5bvxz7HVzw_hXsLLz8840f7TxuJQUH_mCR9vI1ZS7M6FAC5fmMB_SVIRSl8Qg5By79R5Tf"/>
<div>
<h5 className="font-bold text-primary">Sarah Jenkins</h5>
<p className="text-xs text-on-surface-variant/70">App Store • 5h ago</p>
</div>
</div>
<div className="flex flex-col items-end gap-2">
<div className="flex gap-0.5 text-tertiary-container">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
</div>
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Negative Sentiment</span>
</div>
</div>
<p className="text-on-surface-variant leading-relaxed mb-6 italic">
                            "I'm really struggling with the subscription management. I tried to cancel my trial and it just kept looping back to the payment page. Really frustrating experience for an app that's otherwise great."
                        </p>
<div className="flex items-center gap-3 pt-4 border-t border-primary/5">
<span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Tags:</span>
<span className="bg-error-container/30 text-error px-3 py-1 rounded-lg text-xs font-semibold">Subscription</span>
<span className="bg-error-container/30 text-error px-3 py-1 rounded-lg text-xs font-semibold">Checkout Loop</span>
</div>
</div>
{/*  Review Card 3  */}
<div className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-4">
<img alt="User profile" className="w-12 h-12 rounded-full object-cover" data-alt="professional portrait of a person wearing glasses and a business casual blazer in a bright modern co-working space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgWCZUH9rJeV5qtjAVMN1giNUh2fCtGTfxWqUilU2toC58TLvztka60-8Ijoa19EkI05YI5KDIKSc_ez34iXu4idQ2RuypoY12wGwBfmugD7-XxJxsPW58bz7QluW_laFrdffDwWbsU0beA5HkXxGIUXpuEyPKEEyO6oYiIP1EXavLWHd3RS0W4q490YY1xnc1_xVe5pFiSgoJbYOzKs2X1nsHqw-btLy2qOuI245BinumpJKzPM4XMSpZoOhHPOrd26QHcrnZdqyf"/>
<div>
<h5 className="font-bold text-primary">Marcus Thorne</h5>
<p className="text-xs text-on-surface-variant/70">Verified User • 12h ago</p>
</div>
</div>
<div className="flex flex-col items-end gap-2">
<div className="flex gap-0.5 text-tertiary-container">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
<span className="material-symbols-outlined text-lg" style={{ }} /* font-variation-settings: 'FILL' 0; */>star</span>
</div>
<span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Neutral Sentiment</span>
</div>
</div>
<p className="text-on-surface-variant leading-relaxed mb-6">
                            "The analytics are top notch, but it feels a bit slow when loading the detailed charts for historical data. It’s okay for a daily check but could be more efficient for deep dives."
                        </p>
<div className="flex items-center gap-3 pt-4 border-t border-primary/5">
<span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Tags:</span>
<span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-semibold">Speed</span>
<span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-semibold">Data Viz</span>
</div>
</div>
</div>
</section>
</div>
{/*  Footer  */}
    </>
  );
}

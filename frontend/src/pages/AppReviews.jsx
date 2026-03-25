import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:5001';

// Maps UI tab labels to backend 'source' field values
const SOURCE_MAP = {
  'App Store':   r => r.source === 'serp_google' && r.reviewer?.toLowerCase().includes('apple'),
  'Play Store':  r => r.source === 'serp_google' && !r.reviewer?.toLowerCase().includes('apple'),
  'G2':          r => r.source === 'g2',
  'Trustpilot':  r => r.source === 'trustpilot',
  'Reddit':      r => r.source === 'reddit',
  'All':         () => true,
};

const SOURCES = ['All', 'App Store', 'Play Store', 'G2', 'Trustpilot', 'Reddit'];

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5 text-tertiary-container">
      {[...Array(5)].map((_, j) => (
        <span key={j} className="material-symbols-outlined text-lg" style={j < stars ? { fontVariationSettings: "'FILL' 1" } : {}}>
          star
        </span>
      ))}
    </div>
  );
}

function SentimentBadge({ rating }) {
  if (rating >= 4) return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Positive</span>;
  if (rating <= 2) return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Negative</span>;
  return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Neutral</span>;
}

function LiveReviewCard({ review }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {(review.reviewer || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h5 className="font-bold text-primary">{review.reviewer || 'Anonymous'}</h5>
            <p className="text-xs text-on-surface-variant/70">{review.source} · {review.review_time ? new Date(parseFloat(review.review_time) * (review.review_time.length < 13 ? 1000 : 1)).toLocaleDateString() : 'Recent'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StarRating stars={review.rating || 3} />
          <SentimentBadge rating={review.rating || 3} />
        </div>
      </div>
      <p className="text-on-surface-variant leading-relaxed mb-4 italic">"{review.review_text?.slice(0, 300)}{review.review_text?.length > 300 ? '…' : ''}"
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
        <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Source:</span>
        <span className="bg-surface-container-low text-primary px-3 py-1 rounded-lg text-xs font-semibold">{review.source}</span>
        <span className="bg-surface-container-low text-primary px-3 py-1 rounded-lg text-xs font-semibold">{review.competitor}</span>
      </div>
    </div>
  );
}

const COMPETITORS = [
  { id: 'zepto', name: 'Zepto', tagline: 'Quick commerce leader, 10-min delivery' },
  { id: 'swiggy', name: 'Swiggy', tagline: 'Food + Instamart dual-vertical powerhouse' },
  { id: 'blinkit', name: 'Blinkit', tagline: 'Zomato-backed rapid grocery expansion' },
];

const BASE_DATA = {
  zepto: {
    themes: [
      { icon: "inventory_2", title: "Missing Items", desc: "24% of negative reviews this week", trend: "trending_down", trendVal: "-2%", trendColor: "text-emerald-500", progressWidth: "24%" },
      { icon: "location_off", title: "GPS Inaccuracy", desc: "18% of negative reviews this week", trend: "trending_up", trendVal: "+8%", trendColor: "text-error", progressWidth: "40%" },
      { icon: "support_agent", title: "Support Wait Time", desc: "12% of negative reviews this week", trend: "horizontal_rule", trendVal: "Stable", trendColor: "text-on-surface-variant", progressWidth: "12%" }
    ],
    summaryHeading: "GPS routing issues in Tier-2 cities are impacting the 10-minute promise.",
    summaryBody: "Recommend expanding delivery radii slightly or investing in local mapped pathways to reduce automated refund triggers.",
    reviews: [
      { name: "Rahul Sharma", source: "App Store • 1h ago", stars: 4, sentiment: "Positive Sentiment", sentimentColor: "bg-emerald-100 text-emerald-700", text: "Delivery is blazing fast, but the app crashed once while adding an item to the cart. Still the best grocery app I've used so far.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgW5g0N046nj0pHh7wFwXA0v2Z5KQRlmcNGKqsCEDQzTDVD_n3NbXHkrt7Iuh_pNyfihUJqHX63i8oU79VNeelL_MbVZQkyOwmWkMCQ7GQ7BoKw2hd-PahuOMI0cJn1rMsOaRY47Y0kswTfw3gb5D3spInhJnR2G1qrWKIZJntoKJJ05G-6NN377ofb9yIa_lEtVK6Q4a5ffEz4dfbRZ1-XKISgS8ez6lr5PXwPiOzIIqEwDGJVbTbGu3WhGV5qZhCFH1y9y1hKJMr", tags: ["Speed", "Stability"] },
      { name: "Priya Patel", source: "Play Store • 3h ago", stars: 2, sentiment: "Negative Sentiment", sentimentColor: "bg-red-100 text-red-700", text: "The rider couldn't find my location because the map pin kept jumping around. Customer support just offered a generic apology.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2lOStIB0wNvQpEq6OB6KJjPESwG440ay8fyWTH6kCOhtkV3FmeXRxY-YGKUSpka5xN2uGQR68GntG-GcnUsxV4pcpd_3Q10JCSFzXTa4k2yps3CyOMK8SGTwyos3-HV0i4wmzU9zusw5GLi3YqDsnagrQMPmHQs-9GDgdJWMQQ_QmhsA0Y3FurkuIp3iOGrDOw80-aX5bvxz7HVzw_hXsLLz8840f7TxuJQUH_mCR9vI1ZS7M6FAC5fmMB_SVIRSl8Qg5By79R5Tf", tags: ["GPS", "Support"] },
      { name: "Anil Desai", source: "Verified User • 6h ago", stars: 5, sentiment: "Positive Sentiment", sentimentColor: "bg-emerald-100 text-emerald-700", text: "Got exactly what I ordered in 9 minutes. The packaging is much better now compared to last month.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWCZUH9rJeV5qtjAVMN1giNUh2fCtGTfxWqUilU2toC58TLvztka60-8Ijoa19EkI05YI5KDIKSc_ez34iXu4idQ2RuypoY12wGwBfmugD7-XxJxsPW58bz7QluW_laFrdffDwWbsU0beA5HkXxGIUXpuEyPKEEyO6oYiIP1EXavLWHd3RS0W4q490YY1xnc1_xVe5pFiSgoJbYOzKs2X1nsHqw-btLy2qOuI245BinumpJKzPM4XMSpZoOhHPOrd26QHcrnZdqyf", tags: ["Packaging", "Fulfillment"] }
    ]
  },
  swiggy: {
    themes: [
      { icon: "payments", title: "Subscription Renewal Error", desc: "42% of negative reviews this week", trend: "trending_up", trendVal: "+12%", trendColor: "text-error", progressWidth: "75%" },
      { icon: "shutter_speed", title: "App Loading Latency", desc: "28% of negative reviews this week", trend: "trending_down", trendVal: "-5%", trendColor: "text-emerald-500", progressWidth: "50%" },
      { icon: "account_tree", title: "Checkout Flow UI Confusion", desc: "15% of negative reviews this week", trend: "horizontal_rule", trendVal: "Stable", trendColor: "text-on-surface-variant", progressWidth: "25%" }
    ],
    summaryHeading: "Billing issues are driving a 15% drop in day-30 retention.",
    summaryBody: "Recommend immediate engineering triage for the Stripe webhook latency identified in several Trustpilot reviews.",
    reviews: [
      { name: "Alex Mercer", source: "Verified User • 2h ago", stars: 4, sentiment: "Positive Sentiment", sentimentColor: "bg-emerald-100 text-emerald-700", text: "The new UI is incredible. Ordering is much faster, although I do wish the dark mode was a bit deeper.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgW5g0N046nj0pHh7wFwXA0v2Z5KQRlmcNGKqsCEDQzTDVD_n3NbXHkrt7Iuh_pNyfihUJqHX63i8oU79VNeelL_MbVZQkyOwmWkMCQ7GQ7BoKw2hd-PahuOMI0cJn1rMsOaRY47Y0kswTfw3gb5D3spInhJnR2G1qrWKIZJntoKJJ05G-6NN377ofb9yIa_lEtVK6Q4a5ffEz4dfbRZ1-XKISgS8ez6lr5PXwPiOzIIqEwDGJVbTbGu3WhGV5qZhCFH1y9y1hKJMr", tags: ["UI", "Performance"] },
      { name: "Sarah Jenkins", source: "App Store • 5h ago", stars: 2, sentiment: "Negative Sentiment", sentimentColor: "bg-red-100 text-red-700", text: "I'm really struggling with the subscription management. I tried to cancel my trial and it just kept looping back to the payment page.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2lOStIB0wNvQpEq6OB6KJjPESwG440ay8fyWTH6kCOhtkV3FmeXRxY-YGKUSpka5xN2uGQR68GntG-GcnUsxV4pcpd_3Q10JCSFzXTa4k2yps3CyOMK8SGTwyos3-HV0i4wmzU9zusw5GLi3YqDsnagrQMPmHQs-9GDgdJWMQQ_QmhsA0Y3FurkuIp3iOGrDOw80-aX5bvxz7HVzw_hXsLLz8840f7TxuJQUH_mCR9vI1ZS7M6FAC5fmMB_SVIRSl8Qg5By79R5Tf", tags: ["Subscription", "Checkout Loop"] },
      { name: "Marcus Thorne", source: "Verified User • 12h ago", stars: 3, sentiment: "Neutral Sentiment", sentimentColor: "bg-amber-100 text-amber-700", text: "The restaurant choices are top notch, but it feels a bit slow when loading the detailed menus during peak hours.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWCZUH9rJeV5qtjAVMN1giNUh2fCtGTfxWqUilU2toC58TLvztka60-8Ijoa19EkI05YI5KDIKSc_ez34iXu4idQ2RuypoY12wGwBfmugD7-XxJxsPW58bz7QluW_laFrdffDwWbsU0beA5HkXxGIUXpuEyPKEEyO6oYiIP1EXavLWHd3RS0W4q490YY1xnc1_xVe5pFiSgoJbYOzKs2X1nsHqw-btLy2qOuI245BinumpJKzPM4XMSpZoOhHPOrd26QHcrnZdqyf", tags: ["Speed", "Menu Load"] }
    ]
  },
  blinkit: {
    themes: [
      { icon: "category", title: "Poor Search Relevancy", desc: "35% of negative reviews this week", trend: "trending_up", trendVal: "+15%", trendColor: "text-error", progressWidth: "50%" },
      { icon: "price_change", title: "Surge Pricing Complaints", desc: "25% of negative reviews this week", trend: "trending_down", trendVal: "-2%", trendColor: "text-emerald-500", progressWidth: "30%" },
      { icon: "grocery", title: "Produce Quality", desc: "20% of negative reviews this week", trend: "horizontal_rule", trendVal: "Stable", trendColor: "text-on-surface-variant", progressWidth: "20%" }
    ],
    summaryHeading: "Users are struggling to find non-grocery electronics via search.",
    summaryBody: "Search algorithm is heavily biasing towards FMCG. Adjust weights to factor in the new high-AOV electronics category.",
    reviews: [
      { name: "Vikram Singh", source: "Play Store • 4h ago", stars: 1, sentiment: "Negative Sentiment", sentimentColor: "bg-red-100 text-red-700", text: "I searched for a Sony charger and it kept showing me completely unrelated energy drinks. Extremely frustrating.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgW5g0N046nj0pHh7wFwXA0v2Z5KQRlmcNGKqsCEDQzTDVD_n3NbXHkrt7Iuh_pNyfihUJqHX63i8oU79VNeelL_MbVZQkyOwmWkMCQ7GQ7BoKw2hd-PahuOMI0cJn1rMsOaRY47Y0kswTfw3gb5D3spInhJnR2G1qrWKIZJntoKJJ05G-6NN377ofb9yIa_lEtVK6Q4a5ffEz4dfbRZ1-XKISgS8ez6lr5PXwPiOzIIqEwDGJVbTbGu3WhGV5qZhCFH1y9y1hKJMr", tags: ["Search", "Relevance"] },
      { name: "Sneha Reddy", source: "App Store • 8h ago", stars: 5, sentiment: "Positive Sentiment", sentimentColor: "bg-emerald-100 text-emerald-700", text: "Lifesaver! I needed a last minute gift and managed to order a smartwatch and have it delivered in 12 minutes.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2lOStIB0wNvQpEq6OB6KJjPESwG440ay8fyWTH6kCOhtkV3FmeXRxY-YGKUSpka5xN2uGQR68GntG-GcnUsxV4pcpd_3Q10JCSFzXTa4k2yps3CyOMK8SGTwyos3-HV0i4wmzU9zusw5GLi3YqDsnagrQMPmHQs-9GDgdJWMQQ_QmhsA0Y3FurkuIp3iOGrDOw80-aX5bvxz7HVzw_hXsLLz8840f7TxuJQUH_mCR9vI1ZS7M6FAC5fmMB_SVIRSl8Qg5By79R5Tf", tags: ["Electronics", "Delivery"] },
      { name: "Kiran R", source: "Verified User • 1d ago", stars: 3, sentiment: "Neutral Sentiment", sentimentColor: "bg-amber-100 text-amber-700", text: "The app is fine but surge pricing hits really hard when it rains. A 40Rs delivery fee became 120Rs instantly.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWCZUH9rJeV5qtjAVMN1giNUh2fCtGTfxWqUilU2toC58TLvztka60-8Ijoa19EkI05YI5KDIKSc_ez34iXu4idQ2RuypoY12wGwBfmugD7-XxJxsPW58bz7QluW_laFrdffDwWbsU0beA5HkXxGIUXpuEyPKEEyO6oYiIP1EXavLWHd3RS0W4q490YY1xnc1_xVe5pFiSgoJbYOzKs2X1nsHqw-btLy2qOuI245BinumpJKzPM4XMSpZoOhHPOrd26QHcrnZdqyf", tags: ["Pricing", "Weather"] }
    ]
  }
};

export default function AppReviews() {
  const [activeTab, setActiveTab] = useState('zepto');
  const [activeSource, setActiveSource] = useState('All');
  const [liveReviews, setLiveReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const d = COMPETITORS.find(c => c.id === activeTab);
  const data = BASE_DATA[activeTab];

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/api/source/all-reviews`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      const all = json.reviews || [];
      setTotalCount(all.length);

      // Filter by competitor tab
      const competitorFiltered = all.filter(r =>
        r.competitor?.toLowerCase().includes(activeTab === 'zepto' ? 'zepto' :
          activeTab === 'swiggy' ? 'swiggy' : 'blinkit')
        || r.review_text?.toLowerCase().includes(activeTab === 'zepto' ? 'zepto' :
          activeTab === 'swiggy' ? 'swiggy' : 'blinkit')
      );

      // Filter by source tab
      const filterFn = SOURCE_MAP[activeSource] || (() => true);
      setLiveReviews(competitorFiltered.filter(filterFn));
    } catch (e) {
      setError('Could not load live reviews. Showing static data.');
      setLiveReviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeSource]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);


  return (
    <div className="pt-28 px-12 pb-12 flex-1 max-w-[1400px] mx-auto w-full">
      {/*  Page Header & Store Selector  */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Sentiment Intelligence</span>
          <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight">App Reviews Analysis</h1>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-surface-container-low p-1.5 rounded-2xl">
          {SOURCES.map(src => (
            <button key={src} onClick={() => setActiveSource(src)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeSource === src
                  ? 'bg-white text-primary shadow-sm'
                  : 'font-medium text-on-surface-variant hover:bg-white/50'
              }`}>
              {src}
            </button>
          ))}
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
          {/*  Abstract Line Chart Visualization  */}
          <div className="h-64 flex items-end gap-1 px-4 mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transition-all duration-700">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                {activeTab === 'swiggy' && <>
                  <path d="M0,80 Q100,20 200,50 T400,30 T600,70 T800,20 T1000,40" fill="none" stroke="#10b981" strokeWidth="3"></path>
                  <path d="M0,60 Q100,50 200,70 T400,60 T600,40 T800,80 T1000,50" fill="none" stroke="#C9A227" strokeWidth="2"></path>
                  <path d="M0,40 Q100,80 200,60 T400,90 T600,50 T800,70 T1000,60" fill="none" stroke="#ba1a1a" strokeWidth="2"></path>
                </>}
                {activeTab === 'zepto' && <>
                  <path d="M0,20 Q200,10 400,20 T800,40 T1000,10" fill="none" stroke="#10b981" strokeWidth="3"></path>
                  <path d="M0,70 Q200,60 400,50 T800,80 T1000,60" fill="none" stroke="#C9A227" strokeWidth="2"></path>
                  <path d="M0,90 Q200,95 400,90 T800,85 T1000,90" fill="none" stroke="#ba1a1a" strokeWidth="2"></path>
                </>}
                {activeTab === 'blinkit' && <>
                  <path d="M0,50 L200,60 L400,70 L600,60 L800,50 L1000,60" fill="none" stroke="#10b981" strokeWidth="3"></path>
                  <path d="M0,40 L200,40 L400,50 L600,40 L800,60 L1000,40" fill="none" stroke="#C9A227" strokeWidth="2"></path>
                  <path d="M0,70 L200,50 L400,30 L600,50 L800,70 L1000,50" fill="none" stroke="#ba1a1a" strokeWidth="2"></path>
                </>}
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
            {data.themes.map((theme, i) => (
              <div key={i} className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between group hover:translate-x-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-error-container/30 flex items-center justify-center rounded-xl text-error">
                    <span className="material-symbols-outlined">{theme.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{theme.title}</p>
                    <p className="text-xs text-on-surface-variant">{theme.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end gap-1 ${theme.trendColor} mb-1`}>
                    <span className="material-symbols-outlined text-sm">{theme.trend}</span>
                    <span className="text-xs font-bold">{theme.trendVal}</span>
                  </div>
                  <div className="w-24 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-error transition-all duration-1000" style={{ width: theme.progressWidth }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*  Strategic Summary  */}
        <div className="lg:col-span-4 bg-primary-container rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest block mb-4">Strategic Insight</span>
            <h4 className="font-headline font-bold text-2xl mb-4 leading-tight">{data.summaryHeading}</h4>
            <p className="text-on-primary-container text-sm leading-relaxed mb-6">{data.summaryBody}</p>
            <button className="w-full py-3 bg-tertiary-fixed text-on-tertiary-fixed font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
              Generate Full Report
            </button>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-tertiary-container/20 blur-[80px] rounded-full transition-colors duration-1000"></div>
        </div>
      </section>

      {/*  Review Feed Section — Live from backend  */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline font-extrabold text-2xl text-primary tracking-tight">Recent Review Intelligence</h3>
          <div className="flex gap-2 items-center">
            {loading && <span className="text-xs text-on-surface-variant/50 animate-pulse">Loading…</span>}
            {!loading && liveReviews.length > 0 && (
              <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mr-4">
                {liveReviews.length} live · {totalCount} total
              </span>
            )}
            <button onClick={fetchReviews} className="material-symbols-outlined text-primary hover:bg-surface-container-low p-1 rounded-lg transition-colors" title="Refresh">refresh</button>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            ⚠️ {error} — Backend might not be running.
          </div>
        )}

        {/* Live reviews from backend */}
        {liveReviews.length > 0 ? (
          <div className="space-y-6">
            {liveReviews.slice(0, 10).map((rev, i) => (
              <LiveReviewCard key={i} review={rev} />
            ))}
          </div>
        ) : !loading ? (
          /* Fallback to static data when no live data for this filter */
          <div>
            {error === null && liveReviews.length === 0 && (
              <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                No live data for this filter — showing static demo data.
              </div>
            )}
            <div className="space-y-6">
              {data.reviews.map((rev, i) => (
                <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img alt="User profile" className="w-12 h-12 rounded-full object-cover" src={rev.avatar} />
                      <div>
                        <h5 className="font-bold text-primary">{rev.name}</h5>
                        <p className="text-xs text-on-surface-variant/70">{rev.source}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-0.5 text-tertiary-container">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className="material-symbols-outlined text-lg" style={j < rev.stars ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                        ))}
                      </div>
                      <span className={`${rev.sentimentColor} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>{rev.sentiment}</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed mb-6 italic">"{rev.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Tags:</span>
                    {rev.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-low text-primary px-3 py-1 rounded-lg text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

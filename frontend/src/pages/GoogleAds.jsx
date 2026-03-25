import React, { useState } from 'react';

const COMPETITORS = [
  { id: 'zepto', name: 'Zepto', tagline: 'Quick commerce leader, 10-min delivery' },
  { id: 'swiggy', name: 'Swiggy', tagline: 'Food + Instamart dual-vertical powerhouse' },
  { id: 'blinkit', name: 'Blinkit', tagline: 'Zomato-backed rapid grocery expansion' },
];

const BASE_DATA = {
  zepto: {
    heroTitle: "Zepto Ad Intelligence",
    heroDesc: "Focusing aggressively on 10-minute delivery guarantees and fresh produce messaging across performance marketing channels.",
    chartTitle: "Spend Velocity",
    chartDesc: "Estimated media spend mapped against creative fatigue.",
    ads: [
      { id: 1, type: "Performance Max", shift: "New Creative", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGnEIRoWusAXJsYVrdF7bBvok6ydExCzlMul8exZZsHQJQS2TDE6xc-4lmDJO1edhbNSyVw0ZlTp0TD0nCUrKfu-Abud3JXq_I4vamVh3UyToXPFNjFSQrX9eH_jQMD4P1LEg0UmpMVcteQZ4zy4F6lQw6xyrXzBuYN61QbncHdKlQ0Tx-0Fl8QDVnN5JmTr_aRjW6VMltzFfhQqFuMVz9vbh_CZS0dN-KxLMUQNveNijxf7r9jgAAi4RUgO-u0RdmZei98ESU0w8f",
        platform: "Zepto • Instagram Reels", title: "Fresh Fruits, Zero Delivery Fee", 
        desc: "Aggressive push on organic fresh produce to contrast with competitors. Prominent 'Free Delivery' badge.", 
        date: "Oct 22, 2023", icon: "shopping_basket", color: "bg-purple-600" },
      { id: 2, type: "Search", shift: "Keyword Bump", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM__1BfKm_92WpCUnGmJTO_x2HZCgsePkbcjoszaKP4biwY2D1SXbFzaCH5CdsSeYewOaeEy146czNBvNHlYEhQamTmdRQEjzlMQ9g2qTzmEuvn1CzYGq4QkhlzFF83F33kjYIFf4-VN7jNumhPpZSFlMslGQf3wRytQixjuhNrRhYT3xdgUBjDB0ht2xfpHyAD8DeqDufNryQmTeg5d5fXRxic7fgZ6Vyh0meq8cqVO4XtjkA-DCvUt2w6gTBZOgI-pjwKtoTa7WS",
        platform: "Zepto • Google Search", title: "\"Late Night Cravings Delivered\"", 
        desc: "Bidding heavily on late-night food delivery keywords, expanding beyond traditional grocery scope.", 
        date: "Oct 20, 2023", icon: "dark_mode", color: "bg-[#09152e]" },
      { id: 3, type: "Display", shift: "Format Test", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBmeHRqbh9t1qeFeCyaneN1ztmhUCVEVNTiOgLSLCquGOJ7JfF4tOJw7ncCKW1qUrz56DPgcs91FTPyKbN99IkXBmIQyn_ReEr2M5K8p5YQFDyPa7LOl5fla6mf_xUH6Ea25NOq72FHdmV_-VQ18qNiFmVibJ4dK-pxQB-2z4DWn48pCKy7fvjuM_tY6PFttU2aU7bYu5JpmBQBxBp4xK4RtVhARlq_vdu0P3scIVshc28ve4lh7J7AWJz_W-Jm3joNQvdzBcJuTqK",
        platform: "Zepto • UAC", title: "App Install: Play Store Banner", 
        desc: "Standard app install creative offering flat ₹100 off on first 3 orders to drive new user acquisition.", 
        date: "Oct 15, 2023", icon: "get_app", color: "bg-tertiary" }
    ]
  },
  swiggy: {
    heroTitle: "Swiggy Omnichannel Feed",
    heroDesc: "Real-time monitoring of competitor creative strategies and algorithmic positioning across the digital ecosystem.",
    chartTitle: "Messaging Frequency",
    chartDesc: "Aggregated ad impressions vs. creative rotation",
    ads: [
      { id: 1, type: "Messaging Shift Detected", shift: "Shift", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBmeHRqbh9t1qeFeCyaneN1ztmhUCVEVNTiOgLSLCquGOJ7JfF4tOJw7ncCKW1qUrz56DPgcs91FTPyKbN99IkXBmIQyn_ReEr2M5K8p5YQFDyPa7LOl5fla6mf_xUH6Ea25NOq72FHdmV_-VQ18qNiFmVibJ4dK-pxQB-2z4DWn48pCKy7fvjuM_tY6PFttU2aU7bYu5JpmBQBxBp4xK4RtVhARlq_vdu0P3scIVshc28ve4lh7J7AWJz_W-Jm3joNQvdzBcJuTqK",
        platform: "Swiggy • YouTube Video", title: "The Ultimate Weekend Feast: Exclusive Member Discounts", 
        desc: "High-frequency creative targeting premium demographics. Heavy emphasis on 'Exclusive' lifestyle brand positioning.", 
        date: "Oct 18, 2023", icon: "restaurant", color: "bg-[#FC8019]" },
      { id: 2, type: "New Format", shift: "Creative", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM__1BfKm_92WpCUnGmJTO_x2HZCgsePkbcjoszaKP4biwY2D1SXbFzaCH5CdsSeYewOaeEy146czNBvNHlYEhQamTmdRQEjzlMQ9g2qTzmEuvn1CzYGq4QkhlzFF83F33kjYIFf4-VN7jNumhPpZSFlMslGQf3wRytQixjuhNrRhYT3xdgUBjDB0ht2xfpHyAD8DeqDufNryQmTeg5d5fXRxic7fgZ6Vyh0meq8cqVO4XtjkA-DCvUt2w6gTBZOgI-pjwKtoTa7WS",
        platform: "Instamart • Google Search", title: "Party Supplies Delivered in 10 Mins", 
        desc: "Targeting weekend search traffic for party supplies and rapid convenience items over staple groceries.", 
        date: "Oct 12, 2023", icon: "celebration", color: "bg-[#09152e]" },
      { id: 3, type: "Price Attack", shift: "Offer", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGnEIRoWusAXJsYVrdF7bBvok6ydExCzlMul8exZZsHQJQS2TDE6xc-4lmDJO1edhbNSyVw0ZlTp0TD0nCUrKfu-Abud3JXq_I4vamVh3UyToXPFNjFSQrX9eH_jQMD4P1LEg0UmpMVcteQZ4zy4F6lQw6xyrXzBuYN61QbncHdKlQ0Tx-0Fl8QDVnN5JmTr_aRjW6VMltzFfhQqFuMVz9vbh_CZS0dN-KxLMUQNveNijxf7r9jgAAi4RUgO-u0RdmZei98ESU0w8f",
        platform: "Swiggy One • Facebook Ads", title: "Unlimited Free Delivery + Extra Discounts", 
        desc: "Aggressive push on the unified loyalty program, attempting to lock in users across food and grocery segments.", 
        date: "Oct 05, 2023", icon: "card_membership", color: "bg-error" }
    ]
  },
  blinkit: {
    heroTitle: "Blinkit Creative Graph",
    heroDesc: "Tracking Blinkit's transition into diverse retail categories, shifting away from pure utility to impulse purchasing.",
    chartTitle: "Format Diversification",
    chartDesc: "Ratio of static banners vs video ad creatives in circulation.",
    ads: [
      { id: 1, type: "Messaging Shift Detected", shift: "Shift", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGnEIRoWusAXJsYVrdF7bBvok6ydExCzlMul8exZZsHQJQS2TDE6xc-4lmDJO1edhbNSyVw0ZlTp0TD0nCUrKfu-Abud3JXq_I4vamVh3UyToXPFNjFSQrX9eH_jQMD4P1LEg0UmpMVcteQZ4zy4F6lQw6xyrXzBuYN61QbncHdKlQ0Tx-0Fl8QDVnN5JmTr_aRjW6VMltzFfhQqFuMVz9vbh_CZS0dN-KxLMUQNveNijxf7r9jgAAi4RUgO-u0RdmZei98ESU0w8f",
        platform: "Blinkit • Display Network", title: "Freshness Guaranteed: Farm to Home in Minutes", 
        desc: "New visual language focused on organic sourcing. Abandoning generic stock imagery for high-resolution farm shots.", 
        date: "Oct 24, 2023", icon: "eco", color: "bg-[#00FF00]/40 text-black" },
      { id: 2, type: "Category Expansion", shift: "New Segment", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM__1BfKm_92WpCUnGmJTO_x2HZCgsePkbcjoszaKP4biwY2D1SXbFzaCH5CdsSeYewOaeEy146czNBvNHlYEhQamTmdRQEjzlMQ9g2qTzmEuvn1CzYGq4QkhlzFF83F33kjYIFf4-VN7jNumhPpZSFlMslGQf3wRytQixjuhNrRhYT3xdgUBjDB0ht2xfpHyAD8DeqDufNryQmTeg5d5fXRxic7fgZ6Vyh0meq8cqVO4XtjkA-DCvUt2w6gTBZOgI-pjwKtoTa7WS",
        platform: "Blinkit • Instagram Story", title: "Electronics delivered faster than you can blink", 
        desc: "Expanding basket size by heavily promoting small electronics (headphones, chargers) via visual-heavy social formats.", 
        date: "Oct 19, 2023", icon: "headset", color: "bg-amber-500" },
      { id: 3, type: "Viral Campaign", shift: "Social Push", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBmeHRqbh9t1qeFeCyaneN1ztmhUCVEVNTiOgLSLCquGOJ7JfF4tOJw7ncCKW1qUrz56DPgcs91FTPyKbN99IkXBmIQyn_ReEr2M5K8p5YQFDyPa7LOl5fla6mf_xUH6Ea25NOq72FHdmV_-VQ18qNiFmVibJ4dK-pxQB-2z4DWn48pCKy7fvjuM_tY6PFttU2aU7bYu5JpmBQBxBp4xK4RtVhARlq_vdu0P3scIVshc28ve4lh7J7AWJz_W-Jm3joNQvdzBcJuTqK",
        platform: "Blinkit • Twitter Integration", title: "Print Ad Spin-Off Meme Challenge", 
        desc: "Leveraging engagement from their offline billboard campaign into a digital UGC meme contest.", 
        date: "Oct 10, 2023", icon: "tag", color: "bg-blue-400" }
    ]
  }
};

export default function GoogleAds() {
  const [activeTab, setActiveTab] = useState('swiggy');
  const d = COMPETITORS.find(c => c.id === activeTab);
  const data = BASE_DATA[activeTab];

  return (
    <div className="p-12 max-w-[1400px] mx-auto w-full">
      {/*  Header & Filters  */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-headline font-extrabold tracking-tight text-primary mb-4 leading-tight">{data.heroTitle}</h1>
          <p className="text-lg text-primary/60 max-w-lg leading-relaxed">{data.heroDesc}</p>
        </div>
        <div className="flex gap-4 items-center self-start md:self-end">
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

      {/*  Messaging Trends Chart  */}
      <section className="mb-16">
        <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-[0_20px_40px_rgba(15,27,52,0.03)] border border-primary/5">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-headline font-extrabold text-primary mb-1">{data.chartTitle}</h3>
              <p className="text-sm text-primary/50 font-medium">{data.chartDesc}</p>
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
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {activeTab === 'swiggy' && <path className="opacity-100" d="M0 200 C 50 180, 100 220, 150 150 S 250 50, 300 120 S 400 180, 450 140 S 550 40, 600 80 S 700 160, 800 120 S 900 60, 1000 100 S 1100 180, 1200 140" fill="none" stroke="#09152e" strokeWidth="3"></path>}
              {activeTab === 'zepto' && <path className="opacity-100" d="M0 220 L 100 180 L 200 140 L 300 190 L 400 80 L 500 110 L 600 50 L 700 90 L 800 40" fill="none" stroke="#6b21a8" strokeWidth="3"></path>}
              {activeTab === 'blinkit' && <path className="opacity-100" d="M0 100 C 200 120, 400 60, 600 150 S 800 80, 1000 120" fill="none" stroke="#fbbf24" strokeWidth="3"></path>}
            </svg>
            <div className="absolute left-[25%] top-[15%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10 transition-all duration-500"></div>
            <div className="absolute left-[55%] top-[10%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10 transition-all duration-500"></div>
            <div className="absolute left-[85%] top-[25%] w-4 h-4 rounded-full bg-tertiary-fixed border-4 border-primary shadow-lg z-10 transition-all duration-500"></div>
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
          {data.ads.map(ad => (
            <article key={ad.id} className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(15,27,52,0.02)] border border-primary/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,27,52,0.08)]">
              {ad.type && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    <span className="text-[10px] font-black uppercase tracking-wider font-headline">{ad.type}</span>
                  </div>
                </div>
              )}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img alt="Ad Creative" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={ad.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-8 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-6 h-6 rounded-lg ${ad.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white text-[14px]">{ad.icon}</span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/40">{ad.platform}</span>
                </div>
                <h4 className="text-xl font-headline font-extrabold text-primary mb-4 leading-snug">"{ad.title}"</h4>
                <p className="text-sm text-primary/60 mb-6 font-medium line-clamp-2">{ad.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-1">Start Date</p>
                    <p className="text-xs font-bold text-primary">{ad.date}</p>
                  </div>
                  <button className="bg-surface-container-low text-primary px-5 py-2 rounded-xl text-xs font-extrabold font-headline hover:bg-primary hover:text-white transition-colors">
                    View Creative
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-30 flex justify-between items-center px-12 h-20 bg-white/80 backdrop-blur-xl border-b border-primary/5">
      <div className="flex items-center gap-8">
        <h1 className="font-headline font-black text-primary uppercase tracking-widest text-xl">KEYSER Intelligence</h1>
        <div className="h-6 w-[1px] bg-outline-variant/30"></div>
        <nav className="flex items-center gap-6">
          <a className="text-tertiary-container font-bold border-b-2 border-tertiary-container pb-1 text-sm" href="#!">Zepto</a>
          <a className="text-on-primary-fixed-variant/70 hover:text-primary transition-colors font-semibold text-sm" href="#!">Swiggy</a>
          <a className="text-on-primary-fixed-variant/70 hover:text-primary transition-colors font-semibold text-sm" href="#!">Blinkit</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg gap-2">
          <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">calendar_today</span>
          <select className="bg-transparent border-none focus:ring-0 text-xs font-bold text-primary p-0 pr-8">
            <option>7d</option>
            <option defaultValue="">30d</option>
            <option>90d</option>
            <option>All</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-primary/70">
            <span className="material-symbols-outlined">filter_alt</span>
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-primary/70">
            <span className="material-symbols-outlined">history</span>
          </button>
        </div>
        <button className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95">
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Data
        </button>
      </div>
    </header>
  );
}

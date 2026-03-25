import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

export default function Sidebar({ currentPage, onNavigate }) {
  const [chatOpen, setChatOpen] = useState(false);

  const activeClass = "flex items-center gap-3 px-4 py-3 bg-surface-container-low text-primary rounded-xl shadow-sm transition-all duration-300 font-medium text-sm";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 text-on-primary-fixed-variant/60 hover:bg-surface-container-low/50 transition-all duration-300 font-medium text-sm";

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen flex flex-col p-6 w-72 bg-white z-40 border-r border-primary/5">
        <div className="mb-10 px-2">
          <h2 className="font-headline text-primary font-extrabold text-xl tracking-tight">Intelligence</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-bold">Sovereign Framework</p>
        </div>

        <nav className="flex-1 space-y-1">
          <a className={currentPage === 'dashboard' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("dashboard"); }}>
            <span className="material-symbols-outlined">dashboard</span>Overview
          </a>
          <a className={currentPage === 'website_changes' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("website_changes"); }}>
            <span className="material-symbols-outlined">update</span>Website Changes
          </a>
          <a className={currentPage === 'google_ads' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("google_ads"); }}>
            <span className="material-symbols-outlined">ads_click</span>Google Ads
          </a>
          <a className={currentPage === 'app_reviews' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("app_reviews"); }}>
            <span className="material-symbols-outlined">rate_review</span>App Reviews
          </a>
          <a className={currentPage === 'hiring' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("hiring"); }}>
            <span className="material-symbols-outlined">person_search</span>Hiring Tracker
          </a>
          <a className={currentPage === 'whitespace' ? activeClass : inactiveClass} href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("whitespace"); }}>
            <span className="material-symbols-outlined">radar</span>Whitespace Radar
          </a>
        </nav>

        <div className="mt-auto space-y-6">
          {/* AI Co-Pilot button — toggles chat */}
          <button
            onClick={() => setChatOpen(o => !o)}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              chatOpen
                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              {chatOpen ? 'close' : 'auto_awesome'}
            </span>
            {chatOpen ? 'Close Co-Pilot' : 'AI Co-Pilot'}
          </button>

          <div className="space-y-1">
          <a
            className={`flex items-center gap-3 px-4 py-2 text-xs font-semibold transition-colors ${currentPage === 'settings' ? 'text-primary' : 'text-on-surface-variant/70 hover:text-primary'}`}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
          >
            <span className="material-symbols-outlined text-lg">settings</span>Settings
          </a>
          </div>
        </div>
      </aside>

      {/* Chat panel — floats next to sidebar */}
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

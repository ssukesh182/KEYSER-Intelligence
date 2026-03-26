import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5001';
const STAT_ICONS = ['update','ads_click','rate_review','verified','campaign','person_search'];
const STAT_LABELS = ['Website Changes','Google Ads','App Store Pulse','Trust Signals','Social Signals','Talent Acquisition'];
const COMPETITOR_COLORS = ['#6B21A8','#EA580C','#CA8A04','#0E7490','#B91C1C','#16803D','#1D4ED8'];

async function apiFetch(path, token) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function Dashboard({ timeWindow = '7d', sortBy = 'latest' }) {
  const { currentUser, profile } = useAuth();
  const [insights, setInsights] = useState([]);
  const [hiringStats, setHiringStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [error, setError] = useState(null);

  // Derive competitor list from authenticated user profile
  const competitors = profile?.competitors || [];

  const fetchData = useCallback(async () => {
    if (!currentUser || !competitors.length) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const [insRes, hirRes] = await Promise.all([
        apiFetch('/api/insights/', token),
        apiFetch('/api/hiring/stats', token),
      ]);
      setInsights(insRes.data || []);
      setHiringStats(hirRes.data || null);
      if (!activeTab && competitors.length > 0) setActiveTab(competitors[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, competitors.length]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const compColor = (name) => {
    const idx = competitors.indexOf(name);
    return COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length] || '#6B21A8';
  };

  // Filter insights for the active competitor tab
  const filteredInsights = activeTab
    ? insights.filter(i => i.competitor_name === activeTab || i.competitors?.includes(activeTab))
    : insights;

  const sortedInsights = [...filteredInsights].sort((a, b) =>
    sortBy === 'spend' ? (b.spend || 0) - (a.spend || 0) : new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  // Derive hiring counts for active competitor from hiringStats
  const hiringCount = hiringStats?.competitor_breakdown?.find(c => c.competitor === activeTab)?.count || 0;

  const stats = competitors.length > 0 ? [
    { icon: STAT_ICONS[0], label: STAT_LABELS[0], value: filteredInsights.filter(i => i.type === 'website').length || '—', suffix: 'Tracked signals' },
    { icon: STAT_ICONS[1], label: STAT_LABELS[1], value: filteredInsights.filter(i => i.source === 'ad').length || '—', suffix: 'Active campaigns' },
    { icon: STAT_ICONS[2], label: STAT_LABELS[2], value: filteredInsights.filter(i => i.source === 'review').length || '—', suffix: 'Review signals' },
    { icon: STAT_ICONS[3], label: STAT_LABELS[3], value: filteredInsights.filter(i => i.source === 'osint').length || '—', suffix: 'OSINT hits' },
    { icon: STAT_ICONS[4], label: STAT_LABELS[4], value: filteredInsights.filter(i => i.source === 'reddit').length || '—', suffix: 'Social mentions' },
    { icon: STAT_ICONS[5], label: STAT_LABELS[5], value: hiringCount || '—', suffix: 'Roles opened' },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!competitors.length) return (
    <section className="p-12 max-w-[1400px] mx-auto w-full flex items-center justify-center h-64">
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">sensors_off</span>
        <p className="text-on-surface-variant font-bold">No competitors tracked yet.</p>
        <p className="text-xs text-on-surface-variant/50 mt-1">Complete onboarding to start tracking intelligence.</p>
      </div>
    </section>
  );

  return (
    <section className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/* Heading */}
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Intelligence Overview</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Market Dominance Overview</h2>
          <p className="text-sm text-on-surface-variant/60 mt-2">Tracking: {competitors.join(' · ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Window</p>
          <p className="text-sm font-bold text-primary">{timeWindow.toUpperCase()} · Live</p>
        </div>
      </div>

      {/* Competitor tabs — dynamically from profile */}
      <div className="flex items-center gap-3 flex-wrap">
        {competitors.map((name, idx) => (
          <button key={name} onClick={() => setActiveTab(name)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === name ? 'bg-primary text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
            {name}
          </button>
        ))}
        {activeTab && <span className="ml-3 text-xs text-on-surface-variant/50 font-body">Showing intelligence for {activeTab}</span>}
      </div>

      {error && (
        <div className="bg-error-container/20 text-error px-4 py-3 rounded-xl text-sm font-bold">
          Could not load data: {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-primary/5 hover:shadow-[0_20px_40px_rgba(15,27,52,0.06)] transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-tertiary-fixed transition-colors">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-black text-primary">{s.value}</h3>
              <span className="text-xs font-bold text-on-surface-variant/40">{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Feed */}
      <div className="grid grid-cols-12 gap-8 pt-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl font-bold text-primary">Priority Insight Feed</h3>
            {activeTab && (
              <span className="text-xs text-on-surface-variant/50 bg-surface-container-low px-3 py-1 rounded-full font-bold">
                {sortedInsights.length} signals for {activeTab}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {sortedInsights.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-primary/5 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">hourglass_empty</span>
                <p className="text-on-surface-variant font-bold">Intelligence is being gathered…</p>
                <p className="text-xs text-on-surface-variant/50 mt-1">Background tasks are collecting signals for {activeTab}. Check back shortly.</p>
              </div>
            ) : sortedInsights.map((ins, i) => (
              <div key={i} className="group bg-white p-6 rounded-2xl border border-primary/5 flex gap-6 hover:translate-x-1 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg"
                  style={{ backgroundColor: compColor(ins.competitor_name || activeTab) }}>
                  {(ins.competitor_name || activeTab || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50">{ins.competitor_name || activeTab}</span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{ins.signal_type || ins.type || 'Signal'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/40">
                      {ins.created_at ? new Date(ins.created_at).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-2">{ins.title || ins.summary || 'Market Signal'}</h4>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed">{ins.body || ins.content || ins.snippet || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <h4 className="font-headline font-black text-xl mb-1">Intelligence Summary</h4>
              <div className="inline-block mb-4 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: activeTab ? compColor(activeTab) : '#6B21A8' }}>
                {activeTab || 'Overall'} · Live
              </div>
              <p className="text-sm text-on-primary-container leading-relaxed mb-4">
                {sortedInsights.length > 0
                  ? `${sortedInsights.length} intelligence signal${sortedInsights.length > 1 ? 's' : ''} collected for ${activeTab}.`
                  : `Background collection is running for ${activeTab}. Data will appear here shortly.`}
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Signals Collected', value: Math.min(sortedInsights.length * 4, 100) },
                  { label: 'Coverage Score', value: Math.min((hiringCount ? 60 : 20) + sortedInsights.length * 2, 100) },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-on-primary-container">{m.label}</span>
                      <span>{m.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div className="bg-tertiary-fixed h-full rounded-full transition-all duration-500" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl border border-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Co-Pilot Ready</h4>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Online
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-xs text-on-surface-variant leading-relaxed italic border border-primary/5">
              {activeTab
                ? `Ready to analyse ${activeTab}'s latest moves. Ask me anything about their strategy, pricing, or hiring trends.`
                : 'Select a competitor to get started with Co-Pilot analysis.'}
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Compare competitor pricing</button>
              <button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-primary/5 text-[10px] font-bold text-primary hover:border-tertiary-container transition-colors">Draft response memo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

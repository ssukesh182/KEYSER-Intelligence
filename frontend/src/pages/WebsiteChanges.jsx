import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5001';
const COMPETITOR_COLORS = ['#6B21A8','#EA580C','#CA8A04','#0E7490','#B91C1C','#16803D'];

async function apiFetch(path, token) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function EmptyState({ competitor }) {
  return (
    <div className="bg-white p-12 rounded-3xl border border-primary/5 text-center">
      <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">web</span>
      <p className="font-bold text-on-surface-variant text-lg">No website changes detected yet</p>
      <p className="text-sm text-on-surface-variant/50 mt-2">
        {competitor
          ? `Background scraper is monitoring ${competitor}'s website. Changes will appear here once detected.`
          : 'Select a competitor to view website change tracking.'}
      </p>
    </div>
  );
}

function ChangeCard({ diff }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-primary/5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-tertiary-container mb-1 block">{diff.competitor_name}</span>
          <h4 className="font-bold text-primary text-xl">{diff.title || 'Website Change Detected'}</h4>
        </div>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          {diff.change_type || 'Update'}
        </span>
      </div>
      {diff.summary && (
        <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-6">{diff.summary}</p>
      )}
      {diff.diff_text && (
        <div className="bg-surface-container-low rounded-xl p-4 font-mono text-xs text-on-surface-variant overflow-auto max-h-48">
          <pre className="whitespace-pre-wrap">{diff.diff_text.slice(0, 600)}</pre>
        </div>
      )}
      <p className="text-[10px] text-on-surface-variant/40 mt-4 font-bold uppercase tracking-widest">
        {diff.scraped_at ? new Date(diff.scraped_at).toLocaleString() : 'Recently detected'}
      </p>
    </div>
  );
}

export default function WebsiteChanges() {
  const { currentUser, profile } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [diffs, setDiffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const competitors = profile?.competitors || [];

  const fetchDiffs = useCallback(async () => {
    if (!currentUser || !competitors.length) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const data = await apiFetch('/api/diffs/', token);
      setDiffs(data.data || data || []);
      if (!activeTab && competitors.length > 0) setActiveTab(competitors[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, competitors.length]);

  useEffect(() => { fetchDiffs(); }, [fetchDiffs]);

  const filtered = activeTab
    ? diffs.filter(d => d.competitor_name?.toLowerCase() === activeTab.toLowerCase())
    : diffs;

  const compColor = (name) => {
    const idx = competitors.indexOf(name);
    return COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length];
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!competitors.length) return (
    <section className="p-12 max-w-[1400px] mx-auto w-full">
      <EmptyState competitor={null} />
    </section>
  );

  return (
    <section className="p-12 max-w-[1400px] mx-auto w-full space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Change Detection</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Website Intelligence</h2>
          <p className="text-sm text-on-surface-variant/60 mt-2">Tracking: {competitors.join(' · ')}</p>
        </div>
        <button onClick={fetchDiffs}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-low text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all">
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
      </div>

      {/* Competitor tabs — from profile */}
      <div className="flex items-center gap-3 flex-wrap">
        {competitors.map((name) => (
          <button key={name} onClick={() => setActiveTab(name)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === name ? 'text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}
            style={activeTab === name ? { backgroundColor: compColor(name) } : {}}>
            {name}
          </button>
        ))}
        <span className="ml-2 text-xs text-on-surface-variant/50 font-bold">
          {filtered.length} change{filtered.length !== 1 ? 's' : ''} detected
        </span>
      </div>

      {error && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          ⚠️ {error} — Make sure the backend is running.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Total Changes', value: filtered.length, icon: 'web', color: 'text-primary' },
          { label: 'Competitors Tracked', value: competitors.length, icon: 'group', color: 'text-tertiary-container' },
          { label: 'Latest Update', value: filtered.length > 0 ? 'Recent' : 'Awaiting', icon: 'schedule', color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-primary/5 flex items-center gap-4">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-headline font-black text-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Change feed */}
      <div>
        <h3 className="font-headline text-2xl font-bold text-primary mb-6">
          Detected Changes
          {activeTab && <span className="ml-2 text-base font-medium text-on-surface-variant/50">— {activeTab}</span>}
        </h3>
        {filtered.length > 0 ? (
          <div className="space-y-6">
            {filtered.map((d, i) => <ChangeCard key={i} diff={d} />)}
          </div>
        ) : (
          <EmptyState competitor={activeTab} />
        )}
      </div>
    </section>
  );
}

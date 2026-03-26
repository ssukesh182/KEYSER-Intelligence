import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5001';
const SOURCES = ['All', 'Reddit', 'Google', 'Trustpilot'];
const SOURCE_MAP = {
  'Reddit': r => r.source === 'reddit',
  'Google': r => r.source === 'serp_google',
  'Trustpilot': r => r.source === 'trustpilot',
};

function sentimentColor(rating) {
  if (rating >= 4) return 'bg-emerald-50 text-emerald-700';
  if (rating >= 3) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}
function sentimentLabel(rating) {
  if (rating >= 4) return 'Positive';
  if (rating >= 3) return 'Neutral';
  return 'Negative';
}

function LiveReviewCard({ review }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg">
            {(review.reviewer || review.competitor || '?')[0].toUpperCase()}
          </div>
          <div>
            <h5 className="font-bold text-primary">{review.reviewer || 'Anonymous'}</h5>
            <p className="text-xs text-on-surface-variant/70 capitalize">{review.source} · {review.competitor}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-0.5 text-tertiary-container">
            {[...Array(5)].map((_, j) => (
              <span key={j} className="material-symbols-outlined text-lg"
                style={j < (review.rating || 3) ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
            ))}
          </div>
          <span className={`${sentimentColor(review.rating || 3)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
            {sentimentLabel(review.rating || 3)}
          </span>
        </div>
      </div>
      <p className="text-on-surface-variant leading-relaxed italic">"{review.review_text?.slice(0, 400) || ''}"</p>
      {review.review_time && (
        <p className="text-[10px] text-on-surface-variant/40 mt-3 font-bold uppercase tracking-widest">
          {review.review_time}
        </p>
      )}
    </div>
  );
}

export default function AppReviews() {
  const { currentUser, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('');
  const [activeSource, setActiveSource] = useState('All');
  const [liveReviews, setLiveReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive competitor list from authenticated user profile
  const competitors = profile?.competitors || [];

  const fetchReviews = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const resp = await fetch(`${API_BASE}/api/source/all-reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      const all = json.reviews || [];
      setAllReviews(all);

      if (!activeTab && competitors.length > 0) setActiveTab(competitors[0]);
    } catch (e) {
      setError('Could not load live reviews. Make sure the backend is running.');
      setLiveReviews([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, competitors.length]);

  // Filter whenever tab or source changes
  useEffect(() => {
    let filtered = allReviews;
    if (activeTab) filtered = filtered.filter(r => r.competitor?.toLowerCase() === activeTab.toLowerCase());
    const filterFn = SOURCE_MAP[activeSource];
    if (filterFn) filtered = filtered.filter(filterFn);
    setLiveReviews(filtered);
  }, [allReviews, activeTab, activeSource]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // Compute simple sentiment summary
  const positiveCount = liveReviews.filter(r => (r.rating || 3) >= 4).length;
  const negativeCount = liveReviews.filter(r => (r.rating || 3) < 3).length;
  const avgRating = liveReviews.length > 0
    ? (liveReviews.reduce((s, r) => s + (r.rating || 3), 0) / liveReviews.length).toFixed(1)
    : '—';

  return (
    <div className="pt-8 px-12 pb-12 flex-1 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Sentiment Intelligence</span>
          <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight">App Reviews Analysis</h1>
          {competitors.length > 0 && (
            <p className="text-sm text-on-surface-variant/60 mt-1">Tracking: {competitors.join(' · ')}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 bg-surface-container-low p-1.5 rounded-2xl">
          {SOURCES.map(src => (
            <button key={src} onClick={() => setActiveSource(src)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeSource === src ? 'bg-white text-primary shadow-sm' : 'font-medium text-on-surface-variant hover:bg-white/50'
              }`}>{src}</button>
          ))}
        </div>
      </section>

      {/* Competitor tabs — dynamically from profile */}
      {competitors.length > 0 ? (
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {competitors.map((name) => (
            <button key={name} onClick={() => setActiveTab(name)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === name ? 'bg-primary text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
              {name}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-10 p-6 bg-surface-container-low rounded-2xl text-center">
          <p className="text-on-surface-variant font-bold text-sm">No competitors tracked. Complete onboarding to start tracking reviews.</p>
        </div>
      )}

      {/* Sentiment Summary Stats */}
      <section className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Avg Rating', value: avgRating, icon: 'star', color: 'text-tertiary-container' },
          { label: 'Positive Reviews', value: positiveCount, icon: 'sentiment_satisfied', color: 'text-emerald-600' },
          { label: 'Negative Reviews', value: negativeCount, icon: 'sentiment_dissatisfied', color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-primary/5 flex items-center gap-4">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-wider">{s.label}</p>
              <h3 className="text-3xl font-headline font-black text-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Review Feed */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline font-extrabold text-2xl text-primary tracking-tight">
            Review Intelligence Feed
            {activeTab && <span className="ml-2 text-base font-medium text-on-surface-variant/50">— {activeTab}</span>}
          </h3>
          <div className="flex gap-2 items-center">
            {loading && <span className="text-xs text-on-surface-variant/50 animate-pulse">Loading…</span>}
            {!loading && liveReviews.length > 0 && (
              <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mr-4">
                {liveReviews.length} reviews
              </span>
            )}
            <button onClick={fetchReviews} className="material-symbols-outlined text-primary hover:bg-surface-container-low p-1 rounded-lg transition-colors" title="Refresh">refresh</button>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {error}</div>
        )}

        {liveReviews.length > 0 ? (
          <div className="space-y-6">
            {liveReviews.slice(0, 15).map((rev, i) => (
              <LiveReviewCard key={i} review={rev} />
            ))}
          </div>
        ) : !loading ? (
          <div className="bg-white p-12 rounded-3xl border border-primary/5 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">rate_review</span>
            <p className="font-bold text-on-surface-variant text-lg">No reviews collected yet</p>
            <p className="text-sm text-on-surface-variant/50 mt-2">
              {activeTab
                ? `Background tasks are gathering reviews for ${activeTab}. Check back shortly, or try a different source filter.`
                : 'Select a competitor tab above to see their reviews.'}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

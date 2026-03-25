import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5001';

// ... constants and helpers ...

export default function AppReviews() {
  const { currentUser, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('');
  const [activeSource, setActiveSource] = useState('All');
  const [liveReviews, setLiveReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const trackedCompetitors = profile?.tracked_competitors || [];
  const currentComp = trackedCompetitors.find(c => c.name.toLowerCase() === activeTab.toLowerCase()) || trackedCompetitors[0];

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
      setTotalCount(all.length);

      // Filter by activeTab if set
      let filtered = all;
      if (activeTab) {
        filtered = all.filter(r => 
          r.competitor?.toLowerCase() === activeTab.toLowerCase()
        );
      }

      // Filter by source tab
      const filterFn = SOURCE_MAP[activeSource] || (() => true);
      setLiveReviews(filtered.filter(filterFn));
      
      if (!activeTab && trackedCompetitors.length > 0) {
        setActiveTab(trackedCompetitors[0].name);
      }
    } catch (e) {
      setError('Could not load live reviews.');
      setLiveReviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeSource, currentUser, trackedCompetitors]);

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
        {trackedCompetitors.map((c) => (
          <button key={c.name} onClick={() => setActiveTab(c.name)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === c.name ? 'bg-primary text-white shadow-md scale-105' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
            {c.name}
          </button>
        ))}
        <span className="ml-3 text-xs text-on-surface-variant/50 font-body">{currentComp?.tagline || 'Tracked Competitor'}</span>
      </div>

      {/*  Sentiment Timeline (Main Chart)  */}
      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-primary/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="font-headline font-bold text-xl text-primary">Sentiment Timeline</h3>
              <p className="text-sm text-on-surface-variant">Aggregate sentiment trends for {activeTab}</p>
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

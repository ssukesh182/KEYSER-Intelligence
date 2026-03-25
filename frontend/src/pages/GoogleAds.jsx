import React, { useState, useEffect, useRef } from 'react';
import { fetchSerpAds } from '../services/serpAdsService';
import { useAuth } from '../context/AuthContext';

const HighlightDiff = ({ oldText, newText }) => {
  if (!oldText || oldText === newText) return <span>{newText}</span>;
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);
  return (
    <>
      {newWords.map((word, i) => {
        const isChanged = i >= oldWords.length || oldWords[i] !== word;
        return isChanged ? (
          <span key={i} className="bg-tertiary-container/30 text-primary font-bold px-1 rounded mx-0.5">
            {word}
          </span>
        ) : (
          <span key={i} className="mx-0.5">{word}</span>
        );
      })}
    </>
  );
};

export default function GoogleAds() {
  const { currentUser, profile } = useAuth();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetchHistory, setFetchHistory] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState("All Competitors");
  
  const previousSnapshotsRef = useRef({});
  const [selectedAd, setSelectedAd] = useState(null);

  const loadAds = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(false);
    try {
      const token = await currentUser.getIdToken();
      const results = await fetchSerpAds(token);
      
      let filtered = results;
      if (selectedCompetitor !== "All Competitors") {
        filtered = results.filter(ad => ad.competitor === selectedCompetitor);
      }
      
      setAds(filtered);
      setFetchHistory(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), count: filtered.length }];
        return newHistory.slice(-5);
      });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, [selectedCompetitor, currentUser]);

  const openComparisonModal = (ad) => {
    setSelectedAd(ad);
  };

  const trackedCompetitors = profile?.tracked_competitors || [];

  return (
    <div className="p-12 max-w-[1400px] mx-auto w-full relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-headline font-extrabold tracking-tight text-primary mb-4 leading-tight">
            Ad Intelligence <span className="text-tertiary-container">Sovereign Feed</span>
          </h1>
          <p className="text-lg text-primary/60 max-w-lg leading-relaxed">
            Real-time monitoring of {profile?.company_name || 'your'}'s competitor creative strategies and positioning.
          </p>
        </div>
        <div className="flex gap-4 items-center self-start md:self-end">
          <div className="relative">
            <select 
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
              className="appearance-none bg-surface-container-low border-0 rounded-xl px-6 py-3 pr-12 font-headline font-bold text-sm text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option>All Competitors</option>
              {trackedCompetitors.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">expand_more</span>
          </div>
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

      {/* Messaging Trends Chart */}
      <section className="mb-16">
        <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-[0_20px_40px_rgba(15,27,52,0.03)] border border-primary/5">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-headline font-extrabold text-primary mb-1">Messaging Frequency</h3>
              <p className="text-sm text-primary/50 font-medium">Aggregated ads detected per SERP query run</p>
            </div>
            <button onClick={() => loadAds(selectedCompetitor)} className="bg-surface-container-low text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/5 transition flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">refresh</span> Refresh Now
            </button>
          </div>
          <div className="h-[240px] w-full flex items-end gap-1 relative overflow-hidden group border-b border-primary/10">
            {fetchHistory.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-primary/40 font-bold">Awaiting data...</div>
            ) : (
              <div className="absolute inset-0 flex items-end justify-around pb-12 px-8">
                {fetchHistory.map((pt, i) => {
                  const heightPercent = Math.min((pt.count / 30) * 100, 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 relative group w-16">
                      <div className="w-full bg-primary/10 rounded-t-sm transition-all duration-500 relative" style={{ height: `${heightPercent}%` }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-tertiary-fixed border-2 border-primary shadow-lg z-10"></div>
                      </div>
                      <span className="text-[10px] absolute -bottom-8 font-bold uppercase tracking-widest text-primary/40 whitespace-nowrap">{pt.time}</span>
                      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 text-xs font-bold bg-primary text-white px-2 py-1 rounded">{pt.count} Ads</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-headline font-extrabold text-primary">Active Intelligence Feed</h3>
          {isLoading && <span className="text-sm font-bold text-primary/60 animate-pulse">Fetching Real-time SERP...</span>}
        </div>

        {error ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">signal_disconnected</span>
            <p className="text-lg font-bold text-primary/50">No ads detected — retrying...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <article 
                key={ad.id} 
                onClick={() => openComparisonModal(ad)}
                className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(15,27,52,0.02)] border border-primary/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,27,52,0.08)] cursor-pointer"
              >
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    <span className="text-[10px] font-black uppercase tracking-wider font-headline">{ad.badge}</span>
                  </div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img alt="Ad Creative" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={ad.thumbnail} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[14px]">public</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/50">{ad.competitor} • {ad.channel}</span>
                  </div>
                  <h4 className="text-lg font-headline font-extrabold text-primary mb-3 leading-snug line-clamp-2">{ad.headline}</h4>
                  <p className="text-sm text-primary/70 font-medium line-clamp-3 mb-4">{ad.summary}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Target Keyword</p>
                      <p className="text-xs font-bold text-primary/80 truncate w-32">{ad.keyword}</p>
                    </div>
                    <span className="text-xs font-extrabold text-tertiary-container group-hover:underline">Compare Changes</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Comparison Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm p-4" onClick={() => setSelectedAd(null)}>
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-primary/40 hover:text-primary" onClick={() => setSelectedAd(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="bg-tertiary-fixed/20 text-tertiary-container px-3 py-1 rounded inline-flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest border border-tertiary-container/30">
               <span className="material-symbols-outlined text-[16px]">history</span>
               Messaging Shift Detected
            </div>
            <h2 className="text-2xl font-headline font-black text-primary mb-2 whitespace-pre-wrap">{selectedAd.competitor}</h2>
            <p className="text-sm text-primary/50 font-bold uppercase tracking-widest mb-8">{selectedAd.headline}</p>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-surface-container-low/50 border border-primary/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 block">Previous Snapshot</span>
                <p className="text-sm font-medium text-primary/60 italic">
                  {previousSnapshotsRef.current[selectedAd.competitor] 
                    ? previousSnapshotsRef.current[selectedAd.competitor].summary 
                    : "Fetching initial baseline... (No prior snapshot found in current session)"}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Current Live Query</span>
                <p className="text-sm font-bold text-primary leading-relaxed">
                  <HighlightDiff 
                    oldText={previousSnapshotsRef.current[selectedAd.competitor]?.summary} 
                    newText={selectedAd.summary} 
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const DIMENSIONS = ['speed', 'range', 'price', 'experience', 'support', 'sustainability'];
const DIM_LABELS  = {
  speed:          'Speed',
  range:          'Range',
  price:          'Price',
  experience:     'Experience',
  support:        'Support',
  sustainability: 'Eco',
};

// Radar geometry: 6 axes, evenly spread
const CX = 250, CY = 250, R_MAX = 190;
const ANGLES = DIMENSIONS.map((_, i) => (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2);

function radarPoint(score, axisIndex) {
  const r = (score / 100) * R_MAX;
  return {
    x: CX + r * Math.cos(ANGLES[axisIndex]),
    y: CY + r * Math.sin(ANGLES[axisIndex]),
  };
}

function buildPolygon(scores) {
  return DIMENSIONS.map((dim, i) => {
    const { x, y } = radarPoint(scores[dim] ?? 5, i);
    return `${x},${y}`;
  }).join(' ');
}

function axisEnd(i) {
  return {
    x: CX + R_MAX * Math.cos(ANGLES[i]),
    y: CY + R_MAX * Math.sin(ANGLES[i]),
  };
}

const TAG_COLORS = {
  'SPEED WHITESPACE': 'bg-blue-100 text-blue-700',
  'CATEGORY GAP':     'bg-purple-100 text-purple-700',
  'VALUE SIGNAL':     'bg-green-100 text-green-700',
  'UX OPPORTUNITY':   'bg-indigo-100 text-indigo-700',
  'CRITICAL RISK':    'bg-red-100 text-red-700',
  'EMERGENT TREND':   'bg-amber-100 text-amber-700',
};

const BORDER_COLORS = {
  'SPEED WHITESPACE': 'border-blue-400',
  'CATEGORY GAP':     'border-purple-400',
  'VALUE SIGNAL':     'border-green-400',
  'UX OPPORTUNITY':   'border-indigo-400',
  'CRITICAL RISK':    'border-red-400',
  'EMERGENT TREND':   'border-amber-400',
};

export default function WhitespaceRadar() {
  const { currentUser, profile } = useAuth();
  const [activeTab,   setActiveTab]   = useState('');
  const [scores,      setScores]      = useState({});
  const [angles,      setAngles]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('http://localhost:5001/api/whitespace/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setScores(json.data.scores || {});
        setAngles(json.data.angles || []);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Pick first competitor as active if none selected
        if (!activeTab && json.data.scores) {
          const first = Object.keys(json.data.scores)[0];
          if (first) setActiveTab(first);
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const competitors = profile?.competitors || [];
  const activeComp = competitors.find(c => c === activeTab) || competitors[0];
  const activeScores = scores[activeTab] || (activeComp ? { speed: 50, range: 50, price: 50, experience: 50, support: 50, sustainability: 50 } : {});
  const polyPoints = activeComp ? buildPolygon(activeScores) : "";

  // Whitespace zones: lowest-scored dimension for the active competitor
  const lowestDim  = DIMENSIONS.reduce((a, b) => (activeScores[a] ?? 100) < (activeScores[b] ?? 100) ? a : b);
  const lowestIdx  = DIMENSIONS.indexOf(lowestDim);
  const wsEnd      = axisEnd(lowestIdx);

  return (
    <div className="p-12 flex gap-10 w-full max-w-[1600px] mx-auto">
      {/* ── Center Radar Column ── */}
      <section className="flex-1 min-w-0">
        <div className="mb-8">
          <span className="bg-tertiary-fixed/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Live Market Intel
          </span>
          <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight leading-tight mt-2">
            Whitespace Radar
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Quantitative opportunity scores from hiring signals, snapshots &amp; Reddit demand.
          </p>
        </div>

        {/* Competitor tabs */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {competitors.length > 0 ? competitors.map((c) => (
            <button key={c} onClick={() => setActiveTab(c)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                ${activeTab === c ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
              {c}
            </button>
          )) : (
            <span className="text-sm text-on-surface-variant font-bold">No competitors tracked. Complete onboarding.</span>
          )}
          {loading && <span className="text-xs text-primary/50 animate-pulse ml-2">Fetching live data…</span>}
          {lastUpdated && !loading && (
            <span className="text-[10px] text-on-surface-variant/50 ml-2">Updated {lastUpdated}</span>
          )}
          <button onClick={fetchData} className="ml-auto flex items-center gap-1 text-[11px] font-bold text-primary/60 hover:text-primary transition bg-surface-container-low px-3 py-1.5 rounded-lg">
            <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            ⚠ Live data unavailable ({error}) — showing seed intelligence.
          </div>
        )}

        {/* Radar SVG */}
        <div className="relative w-full aspect-square max-w-3xl mx-auto flex items-center justify-center p-10 bg-white rounded-3xl shadow-sm border border-outline-variant/10">
          <svg className="w-full h-full overflow-visible transition-all duration-700" viewBox="0 0 500 500">
            {/* Concentric rings at 25/50/75/100% */}
            {[0.25, 0.5, 0.75, 1.0].map((r, i) => (
              <circle key={i} cx={CX} cy={CY} r={R_MAX * r}
                fill="none" stroke="#f2f3ff" strokeWidth={i === 3 ? 1.5 : 1} />
            ))}

            {/* Axis lines */}
            {DIMENSIONS.map((_, i) => {
              const end = axisEnd(i);
              return <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="#e8eaf2" strokeWidth="1" />;
            })}

            {/* Whitespace highlight (lowest dim) */}
            <line x1={CX} y1={CY} x2={wsEnd.x} y2={wsEnd.y}
              stroke="#C9A227" strokeWidth="2.5" strokeDasharray="5,3" />
            <circle cx={wsEnd.x} cy={wsEnd.y} r="6" fill="#ffe08e" stroke="#C9A227" strokeWidth="2" />

            {/* Competitor polygon */}
            <polygon
              fill={activeComp.color + '33'}
              stroke={activeComp.color}
              strokeWidth="2"
              points={polyPoints}
              className="transition-all duration-700"
            />
            {/* Dot nodes */}
            {DIMENSIONS.map((dim, i) => {
              const { x, y } = radarPoint(activeScores[dim] ?? 5, i);
              return <circle key={i} cx={x} cy={y} r="4" fill={activeComp.color} className="transition-all duration-700" />;
            })}
          </svg>

          {/* Axis Labels */}
          {DIMENSIONS.map((dim, i) => {
            const end    = axisEnd(i);
            const labelR = R_MAX + 22;
            const lx     = CX + labelR * Math.cos(ANGLES[i]);
            const ly     = CY + labelR * Math.sin(ANGLES[i]);
            const isWS   = dim === lowestDim;
            return (
              <div key={dim}
                className={`absolute text-[10px] font-black uppercase tracking-widest translate-x-[-50%] translate-y-[-50%] ${isWS ? 'text-amber-600' : 'text-primary'}`}
                style={{ left: `${(lx / 500) * 100}%`, top: `${(ly / 500) * 100}%` }}>
                {DIM_LABELS[dim]}
                {isWS && <span className="block text-center text-[8px] text-amber-400">⚡ Gap</span>}
              </div>
            );
          })}

          {/* Score legend for active competitor */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow border border-outline-variant/10 space-y-1.5 min-w-[130px]">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-2">Scores</h4>
            {DIMENSIONS.map(dim => (
              <div key={dim} className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-medium text-primary/60 capitalize">{DIM_LABELS[dim]}</span>
                <span className="text-[10px] font-black text-primary">{activeScores[dim] ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Right Angle Cards ── */}
      <section className="w-[400px] flex flex-col pt-[90px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
          <h3 className="font-headline font-bold text-xl text-primary">AI Opportunities</h3>
          <span className="material-symbols-outlined text-primary/30">auto_awesome</span>
        </div>

        <div className="space-y-5 flex-1 overflow-y-auto pr-1">
          {angles.map((angle, i) => (
            <div key={i}
              className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${BORDER_COLORS[angle.tag] || 'border-primary'} transition-transform duration-300 hover:-translate-y-1`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${TAG_COLORS[angle.tag] || 'bg-primary/5 text-primary'}`}>
                  {angle.tag}
                </span>
                <div className="text-right">
                  <div className="text-[9px] font-black uppercase text-primary/40 tracking-wider">Opportunity</div>
                  <div className="text-xl font-black text-primary leading-none">{angle.opportunity_score}<span className="text-xs">%</span></div>
                </div>
              </div>
              <h4 className="font-headline font-bold text-primary text-sm mb-2">{angle.title}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{angle.description}</p>
              {angle.market_context && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                  <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest block mb-0.5">Tavily Market Signal</span>
                  <p className="text-[10px] text-amber-800 leading-relaxed">{angle.market_context}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                <span className="text-[9px] font-black uppercase text-primary/40 tracking-widest">Impact</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(j => (
                    <div key={j} className={`h-1.5 w-5 rounded-full ${j <= angle.impact ? 'bg-primary' : 'bg-outline-variant/30'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={fetchData}
          className="mt-6 group flex items-center justify-center gap-3 w-full py-4 border-2 border-primary/10 rounded-2xl text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 text-sm"
        >
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : 'transition-transform group-hover:translate-x-1'}`}>
            {loading ? 'refresh' : 'arrow_forward'}
          </span>
          {loading ? 'Analysing…' : 'Refresh Intelligence'}
        </button>
      </section>
    </div>
  );
}

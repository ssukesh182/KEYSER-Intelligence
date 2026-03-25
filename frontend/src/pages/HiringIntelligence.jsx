import React, { useEffect, useState, useCallback } from 'react';

async function apiFetch(path) {
  const res = await fetch(path);   // relative URL — Vite proxy forwards to :5001
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const DEPT_COLORS = {
  Engineering:  '#4F63D2',
  Product:      '#C9A227',
  Operations:   '#2CA87F',
  Marketing:    '#E97B3B',
  Design:       '#A259FF',
  Finance:      '#3AB5E5',
  People:       '#E95B8A',
  Sales:        '#7AC943',
  Legal:        '#6B7280',
  Strategy:     '#9CA3AF',
};
const SOURCE_LABELS = { linkedin: 'LinkedIn', apollo: 'Apollo.io', arbeitnow: 'ArbeitNow', seed: 'Seeded' };
const SOURCE_COLORS = { linkedin: '#0A66C2', apollo: '#B44DED', arbeitnow: '#F97316', seed: '#6B7280' };

export default function HiringIntelligence() {
  const [signals,  setSignals]  = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [dept,     setDept]     = useState('');
  const [page,     setPage]     = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const PAGE_SIZE = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: 500 });
      if (dept) params.set('department', dept);

      const [sigRes, statRes] = await Promise.all([
        apiFetch(`/api/hiring?${params}`),
        apiFetch('/api/hiring/stats'),
      ]);
      setSignals(sigRes.data || []);
      setStats(statRes.data || null);
      setPage(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dept]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/hiring/refresh', { method: 'POST' });
      setTimeout(fetchData, 1500); // small delay so task can write to DB
    } finally {
      setRefreshing(false);
    }
  };

  // ── Derived chart data ─────────────────────────────────────────────────────
  const weekly    = stats?.weekly_counts    || [];
  const deptDist  = stats?.dept_distribution || [];
  const maxWeek   = Math.max(...weekly.map(w => w.count), 1);

  const topDepts  = deptDist.slice(0, 4);
  const topDept   = topDepts[0]?.department || 'ENG';

  // Donut for top 3 depts (SVG circles, r=80, circumference≈502)
  const CIRC = 502;
  let donutOffset = 0;
  const donutSlices = topDepts.slice(0, 3).map((d) => {
    const arc = (d.pct / 100) * CIRC;
    const slice = { dept: d.department, arc, offset: donutOffset, color: DEPT_COLORS[d.department] || '#9CA3AF' };
    donutOffset += arc;
    return slice;
  });

  // Paged signals
  const pagedSignals = signals.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages   = Math.ceil(signals.length / PAGE_SIZE);

  // Unique departments for filter
  const deptOptions = [...new Set(signals.map(s => s.dept).filter(Boolean))].sort();

  return (
    <div className="p-12 max-w-[1400px] mx-auto w-full space-y-12">
      {/* Page Header */}
      <section className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-container mb-2 block">Talent Ecosystem</span>
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">Hiring Intelligence</h1>
          <p className="text-lg text-on-surface-variant font-medium max-w-lg leading-relaxed mt-4">
            Monitor competitor headcount growth, departmental scaling, and strategic role acquisitions.
          </p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          {/* Department filter */}
          <div className="relative">
            <select
              className="appearance-none bg-surface-container-low border-0 rounded-xl px-6 py-3 pr-12 font-headline font-bold text-sm text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              value={dept}
              onChange={e => setDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {deptOptions.map(d => <option key={d}>{d}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">expand_more</span>
          </div>
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
            {refreshing ? 'Refreshing…' : 'Refresh Signals'}
          </button>
        </div>
      </section>

      {error && (
        <div className="bg-error/10 text-error rounded-xl px-6 py-4 text-sm font-medium">
          ⚠ Failed to load data: {error}
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-10">

        {/* Hiring Activity Timeline — Bar Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-primary">Hiring Activity Timeline</h3>
              <p className="text-sm text-on-surface-variant">Weekly job posting volume across competitors</p>
            </div>
            <div className="flex gap-2 items-center">
              {stats && (
                <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {stats.total} total signals
                </span>
              )}
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {loading ? (
              Array.from({length: 8}).map((_, i) => (
                <div key={i} className="flex-1 bg-surface-container-low animate-pulse rounded-t-lg" style={{height: `${30 + Math.random()*70}%`}} />
              ))
            ) : weekly.length === 0 ? (
              <p className="text-on-surface-variant opacity-50 m-auto">No timeline data</p>
            ) : weekly.map((w, i) => {
              const heightPct = maxWeek > 0 ? (w.count / maxWeek) * 100 : 0;
              const opacity   = 0.2 + (heightPct / 100) * 0.8;
              return (
                <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t-lg bg-primary transition-all duration-300 hover:bg-primary/80 cursor-help"
                    style={{ height: `${Math.max(heightPct, 4)}%`, opacity }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {w.count} jobs
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-60">
            {weekly.filter((_, i) => i === 0 || i === 2 || i === 4 || i === 7).map((w, i) => (
              <span key={i}>{w.week}</span>
            ))}
          </div>
        </div>

        {/* Talent Allocation Donut */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-primary mb-1">Talent Allocation</h3>
          <p className="text-sm text-on-surface-variant mb-8">Role distribution by department</p>
          <div className="relative flex justify-center items-center mb-8">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 192 192">
              <circle cx="96" cy="96" fill="none" r="80" stroke="#f2f3ff" strokeWidth="24" />
              {loading ? (
                <circle cx="96" cy="96" fill="none" r="80" stroke="#C9A227" strokeDasharray="200 502" strokeWidth="24" className="animate-pulse" />
              ) : donutSlices.map((s, i) => (
                <circle
                  key={i}
                  cx="96" cy="96" fill="none" r="80"
                  stroke={s.color}
                  strokeDasharray={`${s.arc} ${CIRC - s.arc}`}
                  strokeDashoffset={-s.offset}
                  strokeWidth="24"
                  className="transition-all duration-700"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm uppercase font-bold opacity-40">Top</span>
              <span className="text-2xl font-black text-tertiary-container">{topDept?.slice(0, 3).toUpperCase() || '—'}</span>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-surface-container-low animate-pulse rounded w-32" />
                  <div className="h-4 bg-surface-container-low animate-pulse rounded w-10" />
                </div>
              ))
            ) : topDepts.map(d => (
              <div key={d.department} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{background: DEPT_COLORS[d.department] || '#9CA3AF'}} />
                  <span className="text-sm font-medium">{d.department}</span>
                </div>
                <span className="text-sm font-bold">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source breakdown pills */}
      {stats?.competitor_breakdown && (
        <div className="flex flex-wrap gap-3">
          {stats.competitor_breakdown.map(cb => (
            <div key={cb.competitor} className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-xl shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                {cb.competitor?.charAt(0)}
              </div>
              <span className="text-sm font-bold">{cb.competitor}</span>
              <span className="text-xs text-on-surface-variant font-medium">{cb.count} roles</span>
            </div>
          ))}
        </div>
      )}

      {/* Live Talent Influx Table */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-primary">Live Talent Influx</h3>
          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors"
              onClick={() => {
                const csv = ['Competitor,Role,Department,Location,Source,Posted']
                  .concat(signals.map(s => `${s.competitor},${s.role},${s.dept},${s.location},${s.source},${s.posted}`))
                  .join('\n');
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv])); a.download = 'hiring_signals.csv'; a.click();
              }}
            >
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Competitor', 'Role Title', 'Department', 'Location', 'Source', 'Posted'].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] uppercase tracking-[0.15em] font-black text-on-surface-variant opacity-60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-10 text-center opacity-50">Fetching talent signals…</td></tr>
              ) : pagedSignals.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-10 text-center opacity-50">No signals found{dept ? ` for "${dept}"` : ''}.</td></tr>
              ) : pagedSignals.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">
                        {item.competitor?.charAt(0)}
                      </div>
                      <span className="font-bold text-sm">{item.competitor}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-medium text-sm max-w-[220px] truncate">{item.role}</td>
                  <td className="px-8 py-5">
                    <span
                      className="px-3 py-1 text-white text-[10px] font-bold uppercase rounded-full tracking-wider"
                      style={{ background: DEPT_COLORS[item.dept] || '#9CA3AF' }}
                    >
                      {item.dept || 'Other'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">{item.location || 'Multiple Locations'}</td>
                  <td className="px-8 py-5">
                    <span
                      className="px-2.5 py-1 text-[10px] font-bold rounded-full"
                      style={{ background: `${SOURCE_COLORS[item.source] || '#6B7280'}20`, color: SOURCE_COLORS[item.source] || '#6B7280' }}
                    >
                      {SOURCE_LABELS[item.source] || item.source}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{item.posted || 'Recently'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-surface-container-low/20 flex items-center justify-between">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Showing {pagedSignals.length} of {signals.length} signals
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 bg-white rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

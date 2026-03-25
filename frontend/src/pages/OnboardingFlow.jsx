import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5001';

export default function OnboardingFlow() {
  const { currentUser, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    category: 'SaaS',
    tagline: '',
    target_audience: '',
    usp: '',
    initial_competitors: [] // {name, url}
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [marketGap, setMarketGap] = useState('');
  const [tempComp, setTempComp] = useState({ name: '', url: '' });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSeedCompetitor = () => {
    if (tempComp.name) {
      setFormData(prev => ({
        ...prev,
        initial_competitors: [...prev.initial_competitors, tempComp]
      }));
      setTempComp({ name: '', url: '' });
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setStep(4);
    try {
      const token = await currentUser.getIdToken();
      const resp = await fetch(`${API_BASE}/api/users/onboarding/suggest`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await resp.json();
      setAiSuggestions(data.suggestions || []);
      setMarketGap(data.market_gap || '');
    } catch (e) {
      console.error("Discovery failed", e);
    } finally {
      setLoading(false);
    }
  };

  const finalizeOnboarding = async (finalComps) => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const payload = {
        ...formData,
        tracked_competitors: [...formData.initial_competitors, ...finalComps]
      };
      const resp = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        await refreshProfile();
      }
    } catch (e) {
      console.error("Finalization failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white p-12 relative z-10 transition-all">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-surface-container-low'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4 block">Step 1: Identity</span>
            <h2 className="text-4xl font-extrabold text-primary mb-8 tracking-tight">Tell us about your company.</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Company Name</label>
                <input name="company_name" value={formData.company_name} onChange={handleInputChange} className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all" placeholder="e.g. Zepto" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Website URL</label>
                <input name="website_url" value={formData.website_url} onChange={handleInputChange} className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all" placeholder="https://zeptonow.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Industry Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all">
                  <option>Quick Commerce</option>
                  <option>Fintech</option>
                  <option>EdTech</option>
                  <option>SaaS</option>
                  <option>E-commerce</option>
                </select>
              </div>
              <button onClick={nextStep} disabled={!formData.company_name} className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 mt-4">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4 block">Step 2: Positioning</span>
            <h2 className="text-4xl font-extrabold text-primary mb-8 tracking-tight">Define your strategy.</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Tagline</label>
                <input name="tagline" value={formData.tagline} onChange={handleInputChange} className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all" placeholder="10-minute grocery delivery" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Target Audience</label>
                <input name="target_audience" value={formData.target_audience} onChange={handleInputChange} className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all" placeholder="Urban millennials, busy households" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Core USP (Unique Selling Prop)</label>
                <textarea name="usp" value={formData.usp} onChange={handleInputChange} rows="3" className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20 transition-all" placeholder="Proprietary dark store optimization engine for <10m delivery..." />
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 bg-surface-container text-primary rounded-2xl font-bold">Back</button>
                <button onClick={nextStep} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all">Continue</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4 block">Step 3: Seeding</span>
            <h2 className="text-4xl font-extrabold text-primary mb-8 tracking-tight">Known competitors?</h2>
            <p className="text-on-surface-variant mb-8 text-sm">Add 1-2 competitors you already watch. We'll find others for you next.</p>
            <div className="space-y-6">
              <div className="flex gap-3">
                <input value={tempComp.name} onChange={(e) => setTempComp({...tempComp, name: e.target.value})} className="flex-1 bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20" placeholder="Name" />
                <input value={tempComp.url} onChange={(e) => setTempComp({...tempComp, url: e.target.value})} className="flex-1 bg-surface-container-lowest border-none rounded-2xl p-4 text-primary font-medium focus:ring-2 ring-primary/20" placeholder="Website" />
                <button onClick={addSeedCompetitor} className="p-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl"><span className="material-symbols-outlined">add</span></button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.initial_competitors.map((c, i) => (
                  <div key={i} className="px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10 flex items-center gap-2">
                    {c.name}
                    <button onClick={() => setFormData(f => ({...f, initial_competitors: f.initial_competitors.filter((_, idx) => idx !== i)}))} className="material-symbols-outlined text-[14px]">close</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={prevStep} className="flex-1 py-4 bg-surface-container text-primary rounded-2xl font-bold text-lg">Back</button>
                <button onClick={fetchSuggestions} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3">
                  Find More via AI
                  <span className="material-symbols-outlined">radar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4 block">Step 4: Discovery</span>
            <h2 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">AI Discovery Radar</h2>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-primary/5 rounded-full animate-pulse flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-125">public</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Searching the web...</p>
                <p className="text-xs text-on-surface-variant text-center px-12">Analyzing {formData.company_name}'s links to find your closest rivals.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {marketGap && (
                   <div className="p-4 bg-tertiary-fixed/30 border border-tertiary/20 rounded-2xl mb-6">
                     <p className="text-[10px] font-bold text-tertiary uppercase mb-2 tracking-widest">Initial Market Gap</p>
                     <p className="text-sm text-on-tertiary-fixed font-medium leading-relaxed italic">"{marketGap}"</p>
                   </div>
                )}
                
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-4 tracking-widest">Suggested Competitors to Track</p>
                <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className="p-4 bg-surface-container-lowest rounded-2xl border border-primary/5 flex items-center justify-between group">
                      <div className="flex-1">
                        <p className="font-bold text-primary">{s.name}</p>
                        <p className="text-[10px] text-on-surface-variant line-clamp-1">{s.reason}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setAiSuggestions(prev => prev.filter((_, idx) => idx !== i))} className="text-on-surface-variant/40 hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 py-4 bg-surface-container text-primary rounded-2xl font-bold">Back</button>
                  <button onClick={() => finalizeOnboarding(aiSuggestions)} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all">Finalize Dashboard</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

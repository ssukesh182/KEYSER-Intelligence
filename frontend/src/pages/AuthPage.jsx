import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';

export default function AuthPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured yet. Create a .env file — see instructions below.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      console.error(err);
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">

      {/* Background decorative orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-tertiary-fixed/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-surface-container-high/80 rounded-full blur-3xl pointer-events-none" />

      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10">
        <span className="text-xl font-black text-primary uppercase tracking-widest font-headline">
          KEYSER Intelligence
        </span>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="font-body text-[10px] uppercase tracking-[0.1em] font-bold text-primary">SNUC Hacks '26</span>
          <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
        </div>
      </nav>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-[0_40px_80px_rgba(9,21,46,0.10)] border border-surface-container p-10 flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest mb-8">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            Sovereign Access Control
          </div>

          {/* Logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg">
            <span className="material-symbols-outlined text-white text-3xl">radar</span>
          </div>

          <h1 className="text-3xl font-extrabold text-primary font-headline tracking-tight mb-2 text-center">
            Welcome back.
          </h1>
          <p className="text-on-surface-variant font-body text-sm text-center mb-8 max-w-xs leading-relaxed">
            Sign in to access your competitive intelligence dashboard and real-time market signals.
          </p>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="text-xs text-on-surface-variant/60 font-body uppercase tracking-widest">Continue with</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline-variant/40 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(9,21,46,0.08)] active:scale-[0.98] transition-all duration-200 rounded-2xl px-6 py-4 font-bold text-primary font-body text-sm disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="material-symbols-outlined text-primary animate-spin text-xl">progress_activity</span>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm font-body">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Trust signals */}
          <div className="mt-8 pt-6 border-t border-surface-container w-full grid grid-cols-3 gap-4 text-center">
            {[
              { icon: 'lock', label: 'Encrypted' },
              { icon: 'verified', label: 'Google SSO' },
              { icon: 'shield', label: 'Zero-Trust' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary/40 text-xl">{icon}</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-bold font-body">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-on-surface-variant/40 font-body mt-6 uppercase tracking-widest">
          © 2026 KEYSER Intelligence · Sovereign Framework
        </p>
      </div>
    </div>
  );
}

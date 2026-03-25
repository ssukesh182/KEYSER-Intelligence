import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Settings({ onLogout }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    } finally {
      onLogout();
    }
  };

  return (
    <section className="p-12 max-w-[900px] mx-auto w-full space-y-10">
      {/* Heading */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-tertiary-container mb-2 block">Account</span>
        <h2 className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tight">Settings</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-primary px-8 py-6 flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          {/* Avatar */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-2xl ring-4 ring-white/20 object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 ring-4 ring-white/20">
              <span className="material-symbols-outlined text-white text-4xl">person</span>
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Google Verified
            </div>
            <h3 className="text-white font-headline font-extrabold text-2xl leading-tight">
              {user?.displayName || 'Anonymous User'}
            </h3>
            <p className="text-on-primary-container text-sm mt-0.5">{user?.email || 'No email'}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="divide-y divide-outline-variant/20">
          {[
            { icon: 'person', label: 'Full Name', value: user?.displayName || '—' },
            { icon: 'mail', label: 'Email Address', value: user?.email || '—' },
            { icon: 'login', label: 'Sign-in Method', value: 'Google OAuth 2.0' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-8 py-5">
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary/60 text-xl">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-primary">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden">
        <div className="px-8 py-5 border-b border-outline-variant/20">
          <h4 className="font-headline font-bold text-primary">Session</h4>
          <p className="text-xs text-on-surface-variant/60 mt-0.5">Manage your active session and sign out.</p>
        </div>
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-primary">Sign out of KEYSER Intelligence</p>
            <p className="text-xs text-on-surface-variant/60 mt-0.5">You'll be redirected to the login page.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import OnboardingFlow from './pages/OnboardingFlow';
import Dashboard from './pages/Dashboard';
import GoogleAds from './pages/GoogleAds';
import AppReviews from './pages/AppReviews';
import HiringIntelligence from './pages/HiringIntelligence';
import WhitespaceRadar from './pages/WhitespaceRadar';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function AppContent() {
  const { currentUser, profile, loading, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [timeWindow, setTimeWindow] = useState('7d');
  const [sortBy, setSortBy] = useState('latest');

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-sm font-bold text-primary tracking-widest uppercase">Initializing Intelligence...</span>
      </div>
    );
  }

  // Guest View
  if (!currentUser) {
    return <LandingPage onEnter={login} onNavigate={(p) => p === 'auth' ? login() : null} />;
  }

  // Onboarding View
  if (!profile?.profile_complete) {
    return <OnboardingFlow />;
  }

  // Authenticated Dashboard View
  const renderInnerPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard timeWindow={timeWindow} sortBy={sortBy} />;
      case 'google_ads': return <GoogleAds />;
      case 'app_reviews': return <AppReviews />;
      case 'hiring': return <HiringIntelligence />;
      case 'whitespace': return <WhitespaceRadar />;
      case 'settings': return <Settings onLogout={logout} />;
      default: return <Dashboard timeWindow={timeWindow} sortBy={sortBy} />;
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-72 flex-1 flex flex-col min-h-screen">
        <Header timeWindow={timeWindow} onTimeChange={setTimeWindow} sortBy={sortBy} onSortChange={setSortBy} />
        <main className="flex-1 flex flex-col">
          {renderInnerPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WebsiteChanges from './pages/WebsiteChanges';
import GoogleAds from './pages/GoogleAds';
import AppReviews from './pages/AppReviews';
import HiringIntelligence from './pages/HiringIntelligence';
import WhitespaceRadar from './pages/WhitespaceRadar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('auth');

  // Auth page — no sidebar/header
  if (currentPage === 'auth') {
    return (
      <div className="bg-background font-body text-on-surface flex flex-col min-h-screen">
        <AuthPage onLogin={() => setCurrentPage('dashboard')} />
      </div>
    );
  }

  // Landing/marketing page — no sidebar
  if (currentPage === 'landing') {
    return (
      <div className="bg-background font-body text-on-surface flex flex-col min-h-screen selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        <LandingPage onEnter={() => setCurrentPage('dashboard')} onNavigate={setCurrentPage} />
      </div>
    );
  }

  // Otherwise, render the requested page inside the global Layout wrapper
  const renderInnerPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'website_changes': return <WebsiteChanges />;
      case 'google_ads': return <GoogleAds />;
      case 'app_reviews': return <AppReviews />;
      case 'hiring': return <HiringIntelligence />;
      case 'whitespace': return <WhitespaceRadar />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-72 flex-1 flex flex-col min-h-screen">
        <Header />
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {renderInnerPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

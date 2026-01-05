
import React, { useState, useEffect } from 'react';
import { User, Role } from './types.ts';
import { dbService } from './services/dbService.ts';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Auth from './components/Auth.tsx';
import LandingPage from './components/LandingPage.tsx';
import Donate from './components/Donate.tsx';
import AdminPanel from './components/AdminPanel.tsx';

type View = 'home' | 'donate' | 'admin' | 'auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dbService.seedAdmin();
    // Check session
    const saved = localStorage.getItem('welfare_session');
    if (saved && saved !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error("Session parse error:", e);
        localStorage.removeItem('welfare_session');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('welfare_session', JSON.stringify(user));
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('welfare_session');
    setCurrentView('home');
  };

  const handleNavigate = (view: View) => {
    if ((view === 'donate' || view === 'admin') && !currentUser) {
      setCurrentView('auth');
    } else {
      setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  const onDonationSuccess = () => {
    setSuccessMsg("Thank you! Your donation has been recorded successfully.");
    setCurrentView('home');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main className="flex-grow">
        {successMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce">
            {successMsg}
          </div>
        )}

        {currentView === 'home' && (
          <LandingPage onDonateClick={() => handleNavigate('donate')} />
        )}

        {currentView === 'auth' && (
          <div className="max-w-md mx-auto py-20 px-4">
            <Auth onLogin={handleLogin} />
          </div>
        )}

        {currentView === 'donate' && currentUser && (
          <Donate user={currentUser} onSuccess={onDonationSuccess} />
        )}

        {currentView === 'admin' && currentUser?.role === Role.ADMIN && (
          <AdminPanel />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;

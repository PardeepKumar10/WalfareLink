
import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import { dbService } from './services/dbService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Donate from './components/Donate';
import AdminPanel from './components/AdminPanel';

type View = 'home' | 'donate' | 'admin' | 'auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dbService.seedAdmin();
    // Check session
    const saved = localStorage.getItem('welfare_session');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
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


import React from 'react';
import { User, Role } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'donate' | 'admin') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
            <span className="text-xl font-bold text-emerald-800 tracking-tight">WelfareLink</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button 
                  onClick={() => onNavigate('home')}
                  className={`px-3 py-2 text-sm font-medium ${currentView === 'home' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => onNavigate('donate')}
                  className={`px-3 py-2 text-sm font-medium ${currentView === 'donate' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                >
                  Donate Now
                </button>
                {user.role === Role.ADMIN && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className={`px-3 py-2 text-sm font-medium ${currentView === 'admin' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
                  >
                    Admin Panel
                  </button>
                )}
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{user.fullName}</span>
                  <button 
                    onClick={onLogout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <span className="text-sm text-slate-500 italic">Welcome Guest</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

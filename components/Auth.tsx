
import React, { useState } from 'react';
import { User, Role, Occupation } from '../types';
import { dbService } from '../services/dbService';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    cnic: '',
    occupation: Occupation.STUDENT
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-formatting for CNIC (xxxxx-xxxxxxx-x)
    if (name === 'cnic') {
      let val = value.replace(/\D/g, '');
      if (val.length > 5 && val.length <= 12) {
        val = val.slice(0, 5) + '-' + val.slice(5);
      } else if (val.length > 12) {
        val = val.slice(0, 5) + '-' + val.slice(5, 12) + '-' + val.slice(12, 13);
      }
      setFormData({ ...formData, [name]: val });
    } 
    // Auto-formatting for Phone (03xx-xxxxxxx)
    else if (name === 'phone') {
      let val = value.replace(/\D/g, '');
      if (val.length > 4) {
        val = val.slice(0, 4) + '-' + val.slice(4, 11);
      }
      setFormData({ ...formData, [name]: val });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    const phoneRegex = /^03\d{2}-\d{7}$/;

    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters long.';
    
    if (!isLogin) {
      if (!formData.fullName.trim()) return 'Full Name is required.';
      if (!cnicRegex.test(formData.cnic)) return 'CNIC must be in xxxxx-xxxxxxx-x format.';
      if (formData.phone && !phoneRegex.test(formData.phone)) return 'Phone must be in 03xx-xxxxxxx format.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const users = dbService.getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === formData.email);
      // In a real app, we would verify password hash here
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or account does not exist.');
      }
    } else {
      if (users.find(u => u.email === formData.email)) {
        setError('User with this email already exists.');
        return;
      }
      if (users.find(u => u.cnic === formData.cnic)) {
        setError('User with this CNIC already exists.');
        return;
      }

      const newUser: User = {
        id: `u-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        occupation: formData.occupation,
        role: Role.DONOR
      };

      dbService.saveUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500">
      <div className="bg-emerald-700 py-8 text-center text-white px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <h2 className="text-3xl font-black mb-1 relative z-10">{isLogin ? 'Welcome Back' : 'Donor Registration'}</h2>
        <p className="text-emerald-100 text-sm italic relative z-10">
          {isLogin ? 'Sign in to manage your donations' : 'Register to start your humanitarian journey'}
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                placeholder="Ex: Muhammad Ahmed"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CNIC Number</label>
                  <input 
                    name="cnic" 
                    value={formData.cnic} 
                    onChange={handleChange}
                    placeholder="xxxxx-xxxxxxx-x"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Phone Number</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="03xx-xxxxxxx"
                    maxLength={12}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Occupation</label>
                <select 
                  name="occupation" 
                  value={formData.occupation} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value={Occupation.JOB}>Job Holder</option>
                  <option value={Occupation.BUSINESS}>Business Owner</option>
                  <option value={Occupation.STUDENT}>Student</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2 animate-pulse">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] mt-6"
          >
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? "Don't have a donor account yet?" : "Already a registered donor?"}{' '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
            >
              {isLogin ? 'Create One' : 'Log In Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

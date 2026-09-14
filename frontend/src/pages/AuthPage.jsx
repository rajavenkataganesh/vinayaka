import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthPage = ({ isOpen, onClose }) => {
  const { login, register, loginAsDemoAdmin, loginAsDemoDevotee } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      onClose();
      navigate('/admin');
    } catch (err) {
      setError('Demo admin login error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDevotee = async () => {
    setLoading(true);
    try {
      await loginAsDemoDevotee();
      onClose();
    } catch (err) {
      setError('Demo devotee login error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-orange-100 relative space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
            🐘
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-900">
            {mode === 'login' ? 'Devotee Sign In' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-500">
            Sign in to submit new Ganesh idols, submit reviews, and report updates.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
          <button
            onClick={() => setMode('login')}
            className={`w-full py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`w-full py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devotee@ganeshmap.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Quick Demo Login Triggers for Reviewers */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick One-Click Demo Access
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoAdmin}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-1 border border-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Demo Admin
            </button>

            <button
              onClick={handleDemoDevotee}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-extrabold flex items-center justify-center gap-1 border border-orange-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-orange-600" />
              Demo Devotee
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;

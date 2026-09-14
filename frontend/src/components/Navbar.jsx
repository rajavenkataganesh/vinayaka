import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, PlusCircle, Compass, ShieldCheck, User, LogOut, Sparkles, Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAddModal, onOpenAuthModal, userLocation, onRequestLocation }) => {
  const { user, isAdmin, logout, loginAsDemoAdmin, loginAsDemoDevotee } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🐘</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
                GANESHMAP
              </span>
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-amber-700 -mt-1">
                Find Idols Near You
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/map') ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Map
            </Link>

            <Link
              to="/eco-guide"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/eco-guide') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
              Eco Guide
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'bg-amber-100 text-amber-800 font-bold' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions Right */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Location Button */}
            <button
              onClick={onRequestLocation}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                userLocation
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {userLocation ? 'GPS Active 📍' : 'Find Near Me'}
            </button>

            {/* Add Idol Button */}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Ganesh Idol
            </button>

            {/* Auth / Admin Switcher */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="block text-[10px] font-semibold text-orange-600 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => loginAsDemoAdmin().then(() => navigate('/admin'))}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center gap-1"
                  title="Quick login as Admin to test verification panel"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Demo Admin
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Login / Register"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="p-2 rounded-lg bg-orange-500 text-white font-bold text-xs"
            >
              + Add
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-orange-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50"
          >
            Home
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50"
          >
            Explore Map
          </Link>
          <Link
            to="/eco-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            Eco Guide
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { onRequestLocation(); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200"
            >
              📍 Detect Current Location
            </button>

            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { loginAsDemoAdmin().then(() => { navigate('/admin'); setMobileMenuOpen(false); }); }}
                  className="py-2 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300"
                >
                  ⚡ Demo Admin
                </button>
                <button
                  onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                  className="py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold"
              >
                Logout ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

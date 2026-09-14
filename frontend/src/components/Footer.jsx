import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Shield, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-lg font-bold">
                🐘
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                GANESHMAP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find, explore, and celebrate verified Ganesh idols and festival pandals near you with AI-assisted verification.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Promoting Clay Idols & Eco Immersion</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white mb-3 uppercase tracking-wider text-orange-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-orange-400 transition-colors">Interactive Map</Link>
              </li>
              <li>
                <Link to="/eco-guide" className="hover:text-orange-400 transition-colors">Eco-Friendly Guide</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-400 transition-colors">Admin Verification</Link>
              </li>
            </ul>
          </div>

          {/* Featured Areas */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white mb-3 uppercase tracking-wider text-orange-400">
              Popular Cities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> Vijayawada</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> Mangalagiri</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> Guntur</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> Amaravati</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> Hyderabad</li>
            </ul>
          </div>

          {/* Verification Protocol Notice */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white mb-3 uppercase tracking-wider text-amber-400">
              Verification Standards
            </h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Authority Protocol</span>
              </div>
              <p className="text-slate-400">
                All community submissions pass through AI vision analysis and require final human admin approval before public listing on map.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GaneshMap. Built for festival community celebration.</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 border border-slate-700">
              DEMO & PRODUCTION READY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

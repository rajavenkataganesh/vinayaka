import React from 'react';
import { Leaf, Droplets, Recycle, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EcoGuideSection = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/40 relative overflow-hidden">
      
      {/* Background Subtle Pattern */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Eco-Friendly Celebration
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Celebrate Vinayaka Chaturthi Sustainably
              </h3>
            </div>
          </div>

          <Link
            to="/eco-guide"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0 text-center"
          >
            Full Eco Guide →
          </Link>
        </div>

        {/* 4 Informational Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-700/30 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              🧱 Clay Idols (Mitti Ke Ganesh)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clay idols dissolve completely in water without emitting toxic chemicals, preserving local lakes and rivers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-700/30 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              🎨 Natural Organic Colors
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use natural dyes made from turmeric (haldi), kumkum, multani mitti, and indigo instead of chemical paints.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-700/30 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <Droplets className="w-4 h-4" /> Eco Immersion (Visarjan)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immerse small clay idols at home in a clean bucket. Use the clay enriched water for garden plants.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-700/30 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <Recycle className="w-4 h-4" /> Flower Waste Segregation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Collect marigold flowers and organic garlands separately for organic composting rather than dumping plastic trash into water bodies.
            </p>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-800/40 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Verification Transparency:</strong> Eco-friendly badges are verified based on organizer declarations and material inspectability.
          </span>
        </div>

      </div>
    </div>
  );
};

export default EcoGuideSection;

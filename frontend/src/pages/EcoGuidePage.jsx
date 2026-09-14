import React from 'react';
import { Leaf, Droplets, Recycle, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EcoGuidePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Green Vinayaka Initiative 2026</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Eco-Friendly Ganesh Festival Guide
        </h1>

        <p className="max-w-2xl mx-auto text-sm text-slate-600 leading-relaxed">
          Learn how to celebrate Vinayaka Chaturthi in harmony with Mother Nature using clay idols, natural pigments, seed Ganeshas, and zero-waste water immersion practices.
        </p>
      </div>

      {/* Guide Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            🧱
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">
            1. Pure Clay (Mitti) Idols
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Plaster of Paris (PoP) idols contain heavy metal chemical paints (lead, mercury, cadmium) that take decades to decompose in water bodies. Pure unbaked clay dissolves in water within 2 hours without polluting natural rivers or suffocating aquatic life.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 pt-2 font-medium">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Choose natural unpainted shadu clay</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Plant seed idols infused with holy basil (tulsi)</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            🎨
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">
            2. Natural Organic Colors
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ensure your idol is painted with natural organic ingredients:
          </p>
          <ul className="text-xs text-slate-700 space-y-1 pt-2 font-medium">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600" /> <strong>Turmeric (Haldi):</strong> Vibrant saffron yellow</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600" /> <strong>Kumkum & Raktachandan:</strong> Deep vermilion red</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600" /> <strong>Multani Mitti:</strong> Natural clay tones</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">
            3. Artificial Tank & Home Visarjan
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Avoid immersing idols directly into natural rivers or lakes. Utilize local municipality designated artificial tanks or conduct bucket immersion at home.
          </p>
          <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            🌱 Home Immersion Tip: Place your clay idol in a large water bucket in your balcony garden. Water your potted plants with the sacred dissolved clay!
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Recycle className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">
            4. Nirmalya Flower Recycling
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nirmalya refers to sacred floral offerings (marigold, lotus, durva grass). Never throw flowers inside plastic bags into water bodies. Segregate nirmalya into designated municipality collection bins for organic fertilizer composting.
          </p>
        </div>

      </div>

      {/* Verification Standard Banner */}
      <div className="p-6 rounded-3xl bg-emerald-900 text-white space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>GaneshMap Eco Verification Policy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          GaneshMap labels idols with 🟢 <strong>Eco-Friendly</strong> status based on organizer declarations and material inspectability. We keep our guidance objective and educational to support environmental stewardship without making unsubstantiated claims.
        </p>
      </div>

    </div>
  );
};

export default EcoGuidePage;

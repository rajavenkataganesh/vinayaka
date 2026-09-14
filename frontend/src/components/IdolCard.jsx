import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, Clock, Leaf, Eye, ShieldCheck } from 'lucide-react';
import CrowdBadge from './CrowdBadge';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../services/geo';

export const IdolCard = ({ idol }) => {
  const isEco = idol.eco_status === 'Eco-Friendly';

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={idol.image_url || 'https://images.unsplash.com/photo-1567591377030-de198b9d5186?auto=format&fit=crop&w=800&q=80'}
          alt={idol.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <CrowdBadge status={idol.crowd_status} />
          
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-1 ${
            isEco
              ? 'bg-emerald-500/90 text-white border-emerald-400'
              : 'bg-amber-500/90 text-white border-amber-400'
          }`}>
            <Leaf className="w-3 h-3" />
            {idol.eco_status || 'Eco-Friendly'}
          </span>
        </div>

        {/* Distance Badge */}
        {idol.distance_meters !== undefined && idol.distance_meters !== null && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-orange-800 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-orange-200">
            📍 {formatDistance(idol.distance_meters)}
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span>{idol.avg_rating || 4.8}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {idol.area}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          </div>

          <h3 className="font-heading font-bold text-base text-slate-900 mt-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
            <span className="text-amber-600 font-extrabold">🕉️</span>
            <span>{idol.name}</span>
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>{idol.address}</span>
          </p>

          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Timings: {idol.opening_time || '06:00 AM'} – {idol.closing_time || '10:30 PM'}</span>
          </p>

          {/* Activity Badges on Idol Cards */}
          {(idol.has_prasadam || idol.has_annadanam || idol.has_uregimpu) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {idol.has_prasadam && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                  🙏 Prasadam
                </span>
              )}
              {idol.has_annadanam && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-100 text-orange-900 border border-orange-200">
                  🍚 Annadanam
                </span>
              )}
              {idol.has_uregimpu && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  🥁 Uregimpu
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/idol/${idol.id}`}
            className="py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </Link>

          <a
            href={getGoogleMapsDirectionsUrl(idol.latitude, idol.longitude, idol.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        </div>
      </div>

    </div>
  );
};

export default IdolCard;

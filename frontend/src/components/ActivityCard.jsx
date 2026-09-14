import React, { useState } from 'react';
import { Clock, MapPin, Navigation, Share2, Bell, CheckCircle2, AlertCircle, Users, ArrowRight } from 'lucide-react';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../services/geo';

export const ActivityCard = ({ activity, onSelectRoute }) => {
  const [reminded, setReminded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getActivityConfig = () => {
    switch (activity.activity_type) {
      case 'prasadam':
        return {
          icon: '🙏',
          label: 'Prasadam Seva',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          gradient: 'from-amber-500 to-orange-600'
        };
      case 'annadanam':
        return {
          icon: '🍚',
          label: 'Annadanam Seva',
          badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
          gradient: 'from-orange-500 to-amber-600'
        };
      case 'uregimpu':
      default:
        return {
          icon: '🥁',
          label: 'Ganesh Uregimpu',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
          gradient: 'from-purple-600 to-indigo-600'
        };
    }
  };

  const getStatusBadge = () => {
    const s = activity.status?.toLowerCase() || 'upcoming';
    if (s.includes('now') || s.includes('progress') || s.includes('live')) {
      return {
        bg: 'bg-emerald-500 text-white animate-pulse',
        label: '🔴 Live Now'
      };
    } else if (s.includes('soon')) {
      return {
        bg: 'bg-amber-500 text-white',
        label: '🟡 Starting Soon'
      };
    } else if (s.includes('completed')) {
      return {
        bg: 'bg-slate-200 text-slate-700',
        label: '✅ Completed'
      };
    } else if (s.includes('cancelled')) {
      return {
        bg: 'bg-rose-100 text-rose-800',
        label: '❌ Cancelled'
      };
    }
    return {
      bg: 'bg-blue-100 text-blue-800',
      label: '📅 Upcoming'
    };
  };

  const config = getActivityConfig();
  const statusInfo = getStatusBadge();

  const handleShare = () => {
    const text = `🕉️ GaneshMap | ${config.icon} ${activity.title}\n📍 ${activity.idol_name || activity.location}\n📅 ${activity.date} • ${activity.start_time}\nView on GaneshMap!`;
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReminderToggle = () => {
    if (!reminded) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      setReminded(true);
    } else {
      setReminded(false);
    }
  };

  const hasRoute = Boolean(activity.route_coordinates);

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1 ${config.badgeBg}`}>
            <span>{config.icon}</span> {config.label}
          </span>

          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${statusInfo.bg}`}>
            {statusInfo.label}
          </span>
        </div>

        <h3 className="font-heading font-extrabold text-base text-slate-900 line-clamp-1">
          {activity.title}
        </h3>

        {activity.idol_name && (
          <p className="text-xs font-bold text-orange-700 mt-0.5">
            🛕 {activity.idol_name} ({activity.idol_area})
          </p>
        )}
      </div>

      {/* Timing & Location */}
      <div className="space-y-1.5 text-xs text-slate-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100/60">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>{activity.date} • {activity.start_time} {activity.end_time ? `- ${activity.end_time}` : ''}</span>
        </div>

        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
          <span>{activity.location}</span>
        </div>

        {activity.distance_meters !== undefined && activity.distance_meters !== null && (
          <div className="text-[11px] font-extrabold text-orange-800 pt-1 border-t border-orange-200/50 flex items-center justify-between">
            <span>📏 Distance: {formatDistance(activity.distance_meters)}</span>
          </div>
        )}
      </div>

      {/* Procession Starting / Ending route detail if Uregimpu */}
      {activity.activity_type === 'uregimpu' && (activity.start_location || activity.end_location) && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1 text-purple-950">
          <div className="font-bold text-[11px] uppercase tracking-wider text-purple-800 flex items-center gap-1">
            🥁 Procession Route Info
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <span className="font-bold text-emerald-700">🟢 Start:</span>
            <span className="line-clamp-1">{activity.start_location || 'Pandal'}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <span className="font-bold text-rose-700">🔴 End:</span>
            <span className="line-clamp-1">{activity.end_location || 'Visarjan Ghat'}</span>
          </div>
        </div>
      )}

      {activity.description && (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
          "{activity.description}"
        </p>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        {hasRoute && onSelectRoute ? (
          <button
            onClick={() => onSelectRoute(activity)}
            className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            🥁 View Route
          </button>
        ) : (
          <a
            href={getGoogleMapsDirectionsUrl(activity.latitude || 16.5062, activity.longitude || 80.6480, activity.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" /> Directions
          </a>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={handleReminderToggle}
            className={`p-2 rounded-xl text-xs font-bold transition-colors border ${
              reminded
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title={reminded ? 'Reminder Enabled' : 'Set Reminder'}
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold"
            title="Share Activity"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ActivityCard;

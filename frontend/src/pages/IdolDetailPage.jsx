import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Navigation, Share2, AlertTriangle, Star, Clock, Calendar, Phone, User, ShieldCheck, Leaf, ArrowLeft, MessageSquare, Sparkles, Plus } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import ReportModal from '../components/ReportModal';
import RatingModal from '../components/RatingModal';
import ActivityCard from '../components/ActivityCard';
import AddActivityModal from '../components/AddActivityModal';
import MapView from '../components/MapView';
import { fetchIdolDetail, fetchIdolRatings, fetchIdolActivities } from '../services/api';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../services/geo';

export const IdolDetailPage = ({ userLocation }) => {
  const { id } = useParams();
  const [idol, setIdol] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  useEffect(() => {
    loadIdolData();
  }, [id, userLocation]);

  const loadIdolData = async () => {
    setLoading(true);
    try {
      const userLat = userLocation?.lat || null;
      const userLng = userLocation?.lng || null;
      const data = await fetchIdolDetail(id, userLat, userLng);
      setIdol(data);

      const revs = await fetchIdolRatings(id);
      setReviews(revs);

      const acts = await fetchIdolActivities(id);
      setActivities(acts);
    } catch (err) {
      console.error("Failed to fetch idol detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: idol?.name || 'Ganesh Idol',
        text: `Check out ${idol?.name} in ${idol?.area} on GaneshMap!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse"></div>
        <div className="h-32 rounded-2xl bg-slate-200 animate-pulse"></div>
      </div>
    );
  }

  if (!idol) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-lg font-bold text-slate-800">Lord Ganesh Idol not found.</p>
        <Link to="/map" className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs inline-block">
          Back to Map
        </Link>
      </div>
    );
  }

  const isEco = idol.eco_status === 'Eco-Friendly';

  // Group activities by type
  const prasadamList = activities.filter((a) => a.activity_type === 'prasadam');
  const annadanamList = activities.filter((a) => a.activity_type === 'annadanam');
  const uregimpuList = activities.filter((a) => a.activity_type === 'uregimpu');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Back Link */}
      <Link
        to="/map"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore Map
      </Link>

      {/* Hero Banner Image */}
      <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-orange-100 bg-slate-900">
        <img
          src={idol.image_url || 'https://images.unsplash.com/photo-1567591377030-de198b9d5186?auto=format&fit=crop&w=800&q=80'}
          alt={idol.name}
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <CrowdBadge status={idol.crowd_status} />
          
          <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1 ${
            isEco ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-white border-amber-400'
          }`}>
            <Leaf className="w-3.5 h-3.5" />
            {idol.eco_status}
          </span>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-[11px] font-extrabold uppercase tracking-wider">
              {idol.area}
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin Verified
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl leading-tight flex items-center gap-2">
            <span>🕉️</span> <span>{idol.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{idol.address}</span>
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{idol.avg_rating || 4.8} / 5.0</span>
            <span className="text-xs font-normal text-slate-500">({reviews.length} reviews)</span>
          </div>

          {idol.distance_meters && (
            <span className="bg-orange-50 text-orange-800 px-3 py-1.5 rounded-xl border border-orange-200 font-extrabold text-xs">
              📍 {formatDistance(idol.distance_meters)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={getGoogleMapsDirectionsUrl(idol.latitude, idol.longitude, idol.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" /> Get Directions
          </a>

          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare ? 'Link Copied!' : 'Share'}
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200"
          >
            <AlertTriangle className="w-4 h-4" /> Report
          </button>
        </div>
      </div>

      {/* 🎉 FESTIVAL ACTIVITIES SECTION */}
      <section className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Pandal Program Schedule
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              🎉 Festival Activities & Seva Information
            </h2>
          </div>

          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1 border border-orange-200 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Seva Activity
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="p-6 text-center bg-orange-50/50 rounded-2xl border border-orange-100 space-y-1">
            <p className="text-sm font-bold text-slate-700">Information not provided yet.</p>
            <p className="text-xs text-slate-500">Organizers can submit Prasadam, Annadanam, and Uregimpu details by clicking "+ Add Seva Activity".</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 🙏 Prasadam Section */}
            {prasadamList.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-base text-amber-900 flex items-center gap-2">
                  <span>🙏</span> Prasadam Seva ({prasadamList.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prasadamList.map((act) => (
                    <ActivityCard key={act.id} activity={act} />
                  ))}
                </div>
              </div>
            )}

            {/* 🍚 Annadanam Section */}
            {annadanamList.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-base text-orange-900 flex items-center gap-2">
                  <span>🍚</span> Annadanam Meal Seva ({annadanamList.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {annadanamList.map((act) => (
                    <ActivityCard key={act.id} activity={act} />
                  ))}
                </div>
              </div>
            )}

            {/* 🥁 Uregimpu Procession Section */}
            {uregimpuList.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-base text-purple-900 flex items-center gap-2">
                  <span>🥁</span> Ganesh Uregimpu / Procession ({uregimpuList.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uregimpuList.map((act) => (
                    <ActivityCard key={act.id} activity={act} onSelectRoute={(act) => setSelectedRoute(act)} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </section>

      {/* Procession Route Map Renderer if Selected */}
      {selectedRoute && (
        <section className="bg-white p-6 rounded-3xl border border-purple-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-lg text-purple-950 flex items-center gap-2">
              <span>🥁</span> Procession Route Map: {selectedRoute.title}
            </h3>
            <button
              onClick={() => setSelectedRoute(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Hide Route Map ✕
            </button>
          </div>
          <MapView idols={[idol]} userLocation={userLocation} selectedRoute={selectedRoute} height="400px" />
        </section>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              About This Pandal
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {idol.description || 'No additional description provided. Visit during opening hours for Mahamangala Harati and darshan.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Darshan Timings</span>
                  <span className="text-slate-600">{idol.opening_time || '06:00 AM'} - {idol.closing_time || '10:30 PM'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Festival Schedule</span>
                  <span className="text-slate-600">{idol.start_date || '2026-09-07'} to {idol.end_date || '2026-09-17'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              Organizer & Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                <User className="w-4 h-4 text-orange-600" />
                <div>
                  <span className="block font-bold text-slate-900">Organizer Name</span>
                  <span className="text-slate-600">{idol.organizer_name || 'Sarvajanik Utsav Samithi'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                <Phone className="w-4 h-4 text-orange-600" />
                <div>
                  <span className="block font-bold text-slate-900">Contact Number</span>
                  <span className="text-slate-600">{idol.contact_number || '+91 98480 12345'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Devotee Reviews ({reviews.length})
              </h3>
              
              <button
                onClick={() => setIsRatingOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1 border border-orange-200"
              >
                + Write Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No devotee reviews yet. Be the first to share your darshan experience!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{rev.user_name}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{rev.rating}</span>
                      </div>
                    </div>
                    {rev.review && (
                      <p className="text-xs text-slate-600">{rev.review}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" /> GPS Location Specs
            </h4>

            <div className="p-3 rounded-xl bg-slate-50 text-xs font-mono space-y-1 text-slate-700 border border-slate-200">
              <div>Latitude: <strong className="text-slate-900">{idol.latitude}</strong></div>
              <div>Longitude: <strong className="text-slate-900">{idol.longitude}</strong></div>
            </div>

            <a
              href={getGoogleMapsDirectionsUrl(idol.latitude, idol.longitude, idol.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Navigation className="w-4 h-4" /> Open In Maps
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        idolId={idol.id}
        idolName={idol.name}
        onSuccess={loadIdolData}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        idolId={idol.id}
        idolName={idol.name}
      />

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        idolId={idol.id}
        idolName={idol.name}
        onRatingSubmitted={loadIdolData}
      />

    </div>
  );
};

export default IdolDetailPage;

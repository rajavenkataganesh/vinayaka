import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Sparkles, ShieldCheck, Award, Heart, CheckCircle2, ChevronRight, Navigation, Loader2 } from 'lucide-react';
import MapView from '../components/MapView';
import IdolCard from '../components/IdolCard';
import SearchBar from '../components/SearchBar';
import EcoGuideSection from '../components/EcoGuideSection';
import { fetchNearbyIdols, fetchAllIdols, fetchPublicStats } from '../services/api';
import { getCurrentPosition } from '../services/geo';

export const HomePage = ({ onOpenAddModal, userLocation, onRequestLocation }) => {
  const navigate = useNavigate();
  const [idols, setIdols] = useState([]);
  const [stats, setStats] = useState({
    verified_idols: 7,
    registered_areas: 5,
    eco_friendly_idols: 6,
    community_submissions: 1
  });

  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const statsData = await fetchPublicStats();
      if (statsData) setStats(statsData);

      let idolList = [];
      if (userLocation) {
        idolList = await fetchNearbyIdols(userLocation.lat, userLocation.lng);
      } else {
        idolList = await fetchAllIdols();
      }
      setIdols(idolList);
    } catch (err) {
      console.error("Failed to load home page data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearMe = async () => {
    setIsDetecting(true);
    setLocationStatus('Requesting browser location permission...');
    try {
      const pos = await onRequestLocation();
      if (pos) {
        setLocationStatus('Finding nearby verified Ganesh idols...');
        const nearby = await fetchNearbyIdols(pos.lat, pos.lng);
        setIdols(nearby);
        setLocationStatus(`Found ${nearby.length} Ganesh idols near your location!`);
      }
    } catch (err) {
      setLocationStatus(err.message || 'Location permission denied. Showing all areas.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadInitialData();
      return;
    }
    navigate(`/map?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 shadow-sm animate-bounce">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Vinayaka Chaturthi 2026 Special</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-slate-900 tracking-tight leading-none">
            🐘 GANESHMAP
            <span className="block text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent mt-2">
              Find Ganesh Idols Near You
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            Discover verified Ganesh idols, grand pandals, darshan timings, crowd levels, and eco-friendly immersion spots in Vijayawada, Mangalagiri, Guntur, Amaravati, Hyderabad & beyond.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleFindNearMe}
              disabled={isDetecting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Detecting Location...
                </>
              ) : (
                <>
                  📍 Find Near Me
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/map')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-orange-50 text-slate-800 font-extrabold text-base border-2 border-orange-200 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Compass className="w-5 h-5 text-orange-600" />
              Explore Interactive Map
            </button>
          </div>

          {locationStatus && (
            <p className="text-xs font-bold text-orange-700 bg-orange-50 py-1.5 px-4 rounded-full inline-block border border-orange-200">
              {locationStatus}
            </p>
          )}

          {/* Search Bar Banner */}
          <div className="max-w-xl mx-auto pt-4">
            <SearchBar onSearch={handleSearch} />
          </div>

        </div>
      </section>

      {/* STATISTICS COUNTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-orange-100 shadow-sm">
          
          <div className="text-center p-3">
            <span className="block font-heading font-black text-3xl sm:text-4xl text-orange-600">
              {stats.verified_idols}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified Idols
            </span>
          </div>

          <div className="text-center p-3">
            <span className="block font-heading font-black text-3xl sm:text-4xl text-amber-600">
              {stats.registered_areas}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Areas
            </span>
          </div>

          <div className="text-center p-3">
            <span className="block font-heading font-black text-3xl sm:text-4xl text-emerald-600">
              {stats.eco_friendly_idols}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Eco-Friendly Pandals
            </span>
          </div>

          <div className="text-center p-3">
            <span className="block font-heading font-black text-3xl sm:text-4xl text-red-600">
              {stats.community_submissions}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Community Submissions
            </span>
          </div>

        </div>
      </section>

      {/* INTERACTIVE MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Live Map View
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Nearby Ganesh Idols & Pandals
            </h2>
          </div>

          <button
            onClick={() => navigate('/map')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            View Full Screen Map <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <MapView idols={idols} userLocation={userLocation} height="420px" />
      </section>

      {/* NEARBY IDOLS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            {userLocation ? '📍 Idols Sorted By Distance' : '🐘 Popular Ganesh Pandals'}
          </h2>
          
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200"
          >
            + Submit New Idol
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {idols.map((idol) => (
              <IdolCard key={idol.id} idol={idol} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-orange-100 shadow-sm space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Simple 4-Step Process
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              How GaneshMap Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">📍 Detect Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allow browser location permission to instantly get your current GPS coordinates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-base">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">🐘 Find Nearby Idols</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View verified Ganesh idols near you automatically sorted by exact Haversine distance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-base">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">🗺️ Explore the Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check darshan timings, crowd status (🟢 Low, 🟡 Med, 🔴 High), ratings, and eco-friendly status.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center text-base">
                4
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">🧭 Get Directions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click Get Directions to open turn-by-turn navigation from your current location straight to the pandal!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ECO-FRIENDLY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EcoGuideSection />
      </section>

    </div>
  );
};

export default HomePage;

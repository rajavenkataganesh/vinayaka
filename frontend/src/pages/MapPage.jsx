import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapView from '../components/MapView';
import IdolCard from '../components/IdolCard';
import SearchBar from '../components/SearchBar';
import ActivityFilterBar from '../components/ActivityFilterBar';
import { fetchAllIdols, fetchNearbyIdols, searchIdols } from '../services/api';
import { Map, ListFilter, Compass } from 'lucide-react';

export const MapPage = ({ userLocation, onRequestLocation }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('split');
  const [ecoFilter, setEcoFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    loadData(initialSearch, activityFilter);
  }, [initialSearch, userLocation, activityFilter]);

  const loadData = async (query = '', actFilter = activityFilter) => {
    setLoading(true);
    try {
      let results = [];
      if (query) {
        results = await searchIdols(query);
      } else if (userLocation) {
        results = await fetchNearbyIdols(userLocation.lat, userLocation.lng, 50, actFilter);
      } else {
        results = await fetchAllIdols('', '', actFilter);
      }

      if (ecoFilter) {
        results = results.filter((i) => i.eco_status === ecoFilter);
      }

      setIdols(results);
    } catch (err) {
      console.error("Failed to load map page idols:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    loadData(query, activityFilter);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Top Controls & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <select
              value={ecoFilter}
              onChange={(e) => { setEcoFilter(e.target.value); loadData(initialSearch, activityFilter); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
            >
              <option value="">All Materials</option>
              <option value="Eco-Friendly">🟢 Eco-Friendly Only</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'map' ? 'bg-orange-500 text-white' : 'text-slate-600'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-slate-600'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Festival Activity Checkbox Filter Bar */}
        <div className="pt-2 border-t border-slate-100">
          <ActivityFilterBar
            selectedFilter={activityFilter}
            onFilterChange={(f) => setActivityFilter(f)}
          />
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Map View */}
        <div className={`lg:col-span-7 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-20">
            <MapView
              idols={idols}
              userLocation={userLocation}
              selectedRoute={selectedRoute}
              height="650px"
            />
          </div>
        </div>

        {/* Right Sidebar List */}
        <div className={`lg:col-span-5 space-y-4 ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-600" />
              Ganesh Pandals ({idols.length})
            </h3>
            
            {userLocation && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Sorted by Distance
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : idols.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-orange-100 space-y-2">
              <p className="text-sm font-bold text-slate-700">No Ganesh Idols found matching search criteria.</p>
              <p className="text-xs text-slate-400">Try clearing activity filters or searching for Vijayawada, Mangalagiri, Guntur, Amaravati, Hyderabad.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
              {idols.map((idol) => (
                <IdolCard key={idol.id} idol={idol} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MapPage;

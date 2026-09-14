import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

const QUICK_CITIES = ['Vijayawada', 'Mangalagiri', 'Guntur', 'Amaravati', 'Hyderabad', 'Mumbai'];

export const SearchBar = ({ onSearch, placeholder = "Search Ganesh idols by area or name..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleQuickClick = (city) => {
    setQuery(city);
    if (onSearch) onSearch(city);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-orange-500 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white border border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm transition-all outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Quick City Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-0.5 shrink-0">
          <MapPin className="w-3 h-3 text-orange-400" /> Areas:
        </span>
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleQuickClick(city)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              query.toLowerCase() === city.toLowerCase()
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

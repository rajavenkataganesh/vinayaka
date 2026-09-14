import React from 'react';
import { Filter, Sparkles } from 'lucide-react';

export const ActivityFilterBar = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: '', label: 'All Pandals', icon: '🛕' },
    { id: 'prasadam', label: '🙏 Prasadam', icon: '🙏' },
    { id: 'annadanam', label: '🍚 Annadanam', icon: '🍚' },
    { id: 'uregimpu', label: '🥁 Uregimpu Procession', icon: '🥁' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
      <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0 pr-1">
        <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Seva:
      </span>

      {filters.map((f) => {
        const isSelected = selectedFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-all border flex items-center gap-1 ${
              isSelected
                ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-orange-700'
            }`}
          >
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ActivityFilterBar;

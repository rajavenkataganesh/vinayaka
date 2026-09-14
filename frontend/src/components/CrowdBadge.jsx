import React from 'react';
import { Users } from 'lucide-react';

export const CrowdBadge = ({ status = 'Low', showIcon = true }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'high':
      case 'red':
        return {
          bg: 'bg-red-100 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: '🔴 High Crowd'
        };
      case 'medium':
      case 'yellow':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: '🟡 Medium Crowd'
        };
      case 'low':
      case 'green':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: '🟢 Low Crowd'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      {showIcon && <Users className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
};

export default CrowdBadge;

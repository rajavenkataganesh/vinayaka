import React from 'react';
import ganeshImg from '../assets/ganesh_icon.jpeg';

/**
 * Lord Ganesh Image Icon Component
 * Renders the Lord Ganesha photo avatar with glowing amber border.
 */
export const GaneshIcon = ({ className = "w-6 h-6", alt = "Lord Ganesha" }) => (
  <img
    src={ganeshImg}
    alt={alt}
    className={`rounded-full object-cover border border-amber-400 shadow-sm shrink-0 inline-block ${className}`}
  />
);

export default GaneshIcon;

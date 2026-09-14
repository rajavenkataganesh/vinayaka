import React from 'react';

/**
 * Lord Ganesh Vector Icon Component
 * Features: Mukut (Crown), Tilak, Large Ears, Trunk (Vakratunda) with Modak & Ekadanta
 */
export const GaneshIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crown / Mukut */}
    <path
      d="M16 2L19.5 7.5H12.5L16 2Z"
      fill={color}
      fillOpacity="0.9"
    />
    <path
      d="M10 7.5H22L21 11.5H11L10 7.5Z"
      fill={color}
    />
    
    {/* Sacred Tilak / Tika */}
    <path
      d="M16 8.5V12.5"
      stroke="#FFD700"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 10H17.5"
      stroke="#FFD700"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Left Ear */}
    <path
      d="M10 12C6.5 12 4.5 14.5 4.5 17C4.5 19.5 6.5 20.5 9 20"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Right Ear */}
    <path
      d="M22 12C25.5 12 27.5 14.5 27.5 17C27.5 19.5 25.5 20.5 23 20"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Head Outline */}
    <path
      d="M10 12C10 12 12 11 16 11C20 11 22 12 22 12"
      stroke={color}
      strokeWidth="2"
    />

    {/* Trunk (Vakratunda Curve) */}
    <path
      d="M13.5 14.5C13.5 14.5 14.5 18 15 20C15.5 22 16.5 24 19 24C21.5 24 22.5 22.5 22.5 21C22.5 19.5 21 19 20 19.5"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    {/* Single Tusk (Ekadanta) */}
    <path
      d="M12.5 18L11 19.5"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Sacred Modak / Sweet in Trunk */}
    <circle cx="19.5" cy="19.5" r="1.5" fill="#FFD700" />
  </svg>
);

export default GaneshIcon;

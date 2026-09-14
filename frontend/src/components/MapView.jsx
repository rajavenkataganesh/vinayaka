import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../services/geo';
import CrowdBadge from './CrowdBadge';
import { Navigation, Star, Leaf, Clock, MapPin, Eye } from 'lucide-react';

// Custom SVG Icons for Leaflet
const createGaneshIcon = (ecoStatus) => {
  const isEco = ecoStatus === 'Eco-Friendly';
  const badgeColor = isEco ? '#10B981' : '#F59E0B';
  
  const svgHtml = `
    <div style="
      position: relative;
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      border: 3px solid #FFF;
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    ">
      🐘
      <div style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 14px;
        height: 14px;
        background-color: ${badgeColor};
        border: 2px solid white;
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divAnchor ? L.divIcon({
    html: svgHtml,
    className: 'custom-ganesh-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  }) : L.divIcon({
    html: svgHtml,
    className: 'custom-ganesh-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

const createUserIcon = () => {
  const svgHtml = `
    <div style="
      width: 32px;
      height: 32px;
      background: #3B82F6;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
    ">
      📍
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-user-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Component to dynamically re-center map view
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({ idols = [], userLocation = null, selectedIdolId = null, height = "500px" }) => {
  const navigate = useNavigate();
  
  // Default map center (Vijayawada Benz Circle or User location)
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [16.5062, 80.6480];

  const ganeshIconMemo = useRef({});

  const getCachedIcon = (ecoStatus) => {
    if (!ganeshIconMemo.current[ecoStatus]) {
      ganeshIconMemo.current[ecoStatus] = createGaneshIcon(ecoStatus);
    }
    return ganeshIconMemo.current[ecoStatus];
  };

  const userIcon = createUserIcon();

  return (
    <div style={{ height }} className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-orange-100">
      <MapContainer
        center={defaultCenter}
        zoom={userLocation ? 14 : 12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={defaultCenter} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="p-2 text-center">
                  <span className="font-bold text-blue-600">📍 You Are Here</span>
                  <p className="text-xs text-slate-500">Current GPS Position</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={500}
              pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.15, color: '#3B82F6', weight: 1 }}
            />
          </>
        )}

        {/* Ganesh Idol Markers */}
        {idols.map((idol) => {
          const isSelected = selectedIdolId === idol.id;

          return (
            <Marker
              key={idol.id}
              position={[idol.latitude, idol.longitude]}
              icon={getCachedIcon(idol.eco_status)}
            >
              <Popup>
                <div className="p-3 space-y-2">
                  {/* Image Thumbnail */}
                  {idol.image_url && (
                    <div className="w-full h-28 rounded-lg overflow-hidden relative bg-slate-100">
                      <img
                        src={idol.image_url}
                        alt={idol.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <CrowdBadge status={idol.crowd_status} showIcon={false} />
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-1">
                      🐘 {idol.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                      <span>{idol.area}</span>
                    </p>
                  </div>

                  {/* Badges & Distance */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                      📏 {idol.distance_meters ? formatDistance(idol.distance_meters) : idol.area}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      {idol.avg_rating || 4.8}
                    </span>
                  </div>

                  {/* Timings */}
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{idol.opening_time || '06:00 AM'} - {idol.closing_time || '10:30 PM'}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <button
                      onClick={() => navigate(`/idol/${idol.id}`)}
                      className="w-full py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Details
                    </button>

                    <a
                      href={getGoogleMapsDirectionsUrl(idol.latitude, idol.longitude, idol.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;

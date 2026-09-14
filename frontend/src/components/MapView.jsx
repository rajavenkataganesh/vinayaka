import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../services/geo';
import CrowdBadge from './CrowdBadge';
import { Navigation, Star, Clock, MapPin, Eye } from 'lucide-react';

const createGaneshMarkerIcon = (ecoStatus) => {
  const isEco = ecoStatus === 'Eco-Friendly';
  const badgeColor = isEco ? '#10B981' : '#F59E0B';
  
  const svgHtml = `
    <div style="
      position: relative;
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      border: 3px solid #FFF;
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L19.5 7.5H12.5L16 2Z" fill="#FFD700" />
        <path d="M10 7.5H22L21 11.5H11L10 7.5Z" fill="#FFF" />
        <path d="M16 8.5V12.5" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 12C6.5 12 4.5 14.5 4.5 17C4.5 19.5 6.5 20.5 9 20" stroke="#FFF" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M22 12C25.5 12 27.5 14.5 27.5 17C27.5 19.5 25.5 20.5 23 20" stroke="#FFF" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M13.5 14.5C13.5 14.5 14.5 18 15 20C15.5 22 16.5 24 19 24C21.5 24 22.5 22.5 22.5 21C22.5 19.5 21 19 20 19.5" stroke="#FFF" stroke-width="2.8" stroke-linecap="round"/>
        <circle cx="19.5" cy="19.5" r="1.5" fill="#FFD700"/>
      </svg>
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

  return L.divIcon({
    html: svgHtml,
    className: 'custom-ganesh-marker',
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -23]
  });
};

const createStartIcon = () => {
  return L.divIcon({
    html: `<div style="background:#10B981; color:white; border:2px solid white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; shadow:0 2px 6px rgba(0,0,0,0.3)">🟢</div>`,
    className: 'start-route-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const createEndIcon = () => {
  return L.divIcon({
    html: `<div style="background:#EF4444; color:white; border:2px solid white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; shadow:0 2px 6px rgba(0,0,0,0.3)">🔴</div>`,
    className: 'end-route-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
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

const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({ idols = [], userLocation = null, selectedRoute = null, height = "500px" }) => {
  const navigate = useNavigate();
  
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [16.5062, 80.6480];

  const ganeshIconMemo = useRef({});

  const getCachedIcon = (ecoStatus) => {
    if (!ganeshIconMemo.current[ecoStatus]) {
      ganeshIconMemo.current[ecoStatus] = createGaneshMarkerIcon(ecoStatus);
    }
    return ganeshIconMemo.current[ecoStatus];
  };

  const userIcon = createUserIcon();
  const startIcon = createStartIcon();
  const endIcon = createEndIcon();

  // Parse Uregimpu route polyline coordinates if available
  let routeCoords = null;
  if (selectedRoute?.route_coordinates) {
    try {
      routeCoords = JSON.parse(selectedRoute.route_coordinates);
    } catch (e) {
      console.warn("Invalid route coordinates JSON:", e);
    }
  }

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

        <RecenterMap center={routeCoords ? routeCoords[0] : defaultCenter} />

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

        {/* Uregimpu Procession Route Polyline */}
        {routeCoords && routeCoords.length > 0 && (
          <>
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#9333EA', weight: 5, opacity: 0.85, dashArray: '8, 8' }}
            />

            {/* Starting Point Marker */}
            <Marker position={routeCoords[0]} icon={startIcon}>
              <Popup>
                <div className="p-2 text-xs font-bold text-emerald-700">
                  🟢 Procession Start: {selectedRoute.start_location || 'Main Pandal'}
                </div>
              </Popup>
            </Marker>

            {/* Ending Point Marker */}
            <Marker position={routeCoords[routeCoords.length - 1]} icon={endIcon}>
              <Popup>
                <div className="p-2 text-xs font-bold text-rose-700">
                  🔴 Procession End: {selectedRoute.end_location || 'Visarjan Point'}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Lord Ganesh Idol Markers */}
        {idols.map((idol) => {
          return (
            <Marker
              key={idol.id}
              position={[idol.latitude, idol.longitude]}
              icon={getCachedIcon(idol.eco_status)}
            >
              <Popup>
                <div className="p-3 space-y-2">
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

                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-1 flex items-center gap-1">
                      <span>🕉️</span> <span>{idol.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                      <span>{idol.area}</span>
                    </p>
                  </div>

                  {/* Activity Indicators in Popup */}
                  {(idol.has_prasadam || idol.has_annadanam || idol.has_uregimpu) && (
                    <div className="flex flex-wrap gap-1 text-[10px] font-extrabold pt-1">
                      {idol.has_prasadam && <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">🙏 Prasadam</span>}
                      {idol.has_annadanam && <span className="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded">🍚 Annadanam</span>}
                      {idol.has_uregimpu && <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded">🥁 Uregimpu</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                      📏 {idol.distance_meters ? formatDistance(idol.distance_meters) : idol.area}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      {idol.avg_rating || 4.8}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{idol.opening_time || '06:00 AM'} - {idol.closing_time || '10:30 PM'}</span>
                  </div>

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

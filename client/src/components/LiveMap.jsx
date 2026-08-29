import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, Compass, Shield, Layers, PlusCircle, AlertCircle } from 'lucide-react';

// Fix standard Leaflet default icon issues in React
const customChildIcon = L.divIcon({
  className: 'custom-child-marker',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-cyan-500 rounded-full opacity-75 radar-ping"></div>
      <div class="relative w-7 h-7 bg-cyan-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Component to dynamically re-center map when coordinates update
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
  }, [center, map]);
  return null;
}

export default function LiveMap({ telemetry }) {
  const lat = telemetry?.latitude || 37.774929;
  const lng = telemetry?.longitude || -122.419418;
  const speed = telemetry?.speed || 0;
  const address = telemetry?.address || "750 Market St, San Francisco, CA";

  // Predefined Safe Geofence Zones
  const [geofences, setGeofences] = useState([
    { id: 'gf_1', name: 'Home Safe Zone', center: [37.7749, -122.4194], radius: 250, color: '#10b981', fill: '#059669' },
    { id: 'gf_2', name: 'Lincoln Middle School', center: [37.7780, -122.4140], radius: 350, color: '#3b82f6', fill: '#2563eb' },
    { id: 'gf_3', name: 'City Central Park', center: [37.7710, -122.4250], radius: 300, color: '#f59e0b', fill: '#d97706' }
  ]);

  // Today's breadcrumb path history trail
  const routeTrail = [
    [37.7749, -122.4194],
    [37.7758, -122.4180],
    [37.7765, -122.4162],
    [37.7780, -122.4140],
    [37.7749, -122.4194]
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      
      {/* Top Header of Map */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Live GPS Tracking & Geofence Safe Zones</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-md">{address}</p>
          </div>
        </div>

        {/* Speedometer & Coordinates badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Speed: <strong className="text-slate-100">{Math.round(speed * 3.6)} km/h</strong></span>
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[420px] w-full bg-slate-950">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <MapCenterUpdater center={[lat, lng]} />

          {/* Standard OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Breadcrumb Route Polyline */}
          <Polyline
            positions={routeTrail}
            pathOptions={{ color: '#06b6d4', weight: 3, dashArray: '6, 8', opacity: 0.8 }}
          />

          {/* Geofence Safe Circles */}
          {geofences.map((gf) => (
            <Circle
              key={gf.id}
              center={gf.center}
              radius={gf.radius}
              pathOptions={{
                color: gf.color,
                fillColor: gf.fill,
                fillOpacity: 0.18,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-slate-900 text-xs font-semibold">
                  🛡️ {gf.name}
                  <div className="text-[10px] text-slate-600 font-normal mt-0.5">
                    Safe zone radius: {gf.radius}m
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Live Child GPS Pin */}
          <Marker position={[lat, lng]} icon={customChildIcon}>
            <Popup>
              <div className="text-slate-900 text-xs p-1">
                <strong className="block text-cyan-700 font-bold">Child Current Location</strong>
                <span>{address}</span>
                <div className="mt-1 text-[10px] text-slate-600">
                  Last recorded: Just now
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 shadow-xl flex flex-col gap-1.5">
          <div className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider mb-0.5">Safe Boundaries</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Home Safe Zone (250m)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Lincoln Middle School (350m)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Central Park Safe Zone (300m)</span>
          </div>
        </div>

      </div>

    </div>
  );
}

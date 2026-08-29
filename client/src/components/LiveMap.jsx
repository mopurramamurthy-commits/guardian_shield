import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Shield, 
  Layers, 
  PlusCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Sliders, 
  Check, 
  X 
} from 'lucide-react';

// Custom Animated Leaflet Marker
const customChildIcon = L.divIcon({
  className: 'custom-child-marker',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-9 h-9 bg-cyan-400 rounded-full opacity-75 radar-ping"></div>
      <div class="relative w-8 h-8 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

// Component to dynamically re-center map when coordinates update
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
  }, [center, map]);
  return null;
}

// Map Click Listener to create new Geofences
function MapClickListener({ isAddingZone, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isAddingZone) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

export default function LiveMap({ telemetry, onSimulateMove }) {
  const initialLat = telemetry?.latitude || 37.774929;
  const initialLng = telemetry?.longitude || -122.419418;
  const speed = telemetry?.speed || 0;
  const address = telemetry?.address || "750 Market St, San Francisco, CA";

  // Predefined & User-Created Safe Geofence Zones
  const [geofences, setGeofences] = useState([
    { id: 'gf_1', name: 'Home Safe Zone', center: [37.7749, -122.4194], radius: 250, color: '#10b981', fill: '#059669' },
    { id: 'gf_2', name: 'Lincoln Middle School', center: [37.7780, -122.4140], radius: 350, color: '#3b82f6', fill: '#2563eb' },
    { id: 'gf_3', name: 'City Central Park', center: [37.7710, -122.4250], radius: 300, color: '#f59e0b', fill: '#d97706' }
  ]);

  // Route Simulation / Playback State
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [currentPos, setCurrentPos] = useState([initialLat, initialLng]);

  // Adding Geofence Drawer State
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('My New Safe Zone');
  const [newZoneRadius, setNewZoneRadius] = useState(300);
  const [newZoneColor, setNewZoneColor] = useState('#10b981');
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Today's breadcrumb path history trail
  const routeTrail = [
    [37.7749, -122.4194],
    [37.7758, -122.4180],
    [37.7765, -122.4162],
    [37.7772, -122.4150],
    [37.7780, -122.4140],
    [37.7749, -122.4194]
  ];

  // Route playback effect
  useEffect(() => {
    let timer;
    if (isSimulatingRoute) {
      timer = setInterval(() => {
        setPlaybackIndex((prev) => {
          const next = (prev + 1) % routeTrail.length;
          setCurrentPos(routeTrail[next]);
          return next;
        });
      }, 1500);
    } else {
      setCurrentPos([initialLat, initialLng]);
    }
    return () => clearInterval(timer);
  }, [isSimulatingRoute, initialLat, initialLng]);

  const handleMapClick = (latlng) => {
    setSelectedCoords([latlng.lat, latlng.lng]);
  };

  const handleSaveGeofence = () => {
    if (!selectedCoords) return;
    const newGf = {
      id: `gf_${Date.now()}`,
      name: newZoneName,
      center: selectedCoords,
      radius: newZoneRadius,
      color: newZoneColor,
      fill: newZoneColor
    };
    setGeofences([...geofences, newGf]);
    setIsAddingZone(false);
    setSelectedCoords(null);
  };

  const handleDeleteGeofence = (id) => {
    setGeofences(geofences.filter(g => g.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col space-y-0">
      
      {/* Top Header of Map */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800 shadow-md">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Live GPS Tracking &amp; Dynamic Geofences</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                LIVE 24/7
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-md">{address}</p>
          </div>
        </div>

        {/* Action Controls & Simulation Toolbar */}
        <div className="flex items-center gap-2">
          
          {/* Playback Simulation Button */}
          <button
            onClick={() => setIsSimulatingRoute(!isSimulatingRoute)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isSimulatingRoute
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isSimulatingRoute ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isSimulatingRoute ? 'Pause Route' : 'Play Today\'s Route'}</span>
          </button>

          {/* Add Geofence Button */}
          <button
            onClick={() => setIsAddingZone(!isAddingZone)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isAddingZone
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
            }`}
          >
            {isAddingZone ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{isAddingZone ? 'Cancel' : '+ Add Safe Zone'}</span>
          </button>

          {/* Speed Indicator */}
          <div className="hidden sm:flex px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Speed: <strong className="text-slate-100">{Math.round(speed * 3.6)} km/h</strong></span>
          </div>
        </div>
      </div>

      {/* Geofence Creator Bar (when active) */}
      {isAddingZone && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-300">1. Click anywhere on map to place zone</span>
            <span className="text-slate-400">|</span>
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder="Zone Name (e.g. Karate Class)"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-semibold focus:outline-none"
            />
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Radius:</span>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={newZoneRadius}
                onChange={(e) => setNewZoneRadius(parseInt(e.target.value))}
                className="accent-emerald-500 w-24 cursor-pointer"
              />
              <span className="font-mono text-emerald-300">{newZoneRadius}m</span>
            </div>
          </div>

          <button
            onClick={handleSaveGeofence}
            disabled={!selectedCoords}
            className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              selectedCoords
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Save Safe Zone</span>
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="relative h-[460px] w-full bg-slate-950">
        <MapContainer
          center={currentPos}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <MapCenterUpdater center={currentPos} />
          <MapClickListener isAddingZone={isAddingZone} onMapClick={handleMapClick} />

          {/* Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Breadcrumb Route Polyline */}
          <Polyline
            positions={routeTrail}
            pathOptions={{ color: '#06b6d4', weight: 4, dashArray: '6, 8', opacity: 0.85 }}
          />

          {/* Existing Geofences */}
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
                <div className="text-slate-900 text-xs p-1">
                  <div className="font-bold flex items-center justify-between gap-3">
                    <span>🛡️ {gf.name}</span>
                    <button
                      onClick={() => handleDeleteGeofence(gf.id)}
                      className="text-rose-600 hover:text-rose-800 text-[10px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    Safe Boundary: {gf.radius}m Radius
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Preview circle when creating geofence */}
          {selectedCoords && isAddingZone && (
            <Circle
              center={selectedCoords}
              radius={newZoneRadius}
              pathOptions={{
                color: newZoneColor,
                fillColor: newZoneColor,
                fillOpacity: 0.35,
                weight: 2,
                dashArray: '4, 4'
              }}
            />
          )}

          {/* Live Child GPS Pin Marker */}
          <Marker position={currentPos} icon={customChildIcon}>
            <Popup>
              <div className="text-slate-900 text-xs p-1">
                <strong className="block text-cyan-700 font-bold text-sm">Child Location</strong>
                <span>{address}</span>
                <div className="mt-1 text-[10px] text-slate-600">
                  Status: {isSimulatingRoute ? 'In Motion (Route Playback)' : 'Live GPS Connected'}
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Active Geofence Drawer */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 shadow-2xl max-w-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
              Active Safe Zones ({geofences.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {geofences.map(g => (
              <div key={g.id} className="flex items-center justify-between gap-2 text-[11px] bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="truncate">{g.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{g.radius}m</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

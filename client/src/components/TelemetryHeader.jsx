import React from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Activity, 
  Signal,
  Clock
} from 'lucide-react';

export default function TelemetryHeader({ telemetry, onQuickLockToggle }) {
  const {
    battery = 85,
    charging = false,
    online = true,
    network = "Wi-Fi",
    wifiSsid = "Home Network",
    currentAppName = "WhatsApp",
    isLocked = false,
    deviceModel = "Samsung Galaxy S22",
    simOperator = "T-Mobile",
    lastSeen
  } = telemetry || {};

  const getBatteryColor = (level) => {
    if (level <= 15) return 'text-rose-400 bg-rose-950/40 border-rose-800';
    if (level <= 35) return 'text-amber-400 bg-amber-950/40 border-amber-800';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Device Status */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Device</span>
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          </div>
          <div className="mt-2">
            <div className="font-semibold text-sm text-slate-100 truncate">{deviceModel}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Activity className="w-3 h-3" />
              <span>{online ? 'Online & Protected' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* 2. Battery & Charging */}
        <div className={`border rounded-xl p-3 flex flex-col justify-between ${getBatteryColor(battery)}`}>
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>Battery Level</span>
            {charging ? <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Battery className="w-4 h-4" />}
          </div>
          <div className="mt-2">
            <div className="font-bold text-lg leading-none">{battery}%</div>
            <div className="text-[11px] opacity-80 mt-1">
              {charging ? '⚡ Fast Charging' : 'On Battery Power'}
            </div>
          </div>
        </div>

        {/* 3. Network & Wi-Fi */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Network</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="font-semibold text-sm text-slate-100 truncate">{wifiSsid}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Signal className="w-3 h-3 text-cyan-400" />
              <span>{network}</span>
            </div>
          </div>
        </div>

        {/* 4. Active Foreground App */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current App</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="font-semibold text-sm text-slate-100 truncate">{currentAppName}</div>
            <div className="text-[11px] text-purple-400 mt-0.5">In Active Use</div>
          </div>
        </div>

        {/* 5. Cellular Carrier & SIM */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Carrier / SIM</span>
            <Signal className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="font-semibold text-sm text-slate-100 truncate">{simOperator}</div>
            <div className="text-[11px] text-blue-400 mt-0.5">SIM Verified ✓</div>
          </div>
        </div>

        {/* 6. Instant Device Screen Lock State */}
        <div className={`border rounded-xl p-3 flex flex-col justify-between transition-all ${
          isLocked 
            ? 'bg-rose-950/40 border-rose-700/80 text-rose-300' 
            : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
        }`}>
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>Screen Lock</span>
            {isLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs">{isLocked ? '🔒 Device Locked' : '📱 Unlocked'}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{isLocked ? 'Parent Lock Active' : 'Normal Usage'}</div>
            </div>
            <button
              onClick={() => onQuickLockToggle(!isLocked)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition ${
                isLocked 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isLocked ? 'Unlock' : 'Lock Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

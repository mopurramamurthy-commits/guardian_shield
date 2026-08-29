import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  PhoneCall, 
  MessageSquare, 
  Navigation, 
  BatteryCharging, 
  Lock, 
  Unlock, 
  AlertOctagon, 
  Send, 
  Camera, 
  Mic, 
  X, 
  Volume2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { driveService } from '../services/driveService';

export default function DeviceSimulator({ telemetry, onClose, onDataUpdated }) {
  const [simName, setSimName] = useState('Alex (Best Friend)');
  const [simPhone, setSimPhone] = useState('+1 (555) 392-1084');
  const [simMsg, setSimMsg] = useState('Hey, let\'s play Minecraft after homework!');
  const [simApp, setSimApp] = useState('WhatsApp');
  const [activeCamSim, setActiveCamSim] = useState(null);
  const [activeMicSim, setActiveMicSim] = useState(false);

  const isLocked = telemetry?.isLocked || false;

  const handleTriggerCall = (type = 'INCOMING') => {
    driveService.simulateNewCall(simName, simPhone, type, 140);
    onDataUpdated();
  };

  const handleTriggerMessage = () => {
    driveService.simulateNewSocialMessage(simApp, simName, simMsg, `com.${simApp.toLowerCase()}`);
    onDataUpdated();
  };

  const handleMoveLocation = (preset) => {
    if (preset === 'school') {
      driveService.simulateLocationUpdate(37.7780, -122.4140, "Lincoln Middle School, Hayes St");
    } else if (preset === 'park') {
      driveService.simulateLocationUpdate(37.7710, -122.4250, "City Central Park, Playground");
    } else {
      driveService.simulateLocationUpdate(37.774929, -122.419418, "Home, 750 Market St, San Francisco, CA");
    }
    onDataUpdated();
  };

  const handleTriggerSOS = () => {
    driveService.localState.alerts.unshift({
      id: `sos_${Date.now()}`,
      type: "EMERGENCY_SOS",
      severity: "CRITICAL",
      message: "🚨 EMERGENCY SOS: Child triggered panic alarm! Coordinates broadcasted to Google Drive.",
      timestamp: "Just now"
    });
    driveService.saveLocal();
    onDataUpdated();
  };

  return (
    <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-5 shadow-2xl space-y-4 mb-6 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 shadow">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Interactive Child Phone Hardware Simulator</span>
              <span className="text-[10px] bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase shadow">
                TEST BENCH
              </span>
            </h3>
            <p className="text-xs text-slate-400">Emulate real-world child activity (calls, WhatsApp messages, GPS moves, emergency alerts)</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Lock Overlay Banner */}
      {isLocked && (
        <div className="bg-rose-950/90 border border-rose-600 rounded-2xl p-4 flex items-center justify-between text-rose-200 text-xs shadow-lg animate-pulse">
          <div className="flex items-center gap-2.5 font-bold">
            <Lock className="w-5 h-5 text-rose-400" />
            <span>CHILD DEVICE SCREEN IS CURRENTLY LOCKED BY PARENT! (Apps Disabled)</span>
          </div>
          <button
            onClick={() => {
              driveService.sendCommand({ lockDevice: false });
              onDataUpdated();
            }}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Unlock Now
          </button>
        </div>
      )}

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Simulate Calls */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Simulate Incoming / Outgoing Call</span>
          </div>
          <input
            type="text"
            value={simName}
            onChange={(e) => setSimName(e.target.value)}
            placeholder="Contact Name"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTriggerCall('INCOMING')}
              className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              + In
            </button>
            <button
              onClick={() => handleTriggerCall('OUTGOING')}
              className="py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition shadow-md shadow-cyan-600/20"
            >
              + Out
            </button>
            <button
              onClick={() => handleTriggerCall('MISSED')}
              className="py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition shadow-md shadow-rose-600/20"
            >
              + Missed
            </button>
          </div>
        </div>

        {/* 2. Simulate Chat / Social Notifications */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Simulate Social Chat</span>
            </span>
            <select
              value={simApp}
              onChange={(e) => setSimApp(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-purple-300 font-semibold focus:outline-none"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Telegram">Telegram</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
          <input
            type="text"
            value={simMsg}
            onChange={(e) => setSimMsg(e.target.value)}
            placeholder="Message text..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleTriggerMessage}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Message to Parent Feed</span>
          </button>
        </div>

        {/* 3. Simulate GPS & SOS Panic */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Simulate GPS Move &amp; Panic SOS</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMoveLocation('home')}
              className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleMoveLocation('school')}
              className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition"
            >
              🏫 School
            </button>
            <button
              onClick={() => handleMoveLocation('park')}
              className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition"
            >
              🌳 Park
            </button>
          </div>

          <button
            onClick={handleTriggerSOS}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>🚨 Trigger Emergency SOS Broadcast</span>
          </button>
        </div>

      </div>

    </div>
  );
}

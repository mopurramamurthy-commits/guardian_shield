import React, { useState } from 'react';
import { 
  Smartphone, 
  PhoneCall, 
  MessageSquare, 
  Navigation, 
  BatteryCharging, 
  Lock, 
  AlertOctagon, 
  Play, 
  Check, 
  Send,
  X
} from 'lucide-react';
import { driveService } from '../services/driveService';

export default function DeviceSimulator({ telemetry, onClose, onDataUpdated }) {
  const [simName, setSimName] = useState('Sarah (School Friend)');
  const [simPhone, setSimPhone] = useState('+1 (555) 392-1084');
  const [simMsg, setSimMsg] = useState('Hey, are we still studying together today?');
  const [simApp, setSimApp] = useState('WhatsApp');

  const isLocked = telemetry?.isLocked || false;

  const handleTriggerCall = (type = 'INCOMING') => {
    driveService.simulateNewCall(simName, simPhone, type, 180);
    onDataUpdated();
  };

  const handleTriggerMessage = () => {
    driveService.simulateNewSocialMessage(simApp, simName, simMsg, `com.${simApp.toLowerCase()}`);
    onDataUpdated();
  };

  const handleMoveLocation = (preset) => {
    if (preset === 'school') {
      driveService.simulateLocationUpdate(37.7780, -122.4140, "Lincoln Middle School, 450 Hayes St");
    } else if (preset === 'park') {
      driveService.simulateLocationUpdate(37.7710, -122.4250, "City Central Park, Playground East");
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
      message: "🚨 CRITICAL: Child pressed Emergency SOS button! High-priority alert triggered.",
      timestamp: "Just now"
    });
    driveService.saveLocal();
    onDataUpdated();
  };

  return (
    <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Smartphone className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Interactive Child Device Simulator</span>
              <span className="text-[10px] bg-cyan-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                TEST BENCH
              </span>
            </h3>
            <p className="text-xs text-slate-400">Trigger test calls, messages, and GPS moves to verify real-time parent controls</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Lock Status Indicator in Simulator */}
      {isLocked && (
        <div className="bg-rose-950/80 border border-rose-600 rounded-xl p-3 flex items-center justify-between text-rose-200 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Child Device is Currently LOCKED by Parent Dashboard!</span>
          </div>
          <span className="text-[11px] bg-rose-900 text-rose-300 px-2 py-0.5 rounded border border-rose-700 font-semibold">
            Enforced
          </span>
        </div>
      )}

      {/* Action Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Simulate Call */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Simulate Phone Call</span>
          </div>
          <input
            type="text"
            value={simName}
            onChange={(e) => setSimName(e.target.value)}
            placeholder="Caller Name"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleTriggerCall('INCOMING')}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
            >
              + Incoming
            </button>
            <button
              onClick={() => handleTriggerCall('OUTGOING')}
              className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition"
            >
              + Outgoing
            </button>
            <button
              onClick={() => handleTriggerCall('MISSED')}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition"
            >
              + Missed
            </button>
          </div>
        </div>

        {/* 2. Simulate Chat / Social Message */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Simulate Social Message</span>
            </span>
            <select
              value={simApp}
              onChange={(e) => setSimApp(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-purple-300 font-semibold"
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
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleTriggerMessage}
            className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Message to Parent Feed</span>
          </button>
        </div>

        {/* 3. Simulate GPS Movement & SOS */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Simulate GPS & Emergency SOS</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleMoveLocation('home')}
              className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium rounded-lg transition"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleMoveLocation('school')}
              className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium rounded-lg transition"
            >
              🏫 School
            </button>
            <button
              onClick={() => handleMoveLocation('park')}
              className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium rounded-lg transition"
            >
              🌳 Park
            </button>
          </div>

          <button
            onClick={handleTriggerSOS}
            className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>🚨 Trigger Emergency SOS Alarm</span>
          </button>
        </div>

      </div>

    </div>
  );
}

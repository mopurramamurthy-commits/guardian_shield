import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Camera, 
  Mic, 
  Volume2, 
  Moon, 
  Eye, 
  CheckCircle2, 
  Loader2, 
  Smartphone, 
  ShieldAlert 
} from 'lucide-react';

export default function RemoteControlsTab({ commands, telemetry, onSendCommand }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const isLocked = telemetry?.isLocked || commands?.lockDevice || false;
  const isBedtime = commands?.bedtimeLock || false;

  const handleAction = async (actionKey, payload, label) => {
    setLoadingAction(actionKey);
    setSuccessMsg('');
    try {
      await onSendCommand(payload);
      setSuccessMsg(`✓ Successfully dispatched: ${label} command to Google Drive!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Remote Command Center & Surveillance</span>
          </h3>
          <p className="text-xs text-slate-400">Trigger on-demand silent camera snapshots, audio recordings, or emergency locks</p>
        </div>

        {/* Command Status feedback */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Grid of Remote Control Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Remote Screen Lock / Unlock */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isLocked ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
              {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Remote Screen Lock</h4>
              <p className="text-xs text-slate-400">Instantly lock or release child device</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('lock', { lockDevice: !isLocked }, isLocked ? 'Unlock Screen' : 'Lock Screen')}
            disabled={loadingAction === 'lock'}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
            }`}
          >
            {loadingAction === 'lock' ? <Loader2 className="w-4 h-4 animate-spin" /> : isLocked ? 'Unlock Device' : '🔒 Lock Device Now'}
          </button>
        </div>

        {/* 2. Silent Front Camera Snapshot */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Front Camera Snapshot</h4>
              <p className="text-xs text-slate-400">Silently captures selfie & uploads to Drive</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('frontCam', { takePhotoFront: true }, 'Front Camera Capture')}
            disabled={loadingAction === 'frontCam'}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20"
          >
            {loadingAction === 'frontCam' ? <Loader2 className="w-4 h-4 animate-spin" /> : '📸 Take Front Photo'}
          </button>
        </div>

        {/* 3. Silent Rear Camera Snapshot */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Rear Camera Snapshot</h4>
              <p className="text-xs text-slate-400">Capture environment/surroundings photo</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('rearCam', { takePhotoRear: true }, 'Rear Camera Capture')}
            disabled={loadingAction === 'rearCam'}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
          >
            {loadingAction === 'rearCam' ? <Loader2 className="w-4 h-4 animate-spin" /> : '📸 Take Rear Photo'}
          </button>
        </div>

        {/* 4. Ambient Audio Recording */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Ambient Audio (15s)</h4>
              <p className="text-xs text-slate-400">Record mic audio & upload clip to Drive</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('audio', { recordAudio: true, audioDurationSeconds: 15 }, 'Ambient Audio Recording')}
            disabled={loadingAction === 'audio'}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
          >
            {loadingAction === 'audio' ? <Loader2 className="w-4 h-4 animate-spin" /> : '🎙️ Record 15s Audio'}
          </button>
        </div>

        {/* 5. Play Loud Siren Alarm */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Loud Siren Alarm</h4>
              <p className="text-xs text-slate-400">Rings phone on max volume (find phone)</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('alarm', { playAlarm: true }, 'Loud Siren Alarm')}
            disabled={loadingAction === 'alarm'}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-600/20"
          >
            {loadingAction === 'alarm' ? <Loader2 className="w-4 h-4 animate-spin" /> : '🔊 Sound Alarm'}
          </button>
        </div>

        {/* 6. Bedtime Schedule Lock */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isBedtime ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-800 text-slate-300'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Bedtime Lock Mode</h4>
              <p className="text-xs text-slate-400">Auto-lock apps during sleep hours</p>
            </div>
          </div>

          <button
            onClick={() => handleAction('bedtime', { bedtimeLock: !isBedtime }, isBedtime ? 'Disable Bedtime Mode' : 'Enable Bedtime Mode')}
            disabled={loadingAction === 'bedtime'}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isBedtime
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {loadingAction === 'bedtime' ? <Loader2 className="w-4 h-4 animate-spin" /> : isBedtime ? '🌙 Bedtime Active (Turn Off)' : '🌙 Activate Bedtime Lock'}
          </button>
        </div>

      </div>

    </div>
  );
}

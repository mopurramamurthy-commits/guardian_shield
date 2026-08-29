import React from 'react';
import { 
  Shield, 
  RefreshCw, 
  Smartphone, 
  Cloud, 
  Settings, 
  Volume2, 
  VolumeX, 
  Download,
  Bell,
  Clock
} from 'lucide-react';

export default function Navbar({
  isDemo,
  isRefreshing,
  onRefresh,
  onOpenSetup,
  onToggleSimulator,
  showSimulator,
  soundAlertsEnabled,
  onToggleSound,
  onExportReport,
  hasActiveSOS
}) {
  return (
    <header className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {hasActiveSOS && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">
                Guardian<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Shield</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                PRO 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>24/7 Real-Time Child Safety &amp; Control</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Cloud State Badge */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
            isDemo 
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300' 
              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
          }`}>
            <Cloud className="w-3.5 h-3.5" />
            <span>{isDemo ? 'Live Interactive Simulator' : 'Connected to Google Drive (24/7)'}</span>
          </div>

          {/* Sound Alert Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border text-xs transition-all ${
              soundAlertsEnabled
                ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-500'
            }`}
            title={soundAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
          >
            {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Export Report */}
          <button
            onClick={onExportReport}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title="Export Activity Summary Report"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Report</span>
          </button>

          {/* Interactive Test Simulator Toggle */}
          <button
            onClick={onToggleSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
              showSimulator
                ? 'bg-cyan-600 border-cyan-400 text-white shadow-cyan-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showSimulator ? 'Close Phone Simulator' : 'Phone Simulator'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Refresh sync from Google Drive"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Setup / Cloud Connect Modal Button */}
          <button
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 transition border border-cyan-400/30"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect Drive</span>
          </button>

        </div>

      </div>
    </header>
  );
}

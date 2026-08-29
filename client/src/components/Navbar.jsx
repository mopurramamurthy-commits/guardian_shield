import React from 'react';
import { Shield, RefreshCw, Smartphone, Cloud, Settings, AlertTriangle } from 'lucide-react';

export default function Navbar({
  isDemo,
  isRefreshing,
  onRefresh,
  onOpenSetup,
  onToggleSimulator,
  showSimulator,
  lastUpdated
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Guardian<span className="text-cyan-400">Shield</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Parent Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">24/7 Child Safety & Control</p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleSimulator}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                showSimulator
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSetup}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section: Cloud Status & Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          
          {/* Cloud State Badge */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 ${
            isDemo 
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300' 
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
          }`}>
            <Cloud className="w-3.5 h-3.5" />
            <span>{isDemo ? 'Interactive Simulator Mode' : 'Connected to Google Drive (24/7)'}</span>
          </div>

          {/* Interactive Device Simulator Toggle */}
          <button
            onClick={onToggleSimulator}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showSimulator
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showSimulator ? 'Close Simulator' : 'Test Device Simulator'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Setup / Cloud Connect Modal Button */}
          <button
            onClick={onOpenSetup}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Setup & Connect Drive</span>
          </button>
        </div>

      </div>
    </header>
  );
}

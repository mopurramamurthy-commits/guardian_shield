import React from 'react';
import { Smartphone, Ban, CheckCircle2, Clock, BarChart2, ShieldAlert, Lock, Unlock } from 'lucide-react';

export default function AppManagerTab({ apps, onToggleAppBlock }) {
  const {
    totalScreenTimeMinutes = 185,
    installedApps = [],
    blockedApps = []
  } = apps || {};

  const hours = Math.floor(totalScreenTimeMinutes / 60);
  const minutes = totalScreenTimeMinutes % 60;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      
      {/* Header & Screen Time Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            <span>App Controls & Screen Time Management</span>
          </h3>
          <p className="text-xs text-slate-400">Remotely block apps and enforce digital wellness limits</p>
        </div>

        {/* Screen Time Metric Pill */}
        <div className="bg-purple-950/40 border border-purple-800/80 rounded-xl px-4 py-2 flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-purple-300">Today's Screen Time</div>
            <div className="text-base font-bold text-white leading-tight">
              {hours}h {minutes}m
            </div>
          </div>
        </div>
      </div>

      {/* Installed Apps & Instant Blocker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Installed Apps & Remote Access
          </h4>
          <span className="text-xs text-slate-500">
            {installedApps.length} Apps Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {installedApps.map((app, idx) => {
            const isBlocked = app.isBlocked || blockedApps.includes(app.packageName);
            return (
              <div
                key={app.packageName || idx}
                className={`border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all ${
                  isBlocked
                    ? 'bg-rose-950/30 border-rose-800/80'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* App Info & Usage */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isBlocked
                      ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                    {(app.appName || 'A').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-100 truncate flex items-center gap-1.5">
                      <span>{app.appName}</span>
                      {isBlocked && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-900 text-rose-300 border border-rose-700">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{app.category || 'Utility'}</span>
                      {app.usageMinutes !== undefined && (
                        <span>• {app.usageMinutes}m used today</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instant Remote Block Toggle */}
                <button
                  onClick={() => onToggleAppBlock(app.packageName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition ${
                    isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-rose-600/20 hover:bg-rose-600 border border-rose-800 hover:border-rose-600 text-rose-300 hover:text-white'
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unblock</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Block App</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

import React from 'react';
import { AlertTriangle, ShieldAlert, Key, MapPin, Radio, Smartphone } from 'lucide-react';

export default function SafetyAlertsTab({ alerts = [] }) {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          badge: 'bg-rose-950/80 border-rose-700 text-rose-300',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
        };
      case 'WARNING':
        return {
          badge: 'bg-amber-950/80 border-amber-700 text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
        };
      default:
        return {
          badge: 'bg-cyan-950/80 border-cyan-700 text-cyan-300',
          icon: <AlertTriangle className="w-4 h-4 text-cyan-400" />
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Safety Alerts & Keyword Triggers</span>
          </h3>
          <p className="text-xs text-slate-400">Instant detections of sensitive words, geofence breaches, and SIM changes</p>
        </div>
        <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 font-semibold">
          {alerts.length} Total Alerts
        </span>
      </div>

      {/* Alerts Timeline */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No safety alerts recorded. All systems normal.
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id || idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {style.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${style.badge}`}>
                        {alert.severity || 'ALERT'}
                      </span>
                      <span className="font-semibold text-sm text-slate-200">{alert.type || 'System Alert'}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.message}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap shrink-0 mt-1">
                  {alert.timestamp}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

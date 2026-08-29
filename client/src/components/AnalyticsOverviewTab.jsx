import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Lock, 
  Camera, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AnalyticsOverviewTab({ data, onNavigateTab, onSendCommand }) {
  const {
    telemetry = {},
    calls = [],
    social = [],
    apps = {},
    alerts = []
  } = data || {};

  // Mock hourly screen time data for chart
  const screenTimeHourlyData = [
    { hour: '8 AM', minutes: 12 },
    { hour: '10 AM', minutes: 28 },
    { hour: '12 PM', minutes: 45 },
    { hour: '2 PM', minutes: 30 },
    { hour: '4 PM', minutes: 55 },
    { hour: '6 PM', minutes: 65 },
    { hour: '8 PM', minutes: 20 },
  ];

  // App Category Usage Data
  const appCategoryData = [
    { name: 'Social', minutes: 60, fill: '#10b981' },
    { name: 'Games', minutes: 55, fill: '#8b5cf6' },
    { name: 'Videos', minutes: 40, fill: '#ec4899' },
    { name: 'Study', minutes: 65, fill: '#06b6d4' },
  ];

  // Call Distribution
  const incomingCallsCount = calls.filter(c => c.callType === 'INCOMING').length || 3;
  const outgoingCallsCount = calls.filter(c => c.callType === 'OUTGOING').length || 2;
  const missedCallsCount = calls.filter(c => c.callType === 'MISSED' || c.callType === 'REJECTED').length || 1;

  const callPieData = [
    { name: 'Incoming', value: incomingCallsCount, color: '#10b981' },
    { name: 'Outgoing', value: outgoingCallsCount, color: '#06b6d4' },
    { name: 'Missed', value: missedCallsCount, color: '#f43f5e' }
  ];

  // Safety Score Calculation
  const safetyScore = Math.max(75, 100 - (alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length * 10));

  return (
    <div className="space-y-6">
      
      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Safety Score Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Child Safety Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{safetyScore}</span>
            <span className="text-xs text-slate-400">/ 100 Safe</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${safetyScore}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All geofences &amp; safety barriers active</span>
          </div>
        </div>

        {/* Total Screen Time */}
        <div 
          onClick={() => onNavigateTab('apps')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Screen Time</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {Math.floor((apps.totalScreenTimeMinutes || 215) / 60)}h {(apps.totalScreenTimeMinutes || 215) % 60}m
            </span>
            <span className="text-xs text-purple-400 font-medium">Daily Quota: 4h</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{apps.installedApps?.length || 7} Apps Monitored</span>
            <span className="text-cyan-400 hover:underline">View Breakdown &rarr;</span>
          </div>
        </div>

        {/* Social Messages */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Social &amp; Messages</span>
            <MessageCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{social.length}</span>
            <span className="text-xs text-slate-400">Messages Intercepted</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 flex items-center justify-between">
            <span>WhatsApp, Insta, Telegram</span>
            <span className="text-cyan-400 hover:underline">View Feed &rarr;</span>
          </div>
        </div>

        {/* Calls Logged */}
        <div 
          onClick={() => onNavigateTab('calls')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Call History</span>
            <Phone className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{calls.length}</span>
            <span className="text-xs text-slate-400">Calls Today</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{missedCallsCount} Missed • {incomingCallsCount} In • {outgoingCallsCount} Out</span>
            <span className="text-cyan-400 hover:underline">View Logs &rarr;</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Screen Time Usage Curve (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Screen Time Activity Curve</span>
              </h3>
              <p className="text-xs text-slate-400">Active phone usage distribution across today</p>
            </div>
            <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
              Today
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={screenTimeHourlyData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* App Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Category Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">Minutes</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appCategoryData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={12} width={65} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" radius={[0, 8, 8, 0]}>
                  {appCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Quick Action Dock & Live Safety Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Surveillance Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Instant Remote Controls</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => onSendCommand({ lockDevice: !telemetry.isLocked })}
              className={`p-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 border ${
                telemetry.isLocked
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-700 text-rose-300 hover:bg-rose-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{telemetry.isLocked ? 'Unlock Screen' : 'Lock Phone'}</span>
            </button>

            <button
              onClick={() => onSendCommand({ takePhotoFront: true })}
              className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Front Snapshot</span>
            </button>

            <button
              onClick={() => onSendCommand({ playAlarm: true })}
              className="p-3 rounded-xl bg-amber-950/60 border border-amber-700 text-amber-300 hover:bg-amber-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Ring Siren</span>
            </button>

            <button
              onClick={() => onNavigateTab('remote')}
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>More Controls &rarr;</span>
            </button>
          </div>
        </div>

        {/* Live Activity & Alerts Stream */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity Stream</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Stream</span>
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto pr-1 text-xs">
            {social.slice(0, 3).map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-200 shrink-0">{s.sender}:</span>
                  <span className="text-slate-400 truncate">{s.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">{s.timestamp}</span>
              </div>
            ))}

            {calls.slice(0, 2).map((c, idx) => (
              <div key={`call-${idx}`} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span className="font-bold text-slate-200 shrink-0">Call ({c.callType}):</span>
                  <span className="text-slate-400 truncate">{c.name} ({c.phoneNumber})</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">{c.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

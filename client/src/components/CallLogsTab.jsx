import React, { useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Clock, User, Filter } from 'lucide-react';

export default function CallLogsTab({ calls = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      (call.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.phoneNumber || '').includes(searchTerm);
    
    if (filterType === 'ALL') return matchesSearch;
    return matchesSearch && call.callType === filterType;
  });

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0s (Missed)';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const getCallBadge = (type) => {
    switch (type) {
      case 'INCOMING':
        return {
          icon: <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Incoming',
          color: 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
        };
      case 'OUTGOING':
        return {
          icon: <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Outgoing',
          color: 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
        };
      case 'MISSED':
      case 'REJECTED':
        return {
          icon: <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Missed Call',
          color: 'bg-rose-950/60 border-rose-800 text-rose-300'
        };
      default:
        return {
          icon: <Phone className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Unknown',
          color: 'bg-slate-800 border-slate-700 text-slate-300'
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Phone className="w-5 h-5 text-cyan-400" />
            <span>Call History & Logs</span>
          </h3>
          <p className="text-xs text-slate-400">Synchronized directly from child device</p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'ALL', label: `All Calls (${calls.length})` },
          { key: 'INCOMING', label: 'Incoming' },
          { key: 'OUTGOING', label: 'Outgoing' },
          { key: 'MISSED', label: 'Missed' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === tab.key
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calls List */}
      <div className="divide-y divide-slate-800/80 max-h-[480px] overflow-y-auto pr-1">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No call records matching your search.
          </div>
        ) : (
          filteredCalls.map((call, idx) => {
            const badge = getCallBadge(call.callType);
            return (
              <div key={call.id || idx} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition">
                
                {/* Contact Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-sm shadow">
                    {(call.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <span>{call.name || 'Unknown Contact'}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {call.phoneNumber}
                    </div>
                  </div>
                </div>

                {/* Call Badge & Duration */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>

                  <div className="text-xs text-slate-400">
                    <div className="font-medium text-slate-300">{formatDuration(call.durationSeconds)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{call.timestamp}</div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

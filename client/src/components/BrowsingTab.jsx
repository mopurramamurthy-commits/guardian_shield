import React, { useState } from 'react';
import { Globe, Search, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export default function BrowsingTab({ browsing = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = browsing.filter(item => 
    (item.url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            <span>Web Browsing History</span>
          </h3>
          <p className="text-xs text-slate-400">Captured live from Google Chrome and web browsers</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search domain or website..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* History List */}
      <div className="divide-y divide-slate-800/80 max-h-[480px] overflow-y-auto pr-1">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No browsing history records found.
          </div>
        ) : (
          filteredHistory.map((item, idx) => (
            <div
              key={item.id || idx}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-200 truncate">
                    {item.title || item.url}
                  </div>
                  <div className="text-xs text-sky-400 font-mono truncate mt-0.5 max-w-lg">
                    {item.url}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-mono block">{item.timestamp}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 mt-1 inline-block">
                  {item.browser || 'Chrome'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

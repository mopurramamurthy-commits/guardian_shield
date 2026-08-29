import React, { useState } from 'react';
import { Camera, Mic, Image, Play, Pause, Download, ExternalLink, Calendar } from 'lucide-react';

export default function MediaVaultTab({ photos = [], audio = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('photos');
  const [previewImage, setPreviewImage] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const toggleAudioPlay = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Image className="w-5 h-5 text-cyan-400" />
            <span>Google Drive Media Vault</span>
          </h3>
          <p className="text-xs text-slate-400">Captured camera photos and ambient recordings stored securely in your Drive</p>
        </div>

        {/* Sub-tab selection */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('photos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'photos'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({photos.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'audio'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Audio Clips ({audio.length})</span>
          </button>
        </div>
      </div>

      {/* SubTab 1: Photos Grid */}
      {activeSubTab === 'photos' && (
        <div>
          {photos.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No photos captured yet. Use the "Take Front/Rear Photo" button in Remote Controls.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition shadow-md"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-36 object-cover cursor-pointer group-hover:scale-105 transition duration-300"
                    onClick={() => setPreviewImage(photo)}
                  />
                  <div className="p-2.5 bg-slate-950/90 text-xs">
                    <div className="font-medium text-slate-200 truncate">{photo.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Audio Clips List */}
      {activeSubTab === 'audio' && (
        <div className="space-y-3">
          {audio.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No audio recordings captured yet. Use "Record 15s Audio" in Remote Controls.
            </div>
          ) : (
            audio.map((clip, idx) => (
              <div
                key={clip.id || idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAudioPlay(clip.id || idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${
                      playingAudioId === (clip.id || idx)
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-purple-950/60 border border-purple-800 text-purple-400 hover:bg-purple-900'
                    }`}
                  >
                    {playingAudioId === (clip.id || idx) ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div>
                    <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <span>{clip.name}</span>
                      {playingAudioId === (clip.id || idx) && (
                        <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.2 rounded-full font-bold">
                          PLAYING
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Recorded: {clip.created} • ~{(clip.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>

                <a
                  href={clip.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Open file in Google Drive"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Image Modal Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-200">{previewImage.name}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="w-full max-h-[70vh] object-contain rounded-xl bg-black"
            />
            <div className="text-xs text-slate-400 text-right">
              Recorded: {previewImage.created}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

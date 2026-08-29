import React, { useState } from 'react';
import { X, Copy, Check, Cloud, Smartphone, Shield, ExternalLink, Key } from 'lucide-react';
import { driveService } from '../services/driveService';

export default function SetupGuideModal({ onClose, onSaved }) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('gs_script_url') || '');
  const [authToken, setAuthToken] = useState(localStorage.getItem('gs_auth_token') || 'GUARDIAN_SECURE_TOKEN_98234');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    driveService.setCredentials(scriptUrl, authToken);
    setSaveSuccess(true);
    setTimeout(() => {
      onSaved();
      onClose();
    }, 800);
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText(`// Copy content from backend/GoogleDriveBridge.js in the project repository`);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Google Drive 24/7 Cloud & APK Setup Guide
              </h3>
              <p className="text-xs text-slate-400">Follow these simple steps to connect your private Google Drive and Android APK</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Accordion / Guide */}
        <div className="space-y-4 text-xs">
          
          {/* STEP 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">1</span>
                <span>Deploy Free Google Apps Script (24/7 Cloud)</span>
              </div>
              <a
                href="https://script.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open Google Apps Script</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
              <li>Go to <strong className="text-slate-100">script.google.com</strong> and click <strong className="text-slate-100">+ New project</strong>.</li>
              <li>Paste the code from <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">backend/GoogleDriveBridge.js</code> into <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">Code.gs</code>.</li>
              <li>Click <strong className="text-slate-100">Deploy &gt; New deployment</strong>.</li>
              <li>Select Type: <strong className="text-slate-100">Web app</strong>. Set Execute as: <strong className="text-slate-100">Me</strong>, Who has access: <strong className="text-slate-100">Anyone</strong>.</li>
              <li>Click <strong className="text-slate-100">Deploy</strong>, authorize permissions, and copy the generated <strong className="text-cyan-300">Web App URL</strong>.</li>
            </ol>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">2</span>
              <span>Connect Parent Dashboard to your Google Drive</span>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Google Apps Script Web App URL:</label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Secret Authentication Token:</label>
              <input
                type="text"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
              <span>{saveSuccess ? 'Credentials Saved & Connected!' : 'Save & Connect to Google Drive'}</span>
            </button>
          </div>

          {/* STEP 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">3</span>
              <span>Build & Install Child Android APK</span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Open the <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">android-app/</code> folder in Android Studio and build the APK (<strong className="text-slate-100">Build &gt; Build APK(s)</strong>), or run:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-slate-300 text-[11px] border border-slate-800">
              cd android-app &amp;&amp; ./gradlew assembleDebug
            </div>
            <p className="text-slate-400 text-[11px]">
              * After installing on the child's phone, tap <strong>"Activate Protection &amp; Hide Icon"</strong> to initiate background sync and vanish from the app drawer.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Smartphone, 
  ShieldAlert, 
  Image, 
  AlertTriangle, 
  Globe, 
  Activity,
  CheckCircle2
} from 'lucide-react';

import Navbar from './components/Navbar';
import TelemetryHeader from './components/TelemetryHeader';
import LiveMap from './components/LiveMap';
import CallLogsTab from './components/CallLogsTab';
import SocialFeedTab from './components/SocialFeedTab';
import AppManagerTab from './components/AppManagerTab';
import RemoteControlsTab from './components/RemoteControlsTab';
import MediaVaultTab from './components/MediaVaultTab';
import SafetyAlertsTab from './components/SafetyAlertsTab';
import BrowsingTab from './components/BrowsingTab';
import DeviceSimulator from './components/DeviceSimulator';
import SetupGuideModal from './components/SetupGuideModal';

import { driveService, INITIAL_DEMO_DATA } from './services/driveService';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [data, setData] = useState(INITIAL_DEMO_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const fullData = await driveService.fetchAll();
      setData(fullData);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto poll Google Drive or local simulator every 8 seconds
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCommand = async (commandPayload) => {
    await driveService.sendCommand(commandPayload);
    await fetchData();
  };

  const handleToggleAppBlock = async (packageName) => {
    await driveService.toggleAppBlock(packageName);
    await fetchData();
  };

  const handleQuickLockToggle = async (shouldLock) => {
    await handleSendCommand({ lockDevice: shouldLock });
  };

  const tabs = [
    { id: 'map', label: 'Live GPS Map', icon: <MapPin className="w-4 h-4" />, count: null },
    { id: 'calls', label: 'Call Logs', icon: <Phone className="w-4 h-4" />, count: data.calls?.length },
    { id: 'social', label: 'Social & Chats', icon: <MessageCircle className="w-4 h-4" />, count: data.social?.length },
    { id: 'apps', label: 'App Controls', icon: <Smartphone className="w-4 h-4" />, count: data.apps?.installedApps?.length },
    { id: 'remote', label: 'Remote Actions', icon: <ShieldAlert className="w-4 h-4" />, count: null },
    { id: 'media', label: 'Media Vault', icon: <Image className="w-4 h-4" />, count: (data.photos?.length || 0) + (data.audio?.length || 0) },
    { id: 'alerts', label: 'Safety Alerts', icon: <AlertTriangle className="w-4 h-4" />, count: data.alerts?.length },
    { id: 'browsing', label: 'Web History', icon: <Globe className="w-4 h-4" />, count: data.browsing?.length }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        isDemo={driveService.isDemo}
        isRefreshing={isRefreshing}
        onRefresh={fetchData}
        onOpenSetup={() => setShowSetupModal(true)}
        onToggleSimulator={() => setShowSimulator(!showSimulator)}
        showSimulator={showSimulator}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1 space-y-6">
        
        {/* Interactive Device Simulator Drawer */}
        {showSimulator && (
          <DeviceSimulator
            telemetry={data.telemetry}
            onClose={() => setShowSimulator(false)}
            onDataUpdated={fetchData}
          />
        )}

        {/* Real-time Telemetry Status Bar */}
        <TelemetryHeader
          telemetry={data.telemetry}
          onQuickLockToggle={handleQuickLockToggle}
        />

        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 border border-cyan-400/40'
                  : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-cyan-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Tab View */}
        <div className="transition-all duration-200">
          {activeTab === 'map' && <LiveMap telemetry={data.telemetry} />}
          {activeTab === 'calls' && <CallLogsTab calls={data.calls} />}
          {activeTab === 'social' && <SocialFeedTab social={data.social} />}
          {activeTab === 'apps' && (
            <AppManagerTab
              apps={data.apps}
              onToggleAppBlock={handleToggleAppBlock}
            />
          )}
          {activeTab === 'remote' && (
            <RemoteControlsTab
              commands={data.commands}
              telemetry={data.telemetry}
              onSendCommand={handleSendCommand}
            />
          )}
          {activeTab === 'media' && (
            <MediaVaultTab
              photos={data.photos}
              audio={data.audio}
            />
          )}
          {activeTab === 'alerts' && <SafetyAlertsTab alerts={data.alerts} />}
          {activeTab === 'browsing' && <BrowsingTab browsing={data.browsing} />}
        </div>

      </main>

      {/* Setup Guide & Cloud Connect Modal */}
      {showSetupModal && (
        <SetupGuideModal
          onClose={() => setShowSetupModal(false)}
          onSaved={fetchData}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        GuardianShield Parental Control Platform • 100% Free &amp; Private Google Drive Cloud Integration
      </footer>

    </div>
  );
}

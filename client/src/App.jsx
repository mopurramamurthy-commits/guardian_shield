import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Smartphone, 
  ShieldAlert, 
  Image, 
  AlertTriangle, 
  Globe, 
  Activity,
  CheckCircle2,
  AlertOctagon,
  X
} from 'lucide-react';

import Navbar from './components/Navbar';
import TelemetryHeader from './components/TelemetryHeader';
import AnalyticsOverviewTab from './components/AnalyticsOverviewTab';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(INITIAL_DEMO_DATA);
  const [activeDeviceId, setActiveDeviceId] = useState(driveService.activeDeviceId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
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
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [activeDeviceId]);

  const handleSelectDevice = (deviceId) => {
    setActiveDeviceId(deviceId);
    driveService.setActiveDevice(deviceId);
    fetchData();
  };

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

  const activeSOSAlert = data.alerts?.find(a => a.type === 'EMERGENCY_SOS');

  const handleExportReport = () => {
    const reportData = {
      exportTimestamp: new Date().toISOString(),
      activeDeviceId: activeDeviceId,
      childTelemetry: data.telemetry,
      dailyScreenTimeMinutes: data.apps?.totalScreenTimeMinutes,
      installedApps: data.apps?.installedApps,
      callHistoryCount: data.calls?.length,
      calls: data.calls,
      socialMessagesCaptured: data.social?.length,
      socialMessages: data.social,
      safetyAlerts: data.alerts,
      webBrowsingHistory: data.browsing
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GuardianShield_${activeDeviceId}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, count: null },
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
      
      {/* Top Navbar with Multi-Device Switcher */}
      <Navbar
        devices={data.devices || []}
        activeDeviceId={activeDeviceId}
        onSelectDevice={handleSelectDevice}
        isDemo={driveService.isDemo}
        isRefreshing={isRefreshing}
        onRefresh={fetchData}
        onOpenSetup={() => setShowSetupModal(true)}
        onToggleSimulator={() => setShowSimulator(!showSimulator)}
        showSimulator={showSimulator}
        soundAlertsEnabled={soundAlertsEnabled}
        onToggleSound={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
        onExportReport={handleExportReport}
        hasActiveSOS={!!activeSOSAlert}
      />

      {/* Emergency SOS Banner */}
      {activeSOSAlert && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-4 py-3 shadow-2xl flex items-center justify-between animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center gap-3 w-full">
            <AlertOctagon className="w-6 h-6 shrink-0 animate-bounce" />
            <div className="flex-1">
              <span className="font-extrabold text-sm uppercase tracking-wider">CRITICAL EMERGENCY SOS ALERT!</span>
              <p className="text-xs opacity-90">{activeSOSAlert.message} ({activeDeviceId})</p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="px-3.5 py-1.5 rounded-lg bg-white text-rose-700 font-bold text-xs shadow-md hover:bg-rose-50 transition shrink-0"
            >
              View Live GPS Pin &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1 space-y-6">
        
        {/* Phone Hardware Simulator */}
        {showSimulator && (
          <DeviceSimulator
            telemetry={data.telemetry}
            onClose={() => setShowSimulator(false)}
            onDataUpdated={fetchData}
          />
        )}

        {/* Real-time Telemetry Status Header */}
        <TelemetryHeader
          telemetry={data.telemetry}
          onQuickLockToggle={handleQuickLockToggle}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-cyan-900 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Router Tab View */}
        <div className="transition-all duration-200">
          {activeTab === 'overview' && (
            <AnalyticsOverviewTab
              data={data}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSendCommand={handleSendCommand}
            />
          )}
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

      {/* Setup Guide Modal */}
      {showSetupModal && (
        <SetupGuideModal
          onClose={() => setShowSetupModal(false)}
          onSaved={fetchData}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 w-full gap-2">
        <div>
          GuardianShield Parental Control • 1 Google Drive &amp; 1 Website for Multiple Devices
        </div>
        <div className="text-slate-600">
          Active Device: <strong className="text-slate-400">{activeDeviceId}</strong> • Last Synced: {lastUpdated.toLocaleTimeString()}
        </div>
      </footer>

    </div>
  );
}

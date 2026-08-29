import { DEFAULT_CONFIG } from '../config';

export const INITIAL_DEMO_DATA = {
  devices: [
    { deviceId: "device_leo_s22", deviceName: "Leo's Galaxy S22", deviceModel: "Samsung Galaxy S22", battery: 84, online: true, lastSeen: new Date().toISOString() },
    { deviceId: "device_emma_tab", deviceName: "Emma's Pixel Tablet", deviceModel: "Google Pixel Tablet", battery: 92, online: true, lastSeen: new Date().toISOString() }
  ],
  activeDeviceId: "device_leo_s22",
  telemetry: {
    deviceId: "device_leo_s22",
    battery: 84,
    charging: false,
    online: true,
    network: "Wi-Fi",
    wifiSsid: "Home_5G_Network",
    latitude: 37.774929,
    longitude: -122.419418,
    speed: 0,
    address: "750 Market St, San Francisco, CA",
    lastSeen: new Date().toISOString(),
    currentApp: "com.whatsapp",
    currentAppName: "WhatsApp",
    isLocked: false,
    simOperator: "T-Mobile 5G",
    simSerial: "89014103211118510720",
    deviceModel: "Samsung Galaxy S22"
  },
  calls: [
    { id: "call_1", name: "Alex (Best Friend)", phoneNumber: "+1 (555) 234-8901", callType: "INCOMING", durationSeconds: 245, timestamp: "Today, 10:45 AM" },
    { id: "call_2", name: "Math Tutor", phoneNumber: "+1 (555) 987-6543", callType: "OUTGOING", durationSeconds: 612, timestamp: "Today, 09:15 AM" },
    { id: "call_3", name: "Unknown Caller", phoneNumber: "+1 (800) 555-0199", callType: "MISSED", durationSeconds: 0, timestamp: "Yesterday, 07:30 PM" }
  ],
  social: [
    { id: "soc_1", appName: "WhatsApp", sender: "Alex (Classmate)", message: "Are you coming to the park after math class?", timestamp: "10:48 AM", packageName: "com.whatsapp" },
    { id: "soc_2", appName: "Instagram", sender: "emily_skates", message: "Liked your story: 'Weekend skate session' 🛹", timestamp: "10:12 AM", packageName: "com.instagram.android" },
    { id: "soc_3", appName: "Telegram", sender: "Gaming Squad", message: "Leo: hopped on Discord for Minecraft server", timestamp: "09:35 AM", packageName: "org.telegram.messenger" }
  ],
  apps: {
    totalScreenTimeMinutes: 215,
    installedApps: [
      { packageName: "com.whatsapp", appName: "WhatsApp", category: "Social", usageMinutes: 45, isBlocked: false },
      { packageName: "com.zhiliaoapp.musically", appName: "TikTok", category: "Entertainment", usageMinutes: 70, isBlocked: false },
      { packageName: "com.roblox.client", appName: "Roblox", category: "Games", usageMinutes: 55, isBlocked: false },
      { packageName: "com.google.android.youtube", appName: "YouTube", category: "Entertainment", usageMinutes: 30, isBlocked: false },
      { packageName: "com.duolingo", appName: "Duolingo", category: "Education", usageMinutes: 25, isBlocked: false }
    ],
    blockedApps: []
  },
  alerts: [
    { id: "alt_1", type: "GEOFENCE_ENTER", severity: "INFO", message: "Child arrived safely inside 'School Safe Zone'", timestamp: "Today, 08:15 AM" }
  ],
  browsing: [
    { id: "br_1", url: "https://khanacademy.org/math", title: "Algebra Basics | Khan Academy", browser: "Chrome", timestamp: "Today, 09:40 AM" }
  ],
  commands: {
    lockDevice: false,
    takePhotoFront: false,
    takePhotoRear: false,
    recordAudio: false,
    audioDurationSeconds: 15,
    playAlarm: false,
    blockedApps: [],
    bedtimeLock: false,
    lastUpdated: new Date().toISOString()
  },
  photos: [
    { id: "p1", name: "snap_front_20260829_103000.jpg", created: "Today, 10:30 AM", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60" }
  ],
  audio: [
    { id: "a1", name: "ambient_record_104500.m4a", created: "Today, 10:45 AM", size: 184500, url: "#" }
  ]
};

class DriveService {
  constructor() {
    this.scriptUrl = localStorage.getItem('gs_script_url') || DEFAULT_CONFIG.scriptUrl;
    this.authToken = localStorage.getItem('gs_auth_token') || DEFAULT_CONFIG.authToken;
    this.activeDeviceId = localStorage.getItem('gs_active_device_id') || 'device_leo_s22';
    this.isDemo = false;

    const saved = localStorage.getItem('gs_local_simulator_data');
    this.localState = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }

  saveLocal() {
    localStorage.setItem('gs_local_simulator_data', JSON.stringify(this.localState));
  }

  setActiveDevice(deviceId) {
    this.activeDeviceId = deviceId;
    localStorage.setItem('gs_active_device_id', deviceId);
    this.localState.activeDeviceId = deviceId;
    this.saveLocal();
  }

  setCredentials(url, token) {
    this.scriptUrl = url.trim();
    this.authToken = token.trim() || 'GUARDIAN_SECURE_TOKEN_98234';
    this.isDemo = !this.scriptUrl;
    localStorage.setItem('gs_script_url', this.scriptUrl);
    localStorage.setItem('gs_auth_token', this.authToken);
  }

  async fetchAll() {
    if (this.isDemo || !this.scriptUrl) {
      return this.localState;
    }

    try {
      const response = await fetch(`${this.scriptUrl}?token=${encodeURIComponent(this.authToken)}&action=all&deviceId=${encodeURIComponent(this.activeDeviceId)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const json = await response.json();
      if (json.status === 'success' && json.data) {
        return {
          ...this.localState,
          ...json.data
        };
      }
      return this.localState;
    } catch (e) {
      console.warn('Google Drive fetch error:', e);
      return this.localState;
    }
  }

  async sendCommand(commandPayload) {
    this.localState.commands = {
      ...this.localState.commands,
      ...commandPayload,
      lastUpdated: new Date().toISOString()
    };

    if (commandPayload.lockDevice !== undefined) {
      this.localState.telemetry.isLocked = commandPayload.lockDevice;
    }

    this.saveLocal();

    if (!this.isDemo && this.scriptUrl) {
      try {
        await fetch(this.scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            token: this.authToken,
            deviceId: this.activeDeviceId,
            action: 'set_commands',
            data: commandPayload
          })
        });
      } catch (e) {
        console.error('Failed to dispatch command to Google Drive:', e);
      }
    }

    return this.localState.commands;
  }

  async toggleAppBlock(packageName) {
    const apps = this.localState.apps.installedApps;
    const target = apps.find(a => a.packageName === packageName);
    if (target) {
      target.isBlocked = !target.isBlocked;
    }

    const blockedList = apps.filter(a => a.isBlocked).map(a => a.packageName);
    this.localState.apps.blockedApps = blockedList;
    this.saveLocal();

    return this.sendCommand({ blockedApps: blockedList });
  }

  simulateNewCall(name, number, type, duration) {
    const newCall = {
      id: `call_${Date.now()}`,
      name: name || number,
      phoneNumber: number,
      callType: type,
      durationSeconds: parseInt(duration) || 0,
      timestamp: "Just now"
    };
    this.localState.calls.unshift(newCall);
    this.saveLocal();
    return this.localState.calls;
  }

  simulateNewSocialMessage(appName, sender, message, pkg) {
    const newMsg = {
      id: `soc_${Date.now()}`,
      appName: appName,
      sender: sender,
      message: message,
      timestamp: "Just now",
      packageName: pkg || 'com.whatsapp'
    };
    this.localState.social.unshift(newMsg);
    this.saveLocal();
    return this.localState.social;
  }

  simulateLocationUpdate(lat, lng, address) {
    this.localState.telemetry.latitude = lat;
    this.localState.telemetry.longitude = lng;
    if (address) this.localState.telemetry.address = address;
    this.localState.telemetry.lastSeen = new Date().toISOString();
    this.saveLocal();
    return this.localState.telemetry;
  }
}

export const driveService = new DriveService();

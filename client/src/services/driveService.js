import { DEFAULT_CONFIG } from '../config';

// Initial Mock / Demo Data for instant interactive preview
export const INITIAL_DEMO_DATA = {
  telemetry: {
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
    { id: "call_3", name: "Unknown Caller", phoneNumber: "+1 (800) 555-0199", callType: "MISSED", durationSeconds: 0, timestamp: "Yesterday, 07:30 PM" },
    { id: "call_4", name: "Grandma", phoneNumber: "+1 (555) 345-6789", callType: "INCOMING", durationSeconds: 840, timestamp: "Yesterday, 04:20 PM" },
    { id: "call_5", name: "Soccer Coach", phoneNumber: "+1 (555) 678-1234", callType: "OUTGOING", durationSeconds: 120, timestamp: "2 days ago, 03:00 PM" }
  ],
  social: [
    { id: "soc_1", appName: "WhatsApp", sender: "Alex (Classmate)", message: "Are you coming to the park after math class?", timestamp: "10:48 AM", packageName: "com.whatsapp" },
    { id: "soc_2", appName: "Instagram", sender: "emily_skates", message: "Liked your story: 'Weekend skate session' 🛹", timestamp: "10:12 AM", packageName: "com.instagram.android" },
    { id: "soc_3", appName: "Telegram", sender: "Gaming Squad (Group)", message: "Leo: hopped on Discord for Minecraft server", timestamp: "09:35 AM", packageName: "org.telegram.messenger" },
    { id: "soc_4", appName: "SMS Messages", sender: "+1 (555) 890-1234", message: "Your verification code for Discord is 482910", timestamp: "Yesterday, 08:15 PM", packageName: "com.google.android.apps.messaging" },
    { id: "soc_5", appName: "TikTok", sender: "TikTok Notifications", message: "Trending video: 'Top 10 Minecraft speedrun tricks'", timestamp: "Yesterday, 05:40 PM", packageName: "com.zhiliaoapp.musically" },
    { id: "soc_6", appName: "Snapchat", sender: "Jake_R", message: "Sent you a new snap 📸", timestamp: "Yesterday, 02:10 PM", packageName: "com.snapchat.android" }
  ],
  apps: {
    totalScreenTimeMinutes: 215,
    installedApps: [
      { packageName: "com.whatsapp", appName: "WhatsApp", category: "Social", usageMinutes: 45, isBlocked: false },
      { packageName: "com.zhiliaoapp.musically", appName: "TikTok", category: "Entertainment", usageMinutes: 70, isBlocked: false },
      { packageName: "com.roblox.client", appName: "Roblox", category: "Games", usageMinutes: 55, isBlocked: false },
      { packageName: "com.google.android.youtube", appName: "YouTube", category: "Entertainment", usageMinutes: 30, isBlocked: false },
      { packageName: "com.instagram.android", appName: "Instagram", category: "Social", usageMinutes: 15, isBlocked: false },
      { packageName: "com.duolingo", appName: "Duolingo (Spanish)", category: "Education", usageMinutes: 25, isBlocked: false },
      { packageName: "com.google.android.apps.classroom", appName: "Google Classroom", category: "Education", usageMinutes: 40, isBlocked: false }
    ],
    blockedApps: []
  },
  alerts: [
    { id: "alt_1", type: "GEOFENCE_ENTER", severity: "INFO", message: "Child arrived safely inside 'School Safe Zone'", timestamp: "Today, 08:15 AM" },
    { id: "alt_2", type: "LOW_BATTERY", severity: "WARNING", message: "Battery dropped below 20% (currently 18%)", timestamp: "Yesterday, 09:40 PM" },
    { id: "alt_3", type: "KEYWORD_ALERT", severity: "HIGH", message: "Sensitive keyword flagged: 'meet me secret' in WhatsApp chat", timestamp: "2 days ago, 06:15 PM" }
  ],
  browsing: [
    { id: "br_1", url: "https://khanacademy.org/math/algebra", title: "Algebra Basics | Khan Academy", browser: "Chrome", timestamp: "Today, 09:40 AM" },
    { id: "br_2", url: "https://wikipedia.org/wiki/Solar_System", title: "Solar System - Wikipedia", browser: "Chrome", timestamp: "Today, 09:22 AM" },
    { id: "br_3", url: "https://minecraft.wiki/w/Redstone", title: "Redstone Circuit Guide - Minecraft Wiki", browser: "Chrome", timestamp: "Yesterday, 08:50 PM" },
    { id: "br_4", url: "https://youtube.com/watch?v=science_demo", title: "Physics Lab Experiment - YouTube", browser: "Chrome", timestamp: "Yesterday, 04:15 PM" }
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
    { id: "p1", name: "snap_front_20260829_103000.jpg", created: "Today, 10:30 AM", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60" },
    { id: "p2", name: "snap_rear_20260829_091500.jpg", created: "Today, 09:15 AM", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60" },
    { id: "p3", name: "snap_front_20260828_184500.jpg", created: "Yesterday, 06:45 PM", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60" }
  ],
  audio: [
    { id: "a1", name: "ambient_record_104500.m4a", created: "Today, 10:45 AM", size: 184500, url: "#" },
    { id: "a2", name: "ambient_record_091200.m4a", created: "Today, 09:12 AM", size: 165200, url: "#" }
  ]
};

class DriveService {
  constructor() {
    this.scriptUrl = localStorage.getItem('gs_script_url') || '';
    this.authToken = localStorage.getItem('gs_auth_token') || 'GUARDIAN_SECURE_TOKEN_98234';
    this.isDemo = !this.scriptUrl;

    // Load persisted local simulator data or defaults
    const saved = localStorage.getItem('gs_local_simulator_data');
    this.localState = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }

  saveLocal() {
    localStorage.setItem('gs_local_simulator_data', JSON.stringify(this.localState));
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
      const response = await fetch(`${this.scriptUrl}?token=${encodeURIComponent(this.authToken)}&action=all`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const json = await response.json();
      if (json.status === 'success' && json.data) {
        // Merge with local structure to ensure fallbacks
        return {
          ...this.localState,
          ...json.data
        };
      }
      return this.localState;
    } catch (e) {
      console.warn('Could not fetch from Google Drive, using local state:', e);
      return this.localState;
    }
  }

  async sendCommand(commandPayload) {
    // Update local state immediately for responsive UI
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

  // Simulation helpers for interactive preview & testing
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

  simulateBatteryChange(battery, isCharging) {
    this.localState.telemetry.battery = battery;
    this.localState.telemetry.charging = isCharging;
    this.saveLocal();
    return this.localState.telemetry;
  }
}

export const driveService = new DriveService();

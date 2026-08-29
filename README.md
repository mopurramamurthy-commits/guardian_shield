# 🛡️ GuardianShield - Child Monitoring & Parental Control Platform

> A 100% Free, Private, Serverless Parental Control and Safety Solution using **Google Drive** as the 24/7 cloud backend. **No server maintenance, zero monthly fees, and no need to keep your laptop powered on.**

---

## 🌟 Key Features

### 1. ☁️ 24/7 Serverless Cloud (Google Drive)
- **Zero Cost**: Uses your free 15 GB Google Drive storage.
- **Laptop-Free Operation**: Google Apps Script operates 24/7 on Google's cloud. Open the Parent Dashboard on your smartphone browser anytime.
- **100% Privacy**: All logs, call history, location coordinates, and camera snapshots stay in your private Google account.

### 2. 📱 Android Stealth Companion (`.apk`)
- **Hidden Icon**: Icon disappears from the app drawer after setup.
- **Auto-Boot**: Automatically starts upon phone reboot (`RECEIVE_BOOT_COMPLETED`).
- **Tamper Shield**: Android Device Administrator & Accessibility Service prevent uninstallation.
- **Battery Optimization Bypass**: Runs silently in background without being killed.

### 3. 📍 Live GPS Tracking & Geofencing
- Real-time location marker on OpenStreetMap.
- Speed, altitude, and reverse geocoded address.
- Breadcrumb route history of everywhere the child went today.
- Safe Zones (Home, School, Park) with automatic entry/exit alerts.

### 4. 📞 Call Logs & Contact History
- Full incoming, outgoing, and missed call logs.
- Contact names, phone numbers, timestamps, and call durations.

### 5. 💬 Social Media & Chat Notifications
- Intercepts incoming chats and notifications from **WhatsApp, Instagram, Telegram, SMS, Snapchat, TikTok, YouTube, Discord**.
- Shows sender names, message previews, and timestamps.

### 6. ⚠️ Sensitive Keyword & Bullying Shield
- Monitors typed text and searches across all apps.
- Flags dangerous words (`help me`, `emergency`, `suicide`, `drugs`, `secret`) and triggers instant high-priority alerts.

### 7. 📸 Remote Surveillance & Controls
- **Remote Front / Rear Camera**: Silently capture a photo and upload directly to Google Drive `photos/`.
- **Remote Ambient Audio**: Silently record 15s/30s ambient mic clips and upload to Google Drive `audio/`.
- **Remote Screen Lock / Unlock**: Instant device lock with custom message.
- **Loud Siren Alarm**: Ring phone at full volume to locate it even if on silent.
- **App Blocker**: 1-click remote block for any installed app (e.g. Roblox, TikTok).

---

## 📁 Project Architecture

```
cs_app/
├── backend/
│   └── GoogleDriveBridge.js        # Google Apps Script 24/7 Cloud Backend
├── android-app/                    # Native Android Studio Project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml # Permissions, Stealth alias, Services
│   │   │   ├── res/                # Device admin & Accessibility configs
│   │   │   └── java/com/guardianshield/app/
│   │   │       ├── MainActivity.kt               # Setup Wizard & Icon Hider
│   │   │       ├── config/AppConfig.kt            # Webhook URL & Auth Token
│   │   │       ├── services/
│   │   │       │   ├── MonitoringForegroundService.kt
│   │   │       │   ├── GuardianNotificationListener.kt
│   │   │       │   └── GuardianAccessibilityService.kt
│   │   │       ├── workers/
│   │   │       │   ├── TelemetryWorker.kt (GPS, Battery)
│   │   │       │   ├── CallLogWorker.kt
│   │   │       │   ├── CameraWorker.kt (Silent Photo)
│   │   │       │   ├── AudioRecordWorker.kt (Silent Mic)
│   │   │       │   └── CommandSyncWorker.kt
│   │   │       └── receivers/
│   │   │           ├── GuardianDeviceAdminReceiver.kt
│   │   │           ├── GuardianBootReceiver.kt
│   │   │           └── SimStateReceiver.kt
├── client/                         # Modern React Parent Dashboard & Live Simulator
│   ├── src/
│   │   ├── components/             # Map, Calls, Social, Remote Controls, Media Vault
│   │   ├── services/driveService.js# Google Drive API sync & interactive simulator
│   │   └── App.jsx
└── package.json
```

---

## 🚀 Quick Start (Testing Right Now)

### Step 1: Run the Parent Web Dashboard Locally
```bash
cd client
npm install
npm run dev
```
Open **http://localhost:5173** in your browser. The dashboard includes a built-in **Interactive Device Simulator** so you can immediately test incoming calls, social chats, GPS moves, and remote locks!

---

## ☁️ Connecting 24/7 to Google Drive

1. Open **[script.google.com](https://script.google.com/)** and click **+ New project**.
2. Copy and paste all code from `backend/GoogleDriveBridge.js` into `Code.gs`.
3. Click **Deploy > New deployment**.
4. Select **Web app**:
   - Execute as: **Me (<your email>)**
   - Who has access: **Anyone**
5. Copy the generated **Web App URL**.
6. On the Parent Dashboard, click **"Setup & Connect Drive"** and paste your Web App URL.
7. That's it! Your dashboard is now connected 24/7 to your Google Drive!

---

## 📦 Building the Android APK

1. Open the `android-app` folder in **Android Studio**.
2. Update `AppConfig.kt` with your Google Apps Script Web App URL.
3. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Install the resulting `.apk` on the child's Android device.
5. Follow the in-app permission wizard and tap **"Activate Protection & Hide Icon"**. The app will vanish from the app drawer and run 24/7 in the background!

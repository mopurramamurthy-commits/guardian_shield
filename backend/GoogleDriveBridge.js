/**
 * GuardianShield - Advanced Multi-Device Google Apps Script Backend (24/7 Google Drive Storage Engine)
 * 
 * Supports UNLIMITED child devices connected to 1 Google Drive & 1 Parent Website!
 */

// Secret authentication token for security
var AUTH_TOKEN = "GUARDIAN_SECURE_TOKEN_98234";

// Main Google Drive Folder Name
var ROOT_FOLDER_NAME = "GuardianShield_Data";

/**
 * Get or create the main storage folder in Google Drive
 */
function getRootFolder() {
  var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(ROOT_FOLDER_NAME);
}

/**
 * Get or create a device-specific subfolder (e.g., GuardianShield_Data/devices/device_123/)
 */
function getDeviceFolder(deviceId) {
  var root = getRootFolder();
  var devicesFolders = root.getFoldersByName("devices");
  var devicesFolder = devicesFolders.hasNext() ? devicesFolders.next() : root.createFolder("devices");
  
  var safeId = (deviceId || "default_device").replace(/[^a-zA-Z0-9_-]/g, "_");
  var dFolders = devicesFolder.getFoldersByName(safeId);
  if (dFolders.hasNext()) {
    return dFolders.next();
  }
  return devicesFolder.createFolder(safeId);
}

/**
 * Helper to get or create a JSON file inside a specific folder
 */
function getOrCreateFile(folder, fileName, defaultContent) {
  var files = folder.getFilesByName(fileName);
  if (files.hasNext()) {
    return files.next();
  }
  return folder.createFile(fileName, defaultContent || "{}", MimeType.PLAIN_TEXT);
}

/**
 * Read JSON from a folder
 */
function readJson(folder, fileName, defaultVal) {
  try {
    var file = getOrCreateFile(folder, fileName, JSON.stringify(defaultVal || {}));
    var content = file.getBlob().getDataAsString();
    return JSON.parse(content);
  } catch (e) {
    return defaultVal || {};
  }
}

/**
 * Write JSON to a folder
 */
function writeJson(folder, fileName, data) {
  var file = getOrCreateFile(folder, fileName, "{}");
  file.setContent(JSON.stringify(data, null, 2));
}

/**
 * Register or update device in the master index
 */
function updateDeviceIndex(deviceInfo) {
  var root = getRootFolder();
  var devicesIndex = readJson(root, "devices_index.json", []);
  var deviceId = deviceInfo.deviceId || "default_device";
  
  var existingIndex = -1;
  for (var i = 0; i < devicesIndex.length; i++) {
    if (devicesIndex[i].deviceId === deviceId) {
      existingIndex = i;
      break;
    }
  }

  var updatedInfo = {
    deviceId: deviceId,
    deviceName: deviceInfo.deviceName || deviceInfo.deviceModel || "Child Phone",
    deviceModel: deviceInfo.deviceModel || "Android Device",
    battery: deviceInfo.battery !== undefined ? deviceInfo.battery : 85,
    online: true,
    lastSeen: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    devicesIndex[existingIndex] = Object.assign({}, devicesIndex[existingIndex], updatedInfo);
  } else {
    devicesIndex.push(updatedInfo);
  }

  writeJson(root, "devices_index.json", devicesIndex);
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

    var root = getRootFolder();
    var action = params.action || "all";
    var deviceId = params.deviceId || "default_device";
    var deviceFolder = getDeviceFolder(deviceId);

    // 1. Fetch Master Devices List
    if (action === "devices") {
      var devicesList = readJson(root, "devices_index.json", [
        { deviceId: "device_leo_s22", deviceName: "Leo's Phone (Galaxy S22)", deviceModel: "Samsung Galaxy S22", battery: 84, online: true, lastSeen: new Date().toISOString() }
      ]);
      return responseJson({ status: "success", data: devicesList });
    }

    // 2. Fetch Specific Device Telemetry
    if (action === "telemetry") {
      var telemetry = readJson(deviceFolder, "telemetry.json", {
        deviceId: deviceId,
        battery: 88,
        charging: false,
        online: true,
        network: "Wi-Fi",
        wifiSsid: "Home_5G",
        latitude: 37.774929,
        longitude: -122.419418,
        speed: 0,
        address: "750 Market St, San Francisco, CA",
        lastSeen: new Date().toISOString(),
        currentAppName: "WhatsApp",
        isLocked: false
      });
      return responseJson({ status: "success", data: telemetry });
    }

    // 3. Fetch Device Call Logs
    if (action === "calls") {
      var calls = readJson(deviceFolder, "call_logs.json", []);
      return responseJson({ status: "success", data: calls });
    }

    // 4. Fetch Social & Chats
    if (action === "social" || action === "notifications") {
      var social = readJson(deviceFolder, "social_notifications.json", []);
      return responseJson({ status: "success", data: social });
    }

    // 5. Fetch App Usage
    if (action === "apps") {
      var apps = readJson(deviceFolder, "app_usage.json", {
        totalScreenTimeMinutes: 185,
        installedApps: [],
        blockedApps: []
      });
      return responseJson({ status: "success", data: apps });
    }

    // 6. Fetch Commands (polled by APK)
    if (action === "commands") {
      var commands = readJson(deviceFolder, "commands.json", {
        lockDevice: false,
        takePhotoFront: false,
        takePhotoRear: false,
        recordAudio: false,
        audioDurationSeconds: 15,
        playAlarm: false,
        blockedApps: [],
        bedtimeLock: false,
        lastUpdated: new Date().toISOString()
      });
      return responseJson({ status: "success", data: commands });
    }

    // Default: Aggregate All Data for Selected Device + Master Device Index
    var devicesList = readJson(root, "devices_index.json", [
      { deviceId: "device_leo_s22", deviceName: "Leo's Phone (Galaxy S22)", deviceModel: "Samsung Galaxy S22", battery: 84, online: true, lastSeen: new Date().toISOString() },
      { deviceId: "device_emma_tablet", deviceName: "Emma's Tablet (Pixel Tab)", deviceModel: "Google Pixel Tablet", battery: 92, online: true, lastSeen: new Date().toISOString() }
    ]);

    var fullState = {
      devices: devicesList,
      activeDeviceId: deviceId,
      telemetry: readJson(deviceFolder, "telemetry.json", {}),
      calls: readJson(deviceFolder, "call_logs.json", []),
      social: readJson(deviceFolder, "social_notifications.json", []),
      apps: readJson(deviceFolder, "app_usage.json", { installedApps: [], blockedApps: [] }),
      alerts: readJson(deviceFolder, "safety_alerts.json", []),
      browsing: readJson(deviceFolder, "browsing_history.json", []),
      commands: readJson(deviceFolder, "commands.json", {}),
      photos: [],
      audio: [],
      serverTime: new Date().toISOString()
    };

    return responseJson({ status: "success", data: fullState });

  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

/**
 * Handle HTTP POST - Data Uploads & Remote Commands per Device
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
    var deviceId = body.deviceId || "default_device";
    var deviceFolder = getDeviceFolder(deviceId);

    // 1. Android Telemetry Sync
    if (action === "update_telemetry") {
      var telemetry = body.data || {};
      telemetry.deviceId = deviceId;
      telemetry.lastSeen = new Date().toISOString();
      writeJson(deviceFolder, "telemetry.json", telemetry);
      updateDeviceIndex(telemetry);
      return responseJson({ status: "success", message: "Telemetry saved for device: " + deviceId });
    }

    // 2. Call Logs Sync
    if (action === "sync_calls") {
      var existingCalls = readJson(deviceFolder, "call_logs.json", []);
      var newCalls = body.data || [];
      var mergedCalls = newCalls.concat(existingCalls).slice(0, 300);
      writeJson(deviceFolder, "call_logs.json", mergedCalls);
      return responseJson({ status: "success", message: "Calls saved" });
    }

    // 3. Social Media & Chats Sync
    if (action === "sync_social") {
      var existingNotifs = readJson(deviceFolder, "social_notifications.json", []);
      var newNotifs = body.data || [];
      var mergedNotifs = newNotifs.concat(existingNotifs).slice(0, 400);
      writeJson(deviceFolder, "social_notifications.json", mergedNotifs);
      return responseJson({ status: "success", message: "Social messages saved" });
    }

    // 4. App Usage Sync
    if (action === "sync_apps") {
      writeJson(deviceFolder, "app_usage.json", body.data);
      return responseJson({ status: "success", message: "Apps saved" });
    }

    // 5. Safety Alerts Sync
    if (action === "sync_alerts") {
      var existingAlerts = readJson(deviceFolder, "safety_alerts.json", []);
      var newAlerts = body.data || [];
      var mergedAlerts = newAlerts.concat(existingAlerts).slice(0, 200);
      writeJson(deviceFolder, "safety_alerts.json", mergedAlerts);
      return responseJson({ status: "success", message: "Alerts saved" });
    }

    // 6. Visited Browsing URLs Sync
    if (action === "sync_browsing") {
      var existingBrowsing = readJson(deviceFolder, "browsing_history.json", []);
      var newBrowsing = body.data || [];
      var mergedBrowsing = newBrowsing.concat(existingBrowsing).slice(0, 300);
      writeJson(deviceFolder, "browsing_history.json", mergedBrowsing);
      return responseJson({ status: "success", message: "Browsing saved" });
    }

    // 7. Parent Dispatches Remote Commands to specific Device
    if (action === "set_commands") {
      var currentCmds = readJson(deviceFolder, "commands.json", {});
      var updatedCmds = Object.assign({}, currentCmds, body.data, { lastUpdated: new Date().toISOString() });
      writeJson(deviceFolder, "commands.json", updatedCmds);
      return responseJson({ status: "success", message: "Command sent to device: " + deviceId, commands: updatedCmds });
    }

    // 8. APK Acknowledges Command
    if (action === "ack_command") {
      var cmds = readJson(deviceFolder, "commands.json", {});
      if (body.commandName && cmds.hasOwnProperty(body.commandName)) {
        cmds[body.commandName] = false;
        writeJson(deviceFolder, "commands.json", cmds);
      }
      return responseJson({ status: "success", message: "Command acknowledged" });
    }

    return responseJson({ status: "error", message: "Unknown action" });

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

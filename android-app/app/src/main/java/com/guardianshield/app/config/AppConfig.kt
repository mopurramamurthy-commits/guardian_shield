package com.guardianshield.app.config

import android.os.Build

object AppConfig {
    // Hardcoded permanent Google Drive Web App URL
    var GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxCTJutnn0xMRTPhrxujrTCfsa_EzzO5gnA2QKDh_xf_aiq1qdjQuEbBRPSCs6YnO4VeA/exec"
    
    // Secret authentication token matching Google Apps Script
    const val AUTH_TOKEN = "GUARDIAN_SECURE_TOKEN_98234"
    
    // Unique device identifier for multi-device support
    var DEVICE_ID = "device_${Build.MANUFACTURER.lowercase()}_${Build.MODEL.lowercase().replace(" ", "_")}"
    var DEVICE_NAME = "${Build.MANUFACTURER} ${Build.MODEL}"

    // Sync Intervals in Seconds
    const val TELEMETRY_SYNC_INTERVAL_SEC = 30L
    const val CALL_LOG_SYNC_INTERVAL_MIN = 5L
    const val COMMAND_POLL_INTERVAL_SEC = 15L

    // Keyword Alert Trigger List
    val SENSITIVE_KEYWORDS = listOf(
        "help me", "emergency", "suicide", "drugs", "kill", "porn", "xxx", "gambling", 
        "hate you", "meet me", "secret", "dont tell mom", "dont tell dad", "die"
    )
}

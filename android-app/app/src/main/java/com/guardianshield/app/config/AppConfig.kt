package com.guardianshield.app.config

object AppConfig {
    // Paste your Google Apps Script Web App Deployment URL here
    var GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec"
    
    // Secret authentication token matching Google Apps Script
    const val AUTH_TOKEN = "GUARDIAN_SECURE_TOKEN_98234"
    
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

package com.guardianshield.app.services

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.guardianshield.app.config.AppConfig
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class GuardianAccessibilityService : AccessibilityService() {

    companion object {
        var blockedPackageList = mutableSetOf<String>()
        var isBedtimeLockActive = false
    }

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val packageName = event.packageName?.toString() ?: ""

        // 1. App Blocker & Bedtime Lock Enforcement
        if (isBedtimeLockActive || blockedPackageList.contains(packageName)) {
            // If the package is not launcher or system settings, kick back to Home screen
            if (packageName != "com.android.launcher" && 
                packageName != "com.google.android.apps.nexuslauncher" &&
                packageName != "com.sec.android.app.launcher") {
                
                performGlobalAction(GLOBAL_ACTION_HOME)
                
                CoroutineScope(Dispatchers.IO).launch {
                    DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                        "id" to System.currentTimeMillis().toString(),
                        "type" to "APP_BLOCKED_ATTEMPT",
                        "severity" to "WARNING",
                        "message" to "Child attempted to open blocked app: $packageName",
                        "timestamp" to dateFormat.format(Date())
                    )))
                }
            }
        }

        // 2. Keystroke & Sensitive Keyword Monitor
        if (event.eventType == AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED ||
            event.eventType == AccessibilityEvent.TYPE_VIEW_FOCUSED) {
            
            val typedText = event.text?.joinToString(" ")?.trim() ?: ""
            if (typedText.length >= 3) {
                checkKeywordAlerts(typedText, packageName)
            }
        }

        // 3. Web URL Monitor for Chrome and Browsers
        if (packageName.contains("chrome") || packageName.contains("browser")) {
            extractBrowserUrl(rootInActiveWindow)
        }
    }

    private fun checkKeywordAlerts(text: String, packageName: String) {
        val lower = text.lowercase(Locale.ROOT)
        for (keyword in AppConfig.SENSITIVE_KEYWORDS) {
            if (lower.contains(keyword)) {
                CoroutineScope(Dispatchers.IO).launch {
                    DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                        "id" to System.currentTimeMillis().toString(),
                        "type" to "KEYWORD_ALERT",
                        "severity" to "HIGH",
                        "keyword" to keyword,
                        "packageName" to packageName,
                        "fullText" to text,
                        "message" to "⚠️ Triggered sensitive keyword alert: '$keyword' in app $packageName",
                        "timestamp" to dateFormat.format(Date())
                    )))
                }
                break
            }
        }
    }

    private fun extractBrowserUrl(node: AccessibilityNodeInfo?) {
        if (node == null) return
        try {
            // Look for URL bar in browser
            val urlBarNodes = node.findAccessibilityNodeInfosByViewId("com.android.chrome:id/url_bar")
            if (urlBarNodes.isNotEmpty()) {
                val url = urlBarNodes[0].text?.toString() ?: ""
                if (url.isNotBlank()) {
                    CoroutineScope(Dispatchers.IO).launch {
                        DriveApiClient.postToDrive("sync_browsing", listOf(mapOf(
                            "id" to System.currentTimeMillis().toString(),
                            "url" to url,
                            "browser" to "Chrome",
                            "timestamp" to dateFormat.format(Date())
                        )))
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore node inspection errors
        }
    }

    override fun onInterrupt() {}
}

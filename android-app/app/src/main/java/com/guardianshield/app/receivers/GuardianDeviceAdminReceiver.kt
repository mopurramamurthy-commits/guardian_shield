package com.guardianshield.app.receivers

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GuardianDeviceAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        // Send status update that Device Admin protection is enabled
        CoroutineScope(Dispatchers.IO).launch {
            DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                "id" to System.currentTimeMillis().toString(),
                "type" to "SECURITY",
                "severity" to "INFO",
                "message" to "Device Administrator protection successfully enabled.",
                "timestamp" to java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
            )))
        }
    }

    override fun onDisableRequested(context: Context, intent: Intent): CharSequence {
        // Warning shown if user attempts to remove device admin
        CoroutineScope(Dispatchers.IO).launch {
            DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                "id" to System.currentTimeMillis().toString(),
                "type" to "TAMPER_ALERT",
                "severity" to "HIGH",
                "message" to "WARNING: User is attempting to disable Device Administrator permissions!",
                "timestamp" to java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
            )))
        }
        return "Warning: Disabling Device Health Protection will notify parent administrator immediately."
    }
}

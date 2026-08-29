package com.guardianshield.app.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import com.guardianshield.app.services.MonitoringForegroundService
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GuardianBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            
            // Start foreground monitoring service
            val serviceIntent = Intent(context, MonitoringForegroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }

            // Send reboot alert to Drive
            CoroutineScope(Dispatchers.IO).launch {
                DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                    "id" to System.currentTimeMillis().toString(),
                    "type" to "DEVICE_REBOOT",
                    "severity" to "INFO",
                    "message" to "Device was rebooted and monitoring restarted automatically.",
                    "timestamp" to java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
                )))
            }
        }
    }
}

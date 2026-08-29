package com.guardianshield.app.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.guardianshield.app.workers.CommandSyncWorker
import com.guardianshield.app.workers.TelemetryWorker
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class MonitoringForegroundService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())
    private var telemetryJob: Job? = null
    private var commandPollJob: Job? = null

    override fun onCreate() {
        super.onCreate()
        startForeground(1001, createServiceNotification())
        startBackgroundLoops()
    }

    private fun createServiceNotification(): Notification {
        val channelId = "device_health_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Device System Health",
                NotificationManager.IMPORTANCE_MIN
            ).apply {
                description = "Runs background security checks and health optimization."
                setShowBadge(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Device Protection Active")
            .setContentText("System security & wellness monitoring enabled")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setOngoing(true)
            .build()
    }

    private fun startBackgroundLoops() {
        // 1. Telemetry loop (GPS, battery, network every 30s)
        telemetryJob = serviceScope.launch {
            while (isActive) {
                try {
                    TelemetryWorker.syncTelemetry(applicationContext)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                delay(30_000)
            }
        }

        // 2. Command Poll loop (fetches remote lock, camera, audio commands every 15s)
        commandPollJob = serviceScope.launch {
            while (isActive) {
                try {
                    CommandSyncWorker.pollAndExecuteCommands(applicationContext)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                delay(15_000)
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        telemetryJob?.cancel()
        commandPollJob?.cancel()
        super.onDestroy()
    }
}

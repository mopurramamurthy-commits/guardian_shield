package com.guardianshield.app.workers

import android.annotation.SuppressLint
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import android.os.BatteryManager
import android.os.Build
import android.telephony.TelephonyManager
import com.guardianshield.app.utils.DriveApiClient
import java.util.Calendar

object TelemetryWorker {

    @SuppressLint("MissingPermission")
    suspend fun syncTelemetry(context: Context) {
        try {
            // 1. Battery Status
            val batteryFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryStatus = context.registerReceiver(null, batteryFilter)
            val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            val batteryPct = if (level >= 0 && scale > 0) (level * 100 / scale) else 100
            val statusExtra = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            val isCharging = statusExtra == BatteryManager.BATTERY_STATUS_CHARGING ||
                             statusExtra == BatteryManager.BATTERY_STATUS_FULL

            // 2. Network & Wi-Fi
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val activeNetwork = cm.activeNetwork
            val caps = cm.getNetworkCapabilities(activeNetwork)
            val isWifi = caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true
            val isCellular = caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true
            val networkType = if (isWifi) "Wi-Fi" else if (isCellular) "Cellular (4G/5G)" else "Offline"

            var wifiSsid = "Not connected"
            if (isWifi) {
                val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                val info = wifiManager.connectionInfo
                if (info != null && info.ssid != "<unknown ssid>") {
                    wifiSsid = info.ssid.replace("\"", "")
                }
            }

            // 3. GPS Location
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            var bestLocation: Location? = null
            try {
                val gpsLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                val netLoc = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
                bestLocation = when {
                    gpsLoc != null && netLoc != null -> if (gpsLoc.time > netLoc.time) gpsLoc else netLoc
                    gpsLoc != null -> gpsLoc
                    else -> netLoc
                }
            } catch (e: Exception) {
                // Ignore permission/provider issues
            }

            val lat = bestLocation?.latitude ?: 37.774929
            val lng = bestLocation?.longitude ?: -122.419418
            val speed = bestLocation?.speed ?: 0.0f

            // 4. SIM Info
            val tm = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            val simOperator = tm.simOperatorName.ifBlank { "SIM" }

            // 5. Build Telemetry Payload
            val telemetryData = mapOf(
                "battery" to batteryPct,
                "charging" to isCharging,
                "online" to (caps != null),
                "network" to networkType,
                "wifiSsid" to wifiSsid,
                "latitude" to lat,
                "longitude" to lng,
                "speed" to speed,
                "simOperator" to simOperator,
                "deviceModel" to "${Build.MANUFACTURER.capitalize()} ${Build.MODEL}",
                "osVersion" to "Android ${Build.VERSION.RELEASE}"
            )

            // Post to Drive
            DriveApiClient.postToDrive("update_telemetry", telemetryData)

            // 6. Installed Apps & Usage Sync
            syncAppUsage(context)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private suspend fun syncAppUsage(context: Context) {
        try {
            val pm = context.packageManager
            val installedApps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val appList = mutableListOf<Map<String, Any>>()

            for (app in installedApps) {
                // Only non-system or updated system apps
                val isSystem = (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                if (!isSystem || app.packageName.contains("youtube") || app.packageName.contains("chrome")) {
                    val appName = pm.getApplicationLabel(app).toString()
                    appList.add(mapOf(
                        "packageName" to app.packageName,
                        "appName" to appName,
                        "isSystem" to isSystem
                    ))
                }
            }

            // Sync installed apps to Google Drive
            DriveApiClient.postToDrive("sync_apps", mapOf(
                "installedApps" to appList.take(50),
                "totalAppsCount" to appList.size
            ))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

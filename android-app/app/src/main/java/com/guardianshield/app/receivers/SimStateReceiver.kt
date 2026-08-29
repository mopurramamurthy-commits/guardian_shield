package com.guardianshield.app.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SimStateReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if ("android.intent.action.SIM_STATE_CHANGED" == intent.action) {
            val stateExtra = intent.getStringExtra("ss") ?: return

            if (stateExtra == "ABSENT" || stateExtra == "LOADED") {
                val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager
                val operatorName = telephonyManager?.simOperatorName ?: "Unknown"

                CoroutineScope(Dispatchers.IO).launch {
                    val alertMsg = if (stateExtra == "ABSENT") {
                        "CRITICAL: Physical SIM card was removed from the device!"
                    } else {
                        "SIM Card state changed. Current Operator: $operatorName"
                    }

                    DriveApiClient.postToDrive("sync_alerts", listOf(mapOf(
                        "id" to System.currentTimeMillis().toString(),
                        "type" to "SIM_CHANGE",
                        "severity" to if (stateExtra == "ABSENT") "CRITICAL" else "WARNING",
                        "message" to alertMsg,
                        "timestamp" to java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
                    )))
                }
            }
        }
    }
}

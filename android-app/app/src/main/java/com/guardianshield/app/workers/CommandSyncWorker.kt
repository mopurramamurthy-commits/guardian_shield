package com.guardianshield.app.workers

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.RingtoneManager
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.guardianshield.app.receivers.GuardianDeviceAdminReceiver
import com.guardianshield.app.services.GuardianAccessibilityService
import com.guardianshield.app.utils.DriveApiClient

object CommandSyncWorker {

    private val gson = Gson()

    suspend fun pollAndExecuteCommands(context: Context) {
        try {
            val responseString = DriveApiClient.fetchCommands()
            if (responseString.isBlank()) return

            val type = object : TypeToken<Map<String, Any>>() {}.type
            val jsonMap: Map<String, Any> = gson.fromJson(responseString, type) ?: return
            val data = jsonMap["data"] as? Map<String, Any> ?: return

            // 1. Remote Screen Lock
            if (data["lockDevice"] == true) {
                val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
                val adminComponent = ComponentName(context, GuardianDeviceAdminReceiver::class.java)
                if (dpm.isAdminActive(adminComponent)) {
                    dpm.lockNow()
                }
                DriveApiClient.acknowledgeCommand("lockDevice")
            }

            // 2. Remote Camera Snapshots
            if (data["takePhotoFront"] == true) {
                CameraWorker.capturePhoto(context, useFrontCamera = true)
            }
            if (data["takePhotoRear"] == true) {
                CameraWorker.capturePhoto(context, useFrontCamera = false)
            }

            // 3. Remote Ambient Audio Recording
            if (data["recordAudio"] == true) {
                val duration = (data["audioDurationSeconds"] as? Double)?.toInt() ?: 15
                AudioRecordWorker.recordAmbientAudio(context, duration)
            }

            // 4. Remote Siren / Alarm
            if (data["playAlarm"] == true) {
                playLoudAlarm(context)
                DriveApiClient.acknowledgeCommand("playAlarm")
            }

            // 5. Blocked Apps Sync
            val blockedList = data["blockedApps"] as? List<String>
            if (blockedList != null) {
                GuardianAccessibilityService.blockedPackageList.clear()
                GuardianAccessibilityService.blockedPackageList.addAll(blockedList)
            }

            // 6. Bedtime Lock
            GuardianAccessibilityService.isBedtimeLockActive = (data["bedtimeLock"] == true)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun playLoudAlarm(context: Context) {
        try {
            val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            audioManager.setStreamVolume(
                AudioManager.STREAM_ALARM,
                audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM),
                0
            )

            val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
            val ringtone = RingtoneManager.getRingtone(context, alarmUri)
            if (ringtone != null) {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                    ringtone.audioAttributes = AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                }
                ringtone.play()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

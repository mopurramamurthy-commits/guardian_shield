package com.guardianshield.app.utils

import com.google.gson.Gson
import com.guardianshield.app.config.AppConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

object DriveApiClient {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .followRedirects(true)
        .followSslRedirects(true)
        .build()

    private val gson = Gson()
    private val JSON_MEDIA = "application/json; charset=utf-8".toMediaType()

    suspend fun postToDrive(action: String, data: Any): String = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "token" to AppConfig.AUTH_TOKEN,
                "deviceId" to AppConfig.DEVICE_ID,
                "deviceName" to AppConfig.DEVICE_NAME,
                "action" to action,
                "data" to data
            )
            val jsonString = gson.toJson(payload)
            val body = jsonString.toRequestBody(JSON_MEDIA)

            val request = Request.Builder()
                .url(AppConfig.GOOGLE_SCRIPT_WEBHOOK_URL)
                .post(body)
                .build()

            client.newCall(request).execute().use { response ->
                return@withContext response.body?.string() ?: "{}"
            }
        } catch (e: Exception) {
            e.printStackTrace()
            return@withContext """{"status":"error","message":"${e.localizedMessage}"}"""
        }
    }

    suspend fun fetchCommands(): String = withContext(Dispatchers.IO) {
        try {
            val url = "${AppConfig.GOOGLE_SCRIPT_WEBHOOK_URL}?token=${AppConfig.AUTH_TOKEN}&action=commands&deviceId=${AppConfig.DEVICE_ID}"
            val request = Request.Builder()
                .url(url)
                .get()
                .build()

            client.newCall(request).execute().use { response ->
                return@withContext response.body?.string() ?: "{}"
            }
        } catch (e: Exception) {
            e.printStackTrace()
            return@withContext "{}"
        }
    }

    suspend fun acknowledgeCommand(commandName: String) = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "token" to AppConfig.AUTH_TOKEN,
                "deviceId" to AppConfig.DEVICE_ID,
                "action" to "ack_command",
                "commandName" to commandName
            )
            val body = gson.toJson(payload).toRequestBody(JSON_MEDIA)
            val request = Request.Builder()
                .url(AppConfig.GOOGLE_SCRIPT_WEBHOOK_URL)
                .post(body)
                .build()
            client.newCall(request).execute().close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

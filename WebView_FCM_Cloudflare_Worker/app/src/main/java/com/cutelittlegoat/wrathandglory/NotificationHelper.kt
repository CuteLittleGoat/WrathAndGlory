package com.cutelittlegoat.wrathandglory

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID
import java.util.concurrent.Executors

object NotificationHelper {

    private const val CHANNEL_ID = "infoczytnik_messages"
    private const val CHANNEL_NAME = "Infoczytnik"
    private val ioExecutor = Executors.newSingleThreadExecutor()

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = context.getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    fun showIncomingNotification(context: Context, title: String, body: String, targetUrl: String) {
        ensureChannel(context)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            putExtra(MainActivity.EXTRA_TARGET_URL, targetUrl)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            42,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_notify_chat)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        NotificationManagerCompat.from(context).notify(System.currentTimeMillis().toInt(), builder.build())
    }

    fun registerToken(context: Context, token: String) {
        ioExecutor.execute {
            runCatching {
                val connection = URL(BuildConfig.FCM_REGISTER_URL).openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.doOutput = true
                val payload = """
                    {
                      "token":"$token",
                      "platform":"android",
                      "source":"android-webview",
                      "deviceId":"${UUID.randomUUID()}"
                    }
                """.trimIndent()
                OutputStreamWriter(connection.outputStream).use { it.write(payload) }
                connection.inputStream.use { it.readBytes() }
                connection.disconnect()
            }
        }
    }
}

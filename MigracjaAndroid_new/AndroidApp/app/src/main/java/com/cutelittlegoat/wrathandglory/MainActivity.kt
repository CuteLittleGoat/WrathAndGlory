package com.cutelittlegoat.wrathandglory

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.addCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    private val requestNotifications = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        Log.d("WG_NOTIF", "POST_NOTIFICATIONS granted=$granted")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        configureWebView(webView, allowInfoczytnikLaunch = true)
        webView.loadUrl(WebViewConfig.MAIN_URL)

        // Android 13+ wymaga zgody runtime na powiadomienia
        ensureNotificationsPermission()

        // Subskrypcja topic do PUSH
        FirebaseMessaging.getInstance().subscribeToTopic("infoczytnik")
            .addOnCompleteListener { task ->
                Log.d("WG_FCM", "subscribeToTopic infoczytnik success=${task.isSuccessful}")
                task.exception?.let { Log.e("WG_FCM", "subscribeToTopic error", it) }
            }

        // Token urządzenia (bardzo przydatny do testów “Send test message” z Firebase Console)
        FirebaseMessaging.getInstance().token
            .addOnSuccessListener { token ->
                Log.d("WG_FCM", "FCM token: $token")
            }
            .addOnFailureListener { e ->
                Log.e("WG_FCM", "FCM token error", e)
            }

        onBackPressedDispatcher.addCallback(this) {
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                finish()
            }
        }
    }

    private fun ensureNotificationsPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED

            if (!granted) {
                requestNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
            } else {
                Log.d("WG_NOTIF", "POST_NOTIFICATIONS already granted")
            }
        } else {
            Log.d("WG_NOTIF", "POST_NOTIFICATIONS not required on this Android version")
        }
    }

    private fun configureWebView(webView: WebView, allowInfoczytnikLaunch: Boolean) {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.cacheMode = WebSettings.LOAD_DEFAULT
        webView.settings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = WgWebViewClient(this, allowInfoczytnikLaunch)
        webView.webChromeClient = object : WebChromeClient() {
            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message?
            ): Boolean {
                val url = view?.hitTestResult?.extra
                if (!url.isNullOrBlank()) {
                    WebViewConfig.openExternal(this@MainActivity, url)
                    return true
                }
                return false
            }
        }
    }
}

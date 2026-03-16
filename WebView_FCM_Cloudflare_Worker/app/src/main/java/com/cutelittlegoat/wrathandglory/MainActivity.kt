package com.cutelittlegoat.wrathandglory

import android.Manifest
import android.content.pm.ActivityInfo
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.enableEdgeToEdge
import com.google.android.material.snackbar.Snackbar
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URI
import java.net.URL
import java.util.UUID
import java.util.concurrent.Executors

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private val ioExecutor = Executors.newSingleThreadExecutor()

    private val notificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.mainWebView)
        configureWebView()

        val launchUrl = intent.getStringExtra(EXTRA_TARGET_URL) ?: BuildConfig.BASE_URL
        webView.loadUrl(sanitizeUrl(launchUrl))

        maybeShowOfflineWarning()
        NotificationHelper.ensureChannel(this)
        requestNotificationPermissionIfNeeded()
        registerFcmToken()
    }

    override fun onNewIntent(intent: android.content.Intent) {
        super.onNewIntent(intent)
        val targetUrl = intent.getStringExtra(EXTRA_TARGET_URL) ?: return
        webView.loadUrl(sanitizeUrl(targetUrl))
    }

    private fun configureWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            setSupportZoom(false)
            cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
            userAgentString = "$userAgentString WrathAndGloryAndroidApp/1.0"
        }
        webView.clearCache(true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val safe = sanitizeUrl(request.url.toString())
                if (safe != request.url.toString()) {
                    view.loadUrl(safe)
                    return true
                }
                return false
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                applyOrientationRule(url)
            }
        }
    }

    private fun sanitizeUrl(rawUrl: String): String {
        return try {
            val uri = URI(rawUrl)
            val host = uri.host ?: return BuildConfig.BASE_URL
            val allowedHost = URI(BuildConfig.BASE_URL).host
            if (host != allowedHost) return BuildConfig.BASE_URL

            val queryPairs = (uri.rawQuery ?: "")
                .split("&")
                .filter { it.isNotBlank() }
                .mapNotNull {
                    val parts = it.split("=", limit = 2)
                    if (parts.size == 2) parts[0] to parts[1] else null
                }
                .filterNot { (key, _) -> key == "admin" }

            val cleanQuery = queryPairs.joinToString("&") { "${it.first}=${it.second}" }
            URI(
                uri.scheme,
                uri.authority,
                uri.path,
                if (cleanQuery.isBlank()) null else cleanQuery,
                uri.fragment
            ).toString()
        } catch (_: Exception) {
            BuildConfig.BASE_URL
        }
    }

    private fun applyOrientationRule(url: String) {
        val path = try { URI(url).path ?: "" } catch (_: Exception) { "" }
        requestedOrientation = if (path.contains("/Infoczytnik/", ignoreCase = true)) {
            ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        } else {
            ActivityInfo.SCREEN_ORIENTATION_FULL_USER
        }
    }

    private fun maybeShowOfflineWarning() {
        val connectivity = getSystemService(ConnectivityManager::class.java)
        val network = connectivity?.activeNetwork
        val capabilities = connectivity?.getNetworkCapabilities(network)
        val hasInternet = capabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true

        if (!hasInternet) {
            Snackbar.make(webView, getString(R.string.offline_warning), Snackbar.LENGTH_LONG).show()
        }
    }


    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) !=
            android.content.pm.PackageManager.PERMISSION_GRANTED
        ) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    private fun registerFcmToken() {
        FirebaseMessaging.getInstance().token.addOnSuccessListener { token ->
            sendTokenToWorker(token)
        }
    }

    private fun sendTokenToWorker(token: String) {
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

    companion object {
        const val EXTRA_TARGET_URL = "target_url"
    }
}

package com.cutelittlegoat.wrathandglory

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.addCallback
import androidx.appcompat.app.AppCompatActivity

class InfoczytnikActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_infoczytnik)

        webView = findViewById(R.id.webView)
        configureWebView(webView)
        webView.loadUrl(WebViewConfig.INFO_URL)

        onBackPressedDispatcher.addCallback(this) {
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                finish()
            }
        }
    }

    private fun configureWebView(webView: WebView) {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.cacheMode = WebSettings.LOAD_DEFAULT
        webView.settings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = WgWebViewClient(this, allowInfoczytnikLaunch = false)
        webView.webChromeClient = object : WebChromeClient() {
            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message?
            ): Boolean {
                val url = view?.hitTestResult?.extra
                if (!url.isNullOrBlank()) {
                    WebViewConfig.openExternal(this@InfoczytnikActivity, url)
                    return true
                }
                return false
            }
        }
    }
}

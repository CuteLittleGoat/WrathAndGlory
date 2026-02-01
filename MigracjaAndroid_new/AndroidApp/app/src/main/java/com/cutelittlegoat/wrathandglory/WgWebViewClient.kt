package com.cutelittlegoat.wrathandglory

import android.app.Activity
import android.content.Intent
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient

class WgWebViewClient(
    private val activity: Activity,
    private val allowInfoczytnikLaunch: Boolean
) : WebViewClient() {

    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
        val url = request.url.toString()

        if (WebViewConfig.isBlocked(url)) {
            WebViewConfig.showBlockedMessage(activity)
            return true
        }

        if (allowInfoczytnikLaunch && WebViewConfig.isInfoczytnik(url)) {
            activity.startActivity(Intent(activity, InfoczytnikActivity::class.java))
            return true
        }

        if (WebViewConfig.isExternal(url)) {
            WebViewConfig.openExternal(activity, url)
            return true
        }

        return false
    }
}

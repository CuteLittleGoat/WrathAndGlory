package com.cutelittlegoat.wrathandglory

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.widget.Toast

object WebViewConfig {
    const val MAIN_URL = "https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html"
    const val INFO_URL = "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik.html"

    private val internalHosts = setOf("cutelittlegoat.github.io")
    private val blockedPaths = listOf("/GM.html", "/GM_test.html")

    fun isBlocked(url: String): Boolean {
        return blockedPaths.any { url.contains(it, ignoreCase = true) }
    }

    fun isInfoczytnik(url: String): Boolean {
        return url.contains("/Infoczytnik/Infoczytnik.html", ignoreCase = true)
    }

    fun isExternal(url: String): Boolean {
        val uri = Uri.parse(url)
        val scheme = uri.scheme ?: return false
        if (scheme != "http" && scheme != "https") {
            return true
        }
        val host = uri.host ?: return false
        return host !in internalHosts
    }

    fun openExternal(activity: Activity, url: String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        activity.startActivity(intent)
    }

    fun showBlockedMessage(activity: Activity) {
        Toast.makeText(activity, "Widok GM jest zablokowany w aplikacji użytkownika.", Toast.LENGTH_LONG).show()
    }
}

package com.cutelittlegoat.wrathandglory

import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class WrathFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        FirebaseMessaging.getInstance().token.addOnSuccessListener {
            NotificationHelper.registerToken(applicationContext, it)
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        val title = message.notification?.title ?: getString(R.string.notification_title)
        val body = message.notification?.body ?: getString(R.string.notification_fixed_body)
        NotificationHelper.showIncomingNotification(
            context = applicationContext,
            title = title,
            body = body,
            targetUrl = message.data["url"] ?: BuildConfig.INFOCZYTNIK_URL
        )
    }
}

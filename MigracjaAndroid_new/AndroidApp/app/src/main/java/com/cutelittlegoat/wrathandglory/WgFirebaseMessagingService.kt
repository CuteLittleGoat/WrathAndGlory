package com.cutelittlegoat.wrathandglory

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class WgFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("WG_FCM", "New token: $token")
        // Token jest przydatny do testów z Firebase Console (Test message).
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        // DATA-only: title/body przychodzą w message.data
        val title = message.data["title"] ?: "++INCOMING TRANSMISSION++"
        val body = message.data["body"] ?: "++Blessed be the Omnissiah++"

        Log.d("WG_FCM", "onMessageReceived data=${message.data}")

        NotificationHelper.showIncomingMessageNotification(this, title, body)
    }
}

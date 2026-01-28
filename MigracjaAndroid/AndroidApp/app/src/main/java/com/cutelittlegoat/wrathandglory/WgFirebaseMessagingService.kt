package com.cutelittlegoat.wrathandglory

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class WgFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        NotificationHelper.showIncomingMessageNotification(this)
    }

    override fun onNewToken(token: String) {
        // Token refresh handled automatically by FCM; topic subscription lives in MainActivity.
    }
}

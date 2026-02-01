const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyOnDataslateMessage = functions.firestore
  .document("dataslate/current")
  .onWrite(async (change) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after || after.type !== "message") {
      return null;
    }

    // DATA-only (bez "notification"), żeby Android zawsze wywołał onMessageReceived()
    const message = {
      topic: "infoczytnik",
      data: {
        title: "++INCOMING TRANSMISSION++",
        body: "++Blessed be the Omnissiah++",
        type: "dataslate",
        faction: String(after.faction || ""),
        nonce: String(after.nonce || ""),
      },
      android: {
        priority: "high",
      },
    };

    return admin.messaging().send(message);
  });

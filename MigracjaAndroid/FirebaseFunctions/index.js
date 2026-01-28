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

    const payload = {
      notification: {
        title: "++INCOMING TRANSMISSION++",
        body: "++Blessed be the Omnissiah++",
      },
      data: {
        type: "dataslate",
        faction: String(after.faction || ""),
        nonce: String(after.nonce || ""),
      },
    };

    return admin.messaging().sendToTopic("infoczytnik", payload);
  });

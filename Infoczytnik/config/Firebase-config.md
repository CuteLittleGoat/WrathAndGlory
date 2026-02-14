# Infoczytnik / Firebase-config

## 1) Template pliku `firebase-config.js`
Skopiuj `Infoczytnik/config/firebase-config.template.js` do `Infoczytnik/config/firebase-config.js` i uzupełnij danymi z Firebase Console.

```js
// Infoczytnik/config/firebase-config.js
window.firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};
```

## 2) Oczekiwana struktura Firestore

- `dataslate`
  - dokument `current`
    - `type` (string: `message` | `ping` | `clear`)
    - `faction` (string)
    - `color` (string)
    - `fontColor` (string)
    - `msgFontSize` (string, np. `"20px"`)
    - `prefixColor` (string)
    - `suffixColor` (string)
    - `prefixFontSize` (string, np. `"12px"`)
    - `suffixFontSize` (string, np. `"12px"`)
    - `prefixIndex` (number)
    - `suffixIndex` (number)
    - `showLogo` (boolean)
    - `flicker` (boolean)
    - `text` (string)
    - `nonce` (string)
    - `ts` (timestamp)
    - (opcjonalnie) `pingUrl` (string)
    - (opcjonalnie) `msgUrl` / `messageUrl` (string)

## 3) Node.js script (utworzenie struktury)

> Wymagania: `npm i firebase-admin` + konto serwisowe (`GOOGLE_APPLICATION_CREDENTIALS`).

```js
// Infoczytnik/config/init-firestore-structure.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("dataslate").doc("current").set(
    {
      type: "message",
      faction: "mechanicus",
      color: "#00ff66",
      fontColor: "#00ff66",
      msgFontSize: "20px",
      prefixColor: "#00ff66",
      suffixColor: "#00ff66",
      prefixFontSize: "12px",
      suffixFontSize: "12px",
      prefixIndex: 1,
      suffixIndex: 1,
      showLogo: true,
      flicker: true,
      text: "",
      nonce: "init",
      ts: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("[OK] Utworzono/uzupełniono dokument dataslate/current");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 4) Instrukcja krok-po-kroku (PL)
1. Wejdź do Firebase Console i wybierz projekt używany przez Infoczytnik/GM.
2. Otwórz **Build → Firestore Database**.
3. Jeśli Firestore nie jest jeszcze uruchomiony: kliknij **Create database**, wybierz tryb i region.
4. Otwórz **Project settings → Your apps**.
5. Dodaj lub wybierz aplikację Web (`</>`).
6. Skopiuj konfigurację z **Firebase SDK snippet (Config)**.
7. Skopiuj `Infoczytnik/config/firebase-config.template.js` do `Infoczytnik/config/firebase-config.js` i podmień wartości `window.firebaseConfig`.
8. Uruchom skrypt z sekcji 3 (albo utwórz ręcznie kolekcję `dataslate` i dokument `current`).
9. W Firestore Rules dodaj reguły umożliwiające odczyt i zapis dokumentu `dataslate/current`.
10. Uruchom `GM_test.html`, wyślij wiadomość i sprawdź, czy dokument `dataslate/current` zmienia wartości.
11. Uruchom `Infoczytnik_test.html` i potwierdź, że odczytuje i renderuje dane z tego samego dokumentu.

## 5) Step-by-step guide (EN)
1. Open Firebase Console and select the project used by Infoczytnik/GM.
2. Open **Build → Firestore Database**.
3. If Firestore is not enabled, click **Create database**, choose mode and region.
4. Open **Project settings → Your apps**.
5. Add or select a Web app (`</>`).
6. Copy the values from **Firebase SDK snippet (Config)**.
7. Copy `Infoczytnik/config/firebase-config.template.js` to `Infoczytnik/config/firebase-config.js` and paste config into `window.firebaseConfig`.
8. Run the script from section 3 (or manually create collection `dataslate` and document `current`).
9. In Firestore Rules, allow reads and writes for `dataslate/current` according to your policy.
10. Open `GM_test.html`, send a message, and confirm `dataslate/current` changes.
11. Open `Infoczytnik_test.html` and verify it renders data from the same document.

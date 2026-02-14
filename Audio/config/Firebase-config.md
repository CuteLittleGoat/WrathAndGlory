# Audio / Firebase-config

## 1) Template pliku `firebase-config.js`
Skopiuj `Audio/config/firebase-config.template.js` do `Audio/config/firebase-config.js` i wypełnij danymi z Firebase Console.

```js
// Audio/config/firebase-config.js
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

- `audio`
  - dokument `favorites`
    - `favorites` (object)
      - `lists` (array)
        - element listy (object)
          - `id` (string, UUID)
          - `name` (string)
          - `itemIds` (array<string>)
    - `mainView` (object)
      - `itemIds` (array<string>)
    - `aliases` (object map: `sampleId -> alias`)
    - `updatedAt` (timestamp)

## 3) Node.js script (utworzenie struktury)

> Wymagania: `npm i firebase-admin` oraz konto serwisowe (JSON) ustawione jako `GOOGLE_APPLICATION_CREDENTIALS`.

```js
// Audio/config/init-firestore-structure.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("audio").doc("favorites").set(
    {
      favorites: {
        lists: [
          {
            id: "default-list",
            name: "Ulubione",
            itemIds: [],
          },
        ],
      },
      mainView: {
        itemIds: [],
      },
      aliases: {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("[OK] Utworzono/uzupełniono dokument audio/favorites");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 4) Instrukcja krok-po-kroku (PL)
1. Wejdź do [https://console.firebase.google.com](https://console.firebase.google.com) i otwórz projekt.
2. W menu po lewej kliknij **Build → Firestore Database**.
3. Jeśli Firestore nie jest aktywny: kliknij **Create database**, wybierz tryb (test/production), wybierz region i zatwierdź.
4. Przejdź do **Project settings (koło zębate) → Your apps**.
5. Jeśli nie masz aplikacji web: kliknij ikonę `</>`, wpisz nazwę aplikacji, kliknij **Register app**.
6. Skopiuj snippet **Firebase SDK snippet → Config**.
7. W repozytorium skopiuj `Audio/config/firebase-config.template.js` do `Audio/config/firebase-config.js` i wklej config do `window.firebaseConfig`.
8. (Opcjonalnie automatycznie) uruchom skrypt Node.js z sekcji 3 i utwórz dokument `audio/favorites`.
9. (Ręcznie) w Firestore kliknij **Start collection**:
   - Collection ID: `audio`
   - Document ID: `favorites`
   - Dodaj pola zgodnie z sekcją 2.
10. Otwórz reguły Firestore (**Firestore Database → Rules**) i upewnij się, że aplikacja ma odczyt/zapis do `audio/favorites`.
11. Uruchom `Audio/index.html?admin=1`, dodaj próbkę do listy i sprawdź, czy dokument `audio/favorites` aktualizuje się po zapisie.

## 5) Step-by-step guide (EN)
1. Open [https://console.firebase.google.com](https://console.firebase.google.com) and choose your project.
2. In the left sidebar, go to **Build → Firestore Database**.
3. If Firestore is not enabled yet, click **Create database**, select mode (test/production), choose region, confirm.
4. Go to **Project settings (gear icon) → Your apps**.
5. If no web app exists, click `</>`, enter app name, click **Register app**.
6. Copy **Firebase SDK snippet → Config**.
7. In the repo, copy `Audio/config/firebase-config.template.js` to `Audio/config/firebase-config.js` and paste values into `window.firebaseConfig`.
8. (Optional automatic path) run the Node.js script from section 3 to create `audio/favorites`.
9. (Manual path) in Firestore click **Start collection**:
   - Collection ID: `audio`
   - Document ID: `favorites`
   - Add fields from section 2.
10. Open Firestore rules (**Firestore Database → Rules**) and ensure read/write access for `audio/favorites`.
11. Open `Audio/index.html?admin=1`, add a sample to favorites, verify that `audio/favorites` updates.

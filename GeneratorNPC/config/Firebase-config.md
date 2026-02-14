# GeneratorNPC / Firebase-config

## 1) Template pliku `firebase-config.js`
Skopiuj `GeneratorNPC/config/firebase-config.template.js` do `GeneratorNPC/config/firebase-config.js` i wpisz dane z Firebase Console.

```js
// GeneratorNPC/config/firebase-config.js
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

- `generatorNpc`
  - dokument `favorites`
    - `favorites` (array<object>)
      - element ulubionego wpisu (object)
        - `id` (string)
        - `alias` (string)
        - `createdAt` (number, `Date.now()`)
        - `payload` (object)
          - `selectedBestiaryIndex` (number)
          - `bestiaryName` (string)
          - `bestiaryOverrides` (object)
          - `notes` (string)
          - `modules` (object)
            - `weaponIds`, `armorIds`, `augmentationsIds`, `equipmentIds`, `talentsIds`, `psionicsIds`, `prayersIds` (array<number>)
          - `toggles` (object)
            - `moduleVisibility` (object<string, boolean>)
            - `traitDescriptions` (object)
              - `weapon` (boolean)
              - `armor` (boolean)
            - `fullDetails` (object)
              - `augmentations`, `equipment`, `talents`, `psionics`, `prayers` (boolean)
    - `updatedAt` (timestamp)

## 3) Node.js script (utworzenie struktury)

> Wymagania: `npm i firebase-admin` + konto serwisowe ustawione w `GOOGLE_APPLICATION_CREDENTIALS`.

```js
// GeneratorNPC/config/init-firestore-structure.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(
    {
      favorites: [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("[OK] Utworzono/uzupełniono dokument generatorNpc/favorites");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 4) Instrukcja krok-po-kroku (PL)
1. Otwórz Firebase Console i wybierz projekt dla GeneratorNPC.
2. Kliknij **Build → Firestore Database**.
3. Jeśli baza nie istnieje: **Create database** → wybierz tryb i region → potwierdź.
4. Wejdź w **Project settings → Your apps**.
5. Dodaj aplikację Web (`</>`) lub wybierz istniejącą.
6. Skopiuj config z **Firebase SDK snippet (Config)**.
7. Skopiuj `GeneratorNPC/config/firebase-config.template.js` do `GeneratorNPC/config/firebase-config.js` i wklej wartości.
8. Utwórz strukturę przez skrypt Node.js (sekcja 3) albo ręcznie dodaj kolekcję i dokument:
   - Collection: `generatorNpc`
   - Document: `favorites`
   - Pole: `favorites` jako tablica (na start pusta), `updatedAt` jako timestamp.
9. W **Firestore Database → Rules** ustaw reguły odczytu/zapisu dla `generatorNpc/favorites`.
10. Uruchom `GeneratorNPC/index.html`, dodaj wpis do ulubionych i sprawdź, czy dokument w Firestore aktualizuje się.

## 5) Step-by-step guide (EN)
1. Open Firebase Console and select the project used by GeneratorNPC.
2. Go to **Build → Firestore Database**.
3. If Firestore does not exist: **Create database** → choose mode and region → confirm.
4. Open **Project settings → Your apps**.
5. Add a Web app (`</>`) or open an existing one.
6. Copy values from **Firebase SDK snippet (Config)**.
7. Copy `GeneratorNPC/config/firebase-config.template.js` to `GeneratorNPC/config/firebase-config.js` and paste the config.
8. Create the Firestore shape using the Node.js script (section 3), or manually add:
   - Collection: `generatorNpc`
   - Document: `favorites`
   - Fields: `favorites` as array (empty initially), `updatedAt` timestamp.
9. In **Firestore Database → Rules**, allow read/write for `generatorNpc/favorites` according to your security policy.
10. Open `GeneratorNPC/index.html`, add a favorite, and verify the Firestore document updates.

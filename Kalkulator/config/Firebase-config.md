# Kalkulator / Firebase-config

## 1) Template pliku `firebase-config.js`
Skopiuj `Kalkulator/config/firebase-config.js` i uzupełnij danymi z Firebase Console, jeśli pracujesz na innym projekcie.

```js
// Kalkulator/config/firebase-config.js
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

- `character_builder`
  - dokument `current`
    - `schemaVersion` (number, stała: `1`)
    - `module` (string, np. `"Kalkulator/TworzeniePostaci"`)
    - `lang` (string: `"pl"` lub `"en"`)
    - `savedAt` (timestamp, `serverTimestamp()`)
    - `savedBy` (string)
    - `xpPool` (number)
    - `xpTotal` (number)
    - `xpSpent` (number)
    - `xpAvailable` (number)
    - `hasValidationErrors` (boolean)
    - `validationMessages` (array<string>)
    - `attributes` (map)
      - `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`, `Speed` (number)
    - `skills` (map)
      - `Column1Row1..Column1Row9` (number)
      - `Column2Row1..Column2Row9` (number)
    - `talents` (array, 10 elementów)
      - element: `{ name: string, cost: number }`
    - `formSnapshot` (map `id -> value`, pełna migawka pól formularza)

## 3) Node.js script (utworzenie struktury)

> Wymagania: `npm i firebase-admin` + konto serwisowe (`GOOGLE_APPLICATION_CREDENTIALS`).

```js
// Kalkulator/config/init-firestore-character-builder.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("character_builder").doc("current").set(
    {
      schemaVersion: 1,
      module: "Kalkulator/TworzeniePostaci",
      lang: "pl",
      savedAt: admin.firestore.FieldValue.serverTimestamp(),
      savedBy: "init-script",
      xpPool: 155,
      xpTotal: 155,
      xpSpent: 0,
      xpAvailable: 155,
      hasValidationErrors: false,
      validationMessages: [],
      attributes: {
        S: 1, Wt: 1, Zr: 1, I: 1, SW: 1, Int: 1, Ogd: 1, Speed: 6,
      },
      skills: {
        Column1Row1: 0, Column1Row2: 0, Column1Row3: 0, Column1Row4: 0, Column1Row5: 0,
        Column1Row6: 0, Column1Row7: 0, Column1Row8: 0, Column1Row9: 0,
        Column2Row1: 0, Column2Row2: 0, Column2Row3: 0, Column2Row4: 0, Column2Row5: 0,
        Column2Row6: 0, Column2Row7: 0, Column2Row8: 0, Column2Row9: 0,
      },
      talents: [
        { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 },
        { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 }, { name: "", cost: 0 },
      ],
      formSnapshot: {
        languageSelect: "pl",
        xpPool: "155",
        attr_S: "1", attr_Wt: "1", attr_Zr: "1", attr_I: "1", attr_SW: "1", attr_Int: "1", attr_Ogd: "1", attr_Speed: "6",
      },
    },
    { merge: true }
  );

  console.log("[OK] Utworzono/uzupełniono dokument character_builder/current");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 4) Instrukcja krok-po-kroku (PL)
1. Otwórz Firebase Console i wybierz projekt używany przez moduł Kalkulator.
2. Wejdź do **Build → Firestore Database**.
3. Jeśli Firestore nie jest uruchomiony: kliknij **Create database**, wybierz tryb i region.
4. Wejdź w **Project settings → Your apps** i wybierz aplikację Web (`</>`).
5. Skopiuj dane z **Firebase SDK snippet (Config)**.
6. Uzupełnij `Kalkulator/config/firebase-config.js` (obiekt `window.firebaseConfig`).
7. Utwórz dokument `character_builder/current` ręcznie lub uruchom skrypt z sekcji 3.
8. W Firestore Rules dodaj uprawnienia odczytu i zapisu dla `character_builder/current`.
9. Otwórz `Kalkulator/TworzeniePostaci.html`.
10. Wypełnij formularz i kliknij **Zapisz** → potwierdź **Tak**.
11. Zmień kilka pól i kliknij **Wczytaj** → potwierdź **Tak**.
12. Sprawdź, czy wszystkie pola i komunikaty wróciły do zapisanej wersji.

## 5) Step-by-step guide (EN)
1. Open Firebase Console and select the project used by the Calculator module.
2. Go to **Build → Firestore Database**.
3. If Firestore is not enabled, click **Create database**, then choose mode and region.
4. Open **Project settings → Your apps** and choose the Web app (`</>`).
5. Copy values from **Firebase SDK snippet (Config)**.
6. Fill `Kalkulator/config/firebase-config.js` (`window.firebaseConfig`).
7. Create `character_builder/current` manually or run the script from section 3.
8. Add Firestore Rules that allow read/write for `character_builder/current`.
9. Open `Kalkulator/TworzeniePostaci.html`.
10. Fill the form and click **Save** → confirm with **Yes**.
11. Change several fields and click **Load** → confirm with **Yes**.
12. Verify that all fields and validation messages return to the saved state.

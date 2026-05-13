# 🇵🇱 Instrukcja Firebase dla modułu `Kalkulator` (PL)

## Cel
Ten plik zawiera pełny skrypt Node.js do utworzenia dokumentu `character_builder/current` wraz z kompletną strukturą pól.

## 1) Konfiguracja `config/firebase-config.js`
Skopiuj dane z Firebase Console → **Project settings** → **Your apps** → Web app (`</>`), a następnie wklej do `Kalkulator/config/firebase-config.js` jako `window.firebaseConfig`.

## 2) Struktura Firestore (drzewko + typy)
```text
character_builder (kolekcja)
└── current (dokument)
    ├── schemaVersion (string)
    ├── updatedAt (string, ISO datetime)
    ├── xpPool (number)
    ├── xpSpent (number)
    ├── xpAvailable (number)
    ├── attributes (mapa / obiekt)
    │   └── <attributeName> (string) -> <value> (number)
    ├── skills (mapa / obiekt)
    │   └── <skillName> (string) -> <value> (number)
    ├── talents (tablica obiektów)
    │   └── [0..n] (obiekt)
    │       ├── id (string)
    │       ├── name (string)
    │       └── rank (number)
    └── formSnapshot (mapa / obiekt)
        ├── archetype (string)
        ├── species (string)
        └── notes (string)
```

## 3) Pełny skrypt Node.js (do skopiowania)
Zapisz jako `Kalkulator/config/init-firestore-character-builder.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do pliku JSON konta serwisowego.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  schemaVersion: "character-builder-v1",
  updatedAt: new Date().toISOString(),
  xpPool: 0,
  xpSpent: 0,
  xpAvailable: 0,
  attributes: {},
  skills: {},
  talents: [],
  formSnapshot: {
    archetype: "",
    species: "",
    notes: ""
  }
};

async function main() {
  const ref = db.collection("character_builder").doc("current");
  await ref.set(payload, { merge: true });
  console.log("[OK] Utworzono / zaktualizowano dokument character_builder/current");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## 4) Uruchomienie
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
node Kalkulator/config/init-firestore-character-builder.js
```

---

# 🇬🇧 Firebase guide for `Kalkulator` module (EN)

## Purpose
This file contains a full Node.js script to create `character_builder/current` with the complete field structure.

## 1) `config/firebase-config.js`
Copy web config values from Firebase Console and paste them into `Kalkulator/config/firebase-config.js` as `window.firebaseConfig`.

## 2) Firestore structure (tree + types)
```text
character_builder (collection)
└── current (document)
    ├── schemaVersion (string)
    ├── updatedAt (string, ISO datetime)
    ├── xpPool (number)
    ├── xpSpent (number)
    ├── xpAvailable (number)
    ├── attributes (map / object)
    │   └── <attributeName> (string) -> <value> (number)
    ├── skills (map / object)
    │   └── <skillName> (string) -> <value> (number)
    ├── talents (array of objects)
    │   └── [0..n] (object: id/name/rank)
    └── formSnapshot (map / object)
        ├── archetype (string)
        ├── species (string)
        └── notes (string)
```

## 3) Full Node.js script (copy-paste)
Save as `Kalkulator/config/init-firestore-character-builder.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  schemaVersion: "character-builder-v1",
  updatedAt: new Date().toISOString(),
  xpPool: 0,
  xpSpent: 0,
  xpAvailable: 0,
  attributes: {},
  skills: {},
  talents: [],
  formSnapshot: { archetype: "", species: "", notes: "" }
};

async function main() {
  await db.collection("character_builder").doc("current").set(payload, { merge: true });
  console.log("[OK] Created / updated character_builder/current");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## 4) Run
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
node Kalkulator/config/init-firestore-character-builder.js
```

# 🇵🇱 Instrukcja Firebase dla modułu `GeneratorNPC` (PL)

## Cel
Dokument zawiera pełny skrypt Node.js tworzący strukturę Firestore używaną przez ulubione profile NPC.

## 1) Konfiguracja `config/firebase-config.js`
Skopiuj wartości web config z Firebase Console i wklej do `GeneratorNPC/config/firebase-config.js` jako `window.firebaseConfig`.

## 2) Struktura Firestore (drzewko + typy)
```text
generatorNpc (kolekcja)
└── favorites (dokument)
    ├── updatedAt (string, ISO datetime)
    └── favorites (tablica obiektów)
        └── [0..n] (obiekt)
            ├── id (string)
            ├── name (string)
            ├── createdAt (string, ISO datetime)
            └── build (mapa / obiekt)
                ├── tier (number)
                ├── archetype (string)
                ├── species (string)
                ├── traits (tablica stringów)
                └── notes (string)
```

## 3) Pełny skrypt Node.js (do skopiowania)
Zapisz jako `GeneratorNPC/config/init-firestore-structure.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do klucza konta serwisowego.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  updatedAt: new Date().toISOString(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Utworzono / zaktualizowano dokument generatorNpc/favorites");
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
node GeneratorNPC/config/init-firestore-structure.js
```

---

# 🇬🇧 Firebase guide for `GeneratorNPC` module (EN)

## Purpose
This file provides a full Node.js script that creates the Firestore structure for NPC favorites.

## 1) `config/firebase-config.js`
Copy Firebase Web config values and paste into `GeneratorNPC/config/firebase-config.js` as `window.firebaseConfig`.

## 2) Firestore structure (tree + types)
```text
generatorNpc (collection)
└── favorites (document)
    ├── updatedAt (string, ISO datetime)
    └── favorites (array of objects)
        └── [0..n] (object)
            ├── id (string)
            ├── name (string)
            ├── createdAt (string, ISO datetime)
            └── build (map/object)
                ├── tier (number)
                ├── archetype (string)
                ├── species (string)
                ├── traits (array of strings)
                └── notes (string)
```

## 3) Full Node.js script (copy-paste)
Save as `GeneratorNPC/config/init-firestore-structure.js`:

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
  updatedAt: new Date().toISOString(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Created / updated generatorNpc/favorites");
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
node GeneratorNPC/config/init-firestore-structure.js
```

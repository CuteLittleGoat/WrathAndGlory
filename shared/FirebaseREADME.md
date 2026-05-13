# 🇵🇱 Instrukcja Firebase dla folderu `shared/` (PL)

## Cel
Ten plik zawiera pełny skrypt Node.js tworzący strukturę **Realtime Database** wymaganą przez wspólny loader danych (`shared/firebase-data-loader.js`).

## 1) Konfiguracja `shared/firebase-config.js`
Uzupełnij:
- `window.WG_FIREBASE_CONFIG` (web config Firebase),
- `window.WG_DATA_ACCESS_EMAIL` (email użytkownika technicznego z Firebase Authentication).

## 2) Struktura Realtime Database (drzewko + typy)
```text
root
└── datavault (obiekt)
    └── live (obiekt)
        ├── schemaVersion (string) = "datavault-firebase-import-v1"
        ├── createdAt (string, ISO datetime)
        ├── source (string)
        └── dataJson (string, pełny JSON zapisany jako tekst)
```

## 3) Pełny skrypt Node.js (do skopiowania)
Zapisz jako `shared/init-rtdb-datavault-live.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do pliku JSON konta serwisowego.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Ustaw FIREBASE_DATABASE_URL, np. https://twoj-projekt-default-rtdb.europe-west1.firebasedatabase.app");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "node-bootstrap",
  dataJson: JSON.stringify({
    meta: {
      note: "Wstaw tutaj docelowe dane DataVault jako JSON."
    }
  })
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Utworzono / zaktualizowano ścieżkę datavault/live w Realtime Database");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## 4) Uruchomienie skryptu
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
export FIREBASE_DATABASE_URL="https://twoj-projekt-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

## 5) Ważne uwagi zgodności
- `dataJson` musi być **stringiem JSON**, nie surowym obiektem.
- `schemaVersion` musi mieć wartość `datavault-firebase-import-v1`.
- Jeśli używasz eksportu z DataVault, wklej dokładną zawartość jako `dataJson`.

---

# 🇬🇧 Firebase guide for `shared/` folder (EN)

## Purpose
This file includes a full Node.js script that creates the **Realtime Database** structure required by the shared data loader.

## 1) `shared/firebase-config.js`
Fill in:
- `window.WG_FIREBASE_CONFIG` (Firebase web config),
- `window.WG_DATA_ACCESS_EMAIL` (technical user email from Firebase Authentication).

## 2) Realtime Database structure (tree + field types)
```text
root
└── datavault (object)
    └── live (object)
        ├── schemaVersion (string) = "datavault-firebase-import-v1"
        ├── createdAt (string, ISO datetime)
        ├── source (string)
        └── dataJson (string, full JSON serialized as text)
```

## 3) Full Node.js script (copy-paste)
Save as `shared/init-rtdb-datavault-live.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Set FIREBASE_DATABASE_URL, e.g. https://your-project-default-rtdb.europe-west1.firebasedatabase.app");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "node-bootstrap",
  dataJson: JSON.stringify({
    meta: { note: "Put the final DataVault JSON payload here." }
  })
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Created / updated datavault/live in Realtime Database");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## 4) How to run
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
export FIREBASE_DATABASE_URL="https://your-project-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

## 5) Compatibility notes
- `dataJson` must be a **JSON string**, not a raw object.
- `schemaVersion` must be `datavault-firebase-import-v1`.
- If you use DataVault export, paste it exactly into `dataJson`.

# 🇵🇱 Konfiguracja Firebase — DataVault (PL)

## Do czego moduł używa Firebase

`DataVault` używa Firebase jako prywatnego magazynu danych arkuszy z `Repozytorium.xlsx`.

Moduł ma dwa główne przepływy związane z Firebase:

1. **Odczyt prywatnych danych** — zwykły widok DataVault pokazuje ekran dostępu K.O.Z.A., loguje użytkownika przez Firebase Authentication i odczytuje dane z Realtime Database.
2. **Przygotowanie danych do importu** — tryb admina pozwala wybrać lokalny plik `Repozytorium.xlsx`, wygenerować `data.json` jako backup oraz `firebase-import.json` gotowy do importu w root Firebase Realtime Database.

Dane importowane do Firebase trafiają pod ścieżkę:

```text
datavault/live
```

## Ważna uwaga o konfiguracji

`DataVault` nie używa osobnego pliku:

```text
DataVault/config/firebase-config.js
```

Aktualny kod ładuje wspólną konfigurację z:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

Ten plik jest modułową instrukcją Firebase dla `DataVault`, ale szczegóły wspólnej warstwy Firebase powinny być utrzymywane także w:

```text
shared/FirebaseREADME.md
```

## Używane usługi Firebase

- Firebase Authentication: tak.
- Realtime Database: tak.
- Firestore: nie w aktualnym przepływie DataVault.
- Storage: nie.

Authentication służy do weryfikacji Litanii Dostępu wpisanej przez użytkownika.

Realtime Database przechowuje aktualny prywatny zestaw danych DataVault.

## Czy Firebase jest wymagany

Tak, Firebase jest wymagany do normalnego odczytu prywatnych danych.

Bez poprawnej konfiguracji Firebase:

- ekran K.O.Z.A. nie przepuści użytkownika,
- `loadDataVaultLive()` nie pobierze danych,
- tabela nie zostanie zbudowana,
- użytkownik zobaczy pusty stan lub komunikat błędu.

Tryb admina może nadal wygenerować pliki `data.json` i `firebase-import.json` z lokalnego pliku XLSX, ale samo opublikowanie danych wymaga importu do Firebase Realtime Database.

## Plik konfiguracyjny

Konfiguracja znajduje się w:

```text
shared/firebase-config.js
```

Plik musi ustawić:

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "TU_WSTAW_API_KEY",
  authDomain: "TU_WSTAW_AUTH_DOMAIN",
  databaseURL: "TU_WSTAW_DATABASE_URL",
  projectId: "TU_WSTAW_PROJECT_ID",
  storageBucket: "TU_WSTAW_STORAGE_BUCKET",
  messagingSenderId: "TU_WSTAW_MESSAGING_SENDER_ID",
  appId: "TU_WSTAW_APP_ID"
};

window.WG_DATA_ACCESS_EMAIL = "TU_WSTAW_EMAIL_TECHNICZNY";
```

Hasło nie jest zapisywane w repozytorium. Użytkownik wpisuje hasło w formularzu K.O.Z.A.

## Jak uzyskać dane konfiguracyjne

1. Otwórz Firebase Console.
2. Utwórz projekt albo wybierz projekt przeznaczony dla tej grupy lub serwera.
3. Dodaj aplikację typu Web.
4. Skopiuj konfigurację Firebase SDK.
5. Wklej wartości do `shared/firebase-config.js` jako `window.WG_FIREBASE_CONFIG`.
6. Włącz Firebase Authentication.
7. Włącz metodę logowania Email/Password.
8. Utwórz użytkownika technicznego z adresem wpisanym w `window.WG_DATA_ACCESS_EMAIL`.
9. Włącz Realtime Database.
10. Ustaw reguły Realtime Database dla ścieżki `datavault/live`.
11. Zaimportuj `firebase-import.json` wygenerowany przez DataVault.

Każda grupa lub każdy serwer powinien mieć własny projekt Firebase i własny komplet wartości konfiguracyjnych.

## Struktura Realtime Database

Po imporcie root-ready `firebase-import.json` struktura danych wygląda tak:

```text
Realtime Database
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson
```

## Model `datavault/live`

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `schemaVersion` | `string` | tak | Wersja wrappera importu. Aktualnie `datavault-firebase-import-v1`. |
| `createdAt` | `string` | tak | Data wygenerowania importu w formacie ISO. |
| `source` | `string` | tak | Źródłowy plik, zwykle `Repozytorium.xlsx`. |
| `dataJson` | `string` | tak | Zserializowany JSON właściwych danych DataVault. |

`dataJson` jest stringiem, ponieważ plik importu jest przygotowany jako bezpieczny root-ready import do Firebase Realtime Database. Właściwe dane są rozpakowywane przez `shared/firebase-data-loader.js`.

## Model danych po rozpakowaniu `dataJson`

Po rozpakowaniu `dataJson` aplikacja oczekuje danych w strukturze:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

Najważniejsze części:

| Pole | Typ | Opis |
| --- | --- | --- |
| `sheets` | `map` | Główne arkusze danych. Kluczami są nazwy zakładek, np. `Bronie`, `Pancerze`, `Bestiariusz`. |
| `_meta.traits` | `map` | Opisy cech. |
| `_meta.states` | `map` | Opisy stanów. |
| `_meta.vehicleTraits` | `map` | Opisy cech pojazdów. |
| `_meta.vehicleWeaponTraits` | `map` | Opisy cech broni pojazdów. |
| `_meta.vehicleStates` | `map` | Opisy stanów pojazdów. |
| `_meta.sheetOrder` | `array<string>` | Kolejność arkuszy z pliku XLSX. |
| `_meta.columnOrder` | `map` | Kolejność kolumn dla arkuszy. |

## Generowanie `firebase-import.json`

W trybie admina przycisk:

```text
Generuj pliki danych
```

otwiera wybór lokalnego pliku `Repozytorium.xlsx`.

Po wybraniu pliku aplikacja:

1. odczytuje XLSX przez parser kanoniczny,
2. buduje obiekt `data.json`,
3. buduje obiekt importu Firebase,
4. waliduje import,
5. pobiera lokalnie `data.json`,
6. pobiera lokalnie `firebase-import.json`,
7. aktualizuje widok roboczy w przeglądarce.

Wygenerowany `firebase-import.json` ma strukturę:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "2026-06-16T00:00:00.000Z",
      "source": "Repozytorium.xlsx",
      "dataJson": "{...}"
    }
  }
}
```

Plik należy importować w Firebase Console na poziomie root Realtime Database, ponieważ sam zawiera klucz `datavault`.

## Walidacja importu

Kod waliduje `firebase-import.json` przed pobraniem pliku.

Walidacja sprawdza między innymi:

- czy root zawiera tylko klucz `datavault`,
- czy `datavault` zawiera tylko klucz `live`,
- czy payload zawiera poprawne `schemaVersion`,
- czy `dataJson` jest stringiem,
- czy rozpakowanie `dataJson` daje dane identyczne z wygenerowanym `data.json`,
- czy klucze importu nie zawierają znaków zakazanych przez Realtime Database.

Kod celowo nie sprawdza kluczy wewnątrz `dataJson`, ponieważ `dataJson` jest stringiem i nie jest bezpośrednim drzewem kluczy Realtime Database.

## Skrypt inicjalizujący Realtime Database

Poniższy skrypt tworzy pusty, poprawny technicznie dokument `datavault/live`. Nie zastępuje importu prawdziwych danych z `Repozytorium.xlsx`, ale pozwala sprawdzić, czy projekt Firebase i reguły działają.

Zapisz jako:

```text
DataVault/config/init-realtime-database.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do pliku JSON konta serwisowego.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Ustaw FIREBASE_DATABASE_URL na adres Realtime Database.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const emptyData = {
  sheets: {},
  _meta: {
    traits: {},
    states: {},
    vehicleTraits: {},
    vehicleWeaponTraits: {},
    vehicleStates: {},
    sheetOrder: [],
    columnOrder: {}
  }
};

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "init-realtime-database.js",
  dataJson: JSON.stringify(emptyData)
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Utworzono datavault/live");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## Uruchomienie skryptu

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
export FIREBASE_DATABASE_URL="https://TWOJ_PROJEKT-default-rtdb.europe-west1.firebasedatabase.app"
node DataVault/config/init-realtime-database.js
```

W PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
$env:FIREBASE_DATABASE_URL="https://TWOJ_PROJEKT-default-rtdb.europe-west1.firebasedatabase.app"
node DataVault/config/init-realtime-database.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Reguły Realtime Database

Aktualny kod wymaga, aby zalogowany użytkownik mógł odczytać `datavault/live`.

Przykładowe reguły testowe dla izolowanego projektu:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": false
      }
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

Powyższe reguły pozwalają każdemu zalogowanemu użytkownikowi projektu odczytać `datavault/live`, ale blokują zapis z aplikacji klienckiej. Aktualizacja danych odbywa się przez import w Firebase Console albo przez narzędzie administracyjne z kontem serwisowym.

Dla produkcji można zawęzić reguły do konkretnego UID użytkownika technicznego.

## Test dostępu użytkownika

1. Skonfiguruj `shared/firebase-config.js`.
2. Włącz Authentication Email/Password.
3. Utwórz użytkownika technicznego zgodnego z `window.WG_DATA_ACCESS_EMAIL`.
4. Włącz Realtime Database.
5. Zaimportuj `firebase-import.json` do root Realtime Database albo uruchom skrypt inicjalizujący.
6. Otwórz `DataVault/index.html`.
7. Wpisz Litanię Dostępu.
8. Sprawdź, czy ekran K.O.Z.A. znika.
9. Sprawdź, czy status pokazuje załadowanie danych z prywatnej bazy.
10. Sprawdź, czy pojawiają się zakładki arkuszy.

## Test generowania danych przez admina

1. Otwórz `DataVault/index.html?admin=1`.
2. Kliknij `Generuj pliki danych`.
3. Wybierz lokalny plik `Repozytorium.xlsx`.
4. Sprawdź, czy przeglądarka pobiera `data.json`.
5. Sprawdź, czy przeglądarka pobiera `firebase-import.json`.
6. Zaimportuj `firebase-import.json` w Firebase Console na poziomie root Realtime Database.
7. Otwórz zwykły widok DataVault.
8. Zaloguj się przez K.O.Z.A.
9. Sprawdź, czy dane z nowego importu są widoczne.

## Typowe błędy

| Objaw | Możliwa przyczyna | Rozwiązanie |
| --- | --- | --- |
| Ekran K.O.Z.A. nie przepuszcza użytkownika | Błędne hasło, brak użytkownika technicznego, wyłączone Email/Password albo zła konfiguracja Auth. | Sprawdź Authentication i `window.WG_DATA_ACCESS_EMAIL`. |
| Komunikat o brakującym `apiKey`, `authDomain`, `databaseURL` albo `projectId` | Niepełny `shared/firebase-config.js`. | Uzupełnij `window.WG_FIREBASE_CONFIG`. |
| Komunikat o braku technicznego e-maila | Brak `window.WG_DATA_ACCESS_EMAIL`. | Ustaw e-mail użytkownika technicznego. |
| `DATA_NOT_FOUND` | Brak danych pod `datavault/live`. | Zaimportuj `firebase-import.json` albo uruchom skrypt inicjalizujący. |
| `permission_denied` | Reguły RTDB blokują odczyt. | Sprawdź reguły Realtime Database i zalogowanego użytkownika. |
| Błąd parsowania `dataJson` | Wrapper w Firebase jest uszkodzony albo `dataJson` nie jest poprawnym JSON-em. | Wygeneruj i zaimportuj nowy `firebase-import.json`. |
| Po imporcie dane nie pojawiają się pod `datavault/live` | Import wykonano w złym miejscu albo plik nie był root-ready. | Importuj wygenerowany `firebase-import.json` w root Realtime Database. |
| Admin nie widzi przycisku generowania danych | Brak parametru admina. | Otwórz `DataVault/index.html?admin=1`. |
| GeneratorNPC nie widzi nowych danych | GeneratorNPC korzysta z tej samej ścieżki `datavault/live`, ale sesja lub import są stare. | Odśwież GeneratorNPC po imporcie danych i sprawdź `shared/firebase-config.js`. |

---

# 🇬🇧 Firebase setup — DataVault (EN)

## What this module uses Firebase for

`DataVault` uses Firebase as the private storage for sheet data generated from `Repozytorium.xlsx`.

The module has two main Firebase-related flows:

1. **Private data reading** — the normal DataVault view shows the K.O.Z.A. access gate, signs the user in through Firebase Authentication, and reads data from Realtime Database.
2. **Data import preparation** — admin mode lets the user choose a local `Repozytorium.xlsx` file and generate `data.json` as a backup plus `firebase-import.json` ready to import at the Firebase Realtime Database root.

Imported Firebase data is stored under:

```text
datavault/live
```

## Important configuration note

`DataVault` does not use a separate file:

```text
DataVault/config/firebase-config.js
```

The current code loads shared configuration from:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

This file is the module-level Firebase guide for `DataVault`, but the details of the shared Firebase layer should also be maintained in:

```text
shared/FirebaseREADME.md
```

## Firebase services used

- Firebase Authentication: yes.
- Realtime Database: yes.
- Firestore: not in the current DataVault flow.
- Storage: no.

Authentication verifies the Litany of Access entered by the user.

Realtime Database stores the current private DataVault dataset.

## Whether Firebase is required

Yes. Firebase is required for normal private data reading.

Without a valid Firebase configuration:

- the K.O.Z.A. access gate will not let the user through,
- `loadDataVaultLive()` will not fetch data,
- the table will not be built,
- the user will see an empty state or an error message.

Admin mode can still generate `data.json` and `firebase-import.json` from a local XLSX file, but publishing the data requires importing it into Firebase Realtime Database.

## Configuration file

Configuration is stored in:

```text
shared/firebase-config.js
```

The file must define:

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "PUT_API_KEY_HERE",
  authDomain: "PUT_AUTH_DOMAIN_HERE",
  databaseURL: "PUT_DATABASE_URL_HERE",
  projectId: "PUT_PROJECT_ID_HERE",
  storageBucket: "PUT_STORAGE_BUCKET_HERE",
  messagingSenderId: "PUT_MESSAGING_SENDER_ID_HERE",
  appId: "PUT_APP_ID_HERE"
};

window.WG_DATA_ACCESS_EMAIL = "PUT_TECHNICAL_EMAIL_HERE";
```

The password is not stored in the repository. The user enters it in the K.O.Z.A. form.

## How to get configuration data

1. Open Firebase Console.
2. Create a project or select a project for this group or server.
3. Add a Web app.
4. Copy the Firebase SDK configuration.
5. Paste the values into `shared/firebase-config.js` as `window.WG_FIREBASE_CONFIG`.
6. Enable Firebase Authentication.
7. Enable Email/Password sign-in.
8. Create a technical user with the e-mail stored in `window.WG_DATA_ACCESS_EMAIL`.
9. Enable Realtime Database.
10. Set Realtime Database rules for `datavault/live`.
11. Import `firebase-import.json` generated by DataVault.

Each group or server should use its own Firebase project and configuration values.

## Realtime Database structure

After importing the root-ready `firebase-import.json`, the data structure is:

```text
Realtime Database
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson
```

## `datavault/live` model

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schemaVersion` | `string` | yes | Import wrapper version. Currently `datavault-firebase-import-v1`. |
| `createdAt` | `string` | yes | Import generation date in ISO format. |
| `source` | `string` | yes | Source file, usually `Repozytorium.xlsx`. |
| `dataJson` | `string` | yes | Serialized JSON of the actual DataVault data. |

`dataJson` is a string because the import file is built as a safe root-ready Firebase Realtime Database import. The actual data is unwrapped by `shared/firebase-data-loader.js`.

## Data model after unwrapping `dataJson`

After unwrapping `dataJson`, the application expects:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

Key parts:

| Field | Type | Description |
| --- | --- | --- |
| `sheets` | `map` | Main data sheets. Keys are tab names, such as `Bronie`, `Pancerze`, `Bestiariusz`. |
| `_meta.traits` | `map` | Trait descriptions. |
| `_meta.states` | `map` | State descriptions. |
| `_meta.vehicleTraits` | `map` | Vehicle trait descriptions. |
| `_meta.vehicleWeaponTraits` | `map` | Vehicle weapon trait descriptions. |
| `_meta.vehicleStates` | `map` | Vehicle state descriptions. |
| `_meta.sheetOrder` | `array<string>` | Sheet order from the XLSX file. |
| `_meta.columnOrder` | `map` | Column order for sheets. |

## Generating `firebase-import.json`

In admin mode, the button:

```text
Generuj pliki danych
```

opens a local `Repozytorium.xlsx` file picker.

After a file is selected, the app:

1. reads XLSX through the canonical parser,
2. builds the `data.json` object,
3. builds the Firebase import object,
4. validates the import,
5. downloads `data.json`,
6. downloads `firebase-import.json`,
7. updates the working view in the browser.

The generated `firebase-import.json` has this structure:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "2026-06-16T00:00:00.000Z",
      "source": "Repozytorium.xlsx",
      "dataJson": "{...}"
    }
  }
}
```

Import this file in Firebase Console at the Realtime Database root, because the file itself contains the `datavault` key.

## Import validation

The code validates `firebase-import.json` before downloading it.

Validation checks include:

- root contains only the `datavault` key,
- `datavault` contains only the `live` key,
- payload has the correct `schemaVersion`,
- `dataJson` is a string,
- unwrapped `dataJson` matches the generated `data.json`,
- import-tree keys do not contain characters forbidden by Realtime Database.

The code intentionally does not check keys inside `dataJson`, because `dataJson` is a string and is not a direct Realtime Database key tree.

## Realtime Database initialization script

The following script creates an empty but technically valid `datavault/live` node. It does not replace importing real data from `Repozytorium.xlsx`, but it lets you test whether the Firebase project and rules work.

Save as:

```text
DataVault/config/init-realtime-database.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Set FIREBASE_DATABASE_URL to your Realtime Database URL.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const emptyData = {
  sheets: {},
  _meta: {
    traits: {},
    states: {},
    vehicleTraits: {},
    vehicleWeaponTraits: {},
    vehicleStates: {},
    sheetOrder: [],
    columnOrder: {}
  }
};

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "init-realtime-database.js",
  dataJson: JSON.stringify(emptyData)
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Created datavault/live");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## Running the script

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
export FIREBASE_DATABASE_URL="https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app"
node DataVault/config/init-realtime-database.js
```

In PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
$env:FIREBASE_DATABASE_URL="https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app"
node DataVault/config/init-realtime-database.js
```

Do not commit the service account file to the repository.

## Realtime Database rules

The current code requires the signed-in user to read `datavault/live`.

Example test rules for an isolated project:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": false
      }
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

These rules allow any signed-in user of the project to read `datavault/live`, but block client-side writes. Data updates are done through Firebase Console import or an admin tool with a service account.

For production, you can restrict the rules to the specific UID of the technical user.

## User access test

1. Configure `shared/firebase-config.js`.
2. Enable Authentication Email/Password.
3. Create a technical user matching `window.WG_DATA_ACCESS_EMAIL`.
4. Enable Realtime Database.
5. Import `firebase-import.json` at the Realtime Database root or run the initialization script.
6. Open `DataVault/index.html`.
7. Enter the Litany of Access.
8. Check that the K.O.Z.A. access gate disappears.
9. Check that the status shows data loaded from the private database.
10. Check that sheet tabs appear.

## Admin data generation test

1. Open `DataVault/index.html?admin=1`.
2. Click `Generuj pliki danych`.
3. Select a local `Repozytorium.xlsx` file.
4. Check that the browser downloads `data.json`.
5. Check that the browser downloads `firebase-import.json`.
6. Import `firebase-import.json` in Firebase Console at the Realtime Database root.
7. Open the normal DataVault view.
8. Sign in through K.O.Z.A.
9. Check that the new imported data is visible.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| K.O.Z.A. access gate does not let the user through | Wrong password, missing technical user, disabled Email/Password, or invalid Auth configuration. | Check Authentication and `window.WG_DATA_ACCESS_EMAIL`. |
| Missing `apiKey`, `authDomain`, `databaseURL`, or `projectId` message | Incomplete `shared/firebase-config.js`. | Complete `window.WG_FIREBASE_CONFIG`. |
| Missing technical e-mail message | Missing `window.WG_DATA_ACCESS_EMAIL`. | Set the technical user e-mail. |
| `DATA_NOT_FOUND` | No data under `datavault/live`. | Import `firebase-import.json` or run the initialization script. |
| `permission_denied` | RTDB rules block reads. | Check Realtime Database rules and signed-in user. |
| `dataJson` parse error | Firebase wrapper is damaged or `dataJson` is not valid JSON. | Generate and import a new `firebase-import.json`. |
| After import, data does not appear under `datavault/live` | Import was done in the wrong place or the file was not root-ready. | Import the generated `firebase-import.json` at the Realtime Database root. |
| Admin does not see the data generation button | Missing admin parameter. | Open `DataVault/index.html?admin=1`. |
| GeneratorNPC does not see new data | GeneratorNPC uses the same `datavault/live` path, but session or import is stale. | Refresh GeneratorNPC after importing data and check `shared/firebase-config.js`. |

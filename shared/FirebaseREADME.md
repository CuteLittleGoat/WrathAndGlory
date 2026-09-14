# 🇵🇱 Instrukcja Firebase — wspólne prywatne dane DataVault (PL)

## Cel dokumentu

Ten dokument opisuje wspólną warstwę Firebase używaną do prywatnych danych DataVault.

Dotyczy plików:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

Warstwa ta jest używana przez moduły, które potrzebują prywatnych danych z DataVault, przede wszystkim:

- `DataVault`,
- `GeneratorNPC`.

Ten dokument nie opisuje:

- Firestore ulubionych `GeneratorNPC`,
- Firestore modułu `Audio`,
- Firestore modułu `Infoczytnik`,
- Firestore zapisu postaci w `Kalkulator`.

Te moduły mają własne pliki `config/FirebaseREADME.md`.

## Rola wspólnej warstwy

`shared/firebase-data-loader.js` odpowiada za:

- sprawdzenie konfiguracji `window.WG_FIREBASE_CONFIG`,
- sprawdzenie technicznego e-maila `window.WG_DATA_ACCESS_EMAIL`,
- utworzenie nazwanej aplikacji Firebase,
- konfigurację Firebase Authentication,
- ustawienie trwałości sesji Auth w przeglądarce,
- logowanie użytkownika hasłem wpisanym w bramce K.O.Z.A.,
- odczyt danych z Firebase Realtime Database,
- rozpakowanie wrappera `dataJson`,
- udostępnienie czytelnych komunikatów błędów PL/EN,
- wystawienie globalnego API `window.DataVaultFirebase`.

## Używane usługi Firebase

- Firebase Authentication: tak.
- Realtime Database: tak.
- Firestore: nie w tej warstwie.
- Storage: nie.
- App Check (reCAPTCHA Enterprise): tak.

## App Check i klucze witryny

Aplikacja korzysta z **dwóch** projektów Firebase, a klucz reCAPTCHA Enterprise należy do
konkretnego projektu. Oba klucze są zapisane w jednym pliku:

```text
shared/appcheck-config.js
```

Plik ustawia mapę `window.WG_APPCHECK_SITE_KEYS` (`projectId` → klucz witryny) oraz pomocniczą
funkcję `window.WG_getAppCheckSiteKey(projectId)`. Moduły **nie** trzymają własnych kopii kluczy —
przy zmianie klucza albo domeny poprawia się wyłącznie ten jeden plik.

Uruchamianie App Check dla aplikacji Firebase w zapisie modularnym (SDK 12.6.0) jest we wspólnym
pliku `shared/firebase-app-check.js`, w funkcji `activateAppCheck(app)`. Funkcja dobiera klucz na
podstawie `app.options.projectId`, więc to samo wywołanie obsługuje oba projekty.

Klucz witryny nie jest sekretem — tak samo jak `apiKey` musi trafić do kodu strony.

**Warunek konieczny:** biblioteka reCAPTCHA Enterprise musi być wczytana, zanim `activateAppCheck()`
zostanie wywołane. Każda strona korzystająca z App Check ma dlatego znacznik
`<script defer src="https://www.google.com/recaptcha/enterprise.js">` umieszczony przed skryptami
modularnymi. Nie wolno zostawiać wczytywania tej biblioteki samemu SDK: Firebase dokłada własny
znacznik `<script>` wyłącznie z obsługą poprawnego wczytania, bez obsługi błędu, więc przy
zablokowanym adresie czeka bez końca i blokuje wszystkie zapytania do bazy.

Uruchomienie App Check nie jest krytyczne. Brak klucza albo brak biblioteki reCAPTCHA kończą się
ostrzeżeniem w konsoli i pominięciem App Check — moduł pracuje wtedy tak jak bez niego.

### Wersja zgodnościowa (compat)

Moduły, które wczytują Firebase w zapisie zgodnościowym — oba Kreatory Postaci (SDK 12.6.0)
i Infoczytnik (SDK 9.6.8) — używają pliku:

```text
shared/firebase-app-check-compat.js
```

Plik udostępnia `window.WG_activateAppCheckCompat(firebase)`. Wywołanie dobiera klucz z tej samej
mapy `WG_APPCHECK_SITE_KEYS`, sprawdza obecność `firebase.appCheck.ReCaptchaEnterpriseProvider`
oraz `window.grecaptcha.enterprise`, a każdą aplikację uruchamia najwyżej raz. Tak jak w wersji
modularnej, niepowodzenie kończy się ostrzeżeniem w konsoli, a nie zatrzymaniem modułu.

Strona musi wczytać `https://www.gstatic.com/firebasejs/<wersja>/firebase-app-check-compat.js`,
`shared/appcheck-config.js`, bibliotekę reCAPTCHA Enterprise i dopiero potem ten plik.

## Odwzorowanie reguł Firestore w repozytorium

W `shared/` leżą dwa pliki z regułami Firestore:

```text
shared/firestore-wh40k-data-slate.rules
shared/firestore-audiorpg.rules
```

Są to **odwzorowania reguł wgranych w konsoli Firebase**, trzymane w repozytorium po to, żeby stan
zabezpieczeń obu baz dało się przejrzeć i porównać, czytając samo repozytorium. Zapisanie tych
plików **nie zmienia niczego w Firebase** — reguły publikuje się w konsoli albo przez Firebase CLI.

Każdy plik zaczyna się ostrzeżeniem o kolejności prac: warunek `request.app != null` jest sam w sobie
wymuszaniem App Check i działa niezależnie od przełącznika `Enforce`, więc nie wolno go wgrywać,
zanim wszystkie moduły zaczną wysyłać znaczniki. Docelowa treść reguł i właściwa kolejność kroków
są w `Analizy/audyt-kodu-aplikacji-2026-09-10.md`, rozdz. 9.8.

## Plik konfiguracyjny

Konfigurację należy umieścić w:

```text
shared/firebase-config.js
```

Plik musi ustawić globalne wartości:

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

Nie używaj `export`. Plik jest ładowany jako klasyczny skrypt, a loader odczytuje dane z `window`.

Hasło nie jest zapisywane w repozytorium. Użytkownik wpisuje je w formularzu K.O.Z.A.

## Wymagane pola konfiguracji

`assertFirebaseRuntimeConfig()` wymaga:

| Pole | Źródło | Błąd przy braku |
| --- | --- | --- |
| `window.WG_FIREBASE_CONFIG` | `shared/firebase-config.js` | `MISSING_WG_FIREBASE_CONFIG` |
| `apiKey` | `window.WG_FIREBASE_CONFIG.apiKey` | `MISSING_FIREBASE_API_KEY` |
| `authDomain` | `window.WG_FIREBASE_CONFIG.authDomain` | `MISSING_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `window.WG_FIREBASE_CONFIG.databaseURL` | `MISSING_FIREBASE_DATABASE_URL` |
| `projectId` | `window.WG_FIREBASE_CONFIG.projectId` | `MISSING_FIREBASE_PROJECT_ID` |
| `window.WG_DATA_ACCESS_EMAIL` | `shared/firebase-config.js` | `MISSING_DATA_ACCESS_EMAIL` |

## Nazwana aplikacja Firebase

Loader używa nazwanej aplikacji:

```text
wh40k-data-slate-private-data
```

Stała w kodzie:

```text
PRIVATE_DATA_APP_NAME
```

Dzięki temu prywatne dane DataVault mogą działać obok innych konfiguracji Firebase używanych przez osobne moduły, np. Firestore ulubionych `GeneratorNPC` albo Firestore `Audio`.

## Ścieżka danych

Loader czyta Realtime Database z:

```text
datavault/live
```

Stała w kodzie:

```text
DATA_PATH
```

## Struktura Realtime Database

Po imporcie poprawna struktura wygląda tak:

```text
Realtime Database
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson
```

Model `datavault/live`:

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `schemaVersion` | `string` | tak | Wersja wrappera. Aktualnie `datavault-firebase-import-v1`. |
| `createdAt` | `string` | tak | Data wygenerowania importu w ISO. |
| `source` | `string` | tak | Źródło danych, zwykle `Repozytorium.xlsx`. |
| `dataJson` | `string` | tak | Właściwe dane DataVault zapisane jako zserializowany JSON. |

## Dane po rozpakowaniu `dataJson`

`unwrapDataVaultPayload(v)` sprawdza, czy payload ma:

```text
schemaVersion = datavault-firebase-import-v1
dataJson = string
```

Jeżeli tak, wykonuje `JSON.parse(dataJson)` i zwraca właściwe dane.

Po rozpakowaniu moduły oczekują struktury:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

`DataVault` korzysta z wielu arkuszy i metadanych. `GeneratorNPC` wymaga konkretnych arkuszy, między innymi `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika`, `Modlitwy`.

## Import `firebase-import.json` z DataVault

Moduł `DataVault` w trybie admina generuje root-ready plik:

```text
firebase-import.json
```

Jego zewnętrzna struktura wygląda tak:

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

Import wykonuj na poziomie root Realtime Database, czyli `/`.

Nie importuj tego pliku bezpośrednio do `/datavault/live`, bo powstanie błędne zagnieżdżenie:

```text
datavault/live/datavault/live
```

## Publiczne API loadera

Po załadowaniu `shared/firebase-data-loader.js` dostępne jest:

```text
window.DataVaultFirebase
window.DataVaultFirebaseReady
```

Loader wysyła też event:

```text
datavault-firebase-loader-ready
```

`window.DataVaultFirebase` zawiera:

| Funkcja | Rola |
| --- | --- |
| `initFirebaseDataAccess()` | Inicjalizuje named app, Auth, Database i persistence. |
| `waitForAuthReady()` | Czeka na stan Firebase Auth i zwraca aktualnego użytkownika albo `null`. |
| `getCurrentUser()` | Zwraca aktualnego użytkownika Auth. |
| `loginWithGroupPassword(password)` | Loguje użytkownika technicznym e-mailem i wpisanym hasłem. |
| `logoutDataAccess()` | Wylogowuje z prywatnych danych. |
| `loadDataVaultLive()` | Odczytuje `datavault/live`, wymaga zalogowanego użytkownika. |
| `unwrapDataVaultPayload(value)` | Rozpakowuje wrapper `dataJson`. |
| `getReadableAccessError(error, lang)` | Zwraca czytelny komunikat błędu PL/EN. |

## Przepływ logowania i odczytu

Typowy przepływ modułu używającego loadera:

1. Załaduj `shared/firebase-config.js`.
2. Załaduj `shared/firebase-data-loader.js` jako moduł.
3. Poczekaj na `window.DataVaultFirebaseReady` albo event `datavault-firebase-loader-ready`.
4. Wywołaj `initFirebaseDataAccess()`.
5. Wywołaj `waitForAuthReady()`.
6. Jeżeli użytkownik nie jest zalogowany, pokaż bramkę K.O.Z.A.
7. Po wpisaniu hasła wywołaj `loginWithGroupPassword(password)`.
8. Wywołaj `loadDataVaultLive()`.
9. Sprawdź, czy wynik ma oczekiwaną strukturę `sheets`.
10. Renderuj dane w module.

## Trwałość sesji Auth

Loader ustawia:

```text
browserLocalPersistence
```

Oznacza to, że sesja Auth może przetrwać odświeżenie strony w tej samej przeglądarce, dopóki użytkownik nie zostanie wylogowany albo sesja nie wygaśnie.

## Reguły Realtime Database

Minimalne reguły testowe dla izolowanego projektu:

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

Te reguły:

- pozwalają zalogowanemu użytkownikowi odczytać `datavault/live`,
- blokują zapis z aplikacji klienckiej,
- blokują wszystkie inne ścieżki.

W produkcji można ograniczyć odczyt do konkretnego UID użytkownika technicznego.

## Skrypt inicjalizujący Realtime Database

Poniższy skrypt tworzy pusty, poprawny technicznie payload `datavault/live`. Nie zastępuje prawdziwego importu danych z `Repozytorium.xlsx`, ale pozwala sprawdzić konfigurację projektu i reguły.

Zapisz jako:

```text
shared/init-rtdb-datavault-live.js
```

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

const emptyDataVault = {
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
  source: "shared/init-rtdb-datavault-live.js",
  dataJson: JSON.stringify(emptyDataVault)
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

## Uruchomienie skryptu

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
export FIREBASE_DATABASE_URL="https://twoj-projekt-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
$env:FIREBASE_DATABASE_URL="https://twoj-projekt-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Test konfiguracji

1. Uzupełnij `shared/firebase-config.js`.
2. Włącz Firebase Authentication.
3. Włącz metodę Email/Password.
4. Utwórz użytkownika technicznego zgodnego z `window.WG_DATA_ACCESS_EMAIL`.
5. Włącz Realtime Database.
6. Ustaw reguły RTDB dla `datavault/live`.
7. Zaimportuj `firebase-import.json` z DataVault albo uruchom skrypt inicjalizujący.
8. Otwórz moduł `DataVault` lub `GeneratorNPC`.
9. Wpisz Litanię Dostępu w bramce K.O.Z.A.
10. Sprawdź, czy dane zostały załadowane.

## Typowe błędy

| Kod lub objaw | Znaczenie | Rozwiązanie |
| --- | --- | --- |
| `EMPTY_PASSWORD` | Hasło nie zostało wpisane. | Wpisz Litanię Dostępu. |
| `MISSING_WG_FIREBASE_CONFIG` | Brak `window.WG_FIREBASE_CONFIG`. | Uzupełnij `shared/firebase-config.js`. |
| `MISSING_FIREBASE_API_KEY` | Brak `apiKey`. | Uzupełnij konfigurację Firebase Web App. |
| `MISSING_FIREBASE_AUTH_DOMAIN` | Brak `authDomain`. | Uzupełnij konfigurację Firebase Web App. |
| `MISSING_FIREBASE_DATABASE_URL` | Brak `databaseURL`. | Uzupełnij URL Realtime Database. |
| `MISSING_FIREBASE_PROJECT_ID` | Brak `projectId`. | Uzupełnij konfigurację Firebase Web App. |
| `MISSING_DATA_ACCESS_EMAIL` | Brak technicznego e-maila. | Ustaw `window.WG_DATA_ACCESS_EMAIL`. |
| `auth/invalid-credential` | Hasło lub użytkownik są nieprawidłowe. | Sprawdź konto techniczne i hasło. |
| `auth/invalid-api-key` | Błędny `apiKey`. | Sprawdź projekt Firebase. |
| `auth/configuration-not-found` | Auth nie jest skonfigurowany dla projektu. | Włącz Authentication i Email/Password w poprawnym projekcie. |
| `auth/operation-not-allowed` | Email/Password jest wyłączone. | Włącz metodę Email/Password. |
| `NOT_AUTHENTICATED` | Brak aktywnej sesji Auth przy odczycie danych. | Zaloguj się ponownie przez K.O.Z.A. |
| `permission_denied` | Reguły RTDB blokują odczyt. | Sprawdź reguły i UID użytkownika. |
| `DATA_NOT_FOUND` | Brak danych pod `datavault/live`. | Zaimportuj dane albo uruchom skrypt inicjalizujący. |
| `FIREBASE_IMPORT_DATAJSON_PARSE_FAILED` | `dataJson` nie jest poprawnym JSON-em. | Wygeneruj i zaimportuj nowy `firebase-import.json`. |
| `DATAVAULT_DATA_MISSING_SHEETS` | Dane po odczycie nie mają struktury `sheets`. | Sprawdź źródłowy import DataVault. |

---

# 🇬🇧 Firebase guide — shared private DataVault data (EN)

## Document purpose

This document describes the shared Firebase layer used for private DataVault data.

It applies to files:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

This layer is used by modules that need private DataVault data, mainly:

- `DataVault`,
- `GeneratorNPC`.

This document does not describe:

- `GeneratorNPC` favorites Firestore,
- `Audio` module Firestore,
- `Infoczytnik` module Firestore,
- character save Firestore in `Kalkulator`.

Those modules have their own `config/FirebaseREADME.md` files.

## Shared layer role

`shared/firebase-data-loader.js` is responsible for:

- checking `window.WG_FIREBASE_CONFIG`,
- checking technical e-mail `window.WG_DATA_ACCESS_EMAIL`,
- creating a named Firebase app,
- configuring Firebase Authentication,
- setting Auth persistence in the browser,
- signing in with the password entered in the K.O.Z.A. gate,
- reading data from Firebase Realtime Database,
- unwrapping the `dataJson` wrapper,
- exposing readable PL/EN error messages,
- exposing global API `window.DataVaultFirebase`.

## Firebase services used

- Firebase Authentication: yes.
- Realtime Database: yes.
- Firestore: not in this layer.
- Storage: no.
- App Check (reCAPTCHA Enterprise): yes.

## App Check and site keys

The application uses **two** Firebase projects, and a reCAPTCHA Enterprise key belongs to one
specific project. Both keys live in a single file:

```text
shared/appcheck-config.js
```

The file sets the `window.WG_APPCHECK_SITE_KEYS` map (`projectId` → site key) and the helper
`window.WG_getAppCheckSiteKey(projectId)`. Modules do **not** keep their own copies of the keys —
changing a key or a domain means editing this one file only.

App Check activation for Firebase apps in modular form (SDK 12.6.0) lives in the shared
`shared/firebase-app-check.js`, in the `activateAppCheck(app)` function. It picks the key from
`app.options.projectId`, so the same call serves both projects.

A site key is not a secret — like `apiKey` it has to be present in the page source.

**Hard precondition:** the reCAPTCHA Enterprise library must be loaded before `activateAppCheck()`
is called. Every page using App Check therefore carries a
`<script defer src="https://www.google.com/recaptcha/enterprise.js">` tag placed before the module
scripts. Never leave that library for the SDK to load: Firebase appends its own `<script>` tag with
an onload handler only and no error handler, so with a blocked address it waits forever and stalls
every database request.

App Check activation is not critical. A missing key or a missing reCAPTCHA library results in a
console warning and App Check being skipped — the module then works as it does without it.

### Compatibility (compat) form

Modules that load Firebase in compatibility form — both character creators (SDK 12.6.0) and
Infoczytnik (SDK 9.6.8) — use the file:

```text
shared/firebase-app-check-compat.js
```

It exposes `window.WG_activateAppCheckCompat(firebase)`. The call picks the key from the same
`WG_APPCHECK_SITE_KEYS` map, checks that `firebase.appCheck.ReCaptchaEnterpriseProvider` and
`window.grecaptcha.enterprise` exist, and activates each app at most once. As in the modular form,
a failure ends with a console warning rather than a stopped module.

The page has to load `https://www.gstatic.com/firebasejs/<version>/firebase-app-check-compat.js`,
`shared/appcheck-config.js`, the reCAPTCHA Enterprise library, and only then this file.

## Firestore rules mirrored in the repository

Two Firestore rule files live in `shared/`:

```text
shared/firestore-wh40k-data-slate.rules
shared/firestore-audiorpg.rules
```

They **mirror the rules deployed in the Firebase Console** and are kept in the repository so that the
security state of both databases can be reviewed and compared from the repository alone. Saving these
files **changes nothing in Firebase** — rules are published from the console or through the Firebase
CLI.

Each file opens with a warning about ordering: the `request.app != null` condition is App Check
enforcement in itself and works regardless of the `Enforce` switch, so it must not be deployed before
every module sends tokens. The final rule text and the correct step order are in
`Analizy/audyt-kodu-aplikacji-2026-09-10.md`, chapter 9.8.

## Configuration file

Put configuration in:

```text
shared/firebase-config.js
```

The file must define global values:

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

Do not use `export`. The file is loaded as a classic script, and the loader reads values from `window`.

The password is not stored in the repository. The user enters it in the K.O.Z.A. form.

## Required configuration fields

`assertFirebaseRuntimeConfig()` requires:

| Field | Source | Error when missing |
| --- | --- | --- |
| `window.WG_FIREBASE_CONFIG` | `shared/firebase-config.js` | `MISSING_WG_FIREBASE_CONFIG` |
| `apiKey` | `window.WG_FIREBASE_CONFIG.apiKey` | `MISSING_FIREBASE_API_KEY` |
| `authDomain` | `window.WG_FIREBASE_CONFIG.authDomain` | `MISSING_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `window.WG_FIREBASE_CONFIG.databaseURL` | `MISSING_FIREBASE_DATABASE_URL` |
| `projectId` | `window.WG_FIREBASE_CONFIG.projectId` | `MISSING_FIREBASE_PROJECT_ID` |
| `window.WG_DATA_ACCESS_EMAIL` | `shared/firebase-config.js` | `MISSING_DATA_ACCESS_EMAIL` |

## Named Firebase app

The loader uses this named app:

```text
wh40k-data-slate-private-data
```

Code constant:

```text
PRIVATE_DATA_APP_NAME
```

This allows private DataVault data to work alongside other Firebase configurations used by separate modules, such as `GeneratorNPC` favorites Firestore or `Audio` Firestore.

## Data path

The loader reads Realtime Database from:

```text
datavault/live
```

Code constant:

```text
DATA_PATH
```

## Realtime Database structure

After import, the correct structure is:

```text
Realtime Database
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson
```

`datavault/live` model:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schemaVersion` | `string` | yes | Wrapper version. Currently `datavault-firebase-import-v1`. |
| `createdAt` | `string` | yes | Import generation date in ISO format. |
| `source` | `string` | yes | Data source, usually `Repozytorium.xlsx`. |
| `dataJson` | `string` | yes | Actual DataVault data stored as serialized JSON. |

## Data after unwrapping `dataJson`

`unwrapDataVaultPayload(v)` checks whether the payload has:

```text
schemaVersion = datavault-firebase-import-v1
dataJson = string
```

If so, it runs `JSON.parse(dataJson)` and returns the actual data.

After unwrapping, modules expect this structure:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

`DataVault` uses many sheets and metadata. `GeneratorNPC` requires specific sheets, including `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika`, and `Modlitwy`.

## Importing DataVault `firebase-import.json`

The `DataVault` module in admin mode generates this root-ready file:

```text
firebase-import.json
```

Its outer structure looks like this:

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

Import it at the Realtime Database root, `/`.

Do not import this file directly into `/datavault/live`, because it would create incorrect nesting:

```text
datavault/live/datavault/live
```

## Public loader API

After `shared/firebase-data-loader.js` loads, these are available:

```text
window.DataVaultFirebase
window.DataVaultFirebaseReady
```

The loader also dispatches event:

```text
datavault-firebase-loader-ready
```

`window.DataVaultFirebase` contains:

| Function | Role |
| --- | --- |
| `initFirebaseDataAccess()` | Initializes named app, Auth, Database, and persistence. |
| `waitForAuthReady()` | Waits for Firebase Auth state and returns current user or `null`. |
| `getCurrentUser()` | Returns current Auth user. |
| `loginWithGroupPassword(password)` | Signs in with the technical e-mail and entered password. |
| `logoutDataAccess()` | Signs out from private data. |
| `loadDataVaultLive()` | Reads `datavault/live`; requires a signed-in user. |
| `unwrapDataVaultPayload(value)` | Unwraps the `dataJson` wrapper. |
| `getReadableAccessError(error, lang)` | Returns readable PL/EN error message. |

## Login and read flow

Typical flow for a module using the loader:

1. Load `shared/firebase-config.js`.
2. Load `shared/firebase-data-loader.js` as a module.
3. Wait for `window.DataVaultFirebaseReady` or event `datavault-firebase-loader-ready`.
4. Call `initFirebaseDataAccess()`.
5. Call `waitForAuthReady()`.
6. If the user is not signed in, show the K.O.Z.A. gate.
7. After password entry, call `loginWithGroupPassword(password)`.
8. Call `loadDataVaultLive()`.
9. Check whether the result has expected `sheets` structure.
10. Render data in the module.

## Auth persistence

The loader sets:

```text
browserLocalPersistence
```

This means the Auth session can survive page refresh in the same browser until the user signs out or the session expires.

## Realtime Database rules

Minimal test rules for an isolated project:

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

These rules:

- allow a signed-in user to read `datavault/live`,
- block client-side writes,
- block all other paths.

For production, reads can be restricted to the specific UID of the technical user.

## Realtime Database initialization script

The following script creates an empty but technically valid `datavault/live` payload. It does not replace the real data import from `Repozytorium.xlsx`, but it lets you test project configuration and rules.

Save as:

```text
shared/init-rtdb-datavault-live.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file.");
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

const emptyDataVault = {
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
  source: "shared/init-rtdb-datavault-live.js",
  dataJson: JSON.stringify(emptyDataVault)
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

## Running the script

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
export FIREBASE_DATABASE_URL="https://your-project-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
$env:FIREBASE_DATABASE_URL="https://your-project-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

Do not commit the service account file to the repository.

## Configuration test

1. Complete `shared/firebase-config.js`.
2. Enable Firebase Authentication.
3. Enable Email/Password sign-in.
4. Create a technical user matching `window.WG_DATA_ACCESS_EMAIL`.
5. Enable Realtime Database.
6. Set RTDB rules for `datavault/live`.
7. Import `firebase-import.json` from DataVault or run the initialization script.
8. Open `DataVault` or `GeneratorNPC`.
9. Enter the Litany of Access in the K.O.Z.A. gate.
10. Check that data loads.

## Common errors

| Code or symptom | Meaning | Fix |
| --- | --- | --- |
| `EMPTY_PASSWORD` | Password was not entered. | Enter the Litany of Access. |
| `MISSING_WG_FIREBASE_CONFIG` | Missing `window.WG_FIREBASE_CONFIG`. | Complete `shared/firebase-config.js`. |
| `MISSING_FIREBASE_API_KEY` | Missing `apiKey`. | Complete Firebase Web App configuration. |
| `MISSING_FIREBASE_AUTH_DOMAIN` | Missing `authDomain`. | Complete Firebase Web App configuration. |
| `MISSING_FIREBASE_DATABASE_URL` | Missing `databaseURL`. | Complete Realtime Database URL. |
| `MISSING_FIREBASE_PROJECT_ID` | Missing `projectId`. | Complete Firebase Web App configuration. |
| `MISSING_DATA_ACCESS_EMAIL` | Missing technical e-mail. | Set `window.WG_DATA_ACCESS_EMAIL`. |
| `auth/invalid-credential` | Password or user is invalid. | Check technical account and password. |
| `auth/invalid-api-key` | Invalid `apiKey`. | Check Firebase project. |
| `auth/configuration-not-found` | Auth is not configured for the project. | Enable Authentication and Email/Password in the correct project. |
| `auth/operation-not-allowed` | Email/Password is disabled. | Enable Email/Password method. |
| `NOT_AUTHENTICATED` | No active Auth session while reading data. | Sign in again through K.O.Z.A. |
| `permission_denied` | RTDB rules block read. | Check rules and user UID. |
| `DATA_NOT_FOUND` | No data under `datavault/live`. | Import data or run initialization script. |
| `FIREBASE_IMPORT_DATAJSON_PARSE_FAILED` | `dataJson` is not valid JSON. | Generate and import a new `firebase-import.json`. |
| `DATAVAULT_DATA_MISSING_SHEETS` | Read data has no `sheets` structure. | Check DataVault source import. |

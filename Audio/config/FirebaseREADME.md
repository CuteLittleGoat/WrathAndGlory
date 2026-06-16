# 🇵🇱 Konfiguracja Firebase — Audio (PL)

## Cel dokumentu

Ten dokument opisuje konfigurację Firebase dla modułu `Audio`.

Firebase w tym module służy wyłącznie do synchronizacji ustawień panelu audio:

- list ulubionych,
- widoku głównego,
- aliasów SFX.

Moduł `Audio` nie przechowuje plików audio w Firebase. Dźwięki są odczytywane na podstawie manifestu `AudioManifest.xlsx` i linków zapisanych w jego kolumnach.

## Używane usługi Firebase

| Usługa | Czy używana | Do czego |
| --- | --- | --- |
| Firestore | tak | Dokument `audio/favorites` z ustawieniami modułu. |
| Authentication | nie | Moduł nie loguje użytkownika. |
| Realtime Database | nie | Moduł Audio nie używa RTDB. |
| Storage | nie | Pliki audio nie są zapisywane przez ten moduł w Firebase Storage. |

## Plik konfiguracyjny

Konfiguracja znajduje się w:

```text
Audio/config/firebase-config.js
```

Plik powinien ustawić globalny obiekt:

```js
window.firebaseConfig = {
  apiKey: "TU_WSTAW_API_KEY",
  authDomain: "TU_WSTAW_AUTH_DOMAIN",
  projectId: "TU_WSTAW_PROJECT_ID",
  storageBucket: "TU_WSTAW_STORAGE_BUCKET",
  messagingSenderId: "TU_WSTAW_MESSAGING_SENDER_ID",
  appId: "TU_WSTAW_APP_ID"
};
```

Nie używaj `export`. Plik jest ładowany jako klasyczny skrypt.

Do repozytorium nie należy wpisywać danych produkcyjnych w dokumentacji. W dokumentach używaj wyłącznie placeholderów.

## Szablon konfiguracji

Repozytorium zawiera również:

```text
Audio/config/firebase-config.template.js
```

Ten plik służy jako wzór dla właściwego `firebase-config.js`.

## Gdzie kod używa Firebase

`Audio/index.html` ładuje:

- `Audio/config/firebase-config.js`,
- Firebase modular SDK,
- `initializeApp(...)`,
- `getFirestore(...)`,
- `doc(...)`,
- `getDoc(...)`,
- `setDoc(...)`,
- `serverTimestamp()`.

Stałe używane przez moduł:

```text
AUDIO_SETTINGS_COLLECTION = "audio"
AUDIO_SETTINGS_DOC_ID = "favorites"
AUDIO_SETTINGS_STORAGE_KEY = "audio.settings"
AUDIO_LEGACY_STORAGE_KEY = "audio.favorites"
```

## Ścieżka Firestore

Moduł czyta i zapisuje dokument:

```text
audio/favorites
```

To jeden dokument z całymi ustawieniami Audio.

## Model dokumentu Firestore

Dokument `audio/favorites` ma strukturę:

```text
{
  favorites: {
    lists: [ ... ]
  },
  mainView: {
    itemIds: [ ... ]
  },
  aliases: {
    "item-id": "Alias"
  },
  updatedAt: <server timestamp>
}
```

| Pole | Typ | Opis |
| --- | --- | --- |
| `favorites` | `object` | Listy ulubionych dźwięków. |
| `favorites.lists` | `array<object>` | Tablica list ulubionych. |
| `mainView` | `object` | Widok główny użytkownika. |
| `mainView.itemIds` | `array<string>` | Kolejność dźwięków w widoku głównym. |
| `aliases` | `object` | Mapa aliasów po `itemId`. |
| `updatedAt` | `timestamp` | Znacznik czasu Firestore ustawiany przy zapisie. |

## Model listy ulubionych

Pojedyncza lista w `favorites.lists`:

```text
{
  id: string,
  name: string,
  itemIds: string[]
}
```

| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `string` | Identyfikator listy. |
| `name` | `string` | Nazwa widoczna w UI. |
| `itemIds` | `array<string>` | Identyfikatory dźwięków w kolejności wyświetlania. |

Kod normalizuje listy po odczycie. Jeżeli lista jest uszkodzona albo nie istnieje, moduł tworzy bezpieczną listę domyślną.

## Model widoku głównego

`mainView` przechowuje główną listę dźwięków widoczną dla użytkownika:

```text
{
  itemIds: string[]
}
```

Jeżeli `mainView.itemIds` nie istnieje albo nie jest tablicą, moduł używa pustej tablicy.

## Model aliasów

`aliases` jest mapą:

```text
{
  "item-id": "Alias użytkownika"
}
```

Alias jest przypisywany do dźwięku po `itemId`.

Przycisk `Wyczyść wszystkie aliasy` usuwa całą mapę `aliases`, również aliasy dźwięków niewidocznych przez aktualny filtr.

## LocalStorage fallback

Firebase jest opcjonalny.

Jeżeli `window.firebaseConfig` albo `window.firebaseConfig.apiKey` nie istnieją, moduł przechodzi na lokalne ustawienia.

Aktualny klucz lokalny:

```text
audio.settings
```

Klucz legacy:

```text
audio.favorites
```

Podczas odczytu lokalnego moduł najpierw próbuje `audio.settings`. Jeżeli go nie ma, próbuje stary klucz `audio.favorites`.

Lokalne ustawienia działają tylko w tej przeglądarce i na tym urządzeniu.

## Zachowanie statusu Firebase

W panelu admina status Firebase może pokazać:

| Status | Znaczenie |
| --- | --- |
| `Firebase: connected` | Moduł korzysta z Firestore. |
| `Firebase: local settings` | Moduł działa na `localStorage`. |
| `Firebase: missing configuration` | Brakuje konfiguracji `window.firebaseConfig`. |

Brak konfiguracji Firebase nie blokuje modułu. Blokuje tylko synchronizację między urządzeniami.

## Tworzenie Firestore

W Firebase Console:

1. Utwórz albo wybierz projekt Firebase.
2. Dodaj aplikację Web.
3. Skopiuj konfigurację Web App do `Audio/config/firebase-config.js`.
4. Włącz Firestore Database.
5. Ustaw reguły dostępu zgodne z potrzebami grupy.
6. Otwórz `Audio/index.html?admin=1`.
7. Sprawdź status Firebase.
8. Utwórz testową listę ulubionych.
9. Odśwież stronę i sprawdź, czy lista została zachowana.

## Przykładowe reguły Firestore do testów

Dla prywatnego, testowego projektu możesz użyć prostego wariantu:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audio/favorites {
      allow read, write: if true;
    }
  }
}
```

Ten wariant nie jest bezpieczny dla publicznego projektu, bo pozwala każdemu czytać i zapisywać dokument.

W produkcji ogranicz dostęp do zaufanych użytkowników albo użyj bardziej restrykcyjnych reguł.

## Skrypt inicjalizujący dokument Firestore

Poniższy skrypt tworzy pusty dokument `audio/favorites`.

Zapisz jako:

```text
Audio/config/init-firestore-structure.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do klucza konta serwisowego JSON.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  favorites: {
    lists: []
  },
  mainView: {
    itemIds: []
  },
  aliases: {},
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  await db.collection("audio").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Utworzono / zaktualizowano dokument audio/favorites");
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
node Audio/config/init-firestore-structure.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
node Audio/config/init-firestore-structure.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Test konfiguracji

1. Otwórz `Audio/index.html?admin=1`.
2. Sprawdź status Firebase.
3. Kliknij `Wczytaj manifest`.
4. Utwórz nową listę ulubionych.
5. Dodaj do niej dźwięk.
6. Dodaj dźwięk do `Widoku głównego`.
7. Ustaw alias dla wybranego dźwięku.
8. Odśwież stronę.
9. Sprawdź, czy lista, widok główny i alias wróciły.
10. Otwórz `Audio/index.html` i sprawdź widok użytkownika.

## Typowe błędy

| Objaw | Znaczenie | Rozwiązanie |
| --- | --- | --- |
| `Firebase: missing configuration` | Brakuje `window.firebaseConfig` albo `apiKey`. | Uzupełnij `Audio/config/firebase-config.js`. |
| `Firebase: local settings` | Moduł działa lokalnie bez Firestore. | To poprawny fallback; skonfiguruj Firebase, jeśli potrzebna jest synchronizacja. |
| Ustawienia znikają na innym urządzeniu | Ustawienia są w `localStorage`, nie w Firestore. | Sprawdź konfigurację Firebase i reguły. |
| Lista nie zapisuje się po odświeżeniu | Brak zapisu do Firestore i/lub localStorage. | Sprawdź konsolę przeglądarki i reguły Firestore. |
| Błąd uprawnień Firestore | Reguły blokują odczyt lub zapis `audio/favorites`. | Zmień reguły lub zaloguj właściwego użytkownika, jeśli projekt tego wymaga. |
| Alias nie pojawia się przy dźwięku | Alias jest zapisany dla innego `itemId` albo manifest się zmienił. | Ustaw alias ponownie po wczytaniu aktualnego manifestu. |
| Dźwięk z listy jest oznaczony jako brakujący | `itemId` z ustawień nie istnieje w aktualnym `AudioManifest.xlsx`. | Usuń wpis z listy albo popraw manifest. |

---

# 🇬🇧 Firebase configuration — Audio (EN)

## Document purpose

This document describes Firebase configuration for the `Audio` module.

Firebase in this module is used only to synchronize audio panel settings:

- favorite lists,
- main view,
- SFX aliases.

The `Audio` module does not store audio files in Firebase. Sounds are read from `AudioManifest.xlsx` and links stored in its columns.

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Firestore | yes | `audio/favorites` document with module settings. |
| Authentication | no | The module does not sign users in. |
| Realtime Database | no | Audio does not use RTDB. |
| Storage | no | Audio files are not written by this module to Firebase Storage. |

## Configuration file

Configuration is stored in:

```text
Audio/config/firebase-config.js
```

The file should define global object:

```js
window.firebaseConfig = {
  apiKey: "PUT_API_KEY_HERE",
  authDomain: "PUT_AUTH_DOMAIN_HERE",
  projectId: "PUT_PROJECT_ID_HERE",
  storageBucket: "PUT_STORAGE_BUCKET_HERE",
  messagingSenderId: "PUT_MESSAGING_SENDER_ID_HERE",
  appId: "PUT_APP_ID_HERE"
};
```

Do not use `export`. The file is loaded as a classic script.

Do not write production configuration values in documentation. Use placeholders in docs only.

## Configuration template

The repository also contains:

```text
Audio/config/firebase-config.template.js
```

This file is a template for the actual `firebase-config.js`.

## Where the code uses Firebase

`Audio/index.html` loads:

- `Audio/config/firebase-config.js`,
- Firebase modular SDK,
- `initializeApp(...)`,
- `getFirestore(...)`,
- `doc(...)`,
- `getDoc(...)`,
- `setDoc(...)`,
- `serverTimestamp()`.

Constants used by the module:

```text
AUDIO_SETTINGS_COLLECTION = "audio"
AUDIO_SETTINGS_DOC_ID = "favorites"
AUDIO_SETTINGS_STORAGE_KEY = "audio.settings"
AUDIO_LEGACY_STORAGE_KEY = "audio.favorites"
```

## Firestore path

The module reads and writes document:

```text
audio/favorites
```

This single document stores all Audio settings.

## Firestore document model

Document `audio/favorites` has this structure:

```text
{
  favorites: {
    lists: [ ... ]
  },
  mainView: {
    itemIds: [ ... ]
  },
  aliases: {
    "item-id": "Alias"
  },
  updatedAt: <server timestamp>
}
```

| Field | Type | Description |
| --- | --- | --- |
| `favorites` | `object` | Favorite sound lists. |
| `favorites.lists` | `array<object>` | Favorite list array. |
| `mainView` | `object` | User main view. |
| `mainView.itemIds` | `array<string>` | Sound order in the main view. |
| `aliases` | `object` | Alias map by `itemId`. |
| `updatedAt` | `timestamp` | Firestore timestamp set on save. |

## Favorite list model

Single list in `favorites.lists`:

```text
{
  id: string,
  name: string,
  itemIds: string[]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | List identifier. |
| `name` | `string` | Name visible in UI. |
| `itemIds` | `array<string>` | Sound identifiers in display order. |

The code normalizes lists after read. If a list is damaged or missing, the module creates safe default list data.

## Main view model

`mainView` stores the main sound list visible to the user:

```text
{
  itemIds: string[]
}
```

If `mainView.itemIds` is missing or is not an array, the module uses an empty array.

## Alias model

`aliases` is a map:

```text
{
  "item-id": "User alias"
}
```

Alias is assigned to a sound by `itemId`.

`Clear all aliases` removes the whole `aliases` map, including aliases for sounds hidden by the current filter.

## LocalStorage fallback

Firebase is optional.

If `window.firebaseConfig` or `window.firebaseConfig.apiKey` are missing, the module switches to local settings.

Current local key:

```text
audio.settings
```

Legacy key:

```text
audio.favorites
```

When reading local settings, the module first tries `audio.settings`. If it is missing, it tries old key `audio.favorites`.

Local settings work only in this browser and on this device.

## Firebase status behavior

Admin panel Firebase status can show:

| Status | Meaning |
| --- | --- |
| `Firebase: connected` | Module uses Firestore. |
| `Firebase: local settings` | Module uses `localStorage`. |
| `Firebase: missing configuration` | `window.firebaseConfig` is missing. |

Missing Firebase configuration does not block the module. It only disables synchronization across devices.

## Creating Firestore

In Firebase Console:

1. Create or choose a Firebase project.
2. Add a Web app.
3. Copy Web App configuration to `Audio/config/firebase-config.js`.
4. Enable Firestore Database.
5. Set access rules appropriate for the group.
6. Open `Audio/index.html?admin=1`.
7. Check Firebase status.
8. Create a test favorite list.
9. Refresh the page and check whether the list persists.

## Example Firestore rules for tests

For a private test project, you can use a simple variant:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audio/favorites {
      allow read, write: if true;
    }
  }
}
```

This variant is not safe for a public project because it allows anyone to read and write the document.

For production, restrict access to trusted users or use stricter rules.

## Firestore document initializer script

The following script creates an empty `audio/favorites` document.

Save as:

```text
Audio/config/init-firestore-structure.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON key.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  favorites: {
    lists: []
  },
  mainView: {
    itemIds: []
  },
  aliases: {},
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  await db.collection("audio").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Created / updated audio/favorites");
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
node Audio/config/init-firestore-structure.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
node Audio/config/init-firestore-structure.js
```

Do not commit the service account file to the repository.

## Configuration test

1. Open `Audio/index.html?admin=1`.
2. Check Firebase status.
3. Click `Load manifest`.
4. Create a new favorite list.
5. Add a sound to it.
6. Add a sound to `Main view`.
7. Set alias for selected sound.
8. Refresh page.
9. Check that list, main view, and alias returned.
10. Open `Audio/index.html` and check user view.

## Common errors

| Symptom | Meaning | Fix |
| --- | --- | --- |
| `Firebase: missing configuration` | Missing `window.firebaseConfig` or `apiKey`. | Complete `Audio/config/firebase-config.js`. |
| `Firebase: local settings` | Module works locally without Firestore. | This is a valid fallback; configure Firebase if synchronization is needed. |
| Settings disappear on another device | Settings are in `localStorage`, not Firestore. | Check Firebase configuration and rules. |
| List does not persist after refresh | Firestore and/or localStorage save failed. | Check browser console and Firestore rules. |
| Firestore permission error | Rules block read or write to `audio/favorites`. | Change rules or sign in with the correct user if the project requires it. |
| Alias does not appear next to sound | Alias is saved for another `itemId` or manifest changed. | Set alias again after loading current manifest. |
| Sound from list is marked missing | `itemId` from settings does not exist in current `AudioManifest.xlsx`. | Remove the list entry or fix manifest. |

# 🇵🇱 Konfiguracja Firebase — Audio (PL)

## Cel dokumentu

Ten dokument opisuje konfigurację Firebase dla modułu `Audio`.

Firebase w tym module służy wyłącznie do synchronizacji ustawień między urządzeniami:

- listy głównej i list nazwanych,
- kolejności dźwięków na każdej liście,
- aliasów — każdy alias należy do jednego wpisu na jednej liście.

Moduł nie przechowuje w Firebase plików audio ani manifestów. Katalog dźwięków pochodzi z `Audio/AudioManifest.json` (warstwa publiczna) i z bramki Cloudflare Worker (warstwa chroniona).

## Używane usługi Firebase

| Usługa | Czy używana | Do czego |
| --- | --- | --- |
| Firestore | tak | Dokument `audio/favorites` z ustawieniami modułu. |
| App Check (reCAPTCHA Enterprise) | tak | Potwierdzenie, że zapytania przychodzą z zarejestrowanej aplikacji. |
| Authentication | nie | Moduł nie loguje użytkownika do Firebase. Hasło archiwum sprawdza bramka Cloudflare. |
| Realtime Database | nie | — |
| Storage | nie | — |

Projekt Firebase `audiorpg-2eb6f` jest wspólny z modułem `GeneratorNPC` (jego dokument to `generatorNpc/favorites`).

## Plik konfiguracyjny

Konfiguracja znajduje się w:

```text
Audio/config/firebase-config.js
```

Plik ustawia globalny obiekt (w dokumentacji tylko placeholdery):

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

- Plik jest ładowany jako zwykły skrypt przed `app.js`, dlatego nie używa `export`.
- Wartości pochodzą z **Firebase Console → Project settings → Your apps (Web) → SDK setup and configuration → Config**.
- Konfiguracja aplikacji Web nie jest sekretem (trafia do każdej przeglądarki), ale kluczy kont serwisowych i innych sekretów nie wolno umieszczać w repozytorium.
- Każda grupa, która kopiuje moduł na własny serwer, powinna mieć własny projekt Firebase i własny `firebase-config.js`.

Klucz witryny App Check leży osobno, w `shared/appcheck-config.js`, razem z kluczem drugiego projektu Firebase repozytorium.

## Gdzie kod używa Firebase

`Audio/app.js` importuje Firebase modular SDK `12.6.0`:

- `initializeApp(window.firebaseConfig)`,
- `activateAppCheck(app)` z `shared/firebase-app-check.js`,
- `getFirestore(app)`,
- `doc(db, "audio", "favorites")`,
- `onSnapshot(...)` — nasłuch zmian na żywo,
- `setDoc(...)` — zapis całego dokumentu,
- `serverTimestamp()`.

Stałe w `app.js`:

```text
AUDIO_SETTINGS_COLLECTION = "audio"
AUDIO_SETTINGS_DOC_ID = "favorites"
AUDIO_SETTINGS_STORAGE_KEY = "audio.settings"
AUDIO_LEGACY_STORAGE_KEY = "audio.favorites"
SETTINGS_SCHEMA_VERSION = 2
MAIN_LIST_ID = "main"
ALIAS_MAX_LENGTH = 80
LIST_NAME_MAX_LENGTH = 60
```

## Ścieżka Firestore

Moduł czyta i zapisuje jeden dokument:

```text
audio/favorites
```

Odczyt działa jako nasłuch (`onSnapshot`): zmiana zapisana na jednym urządzeniu pojawia się na pozostałych bez odświeżania strony. Zapis nadpisuje cały dokument jednym `setDoc` (bez `merge`).

## Model dokumentu Firestore (wersja 2)

```text
{
  schemaVersion: 2,
  playlists: [
    {
      id: "main",
      kind: "main",
      name: "",
      entries: [
        { itemId: "przykladowy-dzwiek", alias: "" }
      ]
    },
    {
      id: "8b0c3c1e-…",
      kind: "list",
      name: "Nazwa listy",
      entries: [
        { itemId: "przykladowy-dzwiek", alias: "Alias na tej liście" }
      ]
    }
  ],
  updatedAt: <server timestamp>
}
```

| Pole | Typ | Opis |
| --- | --- | --- |
| `schemaVersion` | `number` | Zawsze `2`. Moduł nie rozpoznaje innych wersji. |
| `playlists` | `array<object>` | Listy w kolejności wyświetlania. **Pierwsza jest zawsze lista główna.** |
| `playlists[].id` | `string` | `"main"` dla listy głównej, UUID dla pozostałych. Unikalny. |
| `playlists[].kind` | `string` | `"main"` (dokładnie jedna lista) albo `"list"`. |
| `playlists[].name` | `string` | Do 60 znaków. Pusta nazwa listy głównej = nazwa domyślna „Widok główny”. |
| `playlists[].entries` | `array<object>` | Wpisy w kolejności wyświetlania. |
| `entries[].itemId` | `string` | Identyfikator `id` dźwięku z manifestu. Unikalny w obrębie listy. |
| `entries[].alias` | `string` | Alias tego dźwięku **na tej liście** (do 80 znaków, pusty = brak aliasu). |
| `updatedAt` | `timestamp` | Znacznik czasu serwera ustawiany przy każdym zapisie. |

Zasady:

- ten sam dźwięk może być na wielu listach i mieć na każdej inny alias albo żaden,
- usunięcie wpisu usuwa jego alias; usunięcie listy usuwa jej wpisy i aliasy,
- wpisy wskazujące dźwięk spoza bieżącego manifestu **nie są usuwane** (przy zablokowanym archiwum wszystkie dźwięki chronione są niewidoczne, ale ich wpisy i aliasy muszą przetrwać),
- nazwy list i aliasy są wyświetlane jako zwykły tekst (bez interpretacji HTML).

## Dokument w innym formacie (czysty start)

Moduł zna wyłącznie wersję 2. Jeżeli dokument nie ma `schemaVersion: 2` i tablicy `playlists` (np. zawiera stare pola `favorites`, `mainView`, `aliases`):

- moduł pokazuje puste listy (samą pustą listę główną),
- w panelu admina pojawia się komunikat, że zapisane listy są w starym formacie i zostały pominięte,
- **przy samym odczycie nic nie jest zapisywane**,
- pierwsza zmiana w panelu admina zapisuje cały dokument w wersji 2, co usuwa stare pola.

Jeżeli dokumentu nie ma, moduł tworzy go od razu w wersji 2 z pustą listą główną.

## Pamięć przeglądarki (tryb lokalny)

Firebase jest opcjonalny. Jeżeli `window.firebaseConfig` albo `apiKey` nie istnieją, albo start SDK się nie powiedzie, moduł zapisuje ustawienia w `localStorage` tej przeglądarki:

| Klucz | Zawartość |
| --- | --- |
| `audio.settings` | Ustawienia w tym samym formacie co dokument Firestore (bez `updatedAt`). |
| `wgLocalOnlyChange:audio.settings` | Znacznik zmian zapisanych tylko lokalnie, mimo skonfigurowanej bazy (obsługuje go `shared/firebase-write-status.js`). |

Najstarszy klucz `audio.favorites` jest usuwany przy każdym starcie modułu i nie jest czytany.

Ustawienia lokalne działają tylko w tej przeglądarce na tym urządzeniu. Po odzyskaniu dostępu do bazy moduł **nie** odsyła ich automatycznie — dane z bazy wygrywają, a pasek ostrzega, że zastąpiły zmiany z tego urządzenia.

## Status Firebase

Pastylka w panelu admina:

| Status | Znaczenie |
| --- | --- |
| `Firebase: oczekiwanie` | Moduł jeszcze nie uruchomił Firebase. |
| `Firebase: połączono` | Moduł korzysta z Firestore. |
| `Firebase: lokalne ustawienia` | Moduł pracuje na `localStorage` (np. po odmowie zapisu albo błędzie odczytu). |
| `Firebase: brak konfiguracji` | Brakuje `window.firebaseConfig` albo `apiKey`. |

W obu trybach modułu (także bez `?admin=1`) w prawym górnym rogu widać plakietkę trybu pracy: „Dane wspólne” albo „Tylko to urządzenie”. Przy nieudanym zapisie lub odczycie u góry strony pojawia się pasek z opisem i podpowiedzią.

## Reguły Firestore

Reguły projektu są odwzorowane w pliku:

```text
shared/firestore-audiorpg.rules
```

Fragment dotyczący modułu:

```text
match /audio/favorites { allow read, write: if true; }
match /{document=**} { allow read, write: if false; }
```

- Dopuszczony jest wyłącznie dokument `audio/favorites` (oraz dokument GeneratorNPC); wszystko inne jest zablokowane.
- Warunku `request.app != null` **nie dopisujemy** — uzasadnienie jest w pliku reguł. Ochronę przed obcymi programami daje włączone wymuszanie App Check w Firebase Console.
- Dokument jest zapisywalny dla każdego, kto ma stronę; dlatego moduł wyświetla wszystkie teksty z bazy jako zwykły tekst.
- Zapisanie pliku reguł w repozytorium niczego nie zmienia w Firebase — reguły publikuje się w **Firebase Console → Firestore Database → Rules** albo przez Firebase CLI.

Nowe wersje modułu nie wymagają zmiany reguł, dopóki dokument nazywa się `audio/favorites`.

## Tworzenie Firestore od zera

1. W Firebase Console utwórz albo wybierz projekt.
2. Dodaj aplikację Web i skopiuj jej konfigurację do `Audio/config/firebase-config.js`.
3. Włącz Firestore Database.
4. Opublikuj reguły dopuszczające dokument `audio/favorites` (fragment wyżej).
5. Skonfiguruj App Check (reCAPTCHA Enterprise) i wpisz klucz witryny w `shared/appcheck-config.js`.
6. Otwórz `Audio/index.html?admin=1` — przy braku dokumentu moduł sam go utworzy.
7. Sprawdź pastylkę `Firebase: połączono`.

## Skrypt inicjalizujący dokument (opcjonalny)

Moduł tworzy dokument sam, więc skrypt jest potrzebny tylko wtedy, gdy trzeba go utworzyć albo **wyczyścić** bez otwierania strony.

> ⚠️ Skrypt nadpisuje cały dokument. Wszystkie listy, kolejność i aliasy znikną. Przed użyciem wyeksportuj ustawienia w panelu admina („Narzędzia → Eksportuj ustawienia (JSON)”).

Zapisz poza repozytorium, np. jako `init-audio-settings.js`:

```js
// Tworzy albo czyści dokument audio/favorites w formacie wersji 2
// Creates or clears the audio/favorites document in the version 2 format
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do klucza konta serwisowego JSON.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// Pusta lista główna — jedyny wymagany element / An empty main list — the only required element
const payload = {
  schemaVersion: 2,
  playlists: [
    { id: "main", kind: "main", name: "", entries: [] }
  ],
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  // Bez merge: stare pola dokumentu mają zniknąć / Without merge: old document fields must disappear
  await db.collection("audio").doc("favorites").set(payload);
  console.log("[OK] Dokument audio/favorites zapisany w wersji 2");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

Uruchomienie (bash):

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pelna/sciezka/do/service-account.json"
node init-audio-settings.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\pelna\sciezka\do\service-account.json"
node init-audio-settings.js
```

Plik konta serwisowego (`service-account.json`) jest sekretem — nie wolno go commitować do repozytorium.

## Test konfiguracji

1. Otwórz `Audio/index.html?admin=1` i sprawdź pastylkę `Firebase: połączono` oraz plakietkę „Dane wspólne”.
2. Utwórz listę („+ Nowa lista”), nadaj jej nazwę i dodaj dźwięk z katalogu.
3. Nadaj dźwiękowi alias na tej liście.
4. W drugiej karcie otwórz `Audio/index.html` — lista i alias są widoczne.
5. Zmień kolejność wpisów w panelu admina — widok w drugiej karcie odświeża się sam.
6. Odśwież obie karty — wszystko zostaje.
7. W Firebase Console sprawdź dokument `audio/favorites`: pola `schemaVersion`, `playlists`, `updatedAt`.

## Typowe błędy

| Objaw | Znaczenie | Rozwiązanie |
| --- | --- | --- |
| `Firebase: brak konfiguracji` | Brakuje `window.firebaseConfig` albo `apiKey`. | Uzupełnij `Audio/config/firebase-config.js`. |
| `Firebase: lokalne ustawienia` i pasek o nieudanym zapisie | Baza odrzuciła zapis albo odczyt. | Sprawdź, czy dodatek blokujący reklamy lub filtr sieci nie blokuje `google.com/recaptcha`; potem reguły i App Check. |
| Na innym urządzeniu nie ma list | Ustawienia trafiły tylko do `localStorage`. | Przywróć dostęp do bazy i wprowadź zmiany ponownie; plakietka ma pokazywać „Dane wspólne”. |
| Panel admina pokazuje komunikat o starym formacie | Dokument ma pola starej wersji. | To zamierzone. Utwórz listy od nowa — pierwsza zmiana zapisze dokument w wersji 2. |
| Wpis „(brak w manifeście)” | `itemId` nie istnieje w bieżącym manifeście albo archiwum jest zablokowane. | Odblokuj archiwum. Jeżeli wpis nadal jest brakujący, usuń go albo sprawdź, czy manifest nie został zbudowany z arkusza z wierszami wstawionymi w środku. |
| Stary widok nadpisuje nowe listy | Na którymś urządzeniu otwarta jest karta ze starą wersją modułu. | Zamknij stare karty i odśwież stronę z pominięciem pamięci podręcznej (Ctrl+F5) na każdym urządzeniu. |

---

# 🇬🇧 Firebase configuration — Audio (EN)

## Document purpose

This document describes the Firebase configuration of the `Audio` module.

Firebase in this module is used only to synchronise settings between devices:

- the main list and the named lists,
- the order of sounds on every list,
- aliases — every alias belongs to one entry on one list.

The module stores neither audio files nor manifests in Firebase. The sound catalogue comes from `Audio/AudioManifest.json` (public tier) and from the Cloudflare Worker gateway (protected tier).

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Firestore | yes | The `audio/favorites` document with the module settings. |
| App Check (reCAPTCHA Enterprise) | yes | Confirms that requests come from the registered app. |
| Authentication | no | The module signs nobody into Firebase. The archive password is checked by the Cloudflare gateway. |
| Realtime Database | no | — |
| Storage | no | — |

The Firebase project `audiorpg-2eb6f` is shared with the `GeneratorNPC` module (its document is `generatorNpc/favorites`).

## Configuration file

The configuration lives in:

```text
Audio/config/firebase-config.js
```

The file sets a global object (placeholders only in documentation):

```js
window.firebaseConfig = {
  apiKey: "PUT_YOUR_API_KEY_HERE",
  authDomain: "PUT_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PUT_YOUR_PROJECT_ID_HERE",
  storageBucket: "PUT_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PUT_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PUT_YOUR_APP_ID_HERE"
};
```

- The file is loaded as a classic script before `app.js`, so it does not use `export`.
- The values come from **Firebase Console → Project settings → Your apps (Web) → SDK setup and configuration → Config**.
- A Web app configuration is not a secret (it reaches every browser), but service account keys and other secrets must never be placed in the repository.
- Every group that copies the module to its own server should have its own Firebase project and its own `firebase-config.js`.

The App Check site key lives separately, in `shared/appcheck-config.js`, together with the key of the repository's other Firebase project.

## Where the code uses Firebase

`Audio/app.js` imports the Firebase modular SDK `12.6.0`:

- `initializeApp(window.firebaseConfig)`,
- `activateAppCheck(app)` from `shared/firebase-app-check.js`,
- `getFirestore(app)`,
- `doc(db, "audio", "favorites")`,
- `onSnapshot(...)` — a live change listener,
- `setDoc(...)` — saving the whole document,
- `serverTimestamp()`.

Constants in `app.js`:

```text
AUDIO_SETTINGS_COLLECTION = "audio"
AUDIO_SETTINGS_DOC_ID = "favorites"
AUDIO_SETTINGS_STORAGE_KEY = "audio.settings"
AUDIO_LEGACY_STORAGE_KEY = "audio.favorites"
SETTINGS_SCHEMA_VERSION = 2
MAIN_LIST_ID = "main"
ALIAS_MAX_LENGTH = 80
LIST_NAME_MAX_LENGTH = 60
```

## Firestore path

The module reads and writes one document:

```text
audio/favorites
```

Reading runs as a listener (`onSnapshot`): a change saved on one device appears on the others without a page reload. A save overwrites the whole document with one `setDoc` (without `merge`).

## Firestore document model (version 2)

```text
{
  schemaVersion: 2,
  playlists: [
    {
      id: "main",
      kind: "main",
      name: "",
      entries: [
        { itemId: "example-sound", alias: "" }
      ]
    },
    {
      id: "8b0c3c1e-…",
      kind: "list",
      name: "List name",
      entries: [
        { itemId: "example-sound", alias: "Alias on this list" }
      ]
    }
  ],
  updatedAt: <server timestamp>
}
```

| Field | Type | Description |
| --- | --- | --- |
| `schemaVersion` | `number` | Always `2`. The module recognises no other version. |
| `playlists` | `array<object>` | Lists in display order. **The first one is always the main list.** |
| `playlists[].id` | `string` | `"main"` for the main list, a UUID for the others. Unique. |
| `playlists[].kind` | `string` | `"main"` (exactly one list) or `"list"`. |
| `playlists[].name` | `string` | Up to 60 characters. An empty main list name = the default name "Main view". |
| `playlists[].entries` | `array<object>` | Entries in display order. |
| `entries[].itemId` | `string` | The sound's `id` from the manifest. Unique within a list. |
| `entries[].alias` | `string` | This sound's alias **on this list** (up to 80 characters, empty = no alias). |
| `updatedAt` | `timestamp` | Server timestamp set on every save. |

Rules:

- the same sound can be on many lists and have a different alias, or none, on each,
- removing an entry removes its alias; deleting a list removes its entries and aliases,
- entries pointing at a sound missing from the current manifest **are not removed** (with the archive locked every protected sound is invisible, but its entries and aliases must survive),
- list names and aliases are displayed as plain text (never interpreted as HTML).

## A document in another format (clean start)

The module knows version 2 only. If the document lacks `schemaVersion: 2` and a `playlists` array (e.g. it holds the old `favorites`, `mainView`, `aliases` fields):

- the module shows empty lists (just an empty main list),
- the admin panel shows a notice that the saved lists use the old format and were skipped,
- **nothing is written on read alone**,
- the first change in the admin panel saves the whole document in version 2, which removes the old fields.

If there is no document, the module creates it straight away in version 2 with an empty main list.

## Browser storage (local mode)

Firebase is optional. If `window.firebaseConfig` or `apiKey` is missing, or the SDK fails to start, the module saves settings in this browser's `localStorage`:

| Key | Content |
| --- | --- |
| `audio.settings` | Settings in the same format as the Firestore document (without `updatedAt`). |
| `wgLocalOnlyChange:audio.settings` | Marker of changes saved only locally although a database is configured (handled by `shared/firebase-write-status.js`). |

The oldest `audio.favorites` key is removed on every module start-up and is never read.

Local settings work only in this browser on this device. Once database access returns, the module does **not** push them automatically — database data wins, and the bar warns that it replaced this device's changes.

## Firebase status

The admin panel pill:

| Status | Meaning |
| --- | --- |
| `Firebase: waiting` | The module has not started Firebase yet. |
| `Firebase: connected` | The module uses Firestore. |
| `Firebase: local settings` | The module works on `localStorage` (e.g. after a refused save or a read error). |
| `Firebase: missing configuration` | `window.firebaseConfig` or `apiKey` is missing. |

In both module modes (also without `?admin=1`) a working-mode badge is shown in the top right corner: "Shared data" or "This device only". After a failed save or read, a bar with a description and a hint appears at the top of the page.

## Firestore rules

The project rules are mirrored in:

```text
shared/firestore-audiorpg.rules
```

The part relevant to the module:

```text
match /audio/favorites { allow read, write: if true; }
match /{document=**} { allow read, write: if false; }
```

- Only the `audio/favorites` document (and the GeneratorNPC document) is allowed; everything else is blocked.
- The `request.app != null` condition is **not** added — the reason is in the rules file. Protection against foreign programs comes from App Check enforcement enabled in the Firebase Console.
- The document is writable by anyone who has the page; that is why the module shows every text from the database as plain text.
- Saving the rules file in the repository changes nothing in Firebase — rules are published in **Firebase Console → Firestore Database → Rules** or with the Firebase CLI.

New module versions need no rules change as long as the document is named `audio/favorites`.

## Creating Firestore from scratch

1. In the Firebase Console create or choose a project.
2. Add a Web app and copy its configuration into `Audio/config/firebase-config.js`.
3. Enable Firestore Database.
4. Publish rules that allow the `audio/favorites` document (snippet above).
5. Set up App Check (reCAPTCHA Enterprise) and put the site key into `shared/appcheck-config.js`.
6. Open `Audio/index.html?admin=1` — without a document the module creates it itself.
7. Check the `Firebase: connected` pill.

## Document initializer script (optional)

The module creates the document itself, so the script is needed only when it must be created or **cleared** without opening the page.

> ⚠️ The script overwrites the whole document. Every list, order and alias will be gone. Export the settings in the admin panel first ("Tools → Export settings (JSON)").

Save it outside the repository, e.g. as `init-audio-settings.js`:

```js
// Tworzy albo czyści dokument audio/favorites w formacie wersji 2
// Creates or clears the audio/favorites document in the version 2 format
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to the path of the service account JSON key.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// Pusta lista główna — jedyny wymagany element / An empty main list — the only required element
const payload = {
  schemaVersion: 2,
  playlists: [
    { id: "main", kind: "main", name: "", entries: [] }
  ],
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  // Bez merge: stare pola dokumentu mają zniknąć / Without merge: old document fields must disappear
  await db.collection("audio").doc("favorites").set(payload);
  console.log("[OK] Document audio/favorites saved in version 2");
}

main().catch((err) => {
  console.error("[ERR] Initialisation error:", err);
  process.exit(1);
});
```

Running it (bash):

```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
node init-audio-settings.js
```

PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\full\path\to\service-account.json"
node init-audio-settings.js
```

The service account file (`service-account.json`) is a secret — it must never be committed to the repository.

## Configuration test

1. Open `Audio/index.html?admin=1` and check the `Firebase: connected` pill and the "Shared data" badge.
2. Create a list ("+ New list"), name it and add a sound from the catalogue.
3. Give the sound an alias on that list.
4. Open `Audio/index.html` in a second tab — the list and the alias are visible.
5. Reorder the entries in the admin panel — the view in the second tab refreshes on its own.
6. Reload both tabs — everything stays.
7. In the Firebase Console check the `audio/favorites` document: the `schemaVersion`, `playlists`, `updatedAt` fields.

## Common errors

| Symptom | Meaning | Solution |
| --- | --- | --- |
| `Firebase: missing configuration` | `window.firebaseConfig` or `apiKey` is missing. | Fill in `Audio/config/firebase-config.js`. |
| `Firebase: local settings` and a failed-save bar | The database refused a save or a read. | Check that an ad blocker or network filter is not blocking `google.com/recaptcha`; then the rules and App Check. |
| Lists missing on another device | The settings went to `localStorage` only. | Restore database access and make the changes again; the badge should read "Shared data". |
| The admin panel shows the old-format notice | The document holds old-version fields. | This is intended. Recreate the lists — the first change saves the document in version 2. |
| A "(missing in manifest)" entry | The `itemId` is not in the current manifest, or the archive is locked. | Unlock the archive. If the entry is still missing, remove it, or check whether the manifest was built from a sheet with rows inserted in the middle. |
| An old view overwrites the new lists | A tab with the old module version is open on some device. | Close old tabs and reload the page bypassing the cache (Ctrl+F5) on every device. |

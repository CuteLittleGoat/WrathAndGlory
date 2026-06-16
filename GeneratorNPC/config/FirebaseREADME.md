# 🇵🇱 Konfiguracja Firebase — GeneratorNPC (PL)

## Do czego moduł używa Firebase

`GeneratorNPC` korzysta z Firebase w dwóch oddzielnych warstwach:

1. **Prywatne dane DataVault** — moduł pobiera dane z prywatnej bazy DataVault po autoryzacji przez ekran K.O.Z.A.
2. **Ulubione NPC** — moduł zapisuje listę ulubionych konfiguracji NPC w Firestore, z lokalnym fallbackiem do `localStorage`.

Te dwie warstwy mają różne pliki konfiguracyjne i różne modele danych.

## Warstwa 1 — prywatne dane DataVault

Prywatne dane DataVault są ładowane przez pliki wspólne:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

`GeneratorNPC/index.html` ładuje te pliki i korzysta z globalnego API:

```text
window.DataVaultFirebaseReady
```

Loader prywatnych danych:

- inicjalizuje nazwaną aplikację Firebase dla prywatnych danych,
- używa Firebase Authentication z e-mailem technicznym i hasłem wpisanym przez użytkownika,
- używa Realtime Database,
- odczytuje dane ze ścieżki `datavault/live`,
- rozpakowuje wrapper importu, jeżeli dane są zapisane jako `dataJson`,
- udostępnia funkcję `loadDataVaultLive()`.

Szczegółowa konfiguracja tej warstwy powinna być utrzymywana w:

```text
shared/FirebaseREADME.md
```

Ten plik opisuje tylko zależność `GeneratorNPC` od tej warstwy oraz wymagania modułu.

### Wymagane dane z DataVault

Po poprawnym logowaniu i odczycie prywatnych danych `GeneratorNPC` wymaga struktury:

```text
data.sheets
```

W `data.sheets` muszą istnieć arkusze:

- `Bestiariusz`,
- `Pancerze`,
- `Bronie`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

Dodatkowo moduł korzysta z metadanych cech, jeżeli są dostępne:

```text
data._meta.traits
```

Jeżeli brakuje `data.sheets`, konkretnego wymaganego arkusza albo arkusz jest pusty, moduł pokazuje błąd opisujący problem struktury danych.

## Warstwa 2 — ulubione NPC

Ulubione NPC są zapisywane przez osobną konfigurację modułu:

```text
GeneratorNPC/config/firebase-config.js
```

Ta konfiguracja ustawia globalną zmienną:

```text
window.firebaseConfig
```

Kod tworzy nazwaną aplikację Firebase:

```text
generator-npc-favorites
```

Następnie używa Firestore i dokumentu:

```text
generatorNpc/favorites
```

Jeżeli konfiguracja Firestore dla ulubionych jest niedostępna albo zapis/odczyt zostanie odrzucony, moduł przełącza się na zapis lokalny w przeglądarce.

## Używane usługi Firebase

### Prywatne dane DataVault

- Firebase Authentication: tak.
- Realtime Database: tak.
- Firestore: nie dla tej warstwy.
- Storage: nie.

### Ulubione NPC

- Firestore: tak.
- Authentication: nie w aktualnym kodzie ulubionych.
- Realtime Database: nie dla tej warstwy.
- Storage: nie.

## Czy Firebase jest wymagany

Firebase dla prywatnych danych DataVault jest wymagany, aby moduł mógł załadować dane źródłowe z DataVault.

Bez tej warstwy:

- ekran K.O.Z.A. pozostaje widoczny,
- dane Bestiariusza i pozostałych arkuszy nie zostaną załadowane,
- generator nie ma danych do pracy.

Firebase dla ulubionych NPC jest opcjonalny.

Bez tej warstwy:

- moduł nadal działa po załadowaniu danych DataVault,
- ulubione są zapisywane lokalnie w `localStorage`,
- lista ulubionych nie synchronizuje się między urządzeniami.

## Pliki konfiguracyjne

### Prywatne dane DataVault

Konfiguracja znajduje się w:

```text
shared/firebase-config.js
```

Wymagane są:

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

Hasło nie jest zapisywane w pliku. Użytkownik wpisuje je w formularzu K.O.Z.A.

### Ulubione NPC

Konfiguracja znajduje się w:

```text
GeneratorNPC/config/firebase-config.js
```

Wymagane jest:

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

Nie używaj `export`, ponieważ konfiguracja jest ładowana jako klasyczny skrypt przed modułem JavaScript.

## Struktura Firestore dla ulubionych

```text
Firestore
└── generatorNpc (kolekcja)
    └── favorites (dokument)
```

Dokument `generatorNpc/favorites` zawiera:

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `updatedAt` | `timestamp` | tak | Znacznik czasu Firestore ustawiany przy zapisie. |
| `favorites` | `array<object>` | tak | Lista zapisanych ulubionych NPC. |

## Model obiektu ulubionego NPC

Każdy element tablicy `favorites` ma strukturę:

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `id` | `string` | tak | Unikalny identyfikator. Kod używa `crypto.randomUUID()` albo fallbacku z `Date.now()`. |
| `alias` | `string` | tak | Opcjonalny alias wpisany przez użytkownika. Może być pusty. |
| `createdAt` | `number` | tak | Timestamp z `Date.now()`. |
| `payload` | `object` | tak | Snapshot konfiguracji NPC. |

## Model `payload`

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `selectedBestiaryIndex` | `number` | tak | Indeks wybranego rekordu Bestiariusza. |
| `bestiaryName` | `string` | tak | Nazwa rekordu Bestiariusza w chwili zapisu. |
| `bestiaryOverrides` | `object` | tak | Nadpisania wartości bazowych Bestiariusza. |
| `notes` | `string` | tak | Notatki do rekordu. |
| `modules` | `object` | tak | Wybrane elementy modułów. |
| `toggles` | `object` | tak | Stany przełączników UI. |

## Model `bestiaryOverrides`

| Pole | Typ | Opis |
| --- | --- | --- |
| `numeric` | `map` | Nadpisane wartości liczbowe, np. atrybuty, obrona, odporności, żywotność. |
| `skills` | `string|null` | Nadpisany tekst umiejętności. |
| `keywords` | `string|null` | Nadpisane słowa kluczowe. |

W kodzie `numeric` jest mapą `Map`, ale przed zapisem do ulubionych jest serializowana do zwykłego obiektu.

## Model `modules`

| Pole | Typ | Opis |
| --- | --- | --- |
| `weaponIds` | `array<number>` | Indeksy wybranych broni. |
| `armorIds` | `array<number>` | Indeksy wybranych pancerzy. |
| `augmentationsIds` | `array<number>` | Indeksy wybranych augumentacji. |
| `equipmentIds` | `array<number>` | Indeksy wybranego ekwipunku. |
| `talentsIds` | `array<number>` | Indeksy wybranych talentów. |
| `psionicsIds` | `array<number>` | Indeksy wybranej psioniki. |
| `prayersIds` | `array<number>` | Indeksy wybranych modlitw. |

Wartości są indeksami rekordów w aktualnie załadowanych i posortowanych tablicach danych. Zmiana sortowania lub zawartości arkuszy DataVault może wpływać na możliwość poprawnego odtworzenia ulubionego wpisu.

## Model `toggles`

| Pole | Typ | Opis |
| --- | --- | --- |
| `moduleVisibility` | `map<boolean>` | Widoczność modułów: `weapon`, `armor`, `augmentations`, `equipment`, `talents`, `psionics`, `prayers`. |
| `traitDescriptions` | `object` | Czy dołączyć opisy cech broni i pancerza. |
| `fullDetails` | `object` | Czy dołączyć pełne opisy augumentacji, ekwipunku, talentów, psioniki i modlitw. |

`traitDescriptions` zawiera:

```text
weapon
armor
```

`fullDetails` zawiera:

```text
augmentations
equipment
talents
psionics
prayers
```

## LocalStorage fallback

Jeżeli Firestore dla ulubionych nie działa, moduł zapisuje ulubione lokalnie pod kluczem:

```text
generatorNpcFavorites
```

Fallback lokalny:

- działa tylko w aktualnej przeglądarce,
- nie synchronizuje danych między urządzeniami,
- zapisuje tablicę ulubionych bez dokumentu `updatedAt`,
- konwertuje `createdAt` do wartości liczbowej, jeżeli było timestampem Firestore.

## Skrypt inicjalizujący Firestore dla ulubionych

Zapisz jako:

```text
GeneratorNPC/config/init-firestore-favorites.js
```

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
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: false });
  console.log("[OK] Utworzono dokument generatorNpc/favorites");
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
node GeneratorNPC/config/init-firestore-favorites.js
```

W PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
node GeneratorNPC/config/init-firestore-favorites.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Reguły Firestore dla ulubionych

Aktualny kod ulubionych nie używa Firebase Authentication. Minimalne reguły do testów i izolowanego projektu mogą ograniczać dostęp tylko do dokumentu ulubionych:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /generatorNpc/favorites {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Uwaga: powyższe reguły pozwalają każdemu, kto zna projekt Firebase, odczytać i nadpisać `generatorNpc/favorites`. Dla większego bezpieczeństwa należy dodać uwierzytelnianie lub inny mechanizm ograniczenia zapisu i odpowiednio zmienić kod modułu.

Reguły Realtime Database dla prywatnych danych DataVault powinny być opisane i utrzymywane w `shared/FirebaseREADME.md`, ponieważ dotyczą wspólnej warstwy danych używanej przez więcej niż jeden moduł.

## Test prywatnych danych DataVault

1. Skonfiguruj `shared/firebase-config.js` zgodnie ze wspólną instrukcją Firebase.
2. Otwórz `GeneratorNPC/index.html`.
3. Jeżeli pojawi się ekran K.O.Z.A., wpisz Litanię Dostępu.
4. Sprawdź, czy status zmieni się na komunikat o załadowaniu danych z prywatnej bazy.
5. Sprawdź, czy lista Bestiariusza została wypełniona.
6. Sprawdź, czy dostępne są Pancerze, Bronie, Augumentacje, Ekwipunek, Talenty, Psionika i Modlitwy.

## Test ulubionych NPC w Firestore

1. Skonfiguruj `GeneratorNPC/config/firebase-config.js`.
2. Utwórz `generatorNpc/favorites` skryptem z tego pliku.
3. Otwórz `GeneratorNPC/index.html`.
4. Odblokuj dane DataVault przez ekran K.O.Z.A.
5. Wybierz rekord Bestiariusza.
6. Wpisz alias ulubionego.
7. Kliknij `Dodaj do ulubionych`.
8. Sprawdź, czy wpis pojawił się na liście.
9. Sprawdź w Firebase Console, czy dokument `generatorNpc/favorites` zawiera tablicę `favorites`.
10. Odśwież stronę i sprawdź, czy ulubiony wpis wraca z Firestore.
11. Kliknij `Wczytaj` przy ulubionym i sprawdź, czy UI odtworzył wybory.

## Typowe błędy

| Objaw | Możliwa przyczyna | Rozwiązanie |
| --- | --- | --- |
| Ekran K.O.Z.A. nie przepuszcza użytkownika | Błędne hasło, brak Auth, błędna konfiguracja `shared/firebase-config.js` albo błędne reguły RTDB. | Sprawdź wspólną konfigurację Firebase i `shared/FirebaseREADME.md`. |
| Status mówi, że nie udało się załadować prywatnych danych | Brak danych `datavault/live`, brak autoryzacji albo błędny wrapper `dataJson`. | Sprawdź Realtime Database i dane eksportowane przez DataVault. |
| Komunikat o brakującym arkuszu | `data.sheets` nie zawiera arkusza wymaganego przez GeneratorNPC. | Uzupełnij dane DataVault i ponownie opublikuj prywatne dane. |
| Ulubione używają pamięci lokalnej | Brak `window.firebaseConfig` dla `GeneratorNPC/config/firebase-config.js`. | Uzupełnij konfigurację Firestore ulubionych. |
| Ulubione nie zapisują się w Firestore | Reguły Firestore blokują zapis albo projekt jest źle skonfigurowany. | Sprawdź `generatorNpc/favorites` i reguły Firestore. |
| Ulubiony wpis ładuje błędny rekord | Zmieniła się kolejność lub zawartość danych DataVault, a ulubiony przechowuje indeksy. | Odśwież ulubione albo zapisz je ponownie po aktualizacji danych. |
| Kilka grup widzi te same ulubione | Kilka wdrożeń używa tego samego projektu Firestore ulubionych. | Utwórz osobny projekt Firebase dla każdej grupy/serwera. |

---

# 🇬🇧 Firebase setup — GeneratorNPC (EN)

## What this module uses Firebase for

`GeneratorNPC` uses Firebase in two separate layers:

1. **Private DataVault data** — the module loads data from the private DataVault database after K.O.Z.A. authentication.
2. **NPC favorites** — the module saves favorite NPC configurations in Firestore, with a local `localStorage` fallback.

These two layers use different configuration files and different data models.

## Layer 1 — private DataVault data

Private DataVault data is loaded through shared files:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

`GeneratorNPC/index.html` loads these files and uses the global API:

```text
window.DataVaultFirebaseReady
```

The private data loader:

- initializes a named Firebase app for private data,
- uses Firebase Authentication with a technical e-mail and the password entered by the user,
- uses Realtime Database,
- reads data from `datavault/live`,
- unwraps the import wrapper if data is stored as `dataJson`,
- exposes `loadDataVaultLive()`.

Detailed configuration of this layer should be maintained in:

```text
shared/FirebaseREADME.md
```

This file only documents the `GeneratorNPC` dependency on that layer and the module-specific requirements.

### Required DataVault data

After successful login and private data read, `GeneratorNPC` requires this structure:

```text
data.sheets
```

`data.sheets` must contain these sheets:

- `Bestiariusz`,
- `Pancerze`,
- `Bronie`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

The module also uses trait metadata when available:

```text
data._meta.traits
```

If `data.sheets`, a required sheet, or sheet rows are missing, the module displays an error describing the data structure problem.

## Layer 2 — NPC favorites

NPC favorites use the module-specific configuration:

```text
GeneratorNPC/config/firebase-config.js
```

This configuration defines the global variable:

```text
window.firebaseConfig
```

The code creates a named Firebase app:

```text
generator-npc-favorites
```

Then it uses Firestore document:

```text
generatorNpc/favorites
```

If Firestore configuration for favorites is unavailable or read/write fails, the module switches to local browser storage.

## Firebase services used

### Private DataVault data

- Firebase Authentication: yes.
- Realtime Database: yes.
- Firestore: not for this layer.
- Storage: no.

### NPC favorites

- Firestore: yes.
- Authentication: not in the current favorites code.
- Realtime Database: not for this layer.
- Storage: no.

## Whether Firebase is required

Firebase for private DataVault data is required for the module to load source data from DataVault.

Without this layer:

- the K.O.Z.A. access gate remains visible,
- Bestiary and other sheet data will not load,
- the generator has no data to work with.

Firebase for NPC favorites is optional.

Without this layer:

- the module still works after DataVault data is loaded,
- favorites are saved locally in `localStorage`,
- favorites do not sync across devices.

## Configuration files

### Private DataVault data

Configuration is stored in:

```text
shared/firebase-config.js
```

Required values:

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

The password is not stored in this file. The user enters it in the K.O.Z.A. access form.

### NPC favorites

Configuration is stored in:

```text
GeneratorNPC/config/firebase-config.js
```

Required value:

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

Do not use `export`, because the configuration is loaded as a classic script before the JavaScript module.

## Firestore structure for favorites

```text
Firestore
└── generatorNpc (collection)
    └── favorites (document)
```

The `generatorNpc/favorites` document contains:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `updatedAt` | `timestamp` | yes | Firestore timestamp set on save. |
| `favorites` | `array<object>` | yes | Saved favorite NPC list. |

## Favorite NPC object model

Each element of the `favorites` array has this structure:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | Unique ID. The code uses `crypto.randomUUID()` or a `Date.now()` fallback. |
| `alias` | `string` | yes | Optional alias entered by the user. Can be empty. |
| `createdAt` | `number` | yes | `Date.now()` timestamp. |
| `payload` | `object` | yes | NPC configuration snapshot. |

## `payload` model

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `selectedBestiaryIndex` | `number` | yes | Selected Bestiary record index. |
| `bestiaryName` | `string` | yes | Bestiary record name at save time. |
| `bestiaryOverrides` | `object` | yes | Base Bestiary value overrides. |
| `notes` | `string` | yes | Record notes. |
| `modules` | `object` | yes | Selected module entries. |
| `toggles` | `object` | yes | UI toggle states. |

## `bestiaryOverrides` model

| Field | Type | Description |
| --- | --- | --- |
| `numeric` | `map` | Overridden numeric values, such as attributes, defense, resilience, or vitality. |
| `skills` | `string|null` | Overridden skills text. |
| `keywords` | `string|null` | Overridden keywords. |

In code, `numeric` is a `Map`, but it is serialized to a plain object before saving favorites.

## `modules` model

| Field | Type | Description |
| --- | --- | --- |
| `weaponIds` | `array<number>` | Selected weapon indices. |
| `armorIds` | `array<number>` | Selected armor indices. |
| `augmentationsIds` | `array<number>` | Selected augmentation indices. |
| `equipmentIds` | `array<number>` | Selected equipment indices. |
| `talentsIds` | `array<number>` | Selected talent indices. |
| `psionicsIds` | `array<number>` | Selected psionic power indices. |
| `prayersIds` | `array<number>` | Selected prayer indices. |

Values are record indices in currently loaded and sorted data arrays. Changes to DataVault sheet order or content may affect the ability to restore a favorite entry exactly.

## `toggles` model

| Field | Type | Description |
| --- | --- | --- |
| `moduleVisibility` | `map<boolean>` | Module visibility: `weapon`, `armor`, `augmentations`, `equipment`, `talents`, `psionics`, `prayers`. |
| `traitDescriptions` | `object` | Whether weapon and armor trait descriptions are included. |
| `fullDetails` | `object` | Whether full details are included for augmentations, equipment, talents, psionics, and prayers. |

`traitDescriptions` contains:

```text
weapon
armor
```

`fullDetails` contains:

```text
augmentations
equipment
talents
psionics
prayers
```

## LocalStorage fallback

If Firestore for favorites does not work, the module saves favorites locally under this key:

```text
generatorNpcFavorites
```

The local fallback:

- works only in the current browser,
- does not synchronize data across devices,
- saves the favorites array without document-level `updatedAt`,
- converts `createdAt` to a numeric value if it was a Firestore timestamp.

## Firestore initialization script for favorites

Save as:

```text
GeneratorNPC/config/init-firestore-favorites.js
```

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: false });
  console.log("[OK] Created generatorNpc/favorites");
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
node GeneratorNPC/config/init-firestore-favorites.js
```

In PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
node GeneratorNPC/config/init-firestore-favorites.js
```

Do not commit the service account file to the repository.

## Firestore rules for favorites

The current favorites code does not use Firebase Authentication. Minimal test rules for an isolated project may restrict access only to the favorites document:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /generatorNpc/favorites {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Warning: these rules allow anyone who knows the Firebase project to read and overwrite `generatorNpc/favorites`. For stronger security, add authentication or another write-limiting mechanism and update the module code accordingly.

Realtime Database rules for private DataVault data should be documented and maintained in `shared/FirebaseREADME.md`, because they belong to the shared data layer used by more than one module.

## Private DataVault data test

1. Configure `shared/firebase-config.js` according to the shared Firebase guide.
2. Open `GeneratorNPC/index.html`.
3. If the K.O.Z.A. access gate appears, enter the Litany of Access.
4. Check that the status changes to the private data loaded message.
5. Check that the Bestiary list is populated.
6. Check that Armor, Weapons, Augmentations, Equipment, Talents, Psionics, and Prayers are available.

## NPC favorites Firestore test

1. Configure `GeneratorNPC/config/firebase-config.js`.
2. Create `generatorNpc/favorites` using the script from this file.
3. Open `GeneratorNPC/index.html`.
4. Unlock DataVault data through the K.O.Z.A. access gate.
5. Select a Bestiary record.
6. Enter a favorite alias.
7. Click `Dodaj do ulubionych`.
8. Check that the entry appears on the list.
9. In Firebase Console, check that `generatorNpc/favorites` contains the `favorites` array.
10. Refresh the page and check that the favorite entry returns from Firestore.
11. Click `Wczytaj` on the favorite entry and check that the UI restores selections.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| K.O.Z.A. access gate does not accept the user | Wrong password, missing Auth, invalid `shared/firebase-config.js`, or invalid RTDB rules. | Check shared Firebase configuration and `shared/FirebaseREADME.md`. |
| Status says private data could not be loaded | Missing `datavault/live`, missing authorization, or invalid `dataJson` wrapper. | Check Realtime Database and DataVault-exported data. |
| Missing sheet message | `data.sheets` does not contain a sheet required by GeneratorNPC. | Update DataVault data and publish private data again. |
| Favorites use local storage | Missing `window.firebaseConfig` for `GeneratorNPC/config/firebase-config.js`. | Complete favorites Firestore configuration. |
| Favorites do not save to Firestore | Firestore rules block writes or the project is misconfigured. | Check `generatorNpc/favorites` and Firestore rules. |
| A favorite entry loads the wrong record | DataVault order or sheet content changed, while the favorite stores indices. | Refresh or save the favorite again after data updates. |
| Several groups see the same favorites | Several deployments use the same favorites Firestore project. | Create a separate Firebase project for each group/server. |

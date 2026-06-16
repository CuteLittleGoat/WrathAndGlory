# 🇵🇱 Konfiguracja Firebase — Kalkulator (PL)

## Do czego moduł używa Firebase

Moduł `Kalkulator` używa Firebase Firestore w widoku:

```text
Kalkulator/TworzeniePostaci.html
```

Firebase służy do zapisu i wczytywania aktualnego stanu kreatora postaci.

Aktualny kod zapisuje stan do dokumentu:

```text
character_builder/current
```

Zapis obejmuje:

- aktualny język interfejsu,
- pulę PD,
- wydane PD,
- pozostałe PD,
- atrybuty,
- umiejętności,
- talenty i inne wpisy kosztowe,
- informację o błędach walidacji,
- komunikaty walidacji,
- pełny snapshot formularza.

## Używane usługi Firebase

- Firestore: tak.
- Realtime Database: nie.
- Authentication: nie w aktualnym kodzie modułu.
- Storage: nie w aktualnym kodzie modułu.

Moduł korzysta z bibliotek Firebase w wersji kompatybilnościowej ładowanych bezpośrednio w HTML.

## Czy Firebase jest wymagany

Firebase jest wymagany tylko do funkcji:

- `Zapisz`,
- `Wczytaj`.

Sam kreator postaci działa bez Firebase, ale zapis i wczytanie stanu nie będą działały. Jeżeli `firebase` albo `window.firebaseConfig` nie są dostępne, kod ustawia kontekst Firebase jako niegotowy i po kliknięciu zapisu lub wczytania pokazuje błąd.

Moduł nie ma lokalnego fallbacku zapisu, np. do `localStorage`.

## Plik konfiguracyjny

Konfigurację Firebase należy umieścić w pliku:

```text
Kalkulator/config/firebase-config.js
```

Plik musi ustawić globalną zmienną:

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

Nie używaj `export`, ponieważ moduł korzysta z wersji kompatybilnościowej Firebase ładowanej bezpośrednio w HTML.

## Jak uzyskać dane konfiguracyjne

1. Otwórz Firebase Console.
2. Utwórz projekt albo wybierz istniejący projekt dla tej grupy lub serwera.
3. Dodaj aplikację typu Web.
4. Skopiuj konfigurację Firebase SDK.
5. Wklej wartości do `Kalkulator/config/firebase-config.js` jako `window.firebaseConfig`.
6. Utwórz bazę Firestore.
7. Utwórz dokument `character_builder/current` ręcznie albo skryptem z tego pliku.

Każda grupa lub każdy serwer powinien mieć własny projekt Firebase. Jeżeli kilka wdrożeń użyje tego samego projektu, będą współdzielić ten sam zapis `character_builder/current`.

## Struktura Firestore

```text
Firestore
└── character_builder (kolekcja)
    └── current (dokument)
```

## Integracja w kodzie

Funkcja `initializeFirebaseContext()` sprawdza, czy istnieją:

- globalny obiekt `firebase`,
- globalna konfiguracja `window.firebaseConfig`.

Jeżeli konfiguracja jest dostępna, inicjalizuje Firebase i zwraca referencję:

```js
db.collection('character_builder').doc('current')
```

Jeżeli konfiguracji nie ma, zwracany jest kontekst:

```js
{ ready: false, characterRef: null }
```

Przy zapisie kod wykonuje:

```js
firebaseContext.characterRef.set(payload)
```

Przy wczytywaniu kod wykonuje:

```js
const snapshot = await firebaseContext.characterRef.get();
```

Jeżeli dokument istnieje, jego dane są przekazywane do `applySavedState(...)`.

## Model danych `character_builder/current`

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `schemaVersion` | `number` | tak | Wersja schematu. Aktualny kod zapisuje `1`. |
| `module` | `string` | tak | Nazwa modułu zapisującego dane. Aktualnie `Kalkulator/TworzeniePostaci`. |
| `lang` | `string` | tak | Aktualny język interfejsu: `pl` albo `en`. |
| `savedAt` | `timestamp` | tak | Znacznik czasu Firestore ustawiany przez `firebase.firestore.FieldValue.serverTimestamp()`. |
| `savedBy` | `string` | tak | Identyfikator zapisującego. Aktualnie `anonymous-web-client`. |
| `xpPool` | `number` | tak | Pula PD wpisana w polu `xpPool`. |
| `xpTotal` | `number` | tak | Całkowita pula PD. W aktualnym kodzie taka sama jak `xpPool`. |
| `xpSpent` | `number` | tak | Wydane PD, obliczone jako `xpTotal - xpAvailable`. |
| `xpAvailable` | `number` | tak | Pozostałe PD z pola `xpRemaining`. |
| `hasValidationErrors` | `boolean` | tak | Czy aktualnie widoczny jest komunikat błędu. |
| `validationMessages` | `array<string>` | tak | Lista komunikatów walidacji. Pusta, jeżeli nie ma błędu. |
| `attributes` | `map` | tak | Mapa atrybutów postaci. |
| `skills` | `map` | tak | Mapa umiejętności. |
| `talents` | `array<object>` | tak | Lista 20 wpisów talentów/innych kosztów. |
| `formSnapshot` | `map` | tak | Pełny snapshot wszystkich pól `input`, `textarea` i `select` posiadających `id`. |

## Model `attributes`

| Pole | Typ | Domyślnie | Opis |
| --- | --- | --- | --- |
| `S` | `number` | `1` | Siła. |
| `Wt` | `number` | `1` | Wytrzymałość. |
| `Zr` | `number` | `1` | Zręczność. |
| `I` | `number` | `1` | Inicjatywa. |
| `SW` | `number` | `1` | Siła Woli. |
| `Int` | `number` | `1` | Inteligencja. |
| `Ogd` | `number` | `1` | Ogłada. |
| `Speed` | `number` | `6` | Szybkość. |

W UI atrybuty są ograniczane do zakresu 1-12.

## Model `skills`

`skills` zawiera 18 pól odpowiadających dwóm kolumnom po 9 umiejętności.

Nazwy pól:

```text
Column1Row1 ... Column1Row9
Column2Row1 ... Column2Row9
```

Wartości są liczbami z zakresu 0-8.

## Model `talents`

`talents` jest tablicą 20 obiektów.

Każdy obiekt ma strukturę:

| Pole | Typ | Opis |
| --- | --- | --- |
| `name` | `string` | Nazwa talentu, wiary, mocy psionicznej, archetypu, pakietu wyniesienia albo innego wpisu. |
| `cost` | `number` | Koszt PD. |

Wartości `cost` są normalizowane do liczby nieujemnej.

## Model `formSnapshot`

`formSnapshot` zawiera wartości wszystkich pól formularza, które spełniają warunki:

- są elementami `input`, `textarea` albo `select`,
- mają atrybut `id`.

Przykładowe klucze:

```text
languageSelect
xpPool
attr_S
attr_Wt
attr_Zr
attr_I
attr_SW
attr_Int
attr_Ogd
attr_Speed
skill_Column1Row1
skill_Column2Row1
talent_name_1
talent_cost_1
```

Przy wczytywaniu `applySavedState(...)` przechodzi po `formSnapshot` i ustawia wartości pól HTML o tych samych identyfikatorach. Następnie, jeżeli `lang` istnieje i jest obsługiwany, ustawia język oraz przelicza PD.

## Skrypt inicjalizujący Firestore

Zapisz jako:

```text
Kalkulator/config/init-firestore-character-builder.js
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

const TALENT_COUNT = 20;

const attributes = {
  S: 1,
  Wt: 1,
  Zr: 1,
  I: 1,
  SW: 1,
  Int: 1,
  Ogd: 1,
  Speed: 6
};

const skills = {};
for (let i = 1; i <= 9; i++) {
  skills[`Column1Row${i}`] = 0;
  skills[`Column2Row${i}`] = 0;
}

const talents = Array.from({ length: TALENT_COUNT }, () => ({
  name: "",
  cost: 0
}));

const formSnapshot = {
  languageSelect: "pl",
  xpPool: "155",
  attr_S: "1",
  attr_Wt: "1",
  attr_Zr: "1",
  attr_I: "1",
  attr_SW: "1",
  attr_Int: "1",
  attr_Ogd: "1",
  attr_Speed: "6"
};

for (let i = 1; i <= 9; i++) {
  formSnapshot[`skill_Column1Row${i}`] = "0";
  formSnapshot[`skill_Column2Row${i}`] = "0";
}

for (let i = 1; i <= TALENT_COUNT; i++) {
  formSnapshot[`talent_name_${i}`] = "";
  formSnapshot[`talent_cost_${i}`] = "0";
}

const payload = {
  schemaVersion: 1,
  module: "Kalkulator/TworzeniePostaci",
  lang: "pl",
  savedAt: admin.firestore.FieldValue.serverTimestamp(),
  savedBy: "anonymous-web-client",
  xpPool: 155,
  xpTotal: 155,
  xpSpent: 0,
  xpAvailable: 155,
  hasValidationErrors: false,
  validationMessages: [],
  attributes,
  skills,
  talents,
  formSnapshot
};

async function main() {
  await db.collection("character_builder").doc("current").set(payload, { merge: false });
  console.log("[OK] Utworzono dokument character_builder/current");
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
node Kalkulator/config/init-firestore-character-builder.js
```

W PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
node Kalkulator/config/init-firestore-character-builder.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Reguły Firestore

Aktualny kod modułu nie używa Firebase Authentication. Oznacza to, że Firestore nie potrafi odróżnić użytkowników ani chronić zapisu per osoba.

Minimalne reguły działające z aktualnym kodem powinny ograniczać dostęp tylko do dokumentu modułu. Przykład do testów i izolowanego projektu:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /character_builder/current {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Uwaga: powyższe reguły pozwalają każdemu, kto zna projekt Firebase, odczytać i nadpisać `character_builder/current`. Dla większego bezpieczeństwa należy dodać uwierzytelnianie albo inny mechanizm kontroli zapisu i odpowiednio zmienić kod modułu.

## Test połączenia

1. Otwórz `Kalkulator/TworzeniePostaci.html`.
2. Zmień kilka wartości, np. pulę PD, atrybut i jedną umiejętność.
3. Kliknij `Zapisz`.
4. Potwierdź zapis w modalu.
5. Sprawdź, czy pojawił się komunikat sukcesu.
6. W Firebase Console sprawdź dokument `character_builder/current`.
7. Zmień wartości w formularzu lokalnie.
8. Kliknij `Wczytaj`.
9. Potwierdź wczytanie.
10. Sprawdź, czy formularz wrócił do zapisanego stanu.

## Typowe błędy

| Objaw | Możliwa przyczyna | Rozwiązanie |
| --- | --- | --- |
| Kliknięcie `Zapisz` pokazuje błąd | Brak `window.firebaseConfig`, brak biblioteki Firebase albo błędna konfiguracja. | Sprawdź `Kalkulator/config/firebase-config.js` i konsolę przeglądarki. |
| Kliknięcie `Wczytaj` pokazuje błąd | Dokument `character_builder/current` nie istnieje albo brak dostępu. | Uruchom skrypt inicjalizujący i sprawdź reguły Firestore. |
| Dane zapisują się, ale inna grupa widzi ten sam stan | Kilka wdrożeń używa tego samego projektu Firebase. | Utwórz osobny projekt Firebase dla każdej grupy/serwera. |
| Po wczytaniu część pól się nie zmienia | Brak danego pola w `formSnapshot` albo zmieniono ID elementu HTML. | Zaktualizuj model zapisu i dokumentację po zmianie UI. |
| Firestore odrzuca zapis | Reguły blokują zapis albo projekt jest źle skonfigurowany. | Sprawdź Firestore Rules i konfigurację projektu. |

---

# 🇬🇧 Firebase setup — Kalkulator (EN)

## What this module uses Firebase for

The `Kalkulator` module uses Firebase Firestore in this view:

```text
Kalkulator/TworzeniePostaci.html
```

Firebase is used to save and load the current character builder state.

The current code saves state to:

```text
character_builder/current
```

The saved state includes:

- current interface language,
- XP pool,
- spent XP,
- remaining XP,
- attributes,
- skills,
- talents and other cost entries,
- validation error flag,
- validation messages,
- full form snapshot.

## Firebase services used

- Firestore: yes.
- Realtime Database: no.
- Authentication: not in the current module code.
- Storage: not in the current module code.

The module uses Firebase compatibility libraries loaded directly in HTML.

## Whether Firebase is required

Firebase is required only for:

- `Zapisz` / Save,
- `Wczytaj` / Load.

The character builder itself works without Firebase, but saving and loading state will not work. If `firebase` or `window.firebaseConfig` are not available, the code marks the Firebase context as not ready and shows an error when the user tries to save or load.

The module does not have a local save fallback, such as `localStorage`.

## Configuration file

Put Firebase configuration in:

```text
Kalkulator/config/firebase-config.js
```

The file must define the global variable:

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

Do not use `export`, because the module uses Firebase compatibility builds loaded directly in HTML.

## How to get configuration data

1. Open Firebase Console.
2. Create a project or select a project for this group or server.
3. Add a Web app.
4. Copy the Firebase SDK configuration.
5. Paste the values into `Kalkulator/config/firebase-config.js` as `window.firebaseConfig`.
6. Create a Firestore database.
7. Create `character_builder/current` manually or by using the script in this file.

Each group or server should use its own Firebase project. If several deployments use the same project, they will share the same `character_builder/current` state.

## Firestore structure

```text
Firestore
└── character_builder (collection)
    └── current (document)
```

## Code integration

`initializeFirebaseContext()` checks whether these exist:

- global `firebase` object,
- global `window.firebaseConfig`.

If configuration is available, it initializes Firebase and returns this reference:

```js
db.collection('character_builder').doc('current')
```

If configuration is not available, it returns:

```js
{ ready: false, characterRef: null }
```

When saving, the code runs:

```js
firebaseContext.characterRef.set(payload)
```

When loading, the code runs:

```js
const snapshot = await firebaseContext.characterRef.get();
```

If the document exists, its data is passed to `applySavedState(...)`.

## `character_builder/current` data model

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schemaVersion` | `number` | yes | Schema version. The current code writes `1`. |
| `module` | `string` | yes | Module name writing the data. Currently `Kalkulator/TworzeniePostaci`. |
| `lang` | `string` | yes | Current interface language: `pl` or `en`. |
| `savedAt` | `timestamp` | yes | Firestore timestamp set by `firebase.firestore.FieldValue.serverTimestamp()`. |
| `savedBy` | `string` | yes | Writer identifier. Currently `anonymous-web-client`. |
| `xpPool` | `number` | yes | XP pool entered in `xpPool`. |
| `xpTotal` | `number` | yes | Total XP pool. In current code it equals `xpPool`. |
| `xpSpent` | `number` | yes | Spent XP, calculated as `xpTotal - xpAvailable`. |
| `xpAvailable` | `number` | yes | Remaining XP from `xpRemaining`. |
| `hasValidationErrors` | `boolean` | yes | Whether an error message is currently visible. |
| `validationMessages` | `array<string>` | yes | Validation message list. Empty when there is no error. |
| `attributes` | `map` | yes | Character attributes map. |
| `skills` | `map` | yes | Skills map. |
| `talents` | `array<object>` | yes | List of 20 talent/other cost entries. |
| `formSnapshot` | `map` | yes | Full snapshot of all `input`, `textarea`, and `select` fields with IDs. |

## `attributes` model

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `S` | `number` | `1` | Strength. |
| `Wt` | `number` | `1` | Toughness. |
| `Zr` | `number` | `1` | Agility. |
| `I` | `number` | `1` | Initiative. |
| `SW` | `number` | `1` | Willpower. |
| `Int` | `number` | `1` | Intellect. |
| `Ogd` | `number` | `1` | Fellowship. |
| `Speed` | `number` | `6` | Speed. |

The UI clamps attributes to range 1-12.

## `skills` model

`skills` contains 18 fields matching two columns of 9 skills.

Field names:

```text
Column1Row1 ... Column1Row9
Column2Row1 ... Column2Row9
```

Values are numbers from 0 to 8.

## `talents` model

`talents` is an array of 20 objects.

Each object has this structure:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Talent, faith, psychic power, archetype, ascension package, or other entry name. |
| `cost` | `number` | XP cost. |

`cost` values are normalized to non-negative numbers.

## `formSnapshot` model

`formSnapshot` stores values of all form fields that meet both conditions:

- they are `input`, `textarea`, or `select` elements,
- they have an `id` attribute.

Example keys:

```text
languageSelect
xpPool
attr_S
attr_Wt
attr_Zr
attr_I
attr_SW
attr_Int
attr_Ogd
attr_Speed
skill_Column1Row1
skill_Column2Row1
talent_name_1
talent_cost_1
```

When loading, `applySavedState(...)` iterates over `formSnapshot` and sets HTML fields with matching IDs. Then, if `lang` exists and is supported, it sets the language and recalculates XP.

## Firestore initialization script

Save as:

```text
Kalkulator/config/init-firestore-character-builder.js
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

const TALENT_COUNT = 20;

const attributes = {
  S: 1,
  Wt: 1,
  Zr: 1,
  I: 1,
  SW: 1,
  Int: 1,
  Ogd: 1,
  Speed: 6
};

const skills = {};
for (let i = 1; i <= 9; i++) {
  skills[`Column1Row${i}`] = 0;
  skills[`Column2Row${i}`] = 0;
}

const talents = Array.from({ length: TALENT_COUNT }, () => ({
  name: "",
  cost: 0
}));

const formSnapshot = {
  languageSelect: "pl",
  xpPool: "155",
  attr_S: "1",
  attr_Wt: "1",
  attr_Zr: "1",
  attr_I: "1",
  attr_SW: "1",
  attr_Int: "1",
  attr_Ogd: "1",
  attr_Speed: "6"
};

for (let i = 1; i <= 9; i++) {
  formSnapshot[`skill_Column1Row${i}`] = "0";
  formSnapshot[`skill_Column2Row${i}`] = "0";
}

for (let i = 1; i <= TALENT_COUNT; i++) {
  formSnapshot[`talent_name_${i}`] = "";
  formSnapshot[`talent_cost_${i}`] = "0";
}

const payload = {
  schemaVersion: 1,
  module: "Kalkulator/TworzeniePostaci",
  lang: "pl",
  savedAt: admin.firestore.FieldValue.serverTimestamp(),
  savedBy: "anonymous-web-client",
  xpPool: 155,
  xpTotal: 155,
  xpSpent: 0,
  xpAvailable: 155,
  hasValidationErrors: false,
  validationMessages: [],
  attributes,
  skills,
  talents,
  formSnapshot
};

async function main() {
  await db.collection("character_builder").doc("current").set(payload, { merge: false });
  console.log("[OK] Created character_builder/current");
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
node Kalkulator/config/init-firestore-character-builder.js
```

In PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
node Kalkulator/config/init-firestore-character-builder.js
```

Do not commit the service account file to the repository.

## Firestore rules

The current module code does not use Firebase Authentication. This means Firestore cannot distinguish users or protect writes per person.

The minimal rules compatible with the current code should restrict access only to the module document. Example for testing or an isolated project:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /character_builder/current {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Warning: these rules allow anyone who knows the Firebase project to read and overwrite `character_builder/current`. For stronger security, add authentication or another write-control mechanism and update the module code accordingly.

## Connection test

1. Open `Kalkulator/TworzeniePostaci.html`.
2. Change a few values, for example XP pool, one attribute, and one skill.
3. Click `Zapisz`.
4. Confirm save in the modal.
5. Check that a success message appears.
6. In Firebase Console, check the `character_builder/current` document.
7. Change values locally in the form.
8. Click `Wczytaj`.
9. Confirm loading.
10. Check that the form returned to the saved state.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Clicking `Zapisz` shows an error | Missing `window.firebaseConfig`, missing Firebase library, or invalid config. | Check `Kalkulator/config/firebase-config.js` and the browser console. |
| Clicking `Wczytaj` shows an error | `character_builder/current` does not exist or access is denied. | Run the initialization script and check Firestore rules. |
| Data saves, but another group sees the same state | Several deployments use the same Firebase project. | Create a separate Firebase project for each group/server. |
| Some fields do not change after loading | The field is missing from `formSnapshot` or the HTML element ID changed. | Update the save model and documentation after UI changes. |
| Firestore rejects writes | Rules block writes or the project is misconfigured. | Check Firestore Rules and project configuration. |

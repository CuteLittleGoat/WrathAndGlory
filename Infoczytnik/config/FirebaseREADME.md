# 🇵🇱 Konfiguracja Firebase — Infoczytnik (PL)

## Do czego moduł używa Firebase

`Infoczytnik` używa Firebase Firestore do przekazywania aktualnego komunikatu z panelu GM do ekranu gracza.

Panel GM zapisuje cały stan wiadomości do dokumentu:

```text
dataslate/current
```

Ekran gracza nasłuchuje tego samego dokumentu i po każdej zmianie aktualizuje widok.

W Firebase zapisywane są między innymi:

- typ akcji: wiadomość, ping albo czyszczenie,
- treść komunikatu,
- wybrane tło,
- wybrane logo,
- kolor logo,
- wybrany font,
- wybrane audio,
- linie fillerów prefix/suffix,
- kolory tekstu,
- rozmiary fontów,
- ustawienia efektów wizualnych,
- znacznik czasu,
- nonce chroniący przed powtórnym odtworzeniem tej samej akcji.

## Używane usługi Firebase

- Firestore: tak.
- Realtime Database: nie.
- Authentication: nie w aktualnym kodzie modułu.
- Storage: nie w aktualnym kodzie modułu.

Moduł korzysta z bibliotek `firebase-app-compat.js` i `firebase-firestore-compat.js`.

## Czy Firebase jest wymagany

Tak. Aktualny moduł wymaga Firestore do komunikacji między panelem GM i ekranem gracza.

Bez poprawnej konfiguracji Firebase:

- panel GM nie zapisze komunikatu,
- ekran gracza nie odbierze komunikatu,
- w konsoli pojawi się błąd konfiguracji albo połączenia.

Moduł nie ma pełnego fallbacku offline dla komunikacji GM-gracz.

## Plik konfiguracyjny

Konfigurację Firebase należy umieścić w pliku:

```text
Infoczytnik/config/firebase-config.js
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
2. Utwórz projekt albo wybierz istniejący projekt przeznaczony dla tej grupy/serwera.
3. Dodaj aplikację typu Web.
4. Skopiuj konfigurację Firebase SDK.
5. Wklej wartości do `Infoczytnik/config/firebase-config.js` jako `window.firebaseConfig`.
6. Utwórz bazę Firestore.
7. Utwórz dokument `dataslate/current` ręcznie albo skryptem z tego pliku.

Każda grupa lub każdy serwer powinien mieć własny projekt Firebase. Jeżeli kilka serwerów użyje tego samego projektu, będą współdzielić ten sam komunikat `dataslate/current`.

## Struktura Firestore

```text
Firestore
└── dataslate (kolekcja)
    └── current (dokument)
```

## Typy akcji w polu `type`

| Wartość | Znaczenie |
| --- | --- |
| `message` | Ekran gracza pokazuje wiadomość i odtwarza audio wiadomości, jeżeli audio jest włączone. |
| `ping` | Ekran gracza odtwarza dźwięk ping i nie zmienia treści wiadomości. |
| `clear` | Ekran gracza czyści treść wiadomości. |

## Model danych `dataslate/current`

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `type` | `string` | tak | Typ akcji: `message`, `ping` albo `clear`. |
| `text` | `string` | tak | Treść wiadomości. Dla `ping` i `clear` zwykle pusta. |
| `backgroundId` | `number|null` | tak | ID wybranego tła z manifestu. |
| `backgroundFile` | `string` | tak | Ścieżka do pliku tła. |
| `logoId` | `number|null` | tak | ID wybranego logo z manifestu. |
| `logoFile` | `string` | tak | Ścieżka do pliku logo. |
| `fillerId` | `number|null` | tak | ID zestawu fillerów. |
| `fillerSet` | `string` | tak | Nazwa zestawu fillerów. |
| `fontId` | `number|null` | tak | ID fontu z manifestu. |
| `fontPreset` | `string` | tak | Nazwa fontu używana przez ekran gracza. |
| `messageAudioId` | `number|null` | tak | ID audio wiadomości. |
| `messageAudioFile` | `string` | tak | Ścieżka do audio wiadomości. |
| `fillersEnabled` | `boolean` | tak | Czy prefix i suffix są widoczne. |
| `audioEnabled` | `boolean` | tak | Czy ekran gracza ma odtworzyć audio wiadomości. |
| `showLogo` | `boolean` | tak | Czy logo ma być widoczne. |
| `movingOverlay` | `boolean` | tak | Czy prostokąt cienia ma być aktywny. |
| `flicker` | `boolean` | tak | Czy efekt flicker ma być aktywny. |
| `prefixLines` | `array<string>` | tak | Linie prefixu. |
| `suffixLines` | `array<string>` | tak | Linie suffixu. |
| `fillerLineCount` | `number` | tak | Liczba losowanych linii fillerów, zakres 1-5. |
| `fillerBandLines` | `number` | tak | Wysokość stref prefix/suffix, zakres 1-6. |
| `messageColor` | `string` | tak | Kolor treści wiadomości w formacie HEX. |
| `logoColor` | `string` | tak | Kolor logo w formacie HEX. |
| `prefixColor` | `string` | tak | Kolor prefixu w formacie HEX. |
| `suffixColor` | `string` | tak | Kolor suffixu w formacie HEX. |
| `msgFontSize` | `number` | tak | Bazowy rozmiar fontu wiadomości, zakres 12-80. |
| `prefixFontSize` | `number` | tak | Bazowy rozmiar fontu prefixu, zakres 10-60. |
| `suffixFontSize` | `number` | tak | Bazowy rozmiar fontu suffixu, zakres 10-60. |
| `pingUrl` | `string` | tak | Ścieżka do pliku audio ping. |
| `nonce` | `string` | tak | Unikalna wartość akcji, używana do ignorowania powtórzonego snapshotu. |
| `ts` | `timestamp` | tak | Znacznik czasu Firestore. |

## Skrypt inicjalizujący Firestore

Zapisz jako:

```text
Infoczytnik/config/init-firestore-structure.js
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
  type: "clear",
  text: "",
  backgroundId: 10,
  backgroundFile: "assets/backgrounds/WnG.png",
  logoId: 3,
  logoFile: "",
  fillerId: 1,
  fillerSet: "",
  fontId: 1,
  fontPreset: "Share Tech Mono",
  messageAudioId: 1,
  messageAudioFile: "",
  fillersEnabled: true,
  audioEnabled: true,
  showLogo: false,
  movingOverlay: false,
  flicker: false,
  prefixLines: [],
  suffixLines: [],
  fillerLineCount: 3,
  fillerBandLines: 2,
  messageColor: "#00ff66",
  logoColor: "#d4af37",
  prefixColor: "#ffffff",
  suffixColor: "#ffffff",
  msgFontSize: 20,
  prefixFontSize: 12,
  suffixFontSize: 12,
  pingUrl: "assets/audios/ping/Ping.mp3",
  nonce: `init-${Date.now()}`,
  ts: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  await db.collection("dataslate").doc("current").set(payload, { merge: false });
  console.log("[OK] Utworzono dokument dataslate/current");
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
node Infoczytnik/config/init-firestore-structure.js
```

W PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\pelna\\sciezka\\do\\service-account.json"
node Infoczytnik/config/init-firestore-structure.js
```

Pliku konta serwisowego nie wolno commitować do repozytorium.

## Reguły Firestore

Aktualny kod modułu nie używa Firebase Authentication. Oznacza to, że Firestore nie potrafi odróżnić panelu GM od ekranu gracza.

Minimalne reguły działające z aktualnym kodem powinny ograniczać dostęp tylko do dokumentu modułu. Przykład do testów i izolowanego projektu:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dataslate/current {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Uwaga: powyższe reguły pozwalają każdemu, kto zna projekt Firebase, odczytać i zapisać `dataslate/current`. Dla większego bezpieczeństwa należy dodać uwierzytelnianie lub inny mechanizm ograniczenia zapisu i odpowiednio zmienić kod modułu.

## Test połączenia

1. Otwórz `Infoczytnik/GM.html`.
2. Otwórz `Infoczytnik/Infoczytnik.html` w drugim oknie lub na drugim urządzeniu.
3. W panelu GM wpisz krótką wiadomość.
4. Kliknij `Wyślij`.
5. Sprawdź, czy wiadomość pojawiła się na ekranie gracza.
6. Kliknij `Ping` i sprawdź, czy ekran gracza odtworzył dźwięk ping.
7. Kliknij `Przywróć domyślne` i sprawdź, czy ekran gracza wyczyścił wiadomość.

## Typowe błędy

| Objaw | Możliwa przyczyna | Rozwiązanie |
| --- | --- | --- |
| `Missing firebase config` | Brak `window.firebaseConfig`. | Sprawdź `Infoczytnik/config/firebase-config.js`. |
| Panel GM pokazuje błąd przy wysyłce | Brak dostępu do Firestore albo błędne reguły. | Sprawdź projekt Firebase i reguły Firestore. |
| Ekran gracza nic nie pokazuje | Dokument `dataslate/current` nie istnieje albo snapshot nie dochodzi. | Uruchom skrypt inicjalizujący i sprawdź konsolę. |
| Ping nie gra | Przeglądarka blokuje audio przed interakcją użytkownika. | Kliknij ekran gracza przed testem audio. |
| Kilka grup widzi te same komunikaty | Używają tego samego projektu Firebase. | Utwórz osobny projekt Firebase dla każdej grupy/serwera. |

---

# 🇬🇧 Firebase setup — Infoczytnik (EN)

## What this module uses Firebase for

`Infoczytnik` uses Firebase Firestore to send the current message state from the GM panel to the player display.

The GM panel writes the complete message state to:

```text
dataslate/current
```

The player display listens to the same document and updates the screen whenever the document changes.

The Firestore document stores, among other fields:

- action type: message, ping, or clear,
- message text,
- selected background,
- selected logo,
- logo color,
- selected font,
- selected audio,
- prefix/suffix filler lines,
- text colors,
- font sizes,
- visual effect settings,
- timestamp,
- nonce used to avoid handling the same action twice.

## Firebase services used

- Firestore: yes.
- Realtime Database: no.
- Authentication: not in the current module code.
- Storage: not in the current module code.

The module uses `firebase-app-compat.js` and `firebase-firestore-compat.js`.

## Whether Firebase is required

Yes. The current module requires Firestore for GM-to-player communication.

Without a valid Firebase configuration:

- the GM panel will not save messages,
- the player display will not receive messages,
- the browser console will show a configuration or connection error.

The module does not have a full offline fallback for GM-to-player communication.

## Configuration file

Put the Firebase configuration in:

```text
Infoczytnik/config/firebase-config.js
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

Do not use `export`, because the module uses the Firebase compatibility build loaded directly by HTML files.

## How to get configuration data

1. Open Firebase Console.
2. Create a project or select a project dedicated to this group/server.
3. Add a Web app.
4. Copy the Firebase SDK configuration.
5. Paste the values into `Infoczytnik/config/firebase-config.js` as `window.firebaseConfig`.
6. Create a Firestore database.
7. Create `dataslate/current` manually or by using the script in this file.

Each group or server should use its own Firebase project. If several servers use the same project, they will share the same `dataslate/current` message.

## Firestore structure

```text
Firestore
└── dataslate (collection)
    └── current (document)
```

## Action types in the `type` field

| Value | Meaning |
| --- | --- |
| `message` | The player display shows the message and plays message audio if audio is enabled. |
| `ping` | The player display plays the ping sound and does not change the message text. |
| `clear` | The player display clears the message text. |

## `dataslate/current` data model

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `string` | yes | Action type: `message`, `ping`, or `clear`. |
| `text` | `string` | yes | Message text. Usually empty for `ping` and `clear`. |
| `backgroundId` | `number|null` | yes | Selected background ID from the manifest. |
| `backgroundFile` | `string` | yes | Background file path. |
| `logoId` | `number|null` | yes | Selected logo ID from the manifest. |
| `logoFile` | `string` | yes | Logo file path. |
| `fillerId` | `number|null` | yes | Filler set ID. |
| `fillerSet` | `string` | yes | Filler set name. |
| `fontId` | `number|null` | yes | Font ID from the manifest. |
| `fontPreset` | `string` | yes | Font family used by the player display. |
| `messageAudioId` | `number|null` | yes | Message audio ID. |
| `messageAudioFile` | `string` | yes | Message audio file path. |
| `fillersEnabled` | `boolean` | yes | Whether prefix and suffix are visible. |
| `audioEnabled` | `boolean` | yes | Whether the player display should play message audio. |
| `showLogo` | `boolean` | yes | Whether the logo is visible. |
| `movingOverlay` | `boolean` | yes | Whether the shadow rectangle is enabled. |
| `flicker` | `boolean` | yes | Whether the flicker effect is enabled. |
| `prefixLines` | `array<string>` | yes | Prefix lines. |
| `suffixLines` | `array<string>` | yes | Suffix lines. |
| `fillerLineCount` | `number` | yes | Number of random filler lines, range 1-5. |
| `fillerBandLines` | `number` | yes | Prefix/suffix band height, range 1-6. |
| `messageColor` | `string` | yes | Message color in HEX format. |
| `logoColor` | `string` | yes | Logo color in HEX format. |
| `prefixColor` | `string` | yes | Prefix color in HEX format. |
| `suffixColor` | `string` | yes | Suffix color in HEX format. |
| `msgFontSize` | `number` | yes | Base message font size, range 12-80. |
| `prefixFontSize` | `number` | yes | Base prefix font size, range 10-60. |
| `suffixFontSize` | `number` | yes | Base suffix font size, range 10-60. |
| `pingUrl` | `string` | yes | Ping audio file path. |
| `nonce` | `string` | yes | Unique action value used to ignore repeated snapshots. |
| `ts` | `timestamp` | yes | Firestore timestamp. |

## Firestore initialization script

Save as:

```text
Infoczytnik/config/init-firestore-structure.js
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
  type: "clear",
  text: "",
  backgroundId: 10,
  backgroundFile: "assets/backgrounds/WnG.png",
  logoId: 3,
  logoFile: "",
  fillerId: 1,
  fillerSet: "",
  fontId: 1,
  fontPreset: "Share Tech Mono",
  messageAudioId: 1,
  messageAudioFile: "",
  fillersEnabled: true,
  audioEnabled: true,
  showLogo: false,
  movingOverlay: false,
  flicker: false,
  prefixLines: [],
  suffixLines: [],
  fillerLineCount: 3,
  fillerBandLines: 2,
  messageColor: "#00ff66",
  logoColor: "#d4af37",
  prefixColor: "#ffffff",
  suffixColor: "#ffffff",
  msgFontSize: 20,
  prefixFontSize: 12,
  suffixFontSize: 12,
  pingUrl: "assets/audios/ping/Ping.mp3",
  nonce: `init-${Date.now()}`,
  ts: admin.firestore.FieldValue.serverTimestamp()
};

async function main() {
  await db.collection("dataslate").doc("current").set(payload, { merge: false });
  console.log("[OK] Created dataslate/current");
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
node Infoczytnik/config/init-firestore-structure.js
```

In PowerShell:

```powershell
npm i firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\\full\\path\\to\\service-account.json"
node Infoczytnik/config/init-firestore-structure.js
```

Do not commit the service account file to the repository.

## Firestore rules

The current module code does not use Firebase Authentication. This means Firestore cannot distinguish the GM panel from the player display.

The minimal rules compatible with the current code should restrict access only to the module document. Example for testing or an isolated project:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dataslate/current {
      allow read: if true;
      allow write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Warning: these rules allow anyone who knows the Firebase project to read and write `dataslate/current`. For stronger security, add authentication or another write-limiting mechanism and update the module code accordingly.

## Connection test

1. Open `Infoczytnik/GM.html`.
2. Open `Infoczytnik/Infoczytnik.html` in another window or on another device.
3. Type a short message in the GM panel.
4. Click `Wyślij`.
5. Check whether the message appears on the player display.
6. Click `Ping` and check whether the player display plays the ping sound.
7. Click `Przywróć domyślne` and check whether the player display clears the message.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| `Missing firebase config` | `window.firebaseConfig` is missing. | Check `Infoczytnik/config/firebase-config.js`. |
| The GM panel shows an error when sending | Firestore access is denied or rules are incorrect. | Check the Firebase project and Firestore rules. |
| The player display shows nothing | `dataslate/current` does not exist or the snapshot does not arrive. | Run the initialization script and check the browser console. |
| Ping does not play | The browser blocks audio before user interaction. | Click the player display before testing audio. |
| Several groups see the same messages | They use the same Firebase project. | Create a separate Firebase project for each group/server. |

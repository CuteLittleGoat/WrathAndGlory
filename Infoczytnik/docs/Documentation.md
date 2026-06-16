# 🇵🇱 Dokumentacja techniczna — Infoczytnik (PL)

## Cel modułu

`Infoczytnik` jest modułem dwuekranowym służącym do wysyłania stylizowanych komunikatów z panelu GM na ekran graczy.

Moduł składa się z:

- panelu GM, w którym prowadzący wybiera tło, logo, font, fillery, kolory, audio i treść wiadomości,
- ekranu gracza, który nasłuchuje dokumentu Firestore i renderuje aktualny komunikat,
- strony startowej pozwalającej wybrać wersję produkcyjną albo testową,
- manifestu danych opisującego dostępne tła, logotypy, fonty, audio i fillery.

Komunikacja między panelem GM i ekranem gracza odbywa się przez Firebase Firestore, dokument `dataslate/current`.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `Infoczytnik/index.html` | Strona startowa modułu. Zawiera linki do wersji produkcyjnych i testowych. |
| `Infoczytnik/GM.html` | Produkcyjny panel GM. |
| `Infoczytnik/Infoczytnik.html` | Produkcyjny ekran gracza. |
| `Infoczytnik/GM_test.html` | Testowy panel GM. Zgodnie z lokalnym `AGENTS.md` to tu należy wykonywać zmiany kodu panelu. |
| `Infoczytnik/Infoczytnik_test.html` | Testowy ekran gracza. Zgodnie z lokalnym `AGENTS.md` to tu należy wykonywać zmiany kodu ekranu odbiorcy. |

## Zasady pracy wynikające z lokalnego `Infoczytnik/AGENTS.md`

Zmiany kodu modułu należy wykonywać w plikach testowych:

- `GM_test.html`,
- `Infoczytnik_test.html`.

Nie wolno automatycznie modyfikować plików produkcyjnych i backupów:

- `GM.html`,
- `Infoczytnik.html`,
- `GM_backup.html`,
- `Infoczytnik_backup.html`.

Pliki produkcyjne i backupy są aktualizowane ręcznie przez właściciela repozytorium.

Po każdej zmianie kodu w plikach testowych trzeba zaktualizować `INF_VERSION` w obu plikach testowych. Wersja musi być taka sama w `GM_test.html` i `Infoczytnik_test.html` oraz mieć format `rrrr-MM-dd_HH-mm-ss` według lokalnego czasu w Polsce.

Po zmianach kodu trzeba wykonać test dwuekranowy: uruchomić panel GM, uruchomić ekran gracza, wysłać testową wiadomość, sprawdzić render, layout i audio.

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `index.html` | Menu wyboru wersji produkcyjnej i testowej. |
| `GM.html` | Produkcyjny panel GM. |
| `Infoczytnik.html` | Produkcyjny ekran gracza. |
| `GM_test.html` | Testowy panel GM przeznaczony do zmian kodu. |
| `Infoczytnik_test.html` | Testowy ekran gracza przeznaczony do zmian kodu. |
| `config/firebase-config.js` | Kliencka konfiguracja Firebase ustawiająca `window.firebaseConfig`. |
| `config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase i Firestore dla modułu. |
| `assets/data/data.json` | Aktualny manifest danych używany przez panel GM. |
| `assets/data/DataSlate_manifest.xlsx` | Arkusz źródłowy do wygenerowania manifestu `data.json`. |
| `assets/data/Mapowanie.xlsx` | Mapowanie teł do ramek technicznych używanych do wyliczenia pola tekstu. |
| `assets/data/NiebieskaRamka.md` | Opis metody wyliczania prostokąta tekstu na podstawie niebieskiej ramki. |
| `assets/backgrounds/` | Tła wyświetlane na ekranie gracza. |
| `assets/ramki/` | Techniczne grafiki z niebieską ramką do obliczania pola tekstu. |
| `assets/logos/` | Logotypy renderowane jako maski kolorowane przez CSS. |
| `assets/audios/` | Pliki audio wiadomości i ping. |
| `docs/README.md` | Instrukcja użytkownika. |
| `docs/Documentation.md` | Niniejsza dokumentacja techniczna. |

## Zewnętrzne zależności

Moduł korzysta z zależności ładowanych bezpośrednio w HTML:

- Google Fonts — rodziny fontów używane przez panel i ekran gracza,
- Firebase App Compat `9.6.8`,
- Firebase Firestore Compat `9.6.8`,
- SheetJS/XLSX `0.20.3` w panelu GM do odczytu `DataSlate_manifest.xlsx`.

Moduł nie ma oddzielnego backendu aplikacyjnego. Współdzielony stan między GM i ekranem gracza znajduje się w Firestore.

## Strona startowa `index.html`

`index.html` jest prostą stroną wyboru. Zawiera dwie sekcje:

- wersje produkcyjne: `GM.html`, `Infoczytnik.html`,
- wersje testowe: `GM_test.html`, `Infoczytnik_test.html`.

Na stronie znajduje się także informacja, że na ekranie Infoczytnika trzeba kliknąć raz ekran, żeby odblokować audio. Jest to wymóg przeglądarek, które blokują automatyczne odtwarzanie dźwięku przed interakcją użytkownika.

## Panel GM — struktura UI

Panel GM zawiera dwie główne kolumny ustawień oraz sekcje akcji.

Najważniejsze elementy UI:

| Element | ID | Rola |
| --- | --- | --- |
| Wybór tła | `backgroundSelect` | Wybiera tło z manifestu. |
| Wybór logo | `logoSelect` | Wybiera logo z manifestu. |
| Kolor logo | `logoColorText`, `logoColorPicker`, `logoColorChips` | Pozwala wpisać, wybrać albo kliknąć preset koloru logo. |
| Zestaw fillerów | `fillerSelect` | Wybiera zestaw prefixów i suffixów. |
| Font | `fontSelect` | Wybiera rodzinę fontu. |
| Audio wiadomości | `audioSelect` | Wybiera audio odtwarzane przy wiadomości. |
| Logo | `showLogo` | Włącza albo wyłącza logo. |
| Prostokąt cienia | `movingOverlay` | Włącza albo wyłącza cień pod warstwą tekstową. |
| Flicker | `flicker` | Włącza migotanie overlay. Działa tylko przy aktywnym prostokącie cienia. |
| Fillery | `fillersEnabled` | Włącza albo wyłącza prefix i suffix. |
| Audio | `audioEnabled` | Włącza albo wyłącza audio wiadomości. |
| Ilość linii fillerów | `fillerLineCount` | Liczba losowanych linii prefix/suffix, zakres 1-5. |
| Wysokość stref prefix/suffix | `fillerBandLines` | Wysokość pasów prefix/suffix, zakres 1-6. |
| Kolor wiadomości | `messageColorText`, `messageColorPicker` | Kolor głównej treści wiadomości. |
| Rozmiar wiadomości | `msgFontSize` | Bazowy rozmiar fontu wiadomości, zakres 12-80. |
| Kolor prefix/suffix | `psColorText`, `psColorPicker` | Wspólny kolor prefixu i suffixu. |
| Rozmiar prefix/suffix | `psFontSize` | Bazowy rozmiar fontu prefixu i suffixu, zakres 10-60. |
| Tryb podglądu | `previewModeContent`, `previewModeBackground` | Przełącza podgląd między treścią i tłem. |
| Treść komunikatu | `message` | Tekst wiadomości wysyłany dla `type: message`. |
| Wyślij | `sendBtn` | Zapisuje do Firestore payload typu `message`. |
| Ping | `pingBtn` | Zapisuje do Firestore payload typu `ping`. |
| Wyczyść komunikat | `clearMessageBtn` | Czyści lokalnie pole tekstowe panelu GM. Nie wysyła `clear` do Firestore. |
| Przywróć domyślne | `restoreDefaultsBtn` | Przywraca ustawienia domyślne i wysyła `clear` do Firestore. |
| Wylosuj fillery | `rerollFillersBtn` | Losuje nowe linie prefix/suffix z wybranego zestawu. |
| Aktualizuj dane z XLSX | `updateDataBtn` | Wczytuje `DataSlate_manifest.xlsx`, buduje manifest i pobiera nowy `data.json`. |
| Log importu | `importLog` | Pokazuje błędy i ostrzeżenia importu. |
| Status | `status` | Pokazuje aktualny stan operacji panelu. |

## Panel GM — stan aplikacji

Najważniejsze stałe i zmienne:

| Nazwa | Rola |
| --- | --- |
| `DEFAULT_FORM_STATE` | Domyślny stan formularza GM. Zawiera ID tła, logo, fillerów, fontu, audio, kolory, font size i przełączniki. |
| `FONT_FALLBACK` | Końcowy font-stack używany, gdy wybrany font nie jest dostępny. |
| `PING_URL` | Ścieżka do audio ping z parametrem wersji. |
| `PREVIEW_MODE_KEY` | Klucz `localStorage` zapisujący tryb podglądu panelu GM. |
| `currentRef` | Referencja Firestore do `dataslate/current`. |
| `el` | Mapa referencji DOM. |
| `manifest` | Manifest załadowany z `assets/data/data.json` albo z XLSX. |
| `fillerState` | Aktualnie wylosowane linie `prefixLines` i `suffixLines`. |

## Panel GM — najważniejsze funkcje

| Funkcja | Rola |
| --- | --- |
| `autoCacheBust()` | Wymusza parametr `?v=<INF_VERSION>` w URL. |
| `setStatus(text)` | Ustawia tekst statusu. |
| `clamp(value, min, max, default)` | Ogranicza wartości liczbowe do dozwolonego zakresu. |
| `safeGet(list, id)` | Pobiera element z listy po ID albo zwraca pierwszy element. |
| `nonce()` | Tworzy unikalny identyfikator akcji. |
| `normalizeHexColor(...)` | Normalizuje kolor HEX i obsługuje fallback. |
| `resolveHexColor(...)` | Wybiera poprawny kolor z pola tekstowego albo pickera. |
| `fillSelect(...)` | Wypełnia listy wyboru danymi z manifestu. |
| `writeImportLog(...)` | Wpisuje wynik importu do pola logu. |
| `buildManifestFromWorkbook(...)` | Buduje manifest na podstawie arkusza XLSX. |
| `updateDataFromXlsx()` | Pobiera XLSX, buduje manifest i pobiera wygenerowany `data.json`. |
| `loadManifest()` | Ładuje `assets/data/data.json` i uzupełnia listy wyboru. |
| `rerollFillers()` | Losuje nowe prefixy i suffixy. |
| `syncFlickerDependency()` | Blokuje flicker, gdy wyłączony jest prostokąt cienia. |
| `getPreviewMode()` | Zwraca tryb podglądu. |
| `setPreviewMode(mode)` | Ustawia tryb podglądu i zapisuje go w `localStorage`. |
| `loadSavedPreviewMode()` | Odczytuje zapamiętany tryb podglądu. |
| `preloadManifestFonts()` | Preloaduje fonty z manifestu. |
| `applySelectedFontToPreview()` | Stosuje wybrany font w podglądzie. |
| `updateLogoColorPanelState()` | Wyszarza albo aktywuje panel koloru logo zależnie od `showLogo`. |
| `renderPreview()` | Renderuje lokalny podgląd treści, kolorów, logo, fontów i fillerów. |
| `getPayload(type)` | Serializuje bieżący stan panelu do payloadu Firestore. |
| `send(type)` | Zapisuje pełny payload do `dataslate/current` z `merge:false`. |
| `ping()` | Zapisuje pełny payload typu `ping`. |
| `restoreDefaults(sendReset)` | Przywraca domyślne ustawienia; opcjonalnie wysyła `clear`. |

## Import XLSX do manifestu JSON

Źródłem importu jest:

```text
assets/data/DataSlate_manifest.xlsx
```

Panel GM używa SheetJS do odczytu arkusza i generuje manifest zgodny z `assets/data/data.json`.

Oczekiwane arkusze:

| Arkusz | Rola |
| --- | --- |
| `backgrounds` | Lista teł. |
| `logos` | Lista logotypów. |
| `audios` | Lista plików audio wiadomości. |
| `fonts` | Lista fontów. |
| `fillers` | Zestawy prefixów i suffixów. |

Import akceptuje aliasy nazw kolumn. Przykładowo nazwa może być pobrana z `name` albo `nazwa`, a ścieżka pliku z `file`, `plik` albo `url`.

Fillery są rozbijane po nowych liniach oraz po pionowej kresce `|`. Średnik pozostaje częścią tekstu fillera, ponieważ w gotowych litaniach może oddzielać fragmenty zdania i nie powinien rozbijać pojedynczego wpisu.

Przycisk `Aktualizuj dane z XLSX` nie zapisuje pliku automatycznie do repozytorium. Generuje i pobiera nowy `data.json`. Aby zmienić manifest używany przez moduł, pobrany plik należy umieścić w `Infoczytnik/assets/data/data.json`.

## Manifest `assets/data/data.json`

Manifest zawiera główne tablice:

| Pole | Typ | Rola |
| --- | --- | --- |
| `backgrounds` | `array` | Tła dostępne w panelu GM. |
| `logos` | `array` | Logotypy dostępne w panelu GM. |
| `audios` | `array` | Audio wiadomości. |
| `fonts` | `array` | Fonty dostępne w panelu GM. |
| `fillers` | `array` | Zestawy prefixów i suffixów. |
| `importLog` | `array` | Log błędów lub ostrzeżeń importu. |

Przykładowe rekordy manifestu:

```json
{
  "backgrounds": [
    { "id": 10, "name": "WnG", "file": "assets/backgrounds/WnG.png" }
  ],
  "logos": [
    { "id": 3, "name": "Aquila", "file": "assets/logos/Aquila.png" }
  ],
  "audios": [
    { "id": 1, "name": "Keyboard Typing", "file": "assets/audios/KeyboardTyping.mp3" }
  ],
  "fonts": [
    { "id": 1, "name": "Adeptus Mechanicus", "font": "Share Tech Mono" }
  ],
  "fillers": [
    {
      "id": 1,
      "name": "Adeptus Mechanicus",
      "prefixes": ["+++ INCOMING DATA FEED +++"],
      "suffixes": ["+++ PRAISE THE OMNISSIAH +++"]
    }
  ]
}
```

## Payload Firestore `dataslate/current`

Panel GM zapisuje pełny snapshot do Firestore:

```js
currentRef.set(getPayload(type), { merge: false })
```

`merge:false` jest celowe. Dokument `dataslate/current` ma być pełnym źródłem prawdy dla ekranu gracza, a nie zbiorem częściowych aktualizacji.

Model danych:

| Pole | Typ | Opis |
| --- | --- | --- |
| `type` | `string` | `message`, `ping` albo `clear`. |
| `text` | `string` | Treść wiadomości dla `message`; pusty string dla `ping` i `clear`. |
| `backgroundId` | `number|null` | ID tła. |
| `backgroundFile` | `string` | Ścieżka do tła. |
| `logoId` | `number|null` | ID logo. |
| `logoFile` | `string` | Ścieżka do pliku logo. |
| `fillerId` | `number|null` | ID zestawu fillerów. |
| `fillerSet` | `string` | Nazwa zestawu fillerów. |
| `fontId` | `number|null` | ID fontu. |
| `fontPreset` | `string` | Nazwa fontu CSS. |
| `messageAudioId` | `number|null` | ID audio wiadomości. |
| `messageAudioFile` | `string` | Ścieżka do audio wiadomości. |
| `fillersEnabled` | `boolean` | Czy prefix i suffix są aktywne. |
| `audioEnabled` | `boolean` | Czy audio wiadomości jest aktywne. |
| `showLogo` | `boolean` | Czy logo jest widoczne. |
| `movingOverlay` | `boolean` | Czy cień overlay jest aktywny. |
| `flicker` | `boolean` | Czy migotanie overlay jest aktywne. |
| `prefixLines` | `array<string>` | Linie prefixu. |
| `suffixLines` | `array<string>` | Linie suffixu. |
| `fillerLineCount` | `number` | Liczba linii fillerów, zakres 1-5. |
| `fillerBandLines` | `number` | Wysokość stref prefix/suffix, zakres 1-6. |
| `messageColor` | `string` | Kolor głównej wiadomości. |
| `logoColor` | `string` | Kolor logo. |
| `prefixColor` | `string` | Kolor prefixu. |
| `suffixColor` | `string` | Kolor suffixu. |
| `msgFontSize` | `number` | Rozmiar fontu wiadomości, zakres 12-80. |
| `prefixFontSize` | `number` | Rozmiar fontu prefixu, zakres 10-60. |
| `suffixFontSize` | `number` | Rozmiar fontu suffixu, zakres 10-60. |
| `pingUrl` | `string` | Ścieżka do audio ping. |
| `nonce` | `string` | Unikalny identyfikator akcji. |
| `ts` | `timestamp` | Firestore server timestamp. |

## Typy akcji

| `type` | Zachowanie panelu GM | Zachowanie ekranu gracza |
| --- | --- | --- |
| `message` | Zapisuje pełny payload z treścią pola `message`. | Stosuje layout, style i treść. Odtwarza `messageAudioFile`, jeżeli `audioEnabled !== false`. |
| `ping` | Zapisuje pełny payload typu ping. | Stosuje layout i style, odtwarza `PING_URL`, nie zmienia treści wiadomości. |
| `clear` | Wysyłany przez `restoreDefaults(true)`. | Stosuje layout i style, czyści prefix, treść i suffix. |

## Integracja Firebase

Moduł korzysta z Firebase w trybie kompatybilnościowym:

```html
<script src="config/firebase-config.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
```

`config/firebase-config.js` musi ustawiać globalne `window.firebaseConfig`. Nie używa się `export`.

Panel GM wykonuje:

```js
firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();
const currentRef = db.collection('dataslate').doc('current');
```

Ekran gracza wykonuje analogiczną inicjalizację i nasłuchuje:

```js
const ref = db.collection('dataslate').doc('current');
ref.onSnapshot((snap) => { ... });
```

Szczegółowa konfiguracja Firebase, skrypt inicjalizujący Firestore, reguły oraz test połączenia są opisane w `Infoczytnik/config/FirebaseREADME.md`.

## Ekran gracza — struktura renderu

Ekran gracza renderuje pełnoekranowy widok:

| Element | ID | Rola |
| --- | --- | --- |
| Kontener ekranu | `screen` | Pełnoekranowy wrapper. |
| Tło | `bg` | Obraz tła z `backgroundFile`. |
| Overlay | `overlay` | Warstwa tekstowa pozycjonowana względem tła. |
| Przewijany overlay | `overlayScroll` | Wewnętrzny kontener tekstu. |
| Górny pas | `topBand` | Prefix i logo. |
| Prefix | `prefix` | Górne linie fillerów. |
| Logo | `logo` | Logo renderowane jako maska CSS. |
| Wiadomość | `msg` | Główna treść komunikatu. |
| Suffix | `suffix` | Dolne linie fillerów. |

## Ekran gracza — najważniejsze funkcje

| Funkcja | Rola |
| --- | --- |
| `autoCacheBust()` | Wymusza zgodny parametr `?v=<INF_VERSION>`. |
| `preloadKnownFonts()` | Preloaduje znane fonty, żeby ograniczyć przeskoki tekstu. |
| `clamp(...)` | Ogranicza wartości liczbowe. |
| `play(url)` | Odtwarza audio. Przeglądarka może wymagać wcześniejszego kliknięcia ekranu. |
| `getViewportSize()` | Pobiera rozmiar viewportu, także z `visualViewport`. |
| `updateOverlayMetrics(...)` | Ustawia zmienne CSS zależne od rozmiaru overlay. |
| `applyStyles(d)` | Stosuje font, kolory, rozmiary fontów, wysokość pasów i kolor logo z payloadu. |
| `applyLayout(d)` | Ustawia tło, logo, cień, flicker i dopasowanie overlay. |
| `applyMessage(d)` | Renderuje prefix, treść i suffix. |
| `clearMessage()` | Czyści prefix, wiadomość i suffix. |
| `fitOverlayToBackground()` | Pozycjonuje overlay na podstawie rozmiaru tła i `CONTENT_RECTS_BY_BACKGROUND_ID`. |
| `scheduleFitOverlay()` | Opóźnia i deduplikuje przeliczenia przy resize/orientationchange. |

## Prostokąty treści i techniczne ramki

`CONTENT_RECTS_BY_BACKGROUND_ID` przechowuje znormalizowane prostokąty tekstu dla poszczególnych teł.

Każdy wpis ma postać:

```js
id: { x: 0.10, y: 0.16, w: 0.80, h: 0.74 }
```

Wartości są względne względem widocznego tła po dopasowaniu go do ekranu.

Źródłem obliczeń są techniczne grafiki w `assets/ramki/`, które zawierają niebieską ramkę. Procedura obliczania jest opisana w `assets/data/NiebieskaRamka.md`, a mapowanie teł do ramek w `assets/data/Mapowanie.xlsx`.

Przy dodaniu nowego tła należy:

1. Dodać tło do `assets/backgrounds/`.
2. Dodać odpowiadającą techniczną ramkę do `assets/ramki/`.
3. Uzupełnić `assets/data/Mapowanie.xlsx`.
4. Wyliczyć prostokąt treści.
5. Dodać wpis do `CONTENT_RECTS_BY_BACKGROUND_ID` w ekranie gracza.
6. Upewnić się, że `backgroundId` w manifeście odpowiada wpisowi prostokąta.

## Audio

Moduł obsługuje dwa typy audio:

- audio wiadomości z `messageAudioFile`,
- audio ping z `PING_URL`.

Dla wiadomości audio odtwarza się tylko wtedy, gdy `type === 'message'` i `audioEnabled !== false`.

Dla ping ekran gracza odtwarza `PING_URL`.

Przeglądarki mogą blokować audio do czasu pierwszej interakcji użytkownika. Dlatego ekran gracza powinien zostać kliknięty raz przed rozpoczęciem testu albo sesji.

## Cache-busting i `INF_VERSION`

Panel GM i ekran gracza mają funkcję `autoCacheBust()`, która wymusza parametr `?v=<INF_VERSION>` w URL.

Aktualna wartość `INF_VERSION` w obecnych plikach wynosi:

```text
2026-05-28_14-50-22
```

Po zmianie kodu w plikach testowych należy zaktualizować `INF_VERSION` w obu plikach testowych do tej samej wartości. Format: `rrrr-MM-dd_HH-mm-ss` według lokalnego czasu w Polsce.

## Fallbacki i zachowanie awaryjne

| Sytuacja | Zachowanie |
| --- | --- |
| Brak `window.firebaseConfig` w panelu GM | Alert `Brak window.firebaseConfig` i przerwanie działania. |
| Brak `window.firebaseConfig` na ekranie gracza | Rzucany jest błąd `Missing firebase config`. |
| Brak tła w payloadzie | Ekran gracza używa fallbacku `assets/backgrounds/WnG.png`. |
| Brak logo lub `showLogo === false` | Logo jest ukryte, a top band przechodzi w tryb bez logo. |
| `fillersEnabled === false` | Prefix i suffix są puste. |
| Brak wybranego fontu | Używany jest fallback `Share Tech Mono` i bezpieczny font-stack. |
| Niepoprawna wartość liczbowa | `clamp(...)` ogranicza ją do dozwolonego zakresu. |
| Powtórzony snapshot z tym samym `nonce` | Ekran gracza ignoruje snapshot. |
| Audio zablokowane przez przeglądarkę | `play()` łapie błąd; użytkownik powinien kliknąć ekran. |

## Procedura odtworzenia modułu 1:1

1. Zachowaj strukturę katalogów `Infoczytnik/`.
2. Zachowaj pliki wejściowe: `index.html`, `GM.html`, `Infoczytnik.html`, `GM_test.html`, `Infoczytnik_test.html`.
3. Zachowaj `assets/data/data.json`.
4. Zachowaj `assets/data/DataSlate_manifest.xlsx`, `Mapowanie.xlsx` i `NiebieskaRamka.md`.
5. Zachowaj katalogi `assets/backgrounds/`, `assets/ramki/`, `assets/logos/`, `assets/audios/`.
6. Skonfiguruj `config/firebase-config.js` zgodnie z `config/FirebaseREADME.md`.
7. Utwórz Firestore `dataslate/current` zgodnie z `config/FirebaseREADME.md`.
8. Uruchom `index.html` i otwórz panel GM oraz ekran gracza.
9. Kliknij ekran gracza, żeby odblokować audio.
10. Wyślij wiadomość testową z panelu GM.
11. Sprawdź, czy ekran gracza renderuje tło, overlay, logo, prefix, treść i suffix.
12. Sprawdź `Ping`.
13. Sprawdź `Przywróć domyślne`.
14. Sprawdź zmianę tła, logo, fontu, koloru i audio.
15. Sprawdź import XLSX i wygenerowanie nowego `data.json`.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Test startowy | Otwórz `index.html`. | Widoczne są linki do wersji produkcyjnej i testowej. |
| Test Firestore | Otwórz GM i ekran gracza, wyślij wiadomość. | Wiadomość pojawia się na ekranie gracza. |
| Test ping | Kliknij ekran gracza, potem kliknij `Ping` w GM. | Odtwarza się dźwięk ping. |
| Test clear | Kliknij `Przywróć domyślne`. | Ekran gracza czyści wiadomość. |
| Test tła | Zmień tło i wyślij wiadomość. | Ekran gracza pokazuje nowe tło i dopasowany overlay. |
| Test logo | Włącz logo, zmień kolor, wyślij wiadomość. | Logo jest widoczne i ma wybrany kolor. |
| Test fillerów | Włącz i wyłącz fillery. | Prefix i suffix pojawiają się albo znikają. |
| Test audio wiadomości | Włącz audio i wyślij wiadomość. | Ekran gracza odtwarza audio wiadomości. |
| Test importu XLSX | Kliknij `Aktualizuj dane z XLSX`. | Pobierany jest nowy `data.json`, a log pokazuje wynik importu. |
| Test resize | Zmień rozmiar okna albo orientację urządzenia. | Overlay zostaje dopasowany do tła. |

---

# 🇬🇧 Technical documentation — Infoczytnik (EN)

## Module purpose

`Infoczytnik` is a two-screen module used to send stylized messages from the GM panel to the player display.

The module consists of:

- a GM panel where the game master selects the background, logo, font, fillers, colors, audio, and message text,
- a player display that listens to a Firestore document and renders the current message,
- a start page for choosing the production or test version,
- a data manifest describing available backgrounds, logos, fonts, audio, and fillers.

Communication between the GM panel and the player display uses Firebase Firestore document `dataslate/current`.

## Entry points

| File | Role |
| --- | --- |
| `Infoczytnik/index.html` | Module start page. Links to production and test versions. |
| `Infoczytnik/GM.html` | Production GM panel. |
| `Infoczytnik/Infoczytnik.html` | Production player display. |
| `Infoczytnik/GM_test.html` | Test GM panel. According to local `AGENTS.md`, code changes should be made here. |
| `Infoczytnik/Infoczytnik_test.html` | Test player display. According to local `AGENTS.md`, code changes should be made here. |

## Local `Infoczytnik/AGENTS.md` rules

Code changes must be made in the test files:

- `GM_test.html`,
- `Infoczytnik_test.html`.

The production and backup files must not be edited automatically:

- `GM.html`,
- `Infoczytnik.html`,
- `GM_backup.html`,
- `Infoczytnik_backup.html`.

The repository owner updates production and backup files manually.

After any code change in the test files, update `INF_VERSION` in both test files. The value must be identical in `GM_test.html` and `Infoczytnik_test.html` and must use the `yyyy-MM-dd_HH-mm-ss` format using local Polish time.

After code changes, run a two-screen test: open the GM panel, open the player display, send a test message, and verify rendering, layout, and audio.

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `index.html` | Menu for choosing production or test versions. |
| `GM.html` | Production GM panel. |
| `Infoczytnik.html` | Production player display. |
| `GM_test.html` | Test GM panel used for code changes. |
| `Infoczytnik_test.html` | Test player display used for code changes. |
| `config/firebase-config.js` | Client Firebase configuration defining `window.firebaseConfig`. |
| `config/FirebaseREADME.md` | Firebase and Firestore setup guide for the module. |
| `assets/data/data.json` | Current data manifest used by the GM panel. |
| `assets/data/DataSlate_manifest.xlsx` | Source spreadsheet used to generate `data.json`. |
| `assets/data/Mapowanie.xlsx` | Mapping between backgrounds and technical frame images. |
| `assets/data/NiebieskaRamka.md` | Method for calculating the text rectangle from the blue frame. |
| `assets/backgrounds/` | Background images displayed to players. |
| `assets/ramki/` | Technical blue-frame images used for text rectangle calculation. |
| `assets/logos/` | Logo images rendered as CSS masks. |
| `assets/audios/` | Message audio and ping audio files. |
| `docs/README.md` | User guide. |
| `docs/Documentation.md` | This technical documentation. |

## External dependencies

The module loads dependencies directly in HTML:

- Google Fonts — font families used by the panel and display,
- Firebase App Compat `9.6.8`,
- Firebase Firestore Compat `9.6.8`,
- SheetJS/XLSX `0.20.3` in the GM panel for reading `DataSlate_manifest.xlsx`.

The module has no separate application backend. The shared state between the GM and player display is stored in Firestore.

## Start page `index.html`

`index.html` is a simple selector page. It contains two sections:

- production versions: `GM.html`, `Infoczytnik.html`,
- test versions: `GM_test.html`, `Infoczytnik_test.html`.

The page also notes that the player display must be clicked once to unlock audio. This is a browser requirement because browsers block automatic audio playback before user interaction.

## GM panel — UI structure

The GM panel contains two main settings columns and action sections.

Key UI elements:

| Element | ID | Role |
| --- | --- | --- |
| Background selector | `backgroundSelect` | Selects a background from the manifest. |
| Logo selector | `logoSelect` | Selects a logo from the manifest. |
| Logo color | `logoColorText`, `logoColorPicker`, `logoColorChips` | Allows typed, picked, or preset logo color. |
| Filler set | `fillerSelect` | Selects a prefix/suffix filler set. |
| Font | `fontSelect` | Selects a font family. |
| Message audio | `audioSelect` | Selects audio played with a message. |
| Logo toggle | `showLogo` | Shows or hides the logo. |
| Shadow rectangle | `movingOverlay` | Enables or disables the text shadow rectangle. |
| Flicker | `flicker` | Enables overlay flicker. Works only when the shadow rectangle is enabled. |
| Fillers | `fillersEnabled` | Enables or disables prefix and suffix. |
| Audio | `audioEnabled` | Enables or disables message audio. |
| Filler line count | `fillerLineCount` | Number of randomized prefix/suffix lines, range 1-5. |
| Prefix/suffix band height | `fillerBandLines` | Prefix/suffix band height, range 1-6. |
| Message color | `messageColorText`, `messageColorPicker` | Main message text color. |
| Message font size | `msgFontSize` | Base message font size, range 12-80. |
| Prefix/suffix color | `psColorText`, `psColorPicker` | Shared prefix/suffix color. |
| Prefix/suffix font size | `psFontSize` | Base prefix/suffix font size, range 10-60. |
| Preview mode | `previewModeContent`, `previewModeBackground` | Switches the preview between content and background. |
| Message text | `message` | Message text sent for `type: message`. |
| Send | `sendBtn` | Writes a `message` payload to Firestore. |
| Ping | `pingBtn` | Writes a `ping` payload to Firestore. |
| Clear message | `clearMessageBtn` | Clears the local GM text area. It does not send `clear` to Firestore. |
| Restore defaults | `restoreDefaultsBtn` | Restores defaults and sends `clear` to Firestore. |
| Reroll fillers | `rerollFillersBtn` | Randomizes new prefix/suffix lines from the selected set. |
| Update data from XLSX | `updateDataBtn` | Reads `DataSlate_manifest.xlsx`, builds the manifest, and downloads a new `data.json`. |
| Import log | `importLog` | Shows import errors and warnings. |
| Status | `status` | Shows the current operation status. |

## GM panel — application state

Key constants and variables:

| Name | Role |
| --- | --- |
| `DEFAULT_FORM_STATE` | Default GM form state. Contains background, logo, filler, font, audio IDs, colors, font sizes, and toggles. |
| `FONT_FALLBACK` | Final font stack used when the selected font is unavailable. |
| `PING_URL` | Ping audio path with a version parameter. |
| `PREVIEW_MODE_KEY` | `localStorage` key storing the GM preview mode. |
| `currentRef` | Firestore reference to `dataslate/current`. |
| `el` | DOM reference map. |
| `manifest` | Manifest loaded from `assets/data/data.json` or built from XLSX. |
| `fillerState` | Currently randomized `prefixLines` and `suffixLines`. |

## GM panel — key functions

| Function | Role |
| --- | --- |
| `autoCacheBust()` | Enforces the `?v=<INF_VERSION>` URL parameter. |
| `setStatus(text)` | Sets the status text. |
| `clamp(value, min, max, default)` | Clamps numeric values to an allowed range. |
| `safeGet(list, id)` | Gets an item by ID or returns the first item. |
| `nonce()` | Creates a unique action identifier. |
| `normalizeHexColor(...)` | Normalizes a HEX color and applies fallback. |
| `resolveHexColor(...)` | Chooses a valid color from text input or color picker. |
| `fillSelect(...)` | Fills select lists with manifest data. |
| `writeImportLog(...)` | Writes import results to the log field. |
| `buildManifestFromWorkbook(...)` | Builds the manifest from the XLSX workbook. |
| `updateDataFromXlsx()` | Fetches XLSX, builds the manifest, and downloads `data.json`. |
| `loadManifest()` | Loads `assets/data/data.json` and fills select lists. |
| `rerollFillers()` | Randomizes new prefix and suffix lines. |
| `syncFlickerDependency()` | Disables flicker when the shadow rectangle is disabled. |
| `getPreviewMode()` | Returns the current preview mode. |
| `setPreviewMode(mode)` | Sets preview mode and stores it in `localStorage`. |
| `loadSavedPreviewMode()` | Loads the saved preview mode. |
| `preloadManifestFonts()` | Preloads fonts from the manifest. |
| `applySelectedFontToPreview()` | Applies the selected font to the preview. |
| `updateLogoColorPanelState()` | Dims or enables the logo color panel depending on `showLogo`. |
| `renderPreview()` | Renders local preview: text, colors, logo, fonts, and fillers. |
| `getPayload(type)` | Serializes current panel state into a Firestore payload. |
| `send(type)` | Writes the full payload to `dataslate/current` with `merge:false`. |
| `ping()` | Writes a full `ping` payload. |
| `restoreDefaults(sendReset)` | Restores defaults and optionally sends `clear`. |

## XLSX import to JSON manifest

The import source is:

```text
assets/data/DataSlate_manifest.xlsx
```

The GM panel uses SheetJS to read the spreadsheet and generate a manifest compatible with `assets/data/data.json`.

Expected sheets:

| Sheet | Role |
| --- | --- |
| `backgrounds` | Background list. |
| `logos` | Logo list. |
| `audios` | Message audio list. |
| `fonts` | Font list. |
| `fillers` | Prefix and suffix filler sets. |

The import accepts column aliases. For example, a name can be read from `name` or `nazwa`, and a file path from `file`, `plik`, or `url`.

Fillers are split by new lines and the pipe character `|`. Semicolons remain part of the filler text because ready-made litanies may use semicolons inside a single phrase.

The `Aktualizuj dane z XLSX` button does not write to the repository automatically. It generates and downloads a new `data.json`. To change the manifest used by the module, place the downloaded file in `Infoczytnik/assets/data/data.json`.

## Manifest `assets/data/data.json`

The manifest contains these main arrays:

| Field | Type | Role |
| --- | --- | --- |
| `backgrounds` | `array` | Backgrounds available in the GM panel. |
| `logos` | `array` | Logos available in the GM panel. |
| `audios` | `array` | Message audio files. |
| `fonts` | `array` | Fonts available in the GM panel. |
| `fillers` | `array` | Prefix and suffix filler sets. |
| `importLog` | `array` | Import errors or warnings. |

Example manifest records:

```json
{
  "backgrounds": [
    { "id": 10, "name": "WnG", "file": "assets/backgrounds/WnG.png" }
  ],
  "logos": [
    { "id": 3, "name": "Aquila", "file": "assets/logos/Aquila.png" }
  ],
  "audios": [
    { "id": 1, "name": "Keyboard Typing", "file": "assets/audios/KeyboardTyping.mp3" }
  ],
  "fonts": [
    { "id": 1, "name": "Adeptus Mechanicus", "font": "Share Tech Mono" }
  ],
  "fillers": [
    {
      "id": 1,
      "name": "Adeptus Mechanicus",
      "prefixes": ["+++ INCOMING DATA FEED +++"],
      "suffixes": ["+++ PRAISE THE OMNISSIAH +++"]
    }
  ]
}
```

## Firestore payload `dataslate/current`

The GM panel writes the full snapshot to Firestore:

```js
currentRef.set(getPayload(type), { merge: false })
```

`merge:false` is intentional. The `dataslate/current` document is the full source of truth for the player display, not a set of partial updates.

Data model:

| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `message`, `ping`, or `clear`. |
| `text` | `string` | Message text for `message`; empty string for `ping` and `clear`. |
| `backgroundId` | `number|null` | Background ID. |
| `backgroundFile` | `string` | Background file path. |
| `logoId` | `number|null` | Logo ID. |
| `logoFile` | `string` | Logo file path. |
| `fillerId` | `number|null` | Filler set ID. |
| `fillerSet` | `string` | Filler set name. |
| `fontId` | `number|null` | Font ID. |
| `fontPreset` | `string` | CSS font family name. |
| `messageAudioId` | `number|null` | Message audio ID. |
| `messageAudioFile` | `string` | Message audio file path. |
| `fillersEnabled` | `boolean` | Whether prefix and suffix are enabled. |
| `audioEnabled` | `boolean` | Whether message audio is enabled. |
| `showLogo` | `boolean` | Whether the logo is visible. |
| `movingOverlay` | `boolean` | Whether overlay shadow is enabled. |
| `flicker` | `boolean` | Whether overlay flicker is enabled. |
| `prefixLines` | `array<string>` | Prefix lines. |
| `suffixLines` | `array<string>` | Suffix lines. |
| `fillerLineCount` | `number` | Filler line count, range 1-5. |
| `fillerBandLines` | `number` | Prefix/suffix band height, range 1-6. |
| `messageColor` | `string` | Main message color. |
| `logoColor` | `string` | Logo color. |
| `prefixColor` | `string` | Prefix color. |
| `suffixColor` | `string` | Suffix color. |
| `msgFontSize` | `number` | Message font size, range 12-80. |
| `prefixFontSize` | `number` | Prefix font size, range 10-60. |
| `suffixFontSize` | `number` | Suffix font size, range 10-60. |
| `pingUrl` | `string` | Ping audio path. |
| `nonce` | `string` | Unique action identifier. |
| `ts` | `timestamp` | Firestore server timestamp. |

## Action types

| `type` | GM panel behavior | Player display behavior |
| --- | --- | --- |
| `message` | Writes a full payload with the text area content. | Applies layout, styles, and message text. Plays `messageAudioFile` if `audioEnabled !== false`. |
| `ping` | Writes a full ping payload. | Applies layout and styles, plays `PING_URL`, and does not change message text. |
| `clear` | Sent by `restoreDefaults(true)`. | Applies layout and styles, clears prefix, message, and suffix. |

## Firebase integration

The module uses Firebase compatibility builds:

```html
<script src="config/firebase-config.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
```

`config/firebase-config.js` must define global `window.firebaseConfig`. It must not use `export`.

The GM panel initializes:

```js
firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();
const currentRef = db.collection('dataslate').doc('current');
```

The player display initializes similarly and listens with:

```js
const ref = db.collection('dataslate').doc('current');
ref.onSnapshot((snap) => { ... });
```

Full Firebase setup, Firestore initialization script, rules, and connection tests are documented in `Infoczytnik/config/FirebaseREADME.md`.

## Player display — render structure

The player display renders a fullscreen view:

| Element | ID | Role |
| --- | --- | --- |
| Screen container | `screen` | Fullscreen wrapper. |
| Background | `bg` | Background image from `backgroundFile`. |
| Overlay | `overlay` | Text layer positioned against the background. |
| Scrollable overlay | `overlayScroll` | Inner text container. |
| Top band | `topBand` | Prefix and logo. |
| Prefix | `prefix` | Upper filler lines. |
| Logo | `logo` | Logo rendered as a CSS mask. |
| Message | `msg` | Main message text. |
| Suffix | `suffix` | Lower filler lines. |

## Player display — key functions

| Function | Role |
| --- | --- |
| `autoCacheBust()` | Enforces the `?v=<INF_VERSION>` URL parameter. |
| `preloadKnownFonts()` | Preloads known fonts to reduce text jumps. |
| `clamp(...)` | Clamps numeric values. |
| `play(url)` | Plays audio. Browser interaction may be required first. |
| `getViewportSize()` | Reads viewport size, including `visualViewport`. |
| `updateOverlayMetrics(...)` | Sets CSS variables derived from overlay size. |
| `applyStyles(d)` | Applies font, colors, font sizes, band height, and logo color from the payload. |
| `applyLayout(d)` | Applies background, logo, shadow, flicker, and overlay fitting. |
| `applyMessage(d)` | Renders prefix, message text, and suffix. |
| `clearMessage()` | Clears prefix, message, and suffix. |
| `fitOverlayToBackground()` | Positions overlay using background size and `CONTENT_RECTS_BY_BACKGROUND_ID`. |
| `scheduleFitOverlay()` | Debounces resize and orientation recalculation. |

## Content rectangles and technical frames

`CONTENT_RECTS_BY_BACKGROUND_ID` stores normalized text rectangles for backgrounds.

Each entry has this shape:

```js
id: { x: 0.10, y: 0.16, w: 0.80, h: 0.74 }
```

The values are relative to the visible background after it is fitted to the screen.

The source for these calculations is the technical image set in `assets/ramki/`, which contains blue frames. The calculation method is documented in `assets/data/NiebieskaRamka.md`, and background-to-frame mapping is stored in `assets/data/Mapowanie.xlsx`.

When adding a new background:

1. Add the background to `assets/backgrounds/`.
2. Add the matching technical frame to `assets/ramki/`.
3. Update `assets/data/Mapowanie.xlsx`.
4. Calculate the content rectangle.
5. Add the entry to `CONTENT_RECTS_BY_BACKGROUND_ID` in the player display.
6. Ensure that the manifest `backgroundId` matches the rectangle entry.

## Audio

The module supports two audio types:

- message audio from `messageAudioFile`,
- ping audio from `PING_URL`.

Message audio plays only when `type === 'message'` and `audioEnabled !== false`.

Ping plays `PING_URL`.

Browsers may block audio until the first user interaction. The player display should be clicked once before a test or session begins.

## Cache-busting and `INF_VERSION`

The GM panel and player display both use `autoCacheBust()`, which enforces the `?v=<INF_VERSION>` URL parameter.

The current value of `INF_VERSION` in the current files is:

```text
2026-05-28_14-50-22
```

After a code change in test files, update `INF_VERSION` in both test files to the same value. Format: `yyyy-MM-dd_HH-mm-ss` using local Polish time.

## Fallbacks and failure behavior

| Situation | Behavior |
| --- | --- |
| Missing `window.firebaseConfig` in GM panel | Alert `Brak window.firebaseConfig` and execution stops. |
| Missing `window.firebaseConfig` in player display | Throws `Missing firebase config`. |
| Missing background in payload | Player display falls back to `assets/backgrounds/WnG.png`. |
| Missing logo or `showLogo === false` | Logo is hidden and the top band switches to no-logo mode. |
| `fillersEnabled === false` | Prefix and suffix are empty. |
| Missing selected font | Falls back to `Share Tech Mono` and the safe font stack. |
| Invalid numeric value | `clamp(...)` restricts it to the allowed range. |
| Repeated snapshot with the same `nonce` | Player display ignores the snapshot. |
| Audio blocked by browser | `play()` catches the error; the user should click the screen. |

## Module recreation procedure

1. Preserve the `Infoczytnik/` directory structure.
2. Preserve entry files: `index.html`, `GM.html`, `Infoczytnik.html`, `GM_test.html`, `Infoczytnik_test.html`.
3. Preserve `assets/data/data.json`.
4. Preserve `assets/data/DataSlate_manifest.xlsx`, `Mapowanie.xlsx`, and `NiebieskaRamka.md`.
5. Preserve `assets/backgrounds/`, `assets/ramki/`, `assets/logos/`, and `assets/audios/`.
6. Configure `config/firebase-config.js` according to `config/FirebaseREADME.md`.
7. Create Firestore `dataslate/current` according to `config/FirebaseREADME.md`.
8. Open `index.html` and then open the GM panel and player display.
9. Click the player display to unlock audio.
10. Send a test message from the GM panel.
11. Verify that the player display renders background, overlay, logo, prefix, message, and suffix.
12. Test `Ping`.
13. Test `Przywróć domyślne`.
14. Test background, logo, font, color, and audio changes.
15. Test XLSX import and generating a new `data.json`.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Start test | Open `index.html`. | Links to production and test versions are visible. |
| Firestore test | Open GM and player display, send a message. | The message appears on the player display. |
| Ping test | Click the player display, then click `Ping` in GM. | The ping sound plays. |
| Clear test | Click `Przywróć domyślne`. | The player display clears the message. |
| Background test | Change background and send a message. | The player display shows the new background and fitted overlay. |
| Logo test | Enable logo, change color, send a message. | The logo is visible and uses the selected color. |
| Filler test | Enable and disable fillers. | Prefix and suffix appear or disappear. |
| Message audio test | Enable audio and send a message. | The player display plays message audio. |
| XLSX import test | Click `Aktualizuj dane z XLSX`. | A new `data.json` is downloaded and the import log shows the result. |
| Resize test | Resize the window or change device orientation. | Overlay remains fitted to the background. |

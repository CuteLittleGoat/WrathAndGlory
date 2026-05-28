# Infoczytnik — dokumentacja techniczna (odtworzenie 1:1)

## 1. Zakres modułu
Moduł Infoczytnik składa się z dwóch ekranów roboczych:
- `GM_test.html` — panel przygotowania i publikacji komunikatów.
- `Infoczytnik_test.html` — ekran odczytu komunikatów dla graczy.

Pliki produkcyjne (`GM.html`, `Infoczytnik.html`) są utrzymywane osobno i nie są edytowane automatycznie. Funkcjonalnie punktem rozwoju są pliki `_test`.

## 2. Struktura katalogów i odpowiedzialność plików
- `index.html` — menu modułu.
- `GM_test.html` — logika GM: edycja treści, import danych, podgląd tła, publikacja.
- `Infoczytnik_test.html` — ekran odczytu publikowanych treści.
- `assets/data/data.json` — lokalny snapshot treści (źródło dla importów/odczytu lokalnego).
- `assets/data/DataSlate_manifest.xlsx` — arkusz źródłowy dla importu treści i układów.
- `assets/backgrounds/*` — tła ekranów (DataSlate, Pergamin, WnG, Notatnik, Litannie itp.).
- `assets/ramki/*` — ramki odpowiadające tłom.
- `assets/logos/*` — logotypy warstw UI.
- `config/firebase-config.js` — konfiguracja klienta Firebase.

## 3. Renderowanie UI i warstwa stylów
### 3.1. Fonty i typografia
- Moduł obsługuje wybór fontu z panelu GM oraz przekazanie fontu w payloadzie danych.
- Fonty są preloadowane dla stabilnego pierwszego renderu i mniejszego „skakania” tekstu.
- Dla środowisk bez załadowania wybranego fontu działa fallback do bezpiecznego font-stacku.

### 3.2. Motyw i tła
- Ekran gracza renderuje tekst na wybranym tle (`backgroundKey`) + dedykowanej ramce (`frameKey`).
- Obsługiwane są tryby podglądu tła: wycinek i całość (zależnie od wybranej opcji GM).
- Wdrożono dodatkowe pole robocze dla tła **Pergamin** (warianty kompozycji tekstu na tym tle).

### 3.3. Podgląd „Treść / Tło”
- Panel GM ma równoległy podgląd:
  - samej treści,
  - treści osadzonej na tle.
- Dzięki temu operator przed publikacją kontroluje czytelność, kontrast i finalny układ.

## 4. Model danych (payload komunikatu)

Panel `GM_test.html` zapisuje do Firestore pełny snapshot bieżącego komunikatu. Zapis jest wykonywany przez `currentRef.set(getPayload(type), { merge: false })`.

Aktualny payload zawiera następujące pola:

```text
type: string
text: string
backgroundId: string albo null
backgroundFile: string
logoId: string albo null
logoFile: string
fillerId: string albo null
fillerSet: string
fontId: string albo null
fontPreset: string
messageAudioId: string albo null
messageAudioFile: string
fillersEnabled: boolean
audioEnabled: boolean
showLogo: boolean
movingOverlay: boolean
flicker: boolean
prefixLines: tablica stringów
suffixLines: tablica stringów
fillerLineCount: number
fillerBandLines: number
messageColor: string HEX
prefixColor: string HEX
suffixColor: string HEX
msgFontSize: number
prefixFontSize: number
suffixFontSize: number
pingUrl: string
nonce: string
ts: Firestore serverTimestamp
```

Dla `type: "message"` pole `text` zawiera treść wiadomości wpisaną przez GM. Dla `type: "ping"` i `type: "clear"` pole `text` jest pustym stringiem.


## 5. Integracja Firebase
### 5.1. Warstwa klienta
- Konfiguracja znajduje się w `config/firebase-config.js`.
- Ekran GM publikuje payload do dokumentu bieżącego komunikatu.
- Ekran Infoczytnika nasłuchuje zmian i renderuje aktualny snapshot.

### 5.2. Model dokumentu
- Dokument roboczy: `dataslate/current`.
- Zapis powinien być pełnym snapshotem stanu wiadomości (single source of truth).

### 5.3. Uwaga implementacyjna (krytyczna)
**Uwaga implementacyjna:** dokument jest zapisywany jako pełny snapshot stanu wiadomości (bez merge), aby zawsze nadpisywać kompletny payload publikacji.

Ta zasada jest obowiązkowa przy odtwarzaniu modułu 1:1.

## 6. Import danych XLSX → JSON
### 6.1. Wejście
- Plik źródłowy: `assets/data/DataSlate_manifest.xlsx`.
- Import uruchamiany z panelu GM (przycisk aktualizacji danych z XLSX).

### 6.2. Przetwarzanie
- Dane z arkusza są mapowane do pól używanych przez payload UI.
- Obsługiwane jest autoformatowanie tokenu `+++` podczas importu do JSON.
- Wynik importu generuje plik JSON do pobrania. Po wygenerowaniu należy umieścić pobrany `data.json` w `Infoczytnik/assets/data/data.json`, jeżeli ma zastąpić lokalny snapshot używany przez moduł.

### 6.3. Oczekiwany efekt
- Po imporcie nowa struktura jest od razu dostępna do podglądu i publikacji.
- Zmiany w treści, tle, logo i stylu tekstu mają być widoczne bez ręcznej edycji JSON.

## 7. Logika GM (`GM_test.html`)
Kluczowe grupy funkcji:
1. Inicjalizacja UI i domyślnych ustawień panelu.
2. Obsługa wyboru fontu, tła, ramki i logo.
3. Podgląd treści i podgląd tła (w tym tryb wycinek/całość).
4. Import `DataSlate_manifest.xlsx` i odświeżanie danych roboczych.
5. Publikacja payloadu do `dataslate/current`.
6. Obsługa błędów (walidacja, brak danych, problemy sieciowe).

## 8. Logika ekranu gracza (`Infoczytnik_test.html`)
Kluczowe grupy funkcji:
1. Odbiór i render aktualnego snapshotu danych.
2. Budowa warstwy wizualnej (tło + ramka + logo + tekst).
3. Stosowanie fontu otrzymanego z payloadu.
4. Bezpieczne fallbacki przy brakujących zasobach.
5. Utrzymanie czytelności i responsywności w różnych proporcjach ekranu.

## 9. Struktura Firestore do odtworzenia

Minimalna struktura Firestore używana przez moduł:

```text
dataslate (kolekcja)
└── current (dokument)
    ├── type
    ├── text
    ├── backgroundId
    ├── backgroundFile
    ├── logoId
    ├── logoFile
    ├── fillerId
    ├── fillerSet
    ├── fontId
    ├── fontPreset
    ├── messageAudioId
    ├── messageAudioFile
    ├── fillersEnabled
    ├── audioEnabled
    ├── showLogo
    ├── movingOverlay
    ├── flicker
    ├── prefixLines
    ├── suffixLines
    ├── fillerLineCount
    ├── fillerBandLines
    ├── messageColor
    ├── prefixColor
    ├── suffixColor
    ├── msgFontSize
    ├── prefixFontSize
    ├── suffixFontSize
    ├── pingUrl
    ├── nonce
    └── ts
```


## 10. Skrypt Node.js do bootstrapu dokumentu `dataslate/current`
Poniższy przykład pokazuje minimalny bootstrap dokumentu `dataslate/current` zgodny z aktualnym modelem payloadu modułu Infoczytnik.

Przykład służy wyłącznie do przygotowania struktury dokumentu w Firestore. Panel GM zapisuje później pełny snapshot przez `currentRef.set(getPayload(type), { merge: false })`.

```js
// node scripts/bootstrap-dataslate.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

await db.doc('dataslate/current').set({
  type: 'clear',
  text: '',
  backgroundId: null,
  backgroundFile: '',
  logoId: null,
  logoFile: '',
  fillerId: null,
  fillerSet: '',
  fontId: null,
  fontPreset: '',
  messageAudioId: null,
  messageAudioFile: '',
  fillersEnabled: true,
  audioEnabled: true,
  showLogo: true,
  movingOverlay: true,
  flicker: true,
  prefixLines: [],
  suffixLines: [],
  fillerLineCount: 3,
  fillerBandLines: 2,
  messageColor: '#00ff66',
  prefixColor: '#ffffff',
  suffixColor: '#ffffff',
  msgFontSize: 20,
  prefixFontSize: 12,
  suffixFontSize: 12,
  pingUrl: '',
  nonce: '',
  ts: FieldValue.serverTimestamp(),
});

console.log('Bootstrap complete');
```

## 11. Testy kontrolne po wdrożeniu
1. Otwórz `GM_test.html` i opublikuj testowy komunikat.
2. Otwórz `Infoczytnik_test.html` i sprawdź natychmiastowy render.
3. Zmień font i tło — potwierdź poprawne odświeżenie.
4. Wykonaj import XLSX i sprawdź poprawność mapowania.
5. Zweryfikuj tryb podglądu oraz poprawność renderu po zmianach ustawień.

## 12. Ograniczenia i zasady utrzymania
- Nie edytować automatycznie: `GM.html`, `Infoczytnik.html`, `GM_backup.html`, `Infoczytnik_backup.html`.
- Zmiany funkcjonalne wykonywać w plikach `_test`.
- Po każdej zmianie kodu aktualizować `docs/README.md` i `docs/Documentation.md`.
- Przy zmianach `GM_test.html`/`Infoczytnik_test.html` podnosić `INF_VERSION` w formacie czasu lokalnego PL.

## 13. Szczegółowa mapa funkcji (`GM_test.html`)
Poniżej lista funkcji wymaganych do odtworzenia zachowania 1:1:

### 14.1. Wersjonowanie i status UI
- `autoCacheBust()` — wymusza parametr `?v=<INF_VERSION>` w URL, aby uniknąć cache po deployu.
- `setStatus(...)` — centralny renderer komunikatów statusu (sukces/błąd/info) w panelu GM.

### 14.2. Walidacja i narzędzia pomocnicze
- `clamp(value, min, max)` — ograniczenie zakresu numerycznego.
- `safeGet(obj, path, fallback)` — bezpieczne pobieranie zagnieżdżonych pól.
- `toInt`, `toStr`, `toStringArray` — normalizacja typów rekordów importu.
- `toStringArray` rozdziela wartości fillerów po separatorach: `\n` oraz `|`, a następnie trimuje i odrzuca puste elementy. Średnik jest pozostawiany w treści pojedynczego fillera, aby nie rozbijać gotowych litanii na sztuczne fragmenty.
- `normalizeHexColor`, `isFullHexColor`, `resolveHexColor` — sanityzacja kolorów z manifestu.

### 14.3. Fonty, selecty i etykiety
- `getSelectedFont()` — zwraca aktywnie wybrany font do payloadu.
- `buildOptionLabel(...)` — buduje czytelny label opcji wyboru.
- `fillSelect(...)` — zasilenie `<select>` danymi manifestu.
- `preloadManifestFonts(...)` — preload fontów wykrytych w danych.
- `applySelectedFontToPreview(...)` — natychmiastowe zastosowanie fontu do podglądu.

### 14.4. Import XLSX i transformacja danych
- `normalizeHeader`, `normalizeRecordKeys` — unifikacja nazw kolumn.
- `pickValue(...)` — fallbackowe mapowanie wartości między aliasami kolumn.
- `parseSheetRows(...)` — parsowanie pojedynczego arkusza do rekordów domenowych.
- `buildManifestFromWorkbook(...)` — składanie finalnego manifestu z wielu arkuszy.
- `updateDataFromXlsx(...)` — pełen pipeline importu i odświeżenia danych.
- `writeImportLog(...)` — raport importu (błędy, pominięcia, ostrzeżenia).
- `downloadJson(...)` — eksport wygenerowanego JSON do pliku.

### 14.5. Podgląd i render
- `getPreviewMode`, `setPreviewMode`, `loadSavedPreviewMode` — zarządzanie trybem podglądu.
- `syncFlickerDependency(...)` — synchronizacja zależności opcji migotania/efektu.
- `renderPreview(...)` — render warstwy treści + dekoracji.
- `draw(...)` — finalny etap rysowania widoku.
- `mapBasic(...)` — mapowanie ustawień panelu do modelu renderowania.

### 14.6. Payload i publikacja
- `getPayload()` — serializacja bieżącego stanu panelu do modelu Firestore.
- `send()` — zapis snapshotu wiadomości do `dataslate/current`.
- `ping()` — szybki test łączności warstwy publikacji; zapisuje pełny snapshot `getPayload('ping')` bez pól `undefined`, bo Firestore odrzuca `undefined` (błąd `Function DocumentReference.set() called with invalid data`).
- `restoreDefaults()` — przywrócenie ustawień domyślnych panelu.
- `rerollFillers()` i `pick()` — odświeżanie oraz wybór elementów dynamicznych (`fillers`).

## 14. Szczegółowa mapa funkcji (`Infoczytnik_test.html`)
- `autoCacheBust()` — ten sam mechanizm wersjonowania URL co po stronie GM.
- `preloadKnownFonts()` — preload typowych rodzin fontów dla szybszego first paint.
- `clamp()` — pomocnicze ograniczenia numeryczne.
- `play()` — bootstrap renderera po otrzymaniu danych.
- `getViewportSize()` — metryki viewportu używane do skalowania overlay.
- `updateOverlayMetrics()` — przeliczenie geometrii warstw tekstowych.
- `applyStyles(payload)` — zastosowanie stylów (font, kolor, spacing) z payloadu.
- `applyLayout(payload)` — zastosowanie pozycji i rozmiarów kontenerów.
- `applyMessage(payload)` — render treści komunikatu.
- `clearMessage()` — bezpieczne czyszczenie widoku przy błędzie/braku danych.
- `fitOverlayToBackground()` — dopasowanie skali overlay do tła.
- `scheduleFitOverlay()` — debouncing/odroczenie dopasowania przy zmianie rozmiaru.

## 15. Specyfikacja wersjonowania testowego (`INF_VERSION`)
- Pole `INF_VERSION` występuje równolegle w `GM_test.html` i `Infoczytnik_test.html`.
- Format obowiązkowy: `rrrr-MM-dd_gg-hh-ss` (czas lokalny Polski).
- Każda zmiana kodu w którymkolwiek z plików testowych wymaga podniesienia tej wartości w obu plikach.
- Funkcja `autoCacheBust()` wymusza spójność `?v=INF_VERSION`, co gwarantuje odświeżenie zasobów na kliencie.
- Aktualna wersja testowa: `2026-04-30_12-00-51`.

## 16. Macierz kompletności technicznej
- **Style, kolory, fonty i warstwy:** sekcje 3, 14.3, 15.
- **Funkcje i mechaniki UI:** sekcje 7, 8, 14, 15.
- **Model danych i logika publikacji:** sekcje 4, 5, 14.6.
- **Firebase/Firestore:** sekcje 5, 10 (dokument `dataslate/current`).
- **Wersjonowanie i cache-busting:** sekcja 18.

## 17. Wymagalność Firebase w instrukcji użytkownika
Instrukcja użytkownika (`docs/README.md`) powinna jednoznacznie wskazywać, że moduł Infoczytnik wymaga integracji z Firebase/Firestore do komunikacji GM↔gracze.

Procedura użytkowa powinna obejmować:
- utworzenie projektu Firebase,
- rejestrację aplikacji web,
- konfigurację `config/firebase-config.js`,
- utworzenie Firestore Database,
- ustawienie reguł,
- test dwuekranowy GM↔Infoczytnik.

## 18. Wdrożenia dla wielu grup
Każda grupa wymaga osobnego projektu Firebase, aby dokument `dataslate/current` nie był współdzielony między niezależnymi instancjami.

W plikach `GM_test.html` i `Infoczytnik_test.html` komentarze `WAŻNE/IMPORTANT` oznaczają istotne miejsca wdrożeniowe:
- `INF_VERSION` jako cache-busting testowej wersji,
- `config/firebase-config.js`,
- walidację `window.firebaseConfig`.

Po każdej zmianie testowych plików wartość `INF_VERSION` powinna być taka sama w `GM_test.html` i `Infoczytnik_test.html`.

## 19. Linki względne
Moduł używa ścieżek względnych do nawigacji i ładowania zasobów. Dzięki temu kopia modułu może działać po przeniesieniu na inny serwer lub do innej instancji wdrożeniowej, o ile zachowana jest struktura katalogów.

Przy wdrożeniu dla osobnej grupy należy sprawdzić:
- ścieżkę do `config/firebase-config.js`,
- ścieżki do assetów,
- ścieżki używane przez panel GM i ekran Infoczytnika,
- zgodność konfiguracji Firebase z docelowym projektem.

## 14. Rozszerzenie testowe: panel koloru logo
- W `GM_test.html` dodano panel `logoColorPanel` pod wyborem logo i nad `Zestaw fillerów`.
- Domyślna wartość `DEFAULT_FORM_STATE.logoColor` to `#d4af37`.
- Payload publikowany do Firestore rozszerzono o pole `logoColor` (HEX), aby ekran odbiorcy renderował identyczny kolor co panel GM.
- W `renderPreview()` logo podglądu jest kolorowane przez CSS mask (`mask-image`/`-webkit-mask-image`) i zmienną koloru, dzięki czemu podgląd reaguje natychmiast.
- Gdy `showLogo=false`, funkcja `updateLogoColorPanelState()` wyszarza panel i blokuje interakcję (`opacity` + `pointer-events`).
- Zdarzenia `.chip[data-target]` rozdzielają trzy cele (`msg`, `logo`, `ps`), aby presety koloru logo nie nadpisywały koloru prefix/suffix.
- `updateLogoColorPanelState()` jest wywoływana wewnątrz `renderPreview()`, dzięki czemu stan aktywności panelu koloru logo jest zawsze zsynchronizowany z checkboxem `showLogo`.
- W `Infoczytnik_test.html` logo odbiorcy również renderowane jest jako maska PNG z jednolitym kolorem (`--logoColor`), pobieranym z payloadu (`d.logoColor`).


- Kolor logo w szybkich presetach obejmuje teraz wariant **Czarny (#000000)** zamiast czerwonego, a logo renderowane jest na elementach dekoracyjnych bez fallbacku tekstowego IMG, co eliminuje artefakty podczas zoomu.

## 15. DataSlate manifest snapshot (current)

- `assets/data/data.json` was refreshed to match the current logo asset set in `assets/logos/`.
- The `logos` array now contains 14 entries and points to PNG files from `assets/logos/`.
- In `GM_test.html`, `DEFAULT_FORM_STATE.logoId` is set to `3`, which selects `Aquila` (`assets/logos/Aquila.png`) as the default logo.
- `INF_VERSION` was synchronized in `GM_test.html` and `Infoczytnik_test.html` to keep cache-busting consistent for both test entry points.

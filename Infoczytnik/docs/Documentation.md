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
Minimalny payload wysyłany do Firestore/odczytu powinien zawierać:
- `title` — nagłówek komunikatu,
- `content` — treść główna,
- `backgroundKey` — identyfikator tła,
- `frameKey` — identyfikator ramki,
- `logoKey` — identyfikator logo,
- `fontFamily` — font wybrany przez GM,
- `updatedAt` — znacznik czasu publikacji,
- `version` / `INF_VERSION` — wersja interfejsu testowego.

Dodatkowe pola (opcjonalne):
- flagi trybu podglądu,
- metadane importu arkusza,
- ustawienia dodatkowego formatowania.

## 5. Integracja Firebase
### 5.1. Warstwa klienta
- Konfiguracja znajduje się w `config/firebase-config.js`.
- Ekran GM publikuje payload do dokumentu bieżącego komunikatu.
- Ekran Infoczytnika nasłuchuje zmian i renderuje aktualny snapshot.

### 5.2. Model dokumentu
- Dokument roboczy: `dataslate/current`.
- Zapis powinien być pełnym snapshotem stanu wiadomości (single source of truth).

### 5.3. Uwaga implementacyjna (krytyczna)
**Uwaga implementacyjna: dokument jest zapisywany jako pełny snapshot ustawień (bez merge), aby operacje usuwania aliasów poprawnie kasowały klucze w mapie `aliases`.**

Ta zasada jest obowiązkowa przy odtwarzaniu modułu 1:1.

## 6. Import danych XLSX → JSON
### 6.1. Wejście
- Plik źródłowy: `assets/data/DataSlate_manifest.xlsx`.
- Import uruchamiany z panelu GM (przycisk aktualizacji danych z XLSX).

### 6.2. Przetwarzanie
- Dane z arkusza są mapowane do pól używanych przez payload UI.
- Obsługiwane jest autoformatowanie tokenu `+++` podczas importu do JSON.
- Wynik importu **zawsze** generuje aktualny `assets/data/data.json` na podstawie zawartości `DataSlate_manifest.xlsx` dla lokalnego odczytu.

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

## 10. Struktura Firestore do odtworzenia
Minimalna struktura:
```
dataslate/
  current (document)
    title: string
    content: string
    backgroundKey: string
    frameKey: string
    logoKey: string
    fontFamily: string
    updatedAt: timestamp
    aliases: map<string,string>
```

## 11. Skrypt Node.js do bootstrapu (przykład)
Przykład inicjalizacji dokumentu `dataslate/current`:
```js
// node scripts/bootstrap-dataslate.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

await db.doc('dataslate/current').set({
  title: 'DataSlate',
  content: 'Treść startowa',
  backgroundKey: 'WnG',
  frameKey: 'WnG_ramka',
  logoKey: 'Inquisition',
  fontFamily: 'Cinzel',
  updatedAt: new Date(),
  aliases: {}
});

console.log('Bootstrap complete');
```

## 12. Testy kontrolne po wdrożeniu
1. Otwórz `GM_test.html` i opublikuj testowy komunikat.
2. Otwórz `Infoczytnik_test.html` i sprawdź natychmiastowy render.
3. Zmień font i tło — potwierdź poprawne odświeżenie.
4. Wykonaj import XLSX i sprawdź poprawność mapowania.
5. Zweryfikuj tryb podglądu oraz poprawność renderu po zmianach ustawień.

## 13. Ograniczenia i zasady utrzymania
- Nie edytować automatycznie: `GM.html`, `Infoczytnik.html`, `GM_backup.html`, `Infoczytnik_backup.html`.
- Zmiany funkcjonalne wykonywać w plikach `_test`.
- Po każdej zmianie kodu aktualizować `docs/README.md` i `docs/Documentation.md`.
- Przy zmianach `GM_test.html`/`Infoczytnik_test.html` podnosić `INF_VERSION` w formacie czasu lokalnego PL.

## 14. Szczegółowa mapa funkcji (`GM_test.html`)
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

## 15. Szczegółowa mapa funkcji (`Infoczytnik_test.html`)
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

## 18. Specyfikacja wersjonowania testowego (`INF_VERSION`)
- Pole `INF_VERSION` występuje równolegle w `GM_test.html` i `Infoczytnik_test.html`.
- Format obowiązkowy: `rrrr-MM-dd_gg-hh-ss` (czas lokalny Polski).
- Każda zmiana kodu w którymkolwiek z plików testowych wymaga podniesienia tej wartości w obu plikach.
- Funkcja `autoCacheBust()` wymusza spójność `?v=INF_VERSION`, co gwarantuje odświeżenie zasobów na kliencie.
- Aktualna wersja testowa: `2026-04-29_11-26-17`.

## 19. Macierz kompletności technicznej
- **Style, kolory, fonty i warstwy:** sekcje 3, 14.3, 15.
- **Funkcje i mechaniki UI:** sekcje 7, 8, 14, 15.
- **Model danych i logika publikacji:** sekcje 4, 5, 14.6.
- **Firebase/Firestore:** sekcje 5, 10 (dokument `dataslate/current`).
- **Node.js / Web Push backend:** sekcje 9, 16, 17.
- **Wersjonowanie i cache-busting:** sekcja 18.

## 14. Wymagalność Firebase w instrukcji użytkownika
- Instrukcja użytkownika (`docs/README.md`) musi jednoznacznie wskazywać, że moduł Infoczytnik wymaga integracji z Firebase/Firestore do komunikacji GM↔gracze.
- W procedurze użytkowej należy utrzymywać kroki: utworzenie projektu, rejestracja aplikacji web, konfiguracja `config/firebase-config.js`, utworzenie Firestore Database, ustawienie reguł i test dwuekranowy.
## Multi-group deployment (isolated instances)
- W plikach `GM_test.html` i `Infoczytnik_test.html` dodano komentarze `WAŻNE/IMPORTANT` przy:
  - `INF_VERSION` (cache-busting testowej wersji),
  - `config/firebase-config.js`,
  - walidacji `window.firebaseConfig`.
- Każda grupa wymaga osobnego projektu Firebase, aby dokument `dataslate/current` nie był współdzielony.
- Po każdej zmianie testowych plików należy podnieść `INF_VERSION` w obu plikach do tej samej wartości.

## Aktualizacja linków względnych / Relative links update
W module używane są ścieżki względne do nawigacji i/lub danych, aby kopia modułu działała po przeniesieniu na inny serwer bez zależności od domeny autora.

The module now uses relative paths for navigation and/or data loading so that a copied module works on another server without dependencies on the author domain.



## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

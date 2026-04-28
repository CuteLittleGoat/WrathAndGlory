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
- `config/web-push-config.js` — konfiguracja Web Push dla środowiska lokalnego/testowego.
- `backend/*` — backend powiadomień push (Node.js/Express + web-push + zapis subskrypcji).

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
- Wynik importu może nadpisać `assets/data/data.json` dla lokalnego odczytu.

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

## 9. Powiadomienia push (backend Node.js)
### 9.1. Komponenty
- `backend/package.json` — zależności serwera.
- `backend/data/subscriptions.json` — magazyn subskrypcji push.
- `config/web-push-config.js` — klucze i konfiguracja VAPID dla testów.
- `config/web-push-config.production.example.js` — wzorzec konfiguracji produkcyjnej.

### 9.2. Zakres serwera
- Rejestracja subskrypcji urządzeń.
- Wysyłka powiadomień web push.
- Podstawowa obsługa wygasłych subskrypcji i błędów dostarczenia.

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
5. Wyślij testowe powiadomienie push i potwierdź otwarcie właściwego ekranu.

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
- `ping()` — szybki test łączności warstwy publikacji.
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

## 16. Integracja push — kontrakt techniczny
Konfiguracja klienta (Main + GM) oczekuje obiektu globalnego:
```js
window.infWebPushConfig = {
  vapidPublicKey: "...",
  subscribeEndpoint: "https://.../api/push/subscribe",
  triggerEndpoint: "https://.../api/push/trigger"
};
```

Kontrakt minimalny backendu:
1. `POST /api/push/subscribe` — zapis subskrypcji urządzenia.
2. `POST /api/push/trigger` — wysłanie notyfikacji do zapisanych subskrypcji.
3. Trwały magazyn subskrypcji (w repo: `backend/data/subscriptions.json`).

## 17. Node.js — struktura serwera push do odtworzenia 1:1
W katalogu `backend/` wymagane są:
- `package.json` ze skryptami:
  - `npm run start` → `node server.js`,
  - `npm run dev` → `node --watch server.js`.
- Zależności: `express`, `cors`, `dotenv`, `web-push`.
- `.env` oparty o `.env.example` (VAPID subject/public/private, port).
- `server.js` implementujący endpointy z sekcji 16.

Sugerowany minimalny szkielet:
1. `dotenv.config()`,
2. `app.use(cors())`, `app.use(express.json())`,
3. odczyt/zapis `subscriptions.json`,
4. `webpush.setVapidDetails(...)`,
5. implementacja endpointów subscribe/trigger,
6. cleanup wygasłych subskrypcji po błędach `410/404`.

## 18. Specyfikacja wersjonowania testowego (`INF_VERSION`)
- Pole `INF_VERSION` występuje równolegle w `GM_test.html` i `Infoczytnik_test.html`.
- Format obowiązkowy: `rrrr-MM-dd_gg-hh-ss` (czas lokalny Polski).
- Każda zmiana kodu w którymkolwiek z plików testowych wymaga podniesienia tej wartości w obu plikach.
- Funkcja `autoCacheBust()` wymusza spójność `?v=INF_VERSION`, co gwarantuje odświeżenie zasobów na kliencie.

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


# Dokumentacja techniczna WH40k Data-Slate (pełny opis do odtworzenia 1:1)

> Ten dokument opisuje **dokładny** wygląd i logikę aplikacji: strukturę HTML, style CSS, zasady działania, mapy zasobów, fonty, logikę Firestore oraz wszystkie kluczowe funkcje. Celem jest umożliwienie wiernego odtworzenia aplikacji 1:1.

## 1. Architektura i przepływ danych
- **Model aplikacji:** dwie strony HTML działające równolegle, z osobnymi wariantami testowymi.
  - `GM.html` (panel MG) zapisuje stan do Firestore.
  - `Infoczytnik.html` (ekran graczy) subskrybuje dokument i renderuje widok.
  - `GM_test.html` i `Infoczytnik_test.html` służą do testowania zmian przed ręcznym przeniesieniem do wersji produkcyjnych.
- **Firestore:** kolekcja `dataslate`, dokument `current`.
  - `type` określa akcję: `message`, `ping`, `clear`.
  - Dokument zawiera kompletny stan wizualny (frakcja, kolory, rozmiary, indeksy fillerów, logo, flicker) oraz treść.
- **Cache-busting:** Infoczytnik automatycznie dodaje parametr `?v=<INF_VERSION>` do URL-a i wymusza przeładowanie, aby urządzenia nie trzymały starej wersji.

## 2. Struktura repozytorium (pliki i katalogi)
- `index.html` — strona startowa z linkami do wersji produkcyjnych i testowych.
- `GM.html` — panel MG (UI + zapis do Firestore).
- `Infoczytnik.html` — ekran graczy (UI + subskrypcja Firestore + audio).
- `GM_test.html` — wersja testowa panelu MG (zmiany wprowadzane tylko tutaj).
- `Infoczytnik_test.html` — wersja testowa ekranu graczy (zmiany wprowadzane tylko tutaj).
- `config/`
  - `firebase-config.js` — faktyczna konfiguracja Firebase (globalna zmienna `window.firebaseConfig`).
  - `firebase-config.template.js` — szablon do wypełnienia własną konfiguracją.
- `assets/`
  - `layouts/<frakcja>/` — tła PNG dla frakcji (mapowane w `LAYOUT_BG`).
  - `logos/<frakcja>/` — logotypy PNG (mapowane w `FACTION_LOGO`).
  - `audio/global/` — `Ping.mp3`, `Message.mp3` (domyślne dźwięki).
- `docs/`
  - `README.md` — instrukcja użytkownika.
  - `Documentation.md` — ten dokument.
- `Draft/` — szkice/alternatywne layouty PNG (nieużywane w runtime).
- `backup-PrzedConfigiemJS/` — kopie starych wersji HTML (archiwum, nieużywane w runtime).

## 3. Zasoby zewnętrzne
### 3.1. Google Fonts
**Wspólna lista fontów (GM + Infoczytnik):**
- `Share Tech Mono`
- `Cinzel` (wagi 400, 700)
- `Rajdhani` (wagi 400, 600)
- `Black Ops One`
- `Staatliches`
- `Orbitron` (wagi 400, 700)
- `Questrial`
- `Russo One`

Wszystkie fonty są wczytywane z:
```
https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&display=swap
```

### 3.2. Firebase SDK
- **GM.html:** Firebase compat v9.6.8 w zwykłych `<script>`.
  - `https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js`
  - `https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js`
- **Infoczytnik.html:** Firebase modułowy v12.6.0 w `<script type="module">`.
  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js`
  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js`

## 4. Konfiguracja Firebase
### 4.1. Plik `config/firebase-config.js`
- Plik musi ustawiać `window.firebaseConfig` (bez eksportów ES).
- Format:
```js
window.firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
**Ważne:** Firebase dla modułu **Infoczytnik** musi być założone na **oddzielnym koncie Google** niż Firebase używany w module **Audio**. Dzięki temu unikasz konfliktów projektów, reguł i namespace'ów między modułami.

### 4.2. Firestore
- Kolekcja: `dataslate`
- Dokument: `current`
- Dokument tworzony przy pierwszym zapisie z panelu MG.

## 5. `index.html` — strona startowa
**Cel:** szybki wybór wersji produkcyjnej lub testowej.
- Linki produkcyjne:
  - `Otwórz GM` → `GM.html`
  - `Otwórz Infoczytnik` → `Infoczytnik.html`
- Linki testowe (do sprawdzania nowych modyfikacji):
  - `GM (test)` → `GM_test.html`
  - `Infoczytnik (test)` → `Infoczytnik_test.html`
- Krótki komunikat o odblokowaniu dźwięku oraz przykładowy adres hostingu:
  - `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`.

## 6. `GM.html` — panel MG
### 6.1. Layout i HTML
- Strona składa się z kontenera `.wrap` z pojedynczą kartą `.card`.
- Dwie kolumny (`.row` + `.col`):
  - **Lewa kolumna**: wybór frakcji, kolor treści, rozmiar treści, kolor i rozmiar prefiksu/sufiksu.
  - **Prawa kolumna**: losowość fillerów, ręczny wybór indeksów, przełączniki logo i flicker, live preview.
- Kluczowe elementy UI:
  - `select#faction` — lista frakcji.
  - `input#fontColor` — kolor treści wiadomości.
  - `input#msgFontSize` — rozmiar treści.
  - `input#psColorText` i `input#psColorPicker` — kolor prefix/suffix.
  - `input#psFontSize` — rozmiar prefix/suffix.
  - `input#randomFillers` — włącz/wyłącz losowanie.
  - `input#prefixIndex`, `input#suffixIndex` — ręczne indeksy.
  - `input#showLogo`, `input#flicker` — przełączniki.
  - `div#livePreview` — podgląd linii prefix/wiadomość/suffix.
  - `textarea#message` — treść wiadomości.
  - Przyciski: `#sendBtn`, `#pingBtn`, `#clearBtn`, `#clearTextBtn`.

### 6.2. Style CSS (dokładne wartości)
- Tło strony: `background: linear-gradient(180deg,#070707,#0f0f0f)`.
- Typografia bazowa: `body { font-family: Arial, sans-serif; color: #eaeaea; }`.
- Karta: `.card` ma `background: rgba(18,18,18,.92)`, `border-radius: 12px`, `box-shadow: 0 10px 30px rgba(0,0,0,.35)`.
- Pola formularza: tło `#0f0f0f`, obramowanie `1px solid #2a2a2a`, `border-radius: 10px`, `font-size: 16px`.
- Przyciski: `border-radius: 12px`, tło `#1d1d1d`, warianty `primary` i `warn` jako gradienty.
- Live preview: `.livePreviewBox` z `background: rgba(0,0,0,.35)`, `border: 1px solid rgba(255,255,255,.08)`, `min-height: 140px`.
- Sekcja losowości fillerów: `.fillerBox` z `background: #0f0f0f`, `border: 1px solid #2a2a2a`, `border-radius: 10px`.

### 6.3. Słowniki i mapy
- `FONT_STACK` mapuje frakcję do fontu:
  - mechanicus → `"Share Tech Mono"`
  - inquisition → `"Cinzel"`
  - militarum → `"Rajdhani"`
  - khorne → `"Black Ops One"`
  - nurgle → `"Staatliches"`
  - tzeentch → `"Orbitron"`
  - slaanesh → `"Questrial"`
  - chaos_undivided → `"Russo One"`
- `LAYOUTS` zawiera tablice `prefixes` i `suffixes` (po 9 wpisów na frakcję).

### 6.4. Logika JS (wszystkie funkcje)
- **Firebase:**
  - `firebase.initializeApp(firebaseConfig)`
  - `firebase.firestore()`
  - `currentRef = db.collection("dataslate").doc("current")`
- **Walidacja/utility:**
  - `setStatus(t)` — wpisuje komunikat statusu w `#status`.
  - `normalizePx(n, min, max, fallback)` — clamp rozmiaru fontu.
  - `clampIndex(n, max)` — przycięcie indeksu do zakresu 1..N.
  - `rand1to(max)` — losowanie indeksu 1..N.
  - `nonce()` — unikalny identyfikator snapshotu.
  - `getLayout()` — wybiera aktualny layout na podstawie `#faction` (fallback `mechanicus`).
  - `getPrefixSuffixColor()` — odczyt tekstowego koloru z fallbackiem `rgba(255,255,255,.88)`.
- **Podgląd:**
  - `computePreview()` — losuje/ustawia prefix/suffix, blokuje ręczne pola przy losowaniu, wypełnia `#prefixPreview` i `#suffixPreview`.
  - `updateLivePreview()` — synchronizuje fonty, kolory i rozmiary w `#livePreview`.
- **Wysyłanie stanu:**
  - `sendMessage(isClear)` — zapisuje pełny snapshot (`merge:false`).
    - `type = "message"` lub `"clear"`.
    - `text` pusty dla `clear`.
    - zapisuje style, indeksy, logo, flicker, `nonce`, `ts`.
  - `ping()` — zapisuje tylko styl + `type:"ping"` (`merge:true`).

### 6.5. Obsługa zdarzeń (GM)
- `#sendBtn` → `sendMessage(false)`.
- `#clearBtn` → `sendMessage(true)`.
- `#pingBtn` → `ping()`.
- `#clearTextBtn` → czyści `#message` i ustawia focus.
- Chipsy kolorów:
  - `data-target="msg"` zmienia `#fontColor`.
  - `data-target="ps"` zmienia `#psColorText` oraz synchronizuje `#psColorPicker` przy wartościach HEX.
- `#psColorPicker` synchronizuje `#psColorText`.
- `#faction`, `#randomFillers`, `#prefixIndex`, `#suffixIndex` → `computePreview()` na `input/change`.
- `#fontColor`, `#msgFontSize`, `#psColorText`, `#psFontSize` → `updateLivePreview()` na `input/change`.
- Start: `setStatus("gotowe")` i `computePreview()`.

## 7. `Infoczytnik.html` — ekran graczy
### 7.1. Auto-cache-busting (INF_VERSION)
- Skrypt w `<head>` ustawia:
  - `const INF_VERSION = "YYYY-MM-DD_HH-mm-ss"` (zawsze zgodne z aktualną datą i godziną, ustawiane osobno dla wersji produkcyjnych i testowych).
  - `window.__dsVersion = INF_VERSION`.
- Jeśli `?v` w URL różni się od `INF_VERSION`, wykonywany jest `window.location.replace(...)`.

### 7.2. CSS (dokładne wartości i zależności)
**Zmienne bazowe (`:root`):**
- `--accent: #00ff66`
- `--font: Calibri, Arial, sans-serif`
- `--screen-top: 14%`
- `--screen-right: 14%`
- `--screen-bottom: 22%`
- `--screen-left: 18%`
- `--msg-font-size: clamp(18px, 3.4vw, 32px)`
- `--prefix-font-size: clamp(12px, 2.0vw, 16px)`
- `--suffix-font-size: clamp(12px, 2.0vw, 16px)`
- `--filler-gap: clamp(12px, 2vw, 18px)`
- `--prefix-color: rgba(255,255,255,.88)`
- `--suffix-color: rgba(255,255,255,.86)`

**Layout i pozycjonowanie:**
- `html, body`: pełna wysokość, tło `#000`, brak scrolla.
- `.wrap`: `width:100vw`, `height:100vh`, centrowanie panelu.
- `.panel`: kontener o wymuszonym AR (aspect ratio) przez `fitPanel()`.
- `.layout-img`: absolutny obraz tła z `object-fit: contain`.

**Efekty CRT:**
- `.crt::before` — scanlines przez `repeating-linear-gradient` i animację `scanMove` (12s, infinite).
- `.crt::after` — winieta i subtelny „glow”.
- `.screen::after` — flicker z animacją `flickerBg` (9s, infinite).
- `.screen.no-flicker::after` — wyłączenie animacji flicker.

**Typografia i układ tekstu:**
- `.screen`: pozycja przez zmienne `--screen-*`, padding `clamp(14px, 2.4vw, 24px)`.
- `.prefix` i `.suffix`: `letter-spacing: 1.5px`, `white-space: pre-wrap`.
- `.msg`: `line-height: 1.35`, `word-break: break-word`, `text-shadow` o zielonym poświacie.
- `.logo`: rozmiar 54×54 px w `.logoBox`, `filter: drop-shadow(...)`, domyślnie `display: none`.

**Overlay audio:**
- `.unlock`: pełnoekranowy overlay z tłem `rgba(0,0,0,.88)`, tekst center, `z-index: 9999`.

### 7.3. Audio unlock
- Overlay `#unlock` blokuje dźwięk, dopóki użytkownik nie wykona interakcji.
- Zdarzenia odblokowujące: `click`, `touchstart`, `pointerdown`, `keydown`.
- IIFE `setupAudioUnlock()` ustawia `window.__dsAudioArmed = false`, usuwa overlay po pierwszej interakcji i wystawia funkcję:
  - `window.__dsPlayUrlOnce(url)` — odtwarza dźwięk **tylko** gdy `window.__dsAudioArmed === true`.

### 7.4. Mapy i stałe
- `ASSET_VERSION = window.__dsVersion || "2026-01-22_07-18-48"`.
- `DEFAULT_PING_URL = assets/audio/global/Ping.mp3?v=${ASSET_VERSION}`
- `DEFAULT_MSG_URL = assets/audio/global/Message.mp3?v=${ASSET_VERSION}`

**Mapy layoutów i logo:**
- `LAYOUT_BG` mapuje frakcję → ścieżka PNG.
- `LAYOUT_AR` (proporcje):
  - inquisition: `707/1023`
  - militarum: `1263/1595`
  - default04: `1131/1600`
- `SCREEN_INSETS` (marginesy panelu tekstu):
  - inquisition: `top 14%`, `right 14%`, `bottom 26%`, `left 18%`
  - militarum: `top 12.7%`, `right 19.8%`, `bottom 10.1%`, `left 21.46%`
  - default04: `top 14%`, `right 14%`, `bottom 22%`, `left 18%`
- `FONT_STACK` — identyczny jak w GM.
- `FILLERS` — listy prefix/suffix (po 9 wpisów na frakcję).
- `FACTION_LOGO` — tylko `mechanicus` i `inquisition` mają logo.

### 7.5. Funkcje renderujące i pomocnicze
- `autoCacheBust()` (IIFE w `<head>`) — dodaje `?v=<INF_VERSION>` do URL, jeśli brakuje/inna wartość.
- `setupAudioUnlock()` (IIFE) — patrz sekcja 7.3.
- `armAudio()` — wewnętrzna funkcja `setupAudioUnlock()` odblokowująca audio i ukrywająca overlay.
- `fitPanel(ar)` — dopasowuje `.panel` do okna, zachowując aspect ratio.
- `setInsets(p)` — ustawia CSS variables `--screen-*`.
- `setFlickerState(shouldFlicker)` — dodaje/usuwa `.no-flicker`.
- `setLogoForFaction(key, shouldShow)` — pokazuje logo tylko jeśli istnieje i `shouldShow` jest true.
- `getFillerText(key, idx1based, kind)` — pobiera prefix/suffix po indeksie 1-based.
- `applyLayout(factionKey, color, showLogo)`:
  1. Ustawia tło z `LAYOUT_BG`.
  2. Ustawia `--font` i `--accent`.
  3. Aktualizuje insets i aspect ratio zależnie od frakcji.
  4. Wyświetla logo (jeśli istnieje i `showLogo` nie jest false).
- `applyTextStyleFromDoc(d)` — ustawia CSS variables `--msg-font-size`, `--prefix-font-size`, `--suffix-font-size`, `--prefix-color`, `--suffix-color`.
- `showMessage(prefix, text, suffix)` — wypełnia linie i resetuje scroll.
- `clearMessageKeepLayout()` — czyści treść bez zmiany layoutu.
- `window.addEventListener("resize", ...)` — przy zmianie rozmiaru okna uruchamia `fitPanel(currentAr)`.

### 7.6. Obsługa snapshotu Firestore
**Logika renderowania:**
1. Ignoruj snapshot, jeśli `nonce` jest taki sam jak poprzedni.
2. Zastosuj layout (`applyLayout`), flicker i style tekstu.
3. `type === "clear"` → wyczyść treść.
4. `type === "ping"` → odtwórz dźwięk ping bez zmiany tekstu.
5. `type === "message"` → ustaw prefix, treść i suffix, a następnie odtwórz dźwięk wiadomości.

**Reguły prefix/suffix dla `message`:**
- Najpierw używane są `prefix`/`suffix` (lub `prefixText`/`suffixText`).
- Jeśli ich brak, ale są indeksy `prefixIndex`/`suffixIndex`, pobierany jest odpowiedni filler.
- Jeśli nadal brak, a treść nie jest pusta — fallback na indeks 1.

## 8. Payload Firestore (`dataslate/current`)
| Pole | Typ | Opis |
| --- | --- | --- |
| `type` | `"message"` \\| `"ping"` \\| `"clear"` | Rodzaj akcji. `clear` usuwa tylko tekst, `ping` uruchamia dźwięk, `message` ustawia treść. |
| `faction` | `string` | Klucz frakcji zgodny z mapami layoutów (np. `mechanicus`). |
| `color` / `fontColor` | `string` | Kolor treści wiadomości (CSS/HEX). |
| `msgFontSize` | `string` (np. `"28px"`) | Rozmiar treści, trafia do `--msg-font-size`. |
| `prefixColor` / `suffixColor` | `string` | Kolory prefix/suffix. |
| `prefixFontSize` / `suffixFontSize` | `string` | Rozmiary prefix/suffix. |
| `prefixIndex` / `suffixIndex` | `number` | Indeksy (1-based) do fillerów. |
| `prefix` / `suffix` (`prefixText` / `suffixText`) | `string` | Bezpośredni tekst linii nad/pod wiadomością. |
| `text` | `string` | Treść wiadomości. |
| `showLogo` | `boolean` | Czy pokazać logo frakcji. |
| `flicker` | `boolean` | Czy włączyć animację CRT. |
| `pingUrl` / `msgUrl` (`messageUrl`) | `string` | Opcjonalne ścieżki niestandardowych dźwięków. |
| `nonce` | `string` | Unikalny identyfikator snapshota (zapobiega dublowaniu). |
| `ts` | `serverTimestamp` | Znacznik czasu Firestore. |

## 9. Kroki odtworzenia aplikacji 1:1 (checklista)
1. Skopiuj dokładnie strukturę plików HTML, CSS oraz katalogów `assets/`.
2. Zaimplementuj `GM.html` z identyczną strukturą formularza, identycznymi ID oraz CSS.
3. Zaimplementuj `Infoczytnik.html` z identycznym HTML (panel, screen, logo, overlay) i CSS (zmienne, CRT, flicker).
4. Wczytaj identyczny zestaw fontów Google Fonts.
5. Skonfiguruj Firebase i Firestore, ustawiając `dataslate/current`.
6. Upewnij się, że `GM.html` używa Firebase compat v9.6.8, a `Infoczytnik.html` — modułów v12.6.0.
7. Skopiuj mapy `LAYOUT_BG`, `LAYOUT_AR`, `SCREEN_INSETS`, `FONT_STACK`, `FILLERS`, `FACTION_LOGO` 1:1.
8. Zachowaj mechanizm cache-busting (`INF_VERSION` → `window.__dsVersion` → `?v=`).
9. Zadbaj o to, by dźwięk był odblokowywany przez overlay (wymóg Chrome/Safari).
10. Sprawdź, czy `type` i pola payloadu są zapisywane i odczytywane dokładnie jak w specyfikacji.

## 10. Aktualizacja assetów i layoutów
- **Nowa frakcja:** dodaj pliki do `assets/layouts/<frakcja>/`, ewentualne logo do `assets/logos/<frakcja>/`, uzupełnij mapy w `Infoczytnik.html` (`LAYOUT_BG`, `FILLERS`, `FONT_STACK`, opcjonalnie `FACTION_LOGO`, `LAYOUT_AR`, `SCREEN_INSETS`).
- **Nowy layout istniejącej frakcji:** podmień PNG i zaktualizuj mapę `LAYOUT_BG`. Jeśli zmienia się proporcja lub położenie tekstu — zaktualizuj `LAYOUT_AR`/`SCREEN_INSETS`.
- **Audio:** podmień `assets/audio/global/Ping.mp3` i `Message.mp3` lub używaj `pingUrl`/`msgUrl` w dokumencie.
- **Wersjonowanie:** podnieś `INF_VERSION` (a przez to `ASSET_VERSION`), aby wymusić pobranie nowych assetów.

## 11. Troubleshooting
- **Brak dźwięku:** upewnij się, że użytkownik kliknął overlay (sprawdź `window.__dsAudioArmed` w konsoli) i że pliki audio istnieją.
- **Brak synchronizacji:** sprawdź `config/firebase-config.js`, reguły Firestore i dostępność sieci.
- **Nowe assety nie widać:** zwiększ `INF_VERSION` i odśwież urządzenie (cache-busting).

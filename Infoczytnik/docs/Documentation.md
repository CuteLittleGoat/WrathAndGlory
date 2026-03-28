# Dokumentacja techniczna WH40k Data-Slate (pełny opis do odtworzenia 1:1)

> Ten dokument opisuje **dokładny** wygląd i logikę aplikacji: strukturę HTML, style CSS, zasady działania, mapy zasobów, fonty, logikę Firestore oraz wszystkie kluczowe funkcje. Celem jest umożliwienie wiernego odtworzenia aplikacji 1:1.

## 1. Architektura i przepływ danych
- **Model aplikacji:** dwie strony HTML działające równolegle, z osobnymi wariantami testowymi.
  - `GM.html` (panel MG) zapisuje stan do Firestore.
  - `Infoczytnik.html` (ekran graczy) subskrybuje dokument i renderuje widok.
  - `GM_test.html` i `Infoczytnik_test.html` służą do testowania zmian przed ręcznym przeniesieniem do wersji produkcyjnych.
- **Firestore:** kolekcja `dataslate`, dokument `current`.
  - `type` określa akcję: `message`, `ping`, `clear`.
  - Dokument zawiera kompletny stan wizualny (frakcja, kolory, rozmiary, liczba linii fillerów, jawne listy prefix/suffix, logo, flicker) oraz treść.
- **Cache-busting:** Infoczytnik automatycznie dodaje parametr `?v=<INF_VERSION>` do URL-a i wymusza przeładowanie, aby urządzenia nie trzymały starej wersji.
- **Źródło fillerów:** prefixy i suffixy są wpisane bezpośrednio w kodzie (`LAYOUTS`/`FILLERS`) w plikach testowych; runtime nie ładuje zewnętrznego pliku tekstowego.

## 2. Struktura repozytorium (pliki i katalogi)
- `index.html` — strona startowa z linkami do wersji produkcyjnych i testowych (tytuł karty: `DataSlate panel testowy`).
- `GM.html` — panel MG (UI + zapis do Firestore).
- `Infoczytnik.html` — ekran graczy (UI + subskrypcja Firestore + audio).
- `GM_test.html` — wersja testowa panelu MG (zmiany wprowadzane tylko tutaj, tytuł karty: `Infoczytnik - panel GM`, a po przełączeniu na EN: `Data-Slate - GM panel`, zawiera przełącznik języka PL/EN).
- `Infoczytnik_test.html` — wersja testowa ekranu graczy (zmiany wprowadzane tylko tutaj, tytuł karty: `Infoczytnik`).
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
**Ważne:** Firebase dla modułu **Infoczytnik** nie wymaga oddzielnego konta Google od modułu **Audio**. Oba moduły mogą korzystać z tego samego konta/projektu, jeśli konfiguracje i reguły są rozdzielone; rozdzielenie projektów to wyłącznie wygoda organizacyjna, a nie wymóg techniczny.

### 4.2. Firestore
- Kolekcja: `dataslate`
- Dokument: `current`
- Dokument tworzony przy pierwszym zapisie z panelu MG.

## 5. `index.html` — strona startowa
**Cel:** szybki wybór wersji produkcyjnej lub testowej w stylistyce spójnej z resztą aplikacji.

### 5.1. Struktura HTML
- `main` zawiera:
  - `header` z tytułem `WH40k Data-Slate` i krótkim opisem.
  - `.sections` z dwiema kartami:
    - **Wersje produkcyjne**: `Otwórz GM` → `GM.html`, `Otwórz Infoczytnik` → `Infoczytnik.html`.
    - **Wersje testowe**: `GM (test)` → `GM_test.html`, `Infoczytnik (test)` → `Infoczytnik_test.html`.
  - Dwie notatki `.note` na końcu:
    - informacja o odblokowaniu audio,
    - adres hostingu `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`.

### 5.2. CSS (pełne wartości)
**Zmienne (`:root`):**
- `--bg`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel: #000`
- `--border: #16c60c`
- `--text: #9cf09c`
- `--accent: #16c60c`
- `--accent-dark: #0d7a07`
- `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
- `--radius: 12px`

**Globalne zasady:**
- `*` wymusza fonty `"Consolas", "Fira Code", "Source Code Pro", monospace` i `box-sizing: border-box`.
- `body`:
  - `min-height: 100vh`, `display: flex`, `align-items: center`, `justify-content: center`,
  - `padding: 24px`,
  - tło `var(--bg)`, kolor `var(--text)`.
- `main`:
  - `width: min(880px, 100%)`,
  - `background: var(--panel)`,
  - `border: 2px solid var(--border)`,
  - `border-radius: var(--radius)`,
  - `box-shadow: var(--glow)`,
  - `padding: 32px`, `gap: 20px`.

**Nagłówek:**
- `header h1`: uppercase, `letter-spacing: 0.08em`, `font-size: clamp(22px, 3vw, 30px)`.
- `header p`: `font-size: 14px`, kolor `rgba(156, 240, 156, 0.75)`.

**Sekcje i przyciski:**
- `.sections`: grid z odstępem `20px`.
- `.section`:
  - `border: 1px solid rgba(22, 198, 12, 0.45)`,
  - `border-radius: 10px`,
  - `padding: 16px`,
  - `background: rgba(22, 198, 12, 0.04)`.
- `.section h2`: uppercase, `letter-spacing: 0.08em`, `font-size: 15px`.
- `.row`: grid `repeat(auto-fit, minmax(200px, 1fr))`, odstępy `12px 14px`.
- `.btn`:
  - `border: 2px solid var(--border)`,
  - tło `rgba(22, 198, 12, 0.08)`,
  - `border-radius: 8px`,
  - `font-size: 15px`, `font-weight: 600`,
  - `min-height: 46px`,
  - hover: `transform: translateY(-1px)`, `box-shadow: 0 0 18px rgba(22, 198, 12, 0.3)`, `background: rgba(22, 198, 12, 0.14)`,
  - active: `background: rgba(22, 198, 12, 0.22)`.

**Notatki:**
- `.note`: `font-size: 13px`, `line-height: 1.4`, kolor `rgba(156, 240, 156, 0.75)`.
- `code` w notatkach ma kolor `#b6ffb6`.

## 6. `GM.html` — panel MG
### 6.1. Layout i HTML
- Strona składa się z kontenera `.wrap` z pojedynczą kartą `.card`.
- Dwie kolumny (`.row` + `.col`):
  - **Lewa kolumna**: wybór frakcji, kolor treści, rozmiar treści, kolor i rozmiar prefiksu/sufiksu.
  - **Prawa kolumna**: losowość fillerów, ręczny wybór indeksów, przełączniki logo i flicker, live preview.
- Kluczowe elementy UI:
  - `select#languageSelect` — przełącznik języka interfejsu (PL/EN); aktualizuje etykiety UI i tekst statusu.
  - `select#faction` — lista frakcji.
  - `input#fontColor` — kolor treści wiadomości.
  - `input#msgFontSize` — rozmiar treści.
  - `input#psColorText` i `input#psColorPicker` — kolor prefix/suffix.
  - `input#psFontSize` — rozmiar prefix/suffix.
  - `input#randomFillers` — włącz/wyłącz losowanie.
  - `input#prefixIndex`, `input#suffixIndex` — ręczne indeksy.
  - Teksty prefix/suffix w preview pochodzą wyłącznie z `LAYOUTS` i nie są tłumaczone.
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
  - pismo_odreczne → `"Caveat"`
  - pismo_ozdobne → `"Great Vibes"`
- `LAYOUTS` zawiera tablice `prefixes` i `suffixes` (po 9 wpisów na frakcję).
  - Dla `pismo_odreczne` i `pismo_ozdobne` tablice są puste (`[]`) i działają jako layouty „bez dodatków”.

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
  - `const INF_VERSION = "YYYY-MM-DD_HH-mm-ss"` (zawsze zgodne z aktualną datą i godziną; myślniki zamiast dwukropków; ustawiane osobno dla wersji produkcyjnych i testowych), np. `2026-02-01_10-44-23`.
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

### 7.3. Audio
- Brak overlayu blokującego dźwięk — aplikacja nie wymusza kliknięcia przed odtworzeniem.
- Globalna funkcja:
  - `window.__dsPlayUrlOnce(url)` — próbuje odtworzyć dźwięk przez `new Audio(url).play()` i ignoruje ewentualne błędy (np. blokada autoplay w przeglądarce).

### 7.4. Mapy i stałe
- `ASSET_VERSION = window.__dsVersion || "2026-01-22_07-18-48"`.
- `DEFAULT_PING_URL = assets/audio/global/Ping.mp3?v=${ASSET_VERSION}`
- `DEFAULT_MSG_URL = assets/audio/global/Message.mp3?v=${ASSET_VERSION}`

**Mapy layoutów i logo:**
- `LAYOUT_BG` mapuje frakcję → ścieżka PNG.
  - Dodane ścieżki:
    - `pismo_odreczne` → `assets/layouts/Pismo_odreczne/Pergamin.jpg`
    - `pismo_ozdobne` → `assets/layouts/Pismo_ozdobne/Pergamin.jpg`
- `LAYOUT_AR` (proporcje):
  - inquisition: `707/1023`
  - militarum: `1263/1595`
  - default04: `1131/1600`
  - pergamin: `1/1`
- `SCREEN_INSETS` (marginesy panelu tekstu):
  - inquisition: `top 14%`, `right 14%`, `bottom 26%`, `left 18%`
  - militarum: `top 12.7%`, `right 19.8%`, `bottom 10.1%`, `left 21.46%`
  - default04: `top 14%`, `right 14%`, `bottom 22%`, `left 18%`
  - pergamin: `top 12%`, `right 10%`, `bottom 12%`, `left 10%`
- `FONT_STACK` — identyczny jak w GM.
- `FILLERS` — listy prefix/suffix (po 9 wpisów na frakcję).
- `FACTION_LOGO` — tylko `mechanicus` i `inquisition` mają logo.

### 7.5. Funkcje renderujące i pomocnicze
- `autoCacheBust()` (IIFE w `<head>`) — dodaje `?v=<INF_VERSION>` do URL, jeśli brakuje/inna wartość.
- `window.__dsPlayUrlOnce(url)` — patrz sekcja 7.3.
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
  - Dla `pismo_odreczne` i `pismo_ozdobne` wymuszany jest preset `pergamin` (insets + AR).
- `applyTextStyleFromDoc(d)` — ustawia CSS variables `--msg-font-size`, `--prefix-font-size`, `--suffix-font-size`, `--prefix-color`, `--suffix-color`.
- `showMessage(prefix, text, suffix)` — wypełnia linie i resetuje scroll.
- `clearMessageKeepLayout()` — czyści treść bez zmiany layoutu.
- `window.addEventListener("resize", ...)` — przy zmianie rozmiaru okna uruchamia `fitPanel(currentAr)`.
- `resolveLocalAudioUrl(rawUrl, fallbackUrl)` — waliduje źródło audio i dopuszcza wyłącznie lokalne ścieżki `assets/audio/...` (lub URL absolutny w tym samym origin prowadzący do `assets/audio/...`); każdy URL zewnętrzny jest odrzucany i zastępowany fallbackiem.

### 7.6. Obsługa snapshotu Firestore
**Logika renderowania:**
1. Ignoruj snapshot, jeśli `nonce` jest taki sam jak poprzedni.
2. Zastosuj layout (`applyLayout`), flicker i style tekstu.
3. `type === "clear"` → wyczyść treść.
4. `type === "ping"` → odtwórz dźwięk ping bez zmiany tekstu.
5. `type === "message"` → ustaw prefix, treść i suffix, a następnie odtwórz dźwięk wiadomości.
   - Wyjątek: dla `pismo_odreczne` i `pismo_ozdobne` prefix/suffix są czyszczone, logo i flicker są wymuszone na `false`, a `Message.mp3` nie jest odtwarzany.
   - `Ping` dla tych layoutów pozostaje aktywny i odtwarza dźwięk.

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
| `pingUrl` / `msgUrl` (`messageUrl`) | `string` | Opcjonalne ścieżki dźwięków, ale tylko lokalne (`assets/audio/...` lub URL tego samego origin wskazujący na `assets/audio/...`). Zewnętrzne hosty są ignorowane. |
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
- **Audio:** podmień `assets/audio/global/Ping.mp3` i `Message.mp3`; jeśli używasz `pingUrl`/`msgUrl` w dokumencie, wskazuj wyłącznie lokalne pliki z repo (`assets/audio/...`).
- **Wersjonowanie:** podnieś `INF_VERSION` (a przez to `ASSET_VERSION`), aby wymusić pobranie nowych assetów.

## 11. Troubleshooting
- **Brak dźwięku:** upewnij się, że użytkownik kliknął overlay (sprawdź `window.__dsAudioArmed` w konsoli) i że pliki audio istnieją.
- **Brak synchronizacji:** sprawdź `config/firebase-config.js`, reguły Firestore i dostępność sieci.
- **Nowe assety nie widać:** zwiększ `INF_VERSION` i odśwież urządzenie (cache-busting).

## 12. Dokument referencyjny Firebase
- Dla modułu Infoczytnik/GM utworzono osobny dokument konfiguracyjny: `Infoczytnik/config/Firebase-config.md`.
- Zawiera on template `firebase-config.js`, schemat dokumentu Firestore `dataslate/current`, skrypt Node.js inicjalizujący dane oraz szczegółową instrukcję wdrożenia (PL/EN).

## 11. Web Push (Opcja B) i PWA — implementacja testowa

### 11.1. Pliki konfiguracyjne
- `Infoczytnik/config/web-push-config.js` udostępnia globalny obiekt `window.infWebPushConfig`:
  - `vapidPublicKey` (Base64URL),
  - `subscribeEndpoint` (POST zapis subskrypcji),
  - `triggerEndpoint` (opcjonalny POST uruchamiający wysyłkę push).

### 11.2. `Infoczytnik_test.html` — subskrypcja push
- Dodano przycisk `#pushBtn` (`.pushBtn`) uruchamiający proces subskrypcji.
- Algorytm:
  1. Walidacja konfiguracji (`vapidPublicKey`, `subscribeEndpoint`). Jeśli brakuje konfiguracji, przycisk `#pushBtn` przechodzi w stan zablokowany z informacją dla użytkownika (bez alertu blokującego).
  2. `Notification.requestPermission()`.
  3. `navigator.serviceWorker.ready` i `registration.pushManager.subscribe(...)`.
  4. `fetch(subscribeEndpoint, { method: 'POST', body: subscription })`.
  5. Po sukcesie przycisk przechodzi w stan „Powiadomienia aktywne” (`disabled=true`).
  6. Błędy (brak wsparcia Web Push, brak zgody, wyjątek HTTP) są wyświetlane bezpośrednio na `#pushBtn` przez `setPushButtonMessage(...)`, bez `alert()` blokującego UI.

### 11.3. Blokada orientacji
- Funkcja `tryLockPortrait()`:
  - wywołuje `screen.orientation.lock('portrait')` jeśli API jest dostępne,
  - przy błędzie stosuje cichy fallback (`catch`) bez komunikatu UI.
- Globalny `manifest.webmanifest` nie wymusza już orientacji, więc tylko Infoczytnik zostaje z lockiem pionowym, a pozostałe moduły przejmują orientację z urządzenia/systemu.

### 11.4. `GM_test.html` — trigger wysyłki
- Dodano funkcję `triggerPushNotification()`:
  - jeśli `triggerEndpoint` jest ustawiony, wysyła POST JSON z payloadem powiadomienia:
    - `title: Infoczytnik`
    - `body: +++ INCOMING DATA-TRANSMISSION +++`
    - `icon: ./IkonaPowiadomien.png`
    - `tag: infoczytnik-new-message`
    - `url: ./Infoczytnik/Infoczytnik_test.html`.
- Funkcja jest uruchamiana po zapisie wiadomości (`type: message`), ale nie przy `clear`.

### 11.5. Powiązanie z globalnym Service Workerem
- Obsługa zdarzeń `push` i `notificationclick` znajduje się w `service-worker.js` (katalog repo).
- Notyfikacja ma fallback:
  - body: `+++ INCOMING DATA-TRANSMISSION +++`
  - icon/badge: `./IkonaPowiadomien.png`
  - tag: `infoczytnik-new-message`.


## 13. Aktualizacja 2026-03-12 — losowość fillerów 1..5 i payload listowy
### 13.1. Zmiany w `GM_test.html`
- Podniesiono `INF_VERSION` do `2026-03-12_18-10-00`.
- Sekcja „Losowość fillerów” została przebudowana:
  - usunięto checkbox `Losuj automatycznie`,
  - usunięto ręczne pola `prefixIndex`/`suffixIndex`,
  - dodano `input#fillerLineCount` (`min=1`, `max=5`, `value=3`),
  - dodano przycisk `#rerollFillersBtn`.
- Dodano stan `fillerState` (`count`, `prefixLines`, `suffixLines`) i funkcje:
  - `drawUniqueRandomLines(source, count)` — unikatowe losowanie metodą Fisher-Yates + `slice`,
  - `rerollFillers()` — kontrolowany moment losowania (zmiana frakcji, count, klik przycisku, inicjalizacja),
  - `renderFillerPreview()` — render wielu linii w podglądzie tekstowym,
  - `updateLivePreview()` — render wielu linii (`join("\n")`) w live preview.
- `sendMessage()` wysyła aktualnie wylosowany stan bez ponownego losowania:
  - `fillerLineCount`,
  - `prefixLines: string[]`,
  - `suffixLines: string[]`.
- Wszystkie pule prefix/suffix zostały zaktualizowane i zaszyte bezpośrednio w stałej `LAYOUTS`.

### 13.2. Zmiany w `Infoczytnik_test.html`
- Podniesiono `INF_VERSION` do `2026-03-12_18-10-00`.
- Zaktualizowano stałą `FILLERS` do nowego, pełnego zestawu prefix/suffix dla wszystkich frakcji.
- Odbiór danych Firestore obsługuje nowy model listowy:
  - jeżeli istnieją `prefixLines` / `suffixLines`, renderer składa je do bloków wieloliniowych (`join("\n")`),
  - fallback legacy pozostaje aktywny (`prefixIndex` / `suffixIndex`).
- Dzięki temu panel gracza renderuje 1:1 ten sam zestaw fillerów, który widzi GM w podglądzie.

### 13.3. i18n (PL/EN)
- Dodane klucze tłumaczeń:
  - PL: `labelFillerLineCount`, `buttonRerollFillers`, nowy `randomHint`.
  - EN: `labelFillerLineCount`, `buttonRerollFillers`, nowy `randomHint`.

### 13.4. Replikacja 1:1
Aby odtworzyć obecną wersję:
1. Użyj `fillerLineCount` 1..5 (domyślnie 3).
2. Losowanie uruchamiaj wyłącznie przez `rerollFillers()`.
3. Do Firestore zapisuj listy `prefixLines` i `suffixLines` (nie tylko indeksy).
4. Po stronie gracza renderuj listy jako wielolinijkowe bloki tekstowe i pozostaw fallback indeksowy dla starych dokumentów.


## 14. Aktualizacja 2026-03-13 — własny backend Web Push

### 14.1. Nowy katalog `Infoczytnik/backend`
Dodano kompletny, samodzielny backend Node.js obsługujący Web Push.

- `server.js`:
  - uruchamia serwer Express,
  - obsługuje CORS (lista `ALLOWED_ORIGINS` z `.env`),
  - waliduje strukturę subskrypcji push,
  - zapisuje subskrypcje do pliku JSON (`SUBSCRIPTIONS_FILE`),
  - wysyła notyfikacje przez bibliotekę `web-push` i klucze VAPID,
  - usuwa wygasłe endpointy (`404`/`410`) po nieudanej wysyłce.
- `package.json`:
  - zależności: `express`, `web-push`, `dotenv`, `cors`.
- `.env.example`:
  - `WEB_PUSH_VAPID_PUBLIC_KEY`, `WEB_PUSH_VAPID_PRIVATE_KEY`, `WEB_PUSH_VAPID_SUBJECT`,
  - `ALLOWED_ORIGINS`, `SUBSCRIPTIONS_FILE`, `PORT`.

### 14.2. Kontrakt API backendu
1. `GET /api/push/health`
   - zwraca status backendu, flagę konfiguracji VAPID i liczbę zapisanych subskrypcji.
2. `POST /api/push/subscribe`
   - przyjmuje `{ source, createdAt, subscription }`,
   - zapisuje subskrypcję, jeśli endpoint nie istnieje jeszcze w bazie.
3. `POST /api/push/trigger`
   - przyjmuje payload notyfikacji (`title`, `body`, `icon`, `badge`, `tag`, `url`),
   - wysyła powiadomienia do wszystkich aktywnych subskrypcji.

### 14.3. Integracja z frontem
- `Infoczytnik/config/web-push-config.js` ma domyślne endpointy lokalnego backendu:
  - `subscribeEndpoint: http://localhost:8787/api/push/subscribe`,
  - `triggerEndpoint: http://localhost:8787/api/push/trigger`.
- `vapidPublicKey` pozostaje celowo puste do uzupełnienia dla środowiska docelowego.

### 14.4. Orientacja PWA po zmianie
- Z `manifest.webmanifest` usunięto globalne pole `orientation`.
- Efekt:
  - `Infoczytnik` (przez `tryLockPortrait`) pozostaje pionowy,
  - pozostałe moduły działają zgodnie z orientacją urządzenia/systemu.

## Aktualizacja techniczna push/PWA (2026-03)

### `config/web-push-config.js`
- Wprowadzono realny `vapidPublicKey` z Firebase Cloud Messaging:
  - `BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig`
- Endpointy backendu zmieniono na produkcyjne placeholdery HTTPS:
  - `subscribeEndpoint: https://example.com/api/push/subscribe`
  - `triggerEndpoint: https://example.com/api/push/trigger`
- Powód: konfiguracja testowa `localhost` nie spełnia wymagań działania PWA push na urządzeniu Android poza środowiskiem deweloperskim.

### `config/web-push-config.production.example.js` (nowy plik)
- Dodano gotowy szablon produkcyjny konfiguracji push.
- Szablon utrzymuje ten sam klucz VAPID i zawiera czytelne przykłady URL-i HTTPS do podmiany na domenę docelową.
- Plik służy jako wzorzec wdrożeniowy i backup konfiguracji.

## 15. Aktualizacja 2026-03-13_08-25-05 — audyt PWA Android + VAPID/Web Push

### 15.1. Problem wykryty podczas audytu
- W `Infoczytnik_test.html` proces subskrypcji push opierał się na `navigator.serviceWorker.ready`, ale moduł nie rejestrował samodzielnie Service Workera.
- W praktyce oznaczało to, że wejście bezpośrednio na `Infoczytnik_test.html` (bez odwiedzenia `Main/index.html`, które rejestruje SW) mogło blokować Web Push na Androidzie.

### 15.2. Zmiana w `Infoczytnik_test.html`
Dodano funkcję:
- `ensureServiceWorkerRegistration()`
  - sprawdza wsparcie `serviceWorker` w `navigator`,
  - wykonuje `navigator.serviceWorker.register("../service-worker.js")`,
  - zwraca obiekt rejestracji.

Integracja funkcji:
1. W `enablePushNotifications()` przed `navigator.serviceWorker.ready` wywoływane jest `await ensureServiceWorkerRegistration()`.
2. Przy starcie modułu wykonywana jest próba rejestracji SW w tle (`catch` loguje ostrzeżenie do konsoli, bez blokowania UI).

Efekt:
- przepływ Web Push działa zarówno przy wejściu przez `Main`, jak i przy bezpośrednim otwarciu modułu Infoczytnik,
- zgodność z Android PWA została poprawiona bez ingerencji w pliki produkcyjne.

### 15.3. Zmiana w `GM_test.html`
W funkcji `triggerPushNotification()` zaktualizowano payload:
- `url` zmieniono z testowego `./Infoczytnik/Infoczytnik_test.html`
- na produkcyjny `./Infoczytnik/Infoczytnik.html`.

Powód:
- zgodnie z zasadą, że odnośniki funkcjonalności powiadomień w plikach konfiguracyjnych/powiązanych mają wskazywać ścieżki produkcyjne.

### 15.4. Zmiana w `backend/server.js`
W `normalizePayload(...)` domyślna wartość pola `url` została ustawiona na:
- `./Infoczytnik/Infoczytnik.html`.

Znaczenie:
- nawet jeśli trigger push nie poda własnego URL-a, kliknięcie powiadomienia przekieruje użytkownika na produkcyjny ekran odbiorcy.

### 15.5. Wersjonowanie testowych HTML
Zgodnie z zasadami modułu `Infoczytnik` podniesiono:
- `INF_VERSION` w `GM_test.html` do `2026-03-13_08-25-05`,
- `INF_VERSION` w `Infoczytnik_test.html` do `2026-03-13_08-25-05`.

Wersja zawiera datę i czas lokalny (Polska), w formacie `rrrr-MM-dd_gg-mm-ss`.

## Aktualizacja techniczna 2026-03-13 — odseparowanie onboardingu push od ekranu odczytu

### Zmiany w `Infoczytnik_test.html`
1. Usunięto element HTML `button#pushBtn`.
2. Usunięto style `.pushBtn` i `.pushBtn[disabled]`.
3. Usunięto funkcje związane z ręcznym onboardingiem push z poziomu ekranu odczytu:
   - `urlBase64ToUint8Array`
   - `getPushConfig`
   - `refreshPushButtonState`
   - `setPushButtonMessage`
   - `enablePushNotifications`
4. Zachowano automatyczną rejestrację Service Workera (`ensureServiceWorkerRegistration`) wykonywaną przy starcie modułu.
5. Zachowano orientację pionową (`tryLockPortrait`) i cały przepływ renderu wiadomości bez zmian funkcjonalnych.

### Uzasadnienie UX
- Moduł Infoczytnik ma pełnić rolę wyłącznie „ekranu w trakcie gry”, bez dodatkowych elementów, które mogłyby wybić z imersji.
- Onboarding powiadomień został przeniesiony do modułu `Main`.

### Wersjonowanie cache-bustingu
- Wymagane podniesienie `INF_VERSION` wykonano równolegle w:
  - `Infoczytnik/GM_test.html`
  - `Infoczytnik/Infoczytnik_test.html`
- Aktualna wartość: `2026-03-13_09-01-06`.

## Aktualizacja techniczna 2026-03-13 — korekta podglądu GM i symetrii odstępów Infoczytnika

### `GM_test.html`
- W `.livePreviewBox` dla `.prefix` i `.suffix` ustawiono `white-space: pre-line`.
- Dzięki temu znaki nowej linii z `join("\n")` są renderowane jako osobne linie w podglądzie live.

### `Infoczytnik_test.html`
- `:root` rozszerzono o:
  - `--gap-prefix-to-msg`
  - `--gap-msg-to-suffix`
  Obie zmienne bazują na `--filler-gap`, co zapewnia równy odstęp nad i pod sekcją wiadomości.
- `.screen` działa jako kolumna (`display:flex; flex-direction:column`) dla stabilnego przepływu pionowego.
- `.prefixRow`:
  - ma `padding-right: 66px`,
  - logo nie wpływa na wysokość bloku tekstu prefixu.
- `.logoBox` ustawiono absolutnie (`position:absolute; top:0; right:0`), aby wyeliminować sztuczne podnoszenie wysokości górnego wiersza przez ikonę.
- `.suffixRow` korzysta z `margin-top: var(--gap-msg-to-suffix)`.

### Wersjonowanie
- `INF_VERSION` podniesiono do `2026-03-13_09-29-26` w:
  - `GM_test.html`
  - `Infoczytnik_test.html`

## Aktualizacja techniczna 2026-03-13_10-07-18 — korekta chipów kolorów w `GM_test.html`

### Zakres
- Zmiana dotyczy wyłącznie panelu GM (`Infoczytnik/GM_test.html`) w sekcjach szybkiego wyboru koloru:
  - `#msgColorChips`
  - `#psColorChips`
- Celem było usunięcie nakładania się etykiet (`Zielony`, `Czerwony`, `Złoty`, `Biały`) przy węższych szerokościach panelu.

### Zmiany HTML
- W każdym chipie pierwszy `span` (kolorowy kwadrat) otrzymał klasę `.swatch`.
- Struktura chipa pozostała dwuelementowa: znacznik koloru + tekst etykiety.

### Zmiany CSS (dokładne)
1. Kontener chipów:
- było: `.chips { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px }`
- jest: `.chips { display:flex; gap:10px 14px; flex-wrap:wrap; margin-top:8px }`
- Efekt: większy odstęp pionowy/poziomy pomiędzy elementami.

2. Sam chip:
- dodano `display:inline-flex`, `align-items:center`, `gap:7px`, `white-space:nowrap`.
- Zachowano: `padding:8px 10px`, `border-radius:999px`, obramowanie i tło.
- Efekt: kropka koloru i tekst tworzą jedną spójną linię bez „ściskania” etykiety.

3. Znacznik koloru:
- stary ogólny selektor `.chip span` zastąpiono selektorem `.chip .swatch`.
- `.chip .swatch` ma: `width:12px`, `height:12px`, `border-radius:3px`, `border:1px solid rgba(0,0,0,.25)`, `flex:0 0 12px`.
- Efekt: stały rozmiar dotyczy wyłącznie kwadratu koloru, a nie tekstu etykiety.

### Przyczyna i rezultat
- Poprzednio reguła `.chip span` nadawała stałą szerokość także spanowi z tekstem etykiety, co powodowało wizualne nakładanie nazw.
- Po rozdzieleniu stylowania (`.swatch`) etykiety renderują się naturalnie i nie nachodzą na siebie.

### Wersjonowanie testowych HTML
- Zgodnie z zasadami modułu podniesiono `INF_VERSION` do `2026-03-13_10-07-18` w:
  - `Infoczytnik/GM_test.html`
  - `Infoczytnik/Infoczytnik_test.html`

## Aktualizacja techniczna 2026-03-13 — domknięcie checklisty Web Push (sekcja 3)

### Zmiana 1: `Infoczytnik/config/web-push-config.js`
- `vapidPublicKey` pozostaje ustawiony na klucz Firebase Web Push (Key pair).
- Endpointy zostały zmienione z placeholderów `https://example.com/...` na ścieżki relatywne:
  - `subscribeEndpoint: "/api/push/subscribe"`
  - `triggerEndpoint: "/api/push/trigger"`

**Konsekwencja runtime:**
- Frontend wysyła `fetch` do tego samego originu, z którego serwowana jest aplikacja.
- Nie trzeba wpisywać domeny „na sztywno” w buildzie frontendu, jeżeli backend push jest reverse-proxy pod tym samym hostem.

### Zmiana 2: `Infoczytnik/backend/server.js`
- Dodano stałe domyślne:
  - `defaultVapidPublicKey`
  - `defaultVapidPrivateKey`
- Ostateczne wartości kluczy są liczone jako:
  - `process.env.WEB_PUSH_VAPID_PUBLIC_KEY || defaultVapidPublicKey`
  - `process.env.WEB_PUSH_VAPID_PRIVATE_KEY || defaultVapidPrivateKey`

**Kolejność priorytetu konfiguracji:**
1. Klucze z `.env`/zmiennych środowiskowych (produkcyjnie zalecane).
2. Klucze domyślne zaszyte w `server.js` (fallback awaryjny).

### Zmiana 3: `Infoczytnik/backend/.env.example`
- Plik przykładowy został uzupełniony realnymi wartościami:
  - `WEB_PUSH_VAPID_PUBLIC_KEY`
  - `WEB_PUSH_VAPID_PRIVATE_KEY`

**Znaczenie dla odtwarzalności 1:1:**
- Użytkownik uruchamiający backend lokalnie ma od razu komplet danych potrzebnych do testu subskrypcji i triggera push.
- Produkcyjnie nadal zalecane jest trzymanie kluczy poza repo i ustawienie ich przez sekret manager / env na platformie hostingu.


## Aktualizacja techniczna 2026-03-13 — bezpieczeństwo Web Push (Infoczytnik)

### 1) `backend/server.js`
- Usunięto stałe fallbacki VAPID (`defaultVapidPublicKey`, `defaultVapidPrivateKey`).
- Aktualna konfiguracja:
  - `const vapidPublicKey = (process.env.WEB_PUSH_VAPID_PUBLIC_KEY || "").trim();`
  - `const vapidPrivateKey = (process.env.WEB_PUSH_VAPID_PRIVATE_KEY || "").trim();`
  - `const vapidSubject = (process.env.WEB_PUSH_VAPID_SUBJECT || "mailto:admin@example.com").trim();`
- Gdy brakuje kluczy: serwer loguje ostrzeżenie i endpoint triggera zwraca błąd konfiguracji (`500`).
- Zaostrzono CORS: domyślnie `ALLOWED_ORIGINS` wskazuje produkcyjny origin (`https://cutelittlegoat.github.io`), bez automatycznego otwarcia dla wszystkich originów przy pustej konfiguracji.
- Domyślny payload powiadomienia korzysta z absolutnych ścieżek:
  - `icon: /IkonaPowiadomien.png`
  - `badge: /IkonaPowiadomien.png`
  - `url: /Infoczytnik/Infoczytnik.html`

### 2) `config/web-push-config.js`
- Endpointy API push ustawiono jako pełne URL HTTPS:
  - `subscribeEndpoint: https://push.twojadomena.pl/api/push/subscribe`
  - `triggerEndpoint: https://push.twojadomena.pl/api/push/trigger`
- Dzięki temu konfiguracja działa z frontendem hostowanym na GitHub Pages i zewnętrznym backendem push.

### 3) `GM_test.html`
- Funkcja `triggerPushNotification()`:
  - rzuca błąd przy braku `triggerEndpoint`,
  - sprawdza `response.ok`,
  - przy błędzie pobiera `response.text()` i buduje komunikat diagnostyczny (`status + treść`).
- Payload triggera używa ścieżek absolutnych (`/IkonaPowiadomien.png`, `/Infoczytnik/Infoczytnik.html`) i przekazuje także `badge`.

### 4) `Infoczytnik_test.html`
- Zgodnie z zasadą wersjonowania testowych plików modułu, podniesiono `INF_VERSION` do `2026-03-13_11-12-40` (synchronizacja z `GM_test.html`).

## 19. Aktualizacja 2026-03-13 — Cloudflare Workers (PL)
### 19.1. `config/web-push-config.js`
Plik zawiera teraz finalną konfigurację produkcyjną Web Push dla frontendu:
- `vapidPublicKey` — publiczny klucz VAPID przekazywany do `pushManager.subscribe(...)`.
- `subscribeEndpoint` — pełny URL HTTPS do API zapisu subskrypcji na Cloudflare Workerze.
- `triggerEndpoint` — pełny URL HTTPS do API triggera wysyłki push.

### 19.2. `GM_test.html` — `triggerPushNotification()`
Funkcja została dostosowana do docelowego modelu autoryzacji backendu:
1. Odczytuje `triggerEndpoint` z `window.infWebPushConfig`.
2. Wysyła `POST` JSON na endpoint triggera.
3. Dodaje nagłówek `Authorization: Bearer ...` (token triggera).
4. Używa absolutnych ścieżek payloadu:
   - `icon: "/IkonaPowiadomien.png"`
   - `badge: "/IkonaPowiadomien.png"`
   - `url: "/Infoczytnik/Infoczytnik.html"`
5. Waliduje odpowiedź przez `response.ok`; przy błędzie odczytuje `response.text()` i rzuca wyjątek z pełnym komunikatem status + body.

### 19.3. Rejestracja subskrypcji push
Logika subskrypcji pozostaje oparta o konfigurację runtime z `window.infWebPushConfig`:
- `vapidPublicKey` z configu,
- `subscribeEndpoint` z configu,
- pełny komunikat błędu subskrypcji zawierający kod HTTP i body odpowiedzi backendu.

### 19.4. `service-worker.js`
- Podniesiono `SW_VERSION` z `wg-pwa-v2` do `wg-pwa-v3` w celu wymuszenia odświeżenia cache po publikacji.
- Fallbacki payloadu push pozostają absolutne (`/IkonaPowiadomien.png`, `/Infoczytnik/Infoczytnik.html`).
- `notificationclick` zachowuje sekwencję: exact URL → dowolne okno Infoczytnika → `clients.openWindow(...)`.

### 19.5. Usunięcie starego backendu Node
- Usunięto `Infoczytnik/backend/server.js`.
- Repo nie utrzymuje już lokalnej implementacji produkcyjnego API push (rolę tę pełni Cloudflare Worker).

## 19. Update 2026-03-13 — Cloudflare Workers (EN)
### 19.1. `config/web-push-config.js`
The file now contains final production Web Push config for the frontend:
- `vapidPublicKey` — public VAPID key used by `pushManager.subscribe(...)`.
- `subscribeEndpoint` — full HTTPS URL for subscription storage API on Cloudflare Worker.
- `triggerEndpoint` — full HTTPS URL for push trigger API.

### 19.2. `GM_test.html` — `triggerPushNotification()`
The function now follows the target backend authorization flow:
1. Reads `triggerEndpoint` from `window.infWebPushConfig`.
2. Sends JSON `POST` to the trigger endpoint.
3. Adds `Authorization: Bearer ...` header (trigger token).
4. Uses absolute payload paths:
   - `icon: "/IkonaPowiadomien.png"`
   - `badge: "/IkonaPowiadomien.png"`
   - `url: "/Infoczytnik/Infoczytnik.html"`
5. Validates `response.ok`; on failure reads `response.text()` and throws full status + body error message.

### 19.3. Push subscription storage
Subscription flow remains runtime-config based via `window.infWebPushConfig`:
- `vapidPublicKey` from config,
- `subscribeEndpoint` from config,
- detailed subscription error including HTTP status and backend response body.

### 19.4. `service-worker.js`
- `SW_VERSION` was bumped from `wg-pwa-v2` to `wg-pwa-v3` to force cache refresh after deployment.
- Push payload fallbacks remain absolute (`/IkonaPowiadomien.png`, `/Infoczytnik/Infoczytnik.html`).
- `notificationclick` keeps the sequence: exact URL → any Infoczytnik window → `clients.openWindow(...)`.

### 19.5. Legacy Node backend removal
- Removed `Infoczytnik/backend/server.js`.
- The repository no longer ships a local production push API implementation (Cloudflare Worker is now the production backend).

## 20. Aktualizacja 2026-03-28 — skala tła pergaminu (PL)
### 20.1. Zakres
Zmiana dotyczy wyłącznie `Infoczytnik_test.html` oraz synchronizacji wersji cache w `GM_test.html`.

### 20.2. Zmiana techniczna (`Infoczytnik_test.html`)
W mapie proporcji panelu (`LAYOUT_AR`) zmieniono wpis:
- było: `pergamin: 1`
- jest: `pergamin: 1280/1920`

To ustawienie jest używane przez funkcję `fitPanel(ar)`, która wylicza docelową szerokość/wysokość panelu względem viewportu. Dla layoutów `pismo_odreczne` i `pismo_ozdobne` aplikacja wymusza preset `pergamin`, więc ta korekta wpływa bezpośrednio na oba pergaminowe tła.

### 20.3. Dlaczego to naprawia problem
Pliki:
- `assets/layouts/Pismo_odreczne/Pergamin.jpg`
- `assets/layouts/Pismo_ozdobne/Pergamin.jpg`
mają rzeczywistą proporcję 1280×1920 (2:3), a nie 1:1. Przy wcześniejszym wymuszeniu kwadratu panel był wizualnie „za duży” i źle komponował się z obszarem roboczym na desktopie i mobile. Po ustawieniu 1280/1920 skala i kadrowanie są zgodne z naturalnymi proporcjami assetu.

### 20.4. Wersjonowanie testowych HTML
Zgodnie z zasadami modułu podniesiono `INF_VERSION` do `2026-03-28_17-50-25` w:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

## 20. Update 2026-03-28 — parchment background scale (EN)
### 20.1. Scope
The change affects only `Infoczytnik_test.html` and cache-version synchronization in `GM_test.html`.

### 20.2. Technical change (`Infoczytnik_test.html`)
In the panel aspect-ratio map (`LAYOUT_AR`), this entry was changed:
- before: `pergamin: 1`
- after: `pergamin: 1280/1920`

This value is consumed by `fitPanel(ar)`, which computes panel width/height relative to viewport. Layouts `pismo_odreczne` and `pismo_ozdobne` force the `pergamin` preset, so the change directly affects both parchment backgrounds.

### 20.3. Why this fixes it
The files:
- `assets/layouts/Pismo_odreczne/Pergamin.jpg`
- `assets/layouts/Pismo_ozdobne/Pergamin.jpg`
use a real 1280×1920 ratio (2:3), not 1:1. With a square panel, the background looked oversized and poorly matched on both desktop and mobile. After switching to 1280/1920, scaling and framing match the asset’s natural geometry.

### 20.4. Test HTML versioning
As required by module rules, `INF_VERSION` was bumped to `2026-03-28_17-50-25` in:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

# Detale layoutu i stylu — pełna dokumentacja modułów

Ten plik jest **głównym źródłem prawdy** dla całego projektu: zawiera komplet informacji o użytych fontach, kolorach, tłach, ramkach, cieniach, układach oraz wyjątkach formatowania we wszystkich modułach.

---

## Moduł — Main

### 1) Fonty i typografia
#### 1.1 Fonty lokalne (bez Google Fonts)
- Stos bazowy dla całego UI: **"Consolas", "Fira Code", "Source Code Pro", monospace** (ustawiony na `*`).

#### 1.2 Zasady użycia fontów
- Ten sam stos obowiązuje w całym module (brak innych fontów lokalnych lub zewnętrznych).
- Tekst tytułów i przycisków jest pogrubiony (`font-weight: 600`) i zachowuje terminalowy styl.
- Rozmiary:
  - przyciski: `font-size: 15px`.
  - teksty pomocnicze `.note`: `font-size: 13px`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (źródło prawdy)
- `--bg`: **radialne gradienty** + kolor bazowy `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000` (tło głównej karty).
- `--border`: `#16c60c` (ramki panelu i przycisków).
- `--text`: `#9cf09c` (kolor tekstu).
- `--accent`: `#16c60c`.
- `--accent-dark`: `#0d7a07`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Tła przycisków: `rgba(22, 198, 12, 0.08)` (normal), `rgba(22, 198, 12, 0.14)` (hover), `rgba(22, 198, 12, 0.22)` (active).
- Cień hover na przycisku: `0 0 18px rgba(22, 198, 12, 0.3)`.

### 3) Layout i elementy UI
- `body`: flex, centrowanie w pionie i poziomie, padding `24px`.
- `main`: karta o szerokości `min(860px, 100%)`, tło `--panel`, ramka `2px` `--border`, cień `--glow`, zaokrąglenia `--radius`, padding `32px 32px 28px`.
- `.actions`: grid z kolumnami `repeat(auto-fit, minmax(220px, 1fr))` i odstępem `18px 20px`.
- `.btn`: blokowy przycisk z animacją `transform` i `background` przy hover/active.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak funkcjonalności clamp w module Main.

### 5) Wyjątki i formatowanie specjalne
- Brak wyjątków kolorystycznych lub reguł specjalnych.

---

## Moduł — DataVault

> Moduł posiada osobny dokument **1:1**: `DataVault/docs/StylLayoutu.md`. Poniżej znajduje się pełne streszczenie wszystkich używanych fontów, kolorów i wyjątków (zgodne z tym dokumentem).

### 1) Fonty i typografia
#### 1.1 Fonty lokalne (bez Google Fonts)
- **Consolas**, **Fira Code**, **Source Code Pro** — stos bazowy.

#### 1.2 Zasady użycia fontów
- Tekst bazowy (`body`) i wszystkie nagłówki używają tego samego stosu.
- UI jest w większości **uppercase** z podbitym `letter-spacing`.
- Rozmiary:
  - tabele: `font-size: 13px`.
  - tagi cech: `font-size: 11px`.
  - opisy i hinty: `font-size: 11–12px`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (źródło prawdy)
- `--bg`: `#031605` (tło bazowe).
- `--bg-grad`: radialne gradienty + `#031605` (tło `body`):
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`, `--panel2`: `#000`.
- `--text`: `#9cf09c`.
- `--text2`: `#7ad87a`.
- `--muted`: `#4a8b4a`.
- `--code`: `#c9f7c9`.
- `--red`: `#d74b4b`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22, 198, 12, 0.35)`.
- `--b2`: `rgba(22, 198, 12, 0.2)`.
- `--div`: `rgba(22, 198, 12, 0.18)`.
- `--hbg`: `rgba(22, 198, 12, 0.06)`.
- `--zebra`: `rgba(22, 198, 12, 0.04)`.
- `--hover`: `rgba(22, 198, 12, 0.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- `rgba(207,245,220,.7)` — kolor `.sortMark` (znacznik sortowania).
- `rgba(207,245,220,.92)` — kolor treści `.popoverBody`.
- `rgba(0,0,0,.55)` — tło overlay w modalach.
- `#E6B35C` — kolor `.compareDiff` (wyróżnienia w porównaniach).

### 3) Wyjątki formatowania i specjalne reguły tekstu
- **Markery inline** w danych:
  - `{{RED}}...{{/RED}}` → czerwony tekst (`.inline-red`, `color: var(--red)`).
  - `{{B}}...{{/B}}` → pogrubienie (`.inline-bold`).
  - `{{I}}...{{/I}}` → kursywa (`.inline-italic`).
- **Czerwone słowa kluczowe** (`.keyword-red`) w określonych arkuszach/kolumnach.
- **Wyjątki na przecinki**: w kolumnie `Słowa Kluczowe` przecinki w wybranych arkuszach są neutralne (`.keyword-comma` w kolorze `var(--text)`).
- **Referencje do stron**: fragmenty `(str.)`, `(str)`, `(strona)` oznaczane jako `.ref` z kolorem `var(--code)`.
- **Linie `*[n]`** → `.caretref` z jaśniejszym kolorem.
- **Kolumna `Zasięg`**: separator `/` wyróżniony klasą `.slash` w kolorze `var(--code)`.

### 4) Zwijanie/rozwijanie > 9 linii
- **Detekcja wstępna**: jeśli dane mają > 10 linii (`\n`), komórka staje się clampowalna.
- **Clamp wizualny**: po renderze `ResizeObserver` sprawdza liczbę linii; jeśli > 9:
  - `max-height = lineHeight * 9`, `overflow: hidden`.
  - dodawany hint `.clampHint` z tekstem „Kliknij aby rozwinąć” / „Kliknij aby zwinąć”.
- Stan przechowywany per `sheet|rowid|col`.

### 5) Layout i wymagania szerokości kolumn
- Layout oparty o grid (`main`): `360px` panel filtrów + `1fr` workspace.
- Sticky nagłówki tabel.
- Wszystkie min-width kolumn zdefiniowane w `style.css` (szczegółowo w `DataVault/docs/StylLayoutu.md`).

---

## Moduł — GeneratorNPC

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- UI główne: **"Consolas", "Fira Code", "Source Code Pro", monospace**.
- Karta eksportowana/drukowana (HTML generowany w JS): **"Times New Roman", "Liberation Serif", serif**.

#### 1.2 Zasady użycia fontów
- Interfejs: uppercase + `letter-spacing` (nagłówki, przyciski, taby, labelki).
- Karta eksportowana: klasyczny układ papierowy, nagłówki uppercase i pogrubione.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (UI główne)
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`, `--panel2`: `#000`.
- `--text`: `#9cf09c`.
- `--text2`: `#7ad87a`.
- `--muted`: `#4a8b4a`.
- `--code`: `#c9f7c9`.
- `--red`: `#d74b4b`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22, 198, 12, 0.35)`.
- `--b2`: `rgba(22, 198, 12, 0.2)`.
- `--div`: `rgba(22, 198, 12, 0.18)`.
- `--hbg`: `rgba(22, 198, 12, 0.06)`.
- `--zebra`: `rgba(22, 198, 12, 0.04)`.
- `--hover`: `rgba(22, 198, 12, 0.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.
- Dodatkowe tła w panelach/sekcjach: `rgba(22, 198, 12, 0.03)`, `rgba(22, 198, 12, 0.04)`, `rgba(22, 198, 12, 0.05)`, `rgba(22, 198, 12, 0.06)`, `rgba(22, 198, 12, 0.08)`, `rgba(22, 198, 12, 0.14)`, `rgba(22, 198, 12, 0.18)`.
- Akcenty UI w module: `rgba(111, 227, 140, 0.06)` i `rgba(111, 227, 140, 0.1)` (specjalne tła w sekcjach).

#### 2.2 Kolory karty eksportowanej (print HTML)
- Tło `body`: `#fff`.
- Tekst bazowy: `#111`.
- Nagłówki i belki: `#2c2c2c` (tło), `#fff` (tekst).
- Linie/ramki: `#111`.
- Pasy wierszy: `#f1f1f1` (nagłówki), `#e9e9e9` (naprzemienne wpisy), `#d0d0d0` (separatory wpisów).

### 3) Wyjątki formatowania i specjalne reguły tekstu
- **Markery inline** w danych:
  - `{{RED}}...{{/RED}}` → `.inline-red` (czerwony tekst, UI główne: `var(--red)`, karta: `#111`).
  - `{{B}}...{{/B}}` → `.inline-bold`.
  - `{{I}}...{{/I}}` → `.inline-italic`.
- **Słowa kluczowe** (`.keyword-red`) — kolumny z `Słowa Kluczowe` są na czerwono.
- **Wyjątki na przecinki**: w arkuszach `Bestiariusz`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie` przecinki w kolumnie `Słowa Kluczowe` dostają klasę `.keyword-comma` z kolorem bazowym.
- **`*[n]` na początku linii** → `.caretref` (jasny kolor).
- **`Zasięg`**: separator `/` wyróżniony `.slash`.
- **Referencje do stron** (`str`, `str.`, `strona`) → `.ref` (podkreślenie i jaśniejszy kolor).

### 4) Zwijanie/rozwijanie > 9 linii
- Stała `CLAMP_LINES = 9`.
- Komórki z > 10 liniami danych stają się kandydatami do clampa.
- `ResizeObserver` mierzy `scrollHeight / lineHeight`:
  - jeśli > 9 → `.is-clampable`, `max-height = lineHeight * 9`, `overflow: hidden`.
  - hint `.clamp-hint`: „Kliknij aby rozwinąć” / „Kliknij aby zwinąć”.
- Stan ekspansji zapisany w `state.expandedCells` dla klucza `sheet|rowId|col`.

### 5) Layout i elementy UI
- Górny pasek (`.topbar`) sticky, panele boczne i workspace w układzie `grid` (`360px` + `1fr`).
- Panele z `box-shadow: var(--glow)` i `border: 1px solid var(--div)`.
- Tabele: zebra i hover oparte o `--zebra` i `--hover`.

---

## Moduł — Kalkulator

Moduł składa się z trzech stron:
- `index.html` (landing),
- `KalkulatorXP.html` (kalkulator XP),
- `TworzeniePostaci.html` (generator postaci).  
Wspólny styl bazowy pochodzi z `kalkulatorxp.css`, a dodatkowe style inline są w `index.html` i `TworzeniePostaci.html`.

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- **"Consolas", "Fira Code", "Source Code Pro", monospace** — cały UI.

#### 1.2 Zasady użycia fontów
- Uppercase + `letter-spacing` w nagłówkach, panelach, tabach.
- `title` i `panelHeader` wyróżnione `text-shadow: var(--glowH)`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (kalkulatorxp.css)
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`, `--panel2`: `#000`.
- `--text`: `#9cf09c`.
- `--text2`: `#7ad87a`.
- `--muted`: `#4a8b4a`.
- `--code`: `#c9f7c9`.
- `--red`: `#d74b4b`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22,198,12,.35)`.
- `--b2`: `rgba(22,198,12,.2)`.
- `--div`: `rgba(22,198,12,.18)`.
- `--hbg`: `rgba(22,198,12,.06)`.
- `--zebra`: `rgba(22,198,12,.04)`.
- `--hover`: `rgba(22,198,12,.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Tła kart, nagłówków i tabów: `rgba(22,198,12,.03)`, `rgba(22,198,12,.04)`, `rgba(22,198,12,.05)`, `rgba(22,198,12,.06)`, `rgba(22,198,12,.08)`, `rgba(22,198,12,.10)`, `rgba(22,198,12,.12)`.
- Cienie i obrysy focus: `rgba(22,198,12,.18)`.
- Kolor wskaźnika `.caret`: `rgba(22,198,12,.65)`.
- Hover w przyciskach landing page: `rgba(22, 198, 12, 0.14)` oraz `rgba(22, 198, 12, 0.22)`.
- Cień hover: `0 0 18px rgba(22, 198, 12, 0.3)`.

### 3) Layout i elementy UI
- `index.html`: identyczny layout jak Main (karta centralna, grid przycisków).
- `KalkulatorXP.html`:
  - `.main`: grid `360px` + `1fr`.
  - `.panel`, `.workspace`: ramki `1px solid var(--b)` + `box-shadow` z inset.
  - `.dataTable`: `font-size: 13px`, zebra i hover z `--zebra`/`--hover`.
- `TworzeniePostaci.html`:
  - `.wrapper`: max szerokość `1100px`, panel z `border-radius: 10px`.
  - `.table`: gradient w nagłówkach i zebra w wierszach.
  - `textarea` bez możliwości zmiany rozmiaru (`resize: none`).

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module Kalkulator.

### 5) Wyjątki i formatowanie specjalne
- `.error-message` w `TworzeniePostaci.html` używa koloru `var(--red)`.

---

## Moduł — DiceRoller

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- Stos bazowy: **"Consolas", "Fira Code", "Source Code Pro", monospace**.

#### 1.2 Zasady użycia fontów
- Nagłówek `h1`: `font-size: 30px`, uppercase, `letter-spacing: 0.05em`.
- Podtytuł i podsumowania używają przygaszonego koloru `--muted`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS
- `--bg`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000`.
- `--border`: `#16c60c`.
- `--text`: `#9cf09c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--muted`: `rgba(156, 240, 156, 0.7)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.
- Kolory kości:
  - `--white-die`: `#f6f6f6`, `--white-pip`: `#111111`.
  - `--red-die`: `#c01717`, `--red-pip`: `#ffffff`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Cienie kości: `rgba(0, 0, 0, 0.2)` i `rgba(0, 0, 0, 0.35)`.
- Obramowania kości: `#1c1c1c` (białe kości), `#650909` (czerwone kości).
- Fokus inputów: `box-shadow: 0 0 0 2px rgba(22, 198, 12, 0.25)`.
- Podsumowanie `.summary`: tło `rgba(22, 198, 12, 0.08)`, ramka `rgba(22, 198, 12, 0.4)`.
- Hover/active przycisku: `rgba(22, 198, 12, 0.14)` / `rgba(22, 198, 12, 0.22)`.

### 3) Layout i elementy UI
- Aplikacja centrowana jak w Main (`body` flex + padding `24px`).
- `.panel`: grid z `repeat(auto-fit, minmax(220px, 1fr))`.
- Kości: kwadraty `68px` (mobile `58px`), animacja `@keyframes roll`.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module DiceRoller.

### 5) Wyjątki i formatowanie specjalne
- Brak wyjątków tekstowych; specjalne style dotyczą tylko kości i wyników.

---

## Moduł — Audio

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- **"Consolas", "Fira Code", "Source Code Pro", monospace**.

#### 1.2 Zasady użycia fontów
- Tytuł `.title`: uppercase, `letter-spacing: 0.08em`, `font-size: clamp(22px, 3vw, 28px)`.
- Podtytuł `.subtitle`: `font-size: 15px`, `opacity: 0.9`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (identyczne jak w Main)
- `--bg`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000`.
- `--border`: `#16c60c`.
- `--text`: `#9cf09c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.

### 3) Layout i elementy UI
- Układ karty identyczny jak Main (`width: min(860px, 100%)`, centrowanie, box-shadow `--glow`).

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module Audio.

### 5) Wyjątki i formatowanie specjalne
- Brak.

---

## Moduł — Infoczytnik

Moduł składa się z dwóch stron:
- **Infoczytnik.html** — ekran graczy (Data-Slate),
- **GM.html** — panel prowadzącego.

### 1) Fonty i typografia
#### 1.1 Fonty zewnętrzne (Google Fonts)
Załadowane fonty (używane zależnie od frakcji):
- Share Tech Mono
- Cinzel (400/700)
- Rajdhani (400/600)
- Black Ops One
- Staatliches
- Orbitron (400/700)
- Questrial
- Russo One

#### 1.2 Fonty lokalne i fallbacki
- Domyślny stos: **Calibri, Arial, sans-serif** (`--font`).
- Fallback w panelu GM: **Arial, sans-serif**.
- Teksty techniczne i podgląd: **Consolas, "Courier New", monospace**.

#### 1.3 Zasady użycia fontów
- `Infoczytnik.html`: rozmiary dynamiczne przez `clamp(...)`:
  - `--msg-font-size: clamp(18px, 3.4vw, 32px)`.
  - `--prefix-font-size: clamp(12px, 2.0vw, 16px)`.
  - `--suffix-font-size: clamp(12px, 2.0vw, 16px)`.
  - `--filler-gap: clamp(12px, 2vw, 18px)`.
- `GM.html`: UI panelowy, nagłówki `font-size: 20px`, labelki `font-size: 13px`, podglądy `font-size: 12–16px`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Infoczytnik.html (ekran graczy)
- Akcent bazowy: `--accent = #00ff66`.
- Tło globalne i panelu: `#000`.
- Tekst prefix/suffix: `rgba(255,255,255,.88)` i `rgba(255,255,255,.86)`.
- Overlay CRT:
  - linie skanowania: `rgba(255,255,255,.06)` + przezroczystości `rgba(0,0,0,0)`.
  - vignette: `rgba(0,0,0,.70)` i `rgba(255,255,255,.04)`.
  - tło odblokowania dźwięku: `rgba(0,0,0,.88)`.
- Cienie tekstu: `0 2px 6px rgba(0,0,0,.70)` oraz zielony glow `0 0 18px rgba(0,255,120,.18)`.
- Logo: `filter: drop-shadow(0 2px 6px rgba(0,0,0,.7))`.

#### 2.2 GM.html (panel prowadzącego)
- Zmienne: `--text: #eaeaea`, `--muted: #bdbdbd`, `--accent: #ffd27a`, `--border: #2a2a2a`, `--panel: rgba(18,18,18,.92)`.
- Tło strony: `linear-gradient(180deg, #070707, #0f0f0f)`.
- Przycisk podstawowy: `linear-gradient(180deg, #3a2a12, #1c1408)` + ramka `rgba(255,210,122,.35)`.
- Przycisk ostrzegawczy: `linear-gradient(180deg, #1c0c0c, #120606)` + ramka `rgba(255,120,120,.25)`, tekst `#ffb3b3`.
- Pola input: tło `#0f0f0f`.
- Podglądy i chipy: `#cfcfcf`, `#ddd`, `rgba(255,255,255,.08)`, `rgba(255,255,255,.14)`, `rgba(255,255,255,.18)`.
- Dodatkowe kolory w UI GM:
  - `#1d1d1d` (przyciski), `#777` (miniLabel), `rgba(0,0,0,.18/.25/.35)` (panele i podglądy).
  - Kolory szybkich chipów i pickerów: `#00ff66`, `#ff3333`, `#d4af37`, `#ffffff`.

### 3) Layout i elementy UI
- Ekran graczy:
  - `layout-img` to **PNG** z `assets/layouts/<frakcja>/`.
  - `screen` ma pozycję i padding sterowane zmiennymi `--screen-*` oraz `clamp(14px, 2.4vw, 24px)`.
  - CRT overlay (`.crt::before` i `.crt::after`) generuje efekt skanowania i vignette.
- Panel GM:
  - `.wrap` max `980px`, karta `.card` z cieniem `0 10px 30px rgba(0,0,0,.35)`.
  - Układ kolumn przez `.row` i `.col` (flex + wrap).

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w Infoczytniku.

### 5) Wyjątki i formatowanie specjalne
- Brak wyjątków formatowania tekstu (poza dynamicznym doborem fontów i kolorów przez GM).
- Kolor treści, prefixu i suffixu może być zmieniany przez GM (w tym wartości typu `#RRGGBB` i `rgba(...)`).

---

## Uwaga końcowa
Każda modyfikacja stylu w dowolnym module **musi** być odzwierciedlona w tym pliku, aby zachować spójne, kompletne źródło prawdy dla stylów całej aplikacji.

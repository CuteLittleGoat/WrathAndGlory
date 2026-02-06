# Generator Nazw — dokumentacja techniczna (1:1)

Dokument opisuje **struktury HTML**, **style CSS**, **logikę JS**, oraz dane wejściowe generatora.  
Celem jest umożliwienie odtworzenia modułu 1:1 bez dostępu do kodu.

---

## 1) Pliki modułu

- `index.html` — struktura UI i kontener na wyniki.
- `style.css` — pełny wygląd (kolory, fonty, layout, stany interakcji).
- `script.js` — logika losowania, RNG, generatory nazw, obsługa UI.
- `docs/Logika.md` — opis segmentów słowotwórczych i reguł składania nazw.
- `Szablon.html` — plik usunięty jako nieużywany (nie występuje już w module).

---

## 2) Struktura HTML (`index.html`)

### 2.1 `<head>`
- `charset="utf-8"` i `viewport` z `width=device-width, initial-scale=1`.
- `<title>` ustawiony na `Generator Nazw` (tytuł karty przeglądarki).
- Dołączony arkusz `style.css`.

### 2.2 `<body>` i główny układ
- Główny kontener: `<main class="wrap">`.
- Wewnątrz **jedna karta** (`<section class="panel">`) z:
  - przełącznikiem języka (`<div class="language-switcher">` + `<select id="languageSelect">`),
  - siatką pól wejściowych,
  - przyciskami akcji i statusem trybu losowania,
  - separatorem,
  - polem wyników,
  - tekstem podpowiedzi.

### 2.3 Pola wejściowe (siatka `.grid`)
Każde pole to:
```html
<div class="field">
  <label>...</label>
  <select|input ...></select|input>
</div>
```
Pola w kolejności:
1. **Kategoria** — `<select id="cat">`.
2. **Opcja** — `<select id="opt">`.
3. **Seed** — `<input id="seed" placeholder="wpis cokolwiek">`.
4. **Ile** — `<input id="count" type="number" min="1" max="20" value="10">`.

### 2.4 Akcje i status
- Przyciski:
  - `#gen` — „Generuj”.
  - `#copy` — „Kopiuj wynik”.
- `#modePill` — pill z informacją o trybie losowania (np. `Losowo: TAK` lub `Losowo: SEED`).

### 2.5 Wyniki
- `.results#res` — blok tekstowy z wynikami.
- Wyniki są renderowane jako lista wierszy z prefiksem `•`.

### 2.6 Tekst pomocniczy
- `.hint` — krótka notatka wyjaśniająca znaczenie seed.

---

## 3) Style i wygląd (`style.css`)

### 3.1 Fonty
- Globalny font stack ustawiony na `*`:
  - `"Consolas", "Fira Code", "Source Code Pro", monospace`.

### 3.2 Zmienne CSS (paleta)
W `:root`:
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + tło bazowe `#031605`.
- `--panel`: `#000`.
- `--panel-soft`: `rgba(22, 198, 12, 0.06)`.
- `--text`: `#9cf09c`.
- `--muted`: `#4a8b4a`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`.
- `--accent-dark`: `#0d7a07`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--divider`: `rgba(22, 198, 12, 0.18)`.

### 3.3 Tło strony
- `body`: tło `--bg-grad`, kolor tekstu `--text`, `min-height: 100vh`.
- Lekko zwiększona czytelność przez `line-height: 1.45` i `letter-spacing: 0.02em`.

### 3.4 Główny kontener
- `.wrap`:
  - szerokość `min(1100px, 100%)`,
  - wyśrodkowanie, `padding: 28px 20px 40px`.

### 3.5 Panel
- `.panel`: czarne tło `--panel`, zielona ramka `2px solid --border`,
  zaokrąglenia `12px`, `box-shadow: --glow`, `padding: 16px`.

### 3.6 Pola i etykiety
- `.field`: `flex` kolumnowy z `gap: 6px`.
- `label`: `font-size: 12px`, kolor `--muted`.

### 3.7 Inputy i selecty
- `input`, `button`:
  - tło `--panel-soft`,
  - ramka `1px solid --border`,
  - `border-radius: 10px`,
  - `padding: 10px 12px`.
- `select`:
  - tło **ciemne** `--panel` (takie jak w przełączniku językowym modułu Kalkulator),
  - te same ramki i rozmiary.
- `select option`: tło `--panel`, tekst `--text`.
- Focus:
  - `border-color: --accent-dark`,
  - `box-shadow: 0 0 0 2px rgba(22, 198, 12, 0.2)`.

### 3.8 Układ siatki
- `.grid`: `display: grid` i `grid-template-columns: 1.2fr 1fr 1fr 140px`.
- `gap: 12px`.
- Media query `@media (max-width: 960px)`: jedna kolumna.

### 3.9 Przyciski
- `.btn`:
  - `max-width: 220px`,
  - tło `rgba(22, 198, 12, 0.08)`,
  - `font-weight: 600`.
- Hover: delikatne podbicie (`transform: translateY(-1px)` + mocniejszy `box-shadow`).
- Active: ciemniejsze tło i brak przesunięcia.

### 3.10 Pill i output
- `.pill`: tekst `--muted`, tło `rgba(0,0,0,0.35)`, obwódka `--border`,
  `border-radius: 999px`, `font-size: 12px`.
- `.output`: oddzielny panel z `border: 1px solid --divider` i bez dodatkowego glow.
- `.results`: `white-space: pre-wrap`, `line-height: 1.55`, `font-size: 15px`.

### 3.11 Inne elementy
- `.divider`: linia `1px` z `--divider`.
- `.hint`: `font-size: 12px`, kolor `--muted`.

---

## 4) Logika JS (`script.js`)

### 4.1 RNG i powtarzalność
- `xfnv1a(str)` — haszuje seed do liczby 32‑bitowej.
- `mulberry32(a)` — deterministyczny RNG oparty o seed.
- `cryptoRand()` — losowość oparta o `crypto.getRandomValues`.
- `makeRng(seedStr)` — zwraca `{ rand, mode }`, gdzie:
  - `mode = "seed"` jeśli seed niepusty,
  - `mode = "auto"` jeśli seed pusty (losowość przeglądarki).

### 4.2 Pomocnicze narzędzia
- `pick(arr, rand)` — losowy element z tablicy.
- `chance(p, rand)` — prawdopodobieństwo `p`.
- `cap(s)` — kapitalizacja pierwszej litery.
- `cleanName(s)` — sanitizacja:
  - usuwa cudzysłowy,
  - usuwa treść w nawiasach,
  - redukuje podwójne spacje,
  - `trim()`.

### 4.3 Dane i segmenty
- Dane bazowe zapisane jako obiekty (`HUMAN`, `ASTARTES`, `MECH`, `AELDARI`, `NECRON`, `ORK`, `CHAOS`, `WAR`, `SHIP`).
- Szczegółowa lista segmentów i reguł znajduje się w `docs/Logika.md`.

### 4.4 Generatory nazw
Każda funkcja generatora:
- pobiera `rand`,
- buduje nazwę z segmentów,
- wywołuje `cleanName()` przed zwróceniem wyniku.

**Lista generatorów:**
- `genHumanUpper`, `genHumanLower`
- `genAstartes`
- `genAdMechTech`, `genAdMechSkit`
- `genAeldariCraft`, `genAeldariDrukhari`, `genAeldariHarlequin`
- `genNecronCommon`, `genNecronLord`
- `genOrk`
- `genSororitas`
- `genChaos(sub)` — zależny od podtypu (`undiv`, `khorne`, `nurgle`, `tzeent`, `slaan`).
- `genWarMachine(kind)` — `tank`, `titan`, `knight`, `air`.
- `genShip(faction)` — `imperial`, `chaos`, `eldar`, `drukhari`, `necron`, `ork`, `astartes`, `mechanicus`.

### 4.5 Definicje UI (`DATA`)
- `DATA` to tablica kategorii. Każda ma:
  - `key`, `name`, `options`.
- `options` zawiera `key`, `name`, `gen` (funkcja generująca).

### 4.6 Renderowanie i interakcje
- `populateCats()` — wypełnia `#cat` kategoriami.
- `populateOpts()` — wypełnia `#opt` opcjami zależnymi od kategorii.
- `generate()`:
  1. Pobiera kategorię i opcję.
  2. Tworzy RNG z seedem lub `cryptoRand`.
  3. Ustawia pill (`Losowo: SEED` / `Losowo: TAK`).
  4. Waliduje liczbę wyników (1–20).
  5. Generuje listę z prefiksem `•` i wrzuca do `#res`.

### 4.6.1 Lokalizacja UI
- Obiekt `translations` zawiera teksty dla `pl` i `en`, zgrupowane w `labels`.
- `applyLanguage(lang)`:
  - ustawia `document.documentElement.lang`,
  - uzupełnia etykiety, przyciski, podpowiedzi i placeholdery,
  - przełącza tekst pilla losowości oraz komunikatów kopiowania.
- `#languageSelect` domyślnie ustawiony na `pl` i uruchamia `applyLanguage()` przy zmianie.

### 4.7 Obsługa przycisków
- `#gen` → `generate()`.
- `#copy`:
  - kopiuje wyniki do schowka,
  - chwilowo dodaje adnotację `| skopiowano` do pilla,
  - fallback: `alert()` jeśli clipboard jest zablokowany.

### 4.8 Zdarzenia selectów
- Zmiana `#cat` → aktualizacja opcji i automatyczne generowanie.
- Zmiana `#opt` → automatyczne generowanie.

---

## 5) Zachowanie i ograniczenia

- Maksymalna liczba wyników: **20**.
- Seed jest dowolnym tekstem — stabilizuje RNG.
- Generator nie dodaje tytułów, honorificów ani sufiksów poza listami segmentów.

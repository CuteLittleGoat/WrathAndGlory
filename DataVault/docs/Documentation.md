# Administratum Data Vault — dokumentacja techniczna (super dokładna)

Dokument opisuje **mechanizmy aplikacji i wygląd 1:1**, tak aby ktoś mógł odtworzyć identyczne zachowanie w innej implementacji. Aplikacja to statyczny frontend (HTML/CSS/JS) pracujący na `data.json`, z opcjonalnym generowaniem danych z `Repozytorium.xlsx`.

---

## 1) Struktura projektu i pliki

- `index.html` — szkielet UI: pasek górny, panel filtrów, obszar tabeli, popover, modal porównania, kontener menu filtrów, skrypt `app.js` i style `style.css`.
- `style.css` — pełne style (kolory, fonty, layout, tabela, popover, modal, menu filtrów listowych).
- `app.js` — cała logika: wczytywanie danych, normalizacja, filtrowanie, sortowanie, renderowanie, porównywanie i admin-update.
- `data.json` — produkcyjne źródło danych.
- `Repozytorium.xlsx` — źródło prawdy (XLSX), z którego generuje się `data.json`.
- `build_json.py` — skrypt CLI generujący `data.json` z XLSX (alternatywa dla admin update w przeglądarce).
- `DetaleLayout.md` (w katalogu głównym repozytorium) — główny dokument opisujący fonty, kolory, wyjątki formatowania, clamp i szerokości kolumn 1:1.

---

## 2) HTML: układ i elementy (index.html)

### 2.1 Nagłówek i akcje
- Główny kontener aplikacji: `.app` (flex kolumnowy).
- Górny pasek: `.topbar`.
- Branding:
  - `.sigil` — znak ⟦⟧ w kwadracie.
  - `.title` — „ADMINISTRATUM DATA VAULT”.
- Akcje (przyciski):
  - `#btnUpdateData` w grupie `#updateDataGroup`.
  - `#btnReset` — reset widoku.
  - `#btnCompare` — porównanie zaznaczonych wierszy.

**Ważne:** `#updateDataGroup` jest ukrywany w trybie gracza (JS ustawia `display:none`).

### 2.2 Panel filtrów
- `aside.panel` z nagłówkiem `.panelHeader`.
- Pole globalne: `#globalSearch` w `.panelBody`.
- W `.hint` jest statyczna lista wskazówek (tekst, nie logika), m.in. linia o „Shift = sort wielokolumnowy”, mimo że logika multi-sortu nie istnieje w JS.

### 2.3 Obszar tabeli
- Zakładki: `#tabs` (przyciski `.tab` generowane w JS).
- `#tableWrap` — kontener na tabelę.

### 2.4 Popover i modal
- Popover: `#popover` z `#popoverTitle`, `#popoverBody`, `#popoverClose`.
- Modal porównania: `#modal` z `#modalBody`, `#modalClose`.

### 2.5 Menu filtra listowego
- Kontener: `#filterMenu` (JS tworzy zawartość przy otwarciu filtra listowego).

### 2.6 Skrypty i fonty
- Fonty: lokalny stos konsolowy (bez Google Fonts):
  - `Consolas`, `Fira Code`, `Source Code Pro`, `monospace`.
- Script `app.js` wczytywany na końcu dokumentu.
- Script CDN dla `xlsx.full.min.js` (`0.19.3`) jest dołączony w HTML.
  - Jeśli z jakiegoś powodu go brak, `app.js` doładowuje XLSX w wersji `0.18.5` (patrz `ensureSheetJS`).

---

## 3) CSS: typografia, kolory, layout, komponenty

### 3.1 Fonty
- Cały interfejs używa jednego stosu fontów (ustawionego globalnie na `*`):
  - `"Consolas", "Fira Code", "Source Code Pro", monospace`.
- Zmienna `--head` powiela ten sam stos i jest używana w tytułach menu filtrów.

### 3.2 Paleta kolorów (CSS variables)
- `--bg`: `#031605`
- `--bg-grad`: radialne gradienty + `#031605`
- `--panel`: `#000`
- `--panel2`: `#000`
- `--text`: `#9cf09c`
- `--text2`: `#4FAF4F`
- `--muted`: `#4a8b4a`
- `--code`: `#D2FAD2`
- `--red`: `#d74b4b`
- `--border`: `#16c60c`
- `--accent`: `#16c60c`
- `--accent-dark`: `#0d7a07`

Efekty i obwódki:
-- `--b: rgba(22,198,12,.35)`
-- `--b2: rgba(22,198,12,.2)`
-- `--div: rgba(22,198,12,.18)`
-- `--hbg: rgba(22,198,12,.06)`
-- `--zebra: rgba(22,198,12,.04)`
-- `--hover: rgba(22,198,12,.08)`
-- `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
-- `--glowH: 0 0 18px rgba(22, 198, 12, 0.35)`

### 3.3 Layout główny
- `.app` — flex, min-height 100%.
- `.topbar` — górny pasek z gradientem, borderem i flex-wrap.
- `.main` — układ grid: **360px** panel + reszta workspace.
  - Media query `@media (max-width: 980px)` przełącza na jedną kolumnę.

### 3.4 Przyciski i pola
- `.btn` (podstawowy), `.btn.primary`, `.btn.secondary`.
- `.input` — styl pól tekstowych (tło `--bg`, focus glow).

### 3.5 Zakładki
- `.tabs` — flex z zawijaniem.
- `.tab` — uppercase i ten sam font co reszta UI, aktywna z innym tłem i borderem.

### 3.6 Tabela
- `.tableWrap`, `.tableFrame`, `.tableViewport` — kontenery dla tabeli.
- `.dataTable` — `border-collapse`, `box-shadow`, sticky headers.
- Nagłówki:
  - `thead th` — sticky, uppercase, background gradient.
  - Drugi wiersz nagłówka (`tr:nth-child(2)`) ma niższe tło i `top: var(--header-row-height)`.
- Zebra rows: `tbody tr:nth-child(even)`.
- Hover: `tbody tr:hover`.

### 3.7 Tag cechy
- `.tag` — kapsułka z borderem, uppercase, hover.

### 3.8 Popover
- `.popover`, `.popoverHeader`, `.popoverTitle`, `.popoverBody`.
- Wersja aktywna: `[aria-hidden="false"]`.

### 3.9 Modal porównania
- `.modal`, `.modalCard`, `.modalHeader`, `.modalBody`.
- Porównanie wykorzystuje tabelę w HTML generowaną przez JS (w kodzie bez klasy `.compareTable`, ale struktura `<table>` i `<thead>` jest generowana inline).

### 3.10 Menu filtra listowego
- `.filterMenu` — fixed, z max-height, scroll i shadow.
- `.fmTitle`, `.fmSearch`, `.fmActions`, `.fmList`, `.fmItem`.

### 3.11 Formatowanie inline
- `.inline-red`, `.keyword-red`, `.keyword-comma`, `.inline-bold`, `.inline-italic`.
- `.ref`, `.caretref` — jaśniejszy kolor dla referencji.
- `.slash` — separator zasięgu.

### 3.12 Clamp i treść komórek
- `.celltext` — `white-space: pre-wrap` i standardowe łamanie.
- `.clampable` — zmienia kursor.
- `.clampHint` — hint z kolorem `--text2`.

### 3.13 Szerokości kolumn (min-width)
Kolumny ustawiane 1:1 według selektorów `table[data-sheet=...]`:

- **Bestiariusz**
  - `Nazwa`: 26ch
  - `Zagrożenie`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`: 3ch
  - `Odporność (w tym WP)`: 3ch
  - `Wartość Pancerza`: 3ch
  - `Obrona`: 3ch
  - `Żywotność`: 3ch
  - `Odporność Psychiczna`: 3ch
  - `Umiejętności`: 28ch
  - `Premie`: 60ch
  - `Zdolności`: 60ch
  - `Atak`: 50ch
  - `Zdolności Hordy`: 60ch
  - `Opcje Hordy`: 60ch
  - `Upór`: 3ch
  - `Odwaga`: 3ch
  - `Szybkość`: 3ch
  - `Rozmiar`: 7ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

- **Archetypy**
  - `Poziom`: 2ch
  - `Frakcja`: 26ch
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Atrybuty Archetypu`: 28ch
  - `Umiejętności Archetypu`: 28ch
  - `Zdolność Archetypu`: 46ch
  - `Ekwipunek`: 46ch
  - `Inne`: 10ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

- **Bonusy_Frakcji**
  - `Frakcja`: 26ch
  - `Premia 1`: 56ch
  - `Premia 2`: 56ch
  - `Premia 3`: 56ch

- **Cechy / Stany / Slowa_Kluczowe**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Opis`: 56ch

- **Talenty**
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `Wymagania`: 26ch
  - `Opis`: 26ch
  - `Efekt`: 56ch

- **Modlitwy**
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `Wymagania`: 26ch
  - `Efekt`: 56ch

- **Psionika**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `ST`: 10ch
  - `Aktywacja`: 10ch
  - `Czas Trwania`: 15ch
  - `Zasięg`: 8ch
  - `Wiele Celów`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Efekt`: 56ch
  - `Opis`: 26ch
  - `Wzmocnienie`: 26ch

- **Augumentacje / Ekwipunek**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Opis`: 56ch
  - `Efekt`: 26ch
  - `Koszt`: 3ch
  - `Dostępność`: 3ch
  - `Słowa Kluczowe`: 28ch
  - `Koszt IM`: 8ch

- **Pancerze**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `WP`: 4ch
  - `Cechy`: 32ch
  - `Koszt`: 4ch
  - `Dostępność`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Koszt IM`: 8ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

- **Bronie**
  - `Rodzaj`: 14ch
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Obrażenia`: auto (bez min-width)
  - `DK`: auto (bez min-width)
  - `PP`: auto (bez min-width)
  - `Zasięg`: 18ch (brak zawijania)
  - `Szybkostrzelność`: 8ch
  - `Cechy`: 32ch
  - `Koszt`: 4ch
  - `Dostępność`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Koszt IM`: 8ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

---

### 3.14 Wyrównanie treści w kolumnach
W `style.css` część kolumn z wartościami liczbowymi jest **wyrównana do środka** (`text-align: center`) zarówno w nagłówkach, jak i komórkach:

- **Bestiariusz**: `Zagrożenie`, `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`, `Odporność (w tym WP)`, `Wartość Pancerza`, `Obrona`, `Żywotność`, `Odporność Psychiczna`, `Upór`, `Odwaga`, `Szybkość`, `Rozmiar`, `Strona`.
- **Archetypy**: `Poziom`, `Koszt PD`, `Strona`.
- **Talenty**: `Koszt PD`.
- **Modlitwy**: `Koszt PD`.
- **Psionika**: `Koszt PD`, `ST`, `Zasięg`, `Wiele Celów`.
- **Augumentacje**: `Koszt`, `Dostępność`, `Koszt IM`.
- **Ekwipunek**: `Koszt`, `Dostępność`, `Koszt IM`.
- **Pancerze**: `WP`, `Koszt`, `Dostępność`, `Koszt IM`, `Strona`.
- **Bronie**: `Obrażenia`, `DK`, `PP`, `Zasięg`, `Szybkostrzelność`, `Koszt`, `Dostępność`, `Koszt IM`, `Strona`.

Dodatkowo kolumna `Zasięg` w **Broniach** ma `white-space: nowrap`, aby nie łamać zapisu z ukośnikami.

## 4) JS: stałe, stan aplikacji i helpery

### 4.1 Stałe
- `SHEETS_ORDER` — kolejność zakładek (np. Bestiariusz, Archetypy...).
- `SHEET_COLUMN_ORDER` — preferowana kolejność kolumn per arkusz.
  - Dla `Archetypy` kolejność to: `Poziom`, `Frakcja`, `Nazwa`, `Koszt PD`, `Słowa Kluczowe`, `Atrybuty Archetypu`, `Umiejętności Archetypu`, `Zdolność Archetypu`, `Ekwipunek`, `Inne`, `Podręcznik`, `Strona`.
  - Dla `Bonusy_Frakcji` kolejność to: `Frakcja`, `Premia 1`, `Premia 2`, `Premia 3`.
- `KEYWORD_SHEETS_COMMA_NEUTRAL` — arkusze, gdzie przecinki w „Słowa Kluczowe” są neutralne (kolor podstawowy).
- `KEYWORD_SHEET_ALL_RED` — arkusz `Slowa_Kluczowe`, gdzie kolumna `Nazwa` zawsze jest czerwona.
- `RENDER_CHUNK_SIZE = 80` — ile wierszy renderuje się w jednym kroku (progressive rendering).
- `ADMIN_MODE` — `?admin=1` w URL.

### 4.2 Elementy DOM (`els`)
Mapowanie na `getElementById`:
- `tabs`, `tableWrap`, `globalSearch`, `btnUpdateData`, `updateDataGroup`, `btnCompare`, `btnReset`.
- `popover`, `popoverTitle`, `popoverBody`, `popoverClose`.
- `modal`, `modalBody`, `modalClose`.
- `filterMenu`.

### 4.3 Stan `view`
- `sort` — `{col, dir, secondary?}` lub `null`, gdzie `secondary` to opcjonalny drugi klucz sortowania.
- `global` — tekst globalnego filtra.
- `filtersText` — per kolumna tekstowy filtr (substring).
- `filtersSet` — per kolumna Set wartości z menu listowego lub `null`.
- `selected` — `Set` zaznaczonych `__id` (porównanie).
- `expandedCells` — `Set` dla rozwiniętych komórek (key: `sheet|rowid|col`).

### 4.4 Helpery tekstowe
- `norm(s)` — normalizacja spacji i dwukropków.
- `escapeHtml(s)` — encje HTML.
- `stripMarkers(s)` — usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` z tekstu (używane w filtrze listowym).
- `setStatus(msg)` i `logLine(msg, isErr)` — logi (console).
- `canonKey(s)` — klucz kanoniczny: lowercase, normalizacja spacji, usuwa spację przed `(`.

---

## 5) JS: formatowanie treści

### 5.1 `formatInlineHTML(raw)`
- Wspiera markery: `{{RED}}`, `{{B}}`, `{{I}}` z zamknięciem `{{/RED}}`, `{{/B}}`, `{{/I}}`.
- Zawiera wykrywanie referencji w nawiasach z `str`, `str.`, `strona` → klasa `.ref`.
- Segmenty renderowane są do `<span>` z klasami:
  - `inline-red`, `inline-bold`, `inline-italic`.
- Referencje są nakładane nawet wewnątrz stylów.

### 5.2 `formatTextHTML(raw, opts)`
- Rozbija tekst na linie (`\n`).
- Rozpoznaje linie zaczynające się od `*[n]` → klasa `.caretref`.
- `opts.maxLines` — ograniczenie liczby linii.
- `opts.appendHint` — dopięcie tekstu hintu do końca (klasa `.clampHint`).

### 5.3 `formatRangeHTML(raw)`
- Rozdziela wartości `Zasięg` po `/`.
- Separator `/` renderowany jako `<span class="slash">/</span>`.

### 5.4 `formatKeywordHTML(row, col, opts)`
- Stosuje czerwony font (`.keyword-red`).
- Opcja `commasNeutral` zamienia przecinki na `<span class="keyword-comma">,</span>`.
- Pamięta cache w `row.__fmt` (per wariant).

### 5.5 `getFormattedCellHTML(row, col)`
- Cache HTML w `row.__fmt[col]`.
- Dla `Zasięg` używa `formatRangeHTML`, inaczej `formatTextHTML`.

---

## 6) JS: transformacje danych

### 6.1 `mergeTraits(row)`
- Łączy kolumny `Cecha 1..N` w jedną `Cechy` z separatorem `; `.
- Usuwa stare pola `Cecha N`.

### 6.2 `mergeRange(row)`
- Łączy `Zasięg 1..3` w `Zasięg` w formacie `v1 / v2 / v3`.
- Usuwa stare pola `Zasięg N`.

### 6.3 `stripPrivateFields(row)`
- Usuwa pola zaczynające się od `__` (poza `__id`).

### 6.4 `transformSheet(name, rows)`
- Dla `Bronie`: `mergeRange` + `mergeTraits`.
- Dla `Pancerze`: `mergeTraits`.
- Każdy rekord dostaje `__id` (`${name}:${idx+1}` jeśli brak).

### 6.5 `inferColumns(rows, sheetName)`
- Buduje listę kolumn z danych.
- Najpierw preferuje `SHEET_COLUMN_ORDER` dla arkusza.
- Resztę sortuje alfabetycznie (`pl`, `numeric: true`).

---

## 7) JS: ładowanie danych

### 7.1 `loadJsonFromRepo()`
- `fetch("data.json", {cache:"no-store"})`.
- `normaliseDB()` → `initUI()`.

### 7.2 `buildDataJsonFromSheets(rawSheets)`
- Buduje obiekt `sheets`.
- Generuje `_meta.traits` z arkusza `Cechy`.
- Generuje `_meta.states` z arkusza `Stany`.
- `Bronie` i `Pancerze` przechodzą transformacje (cechy, zasięg).

### 7.3 `ensureSheetJS(cb)`
- Jeśli `window.XLSX` nie istnieje, doładowuje SheetJS z CDN (`0.18.5`).

### 7.4 `downloadDataJson(data)`
- Generuje blob i wymusza pobranie `data.json`.

### 7.5 `loadXlsxFromRepo()`
- Pobiera `Repozytorium.xlsx` z `cache:"no-store"`.
- Czyta arkusze (`XLSX.utils.sheet_to_json` z `defval:""`).
- Buduje `data.json` i inicjalizuje UI.

### 7.6 `normaliseDB(data)`
- Ignoruje arkusze zaczynające się od `_`.
- Normalizuje rekordy, dodaje `__id`.
- Buduje `traitIndex` i `stateIndex` (klucze kanoniczne).

---

## 8) JS: inicjalizacja UI

### 8.1 `initUI()`
- Czyści `#tabs` i tworzy przyciski `.tab` wg `SHEETS_ORDER`.
- Ustawia aktywną pierwszą zakładkę.
- Ukrywa `#updateDataGroup`, gdy nie `ADMIN_MODE`.
- W trybie gracza usuwa z listy zakładek arkusz `Bestiariusz`, więc jest on widoczny tylko dla admina.

### 8.2 `selectSheet(name)`
- Ustawia `currentSheet`.
- Resetuje sortowanie i filtry; dla `Archetypy` ustawia domyślny sort `Poziom` (rosnąco) + `Frakcja` (alfabetycznie).
- Czyści zaznaczenia porównywarki.
- Buduje tabelę i renderuje wiersze.

### 8.3 `buildTableSkeleton()`
- Tworzy `<table>` z dwoma wierszami nagłówka:
  - wiersz 1: nazwy kolumn + `sortMark`.
  - wiersz 2: `input` filtrów + przycisk `▾` (filtr listowy).
- Dodaje kolumnę checkboxów `✓` na początku.
- Tooltip przycisku filtru listowego to „Filtr listy”.

---

## 9) JS: sortowanie

- `toggleSort(col)` — 3-stany: `asc` → `desc` → `null` i czyści ewentualny sort wtórny.
- `updateSortMarks()` — aktualizuje `▲`/`▼` w nagłówku (tylko dla sortu głównego).
- `sortRows(rows)`:
  - sortuje po `view.sort.col`, a gdy wartości są równe i istnieje `secondary`, stosuje drugi klucz sortowania,
  - jeśli obie wartości są liczbami (`numVal()`), sortuje numerycznie,
  - w innym przypadku `localeCompare("pl", numeric: true)`.

`numVal(x)` — wyciąga pierwszą liczbę z tekstu (regex `-?\d+(\.\d+)?`).

---

## 10) JS: filtrowanie

### 10.1 Globalne
- `view.global` z `#globalSearch`.
- Filtruje po concat wszystkich kolumn.

### 10.2 Per-kolumna (tekst)
- `view.filtersText[col]` ustawiane na `input` w nagłówku.

### 10.3 Filtr listowy
- `uniqueValuesForColumn(col)` — zbiór wartości, puste → `"-"`.
- `openFilterMenu(col, anchorBtn)`:
  - Buduje listę checkboxów i wyszukiwarkę.
  - Przyciski **Zaznacz wszystko** i **Wyczyść**.
  - Pozycjonuje menu obok przycisku `▾`.
  - Klik poza menu zamyka menu.
- Etykiety w menu są wyświetlane bez markerów `{{RED}}`, `{{B}}`, `{{I}}`, ale filtrowanie działa na surowych wartościach (nie zmienia logiki danych).
- `view.filtersSet[col] = null` oznacza brak filtra (wszystko zaznaczone).

### 10.4 `passesFilters(row, cols)`
- Łączy wszystkie filtry (globalny + tekstowy + listowy).
- Wiersz musi spełnić wszystkie aktywne warunki.

---

## 11) JS: renderowanie tabeli

### 11.1 Renderowanie progresywne
- `renderBody()` filtruje i sortuje dane, a następnie renderuje w chunkach (`RENDER_CHUNK_SIZE = 80`) z `requestAnimationFrame`.

### 11.2 `renderRow(r, cols)` — generowanie wiersza
- Kolumna 0: checkbox (zaznaczenia do porównywania).
- `Cechy` → `renderTraitsCell()` (tagi klikane).
- `Zasięg` → `getFormattedCellHTML`.
- Inne kolumny → `formatTextHTML` (z odpowiednim clampem, opis poniżej).

### 11.3 Renderowanie tagów cech
- `renderTraitsCell(v)` tworzy `.tag` dla każdej cechy (podział po `;`).
- Kliknięcie tagu otwiera popover z opisem cechy.

### 11.4 Clamp (rozwijanie długich komórek)
Mechanizm działa w dwóch etapach:

1. **Wstępne wykrycie** — jeśli liczba linii (po `\n`) przekracza 10, komórka jest traktowana jako potencjalnie clampowalna.
2. **Dokładny pomiar** — po renderze używany jest `ResizeObserver`:
   - Oblicza rzeczywistą liczbę linii: `scrollHeight / lineHeight`.
   - Jeśli > 9, komórka dostaje `clampable`, a zawartość jest ograniczona do `lineHeight * 9`.
   - Dodawany jest `.clampHint` z tekstem „Kliknij aby rozwinąć/zwinąć”.

**Stan rozwinięcia** jest przechowywany w `view.expandedCells`.

### 11.5 Komórki „Słowa Kluczowe”
- Domyślnie czerwone (`.keyword-red`).
- W arkuszu `Slowa_Kluczowe` kolumna `Nazwa` jest również czerwona.
- W arkuszach `KEYWORD_SHEETS_COMMA_NEUTRAL` przecinki są neutralne (`.keyword-comma`).

---

## 12) JS: popover cech i stany

### 12.1 `resolveTrait(traitText)`
Obsługuje trzy przypadki:
1. **Wywołanie (Stan)** — np. `Wywołanie (Zatrucie (5))`.
2. **Cechy parametryzowane** — np. `Nieporęczny (2)` dopasowuje się do `Nieporęczny (X)`.
3. **Dokładne dopasowanie** — po kluczu kanonicznym.

Źródła opisów:
- `_meta.traits` — arkusz `Cechy`.
- `_meta.states` — arkusz `Stany`.

### 12.2 `openTraitPopover(traitText)`
- Tytuł: wersaliki z nazwą cechy.
- Treść: bloki z labelami (CECHA / STAN) i `formatTextHTML`.
- Popover otwierany przez `aria-hidden="false"`.

### 12.3 Zamknięcie
- Kliknięcie `#popoverClose`.
- Klawisz `Escape`.

---

## 13) JS: modal porównania

### 13.1 `openCompareModal(rows)`
- Tworzy tabelę porównawczą w modalu (`<table><thead>...`).
- Dla każdej kolumny:
  - Porównuje wartości, jeśli różne → wiersz z klasą `diff`.
  - `Cechy` renderuje jako zwykły tekst.
  - `Zasięg` → `formatRangeHTML`.
  - Pozostałe → `formatTextHTML`.

### 13.2 Zamknięcie
- Kliknięcie `#modalClose`.
- Klawisz `Escape`.

---

## 14) JS: reset, wyszukiwanie i zdarzenia globalne

- `#btnReset` czyści:
  - sortowanie,
  - globalne wyszukiwanie,
  - filtry per kolumna,
  - zaznaczenia,
  - rozwinięte komórki,
  - wartości inputów w nagłówku.
- `#globalSearch` aktualizuje `view.global` na `input`.
- `Escape` zamyka popover, modal i menu filtra listowego.

---

## 15) JS: start aplikacji

- `boot()` loguje tryb (ADMIN/GRACZ) i wywołuje `loadJsonFromRepo()`.
- Po wczytaniu `data.json` wywoływany jest `initUI()` i render tabeli.

---

## 16) Zasady działania danych i formatów

- `__id` generowane jako `${name}:${idx+1}`, jeśli nie istnieje.
- Kolumny prywatne `__*` są usuwane podczas normalizacji.
- `Cecha 1..N` → scalane do `Cechy`.
- `Zasięg 1..3` → scalane do `Zasięg`.
- Markery formatowania w danych:
  - `{{RED}}...{{/RED}}`
  - `{{B}}...{{/B}}`
  - `{{I}}...{{/I}}`
- Linia `*[n]` jest renderowana jaśniejszym tekstem.
- Fragmenty w nawiasach zawierające `str`, `str.`, `strona` są oznaczane klasą `.ref`.

---

## 17) Uwagi o zgodności 1:1

- Kolejność zakładek i kolumn jest kluczowa (`SHEETS_ORDER`, `SHEET_COLUMN_ORDER`).
- Każda interakcja w UI (filtry, sortowanie, porównanie, clamp) jest wykonywana w JS — bez zewnętrznych bibliotek UI.
- Wszystkie style i efekty (glow, kolory, uppercase, letter-spacing) są definiowane w `style.css` i powinny być odtworzone dokładnie.

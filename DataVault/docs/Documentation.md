# Administratum Data Vault — dokumentacja techniczna (super dokładna)

Dokument opisuje **mechanizmy aplikacji i wygląd 1:1**, tak aby ktoś mógł odtworzyć identyczne zachowanie w innej implementacji. Aplikacja to statyczny frontend (HTML/CSS/JS) pracujący na `data.json`, z opcjonalnym generowaniem danych z `Repozytorium.xlsx`.

---

## 1) Struktura projektu i pliki

- `index.html` — szkielet UI: pasek górny, panel filtrów, obszar tabeli, popover, modal porównania, kontener menu filtrów, skrypt `app.js` i style `style.css`.
- `style.css` — pełne style (kolory, fonty, layout, tabela, popover, modal, menu filtrów listowych).
- `app.js` — cała logika: wczytywanie danych, normalizacja, filtrowanie, sortowanie, renderowanie, porównywanie i admin-update.
- `data.json` — produkcyjne źródło danych (z `_meta.traits`, `_meta.states`, `_meta.sheetOrder` i `_meta.columnOrder`); w tej aktualizacji repozytorium plik został ponownie wygenerowany z najnowszego `Repozytorium.xlsx` (po korekcie literówek), aby tabele odpowiadały aktualnym danym.
- `Repozytorium.xlsx` — źródło prawdy (XLSX), z którego generuje się `data.json`; plik musi leżeć w folderze modułu DataVault (obok `index.html`), bo frontend pobiera go ścieżką względną.
- `build_json.py` — skrypt CLI generujący `data.json` z XLSX (alternatywa dla admin update w przeglądarce). Normalizuje białe znaki i zamienia polskie cudzysłowy „ ” na standardowy znak `"`.
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
- Checkbox `#toggleCharacterTabs` — pytanie „Czy wyświetlić zakładki dotyczące tworzenia postaci?”; domyślnie odznaczony. Zaznaczenie pokazuje zakładki: `Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Bonusy Frakcji`, `Słowa Kluczowe Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`, `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów` (gdy checkbox nie jest zaznaczony, te zakładki są ukryte).
- Checkbox `#toggleCombatTabs` — pytanie „Czy wyświetlić zakładki dotyczące zasad walki?”; domyślnie odznaczony. Zaznaczenie pokazuje zakładki: `Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia` (z czego `Trafienia Krytyczne` i `Groza Osnowy` pozostają widoczne tylko w trybie admina).
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
- `.checkboxRow` — wiersz z checkboxem, uppercase, kolor `--text2`, `accent-color: var(--accent)`.
- `.checkboxLabel` — jaśniejszy opis checkboxa, kolor `--code` z `opacity: .9` (taki sam ton jak referencje `str.`).
- `.checkboxRow--combat` — wariant wiersza z czerwonym tekstem `--red` i `accent-color: var(--red)` dla checkboxa zasad walki.

### 3.5 Zakładki
- `.tabs` — flex z zawijaniem.
- `.tab` — uppercase i ten sam font co reszta UI, aktywna z innym tłem i borderem.
- `.tab--character` — zakładki powiązane z checkboxem tworzenia postaci (arkusze: `Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Bonusy Frakcji`, `Słowa Kluczowe Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`, `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów`) mają jaśniejszy kolor tekstu `var(--code)` i `opacity: .9`, spójny z etykietą checkboxa.
- `.tab--combat` — zakładki zasad walki (`Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`) mają czerwony tekst `var(--red)` niezależnie od stanu aktywnego.

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
- `.popover` — kontener w rogu, flex kolumnowy, stały `max-height`.
- `.popoverHeader`, `.popoverTitle`, `.popoverBody`.
- `.popoverTitle` ma `flex: 1` i `word-break`, aby długie tytuły mieściły się obok przycisku zamknięcia.
- `.popoverBody` jest flex-grow i posiada scroll (z `min-height: 0`).
- `.popoverBlock`, `.popoverLabel` — bloki sekcji (CECHA / STAN) z kontrolowanym odstępem.
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

- **Tabela Rozmiarów**
  - `Rozmiar`: 8ch
  - `Modyfikator Testu Ataku`: 26ch
  - `Zmniejszenie Poziomu Ukrycia`: 26ch
  - `Przykłady`: 85ch

- **Archetypy**
  - `Poziom`: 2ch
  - `Frakcja`: 26ch
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Atrybuty Archetypu`: 26ch
  - `Umiejętności Archetypu`: 26ch
  - `Zdolność Archetypu`: 46ch
  - `Ekwipunek`: 46ch
  - `Inne`: 10ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

- **Bonusy Frakcji**
  - `Frakcja`: 26ch
  - `Premia 1`: 56ch
  - `Premia 2`: 56ch
  - `Premia 3`: 56ch

- **Gatunki**
  - `Gatunek`: 26ch
  - `Koszt PD`: 4ch
  - `Atrybuty`: 26ch
  - `Umiejętności`: 26ch
  - `Zdolności gatunkowe`: 46ch
  - `Rozmiar`: 10ch
  - `Szybkość`: 4ch

- **Słowa Kluczowe Frakcji**
  - `Frakcja`: 26ch
  - `Słowo Kluczowe`: 28ch
  - `Efekt`: 56ch
  - `Opis`: 26ch

- **Implanty Astartes**
  - `Numer`: 4ch
  - `Nazwa`: 26ch
  - `Opis`: 26ch

- **Zakony Pierwszego Powołania**
  - `Nazwa`: 26ch
  - `Opis`: 56ch
  - `Zaleta`: 26ch
  - `Wada`: 26ch

- **Ścieżki Asuryani**
  - `Nazwa`: 26ch
  - `Efekt`: 26ch
  - `Opis`: 56ch

- **Orcze Klany**
  - `Nazwa`: 26ch
  - `Opis`: 56ch
  - `Efekt`: 26ch

- **Mutacje Krootów**
  - `Mutacja Krootów`: 26ch
  - `Pożarta Ofiara`: 26ch
  - `Efekt`: 26ch
  - `Opis`: 56ch

- **Trafienia Krytyczne**
  - `Rzut k66`: 6ch (wycentrowane, bez zawijania)
  - `Opis`: 56ch
  - `Efekt`: 26ch
  - `Chwała`: 26ch

- **Groza Osnowy**
  - `Rzut k66`: 6ch (wycentrowane, bez zawijania)
  - `Efekt`: 56ch

- **Skrót Zasad**
  - `Typ`: 32ch
  - `Nazwa`: 20ch
  - `Opis`: 56ch
  - `Strona`: 11ch (wycentrowane, bez zawijania)

- **Tryby Ognia**
  - `Nazwa`: 20ch
  - `Opis`: 56ch

- **Hordy**
  - `Nazwa zasady`: 26ch
  - `Opis zasady`: 60ch
  - `Przykład`: 60ch

- **Kary do ST**
  - tabela ma `table-layout: fixed` i `width: max-content`, aby nie rozciągać kolumn na szerokość okna.
  - kolumna wyboru (pierwsza, z ✓) ma 8ch (min/max/width) i jest wycentrowana — identycznie jak w pozostałych zakładkach.
  - `Ile celów/akcji`: 20ch (min/max/width, wycentrowane)
  - `Kara do ST`: 20ch (min/max/width, wycentrowane)

## Uwaga: szerokości i kolejność kolumn (Ścieżki Asuryani / Orcze Klany)
W CSS modułu DataVault dla tych zakładek ustawione są **`min-width`**, a nie stałe `width`. Tabela ma `width: 100%` i nie używa `table-layout: fixed`, więc przeglądarka może **rozciągać** kolumny, aby wypełnić dostępne miejsce. Wizualnie może to wyglądać na nierówne szerokości mimo zgodnych wartości minimalnych.

Kolumna wyboru (pierwsza, z ✓) jest wyjątkiem globalnym: ma stałą szerokość 8ch (min/max/width) i nie rozszerza się w żadnej zakładce. Arkusz **Kary do ST** dodatkowo ma stały układ (`table-layout: fixed`) i szerokość `max-content`, więc **wszystkie** jego kolumny pozostają zablokowane.

Kolejność kolumn jest pobierana z `data.json` (`_meta.columnOrder`) i ma pierwszeństwo przed samą listą pól w wierszach. W aktualnym `data.json` kolejność dla **Ścieżek Asuryani** to `Nazwa → Opis → Efekt`, podczas gdy dokumentacja (i `Kolumny.md`) podaje `Nazwa → Efekt → Opis`. Jeśli kolejność ma być stała, należy pilnować jej w arkuszu źródłowym lub w `_meta.columnOrder`.

- **Cechy / Stany / Słowa Kluczowe**
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
- **Tabela Rozmiarów**: `Modyfikator Testu Ataku`, `Zmniejszenie Poziomu Ukrycia`.
- **Gatunki**: `Koszt PD`, `Rozmiar`, `Szybkość`.
- **Archetypy**: `Poziom`, `Koszt PD`, `Strona`.
- **Talenty**: `Koszt PD`.
- **Modlitwy**: `Koszt PD`.
- **Psionika**: `Koszt PD`, `ST`, `Zasięg`, `Wiele Celów`.
- **Augumentacje**: `Koszt`, `Dostępność`, `Koszt IM`.
- **Ekwipunek**: `Koszt`, `Dostępność`, `Koszt IM`.
- **Implanty Astartes**: `Numer`.
- **Pancerze**: `WP`, `Koszt`, `Dostępność`, `Koszt IM`, `Strona`.
- **Bronie**: `Obrażenia`, `DK`, `PP`, `Zasięg`, `Szybkostrzelność`, `Koszt`, `Dostępność`, `Koszt IM`, `Strona`.
- **Kary do ST**: `Ile celów/akcji`, `Kara do ST`.

Dodatkowo kolumna `Zasięg` w **Broniach** ma `white-space: nowrap`, aby nie łamać zapisu z ukośnikami.
Kolumna `Przykłady` w **Tabela Rozmiarów** ma jawne `text-align: left`.

## 4) JS: stałe, stan aplikacji i helpery

### 4.1 Stałe
- `KEYWORD_SHEETS_COMMA_NEUTRAL` — arkusze, gdzie przecinki w „Słowa Kluczowe” są neutralne (kolor podstawowy).
- `KEYWORD_SHEET_ALL_RED` — arkusz `Słowa Kluczowe`, gdzie kolumna `Nazwa` zawsze jest czerwona.
- `ADMIN_ONLY_SHEETS` — zestaw arkuszy widocznych tylko w trybie admina (`Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`).
- `CHARACTER_CREATION_SHEETS` — zestaw zakładek sterowanych przez checkbox tworzenia postaci (`Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Bonusy Frakcji`, `Słowa Kluczowe Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`, `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów`).
- `COMBAT_RULES_SHEETS` — zestaw zakładek sterowanych przez checkbox zasad walki (`Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`).
- `RENDER_CHUNK_SIZE = 80` — ile wierszy renderuje się w jednym kroku (progressive rendering).
- `ADMIN_MODE` — `?admin=1` w URL.
- Kolejność zakładek i kolumn **nie jest hardcode** — pochodzi z `_meta.sheetOrder` i `_meta.columnOrder` w `data.json` (a w razie braku jest odzyskiwana z bieżącego układu danych).

### 4.2 Elementy DOM (`els`)
Mapowanie na `getElementById`:
- `tabs`, `tableWrap`, `globalSearch`, `btnUpdateData`, `updateDataGroup`, `btnCompare`, `btnReset`.
- `popover`, `popoverTitle`, `popoverBody`, `popoverClose`.
- `modal`, `modalBody`, `modalClose`.
- `filterMenu`.
- `toggleCharacterTabs`.
- `toggleCombatTabs`.
- `toggleCombatTabs`.

### 4.3 Stan `view`
- `sort` — `{col, dir, secondary?}` lub `null`, gdzie `secondary` to opcjonalny drugi klucz sortowania.
- `global` — tekst globalnego filtra.
- `filtersText` — per kolumna tekstowy filtr (substring).
- `filtersSet` — per kolumna Set wartości z menu listowego lub `null`.
- `selected` — `Set` zaznaczonych `__id` (porównanie).
- `expandedCells` — `Set` dla rozwiniętych komórek (key: `sheet|rowid|col`).
- `showCharacterTabs` — `true` gdy checkbox tworzenia postaci jest zaznaczony (pokazuje zestaw zakładek z `CHARACTER_CREATION_SHEETS`).
- `showCombatTabs` — `true` gdy checkbox zasad walki jest zaznaczony (pokazuje zestaw zakładek z `COMBAT_RULES_SHEETS`, z uwzględnieniem admin-only).

### 4.4 Helpery tekstowe
- `norm(s)` — normalizacja spacji i dwukropków.
- `deriveColumnOrderFromHeader(header)` — mapuje nagłówki z XLSX na kolejność kolumn w tabeli, z uwzględnieniem scalania `Cecha 1..N` → `Cechy` oraz `Zasięg 1..3` → `Zasięg` (pomija techniczne `LP`).
- `getSheetOrder(available)` — bierze `_meta.sheetOrder` i filtruje do arkuszy dostępnych w danych (dokleja brakujące).
- `getColumnOrder(rows, sheetName)` — bierze `_meta.columnOrder[sheetName]`, filtruje do kolumn obecnych w danych i dokleja brakujące alfabetycznie (kolumna `LP` jest pomijana, aby nie pojawiała się w UI).
- `escapeHtml(s)` — encje HTML.
- `stripMarkers(s)` — usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` z tekstu (używane w filtrze listowym).
- `parseInlineSegments(raw)` — dzieli tekst na segmenty z aktywnymi stylami na podstawie markerów `{{RED}}`, `{{B}}`, `{{I}}` (zwraca tablicę `{text, styles}`).
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
- Segmenty ze stylami są wyznaczane przez `parseInlineSegments`.

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

### 5.5 `formatFactionKeywordHTML(raw, opts)`
- Stosowana tylko dla arkusza `Słowa Kluczowe Frakcji` i kolumny `Słowo Kluczowe`.
- Zachowuje markery `{{B}}` i `{{I}}` (np. kursywa `lub`) dzięki `parseInlineSegments`.
- Koloruje na czerwono wszystko poza tokenami `-` i `lub`.
- Wyróżnia `[ŚWIAT-KUŹNIA]` jako w pełni czerwony token (myślnik pozostaje czerwony).
- Obsługuje `maxLines` i `appendHint` analogicznie do `formatTextHTML`.

### 5.6 `getFormattedCellHTML(row, col)`
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
- Najpierw korzysta z `_meta.columnOrder[sheetName]`, jeśli istnieje.
- W przypadku braku metadanych używa kolejności kluczy z pierwszego wiersza.
- Brakujące/nowe pola dopina alfabetycznie (`pl`, `numeric: true`).

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
- Dołącza `_meta.sheetOrder` i `_meta.columnOrder`, jeśli przekazano je z XLSX.

### 7.3 `ensureSheetJS(cb)`
- Jeśli `window.XLSX` nie istnieje, doładowuje SheetJS z CDN (`0.18.5`).

### 7.4 `downloadDataJson(data)`
- Generuje blob i wymusza pobranie `data.json`.

### 7.5 `loadXlsxFromRepo()`
- Pobiera `Repozytorium.xlsx` z `cache:"no-store"` ścieżką względną (z tego samego folderu co `index.html`).
- Czyta arkusze (`XLSX.utils.sheet_to_json` z `defval:""`).
- Pobiera pierwszy wiersz jako nagłówki i zapisuje ich kolejność (z uwzględnieniem scalania `Cecha 1..N` → `Cechy` i `Zasięg 1..3` → `Zasięg`).
- Buduje `data.json` z `_meta.sheetOrder` i `_meta.columnOrder`, a następnie inicjalizuje UI.

### 7.6 `normaliseDB(data)`
- Ignoruje arkusze zaczynające się od `_`.
- Normalizuje rekordy, dodaje `__id`.
- Buduje `traitIndex` i `stateIndex` (klucze kanoniczne).
- Przenosi do `_meta` `sheetOrder` i `columnOrder` (z fallbackiem do kolejności w `data.json`).

---

## 8) JS: inicjalizacja UI

### 8.1 `initUI()`
- Czyści `#tabs` i tworzy przyciski `.tab` wg `_meta.sheetOrder` (z fallbackiem do kolejności w `data.json`).
- Ustawia aktywną pierwszą zakładkę (lub zachowuje obecną, jeśli wciąż jest widoczna).
- Ukrywa `#updateDataGroup`, gdy nie `ADMIN_MODE`.
- W trybie gracza usuwa z listy zakładek arkusze `Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, więc są widoczne tylko dla admina.
- Gdy checkbox `#toggleCharacterTabs` jest niezaznaczony, usuwa z listy zakładek elementy `CHARACTER_CREATION_SHEETS` (zaznaczenie przywraca te zakładki).
- Gdy checkbox `#toggleCombatTabs` jest niezaznaczony, usuwa z listy zakładek elementy `COMBAT_RULES_SHEETS` (zaznaczenie przywraca te zakładki, ale z zachowaniem ograniczeń admin-only).

### 8.2 `selectSheet(name)`
- Ustawia `currentSheet`.
- Resetuje sortowanie i filtry; jeśli w danych istnieje kolumna `LP`, ustawia domyślny sort po `LP` (rosnąco). Kolumna `LP` jest ukryta w tabeli i służy wyłącznie do domyślnego porządku.
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
- `Słowa Kluczowe Frakcji` / `Słowo Kluczowe` → `formatFactionKeywordHTML` (czerwone słowa poza `-` i `lub`, zachowana kursywa `lub`, `[ŚWIAT-KUŹNIA]` w całości na czerwono).
- Inne kolumny → `formatTextHTML`, a clamp działa dopiero po renderze na podstawie liczby *wizualnych* linii (opis poniżej).

### 11.3 Renderowanie tagów cech
- `renderTraitsCell(v)` tworzy `.tag` dla każdej cechy (podział po `;`).
- Kliknięcie tagu otwiera popover z opisem cechy.

### 11.4 Clamp (rozwijanie długich komórek)
Mechanizm clampu bazuje na liczbie *wizualnych* linii (z uwzględnieniem zawijania):

1. Po renderze komórki `requestAnimationFrame` uruchamia pomiar wysokości (`scrollHeight / lineHeight`).
2. Jeśli liczba linii > 9:
   - `td` dostaje klasę `.clampable` i `title` („Kliknij aby rozwinąć/zwinąć”),
   - `div.celltext` ma ustawione `max-height: lineHeight * 9` oraz `overflow: hidden`,
   - do komórki dokładany jest element `.clampHint` z tekstem „Kliknij aby rozwinąć”.
3. Kliknięcie komórki przełącza `view.expandedCells` i:
   - usuwa `max-height/overflow` dla stanu rozwiniętego,
   - przywraca clamp dla stanu zwiniętego,
   - aktualizuje tekst hintu na „Kliknij aby zwinąć/rozwinąć”.

**Stan rozwinięcia** jest przechowywany w `view.expandedCells`.

### 11.5 Komórki „Słowa Kluczowe”
- Domyślnie czerwone (`.keyword-red`).
- W arkuszu `Słowa Kluczowe` kolumna `Nazwa` jest również czerwona.
- W arkuszach `KEYWORD_SHEETS_COMMA_NEUTRAL` przecinki są neutralne (`.keyword-comma`).
- W arkuszu `Słowa Kluczowe Frakcji` kolumna `Słowo Kluczowe` ma czerwony kolor dla wszystkich tokenów poza `-` i słowem `lub`; kursywa z arkusza (np. `lub`) jest zachowana, a `[ŚWIAT-KUŹNIA]` pozostaje w całości czerwone.

---

## 12) JS: popover cech i stany

### 12.1 `resolveTrait(traitText)`
Obsługuje trzy przypadki:
1. **Wywołanie (Stan)** — np. `Wywołanie (Zatrucie (5))` oraz `Wywołanie: Oślepienie (1)`. Wariant z nawiasem po słowie „Wywołanie” usuwa końcowy nawias, aby poprawnie zachować wewnętrzne parametry (np. `(5)`), a wariant z dwukropkiem pozostawia je bez zmian.
2. **Cechy parametryzowane** — np. `Nieporęczny (2)` dopasowuje się do `Nieporęczny (X)`.
3. **Dokładne dopasowanie** — po kluczu kanonicznym.

Źródła opisów:
- `_meta.traits` — arkusz `Cechy`.
- `_meta.states` — arkusz `Stany`.

### 12.2 `openTraitPopover(traitText)`
- Tytuł: wersaliki z nazwą cechy.
- Treść: bloki `.popoverBlock` z labelami `.popoverLabel` (CECHA / STAN) i `formatTextHTML`.
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

- Kolejność zakładek i kolumn jest kluczowa i pochodzi bezpośrednio z `_meta.sheetOrder` oraz `_meta.columnOrder` w `data.json` (aktualizowanych z `Repozytorium.xlsx`).
- Każda interakcja w UI (filtry, sortowanie, porównanie, clamp) jest wykonywana w JS — bez zewnętrznych bibliotek UI.
- Wszystkie style i efekty (glow, kolory, uppercase, letter-spacing) są definiowane w `style.css` i powinny być odtworzone dokładnie.
- **Zakony Pierwszego Powołania**
  - `Nazwa`: 26ch
  - `Opis`: 56ch
  - `Zaleta`: 46ch
  - `Wada`: 46ch

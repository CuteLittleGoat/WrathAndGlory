# Administratum Data Vault — dokumentacja techniczna (super dokładna)

Dokument opisuje **mechanizmy aplikacji i wygląd 1:1**, tak aby ktoś mógł odtworzyć identyczne zachowanie w innej implementacji. Aplikacja to frontend (HTML/CSS/JS) pracujący na `data.json`, z kanonicznym generowaniem danych po stronie przeglądarki (parser XML XLSX).

Bieżący stan danych w repozytorium: po dodaniu nowej zakładki `Pakiety Wyniesienia` w `Repozytorium.xlsx` wykonano ponowną regenerację pliku `data.json`, aby odświeżyć zestaw rekordów używany przez tabele DataVault.
Bieżąca logika kolorowania: w zakładce `Pakiety Wyniesienia`, kolumna `Słowa Kluczowe` nie jest już kolorowana globalnie na czerwono (z wyjątkiem przecinków); od teraz czerwone pozostają wyłącznie fragmenty oznaczone czerwienią w XLSX i przeniesione do `data.json` jako markery `{{RED}}...{{/RED}}`.
Bieżące ustawienie szerokości kolumny: w zakładce `Pakiety Wyniesienia` kolumna `Koszt PD` ma teraz `min-width: 26ch`, czyli dokładnie tyle samo co `Premia Wpływu`.

Bieżąca logika widoku domyślnego: w `DEFAULT_VIEW_CONFIG` usunięto reguły filtrowania `Archetypy / Frakcja`; pozostawiono wyłącznie warunek `Archetypy / Gatunek = Człowiek`.

---
Bieżąca logika zakładek: zakładka `Kary do ST` została dopisana do zbioru zakładek zasad walki (`COMBAT_RULES_SHEETS`), dzięki czemu jest ukrywana/pokazywana przez checkbox `#toggleCombatTabs` i dziedziczy czerwony styl `.tab--combat` zarówno w trybie admina, jak i użytkownika.

---
Bieżąca logika pierwszej aktywnej zakładki po `initUI()`:
- jeżeli bieżąca zakładka (`currentSheet`) nadal jest widoczna, pozostaje aktywna (bez zmian zachowania),
- jeżeli trzeba wybrać nową zakładkę startową:
  - w trybie admina preferowana jest `Notatki`,
  - w trybie użytkownika preferowana jest `Bronie`,
- jeśli preferowana zakładka nie jest aktualnie widoczna (np. przez filtry widoczności zakładek), używany jest fallback `visibleOrder[0] || visibleSheets[0]`.
- Zmiana dotyczy wyłącznie etapu wyznaczania `nextSheet` i **nie zmienia** logiki `applyDefaultViewForSheet`, `applyViewModeToAllSheets` ani przycisku `Widok Domyślny`.

## 1) Struktura projektu i pliki

- `index.html` — szkielet UI: pasek górny, panel filtrów, obszar tabeli, popover, modal porównania, kontener menu filtrów, skrypty `xlsxCanonicalParser.js` i `app.js` oraz style `style.css`.
- `style.css` — pełne style (kolory, fonty, layout, tabela, popover, modal, menu filtrów listowych).
- `app.js` — główna logika UI: wczytywanie danych, normalizacja, filtrowanie, sortowanie, renderowanie, porównywanie i obsługa przycisku generacji.
- `data.json` — produkcyjne źródło danych (z `_meta.traits`, `_meta.states`, `_meta.sheetOrder` i `_meta.columnOrder`); plik jest generowany z aktualnego pliku `Repozytorium.xlsx`, aby tabele odpowiadały aktualnym danym. (plik powinien być regenerowany po każdej zmianie `Repozytorium.xlsx`, aby tabele odpowiadały aktualnym danym).
- `Repozytorium.xlsx` — źródło prawdy (XLSX), z którego generuje się `data.json`; plik musi leżeć w folderze modułu DataVault (obok `index.html`), bo frontend pobiera go ścieżką względną.
- `xlsxCanonicalParser.js` — kanoniczny parser XLSX po stronie przeglądarki: czyta bezpośrednio `xl/styles.xml`, `xl/sharedStrings.xml`, `xl/workbook.xml` i `xl/worksheets/sheet*.xml`, aby odwzorować logikę `build_json.py` (w tym detekcję `{{RED}}`).
- `build_json.py` — kanoniczny generator referencyjny `data.json` z XLSX (AI/CLI/backend). Normalizuje białe znaki i zamienia polskie cudzysłowy „ ” na standardowy znak `"`.
- `DetaleLayout.md` (w katalogu głównym repozytorium) — główny dokument opisujący fonty, kolory, wyjątki formatowania, clamp i szerokości kolumn 1:1.

---

## 2) HTML: układ i elementy (index.html)

### 2.1 Nagłówek i akcje

- Dodano przycisk `#btnMainPage` (klasy: `.btn.secondary`) z etykietą tłumaczoną przez i18n (`mainPageButton`) i nawigacją do `../Main/index.html`.
- Logika JS ukrywa `#btnMainPage` wyłącznie w trybie admina (`ADMIN_MODE === true`).
- Główny kontener aplikacji: `.app` (flex kolumnowy).
- Górny pasek: `.topbar`.
- Branding:
  - `.sigil` — znak ⟦⟧ w kwadracie.
  - `.title` — „ADMINISTRATUM DATA VAULT”.
- Akcje (przyciski):
  - `#btnUpdateData` w grupie `#updateDataGroup` (etykieta przycisku: **„Generuj data.json”** w PL / **„Generate data.json”** w EN).
  - `#btnReset` — **Pełen Widok** (odsłania wszystkie dane i czyści filtry/sortowanie).
  - `#btnDefaultView` — **Widok Domyślny** (przywraca predefiniowane ukrycia i domyślne sortowanie).
  - `#btnCompare` — porównanie zaznaczonych wierszy.
- Pod przyciskami `#btnReset` i `#btnDefaultView` widoczny jest podpis i18n (`viewButtonsNote`): „Część danych jest domyślnie ukryta.” / „Some data is hidden by default.”.
- Przełącznik języka:
  - `.language-switcher select#languageSelect` z opcjami `pl` i `en`.
  - Ciemne tło selecta (`#0b0b0b`) utrzymuje spójność z motywem konsolowym.

**Ważne:** `#updateDataGroup` jest ukrywany w trybie gracza (JS ustawia `display:none`). W trybie admina grupa pokazuje komunikat, że kliknięcie przycisku generuje nowy `data.json`; przypomina też, że `Repozytorium.xlsx` musi leżeć obok `index.html`, a wygenerowany `data.json` trzeba wgrać do tego samego katalogu, aby zaktualizować dane.

### 2.2 Panel filtrów
- `aside.panel` z nagłówkiem `.panelHeader`.
- Pole globalne: `#globalSearch` w `.panelBody`.
- Checkbox `#toggleCharacterTabs` — pytanie „Czy wyświetlić zakładki dotyczące tworzenia postaci?”; domyślnie odznaczony. Zaznaczenie pokazuje zakładki: `Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Premie Frakcji`, `Słowa Kluczowe Frakcji`, `Pakiety Wyniesienia`, `Specjalne Bonusy Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania` (gdy checkbox nie jest zaznaczony, te zakładki są ukryte).
- Checkbox `#toggleCombatTabs` — pytanie „Czy wyświetlić zakładki dotyczące zasad walki?”; domyślnie odznaczony. Zaznaczenie pokazuje zakładki: `Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`, `Kary do ST` (z czego `Trafienia Krytyczne` i `Groza Osnowy` pozostają widoczne tylko w trybie admina).
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
- `--zebra-odd: rgba(22,198,12,.02)` (ciemniejszy pas dla wierszy nieparzystych)
- `--zebra-even: rgba(22,198,12,.12)` (jaśniejszy pas dla wierszy parzystych; odpowiada wcześniejszemu kolorowi hover)
- `--hover: rgba(22,198,12,.16)` (podświetlenie po najechaniu kursorem; takie samo jak zaznaczenie)
- `--row-selected: rgba(22,198,12,.16)` (podświetlenie zaznaczonego wiersza)
-- `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
-- `--glowH: 0 0 18px rgba(22, 198, 12, 0.35)`

### 3.3 Layout główny
- `.app` — flex, min-height 100%.
- `.topbar` — górny pasek z gradientem, borderem i flex-wrap.
- `.main` — układ grid: **180px** panel + reszta workspace.
  - Media query `@media (max-width: 980px)` przełącza na jedną kolumnę.

### 3.4 Przyciski i pola
- `.btn` (podstawowy), `.btn.primary`, `.btn.secondary`.
- `.actionsGroup` — kontener przycisku i notatki administracyjnej, ustawiony na `max-width: 640px` i `width: min(640px, calc(100vw - 40px))`, aby pomieścić dłuższy tekst instrukcji aktualizacji danych.
- Nazwy plików `index.html`, `Repozytorium.xlsx` i `data.json` w podpowiedzi są renderowane jako `<code>...</code>`, dzięki czemu mają jaśniejszy kolor (`--code`) i wyróżniają się wizualnie.
- `.input` — styl pól tekstowych (tło `--bg`, focus glow).
- `.checkboxRow` — wiersz z checkboxem, uppercase, kolor `--text2`, `accent-color: var(--accent)`.
- `.checkboxLabel` — jaśniejszy opis checkboxa, kolor `--code` z `opacity: .9` (taki sam ton jak referencje `str.`).
- `.checkboxRow--combat` — wariant wiersza z czerwonym tekstem `--red` i `accent-color: var(--red)` dla checkboxa zasad walki.

### 3.5 Zakładki
- `.tabs` — flex z zawijaniem.
- `.tab` — uppercase i ten sam font co reszta UI, aktywna z innym tłem i borderem.
- `.tab--character` — zakładki powiązane z checkboxem tworzenia postaci (arkusze: `Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Premie Frakcji`, `Słowa Kluczowe Frakcji`, `Pakiety Wyniesienia`, `Specjalne Bonusy Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`) mają jaśniejszy kolor tekstu `var(--code)` i `opacity: .9`, spójny z etykietą checkboxa.
- `.tab--combat` — zakładki zasad walki (`Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`, `Kary do ST`) mają czerwony tekst `var(--red)` niezależnie od stanu aktywnego.

### 3.6 Tabela
- `.tableWrap`, `.tableFrame`, `.tableViewport` — kontenery dla tabeli.
- `.dataTable` — `border-collapse`, `box-shadow`, sticky headers.
- Kolumny `Podręcznik` i `Strona` są globalnie ujednolicone we wszystkich zakładkach: `Podręcznik` ma `min-width: 17ch`, wyrównanie do lewej i standardowe łamanie; `Strona` ma `min-width: 6ch`, `max-width: auto`, wyrównanie do lewej i standardowe łamanie. `Podręcznik` pozostaje bez limitu `max-width`.
- Komórki `Strona` (`td[data-col="Strona"]`) używają koloru `var(--code)`, czyli dokładnie tego samego tonu co referencje `(str.)` renderowane klasą `.ref`.
- Nagłówki:
  - `thead th` — sticky, uppercase, background gradient.
  - Drugi wiersz nagłówka (`tr:nth-child(2)`) ma niższe tło i `top: var(--header-row-height)`.
  - W drugim wierszu pierwsza komórka (`th.noFilterCell`) jest celowo pusta — kolumna wyboru `✓` nie ma filtra, więc nie renderuje placeholdera „filtr...”.
  - Aktywny filtr kolumny dodaje klasę `.filter-active` do nagłówka z pierwszego wiersza, co daje akcentowe podświetlenie (`box-shadow` + mocniejszy gradient tła).
- Zebra striping: `tbody tr:nth-child(odd)` + `tbody tr:nth-child(even)` (dwa odcienie zieleni).
- Hover: `tbody tr:hover`.
- Zaznaczony wiersz: `tbody tr.row-selected`.

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
- Porównanie wykorzystuje tabelę `.compareTable`, która ma tę samą logikę zebra striping i hover co tabela główna.

### 3.10 Menu filtra listowego
- `.filterMenu` — fixed, z max-height, scroll i shadow.
- `.fmTitle`, `.fmSearch`, `.fmActions`, `.fmList`, `.fmItem`.
- `.filterBtn.filter-active`:
  - mocniejsza ramka (`border-color: var(--accent)`),
  - mocniejsze tło i glow,
  - pseudo-element `::after` z kropką `●` jako jednoznaczny znacznik aktywnego filtra.

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

- **Reguła globalna (nadpisująca lokalne wyjątki):**
  - `Podręcznik`: `min-width: 17ch`, `max-width: none`, `text-align: left`, `white-space: normal`.
  - `Strona`: `min-width: 6ch`, `max-width: auto`, `text-align: left`, `white-space: normal`, kolor komórek `td` = `var(--code)`.

- **Bestiariusz**
  - `Nazwa`: 26ch
  - `Zagrożenie`: 5ch
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
  - `Gatunek`: 26ch (dokładnie te same parametry jak `Nazwa`)
  - `Koszt PD`: 4ch
  - `Słowa Kluczowe`: 28ch
  - `Atrybuty Archetypu`: 26ch
  - `Umiejętności Archetypu`: 26ch
  - `Zdolność Archetypu`: 46ch
  - `Ekwipunek`: 46ch
  - `Inne`: 10ch
  - `Podręcznik`: 17ch
  - `Strona`: 6ch

- **Pakiety Wyniesienia**
  - `Nazwa`: 26ch (jak `Stany / Nazwa`)
  - `Opis`: 56ch (jak `Słowa Kluczowe Frakcji / Opis`)
  - `Koszt PD`: 26ch (taka sama szerokość jak `Premia Wpływu`)
  - `Wymagania`: 26ch (jak `Archetypy / Umiejętności Archetypu`)
  - `Słowa Kluczowe`: 26ch (jak `Archetypy / Umiejętności Archetypu`)
  - `Premia Wpływu`: 26ch (jak `Archetypy / Umiejętności Archetypu`)
  - `Pamiętna historia`: 46ch (jak `Archetypy / Zdolność Archetypu`)
  - `Ekwipunek`: 46ch (jak `Archetypy / Zdolność Archetypu`)
  - `Podręcznik`: 17ch (jak `Archetypy / Podręcznik`)
  - `Strona`: 6ch (jak `Archetypy / Strona`, wycentrowana)

- **Premie Frakcji**
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

- **Specjalne Bonusy Frakcji**
  - `Frakcja`: 26ch
  - `Rodzaj`: 26ch
  - `Nazwa`: 26ch
  - `Efekt`: 26ch
  - `Opis`: 56ch

- **Specjalne Bonusy Wrogów**
  - `Frakcja`: 26ch
  - `Rodzaj`: 26ch
  - `Nazwa`: 26ch
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
  - `Strona`: 6ch (wycentrowane, standardowe łamanie; kolor `var(--code)`)

- **Tryby Ognia**
  - `Nazwa`: 20ch
  - `Opis`: 56ch

- **Hordy**
  - `Nazwa zasady`: 26ch
  - `Opis zasady`: 60ch
  - `Przykład`: 60ch

- **Notatki**
  - `LP`: kolumna ukryta (używana do sortowania domyślnego)
  - `Co`: min-width 20ch, max-width auto, wyrównanie do lewej, standardowe łamanie
  - `Podręcznik`: min-width auto, max-width bez limitu, wyrównanie do lewej, standardowe łamanie
  - `Strona`: min-width 6ch, max-width auto, wyrównanie do lewej, standardowe łamanie

- **Kary do ST**
  - tabela ma `table-layout: fixed` i `width: max-content`, aby nie rozciągać kolumn na szerokość okna.
  - kolumna wyboru (pierwsza, z ✓) ma 8ch (min/max/width) i jest wycentrowana — identycznie jak w pozostałych zakładkach.
  - `Ile celów/akcji`: 20ch (min/max/width, wycentrowane)
  - `Kara do ST`: 20ch (min/max/width, wycentrowane)

## Uwaga: szerokości i kolejność kolumn (Specjalne Bonusy Frakcji / Specjalne Bonusy Wrogów)
W CSS modułu DataVault dla obu tych zakładek ustawione są **`min-width`**, a nie stałe `width`. Tabela ma `width: 100%` i nie używa `table-layout: fixed`, więc przeglądarka może **rozciągać** kolumny, aby wypełnić dostępne miejsce. Wizualnie może to wyglądać na nierówne szerokości mimo zgodnych wartości minimalnych.

Kolumna wyboru (pierwsza, z ✓) jest wyjątkiem globalnym: ma stałą szerokość 8ch (min/max/width) i nie rozszerza się w żadnej zakładce. Arkusz **Kary do ST** dodatkowo ma stały układ (`table-layout: fixed`) i szerokość `max-content`, więc **wszystkie** jego kolumny pozostają zablokowane.

Kolejność kolumn jest pobierana z `data.json` (`_meta.columnOrder`) i ma pierwszeństwo przed samą listą pól w wierszach. W aktualnym `data.json` kolejność dla **Specjalnych Bonusów Frakcji** i **Specjalnych Bonusów Wrogów** to `Frakcja → Rodzaj → Nazwa → Opis → Efekt`. Jeśli kolejność ma być stała, należy pilnować jej w arkuszu źródłowym lub w `_meta.columnOrder`.

- **Cechy / Stany / Słowa Kluczowe**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Opis`: 56ch

- **Talenty**
  - `Typ`: 14ch
  - `Nazwa`: 26ch
  - `Koszt PD`: 4ch
  - `Wymagania`: 26ch
  - `Opis`: 26ch
  - `Efekt`: 56ch

- **Modlitwy**
  - `Typ`: 14ch
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
- `KEYWORD_SHEETS_COMMA_NEUTRAL` — arkusze, gdzie przecinki w „Słowa Kluczowe” są neutralne (kolor podstawowy): `Bestiariusz`, `Archetypy`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie`, `Pakiety Wyniesienia`.
  Uwaga implementacyjna: dla `Pakiety Wyniesienia / Słowa Kluczowe` działa dodatkowy wyjątek w `formatDataCellHTML`, który pomija globalne wymuszanie czerwieni i oddaje renderowanie do zwykłego `getFormattedCellHTML` (czyli tylko style inline z XLSX).
- `KEYWORD_SHEET_ALL_RED` — arkusz `Słowa Kluczowe`, gdzie kolumna `Nazwa` zawsze jest czerwona.
- `ADMIN_ONLY_SHEETS` — zestaw arkuszy widocznych tylko w trybie admina (`Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`, `Specjalne Bonusy Wrogów`, `Notatki`).
- `CHARACTER_CREATION_SHEETS` — zestaw zakładek sterowanych przez checkbox tworzenia postaci (`Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Premie Frakcji`, `Słowa Kluczowe Frakcji`, `Pakiety Wyniesienia`, `Specjalne Bonusy Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`).
- `COMBAT_RULES_SHEETS` — zestaw zakładek sterowanych przez checkbox zasad walki (`Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`).
- `CHARACTER_CREATION_SHEET_KEYS` i `COMBAT_RULES_SHEET_KEYS` — kanoniczne (znormalizowane) wersje nazw arkuszy używane do odpornego dopasowania nazw zakładek niezależnie od drobnych różnic zapisu.
- `RENDER_CHUNK_SIZE = 80` — ile wierszy renderuje się w jednym kroku (progressive rendering).
- `ADMIN_MODE` — `?admin=1` w URL.
- `SESSION_VIEW_KEY = "datavault_session_view_v2"` — klucz zapisu stanu widoku w `sessionStorage`.
- `DEFAULT_VIEW_CONFIG` — mapa domyślnych checkboxów (sheet/column/values) dla przycisku `Widok Domyślny` i startu aplikacji.
- Kolejność zakładek i kolumn **nie jest hardcode** — pochodzi z `_meta.sheetOrder` i `_meta.columnOrder` w `data.json` (a w razie braku jest odzyskiwana z bieżącego układu danych).

### 4.2 Elementy DOM (`els`)
Mapowanie na `getElementById`:
- `tabs`, `tableWrap`, `globalSearch`, `btnUpdateData`, `updateDataGroup`, `btnCompare`, `btnReset`, `btnDefaultView`.
- `popover`, `popoverTitle`, `popoverBody`, `popoverClose`.
- `modal`, `modalBody`, `modalClose`.
- `filterMenu`.
- `toggleCharacterTabs`, `toggleCombatTabs`, `languageSelect`.

### 4.3 Stan widoku (per zakładka + globalny UI)
- `uiState`:
  - `showCharacterTabs`,
  - `showCombatTabs`.
- `viewBySheet` — obiekt stanu per zakładka (serializowany do `sessionStorage`).
- `view` — aktywny stan aktualnie wybranej zakładki:
  - `sort` — `{col, dir, secondary?}` lub `null`,
  - `global` — tekst globalnego filtra,
  - `filtersText` — per kolumna tekstowy filtr,
  - `filtersSet` — per kolumna `Set` wartości z menu listowego lub `null`,
  - `selected` — `Set` zaznaczonych `__id`,
  - `expandedCells` — `Set` komórek rozwiniętych w clampie.
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
- `isCharacterCreationSheet(name)` — sprawdza (po kluczu kanonicznym), czy zakładka należy do grupy tworzenia postaci.
- `isCombatRulesSheet(name)` — sprawdza (po kluczu kanonicznym), czy zakładka należy do grupy zasad walki.

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
- Funkcja uruchamia kanoniczną generację w przeglądarce:
  1. Doładowuje `JSZip` (jeśli nie jest dostępny).
  2. Pobiera `Repozytorium.xlsx` (`cache:"no-store"`).
  3. Wywołuje `XlsxCanonicalParser.loadXlsxMinimal(arrayBuffer)`.
  4. Buduje finalny JSON przez `buildDataJsonFromSheets(rawSheets, {sheetOrder, columnOrder})`.
  5. Pobiera `data.json` przez `downloadDataJson(data)`, normalizuje dane i odświeża UI.
- Dzięki bezpośredniemu parsowaniu `styles.xml`/`sharedStrings.xml` wynik przycisku jest zgodny semantycznie z `build_json.py` (w tym markery `{{RED}}`).
- Gdy parser kanoniczny nie jest dostępny (np. błąd CDN), funkcja ustawia status błędu i loguje komendę CLI (`python build_json.py Repozytorium.xlsx data.json`).

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
- Gdy checkbox `#toggleCharacterTabs` jest niezaznaczony, usuwa z listy zakładek elementy grupy tworzenia postaci (sprawdzane kanonicznie przez `isCharacterCreationSheet`, więc obejmuje też `Premie Frakcji` i `Specjalne Bonusy Frakcji` przy drobnych różnicach zapisu).
- Gdy checkbox `#toggleCombatTabs` jest niezaznaczony, usuwa z listy zakładek elementy `COMBAT_RULES_SHEETS` (zaznaczenie przywraca te zakładki, ale z zachowaniem ograniczeń admin-only).

### 8.2 `selectSheet(name)`
- Ustawia `currentSheet`.
- Zapisuje stan bieżącej zakładki do bufora per-zakładka (`viewBySheet`) i odtwarza stan docelowej zakładki.
- Stan zakładki obejmuje: `sort`, `global`, `filtersText`, `filtersSet`, `selected`, `expandedCells`.
- Jeżeli zakładka nie ma jeszcze stanu, tworzony jest nowy stan z domyślnym sortem (po `LP`, jeśli istnieje) i pustymi filtrami.
- Buduje tabelę i renderuje wiersze.
- Stan jest synchronizowany do `sessionStorage` (klucz `datavault_session_view_v2`).

### 8.3 `buildTableSkeleton()`
- Tworzy `<table>` z dwoma wierszami nagłówka:
  - wiersz 1: nazwy kolumn + `sortMark`.
  - wiersz 2: `input` filtrów + przycisk `▾` (filtr listowy).
- Dodaje kolumnę checkboxów `✓` na początku.
- Komórka filtra dla kolumny `✓` ma klasę `noFilterCell` i pozostaje pusta (usunięto napis „filtr...”, bo brak logiki filtrowania dla tej kolumny).
- Tooltip przycisku filtru listowego to „Filtr listy”.
- Po zbudowaniu nagłówka uruchamiane jest `updateFilterIndicators()`, które synchronizuje klasy aktywnego filtra z aktualnym stanem `view`.

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
- `isColumnFilterActive(col)`:
  - zwraca `true`, gdy istnieje niepusty filtr tekstowy (`filtersText[col].trim()`),
  - albo gdy filtr listowy `filtersSet[col]` jest typu `Set` i zawiera mniej wartości niż pełna lista unikalnych wartości kolumny.
- `updateFilterIndicators()`:
  - dla każdej kolumny ustawia `.filter-active` na nagłówku (`thead tr:first-child th[data-col]`) oraz na przycisku `.filterBtn`,
  - ustawia `aria-pressed` przycisku filtra (`true`/`false`),
  - jest wołane po budowie nagłówka (`buildTableSkeleton()`) i na każdym renderze (`renderBody()`), więc wskaźnik zawsze odzwierciedla aktualny stan filtrów.
- `openFilterMenu(col, anchorBtn)`:
  - Obsługuje **toggle** dla tego samego przycisku (`activeFilterCol`, `activeFilterBtn`): drugi klik w tę samą strzałkę `▾` wywołuje `closeFilterMenu()` i zamyka panel.
  - Przy kliknięciu `▾` w innej kolumnie najpierw zamyka poprzedni panel (`closeFilterMenu()`), potem buduje nowy dla wskazanej kolumny.
  - Buduje listę checkboxów i wyszukiwarkę.
  - Przyciski **Zaznacz wszystko** i **Wyczyść**.
  - Pozycjonuje menu obok przycisku `▾`.
  - Podczas otwarcia przypina `filterMenuDocHandler` do `document.mousedown`; klik poza menu/podpiętym przyciskiem zamyka panel.
- `isFilterMenuOpen()` — helper sprawdzający stan `aria-hidden` menu.
- `closeFilterMenu()`:
  - Odpina `filterMenuDocHandler` z `document`.
  - Czyści `activeFilterCol` i `activeFilterBtn`.
  - Ustawia `aria-hidden="true"` i czyści HTML menu.
- Etykiety w menu są wyświetlane bez markerów `{{RED}}`, `{{B}}`, `{{I}}`, ale filtrowanie działa na surowych wartościach (nie zmienia logiki danych).
- `view.filtersSet[col] = null` oznacza brak filtra (wszystko zaznaczone).
- Domyślny profil widoku jest definiowany przez `DEFAULT_VIEW_CONFIG` (mapa `sheet -> column -> allowedValues`) i nakładany przez `applyDefaultViewForSheet`.

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
- Wyjątek: `Pakiety Wyniesienia / Słowa Kluczowe` nie używa już globalnego wrappera `.keyword-red`; kolor czerwony pojawia się tylko tam, gdzie parser XLSX wykrył czerwony styl inline (`{{RED}}`).
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
  - Pozostałe kolumny renderuje przez wspólną funkcję `formatDataCellHTML(row, col, sheetName)`.
- `formatDataCellHTML(...)` jest używane zarówno przez tabelę główną (`renderRow`), jak i modal porównania, dzięki czemu obie ścieżki mają identyczne reguły:
  - arkusz `Słowa Kluczowe` + kolumna `Nazwa` → `formatKeywordHTML` (całość na czerwono),
  - arkusz `Pakiety Wyniesienia` + kolumna `Słowa Kluczowe` → `getFormattedCellHTML` (bez globalnego wymuszania czerwieni; tylko inline `{{RED}}`),
  - arkusze z `KEYWORD_SHEETS_COMMA_NEUTRAL` + kolumna `Słowa Kluczowe` → `formatKeywordHTML(..., {commasNeutral:true})`,
  - arkusz `Słowa Kluczowe Frakcji` + kolumna `Słowo Kluczowe` → `formatFactionKeywordHTML` (wyjątki `-`, `lub`, pełna czerwień dla `[ŚWIAT-KUŹNIA]`),
  - fallback → `getFormattedCellHTML` (`formatRangeHTML` dla `Zasięg`, inaczej `formatTextHTML` z pełnym wsparciem markerów `{{RED}}/{{B}}/{{I}}`, referencji `(str.)` i `*[n]`).
- `openModal(...)` nie renderuje już dodatkowego nagłówka `<h3>` w treści modala; tytuł pozostaje tylko w pasku `.modalHeader` (`#modalTitle`), co usuwa wizualny duplikat „PORÓWNANIE”.

### 13.2 Zamknięcie
- Kliknięcie `#modalClose`.
- Klawisz `Escape`.

---

## 14) JS: profile widoku, persistencja, wyszukiwanie i zdarzenia globalne

- `#btnReset` (Pełen Widok) uruchamia `applyViewModeToAllSheets("full")`:
  - czyści globalne wyszukiwanie, filtry tekstowe, filtry listowe i zaznaczenia dla **wszystkich** zakładek,
  - ustawia `sort = null`,
  - zapisuje wynik do `sessionStorage`.
- `#btnDefaultView` uruchamia `applyViewModeToAllSheets("default")`:
  - przywraca domyślne filtry checkboxowe wg `DEFAULT_VIEW_CONFIG` dla wszystkich zakładek,
  - resetuje pozostałe filtry i zaznaczenia,
  - przywraca domyślny sort (`getDefaultSort(sheet)`),
  - zapisuje wynik do `sessionStorage`.
- Aplikacja po starcie:
  - najpierw próbuje odczytać stan z `sessionStorage` (`loadSessionState()`),
  - jeśli brak stanu sesji, inicjalizuje wszystkie zakładki profilem domyślnym (`applyDefaultViewForSheet`).
- Konfiguracja widoku domyślnego (dokładnie):
  - **Archetypy / Gatunek:** Człowiek (czyli w widoku domyślnym zaznaczona jest wyłącznie wartość `Człowiek`).
  - **Premie Frakcji / Frakcja:** Adepta Sororitas, Adeptus Astartes, Adeptus Astra Telepathica, Adeptus Mechanicus, Adeptus Ministorum, Astra Militarum, Chaos, Dynastie Wolnych Kupców, Inkwizycja, Ogryn, Szczurak, Szumowiny.
  - **Psionika / Typ:** Uniwersalne Zdolności Psioniczne, Pomniejsze Moce Psioniczne, Uniwersalna Dyscyplina Psioniczna, Dyscyplina Biomancji, Dyscyplina Dywinacji, Dyscyplina Piromancji, Dyscyplina Telekinezy, Dyscyplina Telepatii.
  - **Augumentacje / Typ:** Ulepszenia, Wszczepy, Mechadendryt.
  - **Ekwipunek / Typ:** Ulepszenia Broni, Amunicja, Ekwipunek Imperium.
  - **Pancerze / Typ:** Zwykłe, Wspomagane, Energetyczne (czyli domyślnie odznaczone: Astartes, Auxilla).
  - **Bronie / Typ:** Adeptus Mechanicus, Boltowa, Broń biała, Broń biała Adeptus Mechanicus, Broń dystansowa, Broń dystansowa Adeptus Mechnicus, Broń dystansowa Milczących Sióstr, Broń energetyczna, Broń łańcuchowa, Broń łańcuchowa Astartes, Broń psioniczna, Egzotyczna broń biała, Granaty i Wyrzutnie, Imperialna broń biała, Laserowa, Ogniowa, Palna, Plazmowa, Termiczna (czyli domyślnie odznaczone: Broń biała Ogrynów, Broń dystansowa Militarum Auxilla).
  - **Talenty / Typ:** Człowiek, Imperium, Inkwizycja, Mechanicus, Militarum, Ogólne, Sororitas (czyli domyślnie odznaczone: Aeldari, Astartes, Chaos, Ork).
  - Pozostałe zakładki: brak ograniczeń (`filtersSet = {}` lub `null` per kolumna).
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

## 14) `Stan=old` i marker `{{S}}`

### 14.1 Pipeline danych (Python + parser kanoniczny JS)
- `build_json.py`
  - `_wrap_with_markers()` obsługuje teraz czwarty marker: `S`.
  - `_rich_text_to_string()` mapuje `<strike/>` z `rPr` na `{{S}}...{{/S}}`.
- `xlsxCanonicalParser.js`
  - `wrapWithMarkers()` obsługuje `strike`.
  - `richTextToString()` wykrywa `rPr/strike` i serializuje marker `S`.
- Obie ścieżki (CLI i parser kanoniczny) używają identycznego porządku markerów, więc wygenerowany `data.json` pozostaje spójny semantycznie.

### 14.2 Parser/renderer UI
- `stripMarkers(s)` usuwa teraz także `{{S}}`.
- `parseInlineSegments(raw)` rozpoznaje zestaw markerów: `RED`, `B`, `I`, `S`.
- `formatInlineHTML(raw)` dodaje klasę `.inline-strike` dla segmentów ze stylem `S`.
- `htmlToStyleMarkers(html)` mapuje strike z:
  - tagów `<s>`, `<strike>`, `<del>`,
  - stylu inline `text-decoration` / `text-decoration-line: line-through`.

### 14.3 Stan `old`
- `HIDDEN_COLUMNS` zawiera `stan`, więc kolumna nie jest renderowana.
- `isOldStatusRow(row)` wykrywa rekordy `Stan=old` (`trim + lowercase`).
- `renderRow()` ustawia klasę `row-old` dla rekordów archiwalnych.

### 14.4 CSS i priorytet kolorów
- Dodano token `--text-old: #7f9b7f`.
- `.dataTable tbody tr.row-old` wymusza kolor bazowy archiwalny.
- `.inline-strike`:
  - `text-decoration: line-through`,
  - kolor domyślny `var(--text-old)`.
- `.inline-strike.inline-red` przywraca czerwony (`var(--red)`), co realizuje priorytet RED > OLD.
- Dla `row-old` doprecyzowano kolory: `.keyword-comma`, `.ref`, `.caretref`, `.slash` dziedziczą kolor archiwalny.

### 14.5 Reguły kolumn
- W `Bestiariusz` dodano regułę kolumny `Typ`:
  - `min-width: 14ch`,
  - `text-align: left`.
### 14.6 Alias kolumny statusu
- Wykrywanie archiwalności i ukrywania kolumny działa dla `Stan` (case-insensitive).
- Funkcja `isOldStatusRow(row)` wyszukuje klucz `Stan` i normalizuje wartość przez `stripMarkers(...).trim().toLowerCase()`.

---

## detale techniczne przeniesione z README
Po uproszczeniu `docs/README.md` (wersja użytkowa) przeniesiono i utrwalono tutaj szczegóły implementacyjne:

1. **Szerokości i układ kolumn**
   - `Talenty/Typ` i `Modlitwy/Typ` mają te same parametry jak `Bronie/Typ` (w tym `min-width: 14ch`, wyrównanie do lewej).
   - W zakładce `Kary do ST` kolumny `Ile celów/akcji` i `Kara do ST` mają stały rozmiar (`20ch`), a tabela działa w układzie stałym (`table-layout: fixed`, `width: max-content`).
   - Dla zakładki `Notatki` (admin) utrzymano opis technicznych reguł szerokości i wyrównań kolumn (`Co`, `Podręcznik`, `Strona`).

2. **Stan UI i pamięć sesji**
   - Filtry oraz sortowanie są przechowywane per sesja przeglądarki (`sessionStorage`), aby przełączanie zakładek nie zerowało bieżącej pracy.

3. **Formatowanie treści i markery inline**
   - Widok główny i modal porównania korzystają z tej samej ścieżki renderowania formatowania.
   - W `Pakiety Wyniesienia` czerwony kolor pochodzi wyłącznie z markerów `{{RED}}...{{/RED}}` wygenerowanych z XLSX.
   - Etykiety w filtrach listowych usuwają markery techniczne (`{{RED}}`, `{{B}}`, `{{I}}`) tylko na potrzeby prezentacji etykiety; logika filtrowania pozostaje oparta o surowe dane.

4. **Spójność generatora danych**
   - Przycisk administracyjny generujący `data.json` zachowuje spójność z kanoniczną logiką parsera/generatora (w tym markerów inline i normalizacji formatowania).

Ta sekcja jest utrzymywana jako techniczne uzupełnienie po odchudzeniu README do instrukcji nietechnicznej.
## 22) Uzupełnienie audytowe — pełna specyfikacja „ciemne tło / zielone akcenty”
Aby uniknąć opisów skrótowych, poniżej literalne wartości:
- Tło bazowe: `#031605`.
- Gradient tła: `rgba(0,255,128,0.06)` + `rgba(0,255,128,0.08)` + `#031605`.
- Tła paneli: `#000`.
- Tekst bazowy: `#9cf09c`; tekst wtórny: `#4FAF4F`; tekst przygaszony: `#4a8b4a`; tekst jasny kodu: `#D2FAD2`.
- Czerwony ostrzegawczy: `#d74b4b`.
- Ramki i akcent: `#16c60c`; ciemny akcent: `#0d7a07`.
- Delikatne obramowania: `rgba(22,198,12,.2)` i `rgba(22,198,12,.35)`.
- Linie podziału: `rgba(22,198,12,.18)`.
- Zebra: `rgba(22,198,12,.02)` i `rgba(22,198,12,.12)`.
- Hover i zaznaczenie: `rgba(22,198,12,.16)`.
- Glow: `0 0 25px rgba(22, 198, 12, 0.45)`; glow nagłówków: `0 0 18px rgba(22, 198, 12, 0.35)`.

## 23) Uzupełnienie audytowe — katalog funkcji krytycznych
W `app.js` funkcje kluczowe dla rekonstrukcji 1:1 to m.in.: normalizacja (`norm`, `normaliseDB`), budowa konfiguracji widoku (`createSheetViewState`, `applyDefaultViewForSheet`, `applyFullViewForSheet`), formatowanie inline (`formatInlineHTML`, `formatTextHTML`, `formatKeywordHTML`), render (`buildTableSkeleton`, `renderBody`, `renderRow`), clamp (`measureRenderedLines`, `updateClampableHints`), filtrowanie/sortowanie (`passesFilters`, `sortRows`, `compareByColumn`), parsowanie XLSX (`getCellTextWithMarkers`, `extractSheetRowsWithFormatting`, `buildDataJsonFromSheets`).

# Generator NPC — dokumentacja techniczna (pełny opis)

## 1. Cel aplikacji i ogólny opis
Aplikacja to statyczny frontend (HTML + CSS + JS) służący do przeglądania danych NPC oraz generowania karty postaci do druku na podstawie rekordów z pliku JSON. Dane są pobierane z publicznego źródła (URL), a interfejs umożliwia:
- wybór rekordu bestiariusza jako bazowej postaci,
- wybór wielu pozycji z modułów (broń, pancerz, augumentacje, ekwipunek, talenty, psionika, modlitwy),
- podgląd danych w tabelach,
- generowanie karty do druku z uwzględnieniem wybranych modułów oraz notatek użytkownika.

Aplikacja nie posiada backendu. Cała logika renderowania znajduje się w skrypcie osadzonym w `index.html`, a wygląd w `style.css`.

---

## 2. Struktura projektu
- `index.html` — główny dokument HTML, zawiera szkielet UI oraz cały skrypt JS.
- `style.css` — komplet stylów interfejsu (layout, typografia, tabele, popover, układ responsywny).
- `docs/Documentation.md` — niniejsza dokumentacja techniczna.
- `docs/README.md` — instrukcja obsługi dla użytkownika (PL/EN).

---

## 3. Dane wejściowe i źródło
**Źródło danych:**
- `DATA_URL = "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json"`.

**Wczytywanie danych:**
- Dane są pobierane przez `fetch` z `cache: "no-store"`.
- Po wczytaniu dane są analizowane i rozdzielane na kolekcje: bestiariusz, pancerze, bronie, augumentacje, ekwipunek, talenty, psionika, modlitwy.
- Kolekcje są sortowane przed zasileniem list wyboru: bestiariusz, talenty i modlitwy alfabetycznie po nazwie; broń, pancerze, augumentacje, ekwipunek po typie i nazwie; psionika po typie malejąco i nazwie.

**Meta dane:**
- `_meta.traits` zawiera listę cech wraz z opisami wykorzystywanymi w popoverze.

---

## 4. Struktura HTML i elementy UI

### 4.1. Pasek górny (`.topbar`)
- Zawiera tytuł aplikacji oraz dwa przyciski:
  - **Reset** (`#reset-page`) — przywraca domyślny stan wyborów.
  - **Generuj kartę** (`#generate-card`) — uruchamia generowanie karty do druku.

### 4.2. Panel boczny (`.sidebar`)
Składa się z trzech sekcji:
1. **Źródło danych** — informuje o URL danych i statusie wczytywania (`#data-status`).
2. **Wybór bazowy** — wybór rekordu bestiariusza (`#bestiary`) + notatki (`#bestiary-notes`).
3. **Moduły aktywne** — checkboxy włączające/wyłączające karty modułów:
   - Broń, Pancerz, Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy.

### 4.3. Obszar roboczy (`.workspace`)
Zawiera karty z tabelami danych:
- **Podgląd bazowy Bestiariusza** (`#bestiary-table-body`).
  - W wybranych wierszach (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Żywotność, Upór, Odwaga, Szybkość) zamiast tekstu pojawiają się pola `number` z przyciskami góra–dół.
  - Wiersz „Umiejętności” posiada przycisk **Edytuj** w kolumnie klucza, który przełącza komórkę na edycję w `textarea`.
- **Wybór Broni** (`#weapon`, `#weapon-table-body`).
- **Wybór Pancerzy** (`#armor`, `#armor-table-body`).
- **Wybór Augumentacji** (`#augmentations`, `#augmentations-table-body`).
- **Wybór Ekwipunku** (`#equipment`, `#equipment-table-body`).
- **Wybór Talentów** (`#talents`, `#talents-table-body`).
- **Wybór Psioniki** (`#psionics`, `#psionics-table-body`).
- **Wybór Modlitw** (`#prayers`, `#prayers-table-body`).

Każda karta posiada listę wielokrotnego wyboru (`<select multiple size="15">`) oraz tabelę danych. W tabelach nagłówki są „sticky”, a wiersze mają efekt zebry.

### 4.4. Popover cech (`#trait-popover`)
- Wyświetla nazwę i opis cechy po kliknięciu w tag (`.tag`).
- Ukrywa się po kliknięciu poza popover.

---

## 5. Typografia i fonty
- Aplikacja używa lokalnego stosu konsolowego:
  - `Consolas`, `Fira Code`, `Source Code Pro`, `monospace`.
- Font jest ustawiony globalnie na `*`, więc wszystkie elementy dziedziczą tę samą typografię.

Ustawienia globalne:
- `font-family: "Consolas", "Fira Code", "Source Code Pro", monospace;`
- `line-height: 1.45;`
- `letter-spacing: 0.03em;`

---

## 6. Style i klasy CSS (pełny opis)

### 6.1. Zmienne CSS (`:root`)
- Kolory tła i paneli:
  - `--bg: #031605`
  - `--bg-grad`: radialne gradienty + `#031605`
  - `--panel: #000`
  - `--panel2: #000`
- Tekst:
  - `--text: #9cf09c`
  - `--text2: #4FAF4F`
  - `--muted: #4a8b4a`
  - `--code: #D2FAD2`
  - `--red: #d74b4b`
- Obramowania i akcenty:
  - `--border: #16c60c`
  - `--accent: #16c60c`
  - `--accent-dark: #0d7a07`
  - `--b: rgba(22,198,12,.35)`
  - `--b2: rgba(22,198,12,.2)`
  - `--div: rgba(22,198,12,.18)`
- Tła pomocnicze:
  - `--hbg: rgba(22,198,12,.06)`
  - `--zebra: rgba(22,198,12,.04)`
  - `--hover: rgba(22,198,12,.08)`
- Cienie:
  - `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
  - `--glowH: 0 0 18px rgba(22, 198, 12, 0.35)`
- `--header-row-height` — wysokość wiersza nagłówków tabel (36px).

### 6.2. Klasy layoutu
- `.topbar`, `.layout`, `.sidebar`, `.workspace`, `.panel`, `.card`, `.card-header`.
- `.card.is-hidden` — ukrywa moduł, gdy jest wyłączony.

### 6.3. Tekst i typografia
- `.text-muted`, `.text-red` — stonowane i czerwone akcenty.
- `.badge` — etykieta typu „Bestiariusz”.

### 6.4. Formularze
- `select`, `input`, `textarea` — jednolite tła, obramowania, fokus (`box-shadow: var(--glow)`).
- `.field`, `.field-label-row` — układ etykiet i kontroli.
- `.checkbox`, `.checkbox-list`, `.checkbox-inline` — checkboxy modułów i ustawień szczegółów.
- `.table-number-input` — wąskie pole `number` w tabeli bestiariusza (mniejszy padding i font).
- `.editable-textarea` — pole edycji `Umiejętności` (ciemne tło, resize w pionie, focus z `--glow`).
- `.skills-key-cell` — układ flex dla etykiety „Umiejętności” i przycisku **Edytuj/Zapisz**.
- `.btn.btn-small` — kompaktowa wersja przycisku dla edycji w tabeli.

### 6.5. Tabele
- `.data-table` — tabela z `border-collapse`, efektami hover i zebra.
- `.data-table th` — sticky header, gradient tła i uppercase, z tym samym fontem co reszta UI.
- `min-col-*` — klasy wymuszające minimalne szerokości kolumn (definiowane per arkusz danych).

### 6.6. Tagowanie i formatowanie
- `.tag` — klikany tag cechy.
- `.celltext` — pre-wrap i poprawne zawijanie treści.
- `.inline-red`, `.inline-bold`, `.inline-italic` — formatowanie markerów `{{RED}}`, `{{B}}`, `{{I}}`.
- `.keyword-red`, `.keyword-comma` — kolorowanie słów kluczowych i przecinków.
- `.ref`, `.caretref` — wyróżnianie odwołań do stron i linii `*[n]`.
- `.slash` — styl separatorów zakresu.

### 6.7. Clamp (skracanie tekstu)
- `.clamp-cell`, `.clamp-cell.is-clampable`, `.clamp-hint` — obsługa komórek, które można rozwijać/zwijać.

### 6.8. Popover
- `.popover`, `.popover.active` — panel opisu cechy.

### 6.9. Responsywność
- `@media (max-width: 1000px)` — przełącza layout na jednokolumnowy.

---

## 7. Zasady formatowania treści danych

### 7.1. Markery inline
- `{{RED}}...{{/RED}}` → `.inline-red`.
- `{{B}}...{{/B}}` → `.inline-bold`.
- `{{I}}...{{/I}}` → `.inline-italic`.

### 7.2. Referencje stron
- Tekst w nawiasach zawierający `str.`, `str` lub `strona` otrzymuje klasę `.ref`.

### 7.3. Linie przypisów
- Linie typu `*[n]` są renderowane jako `.caretref`.

### 7.4. Zakresy wartości
- Kolumny „Zasięg” są dzielone po `/`, a separator otrzymuje `.slash`.

### 7.5. Słowa kluczowe
- Kolumny „Słowa Kluczowe” są renderowane jako `.keyword-red`.
- W arkuszach: `Bestiariusz`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie` przecinki są neutralne (`.keyword-comma`).

---

## 8. Logika aplikacji (pełny opis funkcji)

### 8.1. Stałe i stan aplikacji
- `DATA_URL` — URL z danymi JSON.
- `CLAMP_LINES = 9` — liczba linii do przycinania komórek.
- `EDITABLE_STATS_KEYS`, `EDITABLE_SKILLS_KEY`, `EDITABLE_RESISTANCE_KEYS`, `EDITABLE_NUMERIC_KEYS` — definicje pól bestiariusza, które mają wbudowaną edycję (liczbowe oraz „Umiejętności”).
- `state` — obiekt z danymi aplikacji i stanem UI:
  - `data`, `traits` (Map), `expandedCells` (Set), `selectedBestiaryIndex`,
  - `bestiaryOverrides` — obiekt nadpisań wprowadzonych przez użytkownika:
    - `numeric` (Map) dla pól liczbowych,
    - `skills` (string) dla „Umiejętności”,
    - `skillsEditing` (boolean) przełączający tryb edycji,
  - kolekcje: `bestiary`, `armor`, `weapons`, `augmentations`, `equipment`, `talents`, `psionics`, `prayers`.
- `clampEvaluators` (WeakMap) — przechowuje funkcje obliczające clamp dla komórek.
- `nameKeyCache` (WeakMap) — cache klucza nazwy rekordu.
- `clampObserver` (ResizeObserver) — reaguje na zmianę rozmiaru komórek i przelicza clamp.

### 8.2. Funkcje narzędziowe (tekst i HTML)
- `normalizeText(value)` — zamienia wartość na string, usuwa nadmiarowe białe znaki.
- `normalizeKey(value)` — normalizuje tekst do porównywania (lowercase, usuwa diakrytyki).
- `escapeHtml(value)` — ucieka znaki HTML (`&`, `<`, `>`, `"`, `'`).
- `getColumnClass(label)` — tworzy klasę kolumny `min-col-*` na podstawie etykiety.
- `formatInlineHTML(raw)` — parsuje markery `{{RED}}`, `{{B}}`, `{{I}}`, dodatkowo oznacza referencje stron w nawiasach.
- `formatTextHTML(raw, { maxLines, appendHint })` — formatuje tekst, obsługuje marker `*[n]`, przycina liczbę linii, może dodać wskazówkę clamp.
- `formatRangeHTML(raw)` — formatuje zakresy (dzieli po `/`, wstawia `.slash`).
- `formatKeywordHTML(raw, { commasNeutral, maxLines, appendHint })` — formatuje słowa kluczowe i przecinki.
- `isKeywordColumn(key)` — rozpoznaje kolumnę „Słowa Kluczowe”.
- `isRangeColumn(key)` — rozpoznaje kolumnę „Zasięg”.
- `getFormattedCellHTML(sheetName, key, rawValue, options)` — decyduje o sposobie formatowania komórki w zależności od typu kolumny.

### 8.3. Funkcje narzędziowe (rekordy i kolekcje)
- `canonicalTraitName(name)` — normalizuje nazwę cechy.
- `toDisplayString(value)` — bezpiecznie zwraca string (pusty jeśli brak wartości).
- `hasMeaningfulValue(value)` — sprawdza, czy tekst ma realną zawartość.
- `getRecordValueByLabels(record, labels)` — zwraca wartość pierwszej pasującej etykiety.
- `extractRecords(section)` — wydobywa tablicę rekordów z obiektu sekcji.
- `getSectionName(section)` — zwraca nazwę sekcji (normalizuje nazwy pól `name`).
- `looksLikeRecordArray(items)` — heurystyka sprawdzająca, czy tablica wygląda jak lista rekordów.
- `findCollectionInNode(node, keywords, visited)` — rekurencyjne wyszukiwanie kolekcji po słowach kluczowych.
- `getCollection(db, keywords)` — zwraca kolekcję rekordów dla podanych słów kluczowych.
- `resolveNameKey(record)` — znajduje klucz nazwy rekordu (cache w `nameKeyCache`).
- `getRecordName(record, index)` — zwraca nazwę rekordu lub fallback „Rekord n”.
- `compareStrings(left, right, { descending })` — porównanie stringów z normalizacją i opcją sortowania malejącego (locale `pl`).
- `getSortableType(record)` — zwraca znormalizowaną wartość pola typu (`Typ`, `Type`).
- `sortRecords(records, compare)` — stabilne sortowanie rekordów z zachowaniem kolejności wejściowej przy remisie.
- `sortByName(records)` — sortuje rekordy alfabetycznie po nazwie.
- `sortByTypeThenName(records, { typeDescending })` — sortuje po typie, a następnie po nazwie (opcjonalnie malejąco po typie).
- `findRecordKey(record, label)` — znajduje klucz odpowiadający etykiecie (porównanie znormalizowane).
- `getRecordValue(record, label)` — odczytuje wartość pola z rekordu.
- `parseNumericValue(value, fallback)` — wyciąga liczbę z tekstu lub zwraca wartość domyślną.
- `getBestiaryWpMinimum(record)` — wyznacza minimalną wartość pola „Odporność (w tym WP)” na podstawie WP (lub 1, gdy WP to `-`).
- `getEditableNumericMinimum(label, record)` — zwraca minimum dla edytowalnego pola (1 lub wartość WP).
- `getNumericOverride(label)` — pobiera nadpisaną wartość liczbową z `state.bestiaryOverrides`.
- `resetBestiaryOverrides()` — czyści wszystkie nadpisania bestiariusza i wyłącza tryb edycji „Umiejętności”.

### 8.4. Specyfika pancerzy i cech
- `getArmorWpValue(record)` — odczytuje wartość WP z rekordu pancerza.
- `isArmorBlocked(record)` — blokuje pancerze z WP „-”.
- `isBestiaryArmorBlocked(record)` — sprawdza, czy bestiariusz ma blokującą wartość WP.
- `buildTraitsMap(data)` — buduje Mapę cech z `_meta.traits`.
- `resolveTraitDescription(traitName)` — zwraca opis cechy z mapy (lub komunikat o braku opisu).

### 8.5. UI i renderowanie tabel
- `setStatus(message)` — ustawia tekst statusu w panelu danych.
- `updateModuleVisibility()` — ukrywa/pokazuje moduły według checkboxów.
- `setSelectOptions(select, items, placeholder, { disableOption, disabledTitle })` — wypełnia select opcjami.
- `clearTableBody(tbody, message, colSpan)` — czyści tabelę i wstawia komunikat.
- `createTag(traitName)` — tworzy element `.tag` dla cechy.
- `renderTraitsCell(value, columnClass)` — renderuje komórkę cech jako zestaw tagów.
- `createClampCell(sheetName, rowId, key, valueString, columnClass)` — tworzy komórkę z mechanizmem clamp.
- `createNumericInputCell(record, key, valueString)` — tworzy pole `number` z minimum zależnym od WP i zapisuje nadpisanie do `state.bestiaryOverrides`.
- `createSkillsRow(record, key, valueString)` — renderuje wiersz „Umiejętności” z przyciskiem **Edytuj/Zapisz** i `textarea`.
- `renderOrderedTable({ tableBody, records, columns, sheetName })` — renderuje tabelę z określonymi kolumnami.
- `renderBestiaryTable(record)` — renderuje tabelę bazowego bestiariusza, podmieniając wybrane komórki na pola edycyjne.

### 8.6. Konfiguracje kolumn
- `weaponColumns`, `armorColumns`, `augmentationsColumns`, `equipmentColumns`, `talentsColumns`, `psionicsColumns`, `prayersColumns` — listy nagłówków dla tabel modułów.

### 8.7. Obsługa wyborów
- `getSelectedIndices(select)` — zwraca indeksy zaznaczonych opcji.
- `renderWeaponTable()`, `renderArmorTable()`, `renderAugmentationsTable()`, `renderEquipmentTable()`, `renderTalentsTable()`, `renderPsionicsTable()`, `renderPrayersTable()` — renderują odpowiednie tabele według aktualnego wyboru.
- `setArmorSelectionEnabled(enabled)` — włącza/wyłącza select pancerzy.
- `updateBestiarySelection()` — aktualizuje podgląd bestiariusza i stan pancerzy, resetuje nadpisania przy zmianie rekordu.

### 8.8. Formatowanie sekcji na karcie
- `splitEntries(raw)` — dzieli wpisy na sekcje wg heurystyki (np. `Nazwa — ...`, `Etykieta: ...`, `*[n]`, `[n]`).
- `formatSectionEntries(entries)` — tworzy HTML z naprzemiennym tłem wierszy.

### 8.9. Moduły i agregacja danych
- `getSelectedRecords(records, selectedIndices)` — mapuje wybór na listę rekordów.
- `getTraitNamesFromRecords(records)` — wyciąga i normalizuje unikalne cechy.
- `buildTraitDescriptionLine(records, label)` — generuje linię „Cechy: ...” z opisami.
- `parseArmorWpValue(value)` — parsuje WP pancerza (liczba, gwiazdka, tekst).
- `getArmorOverrides(records, { includeTraitDescriptions })` — agreguje WP i cechy pancerzy.
- `buildWeaponEntry(record)` — buduje pojedynczy wpis ataku (z `Obrażenia`, `DK`, `PP`, `Zasięg`, `Szybkostrzelność`).
- `buildWeaponOverride(records, { includeTraitDescriptions })` — tworzy listę ataków oraz opis cech z broni.
- `buildModuleEntries(records, columns, { includeFull, normalizeColumns })` — generuje listę wpisów modułu (nazwy + szczegóły).

### 8.10. Parsowanie wartości liczbowych
- `normalizeStarPrefix(value, hasStar)` — usuwa gwiazdki i dodaje je wg potrzeby.
- `formatNumericWithStar(numeric, hasStar, fallbackText)` — buduje wartość z gwiazdką.
- `parseStarNumber(value)` — parsuje liczbę i informację o gwiazdce.
- `extractWpFromResistance(value)` — wyciąga WP z pola „Odporność”.

### 8.11. Karta do druku
- `buildPrintableCardHTML(record, notes, { weaponOverride, armorOverride, moduleEntries, bestiaryOverrides })` — generuje pełny HTML karty do druku z osobnymi stylami (czarno-biała karta, układ tabelaryczny), uwzględniając nadpisania liczb i „Umiejętności”.
  - Sekcje kart: tytuł, zagrożenie, słowa kluczowe, statystyki, odporność, pancerze/cechy, obrona/żywotność/odporność psychiczna, bloki opisowe (umiejętności, premie, zdolności, atak, horda itd.), upór/odwaga/szybkość/rozmiar, notatki.
- `openPrintableCard(record, notes, overrides)` — otwiera nową kartę i wstrzykuje wygenerowany HTML.

### 8.12. Eventy i inicjalizacja
- `attachListeners()` — podpina listenery `change` i `click`, resetuje stan, generuje kartę.
- `loadData()` — pobiera dane, inicjalizuje listy wyboru, wypełnia tabele i status.
- Listener `document.addEventListener("click")` — obsługuje popover tagów cech.
- Na końcu: `attachListeners(); updateModuleVisibility(); loadData();`.

---

## 9. Mechanizm clamp (skracanie długich pól)
- Długie komórki są skracane do `CLAMP_LINES`.
- Jeśli komórka ma więcej linii niż limit, pokazuje się wskazówka „kliknij, aby rozwinąć”.
- Kliknięcie przełącza stan rozwinięcia i zapisuje go w `state.expandedCells`.
- `ResizeObserver` przelicza, czy komórka nadal wymaga clampa po zmianie rozmiaru.

---

## 10. Logika generowania karty do druku
- Karta jest generowana w nowym oknie i posiada własny zestaw stylów inline.
- W sekcji „Odporność” wartość WP jest opisywana etykietą „w tym Pancerz”.
- Jeśli użytkownik zmodyfikuje statystyki lub „Umiejętności”, karta używa wartości z `bestiaryOverrides`; edytowana „Odporność (w tym WP)” jest bazą do przeliczeń z pancerzem.
- Dla modułu psioniki możliwe jest normalizowanie kolumny „Wzmocnienie” do jednej linii.
- Sekcje bez danych są pomijane.
- Zastosowano naprzemienny „zebra striping” dla bloków z listami wpisów.

---

## 11. Instrukcje utrzymaniowe
- Po każdej zmianie kodu należy zaktualizować `docs/Documentation.md` i `docs/README.md`.
- `docs/README.md` musi zawierać instrukcje użytkownika w języku polskim i angielskim.
- `docs/Documentation.md` musi opisywać wszystkie funkcje, style, fonty oraz zasady działania UI, aby umożliwić rekonstrukcję aplikacji 1:1.

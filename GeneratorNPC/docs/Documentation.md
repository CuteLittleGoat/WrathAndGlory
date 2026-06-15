# Generator NPC — dokumentacja techniczna (pełny opis)

## 1. Cel aplikacji i ogólny opis

Generator NPC jest narzędziem do losowania, modyfikowania i zapisu profili postaci niezależnych. Interfejs działa po stronie przeglądarki, a dane źródłowe są pobierane z prywatnego zasobu DataVault przez Firebase.

## 2. Źródło danych

GeneratorNPC nie korzysta obecnie z publicznego pliku `../DataVault/data.json` jako głównego źródła danych.

Aktualny przepływ danych wygląda następująco:

1. Strona ładuje `../shared/firebase-config.js`.
2. Strona ładuje `../shared/firebase-data-loader.js`.
3. Loader inicjalizuje nazwaną aplikację Firebase `wh40k-data-slate-private-data`.
4. Użytkownik przechodzi ekran dostępu K.O.Z.A. i loguje się hasłem technicznego konta Firebase Authentication.
5. Po autoryzacji loader odczytuje Realtime Database ze ścieżki `datavault/live`.
6. Jeżeli odczytany obiekt jest wrapperem `datavault-firebase-import-v1`, loader parsuje pole `dataJson`.
7. GeneratorNPC oczekuje finalnego obiektu danych zawierającego `sheets`.
8. Z `sheets` budowane są kolekcje: bestiariusz, pancerze, bronie, augumentacje, ekwipunek, talenty, psionika i modlitwy.

## 3. Ekran dostępu

Moduł pokazuje ekran dostępu przed załadowaniem prywatnych danych. Teksty ekranu używają motywu K.O.Z.A. i Rytuału Uwierzytelnienia.

Najważniejsze elementy ekranu:
- tytuł: „Dostęp do danych z klauzulą tajności K.O.Z.A.”,
- opis informujący o Litanii Dostępu i Rytuale Uwierzytelnienia,
- pole hasła `accessPassword`,
- przycisk „Rozpocznij Rytuał”,
- pole błędu `accessError`.

Błędy dostępu są tłumaczone przez `getReadableAccessError` ze wspólnego loadera Firebase.

## 4. Ulubione profile NPC

Ulubione profile NPC są niezależne od prywatnego DataVault.

Jeżeli `GeneratorNPC/config/firebase-config.js` zawiera poprawne `window.firebaseConfig`, moduł tworzy osobną nazwaną aplikację Firebase `generator-npc-favorites` i zapisuje ulubione w Firestore:

`generatorNpc/favorites`

Jeżeli Firestore nie jest dostępny albo konfiguracja nie istnieje, moduł przechodzi na lokalny zapis w `localStorage` pod kluczem `generatorNpcFavorites`.


## 5. Struktura projektu
- `index.html` — główny dokument HTML (tytuł karty: `Generator NPC`), zawiera szkielet UI oraz cały skrypt JS.
- `style.css` — komplet stylów interfejsu (layout, typografia, tabele, popover, układ responsywny).
- `config/firebase-config.js` — konfiguracja Firebase (ten sam projekt co Audio) używana do zapisu listy ulubionych.
- `config/firebase-config.template.js` — szablon konfiguracji Firebase do podmiany.
- `docs/Documentation.md` — niniejsza dokumentacja techniczna.
- `docs/README.md` — instrukcja obsługi dla użytkownika (PL/EN).

---

## 6. Dane wejściowe i źródło
**Źródło danych głównych (runtime NPC):**
- Dane są pobierane z prywatnego runtime DataVault przez wspólny loader `../shared/firebase-data-loader.js`.
- Loader korzysta z Firebase Auth oraz Firebase Realtime Database (`/datavault/live`).
- Sekcja „Źródło danych” w UI pokazuje status ładowania i nie eksponuje publicznego linku do statycznego pliku JSON.

**Wczytywanie danych:**
- Dane są pobierane asynchronicznie przez `loadDataVaultRuntimeData(...)` po inicjalizacji konfiguracji Firebase.
- Po wczytaniu dane są analizowane i rozdzielane na kolekcje: bestiariusz, pancerze, bronie, augumentacje, ekwipunek, talenty, psionika, modlitwy.
- Kolekcje są sortowane przed zasileniem list wyboru: domyślnie po kolumnie `LP` (jeśli istnieje), a gdy jej brak — bestiariusz, talenty i modlitwy alfabetycznie po nazwie; broń, pancerze, augumentacje, ekwipunek po typie i nazwie; psionika po typie malejąco i nazwie.

**Meta dane:**
- `_meta.traits` zawiera listę cech wraz z opisami wykorzystywanymi w popoverze.

**Ulubione (Firebase / localStorage):**
- Aplikacja zapisuje listę ulubionych w Firestore w dokumencie `generatorNpc/favorites` (jedna lista).
- Jeśli Firestore jest niedostępny lub brak konfiguracji, dane są zapisywane lokalnie w `localStorage` pod kluczem `generatorNpcFavorites`.

---

## 7. Struktura HTML i elementy UI

### 7.1. Pasek górny (`.topbar`)
- Zawiera tytuł aplikacji, przełącznik języka oraz dwa przyciski:
  - **Wersja językowa** (`#languageSelect`) — select z opcjami PL/EN, z ciemnym tłem.
  - **Reset** (`#reset-page`) — przywraca domyślny stan wyborów.
  - **Generuj kartę** (`#generate-card`) — uruchamia generowanie karty do druku.

### 7.2. Panel boczny (`.sidebar`)
Składa się z trzech sekcji:
1. **Źródło danych** — informuje o prywatnym źródle DataVault i statusie wczytywania (`#data-status`). Sekcja używa klas `panel-data-source` i `data-source-text`; status ładowania danych jest wyświetlany w `#data-status`. Interfejs nie eksponuje publicznego linku do statycznego pliku JSON.
2. **Wybór bazowy** — wybór rekordu bestiariusza (`#bestiary`) + notatki (`#bestiary-notes`).
3. **Moduły aktywne** — checkboxy włączające/wyłączające karty modułów:
   - Broń, Pancerz, Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy.
4. **Ulubione** — panel zapisu i odczytu zapisanych konfiguracji:
   - `#favorites-status` — informacja o statusie połączenia z Firestore.
   - `#favorites-alias` — pole aliasu (opcjonalne) dla nowego wpisu.
   - `#favorites-add`, `#favorites-refresh` — przyciski zapisu i odświeżenia listy.
   - `#favorites-list` — lista zapisanych wpisów z akcjami „Wczytaj”, „Usuń” oraz strzałkami ▲/▼ do zmiany kolejności.

### 4.3. Obszar roboczy (`.workspace`)
Zawiera karty z tabelami danych:
- **Podgląd bazowy Bestiariusza** (`#bestiary-table-body`).
  - W wybranych wierszach (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Żywotność, Odporność Psychiczna, Upór, Odwaga, Szybkość) zamiast tekstu pojawiają się pola `number` z przyciskami góra–dół.
  - Pole „Odporność Psychiczna” jest blokowane dla rekordów z wartością `-` (brak edycji).
  - Pola liczbowe są ograniczone do 25 znaków — nadmiar jest automatycznie obcinany również przy wstępnym ustawieniu wartości — oraz mają wizualny limit szerokości 25ch.
  - Wiersze „Umiejętności” i „Słowa Kluczowe” posiadają przycisk **Edytuj** w kolumnie klucza, który przełącza komórkę na edycję w `textarea`; po kliknięciu **Zapisz** zapisany podgląd wraca przez standardowy formatter komórki.
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
- `.panel-data-source .data-source-text` — zmniejszony rozmiar tekstu (`0.82rem`) i zwiększona wysokość linii (`1.55`) wyłącznie w panelu „Źródło danych”.
- `.panel-data-source .data-source-link` — wymusza łamanie długiego adresu (`overflow-wrap: anywhere`, `word-break: break-word`), co zapobiega wychodzeniu linku poza ramkę panelu.
- `.badge` — etykieta typu „Bestiariusz”.

### 6.4. Formularze
- `select`, `input`, `textarea` — jednolite tła, obramowania, fokus (`box-shadow: var(--glow)`).
- `.field`, `.field-label-row` — układ etykiet i kontroli.
- `.checkbox`, `.checkbox-list`, `.checkbox-inline` — checkboxy modułów i ustawień szczegółów.
- `.table-number-input` — wąskie pole `number` w tabeli bestiariusza (mniejszy padding i font); wejście jest obcinane do 25 znaków, a szerokość jest ograniczona do 25ch (`width: min(25ch, 100%); max-width: 25ch`).
- `.editable-textarea` — pole edycji tekstowej dla „Umiejętności” i „Słowa Kluczowe” (ciemne tło, resize w pionie, focus z `--glow`).
- `.skills-key-cell` — układ flex dla etykiety edytowalnego pola tekstowego i przycisku **Edytuj/Zapisz**.
- `.btn.btn-small` — kompaktowa wersja przycisku dla edycji w tabeli.
- `.editable-text-button` — jasny wariant przycisku **Edytuj/Zapisz** dla edytowalnych pól tekstowych (`border-color: var(--code)`, `color: var(--code)`, `opacity: 1`), zgodny z kolorem numerów stron w DataVault.
- `.favorites-actions`, `.favorites-list`, `.favorite-item`, `.favorite-title`, `.favorite-subtitle`, `.favorite-actions` — layout i typografia listy ulubionych.

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

### 6.10. Karta do druku — trackery „Ż/T” (PL) / „H/S” (EN)
Style te są wbudowane w HTML karty do druku (`buildPrintableCardHTML`):
- `.tracker-section` — kontener z paddingiem `6px 8px`, układ `grid` i `gap: 6px`, zakończony dolną ramką `1px solid #111`.
- `.tracker-row` — pojedynczy wiersz trackera z dwoma kolumnami (etykieta + siatka pól):
  - zmienne `--tracker-size: 18px`, `--tracker-gap: 1px`,
  - `display: grid`, `grid-template-columns: var(--tracker-size) 1fr`,
  - `column-gap: 1px`, etykieta i pola są niezależnymi elementami.
- `.tracker-squares` — siatka pustych kwadratów:
  - `display: grid`, `grid-template-columns: repeat(auto-fit, var(--tracker-size))`,
  - `grid-auto-rows: var(--tracker-size)`,
  - `gap: 1px`, siatka rozciąga się na całą szerokość karty (bez sztucznego limitu liczby kolumn).
- `.tracker-cell` — pojedynczy kwadrat (tło `#fff`, obramowanie `1px solid #111`, wyśrodkowany tekst).
- `.tracker-label` — etykieta trackera (PL: „Ż”/„T”, EN: „H”/„S”) osadzona w `<label>`:
  - ma stałą szerokość `var(--tracker-size)`,
  - wysokość to `var(--tracker-size)`, czyli pojedynczy kwadrat niezależny od liczby linii.
- `.tracker-row--mental` — wariant z szarym wypełnieniem pól (`--tracker-fill: #e9e9e9`).

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
- `loadDataVaultRuntimeData(...)` — główny mechanizm ładowania danych z prywatnego runtime DataVault (Firebase Auth + RTDB).
- `CLAMP_LINES = 9` — liczba linii do przycinania komórek.
- `MAX_NUMERIC_INPUT_LENGTH = 25` — maksymalna długość tekstu w polach liczbowych bestiariusza (obcina nadmiar znaków przy inicjalizacji, wpisywaniu i zapisie).
- `CARD_LEVEL_COLUMNS = 5` — liczba kolumn poziomu na karcie do druku. Stała steruje równocześnie:
  - limitem znaków pobieranych z pola `Zagrożenie`,
  - dopełnianiem pustych komórek do stałej szerokości wiersza,
  - renderowaniem nagłówka `Poziom` (1..N),
  - siatką CSS `.row` (`grid-template-columns: 140px repeat(N, 1fr)`).
- `FAVORITES_STORAGE_KEY = "generatorNpcFavorites"` — klucz `localStorage` dla ulubionych.
- `FAVORITES_COLLECTION = "generatorNpc"` i `FAVORITES_DOC_ID = "favorites"` — docelowa ścieżka dokumentu w Firestore.
- `EDITABLE_STATS_KEYS`, `EDITABLE_SKILLS_KEY`, `EDITABLE_KEYWORDS_KEY`, `EDITABLE_RESISTANCE_KEYS`, `EDITABLE_MENTAL_RESISTANCE_KEYS`, `EDITABLE_NUMERIC_KEYS` — definicje pól bestiariusza, które mają wbudowaną edycję (liczbowe oraz tekstowe „Umiejętności” i „Słowa Kluczowe”).
- `state` — obiekt z danymi aplikacji i stanem UI:
  - `data`, `traits` (Map), `expandedCells` (Set), `selectedBestiaryIndex`,
  - `bestiaryOverrides` — obiekt nadpisań wprowadzonych przez użytkownika:
    - `numeric` (Map) dla pól liczbowych,
    - `skills` (string) dla „Umiejętności”,
    - `skillsEditing` (boolean) przełączający tryb edycji „Umiejętności”,
    - `keywords` (string) dla „Słowa Kluczowe”,
    - `keywordsEditing` (boolean) przełączający tryb edycji „Słowa Kluczowe”,
  - kolekcje: `bestiary`, `armor`, `weapons`, `augmentations`, `equipment`, `talents`, `psionics`, `prayers`.
  - ulubione: `favorites` (tablica wpisów), `firestore` (instancja), `favoritesDoc` (referencja), `usingFirestore` (flaga).
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

### 8.3. Ulubione — logika zapisu
- `setFavoritesStatus(message, { isError })` — aktualizuje status połączenia/operacji ulubionych.
- `createFavoriteId()` — generuje unikalne ID wpisu (UUID lub fallback z timestampem).
- `serializeBestiaryOverrides()` / `deserializeBestiaryOverrides()` — zamieniają Map ↔ obiekt do zapisu w Firestore/localStorage.
- `setSelectedIndices()` — ustawia zaznaczenie w `<select multiple>` na podstawie tablicy indeksów.
- `renderFavorites()` — buduje listę wpisów wraz z przyciskami „Wczytaj”, „Usuń” i strzałkami do przesuwania wpisów w górę/dół (pierwszy/ostatni wpis ma zablokowane odpowiednie strzałki).
- `loadFavoritesFromLocal()` / `saveFavoritesToLocal()` — obsługa `localStorage`.
- `saveFavorites()` — zapis do Firestore (z `updatedAt: serverTimestamp()`), a przy błędzie fallback do lokalnego zapisu.
- `initFavoritesStore()` — inicjalizacja Firebase i nasłuch `onSnapshot()` lub fallback na pamięć lokalną.
- `buildFavoritePayload()` — tworzy snapshot bieżącego UI (bestiariusz, nadpisania, notatki, wybory modułów, przełączniki).
- `addFavorite()` / `removeFavorite()` — dodawanie i usuwanie wpisów z listy.
- `moveFavorite()` — przesuwa wpis o jedną pozycję w górę lub dół i zapisuje nową kolejność.
- `applyFavorite()` — odtwarza zapisany stan UI i re-renderuje tabele.

### 8.4. Funkcje narzędziowe (rekordy i kolekcje)
- `canonicalTraitName(name)` — normalizuje nazwę cechy.
- `toDisplayString(value)` — bezpiecznie zwraca string (pusty jeśli brak wartości).
- `hasMeaningfulValue(value)` — sprawdza, czy tekst ma realną zawartość.
- `getRecordValueByLabels(record, labels)` — zwraca wartość pierwszej pasującej etykiety.
- `extractRecords(section)` — wydobywa tablicę rekordów z obiektu sekcji.
- `getSectionName(section)` — zwraca nazwę sekcji (normalizuje nazwy pól `name`).
- `looksLikeRecordArray(items)` — heurystyka sprawdzająca, czy tablica wygląda jak lista rekordów.
- `findCollectionInNode(node, keywords, visited)` — rekurencyjne wyszukiwanie kolekcji po słowach kluczowych.
- `getRequiredCollection(db, exactSheetName)` — pobiera rekordy wyłącznie z dokładnie wskazanego wymaganego arkusza `data.sheets`; zgłasza `GENERATORNPC_DATA_MISSING_SHEETS`, gdy brakuje kontenera arkuszy, `GENERATORNPC_REQUIRED_SHEET_MISSING:<arkusz>`, gdy brakuje arkusza, oraz `GENERATORNPC_REQUIRED_SHEET_EMPTY:<arkusz>`, gdy arkusz nie zawiera rekordów po `extractRecords(...)`.
- `getGeneratorDataLoadErrorMessage(error)` — zamienia techniczne kody błędów wymaganych arkuszy na czytelne komunikaty statusu i okna dostępu.
- `resolveNameKey(record)` — znajduje klucz nazwy rekordu (cache w `nameKeyCache`).
- `getRecordName(record, index)` — zwraca nazwę rekordu lub fallback „Rekord n”.
- `compareStrings(left, right, { descending })` — porównanie stringów z normalizacją i opcją sortowania malejącego (locale `pl`).
- `getSortableLp(record)` — odczytuje `LP` jako wartość liczbową, zwraca `null` gdy brak/niepoprawne.
- `getSortableType(record)` — zwraca znormalizowaną wartość pola typu (`Typ`, `Type`).
- `sortRecords(records, compare)` — stabilne sortowanie rekordów z zachowaniem kolejności wejściowej przy remisie; priorytetowo sortuje po `LP`, jeśli oba rekordy mają tę wartość.
- `sortByName(records)` — sortuje rekordy alfabetycznie po nazwie.
- `sortByTypeThenName(records, { typeDescending })` — sortuje po typie, a następnie po nazwie (opcjonalnie malejąco po typie).
- `findRecordKey(record, label)` — znajduje klucz odpowiadający etykiecie (porównanie znormalizowane).
- `getRecordValue(record, label)` — odczytuje wartość pola z rekordu.
- `parseNumericValue(value, fallback)` — wyciąga liczbę z tekstu lub zwraca wartość domyślną.
- `getBestiaryWpMinimum(record)` — wyznacza minimalną wartość pola „Odporność (w tym WP)” na podstawie WP (lub 1, gdy WP to `-`).
- `getEditableNumericMinimum(label, record)` — zwraca minimum dla edytowalnego pola (1 lub wartość WP).
- `getNumericOverride(label)` — pobiera nadpisaną wartość liczbową z `state.bestiaryOverrides`.
- `resetBestiaryOverrides()` — czyści wszystkie nadpisania bestiariusza i wyłącza tryb edycji „Umiejętności” oraz „Słowa Kluczowe”.

### 8.13. Specyfika pancerzy i cech
- `getArmorWpValue(record)` — odczytuje wartość WP z rekordu pancerza.
- `isArmorBlocked(record)` — blokuje pancerze z WP „-”.
- `isBestiaryArmorBlocked(record)` — sprawdza, czy bestiariusz ma blokującą wartość WP.
- `isBestiaryMentalResistanceBlocked(record)` — blokuje edycję „Odporność Psychiczna”, gdy pole ma wartość `-`.
- `buildTraitsMap(data)` — buduje Mapę cech z `_meta.traits`.
- `resolveTraitDescription(traitName)` — zwraca opis cechy z mapy (lub komunikat o braku opisu).

### 8.13. UI i renderowanie tabel
- `setStatus(message)` — ustawia tekst statusu w panelu danych.
- `updateModuleVisibility()` — ukrywa/pokazuje moduły według checkboxów.
- `setSelectOptions(select, items, placeholder, { disableOption, disabledTitle })` — wypełnia select opcjami.
- `clearTableBody(tbody, message, colSpan)` — czyści tabelę i wstawia komunikat.
- `createTag(traitName)` — tworzy element `.tag` dla cechy.
- `renderTraitsCell(value, columnClass)` — renderuje komórkę cech jako zestaw tagów.
- `createClampCell(sheetName, rowId, key, valueString, columnClass)` — tworzy komórkę z mechanizmem clamp.
- `createNumericInputCell(record, key, valueString)` — tworzy pole `number` z minimum zależnym od WP, obcina wpis do 25 znaków i zapisuje nadpisanie do `state.bestiaryOverrides`.
- `EDITABLE_TEXT_FIELDS` — mapuje znormalizowane klucze `Umiejętności` i `Słowa Kluczowe` na pola stanu (`skills`/`skillsEditing`, `keywords`/`keywordsEditing`).
- `createEditableTextRow(record, key, valueString, config)` — renderuje edytowalny wiersz tekstowy z przyciskiem **Edytuj/Zapisz** i `textarea`; w trybie podglądu używa `createClampCell`, więc ręcznie zapisane „Słowa Kluczowe” nadal przechodzą przez `getFormattedCellHTML("Bestiariusz", "Słowa Kluczowe", ...)` i zachowują czerwony kolor tekstu z neutralnymi przecinkami.
- `renderOrderedTable({ tableBody, records, columns, sheetName })` — renderuje tabelę z określonymi kolumnami.
- `renderBestiaryTable(record)` — renderuje tabelę bazowego bestiariusza, podmieniając wybrane komórki na pola edycyjne (z blokadą „Odporność Psychiczna” przy wartości `-` oraz tekstową edycją „Umiejętności” i „Słowa Kluczowe”).

### 8.13. Konfiguracje kolumn
- `weaponColumns`, `armorColumns`, `augmentationsColumns`, `equipmentColumns`, `talentsColumns`, `psionicsColumns`, `prayersColumns` — listy nagłówków dla tabel modułów.

### 8.13. Obsługa wyborów
- `getSelectedIndices(select)` — zwraca indeksy zaznaczonych opcji.
- `renderWeaponTable()`, `renderArmorTable()`, `renderAugmentationsTable()`, `renderEquipmentTable()`, `renderTalentsTable()`, `renderPsionicsTable()`, `renderPrayersTable()` — renderują odpowiednie tabele według aktualnego wyboru.
- `setArmorSelectionEnabled(enabled)` — włącza/wyłącza select pancerzy.
- `updateBestiarySelection()` — aktualizuje podgląd bestiariusza i stan pancerzy, resetuje nadpisania przy zmianie rekordu.

### 8.13. Formatowanie sekcji na karcie
- `splitEntries(raw)` — dzieli wpisy na sekcje wg heurystyki (np. `Nazwa — ...`, `Etykieta: ...`, `*[n]`, `[n]`).
- `formatSectionEntries(entries)` — tworzy HTML z naprzemiennym tłem wierszy.

### 8.13. Moduły i agregacja danych
- `getSelectedRecords(records, selectedIndices)` — mapuje wybór na listę rekordów.
- `getTraitNamesFromRecords(records)` — wyciąga i normalizuje unikalne cechy.
- `buildTraitDescriptionLine(records, label)` — generuje linię „Cechy: ...” z opisami.
- `parseArmorWpValue(value)` — parsuje WP pancerza (liczba, gwiazdka, tekst).
- `getArmorOverrides(records, { includeTraitDescriptions })` — agreguje WP i cechy pancerzy.
- `buildWeaponEntry(record)` — buduje pojedynczy wpis ataku (z `Obrażenia`, `DK`, `PP`, `Zasięg`, `Szybkostrzelność`).
- `buildWeaponOverride(records, { includeTraitDescriptions })` — tworzy listę ataków oraz opis cech z broni.
- `buildModuleEntries(records, columns, { includeFull, normalizeColumns })` — generuje listę wpisów modułu (nazwy + szczegóły).

### 8.13. Parsowanie wartości liczbowych
- `normalizeStarPrefix(value, hasStar)` — usuwa gwiazdki i dodaje je wg potrzeby.
- `formatNumericWithStar(numeric, hasStar, fallbackText)` — buduje wartość z gwiazdką.
- `parseStarNumber(value)` — parsuje liczbę i informację o gwiazdce.
- `extractWpFromResistance(value)` — wyciąga WP z pola „Odporność”.
- `resolveTrackerCount(value)` — wewnętrzna funkcja karty do druku zamienia wartość „Żywotność” lub „Odporność Psychiczna” na liczbę kwadratów (ignoruje brak liczby i ujemne wartości).

### 8.13. Karta do druku
- `buildPrintableCardHTML(record, notes, { weaponOverride, armorOverride, moduleEntries, bestiaryOverrides })` — generuje pełny HTML karty do druku z osobnymi stylami (czarno-biała karta, układ tabelaryczny), uwzględniając nadpisania liczb, „Umiejętności” i „Słowa Kluczowe”, a etykiety karty są wybierane z tłumaczeń (PL/EN).
  - Sekcje kart: tytuł, zagrożenie, słowa kluczowe, statystyki, odporność, pancerze/cechy, obrona/żywotność/odporność psychiczna, **trackery pól „Ż/T” (PL) / „H/S” (EN)**, bloki opisowe (umiejętności, premie, zdolności, atak, horda itd.), upór/odwaga/szybkość/rozmiar, notatki.
  - Mechanizm `CARD_LEVEL_COLUMNS = 5` działa jako pojedyncze źródło prawdy dla sekcji `Poziom/Zagrożenie`: parser obcina dane do 5 znaków, fallback (`split("")`) zachowuje nietypowe znaki jak `?`, brakujące wartości są dopełniane pustymi komórkami, a nagłówek poziomów jest budowany dynamicznie (`1..5`).
  - Dzięki temu rekordy `PPPPP` renderują komplet pięciu kolumn, a krótsze rekordy (np. `?`) zostawiają puste pola od kolumny 2 do 5.
- Trackery są generowane dynamicznie: osobne siatki z etykietami „Ż”/„T” w PL lub „H”/„S” w EN oraz pustymi kwadratami. Liczba kwadratów wynika z „Żywotność” i „Odporność Psychiczna”, a gdy „Odporność Psychiczna” ma wartość `-`, renderowana jest tylko etykieta trackera.
  - Układ trackerów używa inline CSS z przezroczystym tłem i ramkami pól (brak ciemnego wypełnienia po prawej stronie), a liczba pól w wierszu jest obliczana przez `grid-template-columns: repeat(auto-fit, ...)`.
- `openPrintableCard(record, notes, overrides)` — otwiera nową kartę i wstrzykuje wygenerowany HTML.

### 8.13. Eventy i inicjalizacja
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
- Jeśli użytkownik zmodyfikuje statystyki, „Umiejętności” lub „Słowa Kluczowe”, karta używa wartości z `bestiaryOverrides`; edytowana „Odporność (w tym WP)” jest bazą do przeliczeń z pancerzem, a „Odporność Psychiczna” jest przenoszona bezpośrednio na kartę. Słowa kluczowe na karcie pozostają czarno-białe, ponieważ karta używa `formatInlineHTML(keywords)` i własnych stylów druku.
- Trackery „Ż/T” obliczają liczbę kwadratów na podstawie wartości liczbowych; etykiety „Ż/T” to niezależne pojedyncze kwadraty, a siatka pól skaluje się do szerokości wiersza dzięki `auto-fit`.
- Dla modułu psioniki możliwe jest normalizowanie kolumny „Wzmocnienie” do jednej linii.
- Sekcje bez danych są pomijane.
- Bloki z listami wpisów używają naprzemiennego „zebra striping”.

---

## 11. Instrukcje utrzymaniowe
Po każdej zmianie kodu modułu należy zaktualizować:
- `GeneratorNPC/docs/Documentation.md`,
- `GeneratorNPC/docs/README.md`.

`docs/README.md` jest instrukcją użytkownika i powinien zawierać pełną wersję polską oraz pełną wersję angielską.

`docs/Documentation.md` jest dokumentacją techniczną i powinien opisywać funkcje, style, fonty, strukturę danych, integracje Firebase oraz zasady działania UI w sposób pozwalający odtworzyć moduł 1:1.

## 12. Dokument referencyjny Firebase
Specyfikacja Firebase dla modułu GeneratorNPC znajduje się w pliku:

`GeneratorNPC/config/FirebaseREADME.md`

Dokument opisuje konfigurację Web Firebase używaną przez moduł, zapis ulubionych w Firestore oraz fallback do `localStorage`.

## 13. Stan rekordu, przekreślenie i stabilna geometria tabeli
### 13.1. Formatowanie inline
Funkcja `formatInlineHTML(raw)` obsługuje markery:
- `{{RED}}...{{/RED}}`,
- `{{B}}...{{/B}}`,
- `{{I}}...{{/I}}`,
- `{{S}}...{{/S}}`.

Segmenty oznaczone markerem `{{S}}` otrzymują klasę `.inline-strike` i są renderowane jako przekreślone. Jeżeli segment jest jednocześnie czerwony i przekreślony, klasa `.inline-red` utrzymuje czerwony kolor tekstu.

### 13.2. Pole `Stan` i rekordy `old`
Helper `isOldBestiaryRecord(record)` odczytuje wartość pola `Stan` w sposób niewrażliwy na wielkość liter. Wartość jest normalizowana przez `trim()` i `lowercase`, a następnie porównywana z tekstem `old`.

Helper `shouldGrayBestiaryKey(key, record)` działa dla rekordów oznaczonych jako `old` i obejmuje pola:
- `LP`,
- `Nazwa`,
- `Typ`.

W tabeli podglądu bazowego pole techniczne `Stan` nie jest pokazywane jako zwykły wiersz danych. Dla rekordów `old` komórki klucza i wartości pól `LP`, `Nazwa` i `Typ` otrzymują klasę `.bestiary-old-key`.

### 13.3. Geometria tabeli podglądu bazowego
Tabela `.data-table[data-sheet="Bestiariusz"]` używa `table-layout: fixed`.

Pierwsza kolumna (`th:first-child`, `td:first-child`) ma stałą szerokość `25ch`. Druga kolumna przejmuje pozostałą dostępną szerokość.

Ten układ stabilizuje szerokość kolumny „Klucz” między rekordami i zapobiega skokom layoutu podczas zmiany wybranego wpisu bestiariusza.

### 13.4. Zakres działania
Mechanika pola `Stan`, szarego oznaczania rekordów `old` i stabilizacji kolumn dotyczy podglądu bazowego w module GeneratorNPC.

Generator karty do druku używa osobnej ścieżki renderowania przez `buildPrintableCardHTML`.

## 14. Specyfikacja stylu
### 14.1. Kolory UI głównego
- `--bg`: `#031605`; `--bg-grad`: radialne gradienty + `#031605`.
- `--panel` / `--panel2`: `#000`.
- `--text`: `#9cf09c`; `--text2`: `#4FAF4F`; `--muted`: `#4a8b4a`; `--code`: `#D2FAD2`; `--red`: `#d74b4b`.
- `--border`: `#16c60c`; `--accent`: `#16c60c`; `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22,198,12,.35)`; `--b2`: `rgba(22,198,12,.2)`; `--div`: `rgba(22,198,12,.18)`.
- `--hbg`: `rgba(22,198,12,.06)`; `--zebra`: `rgba(22,198,12,.04)`; `--hover`: `rgba(22,198,12,.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`; `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.
- Dodatkowe warstwy tła sekcji używają wariantów `rgba(22,198,12,...)`.
- Akcenty pomocnicze używają wariantów `rgba(111, 227, 140, ...)`.

### 14.2. Fonty
- UI: `"Consolas", "Fira Code", "Source Code Pro", monospace`.
- Karta eksportowana / druk: `"Times New Roman", "Liberation Serif", serif`.

## 15. Mapa logiki aplikacji
- Dane runtime są pobierane z DataVault przez wspólny loader Firebase (`loadDataVaultRuntimeData`).
- Rekordy są transformowane i używane do zasilenia list wyboru.
- Tabela bazowa NPC jest interaktywna i obsługuje edycję części pól liczbowych in-place.
- Moduły broni, pancerza, augumentacji, ekwipunku, talentów, psioniki i modlitw są obsługiwane przez sekcje wielokrotnego wyboru.
- System ulubionych używa Firestore (`generatorNpc/favorites`) z fallbackiem do `localStorage`.
- Karta eksportowa jest generowana jako osobny szablon HTML print z osobną paletą i fontem.

## 16. Firebase i izolacja aplikacji
### 16.1. Dane prywatne NPC
GeneratorNPC uruchamia przepływ `startPrivateDataFlow()`, który:
- sprawdza aktywną sesję,
- pokazuje bramkę hasła przy braku sesji,
- ładuje dane przez `loadDataVaultLive()`.

Moduł nie używa publicznego `data.json` ani bezpośredniego REST `fetch` do `/datavault/live.json`.

`shared/firebase-data-loader.js` używa nazwanej aplikacji Firebase `wh40k-data-slate-private-data` dla Auth + RTDB (`/datavault/live`) i nie korzysta z beznazwowego `getApp()`.

### 16.2. Ulubione
Ulubione są zapisywane w Firestore. Inicjalizacja ulubionych używa nazwanej aplikacji Firebase `generator-npc-favorites` przez helper `getOrCreateNamedFirebaseApp(name, config)`.

Inicjalizacja ulubionych ma zabezpieczenie `try/catch`, dzięki czemu awaria Firestore favorites nie blokuje `startPrivateDataFlow()` i ładowania prywatnych danych NPC.

### 16.3. Wdrożenia dla wielu grup
Dla odizolowanych grup zalecany jest osobny projekt Firebase na grupę.

W pliku `GeneratorNPC/index.html` komentarze `WAŻNE/IMPORTANT` oznaczają istotne miejsca wdrożeniowe:
- `script src="config/firebase-config.js"`,
- inicjalizacja loadera Firebase,
- obsługa zdarzenia gotowości danych.

Po wdrożeniu należy przetestować zapis i odczyt ulubionych.

## 17. Ukryty przełącznik języka
Mechanizm przełączania języka PL/EN jest obecny w kodzie modułu GeneratorNPC, ale przełącznik jest obecnie ukryty w interfejsie użytkownika.

Zwykły użytkownik nie widzi selektora języka.

Lokalizacja techniczna:
- plik: `GeneratorNPC/index.html`,
- kontener: `<div class="language-switcher language-switcher--hidden">`,
- selektor pola: `#languageSelect`,
- opcje: `pl` i `en`,
- komentarz pomocniczy w kodzie: `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA / LANGUAGE SWITCHER VISIBILITY CHANGE POINT`.

Przełącznik ukrywa klasa CSS:

`language-switcher--hidden`

Aby ponownie pokazać przełącznik w interfejsie, należy usunąć klasę `language-switcher--hidden` z kontenera `.language-switcher` albo zmienić powiązaną regułę CSS ukrywającą ten element.

Mechanizm tłumaczeń pozostaje częścią kodu, ponieważ słowniki tłumaczeń i funkcje aktualizacji języka nadal istnieją.

## 18. Dodawanie nowej wersji językowej
Mapa miejsc do aktualizacji przy dodaniu kolejnego języka, na przykład FR albo DE:

1. W kodzie modułu należy znaleźć słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. W selektorze języka należy dodać nową opcję `<option>`, jeśli przełącznik jest aktywny w danym module.
3. W modułach bez widocznego menu językowego należy ręcznie zaktualizować teksty statyczne.
4. Jeśli moduł otwiera instrukcję zależną od języka, należy dodać odpowiedni plik instrukcji.
5. Po dodaniu języka należy sprawdzić przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport i druk.

Miejsca w kodzie są oznaczone komentarzem:

`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`

## 19. Źródło danych
Sekcja „Źródło danych” w UI informuje, że dane są pobierane z prywatnego DataVault po autoryzacji Firebase.

GeneratorNPC używa wspólnego loadera Firebase i otrzymuje rozpakowany obiekt DataVault runtime z `/datavault/live`.

## 20. Bramka dostępu prywatnych danych
Bramka dostępu używa tekstów K.O.Z.A. w wersji PL/EN. GeneratorNPC korzysta ze wspólnego `shared/firebase-data-loader.js` dla błędów autoryzacji i odczytu.

Formularz `#accessForm` używa kontenera `.accessGate__credentials` opartego o CSS Grid:
- lewa kolumna: etykieta `.accessGate__label`,
- prawa kolumna: pole `#accessPassword` (`.accessGate__password`) i przycisk `.accessGate__submit`.

W breakpoint `max-width: 640px` układ przechodzi do jednej kolumny z jawną kolejnością wierszy w `shared/access-gate.css`:
- `.accessGate__label` — wiersz 1,
- `.accessGate__password` — wiersz 2,
- `.accessGate__submit` — wiersz 3.

Wspólny overlay `shared/access-gate.css` jest zakotwiczony do viewportu (`width: 100vw`, `max-width: 100vw`, `height: 100dvh`) i ma `overflow: auto`, dzięki czemu karta hasła pozostaje widoczna także przy szerokim layoucie modułu.

Ikona bramki używa stałego slotu `.accessGate__iconSlot` (`72px × 72px`) z obrazem `../IkonaPowiadomien2.png` renderowanym jako `.accessGate__icon` (`object-fit: contain`), aby ograniczyć przesunięcia layoutu podczas ładowania grafiki.

## 21. Szerokie tabele na telefonie
W `GeneratorNPC/style.css` karty danych używają `overflow-x: auto`, a `.data-table` używa `min-width: max-content`.

Dzięki temu szerokie tabele przewijają się wewnątrz kart zamiast rozszerzać cały dokument.

# 🇵🇱 Dokumentacja techniczna (PL) — źródła danych

GeneratorNPC pobiera kolekcje wyłącznie z dokładnych nazw wymaganych arkuszy w `data.sheets`: `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika` i `Modlitwy`. Każdy z tych arkuszy musi istnieć i musi zawierać co najmniej jeden rekord po odczycie przez `extractRecords(...)`. Brak kontenera `data.sheets`, brak któregokolwiek wymaganego arkusza albo pusty wymagany arkusz zatrzymuje ładowanie i wyświetla czytelny komunikat błędu. Moduł nie używa dopasowania fragmentów nazw arkuszy, dlatego ignoruje arkusze pojazdów, takie jak `Bronie Pojazdów`, `Ekwipunek Pojazdów` i `Cechy Pojazdów`.

# 🇬🇧 Technical documentation (EN) — data sources

GeneratorNPC reads collections only from exact required sheet names in `data.sheets`: `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika`, and `Modlitwy`. Each of these sheets must exist and must contain at least one record after `extractRecords(...)` reads it. A missing `data.sheets` container, a missing required sheet, or an empty required sheet stops loading and shows a readable error message. The module does not match partial sheet names, so it ignores vehicle sheets such as `Bronie Pojazdów`, `Ekwipunek Pojazdów`, and `Cechy Pojazdów`.

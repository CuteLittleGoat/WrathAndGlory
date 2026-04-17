# Administratum Data Vault — przewodnik użytkownika / User Guide

Poniżej znajdują się **identyczne instrukcje** po polsku i angielsku. Aplikacja to statyczny frontend do przeglądania danych Wrath & Glory w formie tabel, bez backendu i bez lokalnych zależności (poza opcjonalnym Pythonem do generowania `data.json`).

Aktualizacja repozytorium (2026-04-15): po wgraniu nowej wersji pliku `Repozytorium.xlsx` (z dodaną kolumną `Gatunek` w zakładce `Archetypy`) ponownie wygenerowano `data.json` dla modułu DataVault, aby zsynchronizować dane widoczne w tabelach.
Repository update (2026-04-15): after uploading a new revision of `Repozytorium.xlsx` (with the new `Gatunek` column in the `Archetypy` sheet), `data.json` was regenerated for the DataVault module to keep table data in sync.

Aktualizacja modułu (2026-04-15): w zakładce `Archetypy` widok domyślny usuwa reguły filtrowania dla kolumny `Frakcja` i zostawia wyłącznie filtr `Gatunek = Człowiek`.
Module update (2026-04-15): in the `Archetypy` tab, the default view no longer applies `Frakcja` filtering rules and keeps only `Gatunek = Człowiek`.

---

## 🇵🇱 Instrukcja (PL)

### Opis
Administratum Data Vault to statyczna aplikacja webowa do przeglądania danych Wrath & Glory w formie tabel. Działa w przeglądarce bez backendu — wystarczy hostować pliki statyczne. Interfejs korzysta z zielonego motywu i tego samego stosu fontów co `Main/index.html`, z wyróżnieniem tekstu pomocniczego (`#4FAF4F`) i jaśniejszym kolorem dla referencji (`#D2FAD2`).

Najważniejsze zasady działania:
- Kolejność zakładek i kolumn pochodzi z `Repozytorium.xlsx` lub z wygenerowanego `data.json`.
- Domyślne sortowanie opiera się o kolumnę `LP` (kolumna jest ukryta w UI, służy tylko do sortowania).
- W arkuszach z kolumnami `Cecha 1..N` i `Zasięg 1..3` aplikacja scala je do `Cechy` i `Zasięg`.
- Kolumny liczbowe są wyśrodkowane; w **Broniach** kolumna `Zasięg` nie zawija wierszy.
- Kolumna `Typ` w zakładkach **Talenty** i **Modlitwy** ma teraz te same parametry co **Bronie / Typ** (`min-width: 14ch`, wyrównanie do lewej).
- Wszystkie tabele używają teraz wyraźnego **zebra striping** (ciemny pas pozostaje bez zmian, jasny pas ma ten sam odcień co poprzedni hover), a najechanie oraz zaznaczenie checkboxa używają tego samego, najmocniejszego podświetlenia wiersza.
- Lewy panel **Filtry** ma stałą szerokość `180px` na desktopie, aby zostawić więcej miejsca na tabelę.
- W trybie admina notatka obok przycisku generowania danych ma większą szerokość (`max-width: 640px`) i zawiera pełną informację: `Repozytorium.xlsx` musi leżeć obok `index.html`, a wygenerowany `data.json` należy tam wgrać, aby odświeżyć dane.
- Aplikacja startuje w **Widoku Domyślnym**: dla wybranych zakładek domyślnie ukrywa część wartości przez predefiniowane filtry checkboxowe.
- W topbarze są teraz dwa przyciski: **Pełen Widok** (odsłania wszystkie dane we wszystkich zakładkach) oraz **Widok Domyślny** (przywraca domyślne ukrycia i sortowanie). Pod przyciskami jest podpis: „Część danych jest domyślnie ukryta.”
- Stan filtrów i sortowania jest zapisywany w `sessionStorage` per urządzenie/sesja, dzięki czemu po przełączaniu zakładek stan się utrzymuje, a po zakończeniu sesji wraca domyślny widok.
- Kolumna wyboru (✓) ma zawsze stałą szerokość 8ch (min/max/width) we wszystkich zakładkach, więc nie rozszerza się wraz z szerokością okna.
- W drugim wierszu nagłówka pierwsza kolumna wyboru (✓) nie pokazuje już napisu „filtr...”, ponieważ ta kolumna nie ma logiki filtrowania.
- Aktywne filtry kolumn są sygnalizowane wizualnie: nagłówek kolumny dostaje podświetlenie akcentowe, a przycisk filtra (▾) ma stan aktywny z kropką-indykatorem.
- W zakładce **Kary do ST** kolumny `Ile celów/akcji` oraz `Kara do ST` są zablokowane na 20ch (min/max/width), a tabela ma `table-layout: fixed` i `width: max-content`, więc **wszystkie** jej kolumny pozostają stałe.
- W **Słowa Kluczowe Frakcji** kolumna **Słowo Kluczowe** jest czerwona poza tokenami `-` i `lub`, zachowuje kursywę z XLSX (np. w `lub`) i traktuje `[ŚWIAT-KUŹNIA]` jako w pełni czerwone słowo kluczowe.
- We wszystkich zakładkach kolumny `Podręcznik` i `Strona` mają ujednolicone parametry: `Podręcznik` = min. **17ch** (lewo), `Strona` = min. **6ch** (lewo), `max-width: auto`, ze standardowym łamaniem linii.
- Nowa zakładka **Notatki** jest widoczna tylko w trybie admina i ma układ kolumn: `Co` (min-width **20ch**, max `auto`, lewo), `Podręcznik` (min `auto`, max bez limitu, lewo), `Strona` (min **6ch**, max `auto`, lewo), wszystkie z domyślnym łamaniem.
- Wartości w kolumnie `Strona` mają ten sam jaśniejszy kolor co referencje `(str.)` (czyli `--code`).
- Okno **Porównanie** używa teraz dokładnie tej samej logiki formatowania komórek co tabela główna (w tym reguł czerwonego koloru, neutralnych przecinków w `Słowa Kluczowe`, wyjątków dla `Słowa Kluczowe Frakcji` jak `[ŚWIAT-KUŹNIA]`, `lub`, `-`, oraz reguł inline jak `(str.)`), więc wygląd jest spójny między widokami.
- W modalu porównania usunięto z treści duplikat nagłówka „PORÓWNANIE” (został tylko nagłówek w pasku modala).

### Szybki start
0. W prawym górnym rogu paska wybierz język interfejsu (domyślnie **Polski**).
1. Umieść pliki projektu na hostingu statycznym **lub** uruchom lokalny serwer HTTP:
   ```bash
   python -m http.server 8000
   ```
2. Otwórz w przeglądarce `http://localhost:8000`.
3. Aplikacja automatycznie wczyta `data.json` z folderu modułu DataVault (obok `index.html`).

> **Ważne:** Otwieranie `index.html` bezpośrednio z dysku (file://) może blokować `fetch()` w części przeglądarek. Zalecany jest prosty serwer HTTP.

### Tryby pracy

- **Nowy przycisk nawigacyjny (tryb gracza):** w górnym pasku dostępny jest przycisk **Strona Główna / Main Page**, który przenosi do `../Main/index.html`.
- W trybie admina (`?admin=1`) ten przycisk jest ukryty, żeby nie zakłócać workflow administracyjnego.
- **Tryb gracza (domyślny)**
  - Automatycznie wczytuje `data.json`.
  - Ukrywa przycisk administracyjny do aktualizacji danych.
  - Ukrywa zakładki admin-only: **Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**, **Specjalne Bonusy Wrogów** oraz **Notatki**.
- **Tryb admina**
  - Dodaj do adresu `?admin=1`, np. `http://localhost:8000/?admin=1`.
  - Dostępny jest przycisk **Generuj data.json**, który uruchamia kanoniczny parser XLSX w przeglądarce (`xlsxCanonicalParser.js` + `JSZip`) i pobiera gotowy plik `data.json`.
  - Podpowiedź pod przyciskiem przypomina też, że `Repozytorium.xlsx` musi istnieć obok `index.html`, a wygenerowany `data.json` trzeba wgrać do tego samego miejsca.
  - Przycisk korzysta z tej samej logiki co generator AI/CLI (`build_json.py`), więc wynik UI i AI pozostaje spójny (w tym markery `{{RED}}`).
  - Gdy biblioteka parsera kanonicznego nie załaduje się (np. problem z CDN), przycisk kończy się komunikatem błędu i wskazuje komendę CLI (`python build_json.py Repozytorium.xlsx data.json`).
  - Zakładki admin-only (**Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**, **Specjalne Bonusy Wrogów**, **Notatki**) są widoczne wyłącznie w tym trybie (o ile checkbox zasad walki jest zaznaczony).

### Zakładki sterowane checkboxami
- Checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?” (domyślnie odznaczony) pokazuje:
  **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Premie Frakcji**, **Słowa Kluczowe Frakcji**, **Specjalne Bonusy Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**.
  Gdy checkbox jest odznaczony, te zakładki są ukryte (w tym **Premie Frakcji** oraz **Specjalne Bonusy Frakcji**). Obie zakładki mają ten sam jaśniejszy kolor co pozostałe zakładki tworzenia postaci.
- Checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” (domyślnie odznaczony) pokazuje:
  **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad** i **Tryby Ognia**.
  **Skrót Zasad** i **Tryby Ognia** są dostępne dla wszystkich, a **Trafienia Krytyczne** i **Groza Osnowy** tylko w trybie admina.

### Aktualizacja danych z `Repozytorium.xlsx`
Poniżej znajdują się dwa równoważne sposoby aktualizacji danych. W tej zmianie repozytorium `data.json` został ponownie wygenerowany na podstawie najnowszego dostarczonego pliku `Repozytorium.xlsx`, więc tabele odpowiadają aktualnemu arkuszowi. Generator zamienia polskie cudzysłowy „ ” na standardowy znak `"`.

**Status tej aktualizacji:** `data.json` został wygenerowany ponownie dnia **2026-04-15** na podstawie nowo wgranego `Repozytorium.xlsx` (aktualizacja danych tabel DataVault po dostarczeniu nowego pliku). W tej konkretnej operacji wykonano ponowną regenerację po przesłaniu nowej wersji arkusza do repozytorium.

#### Metoda 1: panel administratora (rekomendowana)
1. Podmień `Repozytorium.xlsx` w folderze modułu DataVault (obok `index.html`, na hostingu lub lokalnie).
2. Otwórz aplikację w trybie admina: `http://localhost:8000/?admin=1`.
3. Kliknij **Generuj data.json**.
4. Przeglądarka pobierze nowy `data.json` — zapisz plik i **podmień** nim `data.json` na hostingu.
5. Jeżeli parser kanoniczny nie załaduje się (problem z CDN), wykonaj CLI: `python build_json.py Repozytorium.xlsx data.json`.
6. Wgraj wygenerowany plik na hosting i odśwież aplikację w trybie gracza (bez `?admin=1`), aby potwierdzić aktualizację.

> Ta metoda opiera się o kanoniczny generator (`build_json.py`), co eliminuje rozjazdy UI vs AI.

#### Metoda 2: skrypt CLI
1. Upewnij się, że w folderze modułu DataVault znajduje się najnowszy `Repozytorium.xlsx`.
2. Wygeneruj `data.json` lokalnie:
   ```bash
   python build_json.py Repozytorium.xlsx data.json
   ```
3. Wgraj/umieść nowy `data.json` na hostingu i odśwież stronę.

> **Uwaga (Bestiariusz):** Zakładka **Bestiariusz** jest renderowana jako pierwsza i używa neutralnych przecinków w kolumnie `Słowa Kluczowe` (przecinki są w kolorze podstawowym, reszta na czerwono).
> Kolumna `Zagrożenie` ma minimalną szerokość **5ch**, dzięki czemu poprawnie mieści także wartości 5-znakowe.

### Aktualizacja aplikacji (kod)
1. Zaktualizuj pliki `index.html`, `app.js`, `style.css` oraz ewentualnie `build_json.py`.
2. Wgraj nowe wersje na hosting statyczny (GitHub Pages, serwer WWW itp.).
3. W razie potrzeby wyczyść cache przeglądarki (aplikacja ładuje `data.json` z `cache: "no-store"`, ale pliki statyczne mogą być cache’owane przez CDN/hosting).

### Skróty funkcji w interfejsie
- Kliknięcie nagłówka kolumny: sortowanie rosnąco/malejąco/reset.
- Drugi wiersz nagłówka: filtr tekstowy oraz filtr listy (przycisk ▾).
- Gdy filtr tekstowy lub listowy jest aktywny, kolumna jest oznaczona podświetleniem nagłówka i aktywnym stanem przycisku filtra.
- Przycisk ▾ działa jak przełącznik: drugi klik w ten sam przycisk zamyka menu filtrowania; klik poza menu także je zamyka.
- Przycisk **Pełen Widok** czyści globalne wyszukiwanie, filtry tekstowe i filtry listowe we wszystkich zakładkach, a następnie pokazuje pełne dane.
- Przycisk **Widok Domyślny** przywraca globalnie domyślną konfigurację filtrów checkboxowych (oraz resetuje pozostałe filtry), zgodnie z profilem aplikacji.
- W zakładce **Archetypy** domyślny filtr kolumny **Gatunek** ma zaznaczoną wartość: **Człowiek**.
- W zakładce **Pancerze** domyślny filtr kolumny **Typ** zostawia odznaczone: **Astartes** oraz **Auxilla**.
- W zakładce **Bronie** domyślny filtr kolumny **Typ** zostawia odznaczone: **Broń biała Ogrynów** oraz **Broń dystansowa Militarum Auxilla**.
- W zakładce **Talenty** domyślny filtr kolumny **Typ** ma zaznaczone: **Człowiek**, **Imperium**, **Inkwizycja**, **Mechanicus**, **Militarum**, **Ogólne**, **Sororitas**.
- Zaznaczenie 2+ wierszy: porównywarka rekordów.
- Kliknięcie w tag cechy (`Cechy`): opis w panelu „popover”.
- Panel „popover” przewija się przy długich opisach, a tytuł może zawijać się, by nie ucinać znaków.
- W przypadku cechy **Wywołanie** popover obsługuje zapis z dwukropkiem (`Wywołanie: Oślepienie (1)`) oraz z nawiasem (`Wywołanie (Zatrucie (5))`), mapując go do stanu z zakładki **Stany**.
- Długie komórki: kliknij, aby rozwinąć/zwinąć treść (zwijanie po przekroczeniu 9 linii wizualnych).
- Lista wartości w filtrze listowym usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` wyłącznie w etykietach (bez wpływu na logikę filtrowania).

### Uwagi o szerokości kolumn (Specjalne Bonusy Frakcji / Specjalne Bonusy Wrogów)
W tych zakładkach szerokości kolumn są ustawione jako `min-width` (`Frakcja`, `Rodzaj`, `Nazwa`, `Efekt` = 26ch; `Opis` = 56ch). Przeglądarka może **rozszerzyć** kolumny przy dużej szerokości okna, ponieważ tabela ma `width: 100%` i nie wymusza stałego układu (`table-layout: fixed` nie jest używany). Kolumny mogą więc wyglądać na „nierówne”, mimo że minimalne szerokości są zgodne z dokumentacją. Kolumna wyboru (✓) ma stałe 8ch we wszystkich zakładkach, a **Kary do ST** dodatkowo korzysta ze stałego układu tabeli.

Dodatkowo kolejność kolumn jest pobierana z `data.json` (`_meta.columnOrder`). Jeśli oczekujesz konkretnej kolejności, zweryfikuj ją w źródłowym arkuszu lub w `_meta.columnOrder`.
Dokumentacja wyglądu i zasad formatowania jest w `DetaleLayout.md` (główny katalog repozytorium).

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation. Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## 🇬🇧 Instructions (EN)

### Overview
Administratum Data Vault is a static web app for browsing Wrath & Glory data in tables. It runs in the browser with no backend — you only need to host the static files. The UI uses the green theme and the same font stack as `Main/index.html`, with helper text highlighted in `#4FAF4F` and brighter reference text in `#D2FAD2`.

Key behavior:
- Tab and column order come from `Repozytorium.xlsx` or the generated `data.json`.
- Default sorting uses the hidden `LP` column (it is hidden in the UI and used only for ordering).
- Sheets that include `Cecha 1..N` and `Zasięg 1..3` are merged into `Cechy` and `Zasięg`.
- Numeric columns are center-aligned; the `Zasięg` column in **Bronie** does not wrap.
- The `Typ` column in **Talenty** and **Modlitwy** now matches **Bronie / Typ** (`min-width: 14ch`, left-aligned).
- All tables now use clear **zebra striping** (the dark stripe stays unchanged, while the light stripe uses the previous hover shade), and both hover and checkbox selection use the same strongest full-row highlight.
- The left **Filters** panel uses a fixed `180px` width on desktop to leave more room for the table.
- In admin mode, the data-generation note next to the button is wider (`max-width: 640px`) and includes the full instruction: `Repozytorium.xlsx` must be next to `index.html`, and the generated `data.json` must be uploaded there.
- The app now starts in **Default View**: selected tabs load with predefined checkbox filters that hide part of the data.
- The top bar now has two view buttons: **Full View** (shows all data across all tabs) and **Default View** (restores default hidden values and default sorting). A caption is displayed below them: “Some data is hidden by default.”
- Filter/sort state is persisted in per-session `sessionStorage`, so switching tabs keeps your state on the same device/session, while a new browser session returns to the default profile.
- The selection (✓) column is always locked to 8ch (min/max/width) across all tabs, so it does not expand with viewport width.
- In the second header row, the first selection column (✓) no longer shows the “filter...” text because this column has no filtering logic.
- Active column filters are now clearly signaled: the column header gets an accent highlight, and the filter button (▾) switches to an active state with a dot indicator.
- In the **Kary do ST** tab, the `Ile celów/akcji` and `Kara do ST` columns are locked to 20ch (min/max/width), and the table uses `table-layout: fixed` with `width: max-content`, so **all** columns stay fixed.
- In **Słowa Kluczowe Frakcji**, the **Słowo Kluczowe** column is red except for `-` and the word `lub`, preserves italic styling coming from XLSX (e.g., `lub`), and treats `[ŚWIAT-KUŹNIA]` as fully red.
- Across all tabs, the `Podręcznik` and `Strona` columns now use unified settings: `Podręcznik` = min **17ch** (left), `Strona` = min **6ch** (left), `max-width: auto`, and standard line wrapping.
- The new **Notatki** tab is visible only in admin mode and uses: `Co` (min-width **20ch**, max `auto`, left), `Podręcznik` (min `auto`, no max limit, left), and `Strona` (min **6ch**, max `auto`, left), all with standard wrapping.
- Values in the `Strona` column use the same lighter color as `(str.)` references (`--code`).
- The **Comparison** modal now uses exactly the same cell-formatting logic as the main table (including red keyword rules, neutral commas in `Słowa Kluczowe`, `Słowa Kluczowe Frakcji` exceptions like `[ŚWIAT-KUŹNIA]`, `lub`, `-`, and inline rules such as `(str.)`), so both views stay visually consistent.
- The duplicate in-body modal heading “PORÓWNANIE” was removed (only the modal header title remains).

### Quick start
0. Use the language switcher in the top bar (Polish is selected by default).
1. Host the project files on any static hosting **or** run a local HTTP server:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.
3. The app automatically loads `data.json` from the DataVault module folder (next to `index.html`).

> **Important:** Opening `index.html` directly from disk (file://) may block `fetch()` in some browsers. Use a simple HTTP server instead.

### Modes

- **New navigation button (player mode):** the top bar now includes **Strona Główna / Main Page**, which opens `../Main/index.html`.
- In admin mode (`?admin=1`) this button is hidden to keep the admin workflow focused.
- **Player mode (default)**
  - Automatically loads `data.json`.
  - Hides the admin-only data update button.
  - Hides the admin-only tabs: **Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**, **Specjalne Bonusy Wrogów**, and **Notatki**.
- **Admin mode**
  - Append `?admin=1` to the URL, e.g. `http://localhost:8000/?admin=1`.
  - The **Generate data.json** button appears and runs the canonical in-browser XLSX parser (`xlsxCanonicalParser.js` + `JSZip`) to download a ready `data.json` file.
  - The hint below the button also reminds you that `Repozytorium.xlsx` must exist next to `index.html`, and the generated `data.json` must be uploaded to the same location.
  - The button uses the same logic as the AI/CLI generator (`build_json.py`), ensuring parity between UI and AI output.
  - If the canonical parser library cannot be loaded (e.g. CDN issue), the button ends with an error message and prints the CLI command (`python build_json.py Repozytorium.xlsx data.json`).
  - The admin-only tabs (**Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**, **Specjalne Bonusy Wrogów**, **Notatki**) are visible only in this mode (when the combat checkbox is enabled).

### Tabs controlled by checkboxes
- The “Czy wyświetlić zakładki dotyczące tworzenia postaci?” checkbox (unchecked by default) shows:
  **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Premie Frakcji**, **Słowa Kluczowe Frakcji**, **Specjalne Bonusy Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**.
  When unchecked, these tabs remain hidden (including **Premie Frakcji** and **Specjalne Bonusy Frakcji**). Both tabs use the same lighter color as the other character-creation tabs.
- The “Czy wyświetlić zakładki dotyczące zasad walki?” checkbox (unchecked by default) shows:
  **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad**, and **Tryby Ognia**.
  **Skrót Zasad** and **Tryby Ognia** are available to everyone; **Trafienia Krytyczne** and **Groza Osnowy** are admin-only.

### Updating data from `Repozytorium.xlsx`
Below are two equivalent ways to update the data. In this repository update, `data.json` has been regenerated from the latest provided `Repozytorium.xlsx` file, so the tables reflect the current spreadsheet content. The generator replaces Polish quotation marks „ ” with the standard `"` character.

**Update status:** `data.json` was regenerated on **2026-04-15** from the newly uploaded `Repozytorium.xlsx` (DataVault table data refresh after delivering the new file). In this specific operation, the file was regenerated again right after uploading the new spreadsheet revision to the repository.

#### Method 1: admin panel (recommended)
1. Replace `Repozytorium.xlsx` in the DataVault module folder (next to `index.html`, hosting or local).
2. Open the app in admin mode: `http://localhost:8000/?admin=1`.
3. Click **Generate data.json**.
4. The browser downloads a new `data.json` — save it and **replace** `data.json` on your hosting.
5. If the canonical parser cannot be loaded (CDN issue), run CLI instead: `python build_json.py Repozytorium.xlsx data.json`.
6. Upload the generated file and refresh the app in player mode (without `?admin=1`) to verify the update.

> This method relies on the canonical generator (`build_json.py`), eliminating UI vs AI formatting drift.

#### Method 2: CLI script
1. Make sure the latest `Repozytorium.xlsx` is in the DataVault module folder.
2. Generate `data.json` locally:
   ```bash
   python build_json.py Repozytorium.xlsx data.json
   ```
3. Upload/place the new `data.json` on the hosting and refresh the page.

> **Note (Bestiary):** The **Bestiariusz** tab is rendered first and uses neutral commas in the `Słowa Kluczowe` column (commas are in the base text color, the rest is red).
> The `Zagrożenie` column uses a minimum width of **5ch**, so 5-character values fit correctly as well.

### Updating the app (code)
1. Update `index.html`, `app.js`, `style.css`, and optionally `build_json.py`.
2. Upload the new versions to your static hosting (GitHub Pages, web server, etc.).
3. If needed, clear browser cache (the app fetches `data.json` with `cache: "no-store"`, but static files may still be cached by CDN/hosting).

### UI shortcuts
- Click a column header: sort ascending/descending/reset.
- Second header row: text filter + list filter (▾ button).
- When a text or list filter is active, the column is marked by a highlighted header and an active filter button state.
- The ▾ button now works as a toggle: clicking the same button again closes the filter menu; clicking outside the menu also closes it.
- In **Archetypy**, the **Default View** profile keeps only **Gatunek → Człowiek** selected.
- In **Pancerze**, the **Default View** profile keeps **Typ → Astartes** and **Auxilla** unchecked.
- In **Bronie**, the **Default View** profile keeps **Typ → Broń biała Ogrynów** and **Broń dystansowa Militarum Auxilla** unchecked.
- In **Talenty**, the **Default View** profile keeps the following **Typ** values selected: **Człowiek**, **Imperium**, **Inkwizycja**, **Mechanicus**, **Militarum**, **Ogólne**, **Sororitas**.
- **Full View** clears global search, text filters, and list filters across all tabs, then shows complete datasets.
- **Default View** globally restores the predefined checkbox-filter profile (and resets other filters) for the application.
- Select 2+ rows: record comparison view.
- Click a trait tag (`Cechy`): description in the popover panel.
- The popover panel scrolls for long descriptions, and the title can wrap so characters are not cut off.
- For the **Wywołanie** trait, the popover supports both colon notation (`Wywołanie: Oślepienie (1)`) and parenthesis notation (`Wywołanie (Zatrucie (5))`), mapping to the matching state from the **Stany** tab.
- Long cells: click to expand/collapse content (cells clamp after 9 visual lines).
- The list filter labels strip `{{RED}}`, `{{B}}`, `{{I}}` markers for display only (filter logic is unchanged).

### Column width notes (Specjalne Bonusy Frakcji / Specjalne Bonusy Wrogów)
In these tabs, column widths are defined as `min-width` (`Frakcja`, `Rodzaj`, `Nazwa`, `Efekt` = 26ch; `Opis` = 56ch). The browser can **expand** columns on wide viewports because the table is `width: 100%` and does not enforce a fixed layout (`table-layout: fixed` is not used). As a result, columns can look “uneven” even when the minimum widths match the documentation. The selection (✓) column stays fixed at 8ch across all tabs, while **Kary do ST** additionally uses a fixed table layout.

Column order is also loaded from `data.json` (`_meta.columnOrder`). If you expect a specific order, verify it in the source sheet or in `_meta.columnOrder`.
Visual/layout rules and formatting details are documented in `DetaleLayout.md` (repository root).

### Disclaimer
This tool is an unofficial fan project created to assist GMs in the Wrath & Glory system. The application is provided for free, private, non-commercial use only. The project is not licensed and is not affiliated with or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation. Warhammer 40,000 and related names and trademarks are owned by Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

## Aktualizacja 2026-04-17 (PL)
- Dodano obsługę przekreślenia w całym pipeline danych (`{{S}}...{{/S}}`):
  - parser CLI (`build_json.py`),
  - parser kanoniczny w przeglądarce (`xlsxCanonicalParser.js`),
  - renderer komórek (`app.js` + `style.css`).
- Przekreślony tekst renderuje się jako `line-through` i domyślnie używa koloru archiwalnego (`--text-old`), ale segmenty `{{RED}}` pozostają czerwone.
- Dodano obsługę statusu rekordu `Status=old`:
  - kolumna `Status` jest techniczna i domyślnie ukryta,
  - cały wiersz ma kolor archiwalny,
  - przecinki i referencje w tym wierszu dziedziczą kolor archiwalny,
  - czerwone segmenty nadal mają priorytet.
- W zakładce **Bestiariusz** dodano regułę dla kolumny `Typ` (`min-width: 14ch`, wyrównanie do lewej), analogicznie do `Bronie/Typ`.
- `data.json` został wygenerowany ponownie po wdrożeniu zmian parsera.

## Update 2026-04-17 (EN)
- Added full strikethrough support across the data pipeline (`{{S}}...{{/S}}`):
  - CLI parser (`build_json.py`),
  - in-browser canonical parser (`xlsxCanonicalParser.js`),
  - cell renderer (`app.js` + `style.css`).
- Struck text is rendered with `line-through` and uses the archival color token (`--text-old`) by default, while `{{RED}}` segments remain red.
- Added `Status=old` record handling:
  - `Status` is now treated as a hidden technical column,
  - the whole row uses archival color,
  - commas and references inherit archival color in that row,
  - red fragments still have priority.
- In the **Bestiariusz** tab, a `Typ` column rule was added (`min-width: 14ch`, left-aligned), matching `Bronie/Typ`.
- `data.json` was regenerated after parser updates.

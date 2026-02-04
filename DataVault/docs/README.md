# Administratum Data Vault — przewodnik użytkownika / User Guide

Poniżej znajdują się **identyczne instrukcje** po polsku i angielsku. Aplikacja to statyczny frontend do przeglądania danych Wrath & Glory w formie tabel, bez backendu i bez lokalnych zależności (poza opcjonalnym Pythonem do generowania `data.json`).

---

## 🇵🇱 Instrukcja (PL)

### Opis
Administratum Data Vault to statyczna aplikacja webowa do przeglądania danych Wrath & Glory w formie tabel. Działa w przeglądarce bez backendu — wystarczy hostować pliki statyczne. Interfejs korzysta z zielonego motywu i tego samego stosu fontów co `Main/index.html`, z wyróżnieniem tekstu pomocniczego (`#4FAF4F`) i jaśniejszym kolorem dla referencji (`#D2FAD2`).

Najważniejsze zasady działania:
- Kolejność zakładek i kolumn pochodzi z `Repozytorium.xlsx` lub z wygenerowanego `data.json`.
- Domyślne sortowanie opiera się o kolumnę `LP` (kolumna jest ukryta w UI, służy tylko do sortowania).
- W arkuszach z kolumnami `Cecha 1..N` i `Zasięg 1..3` aplikacja scala je do `Cechy` i `Zasięg`.
- Kolumny liczbowe są wyśrodkowane; w **Broniach** kolumna `Zasięg` nie zawija wierszy.
- W **Słowa Kluczowe Frakcji** kolumna **Słowo Kluczowe** jest czerwona poza tokenami `-` i `lub`, zachowuje kursywę z XLSX (np. w `lub`) i traktuje `[ŚWIAT-KUŹNIA]` jako w pełni czerwone słowo kluczowe.

### Szybki start
1. Umieść pliki projektu na hostingu statycznym **lub** uruchom lokalny serwer HTTP:
   ```bash
   python -m http.server 8000
   ```
2. Otwórz w przeglądarce `http://localhost:8000`.
3. Aplikacja automatycznie wczyta `data.json` z folderu modułu DataVault (obok `index.html`).

> **Ważne:** Otwieranie `index.html` bezpośrednio z dysku (file://) może blokować `fetch()` w części przeglądarek. Zalecany jest prosty serwer HTTP.

### Tryby pracy
- **Tryb gracza (domyślny)**
  - Automatycznie wczytuje `data.json`.
  - Ukrywa przycisk administracyjny do aktualizacji danych.
  - Ukrywa zakładki admin-only: **Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy** oraz **Hordy**.
- **Tryb admina**
  - Dodaj do adresu `?admin=1`, np. `http://localhost:8000/?admin=1`.
  - Dostępny jest przycisk **Aktualizuj dane**, który pobiera `Repozytorium.xlsx` z folderu modułu DataVault (obok `index.html`).
  - XLSX jest odczytywany w przeglądarce (SheetJS z CDN), a następnie generowany jest nowy `data.json` do pobrania.
  - Zakładki admin-only (**Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**) są widoczne wyłącznie w tym trybie (o ile checkbox zasad walki jest zaznaczony).

### Zakładki sterowane checkboxami
- Checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?” (domyślnie odznaczony) pokazuje:
  **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Bonusy Frakcji**, **Słowa Kluczowe Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**, **Ścieżki Asuryani**, **Orcze Klany**, **Mutacje Krootów**.
  Gdy checkbox jest odznaczony, te zakładki są ukryte.
- Checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” (domyślnie odznaczony) pokazuje:
  **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad** i **Tryby Ognia**.
  **Skrót Zasad** i **Tryby Ognia** są dostępne dla wszystkich, a **Trafienia Krytyczne** i **Groza Osnowy** tylko w trybie admina.

### Aktualizacja danych z `Repozytorium.xlsx`
Poniżej znajdują się dwa równoważne sposoby aktualizacji danych. W tej zmianie repozytorium `data.json` został ponownie wygenerowany na podstawie najnowszego `Repozytorium.xlsx` (z poprawionymi literówkami), więc tabele odpowiadają aktualnemu arkuszowi. Generator zamienia polskie cudzysłowy „ ” na standardowy znak `"`.

#### Metoda 1: panel administratora (rekomendowana)
1. Podmień `Repozytorium.xlsx` w folderze modułu DataVault (obok `index.html`, na hostingu lub lokalnie).
2. Otwórz aplikację w trybie admina: `http://localhost:8000/?admin=1`.
3. Kliknij **Aktualizuj dane**.
4. Przeglądarka pobierze nowy `data.json` — zapisz plik i **podmień** nim `data.json` na hostingu.
5. Odśwież aplikację w trybie gracza (bez `?admin=1`) i upewnij się, że dane są widoczne.

#### Metoda 2: skrypt CLI
1. Upewnij się, że w folderze modułu DataVault znajduje się najnowszy `Repozytorium.xlsx`.
2. Wygeneruj `data.json` lokalnie:
   ```bash
   python build_json.py Repozytorium.xlsx data.json
   ```
3. Wgraj/umieść nowy `data.json` na hostingu i odśwież stronę.

> **Uwaga (Bestiariusz):** Zakładka **Bestiariusz** jest renderowana jako pierwsza i używa neutralnych przecinków w kolumnie `Słowa Kluczowe` (przecinki są w kolorze podstawowym, reszta na czerwono).

### Aktualizacja aplikacji (kod)
1. Zaktualizuj pliki `index.html`, `app.js`, `style.css` oraz ewentualnie `build_json.py`.
2. Wgraj nowe wersje na hosting statyczny (GitHub Pages, serwer WWW itp.).
3. W razie potrzeby wyczyść cache przeglądarki (aplikacja ładuje `data.json` z `cache: "no-store"`, ale pliki statyczne mogą być cache’owane przez CDN/hosting).

### Skróty funkcji w interfejsie
- Kliknięcie nagłówka kolumny: sortowanie rosnąco/malejąco/reset.
- Drugi wiersz nagłówka: filtr tekstowy oraz filtr listy (przycisk ▾).
- Zaznaczenie 2+ wierszy: porównywarka rekordów.
- Kliknięcie w tag cechy (`Cechy`): opis w panelu „popover”.
- Panel „popover” przewija się przy długich opisach, a tytuł może zawijać się, by nie ucinać znaków.
- Długie komórki: kliknij, aby rozwinąć/zwinąć treść (zwijanie po przekroczeniu 9 linii wizualnych).
- Lista wartości w filtrze listowym usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` wyłącznie w etykietach (bez wpływu na logikę filtrowania).

### Uwagi o szerokości kolumn (Ścieżki Asuryani / Orcze Klany)
W tych zakładkach szerokości kolumn są ustawione jako `min-width` (Nazwa 26ch, Opis 56ch, Efekt 26ch). Przeglądarka może **rozszerzyć** kolumny przy dużej szerokości okna, ponieważ tabela ma `width: 100%` i nie wymusza stałego układu (`table-layout: fixed` nie jest używany). Kolumny mogą więc wyglądać na „nierówne”, mimo że minimalne szerokości są zgodne z dokumentacją.

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
- In **Słowa Kluczowe Frakcji**, the **Słowo Kluczowe** column is red except for `-` and the word `lub`, preserves italic styling coming from XLSX (e.g., `lub`), and treats `[ŚWIAT-KUŹNIA]` as fully red.

### Quick start
1. Host the project files on any static hosting **or** run a local HTTP server:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.
3. The app automatically loads `data.json` from the DataVault module folder (next to `index.html`).

> **Important:** Opening `index.html` directly from disk (file://) may block `fetch()` in some browsers. Use a simple HTTP server instead.

### Modes
- **Player mode (default)**
  - Automatically loads `data.json`.
  - Hides the admin-only data update button.
  - Hides the admin-only tabs: **Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, and **Hordy**.
- **Admin mode**
  - Append `?admin=1` to the URL, e.g. `http://localhost:8000/?admin=1`.
  - The **Aktualizuj dane** button appears and fetches `Repozytorium.xlsx` from the DataVault module folder (next to `index.html`).
  - The XLSX is parsed in the browser (SheetJS via CDN) and a new `data.json` is generated for download.
  - The admin-only tabs (**Bestiariusz**, **Trafienia Krytyczne**, **Groza Osnowy**, **Hordy**) are visible only in this mode (when the combat checkbox is enabled).

### Tabs controlled by checkboxes
- The “Czy wyświetlić zakładki dotyczące tworzenia postaci?” checkbox (unchecked by default) shows:
  **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Bonusy Frakcji**, **Słowa Kluczowe Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**, **Ścieżki Asuryani**, **Orcze Klany**, **Mutacje Krootów**.
  When unchecked, these tabs remain hidden.
- The “Czy wyświetlić zakładki dotyczące zasad walki?” checkbox (unchecked by default) shows:
  **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad**, and **Tryby Ognia**.
  **Skrót Zasad** and **Tryby Ognia** are available to everyone; **Trafienia Krytyczne** and **Groza Osnowy** are admin-only.

### Updating data from `Repozytorium.xlsx`
Below are two equivalent ways to update the data. In this update, `data.json` has been regenerated from the latest `Repozytorium.xlsx` (with typo fixes), so the tables reflect the current spreadsheet content. The generator replaces Polish quotation marks „ ” with the standard `"` character.

#### Method 1: admin panel (recommended)
1. Replace `Repozytorium.xlsx` in the DataVault module folder (next to `index.html`, hosting or local).
2. Open the app in admin mode: `http://localhost:8000/?admin=1`.
3. Click **Aktualizuj dane**.
4. The browser downloads a new `data.json` — save it and **replace** `data.json` on your hosting.
5. Refresh the app in player mode (without `?admin=1`) and verify the data.

#### Method 2: CLI script
1. Make sure the latest `Repozytorium.xlsx` is in the DataVault module folder.
2. Generate `data.json` locally:
   ```bash
   python build_json.py Repozytorium.xlsx data.json
   ```
3. Upload/place the new `data.json` on the hosting and refresh the page.

> **Note (Bestiary):** The **Bestiariusz** tab is rendered first and uses neutral commas in the `Słowa Kluczowe` column (commas are in the base text color, the rest is red).

### Updating the app (code)
1. Update `index.html`, `app.js`, `style.css`, and optionally `build_json.py`.
2. Upload the new versions to your static hosting (GitHub Pages, web server, etc.).
3. If needed, clear browser cache (the app fetches `data.json` with `cache: "no-store"`, but static files may still be cached by CDN/hosting).

### UI shortcuts
- Click a column header: sort ascending/descending/reset.
- Second header row: text filter + list filter (▾ button).
- Select 2+ rows: record comparison view.
- Click a trait tag (`Cechy`): description in the popover panel.
- The popover panel scrolls for long descriptions, and the title can wrap so characters are not cut off.
- Long cells: click to expand/collapse content (cells clamp after 9 visual lines).
- The list filter labels strip `{{RED}}`, `{{B}}`, `{{I}}` markers for display only (filter logic is unchanged).

### Column width notes (Ścieżki Asuryani / Orcze Klany)
In these tabs, column widths are defined as `min-width` (Nazwa 26ch, Opis 56ch, Efekt 26ch). The browser can **expand** columns on wide viewports because the table is `width: 100%` and does not enforce a fixed layout (`table-layout: fixed` is not used). As a result, columns can look “uneven” even when the minimum widths match the documentation.

Column order is also loaded from `data.json` (`_meta.columnOrder`). If you expect a specific order, verify it in the source sheet or in `_meta.columnOrder`.
Visual/layout rules and formatting details are documented in `DetaleLayout.md` (repository root).

### Disclaimer
This tool is an unofficial fan project created to assist GMs in the Wrath & Glory system. The application is provided for free, private, non-commercial use only. The project is not licensed and is not affiliated with or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation. Warhammer 40,000 and related names and trademarks are owned by Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

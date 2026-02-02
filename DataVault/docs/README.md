# Administratum Data Vault — przewodnik użytkownika / User Guide

Poniżej znajdują się **identyczne instrukcje** po polsku i angielsku. Aplikacja to statyczny frontend do przeglądania danych Wrath & Glory w formie tabel, bez backendu i bez lokalnych zależności (poza opcjonalnym Pythonem do generowania `data.json`).

---

## 🇵🇱 Instrukcja (PL)

### Opis
Statyczna aplikacja webowa do przeglądania danych z systemu Wrath & Glory w formie tabel. Działa w przeglądarce, nie wymaga backendu ani instalacji zależności — wystarczy hostować pliki statyczne. Interfejs korzysta z zielonego motywu i fontu zgodnego z `Main/index.html`, z wyróżnieniem tekstu pomocniczego (`#4FAF4F`) i jaśniejszego tekstu referencji (`#D2FAD2`). Kolejność zakładek i kolumn jest pobierana z `Repozytorium.xlsx` (lub z wygenerowanego `data.json`) i odświeża się po każdej aktualizacji tych plików. Domyślne sortowanie każdej zakładki pochodzi z kolumny `LP` (ukrytej w aplikacji, służącej wyłącznie do sortowania). W arkuszach zawierających kolumny `Cecha 1..N` oraz `Zasięg 1..3` aplikacja scala je odpowiednio do `Cechy` i `Zasięg` w miejscu pierwszego wystąpienia nagłówka. Kolumny liczbowe (statystyki Bestiariusza, koszty, dostępność, parametry broni, ST i zasięgi) są wyrównane do środka; w **Broniach** kolumna `Zasięg` nie łamie wierszy. W zakładce **Słowa Kluczowe Frakcji** kolumna **Słowo Kluczowe** jest czerwona poza tokenami `-` i `lub`, zachowuje kursywę przekazaną z arkusza (np. w `lub`) oraz traktuje `[ŚWIAT-KUŹNIA]` jako w pełni czerwone słowo kluczowe. Checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?” (domyślnie odznaczony) po zaznaczeniu pokazuje zakładki: **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Bonusy Frakcji**, **Słowa Kluczowe Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**, **Ścieżki Asuryani**, **Orcze Klany**, **Mutacje Krootów** (gdy jest odznaczony, te zakładki są ukryte). Zakładki powiązane z tym checkboxem mają jaśniejszy kolor tekstu `#D2FAD2`, identyczny jak etykieta checkboxa. Checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” (domyślnie odznaczony) pokazuje zakładki **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad** i **Tryby Ognia** — przy czym **Skrót Zasad** i **Tryby Ognia** są dostępne dla wszystkich, a **Trafienia Krytyczne** i **Groza Osnowy** są widoczne tylko w trybie admina. Etykieta i te zakładki mają czerwony kolor `#d74b4b`.

## Uwagi o szerokości kolumn (Ścieżki Asuryani / Orcze Klany)
W tych zakładkach szerokości kolumn są ustawione jako `min-width` (Nazwa 26ch, Opis 56ch, Efekt 26ch). Oznacza to, że przeglądarka może **rozszerzyć** kolumny przy dużej szerokości okna, ponieważ tabela ma `width: 100%` i nie wymusza stałego układu (`table-layout: fixed` nie jest używany). Wizualnie kolumny mogą więc wyglądać na „nierówne”, mimo że minimalne szerokości są zgodne z dokumentacją.

Dodatkowo kolejność kolumn jest pobierana z `data.json` (`_meta.columnOrder`). W aktualnym pliku `data.json` dla **Ścieżek Asuryani** kolejność to `Nazwa → Opis → Efekt`, podczas gdy w dokumentacji (oraz w `Kolumny.md`) figuruje `Nazwa → Efekt → Opis`. Jeśli oczekujesz konkretnej kolejności, zweryfikuj kolejność kolumn w źródłowym arkuszu lub w `_meta.columnOrder`.
Dokumentacja wyglądu i zasad formatowania jest w `DetaleLayout.md` (główny katalog repozytorium).

### Uruchomienie aplikacji
1. Umieść pliki projektu na hostingu statycznym **lub** uruchom lokalny serwer HTTP:
   ```bash
   python -m http.server 8000
   ```
2. Otwórz w przeglądarce `http://localhost:8000`.
3. Aplikacja automatycznie wczyta `data.json` z katalogu głównego repozytorium.

> **Ważne:** Otwieranie `index.html` bezpośrednio z dysku (file://) może blokować `fetch()` w części przeglądarek. Zalecany jest prosty serwer HTTP.

### Tryby pracy
- **Tryb gracza (domyślny)**
  - Automatycznie wczytuje `data.json`.
  - Ukrywa przycisk administracyjny do aktualizacji danych.
  - Ukrywa zakładkę **Bestiariusz** oraz zakładki **Trafienia Krytyczne** i **Groza Osnowy** (dostępne tylko dla admina).
- **Tryb admina**
  - Dodaj do adresu `?admin=1`, np. `http://localhost:8000/?admin=1`.
  - Dostępny jest przycisk **Aktualizuj dane**, który pobiera `Repozytorium.xlsx` z katalogu głównego.
  - XLSX jest odczytywany w przeglądarce (SheetJS z CDN), a następnie generowany jest nowy `data.json` do pobrania.
  - Zakładki **Bestiariusz**, **Trafienia Krytyczne** i **Groza Osnowy** są widoczne wyłącznie w tym trybie (o ile odpowiedni checkbox jest zaznaczony).

### Aktualizacja danych z `Repozytorium.xlsx`
Poniżej znajdują się dwa równoważne sposoby aktualizacji danych. Pierwszy jest rekomendowany dla osób nietechnicznych, drugi pozwala wykonać ten sam proces z linii poleceń.
W tej aktualizacji repozytorium `data.json` został ponownie wygenerowany na podstawie zaktualizowanego `Repozytorium.xlsx`, więc tabele w aplikacji odpowiadają najnowszemu arkuszowi. Generator dodatkowo zamienia polskie cudzysłowy „ ” na standardowy znak `"`.

#### Metoda 1: aktualizacja przez panel administratora (rekomendowana)
1. Podmień plik `Repozytorium.xlsx` w katalogu głównym aplikacji (na hostingu lub lokalnie).
2. Otwórz aplikację w trybie admina: `http://localhost:8000/?admin=1`.
3. Kliknij **Aktualizuj dane**.
4. Przeglądarka pobierze nowy `data.json` — zapisz plik i **podmień** nim `data.json` na hostingu.
5. Odśwież aplikację w trybie gracza (bez `?admin=1`) i upewnij się, że dane są widoczne.

#### Metoda 2: aktualizacja przez skrypt CLI
1. Upewnij się, że w katalogu projektu znajduje się najnowszy `Repozytorium.xlsx`.
2. Wygeneruj `data.json` lokalnie:
   ```bash
   python build_json.py Repozytorium.xlsx data.json
   ```
3. Wgraj/umieść nowy `data.json` na hostingu i odśwież stronę.

> **Uwaga (Bestiariusz):** Zakładka **Bestiariusz** jest renderowana jako pierwsza w aplikacji i korzysta z neutralnych przecinków w kolumnie `Słowa Kluczowe` (przecinki są w kolorze podstawowym, reszta na czerwono).

### Aktualizacja aplikacji (kod)
1. Zaktualizuj pliki `index.html`, `app.js`, `style.css` oraz ewentualnie `build_json.py`.
2. Wgraj nowe wersje na hosting statyczny (GitHub Pages, serwer WWW itp.).
3. W razie potrzeby wyczyść cache przeglądarki (aplikacja ładuje `data.json` z `cache: "no-store"`, ale pliki statyczne mogą być cache’owane przez CDN/hosting).
4. Funkcje aktualizacji danych w `app.js` są zdefiniowane jednokrotnie — nie ma już zdublowanej logiki.

### Skróty funkcji w interfejsie
- Kliknięcie nagłówka kolumny: sortowanie rosnąco/malejąco/reset.
- Drugi wiersz nagłówka: filtr tekstowy oraz filtr listy (przycisk ▾).
- Zaznaczenie 2+ wierszy: porównywarka rekordów.
- Kliknięcie w tag cechy (`Cechy`): opis w panelu „popover”.
- Długie komórki: kliknij, aby rozwinąć/zwinąć treść (zwijanie działa po przekroczeniu 9 linii wizualnych, uwzględniając zawijanie wierszy).
- Lista wartości w filtrze listowym usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` wyłącznie w etykietach (bez wpływu na logikę filtrowania).
- Domyślne sortowanie każdej zakładki opiera się na kolumnie `LP` (kolumna jest ukryta, ale kieruje kolejnością wierszy po otwarciu zakładki).
- Checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?” ukrywa/pokazuje zestaw zakładek tworzenia postaci.
- Checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” ukrywa/pokazuje zakładki **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad** i **Tryby Ognia** (dwie pierwsze są dostępne tylko w trybie admina).

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation. Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## 🇬🇧 Instructions (EN)

### Overview
A static web application for browsing Wrath & Glory data in tables. It runs in the browser with no backend and no local dependencies — you only need to host the static files. The UI uses the green theme and font stack aligned with `Main/index.html`, with secondary text highlights (`#4FAF4F`) and brighter reference text (`#D2FAD2`). Tab and column order are loaded from `Repozytorium.xlsx` (or from the generated `data.json`) and refresh automatically after those files are updated. Default sorting for each tab is driven by the `LP` column (hidden in the UI and used only for ordering). In sheets that include `Cecha 1..N` and `Zasięg 1..3` columns, the app merges them into `Cechy` and `Zasięg` at the position of the first header occurrence. Numeric columns (Bestiary stats, costs, availability, weapon parameters, ST, and ranges) are center-aligned; the `Zasięg` column in **Bronie** does not wrap. In **Słowa Kluczowe Frakcji**, the **Słowo Kluczowe** column is red except for the `-` token and the word `lub`, preserves italic styling coming from the sheet (e.g., the italic `lub`), and treats `[ŚWIAT-KUŹNIA]` as fully red. The “Czy wyświetlić zakładki dotyczące tworzenia postaci?” checkbox (unchecked by default) shows the **Tabela Rozmiarów**, **Gatunki**, **Archetypy**, **Bonusy Frakcji**, **Słowa Kluczowe Frakcji**, **Implanty Astartes**, **Zakony Pierwszego Powołania**, **Ścieżki Asuryani**, **Orcze Klany**, and **Mutacje Krootów** tabs (when unchecked, those tabs stay hidden). Tabs tied to this checkbox use the lighter `#D2FAD2` text color to match the checkbox label. The “Czy wyświetlić zakładki dotyczące zasad walki?” checkbox (unchecked by default) reveals **Trafienia Krytyczne**, **Groza Osnowy**, **Skrót Zasad**, and **Tryby Ognia** — **Skrót Zasad** and **Tryby Ognia** are available to players and admins, while **Trafienia Krytyczne** and **Groza Osnowy** are admin-only. The label and these tabs are colored `#d74b4b`.

## Column width notes (Ścieżki Asuryani / Orcze Klany)
In these tabs, column widths are defined as `min-width` (Nazwa 26ch, Opis 56ch, Efekt 26ch). This means the browser can **expand** columns on wide viewports because the table is `width: 100%` and does not enforce a fixed layout (`table-layout: fixed` is not used). As a result, columns can look “uneven” even when the minimum widths match the documentation.

Also note that column order is taken from `data.json` (`_meta.columnOrder`). In the current `data.json`, **Ścieżki Asuryani** uses the order `Nazwa → Opis → Efekt`, while the documentation (and `Kolumny.md`) lists `Nazwa → Efekt → Opis`. If you expect a specific order, verify the column order in the source sheet or `_meta.columnOrder`.
Visual/layout rules and formatting details are documented in `DetaleLayout.md` (repository root).

### Running the app
1. Host the project files on any static hosting **or** run a local HTTP server:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.
3. The app automatically loads `data.json` from the repository root.

> **Important:** Opening `index.html` directly from disk (file://) may block `fetch()` in some browsers. Use a simple HTTP server instead.

### Modes
- **Player mode (default)**
  - Automatically loads `data.json`.
  - Hides the admin-only data update button.
  - Hides the **Bestiariusz**, **Trafienia Krytyczne**, and **Groza Osnowy** tabs (admin-only).
- **Admin mode**
  - Append `?admin=1` to the URL, e.g. `http://localhost:8000/?admin=1`.
  - The **Aktualizuj dane** button appears and fetches `Repozytorium.xlsx` from the repository root.
  - The XLSX is parsed in the browser (SheetJS via CDN) and a new `data.json` is generated for download.
  - The **Bestiariusz**, **Trafienia Krytyczne**, and **Groza Osnowy** tabs are visible only in this mode (and only when the combat checkbox is enabled).

### Updating data from `Repozytorium.xlsx`
Below are two equivalent ways to update the data. The first is recommended for non-technical users; the second performs the same operation via CLI.
In this update, `data.json` has been regenerated from the updated `Repozytorium.xlsx`, so the tables reflect the newest spreadsheet content. The generator also replaces Polish quotation marks „ ” with the standard `"` character.

#### Method 1: update via the admin panel (recommended)
1. Replace `Repozytorium.xlsx` in the app root (hosting or local).
2. Open the app in admin mode: `http://localhost:8000/?admin=1`.
3. Click **Aktualizuj dane**.
4. The browser downloads a new `data.json` — save it and **replace** `data.json` on your hosting.
5. Refresh the app in player mode (without `?admin=1`) and verify the data is visible.

#### Method 2: update via CLI script
1. Make sure the latest `Repozytorium.xlsx` is in the project directory.
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
4. The data update functions in `app.js` are defined once (no duplicated logic).

### UI shortcuts
- Click a column header: sort ascending/descending/reset.
- Second header row: text filter + list filter (▾ button).
- Select 2+ rows: record comparison view.
- Click a trait tag (`Cechy`): description in the popover panel.
- Long cells: click to expand/collapse content (cells are clamped after 9 visual lines, including wrapped lines).
- The list filter labels strip `{{RED}}`, `{{B}}`, `{{I}}` markers for display only (filter logic is unchanged).
- Default sorting for each tab uses the hidden `LP` column to order rows on load.
- The “Czy wyświetlić zakładki dotyczące tworzenia postaci?” checkbox hides/shows the character creation tabs set.
- The “Czy wyświetlić zakładki dotyczące zasad walki?” checkbox hides/shows the combat rules tabs (with **Skrót Zasad** and **Tryby Ognia** for all users and the other two tabs in admin mode only).

### Disclaimer
This tool is an unofficial fan project created to assist GMs in the Wrath & Glory system. The application is provided for free, private, non-commercial use only. The project is not licensed and is not affiliated with or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation. Warhammer 40,000 and related names and trademarks are owned by Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

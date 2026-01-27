# Administratum Data Vault — przewodnik użytkownika / User Guide

Poniżej znajdują się **identyczne instrukcje** po polsku i angielsku. Aplikacja to statyczny frontend do przeglądania danych Wrath & Glory w formie tabel, bez backendu i bez lokalnych zależności (poza opcjonalnym Pythonem do generowania `data.json`).

---

## 🇵🇱 Instrukcja (PL)

### Opis
Statyczna aplikacja webowa do przeglądania danych z systemu Wrath & Glory w formie tabel. Działa w przeglądarce, nie wymaga backendu ani instalacji zależności — wystarczy hostować pliki statyczne. Interfejs korzysta z zielonego motywu i fontu zgodnego z `Main/index.html`, z wyróżnieniem tekstu pomocniczego (`#4FAF4F`) i jaśniejszego tekstu referencji (`#D2FAD2`). Zakładka **Archetypy** zawiera m.in. kolumny kosztu XP, słów kluczowych, atrybutów, umiejętności, zdolności, ekwipunku i dodatkowych informacji.
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
  - Ukrywa zakładkę **Bestiariusz** (dostępna tylko dla admina).
- **Tryb admina**
  - Dodaj do adresu `?admin=1`, np. `http://localhost:8000/?admin=1`.
  - Dostępny jest przycisk **Aktualizuj dane**, który pobiera `Repozytorium.xlsx` z katalogu głównego.
  - XLSX jest odczytywany w przeglądarce (SheetJS z CDN), a następnie generowany jest nowy `data.json` do pobrania.
  - Zakładka **Bestiariusz** jest widoczna wyłącznie w tym trybie.

### Aktualizacja danych z `Repozytorium.xlsx`
Poniżej znajdują się dwa równoważne sposoby aktualizacji danych. Pierwszy jest rekomendowany dla osób nietechnicznych, drugi pozwala wykonać ten sam proces z linii poleceń.

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
- Długie komórki: kliknij, aby rozwinąć/zwinąć treść.
- Lista wartości w filtrze listowym usuwa markery `{{RED}}`, `{{B}}`, `{{I}}` wyłącznie w etykietach (bez wpływu na logikę filtrowania).
- Zakładka **Archetypy** ma domyślny sort: `Poziom` rosnąco, a następnie `Frakcja` alfabetycznie.

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation. Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## 🇬🇧 Instructions (EN)

### Overview
A static web application for browsing Wrath & Glory data in tables. It runs in the browser with no backend and no local dependencies — you only need to host the static files. The UI uses the green theme and font stack aligned with `Main/index.html`, with secondary text highlights (`#4FAF4F`) and brighter reference text (`#D2FAD2`). The **Archetypy** tab includes columns for XP cost, keywords, archetype attributes, skills, abilities, equipment, and extra notes.
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
  - Hides the **Bestiariusz** tab (admin-only).
- **Admin mode**
  - Append `?admin=1` to the URL, e.g. `http://localhost:8000/?admin=1`.
  - The **Aktualizuj dane** button appears and fetches `Repozytorium.xlsx` from the repository root.
  - The XLSX is parsed in the browser (SheetJS via CDN) and a new `data.json` is generated for download.
  - The **Bestiariusz** tab is visible only in this mode.

### Updating data from `Repozytorium.xlsx`
Below are two equivalent ways to update the data. The first is recommended for non-technical users; the second performs the same operation via CLI.

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
- Long cells: click to expand/collapse content.
- The list filter labels strip `{{RED}}`, `{{B}}`, `{{I}}` markers for display only (filter logic is unchanged).
- The **Archetypy** tab defaults to sorting by `Poziom` ascending, then `Frakcja` alphabetically.

### Disclaimer
This tool is an unofficial fan project created to assist GMs in the Wrath & Glory system. The application is provided for free, private, non-commercial use only. The project is not licensed and is not affiliated with or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation. Warhammer 40,000 and related names and trademarks are owned by Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

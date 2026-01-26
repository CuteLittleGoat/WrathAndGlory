# Kalkulator Wrath & Glory – instrukcja użytkownika

Ten projekt to zestaw statycznych stron HTML do planowania rozwoju postaci w systemie **Wrath & Glory**. Aplikacja działa lokalnie w przeglądarce (bez serwera i bez instalacji). Wystarczy otworzyć pliki HTML.

## 🇵🇱 Instrukcja (PL)
### Szybki start
1. Otwórz plik `index.html` w przeglądarce (dwuklik lub przeciągnięcie pliku do okna przeglądarki).
   - Tytuł karty przeglądarki na stronie startowej: **Kozie Liczydła**.
2. Na ekranie startowym wybierz narzędzie:
   - **Kalkulator XP** (`KalkulatorXP.html`) – liczy koszt rozwoju atrybutów i umiejętności.
   - **Tworzenie Postaci** (`TworzeniePostaci.html`) – arkusz budowania postaci z pulą XP, kontrolą limitów i tabelami.

> ℹ️ **Uwaga dotycząca urządzeń mobilnych**
>
> Autodopasowanie pól w `TworzeniePostaci.html` pogarsza wygląd arkusza w pionowej orientacji ekranów mobilnych. Najwygodniej korzystać na komputerze lub w poziomie.

### Instrukcja używania
#### 1) Kalkulator XP
1. W tabelach **Atrybuty** i **Umiejętności** wpisz wartości **aktualne** i **docelowe**.
   - Atrybuty mają zakres `0–12`.
   - Umiejętności mają zakres `0–8`.
2. Koszt XP w każdym wierszu (wyrównany do środka komórki) oraz suma **Całkowity koszt XP** uaktualniają się automatycznie po każdej zmianie.
3. Przycisk **Resetuj wartości** ustawia wszystkie pola na `0`.

#### 2) Tworzenie Postaci
1. Ustaw **pulę XP do wydania** w polu u góry.
2. Wypełnij **Atrybuty** (domyślnie startują od 1) i **Umiejętności** (domyślnie 0).
3. Dodaj koszty talentów, mocy, archetypów itp. w tabeli **Talenty…**.
4. Obserwuj komunikaty pod sekcją XP:
   - **Przekroczenie puli XP** – pojawia się, gdy wydatki są większe niż dostępna pula.
   - **Drzewo Nauki** – pojawia się, gdy liczba aktywnych umiejętności jest zbyt mała w stosunku do ich poziomu.
5. Przełącznik języka (PL/EN) znajduje się w prawym górnym rogu. Po zmianie języka aplikacja resetuje wszystkie dane (wymaga potwierdzenia).
6. Przycisk **Instrukcja / Manual** otwiera PDF z pełną instrukcją dla aktualnego języka (`HowToUse/pl.pdf` lub `HowToUse/en.pdf`).

### Aktualizacja aplikacji (dla użytkownika)
Aplikacja jest statyczna – „aktualizacja” oznacza podmianę plików lub ręczną edycję HTML/CSS.

#### Aktualizacja plików
- Pobierz najnowszą wersję plików i **zamień** stare `index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html` oraz `kalkulatorxp.css` na nowe.
- Jeśli trzymasz własne zmiany (np. inne tabele), zrób kopię i przenieś je do nowej wersji.

#### Najczęstsze modyfikacje
- **Zmiana kosztów XP**:
  - `KalkulatorXP.html` → sekcja `<script>`: obiekty `attributeCosts` i `skillCosts`.
  - `TworzeniePostaci.html` → sekcja `<script>`: obiekty `attributeCosts` i `skillCosts`.
- **Zmiana liczby wierszy w tabelach**:
  - `KalkulatorXP.html` – możesz dodać wiersze, skrypt sam odczytuje wszystkie wiersze tabel.
  - `TworzeniePostaci.html` – po dodaniu wierszy musisz zaktualizować pętle `for` w skrypcie (umiejętności: `1..9`, talenty: `1..10`).
- **Zmiana wyglądu**:
  - `kalkulatorxp.css` odpowiada za styl `KalkulatorXP.html` i większość stylu `TworzeniePostaci.html`.
  - `TworzeniePostaci.html` ma dodatkowe style inline w sekcji `<style>`.
  - `index.html` ma własny CSS w sekcji `<style>`.
  - Motyw wizualny jest zgodny z `Main/index.html` (zielony kolor, glow, font z konsolowego stosu), z tekstem pomocniczym `#4FAF4F` i jaśniejszymi wyróżnieniami `#D2FAD2`.

### Struktura katalogów
```
.
├── docs/
│   ├── README.md            # instrukcje użytkowe (ten plik)
│   └── Documentation.md     # szczegółowy opis kodu i logiki
├── HowToUse/
│   ├── pl.pdf               # instrukcja PDF po polsku
│   └── en.pdf               # instrukcja PDF po angielsku
├── Old/                     # materiały źródłowe poprzedniej wersji
│   ├── HowToUse_Org.pdf
│   └── Kalkulator_Org.html
├── index.html               # strona startowa ze stylami inline
├── KalkulatorXP.html        # kalkulator wydatków XP
├── TworzeniePostaci.html    # arkusz tworzenia postaci
└── kalkulatorxp.css         # główny arkusz stylów dla obu narzędzi
```

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## 🇬🇧 Manual (EN)
### Quick start
1. Open `index.html` in a browser (double-click or drag-and-drop into the browser window).
   - Browser tab title on the start page: **Kozie Liczydła**.
2. On the start screen choose a tool:
   - **XP Calculator** (`KalkulatorXP.html`) – calculates the XP cost for attributes and skills.
   - **Character Creation** (`TworzeniePostaci.html`) – a character sheet with an XP pool, limit checks, and tables.

> ℹ️ **Mobile note**
>
> Auto-fitting inputs in `TworzeniePostaci.html` can look worse in portrait on mobile devices. A desktop or landscape mode is recommended.

### How to use
#### 1) XP Calculator
1. In the **Attributes** and **Skills** tables, enter **current** and **target** values.
   - Attributes range from `0–12`.
   - Skills range from `0–8`.
2. The XP cost in each row (centered within the cell) and the **Total XP cost** update automatically on every change.
3. The **Reset values** button sets all fields to `0`.

#### 2) Character Creation
1. Set the **XP pool** in the field at the top.
2. Fill in **Attributes** (default starts at 1) and **Skills** (default 0).
3. Add costs for talents, powers, archetypes, etc. in the **Talents…** table.
4. Watch the messages under the XP section:
   - **XP pool exceeded** – shown when spending exceeds the available pool.
   - **Tree of Learning** – shown when the number of active skills is too low for their level.
5. The language switch (PL/EN) is in the top-right corner. Changing the language resets all data (confirmation required).
6. The **Instrukcja / Manual** button opens the full PDF manual for the current language (`HowToUse/pl.pdf` or `HowToUse/en.pdf`).

### Updating the app (for users)
The app is static — “updating” means replacing files or editing the HTML/CSS manually.

#### File updates
- Download the latest files and **replace** the old `index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html`, and `kalkulatorxp.css`.
- If you keep custom changes (e.g., extra rows), back them up and reapply after updating.

#### Common modifications
- **Changing XP costs**:
  - `KalkulatorXP.html` → `<script>` section: `attributeCosts` and `skillCosts` objects.
  - `TworzeniePostaci.html` → `<script>` section: `attributeCosts` and `skillCosts` objects.
- **Changing the number of rows in tables**:
  - `KalkulatorXP.html` – you can add rows; the script reads all table rows automatically.
  - `TworzeniePostaci.html` – after adding rows, update the `for` loops in the script (skills: `1..9`, talents: `1..10`).
- **Changing the look and feel**:
  - `kalkulatorxp.css` styles `KalkulatorXP.html` and most of `TworzeniePostaci.html`.
  - `TworzeniePostaci.html` includes extra inline styles in its `<style>` section.
  - `index.html` has its own CSS in a `<style>` block.
  - The visual theme matches `Main/index.html` (green glow, console-style font stack), with secondary text at `#4FAF4F` and brighter highlights at `#D2FAD2`.

### Directory structure
```
.
├── docs/
│   ├── README.md            # user instructions (this file)
│   └── Documentation.md     # detailed code and logic description
├── HowToUse/
│   ├── pl.pdf               # PDF manual in Polish
│   └── en.pdf               # PDF manual in English
├── Old/                     # legacy source materials
│   ├── HowToUse_Org.pdf
│   └── Kalkulator_Org.html
├── index.html               # landing page with inline styles
├── KalkulatorXP.html        # XP spending calculator
├── TworzeniePostaci.html    # character creation sheet
└── kalkulatorxp.css         # main stylesheet shared by both tools
```

### Disclaimer
This tool is an unofficial fan-made project created to help GMs in Wrath & Glory. The app is provided for free for private, non-commercial use only. The project is not licensed, affiliated with, or supported by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation.
Warhammer 40,000 and related names and trademarks are owned by Games Workshop Limited; Wrath & Glory is owned by their respective rights holders.

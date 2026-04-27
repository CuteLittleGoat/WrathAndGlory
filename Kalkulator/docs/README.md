# Kalkulator Wrath & Glory – instrukcja użytkownika

Ten projekt to zestaw statycznych stron HTML do planowania rozwoju postaci w systemie **Wrath & Glory**. Aplikacja działa lokalnie w przeglądarce (bez serwera i bez instalacji). Wystarczy otworzyć pliki HTML.

## 🇵🇱 Instrukcja (PL)
### Szybki start
1. Otwórz plik `index.html` w przeglądarce (dwuklik lub przeciągnięcie pliku do okna przeglądarki).
   - Tytuł karty przeglądarki na stronie startowej: **Kozie Liczydła**.
2. Na ekranie startowym wybierz narzędzie:
   - **Kalkulator XP** (`KalkulatorXP.html`) – liczy koszt rozwoju atrybutów i umiejętności.
   - **Tworzenie Postaci** (`TworzeniePostaci.html`) – arkusz budowania postaci z pulą XP, kontrolą limitów i tabelami.
3. W prawym dolnym obszarze panelu (pod siatką głównych przycisków) znajduje się czerwony przycisk **Tajny przycisk!** w stylu identycznym jak przycisk **Włącz powiadomienia** z modułu Main — otwiera GIF `Koza.gif` jako nakładkę (overlay).

> ℹ️ **Uwaga dotycząca urządzeń mobilnych**
>
> Autodopasowanie pól w `TworzeniePostaci.html` pogarsza wygląd arkusza w pionowej orientacji ekranów mobilnych. Najwygodniej korzystać na komputerze lub w poziomie.

### Instrukcja używania
#### 1) Kalkulator XP
1.5. Obok przycisku resetu jest teraz przycisk **Strona Główna / Main Page**, który przenosi do `../Main/index.html`.
1. W prawym górnym rogu wybierz język interfejsu (domyślnie **Polski**).
2. W tabelach **Atrybuty** i **Umiejętności** wpisz wartości **aktualne** i **docelowe**.
   - Atrybuty mają zakres `0–12`.
   - Umiejętności mają zakres `0–8`.
3. Koszt XP w każdym wierszu (wyrównany do środka komórki) oraz suma **Całkowity koszt XP** uaktualniają się automatycznie po każdej zmianie.
4. Pod tabelami **Atrybuty** i **Umiejętności** znajduje się nowa tabela referencyjna z maksymalnymi wartościami atrybutów dla 10 ras (układ zebra-striping, wartości wyśrodkowane).
5. Nazwy ras i atrybutów w tabeli referencyjnej przełączają się automatycznie między PL i EN.
6. Przycisk **Resetuj wartości** ustawia wszystkie pola wejściowe na `0` (tabela referencyjna jest stałą informacją i nie resetuje się, bo nie zawiera pól edycyjnych).

#### 2) Tworzenie Postaci
7. W prawym górnym rogu dodano przycisk **Strona Główna / Main Page** prowadzący do `../Main/index.html`.
1. Ustaw **pulę XP do wydania** w polu u góry (domyślna wartość po wejściu i po resecie: `155`).
2. Wypełnij **Atrybuty** (domyślnie startują od 1, z wyjątkiem **Szybkość**, która domyślnie startuje od 6) i **Umiejętności** (domyślnie 0).
3. Dodaj koszty talentów, mocy, archetypów itp. w tabeli **Talenty…**.
4. Obserwuj komunikaty pod sekcją XP:
   - **Przekroczenie puli XP** – pojawia się, gdy wydatki są większe niż dostępna pula.
   - **Drzewo Nauki** – pojawia się, gdy liczba aktywnych umiejętności jest zbyt mała w stosunku do ich poziomu.
5. Przełącznik języka (PL/EN) znajduje się w prawym górnym rogu. Po zmianie języka aplikacja resetuje wszystkie dane (wymaga potwierdzenia).
6. Przycisk **Instrukcja / Manual** otwiera PDF z pełną instrukcją dla aktualnego języka (`HowToUse/pl.pdf` lub `HowToUse/en.pdf`).
7. Sekcja **Atrybuty** zawiera teraz 8. pole: **Szybkość / Speed**. Pole działa identycznie jak pozostałe atrybuty (zakres, koszt, wpływ na pulę).
8. Pod przyciskiem **Strona Główna / Main Page** znajduje się przycisk **Maksymalne wartości atrybutów / Maximum attribute values** (ten sam styl co przyciski instrukcji/powrotu, bez czerwonej palety).
9. Przycisk otwiera okno z tabelą maksymalnych wartości atrybutów dla ras (dane PL/EN zaszyte w kodzie, wartości wyśrodkowane, zebra striping).
10. Przycisk **Reset** przywraca wartości domyślne: wszystkie atrybuty wracają do `1`, a **Szybkość** do `6`.

#### 3) Tajny przycisk (GIF)
1. Na stronie startowej kliknij **Tajny przycisk!** (mały czerwony przycisk „pill” wyrównany do prawej pod główną siatką przycisków).
2. Otworzy się nakładka z animacją `Koza.gif`.
3. Zamknij nakładkę:
   - przyciskiem **Zamknij** (wyrównanym do prawego dolnego rogu okna GIF-a),
   - kliknięciem poza GIF-em,
   - klawiszem `Escape`.

### Utrzymanie aplikacji (dla użytkownika)
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

### Bieżący stan funkcji
- `KalkulatorXP.html`: w tabeli **Maksymalne wartości atrybutów** nazwy ras w pierwszej kolumnie zostały wyrównane do lewej, aby poprawić czytelność dłuższych nazw.
- `TworzeniePostaci.html`: w modalu otwieranym przyciskiem **Maksymalne wartości atrybutów** nazwy ras w pierwszej kolumnie również są teraz wyrównane do lewej.
- Wartości liczbowe w pozostałych kolumnach pozostają wyśrodkowane.

### Bieżący stan funkcji
- `TworzeniePostaci.html`: dodano 8. atrybut **Szybkość / Speed** (`attr_Speed`) i rozszerzono logikę przeliczeń/resetu/tłumaczeń z 7 do 8 atrybutów.
- `TworzeniePostaci.html`: atrybut **Szybkość / Speed** ma domyślną wartość `6` przy wejściu na stronę oraz po użyciu resetu (pozostałe atrybuty pozostają domyślnie na `1`).
- Dodano przycisk **Maksymalne wartości atrybutów / Maximum attribute values** pod przyciskiem **Strona Główna / Main Page**.
- Przycisk otwiera modal z tabelą maksymalnych wartości atrybutów dla 10 ras (dane zaszyte w JS na podstawie `Race_1..Race_10` i `Attribute_1..Attribute_8`).
- Styl przycisku pozostaje zgodny z przyciskami **Instrukcja** i **Strona Główna** (bez czerwonej kolorystyki).
- Tabela w modalu ma wyśrodkowane wartości, przewijanie poziome na małych ekranach i układ zebra striping zgodny z motywem aplikacji.

### Bieżący stan funkcji
- W polskiej wersji językowej skrót **XP** został zastąpiony skrótem **PD** (Punkty Doświadczenia) w interfejsie modułu Kalkulator.
- `index.html`: etykieta przycisku zmieniona na **Kalkulator PD** (bez zmiany linku do `KalkulatorXP.html`).
- `KalkulatorXP.html`: polskie etykiety i nagłówki zmieniono na warianty z **PD** (np. *Kalkulator PD*, *Suma PD...*, *Koszt PD*).
- `TworzeniePostaci.html`: polskie etykiety puli i błędu przekroczenia puli zmieniono na warianty z **PD** (np. *Pula PD do wydania*).
- `TworzeniePostaci.html`: domyślna wartość pola **Pula PD do wydania** została zwiększona z `100` do `155` (wartość startowa, po zmianie języka i po resecie).

### Bieżący stan funkcji
- W `KalkulatorXP.html` dodano nową sekcję pod tabelami **Atrybuty** i **Umiejętności**: tabelę referencyjną z maksymalnymi wartościami 8 atrybutów dla 10 ras.
- Dane tabeli zostały zaszyte bezpośrednio w kodzie JS (`attributeMaximumRows` + słowniki nazw ras i atrybutów dla PL/EN). Pliki pomocnicze `MaxAttributes.md` i `Labels.md` nie są wczytywane przez aplikację.
- Zastosowano styl zgodny z resztą aplikacji: zielona paleta, centralne wyrównanie, zebra striping oraz hover dla wierszy.
- Usunięto planowany komunikat o stałym limicie umiejętności = 8 (zgodnie z decyzją: limit nie jest zależny od rasy i nie wymaga osobnej informacji).
- Ujednolicono nazwy sekcji referencyjnej: **Maksymalne wartości atrybutów** / **Maximum attribute values** (bez dopisków „informacyjne” / „reference”) oraz usunięto podpis kolumny **Rasa / Species** z nagłówka tabeli.

### Bieżący stan funkcji
- W `index.html` dopasowano przycisk **Tajny przycisk!** do stylu przycisku **Włącz powiadomienia** z modułu Main (ten sam rozmiar, kształt „pill”, kolorystyka i prawa strona panelu).
- Dodano overlay z GIF-em `Koza.gif`, otwierany po kliknięciu i zamykany przez:
  - przycisk **Zamknij** (pozycja: prawy dolny róg okna GIF-a),
  - kliknięcie tła nakładki,
  - klawisz `Escape`.
- Zachowano dotychczasowe położenie przycisków **Kalkulator XP** i **Tworzenie Postaci** względem siebie (pozostają obok siebie w jednej linii).

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
3. In the lower-right area of the panel (below the main button grid) there is a red **Tajny przycisk!** button styled exactly like the Main module's **Enable notifications** button; it opens `Koza.gif` in an overlay.

> ℹ️ **Mobile note**
>
> Auto-fitting inputs in `TworzeniePostaci.html` can look worse in portrait on mobile devices. A desktop or landscape mode is recommended.

### How to use
#### 1) XP Calculator
1.5. Next to reset there is now a **Strona Główna / Main Page** button that navigates to `../Main/index.html`.
1. Use the language switcher in the top-right corner (Polish is selected by default).
2. In the **Attributes** and **Skills** tables, enter **current** and **target** values.
   - Attributes range from `0–12`.
   - Skills range from `0–8`.
3. The XP cost in each row (centered within the cell) and the **Total XP cost** update automatically on every change.
4. A new reference table is displayed below the **Attributes** and **Skills** tables, showing maximum attribute values for 10 species (zebra-striping layout, centered values).
5. Species and attribute names in the reference table switch automatically between PL and EN.
6. The **Reset values** button sets all editable input fields to `0` (the reference table is static informational content).

#### 2) Character Creation
7. The top-right area now includes a **Strona Główna / Main Page** button that opens `../Main/index.html`.
1. Set the **XP pool** in the field at the top (default value on load and after reset: `155`).
2. Fill in **Attributes** (default starts at 1, except **Speed**, which defaults to 6) and **Skills** (default 0).
3. Add costs for talents, powers, archetypes, etc. in the **Talents…** table.
4. Watch the messages under the XP section:
   - **XP pool exceeded** – shown when spending exceeds the available pool.
   - **Tree of Learning** – shown when the number of active skills is too low for their level.
5. The language switch (PL/EN) is in the top-right corner. Changing the language resets all data (confirmation required).
6. The **Instrukcja / Manual** button opens the full PDF manual for the current language (`HowToUse/pl.pdf` or `HowToUse/en.pdf`).
7. The **Attributes** section now includes an 8th field: **Szybkość / Speed**. It uses the same rules as other attributes (range, cost, XP impact).
8. Under **Strona Główna / Main Page** there is a **Maksymalne wartości atrybutów / Maximum attribute values** button (same style as Manual/Main Page buttons; not red).
9. The button opens a modal with species maximum-attribute values (PL/EN labels hardcoded in JS, centered values, zebra striping).
10. The **Reset** action restores defaults: all attributes return to `1`, while **Speed** returns to `6`.

#### 3) Secret button (GIF)
1. On the landing page click **Tajny przycisk!** (the small red pill button aligned to the right below the main button grid).
2. An overlay opens with the animated `Koza.gif`.
3. Close it by:
   - clicking **Zamknij** (aligned to the bottom-right corner of the GIF window),
   - clicking outside the GIF,
   - pressing `Escape`.

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

### Current behavior
- `KalkulatorXP.html`: in the **Maximum attribute values** table, species names in the first column are now left-aligned for better readability of longer names.
- `TworzeniePostaci.html`: in the modal opened by **Maximum attribute values**, species names in the first column are now left-aligned as well.
- Numeric values in the remaining columns stay centered.

### Current behavior
- `TworzeniePostaci.html`: added the 8th attribute **Szybkość / Speed** (`attr_Speed`) and extended recalculation/reset/translation logic from 7 to 8 attributes.
- `TworzeniePostaci.html`: the **Szybkość / Speed** attribute now defaults to `6` on page load and after reset (all other attributes still default to `1`).
- Added **Maksymalne wartości atrybutów / Maximum attribute values** button below **Strona Główna / Main Page**.
- The button opens a modal with maximum attribute values for 10 species (data hardcoded in JS using `Race_1..Race_10` and `Attribute_1..Attribute_8`).
- The button style now matches **Instrukcja/Manual** and **Strona Główna/Main Page** buttons (no red palette).
- Modal table uses centered values, horizontal overflow support on small screens, and zebra striping consistent with the app theme.

### Current behavior
- In the Polish language version, the **XP** abbreviation was replaced with **PD** (*Punkty Doświadczenia*) across the Calculator module UI.
- `index.html`: button label changed to **Kalkulator PD** (without changing the link target `KalkulatorXP.html`).
- `KalkulatorXP.html`: Polish labels/headings now use **PD** variants (for example *Kalkulator PD*, *Suma PD...*, *Koszt PD*).
- `TworzeniePostaci.html`: Polish pool and pool-overflow labels now use **PD** variants (for example *Pula PD do wydania*).
- `TworzeniePostaci.html`: the default **XP/PD pool** value was increased from `100` to `155` (initial load, after language switch, and after reset).

### Current behavior
- Added a new section in `KalkulatorXP.html` below **Attributes** and **Skills**: a reference table with maximum values for 8 attributes across 10 species.
- The table data is hardcoded directly in JS (`attributeMaximumRows` + PL/EN dictionaries for species and attribute labels). Helper files `MaxAttributes.md` and `Labels.md` are not loaded at runtime.
- Styling remains aligned with the app's look: green palette, centered values, zebra striping, and hover row feedback.
- Removed the planned standalone note about the constant skills limit = 8 (as requested, it is not species-dependent and does not need separate display).
- Standardized the reference section labels to **Maksymalne wartości atrybutów** / **Maximum attribute values** (without “informacyjne” / “reference”) and removed the **Rasa / Species** header label from the table.

### Current behavior
- Updated the **Tajny przycisk!** button in `index.html` to match the **Enable notifications** button style from the Main module (same compact size, pill shape, color palette, and right-side placement).
- Added a `Koza.gif` overlay opened by that button and closed by:
  - **Zamknij** button (positioned in the bottom-right corner of the GIF window),
  - clicking on overlay background,
  - `Escape` key.
- Kept the existing relative position of **Kalkulator XP** and **Tworzenie Postaci** (still side-by-side in one row).

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

## Aktualizacja 2026-04-27 – zapis/odczyt Firebase (Tworzenie Postaci)

### 🇵🇱 Co nowego dla użytkownika
1. W module **Tworzenie Postaci** pod sekcją puli PD dodano przyciski **Zapisz** i **Wczytaj**.
2. Przed wykonaniem zapisu oraz odczytu pojawia się okno potwierdzenia z przyciskami **Tak/Nie**.
3. Treści przycisków i okna potwierdzenia automatycznie dopasowują się do języka aplikacji (PL/EN).
4. **Zapisz** nadpisuje poprzedni stan w Firebase.
5. **Wczytaj** przywraca pełny stan formularza (wszystkie pola), a kalkulacja punktów aktualizuje się automatycznie.

### 🇬🇧 What is new for users
1. In **Character Creation**, new **Save** and **Load** buttons were added below the XP pool section.
2. Before saving and loading, a confirmation window appears with **Yes/No** actions.
3. Button labels and confirmation texts automatically follow the currently selected language (PL/EN).
4. **Save** overwrites the previous state in Firebase.
5. **Load** restores the full form state (all fields), then XP calculations refresh automatically.

## Firebase – wymagania użytkowe / User requirements

### 🇵🇱
Aby funkcja **Zapisz/Wczytaj** działała poprawnie:
1. W Firestore musi istnieć dokument `character_builder/current`.
2. Reguły Firestore muszą zezwalać na odczyt i zapis tej ścieżki.
3. Plik `Kalkulator/config/firebase-config.js` musi zawierać poprawną konfigurację projektu.

### 🇬🇧
For **Save/Load** to work correctly:
1. Firestore must contain `character_builder/current`.
2. Firestore Rules must allow read/write for this path.
3. `Kalkulator/config/firebase-config.js` must contain valid project configuration.

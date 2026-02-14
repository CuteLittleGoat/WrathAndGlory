# Generator NPC — instrukcja obsługi / User guide

## Polski (PL)

### Wymagania
- Przeglądarka z obsługą JavaScript (np. Chrome, Firefox, Edge).
- Dostęp do internetu, aby pobrać dane z `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`.
Tytuł karty przeglądarki: **Generator NPC**.

### Jak korzystać z aplikacji
1. Otwórz plik `index.html` w przeglądarce.
2. W prawym górnym rogu wybierz język (domyślnie **Polski**).
3. Poczekaj na wczytanie danych — status pojawi się w panelu „Źródło danych”.
4. W panelu „Wybór bazowy” wybierz rekord z listy „Bestiariusz · Nazwa”.
5. (Opcjonalnie) Wpisz własne notatki w polu „Uwagi do rekordu”.
6. W tabeli „Podgląd bazowy” możesz korygować wartości liczbowe (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Żywotność, Odporność Psychiczna, Upór, Odwaga, Szybkość) za pomocą pól z przyciskami góra–dół.
   - Minimalna wartość dla większości pól to 1.
   - Dla pola „Odporność (w tym WP)” minimum zależy od „WP”; gdy „WP” ma wartość „-”, minimum to 1.
   - Jeśli „Odporność Psychiczna” ma wartość „-”, pole jest zablokowane i nie podlega edycji.
   - Każde pole liczbowe przyjmuje maksymalnie 25 znaków (dłuższe wpisy są automatycznie ucinane także przy wstępnym wypełnieniu), a szerokość pola jest wizualnie ograniczona do 25 znaków.
7. Przy polu „Umiejętności” użyj przycisku „Edytuj”, aby włączyć edycję i zapisać własny opis.
8. W sekcji „Moduły aktywne” zdecyduj, które moduły mają być widoczne:
   - Broń, Pancerz, Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy.
9. W każdej aktywnej karcie wybierz pozycje z listy (możesz zaznaczyć wiele pozycji).
   - Dodatkowe przełączniki pozwalają dołączyć opisy cech lub pełne opisy modułów.
10. Kliknij „Generuj kartę”, aby otworzyć kartę do druku w nowej karcie przeglądarki.
11. Kliknij „Reset”, aby wyczyścić wybory i przywrócić domyślne ustawienia.
12. W panelu „Ulubione” wpisz opcjonalny alias i użyj „Dodaj do ulubionych”, aby zapisać bieżący zestaw ustawień (bestiariusz, modyfikacje, notatki i moduły). Zapisane wpisy możesz wczytać, usunąć lub zmienić kolejność przyciskami ▲/▼.
    - Domyślnie aplikacja łączy się z Firestore (konfiguracja w `GeneratorNPC/config/firebase-config.js`) i zapisuje listę w dokumencie `generatorNpc/favorites`.
    - Jeśli Firestore jest niedostępny, ulubione są przechowywane lokalnie w przeglądarce.

### Podpowiedzi
- Klikaj w tagi cech, aby zobaczyć opis cechy w panelu popover.
- W tabelach długie komórki można rozwijać kliknięciem (pojawia się wskazówka „kliknij, aby rozwinąć”).
- Listy wyboru są sortowane domyślnie wg kolumny `LP` z danych (kolumna jest ukryta); przy braku `LP` zachowany jest porządek alfabetyczny lub typ → nazwa (np. Bestiariusz i Talenty alfabetycznie, a Broń/Pancerz/Augumentacje/Ekwipunek/Psionika po typie i nazwie).
- Na wygenerowanej karcie pojawia się sekcja kwadratów „Ż” i „T”, która wizualizuje wartości „Żywotność” i „Odporność psych.” (liczba pól aktualizuje się na podstawie edycji w tabeli; przy wartości „-” dla odporności psychicznej widoczna jest wyłącznie etykieta „T”). Etykiety „Ż/T” są niezależnymi, jednopolowymi kwadratami, a liczba pól w wierszu skaluje się do szerokości całej karty (bez stałego limitu w linii). Po przełączeniu na EN etykiety te zmieniają się odpowiednio na „H” i „S”, a pozostałe podpisy na karcie są tłumaczone.
- Interfejs używa zielonego, konsolowego motywu spójnego z `Main/index.html`, z kolorem tekstu pomocniczego `#4FAF4F` i jaśniejszymi wyróżnieniami `#D2FAD2`.

---

## English (EN)

### Requirements
- A JavaScript-enabled browser (e.g., Chrome, Firefox, Edge).
- Internet access to load data from `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`.
Browser tab title: **Generator NPC**.

### How to use the application
1. Open `index.html` in your browser.
2. Use the language switcher in the top-right corner (Polish is selected by default).
3. Wait for the data to load — the status appears in the “Źródło danych” panel.
4. In “Wybór bazowy”, select an entry from “Bestiariusz · Nazwa”.
5. (Optional) Enter your own notes in “Uwagi do rekordu”.
6. In the “Podgląd bazowy” table, adjust numeric values (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Żywotność, Odporność Psychiczna, Upór, Odwaga, Szybkość) using the up/down number inputs.
   - The minimum value for most fields is 1.
   - For “Odporność (w tym WP)”, the minimum equals the “WP” value; if “WP” is “-”, the minimum is 1.
   - When “Odporność Psychiczna” is “-”, the field is locked and cannot be edited.
   - Each numeric field accepts up to 25 characters (longer input is automatically truncated, including on initial fill), and the input width is visually capped to 25 characters.
7. Use the “Edytuj” button next to “Umiejętności” to enable editing and save your custom text.
8. In “Moduły aktywne”, decide which modules should be visible:
   - Weapons, Armor, Augmentations, Equipment, Talents, Psionics, Prayers.
9. In each active card, select items from the list (multi-select is supported).
   - Additional toggles let you include trait descriptions or full module details.
10. Click “Generuj kartę” to open a printable card in a new browser tab.
11. Click “Reset” to clear selections and restore defaults.
12. In the “Ulubione” panel, enter an optional alias and use “Dodaj do ulubionych” to save the current setup (bestiary, overrides, notes, and modules). You can load, remove, or reorder saved entries using the ▲/▼ buttons.
    - By default, the app connects to Firestore (configured in `GeneratorNPC/config/firebase-config.js`) and stores the list in the `generatorNpc/favorites` document.
    - If Firestore is unavailable, favorites are stored locally in the browser.

### Tips
- Click trait tags to see their description in the popover panel.
- In tables, long cells can be expanded by clicking them (a “click to expand” hint is shown).
- Selection lists default to the hidden `LP` ordering from the data; when `LP` is missing, they fall back to alphabetical or type → name ordering (e.g., Bestiary and Talents alphabetically, while Weapons/Armor/Augmentations/Equipment/Psionics by type and name).
- The printed card includes “Ż” and “T” square trackers that visualize “Żywotność” and “Odporność psych.” (the number of squares reflects table edits; when mental resistance is “-”, only the “T” label is shown). The “Ż/T” labels are independent one-square fields, and the squares per row scale with the full card width (no fixed per-line cap). When switched to EN, these labels change to “H” and “S”, and the remaining card labels are translated.
- The interface uses the same green, console-style theme as `Main/index.html`, with secondary text set to `#4FAF4F` and brighter highlights at `#D2FAD2`.

---

## Firebase config reference / Referencja konfiguracji Firebase
- Szczegółową instrukcję konfiguracji Firebase dla modułu, strukturę Firestore (`generatorNpc/favorites`) oraz skrypt inicjalizacyjny znajdziesz w: `GeneratorNPC/config/Firebase-config.md`.
- Full Firebase setup instructions, Firestore data shape (`generatorNpc/favorites`), and the initialization script are documented in: `GeneratorNPC/config/Firebase-config.md`.

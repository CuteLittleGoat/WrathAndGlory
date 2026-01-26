# Generator NPC — instrukcja obsługi / User guide

## Polski (PL)

### Wymagania
- Przeglądarka z obsługą JavaScript (np. Chrome, Firefox, Edge).
- Dostęp do internetu, aby pobrać dane z `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`.

### Jak korzystać z aplikacji
1. Otwórz plik `index.html` w przeglądarce.
2. Poczekaj na wczytanie danych — status pojawi się w panelu „Źródło danych”.
3. W panelu „Wybór bazowy” wybierz rekord z listy „Bestiariusz · Nazwa”.
4. (Opcjonalnie) Wpisz własne notatki w polu „Uwagi do rekordu”.
5. W tabeli „Podgląd bazowy” możesz korygować wartości liczbowe (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Odporność Psychiczna, Żywotność, Upór, Odwaga, Szybkość) za pomocą pól z przyciskami góra–dół.
   - Minimalna wartość dla większości pól to 1.
   - Dla pola „Odporność (w tym WP)” minimum zależy od „WP”; gdy „WP” ma wartość „-”, minimum to 1.
   - Gdy „Odporność Psychiczna” w rekordzie ma wartość „-”, pole nie jest edytowalne i pozostaje „-”.
   - Każde pole liczbowe przyjmuje maksymalnie 25 znaków (dłuższe wpisy są automatycznie ucinane także przy wstępnym wypełnieniu), a szerokość pola jest wizualnie ograniczona do 25 znaków.
6. Przy polu „Umiejętności” użyj przycisku „Edytuj”, aby włączyć edycję i zapisać własny opis.
7. W sekcji „Moduły aktywne” zdecyduj, które moduły mają być widoczne:
   - Broń, Pancerz, Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy.
8. W każdej aktywnej karcie wybierz pozycje z listy (możesz zaznaczyć wiele pozycji).
   - Dodatkowe przełączniki pozwalają dołączyć opisy cech lub pełne opisy modułów.
9. Kliknij „Generuj kartę”, aby otworzyć kartę do druku w nowej karcie przeglądarki.
10. Kliknij „Reset”, aby wyczyścić wybory i przywrócić domyślne ustawienia.

### Podpowiedzi
- Klikaj w tagi cech, aby zobaczyć opis cechy w panelu popover.
- W tabelach długie komórki można rozwijać kliknięciem (pojawia się wskazówka „kliknij, aby rozwinąć”).
- Listy wyboru są sortowane (np. Bestiariusz i Talenty alfabetycznie, a Broń/Pancerz/Augumentacje/Ekwipunek/Psionika po typie i nazwie).
- Interfejs używa zielonego, konsolowego motywu spójnego z `Main/index.html`, z kolorem tekstu pomocniczego `#4FAF4F` i jaśniejszymi wyróżnieniami `#D2FAD2`.
- Na wygenerowanej karcie pomiędzy sekcjami „Odporność” a „Umiejętności” znajduje się blok pól w formie małych kwadratów, które odzwierciedlają wartości „Żywotność” i „Odporność psych.”; jeśli „Odporność psych.” ma wartość „-”, wyświetla się tylko etykieta „T” bez dodatkowych kwadratów.

---

## English (EN)

### Requirements
- A JavaScript-enabled browser (e.g., Chrome, Firefox, Edge).
- Internet access to load data from `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`.

### How to use the application
1. Open `index.html` in your browser.
2. Wait for the data to load — the status appears in the “Źródło danych” panel.
3. In “Wybór bazowy”, select an entry from “Bestiariusz · Nazwa”.
4. (Optional) Enter your own notes in “Uwagi do rekordu”.
5. In the “Podgląd bazowy” table, adjust numeric values (S, Wt, Zr, I, SW, Int, Ogd, Odporność (w tym WP), Obrona, Odporność Psychiczna, Żywotność, Upór, Odwaga, Szybkość) using the up/down number inputs.
   - The minimum value for most fields is 1.
   - For “Odporność (w tym WP)”, the minimum equals the “WP” value; if “WP” is “-”, the minimum is 1.
   - When “Odporność Psychiczna” is “-” in the record, the field is not editable and stays “-”.
   - Each numeric field accepts up to 25 characters (longer input is automatically truncated, including on initial fill), and the input width is visually capped to 25 characters.
6. Use the “Edytuj” button next to “Umiejętności” to enable editing and save your custom text.
7. In “Moduły aktywne”, decide which modules should be visible:
   - Weapons, Armor, Augmentations, Equipment, Talents, Psionics, Prayers.
8. In each active card, select items from the list (multi-select is supported).
   - Additional toggles let you include trait descriptions or full module details.
9. Click “Generuj kartę” to open a printable card in a new browser tab.
10. Click “Reset” to clear selections and restore defaults.

### Tips
- Click trait tags to see their description in the popover panel.
- In tables, long cells can be expanded by clicking them (a “click to expand” hint is shown).
- Selection lists are sorted (e.g., Bestiary and Talents alphabetically, while Weapons/Armor/Augmentations/Equipment/Psionics by type and name).
- The interface uses the same green, console-style theme as `Main/index.html`, with secondary text set to `#4FAF4F` and brighter highlights at `#D2FAD2`.
- On the generated card, between the “Odporność” and “Umiejętności” sections, there is a block of small squares that reflects the “Żywotność” and “Odporność psych.” values; when “Odporność psych.” is “-”, only the “T” label is shown without additional squares.

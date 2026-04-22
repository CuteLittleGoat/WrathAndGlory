# Infoczytnik — README

## Instrukcja użytkownika (PL)
1. Otwórz `Infoczytnik_test.html` na ekranie graczy i `GM_test.html` w panelu MG.
2. W panelu GM wybierz niezależnie: **Tło**, **Logo**, **Zestaw fillerów**, **Font**, **Audio wiadomości**.
3. Kolejność logo po aktualizacji manifestu: `1 = Mechanicus`, `2 = Inkwizycja`.
4. Ustaw checkboxy: **Logo**, **Prostokąt cienia**, **Flicker**, **Fillery**, **Audio**.
5. Jeżeli wyłączysz **Prostokąt cienia**, opcja **Flicker** zostanie automatycznie wyłączona i zablokowana (z komunikatem).
6. Ustaw **Ilość linii fillerów** oraz **Wysokość stref Prefix/Suffix (linie)**.
7. Wpisz treść i kliknij **Wyślij**.
8. W ekranie gracza obszar cienia nie przewija się, ale zawartość w środku przewija się pionowo: prefix+logo znikają przy scrollu, a suffix pojawia się przy końcu treści.
9. **Ping** zawsze odtwarza `assets/audios/ping/Ping.mp3`.
10. **Wyczyść komunikat** czyści tylko pole tekstowe w GM.
11. **Przywróć domyślne** czyści tekst i resetuje wszystkie pola formularza do `DEFAULT_FORM_STATE`.
    - Domyślny preset GM: `Tło=10. WnG`, `Logo=1. Mechanicus`, `Zestaw fillerów=1. Mechanicus`, `Audio wiadomości=1. Text-On-Screen`, `Logo=OFF`, `Prostokąt cienia=OFF`, `Flicker=OFF`, `Audio=ON`, `Ilość linii fillerów=3`, `Wysokość Prefix/Suffix=2`, `Kolor treści=#00ff66`, `Rozmiar treści=20px`, `Kolor Prefix/Suffix=#ffffff`, `Rozmiar Prefix/Suffix=12px`.
12. Pole **Log importu** pokazuje wynik ładowania `assets/data/data.json` i pozwala skopiować całość.
13. Łamanie linii w prefix/suffix/wiadomości działa bez poziomego scrolla i bez wymuszonego dzielenia wyrazów.
14. Logo (gdy checkbox **Logo** jest aktywny) ma stały slot w prawym górnym rogu obszaru roboczego/prostokąta cienia i nie koliduje z prefixem.
15. `Infoczytnik_test.html` stabilizuje layout mobilny: używa wysokości `100dvh` (z fallbackiem `100vh`), nasłuchuje `visualViewport` i filtruje mikro-zmiany wysokości, aby ograniczyć „skoki” po przewijaniu na telefonie.
16. Rozmiar fontów i pionowe odstępy są skalowane względem rozmiaru obszaru overlay (`--overlayScale`, `--overlayPadY`, `--overlayGap`), więc wygląd PC/telefon/tablet jest bardziej spójny.
17. Pozycje obszaru roboczego (`CONTENT_RECTS_BY_BACKGROUND_ID`) zostały przeliczone ponownie dla wszystkich 10 teł na podstawie plików `assets/ramki/*_ramka.png` wskazanych w `assets/data/Mapowanie.xlsx`, dzięki czemu prostokąt cienia pokrywa pełną niebieską ramkę.
18. W sekcjach kolorów dla treści i fillerów układ jest teraz: **HEX + Picker** (w jednym rzędzie) → szybkie kolory (**Zielony, Czerwony, Złoty, Biały**) → pole rozmiaru fontu.
19. Kolory są obsługiwane jako **HEX-only** (`#RRGGBB` lub `#RGB`), a picker aktualizuje pole tekstowe zarówno przy `input`, jak i `change`.
20. Zmiana **Ilości linii fillerów** działa natychmiast bez konieczności zmiany zestawu fillerów.
21. Po włączeniu `Prostokąt cienia` hint Flickera nie pokazuje już komunikatu „aktywny (opcjonalny)”; ostrzeżenie jest widoczne tylko gdy prostokąt cienia jest wyłączony.
22. Rozmiary fontów są przesyłane do Infoczytnika jako liczby, dzięki czemu zmiana rozmiaru działa poprawnie.
23. `Infoczytnik_test.html` doładowuje ten sam zestaw Google Fonts co panel GM, więc zmiana fontu działa zgodnie z preview.
24. W sekcji kolorów **Prefix + Suffix** można od razu używać Pickera i ręcznie wpisywać HEX bez wcześniejszego klikania szybkich kolorów; ręcznie wpisany HEX jest walidowany po opuszczeniu pola.
25. Gdy pole HEX Prefix + Suffix ma niepełny kod (np. `#fffff`), picker nadal działa płynnie i od razu aktualizuje podgląd oraz pasek „Kolor | Pełny” — bez wymogu wcześniejszej korekty HEX.
26. Obok pola **Log importu** jest przycisk **Aktualizuj dane z XLSX**: pobiera stały plik `Infoczytnik/assets/data/DataSlate_manifest.xlsx`, generuje z niego nowy `data.json` w przeglądarce i automatycznie pobiera plik do zapisania/podmiany w `Infoczytnik/assets/data/data.json`.
27. `assets/data/data.json` został przebudowany z aktualnego `assets/data/DataSlate_manifest.xlsx`: dostępne są nowe/nazwane na nowo frakcje fontów i zestawy fillerów; domyślne ID (`Logo=1`, `Filler=1`, `Font=1`) pozostają kompatybilne z presetem.
28. W mini-podglądzie przełącznik zmieniono na **Podgląd: Treść / Tło**: `Treść` (domyślna) pokazuje warstwę tekstową i elementy kompozycji bez grafiki tła, a `Tło` pokazuje jedną miniaturę aktualnie wybranego pliku tła (obracaną o 90° w lewo), skalowaną na pełną wysokość pola podglądu (od górnej do dolnej krawędzi) bez deformacji; tryb jest zapisywany lokalnie i przywracany po odświeżeniu panelu GM (z migracją starych wartości `crop/full`).
29. Przycisk **Aktualizuj dane z XLSX** ma teraz taką samą wysokość jak pozostałe przyciski panelu i jest wyśrodkowany pionowo względem pola **Log importu** (pozostaje po prawej stronie logu).
30. Nazwa tła została ujednolicona do **Litannie Zagubionych** (plik `Litannie_Zagubionych.png`) i jest spójna z manifestem XLSX oraz mapowaniem ramek.
31. Dodano nowe tło **WnG** (`assets/backgrounds/WnG.png`) oraz jego pole robocze wyliczone z `assets/ramki/WnG_ramka.png` (`x=0.1214, y=0.0962, w=0.7385, h=0.8081`).
32. Wygenerowano nowy `assets/data/data.json` z aktualnego `assets/data/DataSlate_manifest.xlsx` (zawiera teraz 10 teł, w tym `id=10: WnG`).
33. Dla tła **Pergamin** przeliczono pole robocze z nowego pliku `assets/ramki/Pergamin_ramka.png`; aktualne wartości to `x=0.0771, y=0.1302, w=0.8672, h=0.6973` (zastępuje poprzedni preset).
34. Dodano plik techniczny `assets/data/NiebieskaRamka.md` z pełną metodą liczenia pola roboczego dla nowych teł na podstawie ramek PNG.
35. Import `DataSlate_manifest.xlsx -> data.json` dla `fillers.prefixes` i `fillers.suffixes` automatycznie dodaje dekorator `+++ TEKST +++` (zabezpieczenie przed podwójnym dodaniem, jeśli wpis już ma plusy); po zmianie wygenerowano nowy `assets/data/data.json` i aplikacja korzysta teraz z wersji z plusami.


## User guide (EN)
1. Open `Infoczytnik_test.html` on the player screen and `GM_test.html` on the GM screen.
2. In GM select independently: **Background**, **Logo**, **Filler set**, **Font**, **Message audio**.
3. Logo order after manifest update: `1 = Mechanicus`, `2 = Inkwizycja`.
4. Configure checkboxes: **Logo**, **Shadow rectangle**, **Flicker**, **Fillers**, **Audio**.
5. If **Shadow rectangle** is disabled, **Flicker** is automatically unchecked and disabled (with an on-screen hint).
6. Set **Filler line count** and **Prefix/Suffix band height (lines)**.
7. Enter message text and click **Wyślij / Send**.
8. On the player screen, the shadow area itself stays fixed while inner content scrolls vertically: prefix+logo scroll out at the top, suffix appears near the end.
9. **Ping** always plays `assets/audios/ping/Ping.mp3`.
10. **Wyczyść komunikat / Clear message** only clears GM text input.
11. **Przywróć domyślne / Restore defaults** clears text and resets all form fields to `DEFAULT_FORM_STATE`.
    - Default GM preset: `Background=10. WnG`, `Logo=1. Mechanicus`, `Filler set=1. Mechanicus`, `Message audio=1. Text-On-Screen`, `Logo=OFF`, `Shadow rectangle=OFF`, `Flicker=OFF`, `Audio=ON`, `Filler lines=3`, `Prefix/Suffix band=2`, `Message color=#00ff66`, `Message size=20px`, `Prefix/Suffix color=#ffffff`, `Prefix/Suffix size=12px`.
12. **Log importu / Import log** displays `assets/data/data.json` load results and can be copied entirely.
13. Prefix/suffix/message wrapping is vertical-only (no horizontal scroll, no forced word splitting).
14. Logo (when the **Logo** checkbox is enabled) uses a fixed slot in the top-right of the working area/shadow rectangle and does not overlap prefix text.
15. `Infoczytnik_test.html` now stabilizes mobile layout: it uses `100dvh` (with `100vh` fallback), listens to `visualViewport`, and filters tiny viewport-height changes to reduce post-scroll layout jumps on phones.
16. Font sizes and vertical spacing are now scaled from overlay dimensions (`--overlayScale`, `--overlayPadY`, `--overlayGap`), improving visual consistency across desktop/phone/tablet.
17. Working-area presets (`CONTENT_RECTS_BY_BACKGROUND_ID`) were recalculated for all 10 backgrounds using `assets/ramki/*_ramka.png` files mapped in `assets/data/Mapowanie.xlsx`, so the shadow rectangle covers the entire blue-frame area.
18. In both color sections (message and fillers), the layout is now: **HEX + Picker** (same row) → quick colors (**Green, Red, Gold, White**) → font-size field.
19. Colors are now **HEX-only** (`#RRGGBB` or `#RGB`), and each color picker syncs the text field on both `input` and `change`.
20. **Filler line count** now updates immediately without needing to switch filler sets.
21. When `Shadow rectangle` is enabled, the Flicker hint stays empty (no “active/optional” text); warning appears only when shadow rectangle is disabled.
22. Font sizes are sent to the player screen as numeric values, so runtime font-size changes apply correctly.
23. `Infoczytnik_test.html` now loads the same Google Fonts set as the GM panel, so font-family changes match the GM preview.
24. In the **Prefix + Suffix** color section, both the Picker and manual HEX input now work immediately (without pressing quick-color chips first); manual HEX is validated on field blur.
25. If Prefix + Suffix HEX contains a partial value (e.g. `#fffff`), the picker still updates immediately (including the “Color | Solid” bar and live preview) without requiring a prior HEX fix.
26. Next to **Import log**, the **Aktualizuj dane z XLSX** button fetches the fixed file `Infoczytnik/assets/data/DataSlate_manifest.xlsx`, builds a new `data.json` in-browser, and auto-downloads it so you can save/replace `Infoczytnik/assets/data/data.json`.
27. `assets/data/data.json` has been rebuilt from the updated `assets/data/DataSlate_manifest.xlsx`: new/renamed font factions and filler sets are now available, while default IDs (`Logo=1`, `Filler=1`, `Font=1`) stay preset-compatible.
28. The live preview toggle is now **Preview: Content / Background**: `Content` (default) shows the text-composition layer without background graphics, while `Background` shows a single thumbnail of the currently selected background file (rotated 90° left), scaled to the full preview height (top-to-bottom) without distortion; the selected mode is stored locally and restored after GM panel refresh (including migration from legacy `crop/full` values).
29. The **Aktualizuj dane z XLSX** button now matches the height of the other panel buttons and is vertically centered relative to the **Import log** field (it remains on the right side of the log).
30. The background name is now unified as **Litannie Zagubionych** (file `Litannie_Zagubionych.png`) and is consistent across XLSX manifest and frame mapping.
31. Added a new background **WnG** (`assets/backgrounds/WnG.png`) with a working-area rectangle derived from `assets/ramki/WnG_ramka.png` (`x=0.1214, y=0.0962, w=0.7385, h=0.8081`).
32. Rebuilt `assets/data/data.json` from the updated `assets/data/DataSlate_manifest.xlsx` (it now contains 10 backgrounds, including `id=10: WnG`).
33. For the **Pergamin** background, the working area was recalculated from the new `assets/ramki/Pergamin_ramka.png`; the current values are `x=0.0771, y=0.1302, w=0.8672, h=0.6973` (replacing the previous preset).
34. Added technical file `assets/data/NiebieskaRamka.md` with the full method for calculating working areas for new backgrounds from PNG frame files.
35. The `DataSlate_manifest.xlsx -> data.json` import now auto-wraps `fillers.prefixes` and `fillers.suffixes` as `+++ TEXT +++` (with double-wrap protection when pluses already exist); after this change a new `assets/data/data.json` was generated and the app now uses the plus-wrapped version.


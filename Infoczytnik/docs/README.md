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
12. Pole **Log importu** pokazuje wynik ładowania `assets/data/data.json` i pozwala skopiować całość.
13. Łamanie linii w prefix/suffix/wiadomości działa bez poziomego scrolla i bez wymuszonego dzielenia wyrazów.
14. Logo (gdy checkbox **Logo** jest aktywny) ma stały slot w prawym górnym rogu obszaru roboczego/prostokąta cienia i nie koliduje z prefixem.
15. `Infoczytnik_test.html` stabilizuje layout mobilny: używa wysokości `100dvh` (z fallbackiem `100vh`), nasłuchuje `visualViewport` i filtruje mikro-zmiany wysokości, aby ograniczyć „skoki” po przewijaniu na telefonie.
16. Rozmiar fontów i pionowe odstępy są skalowane względem rozmiaru obszaru overlay (`--overlayScale`, `--overlayPadY`, `--overlayGap`), więc wygląd PC/telefon/tablet jest bardziej spójny.
17. Pozycje obszaru roboczego (`CONTENT_RECTS_BY_BACKGROUND_ID`) zostały przeliczone ponownie dla wszystkich 9 teł na podstawie plików `assets/ramki/*_ramka.png` wskazanych w `Draft/Mapowanie.xlsx`, dzięki czemu prostokąt cienia pokrywa pełną niebieską ramkę.
18. W sekcjach kolorów dla treści i fillerów układ jest teraz: **HEX + Picker** (w jednym rzędzie) → szybkie kolory (**Zielony, Czerwony, Złoty, Biały**) → pole rozmiaru fontu.
19. Kolory są obsługiwane jako **HEX-only** (`#RRGGBB` lub `#RGB`), a picker aktualizuje pole tekstowe zarówno przy `input`, jak i `change`.
20. Zmiana **Ilości linii fillerów** działa natychmiast bez konieczności zmiany zestawu fillerów.
21. Po włączeniu `Prostokąt cienia` hint Flickera nie pokazuje już komunikatu „aktywny (opcjonalny)”; ostrzeżenie jest widoczne tylko gdy prostokąt cienia jest wyłączony.
22. Rozmiary fontów są przesyłane do Infoczytnika jako liczby, dzięki czemu zmiana rozmiaru działa poprawnie.
23. `Infoczytnik_test.html` doładowuje ten sam zestaw Google Fonts co panel GM, więc zmiana fontu działa zgodnie z preview.
24. W sekcji kolorów **Prefix + Suffix** można od razu używać Pickera i ręcznie wpisywać HEX bez wcześniejszego klikania szybkich kolorów; ręcznie wpisany HEX jest walidowany po opuszczeniu pola.
25. Gdy pole HEX Prefix + Suffix ma niepełny kod (np. `#fffff`), picker nadal działa płynnie i od razu aktualizuje podgląd oraz pasek „Kolor | Pełny” — bez wymogu wcześniejszej korekty HEX.
26. Naprawiono przypadek z kolorem `#ffffff`: gdy użytkownik wybierze biały i potem otworzy picker, zmiany z pickera ponownie działają poprawnie (kolor nie „zawiesza się” na białym).

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
12. **Log importu / Import log** displays `assets/data/data.json` load results and can be copied entirely.
13. Prefix/suffix/message wrapping is vertical-only (no horizontal scroll, no forced word splitting).
14. Logo (when the **Logo** checkbox is enabled) uses a fixed slot in the top-right of the working area/shadow rectangle and does not overlap prefix text.
15. `Infoczytnik_test.html` now stabilizes mobile layout: it uses `100dvh` (with `100vh` fallback), listens to `visualViewport`, and filters tiny viewport-height changes to reduce post-scroll layout jumps on phones.
16. Font sizes and vertical spacing are now scaled from overlay dimensions (`--overlayScale`, `--overlayPadY`, `--overlayGap`), improving visual consistency across desktop/phone/tablet.
17. Working-area presets (`CONTENT_RECTS_BY_BACKGROUND_ID`) were recalculated for all 9 backgrounds using `assets/ramki/*_ramka.png` files mapped in `Draft/Mapowanie.xlsx`, so the shadow rectangle covers the entire blue-frame area.
18. In both color sections (message and fillers), the layout is now: **HEX + Picker** (same row) → quick colors (**Green, Red, Gold, White**) → font-size field.
19. Colors are now **HEX-only** (`#RRGGBB` or `#RGB`), and each color picker syncs the text field on both `input` and `change`.
20. **Filler line count** now updates immediately without needing to switch filler sets.
21. When `Shadow rectangle` is enabled, the Flicker hint stays empty (no “active/optional” text); warning appears only when shadow rectangle is disabled.
22. Font sizes are sent to the player screen as numeric values, so runtime font-size changes apply correctly.
23. `Infoczytnik_test.html` now loads the same Google Fonts set as the GM panel, so font-family changes match the GM preview.
24. In the **Prefix + Suffix** color section, both the Picker and manual HEX input now work immediately (without pressing quick-color chips first); manual HEX is validated on field blur.
25. If Prefix + Suffix HEX contains a partial value (e.g. `#fffff`), the picker still updates immediately (including the “Color | Solid” bar and live preview) without requiring a prior HEX fix.
26. Fixed the `#ffffff` edge case: after selecting white, the color picker now continues to apply new colors correctly (no more “stuck on white” behavior).

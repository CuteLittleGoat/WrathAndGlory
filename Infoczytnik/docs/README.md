# Infoczytnik — README

## Instrukcja użytkownika (PL)
1. Otwórz `Infoczytnik_test.html` na ekranie graczy i `GM_test.html` w panelu MG.
2. W panelu GM wybierz niezależnie: **Tło**, **Logo**, **Zestaw fillerów**, **Font**, **Audio wiadomości**.
3. Ustaw checkboxy: **Logo**, **Prostokąt cienia**, **Flicker**, **Fillery**, **Audio**.
4. Jeżeli wyłączysz **Prostokąt cienia**, opcja **Flicker** zostanie automatycznie wyłączona i zablokowana (z komunikatem).
5. Ustaw **Ilość linii fillerów** oraz **Wysokość stref Prefix/Suffix (linie)**.
6. Wpisz treść i kliknij **Wyślij**.
7. W ekranie gracza obszar cienia nie przewija się, ale zawartość w środku przewija się pionowo: prefix+logo znikają przy scrollu, a suffix pojawia się przy końcu treści.
8. **Ping** zawsze odtwarza `assets/audios/ping/Ping.mp3`.
9. **Wyczyść komunikat** czyści tylko pole tekstowe w GM.
10. **Przywróć domyślne** czyści tekst i resetuje wszystkie pola formularza do `DEFAULT_FORM_STATE`.
11. Pole **Log importu** pokazuje wynik ładowania `assets/data/data.json` i pozwala skopiować całość.
12. Łamanie linii w prefix/suffix/wiadomości działa bez poziomego scrolla i bez wymuszonego dzielenia wyrazów.
13. Logo (gdy checkbox **Logo** jest aktywny) ma stały slot w prawym górnym rogu obszaru roboczego/prostokąta cienia i nie koliduje z prefixem.
14. `Infoczytnik_test.html` stabilizuje layout mobilny: używa wysokości `100dvh` (z fallbackiem `100vh`), nasłuchuje `visualViewport` i filtruje mikro-zmiany wysokości, aby ograniczyć „skoki” po przewijaniu na telefonie.
15. Rozmiar fontów i pionowe odstępy są skalowane względem rozmiaru obszaru overlay (`--overlayScale`, `--overlayPadY`, `--overlayGap`), więc wygląd PC/telefon/tablet jest bardziej spójny.
16. Pozycje obszaru roboczego (`CONTENT_RECTS_BY_BACKGROUND_ID`) zostały przeliczone ponownie dla wszystkich 9 teł na podstawie plików `assets/ramki/*_ramka.png` wskazanych w `Draft/Mapowanie.xlsx`, dzięki czemu prostokąt cienia pokrywa pełną niebieską ramkę.
17. W sekcjach kolorów dla treści i fillerów układ jest teraz: **HEX + Picker** (w jednym rzędzie) → szybkie kolory (**Zielony, Czerwony, Złoty, Biały**) → pole rozmiaru fontu.
18. Kolory są obsługiwane jako **HEX-only** (`#RRGGBB` lub `#RGB`), a picker aktualizuje pole tekstowe zarówno przy `input`, jak i `change`.
19. Zmiana **Ilości linii fillerów** działa natychmiast bez konieczności zmiany zestawu fillerów.
20. Po włączeniu `Prostokąt cienia` hint Flickera nie pokazuje już komunikatu „aktywny (opcjonalny)”; ostrzeżenie jest widoczne tylko gdy prostokąt cienia jest wyłączony.
21. Rozmiary fontów są przesyłane do Infoczytnika jako liczby, dzięki czemu zmiana rozmiaru działa poprawnie.
22. `Infoczytnik_test.html` doładowuje ten sam zestaw Google Fonts co panel GM, więc zmiana fontu działa zgodnie z preview.
23. W sekcji kolorów **Prefix + Suffix** można od razu używać Pickera i ręcznie wpisywać HEX bez wcześniejszego klikania szybkich kolorów; ręcznie wpisany HEX jest walidowany po opuszczeniu pola.
24. Gdy pole HEX Prefix + Suffix ma niepełny kod (np. `#fffff`), picker nadal działa płynnie i od razu aktualizuje podgląd oraz pasek „Kolor | Pełny” — bez wymogu wcześniejszej korekty HEX.
25. Naprawiono przypadek z kolorem `#ffffff`: gdy użytkownik wybierze biały i potem otworzy picker, zmiany z pickera ponownie działają poprawnie (kolor nie „zawiesza się” na białym).

## User guide (EN)
1. Open `Infoczytnik_test.html` on the player screen and `GM_test.html` on the GM screen.
2. In GM select independently: **Background**, **Logo**, **Filler set**, **Font**, **Message audio**.
3. Configure checkboxes: **Logo**, **Shadow rectangle**, **Flicker**, **Fillers**, **Audio**.
4. If **Shadow rectangle** is disabled, **Flicker** is automatically unchecked and disabled (with an on-screen hint).
5. Set **Filler line count** and **Prefix/Suffix band height (lines)**.
6. Enter message text and click **Wyślij / Send**.
7. On the player screen, the shadow area itself stays fixed while inner content scrolls vertically: prefix+logo scroll out at the top, suffix appears near the end.
8. **Ping** always plays `assets/audios/ping/Ping.mp3`.
9. **Wyczyść komunikat / Clear message** only clears GM text input.
10. **Przywróć domyślne / Restore defaults** clears text and resets all form fields to `DEFAULT_FORM_STATE`.
11. **Log importu / Import log** displays `assets/data/data.json` load results and can be copied entirely.
12. Prefix/suffix/message wrapping is vertical-only (no horizontal scroll, no forced word splitting).
13. Logo (when the **Logo** checkbox is enabled) uses a fixed slot in the top-right of the working area/shadow rectangle and does not overlap prefix text.
14. `Infoczytnik_test.html` now stabilizes mobile layout: it uses `100dvh` (with `100vh` fallback), listens to `visualViewport`, and filters tiny viewport-height changes to reduce post-scroll layout jumps on phones.
15. Font sizes and vertical spacing are now scaled from overlay dimensions (`--overlayScale`, `--overlayPadY`, `--overlayGap`), improving visual consistency across desktop/phone/tablet.
16. Working-area presets (`CONTENT_RECTS_BY_BACKGROUND_ID`) were recalculated for all 9 backgrounds using `assets/ramki/*_ramka.png` files mapped in `Draft/Mapowanie.xlsx`, so the shadow rectangle covers the entire blue-frame area.
17. In both color sections (message and fillers), the layout is now: **HEX + Picker** (same row) → quick colors (**Green, Red, Gold, White**) → font-size field.
18. Colors are now **HEX-only** (`#RRGGBB` or `#RGB`), and each color picker syncs the text field on both `input` and `change`.
19. **Filler line count** now updates immediately without needing to switch filler sets.
20. When `Shadow rectangle` is enabled, the Flicker hint stays empty (no “active/optional” text); warning appears only when shadow rectangle is disabled.
21. Font sizes are sent to the player screen as numeric values, so runtime font-size changes apply correctly.
22. `Infoczytnik_test.html` now loads the same Google Fonts set as the GM panel, so font-family changes match the GM preview.
23. In the **Prefix + Suffix** color section, both the Picker and manual HEX input now work immediately (without pressing quick-color chips first); manual HEX is validated on field blur.
24. If Prefix + Suffix HEX contains a partial value (e.g. `#fffff`), the picker still updates immediately (including the “Color | Solid” bar and live preview) without requiring a prior HEX fix.
25. Fixed the `#ffffff` edge case: after selecting white, the color picker now continues to apply new colors correctly (no more “stuck on white” behavior).

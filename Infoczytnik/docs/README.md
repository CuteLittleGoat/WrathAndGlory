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
14. W `Infoczytnik_test.html` działa test diagnostyczny (`DIAGNOSTIC_FIXED_TYPO_SPACING_TEST`): po ustawieniu `true` wymusza stałe fonty i stałe pionowe odstępy (`px`) do porównań mobile vs PC; po ustawieniu `false` wraca tryb standardowy.

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
14. `Infoczytnik_test.html` includes a diagnostic switch (`DIAGNOSTIC_FIXED_TYPO_SPACING_TEST`): when set to `true`, it forces fixed font sizes and fixed vertical spacing (`px`) for mobile vs desktop comparison; when set to `false`, standard behavior is restored.

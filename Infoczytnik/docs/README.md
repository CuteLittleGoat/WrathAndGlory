# Infoczytnik — instrukcja użytkownika / User Guide

## PL — Jak korzystać z modułu

### Do czego służy Infoczytnik
Infoczytnik służy do wyświetlania graczom komunikatów fabularnych (treść, prefix, suffix, opcjonalne logo i dźwięk), które przygotowujesz w panelu MG.

### Co otworzyć
1. Na ekranie graczy otwórz: `Infoczytnik/Infoczytnik_test.html`.
2. Na ekranie MG otwórz: `Infoczytnik/GM_test.html`.

### Szybki start
1. W panelu MG wybierz tło, logo, zestaw fillerów, font i dźwięk wiadomości.
2. Włącz/wyłącz opcje: **Logo**, **Prostokąt cienia**, **Flicker**, **Fillery**, **Audio**.
3. Wpisz treść wiadomości.
4. Kliknij **Wyślij**.
5. Sprawdź ekran gracza — wiadomość powinna pojawić się od razu.

### Co robią najważniejsze przyciski
- **Wyślij** — publikuje aktualną wiadomość na ekran graczy.
- **Ping** — odtwarza szybki sygnał audio (bez zmiany treści wiadomości).
- **Wyczyść komunikat** — czyści tylko pole wpisywania wiadomości w panelu MG.
- **Przywróć domyślne** — przywraca domyślne ustawienia formularza.
- **Aktualizuj dane z XLSX** — pobiera aktualny manifest i przygotowuje nowy plik `data.json` do zapisania.

### Jak pracować wygodnie podczas sesji
- Najpierw ustaw styl wiadomości (tło, kolory, font), potem wpisuj treść.
- Jeśli chcesz zachować klimat ekranu, użyj prefixu i suffixu (np. ostrzeżenia, podpisy frakcyjne).
- Gdy chcesz natychmiast zwrócić uwagę graczy, użyj **Ping**.
- Po większych zmianach ustawień możesz użyć **Przywróć domyślne** i zacząć od czystego układu.

### Typowe problemy
- **Nie widzę wiadomości u graczy** — upewnij się, że na ekranie graczy jest otwarty `Infoczytnik_test.html`.
- **Nie słyszę dźwięku** — sprawdź, czy opcja **Audio** jest włączona.
- **Układ wygląda inaczej na telefonie** — odśwież oba okna i ponownie wyślij wiadomość.

---

## EN — How to use the module

### What Infoczytnik is for
Infoczytnik shows narrative messages to players (message text, prefix, suffix, optional logo and audio), prepared in the GM panel.

### What to open
1. On the player screen open: `Infoczytnik/Infoczytnik_test.html`.
2. On the GM screen open: `Infoczytnik/GM_test.html`.

### Quick start
1. In the GM panel select background, logo, filler set, font, and message audio.
2. Toggle options: **Logo**, **Shadow rectangle**, **Flicker**, **Fillers**, **Audio**.
3. Enter message text.
4. Click **Wyślij / Send**.
5. Check the player screen — the message should appear immediately.

### Main buttons
- **Wyślij / Send** — publishes the current message to the player screen.
- **Ping** — plays a quick audio signal (without changing message text).
- **Wyczyść komunikat / Clear message** — clears only the GM text input.
- **Przywróć domyślne / Restore defaults** — restores default form settings.
- **Aktualizuj dane z XLSX / Update data from XLSX** — fetches the latest manifest and prepares a new `data.json` file for saving.

### Session workflow tips
- Set style first (background, colors, font), then write the message.
- Use prefix/suffix for better narrative framing (warnings, faction signatures, etc.).
- Use **Ping** when you need instant attention.
- After multiple experiments, use **Restore defaults** to reset to a clean baseline.

### Common issues
- **Message not visible to players** — make sure `Infoczytnik_test.html` is open on the player screen.
- **No sound** — verify that **Audio** is enabled.
- **Layout looks different on mobile** — refresh both pages and send again.

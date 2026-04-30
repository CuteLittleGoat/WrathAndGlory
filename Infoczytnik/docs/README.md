# Infoczytnik — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
**Infoczytnik** wyświetla graczom komunikaty fabularne na osobnym ekranie. Prowadzący steruje treścią, stylem, dźwiękiem i efektami z panelu GM.

### Co otworzyć podczas sesji
1. Ekran graczy: `Infoczytnik/Infoczytnik_test.html`.
2. Ekran prowadzącego: `Infoczytnik/GM_test.html`.

> Najwygodniej uruchomić oba okna równocześnie (osobne urządzenia albo dwa monitory).

### Szybki start (pierwsza wiadomość)
1. W panelu GM wybierz **Tło** i **Logo**.
2. Wybierz **Font** i opcjonalnie **Audio wiadomości**.
3. Zaznacz/odznacz przełączniki: **Logo**, **Prostokąt cienia**, **Flicker**, **Fillery**, **Audio**.
4. Wpisz tekst w polu **Treść komunikatu**.
5. Kliknij **Wyślij**.
6. Sprawdź ekran gracza — komunikat powinien pokazać się od razu.

### Co robią przyciski w panelu GM
- **Wyślij** – publikuje aktualny komunikat na ekranie graczy.
- **Ping** – odtwarza sygnał dźwiękowy bez zmiany treści. Przycisk korzysta z pliku `Infoczytnik/assets/audios/ping/Ping.mp3`.
- **Wyczyść komunikat** – czyści tylko pole wpisywania tekstu.
- **Przywróć domyślne** – przywraca domyślne ustawienia panelu.
- **Aktualizuj dane z XLSX** – aktualizuje źródła danych używane przez moduł.

### Ustawienia, które najczęściej zmieniasz
- **Kolor i wielkość tekstu wiadomości**.
- **Kolor i wielkość prefix/suffix**.
- **Ilość linii fillerów** i wysokość strefy prefix/suffix.
- W danych fillerów separatorami linii są: nowa linia oraz pionowa kreska `|`. Średnik pozostaje częścią tekstu i nie dzieli wpisu na wiele elementów.
- In filler data, line separators are: newline and pipe `|`. Semicolon stays inside the text and does not split one entry into multiple elements.
- **Tryb podglądu**:
  - **Treść** – podgląd warstwy tekstowej.
  - **Tło** – podgląd samego tła.

### Jak pracować w trakcie gry
1. Przygotuj zestaw stylu (tło/font/kolory) dla sceny.
2. Wysyłaj krótkie komunikaty częściej, zamiast jednego bardzo długiego.
3. Używaj **Ping**, gdy chcesz natychmiast zwrócić uwagę graczy.
4. Gdy układ „rozjedzie się” po eksperymentach, użyj **Przywróć domyślne**.

### Typowe problemy i szybkie rozwiązania
- **Brak komunikatu na ekranie gracza** → odśwież oba okna i wyślij ponownie.
- **Brak dźwięku** → sprawdź, czy przełącznik **Audio** jest aktywny i czy głośność systemowa nie jest wyciszona.
- **Inny wygląd na projektorze/telefonie** → ustaw ponownie tło i wyślij krótszą wiadomość.

---

### Integracja Firebase — wymagana
Moduł **Infoczytnik** wymaga Firebase (Firestore), ponieważ ekran GM i ekran graczy wymieniają dane na żywo przez bazę.

#### Krok po kroku — jak utworzyć bazę danych
1. Otwórz [https://console.firebase.google.com](https://console.firebase.google.com).
2. Kliknij **Utwórz projekt**.
3. Wpisz nazwę projektu i przejdź dalej.
4. Wybierz ustawienia Analytics (opcjonalnie) i zakończ tworzenie projektu.
5. W panelu projektu kliknij ikonę **Web** (`</>`) i zarejestruj aplikację webową.
6. Skopiuj konfigurację `firebaseConfig`.
7. Otwórz plik `Infoczytnik/config/firebase-config.js` i wklej dane projektu.
8. W menu po lewej kliknij **Firestore Database**.
9. Kliknij **Utwórz bazę danych**.
10. Wybierz tryb startowy i kliknij **Dalej**.
11. Wybierz region i kliknij **Włącz**.
12. W zakładce **Reguły** ustaw dostęp zgodnie z potrzebą (np. tylko dla Twojej grupy).
13. Zapisz reguły.
14. Uruchom `Infoczytnik/GM_test.html` oraz `Infoczytnik/Infoczytnik_test.html` i sprawdź, czy wysłana wiadomość od razu pojawia się na ekranie gracza.

---

## Kopia modułu dla nowej grupy
- W nowej kopii modułu ustaw własny `Infoczytnik/config/firebase-config.js`.
- Dzięki temu panel GM i ekran odczytu korzystają z oddzielnego Firestore i nie mieszają treści między grupami.
- Po konfiguracji uruchom `GM_test.html` i `Infoczytnik_test.html`, wpisz wiadomość testową i sprawdź odczyt.

---

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

## 🇬🇧 User instructions (EN)

### What this module is for
**Infoczytnik** shows narrative messages to players on a dedicated display. The GM controls text, style, sound, and effects from a separate panel.

### What to open during play
1. Player screen: `Infoczytnik/Infoczytnik_test.html`.
2. GM screen: `Infoczytnik/GM_test.html`.

> Best setup: both pages open at the same time (separate devices or dual monitor).

### Quick start (first message)
1. In GM panel choose **Background** and **Logo**.
2. Choose **Font** and optional **Message audio**.
3. Toggle: **Logo**, **Shadow rectangle**, **Flicker**, **Fillers**, **Audio**.
4. Enter text in **Message content**.
5. Click **Send**.
6. Check player screen — message should appear immediately.

### GM panel button actions
- **Send** – publishes current message to player screen.
- **Ping** – plays attention sound without changing message text. The button uses `Infoczytnik/assets/audios/ping/Ping.mp3`.
- **Clear message** – clears input text only.
- **Restore defaults** – resets panel settings to default values.
- **Update data from XLSX** – refreshes module data sources.
- Po odświeżeniu dane zapisują się do `assets/data/data.json` i od razu są gotowe do użycia w panelu. / After refresh, data is saved to `assets/data/data.json` and is immediately ready to use in the panel.

### Most-used settings
- **Message text color and size**.
- **Prefix/suffix color and size**.
- **Filler line count** and prefix/suffix area height.
- **Preview mode**:
  - **Content** – text layer preview.
  - **Background** – background-only preview.

### In-session workflow
1. Prepare a style preset (background/font/colors) per scene.
2. Send shorter messages more often instead of one long block.
3. Use **Ping** for immediate player attention.
4. If layout becomes messy after many changes, press **Restore defaults**.

### Common issues and quick fixes
- **No message on player screen** → refresh both pages and send again.
- **No sound** → check **Audio** toggle and system volume.
- **Different look on projector/mobile** → reselect background and send shorter text.

### Firebase integration — required
**Infoczytnik** requires Firebase (Firestore), because GM and player screens exchange data live through the database.

#### Step by step — how to create the database
1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **Create a project**.
3. Enter project name and continue.
4. Choose Analytics settings (optional) and finish project creation.
5. In project dashboard click the **Web** icon (`</>`) and register a web app.
6. Copy `firebaseConfig` values.
7. Open `Infoczytnik/config/firebase-config.js` and paste project config.
8. In left menu click **Firestore Database**.
9. Click **Create database**.
10. Choose initial mode and click **Next**.
11. Select region and click **Enable**.
12. In **Rules** tab set access for your group.
13. Save rules.
14. Launch `Infoczytnik/GM_test.html` and `Infoczytnik/Infoczytnik_test.html` and confirm sent message appears immediately on player screen.
## Copying module for a new group
- In each new module copy, set a dedicated `Infoczytnik/config/firebase-config.js`.
- This ensures GM panel and reader screen use separate Firestore data and do not mix messages between groups.
- After setup, run `GM_test.html` and `Infoczytnik_test.html`, send a test message, and verify reader output.

## Aktualizacja linków względnych / Relative links update
W module używane są ścieżki względne do nawigacji i/lub danych, aby kopia modułu działała po przeniesieniu na inny serwer bez zależności od domeny autora.

The module now uses relative paths for navigation and/or data loading so that a copied module works on another server without dependencies on the author domain.

## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

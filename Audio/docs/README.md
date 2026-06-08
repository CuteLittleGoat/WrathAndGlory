# Audio — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
Moduł **Audio** służy do szybkiego odtwarzania efektów dźwiękowych (SFX) podczas sesji. Możesz korzystać z gotowego widoku gracza albo z rozszerzonego widoku prowadzącego (admina), w którym ustawiasz listy i kolejność dźwięków.

### Jak otworzyć moduł
Przełącznik języka jest obecnie ukryty w interfejsie użytkownika. Moduł ma przygotowaną obsługę tekstów PL/EN, ale użytkownik korzysta z aktualnie widocznej wersji interfejsu bez ręcznej zmiany języka.

1. Otwórz `Audio/index.html`.
2. Jeśli chcesz zwykły widok odtwarzania, pozostaw adres bez zmian.
3. Jeśli chcesz pełny panel zarządzania, dopisz w adresie: `?admin=1`.

### Co zobaczysz w widoku użytkownika (bez `?admin=1`)
- Panel **dźwięków** (po lewej) z przyciskami odtwarzania.
- Panel **Nawigacja** (po prawej) z wyborem widoku głównego i list ulubionych.

### Jak odtwarzać dźwięki (widok użytkownika)
1. W panelu nawigacji kliknij **Widok główny** albo wybraną listę ulubionych.
2. Kliknij nazwę dźwięku, aby uruchomić pojedyncze odtworzenie.
3. Kliknij nazwę ponownie, aby zatrzymać aktualne odtworzenie.
4. Kliknij **Loop**, aby od razu uruchomić dźwięk w pętli.
5. Gdy **Loop** jest aktywny, przycisk jest czerwony. Po zakończeniu pliku moduł automatycznie uruchamia następne odtworzenie tego samego dźwięku.
6. Jeżeli dźwięk ma kilka podpiętych plików, kolejne odtworzenia w pętli są wybierane losowo, a aplikacja unika natychmiastowego powtórzenia tego samego pliku, gdy ma inną możliwość.
7. Kliknij czerwony **Loop** ponownie, aby wyłączyć pętlę i zatrzymać aktualny dźwięk.
8. Możesz uruchomić kilka dźwięków równocześnie.
9. Suwakiem na kafelku ustaw głośność konkretnego dźwięku; aktywna pętla używa bieżącej wartości suwaka także przy kolejnych odtworzeniach.

### Co oznaczają elementy na kafelku dźwięku
- **Nazwa dźwięku** – główny przycisk odtwarzania.
- **Tag pod nazwą** – informacja, z jakiej grupy/folderu pochodzi dźwięk.
- **Alias w nawiasie** (jeśli ustawiony) – dodatkowa pomocnicza nazwa.
- **Loop** – przełącznik pętli. Zwykły zielony stan oznacza, że pętla jest wyłączona, a czerwony stan oznacza aktywne zapętlenie.
- **Suwak głośności** – indywidualna głośność tego dźwięku.

### Jak korzystać z panelu administratora (`?admin=1`)
1. Kliknij **Wczytaj manifest**, aby załadować bazę dźwięków.
2. Użyj filtrów tagów, aby zawęzić listę widocznych SFX.
3. W polu wyszukiwarki wpisz fragment nazwy, aby szybciej znaleźć konkretny dźwięk.
4. Kliknij **Nowa lista ulubionych**, aby utworzyć nową listę.
5. Przy wybranym dźwięku wybierz listę docelową i kliknij **Dodaj do listy**.
6. W sekcji list możesz:
   - zmieniać kolejność list,
   - zmieniać nazwy list,
   - usuwać listy,
   - zmieniać kolejność dźwięków w liście.

### Przyciski specjalne
- **Wyczyść wszystkie aliasy** – usuwa wszystkie aliasy dźwięków jednocześnie (po potwierdzeniu).
- **Odtwórz / Zatrzymaj** – szybki odsłuch pojedynczego dźwięku z panelu admina.
- W panelu admina przycisk **Loop** nie jest wyświetlany. Pętla jest dostępna tylko w zwykłym widoku użytkownika otwartym bez `?admin=1`.
- **Wyczyść** (przy polu aliasu) – usuwa alias tylko dla jednego dźwięku.

### Dobre praktyki podczas sesji
- Przed sesją przygotuj 1 listę „główną” i 2–3 listy tematyczne.
- Nadawaj aliasy dźwiękom trudnym do rozpoznania po samej nazwie.
- Ustaw głośność każdego kluczowego dźwięku wcześniej, żeby nie poprawiać tego w trakcie sceny.
- Długie tła ambientowe uruchamiaj przyciskiem **Loop** w zwykłym widoku użytkownika, a krótkie efekty jednorazowe kliknięciem nazwy albo przyciskiem **Odtwórz** w panelu admina.

---

### Integracja Firebase — wymagana dla współdzielonych list
Aby listy ulubionych i ustawienia były wspólne dla wielu urządzeń/użytkowników, moduł **Audio** wymaga integracji z Firebase (Firestore). Bez niej działa tylko lokalnie na jednym urządzeniu.

#### Krok po kroku — konfiguracja bazy
1. Wejdź na [https://console.firebase.google.com](https://console.firebase.google.com).
2. Kliknij **Utwórz projekt**.
3. Wpisz nazwę projektu i kliknij **Dalej**.
4. Wybierz ustawienia Analytics (opcjonalnie) i zakończ tworzenie.
5. Kliknij ikonę **Web** (`</>`) i zarejestruj aplikację webową.
6. Skopiuj obiekt `firebaseConfig`.
7. Wklej dane do `Audio/config/firebase-config.js`.
8. Otwórz **Firestore Database** w menu Firebase.
9. Kliknij **Utwórz bazę danych**.
10. Wybierz tryb startowy, kliknij **Dalej**, wybierz region i kliknij **Włącz**.
11. W zakładce **Reguły** ustaw dostęp tak, aby uprawnieni użytkownicy mogli czytać i zapisywać ustawienia.
12. Otwórz `Audio/index.html?admin=1` i sprawdź status Firebase.
13. Utwórz testową listę ulubionych i odśwież stronę — lista powinna pozostać.

---

## Kopia modułu dla nowej grupy
- Przed pierwszym użyciem na nowym serwerze podmień `Audio/config/firebase-config.js` na dane Firebase tej grupy.
- Po uruchomieniu `Audio/index.html?admin=1` sprawdź status „Firebase” — ma wskazywać połączenie z właściwym projektem.
- Dzięki osobnym konfiguracjom grupy nie nadpisują sobie danych list i widoków.

---

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

Przełącznik języka jest obecnie ukryty; miejsce jego ujawnienia jest oznaczone komentarzem w kodzie HTML przy elementach `.language-switcher--hidden`.

## 🇬🇧 User instructions (EN)

The language switcher is currently hidden; the place to reveal it is marked with an HTML code comment next to `.language-switcher--hidden` elements.

### What this module is for
The **Audio** module lets you quickly play sound effects (SFX) during sessions. You can use a simple player view or the extended admin view to manage lists and ordering.

### How to open the module
The language switcher is currently hidden in the user interface. The module contains prepared PL/EN text support, but the user works with the currently visible interface without manually switching language.

1. Open `Audio/index.html`.
2. For standard playback mode, keep the URL as is.
3. For the full management panel, append: `?admin=1`.

### What you see in user view (without `?admin=1`)
- **Sound grid** panel (left) with playable SFX tiles.
- **Navigation** panel (right) to choose the main view or a favorites list.
- The language switcher is intentionally hidden; the UI uses the currently visible language version.

### How to play sounds (user view)
1. In navigation, click **Main view** or a selected favorites list.
2. Click a sound name to start one playback.
3. Click the sound name again to stop the current playback.
4. Click **Loop** to start the sound in loop mode immediately.
5. When **Loop** is active, the button is red. After the file ends, the module automatically starts the next playback of the same sound.
6. If the sound has several connected files, loop playback chooses later files randomly and avoids repeating the same file immediately when another option exists.
7. Click the red **Loop** again to turn loop mode off and stop the current sound.
8. Multiple sounds can play at the same time.
9. Use the tile slider to adjust volume for that sound; an active loop uses the current slider value for later iterations too.

### What each sound tile element means
- **Sound name** – main play/stop button.
- **Tag below name** – source group/folder hint.
- **Alias in parentheses** (if set) – extra custom label.
- **Loop** – loop switch. The normal green state means loop mode is off, and the red state means looping is active.
- **Volume slider** – per-sound volume control.

### How to use admin mode (`?admin=1`)
1. Click **Wczytaj manifest** to load the SFX database.
2. Use tag filters to narrow visible sounds.
3. Use search to quickly find a sound by name fragment.
4. Click **Nowa lista ulubionych** to create a favorites list.
5. On a sound tile, choose destination list and click **Dodaj do listy**.
6. In list management you can:
   - reorder lists,
   - rename lists,
   - delete lists,
   - reorder items inside a list.

### Special buttons
- **Wyczyść wszystkie aliasy** – removes all aliases at once (with confirmation).
- **Odtwórz / Zatrzymaj** – quick preview from admin panel.
- In admin mode, the **Loop** button is not displayed. Looping is available only in the normal user view opened without `?admin=1`.
- **Wyczyść** (next to alias field) – clears alias for one sound.

### Session best practices
- Prepare 1 main list and 2–3 scene-based lists before play.
- Use aliases for sounds with unclear names.
- Pre-check key sound volumes before the session starts.
- Use **Loop** for long ambient backgrounds in the normal user view, and use the sound name or admin **Odtwórz** button for short one-shot effects.

### Firebase integration — required for shared lists
To share favorites and settings across multiple devices/users, **Audio** requires Firebase (Firestore). Without it, settings work only locally on one device.

#### Step by step — database setup
1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **Create a project**.
3. Enter project name and click **Continue**.
4. Choose Analytics settings (optional) and finish creation.
5. Click the **Web** icon (`</>`) and register a web app.
6. Copy the `firebaseConfig` object.
7. Paste values into `Audio/config/firebase-config.js`.
8. Open **Firestore Database** in Firebase menu.
9. Click **Create database**.
10. Choose initial mode, click **Next**, pick region, click **Enable**.
11. In **Rules** set read/write access for authorized users.
12. Open `Audio/index.html?admin=1` and verify Firebase status.
13. Create a test favorites list and refresh page — it should persist.
## Copying module for a new group
- Before first use on a new server, replace `Audio/config/firebase-config.js` with that group’s Firebase credentials.
- After opening `Audio/index.html?admin=1`, verify the “Firebase” status points to the intended project.
- Separate configurations prevent groups from overwriting each other’s lists and views.

## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Widoczność przełącznika języka / Language switch visibility
- PL: Przełącznik wyboru języka jest celowo ukryty w interfejsie. Kod tłumaczeń pozostaje aktywny, a miejsce zmiany widoczności jest oznaczone komentarzem przy `.language-switcher--hidden`.
- EN: The language selector is intentionally hidden in the UI. Translation code remains active, and the visibility change point is marked by a comment next to `.language-switcher--hidden`.

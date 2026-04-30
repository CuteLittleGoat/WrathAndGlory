# Audio — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
Moduł **Audio** służy do szybkiego odtwarzania efektów dźwiękowych (SFX) podczas sesji. Możesz korzystać z gotowego widoku gracza albo z rozszerzonego widoku prowadzącego (admina), w którym ustawiasz listy i kolejność dźwięków.

### Jak otworzyć moduł
1. Otwórz `Audio/index.html`.
2. Jeśli chcesz zwykły widok odtwarzania, pozostaw adres bez zmian.
3. Jeśli chcesz pełny panel zarządzania, dopisz w adresie: `?admin=1`.

### Co zobaczysz w widoku użytkownika (bez `?admin=1`)
- Panel **Nawigacja** (po lewej) z wyborem listy.
- Panel **dźwięków** (po prawej) z przyciskami odtwarzania.
- Przełącznik języka dla opisów panelu.

### Jak odtwarzać dźwięki (widok użytkownika)
1. W panelu nawigacji kliknij **Widok główny** albo wybraną listę ulubionych.
2. Kliknij nazwę dźwięku, aby go uruchomić.
3. Kliknij ponownie, aby zatrzymać.
4. Możesz uruchomić kilka dźwięków równocześnie.
5. Suwakiem na kafelku ustaw głośność konkretnego dźwięku.

### Co oznaczają elementy na kafelku dźwięku
- **Nazwa dźwięku** – główny przycisk odtwarzania.
- **Tag pod nazwą** – informacja, z jakiej grupy/folderu pochodzi dźwięk.
- **Alias w nawiasie** (jeśli ustawiony) – dodatkowa pomocnicza nazwa.
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
- **Wyczyść** (przy polu aliasu) – usuwa alias tylko dla jednego dźwięku.

### Dobre praktyki podczas sesji
- Przed sesją przygotuj 1 listę „główną” i 2–3 listy tematyczne.
- Nadawaj aliasy dźwiękom trudnym do rozpoznania po samej nazwie.
- Ustaw głośność każdego kluczowego dźwięku wcześniej, żeby nie poprawiać tego w trakcie sceny.

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

## 🇬🇧 User instructions (EN)

### What this module is for
The **Audio** module lets you quickly play sound effects (SFX) during sessions. You can use a simple player view or the extended admin view to manage lists and ordering.

### How to open the module
1. Open `Audio/index.html`.
2. For standard playback mode, keep the URL as is.
3. For the full management panel, append: `?admin=1`.

### What you see in user view (without `?admin=1`)
- **Navigation** panel (left) to choose a list.
- **Sound grid** (right) with playable SFX tiles.
- Language switch for panel labels.

### How to play sounds (user view)
1. In navigation, click **Main view** or a selected favorites list.
2. Click a sound name to start it.
3. Click again to stop it.
4. Multiple sounds can play at the same time.
5. Use the tile slider to adjust volume for that sound.

### What each sound tile element means
- **Sound name** – main play/stop button.
- **Tag below name** – source group/folder hint.
- **Alias in parentheses** (if set) – extra custom label.
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
- **Wyczyść** (next to alias field) – clears alias for one sound.

### Session best practices
- Prepare 1 main list and 2–3 scene-based lists before play.
- Use aliases for sounds with unclear names.
- Pre-check key sound volumes before the session starts.

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


## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

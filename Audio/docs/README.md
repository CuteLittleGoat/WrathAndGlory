# Audio — instrukcja użytkownika / User guide

Moduł **Audio** służy do odtwarzania sampli z pliku `AudioManifest.xlsx`, zarządzania listami „Ulubione” oraz konfiguracji „Głównego widoku” (nadrzędna lista odtwarzania). Panel administracyjny jest dostępny po dodaniu `?admin=1` do adresu.

---

## Instrukcja obsługi (PL)

### Wymagania
- Projekt Firebase z włączonym Firestore.
- Firebase dla **Audio** nie wymaga oddzielnego konta Google od modułu **Infoczytnik** — oba moduły mogą działać w tym samym koncie/projekcie, o ile konfiguracje i reguły są rozdzielone. Oddzielne projekty to tylko opcja organizacyjna, nie wymóg techniczny.
- Serwer statyczny (np. GitHub Pages, Firebase Hosting, lokalny serwer HTTP), aby poprawnie pobierać plik `AudioManifest.xlsx`.
- Dostęp do internetu (Firebase SDK + XLSX CDN).

### Instalacja i uruchomienie
1. Skopiuj `config/firebase-config.template.js` do `config/firebase-config.js`.
2. Wklej konfigurację Firebase (Web) z konsoli: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. Upewnij się, że Firestore ma włączone reguły zapisu/odczytu dla dokumentu `audio/favorites` (zawiera ustawienia ulubionych i głównego widoku).
4. Upewnij się, że plik `AudioManifest.xlsx` znajduje się w katalogu `Audio/`.
5. Uruchom stronę `Audio/index.html` na serwerze statycznym.
6. Tytuł karty przeglądarki powinien brzmieć: **Kozie Audio**.

### Tryby działania
- **Widok użytkownika** (domyślny): widoczne są tylko dwa panele — siatka odtwarzania dźwięków z „Głównego widoku”/„Ulubionych” oraz panel nawigacji list.
- **Widok admina**: pełna konfiguracja (wczytywanie manifestu, zarządzanie listami, układ „Głównego widoku”) **oraz** te same dwa panele z widoku użytkownika jako podgląd, który odświeża się i działa tak samo jak u użytkownika.

### Jak korzystać (użytkownik)
1. Otwórz `Audio/index.html` (bez parametru `?admin=1`) — zobaczysz tylko panel odtwarzania i panel nawigacji.
2. W panelu bocznym wybierz **Widok główny** lub jedną z list „Ulubione”.
3. Kliknij nazwę sampla lub tag pod nazwą, aby włączyć/wyłączyć dźwięk (możesz odtwarzać kilka jednocześnie).
4. (Opcjonalnie) po nazwie sampla może pojawić się alias w nawiasie — wyświetlany jaśniejszą czcionką.
5. Pod nazwą sampla zobaczysz tag folderu (ułatwia orientację) — podczas odtwarzania nazwa i tag świecą na czerwono.
6. Użyj suwaka głośności na karcie sampla: środek to standard (0%), lewo to wyciszenie (-100%), prawo to wzmocnienie (+100%).

### Jak korzystać (administrator)
1. Otwórz `Audio/index.html?admin=1`.
2. Kliknij **Wczytaj manifest**, aby załadować listę sampli.
3. Użyj belki **Filtry tagów** do zawężenia listy sampli (wpływa tylko na panel admina).
4. (Opcjonalnie) skorzystaj z pola **Szukaj tagu...** oraz przycisku **Filtruj ▾** — otworzy się okienko z wyszukiwarką tagów, checkboxami oraz opcjami zaznacz/odznacz wszystko.
5. Wyszukuj sample w polu „Szukaj sampla...” (pole znajduje się pod panelami tagów).
6. Kliknij **Odtwórz**, aby odsłuchać dźwięk. W trakcie odtwarzania przycisk zmienia się na **Zatrzymaj**.
7. Kliknij **Nowa lista ulubionych**, aby utworzyć własną listę.
8. W karcie sampla wybierz z listy **Widok Główny** lub konkretną listę ulubionych i kliknij **Dodaj do listy**:
   - **Widok Główny** dodaje sample do panelu „Główny widok”.
   - Wybrana lista ulubionych dodaje sample do tej listy.
9. W panelu „Ulubione” możesz:
   - zmieniać kolejność list,
   - zmieniać nazwę listy,
   - usuwać listę,
   - przesuwać i usuwać elementy w liście,
   - odtwarzać zapisane sample.
10. W karcie sampla w panelu admina możesz wpisać **alias** (opcjonalny). Alias zapisuje się w ustawieniach, wyświetla się w nawiasie po nazwie sampla w widoku głównym i na listach ulubionych jaśniejszym kolorem. Przycisk **Wyczyść** znajduje się bezpośrednio pod polem aliasu (nad **Odtwórz**) i usuwa alias.
    - Alias jest zapisywany w Firestore (lub `localStorage`) i po ponownym uruchomieniu modułu powinien pojawić się zarówno w panelu admina, jak i w widoku użytkownika.
11. W panelu „Główny widok” (na dole admina) kliknij nazwę sampla lub tag, aby odsłuchać dźwięk; głośność ustawiasz suwakiem na karcie.

### Dane wejściowe (AudioManifest.xlsx)
- Kolumny:
  - **NazwaSampla** – nazwa przycisku w UI.
  - **NazwaPliku** – nazwa pliku audio.
  - **LinkDoFolderu** – URL do folderu z plikami.
- Dodatkowe kolumny (np. z kolorami) są ignorowane.
- Link do pliku jest budowany jako: `LinkDoFolderu + "/" + NazwaPliku`.
- Grupowanie odbywa się **wyłącznie w obrębie jednego folderu**:
  - Jeżeli nazwy różnią się **samą cyfrą** na końcu (`Assault Weapon1`, `Assault Weapon2` lub `Rats 1`, `Rats 2`), UI pokazuje **jeden** przycisk `Assault Weapon (2)` / `Rats (2)`.
  - Jeżeli cyfra występuje **w środku** (`Blaster 1 Burst`, `Blaster 2 Burst`), UI tworzy przycisk `Blaster Burst (2)`.
  - Kliknięcie zgrupowanego przycisku losuje dźwięk z grupy.
  - W nazwie pliku pojawia się dodatkowy sufiks `(+N)` z liczbą wariantów.
- Tagi do filtrowania są tworzone z folderów ścieżki `LinkDoFolderu` z pominięciem fragmentów: **SoundPad**, **SoundPad Patreon Version**, **_Siege_SoundPad**, **Patreon**. Znaki `%20` są zamieniane na spacje, a końcowe spacje usuwane.

---

## User guide (EN)

### Requirements
- A Firebase project with Firestore enabled.
- The **Audio** Firebase does not require a separate Google account from **Infoczytnik** — both modules can run under the same account/project as long as configuration and rules are separated. Separate projects are an organizational option, not a technical requirement.
- A static web server (e.g. GitHub Pages, Firebase Hosting, local HTTP server) so `AudioManifest.xlsx` can be fetched.
- Internet access (Firebase SDK + XLSX CDN).

### Installation & Launch
1. Copy `config/firebase-config.template.js` to `config/firebase-config.js`.
2. Paste the Firebase (Web) config from the console: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. Ensure Firestore rules allow read/write on `audio/favorites` (stores favorites and main view settings).
4. Make sure `AudioManifest.xlsx` is located in the `Audio/` folder.
5. Serve and open `Audio/index.html` from a static server.
6. The browser tab title should read: **Kozie Audio**.

### Modes
- **User view** (default): only two panels are visible — the playback grid (Main View/Favorites) and the navigation panel.
- **Admin view**: full configuration (manifest reload, list management, Main View order) **plus** the same two user panels shown as a preview that refreshes and behaves exactly like the user view.

### How to use (user)
1. Open `Audio/index.html` (without `?admin=1`) — only the playback panel and navigation panel are shown.
2. In the side panel select **Main view** or one of the Favorites lists.
3. Click the sample name or the tag under it to toggle playback (multiple sounds can play simultaneously).
4. (Optional) an alias can appear in parentheses after the sample name, shown in a lighter tone.
5. The folder tag is shown under each sample name for orientation — while playing, both the name and tag turn red.
6. Use the volume slider on the card: center is normal (0%), left mutes (-100%), right boosts (+100%).

### How to use (admin)
1. Open `Audio/index.html?admin=1`.
2. Click **Wczytaj manifest** to load samples.
3. Use the **Filtry tagów** bar to filter the admin sample list (does not affect user panels).
4. (Optional) use the **Szukaj tagu...** field and the **Filtruj ▾** button — it opens a popup with tag search, checkboxes, and select/deselect all options.
5. Search samples in the “Szukaj sampla...” field (now located below the tag panel).
6. Click **Odtwórz** to preview a sound. While playing, it turns into **Zatrzymaj**.
7. Click **Nowa lista ulubionych** to create a list.
8. In a sample card choose **Widok Główny** or a specific favorites list, then click **Dodaj do listy**:
   - **Widok Główny** adds the sample to the Main View panel.
   - A favorites list adds the sample to that list.
9. In the Favorites panel you can:
   - reorder lists,
   - rename lists,
   - delete lists,
   - reorder/remove items in a list,
   - play saved samples.
10. In the admin sample card you can enter an optional **alias**. The alias is saved in settings and displayed in parentheses after the sample name in the Main View and Favorites lists in a lighter color. The **Wyczyść** button sits directly under the alias field (above **Odtwórz**) and clears the alias.
    - The alias is stored in Firestore (or `localStorage`) and should appear again after reload in both the admin panel and the user view.
11. In the Main View panel (bottom of admin), click the sample name or tag to play/stop it and use the slider on the card to adjust volume.

### Input data (AudioManifest.xlsx)
- Columns:
  - **NazwaSampla** – UI button label.
  - **NazwaPliku** – audio filename.
  - **LinkDoFolderu** – URL of the folder with files.
- Extra columns (including color hints) are ignored.
- The file URL is built as: `LinkDoFolderu + "/" + NazwaPliku`.
- Grouping happens **only within a single folder**:
  - If names differ only by a **number suffix** (`Assault Weapon1`, `Assault Weapon2` or `Rats 1`, `Rats 2`), the UI shows a single `Assault Weapon (2)` / `Rats (2)` button.
  - If the number appears **in the middle** (`Blaster 1 Burst`, `Blaster 2 Burst`), the UI shows `Blaster Burst (2)`.
  - Clicking a grouped button plays a random variant.
  - The filename line shows a `(+N)` suffix for grouped variants.
- Filter tags are generated from the folder path in `LinkDoFolderu`, ignoring fragments: **SoundPad**, **SoundPad Patreon Version**, **_Siege_SoundPad**, **Patreon**. `%20` is converted to spaces and trailing spaces are removed.

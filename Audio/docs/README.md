# Audio — instrukcja użytkownika / User guide

Moduł **Audio** służy do odtwarzania sampli z pliku `AudioManifest.xlsx`, zarządzania listami „Ulubione” oraz konfiguracji „Głównego widoku” (nadrzędna lista odtwarzania). Panel administracyjny jest dostępny po dodaniu `?admin=1` do adresu.

---

## Instrukcja obsługi (PL)

### Wymagania
- Projekt Firebase z włączonym Firestore.
- Firebase dla **Audio** musi być na **oddzielnym koncie Google** niż Firebase dla modułu **Infoczytnik** (unika to konfliktów projektów i reguł).
- Serwer statyczny (np. GitHub Pages, Firebase Hosting, lokalny serwer HTTP), aby poprawnie pobierać plik `AudioManifest.xlsx`.
- Dostęp do internetu (Firebase SDK + XLSX CDN).

### Instalacja i uruchomienie
1. Skopiuj `config/firebase-config.template.js` do `config/firebase-config.js`.
2. Wklej konfigurację Firebase (Web) z konsoli: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. Upewnij się, że Firestore ma włączone reguły zapisu/odczytu dla dokumentu `audio/favorites` (zawiera ustawienia ulubionych i głównego widoku).
4. Upewnij się, że plik `AudioManifest.xlsx` znajduje się w katalogu `Audio/`.
5. Uruchom stronę `Audio/index.html` na serwerze statycznym.

### Tryby działania
- **Widok użytkownika** (domyślny): widoczne są tylko dwa panele — siatka odtwarzania dźwięków z „Głównego widoku”/„Ulubionych” oraz panel nawigacji list.
- **Widok admina**: pełna konfiguracja (wczytywanie manifestu, zarządzanie listami, układ „Głównego widoku”).

### Jak korzystać (użytkownik)
1. Otwórz `Audio/index.html` (bez parametru `?admin=1`) — zobaczysz tylko panel odtwarzania i panel nawigacji.
2. W panelu bocznym wybierz **Widok główny** lub jedną z list „Ulubione”.
3. Kliknij **Odtwórz** przy wybranym dźwięku (jeśli są już skonfigurowane).

### Jak korzystać (administrator)
1. Otwórz `Audio/index.html?admin=1`.
2. Kliknij **Wczytaj manifest**, aby załadować listę sampli.
3. Wyszukuj sample w polu „Szukaj sampla...”.
4. Kliknij **Odtwórz**, aby odsłuchać dźwięk.
5. Dodaj sample do „Głównego widoku” przyciskiem **Dodaj do głównego widoku** i ustaw kolejność w panelu „Główny widok”.
6. Kliknij **Nowa lista ulubionych**, aby utworzyć własną listę.
7. W karcie sampla wybierz listę z selektora i kliknij **Dodaj do listy**.
8. W panelu „Ulubione” możesz:
   - zmieniać kolejność list,
   - zmieniać nazwę listy,
   - usuwać listę,
   - przesuwać i usuwać elementy w liście,
   - odtwarzać zapisane sample.

### Dane wejściowe (AudioManifest.xlsx)
- Kolumny:
  - **NazwaSampla** – nazwa przycisku w UI.
  - **NazwaPliku** – nazwa pliku audio.
  - **LinkDoFolderu** – URL do folderu z plikami.
- Link do pliku jest budowany jako: `LinkDoFolderu + "/" + NazwaPliku`.

---

## User guide (EN)

### Requirements
- A Firebase project with Firestore enabled.
- The **Audio** Firebase must be on a **separate Google account** than the Firebase used for **Infoczytnik** (prevents project/rules conflicts).
- A static web server (e.g. GitHub Pages, Firebase Hosting, local HTTP server) so `AudioManifest.xlsx` can be fetched.
- Internet access (Firebase SDK + XLSX CDN).

### Installation & Launch
1. Copy `config/firebase-config.template.js` to `config/firebase-config.js`.
2. Paste the Firebase (Web) config from the console: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. Ensure Firestore rules allow read/write on `audio/favorites` (stores favorites and main view settings).
4. Make sure `AudioManifest.xlsx` is located in the `Audio/` folder.
5. Serve and open `Audio/index.html` from a static server.

### Modes
- **User view** (default): only two panels are visible — the playback grid (Main View/Favorites) and the navigation panel.
- **Admin view**: full configuration (manifest reload, list management, Main View order).

### How to use (user)
1. Open `Audio/index.html` (without `?admin=1`) — only the playback panel and navigation panel are shown.
2. In the side panel select **Main view** or one of the Favorites lists.
3. Click **Odtwórz** on a sound to play it (once configured).

### How to use (admin)
1. Open `Audio/index.html?admin=1`.
2. Click **Wczytaj manifest** to load samples.
3. Search samples in the “Szukaj sampla...” field.
4. Click **Odtwórz** to preview a sound.
5. Add samples to the Main View using **Dodaj do głównego widoku** and reorder them in the “Główny widok” panel.
6. Click **Nowa lista ulubionych** to create a list.
7. In a sample card select a list and click **Dodaj do listy**.
8. In the Favorites panel you can:
   - reorder lists,
   - rename lists,
   - delete lists,
   - reorder/remove items in a list,
   - play saved samples.

### Input data (AudioManifest.xlsx)
- Columns:
  - **NazwaSampla** – UI button label.
  - **NazwaPliku** – audio filename.
  - **LinkDoFolderu** – URL of the folder with files.
- The file URL is built as: `LinkDoFolderu + "/" + NazwaPliku`.

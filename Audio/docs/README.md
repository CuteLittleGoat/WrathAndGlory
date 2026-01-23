# Audio — instrukcja użytkownika / User guide

Moduł **Audio** służy do odtwarzania sampli z pliku `AudioManifest.xlsx` oraz do zarządzania listami „Ulubione” zapisywanymi w Firebase.

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
3. Upewnij się, że Firestore ma włączone reguły zapisu/odczytu dla dokumentu `audio/favorites`.
4. Upewnij się, że plik `AudioManifest.xlsx` znajduje się w katalogu `Audio/`.
5. Uruchom stronę `Audio/index.html` na serwerze statycznym.

### Jak korzystać
1. Po otwarciu strony kliknij **Wczytaj manifest**, aby załadować listę sampli.
2. Wyszukuj sample w polu „Szukaj sampla...”.
3. Kliknij **Odtwórz**, aby odsłuchać dźwięk.
4. Kliknij **Nowa lista ulubionych**, aby utworzyć własną listę.
5. W karcie sampla wybierz listę z selektora i kliknij **Dodaj do listy**.
6. W panelu „Ulubione” możesz:
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
3. Ensure Firestore rules allow read/write on `audio/favorites`.
4. Make sure `AudioManifest.xlsx` is located in the `Audio/` folder.
5. Serve and open `Audio/index.html` from a static server.

### How to use
1. After opening the page click **Wczytaj manifest** to load samples.
2. Search samples in the “Szukaj sampla...” field.
3. Click **Odtwórz** to play a sound.
4. Click **Nowa lista ulubionych** to create a list.
5. In a sample card select a list and click **Dodaj do listy**.
6. In the Favorites panel you can:
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

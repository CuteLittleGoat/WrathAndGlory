# Audio — instrukcja użytkownika / User guide

Moduł **Audio** jest w przygotowaniu. Poniżej znajduje się planowana obsługa oraz sposób działania po wdrożeniu nowych funkcji.

---

## Instrukcja obsługi (PL)

### Jak uruchomić
1. Otwórz stronę modułu: `Audio/index.html`.
2. Obecnie zobaczysz komunikat o przygotowaniu modułu. Po wdrożeniu funkcji zobaczysz listę przycisków z dźwiękami, grupy oraz panel „Ulubione”.

### Plik wejściowy z dźwiękami
- Lista dźwięków pochodzi z arkusza `Audio/AudioManifest.xlsx`.
- Arkusz zawiera kolumny:
  - **NazwaSampla** – etykieta przycisku na stronie.
  - **NazwaPliku** – nazwa pliku audio, który ma zostać odtworzony.
  - **LinkDoFolderu** – folder, w którym znajduje się plik audio.
- W aplikacji pełny link do pliku powstaje przez złożenie: `LinkDoFolderu + "/" + NazwaPliku`.

### Grupy dźwięków (panel grupowania)
- Grupy tworzy się **w interfejsie**, a nie w pliku Excel.
- Możesz:
  - tworzyć grupy (np. „Odgłosy broni”, „Potwory”, „Natura”),
  - zmieniać nazwę grupy,
  - dodawać/usuwać dźwięki z grupy,
  - usuwać grupę,
  - pokazywać/ukrywać wybrane grupy (np. checkboxy przy nazwach).

### Ulubione
- „Ulubione” to oddzielny panel z listami dźwięków.
- Możesz:
  - dodać pojedynczy dźwięk do „Ulubionych”,
  - dodać całe grupy do „Ulubionych”,
  - zmieniać kolejność dźwięków w „Ulubionych”,
  - zmieniać nazwy list „Ulubionych”,
  - zmieniać kolejność list „Ulubionych”,
  - usuwać listy „Ulubionych” (z potwierdzeniem).

### Zapisywanie konfiguracji
- Konfiguracja grup i „Ulubionych” będzie zapisywana lokalnie w przeglądarce (localStorage/IndexedDB), aby nie kolidować z modułem **Infoczytnik**.

---

## User guide (EN)

The **Audio** module is under construction. Below is the planned usage and behavior once the new features are implemented.

### How to launch
1. Open the module page: `Audio/index.html`.
2. Currently you will see an “under construction” message. After implementation you will see audio buttons, group controls, and the Favorites panel.

### Input audio manifest
- Audio entries will come from `Audio/AudioManifest.xlsx`.
- Columns:
  - **NazwaSampla** – button label shown in the UI.
  - **NazwaPliku** – audio filename to play.
  - **LinkDoFolderu** – folder that contains the audio file.
- The app will build the final URL as: `LinkDoFolderu + "/" + NazwaPliku`.

### Sound groups (grouping panel)
- Groups are created **inside the UI**, not in the Excel file.
- You can:
  - create groups (e.g., “Weapon sounds”, “Creatures”, “Nature”),
  - rename groups,
  - add/remove sounds in a group,
  - delete groups,
  - show/hide groups (e.g., via checkboxes).

### Favorites
- “Favorites” is a dedicated panel with lists of sounds.
- You can:
  - add a single sound to Favorites,
  - add whole groups to Favorites,
  - reorder sounds inside a Favorites list,
  - rename Favorites lists,
  - reorder Favorites lists,
  - delete Favorites lists (with confirmation).

### Saving configuration
- Group and Favorites configuration will be stored locally in the browser (localStorage/IndexedDB) to avoid conflicts with the **Infoczytnik** module.

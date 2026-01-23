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

### Zapisywanie konfiguracji (synchronizacja między urządzeniami)
Domyślne zapisywanie lokalne nie spełnia wymagania synchronizacji. Planowane są warianty zapisu zewnętrznego:
- **Firebase na osobnym koncie/projekcie** (oddzielny od Infoczytnika) — przechowywanie konfiguracji użytkownika w Firestore/Realtime DB z prostym logowaniem. Najwyższy priorytet pozostaje po stronie Infoczytnika, więc integracja będzie izolowana i nie może blokować jego działania.
- **Zewnętrzny plik konfiguracyjny** (np. `audio-settings.json`) w chmurze użytkownika: WebDAV, Google Drive, OneDrive lub prywatne API. Użytkownik wskazuje adres pliku, a moduł zapisuje/odczytuje konfigurację.
- **Eksport/import** konfiguracji do pliku JSON — ręczne przenoszenie pomiędzy urządzeniami (awaryjnie lub dodatkowo).

Wariant docelowy zostanie wybrany na etapie implementacji, przy zachowaniu pełnej zgodności z działaniem modułu **Infoczytnik**.

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

### Saving configuration (cross-device sync)
Local-only storage does not meet the sync requirement. Planned external options:
- **Firebase in a separate account/project** (isolated from Infoczytnik) — store user configuration in Firestore/Realtime DB with basic authentication. Infoczytnik remains the top priority; this integration must be isolated and must not block it.
- **External config file** (e.g., `audio-settings.json`) stored in the user’s cloud: WebDAV, Google Drive, OneDrive, or a private API. The user provides the file URL and the module reads/writes settings.
- **Export/import** configuration as a JSON file — manual transfer between devices (fallback or supplemental option).

The final option will be chosen during implementation while preserving full compatibility with the **Infoczytnik** module.

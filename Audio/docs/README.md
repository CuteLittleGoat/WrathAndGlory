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

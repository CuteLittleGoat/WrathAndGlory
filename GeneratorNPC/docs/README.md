# Generator NPC — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
**Generator NPC** pomaga szybko zbudować kartę przeciwnika lub postaci niezależnej na sesję. Wybierasz bazę, dopasowujesz statystyki i generujesz gotową kartę do wydruku/podglądu.

### Jak zacząć
1. Otwórz `GeneratorNPC/index.html`.
2. W prawym górnym rogu wybierz język.
3. Poczekaj, aż sekcja **Źródło danych** pokaże, że dane zostały załadowane.

### Tworzenie NPC krok po kroku
1. W sekcji **Wybór bazowy** wybierz rekord z listy **Bestiariusz · Nazwa**.
2. (Opcjonalnie) dopisz własne notatki w polu **Uwagi do rekordu**.
3. W tabeli **Podgląd bazowy** popraw wartości, które chcesz zmienić (np. Żywotność, Obrona, Szybkość).
4. W sekcji **Moduły aktywne** zaznacz, które bloki mają być pokazane na finalnej karcie (np. Broń, Talenty, Psionika).
5. W aktywnych modułach wybierz konkretne elementy z list.
6. Kliknij **Generuj kartę**.
7. Karta otworzy się w nowej karcie przeglądarki.
8. W górnym wierszu karty zobaczysz zawsze kolumny **Poziom 1, 2, 3, 4, 5**.
9. Wiersz **Zagrożenie** uzupełnia te kolumny od lewej:
   - gdy rekord ma 5 znaków (np. `PPPPP`) — wszystkie kolumny 1–5 będą wypełnione,
   - gdy rekord ma mniej znaków (np. `?`) — znak trafi do pierwszej kolumny, a pozostałe zostaną puste.

### Jak działa panel „Ulubione”
1. Ustaw NPC tak, jak chcesz go zapisać.
2. (Opcjonalnie) wpisz nazwę własną w polu **Alias**.
3. Kliknij **Dodaj do ulubionych**.
4. Zapisany układ możesz później:
   - wczytać,
   - usunąć,
   - przesunąć wyżej/niżej na liście.
5. Przycisk **Odśwież** ponownie pobiera listę ulubionych.

### Najważniejsze przyciski
- **Generuj kartę** – tworzy końcowy widok NPC.
- **Reset** – czyści wybory i wraca do wartości początkowych.
- **Edytuj** (przy umiejętnościach) – pozwala ręcznie dopisać/zmienić opis.

### Dobre praktyki
- Najpierw wybierz bazę, potem dopiero modyfikuj liczby.
- Do często używanych przeciwników twórz wpisy w ulubionych.
- Przed drukiem sprawdź kartę po zmianie języka, jeśli grasz z grupą dwujęzyczną.

---

### Integracja Firebase — wymagana dla współdzielonych ulubionych
Aby lista **Ulubionych** była współdzielona i trwała między urządzeniami, moduł **Generator NPC** wymaga integracji z Firebase (Firestore). Bez niej zapis działa tylko lokalnie.

#### Krok po kroku — tworzenie projektu i bazy
1. Otwórz [https://console.firebase.google.com](https://console.firebase.google.com).
2. Kliknij **Utwórz projekt**.
3. Podaj nazwę projektu i kliknij **Dalej**.
4. Ustaw Analytics (opcjonalnie) i zakończ tworzenie.
5. Dodaj aplikację webową przez ikonę **Web** (`</>`).
6. Skopiuj konfigurację `firebaseConfig`.
7. Wklej wartości do pliku `GeneratorNPC/config/firebase-config.js`.
8. Przejdź do **Firestore Database**.
9. Kliknij **Utwórz bazę danych**.
10. Wybierz tryb, kliknij **Dalej**, wybierz region, kliknij **Włącz**.
11. Ustaw reguły dostępu w zakładce **Reguły**.
12. Otwórz `GeneratorNPC/index.html`.
13. Dodaj wpis do **Ulubionych** i odśwież stronę — wpis powinien być dalej dostępny.

---

## Kopia modułu dla nowej grupy
- Podmień `GeneratorNPC/config/firebase-config.js` na konfigurację Firebase grupy.
- Sprawdź i ewentualnie zmień adres źródła danych `DATA_URL`, aby wskazywał DataVault na tym samym prywatnym serwerze grupy.
- Moduł działa poprawnie, jeżeli obok folderu `GeneratorNPC` znajduje się folder `DataVault` zawierający plik `data.json` (ścieżka względna: `../DataVault/data.json`).
- Po zmianie wygeneruj testową kartę i zapisz ulubione, aby potwierdzić działanie.

---

## 🇬🇧 User instructions (EN)

### What this module is for
**NPC Generator** helps you quickly build enemy/NPC sheets for sessions. Pick a base profile, adjust values, and generate a ready card.

### Getting started
1. Open `GeneratorNPC/index.html`.
2. Choose language in the top-right corner.
3. Wait until **Data source** confirms the data is loaded.

### Build an NPC step by step
1. In **Base selection**, choose an entry from **Bestiary · Name**.
2. (Optional) add custom notes in **Record notes**.
3. In **Base preview**, adjust values you want to change (e.g., Wounds, Defense, Speed).
4. In **Active modules**, enable blocks that should appear on final card (e.g., Weapons, Talents, Psionics).
5. In active blocks, select specific items.
6. Click **Generate card**.
7. The final card opens in a new browser tab.
8. The top card row always shows **Level 1, 2, 3, 4, 5** columns.
9. The **Threat** row fills those columns from left to right:
   - if an entry has 5 symbols (for example `PPPPP`), all 1–5 columns are filled,
   - if an entry has fewer symbols (for example `?`), only the first column is filled and the rest stay empty.

### How “Favorites” works
1. Configure NPC setup.
2. (Optional) enter a custom **Alias**.
3. Click **Add to favorites**.
4. Saved setups can be:
   - loaded,
   - removed,
   - moved up/down.
5. **Refresh** reloads favorites list.

### Main buttons
- **Generate card** – creates final NPC card.
- **Reset** – clears setup back to defaults.
- **Edit** (next to skills) – allows manual text updates.

### Best practices
- Choose base profile first, then edit numbers.
- Save recurring opponents as favorites.
- If your table is bilingual, review card after language switch before print/share.

### Firebase integration — required for shared favorites
To keep **Favorites** shared and persistent across devices, **NPC Generator** requires Firebase (Firestore). Without it, favorites are local only.

#### Step by step — create project and database
1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **Create a project**.
3. Enter project name and click **Continue**.
4. Configure Analytics (optional) and finish creation.
5. Add a web app using **Web** icon (`</>`).
6. Copy `firebaseConfig` values.
7. Paste values into `GeneratorNPC/config/firebase-config.js`.
8. Go to **Firestore Database**.
9. Click **Create database**.
10. Choose mode, click **Next**, select region, click **Enable**.
11. Set access rules in **Rules**.
12. Open `GeneratorNPC/index.html`.
13. Add one favorite and refresh page — entry should still be present.
## Copying module for a new group
- Replace `GeneratorNPC/config/firebase-config.js` with the group-specific Firebase configuration.
- Verify and, if needed, change `DATA_URL` so it points to DataVault hosted on the same private server.
- The module works correctly when a `DataVault` folder is placed next to `GeneratorNPC` and contains `data.json` (relative path: `../DataVault/data.json`).
- After changes, generate a test card and save favorites to confirm everything works.

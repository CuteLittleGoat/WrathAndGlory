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

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

Przełącznik języka jest ukryty celowo; miejsce do jego włączenia jest oznaczone komentarzem przy kontenerze `.language-switcher--hidden`.

## 🇬🇧 User instructions (EN)

The language switcher is intentionally hidden; the place to enable it is marked with a comment next to the `.language-switcher--hidden` container.

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


## Źródło danych / Data source
PL: Interfejs informuje teraz, że dane pochodzą z prywatnej bazy DataVault po autoryzacji, a nie z publicznego pliku `../DataVault/data.json`.
EN: The UI now states that data comes from a private authorized DataVault database, not from a public `../DataVault/data.json` file.


## Runtime danych / Data runtime
PL: GeneratorNPC laduje dane przez `shared/firebase-data-loader.js` (Firebase Auth + RTDB `/datavault/live`), bez `../DataVault/data.json` i bez publicznego REST URL.
EN: GeneratorNPC loads data via `shared/firebase-data-loader.js` (Firebase Auth + RTDB `/datavault/live`), without `../DataVault/data.json` and without a public REST URL.


## Widoczność przełącznika języka / Language switch visibility
- PL: Przełącznik wyboru języka jest celowo ukryty w interfejsie, ale cały kod tłumaczeń (słowniki, logika `applyLanguage`/`updateLanguage`, aktualizacja etykiet i komunikatów) pozostaje aktywny. Aby ponownie go odkryć, usuń klasę `language-switcher--hidden` z elementu `<div class="language-switcher ...">` w pliku `index.html` tego modułu.
- EN: The language selector is intentionally hidden in the UI, but all translation code (dictionaries, `applyLanguage`/`updateLanguage` logic, labels/messages refresh) remains active. To reveal it again, remove the `language-switcher--hidden` class from `<div class="language-switcher ...">` in this module's `index.html`.


## Aktualizacja / Update
PL: GeneratorNPC korzysta ze wspólnej konfiguracji `shared/firebase-config.js` i czeka na gotowość loadera Firebase przed pobraniem danych.
EN: GeneratorNPC now uses shared `shared/firebase-config.js` and waits for Firebase loader readiness before data loading.



## Dostęp do prywatnych danych / Private data access
- PL: W oknie dostępu do prywatnych danych dodano ikonę `IkonaPowiadomien2.png` ze stałym miejscem 72×72 px, aby zapobiec „skakaniu” rozmiaru okna w trakcie ładowania.
- EN: The private-data access window now includes `IkonaPowiadomien2.png` in a fixed 72×72 px slot to prevent dialog size jumps during loading.
- PL: GeneratorNPC ładuje dane wyłącznie z prywatnej bazy DataVault po autoryzacji i używa tej samej sesji co DataVault.
- EN: GeneratorNPC loads data only from the private DataVault database after authorization and uses the same session as DataVault.
- PL: Okno logowania jest takie samo jak w DataVault.
- EN: The login gate is visually and textually identical to DataVault.

## Rozdzielenie sesji Firebase (DataVault vs Ulubione) / Firebase session separation (DataVault vs Favorites)
- PL: Generator NPC korzysta teraz z oddzielnej, nazwanej aplikacji Firebase dla panelu **Ulubione** (`generator-npc-favorites`), dzięki czemu nie zakłóca logowania do prywatnych danych DataVault.
- EN: Generator NPC now uses a separate named Firebase app for **Favorites** (`generator-npc-favorites`), so it no longer interferes with DataVault private-data login.
- PL: Jeśli połączenie z Ulubionymi się nie powiedzie, generator nadal ładuje główne dane NPC i działa normalnie.
- EN: If Favorites connection fails, the generator still loads core NPC data and remains usable.


## Teksty okna dostępu K.O.Z.A. / K.O.Z.A. gate wording
- PL: Okno hasła w GeneratorNPC ma teraz identyczne słownictwo jak DataVault: **„Dostęp do danych z klauzulą tajności K.O.Z.A.”**, **„Litania Dostępu”**, **„Rozpocznij Rytuał”** oraz opis rytuału uwierzytelnienia.
- EN: GeneratorNPC now matches DataVault wording: **“Access to K.O.Z.A. Classified Data”**, **“Litany of Access”**, **“Begin Rite”**, and the Rite of Authentication description.
- PL/EN: Komunikaty błędów logowania i odczytu prywatnych danych również używają nowej narracji „Machine Spirit / Duch Maszyny”.

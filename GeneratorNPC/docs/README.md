# Generator NPC — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
**Generator NPC** pomaga szybko zbudować kartę przeciwnika lub postaci niezależnej na sesję. Wybierasz bazę, dopasowujesz statystyki i generujesz gotową kartę do wydruku/podglądu.

### Jak zacząć
1. Otwórz `GeneratorNPC/index.html`.
2. Poczekaj, aż sekcja **Źródło danych** pokaże, że dane zostały załadowane.

### Tworzenie NPC krok po kroku
1. W sekcji **Wybór bazowy** wybierz rekord z listy **Bestiariusz · Nazwa**. Domyślnie lista ukrywa zdezaktualizowane wpisy bestiariusza.
2. Jeżeli chcesz zobaczyć także zdezaktualizowane wpisy, zaznacz pole **Czy wyświetlić zdezaktualizowane wpisy?**. Takie wpisy są pokazane przygaszonym kolorem. Po odznaczeniu pola zdezaktualizowane wpisy znikają; jeśli jeden z nich był wybrany, wybór zostanie wyczyszczony, a podgląd wróci do stanu braku wyboru.
3. (Opcjonalnie) dopisz własne notatki w polu **Uwagi do rekordu**.
4. W tabeli **Podgląd bazowy** popraw wartości, które chcesz zmienić (np. Żywotność, Obrona, Szybkość). Przy wierszach **Umiejętności** i **Słowa Kluczowe** użyj przycisku **Edytuj**, aby przejść do pola tekstowego, a potem kliknij **Zapisz**.
5. W sekcji **Moduły aktywne** zaznacz, które bloki mają być pokazane na finalnej karcie (np. Broń, Talenty, Psionika).
6. W aktywnych modułach wybierz konkretne elementy z list.
7. Kliknij **Generuj kartę**.
8. Karta otworzy się w nowej karcie przeglądarki.
9. W górnym wierszu karty zobaczysz zawsze kolumny **Poziom 1, 2, 3, 4, 5**.
10. Wiersz **Zagrożenie** uzupełnia te kolumny od lewej:
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
- **Edytuj** (przy **Umiejętnościach** i **Słowach Kluczowych**) – przełącza wybrane pole tekstowe w tryb pisania. Ten przycisk ma jasny napis i jasne obramowanie, takie jak numery stron w module DataVault.
- **Zapisz** (w tym samym miejscu) – zapisuje wpisany tekst i ponownie pokazuje zwykły podgląd. W podglądzie **Słowa Kluczowe** pozostają czerwone, a przecinki mają zwykły zielony kolor. Na wygenerowanej karcie drukowanej słowa kluczowe są czarno-białe.

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
- Sprawdź konfigurację Firebase (`config/firebase-config.js` i `../shared/firebase-config.js`) dla własnego środowiska grupy.
- Moduł ładuje dane główne przez `../shared/firebase-data-loader.js` z prywatnego runtime DataVault (`/datavault/live`) po autoryzacji.
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
2. Wait until **Data source** confirms the data is loaded.

### Build an NPC step by step
1. In **Base selection**, choose an entry from **Bestiary · Name**. By default, the list hides outdated bestiary entries.
2. To see outdated entries too, tick **Show outdated entries?**. Those entries appear in a dimmed color. When you untick the field, outdated entries disappear; if one of them was selected, the selection is cleared and the preview returns to the no-selection state.
3. (Optional) add custom notes in **Record notes**.
4. In **Base preview**, adjust values you want to change (e.g., Wounds, Defense, Speed). For **Skills** and **Keywords**, click **Edit** to open a text field, then click **Save**.
5. In **Active modules**, enable blocks that should appear on final card (e.g., Weapons, Talents, Psionics).
6. In active blocks, select specific items.
7. Click **Generate card**.
8. The final card opens in a new browser tab.
9. The top card row always shows **Level 1, 2, 3, 4, 5** columns.
10. The **Threat** row fills those columns from left to right:
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
- **Edit** (next to **Skills** and **Keywords**) – switches the selected text field into typing mode. This button uses bright text and a bright border, matching the page-number color in the DataVault module.
- **Save** (in the same place) – stores the typed text and returns to the normal preview. In the preview, **Keywords** stay red while commas keep the regular green color. On the generated printable card, keywords are black and white.

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
- Verify Firebase configuration (`config/firebase-config.js` and `../shared/firebase-config.js`) for your group environment.
- The module loads core data through `../shared/firebase-data-loader.js` from private DataVault runtime (`/datavault/live`) after authorization.
- After changes, generate a test card and save favorites to confirm everything works.


## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Źródło danych / Data source
PL: Interfejs informuje, że dane pochodzą z prywatnej bazy DataVault po autoryzacji Firebase.
EN: The UI states that data comes from a private DataVault database after Firebase authorization.


## Runtime danych / Data runtime
PL: GeneratorNPC ładuje dane przez `shared/firebase-data-loader.js` (Firebase Auth + RTDB `/datavault/live`).
EN: GeneratorNPC loads data via `shared/firebase-data-loader.js` (Firebase Auth + RTDB `/datavault/live`).


## Widoczność przełącznika języka / Language switch visibility
- PL: Przełącznik języka jest celowo ukryty w interfejsie. Kod tłumaczeń pozostaje aktywny, a miejsce zmiany widoczności jest oznaczone komentarzem przy `.language-switcher--hidden`.
- EN: The language switcher is intentionally hidden in the UI. Translation code remains active, and the visibility change point is marked by a comment next to `.language-switcher--hidden`.


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

## 🇵🇱 Układ pola „Litania Dostępu”
W oknie dostępu etykieta **„Litania Dostępu”** jest ustawiona po lewej stronie, a pole hasła po prawej. Przycisk **„Rozpocznij Rytuał”** znajduje się pod polem hasła, po prawej stronie. Na wąskich ekranach (telefon) elementy mają wymuszoną kolejność pionową: wiersz 1 etykieta, wiersz 2 pole hasła, wiersz 3 przycisk, a komunikat błędu pozostaje pod formularzem.

## 🇬🇧 “Litany of Access” field layout
In the access window, the **“Litany of Access”** label is positioned on the left, while the password field is on the right. The **“Begin Rite”** button is placed below the password field on the right side. On narrow screens (mobile), the order is explicitly vertical: row 1 label, row 2 password field, row 3 button, while the error message remains below the form.


## Okno dostępu na telefonie / Access gate on phones
- PL: Wspólny overlay `shared/access-gate.css` jest zakotwiczony do viewportu (`width:100vw`, `max-width:100vw`, `height:100dvh`) i ma `overflow:auto`, dzięki czemu karta hasła pozostaje widoczna nawet przy szerokim layoucie modułu.
- EN: Shared overlay `shared/access-gate.css` is anchored to the viewport (`width:100vw`, `max-width:100vw`, `height:100dvh`) and uses `overflow:auto`, so the password card stays visible even when the module layout is very wide.
- PL: W `GeneratorNPC/style.css` karty danych mają `overflow-x:auto`, a `.data-table` ma `min-width:max-content`, więc szerokie tabele przewijają się wewnątrz kart zamiast rozszerzać cały dokument.
- EN: In `GeneratorNPC/style.css`, data cards use `overflow-x:auto` and `.data-table` uses `min-width:max-content`, so wide tables scroll inside cards instead of stretching the whole document.

# 🇵🇱 Instrukcja dla użytkownika (PL) — dane GeneratorNPC

GeneratorNPC korzysta z dotychczasowych danych postaci niezależnych: bestiariusza, pancerzy, broni, augumentacji, ekwipunku, talentów, psioniki i modlitw. Dane muszą zawierać zakładki `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika` i `Modlitwy`, a każda z nich musi mieć przynajmniej jeden wpis. Jeśli którejś zakładki brakuje albo jest pusta, moduł pokaże komunikat błędu i nie wypełni list pustymi wyborami. Zakładki pojazdów z DataVault nie są częścią GeneratorNPC i nie pojawiają się w wyborach podczas tworzenia karty NPC.

# 🇬🇧 User instructions (EN) — GeneratorNPC data

GeneratorNPC uses the existing non-player character data: bestiary, armor, weapons, augmentations, equipment, talents, psionics, and prayers. The data must include the `Bestiariusz`, `Pancerze`, `Bronie`, `Augumentacje`, `Ekwipunek`, `Talenty`, `Psionika`, and `Modlitwy` tabs, and each tab must contain at least one entry. If any required tab is missing or empty, the module shows an error message and does not fill the lists with empty choices. DataVault vehicle tabs are not part of GeneratorNPC and do not appear in the choices used to create an NPC card.

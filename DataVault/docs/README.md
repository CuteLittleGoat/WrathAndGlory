# 🇵🇱 Instrukcja dla użytkownika (PL)

## Do czego służy DataVault
**DataVault** to wyszukiwarka wiedzy do Wrath & Glory. W jednym miejscu przeglądasz tabele, zasady i opisy potrzebne podczas gry.

## Jak otworzyć
- Widok standardowy: `DataVault/index.html`
- Widok rozszerzony (admin): `DataVault/index.html?admin=1`

## Co znajdziesz na ekranie
- **Zakładki** – przełączają między grupami danych.
- **Szukaj (globalnie)** – szuka wpisów w aktualnym obszarze.
- **Filtry kolumnowe** – zawężają wyniki w konkretnych kolumnach; aktywny filtr jest oznaczony jasnoczerwonym podświetleniem i kropką przy ikonie filtra.
- **Pełen Widok** – czyści filtry/sortowanie i pokazuje pełną listę.
- **Widok Domyślny** – przywraca domyślny układ danych.
- **Porównaj zaznaczone** – otwiera porównanie wybranych pozycji.
- **Ikona DataVault w nagłówku** – w lewym górnym rogu widzisz ikonę `Icon.png` osadzoną w stałym zielonym polu 48×48 px (ikona wypełnia całe pole bez ucinania), dzięki czemu nagłówek nie „skacze” podczas ładowania.
- **Oznaczenia odnośników stron** – zapisy w nawiasach typu `str. 123`, `strona 123`, `page 123` i `p. 123` są automatycznie wyróżniane.

## Jak pracować krok po kroku
1. Wejdź do modułu i wybierz zakładkę odpowiadającą tematowi, którego szukasz.
2. Wpisz słowo kluczowe w polu wyszukiwania.
3. Jeśli wyników jest dużo, ustaw filtry tylko na interesujących kolumnach.
4. Zaznacz 2 lub więcej wierszy.
5. Kliknij **Porównaj zaznaczone**, aby zobaczyć dane obok siebie.
6. Po zakończeniu kliknij **Pełen Widok**, aby wrócić do pełnych danych.

## Różnice: użytkownik vs admin
- **Użytkownik**: widzi zestaw najczęściej używanych danych na sesji.
- **Admin**: ma dodatkowe zakładki i przycisk utrzymaniowy.
- Domyślna zakładka po wejściu:
  - użytkownik: **Bronie**,
  - admin: **Notatki**.

## Przycisk „Generuj pliki danych” (tylko admin)
Używaj go, gdy chcesz odświeżyć dane modułu po aktualizacji pliku źródłowego. Po kliknięciu wybierasz lokalny plik **`Repozytorium.xlsx`** z dysku (plik nie musi być zapisany w repozytorium), a system przygotowuje nowe pliki danych dla aplikacji.

## Wymagania dla pliku XLSX
- Wskazywany plik wejściowy powinien mieć nazwę **`Repozytorium.xlsx`**.
- Plik wybierasz w oknie systemowym po kliknięciu **Generuj pliki danych**; nie ma wymogu trzymania go stale w folderze `DataVault` ani commitowania do repozytorium.
- W praktyce używane są zakładki widoczne w interfejsie DataVault (np. `Bronie`, `Archetypy`, `Bestiariusz`, `Skrót Zasad`, `Pakiety Wyniesienia`). Brak zakładki oznacza brak tej tabeli w aplikacji.
- Każda zakładka powinna zachować stałe nazwy kolumn. Najważniejsze kolumny wspólne dla wielu zakładek to m.in. `Nazwa`, `Opis`, `Podręcznik`, `Strona`, `Słowa Kluczowe`.
- Kolorowanie i styl tekstu są czytane z formatowania komórek (rich text):
  - czerwony tekst -> podświetlenie czerwone w aplikacji,
  - pogrubienie/kursywa/przekreślenie -> zachowane 1:1 w aplikacji.
- Odnośniki stron w nawiasach (np. `(str. 123)`, `(strona 45)`, `(page 88)`, `(p. 12)`) są automatycznie wyświetlane jaśniejszym kolorem.
- W kolumnach `Słowa Kluczowe` obowiązują dodatkowe reguły renderowania (np. neutralny przecinek, wyjątek dla `Pakiety Wyniesienia`), opisane szczegółowo w `docs/ZasadyFormatowania.md`.

## Aktualne źródło danych
Kliknij **Generuj pliki danych**, aby wskazać lokalny plik `Repozytorium.xlsx`. Aplikacja wygeneruje `data.json` (backup) oraz `firebase-import.json` (tylko ten plik importuj do Firebase RTDB `/datavault/live`).

## Runtime danych
Runtime pochodzi z Firebase Realtime Database (ścieżka `/datavault/live`) przez Firebase Auth i wspólny loader `shared/firebase-data-loader.js`. Publiczny `data.json` nie jest używany jako runtime.

## Logowanie do prywatnych danych Firebase
- W oknie logowania wyświetla się ikona `IkonaPowiadomien2.png` w stałym polu (72×72 px), więc karta logowania nie zmienia rozmiaru podczas doczytywania zasobów.
- Po wpisaniu poprawnego hasła bramka zamyka się, a dane ładują się od razu z prywatnej bazy.
- Jeżeli sesja logowania nie zostanie wykryta po wpisaniu hasła, zobaczysz dokładny komunikat z informacją, że problem dotyczy sesji Auth, a niekoniecznie samego hasła.

## Aktualny dostęp do danych
- DataVault i GeneratorNPC używają wspólnego logowania Firebase. Zalogowanie w jednym module odblokowuje drugi bez ponownego wpisywania hasła w tej samej przeglądarce.
- Przycisk „WYLOGUJ / ZABLOKUJ DANE” nie jest dostępny w interfejsie.

## Wspólna sesja z GeneratorNPC
DataVault i GeneratorNPC korzystają z tej samej nazwanej aplikacji prywatnych danych (`wh40k-data-slate-private-data`), więc logowanie wykonane w jednym module działa też w drugim.

## Okno dostępu K.O.Z.A.
Okno hasła używa narracji K.O.Z.A. i Ducha Maszyny:
- tytuł: **„Dostęp do danych z klauzulą tajności K.O.Z.A.”**,
- opis: **Rytuał Uwierzytelnienia**,
- etykieta pola: **„Litania Dostępu”**,
- przycisk: **„Rozpocznij Rytuał”**.

## Układ pola „Litania Dostępu”
W oknie dostępu etykieta **„Litania Dostępu”** jest ustawiona po lewej stronie, a pole hasła po prawej. Przycisk **„Rozpocznij Rytuał”** znajduje się pod polem hasła, po prawej stronie. Na wąskich ekranach (telefon) elementy mają wymuszoną kolejność pionową: wiersz 1 etykieta, wiersz 2 pole hasła, wiersz 3 przycisk, a komunikat błędu pozostaje pod formularzem.

## Dodawanie nowej wersji językowej
1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

Przełącznik języka jest domyślnie ukryty; dokładne miejsce zmiany widoczności opisuje komentarz w `index.html` obok `.language-switcher--hidden`.

## Ważne przy kopiowaniu modułu
W module jest przycisk **Strona Główna / Main Page**. Po skopiowaniu aplikacji do innej lokalizacji (inna domena, inny katalog) **zaktualizuj jego hiperłącze**, żeby poprawnie wracał do strony startowej.

## Aktualna uwaga o generatorze referencyjnym
Skrypt `DataVault/build_json.py` został uproszczony do aktualnie używanej ścieżki parsera XLSX (ZIP/XML). Dla użytkownika nic nie zmienia to w obsłudze modułu: przycisk **Generuj pliki danych** dalej tworzy aktualne pliki robocze zgodnie z obecną logiką DataVault.

---

# 🇬🇧 User instructions (EN)

## What DataVault is for
**DataVault** is a Wrath & Glory knowledge browser. It keeps rules, tables, and references in one searchable place.

## How to open
- Standard view: `DataVault/index.html`
- Extended admin view: `DataVault/index.html?admin=1`

## What you get on screen
- **Tabs** – switch between data groups.
- **Global search** – finds entries in the current area.
- **Column filters** – narrow results per column; an active filter is marked with a bright red highlight and a dot next to the filter icon.
- **Full View** – clears filters/sorting and restores full list.
- **Default View** – restores default data layout.
- **Compare selected** – opens side-by-side comparison.
- **DataVault header icon** – the top-left corner shows `Icon.png` inside a fixed 48×48 px green slot (the icon fills the whole slot with no clipping), so the header stays stable while assets load.
- **Page-reference highlights** – bracketed references such as `str. 123`, `strona 123`, `page 123`, and `p. 123` are automatically highlighted.

## Step-by-step workflow
1. Open the module and choose a tab related to your topic.
2. Enter a keyword in search.
3. If results are too broad, apply filters to specific columns.
4. Select 2 or more rows.
5. Click **Compare selected** to inspect entries side by side.
6. Click **Full View** when done to return to complete data.

## User vs admin differences
- **User mode**: core session-focused content.
- **Admin mode**: extra tabs plus maintenance control.
- Default opening tab:
  - user: **Bronie**,
  - admin: **Notatki**.

## “Generate data files” button (admin only)
Use it when module data needs refreshing after source updates. After clicking it, you select a local **`Repozytorium.xlsx`** file from disk (the file does not need to be stored in the repository), and the app builds refreshed data files.

## XLSX file requirements
- The selected input file should be named **`Repozytorium.xlsx`**.
- You choose the file via a system file picker after clicking **Generate data files**; it does not need to permanently exist in the `DataVault` folder and does not need to be committed to the repository.
- In practice, DataVault uses worksheet tabs that are visible in the UI (for example: `Bronie`, `Archetypy`, `Bestiariusz`, `Skrót Zasad`, `Pakiety Wyniesienia`). If a tab is missing, that table is missing in the app.
- Each tab should keep stable column names. Key columns reused across many tabs include `Nazwa`, `Opis`, `Podręcznik`, `Strona`, and `Słowa Kluczowe`.
- Text colors/styles are read from cell formatting (rich text):
  - red text -> red highlight in the app,
  - bold/italic/strikethrough -> preserved 1:1 in the app.
- Page references in parentheses (for example `(str. 123)`, `(strona 45)`, `(page 88)`, `(p. 12)`) are automatically shown in a lighter color.
- `Słowa Kluczowe` columns use extra rendering rules (for example neutral commas and the `Pakiety Wyniesienia` exception), documented in detail in `docs/ZasadyFormatowania.md`.

## Current data source
Click **Generate data files** to choose a local `Repozytorium.xlsx` file. The app generates `data.json` (backup) and `firebase-import.json` (import only this file into Firebase RTDB at `/datavault/live`).

## Data runtime
Runtime is loaded from Firebase Realtime Database (`/datavault/live`) through Firebase Auth and shared loader `shared/firebase-data-loader.js`. Public `data.json` is not used as runtime.

## Firebase private data sign-in
- The login window shows `IkonaPowiadomien2.png` in a fixed 72×72 px slot, so the login card keeps a stable size while assets load.
- After entering the correct password, the gate closes and data is loaded immediately from the private database.
- If the sign-in session is not detected after login, you get a precise message saying the issue is with Auth session detection, not necessarily the password itself.

## Current data access
- DataVault and GeneratorNPC share the same Firebase login. Signing in once unlocks the other module in the same browser session.
- The “LOG OUT / LOCK DATA” button is not available in the interface.

## Shared session with GeneratorNPC
DataVault and GeneratorNPC use the same named private-data app (`wh40k-data-slate-private-data`), so sign-in in one module is reused in the other.

## K.O.Z.A. access window
The password gate uses K.O.Z.A./Machine Spirit wording:
- title: **“Access to K.O.Z.A. Classified Data”**,
- description: **Rite of Authentication**,
- field label: **“Litany of Access”**,
- button: **“Begin Rite”**.

## “Litany of Access” field layout
In the access window, the **“Litany of Access”** label is on the left and the password field is on the right. The **“Begin Rite”** button is below the password field on the right side. On narrow screens (mobile), the order is explicitly vertical: row 1 label, row 2 password field, row 3 button, while the error message remains below the form.

## Adding a new language version
1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

The language switcher is hidden by default; the exact visibility change point is documented by a comment in `index.html` next to `.language-switcher--hidden`.

## Important when copying the module
This module includes a **Strona Główna / Main Page** button. After copying the app to another location (different domain or folder), **update its hyperlink** so it returns to the launcher correctly.

## Current note about the reference generator
The `DataVault/build_json.py` script has been simplified to the currently used XLSX parsing path (ZIP/XML). This does not change end-user behavior: the **Generate data files** button still produces the current working files according to the active DataVault logic.

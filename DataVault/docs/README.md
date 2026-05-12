# DataVault — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy DataVault
**DataVault** to wyszukiwarka wiedzy do Wrath & Glory. W jednym miejscu przeglądasz tabele, zasady i opisy potrzebne podczas gry.

### Jak otworzyć
- Widok standardowy: `DataVault/index.html`
- Widok rozszerzony (admin): `DataVault/index.html?admin=1`

### Co znajdziesz na ekranie
- **Zakładki** – przełączają między grupami danych.
- **Szukaj (globalnie)** – szuka wpisów w aktualnym obszarze.
- **Filtry kolumnowe** – zawężają wyniki w konkretnych kolumnach; aktywny filtr jest oznaczony jasnoczerwonym podświetleniem i kropką przy ikonie filtra.
- **Pełen Widok** – czyści filtry/sortowanie i pokazuje pełną listę.
- **Widok Domyślny** – przywraca domyślny układ danych.
- **Porównaj zaznaczone** – otwiera porównanie wybranych pozycji.
- **Oznaczenia odnośników stron** – zapisy w nawiasach typu `str. 123`, `strona 123`, `page 123` i `p. 123` są automatycznie wyróżniane, żeby łatwiej znaleźć odwołania do podręcznika.

### Jak pracować krok po kroku
1. Wejdź do modułu i wybierz zakładkę odpowiadającą tematowi, którego szukasz.
2. Wpisz słowo kluczowe w polu wyszukiwania.
3. Jeśli wyników jest dużo, ustaw filtry tylko na interesujących kolumnach.
4. Zaznacz 2 lub więcej wierszy.
5. Kliknij **Porównaj zaznaczone**, aby zobaczyć dane obok siebie.
6. Po zakończeniu kliknij **Pełen Widok**, aby wrócić do pełnych danych.

### Różnice: użytkownik vs admin
- **Użytkownik**: widzi zestaw najczęściej używanych danych na sesji.
- **Admin**: ma dodatkowe zakładki i przycisk utrzymaniowy.
- Domyślna zakładka po wejściu:
  - użytkownik: **Bronie**,
  - admin: **Notatki**.

### Przycisk „Generuj pliki danych” (tylko admin)
Używaj go, gdy chcesz odświeżyć dane modułu po aktualizacji pliku źródłowego. Po kliknięciu system przygotowuje nowy plik danych dla aplikacji.

### Dobre nawyki na sesję
- Zaczynaj od krótkich fraz (np. nazwa talentu, cechy lub warunku).
- Używaj porównania, gdy grupa rozważa kilka opcji naraz.
- Jeśli „zgubisz” widok po wielu filtrach, wróć przez **Pełen Widok**.

---

### Ważne przy kopiowaniu modułu
W module jest przycisk **Strona Główna / Main Page**. Po skopiowaniu aplikacji do innej lokalizacji (inna domena, inny katalog) **koniecznie zaktualizuj jego hiperłącze**, żeby poprawnie wracał do strony startowej.

---

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

## 🇬🇧 User instructions (EN)

### What DataVault is for
**DataVault** is a Wrath & Glory knowledge browser. It keeps rules, tables, and references in one searchable place.

### How to open
- Standard view: `DataVault/index.html`
- Extended admin view: `DataVault/index.html?admin=1`

### What you get on screen
- **Tabs** – switch between data groups.
- **Global search** – finds entries in the current area.
- **Column filters** – narrow results per column; an active filter is marked with a bright red highlight and a dot next to the filter icon.
- **Pełen Widok / Full View** – clears filters/sorting and restores full list.
- **Widok Domyślny / Default View** – restores default data layout.
- **Porównaj zaznaczone / Compare selected** – opens side-by-side comparison.
- **Page-reference highlights** – bracketed references such as `str. 123`, `strona 123`, `page 123`, and `p. 123` are automatically highlighted for faster rulebook lookup.

### Step-by-step workflow
1. Open the module and choose a tab related to your topic.
2. Enter a keyword in search.
3. If results are too broad, apply filters to specific columns.
4. Select 2 or more rows.
5. Click **Compare selected** to inspect entries side by side.
6. Click **Full View** when done to return to complete data.

### User vs admin differences
- **User mode**: core session-focused content.
- **Admin mode**: extra tabs plus maintenance control.
- Default opening tab:
  - user: **Bronie**,
  - admin: **Notatki**.

### “Generuj pliki danych” button (admin only)
Use it when module data needs refreshing after source updates. It prepares a new data file for the app.

### Good session habits
- Start with short keywords (talent/trait/condition names).
- Use compare mode when choosing between options.
- If the screen becomes too filtered, use **Full View**.

### Important when copying the module
This module includes a **Strona Główna / Main Page** button. After copying the app to another location (different domain or folder), **update its hyperlink** so it returns to the launcher correctly.

## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Aktualne źródło danych / Current data source
PL: Przycisk **Generuj pliki danych** otwiera okno wyboru lokalnego pliku `Repozytorium.xlsx` i generuje dwa pliki: `data.json` (backup/kontrola) oraz `firebase-import.json` (wyłącznie do importu do Firebase RTDB `/datavault/live`).
EN: The **Generate data files** button opens a local `Repozytorium.xlsx` picker and generates two files: `data.json` (backup/control) and `firebase-import.json` (import this file only into Firebase RTDB at `/datavault/live`).


## Runtime danych / Data runtime
PL: Runtime pochodzi z Firebase Realtime Database (sciezka /datavault/live) przez Firebase Auth i wspolny loader `shared/firebase-data-loader.js`. Publiczny `data.json` nie jest uzywany jako runtime.
EN: Runtime is loaded from Firebase Realtime Database (`/datavault/live`) through Firebase Auth and shared loader `shared/firebase-data-loader.js`. Public `data.json` is not used as runtime.

# Analiza rozbudowy modułu DataVault — zakładka „Specjalne Frakcji” i porządki zakładek tworzenia postaci

## Prompt użytkownika
> Przeprowadź analizę rozbudowy modułu DataVault.
>
> 1. Przygotuję nowy plik Repozytorium.xlsx
> 2. Dodałem nową zakładkę o nazwie "Specjalne Frakcji".
> 2.1. Zakładka zawiera kolumny LP, Frakcja, Rodzaj, Nazwa, Opis, Efekt
> 2.2. Szerokości, wyrównanie itd. kolumn Nazwa, Opis, Efekt mają być takie same jak w dotychczasowej zakładce "Orcze Klany"
> 2.3. Kolumna LP ma być ukryta (tak jak w innych zakładkach w tym module)
> 2.4. Kolumny Frakcja i Rodzaj ma mieć taką samą szerokość, wyrównanie itpd jak kolumna "Nazwa" w dotychczasowej zakładce "Orcze Klany"
> 2.5. Zachowaj dotychczasowe zasady kolorystyki (np. czerwony font, zasady dotyczące formatowania tekstu str. itd.).
> 3. Chciałbym, żeby ta zakładka była widoczna tylko po zaznaczeniu checkboxa "Czy wyświetlić zakładki dotyczące tworzenia postaci?"
> 4. Usunę zakładki "Ścieżki Asuryani", "Orcze Klany" i "Mutacje Krootów"
>
> Przeprowadź analizę rozszerzenia modułu o taką funkcjonalność.


## Prompt uzupełniający (bieżąca prośba)
> Przeczytaj i rozbuduj analizę Analizy/analiza-rozbudowy-datavault-specjalne-frakcji-2026-04-09.md
> Dopisz tam jakie aktualnie są ustawienia kolumn w zakładce "Orcze Klany".

## Zakres analizy
- Sprawdzono aktualny mechanizm ładowania arkuszy z `Repozytorium.xlsx` do `data.json` i renderu zakładek.
- Sprawdzono obecne zasady ukrywania kolumn technicznych (`LP`) i filtrowania zakładek przez checkbox „tworzenie postaci”.
- Sprawdzono istniejące reguły CSS dla arkusza `Orcze Klany` jako wzorzec dla nowej zakładki.
- Oceniono wpływ usunięcia trzech zakładek na logikę i dokumentację.

## Ustalenia techniczne

1. **Nowy arkusz `Specjalne Frakcji` zostanie wczytany automatycznie przez obecny pipeline importu.**  
   Import iteruje po wszystkich `wb.SheetNames`, więc bez dodatkowych zmian parsera nowa zakładka trafi do `data.json` i UI.

2. **Wymóg ukrycia `LP` jest już spełniany globalnie.**  
   W aplikacji `LP` jest traktowane jako kolumna techniczna (`HIDDEN_COLUMNS` + `isHiddenColumn`), więc nie będzie renderowana w tabeli, ale może nadal służyć do domyślnego porządku sortowania.

3. **Widoczność „tylko po checkboxie tworzenia postaci” jest zgodna z obecną architekturą.**  
   Aktualnie zakładki z `CHARACTER_CREATION_SHEETS` są pokazywane dopiero po zaznaczeniu `#toggleCharacterTabs` (domyślnie odznaczone). Aby nowa zakładka spełniła warunek, trzeba dodać `Specjalne Frakcji` do tego zbioru.

4. **Usunięcie `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów` można osiągnąć dwiema drogami (najlepiej obiema):**
   - **Dane:** usunąć te arkusze z nowego `Repozytorium.xlsx` (wtedy nie trafią do `data.json`).
   - **Kod defensywny:** usunąć je także z `CHARACTER_CREATION_SHEETS`, aby nie było „martwych” odniesień i by logika grupy odpowiadała aktualnej zawartości.

5. **Wymóg szerokości/układu jak `Orcze Klany` wymaga jawnych reguł CSS dla `Specjalne Frakcji`.**  
   Obecnie `Orcze Klany` ma:
   - `Nazwa` → `min-width: 26ch`
   - `Opis` → `min-width: 56ch`
   - `Efekt` → `min-width: 26ch`  
   Dla nowej zakładki należy skopiować te proporcje 1:1.

6. **Kolumny `Frakcja` i `Rodzaj` z wymaganiem „jak `Nazwa` z Orcze Klany” powinny dostać ten sam profil co `Nazwa`, czyli `min-width: 26ch` i domyślne wyrównanie tekstowe.**

7. **Kolorystyka i formatowanie inline („czerwony font”, markerowe style, referencje `str.`) są obsługiwane przez istniejący mechanizm i nie wymagają nowego kodu.**  
   Pipeline XLSX zachowuje markery (`{{RED}}`, `{{B}}`, `{{I}}`), a renderer w JS stosuje je w HTML; mechanika referencji nawiasowych i linii `*[n]` działa globalnie dla treści komórek.


## Aktualne ustawienia kolumn w zakładce „Orcze Klany” (stan bieżący)

Na podstawie bieżącego kodu i danych modułu DataVault:

- **Kolejność kolumn renderowanych w UI:** `Nazwa` → `Opis` → `Efekt` (z `_meta.columnOrder` dla arkusza `Orcze Klany`).
- **Kolumna techniczna `LP`:** obecna w danych wejściowych (`LP`, `Nazwa`, `Opis`, `Efekt`), ale ukryta globalnie przez mechanizm `HIDDEN_COLUMNS` / `isHiddenColumn`.
- **Szerokości minimalne (`min-width`) w CSS dla `Orcze Klany`:**
  - `Nazwa` → `26ch`
  - `Opis` → `56ch`
  - `Efekt` → `26ch`
- **Wyrównanie tekstu:**
  - domyślnie nagłówki i komórki tekstowe są wyrównane do lewej (`.dataTable th { text-align: left; }`),
  - dla powyższych kolumn `Orcze Klany` nie ma lokalnych nadpisań do `center/right`,
  - pierwsza kolumna wyboru (`✓`, dodawana przez UI) ma stałe `8ch` i wyrównanie centralne.
- **Model szerokości:** w `Orcze Klany` użyte są minima (`min-width`), nie stałe `width`, więc przy szerokim viewportcie kolumny mogą wizualnie się rozszerzać ponad wartości minimalne.

## Proponowany projekt implementacji

### A) Zmiany w logice zakładek (`app.js`)
- Dodać `"Specjalne Frakcji"` do `CHARACTER_CREATION_SHEETS`.
- Usunąć z `CHARACTER_CREATION_SHEETS`:
  - `"Ścieżki Asuryani"`
  - `"Orcze Klany"`
  - `"Mutacje Krootów"`
- Pozostawić checkbox `#toggleCharacterTabs` bez zmian semantycznych (domyślnie OFF), bo już realizuje wymagany warunek widoczności.

### B) Zmiany w stylach (`style.css`)
- Dodać nowy blok selektorów dla `table[data-sheet="Specjalne Frakcji"]`:
  - `Frakcja` → jak `Nazwa` z `Orcze Klany` (26ch)
  - `Rodzaj` → jak `Nazwa` z `Orcze Klany` (26ch)
  - `Nazwa` → 26ch
  - `Opis` → 56ch
  - `Efekt` → 26ch
- Nie zmieniać globalnych zmiennych kolorystycznych ani stylu checkboxów (brak potrzeby zmian w `DetaleLayout.md`, o ile nie zmienia się paleta/fonty).

### C) Dane wejściowe (`Repozytorium.xlsx`)
- Utrzymać nagłówki dokładnie jako: `LP`, `Frakcja`, `Rodzaj`, `Nazwa`, `Opis`, `Efekt`.
- Usunąć arkusze: `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów` (zgodnie z założeniem z punktu 4 promptu).
- Zachować formatowanie kolorystyczne komórek w XLSX tam, gdzie ma być czerwony tekst.

### D) Dokumentacja po wdrożeniu (obowiązkowe przy etapie implementacji)
- Zaktualizować:
  - `DataVault/docs/README.md` (instrukcja użytkownika PL/EN),
  - `DataVault/docs/Documentation.md` (opis nowej zakładki, reguł widoczności i mapowania kolumn),
- **Nie** dodawać folderu `Analizy` do żadnych instrukcji/dokumentacji modułu.

## Ryzyka i punkty kontrolne
- **Ryzyko literalnej nazwy arkusza:** `Specjalne Frakcji` musi mieć dokładnie taką pisownię jak w kodzie i CSS.
- **Ryzyko dryfu dokumentacji:** po usunięciu 3 zakładek trzeba zaktualizować wszystkie ich wzmianki w dokumentach modułu.
- **Ryzyko kolejności kolumn:** finalna kolejność może zależeć od nagłówka w XLSX i `_meta.columnOrder`; należy przetestować arkusz po wygenerowaniu `data.json`.

## Checklista wdrożenia (do etapu implementacji)
1. Podmienić `Repozytorium.xlsx` i wygenerować/odświeżyć `data.json`.
2. Uzupełnić `CHARACTER_CREATION_SHEETS` o `Specjalne Frakcji` i usunąć 3 wycofywane arkusze.
3. Dodać reguły CSS szerokości dla nowej zakładki.
4. Zweryfikować:
   - `LP` niewidoczne,
   - zakładka ukryta przy odznaczonym checkboxie,
   - zakładka widoczna po zaznaczeniu checkboxa,
   - kolorystyka i formatowanie `str.` bez regresji.
5. Zaktualizować `DataVault/docs/README.md` i `DataVault/docs/Documentation.md`.

## Wniosek końcowy
Rozszerzenie jest **proste i niskiego ryzyka**, bo opiera się na istniejących mechanizmach modułu (import wszystkich arkuszy, globalne ukrycie `LP`, filtrowanie grup zakładek przez checkbox). Kluczowe są trzy elementy: dopisanie/oczyszczenie listy `CHARACTER_CREATION_SHEETS`, dodanie reguł CSS 1:1 względem `Orcze Klany`, oraz spójna aktualizacja dokumentacji modułu przy właściwej implementacji.

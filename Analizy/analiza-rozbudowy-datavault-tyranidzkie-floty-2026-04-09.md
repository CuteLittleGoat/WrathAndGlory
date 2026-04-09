# Analiza rozbudowy modułu DataVault — zakładka „Tyranidzkie Floty” + widoczność admin

## Prompt użytkownika
> Przeprowadź analizę rozbudowy modułu DataVault.
>
> 1. Przygotuję nowy plik Repozytorium.xlsx
> 2. Dodałem nową zakładkę o nazwie "Tyranidzkie Floty".
> 2.1. Zakładka zawiera kolumny LP, Nazwa, Opis, Efekt
> 2.2. Ich szerokości, wyrównanie itd. mają być takie same jak w zakładce "Orcze Klany"
> 2.3. Zachowaj dotychczasowe zasady kolorystyki (np. czerwony font).
> 3. Chciałbym, żeby ta zakładka była widoczna tylko w widoku admina oraz po zaznaczeniu nowego checkboxa "Czy wyświetlić zakładki dotyczące Słów Kluczowych przeciwników?"
> 3.1. Chciałbym, żeby checkbox był domyślnie odznaczony.
> 3.2. Sam checkbox (wraz z opisem) ma nie być widoczny w widoku użytkownika. Ma być widoczny tylko w widoku admina.
>
> Przeprowadź analizę rozszerzenia modułu o taką funkcjonalność.

## Zakres analizy
- Przeanalizowano aktualne sterowanie widocznością zakładek i trybem admin/user.
- Przeanalizowano import XLSX → `data.json` (także obsługę kolumny `LP`).
- Przeanalizowano reguły stylów tabel i istniejące mapowanie szerokości kolumn.
- Oceniono wpływ nowego warunku widoczności na UX i architekturę modułu.

## Ustalenia techniczne

1. **Nowa zakładka z XLSX będzie wczytywana automatycznie bez zmian parsera.**
   Aktualna logika importu iteruje po wszystkich arkuszach skoroszytu (`wb.SheetNames`) i serializuje je do `sheets[name]`, więc arkusz `Tyranidzkie Floty` trafi do `data.json` automatycznie.

2. **Kolumna `LP` jest już obsłużona jako ukryta globalnie.**
   Kod traktuje `LP` jako kolumnę techniczną (`HIDDEN_COLUMNS = new Set(["lp"])` + `isHiddenColumn`), więc pojawienie się `LP` w nowym arkuszu nie wymaga dodatkowej logiki.

3. **Wymóg „jak Orcze Klany” dla szerokości/układu wymaga dopisania selektorów CSS dla nowej nazwy arkusza.**
   Obecnie dedykowane `min-width` są zdefiniowane literalnie dla `table[data-sheet="Orcze Klany"]` i kolumn `Nazwa/Opis/Efekt`. Bez analogicznych reguł dla `Tyranidzkie Floty` arkusz będzie działał, ale może mieć inny balans szerokości.

4. **Kolorystyka (w tym czerwony font) jest oparta na istniejących markerach formatowania i klasach renderujących.**
   Import XLSX zachowuje znaczniki stylu (`{{RED}}`, `{{B}}`, `{{I}}`), a renderer HTML je interpretuje. To oznacza, że jeśli w nowej zakładce formatowanie czerwonym fontem będzie ustawione w XLSX zgodnie z obecną konwencją, powinno zostać zachowane.

5. **Warunek widoczności „admin + checkbox” jest zgodny z obecną architekturą filtrowania zakładek.**
   Moduł już stosuje wieloetapowe filtrowanie listy zakładek (admin-only, grupy tworzenia postaci, grupy zasad walki), więc dodanie trzeciej grupy (np. „zakładki przeciwników”) jest niskiego ryzyka.

6. **Checkbox domyślnie odznaczony jest naturalnym stanem bieżącej implementacji.**
   Obecne checkboxy startują jako `unchecked` (brak `checked` w HTML), a stan jest odczytywany do `view` przy starcie. Dla nowego checkboxa można utrzymać ten sam wzorzec.

7. **Checkbox widoczny tylko dla admina wymaga jawnego ukrycia sekcji kontrolki poza trybem admin.**
   Aktualnie ukrywana jest grupa `Aktualizuj dane`, ale pozostałe checkboxy nie są globalnie ukrywane dla użytkownika. Dla nowego checkboxa trzeba dodać warunek `ADMIN_MODE` (najprościej przez osobny kontener z `id` i `display:none` w trybie user).

## Proponowany projekt implementacji (plan zmian)

### A) Dane i nazewnictwo
- Dodać stałą grupy, np. `ENEMY_KEYWORD_SHEETS = new Set(["Tyranidzkie Floty"])`.
- (Opcjonalnie przyszłościowo) zamiast jednej nazwy utrzymać listę zakładek „Słów Kluczowych przeciwników”, aby łatwo rozszerzać.

### B) UI (HTML + i18n)
- Dodać nowy checkbox w panelu filtrów:
  - PL: „Czy wyświetlić zakładki dotyczące Słów Kluczowych przeciwników?”
  - EN: „Show tabs related to enemy Keywords?”
- Dodać nowy element do `els` oraz nowy klucz tłumaczeń.
- Domyślnie bez `checked`.
- Umieścić go w kontenerze, który można ukrywać w `!ADMIN_MODE`.

### C) Logika widoczności zakładek
- Rozszerzyć `view` o `showEnemyKeywordTabs: false`.
- W `initUI()` wpiąć dodatkowy filtr:
  - jeśli `!view.showEnemyKeywordTabs`, odfiltrować `ENEMY_KEYWORD_SHEETS`.
- Warunek docelowy dla `Tyranidzkie Floty`:
  - zakładka widoczna tylko gdy `ADMIN_MODE === true` **i** `showEnemyKeywordTabs === true`.

### D) Stylowanie nowej zakładki
- Skopiować reguły CSS z sekcji `Orcze Klany` do `Tyranidzkie Floty` dla kolumn `Nazwa`, `Opis`, `Efekt`.
- Nie dodawać reguł wymuszających inny kolor — utrzymać dotychczasowy pipeline markerów kolorystycznych z XLSX.

### E) Dokumentacja po wdrożeniu (w etapie implementacji)
- Po faktycznej zmianie kodu należałoby zaktualizować:
  - `DataVault/docs/README.md` (instrukcja użytkownika PL/EN),
  - `DataVault/docs/Documentation.md` (opis techniczny, logika filtrów i nowego checkboxa).
- `DetaleLayout.md` aktualizować tylko jeśli finalnie zmienią się globalne zasady layoutu/kolorystyki/fontów.

## Ryzyka i punkty kontrolne
- **Ryzyko nazwy arkusza:** filtr działa po literalnej nazwie; literówka lub inna pisownia w XLSX ukryje/ujawni nie ten arkusz.
- **Ryzyko semantyczne checkboxa:** nazwa sugeruje grupę, ale obecnie obejmuje jedną zakładkę — warto zostawić kod gotowy na kolejne arkusze.
- **Ryzyko UX:** admin może nie zauważyć nowego arkusza, bo checkbox domyślnie jest wyłączony (to jednak jest zgodne z wymaganiem).

## Wniosek końcowy
Rozszerzenie jest **w pełni wykonalne** przy niewielkim zakresie zmian i niskim ryzyku regresji. Najważniejsze elementy to:
1) dodanie nowego przełącznika tylko dla admina,
2) wpięcie dodatkowej grupy filtrowania zakładek,
3) dopisanie analogicznych reguł CSS do `Tyranidzkie Floty`,
4) utrzymanie istniejącego mechanizmu formatowania (w tym czerwonego fontu) przez dane z XLSX.

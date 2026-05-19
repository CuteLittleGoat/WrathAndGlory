# Data analizy
2026-05-19

# Temat analizy
Rozbudowa sekcji „Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne” w pliku `Kalkulator/TworzeniePostaci.html` z 10 pól (2x5) do 20 pól (2x10), z zachowaniem pełnej spójności UI, mechaniki i zachowań formularza.

# Oryginalny pełny prompt użytkownika
Przeprowadź analizę rozbudowy Kalkulator/TworzeniePostaci.html

Chciałbym rozbudować część "Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne"
Obecnie jest 10 pól do wpisania wartości (i kosztu obok).
Dwie kolumny po 5 pól.

Chciałbym rozszerzyć do 20 pól. Dwie kolumny po 10 pól.
Trzeba zadbać, żeby w każdej było takie same formatowanie, funkcje (strzałki w kolumnach "Koszt"), mechanika liczenia, Focus itp.
Przeprowadź pełną analizę rozbudowy.

# Zakres analizy
- Analiza aktualnej struktury HTML sekcji talentów.
- Analiza logiki JavaScript zależnej od liczby pól talentów.
- Analiza wpływu na UX (focus, strzałki w `input[type=number]`, auto-dopasowanie fontu, walidacja, reset, zapis/odczyt).
- Analiza wpływu na model danych i kompatybilność z zapisami Firebase.
- Analiza ryzyk implementacyjnych.
- Rekomendowany plan wdrożenia zmian bez regresji.
- Lista testów manualnych po wdrożeniu.

# Stan aktualny (inwentaryzacja)
## 1) Struktura sekcji talentów w HTML
Aktualnie sekcja talentów jest zbudowana jako jedna tabela z nagłówkiem 4-kolumnowym:
- `Nazwa`, `Koszt`, `Nazwa`, `Koszt`.

Następnie występuje 5 wierszy danych, każdy z dwoma polami tekstowymi (`textarea`) i dwoma polami liczbowymi (`input type="number"`), co łącznie daje:
- 10 pól `talent_name_X` (`talent_name_1` … `talent_name_10`),
- 10 pól `talent_cost_X` (`talent_cost_1` … `talent_cost_10`).

Wizualnie to 2 kolumny wpisów po 5 pozycji.

## 2) Zależności JS od liczby talentów
Liczba `10` jest wpisana „na sztywno” w kilku miejscach logiki:
- `resetAll()` czyści i resetuje talent 1..10.
- `recalcXP()` sumuje koszt talentów 1..10.
- `collectCurrentState()` zapisuje do tablicy `talents` elementy 1..10.

Pozostałe mechaniki (nasłuch zdarzeń, blur/fallback, font-size, odczyt zapisów) są oparte o selektory i powinny objąć nowe pola automatycznie, o ile nowe elementy będą miały ten sam schemat ID/klas.

## 3) Mechaniki UX, które muszą pozostać spójne
- **Strzałki/spinnery**: wynikają z `input type="number"`; nowe pola kosztu muszą mieć ten sam typ i atrybuty `min="0"`.
- **Focus**: globalny styl `input[type="number"]:focus, select:focus, textarea:focus` obejmie nowe elementy automatycznie.
- **Auto-skalowanie fontu**: działa dla `textarea.talent-name`; nowe pola nazwy muszą mieć klasę `talent-name`.
- **Recalc XP**: działa na eventach `input`/`change` dla wszystkich `input`; obejmie nowe koszty, ale pętla sumująca musi uwzględniać 1..20.
- **Domyślna wartość po blur**: selektor `input[id^='talent_cost_']` już obejmuje nowe pola.

## 4) Persistencja/Firebase
Dane aktualnie zapisywane są m.in. w:
- `talents` (tablica 10 elementów budowanych pętlą 1..10),
- `formSnapshot` (wszystkie pola formularza po ID).

Po zwiększeniu do 20:
- nowy kod będzie zapisywał 20 talentów,
- stare zapisy (z 10 talentami) nadal powinny się wczytać poprawnie, bo `applySavedState` bazuje na `formSnapshot` i ustawia tylko istniejące ID.

Wniosek: kompatybilność wsteczna jest wykonalna bez migracji, ale zalecane jest jawne potwierdzenie testami.

# Zakres zmiany funkcjonalnej
## Docelowy układ
- 2 kolumny po 10 pozycji.
- Łącznie 20 pól nazwy + 20 pól kosztu.
- Taki sam styl, wysokość rzędów, spacing, focus, walidacja i zachowania liczników.

## Minimalny zakres kodowy
1. HTML tabeli talentów:
   - dodać kolejne 5 wierszy tabeli (czyli +10 pozycji talentów),
   - zachować konwencję ID: `talent_name_11..20`, `talent_cost_11..20`,
   - zachować klasę `talent-name` i atrybuty `type="number" min="0"`.

2. JavaScript:
   - ujednolicić wszystkie pętle talentów z `<= 10` na `<= 20`.
   - miejsca krytyczne:
     - `resetAll()`
     - `recalcXP()`
     - `collectCurrentState()`

3. (Rekomendacja jakościowa) Refaktor liczby pól do stałej:
   - np. `const TALENT_COUNT = 20;`
   - użycie tej stałej we wszystkich pętlach zmniejszy ryzyko przyszłych niespójności.

# Ryzyka i punkty kontrolne
## Ryzyko 1: Niespójna liczba pętli
Jeśli jeden fragment zostanie na `10`, UI pokaże 20 pól, ale:
- część nie będzie resetowana,
- część kosztów nie wejdzie do sumy XP,
- część nie zapisze się do `talents`.

## Ryzyko 2: Brak klasy/ID w nowych polach
Brak `talent-name` lub złamany wzorzec `talent_cost_X` wyłączy:
- autoskalowanie fontu,
- blur fallback,
- spójne przeliczanie.

## Ryzyko 3: Układ tabeli na mniejszych ekranach
+5 wierszy zwiększa wysokość sekcji. Należy sprawdzić czy:
- nie pojawia się nieczytelne zawijanie,
- scroll strony pozostaje wygodny,
- odstępy między sekcjami są zachowane.

## Ryzyko 4: Stare snapshoty
Przy wczytywaniu starszych danych dodatkowe pola 11..20 pozostaną domyślne (puste/0). To zachowanie poprawne, ale trzeba je potwierdzić w testach.

# Rekomendowany plan wdrożenia (bez zmian funkcjonalnych pobocznych)
1. Dodać 5 nowych wierszy w tabeli talentów (ID 11..20).
2. Wprowadzić stałą `TALENT_COUNT = 20` i podmienić pętle talentowe.
3. Zweryfikować eventy i selektory (powinny działać bez zmian przy poprawnych klasach/ID).
4. Wykonać testy manualne i regresyjne.
5. Zaktualizować dokumentację modułu (`docs/README.md`, `docs/Documentation.md`) dopiero przy właściwej implementacji kodu.

# Scenariusze testowe po implementacji
## A. Układ i formatowanie
- Sprawdzić, że widoczne są dokładnie 2 kolumny po 10 pozycji.
- Sprawdzić focus dla wszystkich `talent_name_1..20` i `talent_cost_1..20`.
- Sprawdzić działanie strzałek (spinnerów) dla wszystkich pól kosztów.

## B. Przeliczanie XP
- Uzupełnić koszt w polach 1, 10, 11, 20 i zweryfikować, że każdy wpływa na `Pozostało PD`.
- Ustawić ujemną wartość ręcznie (jeśli przeglądarka dopuści wpis) i sprawdzić clamp do 0.
- Przekroczyć pulę XP i zweryfikować poprawny komunikat błędu.

## C. Reset i walidacje
- Przetestować reset całego formularza (np. przez zmianę języka z potwierdzeniem), sprawdzić że pola 1..20 wracają do puste/0.
- Sprawdzić `blur`: puste lub nienumeryczne `talent_cost_X` powinno wracać do 0.

## D. Autoskalowanie tekstu
- Wpisać bardzo długi tekst w `talent_name_20` i potwierdzić automatyczne zmniejszanie czcionki jak w polach 1..10.

## E. Zapis/odczyt Firebase
- Zapisać stan z wypełnionymi polami 11..20.
- Wczytać stan i potwierdzić pełne odtworzenie.
- Wczytać starszy stan (bez pól 11..20) i potwierdzić brak błędów oraz domyślne wartości nowych pól.

# Wnioski
1. Rozbudowa z 10 do 20 pól jest niskiego ryzyka, jeśli konsekwentnie zmienione zostaną wszystkie pętle talentowe i zachowany zostanie wzorzec ID/klas.
2. Największe ryzyko to częściowa aktualizacja (UI rozszerzone, ale logika nadal liczy 1..10).
3. Najbezpieczniejsza implementacja to wprowadzenie jednej stałej liczby talentów i użycie jej we wszystkich miejscach logiki.
4. Nie ma potrzeby przebudowy systemu tłumaczeń dla tej zmiany, ponieważ nagłówki sekcji pozostają takie same.

# Rekomendacje
- Wdrożyć zmianę jako mały, atomowy patch ograniczony do:
  - sekcji HTML tabeli talentów,
  - 3 pętli JS związanych z talentami,
  - ewentualnie stałej `TALENT_COUNT`.
- Po wdrożeniu obowiązkowo przejść pełną checklistę testową A–E.
- Przy kolejnym etapie rozważyć dynamiczne generowanie wierszy tabeli z tablicy konfiguracyjnej, aby unikać ręcznego duplikowania HTML.

# Ewentualne następne kroki
1. Wykonanie implementacji kodu 10 -> 20 według planu.
2. Aktualizacja dokumentacji modułu po implementacji.
3. (Opcjonalnie) Refaktor generatora pól talentów do renderowania dynamicznego.

## Zmiany wykonane w kodzie

### Plik: `Kalkulator/TworzeniePostaci.html`

Lokalizacja: sekcja tabeli „Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne” oraz funkcje `resetAll()`, `recalcXP()`, `collectCurrentState()`.

Było:
- Tabela zawierała pola `talent_name_1..10` i `talent_cost_1..10` (2 kolumny po 5 pozycji).
- Pętle w `resetAll()`, `recalcXP()`, `collectCurrentState()` działały w zakresie `i <= 10`.

Jest:
- Tabela zawiera pola `talent_name_1..20` i `talent_cost_1..20` (2 kolumny po 10 pozycji).
- Dodano stałą `TALENT_COUNT = 20` i zastosowano ją w pętlach `resetAll()`, `recalcXP()`, `collectCurrentState()`.

### Plik: `Kalkulator/docs/Documentation.md`

Lokalizacja: sekcja `6.1. Struktura HTML` oraz opis funkcji `resetAll()`.

Było:
- Dokumentacja opisywała 10 par pól talentów.

Jest:
- Dokumentacja opisuje 20 par pól talentów (2 kolumny po 10 pozycji) oraz wskazuje użycie stałej `TALENT_COUNT = 20`.

### Plik: `Kalkulator/docs/README.md`

Lokalizacja: sekcja instrukcji użytkownika PL i EN dla „Tworzenie Postaci / Character Creation”.

Było:
- Brak jawnej informacji o liczbie dostępnych pól talentów.

Jest:
- Dodano informację, że sekcja talentów zawiera 20 pozycji (2 kolumny po 10 wpisów: nazwa + koszt).

### Plik: `Kalkulator/tests/talents-20.test.mjs`

Lokalizacja: nowy plik testowy.

Było:
- Brak automatycznego testu sprawdzającego spójność rozszerzenia talentów do 20 pól.

Jest:
- Dodano test, który sprawdza:
  - obecność zakresu identyfikatorów pól talentów `1..20`,
  - kompletność 20 pól nazw i 20 pól kosztów,
  - obecność stałej `TALENT_COUNT = 20`,
  - użycie pętli opartych o `TALENT_COUNT`.

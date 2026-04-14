# Analiza DataVault — sygnalizacja aktywnych filtrów i napis „FILTR..”

## Prompt użytkownika
> Przeprowadź analizę modułu DataVault. Obecnie nie ma żadnej informacji mówiącej użytkownikowi, że na jakiejś kolumnie jest założony filtr. Zaproponuj jakieś rozwiązanie, które jasno wskaże użytkownikowi, że jest założony filtr.
>
> Dodatkowo sprawdź czy można usunąć napis "FILTR..", który wyświetla się w pierwszej kolumnie - tam gdzie checkboxy do wybrania do porównania. Załączam przykładowe screeny.

## Zakres analizy
Przeanalizowano implementację tabeli i filtrów w module `DataVault`:
- `DataVault/app.js`
- `DataVault/style.css`

## Stan obecny (diagnoza)

1. **Brak wizualnego wskaźnika aktywnego filtra na kolumnie**
   - Filtr tekstowy (`view.filtersText[col]`) i filtr listowy (`view.filtersSet[col]`) działają poprawnie logicznie, ale UI nie oznacza nagłówka/ikony jako „aktywne”.
   - Użytkownik nie widzi, które kolumny ograniczają wyniki, jeśli nie pamięta wpisanego tekstu lub wybranego zestawu wartości.

2. **Napis „FILTR..” w pierwszej kolumnie (kolumna checkboxów)**
   - W drugim wierszu nagłówka (wiersz filtrów) dla pierwszej kolumny (`✓`) ustawiany jest placeholder tekstowy (`columnFilter`), czyli „filtr...” / „filter...”.
   - Kod jest jawnie zdefiniowany i nie jest wymagany do działania filtrowania.
   - Ten element można bezpiecznie usunąć, ponieważ pierwsza kolumna nie posiada żadnego filtra.

## Odpowiedź na pytanie: czy można usunąć napis „FILTR..”?
**Tak — można i warto usunąć.**

To wyłącznie element prezentacyjny w `buildTableSkeleton()` dla `th0f` (pierwsza komórka drugiego wiersza nagłówka). Usunięcie tekstu nie wpływa na logikę filtrów, bo pierwsza kolumna i tak nie ma inputa ani menu filtrów.

## Proponowane rozwiązanie sygnalizacji aktywnych filtrów

### Opcja rekomendowana (najprostsza i czytelna)
Wprowadzić **stan aktywności filtra na poziomie kolumny** i odwzorować go klasami CSS.

#### 1) Definicja aktywnego filtra
Kolumna jest „filtrowana”, jeżeli spełniony jest przynajmniej jeden warunek:
- `view.filtersText[col]` po `trim()` nie jest pusty, **lub**
- `view.filtersSet[col]` jest `Set` i zawiera mniej wartości niż pełna lista `uniqueValuesForColumn(col)`.

#### 2) Wizualne oznaczenie
Dodać klasę np. `.filter-active` do:
- komórki nagłówka kolumny (`thead tr:first-child th[data-col]`),
- przycisku menu filtra (`.filterBtn`) w drugim wierszu.

Sugerowane sygnały wizualne:
- jaśniejsza ramka i tło dla `.filterBtn.filter-active`,
- ikonka/znacznik zamiast „▾” (np. `⏷` + mała kropka `●`),
- subtelny pasek pod nazwą kolumny (`box-shadow` albo `border-bottom` w kolorze `--accent`).

#### 3) Miejsce aktualizacji stanu
Odświeżanie klas wykonywać po:
- `renderBody()` (po każdej zmianie filtra),
- `buildTableSkeleton()` (po zmianie zakładki),
- `applyLanguage()` (jeśli przebudowa/odświeżenie UI ma miejsce),
- `restoreSheetView()` (po przywróceniu stanu z sesji).

### Opcja dodatkowa (UX+)
Dodać nad tabelą krótki pasek typu:
- „Aktywne filtry: Typ (tekst), Rzadkość (3/8 wartości)”
- plus przycisk „Wyczyść wszystkie”.

To rozwiązuje problem „dlaczego nie widzę rekordów” i skraca czas diagnozy dla użytkownika.

## Szacowany wpływ zmian
- **Ryzyko techniczne:** niskie (zmiany głównie prezentacyjne).
- **Wpływ na logikę:** brak zmian algorytmu filtrowania.
- **Korzyść UX:** wysoka — użytkownik od razu wie, które kolumny zawężają wyniki.

## Rekomendacja końcowa
1. Usunąć napis „FILTR..” z pierwszej kolumny w wierszu filtrów.
2. Wdrożyć klasę aktywnego filtra per kolumna (`filter-active`) dla nagłówka i przycisku filtra.
3. (Opcjonalnie) dodać pasek „Aktywne filtry” nad tabelą.

Taki zestaw zmian jest mały implementacyjnie, a jednocześnie bardzo poprawia czytelność stanu filtrów.

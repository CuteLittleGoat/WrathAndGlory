# Analiza: DataVault — formatowanie „Słowa Kluczowe” w tabeli vs oknie porównania

## Prompt użytkownika
> Przeprowadź analizę w module DataVault dotyczącą funkcjonalności porównywania wierszy.  
> W tabeli na liście mam określone specjalne formatowania, np. w kolumnie Słowa Kluczowe przecinek ma być zwykłym kolorem. Tak się wyświetla w tabeli. Jenak w oknie porównania te specjalne formatowanie przestaje działać. Przeprowadź analizę czemu i czy da się to łatwo ujednolicić.

## Zakres analizy
- Moduł: `DataVault`
- Obszar: renderowanie komórek tabeli głównej oraz renderowanie komórek w modalu porównania.

## Wniosek główny
Problem wynika z tego, że tabela główna i okno porównania używają **innych ścieżek renderowania HTML** dla tych samych danych.

- W tabeli głównej dla `Słowa Kluczowe` działa dedykowana logika `formatKeywordHTML(..., { commasNeutral: true })`, która koloruje przecinek neutralnie (`keyword-comma`).
- W modalu porównania ta logika **nie jest używana**; tam komórki lecą przez ogólne `formatTextHTML(...)`, bez podmiany przecinków na neutralne.

To powoduje rozjazd wizualny: przecinki, które w tabeli są neutralne, w porównaniu dziedziczą czerwony styl (np. z markerów inline `{{RED}}`), więc są czerwone.

## Szczegóły techniczne (dlaczego tak się dzieje)

1. **Tabela główna (`renderRow`)** ma warunki specjalne zależne od arkusza i kolumny:
   - `isKeywordCommaNeutral` dla zestawu arkuszy z kolumną `Słowa Kluczowe`.
   - dla tego przypadku używany jest `formatKeywordHTML(r, col, {commasNeutral:true})`.

2. `formatKeywordHTML`:
   - bazuje na `formatTextHTML`,
   - następnie wykonuje `replace(/,/g, '<span class="keyword-comma">,</span>')`,
   - oraz obudowuje tekst klasą `keyword-red`.

3. W CSS klasa `.keyword-comma` wymusza neutralny kolor (`var(--text)`), więc przecinek jest „wyciągnięty” z czerwieni.

4. **Okno porównania (`openCompareModal`)** renderuje komórki bez gałęzi specjalnych dla `Słowa Kluczowe`:
   - dla większości kolumn: `formatTextHTML(v)`
   - dla `Zasięg`: `formatRangeHTML(v)`
   - dla `Cechy`: plain escape

Brakuje w nim analogicznej logiki `isKeywordCommaNeutral` + `formatKeywordHTML(..., commasNeutral:true)`.

## Czy da się to łatwo ujednolicić?
Tak — to jest **łatwe do średnio łatwego** (small refactor).

### Najprostsza poprawka (najszybsza)
W `openCompareModal` dodać warunek dla kolumny `Słowa Kluczowe` i arkuszy z `KEYWORD_SHEETS_COMMA_NEUTRAL`, tak aby używać tego samego formatera co tabela.

Plusy:
- minimalna ingerencja,
- szybki efekt,
- niskie ryzyko.

Minus:
- dalej pozostają 2 miejsca z podobną logiką warunkową (duplikacja „co i jak formatować”).

### Lepsze ujednolicenie (zalecane)
Wydzielić jedną funkcję typu `formatCellForContext(rowOrValue, col, currentSheet, context)` i użyć jej:
- w `renderRow`,
- w `openCompareModal`.

Ta funkcja podejmowałaby spójną decyzję: `Cechy`, `Zasięg`, `Słowa Kluczowe`, `Słowo Kluczowe Frakcji`, itd.

Plusy:
- pełna spójność wizualna między widokami,
- łatwiejsze utrzymanie,
- brak przyszłych rozjazdów.

Minus:
- odrobinę większa zmiana niż szybki hotfix.

## Ocena ryzyka
- Funkcjonalne: niskie.
- Wizualne: niskie (zmiana celowo przywraca zachowanie znane z tabeli).
- Utrzymaniowe: obecnie średnie (duplikacja logiki), po refaktorze niskie.

## Rekomendacja
1. Krótkoterminowo: szybki fix w `openCompareModal`, aby użyć `formatKeywordHTML(..., {commasNeutral:true})` dla odpowiednich kolumn/arkuszy.  
2. Docelowo: wynieść logikę formatowania komórek do wspólnej funkcji i przepiąć oba widoki.

To ujednolicenie jest praktyczne i relatywnie tanie implementacyjnie.

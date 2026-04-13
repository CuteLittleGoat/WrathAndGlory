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

---

## Uzupełnienie po wdrożeniu (2026-04-13): dokładny opis zmian i procedura cofnięcia

### 1) Co dokładnie zmieniono w kodzie (plik `DataVault/app.js`)

Wdrożono rekomendację „lepsze ujednolicenie” (wspólna funkcja formatowania dla tabeli i modala), a nie tylko szybki warunek lokalny w modalu.

#### 1.1 Dodana nowa funkcja: `formatDataCellHTML(row, col, sheetName = currentSheet)`

Dodano funkcję centralizującą wybór ścieżki renderowania dla komórki:

1. **Arkusz `Słowa Kluczowe` + kolumna `Nazwa`**
   - zwraca `formatKeywordHTML(row, col)`  
   - efekt: cała zawartość renderowana w czerwieni (`keyword-red`) tak jak dotychczas w tabeli głównej.

2. **Arkusze z `KEYWORD_SHEETS_COMMA_NEUTRAL` + kolumna `Słowa Kluczowe`**
   - zwraca `formatKeywordHTML(row, col, {commasNeutral:true})`
   - efekt: przecinki zamieniane na `<span class="keyword-comma">,</span>`, czyli kolor neutralny (tak jak dotychczas w tabeli głównej).

3. **Arkusz `Słowa Kluczowe Frakcji` + kolumna `Słowo Kluczowe`**
   - zwraca `formatFactionKeywordHTML(row[col])`
   - efekt: zachowane wszystkie wyjątki i reguły:
     - `-` nie jest czerwone,
     - `lub` nie jest czerwone,
     - `[ŚWIAT-KUŹNIA]` pozostaje pełnym czerwonym słowem kluczowym,
     - kursywa/pogrubienie z markerów inline pozostają.

4. **Fallback dla wszystkich pozostałych przypadków**
   - zwraca `getFormattedCellHTML(row, col)` (czyli pośrednio `formatRangeHTML` dla `Zasięg` albo `formatTextHTML` dla reszty)
   - efekt: zachowane istniejące reguły `(str.)`, `*[n]`, markerów `{{RED}}`, `{{B}}`, `{{I}}`.

#### 1.2 Refactor `renderRow(...)` (tabela główna)

W `renderRow` usunięto lokalny zestaw warunków:
- `isKeywordName`,
- `isKeywordCommaNeutral`,
- `isFactionKeyword`,

i zastąpiono go jednym wywołaniem:
- `div.innerHTML = formatDataCellHTML(r, col, currentSheet)`.

Znaczenie:
- tabela główna nadal renderuje identycznie jak wcześniej (logika ta sama, tylko przeniesiona do wspólnego helpera),
- zmniejszono ryzyko przyszłego rozjazdu z modalem.

#### 1.3 Refactor `openCompareModal(...)` (okno porównania)

W generowaniu komórek modala:
- wcześniej było:
  - `Cechy` -> plain text (`escapeHtml(...)`)
  - `Zasięg` -> `formatRangeHTML(v)`
  - reszta -> `formatTextHTML(v)`  
  (czyli brak reguł specjalnych dla „Słowa Kluczowe”).

- teraz jest:
  - `Cechy` -> nadal plain text (`escapeHtml(...)`) — bez zmiany zachowania,
  - wszystkie inne kolumny -> `formatDataCellHTML(r, col, currentSheet)`.

Znaczenie:
- modal dziedziczy dokładnie te same reguły co tabela główna dla słów kluczowych i formatowania inline,
- obecny i przyszły zestaw reguł (dodanych do wspólnej funkcji) będzie automatycznie działał w obu miejscach.

#### 1.4 Usunięcie duplikatu napisu „PORÓWNANIE” w modalu

W `openModal(title, html)`:
- wcześniej do treści modala doklejany był dodatkowy nagłówek:
  - `<h3 style="margin:0 0 10px 0">PORÓWNANIE</h3>`
- teraz:
  - `els.modalBody.innerHTML = html;` (bez dodatkowego `<h3>`).

Znaczenie:
- pozostaje tylko tytuł z paska modala (`.modalHeader #modalTitle`),
- znika zdublowany, pogrubiony napis „PORÓWNANIE” zaznaczony na screenie.

### 2) Dlaczego to podejście jest bezpieczniejsze niż lokalny hotfix

Zamiast duplikować warunki w `openCompareModal`, została wdrożona centralizacja:
- **jedno źródło prawdy** dla reguł renderowania komórki (`formatDataCellHTML`),
- mniej punktów awarii przy kolejnych zmianach stylu/formatowania,
- mniejsze ryzyko, że nowe wyjątki będą dodane tylko w tabeli głównej albo tylko w modalu.

### 3) Instrukcja cofnięcia zmian (rollback) — krok po kroku

Jeżeli po wdrożeniu wystąpi regresja i trzeba szybko wrócić:

#### Opcja A (pełny rollback commitem)
1. Zidentyfikować commit wdrażający tę zmianę (`git log --oneline`).
2. Wykonać:
   - `git revert <hash_commita>`
3. Sprawdzić UI (tabela + modal) i wypchnąć revert.

To przywróci cały stan sprzed ujednolicenia.

#### Opcja B (rollback ręczny tylko dla porównania)
1. W `openCompareModal(...)` przywrócić mapowanie komórek do starej postaci:
   - `Cechy` -> `escapeHtml(String(v||""))`
   - `Zasięg` -> `formatRangeHTML(v)`
   - pozostałe -> `formatTextHTML(v)`.
2. Zostawić lub usunąć `formatDataCellHTML` zależnie od potrzeb:
   - jeśli zostaje używane tylko przez `renderRow`, UI główne nie ucierpi.

To cofnie tylko zmianę działania modala.

#### Opcja C (rollback tylko usunięcia duplikatu nagłówka)
1. W `openModal(title, html)` przywrócić:
   - `els.modalBody.innerHTML = \`<h3 style="margin:0 0 10px 0">${escapeHtml(title)}</h3>${html}\`;`
2. Nie zmieniać pozostałych refaktorów.

To przywróci drugi napis „PORÓWNANIE”, bez ruszania formatowania komórek.

### 4) Kontrola po rollbacku lub po re-wdrożeniu

Checklist ręczny:
1. Arkusz z neutralnymi przecinkami (np. `Bestiariusz`) -> w tabeli i modalu przecinki neutralne.
2. `Słowa Kluczowe Frakcji` -> `-` i `lub` neutralne, `[ŚWIAT-KUŹNIA]` czerwony, zgodność tabela vs modal.
3. Przypadki z `(str.)` i `*[n]` -> identyczny wygląd tabela vs modal.
4. W modalu widoczny tylko jeden napis „Porównanie” (w nagłówku, bez drugiego pogrubionego w body).

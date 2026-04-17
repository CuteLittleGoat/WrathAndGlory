# Analiza DataVault — przekreślenie tekstu z `Repozytorium.xlsx`

## Prompt użytkownika
> Przeprowadź analizę modułu DataVault.
> W pliku "Repozytorium.xlsx" mam część tekstu przekreślone. W aplikacji to się wyświetla jako normalny tekst. Załączam dwa screeny. Sprawdź jak to wygląda w data.json i czy wprowadzenie przekreślenia w aplikacji jest skomplikowane.

## Zakres i wynik analizy
- Problem został potwierdzony: przekreślenie istnieje w `Repozytorium.xlsx`, ale nie jest przenoszone do warstwy markerów i renderingu w DataVault.
- W `data.json` tekst jest zapisany bez informacji o przekreśleniu (brak dedykowanych markerów), dlatego UI wyświetla go jako zwykły tekst.

## Co dokładnie jest w `Repozytorium.xlsx`
W `xl/sharedStrings.xml` (wewnątrz `Repozytorium.xlsx`) fragment:
- `Czysta genealogia Primaris Astartes zapewnia...`
ma run z `rPr` zawierającym tag `<strike/>`.

To znaczy, że źródło XLSX poprawnie przechowuje przekreślenie na poziomie rich text.

## Co dokładnie jest w `data.json`
W `DataVault/data.json` (arkusz „Zakony Pierwszego Powołania”, pole `Efekt`) ten sam fragment jest zwykłym tekstem, a markerowo występuje tylko kolor czerwony dla `[ZAKON]` (`{{RED}}...{{/RED}}`).

Wniosek: pipeline eksportu do `data.json` nie serializuje stylu strike.

## Dlaczego DataVault „gubi” przekreślenie
Obecny pipeline wspiera wyłącznie markery:
- `{{RED}}...{{/RED}}`
- `{{B}}...{{/B}}`
- `{{I}}...{{/I}}`

Brakuje odpowiednika dla strike na każdym etapie:
1. **Parser XLSX (Python)** `build_json.py`: mapuje tylko red/bold/italic.
2. **Parser kanoniczny (JS)** `xlsxCanonicalParser.js`: mapuje tylko red/bold/italic.
3. **Parser HTML komórki (UI/admin)** `htmlToStyleMarkers()` w `app.js`: mapuje tylko red/bold/italic.
4. **Renderer** `parseInlineSegments()`/`formatInlineHTML()` w `app.js`: rozpoznaje tylko RED/B/I.
5. **CSS**: brak klasy typu `.inline-strike` z `text-decoration: line-through`.
6. **Czyszczenie markerów** (np. etykiety filtrów): regexy usuwają tylko RED/B/I.

## Czy wdrożenie przekreślenia jest skomplikowane?
**Ocena: niska do średniej złożoności (raczej „nieskomplikowane”, ale wielomiejscowe).**

### Szacowany zakres zmian
Trzeba dodać 1 nowy styl markerowy end-to-end, np. `{{S}}...{{/S}}`:
- `build_json.py` — wykrycie `<strike/>` w rich text + serializacja do `{{S}}`.
- `xlsxCanonicalParser.js` — analogicznie po stronie przeglądarki.
- `app.js`:
  - `htmlToStyleMarkers()` — wykrywanie `<s>`, `<strike>`, `<del>` oraz stylu `text-decoration`.
  - `parseInlineSegments()` — rozszerzenie regexu o `S`.
  - render klas w `formatInlineHTML()` / `formatFactionKeywordHTML()`.
  - funkcje strip/clean markerów dla filtrów.
- `style.css` — nowa klasa `.inline-strike { text-decoration: line-through; }`.
- `docs` DataVault i (opcjonalnie, zależnie od użycia współdzielonych danych) modułów konsumujących te markery.

### Ryzyko integracyjne
- `data.json` jest współdzielony między modułami (co najmniej DataVault i GeneratorNPC), więc jeśli zostanie dodany nowy marker `{{S}}`, moduły, które go nie znają, mogą pokazywać surowy marker albo ignorować formatowanie.
- Dlatego bezpieczne wdrożenie powinno objąć wszystkie konsumujące moduły jednocześnie (albo zapewnić kompatybilne fallbacki).

## Konkluzja
- Obecna różnica między XLSX a UI wynika z braku obsługi strike w pipeline markerów.
- Samo dodanie wsparcia nie jest trudne algorytmicznie, ale wymaga spójnej, skoordynowanej zmiany w kilku plikach i potencjalnie w więcej niż jednym module, jeśli używają wspólnego `data.json`.


---

## Uzupełnienie analizy — nowe wymagania (2026-04-17)

## Prompt użytkownika (uzupełnienie)
> Przeczytaj analizę Analizy/2026-04-16_DataVault_analiza_przekreslenia_repozytorium.md
>
> Następnie dopisz do niej nowe wymagania.
>
> 1. Dodałem nową kolumnę do pliku "Repozytorium". W zakładce "Bestiariusz" dodałem kolumnę "Typ". Ma ona mieć parametry (wyrównanie, szerokość, łamanie itd.) jak kolumna "Typ" w zakładce "Bronie".
> 1.1. Trzeba będzie zaktualizować plik Kolumny.md
>
> 2. Dodałem nową kolumnę do pliku "Repozytorium". W zakładce "Bestiariusz" dodałem kolumnę "Status". Ma ona być domyślnie ukryta. Jeżeli w kolumnie będzie wpisana wartość "old" to font w danym wierszu musi być na jasno-szary kolor (nowy kolor)
> 2.1. Trzeba będzie dodać nowy kolor do DetaleLayout.md
> 2.2. Zasady dotyczące czerwonego koloru są nadrzędne. Czyli treść będzie szara (w tym przecinki w kolumnie "Słowa Kluczowe") zamiast zielona, ale czerwony kolor zostaje jak jest.
>
> 3. Trzeba będzie dodać obsługę przekreślenia.
> 3.1. Treść przekreślona w pliku "Repozytorium.xlsx" w aplikacji ma się wyświetlać jako przekreślona i z szarym kolorem (punkt 2.1.)
> 3.2. Jeżeli przekreślona treść zawiera pogrubienia, pochylenia itp. to też musi to być widoczne w aplikacji
> 3.3. Jeżeli przekreślona treść zawiera czerwony kolor, to nie zostaje on zmieniony na szary (podobnie jak w punkcie 2.2.).
>
> 4. Niezależnie od tego czy nowy plik data.json powstaje poprzez przycisk w widoku admina, czy poprzez skrypt asystenta AI plik, który powstaje musi być identyczny.
>
> Dodatkowa modyfikacja modułu GeneratorNPC
>
> 5. Załączam dwa screeny z modułu. Wybór potwora z LP=48 i LP=47
> Jest wyraźna różnica w szerokości kolumny "Klucz".
> Sprawdź czemu. Podobny rozjazd występuje też w innych wpisach, ale tych jest najwyraźniejszy. Wartością oczekiwaną jest, żeby kolumna "Klucz" miała taką samą szerokość jak przy wpisie z LP=2 (załączam screena).
>
> 6. Jeżeli wybierze się wpis, który w kolumnie "Status" (punkt 2.) będzie miał wartość "old" to LP, Nazwa i Typ (punkt 1.) będą musiały wyświetlać się w szarym foncie (punkt 2.1.)
> 6.1. W widoku w "Podgląd bazowy" w kolumnie "Klucz" nie wyświetlaj "Status".
>
> 7. Zmiany te nie mają w żaden sposób wpływać na wygenerowaną kartę poprzez przycisk "Generuj Kartę".
>
> Nie wprowadzaj zmian w kodzie. Przygotuj tylko pełną analizę wprowadzenia tych funkcjonalności.

## Cel biznesowy doprecyzowany po uzupełnieniu
- `Repozytorium.xlsx` staje się źródłem prawdy także dla semantyki „archiwalności” rekordu (`Status=old`) i strike.
- W warstwie UI trzeba zachować hierarchię kolorów: **czerwony ma absolutny priorytet**, szary jest „kolorem bazowym” tylko dla treści nieczerwonej.
- Zmiany dotyczą równolegle DataVault (przeglądarka danych) i GeneratorNPC (konsument danych), ale bez wpływu na generator karty.

## Analiza wymagań 1–4 (DataVault + pipeline danych)

### 1) Nowa kolumna `Typ` w `Bestiariusz` (jak `Typ` w `Bronie`)
**Wnioski implementacyjne:**
- Dane: kolumna przejdzie automatycznie przez loader XLSX → `data.json` (kolumny nie są na sztywno wyliczane globalnie).
- UX/DataVault: trzeba dopisać regułę kolumnową dla `Bestiariusz.Typ` (min-width, zawijanie, alignment) analogiczną do już istniejącej reguły dla `Bronie.Typ`.
- Dokumentacja: aktualizacja `Kolumny.md` obowiązkowa (zgodnie z wymaganiem).

**Ryzyko:**
- Jeżeli `Typ` nie będzie dodany do reguł layoutu, kolumna zostanie wyrenderowana „generycznie”, co da inny wygląd niż w `Bronie`.

### 2) Nowa kolumna `Status` + logika `old`
**Wnioski implementacyjne:**
- `Status` ma być kolumną techniczną: 
  - dostępna do logiki,
  - domyślnie ukryta w tabeli DataVault,
  - niewidoczna jako „Klucz” w podglądzie bazowym GeneratorNPC.
- Warunek kolorowania: jeśli `Status` (po trim/lowercase) = `old`, to bazowy kolor tekstu rekordu ma przejść na nowy jasno‑szary token kolorystyczny.
- Priorytet kolorów:
  1. czerwony (`RED`) — najwyższy,
  2. szary „old” — tylko dla treści nieoznaczonych na czerwono,
  3. standardowa zieleń — gdy rekord nie jest `old`.
- Dotyczy to również przecinków w „Słowa Kluczowe”: przy `old` mają być szare, chyba że konkretny fragment jest czerwony.

**Ryzyko:**
- Bez centralnego resolvera priorytetu stylów łatwo o niespójność między rendererami (DataVault vs GeneratorNPC).

### 3) Strike (`<strike/>` z XLSX) + kolorowanie szare/czerwone
**Wnioski implementacyjne:**
- Potwierdzony wcześniej brak obsługi strike trzeba rozszerzyć o nowy marker (np. `{{S}}...{{/S}}`) i pełny rendering end-to-end.
- Zasada łączenia stylów: strike nie wycina innych stylów — ma współistnieć z `B`, `I`, `RED`.
- Przy `old` + strike:
  - tekst ma być przekreślony,
  - bazowo szary,
  - czerwone segmenty pozostają czerwone.

**Ryzyko:**
- Największe przy zagnieżdżeniu markerów i kolejności domknięć (musi być deterministyczna i zgodna w Python/JS).

### 4) Identyczny `data.json` z dwóch ścieżek (admin button vs AI script)
**Wnioski implementacyjne:**
- Wymaganie oznacza **bit‑to‑bit parity** wyniku (nie tylko logiczną równoważność).
- Do zapewnienia:
  - taki sam porządek arkuszy i kolumn,
  - identyczne reguły trim/whitespace,
  - identyczna kolejność i składanie markerów (`RED/B/I/S`),
  - identyczne `json.dumps/JSON.stringify` (indent, końcowe newline, kolejność pól).
- Najbezpieczniejszy model: jeden „kanoniczny” parser + test porównawczy, który odpala obie ścieżki i robi diff plików.

**Ryzyko:**
- Nawet drobna różnica (np. spacje, kolejność kluczy) złamie to wymaganie.

## Analiza wymagań 5–7 (GeneratorNPC)

### 5) Dlaczego szerokość kolumny „Klucz” różni się między LP=48 i LP=47
**Diagnoza:**
- Tabela „Podgląd bazowy” działa w domyślnym algorytmie `table-layout: auto`.
- Przy takim układzie przeglądarka dynamicznie przelicza szerokości kolumn na podstawie zawartości wszystkich komórek bieżącego rekordu.
- Ponieważ rekordy różnią się długością treści w kolumnie „Wartość” (np. długie „Umiejętności”, „Premie”, „Zdolności”), zmienia się podział szerokości między „Klucz” i „Wartość”.
- Efekt: „rozjazd” jest oczekiwanym skutkiem obecnego layoutu, a nie błędem danych.

**Wartość docelowa z wymagania:**
- Kolumna „Klucz” ma mieć stałą szerokość referencyjną jak na przykładzie LP=2 (czyli nie może już zależeć od długości wartości w drugim słupku).

**Kierunek rozwiązania:**
- Ustalenie stałej szerokości pierwszej kolumny (np. poprzez `colgroup`/`th:nth-child(1)` + `width/min/max`) i ograniczenie wpływu treści drugiej kolumny.
- Dodatkowo doprecyzowanie zawijania i overflow w kolumnie „Wartość”, żeby nie wypychała geometrii tabeli.

### 6) `Status=old` w podglądzie bazowym
**Wnioski implementacyjne:**
- Dla wpisów `old` tylko pola `LP`, `Nazwa`, `Typ` mają być jawnie wyszarzone w podglądzie bazowym (zgodnie z wymaganiem punktu 6).
- Pole `Status` nie powinno być renderowane jako osobny „Klucz” w tym widoku.
- Logika powinna bazować na normalizacji wartości statusu (`trim + lowercase`) dla odporności na warianty zapisu (`OLD`, ` old `).

### 7) Brak wpływu na „Generuj Kartę”
**Wnioski implementacyjne:**
- Trzeba utrzymać izolację: zmiany dla `Status/Typ/strike` dotyczą wyświetlania danych i podglądu bazowego, ale nie modyfikują payloadu przekazywanego do generatora karty.
- Szczególnie: `Status` nie powinien pojawić się na karcie ani pośrednio zmienić mapowania sekcji, trackerów i formatowania wydruku.

## Spójny plan wdrożenia (proponowana kolejność)
1. **Pipeline markerów**: dodać `S` (strike) jednocześnie w parserze Python i parserze kanonicznym JS.
2. **Renderer DataVault i GeneratorNPC**: dodać klasę strike + resolver priorytetu kolorów (RED > OLD_GRAY > default).
3. **Status old**: logika wykrywania, domyślne ukrycie `Status`, selektywne szarzenie pól `LP/Nazwa/Typ` w GeneratorNPC.
4. **Layout kolumn**: ustabilizować szerokość „Klucz” w podglądzie bazowym GeneratorNPC.
5. **Parzystość eksportów**: test automatyczny porównujący pliki z obu ścieżek generacji `data.json`.
6. **Dokumentacja**: zaktualizować `Kolumny.md`, `DetaleLayout.md` i dokumentacje modułowe (po wdrożeniu kodu).

## Kryteria akceptacyjne (DoD)
- `Bestiariusz.Typ` ma takie same parametry wizualne jak `Bronie.Typ`.
- `Bestiariusz.Status` jest domyślnie ukryte.
- Dla `Status=old`:
  - rekord (lub wskazane pola, wg widoku) jest jasno‑szary,
  - czerwone fragmenty pozostają czerwone,
  - przecinki w „Słowa Kluczowe” są szare (jeśli nie są czerwonym segmentem).
- Strike z XLSX renderuje się jako strike w UI, razem z B/I/RED.
- `data.json` wygenerowany przez admin i przez skrypt AI jest identyczny bajt‑w‑bajt.
- W GeneratorNPC kolumna „Klucz” ma stałą szerokość niezależnie od wybranego LP.
- „Generuj Kartę” działa bez regresji i bez ekspozycji pola `Status`.

## Szacowanie złożoności
- **Średnia**: funkcjonalnie niewielkie elementy, ale przekrojowo obejmują parsery, renderery, CSS, logikę kolumn i testy zgodności eksportu.
- Najbardziej wrażliwe obszary: kolejność/nesting markerów i kompatybilność między modułami współdzielącymi `data.json`.

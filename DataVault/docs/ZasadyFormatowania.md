# 🇵🇱 Zasady formatowania tekstu — DataVault (PL)

## Cel dokumentu

Ten plik jest specjalistycznym dokumentem technicznym modułu `DataVault`.

Opisuje wyłącznie zasady formatowania tekstu stosowane przy:

- przygotowywaniu danych źródłowych w `Repozytorium.xlsx`,
- generowaniu `data.json` i `firebase-import.json`,
- interpretowaniu markerów formatowania w aplikacji,
- renderowaniu komórek tabel w interfejsie DataVault.

Pełna dokumentacja architektury, Firebase, ładowania danych, filtrowania, sortowania i UI znajduje się w:

```text
DataVault/docs/Documentation.md
```

## Zakres

Dokument obejmuje:

- markery inline,
- rich text z XLSX,
- czerwony tekst,
- pogrubienie,
- kursywę,
- przekreślenie,
- referencje stron,
- linie specjalne `*[n]`,
- formatowanie słów kluczowych,
- formatowanie zasięgu,
- scalanie cech,
- styl wpisów archiwalnych,
- klasy CSS używane przez formatowanie.

Dokument nie opisuje konfiguracji Firebase, reguł Firebase, procesu logowania, pełnej struktury wszystkich arkuszy ani obsługi filtrów i sortowania poza wpływem na prezentację tekstu.

## Główne źródła formatowania

Formatowanie pochodzi z dwóch miejsc:

1. z pliku źródłowego `Repozytorium.xlsx`,
2. z reguł renderowania zapisanych w kodzie `DataVault`.

W XLSX można stosować style rich text, na przykład czerwony kolor, pogrubienie, kursywę i przekreślenie. Parser kanoniczny przenosi je do danych jako markery tekstowe.

W aplikacji markery są interpretowane i zamieniane na klasy CSS.

## Pipeline formatowania

Kolejność jest ważna.

1. `xlsxCanonicalParser.js` czyta `Repozytorium.xlsx`.
2. Parser odczytuje `sharedStrings.xml`, `styles.xml` i arkusze XLSX.
3. Rich text z XLSX zostaje zamieniony na markery inline, na przykład `{{RED}}...{{/RED}}`.
4. Dane są zapisywane do struktury `sheets`.
5. `DataVault/app.js` wczytuje dane z Firebase albo z wygenerowanego pliku.
6. Przy renderowaniu komórki aplikacja wybiera funkcję formatowania zależnie od arkusza i kolumny.
7. `formatTextHTML`, `formatInlineHTML`, `formatKeywordHTML`, `formatFactionKeywordHTML` albo `formatRangeHTML` zwracają HTML.
8. CSS nadaje finalny wygląd klasom, takim jak `.inline-red`, `.keyword-red`, `.ref` i `.slash`.

## Markery inline

Obsługiwane markery:

| Marker | Efekt | Klasa CSS |
| --- | --- | --- |
| `{{RED}}...{{/RED}}` | Czerwony tekst | `.inline-red` |
| `{{B}}...{{/B}}` | Pogrubienie | `.inline-bold` |
| `{{I}}...{{/I}}` | Kursywa | `.inline-italic` |
| `{{S}}...{{/S}}` | Przekreślenie | `.inline-strike` |

Przykład:

```text
Zwykły tekst {{RED}}tekst czerwony{{/RED}} dalej zwykły tekst.
```

Przykład złożony:

```text
{{RED}}{{B}}ważny czerwony pogrubiony tekst{{/B}}{{/RED}}
```

## Zagnieżdżanie markerów

Markery mogą być zagnieżdżane.

Parser `parseInlineSegments` działa stosowo. Oznacza to, że:

- zapamiętuje otwarte style,
- przypisuje aktywne style do segmentów tekstu,
- pozwala segmentowi otrzymać kilka klas jednocześnie.

Przykład:

```text
{{RED}}czerwony {{B}}czerwony i pogrubiony{{/B}} czerwony{{/RED}}
```

Wynik:

- pierwszy fragment ma `.inline-red`,
- środkowy fragment ma `.inline-red inline-bold`,
- ostatni fragment ma `.inline-red`.

## Nieprawidłowe albo niedomknięte markery

Parser nie przerywa działania aplikacji przy prostych błędach markerów.

Zalecenie dla danych źródłowych:

- zawsze domykaj marker,
- nie przestawiaj kolejności zamykania,
- unikaj ręcznego wpisywania markerów w XLSX, jeżeli możesz użyć rich text,
- po zmianach sprawdzaj wynik w DataVault.

## Rich text z XLSX

Parser kanoniczny rozpoznaje style rich text w `Repozytorium.xlsx`.

Obsługiwane style runów:

| Styl w XLSX | Marker w danych |
| --- | --- |
| czerwony kolor fontu | `{{RED}}...{{/RED}}` |
| pogrubienie | `{{B}}...{{/B}}` |
| kursywa | `{{I}}...{{/I}}` |
| przekreślenie | `{{S}}...{{/S}}` |

Jeżeli komórka nie ma runów rich text, ale ma czerwony styl fontu na poziomie komórki, parser opakowuje wartość markerem `{{RED}}` według tych samych reguł co fragmenty rich text.

### Entery nigdy nie trafiają między znaczniki

Generator danych (`xlsxCanonicalParser.js` w przeglądarce i `build_json.py`, oba identycznie) zapisuje znaczniki tak, aby **żadna para znaczników nie obejmowała entera**:

- fragment bez entera dostaje jedną parę znaczników w całości, razem ze spacjami w środku i na brzegach (np. `{{B}}bagnet: {{/B}}`);
- fragment z enterami jest dzielony na linie i **każda niepusta linia dostaje własną parę znaczników**;
- entery oraz spacje i tabulatory stykające się z enterem zostają poza znacznikami;
- linia pusta albo z samych spacji zostaje bez znaczników;
- fragment złożony wyłącznie z enterów i spacji dostaje pustą parę znaczników przed tekstem (np. `{{B}}{{/B}}\n`), która niczego nie wyświetla.

Przykłady (⏎ oznacza enter w komórce; kolumna „Zapis fragmentu” pokazuje fragment stojący w środku komórki — cała wartość komórki jest potem przycinana, więc entery na samym początku albo końcu komórki zwykle znikają tak samo jak w zwykłym tekście; wyjątki opisuje `Documentation.md`, rozdział „Owijanie tekstu znacznikami”):

| Fragment w Excelu | Styl | Zapis fragmentu |
| --- | --- | --- |
| `ANIHILACJA: Protokoły ożywienia` | pogrubienie | `{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` |
| `⏎ANIHILACJA: Protokoły ożywienia` | pogrubienie | `\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` |
| `ANIHILACJA: Protokoły ożywienia⏎` | pogrubienie | `{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\n` |
| `lub⏎` | kursywa | `{{I}}lub{{/I}}\n` |
| `⏎[dane utajnione]⏎⏎` | kursywa | `\n{{I}}[dane utajnione]{{/I}}\n\n` |
| `Linia pierwsza⏎Linia druga` | pogrubienie | `{{B}}Linia pierwsza{{/B}}\n{{B}}Linia druga{{/B}}` |

Dzięki temu:

- formatowanie zaczynające się w Excelu **od litery** i **od entera** daje dokładnie ten sam zapis i ten sam wygląd (np. pogrubiony nagłówek zdolności w nowej linii);
- formatowanie obejmujące kilka linii wyświetla się w każdej z nich — w tabeli DataVault, w tabeli GeneratorNPC i na karcie GeneratorNPC;
- owijanie znacznikami nie zmienia widocznego tekstu — zmienia się tylko położenie znaczników (przycięcie i zamiana cudzysłowów działają na całą wartość komórki, zob. „Normalizacja tekstu z XLSX”; entery i spacje przy nich na brzegach komórki leżą poza znacznikami, więc przycięcie usuwa je jak w tekście bez formatowania — z wyjątkiem miejsc, które od brzegu komórki oddziela już znacznik, np. komórki zaczynającej się od pogrubionego samego entera albo spacji na początku pogrubionego pierwszego fragmentu).

Szczegóły techniczne reguł: `DataVault/docs/Documentation.md`, rozdział „Kanoniczny parser XLSX” → „Owijanie tekstu znacznikami”.

## Rozpoznawanie czerwonego koloru

Parser traktuje jako czerwone między innymi wartości:

- `FF0000`,
- `00FF0000`,
- `FFFF0000`,
- wartości RGB kończące się na `FF0000`.

W praktyce najbezpieczniej używać standardowego czerwonego koloru fontu w Excelu.

## Normalizacja tekstu z XLSX

Parser:

- zamienia polskie cudzysłowy `„` i `”` na `"`,
- przycina nagłówki i wartości,
- usuwa nadmiarowe spacje w nagłówkach,
- pomija kolumnę `Lp`,
- potrafi scalać specjalne kolumny, takie jak `Zasięg N` i `Cecha N`.

## Referencje stron

Aplikacja rozpoznaje referencje stron zapisane w nawiasach.

Fragment w nawiasach dostaje klasę `.ref`, jeżeli zawiera jeden z tokenów:

- `str`,
- `str.`,
- `strona`,
- `page`,
- `p.`.

Przykłady:

```text
(str. 123)
(STR 88)
(zob. strona 45)
(page 77)
(p. 13)
```

Referencje mogą wystąpić wewnątrz tekstu z markerami inline. Wtedy klasa `.ref` jest łączona z aktywnymi klasami stylów.

## Linie specjalne `*[n]`

Linia pasująca do wzorca:

```text
*[liczba] treść
```

jest renderowana jako `.caretref`.

Zasady:

- gwiazdka i numer pozostają widoczne,
- reguła działa osobno dla każdej linii,
- linia otrzymuje jaśniejszy albo pomocniczy styl zależny od CSS,
- wzorzec musi zaczynać linię: jeżeli jakiekolwiek formatowanie (pogrubienie, kursywa, przekreślenie, kolor) obejmuje którykolwiek znak `*[n]`, w tym fragmencie stoi znacznik i linia nie jest rozpoznawana jako `*[n]`; dotyczy to także kolejnych linii jednego zaznaczenia obejmującego kilka linii, bo każda z nich zaczyna się od własnego znacznika — nie formatuj początku linii `*[n]`.

## Zachowanie podziałów linii

`formatTextHTML` dzieli tekst po `\r?\n` (enter, także w zapisie Windows `\r\n`).

Każda linia jest formatowana osobno, a następnie łączona przez:

```html
<br>
```

Dzięki temu wieloliniowe komórki zachowują czytelny układ w tabeli.

Każda linia jest formatowana od zera: styl otwarty w jednej linii nie przechodzi do następnej. Tak samo działa `formatFactionKeywordHTML` w arkuszu `Słowa Kluczowe Frakcji`, tabela GeneratorNPC oraz sekcja karty GeneratorNPC bez pasków (`Umiejętności`). W pozostałych sekcjach karty GeneratorNPC od zera formatowany jest każdy pasek (pasek powstaje z jednej albo kilku połączonych linii), więc styl nie przechodzi z jednego paska do następnego. Formatowanie z Excela wyświetla się poprawnie we wszystkich tych widokach, bo generator danych zapisuje w każdej linii komplet znaczników (zob. „Entery nigdy nie trafiają między znaczniki”).

Wyjątek stanowią znaczniki wpisane w komórce ręcznie jako zwykły tekst: jeżeli `{{B}}` stoi w jednej linii, a `{{/B}}` w następnej, w tabelach i w sekcji `Umiejętności` karty pogrubiona będzie tylko linia ze znacznikiem otwierającym, a w sekcjach karty z paskami obie linie będą pogrubione tylko wtedy, gdy trafią do tego samego paska.

## Formatowanie słów kluczowych — arkusz `Słowa Kluczowe`

W arkuszu `Słowa Kluczowe` kolumna `Nazwa` jest renderowana jako w pełni czerwona.

Aplikacja używa do tego globalnego wrappera `.keyword-red`.

## Formatowanie słów kluczowych — arkusze z neutralnymi przecinkami

Dla wybranych arkuszy kolumna `Słowa Kluczowe` jest renderowana tak, że:

- słowa kluczowe są czerwone,
- przecinki zachowują kolor bazowy.

Arkusze objęte tą regułą:

- `Bestiariusz`,
- `Archetypy`,
- `Psionika`,
- `Augumentacje`,
- `Ekwipunek`,
- `Pancerze`,
- `Bronie`,
- `Pakiety Wyniesienia`,
- `Pojazdy`,
- `Bronie Pojazdów`,
- `Ekwipunek Pojazdów`.

Technicznie przecinek jest zastępowany przez:

```html
<span class="keyword-comma">,</span>
```

## Wyjątek: `Pakiety Wyniesienia`

Mimo że `Pakiety Wyniesienia` znajduje się w zbiorze arkuszy z neutralnymi przecinkami, aplikacja ma nadrzędny wyjątek dla `Pakiety Wyniesienia / Słowa Kluczowe`.

Ta kolumna:

- nie dostaje automatycznego globalnego wrappera `.keyword-red`,
- jest renderowana przez zwykłe `getFormattedCellHTML`,
- zachowuje czerwony kolor tylko wtedy, gdy pochodzi on z markerów inline przeniesionych z XLSX.

Oznacza to, że w tym arkuszu kolor czerwony trzeba nadać bezpośrednio w danych źródłowych, jeżeli ma być widoczny.

## `Słowa Kluczowe Frakcji`

W arkuszu `Słowa Kluczowe Frakcji` kolumna `Słowo Kluczowe` ma osobną tokenizację w `formatFactionKeywordHTML`.

Zasady:

1. Domyślnie tekst jest czerwony.
2. Token `-` jest neutralny.
3. Słowo `lub` jest neutralne niezależnie od wielkości liter.
4. Token `[ŚWIAT-KUŹNIA]` jest wyjątkiem nadrzędnym i zawsze pozostaje czerwony.
5. Style `{{B}}` i `{{I}}` są zachowywane.

Przykład:

```text
IMPERIUM - ADEPTUS MECHANICUS lub [ŚWIAT-KUŹNIA]
```

Efekt:

- `IMPERIUM`, `ADEPTUS MECHANICUS` i `[ŚWIAT-KUŹNIA]` są czerwone,
- `-` i `lub` są neutralne.

## Kolumna `Zasięg`

Kolumna `Zasięg` ma osobną funkcję `formatRangeHTML`.

Tekst jest dzielony po znaku `/`. Separator jest renderowany jako:

```html
<span class="slash">/</span>
```

Dzięki temu separator może mieć osobny kolor w CSS.

## Scalanie kolumn `Zasięg N`

W danych źródłowych mogą istnieć kolumny `Zasięg 1`, `Zasięg 2`, `Zasięg 3`.

Funkcja `mergeRange` scala je do jednej kolumny `Zasięg`.

Format wyniku:

```text
wartość1 / wartość2 / wartość3
```

Puste wartości są zastępowane przez `-`.

Scalanie dotyczy aktualnie arkuszy:

- `Bronie`,
- `Bronie Pojazdów`.

## Scalanie kolumn `Cecha N`

W danych źródłowych mogą istnieć kolumny `Cecha 1`, `Cecha 2`, `Cecha 3` i dalsze kolumny pasujące do wzorca `Cecha N`.

Funkcja `mergeTraits` scala je do jednej kolumny `Cechy`.

Zasady:

- puste wartości są pomijane,
- wartość `-` jest pomijana,
- cechy są łączone separatorem `; `,
- jeżeli nie ma żadnych cech, wynik to `-`.

Scalanie dotyczy aktualnie arkuszy:

- `Bronie`,
- `Bronie Pojazdów`,
- `Pancerze`,
- `Pojazdy`.

## Clamp i podgląd wieloliniowy

`formatTextHTML` może działać z opcjami:

```js
{
  maxLines,
  appendHint
}
```

Jeżeli `maxLines` jest liczbą całkowitą, renderowane są tylko pierwsze linie tekstu.

Jeżeli `appendHint` istnieje, na końcu dodawany jest:

```html
<span class="clampHint">...</span>
```

Rozwijanie i zwijanie komórki wpływa tylko na prezentację, nie zmienia danych ani markerów.

## Wiersze archiwalne i status `old`

Funkcja `isOldStatusRow` sprawdza kolumnę `Stan`.

Jeżeli jej wartość po usunięciu markerów i normalizacji to `old`, wiersz jest traktowany jako archiwalny.

Dla takich wierszy stosowany jest styl `row-old`.

## Priorytety kolorów w wierszach archiwalnych

Dla `row-old`:

- zwykły tekst przechodzi na kolor archiwalny,
- `.keyword-comma`, `.ref`, `.caretref` i `.slash` dziedziczą kolor archiwalny,
- `.inline-strike` używa przekreślenia i koloru archiwalnego,
- `.inline-strike.inline-red` przywraca kolor czerwony.

Dzięki temu połączenie czerwonego tekstu i przekreślenia pozostaje czerwone nawet w wierszu archiwalnym.

## Klasy CSS używane przez formatowanie

| Klasa | Znaczenie |
| --- | --- |
| `.inline-red` | Czerwony tekst z markera `RED`. |
| `.inline-bold` | Pogrubienie z markera `B`. |
| `.inline-italic` | Kursywa z markera `I`. |
| `.inline-strike` | Przekreślenie z markera `S`. |
| `.keyword-red` | Globalna czerwień słów kluczowych. |
| `.keyword-comma` | Neutralny przecinek w słowach kluczowych. |
| `.ref` | Referencja strony w nawiasie. |
| `.caretref` | Linia specjalna `*[n]`. |
| `.slash` | Separator `/` w kolumnie `Zasięg`. |
| `.clampHint` | Dopisek podglądu przy ucięciu wieloliniowej komórki. |
| `.row-old` | Styl wiersza archiwalnego. |

## Zasady przygotowywania `Repozytorium.xlsx`

1. Czerwony tekst ustawiaj jako realny kolor fontu w XLSX.
2. Pogrubienie, kursywę i przekreślenie ustawiaj jako rich text w komórce. Zaznaczenie może zaczynać się od litery albo od entera i może obejmować kilka linii — wynik w aplikacjach jest taki sam jak w Excelu.
3. Referencje stron zapisuj w nawiasach z tokenem `str.`, `str`, `strona`, `page` albo `p.`.
4. Linie pomocnicze zapisuj jako `*[liczba] treść`.
5. W arkuszu `Słowa Kluczowe Frakcji` pamiętaj, że `-` i `lub` są neutralne.
6. W arkuszu `Słowa Kluczowe Frakcji` token `[ŚWIAT-KUŹNIA]` pozostaje czerwony.
7. W `Pakiety Wyniesienia / Słowa Kluczowe` nie zakładaj automatycznej czerwieni — użyj realnego czerwonego stylu w XLSX.
8. Jeżeli chcesz uzyskać kolumnę `Cechy`, użyj kolumn `Cecha N` tam, gdzie moduł je scala.
9. Jeżeli chcesz uzyskać kolumnę `Zasięg`, użyj kolumn `Zasięg 1`, `Zasięg 2`, `Zasięg 3` tam, gdzie moduł je scala.
10. Po wygenerowaniu danych sprawdź widok w aplikacji, szczególnie kolumny ze słowami kluczowymi i długimi opisami.

## Typowe błędy w danych źródłowych

| Błąd | Skutek | Zalecenie |
| --- | --- | --- |
| Ręcznie wpisany niedomknięty marker | Styl może objąć zbyt duży fragment tekstu. | Domknij marker albo użyj rich text w XLSX. |
| Użycie niestandardowego odcienia czerwieni | Parser może nie rozpoznać koloru. | Używaj standardowej czerwieni fontu. |
| Referencja strony bez nawiasów | `.ref` nie zostanie zastosowane. | Zapisz referencję jako `(str. 123)` albo podobnie. |
| `Cecha N` z wartością `-` | Wartość zostanie pominięta przy scalaniu. | To poprawne; używaj `-` tylko jako świadomego pustego wpisu. |
| Puste `Zasięg N` | W scalonym zasięgu pojawi się `-`. | Uzupełnij wartość albo zaakceptuj placeholder. |
| Założenie automatycznej czerwieni w `Pakiety Wyniesienia` | Tekst może pozostać neutralny. | Nadaj czerwony styl bezpośrednio w XLSX. |
| Ręcznie wpisane markery, między którymi jest enter | W tabelach styl obejmuje tylko linię ze znacznikiem otwierającym. | Użyj rich text w XLSX albo domknij marker w tej samej linii. |
| Pogrubienie, kursywa albo przekreślenie nadane całej komórce zamiast zaznaczonemu tekstowi | Styl nie trafia do danych (dla całej komórki przenoszony jest tylko czerwony kolor czcionki, i to w komórce bez formatowania fragmentów). | Zaznacz fragment tekstu w trybie edycji komórki i dopiero wtedy nadaj styl. Zaznaczenie całego tekstu komórki Excel może zapisać jako formatowanie całej komórki. Jeżeli cała komórka jest pogrubiona, a część tekstu odpogrubiono, fragmenty pogrubione tylko stylem komórki (Excel zapisuje tak zwykle fragment na początku komórki) nie trafiają do danych jako pogrubione — usuń pogrubienie całej komórki i pogrub tylko wybrane fragmenty. |
| Formatowanie obejmujące początek linii `*[n]` | Linia nie jest rozpoznawana jako `*[n]`. | Zaczynaj formatowanie za numerem przypisu. |

Formatowanie w Excelu, które zaczyna się lub kończy enterem albo obejmuje kilka linii (np. pogrubiony enter przed nagłówkiem zdolności), **nie jest błędem** i nie wymaga poprawiania komórki — generator zapisuje je tak samo jak formatowanie zaczynające się od litery.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Czerwony rich text | Ustaw fragment tekstu na czerwono w XLSX i wygeneruj dane. | Fragment w DataVault ma klasę `.inline-red`. |
| Pogrubienie i kursywa | Ustaw fragment jako pogrubiony i kursywę. | Fragment otrzymuje klasy `.inline-bold` i `.inline-italic`. |
| Przekreślenie | Ustaw fragment jako przekreślony. | Fragment otrzymuje `.inline-strike`. |
| Pogrubienie od entera | Za innym tekstem w komórce pogrub fragment zaczynający się od entera, np. `⏎NAGŁÓWEK: opis`, i wygeneruj dane. | Dane zawierają `\n{{B}}NAGŁÓWEK: opis{{/B}}`; nagłówek jest pogrubiony tak samo jak przy pogrubieniu zaczynającym się od litery. |
| Pogrubienie w kilku liniach | Pogrub jednym zaznaczeniem dwie linie w środku dłuższej komórki i wygeneruj dane. | Każda linia ma własną parę `{{B}}…{{/B}}` i obie są pogrubione w tabeli. |
| Referencja strony | Wpisz `(str. 45)`. | Nawias otrzymuje `.ref`. |
| Linia specjalna | Wpisz `*[1] opis`. | Linia otrzymuje `.caretref`. |
| Słowa kluczowe | Uzupełnij `Słowa Kluczowe` w arkuszu z neutralnymi przecinkami. | Słowa są czerwone, przecinki neutralne. |
| Słowa Kluczowe Frakcji | Wpisz tekst z `-`, `lub` i `[ŚWIAT-KUŹNIA]`. | `-` i `lub` są neutralne, `[ŚWIAT-KUŹNIA]` jest czerwone. |
| Zasięg | Wpisz wartość z `/`. | Separator `/` ma klasę `.slash`. |
| Cechy pojazdu | Uzupełnij `Cecha 1`, `Cecha 2`. | W widoku powstaje kolumna `Cechy` z wartościami połączonymi przez `; `. |

---

# 🇬🇧 Text formatting rules — DataVault (EN)

## Document purpose

This file is a specialized technical document for the `DataVault` module.

It describes only the text formatting rules used when:

- preparing source data in `Repozytorium.xlsx`,
- generating `data.json` and `firebase-import.json`,
- interpreting formatting markers in the application,
- rendering table cells in the DataVault interface.

Full documentation for architecture, Firebase, data loading, filtering, sorting, and UI is located in:

```text
DataVault/docs/Documentation.md
```

## Scope

This document covers:

- inline markers,
- XLSX rich text,
- red text,
- bold text,
- italic text,
- strikethrough,
- page references,
- special `*[n]` lines,
- keyword formatting,
- range formatting,
- trait merging,
- archived row style,
- CSS classes used by formatting.

This document does not describe Firebase configuration, Firebase rules, login flow, the full structure of every sheet, or filter and sorting behavior except where it affects text presentation.

## Main formatting sources

Formatting comes from two places:

1. the source file `Repozytorium.xlsx`,
2. rendering rules in the `DataVault` code.

In XLSX you can use rich text styles, such as red color, bold, italic, and strikethrough. The canonical parser transfers them into data as text markers.

In the application, markers are interpreted and converted into CSS classes.

## Formatting pipeline

Order matters.

1. `xlsxCanonicalParser.js` reads `Repozytorium.xlsx`.
2. The parser reads `sharedStrings.xml`, `styles.xml`, and XLSX sheets.
3. XLSX rich text is converted into inline markers, for example `{{RED}}...{{/RED}}`.
4. Data is saved into the `sheets` structure.
5. `DataVault/app.js` loads data from Firebase or a generated file.
6. When rendering a cell, the application selects a formatting function depending on sheet and column.
7. `formatTextHTML`, `formatInlineHTML`, `formatKeywordHTML`, `formatFactionKeywordHTML`, or `formatRangeHTML` return HTML.
8. CSS gives the final appearance to classes such as `.inline-red`, `.keyword-red`, `.ref`, and `.slash`.

## Inline markers

Supported markers:

| Marker | Effect | CSS class |
| --- | --- | --- |
| `{{RED}}...{{/RED}}` | Red text | `.inline-red` |
| `{{B}}...{{/B}}` | Bold text | `.inline-bold` |
| `{{I}}...{{/I}}` | Italic text | `.inline-italic` |
| `{{S}}...{{/S}}` | Strikethrough | `.inline-strike` |

Example:

```text
Normal text {{RED}}red text{{/RED}} normal text again.
```

Combined example:

```text
{{RED}}{{B}}important red bold text{{/B}}{{/RED}}
```

## Marker nesting

Markers can be nested.

`parseInlineSegments` works with a stack. This means it:

- remembers open styles,
- assigns active styles to text segments,
- allows one segment to receive multiple classes at the same time.

Example:

```text
{{RED}}red {{B}}red and bold{{/B}} red{{/RED}}
```

Result:

- the first fragment has `.inline-red`,
- the middle fragment has `.inline-red inline-bold`,
- the last fragment has `.inline-red`.

## Invalid or unclosed markers

The parser does not stop the application on simple marker errors.

Recommendation for source data:

- always close markers,
- do not reorder closing markers,
- avoid manually typing markers in XLSX when rich text can be used,
- check the result in DataVault after changes.

## XLSX rich text

The canonical parser recognizes rich text styles in `Repozytorium.xlsx`.

Supported run styles:

| XLSX style | Marker in data |
| --- | --- |
| red font color | `{{RED}}...{{/RED}}` |
| bold | `{{B}}...{{/B}}` |
| italic | `{{I}}...{{/I}}` |
| strikethrough | `{{S}}...{{/S}}` |

If a cell has no rich text runs but has red font style at cell level, the parser wraps the value in `{{RED}}` following the same rules as rich text runs.

### Enters never end up between markers

The data generator (`xlsxCanonicalParser.js` in the browser and `build_json.py`, both identically) writes markers so that **no marker pair contains an Enter**:

- a run without an Enter gets one marker pair around the whole run, including the spaces inside and at its edges (e.g. `{{B}}bagnet: {{/B}}`);
- a run with Enters is split into lines and **every non-empty line gets its own marker pair**;
- Enters, and spaces and tabs touching an Enter, stay outside the markers;
- an empty or spaces-only line stays unmarked;
- a run made only of Enters and spaces gets an empty marker pair before the text (e.g. `{{B}}{{/B}}\n`), which displays nothing.

Examples (⏎ marks an Enter in the cell; the "Stored run" column shows a run in the middle of a cell — the whole cell value is trimmed afterwards, so Enters at the very start or end of the cell usually disappear just as in plain text; the exceptions are described in `Documentation.md`, section "Wrapping text in markers"):

| Run in Excel | Style | Stored run |
| --- | --- | --- |
| `ANIHILACJA: Protokoły ożywienia` | bold | `{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` |
| `⏎ANIHILACJA: Protokoły ożywienia` | bold | `\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` |
| `ANIHILACJA: Protokoły ożywienia⏎` | bold | `{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\n` |
| `lub⏎` | italic | `{{I}}lub{{/I}}\n` |
| `⏎[dane utajnione]⏎⏎` | italic | `\n{{I}}[dane utajnione]{{/I}}\n\n` |
| `First line⏎Second line` | bold | `{{B}}First line{{/B}}\n{{B}}Second line{{/B}}` |

As a result:

- formatting that starts in Excel **with a letter** or **with an Enter** produces exactly the same stored value and the same look (e.g. a bold ability header on a new line);
- formatting that spans several lines is displayed on each of them — in the DataVault table, in the GeneratorNPC table and on the GeneratorNPC card;
- wrapping in markers never changes the visible text — only the marker positions change (trimming and quote replacement work on the whole cell value, see "Text normalization from XLSX"; Enters and the spaces next to them at the edges of a cell lie outside the markers, so trimming removes them as in unformatted text — except where a marker already stands between them and the cell edge, e.g. a cell that starts with a bold Enter on its own or spaces at the start of a bold first run).

Technical details of the rules: `DataVault/docs/Documentation.md`, section "Canonical XLSX parser" → "Wrapping text in markers".

## Red color recognition

The parser treats the following as red, among others:

- `FF0000`,
- `00FF0000`,
- `FFFF0000`,
- RGB values ending with `FF0000`.

In practice, the safest option is to use the standard red font color in Excel.

## Text normalization from XLSX

The parser:

- replaces Polish quotes `„` and `”` with `"`,
- trims headers and values,
- removes extra spaces in headers,
- skips the `Lp` column,
- can merge special columns such as `Zasięg N` and `Cecha N`.

## Page references

The application recognizes page references written in parentheses.

A parenthesized fragment receives `.ref` if it contains one of these tokens:

- `str`,
- `str.`,
- `strona`,
- `page`,
- `p.`.

Examples:

```text
(str. 123)
(STR 88)
(zob. strona 45)
(page 77)
(p. 13)
```

References can appear inside text with inline markers. In that case, `.ref` is combined with active style classes.

## Special `*[n]` lines

A line matching:

```text
*[number] text
```

is rendered as `.caretref`.

Rules:

- the asterisk and number remain visible,
- the rule is applied separately per line,
- the line receives a lighter or helper style depending on CSS,
- the pattern must start the line: if any formatting (bold, italic, strikethrough, color) covers any character of `*[n]`, a marker stands in that part and the line is not recognized as `*[n]`; this also applies to the following lines of one selection that spans several lines, because each of them starts with its own marker — do not format the start of a `*[n]` line.

## Line break behavior

`formatTextHTML` splits text by `\r?\n` (an Enter, including the Windows form `\r\n`).

Each line is formatted separately and then joined with:

```html
<br>
```

This keeps multiline cells readable in the table.

Every line is formatted from scratch: a style opened on one line does not carry over to the next. `formatFactionKeywordHTML` in the `Słowa Kluczowe Frakcji` sheet, the GeneratorNPC table and the GeneratorNPC card section without stripes (`Umiejętności`; `Skills` in the English interface) work the same way. In the other GeneratorNPC card sections every stripe is formatted from scratch (a stripe is built from one or several joined lines), so a style does not carry over from one stripe to the next. Formatting from Excel is displayed correctly in all these views, because the data generator writes a complete set of markers on every line (see "Enters never end up between markers").

The exception is markers typed by hand in a cell as plain text: if `{{B}}` is on one line and `{{/B}}` on the next, in the tables and in the `Umiejętności` card section only the line with the opening marker is bold, and in the card sections with stripes both lines are bold only when they end up in the same stripe.

## Keyword formatting — `Słowa Kluczowe` sheet

In the sheet `Słowa Kluczowe`, the column `Nazwa` is rendered fully red.

The application uses a global `.keyword-red` wrapper for this.

## Keyword formatting — comma-neutral sheets

For selected sheets, the column `Słowa Kluczowe` is rendered so that:

- keywords are red,
- commas keep the base text color.

Sheets covered by this rule:

- `Bestiariusz`,
- `Archetypy`,
- `Psionika`,
- `Augumentacje`,
- `Ekwipunek`,
- `Pancerze`,
- `Bronie`,
- `Pakiety Wyniesienia`,
- `Pojazdy`,
- `Bronie Pojazdów`,
- `Ekwipunek Pojazdów`.

Technically, each comma is replaced with:

```html
<span class="keyword-comma">,</span>
```

## Exception: `Pakiety Wyniesienia`

Although `Pakiety Wyniesienia` is present in the comma-neutral sheet set, the application has a higher-priority exception for `Pakiety Wyniesienia / Słowa Kluczowe`.

This column:

- does not receive the automatic global `.keyword-red` wrapper,
- is rendered through normal `getFormattedCellHTML`,
- keeps red color only when it comes from inline markers transferred from XLSX.

This means that red color in this sheet must be applied directly in the source data if it should be visible.

## `Słowa Kluczowe Frakcji`

In the sheet `Słowa Kluczowe Frakcji`, the column `Słowo Kluczowe` has separate tokenization in `formatFactionKeywordHTML`.

Rules:

1. Text is red by default.
2. Token `-` is neutral.
3. Word `lub` is neutral regardless of letter case.
4. Token `[ŚWIAT-KUŹNIA]` is a higher-priority exception and always remains red.
5. `{{B}}` and `{{I}}` styles are preserved.

Example:

```text
IMPERIUM - ADEPTUS MECHANICUS lub [ŚWIAT-KUŹNIA]
```

Effect:

- `IMPERIUM`, `ADEPTUS MECHANICUS`, and `[ŚWIAT-KUŹNIA]` are red,
- `-` and `lub` are neutral.

## `Zasięg` column

The column `Zasięg` has a separate `formatRangeHTML` function.

Text is split by `/`. The separator is rendered as:

```html
<span class="slash">/</span>
```

This lets CSS style the separator separately.

## Merging `Zasięg N` columns

Source data can contain `Zasięg 1`, `Zasięg 2`, and `Zasięg 3`.

`mergeRange` merges them into one column `Zasięg`.

Output format:

```text
value1 / value2 / value3
```

Empty values are replaced with `-`.

This merge currently applies to:

- `Bronie`,
- `Bronie Pojazdów`.

## Merging `Cecha N` columns

Source data can contain `Cecha 1`, `Cecha 2`, `Cecha 3`, and further columns matching `Cecha N`.

`mergeTraits` merges them into one column `Cechy`.

Rules:

- empty values are skipped,
- value `-` is skipped,
- traits are joined with `; `,
- if there are no traits, output is `-`.

This merge currently applies to:

- `Bronie`,
- `Bronie Pojazdów`,
- `Pancerze`,
- `Pojazdy`.

## Clamp and multiline preview

`formatTextHTML` can use options:

```js
{
  maxLines,
  appendHint
}
```

If `maxLines` is an integer, only the first lines of text are rendered.

If `appendHint` exists, the following is appended:

```html
<span class="clampHint">...</span>
```

Expanding or collapsing a cell affects only presentation. It does not change data or markers.

## Archived rows and `old` status

`isOldStatusRow` checks the column `Stan`.

If its value after marker stripping and normalization is `old`, the row is treated as archived.

Such rows use the `row-old` style.

## Color priorities in archived rows

For `row-old`:

- normal text switches to the archived color,
- `.keyword-comma`, `.ref`, `.caretref`, and `.slash` inherit the archived color,
- `.inline-strike` uses strikethrough and archived color,
- `.inline-strike.inline-red` restores red color.

This keeps combined red and strikethrough text red even inside archived rows.

## CSS classes used by formatting

| Class | Meaning |
| --- | --- |
| `.inline-red` | Red text from the `RED` marker. |
| `.inline-bold` | Bold text from the `B` marker. |
| `.inline-italic` | Italic text from the `I` marker. |
| `.inline-strike` | Strikethrough from the `S` marker. |
| `.keyword-red` | Global keyword red styling. |
| `.keyword-comma` | Neutral comma in keyword lists. |
| `.ref` | Parenthesized page reference. |
| `.caretref` | Special `*[n]` line. |
| `.slash` | `/` separator in the `Zasięg` column. |
| `.clampHint` | Preview hint for clipped multiline cells. |
| `.row-old` | Archived row style. |

## Preparing `Repozytorium.xlsx`

1. Set red text as an actual font color in XLSX.
2. Set bold, italic, and strikethrough as rich text in the cell. The selection may start with a letter or with an Enter and may span several lines — the result in the applications is the same as in Excel.
3. Write page references in parentheses with `str.`, `str`, `strona`, `page`, or `p.`.
4. Write helper lines as `*[number] text`.
5. In `Słowa Kluczowe Frakcji`, remember that `-` and `lub` are neutral.
6. In `Słowa Kluczowe Frakcji`, `[ŚWIAT-KUŹNIA]` remains red.
7. In `Pakiety Wyniesienia / Słowa Kluczowe`, do not rely on automatic red styling — apply red directly in XLSX.
8. If you want a `Cechy` column, use `Cecha N` columns where the module merges them.
9. If you want a `Zasięg` column, use `Zasięg 1`, `Zasięg 2`, `Zasięg 3` where the module merges them.
10. After generating data, check the application view, especially keyword columns and long descriptions.

## Common source data errors

| Error | Effect | Recommendation |
| --- | --- | --- |
| Manually typed unclosed marker | Style can affect too much text. | Close the marker or use XLSX rich text. |
| Non-standard red shade | Parser may not recognize the color. | Use standard red font color. |
| Page reference without parentheses | `.ref` will not be applied. | Write it as `(str. 123)` or similar. |
| `Cecha N` with value `-` | Value is skipped during merge. | This is correct; use `-` only as an intentional empty entry. |
| Empty `Zasięg N` | The merged range receives `-`. | Fill the value or accept the placeholder. |
| Assuming automatic red in `Pakiety Wyniesienia` | Text may stay neutral. | Apply red directly in XLSX. |
| Hand-typed markers with an Enter between them | In the tables the style covers only the line with the opening marker. | Use rich text in XLSX or close the marker on the same line. |
| Bold, italic or strikethrough applied to the whole cell instead of the selected text | The style does not reach the data (for a whole cell only the red font color is carried over, and only in a cell without formatted runs). | Select part of the text in cell edit mode and only then apply the style. Excel may save a selection of the whole cell text as whole-cell formatting. If the whole cell is bold and part of the text was un-bolded, parts that are bold only through the cell style (Excel usually stores the part at the start of the cell this way) do not reach the data as bold — remove the whole-cell bold and make only the chosen parts bold. |
| Formatting that covers the start of a `*[n]` line | The line is not recognized as `*[n]`. | Start the formatting after the footnote number. |

Formatting in Excel that starts or ends with an Enter or spans several lines (e.g. a bold Enter before an ability header) **is not an error** and the cell does not need fixing — the generator stores it exactly like formatting that starts with a letter.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Red rich text | Set part of text red in XLSX and generate data. | The fragment in DataVault has `.inline-red`. |
| Bold and italic | Set part of text as bold and italic. | The fragment receives `.inline-bold` and `.inline-italic`. |
| Strikethrough | Set part of text as strikethrough. | The fragment receives `.inline-strike`. |
| Bold starting with an Enter | After other text in the cell, make bold a run that starts with an Enter, e.g. `⏎HEADER: text`, and generate the data. | The data contains `\n{{B}}HEADER: text{{/B}}`; the header is bold exactly as with bold starting with a letter. |
| Bold across several lines | With one selection, make two lines in the middle of a longer cell bold and generate the data. | Each line has its own `{{B}}…{{/B}}` pair and both are bold in the table. |
| Page reference | Enter `(str. 45)`. | The parenthesized fragment receives `.ref`. |
| Special line | Enter `*[1] description`. | The line receives `.caretref`. |
| Keywords | Fill `Słowa Kluczowe` in a comma-neutral sheet. | Keywords are red and commas are neutral. |
| Faction keywords | Enter text with `-`, `lub`, and `[ŚWIAT-KUŹNIA]`. | `-` and `lub` are neutral, `[ŚWIAT-KUŹNIA]` is red. |
| Range | Enter a value with `/`. | The `/` separator has `.slash`. |
| Vehicle traits | Fill `Cecha 1`, `Cecha 2`. | The view contains a `Cechy` column joined with `; `. |

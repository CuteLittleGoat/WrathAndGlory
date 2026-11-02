# DataVault — parser XLSX a puste, sformatowane wiersze: analiza wydajności i plan poprawy

> **Data analizy:** 2 listopada 2026
> **Moduł:** `DataVault` — generowanie `data.json` / `firebase-import.json` z `Repozytorium.xlsx`
> **Pliki objęte analizą:** `DataVault/xlsxCanonicalParser.js`, `DataVault/build_json.py`, `DataVault/app.js` (`loadXlsxFromRepo`, `buildDataJsonFromSheets`, `setStatus`)
> **Stan kodu:** commit `0eacdc5` (gałąź `main`; pliki parserów bez zmian od `4295ed5`)
> **Plik wejściowy:** `Repozytorium.xlsx` z 2 listopada 2026 (z nową zakładką „Mutacje”) — 10 038 088 B, SHA-256 `e3ebb94b446eac953fffba5660c143dee64fc0520e4bb6d1fc7a6b52357290e3`
> **Charakter dokumentu:** analiza i plan osobnego zadania. Kod nie został zmieniony. Prototypy i pomiary powstały na kopiach w katalogu tymczasowym sesji.
> **Analiza powiązana:** `Analizy/mutacje-datavault-generatornpc-plan-rozbudowy.md` (decyzja D1).
> **Odpowiedź w skrócie:** prawie cały czas generowania z „ciężkiego” pliku zjada budowa drzewa XML z ponad miliona pustych wierszy (w przeglądarce 28,5 s samego `DOMParser`). Usunięcie z tekstu XML wierszy, które **na pewno** nie zawierają wartości, zanim trafi on do parsera XML, skraca generowanie z ~52 s do ~5 s w przeglądarce i z ~35 s / 1,75 GB do ~4 s / 250 MB w Pythonie. Wynik pozostaje **bajtowo identyczny** — sprawdzone na pliku oryginalnym, oczyszczonym i na pliku z przypadkami brzegowymi, w obu implementacjach.

---

## Spis treści

1. [Prompty użytkownika (pełne)](#1-prompty-użytkownika-pełne)
2. [Zakres](#2-zakres)
3. [Podsumowanie](#3-podsumowanie)
4. [Problem](#4-problem)
5. [Jak parsery działają dziś](#5-jak-parsery-działają-dziś)
6. [Gdzie znika czas — pomiary](#6-gdzie-znika-czas--pomiary)
7. [Warianty rozwiązania](#7-warianty-rozwiązania)
8. [Definicja „pustego wiersza” i przypadki brzegowe](#8-definicja-pustego-wiersza-i-przypadki-brzegowe)
9. [Prototyp i wyniki](#9-prototyp-i-wyniki)
10. [Uzupełnienie: ostrzeżenie i widoczny postęp](#10-uzupełnienie-ostrzeżenie-i-widoczny-postęp)
11. [Zgodność trzech ścieżek (`AGENTS.md` §14)](#11-zgodność-trzech-ścieżek-agentsmd-14)
12. [Obserwacje przy okazji](#12-obserwacje-przy-okazji)
13. [Ryzyka](#13-ryzyka)
14. [Rekomendacje](#14-rekomendacje)
15. [Plan pracy](#15-plan-pracy)
16. [Testy akceptacyjne](#16-testy-akceptacyjne)
17. [Następne kroki](#17-następne-kroki)
18. [Załącznik — metoda pomiarów](#18-załącznik--metoda-pomiarów)

---

## 1. Prompty użytkownika (pełne)

### 1.1 Prompt, w którym użytkownik zlecił tę analizę (2 listopada 2026)

> Moje odpowiedzi na pytania (dopisz je do analizy):
>
> D1 - na tę chwilę poprawię plik XLSX. Przygotuj nową analizę dotyczącą poprawy parsera (będzie to osobne zadanie).
> D2 - Zostaw. Tabela "Mutacje" może być później rozbudowywana, zmieniana itd. - potem takie wyjątki będą powodować problemy.
> D3 - Zgodnie z Twoją rekomendacją, żeby zachować spójność aplikacji.
> D4 - Zgodnie z rekomendacją.
> D5 - Zgodnie z rekomendacją, żeby zachować spójność aplikacji.
>
> Dodatkowe obserwacje:
>
> 1. Martwe reguły - popraw i pamiętaj o zachowaniu spójności aplikacji.
> 2. DetaleLayout.md, DataVault §5 - popraw.
> 3. Nazwa „Premie Frakcji” - popraw.
> 4. Kolumny.md - popraw
> 5. GeneratorNPC — ukryte moduły na karcie. - Nie jestem pewien czy rozumiem. Opiszę jakie zachowanie jest oczekiwane.
>
> A. Otwieram moduł Generator NPC
> B. Wybieram przeciwnika (np. Mutant, LP=7)
> C. Nic nie zmieniam. Aktywny jest tylko checkbox "Broń".
> D. Klikam "Generuj kartę".
> E. Tworzy się karta potwora o standardowych statystykach.
> F. Klikam checkbox "Psionika" i wybieram kilka zaklęć.
> G. Klikam "Generuj kartę". Tworzy się karta potwora z dodaną sekcją "Psionika" na końcu.
> H. Odznaczam checkbox "Psionika" i klikam "Generuj kartę". Tworzy się potwór z wybranymi w pkt G czarami. To jest błąd. Po odznaczeniu checkboxa sekcja "Psionika" powinna zniknąć z wygenerowanej karty.
> I. Klikam checkbox "Psionika" - mam zaznaczone te czary, które wybrałem w pkt F. Wygląda to tak jakby odznaczenie checkboxa nie kasowało wyboru i dlatego się generuje sekcja "Psionika" nawet jeżeli checkbox jest odznaczony. Jest to do pilnej poprawy.
>
> 6. Paski na karcie - zachowaj spójność w wyglądzie wygenerowanej karty.
>
> DODATKOWO jedna zmiana. Przy opisie kroków w pkt C napisałem, że Aktywny jest tylko checkbox "Broń". Chcę to zmienić. Niech domyślnie wszystkie checkboxy będą wyłączone.
>
> Zaktualizuj analizę. Masz jeszcze jakieś pytania?

### 1.2 Prompt otwierający, z którego wynika kontekst (2 listopada 2026)

> @"/root/.claude/uploads/a92192ab-b41a-578e-ab2b-83d523e19803/3ccf5e6c-Repozytorium.xlsx" Potrzebuję analizy rozbudowy aplikacji. Nic nie zmieniaj w kodzie. Przygotuj tylko analizę oraz zapisz ją w Analizy/ na gałęzi Main.
>
> Przeanalizuj kod modułu DataVault w repo "WrathAndGlory".
> Załączam zaktualizowany plik Repozytorium.xlsx - na jego podstawie mają powstać nowe pliki JSON.
>
> Dodałem nową zakładkę "Mutacje".
> Znajduje się ona między "Specjalne Bonusy Frakcji" a "Implanty Astartes".
> Zakładka "Mutacje" ma być powiązana z checkboxem "Czy wyświetlić zakładki dotyczące tworzenia postaci?" (ma być widoczna tylko jak checkbox jest zaznaczony i ma mieć kolor jak inne z danej grupy).
>
> Ustal szerokości kolumn, żeby pasowały i były podobne jak w innych zakładkach.
> Zadbaj o wyrównanie itd.
>
> Zaplanuj aktualizację kodu aplikacji, żeby generator obsłużył nową zakładkę oraz, żeby się wyświetlała w prawidłowy sposób.
>
> Następnie przeanalizuj kod modułu GeneratorNPC.
> Chcę, żeby nowa zakładka "Mutacje" działała jak "moduły aktywne" np. "Psionika" czy "Modlitwy".
> "Mutacje" mają się znajdować pod "Modlitwy" na liście.
> Na wygenerowanej karcie ma się utworzyć nowa sekcja "Mutacje". Podobnie jak w przypadku pozostałych kart ma być checkbox "czy dodać pełen opis". Kliknięcie ma wyświetlić zawartość kolumny "Efekt".
>
> Pamiętaj w planie o aktualizacji dokumentacji.
>
> Przeprowadź analizę powyższej rozbudowy i przygotuj plan pracy (wszystko w jednym pliku w Analizy/ na gałęzi Main).

---

## 2. Zakres

- Odczyt i opis obu implementacji parsera: przeglądarkowej (`xlsxCanonicalParser.js` + `buildDataJsonFromSheets()` z `app.js`) i wiersza poleceń (`build_json.py`).
- Pomiar czasu i pamięci etap po etapie na pliku z 1 048 535 wierszami w arkuszu „Mutacje”.
- Przegląd wariantów rozwiązania i wybór rekomendowanego.
- Prototyp rekomendowanego wariantu w **kopiach** obu parserów i porównanie wyników bajt po bajcie z obecnymi parserami na trzech plikach: oryginalnym, oczyszczonym i z celowo dopisanymi przypadkami brzegowymi.
- Plan zadania, dokumentacja do aktualizacji, testy.

Poza zakresem: zmiana kodu w repozytorium, zmiana formatu `data.json`, zmiany w GeneratorNPC.

---

## 3. Podsumowanie

| # | Wniosek |
| --- | --- |
| 1 | Oba parsery czytają **każdy** element `<row>` arkusza, także pusty. Puste wiersze odpadają dopiero na końcu (`rowsToRecords` / `rows_to_records`), więc wynik jest poprawny, ale koszt rośnie z liczbą wierszy w XML, a nie z liczbą danych. |
| 2 | W przeglądarce 28,5 s z ok. 52 s to sam `DOMParser` (budowa drzewa z ~3,1 mln elementów). Rozpakowanie i dekodowanie XML to 2,3 s, przejście po drzewie kolejne kilkanaście sekund. Przez cały ten czas strona nie reaguje. |
| 3 | W Pythonie 10,6 s to `ElementTree.fromstring`, a szczyt pamięci całego generowania to 1,75 GB. |
| 4 | **Rekomendacja:** przed parsowaniem XML usunąć z tekstu arkusza wiersze, które na pewno nie dają żadnej wartości — tą samą regułą w obu implementacjach. Pierwszy `<row>` arkusza zostaje zawsze. |
| 5 | Prototyp: przeglądarka **51,6 s → 5,0 s**, Python **~35 s / 1 752 MB → 4,0 s / 250 MB**. Dla pliku oczyszczonego czasy są takie jak dziś (ułamek sekundy dłużej lub krócej). |
| 6 | Wszystkie warianty (2 parsery × obecny/prototyp × 3 pliki testowe) dają **identyczne** pliki `data.json`. |
| 7 | Uzupełnienie: ostrzeżenie dla admina o liczbie pominiętych pustych wierszy (żeby problem w XLSX był widoczny) i widoczny komunikat o trwającym generowaniu — `setStatus()` w DataVault pisze dziś wyłącznie do konsoli. |
| 8 | Testy brzegowe ujawniły dwa istniejące zachowania parserów, które mogą tworzyć „rekordy-widma” z samego formatowania (rozdz. 12). Prototyp ich **nie zmienia** — to osobna decyzja. |

---

## 4. Problem

Arkusz „Mutacje” w pliku z 2 listopada 2026 zawierał w `xl/worksheets/sheet12.xml`:

- `<dimension ref="A1:H1048535"/>`,
- 1 048 535 elementów `<row>`, z czego 35 z danymi; pozostałe wyglądają tak:
  `<row r="1048535" spans="5:6" x14ac:dyDescent="0.25"><c r="E1048535" s="98"/><c r="F1048535" s="98"/></row>`,
- 107 821 656 B XML (cały pakiet XLSX: 10 MB; po oczyszczeniu: 0,58 MB).

Excel zapisuje w ten sposób formatowanie nałożone na całe kolumny albo skopiowane „do końca arkusza”. Takie wiersze nie mają wartości, ale każdy z nich jest pełnoprawnym elementem XML.

Decyzją użytkownika (D1) plik zostanie na razie oczyszczony ręcznie. Ta analiza dotyczy zabezpieczenia generatora, żeby podobny plik w przyszłości nie wydłużał generowania do minuty i nie groził zawieszeniem karty przeglądarki.

---

## 5. Jak parsery działają dziś

### 5.1 Przeglądarka — `xlsxCanonicalParser.js`

`loadXlsxMinimal(arrayBuffer)`:

1. `JSZip.loadAsync()` — otwarcie pakietu.
2. `loadSharedStrings()`, `loadStyles()` — słownik tekstów i informacja, które style mają czerwony font.
3. Dla każdego arkusza z `xl/workbook.xml` (w kolejności z pliku) `loadRowsFromXml()`:
   - `zip.file(path).async("string")` — rozpakowanie i zdekodowanie całego XML arkusza do jednego napisu;
   - `new DOMParser().parseFromString(text, "application/xml")` — **całe drzewo w pamięci**;
   - `qa(xml, "worksheet > sheetData > row")` i dla każdego wiersza `qa(rowNode, "c")`, `q(cell, "v")`, odczyt atrybutów `r`, `t`, `s`;
   - zbudowanie tablicy wierszy; `maxCol` = największy indeks kolumny w dowolnym wierszu; każdy wiersz jest dopełniany pustymi tekstami do `maxCol + 1`.
4. `header = rows[0]` — **pierwszy element `<row>` z XML** (nie wiersz o numerze 1) staje się nagłówkiem.
5. `rowsToRecords(header, rows.slice(1))` — pomija wiersze, w których po `trim()` wszystkie komórki są puste; kolumny z pustym nagłówkiem są pomijane.

`buildDataJsonFromSheets()` (w `app.js`) dokłada słowniki `_meta` i scalanie kolumn — bez związku z pustymi wierszami.

### 5.2 Python — `build_json.py`

`load_xlsx_minimal()` → `_load_rows_from_xml()`: `ET.fromstring(z.read(path))`, potem `findall(".//main:sheetData/main:row")` i ta sama logika komórek, `max_col`, dopełnienie, `header = rows[0]`, `rows_to_records()`. Semantyka jest 1:1 z wersją JS (to wymóg `AGENTS.md` §14 i rozdziału „Zgodność trzech ścieżek generowania danych” w `DataVault/docs/Documentation.md`).

### 5.3 Wartość komórki bez `<v>` — ważne dla definicji „pustego wiersza”

| Typ komórki (`t`) | Komórka bez wartości (np. `<c r="E9" s="98"/>`) daje | Uwagi |
| --- | --- | --- |
| brak / `n` / `str` / `e` | `""` | czerwony styl nie owija pustej wartości |
| `s` | `""` (indeks `NaN`) | |
| `inlineStr` | `""` (brak `<t>`) | |
| **`b`** | **`"FALSE"`** | `["1","true","TRUE"].includes("") === false` → wiersz **nie jest pusty** |

Dlatego komórka logiczna bez wartości musi być traktowana jak niepusta.

---

## 6. Gdzie znika czas — pomiary

### 6.1 Przeglądarka (Chromium, arkusz „Mutacje”, plik oryginalny)

| Etap | Czas |
| --- | --- |
| `JSZip.loadAsync` | 0,02 s |
| rozpakowanie + dekodowanie XML do napisu (107,8 mln znaków) | 2,3 s |
| `DOMParser.parseFromString` | **28,5 s** |
| `querySelectorAll("worksheet > sheetData > row")` (1 048 535 wierszy) | 0,3 s |
| samo przejście po komórkach (`querySelectorAll("c")` w każdym wierszu, 2 097 280 komórek) | 1,6 s |
| pełny `loadXlsxMinimal()` (wszystkie arkusze, cała logika komórek i dopełnianie) | **51,6 s** |
| — dla porównania: filtr wierszy wyrażeniem regularnym na tym samym napisie | 1,0 s |
| — `DOMParser` po filtrze (13 416 znaków, 35 wierszy) | 0,005 s |

### 6.2 Python (arkusz „Mutacje”, plik oryginalny)

| Etap | Czas / pamięć |
| --- | --- |
| `z.read()` (rozpakowanie) | 0,2 s |
| `ET.fromstring` | **10,6 s** |
| `findall` + komórki | 2,0 s |
| pełny `build_json.py` | **32–37 s**, szczyt RSS **1 752 MB** |

### 6.3 Plik oczyszczony (35 wierszy w „Mutacjach”)

Przeglądarka 1,1–1,35 s, Python 0,7 s / 40 MB.

---

## 7. Warianty rozwiązania

| Wariant | Opis | Ocena |
| --- | --- | --- |
| **A. Filtr tekstowy pustych wierszy przed parserem XML** | W obu implementacjach ta sama reguła (rozdz. 8) usuwa z tekstu arkusza wiersze bez wartości, zanim powstanie drzewo XML. | **Rekomendowany.** Usuwa przyczynę (rozmiar drzewa), ~10× szybciej, identyczny wynik, mała zmiana (kilkanaście linii na plik), łatwa do porównania. |
| B. Parsowanie strumieniowe | Python: `ET.iterparse` z czyszczeniem elementów. JS: przeglądarka nie ma strumieniowego `DOMParser`; potrzebny byłby własny parser SAX. | Python — możliwy, ale zmienia sposób czytania całego pliku i rozjeżdża budowę obu implementacji; JS — nieproporcjonalny koszt. **Odrzucony.** |
| C. Przycięcie do `<dimension ref>` | Czytać tylko wiersze z zakresu z nagłówka arkusza. | `dimension` jest właśnie zawyżony (`A1:H1048535`). **Odrzucony.** |
| D. Przerwanie po N pustych wierszach z rzędu | Zatrzymać czytanie arkusza po np. 1 000 pustych wierszy. | Zmienia semantykę: dane po dłuższej przerwie zniknęłyby po cichu. **Odrzucony.** |
| E. Web Worker | Przenieść parsowanie poza wątek strony. | `DOMParser` nie jest dostępny w workerach; wymagałoby własnego parsera. Nie skraca czasu. **Odrzucony.** |
| F. Samo ostrzeżenie | Tylko informować o problemie. | Nie skraca czasu. **Jako uzupełnienie A** (rozdz. 10). |

---

## 8. Definicja „pustego wiersza” i przypadki brzegowe

Reguła ma być **konserwatywna**: usuwa wyłącznie wiersze, o których wiadomo, że dzisiejsze parsery i tak by je pominęły. Wszystko, co niepewne, zostaje i przechodzi dotychczasową drogą (`rowsToRecords` / `rows_to_records`).

Wiersz jest usuwany, gdy **wszystkie** warunki są spełnione:

1. **nie jest pierwszym** elementem `<row>` arkusza (pierwszy zawsze zostaje, bo staje się nagłówkiem — także wtedy, gdy jest pusty);
2. jest samozamykający się (`<row …/>`) **albo** jego treść składa się wyłącznie z białych znaków i samozamykających się komórek `<c …/>`;
3. żadna z tych komórek nie ma `t="b"` (komórka logiczna bez wartości daje `"FALSE"`).

Co zostaje (i dlaczego jest to bezpieczne):

| Wiersz | Przykład | Dlaczego zostaje |
| --- | --- | --- |
| z jakąkolwiek wartością | `<c …><v>5</v></c>` | normalne dane |
| z komórką tekstową wpisaną w XML | `<c t="inlineStr"><is><t></t></is></c>` | czerwony styl daje `{{RED}}{{/RED}}` — dziś niepusty rekord |
| z formułą bez wyniku | `<c><f>1+1</f></c>` | dziś daje `""` i jest pomijany później — filtr go zostawia, wynik ten sam |
| z pustą komórką nie-samozamykającą | `<c r="B5" s="5"></c>` | jak wyżej |
| z prefiksem przestrzeni nazw | `<x:row>`, `<x:c>` | wzorzec ich nie rozpoznaje → zostają (brak przyspieszenia, ale wynik poprawny) |
| z komentarzem XML lub innym nietypowym zapisem | `<!-- … -->` w środku | nie pasuje do wzorca „same `<c/>`” → zostaje |

Dlaczego usunięcie pozostałych wierszy nie zmienia wyniku:

- `rowsToRecords` / `rows_to_records` i tak pomijają wiersze, których wszystkie komórki są puste;
- numer wiersza (`r`) nie jest używany przez żaden parser — znaczenie ma tylko kolejność elementów;
- `maxCol` może się zmniejszyć (puste wiersze miały komórki np. w kolumnach `E:F`), ale wpływa to wyłącznie na liczbę pustych nagłówków dopełniających, a kolumny z pustym nagłówkiem są pomijane przy budowie rekordów i w `columnOrder`.

---

## 9. Prototyp i wyniki

### 9.1 Kod prototypu (JS)

```js
// --- Pomijanie pustych, sformatowanych wierszy przed DOMParser / Skipping empty, formatted rows before DOMParser ---
// PL: Excel zapisuje formatowanie nałożone na całe kolumny jako setki tysięcy wierszy <row> bez wartości.
//     DOMParser budowałby z nich ogromne drzewo (dziesiątki sekund i setki MB), a rowsToRecords i tak je
//     pomija. Usuwamy wyłącznie wiersze pewnie puste: samozamykające się albo złożone tylko z
//     samozamykających się komórek <c/> bez t="b" (pusta komórka logiczna daje "FALSE"). Pierwszy <row>
//     zostaje zawsze, bo jest nagłówkiem. Ta sama reguła jest w _drop_empty_rows() w build_json.py.
// EN: Excel stores formatting applied to whole columns as hundreds of thousands of <row> elements without
//     values. DOMParser would build a huge tree from them (tens of seconds and hundreds of MB), while
//     rowsToRecords skips them anyway. Only rows that are certainly empty are removed: self-closing ones or
//     ones made only of self-closing <c/> cells without t="b" (an empty boolean cell yields "FALSE"). The
//     first <row> always stays, because it is the header. The same rule lives in _drop_empty_rows() in build_json.py.
const EMPTY_ROW_INNER_RE = /^(?:\s*<c\b(?![^>]*\bt=["']b["'])[^>]*\/>)*\s*$/;
function dropEmptyRows(xmlText){
  let first = true;
  return xmlText.replace(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g, (match, inner) => {
    if (first){ first = false; return match; }
    if (inner === undefined) return "";
    return EMPTY_ROW_INNER_RE.test(inner) ? "" : match;
  });
}
// w loadRowsFromXml(): const xml = parseXml(dropEmptyRows(await file.async("string")));
```

### 9.2 Kod prototypu (Python)

```python
# Pomijanie pustych, sformatowanych wierszy przed ElementTree — ta sama reguła co dropEmptyRows()
# w xlsxCanonicalParser.js. Działa na bajtach, więc nie dekoduje 100 MB tekstu dwa razy.
# Skipping empty, formatted rows before ElementTree — the same rule as dropEmptyRows() in
# xlsxCanonicalParser.js. It works on bytes, so 100 MB of text is not decoded twice.
_ROW_RE = re.compile(rb"<row\b[^>]*?(?:/>|>([\s\S]*?)</row>)")
_EMPTY_ROW_INNER_RE = re.compile(rb"""(?:\s*<c\b(?![^>]*\bt=["']b["'])[^>]*/>)*\s*""")

def _drop_empty_rows(xml_bytes):
  first = True
  def repl(m):
    nonlocal first
    if first:
      first = False
      return m.group(0)
    inner = m.group(1)
    if inner is None:
      return b""
    return b"" if _EMPTY_ROW_INNER_RE.fullmatch(inner) else m.group(0)
  return _ROW_RE.sub(repl, xml_bytes)

# w _load_rows_from_xml(): root = ET.fromstring(_drop_empty_rows(z.read(path)))
```

### 9.3 Zgodność wyników

Pliki testowe:

- **oryginalny** — załączony `Repozytorium.xlsx` (1 048 535 wierszy w „Mutacjach”);
- **oczyszczony** — kopia z usuniętymi pustymi wierszami „Mutacji”;
- **brzegowy** — kopia oczyszczona, w której celowo dopisano: w `Kary do ST` (w środku i na końcu) wiersz samozamykający się `<row/>`, wiersz z samymi `<c s="5"/>`, wiersz z `<c t="b"/>` bez wartości, wiersz z pustym czerwonym `inlineStr`, wiersz z formułą bez wyniku, wiersz z pustą komórką `<c></c>`, wiersz z komórkami rozdzielonymi znakami nowej linii; w `Tryby Ognia` — pusty, sformatowany **pierwszy** wiersz.

| Plik | Python obecny | Python prototyp | Przeglądarka obecna | Przeglądarka prototyp |
| --- | --- | --- | --- | --- |
| oryginalny | `846efd69…cdcdd3` | `846efd69…cdcdd3` | `846efd69…cdcdd3` | `846efd69…cdcdd3` |
| oczyszczony | `846efd69…cdcdd3` | `846efd69…cdcdd3` | `846efd69…cdcdd3` | `846efd69…cdcdd3` |
| brzegowy | `817514dd…213c41` | `817514dd…213c41` | `817514dd…213c41` | `817514dd…213c41` |

(SHA-256 plików `data.json`; pełne skróty: `846efd6958a186a43473d5bba8e70c852eee56dd8d34a34dbf48a75cc5cdcdd3`, `817514dd05cc49127bf825bd8ee16ce3c48d4ae083f8ef86e8ff28f7ec213c41`.)

W pliku brzegowym oba parsery — obecne i prototypowe — zgodnie dają w `Kary do ST` rekordy `"FALSE"` i `{{RED}}{{/RED}}` z komórek bez danych, a w `Tryby Ognia` puste rekordy `{}` i pusty `columnOrder` (pusty pierwszy wiersz został nagłówkiem). To dowód, że filtr zachowuje dotychczasową semantykę także w przypadkach nietypowych (te zachowania omawia rozdz. 12).

### 9.4 Wydajność

| Ścieżka | Obecnie (plik oryginalny) | Prototyp (plik oryginalny) | Plik oczyszczony (obecnie / prototyp) |
| --- | --- | --- | --- |
| Przeglądarka — `loadXlsxMinimal()` | 51,6 s | **5,0 s** | 1,1–1,2 s / 0,8 s |
| Python — cały `build_json.py` | 32–37 s, 1 752 MB | **4,0 s, 250 MB** | 0,7 s, 40 MB / bez zmian |

Pozostały koszt w przeglądarce dla pliku „ciężkiego” to głównie rozpakowanie 108 MB XML (2,3 s) i filtr (1,0 s) — nie do uniknięcia bez czytania strumieniowego, które odrzucono w rozdz. 7.

---

## 10. Uzupełnienie: ostrzeżenie i widoczny postęp

### 10.1 Ostrzeżenie o pustych wierszach

Filtr może przy okazji liczyć usunięte wiersze. Gdy w arkuszu jest ich dużo (próg np. 1 000), generator powinien to zgłosić, żeby problem w XLSX nie był ukryty:

- przeglądarka: `logLine("UWAGA: arkusz „Mutacje” zawiera 1 048 500 pustych, sformatowanych wierszy — warto je usunąć w Excelu (Ctrl + End).", true)` oraz krótka informacja w statusie;
- Python: komunikat na `stderr` (nie zmienia pliku wyjściowego).

Ostrzeżenie nie może trafić do `data.json` — inaczej rozjadą się ścieżki generowania.

### 10.2 Widoczny postęp

`setStatus()` w `DataVault/app.js` (linia 484) to `console.info(msg)` — komunikaty „Generowanie…”, „Zaktualizowano dane” nie są nigdzie widoczne na stronie. Przy dłuższym generowaniu użytkownik nie wie, czy coś się dzieje. Propozycja (osobna decyzja, zmiana wyglądu → aktualizacja `DetaleLayout.md`): na czas generowania zablokować przycisk „Generuj pliki danych”, zmienić jego napis na „Generowanie…” i przywrócić go po zakończeniu lub błędzie. Przed długim, synchronicznym krokiem trzeba oddać sterowanie przeglądarce (`await new Promise((r) => setTimeout(r))`), inaczej napis nie zdąży się odświeżyć.

---

## 11. Zgodność trzech ścieżek (`AGENTS.md` §14)

Zmiana dotyka dwóch plików chronionych zasadą §14 (`xlsxCanonicalParser.js`, `build_json.py`). Wymagania:

1. Reguła filtra **identyczna** w obu plikach (to samo wyrażenie, ten sam warunek pierwszego wiersza, ten sam wyjątek `t="b"`), opisana w obu komentarzach i w `Documentation.md`.
2. Porównanie wyników bajt po bajcie na co najmniej trzech plikach z rozdz. 9.3 (oryginalny, oczyszczony, brzegowy) — 4 pliki `data.json` na każdy plik wejściowy.
3. Walidacja `firebase-import.json` (`validateFirebaseImportObject`) bez zmian — format danych się nie zmienia.
4. `columnOrder` i `sheetOrder` bez zmian (sprawdzane w ramach porównania bajtowego).

---

## 12. Obserwacje przy okazji

Nie są skutkiem filtra — istnieją dziś i prototyp ich nie zmienia.

1. **„Rekordy-widma” z samego formatowania.** Komórka logiczna (`t="b"`) bez wartości daje `"FALSE"`, a pusta komórka tekstowa z czerwonym stylem — `{{RED}}{{/RED}}`. W obu przypadkach wiersz przestaje być pusty i trafia do danych jako rekord. W obecnym pliku takich komórek **nie ma** (sprawdzone na całym `data.json`), ale mogą się pojawić po formatowaniu w Excelu. Ewentualna zmiana (traktowanie ich jak pustych) zmieniłaby wynik dla takich plików, więc wymaga osobnej decyzji.
2. **Pusty pierwszy wiersz psuje cały arkusz.** Nagłówkiem jest pierwszy element `<row>`, nie wiersz z danymi. Jeśli nad nagłówkiem pojawi się pusty, sformatowany wiersz, arkusz traci wszystkie nazwy kolumn (rekordy `{}`). Warto rozważyć ostrzeżenie w takim przypadku.
3. **Dane:** w arkuszu `Specjalne Bonusy Wrogów` są 4 wiersze z samym numerem `LP` (8–11) i pustymi pozostałymi kolumnami. Parser słusznie traktuje je jako rekordy (mają wartość w `LP`), więc w zakładce (widocznej tylko w trybie admina) są 4 puste wiersze. Do poprawy w Excelu (usunąć numery albo uzupełnić dane).

---

## 13. Ryzyka

| Ryzyko | Ocena | Ograniczenie |
| --- | --- | --- |
| Filtr usuwa wiersz, który dawał wartość | niskie — reguła usuwa tylko wiersze z samozamykającymi się komórkami bez `t="b"` | testy brzegowe z rozdz. 9.3 jako stały test kontrolny |
| Rozjazd reguły między JS i Pythonem | średnie przy przyszłych zmianach | identyczne wyrażenia, komentarze wskazujące bliźniaczą funkcję, porównanie bajtowe w testach kontrolnych |
| Nietypowy zapis XML (prefiksy, inne generatory niż Excel) | niskie | filtr ich nie rozpoznaje → brak przyspieszenia, wynik poprawny |
| Wyrażenie regularne na ~100 MB tekstu | niskie — w JS sam filtr trwa 1,0 s, w Pythonie cały `build_json.py` z filtrem 4,0 s | wzorzec bez zagnieżdżonych kwantyfikatorów zależnych od siebie |
| Pamięć w przeglądarce przy „ciężkim” pliku | średnie — sam napis 108 mln znaków zostaje | ostrzeżenie z 10.1 zachęca do oczyszczenia pliku |

---

## 14. Rekomendacje

1. Wdrożyć wariant A w obu parserach jednocześnie, z regułą z rozdz. 8.
2. Dodać ostrzeżenie o liczbie pominiętych pustych wierszy (10.1).
3. Osobną decyzją: widoczny stan generowania (10.2).
4. Osobną decyzją: „rekordy-widma” i pusty pierwszy wiersz (12.1, 12.2) — na razie zostawić bez zmian.
5. Mimo poprawki nadal czyścić XLSX (Ctrl + End) — plik jest wtedy 17× mniejszy, a generowanie najszybsze.

---

## 15. Plan pracy

| Krok | Czynność | Pliki |
| --- | --- | --- |
| 1 | `dropEmptyRows()` + wywołanie w `loadRowsFromXml()`, komentarze PL/EN. | `DataVault/xlsxCanonicalParser.js` |
| 2 | `_drop_empty_rows()` + wywołanie w `_load_rows_from_xml()`, komentarze PL/EN. | `DataVault/build_json.py` |
| 3 | Liczenie usuniętych wierszy i ostrzeżenie powyżej progu (oba pliki; poza `data.json`). | jw. + `DataVault/app.js` (wyświetlenie w trybie admina) |
| 4 | (opcjonalnie, decyzja) widoczny stan generowania. | `DataVault/app.js`, `DataVault/style.css`, `DetaleLayout.md` |
| 5 | Porównanie bajtowe 4 ścieżek × 3 pliki (rozdz. 9.3). | — |
| 6 | Dokumentacja: `DataVault/docs/Documentation.md` (PL i EN) — „Kanoniczny parser XLSX” (nowa reguła, przypadki brzegowe, tabela z 5.3), „Zgodność trzech ścieżek generowania danych” (czwarta rzecz pilnowana ręcznie: reguła pustych wierszy), „Generowanie danych z XLSX”, „Fallbacki i błędy” (ostrzeżenie), „Testy kontrolne”; `DataVault/docs/README.md` (PL i EN) — „Generowanie plików danych — tylko admin” (co oznacza ostrzeżenie i jak oczyścić arkusz). | `DataVault/docs/*` |

Szacunek: ok. 30 linii kodu w każdym parserze (z komentarzami), kilka linii w `app.js`, kilka sekcji dokumentacji.

---

## 16. Testy akceptacyjne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Zgodność — plik oczyszczony | `build_json.py` i „Generuj pliki danych” w adminie. | Identyczne pliki; ten sam SHA-256 co przed zmianą. |
| Zgodność — plik „ciężki” | Jak wyżej na pliku z ~1 mln pustych wierszy. | Identyczne pliki; ten sam SHA-256 co dla pliku oczyszczonego. |
| Zgodność — przypadki brzegowe | Plik brzegowy z rozdz. 9.3 przed i po zmianie, obie ścieżki. | 4 identyczne pliki; w `Kary do ST` nadal rekordy `FALSE` i `{{RED}}{{/RED}}`, w `Tryby Ognia` nadal rekordy `{}`. |
| Czas | Plik „ciężki” w przeglądarce. | Generowanie kilka sekund zamiast około minuty; brak komunikatu o niereagującej stronie. |
| Ostrzeżenie | Plik „ciężki”. | W konsoli (i w statusie) ostrzeżenie z nazwą arkusza i liczbą pustych wierszy; brak ostrzeżenia dla pliku oczyszczonego. |
| Regresja | Pozostałe zakładki DataVault i GeneratorNPC po imporcie. | Bez zmian. |

---

## 17. Następne kroki

1. Decyzja, czy zadanie ma objąć także punkty 10.2 i 12.
2. Implementacja kroków 1–3 i 5–6 z rozdz. 15 jako osobne zadanie (osobny commit).
3. Utrzymanie pliku brzegowego jako stałego materiału do testów kontrolnych (lokalnie, poza repozytorium — `Repozytorium.xlsx` nie jest przechowywany w repozytorium).

---

## 18. Załącznik — metoda pomiarów

- **Środowisko:** kontener chmurowy (Linux), Python 3, Chromium (Playwright, tryb bez okna), JSZip 3.10.1 — ta sama wersja co w `DataVault/index.html`.
- **Przeglądarka:** do strony wstrzyknięto JSZip, parser (oryginał z repozytorium albo kopia z prototypem) i funkcje `replacePolishQuotes`, `norm`, `mergeTraits`, `mergeRange`, `buildDataJsonFromSheets` wycięte 1:1 z `DataVault/app.js`; wynik zapisany `JSON.stringify(data, null, 2)`, jak w `downloadJsonFile()`.
- **Rozkład czasu (6.1):** osobne pomiary `performance.now()` dla każdego etapu na arkuszu `xl/worksheets/sheet12.xml`.
- **Python:** `build_json.py` z repozytorium albo kopia z prototypem; czas i szczytowe RSS przez `resource.getrusage`; rozkład z 6.2 zmierzony osobnym skryptem na tym samym arkuszu.
- **Plik oczyszczony:** skrypt usunął z `sheet12.xml` wiersze bez `<v>`/`<is>` i ustawił `<dimension ref="A1:H35"/>`.
- **Plik brzegowy:** kopia oczyszczona z dopisanymi wierszami opisanymi w 9.3 (`sheet30.xml` — `Kary do ST`, `sheet29.xml` — `Tryby Ognia`); styl czerwony odczytany z `styles.xml` (indeks 27).
- **Porównanie:** SHA-256 wszystkich plików `data.json`.

Wartości bezwzględne czasów na komputerze użytkownika będą inne; proporcje (dziesiątki sekund wobec kilku sekund) — podobne.

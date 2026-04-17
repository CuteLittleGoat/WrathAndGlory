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

# Analiza DataVault — mechanika aktualizacji danych (2026-04-10)

## Prompt użytkownika
> Przeprowadź analizę modułu DataVault. Interesuje mnie mechanika aktualizacji danych.
> Sprawdź czy działa poprawnie.
> Podam przykład.
> Przygotowałem nowy plik Repozytorium.xlsx
> Zmodyfikowałem zakładkę "Premie Frakcji". Wszystkie słowa "lub" zrobiłem italic. Do tego w jednym miejscu jest czerwony font.
> Wgrałem nowy plik "Repozytorium.xlsx". Kliknąłem "Aktualizuj dane". Wygenerował się plik data.json
> Wgrałem nowy plik data.json
>
> W zakładce w aplikacji nie ma formatowania tekstu. Sprawdź czemu. W innych zakładkach na pierwszy rzut oka wygląda ok.
> WAŻNE! W pliku xlsx niektóre komórki mają ustawione wypełnienie. Aplikacja nie może brać pod uwagę wypełnienia. Powinna natomiast brać pod uwagę pogrubienie, pochylenie oraz różne warunki dotyczące czerwonego koloru czy wyjątków np. na ciąg znaków str.

## Wynik analizy (skrót)
- Zgłoszony problem jest **prawidłowy**: ścieżka „Aktualizuj dane” w przeglądarce traci formatowanie rich text (italic/bold/red) z XLSX.
- Mechanizm renderowania w DataVault jest gotowy na formatowanie, ale wymaga znaczników `{{I}}`, `{{B}}`, `{{RED}}` w `data.json`.
- Te znaczniki są generowane przez `build_json.py`, ale **nie** przez generator uruchamiany po kliknięciu „Aktualizuj dane” (JS + SheetJS).
- Wypełnienie komórek (fill) nie jest obecnie używane przez parser Python i to zachowanie jest zgodne z wymaganiem.

## Co dokładnie dzieje się w kodzie

### 1) Renderowanie w aplikacji działa na markerach
Frontend renderuje style na podstawie markerów `{{RED}}`, `{{B}}`, `{{I}}` (funkcje `parseInlineSegments`, `formatInlineHTML`, `formatTextHTML`).
Jeśli markerów nie ma w tekście, styl się nie pojawi.

### 2) „Aktualizuj dane” (app.js) czyta XLSX w sposób, który gubi rich text
Przycisk „Aktualizuj dane” uruchamia `loadXlsxFromRepo()` i czyta arkusze przez:
- `XLSX.read(...)`
- `XLSX.utils.sheet_to_json(...)`

Ta ścieżka pobiera wartości komórek jako tekst i nie rekonstruuje runów rich text oraz formatów fontu dla fragmentów tekstu, więc `data.json` nie dostaje markerów `{{I}}/{{B}}/{{RED}}`.

### 3) `build_json.py` ma własny parser XML i zachowuje formatowanie
Skrypt Python:
- czyta `sharedStrings.xml` i runy (`<r>`),
- wykrywa bold/italic/red,
- opakowuje fragmenty markerami,
- dodatkowo wykrywa czerwony kolor z przypisanego stylu komórki,
- nie używa informacji o wypełnieniu komórki (fill), więc spełnia warunek, by fill ignorować.

## Potwierdzenie na danych
- Obecne `DataVault/data.json` (wygenerowane ścieżką webową) nie zawiera markerów w problematycznej sekcji „Premie Frakcji”.
- Ten sam plik XLSX po przetworzeniu przez `build_json.py` zawiera poprawne markery, np.:
  - `Upór {{I}}lub ... {{/I}}`
  - `{{RED}}[DOWOLNE]{{/RED}} Słowo kluczowe`

## Wniosek końcowy
Problem nie jest w renderowaniu tabeli „Premie Frakcji”, tylko w **sposobie generowania `data.json`** przy użyciu przycisku „Aktualizuj dane” w przeglądarce.

## Rekomendacja
Aby zachować oczekiwane formatowanie (bold/italic/red) i dalej ignorować fill:
1. Generować `data.json` skryptem `DataVault/build_json.py` (ścieżka rekomendowana), albo
2. Przepisać webową ścieżkę `loadXlsxFromRepo()` tak, by parsowała XML XLSX analogicznie do `build_json.py` i produkowała markery stylów.

Do czasu wdrożenia poprawki wariant 1 jest najpewniejszy i już działa zgodnie z wymaganiami.

## Co zostało zmienione po analizie (wdrożona naprawa)

Wdrożono poprawkę w ścieżce webowej **„Aktualizuj dane”** w `DataVault/app.js`:

1. Zmieniono sposób odczytu XLSX w `loadXlsxFromRepo()`:
   - wcześniej dane były pobierane przez `XLSX.utils.sheet_to_json(...)` (co gubiło rich text),
   - teraz workbook jest czytany z opcjami `cellHTML: true` i `cellStyles: true`,
   - a arkusze są przetwarzane własną funkcją `extractSheetRowsWithFormatting(...)`.

2. Dodano parser formatowania inline:
   - `htmlToStyleMarkers(html)` konwertuje HTML rich text z komórki (`cell.h`) na markery:
     - `{{I}}...{{/I}}`
     - `{{B}}...{{/B}}`
     - `{{RED}}...{{/RED}}`
   - parser obsługuje znaczniki `<i>/<em>`, `<b>/<strong>`, `<span style="color: ...">` oraz `<br>`.

3. Dodano wykrywanie czerwonego koloru:
   - `isRedColorValue(...)` rozpoznaje m.in. `red`, `#f00`, `#ff0000`, `#ffff0000`, `rgb(255,0,0)`, `rgba(255,0,0,1)`.

4. Dodano bezpieczny odczyt wartości komórki:
   - `getCellTextWithMarkers(...)` preferuje `cell.h` (z markerami), a w pozostałych przypadkach używa `cell.w` / `cell.v`.

5. Zachowano wymaganie biznesowe dotyczące fill:
   - mechanizm **nie** bierze pod uwagę wypełnienia/tła komórki (fill/background),
   - uwzględnia tylko formatowanie tekstu inline (bold/italic/red).

6. Zaktualizowano dokumentację modułu DataVault:
   - `DataVault/docs/README.md` (PL/EN) — doprecyzowano zachowanie przycisku „Aktualizuj dane”,
   - `DataVault/docs/Documentation.md` — dopisano techniczne szczegóły nowej ścieżki parsowania.

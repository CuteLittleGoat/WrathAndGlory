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

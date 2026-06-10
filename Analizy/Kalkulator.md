# Kalkulator — rozbudowa tabeli maksymalnych wartości atrybutów

## Data analizy

2026-06-10

## Temat analizy

Rozbudowa pomocniczych tabel maksymalnych wartości atrybutów w module Kalkulator o sześć nowych wpisów ras/gatunków.

## Oryginalny pełny prompt użytkownika

```text
Pracuj w repozytorium WrathAndGlory.\n\nZadanie:\nRozbuduj wyłącznie tabelę pomocniczą „Maksymalne wartości atrybutów” w dwóch plikach modułu Kalkulator:\n\n1. Kalkulator/TworzeniePostaci.html\n2. Kalkulator/KalkulatorXP.html\n\nDodatkowo utwórz nowy plik dokumentacyjno-analityczny:\n\n3. Analizy/Kalkulator.md\n\nNie zmieniaj mechaniki przeliczania PD, limitów pól input, kosztów atrybutów ani kosztów umiejętności. Na tym etapie Vespid z wartością Szybkość = 14 ma być tylko wyświetlany w tabeli pomocniczej. Nie rozszerzaj inputów powyżej 12 i nie dodawaj kosztów dla wartości powyżej 12.\n\nDane do dopisania do tabeli pomocniczej:\n\n| Rasa (PL)         | Race (EN)       | Siła | Wytrzymałość | Zręczność | Inicjatywa | Siła Woli | Inteligencja | Ogłada | Szybkość |\n|-------------------|-----------------|------|--------------|-----------|------------|-----------|--------------|--------|----------|\n| Kasta powietrza   | Air Caste       | 4    | 4            | 10        | 8          | 8         | 8            | 8      | 8        |\n| Kasta ziemi       | Earth Caste     | 6    | 6            | 8         | 8          | 8         | 10           | 8      | 6        |\n| Kasta ognia       | Fire Caste      | 7    | 7            | 8         | 8          | 8         | 8            | 8      | 8        |\n| Kasta wody        | Water Caste     | 6    | 6            | 8         | 8          | 8         | 8            | 10     | 6        |\n| Niebianie         | Ethereal Caste  | 6    | 6            | 8         | 8          | 10        | 8            | 8      | 6        |\n| Vespidzi          | Vespid          | 8    | 8            | 12        | 8          | 8         | 8            | 5      | 14       |\n\nWażne:\n- W pliku wejściowym była literówka „Ethernal Caste”. Poprawna wersja to „Ethereal Caste”.\n- Zachowaj istniejące 10 wpisów ras/gatunków bez zmian.\n- Nowe wpisy dodaj po istniejącym `race_10`.\n- Użyj kolejnych kluczy:\n  - `race_11`: Kasta powietrza / Air Caste\n  - `race_12`: Kasta ziemi / Earth Caste\n  - `race_13`: Kasta ognia / Fire Caste\n  - `race_14`: Kasta wody / Water Caste\n  - `race_15`: Niebianie / Ethereal Caste\n  - `race_16`: Vespidzi / Vespid\n\nSzczegóły zmian w `Kalkulator/TworzeniePostaci.html`:\n- Rozszerz `translations.pl.races` o `race_11`–`race_16`.\n- Rozszerz `translations.en.races` o `race_11`–`race_16`.\n- Rozszerz tablicę `maxAttributeRows` o sześć nowych obiektów:\n  - `{ race: 'race_11', values: [4, 4, 10, 8, 8, 8, 8, 8] }`\n  - `{ race: 'race_12', values: [6, 6, 8, 8, 8, 10, 8, 6] }`\n  - `{ race: 'race_13', values: [7, 7, 8, 8, 8, 8, 8, 8] }`\n  - `{ race: 'race_14', values: [6, 6, 8, 8, 8, 8, 10, 6] }`\n  - `{ race: 'race_15', values: [6, 6, 8, 8, 10, 8, 8, 6] }`\n  - `{ race: 'race_16', values: [8, 8, 12, 8, 8, 8, 5, 14] }`\n- Nie zmieniaj `maxAttributeKeys`, funkcji `renderSpeciesMaxTable()`, kosztów PD ani limitów inputów.\n\nSzczegóły zmian w `Kalkulator/KalkulatorXP.html`:\n- Rozszerz `translations.pl.races` o `race_11`–`race_16`.\n- Rozszerz `translations.en.races` o `race_11`–`race_16`.\n- Rozszerz tablicę `attributeMaximumRows` o sześć nowych obiektów:\n  - `{ race: "race_11", values: [4, 4, 10, 8, 8, 8, 8, 8] }`\n  - `{ race: "race_12", values: [6, 6, 8, 8, 8, 10, 8, 6] }`\n  - `{ race: "race_13", values: [7, 7, 8, 8, 8, 8, 8, 8] }`\n  - `{ race: "race_14", values: [6, 6, 8, 8, 8, 8, 10, 6] }`\n  - `{ race: "race_15", values: [6, 6, 8, 8, 10, 8, 8, 6] }`\n  - `{ race: "race_16", values: [8, 8, 12, 8, 8, 8, 5, 14] }`\n- Nie zmieniaj `attributeKeys`, funkcji `renderMaxAttributesTable(lang)`, kosztów PD ani limitów inputów.\n\nUtwórz plik `Analizy/Kalkulator.md`.\n\nTen plik ma dokładnie opisać zmianę i ma później służyć jako wsad do aktualizacji analogicznych kalkulatorów w innych repozytoriach. Zawrzyj w nim przynajmniej następujące sekcje:\n\n1. `# Kalkulator — rozbudowa tabeli maksymalnych wartości atrybutów`\n2. `## Cel zmiany`\n   - Opisz, że zmiana dotyczy wyłącznie tabel pomocniczych maksymalnych wartości atrybutów.\n3. `## Zmienione pliki`\n   - Wymień:\n     - `Kalkulator/TworzeniePostaci.html`\n     - `Kalkulator/KalkulatorXP.html`\n4. `## Dodane dane`\n   - Dodaj tabelę Markdown z nowymi wpisami PL/EN i wartościami.\n5. `## Korekta danych wejściowych`\n   - Opisz korektę literówki: `Ethernal Caste` → `Ethereal Caste`.\n6. `## Zakres zmian w TworzeniePostaci.html`\n   - Opisz, które struktury zostały rozszerzone:\n     - `translations.pl.races`\n     - `translations.en.races`\n     - `maxAttributeRows`\n7. `## Zakres zmian w KalkulatorXP.html`\n   - Opisz, które struktury zostały rozszerzone:\n     - `translations.pl.races`\n     - `translations.en.races`\n     - `attributeMaximumRows`\n8. `## Czego celowo nie zmieniono`\n   - Wyraźnie napisz:\n     - nie zmieniono mechaniki przeliczania PD,\n     - nie zmieniono `attributeCosts`,\n     - nie zmieniono `skillCosts`,\n     - nie zmieniono limitów pól input,\n     - wartość `Szybkość = 14` dla Vespidów dotyczy tylko tabeli pomocniczej.\n9. `## Instrukcja przeniesienia zmiany do innych repozytoriów`\n   - Opisz krok po kroku, jak analogicznie znaleźć i rozszerzyć:\n     - tablicę z wierszami ras/gatunków,\n     - tłumaczenia PL/EN nazw ras/gatunków,\n     - ewentualne nazwy atrybutów, jeśli w innym repo mają inne klucze.\n10. `## Lista kontrolna`\n   - Dodaj checklistę:\n     - czy nowe wpisy są widoczne po polsku,\n     - czy nowe wpisy są widoczne po angielsku,\n     - czy Vespid ma Szybkość 14 w tabeli,\n     - czy nie zmieniono mechaniki kosztów PD,\n     - czy nie zmieniono limitów inputów.\n\nWymagania jakościowe:\n- Zachowaj istniejący styl kodu w obu plikach.\n- Nie wykonuj pełnego formatowania całych plików.\n- Nie zmieniaj układu HTML, CSS ani tekstów niezwiązanych z tabelą pomocniczą.\n- Nie zmieniaj nazw istniejących kluczy `race_1`–`race_10`.\n- Nie przenoś danych do osobnego pliku JSON.\n- Nie dodawaj nowych bibliotek.\n- Po zmianie sprawdź, że w obu plikach występują wszystkie nowe nazwy:\n  - Kasta powietrza / Air Caste\n  - Kasta ziemi / Earth Caste\n  - Kasta ognia / Fire Caste\n  - Kasta wody / Water Caste\n  - Niebianie / Ethereal Caste\n  - Vespidzi / Vespid\n- Sprawdź, że nie występuje błędna forma `Ethernal Caste`.\n- Sprawdź, że `attributeCosts`, `skillCosts` oraz limity inputów nie zostały zmienione.\n\nNa koniec pokaż krótkie podsumowanie zmienionych plików i najważniejszych zmian.
```

## Zakres analizy

Analiza obejmuje wyłącznie wskazane pliki modułu Kalkulator oraz wymagany plik dokumentacyjno-analityczny. Zakres obejmuje dopisanie nowych wpisów tłumaczeń PL/EN i danych tabel pomocniczych oraz potwierdzenie, że mechanika PD, koszty i limity pól input nie są rozszerzane.

## Cel zmiany

Zmiana dotyczy wyłącznie tabel pomocniczych maksymalnych wartości atrybutów w module Kalkulator. Jej celem jest dopisanie sześciu nowych ras/gatunków wraz z nazwami polskimi, nazwami angielskimi oraz maksymalnymi wartościami ośmiu atrybutów prezentowanymi użytkownikowi w tabeli informacyjnej.

Zmiana nie wpływa na mechanikę obliczania PD, walidację kosztów, dostępne zakresy pól edycyjnych ani tabele kosztów rozwoju postaci. Wartość `Szybkość = 14` dla Vespidów jest wyłącznie wartością pokazywaną w tabeli pomocniczej.

## Zmienione pliki

- `Kalkulator/TworzeniePostaci.html`
- `Kalkulator/KalkulatorXP.html`

## Dodane dane

| Klucz | Rasa (PL) | Race (EN) | Siła | Wytrzymałość | Zręczność | Inicjatywa | Siła Woli | Inteligencja | Ogłada | Szybkość |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `race_11` | Kasta powietrza | Air Caste | 4 | 4 | 10 | 8 | 8 | 8 | 8 | 8 |
| `race_12` | Kasta ziemi | Earth Caste | 6 | 6 | 8 | 8 | 8 | 10 | 8 | 6 |
| `race_13` | Kasta ognia | Fire Caste | 7 | 7 | 8 | 8 | 8 | 8 | 8 | 8 |
| `race_14` | Kasta wody | Water Caste | 6 | 6 | 8 | 8 | 8 | 8 | 10 | 6 |
| `race_15` | Niebianie | Ethereal Caste | 6 | 6 | 8 | 8 | 10 | 8 | 8 | 6 |
| `race_16` | Vespidzi | Vespid | 8 | 8 | 12 | 8 | 8 | 8 | 5 | 14 |

## Korekta danych wejściowych

W danych wejściowych występowała literówka `Ethernal Caste`. Poprawna angielska nazwa wpisu `race_15` to `Ethereal Caste` i taka forma została użyta w tłumaczeniach oraz w tabeli danych do przeniesienia.

## Zakres zmian w TworzeniePostaci.html

W pliku `Kalkulator/TworzeniePostaci.html` rozszerzono wyłącznie struktury używane przez pomocniczą tabelę maksymalnych wartości atrybutów:

- `translations.pl.races` — dopisano klucze `race_11`–`race_16` z polskimi nazwami ras/gatunków.
- `translations.en.races` — dopisano klucze `race_11`–`race_16` z angielskimi nazwami ras/gatunków.
- `maxAttributeRows` — dopisano sześć obiektów z wartościami maksymalnymi atrybutów dla kluczy `race_11`–`race_16`.

Nie zmieniono listy `maxAttributeKeys`, funkcji `renderSpeciesMaxTable()`, pól formularza ani żadnych struktur kosztów PD.

## Zakres zmian w KalkulatorXP.html

W pliku `Kalkulator/KalkulatorXP.html` rozszerzono wyłącznie struktury używane przez pomocniczą tabelę maksymalnych wartości atrybutów:

- `translations.pl.races` — dopisano klucze `race_11`–`race_16` z polskimi nazwami ras/gatunków.
- `translations.en.races` — dopisano klucze `race_11`–`race_16` z angielskimi nazwami ras/gatunków.
- `attributeMaximumRows` — dopisano sześć obiektów z wartościami maksymalnymi atrybutów dla kluczy `race_11`–`race_16`.

Nie zmieniono listy `attributeKeys`, funkcji `renderMaxAttributesTable(lang)`, pól formularza ani żadnych struktur kosztów PD.

## Czego celowo nie zmieniono

- Nie zmieniono mechaniki przeliczania PD.
- Nie zmieniono `attributeCosts`.
- Nie zmieniono `skillCosts`.
- Nie zmieniono limitów pól input.
- Wartość `Szybkość = 14` dla Vespidów dotyczy tylko tabeli pomocniczej i nie rozszerza dozwolonych wartości wpisywanych w formularzach.

## Instrukcja przeniesienia zmiany do innych repozytoriów

1. Otwórz plik lub pliki kalkulatora zawierające tabelę maksymalnych wartości atrybutów ras/gatunków.
2. Znajdź tablicę z wierszami ras/gatunków. W tym repozytorium są to:
   - `maxAttributeRows` w `Kalkulator/TworzeniePostaci.html`,
   - `attributeMaximumRows` w `Kalkulator/KalkulatorXP.html`.
3. Dopisz po istniejącym wpisie `race_10` sześć nowych obiektów dla kluczy `race_11`–`race_16`, zachowując kolejność wartości zgodną z kolejnością atrybutów używaną przez dany kalkulator.
4. Znajdź tłumaczenia polskich nazw ras/gatunków. W tym repozytorium jest to `translations.pl.races`.
5. Dopisz do tłumaczeń polskich klucze:
   - `race_11`: `Kasta powietrza`,
   - `race_12`: `Kasta ziemi`,
   - `race_13`: `Kasta ognia`,
   - `race_14`: `Kasta wody`,
   - `race_15`: `Niebianie`,
   - `race_16`: `Vespidzi`.
6. Znajdź tłumaczenia angielskich nazw ras/gatunków. W tym repozytorium jest to `translations.en.races`.
7. Dopisz do tłumaczeń angielskich klucze:
   - `race_11`: `Air Caste`,
   - `race_12`: `Earth Caste`,
   - `race_13`: `Fire Caste`,
   - `race_14`: `Water Caste`,
   - `race_15`: `Ethereal Caste`,
   - `race_16`: `Vespid`.
8. Jeżeli inne repozytorium używa innych kluczy atrybutów lub innej kolejności atrybutów, najpierw ustal aktualną kolejność nazw atrybutów w tabeli. Następnie przepisz wartości z tabeli danych tak, aby każda liczba trafiła do właściwej kolumny.
9. Nie przenoś tych danych do osobnego pliku, jeżeli analogiczny kalkulator przechowuje dane bezpośrednio w HTML lub JavaScript.
10. Nie rozszerzaj pól input powyżej aktualnych limitów i nie dodawaj kosztów dla wartości powyżej istniejących tabel kosztów, chyba że osobne zadanie wyraźnie wymaga zmiany mechaniki.
11. Po przeniesieniu sprawdź widok tabeli w wersji polskiej i angielskiej oraz wyszukaj błędną formę `Ethernal Caste`.

## Lista kontrolna

- [ ] Nowe wpisy są widoczne po polsku.
- [ ] Nowe wpisy są widoczne po angielsku.
- [ ] Vespid ma `Szybkość = 14` w tabeli.
- [ ] Nie zmieniono mechaniki kosztów PD.
- [ ] Nie zmieniono limitów inputów.

## Wnioski

Wprowadzenie sześciu nowych wpisów wymaga rozszerzenia tłumaczeń nazw ras/gatunków oraz tablicy danych używanej przez tabelę pomocniczą w każdym kalkulatorze. Dane można przenosić do analogicznych repozytoriów bez ingerencji w mechanikę obliczeń, o ile zachowana jest lokalna kolejność kolumn atrybutów.

## Rekomendacje

Przy przenoszeniu zmiany do innych repozytoriów należy najpierw sprawdzić lokalne nazwy struktur i kolejność atrybutów, a następnie dopisać wpisy po istniejącym `race_10`. Nie należy przy tej operacji rozszerzać zakresu pól input ani tabel kosztów, jeśli zadanie dotyczy tylko tabeli pomocniczej.

## Ryzyka

Główne ryzyko polega na błędnym utożsamieniu wartości `Szybkość = 14` dla Vespidów z limitem edytowalnego pola w kalkulatorze. W tej zmianie ta wartość jest informacyjna i dotyczy tylko tabeli pomocniczej. Drugim ryzykiem jest przepisanie literówki `Ethernal Caste` zamiast poprawnej formy `Ethereal Caste`.

## Następne kroki

- Sprawdzić w przeglądarce, czy tabela pomocnicza pokazuje nowe wiersze w wersji polskiej i angielskiej.
- Przy osobnym zadaniu można rozważyć aktualizację analogicznych kalkulatorów w innych repozytoriach zgodnie z instrukcją przeniesienia.
- Nie zmieniać kosztów ani limitów inputów bez oddzielnego wymagania projektowego.

## Aktualizacja: przypis dla stałej Szybkości Vespidów w generatorze postaci

Vespidzi / Vespids mają stałą Szybkość równą dokładnie `14`. Nie jest to zakres wartości i nie należy traktować tej liczby jako zwykłego zakupu PD.

W pliku `Kalkulator/TworzeniePostaci.html` przy wartości `14` w pomocniczej tabeli maksymalnych wartości atrybutów dodano prezentacyjną gwiazdkę wyłącznie dla komórki:

- rasa/gatunek: `race_16`, czyli PL `Vespidzi` / EN `Vespid`,
- atrybut: `attribute_8`, czyli PL `Szybkość` / EN `Speed`,
- wartość źródłowa: liczba `14`,
- wartość widoczna w tabeli generatora postaci: `14*`.

Pod tabelą w modalu generatora postaci dodano przypis w wersji PL i EN:

- PL: `* Vespidzi mają stałą Szybkość równą 14. Na potrzeby obliczeń PD zignoruj pole Szybkość.`
- EN: `* Vespids have a fixed Speed value of 14. For XP calculation purposes, ignore the Speed field.`

Przypis jest częścią systemu tłumaczeń (`translations.pl.maxAttributesFootnotes` oraz `translations.en.maxAttributesFootnotes`). Dzięki temu można rozszerzyć go o kolejne języki przez dopisanie odpowiedniego tekstu pod tym samym kluczem, bez przepisywania funkcji renderującej tabelę.

Wartość w danych tabeli pozostaje liczbą `14` w `maxAttributeRows`. Gwiazdka jest wyłącznie elementem prezentacji dodawanym podczas renderowania komórki przez `renderSpeciesMaxTable()`. Mechanika obliczania PD nie została zmieniona.

`Kalkulator/KalkulatorXP.html` celowo nie otrzymuje gwiazdki ani przypisu. Osobny kalkulator PD nadal pokazuje Vespidów / Vespid z wartością Szybkości `14` bez oznaczenia `*`, ponieważ przypis dotyczy tylko generatora postaci i ręcznej interpretacji pola Szybkość przy tworzeniu Vespidów.

## Czego celowo nie zmieniono

- Nie zmieniono `attributeCosts`.
- Nie zmieniono `skillCosts`.
- Nie zmieniono limitów pól input.
- Nie dodano obsługi przeliczania wartości Szybkości `14`.
- Szybkość `14` dla Vespidów pozostaje informacją w tabeli pomocniczej.
- Gwiazdka i przypis występują tylko w `Kalkulator/TworzeniePostaci.html`.
- W `Kalkulator/KalkulatorXP.html` wartość `14` pozostaje bez gwiazdki i bez przypisu.

## Instrukcja przeniesienia zmiany do innych repozytoriów

1. Znajdź widok generatora postaci, w którym tabela maksymalnych wartości atrybutów pełni funkcję pomocy przy tworzeniu postaci.
2. Znajdź funkcję renderującą tabelę maksymalnych wartości atrybutów.
3. Znajdź wpis `race_16` / `Vespidzi` / `Vespid`.
4. Zachowaj wartość Szybkości jako liczbę `14` w danych.
5. Dodaj gwiazdkę tylko w warstwie renderowania generatora postaci.
6. Dodaj przypis do struktury tłumaczeń.
7. Wyrenderuj przypis pod tabelą.
8. Nie dodawaj tej gwiazdki ani przypisu do osobnego kalkulatora PD, chyba że w danym repozytorium zostanie podjęta osobna decyzja.
9. Nie zmieniaj mechaniki kosztów PD ani limitów inputów.

## Lista kontrolna po aktualizacji przypisu Vespidów

- [ ] W `Kalkulator/TworzeniePostaci.html` przy Vespidach/Vespidach w kolumnie Szybkość/Speed widoczna jest wartość `14*`.
- [ ] Gwiazdka nie pojawia się przy nagłówku kolumny.
- [ ] Gwiazdka nie pojawia się przy innych rasach/gatunkach.
- [ ] Pod tabelą w generatorze postaci widoczny jest polski przypis.
- [ ] Po przełączeniu na angielski widoczny jest angielski przypis.
- [ ] Przypis jest pobierany ze struktury tłumaczeń.
- [ ] Wartość w danych pozostaje liczbą `14`, a nie stringiem `14*`.
- [ ] W `Kalkulator/KalkulatorXP.html` nie ma gwiazdki przy wartości `14`.
- [ ] W `Kalkulator/KalkulatorXP.html` nie ma przypisu dla Vespidów.
- [ ] Nie zmieniono `attributeCosts`.
- [ ] Nie zmieniono `skillCosts`.
- [ ] Nie zmieniono limitów inputów.
- [ ] Nie zmieniono mechaniki przeliczania PD.
- [ ] Nie występuje błędna forma `Ethernal Caste`.

## Zmiany wykonane w kodzie

### Plik: `Kalkulator/TworzeniePostaci.html`

Lokalizacja: modal `#speciesMaxModal`

Było:

```html
<table class="table species-max-table" id="speciesMaxTable"></table>
```

Jest:

```html
<table class="table species-max-table" id="speciesMaxTable"></table>
<div id="speciesMaxFootnotes" class="species-max-footnotes"></div>
```

Lokalizacja: `translations.pl.maxAttributesFootnotes` i `translations.en.maxAttributesFootnotes`

Było: brak osobnej struktury tłumaczeń dla przypisu Vespidów.

Jest: dodany klucz `vespidSpeedFixed` z pełnym tekstem PL i EN.

Lokalizacja: stałe przy `maxAttributeRows` i `maxAttributeKeys`

Było: brak struktury opisującej specjalne przypisy komórek tabeli.

Jest:

```js
const maxAttributeFootnotes = [
  { race: 'race_16', attribute: 'attribute_8', marker: '*', noteKey: 'vespidSpeedFixed' }
];
```

Lokalizacja: funkcja `renderSpeciesMaxTable()`

Było:

```js
td.innerText = String(value);
```

Jest: funkcja wykrywa tylko komórkę `race_16` + `attribute_8`, wyświetla ją jako `14*`, zbiera klucz przypisu i renderuje tekst przypisu pod tabelą na podstawie aktualnego języka.

### Plik: `Kalkulator/KalkulatorXP.html`

Lokalizacja: tabela maksymalnych wartości atrybutów i funkcja `renderMaxAttributesTable(lang)`

Było: wartość Vespidów dla Szybkości była zwykłą liczbą `14` bez przypisu.

Jest: pozostawiono zwykłą liczbę `14` bez gwiazdki i bez przypisu; nie wprowadzono zmian w tym pliku.

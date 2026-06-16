# Analiza zmiany kolumn w zakładce `Notatki` modułu DataVault

## Zakres zmiany

Planowana zmiana dotyczy arkusza `Notatki` używanego przez moduł `DataVault`:

- zmiana nazwy kolumny `Co` na `Nazwa`,
- dodanie nowej kolumny `Opis`,
- docelowy układ arkusza: `LP` → `Nazwa` → `Opis` → `Podręcznik` → `Strona`,
- kolumna `LP` pozostaje kolumną techniczną i nadal nie powinna być widoczna w interfejsie.

Zmiana jest logicznie spójna z pozostałymi arkuszami, ponieważ `Nazwa` i `Opis` są już standardowymi nazwami kolumn używanymi w wielu częściach repozytorium danych.

## Aktualny stan w repozytorium

### Dane i kolejność kolumn

Moduł `DataVault` nie ma osobnej, ręcznie wpisanej listy kolumn dla arkusza `Notatki` w logice tabeli. Kolumny są wyprowadzane z danych oraz z metadanych `_meta.columnOrder` generowanych na podstawie nagłówków arkusza `Repozytorium.xlsx`.

Oznacza to, że sama zmiana nagłówka `Co` na `Nazwa` oraz dodanie nagłówka `Opis` w arkuszu źródłowym powinny zostać przeniesione do danych po ponownym wygenerowaniu plików danych.

Kolumny techniczne `LP` i `Stan` są ukrywane globalnie przez logikę aplikacji. Zmiana `Co` → `Nazwa` nie wymaga dodawania żadnej nowej kolumny technicznej ani zmiany tego mechanizmu.

### Parsery XLSX

Zarówno parser przeglądarkowy, jak i skrypt referencyjny generujący `data.json`, pobierają nazwy kolumn z nagłówków arkusza. Nie ma tu specjalnego, twardo zakodowanego wyjątku dla kolumny `Co`.

W praktyce oznacza to, że po zmianie arkusza źródłowego:

- `Co` przestanie istnieć jako klucz danych,
- `Nazwa` stanie się nowym kluczem dla dotychczasowej zawartości kolumny `Co`,
- `Opis` stanie się nowym kluczem danych,
- `_meta.columnOrder.Notatki` powinno przyjąć kolejność: `Nazwa`, `Opis`, `Podręcznik`, `Strona`.

### CSS i szerokości kolumn

Aktualnie `DataVault/style.css` ma osobny blok stylów dla arkusza `Notatki`, który nadal odwołuje się do kolumny `Co`. Ten blok trzeba zaktualizować, ponieważ po zmianie danych selektor `data-col="Co"` nie będzie już pasował do żadnej kolumny.

Trzeba dodać osobne reguły dla `Nazwa` i `Opis` w arkuszu `Notatki` oraz zaktualizować regułę `Podręcznik`, jeżeli ma mieć jawnie przypisaną szerokość zamiast obecnego `auto`.

### Dokumentacja

Po wdrożeniu zmiany trzeba zaktualizować co najmniej:

- `Kolumny.md`, ponieważ zawiera tabelę szerokości dla zakładki `Notatki`,
- `DataVault/docs/Documentation.md`, ponieważ opisuje aktualny układ kolumn i szczegóły CSS,
- ewentualnie `DataVault/docs/README.md`, jeżeli opis użytkownika odnosi się do kolumny `Co` albo do układu zakładki `Notatki`.

Jeżeli zmiana będzie wdrażana w kodzie, należy pamiętać o zasadzie z `AGENTS.md`: po zmianach kodu dokumentacja modułu musi opisywać aktualny stan, bez historii zmian.

## Proponowane szerokości kolumn

Rekomendowany docelowy wpis dla sekcji `Notatki` w `Kolumny.md`:

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | auto | lewo | standard |
| Opis | 56ch | auto | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | auto | środek | standard |

Uzasadnienie:

- `Nazwa` jako 26ch jest zgodna z często używaną szerokością kolumn nazw w innych arkuszach. Daje więcej miejsca niż dotychczasowe 20ch dla `Co`, ale nadal nie dominuje tabeli.
- `Opis` jako 56ch pasuje do semantycznych kolumn opisowych w innych arkuszach. To najważniejsza nowa kolumna, więc powinna mieć szerokość pozwalającą wygodnie czytać dłuższe notatki.
- `Podręcznik` jako 17ch jest spójny z globalną szerokością kolumn źródłowych. Jeżeli w arkuszu `Notatki` faktycznie występuje prawie wyłącznie wartość `Główny`, można rozważyć 10ch, ale 17ch jest bezpieczniejsze dla dłuższych nazw źródeł.
- `Strona` jako 6ch powinna zostać zachowana, bo jest to kompaktowa kolumna referencyjna. Wyrównanie do środka będzie czytelniejsze dla numerów stron niż obecne wyrównanie do lewej.

## Rekomendowany zakres wdrożenia

### 1. Zmiana danych źródłowych

W pliku `Repozytorium.xlsx`, w arkuszu `Notatki`:

1. zmienić nagłówek `Co` na `Nazwa`,
2. dodać kolumnę `Opis` bezpośrednio po `Nazwa`,
3. przenieść dotychczasowe tytuły/hasła z `Co` do `Nazwa`,
4. wypełnić `Opis` opisami notatek albo zostawić puste/`-` tam, gdzie opis nie jest jeszcze potrzebny,
5. zachować `LP` jako kolumnę techniczną do sortowania.

### 2. Regeneracja danych

Po zmianie XLSX trzeba ponownie wygenerować dane dla DataVault:

- `data.json` jako backup/pomocniczy artefakt,
- `firebase-import.json` jako plik do importu w Firebase Realtime Database.

Ponieważ runtime produkcyjny korzysta z Firebase, sama zmiana pliku źródłowego nie wystarczy. Nowy payload musi zostać zaimportowany tak, aby dane pod `/datavault/live` zawierały już `Nazwa` i `Opis` zamiast starego `Co`.

### 3. Zmiana CSS

W `DataVault/style.css` trzeba zastąpić blok `Notatki` oparty o `data-col="Co"` regułami dla `Nazwa` i `Opis`.

Docelowy sens reguł:

```css
/* Notatki — override względem globalnych reguł Podręcznik/Strona */
.tableWrap table[data-sheet="Notatki"] th[data-col="Nazwa"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Nazwa"]{
  min-width:26ch;
  max-width:auto;
  text-align:left;
  white-space:normal;
}
.tableWrap table[data-sheet="Notatki"] th[data-col="Opis"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Opis"]{
  min-width:56ch;
  max-width:auto;
  text-align:left;
  white-space:normal;
}
.tableWrap table[data-sheet="Notatki"] th[data-col="Podręcznik"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Podręcznik"]{
  min-width:17ch;
  max-width:none;
  text-align:left;
  white-space:normal;
}
.tableWrap table[data-sheet="Notatki"] th[data-col="Strona"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Strona"]{
  min-width:6ch;
  max-width:auto;
  text-align:center;
  white-space:normal;
}
```

### 4. Aktualizacja dokumentacji

Po zmianie kodu i danych trzeba zaktualizować:

- sekcję `## Notatki` w `Kolumny.md`,
- sekcję szerokości kolumn w `DataVault/docs/Documentation.md`,
- ewentualne wzmianki o `Co` w `DataVault/docs/README.md`.

Nie należy opisywać w dokumentacji modułu, że „wcześniej było `Co`”. Dokumentacja po wdrożeniu ma opisywać wyłącznie aktualny stan.

## Ryzyka i zależności

### Zgodność danych i CSS

Najważniejsze ryzyko to rozjazd między danymi a stylami:

- jeżeli dane zostaną zmienione na `Nazwa`/`Opis`, ale CSS zostanie stary, kolumny będą działały, lecz `Nazwa` i `Opis` nie dostaną docelowych szerokości,
- jeżeli CSS zostanie zmieniony wcześniej, ale Firebase nadal będzie zawierać `Co`, stara kolumna `Co` wyświetli się bez specjalnej szerokości dla `Notatek`.

Nie powinno to zablokować działania aplikacji, ale pogorszy układ tabeli. Najlepiej wdrożyć zmianę danych, CSS i dokumentacji razem.

### Filtry i porównywanie

Filtry per kolumna, globalne wyszukiwanie i porównywanie rekordów powinny zadziałać automatycznie, ponieważ operują na aktualnej liście kolumn. Trzeba jedynie pamiętać, że ewentualne zapamiętane w sesji filtry użytkownika dla starej kolumny `Co` nie będą miały sensu po zmianie nazwy kolumny.

### Sortowanie domyślne

Sortowanie domyślne `Notatek` powinno pozostać oparte o ukrytą kolumnę `LP`. Zmiana `Co` → `Nazwa` i dodanie `Opis` nie powinny wpływać na ten mechanizm.

## Wniosek

Zmiana jest bezpieczna i ma sens porządkujący. W logice danych nie widać potrzeby specjalnej migracji w JavaScript, bo kolumny są dynamiczne i pochodzą z nagłówków XLSX oraz `_meta.columnOrder`. Wymagana będzie natomiast aktualizacja arkusza źródłowego, ponowne wygenerowanie/import danych, zmiana selektorów CSS dla zakładki `Notatki` oraz aktualizacja dokumentacji szerokości kolumn.

Rekomenduję przyjąć układ: `LP` → `Nazwa` → `Opis` → `Podręcznik` → `Strona`, z szerokościami `Nazwa: 26ch`, `Opis: 56ch`, `Podręcznik: 17ch`, `Strona: 6ch`.

## Zmiany wykonane w kodzie

### Plik: `DataVault/style.css`

Lokalizacja: blok CSS `Notatki — szerokości aktualnych kolumn arkusza / Notes — widths for current sheet columns`

Było:

```css
.tableWrap table[data-sheet="Notatki"] th[data-col="Co"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Co"]{
  min-width:20ch;
}
```

Jest:

```css
.tableWrap table[data-sheet="Notatki"] th[data-col="Nazwa"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Nazwa"]{
  min-width:26ch;
}
.tableWrap table[data-sheet="Notatki"] th[data-col="Opis"],
.tableWrap table[data-sheet="Notatki"] td[data-col="Opis"]{
  min-width:56ch;
}
```

### Plik: `Kolumny.md`

Lokalizacja: sekcja `## Notatki`

Było:

```markdown
| Co | 20ch | auto | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | 6ch | auto | lewo | standard |
```

Jest:

```markdown
| Nazwa | 26ch | auto | lewo | standard |
| Opis | 56ch | auto | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | auto | środek | standard |
```

### Plik: `DataVault/docs/Documentation.md`

Lokalizacja: techniczny opis szerokości kolumn zakładki `Notatki`

Było: dokumentacja techniczna opisywała kolumny `Co`, `Podręcznik`, `Strona` dla zakładki `Notatki`.

Jest: dokumentacja techniczna opisuje aktualne kolumny `Nazwa`, `Opis`, `Podręcznik`, `Strona`, ukrytą kolumnę techniczną `LP` oraz wyrównanie `Strona` do środka.

### Plik: `DetaleLayout.md`

Lokalizacja: sekcja `3) Zasady formatowania tekstu i wyjątki`

Było: globalny opis kolumn `Podręcznik` i `Strona` nie wyszczególniał aktualnego wyjątku dla zakładki `Notatki`.

Jest: opis layoutu wskazuje aktualne szerokości zakładki `Notatki`: `Nazwa` 26ch, `Opis` 56ch, `Podręcznik` 17ch, `Strona` 6ch ze środkiem oraz dopuszczalnym zawijaniem długich wartości.

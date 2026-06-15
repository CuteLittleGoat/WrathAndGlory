# Wymagania wdrożeniowe — rozbudowa DataVault o zakładki pojazdów i zabezpieczenie GeneratorNPC

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`
**Docelowy plik XLSX z danymi:** `Analizy/Repozytorium.xlsx`
**Zakres:** rozbudowa DataVault o zakładki pojazdów, nowe metadane, nowe style, widoki domyślne, generowanie artefaktów JSON oraz zabezpieczenie GeneratorNPC przed odczytem nowych arkuszy.
**Status danych:** `Analizy/Repozytorium.xlsx` zawiera docelową strukturę i komplet danych dla nowych arkuszy.

---

## 1. Cel zadania

Należy rozbudować moduł `DataVault`, aby obsługiwał nową grupę zakładek dotyczących pojazdów.

Należy też poprawić `GeneratorNPC`, aby nie mógł przypadkowo odczytywać danych z nowych arkuszy pojazdów.

Po zakończeniu wdrożenia należy wygenerować pliki JSON na podstawie `Analizy/Repozytorium.xlsx` i zapisać je w folderze `Analizy`.

---

## 2. Nowe arkusze pojazdów

Grupa pojazdów obejmuje siedem arkuszy:

1. `Role W Pojeździe`
2. `Akcje Pojazdu`
3. `Stany Pojazdów`
4. `Cechy Pojazdów`
5. `Pojazdy`
6. `Bronie Pojazdów`
7. `Ekwipunek Pojazdów`

Nie istnieje osobny arkusz:

```text
Cechy Broni Pojazdów
```

Cechy pojazdów i cechy broni pojazdów znajdują się razem w arkuszu:

```text
Cechy Pojazdów
```

Rodzaj cechy jest rozróżniany przez kolumnę `Typ`.

Dozwolone wartości kolumny `Typ` w arkuszu `Cechy Pojazdów`:

```text
Cecha Pojazdu
Cecha Broni Pojazdu
```

---

## 3. Checkbox widoczności zakładek pojazdów

Należy dodać trzeci checkbox sterujący widocznością zakładek pojazdów.

Tekst PL:

```text
Czy wyświetlić zakładki dotyczące pojazdów?
```

Tekst EN:

```text
Show tabs related to vehicles?
```

Rekomendowane identyfikatory:

```text
Element DOM:       toggleVehicleTabs
Klucz i18n:        toggleVehicleTabs
Stan UI:           showVehicleTabs
Grupa arkuszy:     VEHICLE_SHEETS
Klucze grupy:      VEHICLE_SHEET_KEYS
Helper:            isVehicleSheet(name)
Klasa checkboxa:   checkboxRow--vehicle
Klasa zakładki:    tab--vehicle
```

Domyślny stan:

```js
showVehicleTabs: false
```

Wymagane zachowanie:

* zakładki pojazdów są domyślnie ukryte;
* po zaznaczeniu checkboxa widoczne są wszystkie 7 zakładek pojazdów;
* po odznaczeniu checkboxa wszystkie 7 zakładek pojazdów jest ukryte;
* stan checkboxa ma być zapisywany i odtwarzany w `sessionStorage`;
* jeżeli aktywna zakładka zostanie ukryta, aplikacja ma wybrać bezpieczny fallback tak jak obecnie.

Konfiguracja grupy:

```js
const VEHICLE_SHEETS = new Set([
  "Role W Pojeździe",
  "Akcje Pojazdu",
  "Stany Pojazdów",
  "Cechy Pojazdów",
  "Pojazdy",
  "Bronie Pojazdów",
  "Ekwipunek Pojazdów",
]);
```

---

## 4. Widoczność użytkownik/admin

Wszystkie siedem zakładek pojazdów ma być dostępnych:

* w widoku użytkownika;
* w widoku admina.

Żadna z nowych zakładek nie ma być przypisana do `ADMIN_ONLY_SHEETS`.

`ADMIN_MODE` nadal pozostaje tylko filtrem interfejsu i nie jest mechanizmem bezpieczeństwa danych.

---

## 5. Tłumaczenia

DataVault nie ma tłumaczyć treści pochodzących z XLSX ani JSON.

Nie tłumaczyć:

* nazw arkuszy;
* nazw kolumn;
* nazw rekordów;
* opisów;
* nazw cech;
* słów kluczowych;
* nazw broni;
* nazw pojazdów;
* nazw wyposażenia.

Tłumaczone są wyłącznie stałe elementy interfejsu, takie jak:

* przyciski;
* checkboxy;
* komunikaty;
* błędy;
* etykiety elementów sterujących.

Kanonicznymi nazwami arkuszy i nazwami wyświetlanymi jako zakładki pozostają polskie nazwy z XLSX.

Nie należy dodawać mapy tłumaczącej nazwy arkuszy.

Informacyjne odpowiedniki angielskie:

| Nazwa arkusza PL     | Nazwa informacyjna EN |
| -------------------- | --------------------- |
| `Role W Pojeździe`   | `Vehicle Roles`       |
| `Akcje Pojazdu`      | `Vehicle Actions`     |
| `Stany Pojazdów`     | `Vehicle Conditions`  |
| `Cechy Pojazdów`     | `Vehicle Traits`      |
| `Pojazdy`            | `Vehicles`            |
| `Bronie Pojazdów`    | `Vehicle Weapons`     |
| `Ekwipunek Pojazdów` | `Vehicle Wargear`     |

---

## 6. Style zakładek i checkboxów

### 6.1. Zielone zakładki

Zwykłe zielone zakładki mają pozostać bez zmian.

Dotyczy to:

* koloru tekstu;
* aktywnego obramowania;
* aktywnego glow;
* tła;
* hover/focus, jeśli obecnie istnieje.

### 6.2. Czerwone zakładki zasad walki

Zakładki zasad walki mają używać czerwonej palety.

Dotyczy arkuszy:

```text
Trafienia Krytyczne
Groza Osnowy
Skrót Zasad
Tryby Ognia
Kary do ST
```

Wymagany efekt:

* czerwony tekst zakładki;
* czerwone aktywne obramowanie;
* czerwony aktywny glow;
* spójny czerwony hover/focus, jeżeli wymaga tego obecny model stylów.

### 6.3. Stalowo-srebrne zakładki pojazdów

Zakładki pojazdów mają używać nowej stalowo-srebrnej palety.

Dotyczy arkuszy:

```text
Role W Pojeździe
Akcje Pojazdu
Stany Pojazdów
Cechy Pojazdów
Pojazdy
Bronie Pojazdów
Ekwipunek Pojazdów
```

Wymagany efekt:

* stalowo-srebrny tekst zakładki;
* stalowo-srebrne aktywne obramowanie;
* stalowo-srebrny aktywny glow;
* stalowo-srebrny tekst checkboxa;
* stalowy `accent-color` checkboxa, jeżeli będzie czytelny.

Robocza paleta:

```css
--steel: #AEB7C2;
--steel-bright: #D6DCE2;
--steel-muted: #73808C;
--steel-border: rgba(174, 183, 194, 0.55);
--steel-glow: rgba(174, 183, 194, 0.40);
--steel-bg: rgba(174, 183, 194, 0.08);
--steel-bg-active: rgba(174, 183, 194, 0.16);
```

Implementacyjnie należy przewidzieć osobne reguły aktywnego stanu, np.:

```css
.tab--combat.active { ... }
.tab--vehicle.active { ... }
```

---

## 7. Kolumna `LP`

Kolumna `LP` ma pozostać w XLSX i w JSON jako techniczna informacja o kolejności rekordów.

`LP` nie może być wyświetlane użytkownikowi.

Zasada dotyczy wszystkich zakładek, nie tylko nowych zakładek pojazdów.

`LP` ma być:

* zachowane w danych;
* dostępne dla sortowania;
* niewidoczne w nagłówkach tabel;
* niewidoczne w komórkach tabel;
* niewidoczne w porównaniu rekordów;
* niewidoczne w `Widoku Domyślnym`;
* niewidoczne w `Pełnym Widoku`.

Ukrycie `LP` nie oznacza usunięcia wartości z danych.

---

## 8. Scalanie kolumn `Cecha N`

Scalanie kolumn cech nie może opierać się na sztywnym zakresie numerów.

Należy wykrywać wszystkie kolumny pasujące do wzorca:

```text
Cecha N
```

gdzie `N` jest numerem.

Wynik ma trafić do jednej kolumny:

```text
Cechy
```

Separator:

```text
; 
```

Puste wartości i wartości `-` należy pomijać.

Jeżeli rekord nie ma żadnej cechy, wartością wynikową ma być:

```text
-
```

### 8.1. `Pojazdy`

W aktualnym XLSX arkusz `Pojazdy` zawiera kolumny:

```text
Cecha 1
Cecha 2
Cecha 3
Cecha 4
Cecha 5
Cecha 6
Cecha 7
```

Wszystkie mają zostać scalone do:

```text
Cechy
```

Implementacja ma działać również, jeśli w przyszłości zostaną dodane np. `Cecha 8`, `Cecha 9`.

### 8.2. `Bronie Pojazdów`

W aktualnym XLSX arkusz `Bronie Pojazdów` zawiera kolumny:

```text
Cecha 1
Cecha 2
Cecha 3
Cecha 4
Cecha 5
```

Wszystkie mają zostać scalone do:

```text
Cechy
```

### 8.3. Zgodność generatorów

Logika scalania musi być identyczna w:

* `DataVault/app.js`;
* `DataVault/build_json.py`;
* generowaniu `data.json`;
* generowaniu `firebase-import.json`.

Nie może wystąpić sytuacja, w której `_meta.columnOrder` zawiera `Cechy`, a rekordy nadal zawierają wyłącznie surowe `Cecha N`.

---

## 9. Scalanie kolumn `Zasięg N`

W arkuszu `Bronie Pojazdów` należy scalić kolumny:

```text
Zasięg 1
Zasięg 2
Zasięg 3
```

do jednej kolumny:

```text
Zasięg
```

Format wynikowy:

```text
18 / 36 / 54
```

Kolumna `Zasięg`:

* ma być wyśrodkowana;
* nie może się zawijać;
* ma używać `white-space: nowrap`;
* ma korzystać z obecnego formatowania separatorów `/`.

Zachowanie ma być analogiczne do arkusza `Bronie`.

---

## 10. Klikalne elementy

Klikalne mają być wyłącznie wartości w scalonej kolumnie:

```text
Cechy
```

Nie mają być klikalne:

* nazwy broni;
* nazwy pojazdów;
* nazwy wyposażenia;
* wartości w kolumnie `Uzbrojenie`;
* wartości w kolumnie `Wyposażenie`;
* wartości w kolumnie `Akcje Pojazdu`;
* nazwy stanów występujące jako zwykły tekst;
* tekstowe odwołania do innych rekordów.

Nie należy tworzyć automatycznych linków pomiędzy:

* `Pojazdy` i `Bronie Pojazdów`;
* `Pojazdy` i `Ekwipunek Pojazdów`;
* `Uzbrojenie` i rekordami z `Bronie Pojazdów`;
* `Wyposażenie` i rekordami z `Ekwipunek Pojazdów`.

---

## 11. Nowe metadane

Należy dodać nowe metadane:

```text
_meta.vehicleTraits
_meta.vehicleWeaponTraits
_meta.vehicleStates
```

### 11.1. `_meta.vehicleTraits`

Źródło:

```text
Cechy Pojazdów
```

Warunek:

```text
Typ = "Cecha Pojazdu"
```

### 11.2. `_meta.vehicleWeaponTraits`

Źródło:

```text
Cechy Pojazdów
```

Warunek:

```text
Typ = "Cecha Broni Pojazdu"
```

### 11.3. `_meta.vehicleStates`

Źródło:

```text
Stany Pojazdów
```

Metadane powinny mieć strukturę zgodną z istniejącymi `_meta.traits` i `_meta.states`, tak aby runtime mógł budować indeksy kanoniczne analogiczne do `traitIndex` i `stateIndex`.

---

## 12. Rozwiązywanie opisów cech

Resolver cech musi znać kontekst arkusza, z którego pochodzi kliknięta cecha.

Rekomendowany model źródeł:

```js
const TRAIT_SOURCES_BY_SHEET = {
  "Bronie": ["traits"],
  "Pancerze": ["traits"],
  "Pojazdy": ["vehicleTraits"],
  "Bronie Pojazdów": ["vehicleWeaponTraits", "traits"],
};
```

### 12.1. `Pojazdy`

Cechy z arkusza `Pojazdy` mają korzystać wyłącznie z:

```text
_meta.vehicleTraits
```

### 12.2. `Bronie Pojazdów`

Cechy z arkusza `Bronie Pojazdów` mają być szukane w kolejności:

1. `_meta.vehicleWeaponTraits`;
2. `_meta.traits`;
3. komunikat o braku opisu.

Przykłady:

```text
Montowana (Duży)
→ _meta.vehicleWeaponTraits / Montowana (X)

Wybuchowa (6)
→ _meta.traits / Wybuchowa (X)
```

### 12.3. `Bronie` i `Pancerze`

Dotychczasowe zachowanie ma pozostać bez zmian:

```text
Bronie → _meta.traits
Pancerze → _meta.traits
```

---

## 13. Cechy parametryzowane `(X)`

Mechanizm dopasowywania cech parametryzowanych musi obsługiwać nie tylko liczby, ale też tekst.

Przykłady:

```text
Montowana (Duży)
Montowana (Wielki)
Montowana (Ogromny)
```

mają zostać dopasowane do:

```text
Montowana (X)
```

Parametr z nawiasu ma pozostać widoczny w tytule lub etykiecie popovera, ale nie wpływa na wybór opisu.

Mechanizm `(X)` musi obsługiwać:

* liczby;
* tekst;
* polskie znaki;
* wartości wielowyrazowe.

Nie wolno ograniczać go do wzorca zawierającego wyłącznie cyfry.

---

## 14. Cecha `Montowana (X)`

Dla dowolnego wariantu:

```text
Montowana (...)
```

należy wyświetlić opis wpisu:

```text
Montowana (X)
```

z arkusza `Cechy Pojazdów`, z części:

```text
Typ = "Cecha Broni Pojazdu"
```

Opis:

```text
Broń o tej Cesze wymaga montażu na odpowiedniej platformie, na przykład pojeździe. Wymaga zaawansowanej maszynerii, ogromnej mocy lub innego specjalnego traktowania typowego dla większych machin. Zazwyczaj nie może z niej skorzystać pojedyncza postać. Wartość w nawiasie określa najmniejszy Rozmiar pojazdu, na którym można zamontować broń.
```

Przykład:

```text
Kliknięta cecha:
Montowana (Duży)

Tytuł popovera:
MONTOWANA (DUŻY)

Opis:
opis wpisu Montowana (X)
```

---

## 15. Zwykłe cechy broni pojazdów

Broń pojazdów może korzystać także ze zwykłych cech ze starego arkusza:

```text
Cechy
```

Przykłady:

```text
Wybuchowa (6)
Przebijająca (4)
```

mają korzystać z wpisów:

```text
Wybuchowa (X)
Przebijająca (X)
```

ze starego `_meta.traits`.

Nie należy kopiować zwykłych cech broni do arkusza `Cechy Pojazdów`.

---

## 16. Cecha `Wywołanie` i stany

Mechanizm `Wywołanie (Stan)` ma działać dla `Bronie Pojazdów` analogicznie jak dla zwykłych broni.

Popover ma pokazywać:

1. opis cechy `Wywołanie`;
2. opis wskazanego stanu.

Dla broni pojazdów stany mają być szukane w kolejności:

1. `_meta.vehicleStates`;
2. `_meta.states`;
3. komunikat o braku opisu.

Jeżeli identyczna nazwa stanu występuje w `Stany Pojazdów` i `Stany`, pierwszeństwo ma wpis ze `Stany Pojazdów`.

### 16.1. `Wywołanie (Zatrucie 2/4/6)`

W XLSX występują wartości:

```text
Wywołanie (Zatrucie 2)
Wywołanie (Zatrucie 4)
Wywołanie (Zatrucie 6)
```

Należy obsłużyć je jako stan:

```text
Zatrucie
```

z parametrem liczbowym.

Przykład:

```text
Wywołanie (Zatrucie 6)
→ cecha: Wywołanie
→ stan: Zatrucie
→ parametr: 6
```

Opis stanu ma zostać pobrany z wpisu:

```text
Zatrucie
```

Parametr ma pozostać widoczny w tytule lub treści popovera.

Nie należy wymagać zmiany zapisu w XLSX.

---

## 17. Słowa kluczowe

Kolumna `Słowa Kluczowe` występuje w trzech nowych arkuszach:

```text
Pojazdy
Bronie Pojazdów
Ekwipunek Pojazdów
```

Wszystkie trzy arkusze należy dodać do reguły czerwonych słów kluczowych z neutralnymi przecinkami.

Docelowe zachowanie:

* słowa kluczowe są czerwone;
* przecinki są w podstawowym zielonym kolorze;
* formatowanie działa semantycznie, niezależnie od ręcznego koloru ustawionego w XLSX.

Należy rozszerzyć:

```js
KEYWORD_SHEETS_COMMA_NEUTRAL
```

Nie należy tworzyć osobnego mechanizmu kolorowania słów kluczowych dla pojazdów.

Nie należy automatycznie sortować słów kluczowych. Dane mają być wyświetlane w kolejności zapisanej w XLSX.

---

## 18. Widok Domyślny

Należy dodać konfigurację `DEFAULT_VIEW_CONFIG` dla trzech nowych zakładek.

### 18.1. `Pojazdy`

Filtr:

```text
Typ
```

Domyślnie widoczne wartości:

```text
Imperium
Adepta Sororitas
Adeptus Mechanicus
```

Konfiguracja:

```js
"Pojazdy": {
  "Typ": ["Imperium", "Adepta Sororitas", "Adeptus Mechanicus"]
}
```

### 18.2. `Bronie Pojazdów`

Filtr:

```text
Rodzaj
```

Domyślnie widoczna wartość:

```text
Imperium
```

Konfiguracja:

```js
"Bronie Pojazdów": {
  "Rodzaj": ["Imperium"]
}
```

### 18.3. `Ekwipunek Pojazdów`

Filtr:

```text
Typ
```

Domyślnie widoczna wartość:

```text
Ekwipunek Imperialny
```

Konfiguracja:

```js
"Ekwipunek Pojazdów": {
  "Typ": ["Ekwipunek Imperialny"]
}
```

### 18.4. Pozostałe nowe zakładki

Bez domyślnych filtrów:

```text
Role W Pojeździe
Akcje Pojazdu
Stany Pojazdów
Cechy Pojazdów
```

---

## 19. Szerokości, wyrównanie i łamanie kolumn

Głównym dokumentem referencyjnym dla konfiguracji kolumn jest:

```text
Kolumny.md
```

Dla nowych arkuszy należy uzupełnić `Kolumny.md` oraz CSS/DataVault tak, aby kolumny miały ustalone:

* `min-width`;
* `max-width`, jeśli potrzebne;
* wyrównanie;
* sposób łamania;
* `white-space: nowrap`, jeśli wymagane.

Kolumna `LP` jest ukryta i nie jest konfigurowana wizualnie.

### 19.1. Zasady ogólne

Tekst do lewej:

* nazwy;
* typy;
* opisy;
* efekty;
* przykłady;
* słowa kluczowe;
* cechy;
* uzbrojenie;
* wyposażenie;
* skład załogi.

Wartości wyśrodkowane:

* liczby;
* koszty;
* dostępność;
* parametry mechaniczne;
* strona;
* zasięg;
* szybkość;
* manewrowość;
* odporność;
* żywotność;
* rozmiar, jeśli jego wartości są krótkie.

`Zasięg`:

```text
text-align: center
white-space: nowrap
```

---

## 20. Wstępna konfiguracja kolumn nowych arkuszy

Wartości poniżej są punktem startowym. Po wdrożeniu można je korygować na podstawie rzeczywistego renderowania.

### 20.1. `Role W Pojeździe`

| Kolumna         |                       Min-width | Wyrównanie | Łamanie     |
| --------------- | ------------------------------: | ---------- | ----------- |
| `LP`            |                          ukryta | —          | —           |
| `Rola`          |                            14ch | lewo       | standardowe |
| `Akcje Pojazdu` |                            60ch | lewo       | standardowe |
| `Podręcznik`    | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`        | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.2. `Akcje Pojazdu`

| Kolumna      |                       Min-width | Wyrównanie | Łamanie     |
| ------------ | ------------------------------: | ---------- | ----------- |
| `LP`         |                          ukryta | —          | —           |
| `Nazwa`      |                            26ch | lewo       | standardowe |
| `Opis`       |                            56ch | lewo       | standardowe |
| `Przykład`   |                            56ch | lewo       | standardowe |
| `Podręcznik` | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`     | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.3. `Stany Pojazdów`

| Kolumna      |                       Min-width | Wyrównanie | Łamanie     |
| ------------ | ------------------------------: | ---------- | ----------- |
| `LP`         |                          ukryta | —          | —           |
| `Nazwa`      |                            26ch | lewo       | standardowe |
| `Opis`       |                            56ch | lewo       | standardowe |
| `Podręcznik` | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`     | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.4. `Cechy Pojazdów`

| Kolumna      |                       Min-width | Wyrównanie | Łamanie     |
| ------------ | ------------------------------: | ---------- | ----------- |
| `LP`         |                          ukryta | —          | —           |
| `Typ`        |                            22ch | lewo       | standardowe |
| `Nazwa`      |                            26ch | lewo       | standardowe |
| `Opis`       |                            56ch | lewo       | standardowe |
| `Podręcznik` | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`     | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.5. `Pojazdy`

| Kolumna          |                       Min-width | Wyrównanie | Łamanie     |
| ---------------- | ------------------------------: | ---------- | ----------- |
| `LP`             |                          ukryta | —          | —           |
| `Typ`            |                            14ch | lewo       | standardowe |
| `Nazwa`          |                            30ch | lewo       | standardowe |
| `Koszt`          |                             4ch | środek     | standardowe |
| `Dostępność`     |                             4ch | środek     | standardowe |
| `Słowa Kluczowe` |                            28ch | lewo       | standardowe |
| `Szybkość`       |                            10ch | środek     | standardowe |
| `Manewrowość`    |                            14ch | środek     | standardowe |
| `Odporność`      |                            10ch | środek     | standardowe |
| `Żywotność`      |                            10ch | środek     | standardowe |
| `Rozmiar`        |                            10ch | środek     | standardowe |
| `Skład Załogi`   |                            22ch | lewo       | standardowe |
| `Cechy`          |                            32ch | lewo       | standardowe |
| `Uzbrojenie`     |                            36ch | lewo       | standardowe |
| `Wyposażenie`    |                            32ch | lewo       | standardowe |
| `Podręcznik`     | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`         | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.6. `Bronie Pojazdów`

Punktem wyjścia ma być konfiguracja arkusza `Bronie`.

| Kolumna            |                       Min-width | Wyrównanie | Łamanie     |
| ------------------ | ------------------------------: | ---------- | ----------- |
| `LP`               |                          ukryta | —          | —           |
| `Typ`              |                  jak w `Bronie` | lewo       | standardowe |
| `Rodzaj`           |                  jak w `Bronie` | lewo       | standardowe |
| `Nazwa`            |                  jak w `Bronie` | lewo       | standardowe |
| `Obrażenia`        |                  jak w `Bronie` | środek     | standardowe |
| `PP`               |                  jak w `Bronie` | środek     | standardowe |
| `DK`               |                  jak w `Bronie` | środek     | standardowe |
| `Szybkostrzelność` |                  jak w `Bronie` | środek     | standardowe |
| `Zasięg`           |                            18ch | środek     | bez łamania |
| `Cechy`            |                            32ch | lewo       | standardowe |
| `Słowa Kluczowe`   |                            28ch | lewo       | standardowe |
| `Koszt`            |                  jak w `Bronie` | środek     | standardowe |
| `Dostępność`       |                  jak w `Bronie` | środek     | standardowe |
| `Koszt IM`         |                  jak w `Bronie` | środek     | standardowe |
| `Podręcznik`       | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`           | zgodnie ze standardem globalnym | środek     | standardowe |

### 20.7. `Ekwipunek Pojazdów`

Punktem wyjścia ma być konfiguracja arkusza `Ekwipunek`.

| Kolumna          |                       Min-width | Wyrównanie | Łamanie     |
| ---------------- | ------------------------------: | ---------- | ----------- |
| `LP`             |                          ukryta | —          | —           |
| `Typ`            |                            14ch | lewo       | standardowe |
| `Nazwa`          |                            26ch | lewo       | standardowe |
| `Opis`           |                         48–56ch | lewo       | standardowe |
| `Efekt`          |                            56ch | lewo       | standardowe |
| `Słowa Kluczowe` |                            28ch | lewo       | standardowe |
| `Koszt`          |                             4ch | środek     | standardowe |
| `Dostępność`     |                             4ch | środek     | standardowe |
| `Koszt IM`       |                             8ch | środek     | standardowe |
| `Podręcznik`     | zgodnie ze standardem globalnym | lewo       | standardowe |
| `Strona`         | zgodnie ze standardem globalnym | środek     | standardowe |

---

## 21. GeneratorNPC

Poprawienie GeneratorNPC jest obowiązkową częścią zadania.

GeneratorNPC nie może wybierać kolekcji przez dopasowanie fragmentu nazwy arkusza.

Nowe arkusze powodują ryzyko kolizji:

```text
Bronie Pojazdów → może zostać uznane za Bronie
Ekwipunek Pojazdów → może zostać uznane za Ekwipunek
Cechy Pojazdów → nie może być używane jako zwykłe Cechy
```

GeneratorNPC ma pobierać swoje kolekcje wyłącznie przez dokładne nazwy arkuszy:

```text
Bestiariusz
Pancerze
Bronie
Augumentacje
Ekwipunek
Talenty
Psionika
Modlitwy
```

Przykładowy model:

```js
data.sheets["Bestiariusz"]
data.sheets["Pancerze"]
data.sheets["Bronie"]
data.sheets["Augumentacje"]
data.sheets["Ekwipunek"]
data.sheets["Talenty"]
data.sheets["Psionika"]
data.sheets["Modlitwy"]
```

GeneratorNPC ma całkowicie ignorować:

```text
Role W Pojeździe
Akcje Pojazdu
Stany Pojazdów
Cechy Pojazdów
Pojazdy
Bronie Pojazdów
Ekwipunek Pojazdów
```

Nie dodawać do GeneratorNPC modułu pojazdów.

GeneratorNPC ma nadal działać z dotychczasowymi danymi i formatem generowanej karty NPC.

---

## 22. Brak automatycznej integralności nazw broni i wyposażenia

Pola tekstowe mają pozostać polami tekstowymi.

Dotyczy między innymi:

```text
Uzbrojenie
Wyposażenie
Akcje Pojazdu
```

Aplikacja nie ma:

* sprawdzać, czy broń wymieniona w `Uzbrojenie` istnieje w `Bronie Pojazdów`;
* sprawdzać, czy wyposażenie wymienione w `Wyposażenie` istnieje w `Ekwipunek Pojazdów`;
* zamieniać nazw na linki;
* otwierać dodatkowych popoverów;
* synchronizować nazw pomiędzy arkuszami.

Ewentualny audyt spójności nazw może być osobnym zadaniem utrzymaniowym.

---

## 23. Plik źródłowy i artefakty JSON

Docelowy plik XLSX znajduje się w repozytorium pod ścieżką:

```text
Analizy/Repozytorium.xlsx
```

Po zakończeniu zmian agent ma wygenerować pliki JSON na podstawie tego XLSX i zapisać je w folderze:

```text
Analizy
```

Wymagane pliki:

```text
Analizy/data.json
Analizy/firebase-import.json
```

Pliki muszą odzwierciedlać finalną logikę:

* scalanie `Cecha N`;
* scalanie `Zasięg N`;
* budowanie `_meta.vehicleTraits`;
* budowanie `_meta.vehicleWeaponTraits`;
* budowanie `_meta.vehicleStates`;
* zachowanie `LP`;
* docelową kolejność arkuszy;
* docelową kolejność kolumn;
* dane z `Analizy/Repozytorium.xlsx`.

Jeżeli projekt wymaga również produkcyjnych artefaktów DataVault, należy wygenerować je zgodnie z dotychczasową strukturą projektu.

Kopie w `Analizy` są obowiązkowe jako artefakty audytowe.

---

## 24. Pliki do aktualizacji

Wdrożenie prawdopodobnie będzie wymagało zmian w następujących miejscach.

### DataVault

```text
DataVault/index.html
DataVault/app.js
DataVault/style.css
DataVault/build_json.py
DataVault/docs/Documentation.md
DataVault/docs/README.md
DataVault/docs/ZasadyFormatowania.md
```

### Dokumentacja ogólna

```text
Kolumny.md
DetaleLayout.md
```

### GeneratorNPC

```text
GeneratorNPC/index.html
GeneratorNPC/docs/Documentation.md
GeneratorNPC/docs/README.md
```

### Artefakty audytowe

```text
Analizy/data.json
Analizy/firebase-import.json
```

Nie zmieniać `shared/firebase-data-loader.js`, jeżeli dane nadal są przechowywane i pobierane z tej samej ścieżki Firebase.

---

## 25. Testy po wdrożeniu

Po zakończeniu zadania należy sprawdzić co najmniej poniższe punkty.

### 25.1. Widoczność zakładek

* checkbox pojazdów jest domyślnie odznaczony;
* przy odznaczonym checkboxie zakładki pojazdów są ukryte;
* po zaznaczeniu checkboxa widocznych jest dokładnie 7 zakładek pojazdów;
* po odznaczeniu checkboxa zakładki pojazdów znikają;
* zakładki pojazdów są dostępne dla użytkownika i admina;
* żadna zakładka pojazdów nie jest admin-only;
* stan checkboxa przetrwa odświeżenie strony w tej samej sesji;
* ukrycie aktywnej zakładki wybiera bezpieczny fallback.

### 25.2. Style

* zielone zakładki wyglądają jak przed zmianą;
* czerwone zakładki mają czerwony tekst;
* czerwone zakładki mają czerwone aktywne obramowanie i glow;
* zakładki pojazdów mają stalowo-srebrny tekst;
* zakładki pojazdów mają stalowo-srebrne aktywne obramowanie i glow;
* checkbox pojazdów ma stalowo-srebrny tekst;
* UI pozostaje czytelne na desktopie i urządzeniach mobilnych.

### 25.3. Kolumny i widoki

* `LP` jest ukryte we wszystkich tabelach;
* `LP` jest zachowane w danych;
* `LP` nie pojawia się w porównaniu rekordów;
* `Zasięg` w `Bronie Pojazdów` nie zawija się;
* szerokości i wyrównania są zgodne z `Kolumny.md`;
* `Widok Domyślny` w `Pojazdy` filtruje `Typ` do:

  * `Imperium`
  * `Adepta Sororitas`
  * `Adeptus Mechanicus`
* `Widok Domyślny` w `Bronie Pojazdów` filtruje `Rodzaj` do:

  * `Imperium`
* `Widok Domyślny` w `Ekwipunek Pojazdów` filtruje `Typ` do:

  * `Ekwipunek Imperialny`

### 25.4. Transformacja danych

* `Pojazdy` scalają wszystkie `Cecha N` do `Cechy`;
* `Bronie Pojazdów` scalają wszystkie `Cecha N` do `Cechy`;
* `Bronie Pojazdów` scalają `Zasięg 1..3` do `Zasięg`;
* puste cechy i `-` są pomijane;
* brak cech daje `-`;
* `_meta.columnOrder` zawiera `Cechy` i `Zasięg`, a nie surowe `Cecha N` i `Zasięg N`;
* generator przeglądarkowy i `DataVault/build_json.py` dają zgodne wyniki.

### 25.5. Popovery cech i stanów

* kliknięcie cechy w `Pojazdy` korzysta z `_meta.vehicleTraits`;
* kliknięcie cechy w `Bronie Pojazdów` korzysta najpierw z `_meta.vehicleWeaponTraits`;
* jeśli cecha broni pojazdu nie istnieje w `_meta.vehicleWeaponTraits`, następuje fallback do `_meta.traits`;
* `Montowana (Duży)` i podobne warianty korzystają z `Montowana (X)`;
* `Wybuchowa (6)` korzysta ze starego `_meta.traits`;
* `Wywołanie (Podpalenie)` działa jak dotychczas;
* `Wywołanie (Zatrucie 2/4/6)` pokazuje opis stanu `Zatrucie`;
* stany pojazdów mają pierwszeństwo przed starymi stanami;
* brak opisu cechy lub stanu daje czytelny komunikat.

### 25.6. Słowa kluczowe

* `Słowa Kluczowe` w `Pojazdy` są czerwone;
* `Słowa Kluczowe` w `Bronie Pojazdów` są czerwone;
* `Słowa Kluczowe` w `Ekwipunek Pojazdów` są czerwone;
* przecinki pozostają neutralne;
* kolejność słów kluczowych jest zachowana z XLSX;
* aplikacja nie sortuje słów kluczowych automatycznie.

### 25.7. GeneratorNPC

* GeneratorNPC pobiera `Bestiariusz` dokładnie z `data.sheets["Bestiariusz"]`;
* GeneratorNPC pobiera `Bronie` dokładnie z `data.sheets["Bronie"]`;
* GeneratorNPC pobiera `Ekwipunek` dokładnie z `data.sheets["Ekwipunek"]`;
* analogicznie dla pozostałych wymaganych arkuszy;
* GeneratorNPC nie korzysta z `Bronie Pojazdów`;
* GeneratorNPC nie korzysta z `Ekwipunek Pojazdów`;
* GeneratorNPC nie korzysta z `Cechy Pojazdów`;
* GeneratorNPC nie zmienia formatu karty NPC;
* GeneratorNPC nadal poprawnie generuje NPC po zmianach.

### 25.8. Artefakty

* wygenerowano `Analizy/data.json`;
* wygenerowano `Analizy/firebase-import.json`;
* pliki są zgodne z `Analizy/Repozytorium.xlsx`;
* `firebase-import.json` zawiera poprawny `dataJson`;
* `dataJson` przechodzi `JSON.parse`;
* produkcyjne artefakty DataVault, jeśli generowane, są zgodne z dotychczasową strukturą projektu.

---

## 26. Uwagi poza zakresem

Kolejność alfabetyczna słów kluczowych została odłożona na późniejsze porządkowanie danych.

Nie należy automatycznie sortować słów kluczowych w aplikacji ani podczas importu.

Nie należy dodawać linkowania pomiędzy nazwami broni, pojazdów i wyposażenia.

Nie należy dodawać modułu pojazdów do GeneratorNPC.

Nie należy wdrażać realnego rozdzielenia danych admin/użytkownik w Firebase w ramach tego zadania.

---

## 27. Oczekiwane podsumowanie po wykonaniu zadania

Po zakończeniu agent powinien zwrócić:

1. listę zmodyfikowanych plików;
2. opis wykonanych zmian;
3. informację, czy wygenerowano:

   * `Analizy/data.json`;
   * `Analizy/firebase-import.json`;
4. informację, jakie testy wykonano;
5. informację, czy są znane ograniczenia lub rzeczy wymagające ręcznej weryfikacji.

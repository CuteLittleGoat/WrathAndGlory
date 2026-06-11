# Analiza rozbudowy DataVault o nowe zakładki i checkbox widoczności

**Data analizy:** 2026-06-11  
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Gałąź:** `main`  
**Analizowana rewizja:** `2ca31b60fbe8e593f99fd2e65257ddc4dd6d8355`  
**Zakres:** analiza bez zmian w kodzie i bez commita

## Oryginalny pełny prompt użytkownika

> GitHub będziesz pracować na repo WrathAndGlory. Planuję rozbudować moduł DataVault. Chcę dodać nowe zakładki i nowy checkbox od którego zaznaczenia/odznaczenia będzie zależeć czy będą wyświetlane. Możliwe, że niektóre zakładki będą widoczne tylko w widoku admina. Przeprowadź analizę wdrożenia takiej rozbudowy. Sprawdź czy dodanie nowych zakładek nie spowoduje problemów z modułem GeneratorNPC.

## 1. Wniosek główny

Rozbudowa DataVault jest technicznie prosta i nie wymaga zmiany formatu danych. Parser i generator DataVault już obsługują dowolne dodatkowe arkusze z `Repozytorium.xlsx`: wszystkie arkusze są kopiowane do `sheets`, a ich kolejność jest zapisywana w `_meta.sheetOrder`.

Samo dodanie nowych arkuszy o neutralnych nazwach nie powinno uszkodzić GeneratorNPC. Istnieje jednak ważne ryzyko: GeneratorNPC nie pobiera wymaganych arkuszy przez dokładną nazwę, lecz rekurencyjnie wyszukuje pierwszą pasującą kolekcję po fragmentach nazw. Nowy arkusz o nazwie zawierającej np. `broń`, `weapon`, `pancerz`, `talent`, `psion`, `modlitw`, `besti` może zostać omyłkowo użyty zamiast właściwego arkusza.

Drugie istotne ustalenie: obecny „widok admina” nie stanowi zabezpieczenia danych. `?admin=1` steruje jedynie filtrowaniem zakładek w interfejsie DataVault. Wszystkie arkusze nadal znajdują się w jednym payloadzie `/datavault/live` i są pobierane przez każdego uwierzytelnionego klienta.

## 2. Aktualna architektura DataVault

### 2.1. Źródło i format danych

DataVault:

1. czyta wszystkie arkusze z `Repozytorium.xlsx`;
2. zapisuje je w obiekcie `sheets`;
3. zapisuje kolejność arkuszy w `_meta.sheetOrder`;
4. generuje `data.json`;
5. generuje `firebase-import.json`, którego `dataJson` zawiera cały obiekt DataVault;
6. po imporcie runtime jest pobierany z `/datavault/live`.

Nowy arkusz nie wymaga zmian w `buildDataJsonFromSheets`, o ile ma prawidłową tabelę nagłówków i danych.

### 2.2. Obecna logika widoczności zakładek

Widoczność jest oparta na kilku równoległych strukturach w `DataVault/app.js`:

- `ADMIN_ONLY_SHEETS`;
- `CHARACTER_CREATION_SHEETS`;
- `COMBAT_RULES_SHEETS`;
- odpowiadające im znormalizowane zestawy kluczy;
- helpery `isCharacterCreationSheet()` i `isCombatRulesSheet()`;
- `uiState.showCharacterTabs`;
- `uiState.showCombatTabs`;
- filtry wykonywane w `initUI()`.

Kolejność filtrowania w `initUI()`:

1. pobranie wszystkich arkuszy;
2. usunięcie `ADMIN_ONLY_SHEETS` w widoku gracza;
3. usunięcie grupy tworzenia postaci, jeśli checkbox jest odznaczony;
4. usunięcie grupy zasad walki, jeśli checkbox jest odznaczony;
5. odtworzenie kolejności z `_meta.sheetOrder`;
6. wybór aktywnej zakładki lub bezpiecznego fallbacku.

Obecny fallback aktywnej zakładki jest poprawny: po ukryciu aktualnie otwartej zakładki DataVault przełącza się na inną widoczną zakładkę.

### 2.3. Zapamiętywanie checkboxów

`saveSessionState()` zapisuje cały `uiState` przez:

```js
toggles: {...uiState}
```

Samo dodanie nowej właściwości do `uiState` wystarczy więc do jej zapisu. Odtwarzanie nie jest jednak automatyczne: `loadSessionState()` jawnie przypisuje tylko:

- `showCharacterTabs`;
- `showCombatTabs`.

Nowy checkbox musi zostać jawnie dodany do `loadSessionState()`. Pominięcie tego punktu spowoduje, że checkbox będzie działał tylko do odświeżenia strony.

## 3. Minimalny wariant wdrożenia nowej grupy zakładek

Zakładając grupę o nazwie roboczej `newTabs`, konieczne będą następujące zmiany.

### `DataVault/index.html`

Dodać trzeci checkbox, np.:

```html
<label class="checkboxRow checkboxRow--new">
  <input type="checkbox" id="toggleNewTabs" />
  <span class="checkboxLabel" data-i18n="toggleNewTabs">
    Czy wyświetlić nowe zakładki?
  </span>
</label>
```

### `DataVault/app.js`

1. Dodać `toggleNewTabs` do `els`.
2. Dodać tekst `toggleNewTabs` w słownikach PL i EN.
3. Dodać `NEW_TABS_SHEETS`.
4. Dodać `NEW_TABS_SHEET_KEYS`.
5. Dodać `isNewTabsSheet(name)`.
6. Dodać `showNewTabs: false` do `uiState`.
7. Dodać filtr do `initUI()`.
8. Dodać opcjonalną klasę zakładki, np. `tab--new`.
9. Synchronizować stan checkboxa w `initUI()`.
10. Dodać listener `change`.
11. Dodać odtworzenie `showNewTabs` w `loadSessionState()`.

### `DataVault/style.css`

Zmiana jest potrzebna tylko wtedy, gdy nowa grupa ma mieć własny kolor lub wyróżnienie. Bez nowych klas odziedziczy standardowy zielony wygląd.

### Dokumentacja

Po zmianie należy zaktualizować:

- `DataVault/docs/Documentation.md`;
- `DataVault/docs/README.md`;
- `DetaleLayout.md`, jeśli checkbox lub zakładki otrzymają nowy wygląd, kolor, odstępy albo zachowanie responsywne.

## 4. Zakładki tylko dla admina

Aby zakładka była widoczna tylko w widoku admina, obecnie wystarczy dopisać jej nazwę do:

```js
ADMIN_ONLY_SHEETS
```

Można jednocześnie przypisać ją do grupy sterowanej checkboxem. Wtedy zachowanie będzie następujące:

| Tryb | Checkbox wyłączony | Checkbox włączony |
|---|---:|---:|
| Gracz | ukryta | nadal ukryta |
| Admin | ukryta | widoczna |

To zachowanie wynika z kolejności filtrów: najpierw stosowana jest kontrola admina, a następnie kontrola grupy.

### Ograniczenie bezpieczeństwa

`ADMIN_MODE` jest ustalany wyłącznie przez parametr URL:

```js
new URLSearchParams(location.search).get("admin") === "1"
```

Nie jest to rola Firebase ani uprawnienie serwerowe. Każda osoba znająca URL może wejść w widok admina. Ponadto wszystkie dane są pobierane wcześniej z tego samego `/datavault/live`.

Dlatego:

- można używać `ADMIN_ONLY_SHEETS` do porządkowania interfejsu;
- nie należy używać go do ochrony sekretów lub treści, których gracze nie mogą otrzymać.

Jeśli zakładki mają być rzeczywiście tajne, potrzebny jest osobny payload lub osobna ścieżka Firebase, np.:

```text
/datavault/player
/datavault/admin
```

oraz Firebase Rules lub osobne konta/claims rozróżniające role.

## 5. Wpływ nowych zakładek na GeneratorNPC

### 5.1. Co jest bezpieczne

GeneratorNPC oczekuje obiektu z `data.sheets`. Dodatkowe arkusze nie zmieniają tej struktury.

GeneratorNPC wykorzystuje obecnie osiem kolekcji:

- `Bestiariusz`;
- `Pancerze`;
- `Bronie`;
- `Augumentacje`;
- `Ekwipunek`;
- `Talenty`;
- `Psionika`;
- `Modlitwy`.

Nowe arkusze o nazwach niezwiązanych z tymi kolekcjami powinny zostać zignorowane.

Dodatkowe kolumny w nowych arkuszach również nie wpływają na GeneratorNPC.

### 5.2. Ryzyko kolizji nazw

GeneratorNPC używa funkcji `getCollection(data, keywords)`, która rekurencyjnie przeszukuje cały obiekt i dopasowuje nazwy po fragmentach.

Używane fragmenty:

```text
Bestiariusz:  besti, bestiariusz
Pancerze:     pancerz, armor
Bronie:       broń, bron, weapon
Augumentacje: augument, augment, modyfikac
Ekwipunek:    ekwipunek, equipment
Talenty:      talent
Psionika:     psion, psionik
Modlitwy:     modlitw, prayer
```

Przykładowe ryzykowne nowe nazwy:

- `Bronie przeciwników`;
- `Weapon Traits`;
- `Pancerze pojazdów`;
- `Talenty specjalne`;
- `Psionika wroga`;
- `Modlitwy kultystów`;
- `Bestiariusz archiwalny`;
- `Modyfikacje broni`.

Jeśli taki arkusz pojawi się przed właściwym arkuszem w kolejności obiektu, GeneratorNPC może pobrać niewłaściwą kolekcję.

### 5.3. Ryzyko cichego fallbacku

Jeżeli właściwy arkusz zostanie usunięty lub zmieni nazwę tak, że nie pasuje do słów kluczowych, rekurencyjna funkcja może zwrócić pierwszy napotkany arkusz rekordów. GeneratorNPC może wtedy nie zgłosić czytelnego błędu, lecz wczytać dane z niewłaściwej tabeli.

Jest to istniejący problem, ale dodawanie kolejnych arkuszy zwiększa liczbę możliwych kolizji.

### 5.4. Rekomendowane utwardzenie GeneratorNPC

Dla aktualnego, stabilnego schematu DataVault lepsze jest dokładne pobieranie arkuszy:

```js
const getSheetRecords = (data, sheetName) =>
  extractRecords(data?.sheets?.[sheetName]);

state.bestiary = sortByName(getSheetRecords(data, "Bestiariusz"));
state.armor = sortByTypeThenName(getSheetRecords(data, "Pancerze"));
state.weapons = sortByTypeThenName(getSheetRecords(data, "Bronie"));
state.augmentations = sortByTypeThenName(getSheetRecords(data, "Augumentacje"));
state.equipment = sortByTypeThenName(getSheetRecords(data, "Ekwipunek"));
state.talents = sortByName(getSheetRecords(data, "Talenty"));
state.psionics = sortByTypeThenName(
  getSheetRecords(data, "Psionika"),
  { typeDescending: true }
);
state.prayers = sortByName(getSheetRecords(data, "Modlitwy"));
```

Jeśli potrzebna jest zgodność z alternatywnymi nazwami, należy użyć jawnej mapy aliasów, a nie dopasowywania fragmentu w dowolnym miejscu drzewa.

Dodatkowo warto walidować brak wymaganych arkuszy i zwracać błąd zawierający ich listę.

## 6. Zalecana architektura dla kolejnych checkboxów

Obecne rozwiązanie jest wystarczające dla dwóch grup, ale każda nowa grupa wymaga powielania kodu w wielu miejscach. Przy planowanej dalszej rozbudowie lepiej wprowadzić deklaratywną konfigurację:

```js
const TAB_GROUPS = {
  character: {
    stateKey: "showCharacterTabs",
    checkboxId: "toggleCharacterTabs",
    sheets: [
      "Tabela Rozmiarów",
      "Gatunki",
      "Archetypy"
    ],
    tabClass: "tab--character"
  },
  combat: {
    stateKey: "showCombatTabs",
    checkboxId: "toggleCombatTabs",
    sheets: [
      "Trafienia Krytyczne",
      "Groza Osnowy",
      "Skrót Zasad"
    ],
    tabClass: "tab--combat"
  },
  newGroup: {
    stateKey: "showNewTabs",
    checkboxId: "toggleNewTabs",
    sheets: [
      "Nowa Zakładka 1",
      "Nowa Zakładka 2"
    ],
    tabClass: "tab--new"
  }
};
```

Na tej podstawie można generować:

- znormalizowane zbiory nazw;
- filtrowanie zakładek;
- klasy CSS;
- synchronizację checkboxów;
- listenery;
- zapis i odczyt `uiState`.

### Rekomendacja wdrożeniowa

Najniższe ryzyko daje podział na dwa etapy:

1. utwardzenie pobierania arkuszy w GeneratorNPC i dodanie testów regresji;
2. dodanie nowych arkuszy i nowej grupy checkboxa w DataVault.

Jeśli nowe arkusze mają całkowicie neutralne nazwy i potrzebny jest szybki mały patch, można najpierw wykonać minimalne rozszerzenie DataVault, a refaktor grup zrobić później. Nie należy jednak dodawać arkusza z nazwą podobną do jednej z ośmiu kolekcji GeneratorNPC bez wcześniejszego utwardzenia selektora.

## 7. Pliki przewidywane do zmiany

### Zawsze

- `DataVault/Repozytorium.xlsx`;
- `DataVault/index.html`;
- `DataVault/app.js`;
- `DataVault/docs/Documentation.md`;
- `DataVault/docs/README.md`.

### Zależnie od wyglądu

- `DataVault/style.css`;
- `DetaleLayout.md`.

### Artefakty danych

- `DataVault/data.json`;
- `DataVault/firebase-import.json`.

### Przy utwardzeniu GeneratorNPC

- `GeneratorNPC/index.html`;
- `GeneratorNPC/docs/Documentation.md`;
- `GeneratorNPC/docs/README.md`.

Nie ma potrzeby zmiany `shared/firebase-data-loader.js`, jeśli dane nadal będą przechowywane w jednym `/datavault/live`.

## 8. Plan testów regresji

### DataVault — widok gracza

1. Nowe zakładki są ukryte po starcie.
2. Zaznaczenie checkboxa pokazuje wyłącznie właściwą grupę.
3. Odznaczenie checkboxa ukrywa grupę.
4. Jeśli aktywna zakładka zostanie ukryta, aplikacja wybiera prawidłowy fallback.
5. Stan checkboxa przetrwa odświeżenie w tej samej sesji.
6. Zakładki admin-only nie pojawiają się po zaznaczeniu checkboxa.

### DataVault — widok admina

1. Nowe zakładki są dostępne zgodnie z checkboxem.
2. Zakładki admin-only są widoczne wyłącznie w połączeniu `admin + checkbox`.
3. Startowa zakładka `Notatki` nadal działa.
4. Przycisk generacji nadal generuje oba pliki.

### Generowanie danych

1. Nowe arkusze występują w `sheets`.
2. Kolejność jest poprawna w `_meta.sheetOrder`.
3. Kolejność kolumn jest poprawna w `_meta.columnOrder`.
4. Wynik przeglądarkowego parsera jest zgodny z `build_json.py`.
5. `firebase-import.json` przechodzi round-trip `JSON.parse(dataJson)`.
6. Dane po imporcie poprawnie ładują się z Firebase.

### GeneratorNPC

1. Liczby rekordów ośmiu kolekcji pozostają identyczne przed i po dodaniu nowych zakładek.
2. Dodanie neutralnego arkusza nie wpływa na kolekcje.
3. Test kolizyjny z arkuszem `Bronie dodatkowe` nie może zmienić źródła `state.weapons`.
4. Brak `Bronie` powinien zwrócić jawny błąd, a nie inną kolekcję.
5. Generowanie karty działa dla bestiariusza, broni, pancerza i wszystkich modułów.
6. `_meta.traits` nadal zasila opisy cech.

## 9. Macierz ryzyka

| Ryzyko | Poziom | Uwagi |
|---|---|---|
| Kolizja nazwy nowego arkusza z heurystyką GeneratorNPC | Wysoki | Może podmienić całą kolekcję bez oczywistego błędu |
| Traktowanie `ADMIN_MODE` jako zabezpieczenia | Wysoki | Jest to wyłącznie filtr UI |
| Pominięcie nowego pola w `loadSessionState()` | Średni | Checkbox nie zachowa stanu po odświeżeniu |
| Brak aktualizacji i18n PL/EN | Średni | Pusty lub nieprzetłumaczony tekst |
| Brak nowego arkusza w grupie konfiguracyjnej | Średni | Arkusz będzie zawsze widoczny |
| Dodatkowe neutralne arkusze | Niski | Aktualny format danych je obsłuży |
| Dodatkowe kolumny w nowych arkuszach | Niski | Nie są używane przez GeneratorNPC |

## 10. Rekomendowana kolejność wdrożenia

1. Ustalić dokładne nazwy nowych arkuszy i ich grupę.
2. Sprawdzić nazwy pod kątem słów kolizyjnych GeneratorNPC.
3. Utwardzić GeneratorNPC przez dokładne wskazywanie arkuszy.
4. Dodać nowe arkusze do `Repozytorium.xlsx`.
5. Dodać deklarację grupy i checkbox w DataVault.
6. Dodać reguły admin-only jako właściwość widoczności.
7. Wygenerować `data.json` i `firebase-import.json`.
8. Wykonać testy macierzy gracz/admin/checkbox.
9. Wykonać testy GeneratorNPC i porównać liczby rekordów.
10. Zaktualizować dokumentację i ewentualnie `DetaleLayout.md`.

## 11. Ostateczna rekomendacja

Rozbudowę można wdrożyć bez zmiany formatu Firebase i bez ingerencji w parser XLSX. Przed dodaniem arkuszy o nazwach związanych z istniejącymi kolekcjami należy jednak poprawić selekcję danych w GeneratorNPC.

Dla widoczności zakładek rekomendowana jest deklaratywna konfiguracja grup zamiast tworzenia kolejnych niezależnych stałych i listenerów. Dla rzeczywistego rozdzielenia danych admin/gracz konieczna jest zmiana architektury Firebase; obecny parametr `?admin=1` nie zapewnia ochrony danych.

# Analiza rozbudowy DataVault o zakładki pojazdów i checkbox widoczności

**Data analizy:** 2026-06-11  
**Data aktualizacji:** 2026-06-11  
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Gałąź:** `main`  
**Analizowana rewizja po aktualizacji:** `90b3d1dc598321ad9bf3f7ee581017295f16e328`  
**Zakres:** analiza bez zmian w kodzie i bez commita

## Oryginalny pełny prompt użytkownika

> GitHub będziesz pracować na repo WrathAndGlory. Planuję rozbudować moduł DataVault. Chcę dodać nowe zakładki i nowy checkbox od którego zaznaczenia/odznaczenia będzie zależeć czy będą wyświetlane. Możliwe, że niektóre zakładki będą widoczne tylko w widoku admina. Przeprowadź analizę wdrożenia takiej rozbudowy. Sprawdź czy dodanie nowych zakładek nie spowoduje problemów z modułem GeneratorNPC.

## Pełny prompt uzupełniający użytkownika

> Trzeba będzie rozbudować analizę Analizy/analiza-rozbudowy-datavault-zakladki-checkbox-generatornpc.md
>
> Prawdopodobnie będą używane takie zakładki:
>
> Nazwa zakładki PL | Nazwa zakładki EN  
> Role W Pojeździe | Vehicle Roles  
> Akcje Pojazdu | Vehicle Actions  
> Pojazdy i Stany | Vehicles & Conditions  
> Cechy Pojazdów | Vehicle Traits  
> Pojazdy | Vecicles  
> Cechy Broni Pojazdów | Vehicle Weapon Traits  
> Bronie Pojazdów | Vecicle Weapons  
> Ekwipunek Pojazdów | Vecicle Wargear
>
> Checkbox ma się nazywać "Czy wyświetlić zakładki dotyczące pojazdów?" w wersji polskiej oraz analogicznie w wersji angielskiej.
> Trzeba będzie dodać nowy kolor. Chcę, żeby napis przy checkboxie oraz kolor zakładek był srebrno-stalowy.
>
> Dokładny spis kolumn w każdej z zakładek oraz widok domyślny zostaną ustalone później.
> Z pewnością potrzebna będzie podobna funkcjonalność jak obecnie istnieje w zakładkach "Bronie" i "Pancerze" polegająca na tym, że kilka kolumn Cecha 1, Cecha 2 itd. zbija w jedną kolumnę oraz wyświetla zawartość pobraną z zakładki "Cechy" po kliknięciu. W przypadku nowych zakładek będzie potrzebny podobny mechanizm dotyczący broni pojazdów i cech broni pojazdów.

---

## 1. Wniosek główny po doprecyzowaniu zakresu

Rozbudowa DataVault ma obejmować osobną grupę ośmiu zakładek pojazdów, sterowaną trzecim checkboxem. Grupa powinna mieć własny srebrno-stalowy wariant wizualny.

Samo dodanie arkuszy do `Repozytorium.xlsx` jest obsługiwane przez istniejący parser. Nie wystarczy jednak do uzyskania kompletnej funkcjonalności. Konieczne będą zmiany w:

- logice grup zakładek;
- tłumaczeniu nazw zakładek;
- zapisie stanu checkboxa;
- stylach;
- transformacji kolumn `Cecha 1`, `Cecha 2` itd.;
- budowaniu osobnego indeksu cech broni pojazdów;
- rozwiązywaniu klikanych opisów cech;
- GeneratorNPC.

W przypadku nowych nazw arkuszy ryzyko kolizji z GeneratorNPC nie jest już hipotetyczne. Następujące planowane arkusze bezpośrednio pasują do obecnych heurystyk GeneratorNPC:

- `Cechy Broni Pojazdów` → pasuje do słowa `bron`;
- `Bronie Pojazdów` → pasuje do słowa `broń` lub `bron`;
- `Ekwipunek Pojazdów` → pasuje do słowa `ekwipunek`.

Dlatego zastąpienie heurystycznego wyszukiwania kolekcji w GeneratorNPC dokładnym wskazaniem arkuszy należy traktować jako **warunek wdrożenia zakładek pojazdów**.

Drugim obowiązkowym elementem jest osobny słownik opisów cech broni pojazdów. Nie należy łączyć ich bezwarunkowo z `_meta.traits`, ponieważ może to powodować kolizje nazw z normalnymi cechami broni i pancerzy.

---

## 2. Planowane zakładki pojazdów

### 2.1. Nazwy kanoniczne i etykiety

Rekomendacja: nazwy polskie powinny pozostać kanonicznymi nazwami arkuszy w `Repozytorium.xlsx` i kluczami w `data.sheets`. Nazwy angielskie powinny być etykietami interfejsu, a nie osobnymi arkuszami.

| Kanoniczna nazwa arkusza PL | Podana nazwa EN | Rekomendowana nazwa EN |
|---|---|---|
| `Role W Pojeździe` | `Vehicle Roles` | `Vehicle Roles` |
| `Akcje Pojazdu` | `Vehicle Actions` | `Vehicle Actions` |
| `Pojazdy i Stany` | `Vehicles & Conditions` | `Vehicles & Conditions` |
| `Cechy Pojazdów` | `Vehicle Traits` | `Vehicle Traits` |
| `Pojazdy` | `Vecicles` | `Vehicles` |
| `Cechy Broni Pojazdów` | `Vehicle Weapon Traits` | `Vehicle Weapon Traits` |
| `Bronie Pojazdów` | `Vecicle Weapons` | `Vehicle Weapons` |
| `Ekwipunek Pojazdów` | `Vecicle Wargear` | `Vehicle Wargear` |

W trzech podanych nazwach angielskich występuje prawdopodobna literówka:

- `Vecicles` → `Vehicles`;
- `Vecicle Weapons` → `Vehicle Weapons`;
- `Vecicle Wargear` → `Vehicle Wargear`.

Analiza zakłada użycie poprawionych nazw w etykietach interfejsu. Nie należy wprowadzać błędnych form jako nazw kanonicznych ani aliasów, chyba że później zostaną świadomie zatwierdzone.

### 2.2. Nie tworzyć osobnych arkuszy PL i EN

Nie należy tworzyć szesnastu arkuszy, po jednym zestawie na język. Spowodowałoby to:

- duplikację danych;
- rozjazdy między wersjami;
- podwojenie liczby zakładek w payloadzie;
- dodatkowe kolizje w GeneratorNPC;
- niejasność, który arkusz jest źródłem kanonicznym;
- komplikację `_meta.sheetOrder` i `_meta.columnOrder`.

Rekomendowany model:

```text
Repozytorium.xlsx
└── Pojazdy

DataVault UI PL
└── POJAZDY

DataVault UI EN
└── VEHICLES
```

---

## 3. Checkbox pojazdów

### 3.1. Teksty

Wersja polska:

```text
Czy wyświetlić zakładki dotyczące pojazdów?
```

Rekomendowana wersja angielska, zgodna ze stylem istniejących tłumaczeń:

```text
Show tabs related to vehicles?
```

### 3.2. Rekomendowane identyfikatory

```text
Element DOM:        toggleVehicleTabs
Klucz tłumaczenia:  toggleVehicleTabs
Stan UI:            showVehicleTabs
Grupa arkuszy:      VEHICLE_SHEETS
Klucze kanoniczne:  VEHICLE_SHEET_KEYS
Helper:             isVehicleSheet(name)
Klasa checkboxa:    checkboxRow--vehicle
Klasa etykiety:     checkboxLabel--vehicle
Klasa zakładki:     tab--vehicle
```

### 3.3. Zestaw arkuszy

```js
const VEHICLE_SHEETS = new Set([
  "Role W Pojeździe",
  "Akcje Pojazdu",
  "Pojazdy i Stany",
  "Cechy Pojazdów",
  "Pojazdy",
  "Cechy Broni Pojazdów",
  "Bronie Pojazdów",
  "Ekwipunek Pojazdów",
]);
```

### 3.4. Stan początkowy

Rekomendacja:

```js
showVehicleTabs: false
```

Zakładki pojazdów będą domyślnie ukryte tak samo jak grupy tworzenia postaci i zasad walki.

### 3.5. Zapisywanie sesji

`saveSessionState()` zapisuje całe `uiState`, więc nowe pole automatycznie trafi do `sessionStorage`.

`loadSessionState()` musi jednak zostać jawnie rozszerzone:

```js
uiState.showVehicleTabs = Boolean(parsed.toggles.showVehicleTabs);
```

Bez tego checkbox będzie działał tylko do odświeżenia strony.

---

## 4. Zalecana deklaratywna konfiguracja grup zakładek

Przy trzeciej grupie dalsze dokładanie niezależnych zestawów, helperów, listenerów i bloków `if` zwiększa ryzyko pominięcia któregoś miejsca.

Rekomendowana konfiguracja:

```js
const TAB_GROUPS = {
  character: {
    stateKey: "showCharacterTabs",
    checkboxId: "toggleCharacterTabs",
    sheets: [
      "Tabela Rozmiarów",
      "Gatunki",
      "Archetypy",
      "Premie Frakcji",
      "Słowa Kluczowe Frakcji",
      "Pakiety Wyniesienia",
      "Specjalne Bonusy Frakcji",
      "Implanty Astartes",
      "Zakony Pierwszego Powołania",
    ],
    tabClass: "tab--character",
  },
  combat: {
    stateKey: "showCombatTabs",
    checkboxId: "toggleCombatTabs",
    sheets: [
      "Trafienia Krytyczne",
      "Groza Osnowy",
      "Skrót Zasad",
      "Tryby Ognia",
      "Kary do ST",
    ],
    tabClass: "tab--combat",
  },
  vehicle: {
    stateKey: "showVehicleTabs",
    checkboxId: "toggleVehicleTabs",
    sheets: [
      "Role W Pojeździe",
      "Akcje Pojazdu",
      "Pojazdy i Stany",
      "Cechy Pojazdów",
      "Pojazdy",
      "Cechy Broni Pojazdów",
      "Bronie Pojazdów",
      "Ekwipunek Pojazdów",
    ],
    tabClass: "tab--vehicle",
  },
};
```

Na tej podstawie można generować:

- znormalizowane zestawy nazw;
- filtrowanie widoczności;
- klasy zakładek;
- synchronizację checkboxów;
- listenery;
- zapis i odczyt stanu.

Jeżeli zmiana ma być minimalna, można zachować istniejący styl implementacji i dodać trzeci równoległy zestaw. Długoterminowo deklaratywna konfiguracja jest bezpieczniejsza.

---

## 5. Tłumaczenie nazw zakładek

### 5.1. Aktualne ograniczenie

Obecnie tekst przycisku zakładki jest tworzony bezpośrednio z nazwy arkusza:

```js
b.textContent = name.toUpperCase();
```

Zmiana języka nie tłumaczy nazw zakładek. `applyLanguage()` aktualizuje elementy z `data-i18n`, ale dynamiczne przyciski zakładek nie mają takiego mapowania.

### 5.2. Rekomendowane rozwiązanie

Dodać mapę etykiet:

```js
const SHEET_LABELS = {
  pl: {
    "Role W Pojeździe": "Role W Pojeździe",
    "Akcje Pojazdu": "Akcje Pojazdu",
    "Pojazdy i Stany": "Pojazdy i Stany",
    "Cechy Pojazdów": "Cechy Pojazdów",
    "Pojazdy": "Pojazdy",
    "Cechy Broni Pojazdów": "Cechy Broni Pojazdów",
    "Bronie Pojazdów": "Bronie Pojazdów",
    "Ekwipunek Pojazdów": "Ekwipunek Pojazdów",
  },
  en: {
    "Role W Pojeździe": "Vehicle Roles",
    "Akcje Pojazdu": "Vehicle Actions",
    "Pojazdy i Stany": "Vehicles & Conditions",
    "Cechy Pojazdów": "Vehicle Traits",
    "Pojazdy": "Vehicles",
    "Cechy Broni Pojazdów": "Vehicle Weapon Traits",
    "Bronie Pojazdów": "Vehicle Weapons",
    "Ekwipunek Pojazdów": "Vehicle Wargear",
  },
};
```

Helper:

```js
function getSheetLabel(sheetName) {
  return SHEET_LABELS[currentLanguage]?.[sheetName] || sheetName;
}
```

### 5.3. Oddzielenie etykiety od tożsamości zakładki

Obecnie aktywna zakładka jest rozpoznawana przez porównanie tekstu przycisku. Po przetłumaczeniu nazwy to przestanie działać.

Każdy przycisk powinien przechowywać nazwę kanoniczną:

```js
b.dataset.sheetName = name;
b.textContent = getSheetLabel(name).toUpperCase();
```

Aktywacja:

```js
tab.classList.toggle("active", tab.dataset.sheetName === name);
```

Po zmianie języka należy:

- zaktualizować tekst istniejących przycisków; albo
- ponownie uruchomić `initUI()` z zachowaniem `currentSheet`.

Pierwszy wariant jest lżejszy i nie przebudowuje tabeli.

### 5.4. Zakres tłumaczeń

Ta analiza obejmuje tłumaczenie nazw zakładek. Nazwy kolumn i treść danych nadal będą pochodziły z XLSX. Pełne tłumaczenie kolumn i rekordów wymagałoby osobnej warstwy danych lub map etykiet i nie jest częścią obecnie ustalonego zakresu.

---

## 6. Srebrno-stalowy wariant wizualny

### 6.1. Rekomendowana paleta robocza

Do dalszego dopracowania podczas wdrożenia:

```css
--steel: #AEB7C2;
--steel-bright: #D6DCE2;
--steel-muted: #73808C;
--steel-bg: rgba(174, 183, 194, 0.08);
--steel-bg-active: rgba(174, 183, 194, 0.16);
--steel-border: rgba(174, 183, 194, 0.40);
--steel-glow: rgba(174, 183, 194, 0.30);
```

Kolor jest wyraźnie odmienny od:

- zielonego standardowego interfejsu;
- czerwonej grupy zasad walki;
- jasnego zielono-białego wariantu tworzenia postaci.

### 6.2. Checkbox

```css
.checkboxRow--vehicle,
.checkboxRow--vehicle .checkboxLabel {
  color: var(--steel);
}

.checkboxRow--vehicle input {
  accent-color: var(--steel);
}
```

### 6.3. Zakładki

```css
.tab.tab--vehicle {
  color: var(--steel);
  border-color: var(--steel-border);
  background: var(--steel-bg);
}

.tab.tab--vehicle.active {
  color: var(--steel-bright);
  background: var(--steel-bg-active);
  box-shadow: 0 0 0 2px var(--steel-glow);
}
```

Aktywna zakładka powinna różnić się nie tylko kolorem tekstu, ale również tłem, obramowaniem lub glow. Poprawia to czytelność i ogranicza zależność interfejsu wyłącznie od rozróżniania barw.

### 6.4. Dokumentacja layoutu

Ponieważ zmiana obejmuje nową paletę, klasę checkboxa i klasę zakładek, obowiązkowa będzie aktualizacja:

```text
DetaleLayout.md
```

---

## 7. Obecny mechanizm `Cecha 1..N` i jego ograniczenia

### 7.1. Obecny przepływ

Dla `Bronie`:

1. `Cecha 1`, `Cecha 2` itd. są scalane przez `mergeTraits()`;
2. wynik trafia do kolumny `Cechy`, rozdzielonej `; `;
3. `renderRow()` wykrywa kolumnę `Cechy`;
4. `renderTraitsCell()` tworzy klikalne tagi;
5. kliknięcie wywołuje `openTraitPopover()`;
6. `resolveTrait()` pobiera opis z `_meta.traitIndex`;
7. `_meta.traitIndex` powstaje z `_meta.traits`;
8. `_meta.traits` jest budowane z arkusza `Cechy`.

Dla `Pancerze` działa ten sam mechanizm, ale bez scalania zasięgów.

### 7.2. Ważna niespójność przy nowych arkuszach

Funkcje wyznaczające kolejność kolumn już globalnie zamieniają:

```text
Cecha 1, Cecha 2, Cecha 3...
```

na:

```text
Cechy
```

Dotyczy to:

- `DataVault/app.js`;
- `DataVault/xlsxCanonicalParser.js`;
- `DataVault/build_json.py`.

Jednocześnie faktyczne scalanie rekordów przez `mergeTraits()` jest obecnie uruchamiane tylko dla:

- `Bronie`;
- `Pancerze`.

Jeżeli do `Bronie Pojazdów` zostaną dodane kolumny `Cecha 1..N`, ale nie zostanie rozszerzona logika transformacji, może powstać niespójność:

- `_meta.columnOrder` będzie oczekiwało kolumny `Cechy`;
- rekordy nadal będą zawierały `Cecha 1`, `Cecha 2` itd.;
- UI może nie pokazać wartości albo pokazać nieprawidłowy układ kolumn.

Jest to ryzyko wysokie i musi zostać obsłużone jednocześnie w obu generatorach danych.

---

## 8. Rekomendowana konfiguracja transformacji arkuszy

Zamiast kolejnych warunków:

```js
if (name === "Bronie") ...
else if (name === "Pancerze") ...
```

rekomendowana jest jawna konfiguracja:

```js
const SHEET_TRANSFORMS = {
  "Bronie": {
    mergeTraits: true,
    mergeRange: true,
  },
  "Pancerze": {
    mergeTraits: true,
  },
  "Bronie Pojazdów": {
    mergeTraits: true,
  },
};
```

Po ustaleniu kolumn można dodać:

```js
"Pojazdy": {
  mergeTraits: true,
},
```

jeśli arkusz `Pojazdy` również będzie korzystał z `Cecha 1..N`.

Jeżeli `Bronie Pojazdów` będą używały `Zasięg 1`, `Zasięg 2`, `Zasięg 3`, należy włączyć także:

```js
mergeRange: true
```

Nie należy tego zakładać przed ustaleniem kolumn.

### 8.1. Miejsca wymagające zgodności

Transformacja musi być identyczna w:

1. `DataVault/app.js`:
   - `transformSheet()`;
   - `buildDataJsonFromSheets()`;
2. `DataVault/build_json.py`;
3. wynikach generowanych przez parser przeglądarkowy i CLI.

`DataVault/xlsxCanonicalParser.js` nie wymaga obecnie osobnej transformacji rekordów, ponieważ przekazuje surowe arkusze do `buildDataJsonFromSheets()`. Musi jednak pozostać objęty testem kolejności kolumn.

---

## 9. Osobny indeks cech broni pojazdów

### 9.1. Dlaczego nie używać wyłącznie `_meta.traits`

Obecne `_meta.traits` pochodzi z arkusza `Cechy`.

Jeżeli cechy z `Cechy Broni Pojazdów` zostaną dodane do tego samego słownika:

- identyczne nazwy mogą nadpisać się;
- opis zwykłej cechy może zostać pokazany dla broni pojazdu;
- opis cechy broni pojazdu może zostać pokazany dla zwykłej broni;
- nie będzie wiadomo, z którego arkusza pochodzi opis;
- komunikat o braku cechy będzie wskazywał niewłaściwy arkusz.

### 9.2. Rekomendowana struktura metadanych

Minimalny wariant:

```json
{
  "_meta": {
    "traits": {},
    "vehicleWeaponTraits": {},
    "states": {},
    "sheetOrder": [],
    "columnOrder": {}
  }
}
```

Źródła:

```text
_meta.traits
└── Cechy

_meta.vehicleWeaponTraits
└── Cechy Broni Pojazdów
```

Po późniejszym zatwierdzeniu analogicznego działania dla pojazdów można dodać:

```text
_meta.vehicleTraits
└── Cechy Pojazdów
```

Jeżeli `Pojazdy i Stany` mają zasilać klikalne opisy stanów pojazdów, można rozważyć:

```text
_meta.vehicleConditions
└── Pojazdy i Stany
```

Te dwa ostatnie indeksy pozostają na razie decyzjami do podjęcia.

### 9.3. Normalizacja runtime

`normaliseDB()` powinno budować osobny indeks:

```js
vehicleWeaponTraitIndex
```

według tych samych zasad co `traitIndex`:

- klucz kanoniczny;
- wariant bez spacji;
- obsługa cech parametryzowanych `(X)`.

### 9.4. Wybór źródła opisu na podstawie arkusza

Rekomendowana mapa:

```js
const TRAIT_INDEX_BY_SHEET = {
  "Bronie": "traitIndex",
  "Pancerze": "traitIndex",
  "Bronie Pojazdów": "vehicleWeaponTraitIndex",
};
```

Po późniejszym potwierdzeniu:

```js
"Pojazdy": "vehicleTraitIndex"
```

### 9.5. Zmiana sygnatur funkcji

Obecne:

```js
renderTraitsCell(value)
openTraitPopover(traitText)
resolveTrait(traitText)
```

Rekomendowane:

```js
renderTraitsCell(value, sourceSheet)
openTraitPopover(traitText, sourceSheet)
resolveTrait(traitText, sourceSheet)
```

Przykład wywołania:

```js
if (col === "Cechy") {
  td.appendChild(renderTraitsCell(r[col], currentSheet));
}
```

Dzięki temu opis jest wybierany na podstawie arkusza, w którym kliknięto tag, a nie tylko na podstawie nazwy cechy.

### 9.6. Komunikaty błędów

Należy dodać osobne komunikaty PL/EN:

```text
PL:
Nie znaleziono tej cechy w zakładce Cechy Broni Pojazdów.

EN:
This trait was not found in the Vehicle Weapon Traits sheet.
```

Zwykłe cechy powinny nadal używać komunikatu odnoszącego się do `Cechy`.

---

## 10. Możliwe rozszerzenie dla `Pojazdy` i `Cechy Pojazdów`

Lista nowych arkuszy zawiera parę:

```text
Pojazdy
Cechy Pojazdów
```

Prawdopodobne jest, że `Pojazdy` również będą miały kolumny `Cecha 1..N`, a kliknięcie będzie pobierało opis z `Cechy Pojazdów`.

Nie zostało to jednak wskazane równie jednoznacznie jak mechanizm:

```text
Bronie Pojazdów
Cechy Broni Pojazdów
```

Dlatego analiza rozdziela:

- **wymaganie potwierdzone:** cechy broni pojazdów;
- **wymaganie prawdopodobne:** cechy samych pojazdów.

Architektura powinna być od początku przygotowana tak, aby dodanie drugiego indeksu nie wymagało kolejnego przebudowania całego mechanizmu popoverów.

---

## 11. Wpływ dokładnych nazw na GeneratorNPC

### 11.1. Obecny problem

GeneratorNPC korzysta z `getCollection(data, keywords)`, które rekurencyjnie przeszukuje całe drzewo danych i zwraca pierwszą pasującą kolekcję.

Używane słowa dla broni:

```text
broń
bron
weapon
```

Używane słowa dla ekwipunku:

```text
ekwipunek
equipment
```

### 11.2. Kolizje z planowanymi arkuszami

| Nowy arkusz | Kolekcja GeneratorNPC narażona na podmianę | Przyczyna |
|---|---|---|
| `Cechy Broni Pojazdów` | `state.weapons` | nazwa zawiera `bron` |
| `Bronie Pojazdów` | `state.weapons` | nazwa zawiera `bron` |
| `Ekwipunek Pojazdów` | `state.equipment` | nazwa zawiera `ekwipunek` |
| `Vehicle Weapon Traits` jako klucz | `state.weapons` | nazwa zawiera `weapon` |
| `Vehicle Weapons` jako klucz | `state.weapons` | nazwa zawiera `weapon` |

Nawet jeśli obecna kolejność arkuszy powoduje, że `Bronie` zostaną znalezione jako pierwsze, nie wolno opierać poprawności GeneratorNPC na kolejności arkuszy w XLSX.

### 11.3. Wymagana poprawka

GeneratorNPC powinien pobierać dokładne arkusze:

```js
const getRequiredSheetRecords = (data, sheetName) => {
  const section = data?.sheets?.[sheetName];
  const records = extractRecords(section);

  if (!records.length) {
    throw new Error(`GENERATORNPC_REQUIRED_SHEET_MISSING:${sheetName}`);
  }

  return records;
};
```

Następnie:

```js
state.bestiary = sortByName(
  getRequiredSheetRecords(data, "Bestiariusz")
);

state.armor = sortByTypeThenName(
  getRequiredSheetRecords(data, "Pancerze")
);

state.weapons = sortByTypeThenName(
  getRequiredSheetRecords(data, "Bronie")
);

state.augmentations = sortByTypeThenName(
  getRequiredSheetRecords(data, "Augumentacje")
);

state.equipment = sortByTypeThenName(
  getRequiredSheetRecords(data, "Ekwipunek")
);

state.talents = sortByName(
  getRequiredSheetRecords(data, "Talenty")
);

state.psionics = sortByTypeThenName(
  getRequiredSheetRecords(data, "Psionika"),
  { typeDescending: true }
);

state.prayers = sortByName(
  getRequiredSheetRecords(data, "Modlitwy")
);
```

### 11.4. Aliasowanie

Jeżeli w przyszłości wymagane będą alternatywne nazwy arkuszy, należy użyć jawnej mapy:

```js
const SHEET_ALIASES = {
  Bronie: ["Bronie"],
  Pancerze: ["Pancerze"],
};
```

Nie należy pozostawiać dopasowania fragmentów w dowolnym miejscu drzewa.

### 11.5. Nowe arkusze pojazdów a GeneratorNPC

Na obecnym etapie GeneratorNPC nie ma korzystać z pojazdów. Powinien:

- ignorować nowe arkusze;
- nadal pobierać zwykłe `Bronie`;
- nadal pobierać zwykłe `Ekwipunek`;
- nie budować modułów pojazdów;
- nie zmieniać formatu ulubionych;
- nie zmieniać generowanej karty NPC.

Jeżeli w przyszłości GeneratorNPC ma otrzymać moduł pojazdów, powinno to być oddzielne zadanie projektowe.

---

## 12. Zakładki tylko dla admina

Każdy z ośmiu arkuszy może jednocześnie:

- należeć do `VEHICLE_SHEETS`;
- należeć do `ADMIN_ONLY_SHEETS`.

Zachowanie:

| Tryb | Checkbox pojazdów wyłączony | Checkbox pojazdów włączony |
|---|---:|---:|
| Gracz | ukryta | widoczna tylko jeśli nie admin-only |
| Admin | ukryta | widoczna |

Dokładna lista arkuszy admin-only nie została jeszcze ustalona.

### Ograniczenie bezpieczeństwa

`ADMIN_MODE` jest aktywowany parametrem `?admin=1`. Jest to filtr interfejsu, a nie serwerowa rola.

Wszystkie arkusze nadal trafiają do jednego:

```text
/datavault/live
```

Dlatego admin-only:

- ukrywa przycisk zakładki;
- nie usuwa danych z payloadu;
- nie zabezpiecza danych przed innym uwierzytelnionym klientem;
- nie blokuje odczytu przez GeneratorNPC.

Rzeczywiste zabezpieczenie wymaga osobnego źródła danych lub osobnych reguł Firebase.

---

## 13. Widok domyślny i kolumny

Na obecnym etapie nie należy uzupełniać `DEFAULT_VIEW_CONFIG` dla nowych arkuszy.

Do ustalenia pozostają:

- dokładne kolumny każdego arkusza;
- wartości domyślnie ukryte;
- domyślne filtry listowe;
- sortowanie główne;
- sortowanie dodatkowe;
- kolumny liczbowe;
- szerokości kolumn;
- wyrównanie;
- kolumny z nowrap;
- zasady formatowania słów kluczowych;
- ewentualne scalanie `Zasięg 1..N`;
- użycie `Cecha 1..N` w `Pojazdy`;
- sposób prezentacji stanów pojazdów.

Nowe arkusze bez konfiguracji domyślnej nadal mogą działać. Otrzymają:

- brak filtrów domyślnych;
- sortowanie po `LP`, jeśli kolumna istnieje;
- w przeciwnym razie brak domyślnego sortowania.

---

## 14. Pliki przewidywane do zmiany

### 14.1. DataVault — kod

- `DataVault/index.html`;
- `DataVault/app.js`;
- `DataVault/style.css`;
- `DataVault/build_json.py`;
- prawdopodobnie bez zmiany logiki `DataVault/xlsxCanonicalParser.js`, ale z obowiązkowym testem.

### 14.2. Źródło i artefakty danych

- `DataVault/Repozytorium.xlsx`;
- `DataVault/data.json`;
- `DataVault/firebase-import.json`.

### 14.3. GeneratorNPC

- `GeneratorNPC/index.html`;
- `GeneratorNPC/docs/Documentation.md`;
- `GeneratorNPC/docs/README.md`.

### 14.4. Dokumentacja DataVault

- `DataVault/docs/Documentation.md`;
- `DataVault/docs/README.md`;
- `DataVault/docs/ZasadyFormatowania.md`, jeżeli nowe arkusze otrzymają specjalne reguły formatowania;
- `DetaleLayout.md`.

### 14.5. Wspólny loader Firebase

Brak potrzeby zmiany:

```text
shared/firebase-data-loader.js
```

o ile:

- wszystkie dane nadal będą przechowywane w `/datavault/live`;
- nie zostanie wdrożone rzeczywiste rozdzielenie admin/gracz.

---

## 15. Plan testów regresji

### 15.1. Checkbox i widoczność

1. Checkbox pojazdów jest domyślnie odznaczony.
2. Wszystkie osiem zakładek jest ukryte po starcie.
3. Zaznaczenie pokazuje wyłącznie zakładki należące do grupy pojazdów.
4. Odznaczenie ukrywa całą grupę.
5. Ukrycie aktualnie aktywnej zakładki wybiera prawidłowy fallback.
6. Stan checkboxa przetrwa odświeżenie w tej samej sesji.
7. Zakładki admin-only nie pojawiają się w widoku gracza.
8. Zakładki admin-only pojawiają się w widoku admina dopiero po zaznaczeniu checkboxa.

### 15.2. Tłumaczenia

1. PL pokazuje polskie etykiety.
2. EN pokazuje:
   - `Vehicle Roles`;
   - `Vehicle Actions`;
   - `Vehicles & Conditions`;
   - `Vehicle Traits`;
   - `Vehicles`;
   - `Vehicle Weapon Traits`;
   - `Vehicle Weapons`;
   - `Vehicle Wargear`.
3. Zmiana języka nie zmienia `currentSheet`.
4. Aktywna klasa nadal działa po przetłumaczeniu etykiety.
5. Kliknięcie przetłumaczonej zakładki wybiera polski klucz kanoniczny.
6. Nie występują błędne formy `Vecicle` ani `Vecicles`.

### 15.3. Styl

1. Checkbox ma srebrno-stalową etykietę.
2. Checkbox używa stalowego `accent-color`.
3. Zakładki pojazdów mają stalowy tekst i obramowanie.
4. Aktywna zakładka jest czytelnie wyróżniona.
5. Kolor nie zlewa się z zielenią i czerwienią.
6. Styl działa na desktopie i urządzeniach mobilnych.
7. Zawijanie listy zakładek nie powoduje wyjścia poza kontener.

### 15.4. `Cecha 1..N`

1. `Bronie Pojazdów` z `Cecha 1..N` generują jedną kolumnę `Cechy`.
2. Kolejność cech jest zgodna z numerami kolumn.
3. Puste wartości i `-` są pomijane.
4. Brak cech daje `-`.
5. `_meta.columnOrder["Bronie Pojazdów"]` zawiera `Cechy`, nie `Cecha 1`.
6. Rekordy zawierają `Cechy`, nie surowe kolumny `Cecha N`.
7. Wynik parsera JS i `build_json.py` jest identyczny.
8. Ponowne przetworzenie już scalonego rekordu jest idempotentne.

### 15.5. Popover cech broni pojazdów

1. Kliknięcie cechy w `Bronie Pojazdów` korzysta z `Cechy Broni Pojazdów`.
2. Kliknięcie cechy w `Bronie` nadal korzysta z `Cechy`.
3. Kliknięcie cechy w `Pancerze` nadal korzysta z `Cechy`.
4. Identyczna nazwa w obu słownikach nie powoduje podmiany opisu.
5. Cechy parametryzowane `(X)` działają dla broni pojazdów.
6. Brak opisu pokazuje komunikat wskazujący prawidłowy arkusz.
7. Zmiana języka aktualizuje etykietę i komunikat błędu.
8. Porównanie rekordów nie wywołuje błędu przy kolumnie `Cechy`.

### 15.6. GeneratorNPC

1. `state.weapons` pochodzi wyłącznie z `sheets.Bronie`.
2. `state.equipment` pochodzi wyłącznie z `sheets.Ekwipunek`.
3. `Cechy Broni Pojazdów` nie trafiają do listy broni.
4. `Bronie Pojazdów` nie trafiają do listy broni NPC.
5. `Ekwipunek Pojazdów` nie trafia do listy ekwipunku NPC.
6. Liczby rekordów wszystkich ośmiu kolekcji pozostają identyczne przed i po dodaniu pojazdów.
7. Brak wymaganego arkusza zwraca czytelny błąd.
8. Ulubione zachowują zgodność.
9. Generowanie karty NPC działa bez zmian.
10. `_meta.traits` nadal zasila zwykłe cechy.

### 15.7. Firebase i eksport

1. Wszystkie nowe arkusze występują w `sheets`.
2. Kolejność jest poprawna w `_meta.sheetOrder`.
3. Kolejność kolumn jest poprawna w `_meta.columnOrder`.
4. `_meta.vehicleWeaponTraits` istnieje i ma prawidłową zawartość.
5. `firebase-import.json` przechodzi walidację.
6. `dataJson` przechodzi round-trip `JSON.parse`.
7. Po imporcie oba moduły ładują dane.
8. Rozmiar payloadu pozostaje akceptowalny.

---

## 16. Macierz ryzyka

| Ryzyko | Poziom | Uwagi |
|---|---|---|
| `Cechy Broni Pojazdów` zostanie użyte jako zwykłe `Bronie` w GeneratorNPC | Krytyczny | Nazwa pasuje do `bron` |
| `Bronie Pojazdów` zostaną użyte jako zwykłe `Bronie` w GeneratorNPC | Krytyczny | Nazwa pasuje do `bron` |
| `Ekwipunek Pojazdów` zostanie użyty jako zwykły `Ekwipunek` w GeneratorNPC | Krytyczny | Nazwa pasuje do `ekwipunek` |
| `_meta.columnOrder` oczekuje `Cechy`, ale rekordy nadal mają `Cecha N` | Wysoki | Wymaga rozszerzenia transformacji |
| Cechy zwykłe i cechy broni pojazdów nadpiszą się w jednym słowniku | Wysoki | Wymaga osobnego indeksu |
| Przetłumaczony tekst zakładki zepsuje wykrywanie aktywnej zakładki | Wysoki | Tożsamość musi być w `dataset` |
| `ADMIN_MODE` zostanie uznany za zabezpieczenie | Wysoki | To tylko filtr UI |
| Pominięcie `showVehicleTabs` w `loadSessionState()` | Średni | Stan zniknie po odświeżeniu |
| Literówki `Vecicle` / `Vecicles` trafią do UI | Średni | Należy użyć poprawionych etykiet |
| Brak odrębnego komunikatu błędu dla cech broni pojazdów | Średni | Użytkownik dostanie mylącą informację |
| Brak aktualizacji `DetaleLayout.md` | Niski | Dokumentacja nie odzwierciedli nowego koloru |
| Nowe neutralne arkusze bez kolumn specjalnych | Niski | Parser już je obsługuje |

---

## 17. Rekomendowana kolejność wdrożenia

1. Zatwierdzić poprawione angielskie etykiety.
2. Zatwierdzić polskie nazwy kanoniczne arkuszy.
3. Utwardzić GeneratorNPC przez dokładne pobieranie ośmiu arkuszy.
4. Dodać walidację brakujących arkuszy w GeneratorNPC.
5. Wprowadzić mapę etykiet zakładek PL/EN i oddzielić tekst od klucza kanonicznego.
6. Dodać grupę `vehicle` i checkbox.
7. Dodać srebrno-stalowy wariant CSS.
8. Dodać arkusze do `Repozytorium.xlsx`.
9. Dodać transformację `Cecha 1..N` dla `Bronie Pojazdów`.
10. Dodać `_meta.vehicleWeaponTraits`.
11. Przekazywać kontekst arkusza do resolvera cech.
12. Wygenerować `data.json` i `firebase-import.json` obiema ścieżkami.
13. Porównać wyniki parsera JS i `build_json.py`.
14. Wykonać testy DataVault.
15. Wykonać testy GeneratorNPC.
16. Ustalić kolumny i widoki domyślne.
17. Uzupełnić `DEFAULT_VIEW_CONFIG`, formatowanie i szerokości.
18. Ustalić listę zakładek admin-only.
19. Zaktualizować dokumentację.

---

## 18. Decyzje pozostawione na później

1. Dokładny spis kolumn dla ośmiu arkuszy.
2. Kolejność nowych arkuszy w workbooku.
3. Domyślne sortowanie.
4. Domyślne filtry.
5. Lista arkuszy admin-only.
6. Czy `Pojazdy` używają `Cecha 1..N`.
7. Czy `Pojazdy` pobierają opisy z `Cechy Pojazdów`.
8. Czy `Pojazdy i Stany` zasila klikalne opisy stanów.
9. Czy `Bronie Pojazdów` używają `Zasięg 1..N`.
10. Czy `Ekwipunek Pojazdów` ma mieć specjalne formatowanie.
11. Czy słowa kluczowe pojazdów mają mieć czerwony tekst i neutralne przecinki.
12. Które kolumny mają być domyślnie ukryte.
13. Czy język angielski ma być udostępniony użytkownikowi przez pokazanie obecnie ukrytego selektora.
14. Finalne wartości kolorów stalowych po sprawdzeniu na docelowym ekranie.

---

## 19. Ostateczna rekomendacja

Zakładki pojazdów można dodać bez zmiany zewnętrznego schematu Firebase `/datavault/live`, ale wdrożenie nie powinno ograniczać się do dopisania nazw arkuszy i checkboxa.

Minimalny bezpieczny zakres obejmuje:

- dokładne selektory arkuszy w GeneratorNPC;
- nową grupę `vehicle`;
- checkbox PL/EN;
- stalowy wariant UI;
- mapę etykiet zakładek;
- oddzielenie etykiety od kanonicznej nazwy arkusza;
- transformację `Cecha 1..N` dla broni pojazdów;
- osobny indeks `_meta.vehicleWeaponTraits`;
- kontekstowe rozwiązywanie opisów cech;
- zgodność generatora JS i `build_json.py`;
- pełne testy regresji obu modułów.

Najważniejsza zasada projektowa: **nazwy arkuszy są kontraktem danych, a etykiety widoczne w interfejsie są warstwą prezentacji**. Rozdzielenie tych dwóch warstw zapobiegnie problemom z tłumaczeniami, filtrowaniem, aktywnymi zakładkami i zależnościami GeneratorNPC.


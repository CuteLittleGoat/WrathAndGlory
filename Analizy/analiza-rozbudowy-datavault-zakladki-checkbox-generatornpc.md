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

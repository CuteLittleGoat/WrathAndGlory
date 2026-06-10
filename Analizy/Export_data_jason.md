# Export_data_jason — root-ready `firebase-import.json` dla DataVault

## Data analizy
2026-06-10

## Temat analizy
Poprawa eksportu `firebase-import.json` w module DataVault tak, aby plik był przeznaczony do importu z poziomu root Firebase Realtime Database i po imporcie tworzył runtime payload pod `/datavault/live`.

## Oryginalny pełny prompt użytkownika

```text
Repozytorium: CuteLittleGoat/WrathAndGlory

Zadanie: popraw generowanie pliku firebase-import.json w module DataVault tak, aby plik był gotowy do importu w Firebase Realtime Database z poziomu root bazy, a nie tylko jako payload dla węzła /datavault/live.

Kontekst problemu:
Obecnie moduł DataVault generuje dwa pliki:
1. data.json — lokalny backup / artefakt diagnostyczny.
2. firebase-import.json — plik przeznaczony do importu do Firebase.

Obecny firebase-import.json ma strukturę:

{
  "schemaVersion": "datavault-firebase-import-v1",
  "createdAt": "...",
  "source": "Repozytorium.xlsx",
  "dataJson": "{...}"
}

Ta struktura jest poprawna wyłącznie wtedy, gdy użytkownik importuje ją ręcznie do ścieżki /datavault/live. W praktyce użytkownik importuje JSON na poziomie root Realtime Database, przez co Firebase tworzy:

/
├── schemaVersion
├── createdAt
├── source
└── dataJson

A aplikacja szuka danych pod:

/datavault/live

Dlatego aplikacja zwraca błąd DATA_NOT_FOUND / „nie znaleziono prywatnych danych w Firebase”.

Wymagane zachowanie po zmianie:
Plik firebase-import.json ma być gotowy do importu z poziomu root Firebase Realtime Database i ma mieć strukturę:

{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "...",
      "source": "Repozytorium.xlsx",
      "dataJson": "{...}"
    }
  }
}

Po imporcie w Firebase root ma powstać:

/
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson

Nie zmieniaj ścieżki odczytu danych w loaderze. shared/firebase-data-loader.js nadal ma czytać z DATA_PATH = "datavault/live". Zmieniamy sposób generowania pliku importowego, nie sposób odczytu runtime.

Zakres zmian:

1. DataVault/app.js

Znajdź funkcję buildFirebaseImportJson(dataJsonObject).

Obecnie zwraca ona sam payload:

{
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "Repozytorium.xlsx",
  dataJson: JSON.stringify(dataJsonObject),
}

Zmień ją tak, aby zwracała root-ready import:

{
  datavault: {
    live: {
      schemaVersion: "datavault-firebase-import-v1",
      createdAt: new Date().toISOString(),
      source: "Repozytorium.xlsx",
      dataJson: JSON.stringify(dataJsonObject),
    }
  }
}

2. DataVault/app.js — walidacja

Zaktualizuj validateFirebaseImportObject(firebaseImportObject, originalData), aby walidowała nowy format.

Walidacja ma sprawdzać co najmniej:
- top-level istnieje i jest obiektem,
- top-level zawiera wyłącznie poprawne klucze Firebase,
- istnieje firebaseImportObject.datavault,
- firebaseImportObject.datavault jest obiektem,
- istnieje firebaseImportObject.datavault.live,
- firebaseImportObject.datavault.live jest obiektem,
- payload = firebaseImportObject.datavault.live,
- payload.schemaVersion === "datavault-firebase-import-v1",
- payload.dataJson jest stringiem,
- JSON.parse(payload.dataJson) daje dokładnie originalData,
- JSON.stringify(restored) === JSON.stringify(originalData).

Walidacja ma nadal chronić przed nieprawidłowymi kluczami Firebase tam, gdzie ma to sens. Nie próbuj walidować kluczy wewnątrz dataJson, bo dataJson jest stringiem i może zawierać nazwy arkuszy/kolumn niedozwolone jako klucze Firebase. To jest celowe.

3. DataVault/app.js — komunikaty UI

Zaktualizuj polski i angielski tekst przy przycisku generowania danych, żeby jednoznacznie mówił, że:
- data.json jest backupem,
- firebase-import.json jest plikiem gotowym do importu na poziomie root Firebase Realtime Database,
- po imporcie dane trafią pod /datavault/live.

Obecny tekst PL jest mniej więcej:
„Kliknij, aby wybrać lokalny plik Repozytorium.xlsx. Aplikacja wygeneruje data.json jako backup oraz firebase-import.json — tylko ten drugi plik importuj do Firebase Realtime Database.”

Zmień go na tekst w tym sensie:
„Kliknij, aby wybrać lokalny plik Repozytorium.xlsx. Aplikacja wygeneruje data.json jako backup oraz firebase-import.json — plik gotowy do importu w root Firebase Realtime Database. Po imporcie dane zostaną umieszczone pod /datavault/live.”

Zmień analogicznie wersję EN.

Zaktualizuj też status po wygenerowaniu plików, jeśli obecny status może sugerować stary sposób importu. Komunikat powinien być jednoznaczny, że firebase-import.json jest root-ready.

4. Dokumentacja

Zaktualizuj dokumentację w repo, jeśli istnieją odpowiednie miejsca:
- DataVault/docs/Documentation.md
- shared/FirebaseREADME.md
- inne znalezione dokumenty opisujące import firebase-import.json lub strukturę /datavault/live.

Dokumentacja ma mówić:
- runtime nadal czyta /datavault/live,
- firebase-import.json generowany przez DataVault jest plikiem do importu z poziomu root Realtime Database,
- nie należy importować tego pliku bezpośrednio do /datavault/live, bo wtedy powstałoby /datavault/live/datavault/live,
- dataJson pozostaje stringiem JSON,
- schemaVersion payloadu pozostaje "datavault-firebase-import-v1".

5. Utwórz plik analityczny / changelog

Utwórz nowy plik:

Analizy/Export_data_jason.md

Uwaga: zachowaj dokładnie tę nazwę pliku: Export_data_jason.md, nawet jeśli „jason” wygląda jak literówka.

Plik ma być ultra dokładnym changelogiem / patch notes i ma później służyć jako wsad do wdrożenia tej samej poprawki w innym repo w analogicznej aplikacji.

W pliku Analizy/Export_data_jason.md opisz bardzo szczegółowo:

A. Tytuł i cel zmiany
- czego dotyczy zmiana,
- jaki błąd użytkownika rozwiązuje,
- dlaczego zmiana jest potrzebna.

B. Stan przed zmianą
- stara struktura firebase-import.json,
- gdzie użytkownik musiał importować plik,
- co się działo, gdy importował do root,
- dlaczego aplikacja zwracała DATA_NOT_FOUND.

C. Root cause
- loader czyta z /datavault/live,
- generator produkował tylko payload dla /datavault/live,
- UI sugerował import do Firebase, ale nie precyzował ścieżki,
- naturalny import root tworzył dane w złym miejscu.

D. Stan po zmianie
- nowa struktura firebase-import.json,
- import wykonywany w root bazy,
- finalne drzewo w Realtime Database,
- brak zmiany DATA_PATH,
- zgodność ze starym loaderem.

E. Lista zmienionych plików
Dla każdego pliku opisz:
- ścieżkę,
- funkcję/sekcję,
- co zmieniono,
- dlaczego.

F. Dokładne patch notes
Uwzględnij:
- buildFirebaseImportJson,
- validateFirebaseImportObject,
- teksty PL/EN,
- dokumentację,
- zachowanie data.json,
- zachowanie firebase-import.json,
- zachowanie runtime loadera.

G. Przykłady JSON
Dodaj przykłady:
- stary błędnie importowany root,
- stary payload dla /datavault/live,
- nowy root-ready firebase-import.json,
- oczekiwane drzewo w Firebase po imporcie.

H. Instrukcja wdrożenia w analogicznej aplikacji
Napisz krok po kroku, jak przenieść poprawkę do innego repo:
1. znaleźć funkcję generującą Firebase import JSON,
2. sprawdzić ścieżkę odczytu runtime,
3. opakować payload w drzewo odpowiadające ścieżce runtime,
4. zaktualizować walidację,
5. zaktualizować teksty UI,
6. zaktualizować dokumentację,
7. wykonać test importu root,
8. sprawdzić, czy aplikacja odczytuje dane.

I. Checklist testów
Dodaj checklistę:
- generowanie data.json,
- generowanie firebase-import.json,
- parse dataJson,
- porównanie round-trip,
- import do root Firebase,
- sprawdzenie drzewa /datavault/live,
- logowanie w aplikacji,
- brak DATA_NOT_FOUND,
- widoczne zakładki i dane,
- brak zmiany data.json,
- brak zmiany loadera.

J. Ryzyka i rollback
Opisz:
- co się stanie, jeśli ktoś zaimportuje nowy plik do /datavault/live,
- jak rozpoznać podwójne zagnieżdżenie /datavault/live/datavault/live,
- jak usunąć błędny import,
- jak wrócić do starego sposobu, jeśli będzie konieczne.

K. Kryteria akceptacji
Wypunktuj jednoznacznie:
- firebase-import.json importowany do root tworzy /datavault/live,
- loader bez zmian ładuje dane,
- dataJson nadal jest stringiem,
- data.json pozostaje backupem,
- dokumentacja opisuje nowy workflow,
- Analizy/Export_data_jason.md istnieje i zawiera pełne patch notes.

6. Nie zmieniaj

Nie zmieniaj:
- shared/firebase-data-loader.js DATA_PATH,
- schematu wewnętrznego dataJson,
- sposobu budowy data.json,
- parsera XLSX, chyba że okaże się to absolutnie konieczne,
- nazw plików wyjściowych: data.json i firebase-import.json.

7. Testy / weryfikacja

Po zmianach wykonaj możliwą lokalną weryfikację statyczną:
- sprawdź składnię JS,
- sprawdź, czy buildFirebaseImportJson tworzy root-ready strukturę,
- sprawdź, czy validateFirebaseImportObject waliduje nową strukturę,
- sprawdź, czy dataJson po JSON.parse zawiera sheets,
- upewnij się, że runtime loader nadal spodziewa się payloadu pod /datavault/live i unwrapDataVaultPayload nadal dostaje obiekt live payloadu, nie całe root-ready drzewo.

Na końcu odpowiedzi podaj:
- listę zmienionych plików,
- krótkie streszczenie zmian,
- instrukcję ręcznego testu w Firebase,
- informację, że plik Analizy/Export_data_jason.md został utworzony.
```

## Zakres analizy
Analiza obejmuje generator eksportu Firebase w `DataVault/app.js`, walidację tworzonego importu, teksty interfejsu przy generowaniu plików danych, dokumentację DataVault i dokumentację wspólnego źródła Firebase. Analiza celowo nie obejmuje zmiany `shared/firebase-data-loader.js`, wewnętrznego schematu `dataJson`, parsera XLSX ani sposobu budowy `data.json`.

## A. Tytuł i cel zmiany

### Tytuł
Root-ready export `firebase-import.json` dla DataVault.

### Cel
Celem zmiany jest dostosowanie pliku `firebase-import.json` generowanego przez DataVault do rzeczywistego sposobu importu wykonywanego przez użytkownika w konsoli Firebase Realtime Database: import na poziomie root bazy (`/`).

### Rozwiązywany błąd użytkownika
Zmiana rozwiązuje sytuację, w której użytkownik importował dotychczasowy `firebase-import.json` na poziomie root, a aplikacja po zalogowaniu nadal zwracała `DATA_NOT_FOUND` / „nie znaleziono prywatnych danych w Firebase”. Import był technicznie poprawny dla Firebase, ale tworzył pola w złym miejscu drzewa bazy.

### Dlaczego zmiana jest potrzebna
Runtime aplikacji czyta z `/datavault/live`. Plik importowy musi więc po imporcie w root utworzyć dokładnie takie drzewo. Jeśli plik zawiera tylko payload bez opakowania `datavault.live`, root import tworzy pola `schemaVersion`, `createdAt`, `source` i `dataJson` bezpośrednio pod `/`, których loader nie odczytuje.

## B. Stan przed zmianą

### Stara struktura `firebase-import.json`
Przed zmianą eksport miał postać samego payloadu przeznaczonego logicznie dla węzła `/datavault/live`:

```json
{
  "schemaVersion": "datavault-firebase-import-v1",
  "createdAt": "2026-06-10T00:00:00.000Z",
  "source": "Repozytorium.xlsx",
  "dataJson": "{...}"
}
```

### Gdzie użytkownik musiał importować plik
Aby stary plik zadziałał, użytkownik musiał ręcznie wejść w Firebase Realtime Database do ścieżki `/datavault/live` i dopiero tam zaimportować JSON. Tylko wtedy pola payloadu lądowały w miejscu oczekiwanym przez loader.

### Co działo się przy imporcie do root
Przy imporcie starego pliku na poziomie root Firebase tworzył:

```text
/
├── schemaVersion
├── createdAt
├── source
└── dataJson
```

### Dlaczego aplikacja zwracała `DATA_NOT_FOUND`
`shared/firebase-data-loader.js` czyta ścieżkę `datavault/live`. Po starym imporcie root ścieżka `/datavault/live` nie istniała, więc snapshot zwracany przez Realtime Database nie istniał, a loader rzucał `DATA_NOT_FOUND`.

## C. Root cause

1. Runtime loader czytał i nadal czyta dane z `/datavault/live`.
2. Generator produkował tylko payload, który był poprawny jako zawartość węzła `/datavault/live`, ale nie jako cały plik importowany do root.
3. Tekst UI informował o imporcie do Firebase, lecz nie mówił jednoznacznie, że stary payload wymaga importu do konkretnej ścieżki.
4. Naturalny workflow użytkownika w konsoli Firebase to import pliku JSON na poziomie root bazy.
5. Root import starego payloadu tworzył dane bezpośrednio pod `/`, więc nie tworzył ścieżki `/datavault/live`.

## D. Stan po zmianie

### Nowa struktura `firebase-import.json`
Po zmianie plik `firebase-import.json` ma strukturę root-ready:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "2026-06-10T00:00:00.000Z",
      "source": "Repozytorium.xlsx",
      "dataJson": "{...}"
    }
  }
}
```

### Import wykonywany w root bazy
Użytkownik importuje cały plik w root Firebase Realtime Database (`/`). Nie musi ręcznie przechodzić do `/datavault/live` przed importem.

### Finalne drzewo w Realtime Database
Po poprawnym imporcie root powstaje:

```text
/
└── datavault
    └── live
        ├── schemaVersion
        ├── createdAt
        ├── source
        └── dataJson
```

### Brak zmiany `DATA_PATH`
`DATA_PATH` w `shared/firebase-data-loader.js` pozostaje `datavault/live`. Zmieniony został tylko plik importowy generowany przez DataVault.

### Zgodność z dotychczasowym loaderem
Loader nadal otrzymuje obiekt payloadu `live`, czyli obiekt zawierający `schemaVersion`, `createdAt`, `source` i `dataJson`. Funkcja unwrap nadal parsuje `dataJson` z tego payloadu, a nie z całego drzewa root-ready.

## E. Lista zmienionych plików

### `DataVault/app.js`
- Sekcja: `translations.pl.labels.updateNoteFull` i `translations.en.labels.updateNoteFull`.
- Zmieniono tekst przy przycisku generowania danych tak, aby mówił, że `data.json` jest backupem, `firebase-import.json` jest root-ready i po imporcie dane trafią do `/datavault/live`.
- Sekcja: `translations.pl.messages.statusRepoUpdated` i `translations.en.messages.statusRepoUpdated`.
- Zmieniono status po wygenerowaniu plików, aby wskazywał root-ready `firebase-import.json`.
- Funkcja: `buildFirebaseImportJson(dataJsonObject)`.
- Zmieniono zwracany obiekt z samego payloadu na drzewo `datavault.live`.
- Funkcje: `assertFirebaseImportNode(node, label)` i `validateFirebaseImportObject(firebaseImportObject, originalData)`.
- Dodano walidację węzłów root-ready i pozostawiono kontrolę bezpiecznych kluczy Firebase poza wnętrzem stringa `dataJson`.

### `DataVault/index.html`
- Sekcja: tekst fallbackowy `data-i18n="updateNoteFull"` widoczny przed zastosowaniem tłumaczeń JS.
- Zmieniono komunikat tak, aby odpowiadał nowemu root-ready workflow.

### `DataVault/docs/README.md`
- Sekcja PL: `Aktualne źródło danych` i `Runtime danych`.
- Sekcja EN: `Current data source` i `Data runtime`.
- Dopisano jasną instrukcję importu `firebase-import.json` z poziomu root bazy, ostrzeżenie przed importem bezpośrednio do `/datavault/live`, informację o `dataJson` jako stringu i o `schemaVersion`.

### `DataVault/docs/Documentation.md`
- Sekcje techniczne opisujące aktualny stan danych, strukturę plików, grupę `#updateDataGroup`, generowanie plików i runtime Firebase.
- Doprecyzowano, że `firebase-import.json` ma root-ready strukturę `datavault.live`, a runtime loader nadal czyta `/datavault/live`.

### `shared/FirebaseREADME.md`
- Dodano sekcje PL/EN opisujące import root-ready `firebase-import.json`.
- Zaktualizowano uwagi zgodności, aby nie sugerowały wklejania całego root-ready eksportu do pola `dataJson`.

### `Analizy/Export_data_jason.md`
- Utworzono ten plik jako szczegółowe patch notes i instrukcję wdrożenia analogicznej poprawki w innym repo.

## F. Dokładne patch notes

### `buildFirebaseImportJson`
Przed zmianą funkcja zwracała:

```js
{
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "Repozytorium.xlsx",
  dataJson: JSON.stringify(dataJsonObject),
}
```

Po zmianie funkcja zwraca:

```js
{
  datavault: {
    live: {
      schemaVersion: "datavault-firebase-import-v1",
      createdAt: new Date().toISOString(),
      source: "Repozytorium.xlsx",
      dataJson: JSON.stringify(dataJsonObject),
    },
  },
}
```

Efekt: plik jest gotowy do importu na poziomie root Realtime Database.

### `validateFirebaseImportObject`
Walidacja sprawdza teraz:

- czy root istnieje i jest zwykłym obiektem;
- czy klucze root są bezpieczne dla Firebase;
- czy root zawiera wyłącznie oczekiwany klucz `datavault`;
- czy `datavault` jest zwykłym obiektem;
- czy `datavault` zawiera wyłącznie oczekiwany klucz `live`;
- czy `datavault.live` jest zwykłym obiektem;
- czy payload ma `schemaVersion === "datavault-firebase-import-v1"`;
- czy `payload.dataJson` jest stringiem;
- czy `JSON.parse(payload.dataJson)` odtwarza oryginalne dane;
- czy `JSON.stringify(restored) === JSON.stringify(originalData)`.

Walidacja nie sprawdza kluczy wewnątrz danych zaszytych w `dataJson`, ponieważ `dataJson` jest stringiem i może legalnie zawierać nazwy arkuszy lub kolumn niedozwolone jako natywne klucze Firebase.

### Teksty PL/EN
Teksty przy przycisku generowania danych mówią teraz, że:

- `data.json` jest backupem;
- `firebase-import.json` jest gotowy do importu w root Firebase Realtime Database;
- po imporcie dane znajdą się pod `/datavault/live`.

Status po generacji plików wskazuje, że `firebase-import.json` jest root-ready.

### Dokumentacja
Dokumentacja DataVault i `shared/FirebaseREADME.md` opisuje aktualny workflow:

- import pliku `firebase-import.json` odbywa się z poziomu root RTDB;
- runtime nadal czyta `/datavault/live`;
- `dataJson` pozostaje stringiem JSON;
- `schemaVersion` payloadu pozostaje `datavault-firebase-import-v1`;
- import nowego pliku bezpośrednio do `/datavault/live` jest błędny i tworzy podwójne zagnieżdżenie.

### Zachowanie `data.json`
`data.json` nie zostało zmienione. Nadal jest lokalnym backupem i artefaktem diagnostycznym. Nie jest runtime produkcyjnym.

### Zachowanie `firebase-import.json`
`firebase-import.json` nadal zawiera ten sam payload logiczny, ale payload jest opakowany w `datavault.live`, aby cały plik można było importować w root bazy.

### Zachowanie runtime loadera
Runtime loader nie został zmieniony. Nadal czyta `DATA_PATH = "datavault/live"` i unwrapuje payload przez `JSON.parse(dataJson)`.

## G. Przykłady JSON

### Stary błędnie importowany root
Jeśli stary payload był importowany do root, Firebase tworzył:

```json
{
  "schemaVersion": "datavault-firebase-import-v1",
  "createdAt": "2026-06-10T00:00:00.000Z",
  "source": "Repozytorium.xlsx",
  "dataJson": "{\"sheets\":{}}"
}
```

W tym stanie nie istnieje `/datavault/live`.

### Stary payload dla `/datavault/live`
Stary plik był poprawny tylko jako zawartość ścieżki `/datavault/live`:

```json
{
  "schemaVersion": "datavault-firebase-import-v1",
  "createdAt": "2026-06-10T00:00:00.000Z",
  "source": "Repozytorium.xlsx",
  "dataJson": "{\"sheets\":{\"Bronie\":[]}}"
}
```

### Nowy root-ready `firebase-import.json`
Nowy plik jest poprawny jako import root:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "2026-06-10T00:00:00.000Z",
      "source": "Repozytorium.xlsx",
      "dataJson": "{\"sheets\":{\"Bronie\":[]}}"
    }
  }
}
```

### Oczekiwane drzewo w Firebase po imporcie

```text
/
└── datavault
    └── live
        ├── schemaVersion: "datavault-firebase-import-v1"
        ├── createdAt: "2026-06-10T00:00:00.000Z"
        ├── source: "Repozytorium.xlsx"
        └── dataJson: "{\"sheets\":{\"Bronie\":[]}}"
```

## H. Instrukcja wdrożenia w analogicznej aplikacji

1. Znajdź funkcję generującą plik importowy Firebase, najczęściej nazwaną podobnie do `buildFirebaseImportJson`, `buildFirebasePayload`, `exportFirebaseJson` albo `createImportJson`.
2. Sprawdź ścieżkę odczytu runtime w loaderze, np. `DATA_PATH`, `ref(database, "...")` albo analogiczną konfigurację.
3. Jeśli loader czyta `a/b/c`, opakuj dotychczasowy payload w drzewo `{ a: { b: { c: payload } } }`. Dla DataVault ścieżka `datavault/live` oznacza `{ datavault: { live: payload } }`.
4. Zaktualizuj walidację tak, aby walidowała nowe drzewo importu, a dopiero potem payload w docelowym węźle runtime.
5. Nie waliduj nazw arkuszy lub kolumn wewnątrz `dataJson`, jeśli `dataJson` jest stringiem.
6. Zaktualizuj teksty UI, aby użytkownik wiedział, że plik importuje się w root bazy.
7. Zaktualizuj dokumentację użytkową i techniczną: ścieżka runtime, miejsce importu, ostrzeżenie przed podwójnym zagnieżdżeniem, format `dataJson`, `schemaVersion`.
8. Wykonaj test importu root w środowisku testowym Firebase.
9. Po imporcie sprawdź, że w bazie istnieje dokładnie `/datavault/live` lub analogiczna ścieżka runtime.
10. Zaloguj się do aplikacji i upewnij się, że loader odczytuje dane bez `DATA_NOT_FOUND`.

## I. Checklist testów

- [ ] Wygenerować `data.json` z lokalnego `Repozytorium.xlsx`.
- [ ] Wygenerować `firebase-import.json`.
- [ ] Sprawdzić, że `firebase-import.json` ma root key `datavault` i zagnieżdżony key `live`.
- [ ] Sprawdzić, że `firebase-import.json.datavault.live.schemaVersion` wynosi `datavault-firebase-import-v1`.
- [ ] Sprawdzić, że `firebase-import.json.datavault.live.dataJson` jest stringiem.
- [ ] Wykonać `JSON.parse(firebaseImportObject.datavault.live.dataJson)`.
- [ ] Sprawdzić, że po parsowaniu `dataJson` zawiera `sheets`.
- [ ] Porównać round-trip: `JSON.stringify(restored) === JSON.stringify(originalData)`.
- [ ] Zaimportować `firebase-import.json` do root Firebase Realtime Database.
- [ ] Sprawdzić drzewo `/datavault/live` w Firebase.
- [ ] Zalogować się w aplikacji.
- [ ] Potwierdzić brak `DATA_NOT_FOUND`.
- [ ] Potwierdzić, że widoczne są zakładki i dane.
- [ ] Potwierdzić, że `data.json` nie zmienił znaczenia i pozostaje backupem.
- [ ] Potwierdzić, że loader runtime nie został zmieniony.

## J. Ryzyka i rollback

### Ryzyko: import nowego pliku do `/datavault/live`
Jeśli użytkownik zaimportuje nowy root-ready `firebase-import.json` bezpośrednio do `/datavault/live`, Firebase utworzy:

```text
/
└── datavault
    └── live
        └── datavault
            └── live
                ├── schemaVersion
                ├── createdAt
                ├── source
                └── dataJson
```

Loader czyta tylko `/datavault/live`. W takim błędnym stanie pod `/datavault/live` znajduje się obiekt zawierający `datavault`, a nie payload ze `schemaVersion` i `dataJson`. Loader nie unwrapuje właściwych danych i aplikacja może zachowywać się tak, jakby dane były puste lub miały zły format.

### Jak rozpoznać podwójne zagnieżdżenie
W konsoli Firebase Realtime Database rozwiń `/datavault/live`. Jeśli widzisz w nim kolejne `datavault/live`, import wykonano w złym miejscu.

### Jak usunąć błędny import
1. Wykonaj backup obecnej bazy, jeśli zawiera istotne dane.
2. Usuń błędny węzeł `/datavault/live/datavault` albo wyczyść całe `/datavault/live`, jeśli nie ma tam innych ręcznych danych.
3. Wróć do root bazy (`/`).
4. Zaimportuj nowy `firebase-import.json` w root.
5. Sprawdź, że payload znajduje się bezpośrednio pod `/datavault/live`.

### Jak wrócić do starego sposobu, jeśli będzie konieczne
Rollback polega na wygenerowaniu samego payloadu bez opakowania `datavault.live` i importowaniu go ręcznie bezpośrednio do `/datavault/live`. Nie jest to zalecane dla standardowego workflow, bo wymaga precyzyjnego wyboru ścieżki w konsoli Firebase i łatwo prowadzi do pomyłek.

## K. Kryteria akceptacji

- [ ] `firebase-import.json` importowany do root tworzy `/datavault/live`.
- [ ] Loader bez zmian ładuje dane z `DATA_PATH = "datavault/live"`.
- [ ] `dataJson` nadal jest stringiem JSON.
- [ ] `schemaVersion` payloadu nadal wynosi `datavault-firebase-import-v1`.
- [ ] `data.json` pozostaje backupem i artefaktem diagnostycznym.
- [ ] Dokumentacja opisuje nowy workflow importu root.
- [ ] Dokumentacja ostrzega, aby nie importować nowego pliku bezpośrednio do `/datavault/live`.
- [ ] `Analizy/Export_data_jason.md` istnieje i zawiera pełne patch notes.

## Wnioski
Zmiana generatora jest właściwym miejscem naprawy, ponieważ błąd wynika z niedopasowania formatu pliku importowego do praktycznego workflow importu root w Firebase. Zmiana loadera nie jest potrzebna i byłaby ryzykowna, ponieważ runtime poprawnie oczekuje payloadu pod `/datavault/live`.

## Rekomendacje
1. Importować `firebase-import.json` wyłącznie z poziomu root Realtime Database.
2. Nie zmieniać `DATA_PATH`, jeśli docelowa ścieżka runtime nadal ma być `/datavault/live`.
3. W analogicznych aplikacjach zawsze dopasować zewnętrzne drzewo pliku importowego do ścieżki odczytu runtime.
4. Po każdym eksporcie testować parsowanie `dataJson` i round-trip danych.

## Ewentualne ryzyka
- Użytkownik może z przyzwyczajenia zaimportować nowy root-ready plik do `/datavault/live`, tworząc podwójne zagnieżdżenie.
- Jeżeli w Firebase istnieją już ręcznie utworzone dane pod root, import root może je nadpisać zależnie od sposobu użycia konsoli Firebase.
- Dokumentacja i UI muszą być spójne, aby nie sugerować starego workflow.

## Ewentualne następne kroki
1. Przetestować eksport z rzeczywistym `Repozytorium.xlsx` w przeglądarce.
2. Zaimportować wynikowy `firebase-import.json` w testowej bazie Firebase RTDB na poziomie root.
3. Potwierdzić, że aplikacja ładuje dane i nie zgłasza `DATA_NOT_FOUND`.
4. Rozważyć dodanie automatycznego testu jednostkowego dla `buildFirebaseImportJson` i `validateFirebaseImportObject`, jeśli repo otrzyma infrastrukturę testową JS.

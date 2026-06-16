# 🇵🇱 Dokumentacja techniczna — DataVault (PL)

## Cel modułu

`DataVault` jest przeglądarkowym modułem do przeglądania prywatnej bazy danych zasad, tabel, ekwipunku, przeciwników i notatek używanych w projekcie `WrathAndGlory`.

Moduł działa jako frontend HTML/CSS/JS. Nie ma własnego backendu aplikacyjnego. Dane produkcyjne są pobierane z Firebase Realtime Database przez wspólny loader Firebase, a tryb admina potrafi wygenerować lokalne pliki danych z arkusza `Repozytorium.xlsx`.

Najważniejsze zadania modułu:

- zabezpieczenie prywatnych danych bramką K.O.Z.A.,
- logowanie przez wspólną warstwę Firebase Authentication,
- odczyt prywatnych danych z Realtime Database `datavault/live`,
- renderowanie arkuszy jako zakładek i tabel,
- filtrowanie, sortowanie, rozwijanie i porównywanie rekordów,
- ukrywanie części danych w widoku użytkownika,
- generowanie `data.json` i root-ready `firebase-import.json` z lokalnego `Repozytorium.xlsx` w trybie admina.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `DataVault/index.html` | Główny widok modułu. Bez parametru działa jako widok użytkownika. |
| `DataVault/index.html?admin=1` | Widok admina z przyciskiem generowania plików danych i dodatkowymi zakładkami. |

Nie ma osobnego pliku HTML dla admina. Tryb admina jest wykrywany przez parametr URL `admin=1`.

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `DataVault/index.html` | Szkielet UI: bramka dostępu, topbar, panel filtrów, workspace, zakładki, tabela, popover, modal i import skryptów. |
| `DataVault/app.js` | Główna logika modułu: i18n, Firebase flow, stan UI, normalizacja danych, filtry, sortowanie, render tabel, porównanie, import XLSX. |
| `DataVault/style.css` | Style widoku: layout, topbar, panel filtrów, tabela, zakładki, modal, popover, menu filtrów, kolory i responsywność. |
| `DataVault/xlsxCanonicalParser.js` | Kanoniczny parser XLSX w przeglądarce oparty o JSZip i pliki XML pakietu XLSX. |
| `DataVault/config/FirebaseREADME.md` | Modułowa instrukcja konfiguracji Firebase dla DataVault. |
| `DataVault/docs/README.md` | Instrukcja użytkownika. |
| `DataVault/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |
| `DataVault/docs/ZasadyFormatowania.md` | Zasady formatowania danych i specjalnych markerów. |
| `shared/firebase-config.js` | Wspólna konfiguracja Firebase dla prywatnych danych DataVault. |
| `shared/firebase-data-loader.js` | Wspólny loader prywatnych danych Firebase. |

## Zależności zewnętrzne

Moduł ładuje zależności bezpośrednio w HTML:

- `JSZip 3.10.1` — wymagany przez `xlsxCanonicalParser.js`,
- `xlsxCanonicalParser.js` — lokalny parser kanoniczny,
- `shared/firebase-config.js` — wspólna konfiguracja prywatnych danych,
- `shared/firebase-data-loader.js` — modułowy loader Firebase,
- `app.js` — główna logika DataVault,
- `xlsx.full.min.js 0.19.3` — opcjonalna/legacy ścieżka SheetJS ładowana na końcu HTML.

`app.js` ma także funkcje awaryjnego doładowania JSZip albo SheetJS z CDN, jeżeli dana biblioteka nie jest dostępna w momencie użycia.

## Firebase i dane prywatne

DataVault korzysta ze wspólnej warstwy Firebase:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

Moduł nie używa osobnego `DataVault/config/firebase-config.js`.

Warstwa Firebase obsługuje:

- `window.WG_FIREBASE_CONFIG`,
- `window.WG_DATA_ACCESS_EMAIL`,
- Firebase Authentication,
- Firebase Realtime Database,
- named app `wh40k-data-slate-private-data`,
- odczyt ścieżki `datavault/live`,
- rozpakowanie wrappera `dataJson`,
- czytelne komunikaty błędów dostępu.

Szczegóły konfiguracji są opisane w `DataVault/config/FirebaseREADME.md` oraz powinny być spójne ze wspólnym `shared/FirebaseREADME.md`.

## Przepływ startowy aplikacji

Po załadowaniu strony moduł wykonuje logicznie następujący przepływ:

1. Stosuje język domyślny `pl`.
2. Podpina event listenery do UI.
3. Próbuje pobrać wspólne API Firebase przez `getFirebaseApi()`.
4. Czeka na `window.DataVaultFirebaseReady` albo event `datavault-firebase-loader-ready`.
5. Wywołuje `initFirebaseDataAccess()`.
6. Czeka na `waitForAuthReady()`.
7. Jeżeli użytkownik nie jest zalogowany, pokazuje bramkę K.O.Z.A.
8. Po poprawnym logowaniu wywołuje `loadPrivateDataFromFirebase()`.
9. `loadPrivateDataFromFirebase()` pobiera `loadDataVaultLive()`.
10. Dane są sprawdzane przez `assertDataVaultShape(...)`.
11. Dane są normalizowane przez `normaliseDB(...)`.
12. Odtwarzany jest stan sesji albo stosowany widok domyślny.
13. Uruchamiane jest `initUI()`.
14. Widok zostaje zapisany do `sessionStorage`.

## Bramka dostępu K.O.Z.A.

Bramka dostępu jest zdefiniowana w `index.html` jako `#accessGate`.

Najważniejsze elementy:

| Element | ID | Rola |
| --- | --- | --- |
| Formularz dostępu | `accessForm` | Obsługuje wpisanie Litanii Dostępu. |
| Pole hasła | `accessPassword` | Hasło wpisywane przez użytkownika. |
| Komunikat błędu | `accessError` | Miejsce na czytelne błędy Firebase/Auth/RTDB. |

Hasło nie jest przechowywane w repozytorium. Kod przekazuje je do `loginWithGroupPassword(...)` ze wspólnego loadera Firebase.

## Tryb użytkownika i tryb admina

Tryb admina jest aktywny tylko wtedy, gdy URL zawiera:

```text
?admin=1
```

Różnice:

| Obszar | Tryb użytkownika | Tryb admina |
| --- | --- | --- |
| Przycisk `Generuj pliki danych` | Ukryty. | Widoczny. |
| Przycisk `Strona Główna` | Widoczny. | Ukryty. |
| Zakładki admin-only | Ukryte. | Widoczne. |
| Checkbox starych wpisów Bestiariusza | Ukryty. | Widoczny. |
| Preferowana zakładka startowa | `Bronie`. | `Notatki`. |

Zakładki admin-only są zdefiniowane w `ADMIN_ONLY_SHEETS` i obejmują między innymi `Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`, `Specjalne Bonusy Wrogów`, `Notatki`.

## UI — główne sekcje

### Topbar

Topbar zawiera:

- ikonę `Icon.png`,
- tytuł `ADMINISTRATUM DATA VAULT`,
- ukryty przełącznik języka,
- `Generuj pliki danych`,
- `Strona Główna`,
- `Pełen Widok`,
- `Widok Domyślny`,
- `Porównaj zaznaczone`.

### Panel filtrów

Panel filtrów zawiera:

- globalne pole wyszukiwania `globalSearch`,
- checkbox starych wpisów Bestiariusza `toggleOldBestiaryEntries`,
- checkbox zakładek tworzenia postaci `toggleCharacterTabs`,
- checkbox zakładek walki `toggleCombatTabs`,
- checkbox zakładek pojazdów `toggleVehicleTabs`,
- podpowiedzi o sortowaniu, filtrach kolumn i porównywaniu.

### Workspace

Workspace zawiera:

- `tabs` — dynamiczne zakładki arkuszy,
- `tableWrap` — aktualna tabela albo pusty stan.

### Popover i modal

- `popover` pokazuje opisy cech, stanów i podobnych odwołań.
- `modal` pokazuje porównanie zaznaczonych rekordów.
- `filterMenu` jest dynamicznym menu filtrów listowych dla kolumn.

## Grupy zakładek

Kod dzieli arkusze na grupy logiczne.

### Tworzenie postaci

`CHARACTER_CREATION_SHEETS` obejmuje między innymi:

- `Tabela Rozmiarów`,
- `Gatunki`,
- `Archetypy`,
- `Premie Frakcji`,
- `Słowa Kluczowe Frakcji`,
- `Pakiety Wyniesienia`,
- `Specjalne Bonusy Frakcji`,
- `Implanty Astartes`,
- `Zakony Pierwszego Powołania`.

### Zasady walki

`COMBAT_RULES_SHEETS` obejmuje:

- `Trafienia Krytyczne`,
- `Groza Osnowy`,
- `Skrót Zasad`,
- `Tryby Ognia`,
- `Kary do ST`.

### Pojazdy

`VEHICLE_SHEETS` obejmuje:

- `Role W Pojeździe`,
- `Akcje Pojazdu`,
- `Stany Pojazdów`,
- `Cechy Pojazdów`,
- `Pojazdy`,
- `Bronie Pojazdów`,
- `Ekwipunek Pojazdów`.

## Stan aplikacji

Najważniejsze zmienne stanu:

| Nazwa | Rola |
| --- | --- |
| `DB` | Znormalizowana baza danych: `sheets` i `_meta`. |
| `currentSheet` | Nazwa aktualnej zakładki. |
| `showOldBestiaryEntries` | Runtime-only stan widoczności rekordów `old` w Bestiariuszu. Nie trafia do `sessionStorage`. |
| `SESSION_VIEW_KEY` | Klucz sesji: `datavault_session_view_v2`. |
| `DEFAULT_VIEW_CONFIG` | Domyślne filtry dla wybranych arkuszy. |
| `uiState` | Widoczność grup zakładek: character/combat/vehicle. |
| `viewBySheet` | Stan widoku per arkusz. |
| `view` | Aktywny stan widoku aktualnego arkusza. |
| `RENDER_CHUNK_SIZE` | Rozmiar porcji renderowania tabeli. Aktualnie `80`. |
| `ADMIN_MODE` | Czy URL zawiera `admin=1`. |
| `HIDDEN_COLUMNS` | Kolumny ukrywane systemowo, np. `lp`, `stan`. |

## Stan widoku per arkusz

Każdy arkusz ma stan:

| Pole | Typ | Opis |
| --- | --- | --- |
| `sort` | `object|null` | Aktywne sortowanie. Może mieć sortowanie wtórne. |
| `global` | `string` | Globalna fraza wyszukiwania. |
| `filtersText` | `object` | Filtry tekstowe per kolumna. |
| `filtersSet` | `object` | Filtry listowe per kolumna. |
| `selected` | `Set` | Zaznaczone rekordy. |
| `expandedCells` | `Set` | Komórki rozwinięte po clampie. |

`sessionStorage` zapisuje:

- stany arkuszy,
- `uiState`,
- język.

Nie zapisuje `showOldBestiaryEntries`, aby po odświeżeniu stare wpisy Bestiariusza wracały do bezpiecznego ukrycia.

## Widok domyślny i pełny widok

`Widok Domyślny` stosuje `DEFAULT_VIEW_CONFIG` do wszystkich arkuszy i przywraca domyślne filtry oraz sortowania.

`Pełen Widok` usuwa domyślne ukrycia, filtry i sortowania dla arkuszy.

Przy powrocie do widoku domyślnego stare wpisy Bestiariusza są ponownie ukrywane.

## Model danych runtime

Po rozpakowaniu z Firebase moduł oczekuje struktury:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

`normaliseDB(...)` tworzy strukturę roboczą:

```text
{
  sheets,
  _meta: {
    traits,
    states,
    vehicleTraits,
    vehicleWeaponTraits,
    vehicleStates,
    traitIndex,
    stateIndex,
    vehicleTraitIndex,
    vehicleWeaponTraitIndex,
    vehicleStateIndex,
    sheetOrder,
    columnOrder
  }
}
```

`traitIndex`, `stateIndex` i odpowiedniki pojazdowe są indeksami po kluczach kanonicznych, co umożliwia szybkie szukanie opisów cech i stanów.

## Generowanie danych z XLSX

W trybie admina przycisk `Generuj pliki danych` wywołuje przepływ `loadXlsxFromRepo()`.

Przepływ:

1. Upewnia się, że JSZip jest dostępny.
2. Sprawdza dostępność `window.XlsxCanonicalParser.loadXlsxMinimal`.
3. Otwiera systemowy picker pliku.
4. Czyta lokalny XLSX do `ArrayBuffer`.
5. Parser zwraca `rawSheets`, `sheetOrder`, `columnOrder`.
6. `buildDataJsonFromSheets(...)` buduje `data.json`.
7. `buildFirebaseImportJson(...)` buduje root-ready import Firebase.
8. `validateFirebaseImportObject(...)` sprawdza import.
9. Przeglądarka pobiera `data.json`.
10. Po krótkim opóźnieniu pobiera `firebase-import.json`.
11. Widok roboczy jest aktualizowany na podstawie nowych danych.

## Kanoniczny parser XLSX

`xlsxCanonicalParser.js` czyta XLSX jako paczkę ZIP i analizuje pliki XML:

- `xl/sharedStrings.xml`,
- `xl/styles.xml`,
- `xl/workbook.xml`,
- `xl/_rels/workbook.xml.rels`,
- `xl/worksheets/sheet*.xml`.

Parser:

- normalizuje białe znaki,
- zamienia polskie cudzysłowy `„”` na `"`,
- wykrywa czerwony kolor fontu,
- wykrywa bold, italic i strike w rich text runs,
- zapisuje znaczniki `{{RED}}`, `{{B}}`, `{{I}}`, `{{S}}`,
- pomija kolumnę `LP` w `columnOrder`,
- scala logicznie kolumny `Zasięg 1`, `Zasięg 2`, itd. do `Zasięg`,
- scala logicznie `Cecha 1`, `Cecha 2`, itd. do `Cechy`,
- zwraca `sheets`, `sheetOrder`, `columnOrder`.

## Budowanie `data.json`

`buildDataJsonFromSheets(...)` przekształca surowe arkusze z parsera do struktury DataVault.

Dodatkowe przetwarzanie:

- arkusz `Cechy` buduje `_meta.traits`,
- arkusz `Stany` buduje `_meta.states`,
- arkusz `Stany Pojazdów` buduje `_meta.vehicleStates`,
- arkusz `Cechy Pojazdów` buduje `_meta.vehicleTraits` i `_meta.vehicleWeaponTraits`,
- arkusze `Bronie` i `Bronie Pojazdów` przechodzą scalanie cech i zasięgu,
- arkusze `Pancerze` i `Pojazdy` przechodzą scalanie cech.

Wynik ma postać:

```text
{
  sheets,
  _meta: {
    traits,
    states,
    vehicleTraits,
    vehicleWeaponTraits,
    vehicleStates,
    sheetOrder,
    columnOrder
  }
}
```

## Budowanie `firebase-import.json`

`buildFirebaseImportJson(dataJsonObject)` tworzy root-ready strukturę:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "...",
      "source": "Repozytorium.xlsx",
      "dataJson": "..."
    }
  }
}
```

Plik należy importować w Firebase Console na poziomie root Realtime Database. Po imporcie dane znajdują się pod `datavault/live`.

## Walidacja importu Firebase

`validateFirebaseImportObject(...)` sprawdza:

- czy root ma tylko klucz `datavault`,
- czy `datavault` ma tylko klucz `live`,
- czy payload ma poprawne `schemaVersion`,
- czy `dataJson` jest stringiem,
- czy `JSON.parse(dataJson)` daje dane identyczne z wygenerowanym `data.json`,
- czy klucze drzewa importu nie zawierają znaków zakazanych przez Realtime Database.

Walidacja nie sprawdza kluczy wewnątrz `dataJson`, bo `dataJson` jest stringiem, nie drzewem Realtime Database.

## Tabela i renderowanie

Dla aktywnego arkusza `selectSheet(name)`:

1. zapisuje stan poprzedniego arkusza,
2. ustawia `currentSheet`,
3. odtwarza stan widoku arkusza,
4. czyści zaznaczenia porównania,
5. buduje szkielet tabeli,
6. renderuje ciało tabeli,
7. zapisuje stan sesji.

`buildTableSkeleton()` tworzy:

- kontener `.tableFrame`,
- viewport `.tableViewport`,
- tabelę `.dataTable`,
- pierwszy wiersz nagłówków,
- drugi wiersz filtrów,
- kolumnę zaznaczania `✓`,
- input tekstowy filtra per kolumna,
- przycisk menu listowego filtra per kolumna.

Render ciała tabeli wykorzystuje progressive rendering porcjami po `RENDER_CHUNK_SIZE`.

## Filtrowanie i sortowanie

Moduł obsługuje:

- wyszukiwanie globalne,
- tekstowy filtr per kolumna,
- listowy filtr per kolumna,
- sortowanie po kliknięciu nagłówka,
- sortowanie domyślne po `LP`, jeżeli arkusz ma taką kolumnę,
- specjalne sortowanie `Archetypy` po `Poziom` i wtórnie po `Frakcja`.

Filtry listowe bazują na unikalnych wartościach kolumny z aktualnie systemowo widocznych rekordów.

## Formatowanie tekstu

Moduł renderuje markery:

| Marker | Efekt |
| --- | --- |
| `{{RED}}...{{/RED}}` | Czerwony tekst. |
| `{{B}}...{{/B}}` | Pogrubienie. |
| `{{I}}...{{/I}}` | Kursywa. |
| `{{S}}...{{/S}}` | Przekreślenie. |

Dodatkowo:

- odwołania do stron w nawiasach z `str`, `str.`, `strona`, `page` albo `p.` dostają klasę `ref`,
- linie zaczynające się od `*[n]` są oznaczane klasą `caretref`,
- HTML jest escapowany przed renderem,
- formatowanie inline zachowuje zagnieżdżenie markerów.

Szczegółowe reguły formatowania danych powinny być utrzymywane w `DataVault/docs/ZasadyFormatowania.md`.

## Ukrywanie danych

Ukrywanie działa na kilku poziomach:

1. Kolumny systemowe `lp` i `stan` są ukryte.
2. Arkusze admin-only są ukryte poza trybem admina.
3. Grupy zakładek character/combat/vehicle są ukrywane checkboxami.
4. Rekordy `old` w Bestiariuszu są ukrywane systemowo, dopóki admin nie zaznaczy checkboxa `toggleOldBestiaryEntries`.
5. Widok domyślny stosuje predefiniowane filtry dla wybranych arkuszy.

## Porównywanie rekordów

Użytkownik może zaznaczyć co najmniej dwa wiersze. Wtedy przycisk `Porównaj zaznaczone` staje się aktywny.

Modal porównania pokazuje wartości pól dla zaznaczonych rekordów obok siebie. Porównanie działa na aktualnym arkuszu i wykorzystuje dane z bieżącej tabeli.

## Popover cech i stanów

Kliknięcie odpowiednich tagów albo elementów specjalnych może otworzyć `popover`.

Źródła opisów:

- `_meta.traits`,
- `_meta.states`,
- `_meta.vehicleTraits`,
- `_meta.vehicleWeaponTraits`,
- `_meta.vehicleStates`.

Jeżeli opis nie istnieje, moduł pokazuje komunikat o braku znalezionej cechy albo stanu.

## i18n

`translations` zawiera obecnie języki:

- `pl`,
- `en`.

Język wpływa na:

- etykiety przycisków,
- podpowiedzi,
- komunikaty statusu,
- komunikaty błędów,
- aria-labels,
- puste stany.

Przełącznik języka istnieje w HTML, ale ma klasę `language-switcher--hidden`. Aby go pokazać, trzeba usunąć tę klasę oraz upewnić się, że wszystkie teksty są kompletne.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Brak gotowego loadera Firebase | `getFirebaseApi()` czeka na event, a potem zgłasza `FIREBASE_LOADER_NOT_READY`. |
| Brak sesji Auth | Dane runtime są czyszczone i pokazuje się bramka K.O.Z.A. |
| Błąd logowania lub odczytu RTDB | Pokazywany jest komunikat z `getReadableAccessError(...)`. |
| Brak struktury `sheets` | `assertDataVaultShape(...)` blokuje użycie danych. |
| Brak JSZip/parsera kanonicznego | Import XLSX przerywa się komunikatem o braku parsera. |
| Błąd generowania importu | Status przechodzi na błąd aktualizacji danych i loguje wskazówkę CLI fallback. |
| Brak danych do tabeli | Pokazywany jest pusty stan. |
| Brak wyników po filtrach | Pokazywany jest pusty stan wyników. |

## Procedura odtworzenia modułu

1. Zachowaj strukturę katalogu `DataVault/`.
2. Zachowaj `index.html`, `app.js`, `style.css`, `xlsxCanonicalParser.js`.
3. Zachowaj `shared/firebase-config.js` i `shared/firebase-data-loader.js`.
4. Skonfiguruj Firebase zgodnie z `DataVault/config/FirebaseREADME.md`.
5. Upewnij się, że Realtime Database zawiera `datavault/live`.
6. Upewnij się, że `datavault/live.dataJson` zawiera poprawny JSON z `sheets` i `_meta`.
7. Otwórz `DataVault/index.html`.
8. Zaloguj się przez K.O.Z.A.
9. Sprawdź, czy pojawiają się zakładki i tabele.
10. Otwórz `DataVault/index.html?admin=1`.
11. Sprawdź widoczność przycisku `Generuj pliki danych`.
12. Wygeneruj `data.json` i `firebase-import.json` z lokalnego `Repozytorium.xlsx`.
13. Zaimportuj `firebase-import.json` do root Realtime Database.
14. Odśwież zwykły widok DataVault i sprawdź nowe dane.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start użytkownika | Otwórz `DataVault/index.html`. | Widoczna jest bramka K.O.Z.A. albo załadowane dane, jeżeli sesja Auth istnieje. |
| Logowanie | Wpisz poprawną Litanię Dostępu. | Bramka znika, a dane są ładowane z prywatnej bazy. |
| Dane runtime | Po logowaniu sprawdź zakładki. | Widoczne są zakładki dozwolone dla trybu użytkownika. |
| Tryb admina | Otwórz `DataVault/index.html?admin=1`. | Widoczny jest przycisk generowania danych i zakładki admin-only. |
| Generowanie importu | W adminie wybierz lokalny `Repozytorium.xlsx`. | Pobierane są `data.json` i `firebase-import.json`. |
| Import Firebase | Zaimportuj `firebase-import.json` w root RTDB. | Dane trafiają pod `datavault/live`. |
| Widok domyślny | Kliknij `Widok Domyślny`. | Zostają zastosowane domyślne filtry i ukrycia. |
| Pełen widok | Kliknij `Pełen Widok`. | Filtry i ukrycia widoku domyślnego są zdjęte. |
| Filtr globalny | Wpisz frazę w `globalSearch`. | Tabela pokazuje pasujące rekordy. |
| Filtr kolumny | Wpisz filtr w polu pod nagłówkiem. | Tabela filtruje po tej kolumnie. |
| Filtr listowy | Otwórz menu filtra kolumny. | Można wybrać wartości z listy. |
| Sortowanie | Kliknij nagłówek kolumny. | Tabela sortuje dane po tej kolumnie. |
| Porównanie | Zaznacz 2+ wiersze i kliknij porównanie. | Otwiera się modal porównania. |
| Bestiariusz old | W adminie włącz checkbox starych wpisów. | Rekordy `stan=old` w Bestiariuszu stają się widoczne. |

---

# 🇬🇧 Technical documentation — DataVault (EN)

## Module purpose

`DataVault` is a browser-based module for browsing the private rules, tables, equipment, enemies, and notes database used in the `WrathAndGlory` project.

The module is an HTML/CSS/JS frontend. It has no dedicated application backend. Production data is loaded from Firebase Realtime Database through the shared Firebase loader, and admin mode can generate local data files from `Repozytorium.xlsx`.

Main module responsibilities:

- protect private data with the K.O.Z.A. access gate,
- sign in through the shared Firebase Authentication layer,
- read private data from Realtime Database `datavault/live`,
- render sheets as tabs and tables,
- filter, sort, expand, and compare records,
- hide selected data in the user view,
- generate `data.json` and root-ready `firebase-import.json` from local `Repozytorium.xlsx` in admin mode.

## Entry points

| File | Role |
| --- | --- |
| `DataVault/index.html` | Main module view. Without parameters, it works as the user view. |
| `DataVault/index.html?admin=1` | Admin view with the data generation button and extra tabs. |

There is no separate admin HTML file. Admin mode is detected through the `admin=1` URL parameter.

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `DataVault/index.html` | UI skeleton: access gate, topbar, filter panel, workspace, tabs, table, popover, modal, and script imports. |
| `DataVault/app.js` | Main module logic: i18n, Firebase flow, UI state, data normalization, filters, sorting, table rendering, comparison, XLSX import. |
| `DataVault/style.css` | View styles: layout, topbar, filters panel, table, tabs, modal, popover, filter menu, colors, responsiveness. |
| `DataVault/xlsxCanonicalParser.js` | Browser-side canonical XLSX parser based on JSZip and XLSX package XML files. |
| `DataVault/config/FirebaseREADME.md` | Module Firebase setup guide for DataVault. |
| `DataVault/docs/README.md` | User guide. |
| `DataVault/docs/Documentation.md` | This technical documentation. |
| `DataVault/docs/ZasadyFormatowania.md` | Data formatting and special marker rules. |
| `shared/firebase-config.js` | Shared Firebase configuration for private data. |
| `shared/firebase-data-loader.js` | Shared Firebase private data loader. |

## External dependencies

The module loads dependencies directly in HTML:

- `JSZip 3.10.1` — required by `xlsxCanonicalParser.js`,
- `xlsxCanonicalParser.js` — local canonical parser,
- `shared/firebase-config.js` — shared private data configuration,
- `shared/firebase-data-loader.js` — Firebase module loader,
- `app.js` — main DataVault logic,
- `xlsx.full.min.js 0.19.3` — optional/legacy SheetJS path loaded at the end of HTML.

`app.js` also has fallback functions for loading JSZip or SheetJS from CDN if a library is missing at the time of use.

## Firebase and private data

DataVault uses the shared Firebase layer:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

The module does not use a separate `DataVault/config/firebase-config.js`.

The Firebase layer handles:

- `window.WG_FIREBASE_CONFIG`,
- `window.WG_DATA_ACCESS_EMAIL`,
- Firebase Authentication,
- Firebase Realtime Database,
- named app `wh40k-data-slate-private-data`,
- reading `datavault/live`,
- unwrapping the `dataJson` wrapper,
- readable access error messages.

Configuration details are documented in `DataVault/config/FirebaseREADME.md` and should stay consistent with the shared `shared/FirebaseREADME.md`.

## Application startup flow

After the page loads, the module logically performs this flow:

1. Applies default language `pl`.
2. Attaches UI event listeners.
3. Tries to get the shared Firebase API through `getFirebaseApi()`.
4. Waits for `window.DataVaultFirebaseReady` or event `datavault-firebase-loader-ready`.
5. Calls `initFirebaseDataAccess()`.
6. Waits for `waitForAuthReady()`.
7. If the user is not signed in, shows the K.O.Z.A. access gate.
8. After successful sign-in, calls `loadPrivateDataFromFirebase()`.
9. `loadPrivateDataFromFirebase()` calls `loadDataVaultLive()`.
10. Data is checked by `assertDataVaultShape(...)`.
11. Data is normalized by `normaliseDB(...)`.
12. Session state is restored or the default view is applied.
13. `initUI()` is executed.
14. The view is stored in `sessionStorage`.

## K.O.Z.A. access gate

The access gate is defined in `index.html` as `#accessGate`.

Key elements:

| Element | ID | Role |
| --- | --- | --- |
| Access form | `accessForm` | Handles the Litany of Access submission. |
| Password field | `accessPassword` | Password entered by the user. |
| Error message | `accessError` | Displays readable Firebase/Auth/RTDB errors. |

The password is not stored in the repository. The code passes it to `loginWithGroupPassword(...)` from the shared Firebase loader.

## User mode and admin mode

Admin mode is active only when the URL contains:

```text
?admin=1
```

Differences:

| Area | User mode | Admin mode |
| --- | --- | --- |
| `Generate data files` button | Hidden. | Visible. |
| `Main Page` button | Visible. | Hidden. |
| Admin-only tabs | Hidden. | Visible. |
| Old Bestiary records checkbox | Hidden. | Visible. |
| Preferred startup tab | `Bronie`. | `Notatki`. |

Admin-only sheets are defined in `ADMIN_ONLY_SHEETS` and include, among others, `Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`, `Specjalne Bonusy Wrogów`, and `Notatki`.

## UI — main sections

### Topbar

The topbar contains:

- `Icon.png`,
- title `ADMINISTRATUM DATA VAULT`,
- hidden language switcher,
- `Generate data files`,
- `Main Page`,
- `Full View`,
- `Default View`,
- `Compare selected`.

### Filter panel

The filter panel contains:

- global search field `globalSearch`,
- old Bestiary entries checkbox `toggleOldBestiaryEntries`,
- character creation tabs checkbox `toggleCharacterTabs`,
- combat rules tabs checkbox `toggleCombatTabs`,
- vehicle tabs checkbox `toggleVehicleTabs`,
- hints for sorting, column filters, and comparison.

### Workspace

The workspace contains:

- `tabs` — dynamic sheet tabs,
- `tableWrap` — the current table or empty state.

### Popover and modal

- `popover` shows trait, state, and similar reference descriptions.
- `modal` shows selected record comparison.
- `filterMenu` is the dynamic list-filter menu for columns.

## Sheet groups

The code divides sheets into logical groups.

### Character creation

`CHARACTER_CREATION_SHEETS` includes, among others:

- `Tabela Rozmiarów`,
- `Gatunki`,
- `Archetypy`,
- `Premie Frakcji`,
- `Słowa Kluczowe Frakcji`,
- `Pakiety Wyniesienia`,
- `Specjalne Bonusy Frakcji`,
- `Implanty Astartes`,
- `Zakony Pierwszego Powołania`.

### Combat rules

`COMBAT_RULES_SHEETS` includes:

- `Trafienia Krytyczne`,
- `Groza Osnowy`,
- `Skrót Zasad`,
- `Tryby Ognia`,
- `Kary do ST`.

### Vehicles

`VEHICLE_SHEETS` includes:

- `Role W Pojeździe`,
- `Akcje Pojazdu`,
- `Stany Pojazdów`,
- `Cechy Pojazdów`,
- `Pojazdy`,
- `Bronie Pojazdów`,
- `Ekwipunek Pojazdów`.

## Application state

Key state variables:

| Name | Role |
| --- | --- |
| `DB` | Normalized database: `sheets` and `_meta`. |
| `currentSheet` | Current tab name. |
| `showOldBestiaryEntries` | Runtime-only visibility state for `old` Bestiary records. It is not stored in `sessionStorage`. |
| `SESSION_VIEW_KEY` | Session key: `datavault_session_view_v2`. |
| `DEFAULT_VIEW_CONFIG` | Default filters for selected sheets. |
| `uiState` | Character/combat/vehicle tab visibility. |
| `viewBySheet` | View state per sheet. |
| `view` | Active view state for the current sheet. |
| `RENDER_CHUNK_SIZE` | Table rendering chunk size. Currently `80`. |
| `ADMIN_MODE` | Whether URL contains `admin=1`. |
| `HIDDEN_COLUMNS` | System-hidden columns, such as `lp`, `stan`. |

## Per-sheet view state

Each sheet has this state:

| Field | Type | Description |
| --- | --- | --- |
| `sort` | `object|null` | Active sorting. Can include secondary sorting. |
| `global` | `string` | Global search phrase. |
| `filtersText` | `object` | Text filters per column. |
| `filtersSet` | `object` | List filters per column. |
| `selected` | `Set` | Selected records. |
| `expandedCells` | `Set` | Cells expanded after clamping. |

`sessionStorage` stores:

- sheet states,
- `uiState`,
- language.

It does not store `showOldBestiaryEntries`, so old Bestiary records return to hidden state after refresh.

## Default view and full view

`Default View` applies `DEFAULT_VIEW_CONFIG` to all sheets and restores default filters and sorting.

`Full View` removes default hiding, filters, and sorting for sheets.

When returning to default view, old Bestiary records are hidden again.

## Runtime data model

After unwrapping Firebase data, the module expects:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

`normaliseDB(...)` creates the working structure:

```text
{
  sheets,
  _meta: {
    traits,
    states,
    vehicleTraits,
    vehicleWeaponTraits,
    vehicleStates,
    traitIndex,
    stateIndex,
    vehicleTraitIndex,
    vehicleWeaponTraitIndex,
    vehicleStateIndex,
    sheetOrder,
    columnOrder
  }
}
```

`traitIndex`, `stateIndex`, and vehicle equivalents are canonical-key indexes used for fast trait and state description lookup.

## Generating data from XLSX

In admin mode, `Generate data files` calls `loadXlsxFromRepo()`.

Flow:

1. Ensures JSZip is available.
2. Checks `window.XlsxCanonicalParser.loadXlsxMinimal`.
3. Opens the system file picker.
4. Reads local XLSX into `ArrayBuffer`.
5. Parser returns `rawSheets`, `sheetOrder`, and `columnOrder`.
6. `buildDataJsonFromSheets(...)` builds `data.json`.
7. `buildFirebaseImportJson(...)` builds the root-ready Firebase import.
8. `validateFirebaseImportObject(...)` validates the import.
9. The browser downloads `data.json`.
10. After a short delay, the browser downloads `firebase-import.json`.
11. The working view is updated from the new data.

## Canonical XLSX parser

`xlsxCanonicalParser.js` reads XLSX as a ZIP package and analyzes XML files:

- `xl/sharedStrings.xml`,
- `xl/styles.xml`,
- `xl/workbook.xml`,
- `xl/_rels/workbook.xml.rels`,
- `xl/worksheets/sheet*.xml`.

The parser:

- normalizes whitespace,
- replaces Polish quotes `„”` with `"`,
- detects red font color,
- detects bold, italic, and strike in rich text runs,
- writes `{{RED}}`, `{{B}}`, `{{I}}`, `{{S}}` markers,
- skips the `LP` column in `columnOrder`,
- merges logical `Zasięg 1`, `Zasięg 2`, etc. into `Zasięg`,
- merges logical `Cecha 1`, `Cecha 2`, etc. into `Cechy`,
- returns `sheets`, `sheetOrder`, and `columnOrder`.

## Building `data.json`

`buildDataJsonFromSheets(...)` converts raw parser sheets into the DataVault structure.

Additional processing:

- sheet `Cechy` builds `_meta.traits`,
- sheet `Stany` builds `_meta.states`,
- sheet `Stany Pojazdów` builds `_meta.vehicleStates`,
- sheet `Cechy Pojazdów` builds `_meta.vehicleTraits` and `_meta.vehicleWeaponTraits`,
- sheets `Bronie` and `Bronie Pojazdów` merge traits and range,
- sheets `Pancerze` and `Pojazdy` merge traits.

The result has this shape:

```text
{
  sheets,
  _meta: {
    traits,
    states,
    vehicleTraits,
    vehicleWeaponTraits,
    vehicleStates,
    sheetOrder,
    columnOrder
  }
}
```

## Building `firebase-import.json`

`buildFirebaseImportJson(dataJsonObject)` creates the root-ready structure:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "...",
      "source": "Repozytorium.xlsx",
      "dataJson": "..."
    }
  }
}
```

Import this file in Firebase Console at the Realtime Database root. After import, data is stored under `datavault/live`.

## Firebase import validation

`validateFirebaseImportObject(...)` checks:

- root has only the `datavault` key,
- `datavault` has only the `live` key,
- payload has the correct `schemaVersion`,
- `dataJson` is a string,
- `JSON.parse(dataJson)` equals the generated `data.json`,
- import-tree keys do not contain characters forbidden by Realtime Database.

Validation does not inspect keys inside `dataJson`, because `dataJson` is a string, not a Realtime Database key tree.

## Table and rendering

For the active sheet, `selectSheet(name)`:

1. saves the previous sheet state,
2. sets `currentSheet`,
3. restores sheet view state,
4. clears comparison selection,
5. builds the table skeleton,
6. renders table body,
7. saves session state.

`buildTableSkeleton()` creates:

- `.tableFrame`,
- `.tableViewport`,
- `.dataTable`,
- first header row,
- second filter row,
- selection column `✓`,
- text filter input per column,
- list-filter menu button per column.

Table body rendering uses progressive chunks of `RENDER_CHUNK_SIZE`.

## Filtering and sorting

The module supports:

- global search,
- text filter per column,
- list filter per column,
- sorting by clicking a header,
- default sorting by `LP` when a sheet has that column,
- special `Archetypy` sorting by `Poziom` and secondarily by `Frakcja`.

List filters use unique column values from currently system-visible records.

## Text formatting

The module renders markers:

| Marker | Effect |
| --- | --- |
| `{{RED}}...{{/RED}}` | Red text. |
| `{{B}}...{{/B}}` | Bold. |
| `{{I}}...{{/I}}` | Italic. |
| `{{S}}...{{/S}}` | Strikethrough. |

Additionally:

- page references in parentheses containing `str`, `str.`, `strona`, `page`, or `p.` get class `ref`,
- lines starting with `*[n]` get class `caretref`,
- HTML is escaped before rendering,
- inline formatting preserves nested markers.

Detailed data formatting rules should be maintained in `DataVault/docs/ZasadyFormatowania.md`.

## Data hiding

Hiding operates on several levels:

1. System columns `lp` and `stan` are hidden.
2. Admin-only sheets are hidden outside admin mode.
3. Character/combat/vehicle sheet groups are hidden by checkboxes.
4. `old` records in Bestiary are system-hidden unless admin enables `toggleOldBestiaryEntries`.
5. Default view applies predefined filters to selected sheets.

## Record comparison

The user can select at least two rows. Then the `Compare selected` button becomes active.

The comparison modal shows field values for selected records side by side. Comparison works within the current sheet and uses current table data.

## Trait and state popover

Clicking suitable tags or special elements can open `popover`.

Description sources:

- `_meta.traits`,
- `_meta.states`,
- `_meta.vehicleTraits`,
- `_meta.vehicleWeaponTraits`,
- `_meta.vehicleStates`.

If a description does not exist, the module shows a message that the trait or state was not found.

## i18n

`translations` currently contains:

- `pl`,
- `en`.

Language affects:

- button labels,
- hints,
- status messages,
- error messages,
- aria labels,
- empty states.

The language switcher exists in HTML but has class `language-switcher--hidden`. To show it, remove that class and ensure all texts are complete.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Shared Firebase loader not ready | `getFirebaseApi()` waits for the event, then throws `FIREBASE_LOADER_NOT_READY`. |
| No Auth session | Runtime data is cleared and the K.O.Z.A. gate appears. |
| Login or RTDB read error | Message from `getReadableAccessError(...)` is shown. |
| Missing `sheets` structure | `assertDataVaultShape(...)` blocks data use. |
| Missing JSZip/canonical parser | XLSX import stops with parser-unavailable status. |
| Import generation error | Status changes to data update error and logs CLI fallback hint. |
| No data for table | Empty state is shown. |
| No results after filters | No-results empty state is shown. |

## Module recreation procedure

1. Preserve the `DataVault/` directory structure.
2. Preserve `index.html`, `app.js`, `style.css`, and `xlsxCanonicalParser.js`.
3. Preserve `shared/firebase-config.js` and `shared/firebase-data-loader.js`.
4. Configure Firebase according to `DataVault/config/FirebaseREADME.md`.
5. Ensure Realtime Database contains `datavault/live`.
6. Ensure `datavault/live.dataJson` contains valid JSON with `sheets` and `_meta`.
7. Open `DataVault/index.html`.
8. Sign in through K.O.Z.A.
9. Check that tabs and tables appear.
10. Open `DataVault/index.html?admin=1`.
11. Check that `Generate data files` is visible.
12. Generate `data.json` and `firebase-import.json` from local `Repozytorium.xlsx`.
13. Import `firebase-import.json` into the Realtime Database root.
14. Refresh the normal DataVault view and check the new data.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| User start | Open `DataVault/index.html`. | K.O.Z.A. gate is visible or data is loaded if Auth session exists. |
| Login | Enter a valid Litany of Access. | Gate disappears and data loads from private database. |
| Runtime data | Check tabs after login. | Tabs allowed for user mode are visible. |
| Admin mode | Open `DataVault/index.html?admin=1`. | Data generation button and admin-only tabs are visible. |
| Import generation | In admin mode, choose local `Repozytorium.xlsx`. | `data.json` and `firebase-import.json` are downloaded. |
| Firebase import | Import `firebase-import.json` at RTDB root. | Data is placed under `datavault/live`. |
| Default view | Click `Default View`. | Default filters and hiding are applied. |
| Full view | Click `Full View`. | Default filters and hiding are removed. |
| Global filter | Type a phrase in `globalSearch`. | Table shows matching records. |
| Column filter | Type a filter under a header. | Table filters by that column. |
| List filter | Open a column filter menu. | Values can be selected from the list. |
| Sorting | Click a column header. | Table sorts by that column. |
| Comparison | Select 2+ rows and click comparison. | Comparison modal opens. |
| Bestiary old records | In admin mode, enable old entries checkbox. | `stan=old` Bestiary records become visible. |

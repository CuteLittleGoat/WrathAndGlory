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
| `DataVault/style.css` | Style widoku: layout, topbar, panel filtrów, tabela, zakładki, modal, popover, menu filtrów, kolory, responsywność i konfiguracja kolumn arkuszy, w tym zakładki `Obrzędy` i arkuszy pojazdowych. |
| `DataVault/xlsxCanonicalParser.js` | Kanoniczny parser XLSX w przeglądarce oparty o JSZip i pliki XML pakietu XLSX. |
| `DataVault/config/FirebaseREADME.md` | Modułowa instrukcja konfiguracji Firebase dla DataVault. |
| `DataVault/docs/README.md` | Instrukcja użytkownika. |
| `DataVault/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |
| `DataVault/docs/ZasadyFormatowania.md` | Zasady formatowania danych i specjalnych markerów. |
| `shared/firebase-config.js` | Wspólna konfiguracja Firebase dla prywatnych danych DataVault. |
| `shared/firebase-data-loader.js` | Wspólny loader prywatnych danych Firebase. |
| `shared/appcheck-config.js` | Jedyne miejsce z kluczami witryny App Check (reCAPTCHA Enterprise) dla obu projektów Firebase. |
| `shared/firebase-app-check.js` | Wspólne uruchamianie App Check dla aplikacji Firebase w zapisie modularnym (SDK 12.6.0). |

## Zależności zewnętrzne

Moduł ładuje zależności bezpośrednio w HTML:

- `JSZip 3.10.1` — wymagany przez `xlsxCanonicalParser.js`,
- `xlsxCanonicalParser.js` — lokalny parser kanoniczny,
- `shared/firebase-config.js` — wspólna konfiguracja prywatnych danych,
- `shared/appcheck-config.js` — klucze witryny App Check dla obu projektów Firebase,
- `https://www.google.com/recaptcha/enterprise.js` — biblioteka reCAPTCHA Enterprise wczytywana ze znacznikiem `defer`,
- `shared/firebase-data-loader.js` — modułowy loader Firebase,
- `app.js` — główna logika DataVault.

`app.js` ma także funkcję awaryjnego doładowania JSZip z CDN, jeżeli biblioteka nie jest dostępna
w momencie użycia. Moduł **nie korzysta z SheetJS** — cały odczyt XLSX idzie przez własny parser
`xlsxCanonicalParser.js` oparty na JSZip i bezpośrednim czytaniu plików XML pakietu XLSX.

## Firebase i dane prywatne

DataVault korzysta ze wspólnej warstwy Firebase:

```text
shared/firebase-config.js
shared/appcheck-config.js
shared/firebase-app-check.js
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

## App Check

Każde zapytanie do Firebase Authentication i do Realtime Database niesie znacznik App Check, czyli
krótkotrwałe potwierdzenie, że zapytanie pochodzi z zarejestrowanej aplikacji WrathAndGlory.

Elementy układanki:

- `shared/appcheck-config.js` — klasyczny skrypt ustawiający `window.WG_APPCHECK_SITE_KEYS`
  (mapa `projectId` → klucz witryny) oraz `window.WG_getAppCheckSiteKey(projectId)`.
  To jedyne miejsce w repozytorium z kluczami; moduły ich nie powielają.
- `<script defer src="https://www.google.com/recaptcha/enterprise.js">` w `index.html` —
  biblioteka reCAPTCHA Enterprise. Wczytuje ją strona, a nie SDK Firebase. Powód jest praktyczny:
  SDK dokłada własny znacznik `<script>` wyłącznie z obsługą poprawnego wczytania, bez obsługi
  błędu, więc przy zablokowanym adresie czeka bez końca i wraz z nim czekają wszystkie zapytania
  do bazy. Atrybut `defer` gwarantuje wykonanie przed skryptami modularnymi.
- `shared/firebase-app-check.js` — funkcja `activateAppCheck(app)`. Sprawdza klucz dla projektu
  aplikacji, sprawdza obecność `window.grecaptcha.enterprise` i dopiero wtedy wywołuje
  `initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(klucz), isTokenAutoRefreshEnabled: true })`.
  Powtórne wywołanie dla tej samej aplikacji jest bezpieczne (`WeakSet` obsłużonych aplikacji).
- `shared/firebase-data-loader.js` — wywołuje `activateAppCheck(app)` w `initFirebaseDataAccess()`
  bezpośrednio po utworzeniu nazwanej aplikacji, a przed `getAuth()` i `getDatabase()`.

Uruchomienie App Check nie jest krytyczne. Brak klucza albo niedostępna reCAPTCHA kończą się
ostrzeżeniem w konsoli i pominięciem App Check — moduł pracuje wtedy dokładnie tak jak bez niego.

## Przepływ startowy aplikacji

Po załadowaniu strony moduł wykonuje logicznie następujący przepływ:

1. Stosuje język domyślny `pl`.
2. Podpina event listenery do UI.
3. Próbuje pobrać wspólne API Firebase przez `getFirebaseApi()`.
4. Czeka na `window.DataVaultFirebaseReady` albo event `datavault-firebase-loader-ready`.
5. Wywołuje `initFirebaseDataAccess()`, które tworzy nazwaną aplikację Firebase i uruchamia dla niej App Check.
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

Zakładki admin-only są zdefiniowane w `ADMIN_ONLY_SHEETS` i obejmują między innymi `Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`, `Specjalne Bonusy Wrogów`, `Notatki`, `Uszkodzenia Pojazdów` oraz `Eksplozje Pojazdów`. Arkusze `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` są jednocześnie arkuszami pojazdowymi, dlatego w praktyce pojawiają się wyłącznie wtedy, gdy URL zawiera `?admin=1` i checkbox `toggleVehicleTabs` jest zaznaczony.

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
- `sheetTools` — pasek narzędzi zakładki, widoczny wyłącznie w układzie kart (`max-width: 720px`),
- `tableWrap` — aktualna tabela albo pusty stan.

### Pasek narzędzi zakładki (`sheetTools`)

W układzie kart `<thead>` jest ukryty (`display:none`), a razem z nim znikają jedyne sterowniki
filtrów, sortowania i oznaczenia aktywnych filtrów. Pasek jest drugim wejściem do tego samego stanu
`view`, którego na komputerze używa nagłówek kolumn — `passesFilters()`, `sortRows()`
i `DEFAULT_VIEW_CONFIG` pozostają nietknięte.

| Element | Rola |
| --- | --- |
| `quickSearch` | Pole wyszukiwania zapisujące do `view.global`; dwukierunkowo zsynchronizowane z `globalSearch` w panelu filtrów. |
| `btnSheetFilters` + `filtersBadge` | Otwiera modal filtrów; odznaka pokazuje liczbę aktywnych filtrów. |
| `btnSheetSort` | Otwiera arkusz sortowania. |
| `rowCount` | Licznik `Pokazano N z M`, uzupełniany przez `updateSheetTools()` przy każdym renderowaniu. |
| `activeChips` | Żetony aktywnych filtrów; każdy ma przycisk zdejmujący ten jeden filtr. |

Pasek ma `position: sticky`. Wymaga to, by żaden przodek nie obcinał przewijania, dlatego w regule
`max-width: 720px` `.workspace` i `.tableFrame` dostają `overflow: visible`.

### Popover i modale

- `popover` pokazuje opisy cech, stanów i podobnych odwołań.
- `modal` pokazuje porównanie zaznaczonych rekordów.
- `filterMenu` jest dynamicznym menu filtrów listowych dla kolumn (nagłówek tabeli na komputerze).
- `filterModal` jest modalem filtrów dla układu kart: wszystkie kolumny arkusza w jednej pionowej
  liście, z zatwierdzaniem.
- `sortSheet` jest arkuszem sortowania dla układu kart.

## Grupy zakładek

Kod dzieli arkusze na grupy logiczne.

### Tworzenie postaci

`CHARACTER_CREATION_SHEETS` obejmuje między innymi:

- `Tabela Rozmiarów`,
- `Gatunki`,
- `Archetypy`,
- `Premie z Przeszłości Frakcji`,
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
- `Ekwipunek Pojazdów`,
- `Uszkodzenia Pojazdów`,
- `Eksplozje Pojazdów`.

`Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` są także wpisane do `ADMIN_ONLY_SHEETS`. `initUI()` filtruje je najpierw przez tryb admina, a następnie przez stan checkboxa `toggleVehicleTabs`, więc w zwykłym widoku użytkownika pozostają ukryte nawet po zaznaczeniu checkboxa pojazdów. W trybie `?admin=1` pojawiają się dopiero po zaznaczeniu checkboxa i otrzymują klasę `tab--vehicle`. Ich style kolumn są zintegrowane w `style.css`; style kolumn zakładki `Obrzędy` także są częścią tego samego pliku; moduł nie ładuje osobnych plików `vehicle-extra.css` ani `vehicle-tabs-extension.js`, ponieważ konfiguracja kolumn i logika zakładek są częścią głównych plików `style.css` i `app.js`.

W konfiguracji CSS arkuszy pojazdów kolumna `Koszt IM` arkusza `Pojazdy` jest zwykłą, widoczną kolumną danych. Używa szerokości `min-width: 8ch`, wyrównania do środka i standardowego łamania tekstu, tak jak kosztowe kolumny `Koszt IM` w `Bronie Pojazdów` oraz `Ekwipunek Pojazdów`. Nie ma reguły `white-space: nowrap`, nie jest ukrywana, nie jest scalana i nie wymaga osobnego resolvera popovera.

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

## Zgodność trzech ścieżek generowania danych

`data.json` powstaje dwiema drogami: przez `DataVault/build_json.py` uruchamiany z wiersza poleceń
i przez aplikację w przeglądarce (`xlsxCanonicalParser.js` + `buildDataJsonFromSheets()`). Zgodnie
z `AGENTS.md` §14 obie muszą dawać ten sam wynik, a trzecią ścieżką jest struktura importowana do
Firebase.

Dwie rzeczy muszą być pilnowane ręcznie, bo język nie wymusi ich sam:

**Kolejność scalania kolumn.** Dla arkuszy `Bronie` i `Bronie Pojazdów` scalane są dwie grupy kolumn:
`Zasięg 1..3` → `Zasięg` oraz `Cecha 1..N` → `Cechy`. Obie operacje usuwają swoje kolumny źródłowe
i dopisują scaloną **na końcu** rekordu, więc kolejność wywołań decyduje o kolejności pól w zapisanym
rekordzie. W obu ścieżkach jest to `mergeTraits(mergeRange(r))`, czyli najpierw zasięg, potem cechy —
tak jak w `build_json.py`.

**Normalizacja tekstu.** Funkcja `norm()` istnieje w trzech plikach (`app.js`,
`xlsxCanonicalParser.js`, `build_json.py`) i we wszystkich wykonuje te same kroki w tej samej
kolejności: zamiana polskich cudzysłowów, scalenie białych znaków, przycięcie. To z niej powstają
klucze słowników `_meta.traits` i `_meta.states`, więc rozjazd oznaczałby, że kliknięcie tagu cechy
przestaje odnajdywać jej opis — i to tylko dla niektórych nazw, czyli po cichu.

Dzięki tym dwóm rzeczom sprawdzenie zgodności jest zwykłym porównaniem plików:

```text
python DataVault/build_json.py Repozytorium.xlsx data-python.json
# oraz: tryb admina w przeglądarce -> data.json
# oba pliki muszą być identyczne co do bajtu
```

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

### Przyklejone nagłówki na komputerze i tablecie

Oba wiersze nagłówka — nazwy kolumn i pola filtrów — zostają na wierzchu przy przewijaniu tabeli.
Działa to na trzech rzeczach naraz i żadnej z nich nie da się pominąć:

**1. Łańcuch wysokości.** `position: sticky` przykleja element względem najbliższego przewijanego
pojemnika, czyli `.tableViewport`. Ten pojemnik musi mieć ograniczoną wysokość, bo inaczej nigdy się
nie przewija — przewija się wtedy cała strona i nagłówek wyjeżdża do góry razem z nią. Dlatego
`.app` ma `height: 100dvh`, a `.main`, `.workspace`, `.tableWrap` i `.tableFrame` mają `min-height: 0`.
Bez `min-height: 0` element w układzie flex nie potrafi być niższy od swojej zawartości, nawet przy
`flex: 1`.

**2. Zmierzona wysokość pierwszego wiersza.** Drugi wiersz nagłówka przykleja się na wysokości
pierwszego, przez `top: var(--header-row-height)`. Ta wysokość zależy od tego, czy nazwy kolumn
zawinęły się na dwie albo trzy linie, a to jest różne dla każdej zakładki i zmienia się przy zmianie
szerokości okna. `buildTableSkeleton()` mierzy więc wiersz i wpisuje wynik do zmiennej CSS **na
elemencie tabeli**, a `ResizeObserver` powtarza pomiar po zmianie rozmiaru. Wartość `36px` ze
zmiennej w `:root` jest wyłącznie zapasem na moment przed pierwszym pomiarem.

**3. Nieprzezroczyste tło.** Element przyklejony musi mieć tło nieprzezroczyste, inaczej przewijane
wiersze danych prześwitują przez nagłówek. Oba wiersze nagłówka mają `background-color: var(--panel)`
pod swoim gradientem oraz `z-index` (3 dla nazw kolumn, 2 dla filtrów).

### Układ kart na telefonie

Poniżej 720 px tabela zamienia się w listę kart: wiersz staje się kartą, nazwa kolumny jest etykietą
po lewej, wartość po prawej. Przyklejanie jest wtedy wyłączone (`thead` ma `display: none`), a
przewija się cała strona — `.app` wraca do `height: auto`.

Etykiety biorą się z atrybutu `data-col`, który `renderRow()` nadaje każdej komórce niezależnie od
zakładki (`td.dataset.col = col`), przez `content: attr(data-col)`. **Nie wymaga to żadnej zmiany
w JavaScript i obejmuje wszystkie zakładki, także te, które dopiero powstaną.**

Selektor `.tableWrap .dataTable[data-sheet] tbody td[data-col]` jest celowo bardziej szczegółowy niż
reguły opisujące pojedyncze kolumny, dzięki czemu znosi ich sztywne szerokości bez `!important`.

Reguły `white-space: nowrap` dla kolumny `Zasięg` w arkuszach `Bronie` i `Bronie Pojazdów` pozostają
nietknięte i działają także w układzie kart.


Render ciała tabeli wykorzystuje progressive rendering porcjami po `RENDER_CHUNK_SIZE`.

## Grupowanie kart w układzie telefonu

W układzie kart `renderBody()` nie renderuje płaskiej listy wierszy, tylko plan zbudowany przez
`buildRenderPlan(filtered, cols)`. Plan przeplata nagłówki grup z wierszami rozwiniętych grup, więc
zwinięta grupa nie generuje żadnych węzłów DOM.

| Funkcja / stała | Rola |
| --- | --- |
| `isCardLayout()` | Sprawdza `matchMedia("(max-width: 720px)")`. |
| `groupingColumnFor(sheetName, cols)` | Kolumna grupująca: najpierw kolumna z `DEFAULT_VIEW_CONFIG` dla arkusza, potem `Typ`, potem `Rodzaj`, w ostateczności `null`. |
| `buildRenderPlan(filtered, cols)` | Buduje plan renderowania; grupy powstają po filtrowaniu i sortowaniu, więc kolejność grup idzie za sortowaniem. |
| `renderGroupHeader(group, cols)` | Wiersz `tr.groupRow` z przyciskiem `.groupHead`, nazwą, licznikiem pozycji i znacznikiem zaznaczenia. |
| `expandedGroupsFor(sheetName)` | Zbiór rozwiniętych grup arkusza; **nie** trafia do `sessionStorage`, więc po odświeżeniu lista startuje zwinięta. |
| `GROUPING_MIN_ROWS` | Minimalna liczba wierszy, poniżej której grupowanie się nie włącza (12). |
| `GROUPING_AUTO_EXPAND_MAX` | Gdy wyszukiwanie zawęzi listę do tylu wierszy (40), grupy z trafieniami rozwijają się same. |

Grupowanie nie włącza się, gdy nie ma kolumny grupującej albo gdy wyszłaby jedna grupa — nowe zakładki
obsługują się przez to same, bez dopisywania konfiguracji.

## Filtrowanie i sortowanie

Moduł obsługuje:

- wyszukiwanie globalne,
- tekstowy filtr per kolumna,
- listowy filtr per kolumna,
- sortowanie po kliknięciu nagłówka,
- sortowanie domyślne po `LP`, jeżeli arkusz ma taką kolumnę,
- specjalne sortowanie `Archetypy` po `Poziom` i wtórnie po `Frakcja`.

Filtry listowe bazują na unikalnych wartościach kolumny z aktualnie systemowo widocznych rekordów.

### Modal filtrów w układzie kart

`openFilterModal()` tworzy kopię roboczą `filterDraft` przez `draftFromView()` i buduje listę
wszystkich kolumn arkusza. Modal zmienia wyłącznie kopię roboczą:

| Funkcja | Rola |
| --- | --- |
| `draftFromView()` | Głęboka kopia `filtersText` i `filtersSet` ze stanu widoku. |
| `buildFilterModalBody()` | Buduje listę kolumn; dla każdej pole tekstowe i zwiniętą listę wartości. |
| `buildFilterModalColumn(col)` | Jedna kolumna: pole tekstowe, podsumowanie stanu, rozwijana lista wartości z `Zaznacz wszystko` i `Wyczyść`. |
| `countDraftMatches()` | Liczy trafienia kopii roboczej bez dotykania DOM: podmienia filtry w `view` na czas jednego przebiegu `passesFilters()` i przywraca poprzednie. |
| `refreshApplyLabel()` | Aktualizuje napis przycisku zatwierdzania na `Zatwierdź — pokaż N z M`. |
| `applyFilterModal()` | Przepisuje kopię roboczą do `view`, synchronizuje pola w nagłówku tabeli, zamyka modal i renderuje listę **jeden raz**. |
| `closeFilterModal()` | Wyrzuca kopię roboczą bez żadnego renderowania. |
| `defaultFiltersForSheet(sheetName)` | Filtry widoku domyślnego dla jednego arkusza, bez ruszania sortowania, zaznaczeń i wyszukiwania. |

Zatwierdzanie zamiast filtrowania na żywo jest decyzją wydajnościową: `renderBody()` przebudowuje
wszystkie wiersze, co przy zakładce z kilkuset rekordami kosztuje setki milisekund, a w trakcie pracy
w modalu lista i tak jest zasłonięta. `countDraftMatches()` kosztuje ułamek milisekundy, więc podgląd
wyniku może się odświeżać po każdym stuknięciu.

Presety w modalu (`filterModalDefaults`, `filterModalClear`) działają na kopii roboczej i tylko na
bieżącym arkuszu, w odróżnieniu od `btnDefaultView` i `btnReset` w topbarze, które przez
`applyViewModeToAllSheets()` resetują wszystkie arkusze łącznie z wyszukiwaniem, sortowaniem
i zaznaczeniami. Stąd inne nazwy przycisków: `Przywróć domyślne` i `Wyczyść filtry`.

### Arkusz sortowania

`openSortSheet()` buduje listę kolumn arkusza. Każda pozycja wywołuje `toggleSort(col)`, czyli tę samą
funkcję, którą uruchamia kliknięcie w nagłówek kolumny na komputerze: rosnąco, malejąco, brak
sortowania.

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

Tabela w oknie porównania ma klasę `compareTable`, która daje jej odstępy wewnętrzne komórek 8 px,
linię `1px solid var(--div)` między wierszami, naprzemienne tła i podświetlenie wiersza pod kursorem.
Bez tej klasy treść sąsiednich kolumn dzieliłyby 4 px i napisy sklejałyby się w jeden ciąg znaków.

Okno nie wyróżnia pól, które się różnią. Dwa wpisy z tej samej zakładki różnią się w kolumnach
opisowych praktycznie zawsze, więc podświetlenie zapalałoby niemal całą tabelę i nie niosłoby
informacji.

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

Nagłówek kolumny z aktywnym filtrem (`thead tr:first-child th.filter-active`) ustawia osobno
`background-color: var(--panel)` i `background-image` z czerwonym gradientem. Skrót `background`
kasuje wszystkie składowe, których nie wymienia, więc zdejmowałby nieprzezroczysty kolor bazowy
z reguły `thead th` — a sam gradient jest półprzezroczysty i przez przyklejony nagłówek
prześwitywałaby treść przewijanych wierszy.

Przycisk `Generuj pliki danych` (`#btnUpdateData`) ma `align-self: flex-start`, więc nie rozciąga się
na szerokość kolumnowej grupy `.actionsGroup`. Kolor napisu to `var(--text-old)` — ten sam, którego
używa etykieta „Czy wyświetlić zdezaktualizowane wpisy?”.

Przełącznik języka istnieje w HTML, ale ma klasę `language-switcher--hidden`, a reguła
`.language-switcher--hidden { display: none !important; }` w `DataVault/style.css` chowa go
z interfejsu. Warstwa tłumaczeń pozostaje aktywna, a domyślnym językiem jest polski.

Aby go pokazać, wystarczy usunąć klasę `language-switcher--hidden` z kontenera
`<div class="language-switcher language-switcher--hidden">` w pliku `DataVault/index.html` — regułę CSS
można zostawić, bo bez klasy nie ma na co działać. Nad elementem stoi komentarz
`MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`.

Klasa stoi na kontenerze, bo kontener zawiera wyłącznie select — pozostałe przyciski nagłówka leżą
poza nim i ukrycie przełącznika ich nie dotyczy.

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
| `DataVault/style.css` | View styles: layout, topbar, filters panel, table, tabs, modal, popover, filter menu, colors, responsiveness, and sheet column configuration, including the `Obrzędy` tab. |
| `DataVault/xlsxCanonicalParser.js` | Browser-side canonical XLSX parser based on JSZip and XLSX package XML files. |
| `DataVault/config/FirebaseREADME.md` | Module Firebase setup guide for DataVault. |
| `DataVault/docs/README.md` | User guide. |
| `DataVault/docs/Documentation.md` | This technical documentation. |
| `DataVault/docs/ZasadyFormatowania.md` | Data formatting and special marker rules. |
| `shared/firebase-config.js` | Shared Firebase configuration for private data. |
| `shared/firebase-data-loader.js` | Shared Firebase private data loader. |
| `shared/appcheck-config.js` | The only place holding App Check site keys (reCAPTCHA Enterprise) for both Firebase projects. |
| `shared/firebase-app-check.js` | Shared App Check activation for Firebase apps in modular form (SDK 12.6.0). |

## External dependencies

The module loads dependencies directly in HTML:

- `JSZip 3.10.1` — required by `xlsxCanonicalParser.js`,
- `xlsxCanonicalParser.js` — local canonical parser,
- `shared/firebase-config.js` — shared private data configuration,
- `shared/appcheck-config.js` — App Check site keys for both Firebase projects,
- `https://www.google.com/recaptcha/enterprise.js` — the reCAPTCHA Enterprise library loaded with `defer`,
- `shared/firebase-data-loader.js` — Firebase module loader,
- `app.js` — main DataVault logic.

`app.js` also has a fallback for loading JSZip from a CDN if the library is missing at the time of
use. The module does **not** use SheetJS — all XLSX reading goes through its own
`xlsxCanonicalParser.js`, based on JSZip and direct reading of the XLSX package XML files.

## Firebase and private data

DataVault uses the shared Firebase layer:

```text
shared/firebase-config.js
shared/appcheck-config.js
shared/firebase-app-check.js
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

## App Check

Every request to Firebase Authentication and to the Realtime Database carries an App Check token,
a short-lived proof that the request originates from the registered WrathAndGlory application.

The pieces:

- `shared/appcheck-config.js` — a classic script setting `window.WG_APPCHECK_SITE_KEYS`
  (a `projectId` → site key map) and `window.WG_getAppCheckSiteKey(projectId)`.
  This is the only place in the repository holding the keys; modules never duplicate them.
- `<script defer src="https://www.google.com/recaptcha/enterprise.js">` in `index.html` —
  the reCAPTCHA Enterprise library. The page loads it, not the Firebase SDK. The reason is
  practical: the SDK appends its own `<script>` tag with an onload handler only and no error
  handler, so with a blocked address it waits forever and every database request waits with it.
  The `defer` attribute guarantees execution before the module scripts.
- `shared/firebase-app-check.js` — the `activateAppCheck(app)` function. It looks up the key for
  the app's project, checks that `window.grecaptcha.enterprise` is present and only then calls
  `initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(key), isTokenAutoRefreshEnabled: true })`.
  Calling it again for the same app is safe (a `WeakSet` of handled apps).
- `shared/firebase-data-loader.js` — calls `activateAppCheck(app)` inside `initFirebaseDataAccess()`
  right after the named app is created and before `getAuth()` and `getDatabase()`.

App Check activation is not critical. A missing key or an unavailable reCAPTCHA results in a console
warning and App Check being skipped — the module then works exactly as it does without it.

## Application startup flow

After the page loads, the module logically performs this flow:

1. Applies default language `pl`.
2. Attaches UI event listeners.
3. Tries to get the shared Firebase API through `getFirebaseApi()`.
4. Waits for `window.DataVaultFirebaseReady` or event `datavault-firebase-loader-ready`.
5. Calls `initFirebaseDataAccess()`, which creates the named Firebase app and activates App Check for it.
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

Admin-only sheets are defined in `ADMIN_ONLY_SHEETS` and include, among others, `Bestiariusz`, `Trafienia Krytyczne`, `Groza Osnowy`, `Hordy`, `Specjalne Bonusy Wrogów`, `Notatki`, `Uszkodzenia Pojazdów`, and `Eksplozje Pojazdów`. The `Uszkodzenia Pojazdów` and `Eksplozje Pojazdów` sheets are also vehicle sheets, so in practice they appear only when the URL contains `?admin=1` and the `toggleVehicleTabs` checkbox is checked.

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
- `sheetTools` — the per-sheet toolbar, shown only in the card layout (`max-width: 720px`),
- `tableWrap` — the current table or empty state.

### Per-sheet toolbar (`sheetTools`)

In the card layout `<thead>` is hidden (`display:none`), and with it go the only controls for
filtering, sorting and the active-filter markers. The toolbar is a second entry point into the same
`view` state the column header drives on a desktop — `passesFilters()`, `sortRows()` and
`DEFAULT_VIEW_CONFIG` stay untouched.

| Element | Role |
| --- | --- |
| `quickSearch` | Search field writing into `view.global`; kept in two-way sync with `globalSearch` in the filter panel. |
| `btnSheetFilters` + `filtersBadge` | Opens the filter modal; the badge shows the number of active filters. |
| `btnSheetSort` | Opens the sort sheet. |
| `rowCount` | The `Pokazano N z M` counter, filled by `updateSheetTools()` on every render. |
| `activeChips` | Chips for the active filters; each has a button removing that one filter. |

The toolbar uses `position: sticky`. That requires no ancestor to clip scrolling, so in the
`max-width: 720px` rule `.workspace` and `.tableFrame` get `overflow: visible`.

### Popover and modals

- `popover` shows trait, state, and similar reference descriptions.
- `modal` shows selected record comparison.
- `filterMenu` is the dynamic list-filter menu for columns (the desktop table header).
- `filterModal` is the filter modal for the card layout: every column of the sheet in one vertical
  list, with a confirmation step.
- `sortSheet` is the sort sheet for the card layout.

## Sheet groups

The code divides sheets into logical groups.

### Character creation

`CHARACTER_CREATION_SHEETS` includes, among others:

- `Tabela Rozmiarów`,
- `Gatunki`,
- `Archetypy`,
- `Premie z Przeszłości Frakcji`,
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
- `Ekwipunek Pojazdów`,
- `Uszkodzenia Pojazdów`,
- `Eksplozje Pojazdów`.

`Uszkodzenia Pojazdów` and `Eksplozje Pojazdów` are also listed in `ADMIN_ONLY_SHEETS`. `initUI()` filters them first by admin mode and then by the `toggleVehicleTabs` checkbox state, so they remain hidden in the regular user view even if the vehicle checkbox is checked. In `?admin=1` mode they appear only after the checkbox is checked and receive the `tab--vehicle` class. Their column styles are integrated in `style.css`; the `Obrzędy` tab column styles are also part of the same file; the module does not load separate `vehicle-extra.css` or `vehicle-tabs-extension.js` files because column configuration and tab logic are part of the main `style.css` and `app.js` files.

In the vehicle-sheet CSS configuration, the `Koszt IM` column in the `Pojazdy` sheet is a regular visible data column. It uses `min-width: 8ch`, centered text, and standard wrapping, like the `Koszt IM` cost columns in `Bronie Pojazdów` and `Ekwipunek Pojazdów`. It has no `white-space: nowrap` rule, is not hidden, is not merged, and does not require a separate popover resolver.

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

## Consistency of the three data-generation paths

`data.json` is produced two ways: by `DataVault/build_json.py` run from the command line and by the
application in the browser (`xlsxCanonicalParser.js` + `buildDataJsonFromSheets()`). Under
`AGENTS.md` §14 both must produce the same result, and the third path is the structure imported into
Firebase.

Two things have to be watched by hand, because the language will not enforce them:

**The column merge order.** For the `Bronie` and `Bronie Pojazdów` sheets two column groups are
merged: `Zasięg 1..3` → `Zasięg` and `Cecha 1..N` → `Cechy`. Both operations remove their source
columns and append the merged one **at the end** of the record, so the call order decides the field
order in the stored record. In both paths it is `mergeTraits(mergeRange(r))` — range first, then
traits, as in `build_json.py`.

**Text normalisation.** The `norm()` function exists in three files (`app.js`,
`xlsxCanonicalParser.js`, `build_json.py`) and all three perform the same steps in the same order:
replace Polish quotes, collapse whitespace, trim. It produces the keys of the `_meta.traits` and
`_meta.states` dictionaries, so drift would mean that clicking a trait tag stops finding its
description — and only for some names, that is, silently.

Because of those two things, checking consistency is a plain file comparison:

```text
python DataVault/build_json.py Repozytorium.xlsx data-python.json
# and: admin mode in the browser -> data.json
# both files must be byte-identical
```

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

### Sticky headers on computer and tablet

Both header rows — the column names and the filter fields — stay on top while the table scrolls. This
rests on three things at once and none of them can be skipped:

**1. The height chain.** `position: sticky` sticks an element relative to the nearest scrolling
container, which is `.tableViewport`. That container must have a bounded height, otherwise it never
scrolls — the whole page scrolls instead and the header travels off the top with it. Hence `.app` has
`height: 100dvh`, and `.main`, `.workspace`, `.tableWrap` and `.tableFrame` have `min-height: 0`.
Without `min-height: 0` a flex item cannot be shorter than its content, even with `flex: 1`.

**2. The measured height of the first row.** The second header row sticks at the height of the first
one, through `top: var(--header-row-height)`. That height depends on whether the column names wrapped
onto two or three lines, which differs per tab and changes when the window is resized. So
`buildTableSkeleton()` measures the row and writes the result into a CSS variable **on the table
element**, and a `ResizeObserver` repeats the measurement after a resize. The `36px` value in the
`:root` variable is only a fallback for the moment before the first measurement.

**3. An opaque background.** A sticky element needs an opaque background, otherwise the scrolling data
rows show through the header. Both header rows carry `background-color: var(--panel)` under their
gradient plus a `z-index` (3 for the column names, 2 for the filters).

### Card layout on a phone

Below 720 px the table turns into a list of cards: a row becomes a card, the column name is the label
on the left and the value sits on the right. Sticking is then switched off (`thead` gets
`display: none`) and the page itself scrolls — `.app` returns to `height: auto`.

The labels come from the `data-col` attribute that `renderRow()` sets on every cell regardless of the
tab (`td.dataset.col = col`), via `content: attr(data-col)`. **This requires no JavaScript change and
covers every tab, including those yet to be created.**

The `.tableWrap .dataTable[data-sheet] tbody td[data-col]` selector is deliberately more specific than
the per-column rules, so it overrides their fixed widths without `!important`.

The `white-space: nowrap` rules for the `Zasięg` column in the `Bronie` and `Bronie Pojazdów` sheets
are untouched and apply in the card layout too.

Table body rendering uses progressive chunks of `RENDER_CHUNK_SIZE`.

## Card grouping in the phone layout

In the card layout `renderBody()` does not render a flat list of rows but a plan built by
`buildRenderPlan(filtered, cols)`. The plan interleaves group headers with the rows of expanded groups,
so a collapsed group produces no DOM nodes at all.

| Function / constant | Role |
| --- | --- |
| `isCardLayout()` | Checks `matchMedia("(max-width: 720px)")`. |
| `groupingColumnFor(sheetName, cols)` | The grouping column: first the column from `DEFAULT_VIEW_CONFIG` for the sheet, then `Typ`, then `Rodzaj`, otherwise `null`. |
| `buildRenderPlan(filtered, cols)` | Builds the render plan; groups are formed after filtering and sorting, so their order follows the sorting. |
| `renderGroupHeader(group, cols)` | A `tr.groupRow` row with a `.groupHead` button, the name, the item count and a selection mark. |
| `expandedGroupsFor(sheetName)` | The set of expanded groups of a sheet; **not** persisted to `sessionStorage`, so the list starts collapsed after a refresh. |
| `GROUPING_MIN_ROWS` | The minimum number of rows below which grouping does not kick in (12). |
| `GROUPING_AUTO_EXPAND_MAX` | When the search narrows the list to at most this many rows (40), the groups holding matches expand on their own. |

Grouping does not kick in when there is no grouping column or when a single group would come out — new
sheets are therefore handled automatically, with no configuration to add.

## Filtering and sorting

The module supports:

- global search,
- text filter per column,
- list filter per column,
- sorting by clicking a header,
- default sorting by `LP` when a sheet has that column,
- special `Archetypy` sorting by `Poziom` and secondarily by `Frakcja`.

List filters use unique column values from currently system-visible records.

### The filter modal in the card layout

`openFilterModal()` creates a working copy `filterDraft` through `draftFromView()` and builds the list
of all columns of the sheet. The modal edits the working copy only:

| Function | Role |
| --- | --- |
| `draftFromView()` | A deep copy of `filtersText` and `filtersSet` from the view state. |
| `buildFilterModalBody()` | Builds the column list; a text field and a collapsed value list for each. |
| `buildFilterModalColumn(col)` | One column: text field, state summary, expandable value list with `Zaznacz wszystko` and `Wyczyść`. |
| `countDraftMatches()` | Counts the working copy's matches without touching the DOM: it swaps the filters in `view` for a single `passesFilters()` pass and restores the previous ones. |
| `refreshApplyLabel()` | Updates the apply button caption to `Zatwierdź — pokaż N z M`. |
| `applyFilterModal()` | Writes the working copy into `view`, syncs the table-header fields, closes the modal and renders the list **once**. |
| `closeFilterModal()` | Discards the working copy without any rendering. |
| `defaultFiltersForSheet(sheetName)` | The default-view filters for one sheet, without touching sorting, selection or the search. |

Confirming instead of filtering live is a performance decision: `renderBody()` rebuilds every row,
which costs hundreds of milliseconds on a sheet with a few hundred records, and while the modal is
open the list is covered anyway. `countDraftMatches()` costs a fraction of a millisecond, so the
result preview can refresh on every tap.

The presets in the modal (`filterModalDefaults`, `filterModalClear`) act on the working copy and on the
current sheet only, unlike `btnDefaultView` and `btnReset` in the top bar, which go through
`applyViewModeToAllSheets()` and reset every sheet including the search, the sorting and the selection.
Hence the different button names: `Przywróć domyślne` and `Wyczyść filtry`.

### The sort sheet

`openSortSheet()` builds the list of the sheet's columns. Every entry calls `toggleSort(col)`, the same
function a click on a column header triggers on a desktop: ascending, descending, no sorting.

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

The table in the comparison window carries the `compareTable` class, which gives it 8 px cell
padding, a `1px solid var(--div)` line between rows, alternating backgrounds and a hover highlight.
Without that class the contents of neighbouring columns would be 4 px apart and their texts would run
together into a single string.

The window does not highlight fields that differ. Two entries from the same tab differ in the
descriptive columns practically always, so highlighting would light up nearly the whole table and
carry no information.

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

A header of a column with an active filter (`thead tr:first-child th.filter-active`) sets
`background-color: var(--panel)` and the red gradient `background-image` separately. The `background`
shorthand resets every component it does not name, so it would strip the opaque base colour coming
from the `thead th` rule — and the gradient alone is semi-transparent, which let the scrolling row
content show through the sticky header.

The `Generuj pliki danych` button (`#btnUpdateData`) uses `align-self: flex-start`, so it does not
stretch to the width of the `.actionsGroup` column container. Its text colour is `var(--text-old)` —
the same one the "Czy wyświetlić zdezaktualizowane wpisy?" label uses.

The language switcher exists in HTML but carries the `language-switcher--hidden` class, and the
rule `.language-switcher--hidden { display: none !important; }` in `DataVault/style.css` removes it
from the interface. The translation layer stays active and Polish is the default language.

To make it visible, remove the `language-switcher--hidden` class from the
`<div class="language-switcher language-switcher--hidden">` container in `DataVault/index.html` — the CSS
rule can stay, because without the class it has nothing to act on. A comment marked
`LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits above the element.

The class sits on the container, because the container holds only the select — the other header
buttons live outside it, so hiding the selector does not affect them.

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

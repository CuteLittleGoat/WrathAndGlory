# 🇵🇱 Dokumentacja techniczna — Audio (PL)

## Cel modułu

`Audio` jest przeglądarkowym panelem do odtwarzania efektów dźwiękowych i zarządzania listami dźwięków używanymi podczas gry.

Moduł pozwala:

- wczytać manifest SFX z dwóch warstw: publicznej i chronionej za bramką dostępu,
- pogrupować warianty tego samego dźwięku,
- filtrować dźwięki po tagach wynikających ze ścieżki folderu,
- dodawać dźwięki do widoku głównego,
- tworzyć listy ulubionych,
- nadawać aliasy SFX,
- synchronizować konfigurację przez Firestore,
- działać lokalnie przez `localStorage`, gdy Firebase nie jest skonfigurowany,
- odtwarzać dźwięki jednorazowo albo w pętli w widoku użytkownika.

Moduł jest pojedynczą stroną HTML z osadzonym CSS i JavaScriptem modułowym.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `Audio/index.html` | Widok użytkownika. Pokazuje tylko przygotowany widok główny i listy ulubionych. |
| `Audio/index.html?admin=1` | Widok admina. Pokazuje zarządzanie manifestem, filtrami, listami, aliasami i podgląd widoku użytkownika. |

Tryb admina jest wykrywany przez parametr URL:

```text
?admin=1
```

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `Audio/index.html` | Pełna aplikacja: HTML, CSS, JS, import konfiguracji Firebase i import modułów Firebase. |
| `Audio/AudioManifest.json` | Manifest warstwy publicznej (demo). Zawiera gotowe adresy plików jawnie dostępnych. |
| `Audio/worker/audio-gate.js` | Kod bramki dostępu (Cloudflare Worker) wydającej manifest warstwy chronionej i podpisane adresy plików. |
| `Audio/config/firebase-config.js` | Konfiguracja Firebase dla ustawień Audio. |
| `../shared/access-gate.css` | Wspólny arkusz bramki dostępu, ten sam co w `DataVault` i `GeneratorNPC`. |
| `Audio/config/firebase-config.template.js` | Szablon konfiguracji Firebase. |
| `Audio/config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase modułu Audio. |
| `Audio/docs/README.md` | Instrukcja użytkownika. |
| `Audio/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |

## Zależności zewnętrzne

`Audio/index.html` ładuje:

- Google Fonts `Fira Code`,
- `../shared/access-gate.css`,
- `config/firebase-config.js`,
- Firebase modular SDK `12.6.0`:
  - `firebase-app.js`,
  - `firebase-firestore.js`.

## Tryby widoku

### Widok użytkownika

Widok bez `?admin=1`:

- usuwa elementy `admin-only`,
- pokazuje tylko interfejs użytkownika,
- pokazuje nawigację po widoku głównym i listach ulubionych,
- pozwala odtwarzać dźwięki z kart,
- pokazuje suwaki głośności,
- renderuje przycisk `Loop`.

### Widok admina

Widok z `?admin=1`:

- usuwa elementy `user-only`,
- pokazuje nagłówek, statusy i toolbar,
- pokazuje panel filtrów tagów,
- pokazuje listę wszystkich SFX z manifestu,
- pozwala dodawać dźwięki do widoku głównego lub list ulubionych,
- pozwala tworzyć, zmieniać nazwę, usuwać i porządkować listy ulubionych,
- pozwala porządkować widok główny,
- pokazuje podgląd widoku użytkownika,
- nie renderuje przycisku `Loop` w adminowym podglądzie.

## Główne sekcje UI

### Nagłówek admina

Nagłówek admina zawiera:

- tytuł,
- opis,
- przełącznik języka `languageSelect`,
- status manifestu `manifestStatus`,
- status Firebase `firebaseStatus`,
- status ulubionych `favoritesStatus`.

### Toolbar admina

Toolbar zawiera:

- `reloadManifest` — ponowne wczytanie obu manifestów,
- `unlockLibrary` — otwarcie bramki dostępu; przycisk jest ukrywany (`hidden`), gdy `state.libraryUnlocked` jest prawdziwe,
- `buildManifests` — generator manifestów z arkusza XLSX (wyłącznie w widoku admina),
- `addList` — utworzenie nowej listy ulubionych,
- `refreshFavorites` — ręczne odświeżenie widoków ulubionych.

### Panel filtrów tagów

Panel tagów zawiera:

- `toggleTagPanel` — zwija lub rozwija panel,
- `tagSearchInput` — pole wyszukiwania tagów,
- `tagFilterMenuButton` — otwiera popup filtra,
- `tagFilter` — drzewo checkboxów tagów,
- `tagFilterMenu` — popup z wyszukiwarką, checkboxami i akcjami zbiorczymi,
- `tagMenuSelectAll` — zaznacza wszystkie widoczne tagi,
- `tagMenuClearAll` — odznacza wszystkie widoczne tagi.

Filtry tagów wpływają tylko na listę SFX w panelu admina. Nie zmieniają widoku głównego ani list ulubionych użytkownika.

### Lista SFX admina

Lista SFX używa `samplesGrid`.

Każda karta pokazuje:

- nazwę SFX,
- alias w nawiasie, jeżeli istnieje,
- liczbę zgrupowanych wariantów, jeżeli dźwięk ma wiele wariantów,
- `tag2`, czyli drugi poziom tagów,
- nazwę pliku albo nazwę pierwszego pliku i licznik wariantów,
- pole aliasu,
- przycisk czyszczenia aliasu,
- przycisk odtwarzania,
- select wyboru listy docelowej,
- przycisk dodania do listy.

### Panel ulubionych admina

Panel `favoritesPanel` pokazuje listy ulubionych.

Dla list można:

- przenieść listę w górę lub dół,
- zmienić nazwę listy,
- usunąć listę,
- odtworzyć dźwięk z listy,
- przenieść pozycję w górę lub dół,
- usunąć pozycję z listy.

### Panel widoku głównego admina

Panel `mainViewPanel` pokazuje kolejność dźwięków widoku głównego.

Dla pozycji można:

- odtworzyć dźwięk kliknięciem nazwy lub tagu,
- ustawić głośność suwakiem,
- przesunąć pozycję w górę lub dół,
- usunąć pozycję z widoku głównego.

### Widok użytkownika

Widok użytkownika zawiera:

- `userMainView` — aktualny widok główny,
- `userFavoritesView` — aktywna lista ulubionych,
- `userNav` — nawigacja między widokiem głównym i listami,
- `languageSelectUser` — przełącznik języka, obecnie ukryty klasą `language-switcher--hidden`.

## Stan aplikacji

Główny obiekt `state` zawiera:

| Pole | Typ | Opis |
| --- | --- | --- |
| `items` | `array` | Lista SFX po parsowaniu manifestu. |
| `itemsById` | `Map` | Mapa SFX po `id`. |
| `favorites` | `object` | Listy ulubionych. |
| `mainView` | `object` | Lista ID widoku głównego. |
| `aliases` | `object` | Alias per `itemId`. |
| `firestore` | `object|null` | Instancja Firestore, jeżeli działa Firebase. |
| `favoritesDoc` | `object|null` | Referencja dokumentu `audio/favorites`. |
| `usingFirestore` | `boolean` | Czy aktywna jest synchronizacja Firestore. |
| `manifestReady` | `boolean` | Czy manifest został poprawnie wczytany. |
| `session` | `object\|null` | Token bramki. `exp` ma wartość `null` dla tokenu bezterminowego. |
| `libraryUnlocked` | `boolean` | Czy warstwa chroniona jest wczytana. |
| `libraryError` | `string\|null` | Powód, dla którego warstwa chroniona się nie wczytała. |
| `publicError` | `string\|null` | Powód, dla którego warstwa publiczna się nie wczytała. |
| `builder` | `object` | Stan generatora manifestów: `{ status, publicCount, protectedCount, message }`. `status` przyjmuje `idle`, `working`, `ready` albo `error`. |
| `userView` | `string` | Aktualny widok użytkownika: `main` albo lista. |
| `activeFavoritesListId` | `string|null` | Aktywna lista ulubionych w widoku użytkownika. |
| `tagTree` | `array` | Drzewo tagów zbudowane z manifestu. |
| `tagSelection` | `Map` | Zaznaczenia tagów. |
| `tagPanelVisible` | `boolean` | Czy panel tagów jest rozwinięty. |
| `tagMenuOpen` | `boolean` | Czy popup tagów jest otwarty. |
| `tagMenuSearchTerm` | `string` | Fraza wyszukiwania tagów w popupie. |

Aktywne odtwarzacze są przechowywane poza `state` w:

```text
activePlayers: Map
```

## Dwie warstwy biblioteki

Biblioteka jest podzielona na dwie warstwy o różnym trybie dostępu. Podział wynika z tego, że część materiału jest darmowa i celowo publiczna, a reszta jest chroniona prawami autorskimi.

| Warstwa | `access` | Źródło manifestu | Źródło plików | Logowanie |
| --- | --- | --- | --- | --- |
| Publiczna (demo) | `"public"` | `AudioManifest.json` w tym repozytorium | publiczne repozytorium `AudioExample` na GitHub Pages | nie |
| Chroniona (archiwum) | `"protected"` | endpoint `/manifest` bramki | prywatne repozytorium `AudioRPG` przez bramkę | tak |

Obie listy są łączone w `loadManifests()` i sortowane wspólnie po `label`, więc użytkownik widzi jedną listę.

### Dlaczego potrzebna jest bramka

GitHub Pages zna wyłącznie dwa stany: repozytorium publiczne, czyli pliki dostępne dla każdego, albo prywatne, czyli brak opublikowanej strony i pliki niedostępne dla nikogo. Nie istnieje stan pośredni — także w planach płatnych, bo kontrola dostępu do Pages jest dostępna wyłącznie w GitHub Enterprise Cloud.

Bramka dodaje brakujący trzeci stan: repozytorium `AudioRPG` zostaje prywatne na stałe, a jedynym wejściem do plików jest Worker sprawdzający uprawnienie.

## Manifesty

### `AudioManifest.json`

Manifest warstwy publicznej, wczytywany zawsze:

```js
fetch(PUBLIC_MANIFEST_URL, { cache: "no-store" })
```

Struktura:

```text
{
  version: 1,
  access: "public",
  items: [
    {
      id, label, groupCount, filename, access: "public",
      tags: [], tag2, tagPaths: [],
      variants: [ { filename, url } ]
    }
  ]
}
```

### Manifest warstwy chronionej

Wczytywany z bramki wyłącznie przy ważnej sesji:

```js
fetch(`${AUDIO_GATE_BASE}/manifest`, {
  headers: { Authorization: `Bearer ${state.session.token}` }
})
```

Struktura identyczna, z dwiema różnicami: `access` ma wartość `"protected"`, a warianty zamiast `url` mają `path` — ścieżkę względną w repozytorium `AudioRPG`. Gotowy adres powstaje dopiero po podpisaniu przez bramkę.

### Generowanie manifestów

Oba pliki powstają ze źródłowego arkusza `AudioManifest.xlsx`, który **nie znajduje się w tym repozytorium** — jego miejsce jest w repozytorium prywatnym, ponieważ zawiera pełny katalog materiałów chronionych. W `.gitignore` jest wpis blokujący jego przypadkowe dodanie.

Generator działa **w przeglądarce, w panelu admina**, przyciskiem `buildManifests`. Przebieg odpowiada aktualizacji danych w module `DataVault`: `<input type="file">` tworzony w locie, konwersja lokalna, dwa pobrania przez `Blob` i `URL.createObjectURL`.

Kluczowa decyzja projektowa: generator nie jest osobnym skryptem, tylko fragmentem `index.html` i **używa tych samych funkcji `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment` i `normalizeUrl`, których używa reszta modułu**. Identyfikator `id` powstaje ze slugu etykiety, a listy ulubionych, widok główny i aliasy w Firestore przechowują właśnie `id`. Wcześniejszy generator w Node (`Audio/tools/build-manifests.mjs`) trzymał kopie tych funkcji i mógł się z modułem rozjechać, co zerwałoby powiązanie zapisanych list z dźwiękami. Został usunięty właśnie dlatego — jedno źródło logiki identyfikatorów zamiast dwóch.

Krok po kroku:

1. `pickLocalWorkbookFile()` — tworzy ukryty `<input type="file" accept=".xlsx">` i zwraca `ArrayBuffer`. Zwraca `null`, gdy użytkownik zrezygnował (zdarzenia `change` bez pliku oraz `cancel`).
2. `ensureJSZip()` — doładowuje JSZip z `cdn.jsdelivr.net` przy pierwszym użyciu. Biblioteka nie jest ładowana w widoku użytkownika. Nieudana próba zeruje `jsZipPromise`, żeby kolejne kliknięcie mogło spróbować ponownie.
3. `readXlsxSheet()` — minimalny czytnik XLSX: rozpakowuje `xl/sharedStrings.xml`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels` i arkusz wskazany relacją pierwszego `<sheet>`. Obsługuje typy komórek `s` (shared string), `inlineStr` i wartości surowe. Zwraca `{ header, rows }` jako tablice pozycyjne, **bez sklejania kolumn po nazwie** — to warunek konieczny do wykrycia duplikatów nagłówka.
4. `resolveRequiredColumns()` — walidacja nagłówka.
5. `buildManifestItems()` — grupowanie wariantów, identyczne z logiką manifestu.
6. `downloadJsonFile()` — zapis pliku; drugie pobranie jest opóźnione o 150 ms, bo część przeglądarek pomija dwa pobrania uruchomione w tej samej chwili.

#### Walidacja nagłówka

Wymagane kolumny: `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu` (stała `BUILDER_REQUIRED_COLUMNS`).

| Sytuacja | Zachowanie |
| --- | --- |
| Brak którejkolwiek wymaganej kolumny | Błąd `builder_missing_columns`, lista brakujących nazw w komunikacie. Żaden plik nie powstaje. |
| Wymagana kolumna występuje więcej niż raz | Błąd `builder_duplicate_columns`. Generator celowo nie zgaduje, którą kolumnę wziąć. |
| Kolumny spoza listy wymaganych | Ignorowane. Czytane są wyłącznie trzy indeksy zwrócone przez `resolveRequiredColumns()`. |
| Dowolna kolejność kolumn | Obsługiwana — wiązanie idzie po nazwie nagłówka, nie po pozycji. |
| Arkusz zawiera sam nagłówek | Błąd `builder_no_rows`. |
| Wariant chroniony bez ścieżki w `/AudioRPG/` | Błąd `builder_no_paths` z liczbą wariantów. Zapobiega wypuszczeniu manifestu z niegrywalnymi pozycjami. |

Każdy błąd ustawia `state.builder.status = "error"`, zapala pastylkę `builderStatus` na czerwono i pokazuje `alert()` z pełną treścią. **Przy błędzie nie powstaje żaden plik.**

#### Podział na warstwy

O przypisaniu decyduje adres w kolumnie `LinkDoFolderu`:

- zawiera `/AudioExample/` (stała `BUILDER_PUBLIC_PREFIX`) → `access: "public"`, wariant dostaje `url`,
- w przeciwnym razie → `access: "protected"`, wariant dostaje `path` powstałe przez odcięcie wszystkiego do `/AudioRPG/` włącznie i `decodeURIComponent`.

Generator produkuje:

- `AudioManifest.json` (z wcięciami, czytelny w diffie) → do folderu `Audio` tego repozytorium,
- `audio-manifest.json` (bez wcięć, mniejszy transfer przez bramkę) → do katalogu głównego repozytorium prywatnego `AudioRPG`.

#### Stabilność identyfikatorów a kolejność wierszy

`id` powstaje jako slug etykiety. Przy kolizji — ta sama etykieta w innym folderze — do slugu dopisywany jest **numer wiersza w arkuszu** (`${id}-${entry.rowIndex}`). W obecnym arkuszu dotyczy to 133 pozycji.

Konsekwencja jest praktyczna i łatwa do przeoczenia: **wstawienie wiersza w środku arkusza przesuwa `rowIndex` wszystkich wierszy poniżej, a więc zmienia wszystkie identyfikatory kolizyjne poniżej punktu wstawienia.** Zapisane listy ulubionych, widok główny i aliasy przestają wtedy wskazywać te dźwięki.

Pomiar na rzeczywistym arkuszu (1793 wiersze):

| Operacja | Zmienione identyfikatory |
| --- | --- |
| Dopisanie wiersza na końcu | 0 |
| Wstawienie tego samego wiersza w środku | 123 |

Dlatego `README.md` instruuje, żeby nowe wiersze dopisywać wyłącznie na końcu arkusza. Gdyby kiedyś trzeba było znieść to ograniczenie, sufiks kolizyjny musiałby być wyznaczany z czegoś niezależnego od pozycji wiersza — na przykład ze ścieżki folderu.

## Bramka dostępu (Cloudflare Worker)

Kod: `Audio/worker/audio-gate.js`. Wdrożenie: Worker `audio-gate` na koncie Cloudflare.

### Zmienne środowiskowe

| Nazwa | Typ | Zawartość |
| --- | --- | --- |
| `GROUP_PASSWORD` | Secret | Hasło grupy, czyli Litania Dostępu. |
| `SIGNING_KEY` | Secret | Klucz HMAC do podpisywania tokenów sesji i adresów plików. |
| `GITHUB_TOKEN` | Secret | Fine-grained PAT: tylko repozytorium `AudioRPG`, uprawnienie `Contents: Read-only`. |
| `ALLOWED_ORIGIN` | Text | `https://cutelittlegoat.github.io` |

Sekrety nie mogą trafić do repozytorium. Ustawia się je w panelu Cloudflare albo komendą `npx wrangler secret put`.

### Endpointy

| Endpoint | Metoda | Autoryzacja | Działanie |
| --- | --- | --- | --- |
| `/health` | GET | brak | Zwraca informację, które zmienne są ustawione. Do diagnostyki. |
| `/login` | POST | brak | Przyjmuje `{ password }`, porównuje w czasie stałym, zwraca `{ token, exp }`. |
| `/manifest` | GET | Bearer | Przekazuje `audio-manifest.json` z repozytorium prywatnego. |
| `/sign` | GET | Bearer | Dla `?p=<ścieżka>` zwraca `{ url, exp }` — podpisany adres pliku. |
| `/a` | GET | podpis w adresie | Weryfikuje podpis i wygaśnięcie, po czym wydaje plik z nagłówkami CORS. |

### Token sesji

Format: `base64url(JSON) + "." + base64url(HMAC-SHA256)`. Ładunek zawiera wyłącznie `iat` — znacznik czasu wydania, nieweryfikowany. Nie ma bazy danych; sam podpis wystarczy.

**Sesja jest bezterminowa**, tak samo jak w module `DataVault`. Token nie ma pola `exp`, a `/login` zwraca `exp: null`. Token trafia do `localStorage` pod kluczem `audio.session` i żyje do wyczyszczenia danych przeglądarki. Jedynym sposobem unieważnienia wszystkich sesji naraz jest zmiana sekretu `SIGNING_KEY` w Workerze.

Zgodność wsteczna: tokeny wydane przed tą zmianą mają pole `exp` z ważnością 30 dni. `verifySessionToken()` nadal honoruje ich datę wygaśnięcia — stary token wygasa zgodnie z pierwotnym terminem, zamiast zostać po cichu przedłużony w nieskończoność. Po jego wygaśnięciu użytkownik podaje hasło raz i dostaje token bezterminowy.

### Podpisywanie adresów

Podpis to `HMAC-SHA256(SIGNING_KEY, "<ścieżka>|<exp>")` w base64url. Adres ma postać:

```text
/a?p=<ścieżka>&e=<exp>&s=<podpis>
```

Wygaśnięcie jest wyrównane do pełnej godziny:

```js
exp = (Math.floor(now / 3600) + 2) * 3600
```

Daje to ważność od 1 do 2 godzin, ale przede wszystkim sprawia, że w obrębie jednej godziny zegarowej powstaje **dokładnie ten sam adres**. Bez tego wyrównania każdy podpis tworzyłby nowy adres, a przeglądarka pobierałaby ten sam plik od nowa przy każdym odtworzeniu — kosztowne przy plikach rzędu kilkunastu megabajtów.

### Dlaczego autoryzacja jest w adresie, a nie w ciasteczku

Wcześniejsza próba oparta na Cloudflare Access pytała o hasło przy każdym odtworzeniu. Przyczyna: ciasteczko `CF_Authorization` przy żądaniach cross-origin jest ciasteczkiem third-party i przeglądarki je blokują, więc każde żądanie o plik kończyło się przekierowaniem na logowanie.

Element `<audio>` nie pozwala dołożyć własnych nagłówków, dlatego autoryzacja pliku jedzie w query stringu podpisanego adresu. Nie ma ciasteczka, nie ma nagłówka `WWW-Authenticate`, nie ma czego blokować ani o co pytać.

### Ograniczenia i zabezpieczenia

- Ścieżki są walidowane przez `isSafeAudioPath`: odrzucane są `..`, ścieżki absolutne, `\\`, `//` oraz rozszerzenia inne niż `.ogg` i `.mp3`.
- Porównania sekretów używają `timingSafeEqual`, żeby nie ujawniać wartości pomiarem czasu odpowiedzi.
- Manifest jest przekazywany **bez parsowania**. Worker ma 10 ms czasu CPU na żądanie, a parsowanie pół megabajta JSON-a zjadłoby ten budżet.
- Manifest i pliki są cache'owane w Cache API. Manifest na 5 minut, pliki na rok, bo adres i tak wygasa.
- Obsługiwane są żądania `Range`, potrzebne przy przewijaniu dźwięku.

## Sesja i bramka po stronie modułu

| Element | Rola |
| --- | --- |
| `AUDIO_GATE_BASE` | Adres bramki. Miejsce zmiany przy przenoszeniu Workera. |
| `AUDIO_SESSION_STORAGE_KEY` | Klucz `audio.session` w `localStorage`. |
| `AUDIO_GATE_SKIPPED_KEY` | Klucz `audio.gateSkipped` w `sessionStorage`. Pamięta kliknięcie `Pomiń` na czas jednej karty przeglądarki. |
| `loadSession()` / `storeSession()` | Odczyt i zapis tokenu w `localStorage`. |
| `isSessionUsable(session)` / `hasValidSession()` | Sesja jest ważna, gdy ma token oraz nie ma `exp` (token bezterminowy) albo `exp` jest w przyszłości (stary token 30-dniowy). |
| `signedUrlCache` | Mapa `ścieżka → { url, exp }`. Ogranicza liczbę wywołań `/sign`. |
| `requestSignedUrl(path)` | Pobiera podpis; przy `401` czyści sesję i rzuca `gate_unauthorized`. |
| `resolveVariantUrl(item, variant)` | Zwraca gotowy adres: z manifestu dla `public`, z bramki dla `protected`. |
| `showAccessGate()` / `hideAccessGate()` | Pokazanie i ukrycie nakładki `#accessGate` atrybutem `hidden`. |
| `submitAccessLitany()` | Wymiana hasła na token, po czym przeładowanie manifestów. Ma **dwa rozłączne bloki `try`**: pierwszy obejmuje wyłącznie żądanie `/login`, drugi wyłącznie `loadManifests()`. Przy `state.libraryError` albo `state.publicError` nakładka zostaje otwarta z powodem błędu. |
| `maybeShowAccessGate()` | Otwiera bramkę po starcie, gdy nie ma ważnej sesji i nie kliknięto `Pomiń`. Wywoływane w `.finally()` po `loadManifests()`. |
| `isGateSkipped()` / `markGateSkipped()` / `skipAccessGate()` | Obsługa przycisku `Pomiń` i klawisza `Escape`. |
| `handleUnlockClick(message)` | Kasuje znacznik pominięcia i otwiera bramkę, opcjonalnie z własnym komunikatem. |

Nie ma funkcji blokującej archiwum. Przycisk blokowania został usunięty jako zbędny: odblokowane archiwum jest stanem docelowym, a dostęp na urządzeniu kasuje się przez wyczyszczenie danych witryny.

### Zachowanie bramki

| Zdarzenie | Reakcja |
| --- | --- |
| Start modułu bez ważnej sesji, `Pomiń` niekliknięte | Bramka otwiera się sama po wczytaniu manifestów. |
| Kliknięcie `Pomiń` lub `Escape` | Bramka znika, w `sessionStorage` zapisuje się `audio.gateSkipped=1`. |
| Przeładowanie strony po `Pomiń` | Bramka nie wraca — `sessionStorage` przeżywa przeładowanie. |
| Nowa karta przeglądarki | Bramka wraca — `sessionStorage` jest osobny dla każdej karty. |
| Kliknięcie `Odblokuj archiwum` | Kasuje `audio.gateSkipped` i otwiera bramkę. |
| Kliknięcie pozycji `(brak w manifeście)` przy zablokowanym archiwum | `togglePlayback()` otwiera bramkę z komunikatem `accessMissingItem`. |
| Wygaśnięcie sesji w trakcie odtwarzania | `startPlayback()` otwiera bramkę z komunikatem `accessExpired`. |

Bramka jest nakładką `position: fixed` o `z-index: 9999`, więc dopóki jest otwarta, zasłania pasek narzędzi admina. To zachowanie celowe — dokładnie tak działa bramka w module `DataVault`.

### Rozdział odpowiedzialności w komunikatach błędów

Zasada: **komunikat musi wskazywać warstwę, która faktycznie zawiodła.** Wcześniej `submitAccessLitany()` miało jeden szeroki blok `try` obejmujący zarówno `fetch("/login")`, jak i `await loadManifests()`. Każdy wyjątek z wczytywania manifestów lądował w tej samej klauzuli `catch` i był raportowany jako `accessSilent`, czyli „brak połączenia z bramką dostępu, sprawdź adres w stałej AUDIO_GATE_BASE”. W efekcie awaria pliku `AudioManifest.json` kierowała diagnozę na bramkę, mimo że bramka odpowiadała bez zarzutu.

Obecny podział:

| Co zawiodło | Komunikat | Etykieta |
| --- | --- | --- |
| `fetch("/login")` rzucił wyjątek (sieć, CORS, zły adres) | „Brak połączenia z bramką dostępu…” | `accessSilent` |
| `/login` odpowiedziało `401` | „…Litania Dostępu została odrzucona.” | `accessRejected` |
| `/login` odpowiedziało innym kodem niż 200 i 401 | „Bramka odpowiedziała nieoczekiwanym kodem HTTP {status}…” | `accessLoginStatus` |
| `/manifest` odpowiedziało `401` | „Sesja wygasła…” | `accessExpired` |
| `/manifest` zwróciło `502 manifest_unavailable` | „Bramka nie znalazła manifestu archiwum (HTTP {status})…” | `accessManifestMissing` |
| `/manifest` zwróciło inny błąd | „Bramka odpowiedziała kodem HTTP {status} przy pobieraniu manifestu archiwum.” | `accessGateStatus` |
| `AudioManifest.json` nie dał się pobrać | „Nie udało się wczytać listy publicznej (HTTP {status})…” | `publicManifestMissing` |

Każdy błąd HTTP niesie swój kod aż do komunikatu (pole `detail` na obiekcie `Error`), bo to właśnie kod odróżnia „plik pod złą nazwą” od „bramka padła”.

### Niezależność warstw

`loadManifests()` opakowuje **obie** warstwy we własne bloki `try`. Awaria którejkolwiek nie przerywa wczytywania drugiej:

| Stan | Wynik |
| --- | --- |
| Warstwa publiczna padła, chroniona działa | Widać archiwum, `state.publicError` opisuje awarię, pastylka manifestu jest czerwona. |
| Warstwa chroniona padła, publiczna działa | Widać warstwę demo, `state.libraryError` opisuje awarię, pastylka archiwum jest czerwona. |
| Obie padły | `loadManifests()` rzuca wyjątek z konkretnym powodem zamiast ogólnego „brak danych”. |

Wcześniej `fetchDemoManifest()` był wywoływany bez `try`, więc jego awaria wyrzucała wyjątek z `loadManifests()` i zabierała ze sobą całą bibliotekę — łącznie z archiwum, które wczytałoby się bez problemu.

## Model SFX po parsowaniu manifestu

Po parsowaniu każdy SFX ma strukturę logiczną:

| Pole | Opis |
| --- | --- |
| `id` | Stabilizowany slug z nazwy i indeksu wiersza. |
| `label` | Nazwa dźwięku widoczna w UI. |
| `groupCount` | Liczba wariantów, jeżeli zgrupowano kilka plików. |
| `alias` | Alias z `state.aliases[item.id]`. |
| `filename` | Nazwa pliku albo pierwszy plik z licznikiem `(+N)`. |
| `folderUrl` | Źródłowa ścieżka folderu. |
| `tags` | Lista tagów wyciągnięta ze ścieżki folderu. |
| `tag2` | Drugi poziom tagów, używany jako krótki opis. |
| `tagPaths` | Ścieżki tagów do filtrowania hierarchicznego. |
| `access` | `"public"` albo `"protected"`. Decyduje, skąd bierze się adres pliku. |
| `variants` | Lista wariantów: `{ filename, url }` dla warstwy publicznej, `{ filename, path }` dla chronionej. |

## Grupowanie wariantów

Jeżeli nazwa sampla kończy się numerem, np. `Explosion 1`, `Explosion 2`, kod próbuje wyznaczyć bazową nazwę przez `getGroupingBaseLabel(...)`.

Warianty są grupowane, jeżeli:

- mają ten sam folder,
- mają tę samą nazwę bazową,
- wykryto więcej niż jeden wariant.

Dla grupowanego dźwięku `variants` zawiera wszystkie URL-e, a UI pokazuje nazwę bazową oraz licznik wariantów.

## Tagi

Tagi są wyciągane z `LinkDoFolderu` przez `extractTags(...)`.

Przetwarzanie tagów:

- normalizuje separatory `/`,
- obsługuje URL przez `new URL(...).pathname`,
- ignoruje segmenty z `TAG_IGNORE_SEGMENTS`, np. `AudioRPG`,
- usuwa fragmenty z `TAG_IGNORE_FRAGMENTS`, np. `SoundPad`, `_Siege_SoundPad`, `Patreon`,
- zamienia `_` i `-` na spacje,
- usuwa nadmiarowe białe znaki.

Z tagów budowane jest drzewo `tagTree`, a potem spłaszczona lista dla popupu filtra.

## Firebase i model ustawień

Konfiguracja Firebase znajduje się w:

```text
Audio/config/firebase-config.js
```

Plik musi ustawić:

```js
window.firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Kod używa Firestore dokumentu:

```text
audio/favorites
```

Model dokumentu:

| Pole | Typ | Opis |
| --- | --- | --- |
| `favorites` | `object` | Obiekt list ulubionych. |
| `mainView` | `object` | Obiekt widoku głównego. |
| `aliases` | `object` | Mapa aliasów per `itemId`. |
| `updatedAt` | `timestamp` | Firestore server timestamp ustawiany przy zapisie. |

## Model `favorites`

```text
{
  lists: [
    {
      id: string,
      name: string,
      itemIds: string[]
    }
  ]
}
```

Jeżeli lista ulubionych nie istnieje albo jest uszkodzona, `normalizeFavorites(...)` tworzy listę domyślną.

## Model `mainView`

```text
{
  itemIds: string[]
}
```

`itemIds` przechowuje kolejność dźwięków w widoku głównym użytkownika.

## Model `aliases`

```text
{
  "item-id": "Alias"
}
```

Alias jest przypisywany do SFX po wczytaniu ustawień przez `applyAliasesToItems()`.

Przycisk `Wyczyść wszystkie aliasy` usuwa całą mapę `aliases`, także aliasy dźwięków niewidocznych przez obecny filtr.

## LocalStorage fallback

Jeżeli `window.firebaseConfig` albo `apiKey` nie są dostępne, moduł przechodzi w tryb lokalny.

Klucz aktualny:

```text
audio.settings
```

Klucz legacy:

```text
audio.favorites
```

`loadSettingsLocal()` próbuje wczytać `audio.settings`. Jeżeli go nie ma, próbuje stary klucz `audio.favorites`. W razie błędu tworzy domyślne ustawienia.

## Odtwarzanie audio

Odtwarzanie jest zarządzane przez:

- `activePlayers`,
- `getAudioContext()`,
- `pickRandomVariant(...)`,
- `startPlayback(...)`,
- `stopPlayback(...)`,
- `togglePlayback(...)`,
- `toggleLoop(...)`.

Dźwięk jest odtwarzany przez obiekt `Audio`. Jeżeli przeglądarka obsługuje `AudioContext`, kod tworzy `MediaElementSource` i `GainNode`. Jeżeli nie, używa `audio.volume`.

### Kolejność ustawiania `crossOrigin` — pułapka dająca ciszę

Dla warstwy chronionej plik przychodzi z innej domeny niż aplikacja, a moduł podłącza go do grafu Web Audio przez `createMediaElementSource`. Specyfikacja wymaga, żeby takie media były pozyskane zgodnie z CORS. Element `<audio>` bez atrybutu `crossOrigin` zostaje „skażony” i węzeł emituje **ciszę** — bez żadnego błędu w konsoli, plik ładuje się poprawnie i pozornie gra.

Dlatego kod nie używa konstruktora `new Audio(url)`, który przypisuje `src` natychmiast:

```js
const audio = new Audio();
if (item?.access !== "public") {
  audio.crossOrigin = "anonymous";
}
audio.src = fullUrl;
```

Atrybut musi być ustawiony **przed** przypisaniem `src`. Po stronie bramki odpowiada temu nagłówek `Access-Control-Allow-Origin` z wartością `ALLOWED_ORIGIN`.

Warstwa demo leży na tym samym origin co aplikacja, więc nie potrzebuje ani atrybutu, ani nagłówka.

### Asynchroniczny start i licznik pokoleń

Adres warstwy chronionej powstaje dopiero po zapytaniu bramki, więc `startPlayback` jest funkcją asynchroniczną. Między kliknięciem a startem mija chwila, w której użytkownik może kliknąć coś innego na tym samym kafelku.

Mapa `playbackGeneration` przechowuje numer pokolenia per kafelek. Każdy start i każde `stopPlayback` numer zwiększa. Po powrocie z bramki kod porównuje swój numer z bieżącym i przerywa, jeżeli się różnią. Bez tego zabezpieczenia spóźnione żądanie mogłoby przejąć kafelek zajęty już przez inny dźwięk.

## Głośność

Suwak głośności ma zakres:

```text
-100 .. 100
```

`volumeToGain(value)` mapuje go na zakres:

```text
0 .. 2
```

W trybie WebAudio ta wartość trafia do `gainNode.gain.value`. Bez WebAudio wartość jest ograniczana do zakresu `0..1` i ustawiana jako `audio.volume`.

## Losowanie wariantów

`pickRandomVariant(item, previousUrl)` wybiera losowy URL z `item.variants`.

Jeżeli dźwięk ma więcej niż jeden wariant, funkcja próbuje uniknąć natychmiastowego powtórzenia poprzedniego URL. Po kilku próbach używa fallbacku do dowolnego innego wariantu albo do ostatnio wylosowanej wartości.

## Loop

Przycisk `Loop` jest renderowany tylko w prawdziwym widoku użytkownika bez `?admin=1`.

Zachowanie:

- kliknięcie `Loop` uruchamia dźwięk od razu w trybie pętli,
- po zdarzeniu `ended` startuje kolejny losowy wariant,
- ponowne kliknięcie aktywnego `Loop` zatrzymuje pętlę,
- jeżeli trwa zwykłe odtwarzanie, kliknięcie `Loop` przełącza je w tryb pętli.

Aktywny stan pętli jest oznaczany klasą `is-looping` i `aria-pressed="true"`.

## Renderowanie widoków

`renderAllViews()` odświeża:

- statusy,
- panel filtrów tagów,
- widoczność panelu tagów,
- listę SFX admina,
- listy ulubionych admina,
- widok główny admina,
- widok główny użytkownika,
- listy ulubionych użytkownika,
- nawigację użytkownika,
- aktywne przyciski nawigacji,
- popup tagów, jeżeli jest otwarty.

## i18n

`translations` zawiera języki:

- `pl`,
- `en`.

`applyLanguage(lang)` aktualizuje:

- `document.documentElement.lang`,
- selecty języka admina i użytkownika,
- tytuły,
- opisy,
- placeholdery,
- przyciski,
- statusy,
- puste stany,
- widoki renderowane dynamicznie.

Przełącznik języka użytkownika jest obecnie ukryty klasą `language-switcher--hidden`.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Brak `window.firebaseConfig` albo `apiKey` | Moduł używa `localStorage` i pokazuje status lokalnych ustawień. |
| Brak dokumentu Firestore | Kod tworzy domyślne ustawienia i zapisuje je przez `saveSettings()`. |
| Uszkodzone ustawienia Firestore/localStorage | Normalizatory tworzą bezpieczne wartości domyślne. |
| Brak `AudioManifest.json` | `state.publicError` dostaje komunikat z kodem HTTP, pastylka manifestu przechodzi w stan błędu, a warstwa chroniona wczytuje się mimo to. |
| Bramka niedostępna przy ważnej sesji | Warstwa demo ładuje się mimo to; archiwum pozostaje zablokowane. |
| `401` z bramki | Sesja jest kasowana, pojawia się nakładka z komunikatem o nieukończonym Rytuale. |
| Wyjątek z SDK Firebase | Moduł przechodzi na ustawienia lokalne i **kontynuuje** wczytywanie manifestów. |
| Pusty manifest | Pokazywany jest błąd braku danych manifestu. |
| Brak URL audio | Próba odtworzenia pokazuje alert o brakującym linku. |
| Brak WebAudio | Moduł używa `audio.volume`. |
| Brak wyników tagów | Pokazywany jest pusty stan filtra tagów. |
| Brak wyników SFX | Pokazywany jest pusty stan listy SFX. |
| Dźwięk z listy nie istnieje w manifeście | UI pokazuje tekst `(brak w manifeście)`. |

## Procedura odtworzenia modułu

1. Zachowaj `Audio/index.html`, `Audio/AudioManifest.json` oraz `Audio/worker/audio-gate.js`.
2. Zachowaj `../shared/access-gate.css`.
3. Zachowaj arkusz źródłowy `AudioManifest.xlsx` **poza tym repozytorium** i wygeneruj z niego oba manifesty przyciskiem `Zbuduj manifesty z XLSX` w widoku admina.
4. Wgraj `audio-manifest.json` do katalogu głównego prywatnego repozytorium `AudioRPG`.
5. Wdroż `Audio/worker/audio-gate.js` jako Worker `audio-gate` i ustaw cztery zmienne środowiskowe.
6. Wpisz adres Workera do stałej `AUDIO_GATE_BASE` w `index.html`.
7. Zachowaj `Audio/config/firebase-config.js`, jeżeli ustawienia mają synchronizować się przez Firebase.
8. Skonfiguruj Firestore zgodnie z `Audio/config/FirebaseREADME.md`.
9. Otwórz `Audio/index.html?admin=1`.
10. Sprawdź wczytanie manifestu demo, a po Rytuale Dostępu — całej biblioteki.
7. Dodaj kilka dźwięków do widoku głównego.
8. Utwórz listę ulubionych i dodaj do niej dźwięki.
9. Nadaj alias wybranemu SFX.
10. Otwórz `Audio/index.html`.
11. Sprawdź widok główny, nawigację, listy i odtwarzanie.
12. Sprawdź tryb lokalny przez usunięcie albo wyłączenie konfiguracji Firebase.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start admina | Otwórz `Audio/index.html?admin=1`. | Widać nagłówek, statusy, toolbar, panel tagów, listę SFX, ulubione i widok główny. |
| Start użytkownika | Otwórz `Audio/index.html`. | Widać tylko widok użytkownika i nawigację. |
| Manifest | Kliknij `Wczytaj manifest`. | Status pokazuje liczbę pozycji z manifestu. |
| Start bez logowania | Otwórz moduł bez ważnej sesji. | Bramka otwiera się sama, z przyciskami `Pomiń` i `Rozpocznij Rytuał`. |
| Pominięcie bramki | Kliknij `Pomiń`. | Nakładka znika, widać wyłącznie warstwę demo, status: `Archiwum: zablokowane` (pastylka zielona). |
| Trwałość pominięcia | Po `Pomiń` przeładuj stronę. | Bramka nie wraca. W nowej karcie przeglądarki wraca. |
| Puste hasło | Kliknij `Rozpocznij Rytuał` z pustym polem. | Komunikat o niewypowiedzianej Litanii Dostępu. |
| Złe hasło | Wpisz błędne hasło. | Komunikat o odrzuconej Litanii Dostępu. |
| Poprawne hasło | Wpisz hasło grupy. | Nakładka znika, lista uzupełnia się o archiwum, status: `Archiwum: odblokowane`. |
| Znikający przycisk | Odblokuj archiwum. | Przycisk `Odblokuj archiwum` znika. Nigdzie nie ma przycisku blokowania. |
| Trwałość sesji | Przeładuj stronę po odblokowaniu. | Archiwum nadal odblokowane, bez pytania o hasło. Zapisana sesja nie ma pola `exp`. |
| Kafelek spoza manifestu | Przy zablokowanym archiwum kliknij pozycję `(brak w manifeście)`. | Bramka otwiera się z komunikatem `Ten dźwięk nie należy do warstwy publicznej…`. |
| Nieosiągalny manifest archiwum | Podaj poprawne hasło, gdy bramka nie widzi `audio-manifest.json`. | Nakładka zostaje otwarta z kodem HTTP, status: `Archiwum: błąd wczytywania` (pastylka czerwona). |
| Nieosiągalna lista publiczna | Podaj poprawne hasło, gdy `AudioManifest.json` zwraca 404. | Komunikat mówi o **liście publicznej** i podpowiada `Ctrl+F5`; **nie** wspomina o bramce ani o `AUDIO_GATE_BASE`. Archiwum wczytuje się mimo to. |
| Bramka odpowiada 500 przy logowaniu | Zasymuluj kod 500 na `/login`. | Komunikat podaje kod HTTP i mówi, że bramka działa, ale odrzuciła logowanie. |
| Generator: poprawny arkusz | W adminie kliknij `Zbuduj manifesty z XLSX` i wskaż `AudioManifest.xlsx`. | Przeglądarka zapisuje `AudioManifest.json` i `audio-manifest.json`, pastylka pokazuje liczby pozycji. |
| Generator: brak kolumny | Wskaż arkusz bez kolumny `LinkDoFolderu`. | Komunikat `Brak wymaganych kolumn: LinkDoFolderu`, żaden plik nie powstaje, pastylka czerwona. |
| Generator: duplikat kolumny | Wskaż arkusz z dwiema kolumnami `NazwaSampla`. | Komunikat o kolumnie występującej więcej niż raz, żaden plik nie powstaje. |
| Generator: kolumny nadmiarowe | Wskaż arkusz z dodatkowymi kolumnami i inną ich kolejnością. | Manifesty powstają poprawnie, kolumny nadmiarowe są pominięte. |
| Generator: stabilność `id` | Zbuduj manifesty z niezmienionego arkusza. | Pliki są identyczne z tymi w repozytorium — zapisane listy ulubionych nadal wskazują te same dźwięki. |
| Dźwięk chroniony | Odtwórz pozycję z archiwum. | Moduł pobiera podpis z `/sign`, dźwięk gra, suwak głośności działa. |
| Awaria Firebase | Zablokuj dostęp do Firestore. | Moduł przechodzi na ustawienia lokalne, ale manifesty i tak się wczytują. |
| Filtr SFX | Wpisz frazę w `searchInput`. | Lista SFX admina jest filtrowana. |
| Filtr tagów | Odznacz tag. | Lista SFX admina ukrywa dźwięki z tym tagiem. |
| Popup tagów | Kliknij `Filtruj ▾`. | Otwiera się popup z wyszukiwarką i checkboxami. |
| Widok główny | Dodaj SFX do `Widok Główny`. | Pozycja pojawia się w panelu widoku głównego i w widoku użytkownika. |
| Lista ulubionych | Utwórz listę i dodaj SFX. | Lista pojawia się w adminie i w nawigacji użytkownika. |
| Alias | Wpisz alias i opuść pole. | Alias pojawia się przy nazwie SFX. |
| Wyczyść alias | Kliknij `Wyczyść`. | Alias danego SFX znika. |
| Wyczyść wszystkie aliasy | Kliknij `Wyczyść wszystkie aliasy` i potwierdź. | Cała mapa aliasów zostaje usunięta. |
| Odtwarzanie | Kliknij nazwę albo `Odtwórz`. | Dźwięk startuje, a karta dostaje stan odtwarzania. |
| Zatrzymanie | Kliknij ponownie aktywny dźwięk. | Dźwięk zostaje zatrzymany. |
| Głośność | Przesuń suwak. | Zmienia się gain lub volume danego odtwarzacza. |
| Loop | W widoku użytkownika kliknij `Loop`. | Dźwięk gra w pętli z losowaniem wariantów. |
| Firestore | Skonfiguruj Firebase i zmień listy. | Dokument `audio/favorites` zapisuje `favorites`, `mainView` i `aliases`. |
| LocalStorage | Usuń konfigurację Firebase i zmień listy. | Ustawienia zapisują się w `audio.settings`. |

---

# 🇬🇧 Technical documentation — Audio (EN)

## Module purpose

`Audio` is a browser-based panel for playing sound effects and managing sound lists used during play.

The module allows the user to:

- load the SFX manifest from two tiers: public and gated behind the access gateway,
- group variants of the same sound,
- filter sounds by tags derived from folder paths,
- add sounds to the main view,
- create favorite lists,
- assign SFX aliases,
- synchronize configuration through Firestore,
- work locally through `localStorage` when Firebase is not configured,
- play sounds once or loop them in user view.

The module is a single HTML page with embedded CSS and module JavaScript.

## Entry points

| File | Role |
| --- | --- |
| `Audio/index.html` | User view. Shows only the prepared main view and favorite lists. |
| `Audio/index.html?admin=1` | Admin view. Shows manifest management, filters, lists, aliases, and user-view preview. |

Admin mode is detected through the URL parameter:

```text
?admin=1
```

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `Audio/index.html` | Full application: HTML, CSS, JS, Firebase config import, and Firebase module imports. |
| `Audio/AudioManifest.json` | Public (demo) tier manifest with ready URLs to intentionally public files. |
| `Audio/worker/audio-gate.js` | Access gateway source (Cloudflare Worker) serving the protected manifest and signed file URLs. |
| `Audio/config/firebase-config.js` | Firebase configuration for Audio settings. |
| `../shared/access-gate.css` | Shared access-gate stylesheet, the same one used by `DataVault` and `GeneratorNPC`. |
| `Audio/config/firebase-config.template.js` | Firebase configuration template. |
| `Audio/config/FirebaseREADME.md` | Firebase setup guide for Audio. |
| `Audio/docs/README.md` | User guide. |
| `Audio/docs/Documentation.md` | This technical documentation. |

## External dependencies

`Audio/index.html` loads:

- Google Fonts `Fira Code`,
- `../shared/access-gate.css`,
- `config/firebase-config.js`,
- Firebase modular SDK `12.6.0`:
  - `firebase-app.js`,
  - `firebase-firestore.js`.

## View modes

### User view

View without `?admin=1`:

- removes `admin-only` elements,
- shows only the user interface,
- shows navigation for main view and favorite lists,
- allows playback from cards,
- shows volume sliders,
- renders the `Loop` button.

### Admin view

View with `?admin=1`:

- removes `user-only` elements,
- shows header, statuses, and toolbar,
- shows tag filter panel,
- shows all SFX from the manifest,
- allows adding sounds to the main view or favorite lists,
- allows creating, renaming, deleting, and reordering favorite lists,
- allows reordering the main view,
- shows user view preview,
- does not render `Loop` in the admin preview.

## Main UI sections

### Admin header

Admin header contains:

- title,
- subtitle,
- language switcher `languageSelect`,
- manifest status `manifestStatus`,
- Firebase status `firebaseStatus`,
- favorites status `favoritesStatus`.

### Admin toolbar

Toolbar contains:

- `reloadManifest` — reloads both manifests,
- `unlockLibrary` — opens the access gate; the button is hidden (`hidden`) once `state.libraryUnlocked` is true,
- `buildManifests` — the XLSX manifest builder (admin view only),
- `addList` — creates a new favorite list,
- `refreshFavorites` — manually refreshes favorite views.

### Tag filter panel

Tag panel contains:

- `toggleTagPanel` — collapses or expands the panel,
- `tagSearchInput` — tag search field,
- `tagFilterMenuButton` — opens filter popup,
- `tagFilter` — checkbox tag tree,
- `tagFilterMenu` — popup with search, checkboxes, and bulk actions,
- `tagMenuSelectAll` — selects all visible tags,
- `tagMenuClearAll` — clears all visible tags.

Tag filters affect only the admin SFX list. They do not change the user main view or favorite lists.

### Admin SFX list

Admin SFX list uses `samplesGrid`.

Each card shows:

- SFX name,
- alias in parentheses when present,
- grouped variant count when the sound has multiple variants,
- `tag2`, the second tag level,
- filename or first filename with variant counter,
- alias input,
- clear alias button,
- play button,
- target list select,
- add-to-list button.

### Admin favorites panel

`favoritesPanel` shows favorite lists.

For lists, the admin can:

- move the list up or down,
- rename the list,
- delete the list,
- play a sound from the list,
- move an item up or down,
- remove an item from the list.

### Admin main view panel

`mainViewPanel` shows the order of sounds in the main view.

For items, the admin can:

- play sound by clicking name or tag,
- set volume with a slider,
- move item up or down,
- remove item from the main view.

### User view

User view contains:

- `userMainView` — current main view,
- `userFavoritesView` — active favorite list,
- `userNav` — navigation between main view and lists,
- `languageSelectUser` — language switcher, currently hidden with `language-switcher--hidden`.

## Application state

Main `state` object contains:

| Field | Type | Description |
| --- | --- | --- |
| `items` | `array` | SFX list after manifest parsing. |
| `itemsById` | `Map` | SFX map by `id`. |
| `favorites` | `object` | Favorite lists. |
| `mainView` | `object` | Main view ID list. |
| `aliases` | `object` | Alias per `itemId`. |
| `firestore` | `object|null` | Firestore instance when Firebase works. |
| `favoritesDoc` | `object|null` | Reference to `audio/favorites`. |
| `usingFirestore` | `boolean` | Whether Firestore synchronization is active. |
| `manifestReady` | `boolean` | Whether manifest loaded successfully. |
| `session` | `object\|null` | Gateway token. `exp` is `null` for an unlimited token. |
| `libraryUnlocked` | `boolean` | Whether the protected tier is loaded. |
| `libraryError` | `string\|null` | Why the protected tier failed to load. |
| `publicError` | `string\|null` | Why the public tier failed to load. |
| `builder` | `object` | Manifest builder state: `{ status, publicCount, protectedCount, message }`. `status` is `idle`, `working`, `ready` or `error`. |
| `userView` | `string` | Current user view: `main` or list. |
| `activeFavoritesListId` | `string|null` | Active favorite list in user view. |
| `tagTree` | `array` | Tag tree built from manifest. |
| `tagSelection` | `Map` | Tag selections. |
| `tagPanelVisible` | `boolean` | Whether tag panel is expanded. |
| `tagMenuOpen` | `boolean` | Whether tag popup is open. |
| `tagMenuSearchTerm` | `string` | Tag popup search phrase. |

Active players are stored outside `state` in:

```text
activePlayers: Map
```

## Two library tiers

The library is split into two tiers with different access modes. Part of the material is free and intentionally public; the rest is copyright-protected.

| Tier | `access` | Manifest source | File source | Login |
| --- | --- | --- | --- | --- |
| Public (demo) | `"public"` | `AudioManifest.json` in this repository | public `AudioExample` repository on GitHub Pages | no |
| Protected (archive) | `"protected"` | gateway `/manifest` endpoint | private `AudioRPG` repository through the gateway | yes |

Both lists are merged in `loadManifests()` and sorted together by `label`, so the user sees a single list.

### Why a gateway is needed

GitHub Pages only knows two states: a public repository, meaning files readable by anyone, or a private one, meaning no published site and files readable by nobody. There is no state in between — not even on paid plans, because Pages access control exists only in GitHub Enterprise Cloud.

The gateway adds the missing third state: the `AudioRPG` repository stays private permanently and the only way into the files is a Worker that checks authorisation.

## Manifests

### `AudioManifest.json`

The public tier manifest, always loaded:

```js
fetch(PUBLIC_MANIFEST_URL, { cache: "no-store" })
```

Structure:

```text
{
  version: 1,
  access: "public",
  items: [
    {
      id, label, groupCount, filename, access: "public",
      tags: [], tag2, tagPaths: [],
      variants: [ { filename, url } ]
    }
  ]
}
```

### Protected tier manifest

Fetched from the gateway only with a valid session:

```js
fetch(`${AUDIO_GATE_BASE}/manifest`, {
  headers: { Authorization: `Bearer ${state.session.token}` }
})
```

Same structure with two differences: `access` is `"protected"`, and variants carry `path` (a path relative to the `AudioRPG` repository) instead of `url`. The final URL is produced only after the gateway signs it.

### Generating the manifests

Both files are produced from the source spreadsheet `AudioManifest.xlsx`, which is **not part of this repository** — it belongs in the private repository because it lists the whole protected catalogue. A `.gitignore` entry blocks it from being added by accident.

The builder runs **in the browser, in the admin panel**, behind the `buildManifests` button. The flow matches the data update in the `DataVault` module: an `<input type="file">` created on the fly, a local conversion, and two downloads through `Blob` and `URL.createObjectURL`.

The key design decision: the builder is not a separate script but part of `index.html`, and it **uses the very same `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment` and `normalizeUrl` functions the rest of the module uses**. The `id` is a slug of the label, and favourite lists, the main view and aliases in Firestore all store `id`. The earlier Node generator (`Audio/tools/build-manifests.mjs`) held copies of those functions and could drift from the module, which would break the link between saved lists and their sounds. It was removed for exactly that reason — one source of id logic instead of two.

Step by step:

1. `pickLocalWorkbookFile()` — creates a hidden `<input type="file" accept=".xlsx">` and returns an `ArrayBuffer`. Returns `null` when the user cancels (both a `change` with no file and the `cancel` event).
2. `ensureJSZip()` — loads JSZip from `cdn.jsdelivr.net` on first use. The library never loads in the user view. A failed attempt resets `jsZipPromise` so a later click can retry.
3. `readXlsxSheet()` — a minimal XLSX reader: it unpacks `xl/sharedStrings.xml`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels` and the sheet named by the first `<sheet>` relationship. It handles cell types `s` (shared string), `inlineStr` and raw values. It returns `{ header, rows }` as positional arrays, **without collapsing columns by name** — a prerequisite for detecting duplicate headers.
4. `resolveRequiredColumns()` — header validation.
5. `buildManifestItems()` — variant grouping, identical to the manifest logic.
6. `downloadJsonFile()` — writes the file; the second download is delayed by 150 ms because some browsers drop two downloads started in the same instant.

#### Header validation

Required columns: `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu` (the `BUILDER_REQUIRED_COLUMNS` constant).

| Situation | Behaviour |
| --- | --- |
| Any required column absent | Error `builder_missing_columns`, the message names the missing columns. No file is produced. |
| A required column present more than once | Error `builder_duplicate_columns`. The builder deliberately refuses to guess which column to use. |
| Columns outside the required list | Ignored. Only the three indices returned by `resolveRequiredColumns()` are read. |
| Any column order | Supported — binding goes by header name, not position. |
| Sheet holds only a header | Error `builder_no_rows`. |
| Protected variant without a path under `/AudioRPG/` | Error `builder_no_paths` with the variant count. Prevents shipping a manifest with unplayable entries. |

Every error sets `state.builder.status = "error"`, turns the `builderStatus` pill red and shows an `alert()` with the full text. **No file is written on error.**

#### Tier split

The address in the `LinkDoFolderu` column decides:

- contains `/AudioExample/` (the `BUILDER_PUBLIC_PREFIX` constant) → `access: "public"`, the variant gets a `url`,
- otherwise → `access: "protected"`, the variant gets a `path` produced by cutting everything up to and including `/AudioRPG/`, then `decodeURIComponent`.

The builder produces:

- `AudioManifest.json` (indented, readable in a diff) → into the `Audio` folder of this repository,
- `audio-manifest.json` (unindented, smaller transfer through the gateway) → into the root of the private `AudioRPG` repository.

#### Id stability and row order

An `id` is a slug of the label. On a collision — the same label in a different folder — the **spreadsheet row number** is appended to the slug (`${id}-${entry.rowIndex}`). In the current spreadsheet this affects 133 entries.

The consequence is practical and easy to miss: **inserting a row in the middle of the spreadsheet shifts the `rowIndex` of every row below it, and therefore changes every collision id below the insertion point.** Saved favourite lists, the main view and aliases then stop pointing at those sounds.

Measured on the real spreadsheet (1793 rows):

| Operation | Identifiers changed |
| --- | --- |
| Appending a row at the end | 0 |
| Inserting the same row in the middle | 123 |

This is why `README.md` instructs the user to append new rows only at the end. Should this constraint ever need lifting, the collision suffix would have to be derived from something independent of row position — the folder path, for instance.

## Access gateway (Cloudflare Worker)

Source: `Audio/worker/audio-gate.js`. Deployment: Worker `audio-gate` on the Cloudflare account.

### Environment variables

| Name | Type | Contents |
| --- | --- | --- |
| `GROUP_PASSWORD` | Secret | Group password, the Litany of Access. |
| `SIGNING_KEY` | Secret | HMAC key signing session tokens and file URLs. |
| `GITHUB_TOKEN` | Secret | Fine-grained PAT: `AudioRPG` repository only, `Contents: Read-only`. |
| `ALLOWED_ORIGIN` | Text | `https://cutelittlegoat.github.io` |

Secrets must never enter the repository. Set them in the Cloudflare dashboard or with `npx wrangler secret put`.

### Endpoints

| Endpoint | Method | Authorisation | Behaviour |
| --- | --- | --- | --- |
| `/health` | GET | none | Reports which variables are set. For diagnostics. |
| `/login` | POST | none | Takes `{ password }`, compares in constant time, returns `{ token, exp }`. |
| `/manifest` | GET | Bearer | Passes through `audio-manifest.json` from the private repository. |
| `/sign` | GET | Bearer | For `?p=<path>` returns `{ url, exp }` — a signed file URL. |
| `/a` | GET | URL signature | Verifies signature and expiry, then serves the file with CORS headers. |

### Session token

Format: `base64url(JSON) + "." + base64url(HMAC-SHA256)`. The payload holds only `iat` — an issue-time marker that is never verified. No database is needed; the signature alone is enough.

**The session never expires**, exactly like in the `DataVault` module. The token carries no `exp` field and `/login` returns `exp: null`. The token is stored in `localStorage` under `audio.session` and lives until the browser data is cleared. The only way to invalidate every session at once is rotating the `SIGNING_KEY` secret in the Worker.

Backwards compatibility: tokens issued before this change carry an `exp` field with a 30-day lifetime. `verifySessionToken()` still honours their expiry — an old token expires on its original schedule instead of being silently extended forever. Once it expires, the user enters the password once and receives an unlimited token.

### URL signing

The signature is `HMAC-SHA256(SIGNING_KEY, "<path>|<exp>")` in base64url. The URL has the form:

```text
/a?p=<path>&e=<exp>&s=<signature>
```

Expiry is aligned to a full hour:

```js
exp = (Math.floor(now / 3600) + 2) * 3600
```

This yields a lifetime of one to two hours, but more importantly it makes the URL **identical within a single clock hour**. Without the alignment every signature would create a new URL and the browser would re-download the same file on every playback — expensive for files in the tens of megabytes.

### Why authorisation lives in the URL rather than a cookie

An earlier attempt based on Cloudflare Access asked for the password on every playback. The cause: the `CF_Authorization` cookie is a third-party cookie on cross-origin requests and browsers block it, so every file request ended in a redirect to the login page.

An `<audio>` element cannot carry custom headers, so file authorisation travels in the query string of a signed URL. There is no cookie, no `WWW-Authenticate` header, nothing for the browser to block or prompt about.

### Constraints and safeguards

- Paths are validated by `isSafeAudioPath`: `..`, absolute paths, `\\`, `//` and extensions other than `.ogg` and `.mp3` are rejected.
- Secret comparisons use `timingSafeEqual` so response timing does not leak the value.
- The manifest is passed through **without parsing**. The Worker has 10 ms of CPU per request and parsing half a megabyte of JSON would burn that budget.
- The manifest and files are cached in the Cache API: the manifest for 5 minutes, files for a year, because the URL expires anyway.
- `Range` requests are supported, which the player needs when seeking.

## Session and gateway on the module side

| Element | Role |
| --- | --- |
| `AUDIO_GATE_BASE` | Gateway address. The place to change when the Worker moves. |
| `AUDIO_SESSION_STORAGE_KEY` | The `audio.session` key in `localStorage`. |
| `AUDIO_GATE_SKIPPED_KEY` | The `audio.gateSkipped` key in `sessionStorage`. Remembers a `Skip` click for the lifetime of one browser tab. |
| `loadSession()` / `storeSession()` | Reading and writing the token in `localStorage`. |
| `isSessionUsable(session)` / `hasValidSession()` | A session is valid when it has a token and either no `exp` (unlimited token) or an `exp` in the future (legacy 30-day token). |
| `signedUrlCache` | Map of `path → { url, exp }`. Limits the number of `/sign` calls. |
| `requestSignedUrl(path)` | Fetches a signature; on `401` clears the session and throws `gate_unauthorized`. |
| `resolveVariantUrl(item, variant)` | Returns the final URL: from the manifest for `public`, from the gateway for `protected`. |
| `showAccessGate()` / `hideAccessGate()` | Shows and hides the `#accessGate` overlay via the `hidden` attribute. |
| `submitAccessLitany()` | Exchanges the password for a token, then reloads the manifests. It has **two disjoint `try` blocks**: the first covers only the `/login` request, the second only `loadManifests()`. On `state.libraryError` or `state.publicError` the overlay stays open showing the reason. |
| `maybeShowAccessGate()` | Opens the gate after start-up when there is no valid session and `Skip` was not clicked. Called from `.finally()` after `loadManifests()`. |
| `isGateSkipped()` / `markGateSkipped()` / `skipAccessGate()` | Handling of the `Skip` button and the `Escape` key. |
| `handleUnlockClick(message)` | Clears the skip marker and opens the gate, optionally with a custom message. |

There is no archive-locking function. The lock button was removed as redundant: an unlocked archive is the target state, and access on a device is cleared by clearing the site data.

### Gate behaviour

| Event | Reaction |
| --- | --- |
| Module start without a valid session, `Skip` not clicked | The gate opens by itself once the manifests have loaded. |
| `Skip` clicked or `Escape` pressed | The gate closes and `audio.gateSkipped=1` is written to `sessionStorage`. |
| Page reload after `Skip` | The gate does not return — `sessionStorage` survives a reload. |
| New browser tab | The gate returns — `sessionStorage` is per-tab. |
| `Unlock archive` clicked | Clears `audio.gateSkipped` and opens the gate. |
| A `(missing in manifest)` entry clicked while the archive is locked | `togglePlayback()` opens the gate with the `accessMissingItem` message. |
| Session dies during playback | `startPlayback()` opens the gate with the `accessExpired` message. |

The gate is a `position: fixed` overlay at `z-index: 9999`, so while it is open it covers the admin toolbar. That is deliberate — it is exactly how the gate behaves in the `DataVault` module.

### Separation of concerns in error messages

The rule: **a message must name the layer that actually failed.** `submitAccessLitany()` used to have a single wide `try` block covering both `fetch("/login")` and `await loadManifests()`. Any exception from manifest loading landed in that same `catch` clause and was reported as `accessSilent` — "cannot reach the access gateway, check the AUDIO_GATE_BASE constant". A failure of `AudioManifest.json` therefore pointed the diagnosis at the gateway even though the gateway was answering perfectly.

The current split:

| What failed | Message | Label |
| --- | --- | --- |
| `fetch("/login")` threw (network, CORS, wrong address) | "Cannot reach the access gateway…" | `accessSilent` |
| `/login` answered `401` | "…the Litany of Access was rejected." | `accessRejected` |
| `/login` answered with a status other than 200 and 401 | "The gateway answered with an unexpected HTTP {status}…" | `accessLoginStatus` |
| `/manifest` answered `401` | "Session expired…" | `accessExpired` |
| `/manifest` returned `502 manifest_unavailable` | "The gateway could not find the archive manifest (HTTP {status})…" | `accessManifestMissing` |
| `/manifest` returned another error | "The gateway answered with HTTP {status} while fetching the archive manifest." | `accessGateStatus` |
| `AudioManifest.json` could not be fetched | "Could not load the public list (HTTP {status})…" | `publicManifestMissing` |

Every HTTP error carries its status all the way into the message (the `detail` field on the `Error` object), because the status is precisely what separates "file under the wrong name" from "the gateway is down".

### Tier independence

`loadManifests()` wraps **both** tiers in their own `try` blocks. A failure of either does not interrupt loading the other:

| State | Result |
| --- | --- |
| Public tier failed, protected tier fine | The archive shows, `state.publicError` describes the failure, the manifest pill turns red. |
| Protected tier failed, public tier fine | The demo tier shows, `state.libraryError` describes the failure, the archive pill turns red. |
| Both failed | `loadManifests()` throws with the specific reason rather than a generic "no data". |

Previously `fetchDemoManifest()` was called without a `try`, so its failure threw out of `loadManifests()` and took the whole library down with it — including the archive, which would have loaded fine.

## SFX model after manifest parsing

After parsing, each SFX has this logical structure:

| Field | Description |
| --- | --- |
| `id` | Stabilized slug from name and row index. |
| `label` | Sound name visible in UI. |
| `groupCount` | Variant count when several files were grouped. |
| `alias` | Alias from `state.aliases[item.id]`. |
| `filename` | Filename or first filename with `(+N)` counter. |
| `folderUrl` | Source folder path. |
| `tags` | Tag list extracted from folder path. |
| `tag2` | Second tag level used as short description. |
| `tagPaths` | Tag paths used for hierarchical filtering. |
| `access` | `"public"` or `"protected"`. Decides where the file URL comes from. |
| `variants` | Variant list: `{ filename, url }` for the public tier, `{ filename, path }` for the protected one. |

## Variant grouping

If sample name ends with a number, for example `Explosion 1`, `Explosion 2`, the code tries to get a base name through `getGroupingBaseLabel(...)`.

Variants are grouped when:

- they have the same folder,
- they have the same base name,
- more than one variant was detected.

For a grouped sound, `variants` stores all URLs and UI shows base name plus variant count.

## Tags

Tags are extracted from `LinkDoFolderu` by `extractTags(...)`.

Tag processing:

- normalizes `/` separators,
- supports URLs through `new URL(...).pathname`,
- ignores segments from `TAG_IGNORE_SEGMENTS`, such as `AudioRPG`,
- removes fragments from `TAG_IGNORE_FRAGMENTS`, such as `SoundPad`, `_Siege_SoundPad`, `Patreon`,
- converts `_` and `-` to spaces,
- removes extra whitespace.

Tags are used to build `tagTree`, then a flattened list for the filter popup.

## Firebase and settings model

Firebase configuration is stored in:

```text
Audio/config/firebase-config.js
```

The file must define:

```js
window.firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

The code uses Firestore document:

```text
audio/favorites
```

Document model:

| Field | Type | Description |
| --- | --- | --- |
| `favorites` | `object` | Favorite lists object. |
| `mainView` | `object` | Main view object. |
| `aliases` | `object` | Alias map per `itemId`. |
| `updatedAt` | `timestamp` | Firestore server timestamp set on save. |

## `favorites` model

```text
{
  lists: [
    {
      id: string,
      name: string,
      itemIds: string[]
    }
  ]
}
```

If favorite lists are missing or invalid, `normalizeFavorites(...)` creates a default list.

## `mainView` model

```text
{
  itemIds: string[]
}
```

`itemIds` stores order of sounds in the user main view.

## `aliases` model

```text
{
  "item-id": "Alias"
}
```

Alias is assigned to SFX after settings load by `applyAliasesToItems()`.

`Clear all aliases` removes the whole `aliases` map, including aliases for sounds hidden by current filters.

## LocalStorage fallback

If `window.firebaseConfig` or `apiKey` are not available, the module switches to local mode.

Current key:

```text
audio.settings
```

Legacy key:

```text
audio.favorites
```

`loadSettingsLocal()` tries `audio.settings`. If missing, it tries old key `audio.favorites`. On error it creates default settings.

## Audio playback

Playback is managed by:

- `activePlayers`,
- `getAudioContext()`,
- `pickRandomVariant(...)`,
- `startPlayback(...)`,
- `stopPlayback(...)`,
- `togglePlayback(...)`,
- `toggleLoop(...)`.

Sound is played through an `Audio` object. If the browser supports `AudioContext`, the code creates `MediaElementSource` and `GainNode`. Otherwise it uses `audio.volume`.

### `crossOrigin` ordering — the trap that produces silence

For the protected tier the file arrives from a different origin than the application, and the module wires it into the Web Audio graph via `createMediaElementSource`. The specification requires such media to be CORS-obtained. An `<audio>` element without the `crossOrigin` attribute becomes tainted and the node emits **silence** — with no console error, the file loads fine and appears to play.

That is why the code avoids the `new Audio(url)` constructor, which assigns `src` immediately:

```js
const audio = new Audio();
if (item?.access !== "public") {
  audio.crossOrigin = "anonymous";
}
audio.src = fullUrl;
```

The attribute must be set **before** `src` is assigned. On the gateway side this is matched by the `Access-Control-Allow-Origin` header carrying `ALLOWED_ORIGIN`.

The demo tier sits on the same origin as the application, so it needs neither the attribute nor the header.

### Asynchronous start and the generation counter

A protected URL exists only after the gateway is asked, so `startPlayback` is asynchronous. A moment passes between the click and the start, during which the user may click something else on the same tile.

The `playbackGeneration` map holds a generation number per tile. Every start and every `stopPlayback` increments it. After returning from the gateway the code compares its own number with the current one and bails out if they differ. Without this guard a late request could hijack a tile already taken by another sound.

## Volume

Volume slider range:

```text
-100 .. 100
```

`volumeToGain(value)` maps it to:

```text
0 .. 2
```

In WebAudio mode this value is assigned to `gainNode.gain.value`. Without WebAudio, it is clamped to `0..1` and assigned as `audio.volume`.

## Variant randomization

`pickRandomVariant(item, previousUrl)` selects a random URL from `item.variants`.

If a sound has more than one variant, the function tries to avoid immediately repeating the previous URL. After several attempts it falls back to any other variant or the last selected value.

## Loop

`Loop` button is rendered only in real user view without `?admin=1`.

Behavior:

- clicking `Loop` starts sound immediately in loop mode,
- after `ended`, another random variant starts,
- clicking active `Loop` again stops the loop,
- if normal playback is active, clicking `Loop` converts it into loop mode.

Active loop state is marked with class `is-looping` and `aria-pressed="true"`.

## View rendering

`renderAllViews()` refreshes:

- statuses,
- tag filter panel,
- tag panel visibility,
- admin SFX list,
- admin favorites lists,
- admin main view,
- user main view,
- user favorite lists,
- user navigation,
- active navigation buttons,
- tag popup when open.

## i18n

`translations` contains languages:

- `pl`,
- `en`.

`applyLanguage(lang)` updates:

- `document.documentElement.lang`,
- admin and user language selects,
- titles,
- subtitles,
- placeholders,
- buttons,
- statuses,
- empty states,
- dynamically rendered views.

User language switcher is currently hidden with `language-switcher--hidden`.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Missing `window.firebaseConfig` or `apiKey` | Module uses `localStorage` and displays local settings status. |
| Missing Firestore document | Code creates default settings and saves them through `saveSettings()`. |
| Damaged Firestore/localStorage settings | Normalizers create safe defaults. |
| Missing `AudioManifest.json` | `state.publicError` receives a message carrying the HTTP status, the manifest pill switches to its error state, and the protected tier still loads. |
| Gateway unreachable with a valid session | The demo tier still loads; the archive stays locked. |
| `401` from the gateway | The session is cleared and the overlay appears with the incomplete-Rite message. |
| Exception from the Firebase SDK | The module falls back to local settings and **continues** loading the manifests. |
| Empty manifest | No-data manifest error is shown. |
| Missing audio URL | Playback attempt shows missing-link alert. |
| No WebAudio | Module uses `audio.volume`. |
| No tag results | Tag filter empty state is shown. |
| No SFX results | SFX list empty state is shown. |
| Sound from a list does not exist in manifest | UI displays `(missing in manifest)`. |

## Module recreation procedure

1. Preserve `Audio/index.html`, `Audio/AudioManifest.json` and `Audio/worker/audio-gate.js`.
2. Preserve `../shared/access-gate.css`.
3. Keep the source spreadsheet `AudioManifest.xlsx` **outside this repository** and regenerate both manifests from it with the generator.
4. Upload `audio-manifest.json` to the root of the private `AudioRPG` repository.
5. Deploy `Audio/worker/audio-gate.js` as the `audio-gate` Worker and set the four environment variables.
6. Put the Worker address into the `AUDIO_GATE_BASE` constant in `index.html`.
7. Preserve `Audio/config/firebase-config.js` if settings should sync through Firebase.
8. Configure Firestore according to `Audio/config/FirebaseREADME.md`.
9. Open `Audio/index.html?admin=1`.
10. Check that the demo manifest loads, and that the whole library loads after unlocking the archive.
7. Add several sounds to the main view.
8. Create a favorite list and add sounds to it.
9. Assign an alias to selected SFX.
10. Open `Audio/index.html`.
11. Check main view, navigation, lists, and playback.
12. Check local mode by removing or disabling Firebase configuration.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Admin start | Open `Audio/index.html?admin=1`. | Header, statuses, toolbar, tag panel, SFX list, favorites, and main view are visible. |
| User start | Open `Audio/index.html`. | Only user view and navigation are visible. |
| Manifest | Click `Load manifest`. | Status shows manifest item count. |
| Start without login | Open the module with no valid session. | The gate opens by itself, showing `Skip` and `Begin the Rite`. |
| Skipping the gate | Click `Skip`. | The overlay closes, only the demo tier is visible, status: `Archive: locked` (green pill). |
| Skip persistence | Reload the page after `Skip`. | The gate does not return. It does return in a new browser tab. |
| Empty password | Click `Begin the Rite` with an empty field. | Message about the Litany of Access not being recited. |
| Wrong password | Enter a wrong password. | Message about the Litany of Access being rejected. |
| Correct password | Enter the group password. | Overlay closes, the list fills with the archive, status: `Archive: unlocked`. |
| Disappearing button | Unlock the archive. | The `Unlock archive` button disappears. There is no lock button anywhere. |
| Session persistence | Reload the page after unlocking. | The archive is still unlocked, with no password prompt. The stored session has no `exp` field. |
| Entry outside the manifest | With the archive locked, click a `(missing in manifest)` entry. | The gate opens with the `This sound is not part of the public tier…` message. |
| Archive manifest unreachable | Enter the correct password while the gateway cannot see `audio-manifest.json`. | The overlay stays open showing the HTTP code, status: `Archive: load error` (red pill). |
| Public list unreachable | Enter the correct password while `AudioManifest.json` returns 404. | The message names the **public list** and suggests `Ctrl+F5`; it does **not** mention the gateway or `AUDIO_GATE_BASE`. The archive still loads. |
| Gateway answers 500 on login | Simulate a 500 on `/login`. | The message carries the HTTP status and says the gateway is running but rejected the login. |
| Builder: valid workbook | In admin view click `Build manifests from XLSX` and select `AudioManifest.xlsx`. | The browser saves `AudioManifest.json` and `audio-manifest.json`, the pill shows the item counts. |
| Builder: missing column | Select a workbook without the `LinkDoFolderu` column. | Message `Missing required columns: LinkDoFolderu`, no file is produced, the pill turns red. |
| Builder: duplicate column | Select a workbook with two `NazwaSampla` columns. | Message about a column present more than once, no file is produced. |
| Builder: extra columns | Select a workbook with extra columns in a different order. | The manifests are built correctly and the extra columns are ignored. |
| Builder: id stability | Build the manifests from an unchanged workbook. | The files are identical to the ones in the repository — saved favourite lists still point at the same sounds. |
| Protected sound | Play an archive item. | The module fetches a signature from `/sign`, the sound plays, the volume slider works. |
| Firebase failure | Block access to Firestore. | The module falls back to local settings but still loads the manifests. |
| SFX filter | Type phrase in `searchInput`. | Admin SFX list is filtered. |
| Tag filter | Uncheck a tag. | Admin SFX list hides sounds with that tag. |
| Tag popup | Click `Filter ▾`. | Popup opens with search and checkboxes. |
| Main view | Add SFX to `Main view`. | Item appears in admin main view and user view. |
| Favorite list | Create list and add SFX. | List appears in admin and user navigation. |
| Alias | Enter alias and leave field. | Alias appears next to SFX name. |
| Clear alias | Click `Clear`. | Alias for that SFX disappears. |
| Clear all aliases | Click `Clear all aliases` and confirm. | Whole alias map is removed. |
| Playback | Click name or `Play`. | Sound starts and card enters playing state. |
| Stop | Click active sound again. | Sound stops. |
| Volume | Move slider. | Gain or volume changes for that player. |
| Loop | In user view, click `Loop`. | Sound loops with randomized variants. |
| Firestore | Configure Firebase and change lists. | `audio/favorites` saves `favorites`, `mainView`, and `aliases`. |
| LocalStorage | Remove Firebase config and change lists. | Settings are saved in `audio.settings`. |

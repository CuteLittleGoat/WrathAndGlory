# 🇵🇱 Dokumentacja techniczna — Audio (PL)

## 1. Cel modułu

`Audio` jest przeglądarkowym odtwarzaczem efektów dźwiękowych na sesje gry oraz panelem do przygotowania tego, co widzą gracze.

Moduł:

- wczytuje katalog dźwięków z dwóch warstw: publicznej (demo) i chronionej hasłem (archiwum za bramką Cloudflare Worker),
- grupuje warianty tego samego dźwięku i losuje wariant przy każdym odtworzeniu,
- pozwala w panelu admina ułożyć **listę główną** i dowolną liczbę **nazwanych list**, ułożyć w nich dźwięki w dowolnej kolejności i nadać każdemu wpisowi **alias obowiązujący tylko na tej liście**,
- filtruje katalog drzewem folderów (hierarchia tagów z zaznaczaniem grup i podgrup) oraz wyszukiwarką z niebieskim sygnałem aktywnego filtra,
- pokazuje na dole panelu admina podgląd widoku użytkownika w trzech szerokościach,
- zapisuje ustawienia w Firestore (dokument `audio/favorites`), a przy braku bazy w `localStorage`,
- odtwarza dźwięki jednorazowo albo w pętli, z osobną głośnością każdego kafelka,
- buduje oba manifesty z arkusza XLSX bezpośrednio w przeglądarce.

Moduł składa się z trzech plików interfejsu: `index.html` (znaczniki), `style.css` (style) i `app.js` (logika jako moduł ES).

## 2. Punkty wejścia

| Adres | Tryb | Zawartość |
| --- | --- | --- |
| `Audio/index.html` | widok użytkownika | Pasek z zakładkami list, przycisk „Zatrzymaj wszystko”, opcjonalnie „Odblokuj archiwum”, siatka kafelków. |
| `Audio/index.html?admin=1` | panel admina | Nagłówek ze statusami, warsztat w trzech kolumnach (Foldery → Katalog → Listy z edytorem) i podgląd widoku użytkownika. |

Tryb jest wykrywany raz, przy starcie:

```js
const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";
```

`setModeVisibility()` dodaje do `<body>` klasę `admin-mode` albo `user-mode` i **usuwa z dokumentu** wszystkie elementy drugiego trybu (`.user-only` w panelu admina, `.admin-only` w widoku użytkownika). Referencje w obiekcie `dom` zostają, ale wskazują odłączone elementy, więc zapis do nich niczego nie psuje.

Moduł `Main` linkuje do widoku użytkownika (`Main/index.html` → `../Audio/index.html`). Panel admina otwiera się ręcznie przez dopisanie `?admin=1`.

## 3. Struktura plików

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `Audio/index.html` | Znaczniki obu trybów, bramki dostępu i podglądu. Teksty statyczne mają atrybuty `data-i18n*`. Brak osadzonego CSS i JS. |
| `Audio/style.css` | Wszystkie style modułu (oba tryby, podgląd, bramka, responsywność). |
| `Audio/app.js` | Cała logika (moduł ES, około 4300 wierszy z komentarzami PL/EN). |
| `Audio/AudioManifest.json` | Manifest warstwy publicznej (demo) z gotowymi adresami plików. Generowany przez panel admina. |
| `Audio/worker/audio-gate.js` | Kod bramki dostępu (Cloudflare Worker `audio-gate`). |
| `Audio/config/firebase-config.js` | `window.firebaseConfig` projektu Firebase `audiorpg-2eb6f`. |
| `Audio/config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase modułu. |
| `Audio/Disclaimer.md` | Informacja o inspiracji (Grimdark Audio Mixer) i prywatnym, niekomercyjnym charakterze modułu. |
| `Audio/docs/README.md` | Instrukcja użytkownika. |
| `Audio/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |
| `shared/access-gate.css` | Wspólny wygląd bramki dostępu (DataVault, GeneratorNPC, Audio). |
| `shared/firebase-write-status.js` / `.css` | Wspólny pasek komunikatów o nieudanym zapisie/odczycie i plakietka trybu pracy (GeneratorNPC, Audio). |
| `shared/appcheck-config.js` | Klucze witryny App Check (reCAPTCHA Enterprise) obu projektów Firebase. |
| `shared/firebase-app-check.js` | Funkcja `activateAppCheck(app)` dla SDK w zapisie modularnym. |
| `shared/firestore-audiorpg.rules` | Odwzorowanie reguł Firestore projektu `audiorpg-2eb6f` (GeneratorNPC i Audio). |

Arkusz źródłowy `AudioManifest.xlsx` celowo **nie** leży w repozytorium (wpis w `.gitignore`), bo zawiera pełny katalog materiałów chronionych.

## 4. Zależności

### 4.1 Zależności zewnętrzne

| Zależność | Wersja | Kiedy ładowana | Po co |
| --- | --- | --- | --- |
| Google Fonts `Fira Code` (400, 600) | — | zawsze, `<link>` w `<head>` | font całego modułu |
| Firebase `firebase-app.js`, `firebase-firestore.js` | 12.6.0 | zawsze, `import` w `app.js` | ustawienia list |
| `https://www.google.com/recaptcha/enterprise.js` | — | zawsze, `<script defer>` | App Check |
| SortableJS `sortablejs@1.15.2/Sortable.min.js` (jsDelivr) | 1.15.2 | tylko panel admina, w tle po starcie (`ensureSortable`) | przeciąganie list i wpisów |
| JSZip `jszip@3.10.1/dist/jszip.min.js` (jsDelivr) | 3.10.1 | tylko przy pierwszym kliknięciu „Zbuduj manifesty z XLSX” (`ensureJSZip`) | rozpakowanie pliku XLSX |

Niedostępność SortableJS nie blokuje panelu — zostają przyciski strzałek. Niedostępność JSZip daje komunikat `builderErrorLibrary`.

### 4.2 Zależności między plikami

Kolejność skryptów w `index.html`: `config/firebase-config.js` → `../shared/appcheck-config.js` → `recaptcha/enterprise.js` (`defer`) → `app.js` (`type="module"`, więc wykonuje się po skryptach `defer`). `app.js` importuje `../shared/firebase-app-check.js` i `../shared/firebase-write-status.js`.

### 4.3 Zależności między modułami

- `shared/access-gate.css` i układ bramki są wspólne z DataVault i GeneratorNPC; tekst lore bramki jest taki sam jak w DataVault.
- `shared/firebase-write-status.*` jest wspólny z GeneratorNPC; oba moduły korzystają z tego samego projektu Firebase `audiorpg-2eb6f` (dokumenty `generatorNpc/favorites` i `audio/favorites`).
- Funkcja `foldPolish()` jest kopią reguły z `DataVault/app.js` (małe litery, bez diakrytyków, `ł` → `l`).
- Zmienne `--filter-on*` są skopiowane z `DataVault/style.css`, żeby niebieski sygnał aktywnego filtra znaczył to samo we wszystkich modułach.
- Hasło archiwum jest niezależne od hasła DataVault/GeneratorNPC (patrz rozdział 11.1).

## 5. Architektura `app.js`

Plik ma stałą kolejność sekcji, oznaczonych nagłówkami komentarzy:

1. importy Firebase i modułów wspólnych,
2. stałe,
3. tłumaczenia (`translations.pl`, `translations.en`) i `t()`,
4. narzędzia (`escapeHtml`, `foldPolish`, `highlightMatch`, `debounce`, pamięć przeglądarki, tytuły),
5. odwołania do elementów (`dom`),
6. stan (`state`) i instancja `writeStatus`,
7. model ustawień (listy, wpisy, aliasy),
8. zapis i odczyt ustawień, Firebase,
9. bramka dostępu i sesja,
10. odtwarzanie,
11. tagi, identyfikatory i adresy (wspólne z generatorem),
12. manifesty,
13. drzewo folderów,
14. pamięć interfejsu admina,
15. rysowanie wspólne, panelu admina i widoku użytkownika,
16. działania w panelu admina, przeciąganie,
17. generator manifestów z XLSX,
18. języki,
19. obsługa zdarzeń,
20. start modułu.

Zasady przepływu danych:

- Stan modułu jest jedynym źródłem prawdy. Funkcje `render*()` budują HTML ze stanu przez `innerHTML`; nie odczytują stanu z DOM.
- **Każda zmiana ustawień** (lista, wpis, alias, kolejność, nazwa) najpierw zmienia `state.settings` funkcją modelu, a potem woła `persistAndRender()`, które odświeża indeks przynależności, rysuje widok i zapisuje dane.
- Zdarzenia są obsługiwane przez delegację: jeden nasłuch na kontenerze (`#catalogList`, `#listsList`, `#editorEntries`, `#editorHead`, `#folderTree`, `#userView`, `#previewView`), a akcję rozpoznaje atrybut `data-action`.
- Każdy tekst pochodzący z danych (nazwa dźwięku, alias, nazwa listy, plik, folder) przechodzi przez `escapeHtml()`. Dokument `audio/favorites` jest zapisywalny dla każdego (reguły `allow read, write: if true`), więc bez tego alias mógłby wstrzyknąć skrypt.

## 6. Dwie warstwy biblioteki

| Warstwa | `access` | Źródło manifestu | Źródło plików | Logowanie |
| --- | --- | --- | --- | --- |
| Publiczna (demo) | `"public"` | `AudioManifest.json` w tym repozytorium | publiczne repozytorium `AudioExample` (GitHub Pages) | nie |
| Chroniona (archiwum) | `"protected"` | endpoint `/manifest` bramki | prywatne repozytorium `AudioRPG`, pliki wydaje bramka | tak |

GitHub Pages zna tylko dwa stany: pliki dostępne dla każdego albo dla nikogo. Bramka dodaje stan trzeci — repozytorium `AudioRPG` zostaje prywatne, a jedyną drogą do plików jest Worker sprawdzający uprawnienie.

`loadManifests()` łączy obie warstwy w jedną listę, sortowaną po `label` (`localeCompare`).

## 7. Manifesty

### 7.1 Format

Manifest publiczny (`AudioManifest.json`, z wcięciami):

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

Manifest chroniony (`audio-manifest.json` w katalogu głównym prywatnego repozytorium, bez wcięć) ma identyczną strukturę, ale `access: "protected"`, a warianty zamiast `url` mają `path` — ścieżkę względną w repozytorium `AudioRPG`. Adres do odtworzenia powstaje dopiero po podpisaniu przez bramkę.

| Pole pozycji | Znaczenie |
| --- | --- |
| `id` | Stały identyfikator (slug). Listy w bazie wskazują dźwięki wyłącznie po `id`. |
| `label` | Nazwa widoczna w interfejsie (dla grup — nazwa bazowa bez numeru). |
| `groupCount` | Liczba wariantów w grupie; `0`, gdy pozycja nie jest grupą. Interfejs pokazuje `(N)` tylko dla `groupCount > 1`. |
| `filename` | Nazwa pliku albo `pierwszy.ogg (+N)` dla grup. |
| `tags` | Segmenty ścieżki folderu po oczyszczeniu. |
| `tag2` | `tags[1]` — tag pokazywany na kafelku widoku użytkownika. |
| `tagPaths` | Narastające ścieżki: `["A", "A / B", "A / B / C"]`. Budują drzewo folderów. |
| `variants` | Warianty: `{ filename, url }` (public) albo `{ filename, path }` (protected). |

### 7.2 Pola dopisywane po wczytaniu

`applyItems(items)` sortuje pozycje po `label` i dopisuje każdej:

| Pole | Wartość | Użycie |
| --- | --- | --- |
| `folderPath` | ostatni element `tagPaths` albo `"__no_folder__"` (`NO_FOLDER_PATH`) | filtr folderów w katalogu |
| `searchText` | `foldPolish([label, filename, ...tags].join(" \| "))` | wyszukiwarka katalogu (liczone raz) |

Następnie buduje `state.itemsById` (mapa `id → pozycja`) i `state.folderTree` (`buildFolderTree`). Jeżeli `state.expandedPaths` nie było odtworzone z pamięci, rozwinięte zostają wszystkie foldery najwyższego poziomu.

### 7.3 Pobieranie

- `fetchDemoManifest()` — `fetch("AudioManifest.json", { cache: "no-store" })`. Kod inny niż 2xx rzuca `Error("public_manifest_unavailable")` z polem `detail` = kod HTTP.
- `fetchProtectedManifest()` — `fetch(AUDIO_GATE_BASE + "/manifest", { headers: { Authorization: "Bearer <token>" } })`. `401` czyści sesję i rzuca `gate_unauthorized`; odpowiedź `{ error: "manifest_unavailable", status }` rzuca `manifest_unavailable` z `detail`; inne błędy rzucają `gate_error` z `detail` = kod HTTP.
- `loadManifests()` — obie warstwy w osobnych blokach `try`. Warstwa chroniona jest pobierana tylko przy ważnej sesji. Po sukcesie: `applyItems`, `state.manifestReady = true`, `signedUrlCache.clear()`, `renderAll()`. Gdy obie warstwy są puste, funkcja rzuca błąd z konkretnym powodem (`state.publicError` / `state.libraryError`) albo `manifestNoData`.

## 8. Generator manifestów z XLSX

Przycisk `#buildManifests` (menu „Narzędzia”, tylko panel admina) wywołuje `handleBuildManifests()`. Nic nie jest wysyłane na serwer: plik jest czytany lokalnie, a wynik zapisywany przez `Blob` i `URL.createObjectURL`.

Generator używa **tych samych** funkcji `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment` i `normalizeUrl` co reszta modułu. To jedno źródło logiki identyfikatorów — zmiana którejkolwiek z nich zmienia `id` i zrywa powiązanie zapisanych list z dźwiękami. Przed każdą zmianą trzeba porównać wynik generatora na tym samym arkuszu (pliki muszą być identyczne bajt w bajt).

Kroki:

1. `pickLocalWorkbookFile()` — ukryty `<input type="file" accept=".xlsx">`; zwraca `{ buffer }` albo `null` przy rezygnacji (zdarzenie `cancel` lub `change` bez pliku).
2. `ensureJSZip()` — doładowanie JSZip; nieudana próba zeruje obietnicę, więc kolejne kliknięcie próbuje ponownie.
3. `readXlsxSheet(buffer)` — minimalny czytnik: `xl/sharedStrings.xml`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels` i arkusz pierwszego `<sheet>`. Obsługuje komórki `s`, `inlineStr` i wartości surowe; `columnRefToIndex()` zamienia `AB12` na indeks kolumny. Zwraca `{ header, rows }` jako tablice pozycyjne (bez sklejania kolumn po nazwie, co pozwala wykryć duplikaty nagłówka).
4. `resolveRequiredColumns(header)` — walidacja nagłówka.
5. `buildManifestItems(rows)` — grupowanie i identyfikatory; potem sortowanie po `label`.
6. Podział na warstwy i sprawdzenie ścieżek.
7. `downloadJsonFile()` — najpierw `AudioManifest.json` (z wcięciami), po 150 ms `audio-manifest.json` (bez wcięć), bo część przeglądarek pomija dwa pobrania w tej samej chwili.
8. `setBuilderState("ready", { publicCount, protectedCount })` i `alert(builderDone)`.

### 8.1 Walidacja

| Sytuacja | Zachowanie |
| --- | --- |
| Brak kolumny `NazwaSampla`, `NazwaPliku` albo `LinkDoFolderu` | `builder_missing_columns` z listą brakujących. |
| Wymagana kolumna występuje więcej niż raz | `builder_duplicate_columns`. |
| Kolumny nadmiarowe, dowolna kolejność | Ignorowane / obsługiwana (wiązanie po nazwie). |
| Sam nagłówek | `builder_no_rows`. |
| Wariant chroniony bez fragmentu `/AudioRPG/` w adresie | `builder_no_paths` z liczbą wariantów. |
| Plik nie jest poprawnym XLSX | `builderErrorRead`. |

Każdy błąd ustawia `state.builder.status = "error"`, pastylkę `#builderStatus` na czerwono (pełna treść w `title`) i pokazuje `alert()`. Przy błędzie nie powstaje żaden plik.

### 8.2 Podział na warstwy

- `LinkDoFolderu` zawiera `/AudioExample/` (`BUILDER_PUBLIC_PREFIX`) → `access: "public"`, wariant dostaje `url` = `normalizeUrl(folder, plik)`.
- W przeciwnym razie → `access: "protected"`, wariant dostaje `path` = część adresu po `/AudioRPG/` (`BUILDER_PROTECTED_PREFIX`) po `decodeURIComponent` (`toProtectedRepoPath`). Przykład: `https://host/AudioRPG/PrivateFolder/PrivateSubFolder/PrivateSound.ogg` → `PrivateFolder/PrivateSubFolder/PrivateSound.ogg`.

### 8.3 Grupowanie wariantów i identyfikatory

`getGroupingBaseLabel(label)` odcina liczbę z końca nazwy (`Wybuch 2` → `Wybuch`). Wiersze są grupowane w jedną pozycję, gdy mają ten sam `LinkDoFolderu`, tę samą nazwę bazową, nazwa faktycznie kończyła się liczbą i takich wierszy jest więcej niż jeden. Pozycja grupowa dostaje `label` = nazwa bazowa, `groupCount` = liczba wariantów i `filename` = `pierwszy (+N-1)`.

`id` = `slugify(nazwa)` — małe litery, każdy ciąg znaków innych niż litery i cyfry Unicode → `-`, obcięte `-` na brzegach; pusty wynik → `sample-<nrWiersza>`. Przy kolizji (ten sam slug w innym folderze) dopisywany jest numer wiersza arkusza: `<slug>-<nrWiersza>`.

Konsekwencja: **wstawienie wiersza w środku arkusza zmienia identyfikatory kolizyjne wszystkich wierszy poniżej**, a zapisane listy tracą te dźwięki. Pomiar na rzeczywistym arkuszu (1793 wiersze, 133 pozycje z sufiksem kolizyjnym): dopisanie wiersza na końcu zmienia 0 identyfikatorów, wstawienie tego samego wiersza w środku — 123. Dlatego instrukcja nakazuje dopisywać wiersze wyłącznie na końcu.

### 8.4 Tagi

`extractTags(folderUrl)`:

1. zamienia `\` na `/`; adres z `://` zamienia na `new URL(...).pathname`,
2. dzieli po `/`, odrzuca puste segmenty i segmenty z `TAG_IGNORE_SEGMENTS` (`AudioRPG`),
3. każdy segment czyści `cleanTagSegment()`: `decodeURIComponent`, usunięcie (bez względu na wielkość liter) dopisków technicznych z listy `TAG_IGNORE_FRAGMENTS` w `app.js`, zamiana `_` i `-` na spacje, zwinięcie białych znaków,
4. odrzuca segmenty puste po oczyszczeniu.

Lista `TAG_IGNORE_FRAGMENTS` jest potrzebna wyłącznie generatorowi — moduł w czasie działania czyta gotowe `tags` i `tagPaths` z manifestu.

## 9. Bramka dostępu (Cloudflare Worker)

Kod: `Audio/worker/audio-gate.js`. Wdrożenie: Worker `audio-gate` na koncie Cloudflare. Adres Workera jest wpisany w stałej `AUDIO_GATE_BASE` w `app.js` (komentarz `MIEJSCE ZMIANY ADRESU BRAMKI`).

### 9.1 Zmienne środowiskowe Workera

| Nazwa | Typ | Zawartość |
| --- | --- | --- |
| `GROUP_PASSWORD` | Secret | Hasło grupy (Litania Dostępu). |
| `SIGNING_KEY` | Secret | Klucz HMAC do podpisywania tokenów sesji i adresów plików. |
| `GITHUB_TOKEN` | Secret | Fine-grained PAT: tylko repozytorium `AudioRPG`, `Contents: Read-only`. |
| `ALLOWED_ORIGIN` | Text | Adres witryny, np. `https://cutelittlegoat.github.io`. |

Wartości sekretów nie mogą trafić do repozytorium. Ustawia się je w Cloudflare: **Workers & Pages → `audio-gate` → Settings → Variables and Secrets** albo komendą `npx wrangler secret put <NAZWA>`.

### 9.2 Endpointy

| Endpoint | Metoda | Autoryzacja | Działanie |
| --- | --- | --- | --- |
| `/health` | GET | brak | Które zmienne są ustawione (bez wartości). |
| `/login` | POST | brak | `{ password }` → porównanie w czasie stałym → `{ ok, token, exp: null }`; złe hasło → `401`. |
| `/manifest` | GET | Bearer | Przekazuje `audio-manifest.json` z repozytorium prywatnego (bez parsowania, cache 5 min). |
| `/sign` | GET | Bearer | `?p=<ścieżka>` → `{ ok, url, exp }` — podpisany adres pliku. |
| `/a` | GET | podpis w adresie | Sprawdza podpis i wygaśnięcie, wydaje plik z nagłówkami CORS i obsługą `Range`. |

### 9.3 Token sesji i podpisy

- Token: `base64url(JSON) + "." + base64url(HMAC-SHA256)`, ładunek zawiera tylko `iat`. **Sesja jest bezterminowa** (`exp: null`). Starsze tokeny z polem `exp` są honorowane do swojej daty.
- Jedyny sposób unieważnienia wszystkich sesji naraz: zmiana sekretu `SIGNING_KEY`.
- Podpis adresu: `HMAC-SHA256(SIGNING_KEY, "<ścieżka>|<exp>")`, adres `/a?p=<ścieżka>&e=<exp>&s=<podpis>`.
- `exp = (Math.floor(now / 3600) + 2) * 3600` — ważność 1–2 godziny, wyrównana do pełnej godziny, więc w obrębie godziny zegarowej powstaje ten sam adres i przeglądarka korzysta z pamięci podręcznej.
- Autoryzacja jedzie w adresie, a nie w ciasteczku, bo element `<audio>` nie wysyła własnych nagłówków, a ciasteczka third-party są blokowane.
- `isSafeAudioPath` odrzuca `..`, ścieżki absolutne, `\`, `//` i rozszerzenia inne niż `.ogg` / `.mp3`. Porównania sekretów używają `timingSafeEqual`.

## 10. Sesja i bramka po stronie modułu

| Element | Rola |
| --- | --- |
| `AUDIO_SESSION_STORAGE_KEY` = `audio.session` | Token w `localStorage` (`{ token, exp }`). |
| `AUDIO_GATE_SKIPPED_KEY` = `audio.gateSkipped` | Znacznik „Pomiń” w `sessionStorage` (na czas karty). |
| `isSessionUsable(session)` / `hasValidSession()` | Ważna, gdy jest token i `exp` jest puste albo w przyszłości. |
| `loadSession()` / `storeSession(session)` | Odczyt i zapis sesji; nieważna sesja jest usuwana. |
| `signedUrlCache` | Mapa `ścieżka → { url, exp }`; wpis używany, dopóki `exp` jest dalej niż 5 s. Czyszczona po każdym `loadManifests()`. |
| `requestSignedUrl(path)` | `GET /sign`; `401` → `storeSession(null)`, `libraryUnlocked = false`, błąd `gate_unauthorized`. |
| `resolveVariantUrl(item, variant)` | `public` → `variant.url`; `protected` → podpis z bramki. |
| `showAccessGate(message)` / `hideAccessGate()` | Nakładka `#accessGate` przez atrybut `hidden`; fokus w polu hasła. |
| `maybeShowAccessGate()` | Po starcie (w `.finally()` po `loadManifests()`) otwiera bramkę, gdy nie ma sesji i nie kliknięto „Pomiń”. |
| `skipAccessGate()` | „Pomiń” i `Escape`: zapisuje znacznik i zamyka bramkę. |
| `handleUnlockClick(message)` | Kasuje znacznik pominięcia i otwiera bramkę. |
| `submitAccessLitany()` | Dwa rozłączne kroki: (1) `POST /login`, (2) `loadManifests()`. Przy problemie z wczytaniem okno zostaje otwarte z powodem. |

Przycisku blokowania nie ma: odblokowane archiwum jest stanem docelowym, a przycisk „Odblokuj archiwum” znika po odblokowaniu (`#unlockLibrary` w nagłówku admina ma `hidden`, a przycisk w pasku widoku użytkownika nie jest rysowany).

### 10.1 Zachowanie bramki

| Zdarzenie | Reakcja |
| --- | --- |
| Start bez ważnej sesji, „Pomiń” niekliknięte | Bramka otwiera się po wczytaniu manifestów. |
| „Pomiń” albo `Escape` | Bramka znika; `audio.gateSkipped = "1"` w `sessionStorage`. |
| Odświeżenie po „Pomiń” | Bramka nie wraca. Nowa karta — wraca. |
| „Odblokuj archiwum” | Znacznik pominięcia jest kasowany, bramka się otwiera. |
| Kliknięcie kafelka „(brak w manifeście)” przy zablokowanym archiwum | Bramka z komunikatem `accessMissingItem`. |
| Wygaśnięcie sesji w trakcie odtwarzania | Bramka z komunikatem `accessExpired`. |

Nakładka ma `position: fixed` i `z-index: 9999`, więc zasłania wszystko, łącznie z paskiem komunikatu o zapisie (`z-index: 9000`).

### 10.2 Komunikaty błędów wskazują warstwę, która zawiodła

| Co zawiodło | Klucz tłumaczenia |
| --- | --- |
| `fetch("/login")` rzucił wyjątek (sieć, CORS, zły adres) | `accessSilent` |
| `/login` → `401` | `accessRejected` |
| `/login` → inny kod niż 2xx i 401 | `accessLoginStatus` (z kodem) |
| puste pole hasła | `accessEmpty` |
| `/manifest` → `401` | `accessExpired` |
| `/manifest` → `manifest_unavailable` | `accessManifestMissing` (z kodem) |
| `/manifest` → inny błąd | `accessGateStatus` (z kodem) |
| inny wyjątek przy pobieraniu archiwum | `accessSilent` |
| `AudioManifest.json` nie dał się pobrać | `publicManifestMissing` (z kodem i nazwą pliku) |

### 10.3 Niezależność warstw

| Stan | Wynik |
| --- | --- |
| Warstwa publiczna padła, chroniona działa | Widać archiwum; `state.publicError`; pastylka manifestu czerwona („Manifest: błąd listy publicznej”). |
| Warstwa chroniona padła, publiczna działa | Widać demo; `state.libraryError`; pastylka archiwum czerwona („Archiwum: błąd wczytywania”). |
| Obie padły | `loadManifests()` rzuca błąd z konkretnym powodem. |

## 11. Hasła

### 11.1 Hasło archiwum Audio

Hasło archiwum to sekret `GROUP_PASSWORD` Workera `audio-gate`. Zmiana: **Cloudflare → Workers & Pages → `audio-gate` → Settings → Variables and Secrets → `GROUP_PASSWORD` → Edit** (albo `npx wrangler secret put GROUP_PASSWORD` w katalogu z konfiguracją Workera), potem wdrożenie. Zmiana hasła nie wylogowuje urządzeń, które już mają token. Żeby wymusić ponowne logowanie wszędzie, trzeba zmienić też `SIGNING_KEY`.

### 11.2 Hasło DataVault i GeneratorNPC (dla porządku)

DataVault i GeneratorNPC używają konta technicznego Firebase Auth w projekcie `wh40k-data-slate` (adres konta w `window.WG_DATA_ACCESS_EMAIL`). Hasło zmienia się w **Firebase Console → Authentication → Users → konto → Reset password** albo skryptem `firebase-admin` (`updateUser`). Konta nie wolno usuwać ani tworzyć od nowa, bo jego `uid` jest wpisany w reguły Realtime Database. To hasło nie ma związku z archiwum Audio.

Żadne hasło nie jest zapisane w repozytorium.

## 12. Firebase

### 12.1 Konfiguracja

`Audio/config/firebase-config.js` ustawia `window.firebaseConfig` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) projektu `audiorpg-2eb6f`. Brak obiektu albo `apiKey` oznacza pracę lokalną.

`initFirebase()`:

1. brak konfiguracji → `state.firebaseConfigMissing = true`, `writeStatus.reportLocalMode("no-config")`, `loadSettingsLocal()`, `renderAll()`;
2. `initializeApp()` → `activateAppCheck(app)` → `getFirestore(app)`; wyjątek → `reportLocalMode("init-failed")` i praca lokalna;
3. `state.favoritesDoc = doc(db, "audio", "favorites")`, `state.usingFirestore = true`;
4. `onSnapshot(favoritesDoc, onData, onError)`:
   - brak dokumentu → `applySettings(createEmptySettings())` i `persistAndRender()` (powstaje dokument w formacie v2),
   - dane → `normalizeSettingsV2(snapshot.data())`, `applySettings()`, `writeStatus.warnLocalOverwritten()`, `renderAll()`,
   - błąd nasłuchu → `state.usingFirestore = false`, `writeStatus.reportReadError(error)`, `loadSettingsLocal()`, `renderAll()`.

Nasłuch działa na żywo: zmiana zapisana w panelu admina pojawia się w otwartych widokach użytkownika bez odświeżania.

### 12.2 App Check

`activateAppCheck(app)` z `shared/firebase-app-check.js` jest wywoływane po `initializeApp()`, a przed `getFirestore()`. Klucz witryny reCAPTCHA Enterprise projektu `audiorpg-2eb6f` jest w `shared/appcheck-config.js`. Bibliotekę reCAPTCHA wczytuje strona (`<script defer>`), a nie SDK, bo SDK dokłada znacznik bez obsługi błędu i przy zablokowanym adresie czeka bez końca, blokując Firestore. Gdy biblioteki brak, App Check jest pomijany z ostrzeżeniem w konsoli.

### 12.3 Reguły

Reguły projektu (odwzorowane w `shared/firestore-audiorpg.rules`) dopuszczają odczyt i zapis wyłącznie dokumentów `generatorNpc/favorites` i `audio/favorites`; wszystko inne jest zablokowane. Warunku `request.app != null` nie dopisujemy (opis w pliku reguł). Ochronę przed obcymi programami daje wymuszanie App Check w konsoli.

## 13. Model ustawień (wersja 2)

### 13.1 Dokument

Dokument `audio/favorites` (i jego kopia w `localStorage` pod `audio.settings`):

```text
{
  schemaVersion: 2,
  playlists: [
    { id: "main", kind: "main", name: "", entries: [ { itemId, alias } ] },
    { id: "<uuid>", kind: "list", name: "Nazwa listy", entries: [ { itemId, alias } ] }
  ],
  updatedAt: <serverTimestamp>      // tylko w Firestore
}
```

| Pole | Reguła |
| --- | --- |
| `schemaVersion` | Zawsze `2` (`SETTINGS_SCHEMA_VERSION`). |
| `playlists` | Tablica list w kolejności wyświetlania. **Pozycja 0 to zawsze lista główna.** Pole nazywa się `playlists`, a nie `lists`, żeby żaden starszy kod nie rozpoznał dokumentu jako własnego. |
| `id` | `"main"` dla listy głównej, `crypto.randomUUID()` dla pozostałych. Unikalne. |
| `kind` | `"main"` albo `"list"`. Dokładnie jedna lista `main`. |
| `name` | Do 60 znaków (`LIST_NAME_MAX_LENGTH`). Pusta nazwa listy głównej = nazwa domyślna „Widok główny” / „Main view” w bieżącym języku. Pozostałe listy muszą mieć nazwę. |
| `entries` | Wpisy w kolejności wyświetlania. `itemId` unikalny w obrębie listy. |
| `alias` | Do 80 znaków (`ALIAS_MAX_LENGTH`), pusty = brak aliasu. **Alias należy do wpisu, a więc do listy** — ten sam dźwięk może mieć różne aliasy na różnych listach. |
| `updatedAt` | `serverTimestamp()` ustawiane przy każdym zapisie do Firestore. |

Nazwy list są danymi użytkownika i nie są tłumaczone. Eksport (`exportSettings`) zapisuje `serializeSettings()` z dodanym `exportedAt` (ISO 8601) — bez tokenu i sekretów.

### 13.2 Czysty start i stary format

Moduł zna wyłącznie format v2. `normalizeSettingsV2(raw)`:

- dane bez `schemaVersion === 2` albo bez tablicy `playlists` → **puste ustawienia** (sama pusta lista główna) i `legacy = isLegacySettings(raw)`;
- `isLegacySettings` rozpoznaje stary format po polach `favorites`, `mainView`, `aliases` albo tablicy `lists`; służy wyłącznie do pokazania komunikatu `noticeLegacy` w panelu admina;
- odczyt starego dokumentu **niczego nie zapisuje**. Pierwsza zmiana w panelu admina nadpisuje dokument całością w formacie v2 (`setDoc` bez `merge`), co usuwa stare pola;
- `loadSettingsLocal()` usuwa najstarszy klucz `audio.favorites` z `localStorage` przy każdym starcie.

Reguły normalizacji formatu v2:

- pierwsza lista z `kind === "main"` albo `id === "main"` staje się listą główną, kolejne takie są pomijane; brak listy głównej → dopisywana pusta;
- pozostałe listy dostają `kind: "list"`; puste `id` → `list-<n>`; powtórzone `id` → dopisywany sufiks;
- `normalizeEntries`: wpisy bez `itemId` i duplikaty są odrzucane (zostaje pierwszy), aliasy przycinane. **Wpisy spoza bieżącego manifestu nie są usuwane** — przy zablokowanym archiwum wszystkie dźwięki chronione są „nieobecne”, a ich wpisy i aliasy muszą przetrwać.

### 13.3 Funkcje modelu

| Funkcja | Działanie |
| --- | --- |
| `createMainList()` / `createEmptySettings()` | Pusta lista główna / ustawienia z samą listą główną. |
| `serializeSettings()` | Postać do zapisu (bez `updatedAt`). |
| `getLists()`, `getList(id)`, `getMainList()`, `getEditedList()` | Dostęp do list; `getEditedList()` spada na listę główną. |
| `getListName(list)` | Nazwa do wyświetlenia (domyślna dla pustej nazwy). |
| `buildMembershipIndex()` | Mapa `itemId → [{ listId, alias }]` — do licznika w katalogu, sekcji „Na innych listach”, podpowiedzi aliasów i wyszukiwania po aliasie. |
| `createList()` | Nowa lista na końcu, nazwa „Nowa lista”; zwraca `id`. |
| `duplicateList(id)` | Kopia z wpisami i aliasami, nazwa z dopiskiem „(kopia)”, wstawiona zaraz po oryginale (dla listy głównej — na pozycji 1). |
| `moveListTo(id, index)` | Przesunięcie listy; lista główna się nie rusza, nic nie trafia na pozycję 0. |
| `addEntries(listId, itemIds)` | Dopisanie na koniec bez duplikatów; zwraca liczbę dodanych. |
| `removeEntry(listId, itemId)` | Usunięcie wpisu razem z aliasem. |
| `moveEntry(listId, from, to)` | Przesunięcie wpisu (alias wędruje z nim). |
| `setEntryAlias(listId, itemId, alias)` | Ustawienie aliasu; zwraca `false`, gdy nic się nie zmieniło. |
| `onSettingsChanged()` | Przebudowa indeksu, zastosowanie `restoredEditedListId`, naprawa wskazań na nieistniejące listy (`editedListId`, `previewListId`, `userListId`, `renamingListId`), `pruneOrphanPlayers()`. |
| `applySettings(settings, legacy)` | Podmiana ustawień i `onSettingsChanged()`. |

## 14. Zapis i odczyt

| Funkcja | Działanie |
| --- | --- |
| `saveSettingsLocal()` | `localStorage["audio.settings"] = JSON(serializeSettings())`; zwraca `true`/`false`. |
| `saveSettings()` | Przy aktywnej bazie `setDoc(favoritesDoc, { ...serializeSettings(), updatedAt: serverTimestamp() })`. Błąd → `usingFirestore = false`, zapis lokalny, `reportSaveError(error, { savedLocally })`. Bez bazy → zapis lokalny; przy skonfigurowanej bazie dodatkowo `noteLocalOnlyChange()`. Udany zapis kasuje komunikat o starym formacie (`markSettingsSaved`). **Nigdy nie odrzuca obietnicy.** |
| `persistAndRender()` | `onSettingsChanged()` → `renderAll()` → `await saveSettings()`. Widok rysuje się **przed** zapisem, bo przy braku sieci obietnica `setDoc` może się nie rozstrzygnąć. |
| `loadSettingsLocal()` | Usuwa `audio.favorites`, czyta `audio.settings`, normalizuje, `applySettings()`. |

Klucze pamięci przeglądarki:

| Klucz | Pamięć | Zawartość |
| --- | --- | --- |
| `audio.settings` | `localStorage` | Ustawienia v2 (tryb lokalny i zapas po odmowie bazy). |
| `wgLocalOnlyChange:audio.settings` | `localStorage` | Znacznik zmian zapisanych tylko lokalnie przy skonfigurowanej bazie (`{"at":"<ISO>"}`), zarządzany przez `shared/firebase-write-status.js`. |
| `audio.session` | `localStorage` | Token bramki. |
| `audio.gateSkipped` | `sessionStorage` | Znacznik „Pomiń”. |
| `audio.admin.ui` | `localStorage` | Układ panelu admina (rozdział 16). |
| `audio.admin.filters` | `sessionStorage` | Filtry panelu admina (rozdział 16). |

Każdy dostęp do pamięci jest w `try/catch` (`getStorage`, `readStoredJson`, `writeStoredJson`) — okno prywatne albo zablokowane dane witryny nie zatrzymują modułu.

### 14.1 Pasek komunikatów o zapisie

Instancja powstaje raz przy wczytaniu skryptu:

```js
const writeStatus = createFirebaseWriteStatus({
  mount: document.body,
  modeMount: $("writeStatusMode"),
  language: currentLanguage,
  scopeKey: AUDIO_SETTINGS_STORAGE_KEY,
  moduleName: "Audio"
});
```

`#writeStatusMode` leży w `.page-top`, poza sekcjami `admin-only` / `user-only`, więc plakietka trybu jest widoczna w obu trybach.

| Miejsce | Wywołanie | Efekt |
| --- | --- | --- |
| `saveSettings()` — udany `setDoc` | `reportSaveSuccess()` | Pasek znika, plakietka „Dane wspólne”, znacznik zmian lokalnych kasowany. |
| `saveSettings()` — odmowa | `reportSaveError(error, { savedLocally })` | „Zapisano tylko na tym urządzeniu” albo „Nie zapisano nic”. |
| `saveSettings()` — zapis lokalny przy skonfigurowanej bazie | `noteLocalOnlyChange()` | Znacznik zmian lokalnych. |
| `onSnapshot` — błąd | `reportReadError(error)` | „Nie udało się wczytać danych z bazy”. |
| `onSnapshot` — dane | `warnLocalOverwritten()` | Ostrzeżenie, jeżeli dane z bazy zastąpiły zmiany lokalne. |
| `initFirebase()` | `reportLocalMode("no-config" \| "init-failed")` | Łagodna informacja o pracy bez bazy. |
| `renderStatus()` | `setMode("shared" \| "local")` | Plakietka trybu. |
| `applyLanguage()` | `setLanguage(lang)` | Teksty paska w wybranym języku. |

Wspólny moduł rozróżnia sytuacje `nothing-saved`, `local-only`, `read-failed`, `local-mode`, `local-overwritten`, mapuje kody Firestore (`permission-denied`, `unauthenticated`, `unavailable`, `deadline-exceeded`, `resource-exhausted`, `failed-precondition`) na podpowiedzi i ustawia zmienną `--wg-write-status-height` na `<html>`, o którą przesuwa się `body`. Z tej zmiennej korzystają też: sticky `.uv-bar` widoku użytkownika, sticky `.admin-tabs` i szuflada folderów.

Moduł celowo nie odsyła do bazy zmian zapisanych lokalnie po odzyskaniu dostępu: zapis to jeden `setDoc` całego dokumentu, więc odesłanie starego stanu skasowałoby zmiany z innego urządzenia. Zamiast tego pokazuje ostrzeżenie `local-overwritten`.

## 15. Stan modułu (`state`)

| Pole | Znaczenie |
| --- | --- |
| `items`, `itemsById` | Dźwięki z obu manifestów (po `applyItems`). |
| `manifestReady`, `manifestAttempted` | Manifest wczytany / próba wczytania się odbyła. |
| `settings` | `{ playlists }` — ustawienia v2. |
| `membership` | Indeks z `buildMembershipIndex()`. |
| `legacyDetected`, `legacyNoticeDismissed`, `archiveNoticeDismissed` | Komunikaty w panelu admina. |
| `firestore`, `favoritesDoc`, `usingFirestore`, `firebaseConfigMissing`, `firebaseStarted` | Stan Firebase. |
| `session`, `libraryUnlocked`, `libraryError`, `publicError` | Sesja i warstwy biblioteki. |
| `builder` | `{ status: "idle" \| "working" \| "ready" \| "error", publicCount, protectedCount, message }`. |
| `editedListId` | Lista edytowana w panelu admina = lista docelowa katalogu. |
| `restoredEditedListId` | Lista edytowana z poprzedniej wizyty; czeka, aż dane z bazy ją przyniosą (ustawienia wczytują się po starcie). Kasowana przy świadomym wyborze listy. |
| `renamingListId` | Lista, której nazwa jest właśnie edytowana. |
| `folderTree` | `{ roots, index }` z `buildFolderTree()`. |
| `excludedPaths` | Zbiór ścieżek folderów wykluczonych z katalogu. |
| `expandedPaths` | Zbiór rozwiniętych folderów drzewa. |
| `treeSearch`, `catalogSearch`, `catalogScope`, `catalogTier`, `editorSearch` | Filtry. |
| `catalogLimit`, `catalogResults` | Paginacja katalogu (po 200) i ostatnie wyniki (do zaznaczania zakresem). |
| `selectedItemIds`, `lastSelectedIndex` | Zaznaczenie w katalogu. |
| `expandedMembers` | Pozycje katalogu z rozwiniętą linią „Na listach: …”. |
| `foldersCollapsed`, `foldersOpen` | Szyna folderów (≥1280 px) / otwarta szuflada (<1280 px). |
| `adminTab` | `catalog` \| `lists` \| `preview` (zakładki <1024 px). |
| `previewDevice`, `previewFollow`, `previewCollapsed`, `previewListId` | Podgląd. |
| `toolsMenuOpen` | Menu „Narzędzia”. |
| `userListId` | Lista wyświetlana w widoku użytkownika (nie jest zapamiętywana między odświeżeniami). |

## 16. Pamięć interfejsu admina

Zapis działa tylko w panelu admina.

`saveAdminUi()` → `localStorage["audio.admin.ui"]`:

```text
{ foldersCollapsed, expandedPaths: [..] | null, editedListId, previewDevice, previewFollow, previewCollapsed, adminTab }
```

`saveAdminFilters()` → `sessionStorage["audio.admin.filters"]` (tak jak Filtr Globalny w DataVault — filtry żyją do zamknięcia karty):

```text
{ excludedPaths: [..], treeSearch, catalogSearch, catalogScope, catalogTier }
```

`restoreAdminState()` (przy starcie) odtwarza oba obiekty z walidacją wartości i wpisuje filtry do pól formularza. `editedListId` trafia do `restoredEditedListId` i jest stosowane w `onSettingsChanged()`, gdy lista pojawi się w danych.

Głośność kafelków nie jest zapisywana nigdzie — po odświeżeniu każdy kafelek ma 100%.

## 17. Odtwarzanie

### 17.1 Klucze odtwarzaczy

Odtwarzacze są przypisane do stałego klucza tekstowego, a nie do elementu strony:

```js
const makeKey = (context, listId, itemId) => `${context}|${listId}|${itemId}`;
```

| Kontekst | Miejsce |
| --- | --- |
| `user` | prawdziwy widok użytkownika |
| `prev` | podgląd w panelu admina |
| `cat` | przycisk odsłuchu w katalogu (`listId` puste) |
| `ed` | przycisk odsłuchu w edytorze listy |

Dzięki temu przerysowanie (zmiana z bazy, zmiana zakładki, zmiana języka) nie gubi grającego dźwięku: nowy element z tym samym `data-key` od razu dostaje jego stan i da się go zatrzymać. Ten sam dźwięk na dwóch listach to dwa niezależne odtwarzacze z osobną głośnością.

| Mapa | Zawartość |
| --- | --- |
| `players` | `key → { item, audio, gainNode, loop, lastKey }` — grające dźwięki. |
| `loadingKeys` | `key → { loop }` — dźwięki w trakcie startu (podpis, pobranie). |
| `volumes` | `key → wartość suwaka -100..100` — tylko na czas sesji strony. |
| `volumeClicks` | `key → czas ostatniego kliknięcia` wartości głośności. |
| `playbackGeneration` | `key → licznik` — ochrona przed wyścigiem przy starcie asynchronicznym. |

### 17.2 Start, pętla i zatrzymanie

`startPlayback(key, item, { loop, previousKey })`:

1. `bumpGeneration(key)`; losowanie wariantu `pickRandomVariant(item, previousKey)`;
2. jeżeli dźwięk nie grał: `loadingKeys.set(key, { loop })` → kafelek w stanie „wczytywanie”;
3. `resolveVariantUrl()`; błąd `gate_unauthorized` → bramka z `accessExpired`; inny błąd → `alert(alertPlaybackFailed)`;
4. jeżeli w międzyczasie zmieniło się pokolenie (kliknięto coś innego) — wynik jest porzucany;
5. `new Audio()`; dla warstwy chronionej `audio.crossOrigin = "anonymous"` **przed** ustawieniem `src` (inaczej `createMediaElementSource` skazi graf Web Audio i dźwięk z bramki będzie cichy);
6. `AudioContext` (wznawiany przy `suspended`) → `createMediaElementSource(audio)` → `GainNode` → `destination`;
7. zapis w `players`, usunięcie z `loadingKeys`, `refreshKey(key)`;
8. `timeupdate` → pasek postępu; `ended` → przy `loop` nowe `startPlayback` z kolejnym wariantem (bez stanu „wczytywanie”, żeby kafelek nie migał), inaczej `stopPlayback`; `error` / odrzucone `play()` → alert i zatrzymanie.

`pickRandomVariant(item, previousKey)` zwraca **obiekt wariantu**: przy jednym wariancie ten wariant; przy wielu losuje do 8 razy wariant, którego klucz (`getVariantKey` = `url` albo `path`) różni się od poprzedniego, a w ostateczności bierze pierwszy różny.

| Funkcja | Działanie |
| --- | --- |
| `togglePlayback(key, itemId)` | Grający / wczytywany → stop; pozycja spoza manifestu przy zablokowanym archiwum → bramka z `accessMissingItem`; inaczej start. |
| `toggleLoop(key, itemId)` | Grający w pętli → stop; grający bez pętli → włącza pętlę bez restartu; wczytywany → przełącza flagę pętli; nieaktywny → start w pętli. |
| `stopPlayback(key)` | Pauza, `currentTime = 0`, usunięcie z map, `bumpGeneration`, odświeżenie. |
| `stopAllPlayback()` | Zatrzymuje wszystkie klucze z `players` i `loadingKeys` (wszystkie konteksty). |
| `pruneOrphanPlayers()` | Zatrzymuje dźwięki (poza kontekstem `cat`), których lista albo wpis zniknęły. |

### 17.3 Głośność

- Suwak `-100..100`, krok 1, wartość domyślna `0`.
- `volumeToGain(v) = (v + 100) / 100` → wzmocnienie `0..2` (0% … 200%); `volumeToPercent` pokazuje procent obok suwaka.
- Głośność idzie przez `GainNode`, bo iPhone i iPad ignorują `audio.volume`; `audio.volume` (obcięte do 0..1) zostaje tylko dla przeglądarek bez `AudioContext`.
- `handleVolumeValueClick(key)` — dwa kliknięcia w wartość procentową w ciągu 450 ms (`VOLUME_RESET_DOUBLE_CLICK_MS`) przywracają 100%. Własne wykrywanie zamiast `dblclick`, którego część ekranów dotykowych nie wysyła.

### 17.4 Wskaźniki i blokada ekranu

`updatePlaybackIndicators()` po każdej zmianie:

- przyciski `.stop-all`: `disabled` przy zerze, klasa `is-active`, licznik `(N)` i `aria-label`,
- zakładki `.uv-tab`: klasa `has-playing` (czerwona kropka), gdy gra którykolwiek klucz `kontekst|lista|…`; `title` = pełna nazwa listy, z dopiskiem `tabPlaying`, gdy coś gra,
- `updateWakeLock()`: `navigator.wakeLock.request("screen")`, gdy gra co najmniej jeden dźwięk i karta jest widoczna; zwolnienie, gdy nic nie gra. `visibilitychange` wywołuje ponowne sprawdzenie (przeglądarka zwalnia blokadę przy ukryciu karty). Brak API — funkcja nic nie robi.

`syncPlaybackElement(element)` przenosi stan na element z `data-key`:

- kafelek `.tile`: `data-state` (`idle` / `loading` / `playing`; `missing` zostaje), ikona `▶` / `…` / `■`, `aria-pressed` i `aria-label` przycisku odtwarzania, stan Loop (`is-looping`, `aria-pressed`), pasek postępu, suwak i wartość głośności,
- przycisk `.play-btn` w katalogu/edytorze: klasy `is-playing` / `is-loading`, ikona, `aria-pressed`, `title`.

## 18. Panel admina

### 18.1 Nagłówek i komunikaty

- `#unlockLibrary` — otwiera bramkę; ukryty po odblokowaniu.
- Menu „Narzędzia” (`#toolsMenuButton`, `#toolsMenuList`, `aria-expanded`): `#reloadManifest` (ponowne `loadManifests()`), `#buildManifests`, `#exportSettings`, `#reloadLocal` (widoczny tylko w trybie lokalnym), `#clearAllAliases` (z potwierdzeniem). Zamykane kliknięciem poza menu, wyborem pozycji i `Escape`.
- Pastylki `renderStatus()`: `#manifestStatus` (`Manifest: N pozycji` / błąd listy publicznej), `#firebaseStatus`, `#listsStatus` (`Listy: N`), `#libraryStatus` (zablokowane / odblokowane / błąd), `#builderStatus`. Czerwień (`.is-error`) wyłącznie dla błędów; szczegół w `title`.
- `#adminNotices` (`renderNotices`): `noticeLegacy` (dane w starym formacie pominięte) i `noticeArchiveLocked` (archiwum zablokowane — wpisy chronione są widoczne jako „(brak w manifeście)” i nie zostaną usunięte). Każdy komunikat ma przycisk ✕; zamknięcie działa do odświeżenia strony.

### 18.2 Warsztat i układ

`#workbench` to siatka `var(--folders-w) minmax(0, 1fr) var(--lists-w)` o wysokości `calc(100dvh - 24px)` (min. 640 px); każda kolumna przewija się osobno (`.col-body`), nagłówki kolumn (`.col-head`) stoją w miejscu.

`renderLayoutState()` ustawia: `body[data-admin-tab]`, aktywną zakładkę, klasę `is-folders-collapsed` (tylko ≥1280 px), `is-collapsed` / `is-drawer-open` panelu folderów, tło szuflady, dostępne szerokości podglądu (`getAvailableDevices()`: Tablet, gdy okno > 860 px; Telefon, gdy > 430 px), `data-device` ramki, zwinięcie podglądu i stan `#previewFollow`. Wywoływane także przy `resize` (debounce 120 ms).

| Szerokość okna | Układ |
| --- | --- |
| ≥ 1600 px | 3 kolumny: foldery 280 px, katalog, listy 420 px. |
| 1280–1599 px | 3 kolumny: 240 px, katalog, 380 px. |
| 1024–1279 px | 2 kolumny: katalog i listy (`minmax(320px, 380px)`); foldery jako szuflada z lewej (`min(360px, 90vw)`) otwierana przyciskiem „Foldery” w nagłówku katalogu, zamykana ✕, tłem albo `Escape`. |
| < 1024 px | Zakładki Katalog / Listy / Podgląd (sticky pod paskiem zapisu); widoczny jeden panel, strona przewija się w całości; pasek zaznaczonych przykleja się do dołu. |
| < 720 px | Wiersz katalogu w dwóch liniach (nazwa na całą szerokość, pod nią licznik list), bez plakietki warstwy; pole aliasu w osobnej linii; menu „Narzędzia” rozwija się od lewej. |

Przy szerokości ≥ 1280 px panel folderów można zwinąć przyciskiem `«` do szyny 44 px z pionowym napisem „Foldery”; kliknięcie szyny (`»`) rozwija go z powrotem. Stan zwinięcia jest zapamiętywany.

### 18.3 Drzewo folderów

Model:

- `buildFolderTree(items)` tworzy węzeł dla każdej ścieżki z `tagPaths` (`{ path, name, depth, parent, children, ownCount, totalCount }`). `ownCount` — dźwięki leżące bezpośrednio w folderze (najgłębsza ścieżka), `totalCount` — w całym poddrzewie. Dźwięki bez folderu trafiają do węzła `__no_folder__` („(bez folderu)”), sortowanego na koniec; pozostałe węzły sortowane po nazwie.
- Filtr to zbiór **wykluczonych** ścieżek `excludedPaths`. Dźwięk jest widoczny w katalogu, gdy jego `folderPath` nie jest wykluczony. Dzięki temu zaznaczenie podfolderu działa także przy odznaczonym rodzicu, a folder z własnymi dźwiękami i podfolderami jest obsłużony poprawnie.
- `computeTreeStats()` liczy od liści w górę stan każdego węzła: `all` (folder i poddrzewo widoczne), `none`, `some` (mieszany) oraz liczbę widocznych dźwięków. Checkbox: `checked` dla `all`, `indeterminate` dla `some` (ustawiane właściwością po wstawieniu HTML).
- Kliknięcie checkboxa: stan `all` → `setSubtreeIncluded(node, false)` (wyklucza całe poddrzewo), stan `none` albo `some` → włącza całe poddrzewo.
- Licznik przy folderze: `(N)` albo `(widoczne/N)`, gdy część jest ukryta.
- „tylko” (`tree-only`) → `excludeAllFolders()` + włączenie poddrzewa. Przy myszy przycisk pojawia się po najechaniu na wiersz albo przy fokusie; na ekranach dotykowych jest widoczny stale.
- „Zaznacz wszystko” czyści `excludedPaths`; „Odznacz wszystko” wyklucza każdy folder z `ownCount > 0`; „Rozwiń/Zwiń wszystko” zmienia `expandedPaths`; ▸/▾ przełącza jeden folder.

Wyszukiwanie (`getTreeSearch()`, debounce 150 ms):

- fraza jest składana `toNeedle()` (`foldPolish` + `trim`); sama spacja nie jest filtrem,
- pasują węzły, których nazwa zawiera frazę; widoczne są węzły pasujące, ich całe poddrzewa i przodkowie; przodkowie są wymuszenie rozwinięci (`forced`), pasujące węzły zachowują własny stan rozwinięcia,
- dopasowanie jest wyróżnione `<mark>` (`highlightMatch`, poprawne także dla polskich znaków),
- pod polem pojawiają się akcje „Zaznacz pasujące”, „Odznacz pasujące”, „Tylko pasujące” (działają na poddrzewa pasujących węzłów),
- wyszukiwanie zmienia tylko to, co widać w drzewie — nie filtruje katalogu.

Niebieskie sygnały: etykieta „Szukaj folderu” (`field-label--active`) przy aktywnej frazie; tytuł „Foldery” (`is-filter-on`) i niebieskie kropki (`#foldersTitleDot`, `#foldersRailDot` na szynie, `#openFoldersDot` na przycisku szuflady), gdy choć jeden folder z dźwiękami jest wykluczony. `title` podaje „Katalog pokazuje dźwięki z X z Y folderów”.

`onFolderFilterChanged()` resetuje paginację, zapisuje filtry, rysuje drzewo i katalog.

### 18.4 Katalog

`getCatalogResults(targetIds)` stosuje filtry w kolejności: folder (`excludedPaths`) → warstwa (`catalogTier`: `all` / `public` / `protected`) → zakres (`catalogScope`: `all` / `outside` — spoza listy docelowej / `inside` — z listy docelowej) → fraza (w `searchText`, a gdy nie pasuje — w aliasach tego dźwięku ze wszystkich list).

Lista docelowa (`#targetList`) jest zawsze tą samą listą co edytowana (`setEditedList`).

Wiersz `.cat-row` (paginacja po 200, przycisk „Pokaż kolejne N”):

| Element | Działanie |
| --- | --- |
| `.cat-check` | Zaznaczenie; z `Shift` — zakres od ostatnio klikniętego (`handleCatalogSelection`). `Ctrl`/`Cmd` + kliknięcie nazwy przełącza zaznaczenie. |
| `.play-btn` (`cat|…`) | Odsłuch bez dodawania. |
| `.cat-title` | Nazwa z `(N)`; nie kurczy się, dopóki nie zajmie 65% wiersza. |
| `.cat-meta` | Ścieżka (`tags` od drugiego, łączone ` › `) i nazwa pliku; pełna ścieżka w `title`. |
| `.chip--tier` | „demo” / „archiwum”. |
| `.chip--members` | Liczba list z tym dźwiękiem; `title` z nazwami list i aliasami; kliknięcie rozwija linię `.cat-members`. Wyróżniona, gdy dźwięk jest na liście docelowej. |
| `.add-btn` | `+` dodaje na koniec listy docelowej; `✓` usuwa (z potwierdzeniem, jeżeli wpis ma alias). |

„Zaznacz wszystkie wyniki” pyta o potwierdzenie powyżej 50 wyników (`SELECT_ALL_CONFIRM_THRESHOLD`). Pasek `#bulkBar` (licznik, „Dodaj do „lista””, „Odznacz”) jest ostatnim elementem kolumny, więc zawsze widoczny; dodanie zbiorcze zachowuje kolejność katalogu i pomija dźwięki już obecne. Podsumowanie `#catalogSummary`: „Foldery: X z Y” (niebieskie przy aktywnym filtrze) · „Wyniki: N z M”. Etykieta „Szukaj dźwięku” świeci na niebiesko przy aktywnej frazie.

Klawisz `/` (poza polami tekstowymi, przy zamkniętej bramce) przenosi fokus do wyszukiwarki katalogu, a na wąskim ekranie przełącza na zakładkę Katalog.

### 18.5 Panel list

`renderLists()` rysuje wiersz `.list-row` na każdą listę:

- lista główna: pinezka 📌, plakietka „lista główna”, bez uchwytu i strzałek, zawsze pierwsza,
- pozostałe: uchwyt `⠿` (`.drag-handle`, `touch-action: none`), nazwa (przycisk wyboru), licznik wpisów, ▲/▼ (▲ wyłączone na pozycji 1, ▼ na ostatniej),
- aktywna lista ma klasę `is-active` (zielone tło i poświata),
- dwuklik nazwy → wybór i zmiana nazwy.

„+ Nowa lista” tworzy listę, wybiera ją i od razu otwiera pole nazwy. Na ekranie < 1024 px wybór listy przewija do edytora.

### 18.6 Edytor listy

Nagłówek (`#editorHead`): tytuł (dla listy głównej z podpisem „lista główna”), ✎ zmiana nazwy, ⧉ duplikat, 🗑 usunięcie (poza listą główną, z potwierdzeniem podającym liczbę wpisów i aliasów), licznik wpisów, „Wyczyść aliasy tej listy” (z potwierdzeniem, wyłączony bez aliasów).

Zmiana nazwy (`startRename` / `commitRename` / `cancelRename`): pole z `maxlength = 60`, `Enter` lub opuszczenie pola zapisuje, `Esc` anuluje. Pusta nazwa listy ulubionych przywraca poprzednią; pusta nazwa listy głównej oznacza nazwę domyślną.

Wpis `.entry`:

| Element | Działanie |
| --- | --- |
| `⠿` | Uchwyt przeciągania (wyłączony przy aktywnym wyszukiwaniu). |
| `N.` | Pozycja na liście. |
| `.play-btn` (`ed|lista|dźwięk`) | Odsłuch. |
| Tytuł | Nazwa z `(N)` i wyróżnieniem frazy; dla wpisu spoza manifestu „(brak w manifeście)” i `itemId` w `<code>`. |
| Ścieżka | Foldery dźwięku. |
| `.alias-input` | Alias na tej liście (`maxlength = 80`). Zapis na zdarzenie `change` (opuszczenie pola albo `Enter`); `Esc` przywraca wartość sprzed edycji. Podpowiedzi z `<datalist id="aliasSuggestions">` — aliasy tego dźwięku z innych list, budowane przy wejściu w pole. |
| ⤒ ▲ ▼ ⤓ | Na początek / wyżej / niżej / na koniec. |
| ✕ | Usunięcie wpisu (bez potwierdzenia). |
| „Na innych listach: …” | Nazwy innych list z tym dźwiękiem i aliasy na nich („bez aliasu”, gdy brak). |

Wyszukiwanie na liście (debounce 100 ms) zawęża wpisy po nazwie, aliasie i pliku (dla wpisu spoza manifestu po aliasie i `itemId`). Przy aktywnej frazie strzałki i przeciąganie są wyłączone, a etykieta świeci na niebiesko i pojawia się podpowiedź `editorReorderLocked` — kolejność zmienia się tylko na pełnej liście, bo indeksy wpisów muszą odpowiadać pozycjom.

### 18.7 Przeciąganie (SortableJS)

`initSortables()` po załadowaniu biblioteki tworzy dwie instancje:

| Instancja | Kontener | Opcje | `onEnd` |
| --- | --- | --- | --- |
| `listsSortable` | `#listsList` | `handle: ".drag-handle"`, `draggable: ".list-row"`, `animation: 150`, `onMove` blokuje upuszczenie przed listą główną | `moveListTo(id, newIndex)` → `persistAndRender()`, inaczej `renderLists()` |
| `entriesSortable` | `#editorEntries` | `handle: ".drag-handle"`, `draggable: ".entry"`, `animation: 150`, `disabled` przy aktywnym wyszukiwaniu | `moveEntry(edytowana, oldIndex, newIndex)` → `persistAndRender()`, inaczej `renderEditor()` |

`renderEditor()` aktualizuje `entriesSortable.option("disabled", locked)`. Klasy `.sortable-ghost` (miejsce upuszczenia, przerywana ramka) i `.sortable-chosen` (poświata) są w `style.css`.

### 18.8 Zachowanie fokusu

`withPreservedFocus(container, render)` zapamiętuje element z fokusem (po atrybucie `data-focus-key`, np. `alias:<itemId>`, `entry-up:<itemId>`, `tree-check:<path>`), a dla pól tekstowych — wartość i zaznaczenie; po przerysowaniu przywraca fokus, wpisany tekst i kursor. Dzięki temu zmiana przychodząca z bazy w trakcie pisania aliasu nie kasuje tekstu, a przesuwanie wpisu strzałkami z klawiatury nie gubi fokusu.

### 18.9 Podgląd

- `renderPreview()` wywołuje `renderUserView(#previewView, "prev")` — tę samą funkcję co prawdziwy widok.
- „podąża za edytowaną listą” (`previewFollow`, domyślnie włączone): podgląd pokazuje listę edytowaną, a kliknięcie zakładki w podglądzie zmienia listę edytowaną. Wyłączone — podgląd ma własną listę (`previewListId`).
- Szerokość: Komputer (pełna), Tablet (820 px), Telefon (390 px) — `data-device` na `#previewFrame` ustawia `max-width`; widok w środku reaguje przez zapytania kontenerowe, więc wygląda jak na danym urządzeniu. Przyciski szerokości węższych od okna są ukrywane.
- „Otwórz prawdziwy widok ↗” — link `index.html` w nowej karcie.
- „Zwiń podgląd” / „Rozwiń podgląd” — zwinięty podgląd nie jest rysowany.
- Odtwarzanie w podglądzie działa naprawdę (kontekst `prev`), niezależnie od katalogu i edytora.

## 19. Widok użytkownika

`renderUserView(root, context)` rysuje:

```text
.uv[data-ctx]
  .uv-bar
    .uv-brand                     „Audio”
    .uv-tabs[role=tablist]        .uv-tab na każdą listę (lista główna pierwsza)
    .uv-actions
      .stop-all                   ■ Zatrzymaj wszystko (N)
      .unlock-btn                 🔒 Odblokuj archiwum (tylko context=user i zablokowane archiwum)
  .uv-grid | .uv-empty            kafelki albo „Na tej liście nie ma jeszcze dźwięków.”
```

- Lista aktywna: `state.userListId` (widok) albo `getPreviewListId()` (podgląd); nieistniejąca → pierwsza lista. Po odświeżeniu strony widok zaczyna od listy głównej.
- Przewijanie paska zakładek jest zachowywane między przerysowaniami, a aktywna zakładka jest doprowadzana do widoku tylko w poziomie (bez przewijania strony).
- `selectViewList(context, listId)` — zmiana listy; w podglądzie przy `previewFollow` zmienia listę edytowaną.
- Zmiana zakładki nie zatrzymuje dźwięków: grające dźwięki z innych list sygnalizuje czerwona kropka na zakładce.

Kafelek (`renderTile`):

```text
article.tile[data-key][data-item-id][data-state]
  button.tile-play                  cała górna część kafelka; title = pełny napis
    .tile-icon                      ▶ / … / ■ / 🔒
    .tile-title                     Nazwa (alias) (N) — do 3 wierszy
    .tile-tag                       tag2 (jeden tag)
    .tile-status                    „wczytywanie…” / „(brak w manifeście)”
  .tile-progress > span             pasek postępu
  .tile-controls
    input.volume-slider             -100..100
    button.tile-volume              „100%” (dwuklik → 100%)
    button.loop-btn                 ⟳ Loop
```

Napis tytułu: `buildTitleText(label, alias, groupCount)` = `Nazwa (alias) (N)`; w HTML alias ma klasę `.sample-alias`, a `(N)` — `.group-count`. Przesunięcie suwaka nigdy nie uruchamia dźwięku (suwak leży poza przyciskiem odtwarzania).

| `data-state` | Wygląd |
| --- | --- |
| `idle` | Zielona ramka, ikona ▶. |
| `loading` | Przerywana ramka, pulsująca ikona …, napis „wczytywanie…”. |
| `playing` | Czerwona ramka z poświatą, czerwone ikona ■ i nazwa, czerwony pasek postępu (przesuwający się, gdy długość nieznana). |
| `missing` | Przygaszony kafelek, ikona 🔒, nazwa = alias albo `itemId`, napis „(brak w manifeście)”, bez suwaka i Loop. Kliknięcie przy zablokowanym archiwum otwiera bramkę. |

`bindUserViewEvents(root, context)` obsługuje `uv-select`, `uv-stop-all`, `uv-unlock`, `uv-play`, `uv-loop`, `uv-volume-reset` (kliknięcia) i `uv-volume` (`input`). Ta sama funkcja jest podpięta do `#userView` (`user`) i `#previewView` (`prev`).

## 20. Style i layout

### 20.1 Paleta (`:root` w `style.css`)

| Zmienna | Wartość | Użycie |
| --- | --- | --- |
| `--bg` | 2 × `radial-gradient` zieleni + `#031605` | tło strony |
| `--panel` | `#000` | nagłówek, kolumny, pasek widoku |
| `--panel-alt` | `#041b08` | kafelki |
| `--border` / `--accent` | `#16c60c` | ramki, akcent |
| `--accent-dark` | `#0d7a07` | — |
| `--accent-strong` | `#1ee616` | ikony, fokus, aktywne elementy |
| `--text` | `#9cf09c` | tekst |
| `--muted` | `rgba(156, 240, 156, 0.7)` | teksty pomocnicze |
| `--danger` | `#ff5f5f` | odtwarzanie, Loop, błędy, `(N)` |
| `--glow` | `0 0 25px rgba(22, 198, 12, 0.45)` | nagłówek admina |
| `--shadow` | `0 8px 24px rgba(0, 0, 0, 0.45)` | kolumny, kafelki, menu |
| `--radius` | `12px` | panele |
| `--filter-on` | `#3D8FC4` | aktywny filtr (etykiety, tytuł) |
| `--filter-on-bright` | `#6FB3E0` | kropki, `<mark>`, podpowiedź edytora |
| `--filter-on-glow` | `rgba(61, 143, 196, 0.40)` | poświata |
| `--filter-on-bg-active` | `rgba(61, 143, 196, 0.20)` | tło `<mark>` |
| `--filter-on-border`, `--filter-on-bg` | `rgba(61,143,196,.55)`, `rgba(61,143,196,.10)` | zarezerwowane dla spójności z DataVault |
| `--folders-w` / `--lists-w` | 260 / 400 px (1600+: 280 / 420; 1280–1599: 240 / 380) | kolumny warsztatu |

Niebieski oznacza w module wyłącznie „filtr jest założony”. Czerwień oznacza odtwarzanie albo błąd. Alias: `#d2fad2`.

### 20.2 Typografia

Font: `"Fira Code", "Consolas", "Source Code Pro", monospace` (Fira Code 400/600 z Google Fonts). Rozmiary: tytuł admina `clamp(20px, 2.6vw, 28px)` uppercase, `letter-spacing: 0.1em`; tytuły kolumn 14 px uppercase; tekst 13 px; meta 11–12 px; przyciski 13 px (`.btn-small` 11 px) uppercase z `letter-spacing: 0.06em`; nazwa na kafelku 15 px / 600, `line-clamp: 3`.

### 20.3 Szerokość strony

- `.page`: `max-width: 1280px`, `padding: 20px 24px 40px`, kolumna z `gap: 16px`,
- panel admina: `max-width: 1760px`,
- widok użytkownika: bez limitu, `padding: clamp(8px, 2vw, 24px)`, `gap: 10px`.

### 20.4 Widok użytkownika — zapytania kontenerowe

`.uv` ma `container-type: inline-size; container-name: uv`, więc widok reaguje na szerokość **swojego kontenera**, a nie okna — dzięki temu podgląd 390 px wygląda jak telefon.

| Warunek | Zmiana |
| --- | --- |
| zawsze | Siatka `repeat(auto-fill, minmax(min(100%, 250px), 1fr))`, `gap: 12px` — liczba kolumn wynika z szerokości. |
| `@container uv (max-width: 1023px)` | Zakładki w osobnym, pełnym wierszu paska (`order: 3`), jeden rząd przewijany w bok ze `scroll-snap`. |
| `@container uv (max-width: 559px)` | Przyciski „Zatrzymaj wszystko” i „Odblokuj archiwum” pokazują same ikony (nazwa w `aria-label` i `title`), mniejsze odstępy. |
| `.uv[data-ctx="user"] .uv-bar` | Pasek przyklejony (`position: sticky; top: var(--wg-write-status-height, 0px)`) tylko w prawdziwym widoku. |

Zakładka: maks. 260 px z wielokropkiem; aktywna — tło `rgba(22,198,12,.25)`, ramka `--accent-strong`, tekst `#d2ffd2`. Kropka odtwarzania: 7 px, `--danger`, w prawym górnym rogu.

### 20.5 Ekrany dotykowe i ruch

- `@media (pointer: coarse)`: przyciski, zakładki ≥ 44 px wysokości; przyciski ikonowe, odsłuchu i dodawania 40 × 40 px; wiersz drzewa 40 px; checkboxy 20 px; pola i selecty ≥ 40 px, 15 px tekstu (bez automatycznego powiększania na iOS); suwak 32 px z uchwytem 26 px.
- `@media (hover: hover) and (pointer: fine)`: przycisk „tylko” w drzewie tylko po najechaniu/fokusie.
- `@media (prefers-reduced-motion: reduce)`: bez pulsowania ikony, bez animacji paska i przejścia szuflady.
- Fokus klawiatury: `outline: 2px solid var(--accent-strong)` z odstępem 2 px na wszystkich elementach sterujących.
- `[hidden] { display: none !important; }` — atrybut `hidden` wygrywa z każdą regułą `display`.

### 20.6 Bramka

Wygląd pochodzi z `shared/access-gate.css`. Moduł dodaje `.accessGate__skip` (lewa kolumna drugiego wiersza siatki; poniżej 640 px — wiersz 4, pełna szerokość) oraz `.btn.primary` (tło `--text`, tekst `#031605`).

## 21. i18n

- `translations.pl` i `translations.en` — płaskie słowniki z tym samym zestawem kluczy; `t(key, vars)` wstawia `{zmienne}`, brakujący klucz spada na polski, a potem na sam klucz.
- Teksty statyczne w HTML mają atrybuty `data-i18n` (tekst), `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-aria-label`; `applyLanguage(lang)` przepisuje je wszystkie, ustawia `<html lang>`, przekazuje język do `writeStatus.setLanguage()` i woła `renderAll()`.
- Językiem domyślnym jest polski (`currentLanguage = "pl"`); język nie jest zapamiętywany.
- Jedyny przełącznik `#languageSelect` stoi w `.page-top` w kontenerze `<div class="language-switcher language-switcher--hidden">` (komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`). Usunięcie klasy `language-switcher--hidden` pokazuje go w obu trybach.
- Nazwy list i aliasy są danymi i nie są tłumaczone. Wyjątek: pusta nazwa listy głównej wyświetla się jako „Widok główny” / „Main view”.
- Teksty paska o awarii bazy są w `shared/firebase-write-status.js`, nie w `translations`.
- Język lore Warhammera 40k jest używany wyłącznie w oknie bramki (tytuł, opis, „Litania Dostępu”, „Rozpocznij Rytuał”, komunikaty o haśle). Panel admina i komunikaty diagnostyczne mówią językiem zwykłym.

## 22. Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Brak `window.firebaseConfig` / `apiKey` | Praca na `localStorage`, pastylka „Firebase: brak konfiguracji”, plakietka „Tylko to urządzenie”, łagodny pasek. |
| Wyjątek przy starcie SDK | Praca lokalna; manifesty wczytują się mimo to (start Firebase jest w osobnym `try`). |
| Brak dokumentu `audio/favorites` | Powstaje dokument v2 z pustą listą główną. |
| Dokument w starym formacie | Traktowany jak pusty, nic nie jest zapisywane przy odczycie, komunikat `noticeLegacy`. Pierwsza zmiana zapisuje v2. |
| Odmowa zapisu do Firestore | Zapis lokalny, `usingFirestore = false`, pasek „zapisano tylko na tym urządzeniu”; interfejs pokazuje aktualny stan. |
| Nieudany zapis również lokalnie | Pasek „nie zapisano nic”. |
| Błąd nasłuchu Firestore | Ustawienia lokalne, pasek z przyczyną. |
| Uszkodzone ustawienia | `normalizeSettingsV2` naprawia albo zwraca puste ustawienia. |
| Wpis wskazuje dźwięk spoza manifestu | Wpis i alias zostają; edytor: „(brak w manifeście)” + `itemId`; kafelek w stanie `missing`. |
| Brak `AudioManifest.json` | `publicError` z kodem HTTP, czerwona pastylka; archiwum wczytuje się mimo to. |
| Bramka niedostępna przy ważnej sesji | Warstwa demo działa, `libraryError`, czerwona pastylka archiwum. |
| `401` z bramki | Sesja kasowana; przy odtwarzaniu bramka z `accessExpired`. |
| Obie warstwy puste | Katalog: „Manifest nie zawiera dźwięków.”, pastylka „Manifest: błąd wczytywania”. |
| Brak adresu wariantu | `alert(alertMissingAudio)`. |
| Błąd odtwarzania | `alert(alertPlaybackFailed)` i zatrzymanie kafelka. |
| Brak Web Audio | Głośność przez `audio.volume` (maks. 100%). |
| Brak Wake Lock API | Ekran może się wygaszać; odtwarzanie działa. |
| SortableJS niedostępny | Kolejność tylko strzałkami. |
| JSZip niedostępny | Komunikat `builderErrorLibrary`. |
| Brak `localStorage` / `sessionStorage` | Moduł działa bez zapamiętywania. |
| Pusty katalog po filtrach | „Brak wyników dla ustawionych filtrów.” |
| Brak pasujących folderów | „Żaden folder nie zawiera wpisanej frazy.” |
| Pusta lista | Edytor: „Lista jest pusta…”; widok: „Na tej liście nie ma jeszcze dźwięków.” |

## 23. Procedura odtworzenia modułu 1:1

1. Odtwórz pliki `Audio/index.html`, `Audio/style.css` i `Audio/app.js` zgodnie z rozdziałami 2–21 (struktura znaczników z rozdziałów 18–19, style z rozdziału 20, logika z rozdziałów 5–19).
2. Zapewnij pliki wspólne: `shared/access-gate.css`, `shared/firebase-write-status.js`, `shared/firebase-write-status.css`, `shared/appcheck-config.js`, `shared/firebase-app-check.js` oraz ikonę `IkonaPowiadomien2.png` w katalogu głównym repozytorium.
3. Utwórz `Audio/config/firebase-config.js` z `window.firebaseConfig` projektu Firebase (instrukcja: `Audio/config/FirebaseREADME.md`) i ustaw reguły Firestore dopuszczające dokument `audio/favorites`.
4. Wdróż `Audio/worker/audio-gate.js` jako Worker `audio-gate`, ustaw cztery zmienne środowiskowe (rozdział 9.1) i wpisz adres Workera w stałej `AUDIO_GATE_BASE`.
5. Trzymaj arkusz `AudioManifest.xlsx` poza tym repozytorium. Otwórz `Audio/index.html?admin=1`, użyj „Narzędzia → Zbuduj manifesty z XLSX”, skopiuj `AudioManifest.json` do folderu `Audio`, a `audio-manifest.json` do katalogu głównego prywatnego repozytorium `AudioRPG`.
6. Odśwież panel admina: pastylka manifestu pokazuje liczbę pozycji; po odblokowaniu archiwum — pełną liczbę.
7. Odtwórz listy: nazwij listę główną (opcjonalnie), utwórz listy, dodaj dźwięki z katalogu, ułóż kolejność, nadaj aliasy.
8. Wyeksportuj ustawienia („Narzędzia → Eksportuj ustawienia (JSON)”) jako kopię zapasową.
9. Otwórz `Audio/index.html` i sprawdź zakładki, kafelki, odtwarzanie, Loop, głośność i „Zatrzymaj wszystko”.
10. Sprawdź tryb lokalny: tymczasowo usuń `apiKey` z konfiguracji i potwierdź zapis w `audio.settings`.

## 24. Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start admina | `Audio/index.html?admin=1` | Nagłówek z pastylkami, trzy kolumny (≥1280 px), podgląd na dole; brak błędów w konsoli. |
| Start użytkownika | `Audio/index.html` | Tylko pasek z zakładkami i siatka kafelków. |
| Nowa lista | „+ Nowa lista”, wpisz nazwę, `Enter` | Lista na końcu, nazwa zapisana, widoczna w zakładkach podglądu. |
| Alias per lista | Dodaj dźwięk X do trzech list; na drugiej nadaj alias „X2”, na trzeciej „X3” | Pierwsza lista: `X`; druga: `X (X2)`; trzecia: `X (X3)`; „Na innych listach” pokazuje aliasy. |
| Duplikat | ⧉ na liście z aliasami | Kopia zaraz po oryginale, z tymi samymi wpisami i aliasami. |
| Kolejność list | ▲/▼ i przeciąganie | Lista główna zawsze pierwsza; nie da się nic upuścić przed nią. |
| Kolejność wpisów | ⤒ ▲ ▼ ⤓ i przeciąganie | Kolejność zmienia się w edytorze, podglądzie i widoku użytkownika. |
| Blokada kolejności | Wpisz frazę w „Szukaj na liście” | Strzałki i uchwyty wyłączone, etykieta niebieska, widoczna podpowiedź. |
| Drzewo — grupa | Odznacz folder z podfolderami | Katalog ukrywa dźwięki całego poddrzewa; rodzic pokazuje stan wg dzieci; niebieski tytuł „Foldery” i kropki. |
| Drzewo — podgrupa | Przy odznaczonym rodzicu zaznacz podfolder | Rodzic w stanie mieszanym; katalog pokazuje tylko dźwięki podfolderu. |
| Wyszukiwanie folderów | Wpisz fragment nazwy (także wielkimi literami, bez polskich znaków) | Pasujące foldery z przodkami, `<mark>`, niebieska etykieta, akcje „… pasujące”. |
| Wyszukiwanie w katalogu | Wpisz fragment aliasu | Katalog znajduje dźwięk po aliasie z dowolnej listy. |
| Zaznaczanie zbiorcze | Zaznacz wiersz, `Shift` + kliknij inny, „Dodaj do …” | Cały zakres dodany na koniec listy docelowej bez duplikatów. |
| Usunięcie z aliasem | `✓` przy wpisie z aliasem | Pytanie o potwierdzenie; po zgodzie wpis i alias znikają. |
| Usunięcie listy | 🗑 | Potwierdzenie z liczbą wpisów i aliasów; edytor wraca do listy głównej. |
| Nazwa listy głównej | Zmień nazwę, potem wyczyść pole | Własna nazwa w zakładce; po wyczyszczeniu „Widok główny”. |
| Znaki specjalne | Alias `<b>x</b>` | Wyświetlany dosłownie, bez interpretacji HTML. |
| Podgląd | Przełącz Komputer / Tablet / Telefon | Ramka 820 / 390 px, układ jak na urządzeniu; odtwarzanie działa. |
| Odtwarzanie | Kliknij kafelek | Stan „wczytywanie” (dla archiwum), potem czerwona ramka, ■, pasek postępu; ponowne kliknięcie zatrzymuje. |
| Loop | Kliknij Loop | Dźwięk gra w pętli z losowaniem wariantów; przycisk czerwony; ponowne kliknięcie zatrzymuje. |
| Zmiana zakładki | Włącz dźwięk i przełącz listę | Dźwięk gra dalej; zakładka listy ma czerwoną kropkę; po powrocie kafelek pokazuje stan. |
| Zatrzymaj wszystko | Włącz kilka dźwięków | Licznik `(N)`; kliknięcie zatrzymuje wszystkie. |
| Głośność | Suwak na maksimum, dwuklik w wartość | 200%, potem 100%; po odświeżeniu 100%. |
| Pozycja z archiwum przy blokadzie | Kliknij kafelek z 🔒 | Bramka z wyjaśnieniem; wpis nie znika z listy. |
| Pominięcie bramki | „Pomiń”, odśwież | Bramka nie wraca; w nowej karcie wraca. |
| Logowanie | Poprawne hasło | Bramka znika, „Archiwum: odblokowane”, przycisk „Odblokuj archiwum” znika. |
| Stary format | Dokument z polami `favorites` / `mainView` / `aliases` | Puste listy, komunikat w panelu admina; brak zapisu przy odczycie; pierwsza zmiana zapisuje tylko `schemaVersion`, `playlists`, `updatedAt`. |
| Na żywo | Zmień listę w panelu admina przy otwartym widoku użytkownika | Widok użytkownika odświeża się sam. |
| Nieudany zapis | Zablokuj Firestore i dodaj listę | Pasek „Zapisano tylko na tym urządzeniu”, lista widoczna, dane w `audio.settings`. |
| Eksport | „Eksportuj ustawienia (JSON)” | Plik `audio-ustawienia-RRRR-MM-DD.json` z `schemaVersion`, `playlists`, `exportedAt`. |
| Generator: stabilność | Zbuduj manifesty z niezmienionego arkusza | Pliki identyczne z tymi w repozytoriach. |
| Generator: błędy | Arkusz bez kolumny / z duplikatem kolumny | Komunikat z nazwą kolumny; żaden plik nie powstaje; czerwona pastylka. |
| Telefon | Panel admina na ~390 px | Zakładki Katalog / Listy / Podgląd, szuflada folderów, wszystkie funkcje dostępne, brak przewijania w poziomie. |
| Język | Tymczasowo pokaż przełącznik i wybierz English | Wszystkie teksty interfejsu po angielsku; nazwy list bez zmian. |

---

# 🇬🇧 Technical documentation — Audio (EN)

## 1. Module purpose

`Audio` is a browser sound-effects player for game sessions and a panel for preparing what the players see.

The module:

- loads the sound catalogue from two tiers: public (demo) and password-protected (the archive behind a Cloudflare Worker gateway),
- groups variants of the same sound and picks a random variant on every playback,
- lets the admin panel arrange a **main list** and any number of **named lists**, order their sounds freely and give every entry an **alias that applies to that list only**,
- filters the catalogue with a folder tree (a tag hierarchy with group and subgroup selection) and a search box with the blue "filter active" signal,
- shows a preview of the user view at the bottom of the admin panel in three widths,
- saves settings in Firestore (document `audio/favorites`), falling back to `localStorage` without a database,
- plays sounds once or in a loop, with a separate volume for every tile,
- builds both manifests from an XLSX sheet directly in the browser.

The module consists of three interface files: `index.html` (markup), `style.css` (styles) and `app.js` (logic as an ES module).

## 2. Entry points

| Address | Mode | Content |
| --- | --- | --- |
| `Audio/index.html` | user view | Bar with list tabs, a "Stop all" button, optionally "Unlock archive", and the tile grid. |
| `Audio/index.html?admin=1` | admin panel | Header with status pills, a three-column workbench (Folders → Catalogue → Lists with the editor) and the user view preview. |

The mode is detected once, at start-up:

```js
const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";
```

`setModeVisibility()` adds the class `admin-mode` or `user-mode` to `<body>` and **removes from the document** every element of the other mode (`.user-only` in the admin panel, `.admin-only` in the user view). References in the `dom` object remain, but they point at detached elements, so writing to them breaks nothing.

The `Main` module links to the user view (`Main/index.html` → `../Audio/index.html`). The admin panel is opened manually by appending `?admin=1`.

## 3. File structure

| File or folder | Responsibility |
| --- | --- |
| `Audio/index.html` | Markup of both modes, the access gate and the preview. Static texts carry `data-i18n*` attributes. No embedded CSS or JS. |
| `Audio/style.css` | Every module style (both modes, preview, gate, responsiveness). |
| `Audio/app.js` | All logic (an ES module, about 4,300 lines with PL/EN comments). |
| `Audio/AudioManifest.json` | Public (demo) tier manifest with ready file URLs. Generated by the admin panel. |
| `Audio/worker/audio-gate.js` | Access gateway source (Cloudflare Worker `audio-gate`). |
| `Audio/config/firebase-config.js` | `window.firebaseConfig` of the Firebase project `audiorpg-2eb6f`. |
| `Audio/config/FirebaseREADME.md` | Firebase setup guide for the module. |
| `Audio/Disclaimer.md` | Note on the inspiration (Grimdark Audio Mixer) and the module's private, non-commercial nature. |
| `Audio/docs/README.md` | User guide. |
| `Audio/docs/Documentation.md` | This technical documentation. |
| `shared/access-gate.css` | Shared access gate look (DataVault, GeneratorNPC, Audio). |
| `shared/firebase-write-status.js` / `.css` | Shared failed-write/read message bar and working-mode badge (GeneratorNPC, Audio). |
| `shared/appcheck-config.js` | App Check (reCAPTCHA Enterprise) site keys of both Firebase projects. |
| `shared/firebase-app-check.js` | The `activateAppCheck(app)` function for the modular SDK. |
| `shared/firestore-audiorpg.rules` | Mirror of the Firestore rules of the `audiorpg-2eb6f` project (GeneratorNPC and Audio). |

The source sheet `AudioManifest.xlsx` is deliberately **not** in the repository (a `.gitignore` entry), because it lists the whole protected catalogue.

## 4. Dependencies

### 4.1 External dependencies

| Dependency | Version | When loaded | Purpose |
| --- | --- | --- | --- |
| Google Fonts `Fira Code` (400, 600) | — | always, `<link>` in `<head>` | the module font |
| Firebase `firebase-app.js`, `firebase-firestore.js` | 12.6.0 | always, `import` in `app.js` | list settings |
| `https://www.google.com/recaptcha/enterprise.js` | — | always, `<script defer>` | App Check |
| SortableJS `sortablejs@1.15.2/Sortable.min.js` (jsDelivr) | 1.15.2 | admin panel only, in the background after start-up (`ensureSortable`) | dragging lists and entries |
| JSZip `jszip@3.10.1/dist/jszip.min.js` (jsDelivr) | 3.10.1 | only on the first "Build manifests from XLSX" click (`ensureJSZip`) | unpacking the XLSX file |

An unavailable SortableJS does not block the panel — the arrow buttons remain. An unavailable JSZip yields the `builderErrorLibrary` message.

### 4.2 Dependencies between files

Script order in `index.html`: `config/firebase-config.js` → `../shared/appcheck-config.js` → `recaptcha/enterprise.js` (`defer`) → `app.js` (`type="module"`, so it runs after the `defer` scripts). `app.js` imports `../shared/firebase-app-check.js` and `../shared/firebase-write-status.js`.

### 4.3 Dependencies between modules

- `shared/access-gate.css` and the gate layout are shared with DataVault and GeneratorNPC; the gate's lore text matches DataVault.
- `shared/firebase-write-status.*` is shared with GeneratorNPC; both modules use the same Firebase project `audiorpg-2eb6f` (documents `generatorNpc/favorites` and `audio/favorites`).
- `foldPolish()` is a copy of the rule in `DataVault/app.js` (lower case, no diacritics, `ł` → `l`).
- The `--filter-on*` variables are copied from `DataVault/style.css`, so the blue "filter active" signal means the same in every module.
- The archive password is independent of the DataVault/GeneratorNPC password (see section 11.1).

## 5. `app.js` architecture

The file has a fixed section order, marked with comment headers:

1. Firebase and shared module imports,
2. constants,
3. translations (`translations.pl`, `translations.en`) and `t()`,
4. helpers (`escapeHtml`, `foldPolish`, `highlightMatch`, `debounce`, browser storage, titles),
5. element references (`dom`),
6. state (`state`) and the `writeStatus` instance,
7. settings model (lists, entries, aliases),
8. saving and loading settings, Firebase,
9. access gate and session,
10. playback,
11. tags, ids and URLs (shared with the builder),
12. manifests,
13. folder tree,
14. admin interface storage,
15. shared, admin panel and user view drawing,
16. admin panel actions, dragging,
17. XLSX manifest builder,
18. languages,
19. event handling,
20. module start-up.

Data flow rules:

- The module state is the single source of truth. The `render*()` functions build HTML from the state through `innerHTML`; they never read state back from the DOM.
- **Every settings change** (list, entry, alias, order, name) first changes `state.settings` through a model function and then calls `persistAndRender()`, which refreshes the membership index, draws the view and saves the data.
- Events are handled by delegation: one listener per container (`#catalogList`, `#listsList`, `#editorEntries`, `#editorHead`, `#folderTree`, `#userView`, `#previewView`), and the `data-action` attribute identifies the action.
- Every text coming from data (sound name, alias, list name, file, folder) goes through `escapeHtml()`. The `audio/favorites` document is writable by anyone (rules `allow read, write: if true`), so without this an alias could inject a script.

## 6. Two library tiers

| Tier | `access` | Manifest source | File source | Login |
| --- | --- | --- | --- | --- |
| Public (demo) | `"public"` | `AudioManifest.json` in this repository | public `AudioExample` repository (GitHub Pages) | no |
| Protected (archive) | `"protected"` | the gateway's `/manifest` endpoint | private `AudioRPG` repository, files served by the gateway | yes |

GitHub Pages knows only two states: files readable by everyone or by no one. The gateway adds a third — the `AudioRPG` repository stays private, and the only way to its files is a Worker that checks authorisation.

`loadManifests()` merges both tiers into one list sorted by `label` (`localeCompare`).

## 7. Manifests

### 7.1 Format

Public manifest (`AudioManifest.json`, indented):

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

The protected manifest (`audio-manifest.json` in the root of the private repository, not indented) has the same structure, but `access: "protected"`, and its variants carry `path` — a path relative to the `AudioRPG` repository — instead of `url`. The playable URL only exists after the gateway signs it.

| Item field | Meaning |
| --- | --- |
| `id` | Stable identifier (slug). Lists in the database point at sounds by `id` only. |
| `label` | Name shown in the interface (for groups, the base name without the number). |
| `groupCount` | Number of variants in the group; `0` when the item is not a group. The interface shows `(N)` only for `groupCount > 1`. |
| `filename` | File name, or `first.ogg (+N)` for groups. |
| `tags` | Folder path segments after cleaning. |
| `tag2` | `tags[1]` — the tag shown on a user view tile. |
| `tagPaths` | Cumulative paths: `["A", "A / B", "A / B / C"]`. They build the folder tree. |
| `variants` | Variants: `{ filename, url }` (public) or `{ filename, path }` (protected). |

### 7.2 Fields added after loading

`applyItems(items)` sorts items by `label` and adds to each:

| Field | Value | Used by |
| --- | --- | --- |
| `folderPath` | last element of `tagPaths`, or `"__no_folder__"` (`NO_FOLDER_PATH`) | the catalogue folder filter |
| `searchText` | `foldPolish([label, filename, ...tags].join(" \| "))` | the catalogue search (computed once) |

It then builds `state.itemsById` (map `id → item`) and `state.folderTree` (`buildFolderTree`). If `state.expandedPaths` was not restored from storage, every top-level folder starts expanded.

### 7.3 Fetching

- `fetchDemoManifest()` — `fetch("AudioManifest.json", { cache: "no-store" })`. A non-2xx status throws `Error("public_manifest_unavailable")` with `detail` = the HTTP status.
- `fetchProtectedManifest()` — `fetch(AUDIO_GATE_BASE + "/manifest", { headers: { Authorization: "Bearer <token>" } })`. `401` clears the session and throws `gate_unauthorized`; a `{ error: "manifest_unavailable", status }` response throws `manifest_unavailable` with `detail`; any other error throws `gate_error` with `detail` = the HTTP status.
- `loadManifests()` — each tier in its own `try` block. The protected tier is fetched only with a valid session. On success: `applyItems`, `state.manifestReady = true`, `signedUrlCache.clear()`, `renderAll()`. When both tiers are empty, it throws an error with the concrete reason (`state.publicError` / `state.libraryError`) or `manifestNoData`.

## 8. XLSX manifest builder

The `#buildManifests` button ("Tools" menu, admin panel only) calls `handleBuildManifests()`. Nothing is uploaded: the file is read locally and the result is saved through `Blob` and `URL.createObjectURL`.

The builder uses **the same** `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment` and `normalizeUrl` functions as the rest of the module. This is the single source of the id logic — changing any of them changes `id` values and breaks the link between saved lists and sounds. Before any change, compare the builder output on the same sheet (the files must be byte-identical).

Steps:

1. `pickLocalWorkbookFile()` — a hidden `<input type="file" accept=".xlsx">`; returns `{ buffer }`, or `null` when cancelled (the `cancel` event or `change` without a file).
2. `ensureJSZip()` — loads JSZip; a failed attempt resets the promise, so the next click tries again.
3. `readXlsxSheet(buffer)` — a minimal reader: `xl/sharedStrings.xml`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels` and the sheet of the first `<sheet>`. It handles `s`, `inlineStr` and raw cells; `columnRefToIndex()` turns `AB12` into a column index. It returns `{ header, rows }` as positional arrays (columns are not merged by name, which makes duplicate headers detectable).
4. `resolveRequiredColumns(header)` — header validation.
5. `buildManifestItems(rows)` — grouping and ids; then a sort by `label`.
6. Tier split and path check.
7. `downloadJsonFile()` — first `AudioManifest.json` (indented), 150 ms later `audio-manifest.json` (not indented), because some browsers drop two downloads started at the same instant.
8. `setBuilderState("ready", { publicCount, protectedCount })` and `alert(builderDone)`.

### 8.1 Validation

| Situation | Behaviour |
| --- | --- |
| Missing `NazwaSampla`, `NazwaPliku` or `LinkDoFolderu` column | `builder_missing_columns` listing the missing ones. |
| A required column appears more than once | `builder_duplicate_columns`. |
| Extra columns, any column order | Ignored / supported (binding by name). |
| Header only | `builder_no_rows`. |
| A protected variant without `/AudioRPG/` in its URL | `builder_no_paths` with the number of variants. |
| The file is not a valid XLSX | `builderErrorRead`. |

Every error sets `state.builder.status = "error"`, turns the `#builderStatus` pill red (full text in `title`) and shows an `alert()`. No file is produced on error.

### 8.2 Tier split

- `LinkDoFolderu` contains `/AudioExample/` (`BUILDER_PUBLIC_PREFIX`) → `access: "public"`, the variant gets `url` = `normalizeUrl(folder, file)`.
- Otherwise → `access: "protected"`, the variant gets `path` = the part of the URL after `/AudioRPG/` (`BUILDER_PROTECTED_PREFIX`) after `decodeURIComponent` (`toProtectedRepoPath`). Example: `https://host/AudioRPG/PrivateFolder/PrivateSubFolder/PrivateSound.ogg` → `PrivateFolder/PrivateSubFolder/PrivateSound.ogg`.

### 8.3 Variant grouping and ids

`getGroupingBaseLabel(label)` strips a trailing number from the name (`Explosion 2` → `Explosion`). Rows are grouped into one item when they share `LinkDoFolderu` and the base name, the name really ended with a number, and there is more than one such row. A group item gets `label` = the base name, `groupCount` = the number of variants and `filename` = `first (+N-1)`.

`id` = `slugify(name)` — lower case, every run of characters other than Unicode letters and digits → `-`, leading/trailing `-` trimmed; an empty result → `sample-<rowNumber>`. On a collision (the same slug in another folder) the sheet row number is appended: `<slug>-<rowNumber>`.

Consequence: **inserting a row in the middle of the sheet changes the collision ids of every row below it**, and saved lists lose those sounds. Measured on the real sheet (1,793 rows, 133 items with a collision suffix): appending a row at the end changes 0 ids, inserting the same row in the middle changes 123. That is why the user guide says to append rows at the end only.

### 8.4 Tags

`extractTags(folderUrl)`:

1. turns `\` into `/`; a URL containing `://` becomes `new URL(...).pathname`,
2. splits on `/`, drops empty segments and segments listed in `TAG_IGNORE_SEGMENTS` (`AudioRPG`),
3. cleans every segment with `cleanTagSegment()`: `decodeURIComponent`, case-insensitive removal of the technical suffixes listed in `TAG_IGNORE_FRAGMENTS` in `app.js`, `_` and `-` to spaces, whitespace collapsed,
4. drops segments that are empty after cleaning.

The `TAG_IGNORE_FRAGMENTS` list is needed by the builder only — at run time the module reads the ready `tags` and `tagPaths` from the manifest.

## 9. Access gateway (Cloudflare Worker)

Source: `Audio/worker/audio-gate.js`. Deployment: the `audio-gate` Worker on the Cloudflare account. The Worker address is set in the `AUDIO_GATE_BASE` constant in `app.js` (comment `GATEWAY ADDRESS CHANGE POINT`).

### 9.1 Worker environment variables

| Name | Type | Content |
| --- | --- | --- |
| `GROUP_PASSWORD` | Secret | The group password (Litany of Access). |
| `SIGNING_KEY` | Secret | HMAC key signing session tokens and file URLs. |
| `GITHUB_TOKEN` | Secret | Fine-grained PAT: `AudioRPG` repository only, `Contents: Read-only`. |
| `ALLOWED_ORIGIN` | Text | Site address, e.g. `https://cutelittlegoat.github.io`. |

Secret values must never reach the repository. They are set in Cloudflare: **Workers & Pages → `audio-gate` → Settings → Variables and Secrets**, or with `npx wrangler secret put <NAME>`.

### 9.2 Endpoints

| Endpoint | Method | Authorisation | Action |
| --- | --- | --- | --- |
| `/health` | GET | none | Which variables are set (no values). |
| `/login` | POST | none | `{ password }` → constant-time comparison → `{ ok, token, exp: null }`; wrong password → `401`. |
| `/manifest` | GET | Bearer | Relays `audio-manifest.json` from the private repository (unparsed, cached for 5 min). |
| `/sign` | GET | Bearer | `?p=<path>` → `{ ok, url, exp }` — a signed file URL. |
| `/a` | GET | signature in the URL | Checks the signature and expiry, serves the file with CORS headers and `Range` support. |

### 9.3 Session token and signatures

- Token: `base64url(JSON) + "." + base64url(HMAC-SHA256)`, the payload holds only `iat`. **The session never expires** (`exp: null`). Older tokens with an `exp` field are honoured until that date.
- The only way to invalidate every session at once: change the `SIGNING_KEY` secret.
- URL signature: `HMAC-SHA256(SIGNING_KEY, "<path>|<exp>")`, URL `/a?p=<path>&e=<exp>&s=<signature>`.
- `exp = (Math.floor(now / 3600) + 2) * 3600` — valid for 1–2 hours, aligned to a full hour, so within one clock hour the same URL is produced and the browser uses its cache.
- Authorisation travels in the URL rather than a cookie, because the `<audio>` element cannot send custom headers and third-party cookies are blocked.
- `isSafeAudioPath` rejects `..`, absolute paths, `\`, `//` and extensions other than `.ogg` / `.mp3`. Secret comparisons use `timingSafeEqual`.

## 10. Session and gate on the module side

| Element | Role |
| --- | --- |
| `AUDIO_SESSION_STORAGE_KEY` = `audio.session` | Token in `localStorage` (`{ token, exp }`). |
| `AUDIO_GATE_SKIPPED_KEY` = `audio.gateSkipped` | "Skip" marker in `sessionStorage` (per tab). |
| `isSessionUsable(session)` / `hasValidSession()` | Valid when there is a token and `exp` is empty or in the future. |
| `loadSession()` / `storeSession(session)` | Reading and writing the session; an invalid session is removed. |
| `signedUrlCache` | Map `path → { url, exp }`; an entry is reused while `exp` is more than 5 s away. Cleared after every `loadManifests()`. |
| `requestSignedUrl(path)` | `GET /sign`; `401` → `storeSession(null)`, `libraryUnlocked = false`, error `gate_unauthorized`. |
| `resolveVariantUrl(item, variant)` | `public` → `variant.url`; `protected` → a signature from the gateway. |
| `showAccessGate(message)` / `hideAccessGate()` | The `#accessGate` overlay via the `hidden` attribute; focus goes to the password field. |
| `maybeShowAccessGate()` | After start-up (in `.finally()` after `loadManifests()`) opens the gate when there is no session and "Skip" was not clicked. |
| `skipAccessGate()` | "Skip" and `Escape`: stores the marker and closes the gate. |
| `handleUnlockClick(message)` | Clears the skip marker and opens the gate. |
| `submitAccessLitany()` | Two separate steps: (1) `POST /login`, (2) `loadManifests()`. On a load problem the window stays open with the reason. |

There is no lock button: an unlocked archive is the target state, and "Unlock archive" disappears once unlocked (`#unlockLibrary` in the admin header gets `hidden`, and the button in the user view bar is not drawn).

### 10.1 Gate behaviour

| Event | Reaction |
| --- | --- |
| Start without a valid session, "Skip" not clicked | The gate opens after the manifests load. |
| "Skip" or `Escape` | The gate closes; `audio.gateSkipped = "1"` in `sessionStorage`. |
| Reload after "Skip" | The gate does not return. A new tab — it returns. |
| "Unlock archive" | The skip marker is cleared, the gate opens. |
| Clicking a "(missing in manifest)" tile with the archive locked | The gate with the `accessMissingItem` message. |
| Session expiry during playback | The gate with the `accessExpired` message. |

The overlay has `position: fixed` and `z-index: 9999`, so it covers everything, including the save-message bar (`z-index: 9000`).

### 10.2 Error messages name the layer that failed

| What failed | Translation key |
| --- | --- |
| `fetch("/login")` threw (network, CORS, wrong address) | `accessSilent` |
| `/login` → `401` | `accessRejected` |
| `/login` → a status other than 2xx and 401 | `accessLoginStatus` (with the status) |
| empty password field | `accessEmpty` |
| `/manifest` → `401` | `accessExpired` |
| `/manifest` → `manifest_unavailable` | `accessManifestMissing` (with the status) |
| `/manifest` → another error | `accessGateStatus` (with the status) |
| another exception while fetching the archive | `accessSilent` |
| `AudioManifest.json` could not be fetched | `publicManifestMissing` (with the status and file name) |

### 10.3 Tier independence

| State | Result |
| --- | --- |
| Public tier failed, protected works | The archive is visible; `state.publicError`; the manifest pill is red ("Manifest: public list error"). |
| Protected tier failed, public works | The demo is visible; `state.libraryError`; the archive pill is red ("Archive: load error"). |
| Both failed | `loadManifests()` throws with the concrete reason. |

## 11. Passwords

### 11.1 Audio archive password

The archive password is the `GROUP_PASSWORD` secret of the `audio-gate` Worker. To change it: **Cloudflare → Workers & Pages → `audio-gate` → Settings → Variables and Secrets → `GROUP_PASSWORD` → Edit** (or `npx wrangler secret put GROUP_PASSWORD` in the folder holding the Worker configuration), then deploy. Changing the password does not sign out devices that already hold a token. To force a new login everywhere, change `SIGNING_KEY` as well.

### 11.2 DataVault and GeneratorNPC password (for completeness)

DataVault and GeneratorNPC use a technical Firebase Auth account in the `wh40k-data-slate` project (the account address is in `window.WG_DATA_ACCESS_EMAIL`). Its password is changed in **Firebase Console → Authentication → Users → the account → Reset password**, or with a `firebase-admin` script (`updateUser`). The account must never be deleted or recreated, because its `uid` is written into the Realtime Database rules. This password is unrelated to the Audio archive.

No password is stored in the repository.

## 12. Firebase

### 12.1 Configuration

`Audio/config/firebase-config.js` sets `window.firebaseConfig` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) of the `audiorpg-2eb6f` project. A missing object or `apiKey` means local mode.

`initFirebase()`:

1. no configuration → `state.firebaseConfigMissing = true`, `writeStatus.reportLocalMode("no-config")`, `loadSettingsLocal()`, `renderAll()`;
2. `initializeApp()` → `activateAppCheck(app)` → `getFirestore(app)`; an exception → `reportLocalMode("init-failed")` and local mode;
3. `state.favoritesDoc = doc(db, "audio", "favorites")`, `state.usingFirestore = true`;
4. `onSnapshot(favoritesDoc, onData, onError)`:
   - no document → `applySettings(createEmptySettings())` and `persistAndRender()` (a v2 document is created),
   - data → `normalizeSettingsV2(snapshot.data())`, `applySettings()`, `writeStatus.warnLocalOverwritten()`, `renderAll()`,
   - listener error → `state.usingFirestore = false`, `writeStatus.reportReadError(error)`, `loadSettingsLocal()`, `renderAll()`.

The listener is live: a change saved in the admin panel appears in open user views without a reload.

### 12.2 App Check

`activateAppCheck(app)` from `shared/firebase-app-check.js` runs after `initializeApp()` and before `getFirestore()`. The reCAPTCHA Enterprise site key of `audiorpg-2eb6f` is in `shared/appcheck-config.js`. The page loads the reCAPTCHA library (`<script defer>`) instead of the SDK, because the SDK appends a tag without an error handler and, with the address blocked, waits forever and stalls Firestore. Without the library, App Check is skipped with a console warning.

### 12.3 Rules

The project rules (mirrored in `shared/firestore-audiorpg.rules`) allow reading and writing only the `generatorNpc/favorites` and `audio/favorites` documents; everything else is blocked. The `request.app != null` condition is not added (explained in the rules file). Protection against foreign programs comes from App Check enforcement in the console.

## 13. Settings model (version 2)

### 13.1 Document

The `audio/favorites` document (and its `localStorage` copy under `audio.settings`):

```text
{
  schemaVersion: 2,
  playlists: [
    { id: "main", kind: "main", name: "", entries: [ { itemId, alias } ] },
    { id: "<uuid>", kind: "list", name: "List name", entries: [ { itemId, alias } ] }
  ],
  updatedAt: <serverTimestamp>      // Firestore only
}
```

| Field | Rule |
| --- | --- |
| `schemaVersion` | Always `2` (`SETTINGS_SCHEMA_VERSION`). |
| `playlists` | Lists in display order. **Position 0 is always the main list.** The field is named `playlists`, not `lists`, so no older code recognises the document as its own. |
| `id` | `"main"` for the main list, `crypto.randomUUID()` for the others. Unique. |
| `kind` | `"main"` or `"list"`. Exactly one `main` list. |
| `name` | Up to 60 characters (`LIST_NAME_MAX_LENGTH`). An empty main list name = the default name "Widok główny" / "Main view" in the current language. Other lists must have a name. |
| `entries` | Entries in display order. `itemId` is unique within a list. |
| `alias` | Up to 80 characters (`ALIAS_MAX_LENGTH`), empty = no alias. **The alias belongs to the entry, and therefore to the list** — the same sound can have different aliases on different lists. |
| `updatedAt` | `serverTimestamp()` set on every Firestore save. |

List names are user data and are not translated. The export (`exportSettings`) saves `serializeSettings()` plus `exportedAt` (ISO 8601) — without the token or any secrets.

### 13.2 Clean start and the old format

The module knows only the v2 format. `normalizeSettingsV2(raw)`:

- data without `schemaVersion === 2` or without a `playlists` array → **empty settings** (just an empty main list) and `legacy = isLegacySettings(raw)`;
- `isLegacySettings` recognises the old format by the `favorites`, `mainView`, `aliases` fields or a `lists` array; it only drives the `noticeLegacy` message in the admin panel;
- reading an old document **writes nothing**. The first change in the admin panel overwrites the whole document in the v2 format (`setDoc` without `merge`), which removes the old fields;
- `loadSettingsLocal()` removes the oldest `audio.favorites` key from `localStorage` on every start-up.

v2 normalisation rules:

- the first list with `kind === "main"` or `id === "main"` becomes the main list, further ones are skipped; no main list → an empty one is added;
- other lists get `kind: "list"`; an empty `id` → `list-<n>`; a repeated `id` → a suffix is appended;
- `normalizeEntries`: entries without `itemId` and duplicates are dropped (the first one stays), aliases are trimmed. **Entries missing from the current manifest are not removed** — with the archive locked every protected sound is "missing", and its entries and aliases must survive.

### 13.3 Model functions

| Function | Action |
| --- | --- |
| `createMainList()` / `createEmptySettings()` | An empty main list / settings with only the main list. |
| `serializeSettings()` | The saved form (without `updatedAt`). |
| `getLists()`, `getList(id)`, `getMainList()`, `getEditedList()` | List access; `getEditedList()` falls back to the main list. |
| `getListName(list)` | Display name (the default for an empty name). |
| `buildMembershipIndex()` | Map `itemId → [{ listId, alias }]` — for the catalogue counter, the "On other lists" section, alias suggestions and searching by alias. |
| `createList()` | A new list at the end, named "New list"; returns its `id`. |
| `duplicateList(id)` | A copy with entries and aliases, name suffixed "(copy)", inserted right after the original (for the main list — at position 1). |
| `moveListTo(id, index)` | Moves a list; the main list never moves and nothing lands at position 0. |
| `addEntries(listId, itemIds)` | Appends without duplicates; returns the number added. |
| `removeEntry(listId, itemId)` | Removes an entry together with its alias. |
| `moveEntry(listId, from, to)` | Moves an entry (the alias travels with it). |
| `setEntryAlias(listId, itemId, alias)` | Sets an alias; returns `false` when nothing changed. |
| `onSettingsChanged()` | Rebuilds the index, applies `restoredEditedListId`, repairs pointers to missing lists (`editedListId`, `previewListId`, `userListId`, `renamingListId`), `pruneOrphanPlayers()`. |
| `applySettings(settings, legacy)` | Replaces the settings and calls `onSettingsChanged()`. |

## 14. Saving and loading

| Function | Action |
| --- | --- |
| `saveSettingsLocal()` | `localStorage["audio.settings"] = JSON(serializeSettings())`; returns `true`/`false`. |
| `saveSettings()` | With an active database `setDoc(favoritesDoc, { ...serializeSettings(), updatedAt: serverTimestamp() })`. An error → `usingFirestore = false`, local save, `reportSaveError(error, { savedLocally })`. Without a database → local save; with a configured database also `noteLocalOnlyChange()`. A successful save clears the old-format notice (`markSettingsSaved`). **It never rejects.** |
| `persistAndRender()` | `onSettingsChanged()` → `renderAll()` → `await saveSettings()`. The view is drawn **before** saving, because with no network the `setDoc` promise may never settle. |
| `loadSettingsLocal()` | Removes `audio.favorites`, reads `audio.settings`, normalises, `applySettings()`. |

Browser storage keys:

| Key | Storage | Content |
| --- | --- | --- |
| `audio.settings` | `localStorage` | v2 settings (local mode and the fallback after a database refusal). |
| `wgLocalOnlyChange:audio.settings` | `localStorage` | Marker of changes saved only locally while a database is configured (`{"at":"<ISO>"}`), managed by `shared/firebase-write-status.js`. |
| `audio.session` | `localStorage` | Gateway token. |
| `audio.gateSkipped` | `sessionStorage` | "Skip" marker. |
| `audio.admin.ui` | `localStorage` | Admin panel layout (section 16). |
| `audio.admin.filters` | `sessionStorage` | Admin panel filters (section 16). |

Every storage access sits in `try/catch` (`getStorage`, `readStoredJson`, `writeStoredJson`) — a private window or blocked site data never stops the module.

### 14.1 Save-message bar

The instance is created once when the script loads:

```js
const writeStatus = createFirebaseWriteStatus({
  mount: document.body,
  modeMount: $("writeStatusMode"),
  language: currentLanguage,
  scopeKey: AUDIO_SETTINGS_STORAGE_KEY,
  moduleName: "Audio"
});
```

`#writeStatusMode` sits in `.page-top`, outside the `admin-only` / `user-only` sections, so the mode badge is visible in both modes.

| Place | Call | Effect |
| --- | --- | --- |
| `saveSettings()` — successful `setDoc` | `reportSaveSuccess()` | The bar hides, the badge reads "Shared data", the local-change marker is cleared. |
| `saveSettings()` — refusal | `reportSaveError(error, { savedLocally })` | "Saved on this device only" or "Nothing was saved". |
| `saveSettings()` — local save with a configured database | `noteLocalOnlyChange()` | Local-change marker. |
| `onSnapshot` — error | `reportReadError(error)` | "Could not load data from the database". |
| `onSnapshot` — data | `warnLocalOverwritten()` | A warning if database data replaced local changes. |
| `initFirebase()` | `reportLocalMode("no-config" \| "init-failed")` | A mild note about working without the database. |
| `renderStatus()` | `setMode("shared" \| "local")` | The mode badge. |
| `applyLanguage()` | `setLanguage(lang)` | Bar texts in the chosen language. |

The shared module distinguishes the `nothing-saved`, `local-only`, `read-failed`, `local-mode` and `local-overwritten` situations, maps Firestore codes (`permission-denied`, `unauthenticated`, `unavailable`, `deadline-exceeded`, `resource-exhausted`, `failed-precondition`) to hints, and sets the `--wg-write-status-height` variable on `<html>`, by which `body` is pushed down. The same variable is used by the user view's sticky `.uv-bar`, the sticky `.admin-tabs` and the folder drawer.

The module deliberately does not push locally saved changes to the database once access returns: a save is one `setDoc` of the whole document, so pushing the old state would erase changes made on another device. It shows the `local-overwritten` warning instead.

## 15. Module state (`state`)

| Field | Meaning |
| --- | --- |
| `items`, `itemsById` | Sounds from both manifests (after `applyItems`). |
| `manifestReady`, `manifestAttempted` | Manifest loaded / a load attempt has happened. |
| `settings` | `{ playlists }` — v2 settings. |
| `membership` | Index from `buildMembershipIndex()`. |
| `legacyDetected`, `legacyNoticeDismissed`, `archiveNoticeDismissed` | Admin panel notices. |
| `firestore`, `favoritesDoc`, `usingFirestore`, `firebaseConfigMissing`, `firebaseStarted` | Firebase state. |
| `session`, `libraryUnlocked`, `libraryError`, `publicError` | Session and library tiers. |
| `builder` | `{ status: "idle" \| "working" \| "ready" \| "error", publicCount, protectedCount, message }`. |
| `editedListId` | The list edited in the admin panel = the catalogue target list. |
| `restoredEditedListId` | The edited list from the previous visit; waits until database data brings it (settings load after start-up). Cleared by a deliberate list choice. |
| `renamingListId` | The list whose name is being edited. |
| `folderTree` | `{ roots, index }` from `buildFolderTree()`. |
| `excludedPaths` | Set of folder paths excluded from the catalogue. |
| `expandedPaths` | Set of expanded tree folders. |
| `treeSearch`, `catalogSearch`, `catalogScope`, `catalogTier`, `editorSearch` | Filters. |
| `catalogLimit`, `catalogResults` | Catalogue paging (200 at a time) and the latest results (for range selection). |
| `selectedItemIds`, `lastSelectedIndex` | Catalogue selection. |
| `expandedMembers` | Catalogue items with the "On lists: …" line expanded. |
| `foldersCollapsed`, `foldersOpen` | Folder rail (≥1280 px) / open drawer (<1280 px). |
| `adminTab` | `catalog` \| `lists` \| `preview` (tabs <1024 px). |
| `previewDevice`, `previewFollow`, `previewCollapsed`, `previewListId` | Preview. |
| `toolsMenuOpen` | The "Tools" menu. |
| `userListId` | The list shown in the user view (not remembered between reloads). |

## 16. Admin interface storage

Saving works in the admin panel only.

`saveAdminUi()` → `localStorage["audio.admin.ui"]`:

```text
{ foldersCollapsed, expandedPaths: [..] | null, editedListId, previewDevice, previewFollow, previewCollapsed, adminTab }
```

`saveAdminFilters()` → `sessionStorage["audio.admin.filters"]` (like the Global Filter in DataVault — filters live until the tab closes):

```text
{ excludedPaths: [..], treeSearch, catalogSearch, catalogScope, catalogTier }
```

`restoreAdminState()` (at start-up) restores both objects with value validation and writes the filters into the form fields. `editedListId` goes into `restoredEditedListId` and is applied in `onSettingsChanged()` once the list appears in the data.

Tile volume is not stored anywhere — after a reload every tile is at 100%.

## 17. Playback

### 17.1 Player keys

Players are bound to a stable text key rather than to a page element:

```js
const makeKey = (context, listId, itemId) => `${context}|${listId}|${itemId}`;
```

| Context | Place |
| --- | --- |
| `user` | the real user view |
| `prev` | the admin panel preview |
| `cat` | the catalogue preview button (empty `listId`) |
| `ed` | the list editor preview button |

A redraw (database change, tab change, language change) therefore never loses a playing sound: the new element with the same `data-key` gets its state right away and can be stopped. The same sound on two lists is two independent players with separate volumes.

| Map | Content |
| --- | --- |
| `players` | `key → { item, audio, gainNode, loop, lastKey }` — playing sounds. |
| `loadingKeys` | `key → { loop }` — sounds being started (signature, download). |
| `volumes` | `key → slider value -100..100` — for the page session only. |
| `volumeClicks` | `key → time of the last click` on the volume value. |
| `playbackGeneration` | `key → counter` — guards against races during asynchronous start. |

### 17.2 Start, loop and stop

`startPlayback(key, item, { loop, previousKey })`:

1. `bumpGeneration(key)`; variant pick `pickRandomVariant(item, previousKey)`;
2. if the sound was not playing: `loadingKeys.set(key, { loop })` → the tile shows "loading";
3. `resolveVariantUrl()`; a `gate_unauthorized` error → the gate with `accessExpired`; another error → `alert(alertPlaybackFailed)`;
4. if the generation changed meanwhile (something else was clicked), the result is dropped;
5. `new Audio()`; for the protected tier `audio.crossOrigin = "anonymous"` **before** setting `src` (otherwise `createMediaElementSource` taints the Web Audio graph and gateway audio plays silent);
6. `AudioContext` (resumed when `suspended`) → `createMediaElementSource(audio)` → `GainNode` → `destination`;
7. stored in `players`, removed from `loadingKeys`, `refreshKey(key)`;
8. `timeupdate` → progress bar; `ended` → with `loop`, a new `startPlayback` with the next variant (without a "loading" state, so the tile does not flicker), otherwise `stopPlayback`; `error` / rejected `play()` → alert and stop.

`pickRandomVariant(item, previousKey)` returns **a variant object**: with one variant, that variant; with several, it draws up to 8 times for a variant whose key (`getVariantKey` = `url` or `path`) differs from the previous one, and as a last resort takes the first different one.

| Function | Action |
| --- | --- |
| `togglePlayback(key, itemId)` | Playing / loading → stop; an item missing from the manifest with the archive locked → the gate with `accessMissingItem`; otherwise start. |
| `toggleLoop(key, itemId)` | Looping → stop; playing without a loop → turns the loop on without a restart; loading → toggles the loop flag; idle → start in a loop. |
| `stopPlayback(key)` | Pause, `currentTime = 0`, removal from the maps, `bumpGeneration`, refresh. |
| `stopAllPlayback()` | Stops every key in `players` and `loadingKeys` (all contexts). |
| `pruneOrphanPlayers()` | Stops sounds (outside the `cat` context) whose list or entry disappeared. |

### 17.3 Volume

- Slider `-100..100`, step 1, default `0`.
- `volumeToGain(v) = (v + 100) / 100` → gain `0..2` (0% … 200%); `volumeToPercent` shows the percentage next to the slider.
- Volume goes through a `GainNode`, because iPhone and iPad ignore `audio.volume`; `audio.volume` (clamped to 0..1) remains only for browsers without `AudioContext`.
- `handleVolumeValueClick(key)` — two clicks on the percentage within 450 ms (`VOLUME_RESET_DOUBLE_CLICK_MS`) restore 100%. Own detection instead of `dblclick`, which some touch screens never send.

### 17.4 Indicators and screen wake lock

`updatePlaybackIndicators()` after every change:

- `.stop-all` buttons: `disabled` at zero, the `is-active` class, the `(N)` counter and `aria-label`,
- `.uv-tab` tabs: the `has-playing` class (red dot) when any `context|list|…` key plays; `title` = the full list name, with the `tabPlaying` suffix when something plays,
- `updateWakeLock()`: `navigator.wakeLock.request("screen")` while at least one sound plays and the tab is visible; released when nothing plays. `visibilitychange` triggers a re-check (the browser releases the lock when the tab is hidden). Without the API the function does nothing.

`syncPlaybackElement(element)` applies the state to an element with `data-key`:

- a `.tile`: `data-state` (`idle` / `loading` / `playing`; `missing` is kept), icon `▶` / `…` / `■`, `aria-pressed` and `aria-label` of the play button, Loop state (`is-looping`, `aria-pressed`), progress bar, volume slider and value,
- a `.play-btn` in the catalogue/editor: `is-playing` / `is-loading` classes, icon, `aria-pressed`, `title`.

## 18. Admin panel

### 18.1 Header and notices

- `#unlockLibrary` — opens the gate; hidden once unlocked.
- "Tools" menu (`#toolsMenuButton`, `#toolsMenuList`, `aria-expanded`): `#reloadManifest` (another `loadManifests()`), `#buildManifests`, `#exportSettings`, `#reloadLocal` (visible in local mode only), `#clearAllAliases` (with confirmation). Closed by a click outside, choosing an item, or `Escape`.
- `renderStatus()` pills: `#manifestStatus` (`Manifest: N items` / public list error), `#firebaseStatus`, `#listsStatus` (`Lists: N`), `#libraryStatus` (locked / unlocked / error), `#builderStatus`. Red (`.is-error`) for errors only; details in `title`.
- `#adminNotices` (`renderNotices`): `noticeLegacy` (old-format data skipped) and `noticeArchiveLocked` (the archive is locked — protected entries appear as "(missing in manifest)" and will not be removed). Each notice has a ✕ button; closing lasts until a reload.

### 18.2 Workbench and layout

`#workbench` is a `var(--folders-w) minmax(0, 1fr) var(--lists-w)` grid with height `calc(100dvh - 24px)` (min. 640 px); each column scrolls on its own (`.col-body`), column headers (`.col-head`) stay in place.

`renderLayoutState()` sets: `body[data-admin-tab]`, the active tab, the `is-folders-collapsed` class (≥1280 px only), `is-collapsed` / `is-drawer-open` on the folder panel, the drawer backdrop, the available preview widths (`getAvailableDevices()`: Tablet when the window is > 860 px; Phone when > 430 px), the frame's `data-device`, preview collapse and the `#previewFollow` state. It also runs on `resize` (120 ms debounce).

| Window width | Layout |
| --- | --- |
| ≥ 1600 px | 3 columns: folders 280 px, catalogue, lists 420 px. |
| 1280–1599 px | 3 columns: 240 px, catalogue, 380 px. |
| 1024–1279 px | 2 columns: catalogue and lists (`minmax(320px, 380px)`); folders as a drawer from the left (`min(360px, 90vw)`) opened by the "Folders" button in the catalogue header, closed by ✕, the backdrop or `Escape`. |
| < 1024 px | Catalogue / Lists / Preview tabs (sticky below the save bar); one panel visible, the whole page scrolls; the selection bar sticks to the bottom. |
| < 720 px | A catalogue row spans two lines (the name gets the full width, the list counter below), no tier chip; the alias field on its own line; the "Tools" menu opens from the left. |

At ≥ 1280 px the folder panel can be collapsed with `«` into a 44 px rail with a vertical "Folders" label; clicking the rail (`»`) expands it again. The collapsed state is remembered.

### 18.3 Folder tree

Model:

- `buildFolderTree(items)` creates a node for every path in `tagPaths` (`{ path, name, depth, parent, children, ownCount, totalCount }`). `ownCount` — sounds lying directly in the folder (deepest path), `totalCount` — in the whole subtree. Sounds without a folder go to the `__no_folder__` node ("(no folder)"), sorted last; other nodes are sorted by name.
- The filter is a set of **excluded** paths, `excludedPaths`. A sound is visible in the catalogue when its `folderPath` is not excluded. Selecting a subfolder therefore works even with the parent cleared, and a folder with both its own sounds and subfolders is handled correctly.
- `computeTreeStats()` computes, from the leaves up, each node's state: `all` (folder and subtree visible), `none`, `some` (mixed), plus the number of visible sounds. Checkbox: `checked` for `all`, `indeterminate` for `some` (set through the property after the HTML is inserted).
- Clicking a checkbox: state `all` → `setSubtreeIncluded(node, false)` (excludes the whole subtree); state `none` or `some` → includes the whole subtree.
- Folder counter: `(N)`, or `(visible/N)` when part is hidden.
- "only" (`tree-only`) → `excludeAllFolders()` + including the subtree. With a mouse, the button appears on row hover or focus; on touch screens it is always visible.
- "Select all" clears `excludedPaths`; "Clear all" excludes every folder with `ownCount > 0`; "Expand/Collapse all" changes `expandedPaths`; ▸/▾ toggles one folder.

Search (`getTreeSearch()`, 150 ms debounce):

- the phrase is folded with `toNeedle()` (`foldPolish` + `trim`); a lone space is not a filter,
- nodes whose name contains the phrase match; visible are the matching nodes, their whole subtrees and their ancestors; ancestors are forced open (`forced`), matching nodes keep their own expansion state,
- the match is highlighted with `<mark>` (`highlightMatch`, correct for Polish diacritics too),
- below the field the "Select matches", "Clear matches" and "Matches only" actions appear (acting on the matching nodes' subtrees),
- the search changes only what the tree shows — it does not filter the catalogue.

Blue signals: the "Search folders" label (`field-label--active`) with an active phrase; the "Folders" title (`is-filter-on`) and blue dots (`#foldersTitleDot`, `#foldersRailDot` on the rail, `#openFoldersDot` on the drawer button) when at least one folder with sounds is excluded. The `title` says "The catalogue shows sounds from X of Y folders".

`onFolderFilterChanged()` resets paging, saves the filters, and draws the tree and the catalogue.

### 18.4 Catalogue

`getCatalogResults(targetIds)` applies the filters in order: folder (`excludedPaths`) → tier (`catalogTier`: `all` / `public` / `protected`) → scope (`catalogScope`: `all` / `outside` — not on the target list / `inside` — on the target list) → phrase (in `searchText`, and when that fails, in this sound's aliases from every list).

The target list (`#targetList`) is always the same list as the edited one (`setEditedList`).

A `.cat-row` (paged by 200, "Show N more" button):

| Element | Action |
| --- | --- |
| `.cat-check` | Selection; with `Shift` — a range from the last clicked one (`handleCatalogSelection`). `Ctrl`/`Cmd` + click on the name toggles the selection. |
| `.play-btn` (`cat|…`) | Preview without adding. |
| `.cat-title` | Name with `(N)`; it does not shrink until it fills 65% of the row. |
| `.cat-meta` | Path (`tags` from the second one, joined with ` › `) and file name; full path in `title`. |
| `.chip--tier` | "demo" / "archive". |
| `.chip--members` | Number of lists holding the sound; `title` lists names and aliases; clicking expands the `.cat-members` line. Highlighted when the sound is on the target list. |
| `.add-btn` | `+` appends to the target list; `✓` removes (with confirmation when the entry has an alias). |

"Select all results" asks for confirmation above 50 results (`SELECT_ALL_CONFIRM_THRESHOLD`). The `#bulkBar` (counter, "Add to "list"", "Clear selection") is the column's last element, so it is always visible; a bulk add keeps catalogue order and skips sounds already present. The `#catalogSummary` reads "Folders: X of Y" (blue with an active filter) · "Results: N of M". The "Search sounds" label glows blue with an active phrase.

The `/` key (outside text fields, with the gate closed) moves focus to the catalogue search, and on a narrow screen switches to the Catalogue tab.

### 18.5 Lists panel

`renderLists()` draws a `.list-row` per list:

- main list: a 📌 pin, the "main list" badge, no handle or arrows, always first,
- others: a `⠿` handle (`.drag-handle`, `touch-action: none`), the name (selection button), the entry counter, ▲/▼ (▲ disabled at position 1, ▼ at the last),
- the active list has the `is-active` class (green background and glow),
- double-clicking a name → selection and rename.

"+ New list" creates a list, selects it and opens the name field at once. On a screen < 1024 px choosing a list scrolls to the editor.

### 18.6 List editor

Header (`#editorHead`): the title (for the main list with the "main list" caption), ✎ rename, ⧉ duplicate, 🗑 delete (not for the main list; the confirmation states the number of entries and aliases), the entry counter, "Clear this list's aliases" (with confirmation, disabled without aliases).

Renaming (`startRename` / `commitRename` / `cancelRename`): a field with `maxlength = 60`; `Enter` or leaving the field saves, `Esc` cancels. An empty favourites list name restores the previous one; an empty main list name means the default name.

An `.entry`:

| Element | Action |
| --- | --- |
| `⠿` | Drag handle (disabled while searching). |
| `N.` | Position on the list. |
| `.play-btn` (`ed|list|sound`) | Preview. |
| Title | Name with `(N)` and the phrase highlighted; for an entry missing from the manifest "(missing in manifest)" and the `itemId` in `<code>`. |
| Path | The sound's folders. |
| `.alias-input` | Alias on this list (`maxlength = 80`). Saved on the `change` event (leaving the field or `Enter`); `Esc` restores the value from before editing. Suggestions from `<datalist id="aliasSuggestions">` — this sound's aliases from other lists, built when the field gets focus. |
| ⤒ ▲ ▼ ⤓ | To top / up / down / to bottom. |
| ✕ | Removes the entry (no confirmation). |
| "On other lists: …" | Names of other lists holding the sound and the aliases there ("no alias" when empty). |

The list search (100 ms debounce) narrows entries by name, alias and file (for an entry missing from the manifest, by alias and `itemId`). With an active phrase the arrows and dragging are disabled, the label glows blue and the `editorReorderLocked` hint appears — order changes only on the full list, because entry indexes must match positions.

### 18.7 Dragging (SortableJS)

`initSortables()` creates two instances once the library loads:

| Instance | Container | Options | `onEnd` |
| --- | --- | --- | --- |
| `listsSortable` | `#listsList` | `handle: ".drag-handle"`, `draggable: ".list-row"`, `animation: 150`, `onMove` blocks drops before the main list | `moveListTo(id, newIndex)` → `persistAndRender()`, otherwise `renderLists()` |
| `entriesSortable` | `#editorEntries` | `handle: ".drag-handle"`, `draggable: ".entry"`, `animation: 150`, `disabled` while searching | `moveEntry(edited, oldIndex, newIndex)` → `persistAndRender()`, otherwise `renderEditor()` |

`renderEditor()` updates `entriesSortable.option("disabled", locked)`. The `.sortable-ghost` (drop spot, dashed frame) and `.sortable-chosen` (glow) classes live in `style.css`.

### 18.8 Focus preservation

`withPreservedFocus(container, render)` remembers the focused element (by its `data-focus-key` attribute, e.g. `alias:<itemId>`, `entry-up:<itemId>`, `tree-check:<path>`) and, for text fields, the value and selection; after the redraw it restores the focus, the typed text and the caret. A change arriving from the database while an alias is typed therefore never erases the text, and moving an entry with the keyboard arrows never loses focus.

### 18.9 Preview

- `renderPreview()` calls `renderUserView(#previewView, "prev")` — the same function as the real view.
- "follows the edited list" (`previewFollow`, on by default): the preview shows the edited list, and clicking a tab in the preview changes the edited list. Off — the preview keeps its own list (`previewListId`).
- Width: Desktop (full), Tablet (820 px), Phone (390 px) — `data-device` on `#previewFrame` sets `max-width`; the view inside reacts through container queries, so it looks as on that device. Width buttons narrower than the window are hidden.
- "Open the real view ↗" — an `index.html` link in a new tab.
- "Collapse preview" / "Expand preview" — a collapsed preview is not drawn.
- Playback in the preview is real (context `prev`), independent of the catalogue and the editor.

## 19. User view

`renderUserView(root, context)` draws:

```text
.uv[data-ctx]
  .uv-bar
    .uv-brand                     "Audio"
    .uv-tabs[role=tablist]        a .uv-tab per list (main list first)
    .uv-actions
      .stop-all                   ■ Stop all (N)
      .unlock-btn                 🔒 Unlock archive (context=user and a locked archive only)
  .uv-grid | .uv-empty            tiles or "There are no sounds on this list yet."
```

- Active list: `state.userListId` (view) or `getPreviewListId()` (preview); a missing one → the first list. After a page reload the view starts on the main list.
- The tab bar's scroll position is kept across redraws, and the active tab is brought into view horizontally only (the page never scrolls).
- `selectViewList(context, listId)` — list change; in the preview with `previewFollow` it changes the edited list.
- Changing the tab does not stop sounds: sounds playing on other lists are signalled by a red dot on their tab.

Tile (`renderTile`):

```text
article.tile[data-key][data-item-id][data-state]
  button.tile-play                  the whole upper part of the tile; title = the full label
    .tile-icon                      ▶ / … / ■ / 🔒
    .tile-title                     Name (alias) (N) — up to 3 lines
    .tile-tag                       tag2 (one tag)
    .tile-status                    "loading…" / "(missing in manifest)"
  .tile-progress > span             progress bar
  .tile-controls
    input.volume-slider             -100..100
    button.tile-volume              "100%" (double click → 100%)
    button.loop-btn                 ⟳ Loop
```

Title label: `buildTitleText(label, alias, groupCount)` = `Name (alias) (N)`; in the HTML the alias carries `.sample-alias` and `(N)` carries `.group-count`. Moving the slider never starts a sound (the slider sits outside the play button).

| `data-state` | Look |
| --- | --- |
| `idle` | Green frame, ▶ icon. |
| `loading` | Dashed frame, pulsing … icon, "loading…" text. |
| `playing` | Red frame with glow, red ■ icon and name, red progress bar (sliding when the duration is unknown). |
| `missing` | Dimmed tile, 🔒 icon, name = the alias or the `itemId`, "(missing in manifest)" text, no slider or Loop. A click with the archive locked opens the gate. |

`bindUserViewEvents(root, context)` handles `uv-select`, `uv-stop-all`, `uv-unlock`, `uv-play`, `uv-loop`, `uv-volume-reset` (clicks) and `uv-volume` (`input`). The same function is bound to `#userView` (`user`) and `#previewView` (`prev`).

## 20. Styles and layout

### 20.1 Palette (`:root` in `style.css`)

| Variable | Value | Use |
| --- | --- | --- |
| `--bg` | 2 × green `radial-gradient` + `#031605` | page background |
| `--panel` | `#000` | header, columns, view bar |
| `--panel-alt` | `#041b08` | tiles |
| `--border` / `--accent` | `#16c60c` | frames, accent |
| `--accent-dark` | `#0d7a07` | — |
| `--accent-strong` | `#1ee616` | icons, focus, active elements |
| `--text` | `#9cf09c` | text |
| `--muted` | `rgba(156, 240, 156, 0.7)` | secondary text |
| `--danger` | `#ff5f5f` | playback, Loop, errors, `(N)` |
| `--glow` | `0 0 25px rgba(22, 198, 12, 0.45)` | admin header |
| `--shadow` | `0 8px 24px rgba(0, 0, 0, 0.45)` | columns, tiles, menu |
| `--radius` | `12px` | panels |
| `--filter-on` | `#3D8FC4` | active filter (labels, title) |
| `--filter-on-bright` | `#6FB3E0` | dots, `<mark>`, editor hint |
| `--filter-on-glow` | `rgba(61, 143, 196, 0.40)` | glow |
| `--filter-on-bg-active` | `rgba(61, 143, 196, 0.20)` | `<mark>` background |
| `--filter-on-border`, `--filter-on-bg` | `rgba(61,143,196,.55)`, `rgba(61,143,196,.10)` | reserved for consistency with DataVault |
| `--folders-w` / `--lists-w` | 260 / 400 px (1600+: 280 / 420; 1280–1599: 240 / 380) | workbench columns |

In this module blue means only "a filter is on". Red means playback or an error. Alias: `#d2fad2`.

### 20.2 Typography

Font: `"Fira Code", "Consolas", "Source Code Pro", monospace` (Fira Code 400/600 from Google Fonts). Sizes: admin title `clamp(20px, 2.6vw, 28px)` uppercase, `letter-spacing: 0.1em`; column titles 14 px uppercase; text 13 px; meta 11–12 px; buttons 13 px (`.btn-small` 11 px) uppercase with `letter-spacing: 0.06em`; tile name 15 px / 600, `line-clamp: 3`.

### 20.3 Page width

- `.page`: `max-width: 1280px`, `padding: 20px 24px 40px`, a column with `gap: 16px`,
- admin panel: `max-width: 1760px`,
- user view: no limit, `padding: clamp(8px, 2vw, 24px)`, `gap: 10px`.

### 20.4 User view — container queries

`.uv` has `container-type: inline-size; container-name: uv`, so the view reacts to the width of **its container** rather than the window — that is why the 390 px preview looks like a phone.

| Condition | Change |
| --- | --- |
| always | Grid `repeat(auto-fill, minmax(min(100%, 250px), 1fr))`, `gap: 12px` — the column count follows the width. |
| `@container uv (max-width: 1023px)` | Tabs on their own full row of the bar (`order: 3`), a single row scrolling sideways with `scroll-snap`. |
| `@container uv (max-width: 559px)` | "Stop all" and "Unlock archive" show icons only (name in `aria-label` and `title`), smaller spacing. |
| `.uv[data-ctx="user"] .uv-bar` | Sticky bar (`position: sticky; top: var(--wg-write-status-height, 0px)`) in the real view only. |

Tab: max 260 px with an ellipsis; active — background `rgba(22,198,12,.25)`, frame `--accent-strong`, text `#d2ffd2`. Playback dot: 7 px, `--danger`, in the top right corner.

### 20.5 Touch screens and motion

- `@media (pointer: coarse)`: buttons and tabs ≥ 44 px tall; icon, preview and add buttons 40 × 40 px; tree row 40 px; checkboxes 20 px; fields and selects ≥ 40 px with 15 px text (no automatic zoom on iOS); slider 32 px with a 26 px thumb.
- `@media (hover: hover) and (pointer: fine)`: the tree's "only" button only on hover/focus.
- `@media (prefers-reduced-motion: reduce)`: no icon pulsing, no bar animation, no drawer transition.
- Keyboard focus: `outline: 2px solid var(--accent-strong)` with a 2 px offset on every control.
- `[hidden] { display: none !important; }` — the `hidden` attribute wins over every `display` rule.

### 20.6 Gate

The look comes from `shared/access-gate.css`. The module adds `.accessGate__skip` (left cell of the grid's second row; below 640 px — row 4, full width) and `.btn.primary` (background `--text`, text `#031605`).

## 21. i18n

- `translations.pl` and `translations.en` — flat dictionaries with the same key set; `t(key, vars)` fills `{variables}`, a missing key falls back to Polish and then to the key itself.
- Static HTML texts carry `data-i18n` (text), `data-i18n-placeholder`, `data-i18n-title` and `data-i18n-aria-label` attributes; `applyLanguage(lang)` rewrites them all, sets `<html lang>`, passes the language to `writeStatus.setLanguage()` and calls `renderAll()`.
- The default language is Polish (`currentLanguage = "pl"`); the language is not remembered.
- The only switcher, `#languageSelect`, sits in `.page-top` inside `<div class="language-switcher language-switcher--hidden">` (comment `LANGUAGE SWITCHER VISIBILITY CHANGE POINT`). Removing the `language-switcher--hidden` class shows it in both modes.
- List names and aliases are data and are not translated. Exception: an empty main list name is shown as "Widok główny" / "Main view".
- The database failure bar texts live in `shared/firebase-write-status.js`, not in `translations`.
- Warhammer 40k lore language is used only in the gate window (title, description, "Litany of Access", "Begin the Rite", password messages). The admin panel and diagnostic messages use plain language.

## 22. Fallbacks and errors

| Situation | Behaviour |
| --- | --- |
| No `window.firebaseConfig` / `apiKey` | `localStorage` mode, the "Firebase: missing configuration" pill, the "This device only" badge, a mild bar. |
| An exception while starting the SDK | Local mode; the manifests load anyway (Firebase start-up is in its own `try`). |
| No `audio/favorites` document | A v2 document with an empty main list is created. |
| A document in the old format | Treated as empty, nothing is written on read, the `noticeLegacy` message. The first change saves v2. |
| Firestore refuses a save | Local save, `usingFirestore = false`, the "saved on this device only" bar; the interface shows the current state. |
| The local save fails too | The "nothing was saved" bar. |
| Firestore listener error | Local settings, a bar with the cause. |
| Corrupted settings | `normalizeSettingsV2` repairs them or returns empty settings. |
| An entry points at a sound missing from the manifest | Entry and alias stay; editor: "(missing in manifest)" + `itemId`; the tile in the `missing` state. |
| No `AudioManifest.json` | `publicError` with the HTTP status, red pill; the archive loads anyway. |
| Gateway unreachable with a valid session | The demo tier works, `libraryError`, red archive pill. |
| `401` from the gateway | Session cleared; during playback the gate with `accessExpired`. |
| Both tiers empty | Catalogue: "The manifest contains no sounds.", the "Manifest: failed to load" pill. |
| No variant URL | `alert(alertMissingAudio)`. |
| Playback error | `alert(alertPlaybackFailed)` and the tile stops. |
| No Web Audio | Volume through `audio.volume` (max 100%). |
| No Wake Lock API | The screen may dim; playback works. |
| SortableJS unavailable | Order changes by arrows only. |
| JSZip unavailable | The `builderErrorLibrary` message. |
| No `localStorage` / `sessionStorage` | The module works without remembering anything. |
| Empty catalogue after filters | "No results for the current filters." |
| No matching folders | "No folder contains the typed phrase." |
| Empty list | Editor: "The list is empty…"; view: "There are no sounds on this list yet." |

## 23. 1:1 module recreation procedure

1. Recreate `Audio/index.html`, `Audio/style.css` and `Audio/app.js` following sections 2–21 (markup structure from sections 18–19, styles from section 20, logic from sections 5–19).
2. Provide the shared files: `shared/access-gate.css`, `shared/firebase-write-status.js`, `shared/firebase-write-status.css`, `shared/appcheck-config.js`, `shared/firebase-app-check.js` and the `IkonaPowiadomien2.png` icon in the repository root.
3. Create `Audio/config/firebase-config.js` with the Firebase project's `window.firebaseConfig` (guide: `Audio/config/FirebaseREADME.md`) and set Firestore rules that allow the `audio/favorites` document.
4. Deploy `Audio/worker/audio-gate.js` as the `audio-gate` Worker, set the four environment variables (section 9.1) and put the Worker address into the `AUDIO_GATE_BASE` constant.
5. Keep the `AudioManifest.xlsx` sheet outside this repository. Open `Audio/index.html?admin=1`, use "Tools → Build manifests from XLSX", copy `AudioManifest.json` into the `Audio` folder and `audio-manifest.json` into the root of the private `AudioRPG` repository.
6. Reload the admin panel: the manifest pill shows the item count; after unlocking the archive, the full count.
7. Recreate the lists: name the main list (optional), create lists, add sounds from the catalogue, arrange the order, give aliases.
8. Export the settings ("Tools → Export settings (JSON)") as a backup.
9. Open `Audio/index.html` and check the tabs, tiles, playback, Loop, volume and "Stop all".
10. Check local mode: temporarily remove `apiKey` from the configuration and confirm the save in `audio.settings`.

## 24. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Admin start | `Audio/index.html?admin=1` | Header with pills, three columns (≥1280 px), preview at the bottom; no console errors. |
| User start | `Audio/index.html` | Only the tab bar and the tile grid. |
| New list | "+ New list", type a name, `Enter` | The list at the end, name saved, visible in the preview tabs. |
| Per-list alias | Add sound X to three lists; give it alias "X2" on the second and "X3" on the third | First list: `X`; second: `X (X2)`; third: `X (X3)`; "On other lists" shows the aliases. |
| Duplicate | ⧉ on a list with aliases | A copy right after the original, with the same entries and aliases. |
| List order | ▲/▼ and dragging | The main list always first; nothing can be dropped before it. |
| Entry order | ⤒ ▲ ▼ ⤓ and dragging | The order changes in the editor, the preview and the user view. |
| Order lock | Type a phrase into "Search this list" | Arrows and handles disabled, blue label, hint visible. |
| Tree — group | Clear a folder with subfolders | The catalogue hides the whole subtree; the parent shows the state derived from its children; blue "Folders" title and dots. |
| Tree — subgroup | With the parent cleared, select a subfolder | The parent is mixed; the catalogue shows only the subfolder's sounds. |
| Folder search | Type part of a name (also in capitals, without Polish diacritics) | Matching folders with ancestors, `<mark>`, blue label, "… matches" actions. |
| Catalogue search | Type part of an alias | The catalogue finds the sound by an alias from any list. |
| Bulk selection | Select a row, `Shift` + click another, "Add to …" | The whole range appended to the target list without duplicates. |
| Removing with an alias | `✓` on an entry with an alias | A confirmation; after agreeing, the entry and the alias are gone. |
| Deleting a list | 🗑 | A confirmation with the number of entries and aliases; the editor returns to the main list. |
| Main list name | Rename it, then clear the field | The custom name in the tab; after clearing, "Widok główny". |
| Special characters | Alias `<b>x</b>` | Shown literally, not interpreted as HTML. |
| Preview | Switch Desktop / Tablet / Phone | An 820 / 390 px frame, a device-like layout; playback works. |
| Playback | Click a tile | "Loading" (archive), then a red frame, ■, a progress bar; clicking again stops it. |
| Loop | Click Loop | The sound loops with random variants; the button is red; clicking again stops it. |
| Tab change | Start a sound and switch the list | The sound keeps playing; that list's tab has a red dot; coming back, the tile shows its state. |
| Stop all | Start several sounds | The `(N)` counter; one click stops them all. |
| Volume | Slider to the maximum, double-click the value | 200%, then 100%; after a reload, 100%. |
| Archive item while locked | Click a tile with 🔒 | The gate with an explanation; the entry stays on the list. |
| Skipping the gate | "Skip", reload | The gate does not return; in a new tab it does. |
| Login | Correct password | The gate closes, "Archive: unlocked", the "Unlock archive" button disappears. |
| Old format | A document with `favorites` / `mainView` / `aliases` fields | Empty lists, a notice in the admin panel; no write on read; the first change writes only `schemaVersion`, `playlists`, `updatedAt`. |
| Live update | Change a list in the admin panel with the user view open | The user view refreshes on its own. |
| Failed save | Block Firestore and add a list | The "Saved on this device only" bar, the list visible, data in `audio.settings`. |
| Export | "Export settings (JSON)" | A `audio-settings-YYYY-MM-DD.json` file (Polish interface: `audio-ustawienia-…`) with `schemaVersion`, `playlists`, `exportedAt`. |
| Builder: stability | Build manifests from an unchanged sheet | Files identical to those in the repositories. |
| Builder: errors | A sheet without a column / with a duplicate column | A message naming the column; no file produced; red pill. |
| Phone | Admin panel at ~390 px | Catalogue / Lists / Preview tabs, a folder drawer, every function available, no horizontal scrolling. |
| Language | Temporarily show the switcher and choose English | Every interface text in English; list names unchanged. |

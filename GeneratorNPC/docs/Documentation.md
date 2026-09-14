# 🇵🇱 Dokumentacja techniczna — GeneratorNPC (PL)

## Cel modułu

`GeneratorNPC` jest przeglądarkowym modułem do składania i drukowania profili NPC na podstawie prywatnych danych DataVault.

Moduł pozwala:

- odblokować prywatne dane przez bramkę K.O.Z.A.,
- pobrać dane runtime z DataVault przez wspólny loader Firebase,
- wybrać bazowy rekord z `Bestiariusz`,
- dodać broń, pancerz, augumentacje, ekwipunek, talenty, psionikę i modlitwy,
- tymczasowo nadpisać wybrane wartości rekordu Bestiariusza,
- zapisać konfigurację NPC jako ulubioną,
- odtworzyć ulubioną konfigurację,
- wygenerować kartę NPC do druku w osobnym oknie.

Moduł jest frontendem HTML/CSS/JS. Nie ma własnego backendu aplikacyjnego. Korzysta z Firebase w dwóch niezależnych warstwach: prywatne dane DataVault oraz ulubione NPC.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `GeneratorNPC/index.html` | Jedyny widok aplikacji. Zawiera HTML, importy skryptów i główny kod modułu. |

Moduł nie ma osobnego widoku admina. Dostęp do prywatnych danych odbywa się przez bramkę K.O.Z.A.

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `GeneratorNPC/index.html` | Szkielet UI i główna logika JavaScript modułu. |
| `GeneratorNPC/style.css` | Style layoutu, paneli, tabel, karty drukowanej i responsywności. |
| `GeneratorNPC/config/firebase-config.js` | Konfiguracja Firebase używana przez Firestore ulubionych NPC. |
| `GeneratorNPC/config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase dla modułu. |
| `GeneratorNPC/docs/README.md` | Instrukcja użytkownika. |
| `GeneratorNPC/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |
| `shared/firebase-config.js` | Wspólna konfiguracja Firebase dla prywatnych danych DataVault. |
| `shared/firebase-data-loader.js` | Wspólny loader prywatnych danych DataVault. |
| `shared/appcheck-config.js` | Jedyne miejsce z kluczami witryny App Check (reCAPTCHA Enterprise) dla obu projektów Firebase. |
| `shared/firebase-app-check.js` | Wspólne uruchamianie App Check dla aplikacji Firebase w zapisie modularnym (SDK 12.6.0). |
| `shared/access-gate.css` | Wspólne style bramki dostępu K.O.Z.A. |

## Zależności zewnętrzne

`GeneratorNPC/index.html` ładuje:

- `style.css`,
- `../shared/access-gate.css`,
- `config/firebase-config.js`,
- `../shared/firebase-config.js`,
- `../shared/appcheck-config.js`,
- `https://www.google.com/recaptcha/enterprise.js` ze znacznikiem `defer`,
- `../shared/firebase-data-loader.js`,
- moduły Firebase z CDN w wersji `12.6.0`:
  - `firebase-app.js`,
  - `firebase-firestore.js`,
  - `firebase-app-check.js` (przez `../shared/firebase-app-check.js`).

Wspólny loader `shared/firebase-data-loader.js` ładuje i używa także:

- Firebase Authentication,
- Firebase Realtime Database.

## Warstwy Firebase

Moduł korzysta z dwóch warstw Firebase.

### 1. Prywatne dane DataVault

Ta warstwa używa:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

Odpowiada za:

- konfigurację `window.WG_FIREBASE_CONFIG`,
- techniczny e-mail `window.WG_DATA_ACCESS_EMAIL`,
- Firebase Authentication,
- logowanie hasłem wpisanym w bramce K.O.Z.A.,
- odczyt Realtime Database `datavault/live`,
- rozpakowanie `dataJson`, jeżeli dane są zapisane jako wrapper `datavault-firebase-import-v1`.

Ta warstwa jest wymagana. Bez niej `GeneratorNPC` nie ma danych źródłowych.

### 2. Ulubione NPC

Ta warstwa używa:

```text
GeneratorNPC/config/firebase-config.js
```

Odpowiada za:

- `window.firebaseConfig`,
- named app `generator-npc-favorites`,
- Firestore,
- dokument `generatorNpc/favorites`,
- synchronizację listy ulubionych konfiguracji NPC.

Ta warstwa jest opcjonalna. Jeżeli Firestore ulubionych nie działa, moduł zapisuje ulubione w `localStorage` pod kluczem `generatorNpcFavorites`.

Szczegóły konfiguracji obu warstw są opisane w `GeneratorNPC/config/FirebaseREADME.md`.

### App Check w obu warstwach

Moduł jest jedynym miejscem w aplikacji, które łączy się z **dwoma** projektami Firebase naraz:
`wh40k-data-slate` (prywatne dane DataVault) i `audiorpg-2eb6f` (ulubione NPC). Każdy projekt ma
własny klucz witryny reCAPTCHA Enterprise, dlatego klucze są w `shared/appcheck-config.js` spisane
pod identyfikatorem projektu, a `activateAppCheck(app)` z `shared/firebase-app-check.js` sam
dobiera właściwy klucz na podstawie `app.options.projectId`.

- warstwa ulubionych: `getOrCreateNamedFirebaseApp()` wywołuje `activateAppCheck()` bezpośrednio po
  `initializeApp()`, przed `getFirestore()`,
- warstwa prywatnych danych: App Check uruchamia `shared/firebase-data-loader.js`.

Bibliotekę reCAPTCHA Enterprise wczytuje sama strona znacznikiem `<script defer>`, a nie SDK
Firebase — SDK dokłada własny znacznik bez obsługi błędu wczytania i przy zablokowanym adresie
czeka bez końca, blokując wszystkie zapytania do bazy. Gdy biblioteki nie ma, `activateAppCheck()`
zapisuje ostrzeżenie w konsoli i pomija App Check; moduł działa wtedy tak jak przed jego
wprowadzeniem, łącznie z zapasem w `localStorage`.

## Przepływ startowy aplikacji

Po załadowaniu strony aplikacja wykonuje logicznie następujący przepływ:

1. Ustawia domyślny język `pl`.
2. Podpina event listenery do elementów UI.
3. Aktualizuje widoczność modułów według checkboxów `data-module-toggle`.
4. Inicjalizuje magazyn ulubionych przez `initFavoritesStore()`, który tworzy aplikację `generator-npc-favorites` i uruchamia dla niej App Check.
5. Uruchamia `startPrivateDataFlow()`.
6. Czeka na `window.DataVaultFirebaseReady` albo event `datavault-firebase-loader-ready`.
7. Inicjalizuje wspólny Firebase private data loader.
8. Sprawdza sesję Auth.
9. Jeżeli użytkownik nie jest zalogowany, pokazuje bramkę K.O.Z.A.
10. Po poprawnym logowaniu ładuje dane przez `loadPrivateGeneratorData()`.
11. Rozdziela dane na kolekcje modułu.
12. Wypełnia listy wyboru.
13. Renderuje puste lub domyślne tabele modułów.

## Bramka dostępu K.O.Z.A.

Bramka dostępu jest zdefiniowana jako `#accessGate`.

Najważniejsze elementy:

| Element | ID | Rola |
| --- | --- | --- |
| Formularz | `accessForm` | Obsługuje wpisanie Litanii Dostępu. |
| Pole hasła | `accessPassword` | Hasło przekazywane do wspólnego loadera Firebase. |
| Komunikat błędu | `accessError` | Miejsce na czytelne błędy logowania i odczytu danych. |

Po wysłaniu formularza kod wywołuje:

```text
loginWithGroupPassword(...)
loadPrivateGeneratorData()
```

Komunikaty błędów są tłumaczone przez `getGeneratorDataLoadErrorMessage(...)` albo `firebaseApi.getReadableAccessError(...)`.

## Źródło danych runtime

Po autoryzacji `GeneratorNPC` pobiera dane z prywatnego DataVault.

Wymagana struktura po rozpakowaniu:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

Wymagane arkusze:

- `Bestiariusz`,
- `Pancerze`,
- `Bronie`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

Dodatkowo moduł korzysta z:

```text
_meta.traits
```

do pokazywania opisów cech w popoverze.

Jeżeli `sheets` nie istnieje, wymagany arkusz nie istnieje albo wymagany arkusz jest pusty, moduł rzuca błąd z prefiksem `GENERATORNPC_...` i pokazuje czytelny komunikat.

## Kolekcje danych w stanie aplikacji

Po załadowaniu danych `loadPrivateGeneratorData()` ustawia:

| Pole stanu | Źródłowy arkusz | Sortowanie |
| --- | --- | --- |
| `state.bestiary` | `Bestiariusz` | Po nazwie. |
| `state.armor` | `Pancerze` | Po typie, potem po nazwie. |
| `state.weapons` | `Bronie` | Po typie, potem po nazwie. |
| `state.augmentations` | `Augumentacje` | Po typie, potem po nazwie. |
| `state.equipment` | `Ekwipunek` | Po typie, potem po nazwie. |
| `state.talents` | `Talenty` | Po nazwie. |
| `state.psionics` | `Psionika` | Po typie malejąco, potem po nazwie. |
| `state.prayers` | `Modlitwy` | Po nazwie. |

Sortowanie uwzględnia `LP`, jeżeli rekordy mają taką wartość.

## Główne sekcje UI

### Topbar

Topbar zawiera:

- tytuł `Generator NPC`,
- ukryty przełącznik języka `languageSelect`,
- przycisk `Reset`,
- przycisk `Generuj kartę`.

Przełącznik języka istnieje w HTML, ale ma klasę `language-switcher--hidden`, a reguła
`.language-switcher--hidden { display: none !important; }` w `GeneratorNPC/style.css` chowa go
z interfejsu. Warstwa tłumaczeń pozostaje aktywna, a domyślnym językiem jest polski.

Aby go pokazać, wystarczy usunąć klasę `language-switcher--hidden` z kontenera
`<div class="language-switcher language-switcher--hidden">` w pliku `GeneratorNPC/index.html` — regułę CSS
można zostawić, bo bez klasy nie ma na co działać. Nad elementem stoi komentarz
`MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`.

Klasa stoi na kontenerze, bo kontener zawiera wyłącznie select — przyciski `Reset` i `Generuj kartę`
leżą poza nim.

### Sidebar

Sidebar zawiera cztery panele:

1. `Źródło danych` — status ładowania danych z prywatnej bazy.
2. `Wybór bazowy` — wybór rekordu Bestiariusza, checkbox starych wpisów i notatki.
3. `Moduły aktywne` — checkboxy widoczności modułów.
4. `Ulubione` — zapis, odczyt, odświeżanie, usuwanie i sortowanie ulubionych konfiguracji.

### Workspace

Workspace zawiera karty:

- `Podgląd bazowy Bestiariusza`,
- `Wybór Broni`,
- `Wybór Pancerzy`,
- `Wybór Augumentacji`,
- `Wybór Ekwipunku`,
- `Wybór Talentów`,
- `Wybór Psioniki`,
- `Wybór Modlitw`.

Każda karta modułu ma listę wyboru i tabelę podglądu danych.

## Moduły aktywne

Widocznością modułów sterują checkboxy z atrybutem `data-module-toggle`.

| Toggle | Sekcja | Znaczenie |
| --- | --- | --- |
| `weapon` | Broń | Dodaje broń jako nadpisanie ataków. |
| `armor` | Pancerz | Dodaje pancerz jako nadpisanie WP i cech pancerza. |
| `augmentations` | Augumentacje | Dodaje augumentacje jako dodatkową sekcję karty. |
| `equipment` | Ekwipunek | Dodaje ekwipunek jako dodatkową sekcję karty. |
| `talents` | Talenty | Dodaje talenty jako dodatkową sekcję karty. |
| `psionics` | Psionika | Dodaje psionikę jako dodatkową sekcję karty. |
| `prayers` | Modlitwy | Dodaje modlitwy jako dodatkową sekcję karty. |

`updateModuleVisibility()` ukrywa albo pokazuje elementy z `data-module-section`.

## Podgląd bazowy Bestiariusza

Po wybraniu rekordu Bestiariusza `updateBestiarySelection()` renderuje tabelę bazową.

### Szerokość i zawijanie tekstu

Podgląd bazowy jest tabelą klucz/wartość i mieści się na szerokość ekranu na każdej rozdzielczości.
Odpowiadają za to trzy reguły w `GeneratorNPC/style.css`:

| Reguła | Po co |
| --- | --- |
| `.data-table[data-sheet="Bestiariusz"] { min-width: 0; width: 100% }` | Zdejmuje odziedziczone z `.data-table` `min-width: max-content`, które kazało tabeli nigdy nie być węższą niż jej najdłuższa pojedyncza linia tekstu. |
| `.celltext { overflow-wrap: break-word }` | Łamie bardzo długie pojedyncze wyrazy (na przykład wklejony adres) zamiast pozwolić im wystawać poza komórkę. `word-break` zostaje `normal`, więc zwykłe wyrazy nadal łamią się po spacjach. |
| `@media (max-width: 640px)` — wiersze i komórki jako bloki | Na telefonie klucz staje nad wartością, a wartość dostaje całą szerokość. Kolumna „Klucz" ma stałe 25 znaków i przy wąskim ekranie zabierałaby większość miejsca. |

Zakaz zwężania dotyczy **wyłącznie** tego arkusza. Szerokie tabele wielokolumnowe modułu — `Wybór Broni`
(10 kolumn) i `Wybór Psioniki` (8 kolumn) — zachowują `min-width: max-content` i przewijanie w bok
wewnątrz swojej karty, bo ścisnąć ich sensownie się nie da.

Pionowe zwijanie długich komórek działa niezależnie: `createClampCell` zwija zawartość powyżej
`CLAMP_LINES = 9` linii i pokazuje podpowiedź „kliknij aby rozwinąć".

### Reguły `min-col-*`

`getColumnClass(label)` buduje nazwę klasy z etykiety kolumny: zamienia na małe litery, rozkłada
znaki diakrytyczne przez `normalize("NFD")`, usuwa je, a pozostałe znaki spoza `[a-z0-9]` zamienia na
myślnik. Klasę nadaje wyłącznie `renderOrderedTable` przez piąty argument `createClampCell`.

Dwie konsekwencje, o których trzeba wiedzieć przy dopisywaniu reguł:

- **Podgląd bazowy nie dostaje tych klas w ogóle.** `renderBestiaryTable` woła `createClampCell` bez
  piątego argumentu, więc reguły `.data-table[data-sheet="Bestiariusz"] .min-col-*` nie mają czego
  dotyczyć. Szerokość kolumn tego arkusza ustawiają reguły `td:first-child` / `td:last-child`.
- **Litera „ł" nie jest znakiem diakrytycznym w rozumieniu `normalize("NFD")`.** Nie rozkłada się na
  „l" plus znak, więc zostaje i wpada w zamianę na myślnik. Etykieta `Słowa Kluczowe` daje klasę
  `min-col-s-owa-kluczowe`, a nie `min-col-slowa-kluczowe`. Regułę dla takiej kolumny trzeba zapisać
  pod nazwą, którą kod naprawdę generuje.

W pliku są wyłącznie reguły dla par „arkusz + kolumna", które moduł faktycznie rysuje.

Część pól liczbowych jest edytowalna. Dotyczy między innymi:

- `S`,
- `Wt`,
- `Zr`,
- `I`,
- `SW`,
- `Int`,
- `Ogd`,
- `Odporność (w tym WP)`,
- `Obrona`,
- `Żywotność`,
- `Odporność Psychiczna`,
- `Upór`,
- `Odwaga`,
- `Szybkość`.

`Umiejętności` i `Słowa Kluczowe` mogą być edytowane jako tekst.

Nadpisania są trzymane w:

```text
state.bestiaryOverrides
```

## `state.bestiaryOverrides`

| Pole | Typ | Opis |
| --- | --- | --- |
| `numeric` | `Map` | Nadpisania wartości liczbowych po kluczu kanonicznym. |
| `skills` | `string|null` | Nadpisany tekst umiejętności. |
| `skillsEditing` | `boolean` | Czy pole umiejętności jest w trybie edycji. |
| `keywords` | `string|null` | Nadpisane słowa kluczowe. |
| `keywordsEditing` | `boolean` | Czy pole słów kluczowych jest w trybie edycji. |

Przy zmianie rekordu Bestiariusza nadpisania są resetowane.

## Stare wpisy Bestiariusza

Stare wpisy są rozpoznawane po wartości `Stan` równej `old`.

Checkbox `bestiary-show-old` steruje wyłącznie widocznymi opcjami selecta Bestiariusza. Nie modyfikuje `state.bestiary`.

Jeżeli ulubiony wpis wskazuje stary rekord, a checkbox jest wyłączony, `applyFavorite(...)` automatycznie włącza widoczność starych rekordów przed odtworzeniem wyboru.

## Moduł pancerza

Pancerze z wartością WP równą `-` są blokowane w select.

Po wybraniu pancerza generator może:

- nadpisać WP,
- przeliczyć odporność, jeżeli bazowa wartość zawiera WP,
- przenieść cechy pancerza na kartę,
- opcjonalnie dodać opisy cech pancerza.

Jeżeli wybrany rekord Bestiariusza ma pancerz zablokowany, wybór pancerza jest wyłączany.

## Moduł broni

Wybrane bronie są konwertowane na wpisy ataków.

Generator zapisuje dla każdej broni między innymi:

- nazwę,
- obrażenia,
- DK,
- PP,
- zasięg,
- szybkostrzelność,
- cechy.

Opcjonalnie można dołączyć opisy cech broni.

## Moduły dodatkowe

Augumentacje, ekwipunek, talenty, psionika i modlitwy mogą być dodawane jako dodatkowe sekcje na karcie.

Każdy z tych modułów ma toggle `Czy dodać pełen opis?`. Jeżeli toggle jest wyłączony, karta pokazuje głównie nazwy. Jeżeli jest włączony, karta dodaje szczegóły wybranych kolumn.

Dla psioniki kolumna `Wzmocnienie` jest normalizowana przy budowaniu wpisów modułu.

## Ulubione NPC

Ulubione pozwalają zapisać aktualną konfigurację NPC.

Główne funkcje:

| Funkcja | Rola |
| --- | --- |
| `initFavoritesStore()` | Próbuje uruchomić Firestore ulubionych albo przechodzi na localStorage. |
| `saveFavorites()` | Zapisuje ulubione do Firestore albo localStorage. |
| `loadFavoritesFromLocal()` | Wczytuje lokalny fallback. |
| `saveFavoritesToLocal()` | Zapisuje lokalny fallback. |
| `buildFavoritePayload()` | Serializuje aktualną konfigurację NPC. |
| `addFavorite()` | Dodaje nowy ulubiony wpis. |
| `removeFavorite()` | Usuwa wpis. |
| `moveFavorite()` | Przesuwa wpis na liście. |
| `applyFavorite()` | Odtwarza zapisany wybór i toggles. |

## Model Firestore ulubionych

Firestore dokument:

```text
generatorNpc/favorites
```

Model dokumentu:

| Pole | Typ | Opis |
| --- | --- | --- |
| `favorites` | `array<object>` | Lista ulubionych konfiguracji. |
| `updatedAt` | `timestamp` | Znacznik czasu zapisu. |

Model pojedynczego ulubionego wpisu:

| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `string` | Unikalny identyfikator. |
| `alias` | `string` | Alias wpisany przez użytkownika. Może być pusty. |
| `createdAt` | `number` | Timestamp z `Date.now()`. |
| `payload` | `object` | Snapshot konfiguracji. |

## Model `payload` ulubionego

| Pole | Typ | Opis |
| --- | --- | --- |
| `selectedBestiaryIndex` | `number` | Indeks wybranego rekordu Bestiariusza. |
| `bestiaryName` | `string` | Nazwa rekordu w chwili zapisu. |
| `bestiaryOverrides` | `object` | Nadpisania bazowego rekordu. |
| `notes` | `string` | Notatki użytkownika. |
| `modules` | `object` | Indeksy wybranych elementów modułów. |
| `toggles` | `object` | Stany przełączników UI. |

`modules` przechowuje indeksy, a nie stabilne ID rekordów. Zmiana kolejności lub zawartości danych DataVault może sprawić, że stary ulubiony wpis nie odtworzy dokładnie tego samego zestawu.

## LocalStorage fallback

Jeżeli Firestore ulubionych jest niedostępny, używany jest klucz:

```text
generatorNpcFavorites
```

Fallback działa tylko w bieżącej przeglądarce i nie synchronizuje danych między urządzeniami.

## Formatowanie tabel

Moduł renderuje komórki przez funkcje formatowania:

- `formatInlineHTML(...)`,
- `formatTextHTML(...)`,
- `formatRangeHTML(...)`,
- `formatKeywordHTML(...)`.

Obsługiwane markery:

| Marker | Efekt |
| --- | --- |
| `{{RED}}...{{/RED}}` | Czerwony tekst. |
| `{{B}}...{{/B}}` | Pogrubienie. |
| `{{I}}...{{/I}}` | Kursywa. |
| `{{S}}...{{/S}}` | Przekreślenie. |

Dodatkowo:

- odwołania do stron w nawiasach z `str`, `str.`, `strona` są oznaczane klasą `ref`,
- linie `*[n]` dostają klasę `caretref`,
- słowa kluczowe są renderowane na czerwono,
- przecinki w wybranych kolumnach słów kluczowych mogą być neutralizowane klasą `keyword-comma`,
- długie komórki są clampowane i mogą być rozwijane.

## Popover cech

Cechy są renderowane jako tagi `.tag` z atrybutem `data-trait`.

Po kliknięciu tagu:

1. kod pobiera nazwę cechy,
2. szuka opisu przez `resolveTraitDescription(...)`,
3. pokazuje `trait-popover`,
4. popover ma nagłówek `.popover__header` z przyciskiem zamknięcia
   `#trait-popover-close` (`.popover__close`, `aria-label` z klucza i18n `traitPopoverClose`),
5. popover zamyka: kliknięcie przycisku zamknięcia, kliknięcie poza popoverem oraz klawisz `Escape`.

Poniżej `720px` popover jest panelem wysuwanym od dolnej krawędzi ekranu (`left: 0; right: 0;
bottom: 0`, `width: 100%`, `max-height: 50dvh`, `border-radius: 12px 12px 0 0`, dolny padding
powiększony o `env(safe-area-inset-bottom)`), więc na telefonie nie zasłania wiersza, którego dotyczy.

Opisy są pobierane z `_meta.traits`. Nazwy cech są kanonizowane tak, aby warianty z wartością liczbową, np. `(3)`, mogły pasować do wzorca `(X)`.

## Generowanie karty do druku

Przycisk `Generuj kartę` wymaga wybranego rekordu Bestiariusza.

Po kliknięciu kod:

1. pobiera wybrany rekord Bestiariusza,
2. zbiera wybrane bronie,
3. zbiera wybrane pancerze,
4. zbiera wybrane augumentacje, ekwipunek, talenty, psionikę i modlitwy,
5. buduje nadpisanie broni,
6. buduje nadpisanie pancerza,
7. buduje dodatkowe sekcje modułów,
8. wywołuje `openPrintableCard(...)`,
9. otwiera osobne okno z HTML karty.

Karta do druku zawiera między innymi:

- nazwę NPC,
- słowa kluczowe,
- poziomy zagrożenia,
- statystyki,
- odporność i WP,
- trackery żywotności i odporności psychicznej,
- umiejętności,
- premie,
- zdolności,
- ataki,
- zdolności hordy,
- opcje hordy,
- dodatkowe moduły,
- notatki.

## i18n

`translations` zawiera języki:

- `pl`,
- `en`.

`applyLanguage(lang)` aktualizuje:

- `document.documentElement.lang`,
- teksty z `data-i18n`,
- placeholdery z `data-i18n-placeholder`,
- placeholdery selectów,
- statusy,
- etykiety i komunikaty karty.

Przełącznik języka istnieje, ale jest ukryty klasą `language-switcher--hidden`. Sposób jego
odkrycia opisuje sekcja o strukturze HTML nagłówka.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Brak loadera Firebase DataVault | `getFirebaseApi()` czeka na event, potem rzuca `FIREBASE_LOADER_NOT_READY`. |
| Brak użytkownika Auth | Pokazywana jest bramka K.O.Z.A. |
| Błąd logowania | Pokazywany jest komunikat z loadera Firebase albo lokalny komunikat K.O.Z.A. |
| Brak `data.sheets` | Pokazywany jest błąd struktury danych. |
| Brak wymaganego arkusza | Pokazywany jest komunikat z nazwą brakującego arkusza. |
| Pusty wymagany arkusz | Pokazywany jest komunikat z nazwą pustego arkusza. |
| Brak Firestore ulubionych | Moduł przechodzi na `localStorage`. |
| Błąd zapisu Firestore | Status ulubionych pokazuje błąd i moduł przełącza się na lokalny zapis. |
| Brak opisu cechy | Popover pokazuje komunikat o braku opisu. |
| Brak wybranego rekordu przy generowaniu | Pokazywany jest alert. |
| Ulubiony wskazuje nieistniejący rekord | Pokazywany jest alert. |

## Procedura odtworzenia modułu

1. Zachowaj katalog `GeneratorNPC/` z `index.html`, `style.css`, `config/` i `docs/`.
2. Zachowaj `shared/firebase-config.js`, `shared/firebase-data-loader.js` i `shared/access-gate.css`.
3. Skonfiguruj prywatne dane DataVault zgodnie ze wspólną konfiguracją Firebase.
4. Upewnij się, że `datavault/live` zawiera dane z wymaganymi arkuszami.
5. Skonfiguruj `GeneratorNPC/config/firebase-config.js`, jeżeli ulubione mają działać przez Firestore.
6. Otwórz `GeneratorNPC/index.html`.
7. Przejdź bramkę K.O.Z.A.
8. Sprawdź, czy status pokazuje załadowanie prywatnych danych.
9. Sprawdź, czy select Bestiariusza i listy modułów są wypełnione.
10. Wybierz rekord Bestiariusza i kilka modułów.
11. Wygeneruj kartę do druku.
12. Dodaj konfigurację do ulubionych.
13. Odśwież stronę i sprawdź, czy ulubiony wpis można odtworzyć.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start | Otwórz `GeneratorNPC/index.html`. | Widoczna jest bramka K.O.Z.A. albo moduł przechodzi do ładowania danych, jeśli sesja istnieje. |
| Logowanie | Wpisz poprawną Litanię Dostępu. | Bramka znika, dane są ładowane z DataVault. |
| Wymagane arkusze | Po logowaniu sprawdź listy wyboru. | Bestiariusz, pancerze, bronie i pozostałe moduły są wypełnione. |
| Stare rekordy | Włącz `bestiary-show-old`. | W select Bestiariusza pojawiają się rekordy `old`. |
| Nadpisania liczbowe | Zmień wartość w podglądzie Bestiariusza. | Karta drukowana używa nadpisanej wartości. |
| Nadpisanie umiejętności | Edytuj `Umiejętności`. | Podgląd i karta używają zapisanego tekstu. |
| Broń | Wybierz broń i wygeneruj kartę. | Ataki na karcie zawierają dane broni. |
| Pancerz | Wybierz pancerz i wygeneruj kartę. | WP, odporność i cechy pancerza są uwzględnione. |
| Moduły dodatkowe | Wybierz augumentacje, ekwipunek, talenty, psionikę i modlitwy. | Karta zawiera odpowiednie sekcje. |
| Opisy cech | Włącz opis cech broni lub pancerza. | Karta zawiera opisy cech. |
| Popover | Kliknij tag cechy. | Pokazuje się opis cechy. |
| Ulubione Firestore | Dodaj ulubiony wpis. | Wpis pojawia się w Firestore `generatorNpc/favorites`. |
| Ulubione localStorage | Usuń konfigurację Firestore ulubionych i dodaj wpis. | Wpis zapisuje się lokalnie w `generatorNpcFavorites`. |
| Odtworzenie ulubionego | Kliknij `Wczytaj` przy ulubionym. | UI odtwarza rekord, moduły, notatki, nadpisania i toggles. |
| Reset | Kliknij `Reset`. | Wybory i nadpisania wracają do stanu domyślnego. |

---

# 🇬🇧 Technical documentation — GeneratorNPC (EN)

## Module purpose

`GeneratorNPC` is a browser-based module for assembling and printing NPC profiles using private DataVault data.

The module allows the user to:

- unlock private data through the K.O.Z.A. access gate,
- load runtime data from DataVault through the shared Firebase loader,
- select a base record from `Bestiariusz`,
- add weapons, armor, augmentations, equipment, talents, psionics, and prayers,
- temporarily override selected Bestiary record values,
- save an NPC configuration as a favorite,
- restore a favorite configuration,
- generate a printable NPC card in a separate window.

The module is an HTML/CSS/JS frontend. It has no dedicated application backend. It uses Firebase in two independent layers: private DataVault data and NPC favorites.

## Entry points

| File | Role |
| --- | --- |
| `GeneratorNPC/index.html` | The only application view. Contains HTML, script imports, and main module code. |

The module has no separate admin view. Private data access is handled by the K.O.Z.A. gate.

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `GeneratorNPC/index.html` | UI skeleton and main JavaScript logic. |
| `GeneratorNPC/style.css` | Styles for layout, panels, tables, printable card, and responsiveness. |
| `GeneratorNPC/config/firebase-config.js` | Firebase configuration used by NPC favorites Firestore. |
| `GeneratorNPC/config/FirebaseREADME.md` | Firebase setup guide for the module. |
| `GeneratorNPC/docs/README.md` | User guide. |
| `GeneratorNPC/docs/Documentation.md` | This technical documentation. |
| `shared/firebase-config.js` | Shared Firebase configuration for private DataVault data. |
| `shared/firebase-data-loader.js` | Shared private DataVault data loader. |
| `shared/appcheck-config.js` | The only place holding App Check site keys (reCAPTCHA Enterprise) for both Firebase projects. |
| `shared/firebase-app-check.js` | Shared App Check activation for Firebase apps in modular form (SDK 12.6.0). |
| `shared/access-gate.css` | Shared K.O.Z.A. access gate styles. |

## External dependencies

`GeneratorNPC/index.html` loads:

- `style.css`,
- `../shared/access-gate.css`,
- `config/firebase-config.js`,
- `../shared/firebase-config.js`,
- `../shared/appcheck-config.js`,
- `https://www.google.com/recaptcha/enterprise.js` with the `defer` attribute,
- `../shared/firebase-data-loader.js`,
- Firebase modules from CDN version `12.6.0`:
  - `firebase-app.js`,
  - `firebase-firestore.js`,
  - `firebase-app-check.js` (through `../shared/firebase-app-check.js`).

The shared `shared/firebase-data-loader.js` also loads and uses:

- Firebase Authentication,
- Firebase Realtime Database.

## Firebase layers

The module uses two Firebase layers.

### 1. Private DataVault data

This layer uses:

```text
shared/firebase-config.js
shared/firebase-data-loader.js
```

It is responsible for:

- `window.WG_FIREBASE_CONFIG`,
- technical e-mail `window.WG_DATA_ACCESS_EMAIL`,
- Firebase Authentication,
- signing in with the password entered in the K.O.Z.A. gate,
- reading Realtime Database `datavault/live`,
- unwrapping `dataJson` when data is stored as a `datavault-firebase-import-v1` wrapper.

This layer is required. Without it, `GeneratorNPC` has no source data.

### 2. NPC favorites

This layer uses:

```text
GeneratorNPC/config/firebase-config.js
```

It is responsible for:

- `window.firebaseConfig`,
- named app `generator-npc-favorites`,
- Firestore,
- document `generatorNpc/favorites`,
- synchronizing favorite NPC configurations.

This layer is optional. If favorites Firestore does not work, the module stores favorites in `localStorage` under the key `generatorNpcFavorites`.

Configuration details for both layers are documented in `GeneratorNPC/config/FirebaseREADME.md`.

### App Check in both layers

This module is the only place in the application that connects to **two** Firebase projects at once:
`wh40k-data-slate` (private DataVault data) and `audiorpg-2eb6f` (NPC favorites). Each project has
its own reCAPTCHA Enterprise site key, which is why `shared/appcheck-config.js` lists the keys by
project id and `activateAppCheck(app)` from `shared/firebase-app-check.js` picks the right key from
`app.options.projectId`.

- favorites layer: `getOrCreateNamedFirebaseApp()` calls `activateAppCheck()` right after
  `initializeApp()` and before `getFirestore()`,
- private data layer: App Check is activated by `shared/firebase-data-loader.js`.

The reCAPTCHA Enterprise library is loaded by the page itself with a `<script defer>` tag rather
than by the Firebase SDK — the SDK appends its own tag with no load-error handler and, with a
blocked address, waits forever, stalling every database request. When the library is absent,
`activateAppCheck()` logs a console warning and skips App Check; the module then behaves as it did
before App Check existed, including the `localStorage` fallback.

## Application startup flow

After the page loads, the application logically performs this flow:

1. Sets default language `pl`.
2. Attaches event listeners to UI elements.
3. Updates module visibility based on `data-module-toggle` checkboxes.
4. Initializes favorites storage through `initFavoritesStore()`, which creates the `generator-npc-favorites` app and activates App Check for it.
5. Starts `startPrivateDataFlow()`.
6. Waits for `window.DataVaultFirebaseReady` or event `datavault-firebase-loader-ready`.
7. Initializes the shared private data Firebase loader.
8. Checks the Auth session.
9. If the user is not signed in, shows the K.O.Z.A. access gate.
10. After successful sign-in, loads data through `loadPrivateGeneratorData()`.
11. Splits data into module collections.
12. Fills select lists.
13. Renders empty or default module tables.

## K.O.Z.A. access gate

The access gate is defined as `#accessGate`.

Key elements:

| Element | ID | Role |
| --- | --- | --- |
| Form | `accessForm` | Handles Litany of Access submission. |
| Password field | `accessPassword` | Password passed to the shared Firebase loader. |
| Error message | `accessError` | Displays readable login and data read errors. |

On submit, the code calls:

```text
loginWithGroupPassword(...)
loadPrivateGeneratorData()
```

Error messages are translated through `getGeneratorDataLoadErrorMessage(...)` or `firebaseApi.getReadableAccessError(...)`.

## Runtime data source

After authorization, `GeneratorNPC` loads data from private DataVault.

Required structure after unwrapping:

```text
{
  sheets: { ... },
  _meta: { ... }
}
```

Required sheets:

- `Bestiariusz`,
- `Pancerze`,
- `Bronie`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

The module also uses:

```text
_meta.traits
```

for trait descriptions in the popover.

If `sheets` does not exist, a required sheet is missing, or a required sheet is empty, the module throws a `GENERATORNPC_...` error and displays a readable message.

## Data collections in application state

After loading data, `loadPrivateGeneratorData()` sets:

| State field | Source sheet | Sorting |
| --- | --- | --- |
| `state.bestiary` | `Bestiariusz` | By name. |
| `state.armor` | `Pancerze` | By type, then by name. |
| `state.weapons` | `Bronie` | By type, then by name. |
| `state.augmentations` | `Augumentacje` | By type, then by name. |
| `state.equipment` | `Ekwipunek` | By type, then by name. |
| `state.talents` | `Talenty` | By name. |
| `state.psionics` | `Psionika` | By type descending, then by name. |
| `state.prayers` | `Modlitwy` | By name. |

Sorting respects `LP` when records contain that value.

## Main UI sections

### Topbar

The topbar contains:

- title `Generator NPC`,
- hidden language switcher `languageSelect`,
- `Reset` button,
- `Generate card` button.

The language switcher exists in HTML but carries the `language-switcher--hidden` class, and the
rule `.language-switcher--hidden { display: none !important; }` in `GeneratorNPC/style.css` removes
it from the interface. The translation layer stays active and Polish is the default language.

To make it visible, remove the `language-switcher--hidden` class from the
`<div class="language-switcher language-switcher--hidden">` container in `GeneratorNPC/index.html` — the CSS
rule can stay, because without the class it has nothing to act on. A comment marked
`LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits above the element.

The class sits on the container, because the container holds only the select — the `Reset` and
`Generate card` buttons live outside it.

### Sidebar

The sidebar contains four panels:

1. `Data source` — private database loading status.
2. `Base selection` — Bestiary record selection, old records checkbox, and notes.
3. `Active modules` — module visibility checkboxes.
4. `Favorites` — save, load, refresh, remove, and reorder favorite configurations.

### Workspace

The workspace contains cards:

- `Base preview — Bestiary`,
- `Weapon selection`,
- `Armor selection`,
- `Augmentation selection`,
- `Equipment selection`,
- `Talent selection`,
- `Psionics selection`,
- `Prayer selection`.

Each module card has a select list and a data preview table.

## Active modules

Module visibility is controlled by checkboxes with `data-module-toggle`.

| Toggle | Section | Meaning |
| --- | --- | --- |
| `weapon` | Weapons | Adds weapons as attack overrides. |
| `armor` | Armor | Adds armor as WP and armor trait overrides. |
| `augmentations` | Augmentations | Adds augmentations as an extra card section. |
| `equipment` | Equipment | Adds equipment as an extra card section. |
| `talents` | Talents | Adds talents as an extra card section. |
| `psionics` | Psionics | Adds psionics as an extra card section. |
| `prayers` | Prayers | Adds prayers as an extra card section. |

`updateModuleVisibility()` hides or shows elements with `data-module-section`.

## Base Bestiary preview

### Width and text wrapping

The base preview is a key/value table and fits the screen width at every resolution. Three rules in
`GeneratorNPC/style.css` are responsible:

| Rule | What it is for |
| --- | --- |
| `.data-table[data-sheet="Bestiariusz"] { min-width: 0; width: 100% }` | Drops the `min-width: max-content` inherited from `.data-table`, which told the table never to be narrower than its longest single line of text. |
| `.celltext { overflow-wrap: break-word }` | Breaks very long single words (a pasted URL, say) instead of letting them overflow the cell. `word-break` stays `normal`, so ordinary words still break at spaces. |
| `@media (max-width: 640px)` — rows and cells as blocks | On a phone the key moves above the value and the value gets the full width. The "key" column is a fixed 25 characters and would take most of a narrow screen. |

The narrowing applies to **this sheet only**. The module's wide multi-column tables — the weapon
picker (10 columns) and the psychic picker (8 columns) — keep `min-width: max-content` and their
sideways scrolling inside their own card, because they cannot be squeezed sensibly.

Vertical clamping of long cells works independently: `createClampCell` collapses content above
`CLAMP_LINES = 9` lines and shows a "click to expand" hint.

### The `min-col-*` rules

`getColumnClass(label)` builds a class name from the column label: lowercases it, decomposes
diacritics with `normalize("NFD")`, strips them, and turns every remaining character outside
`[a-z0-9]` into a hyphen. Only `renderOrderedTable` assigns the class, through the fifth argument of
`createClampCell`.

Two consequences worth knowing before adding rules:

- **The base preview never gets these classes.** `renderBestiaryTable` calls `createClampCell` without
  the fifth argument, so `.data-table[data-sheet="Bestiariusz"] .min-col-*` rules have nothing to
  apply to. Column widths for that sheet come from the `td:first-child` / `td:last-child` rules.
- **The letter "ł" is not a diacritic as far as `normalize("NFD")` is concerned.** It does not
  decompose into "l" plus a mark, so it survives and gets hyphenated. The label `Słowa Kluczowe`
  yields the class `min-col-s-owa-kluczowe`, not `min-col-slowa-kluczowe`. A rule for such a column
  has to be written under the name the code actually generates.

The file contains rules only for "sheet + column" pairs the module actually renders.

After selecting a Bestiary record, `updateBestiarySelection()` renders the base table.

Some numeric fields are editable, including:

- `S`,
- `Wt`,
- `Zr`,
- `I`,
- `SW`,
- `Int`,
- `Ogd`,
- `Odporność (w tym WP)`,
- `Obrona`,
- `Żywotność`,
- `Odporność Psychiczna`,
- `Upór`,
- `Odwaga`,
- `Szybkość`.

`Umiejętności` and `Słowa Kluczowe` can be edited as text.

Overrides are stored in:

```text
state.bestiaryOverrides
```

## `state.bestiaryOverrides`

| Field | Type | Description |
| --- | --- | --- |
| `numeric` | `Map` | Numeric overrides by canonical key. |
| `skills` | `string|null` | Overridden skills text. |
| `skillsEditing` | `boolean` | Whether skills are in editing mode. |
| `keywords` | `string|null` | Overridden keywords. |
| `keywordsEditing` | `boolean` | Whether keywords are in editing mode. |

Overrides are reset when the selected Bestiary record changes.

## Old Bestiary entries

Old entries are detected by `Stan` value equal to `old`.

The `bestiary-show-old` checkbox controls only visible Bestiary select options. It does not modify `state.bestiary`.

If a favorite points to an old record and the checkbox is disabled, `applyFavorite(...)` automatically enables old record visibility before restoring the selection.

## Armor module

Armor records with WP value `-` are blocked in the select.

When armor is selected, the generator can:

- override WP,
- recalculate resilience if the base value includes WP,
- move armor traits to the card,
- optionally add armor trait descriptions.

If the selected Bestiary record has blocked armor, armor selection is disabled.

## Weapon module

Selected weapons are converted into attack entries.

For each weapon, the generator stores, among others:

- name,
- damage,
- DN,
- AP,
- range,
- rate of fire,
- traits.

Weapon trait descriptions can optionally be included.

## Additional modules

Augmentations, equipment, talents, psionics, and prayers can be added as extra sections on the card.

Each of these modules has a `Full details` toggle. If disabled, the card mostly shows names. If enabled, the card includes details from selected columns.

For psionics, the `Wzmocnienie` column is normalized while building module entries.

## NPC favorites

Favorites store the current NPC configuration.

Main functions:

| Function | Role |
| --- | --- |
| `initFavoritesStore()` | Tries to start favorites Firestore or falls back to localStorage. |
| `saveFavorites()` | Saves favorites to Firestore or localStorage. |
| `loadFavoritesFromLocal()` | Loads local fallback. |
| `saveFavoritesToLocal()` | Saves local fallback. |
| `buildFavoritePayload()` | Serializes current NPC configuration. |
| `addFavorite()` | Adds a new favorite. |
| `removeFavorite()` | Removes a favorite. |
| `moveFavorite()` | Reorders a favorite. |
| `applyFavorite()` | Restores saved selections and toggles. |

## Favorites Firestore model

Firestore document:

```text
generatorNpc/favorites
```

Document model:

| Field | Type | Description |
| --- | --- | --- |
| `favorites` | `array<object>` | Favorite configuration list. |
| `updatedAt` | `timestamp` | Save timestamp. |

Single favorite model:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier. |
| `alias` | `string` | User-entered alias. Can be empty. |
| `createdAt` | `number` | `Date.now()` timestamp. |
| `payload` | `object` | Configuration snapshot. |

## Favorite `payload` model

| Field | Type | Description |
| --- | --- | --- |
| `selectedBestiaryIndex` | `number` | Selected Bestiary record index. |
| `bestiaryName` | `string` | Record name at save time. |
| `bestiaryOverrides` | `object` | Base record overrides. |
| `notes` | `string` | User notes. |
| `modules` | `object` | Selected module item indices. |
| `toggles` | `object` | UI toggle states. |

`modules` stores indices, not stable record IDs. Changes to DataVault data order or content can prevent old favorites from restoring the exact same set.

## LocalStorage fallback

If favorites Firestore is unavailable, this key is used:

```text
generatorNpcFavorites
```

The fallback works only in the current browser and does not synchronize data across devices.

## Table formatting

The module renders cells through formatting functions:

- `formatInlineHTML(...)`,
- `formatTextHTML(...)`,
- `formatRangeHTML(...)`,
- `formatKeywordHTML(...)`.

Supported markers:

| Marker | Effect |
| --- | --- |
| `{{RED}}...{{/RED}}` | Red text. |
| `{{B}}...{{/B}}` | Bold. |
| `{{I}}...{{/I}}` | Italic. |
| `{{S}}...{{/S}}` | Strikethrough. |

Additionally:

- page references in parentheses containing `str`, `str.`, or `strona` get class `ref`,
- `*[n]` lines get class `caretref`,
- keywords are rendered red,
- commas in selected keyword columns can be neutralized with `keyword-comma`,
- long cells are clamped and can be expanded.

## Trait popover

Traits are rendered as `.tag` elements with `data-trait`.

After a tag is clicked:

1. the code reads the trait name,
2. looks up the description through `resolveTraitDescription(...)`,
3. shows `trait-popover`,
4. the popover has a `.popover__header` header with a close button `#trait-popover-close`
   (`.popover__close`, `aria-label` from the `traitPopoverClose` i18n key),
5. the popover is closed by the close button, by a click outside it, and by the `Escape` key.

Below `720px` the popover is a sheet anchored to the bottom edge (`left: 0; right: 0; bottom: 0`,
`width: 100%`, `max-height: 50dvh`, `border-radius: 12px 12px 0 0`, bottom padding increased by
`env(safe-area-inset-bottom)`), so on a phone it does not cover the row it describes.

Descriptions are loaded from `_meta.traits`. Trait names are canonicalized so that numeric variants like `(3)` can match the `(X)` pattern.

## Printable card generation

`Generate card` requires a selected Bestiary record.

On click, the code:

1. reads the selected Bestiary record,
2. collects selected weapons,
3. collects selected armor,
4. collects selected augmentations, equipment, talents, psionics, and prayers,
5. builds weapon override,
6. builds armor override,
7. builds extra module sections,
8. calls `openPrintableCard(...)`,
9. opens a separate window with printable card HTML.

The printable card includes, among others:

- NPC name,
- keywords,
- threat levels,
- stats,
- resilience and WP,
- vitality and mental resilience trackers,
- skills,
- bonuses,
- abilities,
- attacks,
- horde abilities,
- horde options,
- additional modules,
- notes.

## i18n

`translations` contains:

- `pl`,
- `en`.

`applyLanguage(lang)` updates:

- `document.documentElement.lang`,
- `data-i18n` text,
- `data-i18n-placeholder` placeholders,
- select placeholders,
- statuses,
- labels and printable card messages.

The language switcher exists but is hidden with `language-switcher--hidden`. The header HTML
structure section explains how to reveal it.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Missing DataVault Firebase loader | `getFirebaseApi()` waits for event, then throws `FIREBASE_LOADER_NOT_READY`. |
| No Auth user | K.O.Z.A. access gate is shown. |
| Login error | Message from Firebase loader or local K.O.Z.A. message is shown. |
| Missing `data.sheets` | Data structure error is shown. |
| Missing required sheet | Message includes missing sheet name. |
| Empty required sheet | Message includes empty sheet name. |
| Missing favorites Firestore | Module falls back to `localStorage`. |
| Firestore save error | Favorites status shows error and module switches to local save. |
| Missing trait description | Popover shows unavailable-description message. |
| No selected record when generating | Alert is shown. |
| Favorite points to missing record | Alert is shown. |

## Module recreation procedure

1. Preserve `GeneratorNPC/` with `index.html`, `style.css`, `config/`, and `docs/`.
2. Preserve `shared/firebase-config.js`, `shared/firebase-data-loader.js`, and `shared/access-gate.css`.
3. Configure private DataVault data according to the shared Firebase setup.
4. Ensure `datavault/live` contains data with all required sheets.
5. Configure `GeneratorNPC/config/firebase-config.js` if favorites should use Firestore.
6. Open `GeneratorNPC/index.html`.
7. Pass the K.O.Z.A. access gate.
8. Check that the status shows private data loaded.
9. Check that Bestiary select and module lists are filled.
10. Select a Bestiary record and several modules.
11. Generate a printable card.
12. Add the configuration to favorites.
13. Refresh the page and check that the favorite can be restored.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Start | Open `GeneratorNPC/index.html`. | K.O.Z.A. gate appears or the module starts loading data if session exists. |
| Login | Enter valid Litany of Access. | Gate disappears and DataVault data loads. |
| Required sheets | Check select lists after login. | Bestiary, armor, weapons, and other modules are populated. |
| Old records | Enable `bestiary-show-old`. | `old` records appear in Bestiary select. |
| Numeric overrides | Change a value in Bestiary preview. | Printable card uses the overridden value. |
| Skills override | Edit `Umiejętności`. | Preview and card use the saved text. |
| Weapon | Select weapon and generate card. | Card attacks include weapon data. |
| Armor | Select armor and generate card. | WP, resilience, and armor traits are included. |
| Extra modules | Select augmentations, equipment, talents, psionics, and prayers. | Card includes corresponding sections. |
| Trait descriptions | Enable weapon or armor trait descriptions. | Card includes trait descriptions. |
| Popover | Click a trait tag. | Trait description appears. |
| Firestore favorites | Add favorite. | Entry appears in Firestore `generatorNpc/favorites`. |
| localStorage favorites | Remove favorites Firestore config and add entry. | Entry is saved locally in `generatorNpcFavorites`. |
| Favorite restore | Click `Wczytaj` on a favorite. | UI restores record, modules, notes, overrides, and toggles. |
| Reset | Click `Reset`. | Selections and overrides return to default state. |

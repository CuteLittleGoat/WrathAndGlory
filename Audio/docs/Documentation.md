# 🇵🇱 Dokumentacja techniczna — Audio (PL)

## Cel modułu

`Audio` jest przeglądarkowym panelem do odtwarzania efektów dźwiękowych i zarządzania listami dźwięków używanymi podczas gry.

Moduł pozwala:

- wczytać manifest SFX z `AudioManifest.xlsx`,
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
| `Audio/index.html` | Pełna aplikacja: HTML, CSS, JS, import SheetJS, import konfiguracji Firebase i import modułów Firebase. |
| `Audio/AudioManifest.xlsx` | Źródłowy manifest dźwięków. |
| `Audio/config/firebase-config.js` | Konfiguracja Firebase dla ustawień Audio. |
| `Audio/config/firebase-config.template.js` | Szablon konfiguracji Firebase. |
| `Audio/config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase modułu Audio. |
| `Audio/docs/README.md` | Instrukcja użytkownika. |
| `Audio/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |

## Zależności zewnętrzne

`Audio/index.html` ładuje:

- Google Fonts `Fira Code`,
- SheetJS `xlsx.full.min.js 0.18.5`,
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

- `reloadManifest` — ponowne wczytanie `AudioManifest.xlsx`,
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

## Manifest `AudioManifest.xlsx`

Moduł pobiera manifest przez:

```js
fetch("AudioManifest.xlsx", { cache: "no-store" })
```

Wymagane kolumny:

| Kolumna | Opis |
| --- | --- |
| `NazwaSampla` | Nazwa dźwięku widoczna w UI. |
| `NazwaPliku` | Nazwa pliku audio. |
| `LinkDoFolderu` | Link lub ścieżka folderu, z której budowane są URL i tagi. |

Parser używa SheetJS:

```js
XLSX.read(data, { type: "array" })
XLSX.utils.sheet_to_json(sheet, { defval: "" })
```

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
| `variants` | Lista wariantów `{ filename, fullUrl }`. |

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
| Brak `AudioManifest.xlsx` | Manifest przechodzi w błąd wczytywania. |
| Pusty manifest | Pokazywany jest błąd braku danych manifestu. |
| Brak URL audio | Próba odtworzenia pokazuje alert o brakującym linku. |
| Brak WebAudio | Moduł używa `audio.volume`. |
| Brak wyników tagów | Pokazywany jest pusty stan filtra tagów. |
| Brak wyników SFX | Pokazywany jest pusty stan listy SFX. |
| Dźwięk z listy nie istnieje w manifeście | UI pokazuje tekst `(brak w manifeście)`. |

## Procedura odtworzenia modułu

1. Zachowaj `Audio/index.html`.
2. Zachowaj `Audio/AudioManifest.xlsx` z wymaganymi kolumnami.
3. Zachowaj `Audio/config/firebase-config.js`, jeżeli ustawienia mają synchronizować się przez Firebase.
4. Skonfiguruj Firestore zgodnie z `Audio/config/FirebaseREADME.md`.
5. Otwórz `Audio/index.html?admin=1`.
6. Sprawdź wczytanie manifestu.
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

- load an SFX manifest from `AudioManifest.xlsx`,
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
| `Audio/index.html` | Full application: HTML, CSS, JS, SheetJS import, Firebase config import, and Firebase module imports. |
| `Audio/AudioManifest.xlsx` | Source sound manifest. |
| `Audio/config/firebase-config.js` | Firebase configuration for Audio settings. |
| `Audio/config/firebase-config.template.js` | Firebase configuration template. |
| `Audio/config/FirebaseREADME.md` | Firebase setup guide for Audio. |
| `Audio/docs/README.md` | User guide. |
| `Audio/docs/Documentation.md` | This technical documentation. |

## External dependencies

`Audio/index.html` loads:

- Google Fonts `Fira Code`,
- SheetJS `xlsx.full.min.js 0.18.5`,
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

- `reloadManifest` — reloads `AudioManifest.xlsx`,
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

## Manifest `AudioManifest.xlsx`

The module fetches manifest with:

```js
fetch("AudioManifest.xlsx", { cache: "no-store" })
```

Required columns:

| Column | Description |
| --- | --- |
| `NazwaSampla` | Sound name visible in UI. |
| `NazwaPliku` | Audio filename. |
| `LinkDoFolderu` | Folder link or path used to build URL and tags. |

Parser uses SheetJS:

```js
XLSX.read(data, { type: "array" })
XLSX.utils.sheet_to_json(sheet, { defval: "" })
```

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
| `variants` | List of variants `{ filename, fullUrl }`. |

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
| Missing `AudioManifest.xlsx` | Manifest status switches to load error. |
| Empty manifest | No-data manifest error is shown. |
| Missing audio URL | Playback attempt shows missing-link alert. |
| No WebAudio | Module uses `audio.volume`. |
| No tag results | Tag filter empty state is shown. |
| No SFX results | SFX list empty state is shown. |
| Sound from a list does not exist in manifest | UI displays `(missing in manifest)`. |

## Module recreation procedure

1. Preserve `Audio/index.html`.
2. Preserve `Audio/AudioManifest.xlsx` with required columns.
3. Preserve `Audio/config/firebase-config.js` if settings should sync through Firebase.
4. Configure Firestore according to `Audio/config/FirebaseREADME.md`.
5. Open `Audio/index.html?admin=1`.
6. Check manifest loading.
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

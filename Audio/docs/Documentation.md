# Dokumentacja techniczna modułu Audio (opis 1:1)

> Ten dokument opisuje **dokładny** wygląd i logikę modułu Audio: strukturę HTML, style CSS, zasady działania, mapowanie danych z `AudioManifest.xlsx`, integrację Firebase oraz wszystkie kluczowe funkcje. Celem jest umożliwienie wiernego odtworzenia aplikacji 1:1.

## 1. Architektura i przepływ danych
- **Model aplikacji:** pojedyncza strona `Audio/index.html` z dwoma trybami:
  - **Widok użytkownika** (domyślny) — pokazuje panel odtwarzania oraz boczną nawigację między „Widokiem głównym” i listami „Ulubione”.
  - **Widok admina** — aktywowany przez `?admin=1`, umożliwia konfigurację manifestu, list ulubionych oraz kolejności „Głównego widoku”, a także zawiera w pełni działający podgląd widoku użytkownika (dane i nawigacja są identyczne jak u użytkownika).
- **Źródło danych audio:** plik `AudioManifest.xlsx` wczytywany bezpośrednio w przeglądarce przez bibliotekę XLSX (SheetJS).
- **Ustawienia:** ulubione, „Główny widok” oraz aliasy sampli są przechowywane w Firestore w dokumencie `audio/favorites`. W przypadku braku konfiguracji Firebase używany jest `localStorage` (`audio.settings`).
- **Odtwarzanie:** kliknięcie nazwy sampla lub taga (druga linia pod nazwą) uruchamia/wyłącza dźwięk dla danej karty; równoległe odtwarzanie wielu sampli jest możliwe. Podczas odtwarzania nazwa oraz tag są czerwone, a obok dostępny jest suwak głośności (domyślnie 0, zakres -100% do +100%).

## 2. Struktura repozytorium (pliki i katalogi)
- `Audio/index.html` — główny panel (HTML + CSS + JS).
- `Audio/AudioManifest.xlsx` — źródłowy manifest sampli (kolumny: `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`).
- `Audio/config/firebase-config.js` — konfiguracja Firebase (globalna zmienna `window.firebaseConfig`).
- `Audio/config/firebase-config.template.js` — szablon konfiguracji.
- `Audio/docs/README.md` — instrukcja użytkownika.
- `Audio/docs/Documentation.md` — ten dokument.

## 3. Zasoby zewnętrzne
### 3.1. Google Fonts
- `Fira Code` (wagi 400, 600) z:
```
https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap
```

### 3.2. XLSX (SheetJS)
- Biblioteka do parsowania plików `.xlsx`:
```
https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
```

### 3.3. Firebase SDK
- Modułowe SDK Firebase v12.6.0:
  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js`
  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js`

## 4. Konfiguracja Firebase
### 4.1. Plik `config/firebase-config.js`
- Plik musi ustawiać `window.firebaseConfig` (bez eksportów ES).
- Format:
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

**Ważne:** Firebase dla modułu **Audio** musi być założone na **oddzielnym koncie Google** niż Firebase używany w module **Infoczytnik**. Dzięki temu unikasz konfliktów projektów, reguł i namespace'ów między modułami.

### 4.2. Firestore
- Kolekcja: `audio`
- Dokument: `favorites`
- Dokument tworzony automatycznie, jeśli nie istnieje. Zawiera `favorites`, `mainView` oraz `aliases` (mapa aliasów po `itemId`).

## 5. `index.html` — layout i HTML
- `<title>` ustawiony na `Kozie Audio` (tytuł karty przeglądarki).
- Główny kontener `.page` zawiera:
  1. **Nagłówek** `header` z tytułem, opisem i paskiem statusów (cały nagłówek jest widoczny tylko w trybie admina).
  2. **Toolbar** `.toolbar` (tylko admin): przycisk wczytywania manifestu oraz przyciski zarządzania listami.
  3. **Belka filtrów tagów** `.tag-filter-bar` (tylko admin):
     - nagłówek z przyciskiem **Ukryj/Pokaż panel**,
     - pole „Szukaj tagu...” oraz przycisk **Filtruj ▾**,
     - drzewo checkboxów generowane z tagów folderów,
     - wyskakujące okienko filtra listowego z wyszukiwarką tagów, checkboxami oraz akcjami „Zaznacz wszystko” / „Odznacz wszystko”,
     - filtrowanie wpływa wyłącznie na listę sampli w panelu admina (nie zmienia głównego widoku ani ulubionych).
  4. **Toolbar z wyszukiwarką sampli** `.toolbar` (tylko admin): pole „Szukaj sampla...”, umieszczone **pod** panelami tagów.
  5. **Layout admina** `.layout` (tylko admin) w dwóch kolumnach:
     - Lewy panel: lista sampli (`.samples-grid`) z akcjami dodania do listy (select: **Widok Główny** lub lista „Ulubione”).
       - Każda karta sampla pokazuje: nazwę sampla (z aliasem w nawiasie, jeśli ustawiono), `tag2` (drugi poziom folderu) oraz nazwę pliku.
       - Pod metadanymi znajduje się pole tekstowe **Alias (opcjonalny)**, a **bezpośrednio pod nim** przycisk **Wyczyść** (powyżej **Odtwórz**), który usuwa alias dla danego sampla.
     - Prawa kolumna `.side-stack`: 
       - panel „Ulubione” (`#favoritesPanel`) z pełnymi kontrolkami (rename, move, remove),
       - panel „Główny widok” (`#mainViewPanel`) do ustawiania kolejności nadrzędnej listy.
  6. **Widok użytkownika** `.user-view` (pokazywany także w adminie jako podgląd):
     - układ `.user-layout` w dwóch kolumnach,
     - lewy panel z kontenerami `#userMainView` i `#userFavoritesView` (klikana nazwa/tags sterują odtwarzaniem, bez przycisku),
     - każda karta w widoku użytkownika pokazuje nazwę sampla i `tag2` (bez nazwy pliku) oraz suwak głośności,
     - prawy panel z nawigacją `#userNav` (przycisk „Widok główny” + lista ulubionych),
     - brak dodatkowych sekcji (nagłówek jest ukryty w trybie użytkownika).

## 6. Style CSS (dokładne wartości)
**Zmienne w `:root`:**
- `--bg`: radialne gradienty + `#031605` (tło).
- `--panel`: `#000`.
- `--panel-alt`: `#041b08`.
- `--border`: `#16c60c`.
- `--text`: `#9cf09c`.
- `--accent`: `#16c60c`.
- `--accent-dark`: `#0d7a07`.
- `--accent-strong`: `#1ee616`.
- `--muted`: `rgba(156, 240, 156, 0.7)`.
- `--danger`: `#ff5f5f`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `12px`.
- `--shadow`: `0 8px 24px rgba(0, 0, 0, 0.45)`.
- `--font`: `"Fira Code", "Consolas", "Source Code Pro", monospace`.

**Kluczowe elementy:**
- `header`: ramka `2px solid --border`, `box-shadow: --glow`.
- `.toolbar`: `border: 1px solid rgba(22, 198, 12, 0.7)`, `box-shadow: --shadow`.
- `.tag-filter-bar`: tło `--panel`, `border: 1px solid rgba(22, 198, 12, 0.6)`, `padding: 14px 16px`, `box-shadow: --shadow`.
- `.tag-filter-header`: układ nagłówka filtrów (flex, space-between).
- `.tag-filter-controls`: pole wyszukiwania tagów, układ flex z odstępami.
- `.tag-filter-menu`: popup filtra listowego (`position: fixed`, `width: min(320px, 90vw)`, `border-radius: 10px`, `box-shadow: --shadow`).
- `.tag-menu-list`: scrollowana lista checkboxów tagów (`max-height: 280px`).
- `.tag-filter-bar.is-collapsed .tag-filter-body`: ukrywa panel checkboxów tagów (`display: none`).
- `.tag-tree`: kolumnowe drzewko checkboxów, `gap: 6px`.
- `.tag-children.is-hidden`: ukrywanie podfolderów po odznaczeniu rodzica (`display: none`).
- `.group-count`: kolor `var(--danger)` dla liczby zgrupowanych plików audio.
- `.sample-alias`: kolor `#d2fad2`, jaśniejsza czcionka dla aliasu w nawiasie.
- `.side-stack`: prawa kolumna w adminie, `display: flex`, `flex-direction: column`, `gap: 22px`.
- `.samples-grid`: `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))`.
- `.sample-card`: tło `--panel-alt`, `border: 1px solid rgba(22, 198, 12, 0.4)`, `border-radius: 10px`.
- `.alias-controls`: układ kolumnowy (flex) dla pola aliasu, `gap: 6px` (przycisk „Wyczyść” znajduje się pod polem aliasu).
- `.alias-input`: pole tekstowe aliasu (`background: #031806`, `border: 1px solid rgba(22, 198, 12, 0.6)`, `font-size: 12px`).
- `.fav-list`: `border: 1px solid rgba(22, 198, 12, 0.5)`, tło `#031206`.
- Przyciski `.btn`: `border: 1px solid --border`, tło `#031806`, uppercase, `letter-spacing: 0.06em`.
- `.sample-trigger`: elementy klikalne (nazwa sampla oraz tag), `cursor: pointer` i łagodne przejście koloru.
- `.sample-card.is-playing .sample-trigger` oraz `.fav-item.is-playing .sample-trigger`: aktywne odtwarzanie podświetla nazwę i tag na `--danger`.
- `.volume-slider`: suwak głośności (`input[type="range"]`) o szerokości 100% i `accent-color: --accent`.
- `.user-view`: kolumna usera, `display: flex`, `flex-direction: column`, `gap: 16px`.
- `.user-layout`: siatka 2-kolumnowa (`minmax(0, 1.7fr)` + `minmax(240px, 0.7fr)`).
- `.user-nav`: panel boczny w widoku użytkownika, układ kolumnowy z `gap: 12px`.
- `.user-nav-group`: grupowanie przycisków nawigacji, `flex-direction: column`, `gap: 8px`.
- `.user-nav .btn.is-active`: wzmocniony stan aktywny (zielone tło i glow).
- `.user-panel`: kontener list w widoku użytkownika, domyślnie `display: none`; klasa `.is-visible` ustawia `display: flex`.
- Responsywność: poniżej `980px` układ przechodzi do jednej kolumny.

## 7. Mapowanie danych z `AudioManifest.xlsx`
- Plik jest wczytywany przez `fetch` i parsowany przez `XLSX.read`.
- Pierwszy arkusz jest konwertowany przez `XLSX.utils.sheet_to_json`.
- Wymagane kolumny:
  - `NazwaSampla` → `label`.
  - `NazwaPliku` → `filename`.
  - `LinkDoFolderu` → `folderUrl`.
- Dodatkowe kolumny (w tym kolory) są ignorowane.
- **ID sampla**: tworzony przez `slugify` (lowercase + zamiana znaków nie-alfanumerycznych na `-`).
- **Pełny URL**: `folderUrl + "/" + filename` (bez podwójnych `/`).
- **Grupowanie nazw z cyfrą (tylko w obrębie jednego `folderUrl`):**
  - Jeśli nazwy różnią się **numerem na końcu** (`Assault Weapon1`, `Assault Weapon2`, `Rats 1`, `Rats 2`), tworzone jest **jedno** zgrupowanie.
  - Jeśli numer występuje **w środku** nazwy (`Blaster 1 Burst`, `Blaster 2 Burst`), numer jest usuwany z etykiety i powstaje przycisk `Blaster Burst (2)`.
  - Etykieta grupy zawiera liczebność w nawiasie (np. `Assault Weapon (4)`), a sama liczba jest renderowana na czerwono (`.group-count`).
  - Kliknięcie przycisku losuje dźwięk z listy `variants`.
  - Dla zgrupowanych pozycji przy nazwie pliku pojawia się sufiks `(+N)` informujący o liczbie wariantów.
- **Tagi folderów:** z `folderUrl` wyciągane są segmenty ścieżki, z których tworzone są tagi hierarchiczne. Segment `AudioRPG` jest pomijany jako folder bazowy. Z pozostałych segmentów usuwane są fragmenty: `SoundPad`, `SoundPad Patreon Version`, `_Siege_SoundPad`, `Patreon`. Segmenty są dekodowane z `%20` na spacje, a końcowe spacje usuwane. Drugi tag z hierarchii (`tag2`) jest wyświetlany w panelu admina i w widoku użytkownika pod nazwą sampla.

## 8. Logika JS (wszystkie funkcje)
### 8.1. Utility
- `slugify(value, index)` — tworzy stabilny identyfikator z nazwy.
- `normalizeUrl(folderUrl, filename)` — składa pełny URL do pliku audio.
- `escapeRegExp(value)` — ucieka znaki specjalne do użycia w RegExp.
- `cleanTagSegment(segment)` — dekoduje `%20` na spacje, usuwa fragmenty ignorowane (`SoundPad`, `SoundPad Patreon Version`, `_Siege_SoundPad`, `Patreon`) i normalizuje spacje.
- `extractTags(folderUrl)` — zwraca tablicę tagów na podstawie segmentów ścieżki `folderUrl`.
- `getGroupingBaseLabel(label)` — usuwa numery (na końcu lub jako osobny token w środku) w celu wyznaczenia bazowej etykiety grupowania.
- `formatSampleLabel(item)` — zwraca HTML etykiety z aliasem w nawiasie (jeśli ustawiony) oraz czerwonym licznikiem wariantów.
- `buildTagTree(items)` — buduje drzewo tagów (hierarchia) z listy sampli.
- `flattenTagTree(nodes, depth)` — spłaszcza drzewo tagów do listy z poziomem zagnieżdżenia.
- `ensureTagSelection(nodes)` — inicjalizuje mapę zaznaczeń tagów domyślnie na `true`.
- `setAllTagSelection(value)` — masowo zaznacza/odznacza wszystkie tagi.
- `updateStatus()` — aktualizuje paski statusów (manifest, firebase, liczba list).
- `updateTagPanelVisibility()` — przełącza ukrycie/odkrycie panelu checkboxów tagów bez zmiany ich zaznaczeń.
- `renderTagMenu()` — renderuje okienko filtra listowego tagów z wyszukiwarką i checkboxami.
- `positionTagMenu()` — pozycjonuje popup filtra listowego przy przycisku.
- `openTagMenu()` / `closeTagMenu()` — otwiera i zamyka popup filtra tagów.

### 8.2. Ustawienia (ulubione + główny widok + aliasy)
- `saveSettings()` — zapisuje `favorites`, `mainView` i `aliases` do Firestore lub `localStorage` (`audio.settings`).
- `defaultFavorites()` — tworzy domyślną listę „Ulubione”.
- `defaultMainView()` — zwraca pusty „Główny widok”.
- `defaultAliases()` — zwraca pustą mapę aliasów.
- `normalizeFavorites(raw)` — normalizuje strukturę list ulubionych.
- `normalizeMainView(raw)` — normalizuje listę `itemIds` głównego widoku.
- `normalizeAliases(raw)` — normalizuje mapę aliasów (usuwa puste wartości, trimuje tekst).
- `normalizeSettings(raw)` — akceptuje zarówno nowy format (`favorites`, `mainView`, `aliases`) jak i stary (`lists`).
- `loadSettingsLocal()` — wczytuje lokalny zapis (`audio.settings`) lub migruje z `audio.favorites`.
- `setItemAlias(itemId, alias)` — zapisuje/usuwa alias i odświeża wszystkie widoki.

### 8.3. Firebase
- `initFirebase()`:
  1. Sprawdza `window.firebaseConfig`.
  2. Inicjalizuje aplikację i Firestore.
  3. Ustawia referencję `doc(db, "audio", "favorites")`.
  4. Subskrybuje `onSnapshot`, aby synchronizować listy w czasie rzeczywistym.

### 8.4. Renderowanie
- `renderTagFilter()` — rysuje drzewko checkboxów tagów (tylko admin).
- `renderSamples()` — rysuje siatkę sampli (tylko admin) z selektorem listy (domyślnie „Widok Główny”), przyciskiem dodania oraz polem aliasu z przyciskiem „Wyczyść”; lista jest filtrowana przez wyszukiwarkę sampli **oraz** aktywne tagi.
- `renderFavorites()` — rysuje listy „Ulubione” w trybie admina wraz z kontrolkami (rename, remove, move).
- `renderMainViewAdmin()` — rysuje panel „Główny widok” w trybie admina (nazwa/tag klikalne + suwak głośności + reorder + remove).
- `renderUserMainView()` — rysuje „Widok główny” użytkownika (klikana nazwa + tag oraz suwak głośności) zarówno w trybie użytkownika, jak i w podglądzie admina.
- `renderUserFavorites()` — rysuje listę ulubionych użytkownika (klikana nazwa + tag + suwak głośności) dla aktualnie wybranej listy w obu trybach.
- `renderUserNavigation()` — rysuje panel boczny z przyciskiem „Widok główny” oraz listami ulubionych w obu trybach.
- `renderAllViews()` — odświeża statusy oraz wszystkie panele odpowiednie dla trybu, w tym widoczność panelu tagów.
- `syncUserViewButtons()` — przełącza widoczne panele i aktualizuje aktywny stan w nawigacji (działa także w podglądzie admina).

### 8.5. Akcje użytkownika
- `pickRandomVariant(item)` — losuje plik z `variants` dla zgrupowanych sampli.
- `getAudioContext()` — inicjalizuje `AudioContext` (jeśli dostępny), aby obsłużyć wzmocnienie głośności powyżej 100%.
- `volumeToGain(value)` — mapuje zakres `-100..100` na gain `0..2`.
- `startPlayback(item, playbackRoot)` — tworzy nowe `Audio()` i podpina `GainNode`, ustawia głośność wg suwaka, dodaje klasę `.is-playing`.
- `stopPlayback(playbackRoot)` — zatrzymuje aktywny dźwięk, usuwa klasę `.is-playing` i resetuje etykietę (jeśli to przycisk).
- `togglePlayback(itemId, playbackRoot)` — przełącza odtwarzanie/stop dla wskazanego elementu sterującego.
- `applyPlayerVolume(player, value)` — aktualizuje głośność aktywnie odtwarzanego sampla po zmianie suwaka.
- Zmiana checkboxa w `#tagFilter` aktualizuje mapę `tagSelection`, ukrywa/pokazuje podfoldery (`.tag-children.is-hidden`) i odświeża listę sampli.
- Pole `#tagSearchInput` otwiera popup filtra listowego, a wyszukiwanie odbywa się w okienku `#tagMenuSearchInput`.
- Kliknięcie `#toggleTagPanel` ukrywa lub odsłania cały panel checkboxów tagów bez resetowania stanu zaznaczeń.
- Popup filtra tagów zawiera checkboxy oraz przyciski **Zaznacz wszystko** / **Odznacz wszystko**; zmiany odświeżają drzewko i listę sampli.
- `addFavoriteList()` — tworzy nową listę.
- `addItemToFavorites(listId, itemId)` — dodaje sample do listy.
- `moveList(listId, direction)` — przesuwa listę w górę/dół.
- `renameList(listId)` — zmienia nazwę listy.
- `removeList(listId)` — usuwa listę (z potwierdzeniem).
- `moveItem(listId, itemId, direction)` — przesuwa element w obrębie listy.
- `removeItem(listId, itemId)` — usuwa element z listy.
- `addItemToMainView(itemId)` — dodaje sample do „Głównego widoku” (wybierane w selektorze jako „Widok Główny”).
- Kliknięcie **Dodaj do listy** sprawdza wartość selektora: jeśli to `main`, element trafia do „Głównego widoku”; w przeciwnym razie trafia do wskazanej listy ulubionych.
- `moveMainViewItem(itemId, direction)` — przesuwa element w głównym widoku.
- `removeMainViewItem(itemId)` — usuwa element z głównego widoku.
- `parseManifest()` — wczytuje i mapuje `AudioManifest.xlsx`.
- `setModeVisibility()` — ukrywa/pokazuje elementy `.admin-only` (w tym nagłówek admina) oraz ustawia opis nagłówka; widok użytkownika jest zawsze obecny, a w adminie działa jako podgląd.
- `setUserView(view)` — przełącza widok w user mode (główny vs ulubione).
- **Nawigacja usera**: kliknięcia w panelu `#userNav` przełączają `state.userView` oraz aktywną listę ulubionych.

## 9. Struktura danych Firestore (`audio/favorites`)
```json
{
  "favorites": {
    "lists": [
      {
        "id": "uuid",
        "name": "Ulubione",
        "itemIds": ["sample-1", "sample-2"]
      }
    ]
  },
  "mainView": {
    "itemIds": ["sample-1", "sample-3"]
  },
  "updatedAt": "serverTimestamp"
}
```

## 10. Checklist odtworzenia 1:1
1. Skopiuj strukturę plików z katalogu `Audio/`.
2. Dodaj `config/firebase-config.js` z własnymi danymi.
3. Wgraj `AudioManifest.xlsx` z kolumnami `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`.
4. Załaduj stronę `Audio/index.html` na serwerze statycznym.
5. Wejdź na `Audio/index.html?admin=1` i potwierdź, że manifest ładuje się poprawnie (status „Manifest: X pozycji”).
6. Dodaj kilka sampli do „Głównego widoku” i do list ulubionych — sprawdź zapis w Firestore.
7. Wejdź na `Audio/index.html` (bez parametru) i zweryfikuj, że użytkownik widzi panel odtwarzania z boczną nawigacją „Widok główny” + listy „Ulubione”.

## 11. Troubleshooting
- **Manifest nie wczytuje się:** sprawdź nazwę pliku (`AudioManifest.xlsx`) i dostępność z serwera statycznego.
- **Brak połączenia z Firebase:** sprawdź `config/firebase-config.js` i reguły Firestore.
- **Brak dźwięku:** zweryfikuj poprawność `LinkDoFolderu` i `NazwaPliku` w manifestie.

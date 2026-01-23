# Dokumentacja techniczna modułu Audio (opis 1:1)

> Ten dokument opisuje **dokładny** wygląd i logikę modułu Audio: strukturę HTML, style CSS, zasady działania, mapowanie danych z `AudioManifest.xlsx`, integrację Firebase oraz wszystkie kluczowe funkcje. Celem jest umożliwienie wiernego odtworzenia aplikacji 1:1.

## 1. Architektura i przepływ danych
- **Model aplikacji:** pojedyncza strona `Audio/index.html` z dwoma trybami:
  - **Widok użytkownika** (domyślny) — pokazuje panel odtwarzania oraz boczną nawigację między „Widokiem głównym” i listami „Ulubione”.
  - **Widok admina** — aktywowany przez `?admin=1`, umożliwia konfigurację manifestu, list ulubionych oraz kolejności „Głównego widoku”.
- **Źródło danych audio:** plik `AudioManifest.xlsx` wczytywany bezpośrednio w przeglądarce przez bibliotekę XLSX (SheetJS).
- **Ustawienia:** ulubione i „Główny widok” są przechowywane w Firestore w dokumencie `audio/favorites`. W przypadku braku konfiguracji Firebase używany jest `localStorage` (`audio.settings`).
- **Odtwarzanie:** pojedynczy obiekt `Audio()` używany wielokrotnie do odtwarzania sampli.

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
- Dokument tworzony automatycznie, jeśli nie istnieje. Zawiera `favorites` i `mainView`.

## 5. `index.html` — layout i HTML
- Główny kontener `.page` zawiera:
  1. **Nagłówek** `header` z tytułem, opisem i paskiem statusów (statusy są tylko w trybie admina).
  2. **Toolbar** `.toolbar` (tylko admin): wyszukiwarka, przycisk wczytywania manifestu, przyciski zarządzania listami.
  3. **Layout admina** `.layout` (tylko admin) w dwóch kolumnach:
     - Lewy panel: lista sampli (`.samples-grid`) z akcjami dodania do „Ulubionych” i do „Głównego widoku”.
     - Prawa kolumna `.side-stack`: 
       - panel „Ulubione” (`#favoritesPanel`) z pełnymi kontrolkami (rename, move, remove),
       - panel „Główny widok” (`#mainViewPanel`) do ustawiania kolejności nadrzędnej listy.
  4. **Widok użytkownika** `.user-view` (tylko user):
     - układ `.user-layout` w dwóch kolumnach,
     - lewy panel z kontenerami `#userMainView` i `#userFavoritesView`,
     - prawy panel z nawigacją `#userNav` (przycisk „Widok główny” + lista ulubionych).

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
- `.side-stack`: prawa kolumna w adminie, `display: flex`, `flex-direction: column`, `gap: 22px`.
- `.samples-grid`: `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))`.
- `.sample-card`: tło `--panel-alt`, `border: 1px solid rgba(22, 198, 12, 0.4)`, `border-radius: 10px`.
- `.fav-list`: `border: 1px solid rgba(22, 198, 12, 0.5)`, tło `#031206`.
- Przyciski `.btn`: `border: 1px solid --border`, tło `#031806`, uppercase, `letter-spacing: 0.06em`.
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
- **ID sampla**: tworzony przez `slugify` (lowercase + zamiana znaków nie-alfanumerycznych na `-`).
- **Pełny URL**: `folderUrl + "/" + filename` (bez podwójnych `/`).

## 8. Logika JS (wszystkie funkcje)
### 8.1. Utility
- `slugify(value, index)` — tworzy stabilny identyfikator z nazwy.
- `normalizeUrl(folderUrl, filename)` — składa pełny URL do pliku audio.
- `updateStatus()` — aktualizuje paski statusów (manifest, firebase, liczba list).

### 8.2. Ustawienia (ulubione + główny widok)
- `saveSettings()` — zapisuje `favorites` i `mainView` do Firestore lub `localStorage` (`audio.settings`).
- `defaultFavorites()` — tworzy domyślną listę „Ulubione”.
- `defaultMainView()` — zwraca pusty „Główny widok”.
- `normalizeFavorites(raw)` — normalizuje strukturę list ulubionych.
- `normalizeMainView(raw)` — normalizuje listę `itemIds` głównego widoku.
- `normalizeSettings(raw)` — akceptuje zarówno nowy format (`favorites`, `mainView`) jak i stary (`lists`).
- `loadSettingsLocal()` — wczytuje lokalny zapis (`audio.settings`) lub migruje z `audio.favorites`.

### 8.3. Firebase
- `initFirebase()`:
  1. Sprawdza `window.firebaseConfig`.
  2. Inicjalizuje aplikację i Firestore.
  3. Ustawia referencję `doc(db, "audio", "favorites")`.
  4. Subskrybuje `onSnapshot`, aby synchronizować listy w czasie rzeczywistym.

### 8.4. Renderowanie
- `renderSamples()` — rysuje siatkę sampli (tylko admin) z przyciskami dodawania do ulubionych i głównego widoku.
- `renderFavorites()` — rysuje listy „Ulubione” w trybie admina wraz z kontrolkami (rename, remove, move).
- `renderMainViewAdmin()` — rysuje panel „Główny widok” w trybie admina (play + reorder + remove).
- `renderUserMainView()` — rysuje „Widok główny” użytkownika (same przyciski odtwarzania).
- `renderUserFavorites()` — rysuje listę ulubionych użytkownika dla aktualnie wybranej listy.
- `renderUserNavigation()` — rysuje panel boczny z przyciskiem „Widok główny” oraz listami ulubionych.
- `renderAllViews()` — odświeża statusy oraz wszystkie panele odpowiednie dla trybu.
- `syncUserViewButtons()` — przełącza widoczne panele i aktualizuje aktywny stan w nawigacji.

### 8.5. Akcje użytkownika
- `playSample(itemId)` — odtwarza dźwięk z `fullUrl`.
- `addFavoriteList()` — tworzy nową listę.
- `addItemToFavorites(listId, itemId)` — dodaje sample do listy.
- `moveList(listId, direction)` — przesuwa listę w górę/dół.
- `renameList(listId)` — zmienia nazwę listy.
- `removeList(listId)` — usuwa listę (z potwierdzeniem).
- `moveItem(listId, itemId, direction)` — przesuwa element w obrębie listy.
- `removeItem(listId, itemId)` — usuwa element z listy.
- `addItemToMainView(itemId)` — dodaje sample do „Głównego widoku”.
- `moveMainViewItem(itemId, direction)` — przesuwa element w głównym widoku.
- `removeMainViewItem(itemId)` — usuwa element z głównego widoku.
- `parseManifest()` — wczytuje i mapuje `AudioManifest.xlsx`.
- `setModeVisibility()` — ukrywa/pokazuje elementy `.admin-only` i `.user-only` oraz ustawia opis nagłówka.
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

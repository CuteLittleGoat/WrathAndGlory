# Dokumentacja techniczna modułu Audio (opis 1:1)

> Ten dokument opisuje **dokładny** wygląd i logikę modułu Audio: strukturę HTML, style CSS, zasady działania, mapowanie danych z `AudioManifest.xlsx`, integrację Firebase oraz wszystkie kluczowe funkcje. Celem jest umożliwienie wiernego odtworzenia aplikacji 1:1.

## 1. Architektura i przepływ danych
- **Model aplikacji:** pojedyncza strona `Audio/index.html` działająca jako panel dźwięków.
- **Źródło danych audio:** plik `AudioManifest.xlsx` wczytywany bezpośrednio w przeglądarce przez bibliotekę XLSX (SheetJS).
- **Ulubione:** przechowywane w Firestore (Firebase) w dokumencie `audio/favorites`. W przypadku braku konfiguracji Firebase używany jest `localStorage`.
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
- Dokument tworzony automatycznie, jeśli nie istnieje.

## 5. `index.html` — layout i HTML
- Główny kontener `.page` zawiera:
  1. **Nagłówek** `header` z tytułem, opisem i paskiem statusów.
  2. **Toolbar** `.toolbar` z wyszukiwarką, przyciskami wczytywania manifestu oraz zarządzania listami.
  3. **Layout** `.layout` w dwóch kolumnach:
     - Lewy panel: lista sampli (`.samples-grid`).
     - Prawy panel: listy „Ulubione” (`#favoritesPanel`).

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
- `.samples-grid`: `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))`.
- `.sample-card`: tło `--panel-alt`, `border: 1px solid rgba(22, 198, 12, 0.4)`, `border-radius: 10px`.
- `.fav-list`: `border: 1px solid rgba(22, 198, 12, 0.5)`, tło `#031206`.
- Przyciski `.btn`: `border: 1px solid --border`, tło `#031806`, uppercase, `letter-spacing: 0.06em`.
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

### 8.2. Ulubione (zapisy i normalizacja)
- `saveFavorites()` — zapisuje stan do Firestore lub `localStorage` (`audio.favorites`).
- `defaultFavorites()` — tworzy domyślną listę „Ulubione”.
- `normalizeFavorites(raw)` — normalizuje strukturę list z Firestore.
- `loadFavoritesLocal()` — wczytuje lokalny zapis (fallback).

### 8.3. Firebase
- `initFirebase()`:
  1. Sprawdza `window.firebaseConfig`.
  2. Inicjalizuje aplikację i Firestore.
  3. Ustawia referencję `doc(db, "audio", "favorites")`.
  4. Subskrybuje `onSnapshot`, aby synchronizować listy w czasie rzeczywistym.

### 8.4. Renderowanie
- `renderSamples()` — rysuje siatkę sampli i selektor list ulubionych.
- `renderFavorites()` — rysuje listy „Ulubione” wraz z kontrolkami (rename, remove, move).

### 8.5. Akcje użytkownika
- `playSample(itemId)` — odtwarza dźwięk z `fullUrl`.
- `addFavoriteList()` — tworzy nową listę.
- `addItemToFavorites(listId, itemId)` — dodaje sample do listy.
- `moveList(listId, direction)` — przesuwa listę w górę/dół.
- `renameList(listId)` — zmienia nazwę listy.
- `removeList(listId)` — usuwa listę (z potwierdzeniem).
- `moveItem(listId, itemId, direction)` — przesuwa element w obrębie listy.
- `removeItem(listId, itemId)` — usuwa element z listy.
- `parseManifest()` — wczytuje i mapuje `AudioManifest.xlsx`.

## 9. Struktura danych Firestore (`audio/favorites`)
```json
{
  "lists": [
    {
      "id": "uuid",
      "name": "Ulubione",
      "itemIds": ["sample-1", "sample-2"]
    }
  ],
  "updatedAt": "serverTimestamp"
}
```

## 10. Checklist odtworzenia 1:1
1. Skopiuj strukturę plików z katalogu `Audio/`.
2. Dodaj `config/firebase-config.js` z własnymi danymi.
3. Wgraj `AudioManifest.xlsx` z kolumnami `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`.
4. Załaduj stronę `Audio/index.html` na serwerze statycznym.
5. Potwierdź, że manifest ładuje się poprawnie (status „Manifest: X pozycji”).
6. Sprawdź działanie odtwarzania i zapis ulubionych w Firestore.

## 11. Troubleshooting
- **Manifest nie wczytuje się:** sprawdź nazwę pliku (`AudioManifest.xlsx`) i dostępność z serwera statycznego.
- **Brak połączenia z Firebase:** sprawdź `config/firebase-config.js` i reguły Firestore.
- **Brak dźwięku:** zweryfikuj poprawność `LinkDoFolderu` i `NazwaPliku` w manifestie.

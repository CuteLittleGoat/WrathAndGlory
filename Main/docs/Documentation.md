# Main — dokumentacja techniczna (odtworzenie 1:1)

## 🇵🇱 Dokumentacja techniczna (PL)

### 1. Cel modułu
`Main/index.html` jest stroną startową i launcherem pozostałych modułów.

### 2. Struktura plików
- `Main/index.html` — UI + style + logika launcher.
- `Main/ZmienneHiperlacza.md` — źródło dynamicznych linków dla przycisków **Mapa** i **Obrazki**.
- `Main/wrath-glory-logo-warhammer.png` — logo.
- `manifest.webmanifest` (root) — manifest instalacyjny PWA.

### 3. Tryby pracy i parametr `admin=1`
- Bez parametru: widok standardowy użytkownika.
- Z `?admin=1`: widok administracyjny z dodatkowymi przyciskami i wariantem linku do DataVault z parametrem admin.

### 4. Dynamiczne linki z `ZmienneHiperlacza.md`
`Main/index.html` pobiera `Main/ZmienneHiperlacza.md` i oczekuje wpisów:
- `Mapa: <URL>`
- `Obrazki: <URL>`

Brak pliku, brak wpisu albo błędny format powoduje, że dynamiczne podstawienie linków nie następuje poprawnie.

### 5. PWA i online-only
- Manifest (`manifest.webmanifest`) obsługuje instalację i uruchamianie w trybie standalone.
- Moduł nie zapewnia trybu offline.
- Kod strony usuwa/wyrejestrowuje stare Service Workery, dlatego należy traktować Main jako **online-only**.

### 6. Integracje
- Brak bezpośredniej integracji Firebase w module Main.

### 7. Kroki odtworzenia
1. Odtwórz `Main/index.html` z sekcją przycisków launcher.
2. Dodaj obsługę parametru `admin=1`.
3. Dodaj parser wpisów `Mapa:` / `Obrazki:` z `Main/ZmienneHiperlacza.md`.
4. Podłącz `manifest.webmanifest` jako metadane instalacyjne.
5. Zachowaj zachowanie online-only (bez cache offline przez Service Worker).

---

## 🇬🇧 Technical documentation (EN)

### 1. Module purpose
`Main/index.html` is the entry launcher for all modules.

### 2. File structure
- `Main/index.html` — launcher UI, styles, and logic.
- `Main/ZmienneHiperlacza.md` — dynamic source for **Map** and **Images** button URLs.
- `Main/wrath-glory-logo-warhammer.png` — logo asset.
- `manifest.webmanifest` (repo root) — install metadata.

### 3. Modes and `admin=1`
- No query param: standard user mode.
- `?admin=1`: admin mode with extra buttons and admin DataVault link variant.

### 4. Dynamic links from `ZmienneHiperlacza.md`
`Main/index.html` reads:
- `Mapa: <URL>`
- `Obrazki: <URL>`

If file/entries/format are missing, dynamic URL injection does not complete correctly.

### 5. PWA and online-only behavior
- `manifest.webmanifest` is used for install/standalone behavior.
- The module should be documented as **online-only**.
- Existing service workers are cleaned up/unregistered by page logic, so offline cache behavior is not part of current runtime.

### 6. Integrations
- No direct Firebase integration in Main.

### 7. Rebuild checklist
1. Recreate `Main/index.html` launcher grid.
2. Keep `admin=1` mode switching logic.
3. Keep dynamic parser for `Mapa:` / `Obrazki:` lines.
4. Link manifest metadata.
5. Preserve online-only behavior.

# Main — dokumentacja techniczna (odtworzenie 1:1)

## 1. Zakres modułu
`Main` to statyczny launcher modułów Wrath & Glory. Odpowiada za:
- prezentację przycisków modułów,
- przełączanie widoku użytkownik/admin,
- dynamiczne wczytanie linków Mapa/Obrazki,
- inicjację PWA i Web Push.

## 2. Struktura plików
- `Main/index.html` — HTML + CSS + JS modułu.
- `Main/ZmienneHiperlacza.md` — konfiguracja linków Mapa/Obrazki (`Nazwa: URL`).
- `Main/wrath-glory-logo-warhammer.png` — logo strony.
- `manifest.webmanifest` (repo root) — manifest PWA wspólny.
- `service-worker.js` (repo root) — globalny Service Worker.

## 3. Widoki i routing
### 3.1. Tryb użytkownika
Domyślny widok (bez parametru `admin`) pokazuje podstawowe moduły.

### 3.2. Tryb administratora
Aktywowany parametrem URL: `?admin=1`.
- Odsłania przyciski adminowe (Generator Nazw, Generator NPC, Audio).
- Pokazuje notatki dotyczące wejścia do paneli admina DataVault i Audio.
- Link DataVault jest przełączany na wariant z parametrem `?admin=1`.

## 4. Struktura HTML (`Main/index.html`)
- `main` — kontener główny.
- `img.logo` — logo (z jawnie ustawionymi `width`/`height` dla stabilnego layoutu).
- `.actions` — siatka przycisków modułów.
- Przyciski adminowe oznaczone `data-admin-only="true"`.
- Linki dynamiczne:
  - `data-map-link` — URL mapy,
  - `data-images-link` — URL obrazków,
  - `data-datavault-link` — URL DataVault zależny od trybu.
- CTA `Włącz powiadomienia` umieszczone pod siatką modułów.

## 5. Stylizacja (CSS)
Motyw „zielonego terminala” oparty o zmienne CSS:
- `--bg`, `--panel`, `--border`, `--text`, `--accent`, `--accent-dark`, `--glow`, `--radius`.

Kluczowe cechy:
- centralny panel z zieloną ramką i glow,
- przyciski z animacją hover/active,
- responsywna siatka `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`,
- notki pomocnicze (`.note`) widoczne kontekstowo tylko dla admina.

## 6. Logika JavaScript
### 6.1. Detekcja roli
```js
const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
```
Na tej podstawie JS:
- pokazuje/ukrywa elementy `data-admin-only`,
- przełącza target linku Infoczytnika,
- przełącza URL DataVault.

### 6.2. Wczytywanie konfiguracji linków
- Parser czyta `Main/ZmienneHiperlacza.md`.
- Wyszukuje wpisy `Mapa:` i `Obrazki:`.
- Podmienia `href` odpowiednich przycisków.

### 6.3. Web Push CTA
Przycisk `Włącz powiadomienia`:
1. prosi o zgodę przeglądarki,
2. tworzy/odczytuje subskrypcję push,
3. przekazuje subskrypcję do backendu Infoczytnika,
4. raportuje błędy użytkownikowi (m.in. odmowa zgody, brak SW, brak wsparcia push).

## 7. PWA
### 7.1. Manifest
- Aplikacja używa wspólnego `manifest.webmanifest`.
- `start_url` ustawiony na `Main/index.html` (start w widoku user).

### 7.2. Service Worker
- Rejestrowany globalnie.
- Strategia online-first.
- Przy braku sieci zwraca komunikat o konieczności internetu.

## 8. Integracje
- Moduł nie używa bezpośrednio Firebase.
- Integruje się pośrednio z backendem push Infoczytnika (ten sam origin).

## 9. Odtworzenie modułu 1:1
1. Utwórz `Main/index.html` z osadzonym CSS/JS.
2. Dodaj logo `wrath-glory-logo-warhammer.png`.
3. Dodaj `ZmienneHiperlacza.md` i parser wpisów `Mapa`/`Obrazki`.
4. Dodaj obsługę `?admin=1` + warunkowe sekcje admin.
5. Dodaj przycisk Web Push i rejestrację SW.
6. Podłącz `manifest.webmanifest` i `service-worker.js`.

## 10. Testy regresyjne
1. Wejście bez `?admin=1` pokazuje tylko widok user.
2. Wejście z `?admin=1` pokazuje komplet przycisków admin.
3. Mapa/Obrazki otwierają właściwe URL z `ZmienneHiperlacza.md`.
4. DataVault w adminie używa `?admin=1`.
5. Przycisk powiadomień poprawnie przechodzi flow zgody i subskrypcji.

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

## 11. Specyfikacja UI 1:1 (wartości bezpośrednio z kodu)
### 11.1. Zmienne CSS i kolorystyka
Deklaracje z `:root`:
- `--bg`: kompozycja 2 gradientów radialnych + kolor bazowy `#031605`.
- `--panel: #000`
- `--border: #16c60c`
- `--text: #9cf09c`
- `--accent: #16c60c`
- `--accent-dark: #0d7a07`
- `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
- `--radius: 10px`

Wyróżnienie przycisku push:
- ramka: `#ff3b30`,
- tło: `rgba(255, 59, 48, 0.2)`,
- tekst: `#ffe5e3`,
- glow: `0 0 14px rgba(255, 59, 48, 0.35)`.

### 11.2. Layout i responsywność
- `main`: `width: min(860px, 100%)`, `padding: 32px 32px 28px`, `gap: 22px`, układ kolumnowy.
- `.actions`: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`, `gap: 18px 20px`.
- `body`: centrowanie pion/poziom + `padding-bottom` z `env(safe-area-inset-bottom)`.
- `.logo`: `max-width: clamp(220px, 40vw, 320px)`.

### 11.3. Typografia i interakcje
- Globalny font-stack: `"Consolas", "Fira Code", "Source Code Pro", monospace`.
- `.btn`: `font-size: 15px`, `font-weight: 600`, `border: 2px solid`.
- Hover `.btn`: przesunięcie `translateY(-1px)` + glow.
- Active `.btn`: cofnięcie przesunięcia i mocniejsze tło.

## 12. Mapa funkcji JavaScript (pełna lista odpowiedzialności)
- `applyDynamicLinks(links)` — podmienia `href` dla przycisków Mapa/Obrazki po sparsowaniu `ZmienneHiperlacza.md`.
- `urlBase64ToUint8Array(base64String)` — konwersja klucza VAPID do formatu wymaganego przez `PushManager.subscribe`.
- `getPushConfig()` — waliduje obecność `vapidPublicKey` i `subscribeEndpoint` w `window.infWebPushConfig`.
- `setPushButtonMessage(message, isError)` — aktualizuje etykietę przycisku push oraz stan błędu (`data-state="error"`).
- `refreshPushButtonState()` — blokuje CTA push przy brakującej konfiguracji (`Powiadomienia: brak konfiguracji`).
- `ensureServiceWorkerRegistration()` — rejestruje wspólny `../service-worker.js`.
- `enablePushNotifications()` — pełny flow: permission → SW ready → subscription → POST do backendu.

Inicjalizacja skryptu:
1. Wylicza `isAdmin` z query string (`admin=1`).
2. Usuwa elementy `data-admin-only="true"` dla użytkownika końcowego.
3. Przełącza link Infoczytnika (`Infoczytnik.html` vs panel modułu).
4. Przełącza link DataVault (`?admin=1` tylko dla admina).
5. Ładuje dynamiczne linki Mapa/Obrazki z pliku markdown.
6. Podłącza obsługę przycisku push.
7. Rejestruje Service Worker po `window.load`.

## 13. Kontrakt backendu push (wymagania interoperacyjne)
Żądanie `POST` do endpointu subskrypcji wysyłane przez moduł Main ma payload:
```json
{
  "source": "main-launcher",
  "createdAt": 1714212000000,
  "subscription": { "...": "obiekt PushSubscription" }
}
```

Wymagania odpowiedzi backendu:
- status `2xx` => UI przechodzi do stanu `Powiadomienia aktywne` i blokuje przycisk,
- status `!2xx` => wyjątek z treścią odpowiedzi serwera i komunikatem `Błąd Web Push: ...`.

## 14. Macierz kompletności technicznej (dla odtworzenia modułu)
- **Style i kolory:** zawarte w sekcjach 5 i 11.
- **Funkcje i logika:** sekcje 6 i 12.
- **Mechaniki przełączania ról i linków:** sekcje 3, 6.1, 12.
- **PWA (manifest + SW):** sekcja 7.
- **Firebase:** brak bezpośredniej integracji w tym module (pośrednio: push endpoint Infoczytnika).
- **Node.js bootstrap:** nie dotyczy modułu Main (backend znajduje się w module Infoczytnik).

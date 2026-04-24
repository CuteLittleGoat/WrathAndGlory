# Dokumentacja

## Przegląd projektu
Projekt to pojedyncza strona HTML działająca jako statyczny „hub” z odnośnikami do zewnętrznych narzędzi Wrath & Glory. Strona zawiera osadzone CSS oraz krótki skrypt JavaScript przełączający widok użytkownika/admina — bez backendu i bez zewnętrznych zależności.

## Struktura plików
- `Main/index.html` – jedyny plik aplikacji zawierający strukturę strony, stylizację w `<style>` oraz skrypt przełączający widok admina.
- `Main/ZmienneHiperlacza.md` – plik z dynamicznymi adresami dla przycisków Mapa i Obrazki w formacie `Nazwa: URL`.
- `Main/wrath-glory-logo-warhammer.png` – logo wyświetlane w nagłówku strony.
- `Main/docs/README.md` – instrukcja użytkownika i informacje o aktualizacji aplikacji (PL/EN).
- `Main/docs/Documentation.md` – niniejszy dokument z opisem kodu.

## Szczegółowy opis `Main/index.html`

### 1. Deklaracje dokumentu i nagłówek
- `<!DOCTYPE html>` – deklaruje HTML5.
- `<html lang="pl">` – język dokumentu ustawiony na polski.
- `<meta charset="UTF-8">` – kodowanie znaków UTF‑8.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` – poprawne skalowanie na urządzeniach mobilnych.
- `<title>Kozi Przybornik</title>` – tytuł karty przeglądarki.

### 2. Stylizacja (sekcja `<style>`)
Cała stylizacja jest osadzona w `Main/index.html` i nie korzysta z zewnętrznych plików CSS.

#### 2.1 Zmienne CSS (`:root`)
Zmienne definiują motyw „zielonego terminala”. Poniżej pełna lista wraz z dokładnymi wartościami:
- `--bg` – tło o trzech warstwach, zdefiniowane jako:
  1. `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  2. `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  3. kolor bazowy `#031605`
- `--panel` – kolor tła panelu głównego: `#000`.
- `--border` – kolor ramki panelu i przycisków: `#16c60c`.
- `--text` – kolor tekstu: `#9cf09c`.
- `--accent` – akcent zielony: `#16c60c`.
- `--accent-dark` – ciemny akcent: `#0d7a07`.
- `--glow` – cień panelu: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius` – zaokrąglenie rogów panelu: `10px`.

#### 2.2 Styl ogólny (`*`)
- `box-sizing: border-box` gwarantuje, że padding i border są wliczane w szerokość.
- Fonty są wymuszone w kolejności fallback: `"Consolas"`, `"Fira Code"`, `"Source Code Pro"`, `monospace`. Dzięki temu cały interfejs ma jednolity krój monospace.

#### 2.3 Układ strony (`body`, `main`)
- `body`
  - `margin: 0` i `min-height: 100vh` wypełniają ekran.
  - `display: flex`, `align-items: center`, `justify-content: center` centralizują panel.
  - `padding: 24px` zapewnia margines od krawędzi okna.
  - `background: var(--bg)` ustawia wielowarstwowy gradient.
  - `color: var(--text)` ustawia kolor tekstu domyślnie.
- `main` (panel)
  - szerokość: `width: min(860px, 100%)`.
  - tło: `background: var(--panel)` (czarne).
  - obramowanie: `border: 2px solid var(--border)`.
  - zaokrąglenie: `border-radius: var(--radius)` (10px).
  - poświata: `box-shadow: var(--glow)` (0 0 25px z alfą 0.45).
  - padding: `32px 32px 28px` (góra, prawa/lewa, dół).
  - układ: `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 22px`.

#### 2.4 Logo (`.logo`)
- `max-width: clamp(220px, 40vw, 320px)` ustawia zakres wielkości 220–320px, zależnie od szerokości viewportu.
- `width: 100%` pozwala logo wypełnić dostępną szerokość w limicie clamp.
- `height: auto` jawnie utrzymuje proporcje grafiki podczas skalowania responsywnego.
- `display: block` usuwa domyślne odstępy inline.
- Element `<img class="logo">` ma ustawione natywne atrybuty `width="1366"` i `height="768"` (proporcja 16:9), co rezerwuje poprawną wysokość już podczas pierwszego przebiegu layoutu i ogranicza CLS (layout shift) przy starcie strony.

#### 2.5 Sekcja akcji (`.actions`, `.stack`, `.stack.right`)
- `.actions`
  - `width: 100%` rozciąga siatkę na szerokość panelu.
  - `display: grid` z `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` tworzy elastyczne kolumny o minimalnej szerokości 220px.
  - `gap: 18px 20px` oznacza 18px w pionie i 20px w poziomie.
  - `align-items: start` zapewnia wyrównanie do góry w każdej kolumnie.
- `.stack`
  - `display: flex`, `flex-direction: column` układa przycisk i notatkę pionowo.
  - `gap: 8px` zachowuje dystans między przyciskiem a notatką.
- `.stack.right`
  - `align-items: stretch` rozciąga elementy w osi poprzecznej (użyte tylko dla przycisku Infoczytnik).

#### 2.6 Przyciski (`.btn`)
- Elementy `<a>` stylizowane jako przyciski:
  - `appearance: none`.
  - `border: 2px solid var(--border)` = 2px zielonej ramki (#16c60c).
  - `background: rgba(22, 198, 12, 0.08)` – półprzezroczyste tło.
  - `color: var(--text)` – tekst w odcieniu #9cf09c.
  - `padding: 10px 14px` (góra/dół 10px, lewo/prawo 14px).
  - `border-radius: 6px`.
  - `font-size: 15px`.
  - `font-weight: 600`.
  - `text-decoration: none`.
  - `text-align: center`.
  - `display: block` i `width: 100%` zapewniają pełną szerokość w kolumnie.
  - `transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease`.
- Stan `:hover`
  - `transform: translateY(-1px)` – delikatne uniesienie.
  - `box-shadow: 0 0 18px rgba(22, 198, 12, 0.3)` – poświata.
  - `background: rgba(22, 198, 12, 0.14)` – jaśniejsze tło.
- Stan `:active`
  - `transform: translateY(0)`.
  - `background: rgba(22, 198, 12, 0.22)` – najjaśniejsza wersja tła.

#### 2.7 Notatki pomocnicze (`.note`)
- Teksty pomocnicze umieszczane pod wybranymi przyciskami.
- Pod **Skarbcem Danych** znajduje się instrukcja dodania parametru `index.html?admin=1`, ale jest widoczna tylko w trybie admina (element ma `data-admin-only="true"`).
  - Dokładna treść: `aby wejść do panelu admina dopisz do adresu index.html?admin=1` (parametr jest w `<strong>`).
- Pod **Audio** znajduje się analogiczna notatka, również widoczna tylko w trybie admina.
- `margin: 0` usuwa domyślny margines akapitu.
- `color: var(--text)` utrzymuje spójny kolor.
- `font-size: 13px`.
- `line-height: 1.35`.
- `word-break: break-word` pozwala łamać dłuższe ciągi (np. URL).

### 3. Zawartość (`<body>`)
Struktura dokumentu składa się z:
- `<main>` – główny panel.
- `<img class="logo">` – logo z atrybutami:
  - `src="wrath-glory-logo-warhammer.png"`
  - `alt="Logo Wrath & Glory"`
  - `width="1366"`
  - `height="768"`
  (plik znajduje się w `Main/` obok `index.html`).
- `<div class="actions">` – siatka przycisków. Kolejność elementów w DOM została ustawiona tak, aby po ukryciu bloków admina widok użytkownika pozostawał bez luk:
  1. **Infoczytnik** – link dynamiczny: w trybie użytkownika kieruje do `../Infoczytnik/Infoczytnik.html`, a w trybie admina do `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html`.
  2. **Skarbiec Danych** – link oznaczony atrybutem `data-datavault-link`. W kodzie źródłowym domyślnie wskazuje `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html`, a w trybie admina skrypt zamienia go na `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1`. Pod przyciskiem znajduje się notka o parametrze admina, widoczna wyłącznie w trybie admina.
  3. **Generator nazw** – link do `../GeneratorNazw/index.html` (widoczny tylko w trybie admina; element ma `data-admin-only="true"`).
  4. **Generator NPC** – link do `https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/` (widoczny tylko w trybie admina; element ma `data-admin-only="true"`).
  5. **Audio** – link do `../Audio/index.html` (widoczny tylko w trybie admina).
  6. **Obrazki** – przycisk posiada atrybut `data-images-link`, a docelowy adres jest ustawiany przez skrypt na podstawie pliku `Main/ZmienneHiperlacza.md`. W HTML domyślnie ma `href="#"` i jest zastępowany po wczytaniu konfiguracji.
  7. **Mapa** – przycisk posiada atrybut `data-map-link`, a docelowy adres jest ustawiany przez skrypt na podstawie pliku `Main/ZmienneHiperlacza.md`. W HTML domyślnie ma `href="#"` i jest zastępowany po wczytaniu konfiguracji.
  8. **Kalkulator** – link do `https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/`.
  9. **Rzut kośćmi** – link do `../DiceRoller/index.html` (ścieżka lokalna w repozytorium).

Przyciski do modułów aplikacji (Generator NPC, Skarbiec Danych, Kalkulator) używają `target="_self"`, aby zachować spójny kontekst PWA/standalone. Tylko linki celowo zewnętrzne (**Mapa**, **Obrazki**) otwierają się w nowej karcie (`target="_blank"`) z zabezpieczeniem `rel="noopener noreferrer"`.

### 4. Logika widoków (skrypt JavaScript)
Skrypt na końcu `<body>` przełącza widok użytkownika i admina na podstawie parametru URL:
- `isAdmin` to wynik `new URLSearchParams(window.location.search).get("admin") === "1"`.
- Jeśli `isAdmin` jest fałszem, wszystkie elementy z `data-admin-only="true"` są usuwane z DOM (np. Generator NPC, Audio, notatki admina).
- Link **Infoczytnik** (`[data-infoczytnik-link]`) jest ustawiany dynamicznie:
  - tryb użytkownika → `../Infoczytnik/Infoczytnik.html`,
  - tryb admina → `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html`.
- Link **Skarbiec Danych** (`[data-datavault-link]`) jest ustawiany dynamicznie:
  - tryb użytkownika → `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html`,
  - tryb admina → `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1`.
- Linki **Mapa** i **Obrazki** są ustawiane po wczytaniu pliku `Main/ZmienneHiperlacza.md`:
  - format pliku: każda linia w postaci `Mapa: URL` lub `Obrazki: URL`.
  - skrypt pobiera plik `ZmienneHiperlacza.md`, parsuje linie przez wyrażenie regularne `^(Mapa|Obrazki)\s*:\s*(\S+)` i ustawia `href` w elementach z `data-map-link` i `data-images-link`.
  - jeśli plik nie jest dostępny, skrypt loguje ostrzeżenie w konsoli i pozostawia domyślne `href="#"`.

## Treść i nawigacja
- **Zmiana adresów URL innych przycisków**: edytuj atrybuty `href` w przyciskach `<a class="btn">` w `Main/index.html` (np. Generator NPC, Skarbiec Danych, Kalkulator).
- **Zmiana linku mapy**: zaktualizuj wpis `Mapa: ...` w pliku `Main/ZmienneHiperlacza.md`.
- **Zmiana linku obrazków**: zaktualizuj wpis `Obrazki: ...` w pliku `Main/ZmienneHiperlacza.md`.
- **Zmiana instrukcji admina**: zaktualizuj treść akapitu `.note` pod przyciskiem Skarbiec Danych lub Audio (elementy z `data-admin-only="true"`).
- **Zmiana stylu**: edytuj sekcję `<style>` w `Main/index.html` i stosuj dokładnie podane wartości (kolory, odstępy, rozmiary, cienie) aby zachować identyczny wygląd.
- **Zmiana logo**: podmień plik `Main/wrath-glory-logo-warhammer.png` i pozostaw tę samą nazwę, jeśli nie chcesz edytować HTML.

## Uruchamianie lokalne
Strona jest statyczna i działa bez serwera, ale dla testów można uruchomić lokalny serwer:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000/Main/index.html`.

## 8. PWA / Service Worker (wdrożenie)
- `Main/index.html` dodaje:
  - `<link rel="manifest" href="../manifest.webmanifest">`
  - `<meta name="theme-color" content="#031605">`
  - rejestrację SW po `window.load`:
    - `navigator.serviceWorker.register("../service-worker.js")`.
- Globalny `service-worker.js` (w katalogu repo):
  - obsługuje `install`, `activate`, `fetch`, `push`, `notificationclick`.
  - cache app-shell: `./`, `./Main/index.html`, `./manifest.webmanifest`, `./IkonaGlowna.png`, `./IkonaPowiadomien.png`.
  - fallback notyfikacji push:
    - `body: +++ INCOMING DATA-TRANSMISSION +++`
    - `icon/badge: ./IkonaPowiadomien.png`
    - `tag: infoczytnik-new-message`
    - `url po kliknięciu: ./Infoczytnik/Infoczytnik_test.html`.
- `manifest.webmanifest`:
  - `start_url: ./Main/index.html`
  - `display: standalone`
  - brak wymuszonej orientacji (`orientation` usunięte z manifestu, więc orientacja zależy od urządzenia/systemu)
  - `icons`: `IkonaGlowna.png`, `IkonaPowiadomien.png`.

## PWA — konfiguracja techniczna

### `manifest.webmanifest`
- `start_url` ustawiono na `./Main/index.html` (user-only, bez parametru `?admin=1`).
- Cel: instalowana aplikacja PWA zawsze startuje w widoku użytkownika; tryb admina pozostaje dostępny tylko przez jawny URL z `?admin=1` lub skrót utworzony z takiego URL.

### `service-worker.js`
- Podniesiono wersję cache do `wg-pwa-v2`.
- Strategia `fetch` została uproszczona do online-first:
  - najpierw próba `fetch(request)`,
  - po błędzie sieci dopiero `caches.match(request, { ignoreSearch: true })`,
  - dla nawigacji bez odpowiedzi zwracany jest `503` z komunikatem tekstowym o wymaganym internecie.
- Domyślny URL powiadomienia (`push` i `notificationclick`) ustawiono na produkcyjne `./Infoczytnik/Infoczytnik.html` zamiast wersji testowej.

## przycisk Web Push w module Main

### Zakres
- Dodano nowy element UI: `button#pushBtn` w siatce `.actions` obok przycisków modułów.
- Dodano wariant stylu `.pushCta`, który wizualnie odróżnia CTA powiadomień od standardowych przycisków modułów.
- Podpięto skrypt `../Infoczytnik/config/web-push-config.js`, aby używać tej samej konfiguracji VAPID i endpointu subskrypcji.

### Style CSS
- `.pushCta`:
  - `border-color: #ff3b30`
  - `background: rgba(255, 59, 48, 0.2)`
  - `color: #ffe5e3`
  - `box-shadow: 0 0 18px rgba(255, 59, 48, 0.45)`
- `.pushCta:hover` zwiększa intensywność tła i poświaty.
- `.pushCta:active` zwiększa krycie czerwonego tła dla stanu kliknięcia.

### Logika JavaScript
Dodane funkcje:
1. `urlBase64ToUint8Array(base64String)` — konwersja klucza VAPID do `Uint8Array` dla `PushManager.subscribe`.
2. `getPushConfig()` — walidacja `window.infWebPushConfig` (`vapidPublicKey`, `subscribeEndpoint`).
3. `setPushButtonMessage(message, isError)` — aktualizacja treści i stanu komunikatu na przycisku.
4. `refreshPushButtonState()` — blokada przycisku przy braku konfiguracji.
5. `ensureServiceWorkerRegistration()` — rejestracja `../service-worker.js`.
6. `enablePushNotifications()` — pełny flow: permission → SW ready → `pushManager.subscribe` → POST do `subscribeEndpoint`.

### Zdarzenia i payload
- `#pushBtn` nasłuchuje na `click` i uruchamia `enablePushNotifications()`.
- Wysyłany payload subskrypcji zawiera:
  - `source: "main-launcher"`
  - `createdAt: Date.now()`
  - `subscription` (obiekt z `PushSubscription`).

### Integracja z dotychczasowym SW
- Dotychczasowa rejestracja SW na `window.load` została zachowana, ale używa wspólnej funkcji `ensureServiceWorkerRegistration()`.
- Dzięki temu zarówno bierna rejestracja SW, jak i aktywna subskrypcja push korzystają z jednej ścieżki rejestracji.

## korekta położenia i rozmiaru CTA push
- `button#pushBtn` został przeniesiony poza siatkę `.actions` i renderuje się jako element stały (`position: fixed`).
- Klasa `.pushCta` została zmieniona na wariant kompaktowy:
  - `right: 14px`, `bottom: 14px`, `z-index: 30`
  - `padding: 6px 10px`, `font-size: 11px`
  - `border-radius: 999px`
- Efekt: przycisk jest zawsze w prawym dolnym rogu ekranu i nie zaburza geometrii przycisków nawigacyjnych modułów.


## porządkowanie kolejności przycisków modułów
- Przebudowano kolejność bloków `.stack` w `Main/index.html`, aby po odfiltrowaniu elementów `data-admin-only="true"` nie zostawała pusta komórka siatki między **Infoczytnik** i **Kalkulator**.
- Widok użytkownika ma teraz stałą kolejność: **Infoczytnik → Skarbiec Danych → Obrazki → Mapa → Kalkulator → Rzut kośćmi**.
- Widok admina ma teraz stałą kolejność: **Infoczytnik → Skarbiec Danych → Generator Nazw → Generator NPC → Audio → Obrazki → Mapa → Kalkulator → Rzut kośćmi**.
- Usunięto z siatki `.actions` zbędny duplikat `button#pushBtn`; przycisk powiadomień występuje tylko raz jako element fixed poza siatką.

## osadzenie CTA push pod siatką modułów
- Usunięto pozycjonowanie viewportowe przycisku (`position: fixed`, `right`, `bottom`, `z-index`) z klasy `.pushCta`.
- Dodano nowy kontener `.pushCtaWrap` umieszczony **wewnątrz `<main>` i pod `.actions`**:
  - `width: 100%`
  - `display: flex`
  - `justify-content: flex-end`
  - `margin-top: 4px`
- `button#pushBtn` został przeniesiony do struktury:
  - `<div class="pushCtaWrap">`
  - `  <button class="btn pushCta" id="pushBtn" ...>`
- Efekt layoutu:
  - przycisk pozostaje na stałe pod tabelą przycisków nawigacyjnych,
  - jest wyrównany do prawej strony zielonej ramki panelu,
  - nie nachodzi na treść podczas scrollowania i nie przesuwa się względem viewportu.
- Logika JS Web Push pozostała bez zmian (obsługa kliknięcia, walidacja konfiguracji, subskrypcja, POST endpoint).


## szczegóły błędów subskrypcji push
- W `enablePushNotifications()` (`Main/index.html`) zmieniono obsługę odpowiedzi `fetch(pushConfig.subscribeEndpoint, ...)`.
- Poprzednio przy `!response.ok` rzucany był wyjątek tylko ze statusem HTTP.
- Aktualnie kod odczytuje dodatkowo treść odpowiedzi backendu:
  - `const errorText = await response.text().catch(() => "");`
  - `throw new Error(`Błąd zapisu subskrypcji: ${response.status} ${errorText}`);`
- Efekt: komunikat błędu w UI jest bardziej diagnostyczny i szybciej wskazuje przyczynę po stronie backendu push.

## stabilizacja koloru paska systemowego Android (PWA)

### Cel
Zmniejszenie przypadków, w których dolny pasek nawigacji systemowej Androida (Back/Home/Recents) renderuje jasne tło podczas pracy aplikacji jako zainstalowana PWA.

### Zakres zmian w `Main/index.html`
1. **Viewport**
   - Zmieniono:
     - `width=device-width, initial-scale=1.0`
   - Na:
     - `width=device-width, initial-scale=1.0, viewport-fit=cover`
   - Efekt: lepsza współpraca z obszarami systemowymi (edge-to-edge, wycięcia, insety).

2. **Meta `theme-color` (warianty per scheme)**
   - Pozostawiono bazowy `meta name="theme-color" content="#031605"`.
   - Dodano:
     - `meta name="theme-color" content="#031605" media="(prefers-color-scheme: light)"`
     - `meta name="theme-color" content="#031605" media="(prefers-color-scheme: dark)"`
   - Efekt: niezależnie od trybu systemowego (`light`/`dark`) aplikacja zgłasza ten sam ciemny kolor UI.

3. **Meta `color-scheme`**
   - Dodano: `meta name="color-scheme" content="dark"`.
   - Efekt: deklaracja, że strona jest zoptymalizowana pod ciemny schemat, co pomaga przeglądarce/systemowi przy doborze kolorystyki kontrolek/system overlay.

4. **Tło root (`html, body`)**
   - Dodano wspólną regułę:
     - `margin: 0`
     - `min-height: 100%`
     - `background: #031605`
     - `color: var(--text)`
   - Efekt: nawet zanim gradient `body` zostanie wyrenderowany, root dokumentu ma ciemne tło zgodne z motywem.

5. **Safe area dla dolnej krawędzi**
   - W `body` dodano:
     - `padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));`
   - Efekt: przy edge-to-edge dolna strefa systemowa nie „zjada” marginesu i nie eksponuje przypadkowego jasnego tła.

### Ograniczenia platformy (ważne)
- PWA **nie ma pełnej gwarancji** wymuszenia identycznego koloru dolnego paska systemowego na każdym urządzeniu Android.
- Ostateczny rendering zależy od kombinacji: Android + Chrome/WebView + nakładka producenta + tryb nawigacji (gesty/przyciski) + ustawienia systemowe.
- Zmiany w tym patchu maksymalizują spójność po stronie web, ale nie obchodzą ograniczeń OEM/systemu.

### Procedura testowa po wdrożeniu
1. Odinstalować istniejącą PWA na urządzeniu testowym.
2. Wyczyścić dane strony w Chrome.
3. Otworzyć stronę ponownie przez HTTPS.
4. Zainstalować PWA od nowa.
5. Zweryfikować kolor paska systemowego w:
   - widoku głównym `Main/index.html`,
   - przejściach do modułów z poziomu launchera.

## eliminacja przesunięcia przycisków przy ładowaniu logo

### Zakres zmian
- W `Main/index.html` obraz logo otrzymał natywne atrybuty rozmiaru:
  - `width="1366"`
  - `height="768"`
- W regule CSS `.logo` dodano jawne `height: auto`.

### Powód zmiany
- Bez natywnych wymiarów `<img>` przeglądarka nie znała proporcji obrazu podczas pierwszego przebiegu layoutu, co powodowało chwilowe przeskoczenie układu przycisków po dociągnięciu bitmapy.

### Efekt
- Silnik renderujący rezerwuje poprawną wysokość logo od początku.
- Panel `<main>` ma stabilną geometrię od pierwszego renderu.
- Zmiana zmniejsza wskaźnik CLS i eliminuje wizualny efekt „skakania” przycisków na starcie.
## 13. Kompletny wykaz funkcji JavaScript (`index.html`)
- `urlBase64ToUint8Array(base64String)` – zamiana klucza VAPID z Base64URL na `Uint8Array` dla `PushManager.subscribe`.
- `getPushConfig()` – pobranie konfiguracji Web Push (`publicVapidKey`, `backendSubscribeUrl`) z `Infoczytnik/config/web-push-config.js`.
- `setPushButtonMessage(message, isError = false)` – komunikat pod CTA push (status/blad).
- `refreshPushButtonState()` – odświeżenie widoczności i stanu przycisku „Włącz powiadomienia” na podstawie wsparcia przeglądarki, SW i subskrypcji.
- `ensureServiceWorkerRegistration()` – rejestracja/odczyt aktywnego Service Workera.
- `enablePushNotifications()` – pełny flow: permission -> rejestracja SW -> subskrypcja -> wysyłka do backendu.

## 14. Precyzyjna paleta kolorystyczna (bez skrótów)
- Tło `--bg`: dwa radialne gradienty (`rgba(0,255,128,0.06)` i `rgba(0,255,128,0.08)`) + kolor bazowy `#031605`.
- Tło panelu `--panel`: `#000`.
- Ramki `--border`: `#16c60c`.
- Tekst `--text`: `#9cf09c`.
- Akcent `--accent`: `#16c60c`; ciemny akcent `--accent-dark`: `#0d7a07`.
- Glow `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- Tła przycisków: `rgba(22, 198, 12, 0.08)` (normal), `rgba(22, 198, 12, 0.14)` (hover), `rgba(22, 198, 12, 0.22)` (active).
- Cień hover przycisków: `0 0 18px rgba(22, 198, 12, 0.3)`.
- CTA push (wariant czerwony): obramowanie `#ff3b30`, tło `rgba(255, 59, 48, 0.2)`, tekst `#ffe5e3`, glow `0 0 18px rgba(255, 59, 48, 0.45)`.

# WH40k Data-Slate

Dwustronicowa aplikacja webowa do szybkiego prezentowania komunikatów inspirowanych uniwersum WH40k. **GM.html** to panel prowadzącego (MG), a **Infoczytnik.html** to ekran graczy, który nasłuchuje Firestore i natychmiast odświeża layout, treść oraz audio.

## Instrukcja użytkownika (PL)
### Wymagania
- Projekt Firebase z włączonym Firestore.
- Firebase dla **Infoczytnika** nie wymaga oddzielnego konta Google od modułu **Audio** — oba moduły mogą działać w tym samym koncie/projekcie, jeśli konfiguracje i reguły są rozdzielone. Oddzielne projekty są opcją organizacyjną, a nie wymogiem technicznym.
- Serwer statyczny (np. GitHub Pages, Firebase Hosting lub lokalny serwer HTTP), ponieważ pliki korzystają z modułów ES i Firestore.
- Dostęp do internetu (Google Fonts + Firebase SDK).

### Instalacja i uruchomienie
1. Skopiuj `config/firebase-config.template.js` do `config/firebase-config.js`.
2. Wklej konfigurację Firebase (Web) z konsoli: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. W Firestore utwórz kolekcję `dataslate` i dokument `current` (jeśli go nie ma, aplikacja utworzy go przy pierwszym zapisie).
4. Ustaw reguły Firestore, aby umożliwić odczyt i zapis dokumentu `dataslate/current` dla urządzeń, które mają korzystać z aplikacji.
5. Uruchom aplikację:
   - Lokalnie: `npx http-server .` lub dowolny prosty serwer HTTP.
   - Zdalnie: wrzuć repo do hostingu statycznego (np. GitHub Pages).
6. Otwórz wersję produkcyjną:
   - `GM.html` (panel MG)
   - `Infoczytnik.html` (ekran graczy)
   lub użyj `index.html`, aby wybrać wersję produkcyjną lub testową (strona startowa ma zielony motyw i wyraźny podział na sekcje).
   - Tytuły kart dla stron testowych i startowej:
   - `index.html`: **DataSlate panel testowy**
    - `GM_test.html`: **Infoczytnik - panel GM**
    - `Infoczytnik_test.html`: **Infoczytnik**
   - Wersja językowa wpływa na tytuł GM_test: w języku EN wyświetla się **Data-Slate - GM panel**.
7. (Opcjonalnie) Przykładowy adres hostingu po migracji:
   - `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`
8. (Opcjonalnie) Na stronie startowej `index.html` są przyciski do wersji testowych (do sprawdzania zmian):
   - `GM (test)` → `GM_test.html`
   - `Infoczytnik (test)` → `Infoczytnik_test.html`

### Używanie
#### 1) Przygotowanie
1. Uruchom **Infoczytnik.html** na ekranie graczy.
2. Uruchom **GM.html** w panelu MG.
3. (Uwaga) W przeglądarkach audio może zostać zablokowane przez politykę autoplay — w takim przypadku wykonaj dowolną interakcję (kliknięcie/kliknięcie ekranu), aby dźwięk mógł się odtworzyć. W aplikacji Android/WebView dźwięk może działać bez dodatkowego kroku, jeśli WebView zezwala na autoplay.

#### 2) Wysyłanie komunikatu
1. (Opcjonalnie) W górnym selectorze przełącz język interfejsu (domyślnie **Polski**).
2. Wybierz frakcję (layout) z listy.
3. Ustaw kolor i rozmiar treści wiadomości.
4. Ustaw kolor i rozmiar prefiksu/sufiksu.
5. Ustaw **Ilość linii fillerów** (zakres 1–5, domyślnie 3).
6. (Opcjonalnie) Kliknij **Wylosuj ponownie**, aby wylosować nowy zestaw unikatowych prefixów i suffixów.
7. (Opcjonalnie) Włącz/wyłącz logo i efekt „flicker”.
8. Wpisz treść komunikatu.
9. Kliknij **Wyślij** — infoczytnik natychmiast zrenderuje dokładnie ten sam zestaw fillerów, który widzisz w podglądzie GM.

**Uwaga:** Teksty prefixów i suffixów pochodzą bezpośrednio z layoutów i nie zmieniają się wraz z wersją językową. Przełącznik językowy wpływa na etykiety UI oraz status „gotowe/ready”. Prefixy i suffixy są zaszyte bezpośrednio w `GM_test.html` i `Infoczytnik_test.html` (aplikacja nie pobiera ich z zewnętrznego pliku w runtime).

#### 3) Dodatkowe akcje
- **Ping** — wysyła tylko sygnał dźwiękowy (bez zmiany treści) i odświeża styl w infoczytniku.
- **Źródło audio** — Infoczytnik akceptuje wyłącznie lokalne ścieżki z repo (`assets/audio/...`). Jeśli w Firestore pojawi się zewnętrzny URL (np. Google Drive), zostanie automatycznie odrzucony i zastąpiony domyślnym dźwiękiem lokalnym.
- **Wyczyść ekran** — usuwa treść, ale zachowuje layout i ustawienia stylu.
- **Wyczyść pole** — czyści pole tekstowe w panelu MG (bez wysyłania do infoczytnika).

### Aktualizacja aplikacji
#### Aktualizacja assetów (tła, logotypy, audio)
1. Podmień pliki w `assets/`:
   - Tła: `assets/layouts/<frakcja>/*.png`
   - Logotypy: `assets/logos/<frakcja>/*.png`
   - Audio globalne: `assets/audio/global/Ping.mp3`, `assets/audio/global/Message.mp3`
2. Zmień wersję cache w `Infoczytnik.html`:
   - `INF_VERSION` (górny skrypt) oraz `ASSET_VERSION` (skrypt modułowy). W praktyce jest to ta sama wartość (`window.__dsVersion`).
   - Format wersji: `YYYY-MM-DD_HH-mm-ss` (zawsze zgodny z aktualną datą i godziną, z myślnikami zamiast dwukropków), np. `2026-02-01_10-44-23`.
3. Odśwież przeglądarkę na urządzeniach graczy. Infoczytnik wymusza cache-busting parametrem `?v=<INF_VERSION>`.

#### Aktualizacja konfiguracji Firebase
- Gdy zmienisz projekt Firebase, uaktualnij `config/firebase-config.js` (lub ponownie wygeneruj go z template).

#### Aktualizacja logiki / layoutów
- Zmiany wykonuj w `GM_test.html` i `Infoczytnik_test.html`, a po weryfikacji przenieś je ręcznie do wersji produkcyjnych.
- Po zmianach zawsze zwiększ `INF_VERSION` **w obu plikach testowych**: `GM_test.html` i `Infoczytnik_test.html`, aby urządzenia z cache pobrały świeżą wersję.

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

## User Guide (EN)
### Requirements
- A Firebase project with Firestore enabled.
- The **Infoczytnik** Firebase does not require a separate Google account from the **Audio** module — both modules can run under the same account/project as long as configuration and rules are separated. Separate projects are an organizational option, not a technical requirement.
- A static web server (e.g. GitHub Pages, Firebase Hosting, or a local HTTP server), because the pages use ES modules and Firestore.
- Internet access (Google Fonts + Firebase SDK).

### Installation & Launch
1. Copy `config/firebase-config.template.js` to `config/firebase-config.js`.
2. Paste the Firebase (Web) config from the console: **Project settings → Your apps → Firebase SDK snippet (Config)**.
3. In Firestore create collection `dataslate` and document `current` (if it does not exist, the app creates it on first write).
4. Set Firestore rules to allow reading and writing the `dataslate/current` document for the devices that use the app.
5. Run the app:
   - Locally: `npx http-server .` or any simple HTTP server.
   - Remote: deploy the repo to a static host (e.g. GitHub Pages).
6. Open the production version:
   - `GM.html` (GM panel)
   - `Infoczytnik.html` (player screen)
   or use `index.html` to choose production or test variants (the landing page uses the same green UI theme and clear sections).
   - Browser tab titles for the landing/test pages:
     - `index.html`: **DataSlate panel testowy**
     - `GM_test.html`: **Infoczytnik - panel GM** (EN: **Data-Slate - GM panel**)
     - `Infoczytnik_test.html`: **Infoczytnik**
7. (Optional) Example hosted URL after migration:
   - `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`
8. (Optional) On the `index.html` landing page, there are test buttons (for verifying changes):
   - `GM (test)` → `GM_test.html`
   - `Infoczytnik (test)` → `Infoczytnik_test.html`

### Usage
#### 1) Setup
1. Open **Infoczytnik.html** on the players’ display.
2. Open **GM.html** in the GM panel.
3. (Note) Browsers can block audio due to autoplay policies — if that happens, perform any interaction (click/tap) so audio can play. In the Android/WebView app audio can work without an extra step if the WebView allows autoplay.

#### 2) Sending a message
1. (Optional) Use the language switcher at the top (Polish is selected by default).
2. Select the faction (layout) from the list.
3. Set the message color and size.
4. Set the prefix/suffix color and size.
5. Set **Filler line count** (range 1–5, default 3).
6. (Optional) Click **Reroll** to generate a new unique set of prefix/suffix lines.
7. (Optional) Toggle the logo and the “flicker” effect.
8. Enter the message text.
9. Click **Wyślij / Send** — the player screen renders exactly the same filler set as in the GM live preview.

**Note:** Prefix/suffix lines come directly from the layout definitions and do not change with the language switch. The language toggle affects UI labels and the “ready” status text. Prefixes and suffixes are embedded directly in `GM_test.html` and `Infoczytnik_test.html` (no external filler file is loaded at runtime).

#### 3) Additional actions
- **Ping** — sends only a sound signal (no content change) and refreshes styles on the player screen.
- **Audio source policy** — Infoczytnik accepts only local repository paths (`assets/audio/...`). If Firestore contains an external URL (e.g. Google Drive), it is rejected and replaced with the default local sound.
- **Wyczyść ekran / Clear screen** — clears the content while keeping layout and style settings.
- **Wyczyść pole / Clear field** — clears the input field in the GM panel (no Firestore update).

### Updating the app
#### Updating assets (backgrounds, logos, audio)
1. Replace files in `assets/`:
   - Backgrounds: `assets/layouts/<faction>/*.png`
   - Logos: `assets/logos/<faction>/*.png`
   - Global audio: `assets/audio/global/Ping.mp3`, `assets/audio/global/Message.mp3`
2. Bump cache version in `Infoczytnik.html`:
   - `INF_VERSION` (top script) and `ASSET_VERSION` (module script). In practice these are the same value (`window.__dsVersion`).
   - Version format: `YYYY-MM-DD_HH-mm-ss` (always aligned with the current date and time, hyphens instead of colons), e.g. `2026-02-01_10-44-23`.
3. Refresh player devices. Infoczytnik forces cache-busting with the `?v=<INF_VERSION>` parameter.

#### Updating Firebase configuration
- When switching Firebase projects, update `config/firebase-config.js` (or regenerate from the template).

#### Updating logic / layouts
- Make changes in `GM_test.html` and `Infoczytnik_test.html`, then manually copy them into production once verified.
- After changes, always increment `INF_VERSION` **in both test files**: `GM_test.html` and `Infoczytnik_test.html`, so cached devices load the newest version.

### Disclaimer
This tool is an unofficial fan project created to help the GM in Wrath & Glory. The app is provided for private, non-commercial use only. It is not licensed, associated with, or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation.
Warhammer 40,000 and related names/trademarks are the property of Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

## Więcej informacji / More information
Szczegółowy opis kodu, struktury plików i działania każdego elementu aplikacji znajduje się w `docs/Documentation.md`.

## Firebase config reference / Referencja konfiguracji Firebase
- Kompletny opis konfiguracji Firebase, wymaganej struktury `dataslate/current`, skrypt Node.js oraz instrukcja krok-po-kroku (PL/EN) znajdują się w pliku: `Infoczytnik/config/Firebase-config.md`.
- Complete Firebase setup notes, required `dataslate/current` schema, Node.js bootstrap script, and step-by-step guide (PL/EN) are available in: `Infoczytnik/config/Firebase-config.md`.

---

## Web Push + Service Worker (PL)
Wdrożono wariant **Opcja B — Web Push + Service Worker** dla plików testowych.

### Co zostało dodane
1. `Infoczytnik_test.html`
   - Przycisk **Włącz powiadomienia** (`#pushBtn`) do ręcznego uruchomienia subskrypcji push.
   - Próba blokady orientacji: `screen.orientation.lock('portrait')` (cichy fallback bez komunikatu).
   - Obsługa subskrypcji `PushManager` i wysyłka subskrypcji do backendu.
   - Gdy brakuje konfiguracji (`vapidPublicKey`/`subscribeEndpoint`), przycisk jest automatycznie blokowany z informacją zamiast wyskakującego alertu.
  - Błędy konfiguracji/zgody przeglądarki/HTTP są pokazywane jako komunikat w samym przycisku (`#pushBtn`), bez blokującego okna `alert()`.
2. `GM_test.html`
   - Opcjonalny trigger HTTP po wysłaniu wiadomości (dla backendu Web Push).
3. `config/web-push-config.js`
   - `vapidPublicKey` — publiczny klucz VAPID.
   - `subscribeEndpoint` — endpoint zapisujący subskrypcję.
   - `triggerEndpoint` — opcjonalny endpoint uruchamiający wysyłkę push.

### Konfiguracja
Uzupełnij `Infoczytnik/config/web-push-config.js`:
- `vapidPublicKey` (Base64URL),
- `subscribeEndpoint` (POST JSON `subscription`),
- opcjonalnie `triggerEndpoint` (POST przy wysłaniu wiadomości przez GM).

### Treść i ikona powiadomienia
- Treść: `+++ INCOMING DATA-TRANSMISSION +++`
- Ikona: `IkonaPowiadomien.png`

## Web Push + Service Worker (EN)
The **Option B — Web Push + Service Worker** variant is implemented for test files.

### What was added
1. `Infoczytnik_test.html`
   - **Enable notifications** button (`#pushBtn`) for explicit push subscription.
   - Portrait lock attempt: `screen.orientation.lock('portrait')` (silent fallback, no UI message).
   - `PushManager` subscription flow and subscription POST to backend.
   - If config (`vapidPublicKey`/`subscribeEndpoint`) is missing, the button is auto-disabled with inline hint instead of a blocking alert.
  - Config/permission/HTTP errors are surfaced directly on the same button (`#pushBtn`) instead of `alert()` popups.
2. `GM_test.html`
   - Optional HTTP trigger after sending a message (for Web Push backend).
3. `config/web-push-config.js`
   - `vapidPublicKey` — public VAPID key.
   - `subscribeEndpoint` — backend endpoint to store subscriptions.
   - `triggerEndpoint` — optional endpoint to trigger push dispatch.

### Configuration
Fill `Infoczytnik/config/web-push-config.js` with:
- `vapidPublicKey` (Base64URL),
- `subscribeEndpoint` (POST JSON `subscription`),
- optional `triggerEndpoint` (POST on GM send).

### Notification content and icon
- Body: `+++ INCOMING DATA-TRANSMISSION +++`
- Icon: `IkonaPowiadomien.png`


## Aktualizacja 2026-03-13 (PL)
### Własny backend Web Push
Dodano przykładowy backend Node.js w katalogu `Infoczytnik/backend/`.

#### Pliki
- `Infoczytnik/backend/server.js` — API do zapisu subskrypcji i triggera wysyłki push.
- `Infoczytnik/backend/package.json` — zależności (`express`, `web-push`, `dotenv`, `cors`).
- `Infoczytnik/backend/.env.example` — wzór konfiguracji środowiska.

#### Szybkie uruchomienie
1. Przejdź do `Infoczytnik/backend`.
2. Uruchom `npm install`.
3. Skopiuj `.env.example` do `.env` i ustaw klucze VAPID.
4. Uruchom `npm start`.
5. Sprawdź status: `GET http://localhost:8787/api/push/health`.

#### Endpointy backendu
- `POST /api/push/subscribe` — zapis subskrypcji push.
- `POST /api/push/trigger` — wysyłka powiadomień do zapisanych subskrypcji.
- `GET /api/push/health` — healthcheck i liczba subskrypcji.

### Orientacja modułów
- `manifest.webmanifest` nie wymusza już globalnej orientacji.
- `Infoczytnik` pozostaje w pionie (lock `portrait` w module Infoczytnik).
- Pozostałe moduły korzystają z orientacji wynikającej z ustawień urządzenia/systemu.

## Update 2026-03-13 (EN)
### Custom Web Push backend
A sample Node.js backend was added in `Infoczytnik/backend/`.

#### Files
- `Infoczytnik/backend/server.js` — API for subscription storage and push trigger.
- `Infoczytnik/backend/package.json` — dependencies (`express`, `web-push`, `dotenv`, `cors`).
- `Infoczytnik/backend/.env.example` — environment configuration template.

#### Quick start
1. Go to `Infoczytnik/backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set VAPID keys.
4. Run `npm start`.
5. Check status: `GET http://localhost:8787/api/push/health`.

#### Backend endpoints
- `POST /api/push/subscribe` — stores push subscriptions.
- `POST /api/push/trigger` — sends notifications to stored subscriptions.
- `GET /api/push/health` — healthcheck and subscription count.

### Module orientation
- `manifest.webmanifest` no longer enforces a global orientation.
- `Infoczytnik` stays portrait (portrait lock inside the module).
- Other modules follow device/system orientation settings.

---

## Aktualizacja konfiguracji push (PL)
- W pliku `config/web-push-config.js` został ustawiony publiczny klucz VAPID z Firebase Cloud Messaging.
- Lokalny `localhost` został zastąpiony placeholderami produkcyjnymi HTTPS (`https://example.com/...`), aby konfiguracja nie sugerowała środowiska lokalnego.
- Dodano plik `config/web-push-config.production.example.js` jako gotowy wzór do uzupełnienia docelową domeną backendu.

## Push configuration update (EN)
- The `config/web-push-config.js` file now includes the public VAPID key from Firebase Cloud Messaging.
- Localhost URLs were replaced with production HTTPS placeholders (`https://example.com/...`) so the config no longer implies local-only setup.
- A new file `config/web-push-config.production.example.js` was added as a ready-to-use template for your final backend domain.

## Aktualizacja 2026-03-13 — konfiguracja PWA Android + Web Push (PL)
- `Infoczytnik_test.html` rejestruje teraz globalny Service Worker (`../service-worker.js`) również przy wejściu bezpośrednio do modułu, więc subskrypcja push nie zależy już od wcześniejszego otwarcia `Main/index.html`.
- W `GM_test.html` payload triggera push został ustawiony na produkcyjny adres modułu: `./Infoczytnik/Infoczytnik.html`.
- W `backend/server.js` domyślny `url` w payloadzie fallback również wskazuje produkcyjny `./Infoczytnik/Infoczytnik.html`.
- Podniesiono `INF_VERSION` w plikach testowych (`GM_test.html`, `Infoczytnik_test.html`) do `2026-03-13_08-25-05`.

## Update 2026-03-13 — Android PWA + Web Push configuration (EN)
- `Infoczytnik_test.html` now registers the global Service Worker (`../service-worker.js`) even when the module is opened directly, so push subscription no longer depends on opening `Main/index.html` first.
- In `GM_test.html`, push trigger payload now points to the production module URL: `./Infoczytnik/Infoczytnik.html`.
- In `backend/server.js`, the default fallback payload `url` also points to production `./Infoczytnik/Infoczytnik.html`.
- `INF_VERSION` was bumped in both test files (`GM_test.html`, `Infoczytnik_test.html`) to `2026-03-13_08-25-05`.

## Aktualizacja 2026-03-13 (PL)
- Z `Infoczytnik_test.html` usunięto przycisk **Włącz powiadomienia** (`#pushBtn`).
- Ekran Infoczytnika pozostaje wyłącznie ekranem odczytu wiadomości (bez dodatkowych akcji i bez fallbacków/linków onboardingowych).
- Logika wyświetlania wiadomości, layoutów i audio pozostała bez zmian.
- Podniesiono `INF_VERSION` w plikach testowych do: `2026-03-13_09-01-06` (`GM_test.html` i `Infoczytnik_test.html`).

## Update 2026-03-13 (EN)
- The **Enable notifications** button (`#pushBtn`) was removed from `Infoczytnik_test.html`.
- The Infoczytnik screen remains a read-only message display (no extra actions and no fallback/onboarding links).
- Message rendering, layouts, and audio behavior remain unchanged.
- `INF_VERSION` was bumped in test files to: `2026-03-13_09-01-06` (`GM_test.html` and `Infoczytnik_test.html`).

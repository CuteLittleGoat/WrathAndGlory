# WH40k Data-Slate

Dwustronicowa aplikacja webowa do szybkiego prezentowania komunikatów inspirowanych uniwersum WH40k. **GM.html** to panel prowadzącego (MG), a **Infoczytnik.html** to ekran graczy, który nasłuchuje Firestore i natychmiast odświeża layout, treść oraz audio.

## Instrukcja użytkownika (PL)
### Wymagania
- Projekt Firebase z włączonym Firestore.
- Firebase dla **Infoczytnika** musi być na **oddzielnym koncie Google** niż Firebase dla modułu **Audio** (unikasz konfliktów konfiguracji i reguł).
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
     - `GM_test.html`: **TEST: Infoczytnik - panel GM**
     - `Infoczytnik_test.html`: **TEST: Infoczytnik**
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
1. Wybierz frakcję (layout) z listy.
2. Ustaw kolor i rozmiar treści wiadomości.
3. Ustaw kolor i rozmiar prefiksu/sufiksu.
4. Zdecyduj, czy fillery (prefix/suffix) mają być losowane automatycznie, czy wybierane ręcznie.
5. (Opcjonalnie) Włącz/wyłącz logo i efekt „flicker”.
6. Wpisz treść komunikatu.
7. Kliknij **Wyślij** — infoczytnik natychmiast zrenderuje nową treść z wybranym layoutem.

#### 3) Dodatkowe akcje
- **Ping** — wysyła tylko sygnał dźwiękowy (bez zmiany treści) i odświeża styl w infoczytniku.
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
- Po zmianach zawsze zwiększ `INF_VERSION`, aby urządzenia z cache pobrały świeżą wersję.

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

## User Guide (EN)
### Requirements
- A Firebase project with Firestore enabled.
- The **Infoczytnik** Firebase must be on a **separate Google account** than the Firebase used for the **Audio** module (avoids configuration and rules conflicts).
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
     - `GM_test.html`: **TEST: Infoczytnik - panel GM**
     - `Infoczytnik_test.html`: **TEST: Infoczytnik**
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
1. Select the faction (layout) from the list.
2. Set the message color and size.
3. Set the prefix/suffix color and size.
4. Decide whether fillers (prefix/suffix) are randomized or selected manually.
5. (Optional) Toggle the logo and the “flicker” effect.
6. Enter the message text.
7. Click **Wyślij / Send** — the player screen renders the new message and layout immediately.

#### 3) Additional actions
- **Ping** — sends only a sound signal (no content change) and refreshes styles on the player screen.
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
- After changes, always increment `INF_VERSION` so cached devices load the newest version.

### Disclaimer
This tool is an unofficial fan project created to help the GM in Wrath & Glory. The app is provided for private, non-commercial use only. It is not licensed, associated with, or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation.
Warhammer 40,000 and related names/trademarks are the property of Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

## Więcej informacji / More information
Szczegółowy opis kodu, struktury plików i działania każdego elementu aplikacji znajduje się w `docs/Documentation.md`.

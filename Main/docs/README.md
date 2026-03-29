# Wrath & Glory / Kozi przybornik

Statyczna strona startowa (landing page) z linkami do narzędzi wspierających rozgrywki Wrath & Glory. Domyślnie działa w trybie użytkownika (6 przycisków), a tryb admina uruchamia się parametrem `?admin=1` i odsłania wszystkie narzędzia oraz notatki.

---

## Instrukcja obsługi (PL)
Tytuł karty przeglądarki: **Kozi Przybornik**.

### Dostępne narzędzia
- **Generator NPC** (widok admina): https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/index.html
- **Generator nazw** (widok admina): https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNazw/index.html
- **DataVault**:
  - Widok użytkownika: https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html
  - Widok admina (z przycisku w adminie lub bezpośrednio): https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1
  - Notatka o adminie wyświetla się tylko w widoku admina strony głównej.
- **Mapa** (widok użytkownika i admina): https://www.owlbear.rodeo/room/Iv_SzpbfiqUY/The%20Mad%20Joke
- **Obrazki** (widok użytkownika i admina): https://discord.com/channels/820916809946628096/1434928498476191834
- **Infoczytnik**:
  - Odczyt wiadomości (widok użytkownika): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik.html
  - GM (szykowanie wiadomości): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/GM.html
  - Menu główne (widok admina na stronie startowej): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html
    - GM (test): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/GM_test.html
    - Infoczytnik (test): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik_test.html
- **Kalkulator**:
  - Menu główne: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/index.html
  - Tworzenie postaci: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci.html
  - Kalkulator XP: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/KalkulatorXP.html
- **DiceRoller**: https://cutelittlegoat.github.io/WrathAndGlory/DiceRoller/index.html
- **Audio** (widok admina): https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html
  - Notatka o adminie wyświetla się tylko w widoku admina strony głównej.

### Instrukcje modułów (README)
- Generator NPC: https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/docs/README.md
- Generator nazw: https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNazw/docs/README.txt
- DataVault: https://cutelittlegoat.github.io/WrathAndGlory/DataVault/docs/README.md
- Infoczytnik: https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/docs/README.md
- Kalkulator: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/docs/README.md
- DiceRoller: https://cutelittlegoat.github.io/WrathAndGlory/DiceRoller/docs/README.md
- Audio: https://cutelittlegoat.github.io/WrathAndGlory/Audio/docs/README.md

### Jak używać
1. Otwórz stronę startową `Main/index.html` w przeglądarce.
2. Domyślnie zobaczysz widok użytkownika z sześcioma przyciskami w kolejności: Infoczytnik, Skarbiec Danych, Obrazki, Mapa, Kalkulator, Rzut kośćmi.
3. Aby uruchomić widok admina, dodaj do adresu parametr `?admin=1`. Pojawią się wszystkie przyciski w kolejności: Infoczytnik, Skarbiec Danych, Generator Nazw, Generator NPC, Audio, Obrazki, Mapa, Kalkulator, Rzut kośćmi, oraz notatki o panelach admina.
4. Jeśli potrzebujesz panelu admina w DataVault lub Audio, dopisz `index.html?admin=1` do odpowiedniego adresu (lub skorzystaj z przycisku DataVault w widoku admina).
5. **PWA i skrót z trybem admina:** najpierw wejdź na `Main/index.html?admin=1`, a dopiero potem wybierz „Dodaj do ekranu głównego”. Aplikacja zapisze preferencję i przy uruchomieniu skrótu (`?pwa=1`) automatycznie pokaże widok admina zamiast użytkownika.
6. Przyciski modułów aplikacji (Generator NPC, Skarbiec Danych, Kalkulator) otwierają się w tym samym kontekście (`_self`), a tylko linki zewnętrzne (Mapa, Obrazki) otwierają nową kartę (`_blank`).

### Gdzie zmienić link do mapy
Link do mapy jest przechowywany w pliku `Main/ZmienneHiperlacza.md`. Wpis ma format:
`Mapa: https://...`.
Jeśli adres mapy się zmieni, podmień URL po dwukropku w tym pliku.

### Gdzie zmienić link do obrazków
Link do obrazków jest przechowywany w pliku `Main/ZmienneHiperlacza.md`. Wpis ma format:
`Obrazki: https://...`.
Jeśli adres kanału się zmieni, podmień URL po dwukropku w tym pliku.

### Uruchamianie lokalne
To jest strona statyczna bez backendu. Możesz:
- po prostu otworzyć `Main/index.html` w przeglądarce, albo
- uruchomić prosty serwer lokalny, np.:

```bash
python -m http.server 8000
```

Następnie przejdź do `http://localhost:8000/Main/index.html`.

### Aktualizacja aplikacji
Aktualizacja polega na podmianie plików statycznych w miejscu hostingu (np. GitHub Pages):
1. Zaktualizuj treść w `Main/index.html` (np. adresy URL przycisków, teksty).
2. Jeśli zmieniasz logo, podmień plik `Main/wrath-glory-logo-warhammer.png`.
3. Wdróż zmiany w swoim hostingu (np. push do repozytorium obsługującego GitHub Pages).

### Pliki projektu
- `Main/index.html` – główny plik strony z treścią i osadzonymi stylami.
- `Main/ZmienneHiperlacza.md` – plik z linkami do Mapy i Obrazków w formacie `Nazwa: URL`.
- `Main/wrath-glory-logo-warhammer.png` – logo wyświetlane na stronie.
- `Main/docs/README.md` – niniejsza instrukcja obsługi (PL/EN).
- `Main/docs/Documentation.md` – dokumentacja techniczna kodu.

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## User guide (EN)
Browser tab title: **Kozi Przybornik**.

### Available tools
- **NPC Generator** (admin view): https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/index.html
- **Name Generator** (admin view): https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNazw/index.html
- **DataVault**:
  - User view: https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html
  - Admin view (from the admin button or directly): https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1
  - The admin note is shown only in the main page admin view.
- **Map** (user + admin view): https://www.owlbear.rodeo/room/Iv_SzpbfiqUY/The%20Mad%20Joke
- **Images** (user + admin view): https://discord.com/channels/820916809946628096/1434928498476191834
- **DataSlate**:
  - Message reader (user view): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik.html
  - GM (message prep): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/GM.html
  - Main menu (admin view on the landing page): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html
    - GM (test): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/GM_test.html
    - DataSlate (test): https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik_test.html
- **Calculator**:
  - Main menu: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/index.html
  - Character creation: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci.html
  - XP calculator: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/KalkulatorXP.html
- **DiceRoller**: https://cutelittlegoat.github.io/WrathAndGlory/DiceRoller/index.html
- **Audio** (admin view): https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html
  - The admin note is shown only in the main page admin view.

### Module README links
- NPC Generator: https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/docs/README.md
- Name Generator: https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNazw/docs/README.txt
- DataVault: https://cutelittlegoat.github.io/WrathAndGlory/DataVault/docs/README.md
- DataSlate: https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/docs/README.md
- Calculator: https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/docs/README.md
- DiceRoller: https://cutelittlegoat.github.io/WrathAndGlory/DiceRoller/docs/README.md
- Audio: https://cutelittlegoat.github.io/WrathAndGlory/Audio/docs/README.md

### How to use
1. Open the landing page at `Main/index.html` in your browser.
2. By default, the user view shows six buttons in this order: DataSlate, DataVault, Images, Map, Calculator, DiceRoller.
3. To enable admin view, add the `?admin=1` parameter. All buttons become visible in this order: DataSlate, DataVault, Name Generator, NPC Generator, Audio, Images, Map, Calculator, DiceRoller, plus admin notes.
4. If you need the DataVault or Audio admin panel, append `index.html?admin=1` to the relevant address (or use the DataVault button in admin view).
5. **PWA + shortcut with admin mode:** first open `Main/index.html?admin=1`, then choose “Add to Home screen”. The app stores that preference and when the shortcut starts (`?pwa=1`) it automatically opens admin view instead of user view.
6. App-module buttons (NPC Generator, DataVault, Calculator) open in the same context (`_self`), while only external links (Map, Images) open a new tab (`_blank`).

### Where to update the map link
The map URL is stored in `Main/ZmienneHiperlacza.md`. The entry format is:
`Mapa: https://...`.
If the map address changes, replace the URL after the colon in that file.

### Where to update the images link
The images URL is stored in `Main/ZmienneHiperlacza.md`. The entry format is:
`Obrazki: https://...`.
If the channel address changes, replace the URL after the colon in that file.

### Running locally
This is a static page with no backend. You can:
- open `Main/index.html` directly in your browser, or
- run a simple local server, e.g.:

```bash
python -m http.server 8000
```

Then go to `http://localhost:8000/Main/index.html`.

### Updating the app
Updating consists of replacing static files in your hosting (e.g. GitHub Pages):
1. Update content in `Main/index.html` (e.g. button URLs, text).
2. If you change the logo, replace `Main/wrath-glory-logo-warhammer.png`.
3. Deploy the changes to your hosting (e.g. push to the repo serving GitHub Pages).

### Project files
- `Main/index.html` – main page file with content and embedded styles.
- `Main/ZmienneHiperlacza.md` – link variables for Map and Images in `Label: URL` format.
- `Main/wrath-glory-logo-warhammer.png` – logo displayed on the page.
- `Main/docs/README.md` – this user guide (PL/EN).
- `Main/docs/Documentation.md` – technical documentation.

### Disclaimer
This tool is an unofficial, fan-made project created to support Wrath & Glory game masters. It is provided free of charge for private, non-commercial use only. The project is not licensed, affiliated with, or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation.
Warhammer 40,000 and related names and trademarks are the property of Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

---

## Aktualizacja PWA (PL)
- Strona główna rejestruje teraz globalny Service Worker (`../service-worker.js`) i ładuje manifest (`../manifest.webmanifest`).
- Ikona aplikacji została ustawiona na `IkonaGlowna.png`.
- Ikona powiadomień została ustawiona na `IkonaPowiadomien.png`.
- Aby instalacja PWA działała poprawnie, uruchamiaj aplikację przez HTTPS (na GitHub Pages działa domyślnie).

## PWA update (EN)
- The main page now registers a global Service Worker (`../service-worker.js`) and loads the manifest (`../manifest.webmanifest`).
- App icon is now `IkonaGlowna.png`.
- Notification icon is now `IkonaPowiadomien.png`.
- For proper PWA installation, run the app over HTTPS (GitHub Pages already provides this).


## Aktualizacja 2026-03-13 / Update 2026-03-13
- Usunięto globalny lock orientacji z `manifest.webmanifest`, dlatego orientacja modułów (poza wyjątkami implementowanymi lokalnie w modułach) zależy od ustawień urządzenia/systemu.
- The global orientation lock was removed from `manifest.webmanifest`, so module orientation (except module-specific local locks) now follows device/system settings.

---

## Aktualizacja PWA (PL)
- Aplikacja PWA uruchamia się teraz ze `start_url` ustawionym na `Main/index.html?pwa=1`, co utrzymuje domyślny widok użytkownika bez paneli admina.
- Service Worker działa w trybie online-first: przy braku internetu zwraca komunikat o wymaganym połączeniu zamiast utrwalonego trybu offline.
- Powiadomienia push otwierają domyślnie produkcyjny ekran `Infoczytnik/Infoczytnik.html`.

## PWA update (EN)
- The PWA now starts with `start_url` set to `Main/index.html?pwa=1`, which keeps the default user-only view without admin panels.
- Service Worker now uses an online-first strategy: when offline, it returns a clear “internet required” message instead of maintaining a quasi-offline behavior.
- Push notifications now open the production screen `Infoczytnik/Infoczytnik.html` by default.

## Aktualizacja 2026-03-13 (PL)
- Na stronie `Main/index.html` dodano wyróżniony, czerwony przycisk **Włącz powiadomienia**.
- Przycisk uruchamia zgodę przeglądarki i zapis subskrypcji Web Push dla tego samego origin co moduł Infoczytnik.
- Przycisk jest widoczny w widoku użytkownika i admina, aby onboarding powiadomień był dostępny od razu po wejściu do menu głównego.

## Update 2026-03-13 (EN)
- A highlighted red **Enable notifications** button was added to `Main/index.html`.
- The button requests browser permission and stores a Web Push subscription for the same origin as the Infoczytnik module.
- The button is visible in both user and admin views to make push-notification onboarding available directly from the main launcher.

## Aktualizacja 2026-03-13 (PL) — korekta przycisku powiadomień
- Przycisk **Włącz powiadomienia** został zmniejszony i ma mocno zaokrąglone krawędzie.
- Przycisk jest przypięty na stałe do prawego dolnego rogu ekranu, niezależnie od układu siatki modułów.

## Update 2026-03-13 (EN) — notifications button adjustment
- The **Enable notifications** button is now smaller and pill-shaped.
- The button is fixed to the bottom-right corner of the viewport, independent from the modules grid layout.

## Aktualizacja 2026-03-13 (PL) — pozycja przycisku powiadomień pod siatką
- Przycisk **Włącz powiadomienia** nie jest już przypięty do viewportu (`position: fixed`).
- Przycisk znajduje się teraz **na stałe pod tabelą/siatką przycisków modułów**, wyrównany do prawej strony zielonej ramki głównego panelu.
- Dzięki temu nie zasłania treści i nie „podąża” za ekranem podczas przewijania.

## Update 2026-03-13 (EN) — notifications button placed below the grid
- The **Enable notifications** button is no longer pinned to the viewport (`position: fixed`).
- It is now permanently placed **below the module buttons grid**, aligned to the right edge of the main green-framed panel.
- This prevents overlap and stops the button from following the user while scrolling.


## Aktualizacja 2026-03-13 (PL) — obsługa błędu subskrypcji push
- W `Main/index.html` rozszerzono obsługę błędu przy zapisie subskrypcji push.
- Jeśli backend zwróci błąd, UI pokazuje teraz: `status HTTP + treść odpowiedzi`, co ułatwia diagnostykę CORS i konfiguracji endpointu.

## Update 2026-03-13 (EN) — push subscription error handling
- In `Main/index.html`, push subscription error handling was extended.
- When backend returns an error, the UI now reports: `HTTP status + response body`, making CORS/endpoint diagnostics easier.


## Aktualizacja 2026-03-29 / Update 2026-03-29
- PL: `Main/index.html` zapisuje teraz tryb admina do `localStorage` po wejściu przez `?admin=1`. Jeśli aplikacja działa jako zainstalowane PWA (`display-mode: standalone`) i startuje z `?pwa=1`, tryb admina jest automatycznie włączany na podstawie zapisanej preferencji.
- EN: `Main/index.html` now stores admin mode in `localStorage` when opened with `?admin=1`. If the app runs as installed PWA (`display-mode: standalone`) and starts with `?pwa=1`, admin mode is auto-enabled from that saved preference.

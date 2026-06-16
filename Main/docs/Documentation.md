# 🇵🇱 Dokumentacja techniczna — Main (PL)

## Cel modułu

`Main` jest statycznym launcherem modułów `Wrath & Glory`.

Moduł odpowiada za:

- prezentację centralnego ekranu startowego,
- pokazanie podstawowych przycisków modułów,
- ukrywanie lub pokazywanie przycisków admina,
- przełączanie wybranych linków zależnie od trybu `?admin=1`,
- dynamiczne wczytywanie zewnętrznych linków `Mapa` i `Obrazki`,
- czyszczenie starych rejestracji Service Workerów.

Moduł nie ma własnego backendu, nie używa Firebase i nie zapisuje danych użytkownika.

## Punkt wejścia

Główny plik modułu:

```text
Main/index.html
```

Tryb standardowy:

```text
Main/index.html
```

Tryb admina:

```text
Main/index.html?admin=1
```

Tryb admina jest wykrywany po parametrze `admin=1` w query stringu.

## Struktura plików

| Plik | Rola |
| --- | --- |
| `Main/index.html` | Pełna aplikacja Main: HTML, CSS i JavaScript. |
| `Main/ZmienneHiperlacza.md` | Źródło dynamicznych linków `Mapa` i `Obrazki`. |
| `Main/wrath-glory-logo-warhammer.png` | Logo wyświetlane na stronie startowej. |
| `Main/docs/README.md` | Instrukcja użytkownika. |
| `Main/docs/Documentation.md` | Niniejsza dokumentacja techniczna. |
| `manifest.webmanifest` | Wspólny manifest aplikacji w katalogu nadrzędnym. |

## Zależności zewnętrzne

Moduł nie używa zewnętrznych bibliotek JavaScript.

Nie używa:

- Firebase,
- SheetJS,
- WebAudio,
- lokalnego parsera XLSX,
- Node.js w runtime.

Wszystka logika działa bezpośrednio w `Main/index.html`.

## Struktura HTML

Główny kontener:

```text
main
```

Najważniejsze elementy:

| Element | Rola |
| --- | --- |
| `img.logo` | Logo strony startowej. |
| `.actions` | Siatka przycisków modułów. |
| `.stack` | Kontener pojedynczego przycisku i opcjonalnej notatki. |
| `.btn` | Wspólna klasa przycisków/linków. |
| `.note` | Krótka notatka pomocnicza. |
| `[data-admin-only="true"]` | Element widoczny tylko w trybie admina. |
| `[data-infoczytnik-link]` | Link Infoczytnika przełączany zależnie od trybu. |
| `[data-datavault-link]` | Link DataVault przełączany zależnie od trybu. |
| `[data-images-link]` | Link `Obrazki`, uzupełniany z `ZmienneHiperlacza.md`. |
| `[data-map-link]` | Link `Mapa`, uzupełniany z `ZmienneHiperlacza.md`. |

## Przyciski modułów

### Przyciski widoczne zawsze

| Etykieta | Domyślny cel |
| --- | --- |
| `Infoczytnik` | `../Infoczytnik/Infoczytnik.html` w trybie standardowym. |
| `Skarbiec Danych` | `../DataVault/index.html` w trybie standardowym. |
| `Obrazki` | Link dynamiczny z `Main/ZmienneHiperlacza.md`. |
| `Mapa` | Link dynamiczny z `Main/ZmienneHiperlacza.md`. |
| `Kalkulator` | `../Kalkulator/`. |
| `Rzut kośćmi` | `../DiceRoller/index.html`. |

### Przyciski widoczne tylko w trybie admina

| Etykieta | Cel |
| --- | --- |
| `Generator Nazw` | `../GeneratorNazw/index.html`. |
| `Generator NPC` | `../GeneratorNPC/`. |
| `Audio` | `../Audio/index.html`. |

Elementy admin-only są oznaczone atrybutem:

```text
data-admin-only="true"
```

## Tryb standardowy i admin

Tryb admina jest obliczany przez:

```js
const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
```

Jeżeli `isAdmin` jest fałszywe, skrypt usuwa wszystkie elementy admin-only:

```js
adminOnlyElements.forEach((element) => element.remove());
```

To oznacza, że elementy administracyjne nie są tylko ukryte CSS-em — są fizycznie usuwane z DOM dla widoku standardowego.

## Przełączanie linku Infoczytnika

Link oznaczony `data-infoczytnik-link` zmienia cel zależnie od trybu.

Tryb standardowy:

```text
../Infoczytnik/Infoczytnik.html
```

Tryb admina:

```text
../Infoczytnik/index.html
```

Dzięki temu użytkownik standardowy trafia bezpośrednio na ekran graczy, a admin trafia na stronę wyboru wersji produkcyjnych i testowych.

## Przełączanie linku DataVault

Link oznaczony `data-datavault-link` zmienia cel zależnie od trybu.

Tryb standardowy:

```text
../DataVault/index.html
```

Tryb admina:

```text
../DataVault/index.html?admin=1
```

## Dynamiczne linki `Mapa` i `Obrazki`

Main pobiera dynamiczne linki z pliku:

```text
Main/ZmienneHiperlacza.md
```

Ścieżka w kodzie:

```js
const linkConfigPath = "ZmienneHiperlacza.md";
```

Oczekiwany format linii:

```text
Mapa: https://example.com/map
Obrazki: https://example.com/images
```

Parser przetwarza każdą linię wyrażeniem:

```js
/^(Mapa|Obrazki)\s*:\s*(\S+)/
```

Następnie mapuje klucze na lowercase:

```text
Mapa -> mapa
Obrazki -> obrazki
```

I wywołuje `applyDynamicLinks(links)`.

## `applyDynamicLinks(links)`

Funkcja ustawia `href` dla linków zewnętrznych:

```js
if (mapLink && links.mapa) {
  mapLink.href = links.mapa;
}
if (imagesLink && links.obrazki) {
  imagesLink.href = links.obrazki;
}
```

Jeżeli `ZmienneHiperlacza.md` nie zostanie pobrany albo nie ma pasujących wpisów, linki pozostają przy domyślnym `href="#"`, a błąd jest wypisywany do konsoli przez `console.warn(...)`.

## Linki zewnętrzne

`Mapa` i `Obrazki` mają:

```text
target="_blank"
rel="noopener noreferrer"
```

Otwierają się w nowej karcie i nie przekazują kontroli przez `window.opener`.

## Styl i layout

Moduł używa motywu zielonego terminala.

Zmienne CSS w `:root`:

| Zmienna | Wartość / rola |
| --- | --- |
| `--bg` | Tło z gradientami radialnymi i kolorem bazowym. |
| `--panel` | Kolor panelu: `#000`. |
| `--border` | Zielona ramka: `#16c60c`. |
| `--text` | Tekst: `#9cf09c`. |
| `--accent` | Akcent: `#16c60c`. |
| `--accent-dark` | Ciemny akcent: `#0d7a07`. |
| `--glow` | Zielona poświata panelu. |
| `--radius` | Promień zaokrąglenia. |

## Responsywność

Najważniejsze zasady layoutu:

- `body` centruje panel pionowo i poziomo,
- `main` ma szerokość `min(860px, 100%)`,
- `.actions` używa CSS Grid,
- grid używa `repeat(auto-fit, minmax(220px, 1fr))`,
- logo ma `max-width: clamp(220px, 40vw, 320px)`,
- `body` używa `env(safe-area-inset-bottom)` dla urządzeń z bezpiecznym obszarem ekranu.

## Interakcje przycisków

Przyciski `.btn` mają:

- zieloną ramkę,
- półprzezroczyste zielone tło,
- pogrubiony font,
- efekt hover `translateY(-1px)`,
- efekt glow na hover,
- mocniejsze tło w stanie active.

Przyciski są technicznie linkami `<a>`.

## Typografia

Globalny font-stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

Main nie ładuje fontów zewnętrznie. Korzysta z lokalnie dostępnych fontów systemowych.

## Manifest i PWA

`Main/index.html` linkuje wspólny manifest:

```html
<link rel="manifest" href="../manifest.webmanifest">
```

Ustawia też `theme-color` i `color-scheme`.

Moduł nie rejestruje własnego Service Workera.

## Czyszczenie starych Service Workerów

Na końcu pliku znajduje się skrypt:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});
}
```

Cel:

- usunąć stare rejestracje Service Workerów,
- ograniczyć ryzyko pokazania starej wersji aplikacji z cache,
- utrzymać działanie launchera jako aplikacji online.

Skrypt nie czyści samodzielnie wszystkich danych strony, ale wyrejestrowuje istniejące Service Workery.

## i18n

Main nie ma przełącznika języka.

Teksty przycisków są wpisane bezpośrednio w HTML.

W kodzie istnieje komentarz:

```text
MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT
```

Komentarz wskazuje miejsce, które trzeba uwzględnić przy ewentualnym dodaniu kolejnej wersji językowej. Nie jest to funkcja runtime.

## Firebase

Main nie używa Firebase bezpośrednio.

Firebase jest obsługiwany przez moduły docelowe, takie jak:

- DataVault,
- GeneratorNPC,
- Audio,
- Infoczytnik,
- Kalkulator.

Main tylko prowadzi do tych modułów.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Brak `?admin=1` | Elementy admin-only są usuwane z DOM. |
| Jest `?admin=1` | Elementy admin-only pozostają widoczne. |
| Brak `ZmienneHiperlacza.md` | Błąd trafia do `console.warn`, linki `Mapa`/`Obrazki` mogą zostać jako `#`. |
| Brak wpisu `Mapa:` | Link `Mapa` nie zostanie podmieniony. |
| Brak wpisu `Obrazki:` | Link `Obrazki` nie zostanie podmieniony. |
| Stary Service Worker | Strona próbuje wyrejestrować wszystkie rejestracje SW. |

## Procedura odtworzenia modułu

1. Utwórz `Main/index.html`.
2. Dodaj osadzony CSS z motywem zielonego terminala.
3. Dodaj `img.logo` z plikiem `wrath-glory-logo-warhammer.png`.
4. Dodaj siatkę przycisków `.actions`.
5. Oznacz przyciski adminowe przez `data-admin-only="true"`.
6. Dodaj link Infoczytnika z `data-infoczytnik-link`.
7. Dodaj link DataVault z `data-datavault-link`.
8. Dodaj linki `Mapa` i `Obrazki` z `data-map-link` i `data-images-link`.
9. Dodaj parser `ZmienneHiperlacza.md`.
10. Dodaj przełączanie `Infoczytnik` i `DataVault` zależnie od `?admin=1`.
11. Dodaj skrypt usuwający stare Service Workery.
12. Sprawdź tryb standardowy i admin.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Widok standardowy | Otwórz `Main/index.html`. | Widoczne są tylko podstawowe moduły. |
| Widok admina | Otwórz `Main/index.html?admin=1`. | Widoczne są też `Generator Nazw`, `Generator NPC` i `Audio`. |
| Infoczytnik user | Kliknij `Infoczytnik` w trybie standardowym. | Otwiera się `../Infoczytnik/Infoczytnik.html`. |
| Infoczytnik admin | Kliknij `Infoczytnik` w trybie admina. | Otwiera się `../Infoczytnik/index.html`. |
| DataVault user | Kliknij `Skarbiec Danych` w trybie standardowym. | Otwiera się `../DataVault/index.html`. |
| DataVault admin | Kliknij `Skarbiec Danych` w trybie admina. | Otwiera się `../DataVault/index.html?admin=1`. |
| Linki dynamiczne | Ustaw `Mapa:` i `Obrazki:` w `ZmienneHiperlacza.md`. | Przyciski dostają właściwe `href`. |
| Brak linków dynamicznych | Usuń lub zepsuj `ZmienneHiperlacza.md`. | Strona działa, a błąd pojawia się w konsoli. |
| Service Worker cleanup | Otwórz stronę w przeglądarce z dawnym SW. | Skrypt próbuje wyrejestrować stare rejestracje. |

---

# 🇬🇧 Technical documentation — Main (EN)

## Module purpose

`Main` is a static launcher for `Wrath & Glory` modules.

The module is responsible for:

- presenting the central start screen,
- showing basic module buttons,
- hiding or showing admin buttons,
- switching selected links depending on `?admin=1` mode,
- dynamically loading external `Map` and `Images` links,
- cleaning up old Service Worker registrations.

The module has no backend, does not use Firebase, and does not save user data.

## Entry point

Main module file:

```text
Main/index.html
```

Standard mode:

```text
Main/index.html
```

Admin mode:

```text
Main/index.html?admin=1
```

Admin mode is detected by `admin=1` query string parameter.

## File structure

| File | Role |
| --- | --- |
| `Main/index.html` | Full Main application: HTML, CSS, and JavaScript. |
| `Main/ZmienneHiperlacza.md` | Source of dynamic `Map` and `Images` links. |
| `Main/wrath-glory-logo-warhammer.png` | Logo displayed on the start page. |
| `Main/docs/README.md` | User guide. |
| `Main/docs/Documentation.md` | This technical documentation. |
| `manifest.webmanifest` | Shared application manifest in the parent directory. |

## External dependencies

The module does not use external JavaScript libraries.

It does not use:

- Firebase,
- SheetJS,
- WebAudio,
- local XLSX parser,
- Node.js at runtime.

All logic runs directly in `Main/index.html`.

## HTML structure

Main container:

```text
main
```

Important elements:

| Element | Role |
| --- | --- |
| `img.logo` | Start page logo. |
| `.actions` | Module button grid. |
| `.stack` | Container for one button and optional note. |
| `.btn` | Shared button/link class. |
| `.note` | Short helper note. |
| `[data-admin-only="true"]` | Element visible only in admin mode. |
| `[data-infoczytnik-link]` | Infoczytnik link switched by mode. |
| `[data-datavault-link]` | DataVault link switched by mode. |
| `[data-images-link]` | `Images` link filled from `ZmienneHiperlacza.md`. |
| `[data-map-link]` | `Map` link filled from `ZmienneHiperlacza.md`. |

## Module buttons

### Always visible buttons

| Label | Default target |
| --- | --- |
| `Infoczytnik` | `../Infoczytnik/Infoczytnik.html` in standard mode. |
| `Skarbiec Danych` | `../DataVault/index.html` in standard mode. |
| `Obrazki` | Dynamic link from `Main/ZmienneHiperlacza.md`. |
| `Mapa` | Dynamic link from `Main/ZmienneHiperlacza.md`. |
| `Kalkulator` | `../Kalkulator/`. |
| `Rzut kośćmi` | `../DiceRoller/index.html`. |

### Buttons visible only in admin mode

| Label | Target |
| --- | --- |
| `Generator Nazw` | `../GeneratorNazw/index.html`. |
| `Generator NPC` | `../GeneratorNPC/`. |
| `Audio` | `../Audio/index.html`. |

Admin-only elements are marked with:

```text
data-admin-only="true"
```

## Standard and admin mode

Admin mode is calculated by:

```js
const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
```

If `isAdmin` is false, the script removes all admin-only elements:

```js
adminOnlyElements.forEach((element) => element.remove());
```

This means admin elements are not only hidden with CSS — they are physically removed from the DOM in standard view.

## Infoczytnik link switching

Link marked with `data-infoczytnik-link` changes target depending on mode.

Standard mode:

```text
../Infoczytnik/Infoczytnik.html
```

Admin mode:

```text
../Infoczytnik/index.html
```

This sends a standard user directly to the player screen and sends admin to production/test selection page.

## DataVault link switching

Link marked with `data-datavault-link` changes target depending on mode.

Standard mode:

```text
../DataVault/index.html
```

Admin mode:

```text
../DataVault/index.html?admin=1
```

## Dynamic `Map` and `Images` links

Main loads dynamic links from file:

```text
Main/ZmienneHiperlacza.md
```

Code path:

```js
const linkConfigPath = "ZmienneHiperlacza.md";
```

Expected line format:

```text
Mapa: https://example.com/map
Obrazki: https://example.com/images
```

Parser processes each line with expression:

```js
/^(Mapa|Obrazki)\s*:\s*(\S+)/
```

Then it maps keys to lowercase:

```text
Mapa -> mapa
Obrazki -> obrazki
```

And calls `applyDynamicLinks(links)`.

## `applyDynamicLinks(links)`

Function sets `href` for external links:

```js
if (mapLink && links.mapa) {
  mapLink.href = links.mapa;
}
if (imagesLink && links.obrazki) {
  imagesLink.href = links.obrazki;
}
```

If `ZmienneHiperlacza.md` is not fetched or has no matching entries, links keep default `href="#"`, and error is written to console by `console.warn(...)`.

## External links

`Map` and `Images` have:

```text
target="_blank"
rel="noopener noreferrer"
```

They open in a new tab and do not pass control through `window.opener`.

## Style and layout

The module uses a green terminal theme.

CSS variables in `:root`:

| Variable | Value / role |
| --- | --- |
| `--bg` | Background with radial gradients and base color. |
| `--panel` | Panel color: `#000`. |
| `--border` | Green border: `#16c60c`. |
| `--text` | Text: `#9cf09c`. |
| `--accent` | Accent: `#16c60c`. |
| `--accent-dark` | Dark accent: `#0d7a07`. |
| `--glow` | Green panel glow. |
| `--radius` | Border radius. |

## Responsiveness

Main layout rules:

- `body` centers the panel vertically and horizontally,
- `main` width is `min(860px, 100%)`,
- `.actions` uses CSS Grid,
- grid uses `repeat(auto-fit, minmax(220px, 1fr))`,
- logo has `max-width: clamp(220px, 40vw, 320px)`,
- `body` uses `env(safe-area-inset-bottom)` for safe-area devices.

## Button interactions

`.btn` buttons have:

- green border,
- translucent green background,
- bold font,
- hover `translateY(-1px)` effect,
- hover glow,
- stronger background in active state.

Buttons are technically `<a>` links.

## Typography

Global font stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

Main does not load external fonts. It uses locally available system fonts.

## Manifest and PWA

`Main/index.html` links shared manifest:

```html
<link rel="manifest" href="../manifest.webmanifest">
```

It also sets `theme-color` and `color-scheme`.

The module does not register its own Service Worker.

## Old Service Worker cleanup

At the end of the file there is script:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});
}
```

Purpose:

- remove old Service Worker registrations,
- reduce the risk of showing stale cached app version,
- keep launcher working as an online application.

The script does not clear all site data by itself, but unregisters existing Service Workers.

## i18n

Main has no language switcher.

Button texts are written directly in HTML.

The code contains comment:

```text
MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT
```

The comment marks a place to consider when adding another language version. It is not a runtime feature.

## Firebase

Main does not use Firebase directly.

Firebase is handled by target modules such as:

- DataVault,
- GeneratorNPC,
- Audio,
- Infoczytnik,
- Kalkulator.

Main only links to those modules.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| No `?admin=1` | Admin-only elements are removed from DOM. |
| `?admin=1` present | Admin-only elements remain visible. |
| Missing `ZmienneHiperlacza.md` | Error goes to `console.warn`; `Map`/`Images` links may remain `#`. |
| Missing `Mapa:` entry | `Map` link is not replaced. |
| Missing `Obrazki:` entry | `Images` link is not replaced. |
| Old Service Worker | Page tries to unregister all SW registrations. |

## Module recreation procedure

1. Create `Main/index.html`.
2. Add embedded CSS with green terminal theme.
3. Add `img.logo` with `wrath-glory-logo-warhammer.png`.
4. Add `.actions` button grid.
5. Mark admin buttons with `data-admin-only="true"`.
6. Add Infoczytnik link with `data-infoczytnik-link`.
7. Add DataVault link with `data-datavault-link`.
8. Add `Map` and `Images` links with `data-map-link` and `data-images-link`.
9. Add `ZmienneHiperlacza.md` parser.
10. Add Infoczytnik and DataVault switching by `?admin=1`.
11. Add script removing old Service Workers.
12. Test standard and admin modes.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Standard view | Open `Main/index.html`. | Only core modules are visible. |
| Admin view | Open `Main/index.html?admin=1`. | `Generator Nazw`, `Generator NPC`, and `Audio` are also visible. |
| Infoczytnik user | Click `Infoczytnik` in standard mode. | `../Infoczytnik/Infoczytnik.html` opens. |
| Infoczytnik admin | Click `Infoczytnik` in admin mode. | `../Infoczytnik/index.html` opens. |
| DataVault user | Click `Skarbiec Danych` in standard mode. | `../DataVault/index.html` opens. |
| DataVault admin | Click `Skarbiec Danych` in admin mode. | `../DataVault/index.html?admin=1` opens. |
| Dynamic links | Set `Mapa:` and `Obrazki:` in `ZmienneHiperlacza.md`. | Buttons receive correct `href`. |
| Missing dynamic links | Remove or break `ZmienneHiperlacza.md`. | Page still works and error appears in console. |
| Service Worker cleanup | Open page in browser with old SW. | Script attempts to unregister old registrations. |

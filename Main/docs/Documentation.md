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
| `Main/Gilead.html` | Samodzielna strona z rejestrem światów systemu Gilead, otwierana przyciskiem `Gilead`. **Kopia wydania** — plik powstaje poza tym repozytorium i nie jest tutaj edytowany; patrz „Pochodzenie pliku `Main/Gilead.html`”. |
| `Main/Galaktyka.html` | Samodzielna strona z interaktywną mapą galaktyki, otwierana przyciskiem `Galaktyka`. |
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
| `.secretCtaWrap` | Pasek pod siatką `.actions`, rozsuwający dwa przyciski CTA do lewej i prawej krawędzi panelu. |
| `.btn.secretCta` | Czerwony wariant CTA typu „pill” użyty przez linki `Galaktyka` i `Gilead`. |
| `.note` | Krótka notatka pomocnicza. |
| `[data-admin-only="true"]` | Element widoczny tylko w trybie admina. |
| `[data-infoczytnik-link]` | Link Infoczytnika przełączany zależnie od trybu. |
| `[data-datavault-link]` | Link DataVault przełączany zależnie od trybu. |
| `[data-images-link]` | Link `Obrazki`, uzupełniany z `ZmienneHiperlacza.md`. |
| `[data-map-link]` | Link `Mapa`, uzupełniany z `ZmienneHiperlacza.md`. |

### Siatka przycisków a wąski ekran

Siatka używa zapisu `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`. Człon `min(220px, 100%)` jest
tu konieczny: samo `minmax(220px, 1fr)` nie potrafi zejść poniżej 220 px, więc przy 320 px ekranu
kolumna wychodziła poza swój pojemnik o 16 px. Powyżej tej szerokości oba zapisy dają identyczny
układ, co do setnej części piksela.

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
| `Galaktyka` | `Galaktyka.html` otwierany w nowej karcie (`target="_blank"`). |
| `Gilead` | `Gilead.html` otwierany w nowej karcie (`target="_blank"`). |

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

## Przyciski `Galaktyka` i `Gilead`

Pod siatką `.actions`, jako ostatni element kontenera `main`, znajduje się osobny pasek CTA z dwoma linkami:

```html
<div class="secretCtaWrap">
  <a class="btn secretCta" href="Galaktyka.html" target="_blank" rel="noopener noreferrer">Galaktyka</a>
  <a class="btn secretCta" href="Gilead.html" target="_blank" rel="noopener noreferrer">Gilead</a>
</div>
```

Charakterystyka:

- oba elementy to zwykłe linki `<a>`, bez obsługi w JavaScript,
- cele `Galaktyka.html` i `Gilead.html` są ścieżkami względnymi wewnątrz katalogu `Main/`,
- `target="_blank"` wymusza otwarcie w nowej karcie,
- `rel="noopener noreferrer"` odcina dostęp przez `window.opener`,
- żaden z linków nie ma atrybutu `data-admin-only`, więc oba są widoczne w trybie standardowym i w trybie admina,
- kontener `.secretCtaWrap` używa `display: flex` z `justify-content: space-between`, `align-items: center` i `gap: 10px`, co dosuwa `Galaktyka` do lewego, a `Gilead` do prawego dolnego rogu panelu (układ lustrzany),
- oba linki używają tej samej klasy `.btn.secretCta`, więc mają identyczny wygląd i różnią się wyłącznie etykietą, celem i pozycją.

Styl `.btn.secretCta` jest wariantem wspólnej klasy `.btn` i odpowiada wizualnie przyciskowi `Tajny przycisk!` z `Kalkulator/index.html`:

| Właściwość | Wartość |
| --- | --- |
| `border-color` | `#ff3b30` |
| `background` | `rgba(255, 59, 48, 0.2)` (normal), `rgba(255, 59, 48, 0.28)` (hover), `rgba(255, 59, 48, 0.36)` (active) |
| `color` | `#ffe5e3` |
| `box-shadow` | `0 0 14px rgba(255, 59, 48, 0.35)`, hover `0 0 16px rgba(255, 59, 48, 0.45)` |
| `border-radius` | `999px` |
| `width` | `auto` |
| `padding` | `6px 10px` |
| `font-size` | `11px`, `line-height: 1.1` |
| `font-weight` | `700`, `letter-spacing: 0.2px` |

W przeciwieństwie do Kalkulatora, Main nie używa overlaya — kliknięcie prowadzi bezpośrednio do osobnej strony.

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

## Pochodzenie pliku `Main/Gilead.html`

`Main/Gilead.html` jest **kopią wydania**. Nie powstaje w tym repozytorium i nie jest tutaj edytowany.

| | |
| --- | --- |
| Repozytorium źródłowe | `Scenariusze` |
| Katalog projektu | `Warhammer40k/Gilead/` |
| Generator | `Warhammer40k/Gilead/scripts/build/gilead/assemble.py` |
| Plik wynikowy | `Warhammer40k/Gilead/Gilead.html` |

Generator składa stronę z osobnych źródeł: treści kart rejestru, geometrii mapy oraz ilustracji osadzonych w `base64`. Wynikiem jest plik samodzielny — nie pobiera żadnych zasobów z sieci i działa również spod `file://`. Do modułu `Main` trafia gotowy plik.

Zasady pracy z tym plikiem w module `Main`:

- **nie edytować go tutaj** — także zmian jednoznakowych i oczywiście słusznych. Przy następnym wydaniu generator odtwarza plik od nowa, więc poprawka naniesiona w module `Main` znika bez śladu i nie wraca do źródła,
- dotyczy to całej zawartości pliku, w tym bloków `<style>` i `<script>`,
- usterkę zauważoną w samym rejestrze należy **zgłosić** do projektu rejestru w repozytorium `Scenariusze`, a nie naprawiać na miejscu.

Aktualizacja polega na skopiowaniu nowego wydania w miejsce poprzedniego. Zgodność kopii ze źródłem sprawdza się sumą kontrolną: `sha256sum Main/Gilead.html` ma dać tę samą wartość co `sha256sum` pliku wynikowego w repozytorium `Scenariusze`. Rozbieżność oznacza, że kopia rozjechała się z wydaniem, i należy ją wyjaśnić przed jakąkolwiek dalszą pracą.

Wewnętrzna budowa rejestru — mapa SVG, kadrowanie, obsługa gestów i karty rejestru — jest opisana w dokumentacji projektu rejestru w repozytorium `Scenariusze`. Niniejsza dokumentacja jej nie powtarza, żeby oba opisy nie rozjechały się ze sobą.

## Procedura odtworzenia modułu

1. Utwórz `Main/index.html`.
2. Dodaj osadzony CSS z motywem zielonego terminala.
3. Dodaj `img.logo` z plikiem `wrath-glory-logo-warhammer.png`.
4. Dodaj siatkę przycisków `.actions`.
5. Oznacz przyciski adminowe przez `data-admin-only="true"`.
6. Dodaj link Infoczytnika z `data-infoczytnik-link`.
7. Dodaj link DataVault z `data-datavault-link`.
8. Dodaj linki `Mapa` i `Obrazki` z `data-map-link` i `data-images-link`.
9. Dodaj pod siatką `.actions` kontener `.secretCtaWrap` (`display: flex`, `justify-content: space-between`) z dwoma linkami `.btn.secretCta`: `Galaktyka.html` jako pierwszy i `Gilead.html` jako drugi (oba `target="_blank"`, `rel="noopener noreferrer"`).
10. Dodaj parser `ZmienneHiperlacza.md`.
11. Dodaj przełączanie `Infoczytnik` i `DataVault` zależnie od `?admin=1`.
12. Dodaj skrypt usuwający stare Service Workery.
13. Wstaw `Main/Gilead.html`, kopiując bieżące wydanie z repozytorium `Scenariusze` — tego pliku nie odtwarza się ręcznie; patrz „Pochodzenie pliku `Main/Gilead.html`”.
14. Sprawdź tryb standardowy i admin.

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
| Przycisk `Gilead` | Kliknij `Gilead` w prawym dolnym rogu panelu. | W nowej karcie otwiera się `Main/Gilead.html`, a karta z Main pozostaje otwarta. |
| Przycisk `Galaktyka` | Kliknij `Galaktyka` w lewym dolnym rogu panelu. | W nowej karcie otwiera się `Main/Galaktyka.html`, a karta z Main pozostaje otwarta. |
| Widoczność `Gilead` | Otwórz Main w trybie standardowym i w trybie admina. | Przycisk `Gilead` jest widoczny w obu trybach. |
| Widoczność `Galaktyka` | Otwórz Main w trybie standardowym i w trybie admina. | Przycisk `Galaktyka` jest widoczny w obu trybach. |
| Układ paska CTA | Porównaj położenie obu przycisków. | `Galaktyka` przylega do lewej, a `Gilead` do prawej krawędzi panelu, oba w tej samej linii. |

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
| `Main/Gilead.html` | Standalone Gilead system world registry page opened by the `Gilead` button. **Release copy** — the file is produced outside this repository and is not edited here; see “Where `Main/Gilead.html` comes from”. |
| `Main/Galaktyka.html` | Standalone interactive galaxy map page opened by the `Galaktyka` button. |
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
| `.secretCtaWrap` | Bar below the `.actions` grid spreading two CTA buttons to the left and right panel edges. |
| `.btn.secretCta` | Red "pill" CTA variant used by the `Galaktyka` and `Gilead` links. |
| `.note` | Short helper note. |
| `[data-admin-only="true"]` | Element visible only in admin mode. |
| `[data-infoczytnik-link]` | Infoczytnik link switched by mode. |
| `[data-datavault-link]` | DataVault link switched by mode. |
| `[data-images-link]` | `Images` link filled from `ZmienneHiperlacza.md`. |
| `[data-map-link]` | `Map` link filled from `ZmienneHiperlacza.md`. |

### The button grid on a narrow screen

The grid uses `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`. The `min(220px, 100%)` part is
required here: plain `minmax(220px, 1fr)` cannot go below 220 px, so on a 320 px screen the column
overflowed its container by 16 px. Above that width both forms produce an identical layout, to the
hundredth of a pixel.

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
| `Galaktyka` | `Galaktyka.html` opened in a new tab (`target="_blank"`). |
| `Gilead` | `Gilead.html` opened in a new tab (`target="_blank"`). |

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

## `Galaktyka` and `Gilead` buttons

Below the `.actions` grid, as the last element of the `main` container, there is a separate CTA bar holding two links:

```html
<div class="secretCtaWrap">
  <a class="btn secretCta" href="Galaktyka.html" target="_blank" rel="noopener noreferrer">Galaktyka</a>
  <a class="btn secretCta" href="Gilead.html" target="_blank" rel="noopener noreferrer">Gilead</a>
</div>
```

Characteristics:

- both elements are plain `<a>` links with no JavaScript handling,
- the `Galaktyka.html` and `Gilead.html` targets are relative paths inside the `Main/` directory,
- `target="_blank"` forces opening in a new tab,
- `rel="noopener noreferrer"` cuts off access through `window.opener`,
- neither link has a `data-admin-only` attribute, so both are visible in standard and admin mode,
- the `.secretCtaWrap` container uses `display: flex` with `justify-content: space-between`, `align-items: center` and `gap: 10px`, which pins `Galaktyka` to the bottom-left and `Gilead` to the bottom-right corner of the panel (mirrored layout),
- both links use the same `.btn.secretCta` class, so they look identical and differ only in label, target and position.

The `.btn.secretCta` style is a variant of the shared `.btn` class and visually matches the `Tajny przycisk!` button from `Kalkulator/index.html`:

| Property | Value |
| --- | --- |
| `border-color` | `#ff3b30` |
| `background` | `rgba(255, 59, 48, 0.2)` (normal), `rgba(255, 59, 48, 0.28)` (hover), `rgba(255, 59, 48, 0.36)` (active) |
| `color` | `#ffe5e3` |
| `box-shadow` | `0 0 14px rgba(255, 59, 48, 0.35)`, hover `0 0 16px rgba(255, 59, 48, 0.45)` |
| `border-radius` | `999px` |
| `width` | `auto` |
| `padding` | `6px 10px` |
| `font-size` | `11px`, `line-height: 1.1` |
| `font-weight` | `700`, `letter-spacing: 0.2px` |

Unlike the Calculator, Main uses no overlay — the click leads directly to a separate page.

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

## Where `Main/Gilead.html` comes from

`Main/Gilead.html` is a **release copy**. It is not produced in this repository and is not edited here.

| | |
| --- | --- |
| Source repository | `Scenariusze` |
| Project directory | `Warhammer40k/Gilead/` |
| Generator | `Warhammer40k/Gilead/scripts/build/gilead/assemble.py` |
| Build output | `Warhammer40k/Gilead/Gilead.html` |

The generator assembles the page from separate sources: registry card content, map geometry, and illustrations embedded as `base64`. The result is a self-contained file — it fetches nothing from the network and works from `file://` as well. The finished file is what reaches the `Main` module.

Rules for working with this file inside the `Main` module:

- **do not edit it here** — not even single-character, obviously correct changes. The next release regenerates the file from scratch, so a fix applied in the `Main` module disappears without a trace and never reaches the source,
- this covers the whole file, including its `<style>` and `<script>` blocks,
- a defect noticed in the registry itself must be **reported** to the registry project in the `Scenariusze` repository, not fixed in place.

Updating means copying the new release over the previous one. Checksums confirm that the copy matches the source: `sha256sum Main/Gilead.html` must return the same value as `sha256sum` of the build output in the `Scenariusze` repository. A mismatch means the copy has drifted from the release and must be explained before any further work.

The registry internals — the SVG map, view framing, gesture handling, and registry cards — are documented in the registry project documentation in the `Scenariusze` repository. This documentation does not repeat them, so the two descriptions cannot drift apart.

## Module recreation procedure

1. Create `Main/index.html`.
2. Add embedded CSS with green terminal theme.
3. Add `img.logo` with `wrath-glory-logo-warhammer.png`.
4. Add `.actions` button grid.
5. Mark admin buttons with `data-admin-only="true"`.
6. Add Infoczytnik link with `data-infoczytnik-link`.
7. Add DataVault link with `data-datavault-link`.
8. Add `Map` and `Images` links with `data-map-link` and `data-images-link`.
9. Add a `.secretCtaWrap` container (`display: flex`, `justify-content: space-between`) below the `.actions` grid with two `.btn.secretCta` links: `Galaktyka.html` first and `Gilead.html` second (both `target="_blank"`, `rel="noopener noreferrer"`).
10. Add `ZmienneHiperlacza.md` parser.
11. Add Infoczytnik and DataVault switching by `?admin=1`.
12. Add script removing old Service Workers.
13. Put `Main/Gilead.html` in place by copying the current release from the `Scenariusze` repository — this file is never recreated by hand; see “Where `Main/Gilead.html` comes from”.
14. Test standard and admin modes.

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
| `Gilead` button | Click `Gilead` in the bottom-right corner of the panel. | `Main/Gilead.html` opens in a new tab and the Main tab stays open. |
| `Galaktyka` button | Click `Galaktyka` in the bottom-left corner of the panel. | `Main/Galaktyka.html` opens in a new tab and the Main tab stays open. |
| `Gilead` visibility | Open Main in standard and admin mode. | The `Gilead` button is visible in both modes. |
| `Galaktyka` visibility | Open Main in standard and admin mode. | The `Galaktyka` button is visible in both modes. |
| CTA bar layout | Compare the position of both buttons. | `Galaktyka` sits at the left and `Gilead` at the right panel edge, both on the same line. |

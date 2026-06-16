# 🇵🇱 Dokumentacja techniczna — DiceRoller (PL)

## Cel modułu

`DiceRoller` jest statycznym modułem frontendowym do wykonywania rzutów kośćmi dla testów Wrath & Glory.

Moduł odpowiada za:

- pobranie od użytkownika Stopnia Trudności, Puli Kości i liczby Kości Furii,
- walidację i ograniczenie wartości pól,
- wyrenderowanie kości białych i czerwonych,
- animację rzutu,
- losowanie wyników `1..6`,
- przeliczenie punktów sukcesu,
- określenie sukcesu albo porażki,
- wykrycie Komplikacji Furii albo Krytycznej Furii,
- obliczenie możliwego Przeniesienia,
- prezentację podsumowania w języku PL albo EN.

Moduł działa wyłącznie po stronie przeglądarki.

## Punkty wejścia

Główny plik modułu:

```text
DiceRoller/index.html
```

Plik ładuje:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

## Tryby działania

Moduł ma jeden tryb użytkownika.

Nie posiada:

- trybu admina,
- logowania,
- Firebase,
- backendu,
- zapisu historii rzutów,
- importu ani eksportu danych.

Język interfejsu jest wybierany przez `#languageSelect`.

## Struktura plików

| Plik | Rola |
| --- | --- |
| `DiceRoller/index.html` | Struktura widoku: przełącznik języka, przycisk powrotu, pola, przycisk rzutu i wyniki. |
| `DiceRoller/style.css` | Motyw terminalowy, layout, style pól, przycisków, kości, animacji i panelu wyniku. |
| `DiceRoller/script.js` | Stałe, tłumaczenia, walidacja, losowanie, render kości, logika wyniku i event listenery. |
| `DiceRoller/docs/README.md` | Instrukcja użytkownika PL/EN. |
| `DiceRoller/docs/Documentation.md` | Niniejsza dokumentacja techniczna PL/EN. |

## Zależności

Moduł korzysta wyłącznie ze standardowych API przeglądarki:

- DOM API,
- `Math.random`,
- `setTimeout`,
- CSS animations.

Moduł nie używa:

- Firebase,
- Firestore,
- Realtime Database,
- `localStorage`,
- `sessionStorage`,
- zewnętrznych bibliotek JavaScript,
- frameworków frontendowych.

## Struktura HTML

Główny kontener:

```html
<main class="app">
  ...
</main>
```

Najważniejsze elementy DOM:

| Element | Rola |
| --- | --- |
| `.app` | Główna karta aplikacji. |
| `.language-switcher` | Kontener selektora języka i linku do strony głównej. |
| `#languageSelect` | Selektor języka `pl` / `en`. |
| `#mainPageButton` | Link do `../Main/index.html`. |
| `#pageTitle` | Tytuł modułu. |
| `#subtitle` | Podtytuł modułu. |
| `.panel` | Grid pól wejściowych i przycisku rzutu. |
| `#difficulty` | Pole Stopnia Trudności. |
| `#pool` | Pole Puli Kości. |
| `#wrath` | Pole liczby Kości Furii. |
| `#wrathHint` | Podpowiedź przy polu Kości Furii. |
| `#roll` | Przycisk rzutu. |
| `.results` | Sekcja wyników. |
| `#dice` | Kontener wyrenderowanych kości. |
| `#summary` | Kontener podsumowania testu. |

## Struktura CSS

### Zmienne motywu

| Zmienna | Znaczenie |
| --- | --- |
| `--bg` | Tło z radialnymi poświatami i kolorem `#031605`. |
| `--panel` | Czarne tło panelu. |
| `--border` | Zielona ramka. |
| `--text` | Zielony tekst. |
| `--accent` | Zielony akcent. |
| `--accent-dark` | Ciemniejszy zielony akcent. |
| `--muted` | Przygaszony tekst. |
| `--glow` | Zielona poświata. |
| `--radius` | Promień zaokrągleń. |
| `--white-die` | Kolor białej kości. |
| `--white-pip` | Kolor oczek białej kości. |
| `--red-die` | Kolor czerwonej kości Furii. |
| `--red-pip` | Kolor oczek czerwonej kości. |

Globalny font-stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

Najważniejsze zasady layoutu:

- `body` centruje moduł pionowo i poziomo,
- `.app` ma szerokość `min(860px, 100%)`, czarne tło, zieloną ramkę i poświatę,
- `.language-switcher` jest pozycjonowany absolutnie w prawym górnym rogu,
- `.panel` używa `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`,
- `.dice` używa `flex-wrap`, aby kości zawijały się w wielu wierszach,
- przy szerokości do `600px` przełącznik języka przechodzi do pozycji statycznej, a kości zmniejszają się z `68px` do `58px`.

## Kości i klasy CSS

Każda kość jest tworzona dynamicznie jako:

```html
<div class="die white face-1">...</div>
```

albo:

```html
<div class="die red face-1">...</div>
```

Element kości zawiera:

- `.die__question` z symbolem `?`,
- siedem elementów `.pip` z klasami `pos-1` do `pos-7`.

Klasy `face-1` do `face-6` kontrolują widoczność oczek.

Klasa `rolling`:

- uruchamia animację `roll`,
- ukrywa oczka,
- pokazuje znak zapytania.

## Stałe JavaScript

| Stała | Wartość | Znaczenie |
| --- | --- | --- |
| `MIN_VALUE` | `1` | Minimalna wartość pól liczbowych. |
| `MAX_VALUE` | `99` | Maksymalna wartość pól liczbowych. |
| `DEFAULT_DIFFICULTY` | `3` | Domyślny Stopień Trudności. |
| `DEFAULT_POOL` | `2` | Domyślna Pula Kości. |
| `DEFAULT_WRATH` | `1` | Domyślna liczba Kości Furii. |
| `ROLL_DURATION` | `900` | Czas oczekiwania przed pokazaniem finalnego wyniku. |

## Warstwa i18n

Obiekt `translations` ma klucze:

```js
translations.pl
translations.en
```

Każdy język zawiera:

- `labels` — etykiety interfejsu,
- `messages` — teksty podsumowania wyniku.

Funkcja `updateLanguage(lang)`:

1. ustawia `currentLanguage`,
2. aktualizuje `document.documentElement.lang`,
3. synchronizuje wartość `#languageSelect`,
4. aktualizuje tytuł, podtytuł, etykiety pól, podpowiedź i przycisk rzutu,
5. aktualizuje tekst przycisku `#mainPageButton`,
6. wywołuje `resetState()`.

Zmiana języka zawsze resetuje pola i wynik.

## Walidacja pól

### `clampValue(value, min, max)`

Zwraca wartość ograniczoną do zakresu `min..max`. Jeżeli `value` jest `NaN`, zwraca `min`.

### `sanitizeField(input)`

1. Parsuje wartość pola jako liczbę całkowitą.
2. Ogranicza ją do zakresu `1..99`.
3. Nadpisuje wartość pola oczyszczoną liczbą.
4. Zwraca oczyszczoną wartość.

### `syncPoolAndWrath()`

1. Oczyszcza `#pool`.
2. Oczyszcza `#wrath`.
3. Jeżeli `wrath > pool`, ustawia `wrath = pool`.
4. Zwraca `{ pool, wrath }`.

Dzięki temu liczba Kości Furii nigdy nie przekracza Puli Kości.

## Funkcje renderujące kości

### `createDieElement(isWrath)`

Tworzy element `.die`. Jeżeli `isWrath` jest prawdziwe, kość dostaje klasę `red`. W przeciwnym razie dostaje klasę `white`.

Funkcja dodaje `.die__question` oraz siedem `.pip`.

### `setDieFace(die, value)`

Usuwa klasy `face-1` do `face-6`, a następnie dodaje klasę odpowiadającą finalnemu wynikowi kości.

## Losowanie i punktacja

`rollDie()` zwraca losową liczbę całkowitą od 1 do 6:

```js
Math.floor(Math.random() * 6) + 1
```

`scoreValue(value)` przelicza wynik kości na punkty sukcesu:

| Wynik | Punkty |
| --- | --- |
| `1..3` | `0` |
| `4..5` | `1` |
| `6` | `2` |

## Główna logika rzutu

Funkcja `handleRoll()` wykonuje pełny przebieg rzutu:

1. Oczyszcza `#difficulty`.
2. Synchronizuje `#pool` i `#wrath`.
3. Czyści `#dice`.
4. Ustawia w `#summary` komunikat `Rzut w toku...` / `Rolling the dice...`.
5. Tworzy tyle elementów kości, ile wynosi `pool`.
6. Pierwsze `wrath` kości oznacza jako czerwone.
7. Dodaje każdej kości klasę `rolling`.
8. Ustawia tymczasowe ściany kości.
9. Losuje finalne wyniki do tablicy `results`.
10. Po `ROLL_DURATION` usuwa klasę `rolling`.
11. Ustawia finalne ściany kości.
12. Sumuje punkty sukcesu.
13. Sprawdza sukces przez `totalPoints >= difficulty`.
14. Analizuje kości Furii.
15. Oblicza możliwe Przeniesienie.
16. Wywołuje `buildSummary(...)`.

## Logika Kości Furii

Kości Furii to pierwsze `wrath` wyników z tablicy `results`:

```js
const wrathResults = results.slice(0, wrath);
```

Logika:

1. Jeżeli istnieją Kości Furii i wszystkie mają wynik `6`, pojawia się `Krytyczna Furia` / `Wrath Critical`.
2. W przeciwnym razie, jeżeli którakolwiek Kość Furii ma wynik `1`, pojawia się `Komplikacja Furii` / `Wrath Complication`.
3. W innych przypadkach `wrathMessage` pozostaje pusty.

## Logika Przeniesienia

Przeniesienie jest liczone tylko przy sukcesie.

```js
const totalSixes = results.filter((value) => value === 6).length;
const margin = totalPoints - difficulty;
const transferable = success
  ? Math.min(totalSixes, Math.floor(margin / 2))
  : 0;
```

Oznacza to, że możliwe Przeniesienie jest ograniczone zarówno liczbą wszystkich szóstek, jak i nadwyżką punktów ponad Stopień Trudności.

## Podsumowanie wyniku

`buildSummary(...)` czyści `#summary` i tworzy:

- nagłówek `Sukces!` albo `Porażka!`,
- opcjonalny komunikat Furii,
- opcjonalny komunikat Przeniesienia,
- szczegóły punktów i Stopnia Trudności,
- listę wyników każdej kości.

Lista kości ma format:

```text
Kość 1: 6 (punkty 2)
```

albo w wersji EN:

```text
Die 1: 6 (points 2)
```

## Reset stanu

`resetState()`:

1. ustawia pola na wartości domyślne,
2. czyści `#dice`,
3. wstawia placeholder do `#summary`.

Reset jest wykonywany przy zmianie języka.

## Event listenery

| Element | Zdarzenie | Reakcja |
| --- | --- | --- |
| `#difficulty` | `change`, `blur` | Oczyszcza wartość do zakresu `1..99`. |
| `#pool` | `change`, `blur` | Oczyszcza wartość i synchronizuje Kości Furii. |
| `#wrath` | `change`, `blur` | Oczyszcza wartość i synchronizuje z Pulą Kości. |
| `#roll` | `click` | Uruchamia `handleRoll()`. |
| `#languageSelect` | `change` | Uruchamia `updateLanguage(...)`. |

## Inicjalizacja

Na końcu `script.js` wykonywane jest:

```js
updateLanguage(currentLanguage);
```

Początkowa wartość:

```js
let currentLanguage = "pl";
```

## Fallbacki i ograniczenia

| Sytuacja | Zachowanie |
| --- | --- |
| Puste albo niepoprawne pole | Wartość zostaje ustawiona na `1`. |
| Wartość poniżej `1` | Wartość zostaje ustawiona na `1`. |
| Wartość powyżej `99` | Wartość zostaje ustawiona na `99`. |
| `wrath > pool` | `wrath` zostaje zmniejszone do wartości `pool`. |
| Zmiana języka | Wynik zostaje wyczyszczony, pola wracają do wartości domyślnych. |
| Brak zapisu historii | Wyniki istnieją tylko w DOM do czasu resetu lub odświeżenia. |

## Procedura odtworzenia modułu

1. Utwórz `DiceRoller/index.html`.
2. Dodaj kontener `.app`.
3. Dodaj `.language-switcher` z `#languageSelect` i `#mainPageButton`.
4. Dodaj nagłówek z `#pageTitle` i `#subtitle`.
5. Dodaj panel `.panel` z polami `#difficulty`, `#pool`, `#wrath`.
6. Dodaj przycisk `#roll`.
7. Dodaj sekcję `.results` z `#dice` i `#summary`.
8. Utwórz `style.css` z motywem terminalowym, stylem kości i animacją `roll`.
9. Utwórz `script.js`.
10. Zdefiniuj stałe zakresów, wartości domyślnych i czasu animacji.
11. Zdefiniuj `translations.pl` i `translations.en`.
12. Zaimplementuj walidację pól.
13. Zaimplementuj tworzenie kości i ustawianie ścian.
14. Zaimplementuj losowanie i punktację.
15. Zaimplementuj logikę Furii i Przeniesienia.
16. Zaimplementuj `buildSummary`.
17. Podepnij event listenery.
18. Uruchom testy kontrolne.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start modułu | Otwórz `DiceRoller/index.html`. | Widoczne są pola startowe i placeholder podsumowania. |
| Prosty rzut | Kliknij `Rzuć Kośćmi!`. | Pojawiają się kości, animacja i podsumowanie. |
| Zakres pól | Wpisz `0`, liczbę ujemną albo tekst i opuść pole. | Pole zostaje ustawione na wartość z zakresu, minimum `1`. |
| Maksimum pól | Wpisz wartość większą niż `99`. | Pole zostaje ustawione na `99`. |
| Synchronizacja Furii | Ustaw `Pula Kości = 2`, `Ilość Kości Furii = 9`. | Liczba Kości Furii spada do `2`. |
| Zmiana języka | Zmień język w selektorze. | Teksty zmieniają język, wynik zostaje wyczyszczony. |
| Kości czerwone | Ustaw kilka Kości Furii. | Pierwsze kości w puli są czerwone. |
| Przycisk strony głównej | Kliknij `Strona Główna`. | Przeglądarka otwiera `../Main/index.html`. |

---

# 🇬🇧 Technical documentation — DiceRoller (EN)

## Module purpose

`DiceRoller` is a static frontend module for resolving Wrath & Glory dice tests.

The module is responsible for:

- reading Difficulty Number, Dice Pool, and Wrath Dice count from the user,
- validating and clamping field values,
- rendering white and red dice,
- animating the roll,
- rolling results from `1..6`,
- converting dice into success points,
- determining success or failure,
- detecting Wrath Complication or Wrath Critical,
- calculating possible Shift,
- displaying the summary in PL or EN.

The module runs entirely in the browser.

## Entry points

Main module file:

```text
DiceRoller/index.html
```

The file loads:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

## Operating modes

The module has one user mode.

It has no admin mode, login, Firebase, backend, roll history saving, data import, or data export.

Interface language is selected through `#languageSelect`.

## File structure

| File | Role |
| --- | --- |
| `DiceRoller/index.html` | View structure: language selector, return button, fields, roll button, and results. |
| `DiceRoller/style.css` | Terminal theme, layout, field styles, button styles, dice styles, animation, and result panel. |
| `DiceRoller/script.js` | Constants, translations, validation, rolling, dice rendering, result logic, and event listeners. |
| `DiceRoller/docs/README.md` | PL/EN user guide. |
| `DiceRoller/docs/Documentation.md` | This PL/EN technical documentation. |

## Dependencies

The module uses only standard browser APIs:

- DOM API,
- `Math.random`,
- `setTimeout`,
- CSS animations.

The module does not use Firebase, Firestore, Realtime Database, `localStorage`, `sessionStorage`, external JavaScript libraries, or frontend frameworks.

## HTML structure

Main container:

```html
<main class="app">
  ...
</main>
```

Important DOM elements:

| Element | Role |
| --- | --- |
| `.app` | Main application card. |
| `.language-switcher` | Container for language selector and main page link. |
| `#languageSelect` | `pl` / `en` language selector. |
| `#mainPageButton` | Link to `../Main/index.html`. |
| `#pageTitle` | Module title. |
| `#subtitle` | Module subtitle. |
| `.panel` | Grid containing input fields and roll button. |
| `#difficulty` | Difficulty Number field. |
| `#pool` | Dice Pool field. |
| `#wrath` | Wrath Dice count field. |
| `#wrathHint` | Hint for Wrath Dice field. |
| `#roll` | Roll button. |
| `.results` | Result section. |
| `#dice` | Rendered dice container. |
| `#summary` | Test summary container. |

## CSS structure

Theme variables define the dark green terminal style, black panel, green borders and text, muted text, glow, dice colors, and responsive sizing.

Global font stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

Important layout rules:

- `body` centers the module vertically and horizontally,
- `.app` uses `width: min(860px, 100%)`, black background, green border, and glow,
- `.language-switcher` is absolutely positioned in the top-right corner,
- `.panel` uses `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`,
- `.dice` uses `flex-wrap` so dice wrap across rows,
- at widths up to `600px`, the language switcher becomes static and dice shrink from `68px` to `58px`.

## Dice rendering

Each die is dynamically created as `.die.white` or `.die.red` with one `.die__question` element and seven `.pip` elements.

Classes `face-1` to `face-6` control visible pips. Class `rolling` starts the `roll` animation, hides pips, and shows the question mark.

## JavaScript constants

| Constant | Value | Meaning |
| --- | --- | --- |
| `MIN_VALUE` | `1` | Minimum numeric field value. |
| `MAX_VALUE` | `99` | Maximum numeric field value. |
| `DEFAULT_DIFFICULTY` | `3` | Default Difficulty Number. |
| `DEFAULT_POOL` | `2` | Default Dice Pool. |
| `DEFAULT_WRATH` | `1` | Default Wrath Dice count. |
| `ROLL_DURATION` | `900` | Delay before final result is shown. |

## i18n layer

The `translations` object has `pl` and `en` keys. Each language contains `labels` for the interface and `messages` for the summary.

`updateLanguage(lang)` sets the current language, updates `document.documentElement.lang`, updates all visible labels, updates `#mainPageButton`, and calls `resetState()`.

Changing language always resets fields and result.

## Field validation

`clampValue(value, min, max)` returns a value clamped to the `min..max` range. If `value` is `NaN`, it returns `min`.

`sanitizeField(input)` parses an input value as an integer, clamps it to `1..99`, writes it back to the field, and returns it.

`syncPoolAndWrath()` sanitizes `#pool` and `#wrath`, then lowers `wrath` to `pool` when `wrath > pool`.

## Rolling and scoring

`rollDie()` returns a random integer from 1 to 6:

```js
Math.floor(Math.random() * 6) + 1
```

`scoreValue(value)` converts dice into points:

| Result | Points |
| --- | --- |
| `1..3` | `0` |
| `4..5` | `1` |
| `6` | `2` |

## Main roll logic

`handleRoll()` sanitizes fields, creates die elements, marks first `wrath` dice as red, starts animation, rolls final results, waits `ROLL_DURATION`, sets final die faces, sums success points, checks success, analyzes Wrath Dice, calculates Shift, and calls `buildSummary(...)`.

## Wrath Dice logic

Wrath Dice are the first `wrath` results:

```js
const wrathResults = results.slice(0, wrath);
```

If all Wrath Dice are `6`, the module shows `Wrath Critical`. Otherwise, if any Wrath Die is `1`, it shows `Wrath Complication`.

## Shift logic

Shift is calculated only on success:

```js
const totalSixes = results.filter((value) => value === 6).length;
const margin = totalPoints - difficulty;
const transferable = success
  ? Math.min(totalSixes, Math.floor(margin / 2))
  : 0;
```

The result is limited by both the number of all sixes and the point margin above Difficulty Number.

## Result summary

`buildSummary(...)` clears `#summary` and creates a success/failure heading, optional Wrath message, optional Shift message, point details, and a list of every die result.

## Event listeners

| Element | Event | Reaction |
| --- | --- | --- |
| `#difficulty` | `change`, `blur` | Sanitizes value to `1..99`. |
| `#pool` | `change`, `blur` | Sanitizes value and synchronizes Wrath Dice. |
| `#wrath` | `change`, `blur` | Sanitizes value and synchronizes with Dice Pool. |
| `#roll` | `click` | Runs `handleRoll()`. |
| `#languageSelect` | `change` | Runs `updateLanguage(...)`. |

## Module reconstruction procedure

1. Create `DiceRoller/index.html`.
2. Add `.app`, `.language-switcher`, `#languageSelect`, `#mainPageButton`, inputs, `#roll`, `#dice`, and `#summary`.
3. Create `style.css` with terminal theme, die styles, and the `roll` animation.
4. Create `script.js` with constants, translations, validation, die rendering, rolling, scoring, Wrath logic, Shift logic, summary rendering, and event listeners.
5. Run control tests.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Module start | Open `DiceRoller/index.html`. | Starting fields and summary placeholder are visible. |
| Simple roll | Click `Roll the dice!`. | Dice, animation, and summary appear. |
| Field range | Enter `0`, a negative number, or text and leave the field. | Field is set to a valid value, minimum `1`. |
| Field maximum | Enter a value greater than `99`. | Field is set to `99`. |
| Wrath synchronization | Set `Dice Pool = 2`, `Number of Wrath Dice = 9`. | Wrath Dice count drops to `2`. |
| Language change | Change language in the selector. | Text changes language and result is cleared. |
| Red dice | Set multiple Wrath Dice. | First dice in the pool are red. |
| Main page button | Click `Main Page`. | Browser opens `../Main/index.html`. |

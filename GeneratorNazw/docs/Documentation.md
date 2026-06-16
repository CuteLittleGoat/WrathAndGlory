# 🇵🇱 Dokumentacja techniczna — Generator Nazw (PL)

## Cel modułu

`GeneratorNazw` jest statycznym modułem frontendowym generującym nazwy w klimacie Warhammer 40,000.

Moduł odpowiada za:

- prezentację formularza wyboru kategorii i opcji,
- generowanie listy nazw na podstawie zestawów segmentów słowotwórczych,
- obsługę zwykłego losowania i powtarzalnego losowania z seedem,
- renderowanie wyników jako listy tekstowej,
- kopiowanie wyników do schowka,
- podstawową obsługę PL/EN w kodzie.

Moduł nie ma backendu, nie używa Firebase i nie zapisuje danych użytkownika.

## Punkty wejścia

Główny plik modułu:

```text
GeneratorNazw/index.html
```

Plik ładuje:

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

## Tryby działania

Moduł ma jeden tryb użytkownika.

Nie posiada:

- trybu admina,
- logowania,
- zapisu stanu,
- importu danych,
- eksportu plików,
- integracji Firebase.

W kodzie istnieje przełącznik języka `#languageSelect`, ale jego kontener ma klasę `language-switcher--hidden`, więc przełącznik jest ukryty w interfejsie.

## Struktura plików

| Plik | Rola |
| --- | --- |
| `GeneratorNazw/index.html` | Struktura interfejsu: formularz, przyciski, pole wyników, ukryty przełącznik języka. |
| `GeneratorNazw/style.css` | Motyw terminalowy, layout formularza, style pól, przycisków i wyników. |
| `GeneratorNazw/script.js` | RNG, dane generatorów, funkcje generujące nazwy, obsługa UI i kopiowania. |
| `GeneratorNazw/docs/README.md` | Instrukcja użytkownika PL/EN. |
| `GeneratorNazw/docs/Documentation.md` | Niniejsza dokumentacja techniczna PL/EN. |
| `GeneratorNazw/docs/Logika.md` | Dodatkowy opis logiki segmentów i składania nazw. |

## Zależności

Moduł korzysta wyłącznie ze standardowych API przeglądarki:

- DOM API,
- `crypto.getRandomValues`,
- `navigator.clipboard`,
- `setTimeout`.

Moduł nie używa:

- Firebase,
- Firestore,
- Realtime Database,
- SheetJS,
- JSZip,
- zewnętrznych frameworków,
- `localStorage`,
- `sessionStorage`.

## Struktura HTML

Główny kontener:

```html
<main class="wrap">
  <section class="panel">
    ...
  </section>
</main>
```

Najważniejsze elementy DOM:

| Element | Rola |
| --- | --- |
| `.wrap` | Zewnętrzny kontener szerokości strony. |
| `.panel` | Główna karta generatora. |
| `.language-switcher.language-switcher--hidden` | Ukryty kontener przełącznika języka. |
| `#languageSelect` | Selektor języka, obecnie niewidoczny przez CSS. |
| `.grid` | Siatka pól formularza. |
| `#cat` | Lista kategorii. |
| `#opt` | Lista opcji zależna od kategorii. |
| `#seed` | Pole seeda. |
| `#count` | Liczba wyników, `min=1`, `max=20`, wartość startowa `10`. |
| `#gen` | Przycisk generowania. |
| `#copy` | Przycisk kopiowania wyniku. |
| `#modePill` | Znacznik trybu losowania. |
| `#res` | Kontener wyników. |
| `#seedHint` | Podpowiedź wyjaśniająca seed. |

## Struktura CSS

### Zmienne motywu

W `:root` zdefiniowano:

| Zmienna | Znaczenie |
| --- | --- |
| `--bg` | Ciemnozielone tło bazowe. |
| `--bg-grad` | Tło z radialnymi poświatami. |
| `--panel` | Czarne tło panelu. |
| `--panel-soft` | Półprzezroczyste zielone tło pól i przycisków. |
| `--text` | Główny kolor tekstu. |
| `--muted` | Przygaszony tekst pomocniczy. |
| `--border` | Zielone obramowania. |
| `--accent` | Główny akcent. |
| `--accent-dark` | Ciemniejszy akcent focus. |
| `--glow` | Zielona poświata panelu. |
| `--divider` | Kolor separatorów. |

### Fonty

Globalny font-stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

### Layout

Najważniejsze reguły:

- `body` ma tło `--bg-grad`, kolor `--text`, `line-height: 1.45` i lekki `letter-spacing`.
- `.wrap` ma szerokość `min(1100px, 100%)`, automatyczne wyśrodkowanie i padding.
- `.panel` ma czarne tło, zieloną ramkę, zaokrąglenie `12px` i poświatę `--glow`.
- `.grid` ma układ `1.2fr 1fr 1fr 140px`.
- Przy szerokości do `960px` `.grid` przechodzi na jedną kolumnę.
- `.row` układa przyciski i znacznik trybu w elastyczny rząd.
- `.results` używa `white-space: pre-wrap`, aby zachować podziały linii.

### Ukrycie przełącznika języka

Przełącznik języka jest ukrywany przez:

```css
.language-switcher--hidden {
  display: none !important;
}
```

Usunięcie tej klasy z HTML ponownie pokaże selektor języka.

## Dane generatora

Główna tablica danych to `DATA`.

Każdy element `DATA` ma strukturę:

```js
{
  key: "klucz_kategorii",
  name: "Nazwa PL",
  nameEn: "Name EN",
  options: [
    {
      key: "klucz_opcji",
      name: "Opcja PL",
      nameEn: "Option EN",
      gen: (r) => funkcjaGeneratora(r)
    }
  ]
}
```

Aktualne kategorie:

| `key` | Nazwa PL | Nazwa EN |
| --- | --- | --- |
| `humans` | `Imperium – Ludzie` | `Imperium - Humans` |
| `aeldari` | `Aeldari` | `Aeldari` |
| `necron` | `Necroni` | `Necrons` |
| `orks` | `Orkowie` | `Orks` |
| `sororitas` | `Adepta Sororitas` | `Adepta Sororitas` |
| `astartes` | `Astartes – imię i nazwisko bojowe` | `Astartes - battle name and surname` |
| `admech` | `Adeptus Mechanicus` | `Adeptus Mechanicus` |
| `chaos` | `Chaos` | `Chaos` |
| `warmachines` | `Maszyny bojowe (Imperium)` | `War machines (Imperium)` |
| `ships` | `Okręty gwiezdne` | `Starships` |
| `unitcodes` | `Kryptonimy oddziałów` | `Unit codenames` |
| `opcodes` | `Kryptonimy operacji` | `Operation codenames` |

## RNG i seed

Moduł ma dwa tryby losowania.

### Losowanie z seedem

Jeżeli `#seed` zawiera niepusty tekst:

1. `makeRng(seedStr)` przycina tekst przez `trim()`.
2. `xfnv1a()` zamienia tekst na 32-bitowy seed.
3. `mulberry32()` tworzy deterministyczną funkcję losującą.
4. Funkcja zwraca `{ rand, mode: "seed" }`.

Efekt: ten sam seed i te same ustawienia zwracają tę samą sekwencję wyników.

### Losowanie bez seeda

Jeżeli `#seed` jest puste:

1. `makeRng()` używa `cryptoRand`.
2. `cryptoRand()` pobiera losową wartość przez `crypto.getRandomValues`.
3. Funkcja zwraca `{ rand: cryptoRand, mode: "auto" }`.

Efekt: wynik nie jest deterministyczny.

## Najważniejsze funkcje pomocnicze

| Funkcja | Rola |
| --- | --- |
| `xfnv1a(str)` | Tworzy 32-bitowy hash tekstu seeda. |
| `mulberry32(a)` | Tworzy deterministyczny generator liczb pseudolosowych. |
| `cryptoRand()` | Zwraca losową wartość z `crypto.getRandomValues`. |
| `makeRng(seedStr)` | Wybiera RNG seedowany albo automatyczny. |
| `chance(p, rand)` | Zwraca prawdę z prawdopodobieństwem `p`. |
| `cap(s)` | Zmienia pierwszą literę tekstu na wielką. |
| `cleanName(s)` | Usuwa niechciane cudzysłowy, nawiasy, nadmiar spacji i błędne odstępy. |
| `pick(arr, rand)` | Losuje element tablicy. |
| `pickWeighted(arr, rand)` | Losuje z tablicy zwykłej albo ważonej `{ v, w }`. |
| `rollInt(min, max, rand)` | Losuje liczbę całkowitą z zakresu domkniętego. |
| `isVowel(ch)` | Sprawdza, czy znak jest samogłoską. |
| `tidySegmentBoundary(a, b)` | Wygładza styk segmentów nazwy. |
| `phoneticPolish(s)` | Redukuje wybrane niezgrabne zbitki liter. |
| `buildName(parts)` | Składa nazwę z segmentów i wygładza granice. |
| `looksGood(s)` | Odrzuca zbyt krótkie albo bardzo niezgrabne wyniki. |
| `tryGenerate(fn, rand, tries)` | Próbuje wygenerować poprawny wariant, domyślnie do 8 razy. |
| `formatWithTitle(core, titles, rand, chanceValue)` | Opcjonalnie dodaje tytuł do nazwy. |
| `formatNamedThing(classifier, core)` | Tworzy format `Klasyfikator "Nazwa"`. |

## Generatory domenowe

Funkcje generatorów korzystają z tablic segmentów, rdzeni, tytułów i klasyfikatorów.

Przykładowe grupy generatorów:

- ludzie Imperium,
- Aeldari,
- Necroni,
- Orkowie,
- Sororitas,
- Astartes,
- Adeptus Mechanicus,
- Chaos,
- maszyny bojowe,
- okręty,
- kryptonimy oddziałów,
- kryptonimy operacji.

Każda opcja w `DATA` wskazuje konkretną funkcję `gen`.

## Warstwa i18n

Obiekt `translations` ma klucze:

```js
translations.pl
translations.en
```

Każdy język zawiera `labels`, między innymi:

- `languageSelect`,
- `category`,
- `option`,
- `seed`,
- `count`,
- `generate`,
- `copy`,
- `randomAuto`,
- `randomSeed`,
- `resultsPlaceholder`,
- `seedHint`,
- `seedPlaceholder`,
- `copiedSuffix`,
- `copyError`.

Funkcja `applyLanguage(lang)`:

1. ustawia `currentLanguage`,
2. ustawia `document.documentElement.lang`,
3. aktualizuje etykiety pól,
4. aktualizuje przyciski,
5. aktualizuje placeholder seeda,
6. aktualizuje tekst podpowiedzi,
7. odtwarza listę kategorii i opcji w aktualnym języku,
8. zachowuje wybraną kategorię i opcję, o ile nadal istnieją.

## Obsługa UI

### `populateCats()`

Czyści `#cat` i tworzy elementy `option` na podstawie tablicy `DATA`.

Tekst opcji pochodzi z `getLocalizedName`.

### `populateOpts()`

Znajduje aktualną kategorię i tworzy listę opcji w `#opt`.

Jeżeli aktualna kategoria nie zostanie znaleziona, używa pierwszej kategorii z `DATA`.

### `generate()`

Przebieg:

1. Znajduje wybraną kategorię.
2. Znajduje wybraną opcję.
3. Tworzy RNG przez `makeRng(seedEl.value)`.
4. Ustawia `#modePill` na `randomAuto` albo `randomSeed`.
5. Parsuje pole `#count`.
6. Wymusza zakres `1..20`.
7. Generuje `n` linii przez `opt.gen(rand)`.
8. Czyści każdą nazwę przez `cleanName`.
9. Renderuje wyniki w `#res` jako tekst rozdzielony `\n`.
10. Ustawia `resEl.dataset.hasResults = "true"`.

### Kopiowanie

Listener przycisku `#copy`:

1. wywołuje `navigator.clipboard.writeText(resEl.textContent)`,
2. po sukcesie dopisuje do `#modePill` komunikat `skopiowano` / `copied`,
3. po `900 ms` przywraca poprzedni tekst,
4. po błędzie pokazuje `alert` z komunikatem `copyError`.

## Event listenery

| Element | Zdarzenie | Reakcja |
| --- | --- | --- |
| `#gen` | `click` | Uruchamia `generate()`. |
| `#copy` | `click` | Kopiuje wyniki do schowka. |
| `#cat` | `change` | Odświeża opcje i generuje wynik. |
| `#opt` | `change` | Generuje wynik. |
| `#languageSelect` | `change` | Zmienia język i generuje wynik. |

## Inicjalizacja

Na końcu `script.js` wykonywane są kroki:

1. `populateCats()`,
2. `populateOpts()`,
3. ustawienie `resEl.dataset.hasResults = "false"`,
4. `applyLanguage(currentLanguage)`,
5. podpięcie listenera zmiany języka.

Początkowy język to:

```js
let currentLanguage = "pl";
```

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Puste pole `Seed` | Używany jest tryb `auto` z `crypto.getRandomValues`. |
| Nieprawidłowa liczba wyników | Wartość jest sprowadzana do minimum 1. |
| Liczba wyników większa niż 20 | Wartość jest ograniczana do 20. |
| Brak dostępu do schowka | Pokazywany jest `alert` z komunikatem o ręcznym kopiowaniu. |
| Brak wcześniejszych wyników | Pole wyników pokazuje placeholder. |

## Procedura odtworzenia modułu

1. Utwórz `GeneratorNazw/index.html`.
2. Dodaj panel `.panel` w kontenerze `.wrap`.
3. Dodaj ukryty `.language-switcher` z `#languageSelect`.
4. Dodaj pola `#cat`, `#opt`, `#seed`, `#count`.
5. Dodaj przyciski `#gen` i `#copy`.
6. Dodaj znacznik `#modePill`.
7. Dodaj kontener wyników `#res` i podpowiedź `#seedHint`.
8. Utwórz `style.css` z motywem terminalowym, gridem i responsywnością.
9. Utwórz `script.js`.
10. Zaimplementuj RNG: `xfnv1a`, `mulberry32`, `cryptoRand`, `makeRng`.
11. Zaimplementuj helpery czyszczenia, losowania i składania nazw.
12. Odtwórz tablice segmentów i funkcje generatorów domenowych.
13. Odtwórz `DATA` z kategoriami i opcjami.
14. Odtwórz obiekt `translations`.
15. Podłącz event listenery.
16. Sprawdź generowanie bez seeda, z seedem, zmianę kategorii, zmianę opcji i kopiowanie.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start modułu | Otwórz `GeneratorNazw/index.html`. | Widoczny jest panel generatora i placeholder wyników. |
| Generowanie bez seeda | Zostaw `Seed` puste i kliknij `Generuj`. | Pojawia się lista nazw, `modePill` pokazuje tryb losowy. |
| Generowanie z seedem | Wpisz seed, ustaw kategorię i kliknij `Generuj`. | Pojawia się powtarzalna lista nazw. |
| Powtarzalność seeda | Użyj tego samego seeda i ustawień po odświeżeniu strony. | Lista wyników jest taka sama. |
| Limit wyników | Wpisz wartość większą niż 20. | Moduł generuje maksymalnie 20 wyników. |
| Zmiana kategorii | Zmień `Kategoria`. | Lista `Opcja` zmienia się i wyniki są generowane ponownie. |
| Kopiowanie | Kliknij `Kopiuj wynik`. | Wyniki trafiają do schowka albo pojawia się komunikat błędu przeglądarki. |
| Ukryty język | Otwórz moduł. | Przełącznik języka nie jest widoczny, bo działa klasa `language-switcher--hidden`. |

---

# 🇬🇧 Technical documentation — Name Generator (EN)

## Module purpose

`GeneratorNazw` is a static frontend module that generates Warhammer 40,000-style names.

The module is responsible for:

- displaying the category and option form,
- generating name lists from word-building segment sets,
- handling normal random generation and repeatable seeded generation,
- rendering results as a text list,
- copying results to the clipboard,
- basic PL/EN support in code.

The module has no backend, does not use Firebase, and does not save user data.

## Entry points

Main module file:

```text
GeneratorNazw/index.html
```

The file loads:

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

## Operating modes

The module has one user mode.

It does not have:

- admin mode,
- login,
- state saving,
- data import,
- file export,
- Firebase integration.

The code contains a `#languageSelect` language selector, but its container has the `language-switcher--hidden` class, so the selector is hidden in the interface.

## File structure

| File | Role |
| --- | --- |
| `GeneratorNazw/index.html` | Interface structure: form, buttons, results area, hidden language selector. |
| `GeneratorNazw/style.css` | Terminal theme, form layout, field, button, and result styles. |
| `GeneratorNazw/script.js` | RNG, generator data, name generator functions, UI wiring, and copying. |
| `GeneratorNazw/docs/README.md` | PL/EN user guide. |
| `GeneratorNazw/docs/Documentation.md` | This PL/EN technical documentation. |
| `GeneratorNazw/docs/Logika.md` | Additional description of segment logic and name composition. |

## Dependencies

The module uses only standard browser APIs:

- DOM API,
- `crypto.getRandomValues`,
- `navigator.clipboard`,
- `setTimeout`.

The module does not use:

- Firebase,
- Firestore,
- Realtime Database,
- SheetJS,
- JSZip,
- external frameworks,
- `localStorage`,
- `sessionStorage`.

## HTML structure

Main container:

```html
<main class="wrap">
  <section class="panel">
    ...
  </section>
</main>
```

Important DOM elements:

| Element | Role |
| --- | --- |
| `.wrap` | Outer page-width container. |
| `.panel` | Main generator card. |
| `.language-switcher.language-switcher--hidden` | Hidden language switcher container. |
| `#languageSelect` | Language selector, currently hidden by CSS. |
| `.grid` | Form field grid. |
| `#cat` | Category select. |
| `#opt` | Option select depending on category. |
| `#seed` | Seed input. |
| `#count` | Result count, `min=1`, `max=20`, starting value `10`. |
| `#gen` | Generate button. |
| `#copy` | Copy result button. |
| `#modePill` | Random mode indicator. |
| `#res` | Result container. |
| `#seedHint` | Seed explanation hint. |

## CSS structure

### Theme variables

Defined in `:root`:

| Variable | Meaning |
| --- | --- |
| `--bg` | Dark green base background. |
| `--bg-grad` | Background with radial glow effects. |
| `--panel` | Black panel background. |
| `--panel-soft` | Semi-transparent green field/button background. |
| `--text` | Main text color. |
| `--muted` | Muted helper text. |
| `--border` | Green borders. |
| `--accent` | Main accent. |
| `--accent-dark` | Darker focus accent. |
| `--glow` | Green panel glow. |
| `--divider` | Divider color. |

### Fonts

Global font stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

### Layout

Important rules:

- `body` uses `--bg-grad`, `--text`, `line-height: 1.45`, and slight `letter-spacing`.
- `.wrap` uses `width: min(1100px, 100%)`, centered margin, and padding.
- `.panel` uses black background, green border, `12px` radius, and `--glow`.
- `.grid` uses `1.2fr 1fr 1fr 140px`.
- At widths up to `960px`, `.grid` switches to one column.
- `.row` lays out buttons and the mode indicator in a flexible row.
- `.results` uses `white-space: pre-wrap` to preserve line breaks.

### Hidden language selector

The language selector is hidden by:

```css
.language-switcher--hidden {
  display: none !important;
}
```

Removing this class from HTML reveals the selector again.

## Generator data

The main data table is `DATA`.

Each `DATA` item has this structure:

```js
{
  key: "category_key",
  name: "Polish name",
  nameEn: "English name",
  options: [
    {
      key: "option_key",
      name: "Polish option",
      nameEn: "English option",
      gen: (r) => generatorFunction(r)
    }
  ]
}
```

Current categories:

| `key` | PL name | EN name |
| --- | --- | --- |
| `humans` | `Imperium – Ludzie` | `Imperium - Humans` |
| `aeldari` | `Aeldari` | `Aeldari` |
| `necron` | `Necroni` | `Necrons` |
| `orks` | `Orkowie` | `Orks` |
| `sororitas` | `Adepta Sororitas` | `Adepta Sororitas` |
| `astartes` | `Astartes – imię i nazwisko bojowe` | `Astartes - battle name and surname` |
| `admech` | `Adeptus Mechanicus` | `Adeptus Mechanicus` |
| `chaos` | `Chaos` | `Chaos` |
| `warmachines` | `Maszyny bojowe (Imperium)` | `War machines (Imperium)` |
| `ships` | `Okręty gwiezdne` | `Starships` |
| `unitcodes` | `Kryptonimy oddziałów` | `Unit codenames` |
| `opcodes` | `Kryptonimy operacji` | `Operation codenames` |

## RNG and seed

The module has two randomization modes.

### Seeded randomization

When `#seed` contains non-empty text:

1. `makeRng(seedStr)` trims the text.
2. `xfnv1a()` converts the text into a 32-bit seed.
3. `mulberry32()` creates a deterministic pseudorandom function.
4. The function returns `{ rand, mode: "seed" }`.

Result: the same seed and the same settings return the same result sequence.

### Randomization without seed

When `#seed` is empty:

1. `makeRng()` uses `cryptoRand`.
2. `cryptoRand()` reads a random value with `crypto.getRandomValues`.
3. The function returns `{ rand: cryptoRand, mode: "auto" }`.

Result: output is not deterministic.

## Important helper functions

| Function | Role |
| --- | --- |
| `xfnv1a(str)` | Creates a 32-bit hash from seed text. |
| `mulberry32(a)` | Creates a deterministic pseudorandom number generator. |
| `cryptoRand()` | Returns a random value from `crypto.getRandomValues`. |
| `makeRng(seedStr)` | Chooses seeded or automatic RNG. |
| `chance(p, rand)` | Returns true with probability `p`. |
| `cap(s)` | Capitalizes the first character. |
| `cleanName(s)` | Removes unwanted quotes, parentheses, extra spaces, and wrong punctuation spacing. |
| `pick(arr, rand)` | Picks an array element. |
| `pickWeighted(arr, rand)` | Picks from a normal or weighted `{ v, w }` array. |
| `rollInt(min, max, rand)` | Returns an integer in an inclusive range. |
| `isVowel(ch)` | Checks whether a character is a vowel. |
| `tidySegmentBoundary(a, b)` | Smooths the boundary between name segments. |
| `phoneticPolish(s)` | Reduces selected awkward letter clusters. |
| `buildName(parts)` | Builds a name from segments and smooths boundaries. |
| `looksGood(s)` | Rejects too-short or very awkward results. |
| `tryGenerate(fn, rand, tries)` | Attempts to generate an acceptable variant, by default up to 8 times. |
| `formatWithTitle(core, titles, rand, chanceValue)` | Optionally adds a title before a name. |
| `formatNamedThing(classifier, core)` | Creates `Classifier "Name"` format. |

## Domain generators

Generator functions use arrays of segments, roots, titles, and classifiers.

Main generator groups include:

- Imperial humans,
- Aeldari,
- Necrons,
- Orks,
- Sororitas,
- Astartes,
- Adeptus Mechanicus,
- Chaos,
- war machines,
- ships,
- unit codenames,
- operation codenames.

Each option in `DATA` points to a specific `gen` function.

## i18n layer

The `translations` object has these keys:

```js
translations.pl
translations.en
```

Each language contains `labels`, including:

- `languageSelect`,
- `category`,
- `option`,
- `seed`,
- `count`,
- `generate`,
- `copy`,
- `randomAuto`,
- `randomSeed`,
- `resultsPlaceholder`,
- `seedHint`,
- `seedPlaceholder`,
- `copiedSuffix`,
- `copyError`.

`applyLanguage(lang)`:

1. sets `currentLanguage`,
2. sets `document.documentElement.lang`,
3. updates field labels,
4. updates buttons,
5. updates the seed placeholder,
6. updates the seed hint,
7. rebuilds the category and option lists in the active language,
8. preserves the selected category and option when still available.

## UI wiring

### `populateCats()`

Clears `#cat` and creates `option` elements from `DATA`.

Option text comes from `getLocalizedName`.

### `populateOpts()`

Findes the current category and creates the option list in `#opt`.

If the current category is not found, it uses the first category from `DATA`.

### `generate()`

Flow:

1. Finds the selected category.
2. Finds the selected option.
3. Creates RNG through `makeRng(seedEl.value)`.
4. Sets `#modePill` to `randomAuto` or `randomSeed`.
5. Parses `#count`.
6. Enforces the `1..20` range.
7. Generates `n` lines through `opt.gen(rand)`.
8. Cleans every name through `cleanName`.
9. Renders results in `#res` as text separated by `\n`.
10. Sets `resEl.dataset.hasResults = "true"`.

### Copying

The `#copy` listener:

1. calls `navigator.clipboard.writeText(resEl.textContent)`,
2. on success appends `skopiowano` / `copied` to `#modePill`,
3. after `900 ms` restores the previous text,
4. on error displays an `alert` with `copyError`.

## Event listeners

| Element | Event | Reaction |
| --- | --- | --- |
| `#gen` | `click` | Runs `generate()`. |
| `#copy` | `click` | Copies results to the clipboard. |
| `#cat` | `change` | Rebuilds options and generates a result. |
| `#opt` | `change` | Generates a result. |
| `#languageSelect` | `change` | Changes language and generates a result. |

## Initialization

At the end of `script.js`, the module runs:

1. `populateCats()`,
2. `populateOpts()`,
3. `resEl.dataset.hasResults = "false"`,
4. `applyLanguage(currentLanguage)`,
5. language change listener setup.

Initial language:

```js
let currentLanguage = "pl";
```

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Empty `Seed` field | Uses `auto` mode with `crypto.getRandomValues`. |
| Invalid result count | Value is reduced to minimum 1. |
| Result count greater than 20 | Value is capped at 20. |
| Clipboard unavailable | Shows an `alert` with manual copy instructions. |
| No previous results | Result field shows the placeholder. |

## Module reconstruction procedure

1. Create `GeneratorNazw/index.html`.
2. Add `.panel` inside `.wrap`.
3. Add hidden `.language-switcher` with `#languageSelect`.
4. Add `#cat`, `#opt`, `#seed`, and `#count`.
5. Add `#gen` and `#copy`.
6. Add `#modePill`.
7. Add `#res` and `#seedHint`.
8. Create `style.css` with the terminal theme, grid, and responsive rules.
9. Create `script.js`.
10. Implement RNG: `xfnv1a`, `mulberry32`, `cryptoRand`, `makeRng`.
11. Implement helpers for cleaning, picking, and name composition.
12. Recreate segment arrays and domain generator functions.
13. Recreate `DATA` with categories and options.
14. Recreate the `translations` object.
15. Attach event listeners.
16. Test generation without seed, with seed, category changes, option changes, and copying.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Module start | Open `GeneratorNazw/index.html`. | Generator panel and result placeholder are visible. |
| Generate without seed | Leave `Seed` empty and click `Generate`. | A name list appears and `modePill` shows random mode. |
| Generate with seed | Enter a seed, choose settings, and click `Generate`. | A repeatable name list appears. |
| Seed repeatability | Use the same seed and settings after page refresh. | The result list is the same. |
| Result limit | Enter a value greater than 20. | The module generates no more than 20 results. |
| Category change | Change `Category`. | The `Option` list changes and results regenerate. |
| Copying | Click `Copy result`. | Results go to the clipboard or a browser error message appears. |
| Hidden language selector | Open the module. | The language selector is not visible because `language-switcher--hidden` is active. |

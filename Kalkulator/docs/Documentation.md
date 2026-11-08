# 🇵🇱 Dokumentacja techniczna — Kalkulator (PL)

## Cel modułu

`Kalkulator` jest zestawem statycznych narzędzi HTML/CSS/JS do planowania rozwoju i tworzenia postaci w systemie `Wrath & Glory`.

Moduł składa się ze strony startowej oraz narzędzi otwieranych przyciskami:

- strony startowej `index.html`,
- kalkulatora kosztów PD `KalkulatorXP.html`,
- prostego kreatora postaci `TworzeniePostaci.html`,
- zaawansowanego kreatora postaci `TworzeniePostaci_v2.html`.

Większość logiki działa lokalnie w przeglądarce. Firebase Firestore służy do zapisu i wczytywania stanu postaci w obu kreatorach: `TworzeniePostaci.html` używa dokumentu `character_builder/current`, a `TworzeniePostaci_v2.html` dokumentu `character_builder/v2`.

Zaawansowany kreator ma osobną, pełną dokumentację techniczną w `docs/Documentation_v2.md`. Ten plik opisuje stronę startową, Kalkulator PD, Prosty Kreator Postaci oraz to, co oba kreatory mają wspólne.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `Kalkulator/index.html` | Strona startowa `Kozie Liczydła`. Prowadzi do kalkulatora PD, prostego kreatora postaci i zaawansowanego kreatora postaci. |
| `Kalkulator/KalkulatorXP.html` | Prosty kalkulator kosztów rozwoju atrybutów i umiejętności. |
| `Kalkulator/TworzeniePostaci.html` | Prosty kreator postaci z pulą PD, atrybutami, umiejętnościami, talentami, walidacją i zapisem Firebase. |
| `Kalkulator/TworzeniePostaci_v2.html` | Zaawansowany kreator postaci: pula PD, atrybuty, umiejętności, talenty z dodawanymi wierszami, zasady specjalne, cechy pochodne, eksport PDF i zapis Firebase. Szczegóły w `docs/Documentation_v2.md`. |

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `index.html` | Landing modułu, logo, linki do narzędzi i sekretny overlay z GIF-em. |
| `KalkulatorXP.html` | Kalkulator kosztów PD dla aktualnych i docelowych wartości. |
| `TworzeniePostaci.html` | Prosty kreator postaci i zapis/wczytanie stanu z Firestore. |
| `TworzeniePostaci_v2.html` | Widok zaawansowanego kreatora postaci: struktura strony, modale i style lokalne. |
| `TworzeniePostaci_v2-core.js` | Rdzeń zaawansowanego kreatora: tabele, koszty PD, Drzewo Nauki, cechy pochodne, API `window.WNGCreatorV2`. |
| `TworzeniePostaci_v2-firebase.js` | Zapis i odczyt zaawansowanego kreatora w `character_builder/v2`. |
| `TworzeniePostaci_v2-pdf.js` | Eksport karty postaci do PDF. |
| `pdf/pl.pdf` | Szablon polskiej karty postaci dla eksportu PDF. |
| `docs/Documentation_v2.md` | Dokumentacja techniczna zaawansowanego kreatora. |
| `kalkulatorxp.css` | Wspólny styl używany przez `KalkulatorXP.html` oraz bazowo przez `TworzeniePostaci.html`. |
| `config/firebase-config.js` | Konfiguracja Firebase dla `TworzeniePostaci.html`. |
| `config/FirebaseREADME.md` | Instrukcja konfiguracji Firebase dla zapisu postaci. |
| `HowToUse/pl.pdf` | Polska instrukcja otwierana z arkusza tworzenia postaci. |
| `HowToUse/en.pdf` | Angielska instrukcja otwierana z arkusza tworzenia postaci. |
| `Skull.png` | Logo strony startowej. |
| `Koza.gif` | Grafika używana w sekretnym overlayu strony startowej. |
| `Modal_Icon.png` | Ilustracja modali potwierdzeń w `TworzeniePostaci.html`. |
| `docs/README.md` | Instrukcja użytkownika. |
| `docs/Documentation.md` | Niniejsza dokumentacja techniczna. |

## Zależności zewnętrzne

Widoki `index.html` i `KalkulatorXP.html` nie wymagają zewnętrznych bibliotek JavaScript.

`TworzeniePostaci.html` używa Firebase w trybie zgodnościowym (compat), w wersji **12.6.0**:

- `firebase-app-compat.js`,
- `firebase-firestore-compat.js`,
- `firebase-app-check-compat.js`.

Do tego:

- `../shared/appcheck-config.js` — klucze witryny App Check dla obu projektów Firebase,
- `https://www.google.com/recaptcha/enterprise.js` — biblioteka reCAPTCHA Enterprise,
- `../shared/firebase-app-check-compat.js` — wspólne uruchamianie App Check.

Nazwy plików biblioteki **muszą** kończyć się na `-compat`. Od wersji 9 plik `firebase-app.js` jest
plikiem modułowym i wczytany zwykłym znacznikiem `<script>` zgłasza `SyntaxError`, przez co obiekt
`firebase` w ogóle nie powstaje, a przyciski zapisu i wczytania postaci przestają cokolwiek robić.

Konfiguracja Firebase jest ładowana z:

```text
Kalkulator/config/firebase-config.js
```

Moduł używa lokalnego stosu fontów:

```text
Consolas, Fira Code, Source Code Pro, monospace
```

## Widok `index.html`

`index.html` jest stroną startową modułu.

Główne elementy:

| Element | Rola |
| --- | --- |
| `Skull.png` | Logo startowe. |
| Link `Kalkulator PD` | Prowadzi do `KalkulatorXP.html`. |
| Link `Prosty Kreator Postaci` | Prowadzi do `TworzeniePostaci.html` i znajduje się w prawej kolumnie pierwszego wiersza. |
| Link `Zaawansowany Kreator Postaci` | Prowadzi do `TworzeniePostaci_v2.html` i znajduje się bezpośrednio pod prostym kreatorem. |
| `secretButton` | Otwiera sekretny overlay. |
| `secretOverlay` | Pełnoekranowa nakładka z `Koza.gif`. |
| `secretCloseButton` | Zamyka overlay. |

Logika strony startowej jest minimalna. Funkcja `toggleSecretOverlay(forceOpen)` przełącza klasę `is-open` i aktualizuje `aria-hidden`.

Overlay można zamknąć:

- przyciskiem `Zamknij`,
- kliknięciem tła poza dialogiem,
- klawiszem `Escape`.

Siatka kafelków `.actions` używa zapisu `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`. Człon
`min(220px, 100%)` jest konieczny: samo `minmax(220px, 1fr)` nie potrafi zejść poniżej 220 px, więc
przy 320 px ekranu kolumna wychodziła poza swój pojemnik o 16 px. Od 360 px w górę oba zapisy dają
identyczny układ.

## Widok `KalkulatorXP.html`

`KalkulatorXP.html` służy do szybkiego obliczenia kosztu PD między wartością aktualną i docelową.

Główne elementy UI:

| Element | ID | Rola |
| --- | --- | --- |
| Przełącznik języka | `languageSelect` | Przełącza teksty PL/EN. Ukryty klasą `language-switcher--hidden`. |
| Strona Główna | `btnMainPage` | Link do `../Main/index.html`. |
| Resetuj wartości | `btnReset` | Ustawia wszystkie pola atrybutów i umiejętności na `0`. |
| Całkowity koszt PD | `totalXp` | Suma kosztów atrybutów i umiejętności. |
| Tabela atrybutów | `attributesTable` | Cztery wiersze z aktualną i docelową wartością atrybutu. |
| Tabela umiejętności | `skillsTable` | Cztery wiersze z aktualną i docelową wartością umiejętności. |
| Tabela maksimów ras | `maxAttributesTable` | Referencyjna tabela maksymalnych wartości atrybutów. |

## Koszty w `KalkulatorXP.html`

Koszty atrybutów:

```js
0: 0, 1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
```

Koszty umiejętności:

```js
0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
```

`calculateRowCost(current, target, costs)` zwraca `0`, jeżeli wartość docelowa jest mniejsza lub równa aktualnej. W przeciwnym razie zwraca różnicę kosztu docelowego i kosztu aktualnego.

`clampValue(value, min, max)` ogranicza wartości:

- atrybuty: `0..12`,
- umiejętności: `0..8`.

## Tabela maksymalnych wartości atrybutów

`KalkulatorXP.html` i `TworzeniePostaci.html` mają osadzone dane maksymalnych wartości rasowych.

Atrybuty:

- Siła / Strength,
- Wytrzymałość / Toughness,
- Zręczność / Agility,
- Inicjatywa / Initiative,
- Siła Woli / Willpower,
- Inteligencja / Intellect,
- Ogłada / Fellowship,
- Szybkość / Speed.

W `TworzeniePostaci.html` wartość `Vespidzi / Speed = 14` jest renderowana jako `14*`, ale źródłowa wartość pozostaje liczbą `14`. Przypis jest warstwą prezentacji i informuje, że Vespidzi mają stałą Szybkość 14, a pole Szybkość należy ignorować dla obliczeń PD.

## Widok `TworzeniePostaci.html`

`TworzeniePostaci.html` jest prostym kreatorem postaci. Element `<title>` w sekcji `<head>` ustawia tytuł karty przeglądarki na `Prosty Kreator Postaci`.

Główne sekcje:

| Sekcja | Rola |
| --- | --- |
| Techniczny wybór języka | Element `languageSelect` z klasą `language-switcher--hidden`; widok startuje z domyślnym językiem i nie pokazuje użytkownikowi rozwijanego menu zmiany języka. |
| Instrukcja | Otwiera `HowToUse/pl.pdf` albo `HowToUse/en.pdf`. |
| Strona Główna | Przechodzi do `../Main/index.html`. |
| Maksymalne wartości atrybutów | Otwiera modal tabeli maksimów rasowych. |
| Pula PD | Wartość `xpPool`, domyślnie `155`. |
| Zapisz / Wczytaj | Zapis i odczyt Firestore. |
| Atrybuty | Osiem pól atrybutów. |
| Umiejętności | Osiemnaście pól umiejętności w dwóch kolumnach. |
| Talenty i inne | 20 wpisów nazwa/koszt. |
| Komunikaty błędów | `errorMessage`, np. przekroczenie PD albo Drzewo Nauki. |

## Atrybuty w `TworzeniePostaci.html`

Pola atrybutów:

| ID | PL | EN | Domyślnie | Zakres |
| --- | --- | --- | --- | --- |
| `attr_S` | S | S | `1` | `1..12` |
| `attr_Wt` | Wt | T | `1` | `1..12` |
| `attr_Zr` | Zr | A | `1` | `1..12` |
| `attr_I` | I | I | `1` | `1..12` |
| `attr_SW` | SW | Will | `1` | `1..12` |
| `attr_Int` | Int | Int | `1` | `1..12` |
| `attr_Ogd` | Ogd | Fell | `1` | `1..12` |
| `attr_Speed` | Szybkość | Speed | `6` | `1..12` |

`recalcXP()` odczytuje atrybuty przez `readNumberField(...)` (zakres `1..12`, puste pole liczone jako `1`, a Szybkość jako `6`), oblicza koszt według `attributeCosts` i dodaje klasę `attribute-high`, gdy wartość jest większa niż `8`. Szybkość ma koszt jak każdy atrybut, bo gracz może ją podnosić za PD ze wspólnej puli.

## Umiejętności w `TworzeniePostaci.html`

Umiejętności są zapisane jako 18 pól:

```text
skill_Column1Row1 ... skill_Column1Row9
skill_Column2Row1 ... skill_Column2Row9
```

Zakres wartości: `0..8`.

Polski układ nazw:

- kolumna 1: Analiza, Atletyka, Czujność, Dowodzenie, Intuicja, Korzystanie z technologii, Medycyna, Mistrzostwo psioniczne, Oszukiwanie,
- kolumna 2: Perswazja, Pilotaż, Przebiegłość, Przetrwanie, Ukrywanie się, Umiejętności strzeleckie, Walka wręcz, Wiedza ogólna, Zastraszanie.

Angielski układ nazw jest zdefiniowany osobno w `translations.en.skillsColumn1` i `translations.en.skillsColumn2`.

## Talenty i inne koszty

Sekcja talentów ma 20 wpisów.

Nagłówek sekcji to `<h2 class="section-title" id="talentsHeader">`. Jego tekst pochodzi z `translations.<lang>.labels.talentsHeader` i jest ustawiany przez `updateLanguage(lang)`:

| Język | Tekst nagłówka |
| --- | --- |
| `pl` (domyślny) | `Inne: Talenty, Wiara, Psionika, Koszty Archetypu, Pakiety Wyniesienia, Majątek, Języki itd.` |
| `en` | `Other: Talents, Faith, Psionic Powers, Archetype Cost, Ascension Packages, Wealth, Languages etc.` |

Polski tekst jest wpisany także bezpośrednio w HTML nagłówka, więc jest widoczny jeszcze przed pierwszym wywołaniem `updateLanguage(lang)`.

Każdy wpis składa się z:

```text
talent_name_N
talent_cost_N
```

gdzie `N` to liczba od `1` do `20`.

`talent_name_N` jest polem tekstowym `textarea` z klasą `talent-name`, a `talent_cost_N` jest liczbą nieujemną. Koszty talentów są dodawane bez tabeli progowej, czyli bezpośrednio jako wpisane wartości.

Pole nazwy ma `height: 46px`, `resize: none` i `text-align: left`. Rozmiaru fontu ani interlinii nie
ustawia żaden styl, więc świeże pole ma domyślny font pola przeglądarki (w Chromium 13,33 px, interlinia
`normal`).

`adjustTalentFontSize(el)` jest podpięta pod zdarzenie `input` każdego pola `textarea.talent-name`:

```js
function adjustTalentFontSize(el) {
  el.style.fontSize = '16px';
  let fontSize = 16;
  while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && fontSize > 10) {
    fontSize -= 1;
    el.style.fontSize = `${fontSize}px`;
  }
}
```

Funkcja ustawia font 16 px i zmniejsza go co 1 px, dopóki tekst wystaje poza pole, ale nie schodzi
poniżej 10 px. Gdy tekst nie mieści się nawet przy 10 px, pole pokazuje pionowy pasek i przewija się.

Po wczytaniu zapisu `applySavedState(data)` najpierw usuwa ręcznie ustawiony font ze wszystkich pól
nazw (`style.fontSize = ''`), a potem wywołuje `adjustTalentFontSize` dla pól z tekstem — wynik jest
taki, jakby użytkownik wpisał wczytane nazwy na świeżej stronie. Puste pola mają font przeglądarki.

Tabela talentów ma układ automatyczny, a szerokość pola `textarea` wynikająca z fontu wpływa na
szerokość kolumny. Dopóki tekst ma 16 px, jego kolumna jest szersza (przy oknie 1280 px w Chromium:
`302 / 248 / 255 / 248 px` zamiast `267 / 259 / 267 / 260 px` przy pustych polach).

Zaawansowany kreator używa kopii tej funkcji i tej samej wysokości pola — opis w `docs/Documentation_v2.md`.

## Obliczanie PD w `TworzeniePostaci.html`

### Wartości domyślne i odczyt pól liczbowych

```js
const DEFAULT_XP_POOL = 155;
const DEFAULT_SPEED = 6;
const DEFAULT_ATTRIBUTE = 1;

function readNumberField(input, fallback, min, max) {
  if (input.value === '') return fallback;
  const parsed = parseInt(input.value, 10);
  if (Number.isNaN(parsed)) return fallback;
  const value = Math.min(Math.max(parsed, min), max);
  if (input.value !== String(value)) input.value = value;
  return value;
}
```

`readNumberField` odczytuje atrybuty, umiejętności i koszty talentów:

- **puste pole** (np. tuż po skasowaniu liczby klawiszem Backspace) liczy się jako wartość domyślna, ale
  **nie jest nadpisywane** — dzięki temu wpisywana cyfra nie dokleja się do wstawionej wartości
  (Backspace i „3” w polu atrybutu dają 3);
- **liczba spoza zakresu albo ułamek** są poprawiane w polu od razu (`13` → `12`, `-3` → `0` / `1`,
  `2.7` → `2`), więc pole zawsze pokazuje to, co trafia do PD;
- **opuszczenie pustego pola** wpisuje wartość domyślną (`attachDefaultOnBlur`, opis niżej).

| Pole | Zakres | Wartość domyślna |
| --- | --- | --- |
| `xpPool` | bez ograniczeń, bez przepisywania | `155` |
| `attr_Speed` | `1..12` | `6` |
| pozostałe `attr_*` | `1..12` | `1` |
| `skill_Column*` | `0..8` | `0` |
| `talent_cost_*` | od `0` w górę | `0` |

### Kolejność obliczeń

`recalcXP()` wykonuje:

1. Odczyt `xpPool` (puste pole = `155`, liczba ucinana przez `parseInt`, bez przepisywania pola).
2. Odczyt atrybutów przez `readNumberField` i dodanie kosztu każdego według `attributeCosts`.
3. Odczyt umiejętności przez `readNumberField` i dodanie kosztu każdej według `skillCosts`.
4. Odczyt kosztów talentów przez `readNumberField` i dodanie ich bezpośrednio.
5. Obliczenie `xpRemaining = xpPool - xpSpent` i aktualizację pola `xpRemaining`.
6. Zebranie błędów: przekroczenie puli (`xpRemaining < 0`) i Drzewo Nauki (`!checkSkillTree()`), niezależnie
   od siebie.
7. `displayError(errors.join('\n'))` — oba komunikaty mogą być widoczne naraz, każdy w osobnym wierszu
   (`innerText` zamienia znak nowej linii na `<br>`); pusta lista czyści obszar komunikatów.

## Drzewo Nauki

Zasada z podręcznika (str. 26): żeby podnieść Umiejętność do nowej wartości, postać musi najpierw
posiadać łączną liczbę Umiejętności równą tej nowej wartości — Atletyka 4 wymaga punktów w co najmniej
trzech innych Umiejętnościach.

`checkSkillTree()` sprawdza tę zasadę dla stanu końcowego arkusza i zwraca `true` (układ poprawny) albo
`false`. Komunikat pokazuje `recalcXP()`.

Logika:

1. Zlicza aktywne umiejętności, czyli takie z wartością większą od `0` (wliczając najwyższą; puste pole liczy się jako `0`).
2. Dla każdej umiejętności sprawdza, czy jej poziom jest większy niż `1`.
3. Jeżeli poziom jest większy niż `1`, a liczba aktywnych umiejętności jest mniejsza niż ten poziom, funkcja zwraca `false`.
4. Wynik nie zależy od puli PD: przy przekroczonej puli i złamanym Drzewie Nauki widoczne są oba komunikaty.

Sprawdzanie stanu końcowego jest równoważne zasadzie zakupu: układ spełniający warunek da się kupić
(najpierw wszystkie umiejętności na 1, potem podnoszenie), a układu, który go nie spełnia, nie da się
kupić w żadnej kolejności. Potwierdza to przeszukanie wszystkich kolejności zakupu dla 3888 układów.

Komunikat jest liczony od nowa przy każdym przeliczeniu (`input` i `change` każdego pola liczbowego,
reset, wczytanie zapisu), więc pojawia się przy pierwszej zmianie łamiącej zasadę i znika przy pierwszej
zmianie, która ją przywraca.

## Zgodność obu kreatorów — PD i Drzewo Nauki

Zaawansowany kreator (`TworzeniePostaci_v2-core.js`) liczy PD i pokazuje komunikaty dokładnie tak samo:

| Element | Prosty Kreator | Zaawansowany Kreator |
| --- | --- | --- |
| Tabele kosztów | `attributeCosts`, `skillCosts` | `ATTRIBUTE_COSTS`, `SKILL_COSTS` (te same wartości) |
| Drzewo Nauki | `checkSkillTree()` | `isLearningTreeValid()` (ta sama reguła) |
| Odczyt pól liczbowych | `readNumberField()` | `readNumberInput()` (te same zasady) |
| Wartości domyślne pustych pól | `DEFAULT_XP_POOL`, `DEFAULT_SPEED`, `DEFAULT_ATTRIBUTE`, `attachDefaultOnBlur` | `DEFAULT_XP_POOL`, `defaultFieldValue()`, nasłuch `focusout` |
| Dwa błędy naraz | oba komunikaty, w osobnych wierszach | oba komunikaty, w osobnych wierszach |

Sprawdzone w przeglądarce: 3000 losowych postaci wpisanych do obu kreatorów dało identyczne pozostałe PD
i identyczną treść komunikatów, a nietypowe wpisy (puste pole, `0`, `-3`, `2.7`, `13`, `1e1` w polach
puli, atrybutu, Szybkości, umiejętności i kosztu) oraz edycja z klawiatury dają w obu ten sam wynik.
Jedyny wspólny wyjątek: zapis wykładniczy `1e1` (= 10) jest czytany przez `parseInt` jako `1`.

## Reset i domyślne wartości

`resetAll()` ustawia:

- `xpPool` na `155`,
- wszystkie atrybuty oprócz Szybkości na `1`,
- `attr_Speed` na `6`,
- wszystkie umiejętności na `0`,
- wszystkie nazwy talentów na pusty tekst,
- wszystkie koszty talentów na `0`.

`attachDefaultOnBlur(selector, defaultValue)` przywraca wartość domyślną po utracie fokusu, jeżeli pole jest puste albo nie jest liczbą:

```js
attachDefaultOnBlur('#xpPool', DEFAULT_XP_POOL);
attachDefaultOnBlur("input[id^='attr_']:not(#attr_Speed)", DEFAULT_ATTRIBUTE);
attachDefaultOnBlur('#attr_Speed', DEFAULT_SPEED);
attachDefaultOnBlur("input[id^='skill_Column']", 0);
attachDefaultOnBlur("input[id^='talent_cost_']", 0);
```

Szybkość ma osobne wywołanie, bo jej wartością domyślną jest `6`, a nie `1`.

## Zmiana języka

`KalkulatorXP.html` i `TworzeniePostaci.html` zawierają tłumaczenia dla języków:

- `pl`,
- `en`.

**W obu widokach przełącznik języka jest ukryty.** Chowa go wspólna klasa
`language-switcher--hidden` z regułą `display: none !important`. Warstwa tłumaczeń pozostaje
aktywna, a widoki startują z językiem polskim.

| Plik | Element z klasą | Gdzie leży reguła CSS |
| --- | --- | --- |
| `Kalkulator/KalkulatorXP.html` | `<div class="language-switcher language-switcher--hidden">` | `Kalkulator/kalkulatorxp.css` |
| `Kalkulator/TworzeniePostaci.html` | `<select id="languageSelect" class="language-switcher--hidden">` | blok `<style>` w tym samym pliku |
| `Kalkulator/TworzeniePostaci_v2.html` | `<select id="languageSelect" class="language-switcher--hidden">` | blok `<style>` w tym samym pliku |

Aby przełącznik był ponownie widoczny, wystarczy usunąć klasę `language-switcher--hidden`
z elementu wskazanego w tabeli — regułę CSS można zostawić, bo bez klasy nie ma na co działać.
W każdym z tych plików nad elementem stoi komentarz
`MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`.

W `KalkulatorXP.html` klasa stoi na kontenerze, bo kontener zawiera wyłącznie select.
W obu kreatorach stoi na samym `<select>`, bo kontener `.language-switcher` trzyma także przyciski
`Instrukcja`, `Strona Główna` i `Maksymalne wartości atrybutów` — ukrycie kontenera zabrałoby
te przyciski.

W obu kreatorach `languageSelect` pozostaje w DOM jako techniczny punkt integracji z funkcją
`updateLanguage(lang)`, zapisem stanu i odtwarzaniem danych. Ma dodatkowo `aria-hidden="true"`
i `tabindex="-1"`, więc nie trafia do kolejności klawiatury ani do czytnika ekranu.

## Podpis w stopce kreatorów — celowo nieczytelny

`TworzeniePostaci.html` i `TworzeniePostaci_v2.html` mają w stopce podpis autora
(`Wykonane przez Spaczoną Inteligencję` / `Made by Abominable Intelligence`). Reguła `.footer`
ustawia `font-size: 1px`, `line-height: 1` oraz `-webkit-text-size-adjust: none`
i `text-size-adjust: none`.

Jest to zamierzone: tekst istnieje w treści strony, jest zaznaczalny i kopiowalny, ale na ekranie
pozostaje nieczytelną smużką. Rozmiar jest zapisany w CSS, a `updateLanguage(lang)` podmienia
wyłącznie sam tekst (`#footerText` w prostym kreatorze), więc obie wersje językowe są tak samo małe.
`text-size-adjust: none` wyłącza powiększanie drobnego tekstu przez przeglądarki telefonów — bez
tego linia stałaby się czytelna na telefonie.

W obu kreatorach stopka jest wyrównana do prawej (`text-align: right`), do prawej krawędzi treści
kontenera `.wrapper`, i pisana kursywą (`font-style: italic`).

Zmiana rozmiaru podpisu to zmiana jednej wartości `font-size` w regule `.footer` w obu plikach.

## Modale

`TworzeniePostaci.html` ma dwa typy modali.

### Modal maksymalnych wartości atrybutów

Element:

```text
speciesMaxModal
```

Otwierany przyciskiem `showSpeciesMaxButton`. Zamykany przez:

- przycisk zamknięcia,
- kliknięcie tła,
- `Escape`.

Przy otwarciu renderuje `speciesMaxTable` i `speciesMaxFootnotes`.

### Modal potwierdzeń i informacji

Element:

```text
confirmModal
```

Używany przez:

- zmianę języka,
- zapis Firestore,
- wczytanie Firestore,
- komunikaty sukcesu i błędu.

Funkcje:

- `showConfirmationModal(...)`,
- `showInfoModal(...)`,
- `toggleConfirmModal(...)`.

Modal może mieć jeden przycisk informacyjny albo dwa przyciski potwierdzenia.

## Responsywność `TworzeniePostaci.html`

- `.wrapper` ma `width: min(1100px, 100%)`. Zapis `96vw` odnosiłby się do szerokości ekranu, a nie do
  miejsca pozostałego po marginesie wewnętrznym `body`;
- każda z trzech tabel (atrybuty, umiejętności, talenty) jest w `<div class="table-wrap">`
  z `overflow-x: auto`, więc przewija się sama zamiast rozpychać stronę;
- przy `max-width: 760px` `.language-switcher` przechodzi z `position: absolute` na `static` i układa
  przyciski w wiersz nad tytułem, a tabele dostają `min-width` (atrybuty 560 px, pozostałe po 520 px).

To ten sam układ, który `TworzeniePostaci_v2.html` ma od początku.

## Responsywność `KalkulatorXP.html`

Siatka `.calcGrid` pozostaje bez zmian. Poprawki dotyczą wyłącznie tabeli
`#maxAttributesTable` (`.referenceTable`), która ma `table-layout: fixed` i dziewięć kolumn
o narzuconej równej szerokości, a jej nagłówki to długie, niepodzielne słowa:

- `.referenceTableWrap` ma `overflow-x: auto`,
- `.referenceTable` ma `min-width: 520px`,
- `.referenceTable thead th` ma `overflow-wrap: anywhere`, `padding: 10px 4px` i `letter-spacing: .03em`,
  żeby długie nazwy atrybutów miały w komórce więcej miejsca na tekst.

## Firebase w `TworzeniePostaci.html`

Firebase jest używany tylko do zapisu i wczytania stanu postaci.

Pliki:

```text
Kalkulator/config/firebase-config.js
Kalkulator/config/FirebaseREADME.md
```

Kod inicjalizuje Firebase przez `initializeFirebaseContext()`. Zaraz po `firebase.initializeApp(...)`,
a przed `firebase.firestore()`, wywoływane jest `window.WG_activateAppCheckCompat(firebase)` — patrz
sekcja o App Check niżej.

Jeżeli `firebase` albo `window.firebaseConfig` nie istnieją, funkcja zwraca:

```js
{ ready: false, characterRef: null }
```

Jeżeli konfiguracja istnieje, kod używa:

```text
character_builder/current
```

Zapis:

```js
firebaseContext.characterRef.set(payload)
```

Odczyt:

```js
firebaseContext.characterRef.get()
```

### App Check w obu kreatorach

Oba kreatory wysyłają przy każdym zapytaniu do Firestore znacznik App Check, czyli potwierdzenie, że
zapytanie pochodzi z zarejestrowanej aplikacji WrathAndGlory.

| | Prosty Kreator (`TworzeniePostaci.html`) | Zaawansowany Kreator (`TworzeniePostaci_v2-firebase.js`) |
| --- | --- | --- |
| Sposób wczytania biblioteki | znaczniki `<script>` w HTML | `loadScript()` w trakcie działania strony, w `ensureAppCheck()` |
| Moment uruchomienia | w `initializeFirebaseContext()`, po `initializeApp`, przed `firestore()` | w `ensureFirebase()`, po `initializeApp`, przed `firestore()` |
| Klucz witryny | `shared/appcheck-config.js` | `shared/appcheck-config.js` |

Bibliotekę reCAPTCHA Enterprise wczytuje strona (Prosty Kreator) albo `ensureAppCheck()`
(Zaawansowany Kreator), a nie SDK Firebase. Powód: SDK dokłada własny znacznik `<script>` wyłącznie
z obsługą poprawnego wczytania, bez obsługi błędu, więc przy zablokowanym adresie czeka bez końca
i blokuje wszystkie zapytania do bazy.

Uruchomienie App Check nie jest krytyczne. Przy braku klucza, biblioteki reCAPTCHA albo obsługi
reCAPTCHA Enterprise w bibliotece funkcja zapisuje ostrzeżenie w konsoli i pomija App Check —
zapis i wczytanie postaci działają wtedy tak jak przed jego wprowadzeniem.

### Dlaczego wersja zgodnościowa, a nie modularna

Sposób zapisu i odczytu postaci nie został zmieniony przy podniesieniu wersji. Kluczowy szczegół:
w obu kreatorach `snapshot.exists` jest używane jako **wartość prawda/fałsz** (`if (snapshot.exists)`).
W zapisie modularnym `exists` jest funkcją, więc warunek byłby zawsze prawdziwy i wczytanie
nieistniejącej postaci zgłaszałoby fałszywy sukces zamiast komunikatu „brak zapisanego stanu".
W zapisie zgodnościowym `exists` pozostaje wartością logiczną — sprawdzone uruchomieniem na
wersji 12.6.0.

Szczegółowy model Firebase jest opisany w `Kalkulator/config/FirebaseREADME.md`.

## Model zapisu postaci

`collectCurrentState()` buduje payload:

| Pole | Typ | Opis |
| --- | --- | --- |
| `schemaVersion` | `number` | Aktualnie `1`. |
| `module` | `string` | `Kalkulator/TworzeniePostaci`. |
| `lang` | `string` | Aktualny język: `pl` albo `en`. |
| `savedAt` | `timestamp` | Firestore server timestamp. |
| `savedBy` | `string` | `anonymous-web-client`. |
| `xpPool` | `number` | Pula PD. |
| `xpTotal` | `number` | Całkowita pula PD, obecnie taka sama jak `xpPool`. |
| `xpSpent` | `number` | Wydane PD. |
| `xpAvailable` | `number` | Pozostałe PD. |
| `hasValidationErrors` | `boolean` | Czy widoczny jest błąd walidacji. |
| `validationMessages` | `array<string>` | Lista widocznych komunikatów walidacji, każdy jako osobna pozycja — najwyżej dwa naraz (przekroczenie puli PD i Drzewo Nauki). |
| `attributes` | `object` | Wartości atrybutów. |
| `skills` | `object` | Wartości umiejętności. |
| `talents` | `array<object>` | 20 wpisów talentów. |
| `formSnapshot` | `object` | Snapshot wszystkich `input`, `textarea` i `select` z ID. |

Przy wczytywaniu `applySavedState(data)` odtwarza wartości z `formSnapshot`, ustawia język z `data.lang`, jeżeli jest obsługiwany, dopasowuje font pól nazw w sekcji „Inne” i uruchamia `recalcXP()`.

## i18n

`KalkulatorXP.html` i `TworzeniePostaci.html` mają osobne obiekty `translations`.

W obu widokach dostępne są:

- `pl`,
- `en`.

`KalkulatorXP.html` przełącza język bez resetowania danych.

W obu widokach `languageSelect` jest ukryty klasą `language-switcher--hidden` i pozostaje wyłącznie technicznym elementem używanym przez logikę tłumaczeń i odtwarzania zapisu. Sposób odkrycia przełącznika opisuje sekcja `Zmiana języka`.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Puste pole w trakcie pisania | Nie jest nadpisywane; do obliczeń trafia wartość domyślna (pula `155`, Szybkość `6`, atrybut `1`, umiejętność i koszt `0`). |
| Puste lub błędne pole `xpPool` | Po blur wraca do `155`. |
| Puste lub błędne pole Szybkości | Po blur wraca do `6`. |
| Puste lub błędne pole pozostałych atrybutów | Po blur wraca do `1`. |
| Puste lub błędne pole umiejętności | Po blur wraca do `0`. |
| Puste lub błędne pole kosztu talentu | Po blur wraca do `0`. |
| Atrybut poza zakresem | `recalcXP()` ogranicza do `1..12`. |
| Umiejętność poza zakresem | `recalcXP()` ogranicza do `0..8`. |
| Koszt talentu poniżej zera | `recalcXP()` ustawia `0`. |
| Ułamek w atrybucie, umiejętności lub koszcie | `recalcXP()` ucina do liczby całkowitej i przepisuje pole. |
| Wydane PD przekracza pulę | Pokazywany jest błąd `tooMuchXP`. |
| Naruszone Drzewo Nauki | Pokazywany jest błąd `treeOfLearning` — także razem z błędem `tooMuchXP`, w osobnym wierszu. |
| Brak Firebase | Zapis i wczytanie pokazują błąd w modalu. |
| Brak dokumentu Firestore | Wczytanie pokazuje błąd w modalu. |

## Procedura odtworzenia modułu

1. Zachowaj katalog `Kalkulator/`.
2. Zachowaj `index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html` i `kalkulatorxp.css`.
3. Zachowaj assety `Skull.png`, `Koza.gif`, `Modal_Icon.png`.
4. Zachowaj katalog `HowToUse/` z `pl.pdf` i `en.pdf`.
5. Skonfiguruj Firebase zgodnie z `Kalkulator/config/FirebaseREADME.md`, jeżeli zapis/wczytanie postaci ma działać.
6. Otwórz `Kalkulator/index.html` i sprawdź linki.
7. Otwórz `KalkulatorXP.html` i sprawdź obliczanie kosztów.
8. Otwórz `TworzeniePostaci.html` i sprawdź obliczanie PD, walidację, modale, instrukcje PDF oraz zapis/wczytanie.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Landing | Otwórz `Kalkulator/index.html`. | Widać logo, linki do kalkulatora PD, prostego kreatora, zaawansowanego kreatora i sekretny przycisk. |
| Sekretny overlay | Kliknij `Tajny przycisk!`. | Otwiera się overlay z `Koza.gif`; można go zamknąć kliknięciem tła, przyciskiem albo `Escape`. |
| Kalkulator PD | Wpisz aktualną i docelową wartość. | Koszt wiersza i `totalXp` aktualizują się automatycznie. |
| Reset kalkulatora PD | Kliknij `Resetuj wartości`. | Wszystkie pola kalkulatora PD wracają do `0`. |
| Język kalkulatora PD | Zmień PL/EN. | Teksty i tabela maksimów zmieniają język bez resetu pól. |
| Tworzenie postaci — PD | Zmień atrybuty, umiejętności i talenty. | `xpRemaining` przelicza się automatycznie. |
| Przekroczenie PD | Wydaj więcej PD niż pula. | Pojawia się błąd przekroczenia puli. |
| Drzewo Nauki | Ustaw niezgodne poziomy umiejętności. | Pojawia się błąd Drzewa Nauki. |
| Oba błędy naraz | Przekrocz pulę PD i złam Drzewo Nauki. | Widoczne są oba komunikaty, jeden pod drugim. |
| Edycja z klawiatury | W polu atrybutu zaznacz liczbę, naciśnij Backspace i wpisz `3`. | Pole pokazuje `3`; po opuszczeniu pustego pola wraca wartość domyślna (Szybkość `6`). |
| Font po wczytaniu | Wczytaj zapis z długą nazwą w sekcji „Inne”. | Font nazwy jest zmniejszony jak po wpisaniu; puste pola mają font przeglądarki. |
| Modal maksimów | Kliknij `Maksymalne wartości atrybutów`. | Otwiera się tabela maksimów rasowych z przypisem Vespidów. |
| Instrukcja | Kliknij `Instrukcja` / `Manual`. | Otwiera się PDF dla aktualnego języka. |
| Język arkusza | Otwórz `TworzeniePostaci.html`. | Arkusz używa domyślnego języka; rozwijane menu zmiany języka nie jest widoczne dla użytkownika. |
| Zapis Firebase | Kliknij `Zapisz` i potwierdź. | Stan zapisuje się do `character_builder/current`. |
| Wczytanie Firebase | Kliknij `Wczytaj` i potwierdź. | Formularz odtwarza wartości z `formSnapshot`. |

---

# 🇬🇧 Technical documentation — Kalkulator (EN)

## Module purpose

`Kalkulator` is a set of static HTML/CSS/JS tools for planning character advancement and character creation in `Wrath & Glory`.

The module consists of a start page and tools opened from buttons:

- start page `index.html`,
- XP cost calculator `KalkulatorXP.html`,
- simple character creator `TworzeniePostaci.html`,
- advanced character creator `TworzeniePostaci_v2.html`.

Most logic runs locally in the browser. Firebase Firestore saves and loads the character state in both creators: `TworzeniePostaci.html` uses the `character_builder/current` document and `TworzeniePostaci_v2.html` the `character_builder/v2` document.

The advanced creator has its own complete technical documentation in `docs/Documentation_v2.md`. This file covers the start page, the XP Calculator, the Simple Character Creator and what both creators share.

## Entry points

| File | Role |
| --- | --- |
| `Kalkulator/index.html` | `Kozie Liczydła` start page. Links to the XP calculator and character creation. |
| `Kalkulator/KalkulatorXP.html` | Simple advancement cost calculator for attributes and skills. |
| `Kalkulator/TworzeniePostaci.html` | Fuller character creation sheet with XP pool, attributes, skills, talents, validation, and Firebase save/load. |
| `Kalkulator/TworzeniePostaci_v2.html` | Advanced character creator: XP pool, attributes, skills, talents with addable rows, special rules, derived traits, PDF export and Firebase save. Details in `docs/Documentation_v2.md`. |

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `index.html` | Module landing page, logo, tool links, and secret GIF overlay. |
| `KalkulatorXP.html` | XP cost calculator for current and target values. |
| `TworzeniePostaci.html` | Character creation sheet and Firestore state save/load. |
| `TworzeniePostaci_v2.html` | Advanced character creator view: page structure, modals and local styles. |
| `TworzeniePostaci_v2-core.js` | Advanced creator core: tables, XP costs, Tree of Learning, derived traits, `window.WNGCreatorV2` API. |
| `TworzeniePostaci_v2-firebase.js` | Advanced creator save and load at `character_builder/v2`. |
| `TworzeniePostaci_v2-pdf.js` | Character sheet PDF export. |
| `pdf/pl.pdf` | Polish character sheet template for the PDF export. |
| `docs/Documentation_v2.md` | Advanced creator technical documentation. |
| `kalkulatorxp.css` | Shared style used by `KalkulatorXP.html` and as base style by `TworzeniePostaci.html`. |
| `config/firebase-config.js` | Firebase configuration for `TworzeniePostaci.html`. |
| `config/FirebaseREADME.md` | Firebase setup guide for character save. |
| `HowToUse/pl.pdf` | Polish manual opened from the character creation sheet. |
| `HowToUse/en.pdf` | English manual opened from the character creation sheet. |
| `Skull.png` | Start page logo. |
| `Koza.gif` | Image used in the start page secret overlay. |
| `Modal_Icon.png` | Confirmation modal image in `TworzeniePostaci.html`. |
| `docs/README.md` | User guide. |
| `docs/Documentation.md` | This technical documentation. |

## External dependencies

`index.html` and `KalkulatorXP.html` do not require external JavaScript libraries.

`TworzeniePostaci.html` uses Firebase in compatibility (compat) form, version **12.6.0**:

- `firebase-app-compat.js`,
- `firebase-firestore-compat.js`,
- `firebase-app-check-compat.js`.

Plus:

- `../shared/appcheck-config.js` — App Check site keys for both Firebase projects,
- `https://www.google.com/recaptcha/enterprise.js` — the reCAPTCHA Enterprise library,
- `../shared/firebase-app-check-compat.js` — shared App Check activation.

The library file names **must** end with `-compat`. Since version 9 `firebase-app.js` is a module
file and, loaded with a plain `<script>` tag, raises a `SyntaxError`, so the `firebase` object is
never created and the character save and load buttons stop doing anything.

Firebase configuration is loaded from:

```text
Kalkulator/config/firebase-config.js
```

The module uses the local font stack:

```text
Consolas, Fira Code, Source Code Pro, monospace
```

## `index.html` view

`index.html` is the module start page.

Main elements:

| Element | Role |
| --- | --- |
| `Skull.png` | Start logo. |
| `Kalkulator PD` link | Opens `KalkulatorXP.html`. |
| `Prosty Kreator Postaci` link | Opens `TworzeniePostaci.html` and sits in the right column of the first row. |
| `Zaawansowany Kreator Postaci` link | Opens `TworzeniePostaci_v2.html` and sits directly below the simple creator. |
| `secretButton` | Opens the secret overlay. |
| `secretOverlay` | Fullscreen overlay with `Koza.gif`. |
| `secretCloseButton` | Closes the overlay. |

Start page logic is minimal. `toggleSecretOverlay(forceOpen)` toggles the `is-open` class and updates `aria-hidden`.

The overlay can be closed by:

- `Zamknij` button,
- clicking the background outside the dialog,
- pressing `Escape`.

The `.actions` tile grid uses `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`. The
`min(220px, 100%)` part is required: plain `minmax(220px, 1fr)` cannot go below 220 px, so on
a 320 px screen the column overflowed its container by 16 px. From 360 px up both forms produce an
identical layout.

## `KalkulatorXP.html` view

`KalkulatorXP.html` calculates XP cost between current and target values.

Main UI elements:

| Element | ID | Role |
| --- | --- | --- |
| Language switcher | `languageSelect` | Switches PL/EN texts. Hidden with `language-switcher--hidden`. |
| Main Page | `btnMainPage` | Link to `../Main/index.html`. |
| Reset values | `btnReset` | Sets all attribute and skill fields to `0`. |
| Total XP cost | `totalXp` | Sum of attribute and skill costs. |
| Attributes table | `attributesTable` | Four rows with current and target attribute value. |
| Skills table | `skillsTable` | Four rows with current and target skill value. |
| Species maximum table | `maxAttributesTable` | Reference table of maximum attribute values. |

## Costs in `KalkulatorXP.html`

Attribute costs:

```js
0: 0, 1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
```

Skill costs:

```js
0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
```

`calculateRowCost(current, target, costs)` returns `0` when target is less than or equal to current. Otherwise it returns target cost minus current cost.

`clampValue(value, min, max)` restricts values:

- attributes: `0..12`,
- skills: `0..8`.

## Maximum attribute values table

`KalkulatorXP.html` and `TworzeniePostaci.html` both embed species maximum attribute data.

Attributes:

- Strength,
- Toughness,
- Agility,
- Initiative,
- Willpower,
- Intellect,
- Fellowship,
- Speed.

In `TworzeniePostaci.html`, `Vespid / Speed = 14` is rendered as `14*`, but the source value remains numeric `14`. The footnote is presentation-only and states that Vespids have fixed Speed 14 and the Speed field should be ignored for XP calculation.

## `TworzeniePostaci.html` view

`TworzeniePostaci.html` is the simple character creator sheet. The `<title>` element in the `<head>` section sets the browser tab title to `Prosty Kreator Postaci`.

Main sections:

| Section | Role |
| --- | --- |
| Technical language selector | The `languageSelect` element with the `language-switcher--hidden` class; the view starts with the default language and does not show the user a language dropdown. |
| Manual | Opens `HowToUse/pl.pdf` or `HowToUse/en.pdf`. |
| Main Page | Goes to `../Main/index.html`. |
| Maximum attribute values | Opens species maximum table modal. |
| XP pool | `xpPool`, default `155`. |
| Save / Load | Firestore save and load. |
| Attributes | Eight attribute fields. |
| Skills | Eighteen skill fields in two columns. |
| Talents and others | 20 name/cost entries. |
| Error messages | `errorMessage`, such as XP overflow or Tree of Learning. |

## Attributes in `TworzeniePostaci.html`

Attribute fields:

| ID | PL | EN | Default | Range |
| --- | --- | --- | --- | --- |
| `attr_S` | S | S | `1` | `1..12` |
| `attr_Wt` | Wt | T | `1` | `1..12` |
| `attr_Zr` | Zr | A | `1` | `1..12` |
| `attr_I` | I | I | `1` | `1..12` |
| `attr_SW` | SW | Will | `1` | `1..12` |
| `attr_Int` | Int | Int | `1` | `1..12` |
| `attr_Ogd` | Ogd | Fell | `1` | `1..12` |
| `attr_Speed` | Szybkość | Speed | `6` | `1..12` |

`recalcXP()` reads attributes through `readNumberField(...)` (range `1..12`, an empty field counted as `1`, and Speed as `6`), calculates cost using `attributeCosts`, and adds class `attribute-high` when value is greater than `8`. Speed costs XP like any attribute, because the player can raise it with XP from the shared pool.

## Skills in `TworzeniePostaci.html`

Skills are stored as 18 fields:

```text
skill_Column1Row1 ... skill_Column1Row9
skill_Column2Row1 ... skill_Column2Row9
```

Value range: `0..8`.

Polish skill layout:

- column 1: Analiza, Atletyka, Czujność, Dowodzenie, Intuicja, Korzystanie z technologii, Medycyna, Mistrzostwo psioniczne, Oszukiwanie,
- column 2: Perswazja, Pilotaż, Przebiegłość, Przetrwanie, Ukrywanie się, Umiejętności strzeleckie, Walka wręcz, Wiedza ogólna, Zastraszanie.

English skill layout is defined separately in `translations.en.skillsColumn1` and `translations.en.skillsColumn2`.

## Talents and other costs

The talents section has 20 entries.

The section heading is `<h2 class="section-title" id="talentsHeader">`. Its text comes from `translations.<lang>.labels.talentsHeader` and is set by `updateLanguage(lang)`:

| Language | Heading text |
| --- | --- |
| `pl` (default) | `Inne: Talenty, Wiara, Psionika, Koszty Archetypu, Pakiety Wyniesienia, Majątek, Języki itd.` |
| `en` | `Other: Talents, Faith, Psionic Powers, Archetype Cost, Ascension Packages, Wealth, Languages etc.` |

The Polish text is also written directly in the heading's HTML, so it is visible even before the first `updateLanguage(lang)` call.

Each entry consists of:

```text
talent_name_N
talent_cost_N
```

where `N` is a number from `1` to `20`.

`talent_name_N` is a `textarea` with the `talent-name` class, and `talent_cost_N` is a non-negative number. Talent costs are added directly, without a cost progression table.

The name field has `height: 46px`, `resize: none` and `text-align: left`. No style sets its font size or
line height, so a fresh field uses the browser's default field font (13.33px in Chromium, `normal` line
height).

`adjustTalentFontSize(el)` is bound to the `input` event of every `textarea.talent-name` field:

```js
function adjustTalentFontSize(el) {
  el.style.fontSize = '16px';
  let fontSize = 16;
  while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && fontSize > 10) {
    fontSize -= 1;
    el.style.fontSize = `${fontSize}px`;
  }
}
```

The function sets a 16px font and shrinks it by 1px while the text overflows the field, never below
10px. When the text does not fit even at 10px, the field shows a vertical scrollbar and scrolls.

After loading a save, `applySavedState(data)` first removes the manually set font from every name field
(`style.fontSize = ''`) and then calls `adjustTalentFontSize` for the fields holding text — the result
is as if the user had typed the loaded names on a fresh page. Empty fields keep the browser font.

The talents table uses the automatic layout, and the field width that follows from its font affects the
column width. While the text is at 16px its column is wider (at a 1280px window in Chromium:
`302 / 248 / 255 / 248 px` instead of `267 / 259 / 267 / 260 px` with empty fields).

The advanced creator uses a copy of this function and the same field height — see `docs/Documentation_v2.md`.

## XP calculation in `TworzeniePostaci.html`

### Default values and reading number fields

```js
const DEFAULT_XP_POOL = 155;
const DEFAULT_SPEED = 6;
const DEFAULT_ATTRIBUTE = 1;

function readNumberField(input, fallback, min, max) {
  if (input.value === '') return fallback;
  const parsed = parseInt(input.value, 10);
  if (Number.isNaN(parsed)) return fallback;
  const value = Math.min(Math.max(parsed, min), max);
  if (input.value !== String(value)) input.value = value;
  return value;
}
```

`readNumberField` reads attributes, skills and talent costs:

- an **empty field** (e.g. right after deleting the number with Backspace) counts as its default value but
  is **not overwritten** — so a typed digit is not appended to an inserted value (Backspace and "3" in an
  attribute field give 3);
- a **number out of range or a fraction** is corrected in the field at once (`13` → `12`, `-3` → `0` / `1`,
  `2.7` → `2`), so the field always shows what goes into XP;
- **leaving an empty field** writes the default value (`attachDefaultOnBlur`, see below).

| Field | Range | Default value |
| --- | --- | --- |
| `xpPool` | unlimited, not rewritten | `155` |
| `attr_Speed` | `1..12` | `6` |
| other `attr_*` | `1..12` | `1` |
| `skill_Column*` | `0..8` | `0` |
| `talent_cost_*` | `0` and up | `0` |

### Calculation order

`recalcXP()` performs:

1. Reads `xpPool` (empty field = `155`, number truncated by `parseInt`, field not rewritten).
2. Reads attributes through `readNumberField` and adds each cost using `attributeCosts`.
3. Reads skills through `readNumberField` and adds each cost using `skillCosts`.
4. Reads talent costs through `readNumberField` and adds them directly.
5. Calculates `xpRemaining = xpPool - xpSpent` and updates the `xpRemaining` field.
6. Collects errors: exceeded pool (`xpRemaining < 0`) and Tree of Learning (`!checkSkillTree()`), independently
   of each other.
7. `displayError(errors.join('\n'))` — both messages can be visible at once, each on its own line
   (`innerText` turns the newline into `<br>`); an empty list clears the message area.

## Tree of Learning

Rulebook rule (p. 26): to raise a Skill to a new rating, the character must first have a total number of
Skills equal to that new rating — Athletics 4 requires points in at least three other Skills.

`checkSkillTree()` checks this rule against the final state of the sheet and returns `true` (valid layout)
or `false`. `recalcXP()` shows the message.

Logic:

1. Counts active skills, meaning skills with value greater than `0` (including the highest one; an empty field counts as `0`).
2. Checks each skill with level greater than `1`.
3. If level is greater than `1` and the number of active skills is smaller than that level, the function returns `false`.
4. The result does not depend on the XP pool: with an exceeded pool and a broken Tree of Learning, both messages are visible.

Checking the final state is equivalent to the purchase rule: a layout meeting the condition can be bought
(every skill to 1 first, then raising), and a layout failing it cannot be bought in any order. A search
over every purchase order for 3888 layouts confirms this.

The message is recomputed on every recalculation (`input` and `change` of every number field, reset,
loading a save), so it appears on the first change breaking the rule and disappears on the first change
restoring it.

## Both creators — XP and Tree of Learning compatibility

The advanced creator (`TworzeniePostaci_v2-core.js`) calculates XP and shows messages in exactly the same way:

| Element | Simple Creator | Advanced Creator |
| --- | --- | --- |
| Cost tables | `attributeCosts`, `skillCosts` | `ATTRIBUTE_COSTS`, `SKILL_COSTS` (same values) |
| Tree of Learning | `checkSkillTree()` | `isLearningTreeValid()` (same rule) |
| Reading number fields | `readNumberField()` | `readNumberInput()` (same rules) |
| Defaults of empty fields | `DEFAULT_XP_POOL`, `DEFAULT_SPEED`, `DEFAULT_ATTRIBUTE`, `attachDefaultOnBlur` | `DEFAULT_XP_POOL`, `defaultFieldValue()`, `focusout` listener |
| Two errors at once | both messages, on separate lines | both messages, on separate lines |

Checked in the browser: 3000 random characters entered into both creators gave identical remaining XP
and identical message text, and unusual entries (empty field, `0`, `-3`, `2.7`, `13`, `1e1` in the pool,
attribute, Speed, skill and cost fields) as well as keyboard editing give the same result in both. The
one shared exception: exponent notation `1e1` (= 10) is read by `parseInt` as `1`.

## Reset and default values

`resetAll()` sets:

- `xpPool` to `155`,
- all attributes except Speed to `1`,
- `attr_Speed` to `6`,
- all skills to `0`,
- all talent names to empty text,
- all talent costs to `0`.

`attachDefaultOnBlur(selector, defaultValue)` restores the default value on blur when a field is empty or not numeric:

```js
attachDefaultOnBlur('#xpPool', DEFAULT_XP_POOL);
attachDefaultOnBlur("input[id^='attr_']:not(#attr_Speed)", DEFAULT_ATTRIBUTE);
attachDefaultOnBlur('#attr_Speed', DEFAULT_SPEED);
attachDefaultOnBlur("input[id^='skill_Column']", 0);
attachDefaultOnBlur("input[id^='talent_cost_']", 0);
```

Speed has its own call, because its default value is `6`, not `1`.

## Language change

`KalkulatorXP.html` and `TworzeniePostaci.html` contain translations for languages:

- `pl`,
- `en`.

**In both views the language selector is hidden.** It is hidden by the shared
`language-switcher--hidden` class with a `display: none !important` rule. The translation layer stays
active and the views start in Polish.

| File | Element carrying the class | Where the CSS rule lives |
| --- | --- | --- |
| `Kalkulator/KalkulatorXP.html` | `<div class="language-switcher language-switcher--hidden">` | `Kalkulator/kalkulatorxp.css` |
| `Kalkulator/TworzeniePostaci.html` | `<select id="languageSelect" class="language-switcher--hidden">` | the `<style>` block in the same file |
| `Kalkulator/TworzeniePostaci_v2.html` | `<select id="languageSelect" class="language-switcher--hidden">` | the `<style>` block in the same file |

To make the selector visible again, remove the `language-switcher--hidden` class from the element
listed in the table — the CSS rule can stay, because without the class it has nothing to act on.
In each of these files a comment marked `LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits above the
element.

In `KalkulatorXP.html` the class sits on the container, because the container holds only the select.
In both creators it sits on the `<select>` itself, because the `.language-switcher` container also
holds the `Instrukcja`, `Strona Główna` and `Maksymalne wartości atrybutów` buttons — hiding the
container would remove those buttons.

In both creators `languageSelect` remains in the DOM as a technical integration point for
`updateLanguage(lang)`, state saving and data restoration. It also carries `aria-hidden="true"` and
`tabindex="-1"`, so it reaches neither keyboard order nor a screen reader.

## The creators' footer credit — deliberately unreadable

`TworzeniePostaci.html` and `TworzeniePostaci_v2.html` carry an author credit in the footer
(`Wykonane przez Spaczoną Inteligencję` / `Made by Abominable Intelligence`). The `.footer` rule sets
`font-size: 1px`, `line-height: 1`, `-webkit-text-size-adjust: none` and `text-size-adjust: none`.

This is intentional: the text exists in the page content, it can be selected and copied, but on
screen it stays an unreadable smudge. The size lives in CSS while `updateLanguage(lang)` replaces
only the text itself (`#footerText` in the simple creator), so both language versions are equally
small. `text-size-adjust: none` switches off the small-text inflation phone browsers apply — without
it the line would become readable on a phone.

In both creators the footer is right-aligned (`text-align: right`) to the right content edge of the
`.wrapper` container and set in italics (`font-style: italic`).

Changing the credit size means changing a single `font-size` value in the `.footer` rule in both
files.

## Modals

`TworzeniePostaci.html` has two modal types.

### Maximum attribute values modal

Element:

```text
speciesMaxModal
```

Opened by `showSpeciesMaxButton`. Closed by:

- close button,
- background click,
- `Escape`.

On open it renders `speciesMaxTable` and `speciesMaxFootnotes`.

### Confirmation and information modal

Element:

```text
confirmModal
```

Used by:

- language changes,
- Firestore save,
- Firestore load,
- success and error messages.

Functions:

- `showConfirmationModal(...)`,
- `showInfoModal(...)`,
- `toggleConfirmModal(...)`.

The modal can have one information button or two confirmation buttons.

## Responsiveness of `TworzeniePostaci.html`

- `.wrapper` has `width: min(1100px, 100%)`. The `96vw` form would refer to the screen width rather
  than to the space left after the `body` padding;
- each of the three tables (attributes, skills, talents) sits in a `<div class="table-wrap">` with
  `overflow-x: auto`, so it scrolls on its own instead of widening the page;
- at `max-width: 760px` `.language-switcher` moves from `position: absolute` to `static` and lays the
  buttons out in a row above the title, and the tables get a `min-width` (attributes 560 px, the rest
  520 px each).

This is the same layout `TworzeniePostaci_v2.html` has had from the start.

## Responsiveness of `KalkulatorXP.html`

The `.calcGrid` grid is left untouched. The fixes concern only the `#maxAttributesTable`
(`.referenceTable`) table, which has `table-layout: fixed` and nine columns of imposed equal width
while its headers are long, unbreakable words:

- `.referenceTableWrap` has `overflow-x: auto`,
- `.referenceTable` has `min-width: 520px`,
- `.referenceTable thead th` has `overflow-wrap: anywhere`, `padding: 10px 4px` and
  `letter-spacing: .03em`, so long attribute names get more room for text inside the cell.

## Firebase in `TworzeniePostaci.html`

Firebase is used only for character state save and load.

Files:

```text
Kalkulator/config/firebase-config.js
Kalkulator/config/FirebaseREADME.md
```

The code initializes Firebase through `initializeFirebaseContext()`. Right after
`firebase.initializeApp(...)` and before `firebase.firestore()`, it calls
`window.WG_activateAppCheckCompat(firebase)` — see the App Check section below.

If `firebase` or `window.firebaseConfig` do not exist, the function returns:

```js
{ ready: false, characterRef: null }
```

If configuration exists, the code uses:

```text
character_builder/current
```

Save:

```js
firebaseContext.characterRef.set(payload)
```

Load:

```js
firebaseContext.characterRef.get()
```

### App Check in both creators

Both creators attach an App Check token to every Firestore request, proving the request comes from
the registered WrathAndGlory application.

| | Simple creator (`TworzeniePostaci.html`) | Advanced creator (`TworzeniePostaci_v2-firebase.js`) |
| --- | --- | --- |
| How the library is loaded | `<script>` tags in the HTML | `loadScript()` at runtime, inside `ensureAppCheck()` |
| When it is activated | in `initializeFirebaseContext()`, after `initializeApp`, before `firestore()` | in `ensureFirebase()`, after `initializeApp`, before `firestore()` |
| Site key | `shared/appcheck-config.js` | `shared/appcheck-config.js` |

The reCAPTCHA Enterprise library is loaded by the page (simple creator) or by `ensureAppCheck()`
(advanced creator), not by the Firebase SDK. The reason: the SDK appends its own `<script>` tag with
an onload handler only and no error handler, so with a blocked address it waits forever and stalls
every database request.

App Check activation is not critical. With a missing key, a missing reCAPTCHA library, or a library
without reCAPTCHA Enterprise support, the function logs a console warning and skips App Check — the
character save and load then work as they did before it was introduced.

### Why the compat form and not the modular one

The way characters are saved and read was not changed when the version was raised. The key detail:
both creators use `snapshot.exists` as a **boolean value** (`if (snapshot.exists)`). In the modular
form `exists` is a function, so the condition would always be true and loading a non-existent
character would report a false success instead of the "no saved state" message. In the compat form
`exists` stays a boolean — verified by running it on version 12.6.0.

The detailed Firebase model is documented in `Kalkulator/config/FirebaseREADME.md`.

## Character save model

`collectCurrentState()` builds this payload:

| Field | Type | Description |
| --- | --- | --- |
| `schemaVersion` | `number` | Currently `1`. |
| `module` | `string` | `Kalkulator/TworzeniePostaci`. |
| `lang` | `string` | Current language: `pl` or `en`. |
| `savedAt` | `timestamp` | Firestore server timestamp. |
| `savedBy` | `string` | `anonymous-web-client`. |
| `xpPool` | `number` | XP pool. |
| `xpTotal` | `number` | Total XP pool, currently the same as `xpPool`. |
| `xpSpent` | `number` | Spent XP. |
| `xpAvailable` | `number` | Remaining XP. |
| `hasValidationErrors` | `boolean` | Whether a validation error is visible. |
| `validationMessages` | `array<string>` | List of the visible validation messages, each as a separate entry — at most two at once (exceeded XP pool and Tree of Learning). |
| `attributes` | `object` | Attribute values. |
| `skills` | `object` | Skill values. |
| `talents` | `array<object>` | 20 talent entries. |
| `formSnapshot` | `object` | Snapshot of all `input`, `textarea`, and `select` elements with IDs. |

On load, `applySavedState(data)` restores values from `formSnapshot`, sets language from `data.lang` when supported, fits the font of the name fields in the "Other" section, and runs `recalcXP()`.

## i18n

`KalkulatorXP.html` and `TworzeniePostaci.html` have separate `translations` objects.

Both views support:

- `pl`,
- `en`.

`KalkulatorXP.html` switches language without resetting data.

In both views `languageSelect` is hidden with the `language-switcher--hidden` class and remains only a technical element used by translation and save-restoration logic. The `Language change` section explains how to reveal the selector.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Empty field while typing | Not overwritten; the calculation uses the default value (pool `155`, Speed `6`, attribute `1`, skill and cost `0`). |
| Empty or invalid `xpPool` | On blur, returns to `155`. |
| Empty or invalid Speed field | On blur, returns to `6`. |
| Empty or invalid field of the other attributes | On blur, returns to `1`. |
| Empty or invalid skill field | On blur, returns to `0`. |
| Empty or invalid talent cost field | On blur, returns to `0`. |
| Attribute outside range | `recalcXP()` clamps to `1..12`. |
| Skill outside range | `recalcXP()` clamps to `0..8`. |
| Talent cost below zero | `recalcXP()` sets `0`. |
| Fraction in an attribute, skill or cost | `recalcXP()` truncates it to an integer and rewrites the field. |
| Spent XP exceeds pool | `tooMuchXP` error is shown. |
| Tree of Learning is broken | `treeOfLearning` error is shown — also together with the `tooMuchXP` error, on a separate line. |
| Missing Firebase | Save and load show an error modal. |
| Missing Firestore document | Load shows an error modal. |

## Module recreation procedure

1. Preserve the `Kalkulator/` directory.
2. Preserve `index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html`, and `kalkulatorxp.css`.
3. Preserve assets `Skull.png`, `Koza.gif`, and `Modal_Icon.png`.
4. Preserve `HowToUse/` with `pl.pdf` and `en.pdf`.
5. Configure Firebase according to `Kalkulator/config/FirebaseREADME.md` if character save/load should work.
6. Open `Kalkulator/index.html` and check links.
7. Open `KalkulatorXP.html` and check cost calculation.
8. Open `TworzeniePostaci.html` and check XP calculation, validation, modals, PDF manuals, and save/load.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Landing | Open `Kalkulator/index.html`. | Logo, XP calculator link, simple creator link, advanced creator link, and secret button are visible. |
| Secret overlay | Click `Tajny przycisk!`. | Overlay with `Koza.gif` opens; it can be closed by background click, button, or `Escape`. |
| XP calculator | Enter current and target value. | Row cost and `totalXp` update automatically. |
| XP calculator reset | Click `Reset values`. | All XP calculator fields return to `0`. |
| XP calculator language | Switch PL/EN. | Texts and maximum values table change language without field reset. |
| Character creation XP | Change attributes, skills, and talents. | `xpRemaining` recalculates automatically. |
| XP overflow | Spend more XP than pool. | XP overflow error appears. |
| Tree of Learning | Set invalid skill levels. | Tree of Learning error appears. |
| Both errors at once | Exceed the XP pool and break the Tree of Learning. | Both messages are visible, one below the other. |
| Keyboard editing | In an attribute field select the number, press Backspace and type `3`. | The field shows `3`; leaving an empty field restores the default (Speed `6`). |
| Font after loading | Load a save with a long name in the "Other" section. | The name font is shrunk as after typing; empty fields use the browser font. |
| Maximum values modal | Click `Maximum attribute values`. | Species maximum table opens with Vespid footnote. |
| Manual | Click `Instrukcja` / `Manual`. | PDF for current language opens. |
| Sheet language | Open `TworzeniePostaci.html`. | The sheet uses the default language; the language dropdown is not visible to the user. |
| Firebase save | Click `Save` and confirm. | State is saved to `character_builder/current`. |
| Firebase load | Click `Load` and confirm. | Form restores values from `formSnapshot`. |

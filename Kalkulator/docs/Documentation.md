# 🇵🇱 Dokumentacja techniczna — Kalkulator (PL)

## Cel modułu

`Kalkulator` jest zestawem statycznych narzędzi HTML/CSS/JS do planowania rozwoju i tworzenia postaci w systemie `Wrath & Glory`.

Moduł składa się z trzech głównych widoków:

- strony startowej `index.html`,
- kalkulatora kosztów PD `KalkulatorXP.html`,
- arkusza tworzenia postaci `TworzeniePostaci.html`.

Większość logiki działa lokalnie w przeglądarce. Tylko `TworzeniePostaci.html` używa Firebase Firestore do zapisu i wczytywania aktualnego stanu postaci.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `Kalkulator/index.html` | Strona startowa `Kozie Liczydła`. Prowadzi do kalkulatora PD i tworzenia postaci. |
| `Kalkulator/KalkulatorXP.html` | Prosty kalkulator kosztów rozwoju atrybutów i umiejętności. |
| `Kalkulator/TworzeniePostaci.html` | Pełniejszy arkusz tworzenia postaci z pulą PD, atrybutami, umiejętnościami, talentami, walidacją i zapisem Firebase. |

## Struktura plików modułu

| Plik lub katalog | Odpowiedzialność |
| --- | --- |
| `index.html` | Landing modułu, logo, linki do narzędzi i sekretny overlay z GIF-em. |
| `KalkulatorXP.html` | Kalkulator kosztów PD dla aktualnych i docelowych wartości. |
| `TworzeniePostaci.html` | Arkusz tworzenia postaci i zapis/wczytanie stanu z Firestore. |
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

`TworzeniePostaci.html` używa Firebase w trybie compat:

- `firebase-app-compat.js`,
- `firebase-firestore-compat.js`.

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
| Link `Tworzenie Postaci` | Prowadzi do `TworzeniePostaci.html`. |
| `secretButton` | Otwiera sekretny overlay. |
| `secretOverlay` | Pełnoekranowa nakładka z `Koza.gif`. |
| `secretCloseButton` | Zamyka overlay. |

Logika strony startowej jest minimalna. Funkcja `toggleSecretOverlay(forceOpen)` przełącza klasę `is-open` i aktualizuje `aria-hidden`.

Overlay można zamknąć:

- przyciskiem `Zamknij`,
- kliknięciem tła poza dialogiem,
- klawiszem `Escape`.

## Widok `KalkulatorXP.html`

`KalkulatorXP.html` służy do szybkiego obliczenia kosztu PD między wartością aktualną i docelową.

Główne elementy UI:

| Element | ID | Rola |
| --- | --- | --- |
| Przełącznik języka | `languageSelect` | Przełącza teksty PL/EN. |
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

`TworzeniePostaci.html` jest arkuszem tworzenia postaci. Element `<title>` w sekcji `<head>` ustawia tytuł karty przeglądarki na `Prosty Kreator Postaci`.

Główne sekcje:

| Sekcja | Rola |
| --- | --- |
| Przełącznik języka | Wybór PL/EN. Zmiana języka resetuje dane po potwierdzeniu. |
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

`recalcXP()` ogranicza atrybuty do zakresu `1..12`, oblicza koszt według `attributeCosts` i dodaje klasę `attribute-high`, gdy wartość jest większa niż `8`.

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

Każdy wpis składa się z:

```text
talent_name_N
talent_cost_N
```

gdzie `N` to liczba od `1` do `20`.

`talent_name_N` jest polem tekstowym `textarea`, a `talent_cost_N` jest liczbą nieujemną. Koszty talentów są dodawane bez tabeli progowej, czyli bezpośrednio jako wpisane wartości.

`adjustTalentFontSize(...)` zmniejsza font w polach nazw talentów, jeżeli tekst nie mieści się w polu.

## Obliczanie PD w `TworzeniePostaci.html`

`recalcXP()` wykonuje:

1. Odczyt `xpPool`.
2. Ograniczenie atrybutów do `1..12`.
3. Dodanie kosztu każdego atrybutu według `attributeCosts`.
4. Ograniczenie umiejętności do `0..8`.
5. Dodanie kosztu każdej umiejętności według `skillCosts`.
6. Ograniczenie kosztów talentów do wartości nieujemnych.
7. Dodanie kosztów talentów bezpośrednio.
8. Obliczenie `xpRemaining = xpPool - xpSpent`.
9. Aktualizację pola `xpRemaining`.
10. Pokazanie błędu przekroczenia puli albo sprawdzenie Drzewa Nauki.

## Drzewo Nauki

`checkSkillTree()` sprawdza uproszczoną zasadę Drzewa Nauki.

Logika:

1. Zlicza aktywne umiejętności, czyli takie z wartością większą od `0`.
2. Dla każdej umiejętności sprawdza, czy jej poziom jest większy niż `1`.
3. Jeżeli poziom jest większy niż `1`, a liczba aktywnych umiejętności jest mniejsza niż ten poziom, zasada jest naruszona.
4. Błąd Drzewa Nauki jest pokazywany tylko wtedy, gdy pula PD nie jest przekroczona.

## Reset i domyślne wartości

`resetAll()` ustawia:

- `xpPool` na `155`,
- wszystkie atrybuty oprócz Szybkości na `1`,
- `attr_Speed` na `6`,
- wszystkie umiejętności na `0`,
- wszystkie nazwy talentów na pusty tekst,
- wszystkie koszty talentów na `0`.

`attachDefaultOnBlur(...)` przywraca wartości domyślne po utracie fokusu, jeżeli pole jest puste albo nie jest liczbą.

## Zmiana języka

`TworzeniePostaci.html` obsługuje języki:

- `pl`,
- `en`.

Zmiana języka:

1. Otwiera modal potwierdzenia.
2. Jeżeli użytkownik potwierdzi, wykonuje `updateLanguage(newLang)` i `resetAll()`.
3. Jeżeli użytkownik odmówi, select wraca do poprzedniego języka.

To zachowanie jest celowe, ponieważ zmiana języka zmienia etykiety formularza i resetuje dane robocze.

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

## Firebase w `TworzeniePostaci.html`

Firebase jest używany tylko do zapisu i wczytania stanu postaci.

Pliki:

```text
Kalkulator/config/firebase-config.js
Kalkulator/config/FirebaseREADME.md
```

Kod inicjalizuje Firebase przez `initializeFirebaseContext()`.

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
| `validationMessages` | `array<string>` | Lista komunikatów walidacji. |
| `attributes` | `object` | Wartości atrybutów. |
| `skills` | `object` | Wartości umiejętności. |
| `talents` | `array<object>` | 20 wpisów talentów. |
| `formSnapshot` | `object` | Snapshot wszystkich `input`, `textarea` i `select` z ID. |

Przy wczytywaniu `applySavedState(data)` odtwarza wartości z `formSnapshot`, ustawia język z `data.lang`, jeżeli jest obsługiwany, i uruchamia `recalcXP()`.

## i18n

`KalkulatorXP.html` i `TworzeniePostaci.html` mają osobne obiekty `translations`.

W obu widokach dostępne są:

- `pl`,
- `en`.

`KalkulatorXP.html` przełącza język bez resetowania danych.

`TworzeniePostaci.html` wymaga potwierdzenia i resetuje dane po zmianie języka.

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Puste lub błędne pole `xpPool` | Po blur wraca do `155`. |
| Puste lub błędne pole atrybutu | Po blur wraca do `1`. |
| Puste lub błędne pole umiejętności | Po blur wraca do `0`. |
| Puste lub błędne pole kosztu talentu | Po blur wraca do `0`. |
| Atrybut poza zakresem | `recalcXP()` ogranicza do `1..12`. |
| Umiejętność poza zakresem | `recalcXP()` ogranicza do `0..8`. |
| Koszt talentu poniżej zera | `recalcXP()` ustawia `0`. |
| Wydane PD przekracza pulę | Pokazywany jest błąd `tooMuchXP`. |
| Naruszone Drzewo Nauki | Pokazywany jest błąd `treeOfLearning`, o ile pula PD nie jest przekroczona. |
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
| Landing | Otwórz `Kalkulator/index.html`. | Widać logo, linki do dwóch narzędzi i sekretny przycisk. |
| Sekretny overlay | Kliknij `Tajny przycisk!`. | Otwiera się overlay z `Koza.gif`; można go zamknąć kliknięciem tła, przyciskiem albo `Escape`. |
| Kalkulator PD | Wpisz aktualną i docelową wartość. | Koszt wiersza i `totalXp` aktualizują się automatycznie. |
| Reset kalkulatora PD | Kliknij `Resetuj wartości`. | Wszystkie pola kalkulatora PD wracają do `0`. |
| Język kalkulatora PD | Zmień PL/EN. | Teksty i tabela maksimów zmieniają język bez resetu pól. |
| Tworzenie postaci — PD | Zmień atrybuty, umiejętności i talenty. | `xpRemaining` przelicza się automatycznie. |
| Przekroczenie PD | Wydaj więcej PD niż pula. | Pojawia się błąd przekroczenia puli. |
| Drzewo Nauki | Ustaw niezgodne poziomy umiejętności. | Pojawia się błąd Drzewa Nauki. |
| Modal maksimów | Kliknij `Maksymalne wartości atrybutów`. | Otwiera się tabela maksimów rasowych z przypisem Vespidów. |
| Instrukcja | Kliknij `Instrukcja` / `Manual`. | Otwiera się PDF dla aktualnego języka. |
| Zmiana języka arkusza | Zmień język w `TworzeniePostaci.html`. | Pojawia się potwierdzenie; po akceptacji dane resetują się. |
| Zapis Firebase | Kliknij `Zapisz` i potwierdź. | Stan zapisuje się do `character_builder/current`. |
| Wczytanie Firebase | Kliknij `Wczytaj` i potwierdź. | Formularz odtwarza wartości z `formSnapshot`. |

---

# 🇬🇧 Technical documentation — Kalkulator (EN)

## Module purpose

`Kalkulator` is a set of static HTML/CSS/JS tools for planning character advancement and character creation in `Wrath & Glory`.

The module consists of three main views:

- start page `index.html`,
- XP cost calculator `KalkulatorXP.html`,
- character creation sheet `TworzeniePostaci.html`.

Most logic runs locally in the browser. Only `TworzeniePostaci.html` uses Firebase Firestore to save and load the current character state.

## Entry points

| File | Role |
| --- | --- |
| `Kalkulator/index.html` | `Kozie Liczydła` start page. Links to the XP calculator and character creation. |
| `Kalkulator/KalkulatorXP.html` | Simple advancement cost calculator for attributes and skills. |
| `Kalkulator/TworzeniePostaci.html` | Fuller character creation sheet with XP pool, attributes, skills, talents, validation, and Firebase save/load. |

## Module file structure

| File or directory | Responsibility |
| --- | --- |
| `index.html` | Module landing page, logo, tool links, and secret GIF overlay. |
| `KalkulatorXP.html` | XP cost calculator for current and target values. |
| `TworzeniePostaci.html` | Character creation sheet and Firestore state save/load. |
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

`TworzeniePostaci.html` uses Firebase compat:

- `firebase-app-compat.js`,
- `firebase-firestore-compat.js`.

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
| `Tworzenie Postaci` link | Opens `TworzeniePostaci.html`. |
| `secretButton` | Opens the secret overlay. |
| `secretOverlay` | Fullscreen overlay with `Koza.gif`. |
| `secretCloseButton` | Closes the overlay. |

Start page logic is minimal. `toggleSecretOverlay(forceOpen)` toggles the `is-open` class and updates `aria-hidden`.

The overlay can be closed by:

- `Zamknij` button,
- clicking the background outside the dialog,
- pressing `Escape`.

## `KalkulatorXP.html` view

`KalkulatorXP.html` calculates XP cost between current and target values.

Main UI elements:

| Element | ID | Role |
| --- | --- | --- |
| Language switcher | `languageSelect` | Switches PL/EN texts. |
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

`TworzeniePostaci.html` is the character creation sheet. The `<title>` element in the `<head>` section sets the browser tab title to `Prosty Kreator Postaci`.

Main sections:

| Section | Role |
| --- | --- |
| Language switcher | PL/EN selection. Changing language resets data after confirmation. |
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

`recalcXP()` clamps attributes to `1..12`, calculates cost using `attributeCosts`, and adds class `attribute-high` when value is greater than `8`.

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

Each entry consists of:

```text
talent_name_N
talent_cost_N
```

where `N` is a number from `1` to `20`.

`talent_name_N` is a `textarea`, and `talent_cost_N` is a non-negative number. Talent costs are added directly, without a cost progression table.

`adjustTalentFontSize(...)` decreases font size in talent name fields when text does not fit.

## XP calculation in `TworzeniePostaci.html`

`recalcXP()` performs:

1. Reads `xpPool`.
2. Clamps attributes to `1..12`.
3. Adds each attribute cost using `attributeCosts`.
4. Clamps skills to `0..8`.
5. Adds each skill cost using `skillCosts`.
6. Clamps talent costs to non-negative values.
7. Adds talent costs directly.
8. Calculates `xpRemaining = xpPool - xpSpent`.
9. Updates `xpRemaining` field.
10. Shows XP overflow error or checks Tree of Learning.

## Tree of Learning

`checkSkillTree()` checks a simplified Tree of Learning rule.

Logic:

1. Counts active skills, meaning skills with value greater than `0`.
2. Checks each skill with level greater than `1`.
3. If level is greater than `1` and the number of active skills is smaller than that level, the rule is broken.
4. Tree of Learning error is shown only when XP pool is not exceeded.

## Reset and default values

`resetAll()` sets:

- `xpPool` to `155`,
- all attributes except Speed to `1`,
- `attr_Speed` to `6`,
- all skills to `0`,
- all talent names to empty text,
- all talent costs to `0`.

`attachDefaultOnBlur(...)` restores default values on blur when a field is empty or not numeric.

## Language change

`TworzeniePostaci.html` supports languages:

- `pl`,
- `en`.

Changing language:

1. Opens a confirmation modal.
2. If confirmed, runs `updateLanguage(newLang)` and `resetAll()`.
3. If declined, the select returns to the previous language.

This is intentional, because language change updates form labels and resets working data.

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

## Firebase in `TworzeniePostaci.html`

Firebase is used only for character state save and load.

Files:

```text
Kalkulator/config/firebase-config.js
Kalkulator/config/FirebaseREADME.md
```

The code initializes Firebase through `initializeFirebaseContext()`.

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
| `validationMessages` | `array<string>` | Validation message list. |
| `attributes` | `object` | Attribute values. |
| `skills` | `object` | Skill values. |
| `talents` | `array<object>` | 20 talent entries. |
| `formSnapshot` | `object` | Snapshot of all `input`, `textarea`, and `select` elements with IDs. |

On load, `applySavedState(data)` restores values from `formSnapshot`, sets language from `data.lang` when supported, and runs `recalcXP()`.

## i18n

`KalkulatorXP.html` and `TworzeniePostaci.html` have separate `translations` objects.

Both views support:

- `pl`,
- `en`.

`KalkulatorXP.html` switches language without resetting data.

`TworzeniePostaci.html` requires confirmation and resets data after language change.

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Empty or invalid `xpPool` | On blur, returns to `155`. |
| Empty or invalid attribute field | On blur, returns to `1`. |
| Empty or invalid skill field | On blur, returns to `0`. |
| Empty or invalid talent cost field | On blur, returns to `0`. |
| Attribute outside range | `recalcXP()` clamps to `1..12`. |
| Skill outside range | `recalcXP()` clamps to `0..8`. |
| Talent cost below zero | `recalcXP()` sets `0`. |
| Spent XP exceeds pool | `tooMuchXP` error is shown. |
| Tree of Learning is broken | `treeOfLearning` error is shown unless XP pool is exceeded. |
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
| Landing | Open `Kalkulator/index.html`. | Logo, links to two tools, and secret button are visible. |
| Secret overlay | Click `Tajny przycisk!`. | Overlay with `Koza.gif` opens; it can be closed by background click, button, or `Escape`. |
| XP calculator | Enter current and target value. | Row cost and `totalXp` update automatically. |
| XP calculator reset | Click `Reset values`. | All XP calculator fields return to `0`. |
| XP calculator language | Switch PL/EN. | Texts and maximum values table change language without field reset. |
| Character creation XP | Change attributes, skills, and talents. | `xpRemaining` recalculates automatically. |
| XP overflow | Spend more XP than pool. | XP overflow error appears. |
| Tree of Learning | Set invalid skill levels. | Tree of Learning error appears. |
| Maximum values modal | Click `Maximum attribute values`. | Species maximum table opens with Vespid footnote. |
| Manual | Click `Instrukcja` / `Manual`. | PDF for current language opens. |
| Sheet language change | Change language in `TworzeniePostaci.html`. | Confirmation appears; after acceptance, data resets. |
| Firebase save | Click `Save` and confirm. | State is saved to `character_builder/current`. |
| Firebase load | Click `Load` and confirm. | Form restores values from `formSnapshot`. |

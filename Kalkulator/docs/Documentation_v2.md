# 🇵🇱 Dokumentacja techniczna — Zaawansowany Kreator Postaci v2 (PL)

**Punkt wejścia:** `Kalkulator/TworzeniePostaci_v2.html`  
**Dokument:** `Kalkulator/docs/Documentation_v2.md`  
**Stan opisany na dzień:** 2026-06-23  
**Schemat zapisu Firestore:** `3`  
**Dokument Firestore:** `character_builder/v2`

## Cel dokumentu

Niniejszy plik opisuje aktualną implementację zaawansowanego kreatora postaci `TworzeniePostaci_v2.html`: strukturę interfejsu, model danych, obliczenia, walidację, obsługę zasad specjalnych, zapis Firestore, eksport PDF, style, zasoby pomocnicze oraz kontrakty pomiędzy plikami JavaScript.

Dokument jest opisem kodu znajdującego się w repozytorium. Nie opisuje dawnego prototypu `test-v2` ani nie zakłada kompatybilności ze starymi zapisami testowymi.

## Zakres modułu

Zaawansowany kreator pozwala:

- ustawić pulę punktów doświadczenia;
- kupować atrybuty i umiejętności;
- dodawać talenty i inne zdolności wraz z ręcznym kosztem PD;
- wprowadzać dane postaci potrzebne do obliczeń i eksportu;
- dodawać opisowe lub mechaniczne zasady specjalne;
- automatycznie obliczać cechy pochodne;
- sprawdzać przekroczenie puli PD i zasadę Drzewa Nauki;
- zapisywać oraz wczytywać jeden wspólny stan z Firestore;
- generować polską kartę postaci PDF.

## Architektura plików

| Plik lub zasób | Odpowiedzialność |
| --- | --- |
| `Kalkulator/TworzeniePostaci_v2.html` | Struktura strony, modale, kontrolki statyczne, style lokalne i kolejność ładowania skryptów. |
| `Kalkulator/TworzeniePostaci_v2-core.js` | Renderowanie tabel, koszty PD, walidacje, model danych, cechy pochodne, modale i publiczne API `window.WNGCreatorV2`. |
| `Kalkulator/TworzeniePostaci_v2-firebase.js` | Leniwe ładowanie Firebase, walidacja schematu, zapis i odczyt dokumentu `character_builder/v2`. |
| `Kalkulator/TworzeniePostaci_v2-pdf.js` | Leniwe ładowanie bibliotek PDF, pobranie szablonu i fontu, wypełnienie formularza oraz otwarcie wygenerowanego PDF. |
| `Kalkulator/kalkulatorxp.css` | Bazowy arkusz stylów modułu. `TworzeniePostaci_v2.html` rozszerza i nadpisuje go stylem osadzonym w `<head>`. |
| `Kalkulator/config/firebase-config.js` | Obiekt `window.firebaseConfig` wykorzystywany podczas pierwszej operacji zapisu lub odczytu. |
| `Kalkulator/pdf/pl.pdf` | Formularz będący szablonem eksportowanej polskiej karty postaci. |
| `Kalkulator/HowToUse/pl.pdf` | Polska instrukcja otwierana przyciskiem `Instrukcja`. |
| `Kalkulator/Modal_Icon.png` | Ilustracja używana w modalach potwierdzeń i komunikatów. |
| `Kalkulator/index.html` | Landing modułu zawierający odnośnik do zaawansowanego kreatora. |
| `Main/index.html` | Cel przycisku `Strona Główna`; z katalogu `Kalkulator` używana jest ścieżka `../Main/index.html`. |

## Kolejność uruchamiania

Na końcu dokumentu HTML ładowane są, z atrybutem `defer`, kolejno:

1. `TworzeniePostaci_v2-core.js`;
2. `TworzeniePostaci_v2-firebase.js`;
3. `TworzeniePostaci_v2-pdf.js`.

Rdzeń musi zostać uruchomiony jako pierwszy, ponieważ dwa pozostałe pliki korzystają z obiektu `window.WNGCreatorV2`.

Każdy skrypt używa własnej funkcji `initialize()` i uruchamia ją:

- natychmiast, gdy dokument jest już gotowy;
- albo jednorazowo po `DOMContentLoaded`.

## Widok HTML

### Metadane

- język dokumentu: `pl`;
- tytuł karty przeglądarki: `Zaawansowany Kreator Postaci`;
- nagłówek widoczny na stronie: `Tworzenie Postaci`;
- viewport: `width=device-width, initial-scale=1`.

### Główny nagłówek i przyciski

| Identyfikator | Etykieta | Działanie |
| --- | --- | --- |
| `xpPool` | `Pula PD do wydania` | Ręczna pula PD, domyślnie `155`, minimum HTML `0`. |
| `xpRemaining` | `Pozostało PD` | Automatycznie wyświetla pulę pomniejszoną o wydatki. |
| `saveFirebaseButton` | `Zapisz` | Otwiera potwierdzenie i zapisuje stan do Firestore. |
| `loadFirebaseButton` | `Wczytaj` | Otwiera potwierdzenie i wczytuje stan z Firestore. |
| `manualButton` | `Instrukcja` | Otwiera `HowToUse/pl.pdf` w nowej karcie. |
| `backToMainButton` | `Strona Główna` | Przechodzi do `../Main/index.html`. |
| `showSpeciesMaxButton` | `Maksymalne wartości atrybutów` | Otwiera modal tabeli referencyjnej. |
| `openCharacterRulesModalButton` | `Cechy i zasady specjalne` | Otwiera główny modal danych postaci i zasad. |
| `exportCharacterPdfButton` | `Eksportuj PDF` | Generuje polską kartę PDF. |

### Ukryty przełącznik języka

Element `languageSelect` nadal istnieje w DOM, ale ma `display:none!important`, `aria-hidden="true"` oraz `tabindex="-1"`.

Opcje `Polski` i `English` są zachowane technicznie, lecz aktualna wersja v2 nie przełącza języka. Instrukcja i eksport są polskie.

### Sekcje główne

Strona zawiera trzy główne tabele:

1. `attributesTable` — atrybuty;
2. `skillsTable` — umiejętności;
3. `talentsTable` — talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne.

Tabele są początkowo puste w HTML i są generowane przez `TworzeniePostaci_v2-core.js`.

### Ukryty log PDF

Sekcja zawierająca `pdfLogMessage` ma klasę `technical-hidden`, która wymusza `display:none!important`.

Komunikaty eksportu są więc zapisywane do DOM, ale standardowo nie są widoczne. Szczegółowe czasy generowania są dodatkowo zapisywane w konsoli przeglądarki.

## Modale

### `characterRulesModal`

Modal `Cechy i zasady specjalne` zawiera:

- dane postaci do obliczeń i eksportu;
- tabelę cech obliczalnych;
- obszar ostrzeżeń `derivedWarnings`;
- tabelę zasad specjalnych;
- przyciski dodawania i usuwania zasad.

### `speciesMaxModal`

Modal prezentuje tabelę maksymalnych wartości atrybutów gatunków. Jest to tabela wyłącznie referencyjna — wybór gatunku nie ustawia i nie ogranicza automatycznie pól atrybutów.

### `confirmModal`

Jeden modal jest współdzielony przez:

- potwierdzenie zapisu;
- potwierdzenie wczytania;
- komunikaty sukcesu;
- komunikaty błędów.

Tryb potwierdzenia pokazuje przyciski `Tak` i `Nie`. Tryb informacyjny ukrywa `Nie` i zmienia tekst przycisku akceptacji na `OK`.

Kliknięcie tła lub `Escape`:

- zwraca `false` w dialogu potwierdzającym;
- zamyka dialog informacyjny i zwraca `true`.

Po zamknięciu nasłuchiwacze dialogu są usuwane, aby kolejne otwarcia nie dublowały obsługi.

## Style i układ

### Stos fontów

```text
Consolas, Fira Code, Source Code Pro, monospace
```

### Najważniejsze zmienne kolorystyczne

| Zmienna | Wartość / rola |
| --- | --- |
| `--bg` | `#031605`, bazowe ciemnozielone tło pól. |
| `--panel`, `--panel2` | `#000`, czarne panele. |
| `--text` | `#9cf09c`, główny zielony tekst. |
| `--code` | `#d2fad2`, jaśniejsze nagłówki i wyniki. |
| `--muted` | `#4a8b4a`, tekst drugorzędny. |
| `--red` | `#d74b4b`, błędy. |
| `--yellow` | `#e0c35a`, ostrzeżenia cech pochodnych. |
| `--b`, `--b2`, `--div` | półprzezroczyste zielone obramowania. |
| `--glow`, `--glowH` | zielone poświaty paneli i nagłówków. |

### Kontener i tabele

- główny kontener ma szerokość `min(1100px, 96vw)`;
- tabele używają `table-layout: fixed`;
- opakowanie `.table-wrap` zapewnia poziome przewijanie;
- nagłówki są pisane wielkimi literami z rozstrzelonym tekstem;
- parzyste wiersze mają delikatne zielone tło;
- najechanie podświetla wiersz.

### Tabela cech obliczalnych

Szerokości kolumn:

| Kolumna | Szerokość |
| --- | ---: |
| Cecha | 25% |
| Podstawa | 47% |
| Premia | 14% |
| Wynik | 14% |

Kolumny `Premia` i `Wynik` mają tę samą szerokość i wyśrodkowanie. Kolumny `Cecha` i `Podstawa` są wyrównane do lewej.

Lista atrybutu Wpływów jest wyświetlana wewnątrz formuły jako element inline o szerokości `8em`.

### Pola nieaktywne

Pola `disabled` otrzymują:

- `opacity: .45`;
- kursor `not-allowed`;
- przygaszone tło;
- kolor `--muted`;
- słabsze obramowanie;
- brak poświaty fokusu.

Styl jest używany przede wszystkim przez pole `Wartość` zasad z celem `Opis / brak modyfikatora`.

### Responsywność

Przy szerokości do `760px`:

- zmniejszane są marginesy i padding strony;
- nagłówek przechodzi do jednej kolumny;
- zestawy przycisków mogą zajmować całą szerokość;
- tabela danych postaci otrzymuje minimum `900px`;
- tabela atrybutów minimum `720px`;
- tabele umiejętności i talentów minimum `700px`;
- tabela cech obliczalnych minimum `760px`;
- przewijanie odbywa się w `.table-wrap`.

Modal ma maksymalną wysokość `88vh` i własne przewijanie.

## Rdzeń danych — `TworzeniePostaci_v2-core.js`

### Funkcje pomocnicze

| Funkcja | Rola |
| --- | --- |
| `byId(id)` | Skrót do `document.getElementById`. |
| `clamp(value,min,max)` | Ogranicza liczbę do przedziału. |
| `toInt(value,fallback)` | Parsuje liczbę całkowitą, a przy błędzie zwraca wartość zapasową. |
| `escapeHtml(value)` | Escapuje dane umieszczane w dynamicznym HTML. |
| `optionHtml(items,current)` | Generuje opcje elementu `select`. |
| `formatSigned(value)` | Dodaje znak `+` wyłącznie do wartości dodatnich. Zero pozostaje `0`, wartości ujemne zachowują `-`. |

## Atrybuty

### Klucze i wartości początkowe

| Klucz | Etykieta | Wartość startowa | Zakres |
| --- | --- | ---: | ---: |
| `S` | S | 1 | 1–12 |
| `Wt` | Wt | 1 | 1–12 |
| `Zr` | Zr | 1 | 1–12 |
| `I` | I | 1 | 1–12 |
| `SW` | SW | 1 | 1–12 |
| `Int` | Int | 1 | 1–12 |
| `Ogd` | Ogd | 1 | 1–12 |
| `Speed` | Szybkość | 6 | 1–12 |

Podczas każdego przeliczenia wartości są ponownie ograniczane do `1–12`, a skorygowana liczba jest wpisywana z powrotem do pola.

### Koszt atrybutów

Koszt jest kosztem całej ustawionej wartości, a nie różnicą względem wartości początkowej.

| Wartość | Koszt PD |
| ---: | ---: |
| 1 | 0 |
| 2 | 4 |
| 3 | 10 |
| 4 | 20 |
| 5 | 35 |
| 6 | 55 |
| 7 | 80 |
| 8 | 110 |
| 9 | 145 |
| 10 | 185 |
| 11 | 230 |
| 12 | 280 |

Szybkość jest traktowana przez mechanizm kosztów tak samo jak pozostałe atrybuty.

## Umiejętności

### Wartości i koszt

Każda umiejętność zaczyna od `0`, jest ograniczana do `0–8` i korzysta z następującej tabeli kosztów:

| Wartość | Koszt PD |
| ---: | ---: |
| 0 | 0 |
| 1 | 2 |
| 2 | 6 |
| 3 | 12 |
| 4 | 20 |
| 5 | 30 |
| 6 | 42 |
| 7 | 56 |
| 8 | 72 |

### Mapowanie atrybutów i pól PDF

`skillTotals` jest zawsze obliczane jako:

```text
wartość umiejętności + przypisany atrybut
```

| Klucz | Umiejętność | Atrybut | Pole wartości PDF | Pole sumy PDF |
| --- | --- | --- | --- | --- |
| `analysis` | Analiza | Int | `Analiza` | `AnalizaSuma` |
| `athletics` | Atletyka | S | `Atletyka` | `AtletykaSuma` |
| `awareness` | Czujność | Int | `Czujność` | `CzujnośćSuma` |
| `leadership` | Dowodzenie | SW | `Dowodzenie` | `DowodzenieSuma` |
| `insight` | Intuicja | Ogd | `Intuicja` | `IntuicjaSuma` |
| `tech` | Korzystanie z technologii | Int | `Technologia` | `TechnologiaSuma` |
| `medicae` | Medycyna | Int | `Medycyna` | `MedycynaSuma` |
| `psychicMastery` | Mistrzostwo psioniczne | SW | `Psionika` | `PsionikaSuma` |
| `deception` | Oszukiwanie | Ogd | `Oszukiwanie` | `OszukiwanieSuma` |
| `persuasion` | Perswazja | Ogd | `Perswazja` | `PerswazjaSuma` |
| `pilot` | Pilotaż | Zr | `Pilotaż` | `PilotażSuma` |
| `cunning` | Przebiegłość | Ogd | `Przebiegłość` | `PrzebiegłośćSuma` |
| `survival` | Przetrwanie | SW | `Przetrwanie` | `PrzetrwanieSuma` |
| `stealth` | Ukrywanie się | Zr | `Ukrywanie się` | `Ukrywanie sięSuma` |
| `ballisticSkill` | Umiejętności strzeleckie | Zr | `Umiejętności strzeleckie` | `Umiejętności StrzeleckieSuma` |
| `weaponSkill` | Walka wręcz | I | `Walka Wręcz` | `Walka WręczSuma` |
| `scholar` | Wiedza ogólna | Int | `Wiedza ogólna` | `Wiedza ogólnaSuma` |
| `intimidation` | Zastraszanie | SW | `Zastraszanie` | `ZastraszanieSuma` |

## Talenty i inne zdolności

Każdy wpis ma:

- pole tekstowe `name`;
- ręczny, nieujemny koszt `cost`.

Zasady renderowania:

- minimalnie istnieją 2 pola;
- liczba pól jest zawsze parzysta;
- przy wczytywaniu nieparzysta liczba wpisów jest zaokrąglana w górę;
- maksymalnie renderowanych jest 100 pól;
- `Dodaj pola talentów` dodaje 2 pola;
- `Usuń pola talentów` usuwa ostatnie 2 pola;
- przycisk usuwania jest ukryty przy 2 polach;
- ujemny koszt jest normalizowany do `0`;
- każdy koszt jest dodawany do wydanych PD;
- puste nazwy nadal mogą mieć koszt i taki koszt będzie uwzględniony;
- do PDF trafiają tylko niepuste nazwy.

## Dane postaci do obliczeń i eksportu

| Pole | Id | Domyślnie | Normalizacja |
| --- | --- | --- | --- |
| Poziom Gry | `character_gameTier` | 1 | liczba całkowita ograniczona do 1–5 |
| Gatunek | `character_speciesName` | puste | `trim()` |
| Rozmiar | `character_size` | Średni | jedna z opcji listy |
| Frakcja | `character_factionName` | puste | `trim()` |
| Archetyp | `character_archetypeName` | puste | `trim()` |
| Słowa Kluczowe | `character_keywords` | puste | `trim()` |

Dostępne rozmiary:

- Malutki;
- Mały;
- Średni;
- Duży;
- Ogromny;
- Monstrualny.

## Cechy i zasady specjalne

### Typy zasad

| Wartość techniczna | Etykieta | Podpowiedź pola opisu |
| --- | --- | --- |
| `speciesAbility` | Zdolności Gatunkowe | `np. Honor Zakonu, Orczy, Łasuch, Intensywne emocje` |
| `archetypeAbility` | Zdolność Archetypu | `np. Oddane współczucie, Płomienna zachęta, +1 do Wpływów` |
| `backgroundBonus` | Premia z Przeszłości | `np. +1 do Żywotności, [DOWOLNE] Słowo Kluczowe` |
| `keywordBonus` | Bonusy Słów Kluczowych | przykłady słów kluczowych i zakonów |
| `factionBonus` | Specjalne Bonusy Frakcji | przykłady ścieżek i mutacji |
| `other` | Inne | przykłady homebrew |

Zmiana typu aktualizuje placeholder pola `Nazwa / opis`. Typ sam w sobie nie wpływa na obliczenia cech — wpływa na klasyfikację treści podczas eksportu PDF.

### Domyślne wiersze

Nowy formularz zawiera po jednym wierszu:

1. `speciesAbility`;
2. `archetypeAbility`;
3. `backgroundBonus`;
4. `keywordBonus`;
5. `other`.

Domyślnie nie jest tworzony wiersz `factionBonus`, lecz typ można wybrać z listy lub dodać nowy wiersz.

### Cele modyfikacji

| Wartość techniczna | Etykieta |
| --- | --- |
| `none` | Opis / brak modyfikatora |
| `woundsMax` | Żywotność |
| `shock` | Odporność Psychiczna |
| `determination` | Determinacja |
| `defence` | Obrona |
| `resilience` | Odporność |
| `resolve` | Upór |
| `conviction` | Odwaga |
| `influence` | Wpływy |
| `wealth` | Majątek |
| `corruption` | Spaczenie |
| `speed` | Szybkość |

Pasywna Czujność nie jest dostępna jako cel modyfikacji.

### Pole `Wartość` dla opisu

Gdy `Modyfikuje` ma wartość `Opis / brak modyfikatora`:

- pole `Wartość` jest ustawiane na `0`;
- pole otrzymuje `disabled` i `aria-disabled="true"`;
- użytkownik nie może go edytować;
- przy odczycie stanu wartość jest ponownie normalizowana do `0`;
- podczas kolekcjonowania danych kod zwraca `value: 0`, niezależnie od ewentualnej dawnej wartości.

Po wybraniu konkretnej cechy pole jest ponownie aktywowane. Ponieważ przełączenie na opis zeruje pole, ponowne aktywowanie rozpoczyna się od `0`.

### Dodawanie i usuwanie

- maksymalnie renderowanych jest 100 zasad;
- `Dodaj zasadę` dodaje wiersz typu `other`, z celem `none` i wartością `0`;
- `Usuń zasadę` usuwa ostatni wiersz;
- co najmniej jeden wiersz zawsze pozostaje;
- przycisk usuwania jest ukryty, gdy istnieje tylko jeden wiersz.

### Sumowanie premii

Dla każdego celu różnego od `none` wartości wszystkich zasad są sumowane algebraicznie.

Przykład Obrony:

```text
Zasada 1:       +1
Zasada 2:       -1
Rozmiar Malutki:+2
Premia Obrony:  +2
```

Kolumna `Premia` pokazuje:

- `+N` dla sumy dodatniej;
- `0` dla zera;
- `-N` dla sumy ujemnej.

## Premia z rozmiaru

Rozmiar wpływa wyłącznie na premię Obrony:

| Rozmiar | Premia do Obrony |
| --- | ---: |
| Malutki | +2 |
| Mały | +1 |
| Średni | 0 |
| Duży | 0 |
| Ogromny | 0 |
| Monstrualny | 0 |

Premia rozmiaru jest dodawana do sumy zasad `defence` i wyświetlana łącznie w kolumnie `Premia`.

## Cechy obliczalne

### Model `Podstawa + Premia = Wynik`

| Cecha | Tekst w kolumnie Podstawa | Premia | Surowe obliczenie |
| --- | --- | --- | --- |
| Żywotność | `Wt + (2 × Poziom Gry)` | zasady `woundsMax` | `Wt + 2 × Poziom Gry + Premia` |
| Odporność Psychiczna | `SW + Poziom Gry` | zasady `shock` | `SW + Poziom Gry + Premia` |
| Determinacja | `Wt` | zasady `determination` | `Wt + Premia` |
| Obrona | `I - 1` | rozmiar + zasady `defence` | `I - 1 + Premia` |
| Odporność | `Wt + 1` | zasady `resilience` | `Wt + 1 + Premia` |
| Upór | `SW` | zasady `resolve` | `SW + Premia` |
| Odwaga | `SW - 1` | zasady `conviction` | `SW - 1 + Premia` |
| Wpływy | `[wybrany atrybut] - 1` | zasady `influence` | `Atrybut - 1 + Premia` |
| Majątek | `Poziom Gry` | zasady `wealth` | `Poziom Gry + Premia` |
| Spaczenie | `0` | zasady `corruption` | `Premia` |
| Szybkość | `Szybkość` | zasady `speed` | `Atrybut Speed + Premia` |
| Pasywna Czujność | `Suma Czujność (Int) / 2` | zawsze `0` | `ceil((Czujność + Int) / 2)` |

### Wpływy

W wierszu Wpływów lista atrybutu znajduje się w kolumnie `Podstawa`.

Dostępne wartości:

- S;
- Wt;
- Zr;
- I;
- SW;
- Int;
- Ogd.

Domyślnie wybrane jest `Ogd`. Wybór jest zapisywany jako `influenceAttribute`.

### Spaczenie

Spaczenie nie posiada ręcznej wartości bazowej. Podstawa wynosi zawsze `0`, a wynik pochodzi wyłącznie z algebraicznej sumy zasad wskazujących cel `corruption`.

Pole i własność `corruptionBase` nie należą do bieżącego modelu danych.

### Minima i zaokrąglenia

Po obliczeniu wartości surowych:

```text
Spaczenie: max(0, ceil(raw))
Pozostałe cechy: max(1, ceil(raw))
```

Aktualne źródła danych są całkowite, ale `Math.ceil` pozostaje częścią kontraktu obliczeń.

### Ostrzeżenia

`derivedWarnings` może pokazać:

- dla każdej cechy poza Spaczeniem: informację o wartości surowej `<= 0` i zastosowaniu minimum `1`;
- dla Spaczenia: informację, że wartość surowa jest ujemna;
- ostrzeżenie, gdy końcowe Spaczenie przekracza `25` pól karty PDF.

## Obliczanie PD

Wydane PD są sumą:

```text
koszty wszystkich 8 atrybutów
+ koszty wszystkich 18 umiejętności
+ ręczne koszty wszystkich pól talentów
```

Zasady specjalne nie mają kosztu PD.

Pozostałe PD:

```text
Pula PD - wydane PD
```

Wartość `xpPool` podczas obliczeń jest parsowana jako liczba całkowita. W zapisie stanu jest dodatkowo ograniczana do minimum `0`.

### Błąd przekroczenia puli

Jeżeli pozostałe PD są ujemne, `errorMessage` zawiera:

```text
Przekroczono dostępną pulę PD!
```

## Drzewo Nauki

Walidacja sprawdza poziomy od `2` do `8`.

Dla każdego poziomu `rating` kod liczy:

- `atRatingOrHigher` — liczbę umiejętności o wartości co najmniej `rating`;
- `supports` — liczbę umiejętności o wartości co najmniej `rating - 1`.

Warunek poprawności:

```text
supports >= atRatingOrHigher × 2
```

Jeżeli warunek nie jest spełniony dla dowolnego poziomu, wyświetlany jest komunikat:

```text
Niezgodność z zasadą Drzewa Nauki (str. 26)
```

Oba błędy — przekroczenie PD i Drzewo Nauki — mogą być wyświetlone jednocześnie, w oddzielnych wierszach.

## Przeliczanie reaktywne

Globalne nasłuchiwanie `input` uruchamia `recalcXP()` dla każdego `input`, `textarea` i `select`.

Globalne nasłuchiwanie `change`:

- aktualizuje placeholder po zmianie `rule_type_*`;
- aktywuje lub wyłącza wartość po zmianie `rule_target_*`;
- uruchamia ponowne przeliczenie.

Każde przeliczenie aktualizuje:

- wartości i koszty atrybutów;
- wartości i koszty umiejętności;
- pozostałe PD;
- błędy PD i Drzewa Nauki;
- premie i wyniki cech pochodnych;
- ostrzeżenia cech pochodnych.

## Model danych

### `computeData()`

Funkcja zwraca obiekt:

```js
{
  attrs,
  skills,
  skillTotals,
  character,
  rules,
  bonuses,
  raw,
  values,
  influenceAttribute,
  talents
}
```

| Pole | Znaczenie |
| --- | --- |
| `attrs` | Znormalizowane atrybuty. |
| `skills` | Znormalizowane wartości umiejętności. |
| `skillTotals` | Umiejętność + przypisany atrybut. |
| `character` | Poziom gry, tekstowe dane postaci i rozmiar. |
| `rules` | Znormalizowane wiersze zasad. |
| `bonuses` | Łączne premie używane w tabeli cech pochodnych. |
| `raw` | Wartości przed minimum. |
| `values` | Końcowe wartości po minimum i `ceil`. |
| `influenceAttribute` | Wybrany atrybut Wpływów. |
| `talents` | Wszystkie renderowane pola talentów. |

### `getState()`

```js
{
  xpPool,
  talentCount,
  data: computeData()
}
```

### `applyState(payload)`

Funkcja odtwarza:

- pulę PD;
- atrybuty;
- umiejętności;
- liczbę i treść talentów;
- dane postaci;
- zasady specjalne;
- atrybut Wpływów.

Po odtworzeniu uruchamia pełne przeliczenie.

Rdzeń zachowuje pomocniczą obsługę aliasów `data.attributes` i `data.specialRules`, ale integracja Firebase v2 akceptuje wyłącznie aktualny schemat `3` i aktualny identyfikator modułu.

Pola obliczone (`bonuses`, `raw`, `values`, `skillTotals`) są obecne w zapisie, lecz przy wczytywaniu nie są traktowane jako źródło prawdy — są wyliczane ponownie z pól wejściowych.

## Publiczne API

Rdzeń wystawia:

```js
window.WNGCreatorV2 = {
  ATTRIBUTES,
  SKILLS,
  getState,
  applyState,
  getComputedData: computeData,
  recalcXP,
  showConfirmation,
  showInfo
};
```

Pliki Firebase i PDF nie powinny odczytywać pól formularza niezależnie, jeśli odpowiednia wartość jest już dostępna przez to API.

## Tabela maksymalnych wartości gatunków

| Gatunek | S | Wt | Zr | I | SW | Int | Ogd | Szybkość |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Człowiek | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 |
| Ork | 12 | 12 | 7 | 7 | 8 | 7 | 7 | 7 |
| Aeldari | 8 | 7 | 12 | 12 | 12 | 10 | 6 | 10 |
| Adeptus Astartes | 10 | 10 | 9 | 9 | 10 | 10 | 8 | 9 |
| Primaris Astartes | 12 | 12 | 9 | 9 | 10 | 10 | 8 | 9 |
| Ogryn | 12 | 12 | 7 | 4 | 8 | 1 | 4 | 8 |
| Szczurak | 6 | 6 | 10 | 10 | 8 | 8 | 10 | 7 |
| Kroot | 12 | 12 | 12 | 12 | 10 | 6 | 6 | 10 |
| Drukhari | 8 | 8 | 12 | 12 | 10 | 10 | 6 | 10 |
| Konstrukt Upiorytowy | 12 | 12 | 8 | 8 | 12 | 10 | 4 | 8 |
| Kasta powietrza | 4 | 4 | 10 | 8 | 8 | 8 | 8 | 8 |
| Kasta ziemi | 6 | 6 | 8 | 8 | 8 | 10 | 8 | 6 |
| Kasta ognia | 7 | 7 | 8 | 8 | 8 | 8 | 8 | 8 |
| Kasta wody | 6 | 6 | 8 | 8 | 8 | 8 | 10 | 6 |
| Niebianie | 6 | 6 | 8 | 8 | 10 | 8 | 8 | 6 |
| Vespidzi | 8 | 8 | 12 | 8 | 8 | 8 | 5 | 14* |

Przypis w interfejsie informuje, że Vespidzi mają stałą Szybkość `14`, a pole Szybkości należy zignorować przy obliczaniu PD. Kod nie wdraża jednak automatycznego wyjątku — użytkownik musi zastosować przypis ręcznie.

## Firebase / Firestore

### Zależności

Firebase jest ładowane dopiero przy pierwszym zapisie lub odczycie:

```text
https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
./config/firebase-config.js
```

Skrypty są oznaczane `data-v2-src`, aby nie wstawiać tej samej zależności ponownie.

Jeżeli Firebase jest już dostępne, kod używa istniejącego obiektu. Domyślna aplikacja jest inicjalizowana tylko wtedy, gdy `firebase.apps` jest puste.

Moduł nie ładuje Firebase Auth i nie wykonuje logowania. Wartość `savedBy: "anonymous-web-client"` jest stałą etykietą, a nie zweryfikowaną tożsamością użytkownika.

### Lokalizacja danych

```text
kolekcja: character_builder
dokument: v2
pełna ścieżka: character_builder/v2
```

`test-v2` nie jest używany. Nie istnieje fallback ani automatyczna migracja z dokumentu testowego.

### Schemat payloadu

```js
{
  schemaVersion: 3,
  module: 'Kalkulator/TworzeniePostaci_v2',
  savedAt: firebase.firestore.FieldValue.serverTimestamp(),
  savedBy: 'anonymous-web-client',
  xpPool,
  talentCount,
  data
}
```

### Zapis

Przebieg:

1. modal pyta o potwierdzenie;
2. przy anulowaniu operacja się kończy;
3. przycisk `Zapisz` zostaje wyłączony;
4. ładowane są zależności Firebase;
5. wykonywane jest:

```js
documentRef.set(payload, { merge: false })
```

6. wyświetlany jest sukces lub błąd;
7. przycisk zostaje ponownie aktywowany w `finally`.

`merge:false` zastępuje cały dokument. Jeżeli dokument `v2` został usunięty, pierwszy poprawny zapis utworzy go ponownie z aktualnymi polami.

### Odczyt

Przebieg:

1. modal pyta o potwierdzenie;
2. przycisk `Wczytaj` zostaje wyłączony;
3. pobierany jest dokument `character_builder/v2`;
4. brak dokumentu powoduje błąd `Brak zapisanego stanu postaci.`;
5. payload jest walidowany;
6. stan jest przekazywany do `window.WNGCreatorV2.applyState(payload)`;
7. przycisk jest ponownie aktywowany.

### Walidacja

Wczytywanie wymaga dokładnie:

```text
schemaVersion = 3
module = Kalkulator/TworzeniePostaci_v2
```

Inne wersje lub identyfikatory są odrzucane. Nie ma migracji zapisów schematu `2`.

### Reguły bezpieczeństwa

Kod klienta nie definiuje reguł Firestore. Środowisko Firebase musi zezwalać temu klientowi na potrzebny odczyt i zapis dokumentu `character_builder/v2`.

Ponieważ moduł nie uwierzytelnia użytkownika, bezpieczeństwo i dostępność operacji zależą całkowicie od wdrożonych reguł projektu Firebase.

## Eksport PDF

### Zależności i zasoby

| Zasób | Adres / ścieżka |
| --- | --- |
| `pdf-lib` | `https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js` |
| `fontkit` | `https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js` |
| Noto Sans Regular | `https://cdn.jsdelivr.net/gh/notofonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf` |
| Szablon | `./pdf/pl.pdf` |

Eksport wymaga dostępu sieciowego do CDN dla bibliotek i fontu. Sam szablon PDF jest lokalny.

### Buforowanie

- `dependenciesPromise` współdzieli ładowanie bibliotek;
- pobieranie szablonu i fontu jest opakowane w osobne, zapamiętywane Promise;
- przy błędzie Promise zasobu jest zerowane, dzięki czemu kolejna próba może ponowić pobieranie;
- `warmupPromise` wstępnie uruchamia wszystkie trzy zadania.

Wstępne ładowanie jest uruchamiane jednorazowo po:

- `pointerenter` na przycisku eksportu;
- uzyskaniu fokusu przez przycisk;
- `touchstart` na przycisku.

Kliknięcie nadal wykonuje pełną kontrolę zależności, więc eksport działa także bez wcześniejszego warm-upu.

### Font

Noto Sans jest osadzany z `subset:true`. Zapewnia obsługę polskich znaków bez dołączania całego fontu.

### Nazwa pliku

```text
PL-RRRR-MM-DD-HHMM.pdf
```

Nazwa nie zawiera sekund, więc dwa eksporty wykonane w tej samej minucie mają taką samą nazwę logiczną.

### Pole tekstowe formularza

`setText()`:

- zamienia wartość na tekst;
- domyślnie pomija puste wartości;
- może wymusić zapis pustej/zerowej wartości przez `skipBlank=false`;
- dobiera rozmiar fontu według długości całego tekstu:
  - ponad 650 znaków — 6 pt;
  - ponad 420 — 7 pt;
  - ponad 240 — 8 pt;
  - pozostałe — 10 pt;
- aktualizuje wygląd pola osadzonym fontem;
- zapisuje ostrzeżenie, gdy pola nie ma lub nie udało się zaktualizować fontu.

### Mapowanie danych podstawowych

| Dane | Pole PDF |
| --- | --- |
| Poziom Gry | `Poziom` |
| Gatunek | `Gatunek` |
| Archetyp | `Archetyp` |
| Frakcja | `Frakcja` |
| Słowa Kluczowe, linia 1 | `Słowa Kluczowe` |
| Słowa Kluczowe, linia 2 | `Słowa Kluczowe 2` lub pole utworzone dynamicznie |
| Rozmiar | `Rozmiar` |
| końcowa Szybkość | `Szybkość` |
| atrybuty | pola `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd` |

Szybkość nie jest wpisywana przez pętlę atrybutów, lecz osobno jako końcowa wartość po premiach.

### Mapowanie cech pochodnych

| Wartość | Pole PDF |
| --- | --- |
| Upór | `Upór` |
| Odwaga | `Odwaga` |
| Obrona | `Obrona` |
| Odporność | `Bazowa Odporność` |
| Żywotność | `Maksymalna Żywotność` |
| Odporność Psychiczna | `Odporność Psychiczna` |
| Determinacja | `Determinacja` |
| Wpływy | `Wpływy` |
| Majątek | `Majątek` |
| Pasywna Czujność | `Pasywna Czujność` |

Nazwa widoczna w aplikacji `Żywotność` nie zmienia technicznej nazwy pola PDF `Maksymalna Żywotność`.

### Umiejętności

Dla każdej pozycji tablicy `SKILLS` eksportowane są:

- wartość samej umiejętności do `skill.pdf`;
- suma umiejętności i atrybutu do `skill.sum`.

Dokładne nazwy pól znajdują się w tabeli mapowania umiejętności w poprzedniej części dokumentu.

### Spaczenie i checkboxy

- `Check Box 1`–`Check Box 25` są zaznaczane kolejno, dopóki indeks jest mniejszy od końcowego Spaczenia;
- przy Spaczeniu większym niż 25 wszystkie 25 pól jest zaznaczone;
- dodatkowo obliczane jest `ceil((Spaczenie - 5) / 5)`, ograniczone do `0–4`;
- wynik zaznacza pierwsze pola z grupy `Check Box 26`–`Check Box 30`;
- z powodu ograniczenia do `4`, piąte pole tej grupy nie jest zaznaczane przez aktualny algorytm;
- aplikacja ostrzega, gdy Spaczenie przekracza 25.

### Normalizacja tekstu

Funkcja `compact()`:

- dzieli tekst na wiersze;
- usuwa zewnętrzne spacje każdego wiersza;
- usuwa puste wiersze;
- łączy pozostałe fragmenty separatorem ` / `.

W przypadku Słów Kluczowych separatory `/` są następnie zamieniane na `, `.

### Rozdział treści zasad i talentów

| Źródło | Obszar PDF |
| --- | --- |
| Wszystkie niepuste nazwy talentów | Zdolności i Talenty |
| Reguła typu `backgroundBonus` | Przeszłość |
| Reguła typu `archetypeAbility` z celem `none` | Zdolności i Talenty |
| Wszystkie pozostałe niepuste reguły | Notatki |

Do obszarów tekstowych trafia pole `Nazwa / opis`. Liczbowe `Wartość` nie jest wypisywane osobno. Mechaniczny efekt jest widoczny przez końcowe wartości cech pochodnych.

### Usuwane pola formularza

Przed ręcznym rysowaniem tekstu usuwane są:

- `Zdolności i talenty 1`–`Zdolności i talenty 8`;
- `Notatki 1`;
- `Przeszłość`.

Brak któregoś pola nie zatrzymuje eksportu.

### Obszary ręcznego rysowania

Numery stron są indeksowane od zera.

| Obszar | Strona | x | y | szerokość | wysokość | kolumny | font |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Zdolności i Talenty | 1 | 40 | 578 | 530 | 118 | 2–4 | 10–5 pt |
| Notatki | 1 | 25 | 40 | 410 | 135 | 2–4 | 10–5 pt |
| Przeszłość | 0 | 467 | 623 | 109 | 39 | 1–3 | 8–4 pt |

Między kolumnami stosowany jest odstęp `10` punktów. Wysokość linii wynosi `fontSize × 1.18`.

Algorytm próbuje kolejno:

1. najmniejszą dozwoloną liczbę kolumn;
2. font od największego do najmniejszego;
3. następnie większą liczbę kolumn.

Pierwszy wariant mieszczący wszystkie linie zostaje użyty. Gdy żaden wariant nie mieści treści, używane są maksymalna liczba kolumn i minimalny font, a nadmiar jest obcinany z ostrzeżeniem.

Każdy wpis rozpoczyna się od `- `. Linie kontynuacji używają wcięcia dwóch spacji. Wyraz dłuższy niż szerokość kolumny jest dzielony znak po znaku.

### Słowa Kluczowe

Konfiguracja obszaru:

```text
strona: 0
pierwsze pole: Słowa Kluczowe
drugie pole: Słowa Kluczowe 2
x drugiego pola: 275
y drugiego pola: 611
szerokość: 140
wysokość: 13
font: 10–4 pt
```

Algorytm zmniejsza font, aż tekst mieści się w maksymalnie dwóch liniach. Jeżeli nawet font 4 pt nie wystarcza, nadmiar jest pomijany i dodawane jest ostrzeżenie.

Jeżeli drugi wiersz jest potrzebny, a pole `Słowa Kluczowe 2` nie istnieje, kod próbuje utworzyć je dynamicznie. Gdy utworzenie pola się nie powiedzie, tekst jest rysowany bezpośrednio na stronie.

### Okno podglądu

Kliknięcie eksportu synchronicznie otwiera pustą kartę z komunikatem:

```text
Trwa rytuał transkrypcji danych dokumentu…
```

Po wygenerowaniu karta jest zastępowana adresem Blob PDF. Jeśli karta nie istnieje lub została zamknięta, kod wykonuje dodatkowe `window.open(url, '_blank')`.

Adres Blob jest zwalniany po 300000 ms, czyli po 5 minutach.

### Obsługa błędów i logowanie

- podczas eksportu przycisk jest wyłączony;
- ostrzeżenia nie zatrzymują eksportu i są łączone znakami nowej linii;
- błąd zatrzymujący eksport trafia do konsoli i `pdfLogMessage`;
- otwarte okno podglądu otrzymuje tekst błędu;
- w `finally` przycisk jest ponownie aktywowany;
- czasy etapów są logowane przez `console.info` po zaokrągleniu do milisekund.

Mierzone etapy obejmują zależności, zasoby, wczytanie szablonu, osadzenie fontu, populację, zapis i czas całkowity.

## Zależności sieciowe i tryb offline

Bez sieci:

- rdzeń kalkulatora, obliczenia i interfejs nadal działają;
- lokalna instrukcja i lokalny szablon PDF mogą być dostępne;
- Firebase nie zadziała, jeżeli wymagane SDK nie jest już w pamięci/przeglądarce;
- eksport PDF nie zadziała bez pobrania bibliotek oraz fontu z CDN, chyba że zostały wcześniej zbuforowane przez przeglądarkę.

## Bezpieczeństwo danych

- pola tekstowe dynamicznie umieszczane w HTML są escapowane przez `escapeHtml`;
- zapis Firestore zastępuje cały dokument, więc nie pozostawia usuniętych pól z poprzedniego schematu;
- aplikacja przechowuje jeden współdzielony snapshot w `character_builder/v2`;
- brak uwierzytelnienia oznacza, że kod klienta nie rozróżnia użytkowników;
- nie należy traktować `savedBy` jako kontroli dostępu;
- reguły Firestore powinny ograniczać zakres dostępu dokładnie do potrzeb aplikacji.

## Znane ograniczenia

1. Zapisy nie są przypisane do kont użytkowników — wszyscy klienci korzystający z dokumentu `v2` widzą ten sam stan, o ile reguły pozwalają.
2. Nie ma historii ani wielu slotów zapisu.
3. Nie ma migracji schematów starszych niż `3`.
4. Gatunek i tabela maksimów nie ograniczają automatycznie wartości atrybutów.
5. Vespidzi wymagają ręcznego zastosowania przypisu dotyczącego Szybkości 14 i kosztu PD.
6. Szybkość jest technicznie ograniczana do 12 przez wspólny zakres atrybutów, mimo referencyjnej wartości Vespidów 14*.
7. Pole języka jest ukryte; interfejs v2, instrukcja i eksport są polskie.
8. Eksport PDF wymaga zewnętrznych CDN.
9. Długie treści w ręcznie rysowanych obszarach mogą zostać obcięte z ostrzeżeniem.
10. Piąty checkbox poziomu Spaczenia (`Check Box 30`) nie jest zaznaczany przez aktualne ograniczenie `levelMarks` do 4.
11. Modal nie implementuje pełnego focus trap ani przywracania fokusu do elementu otwierającego.
12. `data` zapisu zawiera także wartości pochodne, mimo że przy odczycie są ponownie przeliczane.
13. Pasywna Czujność nie może być modyfikowana regułami specjalnymi.
14. Puste pole talentu z dodatnim kosztem zużywa PD, choć nie pojawi się w PDF.
15. Nazwa pliku PDF ma dokładność jednej minuty.

## Checklista testów manualnych

### Uruchomienie

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start | Otwórz `Kalkulator/TworzeniePostaci_v2.html`. | Tabele zostają wygenerowane, pozostałe PD jest przeliczone. |
| Nawigacja | Kliknij `Strona Główna`. | Następuje przejście do `Main/index.html`. |
| Instrukcja | Kliknij `Instrukcja`. | Otwiera się `HowToUse/pl.pdf`. |
| Modal cech | Kliknij `Cechy i zasady specjalne`. | Modal otwiera się i można go zamknąć przyciskiem, tłem i Escape. |
| Maksima | Kliknij `Maksymalne wartości atrybutów`. | Otwiera się tabela referencyjna z przypisem Vespidów. |

### PD i walidacja

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Koszt atrybutu | Ustaw wartość 4. | Do kosztu trafia 20 PD. |
| Koszt umiejętności | Ustaw wartość 4. | Do kosztu trafia 20 PD. |
| Koszt talentu | Wpisz koszt 15. | Pozostałe PD maleje o 15. |
| Clamp | Wpisz atrybut 99 i wywołaj przeliczenie. | Pole zostaje skorygowane do 12. |
| Przekroczenie puli | Ustaw koszty ponad pulę. | Pojawia się błąd przekroczenia PD. |
| Drzewo Nauki | Ustaw wysoką umiejętność bez wymaganej podstawy. | Pojawia się błąd Drzewa Nauki. |

### Zasady i cechy pochodne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Opis bez modyfikatora | Wybierz `Opis / brak modyfikatora`. | Wartość zmienia się na 0, jest wyszarzona i nieedytowalna. |
| Ponowne aktywowanie | Wybierz następnie konkretną cechę. | Pole jest aktywne i ma wartość 0. |
| Sumowanie | Dodaj do tej samej cechy +2 i -1. | Kolumna Premia pokazuje +1. |
| Malutki | Ustaw rozmiar Malutki bez reguł Obrony. | Premia Obrony pokazuje +2. |
| Przykład mieszany | Dla Malutkiego dodaj +1 i -1 do Obrony. | Premia Obrony pokazuje +2. |
| Wpływy | Zmień atrybut z Ogd na SW. | Wynik Wpływów używa SW - 1 + Premia. |
| Spaczenie ujemne | Dodaj -2 do Spaczenia. | Premia pokazuje -2, wynik 0, pojawia się ostrzeżenie. |
| Spaczenie dodatnie | Dodaj +3 do Spaczenia. | Wynik wynosi 3. |
| Pasywna Czujność | Zmień Czujność lub Int. | Wynik aktualizuje się jako sufit połowy sumy. |

### Firebase

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Pierwszy zapis | Usuń dokument `v2`, ustaw dane i zapisz. | Firestore tworzy `character_builder/v2` ze schematem 3. |
| Nadpisanie | Usuń wpis formularza i zapisz ponownie. | Nieaktualne pole nie pozostaje w dokumencie. |
| Wczytanie | Zmień lokalne dane i kliknij `Wczytaj`. | Formularz odtwarza zapis i przelicza wartości. |
| Brak dokumentu | Wczytaj przy nieistniejącym `v2`. | Pojawia się komunikat o braku zapisu. |
| Zły schemat | Ustaw ręcznie inny `schemaVersion`. | Wczytanie zostaje odrzucone. |
| Brak uprawnień | Zablokuj zapis regułami. | Pojawia się błąd; nie powstaje `test-v2`. |

### PDF

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Podstawowy eksport | Kliknij `Eksportuj PDF`. | Otwiera się karta z wygenerowanym PDF. |
| Polskie znaki | Wpisz tekst z `ąćęłńóśźż`. | Znaki są poprawnie osadzone. |
| Sumy umiejętności | Ustaw umiejętność i atrybut. | Pole `Suma` w PDF zawiera ich sumę. |
| Żywotność | Zmień Wt, poziom i premię. | `Maksymalna Żywotność` w PDF zawiera końcowy wynik. |
| Przeszłość | Dodaj wpis `Premia z Przeszłości`. | Tekst trafia do obszaru Przeszłość. |
| Archetyp opisowy | Dodaj `Zdolność Archetypu` bez modyfikatora. | Tekst trafia do Zdolności i Talentów. |
| Notatki | Dodaj inną regułę. | Tekst trafia do Notatek. |
| Długie Słowa Kluczowe | Wprowadź tekst wymagający dwóch linii. | Używane jest drugie pole lub awaryjne rysowanie. |
| Nadmiar treści | Wprowadź bardzo długi zestaw notatek. | PDF powstaje; log zawiera ostrzeżenie o pominiętych liniach. |
| Spaczenie | Ustaw premię Spaczenia. | Odpowiednia liczba checkboxów jest zaznaczona. |

## Zasady utrzymania

Przy zmianach w v2 należy zachować następujące kontrakty:

1. `TworzeniePostaci_v2-core.js` jest źródłem prawdy dla danych formularza i obliczeń.
2. Firebase i PDF powinny korzystać z `window.WNGCreatorV2`, zamiast duplikować obliczenia.
3. Zmiana struktury zapisu wymagająca zerwania kompatybilności powinna zwiększyć `SCHEMA_VERSION`.
4. Zmiana nazw technicznych pól PDF wymaga aktualizacji szablonu lub mapowania w `TworzeniePostaci_v2-pdf.js`.
5. Zmiana kluczy `SKILLS` albo `ATTRIBUTES` wymaga sprawdzenia zapisu, odczytu, kosztów i eksportu.
6. Dodanie nowego celu reguły wymaga aktualizacji `RULE_TARGETS`, `bonuses`, `raw`, renderowania tabeli i ewentualnego mapowania PDF.
7. Pole opisowe `none` powinno nadal wymuszać `value:0` i stan `disabled`.
8. Premia rozmiaru powinna pozostawać częścią kolumny `Premia`, nie tekstu `Podstawa`.
9. Techniczny klucz `woundsMax` i pole PDF `Maksymalna Żywotność` mogą pozostać niezmienione mimo etykiety interfejsu `Żywotność`.
10. Po zmianach należy wykonać testy zapisu/wczytania i eksportu PDF w rzeczywistej przeglądarce.

---

# 🇬🇧 Technical documentation — Advanced Character Creator v2 (EN)

## Purpose

`Kalkulator/TworzeniePostaci_v2.html` is the advanced, Polish-language character creator for `Wrath & Glory`. It calculates XP expenditure, validates the learning tree, manages descriptive and mechanical special rules, derives secondary statistics, saves one shared Firestore snapshot, and exports the Polish character-sheet PDF.

This section is an English technical reference to the same implementation documented above.

## Active files

| File | Responsibility |
| --- | --- |
| `TworzeniePostaci_v2.html` | Static DOM, inline visual overrides, modal containers, buttons and script order. |
| `TworzeniePostaci_v2-core.js` | Dynamic tables, XP costs, validation, computed statistics, rules, state API and modal helpers. |
| `TworzeniePostaci_v2-firebase.js` | Lazy Firebase loading and schema-3 save/load at `character_builder/v2`. |
| `TworzeniePostaci_v2-pdf.js` | Lazy PDF dependencies, template filling, text layout and preview. |
| `kalkulatorxp.css` | Shared base styles. |
| `config/firebase-config.js` | Defines `window.firebaseConfig`. |
| `pdf/pl.pdf` | Polish PDF template. |
| `HowToUse/pl.pdf` | Manual opened by the UI. |
| `Modal_Icon.png` | Confirmation-dialog image. |

## Script contract

Scripts load in this order:

1. core;
2. Firebase;
3. PDF.

The core exposes:

```js
window.WNGCreatorV2 = {
  ATTRIBUTES,
  SKILLS,
  getState,
  applyState,
  getComputedData,
  recalcXP,
  showConfirmation,
  showInfo
};
```

Firebase and PDF depend on this object.

## Defaults

- XP pool: `155`;
- attributes: `1`, except Speed `6`;
- skills: `0`;
- game tier: `1`;
- size: `Średni`;
- talent slots: `2`;
- five default special-rule rows;
- Influence attribute: `Ogd`;
- Corruption base: fixed `0`, with no manual input.

## XP tables

### Attributes

```text
1:0, 2:4, 3:10, 4:20, 5:35, 6:55,
7:80, 8:110, 9:145, 10:185, 11:230, 12:280
```

### Skills

```text
0:0, 1:2, 2:6, 3:12, 4:20,
5:30, 6:42, 7:56, 8:72
```

Remaining XP equals the XP pool minus all attribute costs, all skill costs and all manual talent costs. Special rules have no XP cost.

## Learning Tree validation

For every rating from 2 through 8:

```text
count(skills >= rating - 1) >= 2 × count(skills >= rating)
```

Failure displays the Polish learning-tree error. A negative remaining XP displays a separate error.

## Skill totals

Every skill total is `skill + linked attribute`.

- Int: Analysis, Awareness, Tech, Medicae, Scholar;
- S: Athletics;
- SW: Leadership, Psychic Mastery, Survival, Intimidation;
- Ogd: Insight, Deception, Persuasion, Cunning;
- Zr: Pilot, Stealth, Ballistic Skill;
- I: Weapon Skill.

The exact PDF field names are stored in the `SKILLS` table in the core and are listed in the Polish section.

## Computed statistics

| Statistic | Raw formula |
| --- | --- |
| Wounds | `Wt + 2 × Tier + bonus` |
| Shock | `SW + Tier + bonus` |
| Determination | `Wt + bonus` |
| Defence | `I - 1 + size bonus + rule bonus` |
| Resilience | `Wt + 1 + bonus` |
| Resolve | `SW + bonus` |
| Conviction | `SW - 1 + bonus` |
| Influence | `selected attribute - 1 + bonus` |
| Wealth | `Tier + bonus` |
| Corruption | `rule bonus` |
| Speed | `Speed attribute + bonus` |
| Passive Awareness | `ceil((Awareness + Int) / 2)` |

Corruption uses `max(0, ceil(raw))`. Every other computed statistic uses `max(1, ceil(raw))`.

The visible Bonus column uses a leading plus sign for positive values. Defence combines its size modifier and all rule modifiers into one displayed bonus.

Size Defence bonuses are `Malutki +2`, `Mały +1`, and `0` for all other listed sizes.

## Special rules

Each rule stores:

```js
{ type, name, target, value }
```

Targets other than `none` are summed algebraically by target.

When target is `none`:

- the value is forced to `0`;
- the input is disabled and visually dimmed;
- collected and saved data always contains `value:0`.

Rule types control placeholders and PDF routing. They do not independently change calculations.

PDF routing:

- `backgroundBonus` → Background;
- descriptive `archetypeAbility` (`target:none`) → Abilities and Talents;
- all other rules → Notes;
- all non-empty talent names → Abilities and Talents.

## State model

```js
{
  xpPool,
  talentCount,
  data: {
    attrs,
    skills,
    skillTotals,
    character,
    rules,
    bonuses,
    raw,
    values,
    influenceAttribute,
    talents
  }
}
```

Input fields are the source of truth. Computed fields are recalculated after loading.

## Firestore

Path:

```text
character_builder/v2
```

Payload:

```js
{
  schemaVersion: 3,
  module: 'Kalkulator/TworzeniePostaci_v2',
  savedAt: serverTimestamp(),
  savedBy: 'anonymous-web-client',
  xpPool,
  talentCount,
  data
}
```

Save uses `set(payload, { merge:false })`, so it creates a missing document or fully replaces an existing one.

Load requires the exact schema version and module name. There is no `test-v2` fallback and no schema-2 migration.

Firebase App and Firestore version `8.10.1` are loaded lazily. Authentication is not loaded; the static `savedBy` value is not a user identity.

## PDF export

Dependencies:

- `pdf-lib 1.17.1` from jsDelivr;
- `@pdf-lib/fontkit 1.1.1` from jsDelivr;
- Noto Sans Regular from the Noto font repository CDN;
- local `pdf/pl.pdf` template.

Dependencies, template bytes and font bytes are cached as promises. Warm-up starts on pointer hover, focus or touch of the export button.

The exported file name is:

```text
PL-YYYY-MM-DD-HHMM.pdf
```

The PDF receives:

- character metadata;
- final Speed;
- seven non-Speed attributes;
- all skill values and totals;
- final derived values;
- Corruption checkboxes;
- dynamically laid-out Abilities, Notes and Background text.

The visible UI label `Żywotność` maps to the PDF field `Maksymalna Żywotność`.

Manual text areas use adaptive columns and font size. Overflow is truncated with warnings. Keywords use up to two lines and font sizes from 10 to 4 pt; a second field is created when needed.

A preview tab is opened synchronously, then replaced with the generated Blob URL. The URL is revoked after five minutes. Timing information is written to the browser console.

## Styling and responsive behavior

The page uses the shared monospace stack and a black/green terminal aesthetic. Inline CSS controls the main 1100px container, tables, modals, disabled inputs, derived-stat column widths and mobile minimum table widths.

The computed-stat table uses `25% / 47% / 14% / 14%` columns. Bonus and Result are equally wide and centered.

At widths up to 760px, large tables retain minimum widths and scroll horizontally inside their wrappers.

## Important limitations

- one shared Firestore document, no per-user slots or history;
- no authentication in this module;
- no legacy save migration;
- species maxima are reference-only;
- Vespid Speed 14 is not automatically supported by the attribute clamp of 12;
- PDF export depends on external CDNs;
- very long PDF text can be truncated;
- the fifth Corruption-level checkbox is not reached by the current `0–4` clamp;
- the language selector is hidden and v2 is currently Polish-only;
- no complete modal focus trap;
- empty talent names may still consume XP when a cost is entered.

## Minimum regression checklist

After changing the module, verify:

1. attribute and skill clamping and XP costs;
2. learning-tree validation;
3. derived formulas and minimum values;
4. Defence size bonus aggregation;
5. disabled zero value for descriptive rules;
6. save, load and schema validation at `character_builder/v2`;
7. Polish characters and all PDF field mappings;
8. keyword two-line behavior and long-text overflow warnings;
9. modal closing by button, overlay and Escape;
10. responsive horizontal scrolling.

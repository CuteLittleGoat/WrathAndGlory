# 🇵🇱 Instrukcja użytkownika — DiceRoller (PL)

## Do czego służy moduł

`DiceRoller` wykonuje rzuty kośćmi do testów w systemie Wrath & Glory.

Moduł pozwala wpisać:

- stopień trudności testu,
- pulę kości,
- liczbę kości Furii.

Po kliknięciu przycisku moduł losuje wyniki, pokazuje animowane kości i od razu podsumowuje wynik testu.

## Jak uruchomić moduł

Otwórz plik:

```text
DiceRoller/index.html
```

Moduł działa w przeglądarce. Nie wymaga logowania, Firebase ani połączenia z bazą danych.

## Co widać po otwarciu

Po otwarciu modułu widać:

- przełącznik języka w prawym górnym rogu,
- przycisk `Strona Główna`,
- tytuł `DiceRoller`,
- trzy pola liczbowe,
- przycisk `Rzuć Kośćmi!`,
- obszar wyników,
- pusty panel podsumowania z komunikatem startowym.

## Podstawowa obsługa

1. W polu `Stopień Trudności` wpisz liczbę sukcesów wymaganą do zdania testu.
2. W polu `Pula Kości` wpisz łączną liczbę rzucanych kości.
3. W polu `Ilość Kości Furii` wpisz liczbę czerwonych kości Furii.
4. Kliknij `Rzuć Kośćmi!`.
5. Poczekaj na zakończenie animacji.
6. Odczytaj wynik w panelu podsumowania.

## Przyciski i akcje

| Przycisk / element | Co robi |
| --- | --- |
| `Rzuć Kośćmi!` | Losuje wyniki kości i pokazuje podsumowanie testu. |
| `Strona Główna` | Przenosi do modułu `Main` pod adresem `../Main/index.html`. |
| Przełącznik języka | Zmienia język interfejsu między polskim i angielskim. Zmiana języka resetuje pola i czyści aktualny wynik. |

## Pola formularza

| Pole | Znaczenie |
| --- | --- |
| `Stopień Trudności` | Liczba punktów sukcesu potrzebna do zdania testu. |
| `Pula Kości` | Łączna liczba rzucanych kości. |
| `Ilość Kości Furii` | Liczba czerwonych kości Furii. Nie może być większa niż pula kości. |

Wszystkie pola liczbowe są ograniczane do zakresu od 1 do 99.

Domyślne wartości startowe:

| Pole | Wartość |
| --- | --- |
| `Stopień Trudności` | `3` |
| `Pula Kości` | `2` |
| `Ilość Kości Furii` | `1` |

## Jak czytać wynik

Po rzucie moduł pokazuje:

- wynik testu: `Sukces!` albo `Porażka!`,
- ewentualną `Komplikację Furii`,
- ewentualną `Krytyczną Furię`,
- możliwe `Przeniesienie`,
- łączną liczbę punktów,
- stopień trudności,
- listę wszystkich kości i liczbę punktów z każdej z nich.

## Punkty z kości

| Wynik na kości | Punkty sukcesu |
| --- | --- |
| `1`, `2`, `3` | `0` |
| `4`, `5` | `1` |
| `6` | `2` |

Test jest zdany, jeżeli łączna liczba punktów jest równa albo większa od `Stopnia Trudności`.

## Kości Furii

Kości Furii są czerwone i zawsze znajdują się na początku puli kości.

Moduł sprawdza czerwone kości po rzucie:

- jeżeli wszystkie kości Furii pokazują `6`, pojawia się `Krytyczna Furia`,
- jeżeli nie ma Krytycznej Furii i przynajmniej jedna kość Furii pokazuje `1`, pojawia się `Komplikacja Furii`,
- jeżeli żaden z tych warunków nie zachodzi, nie pojawia się dodatkowy komunikat Furii.

## Przeniesienie

`Możliwe Przeniesienie` pojawia się tylko przy sukcesie.

Moduł liczy je na podstawie:

- nadwyżki punktów ponad Stopień Trudności,
- liczby wszystkich szóstek w rzucie.

Wynik pokazuje maksymalną liczbę możliwych przeniesień według logiki zaimplementowanej w module.

## Tryb użytkownika

Moduł ma jeden zwykły tryb użytkownika.

Nie ma:

- trybu admina,
- logowania,
- zapisywania wyników,
- historii rzutów,
- importu ani eksportu danych.

## Zapisywanie i wczytywanie danych

Moduł nie zapisuje wyników rzutów.

Po odświeżeniu strony albo zmianie języka wynik zostaje wyczyszczony, a pola wracają do wartości startowych.

## Komunikaty i błędy

| Komunikat / sytuacja | Znaczenie | Co zrobić |
| --- | --- | --- |
| `Wpisz parametry i rzuć kośćmi, aby zobaczyć wynik.` | Nie wykonano jeszcze rzutu albo wynik został zresetowany. | Ustaw pola i kliknij `Rzuć Kośćmi!`. |
| `Rzut w toku...` | Trwa animacja rzutu. | Poczekaj na podsumowanie. |
| `Sukces!` | Test został zdany. | Odczytaj szczegóły wyniku. |
| `Porażka!` | Test nie osiągnął wymaganego progu. | Odczytaj liczbę punktów i zdecyduj o konsekwencjach w grze. |
| `Krytyczna Furia` | Wszystkie kości Furii wyrzuciły `6`. | Zastosuj odpowiedni efekt przy stole. |
| `Komplikacja Furii` | Co najmniej jedna kość Furii wyrzuciła `1`, a nie wystąpiła Krytyczna Furia. | Zastosuj komplikację zgodnie z sytuacją w grze. |
| `Możliwe Przeniesienie` | Test zdał z nadwyżką. | Gracz może wykorzystać wskazaną liczbę przeniesień, jeżeli zasady i sytuacja na to pozwalają. |

## Typowe problemy

### Liczba kości Furii sama się zmienia

Jeżeli `Ilość Kości Furii` jest większa niż `Pula Kości`, moduł automatycznie zmniejsza liczbę kości Furii do wartości puli.

### Pole nie przyjmuje zera

To aktualne zachowanie modułu. Wszystkie pola mają zakres od 1 do 99.

### Wynik zniknął po zmianie języka

Zmiana języka resetuje pola i czyści wynik. Najpierw wybierz język, a dopiero potem wykonaj rzut.

### Przycisk `Strona Główna` nie prowadzi do menu

Przycisk ma stały link do `../Main/index.html`. Jeżeli pliki zostały przeniesione do innego układu folderów, link może wymagać aktualizacji w kodzie.

---

# 🇬🇧 User guide — DiceRoller (EN)

## What this module is for

`DiceRoller` resolves dice tests for Wrath & Glory.

The module lets you enter:

- the difficulty number,
- the dice pool,
- the number of Wrath dice.

After clicking the roll button, the module rolls the dice, shows animated dice, and immediately summarizes the test result.

## How to open the module

Open:

```text
DiceRoller/index.html
```

The module runs in the browser. It does not require login, Firebase, or database access.

## What you see after opening it

After opening the module, you see:

- a language selector in the upper-right corner,
- the `Main Page` button,
- the `DiceRoller` title,
- three numeric fields,
- the `Roll the dice!` button,
- the dice result area,
- an empty summary panel with a starting message.

## Basic use

1. In `Difficulty Number`, enter how many success points are required.
2. In `Dice Pool`, enter the total number of dice.
3. In `Number of Wrath Dice`, enter the number of red Wrath dice.
4. Click `Roll the dice!`.
5. Wait for the animation to finish.
6. Read the result in the summary panel.

## Buttons and actions

| Button / element | What it does |
| --- | --- |
| `Roll the dice!` | Rolls the dice and shows the test summary. |
| `Main Page` | Opens the `Main` module at `../Main/index.html`. |
| Language selector | Switches the interface between Polish and English. Changing language resets the fields and clears the current result. |

## Form fields

| Field | Meaning |
| --- | --- |
| `Difficulty Number` | Number of success points required to pass the test. |
| `Dice Pool` | Total number of rolled dice. |
| `Number of Wrath Dice` | Number of red Wrath dice. It cannot be greater than the dice pool. |

All numeric fields are clamped to the range from 1 to 99.

Starting values:

| Field | Value |
| --- | --- |
| `Difficulty Number` | `3` |
| `Dice Pool` | `2` |
| `Number of Wrath Dice` | `1` |

## How to read the result

After a roll, the module shows:

- the test result: `Success!` or `Failure!`,
- possible `Wrath Complication`,
- possible `Wrath Critical`,
- possible `Possible Shift`,
- total points,
- difficulty number,
- a list of all dice and points from each die.

## Points from dice

| Die result | Success points |
| --- | --- |
| `1`, `2`, `3` | `0` |
| `4`, `5` | `1` |
| `6` | `2` |

The test succeeds when total points are equal to or greater than the `Difficulty Number`.

## Wrath dice

Wrath dice are red and always appear at the beginning of the dice pool.

The module checks red dice after the roll:

- if all Wrath dice show `6`, `Wrath Critical` appears,
- if there is no Wrath Critical and at least one Wrath die shows `1`, `Wrath Complication` appears,
- if neither condition applies, no extra Wrath message appears.

## Shift

`Possible Shift` appears only on success.

The module calculates it from:

- the margin above the Difficulty Number,
- the number of all sixes in the roll.

The displayed value is the maximum number of possible shifts according to the logic implemented in the module.

## User mode

The module has one regular user mode.

It has no:

- admin mode,
- login,
- result saving,
- roll history,
- data import or export.

## Saving and loading data

The module does not save roll results.

After refreshing the page or changing language, the result is cleared and fields return to their starting values.

## Messages and errors

| Message / situation | Meaning | What to do |
| --- | --- | --- |
| `Enter your parameters and roll the dice to see the result.` | No roll has been made yet, or the result was reset. | Set the fields and click `Roll the dice!`. |
| `Rolling the dice...` | Roll animation is in progress. | Wait for the summary. |
| `Success!` | The test passed. | Read the result details. |
| `Failure!` | The test did not reach the required threshold. | Read the point total and decide the in-game consequences. |
| `Wrath Critical` | All Wrath dice rolled `6`. | Apply the appropriate table effect. |
| `Wrath Complication` | At least one Wrath die rolled `1`, and no Wrath Critical occurred. | Apply a complication fitting the game situation. |
| `Possible Shift` | The test passed with extra margin. | The player can use the displayed number of shifts if the rules and situation allow it. |

## Common problems

### Number of Wrath dice changes by itself

If `Number of Wrath Dice` is greater than `Dice Pool`, the module automatically lowers it to the pool value.

### A field does not accept zero

This is the current module behavior. All fields use the range from 1 to 99.

### The result disappeared after changing language

Changing language resets fields and clears the result. Choose the language first, then roll.

### The `Main Page` button does not open the menu

The button has a fixed link to `../Main/index.html`. If files are moved to a different folder layout, the link may need to be updated in the code.

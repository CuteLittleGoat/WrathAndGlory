# 🇵🇱 Instrukcja użytkownika — Kalkulator (PL)

## Do czego służy Kalkulator

`Kalkulator` to zestaw narzędzi do liczenia kosztów rozwoju i tworzenia postaci w `Wrath & Glory`.

Moduł zawiera stronę startową oraz narzędzia dostępne z przycisków:

- stronę startową `Kozie Liczydła`,
- `Kalkulator PD`,
- `Prosty Kreator Postaci`,
- `Zaawansowany Kreator Postaci`.

Strona startowa pozwala wybrać narzędzie. `Kalkulator PD` służy do szybkiego liczenia kosztu podniesienia atrybutów i umiejętności. `Prosty Kreator Postaci` służy do planowania całej postaci z pulą PD, talentami, walidacją i opcjonalnym zapisem. `Zaawansowany Kreator Postaci` prowadzi do osobnej strony `Kalkulator/TworzeniePostaci_v2.html`, która może zostać przygotowana jako rozbudowany kreator.

## Jak otworzyć moduł

Strona startowa:

```text
Kalkulator/index.html
```

Bezpośrednio Kalkulator PD:

```text
Kalkulator/KalkulatorXP.html
```

Bezpośrednio Prosty Kreator Postaci:

```text
Kalkulator/TworzeniePostaci.html
```

Po otwarciu widoku `Prosty Kreator Postaci` karta przeglądarki ma tytuł `Prosty Kreator Postaci`.

Bezpośrednio Zaawansowany Kreator Postaci:

```text
Kalkulator/TworzeniePostaci_v2.html
```

Przycisk zaawansowanego kreatora prowadzi do tej ścieżki, nawet jeżeli plik zostanie uzupełniony później.

## Strona startowa

Na stronie startowej znajdziesz:

- logo modułu,
- przycisk `Kalkulator PD` w lewej kolumnie,
- przycisk `Prosty Kreator Postaci` w prawej kolumnie,
- przycisk `Zaawansowany Kreator Postaci` bezpośrednio pod prostym kreatorem,

## Kalkulator PD — do czego służy

`Kalkulator PD` służy do szybkiego sprawdzenia, ile kosztuje podniesienie atrybutu albo umiejętności z wartości aktualnej do docelowej.

Przykład użycia:

- aktualna wartość atrybutu: `3`,
- docelowa wartość atrybutu: `5`,
- kalkulator pokazuje koszt różnicy.

To narzędzie jest pomocnicze. Nie zapisuje pełnej postaci.

## Kalkulator PD — krok po kroku

1. Otwórz `Kalkulator/KalkulatorXP.html`.
2. Wybierz język, jeżeli potrzebujesz wersji EN zamiast PL.
3. W tabeli atrybutów wpisz wartości aktualne i docelowe.
4. W tabeli umiejętności wpisz wartości aktualne i docelowe.
5. Sprawdź koszt w poszczególnych wierszach.
6. Sprawdź całkowity koszt PD na górze widoku.
7. Kliknij `Resetuj wartości`, jeśli chcesz zacząć od nowa.
8. Kliknij `Strona Główna`, aby wrócić do głównego menu aplikacji.

## Zakresy wartości w Kalkulatorze PD

Kalkulator ogranicza wartości do bezpiecznych zakresów:

| Typ | Zakres |
| --- | --- |
| Atrybuty | `0..12` |
| Umiejętności | `0..8` |

Jeżeli wpiszesz wartość spoza zakresu, zostanie ograniczona do dozwolonej wartości.

Jeżeli wartość docelowa jest taka sama albo niższa od aktualnej, koszt wynosi `0`.

## Tabela maksymalnych wartości atrybutów

W `Kalkulatorze PD` znajduje się tabela maksymalnych wartości atrybutów dla gatunków.

Tabela ma charakter referencyjny. Nie uzupełnia pól automatycznie.

## Prosty Kreator Postaci — do czego służy

`Prosty Kreator Postaci` to większy arkusz do planowania wydatków PD dla jednej postaci.

Pozwala ustawić:

- pulę PD,
- atrybuty,
- umiejętności,
- talenty i inne koszty,
- język interfejsu,
- zapis i wczytanie aktualnego stanu postaci.

## Prosty Kreator Postaci — krok po kroku

1. Otwórz `Kalkulator/TworzeniePostaci.html`.
2. Ustaw pulę PD w polu `Pula PD`. Domyślnie jest to `155`.
3. Ustaw wartości atrybutów.
4. Ustaw wartości umiejętności.
5. Wpisz talenty albo inne wydatki w sekcji talentów.
6. Obserwuj pole pozostałych PD.
7. Sprawdź, czy nie pojawia się komunikat błędu.
8. Otwórz instrukcję PDF, jeżeli potrzebujesz pomocy.
9. Otwórz tabelę maksymalnych wartości atrybutów, jeżeli chcesz sprawdzić limity gatunku.
10. Zapisz postać, jeżeli chcesz wrócić do niej później.

## Pula PD

Pole `Pula PD` określa, ile punktów masz do wydania.

Domyślna wartość to:

```text
155
```

Jeżeli wydasz więcej punktów, niż masz w puli, moduł pokaże błąd przekroczenia PD.

## Atrybuty

W arkuszu tworzenia postaci dostępne są atrybuty:

- `S`,
- `Wt`,
- `Zr`,
- `I`,
- `SW`,
- `Int`,
- `Ogd`,
- `Szybkość`.

Większość atrybutów domyślnie zaczyna od `1`.

`Szybkość` domyślnie zaczyna od `6`.

Dopuszczalny zakres atrybutów to `1..12`.

## Umiejętności

Umiejętności mają zakres:

```text
0..8
```

Wartość `0` oznacza brak wykupionego poziomu.

Moduł automatycznie dolicza koszt każdej umiejętności do całkowitego wydatku PD.

## Talenty i inne wydatki

Sekcja talentów ma 20 pól.

Każdy wpis ma:

- nazwę,
- koszt.

Możesz używać tej sekcji nie tylko do talentów, ale też do innych kosztów, które chcesz ręcznie doliczyć do postaci.

Koszt wpisany w polu kosztu jest dodawany bezpośrednio do wydanych PD.

## Pozostałe PD i komunikaty błędów

Arkusz automatycznie oblicza:

- wydane PD,
- pozostałe PD,
- błędy walidacji.

Najważniejsze komunikaty:

| Komunikat | Znaczenie |
| --- | --- |
| Przekroczenie puli PD | Wydano więcej punktów, niż jest dostępne w puli. |
| Drzewo Nauki / Tree of Learning | Układ poziomów umiejętności narusza zasadę wymaganą przez arkusz. |

Błąd Drzewa Nauki jest pokazywany tylko wtedy, gdy pula PD nie jest przekroczona.

## Drzewo Nauki

Arkusz sprawdza uproszczoną zasadę Drzewa Nauki.

W praktyce oznacza to, że bardzo wysoki poziom pojedynczej umiejętności wymaga odpowiedniej liczby aktywnych umiejętności.

Jeżeli zobaczysz błąd Drzewa Nauki, obniż poziom najwyższej umiejętności albo dodaj poziomy w innych umiejętnościach.

## Tabela maksymalnych wartości atrybutów

W `Prosty Kreator Postaci` przycisk `Maksymalne wartości atrybutów` otwiera modal z limitami gatunków.

Tabela jest podpowiedzią. Nie zmienia automatycznie pól formularza.

Przy Vespidach wartość `Szybkość 14*` ma przypis. Oznacza, że Vespidzi mają stałą Szybkość 14, a pole Szybkość należy ręcznie pominąć przy liczeniu PD.

## Instrukcja PDF

Przycisk `Instrukcja` albo `Manual` otwiera plik pomocy dla aktualnego języka.

Dla języka polskiego otwierany jest:

```text
HowToUse/pl.pdf
```

Dla języka angielskiego otwierany jest:

```text
HowToUse/en.pdf
```

## Zmiana języka

`Kalkulator PD` pozwala zmienić język bez resetowania wpisanych wartości.

`Tworzenie Postaci` nie pokazuje rozwijanego menu zmiany języka. Arkusz otwiera się w domyślnym języku, a widoczne przyciski w prawym górnym rogu służą do otwarcia instrukcji, powrotu do strony głównej i sprawdzenia maksymalnych wartości atrybutów.

## Reset

W `Kalkulatorze PD` reset ustawia pola na `0`.

W `Tworzeniu Postaci` reset przywraca wartości startowe:

- pula PD: `155`,
- atrybuty: wartości domyślne,
- umiejętności: `0`,
- talenty i koszty: puste lub `0`.

## Zapis i wczytanie postaci

W `Tworzeniu Postaci` dostępne są przyciski zapisu i wczytania.

Zapis zachowuje aktualny stan formularza.

Wczytanie przywraca zapisany stan.

Ta funkcja wymaga poprawnej konfiguracji Firebase. Jeżeli konfiguracja nie działa, moduł pokaże komunikat błędu w modalu.

## Co jest zapisywane

Zapis obejmuje między innymi:

- język,
- pulę PD,
- wydane PD,
- pozostałe PD,
- atrybuty,
- umiejętności,
- talenty,
- stan pól formularza,
- widoczne komunikaty walidacji.

## Typowe komunikaty i co zrobić

| Komunikat lub sytuacja | Co oznacza | Co zrobić |
| --- | --- | --- |
| Pozostałe PD jest ujemne | Wydano za dużo PD. | Zmniejsz wartości albo zwiększ pulę PD. |
| Błąd Drzewa Nauki | Układ umiejętności narusza regułę arkusza. | Dodaj inne aktywne umiejętności albo obniż najwyższy poziom. |
| Pole wraca do wartości domyślnej | Wpis był pusty albo nieprawidłowy. | Wpisz liczbę z dozwolonego zakresu. |
| Nie działa zapis | Firebase nie jest skonfigurowany albo jest niedostępny. | Zgłoś adminowi technicznemu. |
| Nie działa wczytanie | Brak zapisanego dokumentu albo Firebase jest niedostępny. | Najpierw zapisz postać albo zgłoś adminowi. |
| Nie widzę zmiany języka w arkuszu tworzenia postaci | To prawidłowe zachowanie. | Korzystaj z arkusza w domyślnym języku; widoczne przyciski służą do instrukcji, powrotu i tabeli maksimów. |
| PDF instrukcji się nie otwiera | Brakuje pliku albo przeglądarka blokuje otwarcie. | Sprawdź popupy i obecność plików `HowToUse`. |

## Krótki workflow — Kalkulator PD

1. Otwórz `Kalkulator/KalkulatorXP.html`.
2. Wpisz aktualne i docelowe wartości.
3. Sprawdź koszt wiersza i sumę całkowitą.
4. Zmień wartości, aż uzyskasz potrzebny koszt.
5. Kliknij reset, jeżeli chcesz zacząć od nowa.

## Krótki workflow — Prosty Kreator Postaci

1. Otwórz `Kalkulator/TworzeniePostaci.html`.
2. Ustaw pulę PD.
3. Ustaw atrybuty.
4. Ustaw umiejętności.
5. Dopisz talenty i inne koszty.
6. Sprawdź pozostałe PD i komunikaty błędów.
7. Sprawdź limity gatunku w modalu, jeżeli potrzeba.
8. Zapisz postać, jeżeli chcesz wrócić do niej później.

---

# 🇬🇧 User guide — Kalkulator (EN)

## What Kalkulator is for

`Kalkulator` is a set of tools for calculating advancement costs and creating characters in `Wrath & Glory`.

The module contains a start page and tools available from buttons:

- `Kozie Liczydła` start page,
- `XP Calculator`,
- `Simple Character Creator`,
- `Advanced Character Creator`.

The start page lets you choose a tool. `XP Calculator` quickly calculates the cost of raising attributes and skills. `Simple Character Creator` is used to plan a whole character with XP pool, talents, validation, and optional save. `Advanced Character Creator` opens a separate `Kalkulator/TworzeniePostaci_v2.html` page that can be prepared as an expanded creator.

## How to open the module

Start page:

```text
Kalkulator/index.html
```

Directly open XP Calculator:

```text
Kalkulator/KalkulatorXP.html
```

Directly open Simple Character Creator:

```text
Kalkulator/TworzeniePostaci.html
```

After opening the `Simple Character Creator` view, the browser tab title is `Prosty Kreator Postaci`.

Directly open Advanced Character Creator:

```text
Kalkulator/TworzeniePostaci_v2.html
```

The advanced creator button points to this path even if the file is completed later.

## Start page

The start page contains:

- module logo,
- `XP Calculator` button in the left column,
- `Simple Character Creator` button in the right column,
- `Advanced Character Creator` button directly below the simple creator,

- `Close` button,
- background click outside the dialog,
- `Escape` key.

## XP Calculator — purpose

`XP Calculator` quickly checks how much it costs to raise an attribute or skill from current value to target value.

Example:

- current attribute value: `3`,
- target attribute value: `5`,
- the calculator shows the difference cost.

This tool is a helper. It does not save a full character.

## XP Calculator — step by step

1. Open `Kalkulator/KalkulatorXP.html`.
2. Choose language if you need EN instead of PL.
3. In the attributes table, enter current and target values.
4. In the skills table, enter current and target values.
5. Check costs in individual rows.
6. Check total XP cost at the top of the view.
7. Click `Reset values` if you want to start over.
8. Click `Main Page` to return to the main application menu.

## XP Calculator value ranges

The calculator keeps values within safe ranges:

| Type | Range |
| --- | --- |
| Attributes | `0..12` |
| Skills | `0..8` |

If you enter a value outside the range, it is clamped to an allowed value.

If target value is equal to or lower than current value, cost is `0`.

## Maximum attribute values table

`XP Calculator` contains a species maximum attribute table.

The table is only a reference. It does not fill fields automatically.

## Simple Character Creator — purpose

`Simple Character Creator` is a larger sheet for planning XP spending for one character.

It lets you set:

- XP pool,
- attributes,
- skills,
- talents and other costs,
- interface language,
- save and load current character state.

## Simple Character Creator — step by step

1. Open `Kalkulator/TworzeniePostaci.html`.
2. Set XP pool in `XP pool`. Default is `155`.
3. Set attribute values.
4. Set skill values.
5. Enter talents or other spending in the talents section.
6. Watch remaining XP field.
7. Check whether an error message appears.
8. Open PDF manual if you need help.
9. Open maximum attribute values table if you want to check species limits.
10. Save the character if you want to return to it later.

## XP pool

`XP pool` defines how many points you have to spend.

Default value:

```text
155
```

If you spend more points than available, the module shows an XP overflow error.

## Attributes

Character creation includes attributes:

- `S`,
- `T`,
- `A`,
- `I`,
- `Will`,
- `Int`,
- `Fell`,
- `Speed`.

Most attributes start at `1`.

`Speed` starts at `6`.

Allowed attribute range is `1..12`.

## Skills

Skills have range:

```text
0..8
```

Value `0` means no purchased level.

The module automatically adds each skill cost to total XP spent.

## Talents and other spending

The talents section has 20 fields.

Each entry has:

- name,
- cost.

You can use this section not only for talents, but also for other manually added costs.

The entered cost is added directly to spent XP.

## Remaining XP and errors

The sheet automatically calculates:

- spent XP,
- remaining XP,
- validation errors.

Main messages:

| Message | Meaning |
| --- | --- |
| XP pool exceeded | More points were spent than available. |
| Tree of Learning | Skill level layout breaks the rule checked by the sheet. |

Tree of Learning error is shown only when XP pool is not exceeded.

## Tree of Learning

The sheet checks a simplified Tree of Learning rule.

In practice, a very high level in one skill requires a suitable number of active skills.

If you see Tree of Learning error, lower the highest skill level or add levels in other skills.

## Maximum attribute values table

In `Simple Character Creator`, `Maximum attribute values` opens a modal with species limits.

The table is a reference. It does not automatically change form fields.

For Vespids, `Speed 14*` has a footnote. It means Vespids have fixed Speed 14 and the Speed field should be manually ignored when calculating XP.

## PDF manual

`Instrukcja` or `Manual` opens a help file for the current language.

For Polish:

```text
HowToUse/pl.pdf
```

For English:

```text
HowToUse/en.pdf
```

## Language change

`XP Calculator` can switch language without resetting entered values.

`Character Creation` does not show a language dropdown. The sheet opens in the default language, and the visible top-right buttons open the manual, return to the main page, and show maximum attribute values.

## Reset

In `XP Calculator`, reset sets fields to `0`.

In `Simple Character Creator`, reset restores start values:

- XP pool: `155`,
- attributes: defaults,
- skills: `0`,
- talents and costs: empty or `0`.

## Save and load character

`Simple Character Creator` has save and load buttons.

Save stores the current form state.

Load restores saved state.

This feature requires valid Firebase configuration. If configuration does not work, the module shows an error message in a modal.

## What is saved

Save includes, among others:

- language,
- XP pool,
- spent XP,
- remaining XP,
- attributes,
- skills,
- talents,
- form field state,
- visible validation messages.

## Common messages and what to do

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| Remaining XP is negative | Too much XP was spent. | Reduce values or increase XP pool. |
| Tree of Learning error | Skill layout breaks the sheet rule. | Add other active skills or lower the highest level. |
| Field returns to default value | The entry was empty or invalid. | Enter a number in the allowed range. |
| Save does not work | Firebase is not configured or unavailable. | Contact technical admin. |
| Load does not work | No saved document exists or Firebase is unavailable. | Save character first or contact admin. |
| I do not see language change in character creation | This is expected. | Use the sheet in the default language; the visible buttons are for the manual, return, and maximum-values table. |
| PDF manual does not open | File is missing or browser blocks opening. | Check popups and presence of `HowToUse` files. |

## Quick workflow — XP Calculator

1. Open `Kalkulator/KalkulatorXP.html`.
2. Enter current and target values.
3. Check row cost and total cost.
4. Change values until you get the needed cost.
5. Click reset if you want to start over.

## Quick workflow — Simple Character Creator

1. Open `Kalkulator/TworzeniePostaci.html`.
2. Set XP pool.
3. Set attributes.
4. Set skills.
5. Add talents and other costs.
6. Check remaining XP and error messages.
7. Check species limits in modal if needed.
8. Save character if you want to return to it later.

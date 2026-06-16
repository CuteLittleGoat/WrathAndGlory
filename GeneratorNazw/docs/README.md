# 🇵🇱 Instrukcja użytkownika — Generator Nazw (PL)

## Do czego służy moduł

`GeneratorNazw` tworzy gotowe propozycje nazw w klimacie Warhammer 40,000.

Moduł może generować między innymi:

- imiona i nazwiska ludzi Imperium,
- nazwy Aeldari, Drukhari i Harlequinów,
- nazwy Necronów,
- nazwy Orków,
- nazwy Adepta Sororitas,
- imiona Astartes,
- nazwy Adeptus Mechanicus,
- nazwy Chaosu,
- nazwy maszyn bojowych,
- nazwy okrętów gwiezdnych,
- kryptonimy oddziałów,
- kryptonimy operacji.

Generator jest przeznaczony do szybkiego przygotowywania nazw na sesję, do notatek MG albo do tworzenia klimatycznych list inspiracji.

## Jak uruchomić moduł

Otwórz plik:

```text
GeneratorNazw/index.html
```

Moduł działa w przeglądarce. Nie wymaga logowania, Firebase ani połączenia z bazą danych.

## Co widać po otwarciu

Po otwarciu strony widać pojedynczy panel z formularzem generatora.

W panelu znajdują się:

- pole `Kategoria`,
- pole `Opcja`,
- pole `Seed`,
- pole `Ile`,
- przycisk `Generuj`,
- przycisk `Kopiuj wynik`,
- znacznik trybu losowania,
- pole z wynikami,
- krótka podpowiedź wyjaśniająca seed.

Przełącznik języka jest przygotowany w kodzie, ale jest obecnie ukryty w interfejsie. Zwykły użytkownik korzysta z widocznej polskiej wersji strony.

## Podstawowa obsługa

1. Wybierz `Kategoria`.
2. Wybierz `Opcja`, czyli wariant w ramach wybranej kategorii.
3. Zdecyduj, czy chcesz użyć pola `Seed`.
4. Ustaw liczbę wyników w polu `Ile`.
5. Kliknij `Generuj`.
6. Odczytaj listę nazw w polu wyników.
7. Kliknij `Kopiuj wynik`, jeżeli chcesz przenieść listę do schowka.

Zmiana kategorii albo opcji automatycznie odświeża wyniki.

## Kategorie i opcje

| Kategoria | Dostępne opcje |
| --- | --- |
| `Imperium – Ludzie` | `Klasa Wyższa`, `Klasa Niższa` |
| `Aeldari` | `Craftworld (Asuryani)`, `Drukhari`, `Harlequins` |
| `Necroni` | `Wojownicy`, `Lordowie` |
| `Orkowie` | `Orkowie` |
| `Adepta Sororitas` | `Sororitas` |
| `Astartes – imię i nazwisko bojowe` | `Astartes` |
| `Adeptus Mechanicus` | `Tech-Kapłani`, `Skitarii` |
| `Chaos` | `Undivided`, `Khorne`, `Nurgle`, `Tzeentch`, `Slaanesh` |
| `Maszyny bojowe (Imperium)` | `Czołgi`, `Tytany`, `Rycerze`, `Lotnictwo` |
| `Okręty gwiezdne` | `Imperium (Navy)`, `Astartes`, `Adeptus Mechanicus`, `Aeldari`, `Drukhari`, `Orkowie`, `Necroni`, `Chaos` |
| `Kryptonimy oddziałów` | `Kryptonim oddziału` |
| `Kryptonimy operacji` | `Kryptonim operacji` |

## Przyciski i akcje

| Przycisk / element | Co robi |
| --- | --- |
| `Generuj` | Tworzy nową listę nazw na podstawie wybranej kategorii, opcji, liczby wyników i seeda. |
| `Kopiuj wynik` | Kopiuje aktualnie widoczną listę wyników do schowka. |
| Znacznik `Losowo: TAK` | Informuje, że wyniki są losowe i nie używają seeda. |
| Znacznik `Losowo: SEED` | Informuje, że wyniki są generowane z użyciem wpisanego seeda. |
| Dopisek `skopiowano` | Pojawia się chwilowo po udanym skopiowaniu wyników. |

## Pola formularza

| Pole | Znaczenie |
| --- | --- |
| `Kategoria` | Wybiera główną rodzinę nazw. |
| `Opcja` | Wybiera dokładniejszy wariant w ramach kategorii. Lista opcji zmienia się po zmianie kategorii. |
| `Seed` | Pozwala uzyskać powtarzalny wynik. Ten sam seed i te same ustawienia dadzą tę samą listę nazw. |
| `Ile` | Określa liczbę generowanych nazw. Moduł przyjmuje od 1 do 20 wyników. |

## Jak działa seed

Seed to dowolny wpisany tekst, na przykład:

```text
kampania-gilead-01
```

Jeżeli wpiszesz seed, generator użyje go jako podstawy losowania. Dzięki temu możesz później odtworzyć tę samą listę nazw.

Jeżeli pole `Seed` zostawisz puste, generator użyje zwykłego losowania przeglądarki i przy kolejnych kliknięciach będzie tworzył nowe, niepowtarzalne wyniki.

## Wyniki

Wyniki pojawiają się jako lista punktowana. Każda linia to jedna propozycja nazwy.

Wyniki możesz:

- odczytać bezpośrednio z panelu,
- zaznaczyć ręcznie,
- skopiować przyciskiem `Kopiuj wynik`.

## Tryb użytkownika

Moduł ma jeden podstawowy tryb użytkownika. Nie ma osobnego trybu admina.

Użytkownik może:

- wybierać kategorię,
- wybierać opcję,
- wpisywać seed,
- ustawiać liczbę wyników,
- generować nazwy,
- kopiować wynik.

## Zapisywanie i wczytywanie danych

Moduł nie zapisuje danych użytkownika.

Nie używa:

- kont użytkowników,
- Firebase,
- `localStorage`,
- plików zapisu,
- eksportu danych.

Po odświeżeniu strony wracają ustawienia startowe.

## Komunikaty i błędy

| Komunikat / sytuacja | Znaczenie | Co zrobić |
| --- | --- | --- |
| `Wybierz kategorię i kliknij „Generuj”.` | Moduł czeka na pierwsze generowanie. | Wybierz ustawienia i kliknij `Generuj`. |
| `Losowo: TAK` | Seed jest pusty, wyniki są losowe. | Wpisz seed, jeżeli chcesz powtarzalnych wyników. |
| `Losowo: SEED` | Generator używa wpisanego seeda. | Zostaw seed bez zmian, jeżeli chcesz móc odtworzyć wynik. |
| `skopiowano` | Wyniki zostały skopiowane do schowka. | Możesz wkleić listę w innym miejscu. |
| `Nie mogę skopiować...` | Przeglądarka zablokowała dostęp do schowka. | Zaznacz wyniki ręcznie i skopiuj je skrótem klawiaturowym. |

## Typowe problemy

### Wyniki zmieniają się po każdym kliknięciu

Pole `Seed` jest puste. Wpisz dowolny seed, jeżeli chcesz powtarzalnych wyników.

### Nie mogę skopiować wyników

Niektóre przeglądarki blokują schowek, szczególnie przy otwieraniu pliku lokalnie. Zaznacz wyniki ręcznie i skopiuj je skrótem `Ctrl+C`.

### Widzę za mało albo za dużo wyników

Sprawdź pole `Ile`. Minimalna sensowna wartość to 1, a maksymalna obsługiwana przez moduł to 20.

### Nie widzę przełącznika języka

To normalne. Przełącznik języka jest obecnie ukryty w interfejsie.

---

# 🇬🇧 User guide — Name Generator (EN)

## What this module is for

`GeneratorNazw` creates ready-to-use Warhammer 40,000-style name suggestions.

The module can generate, among others:

- Imperial human names,
- Aeldari, Drukhari, and Harlequin names,
- Necron names,
- Ork names,
- Adepta Sororitas names,
- Astartes names,
- Adeptus Mechanicus names,
- Chaos names,
- war machine names,
- starship names,
- unit codenames,
- operation codenames.

The generator is meant for quick session preparation, GM notes, and atmospheric inspiration lists.

## How to open the module

Open:

```text
GeneratorNazw/index.html
```

The module runs in the browser. It does not require login, Firebase, or database access.

## What you see after opening it

After opening the page, you see one generator panel.

The panel contains:

- the `Category` field,
- the `Option` field,
- the `Seed` field,
- the `How many` field,
- the `Generate` button,
- the `Copy result` button,
- a random mode indicator,
- the results area,
- a short hint explaining seed behavior.

The language switcher exists in the code but is currently hidden in the interface. A regular user uses the visible Polish page.

## Basic use

1. Choose `Category`.
2. Choose `Option`, which is a variant inside the selected category.
3. Decide whether you want to use `Seed`.
4. Set the number of results in `How many`.
5. Click `Generate`.
6. Read the generated name list.
7. Click `Copy result` if you want to copy the list to the clipboard.

Changing category or option automatically refreshes the generated results.

## Categories and options

| Category | Available options |
| --- | --- |
| `Imperium - Humans` | `Higher Class`, `Lower Class` |
| `Aeldari` | `Craftworld (Asuryani)`, `Drukhari`, `Harlequins` |
| `Necrons` | `Warriors`, `Lords` |
| `Orks` | `Orks` |
| `Adepta Sororitas` | `Sororitas` |
| `Astartes - battle name and surname` | `Astartes` |
| `Adeptus Mechanicus` | `Tech-Priests`, `Skitarii` |
| `Chaos` | `Undivided`, `Khorne`, `Nurgle`, `Tzeentch`, `Slaanesh` |
| `War machines (Imperium)` | `Tanks`, `Titans`, `Knights`, `Air Wing` |
| `Starships` | `Imperium (Navy)`, `Astartes`, `Adeptus Mechanicus`, `Aeldari`, `Drukhari`, `Orks`, `Necrons`, `Chaos` |
| `Unit codenames` | `Unit codename` |
| `Operation codenames` | `Operation codename` |

## Buttons and actions

| Button / element | What it does |
| --- | --- |
| `Generate` | Creates a new name list from the selected category, option, result count, and seed. |
| `Copy result` | Copies the currently visible results to the clipboard. |
| `Random: YES` indicator | Shows that the seed field is empty and generation is random. |
| `Random: SEED` indicator | Shows that generation uses the entered seed. |
| `copied` suffix | Appears briefly after a successful copy action. |

## Form fields

| Field | Meaning |
| --- | --- |
| `Category` | Selects the main name family. |
| `Option` | Selects a more specific variant inside the category. The option list changes when the category changes. |
| `Seed` | Makes results repeatable. The same seed and the same settings produce the same name list. |
| `How many` | Sets how many names are generated. The module supports values from 1 to 20. |

## How seed works

A seed is any text, for example:

```text
gilead-campaign-01
```

When you enter a seed, the generator uses it as the basis for randomization. This lets you reproduce the same list later.

When the `Seed` field is empty, the generator uses normal browser randomness and creates new, non-repeatable results on subsequent clicks.

## Results

Results appear as a bullet list. Each line is one name suggestion.

You can:

- read them directly in the panel,
- select them manually,
- copy them with `Copy result`.

## User mode

The module has one regular user mode. It has no separate admin mode.

The user can:

- choose a category,
- choose an option,
- enter a seed,
- set the number of results,
- generate names,
- copy the result.

## Saving and loading data

The module does not save user data.

It does not use:

- user accounts,
- Firebase,
- `localStorage`,
- save files,
- data export.

After refreshing the page, the module returns to its starting state.

## Messages and errors

| Message / situation | Meaning | What to do |
| --- | --- | --- |
| `Choose a category and click “Generate”.` | The module is waiting for the first generation. | Choose settings and click `Generate`. |
| `Random: YES` | The seed field is empty and results are random. | Enter a seed if you want repeatable results. |
| `Random: SEED` | The generator uses the entered seed. | Keep the same seed if you want to reproduce the result. |
| `copied` | Results were copied to the clipboard. | Paste the list where you need it. |
| `Cannot copy...` | The browser blocked clipboard access. | Select the results manually and copy them with a keyboard shortcut. |

## Common problems

### Results change after every click

The `Seed` field is empty. Enter any seed if you want repeatable results.

### I cannot copy results

Some browsers block clipboard access, especially when a file is opened locally. Select the results manually and copy them with `Ctrl+C`.

### I see too few or too many results

Check the `How many` field. The minimum meaningful value is 1, and the maximum supported value is 20.

### I do not see the language switcher

This is expected. The language switcher is currently hidden in the interface.

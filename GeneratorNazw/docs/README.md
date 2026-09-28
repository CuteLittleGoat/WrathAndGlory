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

Po otwarciu w polu `Kategoria` jest wybrane `Ludzie`, a w polu `Opcja` – `Klasa Niższa`.
Wystarczy kliknąć `Generuj`, aby od razu dostać listę imion zwykłych mieszkańców Imperium.

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
| `Ludzie` | `Klasa Niższa`, `Klasa Wyższa` |
| `Adeptus Mechanicus` | `Tech-Kapłani`, `Skitarii` |
| `Adeptus Astartes` | `Ogólne`, `Kodeksowe (Ultramarines)`, `Nordyckie (Kosmiczne Wilki)`, `Anielskie (Mroczne i Krwawe Anioły)`, `Krzyżowcy (Czarni Templariusze)`, `Nokturne (Salamandry)`, `Czogoris (Białe Blizny)` |
| `Adepta Sororitas` | `Sororitas` |
| `Chaos` | `Undivided`, `Khorne`, `Nurgle`, `Tzeentch`, `Slaanesh` |
| `Aeldari` | `Craftworld (Asuryani)`, `Drukhari`, `Harlequins` |
| `Orkowie` | `Orkowie` |
| `Nekroni` | `Wojownicy`, `Lordowie` |
| `Okręty Gwiezdne` | `Imperium (Navy)`, `Astartes`, `Adeptus Mechanicus`, `Aeldari`, `Drukhari`, `Orkowie`, `Nekroni`, `Chaos` |
| `Maszyny Bojowe (Imperium)` | `Czołgi`, `Tytany`, `Rycerze`, `Lotnictwo` |
| `Kryptonimy Oddziałów` | `Kryptonim oddziału` |
| `Kryptonimy Operacji` | `Kryptonim operacji` |

## Jak wyglądają wygenerowane nazwy

Generator podaje same imiona i nazwy – bez tytułów, stopni i zawodów. Nie zobaczysz więc na liście
dopisków typu „Lord”, „Brat Sierżant”, „Magos”, „Brygadzista” czy „Siostra”. Jeżeli postać ma mieć
tytuł, dopisz go samodzielnie, np. „Kapitan” + wygenerowane imię.

| Kategoria / opcja | Czego się spodziewać | Przykłady |
| --- | --- | --- |
| `Klasa Niższa` | Zwykli ludzie: robotnicy uli, gangerzy, gwardziści. Krótkie, twarde imiona i nazwiska, czasem w stylu słowiańskim, pustynnym albo celtyckim, czasem jedno imię. Bez numerów. | `Dagg Kerrow`, `Ilya Mikhailovich Morozov`, `Malik Sahir`, `Slade` |
| `Klasa Wyższa` | Szlachta i elity: długie imiona w stylu łacińskim, czasem dwa imiona, „von/van/de” albo nazwisko dwuczłonowe. | `Octavia von Thornwood`, `Hadrian Aldemar-Mordaunt` |
| `Aeldari` | Płynne, śpiewne imiona; czasem przydomek. Drukhari brzmią ostrzej, Harlequini mają teatralne przydomki. | `Taevanyth`, `Laveniel Shadow-whisper`, `Vrayagh Malkhiss`, `Caewyn Duskstep` |
| `Nekroni` | Imiona brzmiące jak starożytny Egipt, z końcówkami „-ekh”, „-tekh”. Lordowie mają dłuższe imiona, czasem z nazwą swojego świata („z …”). | `Zarekh`, `Nebkatekh`, `Iskakh z Khatun` |
| `Orkowie` | Gardłowe imiona i przechwałkowe przydomki. | `Gorbash`, `Uzag 'Ead-rippa`, `Doomsplitta` |
| `Adepta Sororitas` | Imiona świętych i łacińskie; nazwiska o wydźwięku wiary i cierpienia; czasem samo imię. | `Mercia Thornfield`, `Perpetua Ignis` |
| `Adeptus Astartes` | Style różnych zakonów: łaciński, nordycki (z przydomkiem), anielski, krzyżowców, z Nokturne (z apostrofem), czogoryjski. Podkategoria `Ogólne` miesza wszystkie style, pozostałe podkategorie dają imiona tylko w jednym stylu. | `Evander Tarvos`, `Arnvald Runeaxe`, `Remiel Scaurus`, `Ti'zul Ignar`, `Temur` |
| `Tech-Kapłani` | Łacińsko-techniczne imiona, oznaczenia literą grecką i numerem. | `Theano Vectris`, `Heronia Lambda-85`, `Draxus-23 Noosar` |
| `Skitarii` | Oznaczenia literowo-liczbowe albo imię z numerem. | `Sigma-26`, `Castor-23 Zorn`, `Brax-Gamma` |
| `Chaos` | Mroczne imiona w stylu wybranego bóstwa, często z przydomkiem. | `Morvorath Dreadmaw`, `Mogrulus Filthbloat`, `Rhaessa Paleheart` |
| `Maszyny Bojowe` | Sama nazwa maszyny – po polsku albo po łacinie, bez typu maszyny i bez cudzysłowów. | `Pięść Zwycięstwa`, `Nieugięta Tarcza`, `Aquila Terrae` |
| `Okręty Gwiezdne` | Polskie nazwy w stylu danej frakcji; nazwy łacińskie zostają po łacinie. | `Grom Świętej Terry`, `Wielgachna Łajba Gorka`, `Wykwintna Udręka`, `Ira Throni` |
| `Kryptonimy` | Same polskie kryptonimy z poprawną odmianą (bez słowa „Operacja”). | `Żelaźni Bracia`, `Kruki Popiołu`, `Czarny Świt Sigma` |

### Brak powtórzeń na liście

Na jednej wygenerowanej liście każda nazwa jest inna. Przy kolejnym kliknięciu `Generuj` nazwy mogą się
powtórzyć, bo każda lista jest losowana od nowa.

### Imiona znanych postaci

Generator nie podaje imion unikatowych bohaterów i złoczyńców z Warhammera (np. „Sebastian Yarrick”,
„Ciaphas Cain”, „Ghazghkull”, „Imotekh”) ani nazw słynnych okrętów (np. „Mściwy Duch” / „Vengeful Spirit”). Pojedyncze
części takich imion mogą się pojawić w innym połączeniu – np. „Sebastian Varro” jest w porządku, bo nie
jest to imię konkretnej postaci z lore.

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
| `Ile` | Określa liczbę generowanych nazw: od 1 do 50. Nie da się wpisać więcej niż 50 – jeśli wpiszesz np. 99, pole od razu pokaże 50. Litery, minus i przecinek nie są przyjmowane. Puste pole albo 0 zmienia się na 1 po kliknięciu obok albo po `Generuj`. |

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

## Na telefonie

Moduł mieści się na szerokość ekranu telefonu. Bardzo długa wygenerowana nazwa bez spacji łamie się
w polu wyników, zamiast wychodzić poza panel.

## Typowe problemy

### Wyniki zmieniają się po każdym kliknięciu

Pole `Seed` jest puste. Wpisz dowolny seed, jeżeli chcesz powtarzalnych wyników.

### Nie mogę skopiować wyników

Niektóre przeglądarki blokują schowek, szczególnie przy otwieraniu pliku lokalnie. Zaznacz wyniki ręcznie i skopiuj je skrótem `Ctrl+C`.

### Widzę za mało albo za dużo wyników

Sprawdź pole `Ile`. Najmniejsza wartość to 1, a największa 50. Wyższej liczby nie da się wpisać – pole samo zmieni ją na 50.

### Chcę imię z tytułem

Generator celowo podaje same imiona. Dopisz tytuł ręcznie przed wygenerowanym imieniem, np. „Inkwizytor
Octavia von Thornwood” albo „Brat Sierżant Evander Tarvos”.

### Wygenerowane imię kojarzy mi się z kimś znanym

Pełne imiona znanych postaci są blokowane. Jeśli mimo to nazwa kojarzy Ci się z kimś z lore, kliknij
`Generuj` jeszcze raz albo wybierz inną pozycję z listy.

### Nie widzę przełącznika języka

To normalne. Przełącznik języka jest ukryty w interfejsie, a moduł działa po polsku.

Aby go pokazać, wystarczy w pliku `GeneratorNazw/index.html` usunąć klasę
`language-switcher--hidden` z kontenera `<div class="language-switcher language-switcher--hidden">`.
Nad tym elementem stoi komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`. Nic więcej nie
trzeba zmieniać.

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

When the page opens, `Humans` is selected in `Category` and `Lower Class` in `Option`. Just
click `Generate` to get a list of ordinary Imperial citizens' names straight away.

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
| `Humans` | `Lower Class`, `Higher Class` |
| `Adeptus Mechanicus` | `Tech-Priests`, `Skitarii` |
| `Adeptus Astartes` | `General`, `Codex (Ultramarines)`, `Nordic (Space Wolves)`, `Angelic (Dark and Blood Angels)`, `Crusader (Black Templars)`, `Nocturne (Salamanders)`, `Chogoris (White Scars)` |
| `Adepta Sororitas` | `Sororitas` |
| `Chaos` | `Undivided`, `Khorne`, `Nurgle`, `Tzeentch`, `Slaanesh` |
| `Aeldari` | `Craftworld (Asuryani)`, `Drukhari`, `Harlequins` |
| `Orks` | `Orks` |
| `Necrons` | `Warriors`, `Lords` |
| `Starships` | `Imperium (Navy)`, `Astartes`, `Adeptus Mechanicus`, `Aeldari`, `Drukhari`, `Orks`, `Necrons`, `Chaos` |
| `War machines (Imperium)` | `Tanks`, `Titans`, `Knights`, `Air Wing` |
| `Unit codenames` | `Unit codename` |
| `Operation codenames` | `Operation codename` |

## What the generated names look like

The generator gives names only – no titles, ranks or jobs. You will not see additions such as "Lord",
"Brother Sergeant", "Magos", "Foreman" or "Sister" in the list. If a character needs a title, add it
yourself, e.g. "Captain" + the generated name.

| Category / option | What to expect | Examples |
| --- | --- | --- |
| `Lower Class` | Ordinary people: hive workers, gangers, guardsmen. Short, hard given names and surnames, sometimes in a Slavic, desert or Celtic style, sometimes a single name. No numbers. | `Dagg Kerrow`, `Ilya Mikhailovich Morozov`, `Malik Sahir`, `Slade` |
| `Higher Class` | Nobles and elites: long Latin-style names, sometimes two given names, "von/van/de", or a double-barrelled surname. | `Octavia von Thornwood`, `Hadrian Aldemar-Mordaunt` |
| `Aeldari` | Flowing, lyrical names; sometimes an epithet. Drukhari sound sharper, Harlequins have theatrical epithets. | `Taevanyth`, `Laveniel Shadow-whisper`, `Vrayagh Malkhiss`, `Caewyn Duskstep` |
| `Necrons` | Names that sound like ancient Egypt, ending in "-ekh", "-tekh". Lords have longer names, sometimes with their world ("z …"). | `Zarekh`, `Nebkatekh`, `Iskakh z Khatun` |
| `Orks` | Guttural names and boastful epithets. | `Gorbash`, `Uzag 'Ead-rippa`, `Doomsplitta` |
| `Adepta Sororitas` | Saintly and Latin given names; surnames evoking faith and suffering; sometimes a given name alone. | `Mercia Thornfield`, `Perpetua Ignis` |
| `Adeptus Astartes` | Styles of different Chapters: Latin, Nordic (with an epithet), angelic, crusader, Nocturnean (with an apostrophe), Chogorian. The `General` subcategory mixes all styles, the other subcategories give names in one style only. | `Evander Tarvos`, `Arnvald Runeaxe`, `Remiel Scaurus`, `Ti'zul Ignar`, `Temur` |
| `Tech-Priests` | Latin-technical names, Greek-letter and number designations. | `Theano Vectris`, `Heronia Lambda-85`, `Draxus-23 Noosar` |
| `Skitarii` | Letter-number designations or a name with a number. | `Sigma-26`, `Castor-23 Zorn`, `Brax-Gamma` |
| `Chaos` | Dark names in the style of the chosen god, often with an epithet. | `Morvorath Dreadmaw`, `Mogrulus Filthbloat`, `Rhaessa Paleheart` |
| `War machines` | The machine name only – in Polish or Latin, without the machine type and without quotes. | `Pięść Zwycięstwa`, `Nieugięta Tarcza`, `Aquila Terrae` |
| `Starships` | Polish names in the style of the faction; Latin names stay in Latin. | `Grom Świętej Terry`, `Wielgachna Łajba Gorka`, `Wykwintna Udręka`, `Ira Throni` |
| `Codenames` | Polish codenames only, with correct grammar (without the word "Operacja"). | `Żelaźni Bracia`, `Kruki Popiołu`, `Czarny Świt Sigma` |

### No repeats in a list

Within one generated list every name is different. After another click on `Generate` names can repeat,
because each list is drawn anew.

### Names of famous characters

The generator does not give the names of unique Warhammer heroes and villains (e.g. "Sebastian Yarrick",
"Ciaphas Cain", "Ghazghkull", "Imotekh") or of famous ships (e.g. "Mściwy Duch" / "Vengeful Spirit"). Single parts of such
names may appear in another combination – e.g. "Sebastian Varro" is fine, because it is not the name of a
specific lore character.

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
| `How many` | Sets how many names are generated: from 1 to 50. You cannot enter more than 50 – if you type e.g. 99, the field shows 50 right away. Letters, minus, and comma are not accepted. An empty field or 0 becomes 1 after clicking elsewhere or clicking `Generate`. |

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

## On a phone

The module fits the width of a phone screen. A very long generated name without spaces wraps inside
the results field instead of spilling out of the panel.

## Common problems

### Results change after every click

The `Seed` field is empty. Enter any seed if you want repeatable results.

### I cannot copy results

Some browsers block clipboard access, especially when a file is opened locally. Select the results manually and copy them with `Ctrl+C`.

### I see too few or too many results

Check the `How many` field. The smallest value is 1 and the largest is 50. A higher number cannot be entered – the field changes it to 50 by itself.

### I want a name with a title

The generator gives names only on purpose. Add the title yourself in front of the generated name, e.g.
"Inquisitor Octavia von Thornwood" or "Brother Sergeant Evander Tarvos".

### A generated name reminds me of someone famous

Full names of famous characters are blocked. If a name still reminds you of someone from the lore, click
`Generate` again or pick another name from the list.

### I do not see the language switcher

That is expected. The language selector is hidden in the interface and the module runs in Polish.

To reveal it, remove the `language-switcher--hidden` class from the
`<div class="language-switcher language-switcher--hidden">` container in `GeneratorNazw/index.html`.
A comment marked `LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits above that element. Nothing else
needs to change.

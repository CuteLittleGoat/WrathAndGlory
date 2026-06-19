# 🇵🇱 Instrukcja użytkownika — DataVault (PL)

## Do czego służy DataVault

`DataVault` to prywatna przeglądarka danych do `Wrath & Glory`.

Służy do szybkiego sprawdzania:

- broni,
- pancerzy,
- ekwipunku,
- talentów,
- psioniki,
- modlitw,
- archetypów i elementów tworzenia postaci,
- skrótów zasad,
- zasad walki,
- pojazdów,
- przeciwników i danych administracyjnych dostępnych tylko w trybie admina.

Moduł działa jak wyszukiwalna baza wiedzy: wybierasz zakładkę, filtrujesz dane, rozwijasz dłuższe opisy i możesz porównać kilka rekordów obok siebie.

## Jak otworzyć moduł

Standardowy widok użytkownika:

```text
DataVault/index.html
```

Widok admina:

```text
DataVault/index.html?admin=1
```

Widok użytkownika jest przeznaczony do normalnego używania podczas gry. Widok admina służy do obsługi dodatkowych danych i odświeżania źródła danych.

## Dostęp do prywatnych danych K.O.Z.A.

Po wejściu do modułu może pojawić się ekran dostępu do danych z klauzulą tajności K.O.Z.A.

Na ekranie zobaczysz:

- tytuł dostępu do danych K.O.Z.A.,
- opis Rytuału Uwierzytelnienia,
- pole `Litania Dostępu`,
- przycisk rozpoczęcia rytuału.

Wpisz hasło i zatwierdź. Po poprawnym logowaniu bramka zniknie, a DataVault załaduje dane z prywatnej bazy.

Sesja może zostać zapamiętana w tej samej przeglądarce. Dzięki temu po odświeżeniu strony albo przejściu do `GeneratorNPC` ponowne wpisywanie hasła może nie być potrzebne.

## Główne elementy ekranu

### Nagłówek

W nagłówku znajduje się:

- ikona DataVault,
- nazwa modułu,
- przyciski widoku,
- w trybie admina także przycisk generowania plików danych.

### Zakładki

Zakładki przełączają między arkuszami danych. Każda zakładka pokazuje inną tabelę.

Przykładowe zakładki:

- `Bronie`,
- `Pancerze`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`,
- `Archetypy`,
- `Premie z Przeszłości Frakcji`,
- `Skrót Zasad`,
- `Pojazdy`.

Niektóre zakładki są ukryte w zwykłym widoku i dostępne tylko dla admina. Zakładki `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` są zakładkami pojazdowymi tylko dla admina: zobaczysz je wyłącznie po wejściu z adresem zawierającym `?admin=1` i po zaznaczeniu przełącznika zakładek pojazdów.

### Panel filtrów

Panel filtrów zawiera:

- wyszukiwarkę globalną,
- przełączniki grup zakładek,
- w trybie admina checkbox starych wpisów Bestiariusza,
- krótkie podpowiedzi dotyczące sortowania, filtrów i porównywania.

### Tabela danych

Tabela pokazuje rekordy z aktywnej zakładki. Możesz:

- przewijać tabelę,
- sortować po kolumnach,
- filtrować tekstem,
- filtrować wartościami z listy,
- rozwijać długie komórki,
- zaznaczać wiersze do porównania.

### Kolumna `Koszt IM`

W części zakładek, zwłaszcza przy przedmiotach, ekwipunku, pojazdach albo podobnych elementach użytkowych, może pojawić się kolumna `Koszt IM`.

`IM` oznacza system TTRPG `Imperium Maledictum`. DataVault pozostaje pomocą do `Wrath & Glory`, ale wybrane rekordy mogą zawierać dodatkową informację z drugiego systemu tego samego wydawcy.

Kolumna `Koszt IM` pokazuje koszt danego przedmiotu w systemie `Imperium Maledictum`. Jest to wartość pomocnicza i porównawcza. Służy do używania klasycznego systemu monetarnego dla Mistrzów Gry, którzy wolą takie rozwiązanie.

Jeżeli kolumna `Koszt IM` jest pusta, oznacza to po prostu, że dla danego wpisu nie uzupełniono kosztu z `Imperium Maledictum` albo dana rzecz nie ma takiego odpowiednika w danych.

## Wyszukiwanie globalne

Pole wyszukiwania globalnego filtruje aktualną zakładkę.

Używaj go, gdy chcesz szybko znaleźć słowo, nazwę, typ, cechę lub fragment opisu.

Przykład:

```text
plasma
```

albo:

```text
ognia
```

Wyszukiwanie działa na danych widocznych w aktualnej zakładce.

## Filtry kolumnowe

Pod nagłówkami kolumn znajdują się pola i przyciski filtrów.

Możesz użyć:

- filtra tekstowego pod konkretną kolumną,
- filtra listowego z wartościami występującymi w kolumnie.

Filtr kolumnowy jest przydatny, gdy chcesz zawęzić wyniki tylko do jednej kategorii, typu, frakcji, podręcznika albo zakresu danych.

Aktywny filtr jest wyróżniony wizualnie.

## Sortowanie

Kliknij nagłówek kolumny, aby posortować tabelę.

Kolejne kliknięcia zmieniają kierunek sortowania albo zdejmują sortowanie, zależnie od aktualnego stanu widoku.

W części zakładek moduł może stosować sortowanie domyślne, np. po kolejności z danych źródłowych.

## Rozwijanie długich komórek

Niektóre komórki mają długie opisy. DataVault może je skracać, żeby tabela pozostała czytelna.

Kliknięcie rozwijanego pola pokazuje więcej treści. Ponowne kliknięcie może przywrócić krótszy widok.

## Odnośniki i specjalne wyróżnienia

DataVault automatycznie wyróżnia część tekstu z danych.

Przykłady:

- odnośniki do stron, np. `(str. 123)`, `(strona 45)`, `(page 88)`, `(p. 12)`,
- czerwony tekst zapisany w źródle jako czerwony,
- pogrubienie,
- kursywę,
- przekreślenie,
- specjalne oznaczenia przypisów.

Szczegółowe zasady formatowania są opisane w osobnym pliku `DataVault/docs/ZasadyFormatowania.md`.

## Porównywanie rekordów

Aby porównać wpisy:

1. Wybierz zakładkę.
2. Odszukaj interesujące rekordy.
3. Zaznacz co najmniej dwa wiersze.
4. Kliknij `Porównaj zaznaczone`.
5. Przejrzyj dane w modalu porównania.
6. Zamknij modal po zakończeniu.

Porównywanie jest szczególnie przydatne przy broniach, pancerzach, archetypach, talentach i pojazdach.

## Pełen Widok

Przycisk `Pełen Widok` zdejmuje filtry i sortowanie ustawione w bieżącym widoku.

Używaj go, gdy tabela pokazuje zbyt mało wyników albo nie pamiętasz, jakie filtry były aktywne.

Ważne: `Pełen Widok` nie pokazuje samodzielnie starych wpisów Bestiariusza. Te wpisy są kontrolowane osobnym checkboxem w trybie admina.

## Widok Domyślny

Przycisk `Widok Domyślny` przywraca bezpieczny, domyślny układ danych.

Może ponownie włączyć domyślne filtry, sortowanie i ukrycia.

Używaj go, gdy chcesz wrócić do podstawowego widoku przygotowanego do normalnej gry.

## Przełączniki grup zakładek

Panel filtrów może zawierać przełączniki grup zakładek, np.:

- tworzenie postaci,
- zasady walki,
- pojazdy.

Odznaczenie grupy ukrywa jej zakładki. Zaznaczenie pokazuje je ponownie.

To nie usuwa danych, tylko zmienia widoczność zakładek w interfejsie.

## Tryb użytkownika i tryb admina

### Tryb użytkownika

Tryb użytkownika pokazuje dane przeznaczone do normalnego używania podczas sesji.

Domyślna zakładka użytkownika to zwykle `Bronie`.

W tym trybie część zakładek administracyjnych jest ukryta.

### Tryb admina

Tryb admina pokazuje dodatkowe zakładki i narzędzia.

Domyślna zakładka admina to zwykle `Notatki`.

W trybie admina dostępne są między innymi:

- dodatkowe zakładki administracyjne,
- checkbox starych wpisów Bestiariusza,
- przycisk `Generuj pliki danych`.

## Stare wpisy Bestiariusza

W trybie admina dostępny jest checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
```

Dotyczy tylko zakładki `Bestiariusz`.

Gdy checkbox jest wyłączony, wpisy oznaczone w danych jako `old` są ukryte.

Gdy checkbox jest włączony, stare wpisy są widoczne.

Po ponownym ukryciu starych wpisów moduł usuwa je również z zaznaczenia do porównania.

## Generowanie plików danych — tylko admin

Przycisk `Generuj pliki danych` służy do przygotowania nowych danych po aktualizacji pliku źródłowego.

Po kliknięciu:

1. wybierz lokalny plik `Repozytorium.xlsx`,
2. aplikacja odczyta arkusz,
3. przeglądarka pobierze `data.json`,
4. przeglądarka pobierze `firebase-import.json`,
5. widok roboczy zostanie odświeżony danymi z wybranego pliku.

`data.json` jest lokalnym backupem i plikiem pomocniczym.

`firebase-import.json` jest plikiem przeznaczonym do importu w Firebase Realtime Database.

## Import danych do Firebase — tylko admin techniczny

Po wygenerowaniu `firebase-import.json` zaimportuj go w Firebase Console na poziomie root Realtime Database, czyli `/`.

Po imporcie dane powinny znaleźć się pod ścieżką:

```text
datavault/live
```

Nie importuj tego pliku bezpośrednio do `datavault/live`, ponieważ powstanie błędna podwójna ścieżka:

```text
datavault/live/datavault/live
```

## Wspólna sesja z GeneratorNPC

`DataVault` i `GeneratorNPC` korzystają z tej samej wspólnej warstwy prywatnych danych Firebase.

Oznacza to, że po zalogowaniu do jednego z tych modułów drugi moduł może być odblokowany w tej samej przeglądarce bez ponownego wpisywania hasła.

## Typowe komunikaty i co zrobić

| Komunikat lub sytuacja | Co oznacza | Co zrobić |
| --- | --- | --- |
| Bramka K.O.Z.A. nie znika | Hasło jest błędne albo Firebase Auth nie przyjął logowania. | Sprawdź hasło. Jeżeli problem trwa, zgłoś adminowi. |
| Komunikat o braku konfiguracji Firebase | Moduł nie widzi wymaganych danych konfiguracji. | Zgłoś adminowi technicznemu. |
| Brak technicznego e-maila | Nie ustawiono e-maila użytkownika dostępowego. | Zgłoś adminowi technicznemu. |
| Brak danych w Firebase | Pod `datavault/live` nie ma danych. | Admin powinien zaimportować `firebase-import.json`. |
| Brak uprawnień do odczytu | Reguły Firebase blokują dostęp. | Zgłoś adminowi technicznemu. |
| Dane nie mają struktury `sheets` | Import jest uszkodzony albo nie pochodzi z DataVault. | Wygeneruj i zaimportuj nowy plik. |
| Tabela jest pusta | Filtry ukryły wyniki albo arkusz nie ma danych. | Kliknij `Pełen Widok` albo wyczyść filtry. |
| Nie widać zakładki | Grupa zakładek jest ukryta albo zakładka jest admin-only. | Włącz grupę w panelu filtrów albo użyj trybu admina. |

## Krótki workflow podczas sesji

1. Otwórz `DataVault/index.html`.
2. Przejdź bramkę K.O.Z.A., jeżeli się pojawi.
3. Wybierz zakładkę.
4. Wpisz frazę w wyszukiwarce globalnej.
5. Użyj filtrów kolumnowych, jeżeli wyników jest za dużo.
6. Kliknij nagłówek kolumny, aby posortować.
7. Zaznacz kilka rekordów i użyj porównania, jeżeli chcesz je zestawić.
8. Kliknij `Pełen Widok`, gdy chcesz wyczyścić widok.
9. Kliknij `Widok Domyślny`, gdy chcesz wrócić do podstawowego układu.

---

# 🇬🇧 User guide — DataVault (EN)

## What DataVault is for

`DataVault` is a private data browser for `Wrath & Glory`.

It is used to quickly check:

- weapons,
- armor,
- equipment,
- talents,
- psionics,
- prayers,
- archetypes and character creation data,
- rules summaries,
- combat rules,
- vehicles,
- enemies and administrative data available only in admin mode.

The module works like a searchable knowledge base: choose a tab, filter data, expand longer descriptions, and compare several records side by side.

## How to open the module

Standard user view:

```text
DataVault/index.html
```

Admin view:

```text
DataVault/index.html?admin=1
```

User view is meant for normal use during play. Admin view is for extra data access and data source maintenance.

## K.O.Z.A. private data access

After opening the module, you may see the K.O.Z.A. classified data access screen.

The screen contains:

- K.O.Z.A. data access title,
- Rite of Authentication description,
- `Litany of Access` password field,
- ritual start button.

Enter the password and confirm. After successful login, the gate closes and DataVault loads data from the private database.

The session may be remembered in the same browser. This means refreshing the page or opening `GeneratorNPC` may not require entering the password again.

## Main screen elements

### Header

The header contains:

- DataVault icon,
- module name,
- view buttons,
- in admin mode, the data generation button.

### Tabs

Tabs switch between data sheets. Each tab shows a different table.

Example tabs:

- `Bronie`,
- `Pancerze`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`,
- `Archetypy`,
- `Premie z Przeszłości Frakcji`,
- `Skrót Zasad`,
- `Pojazdy`.

Some tabs are hidden in regular view and available only to admin. The `Uszkodzenia Pojazdów` and `Eksplozje Pojazdów` tabs are admin-only vehicle tabs: you see them only when the address contains `?admin=1` and the vehicle-tabs toggle is checked.

### Filter panel

The filter panel contains:

- global search,
- sheet group toggles,
- old Bestiary entries checkbox in admin mode,
- short hints for sorting, filters, and comparison.

### Data table

The table shows records from the active tab. You can:

- scroll the table,
- sort by columns,
- filter by text,
- filter by value lists,
- expand long cells,
- select rows for comparison.

### `Koszt IM` column

Some tabs, especially those containing items, equipment, vehicles, or similar usable records, may contain a `Koszt IM` column.

`IM` means the `Imperium Maledictum` TTRPG system. DataVault remains a `Wrath & Glory` helper, but selected records may include additional information from another system by the same publisher.

The `Koszt IM` column shows the cost of a given item in `Imperium Maledictum`. It is a helper and comparison value. It is intended for using a classic monetary system by Game Masters who prefer that solution.

If the `Koszt IM` column is empty, it simply means that no `Imperium Maledictum` cost has been filled in for that record, or that the item has no such equivalent in the data.

## Global search

The global search field filters the current tab.

Use it when you want to quickly find a word, name, type, trait, or description fragment.

Example:

```text
plasma
```

or:

```text
fire
```

Search works on data visible in the current tab.

## Column filters

There are filter fields and buttons below column headers.

You can use:

- text filter under a specific column,
- list filter with values present in the column.

Column filters are useful when you want to narrow results to one category, type, faction, book, or data range.

Active filters are visually highlighted.

## Sorting

Click a column header to sort the table.

Repeated clicks change the sort direction or remove sorting, depending on the current view state.

Some tabs may use default sorting, for example by source data order.

## Expanding long cells

Some cells contain long descriptions. DataVault may shorten them to keep the table readable.

Clicking an expandable field shows more content. Clicking again may return to the shorter view.

## References and special highlights

DataVault automatically highlights parts of the source text.

Examples:

- page references such as `(str. 123)`, `(strona 45)`, `(page 88)`, `(p. 12)`,
- red text stored as red in the source,
- bold,
- italics,
- strikethrough,
- special footnote markers.

Detailed formatting rules are described in `DataVault/docs/ZasadyFormatowania.md`.

## Comparing records

To compare entries:

1. Choose a tab.
2. Find the records you need.
3. Select at least two rows.
4. Click `Compare selected`.
5. Review data in the comparison modal.
6. Close the modal when done.

Comparison is especially useful for weapons, armor, archetypes, talents, and vehicles.

## Full View

`Full View` removes filters and sorting from the current view.

Use it when the table shows too few results or you do not remember which filters are active.

Important: `Full View` does not reveal old Bestiary entries by itself. Those entries are controlled by a separate checkbox in admin mode.

## Default View

`Default View` restores the safe default data layout.

It may re-enable default filters, sorting, and hidden entries.

Use it when you want to return to the basic view prepared for regular play.

## Sheet group toggles

The filter panel may contain sheet group toggles, for example:

- character creation,
- combat rules,
- vehicles.

Disabling a group hides its tabs. Enabling it shows them again.

This does not delete data; it only changes tab visibility in the interface.

## User mode and admin mode

### User mode

User mode shows data intended for normal play.

The default user tab is usually `Bronie`.

Some administrative tabs are hidden in this mode.

### Admin mode

Admin mode shows additional tabs and tools.

The default admin tab is usually `Notatki`.

Admin mode includes:

- additional administrative tabs,
- old Bestiary entries checkbox,
- `Generate data files` button.

## Old Bestiary entries

In admin mode there is a checkbox:

```text
Show outdated entries?
```

It affects only the `Bestiariusz` tab.

When disabled, records marked in data as `old` are hidden.

When enabled, old records are visible.

When old records are hidden again, the module also removes them from comparison selection.

## Generating data files — admin only

`Generate data files` prepares new data after the source file is updated.

After clicking it:

1. select local file `Repozytorium.xlsx`,
2. the app reads the workbook,
3. the browser downloads `data.json`,
4. the browser downloads `firebase-import.json`,
5. the working view refreshes with data from the selected file.

`data.json` is a local backup and helper file.

`firebase-import.json` is meant for import into Firebase Realtime Database.

## Importing data into Firebase — technical admin only

After generating `firebase-import.json`, import it in Firebase Console at the Realtime Database root, `/`.

After import, data should appear under:

```text
datavault/live
```

Do not import this file directly into `datavault/live`, because it will create an incorrect double path:

```text
datavault/live/datavault/live
```

## Shared session with GeneratorNPC

`DataVault` and `GeneratorNPC` use the same shared private data Firebase layer.

This means that after logging into one of these modules, the other module may unlock in the same browser without entering the password again.

## Common messages and what to do

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| K.O.Z.A. gate does not close | Password is wrong or Firebase Auth rejected login. | Check the password. If the problem continues, contact admin. |
| Missing Firebase configuration message | The module cannot see required configuration. | Contact technical admin. |
| Missing technical e-mail | Access user e-mail is not configured. | Contact technical admin. |
| No data in Firebase | There is no data under `datavault/live`. | Admin should import `firebase-import.json`. |
| No read permission | Firebase rules block access. | Contact technical admin. |
| Data has no `sheets` structure | Import is damaged or does not come from DataVault. | Generate and import a new file. |
| Table is empty | Filters hide results or the sheet has no data. | Click `Full View` or clear filters. |
| Tab is not visible | Sheet group is hidden or tab is admin-only. | Enable the group in filter panel or use admin mode. |

## Quick session workflow

1. Open `DataVault/index.html`.
2. Pass the K.O.Z.A. gate if it appears.
3. Choose a tab.
4. Enter a phrase in global search.
5. Use column filters if there are too many results.
6. Click a column header to sort.
7. Select several records and use comparison if you want to inspect them side by side.
8. Click `Full View` when you want to clear the view.
9. Click `Default View` when you want to return to the basic layout.

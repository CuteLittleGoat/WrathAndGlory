# 🇵🇱 Instrukcja użytkownika — GeneratorNPC (PL)

## Do czego służy GeneratorNPC

`GeneratorNPC` służy do szybkiego przygotowania karty przeciwnika albo postaci niezależnej na podstawie prywatnych danych DataVault.

W module możesz:

- wybrać bazowy wpis z Bestiariusza,
- zmienić wybrane statystyki,
- dopisać własne notatki,
- dodać broń,
- dodać pancerz,
- dodać augumentacje,
- dodać ekwipunek,
- dodać talenty,
- dodać psionikę,
- dodać modlitwy,
- zapisać często używaną konfigurację jako ulubioną,
- wygenerować kartę NPC do podglądu lub wydruku.

## Jak otworzyć moduł

Otwórz:

```text
GeneratorNPC/index.html
```

GeneratorNPC nie ma osobnego trybu admina. Dostęp do danych jest chroniony przez bramkę K.O.Z.A.

## Dostęp do prywatnych danych K.O.Z.A.

Po wejściu do modułu może pojawić się ekran dostępu do danych z klauzulą tajności K.O.Z.A.

Na ekranie zobaczysz:

- tytuł dostępu do danych K.O.Z.A.,
- opis Rytuału Uwierzytelnienia,
- pole `Litania Dostępu`,
- przycisk rozpoczęcia rytuału.

Wpisz hasło i zatwierdź. Po poprawnym logowaniu GeneratorNPC pobierze dane z prywatnej bazy DataVault.

`DataVault` i `GeneratorNPC` korzystają z tej samej sesji prywatnych danych. Jeżeli zalogujesz się w jednym module, drugi może odblokować się w tej samej przeglądarce bez ponownego wpisywania hasła.

## Źródło danych

GeneratorNPC ładuje dane z prywatnej bazy DataVault.

W praktyce oznacza to, że listy w module pochodzą z arkuszy takich jak:

- `Bestiariusz`,
- `Bronie`,
- `Pancerze`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

Jeżeli dane nie zostały załadowane, moduł nie będzie miał z czego zbudować karty NPC.

## Główne elementy ekranu

### Nagłówek

W nagłówku znajdują się:

- nazwa modułu,
- przycisk `Reset`,
- przycisk `Generuj kartę`,
- ukryty przełącznik języka.

### Panel boczny

Panel boczny zawiera:

- `Źródło danych` — informację o stanie ładowania prywatnej bazy,
- `Wybór bazowy` — wybór wpisu z Bestiariusza i notatki,
- `Moduły aktywne` — przełączniki sekcji karty,
- `Ulubione` — zapisane konfiguracje NPC.

### Obszar roboczy

Obszar roboczy zawiera podgląd i tabele wyboru:

- `Podgląd bazowy Bestiariusza`,
- `Wybór Broni`,
- `Wybór Pancerzy`,
- `Wybór Augumentacji`,
- `Wybór Ekwipunku`,
- `Wybór Talentów`,
- `Wybór Psioniki`,
- `Wybór Modlitw`.

## Tworzenie NPC krok po kroku

1. Otwórz `GeneratorNPC/index.html`.
2. Przejdź bramkę K.O.Z.A., jeżeli się pojawi.
3. Poczekaj, aż panel `Źródło danych` potwierdzi załadowanie danych.
4. W sekcji `Wybór bazowy` wybierz wpis z Bestiariusza.
5. Przejrzyj `Podgląd bazowy Bestiariusza`.
6. Zmień statystyki, które chcesz dostosować.
7. Dopisz notatki w polu uwag, jeżeli są potrzebne.
8. Włącz lub wyłącz moduły w sekcji `Moduły aktywne`.
9. W aktywnych modułach wybierz konkretne elementy, np. broń, pancerz albo talent.
10. Kliknij `Generuj kartę`.
11. Sprawdź kartę w nowym oknie lub nowej karcie przeglądarki.
12. Wydrukuj kartę albo użyj jej jako podglądu podczas sesji.

## Wybór bazowy z Bestiariusza

Najpierw wybierz bazowego przeciwnika albo NPC z listy Bestiariusza.

Po wyborze moduł pokazuje jego dane w podglądzie bazowym.

Jeżeli lista jest pusta albo nieaktywna, sprawdź, czy dane z prywatnej bazy zostały załadowane.

## Stare wpisy Bestiariusza

Lista Bestiariusza domyślnie ukrywa wpisy oznaczone jako stare albo zdezaktualizowane.

Aby je pokazać, zaznacz checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
```

Po odznaczeniu checkboxa stare wpisy znikają z listy.

Jeżeli wybrany był stary wpis, wybór może zostać wyczyszczony albo przełączony zgodnie z zachowaniem modułu.

## Edycja podglądu bazowego

W podglądzie bazowym możesz zmienić część wartości przed wygenerowaniem karty.

Najczęściej edytowane pola to:

- statystyki,
- odporność,
- obrona,
- żywotność,
- odporność psychiczna,
- szybkość,
- umiejętności,
- słowa kluczowe.

Zmiany dotyczą tylko aktualnie budowanej karty. Nie zmieniają danych źródłowych w DataVault.

## Edycja umiejętności i słów kluczowych

Przy polach tekstowych, takich jak `Umiejętności` i `Słowa Kluczowe`, używaj przycisku `Edytuj`.

Typowy przebieg:

1. Kliknij `Edytuj`.
2. Wpisz lub popraw tekst.
3. Kliknij `Zapisz`.
4. Sprawdź podgląd.

Słowa kluczowe w podglądzie mogą być wyróżnione kolorem, żeby były łatwiejsze do odczytania.

## Uwagi do rekordu

Pole uwag pozwala dopisać własne informacje do NPC.

Możesz tam wpisać na przykład:

- krótką taktykę przeciwnika,
- opis zachowania,
- przypomnienie dla prowadzącego,
- zmiany fabularne,
- notatki o wyposażeniu.

Uwagi mogą zostać zapisane w ulubionych razem z konfiguracją NPC.

## Moduły aktywne

W sekcji `Moduły aktywne` wybierasz, które bloki mają być widoczne w generatorze i na finalnej karcie.

Dostępne moduły:

| Moduł | Do czego służy |
| --- | --- |
| Broń | Dodaje lub zastępuje ataki na karcie. |
| Pancerz | Dodaje pancerz, WP i cechy pancerza. |
| Augumentacje | Dodaje wybrane augumentacje jako osobną sekcję. |
| Ekwipunek | Dodaje wybrane wyposażenie. |
| Talenty | Dodaje wybrane talenty. |
| Psionika | Dodaje moce psioniczne. |
| Modlitwy | Dodaje modlitwy. |

Wyłączony moduł znika z obszaru roboczego i nie jest brany pod uwagę przy generowaniu karty.

## Broń

W module broni wybierz jedną lub więcej pozycji z listy.

Wybrane bronie pojawią się na karcie jako ataki.

Możesz włączyć dodatkowe opisy cech broni, jeżeli chcesz mieć na karcie więcej szczegółów.

## Pancerz

W module pancerza wybierz pancerz z listy.

Pancerz może wpłynąć na:

- WP,
- odporność,
- cechy pancerza,
- opis pancerza na karcie.

Niektóre rekordy mogą blokować wybór pancerza, jeżeli bazowy przeciwnik nie powinien korzystać z tej sekcji.

## Augumentacje, ekwipunek, talenty, psionika i modlitwy

Te moduły dodają dodatkowe sekcje do karty.

Dla części modułów dostępny jest przełącznik pełnego opisu. Gdy jest wyłączony, karta pokazuje krótszą wersję. Gdy jest włączony, karta zawiera więcej szczegółów.

## Opisy cech

Cechy mogą być wyświetlane jako klikalne tagi.

Kliknięcie cechy pokazuje krótki opis w małym oknie podpowiedzi.

Jeżeli opis nie istnieje w danych, zobaczysz informację, że nie znaleziono opisu cechy.

Okno podpowiedzi zamkniesz krzyżykiem w jego prawym górnym rogu, klawiszem `Esc` albo stuknięciem
poza nim.

Na telefonie (poniżej 720 px szerokości) podpowiedź wysuwa się od dolnej krawędzi ekranu i zajmuje
najwyżej połowę jego wysokości, dzięki czemu wiersz, którego dotyczy, zostaje widoczny.

## Ulubione

Panel `Ulubione` pozwala zapisać gotową konfigurację NPC.

Aby dodać ulubionego:

1. Skonfiguruj NPC.
2. Opcjonalnie wpisz alias.
3. Kliknij `Dodaj do ulubionych`.

Zapisany wpis możesz później:

- wczytać,
- usunąć,
- przesunąć wyżej,
- przesunąć niżej,
- odświeżyć listę.

## Ulubione lokalne i współdzielone

Jeżeli Firebase dla ulubionych działa, lista ulubionych jest synchronizowana przez Firestore i może być dostępna na innych urządzeniach używających tej samej konfiguracji.

Jeżeli Firestore ulubionych nie działa albo nie jest skonfigurowany, moduł używa lokalnego zapisu w przeglądarce.

Lokalny zapis działa tylko na tym urządzeniu i w tej przeglądarce.

## Skąd wiesz, gdzie trafiają Twoje ulubione

W panelu `Ulubione`, pod linią statusu, stoi mała plakietka z kropką. Mówi ona jedno: gdzie trafiają
zmiany, które właśnie robisz. Plakietka jest widoczna zawsze, także wtedy, gdy wszystko działa.

| Plakietka | Kolor | Co oznacza |
| --- | --- | --- |
| `Dane wspólne` | zielona | Ulubione trafiają do wspólnej bazy. Zobaczysz je na telefonie, na drugim komputerze i zobaczą je inni, którzy używają tej samej bazy. |
| `Tylko to urządzenie` | żółta | Ulubione zostają w tej przeglądarce. Na innym urządzeniu ich nie będzie. |
| `Sprawdzanie połączenia` | szara | Moduł dopiero sprawdza łączność z bazą. Stan przejściowy, trwa chwilę po otwarciu modułu. |

Jeżeli plakietka pokazuje `Tylko to urządzenie`, nie znaczy to, że Twoja praca przepadła — znaczy, że
została na tym komputerze i nie pojechała dalej.

## Pasek u góry ekranu

Kiedy zapis do bazy się nie uda, u góry ekranu pojawia się szeroki pasek. Pasek nie znika sam:
zamykasz go krzyżykiem albo znika, gdy zapis wreszcie się powiedzie. To jest celowe — jednolinijkowy
komunikat w rogu panelu zbyt łatwo przeoczyć.

Pasek ma dwa kolory:

- **żółty** — pracujesz dalej, ale nie wspólnie. Zmiany zostają na tym urządzeniu;
- **czerwony** — coś nie zostało zapisane albo nie udało się wczytać danych.

Pasek zawsze mówi trzy rzeczy: co się stało z danymi, dlaczego i co z tym zrobić. Na dole jest kod
błędu — przyda się, gdybyś zgłaszał problem.

## Wczytywanie ulubionego

Kliknięcie `Wczytaj` przy ulubionym wpisie odtwarza konfigurację.

Może zostać odtworzone:

- wybrany wpis Bestiariusza,
- notatki,
- nadpisane statystyki,
- wybrane bronie,
- wybrany pancerz,
- wybrane moduły dodatkowe,
- ustawienia przełączników.

Jeżeli dane źródłowe DataVault zmieniły się od czasu zapisania ulubionego, stary wpis może nie odtworzyć się idealnie.

## Generowanie karty

Przycisk `Generuj kartę` tworzy finalny widok NPC.

Przed kliknięciem upewnij się, że wybrano bazowy wpis Bestiariusza.

Karta otwiera się w osobnym oknie albo osobnej karcie przeglądarki.

Karta może zawierać:

- nazwę NPC,
- słowa kluczowe,
- poziomy zagrożenia,
- statystyki,
- żywotność,
- odporność psychiczną,
- umiejętności,
- premie,
- zdolności,
- ataki,
- dodatkowe moduły,
- notatki.

## Drukowanie karty

Po wygenerowaniu karty użyj funkcji drukowania przeglądarki.

Najczęściej:

```text
Ctrl + P
```

albo opcja drukowania z menu przeglądarki.

Przed drukiem sprawdź, czy wszystkie potrzebne moduły są widoczne i czy karta nie zawiera tymczasowych notatek, których nie chcesz pokazywać graczom.

## Reset

Przycisk `Reset` czyści aktualną konfigurację i wraca do stanu początkowego.

Użyj go, gdy chcesz zacząć budować nowego NPC od zera.

## Język interfejsu

Moduł jest po polsku. Przełącznik języka polski/angielski istnieje w kodzie, ale jest ukryty
i zwykły użytkownik go nie widzi. Cała warstwa tłumaczeń pozostaje aktywna.

Aby pokazać przełącznik, wystarczy usunąć klasę `language-switcher--hidden` z kontenera `<div class="language-switcher language-switcher--hidden">` w pliku `GeneratorNPC/index.html`.
Nad tym elementem stoi komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`, żeby łatwo było
trafić we właściwe miejsce. Nic więcej nie trzeba zmieniać.

## Potwierdzanie, że dane otwiera Twoja aplikacja

Moduł przy uruchomieniu potwierdza w tle, że jest tą aplikacją, którą znasz, a nie obcym programem
podszywającym się pod nią. Korzysta do tego z mechanizmu Google o nazwie reCAPTCHA.

Dla Ciebie oznacza to dokładnie nic do zrobienia: nie pojawiają się żadne obrazki, żadne pytania
„czy jesteś robotem" i żaden dodatkowy przycisk. Potwierdzenie odbywa się bez Twojego udziału.

Jeżeli to potwierdzenie z jakiegoś powodu nie dojdzie do skutku — na przykład dodatek blokujący
reklamy zatrzyma połączenie z Google albo sieć go nie przepuści — **moduł działa dalej normalnie**,
dokładnie tak jak wcześniej. Ślad zostaje wyłącznie w oknie narzędzi dla programistów, jako
informacja, że potwierdzenie zostało pominięte.

## Typowe komunikaty i co zrobić

| Komunikat lub sytuacja | Co oznacza | Co zrobić |
| --- | --- | --- |
| Bramka K.O.Z.A. nie znika | Hasło jest błędne albo logowanie Firebase nie działa. | Sprawdź hasło. Jeżeli problem trwa, zgłoś adminowi. |
| Dane nie ładują się | Moduł nie może pobrać danych DataVault. | Odśwież stronę. Jeżeli problem trwa, zgłoś adminowi technicznemu. |
| Brak wymaganego arkusza | W prywatnej bazie brakuje jednej z tabel potrzebnych GeneratorNPC. | Dane DataVault trzeba odświeżyć albo naprawić import. |
| Lista Bestiariusza jest pusta | Brak danych albo dane nie zostały załadowane. | Sprawdź panel `Źródło danych`. |
| Nie można wygenerować karty | Nie wybrano bazowego NPC. | Wybierz wpis z Bestiariusza. |
| Ulubione nie synchronizują się między urządzeniami | Moduł używa lokalnego zapisu zamiast Firestore. | Sprawdź konfigurację ulubionych albo używaj tego samego urządzenia. |
| Żółty pasek „Zapisano tylko na tym urządzeniu" | Baza odrzuciła zapis, więc ulubiony wpis został zapisany w tej przeglądarce. | Najczęstsza przyczyna to dodatek blokujący reklamy, który blokuje adres `google.com/recaptcha`. Wyłącz blokowanie dla tej strony i odśwież moduł. |
| Czerwony pasek „Zmiana nie została zapisana" | Nie udało się zapisać nigdzie — ani w bazie, ani w przeglądarce. | Odśwież stronę i powtórz zmianę. Jeżeli to nie pomoże, zgłoś adminowi kod błędu z paska. |
| Czerwony pasek „Nie udało się wczytać danych z bazy" | Moduł nie dostał listy ulubionych i pokazuje to, co ma zapisane w tej przeglądarce. | Jak wyżej: sprawdź dodatek blokujący, potem odśwież stronę. |
| Żółty pasek „Zmiany (...) zostały właśnie zastąpione danymi z bazy" | Wcześniej pracowałeś bez połączenia z bazą, a teraz baza wróciła i nadpisała stan modułu. | Sprawdź listę ulubionych. Czego brakuje, dodaj ponownie — moduł celowo nie scala takich zmian sam, żeby nie skasować pracy z drugiego urządzenia. |
| Żółty pasek „Moduł pracuje na pamięci tego urządzenia" | Ta kopia modułu nie ma konfiguracji bazy. | To ustawienie, a nie awaria. Jeżeli ulubione mają być wspólne, poproś admina o konfigurację. |
| Ulubiony wpis wczytuje inne elementy niż wcześniej | Dane DataVault zmieniły kolejność albo zawartość. | Sprawdź konfigurację ręcznie i zapisz nowy ulubiony wpis. |
| Brak opisu cechy | W danych nie ma opisu dla tej cechy. | Możesz nadal używać karty; brakuje tylko podpowiedzi. |
| Moduł działa, ale w narzędziach dla programistów widać „App Check pominięty" | Przeglądarka nie pobrała składnika Google służącego do potwierdzania aplikacji. | Nic nie trzeba robić, moduł działa. Jeżeli chcesz to usunąć, wyłącz na tej stronie dodatek blokujący reklamy. |

## Krótki workflow podczas sesji

1. Otwórz `GeneratorNPC/index.html`.
2. Przejdź bramkę K.O.Z.A., jeżeli się pojawi.
3. Wybierz bazowego NPC z Bestiariusza.
4. Zmień statystyki i teksty, jeżeli potrzeba.
5. Włącz potrzebne moduły.
6. Wybierz broń, pancerz i dodatki.
7. Dopisz notatki prowadzącego.
8. Zapisz konfigurację w ulubionych, jeżeli będzie używana ponownie.
9. Kliknij `Generuj kartę`.
10. Sprawdź kartę i wydrukuj albo zostaw jako podgląd.

---

# 🇬🇧 User guide — GeneratorNPC (EN)

## What GeneratorNPC is for

`GeneratorNPC` is used to quickly prepare an enemy or non-player character card from private DataVault data.

In this module you can:

- select a base Bestiary entry,
- change selected statistics,
- add your own notes,
- add weapons,
- add armor,
- add augmentations,
- add equipment,
- add talents,
- add psionics,
- add prayers,
- save a frequently used configuration as a favorite,
- generate an NPC card for preview or print.

## How to open the module

Open:

```text
GeneratorNPC/index.html
```

GeneratorNPC has no separate admin mode. Data access is protected by the K.O.Z.A. gate.

## K.O.Z.A. private data access

After opening the module, you may see the K.O.Z.A. classified data access screen.

The screen contains:

- K.O.Z.A. data access title,
- Rite of Authentication description,
- `Litany of Access` password field,
- ritual start button.

Enter the password and confirm. After successful login, GeneratorNPC loads data from the private DataVault database.

`DataVault` and `GeneratorNPC` use the same private data session. If you log into one of these modules, the other may unlock in the same browser without entering the password again.

## Data source

GeneratorNPC loads data from the private DataVault database.

In practice, module lists come from sheets such as:

- `Bestiariusz`,
- `Bronie`,
- `Pancerze`,
- `Augumentacje`,
- `Ekwipunek`,
- `Talenty`,
- `Psionika`,
- `Modlitwy`.

If data is not loaded, the module has no source data for building an NPC card.

## Main screen elements

### Header

The header contains:

- module name,
- `Reset` button,
- `Generate card` button,
- hidden language switcher.

### Sidebar

The sidebar contains:

- `Data source` — private database loading status,
- `Base selection` — Bestiary entry selection and notes,
- `Active modules` — card section toggles,
- `Favorites` — saved NPC configurations.

### Workspace

The workspace contains preview and selection tables:

- `Base preview — Bestiary`,
- `Weapon selection`,
- `Armor selection`,
- `Augmentation selection`,
- `Equipment selection`,
- `Talent selection`,
- `Psionics selection`,
- `Prayer selection`.

## Creating an NPC step by step

1. Open `GeneratorNPC/index.html`.
2. Pass the K.O.Z.A. gate if it appears.
3. Wait until `Data source` confirms that data is loaded.
4. In `Base selection`, choose a Bestiary entry.
5. Review `Base preview — Bestiary`.
6. Change statistics you want to adjust.
7. Add notes if needed.
8. Enable or disable modules in `Active modules`.
9. In active modules, select specific items, such as weapon, armor, or talent.
10. Click `Generate card`.
11. Check the card in the new browser window or tab.
12. Print the card or use it as a session reference.

## Base Bestiary selection

First choose a base enemy or NPC from the Bestiary list.

After selection, the module shows its data in the base preview.

If the list is empty or inactive, check whether private database data has loaded.

## Old Bestiary entries

The Bestiary list hides old or outdated entries by default.

To show them, enable the checkbox:

```text
Show outdated entries?
```

When the checkbox is disabled again, old entries disappear from the list.

If an old entry was selected, the selection may be cleared or switched according to module behavior.

## Editing base preview

In the base preview you can change selected values before generating the card.

Common edited fields include:

- statistics,
- resilience,
- defense,
- wounds,
- shock,
- speed,
- skills,
- keywords.

Changes affect only the card currently being built. They do not change source data in DataVault.

## Editing skills and keywords

For text fields such as `Skills` and `Keywords`, use the `Edit` button.

Typical flow:

1. Click `Edit`.
2. Enter or correct text.
3. Click `Save`.
4. Check the preview.

Keywords in preview may be color-highlighted for readability.

## Record notes

The notes field lets you add your own NPC information.

You can use it for:

- short enemy tactics,
- behavior description,
- GM reminders,
- story changes,
- equipment notes.

Notes can be saved in favorites together with the NPC configuration.

## Active modules

In `Active modules`, choose which blocks should be visible in the generator and on the final card.

Available modules:

| Module | What it does |
| --- | --- |
| Weapons | Adds or replaces attacks on the card. |
| Armor | Adds armor, AR, and armor traits. |
| Augmentations | Adds selected augmentations as a separate section. |
| Equipment | Adds selected equipment. |
| Talents | Adds selected talents. |
| Psionics | Adds psychic powers. |
| Prayers | Adds prayers. |

A disabled module disappears from the workspace and is not included when generating the card.

## Weapons

In the weapon module, select one or more items from the list.

Selected weapons appear on the card as attacks.

You can enable additional weapon trait descriptions if you want more detail on the card.

## Armor

In the armor module, select armor from the list.

Armor may affect:

- AR,
- resilience,
- armor traits,
- armor description on the card.

Some records may block armor selection if the base enemy should not use this section.

## Augmentations, equipment, talents, psionics, and prayers

These modules add extra card sections.

Some modules have a full-description toggle. When disabled, the card shows a shorter version. When enabled, the card includes more details.

## Trait descriptions

Traits may appear as clickable tags.

Clicking a trait shows a short description in a small popover.

If no description exists in the data, you will see a message that the trait description was not found.

Close the popover with the cross in its top-right corner, the `Esc` key, or by tapping outside it.

On a phone (below 720 px wide) the popover slides in from the bottom edge of the screen and takes up
at most half its height, so the row it refers to stays visible.

## Favorites

The `Favorites` panel lets you save a finished NPC configuration.

To add a favorite:

1. Configure the NPC.
2. Optionally enter an alias.
3. Click `Add to favorites`.

Later, a saved entry can be:

- loaded,
- removed,
- moved up,
- moved down,
- refreshed.

## Local and shared favorites

If favorites Firebase works, the favorites list is synchronized through Firestore and may be available on other devices using the same configuration.

If favorites Firestore does not work or is not configured, the module uses local browser storage.

Local storage works only on that device and in that browser.

## How you know where your favorites go

In the `Ulubione` panel, below the status line, there is a small badge with a dot. It says one
thing: where the changes you are making right now are going. The badge is always visible, including
when everything works.

| Badge | Colour | Meaning |
| --- | --- | --- |
| `Shared data` | green | Favorites go to the shared database. You will see them on your phone, on a second computer, and so will everyone else using the same database. |
| `This device only` | amber | Favorites stay in this browser. They will not be on another device. |
| `Checking connection` | grey | The module is still checking the database connection. A transient state lasting a moment after the module opens. |

If the badge shows `This device only`, it does not mean your work is gone — it means it stayed on
this computer and went no further.

## The bar at the top of the screen

When a write to the database fails, a wide bar appears at the top of the screen. The bar never
disappears on its own: you close it with the cross, or it disappears once a write finally succeeds.
That is deliberate — a one-line message in a panel corner is far too easy to miss.

The bar comes in two colours:

- **amber** — you can keep working, but not together. Changes stay on this device;
- **red** — something was not saved, or data could not be loaded.

The bar always says three things: what happened to the data, why, and what to do about it. At the
bottom there is an error code — useful if you report the problem.

## Loading a favorite

Clicking `Load` on a favorite restores the configuration.

It can restore:

- selected Bestiary entry,
- notes,
- overridden statistics,
- selected weapons,
- selected armor,
- selected additional modules,
- toggle settings.

If source DataVault data changed since the favorite was saved, an old favorite may not restore perfectly.

## Generating the card

`Generate card` creates the final NPC view.

Before clicking, make sure a base Bestiary entry is selected.

The card opens in a separate browser window or tab.

The card may include:

- NPC name,
- keywords,
- threat levels,
- statistics,
- wounds,
- shock,
- skills,
- bonuses,
- abilities,
- attacks,
- additional modules,
- notes.

## Printing the card

After generating the card, use your browser print function.

Most often:

```text
Ctrl + P
```

or the print option from the browser menu.

Before printing, check whether all needed modules are visible and whether the card contains temporary notes you do not want to show to players.

## Reset

`Reset` clears the current configuration and returns to the initial state.

Use it when you want to start building a new NPC from scratch.

## Interface language

The module runs in Polish. A Polish/English language selector exists in the code but is hidden, so
a regular user never sees it. The whole translation layer stays active.

To reveal the selector, remove the `language-switcher--hidden` class from the `<div class="language-switcher language-switcher--hidden">` container in `GeneratorNPC/index.html`.
A comment marked `LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits right above that element, so the
spot is easy to find. Nothing else needs to change.

## Confirming that your application is the one opening the data

On start-up the module confirms in the background that it is the application you know and not a
foreign program impersonating it. It uses a Google mechanism called reCAPTCHA for that.

For you this means exactly nothing to do: no images appear, no "are you a robot" questions and no
extra button. The confirmation happens without your involvement.

If for some reason the confirmation does not go through — for example an ad blocker stops the
connection to Google, or the network does not let it through — **the module keeps working
normally**, exactly as before. The only trace is a note in the browser developer tools saying the
confirmation was skipped.

## Common messages and what to do

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| K.O.Z.A. gate does not close | Password is wrong or Firebase login does not work. | Check password. If the problem continues, contact admin. |
| Data does not load | The module cannot fetch DataVault data. | Refresh the page. If the problem continues, contact technical admin. |
| Required sheet is missing | The private database lacks a table required by GeneratorNPC. | DataVault data must be refreshed or import must be fixed. |
| Bestiary list is empty | Data is missing or has not loaded. | Check the `Data source` panel. |
| Card cannot be generated | No base NPC is selected. | Select a Bestiary entry. |
| Favorites do not sync between devices | The module is using local storage instead of Firestore. | Check favorites configuration or use the same device. |
| Amber bar "Saved on this device only" | The database refused the write, so the favorite was saved in this browser. | The most common cause is an ad blocker blocking the `google.com/recaptcha` address. Disable blocking for this page and reload the module. |
| Red bar "The change was not saved" | Nothing was saved anywhere — neither in the database nor in the browser. | Reload the page and repeat the change. If that does not help, report the error code from the bar to the admin. |
| Red bar "Data could not be loaded from the database" | The module did not receive the favorites list and shows what it has stored in this browser. | Same as above: check the ad blocker, then reload the page. |
| Amber bar "Changes (...) have just been replaced by database data" | You were working without a database connection earlier, and now the database is back and has overwritten the module state. | Check the favorites list. Add back whatever is missing — the module deliberately does not merge such changes by itself, so it cannot erase work done on another device. |
| Amber bar "The module runs on this device's storage" | This copy of the module has no database configuration. | That is a setting, not a failure. If favorites are meant to be shared, ask the admin for the configuration. |
| Favorite loads different elements than before | DataVault order or content changed. | Check configuration manually and save a new favorite. |
| Trait description is missing | The data has no description for that trait. | You can still use the card; only the hint is missing. |
| The module works but developer tools show "App Check skipped" | The browser did not download the Google component used to confirm the application. | Nothing to do, the module works. To clear it, disable the ad blocker for this page. |

## Quick session workflow

1. Open `GeneratorNPC/index.html`.
2. Pass the K.O.Z.A. gate if it appears.
3. Select a base NPC from Bestiary.
4. Change statistics and text if needed.
5. Enable needed modules.
6. Select weapons, armor, and extras.
7. Add GM notes.
8. Save the configuration as a favorite if it will be reused.
9. Click `Generate card`.
10. Check the card and print it or keep it as a reference.

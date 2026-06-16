# 🇵🇱 Instrukcja użytkownika — Audio (PL)

## Do czego służy Audio

`Audio` to panel do szybkiego odtwarzania efektów dźwiękowych podczas sesji.

Moduł pozwala:

- odtwarzać przygotowane dźwięki,
- uruchamiać dźwięki w pętli,
- regulować głośność pojedynczych kafelków,
- korzystać z widoku głównego przygotowanego przez prowadzącego,
- przełączać się między listami ulubionych,
- w trybie admina tworzyć listy dźwięków,
- dodawać aliasy do dźwięków,
- filtrować dźwięki po tagach,
- zapisać ustawienia lokalnie albo przez Firebase, jeżeli synchronizacja jest skonfigurowana.

## Jak otworzyć moduł

Widok użytkownika:

```text
Audio/index.html
```

Widok admina:

```text
Audio/index.html?admin=1
```

Widok użytkownika służy do prostego odtwarzania gotowych list.

Widok admina służy do przygotowania widoku głównego, list ulubionych, aliasów i kolejności dźwięków.

## Widok użytkownika

W zwykłym widoku bez `?admin=1` zobaczysz:

- panel z dźwiękami,
- nawigację po prawej stronie,
- przycisk `Widok główny`,
- przyciski list ulubionych,
- kafelki dźwięków,
- suwaki głośności,
- przyciski `Loop`.

Widok użytkownika jest najlepszy do prowadzenia sesji na żywo, kiedy chcesz szybko odpalić przygotowane dźwięki.

## Nawigacja użytkownika

Po prawej stronie znajduje się panel nawigacji.

Możesz przełączać się między:

- `Widokiem głównym`,
- listami ulubionych przygotowanymi w trybie admina.

Kliknięcie pozycji w nawigacji zmienia zestaw kafelków widoczny po lewej stronie.

## Kafelek dźwięku

Kafelek dźwięku może zawierać:

- nazwę dźwięku,
- alias w nawiasie, jeżeli został ustawiony,
- tag lub nazwę grupy,
- suwak głośności,
- przycisk `Loop` w widoku użytkownika.

Kliknięcie nazwy dźwięku uruchamia odtwarzanie. Ponowne kliknięcie aktywnego dźwięku zatrzymuje go.

## Odtwarzanie dźwięku

Aby odtworzyć dźwięk:

1. Otwórz `Audio/index.html`.
2. Wybierz `Widok główny` albo listę ulubionych.
3. Kliknij nazwę dźwięku.
4. Kliknij ponownie, jeżeli chcesz go zatrzymać.

Możesz odtwarzać kilka dźwięków jednocześnie.

## Głośność

Każdy kafelek ma własny suwak głośności.

Suwak wpływa tylko na dany kafelek.

Jeżeli dźwięk gra w pętli, kolejne powtórzenia używają aktualnej wartości suwaka.

## Loop

`Loop` uruchamia dźwięk w pętli.

Zachowanie:

- kliknięcie `Loop` uruchamia pętlę,
- aktywny przycisk `Loop` jest wyróżniony,
- po zakończeniu pliku moduł uruchamia kolejne odtworzenie,
- ponowne kliknięcie aktywnego `Loop` zatrzymuje pętlę,
- jeżeli dźwięk ma kilka wariantów, kolejne odtworzenia są losowane.

Pętla jest dostępna w prawdziwym widoku użytkownika. W adminowym podglądzie użytkownika przycisk `Loop` nie jest pokazywany.

## Warianty dźwięku

Niektóre dźwięki mogą mieć kilka wariantów.

Wtedy moduł pokazuje licznik wariantów przy nazwie dźwięku.

Podczas odtwarzania wybierany jest jeden wariant. W trybie pętli moduł próbuje unikać natychmiastowego powtórzenia tego samego pliku, jeśli ma inną możliwość.

## Widok admina

Otwórz:

```text
Audio/index.html?admin=1
```

W widoku admina możesz:

- wczytać manifest dźwięków,
- filtrować listę SFX,
- tworzyć listy ulubionych,
- zmieniać nazwy list,
- usuwać listy,
- zmieniać kolejność list,
- dodawać dźwięki do list,
- dodawać dźwięki do widoku głównego,
- zmieniać kolejność dźwięków w widoku głównym,
- usuwać dźwięki z widoku głównego,
- nadawać aliasy,
- czyścić aliasy.

## Wczytanie manifestu

Przycisk `Wczytaj manifest` ładuje bazę dźwięków z pliku:

```text
AudioManifest.xlsx
```

Po poprawnym wczytaniu status manifestu pokazuje liczbę pozycji.

Jeżeli manifestu nie uda się wczytać, panel pokaże komunikat błędu.

## Lista SFX w adminie

Po wczytaniu manifestu zobaczysz listę dźwięków.

Każdy wpis może pokazywać:

- nazwę dźwięku,
- alias,
- tag,
- nazwę pliku,
- przycisk odtwarzania,
- pole aliasu,
- przycisk czyszczenia aliasu,
- wybór listy docelowej,
- przycisk dodania do listy.

## Wyszukiwanie SFX

Pole wyszukiwania SFX filtruje listę po nazwie.

Używaj go, gdy znasz fragment nazwy dźwięku albo aliasu.

## Filtrowanie tagów

Panel tagów pozwala zawęzić listę dźwięków po grupach wynikających z folderów.

Możesz:

- zaznaczać i odznaczać tagi,
- zwinąć panel tagów,
- otworzyć popup filtra,
- wyszukiwać tagi w popupie,
- zaznaczyć wszystkie tagi,
- wyczyścić zaznaczenie tagów.

Filtry tagów wpływają tylko na listę SFX w panelu admina. Nie zmieniają widoku użytkownika ani zapisanych list.

## Widok główny

`Widok główny` to podstawowa lista dźwięków widoczna dla użytkownika po wejściu do modułu.

Aby dodać dźwięk do widoku głównego:

1. Wczytaj manifest.
2. Znajdź dźwięk na liście SFX.
3. W polu wyboru listy wybierz `Widok główny`.
4. Kliknij `Dodaj do listy`.

W panelu widoku głównego możesz później:

- zmienić kolejność dźwięków,
- usunąć dźwięk,
- odsłuchać dźwięk,
- ustawić jego głośność.

## Listy ulubionych

Listy ulubionych pozwalają przygotować zestawy dźwięków na konkretne sceny, lokacje albo sytuacje.

Przykłady:

- walka,
- horror,
- miasto,
- ruiny,
- statek,
- tło ambientowe.

Aby utworzyć listę:

1. Kliknij `Nowa lista ulubionych`.
2. Wpisz nazwę listy.
3. Dodaj dźwięki z listy SFX.

Listy można przesuwać, zmieniać ich nazwy i usuwać.

## Dodawanie dźwięku do listy

1. Znajdź dźwięk na liście SFX.
2. Wybierz listę docelową z menu przy kafelku.
3. Kliknij `Dodaj do listy`.
4. Sprawdź panel list ulubionych.

Ten sam dźwięk może występować w różnych listach.

## Alias dźwięku

Alias to własna nazwa pomocnicza.

Przydaje się, gdy oryginalna nazwa pliku albo sampla jest mało czytelna.

Przykłady aliasów:

- `alarm świątyni`,
- `korytarz techniczny`,
- `zombie blisko`,
- `wybuch daleko`.

Alias pojawia się przy nazwie dźwięku w nawiasie.

## Czyszczenie aliasów

Możesz wyczyścić:

- pojedynczy alias przy danym dźwięku,
- wszystkie aliasy jednocześnie.

Przycisk `Wyczyść wszystkie aliasy` usuwa wszystkie aliasy w module Audio po potwierdzeniu.

## Zapis ustawień

Ustawienia obejmują:

- listy ulubionych,
- widok główny,
- aliasy.

Jeżeli Firebase jest skonfigurowany i działa, ustawienia są synchronizowane przez Firestore.

Jeżeli Firebase nie jest skonfigurowany albo nie działa, ustawienia zapisują się lokalnie w przeglądarce.

Zapis lokalny działa tylko na tym urządzeniu i w tej przeglądarce.

## Statusy

W adminie widoczne są statusy:

| Status | Znaczenie |
| --- | --- |
| Manifest | Informuje, czy plik `AudioManifest.xlsx` został wczytany. |
| Firebase | Informuje, czy moduł używa synchronizacji, czy ustawień lokalnych. |
| Ulubione | Pokazuje liczbę list ulubionych. |

## Dobre praktyki podczas sesji

- Przed sesją przygotuj `Widok główny` z najczęściej używanymi dźwiękami.
- Przygotuj kilka list tematycznych zamiast jednej bardzo długiej listy.
- Nadawaj aliasy dźwiękom o mało czytelnych nazwach.
- Przetestuj głośność najważniejszych dźwięków przed sesją.
- Długie tła ambientowe uruchamiaj przez `Loop`.
- Krótkie efekty odpalaj pojedynczym kliknięciem nazwy.
- Nie zostawiaj zbyt wielu aktywnych pętli naraz, jeśli gracze mają rozumieć dialog.

## Typowe komunikaty i co zrobić

| Komunikat lub sytuacja | Co oznacza | Co zrobić |
| --- | --- | --- |
| Manifest: brak danych | Manifest nie został jeszcze wczytany albo nie zawiera pozycji. | Kliknij `Wczytaj manifest`. |
| Manifest: błąd wczytywania | Nie udało się pobrać lub odczytać `AudioManifest.xlsx`. | Sprawdź obecność pliku i odśwież stronę. |
| Firebase: lokalne ustawienia | Moduł działa bez synchronizacji Firestore. | To normalne w trybie lokalnym; ustawienia zostaną w tej przeglądarce. |
| Firebase: brak konfiguracji | Brakuje konfiguracji Firebase. | Zgłoś adminowi technicznemu, jeżeli potrzebna jest synchronizacja. |
| Brak linku do pliku audio | Manifest nie ma poprawnego linku do pliku. | Sprawdź dany wpis w manifeście. |
| Brak wyników po filtrze | Filtry ukryły wszystkie dźwięki. | Wyczyść wyszukiwarkę albo zaznacz tagi ponownie. |
| Dźwięk z listy jest oznaczony jako brakujący | Lista zawiera ID, którego nie ma w aktualnym manifeście. | Usuń wpis z listy albo odśwież manifest. |

## Krótki workflow — przygotowanie sesji

1. Otwórz `Audio/index.html?admin=1`.
2. Kliknij `Wczytaj manifest`.
3. Znajdź najważniejsze dźwięki przez wyszukiwarkę i tagi.
4. Dodaj najczęstsze dźwięki do `Widoku głównego`.
5. Utwórz listy tematyczne.
6. Dodaj dźwięki do list.
7. Nadaj aliasy trudnym nazwom.
8. Sprawdź głośność.
9. Otwórz `Audio/index.html` do prowadzenia sesji.
10. Używaj `Loop` dla tła i kliknięć jednorazowych dla efektów.

---

# 🇬🇧 User guide — Audio (EN)

## What Audio is for

`Audio` is a panel for quickly playing sound effects during a session.

The module lets you:

- play prepared sounds,
- loop sounds,
- adjust volume per tile,
- use the main view prepared by the GM,
- switch between favorite lists,
- create sound lists in admin mode,
- add aliases to sounds,
- filter sounds by tags,
- save settings locally or through Firebase when synchronization is configured.

## How to open the module

User view:

```text
Audio/index.html
```

Admin view:

```text
Audio/index.html?admin=1
```

User view is for simple playback of prepared lists.

Admin view is for preparing the main view, favorite lists, aliases, and sound order.

## User view

In normal view without `?admin=1`, you will see:

- sound panel,
- navigation on the right,
- `Main view` button,
- favorite list buttons,
- sound tiles,
- volume sliders,
- `Loop` buttons.

User view is best for live play when you want to trigger prepared sounds quickly.

## User navigation

The navigation panel is on the right.

You can switch between:

- `Main view`,
- favorite lists prepared in admin mode.

Clicking a navigation item changes the tile set visible on the left.

## Sound tile

A sound tile can contain:

- sound name,
- alias in parentheses when set,
- tag or group name,
- volume slider,
- `Loop` button in user view.

Clicking the sound name starts playback. Clicking the active sound again stops it.

## Playing a sound

To play a sound:

1. Open `Audio/index.html`.
2. Choose `Main view` or a favorite list.
3. Click the sound name.
4. Click again if you want to stop it.

Several sounds can play at the same time.

## Volume

Each tile has its own volume slider.

The slider affects only that tile.

If a sound is looping, later loop iterations use the current slider value.

## Loop

`Loop` starts a sound in loop mode.

Behavior:

- clicking `Loop` starts looping,
- active `Loop` button is highlighted,
- after the file ends, the module starts another playback,
- clicking active `Loop` again stops the loop,
- if the sound has several variants, later playbacks are randomized.

Loop is available in the real user view. It is not shown in the admin user-preview panel.

## Sound variants

Some sounds can have several variants.

The module then shows a variant counter next to the sound name.

During playback, one variant is selected. In loop mode, the module tries to avoid immediately repeating the same file when another option exists.

## Admin view

Open:

```text
Audio/index.html?admin=1
```

In admin view you can:

- load the sound manifest,
- filter the SFX list,
- create favorite lists,
- rename lists,
- remove lists,
- reorder lists,
- add sounds to lists,
- add sounds to the main view,
- reorder sounds in the main view,
- remove sounds from the main view,
- assign aliases,
- clear aliases.

## Loading the manifest

`Load manifest` loads the sound database from:

```text
AudioManifest.xlsx
```

After successful loading, manifest status shows item count.

If the manifest cannot be loaded, the panel shows an error message.

## Admin SFX list

After loading the manifest, you will see the sound list.

Each entry can show:

- sound name,
- alias,
- tag,
- filename,
- play button,
- alias field,
- clear alias button,
- target list selector,
- add-to-list button.

## Searching SFX

The SFX search field filters the list by name.

Use it when you know part of the sound name or alias.

## Tag filtering

The tag panel narrows sounds by folder-derived groups.

You can:

- check and uncheck tags,
- collapse the tag panel,
- open the filter popup,
- search tags in the popup,
- select all tags,
- clear tag selection.

Tag filters affect only the admin SFX list. They do not change user view or saved lists.

## Main view

`Main view` is the basic sound list visible to the user after opening the module.

To add a sound to the main view:

1. Load manifest.
2. Find the sound in the SFX list.
3. In the target list selector, choose `Main view`.
4. Click `Add to list`.

In the main view panel you can later:

- reorder sounds,
- remove sound,
- preview sound,
- set its volume.

## Favorite lists

Favorite lists let you prepare sound sets for specific scenes, locations, or situations.

Examples:

- combat,
- horror,
- city,
- ruins,
- ship,
- ambient background.

To create a list:

1. Click `New favorites list`.
2. Enter list name.
3. Add sounds from the SFX list.

Lists can be reordered, renamed, and removed.

## Adding sound to a list

1. Find a sound in the SFX list.
2. Choose target list from the menu on the tile.
3. Click `Add to list`.
4. Check the favorite list panel.

The same sound can appear in multiple lists.

## Sound alias

Alias is your own helper name.

It is useful when the original file or sample name is hard to read.

Alias examples:

- `temple alarm`,
- `technical corridor`,
- `zombie nearby`,
- `distant explosion`.

Alias appears next to the sound name in parentheses.

## Clearing aliases

You can clear:

- one alias for one sound,
- all aliases at once.

`Clear all aliases` removes all aliases in the Audio module after confirmation.

## Saving settings

Settings include:

- favorite lists,
- main view,
- aliases.

If Firebase is configured and works, settings are synchronized through Firestore.

If Firebase is not configured or does not work, settings are saved locally in the browser.

Local save works only on that device and in that browser.

## Statuses

Admin view shows statuses:

| Status | Meaning |
| --- | --- |
| Manifest | Whether `AudioManifest.xlsx` has loaded. |
| Firebase | Whether the module uses synchronization or local settings. |
| Favorites | Number of favorite lists. |

## Session best practices

- Before the session, prepare `Main view` with the most commonly used sounds.
- Prepare several thematic lists instead of one very long list.
- Use aliases for sounds with unclear names.
- Test key sound volumes before play starts.
- Use `Loop` for long ambient backgrounds.
- Use one-click playback for short effects.
- Do not leave too many loops running if players need to hear dialogue.

## Common messages and what to do

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| Manifest: no data | Manifest has not loaded yet or contains no entries. | Click `Load manifest`. |
| Manifest: failed to load | `AudioManifest.xlsx` could not be fetched or read. | Check file presence and refresh the page. |
| Firebase: local settings | Module works without Firestore synchronization. | This is normal in local mode; settings stay in this browser. |
| Firebase: missing configuration | Firebase configuration is missing. | Contact technical admin if synchronization is needed. |
| Missing audio file link | Manifest has no valid audio file link. | Check that manifest row. |
| No results after filter | Filters hide all sounds. | Clear search or select tags again. |
| Sound from list is marked missing | The list contains an ID that does not exist in current manifest. | Remove the entry or refresh manifest. |

## Quick workflow — preparing a session

1. Open `Audio/index.html?admin=1`.
2. Click `Load manifest`.
3. Find key sounds with search and tags.
4. Add common sounds to `Main view`.
5. Create thematic lists.
6. Add sounds to lists.
7. Assign aliases to unclear names.
8. Check volume.
9. Open `Audio/index.html` for live play.
10. Use `Loop` for backgrounds and one-click playback for effects.

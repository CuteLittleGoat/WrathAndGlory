# 🇵🇱 Instrukcja użytkownika — Audio (PL)

## Do czego służy Audio

`Audio` to panel do szybkiego odtwarzania efektów dźwiękowych podczas sesji.

Moduł pozwala:

- odtwarzać przygotowane dźwięki,
- uruchamiać dźwięki w pętli,
- regulować głośność pojedynczych kafelków,
- korzystać z widoku głównego przygotowanego przez prowadzącego,
- przełączać się między listami ulubionych,
- odblokować archiwum dźwięków chronionych jedną Litanią Dostępu,
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

## Dwie warstwy biblioteki

Biblioteka dźwięków składa się z dwóch części i widać je na jednej wspólnej liście:

| Warstwa | Co zawiera | Czy wymaga hasła |
| --- | --- | --- |
| Demo | Darmowe dźwięki dostępne publicznie. | Nie. Działa od razu po otwarciu modułu. |
| Archiwum | Dźwięki chronione prawami autorskimi. | Tak. Jednorazowa Litania Dostępu. |

Po odblokowaniu archiwum obie warstwy mieszają się w jedną alfabetyczną listę. Nie musisz pamiętać, który dźwięk skąd pochodzi — po prostu klikasz.

Dopóki archiwum jest zablokowane, widzisz wyłącznie warstwę demo. Jeżeli masz listy ulubionych zawierające dźwięki z archiwum, ich pozycje będą oznaczone jako „(brak w manifeście)” do czasu odblokowania.

## Odblokowanie archiwum

Kliknij `Odblokuj archiwum`. Przycisk znajdziesz:

- w widoku użytkownika — pod nawigacją po prawej stronie,
- w widoku admina — na pasku narzędzi u góry.

Pojawi się okno „Dostęp do danych z klauzulą tajności K.O.Z.A.” — to samo, które znasz z modułu `DataVault`.

1. Wpisz Litanię Dostępu, czyli hasło grupy.
2. Kliknij `Rozpocznij Rytuał`.
3. Okno zniknie, a lista dźwięków uzupełni się o całe archiwum.

**Hasło podajesz raz na 30 dni na danym urządzeniu.** Nie pojawia się przy każdym odtworzeniu dźwięku. Możesz zamknąć przeglądarkę i wrócić następnego dnia — archiwum nadal będzie odblokowane.

Aby zamknąć dostęp wcześniej, kliknij ten sam przycisk, który po odblokowaniu nosi napis `Zablokuj archiwum`. Sesja zostanie skasowana na tym urządzeniu.

### Komunikaty w oknie bramki

| Komunikat | Znaczenie | Co zrobić |
| --- | --- | --- |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu nie została wypowiedziana. | Pole hasła było puste. | Wpisz hasło. |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu została odrzucona. | Hasło jest nieprawidłowe. | Sprawdź pisownię i spróbuj ponownie. |
| Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO\_GATE\_BASE. | Bramka nie odpowiada. | Sprawdź internet. Jeżeli problem się powtarza, zgłoś adminowi technicznemu. |
| Sesja wygasła. Podaj hasło ponownie. | Minęło 30 dni od ostatniego logowania. | Wpisz hasło ponownie. |
| Bramka nie znalazła manifestu archiwum (HTTP 404)… | Hasło było poprawne, ale bramka nie widzi pliku manifestu. | Sprawdź, czy `audio-manifest.json` leży w katalogu głównym prywatnego repozytorium `AudioRPG` i czy nazwa zgadza się co do znaku. |

Dwa pierwsze komunikaty dotyczą samego hasła i są napisane językiem lore, tak samo jak w module `DataVault`. Pozostałe to diagnostyka techniczna i mówią wprost, co sprawdzić.

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

Przycisk `Wczytaj manifest` ponownie ładuje bazę dźwięków.

Moduł pobiera wtedy dwie listy:

- listę warstwy demo z pliku `AudioManifestDemo.json` — zawsze,
- listę archiwum z bramki dostępu — tylko jeżeli archiwum jest odblokowane.

Po poprawnym wczytaniu status manifestu pokazuje łączną liczbę pozycji.

Jeżeli manifestu nie uda się wczytać, panel pokaże komunikat błędu. Gdy zawiedzie samo archiwum, warstwa demo i tak się załaduje — moduł nigdy nie zostaje całkiem pusty z powodu problemów z bramką.

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
| Manifest | Informuje, ile pozycji zostało wczytanych. |
| Firebase | Informuje, czy moduł używa synchronizacji, czy ustawień lokalnych. |
| Ulubione | Pokazuje liczbę list ulubionych. |
| Archiwum | `zablokowane` — widać tylko warstwę demo. `odblokowane` — widać całą bibliotekę. `błąd wczytywania` — coś nie zadziałało; najedź kursorem na pastylkę, żeby zobaczyć szczegół. |

Pastylki statusów są zielone, gdy wszystko jest w porządku. Czerwona pastylka oznacza wyłącznie błąd. Zablokowane archiwum **nie** jest błędem, więc pozostaje zielone.

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
| Manifest: błąd wczytywania | Nie udało się pobrać listy dźwięków. | Odśwież stronę. Jeżeli błąd wraca, zgłoś adminowi technicznemu. |
| Firebase: lokalne ustawienia | Moduł działa bez synchronizacji Firestore. | To normalne w trybie lokalnym; ustawienia zostaną w tej przeglądarce. |
| Firebase: brak konfiguracji | Brakuje konfiguracji Firebase. | Zgłoś adminowi technicznemu, jeżeli potrzebna jest synchronizacja. |
| Brak linku do pliku audio | Manifest nie ma poprawnego linku do pliku. | Sprawdź dany wpis w manifeście. |
| Brak wyników po filtrze | Filtry ukryły wszystkie dźwięki. | Wyczyść wyszukiwarkę albo zaznacz tagi ponownie. |
| Dźwięk z listy jest oznaczony jako brakujący | Lista zawiera dźwięk, którego nie ma w aktualnie wczytanej bibliotece. | Najczęściej to dźwięk z archiwum przy zablokowanym dostępie — kliknij `Odblokuj archiwum`. Jeżeli archiwum jest odblokowane, usuń wpis z listy. |

## Krótki workflow — przygotowanie sesji

1. Otwórz `Audio/index.html?admin=1`.
2. Kliknij `Odblokuj archiwum` i wpisz hasło grupy.
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
- unlock the protected sound archive with a single Litany of Access,
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

## Two library tiers

The sound library has two parts and both appear in one shared list:

| Tier | Contents | Password required |
| --- | --- | --- |
| Demo | Free sounds available publicly. | No. Works as soon as the module opens. |
| Archive | Copyright-protected sounds. | Yes. One Litany of Access. |

Once the archive is unlocked, both tiers merge into a single alphabetical list. You do not have to remember which sound comes from where — you just click.

While the archive stays locked, only the demo tier is visible. Favorite lists containing archive sounds will show those entries as "missing from the manifest" until you unlock it.

## Unlocking the archive

Click `Unlock archive`. You will find the button:

- in user view — below the navigation on the right,
- in admin view — on the toolbar at the top.

A window titled "Access to data classified under the K.O.Z.A. seal" appears — the same one you know from the `DataVault` module.

1. Enter the Litany of Access, that is the group password.
2. Click `Begin the Rite`.
3. The window closes and the sound list fills up with the whole archive.

**You enter the password once per 30 days per device.** It never appears while playing sounds. You can close the browser and come back the next day — the archive stays unlocked.

To close access earlier, click the same button, which now reads `Lock archive`. The session is cleared on that device.

### Messages in the Rite window

| Message | Meaning | What to do |
| --- | --- | --- |
| The angered Machine Spirit replies: the Litany of Access has not been recited. | The password field was empty. | Type the password. |
| The angered Machine Spirit replies: the Litany of Access was rejected. | The password is wrong. | Check the spelling and try again. |
| Cannot reach the access gateway. Check your connection and the gateway address in the AUDIO\_GATE\_BASE constant. | The gateway is not responding. | Check your internet connection. If it keeps happening, contact your technical admin. |
| Session expired. Enter the password again. | 30 days have passed since the last login. | Enter the password again. |
| The gateway could not find the archive manifest (HTTP 404)… | The password was correct but the gateway cannot see the manifest file. | Check that `audio-manifest.json` sits in the root of the private `AudioRPG` repository under exactly that name. |

The first two messages concern the password itself and keep the lore wording, exactly as in the `DataVault` module. The rest are technical diagnostics and say plainly what to check.

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

`Load manifest` reloads the sound database.

The module then fetches two lists:

- the demo tier list from `AudioManifestDemo.json` — always,
- the archive list from the access gateway — only when the archive is unlocked.

After successful loading, manifest status shows the total item count.

If the manifest cannot be loaded, the panel shows an error message. When only the archive fails, the demo tier still loads — the module never goes completely empty because of gateway trouble.

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
| Manifest | How many items have been loaded. |
| Firebase | Whether the module uses synchronization or local settings. |
| Favorites | Number of favorite lists. |
| Archive | `locked` — only the demo tier is visible. `unlocked` — the whole library is visible. `load error` — something failed; hover the pill for the detail. |

Status pills are green when everything is fine. A red pill means an error and nothing else. A locked archive is **not** an error, so it stays green.

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
| Manifest: failed to load | The sound list could not be fetched. | Refresh the page. If the error persists, contact your technical admin. |
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

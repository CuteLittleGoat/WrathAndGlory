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

Dopóki archiwum jest zablokowane, widzisz wyłącznie warstwę demo. Jeżeli masz listy ulubionych zawierające dźwięki z archiwum, ich pozycje będą oznaczone jako „(brak w manifeście)” do czasu odblokowania. Kliknięcie takiej pozycji otwiera okno hasła.

## Odblokowanie archiwum

Okno „Dostęp do danych z klauzulą tajności K.O.Z.A.” **pojawia się samo po otwarciu modułu**, jeżeli archiwum nie zostało jeszcze odblokowane na tym urządzeniu. To ta sama bramka, którą znasz z modułu `DataVault`.

Masz dwie możliwości:

1. **Wpisz Litanię Dostępu** (hasło grupy) i kliknij `Rozpocznij Rytuał`. Okno zniknie, a lista dźwięków uzupełni się o całe archiwum.
2. **Kliknij `Pomiń`.** Okno zniknie, a moduł będzie działał na samej warstwie demo. Nic się nie psuje — po prostu nie widzisz dźwięków chronionych.

**Hasło podajesz tylko raz na danym urządzeniu i sesja nie wygasa.** Nie pojawia się przy każdym odtworzeniu dźwięku. Możesz zamknąć przeglądarkę i wrócić za miesiąc — archiwum nadal będzie odblokowane. Dostęp znika dopiero wtedy, gdy wyczyścisz dane przeglądarki.

Jeżeli klikniesz `Pomiń`, bramka nie wróci aż do zamknięcia karty. Gdy zmienisz zdanie w trakcie sesji, kliknij `Odblokuj archiwum`:

- w widoku użytkownika — pod nawigacją po prawej stronie,
- w widoku admina — na pasku narzędzi u góry.

Przycisk `Odblokuj archiwum` znika, gdy archiwum jest już odblokowane — nie ma czego odblokowywać. Nie ma osobnego przycisku blokowania: żeby zamknąć dostęp na danym urządzeniu, wyczyść dane witryny w przeglądarce.

Bramka otwiera się też sama, gdy klikniesz na liście pozycję opisaną jako „(brak w manifeście)”. Taki wpis to prawie zawsze dźwięk z archiwum, więc zamiast milczeć, moduł od razu pyta o hasło i wyjaśnia, dlaczego.

### Komunikaty w oknie bramki

| Komunikat | Znaczenie | Co zrobić |
| --- | --- | --- |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu nie została wypowiedziana. | Pole hasła było puste. | Wpisz hasło. |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu została odrzucona. | Hasło jest nieprawidłowe. | Sprawdź pisownię i spróbuj ponownie. |
| Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO\_GATE\_BASE. | Przeglądarka w ogóle nie dodzwoniła się do bramki. | Sprawdź internet. Jeżeli problem się powtarza, zgłoś adminowi technicznemu. |
| Sesja wygasła. Podaj hasło ponownie. | Bramka odrzuciła zapisany dostęp — najczęściej dlatego, że admin techniczny zmienił klucz podpisu. | Wpisz hasło ponownie. |
| Ten dźwięk nie należy do warstwy publicznej. Odblokuj archiwum, aby go wczytać. | Kliknięto pozycję opisaną jako „(brak w manifeście)” przy zablokowanym archiwum. | Wpisz hasło albo kliknij `Pomiń`, jeżeli nie masz dostępu do archiwum. |
| Bramka nie znalazła manifestu archiwum (HTTP 404)… | Hasło było poprawne, ale bramka nie widzi pliku manifestu. | Sprawdź, czy `audio-manifest.json` leży w katalogu głównym prywatnego repozytorium `AudioRPG` i czy nazwa zgadza się co do znaku. |
| Nie udało się wczytać listy publicznej (HTTP 404)… | Hasło było poprawne, ale nie udało się pobrać pliku `AudioManifest.json`. **Najczęstsza przyczyna: przeglądarka trzyma starą wersję strony**, która szuka pliku pod nieaktualną nazwą. | Odśwież stronę z pominięciem pamięci podręcznej: `Ctrl+F5` (Windows) albo `Cmd+Shift+R` (Mac). Jeżeli to nie pomoże, sprawdź, czy `AudioManifest.json` jest w folderze `Audio`. |
| Bramka dostępu odpowiedziała nieoczekiwanym kodem HTTP … | Bramka działa i odpowiedziała, ale odrzuciła samo logowanie. | Zgłoś adminowi technicznemu razem z kodem HTTP z komunikatu. |
| Bramka dostępu odpowiedziała kodem HTTP … przy pobieraniu manifestu archiwum | Logowanie się udało, ale pobranie listy archiwum zwróciło błąd. | Zgłoś adminowi technicznemu razem z kodem HTTP z komunikatu. |

Dwa pierwsze komunikaty dotyczą samego hasła i są napisane językiem lore, tak samo jak w module `DataVault`. Pozostałe to diagnostyka techniczna i mówią wprost, co sprawdzić.

Komunikat „Brak połączenia z bramką dostępu” pojawia się **wyłącznie wtedy, gdy przeglądarka w ogóle nie dodzwoniła się do bramki**. Jeżeli bramka odpowiedziała, ale coś innego poszło nie tak, zobaczysz komunikat opisujący tę konkretną rzecz razem z kodem HTTP. Nie musisz więc zgadywać, czy problem jest w internecie, w bramce, czy w plikach.

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

- listę warstwy demo z pliku `AudioManifest.json` — zawsze,
- listę archiwum z bramki dostępu — tylko jeżeli archiwum jest odblokowane.

Po poprawnym wczytaniu status manifestu pokazuje łączną liczbę pozycji.

Jeżeli manifestu nie uda się wczytać, panel pokaże komunikat błędu. Gdy zawiedzie samo archiwum, warstwa demo i tak się załaduje — moduł nigdy nie zostaje całkiem pusty z powodu problemów z bramką.

## Budowanie manifestów z pliku XLSX

Lista dźwięków powstaje ze skoroszytu Excela `AudioManifest.xlsx`. Przycisk `Zbuduj manifesty z XLSX` na pasku narzędzi admina zamienia ten skoroszyt na dwa gotowe pliki JSON. Przebieg jest taki sam jak aktualizacja danych w module `DataVault`.

### Jak to zrobić krok po kroku

1. Otwórz moduł w widoku admina (adres z dopiskiem `?admin=1`).
2. Zamknij okno hasła przyciskiem `Pomiń` albo wpisz Litanię Dostępu — dopóki okno jest otwarte, zasłania pasek narzędzi.
3. Kliknij `Zbuduj manifesty z XLSX`.
4. Otworzy się zwykłe okno wyboru pliku. Wskaż swój plik `AudioManifest.xlsx`.
5. Poczekaj chwilę. Przeglądarka zapisze **dwa pliki** w Twoim katalogu pobierania (zwykle `C:\Users\<Ty>\Downloads`):
   - `AudioManifest.json` — lista warstwy demo,
   - `audio-manifest.json` — lista archiwum.
6. Pojawi się okienko z podsumowaniem: ile pozycji trafiło do każdej z list.

Nic nie jest nigdzie wysyłane. Cała zamiana odbywa się w Twojej przeglądarce, na Twoim komputerze.

### Co zrobić z tymi plikami

| Plik | Dokąd go skopiować |
| --- | --- |
| `AudioManifest.json` | Do folderu `Audio` w repozytorium `WrathAndGlory` (tam, gdzie leży `index.html`). |
| `audio-manifest.json` | Do katalogu głównego prywatnego repozytorium `AudioRPG`. Nazwa musi się zgadzać co do znaku. |

Po skopiowaniu i wysłaniu zmian moduł zobaczy nową listę dźwięków.

### Jak musi wyglądać arkusz

Arkusz musi mieć w pierwszym wierszu trzy nagłówki kolumn:

| Kolumna | Co zawiera |
| --- | --- |
| `NazwaSampla` | Nazwa dźwięku pokazywana w module. |
| `NazwaPliku` | Nazwa pliku audio, na przykład `Age_of_Sail-beat_to_quarters.ogg`. |
| `LinkDoFolderu` | Adres folderu, w którym leży plik. |

Zasady:

- **Kolejność kolumn nie ma znaczenia.**
- **Dodatkowe kolumny są ignorowane.** Możesz trzymać w arkuszu własne notatki, kolumny robocze i formuły — generator ich nie czyta.
- **Każda z trzech wymaganych kolumn może wystąpić tylko raz.** Dwie kolumny `NazwaSampla` to błąd, bo generator nie wie, którą wziąć.
- O tym, czy dźwięk trafi do warstwy demo, czy do archiwum, decyduje adres w kolumnie `LinkDoFolderu`: adresy zawierające `/AudioExample/` idą do warstwy demo, pozostałe do archiwum.

### Komunikaty generatora

| Komunikat | Co oznacza | Co zrobić |
| --- | --- | --- |
| Brak wymaganych kolumn: … | W pierwszym wierszu arkusza brakuje którejś z trzech kolumn. | Sprawdź pisownię nagłówków. Muszą brzmieć dokładnie `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`. |
| Kolumny występujące więcej niż raz: … | Wymagana kolumna pojawia się w arkuszu dwa razy lub więcej. | Usuń albo przemianuj nadmiarową kolumnę. |
| Arkusz nie zawiera żadnego wiersza z danymi. | W arkuszu jest sam nagłówek. | Uzupełnij dane. |
| Wariantów warstwy chronionej bez ścieżki w repozytorium AudioRPG: N | Adres w kolumnie `LinkDoFolderu` nie prowadzi do repozytorium `AudioRPG`. | Popraw adresy w arkuszu. Żaden plik nie został zapisany. |
| Nie udało się odczytać pliku XLSX… | Wskazany plik nie jest poprawnym skoroszytem. | Otwórz plik w Excelu i zapisz go ponownie jako `.xlsx`. |
| Nie udało się wczytać biblioteki JSZip z sieci CDN… | Generator potrzebuje jednorazowo pobrać z internetu bibliotekę do rozpakowania skoroszytu. | Sprawdź połączenie z internetem i kliknij przycisk ponownie. |

Gdy pojawi się którykolwiek z tych błędów, **żaden plik nie zostaje zapisany**. Nie ma ryzyka, że nadpiszesz dobrą listę uszkodzoną.

## Dodawanie nowego dźwięku

Dodanie dźwięku to zawsze te same cztery kroki. Jedyna różnica między dźwiękiem chronionym a publicznym to miejsce, w które wgrywasz plik, i adres, który wpisujesz w kolumnie `LinkDoFolderu`.

### Dwie zasady, których złamanie boli

Przeczytaj to zanim otworzysz arkusz.

**1. Nowe wiersze dopisuj na samym końcu arkusza. Nigdy w środku.**

Listy ulubionych, główny widok i aliasy zapisane w Firebase nie pamiętają nazw dźwięków, tylko ich identyfikatory. Gdy ta sama nazwa dźwięku powtarza się w różnych folderach, identyfikator jest rozróżniany numerem wiersza w arkuszu — w obecnej bibliotece dotyczy to **133 pozycji**. Wstawienie jednego wiersza w środku przesuwa numery wszystkich wierszy poniżej, a razem z nimi te identyfikatory.

Sprawdzone na Twoim arkuszu: dopisanie wiersza na końcu zmienia **0** identyfikatorów, a wstawienie tego samego wiersza w środku zmienia **123**. Każdy z tych 123 dźwięków wypadłby z zapisanych list i pokazałby się jako „(brak w manifeście)”.

**2. Nie zmieniaj `NazwaSampla` istniejącego dźwięku.**

Identyfikator powstaje z tej nazwy, więc jej zmiana odwiązuje dźwięk od zapisanych list dokładnie tak samo. Jeżeli chcesz, żeby dźwięk wyświetlał się pod inną nazwą, użyj **aliasu** w panelu admina — alias zmienia to, co widać, i nie rusza identyfikatora.

Zmiana `NazwaPliku` albo `LinkDoFolderu` istniejącego wiersza jest bezpieczna dla identyfikatora (zmienia tylko to, skąd moduł bierze plik i jakie dostaje tagi).

### Krok 1 — wgraj plik audio

Format: **`.ogg` albo `.mp3`**. Innych bramka nie wyda — plik w innym formacie po prostu się nie odtworzy.

#### Wariant A — dźwięk chroniony

Wgraj plik do **prywatnego repozytorium `AudioRPG`**, do folderu tematycznego, na przykład `TabletopAudio/Alien Starship SoundPad/`.

#### Wariant B — dźwięk publiczny

Wgraj plik do **publicznego repozytorium `AudioExample`**, na przykład do `WH40k_Boltgun/Boltgun/`.

> **Dźwięki publiczne muszą leżeć właśnie w `AudioExample`, a nie na dowolnej innej stronie.** Są ku temu dwa niezależne powody. Po pierwsze, generator rozpoznaje warstwę publiczną po fragmencie `/AudioExample/` w adresie — plik spod innego adresu zostanie uznany za chroniony i budowanie manifestów zakończy się błędem. Po drugie, `AudioExample` leży pod tą samą domeną co sama aplikacja (`cutelittlegoat.github.io`), a plik audio z obcej domeny odtwarzałby się **bezgłośnie**, bez żadnego komunikatu o błędzie — to znana pułapka przeglądarek opisana w dokumentacji technicznej. Jeżeli kiedyś będziesz chciał hostować dźwięki publiczne gdzie indziej, daj znać: wymaga to zmiany w kodzie, a nie tylko w arkuszu.

### Krok 2 — dopisz wiersz do `AudioManifest.xlsx`

Otwórz arkusz i dopisz **na samym końcu** jeden wiersz na każdy plik audio.

| Kolumna | Wariant A (chroniony) | Wariant B (publiczny) |
| --- | --- | --- |
| `NazwaSampla` | `Acid Attack` | `Bolter Reload Fast` |
| `NazwaPliku` | `Alien_Starship-acid_attack.ogg` | `BolterReloadFast.ogg` |
| `LinkDoFolderu` | `https://cutelittlegoat.github.io/AudioRPG/TabletopAudio/Alien Starship SoundPad` | `https://cutelittlegoat.github.io/AudioExample/WH40k_Boltgun/Boltgun` |

Uwagi do kolumn:

- `NazwaSampla` to nazwa, którą zobaczysz w module. Może zawierać spacje i polskie znaki.
- `NazwaPliku` musi się zgadzać z nazwą pliku **co do znaku**, razem z rozszerzeniem i wielkością liter.
- `LinkDoFolderu` to adres **folderu**, bez nazwy pliku na końcu. Bez ukośnika na końcu (choć nadmiarowy ukośnik nie zaszkodzi).

> Przy wariancie A adres z kolumny `LinkDoFolderu` nigdzie nie prowadzi — repozytorium `AudioRPG` jest prywatne i nie ma opublikowanej strony. Ten adres służy wyłącznie generatorowi: wycina z niego ścieżkę do pliku wewnątrz repozytorium i buduje tagi. Wpisujesz go w tej formie tylko dlatego, że tak wygląda cały arkusz.

Kolumny nadmiarowe w arkuszu możesz zostawić — generator ich nie czyta.

### Krok 3 — zbuduj manifesty

Otwórz moduł w widoku admina, kliknij `Zbuduj manifesty z XLSX` i wskaż zapisany arkusz. Szczegóły opisuje sekcja [Budowanie manifestów z pliku XLSX](#budowanie-manifestów-z-pliku-xlsx).

W okienku podsumowania sprawdź liczby: powinny wzrosnąć dokładnie o tyle pozycji, ile dodałeś.

### Krok 4 — skopiuj wygenerowane pliki

| Plik | Dokąd |
| --- | --- |
| `AudioManifest.json` | do folderu `Audio` w repozytorium `WrathAndGlory` |
| `audio-manifest.json` | do katalogu głównego prywatnego repozytorium `AudioRPG` |

**Kopiuj zawsze oba pliki**, nawet jeżeli dodałeś dźwięk tylko do jednej warstwy. Generator za każdym razem buduje obie listy od zera z całego arkusza, więc podmiana tylko jednego pliku rozjechałaby je względem siebie.

Po wysłaniu zmian odśwież moduł. Nowy dźwięk powinien być widoczny na liście.

### Skąd się biorą tagi

Tagów nie wpisujesz ręcznie — powstają automatycznie ze ścieżki folderu w kolumnie `LinkDoFolderu`. Każdy fragment ścieżki to jeden poziom drzewa tagów.

Przykład wariantu B: adres `.../AudioExample/WH40k_Boltgun/Boltgun` daje tagi `AudioExample` → `WH40k Boltgun` → `Boltgun`.

Trzy reguły przy zamianie ścieżki na tagi:

- fragment `AudioRPG` jest pomijany — dlatego dźwięki chronione zaczynają drzewo od `TabletopAudio`, a nie od nazwy repozytorium,
- z nazw folderów wycinane są słowa `SoundPad` i `Patreon` (stąd `Alien Starship SoundPad` daje tag `Alien Starship`),
- podkreślniki i myślniki zamieniają się w spacje (stąd `WH40k_Boltgun` daje tag `WH40k Boltgun`).

Praktyczny wniosek: **jeżeli chcesz, żeby nowy dźwięk trafił pod istniejący tag, wgraj go do folderu, który już istnieje.** Nowy folder to nowy tag.

### Kilka plików jako jedna pozycja

Jeżeli chcesz, żeby kilka plików było jednym dźwiękiem, z którego moduł losuje przy każdym odtworzeniu (na przykład pięć wersji uderzenia), nadaj im **tę samą nazwę zakończoną numerem** i umieść w **tym samym folderze**:

```text
Bolter Projectile Impact Rock 01
Bolter Projectile Impact Rock 02
Bolter Projectile Impact Rock 03
```

Generator złoży je w jedną pozycję `Bolter Projectile Impact Rock` z licznikiem `(3)`. Warunek: co najmniej dwa takie wiersze w tym samym folderze. Pojedynczy dźwięk z numerem na końcu nazwy zostanie osobną pozycją i zachowa numer w nazwie.

### Sprawdzenie po dodaniu

1. Odśwież moduł i kliknij `Wczytaj manifest` — status powinien pokazać większą liczbę pozycji.
2. Znajdź nowy dźwięk wyszukiwarką i odtwórz go.
3. Przy dźwięku chronionym: jeżeli nie gra, sprawdź, czy plik naprawdę leży w `AudioRPG` pod ścieżką wynikającą z `LinkDoFolderu` i `NazwaPliku`, i czy rozszerzenie to `.ogg` albo `.mp3`.
4. Sprawdź, czy Twoje dotychczasowe listy ulubionych wyglądają normalnie. Gdyby pojawiło się w nich dużo pozycji „(brak w manifeście)”, to znak, że wiersz trafił w środek arkusza zamiast na koniec — cofnij zmianę w arkuszu, przenieś wiersz na koniec i zbuduj manifesty ponownie.

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
| Manifest | Informuje, ile pozycji zostało wczytanych. Wartość `błąd listy publicznej` oznacza, że nie udało się pobrać pliku `AudioManifest.json`; najedź kursorem na pastylkę, żeby zobaczyć szczegół. |
| Firebase | Informuje, czy moduł używa synchronizacji, czy ustawień lokalnych. |
| Ulubione | Pokazuje liczbę list ulubionych. |
| Archiwum | `zablokowane` — widać tylko warstwę demo. `odblokowane` — widać całą bibliotekę. `błąd wczytywania` — coś nie zadziałało; najedź kursorem na pastylkę, żeby zobaczyć szczegół. |
| Generator | `gotowy` — generator manifestów czeka na plik. `przetwarzanie pliku` — trwa czytanie skoroszytu. `N publicznych / M chronionych` — manifesty zostały zbudowane. `błąd` — coś było nie tak z plikiem; najedź kursorem na pastylkę, żeby zobaczyć szczegół. |

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
| Dźwięk z listy jest oznaczony jako brakujący | Lista zawiera dźwięk, którego nie ma w aktualnie wczytanej bibliotece. | Najczęściej to dźwięk z archiwum przy zablokowanym dostępie — kliknij tę pozycję, a moduł sam otworzy okno hasła. Jeżeli archiwum jest odblokowane, usuń wpis z listy. |

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

While the archive stays locked, only the demo tier is visible. Favorite lists containing archive sounds will show those entries as "missing from the manifest" until you unlock it. Clicking such an entry opens the password window.

## Unlocking the archive

The window titled "Access to data classified under the K.O.Z.A. seal" **appears on its own when the module opens**, provided the archive has not been unlocked on this device yet. It is the same gate you know from the `DataVault` module.

You have two options:

1. **Enter the Litany of Access** (the group password) and click `Begin the Rite`. The window closes and the sound list fills up with the whole archive.
2. **Click `Skip`.** The window closes and the module runs on the demo tier alone. Nothing breaks — you simply do not see the protected sounds.

**You enter the password only once per device and the session never expires.** It never appears while playing sounds. You can close the browser and come back a month later — the archive stays unlocked. Access disappears only when you clear your browser data.

If you click `Skip`, the gate will not come back until you close the tab. Should you change your mind during a session, click `Unlock archive`:

- in user view — below the navigation on the right,
- in admin view — on the toolbar at the top.

The `Unlock archive` button disappears once the archive is unlocked — there is nothing left to unlock. There is no separate lock button: to close access on a device, clear the site data in your browser.

The gate also opens on its own when you click a list entry described as "missing from the manifest". Such an entry is almost always an archive sound, so instead of staying silent the module asks for the password straight away and explains why.

### Messages in the Rite window

| Message | Meaning | What to do |
| --- | --- | --- |
| The angered Machine Spirit replies: the Litany of Access has not been recited. | The password field was empty. | Type the password. |
| The angered Machine Spirit replies: the Litany of Access was rejected. | The password is wrong. | Check the spelling and try again. |
| Cannot reach the access gateway. Check your connection and the gateway address in the AUDIO\_GATE\_BASE constant. | The gateway is not responding. | Check your internet connection. If it keeps happening, contact your technical admin. |
| Session expired. Enter the password again. | The gateway rejected the stored access — usually because the technical admin rotated the signing key. | Enter the password again. |
| This sound is not part of the public tier. Unlock the archive to load it. | You clicked an entry marked "missing from the manifest" while the archive was locked. | Enter the password, or click `Skip` if you have no archive access. |
| The gateway could not find the archive manifest (HTTP 404)… | The password was correct but the gateway cannot see the manifest file. | Check that `audio-manifest.json` sits in the root of the private `AudioRPG` repository under exactly that name. |
| Could not load the public list (HTTP 404)… | The password was correct but `AudioManifest.json` could not be fetched. **The most common cause: the browser is holding an old version of the page** that looks for the file under its previous name. | Reload the page bypassing the cache: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac). If that does not help, check that `AudioManifest.json` is in the `Audio` folder. |
| The access gateway answered with an unexpected HTTP … | The gateway is running and answered, but it rejected the login itself. | Report it to your technical admin together with the HTTP code from the message. |
| The access gateway answered with HTTP … while fetching the archive manifest | The login succeeded but fetching the archive list returned an error. | Report it to your technical admin together with the HTTP code from the message. |

The first two messages concern the password itself and keep the lore wording, exactly as in the `DataVault` module. The rest are technical diagnostics and say plainly what to check.

The "Cannot reach the access gateway" message appears **only when the browser failed to reach the gateway at all**. If the gateway answered but something else went wrong, you get a message describing that specific thing together with its HTTP code. You never have to guess whether the problem is your connection, the gateway, or the files.

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

- the demo tier list from `AudioManifest.json` — always,
- the archive list from the access gateway — only when the archive is unlocked.

After successful loading, manifest status shows the total item count.

If the manifest cannot be loaded, the panel shows an error message. When only the archive fails, the demo tier still loads — the module never goes completely empty because of gateway trouble.

## Building the manifests from an XLSX file

The sound list is produced from the `AudioManifest.xlsx` Excel workbook. The `Build manifests from XLSX` button on the admin toolbar turns that workbook into two ready JSON files. The flow matches the data update in the `DataVault` module.

### Step by step

1. Open the module in admin view (the address with `?admin=1`).
2. Close the password window with `Skip`, or enter the Litany of Access — while the window is open it covers the toolbar.
3. Click `Build manifests from XLSX`.
4. A normal file picker opens. Point it at your `AudioManifest.xlsx` file.
5. Wait a moment. The browser saves **two files** into your downloads folder (usually `C:\Users\<You>\Downloads`):
   - `AudioManifest.json` — the demo tier list,
   - `audio-manifest.json` — the archive list.
6. A summary box appears telling you how many items went into each list.

Nothing is uploaded anywhere. The whole conversion happens in your browser, on your computer.

### What to do with those files

| File | Where to copy it |
| --- | --- |
| `AudioManifest.json` | Into the `Audio` folder of the `WrathAndGlory` repository (next to `index.html`). |
| `audio-manifest.json` | Into the root of the private `AudioRPG` repository, under exactly that name. |

Once copied and pushed, the module will see the new sound list.

### What the sheet must look like

The first row of the sheet must contain three column headers:

| Column | What it holds |
| --- | --- |
| `NazwaSampla` | The sound name shown in the module. |
| `NazwaPliku` | The audio file name, for example `Age_of_Sail-beat_to_quarters.ogg`. |
| `LinkDoFolderu` | The address of the folder holding the file. |

Rules:

- **Column order does not matter.**
- **Extra columns are ignored.** You can keep your own notes, working columns and formulas in the sheet — the builder does not read them.
- **Each of the three required columns may appear only once.** Two `NazwaSampla` columns is an error, because the builder cannot tell which one to use.
- Whether a sound lands in the demo tier or the archive is decided by the address in `LinkDoFolderu`: addresses containing `/AudioExample/` go to the demo tier, everything else to the archive.

### Builder messages

| Message | Meaning | What to do |
| --- | --- | --- |
| Missing required columns: … | One of the three columns is absent from the sheet's first row. | Check the header spelling. They must read exactly `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`. |
| Columns present more than once: … | A required column appears twice or more. | Remove or rename the duplicate column. |
| The sheet contains no data rows. | The sheet holds only a header. | Fill in the data. |
| Protected tier variants without a path in the AudioRPG repository: N | An address in `LinkDoFolderu` does not point at the `AudioRPG` repository. | Fix the addresses in the sheet. No file was saved. |
| Could not read the XLSX file… | The selected file is not a valid workbook. | Open it in Excel and save it again as `.xlsx`. |
| Could not load the JSZip library from the CDN… | The builder needs a one-off download of the library that unpacks the workbook. | Check your internet connection and click the button again. |

When any of these errors appears, **no file is saved**. There is no risk of overwriting a good list with a broken one.

## Adding a new sound

Adding a sound is always the same four steps. The only difference between a protected and a public sound is where you upload the file and what you write in the `LinkDoFolderu` column.

### Two rules worth reading first

Read these before you open the spreadsheet.

**1. Add new rows at the very end of the sheet. Never in the middle.**

Favorite lists, the main view and aliases saved in Firebase do not remember sound names, only their identifiers. When the same sound name repeats across different folders, the identifier is disambiguated by the row number in the spreadsheet — in the current library that affects **133 entries**. Inserting one row in the middle shifts the numbering of every row below it, and those identifiers along with it.

Verified on your own spreadsheet: appending a row at the end changes **0** identifiers, while inserting the same row in the middle changes **123**. Each of those 123 sounds would drop out of saved lists and show up as "(missing in manifest)".

**2. Do not change the `NazwaSampla` of an existing sound.**

The identifier is derived from that name, so changing it unbinds the sound from saved lists in exactly the same way. If you want a sound displayed under a different name, use an **alias** in the admin panel — an alias changes what you see and leaves the identifier alone.

Changing `NazwaPliku` or `LinkDoFolderu` on an existing row is safe for the identifier (it only changes where the module fetches the file from and which tags it gets).

### Step 1 — upload the audio file

Format: **`.ogg` or `.mp3`**. The gateway serves nothing else — a file in another format simply will not play.

#### Option A — protected sound

Upload the file to the **private `AudioRPG` repository**, into a thematic folder, for example `TabletopAudio/Alien Starship SoundPad/`.

#### Option B — public sound

Upload the file to the **public `AudioExample` repository**, for example into `WH40k_Boltgun/Boltgun/`.

> **Public sounds must live in `AudioExample` and not on some other website.** There are two independent reasons. First, the builder recognises the public tier by the `/AudioExample/` fragment in the address — a file from any other address is treated as protected and the build fails with an error. Second, `AudioExample` sits on the same domain as the application itself (`cutelittlegoat.github.io`), and an audio file from a foreign domain would play **silently**, with no error message at all — a known browser trap described in the technical documentation. If you ever want to host public sounds elsewhere, say so: that needs a code change, not just a spreadsheet change.

### Step 2 — add a row to `AudioManifest.xlsx`

Open the spreadsheet and add **at the very end** one row per audio file.

| Column | Option A (protected) | Option B (public) |
| --- | --- | --- |
| `NazwaSampla` | `Acid Attack` | `Bolter Reload Fast` |
| `NazwaPliku` | `Alien_Starship-acid_attack.ogg` | `BolterReloadFast.ogg` |
| `LinkDoFolderu` | `https://cutelittlegoat.github.io/AudioRPG/TabletopAudio/Alien Starship SoundPad` | `https://cutelittlegoat.github.io/AudioExample/WH40k_Boltgun/Boltgun` |

Notes on the columns:

- `NazwaSampla` is the name you will see in the module. Spaces and non-ASCII characters are fine.
- `NazwaPliku` must match the file name **character for character**, including the extension and letter case.
- `LinkDoFolderu` is the address of the **folder**, without the file name at the end. No trailing slash (though a stray one does no harm).

> With Option A the address in `LinkDoFolderu` leads nowhere — the `AudioRPG` repository is private and has no published site. That address serves the builder only: it cuts the in-repository file path out of it and builds the tags from it. You write it in this form purely because that is how the whole spreadsheet looks.

You can leave any extra columns in the sheet — the builder does not read them.

### Step 3 — build the manifests

Open the module in admin view, click `Build manifests from XLSX` and select the saved spreadsheet. The details are in [Building the manifests from an XLSX file](#building-the-manifests-from-an-xlsx-file).

Check the counts in the summary box: they should grow by exactly the number of entries you added.

### Step 4 — copy the generated files

| File | Where |
| --- | --- |
| `AudioManifest.json` | into the `Audio` folder of the `WrathAndGlory` repository |
| `audio-manifest.json` | into the root of the private `AudioRPG` repository |

**Always copy both files**, even when you added a sound to only one tier. The builder rebuilds both lists from scratch out of the whole spreadsheet every time, so replacing just one of them would leave the two out of step.

After pushing the changes, refresh the module. The new sound should appear in the list.

### Where the tags come from

You never type tags — they are derived automatically from the folder path in `LinkDoFolderu`. Each path segment becomes one level of the tag tree.

Option B example: the address `.../AudioExample/WH40k_Boltgun/Boltgun` yields the tags `AudioExample` → `WH40k Boltgun` → `Boltgun`.

Three rules apply when turning a path into tags:

- the `AudioRPG` segment is dropped — which is why protected sounds start their tree at `TabletopAudio` rather than at the repository name,
- the words `SoundPad` and `Patreon` are stripped from folder names (so `Alien Starship SoundPad` yields the tag `Alien Starship`),
- underscores and hyphens turn into spaces (so `WH40k_Boltgun` yields the tag `WH40k Boltgun`).

The practical consequence: **if you want a new sound to land under an existing tag, upload it into a folder that already exists.** A new folder means a new tag.

### Several files as one entry

If you want several files to act as a single sound the module picks from at random on each playback (five versions of an impact, say), give them **the same name ending in a number** and put them in **the same folder**:

```text
Bolter Projectile Impact Rock 01
Bolter Projectile Impact Rock 02
Bolter Projectile Impact Rock 03
```

The builder folds them into one entry, `Bolter Projectile Impact Rock`, with a `(3)` counter. The condition is at least two such rows in the same folder. A single sound with a trailing number stays its own entry and keeps the number in its name.

### Checking your work

1. Refresh the module and click `Load manifest` — the status should show a higher item count.
2. Find the new sound with the search box and play it.
3. For a protected sound: if it does not play, check that the file really sits in `AudioRPG` under the path implied by `LinkDoFolderu` and `NazwaPliku`, and that the extension is `.ogg` or `.mp3`.
4. Check that your existing favorite lists still look normal. If a lot of "(missing in manifest)" entries appear in them, the row landed in the middle of the spreadsheet instead of at the end — undo the spreadsheet change, move the row to the end and build the manifests again.

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
| Manifest | How many items have been loaded. A `public list error` value means `AudioManifest.json` could not be fetched; hover the pill for the detail. |
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
| Sound from list is marked missing | The list contains an ID that does not exist in the currently loaded library. | Usually an archive sound while access is locked — click that entry and the module opens the password window for you. If the archive is unlocked, remove the entry from the list. |

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

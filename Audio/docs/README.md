# 🇵🇱 Instrukcja użytkownika — Audio (PL)

## Do czego służy Audio

`Audio` to panel do szybkiego odtwarzania efektów dźwiękowych podczas sesji.

Moduł ma dwa widoki:

- **widok użytkownika** — do grania dźwięków w trakcie sesji: zakładki z listami, kafelki dźwięków, pętla, głośność;
- **panel admina** — do przygotowania list: wybieranie dźwięków z katalogu, nadawanie aliasów, ustawianie kolejności, podgląd widoku użytkownika.

Oba widoki działają w pełni na komputerze, tablecie i telefonie. Listy najwygodniej przygotowuje się na komputerze, ale każdą czynność można też wykonać na telefonie.

## Jak otworzyć moduł

Widok użytkownika:

```text
Audio/index.html
```

Panel admina:

```text
Audio/index.html?admin=1
```

## Dwie warstwy biblioteki

Biblioteka dźwięków składa się z dwóch części:

| Warstwa | Co zawiera | Czy wymaga hasła |
| --- | --- | --- |
| Demo | Darmowe dźwięki dostępne publicznie. | Nie. Działa od razu po otwarciu modułu. |
| Archiwum | Dźwięki chronione prawami autorskimi. | Tak. Jednorazowa Litania Dostępu. |

Po odblokowaniu archiwum obie warstwy łączą się w jedną bibliotekę. Dopóki archiwum jest zablokowane, dźwięki z archiwum zapisane na listach są widoczne jako przygaszone kafelki z kłódką i dopiskiem „(brak w manifeście)”. Nic nie znika — po odblokowaniu archiwum te kafelki zaczynają grać.

## Odblokowanie archiwum

Okno „Dostęp do danych z klauzulą tajności K.O.Z.A.” **pojawia się samo po otwarciu modułu**, jeżeli archiwum nie zostało jeszcze odblokowane na tym urządzeniu. To ta sama bramka, którą znasz z modułu `DataVault`.

Masz dwie możliwości:

1. **Wpisz Litanię Dostępu** (hasło grupy) i kliknij `Rozpocznij Rytuał`. Okno zniknie, a biblioteka uzupełni się o archiwum.
2. **Kliknij `Pomiń`** (albo naciśnij `Esc`). Okno zniknie, a moduł będzie działał na samej warstwie demo.

**Hasło podajesz tylko raz na danym urządzeniu i sesja nie wygasa.** Dostęp znika dopiero wtedy, gdy wyczyścisz dane przeglądarki albo gdy administrator techniczny zmieni klucz podpisu bramki.

Jeżeli klikniesz `Pomiń`, okno nie wróci aż do zamknięcia karty. Gdy zmienisz zdanie, kliknij przycisk odblokowania:

- w widoku użytkownika — przycisk z kłódką 🔒 w pasku u góry (na telefonie jest to sama kłódka),
- w panelu admina — `Odblokuj archiwum` w nagłówku.

Przycisk odblokowania znika, gdy archiwum jest odblokowane. Okno otwiera się też samo po dotknięciu kafelka z kłódką — taki kafelek to prawie zawsze dźwięk z archiwum.

### Komunikaty w oknie bramki

| Komunikat | Znaczenie | Co zrobić |
| --- | --- | --- |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu nie została wypowiedziana. | Pole hasła było puste. | Wpisz hasło. |
| Rozgniewany Duch Maszyny odpowiada: Litania Dostępu została odrzucona. | Hasło jest nieprawidłowe. | Sprawdź pisownię i spróbuj ponownie. |
| Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO\_GATE\_BASE. | Przeglądarka w ogóle nie dodzwoniła się do bramki. | Sprawdź internet. Jeżeli problem się powtarza, zgłoś adminowi technicznemu. |
| Sesja wygasła. Podaj hasło ponownie. | Bramka odrzuciła zapisany dostęp — najczęściej dlatego, że admin techniczny zmienił klucz podpisu. | Wpisz hasło ponownie. |
| Ten dźwięk nie należy do warstwy publicznej. Odblokuj archiwum, aby go wczytać. | Dotknięto kafelka z kłódką przy zablokowanym archiwum. | Wpisz hasło albo kliknij `Pomiń`. |
| Bramka nie znalazła manifestu archiwum (HTTP 404)… | Hasło było poprawne, ale bramka nie widzi pliku listy archiwum. | Sprawdź, czy `audio-manifest.json` leży w katalogu głównym prywatnego repozytorium `AudioRPG`. |
| Nie udało się wczytać listy publicznej (HTTP 404)… | Nie udało się pobrać pliku `AudioManifest.json`. Najczęstsza przyczyna: przeglądarka trzyma starą wersję strony. | Odśwież stronę z pominięciem pamięci podręcznej: `Ctrl+F5` (Windows) albo `Cmd+Shift+R` (Mac). |
| Bramka dostępu odpowiedziała nieoczekiwanym kodem HTTP … | Bramka działa, ale odrzuciła samo logowanie. | Zgłoś adminowi technicznemu razem z kodem HTTP. |
| Bramka dostępu odpowiedziała kodem HTTP … przy pobieraniu manifestu archiwum | Logowanie się udało, ale pobranie listy archiwum zwróciło błąd. | Zgłoś adminowi technicznemu razem z kodem HTTP. |

Dwa pierwsze komunikaty dotyczą samego hasła i są napisane językiem lore, tak samo jak w module `DataVault`. Pozostałe to diagnostyka techniczna.

---

## Widok użytkownika

### Pasek u góry

Pasek zostaje u góry ekranu także podczas przewijania. Zawiera:

- **zakładki list** — pierwsza jest zawsze lista główna (domyślnie „Widok główny”), dalej listy ulubionych w kolejności ustalonej w panelu admina. Aktywna zakładka jest podświetlona. Na telefonie i tablecie zakładki stoją w osobnym wierszu, który przesuwa się palcem w bok;
- **czerwoną kropkę na zakładce** — na tej liście gra dźwięk. Dźwięki nie zatrzymują się po przejściu na inną listę, a kropka pokazuje, dokąd wrócić;
- **`■ Zatrzymaj wszystko (N)`** — zatrzymuje od razu wszystkie grające dźwięki na wszystkich listach, także pętle. Liczba w nawiasie mówi, ile dźwięków gra. Gdy nic nie gra, przycisk jest nieaktywny. Na telefonie widać sam symbol `■` i liczbę;
- **przycisk z kłódką** — odblokowanie archiwum (tylko gdy archiwum jest zablokowane).

### Kafelek dźwięku

Każdy kafelek pokazuje:

- **nazwę dźwięku**,
- **alias w nawiasie**, jeżeli na tej liście nadano alias — na przykład `Meltagun Reload (przeładowanie)`,
- **czerwony licznik w nawiasie** `(5)`, jeżeli pod jedną nazwą jest kilka plików (przy każdym odtworzeniu losowany jest jeden z nich),
- **jeden tag** — nazwę kolekcji, z której pochodzi dźwięk,
- **suwak głośności** z wartością w procentach,
- **przycisk `⟳ Loop`**.

Bardzo długie nazwy są ucinane po trzech wierszach — pełną nazwę pokazuje dymek po najechaniu kursorem.

### Odtwarzanie

Dotknij albo kliknij **górną część kafelka** (ikonę, nazwę, alias lub tag), żeby odtworzyć dźwięk. Ponowne dotknięcie grającego kafelka go zatrzymuje. Kilka dźwięków może grać jednocześnie.

Po czym poznać, że dźwięk gra:

| Sygnał | Znaczenie |
| --- | --- |
| Ikona `▶` | Dźwięk jest gotowy do odtworzenia. |
| Ikona `…`, przerywana ramka, napis „wczytywanie…” | Dźwięk się wczytuje (dźwięki z archiwum potrzebują chwili na autoryzację). Ponowne dotknięcie anuluje start. |
| Ikona `■`, czerwona ramka z poświatą, czerwona nazwa | Dźwięk gra. |
| Czerwony pasek pod nazwą | Postęp odtwarzania pliku. |
| Kłódka, przygaszony kafelek, „(brak w manifeście)” | Dźwięk z zablokowanego archiwum albo dźwięk, którego nie ma już w bibliotece. |

### Loop

`⟳ Loop` odtwarza dźwięk w pętli:

- kliknięcie `Loop` uruchamia pętlę; przycisk robi się czerwony,
- jeżeli dźwięk już gra, kliknięcie `Loop` zamienia go w pętlę bez przerywania,
- ponowne kliknięcie aktywnego `Loop` albo dotknięcie kafelka zatrzymuje pętlę,
- przy dźwięku z kilkoma plikami każde kolejne okrążenie losuje plik i unika powtórzenia tego samego pliku dwa razy z rzędu.

### Głośność

Każdy kafelek ma własny suwak. Wartość obok suwaka jest w procentach: środek to `100%`, lewy koniec `0%` (cisza), prawy koniec `200%` (głośniej niż oryginał).

- Zmiana działa od razu, także na grający dźwięk i na kolejne okrążenia pętli.
- **Dwukrotne kliknięcie (dotknięcie) wartości w procentach** przywraca `100%`.
- Ustawiona głośność zostaje, gdy przechodzisz między zakładkami, ale **po odświeżeniu strony każdy kafelek wraca do 100%**.

### Ekran nie gaśnie w trakcie grania

Dopóki gra choć jeden dźwięk, moduł prosi przeglądarkę, żeby nie wygaszała ekranu (przydatne na tablecie leżącym na stole). Gdy nic nie gra, ekran wygasa normalnie. Jeżeli przeglądarka nie zna tej funkcji, nic się nie dzieje — dźwięki grają tak samo.

### Na telefonie i tablecie

- Kafelki same układają się w tyle kolumn, ile mieści ekran: jedna na telefonie w pionie, kilka na tablecie, więcej na komputerze.
- Przesuwanie suwaka nigdy nie uruchamia dźwięku — możesz spokojnie ustawiać głośność palcem.
- Pierwsze dotknięcie dźwięku po otwarciu strony „odblokowuje” dźwięk w przeglądarce — tak działają wszystkie przeglądarki mobilne.

---

## Panel admina

### Jak jest zbudowany

Panel pracuje od lewej do prawej:

1. **Foldery** — drzewo folderów, z których pochodzą dźwięki (to są tagi). Służy do zawężania katalogu.
2. **Katalog dźwięków** — wszystkie dźwięki biblioteki, z wyszukiwarką. Stąd dodajesz dźwięki do list.
3. **Listy** — lista główna i listy ulubionych, a pod nimi **edytor** wybranej listy: kolejność dźwięków i aliasy.

Na samym dole strony jest **podgląd widoku użytkownika**.

Na komputerze wszystkie trzy części stoją obok siebie, a każda przewija się osobno. Na węższym ekranie foldery chowają się w wysuwanej szufladzie (przycisk `Foldery` w nagłówku katalogu). Na tablecie i telefonie u góry pojawiają się zakładki **`Katalog` / `Listy` / `Podgląd`** — każda pokazuje jedną część panelu. Wszystkie funkcje działają na każdym urządzeniu.

### Lista docelowa i lista edytowana

Jedna lista jest zawsze **wybrana do edycji** — jest podświetlona w panelu list, a jej wpisy pokazuje edytor. Ta sama lista jest **listą docelową**: to do niej trafiają dźwięki dodawane w katalogu przyciskiem `+`. Listę docelową widać i można ją zmienić także w nagłówku katalogu (pole „Lista docelowa”) — na telefonie nie trzeba przechodzić do zakładki `Listy`.

### Nagłówek i menu „Narzędzia”

W nagłówku są pastylki statusów, przycisk `Odblokuj archiwum` (gdy archiwum jest zablokowane) i menu `Narzędzia ▾`:

| Pozycja menu | Co robi |
| --- | --- |
| `Wczytaj manifest ponownie` | Ponownie pobiera listę dźwięków (warstwę demo zawsze, archiwum — jeżeli jest odblokowane). |
| `Zbuduj manifesty z XLSX` | Zamienia skoroszyt `AudioManifest.xlsx` na dwa pliki list dźwięków (opis niżej). |
| `Eksportuj ustawienia (JSON)` | Zapisuje w katalogu pobierania plik `audio-ustawienia-RRRR-MM-DD.json` z wszystkimi listami, kolejnością i aliasami. Plik jest kopią zapasową — nie zawiera hasła ani żadnych danych logowania. |
| `Wczytaj ponownie z pamięci urządzenia` | Widoczne tylko, gdy moduł pracuje bez bazy. Wczytuje ustawienia zapisane w tej przeglądarce. |
| `Wyczyść aliasy we wszystkich listach` | Po potwierdzeniu usuwa aliasy ze wszystkich list. Same listy i dźwięki zostają. |

### Statusy

| Status | Znaczenie |
| --- | --- |
| Manifest | Ile dźwięków jest wczytanych. `błąd listy publicznej` — nie udało się pobrać `AudioManifest.json` (najedź kursorem, żeby zobaczyć szczegół). |
| Firebase | `oczekiwanie` — start; `połączono` — ustawienia są wspólne; `lokalne ustawienia` — ustawienia zostają w tej przeglądarce; `brak konfiguracji` — ta kopia modułu nie ma bazy. |
| Listy | Ile jest list razem z listą główną. |
| Archiwum | `zablokowane` — widać tylko warstwę demo (to stan poprawny); `odblokowane` — widać całą bibliotekę; `błąd wczytywania` — coś nie zadziałało (szczegół w dymku). |
| Generator | `gotowy`, `przetwarzanie pliku`, `N publicznych / M chronionych` albo `błąd` (szczegół w dymku). |

Pastylki są zielone, gdy wszystko jest w porządku. Czerwona pastylka oznacza wyłącznie błąd.

### Komunikaty pod nagłówkiem

| Komunikat | Znaczenie |
| --- | --- |
| Archiwum zablokowane — dźwięki z archiwum są widoczne na listach jako „(brak w manifeście)”. Nie zostaną usunięte. | Możesz spokojnie edytować listy — wpisy z archiwum i ich aliasy zostaną zachowane. Żeby widzieć je w katalogu, odblokuj archiwum. |
| Zapisane listy są w starym formacie i zostały pominięte. Pierwsza zmiana zapisze ustawienia w nowym formacie. | W bazie leżą listy z wcześniejszej wersji modułu. Moduł ich nie wczytuje — listy przygotowuje się od nowa. Pierwsza zmiana (np. nowa lista) zastąpi stare dane. |

Każdy komunikat zamkniesz krzyżykiem.

### Foldery

Drzewo pokazuje foldery biblioteki. Przy każdym folderze jest pole wyboru, nazwa, liczba dźwięków i przycisk `tylko`.

- **Pole zaznaczone** — dźwięki z tego folderu i wszystkich podfolderów są widoczne w katalogu.
- **Pole puste** — dźwięki z tego folderu i podfolderów są ukryte.
- **Pole z kreską (stan częściowy)** — część podfolderów jest widoczna, a część ukryta.
- Kliknięcie pola ustawia ten sam stan dla folderu i **wszystkich** jego podfolderów. Kliknięcie pola z kreską zaznacza całość.
- Możesz odznaczyć cały folder, a potem rozwinąć go i zaznaczyć jeden podfolder — katalog pokaże wtedy tylko ten podfolder.
- Strzałka `▸` / `▾` rozwija i zwija folder, niezależnie od zaznaczenia.
- `tylko` — pokazuje w katalogu wyłącznie ten folder (na komputerze przycisk pojawia się po najechaniu na wiersz).
- Liczba `(12)` to liczba dźwięków w folderze; `(3/12)` oznacza, że widocznych jest 3 z 12.
- Przyciski `Zaznacz wszystko`, `Odznacz wszystko`, `Rozwiń wszystko`, `Zwiń wszystko` działają na całe drzewo.

**Szukaj folderu.** Wpisz fragment nazwy folderu — wielkość liter i polskie znaki nie mają znaczenia (`melta` znajdzie `Meltagun`). Drzewo pokaże pasujące foldery razem z folderami nadrzędnymi, a pasujący fragment zostanie wyróżniony. Wyszukiwanie zawęża tylko drzewo, nie katalog. Przy aktywnym wyszukiwaniu pojawiają się przyciski `Zaznacz pasujące`, `Odznacz pasujące` i `Tylko pasujące`. Pole nie ma przycisku czyszczenia — żeby wyłączyć wyszukiwanie, skasuj wpisany tekst.

**Ukrywanie panelu.** Na komputerze przycisk `«` zwija panel do wąskiego paska z napisem `FOLDERY`; kliknięcie paska rozwija go z powrotem. Moduł pamięta to na tym urządzeniu. Na węższym ekranie panel otwiera się przyciskiem `Foldery` i zamyka krzyżykiem, `Esc` albo dotknięciem obok.

### Niebieskie podświetlenie — filtr jest założony

Tak samo jak w modułach `DataVault` i `GeneratorNPC`, **niebieski kolor oznacza, że widok jest zawężony**:

| Co świeci na niebiesko | Kiedy |
| --- | --- |
| etykieta `Szukaj folderu` | wpisana fraza zawęża drzewo |
| nagłówek `Foldery`, kropka na zwiniętym panelu i na przycisku `Foldery` | co najmniej jeden folder jest odznaczony |
| etykieta `Szukaj dźwięku` | wpisana fraza zawęża katalog |
| etykieta `Szukaj na liście` | wpisana fraza zawęża wpisy listy |
| napis `Foldery: N z M` nad katalogiem | co najmniej jeden folder jest odznaczony |

Najedź kursorem na niebieską etykietę, żeby zobaczyć wpisaną frazę. Sama spacja niczego nie zapala.

### Katalog dźwięków

Każdy wiersz katalogu to jeden dźwięk:

| Element | Znaczenie |
| --- | --- |
| pole wyboru | zaznaczenie do dodania kilku dźwięków naraz |
| `▶` / `■` | odsłuch; drugie kliknięcie zatrzymuje |
| nazwa i czerwone `(N)` | nazwa z biblioteki i liczba plików pod tą nazwą |
| ścieżka i nazwa pliku | skąd pochodzi dźwięk (ta sama nazwa bywa w dwóch folderach) |
| `DEMO` / `ARCHIWUM` | warstwa biblioteki |
| liczba w kółku | na ilu listach jest ten dźwięk; kliknięcie pokazuje pod wierszem nazwy list i aliasy |
| `+` / `✓` | `+` dodaje dźwięk na koniec listy docelowej; `✓` znaczy, że dźwięk już na niej jest — kliknięcie go usuwa (jeżeli ma alias, moduł najpierw zapyta) |

Katalog nie pokazuje aliasów przy nazwach, bo alias należy do listy. Aliasy widać w dymku liczby list.

**Szukaj dźwięku** — szuka w nazwie, nazwie pliku, ścieżce folderu i aliasach nadanych na listach; wielkość liter i polskie znaki nie mają znaczenia.

**Pokaż** — `wszystkie`, `spoza listy docelowej` (wygodne przy dodawaniu), `z listy docelowej`.

**Warstwa** — `wszystkie`, `demo`, `archiwum`.

**Dodawanie wielu dźwięków naraz:** zaznacz pola wyboru. Na komputerze kliknięcie pola z wciśniętym `Shift` zaznacza wszystkie wiersze pomiędzy, a `Ctrl` + kliknięcie w nazwę przełącza pojedynczy wiersz. `Zaznacz wszystkie wyniki` zaznacza wszystko, co pokazuje katalog (powyżej 50 dźwięków moduł zapyta). Na dole katalogu pojawi się pasek `Zaznaczone: N` z przyciskami `Dodaj do „nazwa listy”` i `Odznacz`.

Katalog pokazuje naraz 200 wierszy; przycisk `Pokaż kolejne 200` doładowuje resztę.

### Listy

- **Lista główna** jest zawsze pierwsza, ma pinezkę 📌 i dopisek „lista główna”. Nie da się jej usunąć ani przesunąć. Jej nazwę można zmienić; pusta nazwa oznacza „Widok główny” (albo „Main view” w wersji angielskiej).
- **`+ Nowa lista`** — tworzy listę na końcu i od razu otwiera pole nazwy. Wpisz nazwę i naciśnij `Enter`.
- **Wybór listy** — kliknij nazwę listy; lista staje się edytowana i docelowa.
- **Kolejność list** — przeciągnij listę za uchwyt `⠿` (myszą albo palcem) albo użyj strzałek `▲` `▼`. Nic nie da się postawić przed listą główną.
- Może nie być żadnej listy ulubionych — lista główna jest zawsze.

### Edytor listy

Nad wpisami są: nazwa listy, przyciski `✎` (zmień nazwę), `⧉` (duplikuj listę), `🗑` (usuń listę — nie ma go przy liście głównej), liczba dźwięków i `Wyczyść aliasy tej listy`.

- **Zmiana nazwy** — `✎` albo dwuklik na nazwie listy w panelu list. `Enter` zapisuje, `Esc` anuluje. Pusta nazwa listy ulubionych przywraca poprzednią.
- **Duplikuj listę** — tworzy kopię z tymi samymi dźwiękami i aliasami, z dopiskiem „(kopia)”, zaraz za oryginałem.
- **Usuń listę** — moduł zapyta o potwierdzenie i poda, ile dźwięków i aliasów ma lista.

Każdy wpis na liście ma:

- uchwyt `⠿`, numer pozycji, przycisk odsłuchu `▶`, nazwę z biblioteki i ścieżkę folderu,
- **pole aliasu** — alias tylko na tej liście,
- przyciski `⤒` (na początek), `▲` (w górę), `▼` (w dół), `⤓` (na koniec), `✕` (usuń z listy),
- linię **„Na innych listach: …”**, jeżeli ten sam dźwięk jest też na innych listach — z ich aliasami.

**Kolejność dźwięków** zmieniasz, przeciągając wpis za uchwyt `⠿` (myszą albo palcem) albo strzałkami. Każda zmiana zapisuje się od razu.

**Szukaj na liście** — zawęża wpisy do pasujących nazw lub aliasów. Przy aktywnym wyszukiwaniu kolejności nie można zmieniać (moduł wyświetli podpowiedź) — skasuj tekst, żeby przesuwać dźwięki.

**Wpis „(brak w manifeście)”** — dźwięk z zablokowanego archiwum albo dźwięk usunięty z biblioteki. Wpis i jego alias zostają zachowane; możesz go przesunąć, zmienić alias albo usunąć.

### Aliasy

Alias to własna nazwa pomocnicza dźwięku, na przykład `alarm świątyni` albo `wybuch daleko`. **Alias należy do listy**: ten sam dźwięk może mieć na każdej liście inny alias albo nie mieć go wcale.

Przykład: dźwięk `X` na liście `Playlista01` nie ma aliasu, na `Playlista02` ma alias `X2`, a na `Playlista03` — `X3`. W widoku użytkownika zobaczysz odpowiednio `X`, `X (X2)` i `X (X3)`.

Jak nadać alias:

1. Wybierz listę w panelu list.
2. W edytorze wpisz alias w pole przy dźwięku.
3. Naciśnij `Enter` albo kliknij poza polem — alias się zapisze. `Esc` przywraca poprzednią wartość.

Pole podpowiada aliasy, które ten dźwięk ma na innych listach. Najszybsza droga do wariantów tej samej listy: przygotuj jedną listę, zduplikuj ją `⧉` i zmień tylko aliasy.

Usunięcie dźwięku z listy usuwa też jego alias na tej liście. Przesunięcie wpisu przenosi alias razem z nim.

### Podgląd widoku użytkownika

Na dole panelu (na tablecie i telefonie — w zakładce `Podgląd`) widać widok użytkownika dokładnie takim, jaki zobaczą gracze: z zakładkami, kafelkami, suwakami, `Loop` i `Zatrzymaj wszystko`. Dźwięki w podglądzie naprawdę grają.

- **podąża za edytowaną listą** — gdy pole jest zaznaczone, podgląd pokazuje listę wybraną w edytorze, a kliknięcie zakładki w podglądzie wybiera tę listę do edycji. Gdy pole jest puste, zakładki w podglądzie przełączają tylko podgląd.
- `Komputer` / `Tablet` / `Telefon` — pokazuje, jak widok ułoży się na danej szerokości. Przyciski węższych szerokości znikają, gdy okno jest zbyt wąskie, żeby je pokazać.
- `Otwórz prawdziwy widok ↗` — otwiera widok użytkownika w nowej karcie, na zapisanych danych.
- `Zwiń podgląd` / `Rozwiń podgląd` — chowa i pokazuje podgląd; moduł pamięta to na tym urządzeniu.

### Skróty klawiszowe na komputerze

| Klawisz | Działanie |
| --- | --- |
| `/` | Kursor w wyszukiwarce katalogu (gdy kursor nie stoi w innym polu). |
| `Enter` | W polu aliasu lub nazwy listy — zapis. |
| `Esc` | W polu aliasu lub nazwy — anulowanie; poza polami — zamknięcie menu `Narzędzia` albo szuflady folderów; w oknie bramki — tak samo jak `Pomiń`. |

### Co moduł pamięta na tym urządzeniu

Panel pamięta w tej przeglądarce: zwinięcie panelu folderów, rozwinięte foldery, ostatnio edytowaną listę, ustawienia podglądu i wybraną zakładkę. Filtry (odznaczone foldery, wpisane frazy, `Pokaż`, `Warstwa`) zostają do zamknięcia karty. To tylko wygoda — nie trafia do bazy i nie wpływa na innych.

---

## Budowanie manifestów z pliku XLSX

Lista dźwięków powstaje ze skoroszytu Excela `AudioManifest.xlsx`. Pozycja `Narzędzia` → `Zbuduj manifesty z XLSX` zamienia ten skoroszyt na dwa gotowe pliki JSON.

### Jak to zrobić krok po kroku

1. Otwórz panel admina (`?admin=1`).
2. Zamknij okno hasła przyciskiem `Pomiń` albo wpisz Litanię Dostępu.
3. Otwórz menu `Narzędzia` i wybierz `Zbuduj manifesty z XLSX`.
4. Wskaż swój plik `AudioManifest.xlsx`.
5. Przeglądarka zapisze **dwa pliki** w katalogu pobierania:
   - `AudioManifest.json` — lista warstwy demo,
   - `audio-manifest.json` — lista archiwum.
6. Pojawi się okienko z podsumowaniem: ile pozycji trafiło do każdej z list.

Nic nie jest nigdzie wysyłane. Cała zamiana odbywa się w Twojej przeglądarce.

### Co zrobić z tymi plikami

| Plik | Dokąd go skopiować |
| --- | --- |
| `AudioManifest.json` | Do folderu `Audio` w repozytorium `WrathAndGlory` (tam, gdzie leży `index.html`). |
| `audio-manifest.json` | Do katalogu głównego prywatnego repozytorium `AudioRPG`. Nazwa musi się zgadzać co do znaku. |

### Jak musi wyglądać arkusz

Arkusz musi mieć w pierwszym wierszu trzy nagłówki kolumn:

| Kolumna | Co zawiera |
| --- | --- |
| `NazwaSampla` | Nazwa dźwięku pokazywana w module. |
| `NazwaPliku` | Nazwa pliku audio, na przykład `MeltagunReload.ogg`. |
| `LinkDoFolderu` | Adres folderu, w którym leży plik. |

Zasady:

- **Kolejność kolumn nie ma znaczenia.**
- **Dodatkowe kolumny są ignorowane.**
- **Każda z trzech wymaganych kolumn może wystąpić tylko raz.**
- O warstwie decyduje adres w `LinkDoFolderu`: adresy zawierające `/AudioExample/` idą do warstwy demo, pozostałe do archiwum.

### Komunikaty generatora

| Komunikat | Co oznacza | Co zrobić |
| --- | --- | --- |
| Brak wymaganych kolumn: … | W pierwszym wierszu brakuje którejś z trzech kolumn. | Nagłówki muszą brzmieć dokładnie `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`. |
| Kolumny występujące więcej niż raz: … | Wymagana kolumna pojawia się dwa razy lub więcej. | Usuń albo przemianuj nadmiarową kolumnę. |
| Arkusz nie zawiera żadnego wiersza z danymi. | W arkuszu jest sam nagłówek. | Uzupełnij dane. |
| Wariantów warstwy chronionej bez ścieżki w repozytorium AudioRPG: N | Adres w `LinkDoFolderu` nie prowadzi do repozytorium `AudioRPG`. | Popraw adresy. Żaden plik nie został zapisany. |
| Nie udało się odczytać pliku XLSX… | Plik nie jest poprawnym skoroszytem. | Otwórz go w Excelu i zapisz ponownie jako `.xlsx`. |
| Nie udało się wczytać biblioteki JSZip z sieci CDN… | Generator potrzebuje pobrać z internetu bibliotekę do rozpakowania skoroszytu. | Sprawdź internet i spróbuj ponownie. |

Przy każdym z tych błędów **żaden plik nie zostaje zapisany**.

## Dodawanie nowego dźwięku

### Dwie zasady, których złamanie boli

**1. Nowe wiersze dopisuj na samym końcu arkusza. Nigdy w środku.**

Listy zapisane w bazie nie pamiętają nazw dźwięków, tylko ich identyfikatory. Gdy ta sama nazwa powtarza się w różnych folderach, identyfikator jest rozróżniany numerem wiersza w arkuszu — w obecnej bibliotece dotyczy to **133 pozycji**. Wstawienie wiersza w środku przesuwa numery wierszy poniżej, a razem z nimi te identyfikatory. Sprawdzone na Twoim arkuszu: dopisanie wiersza na końcu zmienia **0** identyfikatorów, a wstawienie tego samego wiersza w środku zmienia **123**. Każdy z nich wypadłby z list i pokazał się jako „(brak w manifeście)”.

**2. Nie zmieniaj `NazwaSampla` istniejącego dźwięku.**

Identyfikator powstaje z tej nazwy. Jeżeli chcesz, żeby dźwięk wyświetlał się pod inną nazwą, nadaj mu **alias na liście** w panelu admina — alias zmienia to, co widać, i nie rusza identyfikatora.

Zmiana `NazwaPliku` albo `LinkDoFolderu` istniejącego wiersza jest bezpieczna dla identyfikatora.

### Krok 1 — wgraj plik audio

Format: **`.ogg` albo `.mp3`**.

- **Wariant A — dźwięk chroniony:** wgraj plik do **prywatnego repozytorium `AudioRPG`**, do folderu tematycznego, na przykład `PrivateFolder/PrivateSubFolder/`.
- **Wariant B — dźwięk publiczny:** wgraj plik do **publicznego repozytorium `AudioExample`**, na przykład do `WH40k_Boltgun/Boltgun/`.

> **Dźwięki publiczne muszą leżeć właśnie w `AudioExample`.** Generator rozpoznaje warstwę publiczną po fragmencie `/AudioExample/` w adresie, a plik audio z obcej domeny odtwarzałby się bezgłośnie. Hostowanie dźwięków publicznych gdzie indziej wymaga zmiany w kodzie.

### Krok 2 — dopisz wiersz do `AudioManifest.xlsx`

Dopisz **na samym końcu** jeden wiersz na każdy plik audio.

| Kolumna | Wariant A (chroniony) | Wariant B (publiczny) |
| --- | --- | --- |
| `NazwaSampla` | `Przykładowy dźwięk` | `Bolter Reload Fast` |
| `NazwaPliku` | `PrivateSound.ogg` | `BolterReloadFast.ogg` |
| `LinkDoFolderu` | `https://cutelittlegoat.github.io/AudioRPG/PrivateFolder/PrivateSubFolder` | `https://cutelittlegoat.github.io/AudioExample/WH40k_Boltgun/Boltgun` |

- `NazwaSampla` może zawierać spacje i polskie znaki.
- `NazwaPliku` musi się zgadzać z nazwą pliku **co do znaku**, razem z rozszerzeniem i wielkością liter.
- `LinkDoFolderu` to adres **folderu**, bez nazwy pliku na końcu.

> Przy wariancie A adres z kolumny `LinkDoFolderu` nigdzie nie prowadzi — repozytorium `AudioRPG` jest prywatne. Generator wycina z niego ścieżkę do pliku i buduje tagi.

### Krok 3 — zbuduj manifesty

`Narzędzia` → `Zbuduj manifesty z XLSX` i wskaż zapisany arkusz. Liczby w podsumowaniu powinny wzrosnąć dokładnie o tyle pozycji, ile dodałeś.

### Krok 4 — skopiuj wygenerowane pliki

| Plik | Dokąd |
| --- | --- |
| `AudioManifest.json` | do folderu `Audio` w repozytorium `WrathAndGlory` |
| `audio-manifest.json` | do katalogu głównego prywatnego repozytorium `AudioRPG` |

**Kopiuj zawsze oba pliki** — generator buduje obie listy od zera z całego arkusza.

### Skąd się biorą tagi i foldery

Tagów nie wpisujesz — powstają ze ścieżki folderu w `LinkDoFolderu`. Każdy fragment ścieżki to jeden poziom drzewa folderów w panelu admina.

Przykład wariantu B: `.../AudioExample/WH40k_Boltgun/Boltgun` daje foldery `AudioExample` → `WH40k Boltgun` → `Boltgun`.

Reguły:

- fragment `AudioRPG` jest pomijany — dźwięki chronione zaczynają drzewo od pierwszego folderu wewnątrz repozytorium (w przykładzie `PrivateFolder`),
- z nazw folderów wycinane są niektóre dopiski techniczne (lista w stałej `TAG_IGNORE_FRAGMENTS` w kodzie); jeżeli tag jest krótszy niż nazwa folderu, działa właśnie ta reguła,
- podkreślniki i myślniki zamieniają się w spacje (`WH40k_Boltgun` → `WH40k Boltgun`).

Tag pokazywany na kafelku w widoku użytkownika to **drugi poziom** ścieżki — nazwa kolekcji (w przykładzie `WH40k Boltgun`).

### Kilka plików jako jedna pozycja

Jeżeli kilka plików ma być jednym dźwiękiem losowanym przy każdym odtworzeniu, nadaj im **tę samą nazwę zakończoną numerem** i umieść w **tym samym folderze**:

```text
Bolter Projectile Impact Rock 01
Bolter Projectile Impact Rock 02
Bolter Projectile Impact Rock 03
```

Generator złoży je w jedną pozycję `Bolter Projectile Impact Rock` z licznikiem `(3)`. Warunek: co najmniej dwa takie wiersze w tym samym folderze.

### Sprawdzenie po dodaniu

1. Odśwież moduł albo wybierz `Narzędzia` → `Wczytaj manifest ponownie` — status powinien pokazać większą liczbę pozycji.
2. Znajdź nowy dźwięk wyszukiwarką katalogu i odsłuchaj go przyciskiem `▶`.
3. Jeżeli dźwięk chroniony nie gra, sprawdź, czy plik leży w `AudioRPG` pod ścieżką wynikającą z `LinkDoFolderu` i `NazwaPliku`.
4. Jeżeli na listach pojawiło się dużo wpisów „(brak w manifeście)”, wiersz trafił w środek arkusza — cofnij zmianę, przenieś wiersz na koniec i zbuduj manifesty ponownie.

---

## Zapis ustawień

Ustawienia to listy (z listą główną), kolejność dźwięków i aliasy.

- Jeżeli Firebase jest skonfigurowany i działa, ustawienia są wspólne dla wszystkich urządzeń.
- Jeżeli nie — zapisują się w tej przeglądarce i działają tylko na tym urządzeniu.
- Każda zmiana zapisuje się od razu — nie ma przycisku „Zapisz”.
- Moduł czyta wyłącznie ustawienia w aktualnym formacie. Listy zapisane przez wcześniejszą wersję modułu są pomijane (panel admina pokaże wtedy komunikat) — przygotowuje się je od nowa.

### Po aktualizacji modułu

Zanim zaczniesz przygotowywać listy po aktualizacji modułu, na każdym urządzeniu, które używa Audio, zamknij stare karty modułu i otwórz go ponownie z pominięciem pamięci podręcznej (`Ctrl+F5`; na telefonie — zamknij kartę i otwórz ponownie). Stara wersja strony zostawiona w otwartej karcie mogłaby nadpisać nowe listy.

## Skąd wiesz, gdzie trafiają Twoje ustawienia

U góry strony, po prawej, stoi plakietka z kropką. Jest widoczna zawsze — w widoku użytkownika i w panelu admina.

| Plakietka | Kolor | Co oznacza |
| --- | --- | --- |
| `Dane wspólne` | zielona | Listy i aliasy trafiają do wspólnej bazy. Zobaczysz je na innych urządzeniach. |
| `Tylko to urządzenie` | żółta | Ustawienia zostają w tej przeglądarce. |
| `Sprawdzanie połączenia` | szara | Moduł sprawdza łączność z bazą — stan przejściowy po otwarciu modułu. |

## Pasek u góry ekranu

Gdy zapis do bazy się nie uda, u góry ekranu pojawia się szeroki pasek. Zamykasz go krzyżykiem albo znika, gdy zapis się powiedzie.

- **żółty** — pracujesz dalej, ale zmiany zostają na tym urządzeniu;
- **czerwony** — coś nie zostało zapisane albo nie udało się wczytać ustawień.

Pasek mówi, co się stało z danymi, dlaczego i co zrobić. Na dole jest kod błędu — przyda się przy zgłaszaniu problemu.

## Język interfejsu

Moduł jest po polsku. Wersja angielska istnieje i działa, ale przełącznik języka jest ukryty. Żeby go pokazać, usuń klasę `language-switcher--hidden` z jedynego kontenera `<div class="language-switcher language-switcher--hidden">` w pliku `Audio/index.html` (nad nim stoi komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`). Przełącznik pojawi się wtedy w obu widokach.

## Potwierdzanie, że dane otwiera Twoja aplikacja

Moduł przy uruchomieniu potwierdza w tle, że jest tą aplikacją, którą znasz, a nie obcym programem. Korzysta z mechanizmu Google reCAPTCHA. Nic nie musisz robić — nie ma obrazków ani pytań. Jeżeli potwierdzenie się nie uda (np. przez dodatek blokujący reklamy), moduł działa dalej normalnie.

## Typowe komunikaty i co zrobić

| Komunikat lub sytuacja | Co oznacza | Co zrobić |
| --- | --- | --- |
| Manifest: brak danych | Lista dźwięków jeszcze się nie wczytała. | Poczekaj chwilę albo wybierz `Narzędzia` → `Wczytaj manifest ponownie`. |
| Manifest: błąd wczytywania | Nie udało się pobrać listy dźwięków. | Odśwież stronę. Jeżeli błąd wraca, zgłoś adminowi technicznemu. |
| Firebase: lokalne ustawienia | Moduł działa bez wspólnej bazy. | Ustawienia zostaną w tej przeglądarce. |
| Firebase: brak konfiguracji | Ta kopia modułu nie ma bazy. | Zgłoś adminowi technicznemu, jeżeli ustawienia mają być wspólne. |
| Żółty pasek „Zapisano tylko na tym urządzeniu” | Baza odrzuciła zapis. | Najczęściej blokuje go dodatek blokujący reklamy (adres `google.com/recaptcha`). Wyłącz blokowanie dla tej strony i odśwież moduł. |
| Czerwony pasek „Zmiana nie została zapisana” | Nie zapisano nic — ani w bazie, ani w przeglądarce. | Odśwież stronę i powtórz zmianę; jeżeli nie pomoże, zgłoś kod błędu. |
| Czerwony pasek „Nie udało się wczytać danych z bazy” | Moduł pokazuje to, co ma zapisane w tej przeglądarce. | Sprawdź dodatek blokujący, odśwież stronę. |
| Żółty pasek „Zmiany (...) zostały właśnie zastąpione danymi z bazy” | Pracowałeś bez połączenia, a baza wróciła i nadpisała ustawienia. | Sprawdź listy i aliasy, brakujące dodaj ponownie. |
| Puste listy po aktualizacji modułu | Listy z wcześniejszej wersji modułu są pomijane. | Przygotuj listy od nowa (komunikat w panelu admina to potwierdza). |
| Kafelek z kłódką i „(brak w manifeście)” | Dźwięk z zablokowanego archiwum albo usunięty z biblioteki. | Dotknij kafelka i odblokuj archiwum; jeżeli archiwum jest odblokowane, usuń wpis z listy w panelu admina. |
| Brak wyników w katalogu | Filtry ukryły wszystkie dźwięki. | Sprawdź niebieskie etykiety — skasuj frazę albo kliknij `Zaznacz wszystko` w folderach. |
| „Brak linku do pliku audio w manifeście.” | Pozycja listy dźwięków nie ma poprawnego linku. | Sprawdź ten wiersz w arkuszu i zbuduj manifesty ponownie. |
| Nie da się przeciągać list ani dźwięków | Nie wczytała się biblioteka przeciągania (np. brak internetu). | Użyj strzałek `▲` `▼` `⤒` `⤓` — działają zawsze. |

## Krótki workflow — przygotowanie sesji

1. Otwórz `Audio/index.html?admin=1` i odblokuj archiwum.
2. Wybierz listę główną i dodaj do niej najczęściej używane dźwięki: wyszukiwarka katalogu → `+`.
3. Utwórz listy tematyczne (`+ Nowa lista`) i ułóż ich kolejność.
4. Dodaj dźwięki do list — pojedynczo `+` albo kilka naraz przez pola wyboru.
5. Ułóż kolejność dźwięków na listach i nadaj aliasy trudnym nazwom.
6. Sprawdź wszystko w podglądzie na dole strony, także w trybie `Telefon`.
7. Wyeksportuj ustawienia (`Narzędzia` → `Eksportuj ustawienia (JSON)`) jako kopię zapasową.
8. Do prowadzenia sesji otwórz `Audio/index.html`; tło uruchamiaj przez `Loop`, efekty — dotknięciem kafelka.

---

# 🇬🇧 User guide — Audio (EN)

## What Audio is for

`Audio` is a panel for quickly playing sound effects during a session.

The module has two views:

- **user view** — for playing sounds during a session: list tabs, sound tiles, loop, volume;
- **admin panel** — for preparing lists: picking sounds from the catalogue, giving aliases, setting the order, previewing the user view.

Both views work fully on a computer, a tablet and a phone. Lists are most comfortable to prepare on a computer, but every action can also be done on a phone.

## How to open the module

User view:

```text
Audio/index.html
```

Admin panel:

```text
Audio/index.html?admin=1
```

## Two library tiers

The sound library has two parts:

| Tier | Contents | Password required |
| --- | --- | --- |
| Demo | Free sounds available publicly. | No. Works as soon as the module opens. |
| Archive | Copyright-protected sounds. | Yes. One Litany of Access. |

Once the archive is unlocked, both tiers merge into one library. While the archive stays locked, archive sounds saved on lists appear as dimmed tiles with a padlock and "(missing in manifest)". Nothing disappears — once the archive is unlocked those tiles start playing.

## Unlocking the archive

The window titled "Access to data classified under the K.O.Z.A. seal" **appears on its own when the module opens**, provided the archive has not been unlocked on this device yet. It is the same gate you know from the `DataVault` module.

You have two options:

1. **Enter the Litany of Access** (the group password) and click `Begin the Rite`. The window closes and the library fills up with the archive.
2. **Click `Skip`** (or press `Esc`). The window closes and the module runs on the demo tier alone.

**You enter the password only once per device and the session never expires.** Access disappears only when you clear your browser data or when the technical admin rotates the gateway signing key.

If you click `Skip`, the window will not come back until you close the tab. Should you change your mind, click the unlock button:

- in the user view — the padlock 🔒 button in the top bar (on a phone it is the padlock alone),
- in the admin panel — `Unlock archive` in the header.

The unlock button disappears once the archive is unlocked. The window also opens on its own when you touch a padlock tile — such a tile is almost always an archive sound.

### Messages in the gate window

| Message | Meaning | What to do |
| --- | --- | --- |
| The angered Machine Spirit replies: the Litany of Access has not been recited. | The password field was empty. | Type the password. |
| The angered Machine Spirit replies: the Litany of Access was rejected. | The password is wrong. | Check the spelling and try again. |
| Cannot reach the access gateway. Check your connection and the gateway address in the AUDIO\_GATE\_BASE constant. | The browser did not reach the gateway at all. | Check your connection. If it keeps happening, contact the technical admin. |
| Session expired. Enter the password again. | The gateway rejected the stored access — usually because the technical admin rotated the signing key. | Enter the password again. |
| This sound is not part of the public tier. Unlock the archive to load it. | A padlock tile was touched while the archive was locked. | Enter the password, or click `Skip`. |
| The gateway could not find the archive manifest (HTTP 404)… | The password was correct but the gateway cannot see the archive list file. | Check that `audio-manifest.json` sits in the root of the private `AudioRPG` repository. |
| Could not load the public list (HTTP 404)… | `AudioManifest.json` could not be fetched. The most common cause: the browser holds an old version of the page. | Reload bypassing the cache: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac). |
| The access gateway answered with an unexpected HTTP … | The gateway is running but rejected the login itself. | Report it to the technical admin with the HTTP code. |
| The access gateway answered with HTTP … while fetching the archive manifest | The login succeeded but fetching the archive list returned an error. | Report it to the technical admin with the HTTP code. |

The first two messages concern the password itself and keep the lore wording, exactly as in `DataVault`. The rest are technical diagnostics.

---

## User view

### The top bar

The bar stays at the top of the screen while you scroll. It holds:

- **list tabs** — the main list always comes first (by default "Main view"), then the favourite lists in the order set in the admin panel. The active tab is highlighted. On a phone and a tablet the tabs sit in their own row that you swipe sideways;
- **a red dot on a tab** — a sound is playing on that list. Sounds do not stop when you switch to another list, and the dot shows where to go back;
- **`■ Stop all (N)`** — stops every playing sound on every list at once, loops included. The number says how many sounds are playing. When nothing plays, the button is inactive. On a phone only the `■` symbol and the number are shown;
- **the padlock button** — unlocks the archive (only while the archive is locked).

### Sound tile

Each tile shows:

- **the sound name**,
- **the alias in parentheses**, if an alias was given on this list — for example `Meltagun Reload (reload)`,
- **a red counter in parentheses** `(5)`, if several files share one name (one of them is picked at random on every play),
- **one tag** — the name of the collection the sound comes from,
- **a volume slider** with a percentage value,
- **the `⟳ Loop` button**.

Very long names are cut after three lines — hover the tile to see the full name.

### Playback

Touch or click **the upper part of the tile** (icon, name, alias or tag) to play a sound. Touching a playing tile again stops it. Several sounds can play at the same time.

How to tell that a sound is playing:

| Signal | Meaning |
| --- | --- |
| `▶` icon | The sound is ready to play. |
| `…` icon, dashed frame, "loading…" | The sound is loading (archive sounds need a moment for authorisation). Touching again cancels the start. |
| `■` icon, red glowing frame, red name | The sound is playing. |
| Red bar below the name | Playback progress of the file. |
| Padlock, dimmed tile, "(missing in manifest)" | A sound from the locked archive, or a sound no longer in the library. |

### Loop

`⟳ Loop` plays a sound in a loop:

- clicking `Loop` starts the loop; the button turns red,
- if the sound is already playing, clicking `Loop` turns it into a loop without interrupting it,
- clicking the active `Loop` again, or touching the tile, stops the loop,
- for a sound with several files each lap picks a file at random and avoids playing the same file twice in a row.

### Volume

Every tile has its own slider. The value next to it is a percentage: the middle is `100%`, the left end `0%` (silence), the right end `200%` (louder than the original).

- A change takes effect at once, also on a playing sound and on later loop laps.
- **Clicking (tapping) the percentage value twice** restores `100%`.
- The level you set stays while you switch tabs, but **after reloading the page every tile is back at 100%**.

### The screen stays on while playing

While at least one sound plays, the module asks the browser not to turn the screen off (useful with a tablet lying on the table). When nothing plays, the screen turns off as usual. If the browser does not know this feature, nothing happens — sounds play the same.

### On a phone and a tablet

- Tiles arrange themselves in as many columns as the screen fits: one on a phone held upright, several on a tablet, more on a computer.
- Moving a slider never starts a sound — you can adjust the volume with a finger safely.
- The first touch of a sound after opening the page "unlocks" audio in the browser — every mobile browser works this way.

---

## Admin panel

### How it is laid out

The panel works from left to right:

1. **Folders** — the tree of folders the sounds come from (these are the tags). It narrows the catalogue.
2. **Sound catalogue** — every sound in the library, with a search box. This is where you add sounds to lists.
3. **Lists** — the main list and the favourite lists, with the **editor** of the selected list below them: sound order and aliases.

At the very bottom of the page there is the **user view preview**.

On a computer all three parts sit side by side, each scrolling on its own. On a narrower screen the folders hide in a slide-out drawer (the `Folders` button in the catalogue header). On a tablet and a phone the **`Catalogue` / `Lists` / `Preview`** tabs appear at the top — each shows one part of the panel. Every function works on every device.

### Target list and edited list

One list is always **selected for editing** — it is highlighted in the lists panel and the editor shows its entries. The same list is the **target list**: sounds added in the catalogue with the `+` button go there. The target list is also shown and can be changed in the catalogue header (the "Target list" field) — on a phone you do not have to switch to the `Lists` tab.

### Header and the "Tools" menu

The header holds the status pills, the `Unlock archive` button (while the archive is locked) and the `Tools ▾` menu:

| Menu item | What it does |
| --- | --- |
| `Reload manifest` | Fetches the sound list again (the demo tier always, the archive if unlocked). |
| `Build manifests from XLSX` | Turns the `AudioManifest.xlsx` workbook into two sound list files (described below). |
| `Export settings (JSON)` | Saves an `audio-settings-YYYY-MM-DD.json` file with every list, the order and the aliases into your downloads folder. The file is a backup — it holds no password or login data. |
| `Reload from this device's storage` | Visible only when the module runs without the database. Loads the settings saved in this browser. |
| `Clear aliases on all lists` | After confirmation removes the aliases from every list. The lists and sounds stay. |

### Statuses

| Status | Meaning |
| --- | --- |
| Manifest | How many sounds are loaded. `public list error` — `AudioManifest.json` could not be fetched (hover for the detail). |
| Firebase | `waiting` — start-up; `connected` — settings are shared; `local settings` — settings stay in this browser; `missing configuration` — this module copy has no database. |
| Lists | How many lists there are, the main list included. |
| Archive | `locked` — only the demo tier is visible (a healthy state); `unlocked` — the whole library is visible; `load error` — something failed (detail in the tooltip). |
| Builder | `ready`, `processing file`, `N public / M protected` or `error` (detail in the tooltip). |

The pills are green when everything is fine. A red pill means an error and nothing else.

### Notices below the header

| Notice | Meaning |
| --- | --- |
| The archive is locked — archive sounds appear on lists as "(missing in manifest)". They will not be removed. | You can edit lists safely — archive entries and their aliases are kept. To see them in the catalogue, unlock the archive. |
| The saved lists use the old format and were skipped. The first change will save the settings in the new format. | The database holds lists from an earlier module version. The module does not load them — lists are prepared from scratch. The first change (e.g. a new list) replaces the old data. |

Close any notice with the cross.

### Folders

The tree shows the library folders. Each folder has a checkbox, a name, a sound count and an `only` button.

- **Checked box** — sounds from this folder and all its subfolders are visible in the catalogue.
- **Empty box** — sounds from this folder and its subfolders are hidden.
- **Box with a dash (mixed state)** — some subfolders are visible and some hidden.
- Clicking a box sets the same state for the folder and **all** its subfolders. Clicking a dashed box checks the whole folder.
- You can clear a whole folder, then expand it and check one subfolder — the catalogue then shows that subfolder only.
- The `▸` / `▾` arrow expands and collapses a folder, independently of the checkbox.
- `only` — shows only this folder in the catalogue (on a computer the button appears when you hover the row).
- `(12)` is the number of sounds in the folder; `(3/12)` means 3 of 12 are visible.
- `Select all`, `Clear all`, `Expand all`, `Collapse all` act on the whole tree.

**Search folders.** Type part of a folder name — letter case and Polish diacritics do not matter (`melta` finds `Meltagun`). The tree shows the matching folders together with their parent folders, and the matching fragment is highlighted. The search narrows only the tree, not the catalogue. While searching, the `Select matches`, `Clear matches` and `Matches only` buttons appear. The field has no clear button — delete the typed text to switch the search off.

**Hiding the panel.** On a computer the `«` button collapses the panel into a narrow strip labelled `FOLDERS`; clicking the strip expands it again. The module remembers this on the device. On a narrower screen the panel opens with the `Folders` button and closes with the cross, `Esc`, or a touch outside it.

### Blue highlight — a filter is on

Just like in `DataVault` and `GeneratorNPC`, **blue means the view is narrowed**:

| What glows blue | When |
| --- | --- |
| the `Search folders` label | the typed phrase narrows the tree |
| the `Folders` title, the dot on the collapsed panel and on the `Folders` button | at least one folder is cleared |
| the `Search sounds` label | the typed phrase narrows the catalogue |
| the `Search this list` label | the typed phrase narrows the list entries |
| the `Folders: N of M` text above the catalogue | at least one folder is cleared |

Hover a blue label to see the typed phrase. A lone space lights nothing up.

### Sound catalogue

Each catalogue row is one sound:

| Element | Meaning |
| --- | --- |
| checkbox | selection for adding several sounds at once |
| `▶` / `■` | preview; a second click stops it |
| name and red `(N)` | the library name and the number of files under that name |
| path and file name | where the sound comes from (the same name can exist in two folders) |
| `DEMO` / `ARCHIVE` | the library tier |
| number in a circle | on how many lists the sound is; clicking it shows the list names and aliases below the row |
| `+` / `✓` | `+` adds the sound to the end of the target list; `✓` means it is already there — clicking removes it (if it has an alias, the module asks first) |

The catalogue does not show aliases next to names, because an alias belongs to a list. Aliases are shown in the list-count tooltip.

**Search sounds** — searches the name, file name, folder path and aliases given on lists; letter case and Polish diacritics do not matter.

**Show** — `all`, `not on the target list` (handy when adding), `on the target list`.

**Tier** — `all`, `demo`, `archive`.

**Adding several sounds at once:** tick the checkboxes. On a computer, clicking a checkbox with `Shift` held selects every row in between, and `Ctrl` + click on a name toggles a single row. `Select all results` selects everything the catalogue shows (above 50 sounds the module asks first). A `Selected: N` bar appears at the bottom of the catalogue with the `Add to "list name"` and `Clear selection` buttons.

The catalogue shows 200 rows at a time; the `Show 200 more` button loads the rest.

### Lists

- **The main list** always comes first, has a pin 📌 and the "main list" label. It cannot be deleted or moved. It can be renamed; an empty name means "Main view" ("Widok główny" in Polish).
- **`+ New list`** — creates a list at the end and opens the name field right away. Type a name and press `Enter`.
- **Choosing a list** — click its name; it becomes the edited and target list.
- **List order** — drag a list by the `⠿` handle (mouse or finger) or use the `▲` `▼` arrows. Nothing can be placed before the main list.
- There may be no favourite lists at all — the main list always exists.

### List editor

Above the entries: the list name, the `✎` (rename), `⧉` (duplicate list) and `🗑` (delete list — not shown for the main list) buttons, the sound count and `Clear this list's aliases`.

- **Rename** — `✎`, or double-click the list name in the lists panel. `Enter` saves, `Esc` cancels. An empty name for a favourite list restores the previous one.
- **Duplicate list** — creates a copy with the same sounds and aliases, marked "(copy)", right after the original.
- **Delete list** — the module asks for confirmation and says how many sounds and aliases the list has.

Every list entry has:

- the `⠿` handle, the position number, the `▶` preview button, the library name and the folder path,
- **the alias field** — the alias on this list only,
- the `⤒` (to top), `▲` (up), `▼` (down), `⤓` (to bottom) and `✕` (remove from list) buttons,
- the **"On other lists: …"** line when the same sound is also on other lists — with their aliases.

**Sound order** is changed by dragging an entry by its `⠿` handle (mouse or finger) or with the arrows. Every change is saved at once.

**Search this list** — narrows the entries to matching names or aliases. While searching the order cannot be changed (the module shows a hint) — delete the text to move sounds.

**A "(missing in manifest)" entry** — a sound from the locked archive or one removed from the library. The entry and its alias are kept; you can move it, change the alias or remove it.

### Aliases

An alias is your own helper name for a sound, for example `temple alarm` or `distant explosion`. **An alias belongs to a list**: the same sound can have a different alias on every list, or none at all.

Example: sound `X` on the list `Playlista01` has no alias, on `Playlista02` it has the alias `X2`, and on `Playlista03` — `X3`. In the user view you will see `X`, `X (X2)` and `X (X3)` respectively.

How to give an alias:

1. Choose the list in the lists panel.
2. In the editor type the alias into the field next to the sound.
3. Press `Enter` or click outside the field — the alias is saved. `Esc` restores the previous value.

The field suggests the aliases this sound has on other lists. The quickest way to variants of the same list: prepare one list, duplicate it with `⧉` and change only the aliases.

Removing a sound from a list also removes its alias on that list. Moving an entry carries the alias along.

### User view preview

At the bottom of the panel (on a tablet and a phone — in the `Preview` tab) you see the user view exactly as players will: with tabs, tiles, sliders, `Loop` and `Stop all`. Sounds in the preview really play.

- **follows the edited list** — when ticked, the preview shows the list selected in the editor, and clicking a tab in the preview selects that list for editing. When cleared, the preview tabs switch only the preview.
- `Desktop` / `Tablet` / `Phone` — shows how the view lays out at that width. Narrower widths disappear when the window is too narrow to show them.
- `Open the real view ↗` — opens the user view in a new tab, on the saved data.
- `Collapse preview` / `Expand preview` — hides and shows the preview; the module remembers this on the device.

### Keyboard shortcuts on a computer

| Key | Action |
| --- | --- |
| `/` | Moves the cursor to the catalogue search (when the cursor is not in another field). |
| `Enter` | In the alias or list name field — save. |
| `Esc` | In the alias or name field — cancel; outside fields — close the `Tools` menu or the folder drawer; in the gate window — same as `Skip`. |

### What the module remembers on this device

The panel remembers in this browser: whether the folder panel is collapsed, the expanded folders, the last edited list, the preview settings and the selected tab. Filters (cleared folders, typed phrases, `Show`, `Tier`) stay until the tab is closed. This is a convenience only — it never reaches the database and does not affect anyone else.

---

## Building the manifests from an XLSX file

The sound list is produced from the `AudioManifest.xlsx` Excel workbook. `Tools` → `Build manifests from XLSX` turns that workbook into two ready JSON files.

### Step by step

1. Open the admin panel (`?admin=1`).
2. Close the password window with `Skip`, or enter the Litany of Access.
3. Open the `Tools` menu and choose `Build manifests from XLSX`.
4. Point it at your `AudioManifest.xlsx` file.
5. The browser saves **two files** into your downloads folder:
   - `AudioManifest.json` — the demo tier list,
   - `audio-manifest.json` — the archive list.
6. A summary box shows how many items went into each list.

Nothing is uploaded anywhere. The whole conversion happens in your browser.

### What to do with those files

| File | Where to copy it |
| --- | --- |
| `AudioManifest.json` | Into the `Audio` folder of the `WrathAndGlory` repository (next to `index.html`). |
| `audio-manifest.json` | Into the root of the private `AudioRPG` repository, under exactly that name. |

### What the sheet must look like

The first row must contain three column headers:

| Column | What it holds |
| --- | --- |
| `NazwaSampla` | The sound name shown in the module. |
| `NazwaPliku` | The audio file name, for example `MeltagunReload.ogg`. |
| `LinkDoFolderu` | The address of the folder holding the file. |

Rules:

- **Column order does not matter.**
- **Extra columns are ignored.**
- **Each of the three required columns may appear only once.**
- The tier is decided by the address in `LinkDoFolderu`: addresses containing `/AudioExample/` go to the demo tier, everything else to the archive.

### Builder messages

| Message | Meaning | What to do |
| --- | --- | --- |
| Missing required columns: … | One of the three columns is absent from the first row. | The headers must read exactly `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`. |
| Columns present more than once: … | A required column appears twice or more. | Remove or rename the duplicate column. |
| The sheet contains no data rows. | The sheet holds only a header. | Fill in the data. |
| Protected tier variants without a path in the AudioRPG repository: N | An address in `LinkDoFolderu` does not point at the `AudioRPG` repository. | Fix the addresses. No file was saved. |
| Could not read the XLSX file… | The file is not a valid workbook. | Open it in Excel and save it again as `.xlsx`. |
| Could not load the JSZip library from the CDN… | The builder needs to download the library that unpacks the workbook. | Check your connection and try again. |

With any of these errors **no file is saved**.

## Adding a new sound

### Two rules worth reading first

**1. Add new rows at the very end of the sheet. Never in the middle.**

Lists saved in the database do not remember sound names, only their identifiers. When the same name repeats across folders, the identifier is disambiguated by the row number — in the current library that affects **133 entries**. Inserting a row in the middle shifts the row numbers below it, and those identifiers along with them. Verified on your own spreadsheet: appending a row at the end changes **0** identifiers, inserting the same row in the middle changes **123**. Each of them would drop out of the lists and show up as "(missing in manifest)".

**2. Do not change the `NazwaSampla` of an existing sound.**

The identifier is derived from that name. If you want a sound shown under a different name, give it an **alias on a list** in the admin panel — an alias changes what you see and leaves the identifier alone.

Changing `NazwaPliku` or `LinkDoFolderu` on an existing row is safe for the identifier.

### Step 1 — upload the audio file

Format: **`.ogg` or `.mp3`**.

- **Option A — protected sound:** upload the file to the **private `AudioRPG` repository**, into a thematic folder, for example `PrivateFolder/PrivateSubFolder/`.
- **Option B — public sound:** upload the file to the **public `AudioExample` repository**, for example into `WH40k_Boltgun/Boltgun/`.

> **Public sounds must live in `AudioExample`.** The builder recognises the public tier by the `/AudioExample/` fragment in the address, and an audio file from a foreign domain would play silently. Hosting public sounds elsewhere needs a code change.

### Step 2 — add a row to `AudioManifest.xlsx`

Add **at the very end** one row per audio file.

| Column | Option A (protected) | Option B (public) |
| --- | --- | --- |
| `NazwaSampla` | `Example Sound` | `Bolter Reload Fast` |
| `NazwaPliku` | `PrivateSound.ogg` | `BolterReloadFast.ogg` |
| `LinkDoFolderu` | `https://cutelittlegoat.github.io/AudioRPG/PrivateFolder/PrivateSubFolder` | `https://cutelittlegoat.github.io/AudioExample/WH40k_Boltgun/Boltgun` |

- `NazwaSampla` may contain spaces and non-ASCII characters.
- `NazwaPliku` must match the file name **character for character**, including the extension and letter case.
- `LinkDoFolderu` is the address of the **folder**, without the file name at the end.

> With Option A the address in `LinkDoFolderu` leads nowhere — the `AudioRPG` repository is private. The builder cuts the file path out of it and builds the tags.

### Step 3 — build the manifests

`Tools` → `Build manifests from XLSX` and select the saved spreadsheet. The counts in the summary should grow by exactly the number of entries you added.

### Step 4 — copy the generated files

| File | Where |
| --- | --- |
| `AudioManifest.json` | into the `Audio` folder of the `WrathAndGlory` repository |
| `audio-manifest.json` | into the root of the private `AudioRPG` repository |

**Always copy both files** — the builder rebuilds both lists from scratch out of the whole spreadsheet.

### Where tags and folders come from

You never type tags — they come from the folder path in `LinkDoFolderu`. Each path segment is one level of the folder tree in the admin panel.

Option B example: `.../AudioExample/WH40k_Boltgun/Boltgun` yields the folders `AudioExample` → `WH40k Boltgun` → `Boltgun`.

Rules:

- the `AudioRPG` segment is dropped — protected sounds start their tree at the first folder inside the repository (`PrivateFolder` in the example),
- some technical suffixes are stripped from folder names (the list lives in the `TAG_IGNORE_FRAGMENTS` constant in the code); if a tag is shorter than its folder name, this is the rule at work,
- underscores and hyphens turn into spaces (`WH40k_Boltgun` → `WH40k Boltgun`).

The tag shown on a user view tile is the **second level** of the path — the collection name (`WH40k Boltgun` in the example).

### Several files as one entry

If several files should act as one sound picked at random on every play, give them **the same name ending in a number** and put them in **the same folder**:

```text
Bolter Projectile Impact Rock 01
Bolter Projectile Impact Rock 02
Bolter Projectile Impact Rock 03
```

The builder folds them into one entry, `Bolter Projectile Impact Rock`, with a `(3)` counter. The condition is at least two such rows in the same folder.

### Checking your work

1. Reload the module or choose `Tools` → `Reload manifest` — the status should show a higher item count.
2. Find the new sound with the catalogue search and preview it with `▶`.
3. If a protected sound does not play, check that the file sits in `AudioRPG` under the path implied by `LinkDoFolderu` and `NazwaPliku`.
4. If many "(missing in manifest)" entries appear on lists, the row landed in the middle of the spreadsheet — undo it, move the row to the end and build the manifests again.

---

## Saving settings

Settings are the lists (the main list included), the sound order and the aliases.

- If Firebase is configured and works, the settings are shared across all devices.
- If not, they are saved in this browser and work on this device only.
- Every change is saved at once — there is no "Save" button.
- The module reads settings in the current format only. Lists saved by an earlier module version are skipped (the admin panel then shows a notice) — they are prepared from scratch.

### After a module update

Before you start preparing lists after a module update, on every device that uses Audio close the old module tabs and open it again bypassing the cache (`Ctrl+F5`; on a phone — close the tab and open it again). An old page version left open in a tab could overwrite the new lists.

## How you know where your settings go

At the top of the page, on the right, there is a badge with a dot. It is always visible — in the user view and in the admin panel.

| Badge | Colour | Meaning |
| --- | --- | --- |
| `Shared data` | green | Lists and aliases go to the shared database. You will see them on other devices. |
| `This device only` | amber | Settings stay in this browser. |
| `Checking connection` | grey | The module is checking the database connection — a transient state after opening. |

## The bar at the top of the screen

When a write to the database fails, a wide bar appears at the top of the screen. Close it with the cross, or it disappears once a write succeeds.

- **amber** — you keep working, but changes stay on this device;
- **red** — something was not saved, or settings could not be loaded.

The bar says what happened to the data, why and what to do. At the bottom there is an error code — useful when reporting a problem.

## Interface language

The module runs in Polish. The English version exists and works, but the language switcher is hidden. To show it, remove the `language-switcher--hidden` class from the only `<div class="language-switcher language-switcher--hidden">` container in `Audio/index.html` (a `LANGUAGE SWITCHER VISIBILITY CHANGE POINT` comment sits above it). The switcher then appears in both views.

## Confirming that your application is the one opening the data

On start-up the module confirms in the background that it is the application you know and not a foreign program. It uses Google reCAPTCHA. You do not have to do anything — there are no images or questions. If the confirmation fails (for example because of an ad blocker), the module keeps working normally.

## Common messages and what to do

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| Manifest: no data | The sound list has not loaded yet. | Wait a moment, or choose `Tools` → `Reload manifest`. |
| Manifest: failed to load | The sound list could not be fetched. | Reload the page. If it persists, contact the technical admin. |
| Firebase: local settings | The module runs without the shared database. | Settings stay in this browser. |
| Firebase: missing configuration | This module copy has no database. | Contact the technical admin if settings should be shared. |
| Amber bar "Saved on this device only" | The database refused the write. | Usually an ad blocker blocking `google.com/recaptcha`. Disable blocking for this page and reload. |
| Red bar "The change was not saved" | Nothing was saved — neither in the database nor in the browser. | Reload and repeat the change; if that fails, report the error code. |
| Red bar "Data could not be loaded from the database" | The module shows what it has stored in this browser. | Check the ad blocker, reload the page. |
| Amber bar "Changes (...) have just been replaced by database data" | You worked offline, and the database came back and overwrote the settings. | Check lists and aliases, add back what is missing. |
| Empty lists after a module update | Lists from an earlier module version are skipped. | Prepare the lists from scratch (the notice in the admin panel confirms it). |
| Padlock tile with "(missing in manifest)" | A sound from the locked archive, or removed from the library. | Touch the tile and unlock the archive; if the archive is unlocked, remove the entry in the admin panel. |
| No results in the catalogue | Filters hide every sound. | Check the blue labels — delete the phrase or click `Select all` in the folders. |
| "Missing audio file link in the manifest." | A sound list entry has no valid link. | Check that row in the spreadsheet and rebuild the manifests. |
| Lists and sounds cannot be dragged | The drag library did not load (e.g. no internet). | Use the `▲` `▼` `⤒` `⤓` arrows — they always work. |

## Quick workflow — preparing a session

1. Open `Audio/index.html?admin=1` and unlock the archive.
2. Choose the main list and add the most used sounds to it: catalogue search → `+`.
3. Create thematic lists (`+ New list`) and set their order.
4. Add sounds to the lists — one by one with `+`, or several at once with the checkboxes.
5. Set the sound order on the lists and give aliases to unclear names.
6. Check everything in the preview at the bottom of the page, also in `Phone` mode.
7. Export the settings (`Tools` → `Export settings (JSON)`) as a backup.
8. To run the session, open `Audio/index.html`; start backgrounds with `Loop`, effects with a touch of the tile.

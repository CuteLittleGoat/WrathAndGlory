# Audio — aliasy przypisane do list, nowy panel admina i nowy widok użytkownika — analiza i plan wdrożenia

> **Data:** 29 września 2026
> **Moduł:** `Audio` (w rozdziale o hasłach także `DataVault` i `GeneratorNPC`)
> **Charakter dokumentu:** analiza przedwdrożeniowa i plan prac. Rozdział 3 opisuje stan kodu sprzed wdrożenia (commit `722b7e3`), pozostałe rozdziały — ustalony projekt docelowy.
> **Stan:** wszystkie decyzje są rozstrzygnięte (rozdz. 5). **Projekt został wdrożony 29 września 2026** (prompt 1.7): moduł ma nowe pliki `Audio/index.html`, `Audio/style.css` i `Audio/app.js`, a dokumentacja modułu (`Audio/docs/README.md`, `Audio/docs/Documentation.md`, `Audio/config/FirebaseREADME.md`) i `DetaleLayout.md` opisują stan po wdrożeniu. Aktualnym źródłem wiedzy o działaniu modułu jest `Audio/docs/Documentation.md`. Kroki do wykonania po wdrożeniu — rozdz. 17.

---

## Spis treści

1. [Prompty użytkownika (zachowane w całości)](#1-prompty-użytkownika-zachowane-w-całości)
2. [Zakres](#2-zakres)
3. [Stan obecny modułu](#3-stan-obecny-modułu)
4. [Wymagania i sposób realizacji](#4-wymagania-i-sposób-realizacji)
5. [Decyzje](#5-decyzje)
6. [Model danych](#6-model-danych)
7. [Panel admina](#7-panel-admina)
8. [Widok użytkownika](#8-widok-użytkownika)
9. [Wersje językowe](#9-wersje-językowe)
10. [Architektura kodu](#10-architektura-kodu)
11. [Gdzie zmienić hasła](#11-gdzie-zmienić-hasła)
12. [Instrukcja użytkownika bez nazw z repozytorium prywatnego](#12-instrukcja-użytkownika-bez-nazw-z-repozytorium-prywatnego)
13. [Plan prac](#13-plan-prac)
14. [Plan testów](#14-plan-testów)
15. [Ryzyka](#15-ryzyka)
16. [Znalezione przy okazji](#16-znalezione-przy-okazji)
17. [Kroki po wdrożeniu](#17-kroki-po-wdrożeniu)

---

## 1. Prompty użytkownika (zachowane w całości)

### 1.1 Prompt otwierający

> Przeprowadź analizę rozbudowy modułu "Audio".
> Nic nie zmieniaj w kodzie aplikacji.
> Utwórz tylko nowy plik MD w folderze Analizy/
>
> Chcę nieco zmienić zasadę działania aliasów dla poszczególnych dźwięków. Obecnie nadanie aliasu jest globalne.
> Chciałbym, żeby aliasy były powiązane z listami ulubionych.
>
> Przykładowo dźwięk X na Playliście01 ma domyślną nazwę "X" a na Playliście02 ten sam dźwięk ma już nadany alias "X2" a w Playliście03 ten sam dźwięk ma alias "X3".
>
> Możesz też od początku zaprojektować panel admina (https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html?admin=1), żeby lepiej zorganizować pracę nad przypisywaniem dźwięków do poszczególnych playlist.
> Obecny wygląd spełnia wszystkie obecne funkcje, ale nie jest zbyt wygodny - zwłaszcza przy dużej ilości dźwięków w manifeście. Obecny UI może też być problematyczny przy wdrożeniu zmiany dotyczącej nadawania różnych aliasów do tego samego pliku audio - dlatego przy okazji prac możesz przemodelować cały moduł.
>
> Funkcje jakie chcę mieć:
> - Możliwość zaznaczania/odznaczania tagów (zarówno w podgrupach jak i większych grupach - zachowujemy hierarchię katalogów)
> - Możliwość wyszukiwania tagów (trzeba tutaj dodać też opcję wyszukiwania po fragmencie nazwy i podświetlanie na niebiesko jak jest założony jakiś filtr. Taka funkcjonalność istnieje już w modułach DataVault i GeneratorNPC).
> - Możliwość ukrycia całego panelu z tagami (bo może ich być bardzo dużo - chyba, że przy okazji przebudowy zaproponujesz jakieś lepsze rozwiązanie)
> - na samym dole strony ma być podgląd jak by to wyglądało w zwykłym widoku (bez dopisku ?admin=1).
> - Musi być funkcjonalność nadawania nazw listom ulubionych.
> - Musi być funkcjonalność "głównej listy"
> - Musi być funkcjonalność przesuwania plików audio w obrębie każdej z list (czyli zmiana wyświetlanej pozycji)
> - Musi być funkcjonalność przesuwania list ulubionych (czyli zmiana kolejności list, przy czym lista główna zawsze jest pierwsza)
>
> Moduł ma być po polsku i angielsku, przy czym domyślnie po polsku a przełącznik zmiany wersji językowej ma być ukryty.
>
> DODATKOWO napisz mi gdzie mam zmienić hasło do aplikacji.
>
> I ostatnia uwaga - w pliku instrukcji jest odwołanie do przykładowego pliku "Age_of_Sail-beat_to_quarters.ogg" plik ten pochodzi z prywatnego repozytorium. Do instrukcji jako przykład wykorzystaj któryś z plików, które nie są chronione hasłem. Tak samo usuń nazwę "TabletopAudio/Alien Starship SoundPad/" i zastąp ją placeholderem, np. "PrivateFolder/PrivateSubFolder/"
> Podobna sytuacja jest w "Krok 2 — dopisz wiersz do AudioManifest.xlsx" - nigdzie w instrukcji nie podawaj prawdziwnych nazw folderów i plików chronionych hasłem.

### 1.2 Prośba o publikację

> analizę wrzuć na Main

### 1.3 Decyzje D1-D10 i dane testowe

> Zaktualizuj analizę o jedną dodatkową uwagę - wszystkie obecnie zapisane listy ulubionych i ewentualnie aliasy traktujemy jako dane testowe - nie trzeba ich migrować. Mam porobione notatki (zapisane poza repo) jaki dźwięk był w jakiej liście ulubionych - po poprawie kodu je odtworze - przy okazji będzie to test poprawności działania. Problem dotyczący aktualnej treści instrukcji i prywatnej nazwy w analizie zignoruj. Problem ten sam się rozwiąże po realizacji naprawy.
>
> Moje decyzje:
> D1 - zgodnie z rekomendacją.
> D2 - zgodnie z rekomendacją.
> D3 - zgodnie z rekomendacją.
> D4 - zgodnie z rekomendacją.
> D5 - nie robimy migracji, więc pytanie chyba nie jest zasadne?
> D6 - nie robimy migracji, więc pytanie chyba nie jest zasadne?
> D7 - zgodnie z rekomendacją.
> D8 - zgodnie z rekomendacją.
> D9 - zgodnie z rekomendacją.
> D10 - zgodnie z rekomendacją.
>
> Nie zmieniaj jeszcze kodu. Dopisz to do analizy.

### 1.4 Responsywność i widok użytkownika

> Jeżeli chodzi o responsywność to panel admina będzie używany głównie na PC. Na tym się skup. Możesz też zmodyfikować wygląd bez dopisku admin=1 (tam gdzie tylko odtwarza się dźwięki) jeżeli uznasz, że możesz zrobić lepszy i wygodniejszy układ. Ważne, żeby był przycisk do "loop", poziom głośności, feedback kiedy plik jest odtwarzany, numer w nawiasie (jeżeli jest kilka plików podpiętych pod jedną nazwę), nazwa, alias i jeden tag.
> Ten widok powinien być wygodny do używania na wielu rodzajach urządzeń.
>
> Dopisz to do analizy. Analizę wypchnij na main.

### 1.5 Doprecyzowanie wysłane w trakcie pracy

> "panel admina projektowany pod komputer" - ma się też responsywnie wyświetlać na innych urządzeniach, ale główny nacisk na komfort użytkowania stawiamy na PC.

### 1.6 Decyzje D11-D14 i ostateczne doprecyzowanie responsywności

> D11 - Zgodnie z rekomendacją
> D12 - Zgodnie z rekomendacją
> D13 - bez pamięci
> D14 - zgodnie z rekomendacją
>
> "Zgodnie z Twoim doprecyzowaniem panel wyświetla się poprawnie także na tablecie i telefonie. Ma tam zakładki Katalog / Listy / Podgląd, wszystkie funkcje i przyciski wygodne dla palca, ale bez osobnego dopracowania pod dotyk."
>
> Doprecyzuję, żeby nie było wątpliwości. Aplikacja ma działać w pełni na PC, tablecie i telefonie. Na każdym z urządzeń ma być dostęp do wszystkich funkcjonalności. Po prostu admin będzie szykować listy ulubionych i aliasy głównie na PC, ale musi mieć też dostęp z poziomu telefonu. "Główny nacisk" ma oznaczać to, że nie będziemy ustawiać co do pixela każdego kafelka w wersji mobilnej (jak to było robione np. w module DataVault). Ma działać, ma być wygodne do używania i tyle.
> Wierzę, że będziesz umiał to samodzielnie zrobić na zadowalającym poziomie.
>
> Zaktualizuj analizę. Usuń jakieś stare i nieaktualne zapiski (np. dotyczące migracji). Niech analiza zawiera teraz tylko najbardziej aktualne dane, ustalenia i plan prac.

### 1.7 Polecenie wdrożenia

> Wprowadź zmiany w kodzie. Zmiany wprowadź na Main.

---

## 2. Zakres

**W zakresie:**

- `Audio/index.html` — cały moduł: model ustawień, aliasy, listy, panel admina, widok użytkownika, odtwarzanie, tłumaczenia;
- `Audio/docs/README.md`, `Audio/docs/Documentation.md`, `DetaleLayout.md` (sekcja „Moduł — Audio”) — przepisanie pod nowy stan;
- `Audio/worker/audio-gate.js` — wyłącznie w zakresie hasła i sesji (bez zmian w kodzie);
- `shared/firestore-audiorpg.rules` — potwierdzenie, że reguły nie wymagają zmiany;
- `DataVault/app.js`, `DataVault/style.css`, `GeneratorNPC/index.html`, `GeneratorNPC/style.css` — wzorzec filtra po fragmencie nazwy i niebieskiego sygnału;
- `shared/firebase-data-loader.js`, `shared/rtdb-wh40k-data-slate.rules.json` — hasło modułów `DataVault` i `GeneratorNPC`.

**Poza zakresem (i celowo bez zmian):**

- generator manifestów z XLSX i cała logika identyfikatorów (`buildManifestItems`, `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment`, `normalizeUrl`, `toProtectedRepoPath`) — listy wskazują dźwięki po `id`; przebudowa **nie wymaga** ponownego generowania manifestów;
- pliki `Audio/AudioManifest.json` i `audio-manifest.json` — format bez zmian;
- kod bramki (Cloudflare Worker);
- zabezpieczenie trybu admina przed osobami postronnymi — opisane jako ryzyko (rozdz. 15), bez projektu rozwiązania.

---

## 3. Stan obecny modułu

Numery wierszy w tym rozdziale dotyczą `Audio/index.html`, o ile nie podano innego pliku.

### 3.1 Dane ustawień

Ustawienia leżą w jednym dokumencie Firestore `audio/favorites` (projekt `audiorpg-2eb6f`), a bez bazy — w `localStorage` pod kluczem `audio.settings`. Zapis zawsze nadpisuje cały dokument jednym `setDoc` (`:1976-2013`).

```text
{
  favorites: { lists: [ { id, name, itemIds: [] } ] },   // listy ulubionych
  mainView:  { itemIds: [] },                             // „Widok główny” — osobny byt, bez nazwy
  aliases:   { "<itemId>": "alias" },                     // JEDNA mapa aliasów dla całego modułu
  updatedAt: serverTimestamp()
}
```

### 3.2 Alias

| Element | Miejsce | Działanie |
| --- | --- | --- |
| Mapa aliasów | `state.aliases` (`:1134`) | Jeden alias na jeden `itemId`, wspólny dla wszystkich list. |
| Przypięcie do dźwięku | `applyAliasesToItems()` (`:2089-2096`) | Kopiuje alias do obiektu dźwięku jako `item.alias`. |
| Wyświetlenie | `formatSampleLabel(item)` (`:1277-1287`) | Zawsze `Nazwa (alias) (N)` — ten sam napis w katalogu, widoku głównym, każdej liście i widoku użytkownika. |
| Edycja | pole na karcie katalogu (`:2280`, `:3311-3321`) | Alias wpisuje się w katalogu, nie na liście. |
| Czyszczenie | `Wyczyść` (`:3294`), `Wyczyść wszystkie aliasy` (`:2619-2629`) | Usuwa alias globalnie. |

Model danych nie ma miejsca na różne aliasy tego samego dźwięku na różnych listach.

### 3.3 Układ dziś

**Panel admina:** nagłówek ze statusami → pasek przycisków → panel „Filtry tagów” na całą szerokość → pasek z wyszukiwarką SFX → siatka: katalog (karty w 4 kolumnach) | kolumna boczna z panelami „Ulubione” i „Główny widok” → na dole sekcja widoku użytkownika bez przycisków `Loop`.

**Widok użytkownika:** plakietka trybu pracy z danymi → siatka: kafelki (4 / 2 / 1 kolumna) | kolumna z nawigacją („Widok główny”, listy ulubionych, `Odblokuj archiwum`). Nie ma nagłówka.

### 3.4 Problemy panelu admina

| # | Problem | Gdzie | Skutek |
| --- | --- | --- | --- |
| P1 | Alias jest globalny. | `:1134`, `:2089`, `:2605` | Wymaganie z promptu niewykonalne bez zmiany modelu danych. |
| P2 | Alias edytuje się w katalogu, daleko od list. | `:2279-2282` | Przy aliasach per lista pole w katalogu traci sens. |
| P3 | „Widok główny” to osobna struktura i osobne funkcje (`moveMainViewItem`, `removeMainViewItem` obok `moveItem`, `removeItem`). | `:2596-2645` | Powielony kod, dwa różne panele, lista główna bez nazwy. |
| P4 | Katalog to karty `min-height: 150px`, każda z polem aliasu, trzema przyciskami i listą rozwijaną z **wszystkimi** listami. | `:397-412`, `:2248-2293` | Przy manifeście rzędu 1,8 tys. wierszy arkusza — kilkadziesiąt ekranów i tysiące elementów formularza. |
| P5 | Każda zmiana przerysowuje cały katalog **dwa razy** (`renderAllViews()` → `renderSamples()`, potem `renderFavorites()` → znów `renderSamples()`). | `:2343`, `:2469-2484` | Opóźnienie po każdym kliknięciu. |
| P6 | Dodanie do listy wymaga wyboru z menu na karcie i kliknięcia; nie widać, na których listach dźwięk już jest; brak dodawania wielu naraz. | `:2263-2287` | „Jeden dźwięk — trzy kliknięcia”, łatwo o pomyłkę listy. |
| P7 | Pola wyboru tagów są niezależne, a dźwięk jest widoczny tylko przy zaznaczonych **wszystkich** poziomach ścieżki; odznaczenie rodzica chowa dzieci. | `:1447`, `:2252-2256` | `Odznacz wszystko` → zaznaczenie jednego podfolderu → lista nadal pusta. Brak stanu pośredniego, liczników, zwijania niezależnego od zaznaczenia. |
| P8 | Wyszukiwanie tagów tylko w popupie, `toLowerCase().includes()` bez polskich znaków, dwa lustrzane pola; wyszukiwarka SFX szuka tylko w nazwie; brak sygnału „filtr jest założony”. | `:1467-1496`, `:3519-3530`, `:2252` | Wymaganie o wyszukiwaniu po fragmencie i niebieskim podświetleniu niespełnione. |
| P9 | `Ukryj panel` bez pamięci stanu; panel na pełnej szerokości nad katalogiem. | `:3532-3537` | Po odświeżeniu panel wraca i spycha katalog. |
| P10 | Nowa lista i zmiana nazwy przez `prompt()`; kolejność tylko strzałkami, krok po kroku, każdy krok to zapis. | `:2504-2556`, `:2311-2329` | Przesunięcie z pozycji 40 na 3 to 37 kliknięć i 37 zapisów. |
| P11 | Nazwy, aliasy i nazwy list trafiają do `innerHTML` bez zamiany znaków specjalnych, także do atrybutu `value="${item.alias}"`; dokument `audio/favorites` jest zapisywalny dla każdego (`allow read, write: if true`). | `:1282`, `:2264`, `:2280`, `:2309`, `:2455` | Znak `<` lub `"` psuje układ; złośliwy alias może wstrzyknąć skrypt na strony wszystkich użytkowników. |
| P12 | Odtwarzacze są przypisane do elementu DOM (`activePlayers: Map<element, player>`), a każde przerysowanie podmienia elementy. | `:1158`, `:1888-1910` | Po zmianie przychodzącej z bazy w trakcie odtwarzania dźwięk — zwłaszcza pętla — gra dalej, a **nie da się go zatrzymać** bez odświeżenia strony. |
| P13 | Dwa przełączniki języka. | `:646-652`, `:732-738` | Dwa miejsca do odkrycia przełącznika. |
| P14 | `Odśwież ulubione` nic nie robi przy aktywnym Firestore. | `:3475-3480` | Przycisk bez skutku w typowej konfiguracji. |

W manifeście publicznym (94 ścieżki folderów) jest folder, który jednocześnie zawiera dźwięki i ma podfolder z kolejnymi dźwiękami — nowe drzewo musi obsłużyć ten przypadek (rozdz. 7.3.1).

### 3.5 Problemy widoku użytkownika

| # | Problem | Gdzie | Skutek |
| --- | --- | --- | --- |
| U1 | Nawigacja w prawej kolumnie; poniżej 980 px spada **pod wszystkie kafelki**. | `:553-557`, `:599-606`, kolejność w DOM `:728-749` | Na telefonie zmiana listy wymaga przewinięcia całej bieżącej listy. |
| U2 | Dźwięk uruchamia tylko kliknięcie w tekst nazwy albo tagu (`.sample-trigger`). | `:3408-3426`, `:3443-3461` | Mały cel dotykowy. |
| U3 | Jedynym sygnałem odtwarzania jest czerwony kolor tekstu; brak postępu i stanu wczytywania. | `:430-433`, `:1781-1815` | Przy dźwięku z archiwum mija chwila na podpis bramki i nic się nie dzieje — łatwo kliknąć drugi raz. |
| U4 | Suwak bez widocznej wartości i etykiety dla czytników ekranu; głośność wraca do 100% przy każdym przerysowaniu. | `:2394`, `:2431` | Ustawiony poziom ginie w trakcie sesji. |
| U5 | Przełączenie listy ulubionych przerysowuje jej kafelki. | `:3494-3499` | Dźwięk grający na liście, z której się wyszło, po powrocie jest „osierocony” (P12). |
| U6 | Brak zatrzymania wszystkich dźwięków naraz. | — | Pętle gasi się po kolei, a „osieroconych” wcale. |
| U7 | Sztywne progi 4 / 2 / 1 kolumny. | `:397-401`, `:608-616` | Na dużym monitorze cztery bardzo szerokie kafelki, na telefonie w poziomie jedna lub dwie kolumny. |

---

## 4. Wymagania i sposób realizacji

| # | Wymaganie | Realizacja |
| --- | --- | --- |
| W1 | Aliasy powiązane z listami (X / X2 / X3) | rozdz. 6 |
| W2 | Zaznaczanie tagów w grupach i podgrupach, z hierarchią folderów | rozdz. 7.3.1 |
| W3 | Wyszukiwanie tagów po fragmencie nazwy, niebieskie podświetlenie aktywnego filtra | rozdz. 7.3.2, 7.3.3 |
| W4 | Ukrycie panelu tagów albo lepsze rozwiązanie | rozdz. 7.3.4 |
| W5 | Na dole strony podgląd widoku użytkownika | rozdz. 7.7 |
| W6 | Nazwy list ulubionych | rozdz. 7.5 |
| W7 | Lista główna | rozdz. 6.1, 7.5 |
| W8 | Przesuwanie dźwięków w obrębie każdej listy | rozdz. 7.6 |
| W9 | Przesuwanie list, lista główna zawsze pierwsza | rozdz. 7.5 |
| W10 | PL i EN, domyślnie PL, przełącznik ukryty | rozdz. 9 |
| W11 | Gdzie zmienić hasło | rozdz. 11 |
| W12 | Instrukcja bez nazw plików i folderów chronionych hasłem | rozdz. 12 |
| W13 | Widok użytkownika: `Loop`, głośność, sygnał odtwarzania, `(N)`, nazwa, alias, jeden tag; wygodny na wielu urządzeniach | rozdz. 8 |
| W14 | Pełna funkcjonalność i wygoda na PC, tablecie i telefonie — w panelu admina i w widoku użytkownika; bez dopracowywania każdego kafelka co do piksela | rozdz. 7.8, 8.2 |
| W15 | Obecne listy i aliasy to dane testowe — bez migracji; odtworzenie z notatek jako test | rozdz. 6.3, 14.1 |

---

## 5. Decyzje

| # | Pytanie | Rozstrzygnięcie |
| --- | --- | --- |
| D1 | Jak wyświetlać alias? | Jak dziś: `Nazwa (alias)`, alias jaśniejszy; alias z listy, na której stoi kafelek. |
| D2 | Czy nazwę listy głównej można zmieniać? | Tak; pusta nazwa = „Widok główny” / „Main view”. |
| D3 | Czy wolno usunąć wszystkie listy ulubionych? | Tak; lista główna istnieje zawsze; usunięcie ostatniej listy ulubionych nie tworzy nowej. |
| D4 | Czy ten sam dźwięk może być dwa razy na jednej liście? | Nie. |
| D5 | *(wycofana — dotyczyła migracji, której nie ma)* | — |
| D6 | *(wycofana — dotyczyła migracji, której nie ma)* | Ochronę nowych danych przed starszą wersją strony z pamięci podręcznej zapewnia kolejność kroków po wdrożeniu (rozdz. 17). |
| D7 | Przeciąganie | SortableJS 1.15 z `cdn.jsdelivr.net`, ładowany na żądanie tylko w panelu admina; strzałki jako zapas. |
| D8 | Wartości `TAG_IGNORE_FRAGMENTS` | Stała zostaje w kodzie; jej wartości znikają z `README.md` i `Documentation.md`. |
| D9 | Podział `index.html` | Tak: `index.html`, `app.js`, `style.css`. |
| D10 | Eksport ustawień | `Eksportuj ustawienia (JSON)` w menu `Narzędzia`; bez importu w tym wdrożeniu. |
| D11 | `Zatrzymaj wszystko` w widoku użytkownika i podglądzie | Tak. |
| D12 | Który tag na kafelku | Drugi poziom folderu (`tag2`, nazwa kolekcji) — jak dziś. |
| D13 | Pamięć głośności | **Bez pamięci** — po odświeżeniu strony każdy kafelek ma 100%. W trakcie sesji przerysowanie widoku nie zmienia ustawionego poziomu. |
| D14 | Blokada wygaszania ekranu | Tak, automatycznie tylko wtedy, gdy coś gra. |

---

## 6. Model danych

### 6.1 Dokument `audio/favorites`

Alias jest cechą **wpisu na liście**, a lista główna jest zwykłą listą z flagą.

```js
// Dokument ustawień modułu Audio (przykład z promptu)
{
  schemaVersion: 2,
  playlists: [
    { id: "main",  kind: "main", name: "",            entries: [] },
    { id: "3f0c…", kind: "list", name: "Playlista01", entries: [ { itemId: "x", alias: ""   } ] },
    { id: "9a41…", kind: "list", name: "Playlista02", entries: [ { itemId: "x", alias: "X2" } ] },
    { id: "c7d2…", kind: "list", name: "Playlista03", entries: [ { itemId: "x", alias: "X3" } ] }
  ],
  updatedAt: serverTimestamp()
}
```

Pole nazywa się `playlists`, a nie `lists`, bo obecny kod w `normalizeSettings()` (`:2102`) traktuje pole `lists` na najwyższym poziomie dokumentu jako swoje. Strona w starej wersji (z pamięci podręcznej albo na drugim urządzeniu) odczytałaby wtedy wszystkie listy jako puste.

### 6.2 Reguły modelu

Pilnuje ich jedna funkcja `normalizeSettingsV2()`, wywoływana przy każdym odczycie z bazy i z `localStorage`:

1. Istnieje **dokładnie jedna** lista główna: `id: "main"`, `kind: "main"`, zawsze na pozycji 0. Gdy jej brakuje — powstaje pusta; gdy stoi gdzie indziej — wraca na początek.
2. Listy głównej nie da się usunąć ani przesunąć. Listy ulubionych (0 lub więcej, D3) mają kolejność tablicy.
3. Dźwięk występuje na liście najwyżej raz (D4); duplikaty są usuwane z zachowaniem pierwszego wpisu.
4. `alias` — przycięty tekst, najwyżej 80 znaków, pusty = brak aliasu. `name` — najwyżej 60 znaków.
5. Pusta nazwa listy głównej = nazwa domyślna w bieżącym języku (D2). Nazwy list ulubionych są danymi i nie są tłumaczone.
6. **Wpisów z `itemId` nieobecnym w bieżącym manifeście nie wolno usuwać ani pomijać przy zapisie.** Przy zablokowanym archiwum wszystkie dźwięki chronione są „nieobecne”, a ich wpisy i aliasy muszą przetrwać.
7. Alias należy do wpisu: usunięcie dźwięku z listy usuwa jego alias na tej liście, przesunięcie wpisu przenosi alias.

### 6.3 Obecne dane — czysty start

Obecne listy ulubionych i aliasy są danymi testowymi. Nie są przenoszone; użytkownik odtworzy listy z własnych notatek, co jest jednocześnie testem akceptacyjnym (rozdz. 14.1).

| Źródło | Stan | Zachowanie nowej wersji |
| --- | --- | --- |
| Firestore `audio/favorites` | dokument bez `schemaVersion: 2` (obecne dane testowe) | Traktowany jak pusty: lista główna bez wpisów, zero list ulubionych. **Sam odczyt niczego nie zapisuje.** Pierwsza zmiana w panelu admina zapisuje dokument w nowym formacie; `setDoc` zastępuje cały dokument, więc stare pola znikają bez osobnego czyszczenia. |
| Firestore `audio/favorites` | brak dokumentu | Jak dziś (`:2192-2198`): powstaje dokument domyślny — w nowym formacie. |
| `localStorage` `audio.settings` | stary format | Pomijany; pierwszy zapis lokalny zapisuje nowy format. Klucz zostaje, bo korzysta z niego wspólny pasek komunikatów (`scopeKey`). |
| `localStorage` `audio.favorites` | najstarszy klucz | Nieczytany; nowa wersja usuwa go przy starcie. |

Panel admina, gdy odczyta dokument w starym formacie, pokazuje jednorazowo: „Zapisane listy są w starym formacie i zostały pominięte. Pierwsza zmiana zapisze ustawienia w nowym formacie.” — żeby puste listy nie wyglądały na awarię. Widok użytkownika tej informacji nie pokazuje i niczego nie zapisuje.

W konsoli Firebase nie trzeba niczego robić. Ręczne usunięcie dokumentu nie jest potrzebne, a przy otwartej jeszcze starej stronie byłoby niekorzystne — utworzyłaby ona w jego miejscu dokument w starym formacie.

### 6.4 Zapis i Firestore

- Model zostaje w tym samym dokumencie `audio/favorites`. Reguły projektu `audiorpg-2eb6f` (`shared/firestore-audiorpg.rules`) dopuszczają wyłącznie ten dokument — **zmiana reguł nie jest potrzebna**. GeneratorNPC używa innego dokumentu tego projektu i nie jest dotknięty.
- Rozmiar: wpis to ok. 70-100 bajtów; 20 list po 50 dźwięków to rząd 100 KB, daleko poniżej limitu 1 MiB.
- Zapis: każda operacja kończy się `persistAndRender()` — obecny mechanizm z zejściem na pamięć lokalną i paskiem komunikatów (`:1943-2045`) zostaje; zmienia się tylko ładunek.
- Zapis z dwóch urządzeń naraz działa jak dziś: nowszy zapis zastępuje cały dokument.

### 6.5 Wyświetlanie aliasu (D1)

- Widok użytkownika, podgląd i edytor listy: `Nazwa (alias z tej listy) (N)` — alias w kolorze `#d2fad2` (`.sample-alias`), licznik wariantów w kolorze `--danger` (`.group-count`), jak dziś.
- Katalog w panelu admina: sama nazwa z manifestu; aliasy z list w dymku („Playlista02: X2 · Playlista03: X3”).

---

## 7. Panel admina

### 7.1 Zasada układu

Panel jest „warsztatem” pracującym od lewej do prawej: **skąd biorę** (foldery) → **co wybieram** (katalog) → **dokąd wkładam** (listy i edytor listy). Pod spodem, na całą szerokość, podgląd widoku użytkownika.

Kluczowe pojęcie: **lista edytowana** — jedna lista wybrana w panelu list. Nagłówek katalogu pokazuje ją jako „Lista docelowa” z przełącznikiem `zmień ▾`, więc cel dodawania widać i da się go zmienić bez przechodzenia do panelu list (ważne na telefonie). Przycisk `[+]` w katalogu działa na tę listę, edytor pokazuje jej wpisy, a podgląd domyślnie ją wyświetla. Lista rozwijana na każdej karcie katalogu znika.

Układ na komputerze:

```text
┌─ AUDIO — PANEL ADMINA ────────────────── [Manifest: 1412] [Firebase: połączono] [Archiwum: odblokowane] [Narzędzia ▾] ─┐
├─ FOLDERY [«] ────────────────┬─ KATALOG DŹWIĘKÓW ─────────────────────────────────┬─ LISTY · [+ Nowa lista] ───────────┤
│ Szukaj folderu               │ Lista docelowa: Playlista02 [zmień ▾]              │ [P] Widok główny             (24)  │
│ [fragment nazwy...      ]    │ Szukaj dźwięku [reload...                  ]       │  ⠿  Walka                    (12)  │
│ [Zaznacz wsz.][Odznacz wsz.] │ Pokaż: (•) wszystkie ( ) spoza ( ) z listy         │  ⠿  Horror                    (8)  │
│ [Rozwiń wsz.][Zwiń wsz.]     │ Foldery: 3 z 94 · Wyniki: 137 z 1412               │  ⠿  Playlista02 < edytowana   (5)  │
│                              │                                                    │                                    │
│ [~] ▾ AudioExample    (112)  │ [ ] ▶ Boltgun Reload Full    Boltgun›…    [2] [+]  │ EDYCJA: Playlista02  [✎][⧉][x]     │
│   [~] ▾ WH40k Boltgun (112)  │ [ ] ▶ Meltagun Reload        Meltagun›…   [–] [+]  │ Szukaj na liście [          ]      │
│     [x] ▸ Boltgun      (40)  │ [x] ▶ Plasma Gun Reload      PlasmaGun›…  [1] [✓]  │ ⠿ 1 ▶ X (3) [alias: X2   ] ▲▼✕     │
│     [ ] ▸ Meltagun     (12)  │ ...                                                │ ⠿ 2 ▶ Y     [alias...    ] ▲▼✕     │
│ [x] ▸ PrivateFolder   (...)  │ [Zaznaczone: 1] [Dodaj do „Playlista02”]           │ ⠿ 3 ▶ Z     [alias...    ] ▲▼✕     │
│                              │ [Pokaż kolejne 200]                                │                                    │
├──────────────────────────────┴────────────────────────────────────────────────────┴────────────────────────────────────┤
│ PODGLĄD WIDOKU UŻYTKOWNIKA  [Komputer][Tablet][Telefon]  [x] podąża za edytowaną listą  [Otwórz ↗]                     │
│   (ten sam komponent co Audio/index.html bez ?admin=1: nawigacja, kafelki, suwaki, Loop)                               │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Legenda: `[P]` — lista główna przypięta na początku; `⠿` — uchwyt przeciągania; `[x]` / `[ ]` / `[~]` — zaznaczone / odznaczone / częściowo; `[+]` / `[✓]` — dodaj do listy docelowej / już na niej; `[2]` — na ilu listach jest dźwięk; `[✎][⧉][x]` — zmień nazwę, duplikuj, usuń listę.

### 7.2 Nagłówek i narzędzia

- Tytuł, pastylki statusów (`Manifest`, `Firebase`, `Archiwum`, `Generator`, `Listy: N`) i plakietka trybu pracy z danymi.
- `Odblokuj archiwum` — tylko przy zablokowanym archiwum.
- Menu `Narzędzia ▾`:
  - `Wczytaj manifest ponownie`,
  - `Zbuduj manifesty z XLSX` (działanie bez zmian),
  - `Eksportuj ustawienia (JSON)` (D10),
  - `Wyczyść aliasy we wszystkich listach` — z potwierdzeniem,
  - `Wczytaj ponownie z pamięci urządzenia` — tylko w trybie lokalnym (zastępuje bezużyteczne dziś `Odśwież ulubione`, P14).
- Przy zablokowanym archiwum pod nagłówkiem stoi informacja: „Archiwum zablokowane — dźwięki z archiwum są widoczne na listach jako „(brak w manifeście)”. Nie zostaną usunięte.”

### 7.3 Panel folderów (tagi)

#### 7.3.1 Drzewo z zaznaczaniem hierarchicznym

Węzeł = folder ze ścieżki `tagPaths`: `[▸/▾] [pole wyboru] nazwa (widoczne / wszystkie)`.

- Zaznaczenie jest pamiętane dla **dźwięków leżących bezpośrednio w folderze**. Dźwięk jest widoczny w katalogu, gdy zaznaczony jest jego **najgłębszy** folder. To usuwa pułapkę P7 i obsługuje folder z własnymi dźwiękami i podfolderami.
- Pole wyboru węzła jest trójstanowe i wyliczane: zaznaczone (folder i całe poddrzewo), odznaczone, częściowe (`indeterminate`, odczytywane przez czytniki ekranu jako „mieszany”).
- Kliknięcie ustawia ten sam stan dla folderu i **wszystkich** podfolderów; kliknięcie stanu częściowego zaznacza całość.
- Zwijanie jest niezależne od zaznaczenia.
- Akcje: `Zaznacz wszystko`, `Odznacz wszystko`, `Rozwiń wszystko`, `Zwiń wszystko`, przy węźle `Tylko ten folder`.
- Stan przechowywany jako zbiór **wykluczonych** ścieżek — nowe foldery po wczytaniu manifestu są domyślnie zaznaczone.

```js
// --- Stan węzła drzewa wyliczany z zaznaczeń / Tree node state derived from selections ---
// PL: "all" = folder i całe poddrzewo widoczne, "none" = nic, "some" = stan mieszany.
// EN: "all" = folder and its whole subtree visible, "none" = nothing, "some" = mixed state.
const getNodeState = (node) => {
  const own = node.hasOwnItems ? [!state.excludedPaths.has(node.path)] : [];
  const childStates = node.children.map(getNodeState);
  const all = own.every(Boolean) && childStates.every((s) => s === "all");
  const none = own.every((v) => !v) && childStates.every((s) => s === "none");
  return all ? "all" : none ? "none" : "some";
};
```

#### 7.3.2 Wyszukiwanie folderów po fragmencie nazwy

- Jedno pole `Szukaj folderu` (zamiast dwóch lustrzanych pól i popupu).
- Porównanie według reguły `foldPolish()` z `DataVault/app.js:549-555`: małe litery, bez znaków diakrytycznych, `ł` → `l`; fraza jako jeden ciąg w dowolnym miejscu nazwy. Moduł dostaje własną kopię funkcji z komentarzem odsyłającym do DataVault, jak GeneratorNPC (`GeneratorNPC/index.html:1540-1630`).
- Wynik: pasujące foldery i ich przodkowie, przodkowie rozwinięci, pasujący fragment wyróżniony.
- Wyszukiwanie **zawęża tylko drzewo**; katalog zawężają pola wyboru. Akcje: `Zaznacz pasujące`, `Odznacz pasujące`, `Tylko pasujące`.
- Bez przycisku czyszczenia, pole `type="text"` — jak Filtr Globalny w DataVault i filtry list w GeneratorNPC.

#### 7.3.3 Niebieski sygnał aktywnego filtra

Barwa i reguła 1:1 z DataVault (`DataVault/style.css:47-52`, `.fieldLabel--active`, `updateGlobalFilterIndicator()` w `DataVault/app.js:578-585`): etykieta świeci tylko wtedy, gdy fraza po złożeniu faktycznie zawęża widok, a dymek powtarza frazę.

| Element | Kiedy niebieski |
| --- | --- |
| etykieta `Szukaj folderu` | fraza zawęża drzewo |
| nagłówek `Foldery`, kropka na zwiniętym panelu, przycisk `Foldery` na węższych ekranach | co najmniej jeden folder jest wykluczony |
| etykieta `Szukaj dźwięku` | fraza zawęża katalog |
| etykieta `Szukaj na liście` w edytorze | fraza zawęża wpisy listy |
| linia „Foldery: 3 z 94” nad wynikami katalogu | co najmniej jeden folder jest wykluczony |

Zmienne w `:root`: `--filter-on: #3D8FC4`, `--filter-on-bright: #6FB3E0`, `--filter-on-border: rgba(61,143,196,.55)`, `--filter-on-glow: rgba(61,143,196,.40)`, `--filter-on-bg: rgba(61,143,196,.10)`, `--filter-on-bg-active: rgba(61,143,196,.20)`. Niebieski nie ma dziś w Audio żadnego znaczenia.

#### 7.3.4 Ukrywanie panelu

- Na szerokim ekranie panel folderów to **boczna kolumna zwijana do wąskiej szyny** (ok. 44 px) z napisem `FOLDERY` i niebieską kropką przy aktywnym filtrze; stan zwinięcia zapamiętany na urządzeniu.
- Na węższym ekranie panel jest **szufladą** wysuwaną przyciskiem `Foldery` i zamykaną `Esc`, przyciskiem `✕` albo dotknięciem obok.
- Linia „Foldery: 3 z 94” nad wynikami katalogu mówi o zawężeniu także przy schowanym panelu.

### 7.4 Katalog dźwięków

Wiersz zamiast karty:

```text
[ ] [▶] Nazwa dźwięku (N)   folder › podfolder   plik.ogg   [demo|archiwum]   [w 2 listach]   [+ / ✓]
```

- `▶` — odsłuch (ten sam silnik odtwarzania; drugie kliknięcie zatrzymuje).
- `(N)` — czerwony licznik wariantów.
- Ścieżka folderu — ta sama nazwa bywa w dwóch folderach (np. „Boltgun Reload Full” w manifeście publicznym).
- Znacznik warstwy `demo` / `archiwum`.
- `[w 2 listach]` — przynależność; dymek (na dotyku — po dotknięciu znacznika) wymienia listy i aliasy.
- `[+]` dodaje na koniec listy docelowej, `[✓]` = już na niej; ponowne dotknięcie usuwa (z potwierdzeniem tylko przy wpisie z aliasem).
- Pola wyboru wierszy i pasek „Zaznaczone: N · Dodaj do „Lista” · Odznacz”; `Zaznacz wszystkie wyniki` z potwierdzeniem powyżej 50 pozycji.
- Filtry: fraza (nazwa, plik, ścieżka folderu, aliasy z list; reguła `foldPolish`), `Pokaż: wszystkie | spoza listy docelowej | z listy docelowej`, `Warstwa: wszystkie | demo | archiwum`.
- Licznik „Wyniki: 137 z 1412”.
- Wydajność: pierwsze 200 wierszy + `Pokaż kolejne 200`; wyszukiwanie z opóźnieniem 150 ms; tekst do przeszukiwania liczony raz przy wczytaniu manifestu.
- Sortowanie alfabetyczne jak dziś.

### 7.5 Panel list

- `+ Nowa lista` — lista powstaje na końcu z nazwą „Nowa lista”, od razu jest wybrana, a pole nazwy dostaje fokus.
- Wiersz listy: `[P lub ⠿] nazwa (liczba) [▲][▼]`; wybór listy do edycji wyróżnia ją jak aktywny przycisk nawigacji użytkownika.
- **Lista główna**: zawsze pierwsza, z pinezką i dopiskiem „lista główna”, bez uchwytu, strzałek i usuwania; nazwę można zmienić (D2).
- **Kolejność list**: przeciąganie za uchwyt `⠿` (mysz i dotyk) oraz strzałki ▲▼; upuszczenie przed listą główną zablokowane. Jedno przeciągnięcie = jeden zapis.
- **Nazwa listy**: edycja w miejscu — `✎` (lub dwuklik na komputerze), `Enter` / opuszczenie pola zapisuje, `Esc` anuluje, pusta nazwa przywraca poprzednią.
- **Usunięcie**: potwierdzenie z nazwą i liczbą wpisów; potem wybrana zostaje lista główna.
- **Duplikuj listę** (`⧉`): kopia z wpisami i aliasami, nazwa „… (kopia)”, wstawiona po oryginale — wygodna droga do scenariusza X / X2 / X3.

### 7.6 Edytor listy

Nagłówek: nazwa listy (edycja w miejscu), liczba wpisów, `Szukaj na liście`, `Wyczyść aliasy tej listy`.

```text
⠿  3.  [▶]  Nazwa z manifestu (N)   folder › podfolder
            [ Alias na tej liście (opcjonalny)          ]   [▲][▼][⤒][⤓][✕]
            Na innych listach: X2 (Playlista02) · X3 (Playlista03)
```

- **Alias**: zapis przy zmianie (opuszczenie pola albo `Enter`), `Esc` przywraca poprzednią wartość; linia „Na innych listach” i podpowiedzi w polu (tworzone przy wejściu w pole) pokazują aliasy tego dźwięku z pozostałych list.
- **Kolejność**: przeciąganie za uchwyt, ▲▼ o jedną pozycję, ⤒⤓ na początek i koniec; jedno przeciągnięcie = jeden zapis.
- Przy aktywnym `Szukaj na liście` zmiana kolejności jest zablokowana z podpowiedzią dlaczego.
- `✕` usuwa wpis razem z aliasem, bez potwierdzenia.
- Wpis spoza manifestu: „(brak w manifeście)” + identyfikator drobną czcionką; alias edytowalny; `▶` przy zablokowanym archiwum otwiera bramkę jak dziś (`:1897-1899`).

### 7.7 Podgląd widoku użytkownika

- Sekcja `Podgląd widoku użytkownika` na dole strony, zwijana (stan zapamiętany).
- Rysuje ją **ta sama funkcja**, która rysuje prawdziwy widok użytkownika (rozdz. 8) — te same znaczniki, klasy, style, `Loop` i `Zatrzymaj wszystko`.
- Domyślnie podgląd **podąża za listą edytowaną** (przełącznik).
- Przełącznik szerokości `Komputer` / `Tablet` (820 px) / `Telefon` (390 px); pokazuje tylko szerokości węższe od bieżącego okna. Style widoku użytkownika używają zapytań kontenerowych (`container-type: inline-size`, `@container`), więc układ w ramce reaguje na szerokość ramki; progi są dobrane tak, żeby prawdziwy widok łamał się tak samo.
- Odnośnik `Otwórz prawdziwy widok w nowej karcie ↗` do sprawdzenia na zapisanych danych.
- Bez `<iframe>`: ramka oznaczałaby drugie połączenie z Firebase, drugi App Check, bramkę hasła w ramce i osobny silnik dźwięku.

### 7.8 Responsywność

Zasada: **na komputerze, tablecie i telefonie dostępne są wszystkie funkcje, a praca jest wygodna.** Listy i aliasy będą przygotowywane głównie na komputerze, dlatego tam układ jest najbogatszy; na telefonie admin ma pełny dostęp do tych samych czynności. Układ opiera się na elastycznych siatkach i kilku progach, a nie na dopasowywaniu każdego kafelka co do piksela dla każdej szerokości.

| Szerokość okna | Układ |
| --- | --- |
| ≥ 1600 px | trzy kolumny: foldery ok. 280 px, katalog elastyczny, listy ok. 420 px; strona do ok. 1760 px szerokości |
| 1280-1599 px | trzy kolumny: foldery ok. 240 px, listy ok. 380 px |
| 1024-1279 px | foldery jako szyna / szuflada; katalog i listy obok siebie |
| 720-1023 px (tablet) | zakładki `Katalog` / `Listy` / `Podgląd`; foldery jako szuflada |
| < 720 px (telefon) | zakładki jak na tablecie; wiersze katalogu i wpisów w dwóch liniach; pole aliasu na całą szerokość wpisu; pasek zaznaczonych przyklejony do dołu ekranu |

Na urządzeniach dotykowych:

- każda czynność ma drogę bez myszy i klawiatury: przeciąganie za uchwyt działa palcem (SortableJS), a obok zawsze są strzałki ▲▼ ⤒⤓; zaznaczanie wielu dźwięków przez pola wyboru; zmiana nazwy przez `✎`; dymki przynależności po dotknięciu znacznika;
- przyciski i pola nie mniejsze niż 40 px, odstępy między nimi wystarczające, żeby nie trafiać w sąsiada;
- „Lista docelowa” w nagłówku katalogu pozwala zmieniać cel dodawania bez przechodzenia do zakładki `Listy`;
- zakładka `Podgląd` pokazuje widok użytkownika w naturalnej szerokości urządzenia.

### 7.9 Udogodnienia na komputerze

Dodatki do dróg dostępnych na każdym urządzeniu — niczego nie zastępują:

| Udogodnienie | Działanie |
| --- | --- |
| Niezależne przewijanie kolumn | Kolumny mają wysokość okna minus nagłówek (min. ok. 640 px) i własne paski przewijania; nagłówki kolumn i pasek zaznaczonych są przyklejone. Do podglądu przewija się całą stronę. |
| Gęstość wierszy | Wiersz katalogu ok. 36 px — przy 1080 px wysokości ok. 20 wierszy naraz. |
| Zaznaczanie zakresu | `Shift` + kliknięcie zaznacza wiersze między dwoma kliknięciami; `Ctrl` + kliknięcie przełącza pojedynczy wiersz. |
| Skróty | `/` — wyszukiwarka katalogu; `Enter` / `Esc` w polach aliasu i nazwy; `Esc` zamyka szufladę. Poza tymi polami skróty nie działają, gdy kursor stoi w polu tekstowym. |
| Dymki | Przynależność i aliasy z innych list po najechaniu kursorem. |
| Edycja nazwy | Dwuklik na nazwie listy. |

### 7.10 Wygląd

- Paleta modułu bez zmian (`--panel`, `--border`, `--text`, `--accent`, `--danger`, font `Fira Code`); nowa rodzina niebieska wyłącznie dla filtrów (rozdz. 7.3.3).
- Lista wybrana do edycji: obramowanie `--accent-strong`, tło `rgba(22, 198, 12, 0.25)` — jak aktywny przycisk nawigacji użytkownika (`:571-576`).
- Miejsce upuszczenia: przerywane obramowanie `rgba(22, 198, 12, 0.6)`; uchwyt `⠿` w kolorze `--muted`.

---

## 8. Widok użytkownika

### 8.1 Elementy obowiązkowe kafelka

| Wymaganie | Realizacja |
| --- | --- |
| `Loop` | Przycisk `⟳ Loop` w każdym kafelku; aktywny czerwony z `aria-pressed="true"`, jak dziś. |
| Poziom głośności | Suwak z wartością w procentach (rozdz. 8.4). |
| Sygnał odtwarzania | Ikona w kafelku, obramowanie z poświatą, pasek postępu, kropka na zakładce listy, licznik w `Zatrzymaj wszystko` (rozdz. 8.3, 8.5). |
| Numer w nawiasie | `(N)` w kolorze `--danger`, gdy pod nazwą jest kilka plików. |
| Nazwa | Pogrubiona, do trzech wierszy; pełna w dymku. |
| Alias | `(alias)` zaraz po nazwie, kolor `#d2fad2` (D1). |
| Jeden tag | `tag2` — drugi poziom folderu, nazwa kolekcji (D12). |

### 8.2 Układ strony

- **Pasek górny przyklejony do góry ekranu:**
  - zakładki list — lista główna pierwsza, potem listy ulubionych; aktywna wyróżniona jak dziś `.user-nav .btn.is-active`; kropka `•` przy liście, na której coś gra;
  - `■ Zatrzymaj wszystko (N)` — nieaktywny, gdy nic nie gra (D11);
  - przycisk z kłódką `Odblokuj archiwum` — tylko przy zablokowanym archiwum;
  - ukryty przełącznik języka (rozdz. 9);
  - plakietka trybu pracy z danymi — w pasku na szerokim ekranie, nad nim na wąskim.
- **Zakładki:** od 1024 px zawijają się w kolejne wiersze; węziej — jeden wiersz przewijany w bok z przyciąganiem, aktywna zakładka sama przewija się do widoku.
- **Siatka kafelków płynna:** `grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr))`. Telefon pionowo — 1 kolumna, telefon poziomo — 2-3, tablet — 3-4, laptop — 5, monitor 1920 px — 7-8. Kolejność kafelków = kolejność na liście.
- **Pusty stan:** „Na tej liście nie ma jeszcze dźwięków.”; bez list ulubionych — sama zakładka listy głównej.

Komputer:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ AUDIO   [Widok główny] [Walka •] [Horror] [Statek] [Ruiny]      [■ Zatrzymaj wszystko (2)]                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ │
│ │ ■ Boltgun Reload Full  │ │ ▶ Meltagun Charge      │ │ ■ Bolter Projectile    │ │ … Przykładowy dźwięk   │ │
│ │   (przeładowanie)      │ │                        │ │   Impact Rock (5)      │ │   (alarm)              │ │
│ │   WH40k Boltgun        │ │   WH40k Boltgun        │ │   WH40k Boltgun        │ │   PrivateSubFolder     │ │
│ │ ▓▓▓▓▓▓▓░░░░░░░░░░░     │ │                        │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░     │ │   wczytywanie…         │ │
│ │ Gł. ━━━●━━ 100%        │ │ Gł. ━━━━●━ 140%        │ │ Gł. ━━●━━━  80%        │ │ Gł. ━━━●━━ 100%        │ │
│ │         [⟳ Loop]       │ │         [⟳ Loop]       │ │    [⟳ Loop aktywny]    │ │         [⟳ Loop]       │ │
│ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Telefon w pionie:

```text
┌──────────────────────────────────┐
│ [Widok główny][Walka •][H› [■ 2] │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ ■ Bolter Projectile Impact   │ │
│ │   Rock (szybki) (5)          │ │
│ │   WH40k Boltgun              │ │
│ │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░      │ │
│ │ Gł. ━━━━●━━━━ 100% [⟳ Loop]  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▶ Meltagun Charge            │ │
│ │   WH40k Boltgun              │ │
│ │ Gł. ━━━━●━━━━ 100% [⟳ Loop]  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

Legenda: `▶` — gotowy; `■` — gra (kliknięcie zatrzymuje); `…` — wczytywanie; `▓░` — pasek postępu; `•` na zakładce — na tej liście coś gra; `[■ 2]` — `Zatrzymaj wszystko` z liczbą grających dźwięków. Nazwy dźwięku z archiwum w szkicu są placeholderami.

### 8.3 Kafelek

Dwie strefy:

1. **Strefa odtwarzania** — jeden przycisk obejmujący ikonę, nazwę, alias, `(N)` i tag. Duży cel dotykowy, obsługa klawiatury bez dodatkowego kodu.
2. **Strefa sterowania** — suwak głośności z wartością i `Loop`. Przesuwanie suwaka nigdy nie uruchamia dźwięku.

```html
<!-- Kafelek dźwięku w widoku użytkownika / Sound tile in the user view -->
<article class="tile" data-key="main|bolter-projectile-impact-rock" data-state="idle">
  <button class="tile-play" type="button" aria-pressed="false">
    <span class="tile-icon" aria-hidden="true">▶</span>
    <span class="tile-title">Bolter Projectile Impact Rock <span class="sample-alias">(szybki)</span> <span class="group-count">(5)</span></span>
    <span class="tile-tag">WH40k Boltgun</span>
  </button>
  <div class="tile-progress" aria-hidden="true"><span></span></div>
  <div class="tile-controls">
    <input class="volume-slider" type="range" min="-100" max="100" value="0" aria-label="Głośność: Bolter Projectile Impact Rock">
    <output class="tile-volume">100%</output>
    <button class="btn loop-btn" type="button" aria-pressed="false">⟳ Loop</button>
  </div>
</article>
```

Stany (`data-state`, odtwarzane po każdym przerysowaniu z mapy odtwarzaczy przypisanych do stałych kluczy — rozdz. 10.5):

| Stan | Ikona | Wygląd | Kiedy |
| --- | --- | --- | --- |
| `idle` | ▶ | zwykłe obramowanie | nic nie gra |
| `loading` | … (pulsuje) | przerywane obramowanie, „wczytywanie…” | od kliknięcia do startu (podpis bramki, pobranie); drugie kliknięcie anuluje |
| `playing` | ■ | obramowanie `--danger`, poświata, pasek postępu | dźwięk gra |
| `playing` + pętla | ■ | jak wyżej, `Loop` czerwony | pętla; pasek postępu od nowa przy każdym okrążeniu |
| `missing` | kłódka | przygaszony, „(brak w manifeście)” | dźwięk spoza wczytanego manifestu; kliknięcie otwiera bramkę jak dziś |

- Pasek postępu ze zdarzenia `timeupdate` (`currentTime / duration`); przy nieznanym czasie trwania — pulsuje; przy `prefers-reduced-motion` bez pulsowania.
- Kolor nie jest jedynym sygnałem: zmienia się ikona i pojawia się pasek.
- Nazwa ucinana po trzech wierszach (`line-clamp: 3`), pełna z aliasem w dymku.
- Bez zmian: kliknięcie grającego kafelka zatrzymuje dźwięk; `Loop` przy trwającym odtworzeniu przełącza je w pętlę; warianty losowane z ochroną przed natychmiastową powtórką.

### 8.4 Głośność

- Zakres suwaka bez zmian: `-100..100`, przeliczany na wzmocnienie `0..2`; kafelek pokazuje wartość w procentach (0-200%, środek = 100%).
- Dwuklik (dwutap) na wartości przywraca 100%.
- Zmiana działa od razu na grający dźwięk i na kolejne okrążenia pętli.
- **Bez pamięci między odświeżeniami (D13):** po odświeżeniu strony każdy kafelek zaczyna od 100%. W trakcie sesji ustawiony poziom trzymany jest w pamięci pod kluczem kafelka, więc przerysowanie widoku (zmiana z bazy, zmiana zakładki) go nie zmienia (U4).
- iPhone i iPad ignorują `audio.volume`, dlatego głośność idzie przez `GainNode` Web Audio — jak dziś; `audio.volume` zostaje tylko dla przeglądarek bez `AudioContext`.

### 8.5 Sterowanie całym widokiem

- **`Zatrzymaj wszystko` (D11)** — zatrzymuje wszystkie dźwięki na wszystkich listach, także pętle „w tle”.
- **Ekran nie gaśnie w trakcie grania (D14)** — `navigator.wakeLock.request("screen")`, gdy gra co najmniej jeden dźwięk; zwolnienie, gdy nic nie gra; ponowne pobranie po powrocie do karty (`visibilitychange`). Przeglądarka bez tego mechanizmu go pomija.
- Przełączanie zakładek nie zatrzymuje dźwięków; kropka na zakładce pokazuje, gdzie wrócić.
- Gdy oglądana lista zostanie usunięta na innym urządzeniu, widok wraca do listy głównej.

### 8.6 Urządzenia dotykowe

- Żadna funkcja nie wymaga najechania kursorem.
- `touch-action: manipulation` na strefie odtwarzania i przyciskach — bez opóźnienia i przybliżania przy szybkim podwójnym dotknięciu.
- Uchwyt suwaka co najmniej 24 px; strefa odtwarzania i przyciski co najmniej 44×44 px.
- Pierwsze dotknięcie odblokowuje dźwięk (`AudioContext.resume()` — jak dziś).
- Do sprawdzenia w testach: czy przełącznik wyciszenia w iPhonie wycisza dźwięk modułu; jeżeli tak — podpowiedź w README.

### 8.7 Klawiatura i dostępność

- Tabulator przechodzi po kafelkach; `Enter` / spacja na strefie odtwarzania przełącza dźwięk.
- Strefa odtwarzania: `aria-pressed` i etykieta „Odtwórz: {nazwa} ({alias})” / „Zatrzymaj: …”.
- Suwak: `aria-label` z nazwą i `aria-valuetext` w procentach.
- Obramowanie fokusu w kolorze `--accent-strong`.

### 8.8 Wygląd

- Czerwień `--danger` w kafelkach oznacza „gra” (jak dziś), w pastylkach statusu — wyłącznie błąd.
- Kafelek: tło `--panel-alt` (`#041b08`), obramowanie `rgba(22, 198, 12, 0.4)`, promień 10 px; `playing`: obramowanie `--danger`, poświata `0 0 14px rgba(255, 95, 95, 0.35)`, pasek postępu `--danger` na tle `rgba(255, 95, 95, 0.15)`; `loading`: obramowanie przerywane w kolorze `--muted`.
- Typografia: nazwa 15 px / 600, tag 12 px `--muted`, wartość głośności 12 px.
- Pasek górny: tło `--panel`, dolna krawędź `rgba(22, 198, 12, 0.6)`.

---

## 9. Wersje językowe

- Język domyślny: polski; wszystkie teksty w `translations.pl` i `translations.en`.
- **Jeden** przełącznik języka w pasku wspólnym dla obu trybów (poza sekcjami `admin-only` i `user-only`), ukryty klasą `language-switcher--hidden`; aby go pokazać — usunąć klasę w jednym miejscu.
- Atrybuty `data-i18n`, `data-i18n-placeholder`, `data-i18n-title` zamiast ręcznych przypisań w `applyLanguage()` — wzorzec z GeneratorNPC.
- Pusta nazwa listy głównej jest tłumaczona przy wyświetlaniu; nazwy list ulubionych nie są tłumaczone. Domyślna nazwa nowej listy powstaje w bieżącym języku.
- Reguła `foldPolish` jest pisana dla polskiego; trzeci język wymagałby dopisania jego znaków nierozkładalnych.

---

## 10. Architektura kodu

### 10.1 Pliki (D9)

`Audio/index.html` (znaczniki), `Audio/style.css`, `Audio/app.js` (moduł ES) — jak w `DataVault`. Ścieżki `../shared/...` i `config/firebase-config.js` bez zmian; odnośnik z `Main/index.html` bez zmian.

### 10.2 Warstwa danych

| Funkcja | Rola |
| --- | --- |
| `normalizeSettingsV2(raw)` | Reguły z rozdz. 6.2; dokument w innym formacie → stan pusty (rozdz. 6.3). |
| `getMainList()`, `getList(listId)` | Dostęp do list. |
| `createList(name)`, `renameList(listId, name)`, `duplicateList(listId)`, `removeList(listId)`, `moveList(listId, toIndex)` | Operacje na listach; `moveList` nie dopuszcza indeksu 0. |
| `addEntries(listId, itemIds)`, `removeEntry(listId, itemId)`, `moveEntry(listId, fromIndex, toIndex)` | Operacje na wpisach. |
| `setEntryAlias(listId, itemId, alias)`, `clearListAliases(listId)`, `clearAllAliases()` | Aliasy per wpis. |
| `buildMembershipIndex()` | `Map<itemId, [{ listId, alias }]>` — znaczniki w katalogu i linia „Na innych listach”. |
| `exportSettings()` | Plik JSON z `schemaVersion` i `playlists` (bez tokenu sesji i sekretów). |

Jeden zestaw funkcji dla wszystkich list zastępuje obecne zdublowane funkcje widoku głównego i ulubionych.

### 10.3 Bezpieczeństwo treści (P11)

`escapeHtml()` dla każdego tekstu z danych (nazwa, alias, nazwa listy, plik, folder) wstawianego przez `innerHTML`, także w atrybutach — albo budowanie elementów przez `textContent`. Najwyższy priorytet wśród zmian technicznych.

### 10.4 Renderowanie

- `renderAllViews()` rozbite na `renderStatus`, `renderTree`, `renderCatalog`, `renderLists`, `renderEditor`, `renderUserView` (prawdziwy widok i podgląd), łączone w jedną klatkę przez `requestAnimationFrame` (P5).
- Po dodaniu dźwięku do listy katalog aktualizuje tylko znaczniki przynależności.
- Zmiana z bazy nie kasuje tekstu wpisywanego w pole aliasu lub nazwy: pole z fokusem jest pomijane przy przerysowaniu (albo ignorowane jest echo własnego zapisu — `snapshot.metadata.hasPendingWrites`).

### 10.5 Odtwarzanie (P12, U3-U6)

- `activePlayers` przypisane do stałego klucza `kontekst|listId|itemId` zamiast elementu DOM; po przerysowaniu kod przywraca `data-state`, ikonę, `Loop` i pasek postępu dla grających kluczy.
- Stan `loading` od kliknięcia do startu; drugie kliknięcie anuluje przez istniejący licznik pokoleń (`playbackGeneration`).
- Poziom głośności trzymany w pamięci pod tym samym kluczem na czas sesji (D13 — bez zapisu).
- `stopAll()` dla `Zatrzymaj wszystko`; licznik grających dźwięków napędza przycisk, kropki na zakładkach i blokadę wygaszania ekranu (D14).

### 10.6 Przeciąganie (D7)

SortableJS 1.15 (MIT) z `cdn.jsdelivr.net`, ładowany na żądanie tylko w panelu admina — tym samym wzorcem co `ensureJSZip()` (`:2826-2852`). Obsługuje mysz i dotyk, uchwyty i blokadę pozycji listy głównej. Gdy się nie wczyta — strzałki działają dalej.

### 10.7 Bez zmian

- Generator XLSX i logika `id`.
- Bramka, sesja, `Pomiń`, komunikaty bramki.
- Integracja ze `shared/firebase-write-status.js` (`scopeKey: "audio.settings"`), App Check, zasada „czerwień wyłącznie dla błędów” w pastylkach.
- Losowanie wariantów, zachowanie `Loop`, zakres suwaka.

### 10.8 Stan interfejsu admina (tylko dla danej przeglądarki)

- `localStorage` `audio.admin.ui`: zwinięcie panelu folderów, rozwinięte foldery, lista edytowana, szerokość i zwinięcie podglądu, aktywna zakładka na węższych ekranach.
- `sessionStorage` `audio.admin.filters`: wykluczone foldery, frazy wyszukiwania, zakres katalogu — jak Filtr Globalny w DataVault.
- Każdy odczyt i zapis w `try/catch`. Głośność kafelków nie jest zapisywana (D13).

---

## 11. Gdzie zmienić hasła

W repozytorium są **dwa niezależne hasła**. Żadne nie jest zapisane w kodzie ani w dokumentacji — i nie powinno być (`AGENTS.md`, rozdz. 12). Zmiana hasła **nie wymaga zmiany w repozytorium ani commita**.

### 11.1 Moduł Audio — Litania Dostępu do archiwum dźwięków

Hasło to sekret `GROUP_PASSWORD` w Cloudflare Worker `audio-gate` — tym, którego adres stoi w stałej `AUDIO_GATE_BASE` (`Audio/index.html:1195`). Porównanie: `handleLogin()` (`Audio/worker/audio-gate.js:255`).

**W panelu Cloudflare:**

1. Zaloguj się na `https://dash.cloudflare.com` na konto, na którym działa Worker.
2. `Workers & Pages` (w nowszym menu bywa to `Compute (Workers)`) → `audio-gate`.
3. `Settings` → `Variables and Secrets`.
4. Przy `GROUP_PASSWORD` (typ `Secret`) wybierz edycję, wpisz nowe hasło i zapisz (`Save` / `Deploy`). Sekretu nie da się odczytać — można go tylko nadpisać.

Nazwy pozycji menu Cloudflare zmieniają się co jakiś czas; szukaj zawsze Workera `audio-gate` i jego zmiennych.

**Albo z wiersza poleceń** (w folderze projektu Workera): `npx wrangler secret put GROUP_PASSWORD`.

**Sprawdzenie:** `<AUDIO_GATE_BASE>/health` zwraca `"hasPassword": true` (bez ujawniania hasła); w oknie prywatnym nowe hasło działa, stare daje „Litania Dostępu została odrzucona”.

**Urządzenia już odblokowane pozostaną odblokowane** — sesja jest bezterminowa i podpisana kluczem `SIGNING_KEY`, a nie hasłem (`createSessionToken()`, `exp: null`). Żeby wszyscy podali nowe hasło, zmień dodatkowo `SIGNING_KEY` na nową, długą losową wartość (np. z menedżera haseł, co najmniej 32 znaki). Każde urządzenie zobaczy wtedy „Sesja wygasła. Podaj hasło ponownie.”, a trwające odtworzenie z archiwum może się raz przerwać. `GITHUB_TOKEN` i `ALLOWED_ORIGIN` zostaw bez zmian.

Hasło w Audio jest porównywane znak w znak — spacja na początku lub końcu jest jego częścią.

### 11.2 Moduły DataVault i GeneratorNPC

Inne hasło i inny mechanizm: konto techniczne w Firebase Authentication projektu `wh40k-data-slate`. Moduły logują się adresem ze stałej `window.WG_DATA_ACCESS_EMAIL` (`shared/firebase-config.js`) i hasłem z bramki (`loginWithGroupPassword()`, `shared/firebase-data-loader.js:95-102`).

1. Konsola Firebase → projekt `wh40k-data-slate` → `Authentication` → `Users`.
2. Przy koncie technicznym: menu `⋮` → `Reset password` — Firebase wyśle na ten adres odnośnik do ustawienia nowego hasła (działa, jeżeli skrzynka istnieje i masz do niej dostęp).
3. Bez skrzynki: jednorazowy skrypt z `firebase-admin` i kontem serwisowym — `getAuth().updateUser(uid, { password: "…" })`. Pliku konta serwisowego nie wolno commitować.

**Nie usuwaj i nie zakładaj konta na nowo.** `uid` konta jest wpisany na sztywno w regułach Realtime Database (`shared/rtdb-wh40k-data-slate.rules.json`); nowe konto dostałoby inny `uid` i DataVault przestałby czytać dane mimo poprawnego hasła.

Po zmianie hasła Firebase unieważnia dotychczasowe sesje — urządzenia poproszą o nowe hasło najpóźniej po wygaśnięciu bieżącego tokenu (ok. godziny). Moduł przycina hasło z obu stron, więc nie zaczynaj ani nie kończ go spacją.

---

## 12. Instrukcja użytkownika bez nazw z repozytorium prywatnego

Wykonywane w etapie 4 (rozdz. 13.2), przy przepisywaniu dokumentacji.

### 12.1 Miejsca do poprawy

| Plik | Wiersze | Co zawiera |
| --- | --- | --- |
| `Audio/docs/README.md` (PL) | 236 | przykładowa nazwa pliku chronionego w opisie kolumny `NazwaPliku` |
| `Audio/docs/README.md` (PL) | 285 | przykładowy folder chroniony w „Wariant A” |
| `Audio/docs/README.md` (PL) | 299-301 | nazwa dźwięku, pliku i adres folderu chronionego w tabeli „Krok 2” |
| `Audio/docs/README.md` (PL) | 338-339 | nazwa folderu najwyższego poziomu i folderu chronionego w regułach tagów oraz wycinane słowa |
| `Audio/docs/README.md` (EN) | 832, 881, 895-897, 934-935 | te same miejsca w wersji angielskiej |
| `Audio/docs/Documentation.md` | 494, 1442 | wartości stałej `TAG_IGNORE_FRAGMENTS` (D8 — usunąć wartości, zostawić nazwę stałej) |
| `Audio/index.html` | 3032-3033 | komentarz z nazwą folderu najwyższego poziomu repozytorium prywatnego |

Stała `TAG_IGNORE_FRAGMENTS` (`Audio/index.html:1166-1171`) zostaje w kodzie (D8). Nazwa repozytorium `AudioRPG` zostaje — zależy od niej kod (`BUILDER_PROTECTED_PREFIX`, `TAG_IGNORE_SEGMENTS`) i instrukcja kopiowania manifestu.

### 12.2 Zamienniki

Przykłady publiczne pochodzą z `Audio/AudioManifest.json` (warstwa demo, repozytorium `AudioExample`).

| Miejsce | Zamiennik PL | Zamiennik EN |
| --- | --- | --- |
| opis kolumny `NazwaPliku` | `MeltagunReload.ogg` | `MeltagunReload.ogg` |
| „Wariant A”, folder | `PrivateFolder/PrivateSubFolder/` | `PrivateFolder/PrivateSubFolder/` |
| „Krok 2”, `NazwaSampla` (wariant A) | `Przykładowy dźwięk` | `Example Sound` |
| „Krok 2”, `NazwaPliku` (wariant A) | `PrivateSound.ogg` | `PrivateSound.ogg` |
| „Krok 2”, `LinkDoFolderu` (wariant A) | `https://cutelittlegoat.github.io/AudioRPG/PrivateFolder/PrivateSubFolder` | jak w PL |
| reguły tagów, pierwszy punkt | „…dźwięki chronione zaczynają drzewo od pierwszego folderu wewnątrz repozytorium (w przykładzie `PrivateFolder`), a nie od nazwy repozytorium” | „…protected sounds start their tree at the first folder inside the repository (`PrivateFolder` in the example) rather than at the repository name” |
| reguły tagów, drugi punkt | „z nazw folderów wycinane są niektóre dopiski techniczne (lista w stałej `TAG_IGNORE_FRAGMENTS` w kodzie). Jeżeli tag jest krótszy niż nazwa folderu, działa właśnie ta reguła” | „some technical suffixes are stripped from folder names (the list lives in the `TAG_IGNORE_FRAGMENTS` constant in the code). If a tag is shorter than its folder name, this is the rule at work” |
| komentarz `index.html:3032-3033` | `https://host/AudioRPG/PrivateFolder/...` → `PrivateFolder/...` | — |

Wariant B (publiczny) w „Krok 2” zostaje bez zmian.

---

## 13. Plan prac

### 13.1 Pliki

| Plik | Zmiana |
| --- | --- |
| `Audio/index.html` | znaczniki nowego panelu admina, widoku użytkownika i podglądu; jeden przełącznik języka |
| `Audio/app.js` *(nowy)* | logika: model danych, drzewo, katalog, listy, edytor, widok użytkownika i podgląd, odtwarzanie z kluczami, eksport |
| `Audio/style.css` *(nowy)* | style modułu, rodzina niebieska, zapytania kontenerowe widoku użytkownika |
| `Audio/docs/README.md` | przepisane pod nowy panel admina i nowy widok użytkownika; zamienniki z rozdz. 12 |
| `Audio/docs/Documentation.md` | nowy model danych i jego obsługa, struktura plików, funkcje, drzewo, filtry, odtwarzanie, kafelek, procedura odtworzenia, testy kontrolne |
| `DetaleLayout.md` | sekcja „Moduł — Audio” (panel admina, pasek górny, siatka, kafelek i stany, ucinanie nazwy) i wiersz tabeli przełączników języka |
| `Audio/worker/audio-gate.js`, manifesty, `shared/*`, reguły Firebase | **bez zmian** |

Cały nowy kod z komentarzami PL/EN (`AGENTS.md`, rozdz. 7); dokumentacja opisuje wyłącznie stan po wdrożeniu (`AGENTS.md`, rozdz. 4).

### 13.2 Etapy

1. **Model danych i fundamenty** — nowy dokument i `normalizeSettingsV2()` z czystym startem (rozdz. 6), `escapeHtml`, odtwarzacze przypisane do stałych kluczy, podział na trzy pliki.
2. **Panel admina** — nagłówek i `Narzędzia` z eksportem, drzewo folderów z wyszukiwaniem i niebieskim sygnałem, katalog z listą docelową i zaznaczaniem wielu pozycji, panel list, edytor z aliasami i przeciąganiem, informacja o pominiętym starym formacie; układ dla wszystkich szerokości z rozdz. 7.8 i udogodnienia z rozdz. 7.9.
3. **Widok użytkownika i podgląd** — pasek górny z zakładkami, płynna siatka, kafelek ze stanami i paskiem postępu, głośność w procentach, `Zatrzymaj wszystko`, blokada wygaszania ekranu; ta sama funkcja rysuje prawdziwy widok i podgląd z przełącznikiem szerokości.
4. **Języki i dokumentacja** — `data-i18n`, komplet tłumaczeń, `README.md`, `Documentation.md`, `DetaleLayout.md`, zamienniki z rozdz. 12, poprawki z rozdz. 16.
5. **Testy** — rozdz. 14.

---

## 14. Plan testów

### 14.1 Test akceptacyjny — odtworzenie list z notatek

| Krok | Czynność | Co sprawdza |
| --- | --- | --- |
| 1 | Odblokuj archiwum w panelu admina. | Bez tego dźwięki z archiwum nie pojawią się w katalogu. |
| 2 | Utwórz listy ulubionych z notatek i nadaj im nazwy; w razie potrzeby zmień nazwę listy głównej. | W6, W7, D2 |
| 3 | Ułóż kolejność list przeciąganiem. | W9 — lista główna zostaje pierwsza |
| 4 | Dodaj dźwięki: wyszukiwarka, drzewo folderów, `[+]`, zaznaczanie wielu pozycji. | W2, W3, W4, rozdz. 7.4 |
| 5 | Ułóż kolejność dźwięków na listach. | W8 |
| 6 | Nadaj aliasy; co najmniej raz odtwórz przypadek X / X2 / X3 — np. przez `Duplikuj listę`. | W1, D1 |
| 7 | Część czynności z kroków 2-6 wykonaj na telefonie (np. jedna nowa lista z aliasami). | W14 |
| 8 | Porównaj z notatkami; sprawdź podgląd w trybie `Telefon`, potem prawdziwy widok na telefonie i tablecie. | W5, W13 |
| 9 | `Narzędzia` → `Eksportuj ustawienia (JSON)`; plik zachowaj poza repozytorium. | D10 |

### 14.2 Scenariusze wymagań

| Test | Oczekiwany wynik |
| --- | --- |
| Alias per lista | X na Playliście01 bez aliasu, na 02 z `X2`, na 03 z `X3` → w widoku użytkownika `X`, `X (X2)`, `X (X3)`; zmiana aliasu na 02 nie zmienia 03. |
| Hierarchia tagów | `Odznacz wszystko`, rozwinięcie, zaznaczenie jednego podfolderu → katalog pokazuje jego dźwięki; przodkowie w stanie częściowym. |
| Folder z własnymi dźwiękami i podfolderem | Odznaczenie samego podfolderu zostawia widoczne dźwięki leżące bezpośrednio w folderze. |
| Wyszukiwanie folderów | Fragment nazwy wielkimi literami, bez polskich znaków → pasujące foldery z przodkami; etykieta niebieska z dymkiem; sama spacja niczego nie zapala. |
| Sygnał filtra katalogu | Wykluczony folder i zwinięty panel → kropka na szynie, „Foldery: N z M” na niebiesko. |
| Ukrycie panelu | Zwinięty panel pozostaje zwinięty po odświeżeniu. |
| Podgląd | Zmiana aliasu i kolejności widoczna od razu; `Telefon` pokazuje układ jednokolumnowy; `Loop` i `Zatrzymaj wszystko` działają. |
| Nazwy list | `✎` / dwuklik, `Enter` zapisuje, `Esc` anuluje. |
| Lista główna | Nie da się jej przesunąć ani usunąć; nic nie da się upuścić przed nią. |
| Kolejność wpisów i list | Przeciągnięcie myszą i palcem, strzałki — jedna zmiana, jeden zapis; ta sama kolejność w widoku użytkownika. |
| D2 | Własna nazwa listy głównej w nawigacji; po wyczyszczeniu „Widok główny”, po przełączeniu na EN „Main view”. |
| D3 | Usunięcie ostatniej listy ulubionych nie tworzy nowej; nawigacja pokazuje tylko listę główną. |
| D4 | Dźwięk już na liście ma `[✓]`; drugi wpis nie powstaje. |
| D7 | Przy zablokowanym `cdn.jsdelivr.net` przeciąganie niedostępne, strzałki działają. |
| D10 | Eksport zawiera `schemaVersion` i `playlists` ze wszystkimi listami, kolejnością i aliasami; nie zawiera tokenu sesji ani sekretów. |
| Język | Po tymczasowym odkryciu przełącznika wszystkie teksty po angielsku; domyślnie PL. |

### 14.3 Czysty start

| Test | Oczekiwany wynik |
| --- | --- |
| Panel admina przy obecnym dokumencie z danymi testowymi | Pusta lista główna, zero list ulubionych, jednorazowa informacja o starym formacie; dokument w bazie niezmieniony do pierwszej zmiany. |
| Pierwsza zmiana w panelu admina | Dokument zawiera wyłącznie `schemaVersion`, `playlists`, `updatedAt`. |
| Widok użytkownika przy obecnym dokumencie | Pusta lista główna, bez informacji o formacie, bez zapisu do bazy. |
| Brak dokumentu | Powstaje dokument w nowym formacie z pustą listą główną. |
| Tryb lokalny ze starym `audio.settings` i kluczem `audio.favorites` | Stare dane pominięte, `audio.favorites` usunięty, pierwszy zapis w nowym formacie. |
| Archiwum zablokowane, na listach dźwięki z archiwum | Wpisy jako „(brak w manifeście)”; po zmianie i zapisie nadal w dokumencie razem z aliasami. |

### 14.4 Widok użytkownika na urządzeniach

Na każdym urządzeniu: zmiana listy, odtworzenie i zatrzymanie, `Loop`, suwak, `Zatrzymaj wszystko`, wszystkie sygnały odtwarzania.

| Urządzenie | Rozdzielczość / przeglądarka |
| --- | --- |
| Telefon pionowo | 360×800 i 390×844, Chrome na Androidzie, Safari na iPhonie |
| Telefon poziomo | 800×360 |
| Tablet | 768×1024 i 1024×768, Safari na iPadzie, Chrome na Androidzie |
| Laptop | 1366×768 |
| Monitor | 1920×1080 i 2560×1440 |

| Test | Oczekiwany wynik |
| --- | --- |
| U1 — telefon, długa lista | Zakładki zawsze u góry; zmiana listy bez przewijania. |
| U2 — dotknięcie strefy odtwarzania | Dźwięk startuje; przesunięcie suwaka nie uruchamia dźwięku. |
| U3 — dźwięk z archiwum | `loading` od razu po dotknięciu, potem `playing` z paskiem; drugie dotknięcie w trakcie wczytywania anuluje. |
| U4 / D13 — głośność | Wartość w procentach; zmiana zakładki i zmiana z bazy nie ruszają ustawionego poziomu; po odświeżeniu strony 100%; dwutap na wartości → 100%. |
| U5 — pętla na liście A, przejście na B, powrót na A | Kropka na A; po powrocie kafelek w stanie `playing`, jedno dotknięcie zatrzymuje. |
| U5 — zmiana list z drugiego urządzenia w trakcie pętli | Pętla gra dalej i daje się zatrzymać. |
| U6 / D11 — trzy dźwięki, w tym dwie pętle na różnych listach | `Zatrzymaj wszystko (3)` zatrzymuje wszystkie i staje się nieaktywny. |
| U7 — okno od 360 do 2560 px | Liczba kolumn rośnie płynnie. |
| D14 — tablet, pętla przez 5 minut | Ekran nie gaśnie; po zatrzymaniu wszystkiego wygasza się normalnie. |
| iPhone — suwak | Głośność się zmienia. |
| iPhone — przełącznik wyciszenia | Wynik zapisany; ewentualna podpowiedź w README. |
| `prefers-reduced-motion` | Bez pulsowania; ikona i pasek nadal pokazują stan. |
| Czytnik ekranu | Zrozumiałe etykiety i stany strefy odtwarzania, suwaka i `Loop`. |
| Podgląd `Tablet` / `Telefon` | Układ identyczny z prawdziwym widokiem na tych szerokościach. |

### 14.5 Panel admina na urządzeniach

- **Komputer** (1920×1080, 1366×768): wszystkie testy z rozdz. 14.2-14.3; skróty klawiszowe; `Shift` / `Ctrl` + kliknięcie.
- **Tablet i telefon** (jak w macierzy 14.4): pełny przebieg czynności admina — nowa lista, zmiana nazwy, dodanie dźwięków (pojedynczo i kilku naraz), zmiana listy docelowej z nagłówka katalogu, alias, zmiana kolejności przeciąganiem i strzałkami, usunięcie wpisu i listy, duplikowanie, filtr folderów w szufladzie, podgląd, eksport. Oczekiwany wynik: każda czynność wykonalna palcem, bez przybliżania strony i bez elementów wychodzących poza ekran.

### 14.6 Regresja

- Bramka: start bez sesji, `Pomiń`, `Odblokuj archiwum`, kliknięcie wpisu spoza manifestu, wygaśnięcie sesji.
- Generator XLSX: manifesty z niezmienionego arkusza identyczne z obecnymi (logika `id` nietknięta).
- Pasek i plakietka zapisu: odmowa zapisu, brak sieci, ostrzeżenie o nadpisaniu — wszystkie operacje przez `persistAndRender()`.
- Bezpieczeństwo treści: alias `<b>x</b>"` i nazwa listy `<img src=x onerror=alert(1)>` wyświetlają się dosłownie.
- Wydajność: pełny manifest po odblokowaniu archiwum — wpisanie frazy i dodanie dźwięku bez zauważalnego opóźnienia.

---

## 15. Ryzyka

| Ryzyko | Ograniczenie |
| --- | --- |
| Stara wersja strony z pamięci podręcznej nadpisze dokument i skasuje odtworzone listy | Kolejność kroków z rozdz. 17 (odświeżenie wszystkich urządzeń **przed** odtwarzaniem list); eksport JSON po odtworzeniu. |
| Utrata obecnych list i aliasów | Akceptowana — dane testowe, notatki poza repozytorium. |
| Puste listy na drugim urządzeniu wyglądają jak awaria | Informacja w panelu admina (rozdz. 6.3); kolejność kroków z rozdz. 17. |
| Odtwarzanie list przy zablokowanym archiwum | Dźwięki z archiwum nie pojawiają się w katalogu — odtwarzać po odblokowaniu (rozdz. 14.1, krok 1). |
| Zapis z dwóch urządzeń naraz | Jak dziś: nowszy zapis wygrywa w całości. Bezpieczne scalanie wymagałoby osobnych dokumentów i zmiany reguł — poza zakresem. |
| Tryb admina dostępny dla każdego, kto dopisze `?admin=1`; dokument zapisywalny dla każdego | Poza zakresem; `escapeHtml` (rozdz. 10.3) usuwa najgroźniejszy skutek. Pełna ochrona wymaga logowania albo zapisu przez Workera. |
| SortableJS nie wczyta się z CDN | Strzałki (rozdz. 10.6). |
| Zapytania kontenerowe przesuną progi łamania prawdziwego widoku | Dobór progów pod marginesy strony; porównanie na kilku szerokościach (rozdz. 14.4). |
| Blokada wygaszania zużywa baterię | Aktywna tylko wtedy, gdy coś gra (D14). |
| Pasek postępu obciąża słabsze urządzenia | Aktualizacja ze zdarzenia `timeupdate` (kilka razy na sekundę), bez pętli animacji dla każdego kafelka. |
| Zakres prac | Etapy z rozdz. 13.2; jedna funkcja dla prawdziwego widoku i podglądu; elastyczne siatki zamiast wielu progów. |

---

## 16. Znalezione przy okazji

Do poprawienia w etapie 4, bo dotyczą przepisywanych fragmentów:

- `Audio/index.html:2647-2656` — komentarz twierdzi, że manifesty generuje `Audio/tools/build-manifests.mjs`; tego pliku nie ma, generator działa w przeglądarce.
- `Audio/docs/Documentation.md`, „Procedura odtworzenia modułu” — numeracja kroków po 10 wraca do 7.
- `Audio/docs/Documentation.md`, „Losowanie wariantów” — opisuje `pickRandomVariant(item, previousUrl)` zwracającą URL; kod zwraca obiekt wariantu i porównuje klucz wariantu (`:1547-1574`).
- `Audio/docs/README.md` — tabela „Statuses” w EN nie ma wiersza `Builder`; „Quick workflow” w EN ma w kroku 2 `Load manifest`, a w PL `Odblokuj archiwum`.
- `DetaleLayout.md`, „Moduł — Audio” — podaje fonty lokalne `Consolas…` (moduł używa `Fira Code` z Google Fonts), `--radius: 10px` (w kodzie `12px`) i `width: min(860px, 100%)` (w kodzie `.page { max-width: 1280px }`).

---

## 17. Kroki po wdrożeniu

1. Wdrożenie etapów 1-5 (rozdz. 13.2).
2. **Zanim zaczniesz odtwarzać listy:** na każdym urządzeniu, które używa modułu Audio (komputer, telefon, tablet), zamknij stare karty modułu i otwórz go ponownie z pominięciem pamięci podręcznej (`Ctrl+F5` na komputerze; na telefonie zamknięcie karty i ponowne otwarcie, a gdy to nie pomoże — wyczyszczenie danych witryny).
3. Sprawdź każde urządzenie: jeżeli wciąż widać stare listy testowe albo stary układ, działa stara wersja strony — powtórz krok 2. Nowa wersja przed pierwszą zmianą pokazuje pustą listę główną.
4. Odtwórz listy z notatek według rozdz. 14.1 — to jednocześnie test akceptacyjny.
5. Wyeksportuj ustawienia do pliku JSON i zachowaj go poza repozytorium.
6. Zmiana hasła — według rozdz. 11, niezależnie od wdrożenia.

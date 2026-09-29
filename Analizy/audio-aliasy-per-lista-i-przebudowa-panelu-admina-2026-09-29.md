# Audio — aliasy przypisane do list i przebudowa panelu admina — analiza

> **Data:** 29 września 2026
> **Temat:** przeniesienie aliasów dźwięków z poziomu globalnego na poziom pojedynczej listy, nowy projekt panelu admina (`?admin=1`) wygodny przy dużym manifeście, miejsce zmiany hasła, usunięcie z instrukcji użytkownika nazw z repozytorium chronionego hasłem
> **Moduł:** `Audio` (w rozdziale o haśle także `DataVault` i `GeneratorNPC`)
> **Charakter dokumentu:** analiza przedwdrożeniowa. Opisuje stan kodu z 29 września 2026 (commit `722b7e3`) i projekt stanu docelowego. **Żaden plik aplikacji ani dokumentacji modułu nie został zmieniony.**

---

## Spis treści

1. [Prompt użytkownika (zachowany w całości)](#1-prompt-użytkownika-zachowany-w-całości)
2. [Zakres analizy](#2-zakres-analizy)
3. [Jak moduł działa dziś](#3-jak-moduł-działa-dziś)
4. [Wymagania kontra stan dziś](#4-wymagania-kontra-stan-dziś)
5. [Nowy model danych — aliasy przypisane do list](#5-nowy-model-danych--aliasy-przypisane-do-list)
6. [Projekt panelu admina](#6-projekt-panelu-admina)
7. [Widok użytkownika po zmianie](#7-widok-użytkownika-po-zmianie)
8. [Wersje językowe](#8-wersje-językowe)
9. [Zmiany techniczne w kodzie](#9-zmiany-techniczne-w-kodzie)
10. [Gdzie zmienić hasło](#10-gdzie-zmienić-hasło)
11. [Instrukcja użytkownika bez nazw z repozytorium prywatnego](#11-instrukcja-użytkownika-bez-nazw-z-repozytorium-prywatnego)
12. [Decyzje do podjęcia przed wdrożeniem](#12-decyzje-do-podjęcia-przed-wdrożeniem)
13. [Zakres prac — pliki i etapy](#13-zakres-prac--pliki-i-etapy)
14. [Plan testów](#14-plan-testów)
15. [Ryzyka](#15-ryzyka)
16. [Znalezione przy okazji](#16-znalezione-przy-okazji)
17. [Rekomendacje](#17-rekomendacje)
18. [Następne kroki](#18-następne-kroki)

---

## 1. Prompt użytkownika (zachowany w całości)

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

**Uwaga o prywatności tego pliku.** Prompt zawiera dwie nazwy pochodzące z repozytorium prywatnego. Zostały zachowane wyłącznie dlatego, że `AGENTS.md` (rozdz. 10) wymaga zapisania pełnego promptu bez skracania. W pozostałej części analizy te nazwy nie są powtarzane — miejsca, w których występują w repozytorium, są wskazane numerami wierszy.

**Uwaga o zakresie tej pracy.** Polecenie „Utwórz tylko nowy plik MD” zostało potraktowane dosłownie: poprawka instrukcji `Audio/docs/README.md` (ostatnia uwaga promptu) **nie została wykonana**. Rozdział 11 zawiera gotowe zamienniki — do naniesienia razem z przebudową modułu albo wcześniej, jako osobna, drobna zmiana.

---

## 2. Zakres analizy

**W zakresie:**

- `Audio/index.html` — cały moduł: model ustawień, aliasy, listy, widok główny, panel tagów, katalog dźwięków, renderowanie, odtwarzanie, tłumaczenia;
- `Audio/docs/README.md` i `Audio/docs/Documentation.md` — nazwy z repozytorium prywatnego i opisy, które przestaną być aktualne;
- `Audio/worker/audio-gate.js` — wyłącznie w zakresie hasła i sesji;
- `shared/firestore-audiorpg.rules` — sprawdzenie, czy nowy model danych wymaga zmiany reguł;
- `DataVault/app.js`, `DataVault/style.css`, `GeneratorNPC/index.html`, `GeneratorNPC/style.css` — mechanika filtra po fragmencie nazwy i niebieskiego sygnału, jako wzorzec do przeniesienia;
- `shared/firebase-data-loader.js`, `shared/rtdb-wh40k-data-slate.rules.json` — hasło modułów `DataVault` i `GeneratorNPC`;
- `DetaleLayout.md` (sekcja „Moduł — Audio”) — zakres przyszłej aktualizacji.

**Poza zakresem (i celowo bez zmian w projekcie):**

- generator manifestów z XLSX i logika identyfikatorów (`buildManifestItems`, `slugify`, `getGroupingBaseLabel`, `extractTags`, `cleanTagSegment`, `normalizeUrl`, `toProtectedRepoPath`) — zapisane listy wskazują dźwięki po `id`, więc ta logika musi zostać nietknięta; przebudowa **nie wymaga** ponownego generowania manifestów;
- pliki `Audio/AudioManifest.json` i `audio-manifest.json` — format bez zmian;
- kod bramki (Cloudflare Worker) — bez zmian;
- zabezpieczenie trybu admina przed osobami postronnymi — opisane jako ryzyko w rozdz. 15, bez projektu rozwiązania.

---

## 3. Jak moduł działa dziś

### 3.1 Dane ustawień

Ustawienia leżą w jednym dokumencie Firestore `audio/favorites` (projekt `audiorpg-2eb6f`), a przy braku bazy — w `localStorage` pod kluczem `audio.settings`. Zapis zawsze nadpisuje cały dokument jednym `setDoc` (`Audio/index.html:1976-2013`).

```text
{
  favorites: { lists: [ { id, name, itemIds: [] } ] },   // listy ulubionych
  mainView:  { itemIds: [] },                             // „Widok główny” — osobny byt, bez nazwy
  aliases:   { "<itemId>": "alias" },                     // JEDNA mapa aliasów dla całego modułu
  updatedAt: serverTimestamp()
}
```

### 3.2 Jak działa alias dziś

| Element | Miejsce w kodzie | Działanie |
| --- | --- | --- |
| Mapa aliasów | `state.aliases` (`:1134`) | Jeden alias na jeden `itemId`, wspólny dla wszystkich list. |
| Przypięcie do dźwięku | `applyAliasesToItems()` (`:2089-2096`) | Kopiuje alias do obiektu dźwięku jako `item.alias`. |
| Wyświetlenie | `formatSampleLabel(item)` (`:1277-1287`) | Zawsze `Nazwa (alias) (N)` — ten sam napis w katalogu, w widoku głównym, w każdej liście i w widoku użytkownika. |
| Edycja | pole na karcie katalogu (`:2280`, zdarzenie `change` w `:3311-3321`) | Alias wpisuje się w katalogu, nie na liście. |
| Czyszczenie | `Wyczyść` na karcie (`:3294`), `Wyczyść wszystkie aliasy` (`:2619-2629`) | Usuwa alias globalnie. |

Konsekwencja: nie da się dziś zapisać, że ten sam dźwięk nazywa się inaczej na dwóch listach. Model danych nie ma na to miejsca.

### 3.3 Układ panelu admina dziś

Od góry: nagłówek ze statusami → pasek przycisków (`Wczytaj manifest`, `Odblokuj archiwum`, `Zbuduj manifesty z XLSX`, `Nowa lista ulubionych`, `Odśwież ulubione`) → panel „Filtry tagów” na całą szerokość → pasek z wyszukiwarką SFX i `Wyczyść wszystkie aliasy` → siatka: katalog SFX (karty w 4 kolumnach) | kolumna boczna z panelami „Ulubione” i „Główny widok” → na samym dole sekcja widoku użytkownika (nie ma klasy `admin-only`, więc w panelu admina jest widoczna, ale bez przycisków `Loop`).

### 3.4 Problemy obecnego panelu

| # | Problem | Gdzie | Skutek |
| --- | --- | --- | --- |
| P1 | Alias jest globalny. | `:1134`, `:2089`, `:2605` | Brak możliwości spełnienia wymagania z promptu bez zmiany modelu danych. |
| P2 | Alias edytuje się w katalogu, daleko od list. | `:2279-2282` | Przy aliasach per lista pole w katalogu traci sens — nie wiadomo, której listy dotyczy. |
| P3 | „Widok główny” to osobna struktura (`mainView.itemIds`) i osobny zestaw funkcji (`moveMainViewItem`, `removeMainViewItem` obok `moveItem`, `removeItem`). | `:2596-2645` | Powielony kod, inny wygląd dwóch paneli, lista główna nie ma nazwy. |
| P4 | Katalog to karty `min-height: 150px` w 4 kolumnach, każda z polem aliasu, trzema przyciskami i listą rozwijaną zawierającą **wszystkie** listy. | `:397-412`, `:2248-2293` | Przy manifeście rzędu 1,8 tys. wierszy arkusza strona ma kilkadziesiąt ekranów wysokości i tysiące elementów formularza. |
| P5 | Każda zmiana przerysowuje cały katalog **dwa razy**: `renderAllViews()` woła `renderSamples()`, a potem `renderFavorites()`, które na końcu znów woła `renderSamples()`. | `:2343`, `:2469-2484` | Zauważalne opóźnienie po każdym kliknięciu przy dużym manifeście. |
| P6 | Dodanie do listy wymaga wybrania listy z menu na karcie i kliknięcia przycisku; nie widać, na których listach dźwięk już jest; nie ma dodawania wielu dźwięków naraz. | `:2263-2287` | Praca „jeden dźwięk — trzy kliknięcia”, łatwo o pomyłkę listy. |
| P7 | Pola wyboru tagów są niezależne od siebie, a dźwięk jest widoczny tylko wtedy, gdy zaznaczone są **wszystkie** poziomy jego ścieżki. Odznaczenie rodzica chowa jego dzieci w drzewie. | `:1447`, `:2252-2256` | Pułapka: `Odznacz wszystko` → zaznaczenie jednego podfolderu w popupie → lista pozostaje pusta, bo przodkowie są odznaczeni. Nie ma stanu pośredniego, liczników ani zwijania niezależnego od zaznaczenia. |
| P8 | Wyszukiwanie tagów działa tylko w popupie, przez `toLowerCase().includes()` bez składania polskich znaków; są dwa lustrzane pola (`tagSearchInput`, `tagMenuSearchInput`); wejście w pierwsze otwiera popup. Wyszukiwarka SFX szuka tylko w nazwie. Nigdzie nie ma sygnału „filtr jest założony”. | `:1467-1496`, `:3519-3530`, `:2252` | Wymaganie o wyszukiwaniu po fragmencie i niebieskim podświetleniu jest niespełnione. |
| P9 | `Ukryj panel` działa, ale stan nie jest zapamiętany, a panel stoi na pełnej szerokości nad katalogiem. | `:3532-3537` | Po każdym odświeżeniu panel wraca i spycha katalog w dół. |
| P10 | Nowa lista i zmiana nazwy przez `prompt()`; kolejność list i pozycji tylko strzałkami ▲▼, jeden krok na kliknięcie, każdy krok to osobny zapis. | `:2504-2556`, `:2311-2329` | Przesunięcie pozycji z miejsca 40 na 3 to 37 kliknięć i 37 zapisów do bazy. |
| P11 | Nazwy dźwięków, aliasy i nazwy list trafiają do `innerHTML` bez zamiany znaków specjalnych — także do atrybutu `value="${item.alias}"`. Dokument `audio/favorites` jest otwarty do zapisu dla każdego (`allow read, write: if true`). | `:1282`, `:2264`, `:2280`, `:2309`, `:2455` | Alias ze znakiem `<` lub `"` psuje układ, a złośliwie zapisany alias może wstrzyknąć skrypt na strony wszystkich użytkowników. |
| P12 | Odtwarzacze są przypisane do elementu DOM (`activePlayers: Map<element, player>`). Każde przerysowanie podmienia elementy. | `:1158`, `:1888-1910` | Gdy w trakcie odtwarzania przyjdzie zmiana z bazy (np. admin edytuje listy na laptopie, a telefon gra pętlę), kafelek traci stan, a dźwięk — zwłaszcza w pętli — gra dalej i **nie da się go zatrzymać** bez odświeżenia strony. |
| P13 | Są dwa przełączniki języka (admin i użytkownik). | `:646-652`, `:732-738` | Dwa miejsca do odkrycia przełącznika; dokumentacja musi to tłumaczyć. |
| P14 | `Odśwież ulubione` nic nie robi, gdy działa Firestore. | `:3475-3480` | Przycisk bez skutku w typowej konfiguracji. |

Pułapka P7 dotyczy także realnych danych: w manifeście publicznym (94 ścieżki folderów) jest folder, który jednocześnie zawiera dźwięki bezpośrednio i ma podfolder z kolejnymi dźwiękami. Projekt drzewa w rozdz. 6.3 musi obsłużyć ten przypadek.

---

## 4. Wymagania kontra stan dziś

| # | Wymaganie z promptu | Stan dziś | Rozwiązanie |
| --- | --- | --- | --- |
| W1 | Aliasy powiązane z listami (X / X2 / X3) | Niespełnione (P1) | Rozdz. 5 |
| W2 | Zaznaczanie i odznaczanie tagów w podgrupach i grupach, z hierarchią katalogów | Częściowo, z pułapką (P7) | Rozdz. 6.3.1 |
| W3 | Wyszukiwanie tagów po fragmencie nazwy + niebieskie podświetlenie aktywnego filtra (jak w DataVault i GeneratorNPC) | Częściowo, bez sygnału (P8) | Rozdz. 6.3.2 i 6.3.3 |
| W4 | Ukrycie panelu tagów albo lepsze rozwiązanie | Przycisk bez pamięci (P9) | Rozdz. 6.3.4 |
| W5 | Na dole strony podgląd widoku użytkownika | Częściowo (sekcja istnieje, bez `Loop`, bez szerokości urządzeń) | Rozdz. 6.7 |
| W6 | Nadawanie nazw listom ulubionych | Przez `prompt()` | Rozdz. 6.5 |
| W7 | Lista główna | Jest jako osobny „Widok główny” (P3) | Rozdz. 5.2 i 6.5 |
| W8 | Przesuwanie dźwięków w obrębie każdej listy | Strzałki, krok po kroku (P10) | Rozdz. 6.6 |
| W9 | Przesuwanie list, lista główna zawsze pierwsza | Strzałki dla ulubionych; „Widok główny” poza kolejnością | Rozdz. 6.5 |
| W10 | PL i EN, domyślnie PL, przełącznik ukryty | Spełnione — do utrzymania | Rozdz. 8 |
| W11 | Gdzie zmienić hasło | — | Rozdz. 10 |
| W12 | Instrukcja bez nazw z repozytorium prywatnego | Niespełnione | Rozdz. 11 |

---

## 5. Nowy model danych — aliasy przypisane do list

### 5.1 Struktura (wersja 2)

Alias przestaje być cechą dźwięku i staje się cechą **wpisu na liście**. Lista główna staje się zwykłą listą z flagą.

```js
// Dokument audio/favorites w wersji 2 (przykład z promptu)
{
  schemaVersion: 2,
  playlists: [
    { id: "main",  kind: "main", name: "",            entries: [] },
    { id: "3f0c…", kind: "list", name: "Playlista01", entries: [ { itemId: "x", alias: ""   } ] },
    { id: "9a41…", kind: "list", name: "Playlista02", entries: [ { itemId: "x", alias: "X2" } ] },
    { id: "c7d2…", kind: "list", name: "Playlista03", entries: [ { itemId: "x", alias: "X3" } ] }
  ],
  // Projekcja zgodności dla starszej wersji strony — rozdz. 5.4
  favorites: { lists: [ … ] }, mainView: { itemIds: [ … ] }, aliases: { … },
  // Kopia danych sprzed migracji — rozdz. 5.3
  legacyV1: { favorites, mainView, aliases, migratedAt },
  updatedAt: serverTimestamp()
}
```

**Dlaczego pole nazywa się `playlists`, a nie `lists`.** Obecny kod w `normalizeSettings()` (`:2102`) traktuje pole `lists` na najwyższym poziomie dokumentu jako obiekt ulubionych w starym formacie (`raw.favorites || (raw.lists ? raw : null)`). Gdyby nowa wersja zapisała `lists`, strona w starej wersji (z pamięci podręcznej przeglądarki albo na drugim urządzeniu) odczytałaby wszystkie listy jako puste, a przy pierwszym zapisie nadpisałaby dokument. Inna nazwa pola usuwa to ryzyko u źródła.

### 5.2 Reguły modelu

Pilnuje ich jedna funkcja normalizująca, wywoływana przy każdym odczycie z bazy i z `localStorage`:

1. Istnieje **dokładnie jedna** lista główna: `id: "main"`, `kind: "main"`, zawsze na pozycji 0. Gdy jej brakuje — powstaje pusta. Gdy stoi gdzie indziej — wraca na początek.
2. Listy głównej nie da się usunąć ani przesunąć. Pozostałe listy (0 lub więcej) mają kolejność taką jak w tablicy.
3. Ten sam dźwięk występuje na danej liście najwyżej raz (tak jak dziś, `:2525`); duplikaty są usuwane z zachowaniem pierwszego wpisu.
4. `alias` to przycięty tekst, najwyżej 80 znaków; pusty oznacza brak aliasu. `name` — najwyżej 60 znaków.
5. Pusta nazwa listy głównej oznacza nazwę domyślną w bieżącym języku („Widok główny” / „Main view”). Nazwy pozostałych list są danymi użytkownika i nie są tłumaczone.
6. **Wpisów z `itemId` nieobecnym w bieżącym manifeście nie wolno usuwać ani pomijać przy zapisie.** Przy zablokowanym archiwum wszystkie dźwięki chronione są „nieobecne”, a ich wpisy i aliasy muszą przetrwać.
7. Alias należy do wpisu: usunięcie dźwięku z listy usuwa jego alias na tej liście; przesunięcie wpisu przenosi alias razem z nim.

### 5.3 Migracja z wersji 1

Migracja odbywa się przy odczycie, gdy dokument nie ma `schemaVersion: 2` albo pola `playlists` — zarówno dla Firestore, jak i dla `audio.settings` oraz starego klucza `audio.favorites`.

| Wersja 1 | Wersja 2 |
| --- | --- |
| `mainView.itemIds` | `playlists[0].entries`, alias każdego wpisu = `aliases[itemId]` |
| `favorites.lists[i]` | `playlists[i + 1]` z tym samym `id` i `name`; alias każdego wpisu = `aliases[itemId]` |
| aliasy dźwięków, które nie są na żadnej liście | nie są wyświetlane; zostają w `legacyV1.aliases`, a komunikat po migracji podaje ich liczbę |
| — | `legacyV1` = pełna kopia danych v1 + `migratedAt` |

Skutek: **bezpośrednio po migracji użytkownik widzi dokładnie to samo co przed nią** — każda lista pokazuje te same aliasy, bo globalny alias został skopiowany do każdego wpisu. Różnica pojawia się dopiero przy edycji: zmiana aliasu na jednej liście nie rusza pozostałych.

Migracja jest deterministyczna (identyfikatory list pochodzą z danych v1, lista główna dostaje stałe `main`), więc dwa urządzenia migrujące jednocześnie zapiszą ten sam wynik (poza znacznikiem czasu `migratedAt`). Szkic celowo nie używa obecnego `normalizeFavorites()`, bo ta funkcja przy braku list tworzy listę „Ulubione” z losowym identyfikatorem. Rekomendacja: zapisać wynik migracji od razu po pierwszym odczycie i pokazać w panelu admina jednorazową informację: „Ustawienia przeniesiono do nowego formatu: N list, M aliasów przypisanych do list, K aliasów bez listy zachowanych w kopii”.

Szkic funkcji:

```js
// --- Migracja ustawień v1 → v2 / Settings migration v1 → v2 ---
// PL: Globalny alias trafia do każdego wpisu tego dźwięku, więc po migracji widok się nie zmienia.
// EN: The global alias is copied into every entry of that sound, so the view is unchanged after migration.
const migrateV1ToV2 = (raw) => {
  const aliases = normalizeAliases(raw?.aliases);
  const toEntries = (ids) => [...new Set((Array.isArray(ids) ? ids : []).filter(Boolean))]
    .map((itemId) => ({ itemId, alias: aliases[itemId] || "" }));
  // PL: Najstarszy format trzymał listy bezpośrednio w dokumencie — tę samą regułę ma dziś normalizeSettings().
  // EN: The oldest format kept the lists directly in the document — normalizeSettings() applies the same rule today.
  const favoritesSource = raw?.favorites || (Array.isArray(raw?.lists) ? raw : null);
  const favoriteLists = Array.isArray(favoritesSource?.lists) ? favoritesSource.lists : [];
  return {
    schemaVersion: 2,
    playlists: [
      { id: "main", kind: "main", name: "", entries: toEntries(raw?.mainView?.itemIds) },
      // PL: Identyfikator zastępczy zależy od pozycji, a nie od losowania — migracja daje zawsze ten sam wynik.
      // EN: The fallback id depends on position rather than randomness, so migration always gives the same result.
      ...favoriteLists.map((list, index) => ({
        id: list.id || `list-${index + 1}`,
        kind: "list",
        name: String(list.name || "").trim(),
        entries: toEntries(list.itemIds)
      }))
    ],
    legacyV1: { favorites: raw?.favorites || null, mainView: raw?.mainView || null, aliases, migratedAt: new Date().toISOString() }
  };
};
```

### 5.4 Zgodność ze starszą wersją strony w okresie przejściowym

GitHub Pages i pamięć podręczna przeglądarek sprawiają, że przez jakiś czas na którymś urządzeniu może działać jeszcze stara strona. Jej `saveSettings()` nadpisuje cały dokument polami `favorites`, `mainView`, `aliases` — czyli skasowałaby `playlists`.

Rozwiązanie: nowa wersja przy każdym zapisie dopisuje obok `playlists` **projekcję w starym formacie**:

- `favorites.lists` = listy od pozycji 1 w formacie `{ id, name, itemIds }`,
- `mainView.itemIds` = identyfikatory z listy głównej,
- `aliases` = dla każdego dźwięku pierwszy niepusty alias w kolejności list (lista główna pierwsza).

| Sytuacja | Skutek |
| --- | --- |
| Stara strona czyta dokument v2 | Widzi poprawne listy i kolejność; aliasy w przybliżeniu (jeden na dźwięk). |
| Stara strona zapisuje zmianę | Znika `playlists`; nowa strona przy następnym odczycie migruje z projekcji — listy zostają, różne aliasy tego samego dźwięku zlewają się w jeden. |

Najgorszy przypadek to więc utrata rozróżnienia aliasów, a nie utrata list. Po wdrożeniu wystarczy raz odświeżyć moduł z pominięciem pamięci podręcznej (`Ctrl+F5`) na każdym urządzeniu. Projekcję można usunąć z kodu po okresie przejściowym (decyzja D6).

### 5.5 Wyświetlanie aliasu

Rekomendacja: zachować obecny format, zmienić tylko źródło aliasu.

- Widok użytkownika i edytor listy: `Nazwa (alias z tej listy) (N)` — kolor aliasu `#d2fad2` jak dziś (`.sample-alias`), licznik wariantów czerwony jak dziś (`.group-count`).
- Katalog dźwięków: sama nazwa z manifestu, bez aliasu; w dymku lista aliasów z poszczególnych list („Playlista02: X2 · Playlista03: X3”).

Wariant z aliasem zastępującym nazwę opisuje decyzja D1.

### 5.6 Firestore — ten sam dokument, bez zmiany reguł

Reguły projektu `audiorpg-2eb6f` (`shared/firestore-audiorpg.rules`) dopuszczają wyłącznie dokument `audio/favorites`; każdy inny jest zablokowany. Model v2 zostaje w tym samym dokumencie, więc **nie trzeba niczego zmieniać w konsoli Firebase** ani w pliku reguł. GeneratorNPC korzysta z innego dokumentu tego samego projektu i nie jest dotknięty.

Rozmiar: wpis to ok. 70-100 bajtów; 20 list po 50 dźwięków razem z projekcją i kopią v1 to rząd 150 KB, daleko poniżej limitu 1 MiB na dokument.

Rozbicie ustawień na osobne dokumenty (jedna lista = jeden dokument) pozwoliłoby bezpiecznie scalać zmiany z dwóch urządzeń, ale wymaga zmiany reguł. To osobne zadanie, niepotrzebne do spełnienia promptu.

---

## 6. Projekt panelu admina

### 6.1 Zasada układu

Panel staje się „warsztatem” w trzech kolumnach, w kierunku pracy od lewej do prawej: **skąd biorę** (foldery) → **co wybieram** (katalog) → **dokąd wkładam** (listy i edytor listy). Pod spodem, na całą szerokość, podgląd widoku użytkownika.

Kluczowe pojęcie: **lista edytowana** — jedna lista wybrana w panelu list. Przycisk `[+]` w katalogu działa na nią, edytor pokazuje jej wpisy, a podgląd domyślnie ją wyświetla. Znika lista rozwijana na każdej karcie katalogu.

```text
┌─ AUDIO — PANEL ADMINA ────────────────── [Manifest: 1412] [Firebase: połączono] [Archiwum: odblokowane] [Narzędzia ▾] ─┐
├─ FOLDERY [«] ────────────────┬─ KATALOG DŹWIĘKÓW · Wyniki: 137 z 1412 ────────────┬─ LISTY · [+ Nowa lista] ───────────┤
│ Szukaj folderu               │ Szukaj dźwięku                                     │ [P] Widok główny             (24)  │
│ [fragment nazwy...      ]    │ [reload...                                    ]    │  ⠿  Walka                    (12)  │
│ [Zaznacz wsz.][Odznacz wsz.] │ Pokaż: (•) wszystkie ( ) spoza ( ) z listy         │  ⠿  Horror                    (8)  │
│ [Rozwiń wsz.][Zwiń wsz.]     │ Foldery: 3 z 94                                    │  ⠿  Playlista02 < edytowana   (5)  │
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

Legenda szkicu: `[P]` — lista główna przypięta na początku; `⠿` — uchwyt przeciągania; `[x]` / `[ ]` / `[~]` — zaznaczone / odznaczone / częściowo; `[+]` / `[✓]` — dodaj do listy edytowanej / już na niej; `[2]` — na ilu listach jest dźwięk; `[✎][⧉][x]` — zmień nazwę, duplikuj, usuń listę.

Na komputerze każda kolumna przewija się niezależnie (wysokość = okno minus nagłówek), a nagłówki kolumn i pasek zaznaczonych są przyklejone. Dzięki temu długi katalog nie spycha list poza ekran — to najważniejsza zmiana dla dużego manifestu.

### 6.2 Nagłówek i narzędzia

- Tytuł, pastylki statusów (`Manifest`, `Firebase`, `Archiwum`, `Generator`; `Ulubione: N list` zmienia się na `Listy: N`), plakietka trybu pracy z danymi bez zmian.
- `Odblokuj archiwum` — widoczny tylko przy zablokowanym archiwum, jak dziś.
- Menu `Narzędzia ▾` zbiera rzadko używane akcje, które dziś zajmują pasek:
  - `Wczytaj manifest ponownie`,
  - `Zbuduj manifesty z XLSX` (bez zmian w działaniu),
  - `Eksportuj ustawienia (JSON)` — kopia list i aliasów do pliku; rekomendowane jako zabezpieczenie przed migracją,
  - `Wyczyść aliasy we wszystkich listach` — z potwierdzeniem,
  - `Wczytaj ponownie z pamięci urządzenia` — widoczne wyłącznie w trybie lokalnym (zastępuje `Odśwież ulubione`, P14).
- Przy zablokowanym archiwum pod nagłówkiem stoi informacja: „Archiwum zablokowane — dźwięki z archiwum są widoczne na listach jako „(brak w manifeście)”. Nie zostaną usunięte.”

### 6.3 Panel folderów (tagi)

#### 6.3.1 Drzewo z zaznaczaniem hierarchicznym (W2)

Każdy węzeł to folder ze ścieżki `tagPaths`: `[▸/▾] [pole wyboru] nazwa (liczba widocznych / wszystkich)`.

Zasady:

- Zaznaczenie jest pamiętane dla **dźwięków leżących bezpośrednio w danym folderze**. Dźwięk jest widoczny w katalogu, gdy zaznaczony jest jego **najgłębszy** folder. To usuwa pułapkę P7 i poprawnie obsługuje folder, który ma jednocześnie własne dźwięki i podfoldery.
- Pole wyboru węzła jest trójstanowe i wyliczane: ☑ — folder i wszystkie podfoldery zaznaczone, ☐ — nic nie zaznaczone, ◩ — częściowo (właściwość `indeterminate`, odczytywana przez czytniki ekranu jako „mieszany”).
- Kliknięcie węzła ustawia ten sam stan dla folderu i **wszystkich** jego podfolderów. Kliknięcie ◩ zaznacza całość.
- Zwijanie (▸/▾) jest niezależne od zaznaczenia — odznaczony folder można rozwinąć i zaznaczyć w nim jeden podfolder.
- Akcje zbiorcze: `Zaznacz wszystko`, `Odznacz wszystko`, `Rozwiń wszystko`, `Zwiń wszystko`; przy każdym węźle w menu kontekstowym (lub małym przyciskiem) `Tylko ten folder` — odznacza wszystko poza tym poddrzewem.
- Nowe foldery po ponownym wczytaniu manifestu są domyślnie zaznaczone (stan przechowywany jako lista **wykluczonych** ścieżek, rozdz. 9.8).

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

#### 6.3.2 Wyszukiwanie folderów po fragmencie nazwy (W3)

- Jedno pole `Szukaj folderu` w panelu (zamiast dwóch lustrzanych pól i popupu).
- Porównanie według reguły `foldPolish()` z `DataVault/app.js:549-555`: małe litery, bez znaków diakrytycznych, `ł` → `l`. Fraza szukana jako jeden ciąg w dowolnym miejscu nazwy folderu. Moduł dostaje własną kopię funkcji z komentarzem odsyłającym do DataVault — tak zrobiono w GeneratorNPC (`GeneratorNPC/index.html:1540-1630`).
- Wynik: widoczne są pasujące foldery i ich przodkowie (dla kontekstu hierarchii), przodkowie rozwijają się automatycznie, pasujący fragment nazwy jest wyróżniony.
- Wyszukiwanie **zawęża tylko drzewo**, nie katalog. Katalog zawężają pola wyboru. Do szybkiej pracy: `Zaznacz pasujące`, `Odznacz pasujące`, `Tylko pasujące` (działają na pasujące foldery z poddrzewami).
- Bez przycisku czyszczenia i z polem `type="text"` — tak jak Filtr Globalny w DataVault i filtry list w GeneratorNPC.

#### 6.3.3 Niebieski sygnał aktywnego filtra (W3)

Barwa i reguła przeniesione 1:1 z DataVault (`DataVault/style.css:47-52`, klasa `.fieldLabel--active`, funkcja `updateGlobalFilterIndicator()` w `DataVault/app.js:578-585`): etykieta świeci na niebiesko tylko wtedy, gdy fraza po złożeniu faktycznie zawęża widok (sama spacja nie zapala), a dymek powtarza wpisaną frazę, bo sama barwa jest słabym sygnałem.

| Element | Kiedy niebieski |
| --- | --- |
| etykieta `Szukaj folderu` | fraza zawęża drzewo |
| nagłówek `Foldery`, kropka na zwiniętym panelu, przycisk `Foldery` w wersji mobilnej | co najmniej jeden folder jest wykluczony z katalogu |
| etykieta `Szukaj dźwięku` | fraza zawęża katalog |
| etykieta `Szukaj na liście` w edytorze | fraza zawęża wpisy listy |
| linia nad wynikami katalogu „Foldery: 3 z 94” | co najmniej jeden folder jest wykluczony |

Zmienne do dodania w `:root` modułu: `--filter-on: #3D8FC4`, `--filter-on-bright: #6FB3E0`, `--filter-on-border: rgba(61,143,196,.55)`, `--filter-on-glow: rgba(61,143,196,.40)`, `--filter-on-bg: rgba(61,143,196,.10)`, `--filter-on-bg-active: rgba(61,143,196,.20)`. Niebieski nie ma dziś w Audio żadnego znaczenia, więc nie koliduje z zasadą „czerwień wyłącznie dla błędów”.

#### 6.3.4 Ukrywanie panelu — rozwiązanie rekomendowane (W4)

Zamiast chowania panelu na pełnej szerokości:

- panel folderów jest **boczną kolumną zwijaną do wąskiej szyny** (ok. 44 px) z pionowym napisem `FOLDERY` i niebieską kropką, gdy filtr jest aktywny; stan zwinięcia jest zapamiętany na tym urządzeniu;
- poniżej 1280 px szerokości panel jest **szufladą** wysuwaną przyciskiem `Foldery` z paska katalogu i zamykaną `Esc` albo kliknięciem obok;
- nad wynikami katalogu stoi jedna linia podsumowania („Foldery: 3 z 94”), więc nawet przy zwiniętym panelu widać, że katalog jest zawężony.

To spełnia wymaganie „ukryć cały panel” i jednocześnie nie traci informacji o aktywnym filtrze.

### 6.4 Katalog dźwięków

Wiersz zamiast karty (jedna linia na komputerze, dwie na telefonie):

```text
[ ] [▶] Nazwa dźwięku (N)   folder › podfolder   plik.ogg   [demo|archiwum]   [w 2 listach]   [+ / ✓]
```

- `▶` — odsłuch w panelu (ten sam silnik odtwarzania; drugie kliknięcie zatrzymuje).
- `(N)` — czerwony licznik wariantów jak dziś.
- Ścieżka folderu — ważna, bo ta sama nazwa bywa w dwóch folderach (w manifeście publicznym np. „Boltgun Reload Full” występuje dwa razy).
- Znacznik warstwy `demo` / `archiwum`.
- `[w 2 listach]` — przynależność do list; dymek wymienia listy i aliasy; wyróżnienie, gdy dźwięk jest na liście edytowanej.
- `[+]` dodaje dźwięk na koniec listy edytowanej, `[✓]` oznacza „już na liście” — kliknięcie usuwa (z potwierdzeniem tylko wtedy, gdy wpis ma alias, bo alias przepadnie).
- Zaznaczanie wielu wierszy i pasek „Zaznaczone: N · Dodaj do „Lista” · Odznacz”; `Zaznacz wszystkie wyniki` z potwierdzeniem powyżej 50 pozycji.
- Filtry: fraza (nazwa, nazwa pliku, ścieżka folderu i aliasy ze wszystkich list, reguła `foldPolish`), `Pokaż: wszystkie | spoza edytowanej listy | z edytowanej listy`, `Warstwa: wszystkie | demo | archiwum`.
- Licznik „Wyniki: 137 z 1412”.
- Wydajność: pierwsze 200 wierszy i przycisk `Pokaż kolejne 200`; opóźnienie wyszukiwania 150 ms; tekst do przeszukiwania liczony raz przy wczytaniu manifestu.
- Sortowanie alfabetyczne jak dziś.

### 6.5 Panel list (W6, W7, W9)

- Nagłówek `Listy` i przycisk `+ Nowa lista`.
- Wiersz listy: `[P lub ⠿] nazwa (liczba) [▲][▼]` (P — pinezka listy głównej); kliknięcie wybiera listę do edycji (wyróżnienie jak aktywny przycisk nawigacji użytkownika).
- **Lista główna**: zawsze pierwsza, z pinezką i dopiskiem „lista główna”, bez uchwytu, strzałek i przycisku usunięcia. Nazwę można zmienić (decyzja D2); pusta nazwa = nazwa domyślna w bieżącym języku.
- **Kolejność list**: przeciąganie za uchwyt `⠿` oraz strzałki ▲▼. Upuszczenie przed listą główną jest zablokowane; ▲ pierwszej listy ulubionych jest nieaktywna. Jedno przeciągnięcie = jeden zapis.
- **Nazwa listy**: edycja w miejscu (dwuklik albo `✎`), `Enter` lub opuszczenie pola zapisuje, `Esc` anuluje, pusta nazwa przywraca poprzednią. Bez `prompt()`.
- **Nowa lista** powstaje na końcu z nazwą „Nowa lista”, od razu jest wybrana, a pole nazwy dostaje fokus.
- **Usunięcie**: potwierdzenie z nazwą i liczbą wpisów („Usunąć listę „Walka” (12 dźwięków, w tym 3 z aliasem)?”); potem wybrana zostaje lista główna.
- **Duplikuj listę** (`⧉`) — kopia z wpisami i aliasami, nazwa „… (kopia)”, wstawiona zaraz po oryginale. Bezpośrednio wspiera scenariusz z promptu: przygotować Playlistę02, zduplikować ją jako Playlistę03 i zmienić tylko aliasy.
- Można mieć zero list ulubionych (decyzja D3) — lista główna zawsze istnieje.

### 6.6 Edytor listy — aliasy i kolejność (W1, W8)

Nagłówek: nazwa listy (edycja w miejscu), liczba wpisów, pole `Szukaj na liście`, `Wyczyść aliasy tej listy`.

Wiersz wpisu:

```text
⠿  3.  [▶]  Nazwa z manifestu (N)   folder › podfolder
            [ Alias na tej liście (opcjonalny)          ]   [▲][▼][⤒][⤓][✕]
            Na innych listach: X2 (Playlista02) · X3 (Playlista03)
```

- **Alias**: zapis przy zmianie (opuszczenie pola albo `Enter`), `Esc` przywraca poprzednią wartość. Linia „Na innych listach” pokazuje aliasy tego dźwięku z pozostałych list; pole podpowiada je jako propozycje (lista podpowiedzi tworzona przy wejściu w pole, nie dla każdego wiersza z góry).
- **Kolejność**: przeciąganie za uchwyt (także palcem na tablecie), ▲▼ o jedną pozycję, ⤒⤓ na początek i koniec. Jedno przeciągnięcie = jeden zapis.
- Przy aktywnym `Szukaj na liście` zmiana kolejności jest zablokowana (z podpowiedzią dlaczego) — przesuwanie wycinka listy byłoby niejednoznaczne.
- `✕` usuwa wpis razem z aliasem, bez potwierdzenia jak dziś; opcjonalnie komunikat „Usunięto — Cofnij” przez kilka sekund.
- Wpis spoza manifestu: „(brak w manifeście)” + identyfikator drobną czcionką; alias można edytować; `▶` przy zablokowanym archiwum otwiera bramkę jak dziś (`:1897-1899`).

### 6.7 Podgląd widoku użytkownika na dole strony (W5)

- Sekcja `Podgląd widoku użytkownika` na całą szerokość, zwijana (stan zapamiętany).
- Rysuje ją **ta sama funkcja**, która rysuje prawdziwy widok użytkownika — te same znaczniki, klasy i style. W odróżnieniu od dziś podgląd pokazuje także `Loop`, bo ma wyglądać i działać jak widok bez `?admin=1`.
- Nawigacja w podglądzie działa; domyślnie podgląd **podąża za listą edytowaną** (przełącznik).
- Przełącznik szerokości: `Komputer` (pełna), `Tablet` (820 px), `Telefon` (390 px). Żeby układ w ramce reagował na szerokość ramki, a nie okna, style widoku użytkownika przechodzą z `@media` na zapytania kontenerowe (`container-type: inline-size` i `@container`). Progi trzeba przeliczyć o marginesy strony, żeby prawdziwy widok łamał się dokładnie tak jak dziś.
- Odnośnik `Otwórz prawdziwy widok w nowej karcie ↗` — do końcowego sprawdzenia na zapisanych danych.
- Dlaczego nie ramka `<iframe>` z prawdziwą stroną: drugie połączenie z Firebase i drugi App Check, bramka hasła wewnątrz ramki, osobny silnik dźwięku. Wspólna funkcja rysująca daje ten sam wygląd bez tych kosztów, a odnośnik zostaje do sprawdzenia „na żywo”.

### 6.8 Responsywność

| Szerokość | Układ panelu admina |
| --- | --- |
| ≥ 1280 px | trzy kolumny: foldery ok. 260 px, katalog elastyczny, listy ok. 400 px; strona w trybie admina szersza niż dziś (np. `max-width: 1600px`), widok użytkownika bez zmian |
| 1024-1279 px | foldery jako szuflada; katalog i listy obok siebie |
| 720-1023 px | zakładki `Katalog` / `Listy`; foldery jako szuflada |
| < 720 px | zakładki `Katalog` / `Listy` / `Podgląd`; wiersze w dwóch liniach; elementy dotykowe min. 40 px; przeciąganie tylko za uchwyt |

### 6.9 Wygląd

- Paleta modułu bez zmian (`--panel`, `--border`, `--text`, `--accent`, `--danger`, font `Fira Code`), nowa rodzina niebieska tylko dla filtrów (rozdz. 6.3.3).
- Lista wybrana do edycji: obramowanie `--accent-strong`, tło `rgba(22, 198, 12, 0.25)` — jak aktywny przycisk nawigacji użytkownika (`:571-576`).
- Miejsce upuszczenia przy przeciąganiu: przerywane obramowanie `rgba(22, 198, 12, 0.6)`; uchwyt `⠿` w kolorze `--muted`.
- Wszystkie zmiany wyglądu trzeba opisać w `DetaleLayout.md` (sekcja „Moduł — Audio”).

---

## 7. Widok użytkownika po zmianie

- Nawigacja: najpierw lista główna (jej nazwa), potem listy ulubionych w ustalonej kolejności.
- Kafelek: `Nazwa (alias z tej listy) (N)`; ten sam dźwięk na innej liście pokazuje swój alias.
- Bez zmian: kliknięcie nazwy odtwarza, `Loop`, suwak głośności, `Odblokuj archiwum`, bramka i `Pomiń`.
- Poprawka P12: odtwarzacze przypisane do stałego klucza (rozdz. 9.5), więc zmiana przychodząca z bazy w trakcie sesji nie „gubi” grającej pętli — po przerysowaniu kafelek odzyskuje stan i daje się zatrzymać.
- Gdy oglądana lista zostanie usunięta na innym urządzeniu, widok wraca do listy głównej.

---

## 8. Wersje językowe

- Język domyślny: polski. Wszystkie nowe teksty (drzewo, katalog, listy, edytor, podgląd, narzędzia, komunikat migracji, dymki filtrów) w `translations.pl` i `translations.en`.
- **Jeden** przełącznik języka w górnym pasku wspólnym dla obu trybów (poza sekcjami `admin-only` i `user-only`, jak plakietka trybu pracy), ukryty klasą `language-switcher--hidden`. Aby go pokazać — usunąć klasę w jednym miejscu (dziś w dwóch, P13).
- Rekomendacja: atrybuty `data-i18n`, `data-i18n-placeholder`, `data-i18n-title` zamiast kilkudziesięciu ręcznych przypisań w `applyLanguage()` (`:1077-1127`) — ten wzorzec działa już w GeneratorNPC i skaluje się z liczbą nowych tekstów.
- Nazwa listy głównej pusta w danych = tłumaczona przy wyświetlaniu. Nazwy pozostałych list są danymi i się nie tłumaczą (dziś domyślna lista „Ulubione” zapisuje się jako polski tekst na stałe — `defaultFavorites()`, `:2047-2055`).
- Reguła `foldPolish` jest napisana dla polskiego; przy trzecim języku trzeba by dodać jego znaki nierozkładalne (uwaga z `DataVault/app.js`).

---

## 9. Zmiany techniczne w kodzie

### 9.1 Struktura plików

Rekomendacja: podzielić `Audio/index.html` (dziś 3854 wiersze) na `Audio/index.html` (znaczniki), `Audio/style.css` i `Audio/app.js` (moduł ES) — tak jak w `DataVault`. Przebudowa doda kilkaset wierszy logiki i stylów; w jednym pliku stałby się on trudny w utrzymaniu. Ścieżki `../shared/...` i `config/firebase-config.js` bez zmian; odnośnik z `Main/index.html` (`../Audio/index.html`) bez zmian.

### 9.2 Warstwa danych

Jeden zestaw funkcji dla wszystkich list (zastępuje zdublowane funkcje widoku głównego i ulubionych):

| Funkcja | Rola |
| --- | --- |
| `normalizeSettingsV2(raw)` | Pilnuje reguł z rozdz. 5.2; wywołuje migrację dla v1. |
| `migrateV1ToV2(raw)` | Rozdz. 5.3. |
| `toLegacyProjection(playlists)` | Rozdz. 5.4. |
| `getMainList()`, `getList(listId)` | Dostęp do list. |
| `createList(name)`, `renameList(listId, name)`, `duplicateList(listId)`, `removeList(listId)`, `moveList(listId, toIndex)` | Operacje na listach; `moveList` nie pozwala na indeks 0. |
| `addEntries(listId, itemIds)`, `removeEntry(listId, itemId)`, `moveEntry(listId, fromIndex, toIndex)` | Operacje na wpisach. |
| `setEntryAlias(listId, itemId, alias)`, `clearListAliases(listId)`, `clearAllAliases()` | Aliasy per wpis. |
| `buildMembershipIndex()` | `Map<itemId, [{ listId, alias }]>` — dla znaczników w katalogu i linii „Na innych listach”. |

Każda operacja kończy się `persistAndRender()` — obecny mechanizm zapisu z zejściem na pamięć lokalną i paskiem komunikatów (`:1943-2045`) zostaje bez zmian w zasadzie działania, zmienia się tylko zapisywany ładunek.

### 9.3 Bezpieczeństwo treści (P11)

Funkcja `escapeHtml()` stosowana do każdego tekstu z danych (nazwa, alias, nazwa listy, nazwa pliku, nazwa folderu) wstawianego przez `innerHTML`, także w atrybutach — albo budowanie elementów przez `textContent`. To zmiana o najwyższym priorytecie spośród technicznych, bo dokument ustawień jest zapisywalny dla każdego.

### 9.4 Renderowanie

- `renderAllViews()` rozbite na `renderStatus`, `renderTree`, `renderCatalog`, `renderLists`, `renderEditor`, `renderPreview`, `renderUserView`; zmiana wywołuje tylko potrzebne części, łączone w jedną klatkę przez `requestAnimationFrame`. Usuwa to podwójne przerysowanie katalogu (P5).
- Po dodaniu dźwięku do listy katalog aktualizuje tylko znaczniki przynależności, bez przebudowy wierszy.
- Zmiana z bazy nie może skasować tekstu wpisywanego właśnie w pole aliasu: pole z fokusem jest pomijane przy przerysowaniu (albo ignorowane jest echo własnego zapisu przez `snapshot.metadata.hasPendingWrites`).

### 9.5 Odtwarzanie (P12)

- `activePlayers` przypisane do stałego klucza `kontekst|listId|itemId` zamiast do elementu DOM.
- Po każdym przerysowaniu kod przywraca klasy `is-playing` / `is-looping` i napis przycisku dla kluczy, które grają.
- Wartość suwaka głośności pamiętana w pamięci pod tym samym kluczem, żeby przerysowanie nie zmieniało głośności grającego dźwięku.

### 9.6 Przeciąganie

Rekomendacja: biblioteka SortableJS 1.15 (licencja MIT) ładowana z `cdn.jsdelivr.net` na żądanie, wyłącznie w panelu admina — tym samym wzorcem co `ensureJSZip()` (`:2826-2852`). Obsługuje mysz i dotyk, uchwyty, blokadę pozycji (lista główna). Gdy biblioteka się nie wczyta, zostają strzałki ▲▼ ⤒⤓ — panel działa dalej. Własna implementacja na zdarzeniach wskaźnika jest możliwa, ale to kilkaset wierszy kodu i znane pułapki na tabletach (por. `Analizy/gilead-nawigacja-mapy-pwa-tablet-2026-09-21.md`).

### 9.7 Co musi zostać bez zmian

- generator XLSX i cała logika `id` (rozdz. 2);
- bramka, sesja, `Pomiń`, komunikaty bramki;
- integracja ze `shared/firebase-write-status.js` (`scopeKey: "audio.settings"`), App Check, zasada „czerwień wyłącznie dla błędów” w pastylkach;
- losowanie wariantów, `Loop`, zakres suwaka `-100..100` i przeliczenie na wzmocnienie.

### 9.8 Stan interfejsu (tylko dla danej przeglądarki)

- `localStorage` `audio.admin.ui`: zwinięcie panelu folderów, rozwinięte foldery, lista edytowana, szerokość i zwinięcie podglądu.
- `sessionStorage` `audio.admin.filters`: wykluczone foldery, frazy wyszukiwania, zakres katalogu — jak Filtr Globalny w DataVault (utrzymuje się w karcie, znika w nowej).
- Każdy odczyt i zapis w `try/catch`; brak pamięci nie może blokować panelu.

---

## 10. Gdzie zmienić hasło

W repozytorium są **dwa niezależne hasła**. Żadne z nich nie jest zapisane w kodzie ani w dokumentacji — i nie powinno być (`AGENTS.md`, rozdz. 12). Zmiana hasła **nie wymaga żadnej zmiany w repozytorium ani commita**.

### 10.1 Moduł Audio — Litania Dostępu do archiwum dźwięków

Hasło to sekret `GROUP_PASSWORD` w Cloudflare Worker o nazwie `audio-gate` — tym, którego adres stoi w stałej `AUDIO_GATE_BASE` (`Audio/index.html:1195`). Porównanie odbywa się w `handleLogin()` (`Audio/worker/audio-gate.js:255`).

**W panelu Cloudflare:**

1. Zaloguj się na `https://dash.cloudflare.com` na konto, na którym działa Worker.
2. Wejdź w `Workers & Pages` (w nowszym menu bywa to `Compute (Workers)`) i wybierz `audio-gate`.
3. Otwórz `Settings` → `Variables and Secrets`.
4. Przy `GROUP_PASSWORD` (typ `Secret`) wybierz edycję, wpisz nowe hasło i zapisz (`Save` / `Deploy`). Sekretu nie da się odczytać — można go tylko nadpisać.

Nazwy pozycji menu Cloudflare zmieniają się co jakiś czas; szukaj zawsze Workera `audio-gate` i jego zmiennych.

**Albo z wiersza poleceń** (w folderze projektu Workera): `npx wrangler secret put GROUP_PASSWORD` i wklejenie nowego hasła.

**Sprawdzenie:** adres `<AUDIO_GATE_BASE>/health` powinien zwracać `"hasPassword": true` (nie ujawnia hasła). Potem otwórz moduł w oknie prywatnym — nowe hasło ma działać, stare ma dawać „Litania Dostępu została odrzucona”.

**Ważne — urządzenia już odblokowane pozostaną odblokowane.** Sesja jest bezterminowa i podpisana kluczem `SIGNING_KEY`, a nie hasłem (`createSessionToken()`, `exp: null`). Jeżeli wszyscy mają podać nowe hasło, zmień dodatkowo `SIGNING_KEY` na nową, długą losową wartość (np. wygenerowaną menedżerem haseł, co najmniej 32 znaki). Wtedy każde urządzenie zobaczy „Sesja wygasła. Podaj hasło ponownie.”, a trwające odtworzenie z archiwum może się raz przerwać. `GITHUB_TOKEN` i `ALLOWED_ORIGIN` zostaw bez zmian.

Hasło w Audio jest porównywane dokładnie, znak w znak — spacja na początku lub końcu jest jego częścią.

### 10.2 Moduły DataVault i GeneratorNPC — ich własna Litania Dostępu

To inny mechanizm i inne hasło: konto techniczne w Firebase Authentication projektu `wh40k-data-slate`. Moduły logują się adresem e-mail ze stałej `window.WG_DATA_ACCESS_EMAIL` (`shared/firebase-config.js`) i hasłem wpisanym w bramce (`loginWithGroupPassword()`, `shared/firebase-data-loader.js:95-102`).

1. Konsola Firebase → projekt `wh40k-data-slate` → `Authentication` → `Users`.
2. Przy koncie technicznym: menu `⋮` → `Reset password` — Firebase wyśle na ten adres e-mail odnośnik do ustawienia nowego hasła (działa tylko, jeżeli skrzynka istnieje i masz do niej dostęp).
3. Jeżeli skrzynki nie ma: jednorazowy skrypt z pakietem `firebase-admin` i kontem serwisowym — `getAuth().updateUser(uid, { password: "…" })`. Pliku konta serwisowego nie wolno commitować.

**Nie usuwaj i nie zakładaj konta na nowo.** Identyfikator konta (`uid`) jest wpisany na sztywno w regułach Realtime Database (`shared/rtdb-wh40k-data-slate.rules.json`); nowe konto dostałoby inny `uid` i DataVault przestałby czytać dane mimo poprawnego hasła.

Po zmianie hasła Firebase unieważnia dotychczasowe sesje — urządzenia poproszą o nowe hasło najpóźniej po wygaśnięciu bieżącego tokenu (ok. godziny). Moduł przycina hasło z obu stron, więc nie zaczynaj ani nie kończ go spacją.

Hasła Audio i DataVault/GeneratorNPC są niezależne; zmiana jednego nie zmienia drugiego.

---

## 11. Instrukcja użytkownika bez nazw z repozytorium prywatnego

### 11.1 Gdzie dziś występują nazwy z repozytorium prywatnego

| Plik | Wiersze | Co zawiera |
| --- | --- | --- |
| `Audio/docs/README.md` (PL) | 236 | przykładowa nazwa pliku chronionego w opisie kolumny `NazwaPliku` |
| `Audio/docs/README.md` (PL) | 285 | przykładowy folder chroniony w „Wariant A” |
| `Audio/docs/README.md` (PL) | 299-301 | nazwa dźwięku, nazwa pliku i adres folderu chronionego w tabeli „Krok 2” |
| `Audio/docs/README.md` (PL) | 338-339 | nazwa folderu najwyższego poziomu i folderu chronionego w regułach tagów oraz słowa wycinane z nazw folderów |
| `Audio/docs/README.md` (EN) | 832, 881, 895-897, 934-935 | te same miejsca w wersji angielskiej |
| `Audio/docs/Documentation.md` | 494, 1442 | wartości stałej `TAG_IGNORE_FRAGMENTS` |
| `Audio/index.html` | 1166-1171 | stała `TAG_IGNORE_FRAGMENTS` (kod — potrzebna generatorowi) |
| `Audio/index.html` | 3032-3033 | komentarz z nazwą folderu najwyższego poziomu repozytorium prywatnego |

Nazwa repozytorium `AudioRPG` zostaje: to nie jest nazwa pliku ani folderu z treścią, tylko nazwa, od której zależy kod (`BUILDER_PROTECTED_PREFIX`, `TAG_IGNORE_SEGMENTS`) i instrukcja kopiowania manifestu.

### 11.2 Proponowane zamienniki (do naniesienia przy aktualizacji README)

Przykłady publiczne pochodzą z `Audio/AudioManifest.json` (warstwa demo, repozytorium `AudioExample`), placeholdery — z promptu.

| Miejsce | Obecnie | Zamiennik PL | Zamiennik EN |
| --- | --- | --- | --- |
| opis kolumny `NazwaPliku` | nazwa pliku chronionego | `MeltagunReload.ogg` | `MeltagunReload.ogg` |
| „Wariant A”, folder | folder chroniony | `PrivateFolder/PrivateSubFolder/` | `PrivateFolder/PrivateSubFolder/` |
| „Krok 2”, `NazwaSampla` (wariant A) | nazwa dźwięku chronionego | `Przykładowy dźwięk` | `Example Sound` |
| „Krok 2”, `NazwaPliku` (wariant A) | nazwa pliku chronionego | `PrivateSound.ogg` | `PrivateSound.ogg` |
| „Krok 2”, `LinkDoFolderu` (wariant A) | adres folderu chronionego | `https://cutelittlegoat.github.io/AudioRPG/PrivateFolder/PrivateSubFolder` | jak w PL |
| reguły tagów, pierwszy punkt | nazwa folderu najwyższego poziomu | „…dlatego dźwięki chronione zaczynają drzewo od pierwszego folderu wewnątrz repozytorium (w przykładzie `PrivateFolder`), a nie od nazwy repozytorium” | „…which is why protected sounds start their tree at the first folder inside the repository (`PrivateFolder` in the example) rather than at the repository name” |
| reguły tagów, drugi punkt | słowa wycinane z nazw i przykład folderu chronionego | „z nazw folderów wycinane są niektóre dopiski techniczne (ich listę zna administrator techniczny — stała `TAG_IGNORE_FRAGMENTS` w kodzie). Jeżeli tag jest krótszy niż nazwa folderu, to działa właśnie ta reguła” | „some technical suffixes are stripped from folder names (the technical admin knows the list — the `TAG_IGNORE_FRAGMENTS` constant in the code). If a tag is shorter than its folder name, this is the rule at work” |

Wariant B (publiczny) w tabeli „Krok 2” zostaje: `Bolter Reload Fast`, `BolterReloadFast.ogg`, `https://cutelittlegoat.github.io/AudioExample/WH40k_Boltgun/Boltgun` — to przykład nowego, publicznego dźwięku i nie ujawnia niczego chronionego.

`Documentation.md`: w miejscach 494 i 1442 odwołać się do stałej `TAG_IGNORE_FRAGMENTS` bez wypisywania jej wartości. Komentarz w `index.html:3032-3033` — zamienić na placeholder (`https://host/AudioRPG/PrivateFolder/...` → `PrivateFolder/...`). Sama stała w kodzie musi zostać, bo korzysta z niej generator — patrz decyzja D8.

---

## 12. Decyzje do podjęcia przed wdrożeniem

| # | Pytanie | Rekomendacja | Alternatywa |
| --- | --- | --- | --- |
| D1 | Jak wyświetlać alias? | Jak dziś: `Nazwa (alias)`, alias jaśniejszy. | Alias jako główny tytuł kafelka, nazwa z manifestu drobniej pod spodem. |
| D2 | Czy nazwę listy głównej można zmieniać? | Tak; pusta = „Widok główny” / „Main view”. | Nazwa stała, tylko tłumaczona. |
| D3 | Czy wolno usunąć wszystkie listy ulubionych? | Tak — lista główna zawsze istnieje. | Jak dziś: usunięcie ostatniej tworzy pustą listę „Ulubione”. |
| D4 | Czy ten sam dźwięk może być dwa razy na jednej liście (np. z dwoma aliasami)? | Nie, jak dziś. | Tak — wpis dostaje własny identyfikator; więcej zmian w kodzie. |
| D5 | Co z aliasami dźwięków, które nie są na żadnej liście? | Kopia w `legacyV1`, bez wyświetlania; liczba w komunikacie migracji. | Podpowiedź aliasu przy dodawaniu takiego dźwięku do listy. |
| D6 | Jak długo utrzymywać projekcję v1 (rozdz. 5.4)? | Przez okres przejściowy (np. 2-4 tygodnie), potem usunąć razem z `legacyV1`. | Na stałe. |
| D7 | Przeciąganie: SortableJS z CDN czy własny kod? | SortableJS na żądanie + strzałki jako zapas. | Własna implementacja na zdarzeniach wskaźnika. |
| D8 | Wartości `TAG_IGNORE_FRAGMENTS` w publicznym kodzie. | Zostawić w kodzie, usunąć z README i Documentation. | Przenieść listę do prywatnego arkusza XLSX (np. drugi arkusz „Ustawienia”) — wymaga rozszerzenia czytnika XLSX o drugi arkusz; tagi nie wpływają na `id`, więc zapisane listy są bezpieczne. |
| D9 | Czy podzielić `index.html` na `app.js` i `style.css`? | Tak. | Zostawić jeden plik. |
| D10 | Czy dodać `Eksportuj ustawienia (JSON)`? | Tak (i opcjonalnie `Importuj`). | Bez eksportu — kopią zostaje tylko `legacyV1`. |

---

## 13. Zakres prac — pliki i etapy

### 13.1 Pliki

| Plik | Zmiana |
| --- | --- |
| `Audio/index.html` | nowy układ panelu admina i podglądu; jeden przełącznik języka; (D9) znaczniki bez stylów i skryptu |
| `Audio/app.js` *(nowy, D9)* | cała logika, model v2, migracja, drzewo, katalog, listy, edytor, podgląd, odtwarzanie z kluczami |
| `Audio/style.css` *(nowy, D9)* | style modułu, rodzina niebieska, zapytania kontenerowe widoku użytkownika |
| `Audio/docs/README.md` | przepisane rozdziały o panelu admina, aliasach, listach, kolejności, podglądzie, filtrach; zamienniki z rozdz. 11.2 |
| `Audio/docs/Documentation.md` | model v2, migracja, projekcja, nowe funkcje, drzewo, filtry, odtwarzanie, struktura plików, procedura odtworzenia, testy |
| `DetaleLayout.md` | sekcja „Moduł — Audio” (i wiersz tabeli przełączników języka) |
| `Audio/worker/audio-gate.js`, manifesty, `shared/*`, reguły Firebase | **bez zmian** |

Wszystkie nowe fragmenty kodu z komentarzami PL/EN (`AGENTS.md`, rozdz. 7); przy okazji usunięcie komentarzy opisujących nieistniejące zachowanie (rozdz. 16).

### 13.2 Etapy

1. **Model danych** — v2, migracja, projekcja, normalizacja, `escapeHtml`, odtwarzacze z kluczami. Widok użytkownika pokazuje aliasy z list. Panel admina na tym etapie może jeszcze mieć stary układ z edycją aliasu w panelu listy.
2. **Panel admina** — nagłówek i narzędzia, drzewo folderów z wyszukiwaniem i sygnałem, katalog wierszowy z zaznaczaniem wielu pozycji, panel list, edytor z aliasami i przeciąganiem.
3. **Podgląd** — wspólna funkcja rysująca, zapytania kontenerowe, szerokości urządzeń.
4. **Języki i dokumentacja** — `data-i18n`, komplet tłumaczeń, README, Documentation, DetaleLayout.
5. **Testy** — rozdz. 14, w tym ręczne na telefonie i tablecie.

Etapy można wdrożyć w jednej gałęzi, ale kolejność ma znaczenie: etap 1 musi być gotowy i sprawdzony na kopii danych, zanim cokolwiek zapisze dokument w formacie v2.

---

## 14. Plan testów

### 14.1 Scenariusze z promptu

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Alias per lista | Dodaj dźwięk X do Playlisty01 (bez aliasu), Playlisty02 (alias X2), Playlisty03 (alias X3). | W widoku użytkownika: `X` na 01, `X (X2)` na 02, `X (X3)` na 03. Zmiana aliasu na 02 nie zmienia 03. |
| Hierarchia tagów | Odznacz wszystko, rozwiń drzewo, zaznacz jeden podfolder. | Katalog pokazuje dźwięki tego podfolderu; przodkowie mają stan ◩. |
| Folder z własnymi dźwiękami i podfolderem | Odznacz sam podfolder takiego folderu. | Dźwięki leżące bezpośrednio w folderze zostają widoczne; folder ma stan ◩. |
| Wyszukiwanie folderów | Wpisz fragment nazwy wielkimi literami i bez polskich znaków. | Drzewo pokazuje pasujące foldery z przodkami; etykieta `Szukaj folderu` świeci na niebiesko, dymek podaje frazę. Sama spacja niczego nie zapala. |
| Sygnał filtra katalogu | Odznacz jeden folder i zwiń panel folderów. | Szyna panelu ma niebieską kropkę, nad wynikami „Foldery: N z M” na niebiesko. |
| Ukrycie panelu | Zwiń panel, odśwież stronę. | Panel pozostaje zwinięty. |
| Podgląd | Zmień alias i kolejność na liście edytowanej. | Podgląd na dole pokazuje zmianę od razu; `Telefon` pokazuje układ jednokolumnowy; `Loop` działa. |
| Nazwy list | Dwuklik na nazwie, zmiana, `Enter`; potem `Esc` przy kolejnej edycji. | Pierwsza zmiana zapisana, druga anulowana. |
| Lista główna | Spróbuj przeciągnąć listę ulubionych przed listę główną; spróbuj usunąć listę główną. | Oba działania niemożliwe. |
| Kolejność wpisów | Przeciągnij wpis z pozycji 10 na 2 (mysz i palec). | Jedna zmiana, jeden zapis; kolejność w widoku użytkownika taka sama. |
| Kolejność list | Przeciągnij listę z końca na pozycję 2. | Nawigacja użytkownika w nowej kolejności, lista główna pierwsza. |
| Język | Tymczasowo usuń `language-switcher--hidden`, przełącz na EN. | Wszystkie nowe teksty po angielsku; nazwa listy głównej przetłumaczona, nazwy pozostałych list bez zmian. Domyślnie PL. |

### 14.2 Migracja i zgodność

| Test | Oczekiwany wynik |
| --- | --- |
| Dokument v1 z aliasami na kilku listach i aliasem dźwięku spoza list | Po migracji każda lista wygląda identycznie jak przed nią; komunikat podaje liczby; `legacyV1` zawiera pełną kopię. |
| Pusty dokument / brak dokumentu | Powstaje lista główna, zero list ulubionych (D3). |
| `localStorage` v1 i stary klucz `audio.favorites` | Migracja jak dla Firestore. |
| Stara wersja strony czyta dokument v2 | Widzi listy i kolejność. |
| Stara wersja strony zapisuje zmianę | Nowa wersja po odczycie odtwarza listy z projekcji; żadna lista nie znika. |
| Archiwum zablokowane w panelu admina | Wpisy z archiwum widoczne jako „(brak w manifeście)”; po dowolnej zmianie i zapisie nadal są w dokumencie razem z aliasami. |

### 14.3 Regresja

- Bramka: start bez sesji, `Pomiń`, `Odblokuj archiwum`, kliknięcie wpisu spoza manifestu, wygaśnięcie sesji — jak w obecnych testach kontrolnych (`Documentation.md`, „Testy kontrolne”).
- Generator XLSX: manifesty z niezmienionego arkusza identyczne z obecnymi (dowód, że logika `id` nie została ruszona).
- Pasek i plakietka zapisu: odmowa zapisu, brak sieci, ostrzeżenie o nadpisaniu — wszystkie operacje na listach i aliasach przechodzą przez `persistAndRender()`.
- Bezpieczeństwo treści: alias `<b>x</b>"` i nazwa listy z `<img src=x onerror=alert(1)>` wyświetlają się dosłownie, nic się nie wykonuje.
- Odtwarzanie przy zmianie z bazy: telefon gra pętlę, laptop zmienia nazwę listy — pętlę na telefonie da się zatrzymać jednym kliknięciem.
- Wydajność: manifest pełny (po odblokowaniu archiwum) — wpisanie frazy i dodanie dźwięku do listy bez zauważalnego opóźnienia.
- Telefon i tablet: zakładki, szuflada folderów, przeciąganie za uchwyt, podgląd.

---

## 15. Ryzyka

| Ryzyko | Prawdopodobieństwo | Skutek | Ograniczenie |
| --- | --- | --- | --- |
| Stara strona nadpisuje dokument v2 | średnie w okresie przejściowym | utrata rozróżnienia aliasów | projekcja v1 (5.4), `Ctrl+F5` na wszystkich urządzeniach, eksport JSON przed wdrożeniem |
| Błąd migracji | niskie | listy lub aliasy w złym miejscu | `legacyV1` w dokumencie, eksport JSON, testy 14.2 na kopii danych |
| Usunięcie wpisów archiwum przy zablokowanym dostępie | niskie, jeżeli reguła 5.2.6 jest pilnowana | utrata części list | test w 14.2; normalizacja nigdy nie filtruje po manifeście |
| Zapis z dwóch urządzeń jednocześnie | jak dziś | nowszy zapis wygrywa w całości | bez zmian względem dziś; rozwiązanie wymaga osobnych dokumentów i zmiany reguł (5.6) |
| Tryb admina dostępny dla każdego, kto dopisze `?admin=1`; dokument otwarty do zapisu (`allow read, write: if true`) | istniejące | każdy może zmienić listy | poza zakresem; `escapeHtml` (9.3) usuwa najgroźniejszy skutek; pełna ochrona wymaga logowania albo zapisu przez Workera |
| Biblioteka przeciągania nie wczyta się z CDN | niskie | brak przeciągania | strzałki jako zapas (9.6) |
| Zapytania kontenerowe zmienią progi łamania prawdziwego widoku | średnie | inny układ niż dziś przy niektórych szerokościach | przeliczenie progów o marginesy, test porównawczy na 3-4 szerokościach |
| Rozrost kodu i dokumentacji | pewne | dłuższe wdrożenie | etapy 13.2, podział plików (D9) |

---

## 16. Znalezione przy okazji

- `Audio/index.html:2648-2656` — komentarz twierdzi, że manifesty generuje `Audio/tools/build-manifests.mjs`. Tego pliku nie ma; generator działa w przeglądarce (co potwierdza `Documentation.md`). Komentarz opisuje nieistniejące zachowanie (`AGENTS.md`, rozdz. 7).
- `Audio/docs/Documentation.md`, „Procedura odtworzenia modułu” — numeracja kroków po 10 wraca do 7 (kroki 7-12 powtarzają numery).
- `Audio/docs/Documentation.md`, „Losowanie wariantów” — opisuje `pickRandomVariant(item, previousUrl)` zwracającą URL; kod zwraca obiekt wariantu i porównuje klucz wariantu (`:1547-1574`).
- `Audio/docs/README.md` — tabela „Statuses” w wersji EN nie ma wiersza `Builder`, który jest w PL; „Quick workflow” w EN ma w kroku 2 `Load manifest`, a PL `Odblokuj archiwum`.
- `DetaleLayout.md`, „Moduł — Audio” — opisuje fonty lokalne `Consolas…` (moduł ładuje `Fira Code` z Google Fonts i ma ją jako pierwszą w `--font`), `--radius: 10px` (w kodzie `12px`) i układ `width: min(860px, 100%)` (w kodzie `.page { max-width: 1280px }`).
- `Audio/index.html:3475-3480` — `Odśwież ulubione` bez działania przy aktywnym Firestore (P14).

Wszystkie te rozbieżności warto poprawić przy okazji przebudowy, bo i tak dotyczą przepisywanych fragmentów.

---

## 17. Rekomendacje

1. **Model v2 w tym samym dokumencie `audio/favorites`**, z polem `playlists`, listą główną jako `playlists[0]`, aliasem na wpisie, migracją zachowującą obecny wygląd i projekcją v1 na okres przejściowy. Bez zmiany reguł Firebase i bez ponownego generowania manifestów.
2. **Panel admina jako warsztat w trzech kolumnach** z „listą edytowaną”: drzewo folderów z zaznaczaniem trójstanowym i wyszukiwaniem `foldPolish`, katalog wierszowy z `[+]` i zaznaczaniem wielu pozycji, panel list z przypiętą listą główną, edytor z aliasem przy każdym wpisie i przeciąganiem.
3. **Niebieski sygnał filtra przeniesiony 1:1 z DataVault** — te same zmienne, ta sama reguła „świeci tylko, gdy faktycznie zawęża”, dymek z frazą.
4. **Zamiast chowania panelu tagów — zwijana kolumna boczna z pamięcią stanu i kropką aktywnego filtra**, szuflada na węższych ekranach.
5. **Podgląd rysowany tą samą funkcją co widok użytkownika**, z `Loop`, przełącznikiem szerokości i zapytaniami kontenerowymi.
6. **Poprawki bezpieczeństwa i niezawodności w pierwszym etapie**: `escapeHtml` i odtwarzacze przypisane do stałych kluczy.
7. **Jeden ukryty przełącznik języka** i atrybuty `data-i18n`.
8. **README bez nazw z repozytorium prywatnego** — zamienniki z rozdz. 11.2, niezależnie od terminu przebudowy.

---

## 18. Następne kroki

1. Rozstrzygnąć decyzje D1-D10 (rozdz. 12) — wystarczą same numery i wybór.
2. Przed wdrożeniem: zrobić kopię dokumentu `audio/favorites` (skopiować pola z konsoli Firebase albo, po wdrożeniu etapu 1, przyciskiem `Eksportuj ustawienia`).
3. Zlecić wdrożenie etapami z rozdz. 13.2; etap 1 sprawdzić na kopii danych albo w trybie lokalnym, zanim nowa wersja zapisze dokument w bazie.
4. Po wdrożeniu odświeżyć moduł z pominięciem pamięci podręcznej (`Ctrl+F5`) na każdym urządzeniu, które go używa.
5. Jeżeli hasło ma się zmienić: postąpić według rozdz. 10 — w Audio rozważyć jednoczesną zmianę `SIGNING_KEY`, w DataVault nie usuwać konta technicznego.
6. Poprawkę README z rozdz. 11 można zlecić od razu jako osobną, małą zmianę — nie zależy od przebudowy.

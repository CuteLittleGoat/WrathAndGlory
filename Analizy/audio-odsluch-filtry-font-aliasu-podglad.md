# Audio — dźwięk grający po zdjęciu filtrów, rozmiar fontu aliasu i domyślnie zwinięty podgląd — analiza i propozycje naprawy

> **Data:** 25 października 2026
> **Moduł:** `Audio` (panel admina `Audio/index.html?admin=1` i widok użytkownika `Audio/index.html`)
> **Stan kodu:** commit `a667dd7` (gałąź `main`)
> **Charakter dokumentu:** analiza działania i propozycje naprawy. **Kod aplikacji nie został zmieniony.** Dane w aplikacji (listy ulubionych i aliasy w Firestore) nie były odczytywane, zmieniane ani usuwane — testy odbyły się na lokalnej kopii strony z odłączonym Firebase (rozdz. 4.2).

---

## Spis treści

1. [Prompty użytkownika (zachowane w całości)](#1-prompty-użytkownika-zachowane-w-całości)
2. [Zakres](#2-zakres)
3. [Podsumowanie](#3-podsumowanie)
4. [Jak działa odtwarzanie w panelu admina](#4-jak-działa-odtwarzanie-w-panelu-admina)
5. [Problem 1 — dźwięk gra dalej po zdjęciu filtra](#5-problem-1--dźwięk-gra-dalej-po-zdjęciu-filtra)
6. [Problem 2 — rozmiar fontu aliasu](#6-problem-2--rozmiar-fontu-aliasu)
7. [Problem 3 — podgląd domyślnie zwinięty](#7-problem-3--podgląd-domyślnie-zwinięty)
8. [Do czego służy pole „podąża za edytowaną listą”](#8-do-czego-służy-pole-podąża-za-edytowaną-listą)
9. [Decyzje do podjęcia](#9-decyzje-do-podjęcia)
10. [Pliki do zmiany przy wdrożeniu](#10-pliki-do-zmiany-przy-wdrożeniu)
11. [Plan testów po wdrożeniu](#11-plan-testów-po-wdrożeniu)
12. [Ryzyka](#12-ryzyka)
13. [Znalezione przy okazji](#13-znalezione-przy-okazji)
14. [Następne kroki](#14-następne-kroki)

---

## 1. Prompty użytkownika (zachowane w całości)

### 1.1 Prompt otwierający

> Zapoznaj się z modułem Audio w repo "WrathAndGlory".
>
> Zasadniczo wszystko działa. Po ostatnim update (Analizy/audio_aliasy.md) utworzyłem listy ulubionych.
> Nie kasuj już danych z aplikacji.
> Napotkałem jednak dwa drobne problemy.
>
> Przeprowadź analizę działania aplikacji oraz propozycje naprawy poniższych problemów. Analizę zapisz w Analizy/ jako nowy plik MD.
>
> 1. Brak wyciszenia w panelu admina.
> Kroki jakie wykonuję:
> 1.1 Wchodzę na stronę https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html?admin=1
> 1.2 Wpisuję w "Szukaj dźwięku" fragmentu nazwy pliku
> 1.3 Wyświetlana lista się zawęża (działanie prawidłowe)
> 1.4 Klikam ikonę do uruchomienia dźwięku. Dźwięk się odtwarza (działanie prawidłowe)
> 1.5 Usuwam wpisany fragment nazwy pliku (wpisane w punkcie 1.2). Wyświetla się cała lista (działanie prawidłowe)
>
> Jednakm jeżeli plik audio jest długi to po usunięciu filtrowania dalej on się odtwarza w tle.
> Trzeba wprowadzić jakieś zabezpieczenie, które sprawi, że jak zdejmuję filtry to plik się przestaje odtwarzać.
> Podobne zabezpieczenie można wprowadzić jak się zaznacza\odznacza checkboxy.
>
> 2. Font aliasów.
> Kolor aliasów (jaśniejszy font) jest ok. Zostawiamy jak jest. Chciałbym, żeby był jednak mniejszym fontem. Takim jak jest obecnie zapisany tag.
> Załączam przykładowy screen.
>
> "Text On Screen" - nazwa pliku - zostaje bez zmian.
> "(Infoczytnik)" - nadany alias - zmieniamy rozmiar fontu. Ma być tej wielkości co napis "Secret Agent".
> "Secret Agent" - nazwa tagu - zostaje bez zmian

Do promptu dołączone były dwa zrzuty ekranu: (1) pojedynczy kafelek „Text On Screen (Infoczytnik)” z tagiem „Secret Agent”, (2) widok użytkownika z zakładkami list i siatką kafelków z aliasami.

### 1.2 Doprecyzowania wysłane w trakcie pracy

> Trzecia uwaga:
> Z poziomu admina panel "Podgląd widoku użytkownika" (na dole strony) ma być domyślnie zwinięty.

> W analizie napisz mi też do czego służy checkbox "podąża za edytowaną listą"

> Kontynuuj pracę.

> Analizę wrzuć na Main.

---

## 2. Zakres

**Przeanalizowane pliki:** `Audio/app.js` (silnik odtwarzania, filtry katalogu, drzewo folderów, edytor listy, podgląd, stan interfejsu admina), `Audio/style.css` (typografia kafelka), `Audio/index.html` (sekcja podglądu), `Audio/docs/README.md`, `Audio/docs/Documentation.md`, `DetaleLayout.md` (sekcja „Moduł — Audio”), poprzednia analiza `Analizy/audio_aliasy.md`.

**W zakresie:** trzy zgłoszone problemy, opis pola „podąża za edytowaną listą”, propozycje zmian w kodzie i dokumentacji.

**Poza zakresem:** zmiana kodu (zostanie wykonana po decyzjach z rozdz. 9), dane w Firestore, model danych, generator manifestów, bramka dostępu.

**Ochrona danych:** żadna z proponowanych zmian nie dotyka dokumentu `audio/favorites` ani formatu danych (`schemaVersion: 2`, `playlists`). Listy ulubionych i aliasy przetrwają wdrożenie bez żadnych czynności po stronie użytkownika.

---

## 3. Podsumowanie

| # | Problem | Przyczyna | Proponowana naprawa | Skala zmiany |
| --- | --- | --- | --- | --- |
| 1 | Dźwięk z katalogu gra dalej po zdjęciu filtra lub odznaczeniu folderów | Odsłuch w katalogu jest celowo pomijany przy „sprzątaniu” odtwarzaczy (`pruneOrphanPlayers`), a zmiana filtrów niczego nie zatrzymuje | Każda zmiana filtra katalogu zatrzymuje odsłuch z katalogu; to samo dla wyszukiwania i zmiany listy w edytorze oraz dla zwinięcia podglądu; dodatkowo pływający przycisk „Zatrzymaj wszystko” | ok. 40–60 wierszy JS, kilka wierszy HTML/CSS |
| 2 | Alias na kafelku ma rozmiar nazwy (15 px) zamiast rozmiaru tagu (12 px) | `.sample-alias` dziedziczy rozmiar z `.tile-title` | `font-size: 12px` dla aliasu (wspólna zmienna z tagiem) | 3–4 wiersze CSS |
| 3 | Podgląd widoku użytkownika jest domyślnie rozwinięty | `previewCollapsed: false` i odczyt zapamiętanego stanu z pamięci przeglądarki | Podgląd zwinięty po każdym wejściu na stronę, bez pamiętania stanu | ok. 5–10 wierszy JS, 1 wiersz HTML |

**Obejście na dziś (bez zmian w kodzie):** przycisk `■ Zatrzymaj wszystko` w podglądzie widoku użytkownika zatrzymuje **wszystkie** dźwięki w panelu admina, także odsłuch z katalogu i edytora — o ile podgląd jest rozwinięty. Licznik w nawiasie pokazuje, ile dźwięków gra, również tych niewidocznych.

---

## 4. Jak działa odtwarzanie w panelu admina

### 4.1 Cztery miejsca odtwarzania

Każdy przycisk odtwarzania ma własny odtwarzacz przypisany do stałego klucza `kontekst|lista|dźwięk` (`makeKey`, `Audio/app.js:1464`). Dzięki temu przerysowanie widoku nie „gubi” grającego dźwięku: nowy przycisk z tym samym kluczem od razu pokazuje stan „gra” (`■`).

| Kontekst | Miejsce | Klucz | Kiedy dziś jest zatrzymywany automatycznie |
| --- | --- | --- | --- |
| `cat` | przycisk `▶` w katalogu dźwięków | `cat\|\|<dźwięk>` | **nigdy** — tylko kliknięciem `■`, końcem pliku albo `Zatrzymaj wszystko` |
| `ed` | przycisk `▶` w edytorze listy | `ed\|<lista>\|<dźwięk>` | gdy wpis zniknie z listy albo lista zostanie usunięta |
| `prev` | kafelek w podglądzie widoku użytkownika | `prev\|<lista>\|<dźwięk>` | jak `ed` |
| `user` | kafelek w prawdziwym widoku użytkownika (bez `?admin=1`) | `user\|<lista>\|<dźwięk>` | jak `ed` |

Automatyczne zatrzymywanie realizuje `pruneOrphanPlayers()` (`Audio/app.js:1724-1736`), wywoływane po każdej zmianie ustawień. Funkcja **celowo pomija kontekst `cat`** (`Audio/app.js:1727-1729`), bo odsłuch w katalogu nie jest związany z żadną listą.

`Zatrzymaj wszystko` (`stopAllPlayback`, `Audio/app.js:1719-1721`) zatrzymuje wszystkie konteksty naraz. W panelu admina ten przycisk istnieje tylko wewnątrz podglądu widoku użytkownika.

### 4.2 Odtworzenie problemu

Test wykonano w przeglądarce Chromium sterowanej skryptem (Playwright), na lokalnej kopii modułu serwowanej z repozytorium. Konfigurację Firebase zastąpiono w przeglądarce testowej pustą wartością, a połączenia z Firestore, App Check i bramką zablokowano — moduł pracował w trybie lokalnym, więc **nic nie zostało odczytane z bazy ani do niej zapisane**. Dane testowe (dwie listy z aliasami) istniały wyłącznie w pamięci jednorazowej przeglądarki. Warstwa publiczna manifestu (`Audio/AudioManifest.json`, 112 dźwięków) i pliki dźwiękowe były pobierane z GitHub Pages.

| Scenariusz | Wynik |
| --- | --- |
| A. „Szukaj dźwięku” = `shotgun` → katalog zawęża się do 14 wierszy → `▶` na pierwszym wierszu → wyczyszczenie pola | Katalog wraca do 112 wierszy, licznik `Zatrzymaj wszystko (1)` — **dźwięk gra dalej**. |
| B. `▶` w katalogu → `Odznacz wszystko` w panelu folderów | Katalog pusty (0 wierszy), licznik `(1)` — **dźwięk gra dalej, a jego przycisku nie ma na ekranie**. |
| C. Kafelek w podglądzie → `Zwiń podgląd` | Dźwięk gra dalej, a **na stronie nie ma już żadnego przycisku `Zatrzymaj wszystko`** (0 w DOM). Po ponownym rozwinięciu licznik pokazuje `(1)`. |
| D. `▶` w edytorze listy głównej → zmiana listy docelowej na inną | Edytor pokazuje inną listę, licznik `(1)` — **dźwięk z poprzedniej listy gra dalej bez widocznego przycisku**. |

Scenariusze C i D nie zostały zgłoszone, ale mają tę samą naturę co problem 1, a scenariusz C staje się częstszy po wdrożeniu problemu 3 (podgląd domyślnie zwinięty).

---

## 5. Problem 1 — dźwięk gra dalej po zdjęciu filtra

### 5.1 Przyczyna

1. Odsłuch w katalogu (`cat-play`, `Audio/app.js:4026-4028`) uruchamia odtwarzacz `cat||<dźwięk>`.
2. Zmiana filtrów tylko przerysowuje katalog — żadna z poniższych procedur nie zatrzymuje odtwarzania:
   - fraza „Szukaj dźwięku” — `Audio/app.js:3968-3973`,
   - „Pokaż” (wszystkie / spoza listy docelowej / z listy docelowej) — `Audio/app.js:3974-3979`,
   - „Warstwa” (wszystkie / demo / archiwum) — `Audio/app.js:3980-3985`,
   - pola wyboru folderów i przyciski `Zaznacz wszystko`, `Odznacz wszystko`, `Tylko ten folder`, `Zaznacz pasujące`, `Odznacz pasujące`, `Tylko pasujące` — wszystkie kończą się wspólną funkcją `onFolderFilterChanged()` (`Audio/app.js:2311-2316`).
3. Po przerysowaniu odtwarzacz nadal istnieje (`players`), a `pruneOrphanPlayers()` pomija kontekst `cat`.
4. Wiersz grającego dźwięku:
   - **znika** z ekranu, gdy nie spełnia nowego filtra albo gdy po zmianie filtra trafia poza pierwsze 200 wierszy (`state.catalogLimit` wraca do 200, `Audio/app.js:2728`) — dźwięku nie da się wtedy zatrzymać w katalogu;
   - **zostaje** gdzieś na długiej liście (w scenariuszu z promptu — po wyczyszczeniu frazy), z ikoną `■`, ale przy pełnym manifeście po odblokowaniu archiwum to jeden wiersz z setek i praktycznie nie da się go znaleźć.

Dlatego samo zatrzymywanie dźwięków, których wiersz zniknął, **nie rozwiązuje** zgłoszonego przypadku — po wyczyszczeniu frazy wiersz zwykle wciąż jest na liście. Potrzebna jest reguła oparta na samej zmianie filtra.

### 5.2 Wszystkie ścieżki, w których odsłuch „ginie z oczu”

| # | Czynność | Kontekst | Co się dzieje dziś | Propozycja |
| --- | --- | --- | --- | --- |
| S1 | Zmiana frazy „Szukaj dźwięku” (wpisanie, zmiana, usunięcie) | `cat` | gra dalej | **zatrzymać** (D1) |
| S2 | Pola wyboru folderów i przyciski zaznaczania w panelu folderów | `cat` | gra dalej | **zatrzymać** (D1) |
| S3 | Zmiana „Pokaż” albo „Warstwa” | `cat` | gra dalej | **zatrzymać** (D1) |
| S4 | `+` przy włączonym „Pokaż: spoza listy docelowej” (wiersz znika po dodaniu) albo `✓` przy „z listy docelowej” | `cat` | gra dalej | zatrzymać — siatka bezpieczeństwa (5.3, krok 3) |
| S5 | Zmiana frazy „Szukaj na liście” w edytorze | `ed` | gra dalej | **zatrzymać** (D2) |
| S6 | Zmiana listy edytowanej (panel list, „Lista docelowa”, zakładka w podglądzie) | `ed` | gra dalej bez przycisku | **zatrzymać** (D2) |
| S7 | `Zwiń podgląd` | `prev` | gra dalej, znika jedyny `Zatrzymaj wszystko` | **zatrzymać** (D9) |
| S8 | Zmiana zakładki Katalog / Listy / Podgląd na tablecie i telefonie | `cat`, `ed`, `prev` | gra dalej w ukrytym panelu | bez zmian — pływający przycisk (D3, D4) |
| S9 | Zmiana zakładki listy w podglądzie | `prev` | gra dalej, kropka `•` na zakładce, `Zatrzymaj wszystko` widoczny | bez zmian — tak samo jak w prawdziwym widoku użytkownika (decyzja D11 z `audio_aliasy.md`) |
| S10 | Zaznaczanie wierszy katalogu (pola wyboru przy wierszach, `Zaznacz wszystkie wyniki`, `Shift`/`Ctrl` + kliknięcie) | `cat` | gra dalej | bez zmian — zaznaczanie nie ukrywa wierszy (D5) |
| S11 | „Szukaj folderu” | — | zawęża tylko drzewo folderów, katalog się nie zmienia | bez zmian |
| S12 | `Pokaż kolejne 200` | `cat` | lista się wydłuża, nic nie znika | bez zmian |

### 5.3 Proponowana naprawa

**Reguła dla użytkownika:** odsłuch w katalogu i w edytorze dotyczy tego, co widać w danej chwili. Gdy zmieniasz to, co jest pokazane (filtr, foldery, lista w edytorze), odsłuch się zatrzymuje. Dźwięki z podglądu zatrzymują się przy zwinięciu podglądu.

**Krok 1 — pomocnicze funkcje zatrzymywania** (obok `stopAllPlayback`, `Audio/app.js:1719`):

```js
// --- Zatrzymanie dźwięków spełniających warunek / Stopping the sounds that match a condition ---
// PL: Wspólna podstawa dla zatrzymywania odsłuchu po zmianie filtrów i przy zwinięciu podglądu.
// EN: Shared basis for stopping auditions after a filter change and when the preview is collapsed.
const stopPlaybackWhere = (test) => {
  [...players.keys(), ...loadingKeys.keys()].forEach((key) => {
    if (test(key)) {
      stopPlayback(key);
    }
  });
};

// Odsłuch z katalogu / Catalogue audition
const stopCatalogAuditions = () => stopPlaybackWhere((key) => key.startsWith("cat|"));
// Odsłuch z edytora listy / List editor audition
const stopEditorAuditions = () => stopPlaybackWhere((key) => key.startsWith("ed|"));
// Dźwięki z podglądu widoku użytkownika / User view preview sounds
const stopPreviewPlayback = () => stopPlaybackWhere((key) => key.startsWith("prev|"));
```

`stopPlayback()` już dziś przerywa także start czekający na podpis bramki (licznik pokoleń), więc zatrzymanie działa również w stanie „wczytywanie…”.

**Krok 2 — zatrzymanie przy zmianie filtrów (S1–S3, S5, S6):**

| Miejsce | Zmiana |
| --- | --- |
| obsługa „Szukaj dźwięku” (`Audio/app.js:3968`) | Porównać frazę po normalizacji (`toNeedle`) przed i po zmianie; gdy się różni — `stopCatalogAuditions()`. Dopisanie spacji na końcu frazy niczego nie zatrzymuje, bo nie zmienia wyników. |
| `onFolderFilterChanged()` (`Audio/app.js:2311`) | `stopCatalogAuditions()` — jedno miejsce obejmuje wszystkie pola wyboru folderów i sześć przycisków zaznaczania. |
| obsługa „Pokaż” i „Warstwa” (`Audio/app.js:3974`, `:3980`) | `stopCatalogAuditions()`. |
| obsługa „Szukaj na liście” (`Audio/app.js:4136`) | Jak przy katalogu: przy zmianie znormalizowanej frazy — `stopEditorAuditions()`. |
| `setEditedList()` (`Audio/app.js:3052`) | Gdy lista faktycznie się zmienia (`changed`) — `stopEditorAuditions()`. |

**Krok 3 — siatka bezpieczeństwa: nie ma przycisku, nie ma dźwięku (S4 i przypadki nieprzewidziane):**

```js
// --- Odsłuch bez przycisku na stronie jest zatrzymywany / An audition without a button on the page is stopped ---
// PL: Wywoływane po przerysowaniu katalogu i edytora. Obejmuje przypadki, których nie da się przewidzieć
//     z góry: wiersz znika po dodaniu do listy przy filtrze „spoza listy docelowej”, zmiana przychodzi
//     z bazy, manifest zostaje wczytany ponownie. Podgląd jest pominięty, bo jego dźwięki z innych
//     zakładek mają grać dalej (kropka na zakładce), tak jak w prawdziwym widoku użytkownika.
// EN: Called after the catalogue and the editor are redrawn. Covers cases that cannot be foreseen: a row
//     disappears after being added under the "outside the target list" filter, a change arrives from the
//     database, the manifest is reloaded. The preview is skipped, because its sounds from other tabs must
//     keep playing (tab dot), just like in the real user view.
const stopDetachedAuditions = () => {
  stopPlaybackWhere(
    (key) => (key.startsWith("cat|") || key.startsWith("ed|")) && !findKeyElements(key).length
  );
};
```

Wywołanie: na końcu `renderCatalog()` (po `syncPlaybackIn(dom.catalogList)`, `Audio/app.js:2757`) i `renderEditor()` (po `syncPlaybackIn(dom.editorEntries)`, `Audio/app.js:2900`). Wiersz ukryty stylem (zakładki na tablecie i telefonie) nadal jest na stronie, więc ta funkcja go nie zatrzymuje — zgodnie z D4.

**Krok 4 — zwinięcie podglądu (S7):** w obsłudze `#previewToggle` (`Audio/app.js:4225`), gdy podgląd przechodzi w stan zwinięty — `stopPreviewPlayback()` przed `renderPreview()`.

**Krok 5 — pływający przycisk `■ Zatrzymaj wszystko (N)` w panelu admina (D3, S8):**

- Jeden przycisk w prawym dolnym rogu okna (`position: fixed`), widoczny **tylko wtedy, gdy coś gra** — w dowolnym miejscu panelu, przy dowolnym przewinięciu strony, przy zwiniętym podglądzie i w każdej zakładce na tablecie i telefonie.
- Ma klasę `stop-all`, więc istniejąca funkcja `updatePlaybackIndicators()` (`Audio/app.js:1668`) sama aktualizuje jego licznik i stan. Ukrywanie bez dodatkowego kodu: `.stop-all-float:disabled { display: none; }`.
- Kliknięcie: `stopAllPlayback()` — zatrzymuje wszystkie konteksty.
- Napis z istniejącego tłumaczenia `stopAll`; na telefonie sama ikona `■` i licznik (jak w pasku widoku użytkownika).
- Warstwa poniżej paska komunikatów zapisu (9000) i bramki (9999); na ekranach węższych niż 1024 px przycisk stoi wyżej, żeby nie zasłaniał przyklejonego do dołu paska „Zaznaczone: N”.

Przycisk jest siatką bezpieczeństwa dla wszystkiego, czego kroki 2–4 celowo nie zatrzymują (S8, S9), i dla dźwięków, których przycisk jest przewinięty poza ekran.

### 5.4 Czego nie zatrzymujemy

- **Zaznaczania wierszy katalogu** (S10) — pola wyboru przy wierszach służą do dodawania wielu dźwięków naraz i nie ukrywają niczego; słuchanie dźwięku w trakcie zaznaczania jest wygodne. W prompcie „zaznacza\odznacza checkboxy” odczytano jako pola wyboru **folderów** w panelu folderów (S2) — patrz D5.
- **„Szukaj folderu”** (S11) — zawęża tylko drzewo, katalog pozostaje bez zmian.
- **Zmiany zakładki listy w podglądzie** (S9) — tak samo jak w prawdziwym widoku użytkownika dźwięk gra dalej, a kropka `•` pokazuje, gdzie wrócić.
- **Prawdziwego widoku użytkownika** (bez `?admin=1`) — nie ma filtrów, a przełączanie zakładek ma nie przerywać dźwięków (decyzja D11 z `audio_aliasy.md`). Proponowane zmiany go nie dotyczą.

---

## 6. Problem 2 — rozmiar fontu aliasu

### 6.1 Stan obecny

| Element kafelka | Klasa | Rozmiar | Grubość | Kolor | Miejsce w kodzie |
| --- | --- | --- | --- | --- | --- |
| Nazwa („Text On Screen”) | `.tile-title` | 15 px | 600 | `--text` `#9cf09c` | `Audio/style.css:1394-1404` |
| Alias („(Infoczytnik)”) | `.sample-alias` wewnątrz `.tile-title` | **15 px (dziedziczony)** | 400 | `#d2fad2` | `Audio/style.css:333-336` |
| Licznik wariantów („(4)”) | `.group-count` wewnątrz `.tile-title` | 15 px (dziedziczony) | 400 | `--danger` `#ff5f5f` | `Audio/style.css:338-341` |
| Tag („Secret Agent”) | `.tile-tag` | **12 px** | 400 | `--muted` | `Audio/style.css:1406-1412` |

Alias jest wstawiany przez `buildTitleHtml()` (`Audio/app.js:584-587`) jako `<span class="sample-alias">` i występuje wyłącznie na kafelkach — w prawdziwym widoku użytkownika i w podglądzie panelu admina (ta sama funkcja rysująca). Katalog pokazuje same nazwy z manifestu, a edytor pokazuje alias w polu tekstowym, którego zmiana nie dotyczy.

Rozmiary są stałe na wszystkich szerokościach ekranu — zapytania `@container uv` i `@media` nie zmieniają ani `.tile-title`, ani `.tile-tag`.

### 6.2 Propozycja

Wspólna zmienna dla tagu i aliasu, żeby oba napisy zawsze miały ten sam rozmiar (wymaganie z promptu: „tej wielkości co napis Secret Agent”):

```css
:root {
  /* Rozmiar drobnych napisów kafelka: tag i alias / Size of small tile texts: tag and alias */
  --tile-meta-size: 12px;
}

.sample-alias {
  color: #d2fad2;          /* bez zmian / unchanged */
  font-weight: 400;        /* bez zmian / unchanged */
  font-size: var(--tile-meta-size);
}

.tile-tag {
  font-size: var(--tile-meta-size);   /* było 12px — wartość bez zmian / was 12px — value unchanged */
  /* pozostałe właściwości bez zmian / other properties unchanged */
}
```

Bez zmian: kolor aliasu, nawiasy, kolejność „Nazwa (alias) (N)”, dymek i etykiety dla czytników ekranu (zawierają pełny tekst), rozmiar nazwy i tagu.

### 6.3 Sprawdzenie i skutki

Zmianę sprawdzono w przeglądarce testowej, wstrzykując regułę `font-size: 12px` dla `.sample-alias` na kafelkach z danymi testowymi:

- „Boltgun Reload Full (Infoczytnik)” — alias przechodzi do drugiej linii w rozmiarze tagu, tak jak na załączonym zrzucie ekranu, tylko mniejszy;
- „Boltgun Fire (Seria karabinem maszynowym) (5)” — alias jest mniejszy i zajmuje mniej miejsca, więc długie aliasy rzadziej są ucinane limitem trzech wierszy.

Skutki uboczne:

- **Licznik `(N)` zostaje w rozmiarze nazwy** (15 px, czerwony). Przy dźwięku z wieloma wariantami i aliasem napis wygląda tak: duża nazwa, mały alias, duży czerwony licznik. To zgodne z promptem (zmienia się tylko alias), ale jest osobną decyzją (D6).
- Linia zawierająca sam alias zachowuje wysokość linii nazwy (ok. 19,5 px), bo o wysokości wiersza decyduje element nadrzędny. Odstęp między nazwą a aliasem jest przez to nieco większy niż między aliasem a tagiem — na zrzutach wygląda to naturalnie i nie wymaga korekty.
- Podgląd w panelu admina pokaże zmianę od razu, bo korzysta z tych samych stylów.

---

## 7. Problem 3 — podgląd domyślnie zwinięty

### 7.1 Stan obecny

| Element | Miejsce | Działanie |
| --- | --- | --- |
| Wartość początkowa | `Audio/app.js:736` | `previewCollapsed: false` — rozwinięty. |
| Odczyt zapamiętanego stanu | `restoreAdminState()`, `Audio/app.js:2366` | `state.previewCollapsed = Boolean(ui.previewCollapsed)` z `localStorage` (`audio.admin.ui`). Brak wpisu = rozwinięty. |
| Zapis | `saveAdminUi()`, `Audio/app.js:2338` | Zapisuje cały obiekt stanu interfejsu, w tym `previewCollapsed`. |
| Wyświetlanie | `renderLayoutState()`, `Audio/app.js:2568` i `renderPreview()`, `Audio/app.js:2909-2918` | Zwinięty podgląd ukrywa ramkę i nie jest rysowany. |
| Znaczniki | `Audio/index.html:204` | `#previewFrame` bez atrybutu `hidden` — do startu skryptu ramka jest widoczna. |

**Dlaczego sama zmiana wartości domyślnej nie wystarczy:** `saveAdminUi()` zapisuje cały obiekt przy wielu czynnościach — wyborze listy do edycji, zwinięciu panelu folderów, zmianie szerokości podglądu, zmianie zakładki. Po utworzeniu list ulubionych przeglądarka administratora prawie na pewno ma już zapisane `previewCollapsed: false`. Zmiana samej wartości początkowej na `true` zadziałałaby tylko na nowych urządzeniach — na komputerze, na którym przygotowano listy, podgląd nadal otwierałby się rozwinięty.

### 7.2 Propozycja (D7 — wariant rekomendowany)

**Podgląd zwinięty po każdym wejściu na stronę, bez pamiętania stanu.** W trakcie wizyty `Rozwiń podgląd` / `Zwiń podgląd` działa jak dziś; po odświeżeniu strony podgląd znów jest zwinięty.

| Miejsce | Zmiana |
| --- | --- |
| `Audio/app.js:736` | `previewCollapsed: true` |
| `restoreAdminState()` (`Audio/app.js:2366`) | Usunąć odczyt `ui.previewCollapsed` — zapamiętana wartość jest ignorowana. |
| `saveAdminUi()` (`Audio/app.js:2338`) | Usunąć `previewCollapsed` z zapisywanego obiektu. Stara wartość w pamięci przeglądarki zniknie przy najbliższym zapisie; migracja niepotrzebna. |
| `Audio/index.html:204` | Atrybut `hidden` na `#previewFrame`, żeby ramka nie mignęła przed startem skryptu. |
| obsługa `#previewToggle` (`Audio/app.js:4225`) | Przy zwijaniu — `stopPreviewPlayback()` (krok 4 z rozdz. 5.3). |

Pozostałe ustawienia podglądu (szerokość Komputer / Tablet / Telefon, „podąża za edytowaną listą”) są nadal pamiętane na urządzeniu.

Korzyść dodatkowa: zwinięty podgląd nie jest rysowany, więc panel admina reaguje szybciej przy długich listach (każda zmiana na liście przerysowuje mniej elementów).

### 7.3 Tablet i telefon (D8)

Na ekranach węższych niż 1024 px panel admina ma zakładki `Katalog` / `Listy` / `Podgląd` (`Audio/style.css:1683-1717`). Przy podglądzie zwiniętym domyślnie wybranie zakładki `Podgląd` pokazywałoby pusty panel z samym przyciskiem `Rozwiń podgląd` — dodatkowe dotknięcie bez powodu. Propozycja: wybranie zakładki `Podgląd` (`Audio/app.js:3865-3874`) automatycznie rozwija podgląd, bo jest to wyraźna prośba o jego pokazanie.

### 7.4 Wariant alternatywny (nierekomendowany)

Podgląd zwinięty domyślnie, ale stan pamiętany na urządzeniu pod **nowym** kluczem (np. `previewExpanded`), żeby stare `previewCollapsed: false` nie wygrywało. Każde urządzenie zaczyna od zwiniętego podglądu, a po rozwinięciu pamięta to do odwołania. Wada: po jednym rozwinięciu podgląd wraca do stanu „zawsze rozwinięty”, czyli problem zgłoszony w prompcie wraca.

---

## 8. Do czego służy pole „podąża za edytowaną listą”

Pole stoi w nagłówku sekcji „Podgląd widoku użytkownika” (`Audio/index.html:199`). Decyduje, **którą listę pokazuje podgląd** i **co robi kliknięcie zakładki listy w podglądzie**. Nie zmienia żadnych danych, nie wpływa na prawdziwy widok użytkownika (`Audio/index.html` bez `?admin=1`) i nie jest zapisywane w Firebase — to wyłącznie ustawienie wyglądu panelu admina, pamiętane w tej przeglądarce. Domyślnie jest zaznaczone.

### 8.1 Pole zaznaczone (domyślnie) — podgląd „jedzie” razem z edytorem

- Podgląd zawsze pokazuje listę wybraną do edycji — tę samą, którą widać w edytorze po prawej i jako „Lista docelowa” nad katalogiem.
- Wybranie innej listy w panelu list albo w „Lista docelowa” przełącza także podgląd.
- **Kliknięcie zakładki listy w podglądzie zmienia listę edytowaną** — edytor pokazuje wtedy tę listę, a przycisk `+` w katalogu zaczyna dodawać dźwięki właśnie do niej.

Do czego się przydaje: przy układaniu jednej listy (dodawanie dźwięków, kolejność, aliasy) od razu widać, jak zobaczą ją gracze. Zakładki podglądu są też szybkim sposobem przełączania edytowanej listy.

Na co uważać: ponieważ kliknięcie zakładki w podglądzie zmienia listę docelową, łatwo przez nieuwagę zacząć dodawać dźwięki do innej listy niż zamierzona. Aktualną listę docelową zawsze pokazuje linia „Lista docelowa” nad katalogiem.

### 8.2 Pole odznaczone — podgląd „przypięty” do jednej listy

- W chwili odznaczenia podgląd zostaje na liście, która była wtedy edytowana.
- Zmiana listy w edytorze **nie** zmienia podglądu.
- Kliknięcie zakładki w podglądzie przełącza **tylko podgląd** — edytor i lista docelowa katalogu się nie zmieniają.
- Ponowne zaznaczenie pola przenosi podgląd z powrotem na listę edytowaną.
- Jeżeli lista pokazywana w podglądzie zostanie usunięta, podgląd wraca do listy głównej.

Do czego się przydaje:

- porównanie dwóch list — np. edytujesz „Playlista02”, a w podglądzie oglądasz „Playlista03”, żeby nadać spójne aliasy;
- przeglądanie wszystkich list w podglądzie bez ryzyka, że `+` w katalogu zacznie dodawać dźwięki do innej listy;
- odsłuchiwanie dźwięków z jednej listy w podglądzie podczas przygotowywania innej.

### 8.3 Szczegóły techniczne

| Element | Miejsce |
| --- | --- |
| Lista pokazywana w podglądzie | `getPreviewListId()` (`Audio/app.js:2907`): zaznaczone → `getEditedList().id`, odznaczone → `state.previewListId` |
| Kliknięcie zakładki w podglądzie | `selectViewList("prev", listId)` (`Audio/app.js:3028`): zaznaczone → `setEditedList(listId)`, odznaczone → zmiana `state.previewListId` i przerysowanie samego podglądu |
| Zmiana pola | `Audio/app.js:4216-4223`: przy odznaczeniu `previewListId` = bieżąca lista edytowana |
| Pamięć | `localStorage` `audio.admin.ui.previewFollow` (urządzenie, bez Firebase) |
| Usunięta lista | `onSettingsChanged()` przestawia `previewListId` na listę główną |

Obecny opis w `Audio/docs/README.md` (sekcja „Podgląd widoku użytkownika”) jest poprawny, ale krótki. Przy wdrożeniu warto go rozszerzyć o przypadki użycia z 8.1–8.2 i ostrzeżenie o zmianie listy docelowej.

---

## 9. Decyzje do podjęcia

| # | Pytanie | Rekomendacja | Alternatywa |
| --- | --- | --- | --- |
| D1 | Kiedy zatrzymywać odsłuch z katalogu? | **Przy każdej zmianie filtra katalogu**: fraza, foldery, „Pokaż”, „Warstwa” (S1–S3) + siatka bezpieczeństwa (S4). | Tylko gdy wiersz grającego dźwięku znika z ekranu — nie rozwiązuje przypadku z promptu, bo po wyczyszczeniu frazy wiersz zwykle zostaje na długiej liście. |
| D2 | Czy ta sama reguła ma obowiązywać w edytorze listy? | **Tak**: zmiana frazy „Szukaj na liście” i zmiana listy edytowanej zatrzymują odsłuch z edytora (S5, S6). | Tylko siatka bezpieczeństwa (dźwięk zatrzymuje się, gdy jego wiersz znika). |
| D3 | Pływający przycisk `■ Zatrzymaj wszystko (N)` w panelu admina, widoczny tylko gdy coś gra? | **Tak** — mały koszt, zawsze dostępne zatrzymanie, niezależnie od przewinięcia i stanu podglądu. | Bez przycisku; zatrzymanie tylko w podglądzie (wymaga jego rozwinięcia). |
| D4 | Czy zmiana zakładki Katalog / Listy / Podgląd na tablecie i telefonie ma zatrzymywać dźwięki? | **Nie** — wystarczy pływający przycisk (D3); można np. odsłuchać dźwięk w katalogu i przejść do listy, żeby nadać alias. | Tak — zatrzymywać odsłuch panelu, który się chowa. |
| D5 | Które „checkboxy” mają zatrzymywać dźwięk? | **Pola wyboru folderów** w panelu folderów i przyciski zaznaczania folderów (S2). Pola zaznaczania wierszy katalogu — **nie** (S10), bo niczego nie ukrywają. | Także pola zaznaczania wierszy. |
| D6 | Czy licznik wariantów `(N)` też zmniejszyć? | **Nie** — prompt wymienia tylko alias; licznik zostaje 15 px, czerwony. | Licznik też 12 px. |
| D7 | Podgląd domyślnie zwinięty — z pamięcią czy bez? | **Bez pamięci**: zwinięty po każdym wejściu na stronę (rozdz. 7.2). | Zwinięty domyślnie, ale pamiętany pod nowym kluczem (rozdz. 7.4). |
| D8 | Czy zakładka `Podgląd` na tablecie i telefonie ma sama rozwijać podgląd? | **Tak** (rozdz. 7.3). | Nie — trzeba dodatkowo dotknąć `Rozwiń podgląd`. |
| D9 | Czy zwinięcie podglądu ma zatrzymywać jego dźwięki? | **Tak** — po zwinięciu nie ma ani kafelka, ani przycisku `Zatrzymaj wszystko` w podglądzie (scenariusz C). | Nie — zostawić tylko pływający przycisk (D3). |

---

## 10. Pliki do zmiany przy wdrożeniu

| Plik | Zmiana |
| --- | --- |
| `Audio/app.js` | `stopPlaybackWhere`, `stopCatalogAuditions`, `stopEditorAuditions`, `stopPreviewPlayback`, `stopDetachedAuditions`; wywołania w obsłudze „Szukaj dźwięku”, „Pokaż”, „Warstwa”, w `onFolderFilterChanged()`, „Szukaj na liście”, `setEditedList()`, `renderCatalog()`, `renderEditor()`, `#previewToggle`; obsługa pływającego przycisku; `previewCollapsed: true`, zmiany w `restoreAdminState()` i `saveAdminUi()`; rozwinięcie podglądu przy zakładce `Podgląd`. Komentarze PL/EN zgodnie z `AGENTS.md`. |
| `Audio/index.html` | `hidden` na `#previewFrame`; znacznik pływającego przycisku (klasa `admin-only`). |
| `Audio/style.css` | Zmienna `--tile-meta-size`, `font-size` dla `.sample-alias` i `.tile-tag`; style pływającego przycisku (pozycja, ukrywanie przy `:disabled`, wariant < 1024 px i < 560 px). |
| `Audio/docs/README.md` (PL i EN) | Odsłuch zatrzymuje się po zmianie filtrów, frazy w edytorze, listy edytowanej i po zwinięciu podglądu; pływający przycisk; podgląd zwinięty po każdym wejściu (zamiast „moduł pamięta to na tym urządzeniu”); rozszerzony opis „podąża za edytowaną listą”. |
| `Audio/docs/Documentation.md` (PL i EN) | Rozdział o kluczach i zatrzymywaniu odtwarzaczy (nowe funkcje i reguły), opis podglądu (zwinięty domyślnie, bez pamięci, zatrzymanie dźwięków przy zwinięciu, zakładka `Podgląd`), tabela stanu i obiekt `audio.admin.ui` bez `previewCollapsed`, typografia kafelka (alias 12 px), tabela testów kontrolnych. |
| `DetaleLayout.md` (sekcja „Moduł — Audio”) | Alias 12 px (`--tile-meta-size`, wspólny z tagiem); pływający przycisk `Zatrzymaj wszystko` w panelu admina; ramka podglądu ukryta na starcie. |
| Dane w Firestore, reguły Firebase, manifesty, bramka | **bez zmian** |

---

## 11. Plan testów po wdrożeniu

| # | Test | Oczekiwany wynik |
| --- | --- | --- |
| T1 | Kroki 1.1–1.5 z promptu (fraza → `▶` → wyczyszczenie frazy) | Po wyczyszczeniu frazy dźwięk milknie; pływający przycisk znika. |
| T2 | Zmiana frazy na inną, wciąż pasującą do grającego dźwięku | Dźwięk milknie (D1). Dopisanie samej spacji na końcu — dźwięk gra dalej. |
| T3 | `▶` w katalogu → pole wyboru folderu, `Odznacz wszystko`, `Zaznacz wszystko`, `Tylko ten folder`, `Zaznacz/Odznacz/Tylko pasujące` | Każda z tych czynności zatrzymuje odsłuch. |
| T4 | `▶` w katalogu → zmiana „Pokaż” albo „Warstwa” | Odsłuch zatrzymany. |
| T5 | „Pokaż: spoza listy docelowej” → `▶` → `+` na tym samym wierszu | Wiersz znika, dźwięk milknie (siatka bezpieczeństwa). |
| T6 | `▶` w katalogu → zaznaczanie wierszy, `Shift`+kliknięcie, „Szukaj folderu”, `Pokaż kolejne 200` | Dźwięk gra dalej (D5, S11, S12). |
| T7 | `▶` w edytorze → zmiana frazy „Szukaj na liście” / zmiana listy edytowanej | Odsłuch zatrzymany (D2). |
| T8 | Kafelek w podglądzie → `Zwiń podgląd` | Dźwięk milknie (D9). |
| T9 | Kafelek w podglądzie na liście A → zakładka B w podglądzie | Dźwięk gra dalej, kropka `•` na zakładce A, `Zatrzymaj wszystko` w podglądzie i pływający przycisk pokazują `(1)`. |
| T10 | Telefon: `▶` w katalogu → zakładka `Listy` | Dźwięk gra dalej, pływający przycisk widoczny i nie zasłania paska „Zaznaczone”; kliknięcie zatrzymuje dźwięk (D4). |
| T11 | Dźwięk z archiwum: `▶` i natychmiastowa zmiana filtra (stan „wczytywanie…”) | Start zostaje anulowany, dźwięk w ogóle nie zaczyna grać. |
| T12 | Kafelek z aliasem w widoku użytkownika i w podglądzie (np. „Text On Screen (Infoczytnik)”) | Nazwa bez zmian (15 px, pogrubiona), alias tej samej wielkości co tag (12 px), kolor aliasu bez zmian. |
| T13 | Kafelek z aliasem i licznikiem `(N)` | Alias 12 px, licznik bez zmian (D6). |
| T14 | Wejście na `?admin=1` na komputerze, na którym wcześniej rozwijano podgląd | Podgląd zwinięty; `Rozwiń podgląd` go pokazuje; po odświeżeniu znów zwinięty (D7). |
| T15 | Telefon / tablet: zakładka `Podgląd` | Podgląd od razu rozwinięty (D8). |
| T16 | „podąża za edytowaną listą” zaznaczone i odznaczone | Zachowanie jak w rozdz. 8.1–8.2. |
| T17 | Regresja widoku użytkownika (bez `?admin=1`) | Zmiana zakładki nie zatrzymuje dźwięków; `Zatrzymaj wszystko`, `Loop`, suwak działają jak dotąd. |
| T18 | Dane | Po wdrożeniu listy ulubionych i aliasy są takie same jak przed wdrożeniem. |

---

## 12. Ryzyka

| Ryzyko | Ograniczenie |
| --- | --- |
| Zatrzymywanie przy każdej zmianie frazy przerwie dźwięk także przy dopisywaniu kolejnych liter | Zgodne z prośbą z promptu; porównanie znormalizowanej frazy pomija zmiany bez wpływu na wyniki (np. spacje). Wyszukiwarka ma opóźnienie 150 ms, więc szybkie pisanie to jedno zatrzymanie, nie kilka. |
| Zatrzymywanie dźwięku wewnątrz funkcji rysujących (siatka bezpieczeństwa) | `stopPlayback()` tylko aktualizuje przyciski po kluczu i liczniki — nie wywołuje ponownego rysowania, więc nie ma ryzyka pętli. |
| Pływający przycisk zasłoni element panelu | Widoczny tylko wtedy, gdy coś gra; osobne położenie na ekranach < 1024 px (nad paskiem „Zaznaczone”). Do sprawdzenia w T10. |
| Administrator nie zauważy zwiniętego podglądu | Nagłówek sekcji z przyciskiem `Rozwiń podgląd` zostaje widoczny na dole strony; na tablecie i telefonie zakładka `Podgląd` rozwija go sama. |
| Stara wartość `previewCollapsed` w pamięci przeglądarki | Ignorowana przy odczycie i usuwana przy najbliższym zapisie stanu interfejsu; migracja niepotrzebna. |
| Wpływ na dane użytkownika | Brak — zmiany dotyczą wyłącznie odtwarzania, stylów i stanu interfejsu w pamięci przeglądarki. Dokument `audio/favorites` i jego format pozostają bez zmian. |

---

## 13. Znalezione przy okazji

- Na drugim załączonym zrzucie ekranu kafelek **„Blaster 1 Burst”** ma alias **„(Lasgun single)”**, a kafelek **„Blaster 1 Single”** — alias **„(Lasgun seria)”**. Wygląda to na zamienione aliasy (Burst = seria, Single = pojedynczy strzał). To dane, nie błąd kodu — jeżeli zamiana nie jest celowa, wystarczy poprawić oba aliasy w edytorze tej listy. Analiza niczego w danych nie zmieniała.

---

## 14. Następne kroki

1. Rozstrzygnięcie decyzji D1–D9 (rozdz. 9) — domyślnie zgodnie z rekomendacjami.
2. Wdrożenie zmian z rozdz. 10 (kod, dokumentacja PL/EN, `DetaleLayout.md`).
3. Testy z rozdz. 11, w tym test T18 potwierdzający, że listy i aliasy pozostały nienaruszone.
4. Do czasu wdrożenia: grające w tle dźwięki z katalogu można zatrzymać przyciskiem `■ Zatrzymaj wszystko` w rozwiniętym podglądzie widoku użytkownika.

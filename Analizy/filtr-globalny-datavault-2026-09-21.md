# Filtr globalny w module DataVault — analiza modyfikacji zasady działania

> **Data:** 21 września 2026
> **Temat:** zmiana nazwy panelu bocznego z „▸FILTRY" na „FILTR", utrwalenie wpisanej frazy przy przełączaniu zakładek, czerwona sygnalizacja aktywnego filtru oraz potwierdzenie niezależności filtru globalnego od filtrów kolumnowych i widoku domyślnego
> **Moduł:** `DataVault`
> **Charakter dokumentu:** analiza przedwdrożeniowa. Opisuje stan kodu **sprzed** zmian i projekt docelowego zachowania. Żaden plik modułu nie został w ramach tej analizy zmieniony.
> **Stan na dziś:** użytkownik rozstrzygnął D1-D5 oraz propozycje Z1-Z7 i zlecił dwie dodatkowe zmiany wyglądu — rozdz. 17-30. Otwarte pozostają **dwie** kwestie kolorystyczne: D6 (zasięg nowego koloru) i D7 (wybór barwy). Kod modułu nadal nietknięty.

---

## Spis treści

1. [Prompt użytkownika (zachowany w całości)](#1-prompt-użytkownika-zachowany-w-całości)
2. [Zakres analizy](#2-zakres-analizy)
3. [Jak filtr globalny działa dziś](#3-jak-filtr-globalny-działa-dziś)
4. [Zestawienie: oczekiwanie kontra stan faktyczny](#4-zestawienie-oczekiwanie-kontra-stan-faktyczny)
5. [Wymaganie 1 — nazwa „FILTR" zamiast „▸FILTRY"](#5-wymaganie-1--nazwa-filtr-zamiast-filtry)
6. [Wymaganie 2 — trwałość frazy przy przełączaniu zakładek](#6-wymaganie-2--trwałość-frazy-przy-przełączaniu-zakładek)
7. [Wymaganie 3 — czerwona nazwa jako sygnał aktywności](#7-wymaganie-3--czerwona-nazwa-jako-sygnał-aktywności)
8. [Wymaganie 4 — niezależność od filtrów kolumnowych i widoku domyślnego](#8-wymaganie-4--niezależność-od-filtrów-kolumnowych-i-widoku-domyślnego)
9. [Proponowane rozwiązanie — projekt zmiany](#9-proponowane-rozwiązanie--projekt-zmiany)
10. [Decyzje do podjęcia przed wdrożeniem](#10-decyzje-do-podjęcia-przed-wdrożeniem)
11. [Zakres prac — lista plików i miejsc](#11-zakres-prac--lista-plików-i-miejsc)
12. [Plan testów](#12-plan-testów)
13. [Ryzyka](#13-ryzyka)
14. [Znalezione przy okazji](#14-znalezione-przy-okazji)
15. [Rekomendacje](#15-rekomendacje)
16. [Następne kroki](#16-następne-kroki)
17. [Decyzje użytkownika z 21 września 2026](#17-decyzje-użytkownika-z-21-września-2026)
18. [D5 — kolizja nazw `FILTR` i `NARZĘDZIA` (do rozstrzygnięcia)](#18-d5--kolizja-nazw-filtr-i-narzędzia-do-rozstrzygnięcia)
19. [Z1 — wyszukiwanie niewrażliwe na polskie znaki](#19-z1--wyszukiwanie-niewrażliwe-na-polskie-znaki)
20. [Z6 — przycisk czyszczenia zaznaczeń](#20-z6--przycisk-czyszczenia-zaznaczeń)
21. [Zaktualizowany zakres prac](#21-zaktualizowany-zakres-prac)
22. [Zaktualizowany plan testów](#22-zaktualizowany-plan-testów)
23. [Zaktualizowane ryzyka](#23-zaktualizowane-ryzyka)
24. [Gotowość do wdrożenia](#24-gotowość-do-wdrożenia)
25. [Decyzje z 21 września 2026 — druga tura](#25-decyzje-z-21-września-2026--druga-tura)
26. [Nowy kolor sygnalizacji aktywnych filtrów](#26-nowy-kolor-sygnalizacji-aktywnych-filtrów)
27. [Checkbox zaznaczenia wiersza do porównania](#27-checkbox-zaznaczenia-wiersza-do-porównania)
28. [Uzupełnienie zakresu prac](#28-uzupełnienie-zakresu-prac)
29. [Uzupełnienie planu testów](#29-uzupełnienie-planu-testów)
30. [Zaktualizowana gotowość do wdrożenia](#30-zaktualizowana-gotowość-do-wdrożenia)

---

## 1. Prompt użytkownika (zachowany w całości)

> Przeprowadź analizę modyfikacji zasady działania filtru globalnego (wyświetlanego na panelu z lewej strony) w module DataVault
>
> Po pierwsze trzeba zmienić nazwę z "▸FILTRY" na "FILTR".
> Po drugie jeżeli użytkownik wpisze coś w pole to wartość ma się zapisać przy przełączeniu między zakładkami.
> Przykładowo - użytkownik wpisze "Egzo" i potem klika na różne zakładki. Nazwa "Egzo" ma być cały czas w polu filtra a w tabelach mają się wyświetlać tylko wiersze w których występuje fragment nazwy "egzo" (niezależnie od wielkości liter).
> Jeżeli filtr globalny jest aktywny to nazwa "FILTR" na panelu bocznym ma być czerwona, żeby użytkownik miał feedback, że coś wpisał.
> Filtr globalny działa niezależnie od filtrów użytkownika w danych tabelach oraz widoku domyślnym.
> Przykładowo mogę w filtrze globalnym wpisać "Pisto" a potem z zakładki Bronie w kolumnie Typ wybrać "Boltowa" i będę miał tylko pistolety boltowe.
> Po przełączeniu na zakładkę "Ekwipunek" filtr pozostanie aktywny i będzie wyświetlać tylko wiersze w których występuje fraza "pisto" (obecnie dwa wiersze z ulepszeniami broni).
>
> Utwórz nowy plik MD w folderze Analizy/

---

## 2. Zakres analizy

Analiza obejmuje **wyłącznie filtr globalny modułu `DataVault`** i wszystkie miejsca w kodzie, które czytają albo zapisują jego wartość:

- pole `#globalSearch` w panelu bocznym (`DataVault/index.html`),
- bliźniacze pole `#quickSearch` w pasku narzędzi zakładki (widok telefonu),
- pole `view.global` w stanie widoku i jego zapis do `sessionStorage`,
- funkcja filtrująca `passesFilters()`,
- nagłówek panelu bocznego (nazwa i jej kolor),
- pliki dokumentacji, które opisują powyższe.

**Poza zakresem:**

- filtry per kolumna (drugi wiersz nagłówka tabeli, menu `#filterMenu`, modal `#filterModal`) — zmiana ich nie dotyka, poza koniecznością potwierdzenia, że nadal składają się z filtrem globalnym operatorem AND,
- `DEFAULT_VIEW_CONFIG` i mechanika widoku domyślnego — bez zmian w zawartości,
- parsery danych (`build_json.py`, `xlsxCanonicalParser.js`) i struktura danych w Firebase — zmiana nie dotyka warstwy danych,
- pozostałe moduły repozytorium.

---

## 3. Jak filtr globalny działa dziś

### 3.1 Gdzie mieszka wartość

Wartość filtru globalnego jest trzymana w polu `global` obiektu stanu widoku. Kluczowa obserwacja: **ten stan jest osobny dla każdej zakładki.**

`DataVault/app.js:508` — fabryka stanu widoku pojedynczego arkusza:

```js
function createSheetViewState(sheetName = null){
  return {
    sort: sheetName ? getDefaultSort(sheetName) : null,
    global: "",              // <- filtr globalny mieszka TUTAJ, czyli per zakładka
    filtersText: {},
    filtersSet: {},
    selected: new Set(),
    expandedCells: new Set(),
  };
}
```

`DataVault/app.js:360-361` — magazyn stanów i stan aktywny:

```js
const viewBySheet = {};            // mapa: nazwa zakładki -> zapisany stan widoku
let view = createSheetViewState();  // stan widoku aktualnie oglądanej zakładki
```

Czyli `view.global` to „fraza wpisana **w tej** zakładce", a nie „fraza wpisana w aplikacji".

### 3.2 Jak filtruje

`DataVault/app.js:1711-1731` — jedyna funkcja decydująca o widoczności wiersza:

```js
function passesFilters(row, cols){
  // global
  const g = (view.global || "").toLowerCase().trim();
  if (g){
    const hay = cols.map(c => String(row[c] ?? "")).join(" | ").toLowerCase();
    if (!hay.includes(g)) return false;
  }
  // per-column text contains
  for (const [col, txt] of Object.entries(view.filtersText)){ ... }
  // per-column set filter
  for (const [col, set] of Object.entries(view.filtersSet)){ ... }
  return true;
}
```

Wnioski z tego fragmentu:

| Cecha | Stan faktyczny |
|---|---|
| Wielkość liter | **Nie ma znaczenia** — obie strony przechodzą przez `toLowerCase()`. Wymaganie „niezależnie od wielkości liter" jest już spełnione. |
| Spacje na brzegach | Ucinane przez `trim()`, czyli `" Egzo "` działa jak `"egzo"`. |
| Sposób dopasowania | `includes()` — dowolny **fragment** dowolnej komórki wiersza. Zgodne z „występuje fragment nazwy". |
| Zakres przeszukiwania | Wszystkie **widoczne** kolumny wiersza (`cols`), sklejone separatorem `" \| "`. Kolumny ukryte (`HIDDEN_COLUMNS = {"lp", "stan"}`, `app.js:374`) nie są przeszukiwane. |
| Składanie z filtrami kolumn | **AND** — wiersz musi przejść filtr globalny *oraz* każdy filtr kolumnowy. To jest dokładnie ta „niezależność", o którą prosi prompt. |
| Diakrytyka | Porównanie dosłowne. `"lancuchowa"` **nie** znajdzie `"łańcuchowa"`. |
| Wiele słów | Traktowane jako jeden ciąg. `"pisto bolt"` nie znajdzie wiersza, w którym oba słowa są, ale osobno. |

### 3.3 Dlaczego fraza znika przy przełączeniu zakładki

Przełączenie zakładki przechodzi przez `selectSheet()` (`app.js:1377`):

```js
function selectSheet(name){
  persistCurrentSheetView();   // 1. zapisz stan starej zakładki (razem z jej global)
  currentSheet = name;
  restoreSheetView(name);      // 2. wczytaj stan nowej zakładki (razem z JEJ global)
  els.btnCompare.disabled = true;
  if (els.global){
    els.global.value = view.global || "";   // 3. przepisz global NOWEJ zakładki do pola
  }
  ...
}
```

Krok 3 jest przyczyną zgłoszonego zachowania. Pole `#globalSearch` jest **nadpisywane** wartością `global` zapisaną dla zakładki docelowej, a ta dla świeżo otwieranej zakładki wynosi `""` (`createSheetViewState()`, `app.js:511`). Wpisane „Egzo" nie jest gubione — jest odkładane pod poprzednią zakładką i wraca dopiero po powrocie na nią.

Łańcuch zapisu i odczytu, który trzeba przebudować:

| Linia | Funkcja | Rola pola `global` |
|---|---|---|
| `app.js:511` | `createSheetViewState()` | tworzy puste `global` dla nowej zakładki |
| `app.js:535` | `setCurrentSheetView()` | kopiuje `global` do stanu aktywnego |
| `app.js:549` | `persistCurrentSheetView()` | odkłada `global` do `viewBySheet[currentSheet]` |
| `app.js:572` | `restoreSheetView()` | odczytuje `global` zakładki docelowej |
| `app.js:599` | `applyDefaultViewForSheet()` | zeruje `global` przy „Widok Domyślny" |
| `app.js:612` | `applyFullViewForSheet()` | zeruje `global` przy „Pełen Widok" |
| `app.js:655`, `678` | `loadSessionState()` | odtwarza `global` **osobno dla każdej zakładki** z `sessionStorage` |
| `app.js:710` | `applyViewModeToAllSheets()` | przepisuje `global` do pola po resecie widoku |
| `app.js:1382-1384` | `selectSheet()` | przepisuje `global` do pola przy zmianie zakładki |
| `app.js:1713` | `passesFilters()` | **czyta** `global` przy filtrowaniu |
| `app.js:2073-2077` | nasłuch `input` na `#globalSearch` | **zapisuje** `global` |
| `app.js:2213` | `buildRenderPlan()` | z `global` wynika automatyczne rozwijanie grup kart |
| `app.js:2285` | `updateSheetTools()` | synchronizuje `#quickSearch` z `global` |
| `app.js:2324-2333` | `renderActiveChips()` | żeton `SZUKAJ: …` i przycisk `✕` czyszczący `global` |
| `app.js:2668-2676` | nasłuch `input` na `#quickSearch` | **zapisuje** `global` i lustrzanie `#globalSearch` |

Czternaście miejsc, wszystkie w jednym pliku. Żadne z nich nie leży w warstwie danych.

### 3.4 Skutek uboczny obecnego modelu, o którym warto wiedzieć

Ponieważ `global` jest zapisywany per zakładka i trafia do `sessionStorage` (`saveSessionState()`, `app.js:620`), po odświeżeniu strony aplikacja potrafi odtworzyć **różne frazy w różnych zakładkach jednocześnie**. Z punktu widzenia użytkownika to stan niewidoczny i niezrozumiały: pole pokazuje tylko frazę bieżącej zakładki, a pozostałe filtrują po cichu. Zmiana na jedną wspólną wartość usuwa również ten problem.

### 3.5 Panel boczny dziś

`DataVault/index.html:62`:

```html
<div class="panelHeader">
  <span class="caret">▸</span><span class="panelTitle" data-i18n="filtersTitle">FILTRY</span>
</div>
```

- Znak `▸` jest osobnym elementem `<span class="caret">`, stylowanym w `DataVault/style.css:206` (`color: rgba(22,198,12,.65)`). **Nie jest** przełącznikiem zwijania — panel niczego nie zwija, to czysta dekoracja.
- Tekst „FILTRY" pochodzi z tłumaczeń: `app.js:69` (PL: `"FILTRY"`) i `app.js:166` (EN: `"FILTERS"`), podstawiany przez `data-i18n="filtersTitle"`.
- Kolor tytułu: `.panelTitle{color:var(--code)}` (`style.css:207`), czyli `#D2FAD2`.

Panel zawiera dziś: pole filtru globalnego, checkbox starych wpisów Bestiariusza (tylko admin), trzy checkboxy widoczności zakładek i blok podpowiedzi.

---

## 4. Zestawienie: oczekiwanie kontra stan faktyczny

| # | Oczekiwanie z promptu | Stan dziś | Czy wymaga zmiany |
|---|---|---|---|
| 1 | Nagłówek panelu brzmi „FILTR" | „▸FILTRY" (`index.html:62`, `app.js:69`, `app.js:166`) | **Tak** |
| 2 | Fraza zostaje w polu po przełączeniu zakładki | Znika — stan jest per zakładka (`app.js:1382`) | **Tak** |
| 3 | Fraza filtruje każdą zakładkę, na którą wejdziemy | Filtruje tylko tę, w której ją wpisano | **Tak** |
| 4 | Dopasowanie bez względu na wielkość liter | Już działa (`toLowerCase()`, `app.js:1713-1716`) | Nie |
| 5 | Dopasowanie po fragmencie | Już działa (`includes()`) | Nie |
| 6 | „FILTR" na czerwono, gdy filtr aktywny | Brak jakiejkolwiek sygnalizacji na panelu | **Tak** |
| 7 | Filtr globalny łączy się z filtrem kolumny („Pisto" + Typ „Boltowa") | Już działa — AND w `passesFilters()` | Nie |
| 8 | Filtr globalny łączy się z widokiem domyślnym | Już działa — widok domyślny to wpis w `view.filtersSet`, składany tym samym AND | Nie |

Cztery z ośmiu punktów są już spełnione. Realna praca to: nazwa, trwałość wartości i sygnalizacja kolorem.

---

## 5. Wymaganie 1 — nazwa „FILTR" zamiast „▸FILTRY"

### Co zrobić

1. **Usunąć znak `▸`.** W `index.html:62` znika `<span class="caret">▸</span>`. Reguła `.caret` w `style.css:206` przestaje mieć zastosowanie w tym module i powinna zostać usunięta.
2. **Zmienić etykietę w tłumaczeniach**, nie w HTML-u — `applyLanguage()` i tak nadpisuje treść przez `data-i18n`. Zmiana tylko w HTML-u zostałaby skasowana przy pierwszym przełączeniu języka.
   - `app.js:69`: `filtersTitle: "FILTRY"` → `filtersTitle: "FILTR"`
   - `app.js:166`: `filtersTitle: "FILTERS"` → `filtersTitle: "FILTER"`
   - `index.html:62`: treść domyślna również na `FILTR` (widoczna przed wykonaniem skryptu).

### Uwaga o czym warto wiedzieć — trzy różne napisy „FILTR"

Po zmianie w module będą trzy zbliżone nazwy w trzech różnych miejscach:

| Napis | Skąd | Gdzie widoczny |
|---|---|---|
| `FILTR` | `labels.filtersTitle` (po zmianie) | nagłówek panelu bocznego |
| `FILTR: <nazwa kolumny>` | `messages.filterTitle` (`app.js:111`) | tytuł rozwijanego menu filtra kolumny (`app.js:1573`) |
| `Filtry — <nazwa zakładki>` | `messages.filterModalTitle` (`app.js:135`) | tytuł modalu filtrów na telefonie (`app.js:2477`) |

To **nie jest kolizja techniczna** — to trzy osobne klucze tłumaczeń i żaden nie nadpisuje drugiego. Jest to jednak kolizja znaczeniowa dla użytkownika: „FILTR" w panelu dotyczy całej aplikacji, a „FILTR: Typ" dotyczy jednej kolumny. Do rozstrzygnięcia w punkcie 10 (decyzja D3).

### Uwaga o liczbie pojedynczej

Panel mieści dziś więcej niż filtr globalny: checkboxy widoczności zakładek i podpowiedzi. Nazwa w liczbie pojedynczej opisuje wtedy tylko pierwszy element panelu. Ponieważ to właśnie ta nazwa ma się czerwienić od filtru globalnego, liczba pojedyncza jest **spójna z docelową funkcją sygnalizacyjną** i przyjmujemy ją zgodnie z promptem. Jeżeli panel miałby kiedyś urosnąć o kolejne kontrolki, warto rozważyć podział na dwie sekcje: `FILTR` (pole globalne) i `WIDOK` (checkboxy) — to propozycja na przyszłość, poza zakresem tej zmiany.

---

## 6. Wymaganie 2 — trwałość frazy przy przełączaniu zakładek

### Trzy możliwe podejścia

| Wariant | Na czym polega | Ocena |
|---|---|---|
| **A. Wyprowadzenie wartości ze stanu zakładki** | Filtr globalny przestaje być polem `view`, staje się osobną zmienną modułu `globalFilter`. | **Rekomendowany.** Model danych zaczyna odpowiadać rzeczywistości: jedna wartość dla całej aplikacji. Nie ma czego synchronizować, bo nie ma czego duplikować. |
| B. Rozgłaszanie wartości do wszystkich zakładek | Przy każdej zmianie pola wpisujemy tę samą frazę do `viewBySheet[*].global`. | Odrzucony. Pętla po wszystkich zakładkach przy **każdym naciśnięciu klawisza**, a wartość dalej jest zduplikowana w kilkudziesięciu miejscach — każda ścieżka, która pominie rozgłoszenie, wprowadza rozjazd. |
| C. Przenoszenie wartości w `selectSheet()` | Przy przełączeniu przepisujemy `global` ze starej zakładki do nowej. | Odrzucony. Naprawia tylko objaw przy przełączaniu, a nie naprawia `loadSessionState()` (dalej może odtworzyć różne frazy w różnych zakładkach) ani przycisków widoku. |

### Szkic wariantu A

Nowa zmienna obok istniejącego stanu (`app.js:360-361`):

```js
const viewBySheet = {};
let view = createSheetViewState();
// PL: Filtr globalny nie należy do stanu pojedynczej zakładki — to jedna fraza działająca na całej
// aplikacji, dlatego żyje obok viewBySheet i nie jest kopiowany przy przełączaniu zakładek.
// EN: The global filter does not belong to a single sheet's state — it is one phrase acting on the
// whole application, so it lives next to viewBySheet and is not copied when sheets are switched.
let globalFilter = "";
```

Zmiany w istniejących funkcjach — pole `global` znika ze stanu zakładki:

```js
// createSheetViewState() app.js:508    -> usuń wiersz `global: "",`
// setCurrentSheetView() app.js:535     -> usuń wiersz `global: state.global || "",`
// persistCurrentSheetView() app.js:549 -> usuń wiersz `global: view.global || "",`
// restoreSheetView() app.js:572        -> usuń wiersz `global: stored.global,`
// applyDefaultViewForSheet() app.js:599 -> usuń wiersz `global: "",`
// applyFullViewForSheet() app.js:612    -> usuń wiersz `global: "",`
```

Filtrowanie czyta zmienną zamiast pola stanu (`app.js:1713`):

```js
function passesFilters(row, cols){
  // PL: Filtr globalny jest wspólny dla wszystkich zakładek, więc czytamy go spoza stanu zakładki.
  // EN: The global filter is shared by every sheet, so it is read from outside the sheet state.
  const g = globalFilter.toLowerCase().trim();
  if (g){
    const hay = cols.map(c => String(row[c] ?? "")).join(" | ").toLowerCase();
    if (!hay.includes(g)) return false;
  }
  ...
}
```

Jedno miejsce ustawiające wartość, wywoływane przez oba pola:

```js
// PL: Jedna droga zmiany filtru globalnego: ustawia wartość, lustrzanie odświeża oba pola, zapala
// lub gasi sygnał na panelu i przerysowuje bieżącą zakładkę.
// EN: One path for changing the global filter: it sets the value, mirrors both fields, turns the
// panel signal on or off and redraws the current sheet.
function setGlobalFilter(value, {rerender = true} = {}){
  globalFilter = String(value ?? "");
  if (els.global && els.global.value !== globalFilter) els.global.value = globalFilter;
  if (els.quickSearch && els.quickSearch.value !== globalFilter) els.quickSearch.value = globalFilter;
  updateGlobalFilterIndicator();
  if (rerender && tbodyEl && currentSheet) renderBody();
  saveSessionState();
}
```

Nasłuchy (`app.js:2073` i `app.js:2668`) sprowadzają się wtedy do `setGlobalFilter(pole.value)`, a `selectSheet()` **przestaje dotykać pola** — wartość po prostu nie ma powodu się zmienić. Dla bezpieczeństwa (np. po resecie widoku) zostawiamy w `selectSheet()` jedno wywołanie `updateGlobalFilterIndicator()`.

### Zapis do sesji

`saveSessionState()` (`app.js:620`) dopisuje wartość **raz**, obok `toggles` i `language`:

```js
const payload = {
  sheetViews: viewBySheet,
  globalFilter,                 // nowe pole
  toggles: {...uiState},
  language: currentLanguage,
};
```

`loadSessionState()` (`app.js:631`) czyta je i **migruje starą sesję**, w której fraza leżała w zakładkach:

```js
// PL: Sesje zapisane przed zmianą trzymały frazę osobno w każdej zakładce. Bierzemy pierwszą
// niepustą, żeby po wdrożeniu nie zniknęła użytkownikowi z pola w trakcie pracy.
// EN: Sessions saved before this change kept the phrase separately per sheet. We take the first
// non-empty one so it does not vanish from the field mid-session after the deployment.
const legacyGlobal = Object.values(parsed.sheetViews || {})
  .map(state => String(state?.global || ""))
  .find(text => text.trim()) || "";
setGlobalFilter(String(parsed.globalFilter ?? legacyGlobal), {rerender: false});
```

Dzięki migracji **nie trzeba podbijać klucza** `SESSION_VIEW_KEY` (`app.js:338`, dziś `"datavault_session_view_v2"`). Podbicie na `_v3` też jest bezpieczne — `sessionStorage` żyje tylko w obrębie karty przeglądarki — ale kosztuje jednorazową utratę ustawień widoku u osób z otwartą kartą. Patrz decyzja D2.

### Wydajność

Zmiana **nie dokłada kosztu**. Dziś przy przełączeniu zakładki i tak następuje `buildTableSkeleton()` + `renderBody()`, a `passesFilters()` jest wołane dla każdego wiersza niezależnie od tego, skąd czyta frazę. Jedyna różnica: przy aktywnym filtrze globalnym nowa zakładka renderuje **mniej** wierszy niż dziś, bo część odpada. Czyli będzie nieznacznie szybciej.

---

## 7. Wymaganie 3 — czerwona nazwa jako sygnał aktywności

### Definicja „aktywny"

Sygnał musi być zgodny z tym, co faktycznie robi `passesFilters()`. Tam fraza przechodzi przez `trim()`, więc **same spacje niczego nie filtrują**. Warunek zapalenia sygnału musi być dokładnie taki sam:

```js
function isGlobalFilterActive(){
  return Boolean(globalFilter.trim());
}
```

Gdyby przyjąć `globalFilter !== ""`, tytuł świeciłby się na czerwono przy wpisanej spacji, mimo że tabela pokazywałaby komplet wierszy — czyli sygnał kłamałby.

### Zaczepienie w HTML

`.panelTitle` jest dziś selektorem klasowym bez identyfikatora. Dodajemy `id`, żeby nie szukać elementu po klasie:

```html
<div class="panelHeader">
  <span class="panelTitle" id="filtersPanelTitle" data-i18n="filtersTitle">FILTR</span>
</div>
```

i rejestrujemy go w `els` (`app.js:5-51`): `panelTitle: document.getElementById("filtersPanelTitle"),`.

### Przełączanie klasy

```js
// PL: Czerwony tytuł panelu to jedyna informacja o tym, że filtr globalny zawęża WSZYSTKIE zakładki,
// także te, na które użytkownik dopiero wejdzie. Warunek jest ten sam, którego używa passesFilters(),
// więc sama spacja w polu nie zapala sygnału.
// EN: The red panel title is the only sign that the global filter narrows EVERY sheet, including the
// ones the user has not opened yet. The condition matches passesFilters(), so a lone space in the
// field does not light the signal up.
function updateGlobalFilterIndicator(){
  if (!els.panelTitle) return;
  const active = isGlobalFilterActive();
  els.panelTitle.classList.toggle("panelTitle--active", active);
  els.panelTitle.title = active
    ? formatMessage(translations[currentLanguage].messages.globalFilterActive, {text: globalFilter.trim()})
    : "";
}
```

Nowe klucze tłumaczeń (`messages`), po jednym na język:

```js
// pl
globalFilterActive: "Filtr globalny jest aktywny i działa na wszystkich zakładkach: {text}",
// en
globalFilterActive: "The global filter is active and applies to every sheet: {text}",
```

Wywołania: z `setGlobalFilter()`, z `selectSheet()`, z `applyViewModeToAllSheets()`, z `applyLanguage()` (żeby dymek przetłumaczył się razem z resztą) i raz po `loadSessionState()`.

### Kolor

Moduł ma dwa gotowe słowniki czerwieni:

| Źródło | Wartość | Gdzie już używane |
|---|---|---|
| `--red` | `#d74b4b` (`style.css:15`) | checkbox „Czy wyświetlić zakładki dotyczące zasad walki?" i zakładki zasad walki (`style.css:234-246`) — **ten sam panel boczny** |
| rodzina „aktywny filtr" | `rgb(255,120,120)`, poświata `rgba(255,85,85,.40)` | znacznik `●` na `.filterBtn.filter-active` i podświetlenie nagłówka kolumny z filtrem (`DetaleLayout.md`, rozdz. 2.3 i 3.6a) |

**Rekomendacja: druga rodzina.** Uzasadnienie:

1. `--red` w tym samym panelu, kilkanaście pikseli niżej, oznacza dziś *kategorię* („zasady walki"), a nie *stan*. Użycie tego samego koloru na dwa różne znaczenia w jednym panelu jest mylące.
2. Rodzina `rgb(255,120,120)` oznacza w module dokładnie jedno: „ten filtr jest włączony". Czerwony tytuł panelu stałby się tym samym sygnałem co czerwona kropka przy kolumnie — spójny język wizualny, tylko na wyższym poziomie.
3. Kontrast. Na tle panelu (`--panel: #000`, nagłówek dokłada ledwie widoczne `rgba(22,198,12,.04)`) współczynnik kontrastu wynosi ok. **5,0 : 1** dla `#d74b4b` i ok. **8,2 : 1** dla `rgb(255,120,120)`. Oba przechodzą próg WCAG AA (4,5 : 1), ale tytuł jest pisany wersalikami z `letter-spacing: .16em`, więc wyższy kontrast czyta się wyraźnie lepiej.

Szkic reguły (do `style.css`, obok `.panelTitle`):

```css
/* PL: Aktywny filtr globalny zapala tytuł panelu na czerwono — tą samą czerwienią, którą moduł
   oznacza aktywne filtry kolumnowe, żeby oba sygnały znaczyły dla użytkownika to samo.
   EN: An active global filter turns the panel title red — the same red the module uses for active
   column filters, so both signals mean the same thing to the user. */
.panelTitle--active{
  color:rgb(255,120,120);
  text-shadow:0 0 10px rgba(255,85,85,.35);
}
```

### Dostępność

Sam kolor jest sygnałem słabym (daltonizm, tryb wysokiego kontrastu). Dlatego powyżej dołożony jest atrybut `title` z pełnym komunikatem. To wystarczające minimum dla modułu tej wielkości. Wariant mocniejszy — dopisanie do tytułu liczby ukrytych wierszy albo ikony — opisany jest w punkcie 14 jako propozycja opcjonalna.

---

## 8. Wymaganie 4 — niezależność od filtrów kolumnowych i widoku domyślnego

To wymaganie jest **już spełnione** i zmiana nie może go zepsuć. Warto jednak pokazać, dlaczego działa, bo to ogranicza zakres testów regresji.

### Mechanika

Widok domyślny **nie jest osobnym trybem filtrowania**. `applyDefaultViewForSheet()` (`app.js:580`) zamienia konfigurację `DEFAULT_VIEW_CONFIG` na zwykłe wpisy w `view.filtersSet[kolumna]`. Dla `passesFilters()` filtr z widoku domyślnego jest nieodróżnialny od filtru postawionego ręcznie przez użytkownika. Wszystkie trzy warstwy — fraza globalna, filtry tekstowe kolumn, filtry listowe kolumn — są łączone operatorem **AND** w jednej funkcji.

### Weryfikacja przykładu „Pisto" + Typ „Boltowa"

Dla zakładki `Bronie` wiersz zostaje pokazany, gdy spełnione są **jednocześnie**:

1. `globalFilter = "pisto"` → sklejona treść widocznych kolumn wiersza zawiera `"pisto"`,
2. filtr listowy użytkownika `view.filtersSet["Typ"] = {"Boltowa"}` → wartość w kolumnie `Typ` to dokładnie `Boltowa`,
3. filtry widoku domyślnego dla `Bronie` (lista 19 dopuszczonych wartości kolumny `Typ`, `app.js:348`) — `Boltowa` jest na tej liście, więc warunek 2 jest węższy i to on decyduje.

Wynik: pistolety boltowe. Zgodnie z oczekiwaniem z promptu. **Bez zmian w kodzie filtrowania.**

### Weryfikacja przykładu przełączenia na „Ekwipunek"

Po zmianie z punktu 6 przejście na `Ekwipunek` zachowuje `globalFilter = "pisto"`, a filtr `Typ = Boltowa` **nie przechodzi** — bo należy do stanu zakładki `Bronie` i tam zostaje. W `Ekwipunek` działają: fraza globalna oraz filtr widoku domyślnego tej zakładki (`Typ` ograniczony do `Ulepszenia Broni`, `Amunicja`, `Ekwipunek Imperium`, `app.js:346`). To jest dokładnie model, którego oczekuje prompt: **fraza jest wspólna, filtry kolumnowe zostają przy swojej zakładce.**

Liczba trafień (użytkownik wskazuje dwa wiersze z ulepszeniami broni) zależy od zawartości bazy. Dane nie są trzymane w repozytorium (`data.json` powstaje z `Repozytorium.xlsx` i ląduje w Firebase pod `/datavault/live`), więc liczby nie dało się sprawdzić statycznie — jest ona **punktem testu akceptacyjnego** w punkcie 12, a nie założeniem tej analizy.

### Na co uważać przy wdrożeniu

Jeden szczegół może ten obraz zaburzyć: **filtr globalny przeszukuje tylko kolumny widoczne** (`cols` z `getColumnOrder()`, `app.js` — pomija `Lp` i `Stan`). Jeżeli fraza pojawia się wyłącznie w kolumnie ukrytej, wiersz się nie pokaże. To zachowanie istnieje dziś i jest raczej pożądane („szukam tego, co widzę"), ale po utrwaleniu frazy na wszystkich zakładkach zacznie być widoczne częściej — zakładki mają różne zestawy kolumn. Warto o tym wspomnieć w `README.md`.

---

## 9. Proponowane rozwiązanie — projekt zmiany

Całość sprowadza się do czterech ruchów:

**R1. Jedna wartość zamiast wielu.** Filtr globalny wyprowadzony ze stanu zakładki do zmiennej modułu `globalFilter`. Pole `global` znika z `createSheetViewState()`, `setCurrentSheetView()`, `persistCurrentSheetView()`, `restoreSheetView()`, `applyDefaultViewForSheet()`, `applyFullViewForSheet()`.

**R2. Jedna droga zapisu.** Funkcja `setGlobalFilter(value)` jako jedyne miejsce ustawiające wartość; oba pola (`#globalSearch`, `#quickSearch`) i żeton `✕` na telefonie wołają wyłącznie ją. Usuwa to ryzyko rozjazdu między polami, które dziś jest łatane ręcznym lustrzanym przypisaniem w dwóch nasłuchach.

**R3. Sygnał na panelu.** `isGlobalFilterActive()` + `updateGlobalFilterIndicator()` + klasa `.panelTitle--active`, wołane ze wszystkich ścieżek zmieniających wartość.

**R4. Nazwa.** `filtersTitle` na `FILTR` / `FILTER`, znak `▸` i reguła `.caret` usunięte.

Zmiana nie dotyka: `passesFilters()` w części kolumnowej, `sortRows()`, `DEFAULT_VIEW_CONFIG`, `buildRenderPlan()` (poza jednym odczytem źródła frazy), modalu filtrów na telefonie, parserów, struktury danych, Firebase.

### Nowy model stanu — porównanie

| | Dziś | Po zmianie |
|---|---|---|
| Fraza globalna | `viewBySheet[zakładka].global` — tyle kopii, ile zakładek | `globalFilter` — jedna wartość |
| Filtry kolumnowe | `viewBySheet[zakładka].filtersText` / `.filtersSet` | bez zmian |
| Sortowanie, zaznaczenia, rozwinięte komórki | `viewBySheet[zakładka]` | bez zmian |
| Sesja | `{sheetViews, toggles, language}` | `{sheetViews, globalFilter, toggles, language}` |

---

## 10. Decyzje do podjęcia przed wdrożeniem

### D1. Czy „Pełen Widok" i „Widok Domyślny" mają czyścić filtr globalny?

Dziś **czyszczą** — obie funkcje zapisują `global: ""` (`app.js:599` i `app.js:612`). Po wyprowadzeniu wartości ze stanu zakładki trzeba świadomie zdecydować, co robi `applyViewModeToAllSheets()`.

| Wariant | Zachowanie | Za | Przeciw |
|---|---|---|---|
| **D1-A (rekomendowany)** | Oba przyciski nadal czyszczą filtr globalny | Zachowuje dzisiejsze zachowanie — zmiana jest wyłącznie dokładaniem funkcji, nic nie zmienia się po cichu. Dymek „Pełen Widok" obiecuje „Wyczyść filtry, sortowanie i zaznaczenia" i nadal mówi prawdę. Użytkownik ma pewne wyjście awaryjne: jedno kliknięcie pokazuje wszystko. | Po wpisaniu frazy i kliknięciu „Widok Domyślny" fraza znika. Skutek jest jednak w pełni widoczny: pole pustoszeje, a czerwony „FILTR" gaśnie. |
| D1-B | Przyciski nie dotykają filtru globalnego | Najczystsza interpretacja słowa „niezależnie" — filtr globalny to osobna warstwa, ma własne drogi czyszczenia. | Zmienia dzisiejsze zachowanie bez prośby użytkownika. Kliknięcie „Pełen Widok" przy aktywnej frazie może dać pustą tabelę mimo nazwy „pełen" — i wymusza korektę tekstów dymków w obu językach. |

### D2. Klucz `sessionStorage`

| Wariant | Skutek |
|---|---|
| **D2-A (rekomendowany)** | Klucz zostaje `datavault_session_view_v2`, `loadSessionState()` migruje starą frazę z pierwszej niepustej zakładki. Nikt nic nie traci. |
| D2-B | Podbicie na `_v3`. Prościej o pięć linii, ale osoby z otwartą kartą tracą przy wdrożeniu ustawienia widoku i zaczynają od widoku domyślnego. |

### D3. Rozróżnienie trzech napisów „filtr"

| Wariant | Skutek |
|---|---|
| **D3-A (rekomendowany)** | Zostawić jak jest. Napisy stoją w zupełnie różnych miejscach ekranu (panel boczny kontra menu przy kolumnie), a menu kolumny zawsze dopisuje nazwę kolumny (`FILTR: Typ`), więc pomyłka jest mało prawdopodobna. |
| D3-B | Zmienić tytuł menu kolumny z `FILTR: <kolumna>` na `FILTR KOLUMNY: <kolumna>`. Jednoznacznie, ale dłuższy napis w wąskim menu i zmiana poza zakresem promptu. |

### D4. Czy `clearRuntimeData()` ma czyścić filtr globalny?

`clearRuntimeData()` (`app.js:1058`) sprząta po utracie dostępu do danych: czyści `DB`, `currentSheet` i zakładki, ale nie dotknie `globalFilter`. Po ponownym zalogowaniu fraza wróci z `sessionStorage` razem z resztą stanu. **Rekomendacja: zostawić bez zmian** — to zachowanie spójne z całą resztą stanu widoku, która też przeżywa wylogowanie w obrębie sesji karty.

---

## 11. Zakres prac — lista plików i miejsc

### `DataVault/index.html`

- [ ] linia 62 — usunąć `<span class="caret">▸</span>`, treść `panelTitle` na `FILTR`, dodać `id="filtersPanelTitle"`.

### `DataVault/app.js`

- [ ] `els` (linie 5-51) — dodać `panelTitle`.
- [ ] `translations.pl.labels.filtersTitle` (69) — `"FILTR"`.
- [ ] `translations.en.labels.filtersTitle` (166) — `"FILTER"`.
- [ ] `translations.*.messages` — nowy klucz `globalFilterActive` w obu językach.
- [ ] po `viewBySheet` / `view` (360-361) — nowa zmienna `globalFilter` z komentarzem PL/EN.
- [ ] `createSheetViewState()` (508) — usunąć `global`.
- [ ] `setCurrentSheetView()` (532) — usunąć `global`.
- [ ] `persistCurrentSheetView()` (545) — usunąć `global`.
- [ ] `restoreSheetView()` (557) — usunąć `global`.
- [ ] `applyDefaultViewForSheet()` (580) — usunąć `global` (zachowanie czyszczenia wg decyzji D1).
- [ ] `applyFullViewForSheet()` (607) — jw.
- [ ] `saveSessionState()` (620) — dopisać `globalFilter` do `payload`.
- [ ] `loadSessionState()` (631) — czytać `parsed.globalFilter` z migracją ze starych `sheetViews[*].global`; usunąć `next.global` (655) i `global` w zapisie (678).
- [ ] `applyViewModeToAllSheets()` (699) — zgodnie z D1; wołać `updateGlobalFilterIndicator()`.
- [ ] `applyLanguage()` (ok. 260-300) — wołać `updateGlobalFilterIndicator()`, żeby dymek zmienił język.
- [ ] nowe funkcje: `isGlobalFilterActive()`, `setGlobalFilter()`, `updateGlobalFilterIndicator()`.
- [ ] `selectSheet()` (1377) — usunąć nadpisywanie `els.global.value`; dodać `updateGlobalFilterIndicator()`.
- [ ] `passesFilters()` (1713) — czytać `globalFilter`.
- [ ] nasłuch `#globalSearch` (2073) — `setGlobalFilter(els.global.value)`.
- [ ] `buildRenderPlan()` (2213) — `searching` z `globalFilter`.
- [ ] `updateSheetTools()` (2285) — synchronizacja `#quickSearch` z `globalFilter`.
- [ ] `renderActiveChips()` (2324-2333) — żeton `✕` woła `setGlobalFilter("")`.
- [ ] nasłuch `#quickSearch` (2668) — `setGlobalFilter(els.quickSearch.value)`.

### `DataVault/style.css`

- [ ] linia 206 — usunąć osieroconą regułę `.caret`.
- [ ] przy `.panelTitle` (207) — dodać `.panelTitle--active` z komentarzem PL/EN.

### Dokumentacja (obowiązek z `AGENTS.md`, rozdz. 1, 2, 3, 8)

- [ ] `DataVault/docs/Documentation.md` — sekcja „Panel filtrów" (od linii 184) i tabela `sheetTools` (linia 208): opisać `globalFilter` jako stan **globalny**, a nie pole `view`; to samo w wersji angielskiej (linie 950 i 974); tabela zachowań (758 / 1521).
- [ ] `DataVault/docs/README.md` — opis pola „Szukaj (globalnie)": powiedzieć wprost, że fraza zostaje przy przełączaniu zakładek, że nagłówek `FILTR` świeci się wtedy na czerwono i jak filtr wyłączyć; to samo w wersji angielskiej (linia 592). Dopisać, że fraza przeszukuje tylko kolumny widoczne.
- [ ] `DetaleLayout.md` — linie 1241 i 1367 (nazwa „FILTRY" w opisie `.panelHeader`), rozdz. 2.3 (dopisać kolor stanu aktywnego), rozdz. 3.6a (dopisać sygnalizację filtru globalnego obok sygnalizacji filtrów kolumnowych), usunąć wzmiankę o `.caret` w kontekście DataVault, jeżeli taka pozostanie.

Pliki **nietykane**: `build_json.py`, `xlsxCanonicalParser.js`, `config/`, wszystkie pozostałe moduły. Zmiana nie ma wpływu na generowanie `data.json` ani `firebase-import.json` (`AGENTS.md`, rozdz. 14).

---

## 12. Plan testów

### Scenariusze z promptu (testy akceptacyjne)

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T1 | Wpisz `Egzo`, przejdź kolejno przez 5 różnych zakładek | W polu cały czas `Egzo`; każda zakładka pokazuje wyłącznie wiersze z frazą; nagłówek `FILTR` czerwony przez cały czas |
| T2 | Wpisz `EGZO`, potem `egzo`, potem `EgZo` | Za każdym razem ten sam zestaw wierszy |
| T3 | Wpisz `Pisto`, przejdź na `Bronie`, w kolumnie `Typ` wybierz `Boltowa` | Widoczne wyłącznie pistolety boltowe |
| T4 | Z T3 przełącz na `Ekwipunek` | Fraza `Pisto` nadal w polu i aktywna; widoczne wiersze z ulepszeniami broni zawierające `pisto` (użytkownik oczekuje dwóch); filtr `Typ = Boltowa` **nie** przeszedł |
| T5 | Z T4 wróć na `Bronie` | Filtr `Typ = Boltowa` wciąż ustawiony, fraza nadal `Pisto` |

### Regresja — stan i trwałość

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T6 | Wpisz frazę, odśwież stronę (F5) | Fraza wraca z `sessionStorage`, nagłówek czerwony, tabela zawężona |
| T7 | Otwórz moduł na starej sesji (zapisanej przed wdrożeniem) z frazą w jednej zakładce | Fraza zostaje podniesiona do poziomu globalnego, nic nie znika (migracja z D2-A) |
| T8 | Wpisz frazę, kliknij `Pełen Widok` | Zgodnie z decyzją D1 (przy D1-A: pole puste, nagłówek zielony, komplet wierszy) |
| T9 | Wpisz frazę, kliknij `Widok Domyślny` | Jw. |
| T10 | Wpisz samą spację | Nagłówek **nie** czerwienieje, tabela pokazuje komplet wierszy |
| T11 | Wyczyść pole do pustego | Nagłówek wraca do zielonego, komplet wierszy |
| T12 | Przełącz język na `English` przy aktywnym filtrze | Nagłówek `FILTER`, nadal czerwony, dymek po angielsku, fraza bez zmian |

### Regresja — telefon (szerokość ≤ 720 px)

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T13 | Wpisz frazę w `Szukaj w tej zakładce`, sprawdź pole w panelu bocznym | Oba pola mają tę samą wartość, nagłówek czerwony |
| T14 | Odwrotnie: wpisz w panelu bocznym, sprawdź pasek narzędzi | Jw. |
| T15 | Stuknij `✕` na żetonie `SZUKAJ: …` | Oba pola puste, nagłówek zielony, komplet wierszy |
| T16 | Przy aktywnej frazie otwórz modal `Filtry`, ustaw filtr kolumny, zatwierdź | Licznik na przycisku zatwierdzenia uwzględnia frazę; po zatwierdzeniu działają oba filtry naraz |
| T17 | Przy aktywnej frazie sprawdź grupowanie kart | Grupy z trafieniami rozwijają się same (do progu `GROUPING_AUTO_EXPAND_MAX`) |

### Regresja — pozostałe

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T18 | Przy aktywnej frazie zaznacz 2 wiersze i kliknij `Porównaj zaznaczone` | Porównanie działa jak dotąd |
| T19 | Tryb admina (`?admin=1`), zakładka `Bestiariusz`, przełącz checkbox starych wpisów przy aktywnej frazie | Fraza i filtry działają łącznie z systemowym ukrywaniem starych wpisów |
| T20 | Wpisz frazę, która nie pasuje nigdzie | Komunikat `BRAK WYNIKÓW`, nagłówek czerwony — użytkownik widzi przyczynę |

---

## 13. Ryzyka

| # | Ryzyko | Prawdopodobieństwo | Skutek | Przeciwdziałanie |
|---|---|---|---|---|
| R1 | **Pominięte miejsce czytające `view.global`.** Zostanie odwołanie do usuniętego pola — zamiast błędu dostaniemy ciche `undefined` i filtr przestanie działać w jednej ścieżce. | Średnie | Wysoki | Po zmianie `grep -n "view.global\|\.global\b" DataVault/app.js` musi nie zwrócić **żadnego** trafienia poza `els.global`. To kryterium odbioru zmiany. |
| R2 | **Użytkownik nie zauważy, że filtr działa na wszystkich zakładkach**, i uzna pustą tabelę za awarię danych. | Średnie | Średni | To właśnie usuwa czerwony `FILTR`. Dodatkowo: dymek `title`, żeton `✕` na telefonie i (przy D1-A) przycisk `Pełen Widok` jako wyjście awaryjne. |
| R3 | **Rozjazd między dwoma polami** (`#globalSearch` i `#quickSearch`). | Niskie | Średni | Jedna droga zapisu `setGlobalFilter()`, która zawsze dotyka obu pól. Dziś lustrzane przypisanie jest robione ręcznie w dwóch osobnych nasłuchach — zmiana ryzyko **zmniejsza**. |
| R4 | **Utrata ustawień widoku przy wdrożeniu**, jeśli wybrany zostanie wariant D2-B. | Pewne przy D2-B | Niski | Wybrać D2-A z migracją. |
| R5 | **Zaznaczenia do porównania przeżywają odfiltrowanie.** Wiersz zaznaczony przed wpisaniem frazy zostaje w `view.selected`, choć zniknął z tabeli — `Porównaj zaznaczone` może porównać wiersze niewidoczne. | Niskie | Niski | **Zachowanie istniejące**, nie wprowadzane tą zmianą. Po utrwaleniu frazy na wszystkich zakładkach trafi się częściej. Do rozważenia osobno (punkt 14). |
| R6 | **Rozjazd dokumentacji.** `Documentation.md`, `README.md` i `DetaleLayout.md` opisują dziś filtr jako pole stanu zakładki i nazwę „FILTRY". | Pewne, jeśli o tym zapomnieć | Średni | Punkt 11 traktować jako listę kontrolną; `AGENTS.md` rozdz. 1, 2, 3 i 8 wymagają aktualizacji przy każdej zmianie kodu. |
| R7 | **Regresja wydajności przy dużych zakładkach.** | Bardzo niskie | Niski | Zmiana nie dokłada operacji; przy aktywnej frazie renderuje się **mniej** wierszy niż dziś. |

---

## 14. Znalezione przy okazji

Obserwacje spoza zakresu promptu. **Żadna nie jest potrzebna do wykonania zadania** — są tu, żeby nie zginęły.

**Z1. Wyszukiwanie jest wrażliwe na polskie znaki.** `passesFilters()` porównuje dosłownie, a `norm()` (`app.js`) sprowadza tylko cudzysłowy i białe znaki — nie zdejmuje diakrytyki. Fraza `lancuchowa` nie znajdzie `Broń łańcuchowa`. Dla polskiej bazy danych to realna niedogodność. Rozwiązanie: `String.prototype.normalize("NFD").replace(/\p{Diacritic}/gu, "")` po obu stronach porównania. Koszt: kilka linii i jedno przejście po ciągu.

**Z2. Fraza wielowyrazowa nie działa jak w wyszukiwarkach.** `"pisto bolt"` jest szukane jako jeden ciąg. Naturalniejsze byłoby rozbicie po spacjach i złączenie warunków AND — użytkownik mógłby zawęzić wynik dopisując słowo. Zmiana w jednej pętli, ale **zmienia znaczenie już wpisanych fraz**, więc to osobna decyzja.

**Z3. Separator `" | "` w sklejonym wierszu.** `cols.map(...).join(" | ")` tworzy jeden ciąg z całego wiersza, więc fraza zawierająca `" | "` mogłaby dopasować się *przez granicę kolumn*. Przypadek skrajnie teoretyczny, ale gdyby robić Z2, warto przy okazji porównywać kolumny osobno zamiast sklejać.

**Z4. Brak przycisku czyszczenia w polu na komputerze.** Na telefonie jest żeton `✕`, na komputerze trzeba ręcznie skasować tekst. Po utrwaleniu frazy na wszystkich zakładkach przycisk `✕` w polu (albo `type="search"`, które daje go natywnie — tak jak ma `#quickSearch`) stałby się użyteczny. **Tanie i dobrze pasuje do tej zmiany** — warto rozważyć w tym samym wdrożeniu.

**Z5. Liczba ukrytych wierszy jako feedback.** Licznik `Pokazano N z M` istnieje dziś tylko w pasku telefonu (`#rowCount`). Na komputerze użytkownik nie wie, ile wierszy odpadło. Czerwony `FILTR` mówi „coś jest włączone", ale nie „ile ukryto".

**Z6. Zaznaczenia do porównania przeżywają odfiltrowanie** — opisane jako R5. Do rozważenia: przy zmianie filtru globalnego albo nie ruszać zaznaczeń (dziś), albo zdejmować zaznaczenie z wierszy, które wypadły (jak robi `pruneHiddenOldBestiarySelection()` dla Bestiariusza).

**Z7. Panel boczny miesza dwie funkcje.** Filtrowanie danych (pole globalne) i sterowanie widocznością zakładek (trzy checkboxy) to dwie różne rzeczy pod jednym nagłówkiem. Zmiana nazwy na liczbę pojedynczą `FILTR` tę niespójność uwypukla. Propozycja na przyszłość: dwie sekcje w panelu — `FILTR` i `WIDOK`.

---

## 15. Rekomendacje

1. **Wdrożyć wariant A** z punktu 6 — filtr globalny jako osobna zmienna modułu, poza stanem zakładki. To jedyne podejście, w którym model danych odpowiada temu, czego oczekuje użytkownik, i które przy okazji usuwa istniejącą dziś możliwość trzymania różnych fraz w różnych zakładkach naraz.
2. **Wprowadzić jedną funkcję zapisu** `setGlobalFilter()`. Oba pola i żeton `✕` mają przez nią przechodzić. Zmniejsza to liczbę miejsc, w których pola mogą się rozjechać, z trzech do zera.
3. **Sygnał aktywności oprzeć na `trim()`**, dokładnie tak jak `passesFilters()` — inaczej czerwony nagłówek kłamałby przy wpisanej spacji.
4. **Użyć czerwieni `rgb(255,120,120)`**, nie `--red`. W tym samym panelu `--red` znaczy dziś „zasady walki" (kategoria), a `rgb(255,120,120)` znaczy w module „filtr włączony" (stan) — i ma wyraźnie lepszy kontrast na czarnym tle.
5. **Decyzje: D1-A, D2-A, D3-A, D4 bez zmian.** Taki zestaw sprawia, że zmiana jest wyłącznie **dokładaniem** funkcji: nic, co działa dziś, nie zaczyna działać inaczej bez wyraźnej prośby.
6. **Uzupełnić dokumentację w tym samym wdrożeniu** (punkt 11) — `README.md` musi powiedzieć wprost, że fraza działa na wszystkich zakładkach i jak ją wyłączyć. To najtańsze zabezpieczenie przed „aplikacja nie pokazuje danych".
7. **Rozważyć Z4** (przycisk czyszczenia w polu na komputerze) jako drobny dodatek w tym samym wdrożeniu — dobrze uzupełnia czerwony sygnał: najpierw informacja „filtr działa", zaraz obok jedno kliknięcie, żeby go zdjąć.
8. **Z1, Z2, Z3, Z5, Z6, Z7 odłożyć.** Każde zmienia zachowanie wykraczające poza prompt i zasługuje na osobną decyzję.

---

## 16. Następne kroki

1. Rozstrzygnąć decyzje **D1-D4** z punktu 10 (rekomendacja: D1-A, D2-A, D3-A, D4 bez zmian).
2. Zdecydować o **Z4** — czy przycisk czyszczenia pola wchodzi w to samo wdrożenie.
3. Wdrożyć **R1-R4** z punktu 9 w `index.html`, `app.js` i `style.css`, z komentarzami PL/EN przy każdym nowym fragmencie (`AGENTS.md`, rozdz. 7).
4. Sprawdzić kryterium odbioru z ryzyka R1: `grep -n "view\.global" DataVault/app.js` bez trafień.
5. Wykonać testy **T1-T20** z punktu 12, w tym potwierdzić liczbę trafień `pisto` w zakładce `Ekwipunek` na żywych danych.
6. Zaktualizować `DataVault/docs/Documentation.md`, `DataVault/docs/README.md` (obie wersje językowe) oraz `DetaleLayout.md`.
7. Zgłosić użytkownikowi do akceptacji wybraną czerwień i zachowanie przycisków widoku — to dwa punkty, w których analiza proponuje rozstrzygnięcie, a nie odtwarza wprost treści promptu.

---

# CZĘŚĆ II — DECYZJE I PROJEKT WDROŻENIA

> Poniższe rozdziały powstały **po** rozstrzygnięciach użytkownika z 21 września 2026. Rozdziały 1-16 opisują stan sprzed decyzji i zostają bez zmian, bo to one uzasadniają podjęte wybory.

---

## 17. Decyzje użytkownika z 21 września 2026

### Prompt z decyzjami (zachowany w całości)

> Moje decyzje:
>
> D1 - zgodnie z rekomendacją wariant A
> D2 - zgodnie z rekomendacją wariant A
> D3 - zgodnie z rekomendacją wariant A
> D4 - zgodnie z rekomendacją.
>
> Z1 - Wprowadź poprawkę. Odnotuj jednak w dokumentacji, że to rozwiązanie pod polską wersję językową. W przypadku modyfikacji modułu pod inny język będzie wymagana korekta.
> Z2 - zostawiamy jak jest. "pisto bolt" ma być szukane jako jedna fraza.
> Z3 - skoro nie modyfikujemy Z2 to nieistotne.
> Z4 - na PC można zaznaczyć tekst i nacisnąć Backspace. Nie trzeba specjalnego przycisku. Dodatkowy przycisk tylko zaśmieci widok
> Z5 - nie ma potrzeby dodawania tego. Wystarczy feedback, że jest założony filtr. Ilość ukrytych wierszy nie jest istotna dla użytkownika.
> Z6 - Zaznaczenie do porównania niech przetrwa zmianę filtrów.
> Z7 - Nie chcę rozbijać lewego panelu. Możesz zmienić nazwę "FILTR" na "NARZĘDZIA".
>
> Odnośnie Z6 - obecnie jak jest możliwość porównania wierszy to przycisk "PORÓWNAJ ZAZNACZONE" się podświetla. To dobre rozwiązanie. Jednak w związku z modyfikacjami będzie potrzeby dodatkowy przycisk, który usuwa wszystkie zaznaczenia do porównania. Może on być obok i być domyślnie "wyszarzony"/"nieaktywny" (kolor jak "Czy wyświetlić zdezaktualizowane wpisy?"). Dopiero jak się zaznaczy przynajmniej jedno pole do porównania to się uaktywnia i można go nacisnąć.
>
> "Dwie rzeczy wymagają Twojej decyzji"
> 1. Czerwień - zgadzam się na Twoją rekomendację
> 2. Czy „Pełen Widok" i „Widok Domyślny" mają nadal czyścić filtr globalny? zgodnie z D1 - tak, mają czyścić.
>
> Dopisz to wszystko do analizy. Czy jesteśmy gotowi do wdrożenia, czy trzeba jeszcze coś wyjaśnić?

### Rozstrzygnięcia — tabela zbiorcza

| Punkt | Decyzja | Skutek dla zakresu prac |
|---|---|---|
| **D1** | Wariant **A** — „Pełen Widok" i „Widok Domyślny" **nadal czyszczą** filtr globalny | `applyViewModeToAllSheets()` woła `setGlobalFilter("")`. Dymki obu przycisków zostają bez zmian, bo nadal mówią prawdę. |
| **D2** | Wariant **A** — klucz `datavault_session_view_v2` **zostaje**, z migracją starej frazy | `loadSessionState()` czyta `parsed.globalFilter`, a przy jego braku bierze pierwszą niepustą frazę ze starych `sheetViews[*].global`. Nikt nic nie traci przy wdrożeniu. |
| **D3** | Wariant **A** — tytuł menu filtra kolumny zostaje `FILTR: <kolumna>` | Brak prac. Patrz jednak rozdz. 18: pod wariantem D5-A kolizja i tak słabnie. |
| **D4** | Zgodnie z rekomendacją — `clearRuntimeData()` **nie czyści** filtru globalnego | Brak prac. |
| **Z1** | **Wdrożyć** wyszukiwanie niewrażliwe na polskie znaki, z adnotacją w dokumentacji, że jest pisane pod polską wersję językową | Nowa funkcja `foldPolish()` + zmiana w `passesFilters()` + adnotacje w `Documentation.md`, `README.md` i przy punkcie rozszerzania języków w `app.js`. Szczegóły: rozdz. 19. |
| **Z2** | **Bez zmian** — `"pisto bolt"` ma być szukane jako jedna fraza | Brak prac. |
| **Z3** | Bezprzedmiotowe wobec decyzji Z2 | Brak prac. |
| **Z4** | **Odrzucone** — na komputerze wystarczy zaznaczenie tekstu i `Backspace`; dodatkowy przycisk zaśmieca widok | Brak prac. Pole `#globalSearch` zostaje zwykłym `type="text"`. |
| **Z5** | **Odrzucone** — liczba ukrytych wierszy nie jest istotna; wystarczy informacja, że filtr jest założony | Brak prac. Licznik `Pokazano N z M` zostaje tam, gdzie jest dziś, czyli wyłącznie w pasku telefonu. |
| **Z6** | Zaznaczenia **przeżywają** zmianę filtrów (stan dzisiejszy) **+ nowy przycisk czyszczący zaznaczenia** | Nowy przycisk obok `Porównaj zaznaczone`. Szczegóły: rozdz. 20. |
| **Z7** | Panelu **nie rozbijamy**. Nazwa `FILTR` może zostać zmieniona na `NARZĘDZIA` | **Wymaga rozstrzygnięcia** — koliduje z wymaganiem 1 i 3 z pierwotnego promptu. Szczegóły i warianty: rozdz. 18. |
| **Czerwień** | Zgoda na rekomendację — `rgb(255,120,120)` z poświatą `rgba(255,85,85,.35)` | Jak w rozdz. 7. |

### Co z tego wynika dla zakresu

Trzy decyzje **zdejmują** pracę z pierwotnego szkicu: Z2, Z4 i Z5 zostają bez zmian, więc pole wyszukiwania i pasek narzędzi nie są ruszane poza tym, co wynika z utrwalenia frazy.

Dwie decyzje **dokładają** pracę: Z1 (składanie polskich znaków) i Z6 (nowy przycisk). Obie są niezależne od trzonu zmiany — można je wdrożyć osobno, gdyby zaszła potrzeba podziału na etapy.

Jedna decyzja **otwiera nowe pytanie**: Z7. Opisane niżej.

---

## 18. D5 — kolizja nazw `FILTR` i `NARZĘDZIA` (do rozstrzygnięcia)

### Na czym polega problem

Pierwotny prompt zawiera dwa powiązane wymagania:

> Po pierwsze trzeba zmienić nazwę z "▸FILTRY" na "FILTR".
>
> Jeżeli filtr globalny jest aktywny to **nazwa "FILTR" na panelu bocznym ma być czerwona**, żeby użytkownik miał feedback, że coś wpisał.

Decyzja Z7 mówi natomiast:

> Nie chcę rozbijać lewego panelu. Możesz zmienić nazwę "FILTR" na "NARZĘDZIA".

Jeżeli nagłówek panelu otrzyma nazwę `NARZĘDZIA`, to **na panelu bocznym nie ma już napisu `FILTR`, który miałby się czerwienić**. Sygnalizacja z wymagania 3 traci swoje zaczepienie. Dlatego potrzebna jest jedna dodatkowa decyzja.

Słowo „Możesz" odczytuję jako propozycję rozwiązania niespójności podniesionej w Z7 (panel mieści filtr **oraz** przełączniki widoczności zakładek, więc nazwa w liczbie pojedynczej opisuje tylko pierwszy element), a nie jako polecenie zrezygnowania z czerwonego sygnału. Poniższe warianty wychodzą z tego założenia.

### Warianty

| Wariant | Nagłówek panelu | Co się czerwieni | Ocena |
|---|---|---|---|
| **D5-A (rekomendowany)** | `NARZĘDZIA` | Etykieta nad polem wyszukiwania, zmieniona z `Szukaj (globalnie)` na **`FILTR GLOBALNY`** | Spełnia **jednocześnie** wymaganie 3 i decyzję Z7. Nagłówek uczciwie nazywa całą zawartość panelu, a napis `FILTR GLOBALNY` istnieje na panelu bocznym, czerwieni się i stoi **bezpośrednio nad polem, którego dotyczy** — czyli bliżej przyczyny niż nagłówek dwa wiersze wyżej. Zachowuje też informację „globalnie", która jest tu najważniejsza: mówi, że filtr działa na wszystkich zakładkach. |
| D5-B | `NARZĘDZIA` | Nagłówek `NARZĘDZIA` | Najmniej pracy, ale sygnał kłamie: na czerwono świeci się słowo opisujące **cały panel**, w tym przełączniki zakładek, które z filtrem nie mają nic wspólnego. Użytkownik widzi „coś w narzędziach jest włączone", a nie „filtr jest założony". |
| D5-C | `FILTR` | Nagłówek `FILTR` | Dosłownie zgodne z pierwotnym promptem, zerowa niejednoznaczność. Zostawia jednak niespójność z Z7: nagłówek w liczbie pojedynczej nadal opisuje panel, w którym są też trzy przełączniki i blok podpowiedzi. |

### Dlaczego D5-A

1. **Nic nie ginie.** Nagłówek `NARZĘDZIA` rozwiązuje to, co użytkownik chciał rozwiązać w Z7, a napis `FILTR GLOBALNY` realizuje wymaganie 3 z pierwotnego promptu. Żadne z dwóch poleceń nie jest poświęcone na rzecz drugiego.
2. **Sygnał trafia we właściwe miejsce.** Czerwień pojawia się przy polu, w które użytkownik wpisał frazę, a nie przy nagłówku obejmującym też checkboxy.
3. **Etykieta zyskuje na treści.** `Szukaj (globalnie)` opisuje czynność, `FILTR GLOBALNY` opisuje **stan**, który może być włączony — a to jest dokładnie to, co ma sygnalizować kolor.
4. **Słabnie kolizja z D3.** `FILTR GLOBALNY` obok `FILTR: Typ` czyta się jednoznacznie: pierwszy ma przymiotnik zakresu, drugi nazwę kolumny. Decyzja D3-A (nie ruszać menu kolumny) pozostaje słuszna.

### Co zmienia D5-A względem projektu z rozdz. 7

| Element | Rozdz. 7 (przed decyzjami) | Po D5-A |
|---|---|---|
| Zaczepienie sygnału | `<span class="panelTitle" id="filtersPanelTitle">` | `<div class="fieldLabel" id="globalFilterLabel">` |
| Klasa stanu | `.panelTitle--active` | `.fieldLabel--active` |
| Klucz i18n nagłówka | `filtersTitle: "FILTR" / "FILTER"` | `filtersTitle: "NARZĘDZIA" / "TOOLS"` |
| Klucz i18n etykiety | `globalSearchLabel: "Szukaj (globalnie)"` bez zmian | `globalSearchLabel: "FILTR GLOBALNY" / "GLOBAL FILTER"` |
| Reszta mechaniki | — | bez zmian: `isGlobalFilterActive()`, `updateGlobalFilterIndicator()`, kolor, dymek |

Szkic HTML pod D5-A:

```html
<div class="panelHeader">
  <span class="panelTitle" data-i18n="filtersTitle">NARZĘDZIA</span>
</div>
<div class="panelBody">
  <label class="field">
    <div class="fieldLabel" id="globalFilterLabel" data-i18n="globalSearchLabel">FILTR GLOBALNY</div>
    <input id="globalSearch" class="input" placeholder="np. Pist, Brutalna, IMPERIUM, Zatrucie (5)..." />
  </label>
```

Szkic CSS pod D5-A:

```css
/* PL: Aktywny filtr globalny zapala etykietę pola na czerwono — tą samą czerwienią, którą moduł
   oznacza aktywne filtry kolumnowe, żeby oba sygnały znaczyły dla użytkownika to samo. Etykieta,
   a nie nagłówek panelu, bo sygnał ma wskazywać konkretne pole, a nie cały panel narzędzi.
   EN: An active global filter turns the field label red — the same red the module uses for active
   column filters, so both signals mean the same thing to the user. The label rather than the panel
   header, because the signal must point at one field, not at the whole tools panel. */
.fieldLabel--active{
  color:rgb(255,120,120);
  text-shadow:0 0 10px rgba(255,85,85,.35);
}
```

**To jedyna otwarta kwestia przed wdrożeniem.** Pozostałe rozdziały zakładają wariant D5-A; przejście na D5-B albo D5-C to zmiana trzech linii (identyfikator elementu, nazwa klasy, wartości kluczy i18n) i nie rusza niczego innego.

---

## 19. Z1 — wyszukiwanie niewrażliwe na polskie znaki

### Pułapka: `normalize("NFD")` nie rozkłada `ł`

Szkic z rozdz. 14 („`normalize("NFD").replace(/\p{Diacritic}/gu, "")`") jest **niekompletny dla języka polskiego**. Sprawdzone w środowisku Node:

```
wejście        : ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ Broń łańcuchowa
po samym NFD   : acełnoszz ACEŁNOSZZ Bron łancuchowa
                    ^                        ^
"ł".normalize("NFD").length === 1   → brak rozkładu
"ą".normalize("NFD").length === 2   → rozłożone na "a" + ogonek
```

Powód: `ą`, `ć`, `ę`, `ń`, `ó`, `ś`, `ź`, `ż` to w Unicode litera bazowa plus znak łączący, więc `NFD` je rozdziela i znak łączący daje się usunąć. Natomiast `ł` (U+0142) i `Ł` (U+0141) to **osobne litery bez rozkładu kanonicznego** — `NFD` ich nie rusza. Bez jawnej podmiany fraza `lancuchowa` nadal nie znalazłaby `Broń łańcuchowa`, czyli poprawka nie zadziałałaby w najczęstszym polskim przypadku.

### Proponowana funkcja

```js
// --- Składanie polskich znaków diakrytycznych na potrzeby wyszukiwania / Folding Polish diacritics for search ---
// PL: Dzięki temu fraza "lancuchowa" znajduje "Broń łańcuchowa", a "zywotnosc" znajduje "Żywotność".
// normalize("NFD") rozkłada ą, ć, ę, ń, ó, ś, ź, ż na literę bazową i znak łączący, który następnie
// usuwamy zakresem U+0300-U+036F. NIE rozkłada jednak ł ani Ł — te znaki nie mają rozkładu
// kanonicznego w Unicode, więc podmieniamy je wprost, już po sprowadzeniu tekstu do małych liter.
// UWAGA JĘZYKOWA: reguła jest napisana pod polską wersję językową modułu. Inny język będzie wymagał
// własnego zestawu podmian znaków nierozkładalnych (np. niemieckie ß, duńskie ø, tureckie ı).
// EN: This makes the phrase "lancuchowa" find "Broń łańcuchowa" and "zywotnosc" find "Żywotność".
// normalize("NFD") splits ą, ć, ę, ń, ó, ś, ź, ż into a base letter and a combining mark, which we
// then strip with the U+0300-U+036F range. It does NOT decompose ł or Ł — those characters have no
// canonical decomposition in Unicode, so they are replaced explicitly, after lowercasing.
// LANGUAGE NOTE: the rule is written for the Polish version of the module. Another language will
// need its own replacements for non-decomposable characters (e.g. German ß, Danish ø, Turkish ı).
function foldPolish(text){
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l");
}
```

Zakres `[̀-ͯ]` zamiast `\p{Diacritic}` jest celowy: obejmuje dokładnie te znaki łączące, o które chodzi, i nie wymaga flagi `u` ani wsparcia dla właściwości Unicode w wyrażeniach regularnych.

Kolejność operacji ma znaczenie: `toLowerCase()` **przed** podmianą `ł`, dzięki czemu jedna reguła obsługuje `Ł` i `ł` naraz.

### Zastosowanie w `passesFilters()`

```js
function passesFilters(row, cols){
  // PL: Filtr globalny jest wspólny dla wszystkich zakładek i niewrażliwy na wielkość liter oraz na
  // polskie znaki diakrytyczne — obie strony porównania przechodzą przez foldPolish().
  // EN: The global filter is shared by every sheet and insensitive to letter case and to Polish
  // diacritics — both sides of the comparison go through foldPolish().
  const g = foldPolish(globalFilter).trim();
  if (g){
    const hay = foldPolish(cols.map(c => String(row[c] ?? "")).join(" | "));
    if (!hay.includes(g)) return false;
  }
  ...
}
```

Zgodnie z decyzją Z2 fraza pozostaje **jednym ciągiem** — `"pisto bolt"` szukane jest dosłownie, bez rozbijania po spacjach.

### Weryfikacja

Funkcja sprawdzona w Node na ośmiu próbkach, w obie strony (użytkownik pisze z ogonkami i bez):

| Fraza wpisana | Szukany tekst | Wynik |
|---|---|---|
| `lancuchowa` | `Broń łańcuchowa Astartes` | znajduje |
| `LANCUCHOWA` | `Broń łańcuchowa Astartes` | znajduje |
| `łańcuchowa` | `Broń łańcuchowa Astartes` | znajduje |
| `bron` | `Broń biała` | znajduje |
| `egzo` | `Egzotyczna broń biała` | znajduje |
| `zywotnosc` | `Żywotność` | znajduje |
| `swiatlo` | `Światło` | znajduje |
| `pisto` | `Pistolet bolterowy` | znajduje |

### Czy filtry kolumnowe też mają składać znaki?

**Rekomendacja: nie w tym wdrożeniu.** Decyzja użytkownika dotyczy filtru globalnego. Objęcie `view.filtersText` tą samą regułą byłoby spójne, ale to zmiana zachowania filtrów kolumnowych, o którą nikt nie prosił, a filtry listowe (`view.filtersSet`) operują na **dokładnych wartościach** ze słownika i składania znaków nie potrzebują. Do rozważenia osobno, jeśli okaże się potrzebne w praktyce.

### Koszt wydajnościowy i co z nim zrobić

`foldPolish()` jest droższe od dzisiejszego `toLowerCase()` — dokłada `normalize("NFD")` i dwa przejścia podmieniające. Koszt ponoszony jest **dla każdego wiersza przy każdym naciśnięciu klawisza**.

Rekomendacja: **wdrożyć wersję prostą i zmierzyć na zakładce `Bestiariusz`**, która ma najwięcej wierszy i najdłuższe teksty. Jeżeli pisanie w polu zacznie zauważalnie zacinać, dołożyć pamięć podręczną na wiersz:

```js
// PL: Złożona postać wiersza liczona jest raz i odkładana pod kluczem z prefiksem "__", który
// getColumnOrder() pomija, więc nie pojawi się jako kolumna. Dane w wierszu się nie zmieniają,
// a DB powstaje od nowa przy każdym wczytaniu, więc pamięć podręczna nie wymaga unieważniania.
// EN: The folded form of a row is computed once and cached under a "__"-prefixed key, which
// getColumnOrder() skips, so it never shows up as a column. Row data does not change and DB is
// rebuilt on every load, so the cache needs no invalidation.
function foldedRow(row, cols){
  if (typeof row.__fold !== "string"){
    row.__fold = foldPolish(cols.map(c => String(row[c] ?? "")).join(" | "));
  }
  return row.__fold;
}
```

Warunek poprawności tej pamięci podręcznej: wiersz należy zawsze do jednej zakładki, a `cols` dla zakładki jest stałe w obrębie wczytanych danych. Oba warunki są dziś spełnione (`DB.sheets[nazwa]._cols` wyliczane raz w `buildTableSkeleton()`). Gdyby kiedyś powstała możliwość zmiany zestawu kolumn bez przeładowania danych, pamięć podręczną trzeba będzie czyścić.

### Adnotacje wymagane decyzją użytkownika

Użytkownik prosi wprost o odnotowanie, że rozwiązanie jest pisane pod język polski. Adnotacja musi trafić w **trzy** miejsca:

1. **Komentarz PL/EN przy samej funkcji** `foldPolish()` — powyżej, sekcja „UWAGA JĘZYKOWA / LANGUAGE NOTE".
2. **Blok `MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`** w `app.js` (istnieje dziś w dwóch miejscach, m.in. nad `translations` i nad `KEYWORD_SHEETS_COMMA_NEUTRAL`) — dopisać `foldPolish()` do listy rzeczy wymagających korekty przy dodaniu nowego języka.
3. **`DataVault/docs/Documentation.md`**, w obu wersjach językowych — osobny akapit o tym, że składanie znaków obejmuje polski zestaw diakrytyków i że `ł`/`Ł` wymagają jawnej podmiany, bo `NFD` ich nie rozkłada.

W `README.md` adnotacja techniczna nie jest potrzebna — instrukcja użytkownika ma powiedzieć tylko tyle, że *„nie trzeba pisać polskich znaków: `bron` znajdzie `Broń`"*.

---

## 20. Z6 — przycisk czyszczenia zaznaczeń

### Część pierwsza: zaznaczenia przeżywają zmianę filtrów

**Brak prac.** To jest dzisiejsze zachowanie: `view.selected` jest niezależne od `view.filtersText`, `view.filtersSet` i filtru globalnego, a `passesFilters()` nie zagląda do zaznaczeń. Ryzyko R5 z rozdz. 13 zostaje zatem **świadomie zaakceptowane** i przestaje być ryzykiem — staje się decyzją projektową, której nowy przycisk jest przeciwwagą.

Jedyny wyjątek pozostaje bez zmian: `pruneHiddenOldBestiarySelection()` (`app.js:499`) zdejmuje zaznaczenie z wierszy Bestiariusza ukrytych **systemowo** (stare wpisy przy wyłączonym checkboxie admina). To ukrycie systemowe, nie filtr użytkownika, więc nie koliduje z decyzją Z6.

### Część druga: nowy przycisk

#### Stan dzisiejszy

| Element | Zachowanie |
|---|---|
| `#btnCompare` | `disabled` dopóki `view.selected.size < 2` (`app.js:1795`, `1818`) |
| Zaznaczenia | `view.selected` — zbiór `__id`, **osobny dla każdej zakładki** |
| Porównanie | `openCompareModal()` działa wyłącznie na `currentSheet` (`app.js:2031`) |
| Ustawianie stanu przycisku | **cztery** rozproszone przypisania: `app.js:1381`, `1769`, `1795`, `1818` |

#### Projekt

| Cecha | Ustalenie |
|---|---|
| Identyfikator | `btnClearSelection` |
| Położenie | w `.actions`, **bezpośrednio za** `#btnCompare` |
| Etykieta | PL `Wyczyść zaznaczone`, EN `Clear selection` (nowy klucz `clearSelectionButton`) |
| Stan nieaktywny | `disabled` dopóki `view.selected.size < 1` |
| Stan aktywny | od **pierwszego** zaznaczonego wiersza — niżej niż próg `Porównaj zaznaczone`, który wymaga dwóch |
| Wygląd nieaktywny | kolor archiwalny `var(--text-old)` / `#7f9b7f`, jak kontrolka „Czy wyświetlić zdezaktualizowane wpisy?" |
| Zasięg działania | **bieżąca zakładka** — patrz uzasadnienie niżej |

#### Zasięg — dlaczego bieżąca zakładka

Przycisk stoi obok `Porównaj zaznaczone` i lustrzanie odbija jego stan. Skoro porównanie działa wyłącznie na bieżącej zakładce, czyszczenie obejmujące wszystkie zakładki byłoby niespójne: przycisk zapalałby się od zaznaczeń w **tej** zakładce, a kasował zaznaczenia w **każdej**, także takie, których użytkownik w tej chwili nie widzi i o których mógł zapomnieć. To zachowanie zaskakujące i nieodwracalne.

Jeżeli jednak intencją było „wyczyść wszystko wszędzie", wystarczy pętla po `viewBySheet` zamiast jednego `view.selected.clear()` — zmiana czterech linii. **Do potwierdzenia przy odbiorze**, jeśli zasięg na bieżącą zakładkę okaże się niewystarczający.

#### Szkic HTML

```html
<button class="btn primary" id="btnCompare" disabled data-i18n="compareButton">Porównaj zaznaczone</button>
<!-- Przycisk zdejmujący wszystkie zaznaczenia w bieżącej zakładce. Uaktywnia się już przy jednym
     zaznaczonym wierszu, czyli wcześniej niż "Porównaj zaznaczone", które wymaga dwóch — bo
     pojedyncze zaznaczenie też trzeba umieć wycofać.
     A button that drops every selection in the current sheet. It becomes active at one selected
     row, earlier than "Compare selected", which needs two — because a single selection has to be
     revocable too. -->
<button class="btn secondary" id="btnClearSelection" disabled data-i18n="clearSelectionButton">Wyczyść zaznaczone</button>
```

#### Szkic CSS

```css
/* PL: Nieaktywny przycisk czyszczenia zaznaczeń używa koloru archiwalnego, tego samego co kontrolka
   zdezaktualizowanych wpisów Bestiariusza — ma być czytelnie wyszarzony, a nie przygaszony
   półprzezroczystością, dlatego znosimy opacity z reguły bazowej .btn:disabled.
   EN: The disabled clear-selection button uses the archival colour, the same as the outdated-Bestiary
   control — it should read as greyed out rather than faded, hence opacity from the base
   .btn:disabled rule is overridden. */
#btnClearSelection:disabled{
  opacity:1;
  color:var(--text-old);
  border-color:rgba(127,155,127,.35);
  background:rgba(127,155,127,.08);
}
```

#### Szkic JS — jedno miejsce zamiast czterech

```js
// PL: Oba przyciski zależą od tego samego zbioru zaznaczeń, tylko od innych progów: porównanie
// wymaga dwóch wierszy, czyszczenie ma sens już przy jednym. Trzymamy to w jednej funkcji, żeby
// żadna ścieżka zmieniająca zaznaczenia nie zapomniała odświeżyć któregoś z nich.
// EN: Both buttons depend on the same selection set, only at different thresholds: comparing needs
// two rows, clearing makes sense from one. Keeping it in a single function means no path that
// changes the selection can forget to refresh either button.
function updateSelectionButtons(){
  const count = view?.selected?.size || 0;
  if (els.btnCompare) els.btnCompare.disabled = count < 2;
  if (els.btnClearSelection) els.btnClearSelection.disabled = count < 1;
}

if (els.btnClearSelection){
  els.btnClearSelection.addEventListener("click", ()=>{
    if (!view?.selected?.size) return;
    view.selected.clear();
    updateSelectionButtons();
    // Pełne przerysowanie, a nie odznaczenie samych widocznych pól wyboru: w układzie kart nagłówek
    // grupy pokazuje ptaszek, gdy grupa zawiera zaznaczony wiersz, więc bez przerysowania ten
    // znacznik zostałby nieaktualny na zwiniętych grupach.
    // A full redraw rather than unticking the visible checkboxes: in the card layout a group header
    // shows a tick when the group holds a selected row, so without a redraw that marker would go
    // stale on collapsed groups.
    renderBody();
    saveSessionState();
  });
}
```

Cztery dotychczasowe przypisania `els.btnCompare.disabled = ...` (`app.js:1381`, `1769`, `1795`, `1818`) zastępuje wywołanie `updateSelectionButtons()`. Piąte miejsce wymagające wywołania to `pruneHiddenOldBestiarySelection()` — dziś nie odświeża przycisku po zdjęciu zaznaczeń, co jest **istniejącym drobnym defektem**: po ukryciu starych wpisów Bestiariusza `Porównaj zaznaczone` może zostać aktywny mimo spadku liczby zaznaczeń poniżej dwóch. Przy okazji tej zmiany warto to naprawić.

---

## 21. Zaktualizowany zakres prac

Zastępuje rozdz. 11. Zakłada warianty **D1-A, D2-A, D3-A, D4 bez zmian, D5-A**.

### `DataVault/index.html`

- [ ] linia 62 — usunąć `<span class="caret">▸</span>`; treść `panelTitle` na `NARZĘDZIA`.
- [ ] linia 66 — `fieldLabel` dostaje `id="globalFilterLabel"`, treść domyślna `FILTR GLOBALNY`.
- [ ] po `#btnCompare` — dodać `#btnClearSelection` z komentarzem PL/EN.

### `DataVault/app.js`

**Trzon zmiany (filtr globalny)**

- [ ] `els` — dodać `globalFilterLabel` i `btnClearSelection`.
- [ ] `labels.filtersTitle` — PL `"NARZĘDZIA"`, EN `"TOOLS"`.
- [ ] `labels.globalSearchLabel` — PL `"FILTR GLOBALNY"`, EN `"GLOBAL FILTER"`.
- [ ] `labels.clearSelectionButton` — PL `"Wyczyść zaznaczone"`, EN `"Clear selection"`.
- [ ] `messages.globalFilterActive` — nowy klucz w obu językach.
- [ ] nowa zmienna modułu `globalFilter` obok `viewBySheet` / `view` (linie 360-361).
- [ ] usunąć pole `global` z: `createSheetViewState()` (511), `setCurrentSheetView()` (535), `persistCurrentSheetView()` (549), `restoreSheetView()` (572), `applyDefaultViewForSheet()` (599), `applyFullViewForSheet()` (612).
- [ ] `saveSessionState()` (620) — dopisać `globalFilter` do `payload`.
- [ ] `loadSessionState()` (631) — czytać `parsed.globalFilter` z migracją ze starych `sheetViews[*].global`; usunąć `next.global` (655) i `global` w zapisie (678).
- [ ] `applyViewModeToAllSheets()` (699) — `setGlobalFilter("")` zgodnie z D1-A.
- [ ] `applyLanguage()` — wołać `updateGlobalFilterIndicator()`.
- [ ] nowe funkcje: `isGlobalFilterActive()`, `setGlobalFilter()`, `updateGlobalFilterIndicator()`.
- [ ] `selectSheet()` (1377) — usunąć nadpisywanie `els.global.value`; dodać `updateGlobalFilterIndicator()`.
- [ ] nasłuch `#globalSearch` (2073) → `setGlobalFilter(els.global.value)`.
- [ ] nasłuch `#quickSearch` (2668) → `setGlobalFilter(els.quickSearch.value)`.
- [ ] `buildRenderPlan()` (2213) — `searching` z `globalFilter`.
- [ ] `updateSheetTools()` (2285) — synchronizacja `#quickSearch` z `globalFilter`.
- [ ] `renderActiveChips()` (2324-2333) — żeton `✕` woła `setGlobalFilter("")`.

**Z1 — składanie polskich znaków**

- [ ] nowa funkcja `foldPolish()` z komentarzem PL/EN i adnotacją językową.
- [ ] `passesFilters()` (1713) — użyć `foldPolish()` po obu stronach porównania frazy globalnej.
- [ ] bloki `MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT` — dopisać `foldPolish()`.

**Z6 — przycisk czyszczenia zaznaczeń**

- [ ] nowa funkcja `updateSelectionButtons()`.
- [ ] zastąpić nią przypisania `els.btnCompare.disabled` w liniach 1381, 1769, 1795, 1818.
- [ ] `pruneHiddenOldBestiarySelection()` (499) — dołożyć wywołanie `updateSelectionButtons()` (naprawa istniejącego drobnego defektu).
- [ ] nasłuch `#btnClearSelection`.

### `DataVault/style.css`

- [ ] linia 206 — usunąć osieroconą regułę `.caret`.
- [ ] dodać `.fieldLabel--active` (czerwień `rgb(255,120,120)` + poświata).
- [ ] dodać `#btnClearSelection:disabled` (kolor archiwalny, `opacity:1`).

### Dokumentacja

- [ ] `DataVault/docs/Documentation.md` — obie wersje językowe: `globalFilter` jako stan globalny; `foldPolish()` wraz z adnotacją o `ł`/`Ł` i o tym, że reguła jest pisana pod polski; `updateSelectionButtons()` i nowy przycisk; zaktualizowana tabela `sheetTools` (208 / 974) i tabela zachowań (758 / 1521).
- [ ] `DataVault/docs/README.md` — obie wersje językowe: fraza zostaje przy przełączaniu zakładek; czerwony napis `FILTR GLOBALNY` jako sygnał; jak filtr wyłączyć (skasowanie treści pola, żeton `✕` na telefonie, przyciski `Pełen Widok` / `Widok Domyślny`); że nie trzeba pisać polskich znaków; że fraza przeszukuje tylko kolumny widoczne; do czego służy `Wyczyść zaznaczone` i dlaczego bywa wyszarzony.
- [ ] `DetaleLayout.md` — nazwa panelu w liniach 1241 i 1367; rozdz. 2.3 o kolorze stanu aktywnego i o wyglądzie nieaktywnego `#btnClearSelection`; rozdz. 3.6a o sygnalizacji filtru globalnego obok sygnalizacji filtrów kolumnowych.

Pliki **nietykane**: `build_json.py`, `xlsxCanonicalParser.js`, `config/`, wszystkie pozostałe moduły. Bez wpływu na generowanie `data.json` i `firebase-import.json` (`AGENTS.md`, rozdz. 14).

---

## 22. Zaktualizowany plan testów

Testy **T1-T20** z rozdz. 12 obowiązują bez zmian, z dwoma korektami wynikającymi z D5-A:

- w **T1**, **T4**, **T10**, **T11**, **T12**, **T20** zamiast „nagłówek `FILTR`" czytaj „etykieta `FILTR GLOBALNY` nad polem",
- w **T12** nagłówek panelu ma się zmienić na `TOOLS`, a etykieta na `GLOBAL FILTER`.

### Nowe testy — Z1 (polskie znaki)

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T21 | Wpisz `lancuchowa` w zakładce `Bronie` | Znalezione wiersze `Broń łańcuchowa` i `Broń łańcuchowa Astartes` |
| T22 | Wpisz `łańcuchowa` (z polskimi znakami) | Ten sam zestaw wierszy co w T21 |
| T23 | Wpisz `LANCUCHOWA` wersalikami | Ten sam zestaw wierszy co w T21 |
| T24 | Wpisz `bron` | Znalezione wiersze zawierające `Broń` |
| T25 | Wpisz `zywotnosc` w zakładce `Pojazdy` | Znalezione wiersze z kolumną `Żywotność` |
| T26 | Wpisz frazę w filtrze **kolumnowym** (nie globalnym) bez polskich znaków | Zachowanie **niezmienione** — filtry kolumnowe nie składają znaków (świadoma decyzja z rozdz. 19) |
| T27 | Wpisz długą frazę w `Bestiariusz`, obserwuj płynność pisania | Brak zauważalnego zacinania; jeśli występuje — wdrożyć pamięć podręczną z rozdz. 19 |

### Nowe testy — Z6 (przycisk czyszczenia)

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T28 | Wejdź na zakładkę bez zaznaczeń | `Wyczyść zaznaczone` nieaktywny, w kolorze archiwalnym `#7f9b7f`, bez przygaszenia półprzezroczystością |
| T29 | Zaznacz **jeden** wiersz | `Wyczyść zaznaczone` **aktywny**, `Porównaj zaznaczone` nadal nieaktywny |
| T30 | Zaznacz **drugi** wiersz | Oba przyciski aktywne |
| T31 | Kliknij `Wyczyść zaznaczone` | Wszystkie zaznaczenia w tej zakładce znikają, oba przyciski wracają do stanu nieaktywnego, wiersze tracą podświetlenie |
| T32 | Zaznacz wiersze, wpisz frazę ukrywającą je, usuń frazę | Zaznaczenia **przetrwały** (decyzja Z6), przyciski w stanie zgodnym z liczbą zaznaczeń |
| T33 | Zaznacz wiersze w zakładce A, przejdź do B, wróć do A | Zaznaczenia w A nietknięte; w B przyciski nieaktywne |
| T34 | Telefon: zaznacz wiersz w zwiniętej grupie, kliknij `Wyczyść zaznaczone` | Ptaszek przy nagłówku grupy znika (wymusza to pełne przerysowanie z rozdz. 20) |
| T35 | Tryb admina, `Bestiariusz`: zaznacz 2 stare wpisy, odznacz checkbox „Czy wyświetlić zdezaktualizowane wpisy?" | Zaznaczenia zdjęte przez `pruneHiddenOldBestiarySelection()`, **oba przyciski poprawnie wygaszone** (naprawa defektu) |

---

## 23. Zaktualizowane ryzyka

Ryzyka **R1-R4, R6, R7** z rozdz. 13 obowiązują bez zmian. Zmiany i uzupełnienia:

| # | Ryzyko | Status |
|---|---|---|
| R5 | Zaznaczenia przeżywają odfiltrowanie | **Zamknięte jako decyzja.** Użytkownik potwierdził, że taki ma być zamysł (Z6), a nowy przycisk `Wyczyść zaznaczone` daje jednoznaczną drogę wycofania. Przestaje być ryzykiem. |
| **R8** | **Niekompletne składanie polskich znaków.** Użycie samego `normalize("NFD")` bez jawnej podmiany `ł`/`Ł` daje poprawkę, która nie działa w najczęstszym polskim przypadku — a wygląda na wdrożoną. | Prawdopodobieństwo: wysokie bez tej analizy, zerowe z nią. Przeciwdziałanie: funkcja `foldPolish()` z rozdz. 19 oraz testy **T21-T23** jako kryterium odbioru. |
| **R9** | **Spowolnienie pisania w polu filtru** na zakładce `Bestiariusz` po dołożeniu `normalize()` do ścieżki wykonywanej dla każdego wiersza przy każdym klawiszu. | Prawdopodobieństwo: niskie, ale realne. Przeciwdziałanie: test **T27**; gotowa pamięć podręczna na wiersz w rozdz. 19, do wdrożenia tylko w razie potrzeby. |
| **R10** | **Przycisk `Wyczyść zaznaczone` kasuje zaznaczenia nieodwracalnie.** Nie ma cofnięcia, a przy zasięgu „wszystkie zakładki" kasowałby też zaznaczenia niewidoczne w danej chwili. | Prawdopodobieństwo: średnie. Przeciwdziałanie: zasięg ograniczony do bieżącej zakładki (rozdz. 20) i próg aktywacji od jednego zaznaczenia, dzięki czemu przycisk nigdy nie jest „aktywny bez powodu". |
| **R11** | **Rozjazd między nazwą a sygnałem.** Jeżeli wdrożenie zmieni nagłówek na `NARZĘDZIA`, ale zostawi sygnał czerwieni na nagłówku (wariant D5-B), użytkownik dostanie feedback niewskazujący na filtr. | Prawdopodobieństwo: zależne od rozstrzygnięcia D5. Przeciwdziałanie: świadomy wybór wariantu przed rozpoczęciem prac (rozdz. 18). |

---

## 24. Gotowość do wdrożenia

### Gotowe do wykonania bez dalszych ustaleń

| Obszar | Podstawa |
|---|---|
| Wyprowadzenie filtru globalnego ze stanu zakładki (R1-R2 z rozdz. 9) | D1-A, D2-A |
| Zachowanie przycisków `Pełen Widok` / `Widok Domyślny` | D1-A — nadal czyszczą |
| Klucz `sessionStorage` i migracja starej sesji | D2-A |
| Tytuł menu filtra kolumny | D3-A — bez zmian |
| `clearRuntimeData()` | D4 — bez zmian |
| Odcień czerwieni sygnału | zaakceptowany `rgb(255,120,120)` + poświata `rgba(255,85,85,.35)` |
| Składanie polskich znaków wraz z adnotacjami językowymi | Z1 + rozdz. 19 (funkcja zweryfikowana) |
| Fraza jako jeden ciąg | Z2 |
| Brak przycisku czyszczenia pola, brak licznika ukrytych wierszy | Z4, Z5 |
| Zaznaczenia przeżywające zmianę filtrów | Z6, część pierwsza — brak prac |
| Przycisk `Wyczyść zaznaczone` wraz z wyglądem i progami | Z6, część druga + rozdz. 20 |
| Usunięcie znaku `▸` i osieroconej reguły `.caret` | wymaganie 1 |

### Wymaga jednego rozstrzygnięcia

**D5 — co ma nosić nazwę `FILTR`, a co `NARZĘDZIA`, i który napis ma się czerwienić** (rozdz. 18).

Rekomendacja: **D5-A** — nagłówek panelu `NARZĘDZIA`, etykieta nad polem `FILTR GLOBALNY`, czerwieni się etykieta.

To jedyna przeszkoda. Jest drobna technicznie (identyfikator elementu, nazwa klasy CSS, dwie wartości w tłumaczeniach), ale dotyczy tego, co użytkownik zobaczy na ekranie, więc nie powinna być rozstrzygana domyślnie przez wykonawcę.

### Do potwierdzenia przy odbiorze, nie blokujące

1. **Zasięg przycisku `Wyczyść zaznaczone`** — projekt zakłada bieżącą zakładkę (rozdz. 20). Jeżeli intencją było „wszystkie zakładki naraz", to zmiana czterech linii po wdrożeniu.
2. **Liczba trafień `pisto` w zakładce `Ekwipunek`** — test T4 na żywych danych; danych nie ma w repozytorium, więc nie dało się tego sprawdzić statycznie.
3. **Płynność pisania na `Bestiariuszu`** po dołożeniu `foldPolish()` — test T27; pamięć podręczna gotowa w rozdz. 19, do wdrożenia tylko w razie potrzeby.

### Kolejność prac po rozstrzygnięciu D5

1. Trzon: wyprowadzenie `globalFilter`, `setGlobalFilter()`, sygnał aktywności, nazwy (rozdz. 21, sekcja „Trzon zmiany").
2. Kryterium odbioru trzonu: `grep -n "view\.global" DataVault/app.js` bez trafień; testy T1-T20.
3. Z1: `foldPolish()` wraz z adnotacjami; testy T21-T27.
4. Z6: `updateSelectionButtons()` i nowy przycisk; testy T28-T35.
5. Dokumentacja: `Documentation.md`, `README.md` (obie wersje językowe), `DetaleLayout.md`.

Kroki 3 i 4 są od siebie i od kroku 1 niezależne — dają się wdrożyć i odebrać osobno, gdyby zaszła potrzeba podziału na etapy.

---

# CZĘŚĆ III — KOLORYSTYKA SYGNAŁÓW I POLE WYBORU WIERSZA

---

## 25. Decyzje z 21 września 2026 — druga tura

### Prompt użytkownika (zachowany w całości)

> 18. D5 — kolizja nazw FILTR i NARZĘDZIA (do rozstrzygnięcia)
> Zgodnie z rekomendacją wariant A. Zmieniamy nazwę "Szukaj (globalnie)" i to ten napis zmienia się na czerwony*.
>
> *trzeba dodać nowy kolor.
> Czerwony zostawimy na potrzeby zakładki dotyczącej zasad walki.
> Aktywne filtry oznaczymy inną barwą. Trzeba będzie ją dodać do DetaleLayout.md
> Może jakiś ciemny odcień niebieskiego? Taki stonowany, ale żeby był widoczny i się wyróżniał.
>
> Dodatkowo zmień kolor checkboxa jaki się wyświetla przy zaznaczeniu wiersza do porównania. Obecnie jest niebieski. W panelu bocznym są kolory zależne od koloru tekstu/zakładki.
>
> Niech przy zaznaczaniu do porównania checkbox będzie w kolorze tła a "ptaszek" w jasno zielony. Tak jak nagłówek kolumny.
>
> Rozbuduj analizę o te ustalenia.

Wiadomości dosłane w trakcie opracowania:

> to może jakiś odcień pomarańczowego?

> jeżeli z niebieskim są problemy

Do promptu dołączone były trzy zrzuty ekranu: pole wyboru z niebieskim wypełnieniem i etykietą „Typy przeciwników", panel boczny z kolorowanymi przełącznikami (archiwalny, jasnozielony, czerwony, stalowy) oraz jasnozielony znacznik „✓" na ciemnym tle jako wzór docelowy.

### Rozstrzygnięcia

| Punkt | Decyzja | Skutek |
|---|---|---|
| **D5** | Wariant **A** potwierdzony | Nagłówek panelu `NARZĘDZIA`, etykieta nad polem z `Szukaj (globalnie)` na `FILTR GLOBALNY`, sygnał kolorystyczny na etykiecie |
| **Kolor sygnału** | **Nie czerwony.** Czerwień zarezerwowana dla zakładek zasad walki. Potrzebna nowa barwa, dopisana do `DetaleLayout.md` | Unieważnia rekomendację `rgb(255,120,120)` z rozdz. 7 i 18. Nowa paleta: rozdz. 26 |
| **Checkbox porównania** | Pole w kolorze tła, znacznik jasnozielony jak nagłówek kolumny | Rozdz. 27 |

### Uwaga do zrzutu nr 1

Etykieta „Typy przeciwników" to **wartość danych**, a nie tekst z kodu: wiersz zakładki `Notatki`, widocznej wyłącznie w trybie admina (`Notatki` należy do `ADMIN_ONLY_SHEETS`). Dane modułu nie są trzymane w repozytorium — powstają z `Repozytorium.xlsx` i są wczytywane z Firebase — dlatego przeszukanie plików repozytorium tej etykiety nie znajduje. Zrzut przedstawia zatem zwykłe pole wyboru wiersza do porównania, dokładnie to, które opisuje rozdz. 27.

---

## 26. Nowy kolor sygnalizacji aktywnych filtrów

### Co jest dziś zajęte

| Rola | Wartość | Odcień (HSL) | Kontrast na `--panel` |
|---|---|---|---|
| Zieleń wiodąca `--accent` | `#16c60c` | H117 S89 L41 | 9,12 : 1 |
| Tekst nagłówków `--code` | `#D2FAD2` | H120 S80 L90 | 18,35 : 1 |
| **Zasady walki `--red`** | `#d74b4b` | **H0** S64 L57 | 5,00 : 1 |
| **Pojazdy `--steel`** | `#AEB7C2` | **H213** S14 L72 | 10,35 : 1 |
| Różnice w porównaniach `.compareDiff` | `#E6B35C` | **H38** S73 L63 | — |
| Wpisy archiwalne `--text-old` | `#7f9b7f` | H120 S11 L55 | — |

Wolne pozostają dwa obszary koła barw: **niebieski** (H200-210, sąsiaduje ze stalowym) i **pomarańczowy** (H25-35, sąsiaduje z czerwienią walki i z bursztynem porównań).

### Napięcie w sformułowaniu „ciemny, ale widoczny"

Tło modułu to `--bg: #031605` i `--panel: #000`. Na takim podłożu **ciemna barwa nie może być dobrze widoczna** — to sprzeczność wprost. Ciemny niebieski `#2E5E8C` daje kontrast 3,10 : 1, a `#35719E` — 4,01 : 1; oba **nie przechodzą** progu WCAG AA (4,5 : 1), a etykieta `FILTR GLOBALNY` jest pisana wersalikami fontem 12 px z rozstrzeleniem `.10em`, czyli tekstem trudniejszym do odczytania niż zwykły.

Rozwiązanie stosuje sam moduł przy rodzinach `--red` i `--steel`: **ciemny odcień idzie na tła i poświaty, jaśniejszy na tekst i obwódki**. Tło `rgba(61,143,196,.10)` na czerni to realnie `#060E14` — ciemny granat. Tekst w tej samej rodzinie musi być jaśniejszy, żeby dało się go przeczytać. Tak zbudowana rodzina spełnia oba życzenia naraz: jest ciemna tam, gdzie wypełnia, i widoczna tam, gdzie pisze.

### Wariant N — niebieski (rekomendowany)

```css
/* --- Rodzina barwy aktywnego filtru / Active-filter colour family --- */
/* PL: Niebieski jest jedynym obszarem koła barw wolnym od znaczeń już przypisanych: czerwień należy
   do zasad walki, zieleń jest barwą wiodącą modułu, bursztyn oznacza różnice w porównaniach.
   Odcień sąsiaduje ze stalowym kolorem pojazdów (H213), ale stalowy jest niemal odbarwiony (S14) i
   czyta się jako szarość, podczas gdy ta barwa ma S53 i czyta się jako błękit. Dodatkowo obie
   występują w innych częściach interfejsu: stalowy na zakładkach, ta barwa na etykiecie filtru i
   nagłówkach kolumn.
   EN: Blue is the only region of the colour wheel free of meanings already taken: red belongs to the
   combat rules, green is the module's leading colour, amber marks differences in comparisons. The
   hue neighbours the steel of the vehicles (H213), but steel is nearly desaturated (S14) and reads
   as grey, whereas this colour has S53 and reads as blue. They also live in different parts of the
   interface: steel on the tabs, this colour on the filter label and the column headers. */
--filter-on:#3D8FC4;
--filter-on-bright:#6FB3E0;
--filter-on-border:rgba(61,143,196,.55);
--filter-on-glow:rgba(61,143,196,.40);
--filter-on-bg:rgba(61,143,196,.10);
--filter-on-bg-active:rgba(61,143,196,.20);
```

| Miara | Wartość | Ocena |
|---|---|---|
| Kontrast `#3D8FC4` na `--panel` | **5,92 : 1** | przechodzi AA z zapasem; porównywalny z dzisiejszą czerwienią walki (5,00 : 1) |
| Kontrast na `--bg` | 5,29 : 1 | przechodzi AA |
| Nasycenie | S53 | stonowane — poniżej `--accent` (S89) i `--red` (S64) |
| Tło `--filter-on-bg` na czerni | `#060E14` | ciemny granat, zgodnie z życzeniem „ciemny odcień" |
| Tło `--filter-on-bg-active` | `#0C1D27` | ciemny granat, mocniejszy |
| Odległość od `--red` | ΔH 204° | maksymalna możliwa separacja |
| Odległość od `--steel` | ΔH 9°, ale ΔS 39 i ΔL 22 | rozróżnialne nasyceniem, nie odcieniem — **jedyne zastrzeżenie tego wariantu** |

### Wariant P — pomarańczowy (alternatywa zgłoszona przez użytkownika)

```css
--filter-on:#E0913A;
--filter-on-bright:#F0AE62;
--filter-on-border:rgba(224,145,58,.55);
--filter-on-glow:rgba(224,145,58,.40);
--filter-on-bg:rgba(224,145,58,.10);
--filter-on-bg-active:rgba(224,145,58,.20);
```

| Miara | Wartość | Ocena |
|---|---|---|
| Kontrast na `--panel` | ok. **8,2 : 1** | przechodzi AA z dużym zapasem |
| Nasycenie | S73 | wyraźnie mocniejsze niż wariant N — mniej „stonowane" |
| Odległość od `--red` (zasady walki) | **ΔH 31°** | niewielka |
| Odległość od `.compareDiff` (bursztyn) | **ΔH 7°** | bardzo mała — praktycznie ta sama rodzina |

### Dlaczego rekomenduję niebieski

Cel zmiany jest jeden: **uwolnić czerwień na wyłączność zasad walki**. Pomarańcz realizuje ten cel słabiej, i to mierzalnie.

**Sąsiedztwo z czerwienią.** Pomarańcz leży 31° od czerwieni walki. Zakładka zasad walki (czerwony tekst) i odfiltrowana kolumna (pomarańczowy nagłówek) potrafią być widoczne w tym samym kadrze. Niebieski leży 204° od czerwieni — dalej się nie da.

**Ślepota barw.** W symulacji deuteranopii (najczęstsza postać, ok. 6 % mężczyzn) pomarańcz `#E0913A` i czerwień `#d74b4b` schodzą się do praktycznie jednej barwy — rozróżnialność **1,33**. Niebieski wobec tej samej czerwieni: **2,51**, czyli niemal dwukrotnie lepiej. Dla użytkownika z deuteranopią wariant P oznacza, że sygnał „filtr założony" i oznaczenie „zasady walki" wyglądają tak samo — a to jest dokładnie ta pomyłka, którą ta zmiana ma wyeliminować.

**Drugie sąsiedztwo.** Pomarańcz ma ΔH 7° do bursztynu `.compareDiff`. To okoliczność łagodniejsza, bo bursztyn żyje wyłącznie w oknie porównania, które przykrywa resztę interfejsu — ale to jednak druga zajęta okolica, podczas gdy niebieski ma tylko jedną.

**Zastrzeżenie wobec niebieskiego jest słabsze, niż wygląda.** Sąsiedztwo ze stalowym dotyczy samego odcienia; rozróżnienie niesie nasycenie (S53 wobec S14) i jasność (L50 wobec L72). Barwa nasycona obok niemal odbarwionej szarości czyta się jednoznacznie. Do tego obie pracują w rozłącznych miejscach interfejsu: stalowy na zakładkach pojazdów, nowa barwa na etykiecie filtru i nagłówkach kolumn.

**Semantyka.** Barwa chłodna czyta się jako informacja („coś jest włączone"), ciepła jako ostrzeżenie. Filtr to stan, nie alarm.

### D7 — decyzja do podjęcia

| Wariant | Kiedy wybrać |
|---|---|
| **N — niebieski `#3D8FC4` (rekomendowany)** | Gdy priorytetem jest jednoznaczne odróżnienie sygnału filtru od czerwieni zasad walki, także dla osób ze ślepotą barw |
| P — pomarańczowy `#E0913A` | Gdy przeważy preferencja wizualna wobec ciepłej barwy; wtedy w `DetaleLayout.md` należy odnotować świadomie przyjęte sąsiedztwo z czerwienią i bursztynem |

Wybór wariantu **nie zmienia niczego w kodzie poza sześcioma wartościami zmiennych CSS** — wszystkie reguły niżej odwołują się do nazw `--filter-on*`, nie do literałów. Zamiana jednego wariantu na drugi to edycja jednego bloku w `:root`.

### D6 — zasięg nowej barwy

Decyzja „czerwony zostawiamy dla zasad walki" ma konsekwencję, o której prompt nie mówi wprost. **Aktywne filtry kolumnowe są dziś czerwone**: nagłówek kolumny (`thead th.filter-active`) dostaje czerwony gradient `rgba(255,70,70,.18)` → `rgba(255,70,70,.07)` i linię `rgba(255,85,85,.40)`, a przycisk filtra (`.filterBtn.filter-active`) czerwone tło, poświatę i znacznik `●` w `rgb(255,120,120)` (`DetaleLayout.md`, rozdz. 2.3 i 3.6a).

| Wariant | Zachowanie | Ocena |
|---|---|---|
| **D6-A (rekomendowany)** | Nowa barwa obejmuje **wszystkie** sygnały aktywnego filtru: etykietę `FILTR GLOBALNY`, nagłówek kolumny z filtrem i przycisk filtra | Jedyny wariant, w którym zdanie „czerwony zostaje dla zasad walki" jest prawdziwe. Jedno pojęcie — „filtr jest założony" — dostaje jedną barwę na wszystkich poziomach. Koszt: cztery reguły CSS. |
| D6-B | Nowa barwa tylko na etykiecie filtru globalnego; filtry kolumnowe zostają czerwone | Czerwień nadal oznaczałaby filtry, czyli cel zmiany zostaje zrealizowany połowicznie. Użytkownik dostaje dwie różne barwy na to samo znaczenie: niebieską na panelu i czerwoną w nagłówku kolumny. |

Rekomendacja: **D6-A**. Ujednolicenie jest tanie, a bez niego zmiana nie osiąga swojego celu.

### Reguły CSS po D6-A

```css
/* PL: Etykieta pola filtru globalnego zapala się, gdy fraza faktycznie zawęża widok.
   EN: The global filter's field label lights up when the phrase actually narrows the view. */
.fieldLabel--active{
  color:var(--filter-on);
  text-shadow:0 0 10px var(--filter-on-glow);
}

/* PL: Nagłówek kolumny z aktywnym filtrem. Kolor bazowy tła i gradient ustawiane są osobno —
   skrót `background` skasowałby nieprzezroczysty `--panel` z reguły `thead th`, a sam gradient
   jest półprzezroczysty, więc przez przyklejony nagłówek prześwitywałyby przewijane wiersze.
   EN: A column header with an active filter. The base background colour and the gradient are set
   separately — the `background` shorthand would wipe the opaque `--panel` from the `thead th` rule,
   and the gradient alone is semi-transparent, so scrolling rows would show through the sticky
   header. */
.dataTable thead tr:first-child th.filter-active{
  background-color:var(--panel);
  background-image:linear-gradient(180deg, var(--filter-on-bg-active), var(--filter-on-bg));
  box-shadow:inset 0 -2px 0 var(--filter-on-glow);
}
.filterBtn.filter-active{
  background:var(--filter-on-bg-active);
  box-shadow:0 0 10px var(--filter-on-glow), 0 0 0 1px var(--filter-on-border);
}
.filterBtn.filter-active::after{color:var(--filter-on-bright)}
```

---

## 27. Checkbox zaznaczenia wiersza do porównania

### Skąd bierze się niebieski

Pole wyboru w pierwszej kolumnie tabeli powstaje w `renderRow()` (`app.js:1810-1819`) jako zwykły `<input type="checkbox">` i **nie ma w arkuszu stylów ani jednej reguły**. Sprawdzone: wszystkie siedem deklaracji `accent-color` w `style.css` dotyczy innych pól (przełączniki panelu bocznego w liniach 241, 246, 1203, 1205, 1207, 1210 oraz listy wartości filtra w linii 1503). Reguły `.tableWrap table td:first-child` (570) i `.tableWrap .dataTable tbody td:first-child` (1330) stylują **komórkę**, nie pole wyboru.

Pole korzysta więc z domyślnego wyglądu przeglądarki, a ten jest niebieski — barwa spoza palety modułu.

### Dlaczego nie wystarczy `accent-color`

`accent-color` steruje wyłącznie **wypełnieniem** pola; barwę znacznika przeglądarka dobiera sama (biel albo czerń, zależnie od jasności wypełnienia). Życzenie użytkownika jest odwrotne: **tło ma zostać tłem, a kolorowy ma być znacznik**. Tego `accent-color` nie potrafi wyrazić — konieczne jest `appearance: none` i narysowanie znacznika samodzielnie.

### Wzorzec docelowy

Ze zrzutu nr 3 oraz z polecenia „tak jak nagłówek kolumny": nagłówki kolumn mają `color: var(--code)` (`style.css:363`), czyli `#D2FAD2`. To ta sama jasna zieleń, w której rysowane są już `✓` w nagłówku kolumny wyboru oraz znacznik zaznaczenia przy nagłówku grupy kart (`.groupMark`). Nowy wygląd pola wyboru wpisuje się zatem w istniejący zestaw znaczników, zamiast wprowadzać ósmy wariant.

### Proponowane reguły

```css
/* --- Pole wyboru wiersza do porównania / Row-selection checkbox --- */
/* PL: Rysujemy je sami, bo accent-color steruje tylko wypełnieniem pola, a barwę znacznika dobiera
   wtedy przeglądarka — stąd dzisiejszy niebieski, obcy palecie modułu. Po zmianie pole zostaje
   przezroczyste, więc przyjmuje tło wiersza (pasy zebry i podświetlenie zaznaczenia), a znacznik
   jest jasnozielony, dokładnie jak tekst nagłówka kolumny.
   EN: It is drawn by hand, because accent-color only controls the box fill and the browser then
   picks the tick colour — hence today's blue, foreign to the module palette. After the change the
   box stays transparent, so it takes the row's own background (the zebra stripes and the selection
   highlight), and the tick is light green, exactly like the column header text. */
.dataTable tbody td:first-child input[type="checkbox"]{
  appearance:none;
  -webkit-appearance:none;
  width:16px;
  height:16px;
  margin:0;
  border:1px solid var(--b);
  border-radius:3px;
  background:transparent;
  cursor:pointer;
  display:grid;
  place-content:center;
}
.dataTable tbody td:first-child input[type="checkbox"]::after{
  content:"✓";
  font-size:12px;
  line-height:1;
  color:var(--code);
  opacity:0;
}
.dataTable tbody td:first-child input[type="checkbox"]:checked{border-color:var(--accent)}
.dataTable tbody td:first-child input[type="checkbox"]:checked::after{opacity:1}
.dataTable tbody td:first-child input[type="checkbox"]:focus-visible{
  outline:none;
  box-shadow:0 0 0 3px rgba(22,198,12,.18);
}
```

### Dlaczego `transparent`, a nie `var(--bg)`

Polecenie mówi „checkbox w kolorze tła". Wpisanie `var(--bg)` na sztywno dałoby jedną, stałą ciemność — a wiersze tabeli mają **pasy zebry** (`--zebra-odd`, `--zebra-even`) i osobne podświetlenie wiersza zaznaczonego (`--row-selected`). Pole wyboru odcinałoby się wtedy prostokątem o innym odcieniu niż wiersz, na którym leży. `transparent` realizuje życzenie ściślej: pole **przyjmuje** tło wiersza, jakiekolwiek ono w danym momencie jest.

### Zakres oddziaływania

Selektor celuje wyłącznie w pierwszą komórkę ciała tabeli. **Nie zmienia**: przełączników panelu bocznego (zachowują swoje `accent-color` zależne od kategorii), list wartości w menu filtra i w modalu filtrów (`.filterValue input`, zieleń `--accent`), ani pól wyboru w oknie porównania.

Powstaje przez to świadome rozróżnienie: pola **filtrujące** są wypełniane na zielono, pole **zaznaczające wiersz** jest obrysem ze znacznikiem. Dwie różne czynności dostają dwa różne kształty — to ułatwia odczyt, a nie zaciemnia.

### Ryzyko techniczne

Pseudoelement na `<input>` działa dlatego, że `appearance: none` odbiera polu charakter elementu zastępowanego. Technika jest powszechna i obsługiwana przez Chrome, Firefox i Safari, ale **wymaga sprawdzenia na docelowych przeglądarkach** — testy T38-T39. Gdyby gdziekolwiek zawiodła, zamiennikiem bez pseudoelementu jest znacznik w tle:

```css
.dataTable tbody td:first-child input[type="checkbox"]:checked{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 8.5l3.5 3.5L13 5' fill='none' stroke='%23D2FAD2' stroke-width='2'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:center;
}
```

---

## 28. Uzupełnienie zakresu prac

Uzupełnia rozdz. 21. Zakłada **D5-A, D6-A** oraz wariant barwy wybrany w **D7**.

### `DataVault/style.css`

- [ ] `:root` — dodać sześć zmiennych rodziny `--filter-on*` z komentarzem PL/EN (rozdz. 26).
- [ ] `.fieldLabel--active` — **zamiast** czerwieni z rozdz. 18 użyć `var(--filter-on)` i `var(--filter-on-glow)`.
- [ ] `.dataTable thead tr:first-child th.filter-active` — przepiąć czerwony gradient i linię na rodzinę `--filter-on*` (D6-A).
- [ ] `.filterBtn.filter-active` oraz `::after` — przepiąć tło, poświatę, obwódkę i znacznik `●` na rodzinę `--filter-on*` (D6-A).
- [ ] pole wyboru wiersza — pięć reguł z rozdz. 27.
- [ ] pozycje z rozdz. 21 bez zmian: usunięcie `.caret`, dodanie `#btnClearSelection:disabled`.

### `DetaleLayout.md`

- [ ] rozdz. 2.1 (zmienne CSS `DataVault`) — dopisać rodzinę `--filter-on*` wraz z wartościami literalnymi i z informacją, **do czego służy**: sygnalizacja aktywnego filtru na wszystkich poziomach.
- [ ] rozdz. 2.2/2.3 — odnotować, że `--red` jest **zarezerwowany dla zakładek zasad walki** i nie jest już używany do oznaczania filtrów.
- [ ] rozdz. 3.6a — przepisać opis sygnalizacji aktywnych filtrów kolumnowych na nowe wartości i dopisać sygnalizację filtru globalnego na etykiecie `FILTR GLOBALNY`.
- [ ] nowa pozycja — wygląd pola wyboru wiersza do porównania: obrys `var(--b)`, tło przezroczyste, znacznik `✓` w `var(--code)`, obwódka zaznaczonego w `var(--accent)`.
- [ ] jeżeli wybrany zostanie wariant **P**, dopisać notkę o świadomie przyjętym sąsiedztwie z `--red` i `.compareDiff`.

### `DataVault/docs/Documentation.md`

- [ ] obie wersje językowe — opisać rodzinę `--filter-on*`, powód jej wprowadzenia (uwolnienie czerwieni) i miejsca użycia; opisać własny wygląd pola wyboru wiersza wraz z powodem rezygnacji z `accent-color`.

### `DataVault/docs/README.md`

- [ ] obie wersje językowe — napisać, że etykieta `FILTR GLOBALNY` **zmienia barwę**, gdy filtr działa (bez podawania wartości szesnastkowych); że tak samo oznaczane są kolumny z własnym filtrem; że zaznaczony wiersz ma jasnozielony znacznik.

---

## 29. Uzupełnienie planu testów

Testy **T1-T35** obowiązują, z jedną korektą: wszędzie, gdzie mowa o „czerwonej" etykiecie, obowiązuje teraz barwa wybrana w D7.

| # | Kroki | Oczekiwany wynik |
|---|---|---|
| T36 | Wpisz frazę w filtr globalny | Etykieta `FILTR GLOBALNY` zmienia barwę na `--filter-on`; **żaden element nie staje się czerwony** |
| T37 | Ustaw filtr w kolumnie, obejrzyj nagłówek i przycisk filtra | Oznaczenia w rodzinie `--filter-on*`; czerwień nie występuje (weryfikacja D6-A) |
| T38 | Zaznacz wiersz do porównania | Pole wyboru: obrys zielony, tło takie jak wiersz, znacznik `✓` jasnozielony; **nigdzie niebieskiego wypełnienia** |
| T39 | Powtórz T38 w Chrome, Firefoksie i Safari | Znacznik rysuje się w każdej przeglądarce; przy braku — wariant zapasowy z tłem SVG (rozdz. 27) |
| T40 | Zaznacz wiersz w pasie zebry jasnym i ciemnym oraz w wierszu już zaznaczonym | Pole wyboru przyjmuje tło wiersza, nie odcina się prostokątem |
| T41 | Włącz zakładki zasad walki i ustaw filtr w kolumnie na tej zakładce | Czerwień zakładki i barwa filtru są od siebie odróżnialne w jednym kadrze |
| T42 | Włącz zakładki pojazdów i ustaw filtr w kolumnie na zakładce pojazdu | Stalowy zakładki i barwa filtru są od siebie odróżnialne (weryfikacja zastrzeżenia z rozdz. 26) |
| T43 | Przejdź polem wyboru przy użyciu klawisza Tab | Widoczny pierścień ogniskowania (`:focus-visible`); pole daje się przełączyć spacją |
| T44 | Otwórz okno porównania przy aktywnym filtrze | Bursztyn `.compareDiff` jest odróżnialny od barwy filtru (istotne zwłaszcza przy wariancie P) |

---

## 30. Zaktualizowana gotowość do wdrożenia

### Rozstrzygnięte

Wszystko z rozdz. 24 pozostaje w mocy, a dodatkowo zamknięte są:

- **D5** — wariant A potwierdzony: nagłówek `NARZĘDZIA`, etykieta `FILTR GLOBALNY`, sygnał na etykiecie.
- **Rezygnacja z czerwieni** jako barwy sygnału filtru; czerwień zarezerwowana dla zasad walki.
- **Wygląd pola wyboru wiersza** — w pełni określony w rozdz. 27, łącznie z wariantem zapasowym.

### Otwarte — dwie decyzje kolorystyczne

| # | Pytanie | Rekomendacja |
|---|---|---|
| **D6** | Czy nowa barwa obejmuje także filtry kolumnowe, czy tylko etykietę filtru globalnego? | **D6-A — obejmuje wszystko.** Bez tego czerwień nadal oznaczałaby filtry, więc cel zmiany zostałby zrealizowany połowicznie. |
| **D7** | Niebieski `#3D8FC4` czy pomarańczowy `#E0913A`? | **Wariant N — niebieski.** Pomarańcz leży 31° od czerwieni zasad walki, a przy deuteranopii jest od niej praktycznie nieodróżnialny (1,33 wobec 2,51 dla niebieskiego). Zastrzeżenie wobec niebieskiego — sąsiedztwo ze stalowym kolorem pojazdów — znoszone jest różnicą nasycenia (S53 wobec S14) i rozdzielnością miejsc użycia. |

Obie decyzje są **tanie do zmiany po wdrożeniu**: D7 to sześć wartości w jednym bloku `:root`, D6 to cztery reguły CSS. Żadna nie blokuje prac nad trzonem zmiany (rozdz. 21), nad składaniem polskich znaków (rozdz. 19) ani nad przyciskiem czyszczenia zaznaczeń (rozdz. 20) — te trzy obszary są od kolorystyki niezależne i mogą ruszyć od razu.

### Kolejność prac po rozstrzygnięciu D6 i D7

1. Trzon: `globalFilter`, `setGlobalFilter()`, sygnał aktywności, nazwy `NARZĘDZIA` / `FILTR GLOBALNY` (rozdz. 21). Kryterium odbioru: `grep -n "view\.global" DataVault/app.js` bez trafień; testy T1-T20.
2. Z1: `foldPolish()` wraz z adnotacjami językowymi (rozdz. 19); testy T21-T27.
3. Z6: `updateSelectionButtons()` i przycisk `Wyczyść zaznaczone` (rozdz. 20); testy T28-T35.
4. Kolorystyka: rodzina `--filter-on*` i przepięcie sygnałów filtrów (rozdz. 26); testy T36-T37, T41-T42, T44.
5. Pole wyboru wiersza (rozdz. 27); testy T38-T40, T43.
6. Dokumentacja: `Documentation.md`, `README.md` (obie wersje językowe), `DetaleLayout.md` — w tym nowa pozycja o rodzinie `--filter-on*` i o rezerwacji czerwieni.

Kroki 1-3 są od siebie niezależne i niezależne od kroków 4-5. Kroki 4 i 5 dotyczą wyłącznie arkusza stylów i dokumentacji layoutu — nie ruszają `app.js` poza dodaniem klasy `fieldLabel--active`, która i tak powstaje w kroku 1.

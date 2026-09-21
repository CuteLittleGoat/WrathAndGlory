# Filtr globalny w module DataVault — analiza modyfikacji zasady działania

> **Data:** 21 września 2026
> **Temat:** zmiana nazwy panelu bocznego z „▸FILTRY" na „FILTR", utrwalenie wpisanej frazy przy przełączaniu zakładek, czerwona sygnalizacja aktywnego filtru oraz potwierdzenie niezależności filtru globalnego od filtrów kolumnowych i widoku domyślnego
> **Moduł:** `DataVault`
> **Charakter dokumentu:** analiza przedwdrożeniowa. Opisuje stan kodu **sprzed** zmian i projekt docelowego zachowania. Żaden plik modułu nie został w ramach tej analizy zmieniony.

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

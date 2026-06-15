# Analiza i propozycja rozbudowy — ukrywanie i oznaczanie rekordów `old` w DataVault / Bestiariusz

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `DataVault`  
**Główne pliki do późniejszej implementacji:** `DataVault/index.html`, `DataVault/app.js`, `DataVault/style.css`  
**Zakres:** dodanie adminowego checkboxa pokazującego / ukrywającego zdezaktualizowane wpisy w zakładce `Bestiariusz` oraz ograniczenie oznaczenia wizualnego rekordów `old` do kolumn `Nazwa` i `Typ`.

---

## 0. Pełna treść promptu

```text
Pracujesz w repo "WrathAndGlory". Będziesz pracować na module DataVault.
Po pierwsze przeczytaj analizę Analizy/nazwy_old.md

W module DataVault trzeba wprowadzić podobną funkcjonalność. Chcę:

1. Dodać checkbox "Czy wyświetlić zdezaktualizowane wpisy?" (w wersji polskiej) widoczny tylko z poziomu admina.
2. W zakładce Bestiariusz wpisy, które mają znacznik "old" w kolumnie "Stan" mają mieć innym fontem zapisaną nazwę i typ (w DataVault LP jest ukryte).
3. Wpisy mające "Old" w zakładce Bestiariusz mają być widoczne tylko jak admin zaznaczy checkbox "Czy wyświetlić zdezaktualizowane wpisy?"
4. Checkbox "Czy wyświetlić zdezaktualizowane wpisy?" ma być domyślnie odznaczony.
5. Checkbox ma się wyświetlać jako pierwszy u góry. (w widoku admina. W widoku użytkownika będzie niewidoczny, więc pierwszy będzie "Czy wyświetlić zakładki dotyczące tworzenia postaci?"

Przeprowadź analizę wprowadzenia takiego rozwiązania. Wyniki analizy zapisz jako Analizy/Bestiariusz_old.md
W analizie zapisz pełną treść promptu. Krótkie podsumowanie zapisz tutaj w czacie.
```

---

## 1. Punkt odniesienia z `Analizy/nazwy_old.md`

Analiza `Analizy/nazwy_old.md` dotyczyła podobnego problemu w module `GeneratorNPC`: rekordy z `Stan = old` miały być domyślnie ukryte na liście Bestiariusza, a po świadomym włączeniu checkboxa widoczne i oznaczone kolorem `old`.

Najważniejsza zasada z tamtej analizy, którą należy przenieść do DataVault w odpowiedniej formie:

```text
Nie modyfikować źródłowej kolekcji danych. Filtrować wyłącznie widok.
```

W `GeneratorNPC` oznaczało to: nie filtrować `state.bestiary`, bo indeksy rekordów są wykorzystywane przez wybór, podgląd, generowanie karty i ulubione.

W `DataVault` odpowiednikiem tej zasady jest:

```text
Nie usuwać rekordów old z DB.sheets.Bestiariusz i nie zmieniać danych wczytanych z Firebase / data.json. Filtrować tylko wiersze przekazywane do renderowania tabeli i do filtrów UI.
```

---

## 2. Cel zmiany w DataVault

Celem zmiany jest to, aby w module `DataVault` rekordy zdezaktualizowane w arkuszu `Bestiariusz`:

1. nie były domyślnie widoczne;
2. mogły zostać pokazane wyłącznie przez admina;
3. po pokazaniu były czytelnie oznaczone w kolumnach `Nazwa` i `Typ`;
4. nie ujawniały kolumn technicznych `LP` i `Stan`, które w DataVault są już ukrywane;
5. nie wpływały na strukturę danych, import XLSX, Firebase ani inne zakładki.

Rekord jest uznawany za zdezaktualizowany, jeśli w arkuszu `Bestiariusz` ma w kolumnie `Stan` wartość:

```text
old
```

Porównanie powinno być niewrażliwe na wielkość liter i powinno korzystać z istniejącej normalizacji / usuwania markerów formatowania.

---

## 3. Obecny stan techniczny DataVault

### 3.1. Panel filtrów i checkboxy

W `DataVault/index.html` panel boczny `.panelBody` zawiera obecnie:

1. pole globalnego wyszukiwania `#globalSearch`;
2. checkbox `#toggleCharacterTabs` — `Czy wyświetlić zakładki dotyczące tworzenia postaci?`;
3. checkbox `#toggleCombatTabs` — `Czy wyświetlić zakładki dotyczące zasad walki?`;
4. checkbox `#toggleVehicleTabs` — `Czy wyświetlić zakładki dotyczące pojazdów?`;
5. blok podpowiedzi.

Nowy checkbox powinien zostać dodany jako pierwszy checkbox w tym panelu, czyli bezpośrednio przed `#toggleCharacterTabs`.

Uwaga interpretacyjna: w obecnym układzie pole `Szukaj (globalnie)` jest nad checkboxami. Wymóg „pierwszy u góry” najlepiej rozumieć jako „pierwszy checkbox”, ponieważ prompt mówi, że w widoku użytkownika pierwszym widocznym będzie checkbox tworzenia postaci. Nie trzeba przenosić pola globalnego wyszukiwania, chyba że późniejsza decyzja projektowa doprecyzuje, że nowy checkbox ma być absolutnie pierwszym elementem całego panelu.

---

### 3.2. Widoczność admin / użytkownik

W `DataVault/app.js` tryb admina jest rozpoznawany przez:

```js
const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";
```

Zakładka `Bestiariusz` znajduje się obecnie w zbiorze:

```js
const ADMIN_ONLY_SHEETS = new Set(["Bestiariusz", "Trafienia Krytyczne", "Groza Osnowy", "Hordy", "Specjalne Bonusy Wrogów", "Notatki"]);
```

W `initUI()` dla użytkownika nieadminowego zakładki z `ADMIN_ONLY_SHEETS` są odfiltrowywane. Oznacza to, że `Bestiariusz` jest już zakładką admin-only.

Nowy checkbox również powinien być admin-only. W widoku użytkownika powinien być niewidoczny i nie powinien zostawiać pustego miejsca w układzie.

---

### 3.3. Ukryte kolumny

W `DataVault/app.js` istnieje już:

```js
const HIDDEN_COLUMNS = new Set(["lp", "stan"]);
```

Funkcje `isHiddenColumn`, `deriveColumnOrderFromHeader` i `getColumnOrder` powodują, że kolumny `LP` i `Stan` nie są wyświetlane w tabeli.

To zachowanie jest zgodne z wymaganiem:

```text
w DataVault LP jest ukryte
```

Nie należy zmieniać tej części logiki.

---

### 3.4. Rozpoznawanie rekordów `old`

W `DataVault/app.js` istnieje już:

```js
const STATUS_OLD_VALUE = "old";
```

oraz helper:

```js
function isOldStatusRow(row){
  if (!row || typeof row !== "object") return false;
  const statusKey = Object.keys(row).find((key)=>{
    const normKey = String(key ?? "").trim().toLowerCase();
    return normKey === "stan";
  });
  if (!statusKey) return false;
  const value = stripMarkers(String(row[statusKey] ?? "")).trim().toLowerCase();
  return value === STATUS_OLD_VALUE;
}
```

To jest właściwy mechanizm do użycia. Nie należy dodawać drugiego, równoległego sposobu sprawdzania `Stan = old`.

---

### 3.5. Obecne stylowanie rekordów `old`

W `renderRow(r, cols)` każdy wiersz dostaje klasę:

```js
tr.classList.toggle("row-old", isOldStatusRow(r));
```

W `DataVault/style.css` istnieje reguła:

```css
.dataTable tbody tr.row-old{color:var(--text-old)}
```

oraz uzupełniające reguły dla elementów wewnętrznych:

```css
.dataTable tbody tr.row-old .keyword-comma,
.dataTable tbody tr.row-old .ref,
.dataTable tbody tr.row-old .caretref,
.dataTable tbody tr.row-old .slash{color:var(--text-old)}
```

To oznacza, że obecnie stary rekord, jeśli jest widoczny, dostaje kolor `old` na całym wierszu. Nowe wymaganie jest węższe:

```text
w zakładce Bestiariusz innym fontem mają być zapisane nazwa i typ
```

Dlatego w ramach tej zmiany trzeba uważać, żeby globalna klasa `.row-old` nie pokolorowała całego wiersza `Bestiariusza`, jeśli celem jest wyróżnienie tylko pól `Nazwa` i `Typ`.

---

## 4. Rekomendowany model działania

### 4.1. Checkbox

Nowy checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
```

Powinien:

1. być widoczny tylko w trybie admina;
2. być domyślnie odznaczony;
3. nie zapisywać swojego stanu w `sessionStorage`, jeżeli wymóg „domyślnie odznaczony” ma obowiązywać po każdym świeżym wejściu do modułu;
4. filtrować wyłącznie zakładkę `Bestiariusz`;
5. być pierwszym checkboxem w panelu filtrów, bezpośrednio nad `Czy wyświetlić zakładki dotyczące tworzenia postaci?`.

Proponowane nazwy:

```text
ID wrappera: toggleBestiaryOldGroup
ID inputa:   toggleOldBestiaryEntries
klucz i18n:  toggleOldBestiaryEntries
stan JS:     showOldBestiaryEntries
```

---

### 4.2. Widoczność rekordów

Przy checkboxie odznaczonym:

* w zakładce `Bestiariusz` rekordy z `Stan = old` są ukryte;
* rekordy `old` nie przechodzą przez globalne wyszukiwanie, filtry kolumn, sortowanie ani renderowanie;
* wartości występujące wyłącznie w ukrytych rekordach `old` nie powinny pojawiać się w menu filtrów kolumn;
* `DB.sheets.Bestiariusz` nadal zawiera wszystkie rekordy.

Przy checkboxie zaznaczonym:

* w zakładce `Bestiariusz` widoczne są również rekordy `old`;
* rekordy `old` są filtrowane i sortowane tak jak zwykłe rekordy;
* pola `Nazwa` i `Typ` w rekordach `old` mają inny wygląd;
* kolumny `LP` i `Stan` pozostają ukryte.

---

### 4.3. Zakres arkusza

Filtrowanie `old` ma dotyczyć tylko arkusza:

```text
Bestiariusz
```

Nie należy domyślnie ukrywać wszystkich rekordów `old` w całym DataVault, ponieważ obecna klasa `.row-old` i helper `isOldStatusRow` są ogólne, a inne arkusze mogą używać kolumny `Stan` w innym kontekście lub w przyszłości wymagać innego zachowania.

---

## 5. Proponowane zmiany techniczne

### 5.1. `DataVault/index.html` — dodanie checkboxa

W `.panelBody`, bezpośrednio przed checkboxem `#toggleCharacterTabs`, dodać:

```html
<label class="checkboxRow checkboxRow--bestiaryOld" id="toggleBestiaryOldGroup" hidden>
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel" data-i18n="toggleOldBestiaryEntries">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

Rekomendowane miejsce:

```html
<label class="field">
  <div class="fieldLabel" data-i18n="globalSearchLabel">Szukaj (globalnie)</div>
  <input id="globalSearch" class="input" placeholder="np. Pist, Brutalna, IMPERIUM, Zatrucie (5)..." />
</label>

<label class="checkboxRow checkboxRow--bestiaryOld" id="toggleBestiaryOldGroup" hidden>
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel" data-i18n="toggleOldBestiaryEntries">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>

<label class="checkboxRow">
  <input type="checkbox" id="toggleCharacterTabs" />
  <span class="checkboxLabel" data-i18n="toggleCharacterTabs">Czy wyświetlić zakładki dotyczące tworzenia postaci?</span>
</label>
```

Dzięki temu:

* w adminie pierwszym checkboxem będzie `Czy wyświetlić zdezaktualizowane wpisy?`;
* w widoku użytkownika wrapper pozostanie ukryty, więc pierwszym checkboxem nadal będzie `Czy wyświetlić zakładki dotyczące tworzenia postaci?`.

---

### 5.2. `DataVault/app.js` — referencje DOM

W obiekcie `els` dodać:

```js
toggleBestiaryOldGroup: document.getElementById("toggleBestiaryOldGroup"),
toggleOldBestiaryEntries: document.getElementById("toggleOldBestiaryEntries"),
```

---

### 5.3. `DataVault/app.js` — tłumaczenia

W `translations.pl.labels` dodać:

```js
toggleOldBestiaryEntries: "Czy wyświetlić zdezaktualizowane wpisy?",
```

Chociaż prompt wymaga wersji polskiej, moduł ma aktywny mechanizm tłumaczeń. Dla spójności warto dodać również wersję angielską w `translations.en.labels`:

```js
toggleOldBestiaryEntries: "Show outdated entries?",
```

Jeżeli projekt ma pozostać stricte polski w tym miejscu, wersja EN może być technicznie dodana tylko jako bezpieczny fallback.

---

### 5.4. `DataVault/app.js` — stan checkboxa

Najbezpieczniej nie dodawać tego ustawienia bezpośrednio do `uiState`, ponieważ `saveSessionState()` zapisuje obecnie:

```js
toggles: {...uiState},
```

Gdyby dodać `showOldBestiaryEntries` do `uiState`, checkbox mógłby zacząć zapisywać się w `sessionStorage`, a po odświeżeniu nie byłby już domyślnie odznaczony.

Rekomendowany wariant:

```js
let showOldBestiaryEntries = false;
```

Alternatywa, jeśli koniecznie ma to być część `uiState`: zmienić `saveSessionState()` tak, aby jawnie zapisywał tylko te przełączniki, które mają być pamiętane:

```js
toggles: {
  showCharacterTabs: uiState.showCharacterTabs,
  showCombatTabs: uiState.showCombatTabs,
  showVehicleTabs: uiState.showVehicleTabs,
},
```

Rekomendacja: użyć osobnej zmiennej runtime i nie zapisywać jej w sesji.

---

### 5.5. `DataVault/app.js` — helpery widoczności

Dodać helpery:

```js
function isBestiarySheet(name){
  return canonKey(name) === canonKey("Bestiariusz");
}

function shouldShowRowInCurrentSystemView(row, sheetName){
  if (isBestiarySheet(sheetName) && isOldStatusRow(row) && !showOldBestiaryEntries){
    return false;
  }
  return true;
}

function getSystemVisibleRows(sheetName){
  const rows = DB?.sheets?.[sheetName] || [];
  return rows.filter(row => shouldShowRowInCurrentSystemView(row, sheetName));
}
```

Nazwa „system view” jest celowa: to filtr narzucony przez logikę aplikacji, niezależny od filtrów wpisywanych przez użytkownika w UI.

---

### 5.6. `DataVault/app.js` — filtrowanie renderowanych wierszy

Obecnie `renderBody()` pracuje na wszystkich wierszach arkusza:

```js
const rowsAll = DB.sheets[currentSheet] || [];
const filtered = sortRows(rowsAll.filter(r => passesFilters(r, cols)));
```

Należy zmienić to na wariant, w którym najpierw działa filtr systemowy ukrywający stare wpisy Bestiariusza:

```js
const rowsAll = DB.sheets[currentSheet] || [];
const rowsVisible = getSystemVisibleRows(currentSheet);
const filtered = sortRows(rowsVisible.filter(r => passesFilters(r, cols)));
```

W tej logice `rowsAll` może nadal być potrzebne do kolumn, porównania lub innych operacji, ale renderowanie powinno korzystać z `rowsVisible`.

---

### 5.7. `DataVault/app.js` — menu filtrów kolumn

Funkcja `uniqueValuesForColumn(col)` obecnie bierze wartości z:

```js
const rows = DB.sheets[currentSheet] || [];
```

Po zmianie powinna brać wartości z wierszy widocznych systemowo:

```js
const rows = getSystemVisibleRows(currentSheet);
```

Dlaczego to ważne:

* przy checkboxie odznaczonym menu filtrów nie powinno pokazywać wartości, które istnieją wyłącznie w ukrytych rekordach `old`;
* aktywne wskaźniki filtrów powinny porównywać wybrane wartości z realnie widocznym zakresem danych;
* użytkownik nie powinien widzieć „śladu” ukrytych rekordów przez wartości w filtrach.

Dodatkowo warto rozważyć sanitizację `view.filtersSet[col]` po przełączeniu checkboxa, ponieważ filtr zapisany wcześniej przy widocznych rekordach `old` może zawierać wartości, których po ukryciu starych rekordów nie ma już w widocznych danych.

Minimalnie wystarczy, że `passesFilters` działa na `rowsVisible`, ale dopracowany wariant powinien również odświeżyć menu filtrów i wskaźniki aktywności.

---

### 5.8. `DataVault/app.js` — obsługa zmiany checkboxa

Dodać listener:

```js
if (els.toggleOldBestiaryEntries){
  els.toggleOldBestiaryEntries.addEventListener("change", ()=>{
    showOldBestiaryEntries = Boolean(els.toggleOldBestiaryEntries.checked);

    if (isBestiarySheet(currentSheet) && !showOldBestiaryEntries){
      removeHiddenOldBestiarySelections();
    }

    if (isBestiarySheet(currentSheet)){
      renderBody();
      updateFilterIndicators();
    }

    saveSessionState();
  });
}
```

Funkcja `removeHiddenOldBestiarySelections()` powinna usunąć z `view.selected` stare rekordy, które właśnie zostały ukryte.

Przykład:

```js
function removeHiddenOldBestiarySelections(){
  if (!isBestiarySheet(currentSheet)) return;
  const rows = DB?.sheets?.[currentSheet] || [];
  const hiddenOldIds = new Set(rows.filter(isOldStatusRow).map(row => row.__id));
  let changed = false;

  for (const id of [...view.selected]){
    if (hiddenOldIds.has(id)){
      view.selected.delete(id);
      changed = true;
    }
  }

  if (changed){
    els.btnCompare.disabled = view.selected.size < 2;
  }
}
```

To zabezpiecza przed sytuacją, w której admin zaznaczy stare wpisy, odznaczy checkbox, a potem nadal będzie mógł porównać ukryte rekordy przez stan zaznaczenia.

---

### 5.9. `DataVault/app.js` — widoczność checkboxa w `initUI()`

W `initUI()` dodać:

```js
if (els.toggleBestiaryOldGroup){
  els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;
}
if (els.toggleOldBestiaryEntries){
  els.toggleOldBestiaryEntries.checked = showOldBestiaryEntries;
}
```

Nie należy ustawiać `showOldBestiaryEntries = true` automatycznie w żadnym trybie.

---

### 5.10. `DataVault/app.js` — przyciski „Pełen Widok” i „Widok Domyślny”

W DataVault istnieją przyciski:

* `Pełen Widok` — `btnReset`, wywołuje `applyViewModeToAllSheets("full")`;
* `Widok Domyślny` — `btnDefaultView`, wywołuje `applyViewModeToAllSheets("default")`.

Wymaganie mówi:

```text
Wpisy mające Old w zakładce Bestiariusz mają być widoczne tylko jak admin zaznaczy checkbox.
```

Dlatego `Pełen Widok` nie powinien sam pokazywać rekordów `old`. Checkbox ma pozostać jedynym przełącznikiem ich widoczności.

Rekomendowane zachowanie:

* `Pełen Widok` czyści zwykłe filtry i sortowanie, ale nie włącza widoczności `old`;
* `Widok Domyślny` może dodatkowo odznaczać checkbox i ustawiać `showOldBestiaryEntries = false`, ponieważ odpowiada stanowi domyślnemu;
* jeśli zostanie przyjęte, że oba przyciski przywracają stan bezpieczny, oba mogą odznaczać checkbox. Wtedy trzeba jasno zaakceptować, że `Pełen Widok` nie oznacza „pokaż absolutnie wszystko”, tylko „pełen widok zwykłych danych z zachowaniem ukrycia rekordów zdezaktualizowanych”.

Najbezpieczniej: `Pełen Widok` nie zmienia checkboxa, `Widok Domyślny` odznacza checkbox.

---

## 6. Oznaczenie wizualne `Nazwa` i `Typ`

### 6.1. Problem z obecną klasą `.row-old`

Obecna reguła:

```css
.dataTable tbody tr.row-old{color:var(--text-old)}
```

koloruje cały wiersz. To jest szersze niż obecny wymóg.

Nowe zachowanie dla `Bestiariusza` powinno być:

```text
Stary rekord jest widoczny tylko po zaznaczeniu checkboxa, a po pokazaniu tylko pola Nazwa i Typ są zapisane innym fontem / stylem.
```

---

### 6.2. Rekomendowana zmiana w `renderRow`

W pętli tworzącej komórki można dodać klasę tylko dla komórek `Nazwa` i `Typ` w arkuszu `Bestiariusz`:

```js
function renderRow(r, cols){
  const tr = document.createElement("tr");
  const isOldRow = isOldStatusRow(r);
  tr.classList.toggle("row-selected", view.selected.has(r.__id));
  tr.classList.toggle("row-old", isOldRow);

  // ...checkbox wyboru...

  for (const col of cols){
    const td = document.createElement("td");
    td.dataset.col = col;

    const isOldBestiaryIdentityCell =
      isBestiarySheet(currentSheet)
      && isOldRow
      && (canonKey(col) === canonKey("Nazwa") || canonKey(col) === canonKey("Typ"));

    td.classList.toggle("bestiary-old-identity", isOldBestiaryIdentityCell);

    // dalsze obecne renderowanie komórki
  }

  return tr;
}
```

---

### 6.3. Rekomendowana zmiana CSS

W `DataVault/style.css` dodać reguły specyficzne dla `Bestiariusza`:

```css
/* W Bestiariuszu rekord old nie powinien przygaszać całego wiersza,
   tylko pola identyfikujące wpis: Nazwa i Typ. */
.dataTable[data-sheet="Bestiariusz"] tbody tr.row-old{
  color:var(--text);
}

.dataTable[data-sheet="Bestiariusz"] tbody tr.row-old td.bestiary-old-identity,
.dataTable[data-sheet="Bestiariusz"] tbody tr.row-old td.bestiary-old-identity .celltext{
  color:var(--text-old);
  font-style:italic;
}
```

Jeżeli celem jest „inny font” w znaczeniu mocniejszej różnicy typograficznej, można użyć także:

```css
font-weight:700;
letter-spacing:.10em;
```

Jednak rekomenduję najpierw wariant łagodny:

```css
color:var(--text-old);
font-style:italic;
```

Jest spójny z istniejącym `--text-old`, nie zaburza tabeli i nie wymaga nowej rodziny fontów.

---

## 7. Kolejność filtrowania i sortowania

Rekomendowana kolejność operacji w `renderBody()`:

```text
1. Pobierz wszystkie wiersze z DB.sheets[currentSheet].
2. Zastosuj filtr systemowy: ukryj Bestiariusz old, jeśli checkbox jest odznaczony.
3. Zastosuj global search i filtry kolumn.
4. Zastosuj sortowanie.
5. Renderuj wynik.
```

Czyli:

```js
const rowsVisible = getSystemVisibleRows(currentSheet);
const filtered = sortRows(rowsVisible.filter(r => passesFilters(r, cols)));
```

Nie należy robić:

```js
DB.sheets.Bestiariusz = DB.sheets.Bestiariusz.filter(row => !isOldStatusRow(row));
```

Nie należy też usuwać starych rekordów podczas normalizacji danych ani importu XLSX.

---

## 8. Wpływ na porównywanie rekordów

DataVault pozwala zaznaczyć 2+ wiersze i użyć przycisku `Porównaj zaznaczone`.

Po ukryciu rekordów `old` trzeba dopilnować, aby nie dało się porównać ukrytych starych rekordów przez stan pozostawiony w `view.selected`.

Rekomendacja:

1. Przy odznaczeniu checkboxa usuwać z `view.selected` ID rekordów `old` z `Bestiariusza`.
2. W `openCompareModal` można dodatkowo zabezpieczyć się przez porównywanie tylko rekordów przechodzących `shouldShowRowInCurrentSystemView(row, currentSheet)`.

Dodatkowe zabezpieczenie w `openCompareModal`:

```js
const rowsAll = DB.sheets[currentSheet] || [];
const picked = [...view.selected]
  .map(id => rowsAll.find(r => r.__id === id))
  .filter(Boolean)
  .filter(row => shouldShowRowInCurrentSystemView(row, currentSheet));
```

To jest defensywne i chroni przed nieoczekiwanym stanem UI.

---

## 9. Wpływ na zapis sesji

Obecny `saveSessionState()` zapisuje:

* widoki arkuszy;
* obecne przełączniki `uiState`;
* język.

Nowy checkbox powinien być domyślnie odznaczony, więc jego stanu nie należy zapisywać w sesji, chyba że zostanie podjęta osobna decyzja projektowa.

Ważna pułapka:

```js
toggles: {...uiState}
```

Jeżeli `showOldBestiaryEntries` zostanie dodane do `uiState`, zacznie się zapisywać automatycznie. To byłoby sprzeczne z domyślnym odznaczeniem po wejściu do modułu.

Rekomendacja:

* nie dodawać `showOldBestiaryEntries` do `uiState`;
* albo jawnie whitelistować zapisywane toggles.

---

## 10. Czego nie zmieniać

W ramach tej zmiany nie należy zmieniać:

* struktury arkusza `Bestiariusz`;
* wartości `old` w kolumnie `Stan`;
* importu `Repozytorium.xlsx`;
* struktury `data.json`;
* struktury `firebase-import.json`;
* Firebase Realtime Database;
* `HIDDEN_COLUMNS` dla `lp` i `stan`;
* reguły, że `Bestiariusz` jest zakładką admin-only;
* globalnego mechanizmu formatowania markerów `{{RED}}`, `{{B}}`, `{{I}}`, `{{S}}`;
* innych zakładek DataVault.

---

## 11. Kryteria akceptacji

### 11.1. Widok admina

Zmiana jest poprawna, jeżeli w trybie admina:

* w panelu filtrów widoczny jest checkbox `Czy wyświetlić zdezaktualizowane wpisy?`;
* checkbox jest pierwszym checkboxem, nad `Czy wyświetlić zakładki dotyczące tworzenia postaci?`;
* checkbox jest domyślnie odznaczony;
* zakładka `Bestiariusz` jest dostępna jak dotychczas;
* przy odznaczonym checkboxie rekordy z `Stan = old` nie są widoczne;
* przy zaznaczonym checkboxie rekordy z `Stan = old` są widoczne;
* przy widocznych rekordach `old` tylko komórki `Nazwa` i `Typ` mają styl `old` / inny font;
* kolumny `LP` i `Stan` pozostają ukryte.

---

### 11.2. Widok użytkownika

Zmiana jest poprawna, jeżeli w widoku użytkownika:

* checkbox `Czy wyświetlić zdezaktualizowane wpisy?` nie jest widoczny;
* nie pozostaje po nim puste miejsce;
* pierwszym checkboxem w panelu pozostaje `Czy wyświetlić zakładki dotyczące tworzenia postaci?`;
* zakładka `Bestiariusz` nadal jest niewidoczna, zgodnie z `ADMIN_ONLY_SHEETS`.

---

### 11.3. Filtry i wyszukiwanie

Zmiana jest poprawna, jeżeli przy odznaczonym checkboxie:

* global search nie znajduje ukrytych rekordów `old`;
* filtry kolumn nie pokazują wartości występujących wyłącznie w ukrytych rekordach `old`;
* sortowanie działa na widocznych rekordach;
* komunikat `BRAK WYNIKÓW` pojawia się poprawnie, gdy po filtrach nie ma widocznych rekordów.

Przy zaznaczonym checkboxie:

* global search może znaleźć rekordy `old`;
* filtry kolumn obejmują rekordy `old`;
* sortowanie uwzględnia rekordy `old`.

---

### 11.4. Porównywanie

Zmiana jest poprawna, jeżeli:

* nie da się porównać rekordów `old`, które zostały ukryte przez odznaczenie checkboxa;
* po odznaczeniu checkboxa zaznaczenia ukrytych rekordów `old` są usuwane;
* przycisk `Porównaj zaznaczone` poprawnie aktualizuje stan aktywny / nieaktywny.

---

### 11.5. Sesja i domyślny stan

Zmiana jest poprawna, jeżeli:

* po świeżym wejściu do modułu checkbox jest odznaczony;
* po odświeżeniu strony checkbox nie wraca automatycznie do stanu zaznaczonego;
* zapisane filtry i język działają jak wcześniej;
* istniejące przełączniki tworzenia postaci, walki i pojazdów działają jak wcześniej.

---

## 12. Testy ręczne po wdrożeniu

### 12.1. Admin — stan domyślny

1. Otworzyć `DataVault` z `?admin=1`.
2. Sprawdzić, że checkbox `Czy wyświetlić zdezaktualizowane wpisy?` jest widoczny.
3. Sprawdzić, że checkbox jest pierwszy wśród checkboxów w panelu filtrów.
4. Sprawdzić, że checkbox jest odznaczony.
5. Otworzyć zakładkę `Bestiariusz`.
6. Potwierdzić, że rekordy z `Stan = old` nie są widoczne.
7. Potwierdzić, że kolumny `LP` i `Stan` nie są widoczne.

---

### 12.2. Admin — pokazanie rekordów `old`

1. Zaznaczyć checkbox `Czy wyświetlić zdezaktualizowane wpisy?`.
2. W zakładce `Bestiariusz` potwierdzić, że rekordy z `Stan = old` są widoczne.
3. Sprawdzić, że `Nazwa` i `Typ` w tych rekordach mają styl `old` / inny font.
4. Sprawdzić, że pozostałe komórki nie są niepotrzebnie przygaszone, jeżeli wymaganie ma dotyczyć tylko `Nazwa` i `Typ`.

---

### 12.3. Admin — ponowne ukrycie rekordów `old`

1. Przy zaznaczonym checkboxie zaznaczyć jeden lub więcej starych rekordów.
2. Odznaczyć checkbox.
3. Potwierdzić, że stare rekordy zniknęły.
4. Potwierdzić, że zaznaczenia ukrytych starych rekordów zostały wyczyszczone.
5. Potwierdzić, że `Porównaj zaznaczone` nie pozwala porównać ukrytych wpisów.

---

### 12.4. Użytkownik — brak checkboxa

1. Otworzyć `DataVault` bez `?admin=1`.
2. Potwierdzić, że checkbox `Czy wyświetlić zdezaktualizowane wpisy?` nie jest widoczny.
3. Potwierdzić, że pierwszym checkboxem jest `Czy wyświetlić zakładki dotyczące tworzenia postaci?`.
4. Potwierdzić, że `Bestiariusz` nadal nie jest widoczny.

---

### 12.5. Pełen widok i widok domyślny

1. W adminie przejść do `Bestiariusza`.
2. Przy odznaczonym checkboxie kliknąć `Pełen Widok`.
3. Potwierdzić, że rekordy `old` nadal nie są widoczne.
4. Zaznaczyć checkbox i potwierdzić, że rekordy `old` są widoczne.
5. Kliknąć `Widok Domyślny`.
6. Potwierdzić docelowe zachowanie zgodnie z decyzją implementacyjną: rekomendowane jest odznaczenie checkboxa i ponowne ukrycie rekordów `old`.

---

## 13. Ryzyka i pułapki

### 13.1. `.row-old` koloruje obecnie cały wiersz

To największa różnica względem wymagania. Jeżeli nie zostanie dodany override dla `Bestiariusza`, po pokazaniu rekordów `old` całe wiersze będą przygaszone, a nie tylko `Nazwa` i `Typ`.

Rekomendacja: dodać klasę komórkową `bestiary-old-identity` i CSS specyficzny dla `table[data-sheet="Bestiariusz"]`.

---

### 13.2. Przypadkowe zapisanie checkboxa w sesji

Dodanie nowego stanu do `uiState` bez zmiany `saveSessionState()` spowoduje zapis checkboxa w `sessionStorage`.

Rekomendacja: trzymać `showOldBestiaryEntries` poza `uiState` albo jawnie whitelistować zapisywane przełączniki.

---

### 13.3. Filtry mogą ujawniać wartości z ukrytych rekordów

Jeżeli `uniqueValuesForColumn(col)` nadal będzie czytać wszystkie wiersze z `DB.sheets[currentSheet]`, menu filtrów może pokazywać wartości istniejące tylko w ukrytych rekordach `old`.

Rekomendacja: menu filtrów powinno używać `getSystemVisibleRows(currentSheet)`.

---

### 13.4. Zaznaczone ukryte rekordy mogłyby trafić do porównania

Jeżeli admin zaznaczy stare rekordy, a potem je ukryje, `view.selected` może nadal zawierać ich `__id`.

Rekomendacja: przy odznaczeniu checkboxa czyścić zaznaczenia starych rekordów i defensywnie filtrować rekordy w `openCompareModal`.

---

### 13.5. Semantyka „Pełen Widok”

Nazwa `Pełen Widok` może sugerować pokazanie wszystkich danych, ale wymaganie mówi, że rekordy `old` mają być widoczne tylko po zaznaczeniu checkboxa.

Rekomendacja: checkbox ma mieć pierwszeństwo. `Pełen Widok` nie powinien sam pokazywać rekordów `old`.

---

## 14. Rekomendacja końcowa

Wdrożyć zmianę jako lekką rozbudowę front-endową w `DataVault`, bez ingerencji w dane i import.

Rekomendowany wariant:

```text
admin-only checkbox w panelu filtrów
+ domyślnie odznaczony runtime state
+ filtrowanie tylko renderowanego widoku Bestiariusza
+ brak modyfikacji DB.sheets.Bestiariusz
+ menu filtrów oparte na wierszach widocznych systemowo
+ czyszczenie zaznaczeń ukrytych rekordów old
+ oznaczenie tylko komórek Nazwa i Typ przez klasę bestiary-old-identity
+ override CSS dla Bestiariusza, żeby .row-old nie kolorowało całego wiersza
```

Zmiana powinna być niewielka, ale wymaga uważnego potraktowania trzech miejsc: renderowania wierszy, menu filtrów oraz zapisu sesji. Najważniejsze jest zachowanie zasady z `Analizy/nazwy_old.md`: nie usuwać rekordów `old` z danych, tylko kontrolować ich widoczność na poziomie UI.

## Zmiany wykonane w kodzie

Data aktualizacji: 2026-06-15

### Plik: `DataVault/index.html`

Lokalizacja: panel `.panelBody`, przed checkboxem `#toggleCharacterTabs`.

Było:

```html
<label class="checkboxRow">
  <input type="checkbox" id="toggleCharacterTabs" />
  <span class="checkboxLabel" data-i18n="toggleCharacterTabs">Czy wyświetlić zakładki dotyczące tworzenia postaci?</span>
</label>
```

Jest:

```html
<label class="checkboxRow checkboxRow--bestiaryOld" id="toggleBestiaryOldGroup" hidden>
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel" data-i18n="toggleOldBestiaryEntries">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

Nowy checkbox jest pierwszym checkboxem w panelu filtrów i ma wrapper `hidden`, żeby w trybie użytkownika nie zostawiał pustego miejsca.

### Plik: `DataVault/app.js`

Lokalizacja: obiekt `els`, tłumaczenia, stan runtime oraz helpery widoczności systemowej.

Było: aplikacja nie miała osobnego przełącznika widoczności wpisów `old` w `Bestiariuszu`; rekordy `old`, jeśli były widoczne przez aktualny widok tabeli, były traktowane jak pozostałe wiersze.

Jest: dodano referencje `toggleBestiaryOldGroup` i `toggleOldBestiaryEntries`, tłumaczenia PL/EN, runtime stan `showOldBestiaryEntries = false` poza `uiState` oraz helpery `isBestiarySheet`, `shouldShowRowInCurrentSystemView`, `getSystemVisibleRows` i `pruneHiddenOldBestiarySelection`.

### Plik: `DataVault/app.js`

Lokalizacja: `renderBody()` i `uniqueValuesForColumn(col)`.

Było:

```js
const rowsAll = DB.sheets[currentSheet] || [];
```

Jest:

```js
const rowsAll = getSystemVisibleRows(currentSheet);
```

Filtrowanie globalne, filtry kolumn, sortowanie i menu wartości unikalnych działają na wierszach widocznych po systemowym ukryciu wpisów `old` w `Bestiariuszu`.

### Plik: `DataVault/app.js`

Lokalizacja: `renderRow(r, cols)`.

Było: klasa `row-old` oznaczała cały wiersz każdego rekordu `old`.

Jest: w `Bestiariuszu` rekord `old` dostaje dodatkowo `row-old--bestiary`, a tylko komórki kolumn `Nazwa` i `Typ` dostają klasę `bestiary-old-identity`.

### Plik: `DataVault/app.js`

Lokalizacja: listener `#toggleOldBestiaryEntries` i `applyViewModeToAllSheets(mode)`.

Było: stan widoku nie czyścił zaznaczeń ukrytych rekordów `old`, ponieważ nie istniał filtr systemowy dla `Bestiariusza`.

Jest: odznaczenie checkboxa czyści ukryte rekordy `old` z `view.selected`, zamyka otwarte menu filtra, odświeża tabelę i wskaźniki filtrów. `Widok Domyślny` odznacza checkbox oraz ukrywa wpisy `old`. Stan checkboxa nie jest dopisywany do `uiState`, więc nie jest zapisywany w `sessionStorage`.

### Plik: `DataVault/style.css`

Lokalizacja: reguły `.row-old` oraz nowe reguły `.row-old--bestiary` / `.bestiary-old-identity`.

Było:

```css
.dataTable tbody tr.row-old{color:var(--text-old)}
```

Jest: globalne kolorowanie całego wiersza `row-old` nie obejmuje `row-old--bestiary`, a w `Bestiariuszu` kolor `--text-old` i kursywa dotyczą tylko komórek `Nazwa` i `Typ` oznaczonych klasą `bestiary-old-identity`.

### Pliki dokumentacji: `DataVault/docs/README.md`, `DataVault/docs/Documentation.md`, `DataVault/DetaleLayout.md`

Lokalizacja: sekcje opisujące panel filtrów, filtrowanie, renderowanie, stan `old` i checkboxy.

Było: dokumentacja opisywała ogólne checkboxy zakładek oraz globalny styl `row-old`.

Jest: dokumentacja opisuje aktualny adminowy checkbox zdezaktualizowanych wpisów, systemowe filtrowanie `old` tylko w `Bestiariuszu`, brak zapisu stanu checkboxa w sesji, czyszczenie zaznaczeń ukrytych rekordów oraz stylowanie tylko pól `Nazwa` i `Typ`.

---

# Aktualizacja analizy — checkbox wpisów zdezaktualizowanych widoczny w trybie użytkownika

**Data aktualizacji:** 2026-06-15
**Temat:** ustalenie przyczyny, dla której checkbox `Czy wyświetlić zdezaktualizowane wpisy?` pojawia się także w widoku użytkownika, oraz wskazanie naprawy ograniczającej widoczność opcji do trybu admina.

## Pełna treść nowego promptu użytkownika

```text
Przeczytaj i zaktualizuj analizę o nowe wnioski Analizy/Bestiariusz_old.md

1. Checkbox "Czy wyświetlić zdezaktualizowane wpisy?" się pojawił
2. Checkbox "Czy wyświetlić zdezaktualizowane wpisy? domyślnie jest odznaczony
3. Wpisy "old" pojawiają się tylko jak checkbox jest zaznaczony

To wszystko działa i tak powinno być.

Problem jest tylko w tym, że ten checkbox pojawia się zarówno w trybie admina jak i użytkownika. Powinien być widoczny tylko w trybie admina.

Przeprowadź analizę czemu checkbox jest widoczny również w widoku użytkownika i jak to naprawić, żeby ta opcja była widoczna tylko w trybie admina.
```

## Zakres dodatkowej analizy

Sprawdzono aktualny stan plików modułu `DataVault` związanych z widocznością checkboxa:

- `DataVault/index.html` — miejsce dodania wrappera `#toggleBestiaryOldGroup` i inputa `#toggleOldBestiaryEntries`;
- `DataVault/app.js` — wykrywanie `ADMIN_MODE`, ustawianie `hidden` w `initUI()` oraz listener checkboxa;
- `DataVault/style.css` — reguły layoutu checkboxów, szczególnie `.checkboxRow` oraz `.checkboxRow--bestiaryOld`.

## Potwierdzone działające elementy

Aktualna implementacja spełnia trzy główne warunki funkcjonalne:

1. Checkbox `Czy wyświetlić zdezaktualizowane wpisy?` został dodany do panelu filtrów.
2. Checkbox jest domyślnie odznaczony, ponieważ stan runtime `showOldBestiaryEntries` startuje jako `false` i nie jest zapisywany w `uiState`.
3. Wpisy `old` w `Bestiariuszu` pojawiają się tylko wtedy, gdy checkbox jest zaznaczony, ponieważ renderowanie korzysta z `getSystemVisibleRows(currentSheet)`, a `shouldShowRowInCurrentSystemView(row, sheetName)` ukrywa rekordy `old` dla `Bestiariusza`, gdy `showOldBestiaryEntries` jest fałszywe.

Problem nie dotyczy więc logiki filtrowania rekordów. Dotyczy wyłącznie warstwy widoczności samego elementu HTML checkboxa w panelu bocznym.

## Przyczyna problemu

W `DataVault/index.html` wrapper checkboxa ma poprawnie ustawiony atrybut `hidden`:

```html
<label class="checkboxRow checkboxRow--bestiaryOld" id="toggleBestiaryOldGroup" hidden>
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel" data-i18n="toggleOldBestiaryEntries">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

W `DataVault/app.js` logika również jest poprawna intencyjnie:

```js
if (els.toggleBestiaryOldGroup){
  els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;
}
```

Dla adresu bez parametru `?admin=1` stała `ADMIN_MODE` ma wartość `false`, więc JavaScript ustawia:

```js
els.toggleBestiaryOldGroup.hidden = true;
```

Mimo to checkbox pozostaje widoczny, ponieważ reguła CSS dla `.checkboxRow` wymusza wyświetlanie elementu:

```css
.checkboxRow{
  display:flex;
  gap:10px;
  align-items:center;
  margin-top:12px;
  font-size:12px;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--text2);
}
```

Atrybut HTML `hidden` działa domyślnie przez przeglądarkową regułę podobną do:

```css
[hidden] { display: none; }
```

Reguła projektu `.checkboxRow { display:flex; }` pochodzi jednak z arkusza autora strony i ma pierwszeństwo nad domyślną regułą przeglądarki. W efekcie element z atrybutem `hidden`, który jednocześnie ma klasę `.checkboxRow`, może zostać ponownie pokazany jako flex.

To wyjaśnia obserwację ze zrzutu ekranu: checkbox jest odznaczony i filtruje dane poprawnie, ale wrapper nie znika w trybie użytkownika, bo CSS nadpisuje mechanizm ukrywania.

## Rekomendowana naprawa

Najbezpieczniej dodać globalną regułę CSS respektującą atrybut `hidden` również dla elementów stylowanych przez własne klasy projektu:

```css
[hidden]{display:none !important}
```

Reguła powinna znaleźć się wysoko w `DataVault/style.css`, najlepiej w części bazowej, zanim zaczynają się komponenty takie jak `.checkboxRow`, `.panel`, `.modal`, `.popover` i `.filterMenu`.

Dlaczego wariant globalny jest rekomendowany:

- naprawia bezpośrednio checkbox `#toggleBestiaryOldGroup`;
- zabezpiecza inne elementy w module, które także używają atrybutu `hidden`, np. bramkę dostępu `#accessGate`;
- zachowuje semantykę HTML — jeśli element ma `hidden`, ma być niewidoczny niezależnie od klasy layoutowej;
- nie wymaga zmian w działającej logice filtrowania `old`;
- nie wpływa na elementy sterowane przez `aria-hidden`, takie jak modal, popover lub menu filtrów, ponieważ one używają osobnych selektorów `[aria-hidden="false"]`.

Minimalny wariant zawężony tylko do tego checkboxa również jest możliwy:

```css
#toggleBestiaryOldGroup[hidden]{display:none !important}
```

albo:

```css
.checkboxRow[hidden]{display:none !important}
```

Wariant globalny `[hidden]{display:none !important}` jest jednak bardziej odporny na podobne błędy w przyszłości.

## Dodatkowe zabezpieczenie w JavaScript

Po stronie JavaScript można dodatkowo ustawić styl inline tylko dla wrappera adminowego:

```js
if (els.toggleBestiaryOldGroup){
  els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;
  els.toggleBestiaryOldGroup.style.display = ADMIN_MODE ? "" : "none";
}
```

Nie jest to jednak rekomendowana główna naprawa, ponieważ miesza odpowiedzialności: JavaScript powinien ustawić stan (`hidden`), a CSS powinien gwarantować, że stan `hidden` oznacza brak widoczności. Lepszym rozwiązaniem jest poprawka w CSS.

## Rekomendowany zakres implementacji

Do naprawy wystarczy zmienić `DataVault/style.css`:

```css
[hidden]{display:none !important}
```

Nie trzeba zmieniać:

- `DataVault/index.html`, bo wrapper ma już poprawny atrybut `hidden`;
- logiki filtrowania `old` w `DataVault/app.js`, bo działa poprawnie;
- tłumaczeń checkboxa;
- domyślnego stanu checkboxa;
- mechanizmu `getSystemVisibleRows()`;
- stylowania rekordów `old` w tabeli.

## Ryzyka i uwagi testowe

Po dodaniu reguły `[hidden]{display:none !important}` należy sprawdzić:

1. Widok użytkownika pod adresem bez `?admin=1`:
   - checkbox `Czy wyświetlić zdezaktualizowane wpisy?` nie jest widoczny;
   - pierwszym widocznym checkboxem pozostaje `Czy wyświetlić zakładki dotyczące tworzenia postaci?`;
   - rekordy `old` w `Bestiariuszu` nie są dostępne dla użytkownika, a sama zakładka `Bestiariusz` pozostaje ukryta jako `ADMIN_ONLY_SHEETS`.
2. Widok admina pod adresem z `?admin=1`:
   - checkbox jest widoczny;
   - checkbox jest domyślnie odznaczony;
   - wpisy `old` pojawiają się tylko po zaznaczeniu checkboxa;
   - po odznaczeniu checkboxa wpisy `old` znikają.
3. Elementy z `aria-hidden`, czyli modal, popover i menu filtrów, nadal działają normalnie, ponieważ reguła dotyczy wyłącznie atrybutu `hidden`, a nie `aria-hidden`.

## Wniosek końcowy

Przyczyną widoczności checkboxa w trybie użytkownika nie jest błędne wykrywanie admina ani błędna logika checkboxa. Przyczyną jest konflikt CSS: klasa `.checkboxRow` ustawia `display:flex`, przez co nadpisuje domyślne ukrywanie elementów z atrybutem `hidden`.

Naprawa powinna polegać na dodaniu w `DataVault/style.css` reguły:

```css
[hidden]{display:none !important}
```

Po tej zmianie istniejący kod `els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;` zacznie działać zgodnie z intencją: checkbox będzie widoczny tylko w trybie admina i ukryty w trybie użytkownika.

# Analiza modułu DataVault — filtrowanie i problem z zamykaniem menu

## Prompt użytkownika

"Przeprowadź analizę modułu DataVault. Napisz mi dokładnie jak działa funkcjonalność filtrowania.  Jak naciskam przycisk ze strzałką otwierające menu do filtrowania to jak drugi raz kliknę w ten sam przycisk to okno nie znika. Muszę kliknąć gdzieś indziej w aplikacji, żeby zapisały mi się filtry i zniknęło okno. Czy można to jakoś poprawić? Zaproponuj rozwiązanie."

## Zakres analizy

Analiza dotyczy pliku `DataVault/app.js`, głównie funkcji:
- `openFilterMenu(col, anchorBtn)`
- `closeFilterMenu()`
- `passesFilters(row, cols)`
- fragmentów budowy nagłówka tabeli z przyciskiem `▾`.

## Jak działa filtrowanie obecnie (krok po kroku)

1. **Dwa typy filtrów działają równolegle:**
   - filtr tekstowy per kolumna (`view.filtersText[col]`) — wpisywany w input w drugim wierszu nagłówka,
   - filtr zbioru wartości (`view.filtersSet[col]`) — ustawiany przez menu pod strzałką `▾`.

2. **Otwieranie menu filtrowania (`▾`):**
   - kliknięcie przycisku uruchamia `openFilterMenu(col, btn)`,
   - menu (`#filterMenu`) jest czyszczone i budowane od zera (tytuł, wyszukiwarka, listy checkboxów, akcje „Zaznacz wszystko” / „Wyczyść”),
   - lista wartości kolumny pochodzi z `uniqueValuesForColumn(col)`.

3. **Stan zaznaczeń w menu:**
   - jeśli `view.filtersSet[col]` istnieje, menu startuje od tej zapisanej selekcji,
   - jeśli brak filtra zestawu, wszystkie wartości są domyślnie zaznaczone.

4. **Zapisywanie filtra odbywa się natychmiast:**
   - po zmianie checkboxa wywoływane jest `applySetFilter()`,
   - gdy zaznaczone są wszystkie wartości: `view.filtersSet[col] = null` (brak ograniczenia),
   - w przeciwnym razie: `view.filtersSet[col] = new Set(selected)`,
   - następnie od razu `renderBody()` (widok tabeli się odświeża).

5. **Zamykanie menu:**
   - `openFilterMenu` dodaje jednorazowy listener `document.addEventListener('mousedown', onDoc, { once: true })`,
   - w `onDoc`: jeśli kliknięcie jest **w menu** albo **w tym samym przycisku**, nic nie robi (`return`),
   - przy kliknięciu poza nimi wywoływane jest `closeFilterMenu()`.

## Dlaczego drugi klik w ten sam przycisk nie zamyka menu

To jest zgodne z aktualną logiką kodu:

1. Klik na strzałkę trafia do warunku:
   - `if (menu.contains(ev.target) || anchorBtn.contains(ev.target)) return;`
   - więc zamknięcie nie następuje.

2. Dodatkowo listener jest `once: true`, więc po tym kliknięciu zostaje usunięty.

3. Potem handler przycisku znowu wywołuje `openFilterMenu(...)`, które odświeża to samo menu zamiast je przełączyć (toggle).

Efekt: użytkownik ma wrażenie, że „drugi klik nic nie robi”, a menu znika dopiero po kliknięciu poza nim.

## Czy filtry „zapisują się” dopiero po kliknięciu poza menu?

Nie — technicznie zapis następuje wcześniej, od razu po zmianie checkboxów / akcjach „Zaznacz wszystko” / „Wyczyść” przez `applySetFilter()` i `renderBody()`.

Klik poza menu służy obecnie tylko do jego zamknięcia wizualnego.

## Proponowane rozwiązanie (rekomendowane)

Dodać **toggle** dla tego samego przycisku:

- jeśli menu jest otwarte dla tej samej kolumny i tego samego `anchorBtn`, drugi klik powinien je zamknąć,
- jeśli kliknięto inny przycisk filtrowania, menu powinno przełączyć się na nową kolumnę.

### Szkic implementacji

1. Wprowadzić stan, np.:
   - `let activeFilterCol = null;`
   - `let activeFilterBtn = null;`
   - helper `isFilterMenuOpen()` sprawdzający `aria-hidden !== 'true'`.

2. Na wejściu `openFilterMenu(col, anchorBtn)` dodać:
   - jeśli menu otwarte i `activeFilterCol === col` i `activeFilterBtn === anchorBtn` -> `closeFilterMenu();` oraz wyzerowanie aktywnego stanu i `return`.

3. Przy normalnym otwieraniu ustawić aktywny stan (`activeFilterCol`, `activeFilterBtn`).

4. W `closeFilterMenu()` wyczyścić aktywny stan.

5. (Opcjonalnie) zamienić jednorazowy listener `once: true` na stabilny model „podczas otwarcia nasłuchuj, podczas zamknięcia odpinaj”, żeby uniknąć kruchych interakcji.

## Korzyści po poprawce

- UX zgodny z intuicją: drugi klik w `▾` zamyka panel,
- mniejsze poczucie „zawieszenia” interfejsu,
- brak wpływu na istniejącą logikę zapisywania filtrów (zostaje natychmiastowa).

## Ryzyka i testy regresji po wdrożeniu

Po zmianie warto sprawdzić:

1. otwórz/zamknij menu tym samym przyciskiem,
2. przełączanie menu między dwiema różnymi kolumnami,
3. klik w menu nie zamyka panelu,
4. klik poza menu zamyka panel,
5. filtry nadal działają i aktualizują tabelę od razu.

## Dodatkowa sugestia UX (opcjonalna)

Warto rozważyć mały przycisk „Zamknij” w menu filtrowania (zwłaszcza mobile), niezależnie od kliknięcia poza obszarem.

---

## Aktualizacja po wdrożeniu (2026-04-13) — dokładny zakres zmian w kodzie

Poniżej zapisano dokładnie co zostało zmienione i gdzie, aby można było szybko wycofać poprawkę.

### 1) `DataVault/app.js`

Wdrożono rekomendowane rozwiązanie toggle oraz stabilne odpinanie listenera dokumentu.

#### Dodane zmienne stanu (sekcja globalna przy `tableEl` / `tbodyEl`)
- `let activeFilterCol = null;`
- `let activeFilterBtn = null;`
- `let filterMenuDocHandler = null;`

#### Dodany helper
- `isFilterMenuOpen()` — zwraca `true`, gdy `#filterMenu` ma `aria-hidden` różne od `"true"`.

#### Zmienione `openFilterMenu(col, anchorBtn)`
1. Na wejściu funkcji:
   - jeśli menu jest już otwarte **dla tej samej kolumny i tego samego przycisku** (`activeFilterCol === col && activeFilterBtn === anchorBtn`) → wywołuje `closeFilterMenu()` i `return` (to realizuje toggle: drugi klik zamyka menu).
2. Jeśli menu było otwarte dla innej kolumny:
   - najpierw `closeFilterMenu()`, potem otwarcie nowego menu.
3. Przy otwieraniu:
   - aktualizuje aktywny stan: `activeFilterCol = col`, `activeFilterBtn = anchorBtn`.
4. Zmieniono obsługę kliknięcia poza menu:
   - zamiast jednorazowego listenera `{ once: true }` przypinany jest handler do `document.mousedown` i zdejmowany w `closeFilterMenu()`.
   - handler ignoruje kliknięcie wewnątrz menu oraz w przycisk-kotwicę; w pozostałych przypadkach zamyka menu.

#### Zmienione `closeFilterMenu()`
- Odpina `document.removeEventListener("mousedown", filterMenuDocHandler)`.
- Zeruje:
  - `filterMenuDocHandler = null`
  - `activeFilterCol = null`
  - `activeFilterBtn = null`
- Zachowuje poprzednie zachowanie:
  - `aria-hidden="true"`
  - `menu.innerHTML = ""`

### 2) `DataVault/docs/README.md`

Zaktualizowano instrukcję użytkownika (PL i EN), sekcja skrótów funkcji interfejsu / UI shortcuts:
- dopisano, że przycisk `▾` działa jako toggle (drugi klik zamyka menu, klik poza menu także zamyka).

### 3) `DataVault/docs/Documentation.md`

Zaktualizowano techniczny opis filtrowania (sekcja 10.3):
- opisano nowe zmienne stanu `activeFilterCol`, `activeFilterBtn`,
- opisano helper `isFilterMenuOpen()`,
- opisano nową logikę toggle i przełączania między kolumnami,
- opisano lifecycle `filterMenuDocHandler` (podpięcie przy otwarciu, odpięcie w `closeFilterMenu()`).

## Jak wycofać poprawkę (rollback)

### Wariant szybki (Git)
1. Cofnąć commit wdrażający tę zmianę:
   - `git revert <hash_commitu>`
2. Wgrać revert na gałąź/deploy.

### Wariant ręczny (bez Git revert)
W `DataVault/app.js`:
1. Usuń dodane zmienne:
   - `activeFilterCol`, `activeFilterBtn`, `filterMenuDocHandler`.
2. Usuń funkcję `isFilterMenuOpen()`.
3. W `openFilterMenu(...)`:
   - usuń warunek toggle na początku,
   - usuń ustawianie `activeFilterCol/activeFilterBtn`,
   - przywróć jednorazowy listener:
     - `const onDoc = (...)`
     - `document.addEventListener("mousedown", onDoc, { once: true })`
4. W `closeFilterMenu()`:
   - usuń odpinanie listenera i reset `activeFilter*`.

W dokumentacji:
5. Usuń dopisane akapity o toggle w:
   - `DataVault/docs/README.md`
   - `DataVault/docs/Documentation.md`

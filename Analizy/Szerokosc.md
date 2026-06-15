# Analiza problemu: zbyt szeroka strona GeneratorNPC

## Kontekst

Problem dotyczy modułu `GeneratorNPC`. Objaw widoczny na zrzucie ekranu: na dole strony pojawia się bardzo długi poziomy pasek przewijania. Użytkownik może przewijać całą stronę w bok, zamiast przewijać tylko szerokie tabele wewnątrz kart.

Analiza została wykonana na podstawie aktualnych plików repozytorium, przede wszystkim:

- `GeneratorNPC/index.html`
- `GeneratorNPC/style.css`
- `Main/index.html`
- `AGENTS.md`

Nie wprowadzono jeszcze zmian w kodzie aplikacji. Ten plik opisuje przyczynę, zalecaną poprawkę i checklistę testów.

---

## Krótki wniosek

Najbardziej prawdopodobna i główna przyczyna problemu to domyślne zachowanie elementów `grid` i `flex`: kolumna robocza `.workspace` jest elementem siatki CSS i ma domyślne `min-width: auto`. W praktyce oznacza to, że nie chce się zwęzić poniżej minimalnej szerokości swojej zawartości.

Jednocześnie karty zawierają bardzo szerokie tabele. Tabele mają ustawione:

```css
.data-table {
  width: 100%;
  min-width: max-content;
}
```

oraz wiele kolumn z dużymi wartościami `min-width`, np. `48ch`, `54ch`, `60ch`. To jest poprawne, jeśli tabela ma przewijać się lokalnie wewnątrz karty. Problem polega na tym, że rodzic `.workspace` nie ma `min-width: 0`, więc przeglądarka traktuje szeroką tabelę jako minimalny rozmiar całej kolumny roboczej. W efekcie rozszerza się cały layout i cały dokument dostaje poziomy scrollbar.

Najważniejsza poprawka:

```css
.workspace {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.card {
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
}
```

Dodatkowo warto dodać ochronnie:

```css
.layout {
  width: 100%;
  max-width: 100%;
}
```

---

## Co widać w strukturze HTML

`GeneratorNPC/index.html` buduje główny układ tak:

```html
<main class="layout">
  <aside class="sidebar">
    ...
  </aside>

  <section class="workspace">
    <div class="card">...</div>
    <div class="card" data-module-section="weapon">...</div>
    <div class="card" data-module-section="armor">...</div>
    ...
  </section>
</main>
```

Czyli są dwa główne obszary:

1. lewy panel `.sidebar`,
2. prawy obszar roboczy `.workspace` z kartami i tabelami.

To jest sensowny układ, ale wymaga jawnego zezwolenia, aby prawa kolumna mogła się zwężać i przekazywać nadmiar szerokości do lokalnego scrolla kart.

---

## Co widać w CSS

W `GeneratorNPC/style.css` główny layout jest siatką:

```css
.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  padding: 28px;
}
```

Prawy obszar roboczy jest flex-kolumną:

```css
.workspace {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

Karty mają przewijanie poziome:

```css
.card {
  overflow-x: auto;
}
```

Tabele wymuszają szerokość minimalną wynikającą z treści:

```css
.data-table {
  width: 100%;
  min-width: max-content;
}
```

Dodatkowo wiele kolumn ma duże `min-width`, na przykład:

```css
.data-table[data-sheet="Bestiariusz"] .min-col-premie {
  min-width: 60ch;
}

.data-table[data-sheet="Bestiariusz"] .min-col-zdolnosci {
  min-width: 60ch;
}

.data-table[data-sheet="Psionika"] .min-col-efekt {
  min-width: 48ch;
}

.data-table[data-sheet="Modlitwy"] .min-col-efekt {
  min-width: 54ch;
}
```

To samo w sobie nie jest błędem. Szerokie tabele są w tym module uzasadnione, bo prezentują długie opisy, cechy, słowa kluczowe, efekty, wzmocnienia i wartości mechaniczne. Błędem jest brak ograniczenia minimalnej szerokości elementów nadrzędnych.

---

## Mechanizm błędu krok po kroku

1. `.layout` tworzy siatkę `360px 1fr`.
2. `.workspace` trafia do kolumny `1fr` jako grid item.
3. Grid item ma domyślnie `min-width: auto`.
4. `min-width: auto` oznacza w tym przypadku: „nie zwężaj mnie poniżej minimalnej szerokości mojej zawartości”.
5. Wewnątrz `.workspace` znajdują się `.card` z tabelami.
6. Tabele mają `min-width: max-content` oraz kolumny z dużymi `min-width`.
7. Minimalna szerokość zawartości robi się bardzo duża.
8. `.workspace` nie pozwala się zwęzić do szerokości viewportu.
9. Siatka rozszerza cały dokument.
10. Przeglądarka pokazuje poziomy scrollbar na całej stronie.

Docelowe zachowanie powinno być inne:

1. `.workspace` zwęża się do dostępnej szerokości.
2. `.card` zostaje w szerokości kolumny.
3. Dopiero tabela wewnątrz `.card` jest szersza.
4. Poziomy scrollbar pojawia się lokalnie na karcie, nie na całym dokumencie.

---

## Dlaczego istniejące `overflow-x: auto` na `.card` nie wystarcza

`overflow-x: auto` działa dopiero wtedy, gdy element może mieć mniejszą szerokość niż jego zawartość.

Tutaj `.card` jest wewnątrz `.workspace`, a `.workspace` jako grid item domyślnie zachowuje się tak, jakby minimalna szerokość była szerokością zawartości. Przez to karta nie ma okazji realnie „stać się mniejsza” od tabeli. Zamiast lokalnego scrolla karty przeglądarka powiększa cały dokument.

To klasyczny przypadek CSS:

- szeroka tabela / `min-width: max-content`,
- element nadrzędny jako grid/flex item,
- brak `min-width: 0` na grid/flex item,
- niekontrolowany poziomy overflow dokumentu.

---

## Czy winny jest moduł Main?

Raczej nie jako główna przyczyna.

`Main/index.html` jest stroną startową z kafelkami/linkami do modułów. Link do GeneratorNPC prowadzi do:

```html
<a class="btn" href="../GeneratorNPC/" target="_self">Generator NPC</a>
```

Na stronie `Main` główny kontener ma szerokość ograniczoną:

```css
main {
  width: min(860px, 100%);
}
```

To nie powinno tworzyć bardzo długiego poziomego paska. Sam objaw ze zrzutu ekranu pokazuje tekst z panelu „Moduły aktywne” GeneratorNPC, więc problem trzeba diagnozować w `GeneratorNPC`, nie w `Main`.

---

## Dodatkowe czynniki zwiększające szerokość

### 1. Szerokie kolumny tabel

W module jest wiele kolumn z dużymi szerokościami minimalnymi. Przykłady:

- `Bestiariusz`: `min-col-premie`, `min-col-zdolnosci`, `min-col-zdolnosci-hordy`, `min-col-opcje-hordy` po `60ch`;
- `Bronie`: kilka kolumn po `28ch`, `30ch`, `32ch`;
- `Psionika`: wiele kolumn, w tym `Efekt` `48ch`, `Wiele Celów` i `Wzmocnienie` po `26ch`;
- `Modlitwy`: `Efekt` `54ch`.

To świadomie tworzy tabele szersze niż ekran. Takie tabele powinny mieć lokalne przewijanie.

### 2. `.celltext` nie łamie agresywnie długich fragmentów

W CSS jest:

```css
.celltext {
  white-space: pre-wrap;
  line-height: 1.45;
  word-break: normal;
  overflow-wrap: normal;
}
```

To zachowuje czytelność opisów, ale może powiększać minimalną szerokość, jeśli w danych występują długie nieprzerwane ciągi znaków. Nie jest to główna przyczyna, ale może zwiększać skalę problemu.

### 3. Górny pasek `.topbar`

`.topbar` i `.actions` używają `display: flex`, ale `.actions` nie ma `flex-wrap: wrap`. Na wąskich ekranach może to powodować mniejszy poziomy overflow. To jednak raczej poboczny problem, bo nie tłumaczy bardzo długiego scrollbara pochodzącego z szerokich tabel.

---

## Zalecana poprawka minimalna

W `GeneratorNPC/style.css` zmienić sekcję `.workspace` i `.card` tak:

```css
.workspace {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.card {
  background: var(--panel2);
  border: 1px solid var(--div);
  border-radius: 8px;
  padding: 18px 20px;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
}
```

Jeżeli nie chcemy scalać dwóch istniejących bloków `.card`, można zostawić strukturę pliku i dopisać tylko:

```css
.workspace {
  min-width: 0;
}

.card {
  min-width: 0;
  max-width: 100%;
}
```

Obecne `overflow-x: auto` na `.card` powinno pozostać.

---

## Zalecana poprawka pełniejsza

Bezpieczniejsza wersja, która ogranicza także kontener siatki:

```css
.layout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 24px;
  padding: 28px;
  width: 100%;
  max-width: 100%;
}

.workspace {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.card {
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
}
```

Najważniejszy element tej wersji to:

```css
grid-template-columns: 360px minmax(0, 1fr);
```

`minmax(0, 1fr)` mówi przeglądarce, że prawa kolumna może zejść do `0` jako minimum, a więc nie ma dziedziczyć minimalnej szerokości szerokiej tabeli. To bardzo dobra praktyka przy gridach zawierających szerokie tabele, karty, preformatowany tekst albo elementy z lokalnym overflow.

Można zastosować zarówno `minmax(0, 1fr)`, jak i `min-width: 0` na `.workspace`. To nie jest nadmiarowe w złym sensie; raczej zabezpiecza layout na różnych silnikach przeglądarek i przy późniejszych zmianach struktury.

---

## Dodatkowa poprawka dla wąskich ekranów

Warto rozważyć także:

```css
.topbar {
  flex-wrap: wrap;
  gap: 12px 18px;
}

.actions {
  flex-wrap: wrap;
}
```

To nie rozwiązuje głównego problemu szerokich tabel, ale może zapobiec osobnemu overflow na telefonach lub w wąskich oknach.

---

## Czego nie robić jako głównej naprawy

### Nie usuwać `min-width` z kolumn tabel jako pierwszej reakcji

Duże `min-width` kolumn są potrzebne, żeby tabele mechaniczne były czytelne. Ich usunięcie może spowodować bardzo wąskie, trudne do czytania kolumny.

### Nie ustawiać globalnie `body { overflow-x: hidden; }` jako jedynej naprawy

To tylko ukryje objaw. Użytkownik straci dostęp do uciętej zawartości, a problem z układem nadal zostanie w DOM. Można ewentualnie dodać `overflow-x: hidden` jako ostatnią warstwę ochronną, ale nie jako właściwe rozwiązanie.

### Nie zmieniać `table-layout: fixed` globalnie dla wszystkich tabel

To mogłoby popsuć czytelność danych i zachowanie tabel z długimi opisami. W module potrzebne są tabele, które mogą być szersze od kontenera i przewijać się lokalnie.

---

## Rekomendowana kolejność wdrożenia

1. W `GeneratorNPC/style.css` zmienić grid:

```css
grid-template-columns: 360px minmax(0, 1fr);
```

2. Dodać do `.workspace`:

```css
min-width: 0;
```

3. Dodać do `.card`:

```css
min-width: 0;
max-width: 100%;
```

4. Zostawić `overflow-x: auto` na `.card`.

5. Opcjonalnie dodać `flex-wrap` do `.topbar` i `.actions`.

---

## Checklist testów po poprawce

Po wdrożeniu CSS sprawdzić:

1. Strona `GeneratorNPC` nie ma poziomego scrollbara na poziomie całego dokumentu.
2. Szerokie tabele nadal mają poziomy scrollbar, ale lokalnie w obrębie `.card`.
3. Po zaznaczeniu modułów `Broń`, `Pancerz`, `Psionika`, `Modlitwy` layout nadal nie rozszerza całej strony.
4. Po wybraniu rekordów z bardzo długim tekstem w kolumnach `Efekt`, `Cechy`, `Słowa Kluczowe`, `Wzmocnienie` i `Premie` przewijanie pozostaje lokalne.
5. Na ekranie około 1366 px szerokości lewy panel ma 360 px, prawa kolumna mieści się w pozostałej przestrzeni.
6. Na ekranach poniżej 1000 px działa istniejący media query i układ przechodzi do jednej kolumny.
7. Na telefonie górny pasek nie wymusza poziomego scrolla.
8. Okno popovera cech nadal mieści się w ekranie dzięki `width: min(360px, 90vw)`.

---

## Szybka diagnostyka w DevTools

Aby potwierdzić przyczynę w przeglądarce:

1. Otworzyć `GeneratorNPC`.
2. W konsoli wpisać:

```js
document.documentElement.scrollWidth - document.documentElement.clientWidth
```

Jeżeli wynik jest dodatni, dokument jest szerszy niż viewport.

3. Tymczasowo dopisać w DevTools do `.workspace`:

```css
min-width: 0;
```

4. Jeżeli scrollbar dokumentu znika albo drastycznie się skraca, diagnoza jest potwierdzona.

5. Następnie sprawdzić `.card` z tabelą: lokalny poziomy pasek powinien pozostać tam, gdzie tabela jest szersza od karty.

Można też użyć pomocniczego skryptu wykrywającego elementy szersze niż viewport:

```js
[...document.querySelectorAll("body *")]
  .filter((el) => el.scrollWidth > document.documentElement.clientWidth)
  .map((el) => ({
    tag: el.tagName,
    id: el.id,
    class: el.className,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
```

Przed poprawką na liście powinny pojawić się elementy związane z `.layout`, `.workspace`, `.card` albo `.data-table`. Po poprawce szerokie powinny pozostać głównie same tabele/karty, a nie cały dokument.

---

## Ostateczna rekomendacja

Najlepsza poprawka to nie zmniejszanie tabel, tylko poprawienie zasad kurczenia się kontenerów nadrzędnych:

```css
.layout {
  grid-template-columns: 360px minmax(0, 1fr);
  width: 100%;
  max-width: 100%;
}

.workspace {
  min-width: 0;
}

.card {
  min-width: 0;
  max-width: 100%;
}
```

To powinno usunąć długi poziomy scrollbar całej strony i zachować zamierzone lokalne przewijanie szerokich tabel w kartach.


## Zmiany wykonane w kodzie

### Plik: `GeneratorNPC/style.css`

Lokalizacja: selektor `.layout`

Było:

```css
grid-template-columns: 360px 1fr;
```

Jest:

```css
grid-template-columns: 360px minmax(0, 1fr);
width: 100%;
max-width: 100%;
```

### Plik: `GeneratorNPC/style.css`

Lokalizacja: selektor `.workspace`

Było: obszar roboczy nie miał jawnego ograniczenia minimalnej szerokości jako element siatki.

Jest:

```css
min-width: 0;
```

### Plik: `GeneratorNPC/style.css`

Lokalizacja: selektor `.card`

Było: karta miała lokalne `overflow-x: auto`, ale nie miała jawnego `min-width: 0` ani `max-width: 100%`.

Jest:

```css
min-width: 0;
max-width: 100%;
overflow-x: auto;
```

### Plik: `GeneratorNPC/style.css`

Lokalizacja: selektory `.topbar` i `.actions`

Było: górny pasek i kontener akcji nie miały zawijania elementów.

Jest:

```css
.topbar {
  flex-wrap: wrap;
  gap: 12px 18px;
}

.actions {
  flex-wrap: wrap;
}
```

## Aktualizacja 2026-06-15 — Firefox i `table-layout: fixed` w Bestiariuszu

### Oryginalny pełny prompt użytkownika

```text
Pracujesz w repozytorium CuteLittleGoat/WrathAndGlory.

Problem: w Firefoxie moduł GeneratorNPC nadal pokazuje bardzo długi lokalny poziomy scrollbar w karcie „Podgląd bazowy / Bestiariusz”. Analiza DevTools wykazała, że globalny overflow dokumentu wynosi 0, więc wcześniejsza poprawka layoutu działa. Źródłem absurdalnej szerokości jest reguła CSS:

.data-table[data-sheet="Bestiariusz"] {
  table-layout: fixed;
}

W Firefoxie ta reguła powoduje wyliczenie tabeli Bestiariusza na kilkanaście milionów pikseli szerokości. Po tymczasowym wyłączeniu `table-layout: fixed` w DevTools tabela wraca do normalnej szerokości około 2130 px, a `computedTableLayout` wynosi `auto`. `min-width: max-content` może pozostać, bo przy `table-layout: auto` nie powoduje problemu.

Zadanie:
1. W pliku GeneratorNPC/style.css usuń albo bezpiecznie nadpisz regułę `table-layout: fixed` dla `.data-table[data-sheet="Bestiariusz"]`.
2. Preferowane rozwiązanie: ustaw dla tabeli Bestiariusza `table-layout: auto` albo usuń cały blok, jeśli domyślne zachowanie wystarczy.
3. Nie usuwaj globalnego `.data-table { min-width: max-content; }`, chyba że po testach okaże się konieczne.
4. Zachowaj lokalne przewijanie tabel wewnątrz `.card`.
5. Nie stosuj `body { overflow-x: hidden; }`.
6. Sprawdź po zmianie:
   - pusty Podgląd bazowy Bestiariusza,
   - Podgląd bazowy po wybraniu realnego rekordu,
   - moduły Broń, Pancerz, Psionika, Modlitwy,
   - brak globalnego poziomego overflow dokumentu,
   - lokalny overflow tabel pozostaje rozsądny.
7. Zaktualizuj dokumentację, jeśli obecnie opisuje Bestiariusz jako `table-layout: fixed` albo sugeruje, że ta reguła nadal obowiązuje:
   - GeneratorNPC/docs/Documentation.md
   - DetaleLayout.md
   - GeneratorNPC/docs/README.md tylko jeśli opis użytkowy wymaga korekty.

Po realizacji zadania dopisz ten prompt do Analizy/Szerokosc.md oraz co zostało wykonane.
```

### Zakres wykonanej zmiany

Problem dotyczył wyłącznie lokalnego poziomego przewijania tabeli podglądu bazowego Bestiariusza w module GeneratorNPC. Wcześniejsza poprawka globalnego układu pozostała bez zmian: `.layout`, `.workspace` i `.card` nadal ograniczają szerokość dokumentu, a tabele nadal przewijają się lokalnie wewnątrz kart.

### Zmiany wykonane w kodzie

#### Plik: `GeneratorNPC/style.css`

Lokalizacja: selektor `.data-table[data-sheet="Bestiariusz"]`

Było:

```css
.data-table[data-sheet="Bestiariusz"] {
  table-layout: fixed;
}
```

Jest:

```css
/* Bestiariusz używa automatycznego układu tabeli, bo Firefox potrafi błędnie rozdmuchać szerokość przy fixed + max-content.
   The Bestiary uses automatic table layout because Firefox can over-expand fixed tables combined with max-content. */
.data-table[data-sheet="Bestiariusz"] {
  table-layout: auto;
}
```

Efekt: Bestiariusz zachowuje globalne `.data-table { min-width: max-content; }`, ale Firefox nie używa już problematycznego `table-layout: fixed`, które powodowało absurdalnie szeroki lokalny scrollbar.

#### Plik: `GeneratorNPC/docs/Documentation.md`

Lokalizacja: sekcja `13.3. Geometria tabeli podglądu bazowego` oraz opis lokalnego przewijania tabel w sekcji integracji/layoutu.

Było: dokumentacja opisywała Bestiariusz jako tabelę z `table-layout: fixed` i drugą kolumną przejmującą pozostałą szerokość.

Jest: dokumentacja opisuje Bestiariusz jako tabelę z `table-layout: auto`, zachowaną szerokością pierwszej kolumny `25ch`, elastyczną drugą kolumną oraz lokalnym przewijaniem w karcie.

#### Plik: `DetaleLayout.md`

Lokalizacja: sekcja `Stała szerokość kolumny „Klucz” (GeneratorNPC)`.

Było: dokumentacja layoutu informowała, że tabela `data-sheet="Bestiariusz"` ma `table-layout: fixed`.

Jest: dokumentacja layoutu informuje, że tabela `data-sheet="Bestiariusz"` ma `table-layout: auto`, a pierwsza kolumna zachowuje stabilną szerokość `25ch`.

### Wyniki sprawdzenia

- Globalna reguła `.data-table { min-width: max-content; }` pozostała bez zmian.
- Lokalny `overflow-x: auto` na `.card` pozostał bez zmian.
- Nie dodano ani nie użyto `body { overflow-x: hidden; }`.
- W statycznej weryfikacji CSS nie ma już reguły ustawiającej `table-layout: fixed` dla `.data-table[data-sheet="Bestiariusz"]`.
- Dokumentacja techniczna i layoutowa nie opisuje już aktualnego Bestiariusza jako tabeli z `table-layout: fixed`.

### Ryzyka i następne kroki

- Weryfikacja w prawdziwym Firefoxie powinna potwierdzić wartość `computedTableLayout: auto`, rozsądną szerokość tabeli i brak globalnego overflow dokumentu.
- Jeżeli w przyszłości tabela Bestiariusza otrzyma kolejne bardzo szerokie kolumny, należy najpierw sprawdzać lokalny overflow karty i naturalną szerokość tabeli, a nie przywracać `table-layout: fixed`.

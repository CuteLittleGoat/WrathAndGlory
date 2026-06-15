# Analiza i propozycja rozbudowy — ukrywanie i oznaczanie rekordów `old` na liście Bestiariusza w GeneratorNPC

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`
**Moduł:** `GeneratorNPC`
**Główne pliki:** `GeneratorNPC/index.html`, `GeneratorNPC/style.css`
**Zakres:** rozbudowa listy rozwijanej `Bestiariusz · Nazwa`, aby rekordy z wartością `old` w kolumnie `Stan` były domyślnie ukryte, a po włączeniu checkboxa były widoczne i oznaczone kolorem `old`.
**Status:** analiza i rekomendacja wdrożeniowa.

---

## 1. Cel zadania

Celem zadania jest rozbudowa modułu `GeneratorNPC`, aby rekordy bestiariusza oznaczone w danych jako stare / zdezaktualizowane nie były domyślnie widoczne na liście wyboru bazowego.

Rekord jest traktowany jako zdezaktualizowany, jeśli w arkuszu `Bestiariusz` ma wartość:

```text id="2k5w2s"
Stan = old
```

Obecnie użytkownik widzi oznaczenie starego rekordu dopiero po jego wybraniu, w sekcji:

```text id="x8zmng"
Podgląd bazowy
```

Dla takiego rekordu komórki `LP`, `Typ` i `Nazwa` są wyświetlane przygaszonym kolorem. To zachowanie jest prawidłowe i powinno zostać zachowane.

Nowa funkcjonalność ma rozszerzyć ten mechanizm:

1. rekordy `old` mają być domyślnie ukryte na liście `Bestiariusz · Nazwa`;
2. użytkownik ma mieć checkbox pozwalający pokazać zdezaktualizowane wpisy;
3. po pokazaniu zdezaktualizowanych wpisów rekordy `old` mają być oznaczone innym kolorem;
4. po wybraniu rekordu `old` zamknięte pole select również powinno mieć kolor `old`.

---

## 2. Oczekiwany efekt użytkowy

W panelu `Wybór bazowy`, w okolicy pola:

```text id="y8yfr8"
Bestiariusz · Nazwa
```

należy dodać checkbox:

```text id="m6y2rr"
Czy wyświetlić zdezaktualizowane wpisy?
```

Wersja angielska:

```text id="ldw1xd"
Show outdated entries?
```

Domyślny stan checkboxa:

```text id="a93os1"
odznaczony
```

---

## 3. Oczekiwane zachowanie

### 3.1. Checkbox odznaczony

Gdy checkbox jest odznaczony:

* lista `Bestiariusz · Nazwa` pokazuje tylko aktualne rekordy;
* rekordy z `Stan = old` nie pojawiają się na liście;
* użytkownik nie może przypadkowo wybrać zdezaktualizowanego rekordu;
* Podgląd bazowy działa jak dotychczas dla rekordów aktualnych.

Przykład:

```text id="dc7kfj"
Checkbox odznaczony:

Chopak
Burszuj
Megaburszuj
Konował
```

Jeżeli `Komandoz` ma `Stan = old`, nie pojawia się na liście.

---

### 3.2. Checkbox zaznaczony

Gdy checkbox jest zaznaczony:

* lista `Bestiariusz · Nazwa` pokazuje wszystkie rekordy;
* rekordy aktualne mają zwykły kolor;
* rekordy z `Stan = old` mają kolor `var(--text-old)`;
* po wybraniu rekordu `old` zamknięte pole select również ma kolor `var(--text-old)`;
* Podgląd bazowy nadal pokazuje `LP`, `Typ` i `Nazwa` rekordu `old` w kolorze `old`.

Przykład:

```text id="pcbc4r"
Checkbox zaznaczony:

Chopak            zwykły zielony
Komandoz          przygaszony kolor old
Burszuj           zwykły zielony
Megaburszuj       zwykły zielony
Konował           zwykły zielony
```

---

### 3.3. Odznaczenie checkboxa przy wybranym rekordzie `old`

Jeżeli użytkownik:

1. zaznaczy checkbox;
2. wybierze rekord z `Stan = old`;
3. następnie odznaczy checkbox;

to aplikacja powinna:

* ukryć rekordy `old`;
* wyczyścić aktualny wybór bestiariusza;
* usunąć klasę `bestiary-select-old` z pola select;
* przywrócić Podgląd bazowy do stanu braku wyboru;
* przywrócić pancerze do bezpiecznego stanu zgodnego z obecną logiką.

Nie należy zostawiać wybranego rekordu, który nie istnieje na aktualnie widocznej liście.

---

## 4. Obecny stan techniczny

### 4.1. Lista wyboru bazowego

W panelu bocznym `Wybór bazowy` znajduje się pole:

```text id="bpfq7e"
Bestiariusz · Nazwa
```

Technicznie jest to natywny element HTML:

```html id="l6i2sb"
<select id="bestiary">
```

Lista jest uzupełniana dynamicznie po wczytaniu danych z prywatnego DataVault.

---

### 4.2. Źródło danych

GeneratorNPC pobiera dane z prywatnego DataVault przez Firebase.

Dane bestiariusza są wczytywane z arkusza:

```text id="rso6ly"
Bestiariusz
```

i trafiają do:

```js id="b9cemh"
state.bestiary
```

Moduł używa dokładnych nazw arkuszy DataVault. Ta zasada powinna zostać zachowana.

Nie należy przy tej zmianie przebudowywać źródła danych, struktury DataVault ani logiki importu danych.

---

### 4.3. Rozpoznawanie rekordów `old`

W kodzie istnieje już helper rozpoznający stare rekordy bestiariusza:

```js id="xkpizw"
const isOldBestiaryRecord = (record) =>
  normalizeText(getRecordValueByLabels(record, ["Stan", "stan"])).toLowerCase() === "old";
```

Należy wykorzystać istniejącą funkcję.

Nie należy dodawać drugiego, równoległego mechanizmu sprawdzania kolumny `Stan`.

---

### 4.4. Obecne oznaczenie w Podglądzie bazowym

Dla rekordu `old` obecna logika dodaje klasę:

```css id="c82hxs"
.bestiary-old-key
```

do wybranych pól:

```text id="msu3qz"
LP
Typ
Nazwa
```

Klasa korzysta z istniejącej zmiennej CSS:

```css id="m62v4q"
--text-old
```

oraz reguły:

```css id="eq60tp"
.bestiary-old-key {
  color: var(--text-old);
}
```

To zachowanie powinno pozostać bez zmian.

---

## 5. Najważniejsza zasada implementacyjna

Nie wolno filtrować ani modyfikować samego `state.bestiary`.

Obecnie wartości `option.value` odpowiadają indeksom rekordów w `state.bestiary`.

Te indeksy są używane m.in. przez:

* wybór rekordu;
* Podgląd bazowy;
* generowanie karty;
* ulubione;
* odtwarzanie zapisanych konfiguracji.

Dlatego nie należy robić tego:

```js id="wpdev9"
state.bestiary = state.bestiary.filter((record) => !isOldBestiaryRecord(record));
```

Filtrować należy wyłącznie listę opcji wyświetlanych w `<select>`.

Poprawny kierunek:

```js id="r27qmn"
const visibleBestiaryOptions = state.bestiary
  .map((record, index) => ({ record, index }))
  .filter(({ record }) => state.showOldBestiaryRecords || !isOldBestiaryRecord(record));
```

Następnie każda opcja powinna dostać oryginalny indeks:

```js id="bpm5o1"
option.value = String(index);
option.textContent = getRecordName(record, index);
```

Dzięki temu rekordy `old` mogą być ukryte wizualnie, ale `state.bestiary` nadal pozostaje kompletne i stabilne.

---

## 6. Wniosek z analizy

Rozbudowa jest możliwa bez dużej przebudowy.

Wymaga zmian głównie w:

```text id="gngjqi"
GeneratorNPC/index.html
GeneratorNPC/style.css
```

Nie jest potrzebna zmiana:

* struktury danych;
* Firebase;
* DataVault;
* importera XLSX;
* plików JSON;
* sposobu sortowania bestiariusza;
* logiki generowania karty NPC;
* obecnego działania sekcji `Podgląd bazowy`.

---

## 7. Ważne ograniczenie techniczne

Lista `Bestiariusz · Nazwa` jest natywnym elementem HTML `<select>`.

Stylowanie elementów `<option>` jest możliwe, ale ma ograniczenia zależne od przeglądarki i systemu operacyjnego.

Oznacza to, że:

* kolor tekstu opcji powinien działać w większości typowych sytuacji;
* przeglądarka może nadpisywać kolory podczas hover, focus lub podświetlenia aktywnej opcji;
* wygląd listy może nie być identyczny w każdej przeglądarce;
* nie należy oczekiwać pełnej kontroli wizualnej takiej jak przy własnym komponencie dropdown.

To ograniczenie nie blokuje zadania, ponieważ głównym celem jest filtrowanie rekordów `old`, a kolorowanie jest dodatkowym oznaczeniem, gdy użytkownik świadomie włączy ich widoczność.

---

## 8. Rekomendowany wariant wdrożenia

Rekomendowany jest wariant lekki:

```text id="j1l1mm"
natywny select
+ checkbox pokazujący / ukrywający rekordy old
+ filtrowanie opcji bez modyfikowania state.bestiary
+ klasa CSS na option dla rekordów old
+ klasa CSS na select dla aktualnie wybranego rekordu old
```

Ten wariant jest wystarczający dla obecnego celu i nie wymaga przebudowy UI.

---

## 9. Proponowana implementacja

### 9.1. Dodanie checkboxa w HTML

W sekcji `Wybór bazowy`, przy polu `Bestiariusz · Nazwa`, należy dodać checkbox.

Proponowany HTML:

```html id="tliqjj"
<label class="checkbox checkbox-inline bestiary-old-toggle">
  <input type="checkbox" id="bestiary-show-old" />
  <span data-i18n="bestiaryShowOldToggle">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

Rekomendowane miejsce:

* bezpośrednio pod selectem `#bestiary`;
* przed polem `Uwagi do rekordu`.

Przykładowy układ:

```html id="dc6squ"
<div class="field">
  <label for="bestiary" data-i18n="bestiaryLabel">Bestiariusz · Nazwa</label>
  <select id="bestiary">
    <option value="" disabled selected data-i18n="dataStatusLoading">Ładowanie danych...</option>
  </select>

  <label class="checkbox checkbox-inline bestiary-old-toggle">
    <input type="checkbox" id="bestiary-show-old" />
    <span data-i18n="bestiaryShowOldToggle">Czy wyświetlić zdezaktualizowane wpisy?</span>
  </label>
</div>
```

---

### 9.2. Dodanie tłumaczeń

Do tłumaczeń PL należy dodać:

```js id="hc3hlg"
bestiaryShowOldToggle: "Czy wyświetlić zdezaktualizowane wpisy?"
```

Do tłumaczeń EN należy dodać:

```js id="adffx2"
bestiaryShowOldToggle: "Show outdated entries?"
```

Tłumaczenie EN jest krótkie i pasuje do funkcji checkboxa.

---

### 9.3. Dodanie referencji DOM

W części kodu, gdzie pobierane są elementy DOM, należy dodać:

```js id="t9nzra"
const bestiaryShowOldToggle = document.querySelector("#bestiary-show-old");
```

---

### 9.4. Dodanie stanu UI

Do obiektu `state` należy dodać:

```js id="knw6mj"
showOldBestiaryRecords: false,
```

Domyślnie checkbox ma być odznaczony.

Nie jest wymagane zapisywanie tego ustawienia w `localStorage` ani `sessionStorage`, chyba że zostanie podjęta osobna decyzja projektowa.

---

### 9.5. Przygotowanie widocznych opcji bestiariusza

Należy dodać helper, który przygotuje listę rekordów widocznych w select, zachowując oryginalne indeksy ze `state.bestiary`.

Proponowany helper:

```js id="j511hd"
const getVisibleBestiaryOptions = () =>
  state.bestiary
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => state.showOldBestiaryRecords || !isOldBestiaryRecord(record));
```

---

### 9.6. Rozszerzenie `setSelectOptions`

Obecna funkcja `setSelectOptions` tworzy opcje dla list wyboru.

Aby nie modyfikować `state.bestiary`, funkcja powinna umieć obsłużyć wpisy, których wartość opcji nie jest równa pozycji na przefiltrowanej liście, tylko oryginalnemu indeksowi rekordu.

Rekomendowany model: dodać opcjonalne callbacki:

```text id="akpj8w"
getOptionValue
getOptionLabel
getOptionClass
getOptionRecord
```

Minimalny wariant może wyglądać tak:

```js id="l208q7"
const setSelectOptions = (
  select,
  items,
  placeholder,
  {
    disableOption,
    disabledTitle,
    getOptionValue = (_item, index) => String(index),
    getOptionLabel = (item, index) => getRecordName(item, index),
    getOptionClass,
    getOptionRecord = (item) => item,
  } = {}
) => {
  select.innerHTML = "";

  if (!items.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = translations[currentLanguage].messages.noDataOption;
    option.disabled = true;
    option.selected = true;
    select.append(option);
    select.disabled = true;
    return;
  }

  if (!select.multiple) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    option.disabled = true;
    option.selected = true;
    select.append(option);
  } else if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    option.disabled = true;
    select.append(option);
  }

  items.forEach((item, index) => {
    const record = getOptionRecord(item, index);
    const option = document.createElement("option");

    option.value = String(getOptionValue(item, index));
    option.textContent = getOptionLabel(item, index);

    const className = getOptionClass?.(record, item, index);
    if (className) {
      option.classList.add(className);
    }

    if (disableOption?.(record, index)) {
      option.disabled = true;
      option.title = disabledTitle || "";
    }

    select.append(option);
  });

  select.disabled = false;
};
```

Ta wersja jest wstecznie zgodna z dotychczasowymi listami, bo domyślne callbacki zachowują obecny model działania.

---

### 9.7. Renderowanie listy bestiariusza

Należy dodać osobną funkcję do renderowania listy bestiariusza.

Proponowana funkcja:

```js id="ienmgk"
const renderBestiarySelectOptions = () => {
  const visibleOptions = getVisibleBestiaryOptions();

  setSelectOptions(bestiarySelect, visibleOptions, translations[currentLanguage].messages.selectBestiary, {
    getOptionRecord: (item) => item.record,
    getOptionValue: (item) => item.index,
    getOptionLabel: (item) => getRecordName(item.record, item.index),
    getOptionClass: (record) => isOldBestiaryRecord(record) ? "bestiary-option-old" : "",
  });
};
```

W funkcji `loadPrivateGeneratorData` zamiast bezpośredniego wywołania:

```js id="wguj3r"
setSelectOptions(bestiarySelect, state.bestiary, translations[currentLanguage].messages.selectBestiary);
```

należy użyć:

```js id="scravc"
renderBestiarySelectOptions();
```

---

### 9.8. Obsługa zmiany checkboxa

Do listenerów należy dodać obsługę checkboxa:

```js id="l412i0"
bestiaryShowOldToggle?.addEventListener("change", () => {
  state.showOldBestiaryRecords = Boolean(bestiaryShowOldToggle.checked);

  const currentIndex = Number(bestiarySelect.value);
  const currentRecord = Number.isNaN(currentIndex) ? null : state.bestiary[currentIndex];
  const shouldClearSelection = currentRecord && isOldBestiaryRecord(currentRecord) && !state.showOldBestiaryRecords;

  renderBestiarySelectOptions();

  if (shouldClearSelection) {
    bestiarySelect.value = "";
    bestiarySelect.classList.remove("bestiary-select-old");
    state.selectedBestiaryIndex = null;
    resetBestiaryOverrides();
    renderBestiaryTable(null);
    setArmorSelectionEnabled(true);
    return;
  }

  if (!Number.isNaN(currentIndex) && state.bestiary[currentIndex]) {
    bestiarySelect.value = String(currentIndex);
  }

  updateBestiarySelection();
});
```

Cel tej logiki:

* po zaznaczeniu checkboxa lista pokazuje też `old`;
* po odznaczeniu checkboxa lista ukrywa `old`;
* jeśli aktualnie wybrany rekord był `old`, wybór jest czyszczony;
* jeśli aktualnie wybrany rekord był zwykły, wybór zostaje zachowany.

---

### 9.9. Klasa na samym polu `#bestiary`

Samo dodanie klasy do `<option>` koloruje rekordy na rozwiniętej liście.

Może jednak nie wystarczyć do pokolorowania zamkniętego pola select po wybraniu rekordu `old`.

Dlatego należy dodać klasę również do samego elementu:

```html id="rjuzis"
<select id="bestiary" class="bestiary-select-old">
```

Klasa ma być dodawana tylko wtedy, gdy aktualnie wybrany rekord ma:

```text id="sxdbx8"
Stan = old
```

Najlepszym miejscem na tę logikę jest funkcja `updateBestiarySelection`.

Proponowana zmiana:

```js id="g9m62l"
const updateBestiarySelection = () => {
  const index = Number(bestiarySelect.value);

  if (Number.isNaN(index)) {
    state.selectedBestiaryIndex = null;
    bestiarySelect.classList.remove("bestiary-select-old");
    resetBestiaryOverrides();
    renderBestiaryTable(null);
    setArmorSelectionEnabled(true);
    return;
  }

  if (state.selectedBestiaryIndex !== index) {
    state.selectedBestiaryIndex = index;
    resetBestiaryOverrides();
  }

  const record = state.bestiary[index];
  bestiarySelect.classList.toggle("bestiary-select-old", Boolean(record && isOldBestiaryRecord(record)));

  renderBestiaryTable(record);
  setArmorSelectionEnabled(!isBestiaryArmorBlocked(record));
};
```

---

### 9.10. Obsługa ulubionych

Jeżeli użytkownik wczytuje ulubiony profil oparty na rekordzie `old`, a checkbox jest odznaczony, aplikacja powinna:

1. automatycznie zaznaczyć checkbox `Czy wyświetlić zdezaktualizowane wpisy?`;
2. ustawić `state.showOldBestiaryRecords = true`;
3. przebudować listę bestiariusza;
4. dopiero potem wybrać rekord z ulubionego profilu.

Rekomendowana logika w `applyFavorite`:

```js id="fi3t2n"
const record = state.bestiary[index];

if (record && isOldBestiaryRecord(record) && !state.showOldBestiaryRecords) {
  state.showOldBestiaryRecords = true;
  if (bestiaryShowOldToggle) {
    bestiaryShowOldToggle.checked = true;
  }
  renderBestiarySelectOptions();
}

bestiarySelect.value = String(index);
updateBestiarySelection();
```

Dzięki temu ulubione profile oparte na starych rekordach nadal działają poprawnie, nawet jeśli domyślnie stare rekordy są ukryte.

---

### 9.11. Reset

Przycisk `Reset` powinien przywracać domyślny stan checkboxa.

Domyślny stan to:

```text id="cjolgy"
odznaczony
```

W logice resetu należy dodać:

```js id="zdjg4d"
state.showOldBestiaryRecords = false;

if (bestiaryShowOldToggle) {
  bestiaryShowOldToggle.checked = false;
}

bestiarySelect.classList.remove("bestiary-select-old");
renderBestiarySelectOptions();
```

Jeżeli przed resetem był wybrany rekord `old`, po resecie wybór powinien zostać wyczyszczony razem z pozostałym stanem formularza.

---

## 10. Dodanie stylów CSS

Do `GeneratorNPC/style.css` należy dodać klasy:

```css id="jiq8ni"
#bestiary option {
  color: var(--text);
}

#bestiary option.bestiary-option-old {
  color: var(--text-old);
}

#bestiary.bestiary-select-old {
  color: var(--text-old);
}
```

Rekomendowane miejsce: okolice istniejącej klasy:

```css id="vrpo7a"
.bestiary-old-key {
  color: var(--text-old);
}
```

Pełny blok z komentarzem może wyglądać tak:

```css id="kdr01p"
/* Rekordy zdezaktualizowane w natywnej liście wyboru Bestiariusza.
   Opcje old dostają przygaszony kolor, a sam select zmienia kolor,
   gdy aktualnie wybrany rekord ma Stan = old. */
#bestiary option {
  color: var(--text);
}

#bestiary option.bestiary-option-old {
  color: var(--text-old);
}

#bestiary.bestiary-select-old {
  color: var(--text-old);
}
```

Reguła:

```css id="p75slx"
#bestiary option {
  color: var(--text);
}
```

jest istotna, ponieważ po dodaniu koloru na samym `select` nie chcemy, aby wszystkie opcje dziedziczyły kolor `old`.

Kolor `old` mają mieć wyłącznie opcje z klasą:

```css id="xdid3d"
.bestiary-option-old
```

---

## 11. Proponowane nazewnictwo

### 11.1. Checkbox

Rekomendowany identyfikator DOM:

```text id="qiwo57"
bestiary-show-old
```

Rekomendowana stała / stan:

```text id="n1hpiw"
showOldBestiaryRecords
```

Rekomendowany klucz i18n:

```text id="anb5w5"
bestiaryShowOldToggle
```

Tekst PL:

```text id="knb1kc"
Czy wyświetlić zdezaktualizowane wpisy?
```

Tekst EN:

```text id="z3q1ad"
Show outdated entries?
```

---

### 11.2. Klasa CSS dla opcji archiwalnej

```text id="rnguxi"
bestiary-option-old
```

Uzasadnienie:

* nazwa jest specyficzna dla bestiariusza;
* nie koliduje z istniejącą klasą `bestiary-old-key`;
* jasno wskazuje, że dotyczy elementu listy wyboru, nie tabeli.

---

### 11.3. Klasa CSS dla selecta z wybranym rekordem archiwalnym

```text id="ynxdaf"
bestiary-select-old
```

Uzasadnienie:

* nazwa jest specyficzna dla pola wyboru bestiariusza;
* jasno wskazuje, że dotyczy całego selecta;
* pozwala osobno stylować zamknięte pole wyboru.

---

### 11.4. Callbacki funkcji `setSelectOptions`

Rekomendowane nazwy:

```text id="qkkjo0"
getOptionValue
getOptionLabel
getOptionClass
getOptionRecord
```

Uzasadnienie:

* są neutralne i mogą być użyte przez inne listy;
* nie wymuszają logiki specyficznej dla bestiariusza wewnątrz `setSelectOptions`;
* zachowują separację odpowiedzialności;
* pozwalają zachować oryginalne indeksy rekordów mimo filtrowania widoku.

---

## 12. Zakres zmian

### 12.1. `GeneratorNPC/index.html`

Wymagane zmiany:

1. Dodać checkbox `#bestiary-show-old` w sekcji `Wybór bazowy`.
2. Dodać teksty i18n:

   * PL: `Czy wyświetlić zdezaktualizowane wpisy?`
   * EN: `Show outdated entries?`
3. Dodać referencję DOM `bestiaryShowOldToggle`.
4. Dodać do `state` pole `showOldBestiaryRecords: false`.
5. Dodać helper `getVisibleBestiaryOptions`.
6. Rozszerzyć `setSelectOptions`, aby mogła przyjmować elementy z zachowanym oryginalnym indeksem.
7. Dodać funkcję `renderBestiarySelectOptions`.
8. W `loadPrivateGeneratorData` użyć `renderBestiarySelectOptions()` zamiast bezpośredniego `setSelectOptions` dla bestiariusza.
9. Dodać listener `change` dla checkboxa.
10. W `updateBestiarySelection` dodawać / usuwać klasę `bestiary-select-old`.
11. W `applyFavorite` obsłużyć ulubione profile oparte na rekordach `old`.
12. W logice resetu przywracać checkbox do stanu odznaczonego i przebudowywać listę bestiariusza.

---

### 12.2. `GeneratorNPC/style.css`

Wymagane zmiany:

1. Dodać regułę CSS dla zwykłych opcji bestiariusza:

```css id="ohbldd"
#bestiary option {
  color: var(--text);
}
```

2. Dodać regułę CSS dla opcji zdezaktualizowanych:

```css id="z2eqnu"
#bestiary option.bestiary-option-old {
  color: var(--text-old);
}
```

3. Dodać regułę CSS dla zamkniętego selecta, gdy wybrany rekord jest zdezaktualizowany:

```css id="t6wysg"
#bestiary.bestiary-select-old {
  color: var(--text-old);
}
```

4. Opcjonalnie dopracować odstęp checkboxa w panelu `Wybór bazowy`, jeśli domyślny układ `.checkbox.checkbox-inline` nie będzie wystarczająco czytelny.

---

### 12.3. Dokumentacja

Opcjonalnie warto uzupełnić:

```text id="zjslko"
GeneratorNPC/docs/Documentation.md
```

o krótką informację, że:

* rekordy `old` są domyślnie ukrywane na liście `Bestiariusz · Nazwa`;
* checkbox `Czy wyświetlić zdezaktualizowane wpisy?` pozwala pokazać rekordy `old`;
* rekordy `old` są oznaczane kolorem na liście;
* po wybraniu rekordu `old` zamknięte pole `Bestiariusz · Nazwa` również przyjmuje kolor `old`;
* oznaczenie listy jest zależne od możliwości stylowania natywnego `<select>` przez przeglądarkę.

---

## 13. Czego nie zmieniać

W ramach tej rozbudowy nie należy zmieniać:

* struktury arkusza `Bestiariusz`;
* wartości w kolumnie `Stan`;
* sposobu rozpoznawania `old`;
* sortowania rekordów bestiariusza;
* zawartości `state.bestiary`;
* logiki `Podglądu bazowego`;
* mechanizmu generowania karty NPC;
* źródła danych Firebase/DataVault;
* nazw arkuszy wymaganych przez GeneratorNPC;
* logiki modułów broni, pancerzy, ekwipunku, talentów, psioniki i modlitw.

---

## 14. Kryteria akceptacji

Zmiana jest poprawna, jeżeli spełnione są poniższe warunki.

### 14.1. Checkbox

* W panelu `Wybór bazowy` widoczny jest checkbox `Czy wyświetlić zdezaktualizowane wpisy?`.
* W wersji EN widoczny jest tekst `Show outdated entries?`.
* Checkbox jest domyślnie odznaczony.
* Checkbox steruje wyłącznie widocznością rekordów `old` na liście bestiariusza.

---

### 14.2. Lista Bestiariusza — checkbox odznaczony

* Rekordy z `Stan = old` nie są widoczne na liście `Bestiariusz · Nazwa`.
* Rekordy bez `Stan = old` są widoczne.
* Placeholder listy działa jak dotychczas.
* Kolejność widocznych rekordów nie zmienia się względem dotychczasowego sortowania.
* `state.bestiary` nadal zawiera wszystkie rekordy, także `old`.

---

### 14.3. Lista Bestiariusza — checkbox zaznaczony

* Rekordy z `Stan = old` są widoczne na liście.
* Rekordy z `Stan = old` mają kolor `var(--text-old)`.
* Rekordy bez `Stan = old` mają zwykły kolor.
* Wartości `option.value` nadal odpowiadają oryginalnym indeksom rekordów w `state.bestiary`.

---

### 14.4. Zamknięte pole wyboru

* Po wybraniu rekordu zwykłego zamknięte pole `Bestiariusz · Nazwa` ma standardowy zielony kolor tekstu.
* Po wybraniu rekordu `old` zamknięte pole `Bestiariusz · Nazwa` ma kolor `var(--text-old)`.
* Po zresetowaniu wyboru klasa `bestiary-select-old` zostaje usunięta.
* Po zmianie rekordu z `old` na zwykły klasa `bestiary-select-old` zostaje usunięta.
* Po zmianie rekordu ze zwykłego na `old` klasa `bestiary-select-old` zostaje dodana.

---

### 14.5. Odznaczenie checkboxa przy wybranym rekordzie `old`

* Jeżeli wybrany jest rekord `old`, a użytkownik odznaczy checkbox, wybór zostaje wyczyszczony.
* Podgląd bazowy wraca do stanu braku wyboru.
* Klasa `bestiary-select-old` zostaje usunięta.
* Rekord `old` znika z listy.

---

### 14.6. Podgląd bazowy

* Po wybraniu rekordu `old` pola `LP`, `Typ` i `Nazwa` nadal są szare / przygaszone.
* Kolumna `Stan` nadal nie jest wyświetlana w tabeli.
* Edytowalne pola liczbowe nadal działają jak wcześniej.
* Edycja `Umiejętności` i `Słowa Kluczowe` nadal działa jak wcześniej.

---

### 14.7. Pozostałe listy

* Lista pancerzy nadal blokuje rekordy z niedozwolonym WP zgodnie z obecną logiką.
* Listy broni, augumentacji, ekwipunku, talentów, psioniki i modlitw działają bez zmian.
* Wielokrotne listy wyboru nadal obsługują placeholdery i zaznaczenia jak wcześniej.

---

### 14.8. Ulubione

* Zapisanie ulubionego profilu nadal zapisuje `selectedBestiaryIndex`.
* Wczytanie ulubionego profilu nadal wybiera właściwy rekord.
* Jeżeli ulubiony profil wskazuje rekord `old`, aplikacja automatycznie zaznacza checkbox `Czy wyświetlić zdezaktualizowane wpisy?`.
* Po wczytaniu ulubionego profilu opartego na rekordzie `old`, rekord jest widoczny na liście.
* Po wczytaniu ulubionego profilu opartego na rekordzie `old`, zamknięty select ma kolor `old`.

---

### 14.9. Reset

* Przycisk `Reset` nadal czyści wybór bazowy i ustawienia modułów.
* Po resecie checkbox `Czy wyświetlić zdezaktualizowane wpisy?` jest odznaczony.
* Po resecie rekordy `old` są ukryte.
* Po resecie zamknięte pole `Bestiariusz · Nazwa` nie ma klasy `bestiary-select-old`.

---

## 15. Testy ręczne

Po wdrożeniu należy wykonać następujące testy.

### 15.1. Test domyślnego stanu

1. Otworzyć `GeneratorNPC`.
2. Poczekać na załadowanie prywatnych danych.
3. Sprawdzić, że checkbox `Czy wyświetlić zdezaktualizowane wpisy?` jest odznaczony.
4. Rozwinąć listę `Bestiariusz · Nazwa`.
5. Potwierdzić, że rekordy z `Stan = old` nie są widoczne.

---

### 15.2. Test pokazania rekordów `old`

1. Zaznaczyć checkbox `Czy wyświetlić zdezaktualizowane wpisy?`.
2. Rozwinąć listę `Bestiariusz · Nazwa`.
3. Potwierdzić, że rekordy z `Stan = old` są widoczne.
4. Potwierdzić, że rekordy `old` mają kolor `var(--text-old)`.
5. Potwierdzić, że rekordy zwykłe mają standardowy kolor.

---

### 15.3. Test zamkniętego pola z rekordem `old`

1. Zaznaczyć checkbox.
2. Wybrać rekord z `Stan = old`.
3. Zamknąć listę.
4. Potwierdzić, że wybrana nazwa w polu select jest przygaszona.
5. Potwierdzić, że `Podgląd bazowy` nadal pokazuje `LP`, `Typ` i `Nazwa` w kolorze `old`.

---

### 15.4. Test odznaczenia checkboxa przy rekordzie `old`

1. Zaznaczyć checkbox.
2. Wybrać rekord z `Stan = old`.
3. Odznaczyć checkbox.
4. Potwierdzić, że wybór został wyczyszczony.
5. Potwierdzić, że rekord `old` zniknął z listy.
6. Potwierdzić, że `Podgląd bazowy` wrócił do stanu braku wyboru.
7. Potwierdzić, że zamknięte pole select nie ma koloru `old`.

---

### 15.5. Test wyboru rekordu zwykłego

1. Przy odznaczonym checkboxie wybrać zwykły rekord.
2. Potwierdzić, że wybrana nazwa ma zwykły zielony kolor.
3. Potwierdzić, że Podgląd bazowy działa poprawnie.
4. Zaznaczyć checkbox.
5. Potwierdzić, że zwykły rekord pozostaje wybrany.
6. Odznaczyć checkbox.
7. Potwierdzić, że zwykły rekord nadal pozostaje wybrany.

---

### 15.6. Test regresji pancerzy

1. Rozwinąć listę pancerzy.
2. Sprawdzić, czy dotychczas blokowane opcje nadal są zablokowane.
3. Potwierdzić, że zmiany w `setSelectOptions` nie uszkodziły mechanizmu `disableOption`.

---

### 15.7. Test ulubionych z rekordem `old`

1. Zaznaczyć checkbox.
2. Wybrać rekord `old`.
3. Dodać konfigurację do ulubionych.
4. Odświeżyć stronę.
5. Upewnić się, że checkbox jest domyślnie odznaczony.
6. Wczytać ulubiony profil.
7. Potwierdzić, że checkbox został automatycznie zaznaczony.
8. Potwierdzić, że właściwy rekord został wybrany.
9. Potwierdzić, że rekord ma kolor `old` na liście.
10. Potwierdzić, że zamknięty select również ma kolor `old`.

---

### 15.8. Test resetu

1. Zaznaczyć checkbox.
2. Wybrać rekord `old`.
3. Kliknąć `Reset`.
4. Potwierdzić, że checkbox jest odznaczony.
5. Potwierdzić, że rekordy `old` są ukryte.
6. Potwierdzić, że select wraca do zwykłego koloru.
7. Potwierdzić, że Podgląd bazowy wraca do stanu braku wyboru.

---

### 15.9. Test przeglądarek

Ze względu na ograniczenia natywnego `<select>` warto sprawdzić przynajmniej:

* Firefox;
* Chrome;
* Edge.

Należy zwrócić uwagę, czy kolor jest widoczny:

* na zamkniętej liście po wybraniu rekordu;
* na rozwiniętej liście;
* podczas podświetlenia opcji.

Różnice w stanie hover/focus są akceptowalne, jeżeli normalny stan opcji nadal pozwala odróżnić rekord `old`.

---

## 16. Ryzyka

### 16.1. Ograniczenia natywnego `<select>`

Największym ryzykiem wizualnym jest niepełna kontrola wyglądu `<option>` przez CSS.

Niektóre przeglądarki lub systemy mogą częściowo ignorować kolor opcji w określonych stanach.

Ryzyko jest akceptowalne, ponieważ główna funkcja polega na ukrywaniu / pokazywaniu rekordów `old`, a kolor jest dodatkowym oznaczeniem.

---

### 16.2. Dziedziczenie koloru z selecta na opcje

Po dodaniu klasy:

```css id="p5ch72"
#bestiary.bestiary-select-old {
  color: var(--text-old);
}
```

istnieje ryzyko, że część przeglądarek spróbuje odziedziczyć ten kolor na opcjach listy.

Dlatego rekomendowane jest jawne ustawienie zwykłego koloru dla wszystkich opcji:

```css id="b0lsfl"
#bestiary option {
  color: var(--text);
}
```

a następnie nadpisanie go tylko dla opcji archiwalnych:

```css id="ootvze"
#bestiary option.bestiary-option-old {
  color: var(--text-old);
}
```

---

### 16.3. Stabilność indeksów

Najważniejsze ryzyko logiczne dotyczy indeksów rekordów.

Jeżeli implementacja przefiltruje `state.bestiary` lub użyje indeksów z przefiltrowanej listy jako `option.value`, może dojść do błędnego wyboru rekordów, błędnego Podglądu bazowego lub uszkodzenia ulubionych.

Dlatego należy zachować zasadę:

```text id="q2iwk8"
option.value = oryginalny indeks rekordu w state.bestiary
```

---

### 16.4. Ulubione

Ulubione profile zapisują indeks wybranego rekordu.

Jeżeli ulubiony profil wskazuje rekord `old`, a lista domyślnie ukrywa rekordy `old`, aplikacja musi automatycznie pokazać zdezaktualizowane wpisy przed ustawieniem wartości selecta.

Brak tej obsługi spowoduje, że ulubiony profil może nie odtworzyć się poprawnie.

---

### 16.5. Dostępność

Samo oznaczenie kolorem może być niewystarczające dla części użytkowników.

Jednak ponieważ rekordy `old` są domyślnie ukryte, a ich pokazanie wymaga świadomego zaznaczenia checkboxa, ryzyko przypadkowego wyboru jest znacząco mniejsze.

Jeżeli oznaczenie `old` ma mieć znaczenie krytyczne, w przyszłości można rozważyć dodatkowe oznaczenie tekstowe, np.:

```text id="p9uwiv"
Chopak [OLD]
```

Na tym etapie nie jest to rekomendowane jako domyślna zmiana, ponieważ zmieniłoby widoczne nazwy rekordów.

---

## 17. Możliwa przyszła rozbudowa

W przyszłości można rozważyć dodatkowe opcje:

1. Dopisek `[OLD]` przy nazwie rekordu.
2. Tooltip na opcji, np. `Rekord zdezaktualizowany`.
3. Osobną sekcję lub grupę `Zdezaktualizowane` na liście.
4. Własny komponent dropdown z wyszukiwaniem.
5. Zapisywanie stanu checkboxa w `sessionStorage`.
6. Osobny filtr `Pokaż tylko zdezaktualizowane wpisy`.

Te funkcje nie są częścią obecnego zakresu.

---

## 18. Rekomendacja końcowa

Rekomendowane jest wdrożenie lekkiego wariantu:

```text id="smbk1a"
checkbox Czy wyświetlić zdezaktualizowane wpisy?
+ domyślne ukrycie rekordów old
+ filtrowanie wyłącznie opcji selecta, bez modyfikowania state.bestiary
+ zachowanie oryginalnych indeksów rekordów jako option.value
+ automatyczne pokazanie old przy wczytywaniu ulubionego profilu opartego na rekordzie old
+ klasa bestiary-option-old na option
+ klasa bestiary-select-old na select, gdy wybrany rekord ma Stan = old
+ CSS oparty o istniejącą zmienną var(--text-old)
```

Uzasadnienie:

* wykorzystuje istniejącą funkcję `isOldBestiaryRecord`;
* wykorzystuje istniejącą zmienną `--text-old`;
* nie zmienia danych;
* nie zmienia obecnego Podglądu bazowego;
* nie wymaga przebudowy UI;
* zmniejsza ryzyko przypadkowego wyboru zdezaktualizowanego rekordu;
* obejmuje zarówno filtrowanie, jak i oznaczenie wizualne;
* zachowuje kompatybilność z ulubionymi;
* zachowuje możliwość przyszłej rozbudowy.

Wdrożenie powinno być traktowane jako umiarkowanie mała zmiana front-endowa w `GeneratorNPC`.

## Zmiany wykonane w kodzie

### Plik: `GeneratorNPC/index.html`

Lokalizacja: panel `Wybór bazowy`, stałe DOM, stan `state`, tłumaczenia, helpery listy Bestiariusza, obsługa wyboru, ulubione, reset i ładowanie danych.

Było:

```html
<select id="bestiary">
  <option value="" disabled selected data-i18n="dataStatusLoading">Ładowanie danych...</option>
</select>
```

Jest:

```html
<select id="bestiary">
  <option value="" disabled selected data-i18n="dataStatusLoading">Ładowanie danych...</option>
</select>
<label class="checkbox-line bestiary-show-old-toggle" for="bestiary-show-old">
  <input type="checkbox" id="bestiary-show-old" />
  <span data-i18n="bestiaryShowOldToggle">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

Było: lista `#bestiary` była wypełniana bezpośrednio przez `setSelectOptions(bestiarySelect, state.bestiary, ...)`, więc każdy rekord z `state.bestiary` był widoczny na liście.

Jest: `refreshBestiaryOptions()` przebudowuje tylko widoczne opcje `#bestiary`, domyślnie pomija rekordy rozpoznane przez `isOldBestiaryRecord(record)`, zachowuje `state.bestiary` bez zmian i ustawia `option.value` na oryginalny indeks rekordu. Opcje `old` otrzymują klasę `bestiary-option-old` tylko wtedy, gdy checkbox jest zaznaczony i rekordy są widoczne.

Było: wybrany rekord `old` był oznaczany w `Podglądzie bazowym`, ale zamknięty select nie otrzymywał osobnej klasy koloru.

Jest: `updateBestiarySelectOldClass(record)` dodaje klasę `bestiary-select-old` do `#bestiary`, gdy wybrany rekord jest `old`, i usuwa ją po wyczyszczeniu wyboru albo wyborze rekordu aktualnego.

Było: odznaczenie widoczności rekordów `old` nie występowało, ponieważ nie było checkboxa.

Jest: `updateBestiaryOldVisibility()` po odznaczeniu checkboxa ukrywa rekordy `old`; jeśli wybrany był rekord `old`, czyści wybór Bestiariusza, resetuje nadpisania, usuwa klasę `bestiary-select-old`, przywraca pusty `Podgląd bazowy` i pozostawia pancerze w bezpiecznym, odblokowanym stanie.

Było: ulubione ustawiały `bestiarySelect.value` bez konieczności przebudowania listy z ukrytymi rekordami `old`.

Jest: `applyFavorite(favorite)` sprawdza `selectedBestiaryIndex`; jeśli ulubione wskazuje rekord `old`, a checkbox jest odznaczony, automatycznie zaznacza checkbox, przebudowuje listę i dopiero potem wybiera rekord z oryginalnym indeksem `state.bestiary`.

Było: reset czyścił select Bestiariusza, ale nie obsługiwał widoczności rekordów `old` ani klasy zamkniętego selecta.

Jest: reset odznacza `#bestiary-show-old`, ustawia `state.showOldBestiaryRecords = false`, przebudowuje listę bez rekordów `old`, czyści wybór i usuwa klasę `bestiary-select-old`.

### Plik: `GeneratorNPC/style.css`

Lokalizacja: style pól formularza oraz checkboxów.

Było:

```css
select,
input[type="text"],
textarea {
  color: var(--text);
}
```

Jest:

```css
#bestiary option {
  color: var(--text);
}

#bestiary option.bestiary-option-old,
#bestiary.bestiary-select-old {
  color: var(--text-old);
}
```

Było: brak dedykowanego stylu dla checkboxa pokazującego zdezaktualizowane wpisy.

Jest: `.checkbox-line` i `.bestiary-show-old-toggle` ustawiają czytelny układ checkboxa pod selectem Bestiariusza.

### Plik: `GeneratorNPC/docs/README.md`

Lokalizacja: sekcje PL i EN opisujące tworzenie NPC krok po kroku.

Było: instrukcja mówiła tylko o wyborze wpisu z listy Bestiariusza.

Jest: instrukcja wyjaśnia, że zdezaktualizowane wpisy są domyślnie ukryte, jak działa checkbox pokazujący te wpisy, co oznacza ich przygaszony kolor oraz co dzieje się po odznaczeniu checkboxa przy wybranym wpisie `old`.

### Plik: `GeneratorNPC/docs/Documentation.md`

Lokalizacja: opis panelu bocznego, helperów JavaScript, obsługi wyborów oraz mechaniki pola `Stan`.

Było: dokumentacja opisywała tylko dotychczasowe oznaczanie pól `LP`, `Nazwa` i `Typ` w `Podglądzie bazowym` dla rekordów `old`.

Jest: dokumentacja opisuje `#bestiary-show-old`, `state.showOldBestiaryRecords`, `refreshBestiaryOptions()`, `updateBestiarySelectOldClass(record)`, `updateBestiaryOldVisibility()`, zachowanie resetu i zachowanie ulubionych opartych na oryginalnym `selectedBestiaryIndex`.

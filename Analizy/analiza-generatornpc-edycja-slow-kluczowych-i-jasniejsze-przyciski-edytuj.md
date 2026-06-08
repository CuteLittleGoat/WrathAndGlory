# Analiza modyfikacji modułu GeneratorNPC: edycja „Słów Kluczowych” i jaśniejsze przyciski „Edytuj”

## Data analizy

2026-06-01

## Temat analizy

Analiza zakresu zmian potrzebnych do dodania w module `GeneratorNPC` przycisku **Edytuj** dla pola „Słowa Kluczowe”, zachowania czerwonego formatowania słów kluczowych w podglądzie bazowym, zachowania czarno-białego wyglądu wygenerowanej karty oraz rozjaśnienia fontu przycisków **Edytuj** do koloru używanego przez wyjątek `.ref` dla odnośników stron w module `DataVault`.

## Oryginalny pełny prompt użytkownika

> Przeprowadź analizę modyfikacji modułu GeneratorNPC. Obecnie przy "Umiejętności" jest przycisk "Edytuj" pozwalający na wprowadzanie zmian. Chciałbym taki sam przycisk dla "Słowa Kluczowe". W polu "Słowa Kluczowe" w dalszym ciągu wszystko, poza przecinkami, będzie czerwonym fontem. W wygenerowanej karcie już czarno-białe.
> Dodatkowo oba przyciski "Edytuj" zrób jaśniejszym fontem. Takim jak wyjątek na "str." w module DataVault. W pliku DetaleLayout.md masz szczegóły.
>
> Do promptu dołączono dwa obrazy referencyjne:
> 1. zrzut podglądu bazowego z wierszem „Słowa Kluczowe”, w którym wartości są czerwone, a przecinki pozostają zielone;
> 2. zrzut podglądu bazowego z wierszem „Umiejętności” oraz istniejącym przyciskiem „EDYTUJ”.

## Zakres analizy

Analiza obejmuje aktualne pliki:

- `GeneratorNPC/index.html` — stan aplikacji, formatowanie komórek tabel, renderowanie bestiariusza, mechanizm edycji „Umiejętności”, serializacja ulubionych oraz generowanie czarno-białej karty;
- `GeneratorNPC/style.css` — kolory, klasy formatowania słów kluczowych, wygląd pól edycji i przycisków;
- `GeneratorNPC/docs/README.md` — aktualna instrukcja użytkownika;
- `GeneratorNPC/docs/Documentation.md` — aktualna dokumentacja techniczna;
- `DataVault/style.css` — źródłowa definicja jaśniejszego koloru wyjątku `.ref`;
- `DetaleLayout.md` — opis wspólnego tokenu `--code`, wyjątku `.ref` i aktualnych zasad wyglądu modułu `GeneratorNPC`.

Nie wykonywano zmian w kodzie modułu. Niniejszy plik jest analizą planowanej modyfikacji.

## Stan obecny

### 1. Istniejąca edycja „Umiejętności”

W `GeneratorNPC/index.html` edycja „Umiejętności” jest zaimplementowana jako specjalny przypadek:

1. `state.bestiaryOverrides` przechowuje:
   - `numeric` — mapę nadpisań pól liczbowych;
   - `skills` — ręcznie zmieniony tekst „Umiejętności” albo `null`;
   - `skillsEditing` — informację, czy wiersz jest aktualnie w trybie edycji.
2. `EDITABLE_SKILLS_KEY` rozpoznaje znormalizowaną nazwę pola „Umiejętności”.
3. `createSkillsRow(record, key, valueString)` tworzy osobny wiersz tabeli:
   - etykietę pola;
   - przycisk **Edytuj** lub **Zapisz**;
   - zwykły podgląd wartości albo `textarea` zależnie od trybu edycji.
4. `renderBestiaryTable(record)` wykrywa „Umiejętności” i przekazuje ten wiersz do `createSkillsRow(...)` zamiast do standardowego renderera.
5. `serializeBestiaryOverrides(...)`, `deserializeBestiaryOverrides(...)` i `resetBestiaryOverrides()` zapisują, odtwarzają lub czyszczą nadpisanie tekstu.
6. `buildPrintableCardHTML(...)` używa nadpisania `skills`, jeżeli istnieje, dzięki czemu ręcznie zmieniona wartość pojawia się także na wygenerowanej karcie.

### 2. Aktualne formatowanie „Słów Kluczowych” w podglądzie bazowym

Formatowanie słów kluczowych jest już wydzielone:

- `isKeywordColumn(key)` rozpoznaje pole „Słowa Kluczowe” także w wariancie bez polskich znaków;
- `getFormattedCellHTML(sheetName, key, rawValue, options)` dla kolumny słów kluczowych wywołuje `formatKeywordHTML(...)`;
- dla arkusza `Bestiariusz` przekazywane jest `commasNeutral: true`;
- `formatKeywordHTML(...)` opakowuje treść w `.keyword-red`, a każdy przecinek w osobny `.keyword-comma`;
- `.keyword-red` ma kolor `var(--red)`, natomiast `.keyword-comma` ma bazowy kolor `var(--text)`.

Oznacza to, że oczekiwany wygląd widoczny na obrazie referencyjnym jest już obsługiwany dla zwykłego podglądu: tekst słów kluczowych jest czerwony, a przecinki pozostają zielone.

### 3. Aktualne formatowanie wygenerowanej karty

Karta jest generowana jako osobny dokument HTML z własnymi stylami inline. Wartość słów kluczowych jest obecnie pobierana bezpośrednio z rekordu, a następnie renderowana przez `formatInlineHTML(keywords)`.

W stylach karty `.inline-red` oraz `.keyword-red` są ustawione na `#111`. Karta pozostaje więc czarno-biała. Przy przyszłej zmianie ręcznie edytowane słowa kluczowe także muszą trafić na kartę jako zwykły czarny tekst; nie należy przenosić do karty czerwonego wyglądu interfejsu bazowego.

### 4. Kolor referencyjny dla jaśniejszego fontu przycisków

W `DataVault/style.css` wyjątek `.ref` używany dla zapisów typu `(str. 123)` ma:

```css
.ref { color: var(--code); opacity: .9; }
```

W obu modułach token `--code` ma wartość:

```css
--code: #D2FAD2;
```

`DetaleLayout.md` potwierdza, że jest to kolor wyróżnień i „jaśniejszych” elementów. Dla przycisków edycji należy użyć co najmniej `color: var(--code)`. Jeżeli celem jest dokładne odwzorowanie wyjątku `.ref`, należy także ustawić `opacity: 0.9`. Najbezpieczniej zrobić to osobną klasą przycisków edycji, aby nie rozjaśniać globalnie wszystkich przycisków `.btn.secondary`.

## Wymagana modyfikacja funkcjonalna

### 1. Rozszerzenie stanu nadpisań bestiariusza

Do `state.bestiaryOverrides` należy dodać:

```js
keywords: null,
keywordsEditing: false,
```

Znaczenie pól:

- `keywords` — ręcznie zmieniony tekst „Słów Kluczowych” albo `null`, gdy obowiązuje wartość źródłowa rekordu;
- `keywordsEditing` — informacja, czy wiersz „Słowa Kluczowe” jest aktualnie przełączony na `textarea`.

Pola powinny zostać obsłużone także przez:

- `serializeBestiaryOverrides(...)` — zapis wartości `keywords` do ulubionych;
- `deserializeBestiaryOverrides(...)` — odtworzenie wartości `keywords` i ustawienie `keywordsEditing: false`;
- `resetBestiaryOverrides()` — wyzerowanie `keywords` oraz `keywordsEditing` po zmianie rekordu lub resecie UI.

Dzięki temu ręczna korekta słów kluczowych będzie zachowywana razem z ulubionym zestawem dokładnie tak, jak korekta „Umiejętności”.

### 2. Rozpoznawanie edytowalnego wiersza „Słowa Kluczowe”

Należy dodać stałą analogiczną do `EDITABLE_SKILLS_KEY`, na przykład:

```js
const EDITABLE_KEYWORDS_KEY = normalizeKey("Słowa Kluczowe");
```

W `renderBestiaryTable(record)` należy wykryć ten klucz i skierować go do dedykowanego renderera wiersza.

### 3. Dedykowany renderer albo uogólnienie istniejącego renderera

Są dwa poprawne warianty implementacji:

#### Wariant rekomendowany: wspólny renderer edytowalnego pola tekstowego

Warto zastąpić `createSkillsRow(...)` bardziej ogólną funkcją, np. `createEditableTextRow(...)`, przyjmującą:

- klucz rekordu;
- tekst źródłowy;
- nazwę właściwości z nadpisaniem (`skills` albo `keywords`);
- nazwę właściwości trybu edycji (`skillsEditing` albo `keywordsEditing`);
- funkcję renderującą komórkę podglądu.

Dla „Umiejętności” funkcja podglądu może nadal wykorzystywać standardowe `createClampCell(...)`.

Dla „Słów Kluczowych” funkcja podglądu także może korzystać z `createClampCell("Bestiariusz", ...)`, ponieważ ta funkcja dochodzi do `getFormattedCellHTML(...)`, a istniejący formatter zachowuje czerwony tekst i neutralne przecinki.

Zalety:

- brak kopiowania niemal identycznej logiki **Edytuj/Zapisz**;
- mniejsze ryzyko rozbieżności między obsługą obu pól;
- prostsza dalsza rozbudowa, jeżeli kiedyś kolejne pola tekstowe staną się edytowalne.

#### Wariant alternatywny: osobny `createKeywordsRow(...)`

Można skopiować schemat `createSkillsRow(...)` do osobnej funkcji. Jest to prostsze lokalnie, ale tworzy duplikację i zwiększa ryzyko, że późniejsza poprawka trafi tylko do jednego z dwóch rendererów.

### 4. Zachowanie czerwieni i neutralnych przecinków po edycji

Najważniejszy warunek wizualny: po zapisaniu ręcznie zmienionych „Słów Kluczowych” podgląd bazowy nadal musi przejść przez istniejący formatter dla kolumn słów kluczowych.

Nie należy renderować zapisanej wartości przez `textContent`, `innerHTML` bez escapowania ani zwykłe `formatTextHTML(...)`. Poprawna ścieżka to standardowy mechanizm:

```text
createClampCell(...)
  → getFormattedCellHTML("Bestiariusz", "Słowa Kluczowe", ...)
  → formatKeywordHTML(..., { commasNeutral: true })
  → .keyword-red + .keyword-comma
```

Dzięki temu:

- wszystkie fragmenty tekstowe poza przecinkami pozostają czerwone;
- przecinki zachowują bazowy zielony kolor;
- ręcznie wpisany tekst nadal jest escapowany przez istniejącą logikę formatowania;
- zachowane pozostają wspierane markery inline, jeżeli występują w danych.

W samym `textarea` rekomendowane jest pozostawienie standardowego koloru tekstu pola (`var(--text)`), analogicznie do edycji „Umiejętności”. Warunek czerwieni dotyczy pola prezentowanego w podglądzie bazowym po zapisaniu, a nie surowego pola edycyjnego.

### 5. Przeniesienie nadpisanych słów kluczowych na wygenerowaną kartę

W `buildPrintableCardHTML(...)` należy odczytać:

```js
const keywordsOverride = bestiaryOverrides?.keywords;
```

oraz wybrać wartość analogicznie do `skillsOverride`:

```js
const keywords = keywordsOverride != null
  ? keywordsOverride
  : toDisplayString(getRecordValue(record, "Słowa Kluczowe"));
```

Wygenerowana karta ma pozostać czarno-biała. Obecna ścieżka `formatInlineHTML(keywords)` jest właściwa dla karty, ponieważ nie nakłada interfejsowego wrappera `.keyword-red`. Nawet gdyby w danych wystąpiły markery czerwieni, style karty wymuszają dla `.inline-red` i `.keyword-red` kolor `#111`.

### 6. Jaśniejszy font obu przycisków „Edytuj”

Przyciski przy „Umiejętnościach” i „Słowach Kluczowych” powinny otrzymać osobną klasę, np.:

```html
btn secondary btn-small editable-text-button
```

W `GeneratorNPC/style.css` należy dodać udokumentowaną dwujęzycznym komentarzem regułę:

```css
.editable-text-button {
  color: var(--code);
  opacity: 0.9;
}
```

Taki zakres jest precyzyjny:

- rozjaśnia oba przyciski **Edytuj**;
- po przełączeniu trybu zachowuje ten sam jaśniejszy wygląd także dla etykiety **Zapisz** w tym samym miejscu;
- nie zmienia wyglądu pozostałych przycisków pobocznych w module;
- odpowiada referencyjnemu wyjątkowi `.ref` z `DataVault` (`var(--code)` i `opacity: .9`).

Jeżeli intencją biznesową jest rozjaśnienie wyłącznie napisu **Edytuj**, ale nie **Zapisz**, klasa powinna być przełączana zależnie od trybu. Nie jest to jednak rekomendowane: migotanie koloru po wejściu w tryb edycji byłoby niespójne wizualnie, a użytkownik wskazał przyciski jako elementy interfejsu, nie tylko pojedynczą etykietę tekstową.

## Pliki wymagające zmiany podczas implementacji

### `GeneratorNPC/index.html`

Zakres:

- rozszerzenie `state.bestiaryOverrides`;
- dodanie stałej rozpoznającej „Słowa Kluczowe”;
- rozszerzenie serializacji, deserializacji i resetowania nadpisań;
- uogólnienie albo rozszerzenie renderera edytowalnych wierszy tekstowych;
- obsługa nowego wiersza specjalnego w `renderBestiaryTable(record)`;
- uwzględnienie `keywords` w `buildPrintableCardHTML(...)`;
- dodanie dokładnych komentarzy PL/EN przy nowej logice.

### `GeneratorNPC/style.css`

Zakres:

- dodanie dedykowanej klasy jaśniejszego fontu przycisków edycji;
- dodanie dokładnego komentarza PL/EN wyjaśniającego powiązanie z jaśniejszym tokenem `--code`.

### `GeneratorNPC/docs/README.md`

Zakres:

- aktualizacja pełnej instrukcji użytkownika w części polskiej;
- aktualizacja pełnej instrukcji użytkownika w części angielskiej;
- opisanie, że **Edytuj/Zapisz** działa przy „Umiejętnościach” i „Słowach Kluczowych”;
- wyjaśnienie, że słowa kluczowe w podglądzie pozostają czerwone poza przecinkami, a karta jest czarno-biała.

### `GeneratorNPC/docs/Documentation.md`

Zakres:

- opisanie rozszerzonego stanu `bestiaryOverrides`;
- opisanie nowego klucza edytowalnego;
- opisanie uogólnionego albo nowego renderera wiersza;
- opisanie zapisu do ulubionych, resetowania i użycia nadpisania na karcie;
- opisanie dedykowanej klasy stylu przycisku;
- zaktualizowanie wszystkich fragmentów mówiących obecnie wyłącznie o edycji „Umiejętności”.

### `DetaleLayout.md`

Zmiana ma charakter wizualny, dlatego podczas implementacji należy zaktualizować sekcję `GeneratorNPC`:

- opisać jaśniejszy kolor fontu przycisków edytowalnych pól tekstowych;
- wskazać `var(--code)` / `#D2FAD2` oraz `opacity: 0.9`, jeżeli zostanie przyjęte dokładne odwzorowanie `.ref`;
- opisać, że „Słowa Kluczowe” zachowują czerwony tekst i neutralne przecinki także po ręcznej edycji;
- zachować informację, że karta do druku jest czarno-biała.

### Niniejszy plik analityczny

Jeżeli implementacja zostanie wykonana na podstawie tej analizy, należy dopisać na końcu sekcję `## Zmiany wykonane w kodzie` zgodnie z instrukcjami repozytorium: z nazwami plików, możliwie dokładnymi lokalizacjami oraz opisem stanu przed i po zmianie.

## Wpływ na pozostałe mechanizmy

### Ulubione

Nowe nadpisanie powinno być elementem snapshotu `bestiaryOverrides`, aby zapisany ulubiony NPC po ponownym wczytaniu zachował ręcznie zmienione słowa kluczowe. Starsze zapisane ulubione nie będą posiadały pola `keywords`; deserializacja musi użyć bezpiecznego fallbacku `payload?.keywords ?? null`, dzięki czemu pozostaną kompatybilne.

### Reset i zmiana rekordu bestiariusza

Ręczne słowa kluczowe nie mogą przechodzić na kolejny wybrany rekord. `resetBestiaryOverrides()` musi czyścić zarówno wartość, jak i tryb edycji.

### Mechanizm clamp

Po zapisaniu słów kluczowych zwykły podgląd powinien nadal korzystać z `createClampCell(...)`. Zapewnia to zachowanie dotychczasowego skracania długich pól i rozwijania ich kliknięciem.

### Bezpieczeństwo HTML

Ręcznie wpisane słowa kluczowe muszą przechodzić przez dotychczasowy formatter, który escapuje tekst przed złożeniem kontrolowanych spanów. Nie należy bezpośrednio przypisywać wpisanej wartości do `innerHTML`.

### Karta czarno-biała

Interfejs bazowy i karta mają różne role wizualne:

- podgląd bazowy: czerwone słowa kluczowe, zielone przecinki;
- karta końcowa: tekst czarny (`#111`) bez kolorowych akcentów.

Implementacja powinna zachować to rozdzielenie zamiast próbować ponownie użyć całego HTML podglądu w karcie.

## Ryzyka regresji

1. **Brak zapisu do ulubionych** — dodanie wyłącznie renderera UI bez rozszerzenia serializacji spowoduje utratę ręcznych słów kluczowych po zapisaniu i ponownym wczytaniu ulubionego zestawu.
2. **Przenoszenie wartości między rekordami** — brak czyszczenia `keywords` w `resetBestiaryOverrides()` może przypisać słowa kluczowe poprzedniego NPC do nowo wybranego NPC.
3. **Utrata czerwieni lub zielonych przecinków** — renderowanie ręcznej wartości zwykłym `textContent` albo `formatTextHTML(...)` ominie `formatKeywordHTML(...)`.
4. **Kolorowa karta końcowa** — użycie interfejsowego wrappera `.keyword-red` bez kontroli stylów karty może naruszyć wymóg czarno-białego eksportu.
5. **Globalne rozjaśnienie wszystkich przycisków** — zmiana `.btn.secondary` byłaby zbyt szeroka; należy zastosować dedykowaną klasę tylko dla przycisków edytowalnych pól tekstowych.
6. **Niespójna dokumentacja** — aktualna instrukcja i dokumentacja techniczna opisują przycisk **Edytuj** wyłącznie przy „Umiejętnościach”, więc wymagają aktualizacji razem z kodem.
7. **Brak zgodności wstecznej ulubionych** — deserializacja bez opcjonalnego odczytu nowego pola może źle obsłużyć snapshoty zapisane przed wdrożeniem zmiany.

## Rekomendowane testy po implementacji

### Testy ręczne UI

1. Wybrać rekord bestiariusza zawierający „Słowa Kluczowe”.
2. Potwierdzić, że obok „Umiejętności” i „Słów Kluczowych” są widoczne dwa jaśniejsze przyciski **Edytuj**.
3. Porównać kolor fontu obu przycisków z jaśniejszym kolorem wyjątku `.ref` / `(str.)`: oczekiwany token `--code`, czyli `#D2FAD2`, opcjonalnie z `opacity: 0.9` zgodnie z implementacją.
4. Kliknąć **Edytuj** przy „Słowach Kluczowych”, zmienić wartość na przykład na:

   ```text
   ADEPTUS MECHANICUS, IMPERIUM, SERWITOR, TEST
   ```

5. Kliknąć **Zapisz** i potwierdzić, że:
   - wyrazy są czerwone;
   - przecinki są zielone;
   - pole nadal może zostać rozwinięte, jeżeli przekroczy limit linii.
6. Ponownie wejść w edycję i potwierdzić, że `textarea` zawiera ostatnio zapisaną wartość.
7. Zmienić rekord bestiariusza i potwierdzić, że nadpisanie nie przechodzi na kolejnego NPC.
8. Kliknąć globalny **Reset** i potwierdzić wyczyszczenie nadpisania.

### Testy ulubionych

1. Zmienić „Słowa Kluczowe”.
2. Dodać konfigurację do ulubionych.
3. Zmienić rekord lub wyczyścić UI.
4. Wczytać ulubiony zestaw.
5. Potwierdzić odtworzenie ręcznie zmienionych słów kluczowych i pozostawienie trybu edycji wyłączonego.
6. Wczytać ulubiony zapis utworzony przed wdrożeniem funkcji i potwierdzić fallback do źródłowej wartości rekordu.

### Test wygenerowanej karty

1. Zmienić „Słowa Kluczowe” w podglądzie bazowym.
2. Wygenerować kartę.
3. Potwierdzić, że karta używa zmienionej wartości.
4. Potwierdzić, że słowa kluczowe na karcie są czarne i karta pozostaje czarno-biała.
5. Potwierdzić, że dotychczasowe nadpisanie „Umiejętności” nadal trafia na kartę.

### Testy programistyczne

1. Uruchomić dostępny walidator składni JavaScript albo parser modułu dla `GeneratorNPC/index.html`, jeżeli repozytorium posiada taki skrypt.
2. Wyszukać wszystkie odwołania do `bestiaryOverrides`, aby potwierdzić obsługę `keywords` w stanie, serializacji, deserializacji, resetowaniu, renderowaniu i generowaniu karty.
3. Wyszukać wszystkie opisy edycji wyłącznie „Umiejętności” w dokumentacji i zaktualizować je do aktualnego zachowania.
4. Otworzyć aplikację w przeglądarce i wykonać zrzut ekranu po zmianie, ponieważ implementacja wpłynie na widoczny layout.

## Wnioski

Zmiana jest lokalna dla modułu `GeneratorNPC`, ale nie ogranicza się do dodania drugiego przycisku w tabeli. Aby funkcja była kompletna i spójna z istniejącymi mechanizmami, należy rozszerzyć:

- stan nadpisań;
- serializację i deserializację ulubionych;
- reset stanu;
- specjalne renderowanie wiersza bestiariusza;
- przekazywanie wartości do karty do druku;
- styl dedykowanych przycisków;
- instrukcję użytkownika, dokumentację techniczną i `DetaleLayout.md`.

Najbezpieczniejsza implementacja to uogólnienie istniejącego mechanizmu `createSkillsRow(...)` do wspólnego renderera edytowalnych pól tekstowych. Podgląd zapisanych „Słów Kluczowych” powinien nadal korzystać z dotychczasowej ścieżki `createClampCell(...) → getFormattedCellHTML(...) → formatKeywordHTML(...)`, ponieważ dokładnie ona zachowuje wymagane czerwone słowa i zielone przecinki. Karta końcowa powinna otrzymać nadpisaną wartość osobno i nadal renderować ją jako czarno-białą.

## Następne kroki

1. Zatwierdzić wariant implementacji ze wspólnym rendererem edytowalnych pól tekstowych.
2. Wprowadzić zmiany w kodzie, stylach i dokumentacji wymienionej w analizie.
3. Uzupełnić niniejszą analizę o sekcję `## Zmiany wykonane w kodzie`.
4. Wykonać testy ręczne UI, testy ulubionych oraz test wygenerowanej karty.
5. Wykonać zrzut ekranu gotowej zmiany.

## Zmiany wykonane w kodzie

### Plik: `GeneratorNPC/index.html`

Lokalizacja: `state.bestiaryOverrides`, linie 847-852

Było:

```js
bestiaryOverrides: {
  numeric: new Map(),
  skills: null,
  skillsEditing: false,
},
```

Jest:

```js
bestiaryOverrides: {
  numeric: new Map(),
  skills: null,
  skillsEditing: false,
  keywords: null,
  keywordsEditing: false,
},
```

Opis: stan nadpisań przechowuje teraz osobną wartość i tryb edycji dla pola „Słowa Kluczowe”.

### Plik: `GeneratorNPC/index.html`

Lokalizacja: stałe edytowalnych kluczy i serializacja nadpisań, okolice linii 913-945

Było:

```js
const EDITABLE_SKILLS_KEY = normalizeKey("Umiejętności");

const serializeBestiaryOverrides = (overrides) => ({
  numeric: Object.fromEntries(overrides.numeric),
  skills: overrides.skills ?? null,
});
```

Jest:

```js
const EDITABLE_SKILLS_KEY = normalizeKey("Umiejętności");
const EDITABLE_KEYWORDS_KEY = normalizeKey("Słowa Kluczowe");

const serializeBestiaryOverrides = (overrides) => ({
  numeric: Object.fromEntries(overrides.numeric),
  skills: overrides.skills ?? null,
  keywords: overrides.keywords ?? null,
});
```

Opis: dodano rozpoznawanie edytowalnych słów kluczowych oraz zapis i odczyt pola `keywords` w ulubionych. Deserializacja ustawia `keywordsEditing` na `false`, żeby zapisane ulubione nie otwierały się od razu w trybie edycji.

### Plik: `GeneratorNPC/index.html`

Lokalizacja: `resetBestiaryOverrides()`, linie 1192-1198

Było:

```js
state.bestiaryOverrides.numeric.clear();
state.bestiaryOverrides.skills = null;
state.bestiaryOverrides.skillsEditing = false;
```

Jest:

```js
state.bestiaryOverrides.numeric.clear();
state.bestiaryOverrides.skills = null;
state.bestiaryOverrides.skillsEditing = false;
state.bestiaryOverrides.keywords = null;
state.bestiaryOverrides.keywordsEditing = false;
```

Opis: reset wyboru rekordu lub strony czyści teraz także nadpisane słowa kluczowe.

### Plik: `GeneratorNPC/index.html`

Lokalizacja: renderer edytowalnych pól tekstowych, okolice linii 1698-1749

Było:

```js
const createSkillsRow = (record, key, valueString) => {
  // renderer obsługiwał tylko pole „Umiejętności”
};
```

Jest:

```js
const EDITABLE_TEXT_FIELDS = {
  [EDITABLE_SKILLS_KEY]: { valueKey: "skills", editingKey: "skillsEditing" },
  [EDITABLE_KEYWORDS_KEY]: { valueKey: "keywords", editingKey: "keywordsEditing" },
};

const createEditableTextRow = (record, key, valueString, config) => {
  // wspólny renderer dla „Umiejętności” i „Słowa Kluczowe”
};
```

Opis: renderer jest wspólny dla obu pól tekstowych, używa przycisku z klasą `editable-text-button` i po zapisie nadal renderuje podgląd przez `createClampCell(...)`, dzięki czemu pole „Słowa Kluczowe” zachowuje czerwony tekst i neutralne przecinki.

### Plik: `GeneratorNPC/index.html`

Lokalizacja: `renderBestiaryTable(record)`, okolice linii 1791-1795

Było:

```js
if (normalizedKey === EDITABLE_SKILLS_KEY) {
  bestiaryTableBody.append(createSkillsRow(record, key, valueString));
  return;
}
```

Jest:

```js
if (EDITABLE_TEXT_FIELDS[normalizedKey]) {
  bestiaryTableBody.append(
    createEditableTextRow(record, key, valueString, EDITABLE_TEXT_FIELDS[normalizedKey])
  );
  return;
}
```

Opis: tabela bestiariusza rozpoznaje teraz każdy klucz opisany w `EDITABLE_TEXT_FIELDS`, a nie tylko „Umiejętności”.

### Plik: `GeneratorNPC/index.html`

Lokalizacja: `buildPrintableCardHTML(...)`, okolice linii 2519-2521

Było:

```js
const keywords = toDisplayString(getRecordValue(record, "Słowa Kluczowe"));
```

Jest:

```js
const keywordsOverride = bestiaryOverrides?.keywords;
const keywords =
  keywordsOverride != null ? keywordsOverride : toDisplayString(getRecordValue(record, "Słowa Kluczowe"));
```

Opis: wygenerowana karta korzysta z ręcznie nadpisanych słów kluczowych, ale nadal renderuje je ścieżką czarno-białej karty.

### Plik: `GeneratorNPC/style.css`

Lokalizacja: okolice linii 161-166

Było:

```css
.btn.btn-small {
  padding: 6px 10px;
  font-size: 11px;
  letter-spacing: 0.12em;
}
```

Jest:

```css
.editable-text-button {
  color: var(--code);
  opacity: 0.9;
}
```

Opis: dodano dedykowaną klasę jaśniejszego tekstu dla przycisków **Edytuj/Zapisz** przy polach „Umiejętności” i „Słowa Kluczowe”, bez globalnej zmiany wszystkich przycisków pobocznych.

### Plik: `GeneratorNPC/docs/README.md`

Lokalizacja: okolice linii 15 oraz 38-39

Było: instrukcja użytkownika opisywała przycisk **Edytuj** tylko przy umiejętnościach.

Jest: instrukcja wyjaśnia obsługę **Edytuj/Zapisz** przy „Umiejętnościach” i „Słowach Kluczowych”, a także różnicę między kolorowym podglądem słów kluczowych i czarno-białą kartą drukowaną.

### Plik: `GeneratorNPC/docs/Documentation.md`

Lokalizacja: sekcje o podglądzie bazowym, stylach, stanie, rendererach i karcie do druku, okolice linii 102, 176-179, 258-266, 343-346, 379 oraz 406

Było: dokumentacja techniczna opisywała edycję tekstową wyłącznie dla „Umiejętności”.

Jest: dokumentacja opisuje `EDITABLE_KEYWORDS_KEY`, pola `keywords`/`keywordsEditing`, wspólny renderer `createEditableTextRow(...)`, klasę `.editable-text-button`, serializację/reset nadpisania oraz użycie nadpisanych słów kluczowych na karcie.

### Plik: `DetaleLayout.md`

Lokalizacja: sekcja `Moduł — GeneratorNPC`, okolice linii 428

Było: opis layoutu GeneratorNPC nie wskazywał jaśniejszego wariantu przycisków tekstowej edycji.

Jest: opis layoutu wskazuje, że przyciski **Edytuj/Zapisz** przy „Umiejętnościach” i „Słowach Kluczowych” używają `var(--code)` / `#D2FAD2` z `opacity: 0.9`.

# Analiza generowania pustych kwadratów „Ż” i „T” w module GeneratorNPC

## Data analizy

2026-06-08

## Temat analizy

Analiza wyliczania pustych kwadratów trackerów „Ż” / „T” na drukowanej karcie NPC w module `GeneratorNPC`, ze szczególnym uwzględnieniem przypadku potwora `LP=11`, dla którego pole edycji pokazuje `Żywotność=1`, ale pierwsza wygenerowana karta nie pokazuje pustego kwadratu Żywotności.

## Oryginalny pełny prompt użytkownika

```text
Przeprowadź analizę generowania kwadratów "Ż" i "T" w module GeneratorNPC.
Kroki jakie wykonuję:
1. Otwieram moduł https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/
2. Wybieram potwora LP=11, Żywotność=1, Odporność Psychiczna= brak
3.  Generuję kartę. Tworzy się jeden kwadracik "Ż" i jeden "T" i żaden pusty.
4. Zmieniam Żywotność na "2".
5. Generuję nową kartę
6. Na wygenerowanej karcie jest kwadracik tytułowy "Ż" i dwa puste
7. Zmieniam ponownie Żywotność na "1" (czyli pierwotna wartość)
8. Generuję nową kartę
9. Teraz generuje się kwadracik tytułowy "Ż" i jeden pusty.

Problem ten zauważyłem tylko u tego jednego potwora. Błędu nie udało mi się odtworzyć również na przykładzie potwora o LP=24, który też ma Żywotność=1 i Odporność Psychiczna= brak
Czemu tak się dzieje? Przeprowadź analizę wyliczania pustych kwadratów.
```

## Zakres analizy

Analiza objęła plik `GeneratorNPC/index.html`, w szczególności:

- stan tymczasowych nadpisań pól bestiariusza (`state.bestiaryOverrides.numeric`);
- renderowanie edytowalnych pól liczbowych w tabeli bestiariusza;
- resetowanie nadpisań po zmianie rekordu bestiariusza;
- przekazywanie nadpisań do generatora karty;
- funkcję `buildPrintableCardHTML`, która buduje HTML karty i trackery „Ż” oraz „T”;
- funkcję `resolveTrackerCount`, która decyduje, ile pustych kwadratów wygenerować.

Nie zmieniano kodu modułu. Ten plik jest wynikiem analizy, zgodnie z zasadą zapisywania analiz w folderze `Analizy`.

## Najważniejszy wniosek

Opisane zachowanie najprawdopodobniej wynika z rozbieżności między:

1. wartością faktycznie zapisaną w rekordzie danych bestiariusza dla `LP=11`, oraz
2. wartością pokazywaną w edytowalnym polu liczbowym po wyrenderowaniu tabeli.

Kod renderujący pole `number` potrafi pokazać użytkownikowi wartość zastępczą `1`, nawet jeżeli źródłowa wartość rekordu nie zawiera parsowalnej liczby. Dopóki użytkownik nie dotknie pola, ta wartość zastępcza nie trafia do `state.bestiaryOverrides.numeric`. Pierwsze generowanie karty korzysta więc z surowej wartości rekordu. Dopiero po zmianie pola na `2`, a następnie ponownie na `1`, generator korzysta z nadpisania użytkownika, dlatego zaczyna tworzyć odpowiednią liczbę pustych kwadratów.

To tłumaczy, dlaczego problem może występować tylko dla jednego rekordu: rekord `LP=11` może mieć w źródle danych wartość pustą, tekstową, nietypową albo zapisaną w formacie, z którego UI robi zastępcze `1`, ale `resolveTrackerCount` nie potrafi wyciągnąć liczby. Rekord `LP=24` najpewniej ma w źródle danych normalną wartość liczbową `1`, więc pierwsze generowanie działa zgodnie z oczekiwaniem.

## Szczegółowy przepływ danych

### 1. Stan nadpisań pól bestiariusza

Moduł przechowuje ręczne zmiany pól liczbowych w mapie `state.bestiaryOverrides.numeric`. Na starcie mapa jest pusta. Oznacza to, że dopóki użytkownik nie zmieni pola, generator karty nie ma informacji „użyj wartości widocznej w inpucie”, tylko korzysta z wartości źródłowej rekordu.

Istotny fragment:

```js
bestiaryOverrides: {
  numeric: new Map(),
  skills: null,
  skillsEditing: false,
  keywords: null,
  keywordsEditing: false,
},
```

### 2. Reset po zmianie potwora

Po wybraniu innego rekordu bestiariusza moduł czyści nadpisania. Jest to poprawne zachowanie, ponieważ edycje jednego potwora nie powinny przechodzić na innego.

Istotny fragment:

```js
if (state.selectedBestiaryIndex !== index) {
  state.selectedBestiaryIndex = index;
  resetBestiaryOverrides();
}
```

W praktyce po wybraniu potwora `LP=11` mapa `numeric` jest pusta, więc pierwsze generowanie karty bierze wartości z rekordu.

### 3. Renderowanie pola liczbowego może pokazać wartość zastępczą

Dla pól liczbowych tabela tworzy `<input type="number">`. Wartość początkowa jest liczona tak:

```js
const overrideValue = getNumericOverride(key);
const initial = overrideValue ?? parseNumericValue(valueString, minValue);
const resolvedInitial = Math.max(minValue, Number.isFinite(initial) ? initial : minValue);
input.value = String(resolvedInitial);
```

Dla większości pól `minValue` wynosi `1`. Funkcja `parseNumericValue` zwraca fallback, gdy w tekście nie znajdzie liczby. Dlatego nawet jeżeli źródłowe `valueString` dla `Żywotność` byłoby np. puste, `—`, `-`, `brak` albo zawierałoby nietypowy znak, pole w tabeli może pokazać `1`.

To jest kluczowa różnica:

- tabela pokazuje `1`, bo wymusza minimalną wartość w polu liczbowym;
- generator karty nadal może używać oryginalnej wartości rekordu, bo `state.bestiaryOverrides.numeric` pozostaje puste.

### 4. Nadpisanie powstaje dopiero po interakcji z inputem

Mapa `state.bestiaryOverrides.numeric` jest aktualizowana dopiero w eventach `input`, `change` lub `blur`:

```js
input.addEventListener("input", () => {
  clampInputLength();
  const numeric = Number.parseInt(input.value, 10);
  if (Number.isFinite(numeric)) {
    state.bestiaryOverrides.numeric.set(normalizeKey(key), Math.max(minValue, numeric));
  }
});
input.addEventListener("change", commitValue);
input.addEventListener("blur", commitValue);
```

Dlatego:

- samo wyświetlenie pola `Żywotność=1` nie zapisuje nadpisania;
- zmiana na `2` zapisuje nadpisanie `zywotnosc → 2`;
- późniejsza zmiana na `1` zapisuje nadpisanie `zywotnosc → 1`.

### 5. Generowanie karty dostaje całą mapę nadpisań

Kliknięcie „Generuj kartę” przekazuje do `openPrintableCard` aktualny obiekt `state.bestiaryOverrides`:

```js
openPrintableCard(state.bestiary[index], bestiaryNotes.value, {
  weaponOverride,
  armorOverride,
  moduleEntries,
  bestiaryOverrides: state.bestiaryOverrides,
});
```

Jeżeli mapa `numeric` jest pusta, karta używa wartości źródłowych. Jeżeli użytkownik zmienił pole, karta używa wartości z mapy.

### 6. Wyliczanie liczby pustych kwadratów „Ż”

W `buildPrintableCardHTML` wartość Żywotności jest pobierana tak:

```js
const vitality = resolveNumericDisplay("Żywotność", getRecordValue(record, "Żywotność"));
```

`resolveNumericDisplay` najpierw szuka nadpisania w mapie `numeric`. Jeżeli go nie ma, zwraca tekst z rekordu:

```js
const resolveNumericDisplay = (label, fallbackValue) => {
  const override = getNumericOverrideValue(label);
  return override != null ? String(override) : toDisplayString(fallbackValue);
};
```

Liczba pustych kwadratów jest potem liczona przez `resolveTrackerCount`:

```js
const resolveTrackerCount = (value) => {
  const parsed = parseStarNumber(value);
  if (!Number.isFinite(parsed?.numeric)) {
    return 0;
  }
  return Math.max(0, parsed.numeric);
};
```

Czyli:

- `"1"` daje `1` pusty kwadrat;
- `"2"` daje `2` puste kwadraty;
- wartość bez liczby daje `0` pustych kwadratów.

### 7. Wyliczanie liczby pustych kwadratów „T”

Dla Odporności Psychicznej działa dodatkowa reguła:

```js
const mentalText = normalizeText(mental);
const mentalHasDash = mentalText === "-";
const mentalCount = mentalHasDash ? 0 : resolveTrackerCount(mental);
```

Jeżeli wartość jest dokładnie `-`, liczba pustych kwadratów `T` wynosi `0`.

Warto zauważyć, że tytułowy kwadrat `T` jest renderowany zawsze jako etykieta wiersza trackera. Brak odporności psychicznej usuwa tylko puste kwadraty obok etykiety, nie usuwa samej etykiety `T`.

## Rekonstrukcja opisanego przypadku `LP=11`

Na podstawie kodu najbardziej prawdopodobny przebieg jest następujący:

1. Użytkownik wybiera rekord `LP=11`.
2. `resetBestiaryOverrides()` czyści mapę nadpisań.
3. Pole `Żywotność` w tabeli pokazuje `1`, ponieważ `createNumericInputCell` wymusza minimalną wartość `1` dla pól liczbowych.
4. Użytkownik od razu generuje kartę.
5. `state.bestiaryOverrides.numeric` nadal nie zawiera wpisu dla `Żywotność`.
6. `buildPrintableCardHTML` pobiera surową wartość `record["Żywotność"]`.
7. Jeżeli surowa wartość nie zawiera parsowalnej liczby, `resolveTrackerCount` zwraca `0`.
8. Karta pokazuje tylko etykietę `Ż`, bez pustych kwadratów.
9. Użytkownik zmienia `Żywotność` na `2`.
10. Event `input` lub `change` zapisuje nadpisanie `Żywotność=2`.
11. Generator dostaje override i tworzy dwa puste kwadraty.
12. Użytkownik zmienia `Żywotność` z powrotem na `1`.
13. Override zostaje zaktualizowany do `Żywotność=1`.
14. Generator tworzy jeden pusty kwadrat, bo tym razem używa nadpisania użytkownika, a nie surowej wartości z rekordu.

## Dlaczego problem nie występuje dla `LP=24`

Jeżeli rekord `LP=24` ma w źródłowych danych zwykłą wartość `Żywotność` równą `1`, to pierwsze generowanie działa inaczej:

1. mapa nadpisań jest pusta;
2. generator pobiera surowe `record["Żywotność"]`;
3. `parseStarNumber("1")` znajduje liczbę `1`;
4. `resolveTrackerCount` zwraca `1`;
5. karta od razu pokazuje jeden pusty kwadrat obok etykiety `Ż`.

To wskazuje, że problem nie leży w samym algorytmie tworzenia kwadratów dla każdej wartości `1`, tylko w specyficznej wartości źródłowej konkretnego rekordu albo w różnicy między wartością źródłową i wartością zastępczą pokazywaną w inpucie.

## Analiza pustych kwadratów — reguły obecnego kodu

### Tracker Żywotności „Ż”

- Etykieta `Ż` jest renderowana zawsze.
- Liczba pustych kwadratów obok etykiety to wynik `resolveTrackerCount(vitality)`.
- `vitality` pochodzi z ręcznego nadpisania, jeżeli istnieje.
- Jeżeli nie istnieje ręczne nadpisanie, `vitality` pochodzi bezpośrednio z rekordu bestiariusza.
- Wartość bez liczby daje `0` pustych kwadratów.
- Wartość liczbowa `N` daje `N` pustych kwadratów, z dolnym ograniczeniem `0`.

### Tracker Odporności Psychicznej / traumy „T”

- Etykieta `T` jest renderowana zawsze.
- Jeżeli tekst Odporności Psychicznej po normalizacji jest dokładnie `-`, liczba pustych kwadratów wynosi `0`.
- W przeciwnym razie liczba pustych kwadratów jest liczona tak samo jak dla Żywotności: pierwsza liczba znaleziona w tekście określa liczbę pól.
- Wartość `brak` nie jest traktowana specjalnie na tym etapie, ale jeżeli nie zawiera liczby, również da `0` pól.

## Ryzyka

1. **Ukryta rozbieżność danych i UI** — użytkownik widzi `1`, ale generator może używać innej wartości, jeśli pole nie zostało faktycznie zapisane jako override.
2. **Niejednoznaczne dane źródłowe** — rekordy z pustą, tekstową albo nietypowo zapisaną Żywotnością mogą wyglądać w tabeli tak samo jak rekordy z rzeczywistą wartością `1`.
3. **Trudność diagnostyczna** — problem pojawia się tylko przed pierwszą interakcją z polem, więc po ręcznym przestawieniu wartości „sam znika”.
4. **Potencjalny wpływ na inne pola liczbowe** — podobny mechanizm dotyczy także innych edytowalnych pól liczbowych, nie tylko Żywotności. Jeżeli generator lub inne funkcje korzystają z surowej wartości rekordu, mogą wystąpić analogiczne różnice.

## Rekomendacje

### Rekomendacja 1 — sprawdzić surową wartość `Żywotność` dla rekordu `LP=11`

Najpierw należy zweryfikować aktualne źródło danych, z którego ładuje się bestiariusz. Dla rekordu `LP=11` warto sprawdzić dokładną wartość pola `Żywotność`, łącznie ze spacjami, znakami specjalnymi i typem danych.

Oczekiwane znalezisko potwierdzające hipotezę: wartość nie jest zwykłym `1`, mimo że UI pokazuje `1`.

### Rekomendacja 2 — rozważyć synchronizację wartości zastępczej z generatorem

Jeżeli widoczna w tabeli wartość minimalna `1` ma być traktowana jako realna wartość używana przez kartę, kod powinien zapewnić spójność między inputem i generatorem.

Możliwe podejścia:

1. podczas tworzenia inputa zapisywać znormalizowaną wartość do `state.bestiaryOverrides.numeric`, gdy źródłowa wartość jest niepoprawna lub mniejsza niż minimum;
2. w `buildPrintableCardHTML` używać tej samej logiki minimalnej/fallbackowej dla pól trackerów co w `createNumericInputCell`;
3. przed generowaniem karty zebrać aktualne wartości widoczne w inputach i dopiero wtedy budować kartę.

Najbezpieczniejsze funkcjonalnie wydaje się podejście 2 albo 3, ponieważ zmniejsza ryzyko, że samo wyrenderowanie tabeli niejawnie zmieni stan edycji.

### Rekomendacja 3 — rozważyć czy etykieta `T` powinna być renderowana przy braku Odporności Psychicznej

Obecny kod zawsze pokazuje etykietę `T`, nawet gdy liczba pustych pól wynosi `0`. Jeżeli oczekiwaniem użytkowym jest całkowite ukrywanie trackera `T` przy `Odporność Psychiczna = -` lub `brak`, trzeba zmienić logikę renderowania całego wiersza `tracker-row--mental`, a nie tylko liczbę pustych kwadratów.

Jeżeli jednak etykieta `T` ma pełnić rolę stałego miejsca na karcie, obecne zachowanie jest zgodne z kodem.

## Następne kroki

1. Odczytać aktualny rekord `LP=11` ze źródła danych używanego przez wdrożony moduł i porównać pole `Żywotność` z rekordem `LP=24`.
2. Dodać test ręczny lub automatyczny dla scenariuszy:
   - `Żywotność` źródłowo `1`;
   - `Żywotność` źródłowo pusta/brak/`-`;
   - `Żywotność` źródłowo nietypowy tekst bez cyfr;
   - zmiana inputa z fallbackowego `1` na `2` i z powrotem na `1`.
3. Podjąć decyzję produktową, czy generator ma używać wartości surowej rekordu, czy wartości widocznej dla użytkownika w polu edycji.
4. Jeżeli karta ma zawsze odpowiadać temu, co widzi użytkownik w tabeli, zmienić kod tak, aby generowanie pobierało lub odtwarzało znormalizowaną wartość widoczną w inpucie.

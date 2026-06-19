# Eksport PDF — `Zdolności i talenty`, wielolinijkowe wpisy i pojemność pola

Data: 2026-06-19
Zakres: analiza dla `Kalkulator/test.html` i szablonu `Kalkulator/pdf/pl.pdf`.

---

## 1. Zaobserwowany problem

W teście wpisano:

- dwa pola talentów,
- jedną opisową `Zdolność Archetypu`,
- część wpisów miała kilka linii tekstu w jednym polu UI.

W PDF każda linia z pola tekstowego została potraktowana jako osobny wiersz w sekcji `Zdolności i talenty`.

Skutek:

- wielolinijkowy Talent 1 zużywa kilka pól PDF,
- wielolinijkowy Talent 2 zużywa kolejne pola PDF,
- opisowa `Zdolność Archetypu` może już nie zmieścić się w dostępnych slotach,
- Talent 3 nie pojawił się, bo zabrakło dostępnych pól PDF.

---

## 2. Przyczyna techniczna

Szablon `pl.pdf` nie ma jednego dużego wielowierszowego pola dla sekcji `Zdolności i talenty`.

Ma osiem osobnych pól tekstowych:

```text
Zdolności i talenty 1
Zdolności i talenty 2
Zdolności i talenty 3
Zdolności i talenty 4
Zdolności i talenty 5
Zdolności i talenty 6
Zdolności i talenty 7
Zdolności i talenty 8
```

Po analizie pól PDF:

```text
Zdolności i talenty 1: [40, 683, 570, 698]
Zdolności i talenty 2: [40, 668, 570, 683]
Zdolności i talenty 3: [40, 653, 570, 668]
Zdolności i talenty 4: [40, 638, 570, 653]
Zdolności i talenty 5: [40, 623, 510, 638]
Zdolności i talenty 6: [40, 608, 510, 623]
Zdolności i talenty 7: [40, 593, 510, 608]
Zdolności i talenty 8: [40, 578, 510, 593]
```

Każde z tych pól ma wysokość około 15 punktów PDF, czyli odpowiada jednemu wierszowi tekstu. Nie są to pola wielowierszowe.

Dla porównania `Notatki 1` jest polem wielowierszowym:

```text
Notatki 1: [25, 40, 435, 175], flagi: multiline
```

---

## 3. Obecny mechanizm w test.html

Aktualny mechanizm przygotowuje tekst `abilitiesAndTalents` jako jeden blok tekstu połączony znakami nowej linii, a potem funkcja `multilineFields(...)` rozdziela go po `\n` na kolejne pola PDF.

W praktyce oznacza to, że:

```text
Talent 1 Linia 1
Talent 1 Linia 2
Talent 1 Linia 3
Talent 2 Linia 1
```

zajmuje cztery sloty PDF, mimo że w UI były to tylko dwa wpisy.

---

## 4. Rekomendowane rozwiązanie podstawowe — tryb „jeden wpis = jeden slot PDF”

Najbezpieczniejsze rozwiązanie dla aktualnego etapu:

1. Nie traktować każdej linii wpisanej w textarea jako osobnego wpisu PDF.
2. Każde pole talentu i każda opisowa `Zdolność Archetypu` powinny być jednym elementem listy eksportowej.
3. Wewnętrzne nowe linie w jednym wpisie zamieniać na separator, np.:

```text
Talent 1 Linia 1 / Talent 1 Linia 2 / Talent 1 Linia 3
```

4. Dopiero tak przygotowane wpisy rozdzielać na pola:

```text
Zdolności i talenty 1 = Talent 1 Linia 1 / Talent 1 Linia 2 / Talent 1 Linia 3
Zdolności i talenty 2 = Talent 2 Linia 1 / Talent 2 Linia 2 / Talent 2 Linia 3 / Talent 2 Linia 4 / Talent 2 Linia 5
Zdolności i talenty 3 = Zdolność Archetypu Linia 1 / Zdolność Archetypu Linia 2 / Zdolność Archetypu Linia 3
```

Zalety:

- zachowujemy edytowalne pola PDF,
- nie zmieniamy szablonu PDF,
- opisowa `Zdolność Archetypu` nie ginie przez wielolinijkowe talenty,
- obsługa jest przewidywalna,
- ryzyko zepsucia układu PDF jest małe.

Wady:

- nadal mamy maksymalnie 8 wpisów w sekcji `Zdolności i talenty`,
- bardzo długie wpisy będą musiały mieć zmniejszony font albo wygenerować ostrzeżenie.

---

## 5. Proponowana zmiana w kodzie — etap bezpieczny

Zamiast zwracać `abilitiesAndTalents` jako jeden string, lepiej wewnętrznie traktować go jako tablicę wpisów.

Przykład koncepcyjny:

```js
function compactPdfEntry(text) {
  return String(text || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' / ');
}
```

Talenty:

```js
getTalents().forEach(talent => {
  const entry = compactPdfEntry(talent.name);
  if (entry) buckets.abilitiesAndTalents.push(entry);
});
```

Opisowa `Zdolność Archetypu`:

```js
if (rule.type === 'archetypeAbility' && rule.target === 'none') {
  const entry = compactPdfEntry(rule.name);
  if (entry) buckets.abilitiesAndTalents.push(entry);
}
```

Eksport do PDF:

```js
fillTextFieldsByEntries(form, abilityFieldNames, entries, warnings);
```

Gdzie `fillTextFieldsByEntries(...)` wpisuje jeden element tablicy do jednego pola PDF.

---

## 6. Ostrzeżenie przy przepełnieniu

Jeżeli wpisów jest więcej niż osiem, aplikacja powinna pokazać ostrzeżenie w technicznym logu PDF:

```text
Zdolności i talenty: 10 wpisów, dostępne pola PDF: 8. Pominięto 2 ostatnie wpisy.
```

Na późniejszym etapie można rozważyć bardziej zaawansowany tryb kompaktowy.

---

## 7. Wariant zaawansowany — dwie kolumny w PDF

Rozbicie `Zdolności i talenty` na dwie kolumny jest możliwe, ale wymaga większej decyzji projektowej.

Są dwa warianty:

### 7.1. Dwie kolumny jako tekst rysowany na PDF

Aplikacja mogłaby nie używać istniejących pól `Zdolności i talenty 1-8`, tylko narysować tekst bezpośrednio na stronie PDF w dwóch kolumnach.

Zalety:

- można zmieścić więcej wpisów,
- pełna kontrola nad łamaniem i rozmiarem fontu,
- można wykorzystać całą widoczną powierzchnię sekcji.

Wady:

- tekst przestaje być edytowalnym polem formularza PDF,
- trzeba bardzo dokładnie ustawić współrzędne,
- trzeba osobno pilnować wyglądu w różnych przeglądarkach/czytnikach PDF.

### 7.2. Dwie kolumny jako nowe pola formularza PDF

Aplikacja mogłaby tworzyć nowe pola formularza w obszarze `Zdolności i talenty`, np. 2 kolumny × 8 wierszy.

Zalety:

- potencjalnie zachowuje edytowalność,
- zwiększa liczbę slotów.

Wady:

- większa złożoność kodu,
- ryzyko konfliktu z istniejącymi polami formularza,
- konieczność testów w wielu przeglądarkach i czytnikach PDF,
- trudniejsze utrzymanie szablonu.

---

## 8. Rekomendacja

Na obecnym etapie rekomendowane jest rozwiązanie podstawowe:

```text
jeden wpis UI = jeden slot PDF
wewnętrzne nowe linie w jednym wpisie = separator „ / ”
limit: 8 wpisów, z ostrzeżeniem przy przepełnieniu
```

Dopiero jeśli po testach okaże się, że 8 wpisów to za mało dla realnych kart, warto wprowadzać tryb dwukolumnowy.

Powód: rozwiązanie podstawowe zachowuje edytowalność PDF i nie wymaga przebudowy szablonu.

# Eksport PDF — mechanizm kolumnowy dla `Zdolności i Talenty` oraz `Notatki`

Data: 2026-06-19
Zakres: decyzja projektowa i projekt mechanizmu dla `Kalkulator/test.html` oraz eksportu PL PDF.

---

## 1. Decyzja po analizie

Wariant wykorzystujący wyłącznie istniejące 8 pól PDF `Zdolności i talenty 1-8` jest nieakceptowany.

Powód: realna karta postaci może mieć więcej wpisów niż 8, a wielolinijkowe wpisy bardzo szybko zużywają dostępne pola formularza.

Wymagany kierunek:

```text
Zdolności i Talenty -> mechanizm dwóch lub więcej kolumn
Notatki -> mechanizm dwóch lub więcej kolumn
```

Mechanizm ma pozwalać zmieścić więcej treści w tych obszarach niż obecny eksport oparty na jednym wierszu PDF na jedną linię tekstu.

---

## 2. Założenie techniczne

Dla tych dwóch sekcji nie należy dalej polegać wyłącznie na istniejących polach formularza PDF:

```text
Zdolności i talenty 1-8
Notatki 1
```

Te pola są zbyt ograniczające:

- `Zdolności i talenty 1-8` to pojedyncze wiersze,
- `Notatki 1` jest większe, ale jednokolumnowe,
- obecne pola wymuszają układ szablonu zamiast pozwolić aplikacji zarządzać tekstem.

---

## 3. Rekomendowany mechanizm — warstwa kolumnowa generowana przez aplikację

Aplikacja powinna traktować sekcje `Zdolności i Talenty` oraz `Notatki` jako obszary tekstowe na stronie PDF.

Dla każdego obszaru trzeba zdefiniować prostokąt roboczy:

```js
const PDF_TEXT_AREAS = {
  abilitiesAndTalents: {
    pageIndex: 0,
    x: 40,
    y: 578,
    width: 530,
    height: 120,
    minColumns: 2,
    maxColumns: 4
  },
  notes: {
    pageIndex: 0,
    x: 25,
    y: 40,
    width: 410,
    height: 135,
    minColumns: 2,
    maxColumns: 4
  }
};
```

Współrzędne są punktem startowym i wymagają testu wizualnego na wygenerowanym PDF.

---

## 4. Przepływ danych

Eksport powinien najpierw przygotować osobne listy wpisów:

```js
abilitiesAndTalentsEntries = [
  'Talent 1 Linia 1 / Talent 1 Linia 2 / Talent 1 Linia 3',
  'Talent 2 Linia 1 / Talent 2 Linia 2 / Talent 2 Linia 3',
  'Zdolność Archetypu Linia 1 / Zdolność Archetypu Linia 2'
];

notesEntries = [
  'Inne Linia 1 / Inne Linia 2',
  'Zdolności Gatunkowe...',
  'Bonusy Słów Kluczowych...'
];
```

Ważne: pojedynczy wpis UI powinien pozostać pojedynczym wpisem logicznym. Wewnętrzne nowe linie w jednym polu UI nie powinny automatycznie tworzyć kilku osobnych pozycji listy PDF.

---

## 5. Algorytm kolumn

Dla każdej sekcji:

1. Przygotuj listę wpisów.
2. Ustal minimalną liczbę kolumn: 2.
3. Oblicz liczbę wierszy, które mieszczą się w obszarze dla danego rozmiaru fontu.
4. Jeśli wpisy się nie mieszczą, zwiększ liczbę kolumn do `maxColumns`.
5. Jeśli nadal się nie mieszczą, zmniejsz font.
6. Jeśli nadal się nie mieszczą, wpisz maksymalną możliwą liczbę pozycji i wygeneruj ostrzeżenie w technicznym logu PDF.

Przykład:

```text
entries: 18
minColumns: 2
rowsPerColumn: 8
capacity at 2 columns: 16 -> za mało
capacity at 3 columns: 24 -> wystarczy
```

---

## 6. Sposób renderowania — dwa warianty

### 6.1. Wariant A — rysowanie tekstu na PDF

Aplikacja rysuje tekst bezpośrednio na stronie PDF przez `page.drawText(...)`.

Zalety:

- największa kontrola nad kolumnami,
- najprostsze wdrożenie algorytmu łamania tekstu,
- można bardzo efektywnie wykorzystać obszar PDF.

Wady:

- tekst w tych dwóch sekcjach nie będzie edytowalnym polem formularza po wygenerowaniu PDF,
- trzeba usunąć lub wyczyścić stare pola formularza w tych obszarach, żeby nie nakładały się z nowym tekstem.

### 6.2. Wariant B — tworzenie nowych pól formularza w kolumnach

Aplikacja tworzy nowe pola formularza PDF dla każdej pozycji albo wiersza w kolumnach.

Zalety:

- potencjalnie zachowuje edytowalność tekstu po wygenerowaniu PDF,
- układ może nadal wyglądać jak formularz.

Wady:

- większa złożoność,
- większe ryzyko konfliktu z istniejącymi polami formularza,
- trudniejsza kontrola nad łamaniem tekstu,
- większe ryzyko różnic między przeglądarkami/czytnikami PDF.

---

## 7. Rekomendacja wdrożeniowa

Rekomendowany jest wariant A jako pierwszy etap mechanizmu kolumnowego:

```text
rysowanie tekstu bezpośrednio w obszarach `Zdolności i Talenty` i `Notatki`
```

Powód:

- obecny priorytet to pojemność i poprawny układ tekstu,
- te sekcje są najbardziej narażone na przepełnienie,
- zachowanie pełnej edytowalności w układzie wielokolumnowym znacząco zwiększa złożoność.

Pozostałe pola karty mogą nadal pozostać edytowalne.

---

## 8. Obsługa starych pól formularza

Przed narysowaniem tekstu w kolumnach aplikacja powinna wyczyścić stare pola:

```text
Zdolności i talenty 1-8
Notatki 1
```

Opcjonalnie można je usunąć z formularza, jeśli pdf-lib pozwoli zrobić to stabilnie w przeglądarce.

Jeżeli usunięcie pól okaże się niestabilne, bezpieczniejszy wariant testowy:

```text
ustawić stare pola na pusty tekst i narysować nową treść jako warstwę PDF
```

Do sprawdzenia wizualnego: czy podświetlenie pól formularza w przeglądarce nie zakrywa rysowanego tekstu.

---

## 9. Łamanie tekstu

Mechanizm powinien mieć prostą funkcję łamania tekstu:

```js
function wrapTextToWidth(text, font, fontSize, maxWidth) {
  // dzieli tekst na linie tak, żeby nie przekroczyć maxWidth
}
```

Dla wpisów listowych można użyć prefiksu:

```text
• Talent 1
• Talent 2
• Zdolność Archetypu
```

Jeżeli font/silnik PDF sprawiałby problem z punktorami, użyć bezpiecznego separatora ASCII:

```text
- Talent 1
- Talent 2
- Zdolność Archetypu
```

---

## 10. Ostrzeżenia

Jeżeli tekst nie mieści się nawet po zwiększeniu liczby kolumn i zmniejszeniu fontu, aplikacja powinna dodać ostrzeżenie do technicznego logu PDF:

```text
Zdolności i Talenty: tekst przekracza dostępny obszar. Pominięto część wpisów.
Notatki: tekst przekracza dostępny obszar. Pominięto część wpisów.
```

---

## 11. Testy ręczne po wdrożeniu

Po implementacji sprawdzić:

1. dwa krótkie talenty,
2. trzy talenty wielolinijkowe,
3. opisową `Zdolność Archetypu`,
4. więcej niż 8 wpisów w `Zdolności i Talenty`,
5. dużo wpisów w `Notatki`,
6. polskie znaki,
7. zachowanie przy podglądzie PDF w przeglądarce,
8. czy pozostałe pola karty nadal są edytowalne.

---

## 12. Status

Decyzja: mechanizm kolumnowy jest wymagany.

Następny krok implementacyjny: dodać w `Kalkulator/test.html` funkcje przygotowania list wpisów i renderowania tych list do wielokolumnowych obszarów PDF.

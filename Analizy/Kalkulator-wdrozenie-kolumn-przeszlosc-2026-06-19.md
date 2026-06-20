# Wdrożenie — dynamiczne kolumny dla pola `Przeszłość`

Data: 2026-06-19
Zakres: `Kalkulator/vendor/pdf-lib.min.js` jako testowy patch eksportu PDF dla `Kalkulator/test.html`.

---

## 1. Decyzja

Po wdrożeniu mechanizmu kolumnowego dla sekcji:

```text
Zdolności i Talenty
Notatki
```

użytkownik poprosił o analogiczne rozwiązanie dla pola:

```text
Przeszłość
```

Pole `Przeszłość` również nie musi pozostać edytowalnym polem formularza PDF.

---

## 2. Zakres zmiany

Pole formularza PDF:

```text
Przeszłość
```

jest teraz czyszczone i usuwane z formularza, jeśli pdf-lib pozwala zrobić to stabilnie.

Następnie treść z listy `Premia z przeszłości` jest rysowana bezpośrednio na stronie PDF jako tekst w dynamicznym układzie kolumnowym.

---

## 3. Obszar roboczy PDF

Współrzędne pola `Przeszłość` w szablonie PL PDF:

```text
Przeszłość: [467, 623, 576, 662]
```

Na tej podstawie wdrożono obszar:

```js
background: {
  pageIndex: 0,
  x: 467,
  y: 623,
  width: 109,
  height: 39,
  minColumns: 1,
  maxColumns: 3,
  maxFontSize: 8,
  minFontSize: 4,
  label: 'Przeszłość'
}
```

Pole jest znacznie mniejsze niż `Zdolności i Talenty` oraz `Notatki`, dlatego dopuszczono zakres `1-3` kolumn. Krótkie wpisy mogą pozostać w jednej kolumnie, a większa liczba wpisów może zostać zagęszczona do dwóch lub trzech kolumn.

---

## 4. Źródło danych

Do `Przeszłość` trafiają wpisy typu:

```text
Premia z przeszłości
```

Wpis wielolinijkowy w UI pozostaje jednym wpisem logicznym. Wewnętrzne nowe linie są zamieniane na separator:

```text
 / 
```

---

## 5. Algorytm

Pole `Przeszłość` używa tej samej funkcji renderującej co `Zdolności i Talenty` oraz `Notatki`:

```js
drawColumnText(...)
```

Mechanizm próbuje dobrać liczbę kolumn i rozmiar fontu tak, żeby tekst zmieścił się w obszarze pola.

Jeśli tekst nie mieści się nawet przy maksymalnym zagęszczeniu, aplikacja zapisuje ostrzeżenie w technicznym logu PDF.

---

## 6. Ryzyka testowe

Do sprawdzenia po `Ctrl+F5`:

1. czy stare niebieskie pole formularza `Przeszłość` znika albo przestaje zasłaniać tekst,
2. czy tekst mieści się w ramce pola,
3. czy przy kilku wpisach font nie staje się zbyt mały,
4. czy wpisy z polskimi znakami renderują się poprawnie,
5. czy pozostałe pola formularza karty nadal działają jak wcześniej.

---

## 7. Status

Mechanizm kolumnowy dla `Przeszłość` został wdrożony w testowym eksporcie PDF.

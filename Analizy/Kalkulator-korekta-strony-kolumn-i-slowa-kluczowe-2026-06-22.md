# Korekta eksportu PDF — strona kolumn i dwuwierszowe Słowa Kluczowe

Data: 2026-06-22
Zakres: `Kalkulator/vendor/pdf-lib.min.js`, eksport PL PDF w `Kalkulator/test.html`.

---

## 1. Problem z położeniem kolumn

Po pierwszym wdrożeniu mechanizmu kolumnowego treść sekcji:

```text
Zdolności i Talenty
Notatki
```

była rysowana na pierwszej stronie PDF.

Przyczyną było ustawienie:

```js
pageIndex: 0
```

Tymczasem oba obszary znajdują się na drugiej stronie szablonu PDF.

---

## 2. Korekta indeksu strony

Ustawiono:

```js
abilitiesAndTalents.pageIndex = 1
notes.pageIndex = 1
```

Pole `Przeszłość` pozostaje na pierwszej stronie:

```js
background.pageIndex = 0
```

Indeksy stron są liczone od zera.

---

## 3. Pole Słowa Kluczowe

Oryginalny PDF ma jedno pole:

```text
Słowa Kluczowe
```

o prostokącie:

```text
[275, 624, 415, 637]
```

Pole mieści tylko jeden wiersz tekstu.

---

## 4. Nowe zachowanie

Eksport automatycznie:

1. próbuje zmieścić tekst w jednym wierszu,
2. stopniowo zmniejsza font,
3. jeśli tekst nadal wymaga dwóch wierszy, tworzy drugie pole:

```text
Słowa Kluczowe 2
```

Drugie pole jest umieszczane bezpośrednio pod pierwszym:

```js
x: 275
y: 611
width: 140
height: 13
```

Oba pola otrzymują ten sam rozmiar fontu.

---

## 5. Zakres fontu

Dla `Słowa Kluczowe` mechanizm próbuje rozmiary:

```text
10–4 pt
```

Jeżeli tekst nie mieści się nawet w dwóch wierszach przy rozmiarze 4 pt, nadmiar jest pomijany, a do technicznego logu PDF trafia ostrzeżenie.

---

## 6. Pozostałe sekcje

Bez zmian pozostaje:

```text
Przeszłość
```

Sekcja nadal używa dynamicznego układu kolumnowego na pierwszej stronie.

---

## 7. Test ręczny

Po `Ctrl+F5` sprawdzić:

1. `Zdolności i Talenty` na drugiej stronie,
2. `Notatki` na drugiej stronie,
3. brak tekstu tych sekcji na pierwszej stronie,
4. krótkie `Słowa Kluczowe` w jednym wierszu,
5. długie `Słowa Kluczowe` w dwóch wierszach,
6. automatyczne zmniejszenie fontu,
7. brak nachodzenia drugiego wiersza na ramkę sekcji,
8. poprawne działanie pola `Przeszłość`.

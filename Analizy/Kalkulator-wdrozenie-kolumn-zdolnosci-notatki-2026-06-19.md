# Wdrożenie — dynamiczne kolumny dla `Zdolności i Talenty` oraz `Notatki`

Data: 2026-06-19
Zakres: `Kalkulator/vendor/pdf-lib.min.js` jako testowy patch eksportu PDF dla `Kalkulator/test.html`.

---

## 1. Decyzja

Użytkownik potwierdził, że dla sekcji:

```text
Zdolności i Talenty
Notatki
```

nie jest wymagane zachowanie edytowalności w wygenerowanym PDF.

W związku z tym wdrożono wariant rysowania tekstu bezpośrednio na stronie PDF zamiast wypełniania dotychczasowych pól formularza.

---

## 2. Zakres zmiany

Zmiana obejmuje wyłącznie eksport PDF w wersji testowej.

Dodano przechwycenie kliknięcia przycisku:

```text
Eksportuj PDF
```

Nowy mechanizm przechwytuje kliknięcie w fazie capture i zatrzymuje wcześniejszy eksport z `test.html`.

Pozostałe pola karty nadal są uzupełniane jako pola formularza PDF.

---

## 3. Sekcje renderowane jako kolumny

Dynamicznie rysowane są:

```text
Zdolności i Talenty
Notatki
```

Stare pola formularza są czyszczone i usuwane, jeśli pdf-lib pozwoli zrobić to stabilnie:

```text
Zdolności i talenty 1
Zdolności i talenty 2
Zdolności i talenty 3
Zdolności i talenty 4
Zdolności i talenty 5
Zdolności i talenty 6
Zdolności i talenty 7
Zdolności i talenty 8
Notatki 1
```

---

## 4. Obszary robocze PDF

Wdrożone obszary startowe:

```js
abilitiesAndTalents: {
  pageIndex: 0,
  x: 40,
  y: 578,
  width: 530,
  height: 118,
  minColumns: 2,
  maxColumns: 4,
  maxFontSize: 10,
  minFontSize: 5,
  label: 'Zdolności i Talenty'
}
```

```js
notes: {
  pageIndex: 0,
  x: 25,
  y: 40,
  width: 410,
  height: 135,
  minColumns: 2,
  maxColumns: 4,
  maxFontSize: 10,
  minFontSize: 5,
  label: 'Notatki'
}
```

Współrzędne należy traktować jako pierwszą wersję testową. Po obejrzeniu PDF mogą wymagać korekty o kilka punktów.

---

## 5. Zbieranie treści

Mechanizm przygotowuje trzy listy:

```text
abilitiesAndTalents
notes
background
```

Do `Zdolności i Talenty` trafiają:

- wpisy z głównej tabeli talentów,
- opisowe `Zdolności Archetypu`, czyli takie, które mają `Brak — tylko opis`.

Do `Notatki` trafiają:

- `Zdolności Gatunkowe`,
- `Bonusy Słów Kluczowych`,
- `Specjalne Bonusy Frakcji`,
- `Inne`,
- `Zdolności Archetypu`, które modyfikują cechę.

Do `Przeszłość` trafia:

- `Premia z przeszłości`.

---

## 6. Wielolinijkowe wpisy UI

Wpis wielolinijkowy w UI pozostaje jednym wpisem logicznym.

Wewnętrzne nowe linie są zamieniane na separator:

```text
 / 
```

Przykład:

```text
Talent 1 Linia 1
Talent 1 Linia 2
Talent 1 Linia 3
```

staje się jednym wpisem:

```text
Talent 1 Linia 1 / Talent 1 Linia 2 / Talent 1 Linia 3
```

Dzięki temu jeden talent nie zużywa automatycznie kilku slotów PDF.

---

## 7. Algorytm doboru kolumn i fontu

Dla każdej sekcji mechanizm próbuje dobrać układ automatycznie:

```text
kolumny: od 2 do 4
font: od 10 do 5
```

Dla każdej kombinacji:

1. obliczana jest szerokość kolumny,
2. tekst jest łamany do tej szerokości,
3. liczona jest liczba linii,
4. sprawdzane jest, czy całość mieści się w dostępnej liczbie kolumn.

Jeśli tekst się mieści, wybrany zostaje pierwszy pasujący układ.

Jeśli tekst nie mieści się nawet przy 4 kolumnach i foncie 5, część linii zostaje pominięta, a aplikacja zapisuje ostrzeżenie w technicznym logu PDF.

---

## 8. Format wpisów

Wpisy są rysowane z prefiksem:

```text
- Talent
- Zdolność Archetypu
- Notatka
```

Użyto zwykłego myślnika zamiast punktora `•`, żeby uniknąć problemów ze zgodnością w różnych czytnikach PDF.

---

## 9. Zachowanie pozostałych pól

Pozostałe pola karty nadal są wypełniane przez formularz PDF, m.in.:

```text
Gatunek
Frakcja
Archetyp
Słowa Kluczowe
Atrybuty
Umiejętności
Sumy umiejętności
Przeszłość
Spaczenie
Poziom Spaczenia
```

---

## 10. Potencjalne ryzyka testowe

Do sprawdzenia w wygenerowanym PDF:

1. czy usunięcie starych pól formularza z `Zdolności i talenty 1-8` oraz `Notatki 1` działa stabilnie,
2. czy przeglądarka nie pokazuje niebieskich podświetleń pól w tych dwóch obszarach,
3. czy tekst nie wchodzi w ozdobne ramki sekcji,
4. czy współrzędne `Notatki` nie nachodzą na stopkę lub sąsiednie pola,
5. czy polskie znaki nadal renderują się poprawnie,
6. czy reszta karty pozostała edytowalna.

---

## 11. Status

Mechanizm kolumnowy został wdrożony jako testowy patch eksportu PDF.

Następny krok: wygenerować PDF z dużą liczbą talentów i notatek oraz sprawdzić wizualnie rozmieszczenie tekstu.

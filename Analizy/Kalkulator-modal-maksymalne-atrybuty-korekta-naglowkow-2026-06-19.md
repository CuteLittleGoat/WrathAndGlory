# Modal Maksymalne wartości atrybutów — korekta nagłówków

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Problem

W wersji testowej modal `Maksymalne wartości atrybutów` różnił się wizualnie od wersji produkcyjnej.

Najważniejsza różnica: nazwy kolumn w wersji testowej były skrócone:

```text
S
WT
ZR
I
SW
INT
OGD
SZYBKOŚĆ
```

Natomiast w wersji produkcyjnej używane były pełne nazwy:

```text
SIŁA
WYTRZYMAŁOŚĆ
ZRĘCZNOŚĆ
INICJATYWA
SIŁA WOLI
INTELIGENCJA
OGŁADA
SZYBKOŚĆ
```

---

## 2. Przyczyna

W `Kalkulator/test.html` modal był generowany z tej samej tablicy atrybutów, która obsługuje główny kalkulator:

```js
attributes.map(a => a.label)
```

Ta tablica używa skrótów, ponieważ skróty są potrzebne w głównych obliczeniach i eksporcie PDF:

```text
S, Wt, Zr, I, SW, Int, Ogd, Szybkość
```

Dlatego modal odziedziczył skrócone nagłówki zamiast pełnych nazw znanych z wersji produkcyjnej.

---

## 3. Korekta

W `Kalkulator/test.html` modal `Maksymalne wartości atrybutów` powinien używać osobnej listy nagłówków dla tabeli ras/gatunków.

Docelowy układ nagłówków:

```text
SIŁA
WYTRZYMAŁOŚĆ
ZRĘCZNOŚĆ
INICJATYWA
SIŁA WOLI
INTELIGENCJA
OGŁADA
SZYBKOŚĆ
```

Dzięki temu testowy modal będzie zgodny wizualnie z wersją produkcyjną.

---

## 4. Test ręczny

Po `Ctrl+F5` otworzyć:

```text
Maksymalne wartości atrybutów
```

Sprawdzić, czy nagłówki kolumn są pełnymi nazwami, tak jak w wersji produkcyjnej.

Jeżeli układ tabeli dalej różni się szerokościami, to jest to osobna kwestia CSS/rozmiaru okna, a nie kwestia danych nagłówków.

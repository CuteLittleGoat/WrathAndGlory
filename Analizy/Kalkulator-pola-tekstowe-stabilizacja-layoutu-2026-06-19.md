# Pola tekstowe — stabilizacja layoutu podczas pisania

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Problem

Po zmianie pól tekstowych na stały rozmiar pojawiły się dwa problemy widoczne podczas pisania:

1. szerokości kolumn zmieniały się po wpisaniu kolejnych znaków,
2. rozmiar fontu zmieniał się podczas pisania, przez co cały widok „skakał”.

W wersji produkcyjnej ten problem nie występuje.

---

## 2. Przyczyna

Problem wynikał z dwóch elementów wersji testowej:

- tabele nadal używały domyślnego automatycznego layoutu kolumn,
- funkcja dopasowująca font była wywoływana przy każdym zdarzeniu `input` oraz po każdym `recalcAll()`.

W efekcie przeglądarka przeliczała szerokości kolumn i wysokości tekstu przy każdej wpisanej literze.

---

## 3. Zmiany w CSS

Tabele dostały stały layout:

```css
.table {
  table-layout: fixed;
}
```

Textarea nadal mają stały rozmiar i scroll, ale bez animowania fontu:

```css
textarea {
  resize: none;
  overflow-y: auto;
  word-break: break-word;
  overflow-wrap: anywhere;
}
```

Usunięto płynne przejście `transition: font-size`, ponieważ wzmacniało efekt skakania tekstu.

---

## 4. Zmiany w JavaScript

Funkcja `fitTextArea(el)` nadal istnieje, ale nie jest już odpalana przy każdej wpisanej literze.

Aktualnie dopasowanie fontu zachodzi:

- po wyrenderowaniu pól,
- po wczytaniu danych,
- po otwarciu/zamknięciu modala,
- po opuszczeniu pola tekstowego (`blur`).

Nie zachodzi już podczas każdego `input`.

---

## 5. Zasada działania fontu

Zmniejszanie fontu opiera się na progach długości tekstu i liczbie linii, a nie na bieżącym `scrollHeight`, ponieważ `scrollHeight` zmienia się dynamicznie podczas pisania i powodował niestabilność.

Progi:

```text
> 220 znaków lub > 3 linie  -> fit-small
> 420 znaków lub > 5 linii  -> fit-smaller
> 650 znaków lub > 8 linii  -> fit-tiny
```

---

## 6. Brak wpływu na eksport PDF

Zmiana dotyczy wyłącznie prezentacji pól w UI.

Wartości pól nie są modyfikowane, a eksport PDF nadal pobiera wartości przez `.value.trim()`.

---

## 7. Test ręczny

Po `Ctrl+F5` sprawdzić:

1. czy szerokości kolumn nie zmieniają się podczas pisania,
2. czy font nie zmienia rozmiaru przy każdej literze,
3. czy po opuszczeniu długiego pola font może się zmniejszyć,
4. czy bardzo długi tekst nadal ma scroll,
5. czy eksport PDF nadal przenosi wartości pól poprawnie.

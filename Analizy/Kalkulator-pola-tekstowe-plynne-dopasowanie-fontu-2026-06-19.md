# Pola tekstowe — płynne dopasowanie fontu podczas pisania

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Cel korekty

Poprzednia wersja testowa stabilizowała układ pól tekstowych, ale dopasowanie fontu następowało dopiero po zakończeniu pisania lub opuszczeniu pola.

Docelowe zachowanie ma odpowiadać wersji produkcyjnej: reakcja ma następować w trakcie pisania, ale bez skakania szerokości kolumn i bez utrudniania wpisywania tekstu.

---

## 2. Zachowane elementy stabilizacji

Pozostawiono stabilizację tabel:

```css
.table {
  table-layout: fixed;
}
```

Dzięki temu kolumny nie zmieniają szerokości podczas wpisywania treści.

Pola `textarea` nadal mają stały rozmiar i pionowy scroll:

```css
textarea {
  resize: none;
  overflow-y: auto;
  word-break: break-word;
  overflow-wrap: anywhere;
}
```

---

## 3. Płynne dopasowanie fontu

Przywrócono dopasowanie fontu w trakcie pisania, ale bez agresywnego przeliczania layoutu po każdej literze.

Dodano:

```js
scheduleFitTextArea(el)
```

Funkcja używa `requestAnimationFrame`, dzięki czemu zmiana klasy fontu jest grupowana z cyklem renderowania przeglądarki:

```js
requestAnimationFrame(() => {
  el.dataset.fitPending = '0';
  fitTextArea(el);
});
```

W zdarzeniu `input` dla pól `textarea` wywoływane jest teraz:

```js
scheduleFitTextArea(e.target);
```

---

## 4. Progi dopasowania

Font nadal zmienia się tylko po przekroczeniu progów długości tekstu albo liczby linii:

```text
> 220 znaków lub > 3 linie  -> fit-small
> 420 znaków lub > 5 linii  -> fit-smaller
> 650 znaków lub > 8 linii  -> fit-tiny
```

Dzięki temu font nie przeskakuje przy każdej pojedynczej literze.

---

## 5. Płynność wizualna

Przywrócono krótkie przejście CSS:

```css
transition: font-size .12s ease;
```

Zmiana fontu powinna być widoczna w trakcie pisania, ale łagodniejsza niż poprzednie gwałtowne przełączenie po `blur`.

---

## 6. Brak wpływu na eksport PDF

Zmiana dotyczy wyłącznie prezentacji pól w UI.

Wartości pól nie są modyfikowane. Eksport PDF nadal pobiera zawartość przez `.value.trim()`.

---

## 7. Test ręczny

Po `Ctrl+F5` sprawdzić:

1. czy kolumny nie zmieniają szerokości podczas pisania,
2. czy font reaguje już w trakcie pisania, a nie dopiero po opuszczeniu pola,
3. czy zmiana fontu nie utrudnia wpisywania,
4. czy długi tekst nadal powoduje pionowy scroll,
5. czy eksport PDF nadal przenosi wartości pól poprawnie.

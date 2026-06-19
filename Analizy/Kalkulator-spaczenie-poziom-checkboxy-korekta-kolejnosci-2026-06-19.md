# Korekta kolejności checkboxów kolumny Poziom przy Spaczeniu

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, eksport PL PDF.

---

## 1. Problem

Pierwsze mapowanie kolumny `Poziom` przy sekcji `Spaczenie` używało kolejności:

```js
['Check Box 30', 'Check Box 29', 'Check Box 28', 'Check Box 27', 'Check Box 26']
```

Test wizualny wykazał, że ta kolejność zaznacza czaszki od dołu, nie od góry.

Samo wyliczanie liczby czaszek było poprawne; błędna była tylko kolejność pól PDF.

---

## 2. Poprawiona kolejność

W `Kalkulator/test.html` zmieniono kolejność na:

```js
const corruptionLevelSlots = ['Check Box 26', 'Check Box 27', 'Check Box 28', 'Check Box 29', 'Check Box 30'];
```

Zakładana kolejność wizualna:

```text
Poziom 1 -> Check Box 26
Poziom 2 -> Check Box 27
Poziom 3 -> Check Box 28
Poziom 4 -> Check Box 29
Poziom 5 -> Check Box 30
```

Na obecnym etapie zasada używa tylko pierwszych czterech czaszek poziomu dla zakresu `21–25`.

---

## 3. Reguła pozostaje bez zmian

Liczba zaznaczonych czaszek `Spaczenia` nadal steruje kolumną `Poziom` tak:

| Spaczenie | Zaznaczenie w kolumnie Poziom |
| --- | --- |
| 0–5 | brak zaznaczonych czaszek poziomu |
| 6–10 | zaznaczona 1. czaszka poziomu |
| 11–15 | zaznaczona 1. i 2. czaszka poziomu |
| 16–20 | zaznaczona 1., 2. i 3. czaszka poziomu |
| 21–25 | zaznaczona 1., 2., 3. i 4. czaszka poziomu |

---

## 4. Dodatkowa korekta techniczna

Doprecyzowano funkcję liczącą liczbę czaszek poziomu:

```js
function getCorruptionLevelMarkCount(corruptionValue) {
  return Math.max(0, Math.min(4, Math.ceil(((Number(corruptionValue) || 0) - 5) / 5)));
}
```

Dzięki temu progi są zapisane czytelniej:

```text
6–10  -> 1
11–15 -> 2
16–20 -> 3
21–25 -> 4
```

---

## 5. Test ręczny po korekcie

Po `Ctrl+F5` sprawdzić:

```text
Spaczenie 6  -> zaznaczona górna czaszka poziomu 1
Spaczenie 11 -> zaznaczone górne czaszki poziomu 1 i 2
Spaczenie 16 -> zaznaczone górne czaszki poziomu 1, 2 i 3
Spaczenie 21 -> zaznaczone górne czaszki poziomu 1, 2, 3 i 4
```

Jeżeli PDF nadal będzie zaznaczał od dołu, oznacza to, że przeglądarka używa starej wersji pliku i trzeba wykonać twarde odświeżenie `Ctrl+F5`.

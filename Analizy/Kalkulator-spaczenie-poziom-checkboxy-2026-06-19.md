# Spaczenie i kolumna Poziom — mapowanie checkboxów PDF

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, eksport PL PDF.

---

## 1. Zakres zmiany

W eksporcie PDF sekcja `Spaczenie` ma dwa typy checkboxów:

1. siatka `Spaczenie` — 25 czaszek,
2. kolumna `Poziom` obok siatki — 5 czaszek poziomu.

Siatka `Spaczenie` działała poprawnie przed zmianą i oznaczała czaszki znakiem `X`.

Nowa zmiana dodaje automatyczne oznaczanie kolumny `Poziom` na podstawie liczby zaznaczonych czaszek `Spaczenia`.

---

## 2. Mapowanie siatki Spaczenia

Siatka `Spaczenie` używa pól PDF:

```text
Check Box 1
Check Box 2
...
Check Box 25
```

Te pola są wypełniane bez zmian.

---

## 3. Mapowanie kolumny Poziom

Kolumna `Poziom` używa pól PDF:

```text
Check Box 30
Check Box 29
Check Box 28
Check Box 27
Check Box 26
```

Kolejność jest zgodna z kolejnością odczytaną w diagnostyce PDF i odpowiada wizualnie czaszkom od góry do dołu:

```text
Poziom 1 -> Check Box 30
Poziom 2 -> Check Box 29
Poziom 3 -> Check Box 28
Poziom 4 -> Check Box 27
Poziom 5 -> Check Box 26
```

Na obecnym etapie używane są tylko pierwsze cztery czaszki poziomu, zgodnie z zasadą podaną w testach.

---

## 4. Reguła zaznaczania kolumny Poziom

Liczba zaznaczonych czaszek `Spaczenia` steruje kolumną `Poziom` tak:

| Spaczenie | Zaznaczenie w kolumnie Poziom |
| --- | --- |
| 0–5 | brak zmian / brak zaznaczonych czaszek poziomu |
| 6–10 | zaznaczona 1. czaszka poziomu |
| 11–15 | zaznaczona 1. i 2. czaszka poziomu |
| 16–20 | zaznaczona 1., 2. i 3. czaszka poziomu |
| 21–25 | zaznaczona 1., 2., 3. i 4. czaszka poziomu |

---

## 5. Implementacja w `test.html`

Dodano tablicę:

```js
const corruptionLevelSlots = ['Check Box 30', 'Check Box 29', 'Check Box 28', 'Check Box 27', 'Check Box 26'];
```

Dodano obliczenie liczby czaszek poziomu:

```js
getCorruptionLevelMarkCount(data.corruption)
```

W eksporcie PDF po zaznaczeniu siatki `Spaczenie` wykonywane jest dodatkowe zaznaczanie kolumny `Poziom`:

```js
const levelMarks = getCorruptionLevelMarkCount(data.corruption);
corruptionLevelSlots.forEach((name, i) => checkBox(form, name, i < levelMarks, warnings));
```

---

## 6. Test ręczny

Po `Ctrl+F5` sprawdzić eksport dla wartości:

```text
Spaczenie 0  -> brak czaszek w Poziom
Spaczenie 5  -> brak czaszek w Poziom
Spaczenie 6  -> 1 czaszka w Poziom
Spaczenie 10 -> 1 czaszka w Poziom
Spaczenie 11 -> 2 czaszki w Poziom
Spaczenie 15 -> 2 czaszki w Poziom
Spaczenie 16 -> 3 czaszki w Poziom
Spaczenie 20 -> 3 czaszki w Poziom
Spaczenie 21 -> 4 czaszki w Poziom
Spaczenie 25 -> 4 czaszki w Poziom
```

Jeżeli wizualnie okaże się, że czaszki w kolumnie `Poziom` zaznaczają się od dołu lub w innej kolejności, należy zmienić kolejność tablicy `corruptionLevelSlots`.

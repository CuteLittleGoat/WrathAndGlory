# Techniczne mapowanie pól PL PDF — Kalkulator/test.html

Data: 2026-06-19
Zakres: mapowanie po rzeczywistych nazwach pól odczytanych z `Kalkulator/pdf/pl.pdf` przez przycisk `Pokaż pola PDF`.

---

## 1. Przyczyna poprawki

Pierwsza wersja eksportu szukała pól po nazwach logicznych, np.:

```text
Analiza Wartość
Analiza Suma
Odporność Bazowa
Żywotność Maksymalna
```

Rzeczywiste nazwy pól w PDF są inne, np.:

```text
Analiza
AnalizaSuma
Bazowa Odporność
Maksymalna Żywotność
```

Dodatkowo minifikowana wersja `pdf-lib` pokazywała typy pól jako krótkie nazwy klas, np. `r` i `e`, więc filtrowanie pól po nazwach typów `PDFTextField` / `PDFCheckBox` nie działało wiarygodnie.

Poprawka: w `Kalkulator/test.html` eksport używa bezpośrednich nazw pól przez:

```js
form.getTextField("nazwa pola")
form.getCheckBox("nazwa checkboxa")
```

---

## 2. Pola główne

| Dane z kalkulatora | Techniczne pole PDF PL |
| --- | --- |
| Poziom Gry | `Poziom` |
| Gatunek | `Gatunek` |
| Archetyp | `Archetyp` |
| Frakcja | `Frakcja` |
| Słowa Kluczowe | `Słowa Kluczowe` |
| Przeszłość / premia z przeszłości | `Przeszłość` |
| Rozmiar | `Rozmiar` |
| Szybkość | `Szybkość` |

Pola nadal niewypełniane:

```text
Imię Graczki / Gracza
Imię Postaci
Ranga
Cel
```

---

## 3. Atrybuty

| Atrybut | Pole PDF PL |
| --- | --- |
| S | `S` |
| Wt | `Wt` |
| Zr | `Zr` |
| I | `I` |
| SW | `SW` |
| Int | `Int` |
| Ogd | `Ogd` |

Pola premii i sum atrybutów, np. `SPremia`, `SSuma`, `IntPremia`, `IntSuma`, zostają niewypełnione na tym etapie.

---

## 4. Umiejętności — Wartość i Suma

| Umiejętność w kalkulatorze | Wartość PDF PL | Suma PDF PL |
| --- | --- | --- |
| Analiza (Int) | `Analiza` | `AnalizaSuma` |
| Atletyka (S) | `Atletyka` | `AtletykaSuma` |
| Czujność (Int) | `Czujność` | `CzujnośćSuma` |
| Dowodzenie (SW) | `Dowodzenie` | `DowodzenieSuma` |
| Intuicja (Ogd) | `Intuicja` | `IntuicjaSuma` |
| Korzystanie z technologii (Int) | `Technologia` | `TechnologiaSuma` |
| Medycyna (Int) | `Medycyna` | `MedycynaSuma` |
| Mistrzostwo psioniczne (SW) | `Psionika` | `PsionikaSuma` |
| Oszukiwanie (Ogd) | `Oszukiwanie` | `OszukiwanieSuma` |
| Perswazja (Ogd) | `Perswazja` | `PerswazjaSuma` |
| Pilotaż (Zr) | `Pilotaż` | `PilotażSuma` |
| Przebiegłość (Ogd) | `Przebiegłość` | `PrzebiegłośćSuma` |
| Przetrwanie (SW) | `Przetrwanie` | `PrzetrwanieSuma` |
| Ukrywanie się (Zr) | `Ukrywanie się` | `Ukrywanie sięSuma` |
| Umiejętności strzeleckie (Zr) | `Umiejętności strzeleckie` | `Umiejętności StrzeleckieSuma` |
| Walka wręcz (I) | `Walka Wręcz` | `Walka WręczSuma` |
| Wiedza ogólna (Int) | `Wiedza ogólna` | `Wiedza ogólnaSuma` |
| Zastraszanie (SW) | `Zastraszanie` | `ZastraszanieSuma` |

Wzór dla kolumny `Suma` pozostaje:

```text
Suma = wartość umiejętności + wartość powiązanego atrybutu
```

---

## 5. Cechy obliczalne

| Cecha z kalkulatora | Pole PDF PL |
| --- | --- |
| Żywotność maksymalna | `Maksymalna Żywotność` |
| Odporność Psychiczna | `Odporność Psychiczna` |
| Determinacja | `Determinacja` |
| Obrona | `Obrona` |
| Odporność | `Bazowa Odporność` |
| Upór | `Upór` |
| Odwaga | `Odwaga` |
| Wpływy | `Wpływy` |
| Majątek | `Majątek` |
| Pasywna Czujność | `Pasywna Czujność` |

Pola nadal niewypełniane:

```text
Pancerz
Suma Odporności
Aktualna Żywotność
Trauma
Wiara Maksymalna
Wiara Aktualna
Otrzymane PD
Aktualne PD
```

---

## 6. Teksty wieloliniowe

`Zdolności i Talenty` są rozbijane liniami na pola:

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

`Notatki` trafiają do:

```text
Notatki 1
```

`Przeszłość` trafia do:

```text
Przeszłość
```

---

## 7. Spaczenie

Na tym etapie `Spaczenie` jest mapowane do pierwszych 25 checkboxów:

```text
Check Box 1
Check Box 2
...
Check Box 25
```

Checkboxy `Check Box 26`–`Check Box 30` nie są używane w pierwszym etapie, ponieważ są traktowane jako potencjalne pola poziomu / inne checkboxy pomocnicze, a nie sloty Spaczenia.

Jeżeli test wizualny pokaże inną kolejność czaszek, należy poprawić kolejność tablicy checkboxów w `test.html`.

# Mapowanie pól PDF — Kalkulator / Tworzenie Postaci

Data: 2026-06-19
Zakres: robocze mapowanie widocznych pól karty PDF na dane z `Kalkulator/TworzeniePostaci.html` oraz z modala `Cechy i zasady specjalne`.

Ten dokument opisuje znaczenie widocznych pól na karcie. Techniczne nazwy pól formularza PDF należy później odczytać z plików `pl.pdf` i `en.pdf` i przypisać do logicznych kluczy z tego dokumentu.

---

## 1. Pliki PDF

Potwierdzone pliki kart:

```text
Kalkulator/pdf/pl.pdf
Kalkulator/pdf/en.pdf
```

Ścieżki z poziomu `Kalkulator/TworzeniePostaci.html`:

```js
"./pdf/pl.pdf"
"./pdf/en.pdf"
```

---

## 2. Zasada ogólna

Wypełniane mają być tylko pola wskazane w mapowaniu. Pola nieomówione albo oznaczone jako puste pozostają puste.

PDF ma być spłaszczony po wypełnieniu pól.

```js
form.flatten();
```

---

## 3. Strona 1 — dane postaci

Sekcja górna karty:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| `Imię Gracza` | brak | zostaje puste |
| `Imię Postaci` | brak | zostaje puste |
| `Poziom` | `Poziom Gry` z modala | uzupełnić |
| `Gatunek` | `Gatunek` z modala | uzupełnić |
| `Archetyp` | `Archetyp` z modala | uzupełnić |
| `Ranga` | brak | zostaje puste |
| `Frakcja` | `Frakcja` z modala | uzupełnić |
| `Słowa Kluczowe` | `Słowa Kluczowe` z modala | uzupełnić |
| `Przeszłość` | bucket `background` | uzupełnić |

Bucket `background` zawiera wpisy typu `Premia z przeszłości`.

---

## 4. Strona 1 — Atrybuty

Sekcja `ATRYBUTY` w PDF ma trzy rzędy:

```text
Wartość
Premia
Suma
```

Wypełniany jest tylko pierwszy rząd: `Wartość`.

| Atrybut w kalkulatorze | Pole PDF |
| --- | --- |
| `S` | `ATRYBUTY / S / Wartość` |
| `Wt` | `ATRYBUTY / Wt / Wartość` |
| `Zr` | `ATRYBUTY / Zr / Wartość` |
| `I` | `ATRYBUTY / I / Wartość` |
| `SW` | `ATRYBUTY / SW / Wartość` |
| `Int` | `ATRYBUTY / Int / Wartość` |
| `Ogd` | `ATRYBUTY / Ogd / Wartość` |

Rzędy `Premia` i `Suma` w sekcji Atrybuty zostają puste.

`Szybkość` nie znajduje się w tabeli Atrybutów na PDF. Jest mapowana osobno do sekcji `CEL / Szybkość`.

---

## 5. Strona 1 — Umiejętności

Sekcja `UMIEJĘTNOŚCI` w PDF ma dla każdej umiejętności kolumnę `Wartość` i `Suma`.

Wypełniana jest tylko kolumna `Wartość`. Kolumny `Suma` zostają puste.

| Umiejętność w kalkulatorze | Pole PDF |
| --- | --- |
| `Analiza (Int)` | `UMIEJĘTNOŚCI / Analiza / Wartość` |
| `Atletyka (S)` | `UMIEJĘTNOŚCI / Atletyka / Wartość` |
| `Czujność (Int)` | `UMIEJĘTNOŚCI / Czujność / Wartość` |
| `Dowodzenie (SW)` | `UMIEJĘTNOŚCI / Dowodzenie / Wartość` |
| `Intuicja (Ogd)` | `UMIEJĘTNOŚCI / Intuicja / Wartość` |
| `Korzystanie z technologii (Int)` | `UMIEJĘTNOŚCI / Korzystanie z technologii / Wartość` |
| `Medycyna (Int)` | `UMIEJĘTNOŚCI / Medycyna / Wartość` |
| `Mistrzostwo psioniczne (SW)` | `UMIEJĘTNOŚCI / Mistrzostwo psioniczne / Wartość` |
| `Oszukiwanie (Ogd)` | `UMIEJĘTNOŚCI / Oszukiwanie / Wartość` |
| `Perswazja (Ogd)` | `UMIEJĘTNOŚCI / Perswazja / Wartość` |
| `Pilotaż (Zr)` | `UMIEJĘTNOŚCI / Pilotaż / Wartość` |
| `Przebiegłość (Ogd)` | `UMIEJĘTNOŚCI / Przebiegłość / Wartość` |
| `Przetrwanie (SW)` | `UMIEJĘTNOŚCI / Przetrwanie / Wartość` |
| `Ukrywanie się (Zr)` | `UMIEJĘTNOŚCI / Ukrywanie się / Wartość` |
| `Umiejętności strzeleckie (Zr)` | `UMIEJĘTNOŚCI / Umiejętności strzeleckie / Wartość` |
| `Walka wręcz (I)` | `UMIEJĘTNOŚCI / Walka wręcz / Wartość` |
| `Wiedza ogólna (Int)` | `UMIEJĘTNOŚCI / Wiedza ogólna / Wartość` |
| `Zastraszanie (SW)` | `UMIEJĘTNOŚCI / Zastraszanie / Wartość` |

---

## 6. Strona 1 — Cel

Sekcja `CEL`:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| duże pole opisu celu | brak | zostaje puste |
| `Upór` | wartość obliczona `Upór` | uzupełnić |
| `Odwaga` | wartość obliczona `Odwaga` | uzupełnić |
| `Rozmiar` | `Rozmiar` z modala | uzupełnić |
| `Szybkość` | `Szybkość` z głównej tabeli atrybutów kalkulatora | uzupełnić |

---

## 7. Strona 1 — Przetrwanie, Żywotność, Trauma

Sekcja `PRZETRWANIE`:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| `Obrona` | wartość obliczona `Obrona` | uzupełnić |
| `Odporność / Bazowa` | wartość obliczona `Odporność` | uzupełnić |
| `Odporność / Pancerz` | brak | zostaje puste |
| `Odporność / Suma` | brak | zostaje puste |

Sekcja `ŻYWOTNOŚĆ`:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| duże pole bieżącej Żywotności | brak | zostaje puste |
| `Maksymalna` | wartość obliczona `Żywotność maksymalna` | uzupełnić |

Sekcja `TRAUMA`:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| duże pole bieżącej Traumy | brak | zostaje puste |
| `Odporność Psychiczna` | wartość obliczona `Odporność Psychiczna` | uzupełnić |
| `Determinacja` | wartość obliczona `Determinacja` | uzupełnić |

---

## 8. Strona 1 — Wpływy i Majątek

Na dole pierwszej strony znajdują się pola:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| `Wpływy` | wartość obliczona `Wpływy` | uzupełnić |
| `Majątek` | wartość obliczona `Majątek` | uzupełnić |

Wzory pozostają zgodne z dokumentem `Analizy/Kalkulator.md`:

```text
Wpływy = wybrany atrybut bazowy - 1 + bonusy
Majątek = Poziom Gry + bonusy
```

---

## 9. Strona 2 — Zdolności i Talenty

Sekcja `ZDOLNOŚCI I TALENTY` jest uzupełniana bucketem `abilitiesAndTalents`.

Zawartość bucketu w kolejności:

1. nazwy z głównej sekcji kalkulatora:

```text
Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne
```

2. opisowe wpisy typu `Zdolność Archetypu`, czyli takie, gdzie `Modyfikuje` oznacza `Opis`, `Brak — tylko opis` albo `none`.

Zasady:

- eksportować tylko nazwy,
- nie eksportować kosztów,
- nie dodawać etykiet typu `Talent:` albo `Zdolność Archetypu:`,
- puste nazwy pomijać,
- każda nazwa powinna być osobnym wpisem, najlepiej osobną linią.

Sekcja `WIARA` obok pola `Zdolności i Talenty` zostaje pusta:

| Widoczne pole PDF | Status |
| --- | --- |
| `Wiara` | zostaje puste |
| `Wiara / Maksymalna` | zostaje puste |

---

## 10. Strona 2 — Rany i Spaczenie

### 10.1. Okaleczenia, trwałe urazy, mutacje

Pola:

- `Okaleczenia`,
- `Trwałe urazy`,
- `Mutacje`,
- powiązane pola opisowe w tej sekcji,

nie zostały wskazane do automatycznego uzupełniania i zostają puste.

### 10.2. Spaczenie

`Spaczenie` nie jest wpisywane jako zwykła liczba do pojedynczego pola tekstowego. Wartość ma oznaczać liczbę ikon czaszek oznaczonych `X`.

Zasady:

| Obliczone Spaczenie | Zachowanie PDF |
| --- | --- |
| `0` | żadna czaszka nie jest oznaczona |
| `1` | oznaczyć `X` na pierwszej czaszce |
| `2` | oznaczyć `X` na pierwszych dwóch czaszkach |
| `n` | oznaczyć `X` na pierwszych `n` czaszkach |

Na podstawie widocznego układu karty liczba slotów wygląda na `25`, czyli `5 × 5`, ale w implementacji należy potwierdzić rzeczywistą liczbę pól formularza w PDF.

Jeżeli obliczona wartość `Spaczenie` jest większa niż liczba dostępnych slotów czaszek, w kalkulatorze ma pojawić się ostrzeżenie.

Osobne ostrzeżenie z obliczeń nadal obowiązuje, gdy surowa wartość `Spaczenie` po bonusach, ale przed wymuszeniem minimum, jest mniejsza niż `0`.

Pole `Poziom` obok czaszek nie zostało wskazane do automatycznego uzupełniania i zostaje puste.

---

## 11. Strona 2 — Moce psioniczne

Sekcja `MOCE PSIONICZNE` nie została wskazana do automatycznego uzupełniania.

Pola tej sekcji zostają puste, nawet jeżeli w głównej sekcji kalkulatora użytkownik wpisze nazwę mocy psionicznej. Taka nazwa trafia do `Zdolności i Talenty`, zgodnie z mapowaniem głównej sekcji talentów.

---

## 12. Strona 2 — Notatki

Sekcja `NOTATKI` jest uzupełniana bucketem `notes`.

Do `Notatek` trafiają nazwy wpisów z następujących typów:

- modyfikujące `Zdolność Archetypu`, czyli takie, gdzie `Modyfikuje` nie jest opisem/brakiem modyfikatora,
- `Zdolności Gatunkowe`,
- `Bonusy Słów Kluczowych`,
- `Specjalne Bonusy Frakcji`,
- `Inne`.

Zasady:

- eksportować same nazwy,
- nie dodawać etykiet źródła,
- jeżeli wpis modyfikuje cechę, jego wartość nadal wpływa na obliczenia,
- puste nazwy pomijać.

---

## 13. Strona 2 — Pasywna Czujność i sąsiednie pola

W prawej dolnej części drugiej strony:

| Widoczne pole PDF | Źródło danych | Status |
| --- | --- | --- |
| `Ukrywanie się` | brak | zostaje puste |
| `Pasywna Czujność` | wartość obliczona | uzupełnić |
| `Otrzymane PD` | brak | zostaje puste |
| `Aktualne PD` | brak | zostaje puste |

Wzór:

```js
PasywnaCzujnosc = Math.ceil((Inteligencja + Czujnosc) / 2);
```

Gdzie:

```text
Inteligencja = wartość atrybutu Int z głównej strony kalkulatora
Czujność = wartość umiejętności Czujność (Int) z głównej strony kalkulatora
```

Przykłady:

| Inteligencja + Czujność | Pasywna Czujność |
| ---: | ---: |
| 1 | 1 |
| 2 | 1 |
| 3 | 2 |
| 4 | 2 |

Atrybuty mają minimalną wartość `1`, więc suma `Inteligencja + Czujność` nie powinna wynosić `0`, o ile `Czujność` nie zostanie dopuszczona jako wartość ujemna.

---

## 14. Wartości obliczalne i ostrzeżenia

Obliczenia mają wykonywać się zawsze, gdy wpis modyfikuje cechę. Dotyczy to także wartości ujemnych.

Kolumna `Wartość` w tabeli zasad specjalnych musi dopuszczać liczby ujemne.

Kalkulator nadal stosuje minima:

- wszystkie cechy poza `Spaczenie`: minimum `1`,
- `Spaczenie`: minimum `0`.

Jednocześnie mają pojawiać się ostrzeżenia na podstawie wartości surowej po bonusach, ale przed wymuszeniem minimum:

- dla każdej cechy poza `Spaczenie`: ostrzeżenie, jeżeli wartość surowa wynosi `0` lub mniej,
- dla `Spaczenie`: ostrzeżenie, jeżeli wartość surowa jest mniejsza niż `0`,
- dla `Spaczenie`: osobne ostrzeżenie, jeżeli wartość po obliczeniach przekracza liczbę slotów czaszek na PDF.

---

## 15. Logiczne klucze do profili PDF

Profile `pdfProfiles.pl` i `pdfProfiles.en` powinny mapować rzeczywiste nazwy pól formularza PDF na logiczne klucze, np.:

```js
const pdfProfiles = {
  pl: {
    templatePath: "./pdf/pl.pdf",
    fields: {
      playerName: null,
      characterName: null,
      tier: "...",
      species: "...",
      archetype: "...",
      rank: null,
      faction: "...",
      keywords: "...",
      background: "...",

      attributeStrength: "...",
      attributeToughness: "...",
      attributeAgility: "...",
      attributeInitiative: "...",
      attributeWillpower: "...",
      attributeIntellect: "...",
      attributeFellowship: "...",

      skillAwareness: "...",
      passiveAwareness: "...",

      speed: "...",
      size: "...",
      resolve: "...",
      conviction: "...",
      defence: "...",
      resilienceBase: "...",
      woundsMax: "...",
      shock: "...",
      determination: "...",
      influence: "...",
      wealth: "...",

      abilitiesAndTalents: "...",
      notes: "...",

      corruptionSlots: ["...", "...", "..."]
    }
  }
};
```

Pola z wartością `null` oznaczają świadomie niewypełniane widoczne pola PDF.

---

## 16. Nadal do wykonania technicznie

Przed implementacją eksportu trzeba:

1. odczytać rzeczywiste techniczne nazwy pól formularza z `pl.pdf` i `en.pdf`,
2. potwierdzić liczbę i nazwy pól odpowiadających slotom `Spaczenie`,
3. ustalić, czy pola czaszek są polami tekstowymi, checkboxami, czy innym typem formularza,
4. przygotować profile `pdfProfiles.pl` i `pdfProfiles.en`,
5. przetestować spłaszczony eksport PDF dla obu języków.

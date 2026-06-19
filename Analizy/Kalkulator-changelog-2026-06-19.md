# Changelog — Kalkulator / Cechy i zasady specjalne / Eksport PDF

Data: 2026-06-19
Repozytorium źródłowe: `CuteLittleGoat/WrathAndGlory`
Zakres: decyzje doprecyzowujące do `Analizy/Kalkulator.md`, przygotowane tak, aby podobny zakres dało się później przenieść do innego repozytorium.

---

## 1. Decyzje zamknięte w tej aktualizacji

### 1.1. Imię gracza i imię postaci

Nie dodawać pól:

- `Imię gracza`,
- `Imię postaci`,
- analogicznych pól identyfikacyjnych postaci.

Dotyczy to modala `Cechy i zasady specjalne`. Modal pozostaje narzędziem obliczeniowym i eksportowym, a nie pełną kartą postaci.

### 1.2. PDF-y w repozytorium

PDF-y zostały dodane w repozytorium i znajdują się w katalogu:

```text
Kalkulator/pdf/
```

Potwierdzone nazwy plików:

```text
Kalkulator/pdf/pl.pdf
Kalkulator/pdf/en.pdf
```

Profile PDF powinny używać ścieżek względnych z poziomu `Kalkulator/TworzeniePostaci.html`:

```js
const pdfProfiles = {
  pl: {
    templatePath: "./pdf/pl.pdf",
    fields: {}
  },
  en: {
    templatePath: "./pdf/en.pdf",
    fields: {}
  }
};
```

### 1.3. `pdf-lib` — decyzja techniczna

`pdf-lib` to biblioteka JavaScript potrzebna do wypełniania pól formularza PDF po stronie przeglądarki.

Istnieją dwa warianty:

1. lokalny plik w repozytorium, np.:

```text
Kalkulator/vendor/pdf-lib.min.js
```

2. ładowanie z CDN, czyli zewnętrznego adresu internetowego.

Rekomendacja dla tego projektu: użyć lokalnego pliku `Kalkulator/vendor/pdf-lib.min.js`, ponieważ aplikacja powinna działać przewidywalnie także lokalnie / offline i nie zależeć od zewnętrznego CDN.

### 1.4. Specjalne Bonusy Frakcji

`Specjalne Bonusy Frakcji` eksportować do pola:

```text
Notatki
```

Nie tworzyć osobnego bucketu eksportowego dla tego typu.

### 1.5. Zdolność Archetypu

`Zdolność Archetypu` ma zachowanie zależne od pola `Modyfikuje`.

Jeżeli użytkownik wybierze wariant opisowy, np.:

```text
Opis
Brak — tylko opis
none
```

wtedy nazwa wpisu trafia do pola:

```text
Zdolności i Talenty
```

Jeżeli użytkownik wybierze inną opcję, np. zwiększenie albo zmniejszenie `Majątku`, wtedy:

- wartość wpływa na obliczenia,
- nazwa wpisu trafia do pola `Notatki`,
- nazwa wpisu nie trafia do `Zdolności i Talenty`.

W PDF ma pojawić się sama nazwa wpisu, bez etykiety źródła.

### 1.6. Główna sekcja talentów

Nazwy wpisane w głównej sekcji:

```text
Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne
```

trafiają do pola:

```text
Zdolności i Talenty
```

Eksportować tylko nazwę, bez kosztu.

Kolejność w polu `Zdolności i Talenty`:

1. najpierw wpisy z głównej sekcji talentów,
2. potem opisowe wpisy typu `Zdolność Archetypu`.

Nie dodawać etykiet typu `Talent:` ani `Zdolność Archetypu:`.

### 1.7. Premia z przeszłości

`Premia z przeszłości` zawsze trafia do pola:

```text
Przeszłość
```

Dotyczy to wpisów opisowych i mechanicznych.

### 1.8. Zdolności Gatunkowe

`Zdolności Gatunkowe` trafiają do pola:

```text
Notatki
```

Jeżeli wpis modyfikuje cechę, jego wartość nadal wpływa na obliczenia.

### 1.9. Obliczenia i wartości ujemne

Obliczenia mają wykonywać się zawsze dla wpisów, które modyfikują cechę. Dotyczy to także wartości ujemnych.

Kolumna `Wartość` musi dopuszczać wartości ujemne, np.:

```text
-1
```

### 1.10. Ostrzeżenia dla wartości obliczalnych

Dodać ostrzeżenie, jeżeli surowa wartość po uwzględnieniu bonusów, ale przed wymuszeniem minimum, spadnie do niebezpiecznego zakresu.

Dla wszystkich cech poza `Spaczenie` ostrzeżenie pojawia się, gdy wartość wynosi:

```text
0 lub mniej
```

Dla `Spaczenie` ostrzeżenie pojawia się, gdy wartość wynosi:

```text
mniej niż 0
```

Minimum nadal pozostaje:

- `1` dla cech poza `Spaczenie`,
- `0` dla `Spaczenie`.

### 1.11. Eksport PDF — spłaszczenie formularza

Wygenerowany PDF ma być spłaszczony.

Oznacza to, że po wpisaniu wartości do pól formularza należy wykonać odpowiednik:

```js
form.flatten();
```

przed zapisaniem pliku przez:

```js
pdfDoc.save();
```

Efekt: odbiorca dostaje gotowy, nieedytowalny PDF z naniesionymi wartościami.

---

## 2. Wpływ na wcześniejszy dokument `Analizy/Kalkulator.md`

Następujące otwarte kwestie z końca `Analizy/Kalkulator.md` otrzymują nowy status:

| Kwestia | Status po decyzji 2026-06-19 |
| --- | --- |
| Dokładne nazwy plików PDF w `Kalkulator/pdf` | Potwierdzone: `pl.pdf` i `en.pdf` |
| Lokalny `pdf-lib.min.js` czy CDN | Rekomendowany lokalny `Kalkulator/vendor/pdf-lib.min.js` |
| Czy `Specjalne Bonusy Frakcji` trafiają do Notatek | Tak, trafiają do Notatek |
| Czy PDF ma być flattenowany | Tak, PDF ma być spłaszczony |
| Zachowanie `Zdolność Archetypu` | Doprecyzowane: opis do `Zdolności i Talenty`, modyfikator do `Notatki` |
| Główna sekcja talentów | Eksportuje tylko nazwy do `Zdolności i Talenty` |
| Wartości ujemne | Dopuszczone i uwzględniane w obliczeniach |
| Ostrzeżenia przy niskich wartościach | Dodać ostrzeżenia dla wartości surowych 0 lub mniej; dla `Spaczenie` mniej niż 0 |

Dodatkowo dodano osobny dokument:

```text
Analizy/Kalkulator-logika-eksportu-pdf-2026-06-19.md
```

---

## 3. Uwagi do przenoszenia do innego repozytorium

Przy przenoszeniu podobnej zmiany do innego repozytorium należy skopiować nie tylko kod, ale też decyzje projektowe:

- nie dodawać pól imienia gracza/postaci do modala obliczeniowego,
- zachować jeden modal `Cechy i zasady specjalne`,
- trzymać eksport PDF poza modalem,
- eksportować główną sekcję talentów do `Zdolności i Talenty`, tylko nazwy, bez kosztów,
- eksportować opisowe `Zdolność Archetypu` do `Zdolności i Talenty`,
- eksportować modyfikujące `Zdolność Archetypu` do `Notatki`,
- eksportować `Premia z przeszłości` do `Przeszłość`,
- eksportować `Zdolności Gatunkowe` do `Notatki`,
- eksportować `Specjalne Bonusy Frakcji` do `Notatki`,
- używać profili PDF osobno dla PL i EN,
- używać ścieżek `./pdf/pl.pdf` oraz `./pdf/en.pdf`, jeśli w docelowym repo pliki mają takie same nazwy,
- wypełnić PDF po nazwach pól formularza, nie po pozycjach,
- dopuszczać wartości ujemne w modyfikatorach,
- ostrzegać o surowych wartościach 0 lub mniej, a dla `Spaczenie` poniżej 0,
- spłaszczać finalny PDF.

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

Dla `Zdolność Archetypu` będzie wprowadzona zmiana względem wcześniejszej specyfikacji.

Na moment tej notatki szczegóły zmiany nie są jeszcze opisane. Implementacja nie powinna traktować wcześniejszego zachowania `Zdolność Archetypu` jako ostatecznego, dopóki ta zmiana nie zostanie doprecyzowana.

Aktualny bezpieczny status:

- pozostawić typ `Zdolność Archetypu` w konfiguracji,
- nie usuwać go z UI,
- nie zamykać logiki na stałe jako wyłącznie opisowej, jeśli późniejsza zmiana ma dopuścić modyfikator lub inny eksport,
- oznaczyć ten fragment w kodzie komentarzem `TODO` do doprecyzowania.

### 1.6. Eksport PDF — spłaszczenie formularza

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
| Zachowanie `Zdolność Archetypu` | Do zmiany; szczegóły jeszcze do doprecyzowania |

---

## 3. Uwagi do przenoszenia do innego repozytorium

Przy przenoszeniu podobnej zmiany do innego repozytorium należy skopiować nie tylko kod, ale też decyzje projektowe:

- nie dodawać pól imienia gracza/postaci do modala obliczeniowego,
- zachować jeden modal `Cechy i zasady specjalne`,
- trzymać eksport PDF poza modalem,
- eksportować `Premia z przeszłości` do `Przeszłość`,
- eksportować `Specjalne Bonusy Frakcji` do `Notatki`,
- używać profili PDF osobno dla PL i EN,
- używać ścieżek `./pdf/pl.pdf` oraz `./pdf/en.pdf`, jeśli w docelowym repo pliki mają takie same nazwy,
- wypełnić PDF po nazwach pól formularza, nie po pozycjach,
- spłaszczać finalny PDF,
- pozostawić decyzję dotyczącą `Zdolność Archetypu` jako punkt wymagający aktualizacji zgodnie z finalnym ustaleniem.

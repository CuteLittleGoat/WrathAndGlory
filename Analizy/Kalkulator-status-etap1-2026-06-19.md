# Status implementacji — Kalkulator etap 1

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, `Kalkulator/vendor/pdf-lib.min.js`, dokumentacja w `Analizy/`.

---

## 1. Zakres uprawnień

Użytkownik wykonał backup repo i dopuścił pełną edycję tylko następujących miejsc:

```text
Analizy/*
Kalkulator/vendor/pdf-lib.min.js
Kalkulator/test.html
```

Nie wolno modyfikować innych plików repozytorium.

---

## 2. Stan `Kalkulator/test.html`

Plik `Kalkulator/test.html` został zastąpiony przez użytkownika przygotowaną wersją testową etapu 1.

Wersja testowa zawiera:

- modal `Cechy i zasady specjalne`,
- dane postaci do obliczeń i eksportu,
- tabelę cech obliczalnych,
- tabelę zasad specjalnych,
- obliczenia cech pochodnych,
- obsługę wartości ujemnych w modyfikatorach,
- ostrzeżenia UI,
- sumy umiejętności: `Suma = Umiejętność + Atrybut`,
- `Pasywna Czujność = ceil(Suma Czujności / 2)`,
- eksport tekstów do bucketów `Zdolności i Talenty`, `Notatki`, `Przeszłość`,
- przycisk `Eksportuj PDF`,
- przycisk diagnostyczny `Pokaż pola PDF`,
- zapis/wczytanie lokalne przez `localStorage`.

---

## 3. Stan `Kalkulator/vendor/pdf-lib.min.js`

Plik `Kalkulator/vendor/pdf-lib.min.js` istnieje i został uzupełniony jako tymczasowy loader CDN.

Obecny plik:

- jest mały,
- ładuje `pdf-lib@1.17.1` z CDN,
- zachowuje ścieżkę `./vendor/pdf-lib.min.js` używaną przez `test.html`,
- pozwala testować eksport PDF przy dostępie do internetu.

To nie jest jeszcze docelowy pełny lokalny build biblioteki.

Docelowo ten sam plik powinien zostać podmieniony na pełną lokalną zawartość:

```text
pdf-lib/dist/pdf-lib.min.js
```

Wersja tymczasowa została użyta, ponieważ connector wcześniej blokował zapis dużego pliku JavaScript oraz pełnego dużego `test.html`.

---

## 4. Co trzeba sprawdzić ręcznie w przeglądarce

1. Otworzyć `Kalkulator/test.html`.
2. Sprawdzić, czy nie ma błędów w konsoli.
3. Sprawdzić, czy przycisk `Cechy i zasady specjalne` otwiera modal.
4. Sprawdzić, czy zmiana atrybutów i umiejętności przelicza PD.
5. Sprawdzić, czy cechy pochodne przeliczają się w modalu.
6. Sprawdzić, czy wartości ujemne w zasadach specjalnych wpływają na cechy i generują ostrzeżenia.
7. Sprawdzić, czy `Pasywna Czujność` liczy się z `Suma Czujności / 2`, zaokrąglając w górę.
8. Sprawdzić przycisk `Pokaż pola PDF`.
9. Sprawdzić eksport PDF PL.
10. Sprawdzić, czy wygenerowany PDF jest spłaszczony i czy pola zostały wypełnione w odpowiednich miejscach.

---

## 5. Ryzyka / TODO

- Obecny `pdf-lib.min.js` jest loaderem CDN, nie pełną lokalną biblioteką.
- Jeżeli test ma działać offline, trzeba podmienić `Kalkulator/vendor/pdf-lib.min.js` na pełny lokalny build.
- Mapowanie pól PDF w `test.html` wykorzystuje wyszukiwanie po nazwach pól i może wymagać korekty po teście przyciskiem `Pokaż pola PDF`.
- Szczególnie sprawdzić pola:
  - `Zdolności i talenty 1-6`,
  - `Notatki 1`,
  - `Technologia` / `TechnologiaSuma`,
  - `Psionika` / `PsionikaSuma`,
  - checkboxy `Spaczenie` (`Check Box 1` itd.).
- Po potwierdzeniu działania PL można przygotować osobny profil EN.

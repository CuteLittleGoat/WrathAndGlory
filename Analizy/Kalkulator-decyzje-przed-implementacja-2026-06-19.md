# Decyzje przed implementacją — Kalkulator / eksport PDF

Data: 2026-06-19
Zakres: decyzje końcowe przed rozpoczęciem prac kodowych nad `Kalkulator/TworzeniePostaci.html`.

---

## 1. Status prac kodowych

Na tym etapie nie modyfikować jeszcze kodu aplikacji.

Powód: przed rozpoczęciem implementacji ma zostać wykonany backup. Kod aplikacji można modyfikować dopiero po wyraźnym potwierdzeniu, że backup został wykonany i można rozpocząć prace.

Dozwolone na tym etapie:

- analiza,
- doprecyzowywanie założeń,
- aktualizacja plików w katalogu `Analizy/`,
- przygotowanie dokumentacji pod przyszłą implementację.

Niedozwolone na tym etapie:

- modyfikowanie `Kalkulator/TworzeniePostaci.html`,
- dodawanie kodu JavaScript do aplikacji,
- dodawanie bibliotek vendor do aplikacji,
- zmiana działania istniejącego kalkulatora.

---

## 2. Biblioteka PDF

Decyzja: użyć lokalnego pliku `pdf-lib`, zgodnie z rekomendacją.

Docelowo preferowana ścieżka:

```text
Kalkulator/vendor/pdf-lib.min.js
```

Uzasadnienie:

- stabilniejsze działanie lokalne/offline,
- brak zależności od CDN,
- większa przewidywalność podczas sesji i testów.

Na obecnym etapie nie dodawać jeszcze pliku vendor do repozytorium, ponieważ implementacja kodowa ma zacząć się dopiero po backupie.

---

## 3. Gałąź robocza

Decyzja: implementacja będzie prowadzona na gałęzi:

```text
main
```

Nie tworzyć osobnej gałęzi roboczej, chyba że użytkownik później zmieni decyzję.

---

## 4. Zakres językowy pierwszego etapu eksportu PDF

Decyzja: pierwszy etap implementacji obejmuje tylko polski PDF:

```text
Kalkulator/pdf/pl.pdf
```

Angielski PDF:

```text
Kalkulator/pdf/en.pdf
```

zostanie obsłużony później, po potwierdzeniu działania wersji PL.

Wersja EN różni się przede wszystkim położeniem pól na karcie PDF, dlatego powinna dostać osobny profil pól `pdfProfiles.en`, ale nie jest częścią pierwszego etapu działania eksportu.

---

## 5. Długie teksty w polach PDF

Dla pól tekstowych takich jak:

- `Zdolności i Talenty`,
- `Notatki`,
- `Przeszłość`,

nie ucinać tekstu automatycznie.

Zamiast tego trzeba przygotować rozwiązanie oparte na zmniejszaniu fontu, jeżeli tekstu jest za dużo.

Wymóg do implementacji:

- spróbować dopasować font do pola,
- zachować czytelność tekstu,
- w razie braku miejsca pokazać ostrzeżenie w UI,
- nie usuwać wpisów bez wiedzy użytkownika.

---

## 6. Ostrzeżenia w UI

Decyzja: ostrzeżenia mają pojawiać się w UI kalkulatora.

Dotyczy to co najmniej:

1. wartości obliczalnych, które przed wymuszeniem minimum spadają do zbyt niskiego poziomu:
   - dla cech poza `Spaczenie`: wartość surowa `0` lub mniej,
   - dla `Spaczenie`: wartość surowa mniejsza niż `0`,
2. wartości `Spaczenie`, która przekracza liczbę slotów czaszek na PDF,
3. potencjalnie zbyt długich tekstów do pól PDF, jeżeli nie uda się ich bezpiecznie zmieścić przez zmniejszenie fontu.

Preferowane miejsce ostrzeżeń:

- w modalu `Cechy i zasady specjalne`, w pobliżu tabeli cech obliczalnych,
- dodatkowo przy eksporcie PDF, jeżeli problem dotyczy samego PDF-a.

---

## 7. Umiejętności — kolumna Suma

W sekcji `Umiejętności` PDF należy uzupełniać:

- kolumnę `Wartość`,
- kolumnę `Suma`.

Kolumna `Suma` jest obliczana według wzoru:

```text
Suma umiejętności = wartość umiejętności + wartość powiązanego atrybutu
```

Przykład:

```text
Czujność (Int): Suma = Czujność + Int
```

Ta sama zasada obowiązuje dla każdej umiejętności.

`Szybkość` nie jest powiązana z żadną umiejętnością.

Szczegółowa tabela powiązań została zapisana w:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

---

## 8. Inspekcja PDF — aktualny status

Do poprawnego eksportu PDF trzeba odczytać rzeczywiste techniczne nazwy pól formularza z:

```text
Kalkulator/pdf/pl.pdf
Kalkulator/pdf/en.pdf
```

Na poziomie decyzji projektowych ustalono już znaczenie widocznych pól karty w dokumencie:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

Nadal do wykonania technicznie:

- odczytać listę pól formularza z `pl.pdf`,
- odczytać listę pól formularza z `en.pdf`,
- ustalić typy pól, zwłaszcza slotów `Spaczenie`,
- sprawdzić, czy sloty `Spaczenie` są polami tekstowymi, checkboxami albo innymi widgetami formularza,
- zbudować pierwszy profil `pdfProfiles.pl`,
- później zbudować profil `pdfProfiles.en`.

---

## 9. Pierwszy etap przyszłej implementacji

Po wykonaniu backupu pierwszy etap powinien obejmować:

1. prace tylko na `main`,
2. dodanie lokalnego `pdf-lib`,
3. obsługę tylko `pl.pdf`,
4. odczyt i mapowanie technicznych nazw pól PL,
5. eksport danych zgodnie z `Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md`,
6. spłaszczanie wynikowego PDF,
7. ostrzeżenia w UI,
8. przygotowanie mechanizmu zmniejszania fontu dla długich pól tekstowych,
9. uzupełnianie kolumny `Wartość` i `Suma` w sekcji `Umiejętności` PDF.

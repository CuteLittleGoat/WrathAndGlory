# Kalkulator/test.html — pakiet uwag 1

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, dokumentacja `Analizy/`.

---

## 1. Wprowadzone poprawki UI

W `Kalkulator/test.html` wprowadzono pierwszy pakiet uwag zebranych podczas testów ręcznych.

### Układ przycisków

Przyciski:

```text
Cechy i zasady specjalne
Eksportuj PDF
Show PDF Fields
```

zostały przeniesione bezpośrednio pod sekcję:

```text
Pula PD do wydania
```

oraz nad przyciski:

```text
Zapisz lokalnie
Wczytaj lokalnie
Reset
```

### Usunięcie opisu testowego

Usunięto tekst pomocniczy:

```text
Wersja testowa pierwszego etapu: modal cech, obliczenia, sumy umiejętności i eksport PDF PL. Wersja testowa jest odpięta od Firebase i zapisuje dane tylko lokalnie w przeglądarce.
```

Nagłówek strony wystarcza do oznaczenia wersji testowej.

### Stopka

Tekst:

```text
Wykonane przez Spaczoną Inteligencję
```

pozostaje, ale został ustawiony jako:

- tekst pochylony,
- wyrównany do prawej.

---

## 2. Elementy techniczne/testowe

Elementy techniczne nie mają zależeć od wersji językowej modułu. Zostały przeniesione na angielski i oznaczone czerwoną paletą techniczną.

### Zmienione teksty techniczne

```text
Pokaż pola PDF -> Show PDF Fields
Diagnostyka pól PDF -> PDF Field Diagnostics
Log eksportu PDF -> PDF Export Log
Brak komunikatów PDF -> No PDF messages.
```

### Ukrycie technicznych elementów

Elementy diagnostyczne pozostają w kodzie, ale są ukryte z widoku:

```text
Show PDF Fields
PDF Export Log
PDF Field Diagnostics modal
```

Mechanizmy pozostają w kodzie, żeby dało się je szybko przywrócić podczas dalszej diagnostyki.

### Kolor techniczny

Zgodnie z `DetaleLayout.md` dodano techniczną czerwoną paletę:

```css
--technical-text: #ffd8d8;
--technical-bg: rgba(255,70,70,.20);
--technical-bg-hover: rgba(255,70,70,.28);
--technical-border: rgba(255,85,85,.30);
--technical-glow: 0 0 10px rgba(255,85,85,.40);
```

---

## 3. Placeholdery typów zasad specjalnych

W modalu `Cechy i zasady specjalne` placeholder pola nazwy/opisu zależy od typu wiersza.

Wprowadzone placeholdery:

```text
Zdolności Gatunkowe
np. Honor Zakonu, Orczy, Łasuch, Intensywne emocje

Zdolność Archetypu
np. Oddane współczucie, Płomienna zachęta, +1 do Wpływy

Premia z przeszłości
np. +1 do Żywotności, [DOWOLNE] Słowo Kluczowe

Bonusy Słów Kluczowych
np. Stalowy Legion Armageddonu, Ordo Hereticus, Zakon Uświęconej Tarczy

Specjalne Bonusy Frakcji
np. Ścieżki Asuryani (Ścieżka przebudzenia), Mutacja Krootów (Ludojad)

Inne
np. Zakony Pierwszego Powołania, Homebrew
```

---

## 4. Ostrzeżenia cech obliczalnych

Ostrzeżenia dotyczące cech obliczalnych z modala nie są już wypisywane na głównej stronie kalkulatora.

Dotyczy m.in. komunikatów:

```text
Obrona: wartość surowa wynosi 0...
Odwaga: wartość surowa wynosi 0...
Wpływy: wartość surowa wynosi 0...
```

Te ostrzeżenia pozostają wyłącznie w samym modalu.

Główna strona zachowuje błędy właściwe dla kalkulatora, np. przekroczenie puli PD i Drzewo Nauki.

---

## 5. Tekst wzoru Pasywnej Czujności

Opis przy `Pasywna Czujność` zmieniono z:

```text
ceil((Int + Czujność) / 2)
```

na:

```text
Suma Czujność (Int) / 2
```

Sama logika obliczeń pozostaje bez zmian: używana jest suma Czujności i zaokrąglenie w górę.

---

## 6. Eksport PDF

### Nazwa pliku

Nazwa eksportowanego pliku PDF ma format:

```text
PL-[data]-[godzina].pdf
```

Wprowadzony format techniczny:

```text
PL-YYYY-MM-DD-HHmm.pdf
```

Przykład:

```text
PL-2026-06-19-1435.pdf
```

Dla kolejnych wersji językowych początek nazwy ma zmieniać się analogicznie, np. `EN-...`.

### Formularz pozostaje edytowalny

Usunięto spłaszczanie formularza (`flatten`) z eksportu testowego.

Powód: po spłaszczeniu część pól, np. `Poziom`, `Wpływy`, `Majątek`, przestawała być edytowalna w wygenerowanym PDF.

Aktualnie eksport zapisuje PDF z:

```js
pdfDoc.save({ updateFieldAppearances: false })
```

Wypełnione pola nadal aktualizują wygląd przez osadzony font Noto Sans, ale formularz pozostaje edytowalny.

---

## 7. Uwaga o fontach

Mechanizm obsługi polskich znaków pozostaje zgodny z wcześniejszą dokumentacją:

- ładowany jest `fontkit`,
- osadzany jest `Noto Sans Regular`,
- wygląd aktualizowany jest per-pole przez `field.updateAppearances(pdfAppearanceFont)`.

Nie stosujemy transliteracji polskich znaków.

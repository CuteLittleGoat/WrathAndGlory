# Analiza modułu Kalkulator — Tworzenie Postaci i eksport PDF

Data przygotowania: 2026-06-18
Aktualizacja: 2026-06-19

Dokument zbiera aktualne ustalenia dotyczące rozbudowy pliku `Kalkulator/TworzeniePostaci.html` o modal **Cechy i zasady specjalne** oraz funkcję **Eksportuj PDF**.

Uwaga: szczegółowe aktualne mapowanie widocznych pól PDF oraz sum umiejętności znajduje się w:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

Decyzje przed implementacją, w tym zakaz modyfikowania kodu przed backupem, znajdują się w:

```text
Analizy/Kalkulator-decyzje-przed-implementacja-2026-06-19.md
```

---

## 1. Status i zakres

Nowe prace mają rozbudować istniejący kalkulator:

```text
Kalkulator/TworzeniePostaci.html
```

Nie tworzyć nowej strony.

Do czasu wykonania backupu nie modyfikować kodu aplikacji. Na tym etapie dozwolone są tylko analiza i aktualizacje dokumentacji w `Analizy/`.

---

## 2. Najważniejsze ustalenia aktualne

- Nowy modal jest jeden: `Cechy i zasady specjalne`.
- Dwa nowe przyciski są na głównej stronie, nie w modalu: `Cechy i zasady specjalne` oraz `Eksportuj PDF`.
- Nie dodawać `Imię gracza`, `Imię postaci` ani `Ranga` do modala.
- Kalkulator nie pobiera danych z DataVault; pozostaje manualny i homebrew friendly.
- Pierwszy etap eksportu PDF obejmuje tylko `Kalkulator/pdf/pl.pdf`.
- `Kalkulator/pdf/en.pdf` zostanie obsłużony później jako osobny profil pól.
- `pdf-lib` ma być lokalny, docelowo `Kalkulator/vendor/pdf-lib.min.js`.
- PDF ma być spłaszczany po wypełnieniu.
- Długie pola tekstowe mają być obsłużone próbą zmniejszania fontu, bez automatycznego ucinania tekstu.
- Ostrzeżenia mają pojawiać się w UI.

---

## 3. Cechy obliczalne

Liczyć:

| Cecha | Wzór bazowy | Minimum |
|---|---|---:|
| Żywotność maksymalna | Wt + (2 × Poziom Gry) + bonusy | 1 |
| Odporność Psychiczna | SW + Poziom Gry + bonusy | 1 |
| Determinacja | Wt + bonusy | 1 |
| Obrona | I - 1 + modyfikator Rozmiaru + bonusy | 1 |
| Odporność | Wt + 1 + bonusy | 1 |
| Upór | SW + bonusy | 1 |
| Odwaga | SW - 1 + bonusy | 1 |
| Wpływy | wybrany atrybut bazowy - 1 + bonusy | 1 |
| Majątek | Poziom Gry + bonusy | 1 |
| Spaczenie | wartość ręczna + bonusy | 0 |

Nie liczyć:

- `WP Pancerza`,
- `Odporność suma`,
- osobnej `Odporności bazowej` poza polem `Odporność`,
- `Maks. Trauma`.

---

## 4. Umiejętności — Wartość i Suma na PDF

W sekcji `Umiejętności` PDF uzupełniać:

- kolumnę `Wartość`,
- kolumnę `Suma`.

Kolumna `Wartość` dostaje bezpośrednią wartość umiejętności z kalkulatora.

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

Szczegółowa tabela powiązań umiejętność-atrybut znajduje się w:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

---

## 5. Pasywna Czujność

`Pasywna Czujność` jest liczona z sumy `Czujności`:

```js
PasywnaCzujnosc = Math.ceil((Int + Czujnosc) / 2);
```

Równoważnie:

```js
PasywnaCzujnosc = Math.ceil(SumaCzujnosci / 2);
```

---

## 6. Eksport tekstów

- Główna sekcja talentów eksportuje tylko nazwy, bez kosztów, do `Zdolności i Talenty`.
- Opisowa `Zdolność Archetypu` trafia do `Zdolności i Talenty`.
- Modyfikująca `Zdolność Archetypu` trafia do `Notatki` i wpływa na obliczenia.
- `Premia z przeszłości` trafia do `Przeszłość`.
- `Zdolności Gatunkowe` trafiają do `Notatki`.
- `Bonusy Słów Kluczowych`, `Specjalne Bonusy Frakcji` i `Inne` trafiają do `Notatki`.

---

## 7. Wartości ujemne i ostrzeżenia

Wartości ujemne są dopuszczone tam, gdzie wpis modyfikuje cechę.

Ostrzeżenia:

- dla cech poza `Spaczenie`: gdy wartość surowa po bonusach, ale przed minimum, wynosi `0` lub mniej,
- dla `Spaczenie`: gdy wartość surowa jest mniejsza niż `0`,
- dla `Spaczenie`: gdy wartość po obliczeniach przekracza liczbę slotów czaszek na PDF.

---

## 8. Pliki uzupełniające

Aktualne szczegóły są rozbite na dokumenty:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
Analizy/Kalkulator-logika-eksportu-pdf-2026-06-19.md
Analizy/Kalkulator-decyzje-przed-implementacja-2026-06-19.md
```

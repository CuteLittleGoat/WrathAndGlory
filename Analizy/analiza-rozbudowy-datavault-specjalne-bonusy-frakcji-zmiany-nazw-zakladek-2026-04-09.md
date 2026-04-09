# Rozbudowana analiza DataVault — zmiana nazw zakładek na „Premie Frakcji” i „Specjalne Bonusy Frakcji”

## Prompt użytkownika (oryginalny kontekst)
> Przeprowadź analizę rozbudowy modułu DataVault.
>
> 1. Przygotuję nowy plik Repozytorium.xlsx
> 2. Dodałem nową zakładkę o nazwie "Specjalne Frakcji".
> 2.1. Zakładka zawiera kolumny LP, Frakcja, Rodzaj, Nazwa, Opis, Efekt
> 2.2. Szerokości, wyrównanie itd. kolumn Nazwa, Opis, Efekt mają być takie same jak w dotychczasowej zakładce "Orcze Klany"
> 2.3. Kolumna LP ma być ukryta (tak jak w innych zakładkach w tym module)
> 2.4. Kolumny Frakcja i Rodzaj ma mieć taką samą szerokość, wyrównanie itpd jak kolumna "Nazwa" w dotychczasowej zakładce "Orcze Klany"
> 2.5. Zachowaj dotychczasowe zasady kolorystyki (np. czerwony font, zasady dotyczące formatowania tekstu str. itd.).
> 3. Chciałbym, żeby ta zakładka była widoczna tylko po zaznaczeniu checkboxa "Czy wyświetlić zakładki dotyczące tworzenia postaci?"
> 4. Usunę zakładki "Ścieżki Asuryani", "Orcze Klany" i "Mutacje Krootów"
>
> Przeprowadź analizę rozszerzenia modułu o taką funkcjonalność.

## Prompt użytkownika (bieżąca aktualizacja)
> Przeczytaj i rozbuduj analizę Analizy/analiza-rozbudowy-datavault-specjalne-frakcji-2026-04-09.md
>
> Dokonam jeszcze dwóch zmian w zakładkach w pliku Repozytorium.xlsx
>
> Dotychczasowa zakładka "Bonusy Frakcji" będzie się nazywać "Premie Frakcji".
> Nowa zakładka zamiast "Specjalne Frakcji" będzie się nazywać "Specjalne Bonusy Frakcji".

---

## Co zmienia się względem poprzedniej analizy
Poprzednia analiza zakładała literalną nazwę nowego arkusza: **„Specjalne Frakcji”**. Po aktualizacji wymagania obowiązują dwie zmiany nazewnictwa:

1. **„Bonusy Frakcji” → „Premie Frakcji”** (zmiana nazwy istniejącego arkusza),
2. **„Specjalne Frakcji” → „Specjalne Bonusy Frakcji”** (zmiana nazwy nowego arkusza).

To nie jest wyłącznie kosmetyka: w DataVault nazwa arkusza jest kluczem dla:
- listy zakładek,
- logiki grupowania zakładek tworzenia postaci,
- selektorów CSS typu `table[data-sheet="..."]`,
- ewentualnych odwołań w dokumentacji i testach ręcznych.

---

## Zaktualizowane ustalenia techniczne

### 1) Import z XLSX nadal zadziała automatycznie
Jeśli pipeline nadal iteruje po wszystkich nazwach arkuszy, to po podmianie `Repozytorium.xlsx` dane trafią do `data.json` z nowymi nazwami arkuszy bez dodatkowej zmiany parsera.

### 2) Ukrywanie kolumny `LP` pozostaje bez zmian
Globalny mechanizm ukrywania kolumn technicznych (`LP`) nie zależy od nazwy zakładki, więc dla „Specjalne Bonusy Frakcji” będzie działał tak samo.

### 3) Kluczowa korekta: nazwa arkusza w logice checkboxa
Aby nowa zakładka była widoczna tylko po zaznaczeniu checkboxa „tworzenie postaci”, w `CHARACTER_CREATION_SHEETS` trzeba użyć dokładnie nazwy:
- **`"Specjalne Bonusy Frakcji"`**
a nie historycznego `"Specjalne Frakcji"`.

### 4) Kluczowa korekta: selektory CSS muszą użyć nowej nazwy arkusza
Reguły szerokości kolumn dla nowej zakładki muszą wskazywać:
- `table[data-sheet="Specjalne Bonusy Frakcji"] ...`

Jeśli zostanie stary selektor `Specjalne Frakcji`, style się nie przypną i układ kolumn będzie błędny.

### 5) Zmiana „Bonusy Frakcji” na „Premie Frakcji” może wymagać aktualizacji odwołań
Jeżeli gdziekolwiek istnieją odwołania literalne do nazwy `"Bonusy Frakcji"` (np. kolejność zakładek, dedykowane style, mapy aliasów), trzeba je zmienić na `"Premie Frakcji"`.

---

## Aktualizacja mapowania nazw (do wdrożenia)

| Typ | Było | Ma być |
|---|---|---|
| Zakładka istniejąca | `Bonusy Frakcji` | `Premie Frakcji` |
| Zakładka nowa | `Specjalne Frakcji` | `Specjalne Bonusy Frakcji` |

Rekomendacja: potraktować tę tabelę jako checklistę „find & replace” dla kodu, stylów, testów manualnych i dokumentacji.

---

## Zaktualizowany projekt implementacji (po przyszłym wdrożeniu)

### A) `Repozytorium.xlsx`
- Upewnić się, że zakładki mają finalne nazwy dokładnie:
  - `Premie Frakcji`
  - `Specjalne Bonusy Frakcji`
- Dla `Specjalne Bonusy Frakcji` zachować kolumny: `LP`, `Frakcja`, `Rodzaj`, `Nazwa`, `Opis`, `Efekt`.
- Usunąć: `Ścieżki Asuryani`, `Orcze Klany`, `Mutacje Krootów` (zgodnie z wcześniejszym założeniem).

### B) `app.js` (logika zakładek)
- W sekcji zakładek tworzenia postaci:
  - dodać `Specjalne Bonusy Frakcji`,
  - usunąć ewentualny wpis `Specjalne Frakcji` (jeżeli był dodany wcześniej),
  - zaktualizować wpis `Bonusy Frakcji` → `Premie Frakcji` (jeżeli ta nazwa jest używana literalnie).

### C) `style.css` (szerokości i układ)
- Dodać/zmienić selektor na nową nazwę arkusza:
  - `table[data-sheet="Specjalne Bonusy Frakcji"]`
- Ustawić proporcje jak dla `Orcze Klany`:
  - `Frakcja` = `26ch`,
  - `Rodzaj` = `26ch`,
  - `Nazwa` = `26ch`,
  - `Opis` = `56ch`,
  - `Efekt` = `26ch`.

### D) Dokumentacja modułu DataVault (na etapie implementacji)
- Po wdrożeniu kodu zaktualizować dokumenty modułu tak, aby występowały tylko nowe nazwy:
  - `Premie Frakcji`,
  - `Specjalne Bonusy Frakcji`.

---

## Ryzyka po zmianie nazw

1. **Ryzyko literówek i rozjazdu nazw**
   `Specjalne Bonusy Frakcji` to długa nazwa; jedna różnica znaku spowoduje brak stylów lub brak poprawnego przypisania do grupy checkboxa.

2. **Ryzyko „starych” selektorów CSS**
   Jeśli w CSS zostanie `data-sheet="Specjalne Frakcji"`, tabela w UI będzie miała domyślne szerokości.

3. **Ryzyko niepełnego rename dla „Bonusy → Premie”**
   Część mechanizmów może działać, ale np. kolejność zakładek lub filtry mogą pozostać pod starą nazwą.

4. **Ryzyko dokumentacyjne**
   W instrukcjach/testach ręcznych mogą pozostać nieaktualne nazwy, co utrudni dalszą pracę.

---

## Zaktualizowana checklista testu ręcznego (po wdrożeniu)

1. Wczytać nowy `Repozytorium.xlsx` i odświeżyć `data.json`.
2. Sprawdzić, że istnieją zakładki:
   - `Premie Frakcji`,
   - `Specjalne Bonusy Frakcji`.
3. Sprawdzić checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?”
   - OFF: `Specjalne Bonusy Frakcji` niewidoczne,
   - ON: `Specjalne Bonusy Frakcji` widoczne.
4. W `Specjalne Bonusy Frakcji` potwierdzić:
   - brak widocznej kolumny `LP`,
   - szerokości: `Frakcja/Rodzaj/Nazwa/Efekt = 26ch`, `Opis = 56ch`,
   - poprawne formatowanie kolorów i znaczników tekstu.
5. Potwierdzić brak zakładek:
   - `Ścieżki Asuryani`,
   - `Orcze Klany`,
   - `Mutacje Krootów`.

---

## Wniosek końcowy (wersja po zmianie nazw)
Zmiana jest nadal niskiego ryzyka, ale wymaga **konsekwentnego przeniesienia literalnych nazw** w całym module. Najważniejsze punkty krytyczne to:
- `CHARACTER_CREATION_SHEETS` z nazwą `Specjalne Bonusy Frakcji`,
- selektory CSS `data-sheet="Specjalne Bonusy Frakcji"`,
- pełny rename `Bonusy Frakcji` → `Premie Frakcji` we wszystkich odwołaniach.

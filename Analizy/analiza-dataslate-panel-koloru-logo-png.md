# Data analizy
2026-05-28

# Temat analizy
Weryfikacja plików PNG w `Infoczytnik/Draft/Loga` pod kątem jednokolorowości oraz rekomendacja rozwiązania dla panelu koloru logo w module DataSlate (Infoczytnik).

# Oryginalny pełny prompt użytkownika
Przeczytaj i zaktualizuj analizę Analizy/analiza-dataslate-panel-koloru-logo-png.md
Sprawdź wszystkie pliki w lokalizacji Infoczytnik/Draft/Loga/ i zarekomenduj odpowiednie rozwiązanie dla tych plików. Wydaje mi się, że wszystkie są jednokolorowe.

# Zakres analizy
1. Odczyt dotychczasowej treści analizy `Analizy/analiza-dataslate-panel-koloru-logo-png.md`.
2. Sprawdzenie wszystkich plików PNG w `Infoczytnik/Draft/Loga/`.
3. Techniczna weryfikacja, czy pliki są faktycznie jednokolorowe (z pominięciem przezroczystości alpha).
4. Rekomendacja wdrożenia panelu koloru logo dla obecnego zestawu plików.

# Metodyka weryfikacji
- Ze względu na brak bibliotek obrazowych (`PIL`, `opencv`, `imageio`) i brak narzędzia `identify`, wykonano analizę PNG własnym skryptem Python opartym o:
  - dekodowanie chunków PNG (`IHDR`, `PLTE`, `tRNS`, `IDAT`),
  - dekompresję IDAT,
  - rekonstrukcję scanline z filtrami PNG,
  - zliczenie unikalnych kolorów RGB tylko dla pikseli nieprzezroczystych (alpha > 0).

# Wyniki sprawdzenia plików `Infoczytnik/Draft/Loga`
## Klasyfikacja plików

### A) Pliki praktycznie jednokolorowe (bez gradientów)
- `Apothecary.png` — 1 kolor
- `Aquila.png` — 1 kolor
- `Astra_Militarum.png` — 1 kolor
- `Mechanicus.png` — 1 kolor
- `Slaanesh.png` — 1 kolor

### B) Pliki prawie jednokolorowe (niewielkie odchylenia odcienia)
- `Nurgle.png` — 2 kolory
- `Khorne.png` — 6 kolorów

### C) Pliki wieloodcieniowe / gradientowe (nie są jednokolorowe)
- `Administratum.png` — 224 kolory
- `Chaos.png` — 184 kolory
- `Inquisition.png` — 29 kolorów
- `Medicae.png` — 22 kolory
- `Navigator.png` — 291 kolorów
- `Sororitas.png` — 68 kolorów
- `Tzeentch.png` — 122 kolory

## Wniosek do hipotezy użytkownika
Hipoteza „wydaje mi się, że wszystkie są jednokolorowe” jest **częściowo nieprawdziwa**.
Tylko część plików jest stricte jednokolorowa, a istotna część zestawu zawiera wiele odcieni/gradientów.

# Rekomendowane rozwiązanie
## Rekomendacja główna (najbezpieczniejsza jakościowo)
Wprowadzić w manifeście logo atrybut trybu kolorowania, np.:
- `logoMode: mono` — logo może być kolorowane pickerem 1:1,
- `logoMode: gradient` (lub `fullcolor`) — logo pozostaje w oryginale albo korzysta z osobnej ścieżki kolorowania.

Następnie:
1. Dla `mono` użyć kolorowania przez canvas (tintowanie maski alpha) i przesyłać `logoColor` w payloadzie.
2. Dla `gradient/fullcolor`:
   - albo wyłączyć picker koloru,
   - albo pokazywać ostrzeżenie „kolorowanie może zmienić charakter logo”,
   - albo dostarczyć osobne, ręcznie przygotowane wersje kolorystyczne.

## Rekomendacja alternatywna (szybkie wdrożenie)
Uruchomić picker koloru dla wszystkich logo, ale:
- oznaczyć w UI, że wynik dla logo wieloodcieniowych będzie przybliżony,
- dodać przełącznik „Użyj oryginalnych barw logo”.

# Proponowany podział obecnych plików dla manifestu
## `logoMode: mono`
- Apothecary
- Aquila
- Astra_Militarum
- Mechanicus
- Slaanesh
- (opcjonalnie po testach) Nurgle
- (opcjonalnie po testach) Khorne

## `logoMode: gradient/fullcolor`
- Administratum
- Chaos
- Inquisition
- Medicae
- Navigator
- Sororitas
- Tzeentch

# Ryzyka
1. Wymuszone kolorowanie gradientowych logo może pogorszyć czytelność i estetykę.
2. Brak jawnego `logoMode` zwiększa ryzyko niejednolitego UX (część logo wygląda dobrze, część źle).
3. Jeśli logo będą ładowane z innej domeny bez poprawnego CORS, canvas może zostać „tainted”, co utrudni generowanie DataURL.

# Następne kroki
1. Dodać pole `logoMode` do źródła danych (docelowo `DataSlate_manifest.xlsx`).
2. Dla plików `mono` wdrożyć panel koloru identyczny UX-owo jak dla fontu.
3. Dla `gradient/fullcolor` pozostawić oryginał lub przygotować dedykowane warianty kolorystyczne.
4. Po migracji plików do `Infoczytnik/assets/logos` powtórzyć automatyczną walidację liczby kolorów, aby potwierdzić klasyfikację.

# Weryfikacja poprawki: auto-`+++` w imporcie XLSX -> JSON (Infoczytnik)

## Prompt użytkownika
> Sprawdź czy poprawka została prawidłowo wprowadzona. Przygotuj nowy plik z analizą co zostało zrobione i jak to powinno teraz działać.

## Zakres weryfikacji
Sprawdzono trzy elementy:
1. Kod importera w `Infoczytnik/GM_test.html`.
2. Dane runtime w `Infoczytnik/assets/data/data.json`.
3. Spójność cache-bustingu wersji (`INF_VERSION`) między `GM_test.html` i `Infoczytnik_test.html`.

## Co zostało wprowadzone

### 1) Importer XLSX -> JSON dodaje teraz `+++ ... +++`
W `GM_test.html` dodano funkcje:
- `formatFillerLine(line)`
- `formatFillerLines(lines)`

Następnie podczas mapowania arkusza `fillers` w `buildManifestFromWorkbook(...)` pola:
- `prefixes`
- `suffixes`

są przepuszczane przez `formatFillerLines(...)`.

Efekt: linie importowane z XLSX (zapisane jako „czysty tekst”) są automatycznie konwertowane do formatu:
- `+++ TEKST +++`

### 2) Zabezpieczenie przed podwójnym dodaniem plusów
`formatFillerLine(...)` najpierw sprawdza, czy linia już pasuje do formatu `+++ ... +++` (wariant ze spacjami po lewej i prawej), i jeśli tak, zwraca ją bez zmian.

Efekt: importer nie dubluje plusów dla standardowo zapisanych wpisów już ozdobionych.

### 3) `data.json` został zregenerowany i zawiera plusy
W `Infoczytnik/assets/data/data.json` rekordy `fillers.prefixes` i `fillers.suffixes` są już zapisane z `+++ ... +++`.

Efekt: aplikacja działa poprawnie już na samym aktualnym runtime manifeście, nawet bez ponownego importu.

### 4) Podniesiono `INF_VERSION`
W obu plikach testowych (`GM_test.html`, `Infoczytnik_test.html`) wersja cache-bustingu została podniesiona do tej samej wartości.

Efekt: po wdrożeniu przeglądarka pobiera aktualne pliki i nie trzyma starej logiki z cache.

## Jak to powinno teraz działać (docelowy przepływ)
1. Użytkownik klika w panelu GM: **Aktualizuj dane z XLSX**.
2. `GM_test.html` pobiera `assets/data/DataSlate_manifest.xlsx`.
3. Arkusz `fillers` jest mapowany do struktury runtime.
4. Każda linia `prefixes/suffixes` jest normalizowana do `+++ TEKST +++` (jeśli nie była już w tym formacie).
5. Generowany jest nowy `data.json` do podmiany.
6. Po podmianie pliku i odświeżeniu stron GM/Infoczytnik, preview i ekran gracza wyświetlają prefix/suffix z plusami.

## Wniosek
Poprawka została wdrożona prawidłowo i realizuje wymaganie: automatyczne dodawanie `+++` na etapie importu XLSX -> JSON, z jednoczesnym zasileniem aplikacji nowym `data.json`.

## Dodatkowa uwaga techniczna (edge case)
Obecna detekcja „już sformatowane” zakłada wariant ze spacjami (`+++ TEKST +++`). Jeśli w XLSX ktoś wpisze niestandardowo np. `+++TEKST+++` (bez spacji), importer potraktuje to jako niesformatowane i doda własne opakowanie. To nie blokuje działania, ale warto trzymać jednolity zapis ze spacjami.

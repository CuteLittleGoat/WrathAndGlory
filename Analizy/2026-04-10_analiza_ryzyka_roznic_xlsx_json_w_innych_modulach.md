# Analiza: ryzyko podobnych rozjazdów XLSX -> `data.json` w innych modułach (2026-04-10)

## Prompt użytkownika (oryginalny)
> Przeczytaj Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md i przygotuj nową analizę. W innych modułach aplikacji też jest podobny mechanizm dotyczący zaciągania danych z pliku xlsx i zmiany go na data.json.
> Sprawdź czy problem opisany jak w analizie też może tam wystąpić.

---

## Zakres tej analizy

Celem było sprawdzenie, czy **ten sam typ problemu**, który wystąpił wcześniej w DataVault (rozjazd UI vs AI przy parsowaniu stylów XLSX, szczególnie czerwonego koloru), może pojawić się w innych modułach, gdzie istnieje mechanizm XLSX -> JSON.

---

## Moduły i mechanizmy zidentyfikowane w repo

## 1) DataVault
- Obecnie posiada kanoniczny parser przeglądarkowy `xlsxCanonicalParser.js`, który czyta bezpośrednio XML-e XLSX (`styles.xml`, `sharedStrings.xml`, `sheet*.xml`) i odwzorowuje logikę generatora referencyjnego.
- Detekcja czerwieni jest realizowana na podstawie `styles.xml` (`fontId`/`xf`) oraz rich-text runów, a następnie dodawane są markery `{{RED}}`, `{{B}}`, `{{I}}`.

**Wniosek:**
- Ten moduł jest już zaprojektowany dokładnie pod problem z wcześniejszej analizy i ma mechanizm ograniczający rozjazdy względem AI/CLI.

## 2) Infoczytnik (GM / GM_test)
- Istnieje przycisk **„Aktualizuj dane z XLSX”**, który pobiera `assets/data/DataSlate_manifest.xlsx`, parsuje go w przeglądarce przez `XLSX.utils.sheet_to_json`, buduje manifest i pobiera `data.json`.
- Parser bazuje na **wartościach komórek i nagłówkach**; nie analizuje `styles.xml`, formatowania rich-text, ani stylów komórki jako nośnika znaczenia.

**Wniosek:**
- Mechanizm XLSX -> `data.json` jest podobny architektonicznie (klientowy import + download), ale semantyka danych jest inna niż w DataVault.

## 3) Audio
- Moduł ładuje `AudioManifest.xlsx` przez SheetJS (`sheet_to_json`), ale używa tych danych runtime do listy sampli.
- Nie generuje własnego `data.json` z tego importu.

**Wniosek:**
- To nie jest ten sam flow co „wygeneruj `data.json` do publikacji”, więc nie jest bezpośrednim odpowiednikiem problemu z DataVault.

---

## Czy problem „jak w DataVault” może wystąpić też w innych modułach?

## Krótka odpowiedź
**Tak, ale warunkowo.**

- **Wprost (1:1)** — obecnie najbardziej realnie tylko tam, gdzie wynik zależy od informacji o stylach XLSX (kolory/fonty/rich text), a parser używa jedynie `sheet_to_json` bez czytania XML stylów.
- **W obecnym stanie Infoczytnika** — ryzyko identycznego błędu jak z `{{RED}}` jest **niskie**, bo aktualna transformacja nie opiera znaczenia biznesowego na kolorze/stylu komórek.

## Co może pójść źle w Infoczytniku (analogiczny mechanizm błędu)

Choć dziś nie ma markerów typu `{{RED}}`, analogiczny rozjazd może wystąpić, jeśli pojawi się choć jedna z poniższych zmian:

1. **Dodanie semantyki opartej o styl komórki**
   - np. „czerwony w XLSX oznacza flagę specjalną”, „bold oznacza priorytet”, itp.
   - `sheet_to_json` nie gwarantuje pełnej informacji o stylach, więc UI-generator może utracić znaczenie.

2. **Równoległe ścieżki generacji (UI vs skrypt offline/AI)**
   - jeśli powstanie drugi generator dla tego samego manifestu (np. Python/Node w CI), łatwo o rozjazdy normalizacji danych (whitespace, cudzysłowy, kolejność, fallbacki).

3. **Rosnąca złożoność mapowania pól**
   - obecny import ma aliasy nazw kolumn i fallbacki; przy większej liczbie wyjątków mogą powstać subtelne różnice między różnymi implementacjami parsera.

---

## Ocena ryzyka per moduł

- **DataVault:** niskie/umiarkowane (mechanizm kanoniczny istnieje, ale warto stale testować parytet).
- **Infoczytnik:** umiarkowane na przyszłość (aktualnie niskie dla case „kolor czerwony”, ale potencjał wzrostu ryzyka przy zmianach wymagań).
- **Audio:** niskie dla tematu „XLSX -> `data.json`”, bo moduł nie publikuje własnego `data.json` z importu.

---

## Rekomendacje prewencyjne (żeby nie powtórzyć historii z DataVault)

1. **Jedna kanoniczna specyfikacja transformacji XLSX -> JSON**
   - trzymać jawny dokument kontraktu pól i normalizacji dla każdego modułu, który eksportuje `data.json`.

2. **Testy kontraktowe (golden file)**
   - dla Infoczytnika dodać porównanie: ten sam `DataSlate_manifest.xlsx` -> expected `data.json`.
   - test powinien łapać zmiany mapowania kolumn, brakujące pola, modyfikacje formatowania prefiksów/sufiksów.

3. **Brak semantyki biznesowej w stylach XLSX (o ile to możliwe)**
   - znaczenia trzymać w jawnych kolumnach (np. `isSpecial=TRUE`), nie w kolorach/fontach.

4. **Jeśli semantyka stylów będzie wymagana**
   - od razu przejść na parser kanoniczny czytający XML XLSX (jak w DataVault), zamiast polegać na samym `sheet_to_json`.

5. **Checklist release przy imporcie XLSX**
   - liczność rekordów,
   - kompletność wymaganych pól,
   - stabilność kluczy/ID,
   - diff semantyczny JSON względem baseline.

---

## Odpowiedź końcowa na pytanie użytkownika

Problem opisany w analizie DataVault (**rozjazd wynikający z różnego odczytu stylów XLSX między ścieżkami generacji**) **może wystąpić także w innych modułach**, jeżeli:
- pojawi się znaczenie danych zapisane w stylach komórek,
- albo pojawią się równoległe, niespójne implementacje generatora.

W **aktualnym stanie repo** najbardziej podobny mechanizm XLSX -> `data.json` poza DataVault ma **Infoczytnik**; tam dziś ryzyko identycznego błędu z `{{RED}}` jest niskie, ale architektonicznie to miejsce, gdzie taki problem może pojawić się przy dalszym rozwoju importera.


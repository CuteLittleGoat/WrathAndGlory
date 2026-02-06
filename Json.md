# Generowanie data.json z pliku XLSX (DataVault)

Poniżej znajduje się opis działania skryptu `build_json.py`, który konwertuje arkusz `Repozytorium.xlsx` do pliku `data.json`. Opis skupia się wyłącznie na logice konwersji danych i strukturze wyjścia, bez zasad specjalnego formatowania.

## Cel i wejście

- **Wejście:** plik XLSX (domyślnie `Repozytorium.xlsx`).
- **Wyjście:** `data.json` z:
  - `sheets`: dane z arkuszy XLSX,
  - `_meta`: dodatkowe metadane (kolejność arkuszy i kolumn, słowniki cech i stanów).

Skrypt działa bez zewnętrznych zależności, czyta plik XLSX bezpośrednio jako archiwum ZIP i parsuje XML.

## Wywołanie

```bash
python build_json.py Repozytorium.xlsx data.json
```

Jeśli nie podasz parametrów, używane są wartości domyślne:
- `Repozytorium.xlsx` jako wejście,
- `data.json` jako wyjście.

## Najważniejsze etapy działania

1. **Wczytanie XLSX (minimalny loader):**
   - Skrypt otwiera XLSX jako ZIP.
   - Czyta `workbook.xml`, aby uzyskać listę arkuszy i ich kolejność.
   - Dla każdego arkusza odnajduje odpowiadający plik XML i buduje tabelę wierszy/kolumn.

2. **Normalizacja wartości tekstowych:**
   - Usuwane są nadmiarowe białe znaki (wielokrotne spacje, tabulatory, nowe linie → pojedyncza spacja).
   - Tekst jest przycinany (`strip`).
   - Polskie cudzysłowy „ ” są zamieniane na standardowy znak `"`.

3. **Konwersja wierszy do rekordów:**
   - Pierwszy wiersz arkusza jest traktowany jako nagłówki kolumn.
   - Każdy kolejny wiersz jest mapowany do słownika `nagłówek -> wartość`.
   - Puste wiersze są pomijane.

4. **Wyznaczanie kolejności kolumn (`_meta.columnOrder`):**
   - Kolejność jest zapisywana osobno dla każdego arkusza.
   - Skrypt usuwa z kolejności nagłówek `Lp`.
   - Kolumny `Zasięg 1..3` są łączone w jedną pozycję `Zasięg`.
   - Kolumny `Cecha 1..N` są łączone w jedną pozycję `Cechy`.

5. **Scalanie kolumn w danych:**
   - **Arkusz „Bronie”:**
     - `Zasięg 1..3` → `Zasięg` (format: `v1 / v2 / v3`, puste wartości zastępowane `-`).
     - `Cecha 1..N` → `Cechy` (łączone średnikiem `; `, gdy brak → `-`).
   - **Arkusz „Pancerze”:**
     - `Cecha 1..N` → `Cechy`.
   - Pozostałe arkusze są przepisywane bez dodatkowych transformacji.

6. **Budowanie metadanych:**
   - `_meta.sheetOrder`: kolejność arkuszy zgodna z XLSX.
   - `_meta.columnOrder`: kolejność kolumn wyliczona z nagłówków arkuszy.
   - `_meta.traits`: słownik `Nazwa -> Opis` z arkusza **Cechy**.
   - `_meta.states`: słownik `Nazwa -> Opis/Efekt` z arkusza **Stany** (priorytet: `Opis`, potem `Efekt`).

7. **Zapis JSON:**
   - Wynik jest zapisywany jako czytelny JSON (`indent=2`, UTF-8, bez uciekania znaków diakrytycznych).

## Struktura wyjściowego JSON

```json
{
  "sheets": {
    "NazwaArkusza": [
      {"KolumnaA": "...", "KolumnaB": "..."}
    ]
  },
  "_meta": {
    "traits": {"NazwaCechy": "Opis"},
    "states": {"NazwaStanu": "Opis"},
    "sheetOrder": ["Arkusz1", "Arkusz2"],
    "columnOrder": {
      "Arkusz1": ["KolumnaA", "KolumnaB"],
      "Arkusz2": ["KolumnaX", "KolumnaY"]
    }
  }
}
```

## Uwagi implementacyjne (istotne dla przeniesienia do innego projektu)

- Skrypt nie zależy od `openpyxl` ani innych bibliotek – parsuje XML bezpośrednio z XLSX.
- Kolejność kolumn w `_meta.columnOrder` pochodzi z nagłówków po zastosowaniu reguł scalania (`Zasięg`, `Cechy`).
- Wartości puste są normalizowane do pustych stringów albo `-` w przypadku scalonych pól zasięgu/cech.
- Każdy arkusz w XLSX staje się osobnym wpisem w `sheets`.

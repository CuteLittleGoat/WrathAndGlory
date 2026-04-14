# Analiza DataVault — aktualizacja Kolumny.md

## Prompt użytkownika
"Sprawdź cały kod modułu DataVault i zaktualizuj plik Kolumny.md"

## Zakres analizy
Przejrzano pliki modułu DataVault:
- `DataVault/app.js`
- `DataVault/style.css`
- `DataVault/data.json`
- `DataVault/xlsxCanonicalParser.js`
- `DataVault/build_json.py`

## Wnioski
1. Kolumny i ich kolejność w UI pochodzą z `data.json` (`_meta.sheetOrder` i `_meta.columnOrder`) z fallbackiem do kluczy rekordów.
2. Kolumna `LP` jest ukrywana w interfejsie, więc nie powinna być pokazywana w `Kolumny.md` jako kolumna danych użytkownika.
3. W module istnieje automatyczne scalanie kolumn:
   - `Cecha 1..N` → `Cechy`
   - `Zasięg 1..3` → `Zasięg`
4. W poprzedniej wersji `Kolumny.md` były rozbieżności względem aktualnego stanu danych (m.in. nieaktualne zakładki i brak części kolumn obecnych w `data.json`).
5. Zaktualizowano `Kolumny.md` tak, aby odpowiadał aktualnej strukturze danych i regułom CSS.

## Wynik
Plik `Kolumny.md` został zaktualizowany na podstawie bieżącego kodu i danych modułu DataVault.

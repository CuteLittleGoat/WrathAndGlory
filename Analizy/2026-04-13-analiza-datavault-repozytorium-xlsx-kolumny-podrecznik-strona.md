# Analiza wpływu zmian w `Repozytorium.xlsx` na moduł DataVault

Data analizy: 2026-04-13

## Prompt użytkownika (oryginalny)
"Przeprowadź mi analizę modułu DataVault. Planuję przygotować nowy plik Repozytorium.xlsx w którym w niektórych zakładkach dodam kolumny \"Podręcznik\" i \"Strona\". W innych zmieniłem kolejność zakładek, żeby \"Podręcznik\" i \"Strona\" były ostatnie. Czy mogą pojawić się jakieś błędy w module jak wgram nowy plik?"

## Zakres sprawdzenia
Przeanalizowano sposób generowania i ładowania `data.json` w DataVault:
- `DataVault/xlsxCanonicalParser.js`
- `DataVault/app.js`
- `DataVault/build_json.py`

## Wnioski (skrót)
1. **Dodanie kolumn `Podręcznik` i `Strona` nie powinno powodować błędów krytycznych** (crash aplikacji), bo parser i UI działają na nazwach kolumn, nie na sztywnych indeksach.
2. **Zmiana kolejności kolumn (żeby `Podręcznik` i `Strona` były na końcu) jest wspierana**: kolejność jest zapisywana do `_meta.columnOrder` i używana przy renderze tabeli.
3. **Zmiana kolejności arkuszy (zakładek Excela) jest wspierana**: kolejność trafia do `_meta.sheetOrder` i DataVault odtwarza ją jako kolejność tabów.
4. Potencjalne ryzyka są raczej **jakościowe/wizualne**, nie „blokujące”:
   - brak dopasowanych reguł CSS szerokości/justowania dla nowych kolumn w konkretnych arkuszach,
   - literówki/niespójności nazw (`Podręcznik` vs `Podrecznik`, `Strona` z odstępami itp.),
   - ewentualne ukrycie arkuszy przez przełączniki logiki gracza/admina (to zależy od nazwy arkusza, nie od pozycji).

## Dlaczego tak (technicznie)
- Parser XLSX buduje nagłówki z pierwszego wiersza i mapuje komórki do rekordów po **nazwie nagłówka**.
- Kolejność arkuszy jest brana z `workbook.xml` i zapisywana do `sheetOrder`.
- Kolejność kolumn jest wyliczana z nagłówka i zapisywana do `columnOrder`.
- UI (`app.js`) przy renderze bierze `_meta.columnOrder[sheetName]` i dokleja brakujące kolumny, więc nowe pola są obsługiwane dynamicznie.

## Co może realnie pójść nie tak
1. **Niespójna nazwa kolumny**
   - Jeżeli wpiszesz np. `Strona ` (spacja na końcu) albo `Podrecznik` (bez ę), parser potraktuje to jako inną kolumnę.
2. **Nagłówek nie w 1. wierszu**
   - Generator zakłada, że pierwszy wiersz arkusza to nagłówki.
3. **Usunięcie lub zmiana nazw kolumn specjalnych**
   - Dla `Bronie` i `Pancerze` działa specjalne scalanie (`Cecha 1..N` → `Cechy`, `Zasięg 1..3` → `Zasięg`). Zmiana tych nazw może zmienić wynik.
4. **Styling tabel**
   - Część szerokości kolumn jest ustawiona selektorami CSS po `data-col`. Nowe kolumny bez dedykowanych reguł dostaną styl domyślny.

## Ocena ryzyka dla Twojego scenariusza
Dla samej zmiany opisanej w promptcie (dodanie `Podręcznik` i `Strona`, ustawianie ich na końcu, zmiana kolejności zakładek):
- **Ryzyko błędu krytycznego: niskie**
- **Ryzyko różnic wizualnych/porządkowych: średnie** (zależne od jakości nagłówków i układu CSS)

## Zalecana checklista przed wdrożeniem
1. Upewnij się, że nagłówki to dokładnie: `Podręcznik`, `Strona` (bez dodatkowych spacji/znaków).
2. Pozostaw nagłówki w pierwszym wierszu każdego arkusza.
3. Wygeneruj nowy `data.json` przez przycisk **Generuj data.json** w DataVault (admin) albo `python build_json.py Repozytorium.xlsx data.json`.
4. Otwórz kilka kluczowych arkuszy i sprawdź:
   - czy nowe kolumny są widoczne,
   - czy są na końcu,
   - czy filtry/sortowanie działają,
   - czy nie ma problemów z szerokością kolumn.
5. Dodatkowo sprawdź `Bronie` i `Pancerze` (obszary ze specjalną transformacją).

## Konkluzja
Przy poprawnych nagłówkach i zachowaniu struktury arkusza DataVault powinien poprawnie przyjąć nowy `Repozytorium.xlsx`. Najbardziej prawdopodobne problemy to kosmetyka UI i niespójne nazwy kolumn, a nie awaria logiki aplikacji.

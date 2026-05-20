# Data analizy
2026-05-20

# Temat analizy
Audyt wszystkich plików `docs/README.md` i `docs/Documentation.md` pod kątem poprawności numeracji oraz formatowania.

# Oryginalny pełny prompt użytkownika
Przeprowadź analizę wszystkich pliki "Documentation.md" i "README.md". Sprawdź czy wszędzie jest poprawna numeracja i formatowanie.

# Zakres analizy
- Przeanalizowano wszystkie pliki `README.md` i `Documentation.md` w modułach repozytorium.
- Sprawdzono:
  - ciągłość numeracji list numerowanych,
  - podstawowe elementy formatowania Markdown (m.in. trailing spaces, tabulatory),
  - miejsca wymagające korekty numeracji.

## Lista sprawdzonych plików
- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`
- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Main/docs/README.md`
- `Main/docs/Documentation.md`

# Wnioski
## 1) Numeracja — wykryte błędy

### `GeneratorNPC/docs/README.md`
Wykryto dwa miejsca, w których lista jest przerwana (przejście z `1.` od razu na `3.`):
- sekcja PL „Jak zacząć” (linia 9-10),
- sekcja EN „Getting started” (linia 97-98).

### `Main/docs/Documentation.md`
W sekcji „9. Odtworzenie modułu 1:1” występuje pominięcie punktu `5.`:
- lista ma ciąg: `1, 2, 3, 4, 6, 7` (linie 73-78).

## 2) Numeracja — brak problemów
W pozostałych analizowanych plikach listy numerowane są spójne.

## 3) Formatowanie Markdown
Nie wykryto problemów technicznych typu:
- trailing spaces,
- tabulatory łamiące format list.

Podstawowe formatowanie Markdown jest poprawne we wszystkich sprawdzonych plikach.

# Rekomendacje
1. Poprawić numerację w `GeneratorNPC/docs/README.md`:
   - `3.` → `2.` w sekcji PL,
   - `3.` → `2.` w sekcji EN.
2. Poprawić numerację w `Main/docs/Documentation.md`:
   - `6.` → `5.`,
   - `7.` → `6.` (lub dopisać brakujący punkt 5, jeżeli celowo pominięty).
3. Po korekcie uruchomić ponowny szybki audyt automatyczny list numerowanych.

# Ryzyka
- Błędy numeracji nie wpływają na działanie aplikacji, ale pogarszają czytelność dokumentacji i mogą wprowadzać użytkownika/programistę w błąd co do kompletności procedur.

# Ewentualne następne kroki
- Wykonać poprawki bez zmiany treści merytorycznej.
- Dodać prosty skrypt walidujący numerację list do rutynowej kontroli dokumentacji.


## Zmiany wykonane w kodzie

### Plik: `GeneratorNPC/docs/README.md`

Lokalizacja: sekcja „Jak zacząć” (PL) i sekcja „Getting started” (EN).

Było:

```markdown
1. Otwórz `GeneratorNPC/index.html`.
3. Poczekaj, aż sekcja **Źródło danych** pokaże, że dane zostały załadowane.
```

```markdown
1. Open `GeneratorNPC/index.html`.
3. Wait until **Data source** confirms the data is loaded.
```

Jest:

```markdown
1. Otwórz `GeneratorNPC/index.html`.
2. Poczekaj, aż sekcja **Źródło danych** pokaże, że dane zostały załadowane.
```

```markdown
1. Open `GeneratorNPC/index.html`.
2. Wait until **Data source** confirms the data is loaded.
```

### Plik: `Main/docs/Documentation.md`

Lokalizacja: sekcja „9. Odtworzenie modułu 1:1”.

Było:

```markdown
1. ...
2. ...
3. ...
4. ...
6. Podłącz `manifest.webmanifest` tylko wtedy, gdy jest potrzebny do metadanych instalacyjnych hostingu.
7. Nie rejestruj Service Workera; zachowaj jedynie mechanizm czyszczenia starych rejestracji w `Main/index.html`.
```

Jest:

```markdown
1. ...
2. ...
3. ...
4. ...
5. Podłącz `manifest.webmanifest` tylko wtedy, gdy jest potrzebny do metadanych instalacyjnych hostingu.
6. Nie rejestruj Service Workera; zachowaj jedynie mechanizm czyszczenia starych rejestracji w `Main/index.html`.
```

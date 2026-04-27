# Analiza rozbudowy: `GeneratorNPC` — obsługa 5. kolumny „Poziom” na karcie wygenerowanej przez „Generuj kartę”

## Prompt użytkownika
> Przeprowadź analizę rozbudowy GeneratorNPC
>
> Obecnie przy użyciu przycisku "Generuj Kartę" na wygenerowanej karcie potwora tworzą się cztery kolumny "Poziom". 1, 2, 3 i 4.
>
> Obecnie w pliku wsadowym jest przynajmniej jeden potwór (Karnifeks, LP=65) ma piąty poziom zagrożenia.
> W polu "Zagrożenie" ma pięć wartości. PPPPP.
>
> W przyszłości będzie więcej wpisów mających pięć wartości.
>
> Przeprowadź analizę rozbudowy modułu, żeby generował karty mające pięć kolumn "Poziom". 1, 2, 3, 4 i 5.
> Jeżeli jakiś potwór nie ma tyle liter w kolumnie "Zagrożenie", żeby uzupełnić pięć kolumn to piąta kolumna pozostanie pusta.
> Podobnie teraz to działa jak w kolumnie "Zagrożenie" jest "?", np. Psychneuein (LP=66). W przypadku tego potwora znak "?" dopisuje się do kolumny "1" a kolumny "2", "3", "4" i "5" są puste = to akceptowalne rozwiązanie.

---

## 1) Stan obecny (diagnoza)

W `GeneratorNPC/index.html` (skrypt osadzony inline) logika budowy wydruku karty tworzy na stałe układ 4-poziomowy:

1. Parsowanie pola `Zagrożenie` jest obcięte do 4 znaków (`slice(0, 4)`).
2. Uzupełnianie pustych komórek również kończy się na długości 4 (`while (...) < 4`).
3. W HTML karty wiersz „Poziom” ma na stałe kolumny `1, 2, 3, 4`.
4. CSS dla tego wiersza (`.row`) używa siatki `grid-template-columns: 140px repeat(4, 1fr)`.

Wniosek: nawet jeśli rekord ma 5 znaków w `Zagrożenie` (np. `PPPPP`), piąty znak nigdy nie jest renderowany.

---

## 2) Potwierdzenie danych wejściowych (DataVault)

W `DataVault/data.json`:

- `LP = 65`, `Nazwa = Karnifeks`, `Zagrożenie = PPPPP` (5 wartości) — rekord już dziś wymaga 5 kolumn.
- `LP = 66`, `Nazwa = Psychneuein`, `Zagrożenie = ?` — przypadek 1-znakowy, gdzie pozostałe kolumny mają zostać puste.

To oznacza, że wymaganie nie jest hipotetyczne — obecny dataset już zawiera przypadek graniczny, który jest ucinany.

---

## 3) Proponowany zakres rozbudowy (minimalny i bezpieczny)

### 3.1. Zasada biznesowa po zmianie

Docelowo karta ma zawsze 5 kolumn poziomu:
- nagłówek: `1, 2, 3, 4, 5`,
- wiersz `Zagrożenie`: znaki wchodzą sekwencyjnie od kolumny 1,
- jeśli znaków jest mniej niż 5, brakujące komórki są puste,
- jeśli wartość to `?`, znak trafia do kolumny 1, a 2–5 są puste,
- jeśli znaków jest więcej niż 5 (potencjalnie przyszłościowo), nadmiar jest ignorowany (ucięcie do 5).

### 3.2. Zakres zmian kodu

Do wdrożenia wystarczy zmiana w jednym module (`GeneratorNPC/index.html`, część `<script type="module">` i lokalny `<style>` generowanego okna):

1. Zmiana limitu parsowania zagrożenia z 4 na 5.
2. Zmiana pętli dopełniającej z 4 na 5.
3. Rozszerzenie nagłówka poziomów o `5`.
4. Zmiana definicji siatki CSS `.row` z `repeat(4, 1fr)` na `repeat(5, 1fr)`.

Brak konieczności zmian:
- w `DataVault/data.json`,
- w Firebase,
- w logice modułów dodatkowych (broń/pancerz/itd.),
- w tłumaczeniach i etykietach i18n.

---

## 4) Propozycja implementacyjna (dokładnie)

### 4.1. Parametryzacja liczby poziomów

Aby uniknąć kolejnych „sztywnych” poprawek, rekomendowane jest wprowadzenie stałej:

- `const CARD_LEVEL_COLUMNS = 5;`

i użycie jej we wszystkich miejscach związanych z poziomami.

Korzyść: gdyby w przyszłości zaszła potrzeba 6 kolumn, zmiana będzie jednolinijkowa.

### 4.2. Algorytm mapowania pola „Zagrożenie”

Rekomendowany przepływ:

1. Pobierz `threatRaw` jako string.
2. Spróbuj wyciągnąć litery regexem (jak obecnie, bo to czyści niektóre znaki formatujące).
3. Jeśli regex nic nie zwraca, użyj fallbacku `split("")` (to zachowuje `?`).
4. Obetnij do `CARD_LEVEL_COLUMNS`.
5. Dopełnij pustymi stringami do `CARD_LEVEL_COLUMNS`.

Tym sposobem:
- `PPPPP` -> `P | P | P | P | P`,
- `ETTT` -> `E | T | T | T | (puste)`,
- `?` -> `? | (puste) | (puste) | (puste) | (puste)`.

### 4.3. Generowanie wiersza „Poziom”

Zamiast twardo wpisanych wartości `1..4`, rekomendowana wersja dynamiczna:

- generować tablicę numerów `1..CARD_LEVEL_COLUMNS`,
- renderować `.map(...)` analogicznie jak przy `threatLetters`.

Dzięki temu unikamy ręcznego rozjechania ilości komórek między wierszami.

### 4.4. CSS

W lokalnym stylu karty (`buildPrintableCardHTML`) należy zsynchronizować grid:

- `.row { grid-template-columns: 140px repeat(5, 1fr); }`

To jedyna wymagana zmiana layoutu dla nowej kolumny.

---

## 5) Wpływ na obecne przypadki

1. **Karnifeks (LP=65, `PPPPP`)**
   - obecnie: karta pokazuje tylko 4x `P`,
   - po zmianie: karta pokaże poprawnie 5x `P`.

2. **Psychneuein (LP=66, `?`)**
   - obecnie: `?` w kolumnie 1, kolumny 2–4 puste,
   - po zmianie: `?` w kolumnie 1, kolumny 2–5 puste (zgodnie z wymaganiem).

3. **Wpisy 4-znakowe (najczęstsze dziś)**
   - po zmianie: zachowują się poprawnie, po prostu 5. kolumna będzie pusta.

4. **Wpisy puste / brak pola**
   - po zmianie: wszystkie 5 komórek puste (bez regresji funkcjonalnej).

---

## 6) Ryzyka i kontrola jakości

### 6.1. Ryzyka

- **R1: rozjazd liczby komórek między „Poziom” i „Zagrożenie”**
  - Mitigacja: wspólna stała `CARD_LEVEL_COLUMNS` + dynamiczne generowanie obu wierszy.

- **R2: złamanie szerokości wydruku**
  - Mitigacja: szybki test wydruku A4 i podglądu w nowym oknie; siatka nadal mieści się w `min(760px, 95vw)`.

- **R3: nietypowe znaki w `Zagrożenie`**
  - Mitigacja: zostawić obecny fallback `split("")`, który poprawnie przenosi znaki typu `?`.

### 6.2. Testy akceptacyjne po wdrożeniu

1. Wygenerować kartę dla `LP 65 Karnifeks` -> oczekiwane `P P P P P`.
2. Wygenerować kartę dla `LP 66 Psychneuein` -> oczekiwane `? _ _ _ _`.
3. Wygenerować kartę dla rekordu z 4-literowym zagrożeniem -> oczekiwane `X X X X _`.
4. Wygenerować kartę dla rekordu z pustym zagrożeniem (jeśli występuje) -> oczekiwane `_ _ _ _ _`.
5. Sprawdzić podgląd wydruku i druk PDF (czy kolumny nie wychodzą poza ramkę).

---

## 7) Szacowany koszt i trudność

- **Trudność**: niska.
- **Zakres kodowy**: mały (1 plik).
- **Ryzyko regresji**: niskie (zmiana lokalna tylko dla sekcji „Poziom/Zagrożenie” w karcie drukowanej).
- **Czas implementacji + test ręczny**: krótki.

---

## 8) Rekomendacja końcowa

Rozbudowę należy wykonać od razu, ponieważ dane produkcyjne już zawierają przypadek 5-poziomowy (`Karnifeks`).

Najlepszy wariant to **parametryzacja liczby poziomów stałą (`CARD_LEVEL_COLUMNS = 5`)** i spięcie tej stałej z:

- parserem `Zagrożenie`,
- generacją nagłówka poziomów,
- dopełnianiem pustych komórek,
- gridem CSS w widoku karty.

Taki wariant realizuje dzisiejsze wymaganie 1:1 i minimalizuje koszt przyszłych rozszerzeń.

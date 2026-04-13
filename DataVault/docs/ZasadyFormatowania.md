# DataVault — Zasady formatowania tekstu (baza wiedzy do `Repozytorium.xlsx`)

## Cel dokumentu
Ten dokument opisuje **wszystkie reguły renderowania i interpretacji formatowania tekstu** używane w module DataVault, tak aby podczas tworzenia/aktualizacji `Repozytorium.xlsx` zachować zachowanie aplikacji 1:1.

---

## 1) Klasy i kolory używane przez silnik renderujący

### 1.1 Klasy odpowiedzialne za formatowanie inline
- `.inline-red` → kolor czerwony (`var(--red)` = `#d74b4b`).
- `.keyword-red` → kolor czerwony (`var(--red)` = `#d74b4b`) dla treści słów kluczowych.
- `.keyword-comma` → kolor podstawowy tekstu (`var(--text)`), używany do „neutralnych przecinków”.
- `.inline-bold` → pogrubienie (`font-weight: 700`).
- `.inline-italic` → kursywa (`font-style: italic`).
- `.ref` → jaśniejszy kolor referencji (`var(--code)`) z `opacity: .9`.
- `.caretref` → jaśniejszy kolor linii specjalnych (`var(--code)`) z `opacity: .95`.
- `.slash` → jaśniejszy kolor separatora „/” (`var(--code)`).

### 1.2 Paleta kolorów istotna dla formatowania treści
- Czerwony: `--red: #d74b4b`.
- Podstawowy tekst: `--text: #d7f5dc`.
- Jaśniejszy tekst/referencje: `--code: #d2fad2`.

---

## 2) Skąd bierze się formatowanie z `Repozytorium.xlsx`

### 2.1 Źródło rich text
Jeżeli komórka XLSX ma HTML (`cell.h`), parser konwertuje ją do znaczników wewnętrznych:
- kolor czerwony → `{{RED}}...{{/RED}}`,
- pogrubienie (`<b>`, `<strong>`) → `{{B}}...{{/B}}`,
- kursywa (`<i>`, `<em>`) → `{{I}}...{{/I}}`,
- `<br>` → nowa linia (`\n`).

### 2.2 Jak wykrywany jest czerwony kolor z XLSX
Za czerwony uznawane są wartości stylu `color`:
- `red`
- `#f00`
- `#ff0000`
- `#ffff0000`
- `rgb(255,0,0)`
- `rgba(255,0,0,1)`

Wniosek praktyczny dla `Repozytorium.xlsx`: jeśli red ma zostać zachowany po eksporcie/importcie, ustawiaj inline dokładnie któryś z powyższych wariantów.

---

## 3) Reguły „jaśniejszego fontu” (referencje i linie specjalne)

### 3.1 Referencje w nawiasach
Fragment tekstu wewnątrz nawiasów `(...)` otrzymuje klasę `.ref` (jaśniejszy kolor), jeżeli zawiera co najmniej jeden wzorzec:
- `str.`
- `str`
- `strona`

Wykrywanie jest niewrażliwe na wielkość liter.

Przykłady traktowane jako referencja:
- `(str. 123)`
- `(STR 123)`
- `(zob. strona 45)`

### 3.2 Linie zaczynające się od wzorca `*[cyfra]`
Każda linia pasująca do wzorca:
- `* [<liczba>] ...` (spacje opcjonalne),
otrzymuje klasę `.caretref`, czyli jaśniejszy wariant tekstu.

Ważne:
- Gwiazdka `*` i nawiasy kwadratowe pozostają widoczne.
- Reguła działa per linia (po podziale po `\n`).

---

## 4) Reguły czerwonego koloru dla „Słowa Kluczowe”

### 4.1 Domyślna reguła dla kolumn słów kluczowych
W komórkach renderowanych przez `formatKeywordHTML` cała treść otrzymuje `.keyword-red` (czyli jest czerwona), chyba że zadziała wyjątek dla przecinków.

### 4.2 Arkusze z neutralnym kolorem przecinka
W arkuszach:
- `Bestiariusz`
- `Archetypy`
- `Psionika`
- `Augumentacje`
- `Ekwipunek`
- `Pancerze`
- `Bronie`

w kolumnie `Słowa Kluczowe` przecinek `,` jest zamieniany na:
- `<span class="keyword-comma">,</span>`

To oznacza:
- słowa pozostają czerwone,
- **sam przecinek jest w kolorze podstawowym** (`--text`), nie czerwonym.

### 4.3 Arkusz „Słowa Kluczowe” — pełna czerwień kolumny `Nazwa`
W arkuszu `Słowa Kluczowe` kolumna `Nazwa` jest zawsze renderowana jako czerwona (reguła „all red”).

---

## 5) Specjalna reguła dla arkusza „Słowa Kluczowe Frakcji”

Dotyczy wyłącznie:
- arkusz: `Słowa Kluczowe Frakcji`
- kolumna: `Słowo Kluczowe`

Silnik stosuje dedykowaną funkcję `formatFactionKeywordHTML` z regułami tokenowymi:

1. **Domyślnie wszystko jest czerwone** (`.keyword-red`).
2. Token `-` (myślnik) jest wyjątkiem: **nie jest czerwony**.
3. Słowo `lub` (niezależnie od wielkości liter) jest wyjątkiem: **nie jest czerwone**.
4. Specjalny wyjątek nadrzędny: `[ŚWIAT-KUŹNIA]` jest zawsze traktowane jako jeden token i renderowane **w całości na czerwono**.
   - To obejmuje również myślnik wewnątrz tego tokenu; tutaj myślnik **pozostaje czerwony**.
5. Jeżeli w tekście jest pogrubienie/kursywa z XLSX, te style są zachowane niezależnie od reguły koloru.

Praktyczna interpretacja:
- `Adeptus Mechanicus - lub [ŚWIAT-KUŹNIA]` →
  - `Adeptus Mechanicus` czerwone,
  - `-` neutralne,
  - `lub` neutralne (może być kursywą, jeśli tak ustawiono w XLSX),
  - `[ŚWIAT-KUŹNIA]` całe czerwone.

---

## 6) Kolejność nakładania formatowania (ważne przy projektowaniu XLSX)

1. Najpierw odczytywany jest tekst i ewentualne markery stylu z `cell.h`.
2. Następnie tekst dzielony jest na segmenty z aktywnymi stylami (`RED`, `B`, `I`).
3. Potem nakładane są reguły semantyczne DataVault:
   - referencje `str./str/strona` w nawiasach,
   - linie `*[n]`,
   - reguły czerwieni dla słów kluczowych,
   - wyjątki przecinka / `lub` / `-` / `[ŚWIAT-KUŹNIA]`.
4. Na końcu renderowany jest HTML z klasami CSS.

Wniosek: nawet jeśli część tekstu jest czerwona z XLSX, reguły domenowe dla kolumn słów kluczowych mogą dodatkowo wymusić/zmienić kolor wybranych tokenów (np. przecinka albo `lub`).

---

## 7) Reguły dodatkowe wpływające na odbiór tekstu

### 7.1 Zasięg (`Zasięg`) i separator `/`
W kolumnie `Zasięg` separator `/` dostaje klasę `.slash` (jaśniejszy kolor), a wartości po obu stronach pozostają standardowe.

### 7.2 Nowe linie
Nowe linie z XLSX (lub z `<br>`) są zachowywane i renderowane jako `<br>`.

### 7.3 Clamp (ucięcie po 9 liniach) i podpowiedź
W długich komórkach system może przyciąć podgląd do 9 linii i dopisać hint (`.clampHint`).
To nie zmienia semantyki koloru/pogrubienia/kursywy, tylko sposób prezentacji skrótu.

### 7.4 Kolumna `Strona` — kolor i prezentacja
- We wszystkich zakładkach kolumna `Strona` ma kolor tekstu jak referencje `(str.)`, czyli `var(--code)` (ten sam ton co klasa `.ref`).
- Kolumna `Strona` używa standardowego łamania (`white-space: normal`) i wyśrodkowania wartości.
- Minimalna szerokość kolumny `Strona` jest ujednolicona do `6ch` we wszystkich tabelach.

### 7.5 Kolumna `Podręcznik` — szerokość i prezentacja
- We wszystkich zakładkach kolumna `Podręcznik` ma minimalną szerokość `17ch`.
- Dla kolumny `Podręcznik` nie jest ustawiany `max-width` (wartość: brak/none).
- Wyrównanie pozostaje do lewej, z domyślnym łamaniem (`white-space: normal`).

---

## 8) Checklista dla osoby tworzącej nowy `Repozytorium.xlsx`

1. Dla tekstu wymagającego zachowania koloru czerwonego ustawiaj inline `color` w jednym z obsługiwanych formatów (np. `#ff0000`).
2. Referencje stron zapisuj w nawiasach i z frazami `str.`, `str` lub `strona`.
3. Gdy potrzebujesz jaśniejszej linii pomocniczej, zaczynaj linię od `*[liczba]`.
4. W kolumnach `Słowa Kluczowe` pamiętaj o wyjątkach przecinków w wskazanych arkuszach.
5. W `Słowa Kluczowe Frakcji / Słowo Kluczowe`:
   - używaj `lub` i `-` świadomie (będą neutralne),
   - zapis `[ŚWIAT-KUŹNIA]` traktuj jako specjalny token, który ma pozostać w całości czerwony.
6. Jeżeli zależy Ci na kursywie/pogrubieniu (np. `lub` kursywą), ustaw to w samej komórce XLSX rich text — DataVault to zachowa.
7. W kolumnie `Strona` utrzymuj wartości jako odwołania do stron — UI renderuje je kolorem `var(--code)` jak `(str.)` oraz wyśrodkowuje w polu o min. szerokości `6ch`.
8. W kolumnie `Podręcznik` utrzymuj krótkie nazwy źródeł — UI rezerwuje min. `17ch`, wyrównanie do lewej, standardowe łamanie.

---

## 9) Zakres odpowiedzialności dokumentu
Dokument opisuje wyłącznie reguły formatowania tekstu używane przez DataVault przy renderowaniu danych z `data.json` / `Repozytorium.xlsx`, ze szczególnym naciskiem na reguły koloru czerwonego, referencje `str.*`, jaśniejszy font oraz wyjątki tokenowe.

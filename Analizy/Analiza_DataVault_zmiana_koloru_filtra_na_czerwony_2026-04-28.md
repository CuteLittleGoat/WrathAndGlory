# Analiza modyfikacji: DataVault — zmiana koloru aktywnego filtra (zielony -> jasny czerwony z glow)

## Prompt użytkownika
> „Przeprowadź analizę modyfikacji modułu DataVault. Obecnie, jak filtr jest zaznaczony, to ma jasno zielony kolor z efektem glow. Chciałbym zmienić kolor na czarwony. Też ma być jasny i też z efektem glow. Przeprowadź analizę takiej zmiany. Pamiętaj o uwzględnieniu konieczności update pliku DetaleLayout.md i DataVault/docs/Documentation.md”

## Zakres analizy
Analiza obejmuje wyłącznie przygotowanie planu zmiany wizualnej (bez wdrażania kodu), ze wskazaniem:
- miejsc w kodzie odpowiedzialnych za aktualny wygląd aktywnego filtra,
- rekomendowanego sposobu zmiany na jasny czerwony z efektem glow,
- ryzyk UI/UX i spójności stylu,
- listy plików wymagających aktualizacji dokumentacyjnej.

## Gdzie obecnie ustawiony jest zielony stan aktywnego filtra

### 1) Przycisk filtra w drugim wierszu nagłówka tabeli
Plik: `DataVault/style.css`
- `.filterBtn.filter-active`:
  - `border-color: var(--accent);`
  - `background: rgba(22,198,12,.18);`
  - `box-shadow: 0 0 0 1px rgba(22,198,12,.22), 0 0 10px rgba(22,198,12,.22);`
- `.filterBtn.filter-active::after`:
  - znacznik „●” w kolorze `var(--code)` (również zielony).

To jest główny element widoczny na załączonym screenie jako aktywny filtr.

### 2) Wyróżnienie nagłówka kolumny z aktywnym filtrem
Plik: `DataVault/style.css`
- `.dataTable thead tr:first-child th.filter-active`:
  - `box-shadow: inset 0 -2px 0 var(--accent);`
  - `background: linear-gradient(180deg, rgba(22,198,12,.16), rgba(22,198,12,.06));`

Czyli po aktywacji filtra zmienia się nie tylko ikonka/przycisk, ale i górna komórka nagłówka kolumny.

### 3) Logika aktywacji (JS)
Plik: `DataVault/app.js`
- `updateFilterIndicators()` przełącza klasę `filter-active` dla:
  - komórki nagłówka (`th[data-col]`),
  - przycisku `.filterBtn`.

Wniosek: zmiana koloru wymaga tylko CSS (bez zmiany logiki JS), o ile pozostaje ta sama nazwa klasy `filter-active`.

## Rekomendowany kierunek zmiany na jasny czerwony + glow

### Wariant preferowany (bezpieczny i lokalny)
Zmienić wyłącznie reguły związane z aktywnym filtrem:
1. `DataVault/style.css`:
   - `.filterBtn.filter-active` — zamiana zielonych `rgba(22,198,12,...)` na jasny czerwony,
   - `.filterBtn.filter-active::after` — kolor znacznika „●” na nowy czerwony akcent,
   - `.dataTable thead tr:first-child th.filter-active` — czerwony gradient + podkreślenie.

2. Nie ruszać globalnych zmiennych motywu (`--accent`, `--code`, `--glow`, itd.), bo obecnie nadają one charakter całej aplikacji i zmiana globalna „przefarbowałaby” wiele obszarów poza filtrem.

### Proponowany zakres kolorystyczny (jasny czerwony)
Dla czytelności na ciemnym tle:
- tło aktywnego przycisku: `rgba(255, 70, 70, 0.20)`
- obrys i glow: `rgba(255, 85, 85, 0.30)` + `rgba(255, 85, 85, 0.40)`
- gradient nagłówka aktywnego filtra: `rgba(255, 70, 70, 0.18)` -> `rgba(255, 70, 70, 0.07)`

Uwaga: finalne wartości alfa mogą wymagać korekty o ±0.05 po szybkim teście wizualnym, żeby nie przerysować efektu glow.

## Potencjalne ryzyka i jak je ograniczyć
1. **Kontrast tekstu i ikon**
   - Czerwony może optycznie „zjadać” czytelność drobnych znaków przy zbyt mocnym glow.
   - Mitigacja: utrzymać umiarkowany blur i alfa dla cienia.

2. **Spójność semantyczna kolorów**
   - W interfejsach czerwony bywa odczytywany jako „błąd/usuń/alert”.
   - Mitigacja: zastosować jasny czerwony „statusowy” i zachować ten kolor wyłącznie dla „aktywny filtr”.

3. **Niespójność między przyciskiem a nagłówkiem**
   - Jeśli czerwony zostanie wdrożony tylko w `.filterBtn.filter-active`, nagłówek kolumny zostanie zielony.
   - Mitigacja: obowiązkowo zaktualizować oba selektory `filter-active`.

## Wpływ na dokumentację (wymagane aktualizacje)

Zgodnie z wymaganiem dla zmian kolorystycznych należy zaktualizować:
1. **`DetaleLayout.md` (root)**
   - dodać/zmienić sekcję opisującą kolorystykę stanu „aktywny filtr” w module DataVault,
   - opisać nową paletę czerwieni, glow i elementy których dotyczy (przycisk + nagłówek kolumny).

2. **`DataVault/docs/Documentation.md`**
   - zaktualizować sekcję techniczną stylów filtra:
     - selektory CSS,
     - wartości kolorów RGBA,
     - zachowanie klasy `filter-active` i powiązanie z `updateFilterIndicators()`.

Dodatkowo (dobra praktyka, choć nie było wymagane wprost):
- **`DataVault/docs/README.md`** można odświeżyć opisowo od strony użytkownika (że aktywny filtr jest sygnalizowany czerwonym podświetleniem).

## Szacowana złożoność zmiany
- Implementacja kodu: niska (zmiana kilku reguł CSS).
- Ryzyko regresji: niskie (brak ingerencji w logikę filtrowania JS).
- Czas realizacji (z dokumentacją): krótki.

## Kryteria akceptacji po wdrożeniu
1. Aktywny filtr ma jasny czerwony kolor i widoczny glow.
2. Zarówno przycisk filtra, jak i nagłówek aktywnej kolumny mają spójne czerwone wyróżnienie.
3. Brak zmian w działaniu filtrowania (wyłącznie warstwa wizualna).
4. Zaktualizowane pliki: `DetaleLayout.md` i `DataVault/docs/Documentation.md`.

## Sekcja wdrożenia po analizie (2026-04-28)

Poniżej pełna lista zmian wykonanych na podstawie tej analizy.

### 1) DataVault/style.css
- Linia 279
  Było: `box-shadow: inset 0 -2px 0 var(--accent);`
  Jest: `box-shadow: inset 0 -2px 0 rgba(255,85,85,.40);`

- Linia 280
  Było: `background:linear-gradient(180deg, rgba(22,198,12,.16), rgba(22,198,12,.06));`
  Jest: `background:linear-gradient(180deg, rgba(255,70,70,.18), rgba(255,70,70,.07));`

- Linia 913
  Było: `border-color:var(--accent);`
  Jest: `border-color:rgba(255,85,85,.40);`

- Linia 914
  Było: `background:rgba(22,198,12,.18);`
  Jest: `background:rgba(255,70,70,.20);`

- Linia 915
  Było: `box-shadow:0 0 0 1px rgba(22,198,12,.22), 0 0 10px rgba(22,198,12,.22);`
  Jest: `box-shadow:0 0 0 1px rgba(255,85,85,.30), 0 0 10px rgba(255,85,85,.40);`

- Linia 921
  Było: `color:var(--code);`
  Jest: `color:rgb(255,120,120);`

### 2) DataVault/docs/Documentation.md
- Linia 149
  Było: `- Aktywny filtr kolumny dodaje klasę .filter-active do nagłówka z pierwszego wiersza, co daje akcentowe podświetlenie (box-shadow + mocniejszy gradient tła).`
  Jest: `- Aktywny filtr kolumny dodaje klasę .filter-active do nagłówka z pierwszego wiersza, co daje jasnoczerwone podświetlenie (box-shadow: inset 0 -2px 0 rgba(255,85,85,.40) + czerwony gradient tła).`

- Linie 173-175 (blok opisu `.filterBtn.filter-active`)
  Było: opis zielonego aktywnego filtra (`border-color: var(--accent)`, zielone tło i glow, marker `var(--code)`).
  Jest: opis czerwonego aktywnego filtra (`border-color: rgba(255,85,85,.40)`, `rgba(255,70,70,.20)`, `0 0 10px rgba(255,85,85,.40)`, marker `rgb(255,120,120)`).

### 3) DataVault/docs/README.md
- Linia 15
  Było: `- **Filtry kolumnowe** – zawężają wyniki w konkretnych kolumnach.`
  Jest: `- **Filtry kolumnowe** – zawężają wyniki w konkretnych kolumnach; aktywny filtr jest oznaczony jasnoczerwonym podświetleniem i kropką przy ikonie filtra.`

- Linia 57
  Było: `- **Column filters** – narrow results per column.`
  Jest: `- **Column filters** – narrow results per column; an active filter is marked with a bright red highlight and a dot next to the filter icon.`

### 4) DetaleLayout.md
- Linie 167-169 (blok aktywnego przycisku filtra)
  Było: opis zielonego tła i zielonego glow.
  Jest: opis jasnoczerwonego tła (`rgba(255,70,70,.20)`), czerwonego glow (`0 0 10px rgba(255,85,85,.40)`), obwódki (`0 0 0 1px rgba(255,85,85,.30)`) i czerwonego znacznika `●`.

- Linia 209
  Było: `... akcentową linią dolną (inset 0 -2px 0 var(--accent)),`
  Jest: `... jasnoczerwoną linią dolną (inset 0 -2px 0 rgba(255,85,85,.40)) i czerwonym gradientem tła (rgba(255,70,70,.18) → rgba(255,70,70,.07)),`

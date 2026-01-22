# DiceRoller - Dokumentacja techniczna

## Cel modułu
`DiceRoller` to niezależny moduł aplikacji Wrath & Glory do symulacji rzutów kośćmi sześciennymi. Pozwala na ustawienie stopnia trudności, puli kości oraz liczby kości furii, wykonuje animację rzutu, liczy punkty i wyświetla wynik wraz z dodatkowymi komunikatami (Komplikacja Furii, Krytyczna Furia, Możliwe Przeniesienie).

## Struktura plików
- `DiceRoller/index.html` — główny dokument HTML.
- `DiceRoller/style.css` — pełna warstwa stylów i animacji.
- `DiceRoller/script.js` — logika walidacji, rzutu kośćmi i podsumowania.

## HTML (`index.html`)
### Główne sekcje
- `<main class="app">` — główny kontener aplikacji.
- `<header class="app__header">` — nagłówek z tytułem i podtytułem.
- `<section class="panel">` — panel sterowania z polami wejściowymi i przyciskiem.
- `<section class="results">` — obszar wyświetlający kości oraz podsumowanie.

### Pola wejściowe
Każde pole ma:
- etykietę `<label>`,
- `input[type="number"]` z atrybutami `min="1"`, `max="99"`, `value="1"`, `step="1"`,
- obsługę natywnych strzałek góra/dół (spinner) przeglądarki.

Pola:
1. **Stopień Trudności** (`#difficulty`).
2. **Pula Kości** (`#pool`).
3. **Ilość Kości Furii** (`#fury`) + podpowiedź `.field__hint` o limicie.

### Przycisk
- `<button class="roll" id="roll">` — uruchamia rzut kośćmi.

### Wyniki
- `<div class="dice-stage">` — rama z perspektywą 3D, ogranicza obszar toczenia się kości.
- `<div class="dice" id="dice">` — kontener na wygenerowane kości (tryb animacji i układ końcowy).
- `<div class="summary" id="summary">` — podsumowanie wyników.

## CSS (`style.css`)
### Zmienne CSS
Zdefiniowane w `:root`:
- `--bg` — tło z gradientami.
- `--panel`, `--border`, `--text`, `--accent`, `--accent-soft`, `--muted` — kolory interfejsu.
- `--white-die`, `--white-pip` — barwy białej kości.
- `--red-die`, `--red-pip` — barwy czerwonej kości.
- `--shadow` — cień panelu.
- `--roll-duration` — czas animacji rzutu.

### Typografia
Globalnie ustawione fonty monospace: `Consolas`, `Fira Code`, `Source Code Pro`.

### Układ
- `.app` — panel z obramowaniem, cieniem i odstępami.
- `.panel` — grid na pola i przycisk (`repeat(auto-fit, minmax(220px, 1fr))`).
- `.results` — kolumny na kości i podsumowanie.

### Pola i przycisk
- `input[type="number"]` — półprzezroczyste tło, złote obramowanie, fokus z poświatą.
- `.roll` — przycisk z podkreślonym akcentem, efekt hover/active.

### Kości
Każda kość to `.die`:
- rozmiar 68x68 px,
- zaokrąglenia `border-radius: 12px`,
- cień wewnętrzny i zewnętrzny,
- warianty kolorów: `.white` i `.red`.

### Ramka i scena 3D
- `.dice-stage` — żółta ramka z `border`, półprzezroczystym tłem i `perspective: 900px`.
- `overflow: hidden` zapobiega „wypadaniu” kości poza ramkę.
- `.dice` — pozycjonowanie `relative`, minimalna wysokość i układ `flex` do końcowego rozmieszczenia.

### Oczka (pips)
- Każda kość ma 7 elementów `.pip` (pozycje `pos-1` do `pos-7`).
- Domyślnie niewidoczne (`opacity: 0`).
- Klasa `.face-X` odkrywa odpowiednie oczka.

Układ oczek:
- `pos-1` i `pos-2` — górne rogi,
- `pos-3` i `pos-5` — środek po bokach,
- `pos-4` — środek,
- `pos-6` i `pos-7` — dolne rogi.

### Animacja rzutu 3D
- `.dice.is-rolling` zwiększa minimalną wysokość kontenera.
- `.die--rolling` ustawia pozycję absolutną i uruchamia `@keyframes tumble`.
- `@keyframes tumble` wykonuje translacje `translate3d(...)` oraz obroty `rotateX/rotateY/rotateZ`,
  wykorzystując zmienne `--x-start`, `--y-start`, `--x-mid`, `--y-mid`, `--x-bounce`, `--y-bounce`,
  `--x-end`, `--y-end`, `--x-stop`, `--y-stop`.
- Czas animacji kontroluje `--roll-duration` (1.4s).

### Responsywność
Media query do 600px:
- zmniejsza kości do 58x58 px,
- przesuwa oczka bliżej krawędzi.

## JavaScript (`script.js`)
### Stałe i elementy DOM
- `MIN_VALUE = 1`, `MAX_VALUE = 99` — zakresy wejściowe.
- `ROLL_DURATION = 1400` — czas animacji.
- `ROLL_PADDING = 8` — margines bezpieczeństwa dla ruchu kości w ramce.
- Referencje DOM: `difficultyInput`, `poolInput`, `furyInput`, `rollButton`, `diceContainer`, `summary`.

### Funkcje
1. **`clampValue(value, min, max)`**
   - Zwraca wartość ograniczoną do zakresu `min-max`.
   - Gdy `NaN`, zwraca `min`.

2. **`sanitizeField(input)`**
   - Parsuje wartość z inputa.
   - Zaciska do zakresu 1-99.
   - Nadpisuje `input.value` poprawioną wartością.

3. **`syncPoolAndFury()`**
   - Sanitizuje Pulę Kości i Kości Furii.
   - Jeśli `fury > pool`, ustawia fury na wartość puli.

4. **`createDieElement(isFury)`**
   - Tworzy element `.die` z 7 oczkami.
   - Dodaje klasę `red` lub `white`.

5. **`setDieFace(die, value)`**
   - Usuwa klasy `face-1` do `face-6`.
   - Dodaje klasę odpowiadającą wylosowanej wartości.

6. **`rollDie()`**
   - Zwraca losową liczbę 1-6.

7. **`getRandomBetween(min, max)`**
   - Zwraca losową wartość z przedziału `min-max`.

8. **`clampToBounds(value, min, max)`**
   - Ogranicza wartość do zakresu (używane do obszaru ramki).

9. **`createBouncePath(bounds, dieSize)`**
   - Wyznacza zestaw punktów ruchu w obrębie ramki.
   - Tworzy pozycje start, punkt pośredni, „odbicie” i pozycję końcową.

10. **`scoreValue(value)`**
   - 1-3 → 0 punktów.
   - 4-5 → 1 punkt.
   - 6 → 2 punkty.

11. **`buildSummary({ ... })`**
   - Buduje podsumowanie:
     - nagłówek Sukces/Porażka,
     - łączna liczba punktów,
     - komunikaty fury i przeniesienia,
     - lista wyników każdej kości.

12. **`handleRoll()`**
   - Sanitizuje pola.
   - Czyści kontener kości.
   - Tworzy kości (`pool` sztuk), pierwsze `fury` są czerwone.
   - Ustawia klasę `is-rolling` na kontenerze oraz `die--rolling` na każdej kości.
   - W `requestAnimationFrame` oblicza ścieżkę w ramce i przypisuje zmienne CSS do animacji.
   - Po `ROLL_DURATION` usuwa animację i przypisuje finalne wyniki.
   - Liczy punkty, sukces i komunikaty.
   - Oblicza **Możliwe Przeniesienie**:
     - `totalSixes` = liczba szóstek,
     - `margin = totalPoints - difficulty`,
     - `transferable = min(totalSixes, floor(margin/2))`.

### Logika furii
- Komplikacja Furii: **przynajmniej jedna 1** na czerwonych kościach.
- Krytyczna Furia: **wszystkie czerwone kości = 6**.
- Jeśli brak czerwonych kości, komunikat się nie pojawia.

### Walidacja pól
- Nasłuchiwanie `change` i `blur` na inputach.
- Każda zmiana zaciska wartości do 1-99.
- `Ilość Kości Furii` nigdy nie przekroczy `Pula Kości`.

## Zasady działania aplikacji
1. Użytkownik ustawia Stopień Trudności, Pulę Kości oraz Ilość Kości Furii.
2. Kliknięcie „Rzuć kośćmi!” uruchamia animację 3D i odbicia w żółtej ramce.
3. Wyniki kości są losowane (1-6).
4. Punkty są liczone:
   - 1-3 → 0 punktów,
   - 4-5 → 1 punkt,
   - 6 → 2 punkty.
5. Porównanie z Stopniem Trudności:
   - wynik ≥ trudność → „Sukces!”,
   - wynik < trudność → „Porażka!”.
6. Komunikaty furii:
   - min. jedna 1 na czerwonych → „Komplikacja Furii 🙁”,
   - wszystkie czerwone = 6 → „Krytyczna Furia 🙂”.
7. Przeniesienie:
   - jeśli po odjęciu 2 punktów za część szóstek wynik wciąż ≥ trudność, wyświetla się liczba możliwych przeniesień.

## Odwzorowanie 1:1
Aby odtworzyć aplikację:
1. Skopiuj strukturę `index.html` z identycznymi klasami i identyfikatorami.
2. Zastosuj `style.css` z podanymi zmiennymi kolorów, układem panelu i animacją.
3. W `script.js` zachowaj logikę walidacji (1-99), rozdział kości na czerwone/białe oraz algorytmy punktacji i przeniesienia.
4. Zachowaj kolejność kości: **najpierw czerwone**, potem białe — to determinuje przypisanie wyników furii.
5. Użyj tych samych komunikatów tekstowych, aby zachować spójność z wymaganiami.

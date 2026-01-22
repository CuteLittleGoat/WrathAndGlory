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
- `<div class="language-switcher">` — przełącznik języka (select PL/EN) osadzony w prawym górnym rogu panelu.
- `<header class="app__header">` — nagłówek z tytułem i podtytułem.
- `<section class="panel">` — panel sterowania z polami wejściowymi i przyciskiem.
- `<section class="results">` — obszar wyświetlający kości oraz podsumowanie.

### Pola wejściowe
Każde pole ma:
- etykietę `<label>`,
- `input[type="number"]` z atrybutami `min="1"`, `max="99"`, `value="1"`, `step="1"`,
- obsługę natywnych strzałek góra/dół (spinner) przeglądarki.

Pola:
1. **Stopień Trudności** (`#difficulty`, etykieta `#difficultyLabel`).
2. **Pula Kości** (`#pool`, etykieta `#poolLabel`).
3. **Ilość Kości Furii** (`#fury`, etykieta `#furyLabel`) + podpowiedź `.field__hint` z id `#furyHint` o limicie.

### Przełącznik języka
- `<select id="languageSelect">` z opcjami `pl` i `en`.
- Podmienia wszystkie kluczowe teksty w UI (nagłówek, etykiety, podpowiedź, przycisk, komunikaty wyników).
- Zmiana języka resetuje pola oraz wynik bez komunikatu ostrzegawczego.

### Przycisk
- `<button class="roll" id="roll">` — uruchamia rzut kośćmi.

### Wyniki
- `<div class="dice" id="dice">` — kontener na wygenerowane kości.
- `<div class="summary" id="summary">` — podsumowanie wyników.

## CSS (`style.css`)
### Zmienne CSS
Zdefiniowane w `:root` (motyw zielonego terminala spójny z główną stroną):
- `--bg` — tło wielowarstwowe:
  1. `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  2. `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  3. kolor bazowy `#031605`
- `--panel` — tło panelu: `#000`.
- `--border` — obramowanie: `#16c60c`.
- `--text` — tekst: `#9cf09c`.
- `--accent` — akcent: `#16c60c`.
- `--accent-dark` — ciemny akcent: `#0d7a07`.
- `--muted` — tekst pomocniczy: `rgba(156, 240, 156, 0.7)`.
- `--glow` — poświata panelu: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius` — zaokrąglenia: `10px`.
- `--white-die`, `--white-pip` — barwy białej kości: `#f6f6f6` i `#111111`.
- `--red-die`, `--red-pip` — barwy czerwonej kości: `#c01717` i `#ffffff`.

### Typografia
Globalnie ustawione fonty monospace: `Consolas`, `Fira Code`, `Source Code Pro`.

### Układ
- `.app` — panel o szerokości `min(860px, 100%)`, z obramowaniem `2px`, poświatą `--glow`, paddingiem `32px 32px 28px`, ułożony kolumnowo i wyśrodkowany (`align-items: center`).
- `.app` ma `position: relative`, aby umożliwić absolutne pozycjonowanie przełącznika języka.
- `.app__header` — tekst nagłówka wyśrodkowany.
- `.panel` — grid na pola i przycisk (`repeat(auto-fit, minmax(220px, 1fr))`) na pełną szerokość panelu (`width: 100%`), z `align-items: start`, aby wszystkie pola startowały na tej samej wysokości mimo podpowiedzi.
- `.results` — kolumny na kości i podsumowanie na pełną szerokość panelu.

### Przełącznik języka
- `.language-switcher` — absolutnie pozycjonowany w prawym górnym rogu panelu (`top: 18px; right: 18px`).
- `.language-switcher select` — stylowany jak pola formularza: zielone półprzezroczyste tło, obramowanie `2px`, zaokrąglenia `6px`.
- W responsywności do 600px przełącznik wraca do statycznego układu i wyrównuje się do prawej strony panelu (`align-self: flex-end`).

### Podsumowanie
- `.summary` — panel wyników z zielonym tłem (`rgba(22, 198, 12, 0.08)`), obramowaniem `2px` (`rgba(22, 198, 12, 0.4)`) i zaokrągleniem `10px`.
- `.summary__headline` — nagłówkowy styl dla „Sukces!/Porażka!” i komunikatów furii (uppercase, `font-size: 18px`, `letter-spacing: 0.05em`).
- `.summary__headline--secondary` — odstęp nad komunikatem furii (`margin-top: 6px`).
- `.summary__transfer` — standardowa linia z informacją o przeniesieniu (`font-size: 15px`).
- `.summary__detail` — styl dla „Łączne punkty...” w kolorze `--muted` i rozmiarze `14px`, identyczny jak lista wyników.
- `.summary__spacer` — pusty odstęp (`height: 12px`) między przeniesieniem a łącznymi punktami.

### Pola i przycisk
- `input[type="number"]` — zielone półprzezroczyste tło (`rgba(22, 198, 12, 0.08)`), obramowanie `2px` w kolorze `--border`, fokus z poświatą `rgba(22, 198, 12, 0.25)` i jaśniejszym tłem.
- `.roll` — przycisk w stylu głównej aplikacji: zielona ramka, delikatna poświata na hover (`0 0 18px rgba(22, 198, 12, 0.3)`), jaśniejsze tło w stanie active.

### Kości
Każda kość to `.die`:
- rozmiar 68x68 px,
- zaokrąglenia `border-radius: 12px`,
- cień wewnętrzny i zewnętrzny,
- warianty kolorów: `.white` i `.red`.

### Znak zapytania (animacja)
- Każda kość zawiera element `.die__question` z tekstem `?`.
- Domyślnie ukryty (`opacity: 0`), widoczny tylko podczas animacji rzutu.
- Kolor jest zależny od typu kości:
  - biała kość → czarny znak zapytania (`--white-pip`),
  - czerwona kość → biały znak zapytania (`--red-pip`).
- Element jest osadzony w środku kości i obraca się razem z nią dzięki animacji `.die.rolling`.

### Oczka (pips)
- Każda kość ma 7 elementów `.pip` (pozycje `pos-1` do `pos-7`).
- Domyślnie niewidoczne (`opacity: 0`).
- Klasa `.face-X` odkrywa odpowiednie oczka.

Układ oczek:
- `pos-1` i `pos-2` — górne rogi,
- `pos-3` i `pos-5` — środek po bokach,
- `pos-4` — środek,
- `pos-6` i `pos-7` — dolne rogi.

### Animacja rzutu
- `.die.rolling` uruchamia `@keyframes roll`.
- Animacja obraca kość o 360° i delikatnie skaluje w czasie 0.8s.
- Podczas animacji:
  - oczka są ukryte (`.die.rolling .pip { opacity: 0; }`),
  - znak zapytania jest widoczny (`.die.rolling .die__question { opacity: 1; }`).

### Responsywność
Media query do 600px:
- zmniejsza kości do 58x58 px,
- przesuwa oczka bliżej krawędzi.

## JavaScript (`script.js`)
### Stałe i elementy DOM
- `MIN_VALUE = 1`, `MAX_VALUE = 99` — zakresy wejściowe.
- `ROLL_DURATION = 900` — czas animacji.
- Referencje DOM: `difficultyInput`, `poolInput`, `furyInput`, `rollButton`, `diceContainer`, `summary`, elementy etykiet, podpowiedzi oraz `#languageSelect`.
- `translations` — obiekt tłumaczeń dla PL/EN (teksty nagłówków, etykiet, przycisków i komunikatów wyników).
- `currentLanguage` — aktualny kod języka (`pl` domyślnie).

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
   - Tworzy element `.die` z centralnym znakiem zapytania `.die__question` i 7 oczkami.
   - Dodaje klasę `red` lub `white`.

5. **`setDieFace(die, value)`**
   - Usuwa klasy `face-1` do `face-6`.
   - Dodaje klasę odpowiadającą wylosowanej wartości.

6. **`rollDie()`**
   - Zwraca losową liczbę 1-6.

7. **`scoreValue(value)`**
   - 1-3 → 0 punktów.
   - 4-5 → 1 punkt.
   - 6 → 2 punkty.

8. **`buildSummary({ ... })`**
   - Buduje podsumowanie:
     - nagłówek Sukces/Porażka z klasą `.summary__headline` w zależności od języka,
     - komunikat furii pod nagłówkiem (ten sam krój, klasa `.summary__headline--secondary`),
     - linia „Możliwe Przeniesienie/Possible Shift”,
     - wizualny odstęp (`.summary__spacer`),
     - „Łączne punkty/Total points...” stylowane jak lista wyników,
     - lista wyników każdej kości („Kość/Die”, „punkty/points”).

9. **`handleRoll()`**
   - Sanitizuje pola.
   - Czyści kontener kości.
   - Tworzy kości (`pool` sztuk), pierwsze `fury` są czerwone.
   - Ustawia animację `rolling`.
   - Po `ROLL_DURATION` przypisuje finalne wyniki.
   - Liczy punkty, sukces i komunikaty.
   - Oblicza **Możliwe Przeniesienie**:
     - `totalSixes` = liczba szóstek,
     - `margin = totalPoints - difficulty`,
     - `transferable = min(totalSixes, floor(margin/2))`.

10. **`resetState()`**
   - Przywraca wartości wejściowe do `1`.
   - Czyści kości i ustawia placeholder podsumowania w bieżącym języku.

11. **`updateLanguage(lang)`**
   - Ustawia `currentLanguage` i aktualizuje `document.documentElement.lang`.
   - Podmienia teksty w UI na podstawie `translations`.
   - Resetuje stan aplikacji (pola i wynik).

### Logika furii
- Komplikacja Furii: **przynajmniej jedna 1** na czerwonych kościach.
- Krytyczna Furia: **wszystkie czerwone kości = 6**.
- Jeśli brak czerwonych kości, komunikat się nie pojawia.

### Walidacja pól
- Nasłuchiwanie `change` i `blur` na inputach.
- Każda zmiana zaciska wartości do 1-99.
- `Ilość Kości Furii` nigdy nie przekroczy `Pula Kości`.
- Zmiana języka w `#languageSelect` resetuje pola i podsumowanie bez ostrzeżenia.

## Zasady działania aplikacji
1. Użytkownik ustawia Stopień Trudności, Pulę Kości oraz Ilość Kości Furii.
2. Opcjonalnie wybiera język w prawym górnym rogu (PL/EN); aplikacja resetuje wartości.
3. Kliknięcie „Rzuć Kośćmi!/Roll the dice!” uruchamia animację.
4. Wyniki kości są losowane (1-6).
5. Punkty są liczone:
   - 1-3 → 0 punktów,
   - 4-5 → 1 punkt,
   - 6 → 2 punkty.
6. Porównanie z Stopniem Trudności:
   - wynik ≥ trudność → „Sukces!”,
   - wynik < trudność → „Porażka!”.
7. Komunikaty furii:
   - min. jedna 1 na czerwonych → „Komplikacja Furii 🙁” (wyświetlane bezpośrednio pod „Sukces!”/„Porażka!” w tym samym kroju),
   - wszystkie czerwone = 6 → „Krytyczna Furia 🙂” (wyświetlane bezpośrednio pod „Sukces!”/„Porażka!” w tym samym kroju).
8. Przeniesienie:
   - jeśli po odjęciu 2 punktów za część szóstek wynik wciąż ≥ trudność, wyświetla się liczba możliwych przeniesień.
9. Po przeniesieniu wstawiany jest odstęp, a „Łączne punkty...” pojawiają się w stylu listy wyników kości.

## Odwzorowanie 1:1
Aby odtworzyć aplikację:
1. Skopiuj strukturę `index.html` z identycznymi klasami i identyfikatorami.
2. Zastosuj `style.css` z podanymi zmiennymi kolorów, układem panelu i animacją.
3. W `script.js` zachowaj logikę walidacji (1-99), rozdział kości na czerwone/białe oraz algorytmy punktacji i przeniesienia.
4. Zachowaj kolejność kości: **najpierw czerwone**, potem białe — to determinuje przypisanie wyników furii.
5. Użyj tych samych komunikatów tekstowych, aby zachować spójność z wymaganiami.
6. Odwzoruj przełącznik języka (`#languageSelect`) wraz z obiektem `translations`, funkcjami `updateLanguage()` i `resetState()` oraz resetem danych po zmianie języka.

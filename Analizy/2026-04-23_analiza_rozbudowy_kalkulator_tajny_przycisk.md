# Analiza wdrożenia: tajny przycisk i wyświetlanie GIF-a w module Kalkulator

## Prompt użytkownika
> „Przeprowadź analizę rozbudowy Kalkulator/index.html
>
> Chcę, żebyś dodał w prawym dolnym rogu czerwony przycisk \"Tajny przycisk!\".
> Jego naciśnięcie ma spowodować wyświetlenie gifa Kalkulator/Koza.gif
>
> Przygotuj analizę wdrożenia takiej funkcjonalności.”

## Zakres analizy
Analiza dotyczy **wyłącznie planu wdrożenia** nowej funkcji w pliku `Kalkulator/index.html`, bez wykonywania zmian produkcyjnych w kodzie modułu na tym etapie.

## Stan obecny (na podstawie `Kalkulator/index.html`)
1. Strona nie zawiera żadnego kodu JavaScript.
2. Interfejs oparty jest o:
   - centralny kontener `<main>`,
   - grafikę logo (`Skull.png`),
   - dwa przyciski nawigacyjne (`Kalkulator XP` i `Tworzenie Postaci`).
3. Styl bazuje na zielonej estetyce „terminalowej” i zmiennych CSS w `:root`.
4. Plik `Kalkulator/Koza.gif` już istnieje, więc nie trzeba dodawać zasobu do repozytorium.

## Wymagana funkcjonalność
1. Dodać czerwony przycisk z etykietą: **„Tajny przycisk!”**.
2. Przycisk ma być umieszczony w **prawym dolnym rogu okna przeglądarki** (pozycjonowanie niezależne od centralnego panelu `<main>`).
3. Po kliknięciu przycisku ma zostać wyświetlony GIF: `Kalkulator/Koza.gif`.

## Proponowany sposób implementacji

### 1) Warstwa HTML
Dodać poza `<main>` (ale w `<body>`) elementy:
- przycisk, np. `<button id="secretButton">Tajny przycisk!</button>`,
- kontener/element dla GIF-a, np.:
  - wariant A (overlay): ukryty kontener modalny z `<img src="Koza.gif">`,
  - wariant B (inline fixed): ukryty obraz pozycjonowany `fixed`.

**Rekomendacja:** wariant A (overlay), bo daje lepszą kontrolę UX (tło przyciemnione, łatwe zamknięcie).

### 2) Warstwa CSS
Dodać nowe klasy/selektory:
- styl czerwonego przycisku (`background`, `border`, `hover`, `active`),
- `position: fixed; right: ...; bottom: ...; z-index: ...;` dla przycisku,
- style ukrycia/pokazania GIF-a (`display: none` + klasa aktywna lub `hidden`),
- przy overlay:
  - pełnoekranowy kontener (`inset: 0`),
  - wyśrodkowanie GIF-a,
  - ograniczenie rozmiaru GIF-a (`max-width`, `max-height`) dla mobile.

### 3) Warstwa JavaScript
Dodać prosty skrypt na końcu `body`:
- nasłuchiwanie kliknięcia na `#secretButton`,
- ustawienie widoczności GIF-a (`classList.add('is-open')` / `hidden = false`),
- opcjonalnie możliwość zamknięcia (klik poza GIF, przycisk „Zamknij”, klawisz `Escape`).

## Decyzje UX i dostępność
1. **Czy GIF ma się tylko pokazać, czy przełączać (toggle)?**
   - rekomendacja: toggle (drugie kliknięcie ukrywa),
   - alternatywa: zawsze pokazuje, zamykanie osobnym mechanizmem.
2. **Dostępność (a11y):**
   - użyć semantycznego `<button>`,
   - dodać `aria-label` jeśli potrzeba,
   - umożliwić zamknięcie przez klawiaturę (`Escape`).
3. **Responsywność:**
   - na małych ekranach przycisk nie może zasłaniać kluczowych elementów,
   - GIF ograniczony do wymiarów viewportu.

## Ryzyka i pułapki
1. **Ścieżka zasobu GIF:**
   - w `Kalkulator/index.html` poprawne odwołanie to najpewniej `src="Koza.gif"` (a nie `Kalkulator/Koza.gif`, bo to byłoby zdublowanie katalogu w kontekście tego pliku).
2. **Nakładanie warstw (`z-index`):**
   - przycisk i GIF muszą być nad `<main>`.
3. **Spójność wizualna:**
   - czerwony przycisk będzie celowo kontrastował z zielonym motywem; warto dobrać odcienie, by zachować czytelność.

## Minimalny plan wdrożenia (krok po kroku)
1. Dodać HTML przycisku i ukrytego kontenera GIF.
2. Dodać CSS dla przycisku (fixed, prawy-dolny róg) i widoku GIF.
3. Dodać JS obsługujący kliknięcie i zmianę widoczności.
4. Przetestować:
   - desktop,
   - mobile/symulacja małego viewportu,
   - wielokrotne kliknięcia,
   - zamykanie GIF-a.

## Kryteria akceptacji
1. Na stronie `Kalkulator/index.html` widoczny jest czerwony przycisk „Tajny przycisk!” w prawym dolnym rogu.
2. Kliknięcie przycisku powoduje wyświetlenie `Koza.gif`.
3. Funkcja działa stabilnie przy kolejnych kliknięciach i na różnych rozdzielczościach.
4. Istniejące elementy strony (`Kalkulator XP`, `Tworzenie Postaci`, logo) zachowują poprawne działanie.

## Szacowanie prac
- Implementacja: ~20–40 minut.
- Testy manualne + drobne poprawki stylu: ~15–30 minut.
- Łącznie: ~35–70 minut.

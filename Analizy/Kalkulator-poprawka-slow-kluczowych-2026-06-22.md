# Poprawka drugiego pola Słowa Kluczowe

Data: 2026-06-22
Zakres: `Kalkulator/vendor/pdf-lib.min.js`.

Błąd eksportu wynikał z wywołania `setFontSize()` przed dodaniem nowego pola `Słowa Kluczowe 2` do strony PDF.

Poprawiona kolejność:

1. utworzenie pola,
2. dodanie pola do strony,
3. ustawienie tekstu,
4. ustawienie rozmiaru fontu,
5. aktualizacja wyglądu pola.

Dodatkowo dodano mechanizm awaryjny: jeżeli utworzenie drugiego pola formularza nie powiedzie się, druga linia zostanie narysowana bezpośrednio na stronie PDF. Dzięki temu błąd pojedynczego pola nie powinien już przerwać generowania całego dokumentu.

Do sprawdzenia po `Ctrl+F5`:

- długie Słowa Kluczowe w dwóch liniach,
- brak błędu `setFontSize`,
- poprawne polskie znaki,
- prawidłowe wygenerowanie całego PDF.

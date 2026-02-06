# Generator Nazw — instrukcja użytkownika

## PL — Instrukcja

### Cel modułu
Generator Nazw służy do szybkiego tworzenia nazw postaci, pojazdów i okrętów w klimacie WH40K.
Tytuł karty przeglądarki: **Generator Nazw**.

### Jak używać
1. W prawym górnym rogu panelu wybierz język (domyślnie **Polski**).
2. **Wybierz kategorię** w polu „Kategoria”.
3. **Wybierz opcję** w polu „Opcja” (np. frakcję lub wariant stylu).
4. (Opcjonalnie) **Wpisz „Seed”** — dowolny tekst, który ustala powtarzalność wyników.
5. **Ustaw liczbę wyników** w polu „Ile”.
6. Kliknij **„Generuj”**, aby otrzymać listę nazw.
7. Kliknij **„Kopiuj wynik”**, aby skopiować wygenerowaną listę do schowka.

### Wskazówki
- Ten sam **Seed** + te same ustawienia = te same wyniki.
- Puste pole **Seed** oznacza losowość opartą o generator przeglądarki.

### Ręczna zmiana nazw kategorii i opcji
Nazwy kategorii i opcji są zdefiniowane bezpośrednio w `GeneratorNazw/script.js` w tablicy `DATA`.
Jeśli chcesz je zmienić:
1. Otwórz `GeneratorNazw/script.js`.
2. W wybranym wpisie kategorii edytuj pola `name` (PL) i `nameEn` (EN).
3. W wybranych opcjach edytuj pola `name` (PL) i `nameEn` (EN).
4. Zapisz plik i odśwież stronę.

---

## EN — User instructions

### Module purpose
Generator Nazw is a quick name generator for WH40K‑style characters, vehicles, and ships.
Browser tab title: **Generator Nazw**.

### How to use
1. Use the language switcher in the top-right corner of the panel (Polish is selected by default).
2. **Choose a category** in the “Kategoria” dropdown.
3. **Choose an option** in the “Opcja” dropdown (e.g., faction or style variant).
4. (Optional) **Enter a Seed** — any text that makes results repeatable.
5. **Set the number of results** in the “Ile” field.
6. Click **“Generuj”** to create a list of names.
7. Click **“Kopiuj wynik”** to copy the list to the clipboard.

### Tips
- The same **Seed** + the same settings = identical results.
- An empty **Seed** uses true randomness from the browser.

### Manual category/option name changes
Category and option names are defined directly in `GeneratorNazw/script.js` inside the `DATA` array.
To edit them:
1. Open `GeneratorNazw/script.js`.
2. For a category entry, update the `name` (PL) and `nameEn` (EN) fields.
3. For option entries, update the `name` (PL) and `nameEn` (EN) fields.
4. Save the file and refresh the page.

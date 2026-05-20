# Generator Nazw — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
**Generator Nazw** tworzy gotowe nazwy w klimacie Warhammer 40k (postacie, pojazdy, okręty i inne style zależnie od wybranej kategorii).

### Jak używać
1. Otwórz `GeneratorNazw/index.html`.
2. W polu **Kategoria** wybierz obszar, z którego chcesz nazwy.
3. W polu **Opcja** doprecyzuj styl, na przykład frakcję albo wariant.
4. Opcjonalnie w polu **Seed** wpisz własny tekst, jeśli chcesz mieć powtarzalne wyniki.
5. W polu **Ile** ustaw liczbę propozycji.
6. Kliknij **Generuj**.
7. Kliknij **Kopiuj wynik**, aby skopiować listę do schowka.

Przełącznik języka jest obecnie ukryty w interfejsie użytkownika. Kod zawiera przygotowaną obsługę wersji PL/EN, ale zwykły użytkownik nie wybiera języka z poziomu strony.


## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

Przełącznik języka jest ukryty, ale gotowy do użycia; miejsce zmiany widoczności jest opisane komentarzem w `index.html`.

## 🇬🇧 User instructions (EN)

The language switcher is hidden but ready to use; the visibility change point is described by a comment in `index.html`.

### What this module is for
**Name Generator** creates Warhammer 40k-style names (characters, vehicles, ships, and other sets depending on category).

### How to use
1. Open `GeneratorNazw/index.html`.
2. In **Category**, choose the name family you want.
3. In **Option**, narrow the style, for example faction or variant.
4. Optionally enter **Seed** for repeatable output.
5. Set how many names in **Count**.
6. Click **Generate**.
7. Click **Copy result** to copy the list to clipboard.

The language switcher is currently hidden in the user interface. The code already contains PL/EN language support, but a regular user does not choose the language from the page.


## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.



# Generator Nazw — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy moduł
**Generator Nazw** tworzy gotowe nazwy w klimacie Warhammer 40k (postacie, pojazdy, okręty i inne style zależnie od wybranej kategorii).

### Jak używać
1. Otwórz `GeneratorNazw/index.html`.
2. W prawym górnym rogu wybierz język.
3. W polu **Kategoria** wybierz obszar, z którego chcesz nazwy.
4. W polu **Opcja** doprecyzuj styl (np. frakcję albo wariant).
5. (Opcjonalnie) w polu **Seed** wpisz własny tekst, jeśli chcesz mieć powtarzalne wyniki.
6. W polu **Ile** ustaw liczbę propozycji.
7. Kliknij **Generuj**.
8. Kliknij **Kopiuj wynik**, aby skopiować listę do schowka.

### Jak czytać pasek pod przyciskami
- Informacja typu **Losowo: TAK/NIE** podpowiada, czy wynik jest w pełni losowy.
- Jeśli wpiszesz seed, generator tworzy ten sam zestaw przy tych samych ustawieniach.

### Praktyczne scenariusze
- **Szybkie imię NPC**: kategoria + opcja + „Ile: 1”, potem Generuj.
- **Lista nazw dla drużyny**: „Ile: 10–20”, potem kopiuj i wklej do notatek.
- **Powtarzalne nazwy do kampanii**: używaj jednego seeda dla spójności stylu.

### Wskazówki
- Zmień kategorię, jeśli wyniki nie pasują klimatem.
- Zmieniaj seed jednym znakiem, gdy chcesz podobny, ale nie identyczny zestaw.
- Najszybciej pracuje się: wybór kategorii → generuj → kopiuj.

---

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

## 🇬🇧 User instructions (EN)

### What this module is for
**Name Generator** creates Warhammer 40k-style names (characters, vehicles, ships, and other sets depending on category).

### How to use
1. Open `GeneratorNazw/index.html`.
2. Use top-right language switch.
3. In **Category**, choose the name family you want.
4. In **Option**, narrow the style (e.g., faction/variant).
5. (Optional) enter **Seed** for repeatable output.
6. Set how many names in **Count**.
7. Click **Generate**.
8. Click **Copy result** to copy the list to clipboard.

### How to read the status pill
- **Random: YES/NO** indicates whether output is fully random.
- With the same seed + same settings, results stay identical.

### Practical use cases
- **Quick NPC name**: category + option + count 1, then generate.
- **Party name shortlist**: count 10–20, generate, then copy.
- **Campaign consistency**: reuse one seed for a coherent naming style.

### Tips
- Switch category if tone does not fit your scene.
- Change seed slightly for similar-but-fresh results.
- Fast flow: choose category → generate → copy.

## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

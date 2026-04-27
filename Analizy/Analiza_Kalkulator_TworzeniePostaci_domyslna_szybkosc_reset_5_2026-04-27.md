# Analiza zmiany: domyślna wartość atrybutu „Szybkość” po resecie strony

## Prompt użytkownika
> Przeprowadź analizę pliku /Kalkulator/TworzeniePostaci.html
>
> Chciałbym, żeby domyślna wartość w atrybucie szybkość po resecie strony wynosiła "5".
> Inne wartości domyślne, sposoby obliczeń itp. mają się nie zmieniać.
>
> Przeprowadź analizę wprowadzenia takiej zmiany.

## Zakres analizy
- Plik: `Kalkulator/TworzeniePostaci.html`
- Cel: ocena wpływu zmiany domyślnej wartości tylko dla `attr_Speed` po resecie.
- Ograniczenie: bez zmiany pozostałych wartości domyślnych, walidacji i logiki kosztów XP.

## Stan obecny (przed zmianą)
1. Pole `attr_Speed` ma wartość początkową `1` w HTML (`value="1"`).
2. Funkcja `resetAll()` ustawia wszystkie atrybuty (`S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`, `Speed`) na `1`.
3. Mechanizm `attachDefaultOnBlur("input[id^='attr_']", 1)` również przywraca `1`, gdy pole atrybutu zostanie wyczyszczone lub ma wartość nienumeryczną.
4. Kalkulacja XP (`recalcXP`) i ograniczenia min/max (`1..12`) działają wspólnie dla wszystkich atrybutów i nie rozróżniają domyślnej wartości szybkości.

## Wniosek: gdzie trzeba wprowadzić zmianę
Aby **po resecie strony** `Szybkość` miała `5`, a reszta pozostała bez zmian, wystarczy:
- w `resetAll()` po pętli ustawiającej atrybuty na `1` nadpisać tylko `attr_Speed` na `5`.

Przykład minimalnej zmiany (koncepcyjnie):
```js
['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd', 'Speed'].forEach(id => {
  document.getElementById(`attr_${id}`).value = 1;
});
document.getElementById('attr_Speed').value = 5;
```

## Dlaczego to spełnia wymaganie
- Zmienia się wyłącznie efekt resetu (`resetAll`).
- Nie zmieniają się:
  - domyślne wartości innych atrybutów,
  - sposób liczenia kosztów i pozostałego XP,
  - walidacje zakresów,
  - logika umiejętności i talentów.

## Ryzyka i skutki uboczne
1. **Różnica między resetem a „blur default” dla atrybutów**: po tej zmianie reset da `Speed=5`, ale ręczne wyczyszczenie pola i utrata fokusu nadal ustawi `1` (bo `attachDefaultOnBlur` jest wspólne dla wszystkich atrybutów). Jest to zgodne z wymaganiem „po resecie”, ale warto mieć świadomość różnicy zachowania.
2. **Różnica między startem strony a resetem**: jeżeli nie zmieniamy `value` w HTML, pierwsze wejście na stronę nadal rozpocznie się od `Speed=1`, a dopiero reset ustawi `5`. To również jest zgodne z literalnym wymaganiem.

## Opcjonalna decyzja produktowa (bez wdrażania w tej analizie)
Jeżeli w przyszłości oczekiwane byłoby `Speed=5` także:
- przy pierwszym otwarciu strony,
- po wyczyszczeniu pola i blur,
to trzeba dodatkowo zmienić odpowiednio `value` pola `attr_Speed` i logikę `attachDefaultOnBlur` dla `attr_Speed`.

## Rekomendacja wdrożeniowa
- Wprowadzić wyłącznie zmianę w `resetAll()` (nadpisanie `attr_Speed` na `5`), bez modyfikacji pozostałych sekcji.
- Po wdrożeniu sprawdzić ręcznie dwa scenariusze:
  1. klik „Reset” -> `Szybkość` = `5`, inne atrybuty = `1`;
  2. wyczyszczenie pola `Szybkość` i opuszczenie pola -> wartość wraca do `1` (obecna logika globalna).

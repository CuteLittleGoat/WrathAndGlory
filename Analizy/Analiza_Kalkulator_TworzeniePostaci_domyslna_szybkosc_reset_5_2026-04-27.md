# Analiza zmiany: domyślna wartość atrybutu „Szybkość” przy wejściu na stronę i po resecie

## Prompt użytkownika (oryginalny)
> Przeprowadź analizę pliku /Kalkulator/TworzeniePostaci.html
>
> Chciałbym, żeby domyślna wartość w atrybucie szybkość po resecie strony wynosiła "5".
> Inne wartości domyślne, sposoby obliczeń itp. mają się nie zmieniać.
>
> Przeprowadź analizę wprowadzenia takiej zmiany.

## Prompt użytkownika (doprecyzowanie z 2026-04-27)
> Przeczytaj i rozbuduj analizę Analizy/Analiza_Kalkulator_TworzeniePostaci_domyslna_szybkosc_reset_5_2026-04-27.md o doprecyzowanie wymagań. Każde wejście na stronę ma domyślnie ustawić wartość Szybkość na 6.
> W pierwotnej analizie była mowa o Szybkość = 5. To błąd. Ma być 6.
> Przy wejściu na stronę i przy resecie Szybkość ma przyjmować domyślnie wartość 6.
>
> Użytkownik będzie mógł zmieniać tę wartość (jak każdego innego atrybutu) i ma to wpływać na obliczenia.

## Status wymagania
- Poprzednia wartość docelowa (`Szybkość = 5`) jest **nieaktualna**.
- Aktualne wymaganie docelowe:
  - **przy pierwszym wejściu na stronę**: `Szybkość = 6`,
  - **po użyciu resetu**: `Szybkość = 6`,
  - **po ręcznej zmianie przez użytkownika**: nowa wartość `Szybkość` ma normalnie wpływać na wszystkie obliczenia.

## Zakres analizy
- Plik: `Kalkulator/TworzeniePostaci.html`
- Cel: dostosowanie zachowania pola `attr_Speed` tak, aby domyślna wartość była spójnie równa `6` zarówno na starcie widoku, jak i po resecie.
- Ograniczenie: pozostałe atrybuty i ich domyślne wartości mają pozostać bez zmian.

## Stan obecny (przed zmianą)
1. Pole `attr_Speed` ma wartość początkową ustawioną jak inne atrybuty (`1`).
2. `resetAll()` ustawia komplet atrybutów (`S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`, `Speed`) na `1`.
3. Logika obliczeń (np. `recalcXP`) bierze bieżące wartości pól i przelicza koszty dynamicznie.

## Wymagane doprecyzowanie implementacyjne
Aby spełnić nowe wymaganie, potrzebne są dwie zmiany funkcjonalne:

1. **Start strony (pierwsze wejście)**
   - `attr_Speed` musi mieć domyślnie `6` od razu po załadowaniu widoku.
   - Technicznie można to osiągnąć przez zmianę wartości startowej pola (`value`) albo przez inicjalizację wykonywaną po załadowaniu DOM.

2. **Reset**
   - `resetAll()` po ustawieniu atrybutów bazowych na `1` powinien nadpisać wyłącznie `attr_Speed` na `6`.

Przykład minimalnej logiki resetu (koncepcyjnie):
```js
['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd', 'Speed'].forEach(id => {
  document.getElementById(`attr_${id}`).value = 1;
});
document.getElementById('attr_Speed').value = 6;
```

## Doprecyzowanie zachowania użytkowego
- `Szybkość = 6` jest wartością **domyślną**, nie zablokowaną.
- Użytkownik może ją zmienić ręcznie tak jak inne atrybuty.
- Każda ręczna zmiana `Szybkości` ma być natychmiast uwzględniana przez istniejące obliczenia (XP, pochodne statystyki itp., zgodnie z aktualną logiką modułu).

## Ryzyka i punkty do decyzji
1. **Spójność z mechanizmem „blur default”**
   - Jeżeli istnieje globalna logika przywracania pustego/nienumerycznego atrybutu do `1`, to dla `Szybkości` może wystąpić niespójność względem nowej wartości domyślnej `6`.
   - Decyzja: albo zostawić tę różnicę (jeżeli wymaganie dotyczy tylko wejścia/resetu), albo dodać wyjątek dla `attr_Speed` również w tym mechanizmie.

2. **Zakres testów manualnych po wdrożeniu**
   - wejście na stronę: `Szybkość` startuje od `6`,
   - reset: `Szybkość` wraca do `6`, inne atrybuty wracają wg obecnych reguł,
   - ręczna zmiana `Szybkości`: obliczenia przeliczają się poprawnie,
   - (opcjonalnie) wyczyszczenie pola i utrata fokusu: potwierdzenie zachowania zgodnie z decyzją projektową.

## Rekomendacja końcowa
- Zastąpić we wcześniejszej analizie wszystkie założenia `Speed = 5` nowym, obowiązującym wymaganiem `Speed = 6`.
- Wdrożyć zmianę tylko w punktach odpowiedzialnych za:
  1) wartość startową po wejściu na stronę,
  2) wartość po resecie.
- Nie zmieniać logiki samych obliczeń — mają korzystać z aktualnej wartości ustawionej przez użytkownika.

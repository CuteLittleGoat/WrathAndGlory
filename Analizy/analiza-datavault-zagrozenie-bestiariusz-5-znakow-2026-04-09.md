# Analiza modułu DataVault — kolumna „Zagrożenie” (Bestiariusz)

## Prompt użytkownika
> Przeprowadź analizę modułu DataVault. Interesuje mnie kolumna "Zagrożenie" w zakładce Bestiariusz.  
> Obecnie wszystkie wartości mają 4 znaki lub 1 znak ("?"). Jest to zaciągane z pliku wsadowego.  
> Czy coś się stanie jak niektóre wpisy będą miały 5 znaków?

## Zakres analizy
- Sprawdzono sposób **wczytywania danych** (JSON/XLSX) do modułu DataVault.
- Sprawdzono sposób **renderowania komórek** tabeli.
- Sprawdzono reguły CSS dla kolumny **Bestiariusz → Zagrożenie**.
- Sprawdzono aktualny stan danych w `data.json` dla tej kolumny.

## Ustalenia techniczne

1. **Brak walidacji długości dla pola „Zagrożenie” podczas importu danych.**  
   Wczytanie z XLSX (`sheet_to_json`) i budowa struktury danych nie zawiera reguły typu „dokładnie 4 znaki” dla tej kolumny.

2. **Brak przycinania (truncation) wartości podczas renderowania.**  
   Komórki są renderowane przez ogólne formatowanie tekstu (`formatTextHTML`), bez `slice`, `substring` ani dedykowanej logiki skracającej pole „Zagrożenie”.

3. **CSS ustawia minimum szerokości, nie maksimum.**  
   Dla kolumny `Zagrożenie` jest `min-width: 4ch`, a nie `max-width` ani `width` wymuszające sztywną szerokość. To oznacza, że tekst 5-znakowy będzie mógł się wyświetlić.

4. **Tabela i viewport dopuszczają naturalne rozszerzanie zawartości.**  
   Brak `table-layout: fixed`; kontener tabeli ma `overflow: auto`, więc ewentualne poszerzenie szerokości jest obsługiwane przewijaniem.

5. **Aktualny stan danych potwierdza obserwację użytkownika.**  
   W bieżącym `data.json` w Bestiariuszu występują tylko długości `4` i `1` (`?`):
   - liczba rekordów: `70`
   - rozkład długości: `{1: 8, 4: 62}`

## Odpowiedź na pytanie

**Najpewniej nic krytycznego się nie stanie, jeśli część wpisów będzie miała 5 znaków.**

Praktyczny efekt będzie głównie wizualny:
- wartość 5-znakowa po prostu się wyświetli,
- kolumna może minimalnie się poszerzyć,
- w węższych widokach może wzrosnąć szansa poziomego scrolla (co i tak jest wspierane przez obecny layout).

Nie widać ryzyka:
- błędu importu,
- ucięcia wartości,
- awarii filtrowania/sortowania wynikającej wyłącznie z długości 5 znaków.

## Rekomendacja

Jeżeli 5-znakowe wartości mają być dopuszczone „na stałe”, warto jedynie:
- zaktualizować opis dokumentacyjny, gdzie obecnie widnieje `4ch` dla tej kolumny,
- ewentualnie podnieść `min-width` tej kolumny z `4ch` do `5ch` dla spójności wizualnej.

# Kolumny — szerokości, wyrównania i łamanie linii (DataVault)

Dokument opisuje **aktualny wygląd** kolumn wszystkich zakładek modułu `DataVault`. Wartości są odczytane z obliczonych stylów w przeglądarce (`getComputedStyle`) dla `DataVault/style.css` przy szerokości okna 1920 px — nie z lektury pliku CSS, bo kaskada potrafi po cichu unieważnić regułę.

## Zasady wspólne

- Kolejność zakładek pochodzi z `_meta.sheetOrder` w danych (czyli z kolejności arkuszy w `Repozytorium.xlsx`), a kolejność kolumn — z `_meta.columnOrder`.
- Kolumny techniczne `LP` i `Stan` są ukrywane (`HIDDEN_COLUMNS`) i nie występują w tabelach poniżej.
- Kolumna zaznaczania `✓` ma we wszystkich zakładkach stałe `min-width` = `max-width` = `width` = `5ch` i jest wyśrodkowana.
- Kolumny `Podręcznik` (17ch, do lewej) i `Strona` (6ch, wyśrodkowana, kolor `var(--code)`) ustawia wyłącznie jeden blok globalny w `style.css`, wspólny dla wszystkich zakładek. Reguły pojedynczych zakładek ich nie powtarzają; ewentualny wyjątek musiałby stać w pliku poniżej bloku globalnego.
- Nagłówek kolumny ma zawsze tę samą szerokość minimalną, wyrównanie i łamanie co komórki tej kolumny.
- „auto” oznacza brak reguły szerokości — kolumna dostaje szerokość wynikającą z treści i z miejsca w tabeli; „brak” w kolumnie Max-width oznacza `max-width: none`.
- Łamanie „standard”: komórka ma `white-space: normal`, a treść w `.celltext` — `pre-wrap` (zachowuje entery z danych). „Bez łamania” to `white-space: nowrap`.
- Komórki z treścią dłuższą niż 9 linii są zwijane i rozwijane kliknięciem.
- Na telefonie (szerokość okna do 720 px) tabela zamienia się w karty i szerokości kolumn nie obowiązują.
- Zakładki oznaczone „tylko admin” są widoczne wyłącznie w trybie `?admin=1`.

## Notatki (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Bestiariusz (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Zagrożenie | 5ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| S | 3ch | brak | środek | standard |
| Wt | 3ch | brak | środek | standard |
| Zr | 3ch | brak | środek | standard |
| I | 3ch | brak | środek | standard |
| SW | 3ch | brak | środek | standard |
| Int | 3ch | brak | środek | standard |
| Ogd | 3ch | brak | środek | standard |
| Odporność (w tym WP) | 3ch | brak | środek | standard |
| Wartość Pancerza | 3ch | brak | środek | standard |
| Obrona | 3ch | brak | środek | standard |
| Żywotność | 3ch | brak | środek | standard |
| Odporność Psychiczna | 3ch | brak | środek | standard |
| Umiejętności | 28ch | brak | lewo | standard |
| Premie | 60ch | brak | lewo | standard |
| Zdolności | 60ch | brak | lewo | standard |
| Atak | 50ch | brak | lewo | standard |
| Zdolności Hordy | 60ch | brak | lewo | standard |
| Opcje Hordy | 60ch | brak | lewo | standard |
| Upór | 3ch | brak | środek | standard |
| Odwaga | 3ch | brak | środek | standard |
| Szybkość | 3ch | brak | środek | standard |
| Rozmiar | 7ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Kolumny `LP` i `Stan` są w danych, ale ukrywa je `HIDDEN_COLUMNS`; wpisy ze `Stan` = `old` są ukryte, dopóki admin nie zaznaczy „Czy wyświetlić zdezaktualizowane wpisy?”.

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Hordy (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa zasady | 26ch | brak | lewo | standard |
| Opis zasady | 60ch | brak | lewo | standard |
| Przykład | 60ch | brak | lewo | standard |

## Specjalne Bonusy Wrogów (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | 26ch | brak | lewo | standard |
| Rodzaj | 26ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |

## Tabela Rozmiarów

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rozmiar | 8ch | brak | lewo | standard |
| Modyfikator Testu Ataku | 26ch | brak | środek | standard |
| Zmniejszenie Poziomu Ukrycia | 26ch | brak | środek | standard |
| Przykłady | 85ch | brak | lewo | standard |

## Gatunki

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Gatunek | 26ch | brak | lewo | standard |
| Koszt PD | 4ch | brak | środek | standard |
| Atrybuty | 26ch | brak | lewo | standard |
| Umiejętności | 26ch | brak | lewo | standard |
| Szybkość | 4ch | brak | środek | standard |
| Rozmiar | 10ch | brak | środek | standard |
| Zdolności gatunkowe | 46ch | brak | lewo | standard |

## Archetypy

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Poziom | 2ch | brak | środek | standard |
| Frakcja | 26ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Gatunek | 26ch | brak | lewo | standard |
| Koszt PD | 4ch | brak | środek | standard |
| Słowa Kluczowe | 26ch | brak | lewo | standard |
| Atrybuty Archetypu | 26ch | brak | lewo | standard |
| Umiejętności Archetypu | 26ch | brak | lewo | standard |
| Zdolność Archetypu | 46ch | brak | lewo | standard |
| Ekwipunek | 46ch | brak | lewo | standard |
| Inne | 10ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Pakiety Wyniesienia

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Koszt PD | 26ch | brak | lewo | standard |
| Wymagania | 26ch | brak | lewo | standard |
| Słowa Kluczowe | 26ch | brak | lewo | standard |
| Premia Wpływu | 26ch | brak | lewo | standard |
| Pamiętna historia | 46ch | brak | lewo | standard |
| Ekwipunek | 46ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Kolumna `Słowa Kluczowe` jest formatowana jak zwykły tekst (znaczniki z Excela), bez automatycznego czerwonego koloru.

## Premie z Przeszłości Frakcji

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | 26ch | brak | lewo | standard |
| Premia 1 | 56ch | brak | lewo | standard |
| Premia 2 | 56ch | brak | lewo | standard |
| Premia 3 | 56ch | brak | lewo | standard |

## Słowa Kluczowe Frakcji

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | 28ch | brak | lewo | standard |
| Słowo Kluczowe | 28ch | brak | lewo | standard |
| Opis | 26ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |

- Kolumna `Słowo Kluczowe` jest formatowana osobno (`formatFactionKeywordHTML`).

## Specjalne Bonusy Frakcji

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | 26ch | brak | lewo | standard |
| Rodzaj | 26ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |

## Mutacje

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | bez łamania |
| Stopień Nasilenia Mutacji | 22ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Zakładka z grupy tworzenia postaci. Na telefonie karty są grupowane według kolumny `Stopień Nasilenia Mutacji` (`GROUPING_COLUMN_OVERRIDES`).

## Implanty Astartes

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Numer | 4ch | brak | środek | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 26ch | brak | lewo | standard |

## Zakony Pierwszego Powołania

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Zaleta | 26ch | brak | lewo | standard |
| Wada | 26ch | brak | lewo | standard |

## Cechy

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |

## Stany

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |

## Słowa Kluczowe

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |

- Wartości kolumny `Nazwa` są czerwone.

## Talenty

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Koszt PD | 4ch | brak | środek | standard |
| Wymagania | 26ch | brak | lewo | standard |
| Opis | 26ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Modlitwy

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Koszt PD | 4ch | brak | środek | standard |
| Wymagania | 26ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Psionika

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Koszt PD | 4ch | brak | środek | standard |
| ST | 10ch | brak | środek | standard |
| Aktywacja | 10ch | brak | lewo | standard |
| Czas Trwania | 15ch | brak | lewo | standard |
| Zasięg | 8ch | brak | środek | standard |
| Wiele Celów | 4ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Wzmocnienie | 26ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Augumentacje

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |
| Koszt | 3ch | brak | środek | standard |
| Dostępność | 3ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Ekwipunek

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |
| Koszt | 3ch | brak | środek | standard |
| Dostępność | 3ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Pancerze

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| WP | 4ch | brak | środek | standard |
| Cechy | 32ch | brak | lewo | standard |
| Koszt | 4ch | brak | środek | standard |
| Dostępność | 4ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- `Cechy` powstaje ze scalenia kolumn `Cecha 1`…`Cecha N` z XLSX (separator `; `); cechy są klikalnymi tagami z opisem w dymku.

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Bronie

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rodzaj | 14ch | brak | lewo | standard |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Obrażenia | auto | brak | środek | standard |
| DK | auto | brak | środek | standard |
| PP | auto | brak | środek | standard |
| Zasięg | 18ch | brak | środek | bez łamania |
| Szybkostrzelność | 8ch | brak | środek | standard |
| Cechy | 32ch | brak | lewo | standard |
| Koszt | 4ch | brak | środek | standard |
| Dostępność | 4ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- `Zasięg` powstaje ze scalenia `Zasięg 1`…`Zasięg 3` w formacie `krótki / średni / daleki`; `Cechy` — ze scalenia `Cecha 1`…`Cecha N` (separator `; `), jako klikalne tagi.

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Obrzędy

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rodzaj | 14ch | brak | lewo | standard |
| Typ | 18ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Koszt | 4ch | brak | środek | standard |
| Dostępność | 4ch | brak | środek | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Trafienia Krytyczne (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | bez łamania |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |
| Chwała | 26ch | brak | lewo | standard |

## Groza Osnowy (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | bez łamania |
| Efekt | 56ch | brak | lewo | standard |

## Skrót Zasad

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 32ch | brak | lewo | standard |
| Nazwa | 20ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Tryby Ognia

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 20ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |

## Kary do ST

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Ile celów/akcji | 20ch | 20ch | środek | standard |
| Kara do ST | 20ch | 20ch | środek | standard |

- Tabela ma `table-layout: fixed` i szerokość `max-content`, a obie kolumny także `width: 20ch`.

## Uszkodzenia Pojazdów (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | bez łamania |
| Efekt | 56ch | brak | lewo | standard |

- Zakładka tylko dla admina.

## Eksplozje Pojazdów (tylko admin)

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rozmiar Pojazdu | 20ch | 20ch | lewo | standard |
| Zasięg Rażenia | 14ch | 14ch | środek | standard |
| Obrażenia | 14ch | 14ch | środek | standard |

- Zakładka tylko dla admina. Tabela ma `table-layout: fixed` i szerokość `max-content`, a kolumny także `width` równe szerokości minimalnej.

## Role W Pojeździe

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rola | 14ch | brak | lewo | standard |
| Akcje Pojazdu | 60ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Akcje Pojazdu

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Przykład | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Stany Pojazdów

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Cechy Pojazdów

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 22ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

## Pojazdy

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 30ch | brak | lewo | standard |
| Koszt | 10ch | brak | środek | standard |
| Dostępność | 10ch | brak | środek | standard |
| Szybkość | 10ch | brak | środek | standard |
| Manewrowość | 10ch | brak | środek | standard |
| Odporność | 10ch | brak | środek | standard |
| Żywotność | 10ch | brak | środek | standard |
| Rozmiar | 10ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Skład Załogi | 22ch | brak | lewo | standard |
| Cechy | 32ch | brak | lewo | standard |
| Uzbrojenie | 36ch | brak | lewo | standard |
| Wyposażenie | 32ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- `Cechy` powstaje ze scalenia `Cecha 1`…`Cecha N` (separator `; `).

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Bronie Pojazdów

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rodzaj | 14ch | brak | lewo | standard |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Obrażenia | 8ch | brak | środek | standard |
| DK | 8ch | brak | środek | standard |
| PP | 8ch | brak | środek | standard |
| Zasięg | 18ch | brak | środek | bez łamania |
| Szybkostrzelność | 8ch | brak | środek | standard |
| Cechy | 32ch | brak | lewo | standard |
| Koszt | 8ch | brak | środek | standard |
| Dostępność | 8ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- `Zasięg` powstaje ze scalenia `Zasięg 1`…`Zasięg 3` w formacie `krótki / średni / daleki`; `Cechy` — ze scalenia `Cecha 1`…`Cecha N` (separator `; `).

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

## Ekwipunek Pojazdów

| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 14ch | brak | lewo | standard |
| Nazwa | 26ch | brak | lewo | standard |
| Opis | 48ch | brak | lewo | standard |
| Efekt | 56ch | brak | lewo | standard |
| Koszt | 8ch | brak | środek | standard |
| Dostępność | 8ch | brak | środek | standard |
| Słowa Kluczowe | 28ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | środek | standard |
| Podręcznik | 17ch | brak | lewo | standard |
| Strona | 6ch | brak | środek | standard |

- Słowa w kolumnie `Słowa Kluczowe` są czerwone, przecinki — w kolorze zwykłego tekstu.

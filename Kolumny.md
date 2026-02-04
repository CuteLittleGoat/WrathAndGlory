# Kolumny — szerokości, wyrównania i łamanie linii

Poniżej znajduje się spis **wszystkich kolumn** wykorzystywanych w module DataVault, podzielony na zakładki. Kolejność kolumn jest zawsze pobierana z pierwszego wiersza arkusza w `Repozytorium.xlsx` (lub z wygenerowanego `data.json`) — to zestawienie odzwierciedla stan bieżącego pliku. W arkuszach zawierających kolumny `Cecha 1..N` oraz `Zasięg 1..3` aplikacja scala je odpowiednio do `Cechy` i `Zasięg` w miejscu pierwszego nagłówka. **Pierwsza kolumna (Wybór ✓) ma stałą szerokość 8ch (min/max/width) we wszystkich zakładkach i nie rozszerza się wraz z oknem.** Wartości „auto” oznaczają brak ustawionego `min-width` w CSS (szerokość zależna od zawartości i dostępnego miejsca). W kolumnie **Max-width** wpis „brak” oznacza, że w CSS nie zdefiniowano maksymalnej szerokości dla danej kolumny. Domyślnie tekst jest **wyrównany do lewej**, a zawartość łamie się zgodnie z `white-space: pre-wrap` w `.celltext`, o ile nie zaznaczono inaczej.

## Bestiariusz
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Zagrożenie | 4ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  S | 3ch | brak | środek | standard  |
|  Wt | 3ch | brak | środek | standard  |
|  Zr | 3ch | brak | środek | standard  |
|  I | 3ch | brak | środek | standard  |
|  SW | 3ch | brak | środek | standard  |
|  Int | 3ch | brak | środek | standard  |
|  Ogd | 3ch | brak | środek | standard  |
|  Odporność (w tym WP) | 3ch | brak | środek | standard  |
|  Wartość Pancerza | 3ch | brak | środek | standard  |
|  Obrona | 3ch | brak | środek | standard  |
|  Żywotność | 3ch | brak | środek | standard  |
|  Odporność Psychiczna | 3ch | brak | środek | standard  |
|  Umiejętności | 28ch | brak | lewo | standard  |
|  Premie | 60ch | brak | lewo | standard  |
|  Zdolności | 60ch | brak | lewo | standard  |
|  Atak | 50ch | brak | lewo | standard  |
|  Zdolności Hordy | 60ch | brak | lewo | standard  |
|  Opcje Hordy | 60ch | brak | lewo | standard  |
|  Upór | 3ch | brak | środek | standard  |
|  Odwaga | 3ch | brak | środek | standard  |
|  Szybkość | 3ch | brak | środek | standard  |
|  Rozmiar | 7ch | brak | środek | standard  |
|  Podręcznik | 17ch | brak | lewo | standard  |
|  Strona | 6ch | brak | środek | standard  |

## Tabela Rozmiarów
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Rozmiar | 8ch | brak | lewo | standard  |
|  Modyfikator Testu Ataku | 25ch | brak | środek | standard  |
|  Zmniejszenie Poziomu Ukrycia | 25ch | brak | środek | standard  |
|  Przykłady | 85ch | brak | lewo | standard  |

## Gatunki
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Gatunek | 26ch | brak | lewo | standard  |
|  Koszt PD | 4ch | brak | środek | standard  |
|  Atrybuty | 26ch | brak | lewo | standard  |
|  Umiejętności | 26ch | brak | lewo | standard  |
|  Zdolności gatunkowe | 46ch | brak | lewo | standard  |
|  Rozmiar | 10ch | brak | środek | standard  |
|  Szybkość | 4ch | brak | środek | standard  |

## Archetypy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Poziom | 2ch | brak | środek | standard  |
|  Frakcja | 26ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Koszt PD | 4ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Atrybuty Archetypu | 28ch | brak | lewo | standard  |
|  Umiejętności Archetypu | 28ch | brak | lewo | standard  |
|  Zdolność Archetypu | 46ch | brak | lewo | standard  |
|  Ekwipunek | 46ch | brak | lewo | standard  |
|  Inne | 10ch | brak | lewo | standard  |
|  Podręcznik | 17ch | brak | lewo | standard  |
|  Strona | 6ch | brak | środek | standard  |

## Bonusy Frakcji
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Frakcja | 26ch | brak | lewo | standard  |
|  Premia 1 | 56ch | brak | lewo | standard  |
|  Premia 2 | 56ch | brak | lewo | standard  |
|  Premia 3 | 56ch | brak | lewo | standard  |

## Słowa Kluczowe Frakcji
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Frakcja | 26ch | brak | lewo | standard  |
|  Słowo Kluczowe | 26ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Opis | 60ch | brak | lewo | standard  |

Uwagi formatowania:
- Kolumna **Słowo Kluczowe** jest renderowana na czerwono poza tokenami `-` i `lub`.
- Kursywa z arkusza (np. `lub`) jest zachowywana w treści.
- Token `[ŚWIAT-KUŹNIA]` jest w pełni czerwony, łącznie z myślnikiem.

## Implanty Astartes
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Numer | 4ch | brak | środek | standard  |
|  Nazwa | 30ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Zakony Pierwszego Powołania
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |
|  Zaleta | 46ch | brak | lewo | standard  |
|  Wada | 46ch | brak | lewo | standard  |

## Ścieżki Asuryani
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Orcze Klany
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |

## Mutacje Krootów
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Mutacja krootów | 22ch | brak | lewo | standard  |
|  Pożarta ofiara | 22ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Cechy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Stany
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Słowa Kluczowe
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Talenty
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Koszt PD | 4ch | brak | środek | standard  |
|  Wymagania | 26ch | brak | lewo | standard  |
|  Opis | 26ch | brak | lewo | standard  |
|  Efekt | 56ch | brak | lewo | standard  |

## Modlitwy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Koszt PD | 4ch | brak | środek | standard  |
|  Wymagania | 26ch | brak | lewo | standard  |
|  Efekt | 56ch | brak | lewo | standard  |

## Psionika
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Koszt PD | 4ch | brak | środek | standard  |
|  ST | 10ch | brak | środek | standard  |
|  Aktywacja | 10ch | brak | lewo | standard  |
|  Czas Trwania | 15ch | brak | lewo | standard  |
|  Zasięg | 8ch | brak | środek | standard  |
|  Wiele Celów | 4ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Efekt | 56ch | brak | lewo | standard  |
|  Opis | 26ch | brak | lewo | standard  |
|  Wzmocnienie | 26ch | brak | lewo | standard  |

## Augumentacje
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Koszt | 3ch | brak | środek | standard  |
|  Dostępność | 3ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Koszt IM | 8ch | brak | środek | standard  |

## Ekwipunek
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Koszt | 3ch | brak | środek | standard  |
|  Dostępność | 3ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Koszt IM | 8ch | brak | środek | standard  |

## Pancerze
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  WP | 4ch | brak | środek | standard  |
|  Cechy | 32ch | brak | lewo | standard  |
|  Koszt | 4ch | brak | środek | standard  |
|  Dostępność | 4ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Koszt IM | 8ch | brak | środek | standard  |
|  Podręcznik | 17ch | brak | lewo | standard  |
|  Strona | 6ch | brak | środek | standard  |

## Bronie
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Rodzaj | 14ch | brak | lewo | standard  |
|  Typ | 14ch | brak | lewo | standard  |
|  Nazwa | 26ch | brak | lewo | standard  |
|  Obrażenia | auto | brak | środek | standard  |
|  DK | auto | brak | środek | standard  |
|  PP | auto | brak | środek | standard  |
|  Zasięg | 18ch | brak | środek | brak łamania (`white-space: nowrap`)  |
|  Szybkostrzelność | 8ch | brak | środek | standard  |
|  Cechy | 32ch | brak | lewo | standard  |
|  Koszt | 4ch | brak | środek | standard  |
|  Dostępność | 4ch | brak | środek | standard  |
|  Słowa Kluczowe | 28ch | brak | lewo | standard  |
|  Koszt IM | 8ch | brak | środek | standard  |
|  Podręcznik | 17ch | brak | lewo | standard  |
|  Strona | 6ch | brak | środek | standard  |

## Trafienia Krytyczne
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Rzut k66 | 6ch | brak | środek | brak łamania (`white-space: nowrap`)  |
|  Opis | 56ch | brak | lewo | standard  |
|  Efekt | 26ch | brak | lewo | standard  |
|  Chwała | 26ch | brak | lewo | standard  |

## Groza Osnowy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Rzut k66 | 6ch | brak | środek | brak łamania (`white-space: nowrap`)  |
|  Efekt | 56ch | brak | lewo | standard  |

## Skrót Zasad
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Typ | 32ch | brak | lewo | standard  |
|  Nazwa | 20ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |
|  Strona | 11ch | brak | środek | brak łamania (`white-space: nowrap`)  |

## Tryby Ognia
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa | 20ch | brak | lewo | standard  |
|  Opis | 56ch | brak | lewo | standard  |

## Hordy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
|  Nazwa zasady | 26ch | brak | lewo | standard  |
|  Opis zasady | 60ch | brak | lewo | standard  |
|  Przykład | 60ch | brak | lewo | standard  |

## Kary do ST
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie | Auto-rozszerzanie |
| --- | --- | --- | --- | --- | --- |
|  Wybór (✓) | 8ch | 8ch | środek | standard | nie (stała szerokość) |
|  Ile celów/akcji | 20ch | 20ch | środek | standard | nie (stała szerokość) |
|  Kara do ST | 20ch | 20ch | środek | standard | nie (stała szerokość) |

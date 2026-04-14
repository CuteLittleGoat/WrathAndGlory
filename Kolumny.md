# Kolumny — szerokości, wyrównania i łamanie linii

Dokument został zaktualizowany na podstawie kodu modułu `DataVault` (`app.js`, `style.css`) oraz aktualnego `data.json`.

- Kolejność zakładek pochodzi z `_meta.sheetOrder` w `data.json`.
- Kolejność kolumn pochodzi z `_meta.columnOrder` (z fallbackiem do realnych kluczy rekordów).
- Kolumny techniczne `LP` są ukrywane w UI i nie występują w tabelach poniżej.
- Kolumna wyboru (`✓`) ma stałe `min-width/max-width/width = 8ch` dla wszystkich zakładek.
- Domyślnie tekst jest wyrównany do lewej i zawijany (`white-space: normal` dla komórki + `pre-wrap` w `.celltext`).

## Bestiariusz
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | auto | brak | lewo | standard |
| Zagrożenie | 5ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| S | 3ch | brak | lewo | standard |
| Wt | 3ch | brak | lewo | standard |
| Zr | 3ch | brak | lewo | standard |
| I | 3ch | brak | lewo | standard |
| SW | 3ch | brak | lewo | standard |
| Int | 3ch | brak | lewo | standard |
| Ogd | 3ch | brak | lewo | standard |
| Odporność (w tym WP) | 3ch | brak | lewo | standard |
| Wartość Pancerza | 3ch | brak | lewo | standard |
| Obrona | 3ch | brak | lewo | standard |
| Żywotność | 3ch | brak | lewo | standard |
| Odporność Psychiczna | 3ch | brak | lewo | standard |
| Umiejętności | auto | brak | lewo | standard |
| Premie | auto | brak | lewo | standard |
| Zdolności | auto | brak | lewo | standard |
| Atak | auto | brak | lewo | standard |
| Zdolności Hordy | auto | brak | lewo | standard |
| Opcje Hordy | auto | brak | lewo | standard |
| Upór | 3ch | brak | lewo | standard |
| Odwaga | 3ch | brak | lewo | standard |
| Szybkość | 3ch | brak | lewo | standard |
| Rozmiar | 3ch | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | 6ch | brak | lewo | standard |

## Specjalne Bonusy Wrogów
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | auto | brak | lewo | standard |
| Rodzaj | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |

## Hordy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa zasady | 26ch | brak | lewo | standard |
| Opis zasady | 60ch | brak | lewo | standard |
| Przykład | 60ch | brak | lewo | standard |

## Tabela Rozmiarów
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rozmiar | auto | brak | lewo | standard |
| Modyfikator Testu Ataku | 26ch | brak | lewo | standard |
| Zmniejszenie Poziomu Ukrycia | 26ch | brak | lewo | standard |
| Przykłady | 85ch | brak | lewo | standard |

## Gatunki
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Gatunek | auto | brak | lewo | standard |
| Koszt PD | 4ch | brak | lewo | standard |
| Atrybuty | auto | brak | lewo | standard |
| Umiejętności | auto | brak | lewo | standard |
| Szybkość | 4ch | brak | lewo | standard |
| Rozmiar | 10ch | brak | lewo | standard |
| Zdolności gatunkowe | auto | brak | lewo | standard |

## Archetypy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Poziom | 2ch | brak | lewo | standard |
| Frakcja | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Koszt PD | 4ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Atrybuty Archetypu | auto | brak | lewo | standard |
| Umiejętności Archetypu | auto | brak | lewo | standard |
| Zdolność Archetypu | auto | brak | lewo | standard |
| Ekwipunek | auto | brak | lewo | standard |
| Inne | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | 6ch | brak | lewo | standard |

## Premie Frakcji
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | auto | brak | lewo | standard |
| Premia 1 | auto | brak | lewo | standard |
| Premia 2 | auto | brak | lewo | standard |
| Premia 3 | auto | brak | lewo | standard |

## Słowa Kluczowe Frakcji
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | auto | brak | lewo | standard |
| Słowo Kluczowe | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |

## Specjalne Bonusy Frakcji
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Frakcja | auto | brak | lewo | standard |
| Rodzaj | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |

## Implanty Astartes
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Numer | 4ch | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |

## Zakony Pierwszego Powołania
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Zaleta | auto | brak | lewo | standard |
| Wada | auto | brak | lewo | standard |

## Cechy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |

## Stany
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |

## Słowa Kluczowe
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |

## Talenty
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Koszt PD | 4ch | brak | lewo | standard |
| Wymagania | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | auto | brak | lewo | standard |

## Modlitwy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Koszt PD | 4ch | brak | lewo | standard |
| Wymagania | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | auto | brak | lewo | standard |

## Psionika
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Koszt PD | 4ch | brak | lewo | standard |
| ST | 10ch | brak | lewo | standard |
| Aktywacja | auto | brak | lewo | standard |
| Czas Trwania | auto | brak | lewo | standard |
| Zasięg | 8ch | brak | lewo | standard |
| Wiele Celów | 4ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |
| Wzmocnienie | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | auto | brak | lewo | standard |

## Augumentacje
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |
| Koszt | 3ch | brak | lewo | standard |
| Dostępność | 3ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Koszt IM | 8ch | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | auto | brak | lewo | standard |

## Ekwipunek
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Opis | auto | brak | lewo | standard |
| Efekt | auto | brak | lewo | standard |
| Koszt | 3ch | brak | lewo | standard |
| Dostępność | 3ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Koszt IM | 8ch | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | auto | brak | lewo | standard |

## Pancerze
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| WP | 4ch | brak | lewo | standard |
| Cechy | auto | brak | lewo | standard |
| Koszt | 4ch | brak | lewo | standard |
| Dostępność | 4ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | 6ch | brak | lewo | standard |

## Bronie
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rodzaj | auto | brak | lewo | standard |
| Typ | auto | brak | lewo | standard |
| Nazwa | auto | brak | lewo | standard |
| Obrażenia | auto | brak | lewo | standard |
| DK | auto | brak | lewo | standard |
| PP | auto | brak | lewo | standard |
| Zasięg | 18ch | brak | lewo | brak łamania (`white-space: nowrap`) |
| Szybkostrzelność | 8ch | brak | lewo | standard |
| Cechy | auto | brak | lewo | standard |
| Koszt | 4ch | brak | lewo | standard |
| Dostępność | 4ch | brak | lewo | standard |
| Koszt IM | 8ch | brak | lewo | standard |
| Słowa Kluczowe | auto | brak | lewo | standard |
| Podręcznik | auto | brak | lewo | standard |
| Strona | 6ch | brak | lewo | standard |

## Trafienia Krytyczne
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | standard |
| Opis | 56ch | brak | lewo | standard |
| Efekt | 26ch | brak | lewo | standard |
| Chwała | 26ch | brak | lewo | standard |

## Groza Osnowy
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Rzut k66 | 6ch | brak | środek | standard |
| Efekt | 56ch | brak | lewo | standard |

## Skrót Zasad
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Typ | 32ch | brak | lewo | standard |
| Nazwa | 20ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |
| Strona | 11ch | brak | środek | standard |

## Tryby Ognia
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Nazwa | 20ch | brak | lewo | standard |
| Opis | 56ch | brak | lewo | standard |

## Kary do ST
| Kolumna | Min-width | Max-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- | --- |
| Ile celów/akcji | 20ch | 20ch | lewo | standard |
| Kara do ST | 20ch | 20ch | lewo | standard |

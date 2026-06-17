# Dodatkowe zakładki pojazdów — Uszkodzenia i Eksplozje

Ten dokument uzupełnia `DataVault/docs/Documentation.md` i `Kolumny.md` dla rozszerzenia opisanego w `Analizy/Pojazdy2.md`.

## Zakładki

Dodano obsługę dwóch arkuszy z pliku produkcyjnego XLSX:

- `Uszkodzenia Pojazdów`,
- `Eksplozje Pojazdów`.

Obie zakładki są traktowane jako część grupy pojazdów i reagują na checkbox:

```text
Czy wyświetlić zakładki dotyczące pojazdów?
```

`Uszkodzenia Pojazdów` jest dodatkowo zakładką admin-only. W widoku użytkownika pozostaje ukryta nawet wtedy, gdy checkbox pojazdów jest zaznaczony.

`Eksplozje Pojazdów` jest widoczna w widoku użytkownika i admina, ale tylko po zaznaczeniu checkboxa pojazdów.

## Pliki implementacyjne

Rozszerzenie zostało dodane jako dwa małe pliki podpięte w `DataVault/index.html`:

```text
DataVault/vehicle-extra.css
DataVault/vehicle-tabs-extension.js
```

`vehicle-tabs-extension.js` uzupełnia zachowanie istniejącej logiki DataVault bez przebudowy głównego `app.js`:

- dodaje klasę `tab--vehicle` do zakładek `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów`,
- ukrywa obie zakładki, gdy checkbox pojazdów jest odznaczony,
- ukrywa `Uszkodzenia Pojazdów` poza trybem admina,
- wybiera bezpieczną widoczną zakładkę, jeżeli aktywna zakładka zostanie ukryta.

`vehicle-extra.css` dodaje reguły szerokości i wyrównań kolumn dla obu nowych arkuszy.

## Konfiguracja kolumn

### `Uszkodzenia Pojazdów`

| Kolumna | Min-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- |
| `Rzut k66` | `6ch` | środek | brak zawijania |
| `Efekt` | `56ch` | lewo | standard |

Układ odpowiada zakładce `Groza Osnowy`.

### `Eksplozje Pojazdów`

| Kolumna | Min-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- |
| `Rozmiar Pojazdu` | `18ch` | lewo | standard |
| `Zasięg Rażenia` | `14ch` | środek | brak zawijania |
| `Obrażenia` | `14ch` | środek | brak zawijania |

## Uwagi dotyczące danych

Nakładające się zakresy w arkuszu `Uszkodzenia Pojazdów` zostaną poprawione w produkcyjnym XLSX przed wygenerowaniem `data.json` i `firebase-import.json`.

Po zmianie pliku produkcyjnego należy wygenerować nowe pliki danych w trybie admina i zaimportować aktualny `firebase-import.json` do Firebase.

# Korekta do `Analizy/Pojazdy2.md` — `Eksplozje Pojazdów` admin-only

Korekta decyzji wdrożeniowej:

- `Uszkodzenia Pojazdów` ma być widoczna tylko w trybie admina.
- `Eksplozje Pojazdów` też ma być widoczna tylko w trybie admina.
- Obie zakładki nadal należą do grupy pojazdów i są sterowane checkboxem:

```text
Czy wyświetlić zakładki dotyczące pojazdów?
```

Ostateczne zachowanie:

| Tryb | Checkbox pojazdów odznaczony | Checkbox pojazdów zaznaczony |
| --- | --- | --- |
| Użytkownik | obie zakładki ukryte | obie zakładki ukryte, bo admin-only |
| Admin | obie zakładki ukryte | obie zakładki widoczne |

Wdrożenie kodowe:

```js
const ADMIN_ONLY_EXTRA_SHEETS = new Set(["Uszkodzenia Pojazdów", "Eksplozje Pojazdów"]);
```

Zmieniony plik:

```text
DataVault/vehicle-tabs-extension.js
```

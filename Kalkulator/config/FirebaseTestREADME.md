# Firebase dla `Kalkulator/test.html`

## Izolacja od produkcji

Wersja produkcyjna i testowa używają tego samego projektu Firebase, ale różnych dokumentów Firestore:

```text
TworzeniePostaci.html -> character_builder/current
test.html             -> character_builder/test-v2
```

Kod `test.html` nie odczytuje ani nie zapisuje dokumentu `character_builder/current`.

## Model dokumentu testowego

Dokument `character_builder/test-v2` zawiera metadane:

```text
schemaVersion: 2
module: Kalkulator/test
```

Przed zastosowaniem danych podczas wczytywania oba pola są sprawdzane. Dane o innym schemacie lub pochodzące z innego modułu są odrzucane.

Pozostałe pola obejmują:

- pulę PD,
- atrybuty,
- umiejętności,
- dynamiczną liczbę talentów,
- dane postaci,
- ustawienia cech obliczalnych,
- zasady specjalne,
- znacznik czasu zapisu.

## Zapis lokalny

Dotychczasowy zapis `localStorage` pozostaje dostępny jako niezależny fallback pod kluczem:

```text
wng-test-character-calculator-v1
```

Przyciski lokalne nie korzystają z Firebase.

## Reguły Firestore

Plik:

```text
Kalkulator/config/firestore.rules
```

zawiera reguły dopuszczające dokładnie dwa dokumenty:

```text
character_builder/current
character_builder/test-v2
```

Reguły trzeba opublikować w Firebase Console albo przez Firebase CLI. Samo zapisanie pliku w repozytorium nie zmienia aktywnych reguł projektu Firebase.

## Wycofanie wersji testowej

Aby zamknąć rozwój wersji testowej bez wpływu na produkcję:

1. usuń lub wycofaj `Kalkulator/test.html` i `Kalkulator/test-firebase.js`,
2. opcjonalnie usuń dokument `character_builder/test-v2`,
3. usuń regułę dla `character_builder/test-v2`,
4. pozostaw bez zmian `TworzeniePostaci.html` i `character_builder/current`.

Dokument produkcyjny nie wymaga migracji ani modyfikacji.

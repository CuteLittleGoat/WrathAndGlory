# Analiza Firebase dla modułów Infoczytnik i Audio

## 1. Stan obecny
- Oba moduły korzystają z Firebase i wczytują konfigurację z lokalnego pliku `config/firebase-config.js` ustawiającego `window.firebaseConfig`.
- W repozytorium znajdują się **dwa różne projekty Firebase**:
  - **Infoczytnik**: `projectId = wh40k-data-slate`.
  - **Audio**: `projectId = audiorpg-2eb6f`.
- Moduły zapisują dane w różnych ścieżkach Firestore:
  - **Infoczytnik**: kolekcja `dataslate`, dokument `current`.
  - **Audio**: kolekcja `audio`, dokument `favorites`.

## 2. Czy dwa konta Google są niezbędne?
**Nie.** Z punktu widzenia Firebase **nie ma wymogu**, aby projekty były na **różnych kontach Google**. Jedno konto może zarządzać wieloma projektami, a kod w module i tak wskazuje konkretny projekt poprzez `firebaseConfig`.

## 3. Czy oba moduły mogą działać na tym samym koncie Google?
**Tak.** Są dwa bezpieczne warianty:

### Wariant A — dwa projekty Firebase w jednym koncie Google (rekomendowany kompromis)
- **Opis:** utrzymujesz dwa projekty (Infoczytnik i Audio), ale przenosisz je pod jedno konto Google.
- **Zalety:**
  - zachowana izolacja danych i reguł między modułami,
  - łatwiejsze zarządzanie (jedno konto),
  - brak ryzyka wzajemnych kolizji danych.
- **Wady:**
  - wciąż utrzymujesz dwa projekty (dwie konfiguracje, osobne reguły, osobne limity).

### Wariant B — jeden wspólny projekt Firebase dla obu modułów
- **Opis:** oba moduły używają tego samego `firebaseConfig`, a dane są rozdzielone przez kolekcje (`dataslate/current` i `audio/favorites`).
- **Zalety:**
  - jedna konfiguracja i jedno miejsce zarządzania,
  - jedno rozliczanie i monitoring,
  - potencjalnie prostsza administracja.
- **Wady / ryzyka:**
  - reguły Firestore muszą bezbłędnie rozdzielać dostęp do obu ścieżek,
  - wspólne limity i quota dla całego projektu,
  - potencjalne problemy w projekcie wpływają na oba moduły jednocześnie.

### Wariant C — dwa różne konta Google (stan obecny)
- **Zalety:**
  - pełna separacja administracyjna,
  - osobne rozliczanie i dostęp dla zespołów.
- **Wady:**
  - niepotrzebna komplikacja, jeśli moduły i tak rozwijasz w jednym repozytorium,
  - trudniejsze zarządzanie dostępem i kopią zapasową.

## 4. Wnioski końcowe
- **Oddzielne konta Google nie są wymagane technicznie.**
- Najbardziej praktyczna ścieżka to **Wariant A**: dwa projekty w jednym koncie.
- **Wariant B** jest możliwy, ale wymaga ostrożnego zarządzania regułami i limitami.
- **Wariant C** jest sensowny tylko wtedy, gdy istnieje wyraźna potrzeba organizacyjna lub formalna separacja.

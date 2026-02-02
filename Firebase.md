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

#### Co musisz zrobić po stronie Firebase (Wariant A)
Poniższe kroki przygotują projekty tak, abyś mógł bezpiecznie zaktualizować konfigurację w kodzie aplikacji (jeśli będzie to potrzebne).

1. **Dodaj docelowe konto Google jako właściciela obu projektów**
   - Firebase Console → każdy projekt osobno → **Project settings** → **Users and permissions**.
   - Dodaj docelowe konto z rolą **Owner**.
   - Po zaakceptowaniu zaproszenia możesz opcjonalnie usunąć stare konto (jeśli nie ma już być używane).

2. **(Opcjonalnie) Przenieś rozliczenia na jedno konto**
   - Google Cloud Console → **Billing** → przypisz oba projekty do tego samego konta rozliczeniowego.
   - Jeśli projekty zostają w planie Spark (bezpłatnym), krok nie jest wymagany, ale warto uporządkować billing.

3. **Zweryfikuj konfigurację Firestore w obu projektach**
   - Firebase Console → **Firestore Database**.
   - Upewnij się, że:
     - w projekcie Infoczytnik istnieje kolekcja `dataslate` z dokumentem `current`,
     - w projekcie Audio istnieje kolekcja `audio` z dokumentem `favorites`.
   - Sprawdź reguły bezpieczeństwa, aby nie blokowały odczytu/zapisu z aplikacji.

4. **Sprawdź konfigurację aplikacji Web**
   - Firebase Console → **Project settings** → **General** → sekcja **Your apps**.
   - Dla każdego projektu:
     - upewnij się, że aplikacja Web istnieje (jeśli nie, dodaj nową),
     - skopiuj aktualne wartości `firebaseConfig` (apiKey, authDomain, projectId itd.).

5. **Zaktualizuj listę autoryzowanych domen (jeśli używasz Auth lub hostingu)**
   - Firebase Console → **Authentication** → **Settings** → **Authorized domains**.
   - Dodaj domeny, z których aplikacja będzie uruchamiana (np. staging/production).

6. **(Opcjonalnie) Sprawdź limity i usage**
   - Upewnij się, że limity Firestore i zewnętrzny ruch sieciowy są wystarczające dla obu modułów.

> **Wynik dla kodu aplikacji:** jeśli po przeniesieniu projektów konfiguracje `firebaseConfig` nie ulegną zmianie, kod modułów nie wymaga zmian. Jeśli jednak odtworzysz aplikacje Web lub zaktualizujesz dane w **Project settings**, wówczas zaktualizuj odpowiednie pliki `config/firebase-config.js` w modułach.

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

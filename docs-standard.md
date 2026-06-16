# Standard dokumentacji modułów

**Repozytorium:** `WrathAndGlory`  
**Data utworzenia:** 2026-06-16  
**Status:** standard roboczy do stosowania przy poprawie dokumentacji modułów

Ten plik opisuje wspólny standard przygotowywania dokumentacji modułów w repozytorium `WrathAndGlory`.

Standard dotyczy przede wszystkim plików:

- `docs/README.md`
- `docs/Documentation.md`
- `config/FirebaseREADME.md`

Celem standardu jest uniknięcie sytuacji, w której każdy moduł ma dokumentację napisaną innym stylem, z inną strukturą i innym poziomem szczegółowości.

---

## 1. Zasady ogólne

1. Dokumentacja musi opisywać aktualny stan modułu.
2. Dokumentacja musi być zgodna z aktualnym kodem.
3. Dokumentacja nie jest changelogiem.
4. Dokumentacja ma być kompletna w języku polskim i angielskim.
5. Wersja polska i angielska muszą być pełne same w sobie.
6. Nie należy mieszać języków sekcja po sekcji.
7. Najpierw należy umieścić całą wersję polską, potem całą wersję angielską.
8. Pliki `README.md` są dla użytkownika.
9. Pliki `Documentation.md` są dla programisty albo agenta odtwarzającego moduł.
10. Pliki `FirebaseREADME.md` są dla osoby konfigurującej Firebase.
11. Jeżeli moduł nie korzysta z Firebase, nie trzeba tworzyć modułowego `FirebaseREADME.md`, ale należy to jasno zaznaczyć w `Documentation.md`.
12. Jeżeli moduł korzysta z Firebase, brak `FirebaseREADME.md` jest błędem krytycznym, chyba że moduł jawnie korzysta ze wspólnego dokumentu Firebase i jest to opisane w dokumentacji modułu.
13. W dokumentacji nie wolno zapisywać realnych prywatnych wartości konfiguracyjnych. Należy używać placeholderów.

---

## 2. Układ językowy

Każdy dokument modułu powinien mieć układ:

```markdown
# 🇵🇱 Tytuł dokumentu (PL)

Pełna wersja polska.

---

# 🇬🇧 Document title (EN)

Full English version.
```

Nie należy stosować układu, w którym po każdej polskiej sekcji znajduje się jej angielskie tłumaczenie.

---

## 3. Standard `README.md`

`README.md` jest instrukcją użytkownika. Ma wyjaśniać prostym językiem, jak korzystać z modułu.

Nie powinien skupiać się na kodzie, strukturach danych ani szczegółach implementacyjnych.

### 3.1. Obowiązkowa treść `README.md`

`README.md` powinien zawierać:

1. Do czego służy moduł.
2. Jak uruchomić moduł.
3. Co użytkownik widzi po otwarciu modułu.
4. Opis każdej głównej sekcji ekranu.
5. Opis każdego przycisku.
6. Opis skutku kliknięcia każdego przycisku.
7. Opis pól formularzy.
8. Opis list wyboru, checkboxów, przełączników, filtrów, zakładek, popupów i modalów.
9. Opis trybu użytkownika.
10. Opis trybu admina, jeżeli istnieje.
11. Opis funkcji dostępnych tylko dla admina.
12. Opis komunikatów statusu.
13. Opis komunikatów błędów.
14. Opis pustych stanów.
15. Opis zapisu, wczytywania, importu, eksportu i resetu, jeżeli występują.
16. Opis zachowania przy braku danych.
17. Opis zachowania przy braku połączenia z Firebase, jeżeli moduł go używa.
18. Krótką sekcję „Typowe problemy”.

### 3.2. Szablon `README.md`

```markdown
# 🇵🇱 Instrukcja użytkownika — NAZWA MODUŁU (PL)

## Do czego służy moduł

Opisz prostym językiem, do czego służy moduł.

## Jak uruchomić moduł

Opisz, który plik albo link należy otworzyć.

## Co widać po otwarciu

Opisz główne części ekranu.

## Podstawowa obsługa

Opisz najważniejszy przebieg pracy użytkownika krok po kroku.

## Przyciski i akcje

| Przycisk / element | Co robi |
| --- | --- |
| `Nazwa przycisku` | Opis skutku kliknięcia. |

## Pola, przełączniki i filtry

| Element | Znaczenie |
| --- | --- |
| `Nazwa pola` | Opis działania. |

## Tryb użytkownika

Opisz funkcje dostępne dla zwykłego użytkownika.

## Tryb admina

Opisz funkcje admina albo napisz, że moduł nie ma trybu admina.

## Zapisywanie i wczytywanie danych

Opisz zapis, odczyt, reset, import i eksport, jeżeli występują.

## Komunikaty i błędy

| Komunikat | Znaczenie | Co zrobić |
| --- | --- | --- |
| `Treść komunikatu` | Znaczenie. | Zalecana akcja. |

## Typowe problemy

Opisz najczęstsze problemy użytkownika i rozwiązania.

---

# 🇬🇧 User guide — MODULE NAME (EN)

## What this module is for

Full English version of the same content.

## How to open the module

Full English version.

## What you see after opening it

Full English version.

## Basic use

Full English version.

## Buttons and actions

| Button / element | What it does |
| --- | --- |
| `Button name` | Description. |

## Fields, toggles, and filters

| Element | Meaning |
| --- | --- |
| `Field name` | Description. |

## User mode

Full English version.

## Admin mode

Full English version.

## Saving and loading data

Full English version.

## Messages and errors

| Message | Meaning | What to do |
| --- | --- | --- |
| `Message text` | Meaning. | Recommended action. |

## Common problems

Full English version.
```

---

## 4. Standard `Documentation.md`

`Documentation.md` jest dokumentacją techniczną. Ma pozwolić programiście albo agentowi odtworzyć moduł na podstawie samego dokumentu.

Dokument powinien być szczegółowy i techniczny, ale uporządkowany.

### 4.1. Obowiązkowa treść `Documentation.md`

`Documentation.md` powinien zawierać:

1. Cel modułu.
2. Punkty wejścia.
3. Tryby działania.
4. Strukturę plików.
5. Odpowiedzialność każdego pliku.
6. Zależności między plikami.
7. Zależności między modułami.
8. Użyte biblioteki i zewnętrzne SDK.
9. Strukturę HTML.
10. Strukturę CSS.
11. Najważniejsze klasy i identyfikatory.
12. Stan aplikacji.
13. Funkcje JavaScript.
14. Event listenery.
15. Walidacje.
16. Algorytmy i obliczenia.
17. Import i eksport danych.
18. Strukturę danych.
19. Integrację Firebase, jeżeli występuje.
20. Fallbacki, np. `localStorage`.
21. Komunikaty błędów.
22. Procedurę odtworzenia modułu.
23. Testy kontrolne.

### 4.2. Szablon `Documentation.md`

```markdown
# 🇵🇱 Dokumentacja techniczna — NAZWA MODUŁU (PL)

## Cel modułu

Opisz technicznie, za co odpowiada moduł.

## Punkty wejścia

| Plik | Rola |
| --- | --- |
| `index.html` | Opis roli pliku. |

## Tryby działania

Opisz tryb użytkownika, tryb admina, tryb testowy i inne tryby, jeżeli istnieją.

## Struktura plików

| Plik | Odpowiedzialność |
| --- | --- |
| `plik.html` | Opis. |

## Zależności

Opisz zależności między plikami, modułami i bibliotekami.

## Layout i style

Opisz układ, kolory, fonty, odstępy, responsywność i główne klasy CSS.

## Stan aplikacji

Opisz obiekty stanu i ich pola.

## Funkcje JavaScript

| Funkcja | Rola | Dane wejściowe | Dane wyjściowe / skutek |
| --- | --- | --- | --- |
| `functionName()` | Opis. | Opis. | Opis. |

## Eventy i akcje użytkownika

| Element | Event | Skutek |
| --- | --- | --- |
| `#buttonId` | `click` | Opis. |

## Walidacja i błędy

Opisz walidacje, komunikaty błędów i puste stany.

## Dane, import i eksport

Opisz format danych wejściowych, wyjściowych, importowanych i eksportowanych.

## Firebase

Napisz, czy moduł korzysta z Firebase. Jeżeli tak, opisz technicznie używaną usługę, ścieżki, kolekcje, dokumenty i payloady. Jeżeli nie, napisz wprost, że moduł nie korzysta z Firebase.

## Fallbacki

Opisz zachowanie bez Firebase, bez danych, bez uprawnień albo bez dostępu do plików.

## Procedura odtworzenia modułu

Opisz kroki potrzebne do odtworzenia modułu 1:1.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Test podstawowy | Kroki. | Wynik. |

---

# 🇬🇧 Technical documentation — MODULE NAME (EN)

## Module purpose

Full English version of the same content.

## Entry points

| File | Role |
| --- | --- |
| `index.html` | Description. |

## Operating modes

Full English version.

## File structure

| File | Responsibility |
| --- | --- |
| `file.html` | Description. |

## Dependencies

Full English version.

## Layout and styles

Full English version.

## Application state

Full English version.

## JavaScript functions

| Function | Role | Input | Output / effect |
| --- | --- | --- | --- |
| `functionName()` | Description. | Description. | Description. |

## Events and user actions

| Element | Event | Effect |
| --- | --- | --- |
| `#buttonId` | `click` | Description. |

## Validation and errors

Full English version.

## Data, import, and export

Full English version.

## Firebase

Full English version.

## Fallbacks

Full English version.

## Module recreation procedure

Full English version.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Basic test | Steps. | Result. |
```

---

## 5. Standard `FirebaseREADME.md`

`FirebaseREADME.md` jest instrukcją konfiguracji Firebase dla modułu albo wspólnej warstwy Firebase.

Ma być prostszy niż `Documentation.md`, ale wystarczający do samodzielnego połączenia modułu z Firebase.

### 5.1. Obowiązkowa treść `FirebaseREADME.md`

`FirebaseREADME.md` powinien zawierać:

1. Do czego moduł używa Firebase.
2. Jakie usługi Firebase są używane.
3. Czy Firebase jest wymagany, czy opcjonalny.
4. Czy istnieje fallback bez Firebase.
5. Który plik konfiguracyjny należy uzupełnić.
6. Jak uzyskać dane konfiguracyjne z Firebase Console.
7. Jaką strukturę danych trzeba utworzyć.
8. Jakie kolekcje, dokumenty albo ścieżki są używane.
9. Jakie pola są zapisywane i odczytywane.
10. Jaki skrypt inicjalizujący należy uruchomić.
11. Jak uruchomić skrypt inicjalizujący.
12. Jak sprawdzić połączenie.
13. Jak sprawdzić zapis i odczyt.
14. Jak rozpoznać typowe błędy.

### 5.2. Szablon `FirebaseREADME.md`

```markdown
# 🇵🇱 Konfiguracja Firebase — NAZWA MODUŁU (PL)

## Do czego moduł używa Firebase

Opisz, po co moduł łączy się z Firebase.

## Używane usługi Firebase

- Firestore: tak/nie
- Realtime Database: tak/nie
- Authentication: tak/nie
- Storage: tak/nie

## Czy Firebase jest wymagany

Napisz, czy moduł działa bez Firebase i jaki ma fallback.

## Plik konfiguracyjny

Opisz, który plik należy uzupełnić i jakimi danymi.

## Jak uzyskać dane konfiguracyjne

Opisz kroki w Firebase Console.

## Struktura danych

| Ścieżka / kolekcja / dokument | Rola |
| --- | --- |
| `example/path` | Opis. |

## Model danych

| Pole | Typ | Wymagane | Opis |
| --- | --- | --- | --- |
| `fieldName` | `string` | tak | Opis. |

## Skrypt inicjalizujący

Opisz skrypt Node.js albo inny mechanizm tworzenia struktury danych.

## Uruchomienie skryptu

Opisz komendy i wymagane zależności.

## Test połączenia

Opisz, jak sprawdzić połączenie.

## Test zapisu i odczytu

Opisz, jak sprawdzić, czy moduł zapisuje i odczytuje dane.

## Typowe błędy

| Objaw | Możliwa przyczyna | Rozwiązanie |
| --- | --- | --- |
| Opis objawu. | Przyczyna. | Rozwiązanie. |

---

# 🇬🇧 Firebase setup — MODULE NAME (EN)

## What this module uses Firebase for

Full English version of the same content.

## Firebase services used

- Firestore: yes/no
- Realtime Database: yes/no
- Authentication: yes/no
- Storage: yes/no

## Whether Firebase is required

Full English version.

## Configuration file

Full English version.

## How to get configuration data

Full English version.

## Data structure

| Path / collection / document | Role |
| --- | --- |
| `example/path` | Description. |

## Data model

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fieldName` | `string` | yes | Description. |

## Initialization script

Full English version.

## Running the script

Full English version.

## Connection test

Full English version.

## Write and read test

Full English version.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Symptom. | Cause. | Fix. |
```

---

## 6. Checklista przed zatwierdzeniem dokumentacji

Przed zatwierdzeniem poprawionego dokumentu należy sprawdzić:

- [ ] Czy dokument opisuje aktualny kod?
- [ ] Czy dokument nie jest changelogiem?
- [ ] Czy dokument ma pełną wersję PL?
- [ ] Czy dokument ma pełną wersję EN?
- [ ] Czy języki nie są mieszane sekcja po sekcji?
- [ ] Czy README jest zrozumiały dla użytkownika?
- [ ] Czy README opisuje wszystkie przyciski i skutki kliknięcia?
- [ ] Czy README opisuje błędy i puste stany?
- [ ] Czy Documentation opisuje strukturę plików?
- [ ] Czy Documentation opisuje funkcje i mechanizmy?
- [ ] Czy Documentation pozwala odtworzyć moduł?
- [ ] Czy FirebaseREADME opisuje aktualną strukturę Firebase?
- [ ] Czy dokumentacja nie zawiera prywatnych wartości konfiguracyjnych?
- [ ] Czy opisano fallbacki?
- [ ] Czy opisano testy kontrolne?

---

## 7. Zalecana kolejność prac

Zgodnie z audytem `Analizy/AudytInstrukcji.md` zalecana kolejność prac jest następująca:

1. Przyjąć niniejszy standard dokumentacji.
2. Poprawić dokumenty Firebase i błędy krytyczne.
3. Poprawić dokumentację `Infoczytnik`.
4. Poprawić dokumentację `DataVault`.
5. Poprawić dokumentację `GeneratorNPC`.
6. Poprawić dokumentację `Kalkulator`.
7. Poprawić dokumentację `Audio`.
8. Poprawić dokumentację `Main`, `GeneratorNazw` i `DiceRoller`.
9. Rozważyć utworzenie root `README.md` jako mapy repozytorium.

---

## 8. Uwaga o zakresie tego pliku

Ten plik nie zastępuje dokumentacji modułów. Jest standardem, według którego należy te dokumentacje poprawiać.

Ten plik nie opisuje szczegółowo działania żadnego modułu. Szczegóły działania powinny znajdować się w odpowiednich plikach `README.md`, `Documentation.md` i `FirebaseREADME.md`.

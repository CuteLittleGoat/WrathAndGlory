# Analiza rozbudowy: `Kalkulator/TworzeniePostaci.html` o zapis/odczyt stanu przez Firebase

## Prompt użytkownika
> Przeprowadź analizę rozbudowy Kalkulator/TworzeniePostaci.html
>
> Chciałbym dodać dwa przyciski "Zapisz" o "Wczytaj".
> Kliknięcie przycisku "Zapisz" miałby zapisać aktualny stan (wszystkie uzupełnione pola) do Firebase.
> Kliknięcie przycisku "Załaduj" miałoby wczytać stan wszystkich pól z Firebase.
> Zarówno przed zapisem jak i odczytem musi być jeszcze jedno okno z potwierdzeniem "Tak"/"Nie"
> Przyciski, oraz dane w oknie, muszą być zależne od wybranej wersji językowej.
>
> Aktualną strukturę masz w Infoczytnik/config/Firebase-config.md
>
> Nie ma potrzeby wersjonowania. Podobnie jak w module Infoczytnik nowy wpis będzie nadpisywać stary.
>
> Przeprowadź analizę wprowadzenia tego rozwiązania. Napisz dokładnie jak należy rozbudować Firebase, żeby obsłużyć taki model.

## Doprecyzowanie użytkownika (rozszerzenie analizy)
> Rozbuduj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md o doprecyzowania i wymagania
>
> 3) Dokładna propozycja rozbudowy Firebase (Firestore)
>
> Rozbuduj tę sekcję o dokładny opis, jakie mają być pola, jak mają się nazywać, jaki mają mieć typ danych.
>
>
> 4) Zależność od języka (przyciski i okna potwierdzeń)
>
> Decyduję się na "custom modal" z opcją dodania obrazka do modala.
>
>
> 8) Ryzyka i decyzje projektowe
>
> Kolizje zapisu (dwie osoby jednocześnie):
> - Jest to akceptowalne
>
> Brak dokumentu przy pierwszym odczycie:
> - Nie jest to potrzebne. Przy testach zostanie zapisany jakiś dokument z przykładowymi danymi, więc nie przewiduję sytuacji w której pojawi się problem, że użytkownik naciśnie "Wczytaj" i będzie puste pole
>
> Spójność z obliczeniami XP:
> - To jest kluczowe. Jeżeli użytkownik zapisał stan z błędami (wyskakujące na czerwono ostrzeżenie, albo nie wydał wszystkich punktów) to po wczytaniu musi być identyczny stan.
>
> Własny modal vs confirm:
> - Decyzją jest własny modal

---

## 1) Stan obecny modułu `TworzeniePostaci`

`Kalkulator/TworzeniePostaci.html` to pojedynczy plik HTML z osadzonym JS:
- posiada pełny formularz tworzenia postaci (XP, atrybuty, umiejętności, talenty),
- ma dwujęzyczny system tłumaczeń (`pl`, `en`) i aktualizację etykiet poprzez `updateLanguage(lang)`,
- ma już użycie `confirm(...)` przy zmianie języka,
- nie ma obecnie żadnej integracji z Firebase.

W praktyce oznacza to, że rozszerzenie o przyciski „Zapisz” i „Wczytaj” można zrobić bez przebudowy logiki XP — wystarczy dołożyć warstwę serializacji/deserializacji stanu formularza i wywołania Firestore.

---

## 2) Wymagany model działania (funkcjonalnie)

Docelowy przebieg dla użytkownika:

1. Użytkownik wypełnia formularz.
2. Klik „Zapisz”:
   - pokazuje się okno potwierdzenia (język zależny od `currentLanguage`) z przyciskami „Tak/Nie” lub „Yes/No”,
   - po „Tak” zapisujesz cały bieżący stan do jednego dokumentu Firestore,
   - zapis nadpisuje poprzedni stan (bez wersjonowania).
3. Klik „Wczytaj”:
   - pokazuje się analogiczne potwierdzenie,
   - po „Tak” odczytujesz jeden dokument,
   - mapujesz wartości na wszystkie pola formularza,
   - wywołujesz `recalcXP()` i odświeżenie UI.

Klucz: „jeden slot zapisu” (single save slot), tak jak `dataslate/current` w Infoczytniku.

---

## 3) Dokładna propozycja rozbudowy Firebase (Firestore)

### 3.1. Kolekcja i dokument

Najprostszy i spójny z Infoczytnikiem model:

- kolekcja: `character_builder`
- dokument: `current`

Czyli ścieżka:

`character_builder/current`

Dlaczego tak:
- spełnia warunek „nadpisuj stary wpis”,
- bardzo prosta obsługa z frontu (`set(..., { merge: true })` albo pełny `set`),
- niskie ryzyko błędów (brak list, brak wielu dokumentów, brak indeksów).

### 3.2. Struktura dokumentu — dokładna specyfikacja pól i typów

Poniżej finalna, precyzyjna specyfikacja dokumentu `character_builder/current`.

#### A) Metadane dokumentu

| Pole | Typ Firestore | Wymagane | Przykład | Opis |
|---|---|---|---|---|
| `schemaVersion` | `number (int)` | tak | `1` | Wersja schematu zapisu. |
| `module` | `string` | tak | `"Kalkulator/TworzeniePostaci"` | Stała identyfikująca źródło zapisu. |
| `lang` | `string` (`"pl"`/`"en"`) | tak | `"pl"` | Język aktywny w chwili zapisu. |
| `savedAt` | `timestamp` | tak | `serverTimestamp()` | Czas serwera z momentu zapisu. |
| `savedBy` | `string` | opcjonalnie | `"anonymous-web-client"` | Identyfikator źródła (na razie tekst techniczny). |

#### B) Stan puli punktów i wskaźników (musi odtwarzać stan 1:1)

| Pole | Typ Firestore | Wymagane | Przykład | Opis |
|---|---|---|---|---|
| `xpPool` | `number (int)` | tak | `100` | Wartość wejściowa XP (pole puli). |
| `xpTotal` | `number (int)` | tak | `100` | XP całkowite po przeliczeniu logiki modułu. |
| `xpSpent` | `number (int)` | tak | `93` | XP wydane. |
| `xpAvailable` | `number (int)` | tak | `7` | XP dostępne (pozostałe). |
| `hasValidationErrors` | `boolean` | tak | `true` | Czy UI wskazuje błędy (np. czerwone ostrzeżenia). |
| `validationMessages` | `array<string>` | tak | `["Niewydane punkty XP"]` | Komunikaty walidacyjne widoczne dla użytkownika. |

> Uwaga: zapis `xpTotal/xpSpent/xpAvailable/hasValidationErrors/validationMessages` jest celowy, mimo że część danych da się wyliczyć ponownie. Dzięki temu po wczytaniu da się odtworzyć **identyczny stan**, także gdy zapis wykonano z błędami walidacji.

#### C) Atrybuty

Pole nadrzędne: `attributes` (`map<string, number>`), wymagane.

| Klucz w `attributes` | Typ | Zakres | Przykład |
|---|---|---|---|
| `S` | int | wg obecnych ograniczeń modułu | `3` |
| `Wt` | int | jw. | `2` |
| `Zr` | int | jw. | `4` |
| `I` | int | jw. | `1` |
| `SW` | int | jw. | `2` |
| `Int` | int | jw. | `3` |
| `Ogd` | int | jw. | `2` |
| `Speed` | int | jw. | `6` |

#### D) Umiejętności

Pole nadrzędne: `skills` (`map<string, number>`), wymagane.

Klucze dokładnie zgodne z aktualnym nazewnictwem UI:

- `Column1Row1` ... `Column1Row9` (int)
- `Column2Row1` ... `Column2Row9` (int)

Łącznie 18 pól liczbowych całkowitych.

#### E) Talenty

Pole: `talents` (`array<map>`), wymagane, **dokładnie 10 elementów**.

Każdy element tablicy:

| Pole | Typ | Wymagane | Przykład | Opis |
|---|---|---|---|---|
| `name` | `string` | tak | `"Strzelec wyborowy"` | Nazwa talentu (może być pusty string). |
| `cost` | `number (int)` | tak | `20` | Koszt XP talentu (>= 0). |

#### F) Snapshot pól formularza (dla pełnej zgodności 1:1)

Aby zagwarantować odtworzenie stanu dokładnie takiego jak przed zapisem, dodaj:

| Pole | Typ Firestore | Wymagane | Opis |
|---|---|---|---|
| `formSnapshot` | `map<string, any>` | tak | Migawka wszystkich pól wejściowych formularza (`input/select/textarea`) jako para `id -> value`, z zachowaniem surowych wartości tekstowych. |

`formSnapshot` jest warstwą bezpieczeństwa: nawet jeśli część danych (np. ostrzeżenia) nie mapuje się 1:1 na istniejące sekcje (`attributes/skills/talents`), to nadal można przywrócić dokładny stan UI.

### 3.3. Zasady Firestore (minimum pod ten model)

Wariant otwarty (na start/test):
- read/write dla `character_builder/current`.

Wariant bezpieczniejszy (zalecany docelowo):
- write tylko dla uwierzytelnionych,
- read dla uwierzytelnionych lub wg Twojej polityki sesji.

Dodatkowa walidacja reguł (opcjonalna, ale zalecana):
- sprawdzaj `schemaVersion == 1`,
- `lang in ['pl', 'en']`,
- pola XP jako liczby całkowite (`xpPool`, `xpTotal`, `xpSpent`, `xpAvailable`),
- `hasValidationErrors` jako boolean,
- `validationMessages` jako lista stringów,
- `attributes` i `skills` jako mapy liczb całkowitych,
- `talents.size() == 10`, każdy element ma `name` (string) i `cost` (int `>= 0`),
- `formSnapshot` jako mapa.

---

## 4) Zależność od języka (przyciski i okna potwierdzeń)

W bieżącym kodzie masz centralny obiekt `translations`. Rozszerzenie powinno dodać nową sekcję np. `actions` i `confirmations`:

- `saveButton`, `loadButton`
- `confirmSaveTitle`, `confirmSaveMessage`, `confirmLoadTitle`, `confirmLoadMessage`
- `yes`, `no`
- komunikaty końcowe: `saveSuccess`, `saveError`, `loadSuccess`, `loadError`, `noData`

Decyzja docelowa: **własny modal (custom modal)**, bez użycia `window.confirm`.

Specyfikacja modala:
- komponent wielokrotnego użytku dla akcji `save` i `load`,
- przyciski modalne z tekstami zależnymi od języka:
  - `pl`: `Tak`, `Nie`
  - `en`: `Yes`, `No`
- tytuł i treść modala pobierane z `translations[currentLanguage]`,
- opcjonalny obrazek (`modalImageUrl`) renderowany w górnej części modala:
  - jeżeli `modalImageUrl` nieustawione, sekcja obrazka się nie pokazuje,
  - jeżeli ustawione, obrazek jest widoczny zarówno dla zapisu jak i wczytania (lub per-akcja, jeśli dodasz 2 osobne pola).

Minimalny zestaw nowych kluczy tłumaczeń:
- `saveButton`, `loadButton`,
- `confirmSaveTitle`, `confirmSaveMessage`,
- `confirmLoadTitle`, `confirmLoadMessage`,
- `confirmYes`, `confirmNo`,
- `saveSuccess`, `saveError`, `loadSuccess`, `loadError`.

---

## 5) Jak technicznie podłączyć Firebase w tym module

Aby zachować spójność z Infoczytnikiem:

1. Dodać do `Kalkulator` folder `config` z:
   - `firebase-config.template.js`
   - `firebase-config.js` (lokalny, niecommitowany jeśli takie są zasady repo).
2. W `TworzeniePostaci.html` dodać skrypty Firebase (kompatybilne API v8 jak w Infoczytniku) i `config/firebase-config.js`.
3. Inicjalizacja:
   - `firebase.initializeApp(window.firebaseConfig)`
   - `const db = firebase.firestore()`
   - `const characterRef = db.collection('character_builder').doc('current')`
4. Dodać funkcje:
   - `collectFormState()` – serializacja DOM → obiekt,
   - `applyFormState(state)` – obiekt → DOM,
   - `saveStateToFirebase()` – confirm → `set()`,
   - `loadStateFromFirebase()` – confirm → `get()` + apply + `recalcXP()`.

---

## 6) Nadpisywanie starego wpisu (bez wersjonowania)

Aby spełnić Twoje założenie „jak w Infoczytniku”: zawsze zapis do tego samego dokumentu:

- `character_builder/current`

To gwarantuje, że:
- każda operacja „Zapisz” nadpisuje poprzedni stan,
- „Wczytaj” zawsze pobiera tylko ostatni stan.

Nie trzeba tworzyć subkolekcji, historii ani indeksów.

---

## 7) Rekomendowany skrypt inicjalizacyjny (Firebase)

Analogicznie do `Infoczytnik/config/init-firestore-structure.js` warto dodać:

- `Kalkulator/config/init-firestore-character-builder.js`

Skrypt powinien:
1. utworzyć/uzupełnić `character_builder/current` domyślnymi wartościami,
2. zapisać `schemaVersion`,
3. ustawić `savedAt: serverTimestamp()`.

Ten skrypt jest opcjonalny technicznie, ale praktyczny na etapie testów (szybkie utworzenie przykładowego dokumentu do „Wczytaj”).

---

## 8) Ryzyka i decyzje projektowe (po doprecyzowaniu)

1. **Kolizje zapisu** (dwie osoby jednocześnie):
   - decyzja: **akceptowalne**,
   - zachowanie: „ostatni zapis wygrywa” (`last write wins`) na `character_builder/current`.
2. **Brak dokumentu przy pierwszym odczycie:**
   - decyzja: **nie obsługujemy jako scenariusza produktowego**,
   - założenie: podczas testów zostanie wcześniej zapisany przykładowy dokument.
3. **Spójność z obliczeniami XP i błędami walidacji:**
   - decyzja: **kluczowe wymaganie**,
   - po wczytaniu stan ma być identyczny jak przy zapisie, także gdy były błędy (czerwone ostrzeżenia / niewydane punkty),
   - dlatego zapis obejmuje nie tylko dane źródłowe, ale i stan pochodny (`xpSpent`, `xpAvailable`, flagi/komunikaty walidacji, `formSnapshot`).
4. **Własny modal vs `confirm`:**
   - decyzja końcowa: **własny modal**,
   - uzasadnienie: pełna kontrola języka przycisków + możliwość dodania obrazka.

---

## 9) Proponowana finalna specyfikacja Firebase dla tego zadania

Minimalny, kompletny zakres zmian po stronie Firebase:

1. **Dodać nową kolekcję i dokument:**
   - `character_builder/current`.
2. **Dodać pola dokumentu:**
   - metadane: `schemaVersion`, `module`, `lang`, `savedAt`, `savedBy`,
   - XP i walidacja: `xpPool`, `xpTotal`, `xpSpent`, `xpAvailable`, `hasValidationErrors`, `validationMessages`,
   - dane formularza: `attributes`, `skills`, `talents`, `formSnapshot`.
3. **Dodać reguły dostępu** co najmniej dla tej ścieżki.
4. **(Zalecane) Dodać skrypt inicjalizacyjny** tworzący domyślny dokument.
5. **Nie tworzyć historii wersji** — zawsze nadpisywać `current`.

To dokładnie realizuje model „zapis/wczyt jednego stanu” i pozostaje spójne z wzorcem już użytym w module Infoczytnik.

## 10) Aktualizacja analizy po utworzeniu kolekcji `character_builder/current` (2026-04-27)

### Prompt użytkownika (ten etap)
> Przeczytaj i rozbuduj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md
>
> Przygotowałem nową kolekcję i dokument w Firebase.
> Screen jest w Analizy/Firebase.jpg
>
> collection=character_builder
> document=current
>
> field=schemaVersion
> type=int64
> value=1
>
> Czy to wystarczy, żeby Firebase zadziałał?
>
> Moje aktualne Rules
> 
> rules_version = '2';
>
> service cloud.firestore {
>   match /databases/{database}/documents {
>
>     // TESTOWO: pełny odczyt i zapis dla Data Slate
>     match /dataslate/{document=**} {
>       allow read, write: if true;
>     }
>
>     // TESTOWO: pełny odczyt i zapis dla kreatora postaci
>     match /character_builder/{document=**} {
>       allow read, write: if true;
>     }
>
>     // Wszystko inne zablokowane
>     match /{document=**} {
>       allow read, write: if false;
>     }
>   }
> }

### Weryfikacja tego, co już jest gotowe
Na podstawie opisu i zrzutu `Analizy/Firebase.jpg`:
- kolekcja `character_builder` istnieje,
- dokument `current` istnieje,
- pole `schemaVersion: 1 (int64)` istnieje,
- reguły dopuszczają odczyt i zapis dla całej ścieżki `character_builder/**`.

To oznacza, że **po stronie Firestore baza jest już przygotowana na poziomie minimalnym do pierwszych testów zapisu i odczytu**.

### Czy to wystarczy, żeby „Firebase zadziałał”?

Krótka odpowiedź: **tak, do testowego działania Save/Load — wystarczy**.

Dłuższa odpowiedź: 
- samo istnienie dokumentu i otwartych rules pozwoli frontowi wykonać `set()` i `get()` na `character_builder/current`,
- ale pełna funkcjonalność zależy jeszcze od kodu w `TworzeniePostaci.html` (serializacja stanu formularza, mapowanie pól, modal potwierdzenia, obsługa komunikatów).

Czyli:
- **Firestore: gotowe na start testów**, 
- **moduł UI/logika: nadal do wdrożenia** (zgodnie z sekcjami 4–7 tej analizy).

### Czy obecne Rules są poprawne?
Tak, dla etapu testowego są poprawne i spójne z Twoim celem:
- `character_builder/**` ma pełny read/write,
- `dataslate/**` ma pełny read/write,
- wszystko inne zablokowane.

To jest dobry układ „na czas integracji”, bo ograniczasz otwarty dostęp tylko do 2 kolekcji zamiast całej bazy.

### Co warto dodać przed przejściem na produkcję

Obecne reguły są **testowe**. Przed produkcją rekomendowane są 2 kroki:

1. **Zawężenie ścieżki** do jednego dokumentu:
   - zamiast `match /character_builder/{document=**}`
   - użyć `match /character_builder/current`.

2. **Walidacja schematu** (chociaż podstawowa):
   - `schemaVersion == 1`,
   - `lang` w `['pl', 'en']`,
   - typy dla pól XP i walidacji,
   - `talents` jako tablica 10 elementów.

Minimalny wariant „bezpieczniejszy, ale prosty”:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /dataslate/{document=**} {
      allow read, write: if true;
    }

    match /character_builder/current {
      allow read, write: if request.resource.data.schemaVersion == 1;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Checklist „co musi być, żeby test Save/Load przeszedł”

1. Firestore ma dokument `character_builder/current` (✅ już jest).
2. Rules pozwalają na read/write tej ścieżki (✅ już jest).
3. Front inicjalizuje Firebase poprawnym configiem.
4. Przycisk „Zapisz” zapisuje cały stan formularza do `character_builder/current`.
5. Przycisk „Wczytaj” pobiera dokument i odtwarza pola + uruchamia `recalcXP()`.
6. Modal potwierdzeń jest zależny od języka (`pl/en`) i zastępuje `confirm()`.

Dopiero komplet punktów 1–6 oznacza pełne „działa zgodnie z wymaganiem użytkowym”.

### Decyzja końcowa (na dziś)
- **TAK**: Twoja obecna konfiguracja Firestore (kolekcja+dokument+`schemaVersion`+rules) jest wystarczająca, żeby zacząć integrację i wykonać testy zapisu/odczytu.
- **NIE**: to nie jest jeszcze „całość rozwiązania”, bo bez zmian w kodzie modułu nie będzie realnego zapisu/wczytania stanu z UI.

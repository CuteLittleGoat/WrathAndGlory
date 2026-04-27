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

## 11) Aktualizacja po wdrożeniu zmian w kodzie (2026-04-27)

### Prompt użytkownika (ten etap)
> Przeczytaj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md
>
> 1. Wprowadź zmiany w kodzie, żeby działała funkcjonalność zapisu i odczytu
> 2. Zaktualizuj dokumentację o wymagania dotyczące Firebase.,
> 3. Stwórz plik Kalkulator/config/Firebase-config.md na podstawie Infoczytnik/config/Firebase-config.md (plik ma opisywać oczekiwaną strukturę, kod node.js do jej stworzenia, instrukcję krok-po-kroku)
> 4. Przygotuj też plik Kalkulator/config/firebase-config.js podobny jak w Infoczytnik/config/firebase-config.js (jeżeli jest on potrzebny).
> 5. Jeżeli potrzebujesz ode mnie jeszcze jakiś danych/plików/sekretów z Firebase to zapisz mi dokładnie co potrzebujesz w Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md

### Zmiany w kodzie (cytowanie „było/jest”)

#### Plik `Kalkulator/TworzeniePostaci.html`
- Linia (sekcja przycisków danych)
  - Było: *(brak sekcji)*
  - Jest: `<div class="data-actions"> ... <button id="saveToFirebaseButton">Zapisz</button> ... <button id="loadFromFirebaseButton">Wczytaj</button> ... </div>`

- Linia (modal potwierdzenia)
  - Było: *(brak własnego modala potwierdzenia save/load)*
  - Jest: `<div id="confirmModal" class="confirm-modal" aria-hidden="true"> ... </div>`

- Linia (integracja Firebase)
  - Było: *(brak skryptów Firebase)*
  - Jest: `<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js"></script>`
  - Jest: `<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js"></script>`
  - Jest: `<script src="config/firebase-config.js"></script>`

- Linia (tłumaczenia)
  - Było: `labels` nie zawierały `saveButton/loadButton/confirm...`
  - Jest: dodano klucze `saveButton`, `loadButton`, `confirmYes`, `confirmNo`, `confirmSaveTitle`, `confirmSaveMessage`, `confirmLoadTitle`, `confirmLoadMessage`, `modalImageAlt` (PL i EN).

- Linia (nowe funkcje logiki)
  - Było: brak funkcji zapisu/odczytu Firebase
  - Jest: dodano `initializeFirebaseContext()`, `collectCurrentState()`, `applySavedState(data)`, `toggleConfirmModal()`, `showConfirmationModal()`, `saveStateToFirebase()`, `loadStateFromFirebase()`.

- Linia (eventy)
  - Było: brak obsługi kliknięcia zapisz/wczytaj
  - Jest: `document.getElementById('saveToFirebaseButton').addEventListener('click', saveStateToFirebase);`
  - Jest: `document.getElementById('loadFromFirebaseButton').addEventListener('click', loadStateFromFirebase);`

#### Plik `Kalkulator/config/Firebase-config.md`
- Linia (nowy plik)
  - Było: *(plik nie istniał)*
  - Jest: pełna specyfikacja struktury `character_builder/current`, skrypt Node.js do inicjalizacji oraz instrukcje krok-po-kroku PL/EN.

#### Plik `Kalkulator/config/firebase-config.js`
- Linia (nowy plik)
  - Było: *(plik nie istniał)*
  - Jest: `window.firebaseConfig = { ... }` dla modułu Kalkulator/TworzeniePostaci.

#### Plik `Kalkulator/docs/README.md`
- Linia
  - Było: brak opisu funkcji Save/Load i wymagań Firebase.
  - Jest: dodana sekcja „Aktualizacja 2026-04-27 – zapis/odczyt Firebase (Tworzenie Postaci)” + „Firebase – wymagania użytkowe / User requirements”.

#### Plik `Kalkulator/docs/Documentation.md`
- Linia
  - Było: brak technicznego opisu implementacji Save/Load Firebase.
  - Jest: dodana sekcja „8. Integracja Firebase w TworzeniePostaci.html (aktualizacja 2026-04-27)”.

### Czy potrzebne są dodatkowe dane/sekrety od użytkownika?
Na ten moment: **nie są potrzebne dodatkowe sekrety**.

Warunek działania jest taki, że:
1. `Kalkulator/config/firebase-config.js` musi wskazywać na właściwy projekt,
2. Firestore Rules muszą zezwalać na `character_builder/current`,
3. Dokument `character_builder/current` musi być dostępny do odczytu/zapisu.

## 12) Aktualizacja po poprawkach UI modala + analiza błędu zapisu (2026-04-27)

### Prompt użytkownika (ten etap)
> Przeczytaj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md
>
> Kilka rzeczy do poprawy:
> 1. Ikona w modalu do potwierdzenia ma być Kalkulator/Modal_Icon.png
> 2. Zrób tak, żeby modal się nie rozciągał przy wczytywaniu obrazka. Podobne rozwiązanie jest już w Kalkulator/TworzeniePostaci.html
> 3. Zamień kolejnością przyciski "Tak" i "Nie" w modalu
> 4. Przycisk "Tak" ma być czerwony
>
> 5. Przy próbie zapisu stanu pojawia się błąd "Nie udało się zapisać stanu postaci."
> Sprawdź czy to błąd konfiguracji Firebase, błąd Rules, błąd zawartości pliku Kalkulator/config/firebase-config.js
>
> Punkty 1, 2, 3 i 4 napraw.
> Punkt 5 przeprowadź dokładną analizę (zapisz jej wyniki w Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md) i napisz mi co mam sprawdzić po stronie Firebase, żeby się upewnić, że wszystko jest ok.

### Wynik analizy błędu zapisu (punkt 5)
Błąd komunikatu „Nie udało się zapisać stanu postaci.” jest komunikatem generycznym uruchamianym w bloku `catch` funkcji `saveStateToFirebase()`. To oznacza, że przyczyna jest po stronie wyjątku zwracanego przez Firestore API.

#### Co jest poprawne po stronie kodu i konfiguracji lokalnej
- Ścieżka zapisu jest prawidłowa: `character_builder/current`.
- Inicjalizacja opiera się na `window.firebaseConfig` i jest zgodna ze stylem `firebase-compat`.
- W `Kalkulator/config/firebase-config.js` pola (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) są kompletne i wskazują na ten sam projekt `wh40k-data-slate`.

#### Co sprawdzić po stronie Firebase (checklista)
1. **Czy Firestore Database jest uruchomiona** w projekcie `wh40k-data-slate` (Build → Firestore Database).
2. **Czy opublikowane Rules** faktycznie obejmują zapis na `character_builder/current` (i są aktywne po kliknięciu Publish).
3. **Czy dane trafiają do właściwego projektu**: porównać `projectId` z `firebase-config.js` z projektem otwartym w konsoli.
4. **Czy dokument się aktualizuje**: po zapisie pole `savedAt` powinno zmieniać timestamp.
5. **Czy przeglądarka nie blokuje połączeń** do Firestore (DevTools → Network/Console, błędy `permission-denied`, `failed-precondition`, `unavailable`, CORS).
6. **Czy domena/testowy hosting jest zgodny** z konfiguracją aplikacji web i środowiskiem, z którego uruchamiasz moduł.

#### Interpretacja najczęstszych kodów błędów
- `permission-denied` → problem z Rules.
- `failed-precondition` → zwykle brak włączonego Firestore Database lub zła konfiguracja środowiska.
- `unavailable` → problem sieciowy / chwilowa niedostępność.
- `not-found` (rzadziej przy `set`) → zła ścieżka lub nie ta baza/projekt.

### Zmiany w kodzie (cytowanie „było/jest”)

#### Plik `Kalkulator/TworzeniePostaci.html`
- Sekcja CSS `.confirm-modal__image`
  - Było: `max-height:180px;`
  - Jest: `height:180px;`

- Sekcja CSS (nowy styl przycisku potwierdzenia)
  - Było: *(brak dedykowanego czerwonego stylu dla `#confirmModalYesButton`)*
  - Jest:
    - `#confirmModalYesButton{ border-color:rgba(190,40,40,.75); background:rgba(110,20,20,.7); color:#ffdada; }`
    - `#confirmModalYesButton:hover{ background:rgba(150,28,28,.8); }`

- Sekcja HTML modala (`.confirm-modal__actions`)
  - Było:
    - `<button type="button" id="confirmModalNoButton">Nie</button>`
    - `<button type="button" id="confirmModalYesButton">Tak</button>`
  - Jest:
    - `<button type="button" id="confirmModalYesButton">Tak</button>`
    - `<button type="button" id="confirmModalNoButton">Nie</button>`

- Sekcja JS (źródło ikony)
  - Było: `const modalImageUrl = 'Skull.png';`
  - Jest: `const modalImageUrl = '/Kalkulator/Modal_Icon.png';`

#### Plik `Kalkulator/docs/Documentation.md`
- Było: *(brak sekcji o poprawkach UI modala i checklisty diagnostycznej błędu zapisu)*
- Jest: dodano sekcję `8.1. Aktualizacja 2026-04-27 (modal zapisu/wczytania + diagnostyka zapisu Firebase)` z:
  - opisem zmian UI,
  - listą potencjalnych przyczyn błędu,
  - checklistą kroków diagnostycznych.

#### Plik `Kalkulator/docs/README.md`
- Było: *(brak zwięzłej sekcji użytkowej o nowych zmianach modala z dnia 2026-04-27)*
- Jest: dodano sekcję `Aktualizacja 2026-04-27 – modal zapisu/wczytania (UI)` z instrukcją PL/EN.

#### Plik `DetaleLayout.md`
- Było: *(brak wpisu o zmianie kolorystyki przycisku „Tak” i zmianie ikony modala)*
- Jest: dodano sekcję `Aktualizacja 2026-04-27 – modal potwierdzenia (Kalkulator/TworzeniePostaci)` opisującą nowy asset i czerwony wariant przycisku.

## 13) Uzupełnienie analizy – weryfikacja checklisty Firebase i tworzenia pól (2026-04-27)

### Prompt użytkownika (ten etap)
> Przeczytaj i uzupełnij analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md o nowe wnoski
>
> 1. Czy Firestore Database jest uruchomiona w projekcie wh40k-data-slate (Build → Firestore Database).
> - Moduł "Infoczytnik" działa, więc zakładam, ze Firestore Database jest uruchomiona
>
> 2. Czy opublikowane Rules faktycznie obejmują zapis na character_builder/current (i są aktywne po kliknięciu Publish).
> - Screen w Analizy/F3.jpg
>
> 3. Czy dane trafiają do właściwego projektu: porównać projectId z firebase-config.js z projektem otwartym w konsoli.
> - Screen w Analizy/F1.jpg
>
> 4. Czy dokument się aktualizuje: po zapisie pole savedAt powinno zmieniać timestamp.
> - Chyba nie. Screen w Analizy/F2.jpg
>
> 5. Czy przeglądarka nie blokuje połączeń do Firestore (DevTools → Network/Console, błędy permission-denied, failed-precondition, unavailable, CORS).
> - Moduł Infoczytnik działa, więc chyba tu jest ok
>
> 6. Czy domena/testowy hosting jest zgodny z konfiguracją aplikacji web i środowiskiem, z którego uruchamiasz moduł.
> - Nie rozumiem
>
> Sprawdź czy kod aplikacji tworzy nowe pola w dokumencie w Firebase. Bo ja utworzyłem tylko jedno pole o typie int64

### Nowe wnioski (odpowiedzi 1:1)

1. **Czy Firestore jest uruchomiony?**  
   **Najpewniej tak.** Sam fakt, że moduł Infoczytnik działa z Firestore i że w konsoli widzisz dane/reguły (`Analizy/F2.jpg`, `Analizy/F3.jpg`), wskazuje, że baza Cloud Firestore dla projektu `wh40k-data-slate` jest aktywna.

2. **Czy Rules obejmują zapis `character_builder/current` i są opublikowane?**  
   **Tak.** Na screenie `Analizy/F3.jpg` jest reguła:
   `match /character_builder/{document=**} { allow read, write: if true; }`  
   Taka reguła obejmuje również dokument `character_builder/current`. W lewym panelu historii widać świeżą publikację („Today • 8:30 AM”), więc wersja wygląda na opublikowaną.

3. **Czy zapis idzie do właściwego projektu?**  
   **Tak.** `Kalkulator/config/firebase-config.js` ma `projectId: "wh40k-data-slate"`, a na `Analizy/F1.jpg` web app jest przypięta do projektu `wh40k-data-slate` z tym samym identyfikatorem aplikacji i sender ID. To jest spójne.

4. **Czy dokument się aktualizuje (`savedAt`)?**  
   **Na pokazanym stanie jeszcze nie.** Na `Analizy/F2.jpg` w `character_builder/current` widać wyłącznie `schemaVersion: 1` i brak pola `savedAt`.  
   To oznacza, że **nie ma potwierdzonego skutecznego zapisu z modułu Kalkulator** od czasu utworzenia dokumentu ręcznie. Po udanym zapisie z aplikacji powinny pojawić się nowe pola (w tym `savedAt` jako timestamp serwera).

5. **Czy przeglądarka blokuje połączenia (DevTools)?**  
   Na podstawie samych screenshotów **nie da się tego potwierdzić** — potrzebny jest log z Console/Network podczas kliknięcia „Zapisz”.  
   Jednak ponieważ Infoczytnik działa, problemy typu globalny CORS/sieć są mniej prawdopodobne. Nadal możliwy jest błąd specyficzny dla strony Kalkulator (np. uruchomienie z innego originu lub brak poprawnej inicjalizacji na tej podstronie).

6. **Domena/testowy hosting – co to znaczy?**  
   Chodzi o to, **z jakiego adresu otwierasz moduł** (np. `https://...`, `http://localhost:...`, `file://...`) i czy ten sposób uruchomienia jest zgodny z konfiguracją aplikacji web Firebase.  
   Praktycznie: testuj moduł z normalnego serwera HTTP/HTTPS (nie z `file://`) i upewnij się, że to ta sama aplikacja/projekt co w `firebase-config.js`.

### Kluczowe sprawdzenie: czy kod tworzy nowe pola w Firestore?

**Tak — kod tworzy/nadpisuje wiele pól automatycznie.**  
W `Kalkulator/TworzeniePostaci.html` funkcja `collectCurrentState()` buduje pełny payload z polami:
- `schemaVersion`, `module`, `lang`, `savedAt`, `savedBy`,
- `xpPool`, `xpTotal`, `xpSpent`, `xpAvailable`,
- `hasValidationErrors`, `validationMessages`,
- `attributes`, `skills`, `talents`, `formSnapshot`.

Następnie `saveStateToFirebase()` wykonuje:
`await firebaseContext.characterRef.set(payload);`
na dokumencie `character_builder/current`.

To oznacza:
- **nie musisz ręcznie dodawać tych pól** w konsoli Firebase,
- wystarczy, że dokument istnieje i rules pozwalają na write,
- po pierwszym udanym zapisie pola pojawią się same.

### Dlaczego teraz widzisz tylko `schemaVersion: int64`?

Bo to pole zostało utworzone ręcznie i wygląda na to, że zapis z modułu nie zakończył się sukcesem (brak `savedAt` i reszty payloadu).

### Co dokładnie sprawdzić teraz (krótki plan)

1. Otwórz Kalkulator i kliknij „Zapisz”.  
2. Od razu sprawdź DevTools → Console i zapisz dokładny kod błędu (np. `permission-denied`, `failed-precondition`, `unavailable`).  
3. Sprawdź Firestore `character_builder/current`:
   - czy doszły nowe pola,
   - czy `savedAt` zmienił się na aktualny timestamp.
4. Jeżeli dalej brak pól — wklej dokładny błąd z konsoli; to pozwoli wskazać precyzyjnie, czy problem jest w rules, środowisku uruchomienia czy połączeniu.

## 14) Aktualizacja analizy po błędach ładowania SDK Firebase na GitHub Pages (2026-04-27)

### Prompt użytkownika (ten etap)
> Przeczytaj i zaktualizuj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md
>
> 1. Przy wejściu na stronę https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci.html konsola pokazuje błędy:
>
> https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js
> https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js
> Wczytanie się nie powiodło dla elementu „script” ze źródłem „https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js”.
> https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js
> Wczytanie się nie powiodło dla elementu „script” ze źródłem „https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js”.
>
> Błąd: https://cutelittlegoat.github.io/favicon.ico jest związany z czymś innym (Analizy/analiza-favicon-kalkulator-2026-04-27.md)
>
> 2. Po nieudanej próbie zapisu w konsoli przeglądarki nie pojawia się nic nowego.
>
> Przygotowałem dwa screeny:
> Analizy/1.jpg
> Analizy/2.jpg

### Nowe ustalenia na podstawie screenów `Analizy/1.jpg` i `Analizy/2.jpg`

1. **Problem występuje wcześniej niż zapis do Firestore**.
   Na wejściu strony nie ładują się dwa kluczowe skrypty:
   - `firebase-app-compat.js`
   - `firebase-firestore-compat.js`

   Skutek: obiekt `firebase` nie jest dostępny w runtime dla modułu Kalkulator.

2. **To tłumaczy brak nowych błędów po kliknięciu „Zapisz”**.
   W obecnej implementacji `saveStateToFirebase()` gdy `firebaseContext.ready === false`, kod pokazuje tylko `alert("Nie udało się zapisać stanu postaci.")` i kończy działanie (`return`), bez `console.error(...)`.
   Dlatego po kliknięciu „Zapisz” nie pojawia się nowy wpis w konsoli — to jest zgodne z aktualną logiką aplikacji.

3. **Błąd `favicon.ico 404` jest niezależny** i nie wpływa na zapisywanie danych do Firestore (zgodnie z Twoją notatką i osobną analizą).

### Najbardziej prawdopodobna przyczyna źródłowa

Najbardziej prawdopodobny root cause: **na wersji opublikowanej w GitHub Pages jest różnica względem kodu lokalnego (deploy mismatch), albo przeglądarka/proxy zwraca 404 dla CDN Firebase**, przez co SDK nie ładuje się przed inicjalizacją.

Uwaga diagnostyczna: na screenshotach komunikat ostrzegawczy pokazuje URL z fragmentem `firebasesjs` (z dodatkowym `s`), co sugeruje możliwy literowy błąd w finalnym atrybucie `src` po stronie wersji, którą faktycznie serwuje GitHub Pages. To trzeba potwierdzić bezpośrednio w źródle strony online (`View Source`) i porównać 1:1 z repo.

### Co sprawdzić krok po kroku (konkretnie)

1. **Sprawdź finalny HTML na produkcji (GitHub Pages)**
   - Otwórz `View Source` dla:
     `https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci.html`
   - Potwierdź dokładne wartości trzech tagów:
     - `https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js`
     - `https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js`
     - `config/firebase-config.js`
   - Jeśli w source jest inna ścieżka (np. literówka), popraw i wykonaj redeploy.

2. **W zakładce Network kliknij na każdy request do `gstatic`**
   - sprawdź **Request URL** i **Status**,
   - jeżeli status 404 i URL ma literówkę, to błąd w HTML,
   - jeżeli URL jest poprawny, ale dalej 404/blocked, sprawdź czy nie działa filtr sieciowy/proxy/rozszerzenie blokujące.

3. **Potwierdź, że po udanym załadowaniu SDK pojawia się aktywność Firestore**
   - po kliknięciu „Zapisz” powinny pojawić się requesty `firestore.googleapis.com` w Network,
   - w dokumencie `character_builder/current` powinny dojść pola (`savedAt`, `xpPool`, `attributes`, `skills`, `talents`, `formSnapshot`, itd.).

### Wniosek końcowy (na teraz)

- Obecny problem z zapisem **nie wygląda na błąd Rules ani strukturę dokumentu Firestore**, tylko na **błąd ładowania SDK Firebase w przeglądarce** na etapie startu strony.
- Dopóki `firebase-app-compat.js` i `firebase-firestore-compat.js` nie ładują się poprawnie, zapis/wczyt nie zadziała niezależnie od tego, że Firestore i Rules są skonfigurowane.

---

## Aktualizacja analizy po wdrożeniu (2026-04-27)

### Prompt użytkownika (kontekst tej aktualizacji)
> Przeczytaj i zaktualizuj analizę Analizy/2026-04-27-analiza-kalkulator-tworzeniepostaci-zapis-wczytaj-firebase.md
>
> 1. Zmieniłem fragment kodu ... Po tej zmianie stan postaci się prawidłowo zapisuje i wczytuje.
> 2. Zaktualizuj dokumentecję o sposób naprawy.
> 3. Po zapisie/odczycie pojawia się okno przeglądarki ...
> 4. W oknie do potwierdzenia pojawia się zniekształcona (przycięta) ikona ...

### Wnioski po wdrożeniu
1. Przyczyną „okna przeglądarki” po zapisie/odczycie były natywne wywołania `alert(...)` (oraz wcześniej `confirm(...)` przy zmianie języka).
2. Rozwiązaniem jest użycie wyłącznie custom modala (`#confirmModal`) zarówno do potwierdzeń (Tak/Nie), jak i komunikatów końcowych (OK).
3. Przycięcie ikony wynikało z `object-fit: cover`; zmiana na `object-fit: contain` i stały kontener o zarezerwowanej wysokości eliminują problem.
4. Aby modal nie rozszerzał się po załadowaniu obrazu, dialog ma stałą minimalną wysokość, a sekcja grafiki jest renderowana stale.

### Sekcja zmian w kodzie (przed/po)

#### Plik: `Kalkulator/TworzeniePostaci.html`
- Linia (sekcja CSS obrazka modala)
  - Było: `.confirm-modal__image{ ... object-fit:cover; display:none; }`
  - Jest: `.confirm-modal__image{ ... object-fit:contain; display:block; }`
- Linia (widoczność obrazka)
  - Było: `.confirm-modal__image.is-visible{display:block;}`
  - Jest: `.confirm-modal__image.is-hidden{visibility:hidden;}`
- Linia (struktura HTML modala)
  - Było: `<img id="confirmModalImage" class="confirm-modal__image" alt="modal image">`
  - Jest: `<div class="confirm-modal__media"><img id="confirmModalImage" class="confirm-modal__image is-hidden" alt="modal image"></div>`
- Linia (komunikaty po zapisie/odczycie)
  - Było: `alert(t.errors.saveSuccess);`, `alert(t.errors.loadError);` itd.
  - Jest: `await showInfoModal({ ... message: t.errors.saveSuccess ... });` oraz analogicznie dla błędów i wczytywania.
- Linia (potwierdzenie zmiany języka)
  - Było: `const confirmed = confirm(translations[currentLanguage].errors.languageChangeWarning);`
  - Jest: `const confirmed = await showConfirmationModal({ title: t.labels.pageTitle, message: t.errors.languageChangeWarning, imageUrl: modalImageUrl });`
- Linia (nowa funkcja)
  - Było: brak funkcji trybu informacyjnego.
  - Jest: dodano `function showInfoModal(config) { ... }` używaną do komunikatów końcowych bez natywnych popupów.

#### Plik: `Kalkulator/docs/README.md`
- Dodano sekcję użytkową PL/EN:
  - Było: brak opisu eliminacji natywnych popupów i zasad wyświetlania ikony.
  - Jest: sekcje „Aktualizacja 2026-04-27 – zapis/odczyt bez systemowych okien przeglądarki” oraz „Update 2026-04-27 – save/load without browser-native popups”.

#### Plik: `Kalkulator/docs/Documentation.md`
- Dodano sekcję techniczną:
  - Było: brak opisu implementacji `showInfoModal`, rezerwy miejsca na ikonę i usunięcia `alert/confirm`.
  - Jest: sekcja „Aktualizacja 2026-04-27 – modal zapisu/odczytu i render ikony” z opisem implementacji, przyczyn i efektu.

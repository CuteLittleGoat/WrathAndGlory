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

### 3.2. Struktura dokumentu

Rekomendowana struktura (cały formularz + metadane):

```json
{
  "schemaVersion": 1,
  "module": "Kalkulator/TworzeniePostaci",
  "lang": "pl",
  "xpPool": 100,
  "attributes": {
    "S": 1,
    "Wt": 1,
    "Zr": 1,
    "I": 1,
    "SW": 1,
    "Int": 1,
    "Ogd": 1,
    "Speed": 6
  },
  "skills": {
    "Column1Row1": 0,
    "Column1Row2": 0,
    "Column1Row3": 0,
    "Column1Row4": 0,
    "Column1Row5": 0,
    "Column1Row6": 0,
    "Column1Row7": 0,
    "Column1Row8": 0,
    "Column1Row9": 0,
    "Column2Row1": 0,
    "Column2Row2": 0,
    "Column2Row3": 0,
    "Column2Row4": 0,
    "Column2Row5": 0,
    "Column2Row6": 0,
    "Column2Row7": 0,
    "Column2Row8": 0,
    "Column2Row9": 0
  },
  "talents": [
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 },
    { "name": "", "cost": 0 }
  ],
  "savedAt": "server timestamp",
  "savedBy": "anonymous-web-client"
}
```

Uwagi projektowe:
- `schemaVersion` — konieczne do bezpiecznych zmian w przyszłości.
- `lang` — zapisuje język aktywny przy zapisie; może służyć do decyzji UI po wczytaniu.
- `talents` jako tablica 10 elementów — czytelniejsza od 20 płaskich pól.
- `savedAt` z `serverTimestamp()` — wiarygodny znacznik czasu.

### 3.3. Zasady Firestore (minimum pod ten model)

Wariant otwarty (na start/test):
- read/write dla `character_builder/current`.

Wariant bezpieczniejszy (zalecany docelowo):
- write tylko dla uwierzytelnionych,
- read dla uwierzytelnionych lub wg Twojej polityki sesji.

Dodatkowa walidacja reguł (opcjonalna, ale zalecana):
- sprawdzaj `schemaVersion == 1`,
- `xpPool` jako liczba `>= 0`,
- atrybuty 1..12, umiejętności 0..8, koszt talentu `>= 0`,
- `talents.size() == 10`.

---

## 4) Zależność od języka (przyciski i okna potwierdzeń)

W bieżącym kodzie masz centralny obiekt `translations`. Rozszerzenie powinno dodać nową sekcję np. `actions` i `confirmations`:

- `saveButton`, `loadButton`
- `confirmSaveTitle`, `confirmSaveMessage`, `confirmLoadTitle`, `confirmLoadMessage`
- `yes`, `no`
- komunikaty końcowe: `saveSuccess`, `saveError`, `loadSuccess`, `loadError`, `noData`

Istotna uwaga UX:
- natywne `window.confirm` nie pozwala zmienić podpisów przycisków (zależą od przeglądarki/systemu),
- jeśli wymaganie literalnie brzmi „Tak/Nie” oraz „Yes/No” na przyciskach, potrzebny jest własny modal HTML/CSS/JS.

Czyli:
- **wariant szybki:** `confirm(...)` z tłumaczoną treścią,
- **wariant zgodny 1:1 z wymaganiem przycisków:** custom modal z przyciskami renderowanymi z `translations[currentLanguage]`.

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

To ułatwia pierwsze uruchomienie (przycisk „Wczytaj” nie trafi w pustkę).

---

## 8) Ryzyka i decyzje projektowe

1. **Kolizje zapisu** (dwie osoby jednocześnie):
   - przy modelu single-doc „ostatni zapis wygrywa” — to jest zgodne z Twoim wymaganiem braku wersjonowania.
2. **Brak dokumentu przy pierwszym odczycie:**
   - obsłużyć komunikatem `noData` w aktualnym języku.
3. **Spójność z obliczeniami XP:**
   - po `applyFormState` obowiązkowo `recalcXP()`.
4. **Własny modal vs `confirm`:**
   - jeśli potrzebujesz pełnej kontroli etykiet przycisków, wdrożyć custom modal.

---

## 9) Proponowana finalna specyfikacja Firebase dla tego zadania

Minimalny, kompletny zakres zmian po stronie Firebase:

1. **Dodać nową kolekcję i dokument:**
   - `character_builder/current`.
2. **Dodać pola dokumentu:**
   - `schemaVersion`, `module`, `lang`, `xpPool`, `attributes`, `skills`, `talents`, `savedAt`, `savedBy`.
3. **Dodać reguły dostępu** co najmniej dla tej ścieżki.
4. **(Zalecane) Dodać skrypt inicjalizacyjny** tworzący domyślny dokument.
5. **Nie tworzyć historii wersji** — zawsze nadpisywać `current`.

To dokładnie realizuje model „zapis/wczyt jednego stanu” i pozostaje spójne z wzorcem już użytym w module Infoczytnik.

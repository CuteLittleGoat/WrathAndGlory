# GeneratorNPC — analiza dodania listy ulubionych potworów

## Cel zmiany
Celem jest dodanie w module **GeneratorNPC** funkcjonalności zapisywania *zmodyfikowanych potworów* do jednej listy „Ulubione”, wraz z możliwością nadania aliasu każdemu wpisowi. Funkcjonalność ma działać na **tym samym projekcie Firebase/Firestore**, z którego korzysta moduł **Audio**. W GeneratorNPC nie będą potrzebne wielokrotne listy ani panel zarządzania listami (tylko jedna lista).

## Aktualny stan GeneratorNPC (co mamy dziś)
- GeneratorNPC działa w jednym pliku HTML i korzysta z danych z `DataVault/data.json` pobieranych z GitHub Pages. Dane są ładowane do obiektu `state`, który przechowuje bestiariusz, broń, pancerze i inne moduły. 【F:GeneratorNPC/index.html†L345-L403】
- Generowanie karty korzysta z aktualnie wybranych rekordów (bestia, pancerze, bronie, moduły) oraz modyfikacji w `state.bestiaryOverrides`. Dane są składane w `openPrintableCard()` na podstawie aktualnych wyborów i override’ów. 【F:GeneratorNPC/index.html†L2057-L2114】
- W module GeneratorNPC **nie ma** obecnie integracji z Firebase ani zapisu danych użytkownika.

## Wzorzec z modułu Audio (referencja do naśladowania)
- Audio ładuje konfigurację Firebase z pliku `config/firebase-config.js` i inicjalizuje Firestore. 【F:Audio/index.html†L591-L603】【F:Audio/config/firebase-config.js†L1-L9】
- Stan ulubionych w Audio jest przechowywany w `state.favorites` i `state.aliases`, a zapis odbywa się przez `saveSettings()` do Firestore (lub lokalnie w `localStorage`, gdy brak konfiguracji). 【F:Audio/index.html†L633-L1140】
- Audio używa dokumentu Firestore `doc(db, "audio", "favorites")` oraz nasłuchuje zmian `onSnapshot()` do synchronizacji. 【F:Audio/index.html†L1160-L1187】
- Alias jest nadawany i przechowywany osobno (`state.aliases[itemId]`), a każda zmiana aliasu aktualizuje zapis w Firestore. 【F:Audio/index.html†L1540-L1555】

## Wnioski architektoniczne dla GeneratorNPC
### 1) Dane do zapisu (schemat ulubionych)
Ponieważ chcemy zapisywać **zmodyfikowane potwory**, w ulubionych musimy przechować *snapshot* aktualnego stanu wyboru. Na podstawie logiki generowania karty należy przechować co najmniej:
- **Identyfikator bestii**: np. indeks `selectedBestiaryIndex` albo unikalny klucz z danych bestiariusza.
- **Aktualne override’y** z `state.bestiaryOverrides` (zmiany w statystykach, umiejętnościach itd.). 【F:GeneratorNPC/index.html†L385-L394】
- **Wybrane elementy** z modułów: listy ID/indeksów zaznaczonych broni, pancerzy, augmentacji, ekwipunku, talentów, psionik, modlitw.
- **Notatki użytkownika** (`bestiaryNotes`). 【F:GeneratorNPC/index.html†L365-L366】
- **Alias** – ręcznie wpisana nazwa zapisywana per ulubiony potwór.
- **Znacznik czasu** (serverTimestamp w Firestore, analogicznie do Audio) do sortowania i audytu. 【F:Audio/index.html†L1052-L1058】

**Proponowany schemat dokumentu (pojedyncza lista):**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "alias": "Mój mutowany ork",
      "createdAt": "serverTimestamp",
      "payload": {
        "selectedBestiaryIndex": 12,
        "bestiaryOverrides": {
          "numeric": { "Obrona": "6" },
          "skills": "...",
          "skillsEditing": false
        },
        "notes": "Dowódca oddziału",
        "modules": {
          "weaponIds": [1, 4],
          "armorIds": [2],
          "augmentationsIds": [],
          "equipmentIds": [0, 3],
          "talentsIds": [],
          "psionicsIds": [],
          "prayersIds": []
        }
      }
    }
  ],
  "updatedAt": "serverTimestamp"
}
```

### 2) UI/UX w GeneratorNPC
Minimalny zestaw elementów (bez panelu list):
- **Sekcja „Ulubione”** w sidebarze (lub osobny panel obok), zawierająca:
  - Pole tekstowe aliasu (opcjonalne).
  - Przyciski: „Dodaj do ulubionych”, „Usuń z ulubionych”, „Odśwież” (opcjonalnie).
  - Lista zapisanych potworów z aliasem + skrótem bazowej nazwy z bestiariusza.
- **Akcje per wpis**:
  - „Wczytaj” (ustawia selekcję w UI i odtwarza override’y, notatki, wybrane moduły).
  - „Usuń”.

### 3) Logika zapisu/odczytu
- **Zapis** w Firestore lub lokalnie (fallback), analogicznie do Audio.
- **Odczyt** poprzez `onSnapshot` (live sync) lub `getDoc` + render.
- **Odtworzenie stanu UI** wymaga:
  1) Ustawienia `bestiarySelect` na zapisany index.
  2) Odtworzenia `state.bestiaryOverrides`.
  3) Oznaczenia wyborów w `<select multiple>` dla broni/pancerzy itd.
  4) Aktualizacji tabel (renderXTable) po zmianie wyborów.

### 4) Współdzielenie Firebase z Audio
Moduł Audio już korzysta z Firebase w projekcie `audiorpg-2eb6f` poprzez `firebase-config.js`. 【F:Audio/config/firebase-config.js†L1-L9】
GeneratorNPC powinien użyć **tego samego konfiguratora** (ten sam obiekt `window.firebaseConfig`) i identycznych bibliotek Firebase.

## Proponowana integracja Firebase w GeneratorNPC
### W kodzie (plan zmian)
1) **Dodać plik konfiguracji Firebase** w module GeneratorNPC:
   - Najprościej: skopiować `Audio/config/firebase-config.js` do `GeneratorNPC/config/firebase-config.js`.
   - Alternatywnie: użyć wspólnego pliku w root i referencji względnej (np. `../Audio/config/firebase-config.js`).
2) **Dodać skrypt Firebase** w `GeneratorNPC/index.html` (analogicznie do Audio) i zaimportować:
   - `initializeApp`, `getFirestore`, `doc`, `setDoc`, `onSnapshot`, `serverTimestamp`.
3) **Wprowadzić stan** `favorites`, `favoritesDoc`, `usingFirestore` i lokalny fallback (localStorage), wzorując się na Audio. 【F:Audio/index.html†L633-L1169】
4) **Zaimplementować funkcje**: `saveFavorites()`, `loadFavorites()`, `renderFavorites()`, `addFavorite()`, `removeFavorite()`, `applyFavorite()`.
5) **Wpiąć aliasy** per zapisany wpis: alias powinien być zapisywany w tym samym rekordzie ulubionego potwora.

## Firebase — wymagane działania po stronie konsoli
Zakładam, że **projekt Firebase jest już aktywny** (jak w Audio). Jeśli tak, trzeba jedynie dodać nowy dokument/strukturę w Firestore i upewnić się, że reguły pozwalają na zapis/odczyt.

### Krok po kroku (bardzo dokładnie)
1) **Wejdź do Firebase Console**
   - https://console.firebase.google.com/
   - Wybierz projekt: `audiorpg-2eb6f` (ten sam co Audio, weryfikacja w `firebase-config.js`). 【F:Audio/config/firebase-config.js†L1-L9】

2) **Sprawdź Firestore Database**
   - W lewym menu: *Build → Firestore Database*.
   - Upewnij się, że baza jest utworzona i aktywna.

3) **Utwórz nowy dokument dla GeneratorNPC**
   - W Firestore kliknij „Start collection” lub wybierz istniejącą kolekcję.
   - **Proponowana kolekcja**: `generatorNpc` (nazwa dowolna, byle konsekwentna w kodzie).
   - **Proponowany dokument**: `favorites`.
   - W dokumencie możesz dodać pola startowe:
     ```json
     {
       "favorites": [],
       "updatedAt": null
     }
     ```
   - Alternatywnie: możesz nie tworzyć dokumentu ręcznie — aplikacja zrobi to automatycznie przy pierwszym zapisie, jeśli reguły na to pozwalają.

4) **Reguły bezpieczeństwa Firestore**
   - Wejdź w zakładkę **Rules** w Firestore.
   - Jeśli Audio już działa, reguły prawdopodobnie pozwalają na publiczny odczyt/zapis (lub na ograniczenia domen). Musisz rozszerzyć reguły tak, aby nowy dokument też był dostępny.
   - Przykładowe reguły (otwarte, analogiczne do Audio – do decyzji):
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /audio/{docId} {
           allow read, write: if true;
         }
         match /generatorNpc/{docId} {
           allow read, write: if true;
         }
       }
     }
     ```
   - **Jeśli chcesz ograniczyć dostęp** (np. tylko do domeny GitHub Pages), potrzebujesz uwierzytelniania lub użycia Firebase App Check / custom tokens — to osobny temat, ale warto rozważyć przy publicznej aplikacji.

5) **Konfiguracja po stronie GeneratorNPC**
   - Upewnij się, że `GeneratorNPC` ładuje `firebase-config.js` (z tymi samymi danymi co Audio).
   - W kodzie ustaw `doc(db, "generatorNpc", "favorites")` lub inną zgodną ścieżkę.

## Podsumowanie: co będzie potrzebne do implementacji
1) **Warstwa danych** — nowy model ulubionych (lista rekordów z aliasem + snapshot wyborów/override’ów).
2) **UI** — panel „Ulubione” w GeneratorNPC z listą, aliasem i akcjami (dodaj/usuń/wczytaj).
3) **Integracja Firestore** — inicjalizacja Firebase, zapis i odczyt `favorites` w projekcie `audiorpg-2eb6f` analogicznie do Audio. 【F:Audio/index.html†L1160-L1187】
4) **Fallback** — lokalny `localStorage`, gdy brak konfiguracji Firebase (jak w Audio). 【F:Audio/index.html†L1124-L1157】
5) **Odtwarzanie stanu** — funkcje odtwarzające UI na bazie zapisanych danych (selekcje i override’y).

Jeżeli zaakceptujesz powyższy plan, w kolejnym kroku mogę przygotować konkretną implementację w GeneratorNPC.

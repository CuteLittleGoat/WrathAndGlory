# Plan wdrożenia zmian na podstawie `Analizy/Projekt_Data.html`

## Prompt użytkownika
> Przeczytaj plik Analizy/Projekt_Data.html a następnie przeprowadź nową analizę. Zapisz w niej plan wdrożenia zmian zgodnie z Analizy/Projekt_Data.html.

## Cel wdrożenia
Celem jest utrzymanie publicznego kodu aplikacji przy jednoczesnym całkowitym usunięciu jawnego dostępu do danych `Repozytorium.xlsx` oraz `data.json`, bez zmiany logiki biznesowej generacji danych (XLSX → JSON), z zachowaniem działania online (web + PWA) na wielu urządzeniach jednocześnie.

## Założenia wejściowe
1. `Repozytorium.xlsx` pozostaje plikiem prywatnym i nie jest publikowany w repo ani hostingu.
2. `data.json` nie jest publicznym plikiem statycznym w repo ani pod adresem strony.
3. Źródłem runtime dla DataVault i GeneratorNPC jest prywatna ścieżka Firebase Realtime Database: `/datavault/live`.
4. Dostęp do danych odbywa się przez autoryzację (jedno hasło grupowe mapowane na sesję Firebase Auth).
5. Mechanizm transformacji danych z XLSX do JSON pozostaje logicznie zgodny z obecnym.

---

## Plan wdrożenia (kolejność realizacji)

### Etap 0 — przygotowanie i bezpieczeństwo repo
1. Usunąć z repo wszystkie realne kopie `Repozytorium.xlsx` i `data.json`.
2. Dodać/uzupełnić reguły `.gitignore`, aby zablokować ponowny commit plików danych.
3. Zweryfikować, czy w historii repo były commitowane dane i przygotować decyzję o ewentualnym czyszczeniu historii.
4. Potwierdzić, że hasło grupowe nie występuje w kodzie, dokumentacji ani commitach.

### Etap 1 — wspólna warstwa dostępu do danych
1. Utworzyć wspólny moduł dostępu (np. `shared/firebase-data-loader.js`) dla DataVault i GeneratorNPC.
2. W module osadzić wspólną konfigurację Firebase (bez sekretów), w tym `databaseURL`.
3. Dodać obsługę sesji Auth z trwałością lokalną (`browserLocalPersistence`).
4. Dodać API modułu:
   - logowanie hasłem (techniczne konto),
   - wylogowanie,
   - sprawdzenie aktywnej sesji,
   - pobranie danych z `/datavault/live`,
   - ujednoliconą obsługę błędów dostępu.

### Etap 2 — ekran dostępu i sesja użytkownika
1. W DataVault i GeneratorNPC wprowadzić ekran blokady danych (jedno pole hasła).
2. Po poprawnym logowaniu automatycznie przechodzić do ładowania danych.
3. Jeżeli sesja istnieje — pomijać ekran hasła.
4. Dodać przycisk „Wyloguj / Zablokuj dane”.
5. Ujednolicić komunikaty błędów (np. `Permission denied`, błędne hasło, brak połączenia).

### Etap 3 — migracja DataVault
1. Zastąpić odczyt lokalnego/publicznego `data.json` odczytem z Firebase `/datavault/live`.
2. Zachować istniejący format roboczy danych (`sheets`, `_meta`) tak, aby bieżące funkcje tabel działały bez regresji.
3. Zaktualizować teksty statusowe UI (ładowanie z prywatnej bazy).
4. W trybie admina zmienić mechanizm generowania:
   - zamiast fetch pliku obok aplikacji,
   - użyć wyboru lokalnego pliku (`input type=file`) i przekazać `ArrayBuffer` do aktualnego parsera.
5. Zachować logikę transformacji XLSX → JSON bez modyfikacji semantycznych.
6. Po generacji pozostawić eksport JSON do ręcznego importu w Firebase (bez prawa zapisu z aplikacji).

### Etap 4 — migracja GeneratorNPC
1. Usunąć zależność od `../DataVault/data.json`.
2. Zastąpić `fetch(DATA_URL)` wywołaniem wspólnego loadera Firebase.
3. Utrzymać obecną logikę mapowania danych do list (Bestiariusz, Bronie, Pancerze, Talenty itd.).
4. Upewnić się, że GeneratorNPC korzysta z tej samej sesji Auth co DataVault.
5. Zaktualizować sekcję „Źródło danych” w UI, aby nie wskazywała publicznego pliku.

### Etap 5 — PWA i cache
1. Upewnić się, że service worker nie cache’uje `data.json` jako zasobu statycznego.
2. Utrzymać cache app-shell (HTML/CSS/JS), ale bez utrwalania prywatnego payloadu danych jako publicznego artefaktu.
3. Zweryfikować zachowanie po odświeżeniu, restarcie PWA i przełączaniu modułów.

### Etap 6 — operacyjny workflow administratora
1. Admin edytuje lokalny `Repozytorium.xlsx`.
2. Admin w DataVault wskazuje plik z dysku.
3. Aplikacja generuje `data.json` lokalnie.
4. Admin importuje JSON do `Realtime Database → /datavault/live`.
5. Użytkownicy po zalogowaniu korzystają z nowych danych bez zmiany kodu aplikacji.

### Etap 7 — testy akceptacyjne
1. Test prywatności: niezalogowany dostęp do `/datavault/live.json` ma zwracać `Permission denied`.
2. Test logowania: poprawne hasło daje dostęp do danych w obu modułach.
3. Test sesji: brak ponownego pytania o hasło przy przełączaniu zakładek/modułów (w ramach aktywnej sesji).
4. Test wielourządzeniowy: równoległe działanie na kilku urządzeniach.
5. Test regresji: porównanie działania filtrów, sortowania i generatora przed/po migracji źródła danych.
6. Test admina: wskazanie lokalnego XLSX i poprawna generacja JSON.

---

## Kryteria ukończenia wdrożenia
1. W publicznym repo oraz publicznym hostingu brak realnych plików `Repozytorium.xlsx` i `data.json`.
2. DataVault i GeneratorNPC działają wyłącznie na danych z prywatnego Firebase po autoryzacji.
3. Logowanie hasłem nie jest wymagane przy każdym przełączeniu zakładki (działa sesja trwała).
4. Aktualizacja danych odbywa się przez ten sam model transformacji XLSX → JSON, z wejściem wskazywanym przez administratora.
5. Niezalogowany użytkownik nie ma technicznej możliwości pobrania danych runtime.

## Ryzyka i decyzje do zatwierdzenia
1. **Wygoda vs bezpieczeństwo offline** — czy dopuszczamy lokalne cache danych na zalogowanym urządzeniu.
2. **Model konta grupowego** — jedno hasło grupowe jest wygodne, ale wymaga procedury rotacji hasła przy wycieku.
3. **Uprawnienia zapisu** — pozostawić zapis do bazy wyłącznie poza aplikacją użytkownika (rekomendowane).
4. **Czyszczenie historii repo** — jeśli dane były publicznie commitowane, usunięcie z bieżącej gałęzi może być niewystarczające.

## Proponowany podział na sprinty
- **Sprint 1:** Etap 0 + Etap 1 + fundament UI logowania.
- **Sprint 2:** Etap 3 (DataVault) + Etap 5.
- **Sprint 3:** Etap 4 (GeneratorNPC) + Etap 6 + Etap 7.
- **Sprint 4 (hardening):** domknięcie ryzyk, audyt repo i dopracowanie UX.

---
# Aneks techniczny — Firebase, DataVault, GeneratorNPC i prywatne dane runtime

## 1. Cel aneksu

Ten aneks doprecyzowuje techniczne szczegóły wdrożenia prywatnego źródła danych dla modułów `DataVault` oraz `GeneratorNPC`.

Celem jest:

1. usunięcie jawnego dostępu do `Repozytorium.xlsx`,
2. usunięcie jawnego dostępu do `data.json`,
3. pozostawienie publicznego kodu aplikacji,
4. zachowanie działania aplikacji webowej i PWA,
5. zachowanie działania na wielu urządzeniach jednocześnie,
6. zachowanie dotychczasowej logiki transformacji `Repozytorium.xlsx` → `data.json`,
7. zastąpienie publicznego pliku `data.json` prywatnym źródłem runtime w Firebase Realtime Database.

Hasło grupowe oraz prywatny plik `Repozytorium.xlsx` nie mogą być zapisane w tym dokumencie, w repozytorium ani w kodzie aplikacji.

---

## 2. Aktualna konfiguracja Firebase

### 2.1. Projekt Firebase

```text
Firebase project: WH40k-Data-Slate
```

### 2.2. Realtime Database

```text
Database type: Firebase Realtime Database
Database location: Belgium / europe-west1
Database URL: https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app
Docelowa ścieżka danych runtime: datavault/live
Pełna ścieżka logiczna: /datavault/live
Adres testowy REST: https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app/datavault/live.json
```

### 2.3. Authentication

```text
Authentication provider: Email/Password
Email link / passwordless sign-in: wyłączone

Techniczny użytkownik Firebase Auth — UID: raCylxrrJ8YbOtgqXpvH6ygGkn72
Techniczny użytkownik Firebase Auth — e-mail: DO UZUPEŁNIENIA LOKALNIE
Hasło: NIE ZAPISYWAĆ W REPO, DOKUMENTACJI ANI KODZIE.
```

Uwagi:

- UID jest potrzebny w regułach Realtime Database.
- E-mail technicznego użytkownika będzie potrzebny w kodzie aplikacji, jeśli aplikacja ma pokazywać użytkownikowi tylko jedno pole hasła.
- E-mail technicznego użytkownika nie jest hasłem, ale powinien być traktowany jako element konfiguracji aplikacji.
- Hasło grupowe jest sekretem. Nie wolno go commitować, wpisywać do dokumentacji ani hardkodować w JavaScripcie.

---

## 3. Aktualne reguły Realtime Database

Docelowy stan reguł na obecnym etapie:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null && auth.uid === 'raCylxrrJ8YbOtgqXpvH6ygGkn72'",
        ".write": false
      }
    },
    ".read": false,
    ".write": false
  }
}
```

Znaczenie:

1. Odczyt `/datavault/live` jest dozwolony tylko dla zalogowanego użytkownika Firebase Auth o UID:

```text
raCylxrrJ8YbOtgqXpvH6ygGkn72
```

2. Zapis z poziomu aplikacji webowej/PWA jest zablokowany:

```json
".write": false
```

3. Cała reszta bazy jest domyślnie zamknięta:

```json
".read": false,
".write": false
```

4. Anonimowy użytkownik nie może pobrać danych z adresu:

```text
https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app/datavault/live.json
```

Oczekiwany wynik dla niezalogowanego użytkownika:

```json
{
  "error": "Permission denied"
}
```

Ten wynik został potwierdzony testem w oknie prywatnym/incognito.

---

## 4. Docelowa struktura danych w Realtime Database

Docelowo dane runtime aplikacji mają znajdować się tutaj:

```text
Realtime Database
└── datavault
    └── live
        ├── sheets
        ├── _meta
        └── inne pola obecnego data.json, jeśli istnieją
```

Zakładany format danych pod `/datavault/live` ma być taki sam jak format obecnego `data.json`.

Przykładowa struktura logiczna:

```json
{
  "sheets": {
    "Bestiariusz": [],
    "Bronie": [],
    "Pancerze": [],
    "Talenty": []
  },
  "_meta": {
    "sheetOrder": [],
    "columnOrder": {},
    "traits": {},
    "states": {}
  }
}
```

Ważne:

- Aplikacja ma pobierać dane z `/datavault/live`.
- Po pobraniu z Firebase dane mają być traktowane tak samo, jak dotychczasowy obiekt wczytany z `data.json`.
- Nie należy zmieniać formatu biznesowego danych, jeśli nie jest to bezwzględnie konieczne.

---

## 5. Zasady importu `data.json` do Firebase

### 5.1. Import zwykłego wygenerowanego `data.json`

Jeżeli wygenerowany plik ma czystą strukturę danych, np.:

```json
{
  "sheets": {},
  "_meta": {}
}
```

to należy importować go bezpośrednio do ścieżki:

```text
/datavault/live
```

Procedura ręczna:

```text
Firebase Console → Realtime Database → Data → rozwinąć datavault → kliknąć live → menu z trzema kropkami → Import JSON → wskazać wygenerowany data.json
```

W tym wariancie nie importować pliku na root `/`.

### 5.2. Import na root `/`

Import na root `/` jest poprawny tylko wtedy, gdy plik JSON jest specjalnie opakowany:

```json
{
  "datavault": {
    "live": {
      "sheets": {},
      "_meta": {}
    }
  }
}
```

Wtedy import do `/` utworzy strukturę:

```text
/datavault/live
```

### 5.3. Ostrzeżenie

Komunikat Firebase:

```text
All data at this location will be overwritten
```

oznacza, że wszystkie dane w aktualnie wybranej ścieżce zostaną nadpisane.

Dlatego:

- przy imporcie zwykłego `data.json` należy być w ścieżce `/datavault/live`,
- przy imporcie opakowanego JSON-a można być w root `/`,
- przed importem prawdziwych danych warto potwierdzić aktualną lokalizację w oknie importu.

---

## 6. Konfiguracja Firebase w kodzie aplikacji

Wspólna konfiguracja Firebase powinna zawierać `databaseURL`.

Schemat:

```js
const firebaseConfig = {
  apiKey: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS",
  authDomain: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS",
  databaseURL: "https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS",
  storageBucket: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS",
  messagingSenderId: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS",
  appId: "DO_UZUPEŁNIENIA_Z_FIREBASE_PROJECT_SETTINGS"
};
```

Uwaga:

- `firebaseConfig` nie jest hasłem.
- `apiKey` Firebase dla aplikacji webowej nie jest sekretem w takim samym sensie jak hasło.
- Bezpieczeństwo danych zapewniają reguły Realtime Database oraz Firebase Auth.
- Hasła grupowego nie wolno umieszczać w `firebaseConfig`.

---

## 7. Wspólny moduł dostępu do danych

Należy utworzyć wspólny moduł dla DataVault i GeneratorNPC, np.:

```text
shared/firebase-data-loader.js
```

albo inne wspólne miejsce zgodne ze strukturą projektu.

### 7.1. Odpowiedzialność modułu

Moduł powinien odpowiadać za:

1. inicjalizację Firebase,
2. obsługę Firebase Auth,
3. utrzymywanie sesji logowania,
4. logowanie technicznego użytkownika po haśle grupowym,
5. wylogowanie,
6. pobieranie danych z Realtime Database,
7. ujednolicenie błędów dla DataVault i GeneratorNPC.

### 7.2. Wymagane importy Firebase SDK

Moduł powinien używać:

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
```

Wersja SDK powinna być spójna z resztą projektu. Jeśli projekt używa `12.6.0`, utrzymać tę samą wersję.

### 7.3. Stałe konfiguracyjne

W module lub konfiguracji współdzielonej powinny istnieć:

```js
const DATA_ACCESS_EMAIL = "DO_UZUPEŁNIENIA_TECHNICZNY_EMAIL";
const DATA_PATH = "datavault/live";
const DATABASE_URL = "https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app";
```

Nie wolno dodawać:

```js
const DATA_ACCESS_PASSWORD = "...";
```

Hasło ma pochodzić wyłącznie z formularza użytkownika.

### 7.4. Proponowane API modułu

Wspólny loader powinien wystawiać funkcje o podobnej odpowiedzialności:

```js
initFirebaseDataAccess()
waitForAuthReady()
getCurrentUser()
loginWithGroupPassword(password)
logoutDataAccess()
loadDataVaultLive()
isAccessError(error)
getReadableAccessError(error)
```

Opis funkcji:

```text
initFirebaseDataAccess()
Inicjalizuje Firebase App, Auth i Realtime Database.
Ustawia persistence sesji na browserLocalPersistence.

waitForAuthReady()
Czeka, aż Firebase Auth ustali, czy użytkownik ma aktywną sesję.
Zapobiega miganiu ekranu logowania przy odświeżeniu strony.

getCurrentUser()
Zwraca aktualnego użytkownika Auth albo null.

loginWithGroupPassword(password)
Loguje technicznego użytkownika przez signInWithEmailAndPassword(DATA_ACCESS_EMAIL, password).
Hasło pochodzi z formularza.
Hasło nie jest zapisywane w localStorage/sessionStorage.

logoutDataAccess()
Wylogowuje użytkownika z Firebase Auth.
Czyści dane runtime z pamięci aplikacji, jeśli są przechowywane globalnie.

loadDataVaultLive()
Pobiera snapshot z Realtime Database ze ścieżki datavault/live.
Zwraca obiekt danych w tym samym formacie co dawny data.json.
Rzuca czytelny błąd, jeśli snapshot nie istnieje albo brak dostępu.

isAccessError(error)
Rozpoznaje błędy dostępu, np. permission_denied, auth/wrong-password, auth/invalid-credential.

getReadableAccessError(error)
Zwraca tekst dla UI, np.:
- "Brak dostępu do danych."
- "Nieprawidłowe hasło."
- "Brak połączenia z bazą."
```

---

## 8. Trwałość sesji i brak ciągłego pytania o hasło

Docelowe zachowanie:

1. Użytkownik wpisuje hasło raz na urządzeniu.
2. Firebase Auth tworzy sesję.
3. Sesja jest utrzymywana lokalnie w przeglądarce/PWA.
4. Przełączanie zakładek w DataVault nie wymaga ponownego hasła.
5. Przejście z DataVault do GeneratorNPC nie wymaga ponownego hasła, jeśli oba moduły działają w tym samym originie i używają tej samej konfiguracji Firebase.
6. Odświeżenie strony nie powinno wymagać hasła, o ile sesja Firebase nadal istnieje.
7. Hasło jest wymagane ponownie po:
   - wylogowaniu,
   - wyczyszczeniu danych przeglądarki/PWA,
   - wygaśnięciu/unieważnieniu sesji,
   - zmianie hasła użytkownika technicznego,
   - usunięciu użytkownika Firebase Auth.

W kodzie należy użyć:

```js
setPersistence(auth, browserLocalPersistence)
```

Ważne:

- Nie zapisywać hasła w `localStorage`.
- Nie zapisywać hasła w `sessionStorage`.
- Nie zapisywać hasła w IndexedDB.
- Sesję ma obsługiwać Firebase Auth, nie własny mechanizm hasła.

---

## 9. Ekran blokady danych

DataVault i GeneratorNPC powinny mieć spójny ekran dostępu.

### 9.1. Widoczne elementy

Minimalnie:

```text
Tytuł: Dostęp do prywatnych danych
Opis: Dane aplikacji są prywatne. Podaj hasło dostępu.
Pole: Hasło dostępu
Przycisk: Odblokuj dane
```

Opcjonalnie:

```text
Komunikat błędu: Nieprawidłowe hasło albo brak dostępu do danych.
Przycisk: Wyloguj / Zablokuj dane
```

### 9.2. Czego nie pokazywać użytkownikowi

Nie trzeba pokazywać pola e-mail, jeśli aplikacja ma używać technicznego konta grupowego.

Użytkownik widzi tylko:

```text
Hasło dostępu
```

Aplikacja technicznie loguje się przez:

```text
DATA_ACCESS_EMAIL + hasło wpisane przez użytkownika
```

### 9.3. Zachowanie UI

1. Przy starcie modułu aplikacja czeka na ustalenie stanu Firebase Auth.
2. Jeśli istnieje aktywna sesja, ekran hasła jest pomijany.
3. Jeśli sesji nie ma, ekran hasła jest pokazany.
4. Po poprawnym haśle ekran znika, dane są pobierane.
5. Po błędnym haśle ekran zostaje, a użytkownik widzi błąd.
6. Po wylogowaniu dane są czyszczone z pamięci, a ekran hasła wraca.

---

## 10. Zmiany w DataVault

### 10.1. Ładowanie danych runtime

Obecny model:

```text
DataVault ładuje publiczny/lokalny data.json.
```

Docelowy model:

```text
DataVault loguje użytkownika przez Firebase Auth.
DataVault pobiera dane z Realtime Database z datavault/live.
DataVault używa pobranego obiektu tak, jak dotychczas używał data.json.
```

### 10.2. Wymagane zmiany logiczne

Należy:

1. znaleźć aktualną funkcję startową ładującą `data.json`,
2. usunąć lub wyłączyć `fetch("data.json")` / równoważne publiczne ładowanie,
3. zastąpić je wywołaniem wspólnego loadera:

```js
const data = await loadDataVaultLive();
DB = data;
```

4. zachować istniejący format roboczy danych:

```text
DB.sheets
DB._meta
```

5. nie zmieniać mechaniki:
   - renderowania tabel,
   - filtrów,
   - sortowania,
   - tooltipów,
   - porównywania,
   - widoku domyślnego,
   - widoku pełnego,
   - przełączania zakładek,
   - ukrywania zakładek admin-only, jeśli nie wynika to bezpośrednio ze zmiany źródła danych.

### 10.3. Statusy i komunikaty

Zaktualizować komunikaty typu:

```text
Ładowanie data.json...
OK — załadowano data.json
Błąd ładowania data.json
```

na odpowiedniki:

```text
Ładowanie danych z prywatnej bazy...
OK — załadowano dane z prywatnej bazy
Błąd ładowania danych z prywatnej bazy
Brak dostępu do danych. Podaj hasło ponownie.
```

Zaktualizować wersję polską i angielską, jeśli moduł ma tłumaczenia.

### 10.4. Generowanie `data.json` w trybie admina

Obecny model:

```text
Repozytorium.xlsx musi znajdować się obok index.html.
Aplikacja pobiera go sama z folderu DataVault.
```

Docelowy model:

```text
Admin wskazuje lokalny plik Repozytorium.xlsx przez okno wyboru pliku.
Aplikacja czyta ten plik lokalnie w przeglądarce.
Aplikacja generuje data.json.
Admin pobiera data.json i ręcznie importuje go do Firebase.
```

### 10.5. Wymagany input pliku

Dodać mechanizm wyboru pliku:

```html
<input id="repoXlsxInput" type="file" accept=".xlsx,.xlsm,.xls" hidden>
```

Przycisk `Generuj data.json` powinien wywoływać kliknięcie tego inputa.

Po wyborze pliku:

```js
const file = event.target.files[0];
const arrayBuffer = await file.arrayBuffer();
```

Następnie `arrayBuffer` powinien trafić do obecnej logiki parsera XLSX.

### 10.6. Zachowanie parsera

Logika biznesowa transformacji XLSX → JSON ma pozostać bez zmian semantycznych.

Dopuszczalna zmiana techniczna:

```text
źródło danych wejściowych: z fetch("Repozytorium.xlsx") na file.arrayBuffer()
```

Niedopuszczalne bez osobnej decyzji:

```text
zmiana struktury wynikowego data.json,
zmiana nazw arkuszy,
zmiana mapowania kolumn,
zmiana logiki _meta,
zmiana reguł normalizacji danych.
```

### 10.7. Upload do Firebase

Na obecnym etapie DataVault nie powinien sam zapisywać do Realtime Database.

Powód:

```text
Wspólny użytkownik grupowy zna hasło.
Ten użytkownik ma mieć prawo odczytu, ale nie zapisu.
```

Dlatego reguły mają:

```json
".write": false
```

Wgrywanie prawdziwego `data.json` odbywa się ręcznie przez panel Firebase.

---

## 11. Zmiany w GeneratorNPC

### 11.1. Usunięcie publicznego źródła danych

Obecny model GeneratorNPC:

```js
const DATA_URL = "../DataVault/data.json";
```

Docelowo należy usunąć zależność od tego pliku.

GeneratorNPC nie powinien:

1. linkować do `../DataVault/data.json`,
2. pobierać `../DataVault/data.json`,
3. zakładać, że DataVault publikuje statyczny plik JSON.

### 11.2. Nowe ładowanie danych

Zamiast:

```js
const response = await fetch(DATA_URL);
const data = await response.json();
```

użyć wspólnego loadera:

```js
const data = await loadDataVaultLive();
```

Po pobraniu danych reszta logiki GeneratorNPC powinna działać na tym samym formacie, co dotychczas.

### 11.3. Zachować obecną logikę mapowania

Nie zmieniać bez potrzeby logiki korzystającej z arkuszy:

```text
Bestiariusz
Bronie
Pancerze
Augumentacje
Ekwipunek
Talenty
Psionika
Modlitwy
Cechy
Stany
```

Zmienić tylko źródło danych.

### 11.4. Sekcja UI „Źródło danych”

Obecny tekst/link sugerujący:

```text
Dane są pobierane z pliku ../DataVault/data.json
```

należy zastąpić tekstem typu:

```text
Dane są pobierane z prywatnej bazy DataVault po autoryzacji.
```

Nie pokazywać linku do publicznego `data.json`.

### 11.5. Firestore dla ulubionych

Jeżeli GeneratorNPC używa Firestore do ulubionych, ten mechanizm jest osobny.

Nie mieszać:

```text
Firestore favorites
```

z:

```text
Realtime Database /datavault/live
```

Realtime Database ma służyć jako prywatne źródło danych DataVault/GeneratorNPC.

---

## 12. PWA i service worker

### 12.1. Zasada główna

Service worker nie może cache’ować prywatnego `data.json` jako publicznego zasobu aplikacji.

### 12.2. Dozwolone

Można cache’ować app shell:

```text
HTML
CSS
JS
manifest
ikony
grafiki UI
```

### 12.3. Niedozwolone bez osobnej decyzji

Nie dodawać do app shell:

```text
DataVault/data.json
Repozytorium.xlsx
```

Nie tworzyć reguł cache, które utrwalają odpowiedź z:

```text
https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app/datavault/live.json
```

jako publiczny zasób.

### 12.4. Offline

Domyślna decyzja:

```text
PWA może działać offline jako powłoka aplikacji.
Prywatne dane runtime wymagają połączenia i aktywnej sesji.
```

Ewentualny tryb offline danych wymaga osobnej decyzji, ponieważ oznacza zapisanie danych lokalnie na urządzeniu użytkownika.

---

## 13. `.gitignore`

Dodać lub zweryfikować wpisy:

```gitignore
Repozytorium.xlsx
data.json
DataVault/Repozytorium.xlsx
DataVault/data.json
**/Repozytorium.xlsx
**/data.json
```

Jeżeli w repo mają istnieć przykładowe pliki bez danych z podręczników, używać innych nazw, np.:

```text
data.example.json
Repozytorium.example.xlsx
```

i upewnić się, że zawierają tylko dane demonstracyjne/testowe.

---

## 14. Usunięcie danych z repo i historia Git

Usunięcie plików z aktualnej gałęzi `main` nie usuwa ich automatycznie z historii Git.

Należy ustalić:

1. czy prawdziwe `Repozytorium.xlsx` lub `data.json` były kiedykolwiek w publicznym repo,
2. czy repo było prywatne przez cały okres istnienia tych danych,
3. czy ryzyko pozostawienia danych w historii jest akceptowalne,
4. czy trzeba przepisać historię repo,
5. czy prościej założyć nowe, czyste repo publiczne bez historii danych.

Możliwe decyzje:

```text
Wariant A: Repo było prywatne, ryzyko akceptowane, usuwamy pliki z main i dodajemy .gitignore.
Wariant B: Repo było publiczne albo dane mogły zostać pobrane, trzeba przepisać historię Git.
Wariant C: Tworzymy nowe czyste repo publiczne i przenosimy tylko kod bez danych.
```

---

## 15. Testy techniczne po wdrożeniu

### 15.1. Test prywatności

W oknie incognito wejść na:

```text
https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app/datavault/live.json
```

Oczekiwany wynik:

```json
{
  "error": "Permission denied"
}
```

### 15.2. Test logowania

1. Otworzyć DataVault.
2. Nie powinny pojawić się dane bez sesji.
3. Wpisać hasło grupowe.
4. Aplikacja powinna pobrać dane z Firebase.
5. Tabele powinny się wyrenderować.

### 15.3. Test sesji

1. Zalogować się w DataVault.
2. Odświeżyć stronę.
3. Aplikacja nie powinna pytać ponownie o hasło.
4. Przejść do GeneratorNPC.
5. GeneratorNPC powinien użyć tej samej sesji.
6. Wrócić do DataVault.
7. Nadal nie powinno być ponownego pytania o hasło.

### 15.4. Test PWA

1. Zainstalować PWA.
2. Uruchomić PWA.
3. Zalogować się hasłem.
4. Zamknąć PWA.
5. Uruchomić ponownie.
6. Aplikacja powinna zachować sesję, o ile dane aplikacji nie zostały wyczyszczone.

### 15.5. Test błędnego hasła

1. Wylogować się.
2. Wpisać błędne hasło.
3. Aplikacja nie powinna pobrać danych.
4. Użytkownik powinien zobaczyć czytelny komunikat błędu.

### 15.6. Test braku internetu

1. Odłączyć internet.
2. Uruchomić aplikację.
3. App shell może się załadować, jeśli jest w cache.
4. Dane prywatne nie powinny być ładowane z publicznego cache.
5. Użytkownik powinien dostać komunikat o braku połączenia lub braku możliwości pobrania danych.

### 15.7. Test importu danych

1. Wygenerować nowy `data.json` z lokalnego `Repozytorium.xlsx`.
2. Wejść w Firebase Console.
3. Wejść w `Realtime Database → Data → datavault → live`.
4. Użyć `Import JSON`.
5. Wskazać wygenerowany `data.json`.
6. Odświeżyć DataVault.
7. Sprawdzić, czy nowe dane są widoczne.
8. Odświeżyć GeneratorNPC.
9. Sprawdzić, czy generator korzysta z tych samych nowych danych.

### 15.8. Test regresji DataVault

Sprawdzić:

```text
zakładki,
sortowanie,
filtrowanie,
globalne wyszukiwanie,
porównywanie rekordów,
widok domyślny,
widok pełny,
tooltipy cech,
ukrywanie zakładek admin-only,
wersję PL/EN, jeśli dotyczy.
```

### 15.9. Test regresji GeneratorNPC

Sprawdzić:

```text
ładowanie Bestiariusza,
wybór broni,
wybór pancerzy,
wybór augumentacji,
wybór ekwipunku,
wybór talentów,
wybór psioniki,
wybór modlitw,
generowanie karty,
ulubione,
zachowanie po odświeżeniu.
```

---

## 16. Minimalna definicja ukończenia technicznego

Zmiana jest zakończona dopiero wtedy, gdy spełnione są wszystkie warunki:

1. W publicznym repo nie ma prawdziwego `Repozytorium.xlsx`.
2. W publicznym repo nie ma prawdziwego `data.json`.
3. Publiczny hosting/PWA nie udostępnia `data.json` jako statycznego pliku.
4. Anonimowy dostęp do `/datavault/live.json` zwraca `Permission denied`.
5. DataVault pobiera dane z Firebase po autoryzacji.
6. GeneratorNPC pobiera dane z Firebase po autoryzacji.
7. Oba moduły korzystają z tej samej sesji Auth.
8. Użytkownik nie wpisuje hasła przy każdej zakładce.
9. Admin generuje `data.json` z lokalnie wskazanego `Repozytorium.xlsx`.
10. Admin importuje `data.json` do `/datavault/live`.
11. Service worker nie cache’uje prywatnych danych jako publicznego zasobu.
12. Hasło grupowe nie występuje w repo, dokumentacji ani kodzie.

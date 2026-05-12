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

# Projekt PWA

## Prompt użytkownika (kontekst)
> Przeczytaj analizy:
> Analizy/Analiza_Wdrozenia_PWA_Main_User_Infoczytnik.md
> Analizy/Analiza_Poprawnosci_Manifestow_PWA_Orientacja_Infoczytnik_Powiadomienia_2026-03-13.md
>
> Następnie utwórz nową analizę o nazwie "Projekt_PWA.md"
> Zawrzyj tam informacje na temat działania PWA. Obecnej struktury plików.
> Interesuje mnie, żeby aplikacja:
> 1. Miała dostęp tylko do widoku użytkownika (bez dopisku ?admin=1)
> 2. Moduł Infoczytnik uruchamiała w orientacji pionowej niezależnie od ustawień urządzenia
> 3. Pozostałe moduły mogą się uruchamiać w orientacji pionowej lub poziomej.
> 4. Logo aplikacji to ma być IkonaGlowna.png
> 5. Aplikacja ma wspierać powiadomienia w Androidzie
> 6. Aplikacja będzie działać tylko online
> 7. W Androidzie powiadomienia mają mieć ikonę: IkonaPowiadomien.png
> 8. W Androidzie powiadomienia mają mieć stały tekst: +++ INCOMING DATA-TRANSMISSION +++
> 9. Powiadomienie ma się pojawiać jak użytkownik w panelu GM modułu Infoczytnik (uruchamianym na innym urządzeniu) wyśle jakąś wiadomość.
> 10. Powiadomienie ma się pojawiać na urządzeniu z zainstalowaną aplikacją:
> Wariant A - niezależnie od tego czy aplikacja jest obecnie uruchomiona czy zminimalizowana
> Wariant B - jeżeli aplikacja jest aktywnie używana ale na innej zakładce
> Wariant C - Nawet jeżeli aplikacja jest wyłączona
> Przebieg:
> Użytkownik 1 - na PC uruchamia Infoczytnik/GM.html
> Użytkownik 2 - na tablecie ma uruchomioną aplikację mobilną PWA
> Użytkownik 1 - przygotowuje wiadomość i naciska "Wyślij"
> Użytkownik 2 - otrzymuje powiadomienie o nadejściu nowej wiadomości
>
> 11. W Firebase mam utworzoną "Android apps". Screen konfiguracji w Analizy/Firebase.jpg
> 12. W Analizy/Firebase2.jpg masz screen ustawień Firebase Cloud Messaging API (V1)
> 13. Sprawdź czy ta konfiguracja jej poprawna. Jeżeli muszę coś innego zrobić i ustawić (np. zmienić Rules, Alerts czy inne konfiguracje) to zrób mi nowy plik w Analizy i dokładnie opisz co dokładnie mam ustawić.
> 14. Docelowo aplikacje będzie działać na Android a nie iOS. iOS jest opcjonalny i nie będzie testowany ani brany pod uwagę przy tworzeniu aplikacji

## Prompt użytkownika (aktualizacja 2026-03-13)
> Przeczytaj pliki:
> Analizy/Analiza_Poprawnosci_Manifestow_PWA_Orientacja_Infoczytnik_Powiadomienia_2026-03-13.md
> Analizy/Analiza_Wdrozenia_PWA_Main_User_Infoczytnik.md
> Analizy/Konfiguracja_Firebase_FCM_Android_Checklista.md
> Analizy/Projekt_PWA.md
>
> Następnie zaktualizuj Analizy/Projekt_PWA.md.
> Sprawdź czy obecna struktura plików i konfiguracja Firebase zapewnia obsługę wszystkich wypisanych funkcjonalności.

---

## 1) Weryfikacja stanu repo (aktualna)

Sprawdzono realne pliki wykonywalne i konfiguracyjne:
- `manifest.webmanifest`
- `service-worker.js`
- `Main/index.html`
- `Infoczytnik/Infoczytnik.html`
- `Infoczytnik/GM.html`
- `Infoczytnik/config/firebase-config.js`
- `Infoczytnik/config/web-push-config.js`
- `Infoczytnik/backend/server.js`

Wniosek ogólny: **fundament PWA + Firestore + Web Push istnieje i jest spójny architektonicznie, ale nie wszystkie funkcjonalności są „gotowe produkcyjnie” bez domknięcia endpointów push i backendu z kluczami VAPID.**

---

## 2) Ocena wymaganych funkcjonalności (1–10)

1. **Tylko user view (bez `?admin=1`)**
   **Status: częściowo spełnione.**
   Logika user/admin działa przez parametr URL i ukrywanie elementów. Nadal istnieją ścieżki adminowe (`?admin=1`), więc to nie jest twarda blokada, tylko model „nie pokazywać linku”.

2. **Infoczytnik zawsze pionowo**
   **Status: spełnione warunkowo platformowo.**
   Kod wykonuje `screen.orientation.lock("portrait")`. Na Android PWA zwykle działa, ale Web API może zostać odrzucone przez środowisko urządzenia/przeglądarki.

3. **Pozostałe moduły pion/poziom**
   **Status: spełnione.**
   Brak globalnego `orientation` w manifeście, więc nie ma globalnej blokady orientacji.

4. **Logo aplikacji = `IkonaGlowna.png`**
   **Status: spełnione.**
   Manifest wskazuje `IkonaGlowna.png` w ikonach 192 i 512.

5. **Powiadomienia Android**
   **Status: częściowo spełnione.**
   Service Worker obsługuje `push` i notyfikacje, ale w `web-push-config.js` endpointy są nadal przykładowe (`https://example.com/...`). Bez realnego backendu HTTPS notyfikacje nie ruszą w produkcji.

6. **Aplikacja tylko online**
   **Status: spełnione funkcjonalnie, z wyjątkiem shell-cache.**
   SW cache’uje minimalny app-shell, ale dane i główne działanie wymagają sieci. Przy braku sieci jest 503 dla nawigacji.

7. **Ikona powiadomień = `IkonaPowiadomien.png`**
   **Status: spełnione.**
   SW używa tej ikony jako `icon` i `badge` (domyślnie).

8. **Stały tekst powiadomienia**
   **Status: spełnione.**
   Domyślny `body` to `+++ INCOMING DATA-TRANSMISSION +++`.

9. **Trigger: GM na urządzeniu A → push na urządzeniu B**
   **Status: częściowo spełnione.**
   `GM.html` wywołuje `triggerEndpoint`, a użytkownik może subskrybować push. Jednak produkcyjnie wymaga działającego endpointu `subscribe/trigger` i poprawnych kluczy VAPID na serwerze.

10. **Warianty A/B/C (otwarta / w tle / zamknięta aplikacja)**
   **Status: możliwe technicznie, ale zależne od konfiguracji końcowej.**
   Po pełnym spięciu push i przy poprawnych uprawnieniach Android scenariusze A/B/C są realne. Bez działającego backendu push i endpointów HTTPS nie będą gwarantowane.

---

## 3) Czy konfiguracja Firebase jest wystarczająca?

## 3.1 Co jest już poprawne
- W repo jest poprawna konfiguracja Firebase Web App (`Infoczytnik/config/firebase-config.js`) i połączenie z Firestore (`dataslate/current`) w `Infoczytnik.html` i `GM.html`.
- VAPID public key jest wpisany w `Infoczytnik/config/web-push-config.js` i odpowiada wcześniejszym ustaleniom z checklisty.

## 3.2 Czego brakuje, aby uznać całość za „zapewnia obsługę wszystkich funkcjonalności”
1. `subscribeEndpoint` i `triggerEndpoint` nadal wskazują `example.com` (placeholder).
2. Backend push (`Infoczytnik/backend/server.js`) wymaga ustawionych zmiennych środowiskowych:
   - `WEB_PUSH_VAPID_PUBLIC_KEY`
   - `WEB_PUSH_VAPID_PRIVATE_KEY`
3. Potrzebne jest realne wdrożenie backendu po HTTPS (Cloudflare/VPS/inna platforma).

**Wniosek:**
- **Firebase jako baza danych (Firestore): TAK, jest spięte.**
- **Firebase/FCM + push jako pełny kanał dostarczania notyfikacji: JESZCZE NIE, bo endpointy produkcyjne i wdrożenie backendu nie są domknięte.**

---

## 4) Ocena struktury plików pod kątem kompletności

Obecna struktura jest poprawna i wystarczająca do wdrożenia:
- warstwa PWA globalna (`manifest.webmanifest`, `service-worker.js`),
- launcher (`Main/index.html`) z rejestracją SW i aktywacją powiadomień,
- Infoczytnik user + GM,
- konfiguracje Firebase i Web Push,
- osobny backend push z endpointami.

Brakuje nie struktury, tylko **uzupełnienia konfiguracji środowiskowej** (adresy endpointów i klucze backendowe).

---

## 5) Odpowiedź końcowa na pytanie użytkownika

**Nie — na ten moment obecna struktura plików + konfiguracja Firebase nie zapewnia jeszcze pełnej obsługi wszystkich wypisanych funkcjonalności „end-to-end” w produkcji.**

Zapewnia:
- działanie PWA,
- działanie Firestore,
- orientację pionową Infoczytnika,
- przygotowaną obsługę notyfikacji po stronie SW i UI.

Nie zapewnia jeszcze bez dodatkowych kroków:
- pełnego, produkcyjnego przepływu push GM → backend → urządzenie (A/B/C), bo endpointy są placeholderami i backend wymaga finalnej konfiguracji VAPID + hostingu HTTPS.

---

## 6) Minimalny checklist „gotowe do produkcji”

1. Wystawić publiczny backend push po HTTPS.
2. Ustawić `WEB_PUSH_VAPID_PUBLIC_KEY` i `WEB_PUSH_VAPID_PRIVATE_KEY` na serwerze backend.
3. Podmienić w `Infoczytnik/config/web-push-config.js`:
   - `subscribeEndpoint` → realny URL,
   - `triggerEndpoint` → realny URL.
4. Wykonać test 2-urządzeniowy (PC GM + Android tablet PWA) dla A/B/C.
5. (Opcjonalnie) uszczelnić dostęp adminowy, jeśli ma być twardo zablokowany, a nie tylko ukryty w UI.

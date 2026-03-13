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

---

## 1) Obecne działanie PWA (stan repo)

### 1.1 Warstwa główna PWA
- Główny manifest `manifest.webmanifest` jest poprawnie podpięty do aplikacji i wskazuje start z `Main/index.html`.
- `display` jest ustawiony na `standalone`, co wspiera instalację na Androidzie.
- Ikony w manifeście zawierają `IkonaGlowna.png` (192 i 512), więc wymaganie „logo aplikacji to IkonaGlowna.png” jest już spełnione.

### 1.2 Service Worker i notyfikacje
- Główny `service-worker.js` obsługuje `push` oraz `notificationclick`.
- Domyślna treść powiadomienia to `+++ INCOMING DATA-TRANSMISSION +++`.
- Domyślna ikona i badge powiadomień to `IkonaPowiadomien.png`.
- Kod ma gotowy przepływ do notyfikacji systemowych Android (o ile push jest skonfigurowany po stronie backend/FCM).

### 1.3 Zachowanie widoku użytkownik/admin
- `Main/index.html` i logika modułów opierają się o parametr `?admin=1`.
- Dla użytkownika bez parametru admin widoczne są wyłącznie elementy user-mode.
- To oznacza, że docelowy „dostęp tylko do widoku użytkownika” można osiągnąć przez stałe wejście do URL bez `?admin=1` oraz niewystawianie linków/admin-entrypointów w dystrybucji mobilnej.

### 1.4 Infoczytnik i orientacja
- `Infoczytnik/Infoczytnik.html` wykonuje `screen.orientation.lock("portrait")`.
- To jest prawidłowy kierunek dla wymagania „Infoczytnik pionowo niezależnie od ustawień urządzenia”.
- Technicznie na webie lock orientacji bywa zależny od środowiska (Chrome/WebView/tryb uruchomienia), więc należy traktować to jako „wymuszenie tam, gdzie platforma pozwala”.

### 1.5 Inne moduły i orientacja
- W globalnym manifeście nie ma pola `orientation`, więc pozostałe moduły nie są globalnie blokowane i mogą działać pion/poziom.
- To jest zgodne z wymaganiem dla pozostałych modułów.

### 1.6 Tryb online-only
- Architektura już zakłada sieć (Firestore i push).
- Service Worker obecnie cache’uje shell i część zasobów; to nie czyni aplikacji „pełnym offline”, ale może serwować część plików lokalnie.
- Jeżeli ma być rygorystycznie „tylko online”, w kolejnym kroku warto ograniczyć SW do strategii `network-first` dla wszystkich ścieżek dynamicznych i dodać czytelny fallback „brak połączenia”.

---

## 2) Obecna struktura plików (obszary krytyczne dla PWA)

## 2.1 Root (wspólne)
- `manifest.webmanifest` — definicja instalowalnej PWA.
- `service-worker.js` — cache app-shell + obsługa push.
- `IkonaGlowna.png` — ikona aplikacji.
- `IkonaPowiadomien.png` — ikona notyfikacji Android.

## 2.2 Moduł Main
- `Main/index.html` — launcher modułów, logika user/admin, rejestracja Service Workera.

## 2.3 Moduł Infoczytnik
- `Infoczytnik/Infoczytnik.html` — ekran użytkownika; lock pionu; aktywacja subskrypcji Web Push.
- `Infoczytnik/GM.html` — panel GM; wysyłka wiadomości i trigger powiadomienia.
- `Infoczytnik/config/web-push-config.js` — endpointy push + VAPID key (obecnie do uzupełnienia produkcyjnego).
- `Infoczytnik/config/firebase-config.js` — konfiguracja Firebase dla synchronizacji wiadomości.
- `Infoczytnik/backend/server.js` — backend Web Push (`/subscribe`, `/trigger`) z VAPID.

---

## 3) Ocena wymagań 1–10

1. **Tylko user view (bez `?admin=1`)** — możliwe i zgodne z obecną logiką; wymaga utrzymania user-only URL w instalowanej ścieżce.
2. **Infoczytnik pionowo** — już wdrożone przez `screen.orientation.lock("portrait")`.
3. **Pozostałe moduły pion/poziom** — już zgodne (brak globalnego `orientation`).
4. **Logo = IkonaGlowna.png** — już zgodne (manifest).
5. **Powiadomienia Android** — architektura gotowa, ale wymaga pełnej konfiguracji backend/FCM.
6. **Tylko online** — funkcjonalnie tak, ale zalecana drobna korekta strategii cache SW przy wdrożeniu produkcyjnym.
7. **Ikona notyfikacji = IkonaPowiadomien.png** — już zgodne.
8. **Stały tekst notyfikacji** — już zgodne (domyślny body).
9. **Trigger z GM na inne urządzenie** — logika klienta jest gotowa; niezbędna konfiguracja produkcyjnego kanału push.
10. **A/B/C (aplikacja otwarta, w tle, zamknięta)**:
   - A/B: osiągalne przez Web Push/FCM + Service Worker,
   - C: osiągalne na Androidzie, o ile system i przeglądarka nie zablokują powiadomień oszczędzaniem energii/uprawnieniami.

---

## 4) Docelowa architektura pod Android (bez iOS jako celu)

Rekomendowana ścieżka docelowa:
1. Utrzymać PWA jako frontend (`Main` + `Infoczytnik`).
2. Utrzymać lock pionu w `Infoczytnik`.
3. Utrzymać orientację adaptacyjną dla innych modułów.
4. Powiadomienia realizować przez **jedną** spójną drogę:
   - wariant A: własny backend Web Push (VAPID), albo
   - wariant B: Firebase Cloud Messaging dla Web (zalecane, skoro i tak używasz Firebase).
5. Dla Android-first priorytetem jest stabilny SW + poprawne permission flow + testy na docelowym tablecie.

---

## 5) Plan wdrożenia (praktyczny)

1. Zamknąć konfigurację push produkcyjnie (klucze VAPID/FCM, endpointy, backend wysyłki).
2. Zablokować wejścia adminowe w wersji instalowalnej PWA (dystrybucja user-only).
3. Doprecyzować politykę online-only w SW (bez „quasi-offline” dla dynamicznych treści).
4. Wdrożyć test scenariusza 2-urządzeniowego:
   - PC: GM wysyła,
   - Android tablet: odbiera notification w A/B/C.
5. Ustawić monitoring błędów push (token refresh, wygasłe subskrypcje, delivery fail).

---

## 6) Podsumowanie

Założenia projektu PWA, które podałeś, są spójne i możliwe do wdrożenia na Androidzie. Aktualny kod ma już większość fundamentów (manifest, SW, lock pionu Infoczytnika, treść/ikona notyfikacji, trigger z GM). Kluczowa luka to pełna konfiguracja środowiska push (produkcyjny backend lub FCM Web end-to-end) oraz docięcie polityki online-only do finalnej, jednoznacznej wersji.

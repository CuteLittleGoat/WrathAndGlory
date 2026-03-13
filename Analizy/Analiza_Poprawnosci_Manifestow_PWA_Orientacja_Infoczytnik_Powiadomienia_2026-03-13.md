# Analiza poprawności manifestów PWA, orientacji ekranów i powiadomień (Main + Infoczytnik)

## Prompt użytkownika (kontekst)
> Przeprowadź analizę poprawności manifestów PWA.  
> Następnie przeczytaj analizę: Analizy/Analiza_Wdrozenia_PWA_Main_User_Infoczytnik.md  
> Działaniem oczekiwanym jest, żeby układ pion/poziom był zależny od ustawień i orientacji urządzenia z wyjątkiem modułu "Infoczytnik", który zawsze ma się wyświetlać w poziomie. Wymusza to obrót urządzenia przez użytkownika żeby poprawnie odczytać tekst. Pozostałe moduły mają układ tabel.  
> Dodatkowo chciałbym, żeby aplikacja mobilna wyświetlałą powiadomienia o nadejściu nowej wiadomości, czyli jak na innym urządzeniu wpiszę coś w panel GM w module Infoczytnik.  
> Sprawdź czy jest możliwe rozróżnienie czy aplikacja jest uruchamiana na telefonie czy tablecie.  
> Będzie to miało wpływ na blokowanie orientacji ekranu na niektórych modułach w przyszłości.

---

## 1. Zakres i sposób weryfikacji

Sprawdzono aktualną konfigurację PWA i mechanizmy powiadomień w plikach:
- `manifest.webmanifest`
- `service-worker.js`
- `Main/index.html`
- `Infoczytnik/Infoczytnik.html`
- `Infoczytnik/GM.html`
- `Infoczytnik/config/web-push-config.js`

Dodatkowo przeczytano wcześniejszą analizę:
- `Analizy/Analiza_Wdrozenia_PWA_Main_User_Infoczytnik.md`

---

## 2. Poprawność manifestu PWA — wynik

## 2.1 Co jest poprawne

Manifest jest technicznie poprawny i zawiera wymagane klucze dla instalowalnej PWA:
- `name`, `short_name`, `description`
- `start_url`, `scope`
- `display: "standalone"`
- `background_color`, `theme_color`
- `icons` (w tym wariant 512 i `maskable`)

To oznacza, że baza pod instalację i uruchamianie jako aplikacja mobilna jest przygotowana.

## 2.2 Co jest niezgodne z nowym oczekiwaniem

W manifeście ustawiono globalnie:
- `"orientation": "portrait"`

To wymusza orientację pionową dla całej aplikacji PWA (globalnie), a nie tylko dla wybranego modułu. To stoi w sprzeczności z nowym celem:
- wszystkie moduły: orientacja zależna od urządzenia/użytkownika,
- **wyjątek tylko dla Infoczytnika**: zawsze poziomo.

### Wniosek
Aby spełnić nowe wymaganie, globalna orientacja w manifeście nie powinna być ustawiona na stałe `portrait` (docelowo: usunięcie pola `orientation` lub inna architektura wielo-manifestowa).

---

## 3. Stan orientacji w Infoczytniku

W `Infoczytnik/Infoczytnik.html` działa obecnie:
- cicha próba `screen.orientation.lock("portrait")`.

Czyli aktualny kod blokuje **pion**, a nie **poziom**. To jest odwrotnie niż obecne oczekiwanie użytkownika („Infoczytnik zawsze w poziomie”).

### Wniosek
Na teraz implementacja orientacji Infoczytnika jest funkcjonalnie niezgodna z nowym celem i wymaga zmiany na `landscape` (z zachowaniem cichego fallbacku).

---

## 4. Powiadomienia o nowej wiadomości z GM — stan i ocena

## 4.1 Co już działa

W projekcie są gotowe elementy architektury Web Push:
1. Service Worker nasłuchuje zdarzenia `push` i wyświetla notyfikację systemową.
2. Treść domyślna notyfikacji to `+++ INCOMING DATA-TRANSMISSION +++`.
3. Wykorzystywana jest ikona `IkonaPowiadomien.png`.
4. Po kliknięciu notyfikacji jest obsługa przejścia/focus do Infoczytnika.
5. W `Infoczytnik/Infoczytnik.html` jest przycisk aktywacji subskrypcji push (`Notification.requestPermission`, `pushManager.subscribe`, wysłanie subskrypcji na backend).
6. W `Infoczytnik/GM.html` po wysłaniu wiadomości jest opcjonalny trigger backendowy push (`triggerEndpoint`).

## 4.2 Ograniczenie, które trzeba uwzględnić

Sama obecność mechanizmu po stronie frontu nie wystarczy. Potrzebny jest aktywny backend:
- zapis subskrypcji (`subscribeEndpoint`),
- realna wysyłka Web Push (`triggerEndpoint` lub inna logika serwerowa).

W pliku konfiguracyjnym endpointy i klucz VAPID są puste (`""`), więc bez uzupełnienia konfiguracji i backendu powiadomienia nie będą działać produkcyjnie.

### Wniosek
Funkcjonalnie rozwiązanie jest możliwe i architektura jest już przygotowana, ale do pełnego działania „na innym urządzeniu” wymagane jest spięcie z backendem Web Push.

---

## 5. Czy da się odróżnić telefon od tabletu?

## 5.1 Krótka odpowiedź

**Tak, częściowo — ale nie w 100% niezawodnie na webie.**

## 5.2 Co można wykorzystać praktycznie

- `navigator.userAgent` / `navigator.userAgentData.mobile` (heurystyki, różna jakość wsparcia),
- `screen.width/height`, `devicePixelRatio`, `matchMedia("(pointer: coarse)")`,
- szerokości CSS (`@media`),
- wykrywanie „touch + duży ekran”.

## 5.3 Ograniczenia

- Brak jednolitej, oficjalnej flagi „to jest tablet”.
- Część urządzeń raportuje się nietypowo (zwłaszcza duże telefony, foldy, desktop mode).
- Wynik zawsze powinien być traktowany jako prawdopodobieństwo (heurystyka), nie twardy warunek bezpieczeństwa.

### Rekomendacja
Dla przyszłego blokowania orientacji lepiej opierać logikę głównie o:
- aktualną orientację,
- rozmiar viewportu,
- tryb uruchomienia (`display-mode: standalone`),

...a detekcję telefon/tablet trzymać jako pomocniczą warstwę heurystyczną.

---

## 6. Ocena zgodności z oczekiwanym zachowaniem (stan obecny)

1. **Układ zależny od orientacji urządzenia dla większości modułów** — obecnie częściowo zablokowany przez globalne `orientation: portrait` w manifeście.
2. **Infoczytnik zawsze poziomo** — obecnie niespełnione, bo kod blokuje `portrait`.
3. **Powiadomienia o nowej wiadomości na innym urządzeniu** — możliwe i częściowo zaimplementowane; do uruchomienia produkcyjnego brakuje skonfigurowanego backendu Web Push i kluczy/endpointów.
4. **Rozróżnienie telefon/tablet** — możliwe tylko heurystycznie, nie absolutnie.

---

## 7. Proponowany kierunek wdrożenia (bez implementacji kodu w tej analizie)

1. Zmienić strategię manifestu z globalnego locka `portrait` na orientację adaptacyjną (dla całej aplikacji).
2. W Infoczytniku zmienić lock na `landscape` (cichy fallback, bez ekranu informacyjnego).
3. Domknąć backend Web Push:
   - VAPID,
   - endpoint zapisu subskrypcji,
   - endpoint/funkcja wysyłki po akcji GM.
4. Dodać heurystykę phone/tablet jako funkcję pomocniczą i testować na docelowych urządzeniach Android.


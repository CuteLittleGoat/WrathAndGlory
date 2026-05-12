# [ARCHIWALNE] Analiza: czy potrzebny Infoczytnik web-push-config (2026-05-12)

> Status: **Archiwalne**.
>
> Plik przeniesiony z folderu `Analizy` do `WebView_FCM_Cloudflare_Worker/Archiwalne` dnia 2026-05-12, zgodnie z poleceniem użytkownika.


## Prompt użytkownika
> Przeprowadź analizę czy plik Infoczytnik/config/web-push-config.js jest do czegokolwiek potrzebny?

## Zakres i metoda
Sprawdziłem odwołania do pliku i do kluczy konfiguracyjnych Web Push (`vapidPublicKey`, `subscribeEndpoint`, `triggerEndpoint`) w całym repozytorium, ze szczególnym uwzględnieniem aktywnych modułów (`Main`, `Infoczytnik`) oraz backendu.

Użyte komendy:
- `rg -n "web-push-config|push config|VAPID|webPush|push" Infoczytnik -g '!**/node_modules/**'`
- `rg -n "config/web-push-config\.js|WEB_PUSH_CONFIG|webPushConfig|subscribeEndpoint|triggerEndpoint" Infoczytnik`
- `rg -n "web-push-config|vapidPublicKey|subscribeEndpoint|triggerEndpoint|PUSH_CONFIG" /workspace/WrathAndGlory`

## Wyniki

1. **Plik istnieje i zawiera poprawny obiekt konfiguracyjny** (`window.infWebPushConfig`) z trzema polami:
   - `vapidPublicKey`
   - `subscribeEndpoint`
   - `triggerEndpoint`

2. **W aktywnym kodzie modułu `Infoczytnik` brak użycia tego pliku i tych pól.**
   - W folderze `Infoczytnik` nie ma odwołań do `window.infWebPushConfig`, `subscribeEndpoint`, `triggerEndpoint` poza samymi plikami konfiguracyjnymi.
   - Brak referencji oznacza, że aktualnie ładowanie i zawartość `Infoczytnik/config/web-push-config.js` nie wpływają na działanie widocznych funkcji modułu.

3. **Backend `Infoczytnik/backend` ma zależność `web-push`, ale to nie potwierdza aktywnego użycia pliku frontendowego `config/web-push-config.js`.**
   - Sam fakt obecności biblioteki backendowej nie oznacza, że ten konkretny plik konfiguracyjny jest dziś konsumowany przez frontend.

4. **Ślady użycia występują głównie w materiałach archiwalnych i wcześniejszych analizach**, np. `WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html` i stare pliki w `Analizy/`.
   - To potwierdza, że plik był elementem wcześniejszej architektury Web Push, ale nie stanowi dowodu bieżącego wykorzystania w aktywnych modułach.

## Wniosek
Na podstawie bieżącego stanu repozytorium: **plik `Infoczytnik/config/web-push-config.js` nie jest obecnie potrzebny do działania aktywnego kodu modułu `Infoczytnik` ani `Main`** (brak referencji w aktualnym kodzie runtime).

## Rekomendacja
- Jeśli celem jest porządkowanie repo: plik można oznaczyć jako „legacy” albo usunąć **po dodatkowym szybkim teście manualnym UI**, żeby wykluczyć ukryte dynamiczne ładowanie poza repo.
- Jeśli planowany jest powrót Web Push: warto zostawić plik, ale dopisać jasny komentarz, że to konfiguracja rezerwowa/archiwalna.

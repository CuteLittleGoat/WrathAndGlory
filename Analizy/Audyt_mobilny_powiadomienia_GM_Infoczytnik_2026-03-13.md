# Audyt mobilny + powiadomienia (GM.html / Infoczytnik.html)

## Prompt użytkownika
"Przeprowadź pełen audyt kodu aplikacji. Sprawdź czy wszystko jest gotowe do działania aplikacji mobilnej obsługującej powiadomienia. Sprawdź kod plików produkcyjnych GM.html i Infoczytnik.html
Sprawdź czy pliki odnośnie powiadomień odnoszą się do tych plików a nie testowych."

## Zakres audytu
- Produkcyjne pliki:
  - `Infoczytnik/GM.html`
  - `Infoczytnik/Infoczytnik.html`
- Pliki powiązane z mobilnością/PWA/powiadomieniami:
  - `Main/index.html`
  - `service-worker.js`
  - `manifest.webmanifest`
  - `Infoczytnik/config/web-push-config.js`

## Wynik ogólny (TL;DR)
- **Aplikacja jest w dużej mierze gotowa technicznie do działania mobilnego + Web Push** (manifest, Service Worker, flow subskrypcji i trigger są obecne).
- **Pliki push dla produkcji wskazują na produkcyjne widoki (`Infoczytnik.html`) a nie testowe**.
- Wykryto jednak **istotne ryzyka produkcyjne**:
  1. **Sekret `Authorization Bearer` jest na sztywno w frontendzie (`GM.html`)**.
  2. **Brak `maskable` ikony notyfikacyjnej dedykowanej dla Android badge (nie krytyczne, ale zalecane).**
  3. **`Infoczytnik.html` rejestruje SW, ale nie ma własnego UI subskrypcji push** (subskrypcja odbywa się z `Main/index.html`; to architektonicznie OK, ale UX-owo ogranicza).

---

## 1) Czy produkcyjne GM/Infoczytnik są podłączone pod push?

### `Infoczytnik/GM.html`
- Ładuje konfigurację Web Push przez `config/web-push-config.js`.
- Ma funkcję `triggerPushNotification()` wysyłającą `POST` na `triggerEndpoint`.
- Payload push zawiera URL: `"/Infoczytnik/Infoczytnik.html"` (produkcyjny ekran gracza).

Wniosek: **TAK — produkcyjny panel GM uruchamia push kierujący na produkcyjny Infoczytnik.**

### `Infoczytnik/Infoczytnik.html`
- Rejestruje globalny SW: `navigator.serviceWorker.register("../service-worker.js")`.
- Odbiera dane wiadomości z Firestore i renderuje ekran gracza.

Wniosek: **TAK — produkcyjny ekran gracza jest przygotowany do odbioru flow push przez SW i otwieranie URL z notyfikacji.**

---

## 2) Czy pliki push wskazują na produkcję, a nie test?

### `service-worker.js`
- Domyślny URL w `push` i `notificationclick` to: `"/Infoczytnik/Infoczytnik.html"`.
- Nie ma domyślnego odwołania do `Infoczytnik_test.html`.

### `Infoczytnik/GM.html`
- W payloadzie triggera push ustawione jest `url: "/Infoczytnik/Infoczytnik.html"`.
- Nie ma odwołania do `Infoczytnik_test.html`.

### `Infoczytnik/config/web-push-config.js`
- Definiuje endpointy produkcyjnego backendu push (Cloudflare Worker).
- Bez odwołań do plików testowych.

Wniosek: **TAK — aktualne pliki dot. push są ustawione na produkcję, nie testy.**

---

## 3) Gotowość mobilna/PWA — checklist

### ✅ Spełnione
1. **Manifest PWA istnieje** i zawiera `display: "standalone"`, `start_url`, `scope`, `theme_color`, `icons`.
2. **Service Worker istnieje** i:
   - cache’uje shell aplikacji,
   - obsługuje `fetch` fallback offline,
   - obsługuje `push` (showNotification),
   - obsługuje `notificationclick` (focus/openWindow).
3. **Flow subskrypcji push istnieje w `Main/index.html`**:
   - sprawdza konfigurację,
   - pyta o zgodę Notification,
   - zakłada subskrypcję `pushManager.subscribe`,
   - zapisuje subskrypcję na `subscribeEndpoint`.
4. **Flow triggera push istnieje w `GM.html`** po wysyłce wiadomości.
5. **`Infoczytnik.html` rejestruje SW**, co jest kluczowe na urządzeniach mobilnych.

### ⚠️ Ryzyka / uwagi
1. **Hardcoded Bearer token w frontendzie (`GM.html`)**
   - Każdy użytkownik mający dostęp do kodu strony może go odczytać i potencjalnie uruchamiać trigger push.
   - Zalecenie: przenieść autoryzację triggera po stronie backendu (np. sesja serwerowa/JWT o krótkim TTL/proxy), a nie w jawny JS.

2. **Brak dedykowanego UX subskrypcji w `Infoczytnik.html`**
   - Subskrypcja jest realizowana w launcherze (`Main/index.html`), nie na ekranie odbiorcy.
   - Jeśli użytkownik trafia bezpośrednio do `Infoczytnik.html`, może nie aktywować push.
   - Zalecenie: dodać fallback „Aktywuj powiadomienia” także w `Infoczytnik.html`.

3. **Cache strategia SW jest minimalna**
   - Obecnie pre-cache obejmuje głównie shell główny i ikony.
   - Przy słabej sieci część modułów może nie być stabilnie dostępna offline.
   - Zalecenie: rozszerzyć pre-cache o krytyczne zasoby modułu Infoczytnik (o ile wymagane).

---

## 4) Odpowiedź na pytania użytkownika

1. **Czy wszystko jest gotowe do działania aplikacji mobilnej obsługującej powiadomienia?**
   - **W większości tak**: architektura PWA + push działa i jest spięta.
   - **Nie w 100% produkcyjnie-bezpiecznie** ze względu na jawny token triggera w frontendzie.

2. **Czy sprawdzone zostały produkcyjne `GM.html` i `Infoczytnik.html`?**
   - **Tak.**

3. **Czy pliki od powiadomień odnoszą się do produkcyjnych plików, a nie testowych?**
   - **Tak.** Domyślne i aktywne odwołania wskazują na `Infoczytnik.html`.

---

## 5) Priorytetowe rekomendacje (kolejność wdrożenia)
1. **P0 (bezpieczeństwo):** usunąć jawny bearer z `GM.html`, wdrożyć bezpieczny mechanizm backendowy triggera.
2. **P1 (UX):** dodać opcję subskrypcji push bezpośrednio w `Infoczytnik.html`.
3. **P2 (stabilność offline):** ewentualnie rozszerzyć cache SW o krytyczne pliki Infoczytnik.

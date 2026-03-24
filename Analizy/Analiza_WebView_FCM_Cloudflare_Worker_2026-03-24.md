# Pełna analiza: WebView_FCM_Cloudflare_Worker

## Prompt użytkownika (zachowanie kontekstu)
> „Przygotuj mi nowy plik z analizą. Przeprowadź pełną analizę WebView_FCM_Cloudflare_Worker
> Ma to być jeden plik zawierający pełne informacje o aplikacji i jej konfiguracji. Ma zawierać informacje co istnieje w Firebase, co istnieje w Cloudflare, jak działają powiadomienia, jakie są ustawione blokady na pozycję (niektóre ekrany miały być zablokowane pionowo a inne poziomo). Ma to być ultra dokładna instrukcja. W WebView_FCM_Cloudflare_Worker/Archiwalne i WebView_FCM_Cloudflare_Worker/docs masz więcej informacji.”

---

## 1) Cel i zakres tej analizy

Ten dokument jest **jednym, kompletnym źródłem wiedzy** o module `WebView_FCM_Cloudflare_Worker` oraz o jego integracjach chmurowych.

Zakres obejmuje:
1. faktyczny stan aplikacji Android (WebView + FCM),
2. stan konfiguracji Firebase,
3. stan konfiguracji Cloudflare Workera,
4. pełny przepływ powiadomień (od GM do telefonu),
5. aktualne blokady orientacji (pion/poziom),
6. checklistę operacyjną: co już jest gotowe i co trzeba jeszcze domknąć.

Źródła w module:
- `WebView_FCM_Cloudflare_Worker/docs/Documentation.md`
- `WebView_FCM_Cloudflare_Worker/docs/README.md`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Analiza_10_3_Gotowosc_Android_Studio_2026-03-15.md`
- bieżące pliki aplikacji Android (`MainActivity.kt`, `WrathFirebaseMessagingService.kt`, `NotificationHelper.kt`, `AndroidManifest.xml`, `app/build.gradle.kts`, `strings.xml`).

---

## 2) Architektura całości (skrót)

## 2.1 Warstwy systemu
1. **Frontend Web (GitHub Pages / moduły WrathAndGlory)**
   - UI użytkownika i GM (w tym Infoczytnik).
2. **Aplikacja Android (WebView)**
   - ładuje stronę user-only,
   - kontroluje orientację,
   - integruje natywne FCM.
3. **Cloudflare Worker (`wrathandglory-push-api`)**
   - punkt centralny dla push,
   - przechowuje web subskrypcje i tokeny FCM,
   - wysyła web push + FCM HTTP v1.
4. **Firebase (projekt + FCM + service account)**
   - autoryzacja do FCM HTTP v1,
   - rejestracja aplikacji Android.

## 2.2 Najważniejsze endpointy po stronie Workera
- `GET /api/push/health`
- `POST /api/push/subscribe`
- `POST /api/fcm/register`
- `POST /api/fcm/unregister`
- `POST /api/push/trigger`

---

## 3) Dokładny stan aplikacji Android (WebView_FCM_Cloudflare_Worker)

## 3.1 Parametry builda (app/build.gradle.kts)
- `applicationId`: `com.cutelittlegoat.wrathandglory`
- `compileSdk`: `35`
- `targetSdk`: `35`
- `minSdk`: `26`
- Java/Kotlin target: `17`
- Firebase Messaging przez BOM (`firebase-messaging-ktx`).

`BuildConfig`:
- `APP_DISPLAY_NAME = "Wrath&Glory"`
- `BASE_URL = "https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?pwa=1"`
- `INFOCZYTNIK_URL = "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik.html"`
- `FCM_REGISTER_URL = "https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/fcm/register"`

Dodatkowo zastosowano obejście dla `*ClasspathCopy` (zgodność sync z nowszym Gradle/AS).

## 3.2 Manifest i uprawnienia
W `AndroidManifest.xml`:
- `INTERNET`
- `POST_NOTIFICATIONS` (Android 13+)

Komponenty:
- `MainActivity` (`launchMode=singleTop`, domyślnie `screenOrientation=fullUser`),
- `WrathFirebaseMessagingService` z akcją `com.google.firebase.MESSAGING_EVENT`.

## 3.3 Tryb pracy WebView
W `MainActivity.kt`:
- JS: włączony,
- DOM storage: włączony,
- zoom: wyłączony,
- cache: `LOAD_NO_CACHE` + `clearCache(true)` przy starcie,
- dodatkowy suffix User-Agent: `WrathAndGloryAndroidApp/1.0`.

Wymuszenie bezpieczeństwa sieci:
- `network_security_config.xml` ma `cleartextTrafficPermitted="false"` (tylko HTTPS).

## 3.4 Logika user-only (blokada admin)
Metoda `sanitizeUrl(rawUrl)`:
1. dopuszcza wyłącznie host zgodny z hostem `BASE_URL`,
2. usuwa parametr query `admin`,
3. gdy URL jest błędny/obcy — robi fallback do `BASE_URL`.

To realizuje wymaganie „bez `?admin=1`”.

## 3.5 Blokady orientacji (pion/poziom)
Reguła w `applyOrientationRule(url)`:
- jeśli ścieżka URL zawiera `/Infoczytnik/` → `SCREEN_ORIENTATION_PORTRAIT` (**blokada pionowa**),
- w przeciwnym razie → `SCREEN_ORIENTATION_FULL_USER` (**zgodnie z ustawieniami urządzenia, pion lub poziom**).

To dokładnie implementuje założenie:
- Infoczytnik: na sztywno pion,
- pozostałe moduły: elastycznie (pion/poziom).

## 3.6 Zachowanie online-only
- aplikacja nie używa cache offline,
- przy braku internetu pokazuje snackbar: „Brak połączenia z internetem. Aplikacja działa tylko online.”
- HTTP cleartext jest zablokowany.

---

## 4) Jak działają powiadomienia (pełny przepływ)

## 4.1 Rejestracja tokenu urządzenia
Token FCM jest pobierany w 2 miejscach:
1. `MainActivity.registerFcmToken()` podczas startu aplikacji,
2. `WrathFirebaseMessagingService.onNewToken()` przy odświeżeniu tokenu.

W obu przypadkach wysyłany jest POST JSON do:
`/api/fcm/register`

Payload zawiera:
- `token`
- `platform: "android"`
- `source: "android-webview"`
- `deviceId` (UUID)

## 4.2 Odbiór wiadomości w Android
`WrathFirebaseMessagingService.onMessageReceived()`:
- pobiera `title/body` z payloadu lub używa fallbacków:
  - title: `Infoczytnik`
  - body: `+++ INCOMING DATA-TRANSMISSION +++`
- target URL:
  - `message.data["url"]` albo fallback `INFOCZYTNIK_URL`.
- deleguje prezentację do `NotificationHelper.showIncomingNotification()`.

## 4.3 Budowanie lokalnej notyfikacji
`NotificationHelper`:
- tworzy kanał `infoczytnik_messages` (importance HIGH),
- sprawdza runtime permission `POST_NOTIFICATIONS` na Android 13+,
- tworzy `PendingIntent` otwierający `MainActivity` z `EXTRA_TARGET_URL`,
- wystawia notyfikację przez `NotificationManagerCompat`.

Uwaga implementacyjna:
- aktualnie small icon to tymczasowo `android.R.drawable.stat_notify_chat`.
- w archiwalnym kodzie Workera jest ustawienie `icon: "ic_notification"` dla Android payloadu — docelowo warto to zunifikować po stronie appki.

## 4.4 Co dzieje się po kliknięciu notyfikacji
1. notyfikacja uruchamia `MainActivity` (singleTop),
2. URL z notyfikacji trafia jako `EXTRA_TARGET_URL`,
3. `sanitizeUrl()` oczyszcza/adres filtruje,
4. WebView ładuje bezpieczny URL,
5. po załadowaniu strony stosowana jest reguła orientacji.

---

## 5) Co istnieje w Firebase (stan na podstawie dokumentów/archiwum)

Z dokumentacji i notatek wynika, że istnieje:
1. projekt Firebase: **WH40k-Data-Slate**,
2. dodana aplikacja Android: `com.cutelittlegoat.wrathandglory`,
3. pobrany `google-services.json` (dla Android app),
4. wygenerowany klucz konta serwisowego (service account JSON),
5. aktywne użycie FCM HTTP v1 (po stronie Workera),
6. parametry z service account przekazane do sekretów Workera:
   - `project_id`,
   - `client_email`,
   - `private_key`.

Znaczenie:
- Firebase jest skonfigurowane na poziomie wymaganym do wysyłki FCM v1 przez Cloudflare Worker.

---

## 6) Co istnieje w Cloudflare (stan na podstawie dokumentów/archiwum)

Istniejący Worker:
- `wrathandglory-push-api`

KV bindings:
- `SUBSCRIPTIONS_KV -> PUSH_SUBSCRIPTIONS` (web push)
- `FCM_TOKENS -> FCM_TOKENS` (tokeny Android FCM)

Zmienne/sekrety (wg notatek):
- plaintext: `ALLOWED_ORIGIN`
- sekrety web push:
  - `TRIGGER_TOKEN`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_PUBLIC_KEY`
  - `VAPID_SUBJECT`
- sekrety Firebase/FCM:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

Endpoint health (`/api/push/health`) raportuje m.in.:
- `hasVapid`
- `hasFirebase`
- `webSubscriptions`
- `fcmTokens`

W archiwalnym teście widoczny był stan:
- `ok: true`
- `hasVapid: true`
- `hasFirebase: true`
- `webSubscriptions: 2`
- `fcmTokens: 0`

Interpretacja:
- infrastruktura gotowa,
- brakowało jeszcze zarejestrowanych tokenów Android w chwili wykonywania tamtego testu.

---

## 7) Worker — dokładna logika wysyłki

## 7.1 Tryby wysyłki
`/api/push/trigger` wysyła równolegle:
1. web push do subskrypcji z `SUBSCRIPTIONS_KV`,
2. FCM do tokenów z `FCM_TOKENS`.

## 7.2 Obsługa payloadu
Worker normalizuje pola:
- `title`
- `body`
- `icon`
- `badge`
- `tag`
- `url`
- `silent`

Fallback body jest zgodny z wymaganiem:
- `+++ INCOMING DATA-TRANSMISSION +++`

## 7.3 FCM HTTP v1
Worker:
1. generuje JWT OAuth z service account,
2. pobiera access token z `https://oauth2.googleapis.com/token`,
3. wysyła do `https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send`.

Wysyłana wiadomość zawiera:
- sekcję `notification` (gdy `silent=false`),
- sekcję `data` (zawsze, m.in. `url` i `silent`),
- sekcję `android.notification` (m.in. `channel_id`, `icon`, `click_action`).

## 7.4 Czyszczenie nieważnych rekordów
Worker usuwa z KV:
- wygasłe web subskrypcje,
- nieaktualne/wyrejestrowane tokeny FCM.

---

## 8) Ultra-dokładna instrukcja operacyjna (co sprawdzić i jak utrzymywać)

## 8.1 Checklista „stan gotowości”

### A) Firebase
- [ ] Projekt `WH40k-Data-Slate` nadal aktywny.
- [ ] App Android `com.cutelittlegoat.wrathandglory` nadal widoczna.
- [ ] `google-services.json` zgodny z tym package name.
- [ ] Service account nie został unieważniony.

### B) Cloudflare
- [ ] Worker `wrathandglory-push-api` działa.
- [ ] KV `SUBSCRIPTIONS_KV` i `FCM_TOKENS` podpięte.
- [ ] Sekrety VAPID obecne.
- [ ] Sekrety Firebase obecne i poprawne.
- [ ] `GET /api/push/health` zwraca `ok: true` i `hasFirebase: true`.

### C) Android app
- [ ] `MainActivity` ładuje `BASE_URL`.
- [ ] `sanitizeUrl()` blokuje admin i obce hosty.
- [ ] reguła orientacji dla `/Infoczytnik/` działa.
- [ ] kanał notyfikacji istnieje (`infoczytnik_messages`).
- [ ] token FCM jest wysyłany do `/api/fcm/register`.

## 8.2 Testy przepływu powiadomień (A/B/C)

1. **A — aplikacja uruchomiona (foreground)**
   - z GM wyślij wiadomość,
   - sprawdź lokalną notyfikację i poprawny tekst body.

2. **B — aplikacja zminimalizowana (background)**
   - wyślij wiadomość,
   - sprawdź, czy system pokazał notyfikację,
   - tapnięcie ma otworzyć właściwy URL.

3. **C — aplikacja ubita (killed)**
   - zamknij proces,
   - wyślij trigger,
   - sprawdź otrzymanie notyfikacji i poprawne uruchomienie po kliknięciu.

## 8.3 Walidacja orientacji
- Otwórz URL z `/Infoczytnik/` → ekran musi pozostać pionowy nawet po obróceniu urządzenia.
- Otwórz inny moduł → ekran może rotować (pion/poziom).

## 8.4 Zalecenie techniczne (najbliższy krok)
Ujednolicić ikonę notyfikacji:
1. dodać docelowy zasób `ic_notification` w Android app,
2. użyć go w `NotificationHelper` (zamiast systemowej tymczasowej ikony),
3. zachować spójność z payloadem Workera.

---

## 9) Status końcowy

### Co jest już gotowe
- Android WebView + logika user-only + orientacja per moduł,
- integracja Firebase Messaging w aplikacji,
- endpoint rejestracji FCM tokenu,
- Cloudflare Worker obsługujący web push i FCM,
- komplet głównych sekretów i bindings opisanych w notatkach,
- fallback tekstu powiadomienia zgodny z wymaganiem.

### Co wymaga cyklicznej kontroli
- realna liczba `fcmTokens` w health-check,
- aktualność sekretów service account,
- spójność kanału/ikony Android między Workerem i aplikacją,
- testy A/B/C po każdej większej zmianie.

### Jednozdaniowy wniosek
Konfiguracja `WebView_FCM_Cloudflare_Worker` jest kompletna koncepcyjnie i wdrożeniowo dla modelu **WebView + natywne FCM + Cloudflare Worker**, a krytyczne mechanizmy (powiadomienia, blokada admin, orientacja pion/poziom) są już zaimplementowane — wymagają jedynie utrzymania i regularnych testów end-to-end.

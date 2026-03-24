# WebView_FCM_Cloudflare_Worker — Documentation

## 1. Cel modułu
Moduł zawiera kompletny szkielet aplikacji Android (WebView + FCM) dla nazwy aplikacji **Wrath&Glory**. Implementacja wykorzystuje już istniejący backend Cloudflare Worker i plik `google-services.json`.

## 2. Struktura plików
- `settings.gradle.kts` — konfiguracja repozytoriów i modułu `:app`.
- `build.gradle.kts` — wersje pluginów Android/Kotlin/Google Services (AGP ustawiony na `8.7.2`).
- `gradle.properties` — podstawowe ustawienia Gradle.
- `app/build.gradle.kts` — konfiguracja aplikacji, SDK, zależności, `BuildConfig` oraz poprawka konfiguracji `*ClasspathCopy`.
- `app/google-services.json` — konfiguracja Firebase dla pakietu `com.cutelittlegoat.wrathandglory`.
- `app/src/main/AndroidManifest.xml` — uprawnienia i deklaracje Activity/Service.
- `app/src/main/java/com/cutelittlegoat/wrathandglory/MainActivity.kt` — WebView host + reguły URL/orientacji + inicjalna rejestracja FCM.
- `app/src/main/java/com/cutelittlegoat/wrathandglory/WrathFirebaseMessagingService.kt` — obsługa `onNewToken` i `onMessageReceived`.
- `app/src/main/java/com/cutelittlegoat/wrathandglory/NotificationHelper.kt` — kanał notyfikacji, budowanie notyfikacji, helper do rejestracji tokenu.
- `app/src/main/res/layout/activity_main.xml` — pełnoekranowy `WebView`.
- `app/src/main/res/values/strings.xml` — nazwa appki i teksty stałe, w tym `+++ INCOMING DATA-TRANSMISSION +++`.
- `app/src/main/res/xml/network_security_config.xml` — wymuszenie HTTPS (`cleartextTrafficPermitted=false`).
- `app/src/main/res/drawable/ic_app_icon.xml` — tymczasowa ikona wektorowa.

## 3. Konfiguracja aplikacji (`app/build.gradle.kts`)
### 3.0 Zgodność Gradle/AGP
- Plugin Android pozostaje na **8.7.2**.
- Wymagany JDK projektu: **17**.
- Dodano blok `configurations.matching { ... }.configureEach { ... }`, który ustawia konfiguracje `*RuntimeClasspathCopy` i `*CompileClasspathCopy` jako **resolvable-only** (`canBeResolved=true`, `canBeConsumed=false`).
- Celem poprawki jest usunięcie błędu Android Studio/Gradle: `Cannot select root node 'debugRuntimeClasspathCopy' as a variant`.

### 3.1 Parametry Android
- `compileSdk=35`, `targetSdk=35`, `minSdk=26`.
- `applicationId=namespace=com.cutelittlegoat.wrathandglory`.
- Java/Kotlin target: 17.

### 3.2 BuildConfig fields
- `APP_DISPLAY_NAME="Wrath&Glory"`
- `BASE_URL="https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?pwa=1"`
- `INFOCZYTNIK_URL="https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/Infoczytnik.html"`
- `FCM_REGISTER_URL="https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/fcm/register"`

### 3.3 Zależności
- AndroidX: `core-ktx`, `appcompat`, `activity-ktx`, `webkit`, Material.
- Firebase: BOM + `firebase-messaging-ktx`.

## 4. Manifest i komponenty
### 4.1 Uprawnienia
- `INTERNET` — wymagane dla WebView i rejestracji tokenu.
- `POST_NOTIFICATIONS` — Android 13+.

### 4.2 MainActivity
- `launchMode=singleTop` (obsługa kliknięć notyfikacji przez `onNewIntent`).
- `screenOrientation=fullUser` jako default, nadpisywane dynamicznie dla Infoczytnika.

### 4.3 FirebaseMessagingService
- `WrathFirebaseMessagingService` z akcją `com.google.firebase.MESSAGING_EVENT`.

## 5. Logika `MainActivity.kt`
### 5.1 `onCreate`
1. Inicjalizacja widoku (`activity_main`).
2. Konfiguracja WebView.
3. Załadowanie URL startowego (`BASE_URL` lub URL z notyfikacji).
4. Ostrzeżenie przy braku internetu.
5. Utworzenie kanału notyfikacji.
6. Żądanie runtime permission dla notyfikacji.
7. Pobranie i wysyłka tokenu FCM do Workera.

### 5.2 `sanitizeUrl(rawUrl)`
- Dopuszcza tylko host zgodny z `BASE_URL`.
- Usuwa parametr query `admin`.
- W razie błędu zwraca `BASE_URL`.

### 5.3 `applyOrientationRule(url)`
- Jeśli ścieżka URL zawiera `/Infoczytnik/` -> `SCREEN_ORIENTATION_PORTRAIT`.
- W przeciwnym wypadku -> `SCREEN_ORIENTATION_FULL_USER`.

### 5.4 `registerFcmToken` / `sendTokenToWorker`
- Token z `FirebaseMessaging.getInstance().token`.
- POST JSON do endpointu `/api/fcm/register`.
- Payload: `token`, `platform=android`, `source=android-webview`, `deviceId`.

## 6. Logika `WrathFirebaseMessagingService.kt`
### 6.1 `onNewToken`
- Przy odświeżeniu tokenu wykonywana ponowna rejestracja do Workera przez `NotificationHelper.registerToken()`.

### 6.2 `onMessageReceived`
- Przy wiadomości foreground tworzona lokalna notyfikacja.
- Tytuł: z payloadu lub fallback `Infoczytnik`.
- Treść: z payloadu lub fallback `+++ INCOMING DATA-TRANSMISSION +++`.
- URL docelowy: `data.url` lub fallback `INFOCZYTNIK_URL`.

## 7. Logika `NotificationHelper.kt`
### 7.1 `ensureChannel`
- Tworzy kanał `infoczytnik_messages` (importance HIGH).

### 7.2 `showIncomingNotification`
- Dla Android 13+ sprawdza runtime permission.
- Tworzy `PendingIntent` otwierający `MainActivity` z `EXTRA_TARGET_URL`.
- Wystawia notyfikację przez `NotificationManagerCompat`.
- Tymczasowo używa systemowej ikony `android.R.drawable.stat_notify_chat`.

### 7.3 `registerToken`
- Dodatkowy helper rejestracji tokenu FCM (używany z serwisu messaging).

## 8. UI i style
- Layout składa się z pojedynczego `WebView` na pełny ekran.
- Brak custom fontów i brak niestandardowych stylów Material.
- Motyw: `Theme.AppCompat.DayNight.NoActionBar`.
- Teksty stałe są trzymane w `strings.xml`.

## 9. Założenia online-only
- `WebSettings.LOAD_NO_CACHE` + `webView.clearCache(true)` przy starcie.
- `network_security_config` blokuje cleartext HTTP.
- Brak mechanizmu offline fallback.

## 10. Co celowo pominięto
- Punkt 10.4 z poprzedniej analizy.
- Finalne przypięcie docelowych ikon aplikacji i notyfikacji (do wykonania później ręcznie w Android Studio).

## 11. Jak odtworzyć 1:1
1. Otwórz folder modułu w Android Studio.
2. Potwierdź, że `app/google-services.json` istnieje.
3. Ustaw Gradle JDK na 17.
4. Wykonaj Gradle Sync.
5. Uruchom na urządzeniu z Google Play Services.
6. Przyjmij permission notyfikacji.
7. Otwórz endpoint health Workera i potwierdź wzrost `fcmTokens` po uruchomieniu aplikacji.
8. Wyślij trigger z GM i sprawdź: foreground/background/killed.

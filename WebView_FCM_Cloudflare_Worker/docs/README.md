# WebView_FCM_Cloudflare_Worker — instrukcja użytkownika / user guide

## PL

### Co zostało przygotowane
W folderze `WebView_FCM_Cloudflare_Worker` znajduje się gotowy szkielet projektu Android Studio dla aplikacji **Wrath&Glory** (WebView + Firebase Cloud Messaging), zintegrowany z istniejącym Cloudflare Workerem.

### Jak uruchomić w Android Studio
1. Otwórz Android Studio.
2. Wybierz **Open** i wskaż folder `WebView_FCM_Cloudflare_Worker`.
3. Ustaw JDK projektu na **17** (Project Structure → SDK Location lub Gradle JDK).
4. Wykonaj **Sync Project with Gradle Files**.
5. Poczekaj na synchronizację Gradle.
6. Uruchom aplikację na urządzeniu/emulatorze z Google Play Services.
7. Przy pierwszym uruchomieniu zaakceptuj uprawnienie do powiadomień.

### Co robi aplikacja
- Otwiera stronę: `Main/index.html?pwa=1` (widok użytkownika).
- Usuwa parametr `admin` z URL i blokuje przejścia poza dozwolony host.
- Dla `Infoczytnik/*` wymusza orientację pionową.
- Dla innych modułów pozwala na orientację zależną od ustawień urządzenia.
- Pobiera token FCM i rejestruje go do endpointu Workera: `/api/fcm/register`.
- Pokazuje lokalne powiadomienie przy wiadomości FCM w foreground.

### Czego jeszcze nie robiono
- Punkt 10.4 został celowo pominięty.
- Finalna podmiana ikon głównej i powiadomień jest do wykonania później w Android Studio.
- W `app/build.gradle.kts` dodano poprawkę dla konfiguracji `*ClasspathCopy`, żeby uniknąć błędu `Cannot select root node ... as a variant` przy nowszym Gradle/Android Studio.

---

## EN

### What is prepared
The `WebView_FCM_Cloudflare_Worker` folder now contains a ready Android Studio project scaffold for the **Wrath&Glory** app (WebView + Firebase Cloud Messaging), integrated with the existing Cloudflare Worker backend.

### How to run in Android Studio
1. Open Android Studio.
2. Select **Open** and choose `WebView_FCM_Cloudflare_Worker`.
3. Set project JDK to **17** (Project Structure → SDK Location or Gradle JDK).
4. Run **Sync Project with Gradle Files**.
5. Wait for Gradle sync.
6. Run the app on a device/emulator with Google Play Services.
7. Grant notification permission on first launch.

### What the app does
- Loads `Main/index.html?pwa=1` (user view).
- Removes `admin` URL parameter and blocks navigation outside the allowed host.
- Forces portrait orientation for `Infoczytnik/*`.
- Allows normal device-driven orientation for other modules.
- Gets an FCM token and registers it in Worker endpoint `/api/fcm/register`.
- Shows local foreground notifications when FCM arrives.

### Not included yet
- Point 10.4 is intentionally skipped.
- Final app icon / notification icon mapping is intentionally left for later setup in Android Studio.
- `app/build.gradle.kts` now includes a `*ClasspathCopy` configuration fix to avoid `Cannot select root node ... as a variant` on newer Gradle/Android Studio combinations.

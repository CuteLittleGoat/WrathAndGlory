# Analiza: pliki nie-niezbędne do działania modułów web i PWA

## Prompt użytkownika
"Przeanalizuj pełen kod aplikacji. Zrób mi listę wszystkich plików, które nie są niezbędne do działania modułów oraz do działania PWA."

## Założenia analizy
- Zakres "niezbędne" = pliki potrzebne do uruchamiania modułów web (HTML/CSS/JS/assets/config runtime) oraz webowego PWA (`manifest.webmanifest`, `service-worker.js`, ikony root).
- Za nie-niezbędne uznałem pliki: dokumentacyjne, analityczne, archiwalne, drafty, backupy, materiały "HowTo", pliki pomocnicze do generacji danych, oraz cały projekt Android WebView (bo to osobna aplikacja natywna, nie webowe PWA).
- Lista dotyczy plików śledzonych w Git (`git ls-files`).

## Lista plików nie-niezbędnych

### 1) Dokumentacja / notatki / instrukcje (nie-runtime)
- `AGENTS.md`
- `DetaleLayout.md`
- `DoZrobienia.md`
- `Kolumny.md`
- `Audio/Disclaimer.md`
- `Audio/docs/Documentation.md`
- `Audio/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/README.md`
- `DiceRoller/doc/Documentation.md`
- `DiceRoller/doc/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `GeneratorNazw/docs/Logika.md`
- `GeneratorNazw/docs/README.md`
- `Infoczytnik/AGENTS.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/docs/Prefixy_i_Suffixy.txt`
- `Infoczytnik/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/docs/README.md`
- `Main/docs/Documentation.md`
- `Main/docs/README.md`

### 2) Pliki analiz i archiwalne materiały analityczne
- `Analizy/Analiza_10_3_Gotowosc_Android_Studio_2026-03-15.md`
- `Analizy/CloudFlare_01.JPG`
- `Analizy/CloudFlare_02.JPG`
- `Analizy/CloudFlare_03.JPG`
- `Analizy/CloudFlare_04.JPG`
- `Analizy/Firebase_01.JPG`
- `Analizy/Firebase_02.JPG`
- `Analizy/Firebase_03.JPG`
- `Analizy/Firebase_04.JPG`
- `Analizy/Notatki.txt`
- `Analizy/Projekt_Aplikacja.html`
- `Analizy/kod-wrathandglory-push-api.txt`

### 3) Pliki pomocnicze konfiguracyjne/opisowe (nie-runtime)
- `Audio/config/Firebase-config.md`
- `GeneratorNPC/config/Firebase-config.md`
- `Infoczytnik/config/Firebase-config.md`
- `Infoczytnik/config/web-push-config.production.example.js`

### 4) Materiały robocze / backup / draft / old
- `Infoczytnik/GM_backup.html`
- `Infoczytnik/Infoczytnik_backup.html`
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`
- `Infoczytnik/Draft/DataSlate_01.png`
- `Infoczytnik/Draft/DataSlate_02.png`
- `Infoczytnik/Draft/DataSlate_03.png`
- `Infoczytnik/Draft/DataSlate_04.png`
- `Infoczytnik/Draft/DataSlate_05.png`
- `Infoczytnik/Draft/DataSlate_Inq.png`
- `Infoczytnik/Draft/Litannie_Zaginionych.png`
- `Kalkulator/Old/HowToUse_Org.pdf`
- `Kalkulator/Old/Kalkulator_Org.html`

### 5) Materiały instruktażowe i źródłowe (nie-runtime)
- `Audio/AudioManifest.xlsx`
- `DataVault/Repozytorium.xlsx`
- `DataVault/build_json.py`
- `Kalkulator/HowToUse/en.pdf`
- `Kalkulator/HowToUse/pl.pdf`

### 6) Osobna aplikacja Android (poza modułami web + poza web PWA)
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Analiza_10_3_Gotowosc_Android_Studio_2026-03-15.md`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/CloudFlare_01.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/CloudFlare_02.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/CloudFlare_03.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/CloudFlare_04.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Firebase_01.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Firebase_02.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Firebase_04.JPG`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html`
- `WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt`
- `WebView_FCM_Cloudflare_Worker/IkonaGlowna.png`
- `WebView_FCM_Cloudflare_Worker/IkonaPowiadomien.png`
- `WebView_FCM_Cloudflare_Worker/app/build.gradle.kts`
- `WebView_FCM_Cloudflare_Worker/app/google-services.json`
- `WebView_FCM_Cloudflare_Worker/app/proguard-rules.pro`
- `WebView_FCM_Cloudflare_Worker/app/src/main/AndroidManifest.xml`
- `WebView_FCM_Cloudflare_Worker/app/src/main/java/com/cutelittlegoat/wrathandglory/MainActivity.kt`
- `WebView_FCM_Cloudflare_Worker/app/src/main/java/com/cutelittlegoat/wrathandglory/NotificationHelper.kt`
- `WebView_FCM_Cloudflare_Worker/app/src/main/java/com/cutelittlegoat/wrathandglory/WrathFirebaseMessagingService.kt`
- `WebView_FCM_Cloudflare_Worker/app/src/main/res/drawable/ic_app_icon.xml`
- `WebView_FCM_Cloudflare_Worker/app/src/main/res/layout/activity_main.xml`
- `WebView_FCM_Cloudflare_Worker/app/src/main/res/values/strings.xml`
- `WebView_FCM_Cloudflare_Worker/app/src/main/res/xml/network_security_config.xml`
- `WebView_FCM_Cloudflare_Worker/build.gradle.kts`
- `WebView_FCM_Cloudflare_Worker/docs/Documentation.md`
- `WebView_FCM_Cloudflare_Worker/docs/README.md`
- `WebView_FCM_Cloudflare_Worker/google-services.json`
- `WebView_FCM_Cloudflare_Worker/gradle.properties`
- `WebView_FCM_Cloudflare_Worker/settings.gradle.kts`

## Uwaga
- `Main/ZmienneHiperlacza.md` **nie** trafił na listę, bo jest wczytywany przez `Main/index.html` przez `fetch(...)` i wpływa na działanie przycisków "Mapa" i "Obrazki".
- `TRIGGER_TOKEN` może być zbędny dla samego frontendu, ale może być używany operacyjnie po stronie integracji push — dlatego nie klasyfikuję go tu jednoznacznie jako "na pewno zbędny".

# Analiza: czy po zmianie modułów trzeba od nowa budować APK?

## Data
2026-03-24

## Prompt użytkownika
"Przeprowadź analizę. Czy jak zmienię jakieś elementy w którymś z modułów, np. zmienię szerokości kolumn albo dodam nowy przycisk to czy muszę od początku przygotować plik instalacyjny apk w Android studio?"

## Wnioski (skrót)
Nie, **w większości przypadków nie musisz od początku przygotowywać nowego pliku APK** po zmianach typu szerokości kolumn, przyciski, style lub logika w modułach webowych.

## Dlaczego
Aplikacja Android w module `WebView_FCM_Cloudflare_Worker` ładuje stronę zdalnie z adresu:
- `https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?pwa=1`

To oznacza, że UI i logika modułów są pobierane z hostingu (GitHub Pages), a nie "wypalone" na stałe w APK.

Dodatkowo w `MainActivity.kt` ustawione jest:
- `cacheMode = LOAD_NO_CACHE`
- `webView.clearCache(true)` przy starcie

Czyli aplikacja celowo pobiera świeżą wersję treści webowej.

## Kiedy NIE trzeba przebudowywać APK
Po zmianach w repozytorium webowym, np.:
- HTML/CSS/JS modułów (kolumny, przyciski, layout, walidacje)
- treści i danych ładowanych przez stronę
- nawigacji pomiędzy modułami

Warunek: zmiany są wdrożone na serwer/hosting, z którego korzysta aplikacja (tu: GitHub Pages).

## Kiedy trzeba przygotować nowy APK/AAB
Nowy build Android jest potrzebny, gdy zmieniasz część natywną Androida, np.:
- kod Kotlin (`MainActivity`, `NotificationHelper`, FCM service)
- `AndroidManifest.xml` (uprawnienia, komponenty)
- `build.gradle.kts` (SDK, zależności, BuildConfig)
- zasoby Android (`res/`, ikony, stringi, layout XML)
- adresy `BuildConfig` (np. `BASE_URL`, endpointy API)

Wtedy standardowo robisz nowy build i dystrybucję (APK/AAB).

## Praktyczna odpowiedź dla Twojego przykładu
Jeśli tylko:
- zmienisz szerokość kolumn,
- dodasz nowy przycisk,
- poprawisz style/layout modułu,

to zwykle wystarczy:
1. Zmienić pliki modułu.
2. Wypchnąć je na repo/hosting.
3. Otworzyć aplikację ponownie (lub odświeżyć widok).

Bez ponownego generowania APK.

## Uwaga operacyjna
Jeżeli użytkownik ma już otwartą starą sesję WebView, czasem trzeba zamknąć i ponownie uruchomić aplikację, aby natychmiast zobaczyć zmiany.

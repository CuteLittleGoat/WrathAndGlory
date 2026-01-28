# Migracja aplikacji WrathAndGlory na Android — analiza po wyborze wariantu B (natywny wrapper)

## 1. Założenia i decyzja projektowa

- Wybrany wariant: **natywny wrapper (WebView / Capacitor / Cordova)**.
- Aplikacja działa **wyłącznie online** — wszystkie pliki i dane są ładowane z hostingu (np. GitHub Pages / raw.githubusercontent.com), a aplikacja odwołuje się do nich przez HTTP/HTTPS.
- Kluczowe wymaganie: **moduł Infoczytnik (plik `Infoczytnik.html`) ma być blokowany w orientacji pionowej**, natomiast **pozostałe moduły mają działać w orientacji poziomej**.

## 2. Wnioski z ponownej analizy architektury

Repozytorium to zestaw niezależnych modułów HTML/CSS/JS bez klasycznego build pipeline. Każdy moduł działa jako samodzielna strona, a komunikacja zewnętrzna odbywa się przez:

- **HTTP/HTTPS** (pobieranie plików i danych z GitHuba),
- **CDN** (np. biblioteki typu XLSX),
- **Firebase (Firestore)** w niektórych modułach (Infoczytnik, Audio).

Wariant B jest właściwy, ponieważ:

- pozwala na **stałą kontrolę orientacji ekranu**,
- daje możliwość **precyzyjnej konfiguracji WebView** (JavaScript, cache, polityki sieciowe),
- nie wymaga przebudowy kodu HTML/JS, tylko odpowiedniego sposobu hostowania.

## 3. Czy możliwe jest zablokowanie pionu tylko dla Infoczytnika?

**Tak, jest to możliwe w wariancie natywnym.** Istnieją dwa praktyczne podejścia:

### 3.1. Rozdzielenie na dwa Activity (najprostsze i najstabilniejsze)

1. **Activity A (Infoczytnik):**
   - `android:screenOrientation="portrait"`
   - WebView ładuje wyłącznie `Infoczytnik/Infoczytnik.html`.

2. **Activity B (pozostałe moduły):**
   - `android:screenOrientation="sensorLandscape"` lub `landscape`
   - WebView ładuje moduł `Main` i pozostałe podstrony.

3. W aplikacji przewiduje się **przejście do osobnego Activity** tylko wtedy, gdy użytkownik uruchamia Infoczytnik. Można to zrobić:
   - poprzez dedykowany przycisk w natywnej warstwie (np. przycisk w toolbarze Android),
   - lub przez przechwycenie URL (np. kiedy WebView próbuje otworzyć `Infoczytnik/Infoczytnik.html`, aplikacja przełącza się na Activity A).

**Zalety:** stabilna orientacja, brak ryzyka „mieszania” ustawień.
**Wady:** potrzebne jest przekierowanie między Activity.

### 3.2. Jeden Activity + dynamiczna zmiana orientacji

Możliwe jest także sterowanie orientacją w **jednym Activity**, ale wymaga to integracji między kodem HTML/JS a natywną warstwą:

- **Capacitor / Cordova:** dostępne są pluginy do blokowania orientacji (`screen-orientation`), które można wywołać z JS podczas wejścia do Infoczytnika i odblokować przy wyjściu.
- **Czysty WebView:** można dodać **JavaScript Interface**, który wywoła `setRequestedOrientation()` w Androidzie.

**Zalety:** jedna aktywność i prostszy routing.
**Wady:** większa złożoność integracji, trzeba pilnować odblokowania orientacji przy opuszczaniu Infoczytnika.

### 3.3. Wniosek praktyczny

Najbezpieczniejszym i najmniej podatnym na błędy rozwiązaniem jest **rozdzielenie na dwa Activity**. Pozwala to wymusić pion na Infoczytniku i poziom na pozostałych modułach w sposób stabilny oraz przewidywalny.

## 4. Wariant B — plan wdrożenia krok po kroku (online)

### 4.1. Przygotowanie hostingu

1. Wybierz hosting HTTP/HTTPS:
   - **GitHub Pages** dla statycznych plików (rekomendowane),
   - lub `raw.githubusercontent.com`, jeśli chcesz bezpośrednio ładować surowe pliki.
2. Upewnij się, że wszystkie moduły i zasoby są dostępne po URL.
3. Sprawdź, czy domena hosta obsługuje CORS dla potrzebnych zasobów.

### 4.2. Budowa aplikacji Android (WebView)

1. Stwórz projekt Android (Android Studio → Empty Activity).
2. Dodaj WebView i włącz:
   - JavaScript,
   - dostęp do internetu (`android.permission.INTERNET`).
3. Podłącz WebView do hostowanych plików (np. `https://<user>.github.io/<repo>/Main/index.html`).

### 4.3. Implementacja orientacji

**Wariant rekomendowany: dwa Activity**

- **MainActivity (poziom):**
  - `android:screenOrientation="sensorLandscape"`
  - ładuje `Main/index.html` i pozwala na uruchamianie modułów.

- **InfoczytnikActivity (pion):**
  - `android:screenOrientation="portrait"`
  - ładuje `Infoczytnik/Infoczytnik.html`.

Aplikacja powinna przechwycić żądanie otwarcia Infoczytnika i uruchomić InfoczytnikActivity zamiast otwierać stronę w głównym WebView.

### 4.4. Komunikacja i routing

- **Najprostszy routing:** przechwycenie URL w `shouldOverrideUrlLoading()` i uruchomienie odpowiedniego Activity.
- **Alternatywa:** przycisk natywny w aplikacji uruchamiający Infoczytnik bezpośrednio.

## 5. Kluczowe ograniczenia i ryzyka online

1. **Dostęp do sieci jest wymagany stale.** Brak internetu = brak danych i brak ładowania modułów.
2. **Zależności CDN (np. XLSX, Firebase)** muszą być dostępne publicznie. W przypadku blokad sieciowych aplikacja może utracić funkcje.
3. **CORS i MIME typy**: ładowanie JSON/XLSX z GitHuba wymaga prawidłowych nagłówków odpowiedzi.
4. **Cache WebView**: aktualizacje modułów w hostingu mogą wymagać wymuszenia odświeżenia lub wersjonowania URL (np. `?v=2`).

## 6. Rekomendacja końcowa

- **Wariant B (natywny wrapper) jest właściwy i wystarczający.**
- **Blokada pionu tylko dla Infoczytnika jest możliwa** i najlepiej zrealizować ją przez dwa Activity z różnymi ustawieniami orientacji.
- Pozostałe moduły mogą działać w stałym układzie poziomym bez konfliktu z Infoczytnikiem.

Dokument zakłada, że aplikacja działa online i nie obejmuje scenariuszy offline ani innych wariantów migracji.

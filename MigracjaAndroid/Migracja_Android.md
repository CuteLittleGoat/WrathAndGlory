# Migracja aplikacji WrathAndGlory na Android — praktyczny poradnik (wariant B: natywny wrapper WebView)

Poniżej znajdziesz przeredagowaną instrukcję w formie odpowiedzi na konkretne pytania. Tekst jest napisany dla osoby początkującej — krok po kroku, z wyjaśnieniem „co i gdzie kliknąć”.

---

## 1. Co należy zrobić, krok‑po‑kroku, żeby utworzyć taką aplikację?

Poniższa instrukcja zakłada, że aplikacja działa **online** (pliki są hostowane w internecie), a aplikacja Android to **WebView** z dwoma ekranami (dwie aktywności):
- **Infoczytnik** w pionie,
- reszta modułów w poziomie.

### Krok A — przygotuj hosting plików
1. **Zdecyduj, gdzie będą pliki aplikacji:**
   - Najprościej: **GitHub Pages**.
2. **Utwórz repozytorium na GitHubie** (jeśli jeszcze go nie masz):
   - Wejdź na https://github.com → „New repository”.
3. **Wgraj pliki aplikacji do repozytorium** (np. cały folder projektu).
4. **Włącz GitHub Pages:**
   - Wejdź w repozytorium → **Settings** → **Pages**.
   - W sekcji „Build and deployment” wybierz **Branch: main** (lub master) i **/root**.
   - Zapisz. Po chwili pojawi się link do strony, np. `https://twoj-login.github.io/twoj-repo/`.
5. **Sprawdź w przeglądarce, czy działa strona główna:**
   - Otwórz `https://twoj-login.github.io/twoj-repo/Main/index.html`.
   - Jeśli widzisz stronę główną modułu, hosting jest poprawny.

### Krok B — zainstaluj Android Studio
1. Wejdź na stronę https://developer.android.com/studio.
2. Kliknij **Download Android Studio** i zainstaluj program.
3. Uruchom Android Studio po instalacji.

### Krok C — stwórz projekt aplikacji
1. W Android Studio kliknij **New Project**.
2. Wybierz **Empty Activity** → **Next**.
3. Ustaw dane projektu:
   - **Name:** np. `WrathAndGlory`
   - **Package name:** np. `com.twojlogin.wrathandglory`
   - **Save location:** dowolny folder na komputerze
   - **Language:** **Kotlin**
   - **Minimum SDK:** np. **API 24 (Android 7.0)**
4. Kliknij **Finish** i poczekaj aż projekt się utworzy.

### Krok D — dodaj WebView do aplikacji
1. W lewym panelu otwórz plik:
   - `app > res > layout > activity_main.xml`
2. Zastąp jego zawartość prostym WebView:
   ```xml
   <WebView
       android:id="@+id/webView"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```
3. W pliku `MainActivity.kt`:
   - Włącz JavaScript w WebView.
   - Załaduj stronę główną modułu, np.:
     `https://twoj-login.github.io/twoj-repo/Main/index.html`

### Krok E — dodaj drugą aktywność dla Infoczytnika
1. Kliknij prawym na folder `app > java > (twoj pakiet)`.
2. Wybierz **New > Activity > Empty Activity**.
3. Nazwij ją np. `InfoczytnikActivity`.
4. W pliku layout dla tej aktywności dodaj WebView analogicznie.
5. W kodzie tej aktywności ustaw adres:
   `https://twoj-login.github.io/twoj-repo/Infoczytnik/Infoczytnik.html`

### Krok F — ustaw orientację ekranu
1. Otwórz plik `AndroidManifest.xml`.
2. Dla `MainActivity` ustaw poziom:
   ```xml
   android:screenOrientation="sensorLandscape"
   ```
3. Dla `InfoczytnikActivity` ustaw pion:
   ```xml
   android:screenOrientation="portrait"
   ```

### Krok G — przełączanie między aktywnościami
Masz dwie opcje:
- **Opcja 1:** Przycisk w aplikacji (natywny). Dodajesz np. przycisk w Android Studio, który uruchamia `InfoczytnikActivity`.
- **Opcja 2:** Przechwycenie linku w WebView — kiedy użytkownik kliknie link do Infoczytnika, aplikacja otwiera drugą aktywność.

### Krok H — zbuduj i przetestuj
1. Podłącz telefon przez USB lub uruchom emulator.
2. Kliknij zielony **Run** (►).
3. Aplikacja powinna się uruchomić i wczytać stronę z internetu.

---

## 2. Czy mogę mieć kopię aplikacji w wersji online i w pliku GM.html przygotować wiadomość, która zostanie wyświetlona w zainstalowanej aplikacji u użytkownika na innym urządzeniu?

**Tak, to możliwe.** Jeśli aplikacja w telefonie ładuje pliki z internetu, to:
- możesz mieć **wersję online** (np. GitHub Pages),
- a w pliku **GM.html** umieścić treść, która będzie widoczna u wszystkich użytkowników, gdy aplikacja pobierze aktualny plik z hostingu.

W praktyce działa to tak, że aplikacja **zawsze wyświetla to, co jest w plikach na serwerze**. Jeśli zmienisz `GM.html` na hostingu, użytkownik zobaczy nową treść po odświeżeniu lub ponownym uruchomieniu aplikacji.

---

## 3. Czy mogę wyświetlać powiadomienia o nadejściu nowej wiadomości na urządzeniu użytkownika?

**Tak, ale wymaga to dodatkowego systemu powiadomień.** Same pliki HTML i WebView nie potrafią samodzielnie wysłać „push” na telefon. Potrzebujesz:

1. **Usługi powiadomień push**, np. Firebase Cloud Messaging (FCM).
2. **Natywnego kodu Android**, który:
   - rejestruje urządzenie w FCM,
   - odbiera powiadomienie,
   - wyświetla je użytkownikowi.
3. **Serwera lub panelu**, z którego wyślesz powiadomienie.

Podsumowanie: **technicznie jest to możliwe**, ale wymaga dodatkowej konfiguracji i nie jest częścią samego HTML/WebView.

---

## 4. Czy wymagane pliki mogą być utworzone w folderze „MigracjaAndroid” czy lokalizacja plików jest sztywno narzucona (np. folder główny)?

**W przypadku hostingu online lokalizacja plików nie jest „sztywno narzucona”.** Możesz trzymać pliki w dowolnych folderach, **pod warunkiem że adresy URL w aplikacji wskazują właściwe ścieżki**.

Przykład:
- Jeśli plik jest pod `https://twoj-login.github.io/twoj-repo/MigracjaAndroid/GM.html`, to w aplikacji musisz podać dokładnie taki URL.

Najważniejsze: **struktura folderów musi się zgadzać z URL‑ami, które wpisujesz w WebView.**

---

## 5. Jak przygotować ikonę dla aplikacji? Jakie są wymagania?

Najprościej użyć narzędzia w Android Studio:

1. Kliknij prawym na `app` → **New** → **Image Asset**.
2. Wybierz:
   - **Icon Type:** Launcher Icons (Adaptive and Legacy)
   - **Source Asset:** wybierz plik PNG/SVG (najlepiej prosty, wyraźny znak).
3. Android Studio samo wygeneruje komplet ikon w różnych rozmiarach.

**Wymagania praktyczne:**
- Grafika powinna być **prosta, czytelna w małym rozmiarze**.
- Najlepiej kwadratowa (np. 512×512 px), bez drobnych szczegółów.
- Android sam tworzy różne rozmiary, więc nie musisz ręcznie przygotowywać wielu plików.

---

## 6. Jak wygląda późniejsza aktualizacja aplikacji? Załóżmy, że dodaję nowy moduł — trzeba przebudowywać całą aplikację?

**Zależy od tego, czy nowy moduł wymaga zmian w samym Androidzie.**

- Jeśli dodajesz nowy moduł jako **kolejny folder HTML** na hostingu i linkujesz do niego z poziomu `Main/index.html`, to:
  - **Nie trzeba przebudowywać aplikacji Android.**
  - Wystarczy zaktualizować pliki na serwerze.

- Jeśli nowy moduł wymaga **nowej natywnej funkcji** (np. osobny ekran z inną orientacją, dostęp do GPS, push, itp.), to:
  - **Trzeba zmienić i przebudować aplikację Android.**

---

## 7. Jak wygląda późniejsza aktualizacja aplikacji? Załóżmy, że aktualizuję pliki `data.json` albo `AudioManifest.xlsx` — trzeba przebudowywać całą aplikację?

**Nie.** Jeśli aplikacja ładuje te pliki z internetu (np. GitHub Pages), to:
- wystarczy podmienić plik na serwerze,
- aplikacja po odświeżeniu wczyta nową wersję.

**Przebudowa aplikacji Android nie jest potrzebna**, ponieważ WebView i tak pobiera dane online.

---

## Podsumowanie w jednym zdaniu
Aplikację Android w wariancie WebView budujesz raz, a później większość zmian (nowe moduły, dane, treści) aktualizujesz przez zwykłą podmianę plików na hostingu — bez ponownej publikacji APK, o ile nie zmieniasz funkcji natywnych.

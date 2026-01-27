# Infoczytnik — stała orientacja pionowa (wnioski z analizy)

## 1. Stan obecny (wersja webowa)

- Moduł Infoczytnik działa jako klasyczna strona WWW (HTML/CSS/JS).
- Przeglądarki mobilne **nie pozwalają na twarde wymuszenie orientacji urządzenia** dla zwykłej strony.
- Możliwe są tylko obejścia wizualne (np. obrót UI), ale **orientacja sprzętowa telefonu nie zostanie zablokowana**.

Wniosek: **w wersji webowej nie da się w 100% wymusić stałej orientacji pionowej**.

## 2. Co jest realnie możliwe w WEB

1. **Miękkie wymuszenie (overlay / komunikat)**
   - Wykrywanie orientacji (`window.innerWidth > window.innerHeight`).
   - Gdy wykryty poziom — wyświetlenie ekranu z informacją „Obróć urządzenie do pionu”.
   - Opcjonalnie: blokada interakcji w poziomie.

2. **Wizualne wymuszenie pionu**
   - UI zawsze renderuje się jak „pionowe”, a w poziomie lub na PC całość jest obracana o 90°.
   - To daje efekt „zawsze pion”, ale **nie zmienia fizycznej orientacji urządzenia**.

## 3. Co trzeba zrobić, aby działało to **na stałe** w aplikacji instalowanej na Androidzie

Poniżej dokładna lista działań, które zapewniają twardą blokadę pionu w aplikacji instalowanej na Androidzie.

### Opcja A: PWA (aplikacja instalowana z przeglądarki)

1. **Dodać plik `manifest.json` dla Infoczytnika**
   - W pliku ustawić:
     - `"display": "standalone"` (lub `"fullscreen"`)
     - `"orientation": "portrait"`
   - Dodać ikony aplikacji w różnych rozmiarach (`icons`).

2. **Podpiąć manifest do strony**
   - W `<head>` dodać:
     - `<link rel="manifest" href="manifest.json">`

3. **(Opcjonalnie, ale zalecane) dodać Service Worker**
   - Umożliwia instalację offline oraz poprawne zachowanie PWA.

4. **Instrukcja dla użytkownika**
   - Użytkownik musi zainstalować PWA z Chrome/Edge ("Dodaj do ekranu głównego").
   - Dopiero wtedy Android respektuje `orientation: portrait`.

**Efekt:**
- Po instalacji jako PWA, Android uruchamia aplikację **zablokowaną w pionie**.

### Opcja B: Aplikacja natywna (WebView / Capacitor / Cordova)

1. **Stworzyć wrapper natywny Android**
   - Użyć np. Android Studio + WebView lub frameworków typu Capacitor/Cordova.

2. **Wymusić orientację w AndroidManifest.xml**
   - W definicji aktywności ustawić:
     - `android:screenOrientation="portrait"`

3. **Skonfigurować WebView do ładowania Infoczytnika**
   - Ładowanie lokalnych plików lub hostowanej strony.

**Efekt:**
- Orientacja jest **twardo zablokowana w pionie** niezależnie od treści HTML.

## 4. Rekomendacja

- Jeśli zależy Ci na prostym wdrożeniu bez pełnej aplikacji natywnej — **PWA z ustawionym `orientation: portrait`** będzie najprostsze.
- Jeśli potrzebujesz pełnej kontroli (100% pewności) — **wrapper natywny z blokadą orientacji w AndroidManifest**.

## 5. Dodatkowe uwagi

- PWA nie gwarantuje blokady w każdej przeglądarce, ale na Androidzie (Chrome) działa poprawnie po instalacji.
- Aplikacja natywna daje pełną kontrolę, ale wymaga utrzymania projektu Android.

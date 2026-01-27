# Migracja aplikacji WrathAndGlory na Android — analiza i plan działań

## 1. Kontekst i wymaganie krytyczne (Infoczytnik_Pion)

Plik `Infoczytnik_Pion.md` wskazuje, że **w webowej wersji nie da się twardo wymusić orientacji pionowej**, a trwałe wymuszenie jest możliwe tylko w PWA po instalacji lub w natywnej aplikacji Android (WebView/Capacitor/Cordova z `android:screenOrientation="portrait"`). To jest kluczowy wymóg dla Infoczytnika. Wymuszenie pionu musi więc zostać rozwiązane przez **PWA** albo **natywny wrapper** z blokadą orientacji w AndroidManifest. (Źródło: `Infoczytnik_Pion.md`.)

## 2. Stan obecny aplikacji (architektura i moduły)

Repozytorium to **zestaw niezależnych modułów** opartych o statyczne HTML/CSS/JS, bez typowego build pipeline. Poniżej krótki opis każdego modułu i jego zależności technicznych:

### 2.1. Main (moduł startowy)
- `Main/index.html` to launcher z przyciskami do uruchamiania modułów oraz prostą logiką „admin=1” do pokazywania części linków. (Źródło: `Main/index.html`.)

### 2.2. DataVault
- `DataVault/index.html` to panel z filtrami, porównywaniem rekordów i przyciskiem aktualizacji danych. (Źródło: `DataVault/index.html`.)
- `DataVault/app.js` ładuje dane z `data.json` (fetch), a w trybie admina potrafi pobrać `Repozytorium.xlsx` i wygenerować nowy `data.json`. Wykorzystuje też bibliotekę XLSX z CDN. (Źródła: `DataVault/app.js`, `DataVault/index.html`.)

### 2.3. GeneratorNPC
- `GeneratorNPC/index.html` pobiera dane z `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json` i na ich podstawie generuje kartę NPC. (Źródło: `GeneratorNPC/index.html`.)

### 2.4. GeneratorNazw
- `GeneratorNazw/script.js` korzysta z `crypto.getRandomValues` do losowości oraz z seedowanego RNG dla powtarzalnych wyników. (Źródło: `GeneratorNazw/script.js`.)

### 2.5. DiceRoller
- `DiceRoller/index.html` + `DiceRoller/script.js` to lokalna logika rzutów kośćmi, bez zewnętrznych danych. (Źródła: `DiceRoller/index.html`, `DiceRoller/script.js`.)

### 2.6. Kalkulator
- `Kalkulator/index.html` to launcher do dwóch narzędzi: `KalkulatorXP.html` i `TworzeniePostaci.html`. (Źródło: `Kalkulator/index.html`.)
- `Kalkulator/KalkulatorXP.html` zawiera wbudowany JS do liczenia XP na podstawie pól tabeli. (Źródło: `Kalkulator/KalkulatorXP.html`.)
- `Kalkulator/TworzeniePostaci.html` to rozbudowany arkusz tworzenia postaci z JS (walidacja + obliczenia). (Źródło: `Kalkulator/TworzeniePostaci.html`.)

### 2.7. Infoczytnik
- `Infoczytnik/Infoczytnik_test.html` korzysta z **Firebase Firestore** (importy z `firebase-app` i `firebase-firestore` przez CDN) oraz z własnego configu `config/firebase-config.js`. (Źródło: `Infoczytnik/Infoczytnik_test.html`.)
- Infoczytnik ładuje **asset-y lokalne** (obrazy layoutów i audio) oraz ma mechanizm **odblokowania audio** (wymagany gest użytkownika w przeglądarce). (Źródło: `Infoczytnik/Infoczytnik_test.html`.)

### 2.8. Audio
- `Audio/index.html` używa **Firebase Firestore**, biblioteki XLSX z CDN i własnego `config/firebase-config.js`, do obsługi manifestów audio i list ulubionych. (Źródło: `Audio/index.html`.)

## 3. Wnioski dla migracji na Android

1. **Architektura jest w pełni webowa** — wszystkie moduły są statyczne i nie wymagają backendu (poza usługami zewnętrznymi jak Firebase czy pliki na GH Pages). To sprzyja migracji przez PWA lub wrapper WebView.
2. **Zewnętrzne zależności** (Firebase, XLSX, Google Fonts, dane z GH Pages) oznaczają, że bez dostępu do internetu część funkcji może nie działać. Jeśli aplikacja ma działać offline, trzeba te zależności spakować lokalnie.
3. **Wymuszenie pionu** (Infoczytnik) jest zgodne z kierunkiem migracji do Androida — web nie wystarczy. (Źródło: `Infoczytnik_Pion.md`.)

## 4. Migracja na Android — krok po kroku (dla początkującego, z użyciem ChatGPT)

Poniżej jest plan w **dwóch wariantach**: PWA (najprostsze) lub natywny wrapper (pewność blokady pionu + więcej kontroli).

### 4.1. Krok 0 — Ustal cele i zakres
1. Zdecyduj, czy aplikacja **ma działać offline** czy online.
2. Określ, czy **wszystkie moduły** muszą być dostępne w Androidzie, czy tylko Infoczytnik.
3. Ustal, czy orientacja pionowa ma być **sztywno wymuszona zawsze** (rekomendowany wrapper).

### 4.2. Wariant A — PWA (szybka instalacja z przeglądarki)
1. Dodaj `manifest.json` w folderze modułu (np. Infoczytnik) i ustaw `"display": "standalone"` oraz `"orientation": "portrait"`.
2. Dodaj `<link rel="manifest" href="manifest.json">` w `<head>`.
3. (Opcjonalnie) Dodaj Service Worker do cache’owania zasobów offline.
4. Przetestuj instalację PWA na Androidzie (Chrome → „Dodaj do ekranu głównego”).
5. Zweryfikuj, czy po instalacji orientacja jest zablokowana w pionie (Infoczytnik).

### 4.3. Wariant B — Natywny wrapper (WebView / Capacitor / Cordova)
1. Zainstaluj Android Studio.
2. Utwórz nowy projekt (np. „Empty Activity”).
3. Dodaj `WebView` i włącz JS (`webSettings.javaScriptEnabled = true`).
4. Zdecyduj, czy ładować aplikację:
   - z internetu (np. GH Pages),
   - czy z lokalnych plików (wtedy trzeba spakować całą aplikację w `assets/`).
5. W `AndroidManifest.xml` ustaw `android:screenOrientation="portrait"` dla aktywności (wymuszenie pionu).
6. Dodaj `uses-permission android:name="android.permission.INTERNET"`.
7. Zbuduj APK i przetestuj na telefonie.

### 4.4. Dodatkowe kroki (niezbędne niezależnie od wariantu)

**A. Zależności i pliki zewnętrzne**
1. **Firebase**: Infoczytnik i Audio korzystają z Firestore z CDN i `config/firebase-config.js` — musisz zachować dostęp do internetu albo przenieść te importy do lokalnych plików (offline). (Źródło: `Infoczytnik/Infoczytnik_test.html`, `Audio/index.html`.)
2. **XLSX z CDN**: DataVault i Audio ładują bibliotekę z `cdn.jsdelivr.net` — jeśli offline, musisz ją spakować lokalnie. (Źródło: `DataVault/index.html`, `DataVault/app.js`, `Audio/index.html`.)
3. **Dane**: GeneratorNPC pobiera `data.json` z GH Pages — jeśli offline, musisz podmienić URL na lokalny plik lub spakować dane w aplikacji. (Źródło: `GeneratorNPC/index.html`.)

**B. Obsługa plików lokalnych (Repozytorium.xlsx)**
1. DataVault wymaga `Repozytorium.xlsx` w głównym folderze aplikacji dla „Aktualizuj dane” — na Androidzie trzeba jasno zdefiniować, gdzie użytkownik ma ten plik zapisać lub jak go wczytać. (Źródło: `DataVault/index.html`, `DataVault/app.js`.)
2. W wrapperze WebView najbezpieczniej użyć systemowego wyboru pliku (input type="file") lub osobnego ekranu do importu.

**C. Audio i gest użytkownika**
1. Infoczytnik ma mechanizm „kliknij raz, aby odblokować dźwięk” — w aplikacji mobilnej podobne ograniczenia nadal obowiązują (WebView). (Źródło: `Infoczytnik/Infoczytnik_test.html`.)

## 5. Korzyści migracji

- **Wymuszenie orientacji pionowej** dla Infoczytnika (wymóg kluczowy). (Źródło: `Infoczytnik_Pion.md`.)
- **Lepsza kontrola środowiska**: stałe ustawienia WebView, brak zależności od przeglądarek.
- **Możliwość pełnego offline** (po spakowaniu danych i bibliotek w aplikacji).
- **Dostęp do funkcji Android** (np. pliki lokalne, powiadomienia), jeśli będzie potrzebny w przyszłości.

## 6. Wady i potencjalne problemy

- **Utrzymanie dwóch światów**: web + Android (build, wersje APK, testy, aktualizacje).
- **Zależności zewnętrzne**: Firebase, XLSX i dane z GH Pages wymagają internetu — bez migracji do offline będą ograniczenia funkcjonalne.
- **Cache i aktualizacje**: w PWA i WebView trzeba pilnować wersjonowania plików, inaczej użytkownik może mieć „starą wersję”.
- **Pliki lokalne**: DataVault zakłada dostęp do `Repozytorium.xlsx` w ścieżce root — w Androidzie to nie zadziała 1:1 bez dodatkowego UI do importu.

## 7. Ryzyka i problemy po migracji (eksploatacja)

1. **Aktualizacje danych (DataVault)**
   - W webie łatwo podmienić `data.json`, w APK wymaga to aktualizacji aplikacji lub systemu pobierania danych z sieci.
2. **Firebase i bezpieczeństwo**
   - Firebase config jest publiczny (tak działa web), ale trzeba pilnować reguł dostępu w Firestore.
3. **Wielkość aplikacji**
   - Jeśli spakujesz wszystkie assety, obrazy i audio offline, rozmiar APK może być bardzo duży.
4. **Zachowanie audio**
   - Autoplay w WebView nadal wymaga interakcji użytkownika, więc ekran „odblokowania audio” musi pozostać.

## 8. Rekomendacja praktyczna

- Jeśli **najważniejsze** jest tylko wymuszenie pionu w Infoczytniku → **PWA** może być najszybszym krokiem.
- Jeśli chcesz **pełną kontrolę** i 100% pewności → **wrapper Android (WebView/Capacitor)** jest bardziej odpowiedni.
- Dla stabilnej pracy offline: trzeba przenieść zewnętrzne zależności (XLSX, Firebase, data.json) do pakietu aplikacji lub zapewnić mechanizm synchronizacji.

---

## Podsumowanie

Migracja do Androida jest technicznie możliwa, ponieważ wszystkie moduły działają jako statyczne strony. Największe wyzwania to: orientacja pionowa (rozwiązywana przez PWA lub WebView), zależności zewnętrzne (Firebase/XLSX) oraz obsługa danych i plików lokalnych (data.json / Repozytorium.xlsx). Najbezpieczniejszym podejściem jest wrapper z WebView i kontrolą orientacji + stopniowe przenoszenie zależności do lokalnych zasobów.

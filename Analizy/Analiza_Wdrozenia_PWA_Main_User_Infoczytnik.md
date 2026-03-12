# Aktualizacja analizy wdrożenia PWA (Main + User mode + Infoczytnik + powiadomienia)

## Prompt użytkownika (kontekst tej aktualizacji)
> 1. Przeczytaj analizę: `Analizy/Analiza_Wdrozenia_PWA_Main_User_Infoczytnik.md`  
> 2. Infoczytnik: dodać warunek „tylko pion” (CSS + JS), w poziomie pokazać ekran informacyjny „Obróć urządzenie do pionu”, opcjonalnie próbować `screen.orientation.lock('portrait')` tam, gdzie API działa.  
> nie chcę, żeby pokazywał się ekran informacyjny. Moduł "Infoczytnik" ma wyświetlać tekst wpisany przez GM w panelu administracyjnym. Jeżeli użytkownik zobaczy, że tekst się wyświetla w niewłaściwej orientacji to sam obróci urządzenie. Zablokuj po prostu orientację ekranu bez żadnego komunikatu.  
> 3. Dodatkowe uwagi:  
> - Aplikacja będzie używana tylko online  
> - Aplikacja raczej będzie tylko na androidzie  
> - Aplikacja ma wyświetlać stronę internetową. Plik `data.json` będzie na serwerze, a nie w pamięci urządzenia  
> - „Linki z `target="_blank"` mogą powodować wyjście poza kontekst standalone” — to wymaga szczegółowego wyjaśnienia  
> 4. Nowe wymaganie:  
> - Powiadomienie o nowej wiadomości w Infoczytniku:  
>   a) gdy użytkownik ma otwartą aplikację na innej zakładce  
>   b) gdy użytkownik ma otwartą inną aplikację na urządzeniu  
> - Jeśli możliwe: ikona powiadomień `IkonaPowiadomien.png`, treść `+++ INCOMING DATA-TRANSMISSION +++`  
> - Zaproponuj kilka rozwiązań, opisz czy wymagana modyfikacja Firebase czy da się bez Firebase.  
> - Wyjaśnij dokładnie `target="_blank"`.  
> - Zaktualizuj analizę.

---

## 1) Decyzje po doprecyzowaniu wymagań

1. **Infoczytnik: bez ekranu informacyjnego w poziomie** (zgodnie z Twoją decyzją).  
   - Stosujemy próbę blokady orientacji na pion (`portrait`) tam, gdzie API działa.  
   - Nie renderujemy żadnego komunikatu typu „Obróć urządzenie”.
2. **Priorytet platformy: Android + online-only**.  
   - Strategia PWA i notyfikacji może być zoptymalizowana pod Chromium/Android (najbardziej przewidywalne wsparcie).  
   - Nie projektujemy „pełnego offline” (to już nie jest cel).
3. **`data.json` pozostaje źródłem sieciowym**.  
   - Brak potrzeby utrzymywania dużego cache danych na urządzeniu.  
   - Można ograniczyć cache SW do minimalnego app-shella (lub nawet pominąć agresywne cache danych).

---

## 2) Infoczytnik: „tylko pion” bez komunikatu — co realnie da się zagwarantować

### Wariant implementacyjny (zalecany)

1. W module `Infoczytnik` dodać próbę:
   - `await screen.orientation.lock('portrait')` po wejściu do widoku.
2. Dodać fallback w CSS/JS, który **nie pokazuje żadnego ekranu informacyjnego**, tylko utrzymuje standardowy widok.
3. Nie blokować działania modułu twardym overlayem.

### Ważne ograniczenie techniczne

- **Przeglądarka może odrzucić lock orientacji** (zależnie od kontekstu, uprawnień, wersji WebView/Chrome, sposobu uruchomienia).  
- To oznacza: „zablokuj orientację” w web app jest możliwe **warunkowo**, a nie absolutnie na każdym urządzeniu.  
- Dla Android PWA w trybie standalone szanse powodzenia są wysokie, ale nadal trzeba obsłużyć przypadek odrzucenia bez błędu UX (tu: brak komunikatu, tylko ciche `catch`).

---

## 3) Powiadomienia o nowych wiadomościach w Infoczytniku — możliwe rozwiązania

Poniżej kilka opcji od najprostszej do najbardziej kompletnej.

### Opcja A — Notyfikacje tylko gdy aplikacja jest otwarta (także w innej zakładce)

**Mechanizm**
- Nasłuch zmian wiadomości (polling, SSE, WebSocket albo Firebase Realtime/Firestore listener).
- Gdy nadejdzie nowa wiadomość i dokument jest ukryty (`document.hidden === true`) lub użytkownik jest na innej zakładce, wywołać `new Notification(...)`.

**Czy działa dla warunku (a)?**
- Tak, zwykle tak (przy nadanym pozwoleniu na notyfikacje).

**Czy działa dla warunku (b) — inna aplikacja na urządzeniu?**
- **Niekoniecznie / ograniczenie**: bez pusha i Service Workera nie ma gwarancji dostarczenia, gdy web app zostanie uśpiona w tle.

**Firebase potrzebny?**
- **Nie** (można bez Firebase).

---

### Opcja B — Web Push + Service Worker (pełne powiadomienia także w tle)

**Mechanizm**
- Rejestracja Service Workera.
- Subskrypcja Push API (VAPID).
- Serwer wysyła push przy nowej wiadomości Infoczytnika.
- SW pokazuje systemowe powiadomienie:
  - tytuł/treść: `+++ INCOMING DATA-TRANSMISSION +++`
  - ikona: `IkonaPowiadomien.png`

**Czy działa dla (a)?**
- Tak.

**Czy działa dla (b)?**
- Tak — to jest właściwa ścieżka dla powiadomień, gdy użytkownik ma otwartą inną aplikację.

**Firebase potrzebny?**
- **Nie jest wymagany**. Da się zrobić na własnym backendzie Web Push (VAPID).

---

### Opcja C — Firebase Cloud Messaging (FCM) + Service Worker

**Mechanizm**
- Integracja FCM Web SDK i `firebase-messaging-sw.js`.
- Backend (lub funkcja) wysyła wiadomość przez FCM topic/token po aktualizacji treści Infoczytnika.
- W tle powiadomienie obsługiwane przez SW.

**Czy działa dla (a) i (b)?**
- Tak, jak w opcji B (to też push w tle).

**Firebase potrzebny?**
- **Tak, to rozwiązanie wymaga Firebase (FCM).**

---

## 4) Rekomendacja dla Twojego przypadku

Biorąc pod uwagę: **Android-first**, **online-only**, potrzeba notyfikacji również przy innej aplikacji w foreground:

1. **Najbardziej kompletne**: Opcja B (Web Push VAPID) albo C (FCM).  
2. Jeśli i tak używacie Firebase i chcecie szybsze wdrożenie operacyjne: **Opcja C (FCM)** bywa prostsza organizacyjnie.  
3. Jeśli chcesz uniezależnić się od Firebase: **Opcja B (czysty Web Push)**.

Minimalny kompromis:
- etap 1: Opcja A (szybko),
- etap 2: przejście na B/C dla gwarancji dostarczania w tle.

---

## 5) Ikona i treść powiadomienia

Docelowe parametry (dla B/C oraz częściowo A):
- `body`: `+++ INCOMING DATA-TRANSMISSION +++`
- `icon`: `IkonaPowiadomien.png`
- opcjonalnie:
  - `badge` (Android status bar),
  - `tag: 'infoczytnik-new-message'` (grupowanie/replace),
  - `renotify: true` (ponowne alarmowanie przy nowej treści).

Uwaga praktyczna:
- najlepiej trzymać ikonę w publicznej, stabilnej ścieżce (np. w `Main/` albo katalogu zasobów PWA) i używać absolutnego URL w SW.

---

## 6) Szczegółowe wyjaśnienie: co oznacza `target="_blank"` i czemu to bywa problemem w PWA

### Co robi `target="_blank"`

W linku HTML:
```html
<a href="/jakas-strona" target="_blank">Otwórz</a>
```
przeglądarka otwiera adres w **nowej karcie/nowym kontekście**.

### Dlaczego to bywa problemem w aplikacji PWA (standalone)

W trybie zainstalowanej aplikacji (display standalone):
1. kliknięcie linku z `_blank` może otworzyć zewnętrzne okno/przeglądarkę systemową,
2. użytkownik „wychodzi” z kontekstu appki,
3. traci się spójność UX (czasem inny pasek adresu, inna sesja, inne zachowanie „wstecz”),
4. czasem otwarty dokument nie jest już pod kontrolą Twojego SW/scope w taki sposób, jak oczekujesz.

### Co robić praktycznie

- Dla kluczowej nawigacji modułów wewnątrz aplikacji używać `_self` (domyślnie bez `target`).
- `_blank` zostawić tylko tam, gdzie celowo chcesz wyjść „na zewnątrz” (np. dokumentacja, zewnętrzne źródła).
- Jeśli `_blank` jest konieczne, dodawać `rel="noopener noreferrer"` (bezpieczeństwo i wydajność).

---

## 7) Zaktualizowane ryzyka i ograniczenia (po Twoich uwagach)

1. **Offline-full** nie jest już celem — aplikacja działa online, więc ryzyko offline można odsunąć.  
2. **Orientacja lock** w web app nadal ma ograniczenia platformowe (mimo priorytetu Android).  
3. **Powiadomienia w tle** wymagają architektury push + SW (same notyfikacje z aktywnej karty to za mało).  
4. **`target="_blank"`** może psuć spójność standalone — trzeba świadomie ograniczyć dla krytycznej nawigacji.

---

## 8) Plan wdrożenia (zaktualizowany)

1. PWA shell (manifest + SW + start z `Main`) i user-only flow.  
2. Infoczytnik: dodać lock `portrait` (`try/catch`, bez komunikatu w UI).  
3. Powiadomienia etapowo:
   - Etap 1: lokalne notyfikacje przy aktywnej sesji (Opcja A),
   - Etap 2: push background (Opcja B lub C).  
4. Ograniczyć `target="_blank"` w krytycznych przejściach między modułami.

---

## 9) Odpowiedź skrócona na pytanie „czy trzeba modyfikować Firebase?”

- **Nie, nie trzeba** — da się wdrożyć powiadomienia bez Firebase (Web Push VAPID + SW).  
- **Tak, trzeba** tylko jeśli wybierzesz wariant FCM (Opcja C).  
- Dla powiadomień działających także gdy użytkownik jest w innej aplikacji: **konieczny jest push + Service Worker** (z Firebase albo bez).

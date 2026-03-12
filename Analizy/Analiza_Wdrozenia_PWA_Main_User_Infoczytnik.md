# Analiza wdrożenia PWA (instalacja aplikacji + tryb użytkownika + orientacja Infoczytnika)

## Prompt użytkownika
> Przeprowadź analizę wdrożenia PWA.  
> Chciałbym, żeby była możliwość zainstalowania aplikacji (ikona: Main/IkonaGlowna.png).  
> Uruchomienie aplikacji uruchamiałoby moduł "Main".  
> W aplikacji byłby zablokowany widok dla widoku użytkownika (bez dopisku ?admin=1).  
> W aplikacji mobilnej musiałby działać wszystkie moduły aplikacji (np. "DataVault", "Kalkulator") dostępne z poziomu widoku użytkownika (bez dopisku ?admin=1)  
> Moduł "Infoczytnik" ma się uruchamiać tylko w orientacji pionowej. Pozostałe moduły muszą się odstosowywać do orientacji ekranu urządzenia mobilnego.

---

## 1) Stan obecny (na podstawie przeglądu kodu)

1. W repo nie ma obecnie plików PWA (`manifest.webmanifest`, `sw.js`) ani rejestracji Service Workera.
2. `Main/index.html` pełni rolę launchera modułów i ma logikę ukrywania elementów admina, gdy brak `?admin=1`.
3. Część linków w `Main` wskazuje na absolutne URL-e GitHub Pages, część na ścieżki względne.
4. `DataVault` rozróżnia tryb admin/użytkownik przez parametr `?admin=1`.
5. `Infoczytnik` nie ma obecnie wymuszenia orientacji pionowej (brak mechanizmu blokady orientacji i brak ekranu informującego przy poziomie).

Wniosek: wymagania użytkownika są wykonalne, ale wymagają wdrożenia „shella PWA” na poziomie repo + dopięcia zasad uruchamiania modułów.

---

## 2) Czy wdrożenie jest możliwe?

Tak — **wdrożenie jest możliwe** i sensownie podzielić je na 3 warstwy:

### A. Warstwa instalowalności PWA
- Dodać `manifest.webmanifest` w katalogu głównym repo lub w `Main/` (preferencyjnie w głównym root serwowanym przez GitHub Pages dla spójności).
- Ustawić:
  - `name`, `short_name`
  - `icons` z `Main/IkonaGlowna.png`
  - `start_url` na `Main/index.html` (z poprawnym prefiksem ścieżki projektu na GH Pages)
  - `display: standalone`
  - `scope` obejmujący wszystkie moduły
- Dodać `sw.js` + rejestrację SW (najlepiej w `Main/index.html`, opcjonalnie wspólny bootstrap JS).

### B. Warstwa nawigacji i blokady trybu admin w aplikacji zainstalowanej
- W trybie standalone wymusić widok użytkownika:
  - podczas otwarcia `Main` usuwać `?admin=1` z URL, jeśli wykryto tryb aplikacji zainstalowanej,
  - dla linków z `Main` generować wyłącznie URL bez `?admin=1`.
- Dodatkowo można dodać „hard guard” po stronie modułów (`DataVault`, `Audio`, inne):
  - jeśli `display-mode: standalone`, ignorować `?admin=1`.

### C. Warstwa orientacji i mobile UX
- `Infoczytnik`:
  - dodać warunek „tylko pion” (CSS + JS),
  - w poziomie pokazać ekran informacyjny „Obróć urządzenie do pionu”,
  - opcjonalnie próbować `screen.orientation.lock('portrait')` tam, gdzie API działa.
- Pozostałe moduły:
  - pozostawić adaptacyjne (bez globalnego locka orientacji),
  - w razie potrzeby dopracować breakpointy/overflow tam, gdzie testy mobilne wykażą problemy.

---

## 3) Kluczowe decyzje architektoniczne

1. **Jedno PWA dla całego repo** (zalecane):
   - Plus: jedna instalacja, jeden punkt wejścia (`Main`), wspólny cache.
   - Minus: większy SW i potrzeba ostrożnego versioningu cache.

2. **Strategia cache**:
   - App shell (`Main`, wspólne CSS/JS): `cache-first`.
   - Dane dynamiczne (`data.json`, Firebase): `network-first` lub `stale-while-revalidate`.
   - Zasoby zewnętrzne (CDN, Firebase SDK): bez pełnego gwarantowanego offline.

3. **URL i scope na GitHub Pages**:
   - konieczne ustawienie `start_url`/`scope` zgodnie z docelowym adresem repo (`/WrathAndGlory/...`),
   - niespójności ścieżek względnych/absolutnych trzeba ujednolicić, by nawigacja zainstalowanej appki była przewidywalna.

---

## 4) Ryzyka i ograniczenia

1. **Offline „pełny” może być niemożliwy** dla modułów korzystających z Firebase/CDN, jeśli nie przygotujemy fallbacków.
2. **iOS Safari**: ograniczone wsparcie części API PWA (np. lock orientacji bywa ograniczony) — potrzebny fallback UI.
3. **Duże pliki danych** (`DataVault/data.json`) mogą zwiększać pamięć cache i czas pierwszego uruchomienia.
4. **Linki z `target="_blank"`** mogą powodować wyjście poza kontekst standalone; warto rozważyć ich ograniczenie dla kluczowych modułów.

---

## 5) Proponowany plan wdrożenia (kolejność)

1. Dodać manifest + metatagi PWA + rejestrację SW.
2. Ustawić `start_url` na `Main` i poprawny `scope` dla wszystkich modułów.
3. W `Main` wymusić tryb użytkownika dla standalone (strip `admin=1`).
4. Dodać ochronę po stronie modułów (co najmniej `DataVault`, opcjonalnie wszystkie z panelem admina).
5. Dodać ograniczenie orientacji „tylko pion” dla `Infoczytnik` z fallbackiem UI.
6. Przetestować na Android + iOS (instalacja, start, przejścia między modułami, rotacja).

---

## 6) Kryteria akceptacji (DoD)

1. Aplikację da się zainstalować (ikona z `Main/IkonaGlowna.png`).
2. Po uruchomieniu z ikony startuje `Main`.
3. W trybie zainstalowanym nie da się wejść w panel admina przez `?admin=1`.
4. Z poziomu `Main` (widok user) działają moduły użytkownika na mobile (np. `DataVault`, `Kalkulator`).
5. `Infoczytnik` działa wyłącznie w pionie (w poziomie komunikat o obrocie).
6. Pozostałe moduły działają w pionie i poziomie (responsive bez blokady orientacji).

---

## 7) Szacowanie prac

- Przygotowanie PWA shell + SW + manifest: **0.5–1.5 dnia**.
- Ujednolicenie nawigacji i wymuszenie user mode: **0.5–1 dnia**.
- Obsługa orientacji Infoczytnika + fallback: **0.5 dnia**.
- Testy mobilne (Android/iOS): **0.5–1 dnia**.

Łącznie: **~2–4 dni robocze** (w zależności od ilości poprawek responsive w modułach).

---

## 8) Rekomendacja końcowa

Wdrożenie PWA w opisanym zakresie jest **realne i rekomendowane**. Najważniejsze jest poprawne ustawienie `scope/start_url`, wymuszenie trybu użytkownika w standalone oraz osobna logika orientacji tylko dla `Infoczytnik` (bez globalnej blokady orientacji dla całej aplikacji).
